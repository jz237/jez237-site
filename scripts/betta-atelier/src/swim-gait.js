// Separate cadence from excursion: a hovering betta is not a slow, wide swimmer.
// Artistic parameters informed by reference posture, not measured biological Hz.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export class SwimGait {
  constructor() {
    this.effort = this.phase = this.pectoralPhase = this.breathPhase = 0;
    this.bodyHz = 0.55;
    this.pectoralHz = 1.6;
  }
  advance(dt, drive, relativeSpeed, turn = 0) {
    if (dt <= 0) return;
    // The idle drive is below the propulsion threshold. Holding against flow
    // still costs effort, even when the fish's position is stationary.
    const propulsion = smooth(0.065, 0.40, drive);
    const load = clamp(relativeSpeed * 1.05, 0, 1);
    const target = clamp(propulsion * 0.82 + load * 0.92 + Math.abs(turn) * 0.12, 0, 1);
    this.effort += (target - this.effort) * (1 - Math.exp(-3 * dt));
    this.bodyHz = 0.55 + 4.15 * Math.sqrt(this.effort);
    this.pectoralHz = 1.6 + 5.8 * this.effort;
    this.phase += dt * Math.PI * 2 * this.bodyHz;
    this.pectoralPhase += dt * Math.PI * 2 * this.pectoralHz;
    this.breathPhase += dt * (3.6 + this.effort * 3.4);
  }
}
