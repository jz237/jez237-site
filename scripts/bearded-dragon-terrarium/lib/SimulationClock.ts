/** Stable simulation cadence; a suspended tab never tries to catch up in one jump. */
export class SimulationClock {
  private remainder = 0;
  readonly step = 1 / 60;
  constructor(readonly rate=1) {}
  get alpha() {return Math.min(1,this.remainder/this.step);}
  advance(elapsed: number, update: (dt: number) => void, canContinue=()=>true) {
    if (!Number.isFinite(elapsed) || elapsed <= 0) return;
    // Keep elapsed time through ordinary rendering hitches. Limit the work per
    // frame and carry its remainder instead of silently slowing the animal.
    // A suspended tab starts fresh rather than replaying minutes in one jump.
    this.remainder += (elapsed > .25 ? .05 : elapsed)*this.rate;
    let count = 0;
    while (this.remainder + 1e-10 >= this.step && count < Math.ceil(6*this.rate) && (count===0 || canContinue())) {
      update(this.step); this.remainder -= this.step; count++;
    }
    this.remainder = Math.max(0, this.remainder);
  }
}
