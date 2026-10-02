// wings-spar.js - the leading-edge boom (woven carbon, tapering, wrapping the tip), the root bundle (chrome tube + gold flat bar),
// gold cinch bands, the trailing-edge trim ribbon and the tip sensor. Wing frame: x span, y toward the leading edge, z up.
import { GeoBuf, tube, lathe, prof, hexBolt, bead, torusRing, norm, cross, sub, add, mul, len, lerp3, madd, dot } from './wings-geo.js';
import { outline, yLE, surfaceZ, prof as profile, smooth, clamp, lerp, mk } from './wings-shape.js';
import { surfN } from './wings-vein.js';

const X_ROOT = 2.85;           // boom start (just outside the flex-joint collar)
export const rBoom = profile([[2.8, 0.8], [4.0, 0.76], [6.5, 0.67], [10, 0.57], [14, 0.47], [18, 0.39], [21.4, 0.33], [23.6, 0.26]]);

/** Boom centre line, root -> tip nose, [x, y, z] samples about 0.42 mm apart. */
export function sparPath() {
  const o = outline();
  const tip = o.filter((p) => p[2] === 3);
  const le = o.filter((p) => p[2] === 1);
  const raw = [...tip, ...le].reverse().map((p) => [p[0], p[1]]);
  const pts = [[X_ROOT, 0.14], [3.2, 0.17]];
  let last = pts[pts.length - 1];
  for (const p of raw) {
    if (p[0] < 3.5) continue;
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) >= 0.4) { pts.push(p); last = p; }
  }
  pts.push(raw[raw.length - 1]);
  return pts.map((p) => [p[0], p[1], surfaceZ(p[0], p[1])]);
}

/** Arc-length parameterisation of a polyline: returns (s) => { p, T, i } and total length. */
export function arc(pts) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + len(sub(pts[i], pts[i - 1])));
  const total = cum[cum.length - 1];
  const at = (s) => {
    s = clamp(s, 0, total);
    let i = 1;
    while (i < pts.length - 1 && cum[i] < s) i++;
    const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    const p = lerp3(pts[i - 1], pts[i], t);
    const T = norm(sub(pts[i], pts[i - 1]));
    return { p, T, i };
  };
  const atX = (x) => {
    let i = 1;
    while (i < pts.length - 1 && pts[i][0] < x) i++;
    const t = clamp((x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1));
    const p = lerp3(pts[i - 1], pts[i], t);
    const T = norm(sub(pts[i], pts[i - 1]));
    return { p, T, i };
  };
  return { at, atX, total, cum };
}

/** Section frame at a point: side (outboard, toward the leading edge for a +x tangent), in (inboard, over the membrane) and up (sheet normal). */
function sectionAxes(p, T) {
  const up = surfN(p[0], p[1]);
  const side = norm(cross(up, T));            // up x T: +y (leading edge side) for a +x tangent
  return { up, side, inn: mul(side, -1) };
}

/**
 * Build the spar buffers: carbon boom, gold hardware (collars, bands, flat bar), chrome (bundle tube, bolts).
 * S = ctx.S. Returns { carbon, gold, chrome, path, stat }
 */
export function buildSpar(S) {
  const R = mk(17);
  const carbon = new GeoBuf(), gold = new GeoBuf(), chrome = new GeoBuf();
  const path = sparPath();
  const A = arc(path);
  const sides = S(16, 10);

  /* ---- boom */
  tube(carbon, path, {
    r: (t, i) => { const x = path[i][0]; const r = rBoom(x); return [r, r * 0.94]; },
    sides, n: 2, up: (p) => surfN(p[0], p[1]), capA: 'flat', capB: 'dome', domeRings: 3, domeLen: 1.0, uTile: 3.2, vTile: 1.0,
  });

  /* ---- gold ferrule at the boom root + inlay stripes */
  const ferrule = (x, h, extra = 0.07, groove = true) => {
    const { p, T } = A.atX(x);
    const r = rBoom(x) + extra;
    const o = madd(p, T, -h / 2);
    const pr = prof.ring(r - 0.14, r, h, 0.045);
    lathe(gold, o, T, pr, { sides: S(24, 12), ref: [0, 0, 1], vTile: 1 });
    if (groove) {
      for (const f of [0.22, 0.78]) {
        torusRing(gold, madd(p, T, -h / 2 + h * f), T, r + 0.005, 0.028, { rings: 4, sides: S(24, 12), ref: [0, 0, 1] });
      }
    }
  };
  ferrule(3.2, 0.72, 0.1);
  ferrule(4.55, 0.3, 0.06, false);
  ferrule(7.15, 0.3, 0.055, false);
  ferrule(11.4, 0.3, 0.05, false);
  ferrule(15.0, 0.3, 0.045, false);
  ferrule(18.4, 0.3, 0.04, false);
  ferrule(21.1, 0.54, 0.05);

  /* ---- wide cinch bands with a hex bolt */
  const band = (x, h) => {
    const { p, T } = A.atX(x);
    const r = rBoom(x) + 0.1;
    lathe(gold, madd(p, T, -h / 2), T, prof.ring(r - 0.2, r, h, 0.06), { sides: S(26, 12), ref: [0, 0, 1], vTile: 1 });
    // clamp lug + bolt on the trailing side
    const { up, side } = sectionAxes(p, T);
    const lugC = madd(madd(p, side, r - 0.02), up, 0.0);
    bead(gold, lugC, side, 0.17, 0.28, 0.14, { rings: 4, sides: 8, ref: T });
    hexBolt(chrome, madd(lugC, side, 0.12), side, 0.11, 0.07, { ref: T });
  };
  band(5.85, 0.84);
  band(9.0, 0.7);
  band(12.7, 0.62);
  band(16.4, 0.56);

  /* ---- chrome bundle tube + gold flat bar (root to about a third of the span) */
  const bundle = (kind, dEnd, x0, x1, z0) => {
    // lateral offset toward the trailing edge grows from 0 at the hub to dEnd, then follows the leading edge
    const pts = [];
    const n = Math.ceil((x1 - x0) / 0.5);
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const { p, T } = A.atX(x);
      const { up, inn } = sectionAxes(p, T);
      const k = smooth(2.8, 6.4, x);
      const off = dEnd * k;
      const zoff = z0 * k;
      pts.push(madd(madd(p, inn, off), up, zoff));
    }
    return pts;
  };
  const tubePath = bundle('tube', rBoom(6.5) + 0.3, 2.9, 10.8, -0.1);
  tube(chrome, tubePath, {
    r: (t) => { const r = 0.23 * (1 - 0.18 * t); return r; },
    sides: S(14, 8), up: (p) => surfN(p[0], p[1]), capA: 'none', capB: 'flat', uTile: 2, vTile: 1,
  });
  // open end: dark bore ring is the gold sleeve at the tube tip
  {
    const e = tubePath[tubePath.length - 1], e2 = tubePath[tubePath.length - 2];
    const T = norm(sub(e, e2));
    lathe(gold, madd(e, T, -0.42), T, prof.ring(0.18, 0.285, 0.34, 0.04), { sides: S(18, 10), ref: [0, 0, 1], vTile: 1 });
    const s0 = tubePath[3], s1 = tubePath[2];
    const Ts = norm(sub(s0, s1));
    lathe(gold, madd(s0, Ts, 0.0), Ts, prof.ring(0.2, 0.3, 0.26, 0.035), { sides: S(18, 10), ref: [0, 0, 1], vTile: 1 });
  }
  const barPath = bundle('bar', rBoom(6.5) + 0.78, 3.0, 13.6, -0.2);
  tube(gold, barPath, {
    r: (t) => [0.3 * (1 - 0.3 * t), 0.075], sides: 10, n: 4.2, up: (p) => surfN(p[0], p[1]), capA: 'none', capB: 'dome', domeRings: 2, domeLen: 1.5, uTile: 3, vTile: 1,
  });
  // bar rivets (each side)
  for (let i = 4; i < barPath.length - 2; i += 6) {
    const p = barPath[i], T = norm(sub(barPath[i + 1], barPath[i - 1]));
    const up = surfN(p[0], p[1]);
    hexBolt(chrome, madd(p, up, 0.07), up, 0.1, 0.05, { ref: T });
    hexBolt(chrome, madd(p, up, -0.07), mul(up, -1), 0.1, 0.05, { ref: T });
  }
  void R; void add; void dot; void lerp;
  return { carbon, gold, chrome, path, A };
}

/* ------------------------------------------------------------------ trailing-edge trim */
export function trimPath() {
  const o = outline();
  const te = o.filter((p) => p[2] === 2 || p[2] === 4);
  // outline order: [te..., tip..., le..., root(4)...]; the root-edge samples (tag 4) sit at the END of the list but join the trim start
  const root = o.filter((p) => p[2] === 4);
  const lead = o.filter((p) => p[2] === 2);
  const seq = [...root, ...lead];
  void te;
  // thin out to ~0.45 mm
  const out = [];
  let last = null;
  for (const p of seq) {
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= 0.42) { out.push([p[0], p[1]]); last = p; }
  }
  const tail = seq[seq.length - 1];
  out.push([tail[0], tail[1]]);
  return out.map((p) => [p[0], p[1], surfaceZ(p[0], p[1])]);
}

export function buildTrim(S) {
  const gold = new GeoBuf(), chrome = new GeoBuf();
  const pts = trimPath();
  tube(gold, pts, {
    r: (t, i) => { const a = 0.17 * (1 - 0.3 * smooth(0.3, 1, t)); return [a, 0.075]; },
    sides: S(10, 8), n: 3.2, up: (p) => surfN(p[0], p[1]), capA: 'dome', capB: 'dome', domeRings: 2, domeLen: 1.2, uTile: 2, vTile: 1,
  });
  // micro clips along the edge
  const A = arc(pts);
  const n = Math.floor(A.total / 2.3);
  for (let k = 1; k < n; k++) {
    const { p, T, i } = A.at((k * A.total) / n);
    const up = surfN(p[0], p[1]);
    lathe(chrome, madd(p, up, 0.065), up, prof.cyl(0.13, 0.06, 0.02), { sides: S(14, 8), ref: T, vTile: 1 });
    lathe(chrome, madd(p, up, -0.065), mul(up, -1), prof.cyl(0.13, 0.06, 0.02), { sides: S(14, 8), ref: T, vTile: 1 });
    void i;
  }
  return { gold, chrome, pts };
}
