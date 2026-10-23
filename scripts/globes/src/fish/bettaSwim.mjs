// Globe-space locomotion. The Atelier supplies the anatomy, not the route.
// A seeded stream makes checks reproducible without a short repeating orbit.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const damp = (x, y, dt, rate) => x + (y - x) * (1 - Math.exp(-dt * rate));
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
export const BETTA_SCALE = 0.105;

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
    let distance = Math.hypot(...this.target.map((v, i) => v - this.position[i]));
    if (this.timer <= 0 || (this.mode !== 'hover' && distance < 0.075)) {
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
    if (nearWall) goal = [-this.position[0] * 0.45, clamp(this.position[1], b.low, b.high), -this.position[2] * 0.45];
    const escaping = !submerged || (water?.airAbove ?? 0) > 0.25;
    if (escaping) goal = water ? [water.centroid[0], water.centroid[1] - 0.06, water.centroid[2]] : [this.position[0] * 0.6, b.low + 0.025, this.position[2] * 0.6];
    const delta = goal.map((v, i) => v - this.position[i]);
    distance = Math.hypot(...delta);
    const yawError = wrap(Math.atan2(delta[2], -delta[0]) - this.heading);
    const holding = this.mode === 'hover' && !nearWall && !escaping;
    if (holding || Math.abs(yawError) < 0.3) this.sharpTurn = false;
    else if (Math.abs(yawError) > 1.9) this.sharpTurn = true;
    const maxRate = this.sharpTurn ? 3.0 : 0.9 + this.speed * 3;
    const wantedRate = holding ? 0 : clamp(yawError * (this.sharpTurn ? 3.5 : 1.8), -maxRate, maxRate);
    for (let k = 0; k < 3; k++) this.waterSpin[k] = damp(this.waterSpin[k], water?.angular[k] ?? 0, dt, 5);
    const angularAcceleration = this.sharpTurn ? 9 : 3;
    this.steerRate += clamp(wantedRate - this.steerRate, -angularAcceleration * dt, angularAcceleration * dt);
    this.angularVelocity = this.steerRate + this.waterSpin[1] * 0.8;
    this.heading += this.angularVelocity * dt;
    const pitchTarget = holding ? 0 : clamp(Math.atan2(delta[1], Math.hypot(delta[0], delta[2])), escaping ? -0.6 : -0.32, 0.32);
    const oldPitch = this.pitch, oldRoll = this.roll;
    const pitchSpin = -this.waterSpin[2] * Math.cos(this.heading) - this.waterSpin[0] * Math.sin(this.heading);
    this.pitch = clamp(damp(this.pitch, pitchTarget, dt, 2.4) + pitchSpin * dt * 0.8, -0.75, 0.75);
    const rollSpin = this.waterSpin[0] * Math.cos(this.heading) - this.waterSpin[2] * Math.sin(this.heading);
    this.roll = clamp(damp(this.roll, 0, dt, 2.6) + rollSpin * dt * 0.8, -0.65, 0.65);
    this.pitchRate = (this.pitch - oldPitch) / dt;
    this.rollRate = (this.roll - oldRoll) / dt;
    let desiredSpeed = this.mode === 'burst' ? 0.19 : this.mode === 'glide' ? 0.04 : this.cruiseSpeed;
    if (holding) desiredSpeed = 0;
    else desiredSpeed *= (0.12 + 0.88 * Math.max(0, Math.cos(yawError))) * clamp(distance / 0.14, 0.25, 1);
    if (escaping) desiredSpeed = Math.max(desiredSpeed, 0.16);
    this.speed = damp(this.speed, desiredSpeed, dt, desiredSpeed > this.speed ? 2.8 : 3.5);
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
