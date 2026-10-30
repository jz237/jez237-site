// Globe-space locomotion. The Atelier supplies the anatomy, not the route.
// A seeded stream makes checks reproducible without a short repeating orbit.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const damp = (x, y, dt, rate) => x + (y - x) * (1 - Math.exp(-dt * rate));
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
/** Points (x, y, z, `stride` floats apart, from `start` to `end`) turned in place about the axis
 *  through the origin that `turn` points along, by its length (rad): Rodrigues. */
export function turnPoints(points, turn, start = 0, end = points.length, stride = 3) {
  const angle = Math.hypot(turn[0], turn[1], turn[2]);
  if (!(angle > 0)) return;
  const kx = turn[0] / angle, ky = turn[1] / angle, kz = turn[2] / angle, c = Math.cos(angle), s = Math.sin(angle);
  for (let i = start; i < end; i += stride) {
    const x = points[i], y = points[i + 1], z = points[i + 2], along = (kx * x + ky * y + kz * z) * (1 - c);
    points[i] = x * c + (ky * z - kz * y) * s + kx * along;
    points[i + 1] = y * c + (kz * x - kx * z) * s + ky * along;
    points[i + 2] = z * c + (kx * y - ky * x) * s + kz * along;
  }
}
/** The point of segment a-b nearest p. */
const nearestOn = (p, a, b) => {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const t = clamp(((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / Math.max(ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2, 1e-12), 0, 1);
  return [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t];
};
export const BETTA_SCALE = 0.105;

// Labyrinth fish gulp air at the free surface. The mouth sits MOUTH_AHEAD in front of
// the neck (the route point) and MOUTH_UP above its axis, in globe units.
export const GULP_PITCH = 0.85, GULP_LENGTH = 1.6, DIVE_LENGTH = 1.5, MOUTH_DEPTH = 0.003;
const MOUTH_AHEAD = 0.048, MOUTH_UP = 0.0087;
const MOUTH_REACH = Math.hypot(MOUTH_AHEAD, MOUTH_UP), MOUTH_PHASE = Math.atan2(MOUTH_UP, MOUTH_AHEAD);
export const bettaMouthHeight = (y, pitch) => y + MOUTH_AHEAD * Math.sin(pitch) + MOUTH_UP * Math.cos(pitch);
/** Where the lips are for a neck at `position` swimming along heading and pitch (sim frame). */
export const bettaMouth = (position, heading, pitch) => {
  const h = MOUTH_AHEAD * Math.cos(pitch) - MOUTH_UP * Math.sin(pitch);
  return [position[0] - Math.cos(heading) * h, bettaMouthHeight(position[1], pitch), position[2] + Math.sin(heading) * h];
};
/** The nose-up pitch that puts the lips at `height` when the neck is at `y`. */
const pitchForMouth = (y, height) => Math.asin(clamp((height - y) / MOUTH_REACH, -1, 1)) - MOUTH_PHASE;
/** Jaw opening and then the opercular pulse at `e` seconds into the gulp. */
export const gulpMouth = e => 1.1 * (smooth(0, 0.28, e) - smooth(0.62, 0.95, e));
export const gulpGillCover = e => Math.sin(Math.PI * clamp((e - 0.8) / 0.8, 0, 1)) ** 1.2;
const GULPING = new Set(['rise', 'gulp', 'dive']);
// It only turns as it travels, by its own swimming (forward, or backing on its pectorals): the nose
// comes round, up or down, along an arc no tighter than TURN_RADIUS sideways (the body curling round
// into it, as far as a U) and PITCH_RADIUS up or down (the trunk does not bend that way), so a turn
// it wants, it swims into, at up to TURN_SPEED. Only a startle's C-start and its sway at its
// reflection turn it where it is; the water may turn it as it will.
export const TURN_RADIUS = 0.05, PITCH_RADIUS = 0.08, TURN_SPEED = 0.1;
// Leaving the film nose up, it backs down off it at DIVE_BACK as it tips over, then swims on down.
export const DIVE_BACK = 0.07;
// Short of air (gasp, from gills the water has harmed), it goes up GASP_OFTEN times as often at
// the most, and from GASP_LINGER on it stays at the film for more gulps, up to GASP_GULPS more
// (each after a pause of GASP_PAUSE s, and up to as long again).
export const GASP_OFTEN = 6, GASP_LINGER = 0.4, GASP_GULPS = 8, GASP_PAUSE = 0.7;

// Slow, deliberate episodes that interrupt the route: facing its reflection in the glass with the
// fins flared, a lap round the globe, and settling on the sand. They need a measured, wet fish in an
// upright globe, so they never run blind; a startle or a due gulp cuts any of them short.
export const BEHAVIORS = new Set(['mirror', 'lap', 'rest']);
export const REST_HEIGHT = 0.074, LAP_SPEED = 0.058;
const MIRROR_REACH = 0.025, LAP_RADIUS = 0.78, LAP_LEAD = 0.55;
// Listless (lethargy, 0..1: a fish unwell in poor water), it goes down to the sand far more often
// and stays up to REST_LONGER times as long, lying a little over on its side; it swims slower, on
// shorter legs, and hovers more; from LISTLESS on it no longer displays or patrols; it takes a
// harder knock to startle it. Going down to lie, it lets itself sink (at SAG_RATE for each unit
// above where it settles, between SAG_SLOWEST and SAG_FASTEST units/s, from half way listless on),
// swimming forward at most SAG_STILL less.
export const REST_LONGER = 6, LISTLESS = 0.4;
const SAG_RATE = 0.6, SAG_SLOWEST = 0.01, SAG_FASTEST = 0.03, SAG_STILL = 0.85;

// A knock on the glass: water that changes faster than the fish is used to. Measured with the
// globe in hand, idle water reads 0, a gentle drag ~0.4, a brisk swipe ~1.3 and a flick 2+.
export const STARTLE_JOLT = 1.25, STARTLE_LENGTH = 0.9, STARTLE_COOLDOWN = 10, STARTLE_SPEED = 0.5;

// The fish only gains speed as fast as its tail (or sculling pectorals) is working: `stroke`, 0..1,
// is the host's measure of that, and speed can rise by at most STROKE_ACCEL x stroke per second. A
// still tail therefore cannot accelerate the body. Without a reading (headless runs) it is unlimited.
/** The slowest current a holding fish lets carry it (units/s): slower, it keeps its station. */
const HOLD_AGAINST = 0.12;
export const STROKE_ACCEL = 1.1;

// Goals are a real stride away across the water and within the slope the fish can climb, so it never
// has to circle a point above or below it. A net turn beyond SPIN_LIMIT rad (leaking away over ~6 s)
// is a spin, and is cut short by heading off in a straight line.
export const MIN_LEG = 0.22, MAX_SLOPE = 0.32, SPIN_LIMIT = 1.6 * Math.PI;
// Taking a pellet off the film, as bettas do: it comes in this far under the film, short of the
// pellet by the ground a rise covers (FEED_RISE for each unit of height: its head tipped up), and
// once it faces the pellet from there it tips up and rises to it, lips first. Held at the film
// without it for FEED_MISS (s), it has missed: it drops back and comes round again (FEED_AGAIN, s).
export const FEED_DEPTH = 0.1, FEED_RISE = 1.3, FEED_MISS = 0.8, FEED_AGAIN = 1.6;

export class BettaSwim {
  constructor(seed = 237) {
    this.seed = seed;
    this.position = [0.20, -0.17, 0.12];
    this.velocity = [0, 0, 0];
    this.target = [-0.34, -0.23, -0.18];
    this.heading = -0.35;
    this.pitch = this.angularVelocity = this.speed = this.time = 0;
    this.steerRate = this.roll = this.rollRate = this.pitchRate = 0;
    this.sharpTurn = false;
    this.yawAccum = 0;
    this.spinBreaks = 0;
    this.waterSpin = [0, 0, 0];
    this.drive = 0.045;
    this.mode = 'cruise';
    this.timer = 7;
    this.cruiseSpeed = 0.09;
    this.drift = [0, 0, 0];
    this.initialized = false;
    // Own random stream so the trips never perturb the swimming route.
    this.gulpSeed = (seed ^ 0x9e3779b9) >>> 0;
    this.behaviorSeed = (seed ^ 0x85ebca6b) >>> 0;
    this.nextGulp = 22 + this.gulpRandom() * 14;
    this.mirrorReady = 30 + this.behaviorRandom() * 25;
    this.lapReady = 70 + this.behaviorRandom() * 40;
    this.restReady = 50 + this.behaviorRandom() * 35;
    this.behaviorClock = this.holdClock = 0;
    this.flaring = false;
    this.mirrorPoint = [0, 0, 0];
    this.mirrorFace = 0; this.mirrorSide = 1; this.mirrorHold = 5; this.mirrorArrived = false;
    this.lapDir = 1; this.lapY = 0; this.lapAngle = this.lapTravelled = 0; this.lapLength = 2 * Math.PI;
    this.restY = 0; this.restHold = 8; this.restSettled = false;
    this.gulpClock = 0;
    this.gulp = this.gulpGill = 0;
    this.surfaceY = NaN;
    // The water the fish has got used to, to tell a sudden shove from a steady current or spin.
    this.flowRef = this.spinRef = null;
    this.jolt = 0;
    this.joltVector = [0, 0, 0];
    this.startleReady = 4;
    this.startleClock = 0;
    this.startleHeading = 0;
    this.startleDive = false;
    // Food (set by the host before each step: Betta.ts from FishFood): the pellet it is after (sim
    // frame) or null, and how wide its mouth is to open for it (0..1).
    this.food = null;
    this.gape = 0;
    this.feedHold = 0;
    this.feedRetry = 0;
    // What else is in the water (set by the host: the betta bowl's driftwood and plant), to keep
    // clear of: capsules { a, b, r }, sim frame.
    this.obstacles = [];
    // How much it has to do at the film (set by the host: the betta bowl's nest wanting rebuilding,
    // 0..1): it goes up for air sooner after each trip.
    this.gulpUrge = 0;
    // What the water is doing to it (set by the host: water/effects.ts, 0 in clear water): how
    // listless it is (lethargy) and how short of air (gasp).
    this.lethargy = 0;
    this.gasp = 0;
    // (When the wait for the next trip began; the gulps it has taken, and has still to take at the
    // film this trip; which side it lies over on as it rests.)
    this.gulpFrom = 0;
    this.gulps = 0;
    this.gulpsLeft = 0;
    this.restSide = 1;
  }

  /** How readily, listless, it goes down to lie, and how much it lets itself sink there rather than
   *  swim down (0..1: all of it from half way listless on). */
  get slump() {
    return Math.min(1, 2 * this.lethargy);
  }

  /** When it goes up for air next: sooner the shorter of air it is. */
  gulpDue() {
    return this.gasp > 0 ? this.gulpFrom + (this.nextGulp - this.gulpFrom) / (1 + (GASP_OFTEN - 1) * clamp(this.gasp, 0, 1)) : this.nextGulp;
  }

  /** Carried round as the bowl is turned about its own axis (turn: the turn this frame, rad, along
   *  that axis, sim frame): it keeps its place among the furnishings, as if the hand that turned the
   *  bowl had moved it with them. Where it is and is going, where it means to display, and the ways
   *  it faces turn with them; the water keeps its own motion, as the sim has it. */
  turnWith(turn) {
    for (const p of [this.position, this.velocity, this.target, this.mirrorPoint]) turnPoints(p, turn);
    // (Headings face along (-cos, sin) in x, z: a turn about the vertical adds to them; a bearing
    // round the axis, atan2(z, x), takes it away.)
    const yaw = turn[1];
    this.heading = wrap(this.heading + yaw);
    this.mirrorFace = wrap(this.mirrorFace + yaw);
    this.startleHeading = wrap(this.startleHeading + yaw);
    this.lapAngle = wrap(this.lapAngle - yaw);
  }

  /** How far p is outside the nearest obstacle (Infinity with none), and the way out from it. */
  obstacleGap(p) {
    let gap = Infinity, away = [0, 0, 0];
    for (const o of this.obstacles) {
      const q = nearestOn(p, o.a, o.b);
      const d = [p[0] - q[0], p[1] - q[1], p[2] - q[2]], l = Math.hypot(...d);
      if (l - o.r < gap) { gap = l - o.r; away = l > 1e-9 ? d.map(v => v / l) : [0, 1, 0]; }
    }
    return { gap, away };
  }

  /** The straight way from here to p keeps `margin` clear of every obstacle. */
  clearWay(p, margin) {
    if (!this.obstacles.length) return true;
    for (let k = 1; k <= 6; k++) {
      const t = k / 6;
      if (this.obstacleGap(this.position.map((v, i) => v + (p[i] - v) * t)).gap < margin) return false;
    }
    return true;
  }

  /** How sharply the water just changed, against what it has been doing for the last second. */
  readJolt(dt, water, wet) {
    const flow = water?.flow, spin = water?.angular;
    if (!flow || !spin || wet < 0.9) { this.flowRef = this.spinRef = null; this.joltVector = [0, 0, 0]; return 0; }
    if (!this.flowRef) { this.flowRef = [...flow]; this.spinRef = [...spin]; }
    const push = flow.map((v, k) => v - this.flowRef[k]);
    const twist = Math.hypot(...spin.map((v, k) => v - this.spinRef[k]));
    const follow = 1 - Math.exp(-1.5 * dt);
    for (let k = 0; k < 3; k++) { this.flowRef[k] += push[k] * follow; this.spinRef[k] += (spin[k] - this.spinRef[k]) * follow; }
    this.joltVector = push;
    return Math.max(Math.hypot(...push), 0.5 * twist);
  }

  /** C-start: bend away from the knock, then dart off along the new heading. */
  startStartle(env) {
    this.closeBehavior();
    const b = this.bounds(env), [px, py, pz] = this.joltVector;
    const along = Math.hypot(px, pz) > 0.3 * Math.hypot(px, py, pz);
    let turn = wrap((along ? Math.atan2(pz, -px) : this.heading + (this.random() < 0.5 ? -1.4 : 1.4)) - this.heading);
    if (Math.abs(turn) < 0.8) turn = (turn < 0 ? -1 : 1) * 0.8;
    turn = clamp(turn, -2.6, 2.6);
    // Keep the dart clear of the glass: an arbitrary swing to the glass side goes the other way,
    // then it tries the other headings around the choice.
    const clear = h => Math.hypot(this.position[0] - Math.cos(h) * 0.32, this.position[1], this.position[2] + Math.sin(h) * 0.32) <= b.radius;
    if (!along && !clear(this.heading + turn)) turn = -turn;
    let chosen = null;
    for (const offset of [0, 0.45, -0.45, 0.9, -0.9, 1.35, -1.35]) {
      const h = this.heading + turn + offset;
      if (clear(h)) { chosen = h; break; }
    }
    this.startleHeading = wrap(chosen ?? Math.atan2(-this.position[2], this.position[0]));
    this.startleDive = Number.isFinite(this.surfaceY) && this.surfaceY - this.position[1] < 0.1;
    this.mode = 'startle'; this.startleClock = 0; this.timer = 99; this.sharpTurn = false;
    this.startleReady = this.time + STARTLE_COOLDOWN;
    this.nextGulp = Math.max(this.nextGulp, this.time + 30 + this.gulpRandom() * 30);
  }

  streamRandom(key) {
    const keep = this.seed;
    this.seed = this[key];
    const value = this.random();
    this[key] = this.seed;
    this.seed = keep;
    return value;
  }

  gulpRandom() { return this.streamRandom('gulpSeed'); }
  behaviorRandom() { return this.streamRandom('behaviorSeed'); }

  /** Only a measured, wet fish in an upright globe takes part in these. */
  behaviorOk(water, wet, upright) {
    return !!water && upright && wet > 0.99 && (water.airAbove ?? 0) < 0.1 && Number.isFinite(water.sand);
  }

  /** Near the glass at the end of a leg, it stops to face its reflection with the fins flared. */
  tryMirror(b, ok) {
    if (!ok || this.lethargy >= LISTLESS || this.time < this.mirrorReady) return false;
    const [x, y, z] = this.position, horizontal = Math.hypot(x, z);
    const reach = Math.sqrt(Math.max(0, (b.radius + MIRROR_REACH) ** 2 - y * y));
    if (horizontal < 0.5 * reach || reach - horizontal > 0.22) return false;
    const nx = x / horizontal, nz = z / horizontal;
    if (nx * -Math.cos(this.heading) + nz * Math.sin(this.heading) < -0.5) return false;
    if (!this.clearWay([nx * reach, y, nz * reach], 0.05)) return false;
    if (this.behaviorRandom() > 0.6 * (1 - this.lethargy / LISTLESS)) return false;
    this.mode = 'mirror'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = this.holdClock = 0; this.mirrorArrived = false;
    this.mirrorPoint = [nx * reach, y, nz * reach];
    this.mirrorFace = Math.atan2(nz, -nx);
    this.mirrorSide = this.behaviorRandom() < 0.5 ? -1 : 1;
    this.mirrorHold = 4.5 + this.behaviorRandom() * 3.5;
    return true;
  }

  /** A slow circuit of the globe, as a fish makes of a place it is still getting to know. */
  tryLap(b, ok) {
    if (!ok || this.lethargy >= LISTLESS || this.time < this.lapReady) return false;
    const [x, y, z] = this.position;
    if (Math.hypot(x, z) < 0.2 || this.behaviorRandom() > 0.5 * (1 - this.lethargy / LISTLESS)) return false;
    this.mode = 'lap'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = 0; this.cruiseSpeed = LAP_SPEED;
    this.lapDir = this.behaviorRandom() < 0.5 ? -1 : 1;
    this.lapLength = Math.PI * (1.5 + this.behaviorRandom());
    this.lapY = clamp(y, b.low + 0.02, b.high - 0.04);
    this.lapAngle = Math.atan2(z, x); this.lapTravelled = 0;
    return true;
  }

  /** Now and then it sinks to the sand and stays there, fins easy, when it is over a place to lie;
   *  listless, it may go down besides (slumpDown). */
  tryRest(b, water, ok) {
    if (!ok) return false;
    if (this.slumpDown(b, water, ok)) return true;
    const y = water.sand + REST_HEIGHT;
    if (this.time < this.restReady) return false;
    if (!this.restRoom(b, this.position[0], y, this.position[2]) || this.behaviorRandom() > 0.5) return false;
    if (this.obstacleGap([this.position[0], y, this.position[2]]).gap < 0.1) return false;
    return this.lieDown(y);
  }

  /** Listless, whenever it stops it may go down to lie, the likelier the more listless it is
   *  (slump), if it can from where it is: its way down, and where that ends, clear. */
  slumpDown(b, water, ok) {
    if (!ok || !(this.lethargy > 0) || this.behaviorRandom() >= this.slump) return false;
    const y = water.sand + REST_HEIGHT;
    return !!this.restLanding(b, this.position, this.heading, y) && this.lieDown(y);
  }

  /** Goes down to lie on the sand (the neck at y) for a while: longer, listless, and leaning over. */
  lieDown(y) {
    this.mode = 'rest'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = this.holdClock = 0; this.restSettled = false;
    this.restY = y; this.restHold = (7 + this.behaviorRandom() * 7) * (1 + (REST_LONGER - 1) * this.lethargy);
    if (this.lethargy > 0) this.restSide = this.behaviorRandom() < 0.5 ? -1 : 1;
    return true;
  }

  /** Whether the neck has room to come to rest at (x, y, z) on the sand: clear of the glass (by
   *  less, the more listless it is: such a fish lies down anywhere it can). */
  restRoom(b, x, y, z) {
    return Math.hypot(x, z, y) <= b.radius - 0.05 + 0.08 * this.lethargy;
  }

  /** Going down to lie from `height` above where it settles, how far on it goes in each sixth of
   *  the height (nose low at first, levelling off as it arrives, as `sinking` steps it; listless,
   *  letting itself sink, less far: no further than this). */
  restRun(height) {
    const du = (height - 0.012) / 6;
    return Array.from({ length: 6 }, (_, k) => (du > 0 ? (du / Math.tan(Math.min(0.72, 0.12 + 2.5 * (height - (k + 0.5) * du)))) * (1 - SAG_STILL * this.slump) : 0));
  }

  /** Where it comes to lie (on the sand, the neck at y) going down from p with this heading; null
   *  if that, or the way there, is not clear (listless, it lies down right by things, or against
   *  them: clear only of their solid parts). */
  restLanding(b, p, heading, y) {
    const fx = -Math.cos(heading), fz = Math.sin(heading), q = [p[0], p[1], p[2]], runs = this.restRun(p[1] - y), near = 0.12 * this.lethargy;
    for (const run of runs) {
      q[0] += fx * run; q[1] -= (p[1] - y - 0.012) / 6; q[2] += fz * run;
      if (this.obstacleGap(q).gap < 0.05 - near) return null;
    }
    q[1] = y;
    return this.restRoom(b, q[0], y, q[2]) && this.obstacleGap(q).gap >= 0.1 - near ? q : null;
  }

  /** Listless and not where it can lie down, now and then it makes for a place to: the nearest of a
   *  few on the sand round about that it can come down to, swimming slowly to where it would go
   *  down from, a little lower than it is (there, stopping, it goes down). */
  seekRest(b, water, ok) {
    if (!ok || this.behaviorRandom() >= this.slump) return false;
    const y = water.sand + REST_HEIGHT, [x0, y0, z0] = this.position, from = clamp(y0 - 0.08, b.low, b.high);
    let best = null, nearest = Infinity;
    for (let k = 0; k < 12; k++) {
      const r = 0.45 * Math.sqrt(this.behaviorRandom()), a = 2 * Math.PI * this.behaviorRandom();
      const x = r * Math.cos(a), z = r * Math.sin(a), d = Math.hypot(x - x0, z - z0);
      if (d >= nearest || !this.restRoom(b, x, y, z) || this.obstacleGap([x, y, z]).gap < 0.1 - 0.12 * this.lethargy) continue;
      // (Coming at it from here, where it would go down from: short of it by its way down.)
      const heading = Math.atan2(z - z0, -(x - x0)), run = this.restRun(from - y).reduce((a, v) => a + v, 0);
      if (d < run + 0.15) continue;
      const start = [x - (x - x0) / d * run, from, z - (z - z0) / d * run];
      if (Math.hypot(start[0], start[2]) > Math.sqrt(Math.max(0, b.radius ** 2 - from * from)) || !this.clearWay(start, 0.06) || !this.restLanding(b, start, heading, y)) continue;
      best = start; nearest = d;
    }
    if (!best) return false;
    this.mode = 'cruise'; this.timer = 15; this.sharpTurn = false;
    this.target = best;
    this.cruiseSpeed = 0.06 * (1 - 0.55 * this.lethargy);
    return true;
  }

  lapGoal(b) {
    const y = this.lapY + 0.035 * Math.sin(2 * Math.PI * this.behaviorClock / 11);
    const rho = LAP_RADIUS * Math.sqrt(Math.max(0, b.radius ** 2 - y * y));
    const a = Math.atan2(this.position[2], this.position[0]) + this.lapDir * LAP_LEAD;
    return [rho * Math.cos(a), y, rho * Math.sin(a)];
  }

  /** Clocks and arrivals for the running episode; ends it when it is done or the water no longer allows it. */
  stepBehavior(dt, env, water, wet, upright) {
    if (!this.behaviorOk(water, wet, upright)) { this.endBehavior(env); return; }
    this.behaviorClock += dt;
    const [x, y, z] = this.position;
    if (this.mode === 'mirror') {
      const d = Math.hypot(...this.mirrorPoint.map((v, k) => v - this.position[k]));
      if (d < 0.16) this.flaring = true;
      if (!this.mirrorArrived && d < 0.05) { this.mirrorArrived = true; this.holdClock = 0; }
      if (this.mirrorArrived) this.holdClock += dt;
      if ((this.mirrorArrived && this.holdClock >= this.mirrorHold) || this.behaviorClock > 16) this.endBehavior(env);
    } else if (this.mode === 'lap') {
      const theta = Math.atan2(z, x);
      this.lapTravelled += this.lapDir * wrap(theta - this.lapAngle);
      this.lapAngle = theta;
      if (this.lapTravelled >= this.lapLength || this.behaviorClock > 90) this.endBehavior(env);
    } else if (this.mode === 'rest') {
      this.restY = water.sand + REST_HEIGHT;
      if (!this.restSettled && (y - this.restY < 0.012 || this.behaviorClock > 14)) { this.restSettled = true; this.holdClock = 0; }
      if (this.restSettled) this.holdClock += dt;
      if ((this.restSettled && this.holdClock >= this.restHold) || this.behaviorClock > 40 * (1 + (REST_LONGER - 1) * this.lethargy)) this.endBehavior(env);
    }
  }

  /** Stops a running episode where it stands: cooldown for next time, fins relaxed. */
  closeBehavior() {
    if (!BEHAVIORS.has(this.mode)) return;
    const wait = this.behaviorRandom();
    if (this.mode === 'mirror') this.mirrorReady = this.time + 60 + wait * 60;
    else if (this.mode === 'lap') this.lapReady = this.time + 120 + wait * 80;
    else this.restReady = this.time + 70 + wait * 60 - 0.6 * this.lethargy * (70 + wait * 60);
    this.mirrorReady = Math.max(this.mirrorReady, this.time + 15);
    this.lapReady = Math.max(this.lapReady, this.time + 20);
    this.restReady = Math.max(this.restReady, this.time + 20);
    this.flaring = false; this.mirrorArrived = false;
  }

  endBehavior(env) {
    this.closeBehavior();
    this.mode = 'glide'; this.timer = 1.1 + this.random() * 0.8; this.sharpTurn = false;
    this.chooseTarget(env);
  }

  random() {
    this.seed = (this.seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this.seed ^ this.seed >>> 15, 1 | this.seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  bounds(env) {
    const low = env.sandLevel + 0.22, high = env.level - 0.20;
    return { radius: Math.max(0.1, env.radius - 0.34), low: Math.min(low, high), high };
  }

  chooseTarget(env) {
    const b = this.bounds(env);
    // Usually investigate water ahead, as the koi does; an occasional reversal
    // is deliberate, not a fresh arbitrary spin at every waypoint.
    const reverse = this.random() < 0.18;
    // (Listless, it goes less far, and keeps low over the middle, where the sand is to lie on.)
    const L = this.lethargy, stride = 0.45 * (1 - 0.45 * L);
    let best = -Infinity, found = false;
    for (let attempt = 0; attempt < 16; attempt++) {
      const y = b.low + (b.high - b.low) * (0.08 + 0.84 * this.random());
      const r = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * Math.sqrt(this.random()) * 0.86;
      const a = this.random() * Math.PI * 2;
      const candidate = [r * Math.cos(a), y, r * Math.sin(a)];
      const delta = candidate.map((v, i) => v - this.position[i]), distance = Math.hypot(...delta);
      const ahead = (-delta[0] * Math.cos(this.heading) + delta[2] * Math.sin(this.heading)) / Math.max(distance, 1e-6);
      let score = ahead * (reverse ? -0.7 : 0.8) + this.random() * 0.45 - Math.abs(distance - stride) - (distance < 0.22 ? 2 : 0);
      if (L > 0) score -= L * (1.5 * (y - b.low) / Math.max(b.high - b.low, 1e-6) + 3 * Math.max(0, r - 0.22));
      // A goal almost overhead or underfoot cannot be reached by turning; it only makes the fish circle it.
      const leg = Math.hypot(delta[0], delta[2]);
      if (leg < MIN_LEG || Math.abs(delta[1]) > MAX_SLOPE * leg + 0.05) continue;
      if (!this.clearWay(candidate, 0.06)) continue;
      if (score > best) { best = score; this.target = candidate; found = true; }
    }
    if (!found) this.target = this.targetAhead(b, 0.4);
    this.cruiseSpeed = (0.065 + this.random() * 0.045) * (1 - 0.55 * L);
  }

  /** The plan for food, this step: where the neck is to go, which way the head is to turn (from
   *  the lips, and how near the pellet is to them in plan), and whether it is rising to it. One
   *  on the film it takes from below: it lines up under the film a rise's length short of the
   *  pellet (from too near, it swims out a way first), turns to it, then rises to it. */
  feedPlan(holdY, fx, fz) {
    const [x, y, z] = this.food;
    const lips = bettaMouth(this.position, this.heading, this.pitch);
    const dx = x - lips[0], dz = z - lips[2], plan = Math.hypot(dx, dz);
    const bearing = Math.atan2(dz, -dx);
    if (!this.foodAtFilm()) return { goal: [x - fx * MOUTH_AHEAD, y - MOUTH_UP, z - fz * MOUTH_AHEAD], yaw: bearing, plan, strike: false };
    const deep = this.surfaceY - MOUTH_DEPTH - lips[1];
    const facing = Math.cos(bearing - this.heading);
    const run = FEED_RISE * Math.max(0, deep - 0.01);
    const strike = this.time >= this.feedRetry && (plan < 0.03 || (facing > 0.85 && plan < run + 0.05 && plan > 0.6 * run - 0.02));
    if (strike) return { goal: [x - fx * MOUTH_AHEAD, holdY, z - fz * MOUTH_AHEAD], yaw: bearing, plan, strike: true };
    const nx = x - this.position[0], nz = z - this.position[2], np = Math.max(Math.hypot(nx, nz), 1e-6);
    const standoff = FEED_RISE * FEED_DEPTH + MOUTH_AHEAD;
    const goal = [x - nx / np * standoff, Math.min(holdY, this.surfaceY - FEED_DEPTH), z - nz / np * standoff];
    const gx = goal[0] - this.position[0], gz = goal[2] - this.position[2];
    // (At the standoff, it turns to the pellet.)
    const yaw = Math.hypot(gx, gz) < 0.05 ? bearing : Math.atan2(gz, -gx);
    return { goal, yaw, plan: Math.max(plan, Math.hypot(gx, gz)), strike: false };
  }

  foodAtFilm() {
    return !!this.food && Number.isFinite(this.surfaceY) && this.food[1] > this.surfaceY - 0.03;
  }

  /** A point straight along the current heading, kept inside the swimming volume. */
  targetAhead(b, reach) {
    let x = this.position[0] - Math.cos(this.heading) * reach, z = this.position[2] + Math.sin(this.heading) * reach;
    const y = clamp(this.position[1], b.low, b.high);
    const limit = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * 0.86, h = Math.hypot(x, z);
    if (h > limit) { x *= limit / h; z *= limit / h; }
    return [x, y, z];
  }

  /**
   * @param {any} [water]
   * @param {number | null} [stroke] how hard the tail/pectorals are working, 0..1; null = no reading, no limit
   */
  advance(dt, flow, env, submerged = true, water = null, stroke = null) {
    if (!(dt > 0)) return;
    // Bounded substeps keep tab stalls and different display rates stable.
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-8) {
      const step = Math.min(1 / 60, remaining);
      this.step(step, flow, env, submerged, water, stroke);
      remaining -= step;
    }
  }

  /**
   * @param {any} water
   * @param {number | null} [stroke]
   */
  step(dt, flow, env, submerged, water, stroke = null) {
    const b = this.bounds(env);
    if (!this.initialized) {
      this.position[1] = clamp(this.position[1], b.low, b.high);
      this.target[1] = clamp(this.target[1], b.low, b.high);
      this.initialized = true;
    }
    this.time += dt;
    this.timer -= dt;
    // A trip to the surface needs a measured, calm, level free surface above an
    // upright globe; without those readings (or in a tilted globe) it never starts.
    const gravity = env.gravity ?? [0, -24, 0], g = Math.hypot(...gravity);
    const surface = water?.surface;
    const upright = g > 1 && -gravity[1] > 0.985 * g;
    const surfaceOk = Number.isFinite(surface) && Math.abs(surface - env.level) < 0.04 && upright;
    if (surfaceOk) this.surfaceY = Number.isFinite(this.surfaceY) ? damp(this.surfaceY, surface, dt, 6) : surface;
    const wetNow = water?.submerged ?? (submerged ? 1 : 0);
    this.jolt = this.readJolt(dt, water, wetNow);
    // (Listless, it takes a harder knock to startle it.)
    if (this.mode !== 'startle' && this.jolt > STARTLE_JOLT * (1 + 1.5 * this.lethargy) && this.time >= this.startleReady && (water.airAbove ?? 0) < 0.6) this.startStartle(env);
    if (this.mode === 'startle') {
      this.startleClock += dt;
      if (this.startleClock >= STARTLE_LENGTH) {
        this.mode = 'glide'; this.timer = 1.2 + this.random() * 0.8; this.sharpTurn = false;
        this.chooseTarget(env);
      }
    }
    const startling = this.mode === 'startle';
    // Food: it goes for it, from whatever it was doing (but fleeing). Once it is eaten (or gone) it
    // tips down off the film, or swims on.
    if (this.food && !startling && this.mode !== 'feed' && wetNow > 0.9) {
      this.closeBehavior();
      this.mode = 'feed'; this.timer = 99; this.sharpTurn = false;
    } else if (this.mode === 'feed' && !this.food && this.gape < 0.5) {
      const high = Number.isFinite(this.surfaceY) && this.surfaceY - this.position[1] < 0.1;
      this.mode = high ? 'dive' : 'glide';
      this.timer = high ? DIVE_LENGTH : 1 + this.random() * 0.6;
      if (!high) this.chooseTarget(env);
    }
    const feeding = this.mode === 'feed';
    let gulping = GULPING.has(this.mode);
    // Too near the film to tip up to the lips' angle: it swims on and goes when it has room.
    const due = this.gulpDue();
    if (!gulping && !feeding && this.time >= due && surfaceOk && this.surfaceY - this.position[1] > 0.07 && wetNow > 0.99 && (water.airAbove ?? 0) < 0.25 && this.mode !== 'burst' && !this.sharpTurn) {
      this.closeBehavior();
      this.mode = 'rise'; this.gulpClock = 0; this.timer = 9; gulping = true;
    }
    if (BEHAVIORS.has(this.mode)) this.stepBehavior(dt, env, water, wetNow, upright);
    const behaving = BEHAVIORS.has(this.mode), ok = this.behaviorOk(water, wetNow, upright);
    // An episode that a due gulp would cut short does not start (listless, it lies down for the
    // little while it has).
    const free = surfaceOk ? due - this.time : Infinity;
    const L = this.lethargy, briefly = 1 - 0.8 * L;
    // The lips' height above the neck grows with the nose-up pitch, so the target tracks it.
    const holdY = this.surfaceY - MOUTH_DEPTH - bettaMouthHeight(0, clamp(this.pitch, 0, GULP_PITCH + 0.1));
    let rise = holdY - this.position[1];
    if (gulping) {
      this.gulpClock += dt;
      if (this.mode !== 'dive' && (!surfaceOk || wetNow < 0.5)) { this.mode = 'dive'; this.timer = DIVE_LENGTH; }
      else if (this.mode === 'rise' && ((Math.abs(rise) < 0.012 && this.pitch > 0.7) || this.timer <= 0)) {
        if (Math.abs(rise) < 0.04) {
          this.mode = 'gulp'; this.gulpClock = 0; this.gulps++;
          // (Short of air, it means to stay at the film a while.)
          this.gulpsLeft = this.gasp > GASP_LINGER ? Math.round(GASP_GULPS * (this.gasp - GASP_LINGER) / (1 - GASP_LINGER) * (0.4 + 0.6 * this.gulpRandom())) : 0;
        }
        else { this.mode = 'dive'; this.timer = DIVE_LENGTH; }
      } else if (this.mode === 'gulp' && this.gulpClock >= GULP_LENGTH) {
        // Lingering, it takes the next after a pause, its mouth shut (the clock runs up to it).
        if (this.gulpsLeft > 0) { this.gulpsLeft--; this.gulps++; this.gulpClock = -GASP_PAUSE * (1 + this.gulpRandom()); }
        else { this.mode = 'dive'; this.timer = DIVE_LENGTH; }
      } else if (this.mode === 'dive' && this.timer <= 0) {
        // (On down and away, swimming: coasting nose down from the dive, the tail stilled, it would
        // seem to sink rather than swim. Listless, only a little way, before it settles again.)
        this.mode = 'cruise'; this.timer = (6 + this.random() * 5) * (1 - 0.8 * clamp(this.lethargy, 0, 1));
        this.nextGulp = this.time + (60 + this.gulpRandom() * 50) * (1 - 0.75 * clamp(this.gulpUrge, 0, 1));
        this.gulpFrom = this.time;
        this.chooseTarget(env);
        gulping = false;
      }
    }
    const toTarget = this.target.map((v, i) => v - this.position[i]);
    let distance = Math.hypot(...toTarget);
    // Passing over or under the goal counts as arriving: there is nothing left to turn towards.
    const reached = distance < 0.075 || Math.hypot(toTarget[0], toTarget[2]) < 0.05;
    if (!gulping && !startling && !behaving && !feeding && (this.timer <= 0 || (this.mode !== 'hover' && reached))) {
      if (this.mode === 'hover') {
        if (!this.tryLap(b, ok && free > 25) && !this.slumpDown(b, water, ok && free > 30 * briefly)) {
          this.mode = this.random() < 0.18 * (1 - L) ? 'burst' : 'cruise';
          this.timer = this.mode === 'burst' ? 0.65 + this.random() * 0.45 : 6 + this.random() * 5;
          this.chooseTarget(env);
        }
      } else if (this.mode === 'burst') {
        this.mode = 'glide'; this.timer = 1.2 + this.random();
      } else if (!this.tryMirror(b, ok && free > 16) && !this.tryRest(b, water, ok && free > 30 * briefly) && !(L > 0 && this.seekRest(b, water, ok && free > 30 * briefly))) {
        this.mode = 'hover'; this.timer = (1.8 + this.random() * 3) * (1 + 2 * L);
      }
    }
    // Look ahead and steer away before the body/tail reach the glass or bed.
    const fx = -Math.cos(this.heading), fz = Math.sin(this.heading);
    const look = this.position.map((v, i) => v + (i === 0 ? fx : i === 2 ? fz : 0) * (0.10 + this.speed * 0.8));
    // Facing the glass or lying on the sand is deliberate, not a near miss.
    // (Swallowing, the pellet already on its way in, it holds where it is.)
    const swallowing = feeding && !this.food;
    let feed = feeding && this.food ? this.feedPlan(holdY, fx, fz) : null;
    // Held at the film without the pellet: a miss. It drops back and comes round again.
    if (feed?.strike && rise < 0.006) this.feedHold += dt; else this.feedHold = 0;
    if (this.feedHold > FEED_MISS) { this.feedHold = 0; this.feedRetry = this.time + FEED_AGAIN; feed = this.feedPlan(holdY, fx, fz); }
    const striking = !!feed?.strike;
    const climbing = this.mode === 'rise' || this.mode === 'gulp' || striking;
    // The head is deliberately at the surface during a trip, so air above it is not an emergency.
    const escaping = !climbing && (!submerged || (water?.airAbove ?? 0) > 0.25);
    // Settling is a swim down to the sand, nose low on working fins, levelling off as it arrives.
    const descent = this.mode === 'rest' ? this.position[1] - this.restY : 0;
    const sinking = this.mode === 'rest' && !escaping && descent > 0.007;
    // (Listless, it lets itself sink down to it, nose a little low, all but in place: SAG.)
    const sags = sinking && L > 0;
    const nearWall = this.mode !== 'mirror' && !feeding && (this.mode !== 'rest' || sinking) && Math.hypot(...look) > b.radius;
    // (Nose for an obstacle ahead: it veers off, out from it and on round, from as far off as it needs
    // to come round.)
    const ahead = this.obstacles.length && !escaping && this.mode !== 'rest' ? this.obstacleGap(look) : null;
    // (The veer grows as the gap closes, so it never flicks on and off at an edge and jerks the nose.)
    const veer = ahead && !nearWall ? smooth(0.08 + TURN_RADIUS, 0.04, ahead.gap) : 0;
    let goal = this.target;
    if (feed) goal = feed.goal;
    else if (swallowing) goal = [...this.position];
    else if (climbing) goal = [this.position[0] + fx * 0.3, holdY, this.position[2] + fz * 0.3];
    else if (this.mode === 'dive') goal = [this.position[0] + fx * 0.2, clamp(this.position[1] - 0.25, b.low, b.high), this.position[2] + fz * 0.2];
    else if (this.mode === 'mirror') goal = this.mirrorPoint;
    else if (this.mode === 'lap') goal = this.lapGoal(b);
    else if (this.mode === 'rest') goal = [this.position[0] + fx * 0.3, this.restY, this.position[2] + fz * 0.3];
    if (startling) goal = [this.position[0] - Math.cos(this.startleHeading) * 0.3, this.position[1], this.position[2] + Math.sin(this.startleHeading) * 0.3];
    else if (nearWall) goal = [-this.position[0] * 0.45, clamp(this.position[1], b.low, b.high), -this.position[2] * 0.45];
    else if (veer > 0) {
      const away = [this.position[0] + ahead.away[0] * 0.3 + fx * 0.1, this.position[1] + Math.max(ahead.away[1], 0) * 0.15, this.position[2] + ahead.away[2] * 0.3 + fz * 0.1];
      goal = goal.map((v, k) => v + (away[k] - v) * veer);
    }
    if (escaping) goal = water ? [water.centroid[0], water.centroid[1] - 0.06, water.centroid[2]] : [this.position[0] * 0.6, b.low + 0.025, this.position[2] * 0.6];
    const delta = goal.map((v, i) => v - this.position[i]);
    distance = Math.hypot(...delta);
    // The bearing to a goal is meaningless once it is nearly overhead or underfoot, and chasing it is
    // what makes a fish circle: the nearer the goal is in plan, the less the heading follows it.
    let yawError = wrap(Math.atan2(delta[2], -delta[0]) - this.heading) * smooth(0.03, 0.12, Math.hypot(delta[0], delta[2]));
    // Parked at the glass it works at its reflection: head turned a little off square, swaying to and fro.
    // Going for food, the head turns as the plan says (to the pellet itself from the lips, close in).
    if (feed) yawError = wrap(feed.yaw - this.heading) * smooth(0.004, 0.02, feed.plan);
    const parked = this.mode === 'mirror' && this.mirrorArrived && !escaping;
    if (parked) yawError = wrap(this.mirrorFace + this.mirrorSide * 0.5 + 0.2 * Math.sin(2 * Math.PI * 0.55 * this.holdClock) - this.heading);
    const holding = (this.mode === 'hover' || this.mode === 'gulp' || swallowing || (this.mode === 'rest' && !sinking)) && !nearWall && !escaping;
    const still = holding || parked;
    if (startling) this.sharpTurn = false;
    else if (holding || Math.abs(yawError) < 0.3) this.sharpTurn = false;
    else if (Math.abs(yawError) > 1.9) this.sharpTurn = true;
    const maxRate = startling ? 9 : this.sharpTurn ? 3.0 : 0.9 + this.speed * 3;
    const wantedRate = holding ? 0 : clamp(yawError * (startling ? 10 : this.sharpTurn ? 3.5 : 1.8), -maxRate, maxRate);
    for (let k = 0; k < 3; k++) this.waterSpin[k] = damp(this.waterSpin[k], water?.angular[k] ?? 0, dt, 5);
    const angularAcceleration = startling ? 80 : this.sharpTurn ? 9 : 3;
    this.steerRate += clamp(wantedRate - this.steerRate, -angularAcceleration * dt, angularAcceleration * dt);
    // (No faster than its swimming carries it round.)
    if (!startling && !parked) this.steerRate = clamp(this.steerRate, -Math.abs(this.speed) / TURN_RADIUS, Math.abs(this.speed) / TURN_RADIUS);
    this.angularVelocity = this.steerRate + this.waterSpin[1] * 0.8;
    this.heading += this.angularVelocity * dt;
    // Failsafe: the fish's own net turn over the last few seconds. Several turns' worth is a spin
    // (a goal it cannot settle towards), so it gives that goal up and swims straight on.
    if (startling || gulping || behaving) this.yawAccum = 0;
    else {
      this.yawAccum = this.yawAccum * Math.exp(-dt / 6) + this.steerRate * dt;
      if (Math.abs(this.yawAccum) > SPIN_LIMIT) {
        this.spinBreaks++;
        this.yawAccum = 0; this.sharpTurn = false;
        this.target = this.targetAhead(b, 0.4);
      }
    }
    let pitchTarget = still ? 0 : clamp(Math.atan2(delta[1], Math.hypot(delta[0], delta[2])), escaping || feeding ? -0.6 : -0.32, feeding ? 0.85 : 0.32);
    if (sinking) pitchTarget = -clamp(0.12 + 2.5 * descent, 0, 0.72) * (1 - 0.65 * this.slump);
    // At the film the lips are trimmed by the tilt of the head alone, which moves them without moving the body.
    const lipTrim = clamp(pitchForMouth(this.position[1], this.surfaceY - MOUTH_DEPTH), GULP_PITCH - 0.1, GULP_PITCH + 0.1);
    if (this.mode === 'rise') pitchTarget = rise > 0.1 ? 0.62 : lipTrim;
    else if (this.mode === 'gulp') pitchTarget = lipTrim;
    else if (this.mode === 'dive') pitchTarget = -0.55;
    // Under a pellet on the film, the head tips up to it as for a gulp.
    if (striking) pitchTarget = rise > 0.06 ? 0.62 : lipTrim;
    // Fleeing from the film, it dives so the snout never breaks the surface on the way out.
    if (startling && this.startleDive) pitchTarget = -0.45;
    const oldPitch = this.pitch, oldRoll = this.roll;
    const pitchSpin = -this.waterSpin[2] * Math.cos(this.heading) - this.waterSpin[0] * Math.sin(this.heading);
    // (Leaving the film it tips over quickly, as fast as backing off it carries it round.)
    const pitchPace = startling ? 8 : this.mode === 'dive' ? 4.5 : 2.4, pitchMost = Math.abs(this.speed) / PITCH_RADIUS * dt;
    this.pitch = clamp(this.pitch + clamp(damp(this.pitch, pitchTarget, dt, pitchPace) - this.pitch, -pitchMost, pitchMost) + pitchSpin * dt * 0.8, -0.75, gulping || striking ? 0.95 : 0.75);
    const rollSpin = this.waterSpin[0] * Math.cos(this.heading) - this.waterSpin[2] * Math.sin(this.heading);
    // (Lying listless on the sand, it leans over a little onto one side, over a few seconds.)
    const lean = L > 0 && this.mode === 'rest' && this.restSettled ? 0.32 * L * this.restSide * smooth(0, 3, this.holdClock) : 0;
    this.roll = clamp(damp(this.roll, lean, dt, 2.6) + rollSpin * dt * 0.8, -0.65, 0.65);
    this.pitchRate = (this.pitch - oldPitch) / dt;
    this.rollRate = (this.roll - oldRoll) / dt;
    // Down to the sand along the nose-down axis: the vertical rate eases off with the height left.
    const sinkSpeed = Math.min(0.09, clamp(1.2 * (descent - 0.004), 0, 0.06) / Math.max(0.1, Math.sin(-pitchTarget)));
    let desiredSpeed = sinking ? sinkSpeed * (1 - SAG_STILL * this.slump) : this.mode === 'burst' ? 0.19 * (1 - 0.4 * L) : this.mode === 'glide' ? 0.04 : feeding ? 0.21 * (1 - 0.5 * L) : this.cruiseSpeed;
    if (still) desiredSpeed = 0;
    else desiredSpeed *= (0.12 + 0.88 * Math.max(0, Math.cos(yawError))) * clamp(distance / 0.14, 0.25, 1);
    // Every speed is along the body axis; at the film the fins only creep it up the last millimetres.
    if (this.mode === 'rise') desiredSpeed = rise > 0 ? clamp(rise * 2.5, 0.006, 0.2) : 0;
    else if (this.mode === 'gulp') desiredSpeed = rise > 0.002 ? clamp(rise * 3, 0, 0.03) : 0;
    else if (this.mode === 'dive') desiredSpeed = this.pitch > 0.12 ? -DIVE_BACK : 0.17;
    // Rising to a pellet, quickly at first; the last millimetres the fins creep it up, as for a gulp.
    else if (striking) desiredSpeed = rise > 0 ? clamp(rise * 2.5, 0.01, 0.14) : 0;
    // The dart starts once the head has swung round, then the speed decays into a glide.
    if (startling) desiredSpeed = STARTLE_SPEED * Math.max(0, Math.cos(yawError)) ** 2 * Math.exp(-Math.max(0, this.startleClock - 0.12) / 0.45) * (1 - 0.5 * L);
    if (escaping) desiredSpeed = Math.max(desiredSpeed, 0.16);
    // A turn it wants it swims into, fast enough to come round on its arc (not at the film, lying on
    // the sand or at its reflection, where it keeps the angle it came with).
    const settledDown = this.mode === 'rest' && !sinking;
    if (!startling && desiredSpeed >= 0 && !climbing && this.mode !== 'gulp' && !swallowing && !settledDown && !parked) {
      desiredSpeed = Math.max(desiredSpeed, Math.min(TURN_SPEED, Math.max(Math.abs(wantedRate) * TURN_RADIUS, Math.abs(pitchTarget - this.pitch) * pitchPace * PITCH_RADIUS)));
    }
    // What the tail is asked for (backing off the film, the pectorals).
    const intent = desiredSpeed;
    let nextSpeed = damp(this.speed, desiredSpeed, dt, startling ? 14 : desiredSpeed > this.speed ? 2.8 : 3.5);
    // Speed is only gained as fast as the tail is working; slowing down is drag, and costs nothing.
    if (!startling && stroke !== null && nextSpeed > this.speed) nextSpeed = Math.min(nextSpeed, this.speed + STROKE_ACCEL * clamp(stroke, 0, 1) * dt);
    this.speed = nextSpeed;
    // Same neutral-buoyancy inertia and finite station-keeping as the koi:
    // follow the full current with a 0.9s lag, not a capped 0.075-unit/s offset.
    const wet = water?.submerged ?? (submerged ? 1 : 0);
    if (wet > 0) for (let k = 0; k < 3; k++) this.drift[k] = damp(this.drift[k], flow[k], dt, 1 / 0.9);
    const driftSpeed = Math.hypot(...this.drift), hold = Math.max(0, driftSpeed - 0.15 * 0.42);
    if (wet > 0.99 && hold > 0) for (let k = 0; k < 3; k++) this.drift[k] *= 1 - Math.min(1, 1.6 * dt * hold / driftSpeed);
    // Weight only takes hold once the fish is well out of the water. A tail that briefly clears the
    // film (as the head tips down after a gulp) is still held up by the rest of the body.
    const dry = smooth(0.35, 0.9, 1 - wet);
    if (water && dry > 0) for (let k = 0; k < 3; k++) this.drift[k] += (env.gravity?.[k] ?? (k === 1 ? -24 : 0)) * dry * dt;
    const speedLimit = Math.hypot(...this.drift);
    if (speedLimit > 1.2) for (let k = 0; k < 3; k++) this.drift[k] *= 1.2 / speedLimit;
    const direction = [-Math.cos(this.heading) * Math.cos(this.pitch), Math.sin(this.pitch), Math.sin(this.heading) * Math.cos(this.pitch)];
    const old = [...this.position];
    for (let k = 0; k < 3; k++) this.position[k] += (direction[k] * this.speed + this.drift[k]) * dt;
    if (sags) this.position[1] -= this.slump * clamp(SAG_RATE * descent, SAG_SLOWEST, SAG_FASTEST) * dt;
    // Once settled on the sand, let the current go by; holding still in the water (hovering,
    // taking air, swallowing, displaying at the glass), work against a slow one (a bowl's gentle
    // circulation, not a slosh, which carries it) and keep station.
    if (this.mode === 'rest' && this.restSettled) for (let k = 0; k < 3; k++) this.drift[k] *= Math.exp(-4 * dt);
    else if (still && wet > 0.99 && Math.hypot(...flow) < HOLD_AGAINST) for (let k = 0; k < 3; k++) this.drift[k] *= Math.exp(-3 * dt);
    const open = this.mode === 'gulp' ? gulpMouth(this.gulpClock) : feeding ? this.gape : 0, pulse = this.mode === 'gulp' ? gulpGillCover(this.gulpClock) : 0;
    this.gulp = damp(this.gulp, open, dt, 25);
    this.gulpGill = damp(this.gulpGill, pulse, dt, 25);
    // Real water has no fixed horizontal ceiling when the globe is tilted.
    // Density probes steer it back into water; actual bed/glass contacts stop it.
    const floor = water ? water.sand + 0.07 : b.low;
    this.position[1] = clamp(this.position[1], floor, water ? env.radius - 0.25 : b.high);
    if (this.position[1] <= floor && this.drift[1] < 0) this.drift[1] = 0;
    const horizontal = Math.hypot(this.position[0], this.position[2]);
    const radius = water ? env.radius - (feeding ? 0.2 : 0.29) : b.radius;
    this.position[1] = clamp(this.position[1], -radius, radius);
    const limit = Math.sqrt(Math.max(0, radius ** 2 - this.position[1] ** 2));
    if (horizontal > limit) {
      this.position[0] *= limit / horizontal; this.position[2] *= limit / horizontal;
      const n = Math.hypot(...this.position), outward = this.drift.reduce((sum, v, k) => sum + v * this.position[k] / n, 0);
      if (outward > 0) for (let k = 0; k < 3; k++) this.drift[k] -= outward * this.position[k] / n;
    }
    // (Never into one: the neck is held out of its core, as it is off the glass.)
    for (const o of this.obstacles) {
      const q = nearestOn(this.position, o.a, o.b);
      const d = this.position.map((v, k) => v - q[k]), l = Math.hypot(...d), r = o.r * 0.6;
      if (l >= r || l < 1e-9) continue;
      const n = d.map(v => v / l), into = this.drift.reduce((sum, v, k) => sum + v * n[k], 0);
      for (let k = 0; k < 3; k++) {
        this.position[k] = q[k] + n[k] * r;
        if (into < 0) this.drift[k] -= into * n[k];
      }
    }
    this.velocity = this.position.map((v, i) => (v - old[i]) / dt);
    // The tail follows what the fish means to do, not the speed it has reached: it leads a start and
    // eases off at once for a glide. A startle is the exception, and swims as fast as it flies.
    const effortSpeed = startling ? Math.max(this.speed, intent) : intent;
    const turning = intent > 0.004 && (holding || this.mode === 'glide');
    this.drive = this.mode === 'glide' && !turning ? 0.065 : parked ? 0.08 : settledDown ? 0.03 : holding && !turning ? 0.045 : clamp(0.07 + effortSpeed * 1.4 + Math.abs(this.steerRate) * 0.06, 0.045, 0.40);
  }
}
