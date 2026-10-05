// Render fixed states of the demo with real GPU WebGL in headless Chrome.
//   (needs puppeteer; set PUPPETEER_PATH / CHROME_PATH if they are not on the default path)
//   node tools/shoot.mjs --out iterations/it01 [--shots poster,assembled,closed,detail] [--w 1122 --h 1402]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const out = path.resolve(root, args.out || 'iterations/latest');
const W = +(args.w || 1122);
const H = +(args.h || 1402);
const port = +(args.port || 8765);
fs.mkdirSync(out, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const f = path.join(root, p === '/' ? 'index.html' : p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(port, r));

const SHOTS = {
  poster: { explode: 1, bloom: 1, time: 1.0 },
  assembled: { explode: 0, bloom: 1, time: 1.0 },
  closed: { explode: 0, bloom: 0, time: 1.0 },
  mid: { explode: 0.5, bloom: 1, time: 1.0 },
  studio: { explode: 1, bloom: 1, time: 1.0, theme: 'studio' },
  studioAssembled: { explode: 0, bloom: 1, time: 1.0, theme: 'studio' },
  hero: { explode: 0, bloom: 1, time: 1.0, bare: true, view: { target: [0.4, -3.2, 0], dist: 72, elev: 14, azim: -8, fov: 20 } },
  heroStudio: { explode: 0, bloom: 1, time: 1.0, theme: 'studio', bare: true, view: { target: [0.4, -3.2, 0], dist: 72, elev: 14, azim: -8, fov: 20 } },
  bloom: { explode: 0, bloom: 1, time: 1.0, bare: true, view: { target: [0.4, 1.8, 0], dist: 62, elev: 14, azim: -8, fov: 20 } },
  budclose: { explode: 0, bloom: 0, time: 1.0, bare: true, view: { target: [0.4, 0.8, 0], dist: 40, elev: 12, azim: -8, fov: 20 } },
  budmid: { explode: 0, bloom: 0.35, time: 1.0, bare: true, view: { target: [0.4, 0.8, 0], dist: 46, elev: 12, azim: -8, fov: 20 } },
  core: { explode: 0, bloom: 1, time: 1.0, bare: true, view: { target: [0, 1.5, 0], dist: 30, elev: 24, azim: -8, fov: 20 } },
  coreWide: { explode: 0, bloom: 1, time: 2.2, bare: true, view: { target: [0, 1.4, 0], dist: 46, elev: 20, azim: -8, fov: 20 } },
  coreExp: { explode: 1, bloom: 1, time: 1.0, bare: true, view: { target: [0, 0.2, 0], dist: 30, elev: 20, azim: -8, fov: 20 } },
  angle: { explode: 1, bloom: 1, time: 1.0, view: { pos: [-45, 18, 88], target: [0.4, -5.9, 0], fov: 20 } },
};
const wanted = (args.shots || 'poster,assembled,closed').split(',');

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist', '--enable-gpu', '--no-sandbox', '--hide-scrollbars', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
const t0 = Date.now();
await page.goto(`http://localhost:${port}/index.html?dpr=1`, { waitUntil: 'load' });
try {
  await page.waitForFunction('window.__flowerReady === true', { timeout: 120000 });
} catch (e) {
  console.log(logs.join('\n'));
  await browser.close();
  server.close();
  throw e;
}
console.log('boot ms', Date.now() - t0);
await page.waitForFunction('document.getElementById("loading")?.classList.contains("done")', { timeout: 60000 });
await new Promise((r) => setTimeout(r, 900));
await page.addStyleTag({ content: '.bare-shot #overlay,.bare-shot .dock,.bare-shot .hint,.bare-shot #readout,.bare-shot .inset-win,.bare-shot .inset-title,.bare-shot .inset-cap{visibility:hidden !important}' });
for (const name of wanted) {
  const spec = SHOTS[name];
  if (!spec) { console.log('unknown shot', name); continue; }
  await page.evaluate((b) => document.documentElement.classList.toggle('bare-shot', !!b), spec.bare);
  const err = await page.evaluate((s) => { try { window.__flower.renderAt(s); return null; } catch (e) { return e.stack; } }, spec);
  if (err) { console.log('render error in', name, err.split('\n').slice(0, 6).join('\n')); continue; }
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  await new Promise((r) => setTimeout(r, 800));
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file, type: 'png' });
  console.log(file);
}
if (args.eval) {
  await page.evaluate((s) => window.__flower.renderAt(s), SHOTS.poster);
  const res = await page.evaluate(`(async()=>JSON.stringify(await (${args.eval})))()`);
  fs.writeFileSync(path.join(out, 'eval.json'), res);
  console.log('eval ->', path.join(out, 'eval.json'));
}
const stats = await page.evaluate(() => window.__flower.stats());
console.log('renderer', JSON.stringify(stats));
const errs = logs.filter((l) => /error|warn|fail/i.test(l));
if (errs.length) console.log('--- console ---\n' + errs.slice(0, 40).join('\n'));
await browser.close();
server.close();
