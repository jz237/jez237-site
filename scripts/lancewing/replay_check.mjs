// Exact instant replays: autopilot runs (solo and local co-op, every sector, waves and bosses) are recorded with
// the game's own Recorder; every death and every boss kill is cut into a clip exactly as main.js does it
// (1.6 s after the moment) and re-run with the game's Replay class. The replay must match the live run bit for
// bit on EVERY tick of the clip (a per-tick state hash) and the whole world (JSON of everything) at the key tick
// and the clip's end; each clip is re-run twice (the saved snapshot must not be changed by a replay).
//   node scripts/lancewing/replay_check.mjs [seeds=10]
import { SIM, AI, CFG, REP } from './_game.mjs';
const { makeWorld, step, drainEvents, STEP, cloneWorld } = SIM;
const { Autopilot } = AI;
const { TYPICAL_UP, WAVES } = CFG;
const { Recorder, Replay } = REP;

const seeds = +(process.argv[2] || 10);
const tickHash = (W) => JSON.stringify([W.n, W.score, W.lives, W.wave, W.waveN, W.phase, W.rs, W.chain, W.slow,
  W.players.map((p) => [p.x, p.y, p.vx, p.vy, p.alive, p.armor, p.inv, p.on, p.beat]), W.riders.map((r) => [r.id, r.type, r.x, r.y, r.vx, r.vy, r.on]),
  W.cores.map((c) => [c.id, c.x, c.y, c.t, c.st]), W.haz.map((h) => [h.k, h.x, h.t]), W.shots.map((s) => [s.x, s.y]), W.pickups.map((q) => [q.id, q.x, q.y]),
  W.boss && [W.boss.x, W.boss.y, W.boss.hp, W.boss.st, W.boss.phase], W.hunter && [W.hunter.x, W.hunter.y, W.hunter.st]]);
const fullHash = (W) => JSON.stringify({ ...W, ev: [] });
const CLIP_AFTER = 1.6;   // main.js queueClip: the clip is cut 1.6 s after the moment

let ok = 0, bad = 0, total = 0, ticks = 0;
const kinds = { death: 0, bossdown: 0 };
for (let seed = 1; seed <= seeds; seed++) {
  const s = (seed - 1) % 5, boss = seed % 2 === 0, coop = seed % 4 === 3;
  const W = makeWorld({ mode: 'campaign', sector: s, seed: 5000 + seed, up: TYPICAL_UP[s], wave: boss ? WAVES : seed % 3, coop });
  const rec = new Recorder();
  const ais = W.players.map((p, i) => new Autopilot(seed * 31 + i, boss ? 'demo' : 'human'));
  const live = new Map();   // tick -> hash, kept for the last ~9 s
  const keys = [];
  for (let i = 0; i < 420 / STEP && !W.over; i++) {
    rec.tick(W);
    W.players.forEach((p, k) => { p.input = ais[k].control(W, p); });
    rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    live.set(W.n, tickHash(W));
    live.delete(W.n - Math.round(9 / STEP));
    for (const e of ev) if ((e.k === 'death' || e.k === 'bossdown') && !keys.some((q) => q.n === W.n)) keys.push({ n: W.n, k: e.k, full: fullHash(W) });
    for (const q of keys) {
      if (q.clip || W.n < q.n + Math.round(CLIP_AFTER / STEP)) continue;
      q.clip = rec.clip(q.n);
      if (q.clip) { q.hashes = new Map(); for (let n = q.clip.snap.n + 1; n <= W.n; n++) if (live.has(n)) q.hashes.set(n, live.get(n)); q.endFull = fullHash(W); q.endN = W.n; }
    }
    if (keys.length >= 4 && keys.every((q) => q.clip)) break;
  }
  for (const q of keys) {
    if (!q.clip) continue;
    for (let run = 0; run < 2; run++) {
      total++;
      const rp = new Replay(cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
      let firstBad = null, sawKey = false, keyFull = null, endFull = null, n = 0;
      while (!rp.done) {
        const ev = rp.advance(STEP);
        const h = q.hashes.get(rp.W.n);
        n++;
        if (h !== undefined && h !== tickHash(rp.W) && firstBad === null) firstBad = rp.W.n;
        if (rp.W.n === q.n) { sawKey = ev.some((e) => e.k === q.k); keyFull = fullHash(rp.W); }
        if (rp.W.n === q.endN) endFull = fullHash(rp.W);
      }
      ticks += n;
      const good = firstBad === null && sawKey && keyFull === q.full && (endFull === null || endFull === q.endFull);
      if (good) { ok++; kinds[q.k]++; } else { bad++; console.log(`seed ${seed} S${s + 1}${coop ? ' co-op' : ''} ${q.k} at tick ${q.n} run ${run + 1}: ${firstBad !== null ? 'diverged at tick ' + firstBad : !sawKey ? 'the moment did not happen' : 'world differs'}`); }
    }
  }
}
console.log(`replays: ${ok} / ${total} bit-exact (${kinds.death} death, ${kinds.bossdown} boss-kill re-runs, ${ticks} ticks compared)${bad ? `, ${bad} differ` : ''}`);
console.log(bad || !total || !kinds.death || !kinds.bossdown ? 'FAIL' : 'PASS');
process.exit(bad || !total || !kinds.death || !kinds.bossdown ? 1 : 0);
