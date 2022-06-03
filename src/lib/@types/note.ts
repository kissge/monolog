import type { Entity, EntityAttributes } from '.';

export type Note = Entity<NoteAttributes>;

export interface NoteAttributes extends EntityAttributes {
  date: Date;
}
