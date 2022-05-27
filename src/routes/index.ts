import fs from 'fs';
import type { RequestHandler } from './__types/index';
import type { JSON, NoteAttributes } from '$lib/@types';
import Config from '$lib/config';
import { ParseService } from '$lib/services';

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
  },
});

interface Body {
  notes: {
    slug: string;
    attributes: NoteAttributes;
  }[];
}
export type APIResponse = JSON<Body>;
