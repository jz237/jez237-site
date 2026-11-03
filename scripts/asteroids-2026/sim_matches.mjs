// Headless AI-vs-AI duels in every sector: pacing, damage mix, NaN check.
// usage: node sim_matches.mjs [matches per sector] [maxSeconds]
import { makeWorld, step, drainEvents, STEP, shipOf, bossHP } from '../../games/2026-03-09/asteroids-hd/2026/js/sim.js?v=5';
import { AIPilot } from '../../games/2026-03-09/asteroids-hd/2026/js/ai.js?v=5';
import { PILOTS, PERKS, DIFFICULTY } from '../../games/2026-03-09/asteroids-hd/2026/js/config.js?v=5';

const N = +process.argv[2] || 4, MAX = +process.argv[3] || 240;
const keys = ['razor', 'lyra', 'grit', 'cipher'];
const rows = [];
for (let arena = 0; arena < 5; arena++) {
  for (let m = 0; m < N; m++) {
    const a = keys[(m + arena) % 4], b = keys[(m * 3 + arena + 1) % 4];
    const boss = arena === 4;
    const W = makeWorld({ arena, seed: 1000 + m * 17 + arena, boss, perks: { 1: m % 2 ? PERKS[a] : {} } });
    const ais = [new AIPilot(W, shipOf(W, 1), PILOTS[a], DIFFICULTY.normal.ai)];
    if (!boss) ais.push(new AIPilot(W, shipOf(W, -1), PILOTS[b], DIFFICULTY.normal.ai));
    const src = {}, kinds = {};
    let t = 0, bad = 0;
    while (t < MAX && !(W.over && W.t - W.overT > 1)) {
      for (const ai of ais) ai.update(W, STEP);
      step(W, STEP);
      for (const e of drainEvents(W)) {
        kinds[e.k] = (kinds[e.k] || 0) + 1;
        if (e.k === 'hit') src[e.src] = (src[e.src] || 0) + e.dmg;
      }
      t += STEP;
      for (const s of W.ships) if (!Number.isFinite(s.x + s.z + s.vx + s.vz + s.a)) bad++;
      for (const r of W.rocks) if (!Number.isFinite(r.x + r.z)) bad++;
    }
    const s1 = shipOf(W, 1), s2 = shipOf(W, -1);
    rows.push({ arena, a, b: boss ? 'MAW' : b, t: Math.round(W.over ? W.overT : t), win: W.winner, hp: `${s1.hp}/${boss ? bossHP(W.boss) : s2.hp}`,
      rocks: kinds.rock || 0, shots: (kinds.fire || 0), pu: kinds.pu || 0, dodge: kinds.dodge || 0, src: JSON.stringify(src), bad, rockN: W.rocks.length });
  }
}
console.table(rows);
const done = rows.filter((r) => r.win !== 0);
console.log('decided', done.length, '/', rows.length, 'avg t', (done.reduce((a, r) => a + r.t, 0) / (done.length || 1)).toFixed(1));
