#!/usr/bin/env node
// Keeps sitemap.xml in step with the pages that actually exist.
//
//   node scripts/update_sitemap.mjs           report missing and dead entries (exit 1 if any)
//   node scripts/update_sitemap.mjs --write   add missing pages, drop dead entries
//   node scripts/update_sitemap.mjs --write --add-only
//                                             add missing pages only; for partial checkouts
//                                             (CI), where an absent file does not mean a dead page
//
// A page belongs in the sitemap when it is listed in the games arcade
// (games/index.html), the demos catalogue (demos/catalog.json), or is a
// top-level section, a plant page, an experiment or an AI Images page -- and
// it is not a redirect and not marked noindex. Existing entries are left as
// they are (including their lastmod) unless their page is gone or redirects.
import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://jez237.com/';
// Sections that are private, internal, retired or not pages.
const SKIP = new Set(['prototypes', 'samples', 'downloads', 'ops', 'network', 'node_modules', 'scripts', 'workers',
  'functions', 'assets', 'plex', 'openclaw-gmail', 'stock-market-src', 'media', 'data']);

// Pages that Pages Functions serve from packed data; no file exists for them.
const FUNCTION_SERVED = ['experiments/image-gen-2-benchmark/infographics/'];

const read = (path) => readFileSync(join(root, path), 'utf8');
const isDir = (path) => existsSync(join(root, path)) && statSync(join(root, path)).isDirectory();
const dirs = (path) => (isDir(path) ? readdirSync(join(root, path)).filter((name) => isDir(`${path}/${name}`)) : []);

/** The file a sitemap path is served from, or null when there is none. */
export function pageFile(path) {
  const candidates = path === '' || path.endsWith('/') ? [`${path}index.html`] : [path, `${path}.html`, `${path}/index.html`];
  return candidates.find((file) => existsSync(join(root, file)) && statSync(join(root, file)).isFile()) ?? null;
}

/** Why a page should not be listed, or '' when it is fine. */
export function exclusionReason(path) {
  const file = pageFile(path);
  if (!file) return 'missing';
  const head = read(file).slice(0, 8000);
  if (/http-equiv=["']?refresh/i.test(head)) return 'redirect';
  if (/<meta[^>]+noindex/i.test(head)) return 'noindex';
  return '';
}

function candidates() {
  const found = new Set();
  const add = (path) => { if (!SKIP.has(path.split('/')[0])) found.add(path); };
  for (const name of readdirSync(root)) if (existsSync(join(root, name, 'index.html'))) add(`${name}/`);
  for (const section of ['plants', 'experiments']) {
    for (const name of dirs(section)) if (existsSync(join(root, section, name, 'index.html'))) add(`${section}/${name}/`);
  }
  const images = 'experiments/image-gen-2-benchmark';
  for (const name of readdirSync(join(root, images))) {
    if (name.endsWith('.html') && name !== 'index.html') add(`${images}/${name.slice(0, -5)}`);
  }
  for (const demo of JSON.parse(read('demos/catalog.json'))) {
    if (!/^(https?:|\.\.)/.test(demo.url)) add(`demos/${demo.url}`);
  }
  for (const match of read('games/index.html').matchAll(/path:\s*'([^']*)'/g)) {
    // Entries that name a file (source.html and the like) are not landing pages.
    if (!/^(https?:|\.\.)/.test(match[1]) && !match[1].endsWith('.html')) add(`games/${match[1]}`);
  }
  return [...found].sort();
}

function lastModified(file) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {cwd: root, encoding: 'utf8'}).trim();
    if (date) return date;
  } catch { /* fall through to today */ }
  return new Date().toISOString().slice(0, 10);
}

export function plan() {
  const xml = read('sitemap.xml');
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const listedPaths = new Set(listed.filter((url) => url.startsWith(ORIGIN)).map((url) => url.slice(ORIGIN.length)));
  const dead = [...listedPaths].filter((path) => !FUNCTION_SERVED.some((prefix) => path.startsWith(prefix)))
    .map((path) => ({path, reason: exclusionReason(path)}))
    .filter(({reason}) => reason === 'missing' || reason === 'redirect');
  const missing = candidates().filter((path) => !listedPaths.has(path) && !exclusionReason(path));
  return {xml, missing, dead};
}

function main() {
  const write = process.argv.includes('--write');
  const planned = plan();
  const {xml, missing} = planned;
  const dead = process.argv.includes('--add-only') ? [] : planned.dead;
  for (const path of missing) console.log(`missing from sitemap: ${path}`);
  for (const {path, reason} of dead) console.log(`listed but ${reason}: ${path}`);
  if (!missing.length && !dead.length) { console.log('Sitemap is up to date.'); return; }
  if (!write) {
    console.error(`Sitemap needs ${missing.length} addition(s) and ${dead.length} removal(s). Run: node scripts/update_sitemap.mjs --write`);
    process.exitCode = 1;
    return;
  }
  const newline = xml.includes('\r\n') ? '\r\n' : '\n';
  let next = xml;
  for (const {path} of dead) {
    const escaped = (ORIGIN + path).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    next = next.replace(new RegExp(`[ \\t]*<url>(?:(?!</url>)[\\s\\S])*?<loc>${escaped}</loc>[\\s\\S]*?</url>\\r?\\n`), '');
  }
  const additions = missing.map((path) =>
    `  <url><loc>${ORIGIN}${path}</loc><lastmod>${lastModified(pageFile(path))}</lastmod></url>${newline}`).join('');
  const end = next.lastIndexOf('</urlset>');
  writeFileSync(join(root, 'sitemap.xml'), next.slice(0, end) + additions + next.slice(end));
  console.log(`Sitemap updated: ${missing.length} added, ${dead.length} removed.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
