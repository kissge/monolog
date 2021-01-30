import fs from 'fs';
import yaml from 'js-yaml';
import { config } from '../config';

const entries = [];

(async () => {
  for (const type of await fs.promises.readdir(config.dataRootDir)) {
    for (const filename of await fs.promises.readdir(config.dataRootDir + '/' + type)) {
      if (filename.endsWith('.md')) {
        const body = fs.readFileSync(config.dataRootDir + '/' + type + '/' + filename, { encoding: 'utf-8' });
        const metadata = <PostMetadataParsed>yaml.safeLoad(body.split('\n--\n')[0]);
        entries.push({ ...metadata, type, slug: filename.replace(/\.md$/, '') });
      }
    }
  }

  entries.sort((a, b) => (b.date || 0) - (a.date || 0));
})();

export const get: Sapper.ServerRoute = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(entries));
};
