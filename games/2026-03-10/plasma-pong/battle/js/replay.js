// Instant replay. The simulation is deterministic, so the recorder only keeps a cloned world every
// half second plus every paddle's input for each tick; a replay re-runs the last few seconds from the
// nearest clone and reproduces the winning hit exactly, with all of its effects and sounds.
import { cloneWorld, step, drainEvents, STEP } from './sim.js?v=4';

export class Recorder {
  constructor() { this.reset(); }
  reset() { this.snaps = []; this.inputs = new Map(); }

  // call before the controls run each tick
  tick(W) {
    if (W.n % 60 !== 0) return;
    this.snaps.push(cloneWorld(W));
    if (this.snaps.length > 10) this.snaps.shift();
    const lo = this.snaps[0].n;
    for (const n of this.inputs.keys()) { if (n >= lo) break; this.inputs.delete(n); }
  }

  // call after the controls, right before step()
  input(W) {
    this.inputs.set(W.n, W.paddles.map((p) => {
      const i = p.input;
      return [p.id, i.mode, i.tx, i.tz, i.vx, i.vz, i.fire, i.od, p.maxSpeed, p.accel, p.gain];
    }));
  }

  // the moments before tick koN (the KO), playing on a little past it
  replay(koN, before = 2.6, after = 1.1) {
    const startN = koN - Math.round(before / STEP);
    let snap = null;
    for (const s of this.snaps) if (s.n <= startN) snap = s;
    snap = snap || this.snaps[0];
    if (!snap || snap.n > koN) return null;
    return new Replay(cloneWorld(snap), this.inputs, koN, koN + Math.round(after / STEP));
  }
}

class Replay {
  constructor(W, inputs, koN, endN) {
    this.W = W; this.inputs = inputs; this.koN = koN; this.endN = endN;
    this.acc = 0; this.done = false;
  }

  // run `simDt` seconds of the recording; returns the events it produced
  advance(simDt) {
    const out = [];
    this.acc += simDt;
    let n = 0;
    while (this.acc >= STEP && !this.done && n < 16) {
      const W = this.W;
      const rec = this.inputs.get(W.n);
      if (rec) for (const r of rec) {
        const p = W.paddles.find((q) => q.id === r[0]);
        if (!p) continue;
        const i = p.input;
        i.mode = r[1]; i.tx = r[2]; i.tz = r[3]; i.vx = r[4]; i.vz = r[5]; i.fire = r[6]; i.od = r[7];
        p.maxSpeed = r[8]; p.accel = r[9]; p.gain = r[10];
      }
      step(W, STEP);
      for (const e of drainEvents(W)) out.push(e);
      this.acc -= STEP;
      n++;
      if (W.n >= this.endN) this.done = true;
    }
    return out;
  }

  // world seconds until the KO (negative afterwards)
  get toKO() { return (this.koN - this.W.n) * STEP; }
}
