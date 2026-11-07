// Online co-op on a LOCAL relay (a copy of the Steel Duel worker under wrangler dev --local): two headless
// Edge pages, the host makes room VM-XXXX, the guest joins by code, both infiltrators are flown by the demo
// autopilot in real time. Checks, sampled twice a second on both pages: the same room on both sides, the
// guest's own suit where the guest put it, the host's suit where the host has it, the same robots, lives
// and score, ~20 snapshots a second, the guest's shots reaching the host, room transitions, the boss room
// and a boss kill, a death and a respawn on each side (each autopilot is switched off for a few seconds),
// the endless floor change, both pages ending on the results screen, a partner leaving, and QUICK MATCH
// pairing two pages in a VM-Q- room. Runs at 0 ms and with ~80 ms of extra latency each way (?netlag=80
// on the guest page). Fails on console errors or score POSTs.
//   node scripts/voltmaze/net_check.mjs [lags=0,80] [baseUrl] [relayPort=8783]
// (one lag per run keeps the Edge lock under ~5 minutes: node net_check.mjs 0 ; node net_check.mjs 80)
// Starts (and afterwards stops) the relay itself unless one already listens on the port; needs the static
// server (D:/Projects/.tmp/arcade-trio-work/voltmaze/serve.py 8773). Takes the shared Edge lock.
import { createRequire } from 'module';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const lags = (process.argv[2] || '0,80').split(',').map(Number);
const base = process.argv[3] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const port = +(process.argv[4] || 8783);
const RELAY_DIR = 'D:/Projects/.tmp/arcade-trio-work/voltmaze/relay';
const WRANGLER = 'D:/Projects/.tmp/descent2-site/node_modules/.bin/wrangler.cmd';
const shots = 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0, posts = 0;
const errors = [];
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; return c; };
const med = (a) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, q) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * q))]; };

// ------------------------------------------------------------ the local relay
async function relayUp() { try { const r = await fetch(`http://127.0.0.1:${port}/rooms`); return r.ok; } catch { return false; } }
let relay = null;
if (!(await relayUp())) {
  if (!fs.existsSync(RELAY_DIR)) fs.cpSync('D:/Projects/.tmp/arcade-trio/games/2026-06-14/steel-duel/worker', RELAY_DIR, { recursive: true });
  relay = spawn(WRANGLER, ['dev', '--local', '--port', String(port), '--ip', '127.0.0.1'], { cwd: RELAY_DIR, shell: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' } });
  const log = fs.createWriteStream('D:/Projects/.tmp/arcade-trio-work/voltmaze/relay.log');
  relay.stdout.pipe(log); relay.stderr.pipe(log);
  let up = false;
  for (let i = 0; i < 90 && !up; i++) { await sleep(1000); up = await relayUp(); }
  if (!up) { console.error('the local relay did not come up (see relay.log)'); stopRelay(); process.exit(4); }
  console.log(`local relay up on ${port}`);
}
function stopRelay() {
  if (!relay || !relay.pid) return;
  try { execSync(`taskkill /pid ${relay.pid} /T /F`, { stdio: 'ignore' }); } catch { /* gone */ }
  // workerd can outlive its wrangler parent: stop whatever still listens on the relay port
  try { execSync(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`, { stdio: 'ignore' }); } catch { /* none */ }
  relay = null;
}

// ------------------------------------------------------------ the Edge lock
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
for (let i = 0; ; i++) {
  try { fs.mkdirSync(LOCK); break; } catch {
    try { const st = fs.statSync(LOCK); if (Date.now() - st.mtimeMs > 10 * 60 * 1000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
    if (i > 300) { console.error('could not get the Edge lock'); stopRelay(); process.exit(3); }
    console.log('waiting for the Edge lock…'); await sleep(3000 + Math.random() * 4000);
  }
}
const release = () => { try { fs.rmdirSync(LOCK); } catch { /* already */ } };
process.on('exit', () => { release(); stopRelay(); });
const t0 = Date.now();

let browser;
async function open(q) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => { if (route.request().method() === 'POST') posts++; return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); });
  await ctx.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.route('**/fonts.gstatic.com/**', (r) => r.abort());
  const page = await ctx.newPage();
  const tag = q.includes('netlag') ? 'guest' : 'page';
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  await page.goto(base + q);
  await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
  return { ctx, page };
}
// steer the local suit straight at the nearest electrified wall (the autopilot is kept to put back afterwards)
const WALL_RUN = () => {
  const vm = window.__vm, G = vm.G;
  G.aiSaved = G.ai;
  G.ai = { debug: {}, control: (W, me) => {
    let best = null, bd = 1e9;
    for (const w of W.room.walls) { const x = Math.max(w[0], Math.min(w[2], me.x)), z = Math.max(w[1], Math.min(w[3], me.z)), d = Math.hypot(x - me.x, z - me.z); if (d < bd) { bd = d; best = [x - me.x, z - me.z]; } }
    const l = best ? Math.hypot(best[0], best[1]) || 1 : 1;
    return { mx: best ? best[0] / l : 1, mz: best ? best[1] / l : 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false };
  } };
};
const SAMPLE = () => {
  const vm = window.__vm, G = vm.G, W = G.W, N = vm.NET;
  if (!W || !W.room) return null;
  const P = (p) => (p ? [+p.x.toFixed(3), +p.z.toFixed(3), p.alive ? 1 : 0] : null);
  return { at: performance.now(), mode: G.mode, state: G.state, screen: G.screen, host: N.host, key: W.room.key, boss: W.room.boss ? 1 : 0, floor: W.floor, phase: W.phase, lives: W.lives, score: W.score, over: W.over ? 1 : 0,
    p1: P(W.players[0]), p2: P(W.players[1]), robots: W.robots.filter((e) => e.hp > 0).length, bhp: W.boss ? W.boss.hp : null, stat: { ...N.stat }, rtt: Math.round(N.rtt), deaths: W.stats.deaths, kills: W.stats.kills };
};

async function session(lag, cfg, label, seconds) {
  console.log(`-- co-op ${label}, extra latency ${lag} ms each way`);
  const H = await open(`?relay=ws://127.0.0.1:${port}&noscores&q=low`);
  const Gp = await open(`?relay=ws://127.0.0.1:${port}&noscores&q=low${lag ? '&netlag=' + lag : ''}`);
  const host = H.page, guest = Gp.page;
  await host.evaluate(() => { window.__vm.act('online'); window.__vm.act('net-host'); });
  const code = await host.evaluate(() => document.getElementById('room-code').textContent);
  await sleep(600);
  await guest.evaluate((code) => { window.__vm.act('online'); document.getElementById('join-code').value = code; window.__vm.act('net-join'); }, code);
  const joined = await host.waitForFunction(() => !document.getElementById('net-go').classList.contains('hidden'), null, { timeout: 15000 }).then(() => true, () => false);
  const room = await host.evaluate(() => window.__vm.NET.room);
  ok(joined && /^VM-[A-Z2-9]{4}$/.test(room), `host room ${room}: the guest joined by code`);
  if (!joined) { await H.ctx.close(); await Gp.ctx.close(); return; }
  for (const pg of [host, guest]) await pg.evaluate(() => { window.__vm.G.autopilot = true; });
  await host.evaluate((cfg) => { const vm = window.__vm; vm.settings.netRoute = cfg.route; vm.online.hostStart(cfg.extra); }, cfg);
  const started = await guest.waitForFunction(() => window.__vm.G.mode === 'online' && window.__vm.G.W && window.__vm.G.W.net === 'guest', null, { timeout: 15000 }).then(() => true, () => false);
  ok(started, 'the host started; the guest is in the same run');
  const hs = [], gs = [];
  const T = Date.now();
  let killedHost = false, killedGuest = false, sawRespawnG = false, sawRespawnH = false;
  let gDown = null, hDown = null;
  while (Date.now() - T < seconds * 1000) {
    const [a, b] = await Promise.all([host.evaluate(SAMPLE), guest.evaluate(SAMPLE)]);
    if (a) hs.push(a); if (b) gs.push(b);
    if (!a || !b) { await sleep(500); continue; }
    if (a.over && b.over && a.screen === 'results' && b.screen === 'results') break;
    const el = (Date.now() - T) / 1000;
    // in an ordinary room, each side's suit is run into an electrified wall once: it dies and has to come back
    if (!killedGuest && el > 12 && !b.boss && b.phase === 'play' && b.p2 && b.p2[2]) { killedGuest = true; gDown = { deaths: a.deaths, lives: a.lives }; await guest.evaluate(WALL_RUN); }
    if (killedGuest && gDown && !gDown.dead && b.p2 && !b.p2[2]) { gDown.dead = el; await guest.evaluate(() => { const vm = window.__vm; vm.G.ai = vm.G.aiSaved; }); }
    if (gDown && gDown.dead && !sawRespawnG && b.p2 && b.p2[2] && a.p2 && a.p2[2]) { sawRespawnG = el; }
    if (killedGuest && gDown && !gDown.dead && el > 40) { await guest.evaluate(() => { const vm = window.__vm; vm.G.ai = vm.G.aiSaved; }); gDown.dead = -1; }
    if (sawRespawnG && !killedHost && !a.boss && a.phase === 'play' && a.p1 && a.p1[2] && el > 20) { killedHost = true; hDown = {}; await host.evaluate(WALL_RUN); }
    if (killedHost && hDown && !hDown.dead && a.p1 && !a.p1[2]) { hDown.dead = el; await host.evaluate(() => { const vm = window.__vm; vm.G.ai = vm.G.aiSaved; }); }
    if (hDown && hDown.dead && !sawRespawnH && a.p1 && a.p1[2] && b.p1 && b.p1[2]) sawRespawnH = el;
    if (killedHost && hDown && !hDown.dead && el > 60) { await host.evaluate(() => { const vm = window.__vm; vm.G.ai = vm.G.aiSaved; }); hDown.dead = -1; }
    await sleep(450);
  }
  const dur = (Date.now() - T) / 1000;
  await guest.screenshot({ path: `${shots}/net_${label.replace(/\W+/g, '_')}_${lag}_guest.png` });
  await host.screenshot({ path: `${shots}/net_${label.replace(/\W+/g, '_')}_${lag}_host.png` });
  // pair the samples by time
  const pairs = [];
  for (const b of gs) { let best = null, bd = 1e9; for (const a of hs) { const d = Math.abs(a.at - b.at - (hs[0].at - gs[0].at)); if (d < bd) { bd = d; best = a; } } if (best) pairs.push([best, b]); }
  const play = pairs.filter(([a, b]) => a.phase === 'play' && b.phase === 'play' && !a.over);
  const same = play.filter(([a, b]) => a.key === b.key);
  ok(play.length > 20 && same.length / play.length > 0.9, `same room on both sides ${same.length}/${play.length} samples`);
  const g2 = same.filter(([a, b]) => a.p2 && b.p2 && a.p2[2] && b.p2[2]).map(([a, b]) => Math.hypot(a.p2[0] - b.p2[0], a.p2[1] - b.p2[1]));
  const g1 = same.filter(([a, b]) => a.p1 && b.p1 && a.p1[2] && b.p1[2]).map(([a, b]) => Math.hypot(a.p1[0] - b.p1[0], a.p1[1] - b.p1[1]));
  ok(med(g2) < 0.9 && pct(g2, 0.9) < 2.2, `the guest's suit on the host follows the guest (median ${med(g2).toFixed(2)} m, 90% ${pct(g2, 0.9).toFixed(2)} m)`);
  ok(med(g1) < 0.9 && pct(g1, 0.9) < 2.2, `the host's suit on the guest follows the host (median ${med(g1).toFixed(2)} m, 90% ${pct(g1, 0.9).toFixed(2)} m)`);
  const rd = same.map(([a, b]) => Math.abs(a.robots - b.robots));
  ok(med(rd) <= 1, `same robots on both sides (median difference ${med(rd)})`);
  const lv = play.map(([a, b]) => (a.lives === b.lives ? 1 : 0)), sc = play.map(([a, b]) => Math.abs(a.score - b.score) <= 300 ? 1 : 0);
  ok(lv.reduce((x, y) => x + y, 0) / lv.length > 0.9 && sc.reduce((x, y) => x + y, 0) / sc.length > 0.85, 'lives and score agree');
  const gl = gs[gs.length - 1], hl = hs[hs.length - 1];
  const live = gs.filter((q) => !q.over && q.state === 'play'), sr = live.length > 1 ? (live[live.length - 1].stat.snaps - live[0].stat.snaps) / ((live[live.length - 1].at - live[0].at) / 1000) : 0;
  ok(sr > 12, `snapshots ${sr.toFixed(1)} a second at the guest while playing (rtt ~${gl.rtt} ms)`);
  ok(hl.stat.shots > 5 && hl.stat.inputs / dur > 10, `the guest's shots reach the host (${hl.stat.shots} shots, ${(hl.stat.inputs / dur).toFixed(0)} inputs/s)`);
  const keysG = new Set(gs.map((s) => s.key));
  ok(keysG.size >= 3, `room transitions followed by the guest (${keysG.size} rooms)`);
  const bossG = gs.some((s) => s.boss && s.bhp !== null), bossDown = gs.some((s, i) => i > 0 && gs[i - 1].bhp > 0 && (s.bhp === 0 || (s.bhp === null && gs[i - 1].boss && !s.boss)));
  ok(bossG, 'the boss room on the guest');
  ok(bossDown || hs.some((s) => s.bhp === 0), 'the boss goes down (seen on the guest)');
  // deaths are required in the longer endless session; the campaign one may reach the lift first
  const need = (c, msg) => (cfg.route === 'ef' || c ? ok(c, msg) : console.log(`info  ${msg}: the run ended first`));
  need(!!gDown && gDown.dead > 0 && hl.stat.deaths >= 1, `the guest ran into a wall and died, the host counted it (${hl.stat.deaths} guest deaths)`);
  need(!!sawRespawnG, `the guest came back on both sides${sawRespawnG ? ` after ${(sawRespawnG - gDown.dead).toFixed(1)} s` : ''}`);
  need(!!hDown && hDown.dead > 0, 'the host ran into a wall and died');
  need(!!sawRespawnH, `the host came back on both sides${sawRespawnH ? ` after ${(sawRespawnH - hDown.dead).toFixed(1)} s` : ''}`);

  if (cfg.route === 'ef') ok(gs.some((s) => s.floor >= 1) && gs[0].floor === 0, `the endless floor change reaches the guest (floor ${gl.floor + 1})`);
  else ok(gl.screen === 'results' && hl.screen === 'results' && gl.over && hl.over, `both pages end on the results screen (${hl.screen} / ${gl.screen})`);
  // the partner leaves
  if (cfg.route === 'ef') {
    await Gp.ctx.close();
    const left = await host.waitForFunction(() => window.__vm.G.mode === 'title' || /PARTNER LEFT|CONNECTION LOST/.test(document.getElementById('caption').textContent), null, { timeout: 15000 }).then(() => true, () => false);
    ok(left, 'the guest closes the page: the host is told and goes back to the title');
  } else await Gp.ctx.close();
  await H.ctx.close();
}

async function quick() {
  console.log('-- quick match');
  const A = await open(`?relay=ws://127.0.0.1:${port}&noscores&q=low`), B = await open(`?relay=ws://127.0.0.1:${port}&noscores&q=low`);
  await A.page.evaluate(() => { window.__vm.act('online'); window.__vm.act('net-quick'); });
  await sleep(1500);
  await B.page.evaluate(() => { window.__vm.act('online'); window.__vm.act('net-quick'); });
  const both = await Promise.all([A.page, B.page].map((p) => p.waitForFunction(() => !!window.__vm.NET.peer, null, { timeout: 20000 }).then(() => true, () => false)));
  const r = await Promise.all([A.page, B.page].map((p) => p.evaluate(() => ({ room: window.__vm.NET.room, role: window.__vm.NET.role }))));
  ok(both.every(Boolean) && r[0].room === r[1].room && /^VM-Q-[A-Z2-9]{5}$/.test(r[0].room) && new Set(r.map((q) => q.role)).size === 2, `quick match pairs two pages in ${r[0].room} (${r.map((q) => q.role).join(' + ')})`);
  await A.ctx.close(); await B.ctx.close();
}

try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  for (const lag of lags) {
    await session(lag, { route: '0', extra: { room: 1, lives: 9 } }, 'campaign S1 to the lift', 120);
    await session(lag, { route: 'ef', extra: { boss: true, lives: 9 } }, 'endless from the lift room', 100);
  }
  if (lags.includes(0)) await quick();
  for (const e of errors) console.log('ERROR', e);
  if (errors.length) fails++;
  if (posts) { console.log(`score POSTs: ${posts}`); fails++; }
  console.log(fails ? `net check FAILED (${fails})` : 'net check passed: no console errors, no score posts');
} catch (e) { console.error(e); fails++; }
finally { if (browser) await browser.close(); release(); stopRelay(); console.log(`edge lock held ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
process.exit(fails ? 1 : 0);
