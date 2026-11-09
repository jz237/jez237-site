// Gunships: the demo autopilot flies each gunship through a world (waves and carrier) for several seeds. Every ship
// must be able to clear it, and no ship should be far stronger than the rest.
//   node scripts/skyhold/ship_check.mjs [runs=8] [world=3]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-09/skyhold/js/sim.js?v=10';
import { Autopilot } from '../../games/2026-11-09/skyhold/js/ai.js?v=10';
import { TYPICAL_UP, SHIP_KEYS } from '../../games/2026-11-09/skyhold/js/config.js?v=10';
const runs = +(process.argv[2] || 8), s = +(process.argv[3] || 3) - 1;
let fail = 0;
for (const ship of SHIP_KEYS) {
  let clear = 0, T = 0, kills = 0, deaths = 0, boss = 0, arcs = 0, mis = 0, hyper = 0, ev = 0;
  for (let r = 0; r < runs; r++) {
    const W = makeWorld({ mode: 'campaign', sector: s, seed: 900 + r * 31, up: { ...TYPICAL_UP[s] }, lives: 5, noTut: true, ship, demo: true });
    const ai = new Autopilot(11 + r, 'demo');
    let bt = 0;
    for (let n = 0; n < 120 * 900 && !W.over; n++) {
      const p = W.players[0]; p.input = ai.control(W, p); step(W, STEP);
      if (W.boss && W.boss.st !== 'warp') bt += STEP;
      for (const e of drainEvents(W)) { if (e.k === 'arc') arcs++; if (e.k === 'mhit') mis++; if (e.k === 'hyper') hyper++; if (e.k === 'event') ev++; }
    }
    if (W.result === 'clear') clear++;
    T += W.secT; kills += W.stats.kills; deaths += W.stats.deaths || 0; boss += bt;
  }
  const ok = clear >= Math.ceil(runs * 0.5);
  if (!ok) fail++;
  console.log(`${ship.padEnd(8)} clears ${clear}/${runs}  avg ${(T / runs).toFixed(0)} s  kills/run ${(kills / runs).toFixed(0)}  deaths/run ${(deaths / runs).toFixed(1)}  carrier ${(boss / runs).toFixed(0)} s  hyper/run ${(hyper / runs).toFixed(1)}  events/run ${(ev / runs).toFixed(1)}${arcs ? '  arcs ' + arcs : ''}${mis ? '  missile hits ' + mis : ''}  ${ok ? 'ok' : 'FAIL'}`);
}
console.log(fail ? 'FAIL' : 'PASS');
process.exit(fail ? 1 : 0);
