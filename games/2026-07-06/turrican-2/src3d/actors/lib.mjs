// Shard Assault actor library: procedural geometry, textures, materials and a
// rigid-skinned rig builder. Every model is authored in MODEL space (1 unit =
// 1 game px, +x forward/right, +y up, +z toward camera, origin = bottom-centre)
// and bound rigidly to named bones; parts are merged per material into one
// SkinnedMesh each, so a whole articulated character costs one draw call per
// material while every bone stays independently animatable.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const V3 = THREE.Vector3;
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new V3(), _s = new V3();
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const approach = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
export const TAU = Math.PI * 2;

// ---- deterministic rng ------------------------------------------------------
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- colour helpers ----------------------------------------------------------
const _c = new THREE.Color();
export function lin(hex, mul = 1) { _c.set(hex); return [_c.r * mul, _c.g * mul, _c.b * mul]; }

// ---- geometry primitives (all return NON-indexed geometry, position+normal) --
export function prep(g) {
  const ud0 = g.userData || {};
  if (g.index) { g = g.toNonIndexed(); g.userData = ud0; }
  const ud = g.userData || (g.userData = {});
  if (ud.uvm && g.attributes.uv) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ud.uvm[0], uv.getY(i) * ud.uvm[1]); ud.uvModel = true; delete ud.uvm; }
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && !(k === 'uv' && ud.uvModel)) g.deleteAttribute(k);
  if (!g.attributes.normal) g.computeVertexNormals();
  g.morphAttributes = {};
  return g;
}
const uvm = (g, a, b) => { g.userData.uvm = [a, b]; return g; };
// transform: p position, r euler (XYZ), s scale (number or [x,y,z])
export function xf(g, p, r, s) {
  _e.set(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0);
  _q.setFromEuler(_e);
  if (s == null) _s.set(1, 1, 1); else if (typeof s === 'number') _s.set(s, s, s); else _s.set(s[0], s[1], s[2]);
  _v.set(p ? p[0] : 0, p ? p[1] : 0, p ? p[2] : 0);
  _m4.compose(_v, _q, _s);
  g.applyMatrix4(_m4);
  if (_m4.determinant() < 0) flipWinding(g);
  return g;
}
export function flipWinding(g) {
  if (g.index) {
    const ix = g.index.array;
    for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    g.index.needsUpdate = true; return g;
  }
  for (const key of Object.keys(g.attributes)) {
    const a = g.attributes[key], n = a.itemSize, arr = a.array;
    for (let i = 0; i < a.count; i += 3) for (let k = 0; k < n; k++) {
      const i1 = (i + 1) * n + k, i2 = (i + 2) * n + k, t = arr[i1]; arr[i1] = arr[i2]; arr[i2] = t;
    }
    a.needsUpdate = true;
  }
  return g;
}
export function mirrorZ(g) { return xf(g.clone(), null, null, [1, 1, -1]); }
export function mirrorX(g) { return xf(g.clone(), null, null, [-1, 1, 1]); }
// vertex warp: fn(v:Vector3) mutates; recomputes normals (smooth if indexed)
export function warp(g, fn, recompute = true) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { _v.fromBufferAttribute(p, i); fn(_v, i); p.setXYZ(i, _v.x, _v.y, _v.z); }
  p.needsUpdate = true;
  if (recompute === 'smooth') smoothNormals(g); else if (recompute) g.computeVertexNormals();
  return g;
}
// smooth normals for non-indexed geometry: average face normals of coincident positions
export function smoothNormals(g) {
  const p = g.attributes.position, n = p.count, acc = new Map(), keys = new Array(n);
  const a = new V3(), b = new V3(), c = new V3(), fn = new V3(), t = new V3();
  const key = (i) => Math.round(p.getX(i) * 200) + ',' + Math.round(p.getY(i) * 200) + ',' + Math.round(p.getZ(i) * 200);
  for (let i = 0; i < n; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    fn.subVectors(c, b).cross(t.subVectors(a, b));
    for (let k = 0; k < 3; k++) { const ky = keys[i + k] = key(i + k); const v = acc.get(ky); if (v) v.add(fn); else acc.set(ky, fn.clone()); }
  }
  const nm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const v = acc.get(keys[i]); t.copy(v).normalize(); nm[i * 3] = t.x; nm[i * 3 + 1] = t.y; nm[i * 3 + 2] = t.z; }
  g.setAttribute('normal', new THREE.BufferAttribute(nm, 3));
  return g;
}
export function flat(g) { g = g.index ? g.toNonIndexed() : g; g.computeVertexNormals(); return g; }

let DETAIL = 1;
export function setDetail(d) { DETAIL = d; }
const sg = (n, min = 3) => (n <= 8 && DETAIL < 1 ? n : Math.max(min, Math.round(n * DETAIL)));

export const G = {
  box(w, h, d, r = 0, seg = 1) {
    if (r <= 0) return prep(new THREE.BoxGeometry(w, h, d));
    return prep(new RoundedBoxGeometry(w, h, d, Math.max(1, Math.round(seg * DETAIL)), Math.min(r, Math.min(w, h, d) * 0.49)));
  },
  // extrude a side profile (array of [x,y]) along z, centred, outline-preserving bevel
  ext(pts, depth, bevel = 0.25, opts = {}) {
    const sh = new THREE.Shape();
    sh.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
    sh.closePath();
    if (opts.holes) for (const hp of opts.holes) {
      const h = new THREE.Path(); h.moveTo(hp[0][0], hp[0][1]); for (let i = 1; i < hp.length; i++) h.lineTo(hp[i][0], hp[i][1]); h.closePath(); sh.holes.push(h);
    }
    const b = Math.min(bevel, depth * 0.45);
    const g = new THREE.ExtrudeGeometry(sh, {
      depth: Math.max(0.01, depth - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b,
      bevelSegments: opts.bevelSeg != null ? opts.bevelSeg : (DETAIL < 1 ? 1 : 2), steps: opts.steps || 1, curveSegments: 4,
    });
    g.translate(0, 0, b - depth / 2);
    return prep(uvm(flat(g), 1, 1));
  },
  lathe(pts, seg = 12, phiStart = 0, phiLen = TAU) {
    let len = 0, mr = 0; for (let i = 0; i < pts.length; i++) { mr = Math.max(mr, pts[i][0]); if (i) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); }
    return prep(uvm(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), sg(seg), phiStart, phiLen), mr * phiLen, len));
  },
  cyl(rt, rb, h, seg = 10, open = false, hs = 1) { return prep(uvm(new THREE.CylinderGeometry(rt, rb, h, sg(seg), hs, open), TAU * Math.max(rt, rb), h)); },
  cone(r, h, seg = 8) { return prep(uvm(new THREE.ConeGeometry(r, h, sg(seg)), TAU * r, h)); },
  sph(r, ws = 12, hs = 8) { return prep(uvm(new THREE.SphereGeometry(r, sg(ws), sg(hs, 2)), TAU * r, Math.PI * r)); },
  ell(rx, ry, rz, ws = 12, hs = 8) { return xf(prep(uvm(new THREE.SphereGeometry(1, sg(ws), sg(hs, 2)), Math.PI * (rx + rz), Math.PI * ry)), null, null, [rx, ry, rz]); },
  ico(r, d = 0) { return prep(new THREE.IcosahedronGeometry(r, d)); },
  oct(r) { return prep(new THREE.OctahedronGeometry(r, 0)); },
  dodec(r) { return prep(new THREE.DodecahedronGeometry(r, 0)); },
  torus(R, r, rs = 6, ts = 16, arc = TAU) { return prep(uvm(new THREE.TorusGeometry(R, r, sg(rs), sg(ts), arc), R * arc, TAU * r)); },
  capsule(r, len, cs = 3, rs = 8) { return prep(uvm(new THREE.CapsuleGeometry(r, len, sg(cs, 2), sg(rs)), TAU * r, len + Math.PI * r)); },
  tube(points, r, ts = 12, rs = 5, closed = false) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new V3(p[0], p[1], p[2])), closed);
    return prep(uvm(new THREE.TubeGeometry(curve, sg(ts), r, sg(rs), closed), curve.getLength(), TAU * r));
  },
  // tapered tube: radius function along t
  taperTube(points, rFn, ts = 12, rs = 6) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new V3(p[0], p[1], p[2])));
    const g = new THREE.TubeGeometry(curve, sg(ts), 1, sg(rs), false);
    const pos = g.attributes.position, nT = sg(ts), nR = sg(rs);
    const frames = curve.computeFrenetFrames(nT, false);
    for (let i = 0; i <= nT; i++) {
      const c = curve.getPointAt(i / nT), r = rFn(i / nT);
      for (let j = 0; j <= nR; j++) {
        const k = i * (nR + 1) + j; _v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c); pos.setXYZ(k, _v.x, _v.y, _v.z);
      }
    }
    g.computeVertexNormals();
    return prep(uvm(g, curve.getLength(), TAU * rFn(0.3)));
  },
  // faceted crystal: n-sided prism with jittered rim and pointed tip, base at origin, grows +y
  crystal(r, h, sides = 6, tip = 0.35, seed = 1, jitter = 0.18) {
    const R = rng(seed), pts = [], ring0 = [], ring1 = [];
    const n = sides, bodyH = h * (1 - tip);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + R() * 0.3, rr = r * (1 + (R() - 0.5) * jitter * 2);
      ring0.push([Math.cos(a) * rr * 0.82, -h * 0.04, Math.sin(a) * rr * 0.82]);
      ring1.push([Math.cos(a) * rr, bodyH * (1 + (R() - 0.5) * jitter), Math.sin(a) * rr]);
    }
    const apex = [(R() - 0.5) * r * 0.3, h, (R() - 0.5) * r * 0.3];
    const tri = (a, b, c) => pts.push(...a, ...b, ...c);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      tri(ring0[i], ring1[j], ring1[i]); tri(ring0[i], ring0[j], ring1[j]);
      tri(ring1[i], ring1[j], apex);
      tri(ring0[j], ring0[i], [0, -h * 0.08, 0]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.computeVertexNormals();
    return g;
  },
  // double-ended shard (bipyramid prism) centred on origin along y
  shard(r, h, sides = 6, seed = 3, jitter = 0.15) {
    const R = rng(seed), pts = [], mid0 = [], mid1 = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * TAU + (R() - 0.5) * 0.25, rr = r * (1 + (R() - 0.5) * jitter * 2);
      mid0.push([Math.cos(a) * rr, -h * 0.18 * (1 + (R() - 0.5) * jitter), Math.sin(a) * rr]);
      mid1.push([Math.cos(a) * rr * 0.96, h * 0.16 * (1 + (R() - 0.5) * jitter), Math.sin(a) * rr * 0.96]);
    }
    const top = [(R() - 0.5) * r * 0.2, h * 0.5, (R() - 0.5) * r * 0.2], bot = [(R() - 0.5) * r * 0.2, -h * 0.5, (R() - 0.5) * r * 0.2];
    const tri = (a, b, c) => pts.push(...a, ...b, ...c);
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      tri(mid0[i], mid1[j], mid1[i]); tri(mid0[i], mid0[j], mid1[j]);
      tri(mid1[i], mid1[j], top); tri(mid0[j], mid0[i], bot);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.computeVertexNormals();
    return g;
  },
  // thick ellipsoidal shell patch. u = azimuth (0 = +x, toward +z), v = polar from +y.
  shell(rx, ry, rz, t, u0, u1, v0, v1, su = 10, sv = 6, rFn = null) {
    su = sg(su); sv = sg(sv, 2);
    const pos = [], uvs = [], idx = [];
    const ar = (rx + rz) / 2;
    const P = (u, v, inset) => {
      const k = rFn ? rFn(u, v) : 1;
      const x = Math.sin(v) * Math.cos(u), y = Math.cos(v), z = Math.sin(v) * Math.sin(u);
      return [x * (rx * k - inset), y * (ry * k - inset), z * (rz * k - inset)];
    };
    const grid = (inset, outer) => {
      const base = pos.length / 3;
      for (let j = 0; j <= sv; j++) for (let i = 0; i <= su; i++) {
        const u = u0 + (u1 - u0) * (i / su), v = v0 + (v1 - v0) * (j / sv); pos.push(...P(u, v, inset)); uvs.push(u * ar, v * ry);
      }
      for (let j = 0; j < sv; j++) for (let i = 0; i < su; i++) {
        const a = base + j * (su + 1) + i, b = a + 1, c = a + su + 1, d = c + 1;
        if (outer) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
      }
    };
    grid(0, true); grid(t, false);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(idx); g.computeVertexNormals();
    // rim: each strip oriented along the patch's outward tangent
    const rim = [], ruv = [], A = new V3(), Bv = new V3(), Cv = new V3(), n = new V3(), o = new V3(), e1 = new V3(), e2 = new V3();
    const edge = (list, outFn) => { let acc = 0; for (let k = 0; k < list.length - 1; k++) { const [ua, va] = list[k], [ub, vb] = list[k + 1];
      const pA = P(ua, va, 0), pB = P(ub, vb, 0), pC = P(ua, va, t), pD = P(ub, vb, t);
      A.fromArray(pA); Bv.fromArray(pB); Cv.fromArray(pC); e1.subVectors(Cv, A); e2.subVectors(Bv, A); n.crossVectors(e1, e2);
      outFn((ua + ub) / 2, (va + vb) / 2, o);
      const seg = Math.hypot(pB[0] - pA[0], pB[1] - pA[1], pB[2] - pA[2]);
      if (n.dot(o) >= 0) { rim.push(...pA, ...pC, ...pB, ...pB, ...pC, ...pD); ruv.push(acc, 0, acc, t, acc + seg, 0, acc + seg, 0, acc, t, acc + seg, t); }
      else { rim.push(...pA, ...pB, ...pC, ...pB, ...pD, ...pC); ruv.push(acc, 0, acc + seg, 0, acc, t, acc + seg, 0, acc + seg, t, acc, t); }
      acc += seg; } };
    const dU = (u, v, out, sgn) => { out.set(-Math.sin(u) * rx, 0, Math.cos(u) * rz).multiplyScalar(sgn); };
    const dV = (u, v, out, sgn) => { out.set(Math.cos(v) * Math.cos(u) * rx, -Math.sin(v) * ry, Math.cos(v) * Math.sin(u) * rz).multiplyScalar(sgn); };
    const L = [];
    if (v0 > 1e-3) { for (let i = 0; i <= su; i++) L.push([u0 + (u1 - u0) * i / su, v0]); edge(L, (u, v, out) => dV(u, v, out, -1)); L.length = 0; }
    if (v1 < Math.PI - 1e-3) { for (let i = 0; i <= su; i++) L.push([u0 + (u1 - u0) * i / su, v1]); edge(L, (u, v, out) => dV(u, v, out, 1)); L.length = 0; }
    if (u1 - u0 < TAU - 1e-3) {
      for (let j = 0; j <= sv; j++) L.push([u0, v0 + (v1 - v0) * j / sv]); edge(L, (u, v, out) => dU(u, v, out, -1)); L.length = 0;
      for (let j = 0; j <= sv; j++) L.push([u1, v0 + (v1 - v0) * j / sv]); edge(L, (u, v, out) => dU(u, v, out, 1)); L.length = 0;
    }
    const parts = [prep(uvm(g, 1, 1))];
    if (rim.length) { const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rim, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(ruv, 2)); rg.computeVertexNormals(); parts.push(prep(uvm(rg, 1, 1))); }
    const m = parts.length > 1 ? mergeGeometries(parts) : parts[0]; m.userData.uvModel = true; return m;
  },
  // ribbed bellows / segmented cylinder along y
  ribs(r, h, n, depth = 0.15, seg = 10) {
    const pts = [];
    for (let i = 0; i <= n * 2; i++) pts.push([r * (i % 2 ? 1 - depth : 1), (i / (n * 2)) * h - h / 2]);
    pts.unshift([0.001, -h / 2]); pts.push([0.001, h / 2]);
    return G.lathe(pts, seg);
  },
  // flat polygon membrane (double sided triangles) from [x,y] pts, at z=0
  membrane(pts) {
    const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
    const g = prep(uvm(new THREE.ShapeGeometry(sh), 1, 1));
    const back = flipWinding(g.clone()); const n = back.attributes.normal; for (let i = 0; i < n.count; i++) n.setZ(i, -n.getZ(i));
    const m = mergeGeometries([g, back]); m.userData.uvModel = true; return m;
  },
};
export function merge(list) { return mergeGeometries(list.map(prep)); }

// box-projected UVs (model space) so the shared wear texture lands at a uniform density
function boxUV(g, scale, ou, ov) {
  const p = g.attributes.position, n = p.count, uv = new Float32Array(n * 2);
  const a = new V3(), b = new V3(), c = new V3(), ab = new V3(), ac = new V3();
  for (let i = 0; i < n; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    ab.subVectors(b, a); ac.subVectors(c, a); ab.cross(ac);
    const ax = Math.abs(ab.x), ay = Math.abs(ab.y), az = Math.abs(ab.z);
    for (let k = 0; k < 3; k++) {
      const v = k === 0 ? a : k === 1 ? b : c; let u, w;
      if (ax >= ay && ax >= az) { u = v.z; w = v.y; } else if (ay >= az) { u = v.x; w = v.z; } else { u = v.x; w = v.y; }
      uv[(i + k) * 2] = u * scale + ou; uv[(i + k) * 2 + 1] = w * scale + ov;
    }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

// layered sandstone / sediment colouring by height (per-vertex colour function)
export function strata(a, b, period = 3.2, c = null) {
  const A = lin(a), Bc = lin(b), Cc = c ? lin(c) : null;
  return (x, y, z) => {
    const s = Math.sin(y * TAU / period + Math.sin(x * 0.21 + z * 0.17) * 1.6) * 0.5 + 0.5, n = Math.sin(y * 2.3 + x * 1.7) * 0.5 + 0.5;
    let k = s * s * (3 - 2 * s); const out = [A[0] + (Bc[0] - A[0]) * k, A[1] + (Bc[1] - A[1]) * k, A[2] + (Bc[2] - A[2]) * k];
    if (Cc && n > 0.82) { const t = (n - 0.82) / 0.18; for (let i = 0; i < 3; i++) out[i] += (Cc[i] - out[i]) * t * 0.7; }
    return out;
  };
}
// ---- rig builder -------------------------------------------------------------
export class Rig {
  constructor(uvScale = 1 / 22) {
    this.bones = []; this.names = {}; this.parts = {}; this.uvScale = uvScale; this.R = rng(7); this.post = null;
    this.bone('root', null, 0, 0, 0);
  }
  bone(name, parent, x, y, z) {
    this.names[name] = this.bones.length;
    this.bones.push({ name, parent: parent == null ? -1 : this.names[parent], pos: new V3(x, y, z) });
    return this;
  }
  // geo in model space; color = hex string (albedo) or [r,g,b] linear (glow, may exceed 1)
  add(bone, mat, geo, color = '#808080', jitter = 0.04) {
    if (Array.isArray(geo)) { for (const g of geo) this.add(bone, mat, g, color, jitter); return this; }
    const bi = this.names[bone]; if (bi == null) throw new Error('no bone ' + bone);
    const g = prep(geo);
    const n = g.attributes.position.count;
    const fnc = typeof color === 'function' ? color : null;
    let c = fnc ? [1, 1, 1] : typeof color === 'string' ? lin(color) : color;
    const j = 1 + (this.R() - 0.5) * jitter * 2;
    const col = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), P = g.attributes.position;
    for (let i = 0; i < n; i++) {
      if (fnc) c = fnc(P.getX(i), P.getY(i), P.getZ(i));
      col[i * 3] = c[0] * j; col[i * 3 + 1] = c[1] * j; col[i * 3 + 2] = c[2] * j; si[i * 4] = bi; sw[i * 4] = 1;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
    const us = this.uvScale * (mat === 'suit' ? 2.2 : mat === 'flesh' ? 1.3 : 1);
    if (g.userData.uvModel && g.attributes.uv) { const uv = g.attributes.uv, ou = this.R(), ov = this.R(); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * us + ou, uv.getY(i) * us + ov); }
    else boxUV(g, us, this.R(), this.R());
    (this.parts[mat] || (this.parts[mat] = [])).push(g);
    return this;
  }
  // uniformly rescale the finished model about a centre point (to fill a hitbox)
  scaleAll(s, cx = 0, cy = 0, cz = 0) { this.post = { s, c: new V3(cx, cy, cz) }; return this; }
  build() {
    const meshes = []; let tris = 0;
    if (this.post) {
      const { s, c } = this.post, m = new THREE.Matrix4().makeTranslation(c.x, c.y, c.z).multiply(new THREE.Matrix4().makeScale(s, s, s)).multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
      for (const k of Object.keys(this.parts)) for (const g of this.parts[k]) g.applyMatrix4(m);
      for (const b of this.bones) b.pos.sub(c).multiplyScalar(s).add(c);
    }
    for (const mat of Object.keys(this.parts)) {
      const geometry = mergeGeometries(this.parts[mat]);
      geometry.computeBoundingSphere();
      tris += geometry.attributes.position.count / 3;
      meshes.push({ mat, geometry });
    }
    return { bones: this.bones, meshes, tris };
  }
}

const IDENT = new THREE.Matrix4();
// instantiate a template: bones (fresh per instance) + SkinnedMeshes sharing geometry
export function instantiate(tpl, mats, opts = {}) {
  const group = new THREE.Group();
  const bones = tpl.bones.map(b => { const bone = new THREE.Bone(); bone.name = b.name; return bone; });
  tpl.bones.forEach((b, i) => {
    const bone = bones[i];
    if (b.parent < 0) { group.add(bone); bone.position.copy(b.pos); }
    else { bones[b.parent].add(bone); bone.position.copy(b.pos).sub(tpl.bones[b.parent].pos); }
    bone.userData.rest = bone.position.clone();
  });
  const inverses = tpl.bones.map(b => new THREE.Matrix4().makeTranslation(-b.pos.x, -b.pos.y, -b.pos.z));
  const skeleton = new THREE.Skeleton(bones, inverses);
  const B = {}; bones.forEach(b => { B[b.name] = b; });
  const materials = [], byMat = {}, meshes = [];
  for (const m of tpl.meshes) {
    const material = mats.instance(m.mat);
    const mesh = new THREE.SkinnedMesh(m.geometry, material);
    mesh.bind(skeleton, IDENT);
    mesh.frustumCulled = false;
    const glowy = material.isMeshBasicMaterial || material.transparent;
    mesh.castShadow = opts.shadow !== false && !glowy;
    mesh.receiveShadow = !glowy;
    mesh.name = m.mat;
    group.add(mesh); meshes.push(mesh);
    materials.push(material); byMat[m.mat] = material;
  }
  return { group, bones: B, boneList: bones, skeleton, meshes, materials, byMat, fx: new FX(materials) };
}
export function disposeInstance(inst) {
  inst.skeleton.dispose();
  for (const m of inst.materials) m.dispose();
}
export function resetBones(inst) {
  for (const b of inst.boneList) { b.position.copy(b.userData.rest); b.rotation.set(0, 0, 0); b.scale.set(1, 1, 1); }
}

// ---- per-instance hit-flash / frost / pulse ------------------------------------
const ICE_ALB = new THREE.Color(0.62, 0.8, 1.0), ICE_EMI = new THREE.Color(0.18, 0.36, 0.6), WHITE = new THREE.Color(1, 1, 1);
// THREE.Color has no addScaledVector; add a scaled colour in place.
function addScaled(col, c2, k) { col.r += c2.r * k; col.g += c2.g * k; col.b += c2.b * k; return col; }
export class FX {
  constructor(materials) {
    this.list = materials; this.flash = -1; this.frost = -1; this.dirty = true;
    for (const m of materials) {
      m.userData.baseColor = m.color.clone();
      m.userData.baseEmi = m.emissive ? m.emissive.clone().multiplyScalar(m.emissiveIntensity) : null;
      if (m.userData.pulse == null) m.userData.pulse = 1;
    }
  }
  pulse(mat, v) { if (mat && mat.userData.pulse !== v) { mat.userData.pulse = v; this.dirty = true; } }
  apply(flash, frost) {
    flash = clamp(flash, 0, 1); frost = clamp(frost, 0, 1);
    if (!this.dirty && Math.abs(flash - this.flash) < 1e-3 && Math.abs(frost - this.frost) < 1e-3) return;
    this.flash = flash; this.frost = frost; this.dirty = false;
    for (const m of this.list) {
      const u = m.userData;
      if (m.isMeshBasicMaterial) {
        m.color.copy(u.baseColor).multiplyScalar(u.pulse);
        if (frost > 0) m.color.lerp(_c.setRGB(0.7 * 2.2, 0.9 * 2.2, 1.0 * 2.2), frost * 0.5);
        if (flash > 0) addScaled(m.color, WHITE, flash * 2.5);
      } else {
        m.color.copy(u.baseColor);
        if (frost > 0) m.color.lerp(ICE_ALB, frost * 0.55);
        m.emissive.copy(u.baseEmi).multiplyScalar(u.pulse);
        if (frost > 0) addScaled(m.emissive, ICE_EMI, frost * 0.6);
        if (flash > 0) addScaled(m.emissive, WHITE, flash * 1.6);
        m.emissiveIntensity = 1;
      }
    }
  }
}

// ---- 2-bone IK (all vectors in the parent space of the upper bone) --------------
const DOWN = new V3(0, -1, 0), _d = new V3(), _ph = new V3(), _E = new V3(), _u = new V3(), _f = new V3(), _T = new V3(), _iq = new THREE.Quaternion();
export function ik2(upper, lower, target, pole, L1, L2) {
  const S = upper.position;
  _d.subVectors(target, S); let D = _d.length(); if (D < 1e-4) return;
  _d.divideScalar(D); D = clamp(D, Math.abs(L1 - L2) + 0.05, L1 + L2 - 0.02);
  const cosA = clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
  _ph.copy(pole).addScaledVector(_d, -pole.dot(_d)).normalize();
  _E.copy(S).addScaledVector(_d, L1 * cosA).addScaledVector(_ph, L1 * sinA);
  _u.subVectors(_E, S).normalize();
  _T.copy(S).addScaledVector(_d, D);
  _f.subVectors(_T, _E).normalize();
  upper.quaternion.setFromUnitVectors(DOWN, _u);
  _iq.copy(upper.quaternion).invert();
  _f.applyQuaternion(_iq);
  lower.quaternion.setFromUnitVectors(DOWN, _f);
}

// ---- procedural textures ---------------------------------------------------------
function hash2(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y, period, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const w = (v) => ((v % period) + period) % period;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(w(xi), w(yi), s), b = hash2(w(xi + 1), w(yi), s), c = hash2(w(xi), w(yi + 1), s), d = hash2(w(xi + 1), w(yi + 1), s);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function fbm(x, y, period, oct, s) { let a = 0, amp = 0.5, f = 1, tot = 0; for (let o = 0; o < oct; o++) { a += vnoise(x * f, y * f, period * f, s + o) * amp; tot += amp; amp *= 0.5; f *= 2; } return a / tot; }
function worley(x, y, period, s) { // returns [F1, F2]
  const xi = Math.floor(x), yi = Math.floor(y); let f1 = 9, f2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = xi + i, cy = yi + j, wx = ((cx % period) + period) % period, wy = ((cy % period) + period) % period;
    const px = cx + hash2(wx, wy, s), py = cy + hash2(wx, wy, s + 9);
    const d = Math.hypot(px - x, py - y); if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
  }
  return [f1, f2];
}
function dataTex(data, size, srgb, aniso) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = aniso; t.needsUpdate = true; return t;
}
export function makeTextures(size, aniso) {
  const N = size, alb = new Uint8Array(N * N * 4), rmh = new Uint8Array(N * N * 4);
  const R = rng(1234);
  const height = new Float32Array(N * N).fill(1), dark = new Float32Array(N * N).fill(0), chipM = new Float32Array(N * N).fill(0), scr = new Float32Array(N * N).fill(0);
  const S = N / 512;
  // panel grid: recursive subdivision (tiles because lines wrap)
  const lines = [];
  (function split(x, y, w, h, depth) {
    if ((w < 70 * S && h < 70 * S) || depth > 5 || (depth > 1 && R() < 0.18)) { lines.push([x, y, w, h]); return; }
    if (w > h * (0.7 + R() * 0.6)) { const c = Math.round(w * (0.3 + R() * 0.4)); split(x, y, c, h, depth + 1); split(x + c, y, w - c, h, depth + 1); }
    else { const c = Math.round(h * (0.3 + R() * 0.4)); split(x, y, w, c, depth + 1); split(x, y + c, w, h - c, depth + 1); }
  })(0, 0, N, N, 0);
  const idx = (x, y) => (((y % N) + N) % N) * N + (((x % N) + N) % N);
  const panelTone = new Float32Array(N * N);
  for (const [x, y, w, h] of lines) {
    const tone = (R() - 0.5) * 0.08;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) panelTone[idx(x + i, y + j)] = tone;
    const lw = Math.max(1, Math.round(1.6 * S));
    for (let i = 0; i < w; i++) for (let k = 0; k < lw; k++) { const a = idx(x + i, y + k); height[a] = 0.15; dark[a] = 0.4; }
    for (let j = 0; j < h; j++) for (let k = 0; k < lw; k++) { const a = idx(x + k, y + j); height[a] = 0.15; dark[a] = 0.4; }
    // bevel highlight just inside
    for (let i = lw; i < w; i++) { const a = idx(x + i, y + lw); height[a] = Math.min(height[a], 0.75); }
    // rivets along some edges
    if (R() < 0.55 && w > 30 * S) for (let i = 8 * S; i < w - 6 * S; i += 9 * S) for (const yy of [y + 5 * S, y + h - 5 * S]) {
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const d = Math.hypot(dx, dy); if (d < 2.2 * S) { const a = idx(Math.round(x + i + dx), Math.round(yy + dy)); height[a] = 1.0 + (1 - d / 2.2) * 0.25; dark[a] = d > 1.4 ? 0.2 : -0.1; } }
    }
    // paint chips near edges
    const chips = Math.floor(R() * 5 * S * S + 1);
    for (let c = 0; c < chips; c++) {
      const onX = R() < 0.5, cx = onX ? x + R() * w : x + (R() < 0.5 ? 3 : w - 3), cy = onX ? y + (R() < 0.5 ? 3 : h - 3) : y + R() * h;
      const rad = (1.5 + R() * 4) * S;
      for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
        const d = Math.hypot(dx, dy * 1.3) + vnoise(dx * 0.6 + c, dy * 0.6, 64, 3) * 2;
        if (d < rad) { const a = idx(Math.round(cx + dx), Math.round(cy + dy)); chipM[a] = 1; }
      }
    }
  }
  // scratches
  for (let s = 0; s < 260 * S * S; s++) {
    let x = R() * N, y = R() * N; const a = R() * TAU, len = (6 + R() * 34) * S, st = 0.4 + R() * 0.6;
    for (let k = 0; k < len; k++) { scr[idx(Math.round(x), Math.round(y))] = Math.max(scr[idx(Math.round(x), Math.round(y))], st); x += Math.cos(a); y += Math.sin(a); }
  }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x, o = i * 4;
    const g1 = fbm(x / (64 * S), y / (64 * S), 8, 4, 11), g2 = fbm(x / (18 * S), y / (18 * S), Math.round(N / (18 * S)), 3, 5);
    const grime = smooth((g1 - 0.42) * 2.2);
    let a = 0.9 + panelTone[i] - grime * 0.22 - dark[i] * 0.55 + (g2 - 0.5) * 0.06;
    a += chipM[i] * 0.18 + scr[i] * 0.1;
    a = clamp(a, 0, 1) * 255;
    alb[o] = a; alb[o + 1] = a; alb[o + 2] = a * 0.985; alb[o + 3] = 255;
    rmh[o] = clamp(height[i] * 0.9 + (g2 - 0.5) * 0.08 - chipM[i] * 0.12, 0, 1) * 255;
    rmh[o + 1] = clamp(0.5 + grime * 0.35 + (g2 - 0.5) * 0.12 - scr[i] * 0.25 - chipM[i] * 0.15, 0.08, 1) * 255;
    rmh[o + 2] = clamp(0.1 + chipM[i] * 0.85 + scr[i] * 0.5, 0, 1) * 255;
    rmh[o + 3] = 255;
  }
  // organic: cells + veins
  const M = Math.max(128, N / 2), oalb = new Uint8Array(M * M * 4), orh = new Uint8Array(M * M * 4);
  for (let y = 0; y < M; y++) for (let x = 0; x < M; x++) {
    const o = (y * M + x) * 4, sc = 8 / M * 2;
    const [f1, f2] = worley(x * sc, y * sc, 16, 21), vein = smooth(1 - (f2 - f1) * 5);
    const [g1, g2] = worley(x * sc * 3, y * sc * 3, 48, 33), pore = smooth(1 - g1 * 2.2);
    const n = fbm(x / (M / 8), y / (M / 8), 8, 4, 7);
    const v = clamp(0.78 - vein * 0.38 + (n - 0.5) * 0.25 + pore * 0.06, 0, 1) * 255;
    oalb[o] = v; oalb[o + 1] = v * 0.97; oalb[o + 2] = v * 0.95; oalb[o + 3] = 255;
    orh[o] = clamp(0.55 + f1 * 0.5 - vein * 0.35 + pore * 0.12 + (n - 0.5) * 0.2, 0, 1) * 255;
    orh[o + 1] = clamp(0.32 + (n - 0.5) * 0.4 + vein * 0.15, 0.05, 1) * 255;
    orh[o + 2] = 0; orh[o + 3] = 255;
  }
  return {
    alb: dataTex(alb, N, true, aniso), rmh: dataTex(rmh, N, false, aniso),
    oalb: dataTex(oalb, M, true, aniso), orh: dataTex(orh, M, false, aniso),
    dispose() { this.alb.dispose(); this.rmh.dispose(); this.oalb.dispose(); this.orh.dispose(); },
  };
}

// ---- material library --------------------------------------------------------------
// One shared base material per kind (so every actor shares the same handful of
// shader programs); instances get cheap clones for flash / frost / pulse.
export function makeMaterials(quality, renderer) {
  const aniso = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  const tex = makeTextures(quality === 'low' ? 256 : 512, aniso);
  const base = {};
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ vertexColors: true }, o));
  const phys = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ vertexColors: true }, o));
  const low = quality === 'low';
  base.paint = std({ map: tex.alb, roughnessMap: tex.rmh, metalnessMap: tex.rmh, bumpMap: low ? null : tex.rmh, bumpScale: 1.4, roughness: 1, metalness: 1 });
  base.metal = std({ map: tex.alb, roughnessMap: tex.rmh, bumpMap: low ? null : tex.rmh, bumpScale: 0.9, roughness: 0.78, metalness: 0.88 });
  base.suit = std({ roughnessMap: tex.orh, bumpMap: low ? null : tex.orh, bumpScale: 0.35, roughness: 1.9, metalness: 0.0 });
  base.flesh = low ? std({ map: tex.oalb, roughnessMap: tex.orh, roughness: 1.2, metalness: 0 })
    : phys({ map: tex.oalb, roughnessMap: tex.orh, bumpMap: tex.orh, bumpScale: 2.2, roughness: 1.3, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.22, sheen: 0.4, sheenRoughness: 0.5, sheenColor: new THREE.Color(0.6, 0.4, 0.5) });
  base.crystal = low ? std({ roughness: 0.15, metalness: 0.1, emissive: new THREE.Color(1, 1, 1), emissiveIntensity: 0.32, flatShading: true })
    : phys({ roughness: 0.08, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, iridescence: 0.55, iridescenceIOR: 1.6, emissive: new THREE.Color(1, 1, 1), emissiveIntensity: 0.32, envMapIntensity: 1.7, flatShading: true, specularIntensity: 1 });
  // crystal + flesh glows: emissive tinted by the vertex colour so one material serves every hue
  base.crystal.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n\ttotalEmissiveRadiance *= vColor.rgb;'); };
  base.crystal.customProgramCacheKey = () => 'shard-crystal';
  base.glow = new THREE.MeshBasicMaterial({ vertexColors: true });
  base.core = new THREE.MeshBasicMaterial({ vertexColors: true });   // separately pulsed glow (cores, charge vents)
  base.accent = new THREE.MeshBasicMaterial({ vertexColors: true }); // per-instance coloured glow (weapon)
  base.membrane = std({ transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false, roughness: 0.25, metalness: 0.1, emissive: new THREE.Color(0, 0, 0) });
  base.bubble = phys({ transparent: true, opacity: 0.2, roughness: 0.02, metalness: 0, clearcoat: 1, iridescence: low ? 0 : 1, iridescenceIOR: 1.3, envMapIntensity: 2.6, depthWrite: false, side: THREE.DoubleSide, emissive: new THREE.Color(0, 0, 0) });
  base.glass = phys({ transparent: true, opacity: 0.5, roughness: 0.04, metalness: 0, clearcoat: 1, iridescence: low ? 0 : 0.4, envMapIntensity: 2.2, depthWrite: false, emissive: new THREE.Color(0, 0, 0) });
  for (const k of Object.keys(base)) { base[k].name = 'actor-' + k; }
  return {
    base, tex,
    instance(key) { const b = base[key]; if (!b) throw new Error('mat ' + key); const m = b.clone(); m.onBeforeCompile = b.onBeforeCompile; m.customProgramCacheKey = b.customProgramCacheKey; return m; },
    dispose() { for (const k of Object.keys(base)) base[k].dispose(); tex.dispose(); },
  };
}

// ---- small shared helpers for actor code -----------------------------------------
export function rot(b, x, y, z) { b.rotation.set(x, y, z); }
export function offs(b, x, y, z) { const r = b.userData.rest; b.position.set(r.x + x, r.y + y, r.z + z); }
// solid tile probe (for turret mounting)
export function solidAt(level, px, py) {
  if (!level || !level.tiles) return false;
  const tx = Math.floor(px / 20), ty = Math.floor(py / 20);
  if (tx < 0 || ty < 0 || tx >= level.cols || ty >= level.rows) return false;
  const v = level.tiles[ty * level.cols + tx];
  return v === 1 || v === 6;
}
export function mountOf(e, s) {
  const L = s && s.level; if (!L) return 'floor';
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  if (solidAt(L, cx, e.y + e.h + 3)) return 'floor';
  if (solidAt(L, cx, e.y - 3)) return 'ceil';
  if (solidAt(L, e.x - 3, cy)) return 'wallL';
  if (solidAt(L, e.x + e.w + 3, cy)) return 'wallR';
  return 'floor';
}
