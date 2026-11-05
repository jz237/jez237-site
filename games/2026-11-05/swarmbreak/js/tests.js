// ?test=1 self-test page: determinism, exact replays, the difficulty ramp, the gentle start, the autopilot
// reaching later sectors, the live game loop running without console errors, and no score posts.
import { makeWorld, step, drainEvents, STEP, cloneWorld } from './sim.js?v=1';
import { Autopilot } from './ai.js?v=1';
import { RAMP, SECTORS, WAVES, TYPICAL_UP, rampAt, standLevel } from './config.js?v=1';
import { Recorder, Replay } from './replay.js?v=1';

export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.wave, W.phase, W.rs, W.players.map((p) => [p.x.toFixed(6), p.z.toFixed(6), p.alive, p.shield]), W.enemies.map((e) => [e.id, e.x.toFixed(4), e.z.toFixed(4), e.hp]), W.bolts.length, W.survivors.length]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function drive(W, ai, ticks, rec, onTick) {
  for (let i = 0; i < ticks && !W.over; i++) {
    if (rec) rec.tick(W);
    const P = W.players[0];
    P.input = ai.control(W, P);
    if (rec) rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    if (onTick && onTick(W, ev) === false) break;
  }
}

export async function runTests(sb) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>SWARMBREAK · SELF TEST</b><br>';
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
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2] }); drive(W, new Autopilot(9, 'human'), 60 / STEP, new Recorder()); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'identical after 60 s' : 'worlds differ' };
  });

  await T('instant replay reproduces a death exactly', () => {
    for (let seed = 1; seed < 40; seed++) {
      const W = makeWorld({ sector: 4, seed, up: TYPICAL_UP[4] });
      const rec = new Recorder(), ai = new Autopilot(seed, 'human');
      let keyN = -1, want = null, clip = null;
      drive(W, ai, 400 / STEP, rec, (w, ev) => {
        if (keyN < 0 && ev.some((e) => e.k === 'death')) { keyN = w.n; want = hashW(w); }
        if (keyN > 0 && w.n >= keyN + Math.round(1.6 / STEP)) { clip = rec.clip(keyN); return false; }
        return true;
      });
      if (!clip) continue;
      const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
      let got = null, saw = false;
      while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === 'death') && rp.W.n === keyN) { saw = true; got = hashW(rp.W); } }
      return { ok: saw && got === want, info: `seed ${seed}, death at tick ${keyN}: ${saw ? (got === want ? 'bit-exact' : 'state differs') : 'no death in replay'}` };
    }
    return { ok: false, info: 'no death found to replay' };
  });

  await T('difficulty ramp rises in small steps and the warning ends near 0.7 s', () => {
    const pts = [];
    SECTORS.forEach((s, i) => { for (let k = 0; k < WAVES; k++) pts.push(rampAt(i, k)); });
    const issues = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      for (const k of ['spd', 'fire', 'boltV', 'count']) if (b[k] < a[k] - 1e-9) issues.push(`${k} drops at ${i}`);
      if (b.warn > a.warn + 1e-9) issues.push(`warning grows at ${i}`);
      if (b.spd - a.spd > 0.07) issues.push(`speed spike at ${i}`);
      if (a.warn - b.warn > 0.12) issues.push(`warning spike at ${i}`);
    }
    if (RAMP[0].warn[0] < 2) issues.push('sector 1 warns under 2 s');
    if (Math.abs(RAMP[4].warn[1] - 0.7) > 0.05) issues.push('last warning is not ~0.7 s');
    if (RAMP[0].combo[1] > 0 || RAMP[1].combo[1] > 0) issues.push('combined threats before sector 3');
    if (RAMP[0].group[0] !== 1) issues.push('sector 1 does not start one at a time');
    if (standLevel(0) > 0.3 || standLevel(60 * 5) > 2.5) issues.push('last stand ramps too fast');
    return { ok: !issues.length, info: issues.length ? issues.join(', ') : `${pts.length} waves, speed ${pts[0].spd}→${pts[pts.length - 1].spd.toFixed(2)}, warning ${pts[0].warn}→${pts[pts.length - 1].warn.toFixed(2)} s` };
  });

  await T('no way to die in sector 1’s first 30 s (even doing nothing)', () => {
    const W = makeWorld({ sector: 0, seed: 7 });
    let hits = 0;
    for (let i = 0; i < 30 / STEP; i++) { W.players[0].input = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, pulse: false }; step(W, STEP); for (const e of drainEvents(W)) if (e.k === 'death' || e.k === 'shield') hits++; }
    return { ok: hits === 0, info: `${hits} hits` };
  });

  await T('demo autopilot clears the later sectors', async () => {
    let cleared = 0;
    const times = [];
    for (let s = 2; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 100 + s, up: TYPICAL_UP[s], lives: 3 });
      drive(W, new Autopilot(100 + s, 'demo'), 1200 / STEP);
      if (W.result === 'clear') { cleared++; times.push(Math.round(W.t) + ' s'); } else times.push('lost at ' + (W.wave >= WAVES ? 'boss' : 'wave ' + (W.wave + 1)));
      await wait(10);
    }
    return { ok: cleared >= 2, info: `sectors 3-5: ${times.join(', ')}` };
  });

  await T('live game: demo runs 600 frames with no console errors', async () => {
    sb.startDemo();
    sb.tick(600, 1 / 60);
    const W = sb.G.W;
    const errs = (window.__sbErrors || []).filter((e) => !/favicon|fonts\.g/.test(e));
    sb.toTitle();
    return { ok: errs.length === 0 && W && W.n > 0, info: errs.length ? errs.slice(0, 3).join(' | ') : `sim ticks ${W.n}, ${W.stats.kills} machines scrapped` };
  });

  await T('tests never post scores', () => ({ ok: sb.noPost === true, info: 'score posting disabled on this page' }));

  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} passed</b>`;
  window.__sbTests = { done: true, results, pass, total: results.length };
  return window.__sbTests;
}
