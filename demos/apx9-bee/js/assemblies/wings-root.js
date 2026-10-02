// wings-root.js - the mechanical hardware around the membrane: the root flex-joint (chrome flange + barrel, gold bellows,
// chrome collar, link plate), the two hinge cross-pins, the yellow root bracket, three clamped micro-actuators and the
// wing-tip sensor. Every builder adds finished geometry to a registry part. Wing frame: x span, y toward the LE, z up.
import { GeoBuf, tube, lathe, prof, hexBolt, domeScrew, bead, torusRing, norm, cross, sub, add, mul, madd, len, dot } from './wings-geo.js';
import { surfN } from './wings-vein.js';
import { rBoom } from './wings-spar.js';
import { mk, clamp, smooth, surfaceZ } from './wings-shape.js';

const TAU = Math.PI * 2;
const AX = [1, 0, 0];
const ZZ = [0, 0, 1];

/** Pin positions (planform x, y) shared by the link plate, the bracket and the pins themselves. */
export const PIN_A = [1.75, 0.2];
export const PIN_B = [3.15, 0.25];
const PLATE_Z = 1.2;            // upper link plate centre
const BRACKET_Z = -1.25;        // lower bracket centre

/** Chamfer every interior corner of a (t, r) polyline (first / last point stay on the axis). */
export function chamfered(pts, ch = 0.04) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], a = pts[i - 1], b = pts[i + 1];
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const c = Math.min(ch, la * 0.45, lb * 0.45);
    if (c < 1e-4) { out.push(p); continue; }
    out.push([p[0] + ((a[0] - p[0]) / la) * c, p[1] + ((a[1] - p[1]) / la) * c]);
    out.push([p[0] + ((b[0] - p[0]) / lb) * c, p[1] + ((b[1] - p[1]) / lb) * c]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Solid band of revolution about the wing x axis: from x0 to x1, radius r, optional V grooves (relative positions). */
function band(buf, x0, x1, r, o = {}) {
  const { ch = 0.04, grooves = [], gw = 0.035, gd = 0.028, sides = 40, facet = false, cy = 0, cz = 0, creaseDeg } = o;
  const L = x1 - x0;
  const pts = [[0, 0], [0, r]];
  for (const g of grooves) pts.push([g - gw, r], [g, r - gd], [g + gw, r]);
  pts.push([L, r], [L, 0]);
  lathe(buf, [x0, cy, cz], AX, chamfered(pts, ch), { sides, facet, ref: ZZ, vTile: 1, creaseDeg });
}

/** Ring of hex bolts on a plane x = const, pointing +x (dir = 1) or -x. */
function boltCircle(buf, x, R, n, rb, hb, phase = 0, dir = 1) {
  for (let i = 0; i < n; i++) {
    const a = phase + (i / n) * TAU;
    const rad = [0, Math.cos(a), Math.sin(a)];
    hexBolt(buf, [x, rad[1] * R, rad[2] * R], [dir, 0, 0], rb, hb, { ref: rad });
  }
}

/**
 * The machined root face (x = 1.0, the plane the wing mount ends on): a raised lip round a pocket that holds a rubber seal,
 * a gold seat ring with a socket-bolt circle, a ball bearing and a gold hub. Everything stays at x >= 1.0.
 */
function rootFace(chrome, gold, black, sd) {
  const X = 1.0, F = 0.15;                                      // pocket floor depth below the lip plane
  const at = (x, y = 0, z = 0) => [X + x, y, z];
  const out = [-1, 0, 0];
  torusRing(black, at(F - 0.045), AX, 1.035, 0.045, { rings: 5, sides: sd(44), ref: ZZ });
  // gold seat ring and its bolt circle
  lathe(gold, at(F - 0.045), AX, prof.ring(0.68, 0.95, 0.045, 0.012), { sides: sd(40), ref: ZZ, vTile: 1 });
  for (let i = 0; i < 8; i++) {
    const a = 0.2 + (i / 8) * TAU;
    hexBolt(chrome, at(F - 0.045, Math.cos(a) * 0.815, Math.sin(a) * 0.815), out, 0.1, 0.065, { ref: [0, Math.cos(a), Math.sin(a)] });
  }
  // ball bearing: chrome races, gold cage, ten balls
  lathe(chrome, at(F - 0.1), AX, prof.ring(0.5, 0.63, 0.1, 0.02), { sides: sd(36), ref: ZZ, vTile: 1 });
  lathe(chrome, at(F - 0.1), AX, prof.ring(0.26, 0.38, 0.1, 0.02), { sides: sd(32), ref: ZZ, vTile: 1 });
  lathe(gold, at(F - 0.03), AX, prof.ring(0.4, 0.48, 0.03, 0.008), { sides: sd(28), ref: ZZ, vTile: 1 });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    bead(chrome, at(F - 0.058, Math.cos(a) * 0.44, Math.sin(a) * 0.44), AX, 0.056, 0.056, 0.056, { rings: 4, sides: sd(10, 8), ref: ZZ });
  }
  // hub cap with a socket bolt
  lathe(gold, at(F - 0.085), AX, prof.cyl(0.24, 0.085, 0.02), { sides: sd(28), ref: ZZ, vTile: 1 });
  hexBolt(chrome, at(F - 0.085), out, 0.12, 0.05, { ref: ZZ });
  lathe(black, at(F - 0.1), AX, prof.ring(0.15, 0.19, 0.016, 0.004), { sides: sd(24), ref: ZZ, vTile: 1 });
}

/* ------------------------------------------------------------------------------------------------- flex joint */
export function buildFlexJoint(ctx, part) {
  const { M, S, plate, circleHole } = ctx;
  const chrome = new GeoBuf(), gold = new GeoBuf(), black = new GeoBuf();
  const sd = (n, m = 16) => S(n, m);

  /* flange (lip + pocket on the root face) + boss with a bolt circle */
  const R0 = 1.58;
  lathe(chrome, [1.0, 0, 0], AX, chamfered([[0.15, 0], [0.15, 1.1], [0.045, 1.2], [0.045, 1.27], [0.057, 1.285], [0.045, 1.3], [0.045, 1.5], [0.057, 1.515], [0.045, 1.53], [0.045, R0], [0.09, R0], [0.115, R0 - 0.02], [0.14, R0], [0.2, R0], [0.2, 0]], 0.03), { sides: sd(56), ref: ZZ, vTile: 1 });
  boltCircle(chrome, 1.045, 1.4, 12, 0.095, 0.045, 0.1, -1);
  rootFace(chrome, gold, black, sd);
  band(chrome, 1.2, 1.34, 1.3, { ch: 0.035, sides: sd(56) });
  boltCircle(chrome, 1.2, 1.445, 10, 0.12, 0.075, 0.15);
  /* gold gasket and rubber O-ring */
  band(gold, 1.34, 1.46, 1.18, { ch: 0.03, sides: sd(48) });
  torusRing(black, [1.4, 0, 0], AX, 1.19, 0.055, { rings: 6, sides: sd(48), ref: ZZ });

  /* chrome barrel in two halves with a rubber seal between */
  band(chrome, 1.46, 1.74, 1.08, { ch: 0.04, sides: sd(56), grooves: [0.1, 0.18], gw: 0.025, gd: 0.02 });
  band(black, 1.74, 1.82, 0.98, { ch: 0.02, sides: sd(48) });
  band(chrome, 1.82, 2.1, 1.08, { ch: 0.04, sides: sd(56), grooves: [0.1, 0.18], gw: 0.025, gd: 0.02 });

  /* gold bellows: rounded crests, tight valleys */
  {
    const L = 0.74, conv = 4, N = 22 * conv, r0 = 0.88, amp = 0.21;
    const pts = [[0, 0], [0, r0]];
    for (let k = 0; k <= N; k++) {
      const ph = ((k / N) * conv) % 1 || (k === N ? 1 : 0);
      const w = 0.5 - 0.5 * Math.cos(TAU * ph);
      pts.push([(k / N) * L, r0 + amp * Math.pow(w, 0.72)]);
    }
    pts.push([L, r0], [L, 0]);
    lathe(gold, [2.1, 0, 0], AX, pts, { sides: sd(48), ref: ZZ, vTile: 1, creaseDeg: 75 });
  }

  /* chrome collar with a knurled grip band */
  band(chrome, 2.84, 3.06, 1.04, { ch: 0.04, sides: sd(56), grooves: [0.05, 0.17], gw: 0.025, gd: 0.02 });
  band(chrome, 2.9, 3.0, 1.075, { ch: 0.015, sides: sd(64, 36), facet: true });
  band(gold, 2.8, 2.86, 1.0, { ch: 0.02, sides: sd(48) });

  /* upper link plate: floating on the pins, slotted so the bellows shows through */
  const outline = [[1.4, -0.72, 0.45], [2.8, -0.66, 0.28], [3.62, -0.18, 0.2], [3.66, 0.52, 0.2], [2.9, 1.0, 0.28], [1.4, 1.08, 0.5]];
  const holes = [
    circleHole(0.16, PIN_A[0], PIN_A[1]),
    circleHole(0.16, PIN_B[0], PIN_B[1]),
    [[2.12, 0.27, 0.1], [2.82, 0.27, 0.1], [2.82, 0.49, 0.1], [2.12, 0.49, 0.1]],
    circleHole(0.2, 2.35, -0.22),
  ];
  part.add(plate(outline, 0.16, { holes, bevel: 0.032, center: true, steps: 3 }), M.chrome, [0, 0, PLATE_Z]);
  const top = PLATE_Z + 0.08;
  for (const [x, y] of [[1.62, -0.48], [1.62, 0.9], [2.62, -0.42], [2.58, 0.95], [3.4, -0.08], [3.42, 0.44]]) domeScrew(gold, [x, y, top], ZZ, 0.15, 0.085, { ref: [1, 0, 0], sides: sd(12) });
  // bolt heads around the pin holes
  for (const [x, y] of [PIN_A, PIN_B]) torusRing(black, [x, y, top + 0.012], ZZ, 0.2, 0.022, { rings: 4, sides: sd(20), ref: AX });

  part.add(chrome.geometry(), M.chrome);
  part.add(gold.geometry(), M.gold);
  part.add(black.geometry(), M.black);
}

/* ------------------------------------------------------------------------------------------------- hinge pins */
export function buildHingePins(ctx, part) {
  const { M, S } = ctx;
  const chrome = new GeoBuf(), gold = new GeoBuf();
  const sd = (n, m = 10) => S(n, m);
  const top = PLATE_Z + 0.08;
  const bot = BRACKET_Z - 0.11;
  for (const [x, y] of [PIN_A, PIN_B]) {
    const o = [x, y, 0];
    // shaft
    lathe(chrome, [x, y, bot - 0.36], ZZ, chamfered([[0, 0], [0, 0.1], [0.04, 0.15], [top + 0.3 - bot + 0.32, 0.15], [top + 0.3 - bot + 0.36, 0.1], [top + 0.3 - bot + 0.36, 0]], 0.02), { sides: sd(14), ref: AX, vTile: 1 });
    // head (knurled thumb cap)
    lathe(chrome, [x, y, top + 0.05], ZZ, chamfered([[0, 0], [0, 0.3], [0.16, 0.3], [0.2, 0.25], [0.2, 0]], 0.03), { sides: sd(20, 16), facet: true, ref: AX, vTile: 1 });
    lathe(gold, [x, y, top], ZZ, prof.cyl(0.38, 0.05, 0.015), { sides: sd(24, 14), ref: AX, vTile: 1 });
    // spacer sleeves between plate / bracket and the stack
    lathe(gold, [x, y, PLATE_Z - 0.08 - 0.16], ZZ, prof.ring(0.14, 0.26, 0.16, 0.02), { sides: sd(16), ref: AX, vTile: 1 });
    lathe(gold, [x, y, BRACKET_Z + 0.11], ZZ, prof.ring(0.14, 0.26, 0.16, 0.02), { sides: sd(16), ref: AX, vTile: 1 });
    // washer + castle nut + cotter pin under the bracket
    lathe(gold, [x, y, bot - 0.04], ZZ, prof.cyl(0.36, 0.04, 0.012), { sides: sd(24, 14), ref: AX, vTile: 1 });
    hexBolt(chrome, [x, y, bot - 0.04], [0, 0, -1], 0.3, 0.2, { ref: AX });
    tube(gold, [[x - 0.4, y, bot - 0.3], [x - 0.12, y, bot - 0.3], [x + 0.12, y, bot - 0.3], [x + 0.4, y, bot - 0.3]], { r: 0.026, sides: 6, up: ZZ, capA: 'dome', capB: 'dome', uTile: 1, vTile: 1 });
    torusRing(gold, [x + 0.4, y, bot - 0.3], [0, 1, 0], 0.07, 0.022, { rings: 4, sides: 10, ref: AX });
    void o;
  }
  part.add(chrome.geometry(), M.chrome);
  part.add(gold.geometry(), M.gold);
}

/* ------------------------------------------------------------------------------------------------- root bracket */
export function buildRootFairing(ctx, part) {
  const { M, S, plate, circleHole, THREE } = ctx;
  const chrome = new GeoBuf();
  const sd = (n, m = 10) => S(n, m);
  const outline = [[1.28, -0.98, 0.42], [3.2, -0.92, 0.3], [4.95, -0.52, 0.26], [5.1, 0.42, 0.26], [3.5, 1.2, 0.32], [1.28, 1.22, 0.5]];
  const holes = [
    circleHole(0.16, PIN_A[0], PIN_A[1]),
    circleHole(0.16, PIN_B[0], PIN_B[1]),
    circleHole(0.42, 2.38, 0.1),
    circleHole(0.26, 4.0, 0.0),
    [[4.25, 0.08, 0.1], [4.85, 0.08, 0.1], [4.85, 0.3, 0.1], [4.25, 0.3, 0.1]],
  ];
  part.add(plate(outline, 0.22, { holes, bevel: 0.05, center: true, steps: 3 }), M.yellow, [0, 0, BRACKET_Z]);
  // bent-up flange along the leading edge (an L bracket) with a lightening cut-out
  const lip = [[1.42, -0.0, 0.2], [3.42, 0.0, 0.2], [3.0, 0.8, 0.3], [1.9, 0.8, 0.3]];
  const lipHoles = [circleHole(0.2, 2.4, 0.38)];
  const lg = plate(lip, 0.2, { holes: lipHoles, bevel: 0.04, center: true, steps: 3 });
  // plate local (x, y, z) -> wing (x, 1.12, -1.36 + y): rotate +90 deg about x
  part.add(lg, M.yellow, { p: [0, 1.12, BRACKET_Z - 0.11], r: [90, 0, 0] });
  // gusset triangle under the flange
  const gus = plate([[0, 0, 0.05], [0.9, 0, 0.05], [0, 0.5, 0.05]], 0.14, { bevel: 0.03, center: true, steps: 2 });
  part.add(gus, M.yellow, { p: [2.9, 0.98, BRACKET_Z + 0.11], r: [90, 0, 0] });
  void THREE;
  // fasteners on the underside + rivets on the flange
  const under = BRACKET_Z - 0.11;
  for (const [x, y] of [[1.55, -0.62], [1.55, 0.98], [2.8, -0.6], [4.5, -0.28], [4.55, 0.55], [3.3, 0.98]]) hexBolt(chrome, [x, y, under], [0, 0, -1], 0.15, 0.09, { ref: AX });
  for (const x of [1.95, 2.85]) domeScrew(chrome, [x, 1.22, BRACKET_Z - 0.38], [0, 1, 0], 0.12, 0.08, { ref: AX, sides: sd(10) });
  part.add(chrome.geometry(), M.chrome);
}

/* ------------------------------------------------------------------------------------------------- micro-actuators */
/** Boom stations (mm along the span) that clear the ferrules and cinch bands; every unit braces one vein node of the frame. */
export const ACT_X = [7.85, 10.35, 15.6];
const ACT_WANT = [[1.9, 0.2], [2.0, 0.7], [1.85, 0.8]];     // per unit: [gap boom surface -> node, node offset along the span]
const BAR_X1 = 13.9;                                         // the gold root bar of the spar bundle ends here

/** Interior vein junction a strut lands on: clear of the gold root bar, nearest to the wanted gap and span offset. */
function pickNode(net, sp, x, want, taken) {
  const A = sp.A;
  let best = null;
  net.verts.forEach((v, i) => {
    if (v.deg < 3 || v.rim || taken.has(i)) return;
    const along = v.x - x;
    if (Math.abs(along) > 2.2) return;
    const q = A.atX(v.x).p;
    const d = Math.hypot(v.x - q[0], v.y - q[1]);
    const gap = d - rBoom(v.x);
    const bar = v.x < BAR_X1 ? 1.45 * smooth(2.8, 6.4, v.x) + 0.62 : 0;
    if (gap < 0.8 || gap > 3.1 || d < bar) return;
    const cost = Math.abs(gap - want[0]) + 0.8 * Math.abs(along - want[1]);
    if (!best || cost < best.cost) best = { i, v, cost, gap, along };
  });
  return best;
}

/**
 * Piezo strut actuator: a gold clamp band on the boom carries a clevis (cross pin between two ears); a dark ringed housing
 * pivots in it, a chrome rod with a return spring and a stop collar leaves through a chrome gland nut and ends in a gold
 * eyelet that is clamped on a stud under the lower bolt of a vein node. net = buildNetwork() result, nodes = veins.nodes.
 */
export function buildMicroActuator(ctx, part, x, sp, variant = 0, net, nodes, taken = new Set()) {
  const { M, S } = ctx;
  const gun = new GeoBuf(), gold = new GeoBuf(), chrome = new GeoBuf();
  const sd = (n, m = 10) => S(n, m);
  const { p, T } = sp.A.atX(x);
  const up = surfN(p[0], p[1]);
  const inn = mul(norm(cross(up, T)), -1);
  const dn = mul(up, -1);
  const r = rBoom(x);

  /* ---- boom clamp band + boss on its lower inboard flank */
  lathe(gold, madd(p, T, -0.3), T, prof.ring(r - 0.01, r + 0.16, 0.6, 0.05), { sides: sd(28, 14), ref: up, vTile: 1 });
  for (const t of [-0.36, 0.3]) lathe(gold, madd(p, T, t), T, prof.ring(r - 0.01, r + 0.11, 0.06, 0.02), { sides: sd(28, 14), ref: up, vTile: 1 });
  const lug = norm(madd(mul(inn, 0.6), dn, 0.8));
  bead(gold, madd(p, lug, r + 0.1), lug, 0.27, 0.3, 0.21, { rings: 5, sides: sd(14, 8), ref: T });
  const P0 = madd(p, lug, r + 0.27);                       // pivot

  /* ---- landing node, stud + eyelet under its lower bolt */
  let pick = net ? pickNode(net, sp, x, ACT_WANT[variant % ACT_WANT.length], taken) : null;
  if (!pick) pick = { i: -1, v: { x: p[0] + 0.6, y: p[1] - r - 1.8 } };
  taken.add(pick.i);
  const nv = pick.v;
  const NP = [nv.x, nv.y, surfaceZ(nv.x, nv.y)];
  const nn = surfN(nv.x, nv.y);
  const ni = (nodes && nodes.get(pick.i)) || { rb: 0.14, face: 0.2 };
  const Ce = madd(NP, nn, -(ni.face + 0.2));               // eyelet centre
  const rIn = 0.075, rOut = 0.2, hEye = 0.07;
  const w = sub(P0, Ce);
  const u = norm(sub(w, mul(nn, dot(w, nn))));             // eyelet-plane direction toward the boom
  const Q = madd(Ce, u, rOut - 0.02);                      // rod meets the eyelet rim here (in its plane)
  const dv = sub(Q, P0);
  const Ltot = len(dv);
  const D = mul(dv, 1 / Ltot);
  const pA = norm(cross(D, lug));                          // pivot pin axis

  lathe(chrome, madd(NP, nn, -(ni.face - 0.01)), mul(nn, -1), [[0, 0], [0, 0.055], [0.42, 0.055], [0.42, 0]], { sides: sd(10, 8), ref: u, vTile: 1 });
  lathe(gold, madd(Ce, nn, -hEye / 2), nn, prof.ring(rIn, rOut, hEye, 0.02), { sides: sd(26, 14), ref: u, vTile: 1 });
  hexBolt(chrome, madd(Ce, nn, -hEye / 2), mul(nn, -1), 0.115, 0.075, { ref: u });

  /* ---- clevis: two gold ears, dark rear eye of the housing, chrome cross pin */
  for (const s of [-1, 1]) lathe(gold, madd(P0, pA, s > 0 ? 0.15 : -0.21), pA, prof.cyl(0.2, 0.06, 0.02), { sides: sd(20, 12), ref: D, vTile: 1 });
  lathe(gun, madd(P0, pA, -0.15), pA, prof.cyl(0.15, 0.3, 0.025), { sides: sd(20, 12), ref: D, vTile: 1 });
  lathe(chrome, madd(P0, pA, -0.3), pA, [[0, 0], [0, 0.05], [0.6, 0.05], [0.6, 0]], { sides: sd(10, 8), ref: D, vTile: 1 });
  domeScrew(chrome, madd(P0, pA, -0.3), mul(pA, -1), 0.1, 0.06, { ref: D, sides: sd(12, 8) });
  hexBolt(chrome, madd(P0, pA, 0.21), pA, 0.095, 0.07, { ref: D });

  /* ---- housing, gland nut, rod, return spring, stop collar */
  const Lh = clamp(0.4 * Ltot, 0.7, 1.0), h0 = 0.1, hr = 0.235;
  const pts = [[0, 0], [0, 0.16], [0.07, hr]];
  for (const f of [0.3, 0.5, 0.7]) { const g = f * Lh; pts.push([g - 0.045, hr], [g, hr - 0.035], [g + 0.045, hr]); }
  pts.push([Lh - 0.07, hr], [Lh, 0.16], [Lh, 0]);
  lathe(gun, madd(P0, D, h0), D, chamfered(pts, 0.018), { sides: sd(28, 14), ref: pA, vTile: 1, creaseDeg: 50 });
  for (const t of [0.1, Lh - 0.1]) torusRing(gold, madd(P0, D, h0 + t), D, hr + 0.004, 0.03, { rings: 5, sides: sd(28, 14), ref: pA });
  hexBolt(chrome, madd(P0, D, h0 + Lh - 0.01), D, 0.18, 0.1, { ref: pA });
  const t0 = h0 + Lh + 0.09, t1 = Ltot - 0.12, Lr = t1 - t0;
  lathe(chrome, madd(P0, D, t0), D, [[0, 0], [0, 0.055], [Lr, 0.055], [Lr, 0]], { sides: sd(12, 8), ref: pA, vTile: 1 });
  const Ls = Math.min(0.5 * Lr, 0.62), ts = t0 + 0.05;
  const turns = Math.max(3, Math.round(Ls / 0.095)), per = 9, e2 = cross(D, pA);
  const helix = [];
  for (let k = 0; k <= turns * per; k++) {
    const s = k / (turns * per), ph = s * turns * TAU;
    helix.push(madd(madd(madd(P0, D, ts + s * Ls), pA, Math.cos(ph) * 0.115), e2, Math.sin(ph) * 0.115));
  }
  tube(gold, helix, { r: 0.024, sides: sd(6, 5), up: D, capA: 'flat', capB: 'flat', uTile: 1, vTile: 1 });
  lathe(gold, madd(P0, D, ts + Ls), D, prof.ring(0.055, 0.1, 0.09, 0.02), { sides: sd(16, 10), ref: pA, vTile: 1 });
  lathe(gold, madd(P0, D, t0 + Lr * 0.82), D, prof.ring(0.055, 0.085, 0.07, 0.015), { sides: sd(14, 10), ref: pA, vTile: 1 });
  // flat tang joining the rod end to the eyelet rim
  bead(gold, madd(Q, D, -0.14), D, 0.065, 0.13, 0.22, { rings: 4, sides: sd(10, 8), ref: nn });

  part.add(gun.geometry(), M.gunmetalDark);
  part.add(gold.geometry(), M.gold);
  part.add(chrome.geometry(), M.chrome);
  void dot; void add; void smooth;
}

/* ------------------------------------------------------------------------------------------------- tip sensor */
export function buildTipSensor(ctx, part, sp) {
  const { M, S } = ctx;
  const gold = new GeoBuf(), amber = new GeoBuf();
  const path = sp.path, n = path.length;
  const end = path[n - 1];
  const T = norm(sub(path[n - 1], path[n - 5]));
  const up = surfN(end[0], end[1]);
  const o = madd(end, T, -1.5);
  const prf = chamfered([[0, 0], [0, 0.4], [0.46, 0.42], [0.5, 0.36], [0.92, 0.34], [1.02, 0.46], [1.52, 0.48], [1.8, 0.42], [1.9, 0.3], [1.9, 0]], 0.04);
  lathe(gold, o, T, prf, { sides: S(32, 16), ref: up, vTile: 1 });
  torusRing(gold, madd(o, T, 1.9), T, 0.26, 0.035, { rings: 5, sides: S(28, 14), ref: up });
  torusRing(gold, madd(o, T, 0.2), T, 0.405, 0.03, { rings: 4, sides: S(28, 14), ref: up });
  // amber beacon dome in the nose
  const prof2 = [[1.84, 0], [1.84, 0.22]];
  for (let k = 1; k <= 8; k++) { const a = (k / 8) * (Math.PI / 2); prof2.push([1.84 + Math.sin(a) * 0.2, Math.cos(a) * 0.22]); }
  lathe(amber, o, T, prof2, { sides: S(20, 12), ref: up, vTile: 1, creaseDeg: 90 });
  part.add(gold.geometry(), M.gold);
  part.add(amber.geometry(), M.glowAmber);
}
