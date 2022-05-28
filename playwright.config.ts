import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'yarn build && yarn preview --port=3333',
    port: 3333,
  },
};

export default config;
