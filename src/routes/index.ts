import type { RequestHandler } from './__types/index';
import type { JSON, LinkGroup, Note } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = () => ({
  body: {
    notes: EntityService.notes,
    groups: EntityService.groups,
  },
});

interface Body {
  notes: Note[];
  groups: LinkGroup[];
}
export type APIResponse = JSON<Body>;
