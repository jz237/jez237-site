// Autopilot spacing: in carrier fights it holds a firing band outside the hull (under 4 hull bumps a minute; the old autopilot bumped ~20 a minute, rarely inside the band),
// and it never stays pinned under or over a machine. node scripts/skyhold/ai_spacing_check.mjs [runs=6] [profile=demo]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-09/skyhold/js/sim.js?v=17';
import { Autopilot } from '../../games/2026-11-09/skyhold/js/ai.js?v=17';
import { BOSSES, TYPICAL_UP, WAVES } from '../../games/2026-11-09/skyhold/js/config.js?v=17';
const runs = +(process.argv[2] || 6), profile = process.argv[3] || 'demo';
const wd = (d) => { d %= 1600; if (d > 800) d -= 1600; if (d < -800) d += 1600; return d; };
let fail = 0;
for (let s = 0; s < 5; s++) {
  let bumps = 0, hullT = 0, fightT = 0, pinMax = 0, won = 0;
  for (let r = 0; r < runs; r++) {
    const W = makeWorld({ mode: 'campaign', sector: s, seed: 100 + r * 17 + s, up: { ...TYPICAL_UP[s] }, lives: 9, cp: WAVES, noTut: true });
    const ai = new Autopilot(3 + r, profile);
    let pin = 0;
    for (let n = 0; n < 120 * 150 && !W.over; n++) {
      const p = W.players[0];
      p.input = ai.control(W, p);
      step(W, STEP);
      for (const e of drainEvents(W)) if (e.k === 'bump') bumps++;
      const B = W.boss;
      if (B && B.st === 'fight' && p.alive) {
        fightT += STEP;
        const half = BOSSES[B.key].len * 0.5;
        if (Math.abs(wd(p.x - B.x)) < half + 2 && Math.abs(p.y - B.y) < 6) hullT += STEP;
      }
      // pinned: a machine within 3 m along the ground and 1.5-6 m above or below, with the ship at the floor or ceiling
      const pinned = p.alive && W.enemies.some((e) => e.hp > 0 && e.born <= 0 && Math.abs(wd(e.x - p.x)) < 3 && Math.abs(e.y - p.y) < 6 && (p.y < 3 || p.y > 33));
      pin = pinned ? pin + STEP : 0; pinMax = Math.max(pinMax, pin);
      if (W.result === 'clear') { won++; break; }
    }
  }
  const pct = fightT ? (hullT / fightT) * 100 : 0;
  const perMin = fightT ? bumps / (fightT / 60) : 0;
  const ok = perMin < 4 && pct < 8 && pinMax < 1.5;
  if (!ok) fail++;
  console.log(`world ${s + 1}: carriers down ${won}/${runs}  hull bumps/run ${(bumps / runs).toFixed(1)} (${perMin.toFixed(1)}/min)  time at the hull ${pct.toFixed(1)} %  longest pinned ${pinMax.toFixed(2)} s  ${ok ? 'ok' : 'FAIL'}`);
}
// waves: never pinned against the ground or the ceiling by a machine (the lifter case)
for (let s = 0; s < 5; s++) {
  let pinMax = 0, pinN = 0;
  for (let r = 0; r < runs; r++) {
    const W = makeWorld({ mode: 'campaign', sector: s, seed: 300 + r * 13 + s, up: { ...TYPICAL_UP[s] }, lives: 9, cp: 0, noTut: true });
    const ai = new Autopilot(5 + r, profile);
    let pin = 0;
    for (let n = 0; n < 120 * 240 && !W.over && W.phase !== 'boss'; n++) {
      const p = W.players[0];
      p.input = ai.control(W, p); step(W, STEP); drainEvents(W);
      const pinned = p.alive && W.enemies.some((e) => e.hp > 0 && e.born <= 0 && Math.abs(wd(e.x - p.x)) < 3 && Math.abs(e.y - p.y) < 6 && (p.y < 3 || p.y > 33));
      if (pinned && !pin) pinN++;
      pin = pinned ? pin + STEP : 0; pinMax = Math.max(pinMax, pin);
    }
  }
  const ok = pinMax < 1.5;
  if (!ok) fail++;
  console.log(`world ${s + 1} waves: times under/over a machine at the floor/ceiling ${pinN}, longest ${pinMax.toFixed(2)} s  ${ok ? 'ok' : 'FAIL'}`);
}
console.log(fail ? 'FAIL' : 'PASS');
process.exit(fail ? 1 : 0);
