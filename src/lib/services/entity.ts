import assert from 'node:assert/strict';
import fs from 'node:fs';
import { block } from '$lib/vendor/marked/src/rules';
import type { Entity, EntityWithBody, FileEntity, HTMLString, LinkGroup, NoteAttributes } from '$lib/@types';
import * as Config from '$lib/config';
import { AutoReload, EntityUtility } from '$lib/utilities';
import ParseService from './parse';

class EntityService {
  protected all = new Map<string, EntityWithBody>();
  protected _groups: LinkGroup<FileEntity>[] = [];

  protected static readonly blockTagsRegExp = new RegExp(
    `<(?:x-script|${(block as unknown as { _tag: string })._tag})[^>]*>`,
    'g',
  );

  constructor() {
    this.initialize();
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
  get<T extends EntityWithBody>(name: string) {
    return this.all.get(name) as T | undefined;
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
    kinds.set('タグ', []);

    for (const entity of firstPass.values()) {
      for (const tag of entity.attributes?.tags ?? []) {
        const urlPath = encodeURI('/mono/' + tag);
        if (!firstPass.has(urlPath)) {
          firstPass.set(urlPath, {
            name: tag,
            kind: 'タグ',
            urlPath,
            body: '' as HTMLString,
            headline: '',
            links: { to: { urlPath, entities: [] }, from: { urlPath, entities: [] }, kind: { urlPath, entities: [] } },
            tags: [],
            source: '',
          });

          kinds.get('タグ')!.push(urlPath);
        }
      }
    }

    ParseService.updateEntities(firstPass.values());

    for (const entity of firstPass.values()) {
      if (entity.attributes?.tags) {
        entity.tags = entity.attributes.tags.map((name) => ({
          name,
          urlPath: encodeURI('/mono/' + name),
        }));
      }
    }
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

      if (file.isDirectory()) {
        yield* this.listEntitiesRecursive(path);
      } else if (file.isFile() && file.name.endsWith('.md')) {
        const name = file.name.slice(0, -3);
        const kind = path.startsWith('notes/') ? 'note' : dirPath?.split('/').slice(1).pop();
        const lastModified = fs.statSync(`${Config.dataRootDir}/${path}`).mtime;
        const source = fs.readFileSync(`${Config.dataRootDir}/${path}`, 'utf-8');
        const urlPath = this.isMono(path) ? '/mono/' + encodeURI(name) : '/' + encodeURI(path.slice(0, -3));

        const { attributes, body } = ParseService.parse(source, urlPath);

        yield {
          name: (attributes as NoteAttributes).title || name,
          kind,
          urlPath: attributes.urlPath || urlPath,
          historyURL: `https://github.com/${Config.dataGitHubRepo}/commits/master/${path}`,
          lastModified,
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

  protected getOrderOnTopPage(entity: Entity) {
    return Config.topTags.findIndex((tag) => entity.attributes?.tags?.includes(tag));
  }
}

export default new EntityService();
