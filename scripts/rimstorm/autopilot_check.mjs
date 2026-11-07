// Chained campaigns, the way the game chains them: score and Rimrunners carry over (+1 Rimrunner per cleared
// sector, as NEXT SECTOR does), salvage (salvageFor: sector score / 30, no medals counted) buys upgrades in the
// AI_SHOP order between sectors. Two kinds of run per profile:
//   campaign     a player's run: 3 Rimrunners, no retries; reports how far it gets and the final score
//   playthrough  the AI PLAYTHROUGH: 5 Rimrunners, a lost sector is retried from its first web (up to 6 tries)
// for the sharp 'demo' autopilot (attract mode, AI PLAYTHROUGH) and the 'human' one (ramp_check.mjs).
//   node scripts/rimstorm/autopilot_check.mjs [runs=12] [difficulty=normal]
// Exit 1 when the demo autopilot's PLAYTHROUGH fails to finish all five sectors in any run.
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-06/rimstorm/js/sim.js?v=8';
import { Autopilot } from '../../games/2026-11-06/rimstorm/js/ai.js?v=8';
import { SECTORS, START_LIVES, UPGRADES, UP_COST, AI_SHOP, salvageFor, DIFFICULTY } from '../../games/2026-11-06/rimstorm/js/config.js?v=8';

const runs = +(process.argv[2] || 12);
const diff = process.argv[3] || 'normal';
const t0 = Date.now();

function playSector(s, seed, prof, up, lives, score) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up, lives, score, diff, noTut: true });
  const ai = new Autopilot(seed * 31 + 7, prof);
  while (!W.over && W.t < 1500) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); }
  return W;
}
function shop(up, salvage) {
  for (const k of AI_SHOP) { const lv = up[k] || 0; if (lv < UPGRADES[k].max && salvage >= UP_COST[lv]) { salvage -= UP_COST[lv]; up[k] = lv + 1; } }
  return salvage;
}
function chain(prof, r, retries) {
  let lives = START_LIVES + DIFFICULTY[diff].lives + (retries ? 2 : 0), score = 0, salvage = 0, tries = 0, minutes = 0;
  const up = {};
  let s = 0;
  for (; s < SECTORS.length; s++) {
    let W, n = 0;
    for (;;) {
      W = playSector(s, 77 + r * 131 + s * 17 + n * 1009, prof, { ...up }, lives, score);
      minutes += W.t / 60;
      if (W.result === 'clear' || !retries || n >= 5) break;
      n++; tries++;
    }
    if (W.result !== 'clear') return { reached: s, score: W.score, tries, minutes, up };
    salvage = shop(up, salvage + salvageFor(W.score - score, 0));
    score = W.score; lives = W.lives + 1;
  }
  return { reached: s, score, tries, minutes, up };
}

let bad = 0;
for (const prof of ['demo', 'human']) {
  for (const mode of ['campaign', 'playthrough']) {
    const out = [];
    for (let r = 0; r < runs; r++) out.push(chain(prof, r, mode === 'playthrough'));
    const all = out.filter((o) => o.reached === SECTORS.length).length;
    const hist = SECTORS.map((_, i) => out.filter((o) => o.reached === i).length);
    const avg = (f) => out.reduce((a, o) => a + f(o), 0) / out.length;
    console.log(`${prof.padEnd(5)} ${mode.padEnd(11)} all five: ${String(all).padStart(2)}/${runs}  ended in S1..S5: ${hist.join(' ')}  avg score ${Math.round(avg((o) => o.score)).toLocaleString()}` +
      `${mode === 'playthrough' ? `  retries ${avg((o) => o.tries).toFixed(1)}` : ''}  avg ${avg((o) => o.minutes).toFixed(1)} sim min  upgrades at the end e.g. ${JSON.stringify(out[0].up)}`);
    if (prof === 'demo' && mode === 'playthrough' && all < runs) bad++;
  }
}
console.log(`${bad ? 'FAIL: the AI PLAYTHROUGH did not always finish' : 'OK: the AI PLAYTHROUGH finishes every run'} (${diff}, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
process.exit(bad ? 1 : 0);
