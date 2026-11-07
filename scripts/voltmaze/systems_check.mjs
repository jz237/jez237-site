// Meta systems in the real page (Playwright + headless Edge, frames driven with ?fixed + __vm.tick):
//  options   every option persisted under vm.settings.v1 and restored after a reload; every key the game
//            writes starts with 'vm.'
//  campaign  START CAMPAIGN (with &boss so each sector starts at its lift room) -> boss down -> upgrade shop:
//            salvage, buying, too-poor buys refused, medals / best time / best sector score / sectors reached
//            saved, the boss-kill clip replays bit exact and the replay returns to the shop; NEXT SECTOR fits
//            the upgrade; a game over -> results with new medals, the death clip replays bit exact, initials
//            typed and saved to the local board (no POST), the title board tabs read every board name, the
//            high-score screen shows the local table, best times and sector scores
//  playthrough  AI PLAYTHROUGH: shop picks highlighted, auto-advance, a game over retries the sector, no
//            initials, no medals, no local scores
//  demo      the attract demo starts after ~12 s on the title, shows its fitted upgrades, reaches the boss,
//            slows down only for deaths / boss kills (with the camera on the cause), any key ends it
//  gamepad   a fake standard pad: menu navigation, run, plant + fire, right-stick fire, rumble, pause
//  touch     a phone (portrait + landscape): touch sticks shown, left thumb runs, right thumb aims + fires,
//            EMP button, phone vibration, buttons inside the screen; screenshots
// Fails on console errors or any score POST (score requests are intercepted and answered locally).
//   node scripts/voltmaze/systems_check.mjs [what=all|options|campaign|playthrough|demo|pad|touch] [baseUrl] [shotDir]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const what = process.argv[2] || 'all';
const base = process.argv[3] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const shots = process.argv[4] || 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots';
const want = (k) => what === 'all' || what.split(',').includes(k);
fs.mkdirSync(shots, { recursive: true });
const V = '?v=7';

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
let browser, fails = 0, posts = 0;
const errors = [], gets = [];
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; return c; };

async function newPage(ctxOpts = {}, init) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, ...ctxOpts });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
    const rq = route.request();
    if (rq.method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    gets.push(rq.url());
    const board = rq.url().split('/').pop();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ initials: 'WLD', score: 4321, extra: board.slice(13) || 'S1' }, { initials: 'TOP', score: 98765, extra: 'S5 CLEAR' }]) });
  });
  await ctx.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.route('**/fonts.gstatic.com/**', (r) => r.abort());
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  return { ctx, page };
}
async function boot(page, q) {
  await page.goto(base + q);
  await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
  await page.evaluate(async (V) => {
    const { hashW } = await import('./js/tests.js' + V);
    window.__keys = [];
    window.__vm.onKey = (W, kind) => window.__keys.push({ n: W.n, kind, h: hashW(W) });
  }, V);
}
// tick frames until cond() is true in the page (also lets real time pass for the game's own timers)
async function until(page, cond, maxTicks = 6000, chunk = 60, arg) {
  for (let n = 0; n < maxTicks; n += chunk) {
    if (await page.evaluate(cond, arg)) return true;
    await page.evaluate((c) => window.__vm.tick(c), chunk);
    await sleep(15);
  }
  return page.evaluate(cond, arg);
}
// waits in real time (the game's setTimeouts) while ticking a frame now and then
async function waitReal(page, cond, ms = 9000) {
  const T = Date.now();
  while (Date.now() - T < ms) { if (await page.evaluate(cond)) return true; await page.evaluate(() => window.__vm.tick(2)); await sleep(100); }
  return page.evaluate(cond);
}
// the current clip re-run in the page from its snapshot must match the live world's hash at the key tick
const clipExact = (page) => page.evaluate(async (V) => {
  const vm = window.__vm, c = vm.G.clip;
  if (!c) return { ok: false, info: 'no clip' };
  const { Replay } = await import('./js/replay.js' + V), { cloneWorld, STEP } = await import('./js/sim.js' + V), { hashW } = await import('./js/tests.js' + V);
  const key = window.__keys.filter((k) => k.n === c.keyN).pop();
  if (!key) return { ok: false, info: 'no live hash for tick ' + c.keyN };
  const rp = new Replay(cloneWorld(c.snap), c.inputs, c.keyN, c.endN);
  let h = null;
  while (!rp.done) { rp.advance(STEP); if (rp.W.n === c.keyN) h = hashW(rp.W); }
  return { ok: h === key.h, info: `${c.kind} clip ${((c.endN - c.snap.n) * STEP).toFixed(1)} s, key tick ${c.keyN}` };
}, V);
const state = (page) => page.evaluate(() => { const vm = window.__vm, G = vm.G, W = G.W; return { state: G.state, mode: G.mode, screen: G.screen, sector: W && W.sector, lives: W && W.lives, score: W && W.score, over: W && W.over, boss: !!(W && W.boss) }; });
const ls = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])));
const click = (page, sel) => page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return false; el.click(); return true; }, sel);
const visible = (page, sel) => page.evaluate((sel) => { const el = document.querySelector(sel); return !!el && !el.classList.contains('hidden') && !!el.offsetParent; }, sel);

try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  // ------------------------------------------------------------ options
  if (want('options')) {
    console.log('-- options');
    const { ctx, page } = await newPage();
    await boot(page, '?fixed&noscores');
    await click(page, '[data-act="options"]');
    const segs = { talk: 'off', flash: 'reduced', cam: 'room', shake: '0.4', rumble: 'off', assist: 'strong', touch: 'on', quality: 'low' };
    for (const [k, v] of Object.entries(segs)) await click(page, `#options .seg[data-opt="${k}"] button[data-v="${v}"]`);
    await click(page, '#title .seg[data-opt="diff"] button[data-v="hard"]');
    await page.evaluate(() => { for (const [k, v] of [['music', 30], ['sfx', 40], ['voice', 55]]) { const el = document.querySelector(`[data-set="${k}"]`); el.value = v; el.dispatchEvent(new Event('input')); } });
    await page.reload();
    await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
    const back = await page.evaluate(() => { const s = window.__vm.settings; const on = {}; for (const el of document.querySelectorAll('.seg')) { const b = el.querySelector('button.on'); on[el.dataset.opt] = b && b.dataset.v; } return { s, on, music: document.querySelector('[data-set="music"]').value, vol: window.__vm.A.vol, q: window.__vm.R.q.name }; });
    const all = Object.entries(segs).every(([k, v]) => String(back.s[k]) === v && back.on[k] === v);
    ok(all && back.s.diff === 'hard' && back.on.diff === 'hard', `all options + difficulty restored after a reload (${JSON.stringify(back.on)})`);
    ok(back.s.music === 30 && back.s.sfx === 40 && back.s.voice === 55 && back.music === '30' && Math.abs(back.vol.sfx - 0.4) < 1e-6, `volume sliders restored and applied (music ${back.s.music}, sfx ${back.s.sfx}, voice ${back.s.voice})`);
    ok(back.q === 'low', `graphics LOW applied after the reload (renderer tier ${back.q})`);
    const keys = Object.keys(await ls(page));
    ok(keys.length > 0 && keys.every((k) => k.startsWith('vm.')), `every saved key starts with vm. (${keys.join(', ')})`);
    await ctx.close();
  }

  // ------------------------------------------------------------ campaign: shop, medals, bests, replays, results, boards
  if (want('campaign')) {
    console.log('-- campaign meta (each sector starts at its lift room: &boss)');
    const { ctx, page } = await newPage();
    await boot(page, '?fixed&noscores&boss&q=low');
    await click(page, '[data-act="campaign"]');
    await page.evaluate(async (V) => { const { Autopilot } = await import('./js/ai.js' + V); window.__vm.G.ai = new Autopilot(5, 'demo'); }, V);
    const s0 = await state(page);
    ok(s0.mode === 'campaign' && s0.state === 'play' && s0.boss !== undefined, `START CAMPAIGN starts sector 1 (${JSON.stringify(s0)})`);
    const shopT = await until(page, () => window.__vm.G.state === 'upgrade' || window.__vm.G.state === 'results', 9000, 120);
    await waitReal(page, () => window.__vm.G.screen === 'upgrades' || window.__vm.G.screen === 'results', 4000);
    const st = await state(page);
    ok(shopT && st.screen === 'upgrades', `boss down -> lift -> the upgrade shop (${st.screen})`);
    await page.screenshot({ path: `${shots}/sys_shop.png` });
    const saved = await ls(page);
    const medals = JSON.parse(saved['vm.medals.v1'] || '[]'), bestT = JSON.parse(saved['vm.best.v1'] || '{}'), bestS = JSON.parse(saved['vm.bestsc.v1'] || '{}');
    ok(medals.length >= 1 && medals.every((m) => /^s0(clean|sweep|par)$/.test(m)), `sector 1 medals saved (${medals.join(' ')})`);
    ok(bestT.s0 > 0 && bestS.s0 > 0 && saved['vm.reach.v1'] === '1', `best time ${bestT.s0 && bestT.s0.toFixed(1)} s, best sector score ${bestS.s0}, sector 2 opened`);
    const shopInfo = await page.evaluate(() => ({ sub: document.getElementById('up-sub').textContent, salv: window.__vm.G.run.salvage, cards: document.querySelectorAll('#upgrid .upg').length, rep: !document.getElementById('up-replay').classList.contains('hidden'), kind: window.__vm.G.clip && window.__vm.G.clip.kind }));
    ok(shopInfo.cards === 5 && shopInfo.salv > 0 && /PTS/.test(shopInfo.sub), `shop: 5 upgrades, ${shopInfo.salv} salvage, "${shopInfo.sub}"`);
    ok(shopInfo.rep && shopInfo.kind === 'boss', `shop offers the boss-kill replay (${shopInfo.kind})`);
    const ce = await clipExact(page);
    ok(ce.ok, `boss-kill clip is bit exact in the page (${ce.info})`);
    // buying
    const buy = await page.evaluate(() => {
      // a boss-only sector earns ~300 salvage (points / SALVAGE): top it up so the buy test can afford a level
      const G = window.__vm.G;
      G.run.salvage = Math.max(G.run.salvage, 1000);
      const s0 = G.run.salvage;
      document.querySelector('[data-up="weapon"]').click();
      const s1 = G.run.salvage, lv = G.run.up.weapon, lit = document.querySelectorAll('[data-up="weapon"] .lvl em.on').length;
      G.run.salvage = 10; document.querySelector('[data-up="plate"]').click();
      const refused = !G.run.up.plate && G.run.salvage === 10;
      G.run.salvage = s1;
      return { s0, s1, lv, lit, refused };
    });
    ok(buy.s0 - buy.s1 === 400 && buy.lv === 1 && buy.lit === 1, `bought PULSE CARBINE 1 for 400 (salvage ${buy.s0} -> ${buy.s1})`);
    ok(buy.refused, 'a buy you cannot afford is refused');
    // the replay from the shop goes back to the shop
    await click(page, '#up-replay');
    const inRep = await state(page);
    await until(page, () => window.__vm.G.state !== 'replay', 1800, 60);
    const afterRep = await state(page);
    ok(inRep.state === 'replay' && afterRep.state === 'upgrade' && afterRep.screen === 'upgrades', `INSTANT REPLAY plays and returns to the shop (${inRep.state} -> ${afterRep.screen})`);
    // next sector with the upgrade
    await click(page, '[data-act="next"]');
    const s2 = await page.evaluate(() => ({ sector: window.__vm.W.sector, up: window.__vm.W.up, score: window.__vm.W.score, lives: window.__vm.W.lives, mode: window.__vm.G.mode }));
    ok(s2.sector === 1 && s2.up.weapon === 1 && s2.score > 0 && s2.mode === 'campaign', `NEXT SECTOR: sector 2 with the carbine fitted, score carried (${s2.score}), ${s2.lives} lives`);
    // a game over: nobody at the controls, last life
    await page.evaluate(() => { const vm = window.__vm; vm.G.ai = null; vm.W.lives = 1; });
    const over = await until(page, () => window.__vm.W.over, 6000, 120);
    await waitReal(page, () => window.__vm.G.screen === 'results', 5000);
    const rs = await page.evaluate(() => ({ screen: window.__vm.G.screen, title: document.getElementById('res-title').textContent, ini: !document.getElementById('ini-wrap').classList.contains('hidden'), medals: document.querySelectorAll('#res-medals .medal').length, rep: !document.querySelector('#res-btns [data-act="replay"]').classList.contains('hidden'), kind: window.__vm.G.clip && window.__vm.G.clip.kind, chars: window.__vm.G.ini && window.__vm.G.ini.chars.join('') }));
    ok(over && rs.screen === 'results' && rs.title === 'CONTAINED', `game over -> results "${rs.title}"`);
    ok(rs.ini && rs.medals >= 1, `results ask for initials (default ${rs.chars}) and list the run's new medals (${rs.medals})`);
    ok(rs.rep && rs.kind === 'death', `results offer the death replay (${rs.kind})`);
    const de = await clipExact(page);
    ok(de.ok, `death clip is bit exact in the page (${de.info})`);
    await click(page, '#res-btns [data-act="replay"]');
    await until(page, () => window.__vm.G.state !== 'replay', 1800, 60);
    ok((await state(page)).screen === 'results', 'the replay returns to the results with the initials still to enter');
    await page.screenshot({ path: `${shots}/sys_results.png` });
    for (const k of ['KeyZ', 'KeyQ', 'KeyX']) await page.keyboard.press(k);
    const typed = await page.evaluate(() => window.__vm.G.ini.chars.join(''));
    await page.keyboard.press('Enter');
    await sleep(300);
    const after = await page.evaluate(() => ({ screen: window.__vm.G.screen, local: JSON.parse(localStorage.getItem('vm.hs.voltmaze-2026') || '[]'), ini: localStorage.getItem('vm.initials') }));
    ok(typed === 'ZQX' && after.screen === 'title' && after.local.length === 1 && after.local[0].initials === 'ZQX' && /^S2/.test(after.local[0].extra) && after.ini === 'ZQX', `initials typed (${typed}), saved to the local board (${JSON.stringify(after.local[0])}), back on the title`);
    // title board tabs
    for (const t of ['endless', 'campaign']) for (const d of ['easy', 'normal', 'hard', 'nightmare']) { await click(page, `[data-tt="${t}"]`); await click(page, `[data-td="${d}"]`); await sleep(120); }
    const boards = [...new Set(gets.map((u) => u.split('/').pop()))].sort();
    ok(boards.length === 8 && boards.includes('voltmaze-2026') && boards.includes('voltmaze-2026-endless-nightmare') && boards.includes('voltmaze-2026-easy'), `title board tabs read all 8 boards (${boards.join(' ')})`);
    await click(page, '[data-tt="campaign"]'); await click(page, '[data-td="normal"]'); await sleep(200);
    const tb = await page.evaluate(() => ({ head: document.getElementById('tb-head').textContent, rows: document.querySelectorAll('#tb-list tr').length, txt: document.getElementById('tb-list').textContent }));
    ok(tb.rows === 2 && /TOP/.test(tb.txt), `title shows the world board (${tb.head}, ${tb.rows} rows)`);
    await page.screenshot({ path: `${shots}/sys_title_board.png` });
    await click(page, '[data-act="scores"]'); await sleep(250);
    const hs = await page.evaluate(() => ({ local: document.getElementById('hs-local').textContent, world: document.getElementById('hs-global').textContent, bt: document.getElementById('besttimes').textContent }));
    ok(/ZQX/.test(hs.local) && /TOP/.test(hs.world) && /PTS/.test(hs.bt), `high-score screen: local table, world table, best times + sector scores`);
    await page.screenshot({ path: `${shots}/sys_scores.png` });
    await click(page, '#scores [data-act="back"]');
    await click(page, '[data-act="medals"]');
    const md = await page.evaluate(() => ({ count: document.getElementById('med-count').textContent, on: document.querySelectorAll('#medlist .medal.on').length, all: document.querySelectorAll('#medlist .medal').length }));
    ok(md.all === 15 && md.on >= 1, `medals screen: ${md.count} (${md.all} medals listed)`);
    await click(page, '#medals [data-act="back"]');
    await click(page, '[data-act="sectors"]');
    const sc = await page.evaluate(() => [...document.querySelectorAll('#secgrid .sec')].map((b) => (b.disabled ? 'L' : 'O') + (/BEST/.test(b.textContent) ? '*' : '')).join(' '));
    ok(/^O\* O L L L$/.test(sc), `sector select: S1 best shown, S2 open, rest locked (${sc})`);
    await click(page, '#sectors [data-act="back"]');
    // pause during play shows the replay of the last hit
    await page.evaluate(async (V) => { const vm = window.__vm; vm.startCampaign(1); vm.G.ai = null; }, V);
    await until(page, () => window.__vm.W.stats.deaths > 0, 4000, 60);
    await until(page, () => !!window.__vm.G.clip, 400, 30);
    await page.keyboard.press('Escape');
    const ps = await page.evaluate(() => ({ state: window.__vm.G.state, screen: window.__vm.G.screen, rep: !document.getElementById('pause-replay').classList.contains('hidden') }));
    ok(ps.state === 'paused' && ps.screen === 'pause' && ps.rep, `ESC pauses; the pause screen offers the last hit's replay (${JSON.stringify(ps)})`);
    await click(page, '#pause-replay');
    await until(page, () => window.__vm.G.state !== 'replay', 1800, 60);
    ok((await state(page)).screen === 'pause', 'replay from the pause screen returns to the pause screen');
    await page.keyboard.press('Escape');
    ok((await state(page)).state === 'play', 'ESC resumes');
    ok(posts === 0, 'no score POSTs');
    await ctx.close();
  }

  // ------------------------------------------------------------ AI PLAYTHROUGH
  if (want('playthrough')) {
    console.log('-- AI playthrough');
    const { ctx, page } = await newPage();
    await boot(page, '?fixed&noscores&boss&q=low');
    const ls0 = await ls(page);
    await click(page, '[data-act="playthrough"]');
    const p0 = await state(page);
    ok(p0.mode === 'playthrough' && await visible(page, '#demo-badge'), `AI PLAYTHROUGH runs with its badge (${p0.mode})`);
    // a boss-only sector earns ~300 salvage (points / SALVAGE): give the autopilot enough to buy something
    await page.evaluate(() => { window.__vm.G.run.salvage = 800; });
    await until(page, () => window.__vm.G.state === 'upgrade', 9000, 120);
    await waitReal(page, () => window.__vm.G.screen === 'upgrades', 4000);
    const shop = await page.evaluate(() => ({ screen: window.__vm.G.screen, picks: [...document.querySelectorAll('#upgrid .upg.pick')].map((b) => b.dataset.up + ':' + b.querySelector('.aitag').textContent), sub: document.getElementById('up-sub').textContent }));
    ok(shop.screen === 'upgrades' && shop.picks.length >= 1, `shop shows the autopilot's picks highlighted (${shop.picks.join(', ')})`);
    await page.screenshot({ path: `${shots}/sys_playthrough_shop.png` });
    const adv = await waitReal(page, () => window.__vm.G.state === 'play' && window.__vm.W.sector === 1, 9000);
    ok(adv, 'the playthrough moves on to sector 2 by itself');
    // a game over is retried
    await page.evaluate(() => { const W = window.__vm.W; W.lives = 0; for (const p of W.players) { p.alive = false; p.deadT = 5; } });
    await until(page, () => window.__vm.W.over, 120, 10);
    const retried = await waitReal(page, () => window.__vm.G.state === 'play' && window.__vm.G.run.tries === 1, 9000);
    const pr = await page.evaluate(() => ({ mode: window.__vm.G.mode, sector: window.__vm.W.sector, tries: window.__vm.G.run.tries, lives: window.__vm.W.lives }));
    ok(retried && pr.mode === 'playthrough' && pr.sector === 1 && pr.lives > 0, `game over -> the autopilot retries the sector (${JSON.stringify(pr)})`);
    const ls1 = await ls(page);
    ok(!Object.keys(ls1).some((k) => k.startsWith('vm.hs.') || k === 'vm.medals.v1' || k === 'vm.best.v1' || k === 'vm.bestsc.v1') && JSON.stringify(ls0) === JSON.stringify(ls1), `nothing saved: no scores, medals or bests (${Object.keys(ls1).join(', ') || 'no keys'})`);
    await page.keyboard.press('Escape');
    ok((await state(page)).mode === 'title', 'ESC stops the playthrough');
    await ctx.close();
  }

  // ------------------------------------------------------------ attract demo
  if (want('demo')) {
    console.log('-- attract demo');
    const { ctx, page } = await newPage();
    await boot(page, '?fixed&noscores&q=low');
    await page.evaluate(() => window.__vm.tick(60 * 11));
    const before = (await state(page)).mode;
    await page.evaluate(() => window.__vm.tick(60 * 2));
    const d0 = await page.evaluate(() => ({ mode: window.__vm.G.mode, cap: document.getElementById('caption').textContent }));
    ok(before === 'title' && d0.mode === 'demo' && /FITTED/.test(d0.cap), `idle on the title ~12 s -> the attract demo ("${d0.cap}")`);
    let sawBoss = false, t = 0, maxSlow = 0;
    for (; t < 95 * 60; t += 120) {
      const r = await page.evaluate(() => { window.__vm.tick(120); const vm = window.__vm; return { boss: !!(vm.W && vm.W.boss && vm.G.mode === 'demo'), mode: vm.G.mode, ts: vm.G.timeScale }; });
      if (r.boss && !sawBoss) { sawBoss = true; await page.screenshot({ path: `${shots}/sys_demo_boss.png` }); }
      maxSlow = Math.max(maxSlow, 1 - r.ts);
      if (r.mode !== 'demo') break;
      if (sawBoss && t > 60 * 50) break;
    }
    const log = await page.evaluate(() => window.__vm.G.slowLog || []);
    ok(sawBoss, `the demo reaches the boss (${(t / 60).toFixed(0)} s of demo)`);
    ok(log.every((q) => /^(death:|bossdown)/.test(q.why) && q.shot >= 1), `slow-mo only on deaths / boss kills, camera framed on them (${log.map((q) => q.why + '/' + q.shot).join(' ') || 'none'})`);
    const sk = await state(page);
    await page.keyboard.press('KeyK');
    await page.evaluate(() => window.__vm.tick(2));
    await sleep(1800);
    await page.evaluate(() => window.__vm.tick(2));
    ok((await state(page)).mode === 'title', `any key ends the demo and it stays ended (pressed in state ${sk.state})`);
    ok(!(await page.evaluate(() => (window.__vm.lines || []).length)), 'the demo never speaks');
    await ctx.close();
  }

  // ------------------------------------------------------------ gamepad
  if (want('pad')) {
    console.log('-- gamepad');
    const init = () => {
      const btn = () => ({ pressed: false, touched: false, value: 0 });
      window.__pad = { id: 'Fake standard pad', index: 0, connected: true, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, btn),
        vibrationActuator: { type: 'dual-rumble', playEffect: (type, o) => { (window.__rumbles ||= []).push([type, o.duration, o.strongMagnitude]); return Promise.resolve('complete'); } } };
      navigator.getGamepads = () => [window.__pad, null, null, null];
      window.__press = (i, v) => { window.__pad.buttons[i].pressed = !!v; window.__pad.buttons[i].value = v ? 1 : 0; };
    };
    const { ctx, page } = await newPage({}, init);
    await boot(page, '?fixed&noscores&q=low');
    const tap = async (i) => { await page.evaluate((i) => { window.__press(i, 1); window.__vm.tick(2); window.__press(i, 0); window.__vm.tick(2); }, i); };
    const sel0 = await page.evaluate(() => document.querySelector('.sel') && document.querySelector('.sel').dataset.act);
    await tap(13);
    const sel1 = await page.evaluate(() => document.querySelector('.sel') && document.querySelector('.sel').dataset.act);
    await tap(0);
    const scr = (await state(page)).screen;
    await tap(1);
    const scr2 = (await state(page)).screen;
    ok(sel0 === 'campaign' && sel1 === 'sectors' && scr === 'sectors' && scr2 === 'title', `pad menus: d-pad moves (${sel0} -> ${sel1}), A opens (${scr}), B goes back (${scr2})`);
    const pad = await page.evaluate(() => {
      const vm = window.__vm; vm.startCampaign(0); vm.G.ai = null; vm.tick(30);
      vm.W.graceT = 1e9;   // a wall or a bolt only bounces you while the controls are tested
      const p = vm.W.players[0], x0 = p.x, z0 = p.z, inward = { w: [1, 0], e: [-1, 0], n: [0, 1], s: [0, -1] }[vm.W.room.entry];
      // the camera may be turned; push the stick toward the room centre on screen
      window.__pad.axes = [inward[0], inward[1], 0, 0]; vm.tick(30);
      const moved = Math.hypot(p.x - x0, p.z - z0);
      window.__pad.axes = [0, 0, 0, 0]; vm.tick(20);
      const s0 = vm.W.stats.shots, r0 = (window.__rumbles || []).length, x1 = p.x, z1 = p.z;
      window.__press(0, 1); window.__pad.axes = [inward[0], inward[1], 0, 0]; vm.tick(40); window.__press(0, 0); window.__pad.axes = [0, 0, 0, 0]; vm.tick(4);
      const planted = Math.hypot(p.x - x1, p.z - z1), fired = vm.W.stats.shots - s0;
      const s1 = vm.W.stats.shots;
      window.__pad.axes = [0, 0, 0, 1]; vm.tick(40); window.__pad.axes = [0, 0, 0, 0]; vm.tick(2);
      return { moved, planted, fired, stick: vm.W.stats.shots - s1, rumbles: (window.__rumbles || []).length - r0, alive: p.alive && vm.W.stats.deaths === 0 };
    });
    ok(pad.moved > 1 && pad.alive, `left stick runs (${pad.moved.toFixed(2)} m)`);
    ok(pad.fired >= 2 && pad.planted < 0.4, `hold A: feet planted (${pad.planted.toFixed(2)} m) and firing (${pad.fired} shots)`);
    ok(pad.stick >= 2, `right stick aims + fires (${pad.stick} shots)`);
    ok(pad.rumbles >= 2, `rumble on firing (${pad.rumbles} rumble effects)`);
    await tap(9);
    const p1 = await state(page);
    await tap(9);
    const p2 = await state(page);
    ok(p1.state === 'paused' && p2.state === 'play', `Start pauses and resumes (${p1.state} -> ${p2.state})`);
    await page.evaluate(() => { window.__vm.settings.rumble = 'off'; window.__rumbles = []; window.__press(7, 1); window.__vm.tick(30); window.__press(7, 0); });
    ok(!(await page.evaluate(() => window.__rumbles.length)), 'VIBRATION OFF: no rumble');
    await ctx.close();
  }

  // ------------------------------------------------------------ touch (phone)
  if (want('touch')) {
    console.log('-- touch');
    const init = () => { window.__vib = []; navigator.vibrate = (ms) => { window.__vib.push(ms); return true; }; };
    for (const [w, h, name] of [[412, 915, 'portrait'], [915, 412, 'landscape']]) {
      const { ctx, page } = await newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 }, init);
      await boot(page, '?fixed&noscores&q=low');
      await page.screenshot({ path: `${shots}/sys_touch_title_${name}.png` });
      const r = await page.evaluate(async () => {
        const vm = window.__vm;
        vm.startCampaign(0); vm.G.ai = null; vm.tick(40);
        vm.W.graceT = 1e9;   // a wall or a bolt only bounces you while the controls are tested
        const touchOn = !document.getElementById('touch').classList.contains('hidden');
        const cv = document.getElementById('gl'), W = innerWidth, H = innerHeight;
        const ev = (type, id, x, y, el = cv) => el.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, cancelable: true, isPrimary: id === 1 }));
        const p = vm.W.players[0], x0 = p.x, z0 = p.z;
        // the left thumb: drag toward the room centre on screen
        const c = vm.R.camera, v = { x: 0, y: 0, z: 0 };
        vm.R.project(0, 0, 0, v);
        const P = { x: 0, y: 0, z: 0 }; vm.R.project(p.x, 0, p.z, P);
        const dx = v.x - P.x, dy = v.y - P.y, l = Math.hypot(dx, dy) || 1;
        const lx = W * 0.2, ly = H * 0.75;
        ev('pointerdown', 1, lx, ly); ev('pointermove', 1, lx + dx / l * 50, ly + dy / l * 50); vm.tick(30);
        const moved = Math.hypot(p.x - x0, p.z - z0);
        const stickShown = document.getElementById('stick-move').classList.contains('on');
        ev('pointerup', 1, lx, ly); vm.tick(10);
        // the right thumb aims and fires
        const s0 = vm.W.stats.shots, v0 = window.__vib.length;
        const rx = W * 0.8, ry = H * 0.75;
        ev('pointerdown', 2, rx, ry); ev('pointermove', 2, rx + dx / l * 40, ry + dy / l * 40); vm.tick(40);
        const fired = vm.W.stats.shots - s0, vib = window.__vib.length - v0;
        const aimShown = document.getElementById('stick-aim').classList.contains('on');
        // EMP button while aiming
        const e0 = p.emp, btn = document.getElementById('tb-emp');
        ev('pointerdown', 3, 0, 0, btn); vm.tick(6); ev('pointerup', 3, 0, 0, btn); vm.tick(4);
        const emp = e0 - p.emp;
        const box = (id) => { const b = document.getElementById(id).getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
        const inside = ['tb-emp', 'tb-pause'].every((id) => { const b = box(id); return b.l >= 0 && b.t >= 0 && b.r <= W && b.b <= H && b.r > b.l; });
        const hud = document.querySelector('#hud .panel.hl').getBoundingClientRect(), eb = box('tb-emp');
        const overlap = !(eb.r < hud.left || eb.l > hud.right || eb.b < hud.top || eb.t > hud.bottom);
        return { touchOn, moved, stickShown, fired, aimShown, vib, emp, inside, overlap, kind: vm.I.lastKind, alive: p.alive && vm.W.stats.deaths === 0 };
      });
      await page.screenshot({ path: `${shots}/sys_touch_play_${name}.png` });
      ok(r.touchOn, `${name}: touch controls shown in play`);
      ok(r.moved > 0.8 && r.stickShown && r.alive, `${name}: left thumb runs (${r.moved.toFixed(2)} m, stick drawn)`);
      ok(r.fired >= 2 && r.aimShown, `${name}: right thumb aims + fires (${r.fired} shots)`);
      ok(r.vib >= 1, `${name}: phone vibration on firing (${r.vib} calls)`);
      ok(r.emp === 1, `${name}: EMP button fires an EMP`);
      ok(r.inside && !r.overlap, `${name}: buttons inside the screen and clear of the score panel`);
      await ctx.close();
    }
  }

  for (const e of errors) console.log('ERROR', e);
  if (errors.length) fails++;
  if (posts) { console.log(`score POSTs: ${posts}`); fails++; }
  console.log(fails ? `systems check FAILED (${fails})` : 'systems check passed: no console errors, no score posts');
} catch (e) { console.error(e); fails++; }
finally { if (browser) await browser.close(); release(); console.log(`edge lock held ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
process.exit(fails ? 1 : 0);
