// Belt Run sanity: an AI clears waves alone; spare ships, extra ships, wave clears, replays exact.
import { makeWorld, step, drainEvents, STEP, shipOf } from '../../games/2026-03-09/asteroids-hd/2026/js/sim.js?v=6';
import { AIPilot } from '../../games/2026-03-09/asteroids-hd/2026/js/ai.js?v=6';
import { Recorder } from '../../games/2026-03-09/asteroids-hd/2026/js/replay.js?v=6';
import { PILOTS, DIFFICULTY } from '../../games/2026-03-09/asteroids-hd/2026/js/config.js?v=6';
let lives = 2, pts = 0;
for (let wave = 1; wave <= 30 && lives >= 0; wave++) {
  const arena = Math.floor((wave - 1) / 3) % 4;
  const W = makeWorld({ arena, seed: 900 + wave, solo: true, lives, pts, wave, rocks: Math.min(12, 3 + wave), mega: wave % 5 === 0 ? 1 + Math.floor(wave / 10) : 0, rockK: Math.min(2, 1.1 + 0.06 * (wave - 1)) });
  const ai = new AIPilot(W, shipOf(W, 1), PILOTS.cipher, DIFFICULTY.normal.ai);
  const REC = new Recorder();
  const k = {};
  let ko = null, t = 0;
  while (!W.over && t < 400) {
    REC.tick(W); ai.update(W, STEP); REC.input(W);
    const n = W.n;
    step(W, STEP); t += STEP;
    for (const e of drainEvents(W)) { k[e.k] = (k[e.k] || 0) + 1; if (e.k === 'ko' || e.k === 'shipdown') ko = { n, x: e.x, z: e.z }; }
    if (!Number.isFinite(W.ships[0].x)) throw new Error('NaN');
  }
  let same = 'n/a';
  if (ko) {
    const rp = REC.replay(ko.n + 1);
    let r = null;
    if (rp) { while (!rp.done) for (const e of rp.advance(STEP * 4)) if ((e.k === 'shipdown' || e.k === 'ko') && !r) r = e; same = r && Math.abs(r.x - ko.x) < 1e-9 ? 'exact' : 'DIFF'; }
  }
  console.log(`wave ${wave} ${W.arena.name.padEnd(13)} ${W.cleared ? 'CLEAR' : 'OVER '} ${t.toFixed(0)}s pts ${W.pts} lives ${W.lives} hullLost ${W.stats[1].taken} down ${k.shipdown || 0} respawn ${k.respawn || 0} extra ${k.extralife || 0} last-death replay ${same}`);
  lives = W.lives; pts = W.pts + (W.cleared ? 500 * wave : 0);
  if (!W.cleared) break;
}
