// Difficulty ramp check: a HUMAN-LIKE autopilot (about 0.35 s reaction delay, a little random hesitation, the odd
// late reaction) plays each depth from its first level through its guardian, with the typical upgrades for that
// depth, carrying hearts, lives and tools between levels like a real run. Reports the clear rate per depth, where
// runs end (level by level) and what killed the digger, plus hits per level as a smoother "edge" measure.
//   node scripts/shock-horror/ramp_check.mjs [trials=40] [diff=normal] [depths=0,1,2,3,4]
import { CFG, SIM, AI } from './_game.mjs';
const N = +(process.argv[2] || 40), diff = process.argv[3] || 'normal';
const depths = (process.argv[4] || '0,1,2,3,4').split(',').map(Number);
const TARGET = [95, 80, 60, 40, 25];
const rows = [];
for (const d of depths) {
  let clears = 0; const endAt = [0, 0, 0, 0], causes = {}, hitsPer = [0, 0, 0, 0], plays = [0, 0, 0, 0], times = [0, 0, 0, 0];
  const t0 = Date.now();
  for (let k = 0; k < N; k++) {
    const up = { ...CFG.TYPICAL_UP[d] };
    let carry = { up, dyn: CFG.START.dyn + 2 * (up.satchel || 0), flares: CFG.START.flares + 2 * (up.pouch || 0) };
    let ok = true;
    for (let l = 0; l <= CFG.LEVELS && ok; l++) {
      const W = SIM.makeWorld({ seed: 1000 + k * 7919 + d * 131 + l, depth: d, level: l, diff, carry });
      const ap = new AI.Autopilot('human', k * 31 + l * 7 + d);
      const h0 = W.stats.hits;
      while (!W.clear && !W.over && W.t < 900) {
        W.players[0].input = ap.control(W); SIM.step(W);
        for (const e of SIM.drainEvents(W)) if (e.k === 'death') causes[e.cause] = (causes[e.cause] || 0) + 1;
      }
      plays[l]++; hitsPer[l] += W.stats.hits - h0; times[l] += W.t;
      if (!W.clear) { ok = false; endAt[l]++; if (!W.over) causes['(stuck / timeout)'] = (causes['(stuck / timeout)'] || 0) + 1; break; }
      carry = SIM.carryOut(W); carry.up = up;
    }
    if (ok) clears++;
  }
  const pct = Math.round(clears / N * 100);
  rows.push({ d, pct });
  console.log(`DEPTH ${d + 1} (${CFG.BIOMES[d].name}): clear ${pct}% (target ~${TARGET[d]}%) · ${((Date.now() - t0) / 1000).toFixed(0)} s cpu`);
  console.log(`   runs ended in: L1 ${endAt[0]}  L2 ${endAt[1]}  L3 ${endAt[2]}  GUARDIAN ${endAt[3]}`);
  console.log(`   hits per level: ${hitsPer.map((h, i) => plays[i] ? (h / plays[i]).toFixed(1) : '-').join(' / ')} · avg level time ${times.map((t, i) => plays[i] ? Math.round(t / plays[i]) + 's' : '-').join(' / ')}`);
  console.log(`   deaths: ${Object.entries(causes).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(', ')}`);
}
console.log('SUMMARY ' + rows.map((r) => `D${r.d + 1} ${r.pct}%`).join(' · '));
