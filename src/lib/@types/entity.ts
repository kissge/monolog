import type { HTMLString } from '.';

export interface Entity<Attributes = EntityAttributes> {
  name: string;
  kind?: string;
  urlPath: string;
  historyURL: string;
  lastModified: Date;
  attributes: Attributes;
}

export interface EntityWithBody<Attributes = EntityAttributes> extends Entity<Attributes> {
  body: HTMLString;
  headline: string;
  links: Record<LinkCategory, Entity[]>;
}

export type LinkCategory = 'to' | 'from' | 'kind';

export interface EntityAttributes {
  title: string;
  date?: Date;
  tags?: string[];

  /** ヘッダ画像のパス、またはURL、またはfalse（非表示） */
  header?: string | false;
  /** 別のブログシステムから移植してきた場合、そのソース */
  from?: string;

  definition?: string;
}
