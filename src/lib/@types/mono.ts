import type { Entity, EntityWithBody } from './entity';

export type Mono = Entity<MonoAttributes>;
export type MonoWithBody = EntityWithBody<MonoAttributes>;

export interface MonoAttributes {
  definition?: string;
  date?: Date;
  tags?: string[];
}

export interface MonoGroup {
  name: string;
  monos: Mono[];
}
