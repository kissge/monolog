/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Entity, EntityWithBody, FileEntity, FileEntityWithBody, Note, NoteWithBody } from '$lib/@types';

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

/** 1. pinned > pinnedでない、2. 日付がない > 日付が未来 > 日付が過去 の順でソートするための比較値を返す */
export function compare(a: Entity, b: Entity) {
  if (a.attributes?.pinned !== b.attributes?.pinned) {
    return a.attributes?.pinned ? -1 : 1;
  }

  const ad = a.attributes?.date ?? a.lastModified;
  const bd = b.attributes?.date ?? b.lastModified;

  return !ad && !bd ? 0 : !ad ? -1 : !bd ? 1 : new Date(bd).getTime() - new Date(ad).getTime();
}

export function getOneHopCategoryName(name: string): `one_hop_${string}` {
  return `one_hop_${name}`;
}
