import type { RequestHandler } from '../[type]/__types/[slug]';
import type { JSON, NoteWithBody } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = ({ url }) => {
  const entity = EntityService.get<NoteWithBody>(url.pathname);

  return entity ? { body: entity } : { status: 404 };
};

type Body = NoteWithBody;
export type APIResponse = JSON<Body>;
