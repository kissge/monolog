import type { EntityAttributes, EntityGroup, EntityWithBody } from '$lib/@types';
import fs from 'fs';
import * as ParseService from './parse'; // TODO: ??
import config, { type Config } from '$lib/config';
import { AutoReload } from '$lib/utilities';

class EntityService {
  protected all = new Map<string, EntityWithBody>();
  protected _groups: EntityGroup[] = [];

  constructor(private config: Config) {
    this.initialize();
  }

  @AutoReload()
  get groups() {
    return this._groups;
  }

  initialize() {
    const firstPass = new Map<string, EntityWithBody & { source: string }>();
    const groups: { name: string; entityNames: string[] }[] = [];

    // 1st pass
    for (const entity of this.listEntitiesRecursive()) {
      if (/^\d+[._-]/.test(entity.path) && !/(?:\/.*){3}/.test(entity.path)) {
        firstPass.set(entity.name, entity);

        const [, prefix, name] = entity.path.match(/^(\d+)[._-]([^/]+)/)!;
        const order = Number.parseInt(prefix);

        (groups[order] ??= { name, entityNames: [] }).entityNames.push(entity.name);
      }
    }

    // 2nd pass
    ParseService.updateEntityNames(Array.from(firstPass.keys()));
    this.all = new Map(
      Array.from(firstPass.entries()).map(([name, { source, ...entity }]) => [
        name,
        { ...entity, body: ParseService.parse(source).body },
      ]),
    );

    this._groups = groups
      .filter((group) => group)
      .map(({ name, entityNames }) => ({
        name,
        entities: entityNames
          .map((name) => this.all.get(name)!)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ body, ...entity }) => entity)
          .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()),
      }));
  }

  protected *listEntitiesRecursive(dirPath?: string): Generator<EntityWithBody & { source: string }> {
    for (const file of fs.readdirSync(`${this.config.dataRootDir}/${dirPath ?? ''}`, { withFileTypes: true })) {
      const path = dirPath ? `${dirPath}/${file.name}` : file.name;

      if (file.isDirectory()) {
        yield* this.listEntitiesRecursive(path);
      } else if (dirPath && file.isFile() && file.name.endsWith('.md')) {
        const name = file.name.slice(0, -3);
        const kind = dirPath.split('/').slice(1).pop();
        const lastModified = fs.statSync(`${this.config.dataRootDir}/${path}`).mtime;
        const source = fs.readFileSync(`${this.config.dataRootDir}/${path}`, 'utf-8');

        yield { name, kind, path, lastModified, ...ParseService.parse<EntityAttributes>(source), source };
      }
    }
  }

  @AutoReload()
  get(name: string) {
    return this.all.get(name);
  }

  @AutoReload()
  parse<Attributes>(source: string) {
    return ParseService.parse<Attributes>(source);
  }
}

const entityService = new EntityService(config);
export default entityService;
