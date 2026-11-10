// NOVA PLAN: how the autopilot spends its novas, world by world: clear rate, novas fired and machines destroyed per
// nova, novas into the special wave and the carrier, lifters carrying a settler destroyed by one, what each was let off
// for (the demo's reasons), deaths by novas still in hand, and where runs ended.
//   node scripts/skyhold/nova_check.mjs [runs=12] [profile=demo] [sectors=1,2,3,4,5]
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-09/skyhold/js/sim.js?v=26';
import { Autopilot } from '../../games/2026-11-09/skyhold/js/ai.js?v=26';
import { TYPICAL_UP, START_LIVES } from '../../games/2026-11-09/skyhold/js/config.js?v=26';
const runs = +(process.argv[2] || 12), profile = process.argv[3] || 'demo';
const sectors = (process.argv[4] || '1,2,3,4,5').split(',').map((n) => +n - 1);
for (const s of sectors) {
  const WHY = {}, DH = [0,0,0,0,0,0,0], REACH = [0,0,0,0,0,0]; let clear = 0, fired = 0, kills = 0, left = 0, boss = 0, weak = 0, lost = 0, deaths = 0, T = 0, saved = 0, special = 0;
  for (let i = 0; i < runs; i++) {
    const seed = 1000 + i * 37 + s * 7;
    const W = makeWorld({ sector: s, seed, up: TYPICAL_UP[s], lives: START_LIVES, noTut: s > 0 });
    const ai = new Autopilot(seed, profile);
    let cur = null; const why = {}; const dh = [0,0,0,0,0,0,0];
    while (!W.over && W.t < 900) {
      const p = W.players[0]; p.input = ai.control(W, p); if (p.input.nova) { const k = (ai.debug.dodge || '?').replace(/\(.*\)|\d+/g, '').replace(/\s+/g, ' ').trim().slice(0, 40); why[k] = (why[k] || 0) + 1; } step(W, STEP);
      for (const e of drainEvents(W)) {
        if (e.k === 'nova') { if (cur && cur.n <= 2 && !cur.b) weak++; cur = { n: 0, b: !!(W.boss && W.boss.st === 'fight') }; fired++; if (cur.b) boss++; if (W.special) special++; }
        else if (e.k === 'death' && e.pid === 1) dh[Math.min(6, W.players[0].nova)]++;
        else if (e.k === 'kill' && e.by === 'nova') { kills++; if (cur) cur.n++; if (e.carry) saved++; }
      }
    }
    if (cur && cur.n <= 2 && !cur.b) weak++;
    for (const k in why) WHY[k] = (WHY[k] || 0) + why[k]; for (let q = 0; q < 7; q++) DH[q] += dh[q]; REACH[W.result === 'clear' ? 5 : W.wave]++;
    if (W.result === 'clear') { clear++; left += W.players[0].nova; }
    lost += W.stats.lost; deaths += W.stats.deaths; T += W.secT;
  }
  console.log('   reasons', JSON.stringify(WHY), ' deaths by novas in hand', DH.join('/'), ' ended wave1-4/carrier/clear', REACH.join('/'));
  const f = (v, d = runs) => (v / d).toFixed(2);
  console.log(`S${s + 1} ${profile} clear ${(100 * clear / runs).toFixed(0)}%  novas/run ${f(fired)}  kills/nova ${fired ? (kills / fired).toFixed(1) : '-'}  two-or-fewer ${weak}  carrier ${boss}  special ${special}  settler carriers ${saved}  left at clear ${clear ? f(left, clear) : '-'}  lost ${f(lost)}  deaths ${f(deaths)}  ${f(T)} s`);
}
