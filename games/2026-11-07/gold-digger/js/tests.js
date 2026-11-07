// ?test=1 self-test: determinism, exact replays, level generation, the difficulty ramp, every boss can be hurt,
// every biome renders without errors and without new shader programs after warm-up.
import { RAMP, DEPTHS, LEVELS, rampAt, STEP, BIOMES } from './config.js?v=3';
import { makeWorld, step, drainEvents, cloneWorld } from './sim.js?v=3';
import { Autopilot } from './ai.js?v=3';
import { Recorder, Replay } from './replay.js?v=3';
import { buildNav, validateLevel } from './nav.js?v=3';
import { bossHit } from './boss.js?v=3';

const hashW = (W) => { const P = W.players[0]; let h = 0; const s = `${P.x.toFixed(5)}|${P.y.toFixed(5)}|${P.hp}|${P.oil.toFixed(3)}|${W.score}|${W.n}|${W.bats.map((b) => b.x.toFixed(3) + b.st).join()}|${W.loot.filter((l) => l.got).length}|${W.M.tiles.reduce((a, t, i) => (a + t * (i % 97)) | 0, 0)}`; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };

export async function run(ctx) {
  const out = []; const log = document.createElement('div'); log.id = 'testlog'; document.body.appendChild(log);
  const res = (name, ok, info = '') => { out.push({ name, ok, info }); log.innerHTML += `<div class="${ok ? 'pass' : 'fail'}">${ok ? 'PASS' : 'FAIL'} ${name} <small>${info}</small></div>`; };
  const wait = () => new Promise((r) => setTimeout(r, 0));
  window.__gdTests = { done: false, results: out };
  try {
    // 1. determinism: the same seed and the same autopilot give the same world
    const play = (seed, secs) => { const W = makeWorld({ seed, depth: 1, level: 1 }); const ap = new Autopilot('human', 5); for (let i = 0; i < secs / STEP; i++) { W.players[0].input = ap.control(W); step(W); drainEvents(W); } return W; };
    const a = play(77, 25), b = play(77, 25);
    res('determinism: two runs of the same level match', hashW(a) === hashW(b), `t=${a.t.toFixed(1)} score ${a.score}`);
    await wait();
    // 2. exact replay of a recorded clip
    {
      const W = makeWorld({ seed: 91, depth: 0, level: 1 }); const ap = new Autopilot('demo', 3); const rec = new Recorder();
      let snapAt = null;
      for (let i = 0; i < 30 / STEP; i++) { W.players[0].input = ap.control(W); rec.tick(W); rec.input(W); step(W); drainEvents(W); if (i === Math.round(24 / STEP)) snapAt = { n: W.n, h: hashW(W) }; }
      const clip = rec.clip(snapAt.n, 4, 0);
      const R = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.keyN);
      while (!R.done) R.advance(STEP * 4);
      res('replay: a clip reproduces the live run exactly', R.W.n === snapAt.n && hashW(R.W) === snapAt.h, `tick ${snapAt.n}`);
    }
    await wait();
    // 3. levels: every depth and level generates, validates and has an exit, camps and finds
    let bad = 0, n = 0;
    for (let d = 0; d < DEPTHS; d++) for (let l = 0; l < LEVELS; l++) for (let s = 1; s <= 3; s++) { const W = makeWorld({ seed: s * 1013 + d, depth: d, level: l }); n++; if (!validateLevel(W.M) || !W.M.exit || !W.finds.length) bad++; }
    res('levels: all depths generate valid, reachable levels', bad === 0, `${n} levels, ${bad} bad`);
    for (let k = 0; k < 6; k++) { const W = makeWorld({ seed: 3 + k, mode: 'endless', endlessN: k * 4 }); if (!validateLevel(W.M)) bad++; }
    res('levels: the Endless Deep generates valid levels', bad === 0, '6 strata');
    await wait();
    // 4. the ramp: warnings shrink and threats grow depth by depth (never a sudden jump back)
    let mono = true; const keys = ['batWarn', 'stalWarn', 'geyWarn', 'bossWarn'];
    for (const k of keys) { let prev = 99; for (let d = 0; d < DEPTHS; d++) for (let l = 0; l < LEVELS; l++) { const v = rampAt(d, l)[k]; if (v > prev + 1e-9) mono = false; prev = v; } }
    for (const k of ['batSpeed', 'bats', 'crawlers', 'oilDrain', 'bossHP']) { let prev = -1; for (let d = 0; d < DEPTHS; d++) for (let l = 0; l < LEVELS; l++) { const v = rampAt(d, l)[k]; if (v < prev - 1e-9) mono = false; prev = v; } }
    res('ramp: every RAMP row rises (or warnings shrink) step by step', mono, `D1 bat warning ${rampAt(0, 0).batWarn}s -> D5 ${rampAt(4, 2).batWarn}s`);
    res('ramp: depth 1 warns at least ~2 s before threats', rampAt(0, 0).batWarn >= 1.9 && rampAt(0, 0).stalWarn >= 1.9 && rampAt(0, 0).bossWarn >= 1.9, '');
    // 5. bosses: each one wakes and can be hurt
    for (let d = 0; d < DEPTHS; d++) {
      const W = makeWorld({ seed: 5, depth: d, level: LEVELS });
      const ap = new Autopilot('demo', 2);
      for (let i = 0; i < 12 / STEP; i++) { W.players[0].input = ap.control(W); step(W); drainEvents(W); }
      const B = W.boss; const hp0 = B.hp;
      B.vuln = 1; B.hidden = false;
      bossHit(W, B, B.weak.x, B.weak.y, 'pick', 1, { ev: () => {}, addScore: () => 0, killBat: () => {} });
      res(`boss ${BIOMES[d].bossName}: wakes and takes damage`, B.awake && B.hp < hp0, `hp ${hp0} -> ${B.hp}`);
    }
    await wait();
    // 6. render every biome and a boss; no errors, no new shader programs after the first pass
    const R = ctx.R;
    const progs = () => R.r.info.programs.length;
    const shots = [[0, 0], [1, 1], [2, 2], [3, 0], [4, 1], [0, 3], [2, 3]];
    for (const [d, l] of shots) { ctx.startCampaign(d, { level: l, auto: 'demo', seed: 11 }); for (let i = 0; i < 30; i++) ctx.tick(1 / 60); await wait(); }
    const p0 = progs();
    for (const [d, l] of shots) { ctx.startCampaign(d, { level: l, auto: 'demo', seed: 12 }); for (let i = 0; i < 30; i++) ctx.tick(1 / 60); await wait(); }
    res('render: every depth and two bosses draw; no new shader programs on a second pass', progs() === p0, `${p0} programs`);
    res('no console errors', !(window.__gdErrors || []).length, (window.__gdErrors || []).slice(0, 3).join(' | '));
  } catch (e) { res('test run crashed', false, e.stack || e.message); }
  window.__gdTests.done = true;
  log.innerHTML += `<div>${out.every((r) => r.ok) ? '<b class="pass">ALL PASS</b>' : '<b class="fail">FAILURES</b>'}</div>`;
}
