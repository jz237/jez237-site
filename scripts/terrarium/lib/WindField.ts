import * as THREE from 'three';
import {TANK} from './Case';

const toHalf = THREE.DataUtils.toHalfFloat;

/**
 * Air moving inside the case: a small 2-D incompressible flow (semi-Lagrangian
 * advection, Jacobi pressure projection, walls that turn the flow aside), stirred
 * by the wind tool, cloud outflow and the lamp's slow convection. Velocities are
 * in m/s; 1 m/s is a strong gust at this scale. Packed every frame into a texture
 * (u, w, speed, turbulence) that plants, moss, water, fog and rain sample.
 */
export class WindField {
  readonly nx = 48;
  readonly nz = 20;
  readonly cell: number;
  readonly x0 = -TANK.w / 2;
  readonly z0 = -TANK.d / 2;
  private u: Float32Array;
  private w: Float32Array;
  private u2: Float32Array;
  private w2: Float32Array;
  private p: Float32Array;
  private div: Float32Array;
  private turb: Float32Array;
  private pixels: Uint16Array;
  readonly texture: THREE.DataTexture;
  /** Slow ambient drift (convection from the lamp), m/s. */
  readonly ambient = new THREE.Vector2();
  private ambientDir = Math.random() * Math.PI * 2;
  energy = 0; // mean speed, for sound and drying
  storm = 0; // set by the clouds: storms are gustier
  private time = 0;
  readonly uniforms = {
    tWind: {value: null as THREE.Texture | null},
    uWindBox: {value: new THREE.Vector4(-TANK.w / 2, -TANK.d / 2, TANK.w, TANK.d)},
    uGust: {value: new THREE.Vector3()}, // ambient xz, storminess
  };

  constructor() {
    this.cell = TANK.w / this.nx;
    const N = this.nx * this.nz;
    this.u = new Float32Array(N);
    this.w = new Float32Array(N);
    this.u2 = new Float32Array(N);
    this.w2 = new Float32Array(N);
    this.p = new Float32Array(N);
    this.div = new Float32Array(N);
    this.turb = new Float32Array(N);
    // Half floats filter linearly everywhere WebGL 2 runs.
    this.pixels = new Uint16Array(N * 4);
    this.texture = new THREE.DataTexture(this.pixels, this.nx, this.nz, THREE.RGBAFormat, THREE.HalfFloatType);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.needsUpdate = true;
    this.uniforms.tWind.value = this.texture;
  }

  private sampleField(f: Float32Array, gx: number, gz: number) {
    gx = Math.min(this.nx - 1.001, Math.max(0, gx));
    gz = Math.min(this.nz - 1.001, Math.max(0, gz));
    const i = Math.floor(gx), j = Math.floor(gz), a = gx - i, b = gz - j;
    const k = j * this.nx + i;
    return (f[k] * (1 - a) + f[k + 1] * a) * (1 - b) + (f[k + this.nx] * (1 - a) + f[k + this.nx + 1] * a) * b;
  }

  /** Local wind at (x, z) including the ambient drift, m/s. */
  sample(x: number, z: number, out = new THREE.Vector2()) {
    const gx = (x - this.x0) / this.cell - 0.5, gz = (z - this.z0) / this.cell - 0.5;
    const g = this.gust(x, z);
    return out.set(this.sampleField(this.u, gx, gz) + this.ambient.x * g, this.sampleField(this.w, gx, gz) + this.ambient.y * g);
  }
  turbulence(x: number, z: number) {
    return this.sampleField(this.turb, (x - this.x0) / this.cell - 0.5, (z - this.z0) / this.cell - 0.5);
  }
  private gust(x: number, z: number) {
    const t = this.time;
    const n = Math.sin(x * 9.1 - this.ambient.x * t * 6 + t * 0.7) * Math.sin(z * 13.7 - this.ambient.y * t * 6 + t * 0.4);
    return Math.min(2.5, Math.max(0.1, 1 + n * (0.35 + 0.9 * this.storm)));
  }

  /** Blends the flow toward (vx, vz) over a soft disc (radius in metres). */
  addForce(x: number, z: number, vx: number, vz: number, radius = 0.07, strength = 1) {
    const a = radius / this.cell;
    const ci = (x - this.x0) / this.cell - 0.5, cj = (z - this.z0) / this.cell - 0.5;
    const r = Math.ceil(a * 2);
    for (let j = Math.max(0, Math.floor(cj - r)); j <= Math.min(this.nz - 1, Math.ceil(cj + r)); j++) {
      for (let i = Math.max(0, Math.floor(ci - r)); i <= Math.min(this.nx - 1, Math.ceil(ci + r)); i++) {
        const d2 = ((i - ci) ** 2 + (j - cj) ** 2) / (a * a);
        if (d2 > 4) continue;
        const wgt = Math.min(1, Math.exp(-1.5 * d2) * strength);
        const k = j * this.nx + i;
        this.u[k] += (vx - this.u[k]) * wgt;
        this.w[k] += (vz - this.w[k]) * wgt;
      }
    }
  }

  /** Outflow from a point (a raining cloud's downdraught, a lightning strike). */
  addRadial(x: number, z: number, speed: number, radius: number) {
    const a = radius / this.cell;
    const ci = (x - this.x0) / this.cell - 0.5, cj = (z - this.z0) / this.cell - 0.5;
    const r = Math.ceil(a * 1.5);
    for (let j = Math.max(0, Math.floor(cj - r)); j <= Math.min(this.nz - 1, Math.ceil(cj + r)); j++) {
      for (let i = Math.max(0, Math.floor(ci - r)); i <= Math.min(this.nx - 1, Math.ceil(ci + r)); i++) {
        const dx = i - ci, dz = j - cj, d = Math.hypot(dx, dz);
        if (d < 1e-3 || d > a * 1.5) continue;
        const f = speed * Math.exp(-((d / a) ** 2)) * (d / a);
        const k = j * this.nx + i;
        this.u[k] += (dx / d) * f;
        this.w[k] += (dz / d) * f;
      }
    }
  }

  update(dt: number, convection = 0) {
    this.time += dt;
    const nx = this.nx, nz = this.nz, N = nx * nz;
    // ambient: a lazy convective drift that wanders, stronger in storms
    this.ambientDir += Math.sin(this.time * 0.03) * 0.25 * dt;
    const s = 0.012 * convection + this.storm * 0.12;
    this.ambient.x += (Math.cos(this.ambientDir) * s - this.ambient.x) * (1 - Math.exp(-0.5 * dt));
    this.ambient.y += (Math.sin(this.ambientDir) * s * 0.6 - this.ambient.y) * (1 - Math.exp(-0.5 * dt));
    // self-advection
    const k0 = dt / this.cell;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const bx = i - this.u[k] * k0, bz = j - this.w[k] * k0;
      this.u2[k] = this.sampleField(this.u, bx, bz);
      this.w2[k] = this.sampleField(this.w, bx, bz);
    }
    [this.u, this.u2] = [this.u2, this.u];
    [this.w, this.w2] = [this.w2, this.w];
    // walls: flow into the glass is turned aside
    for (let j = 0; j < nz; j++) {
      const a = j * nx, b = j * nx + nx - 1;
      if (this.u[a] < 0) this.u[a] *= 0.2;
      if (this.u[b] > 0) this.u[b] *= 0.2;
    }
    for (let i = 0; i < nx; i++) {
      const a = i, b = (nz - 1) * nx + i;
      if (this.w[a] < 0) this.w[a] *= 0.2;
      if (this.w[b] > 0) this.w[b] *= 0.2;
    }
    // pressure projection keeps the air from piling up
    const at = (f: Float32Array, i: number, j: number) => f[Math.min(nz - 1, Math.max(0, j)) * nx + Math.min(nx - 1, Math.max(0, i))];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      this.div[j * nx + i] = -0.5 * (at(this.u, i + 1, j) - at(this.u, i - 1, j) + at(this.w, i, j + 1) - at(this.w, i, j - 1));
    }
    for (let k = 0; k < N; k++) this.p[k] *= 0.8;
    for (let it = 0; it < 14; it++) {
      for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
        this.p[j * nx + i] = (this.div[j * nx + i] + at(this.p, i - 1, j) + at(this.p, i + 1, j) + at(this.p, i, j - 1) + at(this.p, i, j + 1)) / 4;
      }
    }
    const decay = Math.exp(-0.55 * dt);
    let sum = 0;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      this.u[k] = (this.u[k] - 0.5 * (at(this.p, i + 1, j) - at(this.p, i - 1, j))) * decay;
      this.w[k] = (this.w[k] - 0.5 * (at(this.p, i, j + 1) - at(this.p, i, j - 1))) * decay;
      const curl = (at(this.w, i + 1, j) - at(this.w, i - 1, j)) - (at(this.u, i, j + 1) - at(this.u, i, j - 1));
      this.turb[k] += (Math.min(1, Math.abs(curl) * 6) - this.turb[k]) * (1 - Math.exp(-4 * dt));
      const sp = Math.hypot(this.u[k], this.w[k]);
      sum += sp;
      const q = k * 4;
      this.pixels[q] = toHalf(this.u[k] + this.ambient.x);
      this.pixels[q + 1] = toHalf(this.w[k] + this.ambient.y);
      this.pixels[q + 2] = toHalf(sp);
      this.pixels[q + 3] = toHalf(this.turb[k]);
    }
    this.energy = sum / N + this.ambient.length();
    this.texture.needsUpdate = true;
    this.uniforms.uGust.value.set(this.ambient.x, this.ambient.y, this.storm);
  }
}

/** GLSL for sampling the wind texture (needs uniforms tWind, uWindBox, uGust, uTime). */
export const WIND_GLSL = /* glsl */ `
uniform sampler2D tWind; uniform vec4 uWindBox; uniform vec3 uGust;
float wgh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wgn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(wgh(i), wgh(i+vec2(1,0)), f.x), mix(wgh(i+vec2(0,1)), wgh(i+vec2(1,1)), f.x), f.y); }
vec4 windTex(vec2 xz){ return texture2D(tWind, clamp((xz - uWindBox.xy) / uWindBox.zw, 0.0, 1.0)); }
// local wind (m/s) with travelling gust bands riding on the ambient drift
vec2 windAt(vec2 xz, float t){
  vec4 w = windTex(xz);
  float g = wgn(xz * 3.5 - uGust.xy * t * 5.0 + vec2(t * 0.05, 0.0));
  return w.xy + uGust.xy * (0.55 + 0.9 * g - 1.0) * (0.6 + uGust.z);
}
`;
