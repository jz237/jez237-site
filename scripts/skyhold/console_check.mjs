// Browser check (Edge headless): the ?test=1 self-test page, then the real page in real time (title, demo, an
// autopilot campaign start and a carrier fight) with no console errors, no score POSTs, no shader compiles during
// play and the frame times.
//   node scripts/skyhold/console_check.mjs [baseUrl=http://127.0.0.1:8862/games/2026-11-09/skyhold/] [seconds=20]
// Takes the shared Edge lock D:/Projects/.tmp/arcade-trio-edge.lock (other games' checks use it too).
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('D:/Projects/.tmp/model-s-tools/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8862/games/2026-11-09/skyhold/';
const secs = +(process.argv[3] || 20);
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) { try { fs.mkdirSync(LOCK); break; } catch { if (i > 80) { console.error('lock busy'); process.exit(3); } await sleep(15000); } }
process.on('exit', () => { try { fs.rmdirSync(LOCK); } catch { /* gone */ } });
let fail = 0;
const ok = (c, msg) => { console.log((c ? 'PASS  ' : 'FAIL  ') + msg); if (!c) fail++; return c; };
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const t0 = Date.now();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  let posts = 0;
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => { if (r.request().method() === 'POST') posts++; r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); });
  const errors = [];
  const watch = (page) => { page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message)); page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(r.status() + ' ' + r.url()); }); };
  // 1. the self-test page
  const T = await ctx.newPage(); watch(T);
  await T.goto(base + '?test=1');
  await T.waitForFunction(() => window.__testResults, null, { timeout: 300000 });
  const res = await T.evaluate(() => window.__testResults);
  for (const r of res) ok(r.ok, `self-test: ${r.name} (${r.info})`);
  await T.close();
  // 2. the real page, real time
  const P = await ctx.newPage(); watch(P);
  const tl = Date.now();
  await P.goto(base);
  await P.waitForFunction(() => window.__sh && window.__sh.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 120000 });
  console.log(`      title after ${((Date.now() - tl) / 1000).toFixed(1)} s`);
  await P.mouse.click(640, 700);
  const prog0 = await P.evaluate(() => window.__sh.R.r.info.programs.length);
  const run = async (label, js, s) => {
    await P.evaluate(js);
    const stats = await P.evaluate(async (s) => {
      const T = []; let last = performance.now();
      await new Promise((res) => { const f = (now) => { T.push(now - last); last = now; if (T.length < s * 60) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      T.sort((a, b) => a - b);
      return { n: T.length, p50: T[T.length >> 1], p95: T[Math.floor(T.length * 0.95)], max: T[T.length - 1], programs: window.__sh.R.r.info.programs.length, calls: window.__sh.R.r.info.render.calls };
    }, s);
    console.log(`      ${label.padEnd(18)} frames p50 ${stats.p50.toFixed(1)} ms, p95 ${stats.p95.toFixed(1)} ms, max ${stats.max.toFixed(0)} ms · programs ${stats.programs}`);
    return stats;
  };
  await run('title', '0', 4);
  const prep = await P.evaluate(async () => { for (let i = 0; i < 200 && !window.__sh.R.prepared; i++) await new Promise((r) => setTimeout(r, 100)); return window.__sh.R.prepared; });
  ok(prep, 'the other worlds are prepared in idle time after the title');
  const progT = await P.evaluate(() => window.__sh.R.r.info.programs.length);
  const a = await run('demo', 'window.__sh.startDemo()', secs / 2);
  const b = await run('campaign (auto)', 'window.__sh.startAt(2, 2)', secs / 2);
  const c = await run('carrier (auto)', 'window.__sh.startAt(4, 4)', secs / 2);
  const d = await run('endless', 'window.__sh.startEndless(); window.__sh.G.ai = null', 4);
  const grew = Math.max(a.programs, b.programs, c.programs, d.programs) - progT;
  ok(grew <= 2, `shader programs: ${prog0} at boot, ${progT} once prepared, at most ${progT + grew} in play`);
  ok(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
  ok(posts === 0, `no score posts (${posts})`);
  ok(await P.evaluate(() => window.__sh.noPost), 'the page knows it is a test (scores blocked)');
} finally { await browser.close(); }
console.log(fail ? `FAIL · ${fail} check(s) · ${((Date.now() - t0) / 1000).toFixed(0)} s` : `PASS · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
