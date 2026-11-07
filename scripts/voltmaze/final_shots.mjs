// Final screenshots (Playwright + headless Edge, ?fixed: frames driven by __vm.tick): the title with the world
// board, the sector-1 start on NORMAL (how spaced it is), a touch phone in portrait (minimap turned with the
// camera) and landscape, and the phone's initials entry with its ▲ ▼ buttons. Score requests are mocked (an
// empty world board, POSTs answered locally and counted: there must be none). Real web fonts are allowed.
//   node scripts/voltmaze/final_shots.mjs [prefix=final] [baseUrl] [shotDir]
// Sector rooms and boss rooms: node scripts/voltmaze/look_check.mjs looks,bosses,gallery final
// Needs the static server (python D:/Projects/.tmp/arcade-trio-work/voltmaze/serve.py 8773). Takes the Edge lock.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const prefix = process.argv[2] || 'final';
const base = process.argv[3] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const shots = process.argv[4] || 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots';
const V = '?v=8';
fs.mkdirSync(shots, { recursive: true });

const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) {
  try { fs.mkdirSync(LOCK); break; } catch {
    try { const st = fs.statSync(LOCK); if (Date.now() - st.mtimeMs > 10 * 60 * 1000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
    if (i > 300) { console.error('could not get the Edge lock'); process.exit(3); }
    console.log('waiting for the Edge lock…'); await sleep(3000 + Math.random() * 4000);
  }
}
const release = () => { try { fs.rmdirSync(LOCK); } catch { /* already */ } };
process.on('exit', release);
let browser, fails = 0, posts = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const errors = [];
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const mk = async (opt, tag) => {
    const ctx = await browser.newContext(opt);
    await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
      if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    ctx.on('page', (p) => {
      p.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
      p.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
    });
    const page = await ctx.newPage();
    await page.goto(base + '?fixed&noscores');
    await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    return { ctx, page };
  };
  const play = (page, s, ticks) => page.evaluate(async ({ s, ticks, V }) => {
    const vm = window.__vm; vm.startCampaign(s);
    const { Autopilot } = await import('./js/ai.js' + V); vm.G.ai = new Autopilot(3, 'demo'); vm.tick(ticks);
  }, { s, ticks, V });

  // ---- desktop: title, sector-1 start
  {
    const { ctx, page } = await mk({ viewport: { width: 1280, height: 720 } }, 'desktop');
    await page.evaluate(() => window.__vm.tick(90));
    await sleep(400); await page.evaluate(() => window.__vm.tick(2));
    const ver = await page.evaluate(() => document.getElementById('ver').textContent);
    ok(/1\.0\.0/.test(ver), `title shows the version (${ver})`);
    await page.screenshot({ path: `${shots}/${prefix}_title.png` });
    await play(page, 0, 200);
    const st = await page.evaluate(() => { const W = window.__vm.W; return { robots: W.robots.filter((e) => e.hp > 0).length, aiming: W.robots.filter((e) => e.aimT > 0).length, cap: W.room.cap, warn: +W.R.warn.toFixed(2) }; });
    console.log(`S1 room 1 after ~3 s: ${JSON.stringify(st)}`);
    await page.screenshot({ path: `${shots}/${prefix}_s1_start.png` });
    await page.evaluate(() => window.__vm.tick(420));
    await page.screenshot({ path: `${shots}/${prefix}_s1_later.png` });
    await ctx.close();
  }
  // ---- phone: portrait (the minimap turns with the camera), landscape, the initials entry on touch
  {
    const { ctx, page } = await mk({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, 'phone');
    await play(page, 0, 300);
    const mm = await page.evaluate(() => { const c = document.getElementById('minimap'); return { tall: c.classList.contains('tall'), w: c.width, h: c.height, portrait: window.__vm.R.portrait }; });
    ok(mm.portrait && mm.tall && mm.w === 200 && mm.h === 250, `portrait: the minimap is turned with the camera (${JSON.stringify(mm)})`);
    await page.screenshot({ path: `${shots}/${prefix}_phone_portrait.png` });
    // game over -> initials with the touch arrows
    await page.evaluate(() => { const vm = window.__vm; vm.W.lives = 1; vm.W.score = Math.max(vm.W.score, 2600); vm.G.ai = null; vm.W.players[0].input = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false }; });
    for (let i = 0; i < 60; i++) { await page.evaluate(() => window.__vm.tick(60)); if (await page.evaluate(() => window.__vm.G.state !== 'play')) break; }
    await sleep(1700); await page.evaluate(() => window.__vm.tick(30));
    const up = page.locator('#ini .ia[data-ini="0"][data-d="1"]'), dn = page.locator('#ini .ia[data-ini="1"][data-d="-1"]');
    const vis = await up.isVisible();
    const c0 = await page.evaluate(() => window.__vm.G.ini && window.__vm.G.ini.chars.join(''));
    if (vis) { await up.tap(); await dn.tap(); await dn.tap(); }
    const c1 = await page.evaluate(() => window.__vm.G.ini && window.__vm.G.ini.chars.join(''));
    const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', step = (ch, d) => C[(C.indexOf(ch) + d + C.length) % C.length];
    ok(vis && c0 && c1 === step(c0[0], 1) + step(c0[1], -2) + c0[2], `touch initials: ▲ / ▼ step a letter either way (${c0} -> ${c1})`);
    await page.screenshot({ path: `${shots}/${prefix}_phone_initials.png` });
    await page.evaluate(() => window.__vm.toTitle());
    await page.setViewportSize({ width: 915, height: 412 });
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await play(page, 2, 300);
    const mm2 = await page.evaluate(() => document.getElementById('minimap').classList.contains('tall'));
    ok(!mm2, 'landscape: the minimap is upright again');
    await page.screenshot({ path: `${shots}/${prefix}_phone_landscape.png` });
    await ctx.close();
  }
  for (const e of errors) console.log('ERROR', e);
  if (errors.length) fails++;
  ok(!posts, `score POSTs: ${posts}`);
} catch (e) { console.error(e); fails++; }
finally { if (browser) await browser.close(); release(); }
console.log(fails ? `FAILED (${fails})` : 'final shots done');
process.exit(fails ? 1 : 0);
