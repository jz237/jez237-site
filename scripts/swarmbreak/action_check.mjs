// How much action is there? For each sector, plays the waves with the human-like autopilot and reports
// the seconds per wave, kills per minute of play, machines alive, the share of play time spent waiting
// (wave intros and clears) and how long after a wave starts the first machine is within 6 m.
//   node scripts/swarmbreak/action_check.mjs [trials=4] [difficulty=normal]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=13';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=13';
import { TYPICAL_UP, WAVES } from '../../games/2026-11-05/swarmbreak/js/config.js?v=13';
const trials = +(process.argv[2] || 4), diff = process.argv[3] || 'normal';
for (let s = 0; s < 5; s++) {
  let fight = 0, wait = 0, kills = 0, alive = 0, n = 0, waves = 0, contact = 0, cn = 0;
  for (let i = 0; i < trials; i++) {
    for (let w = 0; w < WAVES; w++) {
      const W = makeWorld({ mode: 'campaign', sector: s, wave: w, seed: 700 + i * 31 + s * 7 + w, up: TYPICAL_UP[s], diff, lives: 99 });
      const ai = new Autopilot(i * 13 + 5, 'human');
      const w0 = W.wave; let ct = -1, ft = 0;
      while (!W.over && W.wave === w0 && W.n < 300 / STEP) {
        const P = W.players[0];
        P.input = ai.control(W, P); step(W, STEP);
        for (const e of drainEvents(W)) if (e.k === 'kill') kills++;
        if (W.phase !== 'fight') { wait += STEP; continue; }
        fight += STEP; ft += STEP;
        const L = W.enemies.filter((e) => e.hp > 0 && e.type !== 'pylon' && e.type !== 'dart' && !e.hidden);
        alive += L.length; n++;
        if (ct < 0 && P.alive && L.some((e) => Math.hypot(e.x - P.x, e.z - P.z) < 6)) ct = ft;
      }
      waves++; if (ct >= 0) { contact += ct; cn++; }
    }
  }
  console.log(`S${s + 1}  wave ${(fight / waves).toFixed(1)} s  kills/min ${Math.round(kills / (fight / 60))}  alive ${(alive / n).toFixed(1)}  waiting ${Math.round((100 * wait) / (wait + fight))}%  first contact ${(contact / (cn || 1)).toFixed(1)} s`);
}
