// Can the autopilot get through the whole campaign the way a player would? Chained runs from sector 1
// with the real rules: lives carry over (+1 per sector), salvage is earned from score and spent on
// upgrades between sectors, a game over ends the run. Reports how far each profile gets.
//   node scripts/crater-runner/autopilot_check.mjs [runs=20]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-04/crater-runner/js/sim.js?v=1';
import { Autopilot } from '../../games/2026-11-04/crater-runner/js/ai.js?v=1';
import { SECTORS, START_LIVES, UPGRADES, UP_COST } from '../../games/2026-11-04/crater-runner/js/config.js?v=1';

const runs = +(process.argv[2] || 20);
// a sensible shopping order: guns first, then springs and shields
const ORDER = ['cannon', 'shield', 'flak', 'springs', 'cannon', 'radar', 'shield', 'cannon', 'flak', 'springs'];
function shop(run) {
  for (const k of ORDER) {
    const lv = run.up[k] || 0;
    if (lv >= UPGRADES[k].max) continue;
    if (run.salvage >= UP_COST[lv]) { run.salvage -= UP_COST[lv]; run.up[k] = lv + 1; }
  }
}
function campaign(seed, prof) {
  const run = { score: 0, lives: START_LIVES, up: {}, salvage: 0 };
  const ai = new Autopilot(seed, prof);
  for (let s = 0; s < SECTORS.length; s++) {
    const W = makeWorld({ sector: s, seed: seed * 10 + s, up: run.up, lives: run.lives, score: run.score });
    const score0 = run.score;
    while (!W.over && W.t < 1500) { const R = W.rovers[0]; R.input = ai.control(W, R); step(W, STEP); drainEvents(W); }
    if (W.result !== 'clear') return { reached: s, score: W.score, up: run.up };
    run.score = W.score; run.lives = W.lives + 1; run.salvage += Math.floor((W.score - score0) / 10);
    shop(run);
  }
  return { reached: SECTORS.length, score: run.score, up: run.up, done: true };
}
for (const prof of ['demo', 'human']) {
  const hist = [0, 0, 0, 0, 0, 0];
  let best = 0;
  for (let i = 0; i < runs; i++) { const r = campaign(500 + i, prof); hist[r.reached]++; best = Math.max(best, r.score); }
  const reached3 = hist.slice(2).reduce((a, b) => a + b, 0);
  console.log(`${prof.padEnd(6)} furthest sector reached (0 = died in S1 ... 5 = all cleared): ${hist.map((n, i) => `${i}:${n}`).join(' ')}  ` +
    `reached S3+: ${Math.round((100 * reached3) / runs)}%  finished: ${Math.round((100 * hist[5]) / runs)}%  best score ${best}`);
}
