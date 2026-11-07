// Replay check: records autopilot runs and re-runs every ship lost and every construct kill from its saved
// clip (a cloned world + the inputs); the world must match bit for bit.
//   node scripts/sini-2026/replay_check.mjs [seeds=12]
const base = 'file:///D:/Projects/Sinistar/games/2026-11-07/sini-2026/js/';
const sim = await import(base + 'sim.js?v=1');
const { Autopilot } = await import(base + 'ai.js?v=1');
const { Recorder, Replay } = await import(base + 'replay.js?v=1');
const cfg = await import(base + 'config.js?v=1');
const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.cp, W.rs, W.players.map((p) => [p.x, p.z, p.alive, p.shield, p.bombs]), W.enemies.map((e) => [e.id, e.x, e.z, e.hp]),
  W.rocks.map((k) => [k.id, k.x, k.ore]), W.crystals.length, W.bolts.length, W.bombs.length, W.C ? [W.C.st, W.C.pieces, W.C.hp, W.C.x] : 0]);
const seeds = +(process.argv[2] || 12);
let ok = 0, bad = 0;
for (let s = 0; s < seeds; s++) {
  const sector = s % 5, seed = 500 + s * 13;
  const W = sim.makeWorld({ sector, seed, up: cfg.TYPICAL_UP[sector], cp: s % 3 === 2 ? 2 : 0 });
  const rec = new Recorder(), ai = new Autopilot(seed, 'human');
  const keys = [];
  for (let i = 0; i < 120 * 300 && !W.over; i++) {
    rec.tick(W);
    W.players[0].input = ai.control(W, W.players[0]);
    rec.input(W);
    sim.step(W);
    for (const e of sim.drainEvents(W)) if (e.k === 'death' || e.k === 'ckill') keys.push({ n: W.n, k: e.k, h: hashW(W) });
    for (const q of keys) if (!q.clip && W.n >= q.n + Math.round(1.6 / sim.STEP)) q.clip = rec.clip(q.n) || 'none';
  }
  for (const q of keys) {
    if (!q.clip || q.clip === 'none') continue;
    const rp = new Replay(sim.cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
    let got = null;
    while (!rp.done) { const ev = rp.advance(sim.STEP); if (rp.W.n === q.n && ev.some((e) => e.k === q.k)) got = hashW(rp.W); }
    if (got === q.h) ok++; else { bad++; console.log(`MISMATCH seed ${seed} S${sector + 1} ${q.k} at ${q.n}`); }
  }
}
console.log(`replays exact: ${ok}, mismatched: ${bad}`);
process.exit(bad || !ok ? 1 : 0);
