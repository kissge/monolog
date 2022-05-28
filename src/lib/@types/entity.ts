import type { HTMLString } from './brand';

export interface Entity {
  name: string;
  kind: string;
  path: string;
  lastModified: Date;
  attributes: EntityAttributes;
}

export interface EntityAttributes {
  definition?: string;
  date?: Date;
  tags?: string[];
}

export interface EntityWithBody extends Entity {
  body: HTMLString;
}
