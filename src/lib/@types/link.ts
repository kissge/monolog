import type { Entity, EntityAttributes } from '.';

export interface LinkGroup<Attributes = EntityAttributes> {
  name: string;
  entities: Entity<Attributes>[];
}
