// Campaign build-up check: a fixed stand-in pilot (Nyx, normal) plays each stage's rival with and
// without the RAMP; the stand-in should win often in stage 1 and less each stage after.
// edge = core the rival loses per core the stand-in loses (steadier than wins).
// usage: node ramp_check.mjs [matches per stage] [ramp|base|both] [stages e.g. 12]
const base = new URL('../../games/2026-03-10/plasma-pong/battle/js/', import.meta.url).href;
const { makeWorld, step, drainEvents, STEP } = await import(base + 'sim.js?v=6');
const { AIPilot } = await import(base + 'ai.js?v=6');
const { PILOTS, LADDER, DIFFICULTY, RAMP, rampAI } = await import(base + 'config.js?v=6');

const N = +process.argv[2] || 10, only = process.argv[3] || 'both', stages = (process.argv[4] || '1234').split('').map((c) => +c - 1);
const rows = [];
for (const stage of stages) {
  for (const ramp of only === 'both' ? [false, true] : [only === 'ramp']) {
    let wins = 0, cores = 0, dealt = 0, time = 0, rally = 0;
    for (let m = 0; m < N; m++) {
      const W = makeWorld({ arena: stage, seed: 700 + m * 29 + stage, ballK: ramp ? RAMP[stage].ball : 1, serveDir: m % 2 ? 1 : -1 });
      const diff = ramp ? rampAI(DIFFICULTY.normal.ai, stage) : DIFFICULTY.normal.ai;
      const me = new AIPilot(W, W.paddles[0], PILOTS.nyx, DIFFICULTY.normal.ai);
      const foe = new AIPilot(W, W.paddles[1], PILOTS[LADDER[stage]], diff);
      while (!W.over && W.t < 600) {
        me.update(W, STEP); foe.update(W, STEP);
        step(W, STEP);
        drainEvents(W);
      }
      if (W.winner === 1) wins++;
      cores += W.cores[1].max - W.cores[1].hp; dealt += W.cores[-1].max - W.cores[-1].hp;
      time += W.t; rally += W.maxRally;
    }
    rows.push({ stage: stage + 1, rival: LADDER[stage], ramp, standInWins: `${Math.round((wins / N) * 100)}%`, edge: +(dealt / (cores || 1)).toFixed(2), coreLostPerMin: +((cores / time) * 60).toFixed(2), avgT: Math.round(time / N), maxRally: +(rally / N).toFixed(1) });
  }
}
console.table(rows);
