import type { HTMLString } from '.';

export interface Entity<Attributes = EntityAttributes> {
  name: string;
  nameSegmented: string[];
  kind?: string;
  urlPath: string;
  historyURL?: string;
  lastModified?: Date;
  attributes?: Attributes;
  tags: Tag[];
}

export interface EntityWithBody<Attributes = EntityAttributes> extends Entity<Attributes> {
  body: HTMLString;
  headline: string;
  links: Record<LinkCategory, { urlPath: string; entities: Entity[] }>;
}

export interface FileEntity<Attributes = EntityAttributes> extends Entity<Attributes> {
  historyURL: string;
  lastModified: Date;
  attributes: Attributes;
}

export type FileEntityWithBody<Attributes = EntityAttributes> = FileEntity<Attributes> & EntityWithBody<Attributes>;

export type LinkCategory = 'to' | 'from' | 'kind' | `one_hop_${string}`;

export interface EntityAttributes {
  title?: string;
  date?: Date | string;
  tags?: string[];
  lang?: string;

  /** ヘッダ画像のパス、またはURL、またはfalse（非表示） */
  header?: string | false;
  /** 別のブログシステムから移植してきた場合、そのソース */
  from?: string;
  /** ソースのパスから自動生成されるエンドポイントを上書きするパス（スラッシュから始まる文字列） */
  urlPath?: `/${string}`;

  definition?: string;
  url?: string;
  location?: string | string[];
  creator?: string | string[];
}

export const wellKnownAttributes = ['location', 'creator'] as const;

export interface Tag {
  name: string;
  kind: 'tag' | typeof wellKnownAttributes[number];
  urlPath: string;
}
