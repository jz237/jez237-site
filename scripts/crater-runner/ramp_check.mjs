// Difficulty ramp check: a HUMAN-LIKE autopilot (about 0.35 s reaction, random timing, sometimes late)
// drives each sector many times from its start with the usual lives and the upgrades a player would
// typically own by then. Reports the clear rate per sector and the death rate per checkpoint segment.
//   node scripts/crater-runner/ramp_check.mjs [trials=40] [sectors=1,2,3,4,5] [profile=human]
// Targets: about 95 / 80 / 60 / 40 / 25 % clears, and no checkpoint noticeably harder than the next.
import { makeWorld, step, drainEvents, STEP, cpLetter } from '../../games/2026-11-04/crater-runner/js/sim.js?v=2';
import { Autopilot } from '../../games/2026-11-04/crater-runner/js/ai.js?v=2';
import { SECTORS, TYPICAL_UP, rampAt } from '../../games/2026-11-04/crater-runner/js/config.js?v=2';

const trials = +(process.argv[2] || 40);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((s) => +s - 1);
const profile = process.argv[4] || 'human';
const TARGET = [95, 80, 60, 40, 25];

export function runSector(s, seed, prof = profile, opts = {}) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s], ...opts });
  const ai = new Autopilot(seed * 7919 + 13, prof);
  const causes = {};
  let firstDeathT = null;
  const limit = 1500 / STEP;
  while (!W.over && W.n < limit) {
    const R = W.rovers[0];
    R.input = ai.control(W, R);
    step(W, STEP);
    for (const e of drainEvents(W)) {
      if (e.k === 'crash') { causes[e.cause] = (causes[e.cause] || 0) + 1; if (firstDeathT === null) firstDeathT = W.t; }
    }
  }
  return { clear: W.result === 'clear', W, causes, firstDeathT, t: W.t };
}

if (process.argv[1] && process.argv[1].split('\\').join('/').endsWith('ramp_check.mjs')) {
  const rows = [];
  for (const s of sectors) {
    let clears = 0, time = 0;
    const cpD = {}, cpT = {}, causes = {};
    let earlyDeaths = 0;
    for (let i = 0; i < trials; i++) {
      const r = runSector(s, 1000 + i * 17 + s * 7);
      if (r.clear) { clears++; time += r.t; }
      for (const [k, v] of Object.entries(r.W.stats.cpDeaths)) cpD[k] = (cpD[k] || 0) + v;
      for (const [k, v] of Object.entries(r.W.stats.cpTries)) cpT[k] = (cpT[k] || 0) + v;
      for (const [k, v] of Object.entries(r.causes)) causes[k] = (causes[k] || 0) + v;
      if (s === 0 && r.firstDeathT !== null && r.firstDeathT < 30) earlyDeaths++;
    }
    const pct = Math.round((100 * clears) / trials);
    const W0 = makeWorld({ mode: 'campaign', sector: s, seed: 1 });
    const segs = SECTORS[s].cps.length + 1;
    const per = [];
    for (let k = 0; k < segs; k++) {
      const tries = cpT[k] || 0, d = cpD[k] || 0;
      per.push(`${k < segs - 1 ? cpLetter(W0, k + 1) : 'BOSS'}:${tries ? (d / tries).toFixed(2) : '-'}`);
    }
    const R0 = rampAt(s, 0);
    rows.push({ s: s + 1, pct, target: TARGET[s], avgClear: clears ? Math.round(time / clears) : 0, per, causes, earlyDeaths, speed: R0.speed });
    console.log(`S${s + 1} ${SECTORS[s].name.padEnd(20)} clear ${String(pct).padStart(3)}% (target ~${TARGET[s]}%)  avg clear ${clears ? Math.round(time / clears) : '-'} s` +
      `  deaths/try per segment ${per.join(' ')}  causes ${JSON.stringify(causes)}${s === 0 ? `  deaths<30s: ${earlyDeaths}` : ''}`);
  }
}
