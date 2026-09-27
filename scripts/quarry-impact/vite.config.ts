import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2400,
    rollupOptions: {
      output: {
        manualChunks: {
          physics: ['@dimforge/rapier3d-compat'],
          graphics: ['three'],
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 8795,
    watch: {
      ignored: ['**/public/**', '**/source/**'],
      usePolling: true,
      interval: 700,
    },
  },
});
