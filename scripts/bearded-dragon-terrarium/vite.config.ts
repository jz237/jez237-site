import {defineConfig} from 'vite';
export default defineConfig({base: './', build: {outDir: 'dist', assetsInlineLimit: 0, chunkSizeWarningLimit: 1200}, server: {host: '127.0.0.1', port: 5192, strictPort: true}});
