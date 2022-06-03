import type { RequestHandler } from './__types/[...note]';
import type { JSON, NoteWithBody } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = ({ url }) => {
  const entity = EntityService.get<NoteWithBody>(url.pathname);

  return entity ? { body: { entity } } : { status: 404 };
};

interface Body {
  entity: NoteWithBody;
}
export type APIResponse = JSON<Body>;
