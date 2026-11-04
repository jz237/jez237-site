// Campaign build-up check: a fixed stand-in pilot (Lyra, normal) duels each sector's rival with and
// without the RAMP; the stand-in should win often in sector 1 and less each sector after.
// edge = hull the rival loses per hull the stand-in loses (steadier than wins). Also prints the Belt Run
// wave curve. usage: node ramp_check.mjs [matches per sector] [ramp|base|both] [sectors e.g. 12]
import { makeWorld, step, drainEvents, STEP, shipOf } from '../../games/2026-03-09/asteroids-hd/2026/js/sim.js?v=6';
import { AIPilot } from '../../games/2026-03-09/asteroids-hd/2026/js/ai.js?v=6';
import { PILOTS, LADDER, DIFFICULTY, RAMP, rampAI, beltRocks, beltSpeed } from '../../games/2026-03-09/asteroids-hd/2026/js/config.js?v=6';

const N = +process.argv[2] || 12, only = process.argv[3] || 'both', sectors = (process.argv[4] || '1234').split('').map((c) => +c - 1);
const rows = [];
for (const stage of sectors) {
  for (const ramp of only === 'both' ? [false, true] : [only === 'ramp']) {
    let wins = 0, taken = 0, dealt = 0, time = 0;
    for (let m = 0; m < N; m++) {
      const W = makeWorld({ arena: stage, seed: 500 + m * 31 + stage, rockK: ramp ? RAMP[stage].rocks : 1 });
      const diff = ramp ? rampAI(DIFFICULTY.normal.ai, stage) : DIFFICULTY.normal.ai;
      const me = new AIPilot(W, shipOf(W, 1), PILOTS.lyra, DIFFICULTY.normal.ai);
      const foe = new AIPilot(W, shipOf(W, -1), PILOTS[LADDER[stage]], diff);
      while (!W.over && W.t < 180) {
        me.update(W, STEP); foe.update(W, STEP);
        step(W, STEP);
        for (const e of drainEvents(W)) if (e.k === 'hit') { if (e.side === 1) taken += e.dmg; else dealt += e.dmg; }
      }
      if (W.winner === 1) wins++;
      time += W.t;
    }
    rows.push({ sector: stage + 1, rival: LADDER[stage], ramp, standInWins: `${Math.round((wins / N) * 100)}%`, edge: +(dealt / (taken || 1)).toFixed(2), hullLostPerMin: +((taken / time) * 60).toFixed(2), avgT: Math.round(time / N) });
  }
}
console.table(rows);
console.table([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((w) => ({ wave: w, rocks: beltRocks(w), speed: +beltSpeed(w).toFixed(2), before: `${Math.min(12, 3 + w)} @ ${Math.min(2, 1.1 + 0.06 * (w - 1)).toFixed(2)}` })));
