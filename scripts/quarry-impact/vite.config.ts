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
          // Keep immutable terrain data cached when gameplay/UI code changes.
          terrain: [
            './src/quarry-extension-collision.json', './src/quarry-west-wall-collision.json',
            './src/quarry-cut-collision.json', './src/quarry-headwall-collision.json',
            './src/quarry-east-bay-collision.json', './src/quarry-roadside-data.json',
            './src/quarry-rock-hulls.json', './src/quarry-north-forest.json',
          ],
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
