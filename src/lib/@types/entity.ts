import type { HTMLString } from './brand';

export interface Entity<Attributes = unknown> {
  name: string;
  kind?: string;
  /** Path to source Markdown file, relative to the data root directory */
  sourceFilePath: string;
  urlPath: string;
  historyURL: string;
  lastModified: Date;
  attributes: Attributes;
}

export interface EntityWithBody<Attributes = unknown> extends Entity<Attributes> {
  body: HTMLString;
}
