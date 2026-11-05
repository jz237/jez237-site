// Difficulty ramp check: a HUMAN-LIKE autopilot (about 0.35 s reaction with scatter, sometimes late,
// aim wobble, the odd bad choice) plays each sector many times from its first wave with 3 Wardens and
// the upgrades a player would typically own by then. Reports the clear rate per sector, deaths and hits
// per wave try (the "edge": hits taken per wave, steadier than the clear rate), and what killed it.
//   node scripts/swarmbreak/ramp_check.mjs [trials=40] [sectors=1,2,3,4,5] [profile=human]
// Targets: about 95 / 80 / 60 / 40 / 25 % clears, and no wave noticeably harder than the next.
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=2';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=2';
import { SECTORS, TYPICAL_UP, WAVES } from '../../games/2026-11-05/swarmbreak/js/config.js?v=2';

const trials = +(process.argv[2] || 40);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((s) => +s - 1);
const profile = process.argv[4] || 'human';
const TARGET = [95, 80, 60, 40, 25];

export function runSector(s, seed, prof = profile, opts = {}) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s], ...opts });
  const ai = new Autopilot(seed * 7919 + 13, prof);
  const causes = {};
  let firstDeathT = null, firstHitT = null;
  const limit = 1500 / STEP;
  while (!W.over && W.n < limit) {
    const P = W.players[0];
    P.input = ai.control(W, P);
    step(W, STEP);
    for (const e of drainEvents(W)) {
      if (e.k === 'death') { causes[e.cause] = (causes[e.cause] || 0) + 1; if (firstDeathT === null) firstDeathT = W.t; }
      if ((e.k === 'death' || e.k === 'shield') && firstHitT === null) firstHitT = W.t;
    }
  }
  return { clear: W.result === 'clear', W, causes, firstDeathT, firstHitT, t: W.t };
}

if (process.argv[1] && process.argv[1].split('\\').join('/').endsWith('ramp_check.mjs')) {
  for (const s of sectors) {
    let clears = 0, time = 0, early = 0, rescued = 0, surv = 0, deaths = 0, lives = 0;
    const wD = {}, wT = {}, wH = {}, causes = {};
    for (let i = 0; i < trials; i++) {
      const r = runSector(s, 1000 + i * 17 + s * 7);
      if (r.clear) { clears++; time += r.t; }
      for (const [k, v] of Object.entries(r.W.stats.waveDeaths)) wD[k] = (wD[k] || 0) + v;
      for (const [k, v] of Object.entries(r.W.stats.waveTries)) wT[k] = (wT[k] || 0) + v;
      for (const [k, v] of Object.entries(r.W.stats.waveHits)) wH[k] = (wH[k] || 0) + v;
      for (const [k, v] of Object.entries(r.causes)) causes[k] = (causes[k] || 0) + v;
      if (s === 0 && r.firstDeathT !== null && r.firstDeathT < 30) early++;
      rescued += r.W.stats.rescued; surv += r.W.stats.surv; deaths += r.W.stats.deaths; lives += r.W.lives + r.W.stats.deaths - 3;
    }
    const pct = Math.round((100 * clears) / trials);
    const per = [];
    for (let k = 0; k <= WAVES; k++) {
      const tr = wT[k] || 0;
      per.push(`${k < WAVES ? 'W' + (k + 1) : 'BOSS'}:${tr ? ((wD[k] || 0) / tr).toFixed(2) : '-'}/${tr ? ((wH[k] || 0) / tr).toFixed(2) : '-'}`);
    }
    console.log(`S${s + 1} ${SECTORS[s].name.padEnd(16)} clear ${String(pct).padStart(3)}% (target ~${TARGET[s]}%)  avg ${clears ? Math.round(time / clears) : '-'} s  rescued ${Math.round((100 * rescued) / (surv || 1))}%  deaths/run ${(deaths / trials).toFixed(2)}  extra lives/run ${(lives / trials).toFixed(2)}` +
      `\n   deaths/hits per wave try ${per.join(' ')}\n   causes ${JSON.stringify(causes)}${s === 0 ? `  deaths<30s: ${early}` : ''}`);
  }
}
