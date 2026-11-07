// Meta systems in the real page (Playwright + headless Edge, takes the shared Edge lock): global boards, initials
// and the POST body (score requests are answered locally by Playwright, nothing ever reaches the real boards),
// offline fallback, NO_POST paths, a medal-and-best sector clear, the shop, the instant replay, the attract demo
// (shop interlude with lit-up picks, boss segment, any key ends it), the AI playthrough (shop picks, no medals),
// local co-op on a split keyboard and on two gamepads, gamepad menus + rumble, touch controls in portrait and
// landscape + phone vibration, options persisting under lw., and online co-op through a LOCAL relay (two pages,
// 0 and 80 ms lag, code room + leave).
//   node scripts/lancewing/flow_check.mjs [baseUrl=http://127.0.0.1:8771/games/2026-11-06/lancewing/] [relay=ws://127.0.0.1:8781]
//   ONLY=scores,nopost,clear,demo,playthrough,coop,pad,touch,options,online  (default: all)
// Needs the static server (python D:/Projects/.tmp/arcade-trio-work/lancewing/serve.py 8771) and, for `online`,
// the local relay (wrangler dev --local --port 8781 in a copy of the steel-duel worker).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8771/games/2026-11-06/lancewing/';
const relay = process.argv[3] || 'ws://127.0.0.1:8781';
const shots = 'D:/Projects/.tmp/arcade-trio-work/lancewing/shots';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (k) => !ONLY.length || ONLY.includes(k);
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function lock() {
  for (let i = 0; i < 60; i++) {
    try { fs.mkdirSync(LOCK); return true; } catch {
      try { const age = Date.now() - fs.statSync(LOCK).mtimeMs; if (age > 10 * 60 * 1000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
      console.log('edge lock busy, waiting…'); await sleep(25000 + Math.random() * 10000);
    }
  }
  return false;
}
const unlock = () => { try { fs.rmdirSync(LOCK); } catch { /* already gone */ } };
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
const FAKE = [{ initials: 'ACE', score: 99000, extra: 'ALL CLEAR' }, { initials: 'BOB', score: 51000, extra: 'S4 W2' }];
const PAD_MOCK = `(() => {
  const mk = (i) => ({ id: 'mock pad ' + i, index: i, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
    vibrationActuator: { playEffect: (t, o) => { window.__padFx.push([i, t, o]); return Promise.resolve('complete'); } } });
  window.__padFx = []; window.__pads = [mk(0), mk(1)]; window.__padN = 1;
  Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => window.__pads.slice(0, window.__padN) });
})();`;
const VIB_MOCK = `window.__vib = []; Object.defineProperty(navigator, 'vibrate', { configurable: true, value: (ms) => { window.__vib.push(ms); return true; } });`;

if (!(await lock())) { console.error('could not take the edge lock'); process.exit(3); }
process.on('exit', unlock);
const t0 = Date.now();
let browser;
const allPosts = [];
async function open(o = {}) {
  const ctx = await browser.newContext({ viewport: o.viewport || { width: 1280, height: 720 }, hasTouch: !!o.touch, isMobile: !!o.touch, deviceScaleFactor: 1 });
  if (o.hideWebdriver) await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'webdriver', { configurable: true, get: () => false }); });
  if (o.pads) await ctx.addInitScript(PAD_MOCK);
  if (o.vib) await ctx.addInitScript(VIB_MOCK);
  const net = { gets: [], posts: [], offline: !!o.offline };
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
    const req = route.request(), board = decodeURIComponent(new URL(req.url()).pathname.split('/').pop());
    if (req.method() === 'POST') { const p = { board, body: req.postDataJSON() }; net.posts.push(p); allPosts.push(p); return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); }
    net.gets.push(board);
    if (net.offline) return route.abort();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE) });
  });
  await ctx.route('**/fonts.g*/**', (route) => route.abort());
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g|ERR_FAILED|net::/.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.ctx = ctx; page.net = net; page.errs = errs;
  return page;
}
const title = (page) => page.waitForFunction(() => window.__lw && window.__lw.G.state === 'title' && window.__lw.G.screen === 'title', null, { timeout: 60000 });
const ev = (page, fn, arg) => page.evaluate(fn, arg);
const waitFor = (page, fn, ms = 30000, arg) => page.waitForFunction(fn, arg, { timeout: ms, polling: 100 }).then(() => true, () => false);
// fixed mode: run ticks without drawing until fn() is true (max frames), in chunks
async function runUntil(page, cond, maxFrames = 30000, chunk = 600) {
  for (let f = 0; f < maxFrames; f += chunk) {
    const done = await page.evaluate(([c, n]) => { const lw = window.__lw; for (let i = 0; i < n; i += 60) { lw.tick(60, 1 / 60, false); if ((0, eval)(c)) return true; } return false; }, [cond, chunk]);
    if (done) return true;
  }
  return false;
}
async function closePage(page, label) {
  ok(!page.errs.length, `${label}: no console errors${page.errs.length ? ' · ' + page.errs.slice(0, 3).join(' | ') : ''}`);
  await page.ctx.close();
}

try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  // ------------------------------------------------------------ global boards, initials, the POST, the replay
  if (want('scores')) {
    const page = await open({ hideWebdriver: true });
    await page.goto(base + '?seed=3');
    await title(page);
    ok(await ev(page, () => window.__lw.noPost === false), 'scores: a normal page may post (webdriver hidden, no test flags)');
    ok(await waitFor(page, () => document.getElementById('tb-src').textContent === 'WORLD' && /ACE/.test(document.getElementById('tb-rows').textContent) && /ALL CLEAR/.test(document.getElementById('tb-rows').textContent), 10000),
      'scores: the title shows the world board (rows, extra tag) for lancewing-2026');
    await page.click('[data-btab="endless"]');
    await page.click('#title [data-opt="diff"] [data-v="hard"]');
    await page.click('[data-btab="campaign"]');
    await page.click('#title [data-opt="diff"] [data-v="nightmare"]');
    await page.click('#title [data-opt="diff"] [data-v="normal"]');
    await sleep(500);
    const g = page.net.gets;
    ok(['lancewing-2026', 'lancewing-2026-endless', 'lancewing-2026-endless-hard', 'lancewing-2026-hard', 'lancewing-2026-nightmare'].every((b) => g.includes(b)), `scores: tabs + difficulty fetch one board each (${[...new Set(g)].join(', ')})`);
    // HIGH SCORES screen: mode tabs x difficulty
    await page.click('#title [data-act="scores"]');
    await page.click('#scores [data-tab="endless"]'); await page.click('#scores [data-hd="easy"]');
    ok(await waitFor(page, () => /ACE/.test(document.getElementById('hs-global').textContent), 8000) && page.net.gets.includes('lancewing-2026-endless-easy'), 'scores: HIGH SCORES screen shows the world board per mode + difficulty (lancewing-2026-endless-easy)');
    await page.screenshot({ path: `${shots}/sys_scores.png` });
    await page.click('#scores [data-act="back"]');
    // a real game over on Normal: walk off the ledges into the sea, then initials
    await ev(page, () => { window.__lw.startCampaign(4); window.__lw.W.score = 12345; });
    await page.keyboard.down('KeyD');
    const res = await waitFor(page, () => window.__lw.G.screen === 'results', 90000);
    await page.keyboard.up('KeyD');
    ok(res, 'scores: losing every life ends on the results screen');
    ok(await ev(page, () => !document.getElementById('ini-wrap').classList.contains('hidden')), 'scores: a qualifying score asks for 3 initials');
    await page.screenshot({ path: `${shots}/sys_results_initials.png` });
    await page.keyboard.press('KeyW'); await page.keyboard.press('Space');   // still mashing flap as the run ends: ignored for a moment
    ok(await ev(page, () => window.__lw.G.screen === 'results' && !document.getElementById('ini-wrap').classList.contains('hidden') && window.__lw.G.state === 'results'), 'scores: flap keys mashed as the results open neither type nor submit');
    await sleep(1000);
    for (const k of ['KeyZ', 'KeyQ', 'KeyX']) await page.keyboard.press(k);
    await page.keyboard.press('Enter');
    ok(await waitFor(page, () => document.getElementById('ini-wrap').classList.contains('hidden'), 3000), 'scores: ENTER submits the initials');
    await sleep(400);
    const post = page.net.posts[0];
    ok(page.net.posts.length === 1 && post.board === 'lancewing-2026', `scores: exactly one POST, to lancewing-2026 (${page.net.posts.map((p) => p.board).join(', ')})`);
    if (post) ok(post.body.initials === 'ZQX' && post.body.score >= 12345 && post.body.level === 5 && /^S5 W/.test(post.body.extra) && Object.keys(post.body).sort().join() === 'extra,initials,level,score', `scores: POST body ${JSON.stringify(post.body)}`);
    const loc = await ev(page, () => ({ hs: JSON.parse(localStorage.getItem('lw.hs.lancewing-2026') || '[]'), ini: localStorage.getItem('lw.initials') }));
    ok(loc.hs.length === 1 && loc.hs[0].initials === 'ZQX' && loc.ini === 'ZQX', 'scores: the local table (lw.hs.lancewing-2026) and lw.initials are saved');
    // the instant replay of the last death, then back to the results
    const hasClip = await ev(page, () => !!window.__lw.G.clip && !document.querySelector('#res-btns [data-act="replay"]').classList.contains('hidden'));
    ok(hasClip, 'replay: the results offer an INSTANT REPLAY of the last death');
    if (hasClip) {
      await page.click('#res-btns [data-act="replay"]');
      ok(await waitFor(page, () => window.__lw.G.state === 'replay', 3000), 'replay: the replay plays (letterboxed)');
      await sleep(1200);
      await page.screenshot({ path: `${shots}/sys_replay.png` });
      ok(await waitFor(page, () => window.__lw.G.state === 'results' && window.__lw.G.screen === 'results', 30000), 'replay: it ends back on the results screen');
    }
    const before = page.net.gets.filter((b) => b === 'lancewing-2026').length;
    await page.click('#res-btns [data-act="done"]');
    ok(await waitFor(page, () => window.__lw.G.state === 'title', 5000), 'scores: END RUN goes back to the title');
    await sleep(600);
    ok(page.net.gets.filter((b) => b === 'lancewing-2026').length > before, 'scores: the title board refetches after a submit');
    await closePage(page, 'scores');
    // offline: the title falls back to this device
    const off = await open({ hideWebdriver: true, offline: true });
    await off.goto(base + '?seed=3');
    await title(off);
    ok(await waitFor(off, () => /OFFLINE/.test(document.getElementById('tb-src').textContent), 12000), 'scores: offline, the title board says THIS DEVICE (OFFLINE)');
    await off.ctx.close();
  }

  // ------------------------------------------------------------ NO_POST paths
  if (want('nopost')) {
    for (const q of ['?noscores', '?demo', '?playthrough', '?fixed', '?autoplay', '?test=1']) {
      const page = await open({ hideWebdriver: true });
      await page.goto(base + q + (q.includes('?test') ? '' : '&seed=2'));
      await page.waitForFunction(() => window.__lw && window.__lw.G, null, { timeout: 60000 });
      const np = await ev(page, () => window.__lw.noPost);
      ok(np === true, `nopost: ${q} sets NO_POST`);
      if (q === '?noscores') {
        await title(page);
        await ev(page, () => { window.__lw.startCampaign(4); window.__lw.W.score = 2222; });
        await page.keyboard.down('KeyD');
        await waitFor(page, () => window.__lw.G.screen === 'results', 90000);
        await page.keyboard.up('KeyD');
        await sleep(1000);
        await page.keyboard.press('Enter');
        await sleep(500);
        const hs = await ev(page, () => JSON.parse(localStorage.getItem('lw.hs.lancewing-2026') || '[]'));
        ok(page.net.posts.length === 0 && hs.length === 1, `nopost: ?noscores keeps the score on this device only (${page.net.posts.length} posts, ${hs.length} local)`);
      }
      await page.ctx.close();
    }
    // an autopilot-flown run never asks for initials
    const page = await open({ hideWebdriver: true });
    await page.goto(base + '?fixed&seed=12');
    await title(page);
    const r = await ev(page, () => { const lw = window.__lw; lw.startCampaign(0); lw.auto('demo'); return lw.G.run.auto; });
    ok(r === true, 'nopost: __lw.auto() marks the run as autopilot (no initials, medals or bests)');
    await page.ctx.close();
  }

  // ------------------------------------------------------------ a real sector clear: medals, bests, unlock, shop
  if (want('clear')) {
    const page = await open();
    await page.goto(base + '?fixed&seed=21');
    await title(page);
    // a player's own campaign (the demo autopilot does the flying; the run is NOT marked auto, so the clear counts)
    await ev(page, () => { const lw = window.__lw; lw.startCampaign(0); lw.auto('demo'); lw.G.run.auto = false; });
    const cleared = await runUntil(page, 'window.__lw.G.state === "ended" || window.__lw.W.over', 60 * 600);
    ok(cleared, 'clear: sector 1 played to the end');
    await waitFor(page, () => window.__lw.G.state === 'upgrade' || window.__lw.G.state === 'results', 5000);
    const st = await ev(page, () => { const lw = window.__lw, b = lw.bests(); return { state: lw.G.state, res: lw.W.result, sub: document.getElementById('up-sub').textContent, b, deaths: lw.W.stats.deaths, hatched: lw.W.secHatched, t: lw.W.secT, ls: { m: localStorage.getItem('lw.medals.v1'), t: localStorage.getItem('lw.best.v1'), s: localStorage.getItem('lw.bestsc.v1'), r: localStorage.getItem('lw.reach.v1') } }; });
    console.log(`      clear: ${st.res} in ${st.t.toFixed(0)} s, ${st.deaths} deaths, ${st.hatched} cores re-ignited · ${st.sub}`);
    if (ok(st.res === 'clear' && st.state === 'upgrade', 'clear: a cleared sector opens the upgrade shop')) {
      const expect = (st.deaths === 0 ? 1 : 0) + (st.hatched === 0 ? 1 : 0) + (st.t <= 150 ? 1 : 0);
      ok(st.b.medals.length === expect && JSON.parse(st.ls.m || '[]').length === expect, `clear: medals awarded by the rules (${st.b.medals.join(', ') || 'none'}, expected ${expect})`);
      ok(st.b.best.s0 > 0 && st.b.bestSc.s0 > 0 && st.b.reach === 1 && st.ls.t && st.ls.s && st.ls.r === '1', `clear: best time ${st.b.best.s0 && st.b.best.s0.toFixed(1)} s + best score ${st.b.bestSc.s0} saved, sector 2 unlocked`);
      ok(/NEW BEST TIME \+ SCORE/.test(st.sub), 'clear: the shop announces the new bests');
      const shop = await ev(page, () => { const lw = window.__lw, s0 = lw.G.run.salvage, k = [...document.querySelectorAll('.upg:not(.poor):not(.max)')].map((e) => e.dataset.up)[0]; if (k) lw.buy(k); return { s0, s1: lw.G.run.salvage, k, lv: k && lw.G.run.up[k], replay: !document.getElementById('up-replay').classList.contains('hidden'), clip: !!lw.G.clip }; });
      ok(shop.k && shop.s1 < shop.s0 && shop.lv === 1, `clear: buying ${shop.k} spends salvage ${shop.s0} -> ${shop.s1}`);
      ok(shop.replay === shop.clip, `clear: the shop's INSTANT REPLAY shows only when there is a clip (${shop.clip})`);
      await page.evaluate(() => window.__lw.tick(2));
      await page.screenshot({ path: `${shots}/sys_shop.png` });
      await ev(page, () => window.__lw.act('next'));
      const s2 = await ev(page, () => ({ s: window.__lw.W.sector, up: window.__lw.W.up, st: window.__lw.G.state }));
      ok(s2.s === 1 && s2.st === 'play' && s2.up[shop.k] === 1, 'clear: NEXT SECTOR flies sector 2 with the bought upgrade');
      // the sector select + medals screens show it
      await ev(page, () => window.__lw.toTitle());
      await ev(page, () => window.__lw.act('sectors'));
      const sec = await ev(page, () => ({ s2: !document.querySelector('.sec[data-sec="1"]').disabled, s3: document.querySelector('.sec[data-sec="2"]').disabled, txt: document.querySelector('.sec[data-sec="0"] .bests').textContent }));
      ok(sec.s2 && sec.s3 && /BEST \d+:\d\d\.\d · [\d,]+/.test(sec.txt), `clear: sector select unlocks sector 2 and shows the best (${sec.txt})`);
      await page.evaluate(() => window.__lw.tick(2));
      await page.screenshot({ path: `${shots}/sys_sectors.png` });
      await ev(page, () => { window.__lw.act('back'); window.__lw.act('medals'); });
      const md = await ev(page, () => ({ n: document.querySelectorAll('#medlist .medal').length, on: document.querySelectorAll('#medlist .medal.on').length, names: new Set([...document.querySelectorAll('#medlist .medal')].map((e) => e.firstChild.textContent)).size }));
      ok(md.n === 15 && md.names === 15 && md.on === st.b.medals.length, `clear: 15 medals listed (${md.names} distinct names), ${md.on} earned`);
      await page.evaluate(() => window.__lw.tick(2));
      await page.screenshot({ path: `${shots}/sys_medals.png` });
    }
    await closePage(page, 'clear');
  }

  // ------------------------------------------------------------ attract demo
  if (want('demo')) {
    const page = await open();
    await page.goto(base + '?fixed&seed=4');
    await title(page);
    await runUntil(page, 'window.__lw.G.mode === "demo"', 60 * 14, 60);
    const d0 = await ev(page, () => ({ mode: window.__lw.G.mode, badge: !document.getElementById('demo-badge').classList.contains('hidden'), t: window.__lw.G.idleT }));
    ok(d0.mode === 'demo' && d0.badge, 'demo: the attract demo starts by itself after ~12 s on the title');
    await runUntil(page, 'window.__lw.W.t > 25', 60 * 40);
    await ev(page, () => window.__lw.tick(30));
    await page.screenshot({ path: `${shots}/sys_demo_play.png` });
    const k = await ev(page, () => ({ kills: window.__lw.W.stats.kills, t: window.__lw.W.t }));
    ok(k.kills >= 2, `demo: the autopilot plays with intent (${k.kills} riders unhorsed in ${k.t.toFixed(0)} s)`);
    await ev(page, () => { window.__lw.G.demoT = 200; window.__lw.tick(1, 1 / 60, false); });   // skip to the segment's end
    ok(await waitFor(page, () => window.__lw.G.state === 'upgrade', 4000), 'demo: after the first segment the demo shows the shop');
    const sh = await ev(page, () => ({ picks: document.querySelectorAll('.upg.pick').length, sub: document.getElementById('up-sub').textContent, badge: !document.getElementById('demo-badge').classList.contains('hidden') }));
    ok(sh.picks >= 1 && /AUTOPILOT FITS/.test(sh.sub) && sh.badge, `demo: shop picks lit up (${sh.picks}) · ${sh.sub}`);
    await ev(page, () => window.__lw.tick(2));
    await page.screenshot({ path: `${shots}/sys_demo_shop.png` });
    ok(await waitFor(page, () => window.__lw.G.state === 'play' && window.__lw.G.mode === 'demo', 8000), 'demo: then flies the next segment');
    await runUntil(page, '!!window.__lw.W.boss && window.__lw.W.boss.st === "fight"', 60 * 30);
    const b = await ev(page, () => ({ boss: window.__lw.W.boss && window.__lw.W.boss.key, wave: window.__lw.W.wave, up: window.__lw.W.up }));
    ok(!!b.boss && Object.keys(b.up).length >= 1, `demo: the second segment is a boss fight (${b.boss}) with the shop's upgrades (${JSON.stringify(b.up)})`);
    await runUntil(page, 'window.__lw.W.boss && window.__lw.W.boss.hp < window.__lw.W.boss.max', 60 * 40);
    await ev(page, () => window.__lw.tick(20));
    await page.screenshot({ path: `${shots}/sys_demo_boss.png` });
    await page.keyboard.press('KeyX');
    ok(await ev(page, () => window.__lw.G.state === 'title' && window.__lw.G.mode === 'title'), 'demo: any key ends it, back on the title');
    // the tap that ends the demo must not also press a title button
    await ev(page, () => window.__lw.startDemo());
    await page.mouse.click(640, 360);
    await sleep(100);
    ok(await ev(page, () => window.__lw.G.state === 'title'), 'demo: the click that stops the demo is eaten (no title button pressed)');
    await sleep(500);
    await ev(page, () => window.__lw.startDemo());
    await page.keyboard.press('Enter');
    await sleep(100);
    ok(await ev(page, () => window.__lw.G.state === 'title'), 'demo: ENTER stops the demo without starting a campaign');
    await closePage(page, 'demo');
  }

  // ------------------------------------------------------------ AI playthrough
  if (want('playthrough')) {
    const page = await open();
    await page.goto(base + '?fixed&seed=6&playthrough&sector=0');   // the whole of sector 1: one sector's salvage buys about one upgrade
    await page.waitForFunction(() => window.__lw && window.__lw.G.mode === 'playthrough', null, { timeout: 60000 });
    const badge = await ev(page, () => ({ badge: !document.getElementById('demo-badge').classList.contains('hidden'), touch: document.getElementById('touch').classList.contains('hidden') }));
    void badge;
    const done = await runUntil(page, 'window.__lw.G.state === "ended"', 60 * 400);
    ok(done, 'playthrough: the autopilot flies sector 1 to the end of its boss');
    ok(await waitFor(page, () => window.__lw.G.state === 'upgrade', 4000), 'playthrough: and goes to the shop');
    const sh = await ev(page, () => ({ picks: document.querySelectorAll('.upg.pick').length, sub: document.getElementById('up-sub').textContent, med: localStorage.getItem('lw.medals.v1'), best: localStorage.getItem('lw.best.v1'), ini: !document.getElementById('ini-wrap').classList.contains('hidden') }));
    ok(sh.picks >= 1 && /AUTOPILOT BOUGHT/.test(sh.sub), `playthrough: shop picks lit up (${sh.picks}) · ${sh.sub}`);
    ok(!sh.med && !sh.best, 'playthrough: no medals or bests saved');
    await ev(page, () => window.__lw.tick(2));
    await page.screenshot({ path: `${shots}/sys_playthrough_shop.png` });
    ok(await waitFor(page, () => window.__lw.G.state === 'play' && window.__lw.W.sector === 1, 9000), 'playthrough: carries on into sector 2 by itself');
    // a failed sector is retried
    await ev(page, () => { const W = window.__lw.W; W.lives = 0; for (const p of W.players) { p.alive = false; p.deadT = 5; } });
    await ev(page, () => window.__lw.tick(4, 1 / 60, false));
    ok(await waitFor(page, () => /RETRY/.test(document.querySelector('#banner .b1').textContent), 4000), 'playthrough: a game over shows RETRY');
    ok(await waitFor(page, () => window.__lw.G.state === 'play' && window.__lw.W.sector === 1 && window.__lw.W.t < 2 && window.__lw.G.run.tries === 1, 6000), 'playthrough: and flies the same sector again');
    await closePage(page, 'playthrough');
  }

  // ------------------------------------------------------------ local co-op: split keyboard
  if (want('coop')) {
    const page = await open();
    await page.goto(base + '?fixed&seed=8');
    await title(page);
    await ev(page, () => { window.__lw.act('coop'); window.__lw.tick(60 * 3, 1 / 60, false); });
    const c0 = await ev(page, () => ({ coop: window.__lw.W.coop, n: window.__lw.W.players.length }));
    ok(c0.coop && c0.n === 2, 'coop: LOCAL CO-OP starts two riders');
    // the two riders start side by side (rider 2 to the right): steer them apart
    await page.keyboard.down('KeyA'); await page.keyboard.down('ArrowRight');
    await ev(page, () => window.__lw.tick(40, 1 / 60, false));
    const v = await ev(page, () => window.__lw.W.players.map((p) => p.vx));
    await page.keyboard.up('KeyA'); await page.keyboard.up('ArrowRight');
    ok(v[0] < -0.5 && v[1] > 0.5, `coop: rider 1 steers with A/D, rider 2 with the arrows (vx ${v.map((x) => x.toFixed(1)).join(' / ')})`);
    const fl = await ev(page, async () => { const lw = window.__lw, W = lw.W; const y0 = W.players.map((p) => p.vy); return y0; });
    void fl;
    await page.keyboard.down('KeyW'); await ev(page, () => window.__lw.tick(3, 1 / 60, false)); await page.keyboard.up('KeyW');
    const a1 = await ev(page, () => window.__lw.W.players.map((p) => p.vy));
    await ev(page, () => window.__lw.tick(30, 1 / 60, false));
    await page.keyboard.down('ArrowUp'); await ev(page, () => window.__lw.tick(3, 1 / 60, false)); await page.keyboard.up('ArrowUp');
    const a2 = await ev(page, () => window.__lw.W.players.map((p) => p.vy));
    ok(a1[0] > 2 && a2[1] > 2, `coop: W flaps rider 1, ↑ flaps rider 2 (vy ${a1[0].toFixed(1)} / ${a2[1].toFixed(1)})`);
    await ev(page, () => window.__lw.tick(60 * 4, 1 / 60, false));
    await ev(page, () => window.__lw.tick(2));
    await page.screenshot({ path: `${shots}/sys_coop.png` });
    await closePage(page, 'coop');
  }

  // ------------------------------------------------------------ gamepads: menus, flying, rumble, two pads in co-op
  if (want('pad')) {
    const page = await open({ pads: true });
    await page.goto(base + '?fixed&seed=10');
    await title(page);
    const press = (b, i = 0) => ev(page, ([b, i]) => { window.__pads[i].buttons[b].pressed = true; window.__pads[i].buttons[b].value = 1; window.__lw.tick(1); window.__pads[i].buttons[b].pressed = false; window.__pads[i].buttons[b].value = 0; window.__lw.tick(1); }, [b, i]);
    await press(13);
    const selName = () => ev(page, () => { const e = document.querySelector('.sel'); return e ? e.dataset.act || e.dataset.opt || e.parentElement.dataset.opt + '=' + e.dataset.v : null; });
    const s1 = await selName();
    await press(13);
    const s2 = await selName();
    ok(!!s1 && !!s2 && s1 !== s2, `pad: the d-pad moves the menu selection (${s1} -> ${s2})`);
    await ev(page, () => window.__lw.act('campaign'));
    await ev(page, () => window.__lw.tick(60 * 2, 1 / 60, false));
    await ev(page, () => { window.__pads[0].axes[0] = 1; window.__lw.tick(40, 1 / 60, false); });
    const vx = await ev(page, () => window.__lw.W.players[0].vx);
    await ev(page, () => { window.__pads[0].axes[0] = 0; window.__pads[0].buttons[0].pressed = true; window.__lw.tick(3, 1 / 60, false); window.__pads[0].buttons[0].pressed = false; });
    const vy = await ev(page, () => window.__lw.W.players[0].vy);
    ok(vx > 0.5 && vy > 2, `pad: left stick steers (vx ${vx.toFixed(1)}), A flaps (vy ${vy.toFixed(1)})`);
    // rumble: fly into the sea (stick held, no flaps)
    await ev(page, () => { window.__padFx.length = 0; window.__pads[0].axes[0] = 1; });
    await runUntil(page, 'window.__lw.W.stats.deaths >= 1', 60 * 60, 60);
    const fx = await ev(page, () => window.__padFx.length);
    ok(fx > 0, `pad: a lost life rumbles the pad (${fx} effects)`);
    await ev(page, () => { window.__lw.settings.rumble = 'off'; window.__padFx.length = 0; });
    await runUntil(page, 'window.__lw.W.stats.deaths >= 2', 60 * 60, 60);
    ok(await ev(page, () => window.__padFx.length === 0), 'pad: VIBRATION OFF stops the rumble');
    await ev(page, () => { window.__lw.settings.rumble = 'on'; window.__pads[0].axes[0] = 0; window.__lw.toTitle(); });
    // two pads in local co-op: one rider each
    await ev(page, () => { window.__padN = 2; window.__lw.act('coop'); window.__lw.tick(60 * 3, 1 / 60, false); window.__pads[0].axes[0] = -1; window.__pads[1].axes[0] = 1; window.__lw.tick(40, 1 / 60, false); window.__pads[0].axes[0] = 0; window.__pads[1].axes[0] = 0; });
    const v2 = await ev(page, () => window.__lw.W.players.map((p) => p.vx));
    ok(v2[0] < -0.5 && v2[1] > 0.5, `pad: two pads in co-op fly one rider each (vx ${v2.map((x) => x.toFixed(1)).join(' / ')})`);
    // START pauses, START resumes
    await press(9);
    const ps = await ev(page, () => window.__lw.G.state);
    await press(9);
    const rs = await ev(page, () => window.__lw.G.state);
    ok(ps === 'paused' && rs === 'play', `pad: START pauses and resumes (${ps} -> ${rs})`);
    // keyboard Esc: OPTIONS opened from PAUSE goes back to PAUSE (not straight into the game), Esc again resumes
    await page.keyboard.press('Escape'); await ev(page, () => { window.__lw.tick(1); window.__lw.act('options'); window.__lw.tick(1); });
    await page.keyboard.press('Escape'); const eo = await ev(page, () => [window.__lw.G.state, window.__lw.G.screen]);
    await page.keyboard.press('Escape'); const er = await ev(page, () => window.__lw.G.state);
    ok(eo[0] === 'paused' && eo[1] === 'pause' && er === 'play', `keys: Esc in OPTIONS (from PAUSE) goes back to PAUSE (${eo.join('/')}), Esc again resumes (${er})`);
    // a gamepad-only game over: the initials take the d-pad, A steps through the letters and saves, then A continues
    await ev(page, () => { window.__padN = 1; window.__lw.toTitle(); window.__lw.tick(2); localStorage.removeItem('lw.hs.lancewing-2026'); window.__lw.act('campaign'); window.__lw.tick(60, 1 / 60, false); window.__lw.W.score = 23456; window.__pads[0].axes[0] = 1; });
    let over = await runUntil(page, 'window.__lw.W.over', 60 * 600, 300);
    over = over && await waitFor(page, () => window.__lw.G.screen === 'results', 8000);   // the results come up on a real-time timer
    await ev(page, () => { window.__pads[0].axes[0] = 0; window.__lw.tick(2); });
    const r0 = await ev(page, () => ({ ini: !document.getElementById('ini-wrap').classList.contains('hidden'), letters: document.getElementById('ini').textContent, sel: document.querySelector('.sel') && document.querySelector('.sel').id, cont: !document.getElementById('res-cont').classList.contains('hidden') }));
    ok(over && r0.ini && r0.cont && r0.sel === 'res-cont', `pad: game over asks for initials and lands on CONTINUE FROM CHECKPOINT (sel ${r0.sel})`);
    await press(0); const g0 = await ev(page, () => window.__lw.G.state);   // A at once: ignored (the flap button may still be down)
    await sleep(1000);
    await press(12);   // d-pad up: first letter + 1
    const l1 = await ev(page, () => document.getElementById('ini').textContent);
    await press(0); await press(0);   // A, A: next letter, next letter
    const cur = await ev(page, () => [...document.getElementById('ini').children].findIndex((b) => b.className === 'cur'));
    await press(0);   // A on the last letter saves
    await sleep(300);
    const r1 = await ev(page, () => ({ hidden: document.getElementById('ini-wrap').classList.contains('hidden'), saved: document.getElementById('ini-saved').textContent, hs: JSON.parse(localStorage.getItem('lw.hs.lancewing-2026') || '[]'), sel: document.querySelector('.sel') && document.querySelector('.sel').id, state: window.__lw.G.state }));
    ok(g0 === 'results' && l1 !== r0.letters && cur === 2 && r1.hidden && r1.hs.length === 1 && r1.hs[0].initials === l1 && /SAVED/.test(r1.saved) && r1.state === 'results',
      `pad: d-pad edits (${r0.letters} -> ${l1}), A steps to the last letter and saves (${r1.saved}, local ${r1.hs.map((h) => h.initials + ' ' + h.score).join()})`);
    ok(r1.sel === 'res-cont', `pad: after saving, A is on CONTINUE FROM CHECKPOINT (sel ${r1.sel})`);
    await press(0);
    ok(await ev(page, () => window.__lw.G.state === 'play'), 'pad: A continues from the checkpoint');
    // the AI PLAYTHROUGH badge says ESC TO STOP: Esc stops it
    await ev(page, () => { window.__lw.toTitle(); window.__lw.tick(2); window.__lw.startPlaythrough(); window.__lw.tick(120, 1 / 60, false); });
    await page.keyboard.press('Escape');
    ok(await ev(page, () => window.__lw.G.state === 'title' && window.__lw.G.mode === 'title'), 'keys: Esc stops the AI PLAYTHROUGH (back to the title)');
    await closePage(page, 'pad');
  }

  // ------------------------------------------------------------ touch: portrait + landscape, flap button, steer drag, vibration
  if (want('touch')) {
    for (const [name, vp] of [['portrait', { width: 412, height: 915 }], ['landscape', { width: 915, height: 412 }]]) {
      const page = await open({ touch: true, vib: true, viewport: vp });
      await page.goto(base + '?fixed&seed=9');
      await title(page);
      await sleep(900);   // the LOADING veil fades out
      await ev(page, () => window.__lw.tick(2));
      const mini = await ev(page, () => { for (const id of ['tb-mini', 'tboard']) { const e = document.getElementById(id), r = e.getBoundingClientRect(); if (getComputedStyle(e).display !== 'none' && r.bottom <= innerHeight + 1 && r.top >= 0 && r.right <= innerWidth + 1) return id + ': ' + e.textContent; } return null; });
      ok(!!mini, `touch ${name}: the title shows the world board on a phone (${mini && mini.replace(/\s+/g, ' ').slice(0, 70)})`);
      await page.screenshot({ path: `${shots}/sys_title_${name}.png` });
      await page.tap('#title [data-act="campaign"]');
      await ev(page, () => window.__lw.tick(60 * 3, 1 / 60, false));
      const vis = await ev(page, () => ({ touch: !document.getElementById('touch').classList.contains('hidden'), pause: !document.getElementById('tb-pause').classList.contains('hidden'), kind: window.__lw.I.lastKind, st: window.__lw.G.state }));
      ok(vis.st === 'play' && vis.touch && vis.pause, `touch ${name}: tapping START CAMPAIGN plays with the touch controls + pause button shown`);
      const cdp = await page.ctx.newCDPSession(page);
      const fb = await page.locator('#tb-flap').boundingBox();
      const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
      await touch('touchStart', [{ x: fb.x + fb.width / 2, y: fb.y + fb.height / 2, id: 1 }]);
      await ev(page, () => window.__lw.tick(3, 1 / 60, false));
      const vy = await ev(page, () => window.__lw.W.players[0].vy);
      await touch('touchEnd', []);
      const sx = vp.width * 0.2, sy = vp.height * 0.6;
      await touch('touchStart', [{ x: sx, y: sy, id: 2 }]);
      await touch('touchMove', [{ x: sx + 60, y: sy, id: 2 }]);
      await ev(page, () => window.__lw.tick(40, 1 / 60, false));
      const vx = await ev(page, () => window.__lw.W.players[0].vx);
      await ev(page, () => window.__lw.tick(1));
      await page.screenshot({ path: `${shots}/sys_touch_${name}.png` });
      await touch('touchEnd', []);
      ok(vy > 2 && vx > 0.5, `touch ${name}: FLAP button beats (vy ${vy.toFixed(1)}), dragging on the left steers (vx ${vx.toFixed(1)})`);
      // phone vibration on a lost life
      await touch('touchStart', [{ x: sx, y: sy, id: 3 }]);
      await touch('touchMove', [{ x: sx + 70, y: sy, id: 3 }]);
      await runUntil(page, 'window.__lw.W.stats.deaths >= 1', 60 * 60, 60);
      await touch('touchEnd', []);
      const vib = await ev(page, () => window.__vib.length);
      ok(vib > 0, `touch ${name}: a lost life vibrates the phone (${vib} calls)`);
      // the HUD + touch controls fit the screen
      const fit = await ev(page, () => { const ids = ['tb-flap', 'tb-pause', 'score', 'lives']; return ids.map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.width > 0; }); });
      ok(fit.every(Boolean), `touch ${name}: flap, pause, score and lives sit inside the screen (${fit.join(',')})`);
      ok(await ev(page, () => document.documentElement.scrollWidth <= innerWidth + 1), `touch ${name}: no horizontal scroll`);
      // pause via the on-screen button
      const pb = await page.locator('#tb-pause').boundingBox(), st0 = await ev(page, () => window.__lw.G.state);
      await touch('touchStart', [{ x: pb.x + pb.width / 2, y: pb.y + pb.height / 2, id: 4 }]);
      await touch('touchEnd', []);
      ok(await waitFor(page, () => window.__lw.G.state === 'paused', 2000), `touch ${name}: the pause button pauses (${st0} -> ${await ev(page, () => window.__lw.G.state)})`);
      await closePage(page, `touch ${name}`);
    }
  }

  // ------------------------------------------------------------ options persist under lw.
  if (want('options')) {
    const page = await open();
    await page.goto(base + '?fixed&seed=11');
    await title(page);
    await page.click('#title [data-act="options"]');
    for (const [k, v] of [['talk', 'off'], ['flash', 'reduced'], ['rumble', 'off'], ['quality', 'low'], ['shake', '0']]) await page.click(`#options [data-opt="${k}"] [data-v="${v}"]`);
    await ev(page, () => { for (const [k, v] of [['music', 20], ['sfx', 35]]) { const el = document.querySelector(`[data-set="${k}"]`); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } });
    const rl = await ev(page, () => !document.getElementById('q-reload').classList.contains('hidden'));
    ok(rl, 'options: changing GRAPHICS offers RELOAD NOW');
    const a = await ev(page, () => ({ s: JSON.parse(localStorage.getItem('lw.settings.v1')), vol: window.__lw.A.vol }));
    ok(a.s.talk === 'off' && a.s.flash === 'reduced' && a.s.rumble === 'off' && a.s.quality === 'low' && a.s.shake === '0' && a.s.music === 20 && a.s.sfx === 35, 'options: saved in lw.settings.v1');
    ok(Math.abs(a.vol.music - 0.16) < 0.01 && Math.abs(a.vol.sfx - 0.35) < 0.01, `options: volumes apply at once (music ${a.vol.music.toFixed(2)}, sfx ${a.vol.sfx.toFixed(2)})`);
    await page.reload();
    await title(page);
    const b = await ev(page, () => ({ s: window.__lw.settings, q: window.__lw.R.q && window.__lw.R.q.name, segs: [...document.querySelectorAll('#options .seg button.on')].map((e) => e.parentElement.dataset.opt + '=' + e.dataset.v), music: document.querySelector('[data-set="music"]').value }));
    ok(b.s.talk === 'off' && b.s.flash === 'reduced' && b.segs.includes('quality=low') && b.segs.includes('talk=off') && b.music === '20', `options: restored after a reload (${b.segs.join(' ')}, music ${b.music})`);
    ok(b.q === 'low', `options: GRAPHICS LOW is used after the reload (${b.q})`);
    const keys = await ev(page, () => Object.keys(localStorage));
    ok(keys.every((k) => k.startsWith('lw.') || k === 'jez237_initials'), `options: everything stored under lw. (${keys.join(', ')})`);
    await closePage(page, 'options');
  }

  // ------------------------------------------------------------ online co-op through the local relay
  if (want('online')) {
    let up = false;
    try { up = (await fetch(relay.replace(/^ws/, 'http') + '/health')).ok; } catch { /* down */ }
    if (!ok(up, `online: local relay at ${relay}`)) { /* skip */ } else for (const lag of [0, 80]) {
      const H = await open(), Gp = await open();
      await H.goto(base + `?relay=${encodeURIComponent(relay)}&noscores&seed=31`);
      await title(H);
      await H.click('#title [data-act="online"]');
      await H.click('#online [data-opt="netRoute"] [data-v="1"]');
      await H.click('#online [data-act="net-host"]');
      const okRoom = await waitFor(H, () => /^[A-Z0-9]{4}$/.test(document.getElementById('room-code').textContent) && /Waiting/.test(document.getElementById('net-status').textContent), 8000);
      const code = await ev(H, () => document.getElementById('room-code').textContent);
      ok(okRoom, `online ${lag} ms: HOST A ROOM shows a code (${code}) and waits`);
      await Gp.goto(base + `?relay=${encodeURIComponent(relay)}&noscores&netlag=${lag}&room=${code}`);
      await Gp.waitForFunction(() => window.__lw && window.__lw.G.screen === 'online', null, { timeout: 60000 });
      ok(await ev(Gp, () => document.getElementById('join-code').value), `online ${lag} ms: a ?room= link opens ONLINE CO-OP with the code filled in`);
      await Gp.click('#online [data-act="net-join"]');
      ok(await waitFor(H, () => !document.getElementById('net-go').classList.contains('hidden'), 10000), `online ${lag} ms: the host sees the wingmate join and gets START`);
      await H.click('#net-go');
      ok(await waitFor(Gp, () => window.__lw.G.mode === 'online' && window.__lw.G.state === 'play', 8000) && await ev(H, () => window.__lw.G.mode === 'online'), `online ${lag} ms: both pages start the same arena`);
      await ev(H, () => window.__lw.auto('demo')); await ev(Gp, () => window.__lw.auto('demo'));
      const samples = [];
      for (let i = 0; i < 28; i++) {
        await sleep(1000);
        const [a, b] = await Promise.all([ev(H, () => { const W = window.__lw.W; return { t: W.t, wave: W.wave, score: W.score, lives: W.lives, sector: W.sector, p: W.players.map((p) => [p.x, p.y, p.alive]), r: W.riders.map((r) => [r.id, r.x, r.y]), k: W.stats.kills }; }),
          ev(Gp, () => { const W = window.__lw.W; return { t: W.t, wave: W.wave, score: W.score, lives: W.lives, sector: W.sector, p: W.players.map((p) => [p.x, p.y, p.alive]), r: W.riders.map((r) => [r.id, r.x, r.y]) }; })]);
        samples.push([a, b]);
      }
      const C = 96, dx = (a, b) => { let d = (b - a) % C; if (d > C / 2) d -= C; if (d < -C / 2) d += C; return d; };
      const same = samples.filter(([a, b]) => a.wave === b.wave && a.sector === b.sector && a.lives === b.lives).length;
      const scoreClose = samples.filter(([a, b]) => Math.abs(a.score - b.score) <= 2500).length;
      const gErr = [], rErr = [];
      for (const [a, b] of samples) {
        if (a.p[1][2] && b.p[1][2]) gErr.push(Math.hypot(dx(a.p[1][0], b.p[1][0]), a.p[1][1] - b.p[1][1]));
        const m = new Map(a.r.map((q) => [q[0], q]));
        for (const q of b.r) { const h = m.get(q[0]); if (h) rErr.push(Math.hypot(dx(h[1], q[1]), h[2] - q[2])); }
      }
      const med = (x) => { const s = [...x].sort((p, q) => p - q); return s.length ? s[Math.floor(s.length / 2)] : 99; };
      const last = samples[samples.length - 1];
      console.log(`      online ${lag} ms: host t ${last[0].t.toFixed(0)} s wave ${last[0].wave + 1} score ${last[0].score} lives ${last[0].lives} kills ${last[0].k} · guest t ${last[1].t.toFixed(0)} s · guest-rider err ${med(gErr).toFixed(2)} m · rider err ${med(rErr).toFixed(2)} m (${rErr.length})`);
      ok(last[0].t > 20 && last[1].t > 20, `online ${lag} ms: both arenas run in real time`);
      ok(same >= samples.length - 2 && scoreClose >= samples.length - 3, `online ${lag} ms: same sector/wave/lives on both (${same}/${samples.length}), score close (${scoreClose}/${samples.length})`);
      ok(med(gErr) < 2.5 + lag / 40 && med(rErr) < 2.5 + lag / 40, `online ${lag} ms: the guest's rider and the riders line up across the two pages`);
      await Gp.screenshot({ path: `${shots}/sys_online_guest_${lag}.png` });
      await H.screenshot({ path: `${shots}/sys_online_host_${lag}.png` });
      // the guest quits: the host is told and goes back to the title
      await ev(Gp, () => window.__lw.act('quit'));
      ok(await waitFor(H, () => /WINGMATE LEFT|CONNECTION LOST/.test(document.querySelector('#banner .b1').textContent), 8000), `online ${lag} ms: the host is told the wingmate left`);
      ok(await waitFor(H, () => window.__lw.G.state === 'title', 6000), `online ${lag} ms: and returns to the title`);
      await closePage(Gp, `online ${lag} ms guest`);
      await closePage(H, `online ${lag} ms host`);
    }
  }
} catch (e) {
  console.log('FAIL  threw: ' + (e && e.stack || e));
  fail++;
} finally {
  if (browser) await browser.close();
  unlock();
}
ok(!allPosts.some((p) => p.body && p.body.initials !== 'ZQX'), `no unexpected score POSTs (${allPosts.length} intercepted, all from the scores section)`);
console.log(`${fail ? 'FAIL (' + fail + ')' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
