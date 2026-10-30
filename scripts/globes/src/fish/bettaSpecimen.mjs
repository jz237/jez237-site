// The betta itself, moved on the CPU (Betta.ts draws it): the Atelier specimen (betta-atelier's
// fish.js) on the bowl's route (bettaSwim.mjs), reading the water at its probes (bettaWater.mjs),
// its fins solved, its skin, membranes, mouth, covers and eyes skinned into one list of vertices in
// the bowl's frame, then kept inside the glass, above the bed and out of the furnishings' solid parts,
// its fins under the water and out of the wood, the rocks and the equipment.
// The page moves it on its own thread, or a worker moves a twin of it a frame behind
// (bettaWorker.mjs, bettaLink.mjs): built alike and given the same inputs, the two move alike, bit
// for bit. It uses no DOM and no GPU (built without its textures, it runs in a worker).
import * as THREE from 'three';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { BettaSwim, BETTA_SCALE as SCALE } from './bettaSwim.mjs';
import { BETTA_PROBES, readBettaWater } from './bettaWater.mjs';

/** The dimple the lips make at the film: for how long (s into the gulp), at what rate it adds speed
 *  to the water under them (world units/s per s), over what radius; the bubbles let go diving
 *  from the film and darting off it (per second), their radius. */
export const RIPPLE_TIME = 0.34, RIPPLE_RATE = 6, RIPPLE_RADIUS = 0.045;
const DIVE_BUBBLES = 14, STARTLE_BUBBLES = 36;
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
 * @typedef {{ obstacles: { a: number[], b: number[], r: number, solid: number, leaf?: boolean }[], food: { pos: number[] } | null,
 *   gapeWant: number, flared: boolean, water?: BettaSpirits }} BettaHost
 * @typedef {{ lethargy: number, gasp: number, clamp: number }} BettaSpirits
 */

/** How fast its fins fold in or open out as the water changes (1/s: over a few seconds), and how
 *  much quicker it breathes, short of air (rad/s of the breathing's phase, on top of the gait's). */
const CLAMP_RATE = 0.6, PANT = 5;

/** How far its fins keep (sim units) under the water's surface, off the sand and the glass, and
 *  outside the room they keep round each furnishing (finRoom.mjs; an obstacle's fin, or its solid). */
const FIN_CLEAR = 0.003;

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
    /** Which of them are a fin's (1): those are laid under the surface and outside the furnishings. */
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
    // How far its body is folded round (last frame's), so it turns no tighter than the trunk can follow.
    this.swim.fold = this.fish.userData.bodyMotion?.turnAngles?.at(-1) ?? 0;
    // The tail's own working (read back from last frame's gait) is what lets the body gain speed.
    this.swim.advance(dt, this.flow.toArray(this.flowNow), env, this.waterState.submerged > 0.99, this.waterState, this.fish.userData.stroke ?? null);
    this.fish.userData.locomotion = this.locomotion();
    const toLocal = 1 / SCALE;
    this.flowLocal[0] = this.flow.x * toLocal; this.flowLocal[1] = this.flow.y * toLocal; this.flowLocal[2] = this.flow.z * toLocal;
    this.fish.userData.externalFlow = this.flowLocal;
    // The same one-second opening as the standalone specimen.
    const display = this.fish.userData.display;
    display.requested = host.flared || this.swim.flaring;
    // Unwell, it holds its fins folded in (fin-dynamics.js clamp), and breathes quicker short of air.
    // (Opened out all but fully, they are open: none of the fold is left to solve.)
    const clamped = spirits ? spirits.clamp : 0;
    this.clamp += (clamped - this.clamp) * (1 - Math.exp(-CLAMP_RATE * dt));
    if (clamped === 0 && this.clamp < 1e-3) this.clamp = 0;
    display.clamp = this.clamp;
    if (this.swim.gasp > 0) this.fish.userData.gait.breathPhase += PANT * this.swim.gasp * dt;
    this.fish.userData.update(this.time);
    this.updateVertices();
    // Contact against the glass and sampled bed, not a fixed waterline: sloshing
    // can carry the fish vertically and the density probes guide its recovery.
    const near = this.solidsNear(host.obstacles);
    for (let pass = 0; pass < 4; pass++) {
      let worst = 0, dx = 0, dy = 0, dz = 0, bottom = Infinity;
      for (let i = 0; i < this.vertices.length; i += 3) {
        const x = this.vertices[i], y = this.vertices[i + 1], z = this.vertices[i + 2];
        bottom = Math.min(bottom, y);
        const r = Math.sqrt(x * x + y * y + z * z), excess = r - env.radius + 0.012;
        if (excess > worst) { worst = excess; dx = -x / r * excess; dy = -y / r * excess; dz = -z / r * excess; }
        for (const o of near) {
          const t = Math.max(0, Math.min(1, ((x - o.ax) * o.abx + (y - o.ay) * o.aby + (z - o.az) * o.abz) * o.inv));
          const ox = x - o.ax - o.abx * t, oy = y - o.ay - o.aby * t, oz = z - o.az - o.abz * t, l = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const into = o.solid - l;
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
    this.layFins(env, host.obstacles);
    this.updateProbes();
    this.disturb(dt);
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
    const near = [];
    for (const o of obstacles) {
      if (o.solid <= 0) continue;
      const s = o.solid + 0.05;
      let apart = false;
      for (let k = 0; k < 3; k++) if (Math.min(o.a[k], o.b[k]) - s > hi[k] || Math.max(o.a[k], o.b[k]) + s < lo[k]) apart = true;
      if (apart) continue;
      const abx = o.b[0] - o.a[0], aby = o.b[1] - o.a[1], abz = o.b[2] - o.a[2];
      const l2 = abx * abx + aby * aby + abz * abz;
      near.push({ ax: o.a[0], ay: o.a[1], az: o.a[2], abx, aby, abz, inv: l2 > 1e-12 ? 1 / l2 : 0, solid: o.solid });
    }
    return near;
  }

  /** Each fin vertex, as drawn, held off the sand and inside the glass, laid onto the room it keeps
   *  round each furnishing it has gone into, never through it, and held FIN_CLEAR under the water's
   *  surface (in the water: up is against the globe's gravity). Only what is drawn moves: the fish swims as
   *  it would, its fins solved as they would be. */
  layFins(env, obstacles) {
    const v = this.vertices, fins = this.finVertex, water = this.waterState;
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < v.length; i += 3) {
      if (!fins[i / 3]) continue;
      for (let k = 0; k < 3; k++) {
        if (v[i + k] < lo[k]) lo[k] = v[i + k];
        if (v[i + k] > hi[k]) hi[k] = v[i + k];
      }
    }
    const near = [];
    for (const o of obstacles) {
      const room = o.fin ?? o.solid;
      if (!(room > 0)) continue;
      const s = room + FIN_CLEAR;
      let apart = false;
      for (let k = 0; k < 3; k++) if (Math.min(o.a[k], o.b[k]) - s > hi[k] || Math.max(o.a[k], o.b[k]) + s < lo[k]) apart = true;
      if (apart) continue;
      const abx = o.b[0] - o.a[0], aby = o.b[1] - o.a[1], abz = o.b[2] - o.a[2], l2 = abx * abx + aby * aby + abz * abz;
      near.push({ ax: o.a[0], ay: o.a[1], az: o.a[2], abx, aby, abz, inv: l2 > 1e-12 ? 1 / l2 : 0, out: s });
    }
    // (The surface where the probes find it, else the globe's level; out of the water, none.)
    const g = env.gravity, weight = Math.hypot(g[0], g[1], g[2]);
    const measured = Number.isFinite(water.surface), wet = water.submerged > (measured ? 0.2 : 0.5) && weight > 1e-6;
    const u0 = wet ? -g[0] / weight : 0, u1 = wet ? -g[1] / weight : 0, u2 = wet ? -g[2] / weight : 0;
    const top = (measured ? water.surface : env.level) - FIN_CLEAR, sand = water.sand + FIN_CLEAR, glass = env.radius - FIN_CLEAR;
    for (let i = 0; i < v.length; i += 3) {
      if (!fins[i / 3]) continue;
      let x = v[i], y = v[i + 1], z = v[i + 2];
      // (Off the sand and inside the glass first: where the wood sits on the sand, the wood wins, a
      // fin's edge in the sand by a hair rather than in the bark. The water's surface last of all.)
      if (y < sand) y = sand;
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > glass) { x *= glass / r; y *= glass / r; z *= glass / r; }
      // (Out of one room can be into the next, where rooms overlap: again, until it is out of all.)
      for (let pass = 0, moved = true; moved && pass < 3; pass++) {
        moved = false;
        for (const o of near) {
          const t = Math.max(0, Math.min(1, ((x - o.ax) * o.abx + (y - o.ay) * o.aby + (z - o.az) * o.abz) * o.inv));
          const cx = o.ax + o.abx * t, cy = o.ay + o.aby * t, cz = o.az + o.abz * t;
          const ox = x - cx, oy = y - cy, oz = z - cz, l = Math.sqrt(ox * ox + oy * oy + oz * oz);
          if (l < o.out - 1e-9 && l > 1e-9) { x = cx + ox / l * o.out; y = cy + oy / l * o.out; z = cz + oz / l * o.out; moved = true; }
        }
      }
      if (wet) {
        const over = x * u0 + y * u1 + z * u2 - top;
        if (over > 0) { x -= over * u0; y -= over * u1; z -= over * u2; }
      }
      v[i] = x; v[i + 1] = y; v[i + 2] = z;
    }
  }

  disturb(dt) {
    const s = this.swim, surface = this.waterState?.surface ?? this.level, lip = this.mouth;
    // Opening its mouth at the film, the lips draw the water in: the surface dimples, then rings.
    // (Lingering at the film between gulps, gasping, its mouth is shut: the clock is short of 0.)
    if (s.mode === 'gulp' && s.gulpClock >= 0 && s.gulpClock < RIPPLE_TIME && Math.abs(lip.y - surface) < 0.03) {
      this.rippleAt.set(lip.x, surface, lip.z);
      this.ripple += RIPPLE_RATE * dt * Math.sin(Math.PI * Math.min(1, s.gulpClock / RIPPLE_TIME));
    }
    // Diving from the film (and darting off it), the air it took in leaves as a few small bubbles.
    const bubbling = (s.mode === 'dive' && s.timer > 0.55) ? DIVE_BUBBLES : (s.mode === 'startle' && s.startleDive && s.startleClock < 0.4) ? STARTLE_BUBBLES : 0;
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
    const lift = body.gill * 0.046 + this.fish.userData.display.flare * 0.085;
    for (const { mesh, offset, rest, deform, cover, fin, cells, place, nodes } of this.parts) {
      const e = mesh.matrixWorld.elements, count = rest.length / 3;
      // (A fin's vertices that sit on its solver's nodes: the body carried those this frame already,
      // for the solver's displacement, unless the solver took no step.)
      const carried = fin && fin.carriedBy === body && fin.carriedAt === body.revision ? fin.carried : null;
      const data = fin ? fin.displacement : null;
      for (let i = 0; i < count; i++) {
        let x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
        if (deform) {
          if (cover) z += cover[i] * lift;
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
