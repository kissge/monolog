import assert from 'node:assert/strict';
import fs from 'node:fs';
import type { EntityWithBody, LinkGroup, MonoAttributes, MonoWithBody, NoteAttributes } from '$lib/@types';
import config, { type Config } from '$lib/config';
import { AutoReload, EntityUtility } from '$lib/utilities';
import ParseService from './parse';

class EntityService {
  protected all = new Map<string, EntityWithBody>();
  protected _groups: LinkGroup<MonoAttributes>[] = [];

  constructor(private config: Config) {
    this.initialize();
  }

  @AutoReload()
  get groups() {
    return this._groups;
  }

  @AutoReload()
  get notes() {
    return (
      (Array.from(this.all.values()) as EntityWithBody<NoteAttributes>[])
        .filter(({ sourceFilePath }) => sourceFilePath.startsWith('notes/'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ body, ...note }) => note)
        .sort((a, b) => b.attributes.date.getTime() - a.attributes.date.getTime())
    );
  }

  initialize() {
    const firstPass = new Map<string, EntityWithBody & { source: string }>();
    const groups: { name: string; urlPaths: string[] }[] = [];
    const seenNames = new Set<string>();
    const kinds = new Map<string, string[]>();

    // 1st pass
    for (const entity of this.listEntitiesRecursive()) {
      firstPass.set(entity.urlPath, entity);

      assert.equal(seenNames.has(entity.name), false, `Duplicate entity name: ${entity.name}`);
      seenNames.add(entity.name);

      if (entity.kind) {
        if (!kinds.has(entity.kind)) {
          kinds.set(entity.kind, []);
        }

        kinds.get(entity.kind)!.push(entity.urlPath);
      }

      if (this.isShownOnTopPage(entity.sourceFilePath)) {
        const [, prefix, name] = entity.sourceFilePath.match(/^(\d+)[._-]([^/]+)/)!;
        const order = Number.parseInt(prefix);

        (groups[order] ??= { name, urlPaths: [] }).urlPaths.push(entity.urlPath);
      }
    }

    // 2nd pass
    ParseService.updateEntities(firstPass.values());
    this.all = new Map(
      Array.from(firstPass.entries()).map(([urlPath, { source, ...entity }]) => {
        const { body, links } = ParseService.parse(source);

        return [
          urlPath,
          {
            ...entity,
            body,
            links: {
              to: Array.from(links, (urlPath) => EntityUtility.strip(firstPass.get(urlPath)!)),
              from: [],
              kind:
                entity.kind && entity.kind !== 'note'
                  ? kinds
                      .get(entity.kind)!
                      .filter((x) => x !== urlPath)
                      .map((urlPath) => EntityUtility.strip(firstPass.get(urlPath)!))
                  : [],
            },
          },
        ];
      }),
    );

    // 3rd pass
    for (const fromEntity of this.all.values()) {
      fromEntity.links.to.forEach((to) => {
        const toEntity = this.all.get(to.urlPath)!;
        if (!toEntity.links.from.some(({ urlPath }) => urlPath === fromEntity.urlPath)) {
          toEntity.links.from.push(EntityUtility.strip(fromEntity));
        }
      });
    }

    this._groups = groups
      .filter((group) => group)
      .map(({ name, urlPaths }) => ({
        name,
        entities: urlPaths
          .map((urlPath) => this.get<MonoWithBody>(urlPath)!)
          .map(EntityUtility.strip)
          .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()),
      }));
  }

  @AutoReload()
  get<T extends EntityWithBody<unknown>>(name: string) {
    return this.all.get(name) as T | undefined;
  }

  protected *listEntitiesRecursive(dirPath?: string): Generator<EntityWithBody & { source: string }> {
    for (const file of fs.readdirSync(`${this.config.dataRootDir}/${dirPath ?? ''}`, { withFileTypes: true })) {
      const path = dirPath ? `${dirPath}/${file.name}` : file.name;

      if (file.isDirectory()) {
        yield* this.listEntitiesRecursive(path);
      } else if (dirPath && file.isFile() && file.name.endsWith('.md')) {
        const name = file.name.slice(0, -3);
        const kind = path.startsWith('notes/') ? 'note' : dirPath.split('/').slice(1).pop();
        const lastModified = fs.statSync(`${this.config.dataRootDir}/${path}`).mtime;
        const source = fs.readFileSync(`${this.config.dataRootDir}/${path}`, 'utf-8');
        const urlPath = this.isMono(path) ? '/mono/' + encodeURI(name) : '/' + encodeURI(path.slice(0, -3));

        yield {
          name,
          kind,
          sourceFilePath: path,
          urlPath,
          historyURL: `https://github.com/${this.config.dataGitHubRepo}/commits/master/${path}`,
          lastModified,
          ...ParseService.parse(source),
          links: { to: [], from: [], kind: [] },
          source,
        };
      }
    }
  }

  protected isMono(path: string) {
    return /^\d+[._-]/.test(path);
  }

  protected isShownOnTopPage(path: string) {
    return this.isMono(path) && !new RegExp(`(?:/.*){${this.config.maxDepthForTopPage + 1}}`).test(path);
  }
}

const entityService = new EntityService(config);
export default entityService;
