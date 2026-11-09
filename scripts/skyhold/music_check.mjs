// Music layers check (Edge headless, real time): a stage track starts with its drum and lead layers on the same sample
// with the same loop length, the layers stay silent on a quiet start and come in as the fight heats up (a carrier
// fight), and DYNAMIC MUSIC OFF silences them. Scores are never posted (the board is stubbed).
//   node scripts/skyhold/music_check.mjs [baseUrl=http://127.0.0.1:8862/games/2026-11-09/skyhold/]
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('D:/Projects/.tmp/model-s-tools/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8862/games/2026-11-09/skyhold/';
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) { try { fs.mkdirSync(LOCK); break; } catch { if (i > 80) { console.error('lock busy'); process.exit(3); } await sleep(15000); } }
process.on('exit', () => { try { fs.rmdirSync(LOCK); } catch { /* gone */ } });
let fail = 0;
const ok = (c, msg) => { console.log((c ? 'PASS  ' : 'FAIL  ') + msg); if (!c) fail++; return c; };
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  let posts = 0;
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => { if (r.request().method() === 'POST') posts++; r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); });
  const P = await ctx.newPage();
  const errors = [];
  P.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  P.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  P.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(r.status() + ' ' + r.url()); });
  await P.goto(base);
  await P.waitForFunction(() => window.__sh && window.__sh.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 120000 });
  await P.mouse.click(640, 700);
  await P.evaluate(() => window.__sh.A.unlock());
  const gains = () => P.evaluate(() => { const m = window.__sh.A.music; return m && m.layers ? { name: m.name, n: m.layers.length, d: +m.layers[0].g.gain.value.toFixed(3), l: +(m.layers[1] ? m.layers[1].g.gain.value : 0).toFixed(3), heat: +(window.__sh.G.heat || 0).toFixed(2) } : null; });
  // a quiet start: world 1, first wave
  await P.evaluate(() => window.__sh.startAt(0, 0));
  await P.waitForFunction(() => { const m = window.__sh.A.music; return m && m.layers && m.layers.length === 2; }, null, { timeout: 60000 });
  const lens = await P.evaluate(() => { const m = window.__sh.A.music; return m.voices.map((v) => [+(v.src.loopEnd - v.src.loopStart).toFixed(4), +v.src.loopStart.toFixed(4)]); });
  ok(lens.length === 3 && Math.abs(lens[1][0] - lens[0][0]) < 0.01 && Math.abs(lens[2][0] - lens[0][0]) < 0.01, `track, drums and lead loop together: ${JSON.stringify(lens)}`);
  await sleep(2500);
  const q = await gains();
  ok(q && q.d < 0.15 && q.l < 0.05, `quiet start: layers silent (${JSON.stringify(q)})`);
  // a carrier fight on world 5: the drums come in, then the lead
  await P.evaluate(() => window.__sh.startAt(4, 4));
  await P.waitForFunction(() => { const m = window.__sh.A.music; return m && m.name === 'boss' && m.layers && m.layers.length === 2; }, null, { timeout: 60000 }).catch(() => {});
  let hot = null;
  for (let i = 0; i < 30; i++) { await sleep(1000); hot = await gains(); if (hot && hot.d > 0.6 && hot.l > 0.3) break; }
  ok(hot && hot.name === 'boss' && hot.d > 0.6, `carrier fight: drums in (${JSON.stringify(hot)})`);
  ok(hot && hot.l > 0.3, `carrier fight: lead pulse in (${JSON.stringify(hot)})`);
  // DYNAMIC MUSIC off
  await P.evaluate(() => { const S = window.__sh; S.settings.layers = 'off'; S.A.setLayersOn(false); });
  await sleep(2000);
  const off = await gains();
  ok(off && off.d < 0.02 && off.l < 0.02, `DYNAMIC MUSIC OFF silences the layers (${JSON.stringify(off)})`);
  ok(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
  ok(posts === 0, 'no score posts');
} finally { await browser.close(); }
console.log(fail ? `${fail} FAILED` : 'ALL PASS');
process.exit(fail ? 1 : 0);
