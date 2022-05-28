import fs from 'fs';
import type { RequestHandler } from './__types/index';
import type { Entity, JSON, NoteAttributes } from '$lib/@types';
import Config from '$lib/config';
import { EntityService, ParseService } from '$lib/services';

export const get: RequestHandler<Body> = () => ({
  body: {
    notes: fs
      .readdirSync(`${Config.dataRootDir}/notes`)
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => ({
        slug: fileName.slice(0, -3),
        attributes: ParseService.getAttributes<NoteAttributes>(
          fs.readFileSync(`${Config.dataRootDir}/notes/${fileName}`, 'utf-8'),
        ),
      }))
      .sort((a, b) => b.attributes.date.getTime() - a.attributes.date.getTime()),
    groups: fs
      .readdirSync(Config.dataRootDir)
      .filter((group) => /^\d+[._-]/.test(group))
      .map((group) => {
        const [, prefix, name] = group.match(/^(\d+)[._-](.+)$/)!;
        const entities = Array.from(EntityService.listEntitiesRecursive(Config.dataRootDir, 2, group));

        entities.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

        return { order: Number.parseInt(prefix), name, entities };
      })
      .sort((a, b) => a.order - b.order),
  },
});

interface Body {
  notes: {
    slug: string;
    attributes: NoteAttributes;
  }[];
  groups: {
    name: string;
    entities: Entity[];
  }[];
}
export type APIResponse = JSON<Body>;
