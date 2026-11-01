// CPU twin of the GLSL motion model (glsl.js MOTION). The show uses it to know
// where a shell will be when it breaks, where smoke is laid, where lights sit
// and where each sound starts.

export const G = 9.81;

export function starPos(out, p0, v0, c, kg, t, wind) {
  const sp = Math.hypot(v0[0], v0[1], v0[2]);
  const radial = c > 1e-6 ? Math.log(1 + c * sp * t) / c : sp * t;
  const inv = sp > 1e-4 ? radial / sp : 0;
  const fall = t - (1 - Math.exp(-kg * t)) / kg;
  out[0] = p0[0] + v0[0] * inv + wind[0] * fall;
  out[1] = p0[1] + v0[1] * inv + (wind[1] - G / kg) * fall;
  out[2] = p0[2] + v0[2] * inv + wind[2] * fall;
  return out;
}

export function starVel(out, v0, c, kg, t, wind) {
  const sp = Math.hypot(v0[0], v0[1], v0[2]);
  const f = sp > 1e-4 ? 1 / (1 + c * sp * t) : 0;
  const e = 1 - Math.exp(-kg * t);
  out[0] = v0[0] * f + wind[0] * e;
  out[1] = v0[1] * f + (wind[1] - G / kg) * e;
  out[2] = v0[2] * f + wind[2] * e;
  return out;
}

// Time when vertical velocity reaches zero (apex), by bisection.
export function apexTime(v0, c, kg, wind) {
  const v = [0, 0, 0];
  let lo = 0, hi = 30;
  if (starVel(v, v0, c, kg, 0, wind)[1] <= 0) return 0;
  for (let i = 0; i < 48; i++) {
    const m = (lo + hi) / 2;
    if (starVel(v, v0, c, kg, m, wind)[1] > 0) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}

// Aim a shell from `from` so it reaches `target` near its apex. Returns
// { v0, t } where t is the break time (a touch before apex, like a real fuse).
export function aimShell(from, target, c, kg, wind, fuseFrac = 0.97) {
  const H = target[1] - from[1];
  let speed = Math.sqrt(2 * G * H) * 1.25 + 20;
  let dx = target[0] - from[0], dz = target[2] - from[2];
  let ax = 0, az = 0; // horizontal aim components (unit-sphere x/z)
  const p = [0, 0, 0];
  let t = 1;
  for (let it = 0; it < 24; it++) {
    const ay = Math.sqrt(Math.max(0.2, 1 - ax * ax - az * az));
    const v0 = [ax * speed, ay * speed, az * speed];
    t = apexTime(v0, c, kg, wind) * fuseFrac;
    starPos(p, from, v0, c, kg, t, wind);
    const eh = target[1] - p[1];
    speed *= Math.pow(Math.max(0.2, (p[1] - from[1] + eh) / Math.max(1, p[1] - from[1])), 0.55);
    const reach = Math.max(10, p[1] - from[1]);
    ax += (target[0] - p[0]) / reach * 0.8;
    az += (target[2] - p[2]) / reach * 0.8;
    const m = Math.hypot(ax, az);
    if (m > 0.45) { ax *= 0.45 / m; az *= 0.45 / m; }
    if (Math.abs(eh) < 0.5 && Math.hypot(target[0] - p[0], target[2] - p[2]) < 0.5) break;
  }
  const ay = Math.sqrt(Math.max(0.2, 1 - ax * ax - az * az));
  return { v0: [ax * speed, ay * speed, az * speed], t };
}

// Small seeded PRNG (mulberry32) so a show is the same every time it plays.
export function rng(seed) {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + (hi - lo) * r();
  r.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * r());
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.chance = (p) => r() < p;
  r.dir = (out = [0, 0, 0]) => {
    const z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    out[0] = s * Math.cos(a); out[1] = z; out[2] = s * Math.sin(a);
    return out;
  };
  return r;
}
