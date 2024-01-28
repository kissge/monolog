import type { ModuleNode, PluginOption } from 'vite';

/** Experimental content hot module reloader (which is causing full-reload actually) */
export default function monologContentHMR() {
  return {
    name: 'vite-plugin-monolog-content-hmr',
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.md')) {
        return [dummyModuleNode];
      }
    },
  } satisfies PluginOption;
}

const dummyModuleNode = {
  url: '/src/routes/[...entity]/+page.ts',
  importers: new Set(),
} as ModuleNode;
