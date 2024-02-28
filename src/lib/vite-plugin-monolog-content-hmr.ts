import type { PluginOption } from 'vite';

/** Content hot module replacer */
export default function monologContentHMR() {
  return {
    name: 'vite-plugin-monolog-content-hmr',
    configureServer(server) {
      server.watcher.add(server.config.env.VITE_DATA_ROOT_DIR);
      console.log('monolog-content-hmr: watching', server.config.env.VITE_DATA_ROOT_DIR);
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(server.config.env.VITE_DATA_ROOT_DIR)) {
        server.hot.send({
          type: 'custom',
          event: 'monolog-content-hmr',
        });
        return [];
      }
    },
  } satisfies PluginOption;
}
