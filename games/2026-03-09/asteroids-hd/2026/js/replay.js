// Instant replay. The simulation is deterministic, so the recorder only keeps a cloned world every
// half second plus every ship's input for each tick; a replay re-runs the last few seconds from the
// nearest clone and reproduces the knockout exactly, with all of its effects and sounds.
import { cloneWorld, step, drainEvents, STEP } from './sim.js?v=6';

export class Recorder {
  constructor() { this.reset(); }
  reset() { this.snaps = []; this.inputs = new Map(); }

  // call before the controls run each tick
  tick(W) {
    if (W.n % 60 !== 0) return;
    this.snaps.push(cloneWorld(W));
    if (this.snaps.length > 12) this.snaps.shift();
    const lo = this.snaps[0].n;
    for (const n of this.inputs.keys()) { if (n >= lo) break; this.inputs.delete(n); }
  }

  // call after the controls, right before step()
  input(W) {
    this.inputs.set(W.n, W.ships.map((s) => {
      const i = s.input;
      return [s.id, i.turn, i.aim, i.thrust, i.fire ? 1 : 0, i.dash ? 1 : 0, i.od ? 1 : 0];
    }));
  }

  // the moments before tick koN (the knockout), playing on a little past it
  replay(koN, before = 2.6, after = 1.0) {
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
        const s = W.ships.find((q) => q.id === r[0]);
        if (!s) continue;
        const i = s.input;
        i.turn = r[1]; i.aim = r[2]; i.thrust = r[3]; i.fire = !!r[4]; i.dash = !!r[5]; i.od = !!r[6];
      }
      step(W, STEP);
      for (const e of drainEvents(W)) out.push(e);
      this.acc -= STEP;
      n++;
      if (W.n >= this.endN) this.done = true;
    }
    return out;
  }

  // world seconds until the knockout (negative afterwards)
  get toKO() { return (this.koN - this.W.n) * STEP; }
}
