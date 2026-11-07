// Determinism check: the same seed + the same inputs must give the same world bit for bit, a world cloned
// mid-run (structuredClone, as replays and online use) must carry on exactly like the original, and an
// instant replay of a death or a boss kill must reproduce the moment exactly.
//   node scripts/lancewing/determinism.mjs [seeds=6]
import { SIM, AI, CFG, REP } from './_game.mjs';
const { makeWorld, step, drainEvents, STEP, cloneWorld } = SIM;
const { Autopilot } = AI;
const { TYPICAL_UP } = CFG;
const { Recorder, Replay } = REP;

const seeds = +(process.argv[2] || 6);
export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.wave, W.waveN, W.phase, W.rs, W.chain, W.players.map((p) => [p.x, p.y, p.vx, p.vy, p.alive, p.armor]),
  W.riders.map((r) => [r.id, r.type, r.x, r.y, r.vx, r.vy]), W.cores.map((c) => [c.id, c.x, c.y, c.t]), W.haz.length, W.shots.map((s) => [s.x, s.y]), W.boss && [W.boss.x, W.boss.y, W.boss.hp, W.boss.atk], W.hunter && [W.hunter.x, W.hunter.y]]);

function drive(W, ais, ticks, rec, onTick) {
  for (let i = 0; i < ticks && !W.over; i++) {
    if (rec) rec.tick(W);
    W.players.forEach((p, k) => { p.input = ais[k].control(W, p); });
    if (rec) rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    if (onTick && onTick(W, ev) === false) break;
  }
}
let fail = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fail++; };

// 1. same seed twice (with the recorder rounding inputs, as in the live game)
for (let i = 0; i < seeds; i++) {
  const s = i % 5, wave = i % 2 ? 4 : 0, coop = i === 3;
  const run = () => { const W = makeWorld({ sector: s, wave, seed: 4242 + i, up: TYPICAL_UP[s], coop }); drive(W, W.players.map((p, k) => new Autopilot(9 + i + k, i % 2 ? 'human' : 'demo')), 90 / STEP, new Recorder()); return hashW(W); };
  const a = run(), b = run();
  ok(a === b, `same seed twice · sector ${s + 1} ${wave ? 'boss' : 'wave 1'}${coop ? ' co-op' : ''}`);
}
// 2. a clone carries on exactly
{
  const W = makeWorld({ sector: 3, seed: 99, up: TYPICAL_UP[3] });
  const ai = [new Autopilot(5, 'demo')];
  drive(W, ai, 40 / STEP);
  const C = cloneWorld(W);
  const inputs = [];
  drive(W, ai, 30 / STEP, null, (w) => { inputs.push(w.players[0].input); });
  let i = 0;
  while (i < inputs.length && !C.over) { C.players[0].input = inputs[i++]; step(C, STEP); drainEvents(C); }
  ok(hashW(W) === hashW(C), 'a cloned world carries on bit for bit (30 s)');
}
// 3. instant replay of a death and of a boss kill
for (const [label, opts, want] of [['death', { sector: 4 }, 'death'], ['boss kill', { sector: 0, wave: 4 }, 'bossdown']]) {
  let done = false;
  for (let seed = 1; seed < 30 && !done; seed++) {
    const W = makeWorld({ ...opts, seed, up: TYPICAL_UP[opts.sector] });
    const rec = new Recorder(), ai = [new Autopilot(seed, want === 'death' ? 'human' : 'demo')];
    let keyN = -1, wantH = null, clip = null;
    drive(W, ai, 400 / STEP, rec, (w, ev) => {
      if (keyN < 0 && ev.some((e) => e.k === want)) { keyN = w.n; wantH = hashW(w); }
      if (keyN > 0 && w.n >= keyN + Math.round(1.6 / STEP)) { clip = rec.clip(keyN); return false; }
      return true;
    });
    if (!clip) continue;
    const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
    let got = null, saw = false;
    while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === want) && rp.W.n === keyN) { saw = true; got = hashW(rp.W); } }
    ok(saw && got === wantH, `instant replay reproduces a ${label} exactly (seed ${seed}, tick ${keyN})`);
    done = true;
  }
  if (!done) ok(false, `no ${label} found to replay`);
}
// 4. no Math.random in the simulation
{
  const real = Math.random;
  let calls = 0;
  Math.random = () => { calls++; return real(); };
  const W = makeWorld({ sector: 2, seed: 3, up: TYPICAL_UP[2] });
  for (let i = 0; i < 60 / STEP; i++) { W.players[0].input = { mx: Math.sin(i / 90), flap: i % 30 < 3 }; step(W, STEP); drainEvents(W); }
  Math.random = real;
  ok(calls === 0, `the simulation never calls Math.random (${calls} calls)`);
}
console.log(fail ? `FAIL (${fail})` : 'PASS');
process.exit(fail ? 1 : 0);
