// Sini 2026 3D models with physically based materials: the Prospector gunship, gatherer drones, reaver
// fighters, power-up pods and the five constructs (a glowing core, a mechanical iris and 24 armour plates).
// Each model is built once from many detailed parts (bevelled armour plates, turned parts, greebles, lamps),
// every static part is merged into one mesh per material class per moving joint, and later copies are cheap
// clones that share geometry. A panel normal map adds seams, rivets and scratches to painted metal.
// Every model faces +x with Y up; the renderer turns it with rotation.y = -heading. The camera looks down at
// about 65 degrees, so the tops carry the detail: plate breaks, insets, grilles, lamps and glowing vents.
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
    if (col) { const C = list[pi][2]; for (let k = 0; k < c; k++) { col[(o + k) * 3] = C.r; col[(o + k) * 3 + 1] = C.g; col[(o + k) * 3 + 2] = C.b; } }
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

// ------------------------------------------------------------------ the Prospector gunship (player)
// ~3.2 m long, 2.6 m span: armoured hull, cockpit canopy, twin wing-root cannons, twin engines and a rack of
// six NOVA CHARGES on the spine. bank = the whole body (the renderer rolls bank.rotation.x when turning).
export function ship(color = 0x3d7fd9, accent = 0xffc65a) {
  const g = make('ship' + color + ':' + accent, () => {
    const K = new Kit();
    const B = K.group('bank');
    const body = paint(color, 0.34, 0.5), dark = paint(0x2f333a, 0.4, 0.75), grey = paint(0x9299a2, 0.34, 0.7), acc = paint(accent, 0.4, 0.4), blk = M.black;
    const hot = new THREE.Color(accent).lerp(new THREE.Color(0xffffff), 0.55).getHex();
    const at = (gm, mt, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => K.add(gm, mt, x, y, z, rx, ry, rz, sx, sy, sz, B);
    // hull: dark lower hull, belly plate, livery spine in three sections
    at(slab(sym([[1.55, 0.1], [1.2, 0.3], [0.5, 0.44], [-0.6, 0.48], [-1.25, 0.42], [-1.32, 0.2]]), 0.34, 0.06), dark, 0, 0, 0);
    at(slab(sym([[1.1, 0.16], [0.4, 0.32], [-1.0, 0.34]]), 0.08, 0.03), blk, 0, -0.19, 0);
    at(slab(sym([[1.5, 0.06], [1.2, 0.22], [0.98, 0.27]]), 0.14, 0.05), body, 0, 0.2, 0);
    at(slab(sym([[0.94, 0.28], [0.3, 0.34], [0.0, 0.35]]), 0.14, 0.05), grey, 0, 0.2, 0);
    at(slab(sym([[-0.04, 0.35], [-0.6, 0.37], [-1.18, 0.3]]), 0.14, 0.05), body, 0, 0.2, 0);
    at(slab([[1.42, 0], [1.12, 0.22], [1.03, 0.22], [1.32, 0], [1.03, -0.22], [1.12, -0.22]], 0.02, 0.005), acc, 0, 0.275, 0);   // nose chevron
    for (const s of [-1, 1]) at(box(1.0, 0.02, 0.07), acc, -0.62, 0.275, s * 0.3);                                                   // spine stripes
    // cockpit
    at(sph(0.3, 24, 14), M.glass, 0.5, 0.3, 0, 0, 0, 0, 1.55, 0.6, 0.78);
    at(tor(0.3, 0.028, 32, 6), grey, 0.5, 0.29, 0, Math.PI / 2, 0, 0, 1.55, 0.78, 1);
    at(arcT(0.235, 0.022, Math.PI, 16, 6), grey, 0.42, 0.3, 0, 0, Math.PI / 2, 0, 1, 0.75, 1);
    at(box(0.72, 0.028, 0.035), grey, 0.5, 0.475, 0);
    at(sph(0.07, 12, 8), M.glass, 1.25, 0.28, 0);
    // NOVA CHARGE rack: tray, rails and six charges in cups
    at(rbox(0.8, 0.08, 0.46, 0.03), blk, -0.62, 0.3, 0);
    for (const s of [-1, 1]) at(box(0.86, 0.05, 0.04), M.frame, -0.62, 0.35, s * 0.21);
    for (const x of [-0.2, -1.04]) at(box(0.04, 0.05, 0.46), M.frame, x, 0.35, 0);
    for (const x of [-0.38, -0.62, -0.86]) for (const s of [-1, 1]) { at(cyl(0.085, 0.07, 0.06, 12), M.steel, x, 0.36, s * 0.1); at(sph(0.068, 12, 8), glow(accent, 3.2), x, 0.41, s * 0.1); }
    const rack = K.group('rack', B, -0.62, 0.5, 0);
    // intakes beside the cockpit
    for (const s of [-1, 1]) {
      at(rbox(0.42, 0.14, 0.16, 0.03), dark, 0.12, 0.22, s * 0.41);
      at(box(0.02, 0.1, 0.13), blk, 0.335, 0.22, s * 0.41);
      for (let k = -1; k <= 1; k++) at(box(0.3, 0.015, 0.02), M.frame, 0.12, 0.295, s * 0.41 + k * 0.045);
      at(rbox(1.2, 0.16, 0.06, 0.02), grey, -0.1, -0.02, s * 0.49);                                               // side skirt armour
    }
    // wings with leading-edge armour, livery stripe, tip pods and nav lights
    for (const s of [-1, 1]) {
      const W = (pts) => pts.map(([x, z]) => [x, s * z]);
      at(slab(W([[0.25, 0.42], [-0.55, 1.28], [-0.98, 1.3], [-0.95, 0.42]]), 0.1, 0.03), body, 0, 0.02, 0);
      at(slab(W([[0.3, 0.42], [-0.5, 1.3], [-0.62, 1.3], [0.12, 0.42]]), 0.12, 0.03), grey, 0, 0.02, 0);
      at(slab(W([[-0.31, 1.0], [-0.4, 1.1], [-0.97, 1.1], [-0.96, 1.0]]), 0.115, 0.02), acc, 0, 0.02, 0);
      at(slab(W([[-0.2, 0.55], [-0.44, 0.88], [-0.86, 0.88], [-0.84, 0.55]]), 0.11, 0.02), dark, 0, 0.02, 0);
      at(cyl(0.065, 0.065, 0.55, 10), dark, -0.72, 0.03, s * 1.3, 0, 0, Math.PI / 2);
      at(sph(0.045, 8, 6), glow(s < 0 ? 0xff3a2a : 0x5dff7a, 5), -0.43, 0.03, s * 1.3);
      at(sph(0.03, 8, 6), glow(0xffffff, 5), -1.0, 0.03, s * 1.3);
      // canted tail fins on the engines
      at(rbox(0.5, 0.34, 0.045, 0.015), body, -1.08, 0.36, s * 0.42, s * 0.35, 0, 0.25);
      at(rbox(0.16, 0.07, 0.05, 0.015), acc, -1.17, 0.52, s * 0.47, s * 0.35, 0, 0.25);
    }
    // twin wing-root cannons
    const muz = [];
    [-1, 1].forEach((s, i) => {
      const z = s * 0.64;
      at(rbox(0.75, 0.2, 0.24, 0.05), dark, 0.02, 0.15, z);
      at(rbox(0.36, 0.13, 0.15, 0.03), grey, 0.52, 0.15, z);
      at(cyl(0.045, 0.045, 0.82, 10), M.steel, 0.92, 0.15, z, 0, 0, Math.PI / 2);
      for (const x of [0.75, 0.9, 1.05]) at(tor(0.06, 0.014, 12, 6), M.frame, x, 0.15, z, 0, Math.PI / 2, 0);
      at(cyl(0.07, 0.07, 0.12, 10), blk, 1.35, 0.15, z, 0, 0, Math.PI / 2);
      at(box(0.06, 0.02, 0.15), blk, 1.35, 0.225, z);
      at(rbox(0.3, 0.1, 0.12, 0.02), acc, -0.15, 0.27, z);
      muz.push(K.group('muzzle' + i, B, 1.43, 0.15, z));
    });
    // twin engines: nacelles, rings, heat fins, bells, hot discs and plumes
    const flames = [];
    [-1, 1].forEach((s, i) => {
      const z = s * 0.34;
      at(cyl(0.21, 0.23, 0.85, 16), dark, -0.95, 0.04, z, 0, 0, Math.PI / 2);
      at(tor(0.21, 0.035, 16, 6), M.frame, -0.52, 0.04, z, 0, Math.PI / 2, 0);
      for (const x of [-0.8, -1.15]) at(tor(0.232, 0.02, 20, 6), M.steel, x, 0.04, z, 0, Math.PI / 2, 0);
      for (let k = -1; k <= 1; k++) at(box(0.5, 0.06, 0.02), M.frame, -0.95, 0.26, z + k * 0.07);
      at(lathe('shipbell', [[0.19, 0], [0.21, 0.02], [0.25, 0.24], [0.235, 0.26], [0.17, 0.05], [0.19, 0]], 18), M.frame, -1.36, 0.04, z, 0, 0, Math.PI / 2);
      at(cyl(0.17, 0.17, 0.02, 16), glow(hot, 4), -1.43, 0.04, z, 0, 0, Math.PI / 2);
      flames.push(K.mesh(plume(0.17, accent), flameMat(), 'flame' + i, -1.44, 0.04, z, 0, 0, 0, B));
    });
    at(rbox(0.3, 0.2, 0.36, 0.05), blk, -1.3, 0.05, 0);
    for (const s of [-1, 1]) at(sph(0.025, 6, 4), glow(0xff3a2a, 4), -1.46, 0.13, s * 0.1);
    // nose: headlights, chin cutter for prospecting, antenna
    for (const s of [-1, 1]) at(cyl(0.035, 0.035, 0.03, 10), glow(0xfff2d8, 5), 1.5, 0.06, s * 0.09, 0, 0, Math.PI / 2);
    at(cyl(0.07, 0.08, 0.1, 10), M.frame, 1.55, -0.06, 0, 0, 0, Math.PI / 2);
    at(cone(0.06, 0.3, 8), M.steel, 1.74, -0.06, 0, 0, 0, -Math.PI / 2);
    K.rod(M.steel, -0.95, 0.27, -0.25, -1.0, 0.62, -0.27, 0.008, B, 4);
    at(sph(0.022, 6, 4), glow(0xff3a2a, 5), -1.0, 0.63, -0.27);
    K.build();
    return K.root;
  });
  return { g, bank: by(g, 'bank'), flames: [by(g, 'flame0'), by(g, 'flame1')], muzzles: [by(g, 'muzzle0'), by(g, 'muzzle1')], rack: by(g, 'rack') };
}

// ------------------------------------------------------------------ gatherer drone
// ~1.6 m mining drone: ceramic hull, hopper hatch, side thrusters, a pulsing sensor lamp and a three-claw
// grabber under the nose. The claws are three empty Groups (rotation.z opens them, 0 shut .. ~0.7 open) that
// drive one instanced mesh, so the whole drone stays at five draw calls.
let LAMP = null;
export function gatherer() {
  const g = make('gatherer', () => {
    const K = new Kit();
    const body = K.group('body');
    const hull = paint(0xcfc8b8, 0.42, 0.3), hz = paint(0xe07a26, 0.42, 0.35), dk = paint(0x33363c, 0.42, 0.7), grey = paint(0x878d95, 0.32, 0.85), blk = M.black;
    const at = (gm, mt, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => K.add(gm, mt, x, y, z, rx, ry, rz, sx, sy, sz, body);
    at(slab(sym([[0.44, 0.17], [0.3, 0.34], [-0.3, 0.38], [-0.5, 0.26]]), 0.32, 0.07), hull, 0, 0.02, 0);
    at(slab(sym([[0.36, 0.1], [0.3, 0.2], [-0.3, 0.24]]), 0.12, 0.03), dk, 0, -0.17, 0);
    at(slab(sym([[0.25, 0.24], [-0.36, 0.27]]), 0.06, 0.02), hz, 0, 0.2, 0);
    at(slab(sym([[0.19, 0.18], [-0.3, 0.21]]), 0.05, 0.015), dk, 0, 0.225, 0);
    for (let k = 0; k < 4; k++) at(box(0.04, 0.02, 0.34), grey, -0.22 + k * 0.13, 0.255, 0);
    for (const s of [-1, 1]) at(box(0.42, 0.03, 0.05), hz, -0.05, 0.19, s * 0.33);
    // sensor turret and lamp
    at(cyl(0.11, 0.13, 0.12, 14), dk, 0.3, 0.24, 0);
    at(tor(0.085, 0.02, 14, 6), grey, 0.37, 0.28, 0, 0, Math.PI / 2, 0);
    LAMP = LAMP || new THREE.MeshBasicMaterial({ color: hdr(0x6ff7e6, 4), toneMapped: false });
    K.mesh(sph(0.075, 14, 10), LAMP, 'lamp', 0.38, 0.28, 0, 0, 0, 0, body);
    // side thrusters, struts, radiators
    for (const s of [-1, 1]) {
      at(cyl(0.11, 0.12, 0.44, 14), hz, -0.2, 0.0, s * 0.47, 0, 0, Math.PI / 2);
      at(box(0.24, 0.08, 0.12), dk, -0.2, 0.0, s * 0.37);
      at(lathe('gabell', [[0.08, 0], [0.09, 0.02], [0.115, 0.1], [0.1, 0.11], [0.07, 0.03], [0.08, 0]], 14), dk, -0.42, 0, s * 0.47, 0, 0, Math.PI / 2);
      at(tor(0.075, 0.02, 14, 6), glow(0xffb070, 3.5), -0.47, 0, s * 0.47, 0, Math.PI / 2, 0);
      at(cyl(0.085, 0.085, 0.02, 12), blk, 0.03, 0, s * 0.47, 0, 0, Math.PI / 2);
      for (const x of [-0.08, -0.32]) at(tor(0.118, 0.012, 14, 4), grey, x, 0, s * 0.47, 0, Math.PI / 2, 0);
      at(slab([[0.0, s * 0.6], [-0.1, s * 0.8], [-0.34, s * 0.8], [-0.3, s * 0.6]], 0.03, 0.01), dk, 0, 0.05, 0);
      at(box(0.2, 0.035, 0.04), hz, -0.22, 0.05, s * 0.8);
      at(sph(0.03, 8, 6), glow(0x7dff9a, 4), -0.48, 0.12, s * 0.2);
    }
    at(cyl(0.035, 0.035, 0.05, 10), glow(0xffa030, 5), -0.38, 0.28, 0);
    K.rod(grey, -0.15, 0.25, 0.18, -0.2, 0.55, 0.2, 0.008, body, 4);
    // grabber collar under the nose
    at(cyl(0.14, 0.16, 0.16, 14), dk, 0.42, -0.08, 0, 0, 0, Math.PI / 2);
    at(tor(0.15, 0.02, 16, 6), grey, 0.5, -0.08, 0, 0, Math.PI / 2, 0);
    K.mesh(plume(0.08, 0xffa060, [-0.47, 0.47]), flameMat(), 'flame', -0.48, 0, 0, 0, 0, 0, body);
    // claws: three pivots round the grabber axis, fingers reaching inward to the cargo point
    [Math.PI / 3, -Math.PI / 3, Math.PI].forEach((b, i) => { const c = K.group('claw' + i, body, 0.5, -0.08 + 0.12 * Math.cos(b), 0.12 * Math.sin(b)); c.rotation.x = b; });
    K.group('cargo', body, 0.84, -0.08, 0);
    const C = new Kit(), orange = tint(0xe07a26), dark = tint(0x3a3e45), steel = tint(0xb4bac2);
    C.add(cyl(0.045, 0.045, 0.1, 10), dark, 0, 0, 0, Math.PI / 2);
    C.add(rbox(0.27, 0.05, 0.075, 0.015), orange, 0.13, 0.025, 0, 0, 0, 0.12);
    C.add(sph(0.035, 8, 6), dark, 0.26, 0.05, 0);
    C.add(rbox(0.2, 0.045, 0.06, 0.015), dark, 0.34, -0.005, 0, 0, 0, -0.6);
    C.add(cone(0.032, 0.13, 6), steel, 0.45, -0.1, 0, 0, 0, -2.62);
    C.rod(steel, 0.04, 0.06, 0, 0.24, 0.075, 0, 0.012, C.root, 6);
    C.build();
    const clawI = new THREE.InstancedMesh(C.root.children[0].geometry, M.cls.metal, 3);
    clawI.name = 'clawI'; clawI.castShadow = true; clawI.receiveShadow = true; clawI.frustumCulled = false;
    body.add(clawI);
    K.build();
    return K.root;
  });
  const body = by(g, 'body'), claws = [0, 1, 2].map((i) => by(g, 'claw' + i)), clawI = by(g, 'clawI');
  // the claw instances follow the claw Groups every time the scene graph updates its matrices
  clawI.updateMatrixWorld = function (force) {
    for (let i = 0; i < 3; i++) { claws[i].updateMatrix(); this.setMatrixAt(i, claws[i].matrix); }
    this.instanceMatrix.needsUpdate = true;
    THREE.InstancedMesh.prototype.updateMatrixWorld.call(this, force);
  };
  clawI.updateMatrixWorld(false);
  return { g, body, claws, cargo: by(g, 'cargo'), lamp: by(g, 'lamp'), flames: [by(g, 'flame')] };
}

// ------------------------------------------------------------------ reaver fighter
// ~2.6 m hunter: dark gunmetal, forward-swept wings with red leading edges, forked nose with the weapon
// emitter on top (its own material, named 'emitter', for the firing tell), twin close-set engines.
export function reaver() {
  const g = make('reaver', () => {
    const K = new Kit();
    const B = K.group('bank');
    const gm = paint(0x2c3036, 0.36, 0.8), dk = paint(0x17181c, 0.4, 0.6), red = paint(0xa8141a, 0.35, 0.45), grey = paint(0x5b6068, 0.34, 0.8), blk = M.black;
    const at = (gq, mt, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => K.add(gq, mt, x, y, z, rx, ry, rz, sx, sy, sz, B);
    at(slab(sym([[1.3, 0.05], [0.8, 0.18], [0.15, 0.28], [-0.7, 0.3], [-1.2, 0.2]]), 0.28, 0.05), gm, 0, 0, 0);
    at(slab(sym([[1.0, 0.04], [0.3, 0.14], [-0.9, 0.16], [-1.15, 0.1]]), 0.12, 0.03), dk, 0, 0.17, 0);
    at(slab([[0.6, 0.02], [-0.85, 0.035], [-0.85, -0.035], [0.6, -0.02]], 0.02, 0.005), red, 0, 0.235, 0);
    at(slab(sym([[0.9, 0.08], [0.2, 0.2], [-0.9, 0.22]]), 0.08, 0.03), blk, 0, -0.16, 0);
    // forward-swept wings
    for (const s of [-1, 1]) {
      const W = (pts) => pts.map(([x, z]) => [x, s * z]);
      at(slab(W([[-0.2, 0.28], [0.32, 1.12], [0.14, 1.22], [-0.88, 0.3]]), 0.07, 0.02), gm, 0, 0, 0);
      at(slab(W([[-0.16, 0.28], [0.34, 1.1], [0.27, 1.15], [-0.28, 0.29]]), 0.08, 0.02), red, 0, 0, 0);
      at(slab(W([[-0.45, 0.42], [0.0, 0.95], [-0.12, 1.0], [-0.72, 0.42]]), 0.075, 0.015), dk, 0, 0, 0);
      at(box(0.62, 0.012, 0.03), glow(0xff2a1a, 3), -0.2, 0.042, s * 0.74, 0, -s * 1.017, 0);
      at(cone(0.045, 0.42, 5), M.steel, 0.44, 0.0, s * 1.15, 0, 0, -Math.PI / 2);
      at(slab(W([[0.85, 0.16], [0.97, 0.42], [0.88, 0.46], [0.6, 0.2]]), 0.04, 0.01), dk, 0, 0.05, 0);               // canards
      at(rbox(0.36, 0.12, 0.1, 0.03), blk, 0.2, 0.06, s * 0.3);                                                       // intakes
      at(rbox(0.55, 0.1, 0.08, 0.03), dk, 1.18, 0.02, s * 0.12, 0, s * 0.12, 0);                                      // nose prongs
      at(cone(0.04, 0.16, 4), M.steel, 1.5, 0.02, s * 0.085, 0, 0, -Math.PI / 2);
      at(rbox(0.46, 0.3, 0.035, 0.012), dk, -0.98, 0.3, s * 0.2, s * 0.5, 0, 0.3);                                  // canted tail fins
      at(box(0.14, 0.05, 0.045), red, -1.08, 0.44, s * 0.27, s * 0.5, 0, 0.3);
      at(box(0.12, 0.012, 0.03), glow(0xff2a1a, 3.5), -0.55, 0.16, s * 0.27);
    }
    // gun, emitter housing and the emitter itself
    at(cyl(0.035, 0.035, 0.6, 8), M.steel, 1.12, -0.03, 0, 0, 0, Math.PI / 2);
    at(cyl(0.16, 0.19, 0.09, 18), grey, 1.0, 0.16, 0);
    at(tor(0.155, 0.025, 22, 6), M.frame, 1.0, 0.215, 0, Math.PI / 2);
    for (const s of [-1, 1]) at(rbox(0.12, 0.08, 0.05, 0.015), M.frame, 1.0, 0.22, s * 0.17);
    const em = new THREE.MeshBasicMaterial({ color: hdr(0xff2a1a, 1.6), toneMapped: false }); em.name = 'emitter';
    K.mesh(sph(0.125, 18, 12), em, 'emitter', 1.0, 0.25, 0, 0, 0, 0, B);
    K.group('muzzle', B, 1.44, -0.03, 0);
    // canopy and sensor strip
    at(sph(0.2, 16, 10), M.glass, 0.45, 0.2, 0, 0, 0, 0, 1.8, 0.45, 0.55);
    at(box(0.3, 0.015, 0.025), glow(0xff2a1a, 4), 0.75, 0.19, 0);
    // twin engines
    for (const s of [-1, 1]) {
      at(cyl(0.12, 0.13, 0.5, 12), dk, -1.05, 0.02, s * 0.14, 0, 0, Math.PI / 2);
      at(lathe('rvbell', [[0.1, 0], [0.11, 0.02], [0.14, 0.14], [0.13, 0.15], [0.09, 0.03], [0.1, 0]], 14), M.frame, -1.3, 0.02, s * 0.14, 0, 0, Math.PI / 2);
      at(cyl(0.1, 0.1, 0.02, 12), glow(0xff6a4a, 4), -1.34, 0.02, s * 0.14, 0, 0, Math.PI / 2);
      at(tor(0.125, 0.012, 14, 4), M.steel, -0.92, 0.02, s * 0.14, 0, Math.PI / 2, 0);
    }
    K.mesh(plume(0.1, 0xff3a24, [-0.14, 0.14]), flameMat(), 'flame', -1.36, 0.02, 0, 0, 0, 0, B);
    K.build();
    return K.root;
  });
  return { g, bank: by(g, 'bank'), emitter: by(g, 'emitter'), muzzle: by(g, 'muzzle'), flames: [by(g, 'flame')] };
}

// ------------------------------------------------------------------ power-up pod
// ~1 m armoured capsule lying along x: chrome caps, armour slats over a glowing core band (core = the band)
export function pod(color) {
  const g = make('pod' + color, () => {
    const K = new Kit();
    const dk = paint(0x2a2e35, 0.38, 0.7), arm = paint(0xb9bec6, 0.3, 0.8);
    const capP = [[0, 0.24], [0.14, 0.22], [0.24, 0.15], [0.28, 0.06], [0.28, 0.0]];
    K.add(lathe('podcap', capP, 22), arm, 0.2, 0, 0, 0, 0, -Math.PI / 2);
    K.add(lathe('podcap', capP, 22), arm, -0.2, 0, 0, 0, 0, Math.PI / 2);
    for (const x of [-0.21, 0.21]) K.add(tor(0.285, 0.03, 26, 6), M.steel, x, 0, 0, 0, Math.PI / 2, 0);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; K.add(rbox(0.46, 0.05, 0.15, 0.02), dk, 0, 0.27 * Math.cos(a), 0.27 * Math.sin(a), a, 0, 0); }
    for (const x of [-0.17, 0.17]) K.add(tor(0.27, 0.025, 26, 6), M.frame, x, 0, 0, 0, Math.PI / 2, 0);
    for (const s of [-1, 1]) {
      K.add(sph(0.05, 10, 8), glow(color, 5), s * 0.45, 0, 0);
      for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU; K.add(box(0.14, 0.03, 0.03), dk, s * 0.33, 0.25 * Math.cos(a), 0.25 * Math.sin(a), a, 0, 0); }
    }
    K.mesh(cyl(0.24, 0.24, 0.3, 24), glow(color, 4), 'core', 0, 0, 0, 0, 0, Math.PI / 2);
    K.build();
    return K.root;
  });
  return { g, core: by(g, 'core') };
}

// ------------------------------------------------------------------ constructs
// The colossal boss of each sector: a glowing core, a mechanical iris on top (+y, facing the camera), a
// skeleton chassis and 24 armour plates. Plates are self-contained Groups (centred on their slot) in build
// order: inner/lower layer first, outer/top last, each layer spread round the body.
const ORD6 = [0, 3, 1, 4, 2, 5], ORD8 = [0, 4, 2, 6, 1, 5, 3, 7];
const CINFO = {};
// a plate template: parts added in construct space for one slot, merged per material, re-centred
function tpl(fill) {
  const K = new Kit();
  fill(K, K.root);
  const root = K.build();
  const b = new THREE.Box3();
  for (const m of root.children) { m.geometry.computeBoundingBox(); b.union(m.geometry.boundingBox); }
  const c = b.getCenter(v3());
  const meshes = root.children.map((m) => { m.geometry.translate(-c.x, -c.y, -c.z); m.geometry.computeBoundingSphere(); return { geometry: m.geometry, material: m.material, shadow: m.castShadow }; });
  return { meshes, c, mm: null };
}
function mirrorZ(src) {
  const g = src.clone(); g.scale(1, 1, -1);
  for (const k in g.attributes) { const at = g.attributes[k], a = at.array, s = at.itemSize; for (let i = 0; i < at.count; i += 3) for (let j = 0; j < s; j++) { const t = a[(i + 1) * s + j]; a[(i + 1) * s + j] = a[(i + 2) * s + j]; a[(i + 2) * s + j] = t; } }
  g.computeBoundingSphere();
  return g;
}
// place a plate (template turned to angle a about y, or mirrored to -z) as its own Group under root
function put(list, root, T, a = 0, mirror = false) {
  if (mirror && !T.mm) T.mm = T.meshes.map((q) => ({ ...q, geometry: mirrorZ(q.geometry) }));
  const src = mirror ? T.mm : T.meshes, cx = T.c.x, cz = mirror ? -T.c.z : T.c.z, ca = Math.cos(a), sa = Math.sin(a);
  const g = new THREE.Group();
  g.position.set(cx * ca - cz * sa, T.c.y, cx * sa + cz * ca);
  g.rotation.y = -a;
  for (const q of src) { const m = new THREE.Mesh(q.geometry, q.material); m.castShadow = q.shadow; m.receiveShadow = true; g.add(m); }
  root.add(g); list.push(g);
  return g;
}
// the core (sphere + energy column + well floor + iris lip, one mesh with its own material), the iris
// housing and blades (one instanced mesh) and gimbal rings round the core
function coreIris(K, C, o) {
  const cx = o.cx || 0, cz = o.cz || 0, H = o.top, Ri = o.Ri, Rh = o.Rh, N = o.N || 8, sy = o.sy || 1;
  const mat = new THREE.MeshBasicMaterial({ color: hdr(o.core, 2.4), toneMapped: false }); mat.name = 'core';
  const I = (x, y, z, rx = 0, sx = 1, sY = 1, sz = 1) => new THREE.Matrix4().compose(v3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, 0)), v3(sx, sY, sz));
  const colB = o.cy + o.rc * sy * 0.5, colH = H - 0.32 - colB;
  // the core mesh sits at the core centre (its world position is the core), the column reaches up from it
  const core = new THREE.Mesh(merge([
    [sph(o.rc, 32, 20), I(0, 0, 0, 0, 1, sy, 1)],
    [cyl(Ri * 0.75, Ri * 0.75, colH, 20), I(0, colB + colH / 2 - o.cy, 0)],
    [cyl(Ri * 1.04, Ri * 1.04, 0.05, 32), I(0, H - 0.32 - o.cy, 0)],
    [tor(Ri + 0.012, 0.028, 48, 4), I(0, H + 0.12 - o.cy, 0, Math.PI / 2)],
  ], false), mat);
  core.name = 'core'; core.position.set(cx, o.cy, cz);
  K.root.add(core);
  // housing: bevelled ring, outer collar, pivot caps, bolts
  K.add(washer(Ri, Rh, 0.28, 0.05), o.trim, cx, H, cz);
  K.add(washer(Rh - 0.05, Rh + 0.16, 0.2, 0.05), o.dark, cx, H - 0.1, cz);
  const D = TAU / N, sw = 0.5, ov = 0.16, Rb = Ri + 0.15;
  const e0 = (r) => sw * r / Ri, e1 = (r) => D + ov + sw * r / Ri;
  for (let i = 0; i < N; i++) {
    const a = i * D + e1(Rb), b = a + D / 2, rr = (Rb + Rh) / 2 + 0.12;
    K.add(cyl(0.1, 0.12, 0.08, 10), o.bolt, cx + Rb * Math.cos(a), H + 0.17, cz + Rb * Math.sin(a));
    K.add(cyl(0.05, 0.05, 0.05, 8), o.bolt, cx + rr * Math.cos(b), H + 0.15, cz + rr * Math.sin(b));
    // a hydraulic ram per blade lying round the ring: cylinder, rod and end blocks
    const ra = (Ri + Rh) / 2 + 0.04, c0 = a + D * 0.12, c1 = a + D * 0.62, q0 = [cx + ra * Math.cos(c0), cz + ra * Math.sin(c0)], q1 = [cx + ra * Math.cos(c1), cz + ra * Math.sin(c1)], qm = [(q0[0] * 0.55 + q1[0] * 0.45), (q0[1] * 0.55 + q1[1] * 0.45)];
    K.rod(o.dark, q0[0], H + 0.2, q0[1], qm[0], H + 0.2, qm[1], 0.055, K.root, 8);
    K.rod(M.chrome, qm[0], H + 0.2, qm[1], q1[0], H + 0.2, q1[1], 0.028, K.root, 6);
    for (const q of [q0, q1]) K.add(rbox(0.13, 0.1, 0.13, 0.03), o.dark, q[0], H + 0.17, q[1], 0, -a, 0);
  }
  K.add(tor(Rh - 0.02, 0.03, 64, 4), M.steel, cx, H + 0.13, cz, Math.PI / 2);
  // blades: spiral-edged sectors that meet in the middle when shut and swing out under the housing round a
  // pivot on the rim when open; each blade ramps up across its width so neighbours overlap like shingles
  const pts = [];
  for (let k = 0; k <= 8; k++) { const r = Rb * k / 8; pts.push([r * Math.cos(e0(r)), r * Math.sin(e0(r))]); }
  for (let k = 1; k < 5; k++) { const a = e0(Rb) + (e1(Rb) - e0(Rb)) * k / 5; pts.push([Rb * Math.cos(a), Rb * Math.sin(a)]); }
  for (let k = 8; k >= 1; k--) { const r = Rb * k / 8; pts.push([r * Math.cos(e1(r)), r * Math.sin(e1(r))]); }
  const pv = [Rb * Math.cos(e1(Rb)), Rb * Math.sin(e1(Rb))];
  const bg = slab(pts, 0.04, 0.012).clone(), bp = bg.attributes.position;
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), z = bp.getZ(i), r = Math.hypot(x, z); let f = 0.5; if (r > 0.04) f = Math.min(1, Math.max(0, (Math.atan2(z, x) - e0(r)) / (D + ov))); bp.setY(i, bp.getY(i) + f * 0.07); }
  bg.translate(-pv[0], 0, -pv[1]); bg.computeVertexNormals();
  const mid = (r) => { const a = e0(r) + (D + ov) * 0.5; return [r * Math.cos(a), r * Math.sin(a)]; }, P1 = mid(Ri * 0.38), P2 = mid(Ri * 0.92);
  const len = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]);
  const ribM = new THREE.Matrix4().compose(v3((P1[0] + P2[0]) / 2 - pv[0], 0.075, (P1[1] + P2[1]) / 2 - pv[1]), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.atan2(P2[1] - P1[1], P2[0] - P1[0]), 0)), v3(1, 1, 1));
  const iris = new THREE.InstancedMesh(merge([[bg, new THREE.Matrix4(), new THREE.Color(o.blade)], [box(len, 0.03, 0.08), ribM, new THREE.Color(o.edge)]], true), M.cls.metal, N);
  bg.dispose();
  iris.name = 'iris'; iris.castShadow = true; iris.receiveShadow = true; iris.frustumCulled = false;
  K.root.add(iris);
  CINFO[C.key].iris = { N, cx, cz, y: H - 0.06, pv, phi: o.phi || 1.75, top: [cx, H + 0.14, cz], Ri };
  // gimbal rings round the core, seen through gaps and the open iris
  const gy = K.group('gyro', K.root, cx, o.cy, cz), gr = o.gr || o.rc + 0.28;
  gy.scale.y = Math.min(sy, 0.9 * (H - 0.45 - o.cy) / (gr + 0.12));
  K.add(tor(gr, 0.05, 48, 6), M.steel, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, gy);
  for (const r of [0, Math.PI / 2]) K.add(tor(gr + 0.12, 0.045, 48, 6), M.frame, 0, 0, 0, 0, r, 0, 1, 1, 1, gy);
}

// THE BASTION (sector 1): a squat armoured hexagonal fortress in desert tan and brass, amber gun ports, six
// corner towers with twin guns, a turning sentry ring round the iris
function bastion(K, C) {
  const R = K.root, L = C.plates, vent = C.vent;
  const tan = paint(0x8e8775, 0.5, 0.35), tan2 = paint(0x6b6455, 0.5, 0.4), dk = paint(0x3a3631, 0.45, 0.6), brass = paint(0xb68c3e, 0.3, 0.85), stl = paint(0x80868e, 0.3, 0.85), haz = paint(0xd9a31f, 0.45, 0.3), blk = M.black;
  const c30 = Math.cos(Math.PI / 6), t30 = Math.tan(Math.PI / 6), hl = (A) => A * t30 - 0.07;
  // chassis: keel, keep posts, ring girders, radial I-beams, keep drum and crown
  K.add(cyl(3.1, 2.5, 0.5, 6), dk, 0, -1.65, 0);
  K.add(cyl(1.5, 1.0, 0.55, 6), tan2, 0, -2.15, 0);
  K.add(tor(1.15, 0.05, 32, 4), glow(0xffa53a, 3), 0, -2.43, 0, Math.PI / 2);
  for (let k = 0; k < 6; k++) { const a = (30 + 60 * k) * D2R; K.add(rbox(0.32, 3.4, 0.32, 0.05), dk, 2.6 * Math.cos(a), 0.3, 2.6 * Math.sin(a), 0, -a, 0); }
  for (const y of [-0.45, 1.0]) K.add(ngonRing(6, 2.35 / c30, 2.75 / c30, 0.24, Math.PI / 6), dk, 0, y, 0);
  K.add(ngonRing(6, 4.42 / c30, 4.72 / c30, 0.24, Math.PI / 6), stl, 0, 0.98, 0);
  K.add(ngonRing(6, 4.7 / c30, 5.0 / c30, 0.24, Math.PI / 6), stl, 0, -0.52, 0);
  for (let k = 0; k < 6; k++) {
    const a = (30 + 60 * k) * D2R, x = 3.98 * Math.cos(a), z = 3.98 * Math.sin(a);
    for (const y of [-0.45, 1.0]) { K.add(rbox(2.5, 0.34, 0.1, 0.02), dk, x, y, z, 0, -a, 0); for (const s of [-1, 1]) K.add(rbox(2.5, 0.06, 0.3, 0.02), stl, x, y + s * 0.17, z, 0, -a, 0); }
  }
  K.add(ngonRing(6, 1.5, 2.75, 0.46, Math.PI / 6), dk, 0, 1.95, 0);
  K.add(ngonRing(6, 2.3, 2.95, 0.26, Math.PI / 6), brass, 0, 2.18, 0);
  coreIris(K, C, { cy: 0.25, rc: 1.55, top: 2.44, Ri: 1.2, Rh: 2.2, core: 0xffb247, trim: brass, dark: dk, bolt: stl, blade: 0x6b6f76, edge: 0xd9a31f });
  // sentry ring turning round the iris
  const sa = K.group('spinA', R, 0, 2.42, 0);
  K.add(tor(2.75, 0.06, 64, 6), M.frame, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, sa);
  for (let k = 0; k < 3; k++) {
    const a = k * TAU / 3, ca = Math.cos(a), s_ = Math.sin(a), P = (r, y, t = 0) => [r * ca - t * s_, y, r * s_ + t * ca];
    K.add(cyl(0.32, 0.38, 0.22, 12), dk, ...P(2.75, 0.06), 0, 0, 0, 1, 1, 1, sa);
    K.add(rbox(0.62, 0.3, 0.46, 0.08), tan2, ...P(2.85, 0.3), 0, -a, 0, 1, 1, 1, sa);
    for (const t of [-0.11, 0.11]) K.rod(M.steel, ...P(3.1, 0.32, t), ...P(3.85, 0.32, t), 0.045, sa, 8);
    K.add(box(0.06, 0.07, 0.22), glow(0xffb040, 4), ...P(3.17, 0.42), 0, -a, 0, 1, 1, 1, sa);
  }
  // A: lower skirt
  const TA = tpl((Q, P) => {
    const F = plate3(Q, P, [v3(2.8, -1.45, -hl(2.8)), v3(5.0, -0.55, -hl(5.0)), v3(5.0, -0.55, hl(5.0)), v3(2.8, -1.45, hl(2.8))], 0.26, tan2, v3(0.5, -1, 0), 0.06, v3(1, 0, 0));
    for (const z of [-0.9, 0.9]) F.at(rbox(2.0, 0.12, 0.22, 0.04), dk, 3.9, -1.0, z, 0.04);
    F.at(rbox(0.14, 0.1, 5.3, 0.03), brass, 4.85, -0.61, 0, 0.03);
  });
  // B: walls with amber gun ports
  const TB = tpl((Q, P) => {
    const F = plate3(Q, P, [v3(4.7, 1.0, -hl(4.7)), v3(5.0, -0.5, -hl(5.0)), v3(5.0, -0.5, hl(5.0)), v3(4.7, 1.0, hl(4.7))], 0.3, tan, v3(1, 0, 0), 0.07, v3(1, 0, 0));
    F.inset(0.22, 0.04, tan2);
    for (const z of [-1.65, 0, 1.65]) { F.at(rbox(0.34, 0.08, 1.15, 0.03), blk, 4.85, 0.25, z, 0.08); F.at(box(0.13, 0.02, 0.92), vent, 4.85, 0.25, z, 0.13); }
    F.at(rbox(0.16, 0.1, 2 * hl(4.7) - 0.1, 0.03), brass, 4.72, 0.92, 0, 0.05);
    for (const z of [-2.3, 2.3]) F.at(rbox(1.3, 0.1, 0.16, 0.03), tan2, 4.85, 0.25, z, 0.05);
    for (const z of [-0.85, 0.85]) F.at(cyl(0.06, 0.06, 0.05, 8), stl, 4.95, -0.3, z, 0.03);
  });
  // C: sloped glacis, the big top plates: raised panel, intake grilles, hazard band, glowing seam, lamps
  const TC = tpl((Q, P) => {
    const F = plate3(Q, P, [v3(2.5, 1.95, -hl(2.5)), v3(4.75, 1.05, -hl(4.75)), v3(4.75, 1.05, hl(4.75)), v3(2.5, 1.95, hl(2.5))], 0.3, tan, v3(0.3, 1, 0), 0.07, v3(1, 0, 0));
    const E = (f) => [2.5 + 2.25 * f, 1.95 - 0.9 * f];
    F.inset(0.3, 0.06, tan2);
    for (const z of [-0.95, 0.95]) { F.at(rbox(0.9, 0.1, 0.72, 0.03), blk, ...E(0.5), z, 0.1); for (let k = 0; k < 5; k++) F.at(box(0.05, 0.05, 0.62), stl, ...E(0.5 + (k - 2) * 0.07), z, 0.16); }
    F.at(box(0.32, 0.02, 4.5), blk, ...E(0.88), 0, 0.07);
    for (let k = -7; k <= 7; k++) F.at(box(0.36, 0.025, 0.1), haz, ...E(0.88), k * 0.3, 0.085, Math.PI / 4);
    F.at(rbox(0.24, 0.06, 2.0, 0.02), blk, ...E(0.12), 0, 0.06); F.at(box(0.1, 0.02, 1.8), vent, ...E(0.12), 0, 0.1);
    for (const [f, z] of [[0.1, -1.1], [0.1, 1.1], [0.9, -2.35], [0.9, 2.35]]) F.at(cyl(0.07, 0.07, 0.06, 8), stl, ...E(f), z, 0.03);
    for (const z of [-1.8, 1.8]) F.at(sph(0.07, 8, 6), vent, ...E(0.78), z, 0.06);
  });
  // D: corner towers with twin-gun turrets
  const TD = tpl((Q, P) => {
    const a = Math.PI / 6, ca = Math.cos(a), s_ = Math.sin(a), rc = 4.85, at = (r, y, t = 0) => [(rc + r) * ca - t * s_, y, (rc + r) * s_ + t * ca];
    Q.add(cyl(1.0, 1.08, 3.0, 6), tan, ...at(0, 0.6), 0, -a, 0, 1, 1, 1, P);
    Q.add(cyl(1.08, 1.32, 0.55, 6), tan2, ...at(0, -1.17), 0, -a, 0, 1, 1, 1, P);
    Q.add(cyl(1.16, 1.0, 0.3, 6), brass, ...at(0, 2.25), 0, -a, 0, 1, 1, 1, P);
    Q.add(cyl(0.52, 0.6, 0.26, 12), dk, ...at(0, 2.52), 0, 0, 0, 1, 1, 1, P);
    Q.add(rbox(0.95, 0.42, 0.72, 0.1), tan2, ...at(0.12, 2.84), 0, -a, 0, 1, 1, 1, P);
    for (const t of [-0.17, 0.17]) { Q.rod(stl, ...at(0.5, 2.86, t), ...at(1.3, 2.86, t), 0.065, P, 10); Q.add(cyl(0.095, 0.095, 0.14, 10), blk, ...at(1.3, 2.86, t), 0, -a, -Math.PI / 2, 1, 1, 1, P); }
    Q.add(box(0.06, 0.08, 0.36), vent, ...at(0.6, 2.95), 0, -a, 0, 1, 1, 1, P);
    for (const t of [-0.24, 0.24]) { Q.add(rbox(0.1, 1.45, 0.26, 0.03), blk, ...at(0.9, 0.6, t), 0, -a, 0, 1, 1, 1, P); Q.add(box(0.06, 1.3, 0.12), vent, ...at(0.94, 0.6, t), 0, -a, 0, 1, 1, 1, P); }
    for (let k = 0; k < 6; k++) { const b = a + k * Math.PI / 3; Q.add(cyl(0.07, 0.07, 0.06, 8), stl, rc * ca + 0.85 * Math.cos(b), 2.41, rc * s_ + 0.85 * Math.sin(b), 0, 0, 0, 1, 1, 1, P); }
  });
  for (const T of [TA, TB, TC, TD]) for (const i of ORD6) put(L, R, T, i * Math.PI / 3);
  C.R = 6.2;
}

// THE CORONA (sector 2): an armoured sphere in pearl ceramic and blue steel under a spinning ring of
// chrome blades, ice-blue seams
function corona(K, C) {
  const R = K.root, L = C.plates, vent = C.vent;
  const pearl = paint(0xdfe5eb, 0.3, 0.25), bg = paint(0x7d91a8, 0.35, 0.55), sl = paint(0x2f3946, 0.4, 0.6), stl = paint(0xa9b3bf, 0.25, 0.9);
  const Rs = 3.3, TH = 0.24, sp = (r) => (t) => [r * Math.sin(t), r * Math.cos(t)];
  // chassis: meridian cage, equator bearing, south emitter, iris skirt
  for (let k = 0; k < 6; k++) K.add(arcT(Rs - 0.08, 0.07, Math.PI - 0.7, 28, 6), M.frame, 0, 0, 0, 0, -(k + 0.5) * Math.PI / 3, -Math.PI / 2);
  K.add(washer(Rs - 0.25, Rs + 0.42, 0.84, 0.08), sl, 0, 0, 0);
  K.add(tor(Rs + 0.43, 0.035, 72, 4), glow(0x8fdcff, 3), 0, 0, 0, Math.PI / 2);
  for (const y of [-0.3, 0.3]) K.add(tor(Rs + 0.42, 0.03, 72, 4), M.steel, 0, y, 0, Math.PI / 2);
  K.add(cone(0.9, 1.0, 20), pearl, 0, -3.75, 0, Math.PI);
  K.add(cyl(1.0, 0.75, 0.35, 20), sl, 0, -3.3, 0);
  K.add(tor(0.62, 0.04, 32, 4), glow(0x8fdcff, 3.5), 0, -3.48, 0, Math.PI / 2);
  K.add(lathe('coskirt', [[1.86, 3.12], [2.32, 2.74], [2.18, 2.62], [1.7, 2.92], [1.86, 3.12]], 48), pearl, 0, 0, 0);
  coreIris(K, C, { cy: 0, rc: 1.85, top: 3.22, Ri: 1.1, Rh: 1.88, core: 0xa8ecff, trim: stl, dark: sl, bolt: stl, blade: 0x8a96a4, edge: 0x5fc8ff });
  // the blade ring
  const ring = K.group('spinA', R, 0, 0, 0);
  K.add(washer(4.62, 5.0, 0.4, 0.06), M.steel, 0, 0, 0, 0, 0, 0, 1, 1, 1, ring);
  K.add(tor(4.81, 0.035, 96, 4), glow(0x8fdcff, 3.5), 0, 0.21, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
  const bl = geo('coblade', () => slab([[0, -0.3], [0.7, -0.36], [1.12, 0.1], [0.98, 0.2], [0, 0.32]], 0.1, 0.03).clone().rotateX(0.38));
  for (let k = 0; k < 18; k++) { const a = k * TAU / 18; K.add(bl, M.chrome, 4.9 * Math.cos(a), 0, 4.9 * Math.sin(a), 0, -a, 0, 1, 1, 1, ring); }
  for (let k = 0; k < 6; k++) {
    const a = (k + 0.5) * Math.PI / 3, ca = Math.cos(a), s_ = Math.sin(a);
    K.add(rbox(1.0, 0.16, 0.3, 0.04), sl, 4.1 * ca, 0, 4.1 * s_, 0, -a, 0, 1, 1, 1, ring);
    K.add(rbox(0.42, 0.24, 0.34, 0.06), sl, 4.81 * ca, 0.28, 4.81 * s_, 0, -a, 0, 1, 1, 1, ring);
    K.add(box(0.12, 0.05, 0.2), glow(0x8fdcff, 4), 4.95 * ca, 0.41, 4.95 * s_, 0, -a, 0, 1, 1, 1, ring);
  }
  // plates: four bands of six petals, brick-staggered
  const pw = Math.PI / 6 - 0.035;
  const band = (nm, t0, t1, top) => tpl((Q, P) => {
    Q.add(revPatch('co' + nm, sp(Rs), t0, t1, -pw, pw, TH, 5, 8, 0.07), pearl, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    Q.add(revPatch('co' + nm + 'p', sp(Rs + TH), t0 + 0.08, t1 - 0.08, -pw + 0.11, pw - 0.11, 0.06, 3, 6, 0.03), bg, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    const tm = (t0 + t1) / 2;
    if (top) {
      for (const s of [-1, 1]) Q.add(revPatch('co' + nm + 'v', sp(Rs + TH), t0 + 0.08, t1 - 0.08, -0.013, 0.013, 0.04, 3, 1, 0.006), vent, 0, 0, 0, 0, -s * (pw - 0.06), 0, 1, 1, 1, P);
      const n = revN(sp(Rs), tm, 0), p = revPt(sp(Rs), tm, 0, TH + 0.16), p2 = revPt(sp(Rs), tm, 0, TH + 0.27);
      Q.add(cyl(0.16, 0.2, 0.2, 12), sl, p.x, p.y, p.z, ...eulerTo(n), 1, 1, 1, P);
      Q.add(cyl(0.11, 0.11, 0.03, 12), vent, p2.x, p2.y, p2.z, ...eulerTo(n), 1, 1, 1, P);
    } else {
      for (let k = -2; k <= 2; k++) { const p = revPt(sp(Rs), tm, k * 0.08, TH + 0.08), n = revN(sp(Rs), tm, k * 0.08); Q.add(box(0.05, 0.05, 0.7), sl, p.x, p.y, p.z, ...eulerTo(n), 1, 1, 1, P); }
    }
    for (const s of [-1, 1]) for (const tt of [t0 + 0.05, t1 - 0.05]) { const n = revN(sp(Rs), tt, s * (pw - 0.05)), p = revPt(sp(Rs), tt, s * (pw - 0.05), TH); Q.add(cyl(0.055, 0.055, 0.05, 8), stl, p.x, p.y, p.z, ...eulerTo(n), 1, 1, 1, P); }
  });
  const bands = [[band('L2', 2.1, 2.55, false), 0.5], [band('L1', 1.67, 2.06, false), 0], [band('U2', 1.08, 1.47, true), 0.5], [band('U1', 0.7, 1.04, true), 0]];
  for (const [T, off] of bands) for (const i of ORD6) put(L, R, T, (i + off) * Math.PI / 3);
  C.R = 6.05;
}

// THE ANVIL (sector 3): a heavy hammer-head silhouette in blued iron and rust, forge vents along the haft,
// two forge fans turning over glowing pits behind the iris
function anvil(K, C) {
  const R = K.root, L = C.plates, vent = C.vent;
  const ir = paint(0x4a515b, 0.42, 0.75), ir2 = paint(0x2a2e34, 0.45, 0.7), bl = paint(0x37424f, 0.38, 0.8), rust = paint(0x7d4627, 0.6, 0.5), stl = paint(0x9aa0a8, 0.25, 0.95), haz = paint(0xc9961e, 0.45, 0.3), blk = M.black;
  const w = (x) => 1.85 + (x + 5.4) * (0.75 / 7), cx = -1.2;
  // chassis: keel, longerons, ribs, the hammer-head cross beam and braces, spine
  K.add(rbox(7.0, 0.3, 2.0, 0.08), ir2, -1.9, -1.45, 0);
  for (const s of [-1, 1]) for (const y of [1.15, -0.95]) { K.add(rbox(6.9, 0.3, 0.1, 0.02), ir2, -1.9, y, s * 1.2); for (const d of [-1, 1]) K.add(rbox(6.9, 0.06, 0.3, 0.02), stl, -1.9, y + d * 0.15, s * 1.2); }
  for (const x of [-5.15, -3.05, -0.7, 1.45]) {
    K.add(rbox(0.24, 0.24, 2 * w(x) - 0.4, 0.04), ir2, x, 1.3, 0);
    K.add(rbox(0.24, 0.24, 2 * (w(x) - 0.85), 0.04), ir2, x, -1.25, 0);
    for (const s of [-1, 1]) K.add(rbox(0.24, 2.5, 0.24, 0.04), ir2, x, 0.02, s * (w(x) - 0.3));
  }
  K.add(rbox(0.4, 1.8, 9.0, 0.06), ir2, 2.95, 0.15, 0);
  for (const y of [1.05, -0.75]) K.add(rbox(1.4, 0.22, 9.0, 0.06), ir, 2.95, y, 0);
  for (const s of [-1, 1]) K.rod(ir2, 1.5, 0.15, s * 1.8, 2.85, 0.15, s * 4.1, 0.12);
  K.add(rbox(1.0, 0.22, 0.18, 0.04), ir2, 1.1, 1.62, 0);
  coreIris(K, C, { cx, cy: 0.15, rc: 1.3, top: 1.8, Ri: 0.95, Rh: 1.6, core: 0xffa040, trim: bl, dark: ir2, bolt: stl, blade: 0x5a5f66, edge: 0xc9961e });
  K.add(washer(1.6, 1.8, 0.4, 0.05), ir2, cx, 1.58, 0);
  // forge fans over glowing pits (the pits use the vent glow)
  const fb = geo('anfan', () => rbox(0.56, 0.03, 0.2, 0.012).clone().rotateX(0.5));
  [-1, 1].forEach((s, i) => {
    K.add(washer(0.72, 0.9, 0.36, 0.05), ir2, -3.75, 1.55, s * 0.95);
    K.add(cyl(0.72, 0.72, 0.03, 28), vent, -3.75, 1.2, s * 0.95);
    for (const r of [0, Math.PI / 2]) K.add(box(1.5, 0.04, 0.06), stl, -3.75, 1.74, s * 0.95, 0, r, 0);
    const f = K.group('fan' + i, R, -3.75, 1.48, s * 0.95);
    K.add(cyl(0.2, 0.24, 0.28, 14), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, f);
    for (let k = 0; k < 7; k++) { const a = k * TAU / 7; K.add(fb, M.steel, 0.44 * Math.cos(a), 0, 0.44 * Math.sin(a), 0, -a, 0, 1, 1, 1, f); }
  });
  const segs = [[-5.4, -3.05], [-3.05, -0.7], [-0.7, 1.6]], g = 0.04;
  // L1: lower side plates of the haft
  const T1 = segs.map(([x0, x1]) => tpl((Q, P) => {
    const F = plate3(Q, P, [v3(x0 + g, -1.3, w(x0) - 0.85), v3(x1 - g, -1.3, w(x1) - 0.85), v3(x1 - g, -0.35, w(x1)), v3(x0 + g, -0.35, w(x0))], 0.28, ir, v3(0, -0.7, 1), 0.06);
    const E = (x, f) => [x, -1.3 + 0.95 * f, w(x) - 0.85 * (1 - f)], xm = (x0 + x1) / 2, Lx = x1 - x0;
    for (const f of [0.3, 0.68]) F.at(rbox(Lx - 0.5, 0.1, 0.14, 0.03), ir2, ...E(xm, f), 0.04);
    F.at(rbox(Lx - 0.2, 0.06, 0.12, 0.02), rust, ...E(xm, 0.93), 0.03);
    for (const x of [x0 + 0.3, x1 - 0.3]) for (const f of [0.15, 0.85]) F.at(cyl(0.06, 0.06, 0.05, 8), stl, ...E(x, f), 0.03);
  }));
  // L2: haft walls with rows of forge vents
  const T2 = segs.map(([x0, x1]) => tpl((Q, P) => {
    const F = plate3(Q, P, [v3(x0 + g, -0.35, w(x0)), v3(x1 - g, -0.35, w(x1)), v3(x1 - g, 1.25, w(x1) - 0.12), v3(x0 + g, 1.25, w(x0) - 0.12)], 0.3, ir, v3(0, 0, 1), 0.07);
    const E = (x, f) => [x, -0.35 + 1.6 * f, w(x) - 0.12 * f], xm = (x0 + x1) / 2, Lx = x1 - x0;
    F.inset(0.18, 0.04, ir2);
    for (const f of [0.33, 0.66]) for (let k = 0; k < 3; k++) { const x = x0 + Lx * (k + 1) / 4; F.at(rbox(0.52, 0.08, 0.22, 0.03), blk, ...E(x, f), 0.08); F.at(box(0.42, 0.02, 0.1), vent, ...E(x, f), 0.13); }
    F.at(rbox(Lx - 0.12, 0.08, 0.14, 0.02), rust, ...E(xm, 0.94), 0.06);
    for (const x of [x0 + 0.16, x1 - 0.16]) F.at(rbox(0.14, 0.1, 1.4, 0.03), ir2, ...E(x, 0.5), 0.07);
  }));
  // L3: hammer-head blocks (inner, middle, outer with the striking face)
  const HZ = [[0.05, 1.45], [1.5, 2.9], [2.95, 4.35]];
  const T3 = HZ.map(([z0, z1], i) => tpl((Q, P) => {
    const zm = (z0 + z1) / 2, wz = z1 - z0;
    Q.add(rbox(2.5, 3.4, wz, 0.14), ir, 2.95, 0.15, zm, 0, 0, 0, 1, 1, 1, P);
    const T = plate3(Q, P, [v3(1.62, 1.85, z0), v3(3.55, 1.85, z0), v3(3.55, 1.85, z1), v3(1.62, 1.85, z1)], 0.22, bl, v3(0, 1, 0), 0.06);
    plate3(Q, P, [v3(3.55, 2.07, z0), v3(4.35, 0.85, z0), v3(4.35, 0.85, z1), v3(3.55, 2.07, z1)], 0.2, stl, v3(1, 1, 0), 0.05);
    plate3(Q, P, [v3(4.2, 0.85, z0), v3(4.2, -1.45, z0), v3(4.2, -1.45, z1), v3(4.2, 0.85, z1)], 0.18, ir2, v3(1, 0, 0), 0.05);
    T.at(box(0.3, 0.02, wz - 0.2), blk, 3.3, 1.85, zm, 0.01);
    for (let k = 0; k < 5; k++) T.at(box(0.32, 0.025, 0.09), haz, 3.3, 1.85, z0 + 0.25 + k * 0.225, 0.025, Math.PI / 4);
    T.at(rbox(0.26, 0.06, wz - 0.4, 0.02), blk, 1.95, 1.85, zm, 0.03); T.at(box(0.12, 0.02, wz - 0.55), vent, 1.95, 1.85, zm, 0.065);
    for (const z of [z0 + 0.35, z1 - 0.35]) T.at(arcT(0.14, 0.035, Math.PI, 10, 6), stl, 2.6, 1.85, z, 0.0);
    T.at(rbox(0.9, 0.05, wz - 0.5, 0.02), ir, 2.55, 1.85, zm, 0.025);
    if (i < 2) {
      Q.add(rbox(0.1, 0.95, wz - 0.3, 0.03), blk, 1.66, 0.65, zm, 0, 0, 0, 1, 1, 1, P);
      Q.add(box(0.04, 0.7, wz - 0.55), vent, 1.6, 0.65, zm, 0, 0, 0, 1, 1, 1, P);
      for (const y of [0.42, 0.65, 0.88]) Q.add(box(0.06, 0.06, wz - 0.42), stl, 1.57, y, zm, 0, 0, 0, 1, 1, 1, P);
    } else {
      Q.add(rbox(2.3, 3.0, 0.26, 0.08), stl, 2.95, 0.15, z1 + 0.12, 0, 0, 0, 1, 1, 1, P);
      Q.add(tor(0.85, 0.09, 36, 8), ir2, 2.95, 0.15, z1 + 0.26, 0, 0, 0, 1, 1, 1, P);
      Q.add(cyl(0.4, 0.46, 0.18, 16), ir2, 2.95, 0.15, z1 + 0.3, Math.PI / 2, 0, 0, 1, 1, 1, P);
    }
  }));
  // L4: deck cowls (front, iris shoulder, rear deck with exhaust stack)
  const T4 = [
    tpl((Q, P) => {
      const F = plate3(Q, P, [v3(0.62, 1.5, 0.13), v3(1.56, 1.5, 0.13), v3(1.56, 1.5, w(1.56) - 0.05), v3(0.62, 1.5, w(0.62) - 0.05)], 0.26, bl, v3(0, 1, 0), 0.06);
      F.inset(0.16, 0.04, ir);
      for (const z of [0.85, 1.75]) { F.at(rbox(0.7, 0.06, 0.22, 0.02), blk, 1.09, 1.5, z, 0.06); F.at(box(0.6, 0.02, 0.1), vent, 1.09, 1.5, z, 0.1); }
      for (const [x, z] of [[0.75, 0.3], [1.45, 0.3], [0.75, 2.25], [1.45, 2.3]]) F.at(cyl(0.06, 0.06, 0.05, 8), stl, x, 1.5, z, 0.06);
    }),
    tpl((Q, P) => {
      const F = plate3(Q, P, [v3(-2.88, 1.76, 1.8), v3(0.57, 1.76, 1.8), v3(0.57, 1.02, w(0.57) + 0.28), v3(-2.88, 1.02, w(-2.88) + 0.28)], 0.22, bl, v3(0, 1, 1), 0.06);
      const E = (x, f) => [x, 1.76 - 0.74 * f, 1.8 + (w(x) + 0.28 - 1.8) * f];
      for (let k = 0; k < 5; k++) { const x = -2.5 + k * 0.7; F.at(rbox(0.14, 0.06, 0.42, 0.02), blk, ...E(x, 0.5), 0.03); F.at(box(0.06, 0.02, 0.34), vent, ...E(x, 0.5), 0.065); }
      F.at(rbox(3.3, 0.06, 0.1, 0.02), rust, ...E(-1.15, 0.9), 0.03);
      F.at(rbox(3.3, 0.06, 0.08, 0.02), ir2, ...E(-1.15, 0.12), 0.03);
    }),
    tpl((Q, P) => {
      const F = plate3(Q, P, [v3(-5.35, 1.5, 0.12), v3(-4.62, 1.5, 0.12), v3(-4.62, 1.5, 1.82), v3(-2.95, 1.5, 1.82), v3(-2.95, 1.5, w(-2.95) - 0.05), v3(-5.35, 1.5, w(-5.35) - 0.05)], 0.26, bl, v3(0, 1, 0), 0.06);
      Q.add(cyl(0.3, 0.36, 1.0, 14), ir2, -5.0, 2.25, 1.2, 0, 0, 0, 1, 1, 1, P);
      Q.add(cyl(0.25, 0.25, 0.04, 14), vent, -5.0, 2.76, 1.2, 0, 0, 0, 1, 1, 1, P);
      for (const y of [1.95, 2.45]) Q.add(tor(0.33, 0.035, 18, 6), stl, -5.0, y, 1.2, Math.PI / 2, 0, 0, 1, 1, 1, P);
      F.at(rbox(0.55, 0.05, 0.62, 0.02), blk, -4.98, 1.5, 0.48, 0.02);
      for (let k = 0; k < 4; k++) F.at(box(0.5, 0.04, 0.04), stl, -4.98, 1.5, 0.27 + k * 0.14, 0.06);
      for (let k = 0; k < 6; k++) F.at(box(0.3, 0.025, 0.08), haz, -3.1 - k * 0.28, 1.5, 1.98, 0.02, Math.PI / 4);
    }),
  ];
  const alt = [[0, 0], [1, 1], [2, 0], [0, 1], [1, 0], [2, 1]];
  for (const [i, m] of alt) put(L, R, T1[i], 0, !!m);
  for (const [i, m] of alt) put(L, R, T2[i], 0, !!m);
  for (const [i, m] of [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]]) put(L, R, T3[i], 0, !!m);
  for (const [i, m] of [[0, 0], [2, 1], [1, 0], [0, 1], [2, 0], [1, 1]]) put(L, R, T4[i], 0, !!m);
  C.R = 6.2;
}

// THE PYRE (sector 4): a squat charred furnace dome split by glowing cracks, a crown of eight great spikes
// round its waist, heat baffles turning round the iris
function pyre(K, C) {
  const R = K.root, L = C.plates, vent = C.vent;
  const chr = paint(0x2b2521, 0.62, 0.45), ch2 = paint(0x3e332c, 0.55, 0.5), rust = paint(0x5f3322, 0.6, 0.5), ash = paint(0x6d655c, 0.55, 0.4);
  // the dome plates are matte: charred iron, scorched scales, burnt rust
  const mChar = tint(0x231d1a, 'rough'), mScale = tint(0x3a2f28, 'rough'), mRust = tint(0x5a2e1c, 'rough');
  const A = 3.5, Bh = 2.85, prof = (t) => [A * Math.sin(t), Bh * Math.cos(t)], TH = 0.3;
  // chassis: ribs, bottom spike, crown spikes, baffles
  for (let k = 0; k < 8; k++) K.add(arcT(3.15, 0.07, Math.PI - 0.6, 24, 6), M.frame, 0, 0, 0, 0, -(k + 0.5) * Math.PI / 4, -Math.PI / 2, 0.81, 1, 1);
  K.add(cyl(1.25, 0.95, 0.5, 8), rust, 0, -2.6, 0);
  K.add(cone(0.95, 2.0, 6), chr, 0, -3.8, 0, Math.PI);
  K.add(tor(1.0, 0.05, 32, 4), vent, 0, -2.88, 0, Math.PI / 2);
  coreIris(K, C, { cy: 0.1, rc: 2.6, sy: 0.8, top: 3.0, Ri: 1.0, Rh: 1.78, core: 0xff9a30, trim: rust, dark: chr, bolt: ash, blade: 0x3a3430, edge: 0xc0502a, gr: 2.75 });
  for (let k = 0; k < 8; k++) { const a = (k + 0.5) * Math.PI / 4, d = v3(Math.cos(a) * Math.sin(0.5), Math.cos(0.5), Math.sin(a) * Math.sin(0.5)); K.add(cone(0.15, 0.75, 4), ch2, 1.95 * Math.cos(a) + d.x * 0.3, 3.1 + d.y * 0.3, 1.95 * Math.sin(a) + d.z * 0.3, ...eulerTo(d)); }
  const sa = K.group('spinA', R, 0, 2.86, 0);
  K.add(tor(2.25, 0.05, 48, 6), M.frame, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, sa);
  const vb = geo('pyvane', () => rbox(0.5, 0.05, 0.26, 0.015).clone().rotateX(0.6));
  for (let k = 0; k < 10; k++) { const a = k * TAU / 10; K.add(vb, M.steel, 2.25 * Math.cos(a), 0, 2.25 * Math.sin(a), 0, -a, 0, 1, 1, 1, sa); }
  // plates: dome plates armoured with raised scales, the glowing cracks running in the grooves between them
  // (two variants alternate), and the spikes
  const pw = Math.PI / 8 - 0.014, P1 = offProf(prof, TH);
  const crack = (Q, P, pts) => { for (let i = 0; i + 1 < pts.length; i++) { const a = revPt(prof, pts[i][0], pts[i][1], TH), b = revPt(prof, pts[i + 1][0], pts[i + 1][1], TH); Q.rod(vent, a.x, a.y, a.z, b.x, b.y, b.z, 0.04, P, 4); } };
  const tile = (Q, P, key, t0, t1, p0, p1, mat) => Q.add(revPatch(key, P1, t0, t1, p0, p1, 0.1, 3, 3, 0.035, 0.012, key.length), mat, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
  const up = (seed) => tpl((Q, P) => {
    Q.add(revPatch('pyU' + seed, prof, 0.62, 1.5, -pw, pw, TH, 6, 7, 0.08, 0.05, seed), mChar, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    const g = 0.04;
    if (seed === 1) {
      const tm = 1.03, pm = 0.03;
      tile(Q, P, 'pyT1a', 0.67, tm - g, -pw + 0.04, pm - g, mScale); tile(Q, P, 'pyT1b', 0.67, tm - g, pm + g, pw - 0.04, mRust);
      tile(Q, P, 'pyT1c', tm + g, 1.45, -pw + 0.04, pm - g, mScale); tile(Q, P, 'pyT1d', tm + g, 1.45, pm + g, pw - 0.04, mScale);
      crack(Q, P, [[0.66, pm + 0.01], [0.82, pm - 0.012], [tm, pm + 0.008], [1.22, pm - 0.01], [1.46, pm + 0.012]]);
      crack(Q, P, [[tm, -pw + 0.03], [tm - 0.012, -0.13], [tm + 0.01, pm], [tm - 0.01, 0.16], [tm, pw - 0.03]]);
    } else {
      // three rows, the middle one split: a staggered crack pattern
      const t1 = 0.86, t2 = 1.2, pm = -0.06;
      tile(Q, P, 'pyT2a', 0.67, t1 - g, -pw + 0.04, pw - 0.04, mScale);
      tile(Q, P, 'pyT2b', t1 + g, t2 - g, -pw + 0.04, pm - g, mRust); tile(Q, P, 'pyT2c', t1 + g, t2 - g, pm + g, pw - 0.04, mScale);
      tile(Q, P, 'pyT2d', t2 + g, 1.45, -pw + 0.04, pw - 0.04, mScale);
      crack(Q, P, [[t1, -pw + 0.03], [t1 + 0.012, -0.1], [t1 - 0.01, 0.05], [t1 + 0.01, pw - 0.03]]);
      crack(Q, P, [[t2, -pw + 0.03], [t2 - 0.012, -0.12], [t2 + 0.01, 0.06], [t2, pw - 0.03]]);
      crack(Q, P, [[t1, pm + 0.01], [1.03, pm - 0.012], [t2, pm + 0.008]]);
    }
    if (seed === 1) {
      const n = revN(prof, 0.82, -0.17), q = revPt(prof, 0.82, -0.17, TH + 0.33), q2 = revPt(prof, 0.82, -0.17, TH + 0.6);
      Q.add(cyl(0.15, 0.2, 0.5, 8), mChar, q.x, q.y, q.z, ...eulerTo(n), 1, 1, 1, P);
      Q.add(cyl(0.12, 0.12, 0.03, 8), vent, q2.x, q2.y, q2.z, ...eulerTo(n), 1, 1, 1, P);
    } else for (const p of [-0.19, 0.17]) { const n = revN(prof, 1.32, p), q = revPt(prof, 1.32, p, TH + 0.33); Q.add(cone(0.12, 0.5, 5), mScale, q.x, q.y, q.z, ...eulerTo(n), 1, 1, 1, P); }
  });
  const low = (seed) => tpl((Q, P) => {
    Q.add(revPatch('pyL' + seed, prof, 1.6, 2.5, -pw, pw, TH, 6, 7, 0.08, 0.05, seed + 2), mChar, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    const pm = seed === 1 ? 0.02 : -0.03, g = 0.04;
    tile(Q, P, `pyB${seed}a`, 1.66, 2.42, -pw + 0.04, pm - g, mScale);
    tile(Q, P, `pyB${seed}b`, 1.66, 2.42, pm + g, pw - 0.04, seed === 1 ? mRust : mScale);
    crack(Q, P, [[1.64, pm + 0.01], [1.88, pm - 0.012], [2.12, pm + 0.01], [2.44, pm - 0.01]]);
  });
  const TS = tpl((Q, P) => {
    Q.add(cyl(0.62, 0.8, 0.7, 6), rust, 3.55, 0.05, 0, 0, 0, -Math.PI / 2, 1, 1, 1, P);
    Q.add(cyl(0.7, 0.66, 0.16, 6), ash, 3.9, 0.05, 0, 0, 0, -Math.PI / 2, 1, 1, 1, P);
    const el = 0.16, d = v3(Math.cos(el), Math.sin(el), 0), nu = v3(-Math.sin(el), Math.cos(el), 0), b = v3(3.85, 0.05, 0);
    const c = b.clone().addScaledVector(d, 1.15);
    Q.add(cone(0.58, 2.3, 5), chr, c.x, c.y, c.z, 0, 0, -(Math.PI / 2 - el), 1, 1, 1, P);
    const rad = (l) => 0.58 * (1 - l / 2.3) * 0.84, p0 = b.clone().addScaledVector(d, 0.2).addScaledVector(nu, rad(0.2)), p1 = b.clone().addScaledVector(d, 1.45).addScaledVector(nu, rad(1.45));
    Q.rod(vent, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.04, P, 4);
    for (const s of [-1, 1]) { const dd = v3(0.5, 0.75, s * 0.45).normalize(); Q.add(cone(0.18, 0.85, 4), ch2, 3.55 + dd.x * 0.5, 0.35 + dd.y * 0.5, s * 0.3 + dd.z * 0.5, ...eulerTo(dd), 1, 1, 1, P); }
  });
  const L1 = [low(1), low(2)], L2 = [up(1), up(2)];
  for (const i of ORD8) put(L, R, L1[i % 2], i * Math.PI / 4);
  for (const i of ORD8) put(L, R, L2[i % 2], (i + 0.5) * Math.PI / 4);
  for (const i of ORD8) put(L, R, TS, i * Math.PI / 4);
  C.R = 6.1;
}

// THE NADIR (sector 5): a sleek obsidian arrowhead (a lens swept back into a manta planform) with a prow
// spike, violet seams and gills, swept crest and cheek blades, and four energy fins: two great scythe wings
// that beat slowly at its flanks and two tail fins
function nadir(K, C) {
  const R = K.root, L = C.plates, vent = C.vent;
  const ob = paint(0x141419, 0.22, 0.6), vb = paint(0x272035, 0.3, 0.6), sat = paint(0x3d3849, 0.3, 0.75), chr = paint(0x7a778c, 0.2, 0.95);
  const XS = 1.3, SW = 0.75, prof = (t) => [3.0 * Math.sin(t), 1.5 * Math.cos(t)], TH = 0.22, vio = 0xb060ff;
  // the sweep: stretch along x, then drag the outer body back with distance from the centreline (the middle
  // round the iris stays round)
  const ramp = (r) => { const t = Math.min(1, Math.max(0, (r - 1.9) / 1.1)); return t * t * (3 - 2 * t); };
  const NW = (x, y, z) => [XS * x - SW * Math.abs(z) * ramp(Math.hypot(x, z)), y, z];
  const Wg = (key, g) => warp('nw' + key, g, NW);
  // chassis: equator ring and lower arcs (swept like the hull), prow spike, tail emitters, belly emitter
  for (const s of [-1, 1]) K.add(Wg('eq' + s, arcT(2.95, 0.07, Math.PI, 40, 6).clone().rotateX(s * Math.PI / 2)), M.frame);
  K.add(Wg('keel', arcT(2.9, 0.06, Math.PI, 40, 6).clone().rotateZ(Math.PI).scale(1, 0.5, 1)), M.frame);
  K.add(Wg('trans', arcT(2.9, 0.06, Math.PI, 40, 6).clone().rotateZ(Math.PI).rotateY(Math.PI / 2).scale(1, 0.5, 1)), M.frame);
  K.add(cone(0.6, 2.0, 4), ob, 4.7, 0, 0, 0, 0, -Math.PI / 2, 0.35, 1, 1);
  K.add(cyl(0.42, 0.55, 0.5, 8), sat, 3.75, 0, 0, 0, 0, -Math.PI / 2, 1, 1, 0.55);
  for (const s of [-1, 1]) K.rod(glow(vio, 3.5), 3.85, 0, s * 0.56, 5.65, 0, s * 0.03, 0.03, R, 4);
  for (const z of [-0.85, 0, 0.85]) {
    const ex = NW(-Math.sqrt(9 - z * z), 0, z)[0] + 0.3;
    K.add(cyl(0.28, 0.34, 0.8, 12), vb, ex, -0.05, z, 0, 0, Math.PI / 2);
    K.add(tor(0.26, 0.04, 16, 4), glow(vio, 4), ex - 0.42, -0.05, z, 0, Math.PI / 2, 0);
    K.add(cyl(0.2, 0.2, 0.03, 12), glow(0xd7a0ff, 3), ex - 0.4, -0.05, z, 0, 0, Math.PI / 2);
  }
  K.add(cyl(0.6, 0.4, 0.3, 16), vb, 0, -1.55, 0);
  K.add(tor(0.45, 0.04, 24, 4), glow(vio, 3.5), 0, -1.72, 0, Math.PI / 2);
  coreIris(K, C, { cy: 0.05, rc: 1.2, top: 1.8, Ri: 0.95, Rh: 1.66, core: 0xc27aff, trim: sat, dark: ob, bolt: chr, blade: 0x2e2a36, edge: 0x9a40ff, gr: 1.25 });
  K.add(washer(1.64, 2.05, 0.18, 0.05), sat, 0, 1.64, 0, 0, 0, 0, 1.3, 1, 1);
  // energy fins (moving): fin0 / fin1 the scythe wings (+z / -z), fin2 / fin3 the tail fins
  const wing = [[0.5, -0.3], [0.05, 0.45], [-0.8, 1.15], [-1.9, 1.6], [-2.75, 1.75], [-2.3, 1.3], [-1.8, 0.65], [-1.45, -0.05], [-0.9, -0.35]];
  let fi = 0;
  for (const [fx, fy, fz, sc] of [[-1.54, 0.05, 2.95, 0.88], [-4.2, 0.1, 1.85, 0.45]]) for (const s of [1, -1]) {
    const f = K.group('fin' + fi++, R, fx, fy, s * fz), pts = wing.map(([x, z]) => [x * sc, s * z * sc]);
    K.add(slab(pts, 0.09, 0.03), sat, 0, 0, 0, 0, 0, 0, 1, 1, 1, f);
    K.add(slab(inset(pts, 0.14 * sc), 0.12, 0.02), ob, 0, 0, 0, 0, 0, 0, 1, 1, 1, f);
    for (let k = 1; k < 5; k++) { const a = pts[k], b = pts[k + 1]; K.rod(vent, a[0], 0.045, a[1], b[0], 0.045, b[1], 0.045, f, 4); }
    const m0 = [(pts[1][0] + pts[7][0]) / 2, (pts[1][1] + pts[7][1]) / 2], m1 = [(pts[3][0] + pts[5][0]) / 2, (pts[3][1] + pts[5][1]) / 2];
    K.rod(vent, m0[0], 0.07, m0[1], m1[0], 0.07, m1[1], 0.03, f, 4);
    K.add(cyl(0.22, 0.22, 0.34, 12), chr, 0, 0, 0, 0, 0, 0, 1, 1, 1, f);
  }
  // plates: built per slot on the +z side (30, 90, 150 deg), swept, and mirrored to -z
  const slots = [Math.PI / 6, Math.PI / 2, 5 * Math.PI / 6], pw = Math.PI / 6 - 0.03, P1 = offProf(prof, TH);
  const layer = (nm, t0, t1, extra) => slots.map((a, si) => tpl((Q, P) => {
    Q.add(Wg(`${nm}${si}`, revPatch(`na${nm}${si}`, prof, t0, t1, a - pw, a + pw, TH, 4, 8, 0.06)), ob, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    extra(Q, P, a, si, t0, t1);
  }));
  const T1 = layer('V', 1.9, 2.8, (Q, P, a, si, t0, t1) => {
    Q.add(Wg(`Vp${si}`, revPatch(`naVp${si}`, P1, t0 + 0.1, t1 - 0.12, a - pw + 0.12, a + pw - 0.12, 0.04, 3, 6, 0.02)), vb, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
  });
  const T2 = layer('R', 1.2, 1.84, (Q, P, a, si) => {
    for (const tk of [1.4, 1.5, 1.6]) Q.add(Wg(`Rg${si}${tk}`, revPatch(`naRg${si}${tk}`, P1, tk - 0.017, tk + 0.017, a - 0.32, a + 0.32, 0.035, 1, 6, 0.004)), vent, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    Q.add(Wg(`Rp${si}`, revPatch(`naRp${si}`, P1, 1.25, 1.33, a - pw + 0.06, a + pw - 0.06, 0.05, 1, 6, 0.015)), chr, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
  });
  const T3 = layer('D', 0.64, 1.16, (Q, P, a, si, t0, t1) => {
    Q.add(Wg(`Dp${si}`, revPatch(`naDp${si}`, P1, t0 + 0.08, t1 - 0.08, a - pw + 0.1, a + pw - 0.1, 0.05, 3, 6, 0.02)), sat, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
    for (const s of [-1, 1]) Q.add(Wg(`Dv${si}${s}`, revPatch(`naDv${si}${s}`, P1, t0 + 0.06, t1 - 0.06, a + s * (pw - 0.055) - 0.013, a + s * (pw - 0.055) + 0.013, 0.07, 3, 1, 0.005)), vent, 0, 0, 0, 0, 0, 0, 1, 1, 1, P);
  });
  // blades, all swept back along the hull: cheek blades flanking the prow, root blades along the flanks, a
  // twin crest behind the iris; each a canted plate with a violet leading edge
  const blade = (b0, b1, up, shape, th) => tpl((Q, P) => {
    const e1 = v3().subVectors(b1, b0), Lb = e1.length(); e1.normalize();
    const pt = (a, h) => b0.clone().addScaledVector(e1, a * Lb).addScaledVector(up, h);
    const F = plate3(Q, P, shape.map(([a, h]) => pt(a, h)), th, sat, v3().crossVectors(e1, up).multiplyScalar(-1).add(v3(0, 0.3, 0)), 0.03);
    F(slab(inset(F.pts2, 0.08), 0.025, 0.01), ob, 0, 0, 0.012);
    for (let k = 1; k < shape.length - 1; k++) { const p0 = pt(...shape[k]), p1 = pt(...shape[k + 1]); Q.rod(vent, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.035, P, 4); }
  });
  const cant = (c) => v3(0, Math.cos(c), Math.sin(c));
  const T4 = [
    blade(v3(4.15, 0.42, 0.3), v3(1.8, 1.32, 0.72), cant(0.6), [[0, 0], [1, 0], [0.95, 0.42], [0.4, 0.22]], 0.08),
    blade(v3(0.3, 1.32, 1.95), v3(-2.7, 0.82, 2.65), v3(0, 0.9, 0.44).normalize(), [[0, 0], [1, 0], [1.18, 0.5], [0.55, 0.32]], 0.09),
    blade(v3(-2.3, 1.33, 0.55), v3(-3.8, 0.72, 0.72), cant(0.32), [[0, 0], [1, 0], [1.42, 1.75], [0.95, 1.45], [0.4, 0.7]], 0.1),
  ];
  for (const T of [T1, T2, T3, T4]) for (const [si, m] of [[1, 0], [1, 1], [0, 0], [2, 1], [2, 0], [0, 1]]) put(L, R, T[si], 0, !!m);
  C.R = 6.1;
}

const BUILD = { bastion, corona, anvil, pyre, nadir };
const VENT = { bastion: [0xff9a2e, 2.6], corona: [0x6fd0ff, 2.6], anvil: [0xff4a12, 3.0], pyre: [0xff6a12, 3.2], nadir: [0x9a40ff, 3.0] };
function buildConstruct(key) {
  const K = new Kit();
  const vent = new THREE.MeshBasicMaterial({ color: hdr(VENT[key][0], VENT[key][1]), toneMapped: false }); vent.name = 'vent';
  const C = { key, vent, plates: [], R: 6 };
  CINFO[key] = { vent: vent.color.clone() };
  BUILD[key](K, C);
  C.plates.forEach((p, i) => { p.name = 'plate' + String(i).padStart(2, '0'); });
  K.root.userData.R = C.R;
  CINFO[key].R = C.R;
  return K.build();
}
// per-frame motion: integrated so a change of k never jumps
const SPIN = {
  bastion(o, s, t, dt, k) { s.a += dt * (0.12 + 0.55 * k); o.a.rotation.y = s.a; return 0.8 + 0.2 * Math.sin(t * (1.6 + 2 * k)); },
  corona(o, s, t, dt, k) { s.a += dt * (0.35 + 2.6 * k); o.a.rotation.y = -s.a; return 0.85 + 0.15 * Math.sin(t * 3.1) * Math.sin(t * 1.3 + 1); },
  anvil(o, s, t, dt, k) { s.a += dt * (2.5 + 9 * k); o.fans[0].rotation.y = s.a; o.fans[1].rotation.y = -s.a * 1.07; return 0.78 + 0.14 * Math.sin(t * 7.3) * Math.sin(t * 3.1 + 2) + 0.08 * Math.sin(t * 17.0); },
  pyre(o, s, t, dt, k) { s.a += dt * (0.2 + 0.9 * k); o.a.rotation.y = s.a; return 0.72 + 0.16 * Math.sin(t * 9.1) * Math.sin(t * 4.3 + 1) + 0.12 * Math.sin(t * 23.0 + Math.sin(t * 3.0)); },
  nadir(o, s, t, dt, k) { s.a += dt * (0.9 + 1.8 * k); const w = Math.sin(s.a) * (0.06 + 0.12 * k), v = Math.sin(s.a * 1.3 + 1) * (0.08 + 0.14 * k); o.fins.forEach((f, i) => { const m = i % 2 ? 1 : -1; if (i < 2) { f.rotation.x = m * w; f.rotation.y = -m * w * 0.3; } else f.rotation.y = -m * v; }); return 0.75 + 0.25 * Math.sin(t * (1.2 + 1.5 * k)); },
};
export function construct(key) {
  if (!BUILD[key]) key = 'bastion';
  const g = make('con' + key, () => buildConstruct(key));
  const I = CINFO[key], ir = I.iris;
  const plates = []; for (let i = 0; i < 24; i++) plates.push(by(g, 'plate' + String(i).padStart(2, '0')));
  const iris = by(g, 'iris');
  let vent = null; g.traverse((o) => { if (!vent && o.material && o.material.name === 'vent') vent = o.material; });
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = v3(), _s = v3(1, 1, 1);
  // k 0 = shut (blades meet over the core) .. 1 = wide open (blades swung out under the housing)
  const setIris = (k) => {
    k = Math.min(1, Math.max(0, k));
    for (let i = 0; i < ir.N; i++) {
      const a = (i / ir.N) * TAU, ca = Math.cos(a), sa = Math.sin(a);
      _p.set(ir.cx + ir.pv[0] * ca - ir.pv[1] * sa, ir.y, ir.cz + ir.pv[0] * sa + ir.pv[1] * ca);
      _q.setFromAxisAngle(_up, -(a + k * ir.phi));
      iris.setMatrixAt(i, _m.compose(_p, _q, _s));
    }
    iris.instanceMatrix.needsUpdate = true;
  };
  setIris(0);
  const o = { a: by(g, 'spinA'), gyro: by(g, 'gyro'), fans: [by(g, 'fan0'), by(g, 'fan1')], fins: all(g, 'fin') };
  const st = { a: 0, g: 0, last: null };
  const spin = (t, k = 0) => {
    const dt = st.last === null ? 0 : Math.min(0.1, Math.max(0, t - st.last)); st.last = t;
    st.g += dt * (0.25 + 1.2 * k);
    if (o.gyro) { o.gyro.rotation.y = st.g; o.gyro.rotation.x = Math.sin(t * 0.37) * 0.22; }
    const f = SPIN[key](o, st, t, dt, k);
    if (vent) vent.color.copy(I.vent).multiplyScalar(f * (0.75 + 0.6 * k));
  };
  return { g, core: by(g, 'core'), plates, setIris, spin, R: I.R, irisPos: v3(...ir.top), irisR: ir.Ri };
}

// ------------------------------------------------------------------ scenery bits
export function rockGeometry(seed) {
  const k = 'rock' + (seed % 6);
  return geo(k, () => {
    let s = (seed % 6) * 9301 + 49297;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const g = new THREE.IcosahedronGeometry(1, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (0.75 + r() * 0.5), p.getY(i) * (0.6 + r() * 0.5), p.getZ(i) * (0.75 + r() * 0.5));
    g.computeVertexNormals();
    return g;
  });
}
export const GEO = { box, cyl, sph, cap, tor, rbox, slab, washer, cone, ico };
// a plain mesh helper (scenery)
export function add(p, g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
