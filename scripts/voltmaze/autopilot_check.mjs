// Chained campaigns the way the AI PLAYTHROUGH runs them (main.js startPlaythrough / playthroughNext / aiShop):
// score carries over, lives carry over (+1 at each lift), salvage = sector points / SALVAGE (25) buys upgrades in the
// AI shop order, and a sector that ends in game over is retried with fresh lives. For the demo autopilot
// (the one the playthrough uses) and the human-like one. Fails if the demo autopilot can't finish.
//   node scripts/voltmaze/autopilot_check.mjs [runs=3] [maxTries=3]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-06/voltmaze/js/sim.js?v=7';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=7';
import { SECTORS, START_LIVES, UPGRADES, UP_COST, SALVAGE } from '../../games/2026-11-06/voltmaze/js/config.js?v=7';

const runs = +(process.argv[2] || 3), maxTries = +(process.argv[3] || 3);
// keep in step with AI_SHOP in js/main.js
const SHOP = ['weapon', 'plate', 'dash', 'weapon', 'emp', 'jammer', 'plate', 'weapon', 'dash', 'emp', 'jammer'];
let fails = 0;
for (const prof of ['demo', 'human']) {
  const out = [];
  for (let r = 0; r < runs; r++) {
    let lives = START_LIVES + 2, score = 0, salvage = 0, tries = 0, simT = 0;
    const up = {}, bought = [];
    let s = 0;
    for (; s < SECTORS.length; s++) {
      let W = null;
      for (let t = 0; t <= maxTries; t++) {
        W = makeWorld({ mode: 'campaign', sector: s, seed: 77 + r * 13 + s * 5 + t * 1000, up, lives, score, demo: true, noGrace: true });
        const ai = new Autopilot(5 + r * 7 + s + t * 31, prof);
        while (!W.over && W.t < 1500) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); }
        simT += W.t;
        if (W.result === 'clear') break;
        tries++; lives = START_LIVES + 2;    // the playthrough retries with fresh lives, score back to the sector start
      }
      if (W.result !== 'clear') break;
      salvage += Math.floor((W.score - score) / SALVAGE); score = W.score; lives = W.lives + 1;
      if (s < SECTORS.length - 1) for (const k of SHOP) { const lv = up[k] || 0; if (lv < UPGRADES[k].max && salvage >= UP_COST[lv]) { salvage -= UP_COST[lv]; up[k] = lv + 1; bought.push(k + (lv + 1)); } }
    }
    out.push({ done: s === SECTORS.length, reached: s, tries, score, simT, bought });
    console.log(`${prof.padEnd(6)} run ${r + 1}: ${s === SECTORS.length ? 'ALL FIVE SECTORS' : 'stopped in S' + (s + 1)} · ${tries} retries · score ${score.toLocaleString()} · ${(simT / 60).toFixed(1)} min · bought ${bought.join(' ') || 'nothing'}`);
  }
  if (prof === 'demo' && out.some((o) => !o.done)) { console.log('FAIL  the AI playthrough autopilot did not finish a campaign within the retries'); fails++; }
}
console.log(fails ? 'autopilot check FAILED' : 'autopilot check passed');
process.exit(fails ? 1 : 0);
