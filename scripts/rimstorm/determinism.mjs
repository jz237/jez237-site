// Determinism check: (1) the same seed and the same autopilot give bit-identical worlds, run twice, in
// every sector and in ENDLESS DESCENT; (2) a cloned world fed the same inputs stays identical; (3) every
// death and boss kill recorded with the Recorder replays bit for bit from its saved clip.
//   node scripts/rimstorm/determinism.mjs [seeds=6]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-06/rimstorm/js/sim.js?v=8';
import { Autopilot } from '../../games/2026-11-06/rimstorm/js/ai.js?v=8';
import { TYPICAL_UP, WEBS } from '../../games/2026-11-06/rimstorm/js/config.js?v=8';
import { Recorder, Replay } from '../../games/2026-11-06/rimstorm/js/replay.js?v=8';
import { hashW } from '../../games/2026-11-06/rimstorm/js/tests.js?v=8';

const seeds = +(process.argv[2] || 6);
let bad = 0;
// 1. same seed twice
const run = (o, prof, secs) => { const W = makeWorld(o); const ai = new Autopilot(o.seed * 3 + 1, prof); for (let i = 0; i < secs / STEP && !W.over; i++) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); } return hashW(W); };
let same = 0, total = 0;
for (let s = 0; s < 5; s++) for (const prof of ['human', 'demo']) {
  const o = { sector: s, seed: 11 + s, up: TYPICAL_UP[s] };
  total++;
  if (run(o, prof, 120) === run(o, prof, 120)) same++; else { bad++; console.log(`  S${s + 1} ${prof}: runs differ`); }
}
{ total++; const o = { mode: 'endless', seed: 5, lives: 20 }; if (run(o, 'demo', 300) === run(o, 'demo', 300)) same++; else { bad++; console.log('  endless: runs differ'); } }
console.log(`same seed twice: ${same} / ${total} identical`);
// 2. clone mid-run
{
  let ok = 0;
  for (let s = 0; s < 5; s++) {
    const W = makeWorld({ sector: s, seed: 70 + s, up: TYPICAL_UP[s], web: s % 2 ? WEBS : 0 });
    const ai = new Autopilot(s, 'demo');
    for (let i = 0; i < 25 / STEP; i++) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); }
    const C = cloneWorld(W), ins = [];
    for (let i = 0; i < 25 / STEP; i++) { W.players[0].input = ai.control(W, W.players[0]); ins.push({ ...W.players[0].input }); step(W, STEP); drainEvents(W); }
    for (const q of ins) { C.players[0].input = q; step(C, STEP); drainEvents(C); }
    if (hashW(W) === hashW(C)) ok++; else { bad++; console.log(`  S${s + 1}: clone diverged`); }
  }
  console.log(`clone + same inputs: ${ok} / 5 identical`);
}
// 3. replays of deaths and boss kills
{
  let ok = 0, n = 0;
  for (let seed = 1; seed <= seeds; seed++) {
    const s = (seed - 1) % 5;
    const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s], web: seed % 2 ? WEBS : 1 });
    const rec = new Recorder(), ai = new Autopilot(seed, seed % 2 ? 'demo' : 'human');
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
      n++;
      const rp = new Replay(cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
      let got = null;
      while (!rp.done) { const ev = rp.advance(STEP); if (rp.W.n === q.n && ev.some((e) => e.k === q.k)) got = hashW(rp.W); }
      if (got === q.h) ok++; else { bad++; console.log(`  seed ${seed} ${q.k} at ${q.n}: MISMATCH`); }
    }
  }
  console.log(`replays: ${ok} / ${n} bit-exact`);
  if (!n) { bad++; console.log('  no deaths or boss kills to replay'); }
}
console.log(bad ? `FAIL (${bad})` : 'OK');
process.exit(bad ? 1 : 0);
