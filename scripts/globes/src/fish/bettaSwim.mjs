// Globe-space locomotion. The Atelier supplies the anatomy, not the route.
// A seeded stream makes checks reproducible without a short repeating orbit.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const damp = (x, y, dt, rate) => x + (y - x) * (1 - Math.exp(-dt * rate));
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const BETTA_SCALE = 0.105;

// Labyrinth fish gulp air at the free surface. The mouth sits MOUTH_AHEAD in front of
// the neck (the route point) and MOUTH_UP above its axis, in globe units.
export const GULP_PITCH = 0.85, GULP_LENGTH = 1.6, MOUTH_DEPTH = 0.003;
const MOUTH_AHEAD = 0.048, MOUTH_UP = 0.0087;
export const bettaMouthHeight = (y, pitch) => y + MOUTH_AHEAD * Math.sin(pitch) + MOUTH_UP * Math.cos(pitch);
/** Jaw opening and then the opercular pulse at `e` seconds into the gulp. */
export const gulpMouth = e => 1.1 * (smooth(0, 0.28, e) - smooth(0.62, 0.95, e));
export const gulpGillCover = e => Math.sin(Math.PI * clamp((e - 0.8) / 0.8, 0, 1)) ** 1.2;
const GULPING = new Set(['rise', 'gulp', 'dive']);

// A knock on the glass: water that changes faster than the fish is used to. Measured with the
// globe in hand, idle water reads 0, a gentle drag ~0.4, a brisk swipe ~1.3 and a flick 2+.
export const STARTLE_JOLT = 1.25, STARTLE_LENGTH = 0.9, STARTLE_COOLDOWN = 10, STARTLE_SPEED = 0.5;

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
    this.waterSpin = [0, 0, 0];
    this.drive = 0.045;
    this.mode = 'cruise';
    this.timer = 7;
    this.cruiseSpeed = 0.09;
    this.drift = [0, 0, 0];
    this.initialized = false;
    // Own random stream so the trips never perturb the swimming route.
    this.gulpSeed = (seed ^ 0x9e3779b9) >>> 0;
    this.nextGulp = 22 + this.gulpRandom() * 14;
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
    const b = this.bounds(env), [px, py, pz] = this.joltVector;
    const along = Math.hypot(px, pz) > 0.3 * Math.hypot(px, py, pz);
    let turn = wrap((along ? Math.atan2(pz, -px) : this.heading + (this.random() < 0.5 ? -1.4 : 1.4)) - this.heading);
    if (Math.abs(turn) < 0.8) turn = (turn < 0 ? -1 : 1) * 0.8;
    turn = clamp(turn, -2.6, 2.6);
    // Keep the dart clear of the glass: try the other headings around the first choice.
    let chosen = null;
    for (const offset of [0, 0.45, -0.45, 0.9, -0.9, 1.35, -1.35]) {
      const h = this.heading + turn + offset;
      const x = this.position[0] - Math.cos(h) * 0.32, z = this.position[2] + Math.sin(h) * 0.32;
      if (Math.hypot(x, this.position[1], z) <= b.radius) { chosen = h; break; }
    }
    this.startleHeading = wrap(chosen ?? Math.atan2(-this.position[2], this.position[0]));
    this.startleDive = Number.isFinite(this.surfaceY) && this.surfaceY - this.position[1] < 0.1;
    this.mode = 'startle'; this.startleClock = 0; this.timer = 99; this.sharpTurn = false;
    this.startleReady = this.time + STARTLE_COOLDOWN;
    this.nextGulp = Math.max(this.nextGulp, this.time + 30 + this.gulpRandom() * 30);
  }

  gulpRandom() {
    const keep = this.seed;
    this.seed = this.gulpSeed;
    const value = this.random();
    this.gulpSeed = this.seed;
    this.seed = keep;
    return value;
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
    let best = -Infinity;
    for (let attempt = 0; attempt < 16; attempt++) {
      const y = b.low + (b.high - b.low) * (0.08 + 0.84 * this.random());
      const r = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * Math.sqrt(this.random()) * 0.86;
      const a = this.random() * Math.PI * 2;
      const candidate = [r * Math.cos(a), y, r * Math.sin(a)];
      const delta = candidate.map((v, i) => v - this.position[i]), distance = Math.hypot(...delta);
      const ahead = (-delta[0] * Math.cos(this.heading) + delta[2] * Math.sin(this.heading)) / Math.max(distance, 1e-6);
      const score = ahead * (reverse ? -0.7 : 0.8) + this.random() * 0.45 - Math.abs(distance - 0.45) - (distance < 0.22 ? 2 : 0);
      if (score > best) { best = score; this.target = candidate; }
    }
    this.cruiseSpeed = 0.065 + this.random() * 0.045;
  }

  /** @param {any} [water] */
  advance(dt, flow, env, submerged = true, water = null) {
    if (!(dt > 0)) return;
    // Bounded substeps keep tab stalls and different display rates stable.
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-8) {
      const step = Math.min(1 / 60, remaining);
      this.step(step, flow, env, submerged, water);
      remaining -= step;
    }
  }

  /** @param {any} water */
  step(dt, flow, env, submerged, water) {
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
    const surfaceOk = Number.isFinite(surface) && Math.abs(surface - env.level) < 0.04 && g > 1 && -gravity[1] > 0.985 * g;
    if (surfaceOk) this.surfaceY = Number.isFinite(this.surfaceY) ? damp(this.surfaceY, surface, dt, 6) : surface;
    const wetNow = water?.submerged ?? (submerged ? 1 : 0);
    this.jolt = this.readJolt(dt, water, wetNow);
    if (this.mode !== 'startle' && this.jolt > STARTLE_JOLT && this.time >= this.startleReady && (water.airAbove ?? 0) < 0.6) this.startStartle(env);
    if (this.mode === 'startle') {
      this.startleClock += dt;
      if (this.startleClock >= STARTLE_LENGTH) {
        this.mode = 'glide'; this.timer = 1.2 + this.random() * 0.8; this.sharpTurn = false;
        this.chooseTarget(env);
      }
    }
    const startling = this.mode === 'startle';
    let gulping = GULPING.has(this.mode);
    if (!gulping && this.time >= this.nextGulp && surfaceOk && wetNow > 0.99 && (water.airAbove ?? 0) < 0.25 && this.mode !== 'burst' && !this.sharpTurn) {
      this.mode = 'rise'; this.gulpClock = 0; this.timer = 9; gulping = true;
    }
    // The lips' height above the neck grows with the nose-up pitch, so the target tracks it.
    const holdY = this.surfaceY - MOUTH_DEPTH - bettaMouthHeight(0, clamp(this.pitch, 0, GULP_PITCH));
    let rise = holdY - this.position[1];
    if (gulping) {
      this.gulpClock += dt;
      if (this.mode !== 'dive' && (!surfaceOk || wetNow < 0.5)) { this.mode = 'dive'; this.timer = 1.3; }
      else if (this.mode === 'rise' && ((Math.abs(rise) < 0.012 && this.pitch > 0.7) || this.timer <= 0)) {
        if (Math.abs(rise) < 0.04) { this.mode = 'gulp'; this.gulpClock = 0; }
        else { this.mode = 'dive'; this.timer = 1.3; }
      } else if (this.mode === 'gulp' && this.gulpClock >= GULP_LENGTH) { this.mode = 'dive'; this.timer = 1.3; }
      else if (this.mode === 'dive' && this.timer <= 0) {
        this.mode = 'glide'; this.timer = 1.0 + this.random() * 0.8;
        this.nextGulp = this.time + 60 + this.gulpRandom() * 50;
        this.chooseTarget(env);
        gulping = false;
      }
    }
    let distance = Math.hypot(...this.target.map((v, i) => v - this.position[i]));
    if (!gulping && !startling && (this.timer <= 0 || (this.mode !== 'hover' && distance < 0.075))) {
      if (this.mode === 'hover') {
        this.mode = this.random() < 0.18 ? 'burst' : 'cruise';
        this.timer = this.mode === 'burst' ? 0.65 + this.random() * 0.45 : 6 + this.random() * 5;
        this.chooseTarget(env);
      } else if (this.mode === 'burst') {
        this.mode = 'glide'; this.timer = 1.2 + this.random();
      } else {
        this.mode = 'hover'; this.timer = 1.8 + this.random() * 3;
      }
    }
    // Look ahead and steer away before the body/tail reach the glass or bed.
    const fx = -Math.cos(this.heading), fz = Math.sin(this.heading);
    const look = this.position.map((v, i) => v + (i === 0 ? fx : i === 2 ? fz : 0) * (0.10 + this.speed * 0.8));
    const nearWall = Math.hypot(...look) > b.radius;
    let goal = this.target;
    const climbing = this.mode === 'rise' || this.mode === 'gulp';
    if (climbing) goal = [this.position[0] + fx * 0.3, holdY, this.position[2] + fz * 0.3];
    else if (this.mode === 'dive') goal = [this.position[0] + fx * 0.2, clamp(this.position[1] - 0.25, b.low, b.high), this.position[2] + fz * 0.2];
    if (startling) goal = [this.position[0] - Math.cos(this.startleHeading) * 0.3, this.position[1], this.position[2] + Math.sin(this.startleHeading) * 0.3];
    else if (nearWall) goal = [-this.position[0] * 0.45, clamp(this.position[1], b.low, b.high), -this.position[2] * 0.45];
    // The head is deliberately at the surface during a trip, so air above it is not an emergency.
    const escaping = !climbing && (!submerged || (water?.airAbove ?? 0) > 0.25);
    if (escaping) goal = water ? [water.centroid[0], water.centroid[1] - 0.06, water.centroid[2]] : [this.position[0] * 0.6, b.low + 0.025, this.position[2] * 0.6];
    const delta = goal.map((v, i) => v - this.position[i]);
    distance = Math.hypot(...delta);
    const yawError = wrap(Math.atan2(delta[2], -delta[0]) - this.heading);
    const holding = (this.mode === 'hover' || this.mode === 'gulp') && !nearWall && !escaping;
    if (startling) this.sharpTurn = false;
    else if (holding || Math.abs(yawError) < 0.3) this.sharpTurn = false;
    else if (Math.abs(yawError) > 1.9) this.sharpTurn = true;
    const maxRate = startling ? 9 : this.sharpTurn ? 3.0 : 0.9 + this.speed * 3;
    const wantedRate = holding ? 0 : clamp(yawError * (startling ? 10 : this.sharpTurn ? 3.5 : 1.8), -maxRate, maxRate);
    for (let k = 0; k < 3; k++) this.waterSpin[k] = damp(this.waterSpin[k], water?.angular[k] ?? 0, dt, 5);
    const angularAcceleration = startling ? 80 : this.sharpTurn ? 9 : 3;
    this.steerRate += clamp(wantedRate - this.steerRate, -angularAcceleration * dt, angularAcceleration * dt);
    this.angularVelocity = this.steerRate + this.waterSpin[1] * 0.8;
    this.heading += this.angularVelocity * dt;
    let pitchTarget = holding ? 0 : clamp(Math.atan2(delta[1], Math.hypot(delta[0], delta[2])), escaping ? -0.6 : -0.32, 0.32);
    if (this.mode === 'rise') pitchTarget = rise > 0.1 ? 0.62 : GULP_PITCH;
    else if (this.mode === 'gulp') pitchTarget = GULP_PITCH;
    else if (this.mode === 'dive') pitchTarget = -0.55;
    // Fleeing from the film, it dives so the snout never breaks the surface on the way out.
    if (startling && this.startleDive) pitchTarget = -0.45;
    const oldPitch = this.pitch, oldRoll = this.roll;
    const pitchSpin = -this.waterSpin[2] * Math.cos(this.heading) - this.waterSpin[0] * Math.sin(this.heading);
    this.pitch = clamp(damp(this.pitch, pitchTarget, dt, startling ? 8 : 2.4) + pitchSpin * dt * 0.8, -0.75, gulping ? 0.95 : 0.75);
    const rollSpin = this.waterSpin[0] * Math.cos(this.heading) - this.waterSpin[2] * Math.sin(this.heading);
    this.roll = clamp(damp(this.roll, 0, dt, 2.6) + rollSpin * dt * 0.8, -0.65, 0.65);
    this.pitchRate = (this.pitch - oldPitch) / dt;
    this.rollRate = (this.roll - oldRoll) / dt;
    let desiredSpeed = this.mode === 'burst' ? 0.19 : this.mode === 'glide' ? 0.04 : this.cruiseSpeed;
    if (holding) desiredSpeed = 0;
    else desiredSpeed *= (0.12 + 0.88 * Math.max(0, Math.cos(yawError))) * clamp(distance / 0.14, 0.25, 1);
    if (this.mode === 'rise') desiredSpeed = clamp(rise * 2.5, 0.006, 0.2);
    else if (this.mode === 'gulp') desiredSpeed = 0.006;
    else if (this.mode === 'dive') desiredSpeed = 0.17;
    // The dart starts once the head has swung round, then the speed decays into a glide.
    if (startling) desiredSpeed = STARTLE_SPEED * Math.max(0, Math.cos(yawError)) ** 2 * Math.exp(-Math.max(0, this.startleClock - 0.12) / 0.45);
    if (escaping) desiredSpeed = Math.max(desiredSpeed, 0.16);
    this.speed = damp(this.speed, desiredSpeed, dt, startling ? 14 : desiredSpeed > this.speed ? 2.8 : 3.5);
    // Same neutral-buoyancy inertia and finite station-keeping as the koi:
    // follow the full current with a 0.9s lag, not a capped 0.075-unit/s offset.
    const wet = water?.submerged ?? (submerged ? 1 : 0);
    if (wet > 0) for (let k = 0; k < 3; k++) this.drift[k] = damp(this.drift[k], flow[k], dt, 1 / 0.9);
    const driftSpeed = Math.hypot(...this.drift), hold = Math.max(0, driftSpeed - 0.15 * 0.42);
    if (wet > 0.99 && hold > 0) for (let k = 0; k < 3; k++) this.drift[k] *= 1 - Math.min(1, 1.6 * dt * hold / driftSpeed);
    if (water) for (let k = 0; k < 3; k++) this.drift[k] += (env.gravity?.[k] ?? (k === 1 ? -24 : 0)) * (1 - wet) * dt;
    const speedLimit = Math.hypot(...this.drift);
    if (speedLimit > 1.2) for (let k = 0; k < 3; k++) this.drift[k] *= 1.2 / speedLimit;
    const direction = [-Math.cos(this.heading) * Math.cos(this.pitch), Math.sin(this.pitch), Math.sin(this.heading) * Math.cos(this.pitch)];
    const old = [...this.position];
    for (let k = 0; k < 3; k++) this.position[k] += (direction[k] * this.speed + this.drift[k]) * dt;
    // Sculling fins hold the lips at the film once the head is there.
    if (climbing && Math.abs(rise) < 0.05) this.position[1] += clamp(rise * 6, -0.1, 0.1) * dt;
    const open = this.mode === 'gulp' ? gulpMouth(this.gulpClock) : 0, pulse = this.mode === 'gulp' ? gulpGillCover(this.gulpClock) : 0;
    this.gulp = damp(this.gulp, open, dt, 25);
    this.gulpGill = damp(this.gulpGill, pulse, dt, 25);
    // Real water has no fixed horizontal ceiling when the globe is tilted.
    // Density probes steer it back into water; actual bed/glass contacts stop it.
    const floor = water ? water.sand + 0.07 : b.low;
    this.position[1] = clamp(this.position[1], floor, water ? env.radius - 0.25 : b.high);
    if (this.position[1] <= floor && this.drift[1] < 0) this.drift[1] = 0;
    const horizontal = Math.hypot(this.position[0], this.position[2]);
    const radius = water ? env.radius - 0.29 : b.radius;
    this.position[1] = clamp(this.position[1], -radius, radius);
    const limit = Math.sqrt(Math.max(0, radius ** 2 - this.position[1] ** 2));
    if (horizontal > limit) {
      this.position[0] *= limit / horizontal; this.position[2] *= limit / horizontal;
      const n = Math.hypot(...this.position), outward = this.drift.reduce((sum, v, k) => sum + v * this.position[k] / n, 0);
      if (outward > 0) for (let k = 0; k < 3; k++) this.drift[k] -= outward * this.position[k] / n;
    }
    this.velocity = this.position.map((v, i) => (v - old[i]) / dt);
    this.drive = this.mode === 'glide' ? 0.065 : holding ? 0.045 : clamp(0.07 + this.speed * 1.4 + Math.abs(this.steerRate) * 0.06, 0.045, 0.40);
  }
}
