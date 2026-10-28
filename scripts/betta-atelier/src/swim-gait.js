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
/** The swing the trunk actually makes (rad, at the peduncle): the tail's beat, which at hover dies
 *  away altogether below a small effort (the fish holds station on its pectorals, its tail still but
 *  for single sweeps, the kicks; an even idle beat would set the caudal swinging like a metronome). */
export const tailSwing = effort => tailAmplitude(effort) * smooth(0.04, 0.14, effort);
/** The tail's beat (Hz) at a given effort and pace (body lengths/s): it quickens mostly with
 *  speed, as Bainbridge found (about 1.7 Hz at 0.3 BL/s, 2.5 at 0.6, 3.4 at 1), and a little with
 *  the effort of speeding up. */
export const tailHz = (effort, pace) => 0.8 + 1.2 * effort + 1.4 * Math.min(pace, 2.5);
// (The stroke of an easy cruise: the measure of how hard the propulsors work. A dart's beats, quick and
// wide, are up to STROKE_MOST times as hard.)
const CRUISE_STROKE = tailHz(0.45, 0.4) * tailAmplitude(0.45);
export const STROKE_MOST = 3;
// A single sweep of the tail (a kick: a half-beat out to one side and back, KICK_TIME s, KICK_SIZE rad
// at the peduncle at the most: plainly seen, the caudal swung well off the body's line, the rear of the
// body bent with it) is the cause of a move from all but a standstill: setting off, a nudge forward,
// levelling out, coming round. Setting off it sweeps twice (a whole beat: out to one side, then across
// to the other, KICK_RETURN as far). It travels down the trunk (KICK_LAG of a sweep behind at the
// peduncle), and while it lasts it works as hard as KICK_STROKE.
export const KICK_TIME = 0.34, KICK_SIZE = 0.46, KICK_LAG = 0.45, KICK_STROKE = 0.9, KICK_RETURN = 0.75;
/** A kick's swing at a place along the trunk (u: 0 neck, 1 peduncle), `at` (0..1) through it, as a
 *  share of its size (signed: the second of `sweeps` swings the other way): later towards the tail. */
export function kickSweep(at, u, sweeps = 1) {
  const here = at * (sweeps + KICK_LAG) - KICK_LAG * u;
  return here > 0 && here < sweeps ? Math.sin(Math.PI * here) * (here > 1 ? KICK_RETURN : 1) : 0;
}
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
    // The host's strokes (a host with its own locomotion: the bowl's BettaSwim), each taken once, by
    // its count: a beat of the pectorals (push, 0..1, easing off over half a second or so: they beat
    // the harder), a kick of the tail (kickAt: how far through it, 0..1, 1 done; kick: its size and
    // side, signed); and how much it is darting (dart: fins folded, the tail beating hard at once) or
    // braking (brake: the pectorals fanned and beating), each 0..1.
    this.pushes = this.kicks = 0;
    this.push = this.kick = this.dart = this.brake = 0;
    this.kickAt = 1; this.kickSweeps = 1;
  }
  // `pose.scull`: hold station with the pectorals, beating in long runs while the body is still.
  // `pose.tuck`: the pectorals drawn in toward the flanks, as in a startle dart.
  // `pose.back`: backing up on the pectorals (0..1): they beat quicker, and without their rests.
  // `pose.pushes` / `pose.pushSize`, `pose.kicks` / `pose.kickSize` (signed: the side the tail sweeps
  // to) / `pose.kickSweeps` (1, or 2 for a whole beat): the host's strokes, counted; `pose.dart`,
  // `pose.brake` (0..1): darting off, braking hard.
  // relativeSpeed: the water going past the fish (Atelier units/s).
  advance(dt, drive, relativeSpeed, turn = 0, pose = {}) {
    if (dt <= 0) return;
    if ((pose.pushes ?? 0) !== this.pushes) {
      // (A beat of the pectorals now: a run starts, if they were resting.)
      this.pushes = pose.pushes;
      this.push = Math.max(this.push, pose.pushSize ?? 1);
      this.pectoralPause = 0;
      this.pectoralRun = Math.max(this.pectoralRun, 2);
    }
    if ((pose.kicks ?? 0) !== this.kicks) { this.kicks = pose.kicks; this.kick = pose.kickSize ?? 1; this.kickSweeps = pose.kickSweeps ?? 1; this.kickAt = 0; }
    this.kickAt = Math.min(1, this.kickAt + dt / (KICK_TIME * this.kickSweeps));
    this.push *= Math.exp(-2.2 * dt);
    this.dart += ((pose.dart ?? 0) - this.dart) * (1 - Math.exp(-((pose.dart ?? 0) > this.dart ? 25 : 5) * dt));
    this.brake += ((pose.brake ?? 0) - this.brake) * (1 - Math.exp(-((pose.brake ?? 0) > this.brake ? 20 : 4) * dt));
    // (Braking, the pectorals fan as they do to hold station; darting, they fold in.)
    this.scull += (Math.max(pose.scull ?? 0, this.brake) - this.scull) * (1 - Math.exp(-5 * dt));
    this.back += ((pose.back ?? 0) - this.back) * (1 - Math.exp(-6 * dt));
    if (this.back > 0.3) this.pectoralPause = 0;
    // A critically damped spring, so the fins accelerate into the fold and settle out of it
    // instead of snapping at the first frame of a mode change.
    {
      const want = Math.max(pose.tuck ?? 0, 0.8 * this.dart);
      const w = want ? 11 : 4.5, e = this.tuck - want, c = this.tuckRate + w * e, k = Math.exp(-w * dt);
      this.tuck = clamp(want + (e + c * dt) * k, 0, 1);
      this.tuckRate = (this.tuckRate - w * c * dt) * k;
    }
    // The idle drive is below the propulsion threshold. Holding against flow still costs effort,
    // even when the fish's position is stationary; full load is a fast swim (1.2 body lengths/s).
    this.pace = Math.max(0, relativeSpeed) / BODY_LENGTH;
    const propulsion = smooth(0.065, 0.40, drive);
    const load = clamp(this.pace / 1.2, 0, 1);
    // (Darting, the tail works hard at once: the first beat is a strong one.)
    const target = Math.max(clamp(propulsion * 0.8 + load * 0.35 + Math.abs(turn) * 0.08, 0, 1), 0.9 * this.dart);
    this.effort += (target - this.effort) * (1 - Math.exp(-(this.dart > 0.1 ? 14 : 3) * dt));
    this.bodyHz = tailHz(this.effort, this.pace);
    // The pectoral fans are slow to follow the tail: a change of swim mode shifts their power and
    // rate over a second or so, so the fins read as one continuous stroke rather than a new gait.
    this.pectoralEffort += (this.effort - this.pectoralEffort) * (1 - Math.exp(-1.1 * dt));
    this.pectoralScull += (this.scull - this.pectoralScull) * (1 - Math.exp(-2.2 * dt));
    if (this.pectoralPause > 0) this.pectoralPause -= dt;
    const beating = this.pectoralPause <= 0;
    // (Paused, the fans hold half spread and drift through the stroke slowly; beating again, the
    // power comes back within a beat.)
    // (A push, or braking, they beat the harder and a little quicker.)
    const push = Math.max(this.push, this.brake);
    this.pectoralPower += ((beating ? 1 + 0.45 * push : 0.14) - this.pectoralPower) * (1 - Math.exp(-(beating ? 7 : 4) * dt));
    const before = this.pectoralPhase;
    this.pectoralPhase += dt * TAU * (beating ? this.pectoralHz * (1 + 0.5 * this.back + 0.3 * push) : 0.7);
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
    // (Harder than an easy cruise only while darting.)
    const most = 1 + (STROKE_MOST - 1) * this.dart;
    return clamp(Math.max(this.bodyHz * tailSwing(this.effort) / CRUISE_STROKE, 0.15 * this.scull, KICK_STROKE * Math.abs(this.kick * kickSweep(this.kickAt, 1, this.kickSweeps))), 0, most);
  }
}
