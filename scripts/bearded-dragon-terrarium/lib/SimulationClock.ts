/** Stable simulation cadence; a suspended tab never tries to catch up in one jump. */
export class SimulationClock {
  private remainder = 0;
  readonly step = 1 / 60;
  advance(elapsed: number, update: (dt: number) => void) {
    if (!Number.isFinite(elapsed) || elapsed <= 0) return;
    this.remainder += Math.min(elapsed, .05);
    let count = 0;
    while (this.remainder + 1e-10 >= this.step && count < 6) {
      update(this.step); this.remainder -= this.step; count++;
    }
    this.remainder = Math.max(0, this.remainder);
  }
}
