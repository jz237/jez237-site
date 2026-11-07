// Sim smoke test: the autopilot plays every sector (four waves + the boss) and a chained campaign from
// sector 1 to the sector 5 boss, plus ENDLESS SKIES for a while. Fails on any exception, NaN, a stuck
// wave or a campaign that never reaches the end.
//   node scripts/lancewing/smoke.mjs [runs=3] [profile=demo] [difficulty=normal]
import { SIM, AI, CFG } from './_game.mjs';
const { makeWorld, step, drainEvents, STEP } = SIM;
const { Autopilot } = AI;
const { SECTORS, TYPICAL_UP, START_LIVES, UPGRADES, UP_COST, SALVAGE_DIV } = CFG;

const runs = +(process.argv[2] || 3);
const profile = process.argv[3] || 'demo';
const diff = process.argv[4] || 'normal';
let fail = 0;
const bad = (W) => { for (const b of [...W.players, ...W.riders]) if (!Number.isFinite(b.x) || !Number.isFinite(b.y)) return true; return W.boss && (!Number.isFinite(W.boss.x) || !Number.isFinite(W.boss.y)); };

export function play(opts, prof = profile, limitS = 1200) {
  const W = makeWorld({ diff, ...opts });
  const ais = W.players.map((p, i) => new Autopilot((opts.seed || 1) * 7919 + 13 + i, prof));
  const ev = {}, causes = {};
  let lastWave = -1, waveStart = 0, stuck = false;
  const limit = limitS / STEP;
  while (!W.over && W.n < limit) {
    W.players.forEach((p, i) => { p.input = ais[i].control(W, p); });
    step(W, STEP);
    for (const e of drainEvents(W)) { ev[e.k] = (ev[e.k] || 0) + 1; if (e.k === 'death') causes[e.cause] = (causes[e.cause] || 0) + 1; }
    const wk = W.mode === 'campaign' ? W.wave : W.waveN;
    if (wk !== lastWave) { lastWave = wk; waveStart = W.t; }
    if (W.t - waveStart > 300) { stuck = true; break; }
    if (W.n % 600 === 0 && bad(W)) throw new Error('NaN in world at tick ' + W.n);
  }
  return { W, ev, causes, stuck };
}

const t0 = Date.now();
console.log(`Lancewing smoke · ${runs} runs per sector · profile ${profile} · ${diff}`);
for (let s = 0; s < SECTORS.length; s++) {
  let clears = 0, bossT = 0, deaths = 0, time = 0;
  const why = {};
  for (let i = 0; i < runs; i++) {
    const r = play({ mode: 'campaign', sector: s, seed: 100 + i * 31 + s, up: TYPICAL_UP[s], lives: START_LIVES });
    if (r.stuck) { console.log(`  FAIL sector ${s + 1} seed ${100 + i * 31 + s}: wave ${r.W.wave} stuck (${r.W.phase}, ${r.W.riders.length} riders, ${r.W.cores.length} cores, ${r.W.portals.length} forming, toSpawn ${r.W.toSpawn})`); fail++; }
    if (r.W.result === 'clear') { clears++; time += r.W.secT; }
    bossT += r.W.stats.bossT; deaths += r.W.stats.deaths;
    for (const [k, v] of Object.entries(r.causes)) why[k] = (why[k] || 0) + v;
  }
  console.log(`  S${s + 1} ${SECTORS[s].name.padEnd(16)} clears ${clears}/${runs}  avg clear ${(clears ? time / clears : 0).toFixed(0)} s  deaths/run ${(deaths / runs).toFixed(1)}  boss time/run ${(bossT / runs).toFixed(0)} s  killed by ${JSON.stringify(why)}`);
}

// a chained campaign: lives and score carry over, salvage buys upgrades, a failed sector is retried
const ORDER = ['wing', 'armor', 'magnet', 'reach', 'wing', 'glide', 'armor', 'wing', 'reach', 'magnet'];
for (let c = 0; c < Math.max(1, Math.min(2, runs)); c++) {
  const up = {}; let score = 0, lives = START_LIVES, salvage = 0, tries = 0, s = 0, total = 0;
  while (s < SECTORS.length && tries < 12) {
    const r = play({ mode: 'campaign', sector: s, seed: 900 + c * 101 + tries * 7 + s, up, lives, score });
    total += r.W.t;
    if (r.W.result === 'clear') {
      salvage += Math.floor((r.W.score - score) / SALVAGE_DIV); score = r.W.score; lives = r.W.lives + 1;
      for (const k of ORDER) { const lv = up[k] || 0; if (lv < UPGRADES[k].max && salvage >= UP_COST[lv]) { salvage -= UP_COST[lv]; up[k] = lv + 1; } }
      s++;
    } else { tries++; lives = START_LIVES + 1; }
  }
  const ok = s >= SECTORS.length;
  if (!ok) fail++;
  console.log(`  chained campaign ${c + 1}: ${ok ? 'COMPLETE' : 'FAILED at sector ' + (s + 1)} · ${tries} retries · score ${score.toLocaleString()} · ${(total / 60).toFixed(1)} min · upgrades ${JSON.stringify(up)}`);
}
// endless and co-op for a while
{
  const r = play({ mode: 'endless', seed: 77 }, profile, 600);
  console.log(`  endless: ${r.W.over ? 'over' : 'alive'} after ${(r.W.fightT / 60).toFixed(1)} min, wave ${r.W.waveN + 1}, score ${r.W.score.toLocaleString()}, bosses ${r.W.bossN}`);
  const q = play({ mode: 'campaign', sector: 2, seed: 55, coop: true, up: TYPICAL_UP[2] });
  console.log(`  local co-op sector 3: ${q.W.result || 'running'} · wave ${q.W.wave} · deaths ${q.W.stats.deaths}`);
  if (q.stuck || r.stuck) fail++;
}
console.log(`${fail ? 'FAIL' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(fail ? 1 : 0);
