// Difficulty ramp: a HUMAN-LIKE autopilot plays every sector from its first wave (with the upgrades a player
// typically has by then) and we count how often it clears the sector, plus where it dies and gets hit.
//   node scripts/skyhold/ramp_check.mjs [runs=30] [sectors=1,2,3,4,5] [profile=human] [diff=normal]
// Targets (Normal): about 95 / 80 / 60 / 40 / 25 % of runs clear sectors 1-5, no wave much harder than the next.
import { makeWorld, step, drainEvents, STEP, settlersLeft } from '../../games/2026-11-09/skyhold/js/sim.js?v=11';
import { Autopilot } from '../../games/2026-11-09/skyhold/js/ai.js?v=11';
import { TYPICAL_UP, START_LIVES, WAVES } from '../../games/2026-11-09/skyhold/js/config.js?v=11';

const runs = +(process.argv[2] || 30);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((n) => +n - 1);
const profile = process.argv[4] || 'human', diff = process.argv[5] || 'normal';
for (const s of sectors) {
  let clear = 0, T = 0, lost = 0, deaths = 0, hits = 0, bossT = 0, bossN = 0;
  const wd = [0, 0, 0, 0, 0], wh = [0, 0, 0, 0, 0], reach = [0, 0, 0, 0, 0, 0], cause = {};
  for (let i = 0; i < runs; i++) {
    const seed = 1000 + i * 37 + s * 7;
    const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s], lives: START_LIVES, diff, noTut: s > 0 });
    const ai = new Autopilot(seed, profile);
    while (!W.over && W.t < 900) { const p = W.players[0]; p.input = ai.control(W, p); step(W, STEP); drainEvents(W); }
    if (W.result === 'clear') { clear++; if (W.stats.bossT >= 0) { bossT += W.secT - W.stats.bossT; bossN++; } }
    reach[W.result === 'clear' ? 5 : W.wave]++;
    T += W.secT; lost += W.stats.lost; deaths += W.stats.deaths; hits += W.stats.deaths + W.stats.shieldHits;
    for (let w = 0; w <= WAVES; w++) { wd[w] += W.stats.waveDeaths[w]; wh[w] += W.stats.waveHits[w]; }
    for (const k in W.stats.cause) cause[k] = (cause[k] || 0) + W.stats.cause[k];
    void settlersLeft;
  }
  const f = (v) => (v / runs).toFixed(2);
  console.log(`S${s + 1} clear ${(100 * clear / runs).toFixed(0)}%  avg ${(T / runs).toFixed(0)} s  deaths/run ${f(deaths)}  hits/run ${f(hits)}  settlers lost/run ${f(lost)}  carrier fight ${bossN ? (bossT / bossN).toFixed(0) : '-'} s`);
  console.log(`   ended in wave 1-4/carrier/cleared: ${reach.join(' / ')}   deaths per wave ${wd.map(f).join(' ')}   hits per wave ${wh.map(f).join(' ')}`);
  console.log(`   causes ${JSON.stringify(cause)}`);
}
