// Exact instant replays (Node, no browser): records runs exactly the way the game loop does (Recorder.tick
// before the controls, Recorder.input after them, then step), keeps a clip for every death and boss kill,
// and re-runs each clip with the Replay class the game uses. The WHOLE world (every field, every double;
// worldSig) must equal the live world at the key tick and again at the end of the clip. Covers every
// sector, the boss webs, both autopilot profiles, all difficulty levels and ENDLESS DESCENT.
//   node scripts/rimstorm/replay_check.mjs [seeds=10]
import { makeWorld, step, drainEvents, STEP, cloneWorld } from '../../games/2026-11-06/rimstorm/js/sim.js?v=7';
import { Autopilot } from '../../games/2026-11-06/rimstorm/js/ai.js?v=7';
import { TYPICAL_UP, WEBS, DIFF_KEYS } from '../../games/2026-11-06/rimstorm/js/config.js?v=7';
import { Recorder, Replay, worldSig } from '../../games/2026-11-06/rimstorm/js/replay.js?v=7';

const seeds = +(process.argv[2] || 10);
let ok = 0, bad = 0, total = 0, deaths = 0, kills = 0;
const t0 = Date.now();
for (let seed = 1; seed <= seeds; seed++) {
  const endless = seed % 5 === 0;
  const s = (seed - 1) % 5, diff = DIFF_KEYS[seed % DIFF_KEYS.length];
  const W = endless ? makeWorld({ mode: 'endless', seed, diff, lives: 6 }) : makeWorld({ sector: s, seed, up: TYPICAL_UP[s], web: seed % 2 ? WEBS : seed % 3, diff, lives: 4 });
  const rec = new Recorder(), ai = new Autopilot(seed * 13 + 5, seed % 3 ? 'human' : 'demo');
  const keys = [];
  for (let i = 0; i < 360 / STEP && !W.over; i++) {
    rec.tick(W);
    W.players[0].input = ai.control(W, W.players[0]);
    rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    for (const e of ev) if (e.k === 'death' || e.k === 'bosskill') keys.push({ n: W.n, k: e.k, sig: worldSig(W), clip: null, endSig: null });
    for (const q of keys) {
      if (!q.clip && W.n >= q.n + Math.round(1.6 / STEP)) q.clip = rec.clip(q.n);
      if (q.clip && !q.endSig && W.n === q.clip.endN) q.endSig = worldSig(W);
    }
  }
  for (const q of keys) {
    if (!q.clip) continue;
    total++;
    if (q.k === 'death') deaths++; else kills++;
    const rp = new Replay(cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
    let atKey = null, atEnd = null, sawEvent = false;
    for (let guard = 0; !rp.done && guard < 20000; guard++) {
      const ev = rp.advance(STEP, (R) => { if (R.n === q.n) atKey = worldSig(R); if (R.n === q.clip.endN) atEnd = worldSig(R); });
      if (rp.W.n >= q.n && ev.some((e) => e.k === q.k)) sawEvent = true;
    }
    const good = atKey === q.sig && sawEvent && (!q.endSig || atEnd === q.endSig);
    if (good) ok++; else { bad++; console.log(`  seed ${seed} ${endless ? 'endless' : 'S' + (s + 1)} ${diff} ${q.k} at tick ${q.n}: ${atKey === q.sig ? 'key ok' : 'KEY DIFFERS'}, ${!q.endSig || atEnd === q.endSig ? 'end ok' : 'END DIFFERS'}, event ${sawEvent ? 'seen' : 'MISSING'}`); }
  }
}
console.log(`replays: ${ok} / ${total} bit-exact over the whole world (${deaths} deaths, ${kills} boss kills) in ${((Date.now() - t0) / 1000).toFixed(1)} s${bad ? `, ${bad} differ` : ''}`);
process.exit(bad || total < 3 ? 1 : 0);
