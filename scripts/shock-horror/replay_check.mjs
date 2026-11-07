// Replay exactness: record runs with the autopilot, cut clips around deaths and random moments, replay each clip
// from its snapshot with the recorded inputs and compare the world at the key tick with the live run.
//   node scripts/shock-horror/replay_check.mjs [runs=8]
import { SIM, AI, REP } from './_game.mjs';
const runs = +(process.argv[2] || 8);
const sig = (W) => { const P = W.players[0]; return [W.n, P.x.toFixed(6), P.y.toFixed(6), P.hp, P.oil.toFixed(4), W.score, W.bats.map((b) => b.x.toFixed(4) + b.st).join(), W.loot.filter((l) => l.got).length, W.boss ? W.boss.hp + W.boss.st : ''].join('|'); };
let ok = 0, bad = 0;
for (let r = 0; r < runs; r++) {
  const d = r % 5, l = r % 4;
  const W = SIM.makeWorld({ seed: 300 + r, depth: d, level: l });
  const ap = new AI.Autopilot(r % 2 ? 'human' : 'demo', r);
  const rec = new REP.Recorder();
  const keys = new Map(), want = new Set([1200, 2400, 3600, 5000, 7000]);
  while (!W.clear && !W.over && W.t < 70) {
    W.players[0].input = ap.control(W); rec.tick(W); rec.input(W); SIM.step(W);
    let death = false; for (const e of SIM.drainEvents(W)) if (e.k === 'death' || e.k === 'bossdie') death = true;
    if (want.has(W.n) || death) keys.set(W.n, { s: sig(W), clip: rec.clip(W.n, 3, 0) });
  }
  for (const [n, k] of keys) {
    if (!k.clip) continue;
    const R = new REP.Replay(SIM.cloneWorld(k.clip.snap), k.clip.inputs, k.clip.keyN, k.clip.keyN);
    while (!R.done) R.advance(1 / 30);
    if (sig(R.W) === k.s) ok++; else { bad++; console.log(`MISMATCH D${d + 1}L${l + 1} tick ${n}\n  live   ${k.s}\n  replay ${sig(R.W)}`); }
  }
}
console.log(`${bad ? 'FAIL' : 'PASS'} replay_check: ${ok} clips exact, ${bad} mismatched`);
process.exit(bad ? 1 : 0);
