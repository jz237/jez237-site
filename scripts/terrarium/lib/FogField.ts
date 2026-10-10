import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL} from './Ground';
import type {WindField} from './WindField';

/**
 * Ground fog as a shallow fluid on a 2-D grid: each cell holds a density, a
 * layer thickness, how freshly it was poured, and its own momentum. Fog runs
 * downhill and pools over the water, drifts with the air, levels out like a
 * liquid, spreads where it is poured, and burns off under the lamp or in a
 * strong wind. Packed into a texture (density, top, base, billow) for the
 * raymarched volume.
 */
export class FogField {
  readonly nx = 60;
  readonly nz = 25;
  readonly cell: number;
  readonly x0 = -TANK.w / 2;
  readonly z0 = -TANK.d / 2;
  private d: Float32Array;
  private h: Float32Array;
  private fresh: Float32Array;
  private vx: Float32Array;
  private vz: Float32Array;
  private ground: Float32Array;
  private t1: Float32Array;
  private t2: Float32Array;
  private t3: Float32Array;
  private pixels: Uint16Array;
  readonly texture: THREE.DataTexture;
  private acc = 0;
  total = 0; // mean density, for humidity and the glass
  maxTop = 0;
  private active = false;
  private windTmp = new THREE.Vector2();

  constructor(heightAt: (x: number, z: number) => number, private wind: WindField) {
    this.cell = TANK.w / this.nx;
    const N = this.nx * this.nz;
    this.d = new Float32Array(N);
    this.h = new Float32Array(N);
    this.fresh = new Float32Array(N);
    this.vx = new Float32Array(N);
    this.vz = new Float32Array(N);
    this.ground = new Float32Array(N);
    this.t1 = new Float32Array(N);
    this.t2 = new Float32Array(N);
    this.t3 = new Float32Array(N);
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + (i + 0.5) * this.cell, z = this.z0 + (j + 0.5) * this.cell;
      // fog lies on the water, not the pool bed
      let g = -1;
      for (const [ox, oz] of [[0, 0], [0.35, 0.35], [-0.35, 0.35], [0.35, -0.35], [-0.35, -0.35]]) g = Math.max(g, heightAt(x + ox * this.cell, z + oz * this.cell));
      this.ground[j * this.nx + i] = Math.max(g, WATER_LEVEL);
    }
    this.pixels = new Uint16Array(N * 4);
    this.texture = new THREE.DataTexture(this.pixels, this.nx, this.nz, THREE.RGBAFormat, THREE.HalfFloatType);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.pack();
  }

  groundAt(x: number, z: number) {
    const i = Math.min(this.nx - 1, Math.max(0, Math.floor((x - this.x0) / this.cell)));
    const j = Math.min(this.nz - 1, Math.max(0, Math.floor((z - this.z0) / this.cell)));
    return this.ground[j * this.nx + i];
  }
  densityAt(x: number, z: number) {
    const i = Math.min(this.nx - 1, Math.max(0, Math.floor((x - this.x0) / this.cell)));
    const j = Math.min(this.nz - 1, Math.max(0, Math.floor((z - this.z0) / this.cell)));
    return this.d[j * this.nx + i];
  }

  /**
   * Pours fog: radius R (m), amount of density, layer thickness (m), outward push
   * (m/s) and freshness (fresh fog billows and resists the lamp).
   */
  splat(x: number, z: number, R: number, amount: number, thick: number, push: number, fresh = 1) {
    const ci = (x - this.x0) / this.cell - 0.5, cj = (z - this.z0) / this.cell - 0.5;
    const r = Math.ceil(R / this.cell) + 1;
    for (let j = Math.max(0, Math.floor(cj - r)); j <= Math.min(this.nz - 1, Math.ceil(cj + r)); j++) {
      for (let i = Math.max(0, Math.floor(ci - r)); i <= Math.min(this.nx - 1, Math.ceil(ci + r)); i++) {
        const dx = (i - ci) * this.cell, dz = (j - cj) * this.cell;
        const dist = Math.hypot(dx, dz);
        const q = dist / R;
        if (q >= 1) continue;
        const A = 1 - smooth(0.3, 1, q);
        const k = j * this.nx + i;
        const add = Math.min(amount * A, 2.2 - this.d[k]);
        if (add > 0) {
          const t = this.d[k] + add;
          this.h[k] = (this.h[k] * this.d[k] + thick * (0.42 + 0.35 * Math.min(1, this.d[k])) * add * 2.2) / Math.max(1e-4, t);
          this.h[k] = Math.min(0.15, this.h[k]);
          this.d[k] = t;
        }
        this.fresh[k] = Math.max(this.fresh[k], fresh * A);
        if (dist > 1e-4) {
          const f = push * A * Math.min(1, 2.2 * q);
          this.vx[k] += (dx / dist) * f;
          this.vz[k] += (dz / dist) * f;
        }
      }
    }
    this.active = true;
  }

  private sample(f: Float32Array, gx: number, gz: number) {
    gx = Math.min(this.nx - 1.001, Math.max(0, gx));
    gz = Math.min(this.nz - 1.001, Math.max(0, gz));
    const i = Math.floor(gx), j = Math.floor(gz), a = gx - i, b = gz - j;
    const k = j * this.nx + i;
    return (f[k] * (1 - a) + f[k + 1] * a) * (1 - b) + (f[k + this.nx] * (1 - a) + f[k + this.nx + 1] * a) * b;
  }

  /** `sun` 0..1 burns fog off; `warm` adds evaporation; `humid` slows it. */
  update(dt: number, sun: number, humid: number) {
    if (!this.active) return;
    this.acc += dt;
    const step = 1 / 30;
    let n = 0;
    while (this.acc >= step && n < 3) {this.acc -= step; this.step(step, sun, humid); n++;}
    if (this.acc > step * 3) this.acc = 0;
    if (n) this.pack();
  }

  private step(dt: number, sun: number, humid: number) {
    const nx = this.nx, nz = this.nz, N = nx * nz, cell = this.cell;
    const {d, h, fresh, vx, vz, ground} = this;
    const at = (f: Float32Array, i: number, j: number) => f[Math.min(nz - 1, Math.max(0, j)) * nx + Math.min(nx - 1, Math.max(0, i))];
    const top = this.t3;
    for (let k = 0; k < N; k++) top[k] = ground[k] + h[k] * smooth(0.02, 0.35, d[k]);
    // 1. velocities: the air's, plus downhill flow of the layer, plus its own push
    const U = this.t1, W = this.t2;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const x = this.x0 + (i + 0.5) * cell, z = this.z0 + (j + 0.5) * cell;
      this.wind.sample(x, z, this.windTmp);
      let gx = (at(top, i + 1, j) - at(top, i - 1, j)) / (2 * cell);
      let gz = (at(top, i, j + 1) - at(top, i, j - 1)) / (2 * cell);
      const gl = Math.hypot(gx, gz);
      if (gl > 1.6) {gx *= 1.6 / gl; gz *= 1.6 / gl;}
      const slide = 0.045 * smooth(0.12, 0.9, d[k]);
      let u = this.windTmp.x * 0.9 - gx * slide + vx[k];
      let w = this.windTmp.y * 0.9 - gz * slide + vz[k];
      // flow fades out against the glass
      const wall = Math.min(x - this.x0, -this.x0 - x, z - this.z0, -this.z0 - z);
      const fade = Math.min(1, wall / 0.06);
      if ((x < 0 && u < 0) || (x > 0 && u > 0)) u *= fade;
      if ((z < 0 && w < 0) || (z > 0 && w > 0)) w *= fade;
      U[k] = u; W[k] = w;
    }
    // 2. semi-Lagrangian advection of density, density-weighted height and freshness
    const nd = new Float32Array(N), ndh = new Float32Array(N), nf = new Float32Array(N);
    const dh = new Float32Array(N);
    for (let k = 0; k < N; k++) dh[k] = d[k] * h[k];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const bx = i - U[k] * dt / cell, bz = j - W[k] * dt / cell;
      nd[k] = this.sample(d, bx, bz);
      ndh[k] = this.sample(dh, bx, bz);
      nf[k] = this.sample(fresh, bx, bz);
    }
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      // converging flow piles the fog up; diverging flow thins it
      const div = (at(U, i + 1, j) - at(U, i - 1, j) + at(W, i, j + 1) - at(W, i, j - 1)) / (2 * cell);
      const bt = Math.min(1.3, Math.max(0.7, 1 - div * dt));
      const s = Math.sqrt(bt);
      d[k] = Math.min(2.2, nd[k] * s);
      h[k] = Math.min(0.15, (nd[k] > 1e-5 ? ndh[k] / nd[k] : h[k]) * s);
      fresh[k] = nf[k];
    }
    // 3. diffusion and levelling (the top flattens like a liquid)
    const kd = Math.min(0.2, 0.4 * dt);
    const lev = Math.min(0.45, 1.6 * dt);
    for (let k = 0; k < N; k++) {this.t1[k] = d[k]; this.t2[k] = ground[k] + h[k] * smooth(0.02, 0.35, d[k]);}
    let total = 0, maxTop = 0;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const lap = at(this.t1, i - 1, j) + at(this.t1, i + 1, j) + at(this.t1, i, j - 1) + at(this.t1, i, j + 1) - 4 * this.t1[k];
      d[k] += kd * lap;
      if (d[k] > 0.02) {
        let dl = 0;
        for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const kk = Math.min(nz - 1, Math.max(0, j + dj)) * nx + Math.min(nx - 1, Math.max(0, i + di));
          const wn = d[kk] / (d[kk] + 0.08);
          dl += wn * (this.t2[kk] - this.t2[k]) * 0.25;
        }
        h[k] = Math.max(0.004, h[k] + lev * dl);
      }
      // 4. dissipation: the lamp burns it off (fresh fog resists), wind and turbulence tear it
      const x = this.x0 + (i + 0.5) * cell, z = this.z0 + (j + 0.5) * cell;
      this.wind.sample(x, z, this.windTmp);
      const ws = this.windTmp.length();
      const kk = 0.006 + sun * 0.045 * (1 - 0.65 * fresh[k]) * (1.3 - humid) + 0.5 * Math.max(0, ws - 0.35) + 0.12 * this.wind.turbulence(x, z) * 0.3;
      d[k] *= Math.exp(-kk * dt);
      if (d[k] < 0.08) d[k] = Math.max(0, d[k] - 0.0025 * dt);
      h[k] *= Math.exp(-sun * 0.02 * dt);
      fresh[k] *= Math.exp(-dt / 5);
      vx[k] *= Math.exp(-2.4 * dt);
      vz[k] *= Math.exp(-2.4 * dt);
      total += d[k];
      if (d[k] > 0.03) maxTop = Math.max(maxTop, ground[k] + h[k]);
    }
    this.total = total / N;
    this.maxTop = maxTop;
    if (total < 1e-3) this.active = false;
  }

  private pack() {
    const nx = this.nx, nz = this.nz;
    const toHalf = THREE.DataUtils.toHalfFloat;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      // top: a density-weighted, lightly blurred layer surface
      let sw = 0, st = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const kk = Math.min(nz - 1, Math.max(0, j + dj)) * nx + Math.min(nx - 1, Math.max(0, i + di));
        const w = this.d[kk] + 0.02;
        sw += w;
        st += w * (this.ground[kk] + this.h[kk] * (0.45 + 0.55 * smooth(0, 0.8, this.d[kk])));
      }
      const q = k * 4;
      this.pixels[q] = toHalf(this.d[k]);
      this.pixels[q + 1] = toHalf(st / sw);
      this.pixels[q + 2] = toHalf(this.ground[k]);
      this.pixels[q + 3] = toHalf(Math.min(1, this.fresh[k] + Math.hypot(this.vx[k], this.vz[k]) * 5));
    }
    this.texture.needsUpdate = true;
  }
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
