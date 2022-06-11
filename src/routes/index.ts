import type { RequestHandler } from './__types/index';
import type { Entity, FileEntity, JSON, LinkGroup, Note } from '$lib/@types';
import { EntityService } from '$lib/services';

export const get: RequestHandler<Body> = () => ({
  body: {
    notes: EntityService.notes,
    groups: EntityService.groups,
    tags: EntityService.tags,
  },
});

interface Body {
  notes: Note[];
  groups: LinkGroup<FileEntity>[];
  tags: Entity[];
}
export type APIResponse = JSON<Body>;
