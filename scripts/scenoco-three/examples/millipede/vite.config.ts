import { defineConfig } from 'vite';
import { scenoco } from '@scenoco-three/tools/vite';

// TSX through SceNoCo's own runtime, and — while serving — the editor and what it reads and writes.
// Nothing inlined: jez237.com's CSP refuses fetch() of data: URIs.
export default defineConfig({
  server: { host: true },
  plugins: [scenoco()],
  build: { assetsInlineLimit: 0 },
});
