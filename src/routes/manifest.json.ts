import { config } from '../config';

export const get: Sapper.ServerRoute = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(
    JSON.stringify({
      background_color: '#ffffff',
      theme_color: '#333333',
      name: config.title,
      short_name: config.title,
      display: 'minimal-ui',
      start_url: '/',
      icons: [{ src: '/images/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
    }),
  );
};
