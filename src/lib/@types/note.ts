import type { EntityAttributes, FileEntity, FileEntityWithBody } from '.';

export type Note = FileEntity<NoteAttributes>;
export type NoteWithBody = FileEntityWithBody<NoteAttributes>;

export interface NoteAttributes extends EntityAttributes {
  title: string;
  date: Date | string;
}
