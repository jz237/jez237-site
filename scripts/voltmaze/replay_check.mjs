// Exact instant replays: records autopilot runs the way the game does (Recorder.tick before the controls,
// Recorder.input right before step) and re-runs every death and boss kill from its saved clip; the world
// must match bit for bit at the key tick, a clip must replay the same way twice (the game lets you watch
// it from the results and the pause screen), and a replay must never change the clip it came from.
// Covers normal rooms, boss rooms (every sector), endless floors, every difficulty, both autopilots, and
// a clip cut short by the end of the run (the game takes the clip when the world ends).
//   node scripts/voltmaze/replay_check.mjs [seeds=10]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-06/voltmaze/js/sim.js?v=7';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=7';
import { TYPICAL_UP, DIFF_KEYS } from '../../games/2026-11-06/voltmaze/js/config.js?v=7';
import { Recorder, Replay } from '../../games/2026-11-06/voltmaze/js/replay.js?v=7';
import { hashW } from '../../games/2026-11-06/voltmaze/js/tests.js?v=7';

const seeds = +(process.argv[2] || 10);
const AFTER = Math.round(1.6 / STEP);
let total = 0, exact = 0, twice = 0, intact = 0, short = 0;
const kinds = { death: 0, bosskill: 0 };
const fails = [];

function replayTo(clip, keyN, kind) {
  const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
  let got = null, guard = 0;
  while (!rp.done && guard++ < 100000) { const ev = rp.advance(STEP); if (rp.W.n === keyN && ev.some((e) => e.k === kind)) got = hashW(rp.W); }
  return got;
}
function run(label, cfg, prof, seconds) {
  const W = makeWorld(cfg);
  const rec = new Recorder(), ai = new Autopilot(cfg.seed * 3 + 1, prof);
  const keys = [];
  for (let i = 0; i < seconds / STEP && !W.over; i++) {
    rec.tick(W);
    W.players[0].input = ai.control(W, W.players[0]);
    rec.input(W);
    step(W, STEP);
    for (const e of drainEvents(W)) if (e.k === 'death' || e.k === 'bosskill') keys.push({ n: W.n, k: e.k, h: hashW(W) });
    for (const q of keys) if (!q.clip && (W.n >= q.n + AFTER || W.over)) { q.clip = rec.clip(q.n); q.short = W.n < q.n + AFTER; }
  }
  for (const q of keys) {
    if (!q.clip) continue;
    total++; kinds[q.k]++;
    if (q.short) short++;
    const before = hashW(q.clip.snap);
    const a = replayTo(q.clip, q.n, q.k), b = replayTo(q.clip, q.n, q.k);
    if (a === q.h) exact++; else fails.push(`${label} ${q.k} at tick ${q.n}: replay differs`);
    if (a === b) twice++; else fails.push(`${label} ${q.k} at tick ${q.n}: two replays differ`);
    if (hashW(q.clip.snap) === before) intact++; else fails.push(`${label}: replay changed its clip`);
  }
  return keys.length;
}

for (let seed = 1; seed <= seeds; seed++) {
  const s = (seed - 1) % 5, diff = DIFF_KEYS[seed % DIFF_KEYS.length];
  const prof = seed % 3 === 0 ? 'demo' : 'human';
  // normal rooms (a few rooms in, so the clip has robots, bolts and mines in it)
  run(`S${s + 1} rooms seed ${seed} ${diff} ${prof}`, { sector: s, seed: 300 + seed, up: TYPICAL_UP[s], noTut: true, room: seed % 3, diff, lives: 4 }, prof, 240);
  // the boss room: boss kills and deaths under boss attacks
  run(`S${s + 1} boss seed ${seed} ${diff}`, { sector: s, seed: 500 + seed, up: TYPICAL_UP[s], noTut: true, boss: true, diff, lives: 6 }, seed % 2 ? 'demo' : 'human', 200);
}
// endless floors, and a one-life run whose last death ends the world (the clip is cut at the end)
for (let seed = 1; seed <= Math.max(2, seeds / 3); seed++) run(`endless seed ${seed}`, { mode: 'endless', seed: 900 + seed, noTut: true, lives: 4, boss: seed % 2 === 0 }, 'human', 240);
for (let seed = 1; seed <= 4; seed++) run(`last life seed ${seed}`, { sector: 4, seed: 1200 + seed, up: TYPICAL_UP[4], noTut: true, room: 2, lives: 1, diff: 'nightmare' }, 'human', 240);

for (const f of fails.slice(0, 20)) console.log('FAIL ', f);
console.log(`replays: ${exact} / ${total} bit-exact at the key tick (${kinds.death} deaths, ${kinds.bosskill} boss kills, ${short} clips cut short by the end of the run)`);
console.log(`same clip replayed twice: ${twice} / ${total} identical · clip untouched by its replay: ${intact} / ${total}`);
const ok = total > 0 && exact === total && twice === total && intact === total && kinds.bosskill > 0 && kinds.death > 0;
console.log(ok ? 'replay check passed' : 'replay check FAILED');
process.exit(ok ? 0 : 1);
