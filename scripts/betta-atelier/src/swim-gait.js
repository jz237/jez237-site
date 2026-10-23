// Separate cadence from excursion: a hovering betta is not a slow, wide swimmer.
// Artistic parameters informed by reference posture, not measured biological Hz.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SCULL_HZ = 3.8;
/** Peak tail-bend excursion (rad) at a given effort; the body-bend model uses the same curve. */
export const tailAmplitude = effort => 0.006 + effort * 0.24;
const FULL_STROKE = (0.55 + 4.15) * tailAmplitude(1);
export class SwimGait {
  constructor() {
    this.effort = this.phase = this.pectoralPhase = this.breathPhase = 0;
    this.scull = this.tuck = 0;
    this.bodyHz = 0.55;
    this.pectoralHz = 1.6;
  }
  // `pose.scull`: hold station with a quick alternating fanning of the pectorals while the
  // body is still. `pose.tuck`: the pectorals folded to the flanks, as in a startle dart.
  advance(dt, drive, relativeSpeed, turn = 0, pose = {}) {
    if (dt <= 0) return;
    this.scull += ((pose.scull ?? 0) - this.scull) * (1 - Math.exp(-5 * dt));
    this.tuck += ((pose.tuck ?? 0) - this.tuck) * (1 - Math.exp(-(pose.tuck ? 30 : 6) * dt));
    // The idle drive is below the propulsion threshold. Holding against flow
    // still costs effort, even when the fish's position is stationary.
    const propulsion = smooth(0.065, 0.40, drive);
    const load = clamp(relativeSpeed * 1.05, 0, 1);
    const target = clamp(propulsion * 0.82 + load * 0.92 + Math.abs(turn) * 0.12, 0, 1);
    this.effort += (target - this.effort) * (1 - Math.exp(-3 * dt));
    this.bodyHz = 0.55 + 4.15 * Math.sqrt(this.effort);
    const swimming = 1.6 + 5.8 * this.effort;
    this.pectoralHz = swimming + (Math.max(swimming, SCULL_HZ) - swimming) * this.scull;
    this.phase += dt * Math.PI * 2 * this.bodyHz;
    this.pectoralPhase += dt * Math.PI * 2 * this.pectoralHz;
    this.breathPhase += dt * (3.6 + this.effort * 3.4);
  }
  /**
   * How hard the propulsors are working, 0..1: tail excursion x beat rate, or the pectorals' fanning
   * when the body is held still. Locomotion may not gain speed faster than this allows.
   */
  get stroke() {
    return clamp(Math.max(this.bodyHz * tailAmplitude(this.effort) / FULL_STROKE, 0.15 * this.scull), 0, 1);
  }
}
