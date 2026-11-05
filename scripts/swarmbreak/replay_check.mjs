// Exact replays: records autopilot runs and re-runs every death and boss kill from its saved clip;
// the world must match bit for bit at the key tick.
//   node scripts/swarmbreak/replay_check.mjs [seeds=10]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=5';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=5';
import { TYPICAL_UP } from '../../games/2026-11-05/swarmbreak/js/config.js?v=5';
import { Recorder, Replay } from '../../games/2026-11-05/swarmbreak/js/replay.js?v=5';
import { hashW } from '../../games/2026-11-05/swarmbreak/js/tests.js?v=5';

const seeds = +(process.argv[2] || 10);
let ok = 0, bad = 0, total = 0;
for (let seed = 1; seed <= seeds; seed++) {
  const s = 2 + ((seed - 1) % 3);
  const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s], wave: seed % 2 ? 3 : 0 });
  const rec = new Recorder(), ai = new Autopilot(seed, 'human');
  const keys = [];
  for (let i = 0; i < 600 / STEP && !W.over; i++) {
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
    if (got === q.h) ok++; else { bad++; console.log(`seed ${seed} ${q.k} at ${q.n}: MISMATCH`); }
  }
}
console.log(`replays: ${ok} / ${total} bit-exact${bad ? `, ${bad} differ` : ''}`);
process.exit(bad || !total ? 1 : 0);
