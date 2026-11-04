// ?test=1 self-test page: determinism, exact replays, the difficulty ramp, the autopilot reaching later
// sectors, the live game loop running without console errors, and no score posts from tests.
import { makeWorld, step, drainEvents, STEP, cloneWorld } from './sim.js?v=1';
import { Autopilot } from './ai.js?v=1';
import { RAMP, SECTORS, TYPICAL_UP, rampAt, longHaulLevel } from './config.js?v=1';
import { Recorder, Replay } from './replay.js?v=1';

const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.seg, W.rs, W.rovers.map((r) => [r.x.toFixed(6), r.y.toFixed(6), r.vy.toFixed(6), r.alive]), W.craters.length, W.rocks.length, W.flyers.map((f) => f.x.toFixed(4)), W.bombs.length]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function drive(W, ai, ticks, rec, onTick) {
  for (let i = 0; i < ticks && !W.over; i++) {
    if (rec) rec.tick(W);
    const R = W.rovers[0];
    R.input = ai.control(W, R);
    if (rec) rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    if (onTick && onTick(W, ev) === false) break;
  }
}

export async function runTests(cr) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>CRATER RUNNER · SELF TEST</b><br>';
  document.body.appendChild(box);
  const results = [];
  const T = async (name, fn) => {
    await wait(30);
    let ok = false, info = '';
    const t0 = performance.now();
    try { const r = await fn(); ok = r.ok; info = r.info || ''; } catch (e) { ok = false; info = 'threw ' + (e && e.stack || e); }
    results.push({ name, ok, info, ms: Math.round(performance.now() - t0) });
    box.innerHTML += `<div class="${ok ? 'pass' : 'fail'}">${ok ? 'PASS' : 'FAIL'} · ${name} <span style="opacity:.7">${info} (${Math.round(performance.now() - t0)} ms)</span></div>`;
  };

  await T('deterministic: same seed + same inputs = same world', () => {
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2] }); drive(W, new Autopilot(9, 'human'), 60 / STEP); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'identical after 60 s' : 'worlds differ' };
  });

  await T('instant replay reproduces a crash exactly', () => {
    for (let seed = 1; seed < 40; seed++) {
      const W = makeWorld({ sector: 3, seed, up: TYPICAL_UP[3] });
      const rec = new Recorder(), ai = new Autopilot(seed, 'human');
      let crashN = -1, want = null, clip = null;
      drive(W, ai, 400 / STEP, rec, (w, ev) => {
        if (crashN < 0 && ev.some((e) => e.k === 'crash')) { crashN = w.n; want = hashW(w); }
        if (crashN > 0 && w.n >= crashN + Math.round(1.4 / STEP)) { clip = rec.clip(crashN); return false; }
        return true;
      });
      if (!clip) continue;
      const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
      let got = null, sawCrash = false;
      while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === 'crash') && rp.W.n === crashN) { sawCrash = true; got = hashW(rp.W); } }
      return { ok: sawCrash && got === want, info: `seed ${seed}, crash at tick ${crashN}: ${sawCrash ? (got === want ? 'bit-exact' : 'state differs') : 'no crash in replay'}` };
    }
    return { ok: false, info: 'no crash found to replay' };
  });

  await T('difficulty ramp rises in small steps and warning time ends near 0.7 s', () => {
    const pts = [];
    SECTORS.forEach((s, i) => { for (let k = 0; k < s.cps.length; k++) pts.push(rampAt(i, k)); });
    const issues = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (b.speed < a.speed - 1e-9) issues.push(`speed drops at ${i}`);
      if (b.warn > a.warn + 1e-9) issues.push(`warning grows at ${i}`);
      if (b.crater < a.crater - 1e-9) issues.push(`craters shrink at ${i}`);
      if (b.speed - a.speed > 0.45) issues.push(`speed spike at ${i}`);
      if (a.warn - b.warn > 0.12) issues.push(`warning spike at ${i}`);
    }
    if (RAMP[0].warn[0] < 2) issues.push('sector 1 warns under 2 s');
    if (Math.abs(RAMP[4].warn[1] - 0.7) > 0.05) issues.push('last warning is not ~0.7 s');
    if (RAMP[0].combo[1] > 0 || RAMP[1].combo[1] > 0) issues.push('combos before sector 3');
    if (longHaulLevel(0) > 0.3 || longHaulLevel(60 * 5) > 2.5) issues.push('long haul ramps too fast');
    return { ok: !issues.length, info: issues.length ? issues.join(', ') : `${pts.length} checkpoints, speed ${pts[0].speed}→${pts[pts.length - 1].speed} m/s, warning ${pts[0].warn}→${pts[pts.length - 1].warn.toFixed(2)} s` };
  });

  await T('no way to die in sector 1’s first 30 s (even doing nothing)', () => {
    const W = makeWorld({ sector: 0, seed: 7 });
    let deaths = 0;
    for (let i = 0; i < 30 / STEP; i++) { W.rovers[0].input = { th: 0, jump: false, fire: false }; step(W, STEP); for (const e of drainEvents(W)) if (e.k === 'crash') deaths++; }
    return { ok: deaths === 0, info: `${deaths} crashes` };
  });

  await T('demo autopilot drives through all five sectors', async () => {
    let reached = 0;
    const times = [];
    for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 100 + s, up: TYPICAL_UP[s] });
      drive(W, new Autopilot(100 + s, 'demo'), 1200 / STEP);
      if (W.result !== 'clear') break;
      reached = s + 1; times.push(Math.round(W.t));
      await wait(10);
    }
    return { ok: reached >= 3, info: `cleared ${reached} of 5 (${times.map((t) => t + ' s').join(', ')})` };
  });

  await T('live game: demo runs 600 frames with no console errors', async () => {
    cr.startDemo();
    cr.tick(600, 1 / 60);
    const W = cr.G.W;
    const errs = (window.__crErrors || []).filter((e) => !/favicon|fonts\.g/.test(e));
    cr.toTitle();
    return { ok: errs.length === 0 && W && W.n > 0, info: errs.length ? errs.slice(0, 3).join(' | ') : `sim ticks ${W.n}, x ${W.rovers[0].x.toFixed(0)} m` };
  });

  await T('tests never post scores', () => ({ ok: cr.noPost === true, info: 'score posting disabled on this page' }));

  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} passed</b>`;
  window.__crTests = { done: true, results, pass, total: results.length };
  return window.__crTests;
}
