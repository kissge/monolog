import fs from 'fs';
import { config } from '../config';
import { parseMarkdownFile } from '../parse';

const entries: (PostMetadataParsed & { type: string; slug: string })[] = [];

console.debug('Loading posts...');

for (const type of fs.readdirSync(config.dataRootDir)) {
  if (fs.lstatSync(config.dataRootDir + '/' + type).isDirectory()) {
    for (const filename of fs.readdirSync(config.dataRootDir + '/' + type)) {
      if (filename.endsWith('.md')) {
        entries.push(parseMarkdownFile(type, filename.slice(0, -3)));
      }
    }
  }
}

entries.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

export const get: Sapper.ServerRoute = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(entries));
};
