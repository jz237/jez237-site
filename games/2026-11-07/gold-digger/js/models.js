// Gold Digger models: the prospector, the cave's creatures, five bosses, pickups, relics and scenery, all built
// from code (no files to load). Every rigid part is merged per moving joint into one mesh per shared material,
// with its colour (and a little grime) carried per vertex, so the whole game uses a handful of materials and
// shader programs. Each model is built once; later calls return cheap clones that share geometry.
// Conventions: metres, +Y up, the camera looks down -Z. Characters and creatures face +X (mirror with
// rotation.y = PI). Feet / bases at y = 0 unless a function says otherwise. Glowing parts carry HDR vertex
// colours (> 1) on an unlit, un-tone-mapped material so the bloom pass catches them. No lights are created here.
import * as THREE from '../vendor/three.module.min.js';

// ------------------------------------------------------------------ noise (deterministic)
function hash3(x, y, z) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const L = (a, b, t) => a + (b - a) * t;
  return L(L(L(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), L(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
    L(L(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), L(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v), w);
}
const fbm = (x, y, z) => vnoise(x, y, z) * 0.55 + vnoise(x * 2.1 + 5.2, y * 2.1, z * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3 + 1.7, z * 4.3) * 0.15;
function rng(seed) { let s = (seed >>> 0) || 7; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ------------------------------------------------------------------ a fine grain normal map (made from numbers, no canvas)
function grainNormal(size = 128) {
  const h = new Float32Array(size * size);
  const per = (x, y, f) => { // tileable value noise
    const X = x * f, Y = y * f, xi = Math.floor(X), yi = Math.floor(Y), xf = X - xi, yf = Y - yi;
    const g = (a, b) => hash3(((a % f) + f) % f, ((b % f) + f) % f, f);
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const fx = x / size, fy = y / size;
    h[y * size + x] = per(fx, fy, 8) * 0.5 + per(fx, fy, 16) * 0.3 + per(fx, fy, 32) * 0.2 + per(fx, fy, 64) * 0.12;
  }
  const d = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const H = (xx, yy) => h[((yy + size) % size) * size + ((xx + size) % size)];
    const dx = (H(x + 1, y) - H(x - 1, y)) * 3.2, dy = (H(x, y + 1) - H(x, y - 1)) * 3.2;
    const l = Math.hypot(dx, dy, 1), i = (y * size + x) * 4;
    d[i] = (-dx / l * 0.5 + 0.5) * 255; d[i + 1] = (-dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  const t = new THREE.DataTexture(d, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}
const GRAIN = grainNormal();

// ------------------------------------------------------------------ the material library (shared by every model)
const std = (o) => new THREE.MeshStandardMaterial(o);
export const MATS = {
  rough: std({ vertexColors: true, roughness: 0.86, metalness: 0, normalMap: GRAIN, normalScale: new THREE.Vector2(0.6, 0.6) }),          // cloth, leather, wood, rock, fur, stone
  gloss: std({ vertexColors: true, roughness: 0.34, metalness: 0, normalMap: GRAIN, normalScale: new THREE.Vector2(0.35, 0.35) }),        // chitin, wet rock, oiled leather, skin sheen
  metal: std({ vertexColors: true, roughness: 0.4, metalness: 0.85, normalMap: GRAIN, normalScale: new THREE.Vector2(0.25, 0.25) }),      // iron, steel, tin, worn brass
  polish: std({ vertexColors: true, roughness: 0.2, metalness: 1, emissive: 0x1a1000 }),                                                     // gold, polished brass, bright steel edges
  skin: std({ vertexColors: true, roughness: 0.62, metalness: 0, side: THREE.DoubleSide }),                                                 // membranes, fins, paper
  glow: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),                                                            // HDR glowing details (colour > 1)
  lens: std({ color: 0x1c1408, roughness: 0.1, metalness: 0, emissive: 0xffe0b0, emissiveIntensity: 7 }),                                 // the helmet lamp lens
  core: std({ color: 0x1a0600, roughness: 0.3, metalness: 0, emissive: 0xff5a18, emissiveIntensity: 5 }),                                  // the Molten Heart's core
  crystal: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.82, emissive: 0x08040c }),
  gem: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.03, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02, emissive: 0x050505, specularIntensity: 1 }),
  ghost: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
};
for (const k in MATS) MATS[k].name = 'gd-' + k;
export const hdr = (hex, k = 1) => new THREE.Color(hex).multiplyScalar(k);

// ------------------------------------------------------------------ geometry library (cached)
const G = new Map();
const geo = (k, f) => { let g = G.get(k); if (!g) { g = f(); G.set(k, g); } return g; };
const box = (x, y, z) => geo(`b${x},${y},${z}`, () => new THREE.BoxGeometry(x, y, z));
const cyl = (a, b, h, n = 14, open = false) => geo(`c${a},${b},${h},${n},${open}`, () => new THREE.CylinderGeometry(a, b, h, n, 1, open));
const sph = (r, w = 18, h = 12) => geo(`s${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h));
const hemi = (r, w = 20, h = 8) => geo(`h${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h, 0, Math.PI * 2, 0, Math.PI / 2));
const cap = (r, l, n = 12) => geo(`k${r},${l},${n}`, () => new THREE.CapsuleGeometry(r, l, 4, n));
const tor = (r, t, n = 24, m = 8, arc = Math.PI * 2) => geo(`t${r},${t},${n},${m},${arc}`, () => new THREE.TorusGeometry(r, t, m, n, arc));
const cone = (r, h, n = 12) => geo(`n${r},${h},${n}`, () => new THREE.ConeGeometry(r, h, n));
const dode = (r) => geo(`d${r}`, () => flat(new THREE.DodecahedronGeometry(r, 0)));
const octa = (r) => geo(`o${r}`, () => flat(new THREE.OctahedronGeometry(r, 0)));
function flat(g) { const q = g.index ? g.toNonIndexed() : g; q.computeVertexNormals(); return q; }
// a box with rounded, bevelled edges
function rbox(w, h, d, r = 0.02) {
  return geo(`r${w},${h},${d},${r}`, () => {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    const s = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    s.moveTo(x, y); s.lineTo(x + W, y); s.lineTo(x + W, y + H); s.lineTo(x, y + H); s.lineTo(x, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.0005, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 2 });
    g.translate(0, 0, -(d - 2 * r) / 2);
    g.computeVertexNormals();
    return g;
  });
}
// a turned part from [radius, y] points (axis = +Y)
const lathe = (key, pts, n = 20) => geo('l' + key, () => { const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y)), n); g.computeVertexNormals(); return g; });
// a tube along points
const tube = (key, pts, r, segs = 16, rad = 6, closed = false) => geo('u' + key, () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), closed), segs, r, rad, closed));
// a flat outline [[x, y]...] extruded by t along Z (centred on z = 0)
function plate(key, pts, t = 0.01, bev = 0) {
  return geo('p' + key + t, () => {
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 1, curveSegments: 4 });
    g.translate(0, 0, -t / 2);
    g.computeVertexNormals();
    return g;
  });
}
// smooth normals on a non-indexed geometry by averaging faces that share a position
function smoothNormals(g) {
  const p = g.attributes.position, n = p.count, acc = new Map(), keys = new Array(n);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), f = new THREE.Vector3(), e = new THREE.Vector3();
  for (let i = 0; i < n; i++) keys[i] = `${Math.round(p.getX(i) * 1e4)},${Math.round(p.getY(i) * 1e4)},${Math.round(p.getZ(i) * 1e4)}`;
  for (let i = 0; i < n; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    f.subVectors(c, b).cross(e.subVectors(a, b));
    for (let k = 0; k < 3; k++) { const v = acc.get(keys[i + k]); if (v) v.add(f); else acc.set(keys[i + k], f.clone()); }
  }
  const nor = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const v = acc.get(keys[i]).clone().normalize(); nor[i * 3] = v.x; nor[i * 3 + 1] = v.y; nor[i * 3 + 2] = v.z; }
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return g;
}
// a lumpy rock: an icosphere pushed in and out by noise, then scaled
function lump(key, r, detail, amp, freq = 2.2, seed = 0, sx = 1, sy = 1, sz = 1) {
  return geo(`m${key},${r},${detail},${amp},${freq},${seed},${sx},${sy},${sz}`, () => {
    const g0 = new THREE.IcosahedronGeometry(r, detail);
    const g = g0.index ? g0.toNonIndexed() : g0;
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const d = v.clone().normalize();
      const k = 1 + (fbm(d.x * freq + seed * 3.1, d.y * freq + seed, d.z * freq - seed) - 0.5) * 2 * amp;
      p.setXYZ(i, v.x * k * sx, v.y * k * sy, v.z * k * sz);
    }
    smoothNormals(g);
    return g;
  });
}
// displace an existing (cached) geometry's vertices by noise along their normals (rocks, bark, dents)
function roughen(key, src, amp, freq = 3, seed = 0) {
  return geo('x' + key, () => {
    const g = (src.index ? src.toNonIndexed() : src.clone());
    if (!g.attributes.normal) g.computeVertexNormals();
    smoothNormals(g);
    const p = g.attributes.position, nn = g.attributes.normal, v = new THREE.Vector3(), nv = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); nv.fromBufferAttribute(nn, i);
      const k = (fbm(v.x * freq + seed, v.y * freq, v.z * freq - seed) - 0.5) * 2 * amp;
      p.setXYZ(i, v.x + nv.x * k, v.y + nv.y * k, v.z + nv.z * k);
    }
    smoothNormals(g);
    return g;
  });
}
// a hexagonal prism with a pointed tip (crystals): base at y = 0, axis +Y
const prism = (r, h, tip = 0.35) => geo(`q${r},${h},${tip}`, () => flat(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(r, 0.001), new THREE.Vector2(r, h * (1 - tip)), new THREE.Vector2(0, h)], 6)));

// ------------------------------------------------------------------ the kit: collect parts, merge them per joint and material
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _d = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
const toColor = (c) => (c && c.isColor ? c : new THREE.Color(c));
class Kit {
  constructor() { this.root = new THREE.Group(); this.buckets = new Map(); this.shadow = true; }
  group(name, parent = this.root, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.name = name || ''; g.position.set(x, y, z); parent.add(g); return g; }
  // add(geometry, material key, colour, [x,y,z], [rx,ry,rz], scale (number or [x,y,z]), parent, { own: 'name' (a separate named mesh), grime: 0..1, freq })
  add(g, mat, col, p = null, r = null, s = 1, parent = this.root, o = {}) {
    _p.set(p ? p[0] : 0, p ? p[1] : 0, p ? p[2] : 0);
    _q.setFromEuler(_e.set(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0));
    if (typeof s === 'number') _s.set(s, s, s); else _s.set(s[0], s[1], s[2]);
    const m = new THREE.Matrix4().compose(_p, _q, _s);
    const key = parent.uuid + '|' + mat + '|' + (o.own || '');
    let b = this.buckets.get(key);
    if (!b) { b = { parent, mat, own: o.own || '', list: [] }; this.buckets.set(key, b); }
    b.list.push({ g, m, col: toColor(col), grime: o.grime ?? (mat === 'glow' || mat === 'ghost' ? 0 : 0.16), freq: o.freq || 6, fade: o.fade || null });
    return this;
  }
  // a part between two points (struts, bones, straps)
  rod(mat, col, a, b, r, parent = this.root, n = 8, o) {
    _a.set(...a); _b.set(...b); _d.subVectors(_b, _a);
    const l = _d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(_up, _d.clone().normalize());
    const e = new THREE.Euler().setFromQuaternion(q);
    return this.add(cyl(r, r, 1, n), mat, col, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], [e.x, e.y, e.z], [1, l, 1], parent, o);
  }
  build() {
    for (const b of this.buckets.values()) {
      const g = mergeParts(b.list, b.mat !== 'lens' && b.mat !== 'core');
      const mesh = new THREE.Mesh(g, MATS[b.mat]);
      mesh.name = b.own;
      const lit = !(b.mat === 'glow' || b.mat === 'ghost' || b.mat === 'lens' || b.mat === 'core');
      mesh.castShadow = this.shadow && lit && b.mat !== 'crystal'; mesh.receiveShadow = lit;
      b.parent.add(mesh);
    }
    this.buckets.clear();
    return this.root;
  }
}
// merge parts into one non-indexed geometry with a colour attribute (grime: a soft noise darkening per vertex)
function mergeParts(list, colored = true) {
  let n = 0;
  const parts = list.map((it) => {
    const q = it.g.index ? it.g.toNonIndexed() : it.g.clone();
    if (!q.attributes.normal) q.computeVertexNormals();
    q.applyMatrix4(it.m);
    if (it.m.determinant() < 0) { // mirrored: keep the faces pointing out
      for (const name of ['position', 'normal', 'uv']) {
        const at = q.attributes[name]; if (!at) continue;
        const sz = at.itemSize, arr = at.array;
        for (let i = 0; i < at.count; i += 3) for (let k = 0; k < sz; k++) { const t = arr[(i + 1) * sz + k]; arr[(i + 1) * sz + k] = arr[(i + 2) * sz + k]; arr[(i + 2) * sz + k] = t; }
      }
    }
    n += q.attributes.position.count;
    return q;
  });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), col = colored ? new Float32Array(n * 3) : null;
  let o = 0;
  for (let pi = 0; pi < parts.length; pi++) {
    const q = parts[pi], c = q.attributes.position.count, it = list[pi];
    pos.set(q.attributes.position.array, o * 3);
    nor.set(q.attributes.normal.array, o * 3);
    if (q.attributes.uv) uv.set(q.attributes.uv.array.subarray(0, c * 2), o * 2);
    if (col) {
      const C = it.col, pa = q.attributes.position.array, f = it.freq;
      for (let k = 0; k < c; k++) {
        let s = 1;
        if (it.grime) { const x = pa[k * 3], y = pa[k * 3 + 1], z = pa[k * 3 + 2]; s = 1 - it.grime + it.grime * 2 * fbm(x * f + 11, y * f, z * f + 3) * 0.9; }
        if (it.fade) { const t = Math.min(1, Math.max(0, (pa[k * 3 + 1] - it.fade[0]) / (it.fade[1] - it.fade[0]))); s *= t * t * (3 - 2 * t); }
        col[(o + k) * 3] = C.r * s; col[(o + k) * 3 + 1] = C.g * s; col[(o + k) * 3 + 2] = C.b * s;
      }
    }
    o += c;
    q.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}
// build each model type once, hand out clones that share geometry and materials
const PROTO = new Map();
function make(key, build) {
  if (!PROTO.has(key)) PROTO.set(key, build());
  return PROTO.get(key).clone(true);
}
const by = (o, name) => o.getObjectByName(name);

// ------------------------------------------------------------------ palette
const C = {
  denim: 0x2f4664, denimLt: 0x4a6382, shirt: 0x7a3326, leather: 0x4a2e1b, leatherDk: 0x2b1a10, boot: 0x2a1b12, skinT: 0xb07656,
  beard: 0x4f3d2e, helmet: 0x6b6541, brass: 0xb58a3c, steel: 0x8d949b, iron: 0x4a4744, ironDk: 0x2e2c2a, wood: 0x6a4b2c, woodDk: 0x47321f,
  wood2: 0x7d5a35, canvas: 0x6e6448, hemp: 0xa48c5c, navy: 0x233450, gold: 0xe6b24c, rock: 0x6b6158, rockDk: 0x3d3833, stone: 0x857c6c,
  bone: 0xcfc1a0, paper: 0xd9ccaa, red: 0xa3251b, fur: 0x2c2422, membrane: 0x3a2b2b, chitin: 0x1b2a2e, basaltC: 0x262220, obsid: 0x0e0c10,
};

// ================================================================== THE DIGGER
function buildDigger() {
  const K = new Kit(), R = K.root;
  const hips = K.group('hips', R, 0, 0.9, 0);
  // pelvis, belt, buckle, tool pouch and a hammer loop
  K.add(rbox(0.29, 0.2, 0.35, 0.07), 'rough', C.denim, [0, -0.03, 0], null, 1, hips);
  K.add(rbox(0.31, 0.065, 0.37, 0.025), 'gloss', C.leatherDk, [0, 0.06, 0], null, 1, hips);
  K.add(rbox(0.014, 0.06, 0.075, 0.006), 'polish', C.brass, [0.158, 0.06, 0.0], null, 1, hips);
  K.add(rbox(0.02, 0.032, 0.05, 0.004), 'gloss', C.leatherDk, [0.163, 0.06, 0.0], null, 1, hips);
  K.add(rbox(0.13, 0.13, 0.06, 0.02), 'rough', C.leather, [0.02, -0.01, 0.2], [0, 0, 0.05], 1, hips);
  K.add(rbox(0.135, 0.05, 0.066, 0.015), 'gloss', C.leatherDk, [0.02, 0.05, 0.2], [0, 0, 0.05], 1, hips);
  K.add(sph(0.008, 6, 4), 'polish', C.brass, [0.02, 0.035, 0.235], null, 1, hips);
  K.add(rbox(0.09, 0.1, 0.05, 0.015), 'rough', C.leather, [-0.08, -0.02, -0.19], null, 1, hips);
  // seat seam, front fly
  K.add(rbox(0.012, 0.14, 0.012, 0.004), 'rough', C.denimLt, [0.148, -0.05, 0], null, 1, hips);
  for (const s of [-1, 1]) {
    const leg = K.group(s > 0 ? 'legR' : 'legL', hips, 0, -0.05, s * 0.095);
    K.add(cyl(0.088, 0.07, 0.42, 14), 'rough', C.denim, [0, -0.2, 0], null, 1, leg);
    K.add(rbox(0.05, 0.11, 0.1, 0.02), 'rough', C.denimLt, [0.06, -0.37, 0], null, 1, leg);          // knee patch
    K.add(rbox(0.012, 0.32, 0.012, 0.004), 'rough', C.denimLt, [0, -0.2, s * 0.083], null, 1, leg);   // outer seam
    const shin = K.group(s > 0 ? 'shinR' : 'shinL', leg, 0, -0.4, 0);
    K.add(cyl(0.07, 0.062, 0.3, 14), 'rough', C.denim, [0, -0.15, 0], null, 1, shin);
    K.add(tor(0.067, 0.02, 16, 6), 'rough', C.denimLt, [0, -0.28, 0], [Math.PI / 2, 0, 0], 1, shin);   // rolled cuff
    // boot: shaft, foot, toe cap, heel, sole, laces and eyelets
    K.add(cyl(0.072, 0.075, 0.13, 14), 'gloss', C.boot, [0, -0.35, 0], null, 1, shin);
    K.add(rbox(0.25, 0.085, 0.12, 0.035), 'gloss', C.boot, [0.045, -0.405, 0], null, 1, shin);
    K.add(sph(0.062, 14, 10), 'gloss', 0x231710, [0.15, -0.41, 0], null, [1.15, 0.72, 1.0], shin);
    K.add(rbox(0.07, 0.04, 0.115, 0.012), 'gloss', 0x1b120c, [-0.055, -0.43, 0], null, 1, shin);
    K.add(rbox(0.29, 0.022, 0.13, 0.008), 'rough', 0x18120d, [0.05, -0.439, 0], null, 1, shin);
    for (let k = 0; k < 4; k++) {
      K.add(rbox(0.01, 0.008, 0.07, 0.003), 'rough', 0x8a7a5a, [0.02 + k * 0.03, -0.362 + (k < 2 ? 0.03 - k * 0.015 : 0), 0], [0, 0, 0.5], 1, shin);
      for (const zz of [-0.04, 0.04]) K.add(sph(0.006, 5, 4), 'polish', C.brass, [0.015 + k * 0.03, -0.36 + (k < 2 ? 0.03 - k * 0.015 : 0), zz], null, 1, shin);
    }
    for (let k = 0; k < 5; k++) K.add(box(0.012, 0.006, 0.13), 'rough', 0x0d0907, [-0.06 + k * 0.05, -0.452, 0], null, 1, shin, { grime: 0 }); // hobnails
  }
  // ---- torso
  const torso = K.group('torso', hips, 0, 0.04, 0);
  // shirt: a turned torso, wider across the shoulders than front to back
  const TS = [0.82, 1, 1.12];
  K.add(lathe('torsoShirt', [[0, -0.02], [0.14, 0.0], [0.152, 0.08], [0.163, 0.2], [0.173, 0.32], [0.171, 0.4], [0.15, 0.46], [0.1, 0.505], [0.05, 0.525], [0, 0.53]], 24), 'rough', C.shirt, [0, 0, 0], null, TS, torso, { grime: 0.22, freq: 14 });
  for (let k = 0; k < 5; k++) K.add(sph(0.008, 6, 4), 'rough', 0xd8cdb4, [0.148, 0.09 + k * 0.075, 0], null, [0.6, 1, 1], torso);
  // leather vest: an open-fronted shell over the shirt, trimmed edges, pockets, buttons, a watch chain
  const vest = geo('vestShell', () => { const g = new THREE.LatheGeometry([[0.149, 0.0], [0.159, 0.08], [0.17, 0.2], [0.18, 0.32], [0.178, 0.4], [0.163, 0.445]].map(([r, y]) => new THREE.Vector2(r, y)), 24, Math.PI / 2 + 0.3, Math.PI * 2 - 0.6); g.computeVertexNormals(); return g; });
  K.add(vest, 'skin', C.leather, [0, 0, 0], null, TS, torso, { grime: 0.3, freq: 16 });
  for (const s of [-1, 1]) {
    const ph = Math.PI / 2 + s * 0.3, ex = Math.sin(ph) * 0.82, ez = Math.cos(ph) * 1.12;
    K.add(tube('vestEdge' + s, [[0.15 * ex, 0.0, 0.15 * ez], [0.171 * ex, 0.2, 0.171 * ez], [0.181 * ex, 0.32, 0.181 * ez], [0.165 * ex, 0.445, 0.165 * ez]], 0.007, 12, 5), 'gloss', C.leatherDk, null, null, 1, torso);
    K.add(rbox(0.012, 0.06, 0.07, 0.005), 'gloss', C.leatherDk, [0.142, 0.11, s * 0.085], [0, s * -0.4, 0], 1, torso);   // pocket
  }
  for (let k = 0; k < 4; k++) K.add(sph(0.01, 8, 6), 'polish', C.brass, [0.147, 0.08 + k * 0.08, -0.06], null, [0.5, 1, 1], torso);
  K.add(tube('watch', [[0.144, 0.115, -0.085], [0.152, 0.08, -0.03], [0.152, 0.085, 0.04], [0.144, 0.115, 0.09]], 0.004, 14, 4), 'polish', C.gold, null, null, 1, torso);
  // neckerchief and knot
  K.add(cone(0.06, 0.11, 4), 'rough', C.navy, [0.11, 0.43, 0], [0, Math.PI / 4, Math.PI], [1, 1, 0.3], torso);
  K.add(sph(0.026, 10, 8), 'rough', C.navy, [0.115, 0.47, 0], null, [0.8, 0.8, 1], torso);
  K.add(tor(0.062, 0.02, 16, 6), 'rough', C.navy, [0.01, 0.49, 0], [Math.PI / 2, 0, 0], [1, 1.1, 1], torso);
  K.add(cyl(0.05, 0.055, 0.1, 12), 'rough', C.skinT, [0.01, 0.525, 0], null, 1, torso);                         // neck
  K.add(sph(0.075, 14, 10), 'rough', C.shirt, [0, 0.43, 0.17], null, [1, 0.85, 1], torso);
  K.add(sph(0.075, 14, 10), 'rough', C.shirt, [0, 0.43, -0.17], null, [1, 0.85, 1], torso);
  // ---- backpack with rope coil, bedroll and a small shovel
  const pack = K.group('pack', torso, -0.2, 0.26, 0);
  K.add(rbox(0.15, 0.34, 0.29, 0.05), 'rough', C.canvas, [0, 0, 0], null, 1, pack);
  K.add(rbox(0.16, 0.12, 0.3, 0.03), 'rough', 0x5d543b, [0.005, 0.13, 0], [0, 0, -0.05], 1, pack);
  K.add(rbox(0.06, 0.13, 0.1, 0.02), 'rough', 0x5d543b, [-0.09, -0.06, 0.06], null, 1, pack);
  for (const zz of [-0.08, 0.08]) {
    K.add(box(0.012, 0.3, 0.03), 'gloss', C.leatherDk, [-0.078, 0, zz], null, 1, pack);
    K.add(rbox(0.016, 0.03, 0.04, 0.005), 'metal', C.iron, [-0.084, -0.04, zz], null, 1, pack);
    K.add(tube('strap' + zz, [[0.06, 0.14, zz], [0.17, 0.2, zz * 1.4], [0.3, 0.12, zz * 1.5], [0.36, -0.05, zz * 1.4]], 0.012, 12, 4), 'gloss', C.leatherDk, null, null, [1, 1, 1], pack);
  }
  // rope coil on the camera side
  K.add(tor(0.1, 0.022, 28, 7), 'rough', C.hemp, [-0.01, -0.02, 0.165], null, 1, pack, { grime: 0.25, freq: 30 });
  K.add(tor(0.085, 0.02, 28, 7), 'rough', 0x8f784b, [-0.01, -0.01, 0.185], [0, 0, 0.4], 1, pack, { grime: 0.25, freq: 30 });
  K.add(tor(0.024, 0.008, 10, 5), 'rough', C.hemp, [-0.01, 0.075, 0.175], [0, Math.PI / 2, 0], 1, pack);
  // bedroll across the top
  K.add(cyl(0.065, 0.065, 0.36, 14), 'rough', 0x6a3326, [-0.01, 0.22, 0], [Math.PI / 2, 0, 0], 1, pack);
  K.add(tor(0.064, 0.008, 14, 4), 'rough', 0x37241a, [-0.01, 0.22, 0.008], [0, 0, 0], [1, 1, 1], pack);
  for (const zz of [-0.11, 0.11]) K.add(tor(0.068, 0.009, 14, 4), 'gloss', C.leatherDk, [-0.01, 0.22, zz], null, 1, pack);
  // shovel strapped behind
  K.rod('rough', C.wood, [-0.1, -0.25, -0.12], [-0.11, 0.42, -0.06], 0.014, pack, 6);
  K.add(rbox(0.07, 0.016, 0.02, 0.005), 'rough', C.wood, [-0.11, 0.43, -0.06], null, 1, pack);
  K.add(rbox(0.012, 0.15, 0.12, 0.004), 'metal', C.steel, [-0.1, -0.3, -0.125], [0.1, 0, 0], 1, pack);
  // ---- arms
  for (const s of [-1, 1]) {
    const arm = K.group(s > 0 ? 'armR' : 'armL', torso, 0, 0.43, s * 0.205);
    K.add(cap(0.05, 0.16, 12), 'rough', C.shirt, [0, -0.12, 0], null, 1, arm);
    K.add(tor(0.058, 0.022, 16, 6), 'rough', 0x6a2b20, [0, -0.25, 0], [Math.PI / 2, 0, 0], 1, arm);       // rolled sleeve
    const fore = K.group(s > 0 ? 'foreR' : 'foreL', arm, 0, -0.27, 0);
    K.add(cap(0.045, 0.14, 10), 'rough', C.skinT, [0, -0.09, 0], null, 1, fore);
    K.add(cyl(0.05, 0.058, 0.06, 12), 'gloss', 0x8a6038, [0, -0.18, 0], null, 1, fore);                   // glove cuff
    K.add(rbox(0.085, 0.09, 0.07, 0.03), 'gloss', 0x7a532f, [0.005, -0.235, 0], null, 1, fore);            // palm
    K.add(rbox(0.07, 0.04, 0.075, 0.018), 'gloss', 0x7a532f, [0.035, -0.275, 0], [0, 0, 0.3], 1, fore);    // fingers
    K.add(cap(0.016, 0.04, 6), 'gloss', 0x7a532f, [0.04, -0.23, s * -0.035], [0, 0, -0.9], 1, fore);       // thumb
    if (s > 0) {
      // the pickaxe: handle forward from the hand, a two-ended head at the far end (spike down, chisel up)
      const pick = K.group('pick', fore, 0.01, -0.255, 0);
      K.add(cyl(0.019, 0.022, 0.74, 10), 'rough', 0x8a6a44, [0.25, 0, 0], [0, 0, Math.PI / 2], 1, pick, { grime: 0.3, freq: 18 });
      K.add(cyl(0.025, 0.025, 0.14, 10), 'gloss', C.leatherDk, [-0.04, 0, 0], [0, 0, Math.PI / 2], 1, pick);
      for (let k = 0; k < 4; k++) K.add(tor(0.025, 0.004, 10, 4), 'gloss', 0x1d120b, [-0.09 + k * 0.032, 0, 0], [0, Math.PI / 2, 0], 1, pick);
      K.add(rbox(0.07, 0.075, 0.06, 0.012), 'metal', 0x5d6168, [0.6, 0, 0], null, 1, pick);
      K.add(cone(0.024, 0.27, 8), 'metal', C.steel, [0.62, -0.16, 0], [0, 0, Math.PI - 0.22], [1, 1, 0.85], pick);
      K.add(cone(0.008, 0.06, 6), 'polish', 0xc8cdd2, [0.66, -0.29, 0], [0, 0, Math.PI - 0.3], 1, pick);
      K.add(cyl(0.012, 0.03, 0.2, 4), 'metal', C.steel, [0.6, 0.13, 0], [0, Math.PI / 4, 0.12], [1, 1, 1.4], pick);
      K.add(box(0.05, 0.012, 0.018), 'polish', 0xc8cdd2, [0.615, 0.235, 0], [0, 0, 0.12], 1, pick);
      K.add(sph(0.012, 6, 4), 'metal', 0x3a3d42, [0.6, 0, 0.033], null, 1, pick);
    }
  }
  // ---- head: face, beard, helmet and the brass miner's lamp
  const head = K.group('head', torso, 0.01, 0.5, 0);
  K.add(sph(0.105, 20, 14), 'rough', C.skinT, [0, 0.11, 0], null, [0.97, 1.08, 0.92], head);
  K.add(sph(0.06, 12, 8), 'rough', C.skinT, [0.065, 0.12, 0.03], null, [0.7, 0.8, 0.9], head);
  K.add(sph(0.06, 12, 8), 'rough', C.skinT, [0.065, 0.12, -0.03], null, [0.7, 0.8, 0.9], head);
  K.add(cone(0.021, 0.055, 8), 'rough', 0xa86c4c, [0.112, 0.115, 0], [0, 0, -Math.PI / 2 - 0.25], 1, head);
  K.add(sph(0.02, 10, 8), 'rough', 0xa86c4c, [0.13, 0.1, 0], null, [1, 0.9, 1.1], head);
  for (const s of [-1, 1]) {
    K.add(sph(0.026, 8, 6), 'rough', 0xa06a4c, [0.0, 0.11, s * 0.098], null, [0.6, 1, 0.35], head);
    K.add(sph(0.012, 8, 6), 'gloss', 0xece4d4, [0.093, 0.137, s * 0.038], null, 1, head);
    K.add(sph(0.0075, 8, 6), 'gloss', 0x2c2216, [0.103, 0.138, s * 0.039], null, 1, head, { grime: 0 });
    K.add(rbox(0.03, 0.012, 0.035, 0.005), 'rough', C.beard, [0.1, 0.157, s * 0.04], [s * 0.15, 0, 0.12], 1, head);
  }
  // beard, moustache, sideburns
  K.add(lump('beard', 0.08, 4, 0.18, 4.5, 2, 0.8, 0.85, 1.1), 'rough', C.beard, [0.035, 0.045, 0], null, 1, head, { grime: 0.35, freq: 40 });
  K.add(lump('beard2', 0.04, 2, 0.3, 6, 5, 1.1, 1.3, 1.0), 'rough', 0x5b4736, [0.06, -0.005, 0], [0, 0, 0.3], 1, head, { grime: 0.3, freq: 40 });
  K.add(cap(0.017, 0.07, 8), 'rough', 0x3e2f23, [0.118, 0.077, 0], [Math.PI / 2, 0, 0], [1, 1, 1], head);
  for (const s of [-1, 1]) K.add(rbox(0.03, 0.06, 0.02, 0.008), 'rough', C.beard, [0.035, 0.1, s * 0.093], null, 1, head);
  K.add(lump('hair', 0.07, 1, 0.25, 5, 3, 1, 0.7, 1.3), 'rough', 0x3d3025, [-0.06, 0.1, 0], null, 1, head, { grime: 0.3, freq: 40 });
  // helmet: dented tin dome with a comb ridge, a wide brim, a leather band
  K.add(roughen('helm', hemi(0.128, 22, 9), 0.006, 9, 2), 'gloss', C.helmet, [0, 0.155, 0], null, [1.08, 0.88, 1.0], head, { grime: 0.3, freq: 14 });
  K.add(cyl(0.165, 0.172, 0.014, 26), 'gloss', 0x5f5939, [0, 0.152, 0], null, [1.12, 1, 1], head, { grime: 0.3, freq: 14 });
  K.add(tor(0.133, 0.009, 26, 5), 'gloss', C.leatherDk, [0, 0.165, 0], [Math.PI / 2, 0, 0], [1.07, 1, 1], head);
  K.add(rbox(0.22, 0.03, 0.018, 0.008), 'gloss', 0x5f5939, [0, 0.255, 0], null, 1, head);
  K.add(tor(0.11, 0.009, 20, 5, Math.PI), 'gloss', 0x5f5939, [0, 0.16, 0], [0, 0, 0], [1.25, 0.9, 1], head);
  // lamp: bracket, carbide tank, body, polished reflector, lens
  K.add(rbox(0.03, 0.06, 0.05, 0.008), 'polish', C.brass, [0.135, 0.205, 0], null, 1, head);
  K.add(cyl(0.022, 0.022, 0.055, 12), 'polish', C.brass, [0.14, 0.17, 0], null, 1, head);
  K.add(cyl(0.026, 0.024, 0.04, 14), 'polish', C.brass, [0.158, 0.215, 0], [0, 0, Math.PI / 2], 1, head);
  K.add(lathe('reflector', [[0.015, 0], [0.027, 0.01], [0.037, 0.022], [0.04, 0.026], [0.035, 0.026]], 18), 'polish', 0xd7b36a, [0.175, 0.215, 0], [0, 0, -Math.PI / 2], 1, head);
  K.add(tor(0.038, 0.005, 18, 4), 'polish', C.brass, [0.2, 0.215, 0], [0, Math.PI / 2, 0], 1, head);
  K.add(cyl(0.035, 0.035, 0.006, 18), 'lens', 0xffffff, [0.198, 0.215, 0], [0, 0, Math.PI / 2], 1, head, { own: 'lampLens' });
  const anchor = new THREE.Object3D(); anchor.name = 'lampAnchor'; anchor.position.set(0.21, 0.215, 0); head.add(anchor);
  return K.build();
}
// ---- the realistic digger's gear (js/digger.js puts these on the skinned body's bones)
// helmet: +X forward, +Y up, origin where the old head joint was (the dome sits 0.155 above it)
function buildHelmet() {
  const K = new Kit(), head = K.root;
  K.add(roughen('helm', hemi(0.128, 22, 9), 0.006, 9, 2), 'gloss', C.helmet, [0, 0.155, 0], null, [1.04, 1.36, 0.98], head, { grime: 0.3, freq: 14 });
  K.add(cyl(0.165, 0.172, 0.014, 26), 'gloss', 0x5f5939, [0, 0.152, 0], null, [1.12, 1, 1], head, { grime: 0.3, freq: 14 });
  K.add(tor(0.133, 0.009, 26, 5), 'gloss', C.leatherDk, [0, 0.165, 0], [Math.PI / 2, 0, 0], [1.07, 1, 1], head);
  K.add(rbox(0.2, 0.03, 0.018, 0.008), 'gloss', 0x5f5939, [0, 0.322, 0], null, 1, head);
  K.add(tor(0.11, 0.009, 20, 5, Math.PI), 'gloss', 0x5f5939, [0, 0.16, 0], [0, 0, 0], [1.21, 1.42, 1], head);
  K.add(rbox(0.03, 0.06, 0.05, 0.008), 'polish', C.brass, [0.135, 0.205, 0], null, 1, head);
  K.add(cyl(0.022, 0.022, 0.055, 12), 'polish', C.brass, [0.14, 0.17, 0], null, 1, head);
  K.add(cyl(0.026, 0.024, 0.04, 14), 'polish', C.brass, [0.158, 0.215, 0], [0, 0, Math.PI / 2], 1, head);
  K.add(lathe('reflector', [[0.015, 0], [0.027, 0.01], [0.037, 0.022], [0.04, 0.026], [0.035, 0.026]], 18), 'polish', 0xd7b36a, [0.175, 0.215, 0], [0, 0, -Math.PI / 2], 1, head);
  K.add(tor(0.038, 0.005, 18, 4), 'polish', C.brass, [0.2, 0.215, 0], [0, Math.PI / 2, 0], 1, head);
  K.add(cyl(0.035, 0.035, 0.006, 18), 'lens', 0xffffff, [0.198, 0.215, 0], [0, 0, Math.PI / 2], 1, head, { own: 'lampLens' });
  const anchor = new THREE.Object3D(); anchor.name = 'lampAnchor'; anchor.position.set(0.21, 0.215, 0); head.add(anchor);
  return K.build();
}
// pickaxe: +X along the handle from the grip to the head, spike toward -Y, chisel toward +Y
function buildPick() {
  const K = new Kit(), pick = K.group('pick');
  K.add(cyl(0.019, 0.022, 0.74, 10), 'rough', 0x8a6a44, [0.25, 0, 0], [0, 0, Math.PI / 2], 1, pick, { grime: 0.3, freq: 18 });
  K.add(cyl(0.025, 0.025, 0.14, 10), 'gloss', C.leatherDk, [-0.04, 0, 0], [0, 0, Math.PI / 2], 1, pick);
  for (let k = 0; k < 4; k++) K.add(tor(0.025, 0.004, 10, 4), 'gloss', 0x1d120b, [-0.09 + k * 0.032, 0, 0], [0, Math.PI / 2, 0], 1, pick);
  K.add(rbox(0.07, 0.075, 0.06, 0.012), 'metal', 0x5d6168, [0.6, 0, 0], null, 1, pick);
  K.add(cone(0.024, 0.27, 8), 'metal', C.steel, [0.62, -0.16, 0], [0, 0, Math.PI - 0.22], [1, 1, 0.85], pick);
  K.add(cone(0.008, 0.06, 6), 'polish', 0xc8cdd2, [0.66, -0.29, 0], [0, 0, Math.PI - 0.3], 1, pick);
  K.add(cyl(0.012, 0.03, 0.2, 4), 'metal', C.steel, [0.6, 0.13, 0], [0, Math.PI / 4, 0.12], [1, 1, 1.4], pick);
  K.add(box(0.05, 0.012, 0.018), 'polish', 0xc8cdd2, [0.615, 0.235, 0], [0, 0, 0.12], 1, pick);
  K.add(sph(0.012, 6, 4), 'metal', 0x3a3d42, [0.6, 0, 0.033], null, 1, pick);
  return K.build();
}
// pack: +X forward (toward the wearer's back), centred on the pack
function buildPack() {
  const K = new Kit(), pack = K.group('pack');
  K.add(rbox(0.15, 0.34, 0.29, 0.05), 'rough', C.canvas, [0, 0, 0], null, 1, pack);
  K.add(rbox(0.16, 0.12, 0.3, 0.03), 'skin', 0x5d543b, [0.005, 0.13, 0], [0, 0, -0.05], 1, pack);   // (oiled leather flap: also keeps the 'skin' shader compiled from the first frame)
  K.add(rbox(0.06, 0.13, 0.1, 0.02), 'rough', 0x5d543b, [-0.09, -0.06, 0.06], null, 1, pack);
  for (const zz of [-0.08, 0.08]) {
    K.add(box(0.012, 0.3, 0.03), 'gloss', C.leatherDk, [-0.078, 0, zz], null, 1, pack);
    K.add(rbox(0.016, 0.03, 0.04, 0.005), 'metal', C.iron, [-0.084, -0.04, zz], null, 1, pack);
  }
  K.add(tor(0.1, 0.022, 28, 7), 'rough', C.hemp, [-0.01, -0.02, 0.165], null, 1, pack, { grime: 0.25, freq: 30 });
  K.add(tor(0.085, 0.02, 28, 7), 'rough', 0x8f784b, [-0.01, -0.01, 0.185], [0, 0, 0.4], 1, pack, { grime: 0.25, freq: 30 });
  K.add(tor(0.024, 0.008, 10, 5), 'rough', C.hemp, [-0.01, 0.075, 0.175], [0, Math.PI / 2, 0], 1, pack);
  K.add(cyl(0.065, 0.065, 0.36, 14), 'rough', 0x6a3326, [-0.01, 0.22, 0], [Math.PI / 2, 0, 0], 1, pack);
  K.add(tor(0.064, 0.008, 14, 4), 'rough', 0x37241a, [-0.01, 0.22, 0.008], [0, 0, 0], [1, 1, 1], pack);
  for (const zz of [-0.11, 0.11]) K.add(tor(0.068, 0.009, 14, 4), 'gloss', C.leatherDk, [-0.01, 0.22, zz], null, 1, pack);
  K.rod('rough', C.wood, [-0.1, -0.25, -0.12], [-0.11, 0.42, -0.06], 0.014, pack, 6);
  K.add(rbox(0.07, 0.016, 0.02, 0.005), 'rough', C.wood, [-0.11, 0.43, -0.06], null, 1, pack);
  K.add(rbox(0.012, 0.15, 0.12, 0.004), 'metal', C.steel, [-0.1, -0.3, -0.125], [0.1, 0, 0], 1, pack);
  return K.build();
}
export function minerGear() {
  const helmet = make('gearHelmet', buildHelmet), pick = make('gearPick', buildPick), pack = make('gearPack', buildPack);
  return { helmet, pick, pack, lampLens: by(helmet, 'lampLens'), lampAnchor: by(helmet, 'lampAnchor') };
}
export function digger() {
  const g = make('digger', buildDigger);
  const rig = {};
  for (const n of ['hips', 'torso', 'head', 'armL', 'armR', 'foreL', 'foreR', 'legL', 'legR', 'shinL', 'shinR', 'pick', 'lampLens', 'lampAnchor', 'pack']) rig[n] = by(g, n);
  return { group: g, rig };
}

// ================================================================== CREATURES
function wingOutline(span, chord, notch = 0.15, rag = 0) {
  // a bat wing in (x = along the body, y = out along the wing): leading edge, finger tips, scalloped trailing edge
  const r = rng(Math.round(span * 1000) + rag * 17);
  const tips = [[0.12, 0.42], [0.0, 1.0], [-0.22, 0.92], [-0.42, 0.72], [-0.5, 0.42]];
  const pts = [[0.04 * chord, 0], [0.16 * chord, 0.22 * span], [0.15 * chord, 0.4 * span]];
  for (let i = 0; i < tips.length; i++) {
    const [tx, ty] = tips[i];
    pts.push([tx * chord, ty * span]);
    if (i > 0 && i < tips.length - 1) {
      const [nx, ny] = tips[i + 1];
      const mx = (tx + nx) / 2 * chord, my = (ty + ny) / 2 * span;
      // scallop inward toward the shoulder
      pts.push([mx * (1 - notch) - 0.05 * chord, my * (1 - notch) - 0.02 * span]);
      if (rag) for (let k = 0; k < rag; k++) { const f = (k + 1) / (rag + 1); pts.push([(tx + (nx - tx) * f) * chord * (0.86 + r() * 0.08), (ty + (ny - ty) * f) * span * (0.84 + r() * 0.1)]); }
    }
  }
  pts.push([-0.35 * chord, 0.12 * span], [-0.2 * chord, 0]);
  return { pts, tips: tips.map(([x, y]) => [x * chord, y * span]) };
}
// wing membrane lying in the x/z plane, extending toward +z (s = 1) or -z (s = -1) from the shoulder
function addWing(K, parent, span, chord, s, colM, colB, boneR, key, rag = 0) {
  const { pts, tips } = wingOutline(span, chord, 0.18, rag);
  const g = plate('wing' + key, pts, boneR * 0.35);
  // the outline's y is the outward direction: rotate so y -> z (or -z)
  K.add(g, 'skin', colM, [0, 0, 0], [s > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0], 1, parent, { grime: 0.25, freq: 3 / chord });
  // arm and finger bones
  const wrist = [0.15 * chord, 0, s * 0.4 * span];
  K.rod('gloss', colB, [0, 0, 0], wrist, boneR * 1.4, parent, 6);
  for (const [tx, ty] of tips) K.rod('gloss', colB, wrist, [tx, 0, s * ty], boneR * 0.8, parent, 5);
  K.add(cone(boneR * 1.4, boneR * 6, 6), 'gloss', 0xd8d0c0, [wrist[0] + boneR * 2, boneR, wrist[2]], [0, 0, -Math.PI / 2], 1, parent); // thumb claw
}
function buildBat() {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R);
  K.add(lump('batbody', 0.07, 3, 0.16, 6, 1, 1.25, 0.95, 1.0), 'rough', C.fur, [0, 0, 0], null, 1, body, { grime: 0.4, freq: 60 });
  K.add(sph(0.046, 14, 10), 'rough', 0x352a26, [0.085, 0.015, 0], null, [1.1, 1, 1], body);
  K.add(cone(0.024, 0.04, 8), 'rough', 0x3d2f2a, [0.125, 0.005, 0], [0, 0, -Math.PI / 2], [1, 1, 0.9], body);
  K.add(sph(0.01, 6, 4), 'gloss', 0x1a1210, [0.145, 0.006, 0], null, [1, 0.7, 1.4], body);
  for (const s of [-1, 1]) {
    K.add(cone(0.024, 0.075, 6), 'skin', 0x4a3532, [0.075, 0.07, s * 0.022], [s * -0.35, 0, -0.2], [1, 1, 0.35], body);
    K.add(sph(0.0085, 8, 6), 'glow', hdr(0xff5a1e, 6), [0.118, 0.026, s * 0.022], null, 1, body);
    K.add(cone(0.004, 0.018, 4), 'gloss', 0xe8e0d0, [0.13, -0.012, s * 0.009], [0, 0, Math.PI], 1, body);   // fangs
    // hind legs with claws
    K.rod('rough', 0x2a201d, [-0.06, -0.03, s * 0.025], [-0.11, -0.06, s * 0.03], 0.007, body, 5);
    K.add(cone(0.005, 0.02, 4), 'gloss', 0xcfc6b5, [-0.115, -0.07, s * 0.03], [0, 0, Math.PI], 1, body);
  }
  const wingR = K.group('wingR', R, 0.01, 0.02, 0.045), wingL = K.group('wingL', R, 0.01, 0.02, -0.045);
  addWing(K, wingR, 0.42, 0.24, 1, C.membrane, 0x241a18, 0.0045, 'bat');
  addWing(K, wingL, 0.42, 0.24, -1, C.membrane, 0x241a18, 0.0045, 'bat');
  return K.build();
}
export function bat() { const g = make('bat', buildBat); return { group: g, wingL: by(g, 'wingL'), wingR: by(g, 'wingR'), body: by(g, 'body') }; }

function buildCrawler() {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R, 0, 0.24, 0);
  // abdomen (wing cases with a seam and ribs), thorax, head
  K.add(sph(0.2, 22, 14), 'gloss', C.chitin, [-0.16, 0.02, 0], null, [1.55, 0.82, 1.18], body, { grime: 0.2, freq: 9 });
  K.add(box(0.5, 0.012, 0.012), 'gloss', 0x07090d, [-0.16, 0.185, 0], null, 1, body, { grime: 0 });
  for (const s of [-1, 1]) for (let k = 1; k <= 3; k++) {
    const zz = s * k * 0.05;
    K.add(tor(0.32, 0.007, 22, 4, Math.PI * 0.62), 'gloss', 0x26303f, [-0.17, -0.12 + Math.cos(k * 0.45) * 0.0, zz], [0, 0, Math.PI * 0.19], [1, 0.9 - k * 0.08, 1], body);
  }
  K.add(sph(0.12, 18, 12), 'gloss', 0x1b2230, [0.14, 0.0, 0], null, [1.0, 0.85, 1.3], body);
  K.add(rbox(0.04, 0.05, 0.3, 0.015), 'gloss', 0x0f141c, [0.21, 0.04, 0], null, 1, body);   // pronotum edge
  K.add(sph(0.075, 14, 10), 'gloss', 0x10151d, [0.29, -0.03, 0], null, [1.05, 0.85, 1.0], body);
  for (const s of [-1, 1]) {
    // mandibles, eyes, antennae
    K.add(tube('mand' + s, [[0.32, -0.06, s * 0.035], [0.39, -0.07, s * 0.05], [0.43, -0.07, s * 0.02], [0.44, -0.075, s * 0.0]], 0.012, 10, 5), 'gloss', 0x2a1e14, null, null, 1, body);
    K.add(sph(0.018, 10, 8), 'gloss', 0x0a0a0c, [0.33, 0.0, s * 0.055], null, 1, body);
    K.add(tube('ant' + s, [[0.33, 0.03, s * 0.03], [0.4, 0.12, s * 0.07], [0.48, 0.16, s * 0.12], [0.55, 0.14, s * 0.16]], 0.005, 14, 4), 'gloss', 0x141820, null, null, 1, body);
    // faint bioluminescent spots down the sides
    for (let k = 0; k < 4; k++) K.add(sph(0.016 - k * 0.002, 8, 6), 'glow', hdr(0x3dffb0, 2.6), [-0.02 - k * 0.11, 0.05 - k * 0.015, s * (0.21 - k * 0.012)], null, [1.4, 1, 0.5], body);
  }
  // six legs: hip pivots on the body's sides; femur up and out, tibia down, a hooked foot
  const hipX = [0.13, 0.0, -0.13];
  for (let i = 0; i < 6; i++) {
    const s = i % 2 ? 1 : -1, x = hipX[Math.floor(i / 2)];
    const leg = K.group('leg' + i, R, x, 0.2, s * 0.12);
    const off = x > 0 ? 0.07 : x < 0 ? -0.07 : 0;
    const knee = [x * 0.25 + 0.02, 0.11, s * 0.21], ank = [x * 0.5 + off, -0.12, s * 0.31], foot = [x * 0.62 + off * 1.4 + 0.01, -0.2, s * 0.34];
    K.add(sph(0.03, 8, 6), 'gloss', 0x141d22, [0, 0, 0], null, 1, leg);
    K.add(tube('femur' + i, [[0, 0, 0], [knee[0] * 0.5, knee[1] * 0.85, knee[2] * 0.5], knee], 0.022, 8, 6), 'gloss', 0x1f2c31, null, null, 1, leg);
    K.add(sph(0.024, 8, 6), 'gloss', 0x141a1e, knee, null, 1, leg);
    K.add(tube('tibia' + i, [knee, [(knee[0] + ank[0]) / 2, knee[1] * 0.2, (knee[2] + ank[2]) / 2], ank], 0.014, 8, 5), 'gloss', 0x26343a, null, null, 1, leg);
    K.rod('gloss', 0x10161a, ank, foot, 0.009, leg, 5);
    for (let k = 0; k < 3; k++) K.add(cone(0.004, 0.025, 4), 'gloss', 0x0b0d10, [(knee[0] + ank[0]) / 2 + (k - 1) * 0.01, knee[1] * 0.2 + 0.01, (knee[2] + ank[2]) / 2], [0, 0, s * 0.8], 1, leg);
  }
  return K.build();
}
export function crawler() { const g = make('crawler', buildCrawler); return { group: g, body: by(g, 'body'), legs: [0, 1, 2, 3, 4, 5].map((i) => by(g, 'leg' + i)) }; }

function buildShade() {
  const K = new Kit(), R = K.root; K.shadow = false;
  // centred on the origin: hood at the top (y ~ +0.65), tattered hem at the bottom (y ~ -0.85)
  const robe = [[0.0, 0.78], [0.12, 0.76], [0.2, 0.62], [0.2, 0.45], [0.24, 0.25], [0.3, 0.0], [0.36, -0.3], [0.42, -0.6], [0.36, -0.85]];
  K.add(lathe('shade1', robe, 32), 'ghost', hdr(0x8fb4e0, 0.42), [0, 0, 0], null, 1, R, { own: 'shadeOuter', fade: [-0.9, 0.5] });
  K.add(lathe('shade2', robe.map(([r, y]) => [r * 0.62, y * 0.9 + 0.04]), 24), 'ghost', hdr(0xb8d8ff, 0.32), [0, 0, 0], [0, 0.5, 0], 1, R, { own: 'shadeInner', fade: [-0.6, 0.7] });
  // trailing ribbons
  const r = rng(91);
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2, x = Math.cos(a) * 0.3, z = Math.sin(a) * 0.3;
    const len = 0.25 + r() * 0.35;
    K.add(tube('shrib' + k, [[x, -0.4, z], [x * 1.2 - 0.05, -0.65, z * 1.2], [x * 1.1 - 0.15 - r() * 0.1, -0.6 - len, z * 1.3]], 0.022, 10, 4), 'ghost', hdr(0x7f9fd0, 0.35), null, null, [1, 1, 1], R, { own: 'shadeRibbons', fade: [-1.2, -0.3] });
  }
  // arms reaching forward
  for (const s of [-1, 1]) K.add(tube('sharm' + s, [[0.05, 0.35, s * 0.18], [0.25, 0.25, s * 0.2], [0.45, 0.2, s * 0.12], [0.58, 0.24, s * 0.08]], 0.045, 12, 6), 'ghost', hdr(0x9fc0ea, 0.35), null, null, 1, R, { own: 'shadeRibbons' });
  // hollow, glowing eyes and a mouth
  for (const s of [-1, 1]) K.add(sph(0.026, 10, 8), 'glow', hdr(0xcfeaff, 4), [0.16, 0.58, s * 0.055], null, [0.5, 1.3, 1], R);
  K.add(sph(0.03, 10, 8), 'glow', hdr(0x9fd0ff, 2.5), [0.17, 0.44, 0], null, [0.4, 1.4, 1.2], R);
  return K.build();
}
export function shade() {
  const g = make('shade', buildShade);
  // each shade fades on its own: give it its own copies of the ghost materials (same shader program)
  const mats = [];
  g.traverse((o) => { if (o.isMesh && o.material === MATS.ghost) { o.material = MATS.ghost.clone(); mats.push(o.material); } });
  const outer = by(g, 'shadeOuter');
  return { group: g, mat: outer ? outer.material : mats[0], mats };
}

function buildEel() {
  const K = new Kit(), R = K.root;
  const head = K.group('head', R);
  K.add(lathe('eelhead', [[0, -0.0], [0.05, 0.03], [0.085, 0.12], [0.092, 0.24], [0.085, 0.32], [0.0, 0.33]], 18), 'gloss', 0xcfc0b6, [0.3, 0, 0], [0, 0, Math.PI / 2], [1, 1, 0.85], head);
  K.add(lathe('eeljaw', [[0, 0], [0.04, 0.03], [0.06, 0.12], [0.05, 0.22], [0, 0.23]], 14), 'gloss', 0xe2d4ca, [0.29, -0.035, 0], [0, 0, Math.PI / 2], [1, 0.8, 0.8], head);
  for (let k = 0; k < 7; k++) for (const s of [-1, 1]) K.add(cone(0.006, 0.03, 4), 'gloss', 0xf3eee4, [0.26 - k * 0.025, -0.02, s * (0.04 - k * 0.002)], [0, 0, Math.PI], 1, head);
  for (const s of [-1, 1]) {
    K.add(sph(0.016, 10, 8), 'gloss', 0xe8eef0, [0.2, 0.035, s * 0.06], null, 1, head);           // milky blind eyes
    K.add(plate('eelgill', [[0, 0], [0.04, 0.05], [0.0, 0.09], [-0.03, 0.04]], 0.004), 'skin', 0xd99c9a, [0.08, 0.0, s * 0.07], [0, s * 0.4, 0], 1, head);
    K.add(plate('pect', [[0, 0], [-0.05, 0.08], [-0.13, 0.07], [-0.1, 0.0]], 0.004), 'skin', 0xbfaea8, [0.05, -0.03, s * 0.07], [s * 1.2, 0, 0], 1, head);
  }
  // the glowing lure on a stalk
  K.add(tube('lure', [[0.2, 0.07, 0], [0.24, 0.17, 0], [0.32, 0.22, 0], [0.38, 0.19, 0]], 0.006, 12, 4), 'gloss', 0xc9b8ae, null, null, 1, head);
  K.add(sph(0.022, 10, 8), 'glow', hdr(0x7dffe0, 6), [0.385, 0.185, 0], null, 1, head);
  // body segments: each a child of the previous, trailing toward -x
  let parent = R, x0 = -0.01;
  for (let i = 0; i < 10; i++) {
    const seg = K.group('seg' + i, parent, i === 0 ? x0 : -0.2, 0, 0);
    const r0 = 0.085 * (1 - i * 0.075), r1 = 0.085 * (1 - (i + 1) * 0.075) + 0.004;
    K.add(cyl(r1, r0, 0.22, 14), 'gloss', 0xcbbcb1, [-0.1, 0, 0], [0, 0, Math.PI / 2], [1, 1, 0.85], seg);
    K.add(plate('dorsal' + i, [[0.02, 0], [-0.21, 0], [-0.17, r0 * 0.9], [-0.02, r0 * 1.05]], 0.003), 'skin', 0xd8c4bc, [0, r0 * 0.75, 0], null, 1, seg);
    K.add(plate('ventral' + i, [[0.02, 0], [-0.21, 0], [-0.17, -r0 * 0.7], [-0.02, -r0 * 0.8]], 0.003), 'skin', 0xd8c4bc, [0, -r0 * 0.7, 0], null, 1, seg);
    if (i % 2 === 0) for (const s of [-1, 1]) K.add(sph(0.01, 6, 4), 'glow', hdr(0x5fe8d0, 1.8), [-0.1, 0.0, s * r0 * 0.84], null, 1, seg);
    parent = seg;
  }
  return K.build();
}
export function eel() { const g = make('eel', buildEel); return { group: g, head: by(g, 'head'), segs: Array.from({ length: 10 }, (_, i) => by(g, 'seg' + i)) }; }

// ================================================================== CAVE PIECES AND PICKUPS
function buildStalactite(len) {
  const K = new Kit(), R = K.root;
  const r = rng(Math.round(len * 100) + 3);
  const pts = [];
  const N = 18;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // a drip-built cone: bulges where it grew fast, a thin straw near the tip
    const rad = (0.21 * Math.pow(1 - t, 1.5) + 0.018 * (1 - t) + 0.01) * (1 + Math.sin(t * 19 + r() * 2) * 0.07 * (1 - t) + (r() - 0.5) * 0.12 * (1 - t));
    pts.push([i === N ? 0 : rad, -t * len]);
  }
  pts.unshift([0.26, 0.06]); pts.unshift([0, 0.06]);
  const g = roughen('stal' + len, lathe('stal' + len, pts.reverse(), 16), 0.025, 6, len);
  K.add(g, 'gloss', 0x8c867c, [0, 0, 0], null, 1, R, { grime: 0.42, freq: 7 });
  // flowstone ridges running down the sides
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * Math.PI * 2 + r(), L = len * (0.4 + r() * 0.35);
    const p = (t) => { const rr = 0.21 * Math.pow(1 - t, 1.5) + 0.02; return [Math.cos(a) * rr * 1.02, -t * len, Math.sin(a) * rr * 1.02]; };
    K.add(tube('stalr' + len + k, [p(0.02), p(L / len * 0.5), p(L / len)], 0.016, 10, 5), 'gloss', k % 2 ? 0xb3a892 : 0x7a7368, null, null, 1, R, { grime: 0.3 });
  }
  K.add(sph(0.013, 8, 6), 'gloss', 0xdfe8ee, [0, -len - 0.006, 0], null, [1, 1.5, 1], R);   // a drip at the tip
  return K.build();
}
export function stalactite(len = 1.4) { const L = Math.round(len * 10) / 10; return make('stal' + L, () => buildStalactite(L)); }

export function nugget() {
  return make('nugget', () => {
    const K = new Kit();
    K.add(lump('nug', 0.075, 1, 0.32, 3.2, 4, 1.25, 0.75, 1), 'polish', C.gold, [0, 0.05, 0], null, 1, K.root, { grime: 0.25, freq: 25 });
    K.add(lump('nug2', 0.04, 1, 0.35, 4, 9), 'polish', 0xf0c25a, [0.06, 0.03, 0.03], null, 1, K.root, { grime: 0.2 });
    K.add(lump('nug3', 0.03, 1, 0.35, 4, 12), 'rough', 0x6b5f50, [-0.06, 0.025, -0.02], null, 1, K.root);   // a bit of quartz matrix
    return K.build();
  });
}
export function gem(hexColor = 0xe0103a) {
  return make('gem' + hexColor, () => {
    const K = new Kit();
    const g = geo('brilliant', () => flat(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.095, 0.085), new THREE.Vector2(0.1, 0.095), new THREE.Vector2(0.062, 0.135), new THREE.Vector2(0, 0.137)], 8)));
    const c = new THREE.Color(hexColor);
    K.add(g, 'gem', c.clone().multiplyScalar(1.15), [0, 0.0, 0], [0, Math.PI / 8, 0], 1, K.root, { grime: 0 });
    // a spark of colour inside that bloom picks up
    K.add(octa(0.03), 'glow', c.clone().multiplyScalar(2.2), [0, 0.1, 0], null, 1, K.root);
    return K.build();
  });
}
export function oilCan() {
  return make('oilcan', () => {
    const K = new Kit(), R = K.root;
    K.add(cyl(0.1, 0.11, 0.2, 18), 'metal', 0x7e847c, [0, 0.1, 0], null, 1, R, { grime: 0.35, freq: 9 });
    K.add(cyl(0.106, 0.112, 0.08, 18), 'rough', 0x8a2b1e, [0, 0.1, 0], null, 1, R, { grime: 0.3 });
    K.add(tor(0.105, 0.008, 18, 4), 'metal', 0x5a5f58, [0, 0.2, 0], [Math.PI / 2, 0, 0], 1, R);
    K.add(cone(0.1, 0.08, 18), 'metal', 0x7e847c, [0, 0.24, 0], null, 1, R, { grime: 0.3 });
    K.add(cyl(0.022, 0.026, 0.04, 10), 'metal', 0x5a5f58, [0, 0.29, 0], null, 1, R);
    K.add(tube('spout', [[0.02, 0.26, 0], [0.09, 0.3, 0], [0.16, 0.36, 0]], 0.009, 10, 6), 'metal', 0x6b7069, null, null, 1, R);
    K.add(tor(0.07, 0.009, 14, 5, Math.PI), 'metal', 0x4a4e48, [-0.02, 0.24, 0], [0, 0, 0.3], 1, R);
    K.add(cyl(0.111, 0.111, 0.01, 18), 'metal', 0x4f534d, [0, 0.005, 0], null, 1, R);
    return K.build();
  });
}
export function dynamite() {
  return make('dynamite', () => {
    const K = new Kit(), R = K.root;
    for (const [x, z] of [[-0.03, 0], [0.03, 0], [0, -0.045]]) {
      K.add(cyl(0.027, 0.027, 0.22, 12), 'rough', 0xa7281c, [x, 0, z], null, 1, R, { grime: 0.25 });
      K.add(cyl(0.0255, 0.0255, 0.225, 12), 'rough', 0xd8c7a0, [x, 0, z], null, 1, R);
    }
    for (const yy of [-0.06, 0.06]) K.add(tor(0.062, 0.006, 18, 4), 'rough', 0x6b5a3a, [0, yy, -0.015], [Math.PI / 2, 0, 0], [1, 0.82, 1], R);
    K.add(tube('dynfuse', [[0, 0.11, -0.015], [0.02, 0.15, 0], [0.06, 0.17, 0.0], [0.08, 0.15, 0.01]], 0.004, 12, 4), 'rough', 0x2a2620, null, null, 1, R);
    return K.build();
  });
}
export function dynamiteStick() {
  return make('dynstick', () => {
    const K = new Kit(), R = K.root;
    K.add(cyl(0.028, 0.028, 0.22, 12), 'rough', 0xa7281c, [0, 0, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.25 });
    K.add(cyl(0.026, 0.026, 0.226, 12), 'rough', 0xd8c7a0, [0, 0, 0], [0, 0, Math.PI / 2], 1, R);
    K.add(rbox(0.05, 0.059, 0.059, 0.01), 'rough', 0xc9b48a, [0, 0, 0], null, 1, R);   // paper label band
    K.add(tube('stickfuse', [[0.11, 0, 0], [0.14, 0.02, 0], [0.16, 0.05, 0.01]], 0.004, 8, 4), 'rough', 0x2a2620, null, null, 1, R);
    return K.build();
  });
}
export function flare() {
  const g = make('flare', () => {
    const K = new Kit(), R = K.root;
    K.add(cyl(0.022, 0.022, 0.26, 12), 'rough', 0xb3271d, [-0.02, 0, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.2 });
    K.add(cyl(0.024, 0.024, 0.04, 12), 'gloss', 0x2a2a2a, [-0.14, 0, 0], [0, 0, Math.PI / 2], 1, R);
    K.add(rbox(0.07, 0.05, 0.05, 0.01), 'rough', 0xe8d9a8, [-0.05, 0, 0], null, 1, R);
    K.add(cyl(0.02, 0.024, 0.04, 12), 'glow', hdr(0xff3a26, 9), [0.13, 0, 0], [0, 0, Math.PI / 2], 1, R, { own: 'tip' });
    return K.build();
  });
  return { group: g, tip: by(g, 'tip') };
}
export function canteen() {
  return make('canteen', () => {
    const K = new Kit(), R = K.root;
    const body = roughen('canteenBody', cyl(0.12, 0.12, 0.075, 24), 0.006, 6, 3);
    K.add(body, 'rough', 0x7a6d4c, [0, 0.14, 0], [Math.PI / 2, 0, 0], 1, R, { grime: 0.3 });
    K.add(tor(0.12, 0.012, 26, 6), 'metal', 0x8d8a80, [0, 0.14, 0], null, 1, R);
    K.add(cyl(0.022, 0.026, 0.04, 12), 'metal', 0x8d8a80, [0, 0.275, 0], null, 1, R);
    K.add(cyl(0.026, 0.026, 0.02, 12), 'rough', 0x3a2c1e, [0, 0.3, 0], null, 1, R);
    // red cross on the camera face
    K.add(rbox(0.13, 0.035, 0.012, 0.004), 'rough', 0xb3201c, [0, 0.14, 0.042], null, 1, R);
    K.add(rbox(0.035, 0.13, 0.012, 0.004), 'rough', 0xb3201c, [0, 0.14, 0.042], null, 1, R);
    K.add(tube('canstrap', [[-0.12, 0.2, 0], [-0.1, 0.32, 0], [0, 0.36, 0], [0.1, 0.32, 0], [0.12, 0.2, 0]], 0.01, 16, 4), 'gloss', C.leatherDk, null, null, [1, 1, 0.8], R);
    return K.build();
  });
}
export function key() {
  return make('key', () => {
    const K = new Kit(), R = K.root;
    K.add(tor(0.05, 0.012, 20, 6), 'metal', 0x5f5a54, [-0.1, 0.12, 0], null, 1, R);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; K.add(sph(0.017, 8, 6), 'metal', 0x6b655d, [-0.1 + Math.cos(a) * 0.06, 0.12 + Math.sin(a) * 0.06, 0], null, 1, R); }
    K.add(octa(0.018), 'glow', hdr(0xffb35a, 2.5), [-0.1, 0.12, 0], null, 1, R);
    K.add(cyl(0.012, 0.012, 0.22, 10), 'metal', 0x5f5a54, [0.03, 0.12, 0], [0, 0, Math.PI / 2], 1, R);
    K.add(tor(0.014, 0.005, 10, 4), 'metal', 0x4a4540, [-0.04, 0.12, 0], [0, Math.PI / 2, 0], 1, R);
    K.add(rbox(0.03, 0.05, 0.012, 0.004), 'metal', 0x5f5a54, [0.115, 0.095, 0], null, 1, R);
    K.add(rbox(0.018, 0.035, 0.012, 0.004), 'metal', 0x5f5a54, [0.085, 0.1, 0], null, 1, R);
    return K.build();
  });
}
export function chest() {
  const g = make('chest', () => {
    const K = new Kit(), R = K.root;
    // planks of the box (front faces the camera)
    for (let k = 0; k < 4; k++) K.add(rbox(0.88, 0.09, 0.025, 0.006), 'rough', k % 2 ? C.wood : C.wood2, [0, 0.05 + k * 0.095, 0.29], null, 1, R, { grime: 0.3, freq: 14 });
    for (let k = 0; k < 4; k++) K.add(rbox(0.88, 0.09, 0.025, 0.006), 'rough', k % 2 ? C.woodDk : C.wood, [0, 0.05 + k * 0.095, -0.29], null, 1, R, { grime: 0.3, freq: 14 });
    for (const s of [-1, 1]) K.add(rbox(0.025, 0.38, 0.6, 0.006), 'rough', C.wood, [s * 0.44, 0.19, 0], null, 1, R, { grime: 0.3 });
    K.add(box(0.86, 0.02, 0.56), 'rough', C.woodDk, [0, 0.01, 0], null, 1, R);
    // iron bands, corner caps, rivets, the lock plate
    for (const x of [-0.3, 0.3]) K.add(rbox(0.05, 0.4, 0.62, 0.006), 'metal', C.iron, [x, 0.19, 0], null, [1, 1, 1], R, { grime: 0.35 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.add(rbox(0.07, 0.4, 0.07, 0.008), 'metal', C.ironDk, [sx * 0.43, 0.19, sz * 0.29], null, 1, R);
    for (const x of [-0.3, 0.3]) for (let k = 0; k < 4; k++) K.add(sph(0.01, 6, 4), 'metal', 0x6a655e, [x, 0.06 + k * 0.1, 0.312], null, 1, R);
    K.add(rbox(0.12, 0.13, 0.02, 0.01), 'polish', C.brass, [0, 0.3, 0.31], null, 1, R);
    K.add(box(0.015, 0.04, 0.01), 'metal', 0x111111, [0, 0.29, 0.322], null, 1, R, { grime: 0 });
    // gold inside
    for (let k = 0; k < 9; k++) { const r = rng(k + 40); K.add(lump('cg' + (k % 3), 0.06 + (k % 3) * 0.01, 1, 0.3, 3, k % 3), 'polish', C.gold, [-0.3 + (k % 5) * 0.15, 0.36 + r() * 0.03, -0.15 + Math.floor(k / 5) * 0.2], null, [1.3, 0.7, 1], R, { grime: 0.2 }); }
    K.add(octa(0.04), 'glow', hdr(0xffc860, 2), [0.05, 0.4, 0], null, 1, R);
    // the lid: domed planks + bands, pivot at the top-back edge
    const lid = K.group('lid', R, 0, 0.38, -0.3);
    const dome = geo('chestlid', () => { const g0 = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 20, 1, false, 0, Math.PI); g0.rotateZ(Math.PI / 2); g0.computeVertexNormals(); return g0; });
    K.add(dome, 'rough', C.wood, [0, 0, 0.3], [0, 0, 0], [1, 0.62, 1], lid, { grime: 0.35, freq: 12 });
    K.add(box(0.9, 0.025, 0.6), 'rough', C.woodDk, [0, 0.005, 0.3], null, 1, lid);
    for (const x of [-0.43, -0.3, 0.3, 0.43]) K.add(geo('chestband', () => { const g0 = new THREE.CylinderGeometry(0.308, 0.308, 0.05, 20, 1, true, 0, Math.PI); g0.rotateZ(Math.PI / 2); return g0; }), 'metal', C.iron, [x, 0, 0.3], null, [1, 0.62, 1], lid);
    K.add(rbox(0.08, 0.08, 0.02, 0.008), 'polish', C.brass, [0, 0.0, 0.6], null, 1, lid);
    return K.build();
  });
  return { group: g, lid: by(g, 'lid') };
}

// ------------------------------------------------------------------ relics
function buildRelic(id) {
  const K = new Kit(), R = K.root;
  const pr = rng(Math.floor(hash3(id, 7, 3) * 4e9) + id);
  const glowC = (c, k = 4) => hdr(c, k);
  switch (id) {
    case 0: { // the surveyor's compass
      K.add(cyl(0.13, 0.13, 0.04, 28), 'polish', C.brass, [0, 0.14, 0], [Math.PI / 2, 0, 0], 1, R);
      K.add(tor(0.13, 0.01, 28, 6), 'polish', 0xd2a755, [0, 0.14, 0.02], null, 1, R);
      K.add(cyl(0.118, 0.118, 0.005, 28), 'rough', 0xe8dcc0, [0, 0.14, 0.021], [Math.PI / 2, 0, 0], 1, R);
      for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; K.add(box(0.004, k % 4 ? 0.012 : 0.025, 0.002), 'rough', 0x2a2420, [Math.cos(a) * 0.1, 0.14 + Math.sin(a) * 0.1, 0.025], [0, 0, a - Math.PI / 2], 1, R, { grime: 0 }); }
      K.add(plate('needle', [[0, 0.09], [0.012, 0], [0, -0.09], [-0.012, 0]], 0.004), 'glow', glowC(0xff5030, 3.5), [0, 0.14, 0.028], [0, 0, -0.5], 1, R);
      K.add(tor(0.02, 0.006, 10, 4), 'polish', C.brass, [0, 0.285, 0], null, 1, R);
      K.add(cyl(0.13, 0.13, 0.015, 28), 'polish', 0xa8803a, [0.0, 0.14, -0.06], [Math.PI / 2 - 0.5, 0, 0], 1, R);   // open lid
      K.add(rbox(0.12, 0.02, 0.06, 0.008), 'rough', C.stone, [0, 0.01, 0], null, 1, R);
      break;
    }
    case 1: { // a miner's tin lantern with a fresh flame
      K.add(cyl(0.08, 0.09, 0.03, 16), 'metal', 0x8a8a80, [0, 0.015, 0], null, 1, R);
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; K.rod('metal', 0x6e6e66, [Math.cos(a) * 0.075, 0.03, Math.sin(a) * 0.075], [Math.cos(a) * 0.07, 0.25, Math.sin(a) * 0.07], 0.005, R, 5); }
      K.add(lathe('lglass', [[0.055, 0.03], [0.07, 0.1], [0.072, 0.18], [0.06, 0.25]], 16), 'crystal', 0xfff0d0, [0, 0, 0], null, 1, R);
      K.add(sph(0.025, 10, 8), 'glow', glowC(0xffb048, 7), [0, 0.13, 0], null, [0.7, 1.4, 0.7], R);
      K.add(cone(0.085, 0.07, 16), 'metal', 0x8a8a80, [0, 0.29, 0], null, 1, R);
      K.add(tor(0.04, 0.006, 14, 4, Math.PI), 'metal', 0x6e6e66, [0, 0.33, 0], null, 1, R);
      break;
    }
    case 2: { // the copper crown
      K.add(cyl(0.12, 0.11, 0.08, 24, true), 'polish', 0xc77a42, [0, 0.05, 0], null, 1, R);
      K.add(tor(0.115, 0.012, 24, 6), 'polish', 0xd88d50, [0, 0.01, 0], [Math.PI / 2, 0, 0], 1, R);
      for (let k = 0; k < 7; k++) {
        const a = k / 7 * Math.PI * 2;
        K.add(cone(0.025, 0.12, 6), 'polish', 0xc77a42, [Math.cos(a) * 0.118, 0.14, Math.sin(a) * 0.118], null, 1, R);
        K.add(octa(0.016), 'glow', glowC([0x30ff90, 0xff4060, 0x40a0ff][k % 3], 3), [Math.cos(a) * 0.123, 0.055, Math.sin(a) * 0.123], null, 1, R);
      }
      break;
    }
    case 3: { // the glowing seed on its roots
      K.add(lathe('seed', [[0, 0], [0.07, 0.04], [0.09, 0.12], [0.07, 0.22], [0.02, 0.28], [0, 0.3]], 18), 'gloss', 0x5a4a2a, [0, 0.06, 0], null, 1, R);
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; K.add(tube('seedv' + k, [[Math.cos(a) * 0.07, 0.1, Math.sin(a) * 0.07], [Math.cos(a + 0.3) * 0.092, 0.18, Math.sin(a + 0.3) * 0.092], [Math.cos(a + 0.5) * 0.06, 0.29, Math.sin(a + 0.5) * 0.06]], 0.007, 10, 4), 'glow', glowC(0x9dff5a, 4), null, null, 1, R); }
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; K.add(tube('seedr' + k, [[0, 0.07, 0], [Math.cos(a) * 0.08, 0.03, Math.sin(a) * 0.08], [Math.cos(a) * 0.15, 0.0, Math.sin(a) * 0.15]], 0.012, 8, 5), 'rough', 0x4a3a28, null, null, 1, R); }
      break;
    }
    case 4: { // a root-woven mask
      K.add(roughen('mask', hemi(0.17, 20, 10), 0.01, 8, 4), 'rough', 0x6b5236, [0, 0.2, 0], [0, -Math.PI / 2, -Math.PI / 2], [1, 1.25, 0.55], R, { grime: 0.4, freq: 30 });
      for (let k = 0; k < 8; k++) K.add(tor(0.13 + k * 0.006, 0.006, 20, 4, Math.PI * 0.8), 'rough', 0x4a3824, [0.02, 0.2 - 0.12 + k * 0.03, 0], [0, Math.PI / 2, Math.PI * 0.6], [1, 0.6, 1], R);
      for (const s of [-1, 1]) K.add(sph(0.025, 10, 8), 'glow', glowC(0x7affd0, 5), [0.07, 0.25, s * 0.055], null, [0.4, 0.8, 1.2], R);
      K.add(rbox(0.05, 0.03, 0.1, 0.01), 'glow', glowC(0x7affd0, 2.5), [0.075, 0.13, 0], null, 1, R);
      break;
    }
    case 5: { // the spore lantern: a jar of light
      K.add(lathe('jar', [[0, 0], [0.09, 0.01], [0.1, 0.05], [0.1, 0.24], [0.07, 0.28], [0.06, 0.3]], 20), 'crystal', 0xd8ffe8, [0, 0, 0], null, 1, R);
      for (let k = 0; k < 14; k++) K.add(sph(0.012 + pr() * 0.01, 6, 4), 'glow', glowC(k % 2 ? 0x6affc8 : 0xc8ff6a, 5), [(pr() - 0.5) * 0.12, 0.06 + pr() * 0.18, (pr() - 0.5) * 0.12], null, 1, R);
      K.add(cyl(0.07, 0.07, 0.04, 16), 'rough', 0x5a4632, [0, 0.31, 0], null, 1, R);
      K.add(tor(0.07, 0.008, 16, 4), 'rough', C.hemp, [0, 0.3, 0], [Math.PI / 2, 0, 0], 1, R);
      break;
    }
    case 6: { // the heart geode: split open
      K.add(roughen('geodeShell', hemi(0.2, 20, 10), 0.03, 4, 6), 'skin', 0x7a6f62, [0, 0, 0], [-Math.PI / 2, 0, 0], [1, 1, 0.8], R, { grime: 0.35 });
      for (let k = 0; k < 16; k++) { const a = pr() * Math.PI * 2, rr = pr() * 0.13; K.add(prism(0.018 + pr() * 0.012, 0.06 + pr() * 0.05), 'crystal', 0xc78aff, [Math.cos(a) * rr, Math.sin(a) * rr, -0.02], [Math.PI / 2 + (pr() - 0.5) * 0.6, 0, (pr() - 0.5) * 0.6], 1, R); }
      K.add(sph(0.06, 12, 8), 'glow', glowC(0xb070ff, 4), [0, 0, -0.06], null, [1.5, 1.5, 0.4], R);
      R.children.length; // keep
      // stand it up: the opening faces the camera
      const g = K.build(); g.rotation.x = -0.1; g.position.y = 0.2; const outer = new THREE.Group(); outer.add(g); return outer;
    }
    case 7: { // the prism key
      K.add(prism(0.022, 0.32, 0.12), 'crystal', 0xd0e8ff, [0, 0.02, 0], null, 1, R);
      K.add(prism(0.01, 0.3, 0.12), 'glow', glowC(0x8fd8ff, 3), [0, 0.03, 0], null, 1, R);
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; K.add(prism(0.016, 0.08, 0.4), 'crystal', 0xd0e8ff, [Math.cos(a) * 0.04, 0.33 + Math.sin(a) * 0.04, 0], [0, 0, a - Math.PI / 2], 1, R); }
      K.add(octa(0.03), 'glow', glowC(0xbfeaff, 5), [0, 0.33, 0], null, 1, R);
      K.add(rbox(0.06, 0.02, 0.02, 0.005), 'crystal', 0xd0e8ff, [0.03, 0.06, 0], null, 1, R);
      K.add(rbox(0.04, 0.02, 0.02, 0.005), 'crystal', 0xd0e8ff, [0.025, 0.1, 0], null, 1, R);
      break;
    }
    case 8: { // a crystal skull
      K.add(sph(0.12, 20, 14), 'crystal', 0xe0f0ff, [0, 0.17, 0], null, [1.1, 1, 0.95], R);
      K.add(rbox(0.12, 0.08, 0.13, 0.03), 'crystal', 0xe0f0ff, [0.06, 0.07, 0], null, 1, R);
      for (const s of [-1, 1]) K.add(sph(0.032, 10, 8), 'glow', glowC(0xa8e0ff, 5), [0.1, 0.17, s * 0.045], null, [0.6, 1, 1], R);
      K.add(sph(0.05, 12, 8), 'glow', glowC(0x6fb8ff, 2), [0, 0.18, 0], null, 1, R);
      for (let k = 0; k < 5; k++) K.add(box(0.012, 0.02, 0.012), 'crystal', 0xffffff, [0.12, 0.05, -0.04 + k * 0.02], null, 1, R);
      break;
    }
    case 9: { // the sunken bell
      K.add(lathe('bell', [[0.0, 0.33], [0.05, 0.33], [0.075, 0.3], [0.085, 0.2], [0.11, 0.09], [0.15, 0.03], [0.16, 0.0], [0.145, 0.005]], 24), 'metal', 0x6f6a3a, [0, 0, 0], null, 1, R, { grime: 0.45, freq: 10 });
      for (let k = 0; k < 10; k++) { const a = pr() * Math.PI * 2, y = 0.05 + pr() * 0.2; K.add(lump('barn' + (k % 3), 0.02, 0, 0.3, 3, k), 'rough', 0xbfb6a0, [Math.cos(a) * (0.16 - y * 0.25), y, Math.sin(a) * (0.16 - y * 0.25)], null, 1, R); }
      for (let k = 0; k < 6; k++) { const a = pr() * Math.PI * 2, y = 0.08 + pr() * 0.2; K.add(sph(0.012, 6, 4), 'glow', glowC(0x40ffd8, 3), [Math.cos(a) * (0.17 - y * 0.25), y, Math.sin(a) * (0.17 - y * 0.25)], null, 1, R); }
      K.add(sph(0.03, 10, 8), 'metal', 0x5a5530, [0.03, 0.03, 0], null, 1, R);
      K.add(tor(0.035, 0.012, 12, 5), 'metal', 0x5a5530, [0, 0.35, 0], null, 1, R);
      break;
    }
    case 10: { // the tide tablet
      K.add(roughen('tablet', rbox(0.3, 0.42, 0.06, 0.03), 0.006, 9, 2), 'rough', 0x5f6a66, [0, 0.21, 0], null, 1, R, { grime: 0.35 });
      for (let k = 0; k < 6; k++) for (let j = 0; j < 4; j++) if (pr() < 0.8) K.add(box(0.04 + pr() * 0.03, 0.008, 0.005), 'glow', glowC(0x38f0ff, 2.4), [-0.09 + j * 0.06, 0.36 - k * 0.055, 0.032], [0, 0, (pr() - 0.5) * 0.6], 1, R);
      K.add(tor(0.05, 0.006, 20, 4), 'glow', glowC(0x38f0ff, 2.4), [0, 0.07, 0.032], null, 1, R);
      break;
    }
    case 11: { // the drowned king's ring
      K.add(tor(0.11, 0.028, 32, 10), 'polish', C.gold, [0, 0.14, 0], null, 1, R);
      K.add(rbox(0.07, 0.04, 0.06, 0.015), 'polish', 0xd8a440, [0, 0.27, 0], null, 1, R);
      K.add(geo('ringgem', () => flat(new THREE.IcosahedronGeometry(0.035, 0))), 'gem', 0x2050ff, [0, 0.305, 0], null, [1, 0.8, 1], R);
      K.add(octa(0.02), 'glow', glowC(0x4080ff, 4), [0, 0.305, 0], null, 1, R);
      K.add(rbox(0.12, 0.03, 0.05, 0.01), 'rough', 0x4a4a42, [0, 0.015, 0], null, 1, R);
      break;
    }
    case 12: { // the ember egg
      K.add(lathe('egg', [[0, 0], [0.08, 0.03], [0.11, 0.12], [0.1, 0.22], [0.06, 0.3], [0, 0.32]], 22), 'gloss', C.obsid, [0, 0, 0], null, 1, R, { grime: 0.2 });
      for (let k = 0; k < 7; k++) { const a = pr() * Math.PI * 2; K.add(tube('eggc' + k, [[Math.cos(a) * 0.09, 0.05, Math.sin(a) * 0.09], [Math.cos(a + 0.3) * 0.112, 0.13, Math.sin(a + 0.3) * 0.112], [Math.cos(a + 0.1) * 0.1, 0.21, Math.sin(a + 0.1) * 0.1], [Math.cos(a + 0.4) * 0.06, 0.29, Math.sin(a + 0.4) * 0.06]], 0.006, 10, 4), 'glow', glowC(0xff6a18, 5), null, null, 1, R); }
      break;
    }
    case 13: { // the obsidian mirror
      K.add(cyl(0.15, 0.15, 0.02, 32), 'gloss', 0x07060a, [0, 0.24, 0], [Math.PI / 2, 0, 0], [1, 1.25, 1], R, { grime: 0 });
      K.add(tor(0.155, 0.018, 32, 8), 'polish', C.gold, [0, 0.24, 0], null, [1, 1.25, 1], R);
      K.add(tor(0.15, 0.004, 32, 4), 'glow', glowC(0xc080ff, 3), [0, 0.24, 0.012], null, [1, 1.25, 1], R);
      K.add(cyl(0.015, 0.02, 0.06, 10), 'polish', C.gold, [0, 0.03, 0], null, 1, R);
      K.add(cyl(0.06, 0.07, 0.02, 16), 'polish', C.gold, [0, 0.01, 0], null, 1, R);
      break;
    }
    case 14: { // the mountain's heartstone
      K.add(dode(0.13), 'gem', 0xff3a1e, [0, 0.21, 0], [0.3, 0.4, 0], 1, R);
      K.add(dode(0.07), 'glow', glowC(0xff8a3a, 5), [0, 0.21, 0], null, 1, R);
      for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2; K.add(tube('claw' + k, [[Math.cos(a) * 0.06, 0.02, Math.sin(a) * 0.06], [Math.cos(a) * 0.12, 0.1, Math.sin(a) * 0.12], [Math.cos(a) * 0.11, 0.2, Math.sin(a) * 0.11], [Math.cos(a) * 0.07, 0.26, Math.sin(a) * 0.07]], 0.012, 10, 5), 'polish', C.gold, null, null, 1, R); }
      K.add(cyl(0.08, 0.09, 0.03, 16), 'polish', 0xc8962e, [0, 0.015, 0], null, 1, R);
      break;
    }
    default: { // endless strata: a seeded combination of a body, trim and a glowing heart
      const palettes = [[0xb58a3c, 0x40ffd0], [0x8a8f96, 0xff5a30], [0x3a2a4a, 0xc080ff], [0x6a4a2a, 0x9dff5a], [0xd8d0c0, 0x5ab0ff], [0x1a1a1e, 0xff9a30]];
      const [base, glowCol] = palettes[Math.floor(pr() * palettes.length)];
      const mat = pr() < 0.5 ? 'polish' : 'gloss';
      const kind = Math.floor(pr() * 4);
      if (kind === 0) { // idol
        K.add(lathe('idolb' + id, [[0, 0], [0.09, 0.0], [0.08, 0.06], [0.05, 0.1], [0.07, 0.2], [0.05, 0.27], [0, 0.29]], 14), mat, base, [0, 0, 0], null, 1, R);
        K.add(sph(0.05, 12, 8), mat, base, [0, 0.33, 0], null, 1, R);
        for (const s of [-1, 1]) K.add(sph(0.012, 6, 4), 'glow', glowC(glowCol, 5), [0.04, 0.34, s * 0.02], null, 1, R);
      } else if (kind === 1) { // chalice
        K.add(lathe('chal' + id, [[0, 0], [0.08, 0], [0.07, 0.02], [0.02, 0.05], [0.015, 0.15], [0.03, 0.18], [0.09, 0.24], [0.1, 0.3], [0.09, 0.3]], 18), mat, base, [0, 0, 0], null, 1, R);
        K.add(cyl(0.085, 0.085, 0.01, 18), 'glow', glowC(glowCol, 3), [0, 0.28, 0], null, 1, R);
      } else if (kind === 2) { // orb on a stand
        K.add(lathe('orbs' + id, [[0, 0], [0.08, 0], [0.06, 0.04], [0.03, 0.1], [0.06, 0.14], [0.05, 0.15]], 14), mat, base, [0, 0, 0], null, 1, R);
        K.add(sph(0.09, 18, 12), 'crystal', 0xffffff, [0, 0.23, 0], null, 1, R);
        K.add(sph(0.05, 12, 8), 'glow', glowC(glowCol, 4), [0, 0.23, 0], null, 1, R);
      } else { // a spindle of rings
        K.add(cyl(0.012, 0.012, 0.4, 8), mat, base, [0, 0.2, 0], null, 1, R);
        for (let k = 0; k < 4; k++) K.add(tor(0.05 + k * 0.025, 0.008, 22, 5), mat, base, [0, 0.12 + k * 0.06, 0], [Math.PI / 2 + (pr() - 0.5) * 0.8, pr(), 0], 1, R);
        K.add(octa(0.035), 'glow', glowC(glowCol, 4), [0, 0.42, 0], null, 1, R);
      }
    }
  }
  return K.build();
}
export function relic(id = 0) { return make('relic' + id, () => buildRelic(id)); }
export function pedestal() {
  return make('pedestal', () => {
    const K = new Kit(), R = K.root;
    K.add(roughen('pedb', rbox(0.7, 0.14, 0.7, 0.03), 0.008, 6, 1), 'rough', C.stone, [0, 0.07, 0], null, 1, R, { grime: 0.35 });
    K.add(rbox(0.56, 0.08, 0.56, 0.02), 'rough', 0x766e60, [0, 0.18, 0], null, 1, R);
    K.add(roughen('pedshaft', cyl(0.2, 0.22, 0.6, 8), 0.01, 5, 2), 'rough', C.stone, [0, 0.52, 0], null, 1, R, { grime: 0.4 });
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + Math.PI / 8; K.add(box(0.03, 0.5, 0.03), 'rough', 0x6b6356, [Math.cos(a) * 0.205, 0.52, Math.sin(a) * 0.205], null, 1, R); }
    K.add(rbox(0.52, 0.08, 0.52, 0.02), 'rough', 0x766e60, [0, 0.86, 0], null, 1, R);
    K.add(roughen('pedtop', rbox(0.62, 0.1, 0.62, 0.03), 0.006, 6, 3), 'rough', C.stone, [0, 0.95, 0], null, 1, R, { grime: 0.3 });
    K.add(tor(0.21, 0.012, 24, 5), 'glow', hdr(0xffc070, 1.4), [0, 0.7, 0], [Math.PI / 2, 0, 0], [1, 1, 1], R);
    return K.build();
  });
}
export function note() {
  return make('note', () => {
    const K = new Kit(), R = K.root;
    K.add(plate('notep', [[-0.13, -0.09], [0.13, -0.09], [0.12, 0.08], [-0.12, 0.09]], 0.004), 'skin', C.paper, [0, 0.01, 0], [-Math.PI / 2 + 0.05, 0, 0.1], 1, R, { grime: 0.3, freq: 18 });
    K.add(plate('notep2', [[-0.12, 0], [0.12, 0], [0.11, 0.08], [-0.11, 0.08]], 0.004), 'skin', 0xcbbd98, [0.0, 0.015, -0.085], [-0.5, 0, 0.1], 1, R, { grime: 0.3, freq: 18 });
    for (let k = 0; k < 5; k++) K.add(box(0.16 - (k % 2) * 0.04, 0.003, 0.006), 'rough', 0x2a2a3a, [-0.01, 0.017, -0.05 + k * 0.025], [0, 0.1, 0], 1, R, { grime: 0 });
    K.add(lump('noterock', 0.07, 1, 0.3, 3, 5, 1.2, 0.7, 1), 'rough', C.rock, [0.08, 0.04, 0.03], null, 1, R);
    return K.build();
  });
}
export function fossilSlab() {
  return make('fossil', () => {
    const K = new Kit(), R = K.root;
    // a 1 x 1 m face centred on the origin, front at about z = +0.06, relief to z ~ +0.1
    K.add(roughen('fslab', rbox(1.0, 1.0, 0.12, 0.05), 0.025, 3, 7), 'rough', 0x7d7262, [0, 0, 0], null, 1, R, { grime: 0.4, freq: 4 });
    // ammonite spiral
    const spiral = []; for (let k = 0; k <= 60; k++) { const a = k * 0.21, r = 0.012 + k * 0.0042; spiral.push([Math.cos(a) * r - 0.12, Math.sin(a) * r + 0.12, 0.065]); }
    K.add(tube('ammo', spiral, 0.02, 90, 6), 'gloss', C.bone, null, null, 1, R, { grime: 0.3, freq: 20 });
    for (let k = 0; k < 18; k++) { const a = k * 0.6, r = 0.04 + k * 0.012; K.add(box(0.006, 0.03, 0.01), 'rough', 0x9d8f72, [Math.cos(a) * r - 0.12, Math.sin(a) * r + 0.12, 0.08], [0, 0, a], 1, R); }
    // a spine and ribs of something long gone
    const spine = [[0.05, -0.32, 0.06], [0.15, -0.2, 0.065], [0.22, -0.05, 0.065], [0.3, 0.1, 0.06], [0.36, 0.28, 0.055]];
    K.add(tube('spine', spine, 0.014, 20, 5), 'gloss', C.bone, null, null, 1, R, { grime: 0.3 });
    for (let k = 0; k < 7; k++) { const t = k / 7, x = 0.07 + t * 0.27, y = -0.28 + t * 0.52; K.add(cap(0.007, 0.13, 5), 'gloss', 0xc2b28e, [x - 0.06, y + 0.02, 0.06], [0, 0, 0.9], 1, R); K.add(cap(0.007, 0.11, 5), 'gloss', 0xc2b28e, [x + 0.06, y - 0.02, 0.06], [0, 0, 0.9], 1, R); }
    K.add(lump('fskull', 0.07, 1, 0.2, 4, 3, 1.4, 0.8, 0.5), 'gloss', C.bone, [0.4, 0.36, 0.06], null, 1, R);
    return K.build();
  });
}
export function keg() {
  return make('keg', () => {
    const K = new Kit(), R = K.root;
    const staves = geo('kegbody', () => {
      const g = new THREE.LatheGeometry([[0.25, 0], [0.29, 0.12], [0.31, 0.37], [0.29, 0.62], [0.25, 0.74]].map(([r, y]) => new THREE.Vector2(r, y)), 24, 0, Math.PI * 2);
      g.computeVertexNormals();
      return g;
    });
    K.add(staves, 'rough', 0x6d4b2a, [0, 0, 0], null, 1, R, { grime: 0.4, freq: 22 });
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; K.add(box(0.006, 0.7, 0.006), 'rough', 0x2c1e12, [Math.cos(a) * 0.3, 0.37, Math.sin(a) * 0.3], [0, -a, 0], [1, 1, 1], R, { grime: 0 }); }
    for (const [y, r] of [[0.05, 0.265], [0.2, 0.3], [0.54, 0.3], [0.69, 0.265]]) K.add(tor(r, 0.012, 28, 5), 'metal', C.ironDk, [0, y, 0], [Math.PI / 2, 0, 0], 1, R);
    K.add(cyl(0.302, 0.302, 0.12, 28, true), 'rough', 0x9a1e14, [0, 0.37, 0], null, 1, R, { grime: 0.3 });
    K.add(cyl(0.25, 0.25, 0.02, 24), 'rough', 0x5a3e22, [0, 0.74, 0], null, 1, R);
    K.add(tube('kegfuse', [[0.05, 0.75, 0], [0.12, 0.8, 0.05], [0.05, 0.84, 0.1], [-0.05, 0.82, 0.05], [-0.02, 0.86, -0.05], [0.06, 0.9, -0.02]], 0.007, 24, 4), 'rough', 0x2a2620, null, null, 1, R);
    // a painted warning star on the camera side
    K.add(plate('star', Array.from({ length: 10 }, (_, k) => { const a = k / 10 * Math.PI * 2 + Math.PI / 2, r = k % 2 ? 0.035 : 0.08; return [Math.cos(a) * r, Math.sin(a) * r]; }), 0.004), 'rough', 0xe8d8b0, [0, 0.37, 0.305], null, 1, R);
    return K.build();
  });
}
export function flareCrate() {
  return make('flarecrate', () => {
    const K = new Kit(), R = K.root;
    for (let k = 0; k < 4; k++) K.add(rbox(0.6, 0.085, 0.02, 0.005), 'rough', k % 2 ? C.wood2 : C.wood, [0, 0.05 + k * 0.095, 0.2], null, 1, R, { grime: 0.35, freq: 14 });
    for (let k = 0; k < 4; k++) K.add(rbox(0.6, 0.085, 0.02, 0.005), 'rough', C.woodDk, [0, 0.05 + k * 0.095, -0.2], null, 1, R, { grime: 0.35 });
    for (const s of [-1, 1]) K.add(rbox(0.02, 0.38, 0.42, 0.005), 'rough', C.wood, [s * 0.3, 0.19, 0], null, 1, R);
    for (const s of [-1, 1]) K.add(rbox(0.04, 0.4, 0.03, 0.006), 'rough', C.woodDk, [s * 0.25, 0.2, 0.215], null, 1, R);
    K.add(box(0.58, 0.02, 0.38), 'rough', C.woodDk, [0, 0.01, 0], null, 1, R);
    K.add(rbox(0.3, 0.06, 0.006, 0.003), 'rough', 0xb3271d, [0, 0.24, 0.212], null, 1, R);
    const r = rng(77);
    for (let k = 0; k < 7; k++) {
      const x = -0.2 + (k % 4) * 0.13 + (k > 3 ? 0.06 : 0), z = k > 3 ? 0.07 : -0.07, tilt = (r() - 0.5) * 0.3;
      K.add(cyl(0.022, 0.022, 0.3, 10), 'rough', 0xb3271d, [x, 0.36, z], [tilt, 0, tilt], 1, R, { grime: 0.2 });
      K.add(cyl(0.024, 0.024, 0.04, 10), 'gloss', 0x2a2a2a, [x + tilt * 0.15, 0.5, z - tilt * 0.15], [tilt, 0, tilt], 1, R);
    }
    return K.build();
  });
}
export function campfire() {
  const g = make('campfire', () => {
    const K = new Kit(), R = K.root;
    const r = rng(12);
    for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2; K.add(lump('cfs' + (k % 4), 0.1, 1, 0.3, 3, k % 4, 1.2, 0.75, 1), 'rough', k % 3 ? C.rock : 0x5a524a, [Math.cos(a) * 0.42, 0.06, Math.sin(a) * 0.42], [0, a, 0], 1, R); }
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.3; K.add(cyl(0.045, 0.05, 0.6, 8), 'rough', 0x3a2818, [Math.cos(a) * 0.08, 0.12, Math.sin(a) * 0.08], [Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9], 1, R, { grime: 0.5, freq: 20 }); }
    for (let k = 0; k < 7; k++) K.add(lump('ember' + (k % 3), 0.03, 0, 0.3, 4, k), 'glow', hdr(0xff5a14, 2 + r() * 2), [(r() - 0.5) * 0.25, 0.03, (r() - 0.5) * 0.25], null, 1, R);
    K.add(sph(0.2, 12, 6), 'rough', 0x161210, [0, 0.0, 0], null, [1, 0.12, 1], R);  // ash bed
    // tripod and pot
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2; K.rod('rough', 0x4a3420, [Math.cos(a) * 0.45, 0, Math.sin(a) * 0.45], [0, 0.95, 0], 0.016, R, 6); }
    K.rod('metal', C.ironDk, [0, 0.95, 0], [0, 0.62, 0], 0.004, R, 4);
    K.add(lathe('pot', [[0, 0], [0.09, 0.01], [0.12, 0.07], [0.12, 0.15], [0.11, 0.17], [0.115, 0.18]], 16), 'metal', 0x1e1d1c, [0, 0.43, 0], null, 1, R, { grime: 0.3 });
    K.add(tor(0.11, 0.004, 14, 4, Math.PI), 'metal', C.ironDk, [0, 0.61, 0], [0, 0, 0], 1, R);
    // bedroll and a log seat
    K.add(cyl(0.13, 0.13, 0.9, 14), 'rough', 0x6a3326, [1.0, 0.13, 0.1], [Math.PI / 2, 0, 0], 1, R, { grime: 0.3 });
    K.add(cyl(0.135, 0.135, 0.03, 14), 'rough', 0x3a2418, [1.0, 0.13, 0.35], [Math.PI / 2, 0, 0], 1, R);
    K.add(cyl(0.135, 0.135, 0.03, 14), 'rough', 0x3a2418, [1.0, 0.13, -0.15], [Math.PI / 2, 0, 0], 1, R);
    K.add(roughen('logseat', cyl(0.16, 0.18, 0.8, 12), 0.015, 6, 2), 'rough', 0x4e3a26, [-1.0, 0.17, 0], [Math.PI / 2, 0, 0.1], 1, R, { grime: 0.4, freq: 18 });
    K.add(cyl(0.15, 0.15, 0.01, 12), 'rough', 0x8a6a46, [-1.0, 0.17, 0.4], [Math.PI / 2, 0, 0], 1, R);
    const a = new THREE.Object3D(); a.name = 'fireAnchor'; a.position.set(0, 0.25, 0); R.add(a);
    return K.build();
  });
  return { group: g, fireAnchor: by(g, 'fireAnchor') };
}
export function cage() {
  return make('cage', () => {
    const K = new Kit(), R = K.root;
    const W = 2.0, H = 2.5, D = 1.6;
    // floor plate with tread
    K.add(rbox(W, 0.06, D, 0.01), 'metal', 0x4d4a45, [0, 0.03, 0], null, 1, R, { grime: 0.4 });
    for (let k = 0; k < 12; k++) K.add(box(W - 0.1, 0.012, 0.025), 'metal', 0x6a6660, [0, 0.066, -D / 2 + 0.08 + k * 0.13], null, 1, R);
    // corner posts, rails, roof
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.add(rbox(0.07, H, 0.07, 0.01), 'metal', C.ironDk, [sx * (W / 2 - 0.035), H / 2, sz * (D / 2 - 0.035)], null, 1, R);
    for (const y of [0.08, 1.1, H - 0.04]) {
      for (const sz of [-1, 1]) K.add(rbox(W, 0.06, 0.05, 0.01), 'metal', C.ironDk, [0, y, sz * (D / 2 - 0.035)], null, 1, R);
      for (const sx of [-1, 1]) K.add(rbox(0.05, 0.06, D, 0.01), 'metal', C.ironDk, [sx * (W / 2 - 0.035), y, 0], null, 1, R);
    }
    K.add(rbox(W, 0.04, D, 0.01), 'metal', 0x3d3a36, [0, H, 0], null, 1, R, { grime: 0.4 });
    // bars: back wall and both sides (the camera side stays open)
    for (let x = -W / 2 + 0.12; x < W / 2 - 0.06; x += 0.11) K.add(cyl(0.008, 0.008, H - 0.1, 5), 'metal', 0x55524c, [x, H / 2, -D / 2 + 0.035], null, 1, R);
    for (const sx of [-1, 1]) for (let z = -D / 2 + 0.12; z < D / 2 - 0.3; z += 0.11) K.add(cyl(0.008, 0.008, H - 0.1, 5), 'metal', 0x55524c, [sx * (W / 2 - 0.035), H / 2, z], null, 1, R);
    // roof: lifting bridle, eyelet and the cable going up
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.rod('metal', 0x3a3632, [sx * 0.9, H, sz * 0.7], [0, H + 0.55, 0], 0.012, R, 5);
    K.add(tor(0.07, 0.02, 14, 6), 'metal', 0x6a6660, [0, H + 0.62, 0], null, 1, R);
    K.add(cyl(0.018, 0.018, 8, 6), 'metal', 0x2a2826, [0, H + 4.68, 0], null, 1, R, { grime: 0.3 });
    // a lamp hook and a safety chain across the open side
    K.add(tube('cagechain', [[-W / 2 + 0.05, 1.0, D / 2 - 0.04], [0, 0.85, D / 2 - 0.02], [W / 2 - 0.05, 1.0, D / 2 - 0.04]], 0.012, 20, 4), 'metal', 0x6f6a62, null, null, 1, R);
    return K.build();
  });
}
export function winch() {
  return make('winch', () => {
    const K = new Kit(), R = K.root;
    // A-frame legs, cross beams, braces
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.rod('rough', C.wood, [sx * 1.35, 0, sz * 0.5], [sx * 0.35, 3.2, sz * 0.25], 0.09, R, 6, { grime: 0.4, freq: 10 });
    K.add(rbox(1.2, 0.2, 0.7, 0.03), 'rough', C.woodDk, [0, 3.25, 0], null, 1, R, { grime: 0.4 });
    for (const sx of [-1, 1]) K.add(rbox(0.12, 0.12, 1.1, 0.02), 'rough', C.wood, [sx * 0.85, 1.5, 0], null, 1, R);
    K.add(rbox(2.0, 0.12, 0.12, 0.02), 'rough', C.wood, [0, 1.5, -0.42], null, 1, R);
    // the sheave wheel
    const hub = [0, 3.65, 0];
    K.add(tor(0.75, 0.05, 40, 8), 'metal', 0x3d3a36, hub, null, 1, R);
    K.add(tor(0.68, 0.03, 40, 6), 'metal', 0x4d4a45, hub, null, 1, R);
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; K.rod('metal', 0x4d4a45, hub, [Math.cos(a) * 0.7, hub[1] + Math.sin(a) * 0.7, 0], 0.018, R, 5); }
    K.add(cyl(0.11, 0.11, 0.3, 14), 'metal', 0x2e2c2a, hub, [Math.PI / 2, 0, 0], 1, R);
    K.add(cyl(0.035, 0.035, 0.8, 10), 'polish', 0x8d949b, hub, [Math.PI / 2, 0, 0], 1, R);
    for (const sz of [-1, 1]) K.add(rbox(0.2, 0.3, 0.06, 0.02), 'metal', C.ironDk, [0, 3.45, sz * 0.32], null, 1, R);
    K.add(cyl(0.018, 0.018, 3.0, 6), 'metal', 0x2a2826, [0.75, 2.15, 0], null, 1, R);
    return K.build();
  });
}
export function lantern() {
  const g = make('lantern', () => {
    // origin at the hook: the lantern hangs below (to y ~ -0.42)
    const K = new Kit(), R = K.root;
    K.add(tor(0.035, 0.006, 12, 4), 'metal', 0x3a3632, [0, -0.035, 0], null, 1, R);
    K.add(tor(0.06, 0.006, 14, 4, Math.PI), 'metal', 0x3a3632, [0, -0.09, 0], [0, 0, Math.PI], 1, R);
    K.add(cone(0.08, 0.07, 14), 'metal', 0x4a463f, [0, -0.11, 0], null, 1, R, { grime: 0.3 });
    K.add(cyl(0.07, 0.07, 0.02, 14), 'metal', 0x4a463f, [0, -0.155, 0], null, 1, R);
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.4; K.rod('metal', 0x3a3632, [Math.cos(a) * 0.07, -0.16, Math.sin(a) * 0.07], [Math.cos(a) * 0.07, -0.36, Math.sin(a) * 0.07], 0.005, R, 4); }
    K.add(lathe('lantglass', [[0.04, -0.36], [0.06, -0.33], [0.066, -0.26], [0.055, -0.18], [0.045, -0.165]], 14), 'glow', hdr(0xffb050, 3.2), [0, 0, 0], null, 1, R, { own: 'glass' });
    K.add(cyl(0.075, 0.08, 0.05, 14), 'metal', 0x4a463f, [0, -0.385, 0], null, 1, R, { grime: 0.3 });
    return K.build();
  });
  return { group: g, glass: by(g, 'glass') };
}
export function timberFrame(w = 4, h = 4) {
  const W = Math.round(w * 4) / 4, H = Math.round(h * 4) / 4;
  return make(`timber${W},${H}`, () => {
    const K = new Kit(), R = K.root;
    const post = roughen(`post${H}`, rbox(0.26, H, 0.28, 0.03), 0.012, 5, H), beam = roughen(`beam${W}`, rbox(W + 0.5, 0.28, 0.3, 0.03), 0.012, 5, W);
    for (const s of [-1, 1]) K.add(post, 'rough', s > 0 ? C.wood : 0x5f442a, [s * W / 2, H / 2, 0], null, 1, R, { grime: 0.45, freq: 7 });
    K.add(beam, 'rough', 0x5f442a, [0, H + 0.12, 0], null, 1, R, { grime: 0.45, freq: 7 });
    // corner braces, iron straps, bolts
    for (const s of [-1, 1]) {
      K.rod('rough', C.woodDk, [s * W / 2 - s * 0.08, H - 0.65, 0.0], [s * W / 2 - s * 0.75, H - 0.02, 0.0], 0.07, R, 6, { grime: 0.4 });
      K.add(rbox(0.3, 0.12, 0.31, 0.01), 'metal', C.ironDk, [s * W / 2, H - 0.05, 0], null, 1, R);
      for (const yy of [H - 0.08, H + 0.15]) K.add(cyl(0.022, 0.022, 0.33, 6), 'metal', 0x6a6660, [s * W / 2, yy, 0], [Math.PI / 2, 0, 0], 1, R);
      K.add(rbox(0.3, 0.06, 0.31, 0.008), 'rough', 0x3a2a1a, [s * W / 2, 0.03, 0], null, 1, R);   // mud-darkened foot
    }
    // a lagging plank or two resting on the cap
    K.add(rbox(W * 0.6, 0.04, 0.5, 0.01), 'rough', 0x4e3a26, [W * 0.12, H + 0.28, -0.05], [0, 0, 0.02], 1, R, { grime: 0.4 });
    return K.build();
  });
}
export function rail(len = 4) {
  const L = Math.round(len * 2) / 2;
  return make('rail' + L, () => {
    const K = new Kit(), R = K.root;
    for (let x = -L / 2 + 0.3; x <= L / 2 - 0.2; x += 0.6) K.add(rbox(0.16, 0.08, 1.0, 0.01), 'rough', 0x4a3622, [x, 0.04, 0], [0, (hash3(x * 10, 1, 2) - 0.5) * 0.08, 0], 1, R, { grime: 0.45 });
    for (const z of [-0.32, 0.32]) {
      K.add(box(L, 0.06, 0.035), 'metal', 0x6d5446, [0, 0.11, z], null, 1, R, { grime: 0.4 });
      K.add(box(L, 0.018, 0.06), 'metal', 0x5a4438, [0, 0.087, z], null, 1, R);
      K.add(box(L, 0.012, 0.04), 'polish', 0xa9a39a, [0, 0.142, z], null, 1, R, { grime: 0.2 });
      for (let x = -L / 2 + 0.3; x <= L / 2 - 0.2; x += 0.6) K.add(box(0.02, 0.03, 0.02), 'metal', 0x3a3632, [x, 0.095, z + 0.045], null, 1, R);
    }
    return K.build();
  });
}
export function cart() {
  return make('cart', () => {
    const K = new Kit(), R = K.root;
    const body = geo('cartbody', () => { const g = new THREE.CylinderGeometry(0.62, 0.48, 0.5, 4, 1, true); g.rotateY(Math.PI / 4); g.scale(1.15, 1, 0.75); g.computeVertexNormals(); return g; });
    K.add(body, 'metal', 0x5d4232, [0, 0.52, 0], null, 1, R, { grime: 0.45, freq: 6 });
    K.add(geo('cartbody2', () => { const g = new THREE.CylinderGeometry(0.6, 0.46, 0.49, 4, 1, true); g.rotateY(Math.PI / 4); g.scale(1.15, 1, 0.75); g.scale(-1, 1, 1); g.computeVertexNormals(); return g; }), 'metal', 0x3e2c22, [0, 0.52, 0], null, 1, R);
    K.add(box(0.75, 0.03, 0.5), 'metal', 0x3e2c22, [0, 0.28, 0], null, 1, R);
    K.add(rbox(1.42, 0.05, 0.96, 0.02), 'metal', 0x4a3428, [0, 0.77, 0], null, [1, 1, 1], R);
    for (const x of [-0.45, 0, 0.45]) K.add(box(0.05, 0.5, 0.02), 'metal', 0x4a3428, [x, 0.52, 0.355 + (Math.abs(x) > 0 ? -0.04 : 0)], [0.25, 0, 0], 1, R);
    for (let k = 0; k < 8; k++) K.add(sph(0.016, 6, 4), 'metal', 0x6a5a4c, [-0.6 + k * 0.17, 0.74, 0.47], null, 1, R);
    // wheels and axles
    for (const x of [-0.42, 0.42]) {
      K.add(cyl(0.025, 0.025, 0.9, 8), 'metal', 0x2e2c2a, [x, 0.17, 0], [Math.PI / 2, 0, 0], 1, R);
      for (const z of [-0.38, 0.38]) {
        K.add(cyl(0.16, 0.16, 0.06, 18), 'metal', 0x33302c, [x, 0.17, z], [Math.PI / 2, 0, 0], 1, R, { grime: 0.35 });
        K.add(cyl(0.18, 0.18, 0.02, 18), 'metal', 0x3a3632, [x, 0.17, z - Math.sign(z) * 0.035], [Math.PI / 2, 0, 0], 1, R);
        K.add(cyl(0.045, 0.045, 0.09, 10), 'polish', 0x7a7570, [x, 0.17, z], [Math.PI / 2, 0, 0], 1, R);
      }
    }
    // a load of rock with glinting ore
    const r = rng(33);
    for (let k = 0; k < 14; k++) K.add(lump('cartrock' + (k % 4), 0.12 + (k % 3) * 0.03, 1, 0.3, 2.5, k % 4), 'rough', k % 3 ? C.rock : 0x564e46, [(r() - 0.5) * 1.0, 0.72 + r() * 0.15, (r() - 0.5) * 0.6], [r(), r(), r()], 1, R, { grime: 0.3 });
    for (let k = 0; k < 7; k++) K.add(lump('cartore' + (k % 2), 0.05, 1, 0.35, 3, k % 2), 'polish', C.gold, [(r() - 0.5) * 0.9, 0.84 + r() * 0.1, (r() - 0.5) * 0.5], null, 1, R, { grime: 0.2 });
    K.add(tube('carthandle', [[-0.7, 0.62, -0.3], [-0.85, 0.72, -0.2], [-0.88, 0.75, 0.2], [-0.7, 0.62, 0.3]], 0.016, 16, 5), 'metal', C.ironDk, null, null, 1, R);
    return K.build();
  });
}
export function mushroom(scale = 1) {
  const g = make('mushroom', () => {
    const K = new Kit(), R = K.root;
    const specs = [[0, 0, 0.5, 0.27], [0.27, 0.12, 0.3, 0.17], [-0.22, -0.08, 0.36, 0.2], [0.1, -0.22, 0.18, 0.12], [-0.33, 0.15, 0.16, 0.1]];
    specs.forEach(([x, z, h, r], i) => {
      const lean = (i % 2 ? 1 : -1) * 0.15;
      K.add(tube('mstem' + i, [[x, 0, z], [x + lean * 0.3, h * 0.5, z], [x + lean * 0.6, h, z]], r * 0.2, 8, 8), 'gloss', 0xb8c8c4, null, null, 1, R, { grime: 0.2 });
      const cx = x + lean * 0.6, cy = h;
      K.add(lathe('mcap' + i, [[0, r * 0.62], [r * 0.5, r * 0.55], [r * 0.85, r * 0.35], [r, r * 0.12], [r * 0.95, 0.0], [r * 0.8, 0.02]], 22), 'gloss', 0x3a6f78, [cx, cy - r * 0.08, z], [0, 0, lean * 0.5], 1, R, { grime: 0.3, freq: 12 });
      // glowing gills under the cap and spots on top (one separate mesh the renderer can pulse)
      K.add(cyl(r * 0.92, r * 0.25, 0.012, 22), 'glow', hdr(0x40fff0, 3.2), [cx, cy - r * 0.05, z], [0, 0, lean * 0.5], 1, R, { own: 'cap' });
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + i; K.add(sph(r * 0.09, 6, 4), 'glow', hdr(0x8affd8, 2.5), [cx + Math.cos(a) * r * 0.55, cy + r * 0.38, z + Math.sin(a) * r * 0.55], null, [1, 0.4, 1], R, { own: 'cap' }); }
    });
    return K.build();
  });
  g.scale.setScalar(scale);
  return { group: g, cap: by(g, 'cap') };
}
export function crystal(scale = 1, hex = 0xa060ff) {
  const g = make('crystal' + hex, () => {
    const K = new Kit(), R = K.root;
    const r = rng(hex & 0xffff);
    const n = 5 + Math.floor(r() * 5);
    const c = new THREE.Color(hex);
    for (let k = 0; k < n; k++) {
      const big = k === 0, rad = big ? 0.13 : 0.05 + r() * 0.06, h = big ? 0.9 : 0.25 + r() * 0.45;
      const a = r() * Math.PI * 2, d = big ? 0 : 0.08 + r() * 0.16;
      const rot = big ? [0.05, 0, -0.05] : [Math.sin(a) * (0.3 + r() * 0.4), r() * 3, -Math.cos(a) * (0.3 + r() * 0.4)];
      const pos = [Math.cos(a) * d, -0.02, Math.sin(a) * d];
      K.add(prism(rad, h), 'crystal', c.clone().lerp(new THREE.Color(0xffffff), 0.25 + r() * 0.25), pos, rot, 1, R, { grime: 0.12 });
      K.add(prism(rad * 0.45, h * 0.85), 'glow', c.clone().multiplyScalar(2.2 + r()), pos, rot, 1, R);
    }
    K.add(lump('crysbase', 0.22, 1, 0.3, 3, 2, 1.3, 0.35, 1.2), 'rough', 0x3a3540, [0, 0.02, 0], null, 1, R);
    return K.build();
  });
  g.scale.setScalar(scale);
  return g;
}
export function pillarRuin() {
  return make('pillar', () => {
    const K = new Kit(), R = K.root;
    const shaft = geo('pilshaft', () => {
      const g = new THREE.CylinderGeometry(0.42, 0.46, 3.1, 32, 10);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 - 0.05 * Math.max(0, Math.cos(a * 16)); p.setX(i, x * k); p.setZ(i, z * k); }
      g.computeVertexNormals();
      return g;
    });
    K.add(roughen('pilshaft2', shaft, 0.02, 3, 4), 'rough', 0x8a8475, [0, 1.9, 0], null, 1, R, { grime: 0.5, freq: 2.5 });
    K.add(roughen('pilbase', rbox(1.2, 0.3, 1.2, 0.05), 0.02, 3, 1), 'rough', 0x7a7466, [0, 0.15, 0], null, 1, R, { grime: 0.5 });
    K.add(tor(0.48, 0.07, 28, 8), 'rough', 0x7f796a, [0, 0.37, 0], [Math.PI / 2, 0, 0], 1, R);
    K.add(tor(0.46, 0.06, 28, 8), 'rough', 0x7f796a, [0, 3.47, 0], [Math.PI / 2, 0, 0], 1, R);
    K.add(roughen('pilcap', rbox(1.1, 0.32, 1.1, 0.05), 0.025, 3, 5), 'rough', 0x7a7466, [0, 3.7, 0], [0, 0.1, 0.03], 1, R, { grime: 0.5 });
    // glyph band and cracks
    for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; if (Math.sin(a) < -0.3) continue; K.add(box(0.07, 0.11, 0.01), 'glow', hdr(0x38e8d8, 1.6), [Math.cos(a) * 0.43, 2.3 + (k % 2) * 0.03, Math.sin(a) * 0.43], [0, -a + Math.PI / 2, 0], 1, R); }
    K.add(tube('pilcrack', [[0.2, 0.6, 0.39], [0.12, 1.2, 0.42], [0.18, 1.7, 0.41], [0.05, 2.1, 0.44]], 0.015, 16, 4), 'rough', 0x2a2620, null, null, 1, R, { grime: 0 });
    // algae near the waterline
    for (let k = 0; k < 10; k++) { const a = k * 0.7; K.add(sph(0.12, 8, 6), 'rough', 0x3e5a3a, [Math.cos(a) * 0.45, 0.45 + (k % 3) * 0.12, Math.sin(a) * 0.45], null, [1, 0.4, 0.4], R, { grime: 0.4 }); }
    return K.build();
  });
}
export function statue() {
  return make('statue', () => {
    const K = new Kit(), R = K.root;
    const stone = 0x837b6c;
    K.add(roughen('stbase', rbox(1.3, 0.4, 1.0, 0.05), 0.03, 3, 2), 'rough', 0x6f685b, [0, 0.2, 0], null, 1, R, { grime: 0.5 });
    K.add(roughen('robe', lathe('robe0', [[0.55, 0], [0.5, 0.4], [0.38, 1.1], [0.3, 1.6], [0.34, 1.9], [0.26, 2.15], [0.12, 2.25], [0, 2.25]], 24), 0.03, 3, 3), 'rough', stone, [0, 0.4, 0], null, [1, 1, 0.8], R, { grime: 0.5, freq: 3 });
    for (let k = 0; k < 8; k++) { const a = -0.9 + k * 0.25; K.add(cyl(0.025, 0.04, 1.5, 6), 'rough', 0x766e60, [Math.cos(a) * 0.43, 1.05, Math.sin(a) * 0.36], [Math.sin(a) * 0.08, 0, -Math.cos(a) * 0.12], 1, R); } // folds
    // hooded head, bowed
    K.add(sph(0.24, 18, 12), 'rough', stone, [0.06, 2.75, 0], null, [1, 1.1, 0.95], R, { grime: 0.45 });
    K.add(roughen('hood', hemi(0.3, 18, 8), 0.02, 4, 6), 'rough', 0x7a7264, [0.0, 2.7, 0], [0, 0, 0.35], [1, 1.25, 1], R, { grime: 0.45 });
    K.add(sph(0.15, 12, 8), 'rough', 0x2a2620, [0.16, 2.68, 0], null, [0.4, 1, 0.9], R, { grime: 0 });   // the shadow under the hood
    // folded arms holding a staff
    for (const s of [-1, 1]) K.add(cap(0.1, 0.35, 10), 'rough', stone, [0.25, 2.05, s * 0.14], [s * 0.6, 0, Math.PI / 2 - 0.3], 1, R, { grime: 0.4 });
    K.rod('rough', 0x6f685b, [0.42, 0.45, 0.05], [0.4, 3.2, 0.05], 0.045, R, 8);
    K.add(octa(0.1), 'glow', hdr(0x40e0d0, 2.2), [0.4, 3.3, 0.05], null, 1, R);
    for (let k = 0; k < 8; k++) K.add(sph(0.15, 8, 6), 'rough', 0x405c3e, [(hash3(k, 1, 1) - 0.5) * 1.0, 0.45 + hash3(k, 2, 2) * 0.6, 0.38], null, [1, 0.5, 0.3], R, { grime: 0.5 });
    return K.build();
  });
}
export function basalt(h = 3) {
  const H = Math.round(h * 2) / 2;
  return make('basalt' + H, () => {
    const K = new Kit(), R = K.root;
    const r = rng(Math.round(H * 10) + 1);
    const cells = [[0, 0], [1, 0], [-1, 0], [0.5, 0.87], [-0.5, 0.87], [0.5, -0.87], [-0.5, -0.87], [1.5, 0.87], [-1.5, -0.87], [1, 1.73], [-1, -1.73]];
    cells.forEach(([cx, cz], i) => {
      const hh = H * (i === 0 ? 1 : 0.35 + r() * 0.6), rad = 0.3;
      const x = cx * 0.52, z = cz * 0.52;
      K.add(cyl(rad, rad * 1.02, hh, 6), 'gloss', i % 3 ? C.basaltC : 0x1c1917, [x, hh / 2, z], [0, Math.PI / 6, 0], 1, R, { grime: 0.45, freq: 5 });
      K.add(cyl(rad * 0.94, rad, 0.06, 6), 'rough', 0x3a3430, [x, hh + 0.02, z], [0, Math.PI / 6, 0], 1, R);
      if (r() < 0.45) K.add(box(0.012, hh * 0.5, 0.02), 'glow', hdr(0xff5a18, 2.2 + r() * 2), [x + rad * 0.86, hh * 0.3, z], [0, 0, (r() - 0.5) * 0.2], 1, R);
    });
    return K.build();
  });
}

// ================================================================== LEVEL-VARIANT SET PIECES (decor.js picks them per level)
// an iron mine frame: two riveted I-beam posts, a top beam and knee braces, all rusted
export function girder(w = 3.2, h = 4) {
  const W = Math.round(w * 2) / 2, H = Math.min(6, Math.round(h * 2) / 2);
  return make('girder' + W + ',' + H, () => {
    const K = new Kit(), R = K.root;
    const rust = 0x7a3a1c, rustDk = 0x4a2412;
    for (const s of [-1, 1]) {
      K.add(box(0.05, H, 0.18), 'rough', rust, [s * W / 2, H / 2, 0], null, 1, R, { grime: 0.55, freq: 4 });
      for (const z of [0.09, -0.09]) K.add(box(0.2, H, 0.03), 'rough', rustDk, [s * W / 2, H / 2, z], null, 1, R, { grime: 0.55, freq: 5 });
      K.add(box(0.36, 0.05, 0.36), 'rough', rustDk, [s * W / 2, 0.025, 0], null, 1, R);
      K.rod('rough', rust, [s * W / 2, H - 0.95, 0], [s * (W / 2 - 0.85), H - 0.1, 0], 0.035, R, 6);
      for (let k = 0; k < 4; k++) K.add(sph(0.017, 6, 4), 'gloss', 0x3a2418, [s * W / 2, 0.4 + k * (H - 0.8) / 3, 0.105], null, 1, R);
    }
    K.add(box(W + 0.3, 0.2, 0.05), 'rough', rust, [0, H - 0.1, 0], null, 1, R, { grime: 0.55, freq: 4 });
    for (const y of [H, H - 0.2]) K.add(box(W + 0.3, 0.03, 0.2), 'rough', rustDk, [0, y, 0], null, 1, R, { grime: 0.5 });
    for (let k = 0; k < 9; k++) K.add(sph(0.018, 6, 4), 'gloss', 0x3a2418, [-W / 2 + k * W / 8, H - 0.1, 0.03], null, 1, R);
    return K.build();
  });
}
// a run of rusty pipes on wall brackets, flanged joints and a red valve wheel
export function pipes(len = 6) {
  const L = Math.max(2, Math.round(len));
  return make('pipes' + L, () => {
    const K = new Kit(), R = K.root;
    const rust = 0x6e3a20, iron = 0x3e3632;
    for (const [y, r] of [[0, 0.11], [0.34, 0.065]]) {
      K.add(cyl(r, r, L, 14), 'rough', rust, [0, y, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.65, freq: 3 });
      for (let k = 0; k <= L; k += 1.5) K.add(cyl(r * 1.4, r * 1.4, 0.07, 14), 'rough', iron, [-L / 2 + k, y, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.4 });
    }
    for (let k = 0.75; k < L; k += 2) K.add(box(0.06, 0.7, 0.06), 'rough', iron, [-L / 2 + k, 0.15, -0.13], null, 1, R, { grime: 0.5 });
    const vx = -L / 2 + Math.min(L - 0.5, 1.2);
    K.add(tor(0.12, 0.016, 18, 6), 'gloss', 0x8a2418, [vx, 0, 0.26], null, 1, R);
    for (let k = 0; k < 3; k++) K.add(box(0.012, 0.22, 0.012), 'gloss', 0x8a2418, [vx, 0, 0.26], [0, 0, k * Math.PI / 3], 1, R);
    K.add(cyl(0.022, 0.022, 0.16, 6), 'rough', iron, [vx, 0, 0.18], [Math.PI / 2, 0, 0], 1, R);
    return K.build();
  });
}
// a hanging chain with a hook
export function chain(len = 2) {
  const L = Math.max(0.5, Math.round(len * 2) / 2);
  return make('chain' + L, () => {
    const K = new Kit(), R = K.root;
    const n = Math.round(L / 0.075);
    for (let k = 0; k < n; k++) K.add(tor(0.028, 0.008, 10, 5), 'gloss', 0x3a302a, [0, -k * 0.075 - 0.04, 0], [0, k % 2 ? Math.PI / 2 : 0, 0], [1, 1.55, 1], R, { grime: 0.4 });
    K.add(tube('chainhook', [[0, 0, 0], [0, -0.12, 0], [0.02, -0.22, 0], [0.09, -0.24, 0], [0.11, -0.15, 0]], 0.016, 14, 6), 'gloss', 0x2e2622, [0, -n * 0.075 - 0.02, 0], null, 1, R);
    return K.build();
  });
}
// tall, thin bluecap mushrooms with glowing gills
export function tallcap(scale = 1) {
  const g = make('tallcap', () => {
    const K = new Kit(), R = K.root;
    const specs = [[0, 0, 1.6, 0.16], [0.22, 0.1, 1.05, 0.11], [-0.2, -0.05, 1.3, 0.13], [0.08, -0.2, 0.7, 0.08], [-0.3, 0.16, 0.55, 0.07], [0.33, -0.12, 0.85, 0.09]];
    specs.forEach(([x, z, h, r], i) => {
      const lean = (i % 2 ? 1 : -1) * 0.12;
      K.add(tube('tcstem' + i, [[x, 0, z], [x + lean * 0.4, h * 0.5, z], [x + lean, h, z]], r * 0.16, 12, 6), 'gloss', 0x9fb0d8, null, null, 1, R, { grime: 0.15 });
      const cx = x + lean, cy = h;
      K.add(lathe('tccap' + i, [[0, r * 1.1], [r * 0.35, r * 0.95], [r * 0.7, r * 0.5], [r, r * 0.08], [r * 0.9, 0], [r * 0.6, 0.02]], 18), 'gloss', 0x1e2c66, [cx, cy - r * 0.05, z], [0, 0, lean], 1, R, { grime: 0.25, freq: 10 });
      K.add(cyl(r * 0.88, r * 0.2, 0.012, 18), 'glow', hdr(0x5a8cff, 3.4), [cx, cy - r * 0.03, z], [0, 0, lean], 1, R);
      for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + i; K.add(sph(r * 0.08, 6, 4), 'glow', hdr(0xa8c8ff, 2.6), [cx + Math.cos(a) * r * 0.45, cy + r * 0.62, z + Math.sin(a) * r * 0.45], null, [1, 0.5, 1], R); }
    });
    return K.build();
  });
  g.scale.setScalar(scale);
  return g;
}
// bracket fungus stacked up a wall (sticks out toward +z), glowing amber rims
export function shelf() {
  return make('shelf', () => {
    const K = new Kit(), R = K.root;
    const half = (r) => geo('half' + r, () => new THREE.CylinderGeometry(r, r * 0.8, 0.07, 20, 1, false, -Math.PI / 2, Math.PI));
    [[0.3, 0, 0], [0.22, 0.3, 0.12], [0.18, 0.55, -0.1], [0.13, 0.78, 0.05], [0.24, -0.32, -0.08]].forEach(([r, y, x], i) => {
      K.add(half(r), 'rough', i % 2 ? 0x8a5a28 : 0x6e4420, [x, y, 0], [0.12, 0, 0], [1, 1, 1], R, { grime: 0.4, freq: 9 });
      K.add(tor(r * 0.97, 0.012, 20, 4, Math.PI), 'glow', hdr(0xffb040, 2.2), [x, y - 0.03, 0], [Math.PI / 2, 0, 0], 1, R);
    });
    return K.build();
  });
}
// a great root grown down through the cave: one tapering tube with rootlets (unique per call)
export function bigRoot(pts, r = 0.3, seed = 1) {
  const K = new Kit(), R = K.root, rr = rng(seed);
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const N = 40, M = 10;
  const g = new THREE.TubeGeometry(curve, N, r, M, false);
  const pos = g.attributes.position;
  for (let i = 0; i <= N; i++) {
    const P = curve.getPointAt(i / N), f = (1 - 0.7 * i / N) * (1 + 0.12 * Math.sin(i * 1.7 + seed));
    for (let j = 0; j <= M; j++) { const k = i * (M + 1) + j; pos.setXYZ(k, P.x + (pos.getX(k) - P.x) * f, P.y + (pos.getY(k) - P.y) * f, P.z + (pos.getZ(k) - P.z) * f); }
  }
  g.computeVertexNormals();
  K.add(g, 'rough', 0x8a6646, null, null, 1, R, { grime: 0.55, freq: 2.5 });
  for (let k = 0; k < 5; k++) {
    const t = 0.15 + rr() * 0.75, p = curve.getPointAt(t), d = [(rr() - 0.5) * 1.8, -0.4 - rr() * 1.2, (rr() - 0.5) * 0.8];
    const q = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p.clone(), new THREE.Vector3(p.x + d[0] * 0.5, p.y + d[1] * 0.35, p.z + d[2] * 0.5), new THREE.Vector3(p.x + d[0], p.y + d[1], p.z + d[2])]), 10, r * (0.2 + rr() * 0.12) * (1 - t * 0.5), 6);
    K.add(q, 'rough', 0x6e5034, null, null, 1, R, { grime: 0.45 });
  }
  return K.build();
}
// a cluster of icicles hanging from a ceiling point (y = 0 is the ceiling)
export function icicles(seed = 1) {
  return make('icicles' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 5 + 1);
    const n = 4 + Math.floor(r() * 5);
    for (let k = 0; k < n; k++) {
      const h = Math.round((0.3 + r() * 1.2) * 10) / 10, rad = Math.round((0.03 + r() * 0.05) * 100) / 100;
      const g = geo('icic' + h + ',' + rad, () => { const c = new THREE.ConeGeometry(rad, h, 7, 3, false); c.rotateX(Math.PI); c.translate(0, -h / 2, 0); return c; });
      const x = (r() - 0.5) * 0.7, z = (r() - 0.5) * 0.4;
      K.add(g, 'crystal', 0xdaf2ff, [x, 0.04, z], null, 1, R, { grime: 0.05 });
      K.add(g, 'glow', hdr(0x8fd0ff, 0.9), [x, 0.02, z], null, [0.4, 0.9, 0.4], R);
    }
    K.add(lump('iceb', 0.3, 1, 0.3, 3, 4, 1.4, 0.35, 1), 'crystal', 0xe6f6ff, [0, 0.05, 0], null, 1, R);
    return K.build();
  });
}
// a split geode: a rough bowl opening toward the camera, banded rim, lined with crystals pointing inward
export function geode(seed = 1, hex = 0xff9ac0) {
  return make('geode' + seed + ',' + hex, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 7 + 3);
    const bowl = geo('geobowl', () => { const g = new THREE.SphereGeometry(1, 30, 14, 0, Math.PI * 2, 0, Math.PI / 2); g.rotateX(-Math.PI / 2); return g; });
    K.add(roughen('geoshell' + seed, bowl, 0.06, 2.5, seed), 'rough', 0x5a504a, null, null, [1.04, 1.04, 1.04], R, { grime: 0.6 });
    K.add(bowl, 'skin', 0x6e4a5a, null, null, [0.97, 0.97, 0.97], R, { grime: 0.3 });
    K.add(tor(1.0, 0.07, 44, 8), 'rough', 0x6a6058, [0, 0, 0], null, 1, R, { grime: 0.5 });
    K.add(tor(0.94, 0.035, 44, 6), 'gloss', 0xe8dcd4, [0, 0, 0.01], null, 1, R);
    K.add(tor(0.89, 0.03, 44, 6), 'gloss', 0xb8869a, [0, 0, 0.01], null, 1, R);
    const c = new THREE.Color(hex), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let k = 0; k < 70; k++) {
      const a = r() * Math.PI * 2, z = -(0.15 + r() * 0.85), rho = Math.sqrt(1 - z * z);
      d.set(Math.cos(a) * rho, Math.sin(a) * rho, z);
      q.setFromUnitVectors(up, d.clone().negate()); e.setFromQuaternion(q);
      const h = 0.12 + r() * 0.22, rad = 0.03 + r() * 0.035;
      const col = c.clone().lerp(new THREE.Color(0xffffff), r() * 0.45);
      K.add(prism(rad, h), 'crystal', col, [d.x * 0.93, d.y * 0.93, d.z * 0.93], [e.x, e.y, e.z], 1, R, { grime: 0.05 });
      if (k % 3 === 0) K.add(prism(rad * 0.45, h * 0.8), 'glow', c.clone().multiplyScalar(1.6 + r()), [d.x * 0.93, d.y * 0.93, d.z * 0.93], [e.x, e.y, e.z], 1, R);
    }
    return K.build();
  });
}
// a cluster of salt (halite) cubes on a crusted lump
export function saltCubes(seed = 1) {
  return make('salt' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 11 + 5);
    K.add(lump('saltb' + seed, 0.32, 1, 0.3, 3, seed, 1.4, 0.4, 1), 'rough', 0xcfc8ba, [0, 0.04, 0], null, 1, R, { grime: 0.35 });
    const n = 6 + Math.floor(r() * 6);
    for (let k = 0; k < n; k++) {
      const s = Math.round((0.08 + r() * (k === 0 ? 0.3 : 0.16)) * 50) / 50;
      K.add(rbox(s, s, s, s * 0.06), 'crystal', 0xf4efe6, [(r() - 0.5) * 0.6, 0.08 + s * 0.4, (r() - 0.5) * 0.35], [r() * 0.8, r() * 3, r() * 0.8], 1, R, { grime: 0.15 });
    }
    return K.build();
  });
}
// an old aqueduct arcade: a stone wall with n arches, pilasters and a cornice
export function arcade(n = 3) {
  return make('arcade' + n, () => {
    const K = new Kit(), R = K.root;
    const bay = 2.6, H = 4.2, W = n * bay, sp = 2.4;
    const wall = geo('arcw' + n, () => {
      const s = new THREE.Shape(); s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.closePath();
      for (let k = 0; k < n; k++) {
        const cx = -W / 2 + bay * (k + 0.5), hw = bay * 0.33;
        const h = new THREE.Path(); h.moveTo(cx - hw, 0.4); h.lineTo(cx + hw, 0.4); h.lineTo(cx + hw, sp); h.absarc(cx, sp, hw, 0, Math.PI, false); h.lineTo(cx - hw, 0.4);
        s.holes.push(h);
      }
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1, curveSegments: 12 });
      g.translate(0, 0, -0.25); g.computeVertexNormals();
      return g;
    });
    K.add(wall, 'rough', 0xb3a893, null, null, 1, R, { grime: 0.65, freq: 2 });
    K.add(box(W + 0.4, 0.28, 0.75), 'rough', 0xa69b86, [0, H + 0.1, 0], null, 1, R, { grime: 0.6 });
    for (let k = 0; k <= n; k++) K.add(box(0.34, H - 0.4, 0.14), 'rough', 0xa89d88, [-W / 2 + bay * k, H / 2, 0.3], null, 1, R, { grime: 0.6 });
    K.add(box(W + 0.2, 0.35, 0.8), 'rough', 0x978c78, [0, 0.17, 0], null, 1, R, { grime: 0.6 });
    return K.build();
  });
}
// kelp-like weed hanging from a ceiling point, beaded with glowing pods
export function kelp(seed = 1) {
  return make('kelp' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 3 + 9);
    for (let s = 0; s < 3; s++) {
      const L = 0.8 + r() * 2.2, x0 = (r() - 0.5) * 0.4, z0 = (r() - 0.5) * 0.3, pts = [];
      for (let k = 0; k <= 6; k++) pts.push([x0 + Math.sin(k * 1.3 + s) * 0.12, -L * k / 6, z0 + Math.cos(k * 0.9 + s) * 0.06]);
      K.add(tube('kelp' + seed + s, pts, 0.025, 18, 5), 'gloss', 0x34482a, null, null, 1, R, { grime: 0.3 });
      for (let k = 1; k < 6; k += 2) K.add(sph(0.035, 8, 6), 'glow', hdr(0x40f0d0, 1.8), [pts[k][0] + 0.03, pts[k][1], pts[k][2] + 0.03], null, 1, R);
    }
    return K.build();
  });
}
// a drifting glow jelly (moved by decor.js each frame)
export function jelly() {
  return make('jelly', () => {
    const K = new Kit(), R = K.root;
    K.shadow = false;
    K.add(hemi(0.22, 18, 8), 'ghost', hdr(0x3fb8ff, 0.9), [0, 0, 0], null, [1, 0.75, 1], R);
    K.add(hemi(0.12, 14, 6), 'ghost', hdr(0xb0f4ff, 1.6), [0, 0.02, 0], null, [1, 0.8, 1], R);
    for (let k = 0; k < 7; k++) {
      const a = k / 7 * Math.PI * 2;
      K.add(tube('jt' + k, [[Math.cos(a) * 0.15, 0, Math.sin(a) * 0.15], [Math.cos(a) * 0.12, -0.25, Math.sin(a) * 0.12 + 0.03], [Math.cos(a) * 0.16, -0.5, Math.sin(a) * 0.14], [Math.cos(a) * 0.1, -0.78, Math.sin(a) * 0.1]], 0.008, 12, 4), 'ghost', hdr(0x5fe0ff, 0.7), null, null, 1, R);
    }
    return K.build();
  });
}
// a sulfur vent: a crusted mound with a hot throat and yellow crystals round the lip
export function vent() {
  return make('vent', () => {
    const K = new Kit(), R = K.root;
    K.add(roughen('ventm', lathe('ventm0', [[0.8, 0], [0.62, 0.12], [0.38, 0.3], [0.22, 0.42], [0.15, 0.41], [0.11, 0.2], [0, 0.18]], 22), 0.04, 4, 3), 'rough', 0xa88a26, null, null, 1, R, { grime: 0.6, freq: 5 });
    K.add(cyl(0.13, 0.1, 0.02, 14), 'glow', hdr(0xffa020, 2.6), [0, 0.38, 0], null, 1, R);
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; K.add(prism(0.022 + (k % 3) * 0.008, 0.1 + (k % 4) * 0.04), 'gloss', 0xffd83a, [Math.cos(a) * 0.25, 0.37, Math.sin(a) * 0.25], [Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6], 1, R); }
    return K.build();
  });
}

// ================================================================== SMALL CLUTTER (detail.js scatters these by the dozen)
export function crate(seed = 0) {
  return make('crate' + seed, () => {
    const K = new Kit(), R = K.root, s = 0.42 + (seed % 3) * 0.08, wood = [0x7a5634, 0x6a4a2c, 0x856040][seed % 3];
    K.add(rbox(s, s, s, 0.015), 'rough', wood, [0, s / 2, 0], null, 1, R, { grime: 0.5, freq: 8 });
    for (const z of [s / 2 + 0.006, -s / 2 - 0.006]) for (const y of [0.12, 0.5, 0.88]) K.add(box(s * 0.98, 0.05, 0.012), 'rough', 0x5a3e24, [0, s * y, z], null, 1, R, { grime: 0.4 });
    for (const x of [s / 2 + 0.006, -s / 2 - 0.006]) K.add(box(0.012, s * 0.98, s * 0.98), 'rough', 0x5f4228, [x, s / 2, 0], null, 1, R, { grime: 0.45 });
    K.add(box(0.012, s * 1.25, 0.06), 'rough', 0x5a3e24, [0, s / 2, s / 2 + 0.012], [0, 0, Math.atan2(s, s)], 1, R, { grime: 0.4 });
    for (const x of [-1, 1]) for (const y of [0, 1]) K.add(box(0.05, 0.05, 0.016), 'metal', 0x3a3632, [x * (s / 2 - 0.02), 0.02 + y * (s - 0.04), s / 2 + 0.012], null, 1, R);
    return K.build();
  });
}
export function barrel(rusty = 0) {
  return make('barrel' + rusty, () => {
    const K = new Kit(), R = K.root;
    const prof = []; for (let i = 0; i <= 10; i++) { const t = i / 10; prof.push([0.25 + Math.sin(t * Math.PI) * 0.045, t * 0.8]); }
    prof.unshift([0, 0]); prof.push([0, 0.8]);
    K.add(lathe('barrel', prof, 20), 'rough', rusty ? 0x6e3a1e : 0x6a4a2c, null, null, 1, R, { grime: 0.6, freq: rusty ? 4 : 9 });
    for (const y of [0.1, 0.32, 0.48, 0.7]) K.add(tor(0.255 + Math.sin(y / 0.8 * Math.PI) * 0.045, 0.012, 24, 4), rusty ? 'rough' : 'metal', rusty ? 0x4a2412 : 0x3a3632, [0, y, 0], [Math.PI / 2, 0, 0], 1, R);
    return K.build();
  });
}
export function sack(seed = 0) {
  return make('sack' + seed, () => {
    const K = new Kit(), R = K.root;
    K.add(lump('sack' + seed, 0.24, 2, 0.12, 2, seed, 1, 1.25, 0.85), 'rough', [0x8a7a58, 0x7a6a4a][seed % 2], [0, 0.25, 0], [0, seed, 0.1], 1, R, { grime: 0.45, freq: 6 });
    K.add(cyl(0.05, 0.08, 0.12, 10), 'rough', 0x7a6a4a, [0.02, 0.55, 0], [0, 0, 0.15], 1, R);
    K.add(tor(0.055, 0.012, 12, 4), 'rough', 0xa48c5c, [0.02, 0.52, 0], [Math.PI / 2, 0, 0], 1, R);
    return K.build();
  });
}
export function planks() {
  return make('planks', () => {
    const K = new Kit(), R = K.root, r = rng(77);
    for (let k = 0; k < 6; k++) K.add(rbox(1.6, 0.05, 0.2, 0.01), 'rough', [0x7a5634, 0x6a4a2c, 0x5e4228][k % 3], [(r() - 0.5) * 0.3, 0.03 + k * 0.05, (r() - 0.5) * 0.25], [0, (r() - 0.5) * 0.25, 0], 1, R, { grime: 0.5, freq: 7 });
    return K.build();
  });
}
export function bucket() {
  return make('bucket', () => {
    const K = new Kit(), R = K.root;
    K.add(lathe('bucket', [[0, 0], [0.13, 0], [0.16, 0.3], [0.155, 0.3], [0.125, 0.012], [0, 0.012]], 18), 'metal', 0x5a524a, null, null, 1, R, { grime: 0.6 });
    K.add(tor(0.16, 0.008, 18, 4, Math.PI), 'metal', 0x3a3632, [0, 0.3, 0], null, 1, R);
    return K.build();
  });
}
export function shovel() {
  return make('shovel', () => {
    const K = new Kit(), R = K.root;
    K.add(cyl(0.018, 0.02, 1.1, 8), 'rough', 0x7a5634, [0, 0.75, 0], null, 1, R, { grime: 0.4 });
    K.add(tor(0.05, 0.012, 12, 4, Math.PI), 'rough', 0x6a4a2c, [0, 1.3, 0], null, 1, R);
    K.add(plate('spade', [[-0.11, 0], [0.11, 0], [0.12, 0.18], [0.03, 0.24], [-0.03, 0.24], [-0.12, 0.18]], 0.012), 'metal', 0x4a4440, [0, 0.0, 0], null, 1, R, { grime: 0.5 });
    return K.build();
  });
}
export function ropeCoil() {
  return make('ropecoil', () => {
    const K = new Kit(), R = K.root;
    for (let k = 0; k < 4; k++) K.add(tor(0.2 - k * 0.01, 0.025, 22, 6), 'rough', 0xa48c5c, [k * 0.01, 0.03 + k * 0.045, 0], [Math.PI / 2, 0, 0], 1, R, { grime: 0.35, freq: 14 });
    return K.build();
  });
}
// a heap of broken ore (rock lumps with a few gold or coloured nuggets in it)
export function oreHeap(hex = 0xe6b24c) {
  return make('ore' + hex, () => {
    const K = new Kit(), R = K.root, r = rng(hex & 0xfff);
    for (let k = 0; k < 9; k++) { const a = r() * 6.28, d = r() * 0.3, s = 0.06 + r() * 0.08; K.add(lump('orel' + (k % 3), 1, 1, 0.3, 3, k % 3), 'rough', 0x5a5048, [Math.cos(a) * d, s * 0.7 + (0.3 - d) * 0.35, Math.sin(a) * d], [r(), r(), r()], s, R, { grime: 0.4 }); }
    for (let k = 0; k < 5; k++) { const a = r() * 6.28, d = r() * 0.22; K.add(lump('oren', 1, 1, 0.35, 4, 9), 'polish', hex, [Math.cos(a) * d, 0.12 + (0.22 - d) * 0.5, Math.sin(a) * d], null, 0.035 + r() * 0.02, R, { grime: 0.2 }); }
    return K.build();
  });
}
export function gear() {
  return make('gear', () => {
    const K = new Kit(), R = K.root;
    K.add(tor(0.26, 0.04, 28, 6), 'rough', 0x6e3a1e, null, null, 1, R, { grime: 0.6 });
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; K.add(box(0.07, 0.07, 0.07), 'rough', 0x5a2e18, [Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0], [0, 0, a], 1, R, { grime: 0.5 }); }
    for (let k = 0; k < 4; k++) K.add(box(0.5, 0.04, 0.04), 'rough', 0x5a2e18, null, [0, 0, k * Math.PI / 4], 1, R);
    K.add(cyl(0.06, 0.06, 0.1, 10), 'rough', 0x3a2418, null, [Math.PI / 2, 0, 0], 1, R);
    return K.build();
  });
}
export function bones(seed = 0) {
  return make('bones' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 13 + 2);
    for (let k = 0; k < 5; k++) {
      const L = 0.18 + r() * 0.25, a = r() * 6.28, x = (r() - 0.5) * 0.5, z = (r() - 0.5) * 0.3;
      K.add(cyl(0.016, 0.016, L, 6), 'rough', 0xcfc1a0, [x, 0.018, z], [Math.PI / 2, a, 0], 1, R, { grime: 0.5 });
      for (const s of [-1, 1]) K.add(sph(0.028, 8, 6), 'rough', 0xd6c8a8, [x + Math.sin(a) * L / 2 * s, 0.022, z + Math.cos(a) * L / 2 * s], null, [1, 0.8, 1.2], R, { grime: 0.5 });
    }
    return K.build();
  });
}
export function urn(seed = 0) {
  return make('urn' + seed, () => {
    const K = new Kit(), R = K.root;
    K.add(lathe('urn', [[0, 0], [0.1, 0], [0.16, 0.1], [0.2, 0.28], [0.16, 0.48], [0.07, 0.56], [0.07, 0.62], [0.1, 0.65], [0.08, 0.66]], 18), 'rough', [0x8a5a3a, 0x6e7a5e, 0x9a8a6a][seed % 3], null, null, 1, R, { grime: 0.6, freq: 6 });
    for (const s of [-1, 1]) K.add(tor(0.06, 0.012, 10, 4, Math.PI), 'rough', 0x7a5236, [s * 0.13, 0.5, 0], [0, 0, s * 0.5 - Math.PI / 2], 1, R);
    return K.build();
  });
}
export function block(seed = 0) {
  return make('block' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 5 + 3);
    const w = 0.5 + r() * 0.4, h = 0.3 + r() * 0.25, d = 0.4 + r() * 0.3;
    K.add(roughen('blk' + seed, rbox(w, h, d, 0.04), 0.025, 3, seed), 'rough', [0x8a8475, 0xa69b86, 0x7a7466][seed % 3], [0, h / 2, 0], null, 1, R, { grime: 0.6, freq: 3 });
    return K.build();
  });
}
// a fallen column drum, fluted
export function drum() {
  return make('drum', () => {
    const K = new Kit(), R = K.root;
    const g = geo('drumg', () => { const c = new THREE.CylinderGeometry(0.38, 0.4, 0.6, 32, 2); const p = c.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 - 0.05 * Math.max(0, Math.cos(a * 16)); p.setX(i, x * k); p.setZ(i, z * k); } c.computeVertexNormals(); return c; });
    K.add(roughen('drumr', g, 0.015, 3, 2), 'rough', 0x8a8475, [0, 0.39, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.6, freq: 2.5 });
    return K.build();
  });
}
export function shells(seed = 0) {
  return make('shells' + seed, () => {
    const K = new Kit(), R = K.root, r = rng(seed * 3 + 1);
    for (let k = 0; k < 6; k++) {
      const x = (r() - 0.5) * 0.5, z = (r() - 0.5) * 0.3, a = r() * 6.28;
      if (k % 2) K.add(hemi(0.05 + r() * 0.03, 12, 5), 'gloss', [0xe8d8c8, 0xd8b8a0, 0xc8d0d8][k % 3], [x, 0.0, z], [0, a, 0], [1, 0.45, 0.85], R, { grime: 0.3 });
      else K.add(lathe('snail', [[0, 0.12], [0.02, 0.1], [0.04, 0.07], [0.055, 0.035], [0.045, 0.0], [0, 0]], 12), 'gloss', [0xe0c8a8, 0xc8a080][k % 2 ? 1 : 0], [x, 0.0, z], [Math.PI / 2 * 0.9, a, 0], 1, R, { grime: 0.3 });
    }
    return K.build();
  });
}
// a sea anemone that glows: a stalk and a crown of fine tentacles
export function anemone(hex = 0x40f0d0) {
  return make('anem' + hex, () => {
    const K = new Kit(), R = K.root;
    K.add(cyl(0.05, 0.07, 0.14, 12), 'gloss', 0x4a3a48, [0, 0.07, 0], null, 1, R, { grime: 0.3 });
    for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, l = 0.12 + (k % 3) * 0.03; K.add(cyl(0.006, 0.01, l, 4), 'glow', hdr(hex, 1.6), [Math.cos(a) * 0.04 + Math.cos(a) * l * 0.3, 0.14 + l * 0.42, Math.sin(a) * 0.04 + Math.sin(a) * l * 0.3], [Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7], 1, R); }
    return K.build();
  });
}
// a fern-like tuft of curling fronds
export function fern(hex = 0x3a5a2a) {
  return make('fern' + hex, () => {
    const K = new Kit(), R = K.root;
    const leaf = plate('frond', [[0, 0], [0.05, 0.12], [0.06, 0.3], [0.035, 0.46], [0, 0.55], [-0.035, 0.46], [-0.06, 0.3], [-0.05, 0.12]], 0.003);
    for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2 + (k % 2) * 0.3, tilt = 0.5 + (k % 3) * 0.25; K.add(leaf, 'skin', new THREE.Color(hex).multiplyScalar(0.8 + (k % 3) * 0.15), [0, 0.01, 0], [tilt * Math.cos(a), a, tilt * Math.sin(a)], 0.8 + (k % 4) * 0.12, R, { grime: 0.25 }); }
    return K.build();
  });
}
// a cluster of tiny glowing mushrooms
export function minicaps(hex = 0x40fff0, cap = 0x3a6f78) {
  return make('minic' + hex + ',' + cap, () => {
    const K = new Kit(), R = K.root, r = rng(hex & 0xffff);
    for (let k = 0; k < 8; k++) {
      const x = (r() - 0.5) * 0.3, z = (r() - 0.5) * 0.2, h = 0.04 + r() * 0.1, cr = 0.02 + r() * 0.025;
      K.add(cyl(cr * 0.2, cr * 0.25, h, 6), 'gloss', 0xc8d0cc, [x, h / 2, z], null, 1, R, { grime: 0.15 });
      K.add(hemi(cr, 10, 4), 'gloss', cap, [x, h, z], null, [1, 0.6, 1], R, { grime: 0.2 });
      K.add(cyl(cr * 0.9, cr * 0.3, 0.004, 10), 'glow', hdr(hex, 3), [x, h - 0.002, z], null, 1, R);
    }
    return K.build();
  });
}
// a smouldering lump of ember coal
export function coal(seed = 0) {
  return make('coal' + seed, () => {
    const K = new Kit(), R = K.root;
    K.add(lump('coal' + seed, 0.18, 1, 0.35, 3, seed, 1.2, 0.7, 1), 'rough', 0x1e1816, [0, 0.1, 0], null, 1, R, { grime: 0.3 });
    for (let k = 0; k < 5; k++) { const a = k * 1.3 + seed; K.add(box(0.012, 0.012, 0.12), 'glow', hdr(0xff5a18, 2.2 + (k % 2)), [Math.cos(a) * 0.15, 0.08 + (k % 3) * 0.03, Math.sin(a) * 0.12], [0, a, 0.3], 1, R); }
    return K.build();
  });
}

// hanging strands (moss, rootlets, weed) from a list of roof points [[x, y, z, len], ...] in world space; uncached
export function strands(list, hex, tipHex = 0, seed = 1) {
  const K = new Kit(), R = K.root, r = rng(seed);
  K.shadow = false;
  for (const [x, y, z, len] of list) {
    const pts = [], sw = (r() - 0.5) * 0.35;
    for (let k = 0; k <= 5; k++) pts.push(new THREE.Vector3(x + Math.sin(k * 1.1 + x) * 0.05 + sw * k / 5, y - len * k / 5, z + Math.cos(k * 0.9 + y) * 0.04));
    K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.01 + r() * 0.012, 4), 'rough', new THREE.Color(hex).multiplyScalar(0.75 + r() * 0.5), null, null, 1, R, { grime: 0.2 });
    if (tipHex && r() < 0.45) K.add(sph(0.02, 6, 4), 'glow', hdr(tipHex, 2.2), [pts[5].x, pts[5].y, pts[5].z], null, 1, R);
  }
  return K.build();
}
// ================================================================== BOSSES
// cover an ellipsoid with rock plates (flattened lumps facing outward) leaving thin gaps; skip(d) leaves holes
function plated(K, parent, c, rad, n, seed, cols, size, o = {}) {
  const ga = Math.PI * (3 - Math.sqrt(5)), r = rng(seed);
  const zf = new THREE.Vector3(0, 0, 1), nrm = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const y = 1 - (i + 0.5) / n * 2, rr = Math.sqrt(1 - y * y), th = ga * i;
    const d = [Math.cos(th) * rr, y, Math.sin(th) * rr];
    if (o.skip && o.skip(d)) continue;
    nrm.set(d[0] / rad[0], d[1] / rad[1], d[2] / rad[2]).normalize();
    q.setFromUnitVectors(zf, nrm); e.setFromQuaternion(q);
    const k = size * (0.85 + r() * 0.3);
    K.add(lump((o.key || 'plate') + (i % 5), 1, o.detail ?? 1, 0.3, 1.6, i % 5, 1, 0.9, 0.42), o.mat || 'gloss', cols[i % cols.length],
      [c[0] + d[0] * rad[0], c[1] + d[1] * rad[1], c[2] + d[2] * rad[2]], [e.x, e.y, e.z + r() * 3], k, parent, { grime: 0.45, freq: 2.5 / size });
  }
}
function buildRockjaw() {
  const K = new Kit(), R = K.root;
  const shell = 0x40372f, plate2 = 0x5c4d3f, pale = 0x8a7864;
  const barrel = (key, len, r0, r1, lip) => lathe(key, [[0, -len / 2], [r0 * 0.5, -len / 2 + 0.02], [r0 * 0.84, -len * 0.4], [r0, -len * 0.24], [(r0 + r1) / 2, 0], [r1, len * 0.3], [lip, len * 0.42], [lip * 0.97, len / 2], [r1 * 0.75, len / 2 + 0.02], [0, len / 2 + 0.02]], 26);
  const head = K.group('head', R);
  // the armoured head: a heavy domed skull behind a collar of overlapping scales
  K.add(roughen('rjdome2', barrel('rjhb', 1.9, 1.05, 1.3, 1.36), 0.07, 1.5, 2), 'gloss', shell, [-0.35, 0, 0], [0, 0, -Math.PI / 2], 1, head, { grime: 0.5, freq: 2 });
  plated(K, head, [-0.5, 0.15, 0], [1.25, 1.2, 1.2], 26, 5, [plate2, shell, 0x4f4237], 0.55, { skip: (d) => d[0] > 0.55, key: 'rjsc' });
  for (let k = 0; k < 5; k++) K.add(cone(0.22, 0.95 - k * 0.1, 7), 'gloss', 0x2f2721, [-0.2 - k * 0.38, 1.3 - k * 0.05, 0], [0, 0, 0.75], [1, 1, 0.7], head);
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) K.add(cone(0.12, 0.45, 6), 'gloss', 0x2f2721, [-0.2 - k * 0.5, 0.75, s * 1.1], [s * 0.9, 0, 0.6], 1, head);
  // the maw: four hooked jaw petals around a lipped ring of teeth and a glowing throat
  const maw = K.group('maw', head, 0.85, 0, 0);
  K.add(tor(0.98, 0.2, 36, 10), 'gloss', 0x4a2420, [0, 0, 0], [0, Math.PI / 2, 0], 1, maw, { grime: 0.35 });
  for (let k = 0; k < 4; k++) {
    const a = k / 4 * Math.PI * 2 + Math.PI / 4, cy = Math.cos(a), cz = Math.sin(a);
    const base = [0.05, cy * 0.95, cz * 0.95], mid = [0.85, cy * 1.35, cz * 1.35], tip = [1.45, cy * 0.75, cz * 0.75];
    K.add(tube('rjpetal' + k, [base, mid, tip], 0.2, 14, 8), 'gloss', plate2, null, null, 1, maw, { grime: 0.45, freq: 3 });
    K.add(tube('rjpetalb' + k, [[base[0], base[1] * 1.05, base[2] * 1.05], [mid[0] - 0.1, mid[1] * 1.08, mid[2] * 1.08], [tip[0] - 0.25, tip[1] * 1.25, tip[2] * 1.25]], 0.13, 12, 6), 'gloss', 0x352c25, null, null, 1, maw);
    for (let j = 0; j < 5; j++) {
      const t = 0.25 + j * 0.15, px = base[0] + (tip[0] - base[0]) * t, pr = 0.95 + Math.sin(t * Math.PI) * 0.35 - t * 0.2;
      const pos = new THREE.Vector3(px, cy * pr * 0.9, cz * pr * 0.9), dir = new THREE.Vector3(0.2, -cy, -cz).normalize();
      const qq = new THREE.Quaternion().setFromUnitVectors(_up, dir), ee = new THREE.Euler().setFromQuaternion(qq);
      K.add(cone(0.05, 0.26, 6), 'gloss', 0xe2d6bc, [pos.x, pos.y, pos.z], [ee.x, ee.y, ee.z], 1, maw, { grime: 0.2 });
    }
  }
  for (let ring = 0; ring < 2; ring++) {
    const n = 16 - ring * 4, rr = 0.82 - ring * 0.24;
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2 + ring * 0.2, y = Math.cos(a) * rr, z = Math.sin(a) * rr;
      const qq = new THREE.Quaternion().setFromUnitVectors(_up, new THREE.Vector3(-0.35, -y, -z).normalize()), ee = new THREE.Euler().setFromQuaternion(qq);
      K.add(cone(0.06 - ring * 0.012, 0.32 - ring * 0.07, 6), 'gloss', 0xe8dcc0, [-ring * 0.2, y * 0.95, z * 0.95], [ee.x, ee.y, ee.z], 1, maw, { grime: 0.25 });
    }
  }
  K.add(cyl(0.62, 0.12, 1.3, 20, true), 'glow', hdr(0xff5a18, 2.4), [-0.7, 0, 0], [0, 0, Math.PI / 2], 1, maw);
  K.add(sph(0.32, 14, 10), 'glow', hdr(0xffa040, 4), [-1.2, 0, 0], null, 1, maw);
  // body segments (not parented: the renderer lays them along a trail), overlapping armoured barrels
  for (let i = 0; i < 12; i++) {
    const seg = K.group('seg' + i, R, -1.6 - i * 1.15, 0, 0);
    const sc = 1 - i * 0.045;
    K.add(roughen('rjseg2', barrel('rjsb2', 1.6, 0.95, 1.14, 1.24), 0.06, 1.8, 5), 'gloss', i % 2 ? shell : 0x3a322b, [0, 0, 0], [0, 0, -Math.PI / 2], sc, seg, { grime: 0.5, freq: 2 });
    K.add(sph(0.95, 16, 10), 'rough', pale, [0, -0.42 * sc, 0], null, [0.62 * sc, 0.62 * sc, 0.98 * sc], seg, { grime: 0.45, freq: 4 });   // paler belly
    K.add(cone(0.2 * sc, 0.75 * sc, 7), 'gloss', 0x2f2721, [-0.1, 1.15 * sc, 0], [0, 0, 0.55], [1, 1, 0.7], seg);
    for (const s of [-1, 1]) K.add(cone(0.1 * sc, 0.32 * sc, 6), 'gloss', 0x2f2721, [0, 0.55 * sc, s * 1.02 * sc], [s * 1.1, 0, 0.4], 1, seg);
  }
  return K.build();
}
export function rockjaw() {
  const g = make('rockjaw', buildRockjaw);
  return { group: g, head: by(g, 'head'), maw: by(g, 'maw'), segs: Array.from({ length: 12 }, (_, i) => by(g, 'seg' + i)) };
}

function buildGloomwing() {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R);
  K.add(lump('gwbody', 0.8, 6, 0.14, 3, 4, 1.35, 0.9, 0.85), 'rough', 0x2a2120, [0, 0, 0], null, 1, body, { grime: 0.45, freq: 6 });
  K.add(lump('gwchest', 0.5, 5, 0.18, 4, 2, 1, 1, 1), 'rough', 0x3a2c28, [0.5, -0.15, 0], null, 1, body, { grime: 0.45, freq: 8 });
  for (const s of [-1, 1]) {
    K.rod('rough', 0x241b1a, [-0.6, -0.45, s * 0.3], [-1.1, -1.1, s * 0.4], 0.09, body, 7);
    for (let k = 0; k < 3; k++) K.add(cone(0.035, 0.22, 6), 'gloss', 0xd8d0c0, [-1.15 + k * 0.05, -1.25, s * (0.32 + k * 0.06)], [0, 0, Math.PI - 0.3], 1, body);
  }
  const head = K.group('head', R, 1.0, 0.35, 0);
  K.add(lump('gwhead', 0.42, 5, 0.12, 4, 6, 1.1, 0.95, 1), 'rough', 0x2e2422, [0, 0, 0], null, 1, head, { grime: 0.4 });
  K.add(cone(0.2, 0.42, 10), 'rough', 0x3b2d2a, [0.45, -0.05, 0], [0, 0, -Math.PI / 2], [1, 1, 0.85], head);
  K.add(lump('gwnose', 0.12, 1, 0.3, 4, 1, 1, 0.8, 1.3), 'gloss', 0x1c1413, [0.66, -0.02, 0], null, 1, head);
  for (const s of [-1, 1]) {
    K.add(cone(0.24, 0.9, 7), 'skin', 0x4a3532, [-0.1, 0.62, s * 0.22], [s * -0.3, 0, -0.15], [1, 1, 0.35], head);
    for (let k = 0; k < 3; k++) K.add(cone(0.03, 0.2, 5), 'gloss', 0xece4d4, [0.55 - k * 0.07, -0.25, s * (0.07 + k * 0.02)], [0, 0, Math.PI], 1, head);
  }
  for (const s of [-1, 1]) K.add(sph(0.075, 12, 10), 'glow', hdr(0xff4a18, 7), [0.36, 0.14, s * 0.24], null, [0.8, 1, 1], head, { own: 'eyes' });
  const wingR = K.group('wingR', R, 0.2, 0.25, 0.55), wingL = K.group('wingL', R, 0.2, 0.25, -0.55);
  addWing(K, wingR, 4.0, 2.3, 1, 0x30242a, 0x1e1616, 0.045, 'gw', 3);
  addWing(K, wingL, 4.0, 2.3, -1, 0x30242a, 0x1e1616, 0.045, 'gw', 3);
  return K.build();
}
export function gloomwing() {
  const g = make('gloomwing', buildGloomwing);
  return { group: g, wingL: by(g, 'wingL'), wingR: by(g, 'wingR'), body: by(g, 'body'), head: by(g, 'head'), eyes: by(g, 'eyes') };
}

function buildWarden() {
  const K = new Kit(), R = K.root;
  const rockC = 0x3d3946, rock2 = 0x2c2934, vio = 0xa070ff;
  // crystals breaking out of the rock: bases at pos, leaning along dir (spread = random tilt)
  const shard = (parent, n, seed, pos, spread, len, c = vio, glowK = 2.4, dir = [0, 1, 0]) => {
    const r = rng(seed);
    const D = new THREE.Vector3(...dir).normalize();
    for (let k = 0; k < n; k++) {
      const v = D.clone().add(new THREE.Vector3((r() - 0.5) * spread, (r() - 0.5) * spread * 0.5, (r() - 0.5) * spread)).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(_up, v), e = new THREE.Euler().setFromQuaternion(q);
      const rot = [e.x, e.y, e.z];
      const p = [pos[0] + (r() - 0.5) * 0.25, pos[1] + (r() - 0.5) * 0.18, pos[2] + (r() - 0.5) * 0.25];
      const rad = 0.06 + r() * 0.09, h = len * (0.5 + r() * 0.7);
      K.add(prism(rad, h), 'crystal', new THREE.Color(c).lerp(new THREE.Color(0xffffff), 0.2 + r() * 0.3), p, rot, 1, parent, { grime: 0.1 });
      K.add(prism(rad * 0.42, h * 0.85), 'glow', hdr(c, glowK), p, rot, 1, parent);
    }
  };
  // legs: boulder thigh, shin, foot
  for (const s of [-1, 1]) {
    const leg = K.group(s > 0 ? 'legR' : 'legL', R, 0, 1.95, s * 0.55);
    K.add(lump('wthigh', 0.42, 3, 0.32, 2.2, 1, 1, 1.45, 1), 'rough', rockC, [0, -0.55, 0], null, 1, leg, { grime: 0.45, freq: 3 });
    K.add(lump('wshin', 0.38, 3, 0.32, 2.2, 3, 1, 1.4, 1), 'rough', rock2, [0.05, -1.3, 0], null, 1, leg, { grime: 0.45, freq: 3 });
    K.add(lump('wfoot', 0.4, 3, 0.30, 2.2, 5, 1.45, 0.6, 1.1), 'rough', rockC, [0.18, -1.78, 0], null, 1, leg, { grime: 0.45, freq: 3 });
    shard(leg, 4, 10 + s, [0.05, -0.65, s * 0.38], 0.9, 0.5, vio, 2.4, [0.2, 0.3, s]);
    shard(leg, 3, 12 + s, [0.32, -1.3, s * 0.2], 0.9, 0.4, vio, 2.4, [1, 0.4, s * 0.5]);
  }
  const torso = K.group('torso', R, 0, 1.95, 0);
  K.add(lump('wpelvis', 0.6, 3, 0.30, 2, 2, 1.1, 0.7, 1.5), 'rough', rock2, [0, 0.05, 0], null, 1, torso, { grime: 0.45, freq: 3 });
  K.add(lump('wchest', 0.95, 7, 0.18, 1.8, 7, 1.0, 1.05, 1.25), 'rough', rockC, [0.05, 1.15, 0], null, 1, torso, { grime: 0.5, freq: 2.5 });
  K.add(lump('wshould', 0.5, 3, 0.34, 2.2, 8, 1, 0.8, 1), 'rough', rock2, [0, 1.7, 1.0], null, 1, torso, { grime: 0.45 });
  K.add(lump('wshould', 0.5, 3, 0.34, 2.2, 8, 1, 0.8, 1), 'rough', rock2, [0, 1.7, -1.0], null, 1, torso, { grime: 0.45 });
  // head: a small boulder with crystal eyes, sunk between the shoulders
  K.add(lump('whead', 0.36, 3, 0.30, 2.5, 9, 1.1, 0.9, 1), 'rough', rockC, [0.3, 2.15, 0], null, 1, torso, { grime: 0.45 });
  for (const s of [-1, 1]) K.add(prism(0.05, 0.14, 0.4), 'glow', hdr(0xe0c0ff, 6), [0.62, 2.15, s * 0.13], [0, 0, -Math.PI / 2], 1, torso);
  // the glowing core in the chest
  K.add(octa(0.22), 'glow', hdr(0xc77dff, 5), [0.9, 1.15, 0], [0.4, 0.4, 0], 1, torso);
  shard(torso, 6, 21, [0.85, 1.15, 0], 1.0, 0.4, 0xd8b8ff, 2, [1, 0.2, 0]);
  shard(torso, 7, 22, [0.0, 2.1, 1.05], 0.9, 0.8, vio, 2.6, [0, 1, 0.5]);
  shard(torso, 7, 23, [0.0, 2.1, -1.05], 0.9, 0.8, vio, 2.6, [0, 1, -0.5]);
  shard(torso, 4, 24, [0.75, 0.6, 0.65], 0.8, 0.45, vio, 2.4, [1, 0, 0.6]);
  shard(torso, 4, 25, [0.75, 0.65, -0.65], 0.8, 0.45, vio, 2.4, [1, 0, -0.6]);
  // the crystal cluster on its back: the weak point
  const crystals = K.group('crystals', torso, -0.85, 1.55, 0);
  shard(crystals, 16, 30, [0, 0.1, 0], 1.3, 1.9, 0xb890ff, 3.6, [-0.6, 1, 0]);
  shard(crystals, 8, 31, [-0.2, 0.0, 0], 1.6, 1.1, 0xe0c8ff, 3, [-1, 0.5, 0]);
  K.add(lump('wbackrock', 0.4, 3, 0.34, 2.5, 4, 0.7, 0.6, 1.2), 'rough', rock2, [0.1, -0.15, 0], null, 1, crystals);
  // arms: shoulder pivots, massive forearms with crystal fists
  for (const s of [-1, 1]) {
    const arm = K.group(s > 0 ? 'armR' : 'armL', torso, 0.05, 1.65, s * 1.25);
    K.add(lump('wupper', 0.38, 3, 0.32, 2.2, 11, 1, 1.5, 1), 'rough', rockC, [0.05, -0.55, 0], null, 1, arm, { grime: 0.45 });
    K.add(lump('wfore', 0.45, 3, 0.32, 2.2, 13, 1, 1.55, 1), 'rough', rock2, [0.2, -1.4, 0], null, 1, arm, { grime: 0.45 });
    K.add(lump('wfist', 0.5, 3, 0.34, 2.2, 15, 1.1, 0.9, 1), 'rough', rockC, [0.3, -2.05, 0], null, 1, arm, { grime: 0.45 });
    shard(arm, 7, 40 + s, [0.55, -2.1, s * 0.15], 1.1, 0.55, 0xb890ff, 2.8, [1, -0.3, s * 0.5]);
    shard(arm, 5, 44 + s, [0.05, -1.25, s * 0.4], 0.8, 0.5, vio, 2.4, [0, 0.2, s]);
    shard(arm, 3, 46 + s, [0.0, -0.1, s * 0.3], 0.8, 0.45, vio, 2.4, [0, 1, s]);
  }
  return K.build();
}
export function warden() {
  const g = make('warden', buildWarden);
  const o = { group: g };
  for (const n of ['torso', 'armL', 'armR', 'legL', 'legR', 'crystals']) o[n] = by(g, n);
  return o;
}

function buildWyrm() {
  const K = new Kit(), R = K.root;
  const skin = 0x2b444c, skin2 = 0x24393f, belly = 0x93aaa2, fin = 0x4f7a80;
  const head = K.group('head', R);
  head.scale.setScalar(1.3);
  K.add(lathe('wyhead', [[0, -1.05], [0.35, -0.95], [0.62, -0.55], [0.7, -0.1], [0.62, 0.35], [0.45, 0.75], [0.2, 0.98], [0, 1.02]], 24), 'gloss', skin, [0, 0, 0], [0, 0, -Math.PI / 2], [1, 0.75, 0.85], head, { grime: 0.45, freq: 3 });
  K.add(lathe('wyjaw', [[0, -0.9], [0.3, -0.75], [0.45, -0.2], [0.35, 0.5], [0.15, 0.85], [0, 0.88]], 18), 'gloss', belly, [0.0, -0.32, 0], [0, 0, -Math.PI / 2], [1, 0.5, 0.75], head, { grime: 0.35 });
  for (let k = 0; k < 9; k++) for (const s of [-1, 1]) {
    K.add(cone(0.035, 0.2, 6), 'gloss', 0xf0eadc, [0.85 - k * 0.12, -0.16, s * (0.32 - k * 0.012)], [0, 0, Math.PI], 1, head);
    K.add(cone(0.03, 0.15, 6), 'gloss', 0xf0eadc, [0.8 - k * 0.12, -0.36, s * (0.28 - k * 0.012)], [0, 0, 0], 1, head);
  }
  for (const s of [-1, 1]) {
    K.add(sph(0.09, 12, 10), 'glow', hdr(0x9fd8e0, 1.4), [0.55, 0.22, s * 0.42], null, [1, 0.8, 0.6], head);
    K.add(cone(0.12, 0.6, 6), 'gloss', 0x1d2e33, [0.2, 0.42, s * 0.36], [s * 0.4, 0, 1.4], [1, 1, 0.6], head);      // brow ridge
    K.add(plate('wyfin', [[0, 0], [-0.9, 0.55], [-1.2, 0.35], [-1.05, 0.0], [-0.6, -0.2]], 0.03), 'skin', fin, [-0.35, -0.05, s * 0.55], [s * 0.9, 0, 0], 1, head, { grime: 0.3, freq: 3 });
    // barbels hanging from the jaw, glowing at the tips
    K.add(tube('wybarb' + s, [[0.5, -0.45, s * 0.25], [0.45, -0.75, s * 0.32], [0.3, -1.0, s * 0.3]], 0.025, 10, 5), 'gloss', 0x3a5a60, null, null, 1, head);
    K.add(sph(0.05, 8, 6), 'glow', hdr(0x40fff0, 4), [0.3, -1.02, s * 0.3], null, 1, head);
  }
  K.add(plate('wycrest', [[0.6, 0], [0.1, 0.5], [-0.5, 0.75], [-1.1, 0.55], [-1.2, 0]], 0.04), 'skin', 0x3e6268, [0, 0.45, 0], null, 1, head, { grime: 0.3 });
  for (let k = 0; k < 4; k++) K.rod('gloss', 0x1d2e33, [0.4 - k * 0.4, 0.45, 0], [0.1 - k * 0.38, 1.1 - k * 0.08, 0], 0.025, head, 5);
  // glowing gills: stacked slits on both sides behind the jaw (one mesh the renderer can pulse)
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) K.add(cap(0.05, 0.46 - k * 0.04, 6), 'glow', hdr(0x40fff0, 4.5), [-0.55 - k * 0.14, -0.05, s * (0.58 - k * 0.01)], [0, 0, 0.25], 1, head, { own: 'gills' });
  // body segments (not parented): long overlapping scaled barrels with a pale belly and a spined fin
  const barrel = lathe('wyseg2', [[0, -1.35], [0.3, -1.32], [0.56, -1.15], [0.72, -0.8], [0.8, -0.2], [0.82, 0.6], [0.86, 0.95], [0.82, 1.15], [0.55, 1.27], [0, 1.3]], 26);
  for (let i = 0; i < 14; i++) {
    const seg = K.group('seg' + i, R, -1.3 - i * 1.15, 0, 0);
    const sc = 1 - i * 0.05;
    K.add(roughen('wyseg2', barrel, 0.02, 4, 3), 'gloss', i % 2 ? skin : skin2, [0, 0, 0], [0, 0, -Math.PI / 2], [sc, sc, sc * 0.92], seg, { grime: 0.4, freq: 3 });
    K.add(cap(0.6, 1.3, 12), 'rough', belly, [0, -0.3 * sc, 0], [0, 0, Math.PI / 2], [sc, sc * 0.55, sc * 0.95], seg, { grime: 0.35 });
    K.add(plate('wydors', [[0.7, 0], [0.3, 0.42], [-0.5, 0.55], [-0.9, 0]], 0.03), 'skin', fin, [0, 0.66 * sc, 0], null, [sc, sc, 1], seg, { grime: 0.3 });
    for (let k = 0; k < 3; k++) K.rod('gloss', 0x1d2e33, [0.4 - k * 0.45, 0.68 * sc, 0], [0.3 - k * 0.45, (0.68 + 0.5) * sc, 0], 0.02, seg, 4);
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) K.add(sph(0.045, 6, 4), 'glow', hdr(0x40fff0, 2.2), [-0.6 + k * 0.6, 0.0, s * 0.8 * sc], null, [1, 0.6, 0.4], seg);
  }
  return K.build();
}
export function wyrm() {
  const g = make('wyrm', buildWyrm);
  return { group: g, head: by(g, 'head'), gills: by(g, 'gills'), segs: Array.from({ length: 14 }, (_, i) => by(g, 'seg' + i)) };
}

function buildHeart() {
  const K = new Kit(), R = K.root;
  const cols = [0x2a2420, 0x221d1a, 0x302823, 0x1c1816];
  const lavaIn = hdr(0xff4a10, 2.4);
  const torso = K.group('torso', R);
  // a molten body under a shell of basalt plates: the glow shows through every gap
  K.add(sph(1, 24, 16), 'glow', lavaIn, [0, 0, 0], null, [3.35, 2.55, 2.0], torso);
  const front = new THREE.Vector3(0, 0.08, 1).normalize();
  plated(K, torso, [0, 0, 0], [3.6, 2.8, 2.2], 110, 3, cols, 0.78, { skip: (d) => d[2] < -0.45 || (d[0] * front.x + d[1] * front.y + d[2] * front.z) > 0.93, key: 'hrp' });
  for (const s of [-1, 1]) {
    K.add(sph(1, 16, 12), 'glow', lavaIn, [s * 3.4, 1.7, -0.2], null, [1.35, 1.15, 1.15], torso);
    plated(K, torso, [s * 3.4, 1.7, -0.2], [1.55, 1.35, 1.35], 34, 7 + s, cols, 0.62, { skip: (d) => d[2] < -0.5, key: 'hrs' });
    for (let k = 0; k < 3; k++) K.add(cone(0.35 - k * 0.06, 1.6 - k * 0.3, 7), 'gloss', 0x1a1614, [s * (3.2 + k * 0.5), 2.9 - k * 0.15, -0.3], [0, 0, -s * (0.35 + k * 0.25)], 1, torso);
  }
  // the chest cavity: jagged rock teeth around the pulsing core
  for (let k = 0; k < 9; k++) {
    const a = k / 9 * Math.PI * 2, d = new THREE.Vector3(Math.cos(a), Math.sin(a), 0.7).normalize();
    const qq = new THREE.Quaternion().setFromUnitVectors(_up, d), ee = new THREE.Euler().setFromQuaternion(qq);
    K.add(cone(0.24, 0.9, 6), 'gloss', 0x171311, [Math.cos(a) * 0.95, 0.2 + Math.sin(a) * 0.95, 1.85], [ee.x, ee.y, ee.z], 1, torso);
  }
  K.add(sph(0.9, 18, 12), 'glow', hdr(0xff6a18, 2.6), [0, 0.2, 1.55], null, [1, 1, 0.6], torso);
  K.add(dode(0.6), 'core', 0xffffff, [0, 0.2, 1.95], [0.3, 0.5, 0], 1, torso, { own: 'core' });
  // the head: plated, horned, with burning eye slits and a molten mouth
  const head = K.group('head', R, 0, 3.0, 0.4);
  K.add(sph(1, 16, 12), 'glow', lavaIn, [0, 0, 0], null, [0.95, 0.85, 0.85], head);
  plated(K, head, [0, 0, 0], [1.05, 0.95, 0.95], 30, 11, cols, 0.42, { skip: (d) => d[2] < -0.6 || (d[2] > 0.6 && Math.abs(d[1] + 0.05) < 0.38 && Math.abs(d[0]) < 0.55), key: 'hrh' });
  for (const s of [-1, 1]) {
    K.add(cone(0.32, 1.7, 7), 'gloss', 0x171311, [s * 0.8, 0.85, -0.15], [0.2, 0, -s * 0.75], 1, head);
    K.add(box(0.42, 0.09, 0.1), 'glow', hdr(0xffc040, 7), [s * 0.36, 0.14, 0.98], [0, 0, s * -0.28], 1, head);
  }
  K.add(box(0.75, 0.16, 0.12), 'glow', hdr(0xff5a14, 4.5), [0, -0.36, 0.95], null, 1, head);
  for (let k = 0; k < 6; k++) { K.add(cone(0.06, 0.22, 5), 'gloss', 0x171311, [-0.32 + k * 0.13, -0.27, 1.0], [0, 0, Math.PI], 1, head); K.add(cone(0.05, 0.18, 5), 'gloss', 0x171311, [-0.28 + k * 0.12, -0.46, 1.0], null, 1, head); }
  // two huge fists: separate groups, positioned by the renderer
  for (const s of [-1, 1]) {
    const fist = K.group(s > 0 ? 'fistR' : 'fistL', R, s * 5, -2, 1.0);
    K.add(sph(1, 16, 12), 'glow', lavaIn, [0, 0, 0], null, [1.0, 0.82, 0.9], fist);
    plated(K, fist, [0, 0, 0], [1.15, 0.95, 1.05], 34, 20 + s, cols, 0.48, { skip: (d) => d[2] < -0.6, key: 'hrf' });
    for (let k = 0; k < 4; k++) K.add(lump('hrknuck', 0.36, 3, 0.25, 3, 20 + k, 1, 1, 1), 'gloss', 0x2a2420, [(k - 1.5) * 0.48, 0.4, 0.9], null, 1, fist, { grime: 0.45 });
    K.add(lump('hrthumb', 0.4, 3, 0.25, 3, 25, 1.4, 0.8, 0.9), 'gloss', 0x26201c, [-s * 0.95, -0.1, 0.55], null, 1, fist);
    // the forearm rising toward the shoulder
    K.add(sph(1, 12, 10), 'glow', lavaIn, [-s * 0.1, 1.6, -0.4], [0, 0, s * 0.3], [0.6, 1.5, 0.6], fist);
    plated(K, fist, [-s * 0.1, 1.6, -0.4], [0.78, 1.7, 0.78], 26, 30 + s, cols, 0.5, { skip: (d) => d[2] < -0.6, key: 'hra' });
  }
  return K.build();
}
export function heart() {
  const g = make('heart', buildHeart);
  // the core pulses on its own: give each copy its own core material
  const core = by(g, 'core');
  if (core) core.material = MATS.core.clone();
  return { group: g, torso: by(g, 'torso'), core, fistL: by(g, 'fistL'), fistR: by(g, 'fistR'), head: by(g, 'head') };
}
