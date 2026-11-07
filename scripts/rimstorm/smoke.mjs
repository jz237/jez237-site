// Sim smoke: the autopilot plays every sector (web 1 to the boss) and every boss on its own, checking
// world invariants every tick (no NaN, lanes and depths in range, ids unique, the world clones exactly).
// Then a chained campaign, sector 1 to the sector 5 boss, with lives and score carried over (a sector is
// retried if the autopilot runs out of Rimrunners, like the AI PLAYTHROUGH does).
//   node scripts/rimstorm/smoke.mjs [profile=demo] [difficulty=normal]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-06/rimstorm/js/sim.js?v=10';
import { Autopilot } from '../../games/2026-11-06/rimstorm/js/ai.js?v=10';
import { SECTORS, TYPICAL_UP, WEBS, START_LIVES } from '../../games/2026-11-06/rimstorm/js/config.js?v=10';

const profile = process.argv[2] || 'demo';
const diff = process.argv[3] || 'normal';
let bad = 0;
function check(W, where) {
  const fail = (m) => { if (bad++ < 12) console.log(`  INVARIANT ${where} t=${W.t.toFixed(2)}: ${m}`); };
  const num = (v) => typeof v === 'number' && Number.isFinite(v);
  if (!num(W.score) || !num(W.lives)) fail('score/lives');
  const ids = new Set();
  for (const e of W.enemies) {
    if (ids.has(e.id)) fail('dup id ' + e.id); ids.add(e.id);
    if (!num(e.lane) || !num(e.d)) fail(`enemy ${e.type} NaN`);
    if (e.d < -0.001 || e.d > 1.05) fail(`enemy ${e.type} depth ${e.d}`);
    if (W.closed ? e.lane < -0.001 || e.lane >= W.nl + 0.001 : e.lane < -0.501 || e.lane > W.nl - 0.499) fail(`enemy ${e.type} lane ${e.lane} of ${W.nl}`);
  }
  for (const p of W.players) {
    if (!num(p.pos) || !num(p.aim) || !num(p.d)) fail('player NaN');
    if (p.lane < 0 || p.lane >= W.nl) fail('player lane ' + p.lane);
  }
  for (const b of W.bolts) if (!num(b.d) || b.lane < 0 || b.lane >= W.nl) fail('bolt');
  for (const z of W.zaps) if (z.lane < 0 || z.lane >= W.nl) fail('zap lane');
  if (W.spine.length !== W.nl) fail('spine array');
  if (W.boss && (!num(W.boss.hp) || !num(W.boss.d))) fail('boss NaN');
}
function play(o, limitS, prof = profile) {
  const W = makeWorld({ mode: 'campaign', diff, ...o });
  const ai = new Autopilot((o.seed || 1) * 31 + 7, prof);
  const causes = {}, seen = new Set();
  let bossKill = false;
  while (!W.over && W.t < limitS) {
    for (const P of W.players) P.input = ai.control(W, P);
    step(W, STEP);
    for (const e of drainEvents(W)) { seen.add(e.k); if (e.k === 'pod') PODS.drop++; if (e.k === 'pickup') PODS[e.kind] = (PODS[e.kind] || 0) + 1; if (e.k === 'death') causes[e.cause] = (causes[e.cause] || 0) + 1; if (e.k === 'bosskill') bossKill = true; }
    if (W.n % 60 === 0) check(W, `S${(o.sector || 0) + 1}W${W.web + 1}`);
    if (W.n % 3000 === 0) { const C = cloneWorld(W); if (JSON.stringify(C) !== JSON.stringify(W)) { bad++; console.log('  clone differs'); } }
  }
  return { W, causes, bossKill, seen };
}
const t0 = Date.now();
const PODS = { drop: 0 };
console.log(`profile ${profile}, ${diff}`);
for (let s = 0; s < SECTORS.length; s++) {
  const r = play({ sector: s, seed: 100 + s, up: TYPICAL_UP[s], lives: 9 }, 900);
  console.log(`S${s + 1} ${SECTORS[s].name.padEnd(14)} ${r.W.result === 'clear' ? 'CLEAR' : 'not clear (' + (r.W.result || 'timeout') + ', web ' + (r.W.web + 1) + ')'}  ${r.W.secT.toFixed(0)} s  deaths ${r.W.stats.deaths}  kills ${r.W.stats.kills}  acc ${Math.round(100 * r.W.stats.hits / Math.max(1, r.W.stats.shots))}%  causes ${JSON.stringify(r.causes)}`);
}
{
  const kinds = ['twin', 'rapid', 'droid', 'hop'].filter((k) => PODS[k]);
  console.log(`power-up pods: ${PODS.drop} dropped, caught ${['twin', 'rapid', 'droid', 'hop'].map((k) => `${k} ${PODS[k] || 0}`).join(', ')}`);
  if (PODS.drop < 5 || kinds.length < 3) { bad++; console.log('  too few power-up pods dropped or caught'); }
}
for (let s = 0; s < SECTORS.length; s++) {
  const r = play({ sector: s, seed: 300 + s, up: TYPICAL_UP[s], lives: 9, web: WEBS }, 400);
  console.log(`  boss ${SECTORS[s].boss.padEnd(12)} ${r.bossKill ? 'DOWN' : 'ALIVE'} in ${r.W.stats.bossT.toFixed(1)} s, deaths ${r.W.stats.deaths}, ${r.W.result || 'running'}`);
  if (!r.bossKill) bad++;
}
// chained campaign
{
  let score = 0, lives = START_LIVES + 2, up = {}, tries = 0, s = 0, seed = 900, total = 0;
  while (s < SECTORS.length && tries < 12) {
    const r = play({ sector: s, seed: seed++, up, lives, score }, 1200);
    total += r.W.t;
    if (r.W.result === 'clear') { score = r.W.score; lives = Math.max(3, r.W.lives + 1); up = { ...TYPICAL_UP[Math.min(4, s + 1)] }; s++; }
    else { tries++; lives = START_LIVES + 2; }
  }
  console.log(`chained campaign: ${s === SECTORS.length ? 'ALL FIVE SECTORS CLEARED' : 'stopped in sector ' + (s + 1)} with ${tries} retries, score ${score.toLocaleString()}, ${(total / 60).toFixed(1)} sim minutes`);
  if (s < SECTORS.length) bad++;
}
// endless descent runs and reaches a boss
{
  const W = makeWorld({ mode: 'endless', seed: 77, lives: 30, diff });
  const ai = new Autopilot(5, profile);
  let bosses = 0;
  while (!W.over && W.t < 900) { W.players[0].input = ai.control(W, W.players[0]); step(W, STEP); for (const e of drainEvents(W)) if (e.k === 'bosskill') bosses++; if (W.n % 60 === 0) check(W, 'ENDLESS'); }
  console.log(`endless: ${W.webN} webs, ${bosses} bosses down, ${(W.t / 60).toFixed(1)} min, ${W.over ? 'over' : 'running'}`);
  if (bosses < 1) bad++;
}
console.log(`${bad ? 'FAIL' : 'OK'} (${bad} problems) in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(bad ? 1 : 0);
