// Cabinet sound layer check (Edge headless): all 18 cabinet WAVs decode, an autopilot run sounds them through the
// one-channel board (fire, wrecks, abduct, and so on), the thrust loop follows the stick, and CABINET SOUNDS OFF
// silences the layer. Scores are never posted (the board is stubbed).
//   node scripts/skyhold/cabinet_check.mjs [baseUrl=http://127.0.0.1:8862/games/2026-11-09/skyhold/] [seconds=45]
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('D:/Projects/.tmp/model-s-tools/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8862/games/2026-11-09/skyhold/';
const secs = +(process.argv[3] || 45);
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
  await P.evaluate(async () => { const A = window.__sh.A; for (let i = 0; i < 300 && !A.loading; i++) await new Promise((r) => setTimeout(r, 50)); await A.loading; });
  const loaded = await P.evaluate(() => [...window.__sh.A.buf.keys()].filter((k) => k.startsWith('cab_')).map((k) => [k.slice(4), +window.__sh.A.buf.get(k).duration.toFixed(3)]));
  ok(loaded.length === 18, `cabinet WAVs decoded: ${loaded.length}/18 (${loaded.map((l) => l[0]).join(' ')})`);
  // count every cabinet sound that actually starts on the board
  await P.evaluate(() => {
    const A = window.__sh.A, orig = A.cab.bind(A);
    window.__cab = { asked: {}, played: {}, thrustOn: 0, frames: 0 };
    A.cab = (name, o) => { const c = window.__cab, before = A.cabCh; c.asked[name] = (c.asked[name] || 0) + 1; orig(name, o); if (A.cabCh !== before) c.played[name] = (c.played[name] || 0) + 1; };
    const tick = () => { const h = A.loops.get('cabthrust'); if (h) { window.__cab.frames++; if (h.gain.gain.value > 0.3) window.__cab.thrustOn++; } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await P.evaluate(() => window.__sh.startAt(0, 0));
  await sleep(secs * 500);
  await P.evaluate(() => window.__sh.startAt(4, 4));   // a carrier fight on the last world
  await sleep(secs * 500);
  const c = await P.evaluate(() => window.__cab);
  console.log('      asked  ', JSON.stringify(c.asked));
  console.log('      played ', JSON.stringify(c.played));
  ok((c.played.start || 0) >= 1, 'the start sound plays as a world begins');
  ok((c.played.fire || 0) >= 20, `your shots sound the cabinet fire (${c.played.fire || 0})`);
  ok((c.played.explosion || 0) + (c.played.swarmer || 0) + (c.played.mutant || 0) + (c.played.bomber || 0) + (c.played.pod || 0) >= 5, 'wrecks sound the cabinet explosions');
  ok(Object.keys(c.played).length >= 5, `at least five different cabinet sounds were heard (${Object.keys(c.played).length})`);
  ok((c.asked.fire || 0) > (c.played.fire || 0), 'higher-ranked sounds hold the one channel against the fire sound');
  ok(c.thrustOn > 30 && c.thrustOn < c.frames, `the cabinet thrust loop follows the stick (on ${c.thrustOn} of ${c.frames} frames)`);
  // OFF silences the layer
  await P.evaluate(() => { const S = window.__sh; S.settings.cab = 'off'; S.A.setCab(false); window.__cab.played = {}; });
  await sleep(4000);
  const off = await P.evaluate(() => ({ played: window.__cab.played, gain: window.__sh.A.cabBus.gain.value }));
  ok(Object.keys(off.played).length === 0 && off.gain < 0.01, `CABINET SOUNDS OFF: nothing plays, bus gain ${off.gain.toFixed(3)}`);
  await P.evaluate(() => { const S = window.__sh; S.settings.cab = 'on'; S.A.setCab(true); });
  await sleep(500);
  ok(await P.evaluate(() => window.__sh.A.cabBus.gain.value > 0.15), 'CABINET SOUNDS ON again restores the layer');
  ok(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
  ok(posts === 0, 'no score posts');
} finally { await browser.close(); }
console.log(fail ? `${fail} FAILED` : 'ALL PASS');
process.exit(fail ? 1 : 0);
