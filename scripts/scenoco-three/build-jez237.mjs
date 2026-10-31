// Build the two vendored SceNoCo examples into the site's games folder, page-relative.
// assetsInlineLimit 0: the site's CSP blocks fetch() of data: URIs, so no asset may be inlined.
// Usage: node scenoco_build.mjs <scripts/scenoco-three> <site root>
import { join } from 'node:path';
import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const [root, site] = process.argv.slice(2);
const require = createRequire(join(root, 'package.json'));
const { build } = await import(require.resolve('vite'));
for (const [name, out] of [['breakout', 'games/2026-10-31/scenoco-breakout'], ['td', 'games/2026-10-31/tiny-bastion']]) {
  await build({ root: join(root, 'examples', name), base: './', logLevel: 'warn', build: { outDir: join(site, out), emptyOutDir: true, assetsInlineLimit: 0 } });
  copyFileSync(join(root, 'LICENSE'), join(site, out, 'LICENSE.txt'));
  console.log('built', name, '->', out);
}
