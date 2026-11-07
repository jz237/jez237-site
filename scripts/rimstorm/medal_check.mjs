// Medal check: how often the three medals of each sector fall to the human-like autopilot, the sharp demo
// autopilot and a "sniper" (the demo autopilot that only fires when something is in its lane), playing each
// sector from its first web with the typical upgrades. UNBROKEN = no Rimrunner lost, DEAD EYE = AIM_MEDAL
// accuracy, QUICKSILVER = under the par time. Medals should be earned by good, deliberate play: rare for the
// human-like bot, common for the sniper.
//   node scripts/rimstorm/medal_check.mjs [trials=16] [sectors=1,2,3,4,5]
import { makeWorld, step, drainEvents, STEP, laneOf } from '../../games/2026-11-06/rimstorm/js/sim.js?v=7';
import { Autopilot } from '../../games/2026-11-06/rimstorm/js/ai.js?v=7';
import { SECTORS, TYPICAL_UP, parTime, AIM_MEDAL } from '../../games/2026-11-06/rimstorm/js/config.js?v=7';

const trials = +(process.argv[2] || 16);
const sectors = (process.argv[3] || '1,2,3,4,5').split(',').map((s) => +s - 1);
const pct = (a, q) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

function sniper(ai) {
  ai.wantFire = function (W, p) {
    const L = p.lane;
    if (W.phase === 'dive') return W.spine[L] < 1;
    if (W.boss && W.boss.state === 'fight') {
      const B = W.boss;
      if (B.eye) return B.eye.open && B.eye.lane === L || W.enemies.some((e) => e.hp > 0 && laneOf(W, e.lane) === L) || W.bolts.some((b) => b.lane === L);
      if (B.heads.some((h) => h.hp > 0)) return B.heads.some((h) => h.hp > 0 && h.lane === L) || W.enemies.some((e) => e.hp > 0 && laneOf(W, e.lane) === L);
      return true;
    }
    return W.enemies.some((e) => e.hp > 0 && laneOf(W, e.lane) === L && e.d < 1 && !(e.type === 'mite' && Math.abs(e.lane - Math.round(e.lane)) > 0.3)) || W.bolts.some((b) => b.lane === L) || W.spine[L] < 1;
  };
  return ai;
}

function run(s, seed, prof) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s] });
  const ai = prof === 'sniper' ? sniper(new Autopilot(seed * 31 + 7, 'demo')) : new Autopilot(seed * 31 + 7, prof);
  while (!W.over && W.t < 1500) { const P = W.players[0]; P.input = ai.control(W, P); step(W, STEP); drainEvents(W); }
  return { clear: W.result === 'clear', t: W.secT, acc: W.stats.hits / Math.max(1, W.stats.shots), deaths: W.stats.deaths, shots: W.stats.shots };
}

for (const s of sectors) {
  console.log(`S${s + 1} ${SECTORS[s].name}  par ${parTime(s)} s, DEAD EYE ${Math.round(AIM_MEDAL * 100)} %`);
  for (const prof of ['human', 'demo', 'sniper']) {
    const R = [];
    for (let i = 0; i < trials; i++) R.push(run(s, 1000 + i * 17 + s, prof));
    const C = R.filter((r) => r.clear), T = C.map((r) => r.t), A = C.map((r) => r.acc);
    const m = (f) => `${Math.round((100 * C.filter(f).length) / R.length)}%`;
    console.log(`  ${prof.padEnd(6)} clear ${String(Math.round((100 * C.length) / R.length)).padStart(3)}%  time p25/50/75 ${pct(T, 0.25)?.toFixed(0)}/${pct(T, 0.5)?.toFixed(0)}/${pct(T, 0.75)?.toFixed(0)} s  acc p50/90 ${(pct(A, 0.5) * 100).toFixed(0)}/${(pct(A, 0.9) * 100).toFixed(0)}%  ` +
      `medals: UNBROKEN ${m((r) => r.deaths === 0)}  DEAD EYE ${m((r) => r.shots > 30 && r.acc >= AIM_MEDAL)}  QUICKSILVER ${m((r) => r.t <= parTime(s))}`);
  }
}
