import fs from 'fs';
import MarkdownIt from 'markdown-it';
// @ts-expect-error
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItHighlightJs from 'markdown-it-highlightjs';
import yaml from 'js-yaml';
import { config } from './config';

const markdownIt = new MarkdownIt({ html: true, linkify: true, typographer: true });
markdownIt.use(MarkdownItFootnote);
markdownIt.use(MarkdownItHighlightJs);

export function parseMarkdownFile(type: string, slug: string, withBody?: boolean) {
  const [, , front, , ...rest] = fs
    .readFileSync(`${config.dataRootDir}/${type}/${slug}.md`, { encoding: 'utf-8' })
    .split(/(^---$)/m);
  const metadata = yaml.safeLoad(front) as PostMetadataParsed;

  if (!withBody) {
    return { ...metadata, type, slug };
  }

  const body = rest.join('');
  const html = markdownIt.render(body).replace(/^<p>(<x-script.+<\/x-script>)<\/p>$/gm, '$1');
  const headline = html.replace(/<[^>]+>|\n/g, '').slice(0, 100);

  return { ...metadata, type, slug, html, headline };
}
