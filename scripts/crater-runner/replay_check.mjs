// Replays are exact: drive each sector with the human-like autopilot while recording, and for every
// crash and boss kill re-run the clip from its saved snapshot + inputs and compare the world state at
// that tick, bit for bit.   node scripts/crater-runner/replay_check.mjs [seedsPerSector=6]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-04/crater-runner/js/sim.js?v=1';
import { Autopilot } from '../../games/2026-11-04/crater-runner/js/ai.js?v=1';
import { TYPICAL_UP } from '../../games/2026-11-04/crater-runner/js/config.js?v=1';
import { Recorder, Replay } from '../../games/2026-11-04/crater-runner/js/replay.js?v=1';

const seeds = +(process.argv[2] || 6);
const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.seg, W.rs, W.rovers, W.craters, W.rocks, W.mines, W.tanks, W.shells, W.flyers, W.bombs, W.drones, W.shots, W.boss]);
let checked = 0, exact = 0;
const fails = [];
for (let s = 0; s < 5; s++) for (let i = 0; i < seeds; i++) {
  const seed = 70 + s * 100 + i;
  const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s] });
  const ai = new Autopilot(seed, 'human'), rec = new Recorder();
  const keys = []; // pending key moments: { n, hash, kind }
  const clips = [];
  while (!W.over && W.t < 900) {
    rec.tick(W);
    const R = W.rovers[0];
    R.input = ai.control(W, R);
    rec.input(W);
    step(W, STEP);
    for (const e of drainEvents(W)) if (e.k === 'crash' || e.k === 'bosskill') keys.push({ n: W.n, hash: hashW(W), kind: e.k });
    for (const k of keys) if (!k.done && W.n >= k.n + Math.round(1.4 / STEP)) { k.done = true; const c = rec.clip(k.n); if (c) clips.push({ c, k }); }
  }
  for (const { c, k } of clips) {
    const rp = new Replay(cloneWorld(c.snap), c.inputs, c.keyN, c.endN);
    let got = null;
    while (!rp.done) { rp.advance(STEP); if (rp.W.n === k.n && got === null) got = hashW(rp.W); }
    checked++;
    if (got === k.hash) exact++; else fails.push(`S${s + 1} seed ${seed} ${k.kind} @${k.n}`);
  }
}
console.log(`replays checked: ${checked}, bit-exact: ${exact}${fails.length ? '\nFAILED: ' + fails.join(', ') : ''}`);
process.exit(fails.length ? 1 : 0);
