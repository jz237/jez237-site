// Deterministic pseudo-random helpers for the sound design (no Math.random anywhere in src/audio).

export function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// mulberry32
export function makeRng(seed) {
  let a = (typeof seed === 'string' ? hashString(seed) : seed >>> 0) || 0x9e3779b9;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    range: (lo, hi) => lo + (hi - lo) * next(),
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length) % arr.length],
    gauss: () => {
      const u = Math.max(1e-9, next());
      const v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    // pick without repeating the previous choice
    pickNoRepeat: (arr, state) => {
      let i = Math.floor(next() * arr.length) % arr.length;
      if (arr.length > 1 && state && i === state.last) i = (i + 1 + Math.floor(next() * (arr.length - 1))) % arr.length;
      if (state) state.last = i;
      return arr[i];
    },
  };
  return rng;
}
