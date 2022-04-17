import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }) as any /** ????? */,
    sirv('static', { dev }),
    sapper.middleware() as any /** ????? */,
  )
  .listen(PORT);
