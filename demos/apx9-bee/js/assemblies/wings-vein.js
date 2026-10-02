// wings-vein.js - the nano-vein frame: polished gold ribbons along every Voronoi cell edge (thicker longitudinals, thinner
// cross-veins, a feeder fan converging on the root hub), dark solder nodes with hex bolts at the junctions and a few
// chrome sensor ferrules. Three GeoBufs come back: gold / black / chrome (one mesh each).
import { GeoBuf, tube, bar, bead, hexBolt, domeScrew, norm, cross, sub, mul, add, lerp3 } from './wings-geo.js';
import { surfaceZ, edgeSamples, yLE, smooth, clamp, mk, vnoise, lerp } from './wings-shape.js';

/** Root hub: where the feeder fan converges (the gold flex-joint collar sits here). Wing frame, mm. */
export const HUB = [2.95, -0.3, 0];

/** Unit surface normal of the cambered sheet at (x, y). */
export function surfN(x, y) {
  const e = 0.06;
  const dx = (surfaceZ(x + e, y) - surfaceZ(x - e, y)) / (2 * e);
  const dy = (surfaceZ(x, y + e) - surfaceZ(x, y - e)) / (2 * e);
  return norm([-dx, -dy, 1]);
}

/** Half-width (a) and half-thickness (b) of the ribbon at planform position (x, y). */
function ribbon(kind, x, y, k) {
  const tx = clamp((x - 3) / 20.5);
  const d = Math.max(0, yLE(Math.min(x, 22.5)) - y);
  const lead = 1 + 0.85 * (1 - smooth(0, 2.2, d));            // veins beside the spar are the heavy ones
  const base = kind === 'long' ? 0.098 : kind === 'feeder' ? 0.125 : 0.074;
  const wob = 0.9 + 0.2 * vnoise(x * 0.8 + k, y * 0.8, 5);
  const a = Math.max(0.064, base * (1 - 0.34 * tx) * lead * wob);
  const b = Math.min(0.108, 0.062 + 0.22 * a);
  return [a, b];
}

/** Cubic Bezier through hub -> target (planform), returned as [x, y, z] samples on the surface. */
function feederPath(h, t, bow, n = 14) {
  const c1 = [h[0] + (t[0] - h[0]) * 0.45, h[1] + (t[1] - h[1]) * 0.08 + bow * 0.5];
  const c2 = [h[0] + (t[0] - h[0]) * 0.8, h[1] + (t[1] - h[1]) * 0.7 + bow];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n, u = 1 - s;
    const x = u * u * u * h[0] + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * t[0];
    const y = u * u * u * h[1] + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * t[1];
    pts.push([x, y, surfaceZ(x, y)]);
  }
  return pts;
}

/** Choose well spread root-side junctions for the feeder fan. */
function feederTargets(net, want = 6) {
  const cand = net.verts
    .map((v, i) => ({ i, x: v.x, y: v.y, deg: v.deg, rim: v.rim }))
    .filter((v) => v.x > 3.2 && v.x < 8.4 && (v.deg >= 3 || (v.rim && v.deg >= 1)));
  const ang = (v) => Math.atan2(v.y - HUB[1], v.x - HUB[0]);
  cand.sort((a, b) => ang(a) - ang(b));
  const out = [];
  let last = -9;
  for (const c of cand) {
    if (ang(c) - last < 0.17) continue;
    out.push(c); last = ang(c);
  }
  // keep the closest ones if there are too many
  out.sort((a, b) => Math.hypot(a.x - HUB[0], a.y - HUB[1]) - Math.hypot(b.x - HUB[0], b.y - HUB[1]));
  return out.slice(0, want).sort((a, b) => ang(a) - ang(b));
}

/**
 * Build the vein frame buffers.
 *  S  sides scaler (ctx.S)       net  buildNetwork() result
 * Returns { gold, black, chrome, count: { veins, nodes, ferrules } }
 */
export function buildVeinFrame(net, S) {
  const R = mk(31);
  const gold = new GeoBuf(), black = new GeoBuf(), chrome = new GeoBuf();
  const sides = S(8, 6);
  const V = net.verts;
  const stat = { veins: 0, nodes: 0, ferrules: 0, feeders: 0 };
  const maxA = new Float32Array(V.length);          // widest ribbon at each vertex (node bead size)

  const maxB = new Float32Array(V.length);
  const addRibbon = (pts, kind, o = {}) => {
    const fn = (t, i) => {
      const p = pts[i];
      const ab = ribbon(kind, p[0], p[1], o.k || 0);
      const s = o.taper ? lerp(o.taper[0], o.taper[1], t) : 1;
      return [ab[0] * s, ab[1] * s];
    };
    bar(gold, pts, { r: fn, up: (p) => surfN(p[0], p[1]), bevel: 0.38, capA: o.capA || 'flat', capB: o.capB || 'flat', uTile: 2 });
  };

  /* ---- ribbons along every network edge */
  let k = 0;
  for (const v of net.veins) {
    const A = V[v.a], B = V[v.b];
    const pts = edgeSamples(A, B, 0.85);
    addRibbon(pts, v.kind, { k: k++ });
    stat.veins++;
    const r0 = ribbon(v.kind, A.x, A.y, 0), r1 = ribbon(v.kind, B.x, B.y, 0);
    maxA[v.a] = Math.max(maxA[v.a], r0[0]); maxB[v.a] = Math.max(maxB[v.a], r0[1]);
    maxA[v.b] = Math.max(maxA[v.b], r1[0]); maxB[v.b] = Math.max(maxB[v.b], r1[1]);
  }

  /* ---- feeder fan (root hub -> first junctions) */
  const targets = feederTargets(net, 6);
  targets.forEach((t, j) => {
    const bow = (j - (targets.length - 1) / 2) * 0.1;
    const pts = feederPath(HUB, [t.x, t.y], bow);
    addRibbon(pts, 'feeder', { k: 100 + j, taper: [1.18, 1], capA: 'none' });
    maxA[t.i] = Math.max(maxA[t.i], ribbon('feeder', t.x, t.y, 0)[0]);
    stat.feeders++;
  });

  /* ---- dark solder nodes + bolts at the interior junctions */
  const nodes = new Map();                          // vertex index -> { a, c, rb, face }: bead size and depth of the lower bolt face
  net.verts.forEach((v, i) => {
    if (v.deg < 3 || v.rim) return;
    const a = clamp((maxA[i] || 0.08) * 1.5 + 0.045, 0.105, 0.27);
    const z = surfaceZ(v.x, v.y);
    const n = surfN(v.x, v.y);
    const c = Math.max(a * 0.62, (maxB[i] || 0.07) + 0.03);
    bead(black, [v.x, v.y, z], n, a, a * 0.96, c, { rings: 4, sides: S(8, 6) });
    const top = [v.x + n[0] * c * 0.9, v.y + n[1] * c * 0.9, z + n[2] * c * 0.9];
    const bot = [v.x - n[0] * c * 0.9, v.y - n[1] * c * 0.9, z - n[2] * c * 0.9];
    const rb = a * 0.6;
    hexBolt(chrome, top, n, rb, rb * 0.42, { ref: [1, 0, 0] });
    hexBolt(chrome, bot, mul(n, -1), rb, rb * 0.42, { ref: [1, 0, 0] });
    nodes.set(i, { a, c, rb, face: c * 0.9 + rb * 0.42 });
    stat.nodes++;
  });

  /* ---- chrome sensor ferrules clamped on a few long veins */
  const longs = net.veins.filter((v) => v.kind === 'long' && v.len > 2.1 && v.mx > 5 && v.mx < 21);
  longs.sort(() => R() - 0.5);
  for (const v of longs.slice(0, 9)) {
    const A = V[v.a], B = V[v.b];
    const t = R.range(0.38, 0.62);
    const px = lerp(A.x, B.x, t), py = lerp(A.y, B.y, t);
    const dx = B.x - A.x, dy = B.y - A.y, l = Math.hypot(dx, dy);
    const half = 0.3;
    const p0 = [px - (dx / l) * half, py - (dy / l) * half], p1 = [px + (dx / l) * half, py + (dy / l) * half];
    const pts = [p0, [px, py], p1].map((p) => [p[0], p[1], surfaceZ(p[0], p[1])]);
    const ab = ribbon(v.kind, px, py, 0);
    tube(chrome, pts, { r: [ab[0] * 1.35 + 0.05, ab[1] * 1.6 + 0.06], sides: S(10, 8), n: 2.5, up: surfN(px, py), capA: 'flat', capB: 'flat', uTile: 1, vTile: 1 });
    // end collars
    for (const p of [p0, p1]) {
      const pp = [p[0], p[1], surfaceZ(p[0], p[1])];
      const tn = norm([dx / l, dy / l, 0]);
      tube(gold, [add(pp, mul(tn, -0.04)), add(pp, mul(tn, 0.04))], { r: [ab[0] * 1.45 + 0.06, ab[1] * 1.8 + 0.07], sides: S(10, 8), n: 2.5, up: surfN(px, py), capA: 'flat', capB: 'flat', uTile: 1, vTile: 1 });
    }
    stat.ferrules++;
  }
  void cross; void sub; void lerp3; void domeScrew;
  return { gold, black, chrome, stat, nodes };
}
