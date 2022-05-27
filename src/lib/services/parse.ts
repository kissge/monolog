import frontMatter from 'front-matter';
import { marked } from 'marked';
import type { HTMLString } from '$lib/@types';

export function getAttributes<Attributes>(source: string) {
  return frontMatter<Attributes>(source).attributes;
}

export function parse<Attributes>(source: string) {
  const { attributes, body } = frontMatter<Attributes>(source);
  return { attributes, body: marked.parse(body) as HTMLString };
}
