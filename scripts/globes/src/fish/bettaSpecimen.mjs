// The betta itself, moved on the CPU (Betta.ts draws it): the Atelier specimen (betta-atelier's
// fish.js) on the bowl's route (bettaSwim.mjs), reading the water at its probes (bettaWater.mjs),
// its fins solved, its skin, membranes, mouth, covers and eyes skinned into one list of vertices in
// the bowl's frame, then kept inside the glass, above the bed and out of the furnishings' solid parts.
// The page moves it on its own thread, or a worker moves a twin of it a frame behind
// (bettaWorker.mjs, bettaLink.mjs): built alike and given the same inputs, the two move alike, bit
// for bit. It uses no DOM and no GPU (built without its textures, it runs in a worker).
import * as THREE from 'three';
import { createBetta, COVER_LIFT, COVER_FLARE, COVER_DRAW } from '../../../betta-atelier/src/fish.js';
import { BettaSwim, BETTA_SCALE as SCALE } from './bettaSwim.mjs';
import { BETTA_PROBES, readBettaWater } from './bettaWater.mjs';

/** The dimple the lips make at the film: for how long (s into the gulp: within the shortest), at
 *  what rate it adds speed to the water under them (world units/s per s), over what radius; the
 *  bubbles let go sinking back from the film (for DIVE_BUBBLING s) and darting off it (per second),
 *  their radius. */
export const RIPPLE_TIME = 0.2, RIPPLE_RATE = 10, RIPPLE_RADIUS = 0.045;
const DIVE_BUBBLES = 14, STARTLE_BUBBLES = 36, DIVE_BUBBLING = 0.9;
/** A long fin lying on the sand, or against the glass or a furnishing, lies on it: the fin's own
 *  vertices are laid onto the surface (FIN_CLEAR off it), the body is not lifted by them. */
const FIN_CLEAR = 0.003;
/** In the water, its body is held BODY_CLEAR under the surface, but for its lips and chin (in front of
 *  LIPS_BEHIND, Atelier units, as it was built): only they go up into the air, at a gulp or a take. */
const BODY_CLEAR = 0.002, LIPS_BEHIND = -1.45;
/** Off a furnishing's solid part its body is held BODY_ROOM clear (a little gap, seen as it passes, not
 *  its snout or flank pressed into the bark), but lying on one, it lies on it: a touch, and as it settles
 *  there it sinks the last of that gap. */
const BODY_ROOM = 0.01;
export const BUBBLE_RADIUS = 0.0035;

/**
 * One mesh's share of the vertices, and what deforming it takes, worked out once: its rest
 * positions; whether the body carries it (deform), its cover's lift (the opercula), its fin solver
 * (betta-atelier's FinDynamics: columns, rows, rest, displacement, and the nodes the body carried
 * this frame: carried, carriedBy, carriedAt); for a fin's vertices, the four displacement texels
 * round each (cells), its place between them (place: u, v), and the solver node it sits on (nodes,
 * or -1).
 * @typedef {{ mesh: THREE.Mesh, offset: number, rest: Float32Array, deform: boolean, cover: Float32Array | null,
 *   fin: any, cells: Int32Array | null, place: Float64Array | null, nodes: Int32Array | null }} Part
 */

/**
 * What the host gives it each step besides the water: the furnishings' solid parts and the route's
 * obstacles (capsules, sim frame: { a, b, r, solid }), the pellet it is after (FishFood: its pos) or
 * null, how wide to open for it, whether it is asked to flare, and what the water is doing to it
 * (water/effects.ts: how listless, how short of air, how closely it holds its fins; clear if none).
 * @typedef {{ obstacles: { a: number[], b: number[], r: number, solid: number }[], food: { pos: number[] } | null,
 *   gapeWant: number, flared: boolean, water?: BettaSpirits }} BettaHost
 * @typedef {{ lethargy: number, gasp: number, clamp: number }} BettaSpirits
 */

/** How fast its fins fold in or open out as the water changes (1/s: over a few seconds), and how
 *  much quicker it breathes, short of air (rad/s of the breathing's phase, on top of the gait's). */
const CLAMP_RATE = 0.6, PANT = 8;

export class BettaSpecimen {
  /** textures: false builds it without its photographs (for a worker, which only moves it). */
  constructor({ textures = true } = {}) {
    this.fish = createBetta({ compact: true, textures });
    this.rig = new THREE.Group();
    /** Each mesh and where its vertices start, in the order they are listed. */
    this.meshes = /** @type {{ mesh: THREE.Mesh, offset: number }[]} */ ([]);
    this.probes = new Float32Array(16 * 4);
    /** The lips, where it would meet the surface (sim frame). */
    this.mouth = new THREE.Vector3();
    this.swim = new BettaSwim();
    /** @type {ReturnType<typeof readBettaWater> | null} */
    this.waterState = null;
    this.level = 0.18;
    this.time = 0;
    this.flow = new THREE.Vector3();
    // (Scratch, so that a frame allocates little.)
    this.carry = [0, 0, 0, 0];
    this.point = new THREE.Vector3();
    this.flowTarget = new THREE.Vector3();
    this.flowNow = [0, 0, 0];
    this.flowLocal = [0, 0, 0];
    this.rippleAt = new THREE.Vector3();
    this.bubbleAt = new THREE.Vector3();
    this.ripple = 0;
    this.bubbleDebt = 0;
    this.bubbleCount = 0;
    /** How closely it holds its fins folded now (0..1), easing to what the water asks. */
    this.clamp = 0;
    /** Which way its fins hang (the globe's felt gravity, as a direction in the bowl's frame). */
    this.down = [0, -1, 0];
    /** The furnishings' solid parts near it last step (solidsNear's), for its fins to lie on: each
     *  [start, end, radius] in the fish's parent's frame (Atelier units), count of them. */
    this.finSolids = { data: new Float64Array(7 * 32), count: 0 };
    /** The water's surface as last read (sim frame, height). */
    this.surface = 0.18;
    this.rig.add(this.fish);
    this.rig.scale.setScalar(SCALE);
    this.fish.userData.locomotion = this.locomotion();
    this.fish.userData.update(0);
    this.rig.updateMatrixWorld(true);
    let count = 0;
    this.fish.traverse((object) => {
      if (!(/** @type {THREE.Mesh} */ (object)).isMesh) return;
      const mesh = /** @type {THREE.Mesh} */ (object);
      this.meshes.push({ mesh, offset: count });
      count += mesh.geometry.attributes.position.count;
    });
    /** Every mesh's vertices, skinned, in the bowl's frame (where the shader traces them). */
    this.vertices = new Float32Array(count * 3);
    /** Which of them are a fin's (1): those only bend where they touch, the rest hold the body off. */
    this.finVertex = new Uint8Array(count);
    /** @type {Part[]} */
    this.parts = this.meshes.map(({ mesh, offset }) => {
      const g = mesh.geometry, rest = /** @type {Float32Array} */ (g.attributes.position.array);
      const deform = /** @type {THREE.Material} */ (mesh.material).userData.bettaDeform;
      const fin = deform?.dynamics ?? null;
      /** @type {Part} */
      const part = { mesh, offset, rest, deform: !!deform, cover: deform?.operculum ? /** @type {Float32Array} */ (g.attributes.coverLift.array) : null, fin, cells: null, place: null, nodes: null };
      if (fin) {
        const count = g.attributes.position.count, fu = /** @type {Float32Array} */ (g.attributes.finUV.array);
        const w = fin.columns, h = fin.rows;
        const cells = new Int32Array(count * 4), place = new Float64Array(count * 2), nodes = new Int32Array(count);
        for (let i = 0; i < count; i++) {
          const x = fu[i * 2] * (w - 1), y = fu[i * 2 + 1] * (h - 1);
          const a = Math.floor(x), b = Math.floor(y), xx = Math.min(a + 1, w - 1), yy = Math.min(b + 1, h - 1);
          cells.set([(b * w + a) * 4, (b * w + xx) * 4, (yy * w + a) * 4, (yy * w + xx) * 4], i * 4);
          place[i * 2] = x - a;
          place[i * 2 + 1] = y - b;
          // (The node it sits on, if its rest is that node's to the bit: the body carries both alike.)
          const n = Math.round(y) * w + Math.round(x);
          nodes[i] = [0, 1, 2].every((k) => fin.rest[n * 3 + k] === rest[i * 3 + k]) ? n : -1;
        }
        Object.assign(part, { cells, place, nodes });
        this.finVertex.fill(1, offset, offset + count);
      }
      return part;
    });
    this.updateVertices();
    /** Which of the vertices are its lips' and chin's (1): those alone may break the surface. */
    this.lipVertex = new Uint8Array(count);
    const toFish = this.fish.matrixWorld.clone().invert(), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) if (p.fromArray(this.vertices, i * 3).applyMatrix4(toFish).x < LIPS_BEHIND) this.lipVertex[i] = 1;
    this.updateProbes();
  }

  /**
   * One frame of its life (dt s): what the water told it (FluidSim's koiSense, or null before the
   * first reading), the globe (KoiEnv), and what the host sets (BettaHost).
   * @param {number} dt
   * @param {{ probes: Float32Array, sand: Float32Array, centroid: number[] } | null} sense
   * @param {{ radius: number, level: number, sandLevel: number, gravity: readonly number[], iso: number }} env
   * @param {BettaHost} host
   * @param {ArrayLike<number> | null} [turn] the bowl's turn about its own axis since the last step
   *   (rad, along the axis, sim frame): the fish is carried round with it (BettaSwim.turnWith)
   */
  step(dt, sense, env, host, turn = null) {
    dt = Math.max(0, Math.min(dt, 0.07));
    this.time += dt;
    this.level = env.level;
    const g = env.gravity, weight = g ? Math.hypot(g[0], g[1], g[2]) : 0;
    if (weight > 1e-6) for (let k = 0; k < 3; k++) this.down[k] = g[k] / weight;
    this.fish.userData.down = this.down;
    if (turn) this.swim.turnWith(turn);
    // Sample the actual current and its rotation across the moving anatomy.
    this.waterState = readBettaWater(sense, this.probes, env);
    this.flow.lerp(this.flowTarget.fromArray(this.waterState.flow), 1 - Math.exp(-5 * dt));
    this.swim.food = host.food ? host.food.pos : null;
    this.swim.obstacles = host.obstacles;
    this.swim.gape = host.gapeWant;
    const spirits = host.water;
    this.swim.lethargy = spirits ? spirits.lethargy : 0;
    this.swim.gasp = spirits ? spirits.gasp : 0;
    // The tail's own working (read back from last frame's gait) is what lets the body gain speed.
    this.swim.advance(dt, this.flow.toArray(this.flowNow), env, this.waterState.submerged > 0.99, this.waterState, this.fish.userData.stroke ?? null);
    this.fish.userData.locomotion = this.locomotion();
    const toLocal = 1 / SCALE;
    this.flowLocal[0] = this.flow.x * toLocal; this.flowLocal[1] = this.flow.y * toLocal; this.flowLocal[2] = this.flow.z * toLocal;
    this.fish.userData.externalFlow = this.flowLocal;
    // The same one-second opening as the standalone specimen.
    const display = this.fish.userData.display;
    display.requested = host.flared || this.swim.flaring || this.swim.flaringAfter;
    // Unwell, it holds its fins folded in (fin-dynamics.js clamp), and breathes quicker short of air.
    // (Opened out all but fully, they are open: none of the fold is left to solve.)
    const clamped = spirits ? spirits.clamp : 0;
    this.clamp += (clamped - this.clamp) * (1 - Math.exp(-CLAMP_RATE * dt));
    if (clamped === 0 && this.clamp < 1e-3) this.clamp = 0;
    display.clamp = this.clamp;
    if (this.swim.gasp > 0) this.fish.userData.gait.breathPhase += PANT * this.swim.gasp * dt;
    this.fish.userData.solids = this.finSolids.count ? this.finSolids : null;
    // (The water's surface, for its fins to keep under (fish.js's state.surfaceY): its height in the rig's
    // frame (Atelier units), along the way up against the way they hang; none, undefined, out of the water.)
    const measured = Number.isFinite(this.waterState.surface);
    this.surface = measured ? this.waterState.surface : env.level;
    this.fish.userData.surfaceY = this.waterState.submerged > (measured ? 0.2 : 0.5) ? this.surface / SCALE : undefined;
    this.fish.userData.update(this.time);
    this.updateVertices();
    // Contact against the glass and sampled bed, not a fixed waterline: sloshing
    // can carry the fish vertically and the density probes guide its recovery. The body is held off
    // them; its fins are laid on them where they touch (lying on the sand, its ventrals, anal and
    // caudal spread over it, rather than held up on them like stilts).
    const near = this.solidsNear(host.obstacles), fins = this.finVertex;
    // (Next step's fins lie on these: their solver meets them as it goes, so a fin stays whole on a
    // furnishing, rather than each vertex being put onto it after: layFins is then a last touch.)
    // (The fins' own room round each, fin: a piece's whole surface; the nearest first, if there are more
    // than the fins take.)
    const solids = this.finSolids, finNear = near.filter((o) => o.fin > 0), keep = Math.min(finNear.length, solids.data.length / 7);
    if (finNear.length > keep) finNear.sort((p, q) => p.off - q.off);
    for (let k = 0; k < keep; k++) {
      const o = finNear[k];
      const d = solids.data, at = k * 7;
      d[at] = o.ax / SCALE; d[at + 1] = o.ay / SCALE; d[at + 2] = o.az / SCALE;
      d[at + 3] = (o.ax + o.abx) / SCALE; d[at + 4] = (o.ay + o.aby) / SCALE; d[at + 5] = (o.az + o.abz) / SCALE;
      d[at + 6] = (o.fin + FIN_CLEAR) / SCALE;
    }
    solids.count = keep;
    // (In the water, all but its lips are held under the surface too: up is against the way its fins hang.)
    const wet = this.fish.userData.surfaceY !== undefined, lips = this.lipVertex, u0 = -this.down[0], u1 = -this.down[1], u2 = -this.down[2], under = this.surface - BODY_CLEAR;
    const room = this.swim.mode === 'rest' && this.swim.restSettled ? 0 : BODY_ROOM;
    for (let pass = 0; pass < 4; pass++) {
      let worst = 0, dx = 0, dy = 0, dz = 0, bottom = Infinity;
      for (let i = 0; i < this.vertices.length; i += 3) {
        if (fins[i / 3]) continue;
        const x = this.vertices[i], y = this.vertices[i + 1], z = this.vertices[i + 2];
        bottom = Math.min(bottom, y);
        const r = Math.sqrt(x * x + y * y + z * z), excess = r - env.radius + 0.012;
        if (excess > worst) { worst = excess; dx = -x / r * excess; dy = -y / r * excess; dz = -z / r * excess; }
        if (wet && !lips[i / 3]) {
          const above = x * u0 + y * u1 + z * u2 - under;
          if (above > worst) { worst = above; dx = -u0 * above; dy = -u1 * above; dz = -u2 * above; }
        }
        for (const o of near) {
          if (!(o.solid > 0)) continue;
          const t = Math.max(0, Math.min(1, ((x - o.ax) * o.abx + (y - o.ay) * o.aby + (z - o.az) * o.abz) * o.inv));
          const ox = x - o.ax - o.abx * t, oy = y - o.ay - o.aby * t, oz = z - o.az - o.abz * t, l = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const into = o.solid + room - l;
          if (into > worst && l > 1e-9) { worst = into; dx = ox / l * into; dy = oy / l * into; dz = oz / l * into; }
        }
      }
      dy += Math.max(0, this.waterState.sand + 0.012 - bottom - dy);
      if (Math.hypot(dx, dy, dz) < 1e-6) break;
      const shift = [dx, dy, dz];
      for (let k = 0; k < 3; k++) {
        this.swim.position[k] += shift[k];
        this.fish.position.setComponent(k, this.fish.position.getComponent(k) + shift[k] / SCALE);
        if (shift[k] * this.swim.drift[k] < 0) this.swim.drift[k] = 0;
      }
      const v = this.vertices;
      for (let i = 0; i < v.length; i += 3) { v[i] += dx; v[i + 1] += dy; v[i + 2] += dz; }
    }
    this.layFins(env, near);
    this.updateProbes();
    this.disturb(dt);
  }

  /** Each fin vertex that has gone into the sand, the glass or a furnishing's solid part (near:
   *  solidsNear's), laid onto its surface; and, in the water, each that would break its surface held
   *  just under it (only the lips go up into the air). */
  layFins(env, near) {
    const v = this.vertices, fins = this.finVertex, sand = this.waterState.sand + FIN_CLEAR, glass = env.radius - FIN_CLEAR;
    const wet = this.fish.userData.surfaceY != null, u0 = -this.down[0], u1 = -this.down[1], u2 = -this.down[2], top = this.surface - FIN_CLEAR;
    for (let i = 0; i < v.length; i += 3) {
      if (!fins[i / 3]) continue;
      if (wet) {
        const over = v[i] * u0 + v[i + 1] * u1 + v[i + 2] * u2 - top;
        if (over > 0) { v[i] -= over * u0; v[i + 1] -= over * u1; v[i + 2] -= over * u2; }
      }
      if (v[i + 1] < sand) v[i + 1] = sand;
      let x = v[i], y = v[i + 1], z = v[i + 2];
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > glass) { x *= glass / r; y *= glass / r; z *= glass / r; }
      for (const o of near) {
        if (!(o.fin > 0)) continue;
        const t = Math.max(0, Math.min(1, ((x - o.ax) * o.abx + (y - o.ay) * o.aby + (z - o.az) * o.abz) * o.inv));
        const cx = o.ax + o.abx * t, cy = o.ay + o.aby * t, cz = o.az + o.abz * t;
        const ox = x - cx, oy = y - cy, oz = z - cz, l = Math.sqrt(ox * ox + oy * oy + oz * oz), out = o.fin + FIN_CLEAR;
        if (l < out && l > 1e-9) { x = cx + ox / l * out; y = cy + oy / l * out; z = cz + oz / l * out; }
      }
      v[i] = x; v[i + 1] = y; v[i + 2] = z;
    }
  }

  /** What the fish did to the water at the film since this was last asked (main.ts gives it to the
   *  sim once): a push down at the lips (speed to add along the water's weight; where) and bubbles
   *  let go (how many; where). Both reset. */
  takeDisturbance() {
    const out = { push: this.ripple, pushAt: this.rippleAt, bubbles: this.bubbleCount, bubblesAt: this.bubbleAt };
    this.ripple = 0;
    this.bubbleCount = 0;
    return out;
  }

  /** The obstacles' solid parts its body could touch this frame (inside its box, grown by what
   *  the contact passes can shift it), each ready for the test: its start, its length, and one
   *  over its length squared. */
  solidsNear(obstacles) {
    if (!obstacles.length) return [];
    const v = this.vertices;
    const lo = [Infinity, Infinity, Infinity];
    const hi = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < v.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (v[i + k] < lo[k]) lo[k] = v[i + k];
        if (v[i + k] > hi[k]) hi[k] = v[i + k];
      }
    }
    const near = [], mid = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2);
    for (const o of obstacles) {
      // (Its body is held off a solid part; its fins, off the room they keep round it: fin, or solid.)
      const fin = o.fin ?? o.solid;
      if (!(o.solid > 0) && !(fin > 0)) continue;
      // (Its fins may reach a little past where they are drawn this frame, by the next solve's.)
      const s = Math.max(o.solid + 0.05, fin + 0.1);
      let apart = false;
      for (let k = 0; k < 3; k++) if (Math.min(o.a[k], o.b[k]) - s > hi[k] || Math.max(o.a[k], o.b[k]) + s < lo[k]) apart = true;
      if (apart) continue;
      const abx = o.b[0] - o.a[0], aby = o.b[1] - o.a[1], abz = o.b[2] - o.a[2];
      const l2 = abx * abx + aby * aby + abz * abz, inv = l2 > 1e-12 ? 1 / l2 : 0;
      const t = Math.max(0, Math.min(1, ((mid[0] - o.a[0]) * abx + (mid[1] - o.a[1]) * aby + (mid[2] - o.a[2]) * abz) * inv));
      const off = Math.hypot(mid[0] - o.a[0] - abx * t, mid[1] - o.a[1] - aby * t, mid[2] - o.a[2] - abz * t) - fin;
      near.push({ ax: o.a[0], ay: o.a[1], az: o.a[2], abx, aby, abz, inv, solid: o.solid, fin, off });
    }
    return near;
  }

  disturb(dt) {
    const s = this.swim, surface = this.waterState?.surface ?? this.level, lip = this.mouth;
    // Opening its mouth at the film, the lips draw the water in: the surface dimples, then rings.
    // (Lingering at the film between gulps, gasping, its mouth is shut: the clock is short of 0.)
    if (s.mode === 'gulp' && s.gulpClock >= 0 && s.gulpClock < RIPPLE_TIME && Math.abs(lip.y - surface) < 0.03) {
      this.rippleAt.set(lip.x, surface, lip.z);
      this.ripple += RIPPLE_RATE * dt * Math.sin(Math.PI * Math.min(1, s.gulpClock / RIPPLE_TIME));
    }
    // Sinking back from the film (and darting off it), the old air leaves as a few small bubbles.
    const bubbling = (s.mode === 'dive' && s.diveClock < DIVE_BUBBLING) ? DIVE_BUBBLES : (s.mode === 'startle' && s.startleDive && s.startleClock < 0.4) ? STARTLE_BUBBLES : 0;
    if (bubbling > 0 && surface - lip.y < 0.09) {
      this.bubbleDebt += bubbling * dt;
      const n = Math.floor(this.bubbleDebt);
      if (n > 0) {
        this.bubbleDebt -= n;
        this.bubbleCount += n;
        this.bubbleAt.set(lip.x, lip.y - 0.004, lip.z);
      }
    } else this.bubbleDebt = 0;
  }

  updateProbes() {
    this.rig.updateMatrixWorld(true);
    const scratch = this.carry, p = this.point;
    for (let i = 0; i < 16; i++) {
      const local = BETTA_PROBES[i];
      this.fish.userData.bodyMotion.transform(local[0], local[1], local[2], scratch);
      p.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
      this.probes[i * 4] = p.x; this.probes[i * 4 + 1] = p.y; this.probes[i * 4 + 2] = p.z; this.probes[i * 4 + 3] = 0;
    }
    // The lips, where it would meet the surface.
    this.fish.userData.bodyMotion.transform(-1.68, 0.0832, 0, scratch);
    this.mouth.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
  }

  locomotion() {
    // The route belongs to the neck/head, not a pivot in the middle of the fish.
    // Offsetting the model origin lets the head lead while the rear curls behind.
    const s = this.swim, h = s.heading, p = s.pitch, length = 1.22 * SCALE;
    const offset = [length * Math.cos(h) * Math.cos(p), -length * Math.sin(p), -length * Math.sin(h) * Math.cos(p)];
    const offsetVelocity = [
      -length * (Math.sin(h) * Math.cos(p) * s.angularVelocity + Math.cos(h) * Math.sin(p) * s.pitchRate),
      -length * Math.cos(p) * s.pitchRate,
      length * (-Math.cos(h) * Math.cos(p) * s.angularVelocity + Math.sin(h) * Math.sin(p) * s.pitchRate),
    ];
    return { ...s, speed: s.speed / SCALE, position: s.position.map((v, k) => (v + offset[k]) / SCALE), velocity: s.velocity.map((v, k) => (v + offsetVelocity[k]) / SCALE) };
  }

  updateVertices() {
    this.rig.updateMatrixWorld(true);
    const body = this.fish.userData.bodyMotion, out = this.vertices, s = this.carry;
    const flare = this.fish.userData.display.flare, lift = body.gill * COVER_LIFT + flare * COVER_FLARE, draw = (body.gill + flare) * COVER_DRAW;
    for (const { mesh, offset, rest, deform, cover, fin, cells, place, nodes } of this.parts) {
      const e = mesh.matrixWorld.elements, count = rest.length / 3;
      // (A fin's vertices that sit on its solver's nodes: the body carried those this frame already,
      // for the solver's displacement, unless the solver took no step.)
      const carried = fin && fin.carriedBy === body && fin.carriedAt === body.revision ? fin.carried : null;
      const data = fin ? fin.displacement : null;
      for (let i = 0; i < count; i++) {
        let x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
        if (deform) {
          if (cover) { z += cover[i] * lift; x -= Math.abs(cover[i]) * draw; }
          const n = carried ? nodes[i] : -1;
          if (n >= 0) {
            x = carried[n * 3]; y = carried[n * 3 + 1]; z = carried[n * 3 + 2];
          } else {
            body.transform(x, y, z, s);
            x = s[0]; y = s[1]; z = s[2];
          }
          if (data) {
            const c0 = cells[i * 4], c1 = cells[i * 4 + 1], c2 = cells[i * 4 + 2], c3 = cells[i * 4 + 3];
            const u = place[i * 2], v = place[i * 2 + 1];
            x = x + (data[c0] * (1 - u) + data[c1] * u) * (1 - v) + (data[c2] * (1 - u) + data[c3] * u) * v;
            y = y + (data[c0 + 1] * (1 - u) + data[c1 + 1] * u) * (1 - v) + (data[c2 + 1] * (1 - u) + data[c3 + 1] * u) * v;
            z = z + (data[c0 + 2] * (1 - u) + data[c1 + 2] * u) * (1 - v) + (data[c2 + 2] * (1 - u) + data[c3 + 2] * u) * v;
          }
        }
        // (Vector3.applyMatrix4, written out.)
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]), o = (offset + i) * 3;
        out[o] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        out[o + 1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        out[o + 2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
      }
    }
  }
}
