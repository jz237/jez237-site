// Instant replay. The simulation is deterministic, so the recorder keeps a cloned world every half
// second plus every rover's input for each tick; a replay re-runs the moments before the last death
// (or boss kill) from the nearest clone and reproduces it exactly, effects and sounds included.
import { cloneWorld, step, drainEvents, STEP } from './sim.js?v=2';

export class Recorder {
  constructor() { this.reset(); }
  reset() { this.snaps = []; this.inputs = new Map(); }
  // call before the controls run each tick
  tick(W) {
    if (W.n % 60 !== 0) return;
    this.snaps.push(cloneWorld(W));
    if (this.snaps.length > 14) this.snaps.shift();
    const lo = this.snaps[0].n;
    for (const n of this.inputs.keys()) { if (n >= lo) break; this.inputs.delete(n); }
  }
  // call after the controls, right before step()
  input(W) { this.inputs.set(W.n, W.rovers.map((r) => [r.id, r.input.th, r.input.jump ? 1 : 0, r.input.fire ? 1 : 0])); }
  // keep the moments around tick n (a death or a boss kill) so they can be replayed later
  clip(n, before = 3.2, after = 1.4) {
    const startN = n - Math.round(before / STEP);
    let snap = null;
    for (const s of this.snaps) if (s.n <= startN) snap = s;
    snap = snap || this.snaps[0];
    if (!snap || snap.n > n) return null;
    const endN = n + Math.round(after / STEP), inputs = new Map();
    for (const [k, v] of this.inputs) if (k >= snap.n && k <= endN) inputs.set(k, v);
    return { snap: cloneWorld(snap), inputs, keyN: n, endN };
  }
  // the moments before tick n, playing on a little past it
  replay(n, before = 3.2, after = 1.4) {
    const startN = n - Math.round(before / STEP);
    let snap = null;
    for (const s of this.snaps) if (s.n <= startN) snap = s;
    snap = snap || this.snaps[0];
    if (!snap || snap.n > n) return null;
    return new Replay(cloneWorld(snap), this.inputs, n, n + Math.round(after / STEP));
  }
}

export class Replay {
  constructor(W, inputs, keyN, endN) { this.W = W; this.inputs = inputs; this.keyN = keyN; this.endN = endN; this.acc = 0; this.done = false; }
  advance(simDt) {
    const out = [];
    this.acc += simDt;
    let n = 0;
    while (this.acc >= STEP && !this.done && n < 16) {
      const W = this.W, rec = this.inputs.get(W.n + 1 - 1);
      if (rec) for (const q of rec) { const r = W.rovers.find((x) => x.id === q[0]); if (r) { r.input.th = q[1]; r.input.jump = !!q[2]; r.input.fire = !!q[3]; } }
      step(W, STEP);
      for (const e of drainEvents(W)) out.push(e);
      this.acc -= STEP; n++;
      if (W.n >= this.endN || W.over) this.done = true;
    }
    return out;
  }
  get toKey() { return (this.keyN - this.W.n) * STEP; }
}
