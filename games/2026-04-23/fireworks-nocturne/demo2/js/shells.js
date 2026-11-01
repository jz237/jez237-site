// The shell library. Each break type lays out its stars (direction, speed,
// burn time, colour chemistry, tails) the way the real product is built, plus
// how much smoke it leaves, how bright it lights the air and how it sounds.
import { K_STAR, K_CRACKLE, K_FLASH, T_GOLD, T_SILVER, T_GLITTER, T_COLOR, T_KAMURO, T_STROBE } from './particles.js?v=4';

// Linear-light colours of the metal salts, with relative brightness.
export const COLORS = {
  red: { c: [1.0, 0.05, 0.028], p: 1.55, n: 'strontium red' },
  orange: { c: [1.0, 0.3, 0.045], p: 1.6, n: 'calcium orange' },
  yellow: { c: [1.0, 0.68, 0.11], p: 1.8, n: 'sodium yellow' },
  lemon: { c: [0.8, 1.0, 0.22], p: 1.6, n: 'lemon' },
  green: { c: [0.2, 1.0, 0.15], p: 1.45, n: 'barium green' },
  aqua: { c: [0.08, 0.8, 0.75], p: 1.25, n: 'aqua' },
  blue: { c: [0.08, 0.25, 1.0], p: 1.1, n: 'copper blue' },
  purple: { c: [0.55, 0.12, 1.0], p: 1.2, n: 'strontium-copper violet' },
  pink: { c: [1.0, 0.26, 0.52], p: 1.45, n: 'pink' },
  white: { c: [1.0, 0.96, 0.9], p: 2.4, n: 'magnalium white' },
  silver: { c: [0.9, 0.94, 1.0], p: 2.0, n: 'titanium silver' },
  gold: { c: [1.0, 0.48, 0.13], p: 1.35, n: 'charcoal gold' },
};
const COLOR_KEYS = ['red', 'orange', 'yellow', 'lemon', 'green', 'aqua', 'blue', 'purple', 'pink', 'white', 'silver'];
const PAIRS = [['red', 'green'], ['blue', 'yellow'], ['purple', 'lemon'], ['pink', 'aqua'], ['red', 'white'], ['blue', 'white'], ['green', 'purple'], ['orange', 'blue'], ['yellow', 'red'], ['aqua', 'red'], ['white', 'red'], ['lemon', 'blue']];

export const colorOf = (k, gain = 1) => col(k, gain);
const col = (k, gain = 1) => { const c = COLORS[k]; return [c.c[0] * c.p * gain, c.c[1] * c.p * gain, c.c[2] * c.p * gain]; };

// Burst geometry helpers -------------------------------------------------
function fib(n, r) {
  const out = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  const rot = rotation(r);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i + 0.5) / n * 2;
    const rad = Math.sqrt(1 - y * y);
    const a = i * ga;
    let d = [Math.cos(a) * rad, y, Math.sin(a) * rad];
    d = mul(rot, d);
    d = jitter(d, 0.06, r);
    out.push(d);
  }
  return out;
}
function rotation(r) {
  const a = r() * Math.PI * 2, b = Math.acos(r() * 2 - 1), c = r() * Math.PI * 2;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  return [ca * cc - sa * cb * sc, -ca * sc - sa * cb * cc, sa * sb, sa * cc + ca * cb * sc, -sa * sc + ca * cb * cc, -ca * sb, sb * sc, sb * cc, cb];
}
const mul = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
function jitter(d, s, r) {
  const x = d[0] + (r() - 0.5) * s, y = d[1] + (r() - 0.5) * s, z = d[2] + (r() - 0.5) * s;
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
}
function basis(n) {
  const a = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let u = [n[1] * a[2] - n[2] * a[1], n[2] * a[0] - n[0] * a[2], n[0] * a[1] - n[1] * a[0]];
  const l = Math.hypot(...u); u = u.map(v => v / l);
  const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  return [u, v];
}
// A plane that roughly faces the main viewing terrace, tilted at random.
function facingPlane(B, tilt) {
  const to = [0 - B.pos[0], 20 - B.pos[1], 0 - B.pos[2]];
  const l = Math.hypot(...to);
  let n = to.map(v => v / l);
  n = jitter(n, tilt, B.r);
  return n;
}

// Star speed so the burst reaches radius R about 2 s in, with bloom rate q.
function speedFor(R, q) {
  const c = Math.log(1 + 2 * q) / R;
  return { c, v: q / c };
}

// Builds stars into B.batch. dir: unit vector; o: options.
function star(B, dir, o) {
  const { c, v } = speedFor(o.R ?? B.R, o.q ?? 5);
  const sv = v * (o.speed ?? 1) * (1 + (B.r() - 0.5) * (o.vj ?? 0.08)) * (1 + B.skew * (dir[0] * B.axis[0] + dir[1] * B.axis[1] + dir[2] * B.axis[2]));
  const life = (o.life ?? 2) * (1 + (B.r() - 0.5) * (o.lj ?? 0.18));
  const s = {
    p0: o.p0 ?? B.pos, t0: o.t0 ?? B.t,
    v0: [dir[0] * sv + B.vel[0] * 0.6, dir[1] * sv + B.vel[1] * 0.6, dir[2] * sv + B.vel[2] * 0.6],
    c: o.c ?? c, kg: o.kg ?? 0.85, life,
    colA: o.colA, colB: o.colB, tChange: o.tChange !== undefined ? o.tChange * life : undefined,
    strobe: o.strobe, glowR: o.glowR ?? 0.55, seed: B.r(), kind: o.kind ?? K_STAR,
    popT: o.popT, flicker: o.flicker ?? 0.18, head: o.head ?? 1,
    tail: o.tail ? { ...o.tail, life: o.tail.life * (0.85 + 0.3 * B.r()) } : null,
  };
  B.add(s);
  return s;
}

const tailGold = (B, life = 0.9, rate = 34, power = 0.22) => ({ kind: T_GOLD, rate: rate * B.tailRate, life, eject: 1.6, inherit: 0.22, ks: 3.2, power: power / B.tailRate });
const tailSilver = (B, life = 0.35, rate = 40, power = 0.3) => ({ kind: T_SILVER, rate: rate * B.tailRate, life, eject: 5, inherit: 0.15, ks: 4, power: power / B.tailRate });
const tailKamuro = (B, life = 3.0, rate = 18, power = 0.32) => ({ kind: T_KAMURO, rate: rate * B.tailRate, life, eject: 0.8, inherit: 0.08, ks: 2.4, power: power / B.tailRate });
const tailGlitter = (B, life = 1.6, rate = 26, power = 0.35) => ({ kind: T_GLITTER, rate: rate * B.tailRate, life, eject: 1.1, inherit: 0.1, ks: 2.6, power: power / B.tailRate });

// Workshop choices: B.color is a colour key or undefined (the shell's own pick);
// B.color2 is undefined (own pick), 'none', or a colour key.
function second(B, roll, avoid) {
  if (B.color2 === undefined) return roll ? pickColor(B, avoid) : null;
  return B.color2 === 'none' ? null : B.color2;
}
const goldOr = (B, roll) => (B.color ? (B.color === 'gold' ? null : B.color) : (roll ? pickColor(B) : null));
const isSilver = (B, roll) => (B.color ? B.color === 'silver' || B.color === 'white' : roll);

function pickColor(B, avoid) {
  let k;
  do { k = B.r.pick(COLOR_KEYS); } while (k === avoid);
  return k;
}

// Shell types --------------------------------------------------------------
// Each receives B: { t, pos, vel, r, inches, R, n (star count scale), add, puffs, light, pops, child, caption }
export const SHELLS = {
  peony(B) {
    const roll = B.r();
    const a = B.color || pickColor(B), b = second(B, B.r.chance(0.3), a);
    const n = B.count(110);
    const dirs = fib(n, B.r);
    const split = B.color2 === undefined && roll < 0.25 && b; // two-colour halves
    const change = !split && b && (B.color2 !== undefined || roll < 0.55);
    dirs.forEach(d => {
      let ca = col(a), cb = null;
      if (split) ca = d[0] * B.axis[2] - d[2] * B.axis[0] > 0 ? col(a) : col(b);
      if (change) cb = col(b);
      star(B, d, { colA: ca, colB: cb, tChange: change ? 0.5 : undefined, life: 1.9 + B.inches * 0.08 });
    });
    B.light(mix(col(a), b ? col(b) : col(a)), 1.0);
    B.smokeLevel(1);
    B.caption(split ? `${COLORS[a].n} and ${COLORS[b].n} split peony` : change ? `${COLORS[a].n} to ${COLORS[b].n} peony` : `${COLORS[a].n} peony`);
  },

  chrysanthemum(B) {
    const a = B.color || pickColor(B);
    const silver = B.color2 === undefined ? B.r.chance(0.35) : B.color2 === 'silver';
    const n = B.count(95);
    fib(n, B.r).forEach(d => star(B, d, { colA: col(a), life: 1.8 + B.inches * 0.07, tail: silver ? tailSilver(B) : tailGold(B, 0.8 + B.inches * 0.05) }));
    B.light(col(a), 1.1);
    B.smokeLevel(1.4);
    B.caption(`${COLORS[a].n} chrysanthemum, ${silver ? 'titanium' : 'charcoal'} tails`);
  },

  pistil(B) {
    let [a, b] = B.r.pick(PAIRS);
    if (B.color) { a = B.color; if (b === a) b = pickColor(B, a); }
    if (B.color2 && B.color2 !== 'none') b = B.color2;
    const n = B.count(110);
    fib(n, B.r).forEach(d => star(B, d, { colA: col(a), life: 2.0 + B.inches * 0.08 }));
    fib(Math.round(n * 0.4), B.r).forEach(d => star(B, d, { colA: col(b), R: B.R * 0.42, life: 1.6 + B.inches * 0.06, glowR: 0.5 }));
    if (B.inches >= 8 && B.r.chance(0.6)) {
      const c = pickColor(B, a);
      fib(Math.round(n * 0.22), B.r).forEach(d => star(B, d, { colA: col(c), R: B.R * 0.2, life: 1.3, glowR: 0.45 }));
    }
    B.light(mix(col(a), col(b)), 1.15);
    B.smokeLevel(1.1);
    B.caption(`${COLORS[a].n} peony with ${COLORS[b].n} pistil`);
  },

  dahlia(B) {
    const a = B.color || pickColor(B);
    const n = Math.round(B.count(46));
    fib(n, B.r).forEach(d => star(B, d, { colA: col(a, 1.6), life: 2.9 + B.inches * 0.08, q: 3.2, glowR: 0.9, kg: 0.7, tail: { kind: T_COLOR, rate: 22 * B.tailRate, life: 0.5, eject: 1.2, inherit: 0.25, ks: 3.5, power: 0.3 / B.tailRate } }));
    B.light(col(a), 0.9);
    B.smokeLevel(1);
    B.caption(`${COLORS[a].n} dahlia`);
  },

  willow(B) {
    const n = B.count(80);
    // dim charcoal stars that slow at once and weep down on long hanging tails
    fib(n, B.r).forEach(d => star(B, d, { colA: col('gold', 0.22), life: 5.2 + B.inches * 0.15, q: 3.2, R: B.R * 0.8, kg: 0.95, glowR: 0.45, tail: { kind: T_KAMURO, rate: 24 * B.tailRate, life: 3.6 + B.inches * 0.08, eject: 0.35, inherit: 0.04, ks: 4.2, power: 0.3 / B.tailRate }, flicker: 0.45 }));
    B.light([1.0, 0.5, 0.15], 0.75, 4.6);
    B.smokeLevel(2.2);
    B.caption(`golden willow`);
  },

  kamuro(B) {
    const n = B.count(120);
    const silver = isSilver(B, B.r.chance(0.35));
    fib(n, B.r).forEach(d => star(B, d, { colA: silver ? col('silver', 0.3) : col('gold', 0.32), life: 4.0 + B.inches * 0.12, q: 4.2, kg: 1.05, glowR: 0.5, tail: { kind: T_KAMURO, rate: 30 * B.tailRate, life: 2.9 + B.inches * 0.07, eject: 0.5, inherit: 0.05, ks: 3.6, power: (silver ? 0.36 : 0.32) / B.tailRate }, flicker: 0.4 }));
    B.light(silver ? [0.95, 0.9, 0.85] : [1.0, 0.55, 0.2], 1.1, 3.8);
    B.smokeLevel(2.6);
    B.caption(silver ? 'silver kamuro crown' : 'gold kamuro crown');
  },

  brocade(B) {
    const n = B.count(90);
    const tip = second(B, B.r.chance(0.5));
    fib(n, B.r).forEach(d => star(B, d, { colA: tip ? col(tip) : col('gold', 0.8), colB: col('gold', 0.5), tChange: tip ? 0.15 : undefined, life: 2.8 + B.inches * 0.08, q: 6, kg: 1.0, tail: tailKamuro(B, 1.8, 28, 0.32) }));
    B.light([1.0, 0.6, 0.25], 1.1, 3);
    B.smokeLevel(2);
    B.caption(tip ? `brocade crown with ${COLORS[tip].n} tips` : 'brocade crown');
  },

  palm(B) {
    const arms = B.r.int(6, 10);
    const a = goldOr(B, B.r.chance(0.5));
    for (let i = 0; i < arms; i++) {
      const ang = i / arms * Math.PI * 2 + B.r() * 0.3;
      const up = 0.35 + B.r() * 0.35;
      const d = norm3([Math.cos(ang) * (1 - up), up, Math.sin(ang) * (1 - up)]);
      star(B, d, { colA: a ? col(a, 1.3) : col('gold', 1.0), life: 2.6, q: 4, glowR: 1.1, kg: 0.55, tail: tailGold(B, 1.3, 70, 0.36), head: 1.4 });
    }
    // the trunk keeps climbing a moment with its own tail
    star(B, [0, 1, 0], { colA: col('gold', 0.6), life: 0.9, q: 2, R: B.R * 0.2, kg: 0.5, tail: tailGold(B, 1.1, 60, 0.3) });
    B.light(a ? col(a) : [1.0, 0.6, 0.25], 0.8, 2.8);
    B.smokeLevel(1.4);
    B.caption(a ? `${COLORS[a].n} palm` : 'gold palm tree');
  },

  horsetail(B) {
    const n = B.count(60);
    const silver = isSilver(B, B.r.chance(0.4));
    for (let i = 0; i < n; i++) {
      const ang = B.r() * Math.PI * 2, s = B.r() * 0.6;
      const d = norm3([Math.cos(ang) * s, 0.5 - B.r() * 0.8, Math.sin(ang) * s]);
      star(B, d, { colA: silver ? col('silver', 0.6) : col('gold', 0.7), life: 3.6, q: 2.2, R: B.R * 0.35, kg: 0.9, tail: silver ? tailSilver(B, 0.9, 30, 0.3) : tailKamuro(B, 2.2, 18, 0.3) });
    }
    B.light([1.0, 0.6, 0.3], 0.6, 3.6);
    B.smokeLevel(1.6);
    B.caption(silver ? 'silver horsetail' : 'gold horsetail');
  },

  ring(B) {
    const a = B.color || pickColor(B);
    const inner = second(B, B.r.chance(0.35), a);
    const double = !!inner;
    const nrm = facingPlane(B, 0.9);
    const rings = double ? [[a, 1], [inner, 0.62]] : [[a, 1]];
    rings.forEach(([k, s], ri) => {
      const [u, v] = basis(ri ? jitter(nrm, 0.5, B.r) : nrm);
      const n = Math.round(B.count(60) * s);
      for (let i = 0; i < n; i++) {
        const t = i / n * Math.PI * 2;
        const d = norm3([u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]);
        star(B, d, { colA: col(k), R: B.R * s, life: 2.1, vj: 0.03 });
      }
    });
    B.light(col(a), 0.8);
    B.smokeLevel(0.8);
    B.caption(double ? 'double ring' : `${COLORS[a].n} ring`);
  },

  saturn(B) {
    const a = B.color || pickColor(B);
    const b = B.color2 && B.color2 !== 'none' ? B.color2 : pickColor(B, a);
    fib(B.count(55), B.r).forEach(d => star(B, d, { colA: col(a), R: B.R * 0.5, life: 2.0 }));
    const nrm = jitter([0.15, 1, 0.2], 0.7, B.r);
    const [u, v] = basis(norm3(nrm));
    const n = B.count(70);
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2;
      star(B, norm3([u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]), { colA: col(b), life: 2.2, vj: 0.03 });
    }
    B.light(mix(col(a), col(b)), 0.9);
    B.smokeLevel(0.9);
    B.caption(`saturn: ${COLORS[a].n} planet, ${COLORS[b].n} ring`);
  },

  crossette(B) {
    const n = Math.round(B.count(14) * 0.7 + 6);
    const a = goldOr(B, B.r.chance(0.5));
    const split = 0.75 + B.r() * 0.3;
    fib(n, B.r).forEach(d => {
      const s = star(B, d, { colA: col('gold', 0.8), life: split, q: 3, glowR: 0.7, tail: tailGold(B, 0.7, 50, 0.3), lj: 0.02 });
      // four children leave at right angles from where the parent breaks
      const p = B.pos3(s, s.life), v = B.vel3(s, s.life);
      const vl = Math.hypot(...v) || 1;
      const [u, w] = basis(v.map(x => x / vl));
      for (let k = 0; k < 4; k++) {
        const ang = k * Math.PI / 2 + B.r() * 0.3;
        const dd = [u[0] * Math.cos(ang) + w[0] * Math.sin(ang), u[1] * Math.cos(ang) + w[1] * Math.sin(ang), u[2] * Math.cos(ang) + w[2] * Math.sin(ang)];
        B.add({
          p0: p, t0: B.t + s.life, v0: [dd[0] * 32 + v[0] * 0.5, dd[1] * 32 + v[1] * 0.5, dd[2] * 32 + v[2] * 0.5], c: 0.05, kg: 0.9,
          life: 1.1 + B.r() * 0.3, colA: a ? col(a) : col('gold', 0.9), glowR: 0.55, seed: B.r(), flicker: 0.25,
          tail: a ? null : tailGold(B, 0.6, 36, 0.24),
        });
      }
      B.pops([{ t: B.t + s.life, pos: p, loud: 0.5 }]);
    });
    B.light(a ? col(a) : [1.0, 0.6, 0.25], 0.7, 2.2);
    B.smokeLevel(1.2);
    B.caption(a ? `${COLORS[a].n} crossette` : 'gold crossette');
  },

  strobe(B) {
    const n = B.count(90);
    const c2 = B.color ? (B.color === 'white' ? null : B.color) : (B.r.chance(0.4) ? pickColor(B, 'white') : null);
    fib(n, B.r).forEach(d => star(B, d, { colA: c2 ? col(c2, 1.4) : col('white', 1.1), life: 3.2, q: 4, strobe: 7 + B.r() * 6, kg: 1.1 }));
    B.light(c2 ? col(c2) : [1, 1, 1], 0.5, 3.2);
    B.smokeLevel(1);
    B.caption(c2 ? `${COLORS[c2].n} strobe` : 'white strobe');
  },

  crackle(B) {
    const n = B.count(130);
    const pops = [];
    const base = B.color || (B.r.chance(0.5) ? pickColor(B) : null);
    if (base) fib(Math.round(n * 0.3), B.r).forEach(d => star(B, d, { colA: col(base), life: 1.0, R: B.R * 0.8 }));
    for (let i = 0; i < n; i++) {
      const d = B.r.dir();
      const popT = 0.55 + B.r() * 1.4;
      const s = star(B, d, { colA: col('gold', 0.2), kind: K_CRACKLE, popT, life: popT + 0.05, q: 4, R: B.R * (0.5 + B.r() * 0.45), glowR: 0.9, tail: tailGold(B, 0.25, 24, 0.12) });
      if (i % 3 === 0) pops.push({ t: B.t + popT, pos: B.pos3(s, popT), loud: 0.35 + B.r() * 0.5 });
    }
    B.pops(pops);
    B.light([1.0, 0.85, 0.6], 0.5, 1.9);
    B.smokeLevel(1.3);
    B.caption(base ? `${COLORS[base].n} with crackling dragon eggs` : 'crackling dragon eggs');
  },

  glitter(B) {
    const n = B.count(85);
    fib(n, B.r).forEach(d => star(B, d, { colA: col('gold', 0.5), life: 2.6, q: 4.5, kg: 1.3, tail: tailGlitter(B, 1.9, 24, 0.4) }));
    B.light([1.0, 0.7, 0.35], 0.7, 3);
    B.smokeLevel(1.6);
    B.caption('glitter time-rain');
  },

  spider(B) {
    const n = B.count(70);
    fib(n, B.r).forEach(d => star(B, d, { colA: col('gold', 0.9), life: 1.5, q: 9, speed: 1.15, kg: 0.7, tail: tailGold(B, 1.4, 60, 0.3) }));
    B.light([1.0, 0.6, 0.25], 1.0, 2);
    B.smokeLevel(1.6);
    B.caption('gold spider');
  },

  salute(B) {
    star(B, [0, 1, 0], { colA: [60, 58, 55], kind: K_FLASH, life: 0.09, R: 1, q: 0.1, glowR: 12 });
    fib(B.count(40), B.r).forEach(d => star(B, d, { colA: col('white', 0.8), life: 0.45, q: 10, R: B.R * 0.25, tail: tailSilver(B, 0.25, 30, 0.4) }));
    B.light([1, 0.97, 0.92], 2.6, 0.5, 6);
    B.smokeLevel(0.7, [0.92, 0.92, 0.95]);
    B.sound('salute');
    B.caption('titanium salute');
  },

  multibreak(B) {
    const a = B.color || pickColor(B);
    fib(B.count(70), B.r).forEach(d => star(B, d, { colA: col(a), life: 1.6 }));
    const k = B.r.int(4, 6);
    const b = B.color2 && B.color2 !== 'none' ? B.color2 : pickColor(B, a);
    for (let i = 0; i < k; i++) {
      const ang = i / k * Math.PI * 2 + B.r() * 0.4;
      const off = [Math.cos(ang) * B.R * 0.9, (B.r() - 0.3) * B.R * 0.6, Math.sin(ang) * B.R * 0.9];
      B.child(1.1 + B.r() * 0.5, [B.pos[0] + off[0], B.pos[1] + off[1], B.pos[2] + off[2]], 'peony', 3, b);
    }
    B.light(col(a), 0.9);
    B.smokeLevel(1);
    B.caption(`${COLORS[a].n} peony with ${COLORS[b].n} satellite breaks`);
  },

  heart(B) { pattern(B, 'heart'); },
  smiley(B) { pattern(B, 'smiley'); },
  starshape(B) { pattern(B, 'star'); },
};

function pattern(B, kind) {
  const a = B.color || (kind === 'heart' ? B.r.pick(['red', 'pink', 'red']) : kind === 'smiley' ? B.r.pick(['yellow', 'lemon', 'orange']) : B.r.pick(['white', 'aqua', 'green', 'blue']));
  const nrm = facingPlane(B, 0.35);
  let [u, v] = basis(nrm);
  // keep the shape upright: v closest to world up
  const ang = Math.atan2(u[1], v[1]);
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const u2 = [u[0] * ca - v[0] * sa, u[1] * ca - v[1] * sa, u[2] * ca - v[2] * sa];
  const v2 = [u[0] * sa + v[0] * ca, u[1] * sa + v[1] * ca, u[2] * sa + v[2] * ca];
  u = u2; v = v2;
  if (v[1] < 0) { v = v.map(x => -x); u = u.map(x => -x); }
  const pts = [];
  const N = B.count(70);
  if (kind === 'heart') {
    for (let i = 0; i < N; i++) {
      const t = i / N * Math.PI * 2;
      pts.push([16 * Math.sin(t) ** 3 / 17, (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17]);
    }
  } else if (kind === 'smiley') {
    for (let i = 0; i < N; i++) { const t = i / N * Math.PI * 2; pts.push([Math.cos(t), Math.sin(t)]); }
    for (let i = 0; i < 10; i++) { const t = i / 10 * Math.PI * 2; pts.push([-0.35 + Math.cos(t) * 0.08, 0.3 + Math.sin(t) * 0.08]); pts.push([0.35 + Math.cos(t) * 0.08, 0.3 + Math.sin(t) * 0.08]); }
    for (let i = 0; i <= 20; i++) { const t = Math.PI * (1.15 + 0.7 * i / 20); pts.push([Math.cos(t) * 0.55, -0.05 + Math.sin(t) * 0.55]); }
  } else {
    const P = [];
    for (let i = 0; i < 10; i++) { const t = Math.PI / 2 + i / 10 * Math.PI * 2; const r = i % 2 ? 0.42 : 1; P.push([Math.cos(t) * r, Math.sin(t) * r]); }
    for (let i = 0; i < N; i++) {
      const f = i / N * 10, k = Math.floor(f), w = f - k;
      const p0 = P[k], p1 = P[(k + 1) % 10];
      pts.push([p0[0] + (p1[0] - p0[0]) * w, p0[1] + (p1[1] - p0[1]) * w]);
    }
  }
  const { c: cq } = speedFor(B.R, 4.5);
  const vBase = 4.5 / cq;
  for (const [x, y] of pts) {
    const dir = [u[0] * x + v[0] * y, u[1] * x + v[1] * y, u[2] * x + v[2] * y];
    const m = Math.hypot(...dir) || 1;
    // speed proportional to distance from centre keeps the shape as it grows
    B.add({ p0: B.pos, t0: B.t, v0: [dir[0] * vBase + B.vel[0] * 0.5, dir[1] * vBase + B.vel[1] * 0.5, dir[2] * vBase + B.vel[2] * 0.5], c: cq / Math.max(m, 0.15), kg: 0.85, life: 2.2, colA: col(a, 1.1), glowR: 0.6, seed: B.r(), flicker: 0.12 });
  }
  B.light(col(a), 0.7);
  B.smokeLevel(0.7);
  B.caption(kind === 'heart' ? 'heart pattern shell' : kind === 'smiley' ? 'smiley-face pattern shell' : 'five-point star pattern shell');
}

export const SHELL_NAMES = {
  peony: 'Peony', chrysanthemum: 'Chrysanthemum', pistil: 'Pistil peony', dahlia: 'Dahlia', willow: 'Willow', kamuro: 'Kamuro',
  brocade: 'Brocade', palm: 'Palm', horsetail: 'Horsetail', ring: 'Ring', saturn: 'Saturn', crossette: 'Crossette', strobe: 'Strobe',
  crackle: 'Crackle', glitter: 'Glitter', spider: 'Spider', salute: 'Salute', multibreak: 'Multi-break', heart: 'Heart', smiley: 'Smiley', starshape: 'Star',
};

function norm3(a) { const l = Math.hypot(...a); return a.map(v => v / l); }
function mix(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; }
