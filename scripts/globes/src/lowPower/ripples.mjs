// A small circular height field for the short waves riding on the main slosh.
// Fixed time steps keep the wave speed independent of the renderer's frame rate.
const SIZE = 65, STEP = 1 / 60;
const FLOW_RESPONSE = 1 - Math.exp(-STEP / .07);
export const RIPPLE_HEIGHT = 0.085, RIPPLE_SLOPE = 0.85;
// Alpha stores this fraction of the signed surface Laplacian.
export const RIPPLE_CURVATURE = 0.16;
const byte = n => 128 + Math.round(127 * Math.max(-1, Math.min(1, n)));

export class SurfaceRipples {
  size = SIZE;
  data = new Uint8Array(SIZE * SIZE * 4).fill(128);
  heights = new Float32Array(SIZE * SIZE);
  previous = new Float32Array(SIZE * SIZE);
  shown = new Float32Array(SIZE * SIZE);
  debt = 0;
  flowX = 0; flowZ = 0;

  constructor(radius) {
    this.radius = radius;
    this.cell = 2 * radius / (SIZE - 1);
    this.propagation = (0.77 * STEP / this.cell) ** 2;
    const inside = [], neighbours = [], border = [], sources = [];
    const wall = [], normalX = [], normalZ = [], coupling = [];
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
      // Transfer momentum from the horizontal current over the curved bank.
      // Taper the coupling into the unforced inner surface.
      if (r > .64) {
        wall.push(k);
        normalX.push(x/r); normalZ.push(z/r);
        // Flatten the last few cells so a crest passes smoothly between the
        // axial and diagonal portions of the circular grid boundary.
        const bank = Math.max(0,Math.min(1,(r-.76)/.18));
        // Water drawn up the bank leaves a shallow trough just inside it.
        const acrossTrough = (r-.78)/.052;
        const drawdown = .65*Math.exp(-acrossTrough*acrossTrough);
        coupling.push(bank*bank*(3-2*bank) - drawdown);
      }
    }
    this.inside = Uint16Array.from(inside);
    this.neighbours = Uint16Array.from(neighbours);
    this.wall = Uint16Array.from(wall);
    this.normalX = Float32Array.from(normalX);
    this.normalZ = Float32Array.from(normalZ);
    this.coupling = Float32Array.from(coupling);
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
    const nb = this.neighbours;
    for (let n = 0; n < steps; n++) {
      const h = this.heights, next = this.previous;
      let i = 0;
      for (const k of this.inside) {
        const lap = h[nb[i]] + h[nb[i+1]] + h[nb[i+2]] + h[nb[i+3]] - 4 * h[k];
        i += 4;
        next[k] = h[k] + 0.972 * (h[k] - next[k]) + this.propagation * lap;
      }
      // Incoming flow takes a short time to turn upward at the glass. Follow
      // its acceleration through a reversal, then let the field carry the wave.
      const dx = FLOW_RESPONSE*(vx-this.flowX), dz = FLOW_RESPONSE*(vz-this.flowZ);
      this.flowX += dx; this.flowZ += dz;
      const ax = .50*dx/STEP + 1.2*this.flowX, az = .50*dz/STEP + 1.2*this.flowZ;
      const strength2 = ax*ax + az*az;
      const gain = 1.75*STEP**2 / Math.sqrt(1 + strength2/16);
      const invStrength2 = 1/(.035+strength2);
      const flow2 = this.flowX*this.flowX + this.flowZ*this.flowZ;
      const runUp = 5.5*STEP**2 / (.34+flow2);
      for (let j = 0; j < this.wall.length; j++) {
        const normalDrive = ax*this.normalX[j] + az*this.normalZ[j];
        const incidence2 = normalDrive*normalDrive*invStrength2;
        const push = gain*normalDrive*(.12+.88*incidence2*incidence2*incidence2);
        // Normal momentum flux piles up the leading crest and draws down its
        // shoulders. Subtract its circular mean so fill volume stays constant.
        const normalFlow = this.flowX*this.normalX[j] + this.flowZ*this.normalZ[j];
        next[this.wall[j]] += this.coupling[j]*(push + runUp*(normalFlow*normalFlow-.5*flow2));
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
