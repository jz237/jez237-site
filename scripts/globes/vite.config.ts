import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/** The betta's textures' host (betta-atelier/src/fish.js), whose CORS lets only jez237.com read
 *  them: in development the dev server fetches them for the page. */
const MEDIA = 'https://media.jez237.com/';

const mediaThroughDevServer: Plugin = {
  name: 'betta-media-through-dev-server',
  apply: 'serve',
  transform(code, id) {
    if (id.replaceAll('\\', '/').endsWith('betta-atelier/src/fish.js')) return code.replaceAll(MEDIA, '/__media/');
  },
};

/** The betta bowl's page, built on its own, is its folder's index.html. */
const bettaPageAsIndex: Plugin = {
  name: 'betta-page-as-index',
  enforce: 'post',
  generateBundle(_, bundle) {
    const page = bundle['betta.html'];
    if (page) page.fileName = 'index.html';
  },
};

/** The betta bowl's page starts its furnishings' worker as it is read (betta.html): it is given
 *  the worker's file, whose name the build makes. (In development there is none to give: the
 *  page's script starts the worker itself.) */
const bettaWorkerFromPage: Plugin = {
  name: 'betta-worker-from-page',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const worker = Object.keys(ctx.bundle ?? {}).find((f) => /(^|\/)scapeWorker-[\w-]+\.js$/.test(f));
      return html.replace('__SCAPE_WORKER__', worker ? `./${worker}` : '');
    },
  },
};

// Relative base so the built app also loads from file:// inside Electron. `--mode betta` builds
// the betta bowl's page on its own (betta.html, as dist-betta/index.html): a folder that stands
// alone, for jez237.com/demos/betta-bowl/.
export default defineConfig(({ mode }) => ({
  base: './',
  resolve: { dedupe: ['three'] },
  server: { proxy: { '/__media/': { target: MEDIA, changeOrigin: true, rewrite: (p) => p.replace(/^\/__media\//, '/') } } },
  plugins: [mediaThroughDevServer, bettaWorkerFromPage, ...(mode === 'betta' ? [bettaPageAsIndex] : [])],
  ...(mode === 'betta' ? { build: { outDir: 'dist-betta', rollupOptions: { input: resolve(import.meta.dirname, 'betta.html') } } } : {}),
}));
