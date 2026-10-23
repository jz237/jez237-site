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
    // Pick destinations within the water volume, not points on a circular track.
    for (let attempt = 0; attempt < 16; attempt++) {
      const y = b.low + (b.high - b.low) * (0.08 + 0.84 * this.random());
      const r = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * Math.sqrt(this.random()) * 0.86;
      const a = this.random() * Math.PI * 2;
      const candidate = [r * Math.cos(a), y, r * Math.sin(a)];
      if (Math.hypot(...candidate.map((v, i) => v - this.position[i])) > 0.28 || attempt === 15) {
        this.target = candidate;
        break;
      }
    }
    this.cruiseSpeed = 0.065 + this.random() * 0.045;
  }

  advance(dt, flow, env, submerged = true) {
    if (!(dt > 0)) return;
    // Bounded substeps keep tab stalls and different display rates stable.
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-8) {
      const step = Math.min(1 / 60, remaining);
      this.step(step, flow, env, submerged);
      remaining -= step;
    }
  }

  step(dt, flow, env, submerged) {
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
    if (!submerged) goal = [this.position[0] * 0.6, b.low + 0.025, this.position[2] * 0.6];
    const delta = goal.map((v, i) => v - this.position[i]);
    distance = Math.hypot(...delta);
    const yawError = wrap(Math.atan2(delta[2], -delta[0]) - this.heading);
    const holding = this.mode === 'hover' && !nearWall && submerged;
    const wantedRate = holding ? 0 : clamp(yawError * 2.5, -1.65, 1.65);
    this.angularVelocity = damp(this.angularVelocity, wantedRate, dt, 4.5);
    this.heading += this.angularVelocity * dt;
    const pitchTarget = holding ? 0 : clamp(Math.atan2(delta[1], Math.hypot(delta[0], delta[2])), -0.32, 0.32);
    this.pitch = damp(this.pitch, pitchTarget, dt, 2.4);
    let desiredSpeed = this.mode === 'burst' ? 0.19 : this.mode === 'glide' ? 0.04 : this.cruiseSpeed;
    if (holding) desiredSpeed = 0;
    else desiredSpeed *= (0.12 + 0.88 * Math.max(0, Math.cos(yawError))) * clamp(distance / 0.14, 0.25, 1);
    this.speed = damp(this.speed, desiredSpeed, dt, desiredSpeed > this.speed ? 2.8 : 3.5);
    // Small water-carried drift remains; holding effort is computed from the
    // actual relative flow by the shared gait/fin solver.
    for (let k = 0; k < 3; k++) this.drift[k] = damp(this.drift[k], clamp(flow[k] * 0.28, -0.075, 0.075), dt, 2);
    const direction = [-Math.cos(this.heading) * Math.cos(this.pitch), Math.sin(this.pitch), Math.sin(this.heading) * Math.cos(this.pitch)];
    const old = [...this.position];
    for (let k = 0; k < 3; k++) this.position[k] += (direction[k] * this.speed + this.drift[k]) * dt;
    // Last-resort envelope for strong shaking. Normal travel is turned early.
    this.position[1] = clamp(this.position[1], b.low, b.high);
    const horizontal = Math.hypot(this.position[0], this.position[2]);
    const limit = Math.sqrt(Math.max(0, b.radius ** 2 - this.position[1] ** 2));
    if (horizontal > limit) { this.position[0] *= limit / horizontal; this.position[2] *= limit / horizontal; }
    this.velocity = this.position.map((v, i) => (v - old[i]) / dt);
    this.drive = this.mode === 'glide' ? 0.065 : holding ? 0.045 : clamp(0.07 + this.speed * 1.4 + Math.abs(this.angularVelocity) * 0.06, 0.045, 0.40);
  }
}
