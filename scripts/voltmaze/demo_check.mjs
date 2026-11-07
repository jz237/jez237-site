// The attract demo, the way main.js startDemo() sets it up (a few rooms short of the lift, upgrades fitted
// to show them off, the demo autopilot): does it play with intent and reach the boss inside its 95 s?
// Prints per sector: time to the boss, boss down, deaths, kills / lured, dashes, EMPs, pickups, rooms.
//   node scripts/voltmaze/demo_check.mjs [seeds=4]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-06/voltmaze/js/sim.js?v=6';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=6';
import { TYPICAL_UP, RAMP, SECTORS } from '../../games/2026-11-06/voltmaze/js/config.js?v=6';

const seeds = +(process.argv[2] || 4);
const LIMIT = 95;
let fails = 0;
const demoUp = (s) => ({ ...TYPICAL_UP[s], weapon: Math.max(1, TYPICAL_UP[s].weapon || 0), dash: Math.max(1, TYPICAL_UP[s].dash || 0), emp: Math.max(1, TYPICAL_UP[s].emp || 0) });
for (let s = 0; s < 5; s++) {
  const rows = [];
  for (let k = 0; k < seeds; k++) {
    const seed = 4100 + s * 37 + k * 101;
    const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, room: Math.max(0, RAMP[s].rooms - 2), up: demoUp(s), lives: 9 });
    const ai = new Autopilot(seed, 'demo');
    const r = { bossT: null, downT: null, deaths: 0, kills: 0, lured: 0, dash: 0, emp: 0, pick: 0, rooms: 0, heavy: 0 };
    for (let i = 0; i < LIMIT / STEP && !W.over; i++) {
      W.players[0].input = ai.control(W, W.players[0]);
      step(W, STEP);
      for (const e of drainEvents(W)) {
        if (e.k === 'bossin' && r.bossT === null) r.bossT = W.t;
        if (e.k === 'bossdown') { r.downT = W.t; r.heavy++; }
        if (e.k === 'death') { r.deaths++; r.heavy++; }
        if (e.k === 'dash') r.dash++;
        if (e.k === 'emp') r.emp++;
        if (e.k === 'pickup') r.pick++;
        if (e.k === 'roomenter') r.rooms++;
      }
    }
    r.kills = W.stats.kills; r.lured = W.stats.lured;
    rows.push(r);
  }
  const reached = rows.filter((r) => r.bossT !== null).length, down = rows.filter((r) => r.downT !== null).length;
  const avg = (f) => (rows.reduce((a, r) => a + f(r), 0) / rows.length).toFixed(1);
  const bt = rows.filter((r) => r.bossT !== null).map((r) => r.bossT.toFixed(0) + 's').join(' ');
  console.log(`S${s + 1} ${SECTORS[s].name.padEnd(14)} boss reached ${reached}/${rows.length} (at ${bt || '-'}) · boss down ${down}/${rows.length} · deaths ${avg((r) => r.deaths)} · kills ${avg((r) => r.kills)} (lured ${avg((r) => r.lured)}) · dashes ${avg((r) => r.dash)} · EMPs ${avg((r) => r.emp)} · pickups ${avg((r) => r.pick)} · rooms ${avg((r) => r.rooms)} · slow-mo moments ${avg((r) => r.heavy)}`);
  if (reached < Math.ceil(rows.length * 0.75)) { console.log(`FAIL  S${s + 1}: the demo reaches its boss too rarely`); fails++; }
  if (rows.some((r) => r.kills < 2)) { console.log(`FAIL  S${s + 1}: a demo run destroyed fewer than 2 robots`); fails++; }
}
console.log(fails ? `${fails} demo check(s) failed` : 'demo check passed: the attract demo reaches the boss in every sector');
process.exit(fails ? 1 : 0);
