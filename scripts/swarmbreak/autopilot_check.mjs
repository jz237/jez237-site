// Chained campaigns: lives and score carry over, salvage buys upgrades in the AI shop order, for the
// demo and human profiles. Shows how far each gets.
//   node scripts/swarmbreak/autopilot_check.mjs [runs=6]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=7';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=7';
import { SECTORS, START_LIVES, UPGRADES, UP_COST } from '../../games/2026-11-05/swarmbreak/js/config.js?v=7';

const runs = +(process.argv[2] || 6);
const SHOP = ['rapid', 'armor', 'spread', 'pulse', 'rapid', 'servos', 'spread', 'armor', 'tractor', 'rapid', 'pulse', 'servos'];
for (const prof of ['demo', 'human']) {
  const reached = [];
  for (let r = 0; r < runs; r++) {
    let lives = START_LIVES, score = 0, salvage = 0;
    const up = {};
    let s = 0;
    for (; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 77 + r * 13 + s, up, lives, score });
      const ai = new Autopilot(5 + r * 7 + s, prof);
      while (!W.over && W.t < 1500) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); }
      if (W.result !== 'clear') break;
      salvage += Math.floor((W.score - score) / 10); score = W.score; lives = W.lives + 1;
      for (const k of SHOP) { const lv = up[k] || 0; if (lv < UPGRADES[k].max && salvage >= UP_COST[lv]) { salvage -= UP_COST[lv]; up[k] = lv + 1; } }
    }
    reached.push(s === 5 ? 'ALL' : `S${s + 1}`);
  }
  console.log(`${prof.padEnd(6)} campaigns: ${reached.join(' ')}  (ALL = cleared all ${SECTORS.length} sectors)`);
}
