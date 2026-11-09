// Skyhold 2026 3D models with physically based materials: the WARDEN gunship, the alien machines (lifter,
// husk, sower, mine, hive, stinger, prowler), settlers, power pods, the five sector bosses and the instanced
// ground scenery for each world look. Each model is built once from many detailed parts (bevelled side
// profiles and armour plates, turned parts, greebles, lamps), every static part is merged into one mesh per
// material class per moving joint, and later copies are cheap clones that share geometry. A panel normal map
// adds seams, rivets and scratches to painted metal.
// Every model faces +x with Y up. The camera looks along -z from the +z side (a side view, ~8 degrees from
// above), so the silhouettes and the z faces carry the detail; both faces are dressed (big things turn round).
import * as THREE from '../vendor/three.module.min.js';

export const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
let M = null;
// shared materials (call once with the environment map, grime, stripe and panel-normal textures)
export function materials(env, grime, stripe, panelN, hq = true) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 1, ...o });
  const nrm = panelN ? { normalMap: panelN, normalScale: new THREE.Vector2(0.7, 0.7) } : {};
  M = {
    env, grime, stripe, panelN, nrm,
    dark: std({ color: 0x2a2e35, metalness: 0.75, roughness: 0.42, map: grime, ...nrm }),
    frame: std({ color: 0x3a3f47, metalness: 0.85, roughness: 0.35 }),
    steel: std({ color: 0x9aa1ab, metalness: 0.92, roughness: 0.26 }),
    chrome: std({ color: 0xd6dce4, metalness: 1, roughness: 0.12 }),
    rubber: std({ color: 0x141518, metalness: 0, roughness: 0.92 }),
    black: std({ color: 0x0c0d10, metalness: 0.5, roughness: 0.5 }),
    copper: std({ color: 0xc27a45, metalness: 1, roughness: 0.3 }),
    brass: std({ color: 0xc9a24a, metalness: 1, roughness: 0.35 }),
    ceramic: std({ color: 0xe6e1d6, metalness: 0, roughness: 0.25 }),
    glass: std({ color: 0x0a1018, metalness: 0.2, roughness: 0.05, envMapIntensity: 2.2 }),
    glassT: std({ color: 0x9fc8e8, metalness: 0.1, roughness: 0.04, envMapIntensity: 2.5, transparent: true, opacity: 0.28, depthWrite: false }),
    stripes: std({ map: stripe, metalness: 0.3, roughness: 0.55 }),
    paint: new Map(), glow: new Map(), cloth: new Map(),
  };
  M.hq = hq;
  // merged parts share a few class materials and carry their own colour per vertex
  M.cls = {
    paint: hq ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.55, roughness: 0.4, map: grime, envMap: env, clearcoat: 0.55, clearcoatRoughness: 0.28, ...nrm })
      : std({ color: 0xffffff, vertexColors: true, metalness: 0.55, roughness: 0.34, map: grime, ...nrm }),
    metal: std({ color: 0xffffff, vertexColors: true, metalness: 0.92, roughness: 0.28 }),
    rough: std({ color: 0xffffff, vertexColors: true, metalness: 0, roughness: 0.82 }),
    gloss: std({ color: 0xffffff, vertexColors: true, metalness: 0.15, roughness: 0.1, envMapIntensity: 1.8 }),
    build: std({ color: 0xffffff, vertexColors: true, metalness: 0.2, roughness: 0.5, map: grime, ...nrm }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, toneMapped: false }),
  };
  M.dark.userData.cls = 'paint';
  for (const k of ['frame', 'steel', 'chrome', 'copper', 'brass']) M[k].userData.cls = 'metal';
  M.black.userData.cls = 'paint';
  for (const k of ['rubber', 'ceramic']) M[k].userData.cls = 'rough';
  return M;
}
export function paint(color, rough = 0.38, metal = 0.55) {
  const k = color + ':' + rough + ':' + metal;
  if (!M.paint.has(k)) { const m = M.hq ? new THREE.MeshPhysicalMaterial({ color, metalness: metal, roughness: rough, map: M.grime, envMap: M.env, envMapIntensity: 1, clearcoat: 0.55, clearcoatRoughness: 0.28, ...M.nrm }) : new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, map: M.grime, envMap: M.env, envMapIntensity: 1, ...M.nrm }); m.userData.cls = 'paint'; M.paint.set(k, m); }
  return M.paint.get(k);
}
export function glow(color, k = 3) {
  const key = color + ':' + k;
  if (!M.glow.has(key)) { const m = new THREE.MeshBasicMaterial({ color: hdr(color, k), toneMapped: false }); m.userData.cls = 'glow'; M.glow.set(key, m); }
  return M.glow.get(key);
}

// ------------------------------------------------------------------ geometry library (cached)
const G = {};
const geo = (k, f) => G[k] || (G[k] = f());
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const box = (x, y, z) => geo(`b${x},${y},${z}`, () => new THREE.BoxGeometry(x, y, z));
const cyl = (a, b, h, n = 16) => geo(`c${a},${b},${h},${n}`, () => new THREE.CylinderGeometry(a, b, h, n));
const sph = (r, w = 20, h = 14) => geo(`s${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h));
const cap = (r, l, n = 12) => geo(`k${r},${l},${n}`, () => new THREE.CapsuleGeometry(r, l, 6, n));
const tor = (r, t, n = 28, m = 8) => geo(`t${r},${t},${n},${m}`, () => new THREE.TorusGeometry(r, t, m, n));
const arcT = (r, t, arc, n = 24, m = 6) => geo(`a${r},${t},${arc},${n},${m}`, () => new THREE.TorusGeometry(r, t, m, n, arc));
const cone = (r, h, n = 12) => geo(`n${r},${h},${n}`, () => new THREE.ConeGeometry(r, h, n));
const ico = (r, d = 0) => geo(`i${r},${d}`, () => new THREE.IcosahedronGeometry(r, d));
// a box with rounded, bevelled edges (armour plates); UVs in metres so the panel map has a steady scale
function rbox(w, h, d, r = 0.03) {
  return geo(`r${w},${h},${d},${r}`, () => {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    const s = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    s.moveTo(x, y); s.lineTo(x + W, y); s.lineTo(x + W, y + H); s.lineTo(x, y + H); s.lineTo(x, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 3 });
    g.translate(0, 0, -(d - 2 * r) / 2);
    g.computeVertexNormals();
    return g;
  });
}
// a turned part from a [radius, height] profile
const lathe = (key, pts, n = 24) => geo('l' + key, () => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), n));
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _d = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _qq = new THREE.Quaternion();
// a shape extruded upward (+y), thickness h centred on y = 0, bevelled so the outline stays where it was drawn
function extrudeY(s, h, r, cs = 4) {
  r = Math.max(0, Math.min(r, h / 2 - 0.002));
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.002, h - 2 * r), bevelEnabled: r > 0, bevelThickness: r, bevelSize: r, bevelOffset: -r, bevelSegments: r > 0.02 ? 2 : 1, curveSegments: cs });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -(h - 2 * r) / 2, 0);
  g.computeVertexNormals();
  return g;
}
// a bevelled plate from a plan-view polygon [[x, z], ...] (any winding), thickness h centred on y = 0
function slab(pts, h, r = 0.04) {
  const key = 'sl' + pts.map((p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(';') + '|' + h + '|' + r;
  return geo(key, () => {
    const s = new THREE.Shape();
    pts.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z)));
    s.closePath();
    return extrudeY(s, h, r);
  });
}
// a flat ring (n-gon outline and hole, n = 40 reads as round), thickness h centred on y = 0
function ngonRing(n, r0, r1, h, rot = 0, r = 0.04) {
  return geo(`ng${n},${r0},${r1},${h},${rot},${r}`, () => {
    const s = new THREE.Shape(), hole = new THREE.Path();
    for (let i = 0; i < n; i++) { const a = rot + (i / n) * TAU; i ? s.lineTo(Math.cos(a) * r1, -Math.sin(a) * r1) : s.moveTo(Math.cos(a) * r1, -Math.sin(a) * r1); }
    s.closePath();
    for (let i = 0; i < n; i++) { const a = rot - (i / n) * TAU; i ? hole.lineTo(Math.cos(a) * r0, -Math.sin(a) * r0) : hole.moveTo(Math.cos(a) * r0, -Math.sin(a) * r0); }
    hole.closePath();
    s.holes.push(hole);
    return extrudeY(s, h, Math.min(r, (r1 - r0) / 3));
  });
}
const washer = (r0, r1, h, r = 0.04) => ngonRing(40, r0, r1, h, 0, r);
// a polygon shrunk inward by d (for inset panels)
function inset(pts, d) {
  const n = pts.length; let ar = 0;
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; ar += a[0] * b[1] - b[0] * a[1]; }
  const s = ar > 0 ? 1 : -1;
  return pts.map((c, i) => {
    const p = pts[(i + n - 1) % n], q = pts[(i + 1) % n];
    let ax = c[0] - p[0], ay = c[1] - p[1], l = Math.hypot(ax, ay) || 1; ax /= l; ay /= l;
    let bx = q[0] - c[0], bY = q[1] - c[1]; l = Math.hypot(bx, bY) || 1; bx /= l; bY /= l;
    const n1x = -ay * s, n1y = ax * s, n2x = -bY * s, n2y = bx * s;
    let mx = n1x + n2x, my = n1y + n2y; l = Math.hypot(mx, my) || 1; mx /= l; my /= l;
    const k = d / Math.max(0.35, mx * n1x + my * n1y);
    return [c[0] + mx * k, c[1] + my * k];
  });
}
// mirror image of a plan polygon (z -> -z), and a symmetric hull outline from its +z half (front to back)
const sym = (half) => [...half, ...half.slice().reverse().map(([x, z]) => [x, -z])];
// surfaces of revolution: prof(t) -> [radius, height], t running from the top down the outside
const profN = (prof, t) => { const e = 1e-4, a = prof(t - e), b = prof(t + e), dr = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dr, dy) || 1; return [-dy / l, dr / l]; };
const revPt = (prof, t, p, o = 0) => { const [r, y] = prof(t), [nr, ny] = profN(prof, t), rr = r + nr * o; return v3(rr * Math.cos(p), y + ny * o, rr * Math.sin(p)); };
const revN = (prof, t, p) => { const [nr, ny] = profN(prof, t); return v3(nr * Math.cos(p), ny, nr * Math.sin(p)); };
const offProf = (prof, o) => (t) => { const [r, y] = prof(t), [nr, ny] = profN(prof, t); return [r + nr * o, y + ny * o]; };
const eulerTo = (n) => { const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(_up, n.clone().normalize())); return [e.x, e.y, e.z]; };
// a geometry bent by f(x, y, z) -> [x', y, z] where only x' changes (x' = F(x, z)); normals follow the bend
function warp(key, src, f) {
  return geo(key, () => {
    const g = src.index ? src.toNonIndexed() : src.clone(), p = g.attributes.position, n = g.attributes.normal, e = 1e-3;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), q = f(x, y, z);
      const a = (f(x + e, y, z)[0] - q[0]) / e, b = (f(x, y, z + e)[0] - q[0]) / e;
      const nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i), mx = nx / a, mz = nz - b * nx / a, l = Math.hypot(mx, ny, mz) || 1;
      p.setXYZ(i, q[0], q[1], q[2]); n.setXYZ(i, mx / l, ny / l, mz / l);
    }
    g.computeBoundingSphere();
    return g;
  });
}
// a thick curved armour plate on a surface of revolution between t0..t1 and angles p0..p1 (measured from +x
// toward +z), th thick outward, the top face chamfered in by ch metres; jag > 0 roughens the edges (cracks)
function revPatch(key, prof, t0, t1, p0, p1, th, nt = 5, np = 8, ch = 0.06, jag = 0, seed = 1) {
  return geo('rp' + key, () => {
    const S = (t, p, o) => revPt(prof, t, p, o);
    const tm = (t0 + t1) / 2, pm = (p0 + p1) / 2, a0 = prof(tm), a1 = prof(tm + 1e-3);
    const spT = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) / 1e-3, rM = Math.max(0.3, a0[0] + th);
    const dt = Math.min(ch / spT, (t1 - t0) / 4), dp = Math.min(ch / rM, (p1 - p0) / 4);
    const rnd = (i, s) => { const x = Math.sin(i * 12.9898 + s * 78.233 + seed * 37.719) * 43758.5453; return x - Math.floor(x); };
    const pL = [], pR = [], tT = [], tB = [];
    for (let i = 0; i <= nt; i++) { const J = i % nt ? jag : 0; pL.push(p0 + J * rnd(i, 1)); pR.push(p1 - J * rnd(i, 2)); }
    for (let j = 0; j <= np; j++) { const J = j % np ? jag : 0; tT.push(t0 + J * rnd(j, 3)); tB.push(t1 - J * rnd(j, 4)); }
    const prm = (i, j, ins) => { const a = j / np, b = i / nt, ta = tT[j] + ins * dt, tb = tB[j] - ins * dt, pa = pL[i] + ins * dp, pb = pR[i] - ins * dp; return [ta + (tb - ta) * b, pa + (pb - pa) * a]; };
    const P = [], N = [], U = [], e1 = v3(), e2 = v3(), fn = v3();
    const put = (q, n, uv) => { P.push(q.x, q.y, q.z); N.push(n.x, n.y, n.z); U.push(uv[0], uv[1]); };
    // a triangle turned to face 'want'; vertex normals, or a flat face when they are null
    const tri = (a, b, c, na, nb, nc, want, ua, ub, uc) => {
      e1.subVectors(b, a); e2.subVectors(c, a); fn.crossVectors(e1, e2);
      if (fn.dot(want) < 0) { [b, c] = [c, b]; [nb, nc] = [nc, nb]; [ub, uc] = [uc, ub]; fn.negate(); }
      const f = fn.clone().normalize();
      put(a, na || f, ua); put(b, nb || f, ub); put(c, nc || f, uc);
    };
    const grid = (o, ins) => { const V = [], NN = [], UU = []; for (let i = 0; i <= nt; i++) for (let j = 0; j <= np; j++) { const [t, p] = prm(i, j, ins); V.push(S(t, p, o)); NN.push(revN(prof, t, p)); UU.push([p * rM, t * spT]); } return { V, NN, UU }; };
    const inner = grid(0, 0), rim = grid(th * 0.55, 0), outer = grid(th, 1);
    for (const [g, sg] of [[outer, 1], [inner, -1]]) {
      for (let i = 0; i < nt; i++) for (let j = 0; j < np; j++) {
        const a = i * (np + 1) + j, b = a + 1, c = a + np + 1, d = c + 1;
        const n = sg > 0 ? g.NN : g.NN.map((q) => q.clone().negate()), want = n[a];
        tri(g.V[a], g.V[b], g.V[c], n[a], n[b], n[c], want, g.UU[a], g.UU[b], g.UU[c]);
        tri(g.V[b], g.V[d], g.V[c], n[b], n[d], n[c], want, g.UU[b], g.UU[d], g.UU[c]);
      }
    }
    // the edge: a straight side wall to 55% of the thickness, then a chamfer up to the inset top face
    const loop = [];
    for (let j = 0; j < np; j++) loop.push(j);
    for (let i = 0; i < nt; i++) loop.push(i * (np + 1) + np);
    for (let j = np; j > 0; j--) loop.push(nt * (np + 1) + j);
    for (let i = nt; i > 0; i--) loop.push(i * (np + 1));
    const Cc = S(tm, pm, th * 0.5), nC = revN(prof, tm, pm);
    for (const [A, B, cham] of [[inner, rim, false], [rim, outer, true]]) {
      for (let k = 0; k < loop.length; k++) {
        const i0 = loop[k], i1 = loop[(k + 1) % loop.length], a = A.V[i0], b = A.V[i1], c = B.V[i0], d = B.V[i1];
        const want = v3().addVectors(a, d).multiplyScalar(0.5).sub(Cc).normalize();
        if (cham) want.add(nC);
        const ua = A.UU[i0], ub = A.UU[i1], uc = [B.UU[i0][0], B.UU[i0][1] + th], ud = [B.UU[i1][0], B.UU[i1][1] + th];
        tri(a, b, c, null, null, null, want, ua, ub, uc);
        tri(b, d, c, null, null, null, want, ub, ud, uc);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
    g.computeBoundingSphere();
    return g;
  });
}
// non-indexed geometries with the same attributes, joined
function concat(list) {
  let n = 0; for (const g of list) n += g.attributes.position.count;
  const out = new THREE.BufferGeometry();
  for (const k of Object.keys(list[0].attributes)) {
    const sz = list[0].attributes[k].itemSize, arr = new Float32Array(n * sz); let o = 0;
    for (const g of list) { arr.set(g.attributes[k].array, o); o += g.attributes[k].array.length; }
    out.setAttribute(k, new THREE.BufferAttribute(arr, sz));
  }
  out.computeBoundingSphere();
  return out;
}
// engine plumes: unit length along -x from the nozzle plane at x = 0 (the renderer scales .scale.x by thrust),
// a white-hot inner cone inside a coloured sheath fading to black, drawn additively (black = invisible)
let FLAME = null;
const flameMat = () => FLAME || (FLAME = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, forceSinglePass: true }));
function plume(r, color, zs = [0], n = 14) {
  return geo(`pl${r},${color},${zs.join(',')}`, () => {
    const Cc = new THREE.Color(color), W = new THREE.Color(0xffffff).lerp(Cc, 0.3), list = [];
    const part = (rr, len, col, k, pw, z) => {
      const g = new THREE.ConeGeometry(rr, len, n, 6, true).toNonIndexed();
      g.rotateZ(Math.PI / 2); g.translate(-len / 2, 0, z);
      const p = g.attributes.position, c = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) { const f = Math.pow(Math.max(0, 1 + p.getX(i) / len), pw) * k; c[i * 3] = col.r * f; c[i * 3 + 1] = col.g * f; c[i * 3 + 2] = col.b * f; }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      list.push(g);
    };
    for (const z of zs) { part(r, 1, Cc, 2.4, 1.6, z); part(r * 0.5, 0.5, W, 4.5, 1.2, z); }
    return concat(list);
  });
}
// a stand-in material that only carries a colour into a merged class mesh (never rendered itself)
const TINT = new Map();
function tint(color, cls = 'metal') { const k = color + cls; if (!TINT.has(k)) { const m = new THREE.MeshBasicMaterial({ color }); m.userData.cls = cls; TINT.set(k, m); } return TINT.get(k); }

// ------------------------------------------------------------------ the kit: collect parts, merge the static ones
const STATIC_PARTS = new Set(['beacon', 'tip']);
class Kit {
  constructor() { this.root = new THREE.Group(); this.buckets = new Map(); this.named = []; this.parts = []; }
  group(name, parent = this.root, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.name = name || ''; g.position.set(x, y, z); parent.add(g); return g; }
  // a static part: merged later with everything else in the same parent and material
  add(g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx, parent = this.root) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
    if (this.xf) m.premultiply(this.xf);   // an extra placement for a whole sub-assembly (stingers in the hive)
    const cls = mat.userData.cls;
    const key = parent.uuid + '|' + (cls || mat.uuid);
    let b = this.buckets.get(key);
    if (!b) { b = { parent, mat: cls ? M.cls[cls] : mat, list: [], colored: !!cls }; this.buckets.set(key, b); }
    b.list.push([g, m, mat.color]);
    this.parts.push({ g, mat, m, parent });
  }
  // a part between two points (struts, pistons, cables, legs)
  rod(mat, ax, ay, az, bx, by, bz, r, parent = this.root, n = 8) {
    _a.set(ax, ay, az); _b.set(bx, by, bz); _d.subVectors(_b, _a);
    const l = _d.length();
    _qq.setFromUnitVectors(_up, _d.normalize());
    const e = new THREE.Euler().setFromQuaternion(_qq);
    this.add(cyl(r, r, 1, n), mat, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, e.x, e.y, e.z, 1, l, 1, parent);
  }
  // a separate mesh (lamps, emitters, cores the renderer scales or recolours)
  mesh(g, mat, name, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, parent = this.root) {
    // lights the renderer never moves are merged like any other part
    if (STATIC_PARTS.has(name.replace(/[-\d]+$/, ''))) { this.add(g, mat, x, y, z, rx, ry, rz, 1, 1, 1, parent); return null; }
    const m = new THREE.Mesh(g, mat); m.name = name; m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
    m.castShadow = !mat.isMeshBasicMaterial; m.receiveShadow = true;
    parent.add(m); return m;
  }
  build() {
    for (const { parent, mat, list, colored } of this.buckets.values()) {
      const g = merge(list, colored);
      const m = new THREE.Mesh(g, mat);
      m.castShadow = !mat.isMeshBasicMaterial && !(this.noShadow && parent.name.startsWith(this.noShadow)); m.receiveShadow = true;
      parent.add(m);
    }
    this.buckets.clear();
    PARTS.set(this.root, this.parts.map((q) => ({ g: q.g, mat: q.mat, m: q.m, parent: q.parent === this.root ? '' : q.parent.name })));
    return this.root;
  }
}
function merge(list, colored) {
  let n = 0;
  const parts = list.map(([g, m]) => { const q = (g.index ? g.toNonIndexed() : g.clone()); q.applyMatrix4(m); n += q.attributes.position.count; return q; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), col = colored ? new Float32Array(n * 3) : null;
  let o = 0;
  for (let pi = 0; pi < parts.length; pi++) {
    const q = parts[pi], c = q.attributes.position.count;
    if (col) {
      const C = list[pi][2];
      // a colour, or f(x, y, z, nx, ny, nz) -> colour per vertex (scenery strata, snow caps, moss)
      if (typeof C === 'function') { const P = q.attributes.position, N = q.attributes.normal; for (let k = 0; k < c; k++) { const v = C(P.getX(k), P.getY(k), P.getZ(k), N.getX(k), N.getY(k), N.getZ(k)); col[(o + k) * 3] = v.r; col[(o + k) * 3 + 1] = v.g; col[(o + k) * 3 + 2] = v.b; } }
      else for (let k = 0; k < c; k++) { col[(o + k) * 3] = C.r; col[(o + k) * 3 + 1] = C.g; col[(o + k) * 3 + 2] = C.b; }
    }
    pos.set(q.attributes.position.array, o * 3);
    if (q.attributes.normal) nor.set(q.attributes.normal.array, o * 3);
    if (q.attributes.uv) uv.set(q.attributes.uv.array.subarray(0, c * 2), o * 2);
    o += c;
    q.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeBoundingSphere();
  return g;
}
// build each model type once, hand out clones that share geometry and materials
const PROTO = new Map();
// every model's original parts (before merging), so it can be broken into its real pieces
const PARTS = new WeakMap();
function make(key, build) {
  if (!PROTO.has(key)) PROTO.set(key, build());
  const p = PROTO.get(key), c = p.clone(true);
  PARTS.set(c, PARTS.get(p));
  return c;
}
export const partsOf = (g) => PARTS.get(g) || null;
// a part as a stand-alone mesh that reuses already-compiled shaders: painted, metal and rough parts get a
// colour attribute and the shared class material; glowing parts keep their own (compiled) glow material
const PGEO = new Map();
export function partMesh(q) {
  const cls = q.mat.userData.cls;
  if (!cls || cls === 'glow') return new THREE.Mesh(q.g, q.mat);
  const key = q.g.uuid + ':' + q.mat.color.getHexString();
  let g = PGEO.get(key);
  if (!g) {
    g = q.g.index ? q.g.toNonIndexed() : q.g.clone();
    const n = g.attributes.position.count, col = new Float32Array(n * 3), C = q.mat.color;
    for (let i = 0; i < n; i++) { col[i * 3] = C.r; col[i * 3 + 1] = C.g; col[i * 3 + 2] = C.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeBoundingSphere();
    PGEO.set(key, g);
  }
  return new THREE.Mesh(g, M.cls[cls]);
}
const by = (g, name) => g.getObjectByName(name);
const all = (g, prefix) => { const out = []; g.traverse((o) => { if (o.name && o.name.startsWith(prefix)) out.push(o); }); out.sort((a, b) => a.name.localeCompare(b.name)); return out; };
// a bevelled plate through coplanar 3D corner points, th thick on the side 'out' points to. Returns F for
// details on its outer face: F(geom, mat, a, b, h, rot) puts a part a metres along the first edge, b across
// and h above the face (part x = along the first edge, y = plate normal, z = across); F.at(..., x, y, z, h)
// does the same from a world point projected onto the plate; F.inset(d, hh, mat) adds a raised inner panel.
// ax (optional) is a world direction for the first axis instead of the first edge (for trapezoids).
function plate3(K, P, pts, th, mat, out, r = 0.05, ax = null) {
  const o = pts[0], n = v3();
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n.x += (a.y - b.y) * (a.z + b.z); n.y += (a.z - b.z) * (a.x + b.x); n.z += (a.x - b.x) * (a.y + b.y); }
  n.normalize(); if (n.dot(out) < 0) n.negate();
  const u = ax ? ax.clone() : v3().subVectors(pts[1], o); u.addScaledVector(n, -u.dot(n)).normalize();
  const w = v3().crossVectors(u, n);
  const basis = new THREE.Matrix4().makeBasis(u, n, w);
  const pts2 = pts.map((p) => { const d = v3().subVectors(p, o); return [d.dot(u), d.dot(w)]; });
  const F = (gm, mt, a, b, h, rot = 0, sx = 1, sy = 1, sz = 1) => {
    const m = rot ? basis.clone().multiply(new THREE.Matrix4().makeRotationY(rot)) : basis;
    const e = new THREE.Euler().setFromRotationMatrix(m);
    const p = o.clone().addScaledVector(u, a).addScaledVector(w, b).addScaledVector(n, th + h);
    K.add(gm, mt, p.x, p.y, p.z, e.x, e.y, e.z, sx, sy, sz, P);
  };
  const e = new THREE.Euler().setFromRotationMatrix(basis), c = o.clone().addScaledVector(n, th / 2);
  K.add(slab(pts2, th, r), mat, c.x, c.y, c.z, e.x, e.y, e.z, 1, 1, 1, P);
  F.at = (gm, mt, x, y, z, h, rot, sx, sy, sz) => { const d = v3(x, y, z).sub(o); F(gm, mt, d.dot(u), d.dot(w), h, rot, sx, sy, sz); };
  F.inset = (d, hh, mt, h = hh / 2, r2 = 0.02) => F(slab(inset(pts2, d), hh, r2), mt, 0, 0, h);
  F.pts2 = pts2;
  return F;
}

// ------------------------------------------------------------------ Skyhold helpers
// The camera sees every model from its +z side (a side view, slightly above), so most hulls are side
// profiles (x, y) extruded along z with deep bevels, then layered with plates, seams, greebles and lamps on
// both z faces (big things turn round in 3D, so the far face is dressed the same).
const PI = Math.PI;
const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => new THREE.Matrix4().compose(v3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), v3(sx, sy, sz));
const rng = (seed) => { let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; };
const hsh = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t, h = (i, j, k) => hsh(xi + i, yi + j, zi + k);
  return L(L(L(h(0, 0, 0), h(1, 0, 0), u), L(h(0, 1, 0), h(1, 1, 0), u), v), L(L(h(0, 0, 1), h(1, 0, 1), u), L(h(0, 1, 1), h(1, 1, 1), u), v), w);
}
const fbm3 = (x, y, z, o = 3) => { let a = 0.5, t = 0, f = 1, n = 0; for (let i = 0; i < o; i++) { t += a * vnoise(x * f, y * f, z * f); n += a; f *= 2.03; a *= 0.5; } return t / n; };
// smooth normals where faces meet at less than the crease angle: hulls stay round, bevel lips stay crisp
function smooth(g, crease = 50) {
  if (g.index) g = g.toNonIndexed();
  g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, c = Math.cos(crease * D2R), fn = new Float32Array(n.array), map = new Map();
  for (let i = 0; i < p.count; i++) { const k = Math.round(p.getX(i) * 1e4) + ',' + Math.round(p.getY(i) * 1e4) + ',' + Math.round(p.getZ(i) * 1e4); let a = map.get(k); if (!a) map.set(k, (a = [])); a.push(i); }
  for (const ids of map.values()) for (const i of ids) {
    let x = 0, y = 0, z = 0; const ax = fn[i * 3], ay = fn[i * 3 + 1], az = fn[i * 3 + 2];
    for (const j of ids) { const bx = fn[j * 3], bY = fn[j * 3 + 1], bz = fn[j * 3 + 2]; if (ax * bx + ay * bY + az * bz >= c) { x += bx; y += bY; z += bz; } }
    const l = Math.hypot(x, y, z) || 1; n.setXYZ(i, x / l, y / l, z / l);
  }
  return g;
}
// a smooth curve through [x, y] points, and a closed hull outline from a top curve (nose to tail) and a
// bottom curve (tail to nose)
const crv = (pts, n = 10) => new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(n).map((p) => [p.x, p.y]);
const hull = (top, bot, n = 10) => [...crv(top, n), ...crv(bot, n)];
// a side-profile plate: [x, y] outline extruded d along z (centred on z = 0), bevelled r, smooth-shaded
function side(pts, d, r = 0.04, crease = 50) {
  const key = 'sd' + pts.map((p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(';') + '|' + d + '|' + r + '|' + crease;
  return geo(key, () => {
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    r = Math.max(0, Math.min(r, d / 2 - 0.002));
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.002, d - 2 * r), bevelEnabled: r > 0, bevelThickness: r, bevelSize: r, bevelOffset: -r, bevelSegments: r > 0.05 ? 3 : r > 0.015 ? 2 : 1, curveSegments: 4 });
    g.translate(0, 0, -(d - 2 * r) / 2);
    return smooth(g, crease);
  });
}
// a side plate narrowed in z toward one end (a nose seen from above): z scaled by 1 .. k as x runs x0 .. x1
function taperZ(src, x0, x1, k) {
  return geo('tz' + src.uuid + x0 + ',' + x1 + ',' + k, () => {
    const g = src.clone(), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const t = Math.min(1, Math.max(0, (p.getX(i) - x0) / (x1 - x0))); p.setZ(i, p.getZ(i) * (1 - (1 - k) * t * t)); }
    return smooth(g, 50);
  });
}
// y of a polyline at x (the polyline runs one way in x)
function yAt(pts, x) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if ((x - x0) * (x - x1) <= 0 && x0 !== x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return Math.abs(x - pts[0][0]) < Math.abs(x - pts[pts.length - 1][0]) ? pts[0][1] : pts[pts.length - 1][1];
}
// Euler angles that turn +y to n (then spin about n)
function orient(n, spin = 0) {
  const q = new THREE.Quaternion().setFromUnitVectors(_up, v3().copy(n).normalize());
  if (spin) q.multiply(new THREE.Quaternion().setFromAxisAngle(_up, spin));
  const e = new THREE.Euler().setFromQuaternion(q); return [e.x, e.y, e.z];
}
// a faceted crystal (hexagonal bipyramid prism) along +y from y = 0
const shard = (L, r, n = 6) => geo(`sh${L},${r},${n}`, () => { const g = new THREE.LatheGeometry([[0, 0], [r, L * 0.16], [r * 0.82, L * 0.78], [0, L]].map(([a, b]) => new THREE.Vector2(a, b)), n).toNonIndexed(); g.computeVertexNormals(); return g; });
// a noisy boulder: displaced icosphere, smooth with crisp ridges, flattened base standing on y = 0
function rockGeo(key, { seed = 1, detail = 3, sx = 1, sy = 1, sz = 1, amp = 0.3, freq = 1.6, base = -0.45, crease = 55 } = {}) {
  return geo('rk' + key, () => {
    const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), l = Math.hypot(x, y, z);
      const k = 1 + amp * (fbm3(x * freq + seed * 3.7, y * freq + seed, z * freq - seed * 1.3, 4) - 0.5) * 2.4;
      p.setXYZ(i, x / l * k * sx, Math.max(base, y / l * k) * sy, z / l * k * sz);
    }
    g.translate(0, -base * sy - 0.04 * sy, 0);
    return smooth(g, crease);
  });
}
// several primitives baked into one geometry (for separate glowing meshes the renderer drives)
const combo = (key, items) => geo('cb' + key, () => merge(items.map(([g, ...t]) => [g, mat4(...t), null]), false));
// a gothic / plain arch outline
const archPts = (cx, by, w, h) => [[cx - w, by], [cx + w, by], [cx + w, by + h], [cx + w * 0.62, by + h + w * 0.85], [cx, by + h + w * 1.5], [cx - w * 0.62, by + h + w * 0.85], [cx - w, by + h]];
const glowM = (color, k, name) => { const m = new THREE.MeshBasicMaterial({ color: hdr(color, k), toneMapped: false }); m.name = name; m.userData.base = m.color.clone(); return m; };
const atK = (K, P) => (gm, mt, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => K.add(gm, mt, x, y, z, rx, ry, rz, sx, sy, sz, P);
const BOTH = [-1, 1];

// ------------------------------------------------------------------ the WARDEN gunship (player)
let CANOPY = null;
const canopyMat = () => CANOPY || (CANOPY = new THREE.MeshPhysicalMaterial({ color: 0x2c4c70, metalness: 0.25, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.04, envMap: M.env, envMapIntensity: 2.6 }));
// 3.4 m interceptor: rounded side-profile fuselage in livery colour over a dark belly, raised dorsal spine,
// long glass canopy, anhedral swept wings (so the near wing shows from the side camera), twin engine nacelles
// with canted fins at the back and a beam cannon under the nose. +z is the starboard side (green lamp).
export function ship(color = 0x3d7fd9, accent = 0xffc65a) {
  const g = make('ship' + color + ':' + accent, () => {
    const K = new Kit();
    const B = K.group('bank'), L = K.group('lamps', B);
    const body = paint(color, 0.3, 0.5), dark = paint(0x2a2e35, 0.42, 0.7), grey = paint(0x8d949d, 0.3, 0.75), acc = paint(accent, 0.36, 0.4), blk = M.black, lite = paint(0xd6dade, 0.32, 0.4);
    const at = atK(K, B);
    const lamp = (gm, c, k, x, y, z) => K.add(gm, glow(c, k), x, y, z, 0, 0, 0, 1, 1, 1, L);
    const hot = new THREE.Color(accent).lerp(new THREE.Color(0xffffff), 0.55).getHex();
    // fuselage, dark belly band, dorsal spine
    const top = [[1.72, 0.0], [1.4, 0.075], [0.95, 0.16], [0.5, 0.225], [-0.1, 0.255], [-0.8, 0.245], [-1.3, 0.2], [-1.5, 0.16]];
    const bot = [[-1.5, -0.08], [-1.05, -0.17], [-0.3, -0.22], [0.5, -0.19], [1.15, -0.1], [1.6, -0.03]];
    at(taperZ(side(hull(top, bot, 14), 0.5, 0.1), 0.7, 1.75, 0.3), body);
    at(taperZ(side(crv(bot, 14).map(([x, y]) => [x, y - 0.006]), 0.53, 0.06), 0.7, 1.65, 0.3), dark);
    at(side([...crv([[0.98, 0.19], [0.3, 0.265], [-0.5, 0.28], [-1.36, 0.21]], 8), [-1.36, 0.08], [0.98, 0.08]], 0.3, 0.06), dark);
    for (const x of [-0.2, -0.55, -0.9]) at(box(0.012, 0.02, 0.31), blk, x, 0.285, 0);
    // canopy (its own mesh so the renderer can tint it), frame rim and bows
    const canopy = K.mesh(sph(0.3, 28, 14), canopyMat(), 'canopy', 0.6, 0.225, 0, 0, 0, 0, B);
    canopy.scale.set(1.85, 0.62, 0.56);
    at(tor(0.3, 0.02, 36, 6), grey, 0.6, 0.225, 0, PI / 2, 0, 0, 1.85, 0.56, 1);
    for (const [x, k] of [[0.42, 0.946], [0.82, 0.92]]) at(arcT(0.3, 0.017, PI, 16, 5), grey, x, 0.225, 0, 0, PI / 2, 0, 0.56 * k, 0.62 * k, 1);
    // nose: probe, headlights
    at(cone(0.035, 0.2, 8), M.steel, 1.76, 0.0, 0, 0, 0, -PI / 2);
    for (const s of BOTH) at(sph(0.024, 8, 6), glow(0xfff2d8, 5), 1.46, -0.045, s * 0.13);
    // side detail on both faces: accent stripe, seams, grille, intake scoop, warning tab
    for (const s of BOTH) {
      const z = s * 0.252;
      at(side([[1.08, 0.05], [1.0, 0.095], [-0.35, 0.115], [-0.35, 0.07]], 0.012, 0.004), acc, 0, 0, z);
      for (const [x, y0, y1] of [[0.95, -0.05, 0.08], [0.62, -0.1, 0.12]]) at(box(0.008, y1 - y0, 0.006), blk, x, (y0 + y1) / 2, z);
      at(box(1.3, 0.006, 0.006), blk, 0.4, -0.045, z);
      for (let k = 0; k < 4; k++) at(box(0.02, 0.05, 0.012), blk, 0.86 + k * 0.04, 0.0, z);
      at(side([[0.56, -0.06], [0.42, 0.075], [0.04, 0.075], [0.04, -0.075]], 0.05, 0.015), dark, 0, 0, s * 0.27);
      at(box(0.035, 0.11, 0.03), blk, 0.47, 0.0, s * 0.29);
      for (const y of [-0.035, 0.0, 0.035]) at(box(0.4, 0.012, 0.012), grey, 0.24, y, s * 0.296);
      at(box(0.09, 0.03, 0.01), acc, 0.75, -0.04, z);
    }
    // anhedral swept wings with leading-edge armour, accent band, tip pods, nav lamps and a missile each
    const TH = 0.14, cT = Math.cos(TH), sT = Math.sin(TH);
    for (const s of BOTH) {
      const W = (pts) => pts.map(([x, zz]) => [x, s * zz]), rx = s * TH;
      const wp = (x, yl, zl) => [x, -0.06 + yl * cT - zl * sT, s * (yl * sT + zl * cT)];
      at(slab(W([[0.42, 0.2], [-0.42, 1.25], [-0.64, 1.31], [-0.8, 1.28], [-0.75, 0.2]]), 0.07, 0.025), body, 0, -0.06, 0, rx);
      at(slab(W([[0.47, 0.2], [-0.4, 1.25], [-0.47, 1.26], [0.34, 0.2]]), 0.082, 0.025), dark, 0, -0.06, 0, rx);
      at(slab(W([[-0.3, 1.06], [-0.4, 1.17], [-0.78, 1.17], [-0.77, 1.06]]), 0.076, 0.015), acc, 0, -0.06, 0, rx);
      at(slab(W([[0.0, 0.5], [-0.2, 0.78], [-0.66, 0.78], [-0.68, 0.5]]), 0.076, 0.015), dark, 0, -0.06, 0, rx);
      at(box(0.012, 0.08, 0.7), blk, ...wp(-0.6, 0, 0.82), rx);
      at(cyl(0.04, 0.04, 0.44, 10), dark, ...wp(-0.56, 0, 1.31), rx, 0, PI / 2);
      at(cone(0.04, 0.12, 10), grey, ...wp(-0.28, 0, 1.31), rx, 0, -PI / 2);
      lamp(sph(0.028, 8, 6), s > 0 ? 0x3dff6a : 0xff2a1a, 6, ...wp(-0.36, 0.03, 1.31));
      lamp(sph(0.02, 8, 6), 0xffffff, 6, ...wp(-0.8, 0, 1.31));
      at(box(0.2, 0.07, 0.03), dark, ...wp(-0.28, -0.07, 0.8), rx);
      at(cyl(0.032, 0.032, 0.46, 8), lite, ...wp(-0.28, -0.135, 0.8), rx, 0, PI / 2);
      at(cone(0.032, 0.1, 8), acc, ...wp(0.0, -0.135, 0.8), rx, 0, -PI / 2);
      at(box(0.08, 0.11, 0.008), dark, ...wp(-0.47, -0.135, 0.8), rx);
      at(box(0.08, 0.008, 0.11), dark, ...wp(-0.47, -0.135, 0.8), rx);
    }
    // twin engine pods blended into the fuselage: intake mouth, accent band, grille, heat fins, bell, hot
    // disc, plume; a canted fin on each
    const flames = [], noz = [];
    [-1, 1].forEach((s, i) => {
      const z = s * 0.33, y = 0.01;
      at(side(hull([[-0.22, 0.06], [-0.55, 0.17], [-1.1, 0.2], [-1.46, 0.17]], [[-1.46, -0.14], [-1.1, -0.17], [-0.55, -0.15], [-0.22, -0.06]], 8), 0.34, 0.13), body, 0, 0, z);
      at(sph(0.1, 16, 10), blk, -0.27, 0.0, z, 0, 0, 0, 0.35, 1, 1.25);
      at(tor(0.1, 0.018, 20, 5), grey, -0.255, 0.0, z, 0, PI / 2, 0, 1.25, 1, 1);
      at(side([[-0.62, -0.035], [-1.38, -0.03], [-1.38, 0.02], [-0.62, 0.015]], 0.012, 0.004), acc, 0, 0, s * 0.502);
      for (let k = 0; k < 5; k++) at(box(0.022, 0.05, 0.012), blk, -0.9 - k * 0.045, 0.06, s * 0.5);
      at(box(0.006, 0.12, 0.006), blk, -0.75, 0.0, s * 0.503);
      for (let k = -1; k <= 1; k++) at(box(0.4, 0.045, 0.012), M.frame, -1.05, y + 0.205, z + k * 0.05);
      at(lathe('wbell', [[0.15, 0], [0.17, 0.03], [0.2, 0.22], [0.185, 0.24], [0.13, 0.05], [0.11, 0.03]], 20), M.frame, -1.45, y, z, 0, 0, PI / 2);
      at(tor(0.2, 0.02, 24, 5), acc, -1.47, y, z, 0, PI / 2, 0);
      at(cyl(0.125, 0.125, 0.02, 16), glow(hot, 4), -1.5, y, z, 0, 0, PI / 2);
      flames.push(K.mesh(plume(0.13, accent), flameMat(), 'flame' + i, -1.66, y, z, 0, 0, 0, B));
      noz.push(K.group('nozzle' + i, B, -1.69, y, z));
      at(side([[-0.78, 0], [-1.32, 0], [-1.56, 0.48], [-1.4, 0.51]], 0.04, 0.012), body, 0, y + 0.17, z, s * 0.3);
      at(side([[-1.35, 0.34], [-1.5, 0.34], [-1.56, 0.48], [-1.4, 0.51]], 0.046, 0.01), acc, 0, y + 0.17, z, s * 0.3);
      at(box(0.3, 0.01, 0.046), blk, -1.15, y + 0.17 + 0.2 * Math.cos(0.3), z + s * 0.2 * Math.sin(0.3), s * 0.3);
      lamp(sph(0.022, 8, 6), 0xff2a1a, 6, -1.49, y + 0.17 + 0.51 * Math.cos(0.3), z + s * 0.51 * Math.sin(0.3));
    });
    at(side([[-0.95, -0.12], [-1.35, -0.1], [-1.5, -0.33], [-1.36, -0.34]], 0.04, 0.012), dark);
    at(rbox(0.12, 0.18, 0.3, 0.04), blk, -1.49, 0.03, 0);
    lamp(sph(0.022, 8, 6), 0xffffff, 6, -1.52, 0.17, 0);
    lamp(sph(0.02, 8, 6), 0xff2a1a, 6, -0.3, 0.295, 0);
    // beam cannon under the nose: housing, barrel, glowing accelerator coils, muzzle
    at(side([[0.2, -0.16], [1.15, -0.1], [1.28, -0.18], [1.2, -0.33], [0.32, -0.33]], 0.22, 0.05), dark);
    at(side([[0.5, -0.2], [1.1, -0.18], [1.15, -0.25], [0.55, -0.28]], 0.235, 0.02), grey);
    at(cyl(0.032, 0.032, 0.6, 10), M.steel, 1.45, -0.26, 0, 0, 0, PI / 2);
    for (const x of [1.3, 1.42, 1.54]) at(tor(0.052, 0.014, 14, 5), glow(hot, 3.5), x, -0.26, 0, 0, PI / 2, 0);
    at(cyl(0.05, 0.045, 0.08, 12), blk, 1.72, -0.26, 0, 0, 0, PI / 2);
    K.group('gun', B, 1.77, -0.26, 0);
    K.build();
    return K.root;
  });
  return { g, bank: by(g, 'bank'), flames: [by(g, 'flame0'), by(g, 'flame1')], nozzleL: by(g, 'nozzle0'), nozzleR: by(g, 'nozzle1'), canopy: by(g, 'canopy'), gun: by(g, 'gun'), lamps: by(g, 'lamps') };
}

// ------------------------------------------------------------------ LIFTER (settler-snatcher)
// 2.4 m saucer: bevelled armour petals on the top, a caged core lamp, a rim of green/amber lamps, an emitter
// dish underneath (beam points -y) and three folding claw legs. legs[i].rotation.z: 0 = open, ~0.55 = shut
// round a settler hanging under the dish.
export function lifter() {
  const g = make('lifter', () => {
    const K = new Kit();
    const R = K.root, L = K.group('lamps');
    const hull = paint(0x4b553d, 0.42, 0.55), hull2 = paint(0x2f3529, 0.45, 0.6), bone = paint(0xbdb08a, 0.4, 0.3), amb = paint(0xd99a26, 0.4, 0.35), lg = paint(0x8a9097, 0.28, 0.8), blk = M.black;
    const at = atK(K, R);
    const topP = (t) => [0.3 + 0.86 * t, 0.255 - 0.215 * Math.pow(t, 1.5)];
    const prof = [[0, -0.2], [0.3, -0.2], [0.65, -0.15], [0.98, -0.09], [1.16, -0.025], [1.2, 0.01]];
    for (const t of [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1, 0]) prof.push(topP(t));
    prof.push([0, 0.255]);
    at(lathe('lfhull', prof, 32), hull2);
    for (let k = 0; k < 8; k++) {
      const p0 = k * PI / 4 + 0.035, p1 = (k + 1) * PI / 4 - 0.035;
      at(revPatch('lfp' + k, topP, 0.06, 0.92, p0, p1, 0.03, 2, 4, 0.03), k % 2 ? hull : bone);
      const a = (p0 + p1) / 2, [r, y] = topP(0.62);
      if (k % 2) at(rbox(0.16, 0.05, 0.1, 0.015), hull2, r * Math.cos(a), y + 0.05, r * Math.sin(a), 0, -a, 0);
      else for (let j = 0; j < 3; j++) at(box(0.12, 0.012, 0.018), blk, r * Math.cos(a), y + 0.04, r * Math.sin(a) + (j - 1) * 0.03, 0, -a, 0);
    }
    at(tor(1.19, 0.035, 40, 5), lg, 0, 0.01, 0, PI / 2);
    at(cyl(1.15, 1.08, 0.05, 40), amb, 0, -0.05, 0);
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * TAU;
      if (k % 2) at(box(0.08, 0.05, 0.05), blk, 1.18 * Math.cos(a), -0.02, 1.18 * Math.sin(a), 0, -a, 0);
      else K.add(sph(0.032, 6, 4), glow(k % 4 ? 0xffb030 : 0x46ff1e, 5), 1.215 * Math.cos(a), 0.012, 1.215 * Math.sin(a), 0, 0, 0, 1, 1, 1, L);
    }
    // caged core on top
    at(cyl(0.3, 0.33, 0.08, 28), hull2, 0, 0.29, 0);
    at(tor(0.21, 0.02, 24, 6), lg, 0, 0.33, 0, PI / 2);
    for (let k = 0; k < 4; k++) at(arcT(0.21, 0.016, PI, 10, 4), lg, 0, 0.33, 0, 0, k * PI / 4, 0);
    at(sph(0.04, 10, 8), lg, 0, 0.545, 0);
    const coreM = glowM(0x46ff1e, 3, 'lifterCore');
    K.mesh(sph(0.15, 14, 10), coreM, 'core', 0, 0.42, 0);
    // underside hub, thrusters and the emitter dish
    at(lathe('lfhub', [[0.18, -0.36], [0.22, -0.3], [0.3, -0.22], [0.34, -0.19]], 18), hull2);
    for (let k = 0; k < 3; k++) { const a = (90 + k * 120) * D2R; at(cyl(0.07, 0.07, 0.02, 12), glow(0xffb030, 4), 0.86 * Math.cos(a), -0.135, 0.86 * Math.sin(a)); }
    const D = K.group('dish', R, 0, -0.36, 0);
    K.add(lathe('lfdish', [[0, 0], [0.12, -0.02], [0.22, -0.06], [0.25, -0.08]], 18), bone, 0, 0, 0, 0, 0, 0, 1, 1, 1, D);
    K.add(lathe('lfdishb', [[0.25, -0.08], [0.2, -0.02], [0.08, 0.01]], 18), hull2, 0, 0, 0, 0, 0, 0, 1, 1, 1, D);
    K.add(tor(0.25, 0.018, 24, 5), lg, 0, -0.08, 0, PI / 2, 0, 0, 1, 1, 1, D);
    K.add(tor(0.16, 0.012, 24, 4), glow(0x8aff5a, 4), 0, -0.05, 0, PI / 2, 0, 0, 1, 1, 1, D);
    for (let k = 0; k < 3; k++) { const a = (90 + k * 120) * D2R; K.rod(lg, 0.24 * Math.cos(a), -0.08, 0.24 * Math.sin(a), 0.03 * Math.cos(a), -0.2, 0.03 * Math.sin(a), 0.01, D, 5); }
    K.add(sph(0.045, 10, 8), glow(0xc8ffb0, 6), 0, -0.21, 0, 0, 0, 0, 1, 1, 1, D);
    // three claw legs (outward = local -x, hinge about local z)
    const legs = [];
    [30, 150, 270].forEach((deg, i) => {
      const f = deg * D2R;
      const mount = K.group('legmount' + i, R, 0.62 * Math.cos(f), -0.16, 0.62 * Math.sin(f));
      mount.rotation.y = PI - f;
      const Lg = K.group('leg' + i, mount);
      const la = atK(K, Lg);
      la(cyl(0.065, 0.065, 0.18, 12), lg, 0, 0, 0, PI / 2);
      la(side([[0.06, 0.06], [-0.58, -0.22], [-0.66, -0.36], [0.03, -0.08]], 0.11, 0.03), hull);
      la(side([[-0.1, -0.02], [-0.5, -0.2], [-0.52, -0.25], [-0.12, -0.07]], 0.12, 0.01), amb);
      la(cyl(0.055, 0.055, 0.15, 12), amb, -0.62, -0.3, 0, PI / 2);
      la(side([[-0.68, -0.26], [-0.62, -0.66], [-0.46, -0.98], [-0.3, -1.12], [-0.38, -0.96], [-0.52, -0.68], [-0.56, -0.32]], 0.085, 0.025), bone);
      la(cone(0.028, 0.13, 8), lg, -0.27, -1.15, 0, 0, 0, -0.9);
      K.rod(lg, -0.06, -0.1, 0, -0.52, -0.56, 0, 0.02, Lg, 8);
      la(box(0.04, 0.2, 0.09), hull2, -0.6, -0.55, 0, 0, 0, -0.2);
      legs.push(Lg);
    });
    K.build();
    return K.root;
  });
  return { g, legs: [by(g, 'leg0'), by(g, 'leg1'), by(g, 'leg2')], dish: by(g, 'dish'), core: by(g, 'core'), lamps: by(g, 'lamps') };
}

// ------------------------------------------------------------------ HUSK (a lifter fused with its captive)
// 2.0 m: a torn, charred shell with red-hot gashes (the captive's pod and a hot core show through), fused
// armour scraps, a broken rim, mandible claws forward and a spray of spikes (spikes = Group, jitter it).
function holed(key, r, detail, seed, amp, cut, sx, sy, sz) {
  return geo(key, () => {
    const src = new THREE.IcosahedronGeometry(1, detail), p = src.attributes.position, P = [];
    const d = (x, y, z) => { const l = Math.hypot(x, y, z), k = 1 + amp * (fbm3(x * 2.2 + seed, y * 2.2, z * 2.2 - seed, 3) - 0.5) * 2.4; return [x / l * k * r * sx, y / l * k * r * sy, z / l * k * r * sz]; };
    for (let f = 0; f < p.count / 3; f++) {
      const T = [0, 1, 2].map((j) => [p.getX(f * 3 + j), p.getY(f * 3 + j), p.getZ(f * 3 + j)]);
      const cx = (T[0][0] + T[1][0] + T[2][0]) / 3, cy = (T[0][1] + T[1][1] + T[2][1]) / 3, cz = (T[0][2] + T[1][2] + T[2][2]) / 3;
      if (fbm3(cx * 1.7 + 11, cy * 1.7 - seed, cz * 1.7, 2) > cut) continue;
      const Q = T.map((q) => d(...q));
      P.push(...Q[0], ...Q[1], ...Q[2]);
      P.push(...Q[0].map((c) => c * 0.88), ...Q[2].map((c) => c * 0.88), ...Q[1].map((c) => c * 0.88));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(P.length / 3 * 2), 2));
    return smooth(g, 40);
  });
}
export function husk() {
  const g = make('husk', () => {
    const K = new Kit();
    const R = K.root, S = K.group('spikes');
    const char = paint(0x2b201c, 0.5, 0.6), scorch = paint(0x3f4334, 0.5, 0.55), bone = paint(0x8a7c60, 0.45, 0.35), suit = paint(0xd8d2c4, 0.4, 0.2), visor = paint(0xc89a3a, 0.12, 0.9), dk = paint(0x17120f, 0.45, 0.6);
    const at = atK(K, R), r = rng(23);
    at(holed('hkshell', 0.6, 3, 7, 0.32, 0.55, 1.25, 0.86, 0.95), char);
    const coreM = glowM(0xff4a14, 3.6, 'huskCore');
    K.mesh(sph(0.27, 20, 14), coreM, 'core', -0.14, 0.02, 0);
    at(sph(0.42, 16, 10), glow(0xff2a08, 1.2), -0.1, 0, 0, 0, 0, 0, 1.2, 0.85, 1);
    at(cap(0.07, 0.16, 10), suit, 0.14, -0.02, 0);
    at(sph(0.065, 12, 8), suit, 0.14, 0.15, 0);
    at(sph(0.05, 12, 8), visor, 0.18, 0.155, 0, 0, 0, 0, 0.8, 0.7, 1);
    at(tor(0.15, 0.015, 20, 4), glow(0xff7a2a, 4), 0.14, 0.04, 0, 0, PI / 2, 0.3);
    // gashes and fused armour scraps on the shell surface
    for (let k = 0; k < 18; k++) {
      const n = v3(r() * 2 - 1, r() * 2 - 1, (r() * 2 - 1) * 1.2).normalize(), p = n.clone().multiply(v3(0.68, 0.47, 0.53));
      at(box(0.025 + r() * 0.02, 0.05, 0.14 + r() * 0.22), glow(k % 3 ? 0xff4a14 : 0xffa040, 3 + r() * 2), p.x, p.y, p.z, ...orient(n, r() * PI));
    }
    for (let k = 0; k < 7; k++) {
      const n = v3(r() * 2 - 1, r() * 1.4 - 0.4, (r() * 2 - 1)).normalize(), p = n.clone().multiply(v3(0.74, 0.52, 0.58));
      at(rbox(0.26 + r() * 0.16, 0.04, 0.16 + r() * 0.12, 0.012), k % 2 ? scorch : dk, p.x, p.y, p.z, ...orient(n, r() * PI));
    }
    at(arcT(0.82, 0.045, 3.6, 28, 6), scorch, -0.1, -0.08, 0, 1.25, 0.45, 0.3);
    at(arcT(0.86, 0.02, 3.2, 28, 4), glow(0xff6a20, 3), -0.1, -0.08, 0, 1.25, 0.45, 0.3, 1.0, 1.0, 1.0);
    // mandibles from the old claws
    for (const s of BOTH) {
      at(side([[0.55, 0.05], [0.95, 0.02], [1.12, -0.16], [1.04, -0.3], [0.9, -0.12], [0.55, -0.12]], 0.07, 0.02), bone, 0, -0.04, s * 0.24, 0, s * -0.15, s * 0.05);
      at(cone(0.022, 0.12, 6), paint(0x9a9a9a, 0.3, 0.8), 1.07, -0.37, s * 0.27, 0, 0, PI + 0.4);
      at(sph(0.035, 8, 6), glow(0xff2a10, 6), 0.68, 0.13, s * 0.27);
    }
    at(cone(0.09, 0.26, 10), dk, -0.85, 0.0, 0, 0, 0, PI / 2);
    at(sph(0.07, 10, 8), glow(0xff5a20, 5), -0.98, 0, 0);
    // spikes: asymmetric, raked back and up
    for (let k = 0; k < 16; k++) {
      const n = v3(r() * 1.6 - 1.1, r() * 1.8 - 0.6, (r() * 2 - 1) * 1.1).normalize(), p = n.clone().multiply(v3(0.7, 0.48, 0.55)), L = 0.22 + r() * 0.5;
      K.add(cone(0.03 + r() * 0.03, L, 6), k % 4 ? dk : bone, p.x + n.x * L * 0.45, p.y + n.y * L * 0.45, p.z + n.z * L * 0.45, ...orient(n), 1, 1, 1, S);
    }
    K.build();
    return K.root;
  });
  return { g, core: by(g, 'core'), spikes: by(g, 'spikes') };
}

// ------------------------------------------------------------------ SOWER (mine-layer)
// 3.0 m manta: humped body, anhedral wings with bone ridges, cephalic horns, tail spine, gill lamps. The belly
// bay holds three racked mines behind a door: bay.rotation.z 0 = shut .. ~1.1 = open (the rear edge drops).
export function sower() {
  const g = make('sower', () => {
    const K = new Kit();
    const R = K.root, L = K.group('lamps');
    const plum = paint(0x3d2f4a, 0.36, 0.5), plum2 = paint(0x281f31, 0.4, 0.55), bone = paint(0xbfb295, 0.4, 0.3), amb = paint(0xd49030, 0.4, 0.35), lg = paint(0x8a8f96, 0.28, 0.85), blk = M.black;
    const at = atK(K, R);
    at(side(hull([[1.3, 0.0], [1.0, 0.16], [0.4, 0.3], [-0.4, 0.3], [-1.0, 0.18], [-1.35, 0.06]], [[-1.35, -0.04], [-0.8, -0.2], [0.4, -0.22], [1.1, -0.1]], 12), 0.9, 0.16), plum);
    at(side([...crv([[1.05, 0.12], [0.4, 0.33], [-0.4, 0.33], [-1.05, 0.17]], 10), [-1.05, 0.05], [1.05, 0.03]], 0.4, 0.08), plum2);
    for (let k = 0; k < 6; k++) at(rbox(0.16, 0.06, 0.14, 0.025), bone, 0.6 - k * 0.27, yAt(crv([[1.05, 0.12], [0.4, 0.33], [-0.4, 0.33], [-1.05, 0.17]], 10), 0.6 - k * 0.27) + 0.02, 0, 0, 0, 0.12);
    for (const s of BOTH) {
      const W = (pts) => pts.map(([x, zz]) => [x, s * zz]), rx = s * 0.3, c = Math.cos(0.3), sn = Math.sin(0.3);
      const wp = (x, yl, zl) => [x, 0.02 + yl * c - zl * sn, s * (yl * sn + zl * c)];
      at(slab(W([[0.8, 0.3], [0.25, 0.95], [-0.25, 1.32], [-0.5, 1.3], [-0.62, 1.0], [-1.0, 0.36]]), 0.1, 0.035), plum, 0, 0.02, 0, rx);
      at(slab(W([[0.82, 0.3], [0.27, 0.95], [-0.23, 1.32], [-0.3, 1.33], [0.18, 0.95], [0.7, 0.3]]), 0.11, 0.03), plum2, 0, 0.02, 0, rx);
      for (const [x0, z0, x1, z1] of [[0.3, 0.45, -0.3, 1.15], [0.0, 0.4, -0.5, 1.0], [-0.3, 0.38, -0.7, 0.8]]) {
        const a = wp(x0, 0.06, z0), b = wp(x1, 0.06, z1);
        K.rod(bone, a[0], a[1], a[2], b[0], b[1], b[2], 0.022, R, 6);
      }
      K.add(sph(0.04, 8, 6), glow(0xffa030, 5), ...wp(-0.35, -0.04, 1.22), 0, 0, 0, 1, 1, 1, L);
      K.add(sph(0.03, 8, 6), glow(0x7dff5a, 5), ...wp(0.1, -0.05, 0.75), 0, 0, 0, 1, 1, 1, L);
      at(side([[1.0, 0.05], [1.35, 0.0], [1.55, -0.12], [1.5, -0.2], [1.3, -0.1], [1.0, -0.08]], 0.08, 0.025), bone, 0, 0, s * 0.3);
      at(sph(0.055, 12, 8), glow(0xffb030, 5), 1.02, 0.08, s * 0.42);
      at(tor(0.06, 0.012, 12, 4), lg, 1.02, 0.08, s * 0.44);
      for (let k = 0; k < 4; k++) at(box(0.02, 0.1 - k * 0.012, 0.012), glow(0xff8a30, 2.2), 0.55 - k * 0.07, -0.02, s * 0.45);
      at(side([[0.3, -0.1], [-0.5, -0.1], [-0.55, -0.04], [0.25, -0.04]], 0.012, 0.004), amb, 0, 0, s * 0.452);
    }
    at(cone(0.06, 0.4, 8), bone, -1.48, 0.04, 0, 0, 0, PI / 2);
    at(side([[-1.0, 0.18], [-1.32, 0.12], [-1.45, 0.3], [-1.3, 0.32]], 0.04, 0.012), plum2);
    // belly bay: dark well, rack, three mines, amber light, hinged door
    at(rbox(0.95, 0.1, 0.56, 0.03), blk, -0.02, -0.2, 0);
    at(box(0.9, 0.03, 0.03), lg, -0.02, -0.2, 0);
    at(box(0.8, 0.012, 0.02), glow(0xffa030, 3), -0.02, -0.2, 0.25);
    for (const x of [0.28, -0.02, -0.32]) {
      at(sph(0.08, 12, 8), paint(0x2b2d33, 0.38, 0.7), x, -0.27, 0);
      for (let k = 0; k < 6; k++) { const a = k * PI / 3; at(cone(0.018, 0.07, 5), lg, x + 0.09 * Math.cos(a), -0.27, 0.09 * Math.sin(a), PI / 2, 0, -a - PI / 2); }
      at(sph(0.022, 6, 4), glow(0xff3a2a, 5), x, -0.2, 0.06);
    }
    const bay = K.group('bay', R, 0.44, -0.27, 0);
    K.add(rbox(0.96, 0.04, 0.6, 0.015), plum2, -0.48, -0.02, 0, 0, 0, 0, 1, 1, 1, bay);
    for (const x of [-0.2, -0.48, -0.76]) K.add(box(0.03, 0.03, 0.56), bone, x, -0.05, 0, 0, 0, 0, 1, 1, 1, bay);
    K.add(sph(0.02, 6, 4), glow(0xffb030, 5), -0.92, -0.04, 0.25, 0, 0, 0, 1, 1, 1, bay);
    K.add(sph(0.02, 6, 4), glow(0xffb030, 5), -0.92, -0.04, -0.25, 0, 0, 0, 1, 1, 1, bay);
    K.build();
    return K.root;
  });
  return { g, bay: by(g, 'bay'), lamps: by(g, 'lamps') };
}

// ------------------------------------------------------------------ MINE
export function mine() {
  const g = make('mine', () => {
    const K = new Kit();
    const dk = paint(0x2b2d33, 0.36, 0.7), red = paint(0x8a1a16, 0.4, 0.4), lg = paint(0x9aa0a8, 0.25, 0.9);
    K.add(sph(0.15, 22, 14), dk);
    K.add(tor(0.152, 0.024, 30, 6), red, 0, 0, 0, PI / 2);
    K.add(tor(0.157, 0.007, 30, 4), glow(0xff3a2a, 3), 0, 0.03, 0, PI / 2);
    K.add(tor(0.157, 0.007, 30, 4), glow(0xff3a2a, 3), 0, -0.03, 0, PI / 2);
    const ph = (1 + Math.sqrt(5)) / 2;
    const dirs = [];
    for (const a of [-1, 1]) for (const b of [-1, 1]) dirs.push(v3(0, a, b * ph), v3(a, b * ph, 0), v3(b * ph, 0, a));
    for (const d of dirs) {
      d.normalize();
      K.add(cyl(0.032, 0.04, 0.04, 8), red, ...d.clone().multiplyScalar(0.15).toArray(), ...orient(d));
      K.add(cone(0.026, 0.16, 8), lg, ...d.clone().multiplyScalar(0.24).toArray(), ...orient(d));
    }
    K.add(cyl(0.05, 0.06, 0.04, 12), red, 0, 0.15, 0);
    K.mesh(sph(0.042, 12, 8), glowM(0xff3020, 6, 'mineLamp'), 'lamp', 0, 0.18, 0);
    K.build();
    return K.root;
  });
  return { g, lamp: by(g, 'lamp') };
}

// ------------------------------------------------------------------ STINGER (and its parts for the hive)
function stingerBody(K, P, wings, lite = false) {
  const blk = paint(0x1d1b20, 0.3, 0.7), org = paint(0xe0701c, 0.38, 0.4), lg = paint(0xa8adb4, 0.25, 0.9);
  const at = atK(K, P);
  at(side(hull([[0.36, 0.0], [0.15, 0.06], [-0.15, 0.07], [-0.38, 0.04]], [[-0.38, -0.035], [-0.1, -0.065], [0.2, -0.04], [0.34, -0.01]], lite ? 4 : 8), 0.12, lite ? 0.02 : 0.04), blk);
  if (lite) { at(cone(0.022, 0.18, 5), lg, 0.44, 0, 0, 0, 0, -PI / 2); for (const s of BOTH) K.add(slab([[0.08, s * 0.04], [-0.2, s * 0.36], [-0.29, s * 0.37], [-0.22, s * 0.04]], 0.02, 0.004), org, 0, 0, 0, -s * 0.35, 0, 0, 1, 1, 1, P); return; }
  at(side([...crv([[0.25, 0.045], [-0.1, 0.075], [-0.3, 0.055]], 6), [-0.3, 0.02], [0.25, 0.02]], 0.06, 0.02), org);
  at(cone(0.022, 0.18, 8), lg, 0.44, 0, 0, 0, 0, -PI / 2);
  for (const s of BOTH) at(sph(0.02, 8, 6), glow(0xffd040, 6), 0.2, 0.025, s * 0.048);
  at(side([[-0.05, 0.05], [-0.28, 0.05], [-0.38, 0.17], [-0.3, 0.17]], 0.02, 0.006), org);
  at(cyl(0.035, 0.045, 0.06, 10), blk, -0.4, 0, 0, 0, 0, PI / 2);
  at(cyl(0.03, 0.03, 0.012, 10), glow(0xffa040, 5), -0.433, 0, 0, 0, 0, PI / 2);
  [1, -1].forEach((s, i) => {
    const Wp = wings ? wings[i] : P, W = (pts) => pts.map(([x, z]) => [x, s * z]);
    K.add(slab(W([[0.08, 0.04], [-0.2, 0.36], [-0.29, 0.37], [-0.22, 0.04]]), 0.02, 0.006), org, 0, 0, 0, -s * 0.35, 0, 0, 1, 1, 1, Wp);
    K.add(slab(W([[0.09, 0.04], [-0.19, 0.36], [-0.22, 0.365], [0.04, 0.04]]), 0.024, 0.006), blk, 0, 0, 0, -s * 0.35, 0, 0, 1, 1, 1, Wp);
  });
}
// 0.9 m dart. wings[0] is +z, wings[1] is -z: flap with wings[0].rotation.x = -f, wings[1].rotation.x = +f
export function stinger() {
  const g = make('stinger', () => {
    const K = new Kit();
    const w0 = K.group('wing0'), w1 = K.group('wing1');
    stingerBody(K, K.root, [w0, w1]);
    K.build();
    return K.root;
  });
  return { g, wings: [by(g, 'wing0'), by(g, 'wing1')] };
}

// ------------------------------------------------------------------ SKIMMER: a 1.4 m chrome manta with glowing edges
export function skimmer() {
  const g = make('skimmer', () => {
    const K = new Kit(), S = 1.5, P = (pts) => pts.map(([x, z]) => [x * S, z * S]);
    const dk = paint(0x1a2230, 0.28, 0.85), tr = paint(0x2a6f86, 0.32, 0.6);
    K.add(slab(P([[0.5, 0], [0.04, 0.44], [-0.34, 0.2], [-0.22, 0], [-0.34, -0.2], [0.04, -0.44]]), 0.11, 0.025), dk);
    K.add(slab(P([[0.44, 0], [0.06, 0.26], [-0.18, 0.09], [-0.18, -0.09], [0.06, -0.26]]), 0.17, 0.03), tr, 0, 0.02, 0);
    for (const s of BOTH) K.add(slab(P([[0.04, s * 0.44], [-0.34, s * 0.2], [-0.29, s * 0.18], [0.03, s * 0.39]]), 0.13, 0.008), glow(0x5ef0ff, 4));
    K.mesh(sph(0.15, 16, 10), glowM(0x8af8ff, 6, 'skimCore'), 'core', 0.12, 0.1, 0);
    K.add(cyl(0.08, 0.11, 0.1, 12), glow(0x5ef0ff, 5), -0.36, 0, 0, 0, 0, PI / 2);
    K.build();
    return K.root;
  });
  return { g, core: by(g, 'core') };
}

// ------------------------------------------------------------------ HIVE (carrier egg)
// 2.6 m egg along x: bone caps and hoops, ribbed frame, translucent amber panes (the shell Group) with five
// stingers packed inside (inner) round a pulsing core at the back.
export function hive() {
  const g = make('hive', () => {
    const K = new Kit();
    const R = K.root, SH = K.group('shell'), IN = K.group('inner'), L = K.group('lamps');
    const bone = paint(0xc8b48a, 0.42, 0.25), bone2 = paint(0x5a4a3a, 0.45, 0.4), dk = paint(0x3a2c2a, 0.4, 0.55), lg = paint(0x8a8f96, 0.28, 0.85);
    const rr = (u) => 0.74 * Math.sqrt(Math.max(0, 1 - u * u)) * (1 - 0.16 * u);
    const egg = (u0, u1, k, n = 8) => { const out = []; for (let i = 0; i <= n; i++) { const u = u0 + (u1 - u0) * i / n; out.push([rr(u) * k, u * 1.3]); } return out; };
    K.add(lathe('hvcapR', egg(-1, -0.7, 1.03), 22), bone, 0, 0, 0, 0, 0, -PI / 2, 1, 1, 1, SH);
    K.add(lathe('hvcapN', egg(0.72, 1, 1.03), 22), bone, 0, 0, 0, 0, 0, -PI / 2, 1, 1, 1, SH);
    for (const u of [-0.7, 0.0, 0.72]) K.add(tor(rr(u) * 1.03, u ? 0.045 : 0.03, 28, 5), bone, u * 1.3, 0, 0, 0, PI / 2, 0, 1, 1, 1, SH);
    for (let k = 0; k < 4; k++) {
      const a = k * PI / 2 + PI / 4, pts = [];
      for (let i = 0; i <= 16; i++) { const u = -0.8 + 1.6 * i / 16, r = rr(u) * 1.035; pts.push(v3(u * 1.3, r * Math.cos(a), r * Math.sin(a))); }
      K.add(geo('hvrib' + k, () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 18, 0.03, 5)), bone2, 0, 0, 0, 0, 0, 0, 1, 1, 1, SH);
    }
    const pane = new THREE.MeshStandardMaterial({ color: 0xd06a18, emissive: 0x7a2a04, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.42, depthWrite: false, envMap: M.env, envMapIntensity: 2 });
    pane.name = 'hivePane';
    K.mesh(lathe('hvpane', egg(-0.75, 0.75, 1.0, 14), 26), pane, 'panes', 0, 0, 0, 0, 0, -PI / 2, SH);
    for (let k = 0; k < 8; k++) { const a = k * PI / 4; K.add(sph(0.03, 8, 6), glow(0xffa030, 5), 0, rr(0) * 1.07 * Math.cos(a), rr(0) * 1.07 * Math.sin(a), 0, 0, 0, 1, 1, 1, L); }
    // rear jets and a nose sensor
    for (let k = 0; k < 3; k++) { const a = k * TAU / 3 + PI / 2; K.add(lathe('hvjet', [[0.05, 0], [0.07, 0.1], [0.06, 0.11], [0.04, 0.02]], 12), dk, -1.25, 0.16 * Math.cos(a), 0.16 * Math.sin(a), 0, 0, PI / 2, 1, 1, 1, SH); K.add(cyl(0.04, 0.04, 0.01, 10), glow(0xff8a40, 5), -1.3, 0.16 * Math.cos(a), 0.16 * Math.sin(a), 0, 0, PI / 2, 1, 1, 1, SH); }
    K.add(sph(0.05, 12, 8), glow(0xffc060, 6), 1.31, 0, 0, 0, 0, 0, 1, 1, 1, SH);
    K.add(tor(0.07, 0.015, 14, 4), lg, 1.29, 0, 0, 0, PI / 2, 0, 1, 1, 1, SH);
    // inside: rack, five stingers, core
    K.add(cyl(0.05, 0.05, 1.6, 10), dk, -0.1, 0, 0, 0, 0, PI / 2, 1, 1, 1, IN);
    const slots = [[0.05, 0, 0], ...[45, 135, 225, 315].map((d) => [-0.05, 0.33 * Math.cos(d * D2R), 0.33 * Math.sin(d * D2R)])];
    for (const [x, y, z] of slots) { K.xf = mat4(x + 0.05, y, z, 0, 0, 0, 0.84); stingerBody(K, IN, null, true); K.xf = null; }
    K.mesh(sph(0.2, 12, 8), glowM(0xff7a3a, 3.4, 'hiveCore'), 'core', -0.82, 0, 0, 0, 0, 0, IN);
    K.build();
    return K.root;
  });
  return { g, shell: by(g, 'shell'), inner: by(g, 'inner'), core: by(g, 'core'), lamps: by(g, 'lamps') };
}

// ------------------------------------------------------------------ PROWLER (the hunter)
// 3.2 m long and thin, black with oxblood panels, forward canards, swept blades, twin canted tail fins and a
// red lamp strip down both flanks (strip: its own mesh and material, pulse its colour or scale).
export function prowler() {
  const g = make('prowler', () => {
    const K = new Kit();
    const R = K.root, L = K.group('lamps');
    const bk = paint(0x15171c, 0.28, 0.75), ox = paint(0x5a1218, 0.32, 0.5), gm = paint(0x3a3e46, 0.32, 0.8), lg = paint(0x9aa0a8, 0.24, 0.9), blk = M.black;
    const at = atK(K, R);
    const top = [[1.62, 0], [1.1, 0.08], [0.3, 0.16], [-0.5, 0.18], [-1.3, 0.14], [-1.55, 0.1]], bot = [[-1.55, -0.07], [-0.8, -0.14], [0.4, -0.12], [1.2, -0.05]];
    at(side(hull(top, bot, 14), 0.4, 0.08), bk);
    at(side([...crv([[1.0, 0.09], [0.3, 0.185], [-0.5, 0.205], [-1.25, 0.16]], 10), [-1.25, 0.06], [1.0, 0.03]], 0.22, 0.05), ox);
    at(sph(0.2, 18, 10), M.glass, 0.55, 0.12, 0, 0, 0, 0, 1.9, 0.35, 0.45);
    at(cone(0.02, 0.18, 6), lg, 1.66, 0, 0, 0, 0, -PI / 2);
    for (const s of BOTH) {
      const W = (pts) => pts.map(([x, z]) => [x, s * z]);
      at(slab(W([[0.0, 0.18], [-0.45, 0.95], [-0.62, 0.98], [-0.72, 0.18]]), 0.04, 0.012), bk, 0, -0.03, 0, s * 0.18);
      at(slab(W([[0.02, 0.18], [-0.43, 0.95], [-0.48, 0.96], [-0.08, 0.18]]), 0.046, 0.012), ox, 0, -0.03, 0, s * 0.18);
      at(slab(W([[1.0, 0.1], [0.85, 0.42], [0.78, 0.42], [0.82, 0.1]]), 0.03, 0.01), gm, 0, 0.02, 0, -s * 0.1);
      at(side([[-0.9, 0.0], [-1.45, 0.0], [-1.72, 0.72], [-1.5, 0.75]], 0.04, 0.012), bk, 0, 0.1, s * 0.16, s * 0.28);
      at(side([[-1.45, 0.5], [-1.62, 0.5], [-1.72, 0.72], [-1.5, 0.75]], 0.046, 0.01), ox, 0, 0.1, s * 0.16, s * 0.28);
      K.add(sph(0.022, 8, 6), glow(0xff2030, 6), -1.6, 0.1 + 0.74 * Math.cos(0.28), s * (0.16 + 0.74 * Math.sin(0.28)), 0, 0, 0, 1, 1, 1, L);
      for (const x of [0.6, -0.1, -0.8]) at(box(0.008, 0.12, 0.006), blk, x, 0.02, s * 0.202);
      at(box(0.3, 0.05, 0.02), gm, -1.1, -0.06, s * 0.2);
      at(side([[1.25, 0.0], [1.1, 0.03], [0.95, 0.03], [1.1, 0.0]], 0.012, 0.003), glow(0xff2030, 5), 0, 0.02, s * 0.15);
    }
    at(cyl(0.09, 0.11, 0.3, 14), gm, -1.6, 0.02, 0, 0, 0, PI / 2);
    at(cyl(0.075, 0.075, 0.01, 14), glow(0xff6a5a, 5), -1.755, 0.02, 0, 0, 0, PI / 2);
    at(tor(0.1, 0.014, 16, 4), lg, -1.72, 0.02, 0, 0, PI / 2, 0);
    at(side([[0.3, -0.1], [-0.4, -0.12], [-0.55, -0.26], [-0.45, -0.27]], 0.03, 0.01), bk);
    K.mesh(combo('prstrip', [[box(1.9, 0.022, 0.012), -0.05, 0.03, 0.202], [box(1.9, 0.022, 0.012), -0.05, 0.03, -0.202]]), glowM(0xff2030, 4, 'prowlerStrip'), 'strip');
    K.build();
    return K.root;
  });
  return { g, strip: by(g, 'strip'), lamps: by(g, 'lamps') };
}

// ------------------------------------------------------------------ SETTLER
// 0.9 m colonist in an environment suit, feet at y = 0, facing +x. Limbs are Groups pivoting at the hips
// and shoulders: rotation.z swings them forward (+) / back (-) in the side view.
export function settler(suitColor = 0xe8e2d6) {
  const g = make('settler' + suitColor, () => {
    const K = new Kit();
    const R = K.root;
    const suit = tint(suitColor, 'rough'), dk = tint(0x3a3e45, 'rough'), trim = tint(0xe07a26, 'rough'), visor = paint(0xd0a040, 0.08, 1.0), boot = tint(0x2a2c30, 'rough'), hel = paint(suitColor, 0.3, 0.2);
    const at = atK(K, R);
    at(rbox(0.22, 0.27, 0.26, 0.08), suit, 0, 0.57, 0);
    at(rbox(0.04, 0.16, 0.18, 0.02), trim, 0.1, 0.6, 0);
    at(rbox(0.19, 0.06, 0.23, 0.025), dk, 0, 0.43, 0);
    at(box(0.03, 0.03, 0.03), glow(0x6fe8ff, 4), 0.105, 0.52, 0.05);
    at(rbox(0.11, 0.24, 0.2, 0.03), dk, -0.15, 0.6, 0);
    at(cyl(0.035, 0.035, 0.18, 8), trim, -0.15, 0.6, 0, PI / 2);
    at(cyl(0.006, 0.006, 0.18, 4), dk, -0.17, 0.8, -0.07);
    at(sph(0.012, 6, 4), glow(0xff3a2a, 5), -0.17, 0.89, -0.07);
    at(cyl(0.07, 0.08, 0.04, 14), dk, 0, 0.72, 0);
    const H = K.group('head', R, 0, 0.74, 0);
    K.add(sph(0.1, 20, 14), hel, 0, 0.08, 0, 0, 0, 0, 1, 1, 1, H);
    K.add(geo('stvisor', () => new THREE.SphereGeometry(0.103, 16, 10, -PI * 0.38, PI * 0.76, PI * 0.28, PI * 0.36)), visor, 0, 0.08, 0, 0, PI, 0, 1, 1, 1, H);
    K.add(cyl(0.025, 0.025, 0.04, 8), paint(0x3a3e45, 0.4, 0.5), 0.04, 0.17, 0.065, PI / 2, 0, 0, 1, 1, 1, H);
    K.mesh(cyl(0.018, 0.018, 0.01, 10), glowM(0xfff2c8, 7, 'settlerLamp'), 'lamp', 0.06, 0.17, 0.075, 0, 0, PI / 2, H);
    for (const s of BOTH) {
      const Lg = K.group(s > 0 ? 'legR' : 'legL', R, 0, 0.43, s * 0.07);
      K.add(cap(0.058, 0.13, 8), suit, 0, -0.1, 0, 0, 0, 0, 1, 1, 1, Lg);
      K.add(sph(0.05, 10, 8), dk, 0, -0.21, 0, 0, 0, 0, 1, 1, 1, Lg);
      K.add(cap(0.052, 0.12, 8), suit, 0, -0.3, 0, 0, 0, 0, 1, 1, 1, Lg);
      K.add(rbox(0.15, 0.07, 0.1, 0.025), boot, 0.025, -0.395, 0, 0, 0, 0, 1, 1, 1, Lg);
      const Ar = K.group(s > 0 ? 'armR' : 'armL', R, 0, 0.67, s * 0.16);
      K.add(sph(0.05, 10, 8), suit, 0, 0, 0, 0, 0, 0, 1, 1, 1, Ar);
      K.add(cap(0.046, 0.11, 8), suit, 0, -0.1, 0, 0, 0, 0, 1, 1, 1, Ar);
      K.add(cap(0.042, 0.1, 8), suit, 0, -0.22, 0, 0, 0, 0, 1, 1, 1, Ar);
      K.add(box(0.06, 0.03, 0.07), trim, 0, -0.2, 0, 0, 0, 0, 1, 1, 1, Ar);
      K.add(sph(0.04, 10, 8), dk, 0, -0.3, 0, 0, 0, 0, 1, 1, 1, Ar);
    }
    K.build();
    return K.root;
  });
  return { g, legL: by(g, 'legL'), legR: by(g, 'legR'), armL: by(g, 'armL'), armR: by(g, 'armR'), head: by(g, 'head'), lamp: by(g, 'lamp') };
}

// ------------------------------------------------------------------ POWER POD
// 0.9 m armoured capsule lying along x: chrome caps, armour slats over a glowing core band, fins
export function pod(color = 0x5dd0ff) {
  const g = make('pod' + color, () => {
    const K = new Kit();
    const dk = paint(0x2a2e35, 0.38, 0.7), arm = paint(0xc0c5cc, 0.24, 0.85);
    const capP = [[0.27, 0], [0.27, 0.05], [0.24, 0.14], [0.15, 0.21], [0, 0.235]];
    K.add(lathe('podcap2', capP, 24), arm, 0.2, 0, 0, 0, 0, -PI / 2);
    K.add(lathe('podcap2', capP, 24), arm, -0.2, 0, 0, 0, 0, PI / 2);
    for (const x of [-0.21, 0.21]) K.add(tor(0.275, 0.028, 28, 6), M.steel, x, 0, 0, 0, PI / 2, 0);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + PI / 6; K.add(rbox(0.44, 0.05, 0.15, 0.02), dk, 0, 0.265 * Math.cos(a), 0.265 * Math.sin(a), a, 0, 0); }
    for (const s of BOTH) {
      K.add(sph(0.045, 10, 8), glow(color, 5), s * 0.44, 0, 0);
      for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + PI / 4; K.add(side([[0, 0], [0.1, 0], [0.04, 0.12], [-0.02, 0.12]], 0.02, 0.006), dk, s * 0.3, 0.2 * Math.cos(a), 0.2 * Math.sin(a), a, s > 0 ? 0 : PI, 0); }
    }
    K.mesh(cyl(0.24, 0.24, 0.3, 28), glow(color, 4), 'core', 0, 0, 0, 0, 0, PI / 2);
    K.build();
    return K.root;
  });
  return { g, core: by(g, 'core') };
}

// ------------------------------------------------------------------ bosses
// Each boss: a big side-profile hull dressed on both faces, nodes (weak points: self-contained Groups, each
// with its own glowing parts, named node0..), an optional hatch / spin Group, vents (one glowing mesh with its
// own material: pulse vents.material.color), lamps (Group) and flames.
function drumNode(K, i, x, y, r, len, arm, ring, col, k = 2.4) {
  const n = K.group('node' + i, K.root, x, y, 0), at = atK(K, n);
  at(cyl(r * 1.22, r * 1.22, len - 0.4, 28), arm, 0, 0, 0, PI / 2);
  for (const s of BOTH) {
    const z = s * (len / 2 - 0.2);
    at(cyl(r * 1.5, r * 1.5, 0.4, 6), arm, 0, 0, z, PI / 2, PI / 6, 0);
    at(tor(r * 1.05, r * 0.12, 28, 6), ring, 0, 0, z + s * 0.2);
    for (let j = 0; j < 3; j++) { const a = j * TAU / 3 + PI / 2; at(rbox(r * 0.5, r * 0.34, 0.3, 0.04), ring, Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3, z + s * 0.22, 0, 0, a); }
    at(cyl(r * 0.95, r * 0.95, 0.1, 28), glow(col, k), 0, 0, z + s * 0.17, PI / 2);
    at(cyl(r * 0.42, r * 0.42, 0.1, 20), glow(new THREE.Color(col).lerp(new THREE.Color(0xffffff), 0.6).getHex(), k * 1.5), 0, 0, z + s * 0.2, PI / 2);
    at(tor(r * 0.62, r * 0.06, 24, 4), M.black, 0, 0, z + s * 0.22);
  }
  return n;
}
function ventMesh(K, key, items, color, k, parent = K.root) { return K.mesh(combo('vent' + key, items), glowM(color, k, 'vents'), 'vents', 0, 0, 0, 0, 0, 0, parent); }
// plates on both faces between x stations, from y lo(x) to hi(x)
function facePlates(at, xs, lo, hi, zf, t, mats, gap = 0.12, ins = 0.3) {
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i] - gap / 2, xb = xs[i + 1] + gap / 2;
    const pts = [[xa, lo(xa)], [xa, hi(xa)], [xb, hi(xb)], [xb, lo(xb)]], m = mats[i % mats.length];
    for (const s of BOTH) {
      at(side(pts, t, Math.min(0.06, t / 3)), m[0], 0, 0, s * (zf + t / 2 - 0.02));
      if (m[1]) at(side(inset(pts, ins), t * 0.5, 0.03), m[1], 0, 0, s * (zf + t + t * 0.25 - 0.03));
    }
  }
}

// THE HARVEST ARK (20 m): a long olive carrier. Harvester jaws at the prow, a folded crane arm on the back, a
// command blister with a spinning radar, three reactor drums through the hull, an emitter under the chin and
// an open truss lifter bay underneath with three docked lifters; the bay door is the hatch
// (hatch.rotation.z 0 = shut .. ~1.3 = open, the rear end swings down). Four engines.
function ark(K) {
  const R = K.root, L = K.group('lamps');
  const h1 = paint(0x58613f, 0.42, 0.5), h2 = paint(0x3d4432, 0.45, 0.55), dk = paint(0x24271f, 0.45, 0.6), bone = paint(0xc2b48a, 0.4, 0.3), amb = paint(0xd8961c, 0.4, 0.35), lg = paint(0x8a9096, 0.28, 0.85), blk = M.black;
  const at = atK(K, R), W = 2.5, GR = 0x46ff1e;
  const T = crv([[9.6, 0.6], [8.6, 1.9], [6.5, 2.6], [3, 2.9], [-3, 3.0], [-7, 2.8], [-9.3, 2.3], [-10, 1.4]], 20);
  const Bt = crv([[-10, -0.9], [-8.5, -1.9], [-5, -2.3], [3, -2.3], [6.5, -1.9], [8.8, -1.0]], 20);
  at(side([...T, ...Bt], 2 * W, 0.5), h1);
  const nodesX = [5.4, -0.6, -6.4];
  at(side([...crv([[6.8, 2.5], [4, 3.35], [-3, 3.45], [-7.6, 3.1]], 10), [-8.4, 2.4], [7.4, 2.2]], 3.4, 0.25), h2);
  for (let x = 5.5; x > -7.5; x -= 1.3) at(box(0.6, 0.1, 3.42), dk, x, yAt(crv([[6.8, 2.5], [4, 3.35], [-3, 3.45], [-7.6, 3.1]], 10), x) - 0.25, 0);
  at(side([[-6.8, 3.2], [-8.6, 3.0], [-10.6, 5.6], [-9.6, 5.7]], 0.5, 0.15), h2);
  at(side([[-9.0, 3.6], [-10.1, 3.5], [-10.62, 5.55], [-9.62, 5.68]], 0.56, 0.05), bone);
  K.add(sph(0.1, 8, 6), glow(0xff3a2a, 6), -10.2, 5.75, 0, 0, 0, 0, 1, 1, 1, L);
  for (const s of BOTH) at(side([[-7.6, -1.6], [-9.2, -1.4], [-11.0, -3.0], [-10.1, -3.1]], 0.4, 0.12), h2, 0, 0, s * 1.3, -s * 0.25);
  facePlates(at, [8.0, 5.4, 2.4, -0.6, -3.6, -6.6, -9.0], () => 0.25, (x) => yAt(T, x) - 0.45, W, 0.2, [[h2, h1], [h1, h2]]);
  facePlates(at, [7.4, 4.0, 0.4, -3.2, -6.4, -8.8], (x) => yAt(Bt, x) + 0.5, () => -0.2, W, 0.2, [[dk, h2], [h2, dk]]);
  for (const s of BOTH) {
    at(cyl(0.1, 0.1, 16.5, 10), lg, -0.8, 0.02, s * (W + 0.14), 0, 0, PI / 2);
    for (let x = 7.0; x > -9; x -= 1.5) at(rbox(0.16, 0.3, 0.12, 0.03), dk, x, 0.02, s * (W + 0.2));
    for (let x = 7.9; x > -9; x -= 0.72) {
      if (nodesX.some((n) => Math.abs(n - x) < 1.25)) continue;
      at(box(0.38, 0.17, 0.05), glow(0xffa040, 2.4), x, yAt(T, x) - 1.05, s * (W + 0.42));
    }
    for (const x of [7, 3, -1, -5, -8.5]) K.add(sph(0.09, 8, 6), glow(0xffa030, 5), x, yAt(Bt, x) + 0.32, s * (W - 0.05), 0, 0, 0, 1, 1, 1, L);
  }
  // harvester jaws and the sensor band on the nose
  for (const s of BOTH) {
    const JU = [[7.6, 0.9], [9.8, 0.75], [11.7, 0.0], [12.6, -1.2], [11.7, -0.85], [10.2, -0.95], [8.4, -1.25], [7.4, -0.9]];
    const JL = [[7.4, -1.7], [8.6, -1.85], [10.3, -2.25], [11.6, -2.25], [12.3, -1.75], [11.6, -2.9], [9.8, -3.35], [7.7, -2.8]];
    for (const J of [JU, JL]) { at(side(crv(J, 16), 0.6, 0.18), bone, 0, 0, s * 1.75); at(side(inset(J, 0.32), 0.1, 0.03), dk, 0, 0, s * 2.07); }
    for (let j = 0; j < 4; j++) { at(cone(0.13, 0.5, 5), lg, 8.9 + j * 0.8, -1.25 - j * 0.03, s * 1.75, 0, 0, PI); at(cone(0.13, 0.5, 5), lg, 9.3 + j * 0.7, -2.0 - j * 0.03, s * 1.75); }
    at(cyl(0.45, 0.45, 0.7, 16), lg, 8.0, -0.4, s * 1.75, PI / 2);
    at(cyl(0.22, 0.22, 0.74, 12), dk, 8.0, -0.4, s * 1.75, PI / 2);
  }
  at(rbox(2.8, 1.9, 2.9, 0.15), blk, 9.0, -1.55, 0);
  for (let j = 0; j < 5; j++) at(box(0.07, 1.4, 2.8), glow(GR, 2.2), 10.3 - j * 0.32, -1.55, 0);
  at(sph(0.5, 16, 10), glow(0xc8ff9a, 3), 9.2, -1.55, 0, 0, 0, 0, 1, 1, 3.0);
  at(box(1.5, 0.16, 4.3), glow(0xffb030, 3), 8.55, 1.35, 0, 0, 0, 0.62);
  // command blister, radar, antennas
  at(side([[-1.6, 2.8], [-2.6, 3.95], [-6.0, 4.15], [-7.0, 2.8]], 3.0, 0.4), h2);
  at(side([[-2.25, 3.5], [-2.55, 3.82], [-4.3, 3.95], [-4.2, 3.6]], 3.04, 0.06), glow(0xffb040, 2.6));
  at(side([[-2.6, 3.98], [-2.9, 4.12], [-5.9, 4.24], [-6.1, 4.08]], 2.4, 0.06), bone);
  for (const z of [-0.8, 0.8]) { K.rod(lg, -6.3, 4.0, z, -6.6, 5.9, z, 0.05, R, 6); K.add(sph(0.09, 8, 6), glow(0xff3a2a, 6), -6.6, 5.95, z, 0, 0, 0, 1, 1, 1, L); }
  const SP = K.group('spin', R, -4.9, 4.2, 0), sa = atK(K, SP);
  sa(cyl(0.12, 0.16, 0.6, 10), dk, 0, 0.3, 0);
  sa(lathe('arkdish', [[0.02, 0.0], [0.45, 0.06], [0.9, 0.22], [1.0, 0.28], [0.92, 0.27], [0.4, 0.12], [0.02, 0.07]], 20), bone, 0.1, 0.75, 0, 0, 0, -1.15);
  sa(cyl(0.025, 0.025, 0.7, 5), lg, 0.42, 1.0, 0, 0, 0, -1.15);
  K.add(sph(0.06, 8, 6), glow(GR, 4), 0.72, 1.14, 0, 0, 0, 0, 1, 1, 1, SP);
  // folded crane arm on the back
  at(cyl(0.95, 1.15, 0.5, 18), dk, 4.6, 3.0, 0);
  at(rbox(1.4, 0.8, 1.2, 0.15), h2, 4.6, 3.55, 0);
  at(side([[4.9, 3.35], [4.4, 3.95], [0.2, 4.75], [-0.1, 4.3]], 0.75, 0.12), h2);
  at(side([[0.1, 4.75], [0.35, 4.3], [3.3, 3.8], [3.5, 4.15]], 0.6, 0.1), bone);
  at(cyl(0.38, 0.38, 0.95, 16), lg, 0.1, 4.52, 0, PI / 2);
  at(cyl(0.3, 0.3, 1.5, 14), lg, 4.6, 3.6, 0, PI / 2);
  for (const s of BOTH) K.rod(lg, 3.9, 3.4, s * 0.45, 1.4, 4.2, s * 0.45, 0.07, R, 8);
  for (const a of [-0.5, 0, 0.5]) at(side([[0, 0], [0.5, 0.05], [0.75, -0.35], [0.62, -0.38], [0.42, -0.1], [0, -0.12]], 0.14, 0.03), lg, 3.4, 3.95, a * 0.5, 0, 0, a - 0.3);
  K.add(sph(0.1, 8, 6), glow(GR, 4), 3.55, 4.15, 0, 0, 0, 0, 1, 1, 1, L);
  // engines
  at(rbox(1.6, 3.0, 4.4, 0.25), h2, -9.7, 0.3, 0);
  const flames = [];
  [1.0, -0.4].forEach((y, i) => {
    for (const z of [-1.2, 1.2]) {
      at(lathe('arkbell', [[0.55, 0], [0.6, 0.05], [0.72, 0.8], [0.68, 0.86], [0.48, 0.12], [0.4, 0.08]], 22), M.frame, -10.4, y, z, 0, 0, PI / 2);
      at(cyl(0.48, 0.48, 0.04, 20), glow(0xffc070, 3), -10.5, y, z, 0, 0, PI / 2);
      at(tor(0.6, 0.05, 22, 5), amb, -10.45, y, z, 0, PI / 2, 0);
    }
    flames.push(K.mesh(plume(0.5, 0xffa040, [-1.2, 1.2]), flameMat(), 'flame' + i, -11.2, y, 0));
  });
  // open truss lifter bay with three docked lifters
  at(rbox(10.6, 0.34, 3.7, 0.08), dk, -0.85, -2.35, 0);
  at(side([[4.6, -2.2], [4.3, -4.3], [3.8, -4.3], [3.95, -2.2]], 3.7, 0.1), dk);
  at(side([[-5.7, -2.2], [-5.55, -4.3], [-6.05, -4.3], [-6.4, -2.2]], 3.7, 0.1), dk);
  for (let x = 3.4; x > -5.5; x -= 1.0) at(box(0.12, 0.05, 3.2), glow(GR, 2.2), x, -2.53, 0);
  for (const s of BOTH) {
    at(box(10.2, 0.3, 0.3), dk, -0.85, -4.12, s * 1.7);
    for (let x = 3.6; x > -5.6; x -= 0.5) at(box(0.32, 0.12, 0.04), Math.round(x * 2) % 2 ? amb : blk, x, -4.12, s * 1.86, 0, 0, PI / 4);
    for (const x0 of [3.9, -5.6]) at(box(0.25, 1.7, 0.25), dk, x0, -3.3, s * 1.7);
    for (const x0 of [0.75, -2.45]) { K.rod(lg, x0 - 0.5, -2.55, s * 1.7, x0, -4.0, s * 1.7, 0.06, R, 6); K.rod(lg, x0 + 0.5, -2.55, s * 1.7, x0, -4.0, s * 1.7, 0.06, R, 6); }
  }
  for (const x of [2.3, -0.85, -4.0]) {
    at(lathe('arksaucer', [[0, -0.3], [0.5, -0.28], [1.0, -0.1], [1.12, 0.02], [0.9, 0.22], [0.45, 0.4], [0, 0.44]], 28), bone, x, -3.25, 0);
    at(tor(1.1, 0.04, 32, 5), lg, x, -3.24, 0, PI / 2);
    at(sph(0.2, 12, 8), glow(GR, 3), x, -2.8, 0);
    for (let j = 0; j < 8; j++) { const a = j * PI / 4 + PI / 8; at(sph(0.05, 6, 4), glow(j % 2 ? 0xffa030 : GR, 4), x + 1.13 * Math.cos(a), -3.23, 1.13 * Math.sin(a)); }
    for (const dx of [-0.3, 0.3]) K.rod(lg, x + dx, -2.5, 0, x + dx * 0.6, -2.85, 0, 0.05, R, 6);
    at(cone(0.16, 0.35, 8), dk, x, -3.7, 0, PI);
  }
  const H = K.group('hatch', R, 4.05, -4.3, 0), ha = atK(K, H);
  ha(rbox(10.2, 0.16, 3.55, 0.05), h2, -5.1, -0.08, 0);
  for (let x = -0.8; x > -9.8; x -= 1.2) ha(box(0.12, 0.08, 3.3), dk, x, -0.18, 0);
  for (const s of BOTH) { ha(box(9.8, 0.06, 0.06), amb, -5.1, -0.08, s * 1.79); K.add(sph(0.07, 8, 6), glow(0xffa030, 5), -9.9, -0.12, s * 1.6, 0, 0, 0, 1, 1, 1, H); }
  // weak points: three reactor drums and the chin emitter
  const nodes = nodesX.map((x, i) => drumNode(K, i, x, i === 1 ? 1.15 : 0.95, 0.72, 2 * W + 0.9, dk, lg, GR));
  const n3 = K.group('node3', R, 6.1, -1.95, 0), na = atK(K, n3);
  na(cyl(0.95, 0.7, 0.5, 24), dk, 0, -0.2, 0);
  na(tor(0.72, 0.08, 24, 6), amb, 0, -0.45, 0, PI / 2);
  na(sph(0.55, 20, 12), glow(GR, 2.6), 0, -0.6, 0);
  for (let j = 0; j < 4; j++) { const a = j * PI / 2 + PI / 4; K.rod(lg, 0.75 * Math.cos(a), -0.4, 0.75 * Math.sin(a), 0.2 * Math.cos(a), -1.3, 0.2 * Math.sin(a), 0.05, n3, 6); }
  na(sph(0.12, 10, 8), glow(0xffffff, 5), 0, -1.32, 0);
  nodes.push(n3);
  const vents = [];
  for (const s of BOTH) for (let j = 0; j < 6; j++) vents.push([box(0.1, 0.55, 0.05), -7.0 - j * 0.3, -1.05, s * (W + 0.42)]);
  ventMesh(K, 'ark', vents, 0xffa030, 2.6);
  return { nodes, hatch: H, spin: SP, flames };
}

// a crescent blade outline from root to tip, its arc centre pushed off the chord by bulge (fraction of the
// chord, + = to the left of root->tip); w(u) = width at u (0 root .. 1 tip)
function scythe(r, t, bulge, Wd, n = 18) {
  const mx = (r[0] + t[0]) / 2, my = (r[1] + t[1]) / 2, dx = t[0] - r[0], dy = t[1] - r[1], Lc = Math.hypot(dx, dy);
  const cx = mx - dy / Lc * bulge * Lc, cy = my + dx / Lc * bulge * Lc, Rr = Math.hypot(r[0] - cx, r[1] - cy);
  const a0 = Math.atan2(r[1] - cy, r[0] - cx); let da = Math.atan2(t[1] - cy, t[0] - cx) - a0;
  while (da > PI) da -= TAU; while (da < -PI) da += TAU;
  const w = (u) => Wd * Math.pow(1 - u, 0.8);
  const P = (u, o) => { const a = a0 + da * u, rr = Rr - o; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; };
  const out = [], inn = [], edge = [], spine = [];
  for (let i = 0; i <= n; i++) { const u = i / n; out.push(P(u, 0)); if (i < n) inn.push(P(u, w(u))); }
  for (let i = 0; i < n; i++) { const u = i / n; edge.push(P(u, w(u))); spine.push(P(u, 0.04)); }
  const edgeIn = []; for (let i = n - 1; i >= 0; i--) { const u = i / n; edgeIn.push(P(u, w(u) - 0.05 - 0.14 * Math.pow(1 - u, 0.5))); }
  const spineIn = []; for (let i = n - 1; i >= 0; i--) { const u = i / n; spineIn.push(P(u, 0.04 + 0.32 * Math.pow(1 - u, 0.7))); }
  return { blade: [...out, ...inn.reverse()], edge: [...edge, P(1, 0), ...edgeIn], spine: [...spine, P(1, 0), ...spineIn] };
}

// THE DUNE REAPER (19 m): rust-and-sand gunship with three bone scythe blades a side (glowing cutting edges),
// a beaked head with an eye slit, a rotary cannon under the chin (spin: rotation.x), dorsal spines, twin engines.
function reaper(K) {
  const R = K.root, L = K.group('lamps');
  const rust = paint(0x9a5532, 0.42, 0.45), sand = paint(0xc79a62, 0.45, 0.35), dk = paint(0x2e2420, 0.42, 0.6), bone = paint(0xddd2b8, 0.35, 0.3), lg = paint(0x8f8f92, 0.28, 0.85), blk = M.black;
  const at = atK(K, R), W = 1.5;
  const T = crv([[9.0, 0.4], [7.6, 1.2], [4.5, 1.9], [0.5, 2.2], [-3, 2.0], [-6.5, 1.5], [-8.6, 0.9]], 18);
  const Bt = crv([[-8.6, -0.5], [-6, -1.1], [-1.5, -1.7], [3, -1.6], [6.5, -1.0], [8.6, -0.2]], 18);
  at(side([...T, ...Bt], 2 * W, 0.45), rust);
  facePlates(at, [7.0, 4.2, 1.4, -1.4, -4.2, -7.2], (x) => yAt(Bt, x) + 0.45, (x) => yAt(T, x) - 0.45, W, 0.18, [[dk, sand], [sand, dk]], 0.14, 0.32);
  at(side([[9.8, 0.25], [8.6, 0.95], [6.9, 1.15], [6.6, -0.7], [8.4, -0.55]], 2.2, 0.25), dk);
  at(side([[9.3, 0.62], [8.0, 1.28], [6.4, 1.55], [6.7, 1.05], [8.4, 0.85]], 1.2, 0.12), sand);
  // dorsal spines
  for (let j = 0; j < 7; j++) { const x = 5.2 - j * 1.6; at(cone(0.22, 1.1 - j * 0.06, 6), bone, x, yAt(T, x) + 0.35, 0, 0, 0, 0.75); }
  // blades: [root, tip, bulge, width]
  const blades = [[[2.0, 1.4], [-6.8, 8.0], -0.32, 1.6], [[1.0, -1.1], [-6.2, -6.2], 0.32, 1.3], [[-4.4, 0.5], [-9.6, 2.6], -0.35, 0.8]];
  for (const [rt, tp, bl, wd] of blades) {
    const S = scythe(rt, tp, bl, wd);
    for (const s of BOTH) {
      at(side(S.blade, 0.28, 0.07), bone, 0, 0, s * 1.75);
      at(side(S.spine, 0.06, 0.02), dk, 0, 0, s * 1.91);
      at(side(S.edge, 0.05, 0.015), glow(0xff5a10, 2.6), 0, 0, s * 1.9);
    }
  }
  // rotary cannon
  at(rbox(2.6, 0.9, 1.5, 0.15), dk, 5.6, -1.45, 0);
  const SP = K.group('spin', R, 6.2, -1.9, 0), sa = atK(K, SP);
  sa(cyl(0.55, 0.55, 0.8, 18), lg, 0.2, 0, 0, 0, 0, PI / 2);
  for (let j = 0; j < 6; j++) { const a = j * PI / 3; sa(cyl(0.1, 0.1, 3.2, 8), lg, 1.8, 0.32 * Math.cos(a), 0.32 * Math.sin(a), 0, 0, PI / 2); sa(cyl(0.12, 0.12, 0.12, 8), blk, 3.4, 0.32 * Math.cos(a), 0.32 * Math.sin(a), 0, 0, PI / 2); }
  sa(cyl(0.5, 0.5, 0.14, 18), dk, 2.9, 0, 0, 0, 0, PI / 2);
  sa(cyl(0.48, 0.48, 0.14, 18), dk, 1.2, 0, 0, 0, 0, PI / 2);
  // engines
  at(rbox(1.2, 2.0, 2.6, 0.2), dk, -8.6, 0.2, 0);
  for (const z of [-0.75, 0.75]) { at(lathe('rpbell', [[0.45, 0], [0.5, 0.05], [0.6, 0.6], [0.56, 0.65], [0.4, 0.1], [0.34, 0.06]], 20), M.frame, -9.1, 0.2, z, 0, 0, PI / 2); at(cyl(0.4, 0.4, 0.04, 18), glow(0xffb070, 4), -9.2, 0.2, z, 0, 0, PI / 2); }
  const flames = [K.mesh(plume(0.42, 0xff7a2a, [-0.75, 0.75]), flameMat(), 'flame0', -9.75, 0.2, 0)];
  for (const s of BOTH) for (const x of [6, 2, -2, -6]) K.add(sph(0.08, 8, 6), glow(0xff5a1a, 5), x, yAt(Bt, x) + 0.3, s * (W - 0.05), 0, 0, 0, 1, 1, 1, L);
  // weak points: blade roots (upper, lower), spine reactor, the eye
  const nodes = [drumNode(K, 0, 1.9, 1.35, 0.7, 4.3, dk, lg, 0xff5a10), drumNode(K, 1, 0.9, -1.0, 0.62, 4.3, dk, lg, 0xff5a10), drumNode(K, 2, -2.6, 0.6, 0.55, 3.5, dk, lg, 0xff5a10)];
  const E = K.group('node3', R, 8.3, 0.35, 0), ea = atK(K, E);
  ea(side([[0.9, 0.05], [0.2, 0.28], [-0.9, 0.22], [-0.7, -0.12], [0.5, -0.12]], 2.4, 0.04), glow(0xff3a0a, 3));
  ea(side([[1.0, 0.18], [0.2, 0.42], [-1.0, 0.36], [-0.95, 0.24], [0.2, 0.3], [0.9, 0.08]], 2.46, 0.04), dk);
  ea(box(0.5, 0.1, 2.44), glow(0xffd0a0, 5), 0.1, 0.08, 0, 0, 0, 0.12);
  nodes.push(E);
  const vents = [];
  for (const s of BOTH) for (let j = 0; j < 5; j++) vents.push([box(0.12, 0.6, 0.05), -5.4 - j * 0.32, 0.4, s * (W + 0.3)]);
  ventMesh(K, 'reaper', vents, 0xff5a10, 2.6);
  return { nodes, spin: SP, flames };
}

// THE FROST LOOM (17 m): a crystalline machine. A pale hub with a huge crystal core, a ring of crystal shards
// spinning round it in the side-view plane (spin: rotation.z), gimbal pylons to crown and keel crystals, and a
// floating prow lance and tail fan held by energy beams.
function loom(K) {
  const R = K.root, L = K.group('lamps');
  const st = paint(0xc3cfdb, 0.3, 0.6), deep = paint(0x2c4664, 0.38, 0.6), dk = paint(0x1e2a38, 0.4, 0.6), ice = tint(0xa8ecff, 'gloss'), ice2 = tint(0x5aa8d8, 'gloss'), lg = paint(0x9aa6b2, 0.25, 0.85);
  const at = atK(K, R);
  const hex = [[3.4, 0], [1.6, 1.7], [-1.6, 1.7], [-3.4, 0], [-1.6, -1.7], [1.6, -1.7]];
  at(side(hex, 1.7, 0.3), st);
  for (const s of BOTH) {
    at(side([[3.0, 0], [1.9, 1.3], [1.75, 0], [1.9, -1.3]], 0.2, 0.06), deep, 0, 0, s * 0.9);
    at(side([[-3.0, 0], [-1.9, -1.3], [-1.75, 0], [-1.9, 1.3]], 0.2, 0.06), deep, 0, 0, s * 0.9);
    at(tor(1.62, 0.14, 40, 6), dk, 0, 0, s * 0.95);
    for (const x of [-2.4, 2.4]) for (const y of [-1.2, 1.2]) at(cyl(0.12, 0.12, 0.1, 8), lg, x * 0.8, y, s * 0.88, PI / 2);
  }
  // pylons to crown and keel (at z = +-1.05, clear of the ring)
  for (const z of [-1.05, 1.05]) {
    at(side([[0.55, 1.4], [0.35, 6.6], [-0.35, 6.6], [-0.55, 1.4]], 0.3, 0.08), deep, 0, 0, z);
    at(side([[0.55, -1.4], [-0.55, -1.4], [-0.35, -6.6], [0.35, -6.6]], 0.3, 0.08), deep, 0, 0, z);
    for (const y of [3, 5, -3, -5]) K.add(sph(0.08, 8, 6), glow(0xbff4ff, 5), 0, y, z * 1.17, 0, 0, 0, 1, 1, 1, L);
    at(box(0.12, 4.6, 0.06), glow(0x7fe8ff, 2.4), 0, 3.9, z * 1.16);
    at(box(0.12, 4.6, 0.06), glow(0x7fe8ff, 2.4), 0, -3.9, z * 1.16);
  }
  at(side([[1.4, 6.65], [0.0, 7.8], [-1.4, 6.65], [0, 6.25]], 2.6, 0.2), st);
  at(side([[1.4, -6.65], [0, -6.25], [-1.4, -6.65], [0.0, -7.8]], 2.6, 0.2), st);
  // spinning ring
  const SP = K.group('spin', R), sa = atK(K, SP);
  sa(ngonRing(72, 4.4, 5.1, 0.7, 0, 0.12), st, 0, 0, 0, PI / 2);
  for (const s of BOTH) sa(tor(4.6, 0.05, 96, 4), glow(0x40c8ff, 2.6), 0, 0, s * 0.36);
  for (let j = 0; j < 24; j++) { const a = j * TAU / 24; sa(box(0.32, 0.22, 0.82), dk, 4.95 * Math.cos(a), 4.95 * Math.sin(a), 0, 0, 0, a); }
  for (let j = 0; j < 12; j++) {
    const a = j * TAU / 12 + PI / 12, d = v3(Math.cos(a), Math.sin(a), 0), Ls = j % 2 ? 0.7 : 1.05;
    sa(shard(Ls, 0.26), j % 3 ? ice : ice2, 5.0 * d.x, 5.0 * d.y, 0, ...orient(d));
    sa(shard(Ls * 0.5, 0.1), glow(0xbff4ff, 3), 5.0 * d.x, 5.0 * d.y, 0, ...orient(d));
  }
  for (let j = 0; j < 12; j++) { const a = j * TAU / 12, d = v3(Math.cos(a), Math.sin(a), 0); sa(shard(0.55, 0.16), ice2, 4.45 * d.x, 4.45 * d.y, 0, ...orient(d.clone().negate())); }
  for (const z of [-1.25, 1.25]) for (const sy of [-1, 1]) for (const x of [-1.2, -0.4, 0.4, 1.2]) {
    const a = v3(x * 1.2, sy * 1.6, z), b = v3(x * 0.3, sy * 6.3, z), d = b.clone().sub(a);
    at(cyl(0.025, 0.025, d.length(), 4), glow(0x9ff0ff, 2.6), (a.x + b.x) / 2, (a.y + b.y) / 2, z, ...orient(d));
  }
  // prow lance and tail fan, held by beams
  at(side([[8.6, 0], [7.2, 0.55], [6.3, 0], [7.2, -0.55]], 1.2, 0.15), st);
  at(shard(1.6, 0.3), ice, 7.6, 0, 0, 0, 0, -PI / 2);
  at(side([[-6.3, 0], [-7.0, 0.6], [-7.6, 0], [-7.0, -0.6]], 1.2, 0.15), st);
  for (const a of [0.55, 0, -0.55]) { const d = v3(-Math.cos(a), Math.sin(a), 0); at(shard(a ? 1.4 : 1.9, 0.26), a ? ice2 : ice, -7.2, 0, 0, ...orient(d)); }
  for (const z of [-1.05, 1.05]) {
    at(box(2.9, 0.07, 0.07), glow(0x9ff0ff, 4), 4.85, 0, z);
    at(box(2.9, 0.07, 0.07), glow(0x9ff0ff, 4), -4.85, 0, z);
    for (const x of [3.4, 6.3, -3.4, -6.3]) at(cyl(0.16, 0.16, 0.3, 10), lg, x, 0, z, PI / 2);
  }
  // weak points: crown, prow, keel, tail crystals, then the core
  const crystalNode = (i, x, y, dir, size) => {
    const n = K.group('node' + i, R, x, y, 0), na = atK(K, n);
    na(shard(size, size * 0.28), glow(0x50d0ff, 2.6), 0, 0, 0, ...orient(dir));
    for (const s of BOTH) na(shard(size * 0.6, size * 0.2), ice, 0, 0, s * 0.35, ...orient(dir.clone().add(v3(0, 0, s * 0.6))));
    na(tor(size * 0.32, 0.06, 18, 4), lg, 0, 0, 0, ...orient(dir), 1, 1, 1);
    return n;
  };
  const nodes = [crystalNode(0, 0, 7.6, v3(0, 1, 0), 1.3), crystalNode(1, 8.0, 0, v3(1, 0, 0), 1.0), crystalNode(2, 0, -7.6, v3(0, -1, 0), 1.3), crystalNode(3, -7.6, 0, v3(-1, 0, 0), 1.0)];
  const C = K.group('node4', R), ca = atK(K, C);
  ca(ico(1.45, 0), glow(0x40c8ff, 2.4));
  ca(geo('loomocta', () => new THREE.OctahedronGeometry(1.65, 0)), glow(0xc8f4ff, 3.5), 0, 0, 0, 0.3, 0.2, 0.15);
  for (let j = 0; j < 6; j++) { const a = j * PI / 3, d = v3(Math.cos(a), Math.sin(a), 0); for (const s of BOTH) ca(shard(0.8, 0.15), ice, 1.75 * d.x, 1.75 * d.y, s * 0.85, ...orient(d.clone().negate().add(v3(0, 0, s * 0.5)))); }
  nodes.push(C);
  const vents = [];
  for (const s of BOTH) for (const [x, y, a] of [[2.5, 0.85, -0.76], [2.5, -0.85, 0.76], [-2.5, 0.85, 0.76], [-2.5, -0.85, -0.76]]) vents.push([box(1.6, 0.08, 0.05), x, y, s * 0.88, 0, 0, a]);
  ventMesh(K, 'loom', vents, 0x40c8ff, 2.6);
  return { nodes, spin: SP };
}

// THE CINDER HULK (18 m): a heavy armoured smelter. Riveted plates, tread belts, a crucible on top, three
// smokestacks, hover thrusters, a furnace door at the front (hatch.rotation.z 0 = shut .. ~1.4 = swung up).
function hulk(K) {
  const R = K.root, L = K.group('lamps');
  const iron = paint(0x3d3834, 0.5, 0.6), iron2 = paint(0x2a2624, 0.5, 0.6), rust = paint(0x7a3d22, 0.55, 0.4), haz = paint(0xd8a020, 0.45, 0.3), lg = paint(0x8a8580, 0.3, 0.85), blk = M.black;
  const at = atK(K, R), W = 3.0;
  const hp = [[9, 1.4], [7.8, 3.0], [-7.4, 3.2], [-9, 2.0], [-9, -1.8], [-7.6, -3.0], [7.4, -3.0], [9, -1.4]];
  at(side(hp, 2 * W, 0.6, 30), iron);
  at(side([[9.1, 1.3], [7.7, 3.05], [6.0, 3.05], [6.0, -3.05], [7.5, -3.05], [9.1, -1.4]], 2 * W + 0.3, 0.4, 30), iron2);
  for (const s of BOTH) for (let j = 0; j < 7; j++) at(box(0.5, 0.22, 0.06), j % 2 ? blk : haz, 7.2 + j * 0.22, -2.0 + j * 0.42, s * (W + 0.17), 0, 0, -0.9);
  const xs = [5.8, 3.0, 0.2, -2.6, -5.4, -8.2];
  for (let i = 0; i < xs.length - 1; i++) for (const [y0, y1] of [[0.5, 2.6], [-1.3, 0.3]]) {
    const xa = xs[i] - 0.08, xb = xs[i + 1] + 0.08, pts = [[xa, y0], [xb, y0], [xb, y1], [xa, y1]], m = (i + (y0 > 0 ? 0 : 1)) % 2 ? rust : iron2;
    for (const s of BOTH) {
      at(side(pts, 0.3, 0.08), m, 0, 0, s * (W + 0.13));
      for (const [bx, b_] of [[xa - 0.25, y0 + 0.22], [xb + 0.25, y0 + 0.22], [xa - 0.25, y1 - 0.22], [xb + 0.25, y1 - 0.22]]) at(cyl(0.09, 0.09, 0.08, 6), lg, bx, b_, s * (W + 0.3), PI / 2);
    }
  }
  // tread belts
  const stad = []; for (let i = 0; i <= 10; i++) { const a = -PI / 2 + PI * i / 10; stad.push([7.4 + 0.55 * Math.cos(a), -2.2 + 0.55 * Math.sin(a)]); } for (let i = 0; i <= 10; i++) { const a = PI / 2 + PI * i / 10; stad.push([-7.4 + 0.55 * Math.cos(a), -2.2 + 0.55 * Math.sin(a)]); }
  for (const s of BOTH) {
    at(side(stad, 0.6, 0.12), iron2, 0, 0, s * (W + 0.3));
    for (let x = 7; x > -7.4; x -= 0.7) { at(box(0.36, 0.16, 0.66), blk, x, -1.62, s * (W + 0.3)); at(box(0.36, 0.16, 0.66), blk, x, -2.78, s * (W + 0.3)); }
    for (const x of [7.4, 3.7, 0, -3.7, -7.4]) { at(cyl(0.4, 0.4, 0.7, 16), lg, x, -2.2, s * (W + 0.33), PI / 2); at(cyl(0.16, 0.16, 0.74, 8), iron2, x, -2.2, s * (W + 0.33), PI / 2); }
    at(cyl(0.18, 0.18, 15.5, 10), lg, -0.6, 0.4, s * (W + 0.45), 0, 0, PI / 2);
    for (let x = 6.5; x > -8; x -= 2.1) at(cyl(0.26, 0.26, 0.2, 10), iron2, x, 0.4, s * (W + 0.45), 0, 0, PI / 2);
  }
  // crucible and stacks
  at(cyl(2.2, 1.7, 1.6, 22), rust, 1.0, 3.9, 0);
  at(tor(2.15, 0.14, 30, 6), iron2, 1.0, 4.7, 0, PI / 2);
  for (const [x, h] of [[-2.6, 3.4], [-4.6, 4.2], [-6.6, 3.0]]) {
    at(cyl(0.62, 0.78, h, 16), iron2, x, 3.2 + h / 2, 0);
    for (const f of [0.3, 0.7]) at(tor(0.7, 0.07, 18, 5), rust, x, 3.2 + h * f, 0, PI / 2);
    at(tor(0.62, 0.1, 18, 5), lg, x, 3.2 + h, 0, PI / 2);
    K.add(sph(0.1, 8, 6), glow(0xffb030, 6), x + 0.62, 3.2 + h - 0.3, 0, 0, 0, 0, 1, 1, 1, L);
  }
  // hover thrusters
  for (const x of [5.5, -5.5]) for (const z of [-1.8, 1.8]) at(lathe('hkbell', [[0.55, 0], [0.62, 0.05], [0.8, 0.7], [0.75, 0.75], [0.5, 0.1]], 18), M.frame, x, -3.0, z, PI);
  // furnace mouth and door
  at(box(0.1, 2.5, 3.8), glow(0xff5a10, 3), 9.12, -0.15, 0);
  const H = K.group('hatch', R, 9.2, 1.35, 0), ha = atK(K, H);
  ha(rbox(0.5, 2.9, 4.2, 0.1), iron, 0.25, -1.45, 0);
  for (const s of BOTH) for (let j = 0; j < 5; j++) ha(box(0.52, 0.25, 0.05), j % 2 ? blk : haz, 0.25, -0.3 - j * 0.55, s * 2.12, 0, 0, 0.5);
  ha(box(0.08, 2.4, 0.4), lg, 0.52, -1.45, 0);
  // weak points: two heat sinks, crucible core, belly core, rear furnace
  const nodes = [drumNode(K, 0, 4.4, 1.55, 0.72, 2 * W + 1.1, iron2, lg, 0xff4a0a), drumNode(K, 1, -1.4, 1.55, 0.72, 2 * W + 1.1, iron2, lg, 0xff4a0a)];
  const C = K.group('node2', R, 1.0, 4.7, 0), ca = atK(K, C);
  ca(cyl(1.85, 1.85, 0.12, 28), glow(0xff4a0a, 2.6));
  ca(sph(1.1, 20, 10), glow(0xff8a30, 3), 0, 0, 0, 0, 0, 0, 1, 0.45, 1);
  for (let j = 0; j < 4; j++) ca(box(4.2, 0.18, 0.18), iron2, 0, 0.12, 0, 0, j * PI / 4, 0);
  nodes.push(C);
  const Bn = K.group('node3', R, 0, -3.2, 0), ba = atK(K, Bn);
  ba(cyl(1.2, 0.9, 0.6, 20), iron2, 0, -0.1, 0);
  ba(sph(0.75, 18, 12), glow(0xff4a0a, 2.6), 0, -0.55, 0);
  for (let j = 0; j < 6; j++) { const a = j * PI / 3; ba(box(0.14, 1.2, 0.14), lg, 0.82 * Math.cos(a), -0.6, 0.82 * Math.sin(a), 0, -a, 0); }
  nodes.push(Bn);
  nodes.push(drumNode(K, 4, -8.0, 0.4, 0.62, 2 * W + 1.1, iron2, lg, 0xff4a0a));
  const vents = [];
  for (const s of BOTH) {
    for (const x0 of [2.4, -3.2]) for (let j = 0; j < 5; j++) vents.push([box(0.14, 1.1, 0.05), x0 - j * 0.34, 1.6, s * (W + 0.3)]);
    for (let j = 0; j < 4; j++) vents.push([box(0.6, 0.12, 0.05), 7.0, -0.3 - j * 0.32, s * (W + 0.17)]);
  }
  for (const [x, h] of [[-2.6, 3.4], [-4.6, 4.2], [-6.6, 3.0]]) vents.push([cyl(0.5, 0.5, 0.06, 16), x, 3.2 + h + 0.01, 0]);
  for (const x of [5.5, -5.5]) for (const z of [-1.8, 1.8]) vents.push([cyl(0.5, 0.5, 0.04, 16), x, -3.15, z]);
  ventMesh(K, 'hulk', vents, 0xff4a0a, 2.6);
  return { nodes, hatch: H };
}

// THE UMBRA THRONE (22 m): a dark cathedral flagship. An obsidian nave with glowing gothic windows, five
// spires, flying arches, a huge rose-window core with a rotating halo of spikes (spin: rotation.z), hanging
// lanterns under the keel, organ-pipe engines at the stern, a ram at the prow.
function throne(K) {
  const R = K.root, L = K.group('lamps');
  const obs = paint(0x1b1920, 0.32, 0.6), slate = paint(0x2d2a36, 0.38, 0.6), gold = paint(0x9c7a36, 0.28, 0.9), dk = paint(0x111015, 0.4, 0.5), vio = tint(0x3a2a5a, 'gloss');
  const at = atK(K, R), W = 2.0, cx = 0.4, cy = -0.4;
  const T = crv([[10.8, 0.1], [9.0, 1.4], [6.5, 2.2], [0, 2.5], [-6.5, 2.4], [-9.4, 2.0], [-10.5, 1.1]], 20);
  const Bt = crv([[-10.5, -1.3], [-8.2, -2.2], [-3, -3.2], [1.5, -3.3], [6, -2.4], [9.4, -0.9]], 20);
  at(side([...T, ...Bt], 2 * W, 0.45), obs);
  at(side([[8, 2.0], [7.4, 3.1], [-8, 3.1], [-9, 2.0]], 3.0, 0.25), slate);
  for (const s of BOTH) {
    for (const [x0, x1] of [[10.0, 3.3], [-2.5, -10.2]]) for (const y of [1.6, -1.9]) at(box(x0 - x1, 0.1, 0.08), gold, (x0 + x1) / 2, y, s * (W + 0.03));
    for (const [x0, x1] of [[8.6, 3.6], [-3.0, -9.6]]) for (let x = x0; x >= x1; x -= 1.1) {
      const y = x > 0 ? -0.9 : -1.0;
      at(side(archPts(x, y, 0.36, 1.3), 0.08, 0.02), slate, 0, 0, s * (W + 0.03));
      at(side(archPts(x, y + 0.08, 0.24, 1.2), 0.06, 0.015), glow(0x9a4aff, 2.4), 0, 0, s * (W + 0.08));
    }
    for (let x = 7.5; x > -9; x -= 1.4) at(side(archPts(x, 2.25, 0.22, 0.4), 0.06, 0.015), glow(0xff4ac8, 2.2), 0, 0, s * 1.52);
  }
  // spires: [x, height, base radius, node index or -1]
  const spires = [[7.0, 6.0, 0.6, -1], [3.6, 7.6, 0.75, 0], [0.4, 9.2, 0.9, 1], [-3.6, 7.6, 0.75, 2], [-7.2, 6.0, 0.6, -1]];
  const nodes = [];
  for (const [x, h, r, ni] of spires) {
    const y0 = 3.1;
    at(cyl(r * 1.15, r * 1.3, 0.9, 8), slate, x, y0 + 0.45, 0, 0, PI / 8, 0);
    at(cyl(r * 0.72, r * 0.9, h * 0.45, 8), obs, x, y0 + 0.9 + h * 0.225, 0, 0, PI / 8, 0);
    at(cyl(r * 0.95, r * 0.95, 0.16, 8), gold, x, y0 + 0.9 + h * 0.45, 0, 0, PI / 8, 0);
    for (const s of BOTH) {
      at(side(archPts(x, y0 + 1.2, r * 0.25, h * 0.22), 0.05, 0.012), glow(0x9a4aff, 2.4), 0, 0, s * r * 0.84);
      at(cone(r * 0.22, 1.4, 6), obs, x + s * r * 1.15, y0 + 1.1, 0);
    }
    at(cone(r * 0.72, h * 0.55, 8), obs, x, y0 + 0.9 + h * 0.45 + h * 0.275, 0, 0, PI / 8, 0);
    const tipY = y0 + 0.9 + h;
    if (ni < 0) at(shard(0.9, 0.16), glow(0xc890ff, 4), x, tipY - 0.1, 0);
    else {
      const n = K.group('node' + ni, R, x, tipY - 0.2, 0), na = atK(K, n);
      na(shard(1.6, 0.36), glow(0xb070ff, 2.6));
      for (let j = 0; j < 4; j++) { const a = j * PI / 2 + PI / 4; na(box(0.08, 0.9, 0.08), gold, 0.32 * Math.cos(a), 0.3, 0.32 * Math.sin(a), Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); }
      na(tor(0.38, 0.06, 16, 4), gold, 0, 0.05, 0, PI / 2);
      nodes[ni] = n;
    }
  }
  for (let i = 0; i < spires.length - 1; i++) {
    const [x1, , r1] = spires[i], [x2, , r2] = spires[i + 1], mx = (x1 + x2) / 2, hw = (x1 - x2) / 2 - (r1 + r2) * 0.45;
    for (const s of BOTH) at(arcT(hw, 0.12, PI, 14, 5), gold, mx, 3.6, s * 1.3, 0, 0, 0, 1, 1.9, 1);
  }
  // prow ram, keel fins, organ-pipe engines
  at(cone(0.55, 2.2, 8), obs, 11.6, 0.2, 0, 0, 0, -PI / 2);
  at(tor(0.6, 0.08, 16, 4), gold, 10.6, 0.2, 0, 0, PI / 2, 0);
  at(side([[3, -3.1], [-2, -3.0], [-3.2, -4.4], [-1.8, -4.3]], 0.4, 0.1), slate);
  const pipes = [[1.6, 1.2], [0.9, 1.7], [0.2, 2.1], [-0.5, 1.7], [-1.2, 1.2]];
  for (const [y, l] of pipes) for (const z of [-0.8, 0.8]) { at(cyl(0.32, 0.36, l, 12), slate, -10.4 - l / 2, y, z, 0, 0, PI / 2); at(tor(0.34, 0.05, 12, 4), gold, -10.4 - l, y, z, 0, PI / 2, 0); }
  // the core: rose window tracery, glowing heart (last node), rotating halo of spikes
  for (const s of BOTH) {
    at(tor(2.45, 0.16, 48, 6), gold, cx, cy, s * 2.05);
    at(tor(1.15, 0.1, 32, 5), gold, cx, cy, s * 2.25);
    for (let j = 0; j < 8; j++) { const a = j * PI / 4; at(box(1.3, 0.1, 0.1), gold, cx + 1.8 * Math.cos(a), cy + 1.8 * Math.sin(a), s * 2.2, 0, 0, a); }
  }
  const SP = K.group('spin', R, cx, cy, 0), sa = atK(K, SP);
  for (const s of BOTH) {
    sa(tor(2.85, 0.1, 48, 5), obs, 0, 0, s * 2.2);
    for (let j = 0; j < 16; j++) { const a = j * TAU / 16, d = v3(Math.cos(a), Math.sin(a), 0), l = j % 2 ? 0.8 : 1.3; sa(cone(0.16, l, 6), j % 2 ? gold : obs, (2.9 + l / 2) * d.x, (2.9 + l / 2) * d.y, s * 2.2, ...orient(d)); }
  }
  // lanterns (weak points 3, 4) and the core (5)
  for (const [i, x] of [[3, 5.6], [4, -5.4]]) {
    const yb = yAt(Bt, x);
    const n = K.group('node' + i, R, x, yb - 1.4, 0), na = atK(K, n);
    K.rod(gold, 0, 1.4, 0, 0, 0.6, 0, 0.06, n, 6);
    na(cone(0.55, 0.5, 8), obs, 0, 0.45, 0);
    na(cyl(0.42, 0.42, 0.9, 8, 1), vio, 0, -0.1, 0);
    na(sph(0.36, 14, 10), glow(0xb070ff, 2.6), 0, -0.1, 0);
    for (let j = 0; j < 8; j++) { const a = j * PI / 4 + PI / 8; na(box(0.07, 1.0, 0.07), gold, 0.46 * Math.cos(a), -0.1, 0.46 * Math.sin(a)); }
    na(cone(0.4, 0.6, 8), obs, 0, -0.85, 0, PI);
    nodes[i] = n;
  }
  const C = K.group('node5', R, cx, cy, 0), ca = atK(K, C);
  ca(sph(2.3, 36, 22), glow(0x8a40ff, 2.2));
  ca(sph(1.2, 24, 14), glow(0xffe0ff, 4), 0, 0, 0, 0, 0, 0, 1, 1, 2.05);
  nodes[5] = C;
  for (const s of BOTH) for (const x of [8, 3, -3, -8]) K.add(sph(0.09, 8, 6), glow(0xff5ad8, 5), x, yAt(Bt, x) + 0.3, s * (W - 0.05), 0, 0, 0, 1, 1, 1, L);
  const vents = [];
  for (const [y, l] of pipes) for (const z of [-0.8, 0.8]) vents.push([cyl(0.26, 0.26, 0.04, 12), -10.42 - l, y, z, 0, 0, PI / 2]);
  ventMesh(K, 'throne', vents, 0x9a4aff, 2.6);
  return { nodes, spin: SP };
}

const BOSS = { ark, reaper, loom, hulk, throne };
const BSCALE = { ark: 0.92, reaper: 1, loom: 1, hulk: 1, throne: 0.875 };
const BINFO = {};
export function boss(key) {
  if (!BOSS[key]) key = 'ark';
  const g = make('boss' + key, () => {
    const K = new Kit();
    K.noShadow = 'node';
    const o = BOSS[key](K);
    BINFO[key] = { n: o.nodes.length, flames: (o.flames || []).length };
    K.build();
    // an inner scale (the renderer is free to set g.scale)
    const outer = new THREE.Group();
    K.root.name = 'body'; K.root.scale.setScalar(BSCALE[key]); outer.add(K.root);
    PARTS.set(outer, PARTS.get(K.root));
    return outer;
  });
  const I = BINFO[key], nodes = [];
  for (let i = 0; i < I.n; i++) nodes.push(by(g, 'node' + i));
  const flames = []; for (let i = 0; i < I.flames; i++) flames.push(by(g, 'flame' + i));
  return { g, nodes, hatch: by(g, 'hatch') || null, spin: by(g, 'spin') || null, vents: by(g, 'vents') || null, lamps: by(g, 'lamps') || null, flames };
}

// ------------------------------------------------------------------ scenery (instanced ground props)
// Each prop is one merged geometry with vertex colours on a shared class material (+ an optional glowing
// part on the shared glow material), feet at y = 0, facing +z for the camera. Colony kit in every look.
const LOOKP = {
  verdant: { hull: 0xe6e3da, trim: 0x5f8494, dark: 0x3c4a50, win: 0xffd27a, lamp: 0xff4a3a, pad: 0x55595e },
  dune: { hull: 0xd8c09a, trim: 0xa0643a, dark: 0x5a4030, win: 0xffb860, lamp: 0xff5030, pad: 0x6a5a48 },
  frost: { hull: 0xeef2f6, trim: 0x4f7aa0, dark: 0x34465a, win: 0xffe2a8, lamp: 0xff4a3a, pad: 0x4e5866 },
  cinder: { hull: 0x77716b, trim: 0xb0682e, dark: 0x2a2624, win: 0xffa040, lamp: 0xff6020, pad: 0x3a3634 },
  umbra: { hull: 0x3e3c4c, trim: 0x7a6aa8, dark: 0x1c1a24, win: 0xc8a0ff, lamp: 0xff4ad8, pad: 0x2a2834 },
};
function prop(kind, cls, w, h, fill) {
  const base = [], lit = [];
  const P = {
    add: (g, c, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => base.push([g, mat4(x, y, z, rx, ry, rz, sx, sy, sz), typeof c === 'function' ? c : new THREE.Color(c)]),
    lit: (g, c, k, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => lit.push([g, mat4(x, y, z, rx, ry, rz, sx, sy, sz), hdr(c, k)]),
    rod: (c, ax, ay, az, bx, by_, bz, r, n = 5) => { const d = v3(bx - ax, by_ - ay, bz - az), l = d.length(); P.add(cyl(r, r, 1, n), c, (ax + bx) / 2, (ay + by_) / 2, (az + bz) / 2, ...orient(d), 1, l, 1); },
  };
  fill(P);
  const out = { kind, geo: merge(base, true), mat: M.cls[cls], w, h };
  if (lit.length) { out.glowGeo = merge(lit, true); out.glowMat = M.cls.glow; }
  return out;
}
const mix = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);
// vertex colour by height / slope / noise: c0 low, c1 high, cTop on up-facing faces above y0
const strataCol = (bands, h, cTop, k = 0.55, hard = false) => { const C = bands.map((b) => new THREE.Color(b)), T = cTop != null ? new THREE.Color(cTop) : null, o = new THREE.Color(); return (x, y, z, nx, ny) => { const f = Math.max(0, Math.min(0.999, y / h + (vnoise(x * 0.8, y * 0.8, z * 0.8) - 0.5) * (hard ? 0.04 : 0.12))) * (C.length - 1), i = Math.floor(f), fr = f - i; o.copy(C[i]).lerp(C[Math.min(C.length - 1, i + 1)], hard ? Math.max(0, Math.min(1, (fr - 0.85) / 0.15)) : fr); if (T && ny > k) o.lerp(T, Math.min(1, (ny - k) / (1 - k) * 1.6)); o.multiplyScalar(0.86 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.28); return o.clone(); }; };

function dome(p, key) {
  return prop('dome', 'build', 13.5, 5.5, (P) => {
    P.add(cyl(5.05, 5.2, 0.9, 32), p.trim, 0, 0.45, 0);
    P.add(geo('dmshell', () => new THREE.SphereGeometry(5, 32, 10, 0, TAU, 0, PI / 2)), p.hull, 0, 0.9, 0, 0, 0, 0, 1, 0.8, 1);
    for (let k = 0; k < 8; k++) P.add(arcT(5.03, 0.07, PI, 22, 4), p.dark, 0, 0.9, 0, 0, k * PI / 8, 0, 1, 0.8, 1);
    for (const t of [0.42, 0.85]) P.add(tor(5 * Math.sin(t * PI / 2 * 1.0) + 0.02, 0.07, 40, 4), p.dark, 0, 0.9 + 4 * Math.cos(t * PI / 2), 0, PI / 2);
    for (let k = 0; k < 20; k++) { const a = k * TAU / 20 + 0.08; P.lit(box(0.62, 0.32, 0.05), p.win, 2.8, 5.21 * Math.cos(a), 0.5, 5.21 * Math.sin(a), 0, PI / 2 - a, 0); }
    for (let k = 0; k < 14; k++) {
      const a = k * TAU / 14, th = 1.05, n = v3(Math.sin(th) * Math.cos(a), Math.cos(th) * 0.8, Math.sin(th) * Math.sin(a)).normalize();
      P.lit(box(0.5, 0.04, 0.34), p.win, 2.4, 5.0 * Math.sin(th) * Math.cos(a), 0.9 + 4 * Math.cos(th), 5.0 * Math.sin(th) * Math.sin(a), ...orient(n, -a + PI / 2));
    }
    P.add(cyl(0.9, 1.0, 0.5, 16), p.trim, 0, 4.95, 0);
    P.lit(cyl(0.7, 0.7, 0.08, 16), p.win, 2.2, 0, 5.22, 0);
    P.add(cyl(0.05, 0.05, 1.6, 5), p.dark, 0.5, 5.9, 0.3);
    P.lit(sph(0.12, 8, 6), p.lamp, 6, 0.5, 6.72, 0.3);
    for (const s of BOTH) {
      P.add(cyl(0.9, 0.9, 2.2, 14), p.hull, s * 5.6, 0.9, 0, 0, 0, PI / 2);
      for (const x of [5.0, 6.2]) P.add(tor(0.92, 0.08, 16, 4), p.trim, s * x, 0.9, 0, 0, PI / 2, 0);
      P.add(rbox(0.3, 1.4, 1.4, 0.06), p.dark, s * 6.75, 0.85, 0);
      P.lit(box(0.06, 0.9, 0.12), p.win, 3, s * 6.92, 0.85, 0);
    }
    P.add(cyl(5.6, 5.8, 0.12, 32), p.pad, 0, 0.06, 0);
  });
}
function tower(p) {
  return prop('tower', 'build', 5, 12.5, (P) => {
    P.add(cyl(1.7, 1.9, 2.0, 16), p.trim, 0, 1.0, 0);
    P.add(cyl(1.15, 1.25, 8.0, 16), p.hull, 0, 6.0, 0);
    for (let f = 0; f < 4; f++) {
      const y = 3.0 + f * 2.0;
      P.add(tor(1.22, 0.1, 20, 4), p.dark, 0, y, 0, PI / 2);
      for (let k = 0; k < 10; k++) { const a = k * TAU / 10 + f * 0.3; if ((k + f) % 4 === 3) continue; P.lit(box(0.42, 0.5, 0.05), p.win, 2.6, 1.24 * Math.cos(a), y + 0.85, 1.24 * Math.sin(a), 0, PI / 2 - a, 0); }
    }
    for (const s of BOTH) P.add(rbox(1.4, 1.5, 1.0, 0.1), p.trim, s * 1.4, 4.5 + s * 1.3, 0.2);
    P.lit(box(0.5, 0.2, 0.04), p.win, 2.6, 1.4, 5.9, 0.71);
    P.add(cyl(2.0, 1.6, 0.4, 16), p.trim, 0, 10.2, 0);
    P.add(cyl(0.9, 1.1, 1.0, 12), p.dark, 0, 10.9, 0);
    for (let k = 0; k < 8; k++) { const a = k * TAU / 8; P.lit(box(0.3, 0.2, 0.04), p.win, 3, 1.02 * Math.cos(a), 10.9, 1.02 * Math.sin(a), 0, PI / 2 - a, 0); }
    P.add(cone(0.35, 1.0, 8), p.hull, 0, 11.9, 0);
    P.lit(sph(0.13, 8, 6), p.lamp, 6, 0, 12.45, 0);
    for (let k = 0; k < 6; k++) { const a = k * TAU / 6; P.lit(sph(0.08, 6, 4), p.lamp, 4, 2.0 * Math.cos(a), 10.4, 2.0 * Math.sin(a)); }
  });
}
function mast(p) {
  return prop('mast', 'build', 3.5, 14, (P) => {
    const H = 12.5, legs = [0, 1, 2].map((k) => k * TAU / 3 + PI / 2), at = (a, y) => { const r = 1.3 - (1.3 - 0.3) * y / H; return [r * Math.cos(a), y, r * Math.sin(a)]; };
    for (const a of legs) P.rod(p.trim, ...at(a, 0), ...at(a, H), 0.08, 6);
    for (let y = 0; y < H - 0.5; y += 1.25) for (let k = 0; k < 3; k++) { P.rod(p.dark, ...at(legs[k], y), ...at(legs[(k + 1) % 3], y + 1.25), 0.035, 4); P.rod(p.dark, ...at(legs[k], y + 1.25), ...at(legs[(k + 1) % 3], y + 1.25), 0.035, 4); }
    P.add(cyl(0.9, 0.9, 0.15, 12), p.trim, 0, H, 0);
    P.add(lathe('mastdish', [[0.02, 0], [0.5, 0.06], [0.95, 0.24], [1.05, 0.3], [0.97, 0.29], [0.45, 0.13], [0.02, 0.08]], 18), p.hull, 0.3, H - 1.6, 0.4, 1.2, 0.4, 0);
    P.add(cyl(0.04, 0.04, 1.6, 5), p.dark, 0, H + 0.8, 0);
    P.lit(sph(0.14, 8, 6), p.lamp, 6, 0, H + 1.65, 0);
    P.lit(sph(0.1, 6, 4), p.lamp, 5, 0.85, H * 0.55, 0.3);
    P.add(rbox(1.4, 0.9, 1.0, 0.08), p.hull, 1.4, 0.45, 0.6);
    P.lit(box(0.5, 0.25, 0.04), p.win, 2.6, 1.3, 0.55, 1.11);
  });
}
function pad(p) {
  return prop('pad', 'build', 12.5, 3.2, (P) => {
    P.add(cyl(6, 6, 0.4, 6), p.pad, 0, 1.2, 0, 0, PI / 6, 0);
    for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + PI / 6; P.add(cyl(0.25, 0.32, 1.0, 8), p.dark, 4.6 * Math.cos(a), 0.5, 4.6 * Math.sin(a)); }
    P.add(washer(3.0, 3.35, 0.06), 0xd8a020, 0, 1.42, 0);
    P.add(box(2.6, 0.06, 0.4), 0xd8d8d8, 0, 1.43, 0);
    for (const s of BOTH) P.add(box(0.4, 0.06, 2.0), 0xd8d8d8, s * 1.1, 1.43, 0);
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12; P.lit(sph(0.1, 6, 4), k % 2 ? p.win : 0x7dff7a, 5, 5.5 * Math.cos(a), 1.45, 5.5 * Math.sin(a)); }
    P.add(rbox(1.6, 1.6, 1.4, 0.1), p.hull, -4.2, 2.2, 2.2);
    P.lit(box(1.1, 0.4, 0.05), p.win, 2.6, -4.2, 2.45, 2.92);
    P.add(cyl(0.04, 0.04, 1.1, 5), p.dark, -4.2, 3.5, 2.2);
    P.lit(sph(0.1, 6, 4), p.lamp, 6, -4.2, 4.1, 2.2);
  });
}
// nature
function tree(seed, cols) {
  const r = rng(seed);
  return prop('tree', 'rough', 6, 7.5, (P) => {
    const bark = strataCol([0x4a3424, 0x5e4430], 4);
    P.add(cyl(0.22, 0.38, 3.6, 7), bark, 0, 1.8, 0, 0, 0, 0.05);
    P.rod(bark, 0.1, 3.0, 0, 1.1, 4.3, 0.3, 0.14, 6);
    P.rod(bark, 0.05, 3.2, 0, -0.9, 4.5, -0.2, 0.13, 6);
    const leaf = strataCol(cols, 7.5, null);
    for (const [x, y, z, s] of [[0, 5.2, 0, 1.9], [1.3, 4.6, 0.4, 1.45], [-1.2, 4.8, -0.3, 1.5], [0.4, 6.3, 0.2, 1.3], [-0.3, 4.4, 1.0, 1.2]]) P.add(rockGeo('leaf' + (seed % 3) + s, { seed: seed + s * 7, detail: 2, amp: 0.28, freq: 1.4, base: -1 }), leaf, x, y - s * 0.9, z, r() * 3, r() * 3, 0, s, s * 0.85, s);
  });
}
function palm(seed) {
  return prop('palm', 'rough', 6, 9, (P) => {
    const bark = strataCol([0x6a5038, 0x8a7050], 8), pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([Math.sin(t * 1.4) * 1.3, t * 8.0]); }
    for (let i = 0; i < 8; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; P.rod(bark, x0, y0, 0, x1, y1, 0, 0.26 - i * 0.015, 7); P.add(tor(0.25 - i * 0.015, 0.04, 8, 3), 0x4e3a28, x1, y1, 0, PI / 2); }
    const [tx, ty] = pts[8], green = strataCol([0x2e5a22, 0x4f8a30], 9);
    for (let k = 0; k < 8; k++) {
      const a = k * TAU / 8 + seed;
      const leafG = geo('palmleaf', () => smooth(new THREE.ExtrudeGeometry(new THREE.Shape([[0, 0], [0.9, 0.28], [2.2, 0.3], [3.4, 0], [2.2, -0.3], [0.9, -0.28]].map(([x, y]) => new THREE.Vector2(x, y))), { depth: 0.04, bevelEnabled: false }).rotateX(-PI / 2), 60));
      P.add(leafG, green, tx, ty, 0, 0, a, -0.25 - (k % 3) * 0.12);
      P.add(leafG, green, tx + 3.0 * Math.cos(a) * 0.95, ty - 0.7 - (k % 3) * 0.35, -3.0 * Math.sin(a) * 0.95, 0, a, -0.85, 0.6, 1, 0.8);
    }
    for (let k = 0; k < 4; k++) P.add(sph(0.18, 8, 6), 0x5a4020, tx + 0.25 * Math.cos(k * 1.6), ty - 0.25, 0.25 * Math.sin(k * 1.6));
  });
}
function rocks(kind, seed, w, h, cols, top, n = 3) {
  const r = rng(seed);
  return prop(kind, 'rough', w, h, (P) => {
    const c = strataCol(cols, h, top);
    P.add(rockGeo(kind + seed, { seed, detail: 4, sx: w * 0.42, sy: h, sz: w * 0.34, amp: 0.3 }), c, 0, 0, 0, 0, r() * 3, 0);
    for (let k = 1; k < n; k++) { const s = 0.3 + r() * 0.25, a = r() * TAU; P.add(rockGeo(kind + seed + 'b', { seed: seed + 9, detail: 3, sx: w * 0.42, sy: h, sz: w * 0.34, amp: 0.34 }), c, Math.cos(a) * w * 0.42, 0, Math.sin(a) * w * 0.3, 0, r() * 3, 0, s); }
  });
}
function mesa(seed) {
  return prop('mesa', 'rough', 14, 10, (P) => {
    const c = strataCol([0x6a3020, 0xa04a2c, 0xd08a58, 0x8a3e24, 0xc06a40, 0xe8b080, 0x9a4a2a, 0xd8945e, 0xb05a34], 10, 0xc87a4a, 0.85, true);
    P.add(geo('mesabody' + seed, () => {
      const g = new THREE.CylinderGeometry(5.2, 6.4, 9.6, 22, 12).toNonIndexed(), q = g.attributes.position;
      for (let i = 0; i < q.count; i++) {
        const x = q.getX(i), y = q.getY(i), z = q.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z), top = y > 4.79;
        const band = (Math.sin(y * 2.3) > 0.6 ? 0.18 : 0) + (vnoise(Math.cos(a) * 3.2 + seed, y * 0.12, Math.sin(a) * 3.2) - 0.5) * 1.5 + (vnoise(a * 9, y * 0.4, 3) - 0.5) * 0.35;
        const k = r < 0.01 ? 0 : (r + band) / r;
        q.setXYZ(i, x * k, y + 4.8 + (top ? (vnoise(x * 0.5, 9, z * 0.5) - 0.5) * 0.2 : 0), z * k * 0.72);
      }
      return smooth(g, 32);
    }), c);
    P.add(rockGeo('mesatal', { seed: seed + 5, detail: 3, sx: 3, sy: 1.6, sz: 2.4, amp: 0.3 }), c, 5.6, 0, 0.8);
    P.add(rockGeo('mesatal2', { seed: seed + 8, detail: 3, sx: 2.2, sy: 1.1, sz: 1.8, amp: 0.3 }), c, -5.8, 0, 0.6);
  });
}
function hoodoo(seed) {
  return prop('hoodoo', 'rough', 5, 7.6, (P) => {
    const c = strataCol([0x7a3a22, 0xc06a40, 0xe0a878, 0xa04a2c, 0xd08a58, 0x8a4228], 7.5, 0xd0905a, 0.85, true);
    P.add(rockGeo('hdbase', { seed, detail: 4, sx: 2.2, sy: 2.4, sz: 1.8, amp: 0.25, freq: 2.0 }), c, 0, 0, 0);
    P.add(rockGeo('hdneck', { seed: seed + 3, detail: 3, sx: 1.0, sy: 2.2, sz: 0.9, amp: 0.2, freq: 2.4, base: -1 }), c, 0.2, 2.4, 0);
    P.add(rockGeo('hdcap', { seed: seed + 6, detail: 3, sx: 2.0, sy: 0.8, sz: 1.6, amp: 0.22, freq: 2.0, base: -1 }), c, 0.4, 6.0, 0, 0, 0, 0.12);
  });
}
function iceSpire(seed) {
  const r = rng(seed);
  return prop('icespire', 'gloss', 6, 11, (P) => {
    const c = strataCol([0x3a7aa8, 0x8fd0ee, 0xdff6ff], 11, null);
    for (const [x, z, L, rr, tx, tz] of [[0, 0, 11, 1.1, 0, 0], [1.3, 0.4, 7, 0.8, 0.25, 0.1], [-1.2, -0.3, 8, 0.85, -0.2, -0.1], [0.4, 1.1, 5, 0.6, 0.1, 0.3], [-0.6, 1.0, 4, 0.55, -0.2, 0.35]]) P.add(shard(L, rr, 6), c, x, -0.3, z, tz, r() * 2, -tx);
    P.add(rockGeo('icebase' + seed, { seed, detail: 3, sx: 2.6, sy: 1.0, sz: 2.2, amp: 0.3 }), 0xd8eef8, 0, 0, 0);
  });
}
function boulderSnow(seed) { return rocks('boulder', seed, 4.5, 3.2, [0x4a5866, 0x6a7a88], 0xf4f8fc, 3); }
function basalt(seed) {
  const r = rng(seed);
  return prop('basalt', 'rough', 6, 8.5, (P) => {
    const c = strataCol([0x1e1c1c, 0x34302e, 0x2a2624], 8.5, 0x4a4440, 0.9);
    for (let k = 0; k < 11; k++) {
      const a = k * 2.4, d = k ? 0.75 + (k % 3) * 0.6 : 0, x = Math.cos(a) * d, z = Math.sin(a) * d * 0.8, hh = 8.2 - d * 2.2 - r() * 1.4;
      P.add(cyl(0.55, 0.6, hh, 6), c, x, hh / 2, z, 0, r() * 1, 0);
      P.add(cyl(0.5, 0.56, 0.12, 6), 0x5a524c, x, hh + 0.02, z, (r() - 0.5) * 0.2, r(), (r() - 0.5) * 0.2);
    }
  });
}
function ventRock(seed) {
  const r = rng(seed);
  return prop('vent', 'rough', 7, 4.6, (P) => {
    const c = strataCol([0x1a1716, 0x2e2826, 0x4a3a30], 4.6, null);
    P.add(geo('ventcone', () => { const g = new THREE.LatheGeometry([[3.4, 0], [2.9, 1.2], [1.9, 3.2], [1.25, 4.2], [1.0, 4.3], [0.8, 3.7], [0.4, 3.5], [0, 3.5]].map(([a, b]) => new THREE.Vector2(a, b)), 14), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (vnoise(x * 0.9, y * 0.9, z * 0.9) - 0.5) * 0.35; p.setXYZ(i, x * k, y * (1 + (vnoise(x, 5, z) - 0.5) * 0.15), z * k); } return smooth(g, 55); }), c);
    P.lit(cyl(0.85, 0.85, 0.1, 14), 0xff6a14, 3.4, 0, 3.6, 0);
    P.lit(tor(0.98, 0.12, 20, 4), 0xff5a10, 3, 0, 4.12, 0, PI / 2);
    const rad = (y) => y < 1.2 ? 3.4 - 0.5 * y / 1.2 : y < 3.2 ? 2.9 - (y - 1.2) / 2 : 1.9 - (y - 3.2) * 0.65;
    for (const a0 of [PI / 2 + 0.3, PI / 2 - 0.9, -PI / 2 + 0.5, 0.2, PI - 0.3]) {
      let a = a0;
      for (let y = 4.05; y > 0.4; y -= 0.32) {
        a += (r() - 0.5) * 0.12;
        const rr = rad(y) * 1.12 + 0.12, n = v3(Math.cos(a) * 0.8, 0.6, Math.sin(a) * 0.8).normalize();
        P.lit(box(0.32 - y * 0.03, 0.06, 0.42), y > 3 ? 0xff7a20 : 0xff4a0a, 2.8 - (4 - y) * 0.35, rr * Math.cos(a), y, rr * Math.sin(a), ...orient(n, -a));
      }
    }
  });
}
function crystals(seed) {
  const r = rng(seed);
  return prop('crystal', 'gloss', 6, 11, (P) => {
    const c = strataCol([0x1a1030, 0x4a2a7a, 0x9a6ad8], 11, null);
    const set = [[0, 0, 10.5, 1.0, 0, 0], [1.4, 0.5, 7, 0.75, 0.3, 0.1], [-1.3, -0.2, 8, 0.8, -0.25, -0.1], [0.5, 1.2, 4.5, 0.55, 0.15, 0.35], [-0.8, 1.0, 5, 0.5, -0.3, 0.3]];
    for (const [x, z, L, rr, tx, tz] of set) { const ry = r() * 2, ax = v3(0, 1, 0).applyEuler(new THREE.Euler(tz, ry, -tx)); P.add(shard(L, rr, 6), c, x, -0.3, z, tz, ry, -tx); P.lit(shard(L * 0.3, rr * 0.5, 6), 0xb070ff, 2.6, x + ax.x * L * 0.76, -0.3 + ax.y * L * 0.76, z + ax.z * L * 0.76, tz, ry, -tx); P.lit(cyl(rr * 0.9, rr * 1.1, 0.12, 6), 0x8a40ff, 2.2, x + ax.x * 0.3, -0.3 + ax.y * 0.3, z + ax.z * 0.3, tz, ry, -tx); }
    P.add(rockGeo('crbase' + seed, { seed, detail: 3, sx: 2.5, sy: 0.9, sz: 2.0, amp: 0.3 }), 0x15121c, 0, 0, 0);
  });
}
function darkTower(p) {
  return prop('darktower', 'build', 4.5, 14.5, (P) => {
    P.add(cyl(2.0, 2.4, 1.2, 4), p.dark, 0, 0.6, 0, 0, PI / 4, 0);
    P.add(cyl(0.9, 1.5, 11.0, 4), p.hull, 0, 6.7, 0, 0, PI / 4, 0);
    P.add(cone(0.9, 2.4, 4), p.dark, 0, 13.4, 0, 0, PI / 4, 0);
    for (let k = 0; k < 4; k++) {
      const a = k * PI / 2;
      for (let j = 0; j < 6; j++) { const y = 2.5 + j * 1.6, rr = (1.5 - (1.5 - 0.9) * (y - 1.2) / 11) * 0.7071 + 0.03; if ((j + k) % 3 === 2) continue; P.lit(box(0.18, 0.9, 0.05), j > 3 ? p.lamp : p.win, 3, rr * Math.sin(a), y, rr * Math.cos(a), 0, a, 0); }
    }
    for (const y of [4.2, 8.0, 11.2]) { const rr = 1.5 - (1.5 - 0.9) * (y - 1.2) / 11; P.add(cyl(rr + 0.25, rr + 0.12, 0.3, 4), p.dark, 0, y, 0, 0, PI / 4, 0); }
    P.lit(cyl(0.95, 0.95, 0.12, 4), p.win, 2.4, 0, 12.25, 0, 0, PI / 4, 0);
    P.lit(shard(1.2, 0.2, 4), p.lamp, 5, 0, 14.5, 0);
  });
}
const NATURE = {
  verdant: (p) => [tree(3, [0x24461c, 0x3c6e28, 0x5a9a38]), tree(8, [0x2a5020, 0x467a2c, 0x7aa83e]), palm(1.3), rocks('rock', 4, 4, 2.4, [0x4a4a46, 0x6a6862], 0x4a7a30, 3)],
  dune: (p) => [mesa(5), hoodoo(7), rocks('dunestone', 11, 5, 2.6, [0x8a4a2a, 0xc07a4a], 0xd8a070, 3)],
  frost: (p) => [iceSpire(2), iceSpire(9), boulderSnow(6)],
  cinder: (p) => [basalt(4), ventRock(3), rocks('cinderrock', 13, 4, 2.2, [0x1a1818, 0x3a3230], 0x2a2422, 3)],
  umbra: (p) => [crystals(5), crystals(12), darkTower(p)],
};
const SCN = new Map();
export function scenery(lookKey) {
  if (!LOOKP[lookKey]) lookKey = 'verdant';
  if (!SCN.has(lookKey)) { const p = LOOKP[lookKey]; SCN.set(lookKey, [dome(p, lookKey), tower(p), mast(p), pad(p), ...NATURE[lookKey](p)]); }
  return SCN.get(lookKey);
}

// nominal sizes (m): lengths along x, the settler's height, the lifter's width
export const SIZE = { ship: 3.4, lifter: 2.4, husk: 2.0, sower: 3.0, mine: 0.6, hive: 2.6, stinger: 0.9, prowler: 3.2, skimmer: 1.4, settler: 0.9, pod: 0.9, ark: 22, reaper: 19.5, loom: 18.3, hulk: 18.8, throne: 22 };
export const GEO = { box, cyl, sph, cap, tor, rbox, slab, side, washer, cone, ico, shard };
// a plain mesh helper
export function add(p, g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
