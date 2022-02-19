import fs from 'fs';
import yaml from 'js-yaml';
import { config } from '../config';

const entries = [];

(async () => {
  console.debug('Loading posts...');

  for (const type of await fs.promises.readdir(config.dataRootDir)) {
    console.debug('type =', type);

    if (!(await fs.promises.lstat(config.dataRootDir + '/' + type)).isDirectory()) {
      continue;
    }

    for (const filename of await fs.promises.readdir(config.dataRootDir + '/' + type)) {
      if (filename.endsWith('.md')) {
        const body = fs.readFileSync(config.dataRootDir + '/' + type + '/' + filename, { encoding: 'utf-8' });
        const metadata = <PostMetadataParsed>yaml.safeLoad(body.split('\n--\n')[0]);
        entries.push({ ...metadata, type, slug: filename.replace(/\.md$/, '') });

        console.debug(filename + ': ' + JSON.stringify(metadata));
      }
    }
  }

  entries.sort((a, b) => (b.date || 0) - (a.date || 0));

  console.debug(entries);
})();

export const get: Sapper.ServerRoute = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(entries));
};
