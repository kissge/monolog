import type { Entity } from '.';

export interface LinkGroup<Attributes> {
  name: string;
  entities: Entity<Attributes>[];
}
