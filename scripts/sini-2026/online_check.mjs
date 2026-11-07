// Online co-op check in Node against a LOCAL relay (a copy of the Steel Duel worker under wrangler dev): a host and
// a guest, each with its own world and the game's own online.js, run the same loop as main.js playStep in real time
// with autopilots flying both ships. Checks: pairing by room code (SN-XXXX), the start config, snapshot rate and
// size, the guest's world tracking the host's (checkpoint, score, lives, construct, the host's ship), the host
// tracking the guest's ship, the guest's crystals / charges counting on the host, the guest's death reaching the
// host and a clean leave.
//   node scripts/sini-2026/online_check.mjs [relay=ws://127.0.0.1:8781] [seconds=40] [lags=0,60]
// Never touches the real relay.
const base = 'file:///D:/Projects/Sinistar/games/2026-11-07/sini-2026/js/';
const SIM = await import(base + 'sim.js?v=1');
const { Autopilot } = await import(base + 'ai.js?v=1');
const CFG = await import(base + 'config.js?v=1');
const { Online, ROOM, randomCode } = await import(base + 'online.js?v=1');
const { makeWorld, step, drainEvents, STEP, wd, netDeath } = SIM;

const relay = process.argv[2] || 'ws://127.0.0.1:8781';
const secs = +(process.argv[3] || 40);
const lags = (process.argv[4] || '0,60').split(',').map(Number);
if (!/^wss?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(relay)) { console.log('refusing: the check only runs against a local relay'); process.exit(2); }
try { const r = await fetch(relay.replace(/^ws/, 'http') + '/health'); if (!r.ok) throw new Error(r.status); } catch (e) { console.log(`no relay at ${relay} (${e.message})`); process.exit(2); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; };
const until = async (fn, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (fn()) return true; await sleep(25); } return false; };

function side(name, lag) {
  const S = { name, joined: null, cfg: null, left: null, sizes: [], W: null, events: [] };
  S.net = new Online({ status: () => {}, joined: (p) => { S.joined = p; }, start: (cfg) => { S.cfg = cfg; }, left: (why) => { S.left = why; }, chat: () => {} }, { relay, lag });
  const raw = S.net.raw.bind(S.net);
  S.net.raw = (o) => { if (o.type === 'snapshot' || o.type === 'input') S.sizes.push(JSON.stringify(o).length); raw(o); };
  return S;
}
function start(S, cfg) {
  S.W = makeWorld({ mode: 'campaign', sector: cfg.sector, seed: cfg.seed, coop: true, up: { ...CFG.TYPICAL_UP[cfg.sector] }, lives: CFG.START_LIVES + 1, noTut: true, diff: cfg.diff, cp: cfg.cp || 0 });
  S.net.bind(S.W);
  S.ai = new Autopilot(cfg.seed + (S.net.host ? 0 : 1), 'demo');
  S.acc = 0;
}
// main.js playStep, minus the rendering
function frame(S, dt) {
  const W = S.W, net = S.net, host = net.host;
  if (!host) for (const e of net.guestSync(W)) S.events.push(e);
  S.acc += dt;
  let n = 0;
  while (S.acc >= STEP && n < 12) {
    const me = host ? W.players[0] : W.players[1];
    me.input = S.ai.control(W, me);
    if (host) net.hostTick(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (!host) ev = ev.filter((e) => e.pid === 2 && ['fire', 'bomb', 'shield', 'death', 'collect', 'empty', 'bump'].includes(e.k));
    if (host) net.hostEvents(ev);
    for (const e of ev) S.events.push(e);
    S.acc -= STEP; n++;
    if (W.over) break;
  }
  if (host) net.hostFrame(W, dt); else net.guestFrame(W, dt);
}

for (const lag of lags) {
  const label = `lag ${lag} ms`;
  const H = side('host', 0), Gs = side('guest', lag);
  const code = randomCode(4);
  H.net.connect(ROOM + code, 'host', { ini: 'HST' });
  await sleep(400);
  Gs.net.connect(ROOM + code, 'join', { ini: 'GST' });
  ok(await until(() => H.joined && Gs.joined), `${label}: both pilots see each other (${H.net.room})`);
  ok(H.net.role === 'p1' && Gs.net.role === 'p2', `${label}: host is p1, guest is p2`);
  const cfg = { gm: 'campaign', sector: 2, seed: 4100 + lag, diff: 'normal', cp: 1 };
  H.net.sendStart(cfg); start(H, cfg);
  ok(await until(() => Gs.cfg), `${label}: the guest receives the start`);
  if (!Gs.cfg) continue;
  start(Gs, Gs.cfg);
  const t0 = performance.now();
  let last = t0, samples = 0, cpOk = 0, scoreOk = 0, livesOk = 0, cOk = 0;
  const gpos = [], hpos = [];
  const snaps0 = Gs.net.stat.snaps;
  while (performance.now() - t0 < secs * 1000 && !H.W.over) {
    await sleep(16);
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    frame(H, dt); frame(Gs, dt);
    if (now - t0 > 3000 && Math.floor((now - t0) / 250) !== Math.floor((now - t0 - dt * 1000) / 250)) {
      samples++;
      const a = H.W, b = Gs.W;
      if (a.cp === b.cp) cpOk++;
      if (Math.abs(a.score - b.score) <= 2000) scoreOk++;
      if (a.lives === b.lives) livesOk++;
      if (a.C && b.C && a.C.st === b.C.st && Math.abs(a.C.pieces - b.C.pieces) <= 1 && Math.hypot(wd(a.C.x - b.C.x), wd(a.C.z - b.C.z)) < 3) cOk++;
      const hg = a.players[1], gg = b.players[1];
      if (hg.alive && gg.alive) gpos.push(Math.hypot(wd(hg.x - gg.x), wd(hg.z - gg.z)));
      const hh = a.players[0], gh = b.players[0];
      if (hh.alive && gh.alive) hpos.push(Math.hypot(wd(hh.x - gh.x), wd(hh.z - gh.z)));
    }
  }
  const dur = (performance.now() - t0) / 1000;
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 99; };
  const p90 = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length * 0.9)] : 99; };
  const rate = (Gs.net.stat.snaps - snaps0) / dur;
  const maxSnap = Math.max(0, ...H.sizes), maxIn = Math.max(0, ...Gs.sizes);
  console.log(`      ${label}: ${dur.toFixed(0)} s · rtt ${Math.round(Gs.net.rtt)} ms · construct ${H.W.C ? H.W.C.st + ' ' + H.W.C.pieces + '/' + H.W.C.N : 'gone'} · score ${H.W.score} · guest grabs ${H.net.stat.grabs}, guest charges ${H.net.stat.bombs}, guest shots ${H.net.stat.shots}`);
  ok(rate > 14 && rate < 24, `${label}: snapshots arrive at ${rate.toFixed(1)} Hz`);
  ok(maxSnap < 48000 && maxIn < 48000, `${label}: largest snapshot ${maxSnap} chars, largest input ${maxIn} (relay limit 48 000)`);
  ok(cpOk / samples > 0.9, `${label}: same checkpoint on both machines ${Math.round((100 * cpOk) / samples)} % of samples`);
  ok(scoreOk / samples > 0.9 && livesOk / samples > 0.9, `${label}: score within 2000 ${Math.round((100 * scoreOk) / samples)} %, lives equal ${Math.round((100 * livesOk) / samples)} %`);
  ok(cOk / samples > 0.85, `${label}: the construct matches (state, plates, position) ${Math.round((100 * cOk) / samples)} %`);
  const tol = 2 + lag / 30;
  ok(med(gpos) < tol && p90(gpos) < tol * 2.5, `${label}: the host sees the guest's ship within ${med(gpos).toFixed(2)} m median / ${p90(gpos).toFixed(2)} m p90`);
  ok(med(hpos) < tol && p90(hpos) < tol * 2.5, `${label}: the guest sees the host's ship within ${med(hpos).toFixed(2)} m median / ${p90(hpos).toFixed(2)} m p90`);
  ok(H.net.stat.shots > 20 && (H.net.stat.grabs > 0 || H.net.stat.bombs > 0), `${label}: the guest's shots, crystals and charges reach the host`);
  // the guest's ship is lost on its own machine: the host takes the life and brings it back
  {
    const me = Gs.W.players[1];
    let t = 0, sawDead = false, back = false;
    last = performance.now();
    if (!me.alive) await until(() => { const now = performance.now(); frame(H, (now - last) / 1000); frame(Gs, (now - last) / 1000); last = now; return me.alive; }, 8000);
    const lives0 = H.W.lives;
    me.inv = 0; me.shield = 0;
    Gs.W.claims.push({ died: 1, cause: 'bolt' }); me.alive = false; me.deadT = 0;
    while (t < 9000 && !back) {
      await sleep(16);
      const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt * 1000;
      frame(H, dt); frame(Gs, dt);
      if (!H.W.players[1].alive) sawDead = true;
      if (sawDead && H.W.players[1].alive && me.alive) back = true;
    }
    ok(sawDead && H.W.lives < lives0 + 1, `${label}: the guest's lost ship reaches the host (lives ${lives0} -> ${H.W.lives})`);
    ok(back, `${label}: the host brings the guest back and it flies again`);
  }
  Gs.net.close();
  ok(await until(() => H.left, 6000), `${label}: the host sees the guest leave (${H.left})`);
  H.net.close();
  void netDeath;
}
console.log(fail ? `${fail} FAILED` : 'all online checks passed');
process.exit(fail ? 1 : 0);
