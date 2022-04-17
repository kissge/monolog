import fs from 'fs';
import { config } from '../config';
import { parseMarkdownFile } from '../parse';
import { debugPrint } from '../utility';

const entries: (PostMetadataParsed & { type: string; slug: string })[] = [];

(async () => {
  console.debug('Loading posts...');

  for (const type of await fs.promises.readdir(config.dataRootDir)) {
    if ((await fs.promises.lstat(config.dataRootDir + '/' + type)).isDirectory()) {
      for (const filename of await fs.promises.readdir(config.dataRootDir + '/' + type)) {
        if (filename.endsWith('.md')) {
          entries.push(parseMarkdownFile(type, filename.slice(0, -3)));
        }
      }
    }
  }

  entries.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  [
    { t: 'head', entries: entries.slice(0, 2) },
    { t: 'tail', entries: entries.slice(-2) },
  ].forEach(({ t, entries }) => {
    console.log(t);
    entries.forEach((entry) => console.log(debugPrint(entry, null, 2)));
  });
})();

export const get: Sapper.ServerRoute = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(entries));
};
