import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {input: {main: resolve(import.meta.dirname, 'index.html')}},
  },
  server: {host: '127.0.0.1', port: 5191, strictPort: true},
});
