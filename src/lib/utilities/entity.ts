/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EntityWithBody, Entity, FileEntity, FileEntityWithBody, NoteWithBody, Note } from '$lib/@types';

export function strip(entity: EntityWithBody): Entity;
export function strip(entity: FileEntityWithBody): FileEntity;
export function strip(note: NoteWithBody): Note;
export function strip({
  body,
  links,
  headline,
  source,
  ...entityWithoutBody
}: EntityWithBody & { source?: string }): Entity {
  return entityWithoutBody;
}

export function isNote(entity: EntityWithBody): entity is NoteWithBody {
  return entity.kind === 'note';
}
