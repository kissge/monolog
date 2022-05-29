import type { Entity, EntityAttributes, EntityWithBody } from '$lib/@types';
import fs from 'fs';
import { ParseService } from '.';

export function listEntitiesRecursive(rootDirPath: string, maxDepth?: number, dirPath?: string): Generator<Entity>;
export function listEntitiesRecursive(
  rootDirPath: string,
  maxDepth: number,
  dirPath: string | undefined,
  withBody: true,
): Generator<EntityWithBody>;
export function* listEntitiesRecursive(
  rootDirPath: string,
  maxDepth = Infinity,
  dirPath?: string,
  withBody = false,
): Generator<Entity | EntityWithBody> {
  if (maxDepth <= 0) {
    return;
  }

  for (const file of fs.readdirSync(`${rootDirPath}/${dirPath ?? ''}`, { withFileTypes: true })) {
    const path = dirPath ? `${dirPath}/${file.name}` : file.name;

    if (file.isDirectory()) {
      yield* listEntitiesRecursive(rootDirPath, maxDepth - 1, path, withBody as never);
    } else if (dirPath && file.isFile() && file.name.endsWith('.md')) {
      const name = file.name.slice(0, -3);
      const kind = dirPath.split('/').slice(1).pop();
      const lastModified = fs.statSync(`${rootDirPath}/${path}`).mtime;
      const source = fs.readFileSync(`${rootDirPath}/${path}`, 'utf-8');

      if (withBody) {
        yield { name, kind, path, lastModified, ...ParseService.parse<EntityAttributes>(source) };
      } else {
        yield { name, kind, path, lastModified, attributes: ParseService.getAttributes<EntityAttributes>(source) };
      }
    }
  }
}

export function findEntityRecursive(rootDirPath: string, fileName: string, maxDepth = Infinity, dirPath?: string) {
  for (const entity of listEntitiesRecursive(rootDirPath, maxDepth, dirPath, true)) {
    if (entity.name === fileName) {
      return entity;
    }
  }
}
