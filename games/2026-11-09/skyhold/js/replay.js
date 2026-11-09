// Instant replay. The simulation is deterministic, so the recorder keeps a cloned world every half
// second plus every ship's input for each tick; a replay re-runs the moments before the last death
// (or boss kill) from the nearest clone and reproduces it exactly, effects and sounds included.
import { cloneWorld, step, drainEvents, STEP } from './sim.js?v=4';

const r4 = (v) => Math.round(v * 10000) / 10000;
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
  // call after the controls, right before step(); inputs are rounded and written back so the live run
  // and the replay use exactly the same numbers
  input(W) {
    this.inputs.set(W.n, W.players.map((p) => {
      const I = p.input;
      I.mx = r4(I.mx || 0); I.my = r4(I.my || 0);
      return [p.id, I.mx, I.my, I.fire ? 1 : 0, I.nova ? 1 : 0, I.blink ? 1 : 0];
    }));
  }
  // keep the moments around tick n (a death or a boss kill) so they can be replayed later
  clip(n, before = 3.2, after = 1.6) {
    const startN = n - Math.round(before / STEP);
    let snap = null;
    for (const s of this.snaps) if (s.n <= startN) snap = s;
    snap = snap || this.snaps[0];
    if (!snap || snap.n > n) return null;
    const endN = n + Math.round(after / STEP), inputs = new Map();
    for (const [k, v] of this.inputs) if (k >= snap.n && k <= endN) inputs.set(k, v);
    return { snap: cloneWorld(snap), inputs, keyN: n, endN };
  }
}

export class Replay {
  constructor(W, inputs, keyN, endN) { this.W = W; this.inputs = inputs; this.keyN = keyN; this.endN = endN; this.acc = 0; this.done = false; }
  advance(simDt) {
    const out = [];
    this.acc += simDt;
    let n = 0;
    while (this.acc >= STEP && !this.done && n < 16) {
      const W = this.W, rec = this.inputs.get(W.n);
      if (rec) for (const q of rec) { const p = W.players.find((x) => x.id === q[0]); if (p) p.input = { mx: q[1], my: q[2], fire: !!q[3], nova: !!q[4], blink: !!q[5] }; }
      step(W, STEP);
      for (const e of drainEvents(W)) out.push(e);
      this.acc -= STEP; n++;
      if (W.n >= this.endN || W.over) this.done = true;
    }
    return out;
  }
  get toKey() { return (this.keyN - this.W.n) * STEP; }
}
