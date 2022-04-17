import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const original = sapper.middleware();

polka() // You can also use Express
  .use(compression({ threshold: 0 }) as any /** ????? */, sirv('static', { dev }), (req, res, next) => {
    const end = res.end.bind(res);

    original(
      req as any,
      Object.assign(res, {
        end(...args: any[]) {
          return end(
            ...args.map((arg) => (typeof arg === 'string' ? arg.replace(/href="client\//g, 'href="/client/') : arg)),
          );
        },
      }),
      next,
    );
  })
  .listen(PORT);
