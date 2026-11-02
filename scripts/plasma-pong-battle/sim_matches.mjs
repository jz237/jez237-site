// Headless AI-vs-AI matches: sanity (no NaN), pacing (match length, rallies), and event mix.
const base = new URL('../../games/2026-03-10/plasma-pong/battle/js/', import.meta.url).href;
const { makeWorld, step, drainEvents, STEP, paddlesOf } = await import(base + 'sim.js?v=1');
const { AIPilot } = await import(base + 'ai.js?v=1');
const { PILOTS, ARENAS } = await import(base + 'config.js?v=1');

const keys = ['volt', 'nyx', 'krank', 'seraph'];
const results = [];
const t0 = performance.now();
for (let m = 0; m < Number(process.argv[2] || 12); m++) {
  const arena = m % ARENAS.length;
  const boss = arena === 4 ? -1 : 0;
  const W = makeWorld({ arena, seed: 1000 + m, boss });
  const a = keys[m % 4], b = boss ? 'monolith' : keys[(m + 1 + (m >> 2)) % 4];
  const pilots = [new AIPilot(W, W.paddles[0], PILOTS[a]), new AIPilot(W, W.paddles[1], PILOTS[b])];
  const counts = {};
  let steps = 0, bad = false;
  while (!W.over && W.t < 600) {
    // boss phase 2 adds a paddle: give it a pilot
    for (const p of W.paddles) if (!pilots.some((q) => q.p === p)) pilots.push(new AIPilot(W, p, PILOTS[b]));
    for (const q of pilots) q.update(W, STEP);
    step(W, STEP);
    for (const e of drainEvents(W)) counts[e.k] = (counts[e.k] || 0) + 1;
    for (const ball of W.balls) if (!Number.isFinite(ball.x + ball.z + ball.vx + ball.vz)) bad = true;
    steps++;
  }
  results.push({ arena: ARENAS[arena].key, a, b, winner: W.winner === 1 ? a : b, t: W.t.toFixed(0), maxRally: W.maxRally, bad,
    hits: counts.hit, cells: counts.cell, core: counts.core, bolts: counts.bolt, stun: counts.stun, pu: counts.pu, wall: counts.wall, bump: counts.bump || 0, portal: counts.portal || 0, laser: counts.laser || 0, phase2: counts.phase2 || 0 });
}
console.table(results);
console.log('wall ms', (performance.now() - t0).toFixed(0));
