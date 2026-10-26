// What floats in the betta bowl (render/bowlScape.ts draws it): an Indian almond leaf on the water
// and the betta's bubble nest against the glass at the waterline. Both ride the simulated surface,
// read from columns of density probes (FluidSim's, slots LIFE_PROBE_AT on: idle in this globe).
//
// The leaf is carried by the water at the film, slowly drawn to the glass by the meniscus there
// (a floating thing on water that wets the glass drifts to it and stays) and turned to lie along
// it, kept clear of the nest. The nest is fixed to the glass (it turns with the bowl) and bobs
// with the film; sloshing breaks its outer bubbles, and the fish adds to it each time it takes air.
//
// Sim frame throughout (world axes, the globe's centre at the origin).

import * as THREE from 'three/webgpu';
import { LEAF, NEST } from '../render/bowlScape';
import type { KoiSense } from '../fish/Koi';

/** Where its probes go in FluidSim's list: three columns under the leaf (its middle, towards its
 *  tip, to one side), then one at the nest; each COLUMN probes, COLUMN_STEP apart, round the
 *  water's resting level. */
export const LIFE_PROBE_AT = 24;
const COLUMN = 8;
const COLUMN_STEP = 0.016;
const COLUMNS = 4;
export const LIFE_PROBES = COLUMN * COLUMNS;
/** The leaf's probes: towards its tip, and to its side (world units from its middle). */
const TIP = 0.15;
const SIDE = 0.08;
/** How fast it takes up the water's motion (s), drifts to the glass (units/s) and turns to lie
 *  along it once there (1/s). */
const LEAF_FOLLOW = 0.9;
const LEAF_TO_GLASS = 0.006;
const LEAF_ALIGN = 0.5;
/** The nest's place on the glass (its bearing in the bowl's frame: front right, in view), how far
 *  in from the glass its probe column is, and its raft's reach from its heart (for the leaf). */
const NEST_BEARING = 1.25;
const NEST_PROBE_IN = 0.08;
const NEST_REACH = 0.25;
/** How hard the bowl being shaken breaks it: bubbles a second for each rad/s the bowl turns
 *  faster than NEST_CALM (a gentle tilt leaves it be; a hard shake for a few seconds leaves little
 *  of it); and how many the fish adds each time it takes air. */
const NEST_CALM = 1.2;
const NEST_BREAK = 9;
const NEST_BUILD = 9;

const smooth = (from: number, to: number, dt: number, rate: number): number => from + (to - from) * (1 - Math.exp(-rate * dt));

export class BowlLife {
  /** For the shader (bowlScape.ts scapeLife), column-major: the leaf's middle and heading; that it
   *  is there and the film's slope under it; the nest's heart and bearing; its bubbles. */
  readonly matrix = new THREE.Matrix4();
  private readonly points = new Float32Array(LIFE_PROBES * 4);
  private readonly leaf = { x: -0.2, z: 0.34, y: NaN, yaw: 0.4, vx: 0, vz: 0, spin: 0, sx: 0, sz: 0 };
  private nestCount = Math.round(NEST.length * 0.85);
  private nestY = NaN;
  private nestAz = 0;
  private lastMode = '';
  private rand = 0.5;

  constructor(private readonly radius: number) {}

  /** How many bubbles the nest has (Learn mode sees the fish add to it; tests count them). */
  get bubbles(): number {
    return Math.round(this.nestCount);
  }

  /** How much the nest wants rebuilding (0: whole, 1: gone): the fish goes up for air more often
   *  while it does (bettaSwim.mjs gulpUrge), and each trip adds to it. */
  get nestNeed(): number {
    return Math.max(0, Math.min(1, 1 - this.nestCount / (NEST.length * 0.85)));
  }

  /** level: the water's resting height; rotation: the globe's turn (column-major 3x3); turning:
   *  how fast it turns (rad/s); fishMode: the betta's (bettaSwim.mjs mode), to see it take air. */
  update(dt: number, sense: KoiSense | null, level: number, iso: number, rotation: ArrayLike<number>, turning: number, fishMode: string): void {
    if (!(dt > 0)) {
      this.write(level);
      return;
    }
    const L = this.leaf;
    const columnHeight = (c: number): number | null => (sense ? surfaceIn(sense.probes, LIFE_PROBE_AT + c * COLUMN, level, iso) : null);

    // The nest: on the glass, at its bearing as the bowl has turned it.
    const nx = rotation[0] * Math.cos(NEST_BEARING) + rotation[6] * Math.sin(NEST_BEARING);
    const nz = rotation[2] * Math.cos(NEST_BEARING) + rotation[8] * Math.sin(NEST_BEARING);
    this.nestAz = Math.atan2(nz, nx);
    const hn = columnHeight(3);
    // A shaken bowl breaks it up; held still or tipped gently, it keeps what it has.
    if (turning > NEST_CALM) this.nestCount = Math.max(0, this.nestCount - NEST_BREAK * (turning - NEST_CALM) * dt);
    if (hn !== null) this.nestY = Number.isFinite(this.nestY) ? smooth(this.nestY, hn, dt, 10) : hn;
    if (this.lastMode === 'gulp' && fishMode === 'dive') this.nestCount = Math.min(NEST.length, this.nestCount + NEST_BUILD);
    this.lastMode = fishMode;

    // The leaf: its height and the film's slope under it, and the water's motion at the film.
    const hc = columnHeight(0);
    if (hc !== null) {
      L.y = Number.isFinite(L.y) ? smooth(L.y, hc, dt, 10) : hc;
      const ht = columnHeight(1);
      const hs = columnHeight(2);
      const ax = Math.cos(L.yaw), az = Math.sin(L.yaw);
      const gt = ht !== null ? (ht - hc) / TIP : 0;
      const gs = hs !== null ? (hs - hc) / SIDE : 0;
      // (The side probe lies across it: (-sin, cos) of its heading.)
      L.sx = smooth(L.sx, THREE.MathUtils.clamp(ax * gt - az * gs, -0.6, 0.6), dt, 8);
      L.sz = smooth(L.sz, THREE.MathUtils.clamp(az * gt + ax * gs, -0.6, 0.6), dt, 8);
    }
    if (!Number.isFinite(L.y)) L.y = level;
    const flow = sense ? flowAtFilm(sense.probes, LIFE_PROBE_AT, iso) : null;
    const wx = flow ? flow[0] : 0;
    const wz = flow ? flow[2] : 0;
    // Drawn to the glass by the meniscus, slowly.
    const r = Math.hypot(L.x, L.z);
    const ox = r > 1e-6 ? L.x / r : 1;
    const oz = r > 1e-6 ? L.z / r : 0;
    L.vx = smooth(L.vx, wx + ox * LEAF_TO_GLASS, dt, 1 / LEAF_FOLLOW);
    L.vz = smooth(L.vz, wz + oz * LEAF_TO_GLASS, dt, 1 / LEAF_FOLLOW);
    L.x += L.vx * dt;
    L.z += L.vz * dt;
    // A slow wandering turn.
    this.rand = (this.rand * 9301 + 49297) % 233280;
    L.spin = smooth(L.spin, (this.rand / 233280 - 0.5) * 0.12, dt, 0.4);
    L.yaw += L.spin * dt;

    // Held off the glass by its own outline (its reach outwards at its heading), and off the nest.
    const rim = Math.sqrt(Math.max(0.01, this.radius * this.radius - L.y * L.y)) - 0.012;
    const reach = (ux: number, uz: number): number => Math.abs(ux * Math.cos(L.yaw) + uz * Math.sin(L.yaw)) * 0.5 * LEAF.length + Math.abs(-ux * Math.sin(L.yaw) + uz * Math.cos(L.yaw)) * LEAF.width;
    const r2 = Math.hypot(L.x, L.z);
    const ux = r2 > 1e-6 ? L.x / r2 : 1;
    const uz = r2 > 1e-6 ? L.z / r2 : 0;
    const limit = rim - reach(ux, uz);
    if (r2 > limit) {
      L.x = ux * limit;
      L.z = uz * limit;
      const out = L.vx * ux + L.vz * uz;
      if (out > 0) {
        L.vx -= out * ux;
        L.vz -= out * uz;
      }
      // At the glass it swings round to lie along it.
      const tangent = Math.atan2(ux, -uz);
      const turn = Math.atan2(Math.sin(2 * (tangent - L.yaw)), Math.cos(2 * (tangent - L.yaw))) / 2;
      L.spin = smooth(L.spin, turn * LEAF_ALIGN * 2, dt, 2);
    }
    const ny = Number.isFinite(this.nestY) ? this.nestY : level;
    const nr = Math.sqrt(Math.max(0.01, this.radius * this.radius - ny * ny));
    const hx = Math.cos(this.nestAz) * (nr - NEST_REACH * 0.5);
    const hz = Math.sin(this.nestAz) * (nr - NEST_REACH * 0.5);
    const dx = L.x - hx, dz = L.z - hz, dn = Math.hypot(dx, dz);
    const clear = NEST_REACH + 0.5 * reach(dn > 1e-6 ? dx / dn : 1, dn > 1e-6 ? dz / dn : 0);
    if (this.nestCount > 4 && dn < clear) {
      const k = dn > 1e-6 ? (clear - dn) / dn : 0;
      L.x += dx * k;
      L.z += dz * k;
    }
    this.write(level);
  }

  /** The probe points, for FluidSim.setProbes(LIFE_PROBE_AT, ...). */
  probePoints(): Float32Array {
    return this.points;
  }

  private write(level: number): void {
    const L = this.leaf;
    const ax = Math.cos(L.yaw), az = Math.sin(L.yaw);
    const y = Number.isFinite(this.nestY) ? this.nestY : level;
    const nr = Math.sqrt(Math.max(0.01, this.radius * this.radius - y * y));
    const nestX = Math.cos(this.nestAz) * (nr - 0.003);
    const nestZ = Math.sin(this.nestAz) * (nr - 0.003);
    const columns: [number, number][] = [
      [L.x, L.z],
      [L.x + ax * TIP, L.z + az * TIP],
      [L.x - az * SIDE, L.z + ax * SIDE],
      [nestX - Math.cos(this.nestAz) * NEST_PROBE_IN, nestZ - Math.sin(this.nestAz) * NEST_PROBE_IN],
    ];
    columns.forEach(([x, z], c) => {
      for (let k = 0; k < COLUMN; k++) this.points.set([x, level + (k - (COLUMN - 1) / 2) * COLUMN_STEP, z, 0], (c * COLUMN + k) * 4);
    });
    const e = this.matrix.elements;
    e.fill(0);
    e[0] = L.x;
    e[1] = Number.isFinite(L.y) ? L.y : level;
    e[2] = L.z;
    e[3] = L.yaw;
    e[4] = 1;
    e[5] = L.sx;
    e[6] = L.sz;
    e[8] = nestX;
    e[9] = y;
    e[10] = nestZ;
    e[11] = this.nestAz;
    e[12] = this.nestCount;
  }
}

/** Where the free surface crosses a column of COLUMN probes from `first` (heights round level),
 *  or null when it is outside the column (cf. bettaWater.mjs readBettaSurface). */
function surfaceIn(probes: Float32Array, first: number, level: number, iso: number): number | null {
  let previous = NaN;
  for (let k = 0; k < COLUMN; k++) {
    const density = probes[(first + k) * 4 + 3];
    if (!Number.isFinite(density)) return null;
    if (k === 0 && density < iso) return null;
    if (k > 0 && previous >= iso && density < iso) {
      const h0 = level + (k - 1 - (COLUMN - 1) / 2) * COLUMN_STEP;
      return h0 + COLUMN_STEP * ((previous - iso) / Math.max(1e-6, previous - density));
    }
    previous = density;
  }
  return null;
}

/** The water's motion at the film under the leaf: at its middle column's highest wet probe, or
 *  null when none is wet. */
function flowAtFilm(probes: Float32Array, first: number, iso: number): [number, number, number] | null {
  let at = -1;
  for (let k = 0; k < COLUMN; k++) if (probes[(first + k) * 4 + 3] >= iso) at = (first + k) * 4;
  return at < 0 ? null : [probes[at], probes[at + 1], probes[at + 2]];
}
