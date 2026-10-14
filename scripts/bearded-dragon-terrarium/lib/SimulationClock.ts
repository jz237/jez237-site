/** Stable simulation cadence; a suspended tab never tries to catch up in one jump. */
export class SimulationClock {
  private remainder = 0;
  readonly step = 1 / 60;
  advance(elapsed: number, update: (dt: number) => void) {
    if (!Number.isFinite(elapsed) || elapsed <= 0) return;
    // Keep real time through ordinary 10–20 fps rendering. Only a genuine
    // suspension discards elapsed time; capping every frame at 50 ms made a
    // busy GPU slow the animal itself down.
    this.remainder += elapsed > .25 ? .05 : Math.min(elapsed, .1);
    let count = 0;
    while (this.remainder + 1e-10 >= this.step && count < 6) {
      update(this.step); this.remainder -= this.step; count++;
    }
    this.remainder = Math.max(0, this.remainder);
  }
}
