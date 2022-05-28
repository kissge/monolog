import fs from 'fs';
import type { RequestHandler } from '../[type]/__types/[slug]';
import type { HTMLString, JSON, NoteAttributes } from '$lib/@types';
import Config from '$lib/config';
import { ParseService } from '$lib/services';

export const get: RequestHandler<Body> = ({ params: { type, slug } }) => ({
  body: {
    ...ParseService.parse<NoteAttributes>(fs.readFileSync(`${Config.dataRootDir}/${type}/${slug}.md`, 'utf-8')),
    historyURL: `https://github.com/${Config.dataGitHubRepo}/commits/master/${type}/${slug}.md`,
  },
});

interface Body {
  body: HTMLString;
  attributes: NoteAttributes;
  historyURL: string;
}
export type APIResponse = JSON<Body>;
