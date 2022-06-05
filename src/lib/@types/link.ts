import type { Entity } from '.';

export interface LinkGroup<T extends Entity> {
  name: string;
  urlPath: string;
  entities: T[];
}
