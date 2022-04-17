import { parseMarkdownFile } from '../../parse';

export const get: Sapper.ServerRoute<{ type: string; slug: string }> = ({ params: { type, slug } }, res) => {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(parseMarkdownFile(type, slug, true)));
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Not found' }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' }).end();
    }
  }
};
