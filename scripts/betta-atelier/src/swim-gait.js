// Separate cadence from excursion: a hovering betta is not a slow, wide swimmer. Fitted to footage
// of male halfmoons (and Bainbridge's tail-beat scaling), not measured physiology: the tail beats
// about 2-3 times a second cruising and faster only in a burst, while at hover it all but stops (the
// caudal only billows); slow travel and hovering are the pectorals' work, beaten irregularly at about
// 1.5-3 Hz, in runs with pauses of up to a second or so.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const TAU = Math.PI * 2;
/** Snout tip to caudal peduncle (standard length), in the Atelier's units (fish.js: x -1.68 to 1.056). */
export const BODY_LENGTH = 2.736;
/** Peak tail-bend excursion (rad: the peduncle's swing either side) at a given effort; the body-bend
 *  model uses the same curve. An easy cruise sweeps the caudal some 15 degrees either way, plainly
 *  seen side-on as the fan swings; at hover it is all but still. */
export const tailAmplitude = effort => 0.0076 + effort * 0.57;
/** The tail's beat (Hz) at a given effort and pace (body lengths/s): it quickens mostly with
 *  speed, as Bainbridge found (about 1.7 Hz at 0.3 BL/s, 2.5 at 0.6, 3.4 at 1), and a little with
 *  the effort of speeding up. */
export const tailHz = (effort, pace) => 0.8 + 1.2 * effort + 1.4 * Math.min(pace, 2.5);
// (The stroke of an easy cruise: working that hard or harder, the tail gains speed as fast as it can.)
const CRUISE_STROKE = tailHz(0.45, 0.4) * tailAmplitude(0.45);
/** The next of a small seeded stream (mulberry32), 0..1, kept in holder.seed: the same from the same
 *  seed, so a twin of the fish (bettaLink's worker) moves alike; a plain number, so it clones. */
export function draw(holder) {
  const a = holder.seed = (holder.seed + 0x6d2b79f5) >>> 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export class SwimGait {
  constructor() {
    this.effort = this.phase = this.pectoralPhase = this.breathPhase = 0;
    this.scull = this.tuck = this.tuckRate = this.back = 0;
    this.pectoralEffort = this.pectoralScull = 0;
    this.bodyHz = tailHz(0, 0);
    this.seed = 0x6be77a;
    // The pectorals beat a run of strokes, each at its own rate, then rest a moment (pectoralPause,
    // s), their power easing down and back up (0..1); pectoralHz is the beat now.
    this.pectoralHz = 2.3;
    this.pectoralRun = 3;
    this.pectoralPause = 0;
    this.pectoralPower = 1;
    // Breaths come at a rate and depth that vary from breath to breath (drawn from a stream of their
    // own, so the breathing's pace leaves the pectorals' beats as they are).
    this.breaths = { seed: 0x2c1b3c6d };
    this.breathRate = 1;
    this.breathDepth = 1;
    // The long fins' slow billow (its phase, rad), stirred along by the pectorals' wash and the
    // fish's travel rather than by a clock; the wash itself (0..1); the travel (body lengths/s).
    this.billowPhase = 0;
    this.wash = 1;
    this.pace = 0;
  }
  // `pose.scull`: hold station with the pectorals, beating in long runs while the body is still.
  // `pose.tuck`: the pectorals drawn in toward the flanks, as in a startle dart.
  // `pose.back`: backing up on the pectorals (0..1): they beat quicker, and without their rests.
  // relativeSpeed: the water going past the fish (Atelier units/s).
  advance(dt, drive, relativeSpeed, turn = 0, pose = {}) {
    if (dt <= 0) return;
    this.scull += ((pose.scull ?? 0) - this.scull) * (1 - Math.exp(-5 * dt));
    this.back += ((pose.back ?? 0) - this.back) * (1 - Math.exp(-6 * dt));
    if (this.back > 0.3) this.pectoralPause = 0;
    // A critically damped spring, so the fins accelerate into the fold and settle out of it
    // instead of snapping at the first frame of a mode change.
    {
      const w = pose.tuck ? 11 : 4.5, e = this.tuck - (pose.tuck ?? 0), c = this.tuckRate + w * e, k = Math.exp(-w * dt);
      this.tuck = clamp((pose.tuck ?? 0) + (e + c * dt) * k, 0, 1);
      this.tuckRate = (this.tuckRate - w * c * dt) * k;
    }
    // The idle drive is below the propulsion threshold. Holding against flow still costs effort,
    // even when the fish's position is stationary; full load is a fast swim (1.2 body lengths/s).
    this.pace = Math.max(0, relativeSpeed) / BODY_LENGTH;
    const propulsion = smooth(0.065, 0.40, drive);
    const load = clamp(this.pace / 1.2, 0, 1);
    const target = clamp(propulsion * 0.8 + load * 0.35 + Math.abs(turn) * 0.08, 0, 1);
    this.effort += (target - this.effort) * (1 - Math.exp(-3 * dt));
    this.bodyHz = tailHz(this.effort, this.pace);
    // The pectoral fans are slow to follow the tail: a change of swim mode shifts their power and
    // rate over a second or so, so the fins read as one continuous stroke rather than a new gait.
    this.pectoralEffort += (this.effort - this.pectoralEffort) * (1 - Math.exp(-1.1 * dt));
    this.pectoralScull += (this.scull - this.pectoralScull) * (1 - Math.exp(-2.2 * dt));
    if (this.pectoralPause > 0) this.pectoralPause -= dt;
    const beating = this.pectoralPause <= 0;
    // (Paused, the fans hold half spread and drift through the stroke slowly; beating again, the
    // power comes back within a beat.)
    this.pectoralPower += ((beating ? 1 : 0.14) - this.pectoralPower) * (1 - Math.exp(-(beating ? 7 : 4) * dt));
    const before = this.pectoralPhase;
    this.pectoralPhase += dt * TAU * (beating ? this.pectoralHz * (1 + 0.5 * this.back) : 0.7);
    if (Math.floor(this.pectoralPhase / TAU) !== Math.floor(before / TAU)) this.nextPectoralBeat(beating);
    this.phase += dt * TAU * this.bodyHz;
    // The membranes billow at about 1-2 Hz, quicker as the pectorals wash over them and as the fish
    // travels, and far less while the pectorals rest.
    this.wash += (this.pectoralPower - this.wash) * (1 - Math.exp(-3 * dt));
    this.billowPhase += dt * TAU * (0.55 + 0.4 * this.pectoralHz * this.wash + 0.6 * Math.min(this.pace, 1.5));
    const breath = this.breathPhase;
    // (About 1.1 breaths a second at rest, 1.5 working hard: the gill covers' pumping, give or take a
    // fifth from breath to breath.)
    this.breathPhase += dt * (7 + this.effort * 4) * this.breathRate;
    if (Math.floor(this.breathPhase / TAU) !== Math.floor(breath / TAU)) {
      this.breathRate = 0.8 + 0.4 * draw(this.breaths);
      this.breathDepth = 0.65 + 0.45 * draw(this.breaths);
    }
  }
  // At the end of each pectoral beat: the next one's rate, and after the last of a run, a rest.
  // Holding still (sculling) the runs are long and the rests short; swimming, the beat quickens.
  nextPectoralBeat(wasBeating) {
    const r = draw(this), hold = this.pectoralScull, under = this.pectoralEffort;
    this.pectoralHz = (1.5 + 1.5 * r) * (1 + 0.35 * under);
    if (!wasBeating) return;
    if (--this.pectoralRun > 0) return;
    const p = draw(this);
    this.pectoralRun = 2 + Math.floor(draw(this) * (4 + 3 * hold));
    this.pectoralPause = (0.2 + 1.1 * p * p) * (1 - 0.2 * hold) * (1 - 0.6 * under);
  }
  /**
   * How hard the propulsors are working, 0..1: tail excursion x beat rate (an easy cruise or more
   * is all it has), or the pectorals' fanning when the body is held still. Locomotion may not gain
   * speed faster than this allows.
   */
  get stroke() {
    return clamp(Math.max(this.bodyHz * tailAmplitude(this.effort) / CRUISE_STROKE, 0.15 * this.scull), 0, 1);
  }
}
