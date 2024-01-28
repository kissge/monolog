import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import monologContentHMR from './src/lib/vite-plugin-monolog-content-hmr';

export default defineConfig({
  plugins: [sveltekit(), monologContentHMR()],
  envDir: process.env.DATA_ROOT_DIR || '.',
});
