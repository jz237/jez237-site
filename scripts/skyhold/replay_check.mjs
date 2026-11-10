// Replays are exact: for many seeds, play a world with the human-like autopilot until a death (or the carrier going
// down), cut the instant-replay clip the game would keep, replay it, and compare the world tick by tick.
//   node scripts/skyhold/replay_check.mjs [seeds=10]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-09/skyhold/js/sim.js?v=23';
import { Autopilot } from '../../games/2026-11-09/skyhold/js/ai.js?v=23';
import { TYPICAL_UP } from '../../games/2026-11-09/skyhold/js/config.js?v=23';
import { Recorder, Replay } from '../../games/2026-11-09/skyhold/js/replay.js?v=23';

const seeds = +(process.argv[2] || 10);
const hash = (W) => JSON.stringify([W.n, W.score, W.rs, W.players.map((p) => [p.x, p.y, p.alive, p.shield, p.nova]), W.enemies.map((e) => [e.id, e.x, e.y, e.hp, e.st]), W.settlers.map((s) => [s.st, s.x, s.y]), W.boss ? [W.boss.x, W.boss.y, W.boss.nodes.map((n) => n.hp).join()] : 0]);
let pass = 0, total = 0, ticks = 0;
for (let i = 0; i < seeds; i++) {
  for (const [s, cp, kind] of [[3, 2, 'death'], [0, 4, 'bosskill']]) {
    const seed = 300 + i * 13 + s;
    const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s], noTut: true, cp });
    const ai = new Autopilot(seed, kind === 'death' ? 'human' : 'demo'), rec = new Recorder();
    const live = new Map();
    let key = -1;
    while (!W.over && W.t < 400) {
      rec.tick(W);
      W.players[0].input = ai.control(W, W.players[0]);
      rec.input(W);
      step(W, STEP);
      live.set(W.n, hash(W));
      const ev = drainEvents(W);
      if (key < 0 && ev.some((e) => e.k === kind)) key = W.n;
      if (key >= 0 && W.n >= key + 1.6 / STEP) break;
    }
    if (key < 0) continue;
    total++;
    const c = rec.clip(key);
    const R = new Replay(structuredClone(c.snap), c.inputs, c.keyN, c.endN);
    let same = true, n = 0;
    while (!R.done) { R.advance(STEP); const h = live.get(R.W.n); if (h !== undefined) { n++; if (h !== hash(R.W)) { same = false; break; } } }
    ticks += n;
    if (same && n > 0) pass++; else console.log(`  seed ${seed} S${s + 1} ${kind}: replay diverged at tick ${R.W.n}`);
  }
}
console.log(`replays: ${pass} / ${total} bit-exact (${ticks} ticks compared)`);
console.log(pass === total && total > 0 ? 'PASS' : 'FAIL');
process.exit(pass === total && total > 0 ? 0 : 1);
