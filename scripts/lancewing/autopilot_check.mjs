// Chained campaigns the way the game runs them, for the demo autopilot (attract mode / AI PLAYTHROUGH) and the
// human-like one: sector 1 to the sector 5 boss with lives and score carried over, +1 life per sector clear,
// salvage (sector score / SALVAGE_DIV) spent in the AI shop order of main.js, and after a game over CONTINUE FROM
// CHECKPOINT (same sector and wave, full lives, score from zero), as a player would.
//   node scripts/lancewing/autopilot_check.mjs [campaigns=8] [difficulty=normal]
// Prints per profile how far each campaign got on its first life set, how many continues it needed in all,
// where the game overs happened and the sim time. FAILS on a stuck wave (5 min), NaN, an exception, a demo campaign
// that needs more than 3 continues (or 1 on average), or a human campaign that cannot finish within 40 continues.
import { SIM, AI, CFG } from './_game.mjs';
const { makeWorld, step, drainEvents } = SIM;
const { Autopilot } = AI;
const { SECTORS, START_LIVES, UPGRADES, UP_COST, SALVAGE_DIV, DIFFICULTY, WAVES, STEP } = CFG;

const N = +(process.argv[2] || 8);
const diff = process.argv[3] || 'normal';
const SHOP = ['wing', 'armor', 'magnet', 'reach', 'wing', 'glide', 'armor', 'wing', 'reach', 'magnet'];   // main.js AI_SHOP
const LIVES = START_LIVES + DIFFICULTY[diff].lives;
let fail = 0;
const bad = (W) => [...W.players, ...W.riders].some((b) => !Number.isFinite(b.x) || !Number.isFinite(b.y)) || (W.boss && !Number.isFinite(W.boss.x + W.boss.y));

function flySector(o, ai) {
  const W = makeWorld({ mode: 'campaign', diff, ...o });
  let lastWave = -1, waveStart = 0;
  while (!W.over && W.t < 1800) {
    const p = W.players[0];
    p.input = ai.control(W, p);
    step(W, STEP);
    drainEvents(W);
    if (W.wave !== lastWave) { lastWave = W.wave; waveStart = W.t; }
    if (W.t - waveStart > 300) throw new Error(`stuck: sector ${o.sector + 1} wave ${W.wave + 1} (${W.phase}, ${W.riders.length} riders, ${W.cores.length} cores)`);
    if (W.n % 600 === 0 && bad(W)) throw new Error(`NaN at sector ${o.sector + 1} tick ${W.n}`);
  }
  return W;
}

const t0 = Date.now();
console.log(`Lancewing chained campaigns · ${N} per profile · ${diff} · ${LIVES} lives`);
for (const prof of ['demo', 'human']) {
  const firstReach = [], conts = [], overs = {};
  let simT = 0, done = 0;
  const trail = [];
  for (let c = 0; c < N; c++) {
    const run = { up: {}, score: 0, lives: LIVES, salvage: 0, score0: 0 };
    let s = 0, wave = 0, cont = 0, first = null, seed = 9000 + c * 101;
    if (c === 0) trail.length = 0;
    try {
      while (s < SECTORS.length && cont <= 40) {
        const W = flySector({ sector: s, wave, seed, up: run.up, lives: run.lives, score: run.score }, new Autopilot(seed * 7 + (prof === 'human' ? 1 : 0), prof));   // a new pilot per sector, as main.js does
        seed++;
        simT += W.t;
        if (c === 0) trail.push(`S${s + 1}${wave ? 'W' + (wave + 1) : ''}: ${run.lives}L ${Math.round(run.score / 1000)}k ${Object.entries(run.up).map(([k, v]) => k[0] + v).join('')}`);
        if (W.result === 'clear') {
          run.salvage += Math.floor((W.score - run.score0) / SALVAGE_DIV);
          run.score = W.score; run.score0 = W.score; run.lives = W.lives + 1;
          for (const k of SHOP) { const lv = run.up[k] || 0; if (lv < UPGRADES[k].max && run.salvage >= UP_COST[lv]) { run.salvage -= UP_COST[lv]; run.up[k] = lv + 1; } }
          s++; wave = 0;
        } else {
          const at = `S${s + 1} ${W.wave >= WAVES ? 'boss' : 'W' + (W.wave + 1)}`;
          overs[at] = (overs[at] || 0) + 1;
          if (first === null) first = at;
          cont++; wave = Math.min(W.wave, WAVES); run.score = 0; run.score0 = 0; run.lives = LIVES;
        }
      }
    } catch (e) { console.log(`  FAIL ${prof} campaign ${c + 1}: ${e.message}`); fail++; }
    if (s >= SECTORS.length) done++;
    firstReach.push(first || 'ALL');
    conts.push(cont);
  }
  const avg = conts.reduce((a, b) => a + b, 0) / N;
  const where = Object.entries(overs).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} x${v}`).join(', ');
  console.log(`  ${prof.padEnd(5)} first game over at: ${firstReach.join(' · ')}  (ALL = no game over at all)`);
  console.log(`        campaign 1, lives + score at each sector start: ${trail.join(' · ')}`);
  console.log(`        finished ${done}/${N} · continues per campaign ${conts.join(' ')} (avg ${avg.toFixed(1)}) · game overs at ${where || '-'} · ${(simT / N / 60).toFixed(1)} sim min per campaign`);
  if (prof === 'demo' && (done < N || Math.max(...conts) > 3 || avg > 1)) { console.log(`  FAIL the demo autopilot should clear the campaign with at most 3 continues (1 on average)`); fail++; }
  if (prof === 'human' && done < N) { console.log(`  FAIL a human-like campaign did not finish within 40 continues`); fail++; }
}
console.log(`${fail ? 'FAIL' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(fail ? 1 : 0);
