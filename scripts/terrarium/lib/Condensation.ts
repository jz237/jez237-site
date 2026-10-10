import * as THREE from 'three';

/**
 * Per-pane condensation field: fog density grows toward a humidity target,
 * collects along the cool upper edges and corners, can be wiped clear, and
 * sheds drips that run down leaving clear trails.
 */
export class Condensation {
  readonly texture: THREE.DataTexture;
  readonly fog: Float32Array;
  private bias: Float32Array;
  private bytes: Uint8Array;
  private drips: {x: number; y: number; v: number; life: number; w: number}[] = [];
  private acc = 0;
  private rnd: () => number;

  constructor(readonly w: number, readonly h: number, readonly size: THREE.Vector2, seed: number, readonly kind: 'front' | 'side' | 'back' | 'top') {
    this.fog = new Float32Array(w * h);
    this.bias = new Float32Array(w * h);
    this.bytes = new Uint8Array(w * h);
    let s = seed * 9301 + 49297;
    this.rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = x / (w - 1), v = y / (h - 1); // v = 0 bottom, 1 top
      const edge = Math.max(Math.pow(Math.abs(u - 0.5) * 2, 6), Math.pow(v, 3) * 0.9, Math.pow(1 - v, 8) * 0.4);
      const n = Math.sin(u * 13.1 + seed) * Math.sin(v * 9.7 - seed * 0.7) * 0.5 + 0.5;
      const kindBias = kind === 'front' ? 0.18 : kind === 'top' ? 0.8 : kind === 'back' ? 0.5 : 0.7;
      this.bias[y * w + x] = Math.min(1, kindBias * (0.45 + 0.55 * edge) + 0.25 * edge + 0.15 * (n - 0.5));
    }
    this.texture = new THREE.DataTexture(this.bytes, w, h, THREE.RedFormat, THREE.UnsignedByteType);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.needsUpdate = true;
  }

  /** Initial state for a given humidity (0..1). */
  settle(humidity: number) {
    for (let i = 0; i < this.fog.length; i++) this.fog[i] = this.target(i, humidity);
    this.upload();
  }

  private target(i: number, humidity: number) {
    return Math.max(0, Math.min(1, this.bias[i] * (0.25 + humidity * 1.1) - 0.08 + humidity * 0.12));
  }

  /** Clears a circular patch; (u, v) in 0..1 pane space, radius in metres. */
  wipe(u: number, v: number, radius: number) {
    const rx = (radius / this.size.x) * this.w, ry = (radius / this.size.y) * this.h;
    const cx = u * (this.w - 1), cy = v * (this.h - 1);
    for (let y = Math.max(0, Math.floor(cy - ry)); y <= Math.min(this.h - 1, Math.ceil(cy + ry)); y++)
      for (let x = Math.max(0, Math.floor(cx - rx)); x <= Math.min(this.w - 1, Math.ceil(cx + rx)); x++) {
        const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
        if (d < 1) {
          const i = y * this.w + x;
          this.fog[i] *= Math.min(1, Math.pow(d, 3) * 0.9);
        }
      }
    this.upload();
  }

  update(dt: number, humidity: number, warmth: number) {
    this.acc += dt;
    if (this.acc < 0.1) return;
    const step = this.acc;
    this.acc = 0;
    // Regrowth is slow at low humidity and quicker after rain or mist.
    const grow = (0.006 + humidity * 0.05) * step;
    const dry = (0.01 + warmth * 0.02) * step;
    for (let i = 0; i < this.fog.length; i++) {
      const t = this.target(i, humidity);
      const f = this.fog[i];
      this.fog[i] = f < t ? f + (t - f) * grow * 4 : f - (f - t) * dry * 2;
    }
    if (this.kind !== 'top' && humidity > 0.35 && this.rnd() < step * humidity * 0.5 * (this.size.x / 0.6)) {
      const x = this.rnd() * this.w;
      const y = this.h * (0.55 + this.rnd() * 0.4);
      if (this.fog[Math.floor(y) * this.w + Math.floor(x)] > 0.55) this.drips.push({x, y, v: 0, life: 0.5 + this.rnd() * 2.5, w: 0.8 + this.rnd() * 0.8});
    }
    for (const d of this.drips) {
      d.v = Math.min(d.v + step * 30, 18 + 10 * d.w);
      const n = Math.max(1, Math.round(d.v * step));
      for (let k = 0; k < n; k++) {
        d.y -= 1;
        if (d.y < 1) {d.life = 0; break;}
        const yi = Math.floor(d.y);
        for (let dx = -2; dx <= 2; dx++) {
          const xi = Math.floor(d.x + dx);
          if (xi < 0 || xi >= this.w) continue;
          const fall = Math.abs(dx) <= d.w ? 0.08 : 0.5;
          this.fog[yi * this.w + xi] *= fall;
        }
        d.x += (this.rnd() - 0.5) * 0.6;
      }
      d.life -= step;
    }
    this.drips = this.drips.filter((d) => d.life > 0);
    this.upload();
  }

  private upload() {
    for (let i = 0; i < this.fog.length; i++) this.bytes[i] = Math.max(0, Math.min(255, this.fog[i] * 255));
    this.texture.needsUpdate = true;
  }

  average() {
    let s = 0;
    for (let i = 0; i < this.fog.length; i++) s += this.fog[i];
    return s / this.fog.length;
  }
}
