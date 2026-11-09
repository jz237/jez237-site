// Chase camera check (Edge headless, real time, a human-style pilot on the keyboard): with CAMERA CHASE, RIGHT flies
// on the way the ship faces, holding LEFT turns it about once and then flies on (no flip-flopping), the camera swings to
// the new heading, and C switches back to the side view. Scores are never posted (the board is stubbed).
//   node scripts/skyhold/chase_check.mjs [baseUrl=http://127.0.0.1:8862/games/2026-11-09/skyhold/]
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
  await P.goto(base);
  await P.waitForFunction(() => window.__sh && window.__sh.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 120000 });
  await P.mouse.click(640, 700);
  await P.evaluate(() => { const S = window.__sh; S.settings.camera = 'chase'; S.startAt(0, 0, false); });
  await sleep(1500);
  const st = () => P.evaluate(() => { const S = window.__sh, p = S.W.players[0]; return { face: p.face, vx: +p.vx.toFixed(2), k: +S.R.chaseK.toFixed(2), dir: S.R.chDir, f: +S.R.chF.toFixed(2), fov: +S.R.camera.fov.toFixed(1), turns: S.__turns || 0 }; });
  await P.evaluate(() => { const S = window.__sh; S.__turns = 0; let f = S.W.players[0].face; setInterval(() => { const g = S.W.players[0].face; if (g !== f) { S.__turns++; f = g; } }, 16); });
  const s0 = await st();
  ok(s0.k > 0.95 && s0.fov > 60, `the chase view is on (${JSON.stringify(s0)})`);
  await P.keyboard.down('ArrowRight'); await sleep(1500); await P.keyboard.up('ArrowRight');
  const s1 = await st();
  ok(s1.face === s0.face && Math.sign(s1.vx) === s0.face && s1.turns === 0, `RIGHT flies on the way the ship faces (${JSON.stringify(s1)})`);
  await P.keyboard.down('ArrowLeft'); await sleep(2500);
  const s2 = await st();
  await P.keyboard.up('ArrowLeft');
  ok(s2.face === -s0.face && Math.sign(s2.vx) === -s0.face && s2.turns === 1, `holding LEFT turns about once and flies on (${JSON.stringify(s2)})`);
  ok(s2.dir === s2.face && Math.abs(s2.f - s2.face) < 0.2, `the camera swings round to the new heading (${JSON.stringify(s2)})`);
  await P.keyboard.down('ArrowRight'); await sleep(1200); await P.keyboard.up('ArrowRight');
  const s3 = await st();
  ok(s3.face === s2.face && s3.turns === 1, `after the turn RIGHT still flies on (${JSON.stringify(s3)})`);
  await P.keyboard.press('KeyC'); await sleep(2500);
  const s4 = await st();
  ok(s4.k < 0.05 && Math.abs(s4.fov - 40) < 0.5, `C switches back to the side view (${JSON.stringify(s4)})`);
  ok(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
  ok(posts === 0, 'no score posts');
} finally { await browser.close(); }
console.log(fail ? `${fail} FAILED` : 'ALL PASS');
process.exit(fail ? 1 : 0);
