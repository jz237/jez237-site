// ?test=1 self-test page: determinism, exact replays, the gentle start, the difficulty ramp shape, lifters taking
// and fusing settlers, the carrier fight, the live loop with no console errors and no score posts, and the title
// screen naming every gunship, machine and carrier with its picture drawn.
import { makeWorld, step, drainEvents, STEP, settlersLeft } from './sim.js?v=15';
import { Autopilot } from './ai.js?v=15';
import { RAMP, SECTORS, TYPICAL_UP, rampAt, endlessLevel, DIFF_KEYS, applyDiff, MIN_WARN, TUTOR, WAVES, SHIPS, SHIP_KEYS } from './config.js?v=15';
import { Recorder, Replay } from './replay.js?v=15';

export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.cp, W.phase, W.rs, W.players.map((p) => [p.x.toFixed(6), p.y.toFixed(6), p.alive, p.shield, p.nova]),
  W.enemies.map((e) => [e.id, e.type, e.x.toFixed(4), e.y.toFixed(4), e.hp]), W.settlers.map((s) => [s.id, s.st, s.x.toFixed(4), s.y.toFixed(4)]), W.bolts.length, W.boss ? [W.boss.st, W.boss.x.toFixed(4), W.boss.nodes.map((n) => n.hp).join()] : 0]);
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

export async function runTests(sh) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>SKYHOLD 2026 · SELF TEST</b><br>';
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
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2], noTut: true }); drive(W, new Autopilot(9, 'human'), 60 / STEP, new Recorder()); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'identical after 60 s' : 'worlds differ' };
  });
  await T('instant replay reproduces the moments before a death exactly', () => {
    for (let seed = 1; seed < 30; seed++) {
      const W = makeWorld({ sector: 4, seed, up: TYPICAL_UP[4], noTut: true, cp: 3 }), rec = new Recorder();
      let dn = -1;
      drive(W, new Autopilot(seed, 'human'), 200 / STEP, rec, (w, ev) => { if (ev.some((e) => e.k === 'death')) { dn = w.n; return false; } });
      if (dn < 0) continue;
      for (let i = 0; i < 1.7 / STEP && !W.over; i++) { rec.tick(W); W.players[0].input = { mx: 0, my: 0, fire: false, nova: false, blink: false }; rec.input(W); step(W, STEP); drainEvents(W); }
      const c = rec.clip(dn);
      const Rp = new Replay(structuredClone(c.snap), c.inputs, c.keyN, c.endN);
      let saw = false;
      while (!Rp.done) for (const e of Rp.advance(STEP)) if (e.k === 'death' && Rp.W.n === dn) saw = true;
      return { ok: saw, info: saw ? `seed ${seed}, death at tick ${dn} replayed` : 'the replay did not reproduce the death' };
    }
    return { ok: false, info: 'no death found to replay' };
  });
  await T('the first half minute of world 1 is safe, and machines come with warnings', () => {
    const W = makeWorld({ sector: 0, seed: 77 });
    let hits = 0, warp = 0, firstAt = -1;
    for (let i = 0; i < TUTOR.safe / STEP; i++) {
      W.players[0].input = { mx: 0, my: 0, fire: false, nova: false, blink: false };
      step(W, STEP);
      for (const e of drainEvents(W)) { if (e.k === 'shield' || e.k === 'death') hits++; if (e.k === 'warpin') { warp = Math.max(warp, e.T); if (firstAt < 0) firstAt = W.t; } }
    }
    return { ok: hits === 0 && warp >= 2 && firstAt > 3, info: `hits ${hits}, first machine at ${firstAt.toFixed(1)} s with ${warp.toFixed(1)} s warp-in` };
  });
  await T('the RAMP climbs gently and only the last world reaches ~0.7 s warning', () => {
    let ok = true; const notes = [];
    for (let s = 0; s < RAMP.length; s++) {
      const a = rampAt(s, 0), b = rampAt(s, WAVES - 1);
      if (b.warn > a.warn + 1e-9 || b.lV < a.lV) { ok = false; notes.push(`S${s + 1} not rising`); }
      if (s && rampAt(s - 1, WAVES - 1).warn + 0.05 < a.warn) { ok = false; notes.push(`S${s + 1} warns longer than S${s}`); }
      if (s < 4 && b.warn < 1.0) { ok = false; notes.push(`S${s + 1} warn too short`); }
    }
    for (const d of DIFF_KEYS) if (applyDiff(rampAt(4, 3), d).warn < MIN_WARN) { ok = false; notes.push(d + ' warn below min'); }
    const combos = RAMP.map((r) => r.husks[1]);
    // world 1 has no husks; world 2 meets its first one only in its last wave (so every machine is met by then)
    if (combos[0] || combos[1] > 1 || RAMP[1].husks[0]) { ok = false; notes.push('combined threats too early'); }
    return { ok, info: notes.join(', ') || `warn ${rampAt(0, 0).warn}s → ${rampAt(4, 3).warn}s, endless level after 10 min ${endlessLevel(600).toFixed(2)}` };
  });
  await T('a lifter left alone carries a settler away and fuses into a husk', () => {
    const W = makeWorld({ sector: 2, seed: 5, noTut: true });
    W.players[0].alive = false; W.players[0].deadT = 1e9; W.lives = 99;
    let fused = 0, lifted = 0;
    for (let i = 0; i < 120 / STEP && !fused; i++) { step(W, STEP); for (const e of drainEvents(W)) { if (e.k === 'fuse') fused++; if (e.k === 'lifted') lifted++; } }
    return { ok: fused > 0 && lifted > 0, info: `lifted ${lifted}, fused ${fused}, settlers left ${settlersLeft(W)}` };
  });
  await T('the autopilot clears world 1 including the carrier', () => {
    const W = makeWorld({ sector: 0, seed: 21, up: {} });
    drive(W, new Autopilot(21, 'demo'), 600 / STEP);
    return { ok: W.result === 'clear', info: `${W.result || 'unfinished'} in ${W.secT.toFixed(0)} s, ${W.stats.deaths} ships lost, ${W.stats.lost} settlers lost` };
  });
  await T('the live game runs (demo) with no console errors and no score posts', async () => {
    sh.startDemo();
    sh.tick(600, 1 / 60, false);
    sh.tick(1, 1 / 60, true);
    const errs = (window.__shErrors || []).filter((e) => !/favicon|fonts/.test(e));
    const ok = errs.length === 0 && sh.noPost && sh.G.W.n > 0;
    sh.toTitle();
    return { ok, info: errs.length ? errs.slice(0, 3).join(' | ') : `ran ${sh.G.W ? 'ok' : ''}, scores blocked: ${sh.noPost}` };
  });
  await T('the title screen names every gunship, machine and carrier, each one drawn', async () => {
    sh.toTitle();
    await sh.enemyDrawn();
    // a drawn model covers a good part of its picture; an empty or failed one is clear
    const drawn = (t) => { const c = t.querySelector('canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) n++; return n > c.width * c.height * 0.04; };
    const check = (sel, want) => { const tiles = [...document.querySelectorAll(sel)], names = tiles.map((t) => t.querySelector('b').textContent); return { ok: names.length === want && names.every(Boolean) && tiles.every(drawn), names, n: tiles.filter(drawn).length }; };
    const g = check('#gs-grid .gs', SHIP_KEYS.length), m = check('#en-machines .en', 12), c = check('#en-carriers .en', SECTORS.length);
    const want = SHIP_KEYS.map((k) => SHIPS[k].name).join();
    const shown = !document.getElementById('title-side').closest('.hidden');
    return { ok: shown && g.ok && g.names.join() === want && m.ok && c.ok, info: `gunships ${g.n}/${SHIP_KEYS.length} (${g.names.join(', ')}), machines ${m.n}/12, carriers ${c.n}/${SECTORS.length} drawn${shown ? '' : ' · HIDDEN'}` };
  });
  void SECTORS;
  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} PASSED</b>`;
  window.__testResults = results;
  return results;
}
