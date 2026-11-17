/**
 * Stamp every Anatomy Studio URL with a hash of the file it points at, so cache-busting is never a manual chore.
 *
 *   node stamp.mjs           rewrite the ?v= on every local import, stylesheet, script, JSON fetch and model file
 *   node stamp.mjs --check   change nothing; exit 1 if anything is stale (use before publishing)
 *
 * What gets stamped:
 *   manifest.json            files[].v and files[].hi.v, read by the studio to build the .glb URLs
 *   *.js                     `from './x.js?v=…'` and the fetch() of manifest.json / descriptions.json
 *   index.html, manual.html  stylesheet links and the module script
 *
 * A file's hash covers its own text after its imports were stamped, so a change to a leaf module ripples up to
 * studio.js and index.html. Every importer gets the same ?v= for a module, so no module is ever loaded twice.
 * Run it after `node prepare.mjs` (which rewrites manifest.json) and after any edit under demos/anatomy-studio.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEMO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../demos/anatomy-studio');
const check = process.argv.includes('--check');
// Text is hashed with LF line endings so a Windows checkout (CRLF) and a Linux one stamp the same values.
const hash = data => createHash('sha256').update(typeof data === 'string' ? data.replace(/\r\n/g, '\n') : data).digest('hex').slice(0, 10);
const read = name => readFileSync(path.join(DEMO, name), 'utf8');
const stale = [];

/** Write only when the text changed; in --check mode just record the file. */
function save(name, before, after) {
  if (before === after) return;
  stale.push(name);
  if (!check) writeFileSync(path.join(DEMO, name), after);
}

// ---- 1. model files -> manifest.json
const manifestBefore = read('manifest.json');
const manifest = JSON.parse(manifestBefore);
for (const f of manifest.files) {
  f.v = hash(readFileSync(path.join(DEMO, f.path)));
  if (f.hi) f.hi.v = hash(readFileSync(path.join(DEMO, f.hi.path)));
}
const manifestAfter = JSON.stringify(manifest);
save('manifest.json', manifestBefore, manifestAfter);

// ---- 2. modules, leaves first
const modules = readdirSync(DEMO).filter(n => n.endsWith('.js'));
const IMPORT = /(from\s+['"])\.\/([\w-]+\.js)(?:\?v=[\w-]+)?(['"])/g;
const DATA = /(['"`])\.\/(manifest|descriptions)\.json(?:\?v=[\w-]+)?\1/g;
const text = new Map(modules.map(n => [n, read(n)]));
const deps = new Map(modules.map(n => [n, [...text.get(n).matchAll(IMPORT)].map(m => m[2]).filter(d => text.has(d))]));
const versions = new Map([['manifest.json', hash(manifestAfter)], ['descriptions.json', hash(read('descriptions.json'))]]);

function stamp(name, trail = []) {
  if (versions.has(name)) return versions.get(name);
  if (trail.includes(name)) throw new Error(`import cycle: ${[...trail, name].join(' -> ')}`);
  for (const d of deps.get(name)) stamp(d, [...trail, name]);
  const before = text.get(name);
  const after = before
    .replace(IMPORT, (all, head, file, tail) => (versions.has(file) ? `${head}./${file}?v=${versions.get(file)}${tail}` : all))
    .replace(DATA, (all, quote, file) => `${quote}./${file}.json?v=${versions.get(`${file}.json`)}${quote}`);
  save(name, before, after);
  versions.set(name, hash(after));
  return versions.get(name);
}
for (const name of modules) stamp(name);

// ---- 3. pages
for (const name of readdirSync(DEMO).filter(n => n.endsWith('.css'))) versions.set(name, hash(read(name)));
const ASSET = /((?:href|src)=")([\w-]+\.(?:css|js))(?:\?v=[\w-]+)?(")/g;
for (const page of ['index.html', 'manual.html']) {
  const before = read(page);
  save(page, before, before.replace(ASSET, (all, head, file, tail) => (versions.has(file) ? `${head}${file}?v=${versions.get(file)}${tail}` : all)));
}

if (check) {
  if (stale.length) { console.error(`Stale version stamps in: ${stale.join(', ')}\nRun: node scripts/anatomy-studio/stamp.mjs`); process.exit(1); }
  console.log('Version stamps are up to date.');
} else {
  console.log(stale.length ? `Stamped ${stale.length} file(s): ${stale.join(', ')}` : 'Nothing to stamp; everything is up to date.');
}
