// Online co-op check in Node against a LOCAL relay (a copy of the Steel Duel worker under wrangler dev): a host and
// a guest, each with its own world and the game's own online.js, run the same loop as main.js playStep in real
// time with autopilots flying both riders. Checks: room by code and quick match pairing (LW-XXXX / LW-Q-XXXXX),
// the start config, snapshot rate (~20 Hz) and size (under the relay's 48 000 character limit), the guest's world
// tracking the host's (wave, score, lives, riders, the host's rider) and the host tracking the guest's rider, duels
// the guest wins reaching the host, the guest's deaths reaching the host, and a clean leave.
//   node scripts/lancewing/online_check.mjs [relay=ws://127.0.0.1:8781] [seconds=40] [lags=0,40,80]
// lag = ms added each way on the guest (40 ~ 80 ms round trip, 80 ~ 160 ms). Never touches the real relay.
import { SIM, AI, CFG, ONL } from './_game.mjs';
const { makeWorld, step, drainEvents, STEP, applyClaim, dX } = SIM;
const { Autopilot } = AI;
const { TYPICAL_UP, START_LIVES, WAVES } = CFG;
const { Online, ROOM, QUICK, randomCode, packWorld } = ONL;

const relay = process.argv[2] || 'ws://127.0.0.1:8781';
const secs = +(process.argv[3] || 40);
const lags = (process.argv[4] || '0,40,80').split(',').map(Number);
if (!/^wss?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(relay)) { console.log('refusing: the check only runs against a local relay'); process.exit(2); }
try { const r = await fetch(relay.replace(/^ws/, 'http') + '/health'); if (!r.ok) throw new Error(r.status); } catch (e) {
  console.log(`no relay at ${relay} (${e.message}). Start one: copy games/2026-06-14/steel-duel/worker to the work folder and run wrangler dev --local --port 8781`);
  process.exit(2);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; };
const until = async (fn, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (fn()) return true; await sleep(25); } return false; };

function side(name, lag) {
  const S = { name, log: [], joined: null, cfg: null, left: null, sizes: [], W: null };
  S.net = new Online({ status: (t, k) => S.log.push([t, k]), joined: (p) => { S.joined = p; }, start: (cfg) => { S.cfg = cfg; }, left: (why) => { S.left = why; }, chat: () => {} }, { relay, lag });
  const raw = S.net.raw.bind(S.net);
  S.net.raw = (o) => { if (o.type === 'snapshot' || o.type === 'input') S.sizes.push(JSON.stringify(o).length); raw(o); };
  return S;
}
// main.js startOnline + playStep, minus the rendering
function start(S, cfg) {
  const s = +cfg.route || 0;
  S.W = makeWorld({ mode: 'campaign', sector: s, wave: cfg.wave || 0, seed: cfg.seed, coop: true, up: { ...TYPICAL_UP[s] }, lives: START_LIVES + 1, diff: cfg.diff });
  S.net.bind(S.W);
  S.ai = new Autopilot(cfg.seed + (S.net.host ? 0 : 1), 'demo');
  S.acc = 0; S.ev = {}; S.events = [];
}
function frame(S, dt) {
  const W = S.W, net = S.net, host = net.host;
  if (!host) for (const e of net.guestSync(W)) S.events.push(e);
  S.acc += dt;
  let n = 0;
  while (S.acc >= STEP && n < 12) {
    const me = host ? W.players[0] : W.players[1];
    me.input = S.ai.control(W, me);
    if (host) net.hostTick(W, applyClaim);
    step(W, STEP);
    let ev = drainEvents(W);
    if (!host) ev = ev.filter((e) => e.pid === 2 && ['flap', 'death', 'splash', 'land'].includes(e.k));
    if (host) net.hostEvents(ev);
    for (const e of ev) S.events.push(e);
    S.acc -= STEP; n++;
    if (W.over) break;
  }
  if (host) net.hostFrame(W, dt); else net.guestFrame(W, dt);
}

async function session(lag, label, pair) {
  const H = side('host', 0), Gs = side('guest', lag);
  await pair(H, Gs);
  ok(await until(() => H.joined && Gs.joined), `${label}: both riders see each other (${H.net.room})`);
  ok(H.net.role === 'p1' && Gs.net.role === 'p2' && H.net.room === Gs.net.room, `${label}: host is p1, guest is p2 in the same room`);
  const cfg = { route: '2', seed: 9000 + lag, diff: 'normal', wave: 0 };
  H.net.sendStart(cfg); start(H, cfg);
  ok(await until(() => Gs.cfg), `${label}: the guest receives the start`);
  if (!Gs.cfg) return;
  ok(JSON.stringify(Gs.cfg) === JSON.stringify(cfg), `${label}: start config arrives unchanged (the relay overwrites t/from/role/mode only)`);
  start(Gs, Gs.cfg);
  // run both in real time
  const t0 = performance.now();
  let last = t0, samples = 0, waveOk = 0, scoreOk = 0, livesOk = 0, gpos = [], hpos = [], rpos = [];
  const snaps0 = Gs.net.stat.snaps;
  while (performance.now() - t0 < secs * 1000 && !H.W.over) {
    await sleep(16);
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    frame(H, dt); frame(Gs, dt);
    if (now - t0 > 3000 && Math.floor((now - t0) / 250) !== Math.floor((now - t0 - dt * 1000) / 250)) {
      samples++;
      const a = H.W, b = Gs.W;
      if (a.wave === b.wave && a.waveN === b.waveN) waveOk++;
      if (Math.abs(a.score - b.score) <= 2000) scoreOk++;
      if (a.lives === b.lives) livesOk++;
      const hg = a.players[1], gg = b.players[1];
      if (hg.alive && gg.alive) gpos.push(Math.hypot(dX(hg.x, gg.x), hg.y - gg.y));
      const hh = a.players[0], gh = b.players[0];
      if (hh.alive && gh.alive) hpos.push(Math.hypot(dX(hh.x, gh.x), hh.y - gh.y));
      const m = new Map(a.riders.map((r) => [r.id, r]));
      for (const r of b.riders) { const q = m.get(r.id); if (q) rpos.push(Math.hypot(dX(q.x, r.x), q.y - r.y)); }
    }
  }
  const dur = (performance.now() - t0) / 1000;
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const p90 = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length * 0.9)] : 0; };
  const rate = (Gs.net.stat.snaps - snaps0) / dur;
  const maxSnap = Math.max(0, ...H.sizes), maxIn = Math.max(0, ...Gs.sizes);
  console.log(`      ${label}: ${dur.toFixed(0)} s · rtt ${Math.round(Gs.net.rtt)} ms · host wave ${H.W.wave + 1} score ${H.W.score} lives ${H.W.lives} · guest kills ${H.events.filter((e) => e.k === 'unhorse' && e.pid === 2).length}, host kills ${H.events.filter((e) => e.k === 'unhorse' && e.pid === 1).length}, guest deaths ${H.events.filter((e) => e.k === 'death' && e.pid === 2).length}`);
  ok(rate > 14 && rate < 24, `${label}: snapshots arrive at ${rate.toFixed(1)} Hz`);
  ok(maxSnap < 48000 && maxIn < 48000, `${label}: largest snapshot ${maxSnap} chars, largest input ${maxIn} (relay limit 48 000)`);
  ok(waveOk / samples > 0.9, `${label}: same wave on both machines ${Math.round((100 * waveOk) / samples)} % of samples`);
  ok(scoreOk / samples > 0.9 && livesOk / samples > 0.9, `${label}: score within 2000 ${Math.round((100 * scoreOk) / samples)} %, lives equal ${Math.round((100 * livesOk) / samples)} %`);
  const tol = 1.5 + lag / 40;
  ok(med(gpos) < tol && p90(gpos) < tol * 2.2, `${label}: the host sees the guest's rider within ${med(gpos).toFixed(2)} m median / ${p90(gpos).toFixed(2)} m p90`);
  ok(med(hpos) < tol && p90(hpos) < tol * 2.2, `${label}: the guest sees the host's rider within ${med(hpos).toFixed(2)} m median / ${p90(hpos).toFixed(2)} m p90`);
  ok(med(rpos) < tol && rpos.length > 50, `${label}: riders match within ${med(rpos).toFixed(2)} m median / ${p90(rpos).toFixed(2)} m p90 (${rpos.length} samples)`);
  ok(H.events.some((e) => e.pid === 2 && (e.k === 'unhorse' || e.k === 'clang' || e.k === 'collect')), `${label}: the guest's duels / pickups count on the host`);
  // the guest falls into the sea on its own machine: the host takes the life, respawns the rider, the guest follows
  {
    const lives0 = H.W.lives, me = Gs.W.players[1], ev0 = H.events.length;
    let t = 0, sawDead = false, back = false, last = performance.now();
    if (!me.alive) await until(() => { const now = performance.now(); frame(H, (now - last) / 1000); frame(Gs, (now - last) / 1000); last = now; return me.alive; }, 8000);
    me.y = 0.1; me.vy = -5; me.on = -1;
    Gs.ai = { control: () => ({ mx: 0, flap: false }) };
    while (t < 9000 && !back) {
      await sleep(16);
      const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt * 1000;
      frame(H, dt); frame(Gs, dt);
      if (!H.W.players[1].alive) sawDead = true;
      if (sawDead && H.W.players[1].alive && me.alive) back = true;
    }
    // the host's own rider keeps flying meanwhile and may lose a life of its own: count every death the host saw
    const deaths = H.events.slice(ev0).filter((e) => e.k === 'death'), g2 = deaths.filter((e) => e.pid === 2).length;
    ok(sawDead && g2 >= 1 && H.W.lives === lives0 - deaths.length + H.events.slice(ev0).filter((e) => e.k === 'life').length,
      `${label}: a guest's sea death reaches the host (lives ${lives0} -> ${H.W.lives}; ${g2} guest + ${deaths.length - g2} host deaths in the window)`);
    ok(back, `${label}: the host respawns the guest's rider and the guest flies again`);
  }
  // the guest leaves: the host is told
  Gs.net.close();
  ok(await until(() => H.left, 6000), `${label}: the host sees the guest leave (${H.left})`);
  H.net.close();
  return { H, Gs };
}

for (const lag of lags) {
  const code = randomCode(4);
  await session(lag, `code room, guest lag ${lag} ms`, async (H, Gs) => {
    H.net.connect(ROOM + code, 'host', { ini: 'HST' });
    await until(() => H.net.role === 'p1');
    Gs.net.connect(ROOM + code, 'join', { ini: 'GST' });
  });
}
// quick match: two players press QUICK MATCH a moment apart and end up in the same LW-Q- room
{
  const H = side('q1', 0), Gs = side('q2', 0);
  H.net.quick({ ini: 'QQA' });
  await until(() => H.net.role === 'p1');
  await sleep(600);
  Gs.net.quick({ ini: 'QQB' });
  ok(await until(() => H.joined && Gs.joined, 10000), `quick match pairs two players (${H.net.room})`);
  ok(String(H.net.room).startsWith(QUICK) && H.net.room === Gs.net.room && H.net.role === 'p1' && Gs.net.role === 'p2', 'quick match: one LW-Q- room, host p1, guest p2');
  // a join to a room that does not exist is refused cleanly
  const X = side('x', 0);
  X.net.connect(ROOM + 'ZZZ9', 'join', { ini: 'XXX' });
  ok(await until(() => X.log.some(([t, k]) => k === 'error' && /No room/.test(t))), 'joining an unknown code says so');
  H.net.close(); Gs.net.close(); X.net.close();
}
// snapshot size in the busiest moments (a boss fight with shots) from a sim-only run
{
  let max = 0;
  for (let s = 0; s < 5; s++) {
    const W = makeWorld({ mode: 'campaign', sector: s, wave: WAVES, seed: 77 + s, coop: true, up: TYPICAL_UP[s] });
    const ais = W.players.map((p, i) => new Autopilot(s * 5 + i, 'demo'));
    for (let i = 0; i < 120 / STEP && !W.over; i++) { W.players.forEach((p, k) => { p.input = ais[k].control(W, p); }); step(W, STEP); const ev = drainEvents(W); if (i % 6 === 0) max = Math.max(max, JSON.stringify({ type: 'snapshot', s: packWorld(W), ev: ev.slice(0, 80), hr: 100 }).length); }
  }
  ok(max < 30000, `snapshots stay small in every boss fight (largest ${max} chars)`);
}
await sleep(300);
console.log(fail ? `FAIL (${fail})` : 'PASS');
process.exit(fail ? 1 : 0);
