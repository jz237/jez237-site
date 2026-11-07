// Contact sheets of every model in js/models.js (dev/models.html) + an optional ?test=1 smoke run of the game.
// Serves the repo root itself (no-cache, port 8796), drives headless Edge with Playwright, writes PNGs, shuts down.
//   node scripts/shock-horror/models_sheet.mjs [outDir=D:/Projects/.tmp/shock-horror-models] [sheets=all]
//   GAME=1 also opens index.html?test=1 and reports the self-test + console errors.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = process.argv[2] || 'D:/Projects/.tmp/shock-horror-models';
const ALL = ['creatures', 'figures', 'scream', 'faces', 'faces2', 'props', 'relics', 'bosses', 'far1', 'far2'];
const want = (process.argv[3] || 'all') === 'all' ? ALL : process.argv[3].split(',');
const PORT = Number(process.env.PORT || 8796);
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}/games/2026-11-07/shock-horror/`;
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
let fail = 0;
try {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await ctx.route('**/fonts.g*/**', (r) => r.abort());
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  if (process.env.ORIG_MODELS) await ctx.route('**/shock-horror/js/models.js*', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(process.env.ORIG_MODELS, 'utf8') }));   // A/B against another models.js
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  for (const s of want) {
    errs.length = 0;
    const t0 = Date.now();
    await page.goto(base + 'dev/models.html?sheet=' + s);
    await page.waitForFunction(() => window.__sheet && window.__sheet.done, null, { timeout: 240000 });
    const info = await page.evaluate(() => ({ errors: window.__sheet.errors, ms: window.__sheet.ms, programs: window.__sheet.programs, url: window.__sheet.url() }));
    const file = path.join(OUT, `sheet_${s.replace(/[^a-z0-9]+/gi, "_")}.png`);
    fs.writeFileSync(file, Buffer.from(info.url.split(',')[1], 'base64'));
    const bad = [...info.errors, ...errs.filter((e) => !/favicon|GPU stall|WebGL: INVALID|swiftshader|X3577/i.test(e))];
    if (bad.length) fail++;
    console.log(`${bad.length ? 'FAIL' : 'ok  '} ${s.padEnd(10)} ${file}  ${(info.ms / 1000).toFixed(1)} s build+render, ${info.programs} programs, ${((Date.now() - t0) / 1000).toFixed(0)} s total${bad.length ? '\n   ' + bad.slice(0, 8).join('\n   ') : ''}`);
  }
  await page.close();   // one WebGL page at a time: a second live context can blank the game's frames
  if (process.env.SHOTS) {
    // in-game frames: every guardian plus a level of each depth (demo autopilot), at the game's own camera
    const g = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage(), gerr = [];
    await g.context().route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    g.on('pageerror', (e) => gerr.push('pageerror: ' + e.message));
    await g.goto(base + 'index.html?fixed&noscores&seed=5');
    await g.waitForFunction(() => window.__gd && window.__gd.G.state === 'title', null, { timeout: 60000 });
    await g.evaluate(() => { const d = document.getElementById('descend'); if (d) d.style.display = 'none'; });
    for (const [d, l, secs] of [[0, 3, 16], [1, 3, 16], [2, 3, 16], [3, 3, 16], [4, 3, 16], [1, 1, 20], [3, 1, 20]]) {
      await g.evaluate(([d, l]) => window.__gd.startCampaign(d, { level: l, auto: 'demo', seed: 3 }), [d, l]);
      await g.evaluate((n) => { window.__gd.tick(Math.max(0, n - 90), 1 / 60, false); window.__gd.tick(Math.min(n, 90)); }, 60 * secs);
      await g.screenshot({ path: path.join(OUT, `game_d${d + 1}_l${l}${process.env.ORIG_MODELS ? '_orig' : ''}.png`) });
      const st = await g.evaluate(() => { const W = window.__gd.W, P = W && W.players[0]; const S = window.__gd.S, h = S && S.h; return P ? { act: S ? S.active.map((a) => a.s && a.s.id) : null, last: S ? S.log.slice(-2).map((q) => q.id + '@' + q.t) : null, fx: h ? Object.fromEntries(Object.entries(h).filter(([k, v]) => typeof v === 'number' && v && k !== 'lampMul')) : null, hp: P.hp, oil: P.oil.toFixed(1), dead: !!P.dead, scr: window.__gd.G.screen, state: window.__gd.G.state } : null; });
      console.log('  d' + (d + 1) + ' l' + l, JSON.stringify(st));
    }
    console.log('in-game frames written' + (gerr.length ? ' (errors: ' + gerr.slice(0, 4).join(' | ') + ')' : ''));
  }
  if (process.env.GAME) {
    const g = await ctx.newPage(), gerr = [];
    g.on('console', (m) => { if (m.type() === 'error') gerr.push(m.text()); });
    g.on('pageerror', (e) => gerr.push('pageerror: ' + e.message));
    await g.goto(base + 'index.html?test=1');
    const ok = await g.waitForFunction(() => window.__gdTests && window.__gdTests.done, null, { timeout: 420000 }).then(() => true, () => false);
    const res = ok ? await g.evaluate(() => window.__gdTests.results) : [];
    for (const t of res) console.log(`${t.ok ? 'PASS' : 'FAIL'}  self-test: ${t.name} (${t.info})`);
    if (!ok) console.log('FAIL  self-test did not finish');
    await g.screenshot({ path: path.join(OUT, 'game_selftest.png') });
    console.log(`game console errors (${gerr.length}):\n   ` + [...new Set(gerr)].slice(0, 12).join('\n   '));
  }
} catch (e) { console.error('crashed:', e.stack || e.message); fail++; }
await browser.close();
server.close();
console.log(fail ? `${fail} sheet(s) with errors` : 'all sheets clean');
process.exit(fail ? 1 : 0);
