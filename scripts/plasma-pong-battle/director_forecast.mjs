const base = new URL('../../games/2026-03-10/plasma-pong/battle/', import.meta.url).href;
const THREE = await import(base + 'vendor/three.module.min.js');
const { makeWorld, step, drainEvents, STEP } = await import(base + 'js/sim.js?v=1');
const { AIPilot } = await import(base + 'js/ai.js?v=1');
const { Director } = await import(base + 'js/director.js?v=1');
const { PILOTS, DIFFICULTY } = await import(base + 'js/config.js?v=1');
let calls = 0, hits = 0, missed = 0, cores = 0, early = [];
for (let m = 0; m < 6; m++) {
  const W = makeWorld({ arena: m % 4, seed: 900 + m });
  const A = [new AIPilot(W, W.paddles[0], PILOTS.nyx, DIFFICULTY.hard.ai), new AIPilot(W, W.paddles[1], PILOTS.krank, DIFFICULTY.hard.ai)];
  const cam = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 3000);
  const D = new Director(cam);
  let pending = null;
  while (!W.over && W.t < 300) {
    for (const a of A) a.update(W, STEP);
    step(W, STEP);
    const ev = drainEvents(W);
    const before = D.breach;
    D.update(STEP, { W, demo: true });
    if (D.breach && D.breach !== before && D.breach.until !== Infinity) { calls++; pending = { side: D.breach.side, t: W.t, until: D.breach.until }; }
    for (const e of ev) if (e.k === 'core') {
      cores++;
      if (pending && pending.side === e.side && W.t <= pending.until) { hits++; early.push(W.t - pending.t); pending = null; }
      else missed++;
    }
    if (pending && W.t > pending.until) pending = null;
  }
}
early.sort((a, b) => a - b);
console.log({ calls, coreHits: cores, predicted: hits, unpredicted: missed, falseAlarms: calls - hits, leadMedian: early[early.length >> 1]?.toFixed(2), leadMin: early[0]?.toFixed(2) });
