// A small circular height field for the short waves riding on the main slosh.
// Fixed time steps keep the wave speed independent of the renderer's frame rate.
const SIZE = 65, STEP = 1 / 60;
export const RIPPLE_HEIGHT = 0.055, RIPPLE_SLOPE = 0.85;
// Alpha stores this fraction of the signed surface Laplacian.
export const RIPPLE_CURVATURE = 0.16;
const byte = n => 128 + Math.round(127 * Math.max(-1, Math.min(1, n)));

export class SurfaceRipples {
  size = SIZE;
  data = new Uint8Array(SIZE * SIZE * 4).fill(128);
  heights = new Float32Array(SIZE * SIZE);
  previous = new Float32Array(SIZE * SIZE);
  shown = new Float32Array(SIZE * SIZE);
  wallX = new Float32Array(SIZE * SIZE);
  wallZ = new Float32Array(SIZE * SIZE);
  taper = new Float32Array(SIZE * SIZE);
  debt = 0;
  lastX = 0; lastZ = 0;
  wallTravel = 0;

  constructor(radius) {
    this.radius = radius;
    this.cell = 2 * radius / (SIZE - 1);
    this.propagation = (0.77 * STEP / this.cell) ** 2;
    const inside = [];
    for (let j = 1; j < SIZE - 1; j++) for (let i = 1; i < SIZE - 1; i++) {
      const x = 2 * i / (SIZE - 1) - 1, z = 2 * j / (SIZE - 1) - 1;
      const r = Math.hypot(x, z), k = j * SIZE + i;
      if (r >= 1) continue;
      inside.push(k);
      this.taper[k] = Math.min(1, (1 - r) * 22);
      // Build-up against the glass sends a wave back across the bowl.
      const rim = Math.exp(-((r - 0.88) ** 2) / 0.0035);
      this.wallX[k] = x * rim;
      this.wallZ[k] = z * rim;
    }
    this.inside = Uint16Array.from(inside);
  }

  disturb(x, z, radius, speed) {
    const cx = (x + this.radius) / this.cell, cz = (z + this.radius) / this.cell;
    const reach = radius / this.cell;
    for (let j = Math.max(1, Math.ceil(cz - reach)); j <= Math.min(SIZE - 2, cz + reach); j++) {
      for (let i = Math.max(1, Math.ceil(cx - reach)); i <= Math.min(SIZE - 2, cx + reach); i++) {
        const s = ((i - cx) ** 2 + (j - cz) ** 2) / (reach * reach), k = j * SIZE + i;
        if (s < 1) this.previous[k] -= STEP * speed * (1 - s) * (1 - 3 * s) * this.taper[k];
      }
    }
  }

  step(dt, vx, vz) {
    this.debt += dt;
    const steps = Math.floor((this.debt + 1e-9) / STEP);
    if (!steps) return;
    this.debt = Math.max(0, this.debt - steps * STEP);
    const drive = (v, last) => Math.max(-7, Math.min(7, 0.38 * (v - last) / (steps * STEP) + 2.2 * v)) * STEP ** 2;
    const dx = drive(vx, this.lastX), dz = drive(vz, this.lastZ);
    this.lastX = vx; this.lastZ = vz;
    const speed = Math.hypot(vx, vz);
    for (let n = 0; n < steps; n++) {
      // As the slosh runs up the curved wall, short crests spread back from
      // either side of the high point. Their crossings concentrate the light.
      this.wallTravel += speed * STEP;
      if (this.wallTravel >= .095) {
        this.wallTravel %= .095;
        const x = this.radius * vx / speed, z = this.radius * vz / speed;
        const kick = Math.min(.95, 1.35 * speed);
        for (const side of [-.32, .32]) {
          const px = .81*x - side*z, pz = .81*z + side*x;
          this.disturb(px, pz, .13*this.radius, kick);
          this.disturb(-px, -pz, .13*this.radius, -kick);
        }
      }
      const h = this.heights, next = this.previous;
      for (const k of this.inside) {
        const lap = h[k - 1] + h[k + 1] + h[k - SIZE] + h[k + SIZE] - 4 * h[k];
        next[k] = h[k] + 0.972 * (h[k] - next[k]) + this.propagation * lap + dx * this.wallX[k] + dz * this.wallZ[k];
      }
      this.previous = h;
      this.heights = next;
    }
    const h = this.shown, inv = 0.5 / this.cell, curvature = RIPPLE_CURVATURE / this.cell ** 2;
    for (const k of this.inside) h[k] = this.taper[k] * Math.max(-RIPPLE_HEIGHT, Math.min(RIPPLE_HEIGHT, this.heights[k]));
    for (const k of this.inside) {
      const l = h[k - 1], r = h[k + 1], b = h[k - SIZE], f = h[k + SIZE];
      this.data[4 * k] = byte((r - l) * inv / RIPPLE_SLOPE);
      this.data[4 * k + 1] = byte((f - b) * inv / RIPPLE_SLOPE);
      this.data[4 * k + 2] = byte(h[k] / RIPPLE_HEIGHT);
      this.data[4 * k + 3] = byte((l + r + b + f - 4 * h[k]) * curvature);
    }
  }

  heightAt(x, z) {
    const r2 = (x * x + z * z) / this.radius ** 2;
    if (r2 >= 1) return 0;
    const i = (x + this.radius) / this.cell, j = (z + this.radius) / this.cell;
    const ix = Math.floor(i), iz = Math.floor(j), k = iz * SIZE + ix;
    const fx = i - ix, fz = j - iz, h = this.shown;
    const a = h[k] + fx * (h[k + 1] - h[k]);
    const b = h[k + SIZE] + fx * (h[k + SIZE + 1] - h[k + SIZE]);
    return (a + fz * (b - a)) * Math.min(1, 24 * (1 - r2));
  }
}
