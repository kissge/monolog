import fs from 'fs';
import yaml from 'js-yaml';

const entries = [];

(async () => {
  for (const type of await fs.promises.readdir(process.env.DATA_ROOT)) {
    for (const filename of await fs.promises.readdir(process.env.DATA_ROOT + '/' + type)) {
      const body = fs.readFileSync(process.env.DATA_ROOT + '/' + type + '/' + filename, { encoding: 'utf-8' });
      const metadata = <{ title: string | undefined }>yaml.safeLoad(body.split('\n--\n')[0]);
      entries.push({ type, slug: filename.replace(/\.md$/, ''), title: metadata.title || filename });
    }
  }
  // const body = fs.readFileSync(`${process.env.DATA_ROOT}/${type}/${slug}.md`, { encoding: 'utf-8' });
})();

export const get: Sapper.ServerRoute = (_, res) => {
  res
    .writeHead(200, {
      'Content-Type': 'application/json',
    })
    .end(JSON.stringify(entries));
};
