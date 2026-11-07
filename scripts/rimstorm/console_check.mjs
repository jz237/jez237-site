// Browser check (Playwright + headless Edge): runs the ?test=1 self-test page (every test must pass), lets
// the title roll into the attract demo by itself (12 s idle), plays an autoplay campaign, runs the AI
// PLAYTHROUGH from the sector 1 boss into sector 2, and opens the online pages (the ONLINE screen and a
// ?room= join link; nothing connects). Fails on any console error or any score POST (POSTs to the shared
// board are intercepted, GETs answer an empty board).
//   node scripts/rimstorm/console_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/]
// Needs the static server (serve.py on 8772), Playwright from D:/Projects/.tmp/model-s-tools and the shared Edge lock.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errors = [];
let posts = 0, gets = 0, fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++; };
async function open(url, vp = { width: 1280, height: 720 }) {
  const page = await browser.newPage({ viewport: vp });
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${url}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${url}: pageerror: ${e.message}`));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    gets++;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.goto(base + url);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state !== 'boot', null, { timeout: 120000 });
  return page;
}
const t0 = Date.now();
// 1. the ?test=1 self-test page
{
  const p = await open('?test=1');
  await p.waitForFunction(() => window.__rsTests && window.__rsTests.done, null, { timeout: 300000 });
  const t = await p.evaluate(() => window.__rsTests);
  for (const r of t.results) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.name} (${r.info}, ${r.ms} ms)`);
  ok(t.pass === t.total && t.total > 0, `?test=1 self-test: ${t.pass} / ${t.total} pass`);
  await p.close();
}
// 2. the title rolls into the attract demo by itself after ~12 s, and the demo really plays
{
  const p = await open('');
  await p.waitForTimeout(14500);
  const d = await p.evaluate(() => ({ mode: window.__rs.G.mode, n: window.__rs.W ? window.__rs.W.n : 0, kills: window.__rs.W ? window.__rs.W.stats.kills : 0 }));
  ok(d.mode === 'demo' && d.n > 60, `attract demo starts from the idle title (mode ${d.mode}, ${d.n} ticks, ${d.kills} kills)`);
  await p.close();
}
// 3. an autoplay campaign (demo autopilot, real time)
{
  const p = await open('?autoplay&noscores');
  await p.waitForTimeout(12000);
  const r = await p.evaluate(() => ({ mode: window.__rs.G.mode, state: window.__rs.G.state, t: window.__rs.W.t, kills: window.__rs.W.stats.kills, web: window.__rs.W.web }));
  ok(r.state === 'play' && r.t > 5 && r.kills > 0, `autoplay campaign plays (${r.mode}, ${r.t.toFixed(1)} s, web ${r.web + 1}, ${r.kills} kills)`);
  await p.close();
}
// 4. AI playthrough: from the sector 1 boss it clears, shops and rolls into sector 2 by itself
{
  const p = await open('?playthrough&fixed&web=4&noscores');
  await p.waitForFunction(() => window.__rs.G.mode === 'playthrough' && window.__rs.G.state === 'play', null, { timeout: 60000 });
  const r = await p.evaluate(async () => {
    const rs = window.__rs;
    for (let i = 0; i < 60 * 240 && rs.G.state === 'play'; i++) rs.tick(1);
    const after = { result: rs.W.result, bossT: Math.round(rs.W.stats.bossT) };
    await new Promise((res) => setTimeout(res, 1700)); rs.tick(5);
    const shop = { screen: rs.G.screen, sub: document.getElementById('up-sub').textContent };
    await new Promise((res) => setTimeout(res, 6500)); rs.tick(5);
    return { after, shop, next: { mode: rs.G.mode, state: rs.G.state, sector: rs.W.sector } };
  });
  ok(r.after.result === 'clear' && r.shop.screen === 'upgrades' && r.next.mode === 'playthrough' && r.next.sector === 1 && r.next.state === 'play',
    `AI playthrough: S1 boss down in ${r.after.bossT} s -> ${r.shop.screen} (${r.shop.sub}) -> ${r.next.mode} sector ${r.next.sector + 1} (${r.next.state})`);
  await p.close();
}
// 5. the online pages load (no connection is made)
{
  const p = await open('?noscores');
  const a = await p.evaluate(() => { window.__rs.act('online'); return { screen: window.__rs.G.screen, host: !!document.querySelector('#scr-online, [data-screen="online"], #online') }; });
  const q = await open('?room=RS-ABCD&noscores', { width: 412, height: 915 });
  const b = await q.evaluate(() => ({ screen: window.__rs.G.screen, code: (document.getElementById('join-code') || {}).value }));
  ok(a.screen === 'online' && b.screen === 'online' && /RS-?ABCD|ABCD/.test(b.code || ''), `online pages load (ONLINE screen; join link on a phone fills ${b.code})`);
  await p.close(); await q.close();
}
await browser.close();
ok(!errors.length, `console errors: ${errors.length}${errors.length ? '\n    ' + [...new Set(errors)].slice(0, 8).join('\n    ') : ''}`);
ok(!posts, `score POSTs attempted: ${posts} (board GETs answered locally: ${gets})`);
console.log(`${fails ? 'FAIL' : 'ALL PASS'} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fails ? 1 : 0);
