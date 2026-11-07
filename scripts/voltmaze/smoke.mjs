// Sim smoke test: the autopilot plays every sector from its arrival lift through the boss (fresh
// worlds per sector, typical upgrades, plenty of lives) and must ride every boss lift without errors.
//   node scripts/voltmaze/smoke.mjs [profile=demo] [seeds=2] [diff=normal] [lives=12]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-06/voltmaze/js/sim.js?v=5';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=5';
import { TYPICAL_UP, SECTORS, VERSION, START_LIVES, UPGRADES, UP_COST, SALVAGE } from '../../games/2026-11-06/voltmaze/js/config.js?v=5';
import { invariants } from '../../games/2026-11-06/voltmaze/js/tests.js?v=5';

const profile = process.argv[2] || 'demo', seeds = +(process.argv[3] || 2), diff = process.argv[4] || 'normal', lives = +(process.argv[5] || 12);
const MAX_T = 900;
let fails = 0;
console.log(`Voltmaze ${VERSION} smoke · ${profile} · ${diff} · ${lives} lives`);
for (let s = 0; s < 5; s++) {
  for (let seed = 1; seed <= seeds; seed++) {
    const W = makeWorld({ sector: s, seed: seed * 101 + s, up: TYPICAL_UP[s], lives, diff, noTut: true });
    const ai = new Autopilot(seed, profile);
    const ev = {};
    let rooms = 1, bossT = 0, err = null;
    try {
      for (let i = 0; i < MAX_T / STEP && !W.over; i++) {
        W.players[0].input = ai.control(W, W.players[0]);
        step(W, STEP);
        for (const e of drainEvents(W)) { ev[e.k] = (ev[e.k] || 0) + 1; if (e.k === 'roomenter') rooms++; }
        if (W.n % 60 === 0) { const bad = invariants(W); if (bad.length) throw new Error('invariant: ' + bad.join(', ')); }
        if (W.boss) bossT += STEP;
      }
    } catch (e) { err = e; }
    const ok = !err && W.result === 'clear';
    if (!ok) fails++;
    const cause = Object.entries(W.stats.cause).map(([k, v]) => `${k}:${v}`).join(' ');
    console.log(`S${s + 1} ${SECTORS[s].name.padEnd(15)} seed ${String(seed).padStart(2)}  ${ok ? 'CLEAR' : err ? 'ERROR' : (W.result || 'TIMEOUT')}  t ${W.t.toFixed(0).padStart(4)}s  rooms ${String(rooms - 1).padStart(2)}  deaths ${String(W.stats.deaths).padStart(2)} (${cause})  kills ${W.stats.kills} lured ${W.stats.lured}  cleared ${W.stats.cleared}  boss ${bossT.toFixed(0)}s  score ${W.score}`);
    if (err) console.log(err.stack);
  }
}
// one chained campaign, start to finish: score and lives carry over, salvage buys upgrades between sectors
{
  const SHOP = ['weapon', 'plate', 'dash', 'weapon', 'emp', 'jammer', 'plate', 'weapon', 'dash', 'emp', 'jammer'];
  let score = 0, lives = START_LIVES + 2, up = {}, salvage = 0, t = 0, deaths = 0, tries = 0, stuck = false;
  const seed0 = 31337;
  for (let s = 0; s < 5; s++) {
    let W;
    for (;;) {
      tries++;
      W = makeWorld({ sector: s, seed: seed0 + s * 13 + tries, up, lives, score, noTut: true });
      const ai = new Autopilot(seed0 + s, profile);
      for (let i = 0; i < MAX_T / STEP && !W.over; i++) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); drainEvents(W); }
      t += W.t; deaths += W.stats.deaths;
      if (W.result === 'clear' || tries > 12) break;
    }
    if (W.result !== 'clear') { console.log(`CHAINED CAMPAIGN stuck in sector ${s + 1}`); fails++; stuck = true; break; }
    salvage += Math.floor((W.score - score) / SALVAGE); score = W.score; lives = W.lives + 1;
    for (const k of SHOP) { const lv = up[k] || 0; if (lv < UPGRADES[k].max && salvage >= UP_COST[lv]) { salvage -= UP_COST[lv]; up = { ...up, [k]: lv + 1 }; } }
    console.log(`  chained: S${s + 1} clear · score ${score} · lives ${lives} · upgrades ${JSON.stringify(up)}`);
  }
  console.log(`CHAINED CAMPAIGN ${stuck ? 'FAILED' : 'COMPLETE'}: ${(t / 60).toFixed(1)} min of play, ${deaths} lives lost, ${tries - 5} retries`);
}
console.log(fails ? `${fails} run(s) did not clear` : 'all sectors cleared');
process.exit(fails ? 1 : 0);
