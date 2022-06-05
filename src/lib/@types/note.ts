import type { Entity, EntityAttributes, EntityWithBody } from '.';

export type Note = Entity<NoteAttributes>;
export type NoteWithBody = EntityWithBody<NoteAttributes>;

export interface NoteAttributes extends EntityAttributes {
  date: Date;
}
