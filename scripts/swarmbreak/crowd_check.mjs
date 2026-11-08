// How crowded is the arena? For each sector, plays waves with the human-like autopilot and reports
// the average and peak number of machines alive per wave (pylons and darts not counted).
//   node scripts/swarmbreak/crowd_check.mjs [trials=6] [difficulty=normal]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=12';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=12';
import { TYPICAL_UP, WAVES } from '../../games/2026-11-05/swarmbreak/js/config.js?v=12';
const trials = +(process.argv[2] || 6), diff = process.argv[3] || 'normal';
for (let s = 0; s < 5; s++) {
  const row = [];
  for (let w = 0; w < WAVES; w++) {
    let sum = 0, n = 0, peak = 0, dur = 0;
    for (let i = 0; i < trials; i++) {
      const W = makeWorld({ mode: 'campaign', sector: s, wave: w, seed: 500 + i * 31 + s * 7 + w, up: TYPICAL_UP[s], diff, lives: 99 });
      const ai = new Autopilot(i * 13 + 1, 'human');
      const w0 = W.wave; let t = 0;
      while (!W.over && W.wave === w0 && W.n < 300 / STEP) {
        W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W);
        if (W.phase !== 'fight') continue;
        const c = W.enemies.filter((e) => !e.dead && e.type !== 'pylon' && e.type !== 'dart').length;
        sum += c; n++; peak = Math.max(peak, c); t += STEP;
      }
      dur += t;
    }
    row.push(`W${w + 1} avg ${(sum / (n || 1)).toFixed(1)} peak ${Math.round(peak)} ${Math.round(dur / trials)}s`);
  }
  console.log(`S${s + 1}  ${row.join(' | ')}`);
}
