// Stamp every module and the stylesheet in index.html with a content hash.
//
// jez237.com serves .js/.css with a 4-hour browser cache (a zone setting that
// overrides _headers), while index.html revalidates on every visit. Without
// stamps a returning visitor gets the new page wired to stale cached modules.
// The import map rewrites each module's URL to `…?v=<hash>`, so a changed file
// gets a new URL and unchanged files stay cached.
//
// It also lists every module the page loads as <link rel="modulepreload">,
// so the browser fetches them all at once instead of discovering them one
// import at a time (on a phone connection the waterfall cost ~1.5 s).
//
// Run after any change to src/ or styles.css, before publishing:
//   node tools/cachebust.mjs
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const hash = (file) => createHash('sha256').update(readFileSync(join(root, file))).digest('hex').slice(0, 10);
const walk = (dir) => readdirSync(join(root, dir)).flatMap((name) => {
  const rel = join(dir, name);
  return statSync(join(root, rel)).isDirectory() ? walk(rel) : rel.endsWith('.js') ? [rel] : [];
});

const imports = {
  three: './vendor/three/build/three.module.js',
  'three/addons/': './vendor/three/addons/',
};
for (const file of walk('src').sort()) imports[`./${file}`] = `./${file}?v=${hash(file)}`;

// the module graph from main.js: src files (stamped) and the vendored three
// files they reach (static imports only)
const resolve = (spec, from) => {
  if (spec === 'three') return 'vendor/three/build/three.module.js';
  if (spec.startsWith('three/addons/')) return 'vendor/three/addons/' + spec.slice('three/addons/'.length);
  if (spec.startsWith('.')) return join(from.split('/').slice(0, -1).join('/'), spec);
  return null;
};
const seen = new Set();
const order = [];
const visit = (file) => {
  if (seen.has(file)) return;
  seen.add(file);
  const src = readFileSync(join(root, file), 'utf8');
  for (const m of src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g)) {
    const r = resolve(m[1] || m[2], file);
    if (r) visit(r);
  }
  order.push(file);
};
visit('src/main.js');
const url = (file) => (file.startsWith('src/') ? imports[`./${file}`] : `./${file}`);
const preload = order.reverse().map((f) => `<link rel="modulepreload" href="${url(f)}" />`).join('\n  ');

const page = join(root, 'index.html');
let html = readFileSync(page, 'utf8');
const map = JSON.stringify({ imports }, null, 2).replace(/\n/g, '\n    ');
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>(\s*<!-- modulepreload -->[\s\S]*?<!-- \/modulepreload -->)?/, `<script type="importmap">\n    ${map}\n  </script>\n  <!-- modulepreload -->\n  ${preload}\n  <!-- /modulepreload -->`);
html = html.replace(/<script type="module" src="(?:\.\/)?src\/main\.js[^"]*"><\/script>/, `<script type="module" src="${imports['./src/main.js']}"></script>`);
html = html.replace(/<link rel="stylesheet" href="(?:\.\/)?styles\.css[^"]*" ?\/?>/, `<link rel="stylesheet" href="./styles.css?v=${hash('styles.css')}">`);
writeFileSync(page, html);
console.log(`stamped ${Object.keys(imports).length - 2} modules and styles.css in ${relative(process.cwd(), page) || page}; ${order.length} modules preloaded`);
