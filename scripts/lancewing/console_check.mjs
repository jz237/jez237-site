// Browser check (Playwright + headless Edge, takes the shared lock D:/Projects/.tmp/arcade-trio-edge.lock, < 8 min):
//   - the ?test=1 self-test page: every check passes
//   - ?fixed frames of the title, sector 1 (how spaced the medium start is), every sector, three bosses, phone
//     portrait + landscape, a real game over with the initials prompt (screenshots tune_*.png in the work folder)
//   - the attract demo starts by itself after ~12 s on the title
//   - ?autoplay: the demo autopilot plays the campaign
//   - ?playthrough from the sector 1 boss: the boss falls, the refit screen shows, sector 2 starts
//   - the real-time title (not ?fixed) with the world board (the board GET is answered here with sample rows)
//   - online pages: host a room on the LOCAL relay, a second page joins with ?room=, START, both arenas run
//   - shader programs: the count after visiting every sector, boss, the demo and the playthrough equals the boot count
// FAILS on any console error, any score POST (all intercepted, none may happen) or a failed step.
//   node scripts/lancewing/console_check.mjs [baseUrl=http://127.0.0.1:8771/games/2026-11-06/lancewing/] [relay=ws://127.0.0.1:8781] [shotDir]
// ONLY=test,frames,demo,autoplay,playthrough,title,online picks sections (default all).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8771/games/2026-11-06/lancewing/';
const relay = process.argv[3] || 'ws://127.0.0.1:8781';
const shots = process.argv[4] || 'D:/Projects/.tmp/arcade-trio-work/lancewing/shots';
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (k) => !ONLY.length || ONLY.includes(k);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FAKE = [{ initials: 'ACE', score: 182400, extra: 'ALL CLEAR' }, { initials: 'JEZ', score: 96350, extra: 'S4 BOSS' }, { initials: 'KIT', score: 51200, extra: 'S3 WAVE 2' }, { initials: 'ROO', score: 23950, extra: 'S2 WAVE 4' }];

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
if (!(await lock())) { console.error('could not take the edge lock'); process.exit(3); }
process.on('exit', unlock);
let fail = 0, browser;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
const t0 = Date.now();
const errors = [], posts = [];
async function open(viewport = { width: 1280, height: 720 }, touch = false) {
  const ctx = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1 });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts.push(route.request().url()); return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE) });
  });
  await ctx.route('**/fonts.g*/**', (route) => route.abort());
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g|ERR_FAILED|net::/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.ctx = ctx;
  return page;
}
const ev = (page, fn, arg) => page.evaluate(fn, arg);
const waitFor = (page, fn, ms = 30000, arg) => page.waitForFunction(fn, arg, { timeout: ms, polling: 100 }).then(() => true, () => false);
// ?fixed: run frames (drawing only the last of each chunk) until cond (an expression) holds
async function runUntil(page, cond, maxFrames = 20000, chunk = 600) {
  for (let f = 0; f < maxFrames; f += chunk) {
    const done = await page.evaluate(([c, n]) => { const lw = window.__lw; for (let i = 0; i < n; i += 60) { lw.tick(60, 1 / 60, false); if ((0, eval)(c)) return true; } return false; }, [cond, chunk]);
    if (done) return true;
  }
  return false;
}
const programs = (page) => ev(page, () => window.__lw.R.r.info.programs.length);
// run n frames at 60 fps; the camera only moves on drawn frames, so the last 2 s are drawn for a settled shot
const play = (page, n) => ev(page, (n) => { const lw = window.__lw; lw.tick(Math.max(0, n - 120), 1 / 60, false); lw.tick(Math.min(n, 120)); }, n);
const fixedTitle = async (page, q = '') => { await page.goto(base + '?fixed&noscores&seed=5' + q); await page.waitForFunction(() => window.__lw && window.__lw.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 60000 }); };
const snap = async (page, name) => { await page.screenshot({ path: `${shots}/tune_${name}.png` }); };

try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await open();

  if (want('test')) {
    await page.goto(base + '?test=1');
    await page.waitForFunction(() => window.__lwTests && window.__lwTests.done, null, { timeout: 240000 });
    const t = await ev(page, () => window.__lwTests);
    for (const r of t.results) ok(r.ok, `self-test: ${r.name} (${r.info})`);
    await page.screenshot({ path: `${shots}/tune_selftest.png` });
  }

  let boot = 0;
  if (want('frames')) {
    await fixedTitle(page);
    await ev(page, () => window.__lw.tick(120));
    boot = await programs(page);
    const info = await ev(page, () => { const R = window.__lw.R, inf = R.r.info; inf.autoReset = false; inf.reset(); window.__lw.tick(1); const o = { calls: inf.render.calls, tris: inf.render.triangles }; inf.autoReset = true; return o; });
    console.log(`      title: ${boot} shader programs, ${info.calls} draw calls, ${info.tris} triangles`);
    // sector 1: the medium start, flown by the human-like autopilot
    await ev(page, () => { window.__lw.startCampaign(0); window.__lw.auto('human'); });
    const s1 = [];
    for (let i = 0; i < 6; i++) {
      await play(page, 300);
      s1.push(await ev(page, () => { const W = window.__lw.W; return `${W.t.toFixed(0)}s:${W.riders.length}+${W.portals.length}`; }));
      if (i === 2) await snap(page, 's1_start');
    }
    await snap(page, 's1_later');
    console.log(`      sector 1, riders in the air + forming every 5 s: ${s1.join(' ')}`);
    ok(s1.some((x) => /:[2-9]\+|:1\+[1-9]/.test(x)), 'sector 1: two or more riders up at once within the first half minute');
    for (const [s, name] of [[1, 'caverns'], [2, 'foundry'], [3, 'glacier'], [4, 'eclipse']]) {
      await ev(page, (s) => { window.__lw.startCampaign(s, { wave: 1 }); window.__lw.auto('human'); }, s);
      await play(page, 60 * 12);
      await snap(page, `s${s + 1}_${name}`);
    }
    for (const [s, name, secs] of [[0, 'gale', 16], [4, 'sovereign', 20], [2, 'colossus', 18], [3, 'leviathan', 24]]) {
      await ev(page, (s) => { window.__lw.startCampaign(s, { wave: 4 }); window.__lw.auto('demo'); }, s);
      await play(page, 60 * secs);
      await snap(page, `boss_${name}`);
      ok(await ev(page, () => !!window.__lw.W.boss || window.__lw.W.over), `boss ${name}: the fight is on`);
    }
    // a real game over: walk off the ledge into the sea until every life is gone, then the initials prompt
    await ev(page, () => { window.__lw.toTitle(); window.__lw.tick(5); window.__lw.startCampaign(0); window.__lw.W.score = 12345; });
    await page.keyboard.down('KeyD');
    let over = await runUntil(page, 'window.__lw.W.over', 9000, 300);
    await page.keyboard.up('KeyD');
    over = over && await waitFor(page, () => window.__lw.G.screen === 'results', 6000);   // the results come up on a real-time timer
    await ev(page, () => window.__lw.tick(30));
    ok(over && await ev(page, () => !document.getElementById('ini-wrap').classList.contains('hidden')), 'game over: the results screen asks for 3 initials');
    await snap(page, 'gameover_initials');
    // phone layouts
    await page.setViewportSize({ width: 412, height: 915 });
    await page.waitForTimeout(300);
    await ev(page, () => { window.__lw.toTitle(); window.__lw.tick(5); window.__lw.settings.touch = 'on'; window.__lw.settingsApply(); window.__lw.startCampaign(0); window.__lw.auto('human'); });
    await play(page, 60 * 12);
    await snap(page, 'phone_portrait');
    await page.setViewportSize({ width: 915, height: 412 });
    await page.waitForTimeout(300);
    await ev(page, () => window.__lw.tick(60 * 2));
    await snap(page, 'phone_landscape');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(300);
    const after = await programs(page);
    ok(after === boot, `shader programs: ${boot} at boot, ${after} after every sector, four bosses, a game over and the phone layouts`);
  }

  if (want('demo')) {
    await fixedTitle(page);
    const b0 = await programs(page);
    const started = await runUntil(page, "window.__lw.G.mode === 'demo'", 60 * 16, 60);
    ok(started, 'attract demo starts by itself on the title (after about 12 s idle)');
    await play(page, 60 * 8);
    await snap(page, 'demo');
    const d = await ev(page, () => ({ mode: window.__lw.G.mode, t: window.__lw.W.t, badge: !document.getElementById('demo-badge').classList.contains('hidden') }));
    ok(d.mode === 'demo' && d.t > 7 && d.badge, `attract demo plays (${d.t.toFixed(0)} s, badge shown)`);
    ok(await programs(page) === b0, 'attract demo: no new shader programs');
  }

  if (want('autoplay')) {
    await page.goto(base + '?autoplay&fixed&seed=3');
    await page.waitForFunction(() => window.__lw && window.__lw.W && window.__lw.G.mode === 'autoplay', null, { timeout: 60000 });
    await runUntil(page, 'window.__lw.W.t > 90', 6000);
    const a = await ev(page, () => { const W = window.__lw.W; return { mode: window.__lw.G.mode, t: W.t, wave: W.wave, sector: W.sector, kills: W.stats.kills, auto: !!window.__lw.G.run.auto }; });
    ok(a.mode === 'autoplay' && a.t > 90 && a.kills > 3 && a.auto, `?autoplay: the demo autopilot plays the campaign (S${a.sector + 1} wave ${a.wave + 1}, ${a.kills} riders unhorsed in ${a.t.toFixed(0)} s, marked as autopilot)`);
  }

  if (want('playthrough')) {
    await page.goto(base + '?playthrough&fixed&seed=2&sector=0&wave=4');
    await page.waitForFunction(() => window.__lw && window.__lw.W && window.__lw.G.mode === 'playthrough', null, { timeout: 60000 });
    const p0 = await programs(page);
    let cleared = false;
    for (let i = 0; i < 6 && !cleared; i++) {
      await runUntil(page, "window.__lw.G.state !== 'play'", 60 * 240);
      for (let k = 0; k < 40; k++) { const st = await ev(page, () => window.__lw.G.state); if (st === 'upgrade' || st === 'play') break; await page.waitForTimeout(250); await ev(page, () => window.__lw.tick(2)); }
      cleared = await ev(page, () => window.__lw.G.state === 'upgrade');
      if (!cleared) await waitFor(page, () => window.__lw.G.state === 'play', 6000);   // RETRY
    }
    ok(cleared, 'AI PLAYTHROUGH: the sector 1 boss falls and the refit screen shows');
    await snap(page, 'playthrough_shop');
    const picks = await ev(page, () => document.querySelectorAll('.upg.pick').length);
    // the refit screen moves on by itself after a few seconds
    const rolled = await waitFor(page, () => window.__lw.G.state === 'play' && window.__lw.W.sector === 1, 9000);
    ok(rolled, `AI PLAYTHROUGH: rolls on into sector 2 by itself (${picks} picks lit up in the shop)`);
    await runUntil(page, 'window.__lw.W.t > 10', 2000);
    await play(page, 150);
    await snap(page, 'playthrough_s2');
    ok(await programs(page) === p0, 'AI PLAYTHROUGH: no new shader programs from the boss into sector 2');
  }

  if (want('title')) {
    const tp = await open();
    await tp.goto(base + '?noscores&seed=3');
    await tp.waitForFunction(() => window.__lw && window.__lw.G.state === 'title', null, { timeout: 60000 });
    ok(await waitFor(tp, () => /ACE/.test(document.getElementById('tb-rows').textContent) && document.getElementById('tb-src').textContent === 'WORLD', 10000), 'title: the world board shows (lancewing-2026, sample rows answered by the check)');
    await tp.waitForTimeout(1500);
    await tp.screenshot({ path: `${shots}/tune_title.png` });
    ok(await ev(tp, () => /VERSION\s*1\.0\.0/.test(document.getElementById('title').textContent)), 'title: shows the version (VERSION 1.0.0)');
    await tp.ctx.close();
  }

  if (want('online')) {
    let up = false;
    try { const r = await fetch(relay.replace(/^ws/, 'http') + '/rooms'); up = r.ok; } catch { up = false; }
    if (ok(up, `online: local relay at ${relay}`)) {
      const H = await open(), Gp = await open();
      await H.goto(base + `?relay=${encodeURIComponent(relay)}&noscores&seed=4`);
      await H.waitForFunction(() => window.__lw && window.__lw.G.state === 'title', null, { timeout: 60000 });
      await H.click('#title [data-act="online"]');
      await H.click('#online [data-opt="netRoute"] [data-v="1"]');
      await H.click('#online [data-act="net-host"]');
      const okRoom = await waitFor(H, () => /^[A-Z0-9]{4}$/.test(document.getElementById('room-code').textContent), 8000);
      const code = await ev(H, () => document.getElementById('room-code').textContent);
      ok(okRoom, `online: HOST A ROOM shows a code (LW-${code})`);
      await Gp.goto(base + `?relay=${encodeURIComponent(relay)}&noscores&room=${code}`);
      await Gp.waitForFunction(() => window.__lw && window.__lw.G.screen === 'online', null, { timeout: 60000 });
      await Gp.click('#online [data-act="net-join"]');
      ok(await waitFor(H, () => !document.getElementById('net-go').classList.contains('hidden'), 10000), 'online: the host sees the wingmate join');
      await H.click('#net-go');
      ok(await waitFor(Gp, () => window.__lw.G.mode === 'online' && window.__lw.G.state === 'play', 8000), 'online: the guest page starts the arena');
      await sleep(6000);
      const s = await Promise.all([H, Gp].map((p) => ev(p, () => ({ t: window.__lw.W.t, riders: window.__lw.W.riders.length, players: window.__lw.W.players.length }))));
      ok(s[0].t > 3 && s[1].t > 3 && s[1].players === 2, `online: both arenas run (host ${s[0].t.toFixed(1)} s, guest ${s[1].t.toFixed(1)} s, ${s[1].riders} riders on the guest)`);
      await Gp.screenshot({ path: `${shots}/tune_online_guest.png` });
      await Gp.ctx.close(); await H.ctx.close();
    }
  }

  ok(!errors.length, `no console errors${errors.length ? ':\n  ' + [...new Set(errors)].slice(0, 12).join('\n  ') : ''}`);
  ok(!posts.length, `no score POSTs (${posts.length} intercepted)`);
} catch (e) { console.error('check crashed:', e.stack || e.message); fail++; }
finally { if (browser) await browser.close().catch(() => {}); unlock(); }
console.log(`${fail ? 'FAIL' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
