import fs from 'fs';
import MarkdownIt from 'markdown-it';
import MarkdownItHighlightJs from 'markdown-it-highlightjs';
import yaml from 'js-yaml';
import { config } from '../../config';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
md.use(MarkdownItHighlightJs);

export const get: Sapper.ServerRoute<{ type: string; slug: string }> = (req, res) => {
  const { type, slug } = req.params;

  try {
    const data = fs.readFileSync(`${config.dataRootDir}/${type}/${slug}.md`, { encoding: 'utf-8' }).split(/(\n--\n)/);
    const metadata = <PostMetadataParsed>yaml.safeLoad(data[0]);
    const body = md.render(data.slice(2).join(''));
    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(
        JSON.stringify({ ...metadata, slug, html: body, headline: data[2].slice(0, 100).replace(/\s+/g, ' ').trim() }),
      );
  } catch (e) {
    if (e.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Not found' }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' }).end();
    }
  }
};
