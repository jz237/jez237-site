// Meta-systems check (Playwright + headless Edge, ?fixed pages driven by __rs.tick): every system around
// the core game.
//   boards     the title world board asks for the right board per mode / difficulty tab (8 boards), game
//              over asks for initials, typed initials go to the local table and into the body that would be
//              posted ({initials, score, level, extra}) - nothing is ever sent (WebDriver = NO_POST), POSTs
//              are intercepted and must stay 0
//   replay     the instant replay of a death and of a boss kill is bit exact (the whole world at the key
//              tick equals the live world)
//   shop       salvage buys levels, poor / maxed cards refuse, NEXT SECTOR carries the upgrades
//   progress   a full sector clear stores best time + best sector score + medals + the reached sector; they
//              survive a reload and show in the medal count and sector select
//   options    every option persists (all keys start with rs.), reduced flash takes effect, quality tier
//   gamepad    a fake pad navigates menus, steers, fires and rumbles on a death
//   touch      phone portrait + landscape: drag steers and fires, PURGE / HOP buttons work, buttons stay on
//              screen clear of the HUD, the phone vibrates on a death (screenshots sys_phone_*.png)
//   demo       the attract demo starts from the title by itself, reaches a boss, shows its upgrades, and every
//              slow-motion moment is framed on its cause
//   playthrough the AI PLAYTHROUGH highlights its shop picks and writes no scores, medals or bests
//   node scripts/rimstorm/systems_check.mjs [baseUrl] [shotDir]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const shots = process.argv[3] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [], gets = [];
let posts = 0, fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BOARD_ROWS = (name) => JSON.stringify([{ initials: 'TOP', score: 900000 + name.length * 1000, level: 3 }, { initials: name.slice(-3).toUpperCase().replace(/[^A-Z]/g, 'X'), score: 1000 + name.length }]);
async function context(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, ...opts });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
    const req = route.request();
    if (req.method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    const name = decodeURIComponent(new URL(req.url()).pathname.split('/').pop());
    gets.push(name);
    return route.fulfill({ status: 200, contentType: 'application/json', body: BOARD_ROWS(name) });
  });
  return ctx;
}
async function open(ctx, query, tag) {
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  await page.goto(base + query);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  return page;
}
// run the fixed-step page until a condition holds (or a frame budget runs out)
const runUntil = (page, cond, frames = 20000, each = '') => page.evaluate(({ cond, frames, each }) => {
  const rs = window.__rs, f = new Function('rs', 'return ' + cond), e = each ? new Function('rs', each) : null;
  let i = 0;
  for (; i < frames && !f(rs); i++) { if (e) e(rs); rs.tick(1); }
  return i;
}, { cond, frames, each });
// test-only cheat: clear the web or soften the boss (the world is touched outside step, on purpose)
const RUSH = `const W = rs.W; if (rs.G.state !== 'play') return; if (W.phase === 'fight' && !W.boss) { W.spawnQ = []; for (const e of W.enemies) e.hp = 0; } if (W.boss && W.boss.state === 'fight') { W.boss.hp = Math.min(W.boss.hp, 1); for (const h of W.boss.heads) h.hp = 0; if (W.boss.segs) W.boss.segs.fill(0); if (W.boss.eye) W.boss.eye.open = true; }`;
const lsKeys = (page) => page.evaluate(() => Object.keys(localStorage));

// ------------------------------------------------------------------ 1. boards, initials, death replay
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'boards');
  // every tab of the title board
  const tabs = await p.evaluate(async () => {
    const out = [];
    for (const tb of ['campaign', 'endless']) for (const td of ['easy', 'normal', 'hard', 'nightmare']) {
      document.querySelector(`[data-tb="${tb}"]`).click(); document.querySelector(`[data-td="${td}"]`).click();
      await new Promise((r) => setTimeout(r, 120));
      out.push({ tb, td, text: document.getElementById('tboard').textContent, on: document.querySelector(`[data-td="${td}"]`).classList.contains('on') && document.querySelector(`[data-tb="${tb}"]`).classList.contains('on') });
    }
    return out;
  });
  await p.evaluate(() => window.__rs.tick(30)); await p.screenshot({ path: `${shots}/sys_title_board.png` });
  const want = ['rimstorm-2026-easy', 'rimstorm-2026', 'rimstorm-2026-hard', 'rimstorm-2026-nightmare', 'rimstorm-2026-endless-easy', 'rimstorm-2026-endless', 'rimstorm-2026-endless-hard', 'rimstorm-2026-endless-nightmare'];
  ok(want.every((b) => gets.includes(b)), `the title board fetches all 8 boards (${[...new Set(gets)].length} distinct GETs)`);
  ok(tabs.every((t) => t.on && /TOP/.test(t.text) && new RegExp((900000 + ('rimstorm-2026' + (t.tb === 'endless' ? '-endless' : '') + (t.td === 'normal' ? '' : '-' + t.td)).length * 1000).toLocaleString('en-US')).test(t.text)), `each tab shows its own board (${tabs.map((t) => t.tb[0] + t.td[0]).join(' ')})`);
  // game over: initials, local table, the body that would be posted, the instant replay of the death
  const r = await p.evaluate(async () => {
    const rs = window.__rs;
    rs.startCampaign(0, 1);
    const W = rs.W; W.lives = 1; W.score = 7777; W.lifePts = 7777;
    for (let i = 0; i < 60 * 150 && rs.G.state === 'play'; i++) rs.tick(1);
    await new Promise((r) => setTimeout(r, 1600)); rs.tick(2);
    return { screen: rs.G.screen, ini: !document.getElementById('ini-wrap').classList.contains('hidden'), clip: rs.G.clip && rs.G.clip.kind, cont: !document.getElementById('res-cont').classList.contains('hidden') };
  });
  ok(r.screen === 'results' && r.ini, 'game over asks for initials');
  await p.evaluate(() => window.__rs.tick(30)); await p.screenshot({ path: `${shots}/sys_results.png` });
  ok(r.clip === 'death' && r.cont, 'a death clip is kept and the checkpoint CONTINUE is offered');
  const rep = await p.evaluate(() => { const rs = window.__rs; rs.playReplay(); let i = 0; for (; i < 1500 && rs.G.state === 'replay'; i++) rs.tick(1); return { exact: rs.G.replayExact, frames: i, back: rs.G.screen }; });
  ok(rep.exact === true && rep.back === 'results', `the death replay is bit exact (${rep.frames} frames, back on ${rep.back})`);
  for (const k of ['KeyR', 'KeyS', 'KeyX']) await p.keyboard.press(k);
  await p.keyboard.press('Enter');
  await sleep(300);
  const post = await p.evaluate(() => ({ last: window.__rs.Scores.last, local: JSON.parse(localStorage.getItem('rs.hs.rimstorm-2026') || '[]'), state: window.__rs.G.state, best: document.getElementById('title-best').textContent, ini: localStorage.getItem('rs.initials') }));
  const L = post.last || {};
  ok(L.board === 'rimstorm-2026' && L.body && L.body.initials === 'RSX' && L.body.score >= 7777 && /^S1W\d/.test(L.body.extra) && L.sent === false, `the score body for ${L.board}: ${JSON.stringify(L.body)} (not sent: NO_POST)`);
  ok(post.local.some((q) => q.initials === 'RSX' && q.score >= 7777) && post.ini === 'RSX', 'the local table keeps it and the initials are remembered (rs.initials)');
  ok(post.state === 'title' && /7,777/.test(post.best), `back on the title: ${post.best}`);
  // hard endless goes to its own board
  const h = await p.evaluate(async () => {
    const rs = window.__rs;
    document.querySelector('.seg[data-opt="diff"] [data-v="hard"]').click();
    rs.startEndless();
    rs.W.lives = 1; rs.W.score = 3333;
    for (let i = 0; i < 60 * 150 && rs.G.state === 'play'; i++) rs.tick(1);
    await new Promise((r) => setTimeout(r, 1600)); rs.tick(2);
    rs.act('done');
    await new Promise((r) => setTimeout(r, 200));
    const out = { last: rs.Scores.last, diff: rs.settings.diff };
    document.querySelector('.seg[data-opt="diff"] [data-v="normal"]').click();
    return out;
  });
  ok(h.last && h.last.board === 'rimstorm-2026-endless-hard' && /^W\d+/.test(h.last.body.extra), `HARD endless posts to ${h.last && h.last.board} (${h.last && h.last.body.extra})`);
  // the scores screen: tabs, local + world, best times
  const sc = await p.evaluate(async () => {
    const rs = window.__rs; rs.act('scores');
    document.querySelector('[data-tab="campaign"]').click(); document.querySelector('[data-hd="normal"]').click();
    await new Promise((r) => setTimeout(r, 200));
    const a = { local: document.getElementById('hs-local').textContent, world: document.getElementById('hs-global').textContent, best: document.getElementById('besttimes').children.length };
    rs.act('back');
    return a;
  });
  ok(/RSX/.test(sc.local) && /TOP/.test(sc.world) && sc.best === 5, 'the HIGH SCORES screen shows this device, the world board and 5 sector bests');
  await ctx.close();
}

// ------------------------------------------------------------------ 2. boss replay, shop, full sector: medals + bests
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'shop');
  const r = await p.evaluate(async () => {
    const rs = window.__rs;
    rs.G.autopilot = true;
    rs.startCampaign(0, 4);
    for (let i = 0; i < 60 * 240 && rs.G.state === 'play'; i++) rs.tick(1);
    await new Promise((r) => setTimeout(r, 1600)); rs.tick(2);
    return { screen: rs.G.screen, clip: rs.G.clip && rs.G.clip.kind, salv: rs.G.run.salvage, earned: rs.G.run.earned, sub: document.getElementById('up-sub').textContent, replayBtn: !document.querySelector('#upgrades [data-act="replay"]').classList.contains('hidden'), medals: JSON.parse(localStorage.getItem('rs.medals.v1') || '[]').length, best: localStorage.getItem('rs.best.v1') };
  });
  ok(r.screen === 'upgrades' && r.clip === 'boss' && r.replayBtn, `the boss falls: shop with the boss-kill replay (${r.sub})`);
  ok(r.medals === 0 && (!r.best || r.best === '{}'), 'a sector started at its boss earns no medals or best time');
  const rep = await p.evaluate(() => { const rs = window.__rs; rs.playReplay(); let i = 0; for (; i < 1500 && rs.G.state === 'replay'; i++) rs.tick(1); return { exact: rs.G.replayExact, back: rs.G.screen }; });
  ok(rep.exact === true && rep.back === 'upgrades', 'the boss-kill replay is bit exact and returns to the shop');
  const shop = await p.evaluate(() => {
    const rs = window.__rs, G = rs.G;
    G.run.salvage = 2000;
    const card = (k) => document.querySelector(`#upgrid [data-up="${k}"]`);
    card('rate').click();
    const a = { salv: G.run.salvage, rate: G.run.up.rate };
    card('droid').click(); card('droid').click();
    const b = { salv: G.run.salvage, droid: G.run.up.droid, max: card('droid').classList.contains('max') };
    card('barrel').click();
    const c = { salv: G.run.salvage, barrel: G.run.up.barrel || 0, poor: card('barrel').classList.contains('poor') };
    rs.act('next');
    return { a, b, c, up: { ...rs.W.up }, sector: rs.W.sector };
  });
  ok(shop.a.salv === 1500 && shop.a.rate === 1, `buying FIRE RATE costs 500 (salvage ${shop.a.salv})`);
  ok(shop.b.salv === 1000 && shop.b.droid === 1 && shop.b.max, 'GUARD DROID maxes at one level, a second click is refused');
  ok(shop.c.salv === 500 && shop.c.barrel === 1, `LONG BARREL bought down to ${shop.c.salv}`);
  ok(shop.sector === 1 && shop.up.rate === 1 && shop.up.droid === 1 && shop.up.barrel === 1, `NEXT SECTOR carries the upgrades into sector 2 (${JSON.stringify(shop.up)})`);
  await p.evaluate(() => window.__rs.toTitle());
  // a full, quick, clean sector 1 (the test clears each web for the autopilot)
  const n = await runUntil(p, "rs.G.state !== 'play' && rs.G.mode === 'campaign'", 60 * 400, `if (!rs._go) { rs._go = 1; rs.G.autopilot = true; rs.startCampaign(0, 0); } ${RUSH}`);
  await sleep(1600); await p.evaluate(() => window.__rs.tick(2));
  const full = await p.evaluate(() => ({ screen: window.__rs.G.screen, sub: document.getElementById('up-sub').textContent, medals: JSON.parse(localStorage.getItem('rs.medals.v1') || '[]'), best: JSON.parse(localStorage.getItem('rs.best.v1') || '{}'), sc: JSON.parse(localStorage.getItem('rs.bestsc.v1') || '{}'), reach: localStorage.getItem('rs.reach.v1') }));
  ok(full.screen === 'upgrades' && /NEW BEST TIME/.test(full.sub) && /MEDAL/.test(full.sub), `a full sector 1 clear (${n} frames): ${full.sub}`);
  ok(full.medals.includes('s0clean') && full.medals.includes('s0par') && full.best.s0 > 0 && full.sc.s0 > 0 && full.reach === '1', `medals ${full.medals.join(',')}, best ${full.best.s0 && full.best.s0.toFixed(1)} s / ${full.sc.s0} pts, reach ${full.reach}`);
  await p.reload();
  await p.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  const after = await p.evaluate(() => { const rs = window.__rs; rs.act('sectors'); const b = [...document.querySelectorAll('#secgrid .sec')]; return { med: document.getElementById('med-sub').textContent, s1: b[0].textContent, s2open: !b[1].hasAttribute('disabled'), s3open: !b[2].hasAttribute('disabled') }; });
  ok(/^2 \/ 15$/.test(after.med) && /BEST \d+:\d+\.\d · [\d,]+ PTS/.test(after.s1) && after.s2open && !after.s3open, `after a reload: medals ${after.med}, sector select "${after.s1.slice(0, 80)}", sector 2 open`);
  const keys = await lsKeys(p);
  ok(keys.every((k) => k.startsWith('rs.')), `every localStorage key starts with rs. (${keys.join(', ')})`);
  await ctx.close();
}

// ------------------------------------------------------------------ 3. options persist
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'options');
  await p.evaluate(() => {
    const rs = window.__rs; rs.act('options');
    const pick = (o, v) => document.querySelector(`.seg[data-opt="${o}"] [data-v="${v}"]`).click();
    pick('talk', 'off'); pick('flash', 'reduced'); pick('rumble', 'off'); pick('quality', 'low'); pick('sens', '1.4'); pick('shake', '0'); pick('touch', 'on');
    for (const [k, v] of [['music', 20], ['sfx', 35], ['voice', 40]]) { const el = document.querySelector(`[data-set="${k}"]`); el.value = v; el.dispatchEvent(new Event('input')); }
  });
  await p.reload();
  await p.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  const o = await p.evaluate(() => { const rs = window.__rs; return { s: { ...rs.settings }, calm: rs.CALM.on, q: rs.quality.name, vol: { ...rs.A.vol }, sens: rs.I.sens, slider: document.querySelector('[data-set="music"]').value }; });
  ok(o.s.talk === 'off' && o.s.flash === 'reduced' && o.s.rumble === 'off' && o.s.quality === 'low' && o.s.sens === '1.4' && o.s.shake === '0' && o.s.touch === 'on', 'narration, flashes, vibration, quality, spinner speed, shake and touch survive a reload');
  ok(o.s.music === 20 && o.s.sfx === 35 && o.s.voice === 40 && o.slider === '20' && Math.abs(o.vol.sfx - 0.35) < 1e-6, `music / sound / voice volumes survive (${o.s.music}/${o.s.sfx}/${o.s.voice})`);
  ok(o.calm && o.q === 'low' && o.sens === 1.4, `reduced flash is on, the LOW quality tier is in use, spinner ${o.sens}`);
  const keys = await lsKeys(p);
  ok(keys.length > 0 && keys.every((k) => k.startsWith('rs.')), `option keys: ${keys.join(', ')}`);
  await ctx.close();
}

// ------------------------------------------------------------------ 4. gamepad
{
  const ctx = await context();
  await ctx.addInitScript(() => {
    const B = () => ({ pressed: false, touched: false, value: 0 });
    window.__pad = { id: 'Test pad (STANDARD GAMEPAD)', index: 0, connected: true, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, B),
      vibrationActuator: { type: 'dual-rumble', playEffect: (t, o) => { (window.__rumbles ||= []).push([t, o.duration, o.strongMagnitude]); return Promise.resolve('complete'); } } };
    Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => [window.__pad, null, null, null] });
  });
  const p = await open(ctx, '?fixed&noscores', 'pad');
  const press = (b, on) => p.evaluate(({ b, on }) => { const x = window.__pad.buttons[b]; x.pressed = on; x.value = on ? 1 : 0; }, { b, on });
  const tap = async (b) => { await press(b, true); await p.evaluate(() => window.__rs.tick(2)); await press(b, false); await p.evaluate(() => window.__rs.tick(2)); };
  const sel0 = await p.evaluate(() => document.querySelector('#title .sel') && document.querySelector('#title .sel').dataset.act);
  await tap(13);
  const sel1 = await p.evaluate(() => document.querySelector('#title .sel') && document.querySelector('#title .sel').dataset.act);
  await tap(0);
  const scr = await p.evaluate(() => window.__rs.G.screen);
  await tap(1);
  const back = await p.evaluate(() => window.__rs.G.screen);
  ok(sel0 === 'campaign' && sel1 === 'sectors' && scr === 'sectors' && back === 'title', `d-pad moves the menu (${sel0} -> ${sel1}), A opens ${scr}, B goes back to ${back}`);
  const play = await p.evaluate(() => {
    const rs = window.__rs, pad = window.__pad;
    rs.startCampaign(0, 0);
    const W = rs.W, P = W.players[0];
    rs.tick(60 * 3);
    const lane0 = P.lane, shots0 = W.stats.shots;
    pad.axes[0] = -1; pad.buttons[0].pressed = true; pad.buttons[0].value = 1;
    rs.tick(40);
    pad.axes[0] = 0; rs.tick(10);
    const lane1 = P.lane, shots1 = W.stats.shots;
    pad.buttons[0].pressed = false; pad.buttons[0].value = 0;
    // stand still until the web gets the Rimrunner
    window.__rumbles = [];
    for (let i = 0; i < 60 * 120 && W.stats.deaths === 0; i++) rs.tick(1);
    return { lane0, lane1, nl: W.nl, shots: shots1 - shots0, deaths: W.stats.deaths, rumbles: window.__rumbles.length, kind: rs.I.lastKind };
  });
  ok(play.lane1 !== play.lane0 && play.shots > 3, `the stick steers (lane ${play.lane0} -> ${play.lane1}) and A fires (${play.shots} shots)`);
  ok(play.deaths > 0 && play.rumbles > 0, `a death rumbles the pad (${play.rumbles} effects, last input ${play.kind})`);
  await p.evaluate(() => window.__rs.toTitle());
  await ctx.close();
}

// ------------------------------------------------------------------ 5. touch, portrait and landscape
for (const [w, h, tag] of [[390, 844, 'portrait'], [844, 390, 'landscape']]) {
  const ctx = await context({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'vibrate', { configurable: true, value: (ms) => { (window.__vib ||= []).push(ms); return true; } }); });
  const p = await open(ctx, '?fixed&noscores', 'touch-' + tag);
  const cdp = await ctx.newCDPSession(p);
  await p.evaluate(() => { window.__rs.startCampaign(0, 0); window.__rs.tick(60 * 4); });
  const lay = await p.evaluate(() => {
    const r = (id) => { const b = document.getElementById(id).getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width }; };
    const vis = (id) => !document.getElementById(id).classList.contains('hidden');
    return { touch: vis('touch'), purge: r('tb-purge'), hop: r('tb-hop'), pause: r('tb-pause'), panels: [...document.querySelectorAll('#hud .panel')].filter((e) => e.offsetParent).map((e) => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; }), W: innerWidth, H: innerHeight, isTouch: window.__rs.I.isTouch };
  });
  const inside = (a) => a.l >= 0 && a.t >= 0 && a.r <= lay.W && a.b <= lay.H;
  const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
  ok(lay.isTouch && lay.touch, `${tag}: touch controls show on a phone`);
  ok(inside(lay.purge) && inside(lay.hop) && inside(lay.pause) && !hit(lay.purge, lay.hop) && !lay.panels.some((q) => hit(q, lay.purge) || hit(q, lay.hop) || hit(q, lay.pause)), `${tag}: PURGE, HOP and pause sit on screen, clear of each other and of the HUD`);
  await p.screenshot({ path: `${shots}/sys_phone_${tag}.png` });
  // drag along the rim with one thumb (it fires while down)
  const st = await p.evaluate(() => ({ pos: window.__rs.W.players[0].pos, shots: window.__rs.W.stats.shots }));
  const y = Math.round(h * 0.7), x0 = Math.round(w * 0.2);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y, id: 1 }] });
  for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + i * 22, y, id: 1 }] }); await p.evaluate(() => window.__rs.tick(3)); }
  await p.evaluate(() => window.__rs.tick(20));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const mv = await p.evaluate(() => ({ pos: window.__rs.W.players[0].pos, shots: window.__rs.W.stats.shots, nl: window.__rs.W.nl }));
  let d = Math.abs(mv.pos - st.pos); d = Math.min(d, mv.nl - d);
  ok(d >= 1.5 && mv.shots > st.shots, `${tag}: a thumb drag slides ${d.toFixed(1)} lanes and fires (${mv.shots - st.shots} shots)`);
  // PURGE button
  const pb = lay.purge;
  const pur0 = await p.evaluate(() => window.__rs.W.stats.purges);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: (pb.l + pb.r) / 2, y: (pb.t + pb.b) / 2, id: 2 }] });
  await p.evaluate(() => window.__rs.tick(4));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await p.evaluate(() => window.__rs.tick(4));
  const pur1 = await p.evaluate(() => window.__rs.W.stats.purges);
  ok(pur1 === pur0 + 1, `${tag}: the PURGE button purges`);
  const vib = await p.evaluate(() => { const rs = window.__rs, W = rs.W; window.__vib = []; for (let i = 0; i < 60 * 120 && W.stats.deaths === 0; i++) rs.tick(1); return { deaths: W.stats.deaths, vib: window.__vib.length }; });
  ok(vib.deaths > 0 && vib.vib > 0, `${tag}: the phone vibrates on a death (${vib.vib} pulses)`);
  await ctx.close();
}

// ------------------------------------------------------------------ 6. attract demo
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'demo');
  const d = await p.evaluate(() => {
    const rs = window.__rs, G = rs.G;
    let started = -1, boss = false, fitted = '', slow = 0, framed = 0, prevScale = 1, frames = 0, bossFight = false;
    for (let i = 0; i < 60 * 130; i++) {
      rs.tick(1);
      if (started < 0 && G.mode === 'demo') started = i;
      if (G.mode === 'demo') {
        frames++;
        const cap = document.getElementById('caption').textContent;
        if (/FITTED/.test(cap)) fitted = cap;
        if (rs.W.boss) boss = true;
        if (rs.W.boss && rs.W.boss.state === 'fight') bossFight = true;
        if (G.timeScale < 1 && prevScale === 1) { slow++; if (rs.R.shot) framed++; }
      }
      prevScale = G.timeScale;
      if (started >= 0 && G.state === 'ended') break;
    }
    return { started: started / 60, boss, bossFight, fitted, slow, framed, frames, ended: G.state === 'ended', sector: rs.W.sector };
  });
  await sleep(1800);
  const nxt = await p.evaluate(() => { window.__rs.tick(3); return { mode: window.__rs.G.mode, state: window.__rs.G.state, sector: window.__rs.W.sector }; });
  d.after = nxt.mode === 'title' ? 'the title' : nxt.mode === 'demo' && nxt.sector !== d.sector ? `the next demo (sector ${nxt.sector + 1})` : null;
  ok(d.started > 11 && d.started < 14, `the attract demo starts after ${d.started.toFixed(1)} s on the title`);
  ok(d.boss && d.bossFight, 'the demo reaches a boss fight');
  ok(/FITTED: .+/.test(d.fitted), `it shows its upgrades (${d.fitted})`);
  ok(d.slow === d.framed, `slow motion only on framed heavy moments (${d.slow} slow-mo, ${d.framed} framed on the cause)`);
  ok(d.ended && !!d.after, `the demo ends after ${(d.frames / 60).toFixed(0)} s and hands over to ${d.after}`);
  // any key ends a demo
  await p.evaluate(() => { const rs = window.__rs; rs.startDemo(); rs.G.demoStartT = performance.now() - 2000; rs.tick(10); });
  await p.keyboard.press('KeyQ');
  await p.evaluate(() => window.__rs.tick(2));
  const m = await p.evaluate(() => window.__rs.G.mode);
  ok(m === 'title', `a key press ends the demo (${m})`);
  await ctx.close();
}

// ------------------------------------------------------------------ 7. AI playthrough: highlighted picks, no records
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'playthrough');
  const n = await runUntil(p, "rs.G.state === 'ended' && rs.G.mode === 'playthrough'", 60 * 400, `if (!rs._go) { rs._go = 1; rs.startPlaythrough(); } ${RUSH}`);
  await p.evaluate(() => { window.__rs.G.run.salvage += 1500; }); // the rushed webs score little: give the autopilot something to spend
  await sleep(1700); await p.evaluate(() => window.__rs.tick(2));
  const r = await p.evaluate(() => ({ screen: window.__rs.G.screen, picks: [...document.querySelectorAll('#upgrid .upg.pick')].map((e) => e.dataset.up), sub: document.getElementById('up-sub').textContent, medals: localStorage.getItem('rs.medals.v1'), best: localStorage.getItem('rs.best.v1'), last: window.__rs.Scores.last || null, hs: Object.keys(localStorage).filter((k) => k.startsWith('rs.hs.')) }));
  await p.evaluate(() => window.__rs.tick(30)); await p.screenshot({ path: `${shots}/sys_shop_picks.png` });
  ok(r.screen === 'upgrades' && r.picks.length > 0, `the AI PLAYTHROUGH shop lights up its picks (${r.picks.join(', ')}; ${r.sub}) after ${n} frames`);
  ok(!r.medals && !r.best && !r.last && !r.hs.length, 'the playthrough writes no medals, bests or scores');
  await sleep(6500); await p.evaluate(() => window.__rs.tick(5));
  const nx = await p.evaluate(() => ({ mode: window.__rs.G.mode, sector: window.__rs.W.sector, state: window.__rs.G.state, up: { ...window.__rs.W.up } }));
  ok(nx.mode === 'playthrough' && nx.sector === 1 && nx.state === 'play', `and rolls on into sector 2 with ${JSON.stringify(nx.up)}`);
  // out of Rimrunners: the playthrough retries the sector
  await p.evaluate(() => { const rs = window.__rs; rs.W.lives = 1; rs.G.ai = { control: () => ({ mx: 0, dx: 0, fire: false, purge: false, hop: false }), debug: {} }; for (let i = 0; i < 60 * 150 && rs.G.state === 'play'; i++) rs.tick(1); });
  await sleep(1500); await p.evaluate(() => window.__rs.tick(2));
  const banner = await p.evaluate(() => document.querySelector('#banner .b1').textContent);
  await sleep(2200); await p.evaluate(() => window.__rs.tick(2));
  const rt = await p.evaluate(() => ({ mode: window.__rs.G.mode, state: window.__rs.G.state, sector: window.__rs.W.sector, web: window.__rs.W.web, tries: window.__rs.G.run.tries, ai: !!(window.__rs.G.ai && window.__rs.G.ai.plan) }));
  ok(banner === 'RETRY' && rt.mode === 'playthrough' && rt.state === 'play' && rt.sector === 1 && rt.web === 0 && rt.tries === 1 && rt.ai, `a lost sector is retried (${banner}: sector ${rt.sector + 1} web ${rt.web + 1}, try ${rt.tries + 1}, autopilot back on)`);
  await ctx.close();
}

// ------------------------------------------------------------------ 8. keyboard and mouse in play
{
  const ctx = await context();
  const p = await open(ctx, '?fixed&noscores', 'keys');
  await p.evaluate(() => { window.__rs.startCampaign(0, 0); window.__rs.tick(60 * 4); });
  const st = await p.evaluate(() => ({ lane: window.__rs.W.players[0].lane, shots: window.__rs.W.stats.shots, nl: window.__rs.W.nl }));
  await p.keyboard.down('KeyD'); await p.keyboard.down('Space');
  await p.evaluate(() => window.__rs.tick(30));
  await p.keyboard.up('KeyD'); await p.evaluate(() => window.__rs.tick(10));
  await p.keyboard.up('Space');
  const k1 = await p.evaluate(() => ({ lane: window.__rs.W.players[0].lane, shots: window.__rs.W.stats.shots }));
  await p.keyboard.down('KeyX'); await p.evaluate(() => window.__rs.tick(3)); await p.keyboard.up('KeyX');
  await p.keyboard.down('KeyW'); await p.evaluate(() => window.__rs.tick(3)); await p.keyboard.up('KeyW');
  const k2 = await p.evaluate(() => ({ purges: window.__rs.W.stats.purges, hopping: window.__rs.W.players[0].hop > 0 || window.__rs.W.players[0].hops === 0 }));
  ok(k1.lane !== st.lane && k1.shots > st.shots + 3, `keyboard: D slides (lane ${st.lane} -> ${k1.lane}), SPACE fires (${k1.shots - st.shots} shots)`);
  ok(k2.purges === 1, 'keyboard: X purges');
  // the mouse works like a spinner (relative motion)
  const m0 = await p.evaluate(() => window.__rs.W.players[0].pos);
  await p.mouse.move(640, 360);
  for (let i = 1; i <= 6; i++) { await p.mouse.move(640 - i * 30, 360); await p.evaluate(() => window.__rs.tick(2)); }
  await p.evaluate(() => window.__rs.tick(20));
  const m1 = await p.evaluate(() => window.__rs.W.players[0].pos);
  let dm = Math.abs(m1 - m0); dm = Math.min(dm, st.nl - dm);
  ok(dm >= 1.5, `mouse: moving left spins ${dm.toFixed(1)} lanes along the rim`);
  // ESC pauses, ESC resumes
  await p.keyboard.press('Escape');
  const ps = await p.evaluate(() => window.__rs.G.state);
  await p.keyboard.press('Escape');
  const rs2 = await p.evaluate(() => window.__rs.G.state);
  ok(ps === 'paused' && rs2 === 'play', `ESC pauses (${ps}) and resumes (${rs2})`);
  await ctx.close();
}

await browser.close();
ok(!errors.length, `console errors: ${errors.length}${errors.length ? ' · ' + [...new Set(errors)].slice(0, 6).join(' | ') : ''}`);
ok(!posts, `score POSTs attempted: ${posts}`);
process.exit(fails ? 1 : 0);
