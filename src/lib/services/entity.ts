import assert from 'node:assert/strict';
import fs from 'node:fs';
import childProcess from 'node:child_process';
import { dev } from '$app/env';
import ParseService from './parse';
import SegmentService from './segment';
import { block } from '$lib/vendor/marked/src/rules';
import type { Entity, EntityWithBody, EntityWithDate, FileEntity, HTMLString, LinkGroup, Tag } from '$lib/@types';
import { wellKnownAttributes } from '$lib/@types';
import * as Config from '$lib/config';
import { AutoReload, AutoReloadable, EntityUtility } from '$lib/utilities';

class EntityService extends AutoReloadable {
  protected all!: Map<string, EntityWithBody>;
  protected _groups!: LinkGroup<FileEntity>[];

  protected static readonly blockTagsRegExp = new RegExp(
    `<(?:x-script|${(block as unknown as { _tag: string })._tag})[^>]*>`,
    'g',
  );

  @AutoReload()
  get allPaths() {
    return Array.from(this.all.keys());
  }

  @AutoReload()
  get groups() {
    return this._groups;
  }

  @AutoReload()
  get notes() {
    return Array.from(this.all.values())
      .filter(EntityUtility.isNote)
      .map(EntityUtility.strip)
      .sort(EntityUtility.compare);
  }

  @AutoReload()
  get tags() {
    return Array.from(this.all.values())
      .filter(({ kind }) => kind === 'tag')
      .sort(
        (a, b) =>
          (Config.topTags.some((name) => name === a.name) ? 1 : 0) -
            (Config.topTags.some((name) => name === b.name) ? 1 : 0) ||
          b.links.from.entities.length - a.links.from.entities.length,
      )
      .map<Entity>(EntityUtility.strip);
  }

  @AutoReload()
  get timeline() {
    return Array.from(this.all.values())
      .filter((entity) => entity.attributes?.date && new Date(entity.attributes.date).getTime())
      .map((entity) => ({
        ...(EntityUtility.strip(entity) as EntityWithDate),
        age: (new Date(entity.attributes!.date!).getTime() - Config.birthday) / (1000 * 60 * 60 * 24 * 365.25),
      }))
      .sort((a, b) => b.age - a.age)
      .reduce<{ age: number; entities: EntityWithDate[] }[]>((ages, entity) => {
        const age = Math.floor(entity.age);

        if (ages.at(-1)?.age !== age) {
          ages.push({ age, entities: [] });
        }

        ages.at(-1)!.entities.push(entity);

        return ages;
      }, []);
  }

  initialize() {
    const { all, kinds } = this.initialize1stPass();
    this.initialize2ndPass(all, kinds);
    const all2 = this.initialize3rdPass(all, kinds);
    this.initialize4thPass(all2);

    this.all = all2;
    this._groups = Config.topTags
      .map((name) => ({
        name,
        entities: all2
          .get(encodeURI('/mono/' + name))
          ?.links.from.entities.filter(({ tags }) => tags.some((tag) => tag.name === name)),
      }))
      .filter((group): group is LinkGroup<FileEntity> => !!group.entities?.length);
  }

  @AutoReload()
  get(urlPath: string) {
    return this.all.get(urlPath);
  }

  protected initialize1stPass() {
    const all = new Map<string, EntityWithBody & { source: string }>();
    const seenNames = new Set<string>();
    const kinds = new Map<string, string[]>();

    for (const entity of this.listEntitiesRecursive()) {
      all.set(entity.urlPath, entity);

      assert.equal(seenNames.has(entity.name), false, `Duplicate entity name: ${entity.name}`);
      seenNames.add(entity.name);

      if (entity.kind) {
        if (!kinds.has(entity.kind)) {
          kinds.set(entity.kind, []);
        }

        kinds.get(entity.kind)!.push(entity.urlPath);
      }
    }

    return { all, kinds };
  }

  protected initialize2ndPass(
    firstPass: Map<string, EntityWithBody & { source: string }>,
    kinds: Map<string, string[]>,
  ) {
    for (const entity of firstPass.values()) {
      const tags: (Tag[] | undefined)[] = [
        entity.attributes?.tags?.map((name) => ({
          name,
          kind: 'tag',
          urlPath: encodeURI('/mono/' + name),
        })),
        ...wellKnownAttributes.map((kind) => {
          const attr = entity.attributes?.[kind];
          return (typeof attr === 'string' ? [attr] : attr)?.map((name) => ({
            name,
            kind,
            urlPath: encodeURI('/mono/' + name),
          }));
        }),
      ];
      entity.tags = tags.filter((tags): tags is Tag[] => tags != null).flat();

      for (const { name, kind, urlPath } of entity.tags) {
        if (!firstPass.has(urlPath)) {
          firstPass.set(urlPath, {
            name,
            nameSegmented: SegmentService.segment(name),
            kind,
            urlPath,
            body: '' as HTMLString,
            headline: '',
            links: { to: { urlPath, entities: [] }, from: { urlPath, entities: [] }, kind: { urlPath, entities: [] } },
            tags: [],
            source: '',
          });

          if (!kinds.has(kind)) {
            kinds.set(kind, []);
          }

          kinds.get(kind)!.push(urlPath);
        }
      }
    }

    ParseService.updateEntities(firstPass.values());
  }

  protected initialize3rdPass(
    firstPass: Map<string, EntityWithBody & { source: string }>,
    kinds: Map<string, string[]>,
  ) {
    return new Map(
      Array.from(firstPass.entries()).map<[string, EntityWithBody]>(([urlPath, { source, ...entity }]) => {
        const { body, links } = ParseService.parse(source, urlPath);

        for (const { urlPath } of entity.tags) {
          links.add(urlPath);
        }

        links.delete(urlPath);

        entity.body = body;
        entity.links.to.entities = Array.from(links, (urlPath) => EntityUtility.strip(firstPass.get(urlPath)!)).sort(
          EntityUtility.compare,
        );
        if (entity.kind && entity.kind !== 'note') {
          entity.links.kind.entities = kinds
            .get(entity.kind)!
            .filter((x) => x !== urlPath)
            .map((urlPath) => firstPass.get(urlPath)!)
            .map<Entity>(EntityUtility.strip)
            .sort(EntityUtility.compare);
        }

        return [urlPath, entity];
      }),
    );
  }

  protected initialize4thPass(all: Map<string, EntityWithBody>) {
    const linksFrom = new Map<string, string[]>();

    for (const fromEntity of all.values()) {
      fromEntity.links.to.entities.forEach((to) => {
        const toEntity = all.get(to.urlPath)!;
        if (!toEntity.links.from.entities.some(({ urlPath }) => urlPath === fromEntity.urlPath)) {
          toEntity.links.from.entities.push(EntityUtility.strip(fromEntity));
        }

        if (!linksFrom.has(to.urlPath)) {
          linksFrom.set(to.urlPath, []);
        }

        linksFrom.get(to.urlPath)!.push(fromEntity.urlPath);
      });
    }

    for (const entity of all.values()) {
      entity.links.to.entities.forEach((to) => {
        entity.links[EntityUtility.getOneHopCategoryName(to.name)] = {
          urlPath: to.urlPath,
          entities: linksFrom
            .get(to.urlPath)!
            .filter((urlPath) => urlPath !== entity.urlPath)
            .map((urlPath) => all.get(urlPath)!)
            .map<Entity>(EntityUtility.strip)
            .sort(EntityUtility.compare),
        };
      });

      entity.links.from.entities.sort(EntityUtility.compare);
    }
  }

  protected *listEntitiesRecursive(dirPath?: string): Generator<EntityWithBody & { source: string }> {
    for (const file of fs.readdirSync(`${Config.dataRootDir}/${dirPath ?? ''}`, { withFileTypes: true })) {
      const path = dirPath ? `${dirPath}/${file.name}` : file.name;

      if (Config.dataIgnoredFiles.includes(file.name)) {
        continue;
      }

      if (file.isDirectory()) {
        yield* this.listEntitiesRecursive(path);
      } else if (file.isFile() && file.name.endsWith('.md')) {
        const baseName = file.name.slice(0, -3);
        const kind = path.startsWith('notes/') ? 'note' : dirPath?.split('/').slice(1).pop();
        const source = fs.readFileSync(`${Config.dataRootDir}/${path}`, 'utf-8');
        const urlPath = this.isMono(path) ? '/mono/' + encodeURI(baseName) : '/' + encodeURI(path.slice(0, -3));

        const { attributes, body, resolvedUrlPath } = ParseService.parse(source, urlPath);

        const name = attributes.title ?? baseName;

        yield {
          name,
          nameSegmented: SegmentService.segment(name),
          kind,
          urlPath: resolvedUrlPath,
          historyURL: `https://github.com/${Config.dataGitHubRepo}/commits/master/${path}`,
          lastModified: this.getLastModified(path),
          attributes,
          tags: [],
          body,
          headline: body
            .replace(EntityService.blockTagsRegExp, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/(?<=[\w,.])\n/g, ' ')
            .replace(/\n/g, '')
            .trim()
            .slice(0, 512),
          links: { to: { urlPath, entities: [] }, from: { urlPath, entities: [] }, kind: { urlPath, entities: [] } },
          source,
        };
      }
    }
  }

  protected isMono(path: string) {
    return path.startsWith('mono/');
  }

  protected getLastModified(path: string) {
    return dev
      ? fs.statSync(`${Config.dataRootDir}/${path}`).mtime
      : new Date(
          childProcess.execSync(`git log -1 --format=%ad --date=iso -- "${path}"`, {
            encoding: 'utf-8',
            cwd: Config.dataRootDir,
          }),
        );
  }
}

export default new EntityService();
