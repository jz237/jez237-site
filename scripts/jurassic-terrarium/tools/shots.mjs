// Headless captures of the demo, served straight from the repo through request interception.
//
//   node tools/shots.mjs [--q "cam=hero&time=13"] [--out dir] [--eval "js"] [--wait 4000]
//                        [--size 1600x900] [--name shot] [--swiftshader]
//
// --eval runs in the page after the veil lifts (it may be async and may return JSON).
// Several --q/--name pairs can be given; each is captured in turn in one browser.
import { chromium } from 'playwright';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const ORIGIN = 'http://dino.local';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const all = (k) => args.flatMap((a, i) => (a === k ? [args[i + 1]] : []));
const outDir = opt('--out', join(homedir(), '.cache/jurassic-terrarium/shots'));
mkdirSync(outDir, { recursive: true });
const [W, H] = opt('--size', '1600x900').split('x').map(Number);
const page0 = opt('--page', 'demos/jurassic-terrarium/');
const queries = all('--q');
if (!queries.length) queries.push('');
const names = all('--name');
const evals = all('--eval');
const wait = Number(opt('--wait', '3000'));
const timeout = Number(opt('--timeout', '120000'));

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ktx2': 'image/ktx2', '.wasm': 'application/wasm',
  '.txt': 'text/plain', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
};

const exe = [
  join(homedir(), '.cache/ms-playwright/chromium-1243/chrome-linux64/chrome'),
  join(homedir(), '.cache/ms-playwright/chromium-1228/chrome-linux64/chrome'),
].find(existsSync);

const swift = args.includes('--swiftshader');
const browser = await chromium.launch({
  executablePath: exe,
  headless: true,
  args: swift
    ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
    : ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'],
});
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: Number(opt('--dpr', '1')) });
await ctx.route(`${ORIGIN}/**`, async (route) => {
  let p = decodeURIComponent(new URL(route.request().url()).pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = join(repo, p);
  if (!f.startsWith(repo) || !existsSync(f)) return route.fulfill({ status: 404, body: 'not found' });
  route.fulfill({ status: 200, body: readFileSync(f), contentType: TYPES[extname(f)] || 'application/octet-stream' });
});

const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

for (let i = 0; i < queries.length; i++) {
  const q = queries[i];
  const name = names[i] || `shot${i}`;
  const t0 = Date.now();
  await page.goto(`${ORIGIN}/${page0}${q ? '?' + q : ''}`);
  await page.waitForFunction(() => window.__wg?.ready === true, null, { timeout });
  const tReady = Date.now() - t0;
  await page.waitForTimeout(wait);
  let result;
  const ev = evals[i] ?? evals[0];
  if (ev) result = await page.evaluate(`(async () => { ${ev} })()`);
  await page.waitForTimeout(Number(opt('--settle', '300')));
  const file = join(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(JSON.stringify({ name, file, readyMs: tReady, result }, null, 0));
}
const errs = logs.filter((l) => /error|warn/i.test(l));
if (errs.length) console.log(errs.slice(0, 30).join('\n'));
if (args.includes('--logs')) console.log(logs.join('\n'));
writeFileSync(join(outDir, 'last-logs.txt'), logs.join('\n'));
await browser.close();
