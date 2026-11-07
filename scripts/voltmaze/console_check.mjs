// Browser check (Playwright + headless Edge, ?fixed: frames driven by __vm.tick). Fails on any console
// error, page error, any score POST (score requests are intercepted, nothing reaches the real boards) or a
// shader program compiled after the warm-up. Covers and photographs:
//   title with the world board (mocked GET) · a sector-1 room at the medium start (how spaced it is) · a
//   normal room in every sector · every boss room · a reinforcement warping in · keyboard controls · the
//   attract demo starting by itself · ?autoplay (the page's own autopilot campaign) · the AI PLAYTHROUGH
//   rolling from the sector-1 boss through the shop into sector 2 · a game over with the initials entry ·
//   a touch phone in portrait and landscape · the online screen (host + quick match connect to VM- /
//   VM-Q- rooms on a mocked relay) · the ?test=1 self-test page (every check must pass).
//   node scripts/voltmaze/console_check.mjs [baseUrl=http://127.0.0.1:8773/games/2026-11-06/voltmaze/] [shotDir] [quick]
// Needs the static server (python D:/Projects/.tmp/arcade-trio-work/voltmaze/serve.py 8773) and Playwright
// (from D:/Projects/.tmp/model-s-tools). Takes the shared Edge lock D:/Projects/.tmp/arcade-trio-edge.lock.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const shots = process.argv[3] || 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots';
const quick = process.argv[4] === 'quick';
const V = '?v=7';
fs.mkdirSync(shots, { recursive: true });

// the shared lock: only one headless Edge at a time across the agents
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
const t0 = Date.now();
let browser, fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const BOARD = JSON.stringify([['VLT', 48210, 'S5'], ['ARC', 39120, 'S4'], ['JEZ', 31500, 'S4'], ['MZE', 22340, 'S3'], ['KAT', 15880, 'S2'], ['ZAP', 9120, 'S2'], ['ROB', 6400, 'S1']].map(([initials, score, extra]) => ({ initials, score, extra })));
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  let posts = 0;
  const wsUrls = [], wsMsgs = [];
  const setup = async (ctx, tag) => {
    await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
      if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
      return route.fulfill({ status: 200, contentType: 'application/json', body: BOARD });
    });
    await ctx.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await ctx.route('**/fonts.gstatic.com/**', (r) => r.abort());
    // the duel relay, mocked: the lobby is empty and every room socket just listens
    await ctx.route('**/steel-duel-online.jez237.workers.dev/rooms**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"rooms":[]}' }));
    await ctx.routeWebSocket(/steel-duel-online\.jez237\.workers\.dev\/ws\//, (ws) => { wsUrls.push(ws.url()); ws.onMessage((m) => wsMsgs.push(String(m))); });
    ctx.on('page', (p) => {
      p.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
      p.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
    });
  };
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await setup(ctx, 'desktop');
  const page = await ctx.newPage();
  const tick = (n = 60) => page.evaluate((n) => window.__vm.tick(n), n);
  const boot = async (pg, q) => { await pg.goto(base + q); await pg.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 }); };
  const progsOf = (pg) => pg.evaluate(() => window.__vm.R.r.info.programs.length);
  const T = Date.now();
  await boot(page, '?fixed&noscores');
  console.log(`loaded + warmed up in ${((Date.now() - T) / 1000).toFixed(1)} s`);
  const progs = await progsOf(page);
  console.log(`shader programs after warm-up: ${progs}`);
  const progLog = [];
  const noteProgs = async (what) => { const n = await progsOf(page); progLog.push(`${what} ${n}`); if (n !== progs) console.log(`  programs ${progs} -> ${n} after ${what}`); };

  // ---- title with the world board
  await tick(90); await sleep(400); await tick(30);
  const board = await page.evaluate(() => { const el = document.getElementById('tb-list'); return el ? el.innerText : document.body.innerText; });
  ok(/VLT/.test(board) && /48[,.]?210/.test(board), 'title shows the world board (mocked GET)');
  await page.screenshot({ path: `${shots}/build_title.png` });

  // ---- sector 1 at the medium start: a room 4 s in, the ACTION camera as a player sees it
  await page.evaluate(async (V) => { const vm = window.__vm; vm.startCampaign(0); const { Autopilot } = await import('./js/ai.js' + V); vm.G.ai = new Autopilot(7, 'human'); }, V);
  for (let i = 0; i < 4; i++) await tick(60);
  const s1 = await page.evaluate(() => { const W = window.__vm.W; return { room: W.roomN, robots: W.robots.filter((e) => e.hp > 0).length, active: W.robots.filter((e) => e.hp > 0 && e.boot <= 0).length, aiming: W.robots.filter((e) => e.aimT > 0).length, bolts: W.bolts.length }; });
  console.log('sector 1, 4 s in:', JSON.stringify(s1));
  await page.screenshot({ path: `${shots}/build_s1_room.png` });
  await tick(150);
  await page.screenshot({ path: `${shots}/build_s1_later.png` });
  const ms = await page.evaluate(() => { const vm = window.__vm; const a = performance.now(); vm.tick(60); return (performance.now() - a) / 60; });
  console.log(`frame (sim + render submit) ${ms.toFixed(1)} ms in headless (meaningless for real perf)`);
  // a reinforcement warping in
  const warp = await page.evaluate(() => { const vm = window.__vm; for (let i = 0; i < 1800; i++) { vm.tick(1); const W = vm.W; if (W.robots.some((e) => e.warp && e.t > 0.15 && e.t < 0.35)) return { t: W.room.t, n: W.robots.length }; if (W.over) break; } return null; });
  if (warp) await page.screenshot({ path: `${shots}/build_warpin.png` });
  ok(!!warp, `a reinforcement warps in (${warp ? `room time ${warp.t.toFixed(1)} s, ${warp.n} robots` : 'none seen'})`);
  await noteProgs('sector-1 campaign');

  // ---- a normal room and the boss room in every sector
  const sectors = quick ? [0, 4] : [0, 1, 2, 3, 4];
  for (const s of sectors) {
    for (const boss of [false, true]) {
      await page.evaluate(async ({ s, boss, V }) => {
        const vm = window.__vm, { makeWorld } = await import('./js/sim.js' + V), { Autopilot } = await import('./js/ai.js' + V), { TYPICAL_UP } = await import('./js/config.js' + V);
        const W = makeWorld({ sector: s, seed: 90 + s, boss, room: boss ? 0 : 2, lives: 9, up: TYPICAL_UP[s], noTut: true });
        vm.G.W = W; vm.G.state = 'play'; vm.G.mode = 'campaign'; vm.G.ai = new Autopilot(s, 'demo');
        vm.G.run = { score: 0, lives: 9, up: TYPICAL_UP[s], salvage: 0, start: s, newMedals: [], diff: 'normal' };
        vm.R.setLook(s);
      }, { s, boss, V });
      for (let i = 0; i < (boss ? 6 : 4); i++) await tick(60);
      await page.screenshot({ path: `${shots}/build_${boss ? 'boss' : 'room'}_s${s + 1}.png` });
    }
    await noteProgs(`sector ${s + 1} room + boss`);
  }

  // ---- a human at the keys: arrows run, SPACE plants the feet and fires the way you point
  const keys = await page.evaluate(async () => {
    const vm = window.__vm; vm.startCampaign(0); vm.G.ai = null; vm.tick(30);
    const p = vm.W.players[0], x0 = p.x, z0 = p.z;
    const kd = (code) => window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
    const ku = (code) => window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
    const entry = vm.W.room.entry, inward = { w: 'ArrowRight', e: 'ArrowLeft', n: 'ArrowDown', s: 'ArrowUp' }[entry];
    kd(inward); vm.tick(24); ku(inward);
    const moved = Math.hypot(p.x - x0, p.z - z0);
    const shots0 = vm.W.stats.shots, x1 = p.x, z1 = p.z;
    kd('Space'); kd(inward); vm.tick(40); ku(inward); ku('Space'); vm.tick(2);
    return { moved, fired: vm.W.stats.shots - shots0, planted: Math.hypot(p.x - x1, p.z - z1) };
  });
  ok(keys.moved > 1 && keys.fired >= 2 && keys.planted < 0.3, `keyboard: ran ${keys.moved.toFixed(2)} m, planted fire ${keys.fired} shots while moving ${keys.planted.toFixed(2)} m`);

  // ---- game over: stand still with one life left until security gets you, then the results + initials
  // (a score of at least 1, test side, so the run always qualifies for the initials entry)
  await page.evaluate(() => { const vm = window.__vm; vm.W.lives = 1; vm.W.score = Math.max(vm.W.score, 1234); vm.W.players[0].input = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false }; });
  let ended = false;
  for (let i = 0; i < 60 && !ended; i++) { await tick(60); ended = await page.evaluate(() => window.__vm.G.state !== 'play'); }
  await sleep(1700); await tick(30);
  const res = await page.evaluate(() => ({ screen: window.__vm.G.screen, state: window.__vm.G.state, ini: !document.getElementById('ini-wrap').classList.contains('hidden'), title: (document.querySelector('#results h2') || {}).textContent }));
  ok(res.screen === 'results' && res.ini, `game over -> results with the initials entry (${JSON.stringify(res)})`);
  // P / Escape / the pad's Start must never leave the initials entry (they used to quit to the title and lose the score)
  await page.keyboard.type('VPZ');
  await page.keyboard.press('Escape');
  await tick(10);
  const keep = await page.evaluate(() => ({ screen: window.__vm.G.screen, chars: window.__vm.G.ini && window.__vm.G.ini.chars.join('') }));
  ok(keep.screen === 'results' && keep.chars === 'VPZ', `initials: typing P and pressing Escape stay on the results (${JSON.stringify(keep)})`);
  await page.keyboard.press('Backspace'); await page.keyboard.type('M');   // back to the middle letter: VMZ
  await tick(10);
  await page.screenshot({ path: `${shots}/build_gameover.png` });
  await noteProgs('game over');

  // ---- the attract demo starts by itself on the title
  await page.evaluate(() => { window.__vm.toTitle(); window.__vm.tick(60 * 13); });
  const demo = await page.evaluate(() => window.__vm.G.mode);
  ok(demo === 'demo', `title idle 13 s -> mode ${demo}`);
  for (let i = 0; i < 5; i++) await tick(60);
  await page.screenshot({ path: `${shots}/build_demo.png` });
  await noteProgs('attract demo');

  // ---- ?autoplay: the page runs its own autopilot campaign
  {
    const p3 = await ctx.newPage();
    await boot(p3, '?fixed&noscores&autoplay&play');
    await p3.evaluate(() => { if (window.__vm.G.mode !== 'campaign') window.__vm.startCampaign(0); });
    for (let i = 0; i < 25; i++) await p3.evaluate(() => window.__vm.tick(60));
    const a = await p3.evaluate(() => { const vm = window.__vm, W = vm.W; return { mode: vm.G.mode, ai: !!vm.G.ai, room: W.roomN, kills: W.stats.kills, shots: W.stats.shots, noPost: vm.noPost }; });
    ok(a.mode === 'campaign' && a.ai && a.kills > 3 && a.shots > 10 && a.noPost, `?autoplay plays its own campaign (${JSON.stringify(a)})`);
    await p3.screenshot({ path: `${shots}/build_autoplay.png` });
    await p3.close();
  }

  // ---- AI PLAYTHROUGH: from the sector-1 boss, through the autopilot's shop, on into sector 2
  {
    const p4 = await ctx.newPage();
    await boot(p4, '?fixed&noscores&boss');
    await p4.evaluate(() => window.__vm.startPlaythrough());
    let st = null;
    const tEnd = Date.now() + 120000;
    while (Date.now() < tEnd) {
      await p4.evaluate(() => window.__vm.tick(60));
      st = await p4.evaluate(() => ({ mode: window.__vm.G.mode, state: window.__vm.G.state, sector: window.__vm.W && window.__vm.W.sector }));
      if (st.state === 'upgrade') break;
    }
    const shop = await p4.evaluate(() => ({ picks: document.querySelectorAll('#upgrid .upg.pick').length, sub: document.getElementById('up-sub').textContent }));
    await p4.screenshot({ path: `${shots}/build_playthrough_shop.png` });
    ok(st && st.state === 'upgrade', `playthrough: sector-1 boss down -> the autopilot's shop (${shop.sub})`);
    const t2 = Date.now() + 15000;
    while (Date.now() < t2) { await sleep(500); st = await p4.evaluate(() => ({ mode: window.__vm.G.mode, state: window.__vm.G.state, sector: window.__vm.W && window.__vm.W.sector })); if (st.sector === 1 && st.state === 'play') break; }
    for (let i = 0; i < 3; i++) await p4.evaluate(() => window.__vm.tick(60));
    await p4.screenshot({ path: `${shots}/build_playthrough_s2.png` });
    ok(st.mode === 'playthrough' && st.sector === 1 && st.state === 'play', `playthrough rolls on into sector 2 (${JSON.stringify(st)})`);
    await p4.close();
  }

  // ---- the campaign shop: Escape / P / Backspace never throw the run away; END RUN HERE banks the score
  {
    const p6 = await ctx.newPage();
    await boot(p6, '?fixed&noscores&boss');
    await p6.evaluate(async (V) => { const vm = window.__vm; vm.startCampaign(0); const { Autopilot } = await import('./js/ai.js' + V); vm.G.ai = new Autopilot(4, 'demo'); vm.W.lives = 9; }, V);
    let st = null;
    for (let i = 0; i < 120; i++) { await p6.evaluate(() => window.__vm.tick(60)); st = await p6.evaluate(() => window.__vm.G.state); if (st === 'upgrade') break; }
    for (const k of ['Escape', 'KeyP', 'Backspace']) await p6.keyboard.press(k);
    await p6.evaluate(() => window.__vm.tick(5));
    const kept = await p6.evaluate(() => ({ state: window.__vm.G.state, screen: window.__vm.G.screen }));
    ok(st === 'upgrade' && kept.screen === 'upgrades', `shop: Escape, P and Backspace stay in the shop (${JSON.stringify(kept)})`);
    await p6.click('#up-bank');
    await p6.evaluate(() => window.__vm.tick(5));
    const bank = await p6.evaluate(() => ({ screen: window.__vm.G.screen, ini: !!window.__vm.G.ini, title: document.getElementById('res-title').textContent, extra: window.__vm.G.ini && window.__vm.G.ini.extra }));
    ok(bank.screen === 'results' && bank.ini && /RUN ENDED/.test(bank.title), `shop: END RUN HERE goes to the results with the initials entry (${JSON.stringify(bank)})`);
    await p6.screenshot({ path: `${shots}/build_bank.png` });
    const rows0 = await p6.evaluate(() => JSON.parse(localStorage.getItem('vm.hs.voltmaze-2026') || '[]').length);
    await p6.keyboard.press('Enter');
    await p6.evaluate(() => window.__vm.tick(5));
    const saved = await p6.evaluate(() => ({ state: window.__vm.G.state, rows: JSON.parse(localStorage.getItem('vm.hs.voltmaze-2026') || '[]').length }));
    ok(saved.state === 'title' && saved.rows === Math.min(10, rows0 + 1), `shop: the banked score is saved (${JSON.stringify({ ...saved, rows0 })})`);
    await p6.close();
  }

  // ---- online screen: host a room and quick match on the mocked relay
  {
    const p5 = await ctx.newPage();
    await boot(p5, '?fixed&noscores');
    await p5.click('[data-act="online"]');
    await p5.click('[data-act="net-host"]');
    await sleep(800);
    const code = await p5.evaluate(() => document.getElementById('room-code').textContent);
    await p5.screenshot({ path: `${shots}/build_online.png` });
    await p5.click('[data-act="net-quick"]');
    await sleep(800);
    const hostWs = wsUrls.find((u) => /\/ws\/VM-[A-Z0-9]{4}$/.test(decodeURIComponent(u))), quickWs = wsUrls.find((u) => /\/ws\/VM-Q-[A-Z0-9]{5}$/.test(decodeURIComponent(u)));
    ok(code.length === 4 && hostWs && quickWs && wsMsgs.some((m) => /"hello"/.test(m)), `online: host room ${code} (${hostWs ? decodeURIComponent(hostWs).split('/ws/')[1] : 'no socket'}), quick match ${quickWs ? decodeURIComponent(quickWs).split('/ws/')[1] : 'no socket'}, hello sent`);
    await p5.click('[data-act="net-back"]');
    await p5.close();
  }

  // ---- a touch phone (S25 Ultra-like 412 x 915), portrait and landscape, in a campaign room
  {
    const mctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await setup(mctx, 'phone');
    const mp = await mctx.newPage();
    await boot(mp, '?fixed&noscores');
    await mp.evaluate(async (V) => { const vm = window.__vm; vm.startCampaign(0); const { Autopilot } = await import('./js/ai.js' + V); vm.G.ai = new Autopilot(3, 'demo'); vm.tick(240); }, V);
    await mp.screenshot({ path: `${shots}/build_phone_portrait.png` });
    await mp.setViewportSize({ width: 915, height: 412 });
    await mp.evaluate(() => { window.dispatchEvent(new Event('resize')); window.__vm.tick(90); });
    await mp.screenshot({ path: `${shots}/build_phone_landscape.png` });
    const tc = await mp.evaluate(() => { const t = document.getElementById('touch'); return t && !t.classList.contains('hidden') ? t.querySelectorAll('.tbtn:not(.hidden)').length : 0; });
    console.log(`phone: ${tc} touch buttons on screen`);
    await mctx.close();
  }

  const progs2 = await progsOf(page);
  ok(progs2 === progs, `shader programs constant: ${progs} after warm-up, ${progs2} after every sector, boss, demo, game over (${progLog.join(' · ')})`);
  const pageErrs = await page.evaluate(() => window.__vmErrors || []);
  // ---- the self-test page
  if (!quick) {
    const p2 = await ctx.newPage();
    await p2.goto(base + '?test=1&fixed');
    await p2.waitForFunction(() => window.__vmTests && window.__vmTests.done, null, { timeout: 300000 });
    const t = await p2.evaluate(() => window.__vmTests);
    for (const r of t.results) ok(r.ok, `self-test: ${r.name}  (${r.info})`);
    await p2.screenshot({ path: `${shots}/build_selftest.png` });
  }
  for (const e of [...errors, ...pageErrs]) console.log('ERROR', e);
  if (errors.length || pageErrs.length) fails++;
  ok(!posts, `score POSTs: ${posts}`);
  console.log(fails ? `FAILED (${fails} failure(s), ${errors.length + pageErrs.length} errors, ${posts} posts)` : 'browser check passed: no console errors, no score posts, no compiles after warm-up');
} catch (e) { console.error(e); fails++; }
finally { if (browser) await browser.close(); release(); console.log(`edge lock held ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
process.exit(fails ? 1 : 0);
