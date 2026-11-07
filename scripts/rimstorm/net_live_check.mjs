// Rimstorm 2026 LIVE relay co-op check: two headless pages (host + guest, both flown by the autopilot) pair on the
// real Steel Duel relay (wss://steel-duel-online.jez237.workers.dev/ws/RS-TEST-XXXXX, a throwaway room), play for a
// while, then the host's tab goes to the background: the web must keep going (worker tick), the guest must keep
// getting snapshots and say the host is away (no WAITING FOR THE HOST), and the host must come back to a running
// web. Reports connection time, snapshot / input rates, sizes, RTT and agreement. Score POSTs are intercepted and
// must be 0 (?noscores + webdriver also keep NO_POST on).
//   node scripts/rimstorm/net_live_check.mjs [baseUrl] [playSeconds=25] [hiddenSeconds=12] [shotDir]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('D:/Projects/.tmp/model-s-tools/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8785/games/2026-11-06/rimstorm/';
const secs = +(process.argv[3] || 25), hidSecs = +(process.argv[4] || 12);
const shots = process.argv[5] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots/gaps';
const ROOMNAME = 'RS-TEST-' + Math.random().toString(36).slice(2, 7).toUpperCase();
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
let posts = 0, fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(tag) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 450 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.goto(base + '?noscores&q=low');
  await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  await page.evaluate(() => { window.__rs.G.autopilot = true; window.__rs.settings.netRoute = '0'; });
  return { page, ctx };
}
const look = (p) => p.evaluate(() => {
  const rs = window.__rs, W = rs.W, N = rs.NET;
  return { mode: rs.G.mode, state: rs.G.state, web: W.web, phase: W.phase, score: W.score, lives: W.lives, wt: W.t, ids: W.enemies.filter((e) => e.hp > 0).map((e) => e.id), stat: { ...N.stat }, rtt: Math.round(N.rtt), t: performance.now(),
    stale: !!N.stale, away: !!N.hostAway, cap: document.getElementById('caption').classList.contains('hidden') ? '' : document.getElementById('caption').textContent, vis: document.visibilityState, bg: rs.G.bgTicks || 0, last: rs.Scores.last || null };
});

console.log(`--- live relay, room ${ROOMNAME}`);
const H = await open('host'), Gp = await open('guest');
const host = H.page, guest = Gp.page;
const tc0 = Date.now();
await host.evaluate((room) => { window.__rs.act('online'); window.__rs.NET.connect(room, 'host', { ini: 'TST' }); }, ROOMNAME);
const hostIn = await host.waitForFunction(() => window.__rs.NET.role === 'p1', null, { timeout: 20000 }).then(() => true, () => false);
const tHost = Date.now() - tc0;
ok(hostIn, `host connected as p1 in ${tHost} ms`);
const tg0 = Date.now();
await guest.evaluate((room) => { window.__rs.act('online'); window.__rs.NET.connect(room, 'join', { ini: 'TSU' }); }, ROOMNAME);
const paired = await Promise.all([host, guest].map((p) => p.waitForFunction(() => !!window.__rs.NET.peer, null, { timeout: 25000 }).then(() => true, () => false)));
ok(paired[0] && paired[1], `both pages see their partner (guest paired in ${Date.now() - tg0} ms)`);
await host.evaluate(() => window.__rs.act('net-go'));
const started = await guest.waitForFunction(() => window.__rs.G.mode === 'online' && window.__rs.G.state === 'play', null, { timeout: 15000 }).then(() => true, () => false);
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
ok(z.h.stat.maxBytes < 40000, `snapshot size avg ${Math.round(z.h.stat.bytes / Math.max(1, z.h.stat.snaps))} B, max ${z.h.stat.maxBytes} B`);
let same = 0, ov = 0, ovN = 0;
for (const { h, g } of S) {
  if (h.web === g.web && h.phase === g.phase && h.lives === g.lives) same++;
  if (h.ids.length + g.ids.length) { const A = new Set(h.ids); ov += g.ids.filter((x) => A.has(x)).length / Math.max(1, new Set([...h.ids, ...g.ids]).size); ovN++; }
}
ok(same >= S.length - 2, `web / phase / lives agree ${same}/${S.length} samples; enemies ${(100 * ov / Math.max(1, ovN)).toFixed(0)} % the same; score host ${z.h.score} guest ${z.g.score}`);
const rtts = S.map((q) => q.g.rtt), rttsH = S.map((q) => q.h.rtt);
console.log(`INFO  RTT through the live relay: guest ${Math.min(...rtts)}-${Math.max(...rtts)} ms (last ${z.g.rtt}), host ${Math.min(...rttsH)}-${Math.max(...rttsH)} ms (last ${z.h.rtt})`);
console.log(`INFO  guest shots on the host ${z.h.stat.shots}, guest kills ${z.h.stat.kills2}, guest deaths ${z.h.stat.deaths2}`);

// ---- the host's tab goes to the background
console.log(`--- the host's tab goes to the background for ${hidSecs} s`);
// real background first: another tab in the host's window comes to the front; if headless keeps the page
// visible, simulate it (visibilityState 'hidden' + requestAnimationFrame stops, which is what a browser does)
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
await guest.screenshot({ path: `${shots}/net_guest_host_hidden.png` });
const hidDur = (he.g.t - gb.t) / 1000;
const simAdv = he.h.wt - hb.wt;
const hidSnap = (he.g.stat.snaps - gb.stat.snaps) / hidDur;
ok(he.h.vis === 'hidden' && he.h.bg > hidSecs * 20, `the hidden host runs on the worker tick (${he.h.bg - hb.bg} ticks in ${hidDur.toFixed(1)} s, state ${he.h.state})`);
ok(simAdv > hidDur * 0.8 || he.h.state === 'results' || he.h.state === 'ended', `the host's web kept going: sim time +${simAdv.toFixed(1)} s in ${hidDur.toFixed(1)} s`);
ok(hidSnap > 16, `the guest keeps getting snapshots while the host is hidden: ${hidSnap.toFixed(1)} / s`);
ok(HS.every((q) => !q.g.stale), `the guest never goes stale (no WAITING FOR THE HOST): ${HS.filter((q) => q.g.stale).length} stale samples`);
ok(HS.some((q) => q.g.away && /BACKGROUND/.test(q.g.cap)), `the guest is told: "${(HS.find((q) => /BACKGROUND/.test(q.g.cap)) || { g: { cap: '' } }).g.cap}"`);
let hsame = 0;
for (const { h, g } of HS) if (h.web === g.web && h.phase === g.phase && h.lives === g.lives) hsame++;
ok(hsame >= HS.length - 2, `host and guest still agree while hidden ${hsame}/${HS.length} (web ${he.h.web + 1}, lives ${he.h.lives}, score ${he.h.score})`);

// ---- back to the front
if (how.startsWith('real')) await host.bringToFront();
else await other.close().then(() => host.bringToFront()).then(() => host.evaluate(() => { delete document.hidden; delete document.visibilityState; window.requestAnimationFrame = window.__raf; document.dispatchEvent(new Event('visibilitychange')); window.requestAnimationFrame(window.__rafCb); }));
await sleep(800);
const hv = await look(host);
await host.screenshot({ path: `${shots}/net_host_back.png` });
ok(hv.vis === 'visible' && (hv.state === 'paused-online' || hv.state === 'play' || hv.state === 'results' || hv.state === 'ended'), `the host comes back to its running web (state ${hv.state}, the pause card says the web keeps going)`);
await host.evaluate(() => window.__rs.resume());
await sleep(2500);
const [h2, g2] = await Promise.all([look(host), look(guest)]);
ok(h2.wt > hv.wt + 1.5 && !g2.away, `play goes on after resume (host sim +${(h2.wt - hv.wt).toFixed(1)} s; guest no longer told the host is away: ${!g2.away})`);
const ticksAfter = h2.bg - hv.bg;
ok(ticksAfter === 0, `no worker ticks drive the sim once visible (${ticksAfter})`);

await host.evaluate(() => window.__rs.toTitle());
await guest.evaluate(() => window.__rs.toTitle());
const lasts = await Promise.all([host, guest].map((p) => p.evaluate(() => window.__rs.Scores.last || null)));
await browser.close();
ok(posts === 0 && lasts.every((q) => q === null), `no score POSTs (${posts}) and no board body built (${JSON.stringify(lasts)})`);
ok(errors.length === 0, `no console errors (${errors.slice(0, 4).join(' | ')})`);
console.log(fails ? `NET LIVE CHECK: ${fails} FAILED` : 'NET LIVE CHECK: ALL PASS');
process.exit(fails ? 1 : 0);
