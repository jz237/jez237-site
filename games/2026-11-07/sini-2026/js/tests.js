// ?test=1 self-test page: determinism, exact replays, the difficulty ramp, the gentle start, the construct
// building / waking / dying, the autopilot reaching later sectors, the live loop with no console errors, no score posts.
import { makeWorld, step, drainEvents, STEP, cloneWorld, isAwake } from './sim.js?v=3';
import { Autopilot } from './ai.js?v=3';
import { RAMP, SECTORS, TYPICAL_UP, rampAt, deepLevel, DIFF_KEYS, applyDiff, MIN_WARN, TUTOR } from './config.js?v=3';
import { Recorder, Replay } from './replay.js?v=3';

export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.cp, W.phase, W.rs, W.players.map((p) => [p.x.toFixed(6), p.z.toFixed(6), p.alive, p.shield, p.bombs]),
  W.enemies.map((e) => [e.id, e.x.toFixed(4), e.z.toFixed(4), e.hp]), W.rocks.map((k) => [k.id, k.x.toFixed(4), k.ore]), W.crystals.length, W.bolts.length, W.bombs.length, W.C ? [W.C.st, W.C.pieces, W.C.hp, W.C.x.toFixed(4)] : 0]);
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

export async function runTests(sn) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>SINI 2026 · SELF TEST</b><br>';
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

  await T('instant replay reproduces a death or a construct kill exactly', () => {
    for (let seed = 1; seed < 30; seed++) {
      const W = makeWorld({ sector: 4, seed, up: TYPICAL_UP[4], cp: seed % 2 ? 2 : 0 });
      const rec = new Recorder(), ai = new Autopilot(seed, 'human');
      let keyN = -1, want = null, clip = null, kind = '';
      drive(W, ai, 300 / STEP, rec, (w, ev) => {
        const e = ev.find((q) => q.k === 'death' || q.k === 'ckill');
        if (keyN < 0 && e) { keyN = w.n; want = hashW(w); kind = e.k; }
        if (keyN > 0 && w.n >= keyN + Math.round(1.6 / STEP)) { clip = rec.clip(keyN); return false; }
        return true;
      });
      if (!clip) continue;
      const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
      let got = null, saw = false;
      while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === kind) && rp.W.n === keyN) { saw = true; got = hashW(rp.W); } }
      return { ok: saw && got === want, info: `seed ${seed}, ${kind} at tick ${keyN}: ${saw ? (got === want ? 'bit-exact' : 'state differs') : 'not seen in replay'}` };
    }
    return { ok: false, info: 'nothing found to replay' };
  });

  await T('difficulty ramp rises in small steps; warnings from 2 s+ down to ~0.7 s', () => {
    const pts = [];
    SECTORS.forEach((s, i) => { for (let k = 0; k < 3; k++) pts.push(rampAt(i, k)); });
    const issues = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      for (const k of ['rV', 'fire', 'boltV', 'reav', 'gath', 'gV', 'icpt']) if (b[k] < a[k] - 1e-9) issues.push(`${k} drops at ${i}`);
      for (const k of ['warn', 'aim', 'regen', 'selfT']) if (b[k] > a[k] + 1e-9) issues.push(`${k} rises at ${i}`);
      if (b.rV - a.rV > 1.6) issues.push(`speed spike at ${i}`);
      if (a.warn - b.warn > 0.36) issues.push(`warning spike at ${i}`);
    }
    if (RAMP[0].warn[0] < 2 || RAMP[0].pullTell < 2) issues.push('sector 1 warns under 2 s');
    if (Math.abs(RAMP[4].warn[1] - 0.7) > 0.05) issues.push('last warning is not ~0.7 s');
    if (RAMP[0].combo || RAMP[1].combo || RAMP[0].lunge || RAMP[1].lunge) issues.push('combined threats before sector 3');
    for (let i = 1; i < 5; i++) for (const k of ['kill', 'pieces', 'bossV', 'pull']) if (RAMP[i][k] < RAMP[i - 1][k]) issues.push(`${k} drops at S${i + 1}`);
    if (deepLevel(0) > 0.3 || deepLevel(60 * 5) > 2.3) issues.push('deep field ramps too fast');
    return { ok: !issues.length, info: issues.length ? issues.join(', ') : `15 checkpoints, reaver speed ${pts[0].rV}→${pts[14].rV}, warning ${pts[0].warn}→${pts[14].warn} s` };
  });

  await T('difficulty levels: each is harder than the last, warnings never under the floor', () => {
    const issues = [];
    SECTORS.forEach((s, i) => { for (let c = 0; c < 3; c++) {
      const R = DIFF_KEYS.map((d) => applyDiff(rampAt(i, c), d));
      for (let k = 1; k < R.length; k++) {
        if (R[k].rV < R[k - 1].rV || R[k].fire < R[k - 1].fire || R[k].kill < R[k - 1].kill || R[k].warn > R[k - 1].warn) issues.push(`${DIFF_KEYS[k]} not harder at S${i + 1}/${c}`);
        if (R[k].warn < MIN_WARN - 1e-9) issues.push(`${DIFF_KEYS[k]} warns ${R[k].warn.toFixed(2)} s`);
      }
    } });
    return { ok: !issues.length, info: issues.length ? issues.slice(0, 3).join(', ') : `${DIFF_KEYS.join(' < ')}, last warning ${applyDiff(rampAt(4, 2), 'nightmare').warn.toFixed(2)} s on Nightmare` };
  });

  await T(`no way to die in sector 1's first ${TUTOR.safe} s (even doing nothing)`, () => {
    const W = makeWorld({ sector: 0, seed: 7 });
    let hits = 0;
    for (let i = 0; i < TUTOR.safe / STEP; i++) { W.players[0].input = { mx: 0, mz: 0, fire: false, bomb: false }; step(W, STEP); for (const e of drainEvents(W)) if (e.k === 'death' || e.k === 'shield') hits++; }
    return { ok: hits === 0, info: `${hits} hits` };
  });

  await T('the construct builds, wakes, and a full rack brings it down', () => {
    const W = makeWorld({ sector: 0, seed: 21, bombs: 20, lives: 9, noTut: true });
    const seen = {};
    drive(W, new Autopilot(21, 'demo'), 420 / STEP, null, (w, ev) => { for (const e of ev) seen[e.k] = (seen[e.k] || 0) + 1; });
    const ok = seen.checkpoint >= 2 && seen.wake === 1 && seen.bombhit >= 1 && seen.ckill === 1 && W.result === 'clear';
    return { ok, info: `${seen.build || 0} plates fitted, ${seen.knock || 0} knocked, woke ${seen.wake ? 'yes' : 'no'}, ${seen.bombhit || 0} charge hits, ${W.result || 'still going'} at ${Math.round(W.secT)} s` };
  });

  await T('continuing from the AWAKE checkpoint starts with the construct awake and enough charges', () => {
    const W = makeWorld({ sector: 3, seed: 5, cp: 2, bombs: 1, up: TYPICAL_UP[3] });
    for (let i = 0; i < 4 / STEP; i++) { W.players[0].input = { mx: 0, mz: 0, fire: false, bomb: false }; step(W, STEP); drainEvents(W); }
    return { ok: isAwake(W.C) && W.players[0].bombs >= W.R.kill, info: `construct ${W.C.st}, rack ${W.players[0].bombs} / ${W.R.kill} needed` };
  });

  await T('demo autopilot clears the later sectors', async () => {
    let cleared = 0;
    const times = [];
    for (let s = 2; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 100 + s, up: TYPICAL_UP[s], lives: 3 });
      drive(W, new Autopilot(100 + s, 'demo'), 900 / STEP);
      if (W.result === 'clear') { cleared++; times.push(Math.round(W.secT) + ' s'); } else times.push('lost at checkpoint ' + W.cp);
      await wait(10);
    }
    return { ok: cleared >= 2, info: `sectors 3-5: ${times.join(', ')}` };
  });

  await T('live game: demo runs 600 frames with no console errors', async () => {
    sn.startDemo();
    sn.tick(600, 1 / 60);
    const W = sn.G.W;
    const errs = (window.__snErrors || []).filter((e) => !/favicon|fonts\.g/.test(e));
    sn.toTitle();
    return { ok: errs.length === 0 && W && W.n > 0, info: errs.length ? errs.slice(0, 3).join(' | ') : `sim ticks ${W.n}, ${W.stats.crystals} crystals, construct ${W.C ? W.C.st : 'gone'}` };
  });

  await T('tests never post scores', () => ({ ok: sn.noPost === true, info: 'score posting disabled on this page' }));

  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} passed</b>`;
  window.__snTests = { done: true, results, pass, total: results.length };
  return window.__snTests;
}
