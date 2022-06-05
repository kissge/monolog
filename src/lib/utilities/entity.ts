/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EntityWithBody, Entity, NoteWithBody } from '$lib/@types';

export function strip<Attributes>({
  body,
  links,
  headline,
  source,
  ...entityWithoutBody
}: EntityWithBody<Attributes> & { source?: string }): Entity<Attributes> {
  return entityWithoutBody;
}

export function isNote(entity: EntityWithBody): entity is NoteWithBody {
  return entity.kind === 'note';
}
