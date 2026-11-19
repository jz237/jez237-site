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
  debt = 0;
  lastX = 0; lastZ = 0;
  wallTravel = 0;

  constructor(radius) {
    this.radius = radius;
    this.cell = 2 * radius / (SIZE - 1);
    this.propagation = (0.77 * STEP / this.cell) ** 2;
    const inside = [], neighbours = [], border = [], sources = [];
    const mid = (SIZE - 1) / 2;
    const wet = (i, j) => (i - mid)**2 + (j - mid)**2 < mid*mid;
    for (let j = 1; j < SIZE - 1; j++) for (let i = 1; i < SIZE - 1; i++) {
      const x = 2 * i / (SIZE - 1) - 1, z = 2 * j / (SIZE - 1) - 1;
      const r = Math.hypot(x, z), k = j * SIZE + i;
      if (r >= 1) continue;
      inside.push(k);
      // At a rigid wall the normal flow vanishes, but the water can rise.
      // A missing neighbour contributes zero flux across that cell face.
      neighbours.push(wet(i-1,j) ? k-1 : k, wet(i+1,j) ? k+1 : k,
        wet(i,j-1) ? k-SIZE : k, wet(i,j+1) ? k+SIZE : k);
      // A rocking bowl excites the broad slosh and shorter crests along the
      // contact line. Odd angular modes lift one side as the other recedes.
      const rim = Math.exp(-((r - 0.88) ** 2) / 0.0035);
      const edge = Math.exp(-((r - .955) ** 2) / .006), angle = Math.atan2(z,x);
      this.wallX[k] = x*rim + edge*(1.8*Math.cos(3*angle) + 3.2*Math.cos(5*angle) + 2.4*Math.cos(7*angle));
      this.wallZ[k] = z*rim + edge*(-1.8*Math.sin(3*angle) + 3.2*Math.sin(5*angle) - 2.4*Math.sin(7*angle));
    }
    this.inside = Uint16Array.from(inside);
    this.neighbours = Uint16Array.from(neighbours);
    // Bilinear samples on a circular rim reach outside the wet cells. Extend
    // their values by one texel so the rendered perimeter is continuous.
    for (let j = 0; j < SIZE; j++) for (let i = 0; i < SIZE; i++) {
      const r = Math.hypot(i-mid, j-mid);
      if (r < mid || r > mid + Math.SQRT2) continue;
      const scale = (mid - .75) / r;
      sources.push(Math.round(mid+(j-mid)*scale)*SIZE + Math.round(mid+(i-mid)*scale));
      border.push(j*SIZE+i);
    }
    this.border = Uint16Array.from(border);
    this.sources = Uint16Array.from(sources);
    this.texels = new Uint32Array(this.data.buffer);
  }

  disturb(x, z, radius, speed) {
    const cx = (x + this.radius) / this.cell, cz = (z + this.radius) / this.cell;
    const reach = radius / this.cell;
    const mid = (SIZE - 1) / 2, left = Math.max(1, Math.ceil(cx - reach)), right = Math.min(SIZE - 2, cx + reach);
    const top = Math.max(1, Math.ceil(cz - reach)), bottom = Math.min(SIZE - 2, cz + reach);
    // Balance the crest with a trough even for an impact clipped by the wall.
    // A reflecting basin would otherwise retain a small change in fill level.
    let weight = 0, moment = 0;
    for (let j = top; j <= bottom; j++) for (let i = left; i <= right; i++) {
      const s = ((i-cx)**2 + (j-cz)**2) / (reach*reach);
      if (s >= 1 || (i-mid)**2 + (j-mid)**2 >= mid*mid) continue;
      weight += 1-s;
      moment += (1-s)*s;
    }
    if (!weight) return;
    const centre = moment / weight;
    for (let j = top; j <= bottom; j++) for (let i = left; i <= right; i++) {
      const s = ((i-cx)**2 + (j-cz)**2) / (reach*reach);
      if (s < 1 && (i-mid)**2 + (j-mid)**2 < mid*mid)
        this.previous[j*SIZE+i] -= 3*STEP*speed*(1-s)*(centre-s);
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
    const speed = Math.hypot(vx, vz), nb = this.neighbours;
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
      let i = 0;
      for (const k of this.inside) {
        const lap = h[nb[i]] + h[nb[i+1]] + h[nb[i+2]] + h[nb[i+3]] - 4 * h[k];
        i += 4;
        next[k] = h[k] + 0.972 * (h[k] - next[k]) + this.propagation * lap + dx * this.wallX[k] + dz * this.wallZ[k];
      }
      this.previous = h;
      this.heights = next;
    }
    const h = this.shown, inv = 0.5 / this.cell, curvature = RIPPLE_CURVATURE / this.cell ** 2;
    // Round the peaks of overlapping reflected waves without clipping their
    // tops into level shelves. Small ripples retain their original amplitude.
    for (const k of this.inside) {
      const v = this.heights[k], ratio = v / RIPPLE_HEIGHT;
      h[k] = v / Math.sqrt(1 + ratio*ratio);
    }
    let i = 0;
    for (const k of this.inside) {
      const l = h[nb[i]], r = h[nb[i+1]], b = h[nb[i+2]], f = h[nb[i+3]];
      i += 4;
      this.data[4 * k] = byte((r - l) * inv / RIPPLE_SLOPE);
      this.data[4 * k + 1] = byte((f - b) * inv / RIPPLE_SLOPE);
      this.data[4 * k + 2] = byte(h[k] / RIPPLE_HEIGHT);
      this.data[4 * k + 3] = byte((l + r + b + f - 4 * h[k]) * curvature);
    }
    for (let j = 0; j < this.border.length; j++) {
      const dst = this.border[j], src = this.sources[j];
      h[dst] = h[src];
      this.texels[dst] = this.texels[src];
    }
  }

  heightAt(x, z) {
    const r2 = (x * x + z * z) / this.radius ** 2;
    if (r2 > 1) { const scale = 1 / Math.sqrt(r2); x *= scale; z *= scale; }
    const i = (x + this.radius) / this.cell, j = (z + this.radius) / this.cell;
    const ix = Math.max(0, Math.min(SIZE-2, Math.floor(i))), iz = Math.max(0, Math.min(SIZE-2, Math.floor(j))), k = iz * SIZE + ix;
    const fx = i - ix, fz = j - iz, h = this.shown;
    const a = h[k] + fx * (h[k + 1] - h[k]);
    const b = h[k + SIZE] + fx * (h[k + SIZE + 1] - h[k + SIZE]);
    return a + fz * (b - a);
  }
}
