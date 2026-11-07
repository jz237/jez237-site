// Voltmaze 2026 LIVE relay co-op check: two headless pages (host + guest, both played by the autopilot) pair on the
// real Steel Duel relay (wss://steel-duel-online.jez237.workers.dev/ws/VM-TEST-XXXXX, a throwaway room), play for a
// while, then the host's tab goes to the background: the facility must keep running (worker tick, js/tick.js), the
// guest must keep getting snapshots and say the host's tab is in the background (not HOST PAUSED), and the host must
// come back to a running game. Reports connection time, snapshot / input rates, RTT and agreement. Score POSTs are
// intercepted and must be 0 (?noscores + WebDriver also keep NO_POST on).
//   node scripts/voltmaze/net_live_check.mjs [baseUrl] [playSeconds=25] [hiddenSeconds=12] [shotDir]
// Takes the shared Edge lock.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('D:/Projects/.tmp/model-s-tools/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const secs = +(process.argv[3] || 25), hidSecs = +(process.argv[4] || 12);
const shots = process.argv[5] || 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots2';
fs.mkdirSync(shots, { recursive: true });
const ROOMNAME = 'VM-TEST-' + Math.random().toString(36).slice(2, 7).toUpperCase();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
for (let i = 0; ; i++) {
  try { fs.mkdirSync(LOCK); break; } catch {
    try { const st = fs.statSync(LOCK); if (Date.now() - st.mtimeMs > 10 * 60 * 1000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
    if (i > 80) { console.error('could not get the Edge lock'); process.exit(3); }
    console.log('waiting for the Edge lock…'); await sleep(5000 + Math.random() * 5000);
  }
}
const release = () => { try { fs.rmdirSync(LOCK); } catch { /* already */ } };
process.on('exit', release);
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
let posts = 0, fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
async function open(tag) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await ctx.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.route('**/fonts.gstatic.com/**', (r) => r.abort());
  await page.goto(base + '?noscores&q=low');
  await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
  await page.evaluate(() => { window.__vm.G.autopilot = true; window.__vm.settings.netRoute = '0'; });
  return { page, ctx };
}
const look = (p) => p.evaluate(() => {
  const vm = window.__vm, G = vm.G, W = G.W, N = vm.NET;
  const cap = document.getElementById('caption');
  return { mode: G.mode, state: G.state, key: W && W.room ? W.room.key : null, phase: W ? W.phase : null, score: W ? W.score : 0, lives: W ? W.lives : 0, wt: W ? W.t : 0,
    ids: W ? W.robots.filter((e) => e.hp > 0).map((e) => e.id) : [], stat: { ...N.stat }, rtt: Math.round(N.rtt), t: performance.now(), relay: N.relay,
    away: !!N.hostAway, stale: !!(N.lastSnap && performance.now() - N.lastSnap > 1500), cap: cap.classList.contains('hidden') ? '' : cap.textContent, vis: document.visibilityState, bg: G.bgTicks || 0, noPost: vm.noPost };
});

console.log(`--- live relay, room ${ROOMNAME}`);
let H, Gp;
try {
  H = await open('host'); Gp = await open('guest');
  const host = H.page, guest = Gp.page;
  const relay = await host.evaluate(() => window.__vm.NET.relay);
  ok(/^wss:\/\/steel-duel-online\.jez237\.workers\.dev/.test(relay), `pages use the live relay (${relay})`);
  const tc0 = Date.now();
  await host.evaluate((room) => { window.__vm.act('online'); window.__vm.NET.connect(room, 'host', { ini: 'TST' }); }, ROOMNAME);
  const hostIn = await host.waitForFunction(() => window.__vm.NET.role === 'p1', null, { timeout: 20000 }).then(() => true, () => false);
  ok(hostIn, `host connected as p1 in ${Date.now() - tc0} ms`);
  const tg0 = Date.now();
  await guest.evaluate((room) => { window.__vm.act('online'); window.__vm.NET.connect(room, 'join', { ini: 'TSU' }); }, ROOMNAME);
  const paired = await Promise.all([host, guest].map((p) => p.waitForFunction(() => !!window.__vm.NET.peer, null, { timeout: 25000 }).then(() => true, () => false)));
  ok(paired[0] && paired[1], `both pages see their partner (guest paired in ${Date.now() - tg0} ms)`);
  await host.evaluate(() => window.__vm.online.hostStart({ lives: 9 }));
  const started = await guest.waitForFunction(() => window.__vm.G.mode === 'online' && window.__vm.G.W && window.__vm.G.W.net === 'guest' && window.__vm.G.state === 'play', null, { timeout: 15000 }).then(() => true, () => false);
  ok(started, 'the guest starts with the host');

  // ---- normal play
  const S = [];
  const t0 = Date.now();
  while (Date.now() - t0 < secs * 1000) {
    await sleep(1000);
    const [h, g] = await Promise.all([look(host), look(guest)]);
    S.push({ h, g });
    if (h.state !== 'play') break;
  }
  const a = S[0], z = S[S.length - 1], dur = (z.g.t - a.g.t) / 1000;
  const snapRate = (z.g.stat.snaps - a.g.stat.snaps) / Math.max(1, dur), inRate = (z.h.stat.inputs - a.h.stat.inputs) / Math.max(1, dur);
  ok(snapRate > 14 && snapRate < 26, `guest receives snapshots at ${snapRate.toFixed(1)} / s`);
  ok(inRate > 8, `host receives guest inputs at ${inRate.toFixed(1)} / s`);
  let same = 0, ov = 0, ovN = 0;
  for (const { h, g } of S) {
    if (h.key === g.key && h.lives === g.lives) same++;
    if (h.ids.length + g.ids.length) { const A = new Set(h.ids); ov += g.ids.filter((x) => A.has(x)).length / Math.max(1, new Set([...h.ids, ...g.ids]).size); ovN++; }
  }
  ok(same >= S.length - 2, `room / lives agree ${same}/${S.length} samples; robots ${(100 * ov / Math.max(1, ovN)).toFixed(0)} % the same; score host ${z.h.score} guest ${z.g.score}`);
  const rtts = S.map((q) => q.g.rtt), rttsH = S.map((q) => q.h.rtt);
  console.log(`INFO  RTT through the live relay: guest ${Math.min(...rtts)}-${Math.max(...rtts)} ms (last ${z.g.rtt}), host ${Math.min(...rttsH)}-${Math.max(...rttsH)} ms (last ${z.h.rtt})`);
  console.log(`INFO  guest shots on the host ${z.h.stat.shots}, guest deaths counted by the host ${z.h.stat.deaths}`);

  // ---- the host's tab goes to the background
  console.log(`--- the host's tab goes to the background for ${hidSecs} s`);
  const other = await H.ctx.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  await sleep(500);
  let how = 'real (another tab in front)';
  if ((await host.evaluate(() => document.visibilityState)) !== 'hidden') {
    how = 'simulated (visibilityState hidden + requestAnimationFrame stopped)';
    await host.evaluate(() => {
      window.__raf = window.requestAnimationFrame; window.requestAnimationFrame = (cb) => { window.__rafCb = cb; return 0; };
      Object.defineProperty(document, 'hidden', { get: () => true, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
  }
  console.log(`INFO  background: ${how}`);
  const hb = await look(host), gb = await look(guest);
  const HS = [];
  for (let i = 0; i < hidSecs; i++) { await sleep(1000); HS.push({ h: await look(host), g: await look(guest) }); }
  const he = HS[HS.length - 1];
  await guest.screenshot({ path: `${shots}/net_live_guest_host_hidden.png` });
  const hidDur = (he.g.t - gb.t) / 1000;
  const simAdv = he.h.wt - hb.wt;
  const hidSnap = (he.g.stat.snaps - gb.stat.snaps) / hidDur;
  ok(he.h.vis === 'hidden' && he.h.bg - hb.bg > hidSecs * 20, `the hidden host runs on the worker tick (${he.h.bg - hb.bg} ticks in ${hidDur.toFixed(1)} s, state ${he.h.state})`);
  ok(simAdv > hidDur * 0.8 || he.h.state === 'ended', `the host's facility kept running: sim time +${simAdv.toFixed(1)} s in ${hidDur.toFixed(1)} s`);
  ok(hidSnap > 14, `the guest keeps getting snapshots while the host is hidden: ${hidSnap.toFixed(1)} / s`);
  ok(HS.every((q) => !q.g.stale), `the guest never sees HOST PAUSED (snapshots never stopped): ${HS.filter((q) => q.g.stale).length} stale samples`);
  ok(HS.some((q) => q.g.away && /BACKGROUND/.test(q.g.cap)), `the guest is told: "${(HS.find((q) => /BACKGROUND/.test(q.g.cap)) || { g: { cap: '' } }).g.cap}"`);
  let hsame = 0;
  for (const { h, g } of HS) if (h.key === g.key && h.lives === g.lives) hsame++;
  ok(hsame >= HS.length - 2, `host and guest still agree while hidden ${hsame}/${HS.length} (lives ${he.h.lives}, score ${he.h.score})`);

  // ---- back to the front
  if (how.startsWith('real')) await host.bringToFront();
  else await other.close().then(() => host.bringToFront()).then(() => host.evaluate(() => { delete document.hidden; delete document.visibilityState; window.requestAnimationFrame = window.__raf; document.dispatchEvent(new Event('visibilitychange')); window.requestAnimationFrame(window.__rafCb); }));
  await sleep(800);
  const hv = await look(host);
  await host.screenshot({ path: `${shots}/net_live_host_back.png` });
  ok(hv.vis === 'visible' && ['paused-online', 'play', 'ended', 'results'].includes(hv.state), `the host comes back to its running game (state ${hv.state})`);
  await host.evaluate(() => window.__vm.resume());
  await sleep(2500);
  const [h2, g2] = await Promise.all([look(host), look(guest)]);
  ok(h2.wt > hv.wt + 1.5 && !g2.away, `play goes on after resume (host sim +${(h2.wt - hv.wt).toFixed(1)} s; guest no longer told the host is away: ${!g2.away})`);
  ok(h2.bg - hv.bg === 0, `no worker ticks drive the sim once visible (${h2.bg - hv.bg})`);
  ok(h2.noPost && g2.noPost, 'NO_POST is on for both test pages');
  await host.evaluate(() => window.__vm.toTitle());
  await guest.evaluate(() => window.__vm.toTitle());
} catch (e) { console.error(e); fails++; }
finally { await browser.close(); release(); }
ok(posts === 0, `no score POSTs (${posts})`);
ok(errors.length === 0, `no console errors (${errors.slice(0, 4).join(' | ')})`);
console.log(fails ? `NET LIVE CHECK: ${fails} FAILED` : 'NET LIVE CHECK: ALL PASS');
process.exit(fails ? 1 : 0);
