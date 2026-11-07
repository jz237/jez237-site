// Determinism: the same seed and inputs give the same world bit for bit (several sectors, the endless
// mode and co-op), a cloned world runs on exactly like the original, and every death / boss kill
// re-runs exactly from its instant-replay clip. Also runs the self-test page's sim checks (RAMP
// monotonic, difficulty levels, room reachability, every boss beatable).
//   node scripts/voltmaze/determinism_check.mjs [seeds=4]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-06/voltmaze/js/sim.js?v=6';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=6';
import { TYPICAL_UP } from '../../games/2026-11-06/voltmaze/js/config.js?v=6';
import { Recorder, Replay } from '../../games/2026-11-06/voltmaze/js/replay.js?v=6';
import { hashW, simChecks } from '../../games/2026-11-06/voltmaze/js/tests.js?v=6';

const seeds = +(process.argv[2] || 4);
let fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };

// 1. same seed, same autopilot: identical worlds
for (const cfg of [{ sector: 0 }, { sector: 2 }, { sector: 4 }, { mode: 'endless' }, { sector: 1, coop: true }]) {
  const run = () => {
    const W = makeWorld({ ...cfg, seed: 4242, up: TYPICAL_UP[cfg.sector || 0], noTut: true, lives: 6 });
    const ais = W.players.map((p, i) => new Autopilot(9 + i, 'human'));
    for (let i = 0; i < 90 / STEP && !W.over; i++) { W.players.forEach((p, k) => { p.input = ais[k].control(W, p); }); step(W, STEP); drainEvents(W); }
    return hashW(W);
  };
  const a = run(), b = run();
  ok(a === b, `same seed twice is bit exact (${JSON.stringify(cfg)})`);
}
// 2. replays
let total = 0, exact = 0;
for (let seed = 1; seed <= seeds; seed++) {
  const s = (seed - 1) % 5;
  const W = makeWorld({ sector: s, seed: 700 + seed, up: TYPICAL_UP[s], noTut: true, room: seed % 2 ? 0 : 3 });
  const rec = new Recorder(), ai = new Autopilot(seed, 'human');
  const keys = [];
  for (let i = 0; i < 400 / STEP && !W.over; i++) {
    rec.tick(W);
    W.players[0].input = ai.control(W, W.players[0]);
    rec.input(W);
    step(W, STEP);
    for (const e of drainEvents(W)) if (e.k === 'death' || e.k === 'bosskill') keys.push({ n: W.n, k: e.k, h: hashW(W) });
    for (const q of keys) if (!q.clip && W.n >= q.n + Math.round(1.6 / STEP)) q.clip = rec.clip(q.n);
  }
  for (const q of keys) {
    if (!q.clip) continue;
    total++;
    const rp = new Replay(cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
    let got = null;
    while (!rp.done) { const ev = rp.advance(STEP); if (rp.W.n === q.n && ev.some((e) => e.k === q.k)) got = hashW(rp.W); }
    if (got === q.h) exact++; else console.log(`   seed ${seed} ${q.k} at tick ${q.n}: replay differs`);
  }
}
ok(total > 0 && exact === total, `instant replays: ${exact} / ${total} deaths and boss kills bit exact`);
// 3. the self-test page's sim checks
for (const r of simChecks()) ok(r.ok, `${r.name} (${r.info})`);
console.log(fails ? `${fails} check(s) failed` : 'all determinism and sim checks passed');
process.exit(fails ? 1 : 0);
