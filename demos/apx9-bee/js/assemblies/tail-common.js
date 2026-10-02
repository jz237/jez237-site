// Tail assembly (stabilizer + stinger): shared frames, cowl surface and profile-sweep helpers.
// Everything is in the abdomen-local frame (container matrix K.abdomen.frame): a point at distance a behind the
// petiole is (-a, R cos phi, R*asp*sin phi); phi = 0 is dorsal (+Y), phi = 90 deg is the bee's right (+Z).
import { THREE, V3, K, D2R, profile, crease, boxUV, revolve, plate, circlePts, mergeGeometries, cyl, shape, fillet, rectPts } from '../kit.js';

export const A0 = K.abdomen.split;               // 9.0: the abdomen shell ends here
export const R0 = K.abdomen.rSplit;              // 3.175
export const ASP0 = K.abdomen.aspect;            // 1.04
export const TIP = K.abdomen.tipLocal.clone();   // stinger tip, abdomen-local
export const P0 = V3(-A0, 0, 0);                 // centre of the a = 9 ring

/* ------------------------------------------------------------------ stinger axis + frames */
const _d = TIP.clone().sub(P0);
export const SLEN = _d.length();                 // 4.858 mm, ring centre -> tip
export const AXD = _d.clone().normalize();       // stinger axis (abdomen-local)
export const AXX = V3(AXD.y, -AXD.x, 0);         // frame +X (dorsal-ish)
export const AXZ = V3(0, 0, 1);
export const BETA = Math.atan2(-AXD.y, -AXD.x);  // droop below the abdomen axis (rad)

/** Frame whose +Y is the stinger axis, origin s mm along it from the a = 9 ring centre. */
export function stingerFrame(s = 0) {
  return new THREE.Matrix4().makeBasis(AXX, AXD, AXZ).setPosition(P0.clone().addScaledVector(AXD, s));
}

/** Point of the stinger frame: s along the axis, (x, z) across it. */
export const axisPoint = (s, x = 0, z = 0) => P0.clone().addScaledVector(AXD, s).addScaledVector(AXX, x).addScaledVector(AXZ, z);

/** Gimbal ring plane: s along the stinger axis from the a = 9 ring centre; ring centre line radius; actuator lug radius. */
export const GIM = { s: 1.0, rRing: 1.62, rLug: 1.9 };
/** Point in the gimbal plane: th = angle from the dorsal-ish frame +X towards +Z, radius r, ds along the axis. */
export const gimP = (th, r, ds = 0) => axisPoint(GIM.s + ds, r * Math.cos(th), r * Math.sin(th));

/** Matrix with local +Y = y, local +X as close to xHint as possible, origin p. */
export function basisM(p, y, xHint = V3(0, 0, 1)) {
  const Y = y.clone().normalize();
  let X = xHint.clone().addScaledVector(Y, -xHint.dot(Y));
  if (X.lengthSq() < 1e-8) X = V3(1, 0, 0).addScaledVector(Y, -Y.x);
  X.normalize();
  const Z = new THREE.Vector3().crossVectors(X, Y);
  return new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(p);
}

/* ------------------------------------------------------------------ small math */
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const rad = (deg) => deg * D2R;

/* ------------------------------------------------------------------ the cowl (skirt) surface */
// The louvred panels form a short bell that continues the abdomen taper: radius 3.175 at a = 9 narrowing to the
// aperture the stinger passes through.
export const SK_A1 = 11.15;
const SK_R = profile([[A0, R0], [9.3, 2.95], [10.0, 2.55], [10.6, 2.22], [SK_A1, 1.96]]);
export const skR = (a) => SK_R(a);
export const skAsp = (a) => lerp(ASP0, 1.0, smooth((a - A0) / (SK_A1 - A0)));

/** Cowl point at distance a, azimuth phi (rad), offset `off` mm along the outward normal. */
export function skP(a, phi, off = 0) {
  const r = skR(a);
  const asp = skAsp(a);
  const p = V3(-a, r * Math.cos(phi), r * asp * Math.sin(phi));
  if (off) p.addScaledVector(skN(a, phi), off);
  return p;
}
function skRaw(a, phi) { const r = skR(a); return V3(-a, r * Math.cos(phi), r * skAsp(a) * Math.sin(phi)); }
/** Outward unit normal of the cowl. */
export function skN(a, phi) {
  const h = 1e-3, e = 1e-4;
  const da = skRaw(a + h, phi).sub(skRaw(a - h, phi));
  const dp = skRaw(a, phi + e).sub(skRaw(a, phi - e));
  return new THREE.Vector3().crossVectors(da, dp).normalize();
}

// arclength table along the generator so plates can be laid out in millimetres
const TAB = [];
{
  let s = 0, prev = skR(A0);
  const step = 0.004;
  for (let a = A0; a <= SK_A1 + 0.6; a += step) {
    const r = skR(a);
    if (a > A0) s += Math.hypot(step, r - prev);
    prev = r;
    TAB.push([a, s]);
  }
}
export function aOfS(s) {
  if (s <= 0) return A0 + s;
  let lo = 0, hi = TAB.length - 1;
  if (s >= TAB[hi][1]) return TAB[hi][0] + (s - TAB[hi][1]);
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (TAB[m][1] <= s) lo = m; else hi = m; }
  const t = (s - TAB[lo][1]) / (TAB[hi][1] - TAB[lo][1] || 1);
  return lerp(TAB[lo][0], TAB[hi][0], t);
}
export function sOfA(a) {
  if (a <= A0) return a - A0;
  const k = Math.min(TAB.length - 1, Math.max(0, Math.round((a - A0) / 0.004)));
  return TAB[k][1];
}

/**
 * Plate surface for armorPanel / decalPatch / surfaceRail on the cowl.
 *   plate x = generator arclength aft from the a = 9 rim, plate y = circumferential arclength about phiDeg.
 *   (T x B is the outward normal, as armorPanel requires.)
 */
export function skSurface(phiDeg) {
  const p0 = phiDeg * D2R;
  return (x, y) => {
    const a = aOfS(x);
    const r = skR(a);
    const phi = p0 + y / r;
    return { p: skRaw(a, phi), n: skN(a, phi) };
  };
}
/** Point on the (elliptical) section at distance a: radius r, azimuth phi (rad), no cowl profile involved. */
export const rp = (a, phi, r) => V3(-a, r * Math.cos(phi), r * skAsp(a) * Math.sin(phi));
/** Lathe geometry modelled about +Y with y = a (distance behind the petiole) -> abdomen-local frame (elliptical section). */
export function toA(g, asp = ASP0) { g.scale(1, 1, asp); g.rotateZ(Math.PI / 2); return g; }
/** Matrix with local +Y running from p0 towards p1 (origin p0) and the segment length. */
export function segM(p0, p1, roll = 0) {
  const d = p1.clone().sub(p0);
  const len = d.length();
  return { m: placeM(p0, d.clone().divideScalar(len || 1), roll), len };
}
/* ------------------------------------------------------------------ actuator linkage (mount-ring ears <-> gimbal lugs) */
/** Clevis ear pin centres on the mount ring (phi = 0 / 90 / 180 / 270 deg) and the lug pin radius on the gimbal frame. */
export const EAR_A = 9.4, EAR_R = 2.42, LUG_R = 1.82;
export const earP = (phiDeg) => rp(EAR_A, phiDeg * D2R, EAR_R);
/** Vector of the abdomen-local frame expressed in the stinger (gimbal) frame. */
export const toGimbal = (v) => V3(v.dot(AXX), v.dot(AXD), v.dot(AXZ));
/**
 * Four pushrods in a pinwheel: the lug sits 45 deg past its ear, so every rod is skew to the ring axis. Each end is a
 * clevis whose cheeks contain the rod axis u: pin axis n = radial x u, in-plane direction h = u without its radial part.
 */
export const ACT = [0, 90, 180, 270].map((phiDeg) => {
  const phi = phiDeg * D2R, th = phi + Math.PI / 4;
  const E = earP(phiDeg), L = gimP(th, LUG_R, 0);
  const u = L.clone().sub(E), len = u.length();
  u.divideScalar(len);
  const radE = V3(0, Math.cos(phi), Math.sin(phi));
  const radL = AXX.clone().multiplyScalar(Math.cos(th)).addScaledVector(AXZ, Math.sin(th));
  const nE = new THREE.Vector3().crossVectors(radE, u).normalize();
  const nL = new THREE.Vector3().crossVectors(radL, u).normalize();
  const hE = u.clone().addScaledVector(radE, -u.dot(radE)).normalize();
  const hL = u.clone().addScaledVector(radL, -u.dot(radL)).normalize();
  return { phiDeg, phi, th, E, L, u, len, radE, radL, nE, nL, hE, hL };
});

/** Same surface rotated 180 deg in the plate plane (text on the right-hand panels reads upright). */
export const flipSurface = (surf) => (x, y) => surf(-x, -y);

/** Half width (mm) of an angular sector of half-angle `halfDeg` at plate position x. */
export const sectorHalf = (x, halfDeg) => skR(aOfS(x)) * halfDeg * D2R;

/* ------------------------------------------------------------------ profile sweeps */
const _v = new THREE.Vector3();

/**
 * Sweep a closed 2D profile [[side, up], ...] along `frames` [{p, n, t}] (n = up, t = travel direction,
 * side = n x t). Both ends are capped; winding is corrected automatically. Returns a creased geometry with UVs.
 */
export function sweepFrames(frames, prof, { caps = true, closed = false, creaseDeg = 34, uv = 0.3 } = {}) {
  const n = frames.length, m = prof.length;
  const pos = [];
  const side = new THREE.Vector3();
  for (const f of frames) {
    side.crossVectors(f.n, f.t).normalize();
    const ks = f.k ?? 1, kh = f.h ?? ks;       // optional per-frame scale of the profile (side / height)
    for (const [s0, u0] of prof) {
      const s = s0 * ks, u = u0 * kh;
      pos.push(f.p.x + side.x * s + f.n.x * u, f.p.y + side.y * s + f.n.y * u, f.p.z + side.z * s + f.n.z * u);
    }
  }
  const idx = [];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const i2 = (i + 1) % n;
    for (let j = 0; j < m; j++) {
      const j2 = (j + 1) % m;
      const a = i * m + j, b = i * m + j2, c = i2 * m + j2, d = i2 * m + j;
      idx.push(a, b, c, a, c, d);
    }
  }
  // (side, n, t) is right-handed, so a counter-clockwise profile (positive area) already faces outward
  let area = 0;
  for (let j = 0; j < m; j++) { const a = prof[j], b = prof[(j + 1) % m]; area += a[0] * b[1] - b[0] * a[1]; }
  if (area < 0) for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
  const P = (k) => V3(pos[3 * k], pos[3 * k + 1], pos[3 * k + 2]);
  if (caps && !closed) {
    for (const end of [0, 1]) {
      const base = (end ? n - 1 : 0) * m;
      const c = pos.length / 3;
      const cc = V3();
      for (let j = 0; j < m; j++) cc.add(P(base + j));
      cc.multiplyScalar(1 / m);
      pos.push(cc.x, cc.y, cc.z);
      const want = end ? frames[n - 1].t.clone() : frames[0].t.clone().negate();
      // fan triangle (c, v0, v1): choose the orientation whose normal agrees with `want`
      const tn = new THREE.Vector3().crossVectors(P(base).sub(cc), P(base + 1).sub(cc));
      const ccw = tn.dot(want) > 0;
      for (let j = 0; j < m; j++) {
        const j2 = (j + 1) % m;
        if (ccw) idx.push(c, base + j, base + j2); else idx.push(c, base + j2, base + j);
      }
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g = crease(g, creaseDeg);
  return boxUV(g, uv);
}

/** Rounded-rectangle profile (side = w, up = h), centred, as [[s,u]...]. */
export function rrect(w, h, r = 0.02, steps = 2) {
  return fillet(rectPts(w, h, r), { closed: true, steps });
}
/** Profile from a polygon given as [[s,u,r?]...] (rounded corners). */
export function poly(pts, steps = 2) { return fillet(pts, { closed: true, steps }); }

/**
 * Rail along a polyline in cowl plate coordinates. line [[x,y]...]; prof [[side,height]...] (height above the skin).
 * opts.k(x, y) -> scale of the profile at each point (so louvres taper with the cowl radius); opts.lift raises the rail.
 */
export function surfaceRail(surface, line, prof, opts = {}) {
  const { k, lift = 0, ...rest } = opts;
  const pts = line.map(([x, y]) => surface(x, y));
  const frames = pts.map((s, i) => {
    const a = pts[Math.max(0, i - 1)].p, b = pts[Math.min(pts.length - 1, i + 1)].p;
    const kk = k ? k(line[i][0], line[i][1]) : 1;
    return { p: lift ? s.p.clone().addScaledVector(s.n, lift) : s.p, n: s.n, t: b.clone().sub(a).normalize(), k: kk };
  });
  return sweepFrames(frames, prof, rest);
}

/** Frames along an arc: centre c, axis basis (u = start direction, w = plane normal), radius R, angles in rad. */
export function arcFrames(c, u, w, R, a0, a1, n) {
  const v = new THREE.Vector3().crossVectors(w, u);
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = lerp(a0, a1, i / n);
    const cs = Math.cos(a), sn = Math.sin(a);
    const radial = u.clone().multiplyScalar(cs).addScaledVector(v, sn);
    const t = u.clone().multiplyScalar(-sn).addScaledVector(v, cs);
    out.push({ p: c.clone().addScaledVector(radial, R), n: radial, t });
  }
  return out;
}

/** Frames along a Catmull-Rom path with a fixed up hint (ribbons, hoses with flat sections). */
export function pathFrames(points, n, up = V3(0, 1, 0), tension = 0.5) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', tension);
  const out = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const nn = up.clone().addScaledVector(t, -up.dot(t));
    if (nn.lengthSq() < 1e-8) nn.set(0, 0, 1).addScaledVector(t, -t.z);
    out.push({ p, n: nn.normalize(), t });
  }
  return out;
}

/* ------------------------------------------------------------------ fasteners */
/** Socket-head cap screw, head up (+Y), base at y = 0: round head with a hex socket (blind). */
export function hexBolt(r = 0.14, h = 0.1, seg = 14) {
  const base = cyl(r, h * 0.42, { bevel: 0.01, segments: seg, steps: 1, y0: 0 });
  const hexR = r * 0.5;
  const hex = [];
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6; hex.push([Math.cos(a) * hexR, Math.sin(a) * hexR]); }
  const ring = plate(shape(circlePts(r, seg), [hex]), h * 0.58, { bevel: Math.min(0.022, r * 0.2), bevelSegments: 2, steps: 2, uvScale: 0.5 });
  ring.rotateX(-Math.PI / 2);
  ring.translate(0, h * 0.42, 0);
  return mergeGeometries([base, ring].map((g) => (g.index ? g.toNonIndexed() : g)), false);
}

/** Merge a list of geometries (non-indexed copies) into one. */
export function mergeList(list) {
  return mergeGeometries(list.map((g) => (g.index ? g.toNonIndexed() : g)), false);
}

/** Apply a matrix to a clone of a geometry. */
export function xf(geo, m) { const g = geo.clone(); g.applyMatrix4(m); return g; }

/* ------------------------------------------------------------------ stinger-local modelling helpers */
// Stinger leaves are modelled about +Y (= the stinger axis) with y = distance s from the a = 9 ring centre,
// +X = up/dorsal-ish, +Z = bee right; their node carries stingerFrame(0).
export const lathe = (loop, o = {}) => revolve(loop, { segments: 48, steps: 2, ...o });

/** Closed hollow ring about +Y: inner / outer radius, y0..y1, outer edge fillet b. */
export function ringGeo(rIn, rOut, y0, y1, b = 0.012, o = {}) {
  return lathe([[rIn, y0], [rOut, y0, b], [rOut, y1, b], [rIn, y1], [rIn, y0]], o);
}

/** Sphere (about +Y) with an equatorial groove. */
export function ballGeo(r, cy = 0, { groove = 0.012, gw = 5, n = 26, seg = 48 } = {}) {
  const pts = [[0, cy - r]];
  for (let i = 1; i < n; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / n;
    let rr = Math.cos(a) * r;
    const d = Math.abs(a) / (gw * D2R);
    if (d < 1) rr -= groove * (1 - d);
    pts.push([rr, cy + Math.sin(a) * r]);
  }
  pts.push([0, cy + r]);
  return lathe(pts, { segments: seg, steps: 1, creaseDeg: 50 });
}

/** Matrix from position p with local +Y -> direction n (optional roll about the new Y and uniform scale). */
export function placeM(p, n, roll = 0, s = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), n.clone().normalize());
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), roll));
  return new THREE.Matrix4().compose(p, q, V3(s, s, s));
}

/** Matrix at angle `theta` (from +X towards +Z) and radius `radius`, distance s along the axis.
 *  local +Z = radial (outward), +Y = axis, +X = tangent-ish: plate shapes extrude outwards, shape-y runs along the axis. */
export function radialM(theta, radius, s, extra = null) {
  const c = Math.cos(theta), sn = Math.sin(theta);
  const m = new THREE.Matrix4().makeBasis(V3(sn, 0, -c), V3(0, 1, 0), V3(c, 0, sn)).setPosition(radius * c, s, radius * sn);
  return extra ? m.multiply(extra) : m;
}

/** Helical turbine / swirl blade ribbon wrapped on a surface of revolution r = rOf(s); `inward` stands the blade on the inside face.
 *  H is the blade height (a number, or a function of s). */
export function swirlBlade({ rOf, s0, s1, th0, sweep, H = 0.1, thick = 0.024, n = 10, taper = 0.55, inward = false }) {
  const frames = [];
  const sg = inward ? -1 : 1;
  const Hf = typeof H === 'function' ? H : () => H;
  for (let i = 0; i <= n; i++) {
    const u = i / n, s = lerp(s0, s1, u), th = th0 + sweep * u;
    const rr = rOf(s), c = Math.cos(th), sn = Math.sin(th);
    frames.push({ p: V3(rr * c, s, rr * sn), n: V3(sg * c, 0, sg * sn), t: V3(), h: lerp(1, taper, u) * Hf(s) });
  }
  for (let i = 0; i <= n; i++) frames[i].t.copy(frames[Math.min(n, i + 1)].p).sub(frames[Math.max(0, i - 1)].p).normalize();
  const w = thick / 2;
  return sweepFrames(frames, [[-w, -0.012], [w, -0.012], [w * 0.7, 1], [-w * 0.7, 1]], { creaseDeg: 50 });
}

export { revolve, plate, V3, THREE, K, D2R, crease, boxUV, profile };
export const _tmp = _v;
