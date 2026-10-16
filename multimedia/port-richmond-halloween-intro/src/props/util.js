// Small deterministic helpers shared by the props modules (no THREE dependency here).

// mulberry32: fast seeded PRNG -> function returning [0, 1)
export function rng(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// integer hash -> [0, 1)
export function hash1(n) {
  let x = (n | 0) * 374761393 + 668265263;
  x = (x ^ (x >>> 13)) * 1274126177;
  x = x ^ (x >>> 16);
  return (x >>> 0) / 4294967296;
}
export function hash2(i, j) { return hash1((i | 0) * 73856093 ^ (j | 0) * 19349663); }

export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const smootherstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };

// smooth 1D value noise in [-1, 1], continuous in x, seeded
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash1(i + seed * 7919) * 2 - 1;
  const b = hash1(i + 1 + seed * 7919) * 2 - 1;
  return a + (b - a) * u;
}
export function fbm1(x, seed = 0, oct = 3) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let o = 0; o < oct; o++) { s += amp * noise1(x * f, seed + o * 13); norm += amp; amp *= 0.5; f *= 2.03; }
  return s / norm;
}

// smooth bump: 0 outside [t0, t0 + dur], rises over `rise` s, falls over the rest (cosine shaped)
export function bump(t, t0, rise, dur) {
  if (t <= t0 || t >= t0 + dur) return 0;
  const x = t - t0;
  if (x < rise) return 0.5 - 0.5 * Math.cos((Math.PI * x) / rise);
  return 0.5 + 0.5 * Math.cos((Math.PI * (x - rise)) / (dur - rise));
}

// integral of bump() from -inf to t (closed form), used for wind-driven displacement
export function bumpIntegral(t, t0, rise, dur) {
  if (t <= t0) return 0;
  const fall = dur - rise;
  const x = Math.min(t - t0, dur);
  let s;
  if (x < rise) s = 0.5 * x - (rise / (2 * Math.PI)) * Math.sin((Math.PI * x) / rise);
  else {
    const y = x - rise;
    s = 0.5 * rise + 0.5 * y + (fall / (2 * Math.PI)) * Math.sin((Math.PI * y) / fall);
  }
  return s;
}

// damped oscillation after an impulse at t0 (0 before)
export function ring(t, t0, freq, tau) {
  const x = t - t0;
  if (x < 0) return 0;
  return Math.sin(2 * Math.PI * freq * x) * Math.exp(-x / tau);
}

// colour temperature (Kelvin) -> linear-ish RGB triple (approximation, good for 1500..9000 K)
export function kelvinRGB(k) {
  const t = k / 100;
  let r, g, b;
  if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
  else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
  const c = (v) => Math.pow(clamp(v, 0, 255) / 255, 2.2);
  return [c(r), c(g), c(b)];
}
