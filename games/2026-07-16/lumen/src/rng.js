// Seeded RNG + CPU noise helpers. Sim determinism matters for the North Star
// harness and for replay-stable verification, so all sim randomness flows
// through one stream.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  constructor(seed = 1337) { this.f = mulberry32(seed); }
  reseed(seed) { this.f = mulberry32(seed); }
  next() { return this.f(); }
  range(a, b) { return a + (b - a) * this.f(); }
  int(a, b) { return Math.floor(this.range(a, b + 1)); }
  pick(arr) { return arr[Math.floor(this.f() * arr.length)]; }
  gauss() { // Box-Muller, cheap approximation is fine for cosmetics
    const u = Math.max(1e-9, this.f()), v = this.f();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}

// Value noise for CPU-side placement (flora scatter, path jitter).
const P = new Uint8Array(512);
{
  const rng = mulberry32(0x1CEB00DA);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 512; i++) P[i] = perm[i & 255];
}
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
export function vnoise2(x, y) {
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const h = (a, b) => P[P[a] + b] / 255;
  const u = fade(xf), v = fade(yf);
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}
export function fbm2(x, y, oct = 4) {
  let f = 0, amp = 0.5, tot = 0;
  for (let i = 0; i < oct; i++) { f += amp * vnoise2(x, y); tot += amp; x *= 2.03; y *= 1.97; amp *= 0.5; }
  return f / tot;
}
