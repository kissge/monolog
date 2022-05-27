import fs from 'fs';
import type { RequestHandler } from '../[type]/__types/[slug]';
import type { HTMLString, JSON, NoteAttributes } from '$lib/@types';
import Config from '$lib/config';
import { ParseService } from '$lib/services';

export const get: RequestHandler<Body> = ({ params: { type, slug } }) => ({
  body: ParseService.parse<NoteAttributes>(fs.readFileSync(`${Config.dataRootDir}/${type}/${slug}.md`, 'utf-8')),
});

interface Body {
  body: HTMLString;
  attributes: NoteAttributes;
}
export type APIResponse = JSON<Body>;
