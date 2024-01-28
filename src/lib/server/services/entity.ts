import assert from 'node:assert/strict';
import fs from 'node:fs';
import childProcess from 'node:child_process';
import { dev } from '$app/environment';
import ParseService from './parse';
import SegmentService from './segment';
import { block } from './parse/marked';
import type {
  Entity,
  EntityAttributes,
  EntityWithBody,
  EntityWithDate,
  FileEntity,
  HTMLString,
  LinkCategory,
  LinkGroup,
  Tag,
} from '$lib/@types';
import { wellKnownAttributes } from '$lib/@types';
import * as Config from '$lib/config';
import { AutoReloadUtility, EntityUtility } from '$lib/utilities';

class EntityService extends AutoReloadUtility.AutoReloadable {
  #all!: Map<string, EntityWithBody>;
  #groups!: LinkGroup<EntityAttributes, FileEntity>[];

  protected static readonly blockTagsRegExp = new RegExp(`<(?:x-script|${block._tag})[^>]*>`, 'g');

  static readonly autoReloadTargets = [
    'allPaths',
    'groups',
    'notes',
    'tags',
    'timeline',
    'get',
  ] satisfies (keyof EntityService)[];

  get allPaths() {
    return Array.from(this.#all.keys());
  }

  get groups() {
    return this.#groups;
  }

  get notes() {
    return Array.from(this.#all.values())
      .filter(EntityUtility.isNote)
      .map(EntityUtility.strip)
      .sort(EntityUtility.compare);
  }

  get tags() {
    return Array.from(this.#all.values())
      .filter(({ kind }) => kind === 'tag')
      .sort(
        (a, b) =>
          (Config.topTags.some((name) => name === a.name) ? 1 : 0) -
            (Config.topTags.some((name) => name === b.name) ? 1 : 0) ||
          (b.links.from?.entities.length ?? 0) - (a.links.from?.entities.length ?? 0),
      )
      .map<Entity>(EntityUtility.strip);
  }

  get timeline() {
    return Array.from(this.#all.values())
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

    this.#all = all2;
    this.#groups = Config.topTags
      .map((name) => ({
        name,
        entities: all2
          .get(encodeURI('/mono/' + name))
          ?.links.from?.entities.filter(({ tags }) => tags.some((tag) => tag.name === name)),
      }))
      .filter((group): group is LinkGroup<EntityAttributes, FileEntity> => !!group.entities?.length);
  }

  get(urlPath: string) {
    return this.#all.get(urlPath);
  }

  /** 1st pass: allとkindsをリストアップし、重複チェックするところまで */
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

    const kindMonos = [];
    for (const [kind, kindEntities] of kinds.entries()) {
      if (kind === 'note' || kind === 'pages') {
        continue;
      }

      const urlPath = encodeURI('/mono/' + kind);
      if (!all.has(urlPath)) {
        all.set(urlPath, {
          name: kind,
          nameSegmented: SegmentService.segment(kind),
          kind: 'kind' as const,
          urlPath,
          body: '' as HTMLString,
          headline: '',
          links: {
            is_a: {
              urlPath,
              entities: kindEntities.map((urlPath) => all.get(urlPath)!).sort(EntityUtility.compare),
            },
          },
          tags: [],
          source: '',
          isEmpty: true,
        });
        kindMonos.push(urlPath);
      }
    }

    if (kindMonos.length > 0) {
      kinds.set('kind', kindMonos);
    }

    return { all, kinds };
  }

  /** 2nd: tagsをセットし、tagをentityに追加するところまで */
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
            links: {},
            tags: [],
            source: '',
            isEmpty: true,
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

  /** 3rd: toリンク、kindリンクをつけるところまで */
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
        entity.links.to = {
          urlPath,
          entities: Array.from(links, (urlPath) => firstPass.get(urlPath)!).sort(EntityUtility.compare),
        };
        if (entity.kind && entity.kind !== 'note' && entity.kind !== 'pages') {
          entity.links.kind = {
            urlPath,
            entities: kinds
              .get(entity.kind)!
              .filter((x) => x !== urlPath)
              .map((urlPath) => firstPass.get(urlPath)!)
              .sort(EntityUtility.compare),
          };
        }

        return [urlPath, entity];
      }),
    );
  }

  /** 4th: fromリンク、1-hopリンクをつけて、リンクの重複を除去し、stripして完成 */
  protected initialize4thPass(all: Map<string, EntityWithBody>) {
    const linksFrom = new Map<string, string[]>();

    for (const fromEntity of all.values()) {
      fromEntity.links.to?.entities.forEach((to) => {
        const toEntity = all.get(to.urlPath)!;
        if (!toEntity.links.from?.entities.some(({ urlPath }) => urlPath === fromEntity.urlPath)) {
          (toEntity.links.from ??= {
            urlPath: to.urlPath,
            entities: [],
          }).entities.push(fromEntity);
        }

        if (!linksFrom.has(to.urlPath)) {
          linksFrom.set(to.urlPath, []);
        }

        linksFrom.get(to.urlPath)!.push(fromEntity.urlPath);
      });
    }

    for (const entity of all.values()) {
      const categories: LinkCategory[] = ['to', 'from', 'kind'];

      entity.links.to?.entities.forEach((to) => {
        const category = EntityUtility.getOneHopCategoryName(to.name);
        entity.links[category] = {
          urlPath: to.urlPath,
          entities: linksFrom
            .get(to.urlPath)!
            .filter((urlPath) => urlPath !== entity.urlPath)
            .map((urlPath) => all.get(urlPath)!)
            .sort(EntityUtility.compare),
        };
        categories.push(category);
      });

      entity.links.from?.entities.sort(EntityUtility.compare);

      // Deduplicate links
      const seen = new Set<string>();
      for (const category of categories) {
        const key = entity.links[category]?.entities
          .map(({ urlPath }) => urlPath)
          .sort()
          .join('\n');

        if (!key) {
          continue;
        }

        if (seen.has(key)) {
          entity.links[category]!.entities = [];
        } else {
          seen.add(key);
        }
      }

      // Strip
      for (const links of Object.values(entity.links).filter(Boolean)) {
        links.entities = (links.entities as EntityWithBody[]).map<Entity>(EntityUtility.strip);
      }
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
        const kind = path.startsWith('notes/') ? 'note' : dirPath?.split('/').pop();
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
          links: {},
          source,
          isEmpty: body.trim().length === 0,
        };
      }
    }
  }

  protected isMono(path: string) {
    return path.startsWith('mono/');
  }

  protected getLastModified(path: string) {
    if (!dev) {
      const gitDate = childProcess
        .execSync(`git log -1 --format=%ad --date=iso -- "${path}"`, {
          encoding: 'utf-8',
          cwd: Config.dataRootDir,
        })
        .trim();

      if (gitDate) {
        return new Date(gitDate);
      }
    }

    return fs.statSync(`${Config.dataRootDir}/${path}`).mtime;
  }
}

export default AutoReloadUtility.autoReload(new EntityService());
