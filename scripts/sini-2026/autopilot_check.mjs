// Autopilot check: chained campaigns (lives and score carry over, continues from the last checkpoint) for the
// demo and the human profiles; prints how far each gets.
//   node scripts/sini-2026/autopilot_check.mjs [runs=4]
const base = 'file:///D:/Projects/Sinistar/games/2026-11-07/sini-2026/js/';
const sim = await import(base + 'sim.js?v=1');
const { Autopilot } = await import(base + 'ai.js?v=1');
const cfg = await import(base + 'config.js?v=1');
const runs = +(process.argv[2] || 4);
for (const profile of ['demo', 'human']) {
  for (let r = 0; r < runs; r++) {
    let score = 0, lives = cfg.START_LIVES, cont = 0, s = 0, cp = 0, bombs, t = 0;
    const log = [];
    while (s < 5 && cont < 6) {
      const seed = 9000 + r * 101 + s * 7 + cont;
      const W = sim.makeWorld({ sector: s, seed, up: cfg.TYPICAL_UP[s], lives, score, cp, bombs });
      const ai = new Autopilot(seed, profile);
      for (let i = 0; i < 120 * 600 && !W.over; i++) { W.players[0].input = ai.control(W, W.players[0]); sim.step(W); sim.drainEvents(W); }
      t += W.secT;
      if (W.result === 'clear') { log.push(`S${s + 1} ${Math.round(W.secT)}s`); s++; score = W.score; lives = W.lives + 1; cp = 0; bombs = undefined; }
      else { cont++; log.push(`S${s + 1} lost at cp${W.cp}`); cp = W.cp; bombs = W.cpBombs[W.cp]; lives = cfg.START_LIVES; }
    }
    console.log(`${profile.padEnd(5)} run ${r + 1}: ${s >= 5 ? 'ALL FIVE' : 'stopped at S' + (s + 1)} · ${cont} continues · ${Math.round(t / 60)} min · ${log.join(', ')}`);
  }
}
