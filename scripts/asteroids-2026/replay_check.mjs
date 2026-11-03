// Instant replays must reproduce the knockout exactly: run AI duels in every sector with the recorder,
// then re-run the last seconds from the nearest clone and compare the knockout tick, side and position.
import { makeWorld, step, drainEvents, STEP, shipOf } from '../../games/2026-03-09/asteroids-hd/2026/js/sim.js?v=4';
import { AIPilot } from '../../games/2026-03-09/asteroids-hd/2026/js/ai.js?v=4';
import { Recorder } from '../../games/2026-03-09/asteroids-hd/2026/js/replay.js?v=4';
import { PILOTS, PERKS, DIFFICULTY } from '../../games/2026-03-09/asteroids-hd/2026/js/config.js?v=4';

const keys = ['razor', 'lyra', 'grit', 'cipher'];
let ok = 0, bad = 0;
for (let arena = 0; arena < 5; arena++) {
  for (let m = 0; m < 2; m++) {
    const boss = arena === 4;
    const tw = m && !boss ? { twin: 1, hyper: 1 } : {};
    const up = m ? { 1: { hull: 3, cannon: 3, boost: 2, od: 2, shield: 2 } } : undefined;
    const W = makeWorld({ arena, seed: 77 + arena * 13 + m, boss, twists: tw, perks: { 1: PERKS[keys[m]] }, up });
    const ais = [new AIPilot(W, shipOf(W, 1), PILOTS[keys[(arena + m) % 4]], DIFFICULTY.normal.ai)];
    if (!boss) ais.push(new AIPilot(W, shipOf(W, -1), PILOTS[keys[(arena + m + 1) % 4]], DIFFICULTY.normal.ai));
    const REC = new Recorder();
    let ko = null;
    for (let i = 0; i < 120 * 300 && !ko; i++) {
      REC.tick(W);
      for (const ai of ais) ai.update(W, STEP);
      REC.input(W);
      const n = W.n;
      step(W, STEP);
      for (const e of drainEvents(W)) if (e.k === 'ko') ko = { n, side: e.side, x: e.x, z: e.z };
    }
    if (!ko) { console.log(arena, m, 'no KO'); continue; }
    const rp = REC.replay(ko.n + 1);
    let rko = null;
    while (!rp.done) for (const e of rp.advance(STEP * 4)) if (e.k === 'ko' && !rko) rko = { n: rp.W.n - 1, side: e.side, x: e.x, z: e.z };
    const same = rko && rko.side === ko.side && Math.abs(rko.x - ko.x) < 1e-9 && Math.abs(rko.z - ko.z) < 1e-9;
    if (same) ok++; else bad++;
    console.log(arena, m, same ? 'MATCH' : 'DIFF', JSON.stringify(ko), JSON.stringify(rko));
  }
}
console.log('replays exact:', ok, 'mismatched:', bad);
