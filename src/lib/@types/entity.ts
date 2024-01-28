import type { HTMLString } from '.';

export interface Entity<Attributes = EntityAttributes> {
  name: string;
  nameSegmented: string[];
  kind: string | undefined;
  urlPath: string;
  historyURL?: string;
  lastModified?: Date;
  attributes?: Attributes;
  tags: Tag[];
  isEmpty: boolean;
}

export interface EntityLinks<Attributes = EntityAttributes, T extends Entity<Attributes> = Entity<Attributes>> {
  /** タグへのリンク一覧の中で自明なタグを省略するためにリンク先情報が必要 */
  urlPath: string;
  entities: T[];
}

export interface EntityWithBody<Attributes = EntityAttributes, LinkedEntityAttributes = EntityAttributes>
  extends Entity<Attributes> {
  body: HTMLString;
  headline: string;
  links: Partial<Record<LinkCategory, EntityLinks<LinkedEntityAttributes>>>;
}

export type EntityWithDate<Attributes = EntityAttributes> = Entity<Attributes> & {
  attributes: { date: string | Date };
};

export interface FileEntity<Attributes = EntityAttributes> extends Entity<Attributes> {
  historyURL: string;
  lastModified: Date;
  attributes: Attributes;
}

export type FileEntityWithBody<Attributes = EntityAttributes> = FileEntity<Attributes> & EntityWithBody<Attributes>;

export type LinkCategory = 'to' | 'from' | 'kind' | 'is_a' | `one_hop_${string}`;

export interface EntityAttributes {
  title?: string;
  date?: Date | string;
  tags?: string[];
  lang?: string;
  slides?: boolean;

  /** 外部サイトへのリンクの場合、URL */
  external?: string;

  /** ヘッダ画像のパス、またはURL、またはfalse（非表示） */
  header?: string | false;
  /** 別のブログシステムから移植してきた場合、そのソース */
  from?: string;
  /** ソースのパスから自動生成されるエンドポイントを上書きするパス（スラッシュから始まる文字列） */
  urlPath?: `/${string}`;
  /** リスト上で優先的に表示する場合true */
  pinned?: boolean;

  definition?: string;
  url?: string;
  location?: string | string[];
  creator?: string | string[];
}

export const wellKnownAttributes = ['location', 'creator'] as const;

export interface Tag {
  name: string;
  kind: 'tag' | (typeof wellKnownAttributes)[number];
  urlPath: string;
}

export interface LinkGroup<Attributes = EntityAttributes, T extends Entity<Attributes> = Entity<Attributes>>
  extends EntityLinks<Attributes, T> {
  name: string;
}
