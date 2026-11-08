// How hard do the machines press the Warden? Compares the machines' tactics at RAMP smart = 0 (plain chasing, the
// pre-1.7 behaviour) with the current RAMP values, with the human-like autopilot flying, first 60 s of each sector.
//   node scripts/swarmbreak/aggro_check.mjs [runs=12] [sectors=1,2,3,4,5]
// Per sector: hostiles within 4 m of the Warden (average count), the share of crawlers closing in (moving toward the
// Warden at > 40 % of their speed), distinct sides the close machines come from (of 8 sectors round the Warden),
// spitter bolts that pass within 0.8 m of the Warden, and hits taken per minute.
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-05/swarmbreak/js/sim.js?v=12';
import { Autopilot } from '../../games/2026-11-05/swarmbreak/js/ai.js?v=12';
import { TYPICAL_UP } from '../../games/2026-11-05/swarmbreak/js/config.js?v=12';

const runs = +(process.argv[2] || 12);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((n) => +n - 1);
const HOST = new Set(['crawler', 'brute', 'spitter', 'dart', 'splitter', 'shard', 'bulwark', 'leaper', 'mimic']);

function run(s, seed, plain) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s], diff: 'normal' });
  const ai = new Autopilot(seed * 7919 + 13, 'human');
  let n = 0, near = 0, closing = 0, crawl = 0, sides = 0, sideN = 0, close = 0, hits = 0;
  const seen = new Set();
  while (!W.over && W.t < 60) {
    if (plain) W.R.smart = 0;
    const P = W.players[0];
    P.input = ai.control(W, P);
    step(W, STEP);
    for (const e of drainEvents(W)) if (e.k === 'death' || e.k === 'shield') hits++;
    if (!P.alive || W.n % 12) continue;
    n++;
    const S = new Set();
    for (const e of W.enemies) {
      if (!HOST.has(e.type) || e.hp <= 0 || e.hidden) continue;
      const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz) || 1;
      if (d < 4) { near++; S.add(Math.floor(((Math.atan2(dz, dx) + Math.PI) / (2 * Math.PI)) * 8) % 8); }
      if (e.type === 'crawler') { crawl++; const v = Math.hypot(e.vx, e.vz) || 1; if ((e.vx * dx + e.vz * dz) / d > 0.4 * v) closing++; }
    }
    if (S.size) { sides += S.size; sideN++; }
    for (const b of W.bolts) { if (seen.has(b.id)) continue; if (Math.hypot(b.x - P.x, b.z - P.z) < 0.8) { seen.add(b.id); close++; } }
  }
  return { near: near / Math.max(1, n), closing: closing / Math.max(1, crawl), sides: sideN ? sides / sideN : 0, close, hitsPerMin: hits / Math.max(1, W.t / 60) };
}
for (const s of sectors) {
  const row = {};
  for (const plain of [true, false]) {
    const acc = { near: 0, closing: 0, sides: 0, close: 0, hitsPerMin: 0 };
    for (let i = 0; i < runs; i++) { const r = run(s, 500 + i * 31 + s, plain); for (const k in acc) acc[k] += r[k] / runs; }
    row[plain ? 'old' : 'new'] = acc;
  }
  const f = (k, dp = 2) => `${row.old[k].toFixed(dp)} -> ${row.new[k].toFixed(dp)}`;
  console.log(`S${s + 1}  machines within 4 m ${f('near')} · crawlers closing ${f('closing')} · sides they come from ${f('sides')} · near-miss bolts/run ${f('close', 1)} · hits/min ${f('hitsPerMin')}`);
}
