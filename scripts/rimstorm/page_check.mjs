// Browser check (Playwright + headless Edge): loads the game with ?fixed (frames driven by __rs.tick),
// checks there are no console errors, saves screenshots of the title, sector 1 in play, a dive, a boss
// and the other sector looks, and optionally runs the ?test=1 self-test page. Score POSTs are blocked
// and counted (there must be none).
//   node scripts/rimstorm/page_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/] [shotDir] [--tests] [--quick]
// Needs a static server on the repo root (D:/Projects/.tmp/arcade-trio-work/rimstorm/serve.py) and
// Playwright from D:/Projects/.tmp/model-s-tools. Take the shared Edge lock first (see README).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const pos = args.filter((a) => !a.startsWith('--'));
const base = pos[0] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const shots = pos[1] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots';
const tag = process.env.SHOT_TAG || 'build';

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
let posts = 0;
async function open(url, vp = { width: 1280, height: 720 }) {
  const page = await browser.newPage({ viewport: vp });
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[{"initials":"RSX","score":12345}]' });
  });
  await page.goto(base + url);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  return page;
}
const t0 = Date.now();
const page = await open('?fixed&noscores');
const info = await page.evaluate(() => ({ ver: document.getElementById('ver').textContent, prog: window.__rs.R.r.info.programs.length, calls: window.__rs.R.r.info.render.calls, errs: window.__rsErrors.slice() }));
console.log(`title: v${info.ver}, ${info.prog} shader programs after warm-up`);
await page.waitForTimeout(900);
await page.evaluate(() => window.__rs.tick(90));
await page.screenshot({ path: `${shots}/${tag}_title.png` });
// sector 1 in play (the autopilot drives so the frame has action)
await page.evaluate(() => { const rs = window.__rs; rs.G.autopilot = true; rs.startCampaign(0); rs.tick(60 * 14); });
await page.screenshot({ path: `${shots}/${tag}_s1.png` });
const s1 = await page.evaluate(() => { const W = window.__rs.W; return { t: W.t.toFixed(1), en: W.enemies.length, phase: W.phase, prog: window.__rs.R.r.info.programs.length, calls: window.__rs.R.r.info.render.calls, tris: window.__rs.R.r.info.render.triangles }; });
console.log(`sector 1: ${s1.t} s, ${s1.en} enemies, ${s1.phase}, ${s1.prog} programs, ${s1.calls} draw calls, ${s1.tris} triangles`);
if (!flags.has('--quick')) {
  // a dive: clear the web by hand and watch the fly-through
  await page.evaluate(() => { const rs = window.__rs, W = rs.W; W.spawnQ = []; for (const e of W.enemies) e.hp = 0; W.spine[(W.players[0].lane + 1) % W.nl] = 0.4; W.spine[(W.players[0].lane + 3) % W.nl] = 0.55; rs.tick(80); });
  await page.screenshot({ path: `${shots}/${tag}_dive.png` });
  // each sector look with its boss (time per method: how long a frame's sync + render take on the CPU side)
  for (let s = 0; s < 5; s++) {
    const r = await page.evaluate((s) => {
      const rs = window.__rs;
      rs.startCampaign(s, 4);
      rs.tick(60 * 7);
      const R = rs.R, W = rs.W;
      const a = performance.now(); for (let i = 0; i < 20; i++) R.sync(W, 1 / 60); const b = performance.now();
      for (let i = 0; i < 5; i++) R.render(1 / 60, {}); const c = performance.now();
      return { boss: W.boss ? W.boss.key : '-', state: W.boss ? W.boss.state : '-', sync: ((b - a) / 20).toFixed(2), render: ((c - b) / 5).toFixed(2), prog: R.r.info.programs.length, calls: R.r.info.render.calls };
    }, s);
    await page.screenshot({ path: `${shots}/${tag}_boss${s + 1}.png` });
    console.log(`sector ${s + 1} boss: ${r.boss} (${r.state}), sync ${r.sync} ms, render call ${r.render} ms, ${r.prog} programs, ${r.calls} draw calls`);
  }
  // the web in sector 3 and 5 during normal play
  for (const s of [2, 4]) {
    await page.evaluate((s) => { const rs = window.__rs; rs.startCampaign(s, 1); rs.tick(60 * 12); }, s);
    await page.screenshot({ path: `${shots}/${tag}_s${s + 1}.png` });
  }
  // phone portrait
  const ph = await open('?fixed&noscores', { width: 412, height: 915 });
  await ph.evaluate(() => { const rs = window.__rs; rs.G.autopilot = true; rs.startCampaign(1, 0); rs.tick(60 * 10); });
  await ph.screenshot({ path: `${shots}/${tag}_phone.png` });
  await ph.close();
}
if (flags.has('--tests')) {
  const tp = await open('?test=1');
  await tp.waitForFunction(() => window.__rsTests && window.__rsTests.done, null, { timeout: 300000 });
  const t = await tp.evaluate(() => window.__rsTests);
  for (const r of t.results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.info})`);
  console.log(`self-test: ${t.pass} / ${t.total}`);
  await tp.screenshot({ path: `${shots}/${tag}_tests.png` });
}
await browser.close();
console.log(errors.length ? `console errors: ${errors.length}\n  ` + [...new Set(errors)].slice(0, 10).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(errors.length || posts ? 1 : 0);
