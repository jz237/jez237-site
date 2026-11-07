// Shock Horror models: the miner's gear, the things in the dark (creatures, five horrors that rule each depth,
// figures and faces for the scares), pickups, cursed relics and grim scenery, all built from code (no files to load).
// Every rigid part is merged per moving joint into one mesh per shared material, with its colour (and a little grime)
// carried per vertex, so the whole game uses a handful of materials and shader programs. Each model is built once;
// later calls return cheap clones that share geometry.
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
  rough: std({ vertexColors: true, roughness: 0.86, metalness: 0, normalMap: GRAIN, normalScale: new THREE.Vector2(0.6, 0.6) }),          // cloth, leather, wood, rock, bone, stone
  gloss: std({ vertexColors: true, roughness: 0.34, metalness: 0, normalMap: GRAIN, normalScale: new THREE.Vector2(0.35, 0.35) }),        // dead waxy skin, chitin, wet rock, oiled leather
  metal: std({ vertexColors: true, roughness: 0.4, metalness: 0.85, normalMap: GRAIN, normalScale: new THREE.Vector2(0.25, 0.25) }),      // iron, steel, tin, worn brass
  polish: std({ vertexColors: true, roughness: 0.2, metalness: 1, emissive: 0x1a1000 }),                                                     // gold, polished brass, bright steel edges
  skin: std({ vertexColors: true, roughness: 0.62, metalness: 0, side: THREE.DoubleSide }),                                                 // membranes, gowns, rags, paper
  glow: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),                                                            // HDR glowing details (colour > 1)
  lens: std({ color: 0x1c1408, roughness: 0.1, metalness: 0, emissive: 0xffe0b0, emissiveIntensity: 7 }),                                 // the helmet lamp lens
  core: std({ color: 0x1a0202, roughness: 0.3, metalness: 0, emissive: 0xff1a0e, emissiveIntensity: 5 }),                                  // the Red Heart's open chamber
  crystal: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.82, emissive: 0x08040c }),
  gem: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.03, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02, emissive: 0x050505, specularIntensity: 1 }),
  ghost: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
  // ---- Shock Horror additions (4 materials)
  wet: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, normalMap: GRAIN, normalScale: new THREE.Vector2(0.3, 0.3), side: THREE.DoubleSide }), // wet blood, raw flesh, eyeballs, slick hair, porcelain
  murk: std({ vertexColors: true, roughness: 0.75, metalness: 0, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }),                     // ghost hair, veils, lace: dark and see-through, lit
  shadow: new THREE.MeshBasicMaterial({ color: 0x000000 }),                                                                                                        // pure black silhouettes (no lighting)
  ember: std({ color: 0x120400, roughness: 0.5, metalness: 0, emissive: 0xff7424, emissiveIntensity: 3 }),                                                         // burning sockets / embers (pulsable emissive)
  glass: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),   // clear old glass (jars, reliquaries, watch glass)
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
const NOCOL = new Set(['lens', 'core', 'ember', 'shadow']), UNLIT = new Set(['glow', 'ghost', 'lens', 'core', 'ember', 'shadow']);
class Kit {
  constructor() { this.root = new THREE.Group(); this.buckets = new Map(); this.shadow = true; this.pre = null; }
  group(name, parent = this.root, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.name = name || ''; g.position.set(x, y, z); parent.add(g); return g; }
  // run fn() with every part it adds placed inside an extra transform (nested sub-assemblies: heads, hands)
  at(p, r, s, fn) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(p ? p[0] : 0, p ? p[1] : 0, p ? p[2] : 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0)),
      typeof s === 'number' ? new THREE.Vector3(s, s, s) : new THREE.Vector3(s[0], s[1], s[2]));
    const prev = this.pre; this.pre = prev ? prev.clone().multiply(m) : m;
    try { fn(); } finally { this.pre = prev; }
    return this;
  }
  // add(geometry, material key, colour, [x,y,z], [rx,ry,rz], scale (number or [x,y,z]), parent, { own: 'name' (a separate named mesh), grime: 0..1, freq })
  // a geometry with its own 'color' attribute is multiplied by the part colour (per-vertex painting)
  add(g, mat, col, p = null, r = null, s = 1, parent = this.root, o = {}) {
    _p.set(p ? p[0] : 0, p ? p[1] : 0, p ? p[2] : 0);
    _q.setFromEuler(_e.set(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0));
    if (typeof s === 'number') _s.set(s, s, s); else _s.set(s[0], s[1], s[2]);
    const m = new THREE.Matrix4().compose(_p, _q, _s);
    if (this.pre) m.premultiply(this.pre);
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
      const g = mergeParts(b.list, !NOCOL.has(b.mat));
      const mesh = new THREE.Mesh(g, MATS[b.mat]);
      mesh.name = b.own;
      const lit = !UNLIT.has(b.mat);
      mesh.castShadow = this.shadow && lit && b.mat !== 'crystal' && b.mat !== 'murk' && b.mat !== 'glass'; mesh.receiveShadow = lit;
      if (b.mat === 'murk') mesh.renderOrder = 2; else if (b.mat === 'glass') mesh.renderOrder = 1;   // dark see-through hair draws over additive ghost light
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
      for (const name of ['position', 'normal', 'uv', 'color']) {
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
      const C = it.col, pa = q.attributes.position.array, f = it.freq, vc = q.attributes.color;
      for (let k = 0; k < c; k++) {
        let s = 1;
        if (it.grime) { const x = pa[k * 3], y = pa[k * 3 + 1], z = pa[k * 3 + 2]; s = 1 - it.grime + it.grime * 2 * fbm(x * f + 11, y * f, z * f + 3) * 0.9; }
        if (it.fade) { const t = Math.min(1, Math.max(0, (pa[k * 3 + 1] - it.fade[0]) / (it.fade[1] - it.fade[0]))); s *= t * t * (3 - 2 * t); }
        let r = C.r * s, g = C.g * s, bb = C.b * s;
        if (vc) { r *= vc.getX(k); g *= vc.getY(k); bb *= vc.getZ(k); }
        col[(o + k) * 3] = r; col[(o + k) * 3 + 1] = g; col[(o + k) * 3 + 2] = bb;
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

// ================================================================== THE HORROR KIT
// Organic parts made from numbers: tapered tubes (limbs, fingers, bones, veins), ribbons (hair, rags), sculpted
// spheres with per-vertex paint (faces, skulls, flesh), draped cloth (gowns, coats), split meshes (jaws).
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const gss = (x, y, cx, cy, sx, sy) => Math.exp(-((x - cx) * (x - cx)) / (sx * sx) - ((y - cy) * (y - cy)) / (sy * sy));
const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const _tc = new THREE.Color();
const mixC = (c, hex, t) => (t > 0 ? c.lerp(_tc.set(hex), Math.min(1, t)) : c);
function interp(arr, t) {
  if (arr.length === 1) return arr[0];
  const f = Math.min(0.99999, Math.max(0, t)) * (arr.length - 1), i = Math.floor(f), u = f - i, w = u * u * (3 - 2 * u);
  return arr[i] + (arr[i + 1] - arr[i]) * w;
}
function finishGeo(pos, uv, idx, col) {
  const g0 = new THREE.BufferGeometry();
  g0.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g0.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (col) g0.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g0.setIndex(idx);
  const g = g0.toNonIndexed(); g0.dispose();
  smoothNormals(g);
  g.computeBoundingSphere();
  return g;
}
// a tube through points whose radius follows `rad` (number, [r...] spread along the length, or fn(t)).
// o: segs, radial, sx/sy (cross-section scale), ref ([x,y,z]: the cross-section's sx axis leans toward ref),
// noise/nf (lumpy surface), fn(t, a) (radius multiplier: ribs, knuckles), cap (0 = open ends), key (needed when rad or fn is a function)
function ttube(pts, rad, o = {}) {
  const segs = o.segs || 16, radial = o.radial || 8, sx = o.sx || 1, sy = o.sy || 1;
  const key = 'T' + (o.key || '') + JSON.stringify([pts, typeof rad === 'function' ? 0 : rad, segs, radial, sx, sy, o.noise || 0, o.nf || 0, o.ref || 0, o.cap ?? 1, o.seed || 0]);
  return geo(key, () => {
    const curve = new THREE.CatmullRomCurve3(pts.map(V3), false, 'centripetal');
    const fr = o.ref ? null : curve.computeFrenetFrames(segs, false);
    const ref = o.ref ? V3(o.ref).normalize() : null;
    const R = (t) => (typeof rad === 'number' ? rad : typeof rad === 'function' ? rad(t) : interp(rad, t));
    const len = curve.getLength(), rings = [];
    const T = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs, P = curve.getPointAt(t);
      curve.getTangentAt(t, T);
      let N, B;
      if (ref) { N = ref.clone().addScaledVector(T, -ref.dot(T)); if (N.lengthSq() < 1e-6) N.set(T.y, -T.x, 0.3); N.normalize(); B = new THREE.Vector3().crossVectors(T, N); }
      else { N = fr.normals[i].clone(); B = fr.binormals[i].clone(); }
      rings.push({ P, N, B, r: R(t), t, T: T.clone() });
    }
    if (o.cap !== 0) {
      const a = rings[0], b = rings[rings.length - 1];
      rings.unshift({ ...a, P: a.P.clone().addScaledVector(a.T, -a.r * 0.42), r: a.r * 0.62 }); rings.unshift({ ...a, P: a.P.clone().addScaledVector(a.T, -a.r * 0.62), r: 0 });
      rings.push({ ...b, P: b.P.clone().addScaledVector(b.T, b.r * 0.42), r: b.r * 0.62 }); rings.push({ ...b, P: b.P.clone().addScaledVector(b.T, b.r * 0.62), r: 0 });
    }
    const pos = [], uv = [], idx = [], Q = new THREE.Vector3(), D = new THREE.Vector3();
    const avgR = Math.max(1e-4, rings.reduce((s, q) => s + q.r, 0) / rings.length);
    rings.forEach((g, i) => {
      for (let j = 0; j <= radial; j++) {
        const a = (j % radial) / radial * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
        D.copy(g.N).multiplyScalar(ca * sx).addScaledVector(g.B, sa * sy);
        let r = g.r * (o.fn ? o.fn(g.t, a) : 1);
        Q.copy(g.P).addScaledVector(D, r);
        if (o.noise && r > 0) { const k = (fbm(Q.x * o.nf + 7 + (o.seed || 0), Q.y * o.nf, Q.z * o.nf - 3) - 0.5) * 2 * o.noise * g.r; Q.addScaledVector(D.normalize(), k); }
        pos.push(Q.x, Q.y, Q.z); uv.push(j / radial, g.t * len / (6.283 * avgR));
      }
      if (i > 0) { const a0 = (i - 1) * (radial + 1), a1 = i * (radial + 1); for (let j = 0; j < radial; j++) idx.push(a0 + j, a0 + j + 1, a1 + j, a0 + j + 1, a1 + j + 1, a1 + j); }
    });
    return finishGeo(pos, uv, idx);
  });
}
// a cupped strip along points (hair locks, rag strips): width w (number tapering to 30 %, or [w...]); nrm = the way the strip faces
function ribbon(pts, w, o = {}) {
  const segs = o.segs || 12;
  return geo('R' + JSON.stringify([pts, w, segs, o.nrm || 0, o.cup ?? 0.3]), () => {
    const curve = new THREE.CatmullRomCurve3(pts.map(V3), false, 'centripetal');
    const nrm = o.nrm ? V3(o.nrm).normalize() : new THREE.Vector3(0, 0, 1);
    const pos = [], uv = [], idx = [], T = new THREE.Vector3(), S = new THREE.Vector3(), F = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs, P = curve.getPointAt(t); curve.getTangentAt(t, T);
      S.crossVectors(T, nrm); if (S.lengthSq() < 1e-8) S.set(1, 0, 0); S.normalize();
      F.crossVectors(S, T).normalize();
      const W = (typeof w === 'number' ? w * (1 - t * 0.7) : interp(w, t)) / 2;
      pos.push(P.x - S.x * W, P.y - S.y * W, P.z - S.z * W);
      pos.push(P.x + F.x * W * (o.cup ?? 0.3), P.y + F.y * W * (o.cup ?? 0.3), P.z + F.z * W * (o.cup ?? 0.3));
      pos.push(P.x + S.x * W, P.y + S.y * W, P.z + S.z * W);
      uv.push(0, t * 4, 0.5, t * 4, 1, t * 4);
      if (i > 0) { const a = (i - 1) * 3, b = i * 3; idx.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2); }
    }
    return finishGeo(pos, uv, idx);
  });
}
// reshape a (cached) geometry vertex by vertex: fn(v, c) moves v and paints c (both start as the original position / white)
function sculpt(key, base, fn) {
  return geo('S' + key, () => {
    const g = base.index ? base.toNonIndexed() : base.clone();
    const p = g.attributes.position, n = p.count, col = new Float32Array(n * 3), v = new THREE.Vector3(), c = new THREE.Color();
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(p, i); c.setRGB(1, 1, 1); fn(v, c); p.setXYZ(i, v.x, v.y, v.z); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    smoothNormals(g); g.computeBoundingSphere();
    return g;
  });
}
// cut a non-indexed geometry (position + uv) along fn(p) = 0: returns [part where fn >= 0, part where fn < 0]
function clipGeo(g, fn) {
  const P = g.attributes.position, U = g.attributes.uv, out = [{ p: [], u: [] }, { p: [], u: [] }];
  const v = [0, 1, 2].map(() => new THREE.Vector3()), uv = [0, 1, 2].map(() => new THREE.Vector2()), f = [0, 0, 0];
  const push = (T, a, ua) => { for (let k = 0; k < 3; k++) { T.p.push(a[k].x, a[k].y, a[k].z); T.u.push(ua[k].x, ua[k].y); } };
  for (let i = 0; i < P.count; i += 3) {
    for (let k = 0; k < 3; k++) { v[k].fromBufferAttribute(P, i + k); if (U) uv[k].fromBufferAttribute(U, i + k); else uv[k].set(0, 0); f[k] = fn(v[k]); }
    const s0 = f[0] >= 0, s1 = f[1] >= 0, s2 = f[2] >= 0;
    if (s0 === s1 && s1 === s2) { push(out[s0 ? 0 : 1], v, uv); continue; }
    const a = s0 === s1 ? 2 : s0 === s2 ? 1 : 0, b = (a + 1) % 3, c = (a + 2) % 3;
    const tb = f[a] / (f[a] - f[b]), tc = f[a] / (f[a] - f[c]);
    const pb = v[a].clone().lerp(v[b], tb), pc = v[a].clone().lerp(v[c], tc), ub = uv[a].clone().lerp(uv[b], tb), uc = uv[a].clone().lerp(uv[c], tc);
    const lone = out[f[a] >= 0 ? 0 : 1], rest = out[f[a] >= 0 ? 1 : 0];
    push(lone, [v[a], pb, pc], [uv[a], ub, uc]);
    push(rest, [pb, v[b], v[c]], [ub, uv[b], uv[c]]); push(rest, [pb, v[c], pc], [ub, uv[c], uc]);
  }
  return out.map((T) => { const q = new THREE.BufferGeometry(); q.setAttribute('position', new THREE.Float32BufferAttribute(T.p, 3)); q.setAttribute('uv', new THREE.Float32BufferAttribute(T.u, 2)); return q; });
}
// [outside, inside] where inside = every field >= 0
function clipAll(g, fields) {
  let inside = g; const outs = [];
  for (const fn of fields) { const [a, b] = clipGeo(inside, fn); outs.push(b); inside = a; }
  const np = outs.reduce((n, q) => n + q.attributes.position.array.length, 0), P = new Float32Array(np), U = new Float32Array(np / 3 * 2);
  let op = 0, ou = 0;
  for (const q of outs) { P.set(q.attributes.position.array, op); op += q.attributes.position.array.length; U.set(q.attributes.uv.array, ou); ou += q.attributes.uv.array.length; }
  const rest = new THREE.BufferGeometry(); rest.setAttribute('position', new THREE.BufferAttribute(P, 3)); rest.setAttribute('uv', new THREE.BufferAttribute(U, 2));
  return [rest, inside];
}
// split a non-indexed geometry in two by triangle centroid (pred(c) true -> second part): jaws, lids
function split(key, g, pred) {
  return geo('Z' + key, () => {
    const p = g.attributes.position, names = Object.keys(g.attributes), A = {}, B = {}, c = new THREE.Vector3();
    for (const nm of names) { A[nm] = []; B[nm] = []; }
    for (let i = 0; i < p.count; i += 3) {
      c.set((p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3, (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3);
      const T = pred(c) ? B : A;
      for (const nm of names) { const at = g.attributes[nm], s = at.itemSize; for (let k = 0; k < 3; k++) for (let j = 0; j < s; j++) T[nm].push(at.array[(i + k) * s + j]); }
    }
    return [A, B].map((T) => { const q = new THREE.BufferGeometry(); for (const nm of names) q.setAttribute(nm, new THREE.Float32BufferAttribute(T[nm], g.attributes[nm].itemSize)); q.computeBoundingSphere(); return q; });
  });
}
// cloth hanging round the Y axis from a [radius, y] profile (top first): folds deepen downward, a torn hem, an open front
// o: rings, n, sx/sz (ellipse), folds, fk (fold count), tatter (0..1 of the length), open (radians, centred on +X), seed, flare
function drape(key, prof, o = {}) {
  return geo('D' + key, () => {
    const rings = o.rings || 26, n = o.n || 44, sx = o.sx ?? 1, sz = o.sz ?? 1, open = o.open || 0, seed = o.seed || 1;
    const spline = new THREE.SplineCurve(prof.map(([r, y]) => new THREE.Vector2(r, y)));
    const a0 = open / 2, al = Math.PI * 2 - open, top = prof[0][1];
    const hem = (a) => { const ca = Math.cos(a), sa = Math.sin(a); return Math.min(1, 0.3 * Math.abs(Math.sin(a * 13 + seed)) * fbm(ca * 5 + seed, sa * 5, 2) + 0.95 * sstep(0.42, 0.78, fbm(ca * 2.4 + seed * 3.1, sa * 2.4, 1.7 + seed))); };
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= rings; i++) {
      const t = i / rings, q = spline.getPoint(t);
      for (let j = 0; j <= n; j++) {
        const a = a0 + (open ? j / n : (j % n) / n) * al, ca = Math.cos(a), sa = Math.sin(a);
        const fold = (o.folds || 0) * (0.25 + t) * (0.62 * Math.sin(a * (o.fk || 9) + seed * 1.7 + t * 2.1) + 0.38 * (fbm(ca * 2 + seed, sa * 2, t * 3) - 0.5) * 2);
        const y = o.tatter ? top + (q.y - top) * (1 - o.tatter * hem(a) * t * t) : q.y;
        const rr = q.x * (1 + fold) * (1 + (o.flare || 0) * t * t * (fbm(ca * 3, sa * 3, seed) - 0.3));
        pos.push(ca * rr * sx, y, sa * rr * sz); uv.push(j / n * 6, t * 4);
      }
      if (i > 0) { const A = (i - 1) * (n + 1), B = i * (n + 1); for (let j = 0; j < n; j++) idx.push(A + j, A + j + 1, B + j, A + j + 1, B + j + 1, B + j); }
    }
    return finishGeo(pos, uv, idx);
  });
}
// paint an existing geometry (no movement): fn(p, c)
const paint = (key, base, fn) => sculpt(key, base, (v, c) => fn(v, c));
// per figure type: own copies of the materials (so a whole figure type can be faded without touching the rest)
function ownMats(root) { const m = new Map(); root.traverse((o) => { if (o.isMesh) { if (!m.has(o.material)) m.set(o.material, o.material.clone()); o.material = m.get(o.material); } }); return root; }
const matsOf = (g) => { const s = new Set(); g.traverse((o) => { if (o.isMesh) s.add(o.material); }); return [...s]; };
const named = (g, names) => { const o = { group: g, mats: matsOf(g) }; for (const n of names) o[n] = by(g, n); return o; };

// ------------------------------------------------------------------ horror palette (sRGB hex)
const H = {
  dead: 0x99a2a8, deadBlue: 0x93a0ab, deadGrey: 0x7f8484, ghoul: 0x7d8576, bruise: 0x4c3a48, vein: 0x45526e, lip: 0x5f4b55,
  blood: 0x4a0606, bloodDry: 0x2a0806, bloodWet: 0x6a0408, flesh: 0x6e1512, fleshLt: 0xa3473c, fat: 0xc9a46c, tendon: 0xc8b4a0,
  bone: 0xaa9c7e, boneDk: 0x7a6c52, ivory: 0xc4b89c, tooth: 0xd6c9a2, toothDk: 0x9a8a62, rust: 0x5a3220, rustDk: 0x34201a,
  hair: 0x0b0a0a, gown: 0xaaa496, gownDk: 0x7a7266, rag: 0x5a5244, coat: 0x1b1a1c, wax: 0xb8ad8e, waxDk: 0x8a7e5c,
  stone: 0x6f6c68, stoneDk: 0x3c3a38, wood: 0x4a3a2a, silk: 0xa8a69c, rot: 0x4a4a2c,
};
const EYE_COLD = hdr(0xdfe8ff, 9), EYE_SICK = hdr(0xffe060, 8), EYE_RED = hdr(0xff3020, 7);
// ------------------------------------------------------------------ faces and skulls
// A head is a unit sphere (face toward +Z, x right, y up) pushed into shape and painted per vertex. Placed at scale s
// (0.1 = a life-size adult head). o: skin, lip, sock (socket depth), dark (socket blackness), nose (+ a nose, - a skull's
// cavity), gaunt, bloat, mouthW, mouthY, mouthH, open (0..1 gape), gape (vertical size of the gape), lipless, blood (tear
// tracks), rot, veins, skull, porcelain, rough, lumps, brow, chin, wide, long, seed
const EYX = 0.38, EYY = 0.08;   // eye socket centres (unit head directions)
// head profiles, bottom (chin) to crown in 11 steps: half-width, half-depth in front, half-depth behind (skull variants *S)
const HRX = [0.12, 0.42, 0.62, 0.71, 0.77, 0.79, 0.8, 0.77, 0.68, 0.5, 0.08], HRZF = [0.3, 0.56, 0.7, 0.76, 0.79, 0.8, 0.8, 0.78, 0.7, 0.52, 0.08], HRZB = [0.2, 0.38, 0.55, 0.74, 0.88, 0.95, 0.97, 0.93, 0.8, 0.56, 0.08];
const HRXS = [0.1, 0.34, 0.52, 0.6, 0.69, 0.77, 0.79, 0.77, 0.68, 0.5, 0.08], HRZFS = [0.34, 0.6, 0.72, 0.76, 0.76, 0.78, 0.8, 0.78, 0.7, 0.52, 0.08];
function crv(arr, t) { // Catmull-Rom through equally spaced samples
  const f = Math.min(0.99999, Math.max(0, t)) * (arr.length - 1), i = Math.floor(f), u = f - i;
  const p0 = arr[Math.max(0, i - 1)], p1 = arr[i], p2 = arr[i + 1], p3 = arr[Math.min(arr.length - 1, i + 2)];
  return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
}
function headShape(o) {
  const seed = o.seed || 0, sk = !!o.skull;
  const skin = new THREE.Color(o.skin ?? H.dead);
  const sock = o.sock ?? (sk ? 0.42 : 0.24), nose = o.nose ?? (sk ? -0.3 : 0.22), gaunt = o.gaunt ?? 0.6, bloat = o.bloat || 0;
  const mw = o.mouthW ?? 0.24, my = o.mouthY ?? -0.5, mh = o.mouthH ?? 0.03, open = o.open || 0;
  const W = o.wide ?? (sk ? 0.74 : 0.78), L = o.long ?? 1.04, mv = mh + open * (o.gape ?? 0.3);
  return (d, out) => {
    const x = d.x, y = d.y, z = d.z, ax = Math.abs(x), sx = x < 0 ? -1 : 1;
    const F = sstep(0.12, 0.62, z);
    // ---- the form: a cranium fuller behind and above, a flat-fronted face, a jaw with corners, temples
    const ht = (y + 1) / 2, ph = Math.atan2(x, z), sp = Math.sin(ph), cp = Math.cos(ph);
    const rzf = crv(sk ? HRZFS : HRZF, ht), rzb = crv(HRZB, ht), rz = cp > 0 ? rzf : rzb;
    let px = sp * crv(sk ? HRXS : HRX, ht) * W / 0.78, py = y * L + 0.04 * sstep(0.3, 1, y), pz = cp * rz;
    px -= sx * (sk ? 0.07 : 0.03) * gss(ax, y, 0.86, 0.24, 0.12, 0.18);
    let dz = 0;
    dz += (o.brow ?? 0.07) * gss(ax, y, EYX - 0.03, 0.26, 0.2, 0.05) * F + 0.035 * gss(x, y, 0, 0.23, 0.08, 0.06) * F;
    dz -= 0.1 * sstep(0.34, 0.95, y) * F;
    const so = gss(ax, y, EYX, EYY, 0.15, 0.115) * F;
    dz -= sock * so;
    let nc = 0, nos = 0;
    if (nose > 0) {
      const bridge = Math.exp(-(x * x) / 0.0028) * sstep(0.24, 0.1, y) * sstep(-0.24, -0.08, y) * (0.25 + 0.75 * sstep(0.18, -0.13, y));
      const tip = gss(x, y, 0, -0.155, 0.068, 0.055), wings = gss(ax, y, 0.072, -0.19, 0.045, 0.036);
      nos = gss(ax, y, 0.045, -0.215, 0.02, 0.012) * F;
      dz += nose * (bridge + 1.05 * tip + 0.5 * wings) * F - nose * 0.6 * nos;
      dz -= nose * 0.2 * gss(x, y, 0, -0.27, 0.06, 0.03) * F;
    } else if (nose < 0) { nc = gss(x, y * 0.8, 0, -0.13, 0.06, 0.08) * F; dz += nose * nc * 1.3; }
    const cb = gss(ax, y, 0.47, -0.04, 0.14, 0.08);
    px += sx * (sk ? 0.07 : 0.05) * cb; dz += 0.05 * cb * F;
    const hc = gss(ax, y, 0.4, -0.37, 0.14, 0.15);
    px -= sx * gaunt * 0.07 * hc; dz -= gaunt * 0.06 * hc * F;
    if (bloat) { const bb = gss(ax, y, 0.42, -0.3, 0.3, 0.32); px += sx * bloat * 0.12 * bb; dz += bloat * 0.06 * bb * F; px *= 1 + bloat * 0.06; pz *= 1 + bloat * 0.04; }
    const xl = 0.1 + Math.min(1, Math.max(0, (-0.2 - y) / 0.3)) * 0.17;
    const fold = o.noMouth || sk ? 0 : Math.exp(-((ax - xl) ** 2) / 0.0012) * sstep(-0.16, -0.24, y) * sstep(-0.62, -0.5, y) * F;
    dz -= 0.022 * fold * (0.5 + gaunt);
    const ex = x / mw, ey = (y - my) / mv, e = ex * ex + ey * ey;
    let mo = 0, lipW = 0, crease = 0;
    if (o.noMouth) { /* a smooth face */ }
    else if (open > 0) { mo = sstep(1.0, 0.5, e) * F; dz -= mo * (0.5 + 0.3 * open); if (!o.lipless) { lipW = Math.exp(-((Math.sqrt(e) - 1.03) ** 2) / 0.012) * F; dz += 0.035 * lipW; } }
    else {
      crease = Math.exp(-((y - my) ** 2) / 0.0005) * sstep(1.05, 0.8, Math.abs(ex)) * F; dz -= 0.03 * crease;
      if (!o.lipless) { lipW = Math.min(1, gss(x, y, 0, my + 0.035, mw * 0.8, 0.028) + gss(x, y, 0, my - 0.048, mw * 0.68, 0.034)) * F; dz += 0.045 * lipW; }
    }
    dz += (o.chin ?? 0.07) * gss(x, y, 0, -0.88, 0.17, 0.09) * F;
    if (!open) dz -= 0.03 * gss(x, y, 0, -0.73, 0.15, 0.04) * F;
    pz += dz;
    const nn = (o.rough ? (fbm(x * 5 + seed, y * 5, z * 5) - 0.5) * 2 * o.rough : 0) + (o.lumps ? (fbm(x * 2.2 + seed * 3, y * 2.2, z * 2.2) - 0.45) * o.lumps : 0) + (o.wrinkle ?? 0.008) * (fbm(x * 18 + seed, y * 18, z * 18) - 0.5);
    px += x * nn; py += y * nn; pz += z * nn;
    d.set(px, py, pz);
    // ---- paint
    out.copy(skin).multiplyScalar(0.8 + 0.36 * fbm(x * 2.6 + seed, y * 2.6, z * 2.6));
    if (o.veins) { const v = fbm(x * 7 + seed, y * 7 + 3, z * 7); mixC(out, H.vein, Math.pow(1 - Math.abs(v - 0.5) * 2, 14) * o.veins); }
    if (o.rot) { const pa = sstep(0.5, 0.66, fbm(x * 3.5 + seed + 9, y * 3.5, z * 3.5)) * o.rot; mixC(out, H.rot, pa * 0.85); if (pa > 0.6) mixC(out, 0x140c08, sstep(0.72, 0.92, fbm(x * 9, y * 9 + seed, z * 9))); }
    if (sk) { mixC(out, 0x2a2016, Math.pow(1 - Math.abs(fbm(x * 6 + 2, y * 6, z * 6 + seed) - 0.5) * 2, 30) * sstep(0.2, 0.6, y) * 0.9); mixC(out, 0x5a4a30, sstep(0.1, 0.6, so + hc * 0.6 + nc) * 0.6); }
    if (o.porcelain) { const cr = Math.pow(1 - Math.abs(fbm(x * 4.5 + seed, y * 4.5, z * 4.5) - 0.5) * 2, 22); mixC(out, 0xd28a86, gss(ax, y, 0.48, -0.2, 0.15, 0.12) * F * 0.55); mixC(out, 0x140e0a, sstep(0.3, 0.62, cr) * o.porcelain); }
    if (!sk && !o.porcelain) {
      mixC(out, o.bruise ?? H.bruise, (sstep(0.06, 0.32, so) * 0.6 + gss(ax, y, EYX, EYY - 0.15, 0.14, 0.05) * 0.45) * F);
      mixC(out, 0x4a3a3c, fold * 0.45 + hc * F * gaunt * 0.25);
    }
    mixC(out, 0x040303, sstep(0.3, 0.75, so) * (o.dark ?? 0.95));
    if (nos) mixC(out, 0x0a0505, sstep(0.2, 0.8, nos));
    if (nc) mixC(out, 0x070504, sstep(0.25, 0.75, nc));
    if (crease) mixC(out, 0x140808, crease * 0.85);
    if (lipW) mixC(out, o.lip ?? H.lip, lipW * 0.8);
    if (mo) { mixC(out, o.mouthCol ?? 0x2a0808, sstep(0.0, 0.3, mo)); mixC(out, 0x050101, sstep(0.45, 0.95, mo)); }
    if (o.blood) {
      for (const s of [-1, 1]) {
        const bx = s * EYX + 0.02 * Math.sin(y * 23 + s * 2 + seed), len = o.blood * (0.55 + 0.25 * hash3(s + 3, seed, 1));
        mixC(out, H.blood, sstep(0.05, 0.018, Math.abs(x - bx)) * sstep(0.06, 0.0, y) * sstep(-0.04 - len, 0.02 - len, y) * F * 0.95);
      }
      for (let k = 0; k < 4; k++) {
        const bx = (k - 1.5) * mw * 0.5 + 0.02 * Math.sin(y * 19 + k), y0 = my - mv * 0.85, len = o.blood * (0.25 + 0.45 * hash3(k, seed, 5));
        mixC(out, H.blood, sstep(0.045, 0.014, Math.abs(x - bx)) * sstep(y0 + 0.04, y0, y) * sstep(y0 - len - 0.05, y0 - len, y) * F * 0.95);
      }
    }
  };
}
const _hc = new THREE.Color();
function headKit(key, o, w = 56, h = 40) {
  const f = headShape(o);
  const g = sculpt('head' + key, sph(1, w, h), (v, c) => { v.normalize(); f(v, c); });
  const pt = (x, y, z, push = 0) => { const d = new THREE.Vector3(x, y, z).normalize(), n = d.clone(); f(d, _hc); return d.addScaledVector(n, push); };
  const surf = (x, y, push = 0) => pt(x, y, Math.sqrt(Math.max(0.0001, 1 - x * x - y * y)), push);
  return { g, f, pt, surf, o, w, h };
}
const TOOTH = () => geo('toothShape', () => { const g = new THREE.CapsuleGeometry(0.5, 1, 3, 8); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), k = y > 0 ? 1 - 0.38 * Math.min(1, y) : 1 - 0.12 * Math.min(1, -y); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k * (y < 0 ? 0.85 : 1)); } g.computeVertexNormals(); return g; });
// a row of teeth along the mouth (unit head coords). dir -1: upper row (pointing down), +1: lower row
function addTeeth(K, parent, hk, o) {
  const n = o.n ?? 12, w = o.w ?? 0.2, dir = o.dir ?? -1, size = o.size ?? 1, r = rng(o.seed ?? 3), needle = !!o.needle;
  for (let i = 0; i < n; i++) {
    if (r() < (o.gap ?? 0.1)) continue;
    const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1, x = u * w, y = o.y + u * u * (o.curve ?? 0.05) * -dir;
    const c = hk.surf(Math.max(-0.95, Math.min(0.95, x)), y, -(o.inset ?? 0.02));
    const tw = (needle ? 0.026 : 0.065 - Math.abs(u) * 0.012) * size, th = (needle ? 0.15 : 0.085 + (1 - Math.abs(u)) * 0.025) * size * (0.75 + r() * 0.5);
    const col = new THREE.Color(o.col ?? H.tooth).lerp(_tc.set(o.colDk ?? H.toothDk), r() * 0.7);
    if (r() < (o.black ?? 0.08)) col.multiplyScalar(0.25);
    const yaw = -Math.asin(Math.max(-0.9, Math.min(0.9, x))) * 0.8;
    if (needle) K.add(cone(tw, th, 5), o.mat || 'gloss', col, [c.x, c.y + dir * th * 0.42, c.z], [(dir < 0 ? Math.PI : 0) + (r() - 0.5) * 0.35 + dir * 0.2, yaw, (r() - 0.5) * 0.3], 1, parent, { grime: 0.15 });
    else K.add(o.lo ? box(tw, th, tw * 0.75) : TOOTH(), o.mat || 'gloss', col, [c.x, c.y + dir * th * 0.38, c.z - 0.012 * size], [(r() - 0.5) * 0.25 - dir * 0.15 + (dir > 0 ? Math.PI : 0), yaw, (r() - 0.5) * 0.22], o.lo ? 1 : [tw, th / 2, tw * 0.72], parent, { grime: 0.2, freq: 60 });
  }
}
// long hair from the scalp (unit head coords): front = share that falls as a curtain over the face, len = length in head units
function addHair(K, parent, hk, o = {}) {
  const n = o.n ?? 40, len = o.len ?? 6, front = o.front ?? 0.5, mat = o.mat || 'wet', col = new THREE.Color(o.col ?? H.hair), r = rng(o.seed ?? 5);
  const wide = o.wide ?? 0.2, back = o.back ?? 1, hang = new THREE.Vector3(...(o.down || [0, -1, 0])).normalize();
  for (let i = 0; i < n; i++) {
    const cur = r() < front;
    const az = cur ? (r() - 0.5) * 1.9 : r() * Math.PI * 2, pol = cur ? 0.25 + r() * 0.45 : 0.15 + r() * 1.05;
    const dir = new THREE.Vector3(Math.sin(pol) * Math.sin(az), Math.cos(pol), Math.sin(pol) * Math.cos(az));
    if (!cur && dir.z > 0.35 && dir.y < 0.75) { dir.z = 0.2; dir.y = 0.75; dir.normalize(); }
    const root = hk.pt(dir.x, dir.y, dir.z, -0.02), up = hk.pt(dir.x, dir.y, dir.z, 0.12);
    const L = len * (0.75 + r() * 0.4), j = () => (r() - 0.5) * 0.2;
    const at = (p, t) => p.clone().addScaledVector(hang, L * t);
    let pts;
    if (cur) {
      const fx = root.x * 1.05 + j();
      pts = [root, up, new THREE.Vector3(fx, 0.55, 1.0 + j() * 0.5), new THREE.Vector3(fx * 1.05, -0.3, 1.17 + j()), new THREE.Vector3(fx * 1.1 + j(), -1.3, 1.25 + j()), at(new THREE.Vector3(fx * 1.15 + j(), -1.3, 1.3 + j()), 0.55), at(new THREE.Vector3(fx * 1.2 + j() * 2, -1.3, 1.25 + j()), 0.85)];
    } else {
      const h = new THREE.Vector3(dir.x, 0, dir.z).normalize();
      if (h.z > 0.15) h.set(h.x < 0 ? -0.96 : 0.96, 0, 0.28).normalize();
      const side = h.z < -0.3 ? -1 : 1, sy = h.z < -0.3 ? 1 : 0.6;
      const p2 = h.clone().multiplyScalar(1.12).setY(root.y * 0.4);
      const p3 = h.clone().multiplyScalar(1.22).setY(-0.9);
      const p4 = new THREE.Vector3(h.x * 1.3 * sy + j(), -1.6, h.z < -0.3 ? h.z * 1.3 - 0.4 : (Math.abs(h.x) > 0.6 ? h.z * 1.2 + 0.25 * side * back : h.z * 1.3));
      if (Math.abs(h.x) > 0.6 && h.z > -0.3) p4.x = Math.sign(h.x) * 1.15;
      pts = [root, up, p2, p3, p4, at(p4.clone().add(new THREE.Vector3(j(), 0, j())), 0.55), at(p4.clone().add(new THREE.Vector3(j() * 2, 0, j() * 2)), 0.85)];
    }
    const a = pts.map((p) => [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)]);
    const nrm = cur ? [0, 0.15, 1] : [dir.x, 0, dir.z];
    const w = wide * (0.6 + r() * 0.6);
    K.add(ribbon(a, [w * 0.5, w, w * 1.1, w * 0.9, w * 0.5, w * 0.12], { segs: 18, nrm }), mat, col.clone().multiplyScalar(0.7 + r() * 0.6), null, null, 1, parent, { grime: 0.3, freq: 30 });
    if (i % 2 === 0) K.add(ttube(a.map((q, k) => k > 1 ? [q[0] + (r() - 0.5) * 0.12, q[1], q[2] + (r() - 0.5) * 0.12] : q), [0.016, 0.02, 0.016, 0.006], { segs: 14, radial: 3, cap: 0 }), mat, col, null, null, 1, parent, { grime: 0 });
  }
}
// add a head kit to a pivot: p = centre, yaw = which way the face turns in the parent (PI/2 = +X), rot = pose inside the head
// eyes: 'pin' (glowing pinpricks deep in black sockets), 'milk' (clouded wet eyes), 'none'
function addHead(K, parent, hk, p, yaw, rot, s, o = {}) {
  K.at(p, [0, yaw, 0], 1, () => K.at(null, rot, s, () => {
    K.add(hk.g, o.mat || 'gloss', 0xffffff, null, null, 1, parent, { grime: o.grime ?? 0.12, freq: o.freq ?? 40 });
    for (const sd of [-1, 1]) {
      const c = hk.surf(sd * EYX, EYY);
      if (o.eyes === 'milk') K.add(sph(0.11, 12, 8), 'wet', o.milk ?? 0xb9c2bc, [c.x, c.y, c.z + 0.02], null, [1, 0.85, 0.75], parent, { grime: 0.1 });
      else if (o.eyes !== 'none') K.add(sph(1, 8, 6), o.eyeMat || 'glow', o.eyeCol || EYE_COLD, [c.x * 0.97, c.y, c.z + 0.05], null, o.pin ?? 0.085, parent, o.eyeOwn ? { own: o.eyeOwn } : {});
    }
    if (o.ears) for (const sd of [-1, 1]) { const c = hk.pt(sd, 0.02, -0.12); K.add(lump('ear', 0.16, 1, 0.3, 4, 3, 0.4, 1, 0.75), o.mat || 'gloss', o.earCol ?? hk.o.skin ?? H.dead, [c.x, c.y, c.z], [0, sd * 0.3, 0], 1, parent, { grime: 0.2 }); }
    if (o.fn) o.fn();
  }));
}
// skulls: a dense one for close looks and a light one for piles
const SKULL = { skull: true, skin: H.bone, sock: 0.42, dark: 1, nose: -0.3, gaunt: 1.5, mouthW: 0.22, mouthY: -0.5, lipless: true, brow: 0.08, chin: 0.07, rough: 0.012 };
const skullKit = (hi) => (hi ? headKit('skullHi', SKULL, 64, 48) : headKit('skullLo', SKULL, 30, 22));
function addSkull(K, parent, p, r, s, o = {}) {
  const hk = skullKit(o.hi);
  K.at(p, r, s, () => {
    K.add(hk.g, o.mat || 'rough', o.col ?? 0xffffff, null, null, 1, parent, { grime: o.grime ?? 0.3, freq: o.freq ?? 30 });
    addTeeth(K, parent, hk, { y: -0.48, w: 0.18, n: o.hi ? 10 : 6, dir: -1, size: 0.85, seed: o.seed ?? 4, gap: 0.12, lo: !o.hi, mat: o.mat || 'rough' });
    if (o.jaw !== false) addTeeth(K, parent, hk, { y: -0.53, w: 0.16, n: o.hi ? 9 : 5, dir: 1, size: 0.75, seed: (o.seed ?? 4) + 9, gap: 0.15, lo: !o.hi, mat: o.mat || 'rough' });
    if (o.eyes) for (const sd of [-1, 1]) { const c = hk.surf(sd * EYX, EYY); K.add(sph(1, 8, 6), o.eyeMat || 'glow', o.eyes, [c.x, c.y, c.z + 0.03], null, o.pin ?? 0.06, parent, o.eyeOwn ? { own: o.eyeOwn } : {}); }
  });
}
// a long bone with knobbed ends along +Y (len metres, r shaft radius)
const longBone = (len, r, bend = 0.04) => ttube([[0, 0, 0], [bend * len, len * 0.5, 0], [0, len, 0]], [r * 2.1, r * 1.5, r * 1.02, r, r * 1.05, r * 1.6, r * 2.3], { segs: 14, radial: 8, noise: 0.08, nf: 30 / Math.max(0.05, len) });
function addBone(K, parent, a, b, r, col = H.bone, mat = 'rough') {
  const A = V3(a), B = V3(b), d = B.clone().sub(A), L = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(_up, d.normalize()), e = new THREE.Euler().setFromQuaternion(q);
  K.add(longBone(+L.toFixed(2), +r.toFixed(3)), mat, col, a, [e.x, e.y, e.z], 1, parent, { grime: 0.35, freq: 20 });
}
// a hand: wrist at the origin, fingers along -Y, palm facing +Z, thumb toward +X.
// o: long (finger length x), curl (radians per joint), spread, thin, col, mat, nail. fingers: 5 pivots (index..pinky, thumb) to build into
function addHand(K, parent, o = {}, fingers = null) {
  const long = o.long ?? 1.35, curl = o.curl ?? 0.22, thin = o.thin ?? 0.9, col = o.col ?? H.dead, mat = o.mat || 'gloss', nail = o.nail ?? 0x4a4236, lo = !!o.lo;
  K.add(lump('palm', 0.05, lo ? 1 : 2, 0.1, 5, 2, 0.92, 1.0, 0.3), mat, col, [0, -0.052, 0.002], null, [thin, 1, 1], parent, { grime: 0.2, freq: 40 });
  const fx = [0.031, 0.0105, -0.0105, -0.031], fl = [0.09, 0.1, 0.094, 0.075];
  for (let i = 0; i < 5; i++) {
    const th = i === 4, L = (th ? 0.075 : fl[i]) * long;
    const base = th ? [0.036 * thin, -0.03, 0.012] : [fx[i] * thin, -0.098, 0.0];
    const pv = fingers ? fingers[i] : null;
    const org = pv ? base : [0, 0, 0];
    // finger path: three joints, each bending toward the palm (+Z)
    let d = th ? new THREE.Vector3(0.75, -0.65, 0.35).normalize() : new THREE.Vector3((i - 1.5) * -(o.spread ?? 0.08), -1, 0).normalize();
    const pts = [[base[0] - org[0], base[1] - org[1], base[2] - org[2]]], segL = th ? [0.4, 0.33, 0.27] : [0.44, 0.31, 0.25];
    let P = V3(pts[0]);
    for (let k = 0; k < 3; k++) {
      const c = curl * (o.curls ? o.curls[k] : 1) * (th ? 0.6 : 1);
      d.applyAxisAngle(th ? new THREE.Vector3(-0.6, -0.8, 0) : new THREE.Vector3(-1, 0, 0), k === 0 ? c * 0.5 : c);
      const mid = P.clone().addScaledVector(d, L * segL[k] * 0.5); P = P.clone().addScaledVector(d, L * segL[k]);
      pts.push(mid.toArray().map((v) => +v.toFixed(4)), P.toArray().map((v) => +v.toFixed(4)));
    }
    const R0 = (th ? 0.0105 : 0.0084) * Math.sqrt(thin);
    const rads = [R0 * 1.12, R0 * 1.0, R0 * 1.06, R0 * 0.9, R0 * 0.96, R0 * 0.8, R0 * 0.62];
    const grp = pv || parent;
    K.add(ttube(pts, rads, lo ? { segs: 8, radial: 5 } : { segs: 14, radial: 7 }), mat, col, null, null, 1, grp, { grime: 0.25, freq: 70 });
    if (o.nails === false) continue;
    const tip = V3(pts[pts.length - 1]), q = new THREE.Quaternion().setFromUnitVectors(_up, d.clone().negate()), e = new THREE.Euler().setFromQuaternion(q);
    K.add(rbox(R0 * 1.4, R0 * 2.2, R0 * 0.5, R0 * 0.2), 'gloss', nail, tip.clone().addScaledVector(d, -R0 * 0.9).add(new THREE.Vector3(0, 0, -R0 * 0.75)).toArray(), [e.x, e.y, e.z], 1, grp, { grime: 0.3 });
    if (!th && !lo) K.rod(mat, new THREE.Color(col).multiplyScalar(0.92), [fx[i] * thin * 0.4, -0.012, -0.012], [fx[i] * thin, -0.09, -0.013], 0.0032, parent, 5);   // tendons
  }
}
const scaleArr = (a, k) => a.map((v) => +(v * k).toFixed(4));
// ------------------------------------------------------------------ a thin human body facing +X, feet at y = 0
// o: H (height), wd (girth), skin, mat, ribs (how bony), arms ({len, elbow, rot: [L, R], hand}), legs (false = none), feet,
//    head (headKit), hs (head scale), headRot, legBend. Returns the pivots; clothing is added by the caller.
function figure(K, root, o = {}) {
  const ls = (o.H ?? 1.7) / 1.7, wd = o.wd ?? 1, skin = o.skin ?? H.dead, mat = o.mat || 'gloss', ribs = o.ribs ?? 0.6;
  const hipY = 0.92 * ls, tl = 0.56 * ls, sh = 0.175 * wd;
  const torso = K.group('torso', root, 0, hipY, 0);
  const tk = `${ls.toFixed(2)},${wd},${ribs},${o.chest ?? 1}`;
  K.add(ttube([[0, -0.07, 0], [0, tl * 0.3, 0], [0.005, tl * 0.62, 0], [-0.005, tl * 0.9, 0], [0.005, tl * 1.0, 0]], scaleArr([0.13, 0.112, 0.112, 0.13 * (o.chest ?? 1), 0.14, 0.12, 0.055], wd), {
    segs: 26, radial: 20, sx: 0.6, ref: [1, 0, 0], key: 'torso' + tk,
    fn: (t, a) => {
      const ca = Math.cos(a);
      let k = 1;
      if (t > 0.42 && t < 0.84) k += ribs * 0.045 * Math.pow(Math.max(0, Math.sin((t - 0.42) / 0.42 * Math.PI * 6.5)), 3) * sstep(-0.6, 0.2, ca);
      if (t > 0.12 && t < 0.44) k -= ribs * 0.1 * Math.max(0, ca) * Math.sin((t - 0.12) / 0.32 * Math.PI);
      k -= 0.04 * Math.exp(-((a - Math.PI) ** 2) / 0.05);
      k += 0.06 * ribs * (Math.exp(-((a - Math.PI + 0.55) ** 2) / 0.08) + Math.exp(-((a - Math.PI - 0.55) ** 2) / 0.08)) * Math.exp(-((t - 0.8) ** 2) / 0.01);
      return k;
    },
  }), mat, skin, null, null, 1, torso, { grime: 0.18, freq: 18 });
  for (const s of [-1, 1]) {
    K.add(sph(0.05 * wd, 12, 8), mat, skin, [-0.005, tl * 0.88, s * sh * 0.86], null, [0.95, 0.85, 1.05], torso);
    K.rod(mat, skin, [0.055 * wd, tl * 0.93, s * 0.02], [0.02, tl * 0.92, s * sh * 0.85], 0.011 * wd, torso, 6);
  }
  K.add(ttube([[0, tl * 0.9, 0], [0.012, tl + 0.06 * ls, 0], [0.024, tl + 0.13 * ls, 0]], scaleArr([0.044, 0.036, 0.034], wd), { segs: 6, radial: 12 }), mat, skin, null, null, 1, torso);
  K.rod(mat, new THREE.Color(skin).multiplyScalar(0.85), [0.03, tl * 0.93, 0.01], [0.02, tl + 0.1 * ls, 0.03], 0.008 * wd, torso, 5);
  // head
  const head = K.group('head', torso, 0.02, tl + 0.09 * ls, 0);
  const hs = o.hs ?? 0.1;
  if (o.head) addHead(K, head, o.head, [0.012, hs * 1.0, 0], Math.PI / 2, o.headRot || [0, 0, 0], hs, o.headOpts || {});
  // arms
  const A = o.arms || {}, al = (A.len ?? 1) * ls;
  for (const s of [-1, 1]) {
    const arm = K.group(s > 0 ? 'armR' : 'armL', torso, 0, tl * 0.87, s * sh);
    const rot = A.rot ? A.rot[s > 0 ? 1 : 0] : null;
    if (rot) arm.rotation.set(rot[0], rot[1], rot[2]);
    const eb = A.elbow ? A.elbow[s > 0 ? 1 : 0] : 0.12;
    const elbow = [0.0, -0.29 * al, 0.004 * s], fd = [Math.sin(eb), -Math.cos(eb)], wrist = [elbow[0] + fd[0] * 0.27 * al, elbow[1] + fd[1] * 0.27 * al, elbow[2]];
    const mid = (a, b, f) => a.map((v, i) => +(v + (b[i] - v) * f).toFixed(4));
    K.add(ttube([[0, 0.02, 0], mid([0, 0, 0], elbow, 0.5), elbow, mid(elbow, wrist, 0.45), wrist], scaleArr([0.046, 0.04, 0.033, 0.036, 0.032, 0.026, 0.021], wd), { segs: 22, radial: 10, noise: 0.05, nf: 40 }), o.armMat || mat, o.armCol ?? skin, null, null, 1, arm, { grime: 0.2, freq: 20 });
    K.add(sph(0.02 * wd, 8, 6), o.armMat || mat, o.armCol ?? skin, [elbow[0] - 0.02, elbow[1], elbow[2]], null, [1, 1.3, 1], arm);
    const ha = Math.atan2(fd[0], -fd[1]);
    K.at(wrist, [0, 0, ha], [1, 1, -s], () => addHand(K, arm, { long: A.long ?? 1.35, curl: A.curl ?? 0.22, col: skin, mat, thin: 0.9 * wd, nails: A.nails, lo: A.lo }));
  }
  // legs
  if (o.legs !== false) for (const s of [-1, 1]) {
    const leg = K.group(s > 0 ? 'legR' : 'legL', torso, 0, -0.03, s * 0.088 * wd);
    const kb = o.legBend ?? 0.05, floor = -(hipY - 0.03);
    const knee = [0.035 + kb * 0.3, -0.43 * ls, 0], ankle = [knee[0] - Math.sin(kb) * 0.4 * ls - 0.02, floor + 0.07, 0];
    K.add(ttube([[0, 0.03, 0], [0.025, -0.2 * ls, 0], knee, [(knee[0] + ankle[0]) / 2 - 0.01, (knee[1] + ankle[1]) / 2, 0], ankle], scaleArr([0.075, 0.062, 0.044, 0.05, 0.043, 0.032, 0.027], wd), { segs: 22, radial: 10, noise: 0.04, nf: 30 }), o.legMat || mat, o.legCol ?? skin, null, null, 1, leg, { grime: 0.2, freq: 20 });
    if (o.feet !== false) {
      const fp = o.footPitch ?? 0;
      K.at([ankle[0], floor, 0], [0, 0, -fp], 1, () => {
        const fm = o.footCol !== undefined && mat !== 'shadow' ? 'gloss' : mat, fc = o.footCol ?? skin;
        K.add(lump('foot', 0.06, 2, 0.12, 5, 7, 1.15, 0.45, 0.55), fm, fc, [0.045, 0.03, 0], null, [wd, 1, wd], leg, { grime: 0.3, freq: 30 });
        if (o.footCol === undefined) for (let k = 0; k < 5; k++) K.add(cap(0.0075 - k * 0.0006, 0.018, 6), mat, skin, [0.115 - k * 0.006, 0.011, (k - 2) * 0.012 * s * wd], [0, 0, -Math.PI / 2 - 0.2], 1, leg);
      });
    }
  }
  return { torso, head, armL: by(root, 'armL'), armR: by(root, 'armR'), legL: by(root, 'legL'), legR: by(root, 'legR'), tl, ls, wd, sh, hipY };
}
// a human ribcage + spine around the origin (spine along +Y, chest toward +X), s = overall scale
function addRibcage(K, parent, s = 1, col = H.bone, mat = 'rough', o = {}) {
  for (let k = 0; k < 14; k++) K.add(lump('vert', 0.022, 1, 0.3, 6, k % 4, 1.1, 0.75, 1.3), mat, col, [-0.06 * s, (-0.18 + k * 0.035) * s, 0], null, s, parent, { grime: 0.35 });
  for (let k = 0; k < (o.n ?? 10); k++) {
    const y = (0.24 - k * 0.032) * s, w = (0.1 + Math.sin(Math.min(1, (k + 2) / 7) * Math.PI * 0.5) * 0.045) * s * (k > 7 ? 0.9 : 1), dy = -0.05 * s;
    for (const sd of [-1, 1]) {
      const pts = [[-0.06 * s, y, 0], [-0.06 * s, y + 0.01 * s, sd * w * 0.55], [0.0, y + dy * 0.5, sd * w * 1.0], [0.07 * s, y + dy, sd * w * 0.8], [k < 7 ? 0.1 * s : 0.08 * s, y + dy * 1.25 + (k < 7 ? 0.01 : 0.03) * s, sd * (k < 7 ? 0.02 : 0.05) * s]];
      K.add(ttube(pts.map((p) => p.map((v) => +v.toFixed(4))), [0.007 * s, 0.009 * s, 0.008 * s, 0.006 * s], { segs: 14, radial: 5, sx: 0.55, ref: [0, 1, 0] }), mat, col, null, null, 1, parent, { grime: 0.35, freq: 25 });
    }
  }
  K.add(rbox(0.03 * s, 0.17 * s, 0.035 * s, 0.01 * s), mat, col, [0.1 * s, 0.16 * s, 0], [0, 0, -0.12], 1, parent, { grime: 0.35 });
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
      pts.push([mx * (1 - notch) - 0.05 * chord, my * (1 - notch) - 0.02 * span]);
      if (rag) for (let k = 0; k < rag; k++) { const f = (k + 1) / (rag + 1); pts.push([(tx + (nx - tx) * f) * chord * (0.84 + r() * 0.1), (ty + (ny - ty) * f) * span * (0.8 + r() * 0.14)]); }
    }
  }
  pts.push([-0.35 * chord, 0.12 * span], [-0.2 * chord, 0]);
  return { pts, tips: tips.map(([x, y]) => [x * chord, y * span]) };
}
// a leathery wing in the x/z plane, out toward +z (s = 1) or -z (s = -1): membrane, jointed finger bones, a clawed thumb
// (or a little human hand when o.hand), veins
function addWing(K, parent, span, chord, s, colM, colB, boneR, key, rag = 0, o = {}) {
  const { pts, tips } = wingOutline(span, chord, 0.18, rag);
  K.add(plate('wing' + key, pts, boneR * 0.3), 'skin', colM, [0, 0, 0], [s > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0], 1, parent, { grime: 0.35, freq: 4 / chord });
  const wrist = [0.15 * chord, boneR * 0.6, s * 0.4 * span];
  K.add(ttube([[0, 0, 0], [0.1 * chord, boneR * 1.5, s * 0.2 * span], wrist], [boneR * 2, boneR * 1.4, boneR * 1.25, boneR * 1.8], { segs: 10, radial: 7 }), 'gloss', colB, null, null, 1, parent, { grime: 0.3 });
  tips.forEach(([tx, ty], i) => {
    const kn = [wrist[0] + (tx - wrist[0]) * 0.45, boneR * 0.8, wrist[2] + (s * ty - wrist[2]) * 0.45];
    K.add(ttube([wrist, kn, [tx, 0, s * ty]].map((p) => p.map((v) => +v.toFixed(4))), [boneR * 1.1, boneR * 0.9, boneR * 1.15, boneR * 0.75, boneR * 0.8, boneR * 0.4], { segs: 12, radial: 6 }), 'gloss', colB, null, null, 1, parent, { grime: 0.3 });
    // veins fanning into the membrane between the fingers
    if (o.veins !== false && i < tips.length - 1) {
      const [ux, uy] = tips[i + 1];
      for (let k = 0; k < 2; k++) {
        const f = 0.35 + k * 0.3, a = [wrist[0] + (tx - wrist[0]) * f, 0, wrist[2] + (s * ty - wrist[2]) * f], b = [a[0] + (ux - tx) * 0.35 - chord * 0.05, 0, a[2] + s * (uy - ty) * 0.35];
        K.add(ttube([a, [(a[0] + b[0]) / 2 + chord * 0.02, 0, (a[2] + b[2]) / 2], b].map((p) => p.map((v) => +v.toFixed(4))), boneR * 0.28, { segs: 6, radial: 4 }), 'gloss', o.vein ?? 0x5a2a30, null, null, 1, parent, { grime: 0 });
      }
    }
  });
  if (o.hand) K.at([wrist[0] + boneR * 2, boneR, wrist[2]], [0, 0, Math.PI * 0.55], o.hand, () => addHand(K, parent, { long: 1.6, curl: 0.5, col: colB, lo: true }));
  else K.add(cone(boneR * 1.5, boneR * 7, 6), 'gloss', 0x2a2420, [wrist[0] + boneR * 3, boneR, wrist[2]], [0, 0, -Math.PI / 2], 1, parent);
}
// ---- SHRIEKER: a pale, hairless bat-thing with a human face full of needles
function buildBat() {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R);
  const sk = 0x988c88, skD = 0x6e5e58;
  K.add(ttube([[-0.1, -0.012, 0], [-0.045, 0.0, 0], [0.025, 0.008, 0], [0.072, 0.012, 0]], [0.018, 0.038, 0.048, 0.044, 0.026], {
    segs: 16, radial: 12, sx: 0.85, ref: [0, 1, 0], key: 'shrBody',
    fn: (t, a) => 1 + (t > 0.38 && t < 0.82 ? 0.09 * Math.pow(Math.max(0, Math.sin((t - 0.38) / 0.44 * Math.PI * 5)), 3) * sstep(-0.5, 0.3, Math.sin(a + 1.6)) : 0) - 0.05 * Math.exp(-((a - Math.PI) ** 2) / 0.06),
  }), 'gloss', sk, null, null, 1, body, { grime: 0.3, freq: 50 });
  for (let k = 0; k < 9; k++) K.add(sph(0.0065, 6, 4), 'gloss', 0xcabdb4, [0.05 - k * 0.017, 0.044 - Math.abs(k - 3) * 0.003, 0], null, [1.2, 0.8, 1], body);   // spine knuckles
  const hk = headKit('shrieker', { skin: sk, sock: 0.22, gaunt: 1.1, open: 0.75, mouthW: 0.44, mouthY: -0.42, gape: 0.34, lip: 0x5a3a3e, nose: 0.05, veins: 0.5, wide: 0.9, long: 0.95, mouthCol: 0x3a0a0c }, 40, 30);
  addHead(K, body, hk, [0.105, 0.03, 0], Math.PI / 2, [-0.2, 0, 0], 0.047, {
    pin: 0.13, eyeCol: EYE_COLD, fn: () => {
      addTeeth(K, body, hk, { y: -0.42 + 0.24, w: 0.38, n: 13, dir: -1, needle: true, size: 0.9, seed: 3, gap: 0.05, col: 0xe8e2d4 });
      addTeeth(K, body, hk, { y: -0.42 - 0.26, w: 0.33, n: 12, dir: 1, needle: true, size: 0.85, seed: 8, gap: 0.05, col: 0xe8e2d4 });
      for (const sd of [-1, 1]) K.add(cone(0.32, 1.1, 6), 'skin', skD, [sd * 0.62, 0.78, -0.2], [-0.25, 0, -sd * 0.45], [1, 1, 0.3], body);   // ears
    },
  });
  for (const s of [-1, 1]) {
    // thin human-like hind legs with long toes
    K.add(ttube([[-0.075, -0.02, s * 0.022], [-0.11, -0.05, s * 0.034], [-0.135, -0.075, s * 0.03]], [0.009, 0.006, 0.0045], { segs: 8, radial: 6 }), 'gloss', sk, null, null, 1, body);
    for (let k = 0; k < 3; k++) K.add(ttube([[-0.135, -0.075, s * 0.03], [-0.14, -0.092, s * (0.024 + k * 0.007)], [-0.13, -0.104, s * (0.02 + k * 0.01)]], [0.0028, 0.0022, 0.0012], { segs: 6, radial: 4 }), 'gloss', 0x3a302c, null, null, 1, body);
  }
  const wingR = K.group('wingR', R, 0.025, 0.025, 0.04), wingL = K.group('wingL', R, 0.025, 0.025, -0.04);
  addWing(K, wingR, 0.44, 0.26, 1, 0x86726c, 0xcfc3b4, 0.0048, 'shr', 2, { vein: 0x5a3036 });
  addWing(K, wingL, 0.44, 0.26, -1, 0x86726c, 0xcfc3b4, 0.0048, 'shr', 2, { vein: 0x5a3036 });
  return K.build();
}
export function bat() { const g = make('bat', buildBat); return { group: g, wingL: by(g, 'wingL'), wingR: by(g, 'wingR'), body: by(g, 'body') }; }

// ---- CRAWLER: a low corpse-beetle. Its shell is a cage of fused ribs over grey skin; its six legs are human arms.
function buildCrawler() {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R, 0, 0.24, 0);
  const skin = 0x6c706a, ribC = 0xa89a78;
  K.add(lump('crawlSkin', 0.2, 3, 0.12, 3.5, 4, 1.6, 0.68, 1.12), 'gloss', skin, [-0.12, 0.0, 0], null, 1, body, { grime: 0.45, freq: 14 });
  K.add(lump('crawlBelly', 0.16, 2, 0.14, 4, 6, 1.7, 0.45, 1.0), 'wet', 0x5a2a26, [-0.1, -0.08, 0], null, 1, body, { grime: 0.4, freq: 20 });   // raw underside
  // the rib cage carapace: arches from side to side, fused down the middle by a spine
  for (let k = 0; k < 10; k++) {
    const x = 0.19 - k * 0.056, h = 0.14 * Math.sin(Math.min(1, (k + 1.5) / 5) * Math.PI * 0.5) * (k > 6 ? 1 - (k - 6) * 0.12 : 1), w = 0.2 * (k > 6 ? 1 - (k - 6) * 0.1 : 1);
    const pts = [[x - 0.01, -0.06, -w], [x, h * 0.75, -w * 0.62], [x + 0.01, h + 0.012, 0], [x, h * 0.75, w * 0.62], [x - 0.01, -0.06, w]].map((p) => p.map((v) => +v.toFixed(4)));
    K.add(ttube(pts, [0.008, 0.012, 0.015, 0.012, 0.008], { segs: 16, radial: 6, sx: 0.6, ref: [1, 0, 0] }), 'rough', ribC, null, null, 1, body, { grime: 0.45, freq: 25 });
    K.add(lump('vert', 0.022, 1, 0.3, 6, k % 4, 1.1, 0.75, 1.3), 'rough', ribC, [x, h + 0.02, 0], null, 1.1, body, { grime: 0.4 });
  }
  // rags of an old shirt caught in the ribs at the back
  const rr = rng(44);
  for (let k = 0; k < 7; k++) { const z = (rr() - 0.5) * 0.34, x = -0.3 - rr() * 0.12; K.add(ribbon([[x, 0.05, z], [x - 0.05, -0.05, z * 1.1], [x - 0.08, -0.16, z * 1.15], [x - 0.07, -0.22, z * 1.2]], 0.05 + rr() * 0.04, { segs: 6, nrm: [-0.3, 0, z > 0 ? 1 : -1] }), 'skin', H.rag, null, null, 1, body, { grime: 0.5, freq: 30 }); }
  // the head: a grey human face held low and forward, mouth hanging open
  const hk = headKit('crawlerHead', { skin: 0x70746d, open: 0.55, gape: 0.26, mouthW: 0.3, gaunt: 1.1, rot: 0.45, sock: 0.21, lip: 0x4a3c40, veins: 0.4, seed: 7 }, 40, 30);
  addHead(K, body, hk, [0.3, -0.03, 0], Math.PI / 2, [-0.35, 0, 0.12], 0.072, {
    pin: 0.1, eyeCol: EYE_SICK, fn: () => {
      addTeeth(K, body, hk, { y: -0.5 + 0.26, w: 0.24, n: 9, dir: -1, seed: 12, gap: 0.2, black: 0.25 });
      addTeeth(K, body, hk, { y: -0.5 - 0.27, w: 0.22, n: 8, dir: 1, seed: 13, gap: 0.25, black: 0.25 });
    },
  });
  // six legs: each a bony human arm, shoulder at the body's side, elbow high, the hand flat on the floor
  const hipX = [0.13, 0.0, -0.13];
  for (let i = 0; i < 6; i++) {
    const s = i % 2 ? 1 : -1, x = hipX[Math.floor(i / 2)];
    const leg = K.group('leg' + i, R, x, 0.2, s * 0.12);
    const off = x > 0 ? 0.07 : x < 0 ? -0.07 : 0;
    const elbow = [x * 0.25 + 0.02, 0.13, s * 0.22], wrist = [x * 0.5 + off, -0.165, s * 0.33];
    K.add(sph(0.032, 8, 6), 'gloss', skin, [0, 0, 0], null, 1, leg);
    K.add(ttube([[0, 0, 0], [elbow[0] * 0.5, elbow[1] * 0.9, elbow[2] * 0.5], elbow, [(elbow[0] + wrist[0]) / 2, 0.0, (elbow[2] + wrist[2]) / 2], wrist].map((p) => p.map((v) => +v.toFixed(4))), [0.026, 0.021, 0.017, 0.021, 0.016, 0.0135], { segs: 16, radial: 8, noise: 0.08, nf: 40 }), 'gloss', skin, null, null, 1, leg, { grime: 0.35, freq: 30 });
    K.add(sph(0.013, 6, 4), 'rough', ribC, elbow, null, [1, 1.2, 1], leg);
    const yaw = Math.atan2(off * 1.6, 1) * s;
    K.at(wrist, [0, -yaw, 0], 1, () => K.at(null, [-s * Math.PI / 2 + s * 0.25, 0, 0], [0.8, 0.8, -0.8 * s], () => addHand(K, leg, { long: 1.5, curl: 0.42, col: skin, lo: true, thin: 0.85 })));
  }
  return K.build();
}
export function crawler() { const g = make('crawler', buildCrawler); return { group: g, body: by(g, 'body'), legs: [0, 1, 2, 3, 4, 5].map((i) => by(g, 'leg' + i)) }; }

// ---- PALE ONE: a drifting ghost woman, hair hanging over her face, a torn white gown thinning into wisps
function buildShade() {
  const K = new Kit(), R = K.root; K.shadow = false;
  // centred on the origin: head at the top (y ~ +0.62), the gown's wisps trail to y ~ -1.0
  const gown = [[0.12, 0.42], [0.2, 0.36], [0.19, 0.18], [0.2, 0.0], [0.25, -0.3], [0.31, -0.6], [0.36, -0.86]];
  K.add(drape('pale1', gown, { folds: 0.14, fk: 7, tatter: 0.32, sx: 0.72, seed: 3, n: 40 }), 'ghost', hdr(0x9fbce4, 0.5), [0, 0, 0], null, 1, R, { own: 'shadeOuter', fade: [-0.95, 0.35] });
  K.add(drape('pale2', gown.map(([r, y]) => [r * 0.7, y * 0.9 + 0.03]), { folds: 0.1, fk: 5, tatter: 0.2, sx: 0.72, seed: 7, n: 28 }), 'ghost', hdr(0xc8dcff, 0.34), [0, 0, 0], [0, 0.4, 0], 1, R, { own: 'shadeInner', fade: [-0.7, 0.5] });
  const r = rng(91);
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2, x = Math.cos(a) * 0.25, z = Math.sin(a) * 0.22, len = 0.25 + r() * 0.4;
    K.add(ribbon([[x, -0.5, z], [x * 1.15 - 0.05, -0.72, z * 1.1], [x * 1.1 - 0.15 - r() * 0.1, -0.7 - len * 0.6, z * 1.2], [x - 0.25 - r() * 0.1, -0.72 - len, z * 1.25]], 0.06 + r() * 0.05, { segs: 10, nrm: [Math.cos(a), 0, Math.sin(a)] }), 'ghost', hdr(0x88a8d8, 0.4), null, null, 1, R, { own: 'shadeRibbons', fade: [-1.25, -0.45] });
  }
  // the body under the gown: shoulders, a thin neck, the head bowed and turned a little toward us
  const skinG = hdr(0xd8e6ff, 0.75);
  K.add(ttube([[0, 0.36, 0], [0.01, 0.46, 0], [0.025, 0.52, 0]], [0.036, 0.03, 0.03], { segs: 6, radial: 10 }), 'ghost', skinG, null, null, 1, R, { own: 'shadeRibbons' });
  const hk = headKit('paleOne', { skin: 0xc8d2dc, sock: 0.2, gaunt: 0.9, open: 0.3, gape: 0.16, mouthW: 0.2, nose: 0.1, veins: 0.3, seed: 2 }, 40, 30);
  addHead(K, R, hk, [0.035, 0.615, 0], Math.PI / 2, [0.28, -0.45, 0.06], 0.098, {
    mat: 'ghost', grime: 0, pin: 0.075, eyeCol: hdr(0xe6f0ff, 12), fn: () => addHair(K, R, hk, { n: 64, len: 4.6, front: 0.58, mat: 'murk', col: 0x060606, wide: 0.24, seed: 9 }),
  });
  // long arms reaching forward, fingers spread
  for (const s of [-1, 1]) {
    K.add(ttube([[0.0, 0.36, s * 0.16], [0.16, 0.28, s * 0.19], [0.33, 0.24, s * 0.15], [0.5, 0.27, s * 0.1]], [0.034, 0.026, 0.024, 0.018], { segs: 14, radial: 8 }), 'ghost', skinG, null, null, 1, R, { own: 'shadeRibbons' });
    K.at([0.5, 0.27, s * 0.1], [0, 0, Math.PI / 2 + 0.1], [1, 1, -s], () => addHand(K, R, { long: 1.7, curl: 0.15, spread: 0.14, col: skinG, mat: 'ghost', nails: false, lo: true }));
  }
  return K.build();
}
export function shade() {
  const g = make('shade', buildShade);
  // each shade fades on its own: give it its own copies of the ghost and hair materials (same shader programs)
  const mats = [];
  g.traverse((o) => { if (o.isMesh && (o.material === MATS.ghost || o.material === MATS.murk)) { o.material = o.material.clone(); mats.push(o.material); } });
  const outer = by(g, 'shadeOuter');
  return { group: g, mat: outer ? outer.material : mats[0], mats };
}

// ---- THE DROWNED: a long pale eel whose head is a bloated drowned face, hair streaming behind it
function buildEel() {
  const K = new Kit(), R = K.root;
  const head = K.group('head', R);
  const pale = 0x8a958e;
  const hk = headKit('drowned', { skin: 0x87948c, bloat: 0.85, sock: 0.12, open: 0.42, gape: 0.2, mouthW: 0.22, lip: 0x48486a, rot: 0.4, veins: 0.7, gaunt: 0, nose: 0.08, lumps: 0.07, rough: 0.015, seed: 11, mouthCol: 0x150808 }, 44, 32);
  addHead(K, head, hk, [0.13, 0.0, 0], Math.PI / 2, [-0.15, 0, 0], 0.112, {
    eyes: 'milk', milk: 0xc4ccc4, fn: () => {
      for (const sd of [-1, 1]) { const c = hk.surf(sd * EYX, EYY); K.add(sph(1, 8, 6), 'glow', hdr(0xd8f0ff, 2.6), [c.x, c.y, c.z + 0.1], null, 0.035, head); }
      addTeeth(K, head, hk, { y: -0.5 + 0.15, w: 0.18, n: 7, dir: -1, seed: 21, gap: 0.3, size: 0.8 });
      addHair(K, head, hk, { n: 44, len: 5.5, front: 0, mat: 'wet', col: 0x080909, wide: 0.15, seed: 4, down: [0, -0.25, -1] });
    },
  });
  K.add(ttube([[0.08, -0.01, 0], [0.0, 0, 0], [-0.06, 0, 0]], [0.07, 0.083, 0.086], { segs: 6, radial: 14 }), 'gloss', pale, null, null, 1, head, { grime: 0.35, freq: 20 });
  // body segments: each a child of the previous, trailing toward -x; mottled like something long under water
  let parent = R;
  for (let i = 0; i < 10; i++) {
    const seg = K.group('seg' + i, parent, i === 0 ? -0.01 : -0.2, 0, 0);
    const r0 = 0.086 * (1 - i * 0.075), r1 = 0.086 * (1 - (i + 1) * 0.075) + 0.004;
    const body = paint('drownSeg' + i, cyl(r1, r0, 0.22, 16), (p, c) => {
      const m = fbm(p.x * 14 + i * 3, p.y * 14, p.z * 14);
      c.setRGB(1, 1, 1).multiplyScalar(0.78 + 0.4 * m);
      mixC(c, 0x56604c, sstep(0.55, 0.7, m) * 0.7); mixC(c, 0x2a2228, sstep(0.68, 0.8, fbm(p.x * 30, p.y * 30 + i, p.z * 30)) * 0.8);
      if (p.x < -r1 * 0.3) mixC(c, 0xd6d0c4, 0.4);
    });
    K.add(body, 'gloss', pale, [-0.1, 0, 0], [0, 0, Math.PI / 2], [1, 1, 0.85], seg, { grime: 0.2, freq: 30 });
    if (i === 1) for (const s of [-1, 1]) K.at([-0.05, -0.04, s * r0 * 0.85], [s * 0.6, 0, -1.9], [0.45, 0.45, 0.45 * s], () => addHand(K, seg, { long: 1.3, curl: 0.5, col: pale, lo: true }));
    if (i % 3 === 0) for (const s of [-1, 1]) K.add(sph(0.007, 6, 4), 'glow', hdr(0xbfe8ff, 1.6), [-0.1, -0.02, s * r0 * 0.84], null, 1, seg);
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
    const rad = (0.21 * Math.pow(1 - t, 1.5) + 0.018 * (1 - t) + 0.01) * (1 + Math.sin(t * 19 + r() * 2) * 0.07 * (1 - t) + (r() - 0.5) * 0.12 * (1 - t));
    pts.push([i === N ? 0 : rad, -t * len]);
  }
  pts.unshift([0.26, 0.06]); pts.unshift([0, 0.06]);
  const streaks = Array.from({ length: 9 }, () => [r() * Math.PI * 2, 0.3 + r() * 0.55]);
  const g = paint('stalB' + len, roughen('stal24' + len, lathe('stal24' + len, pts.reverse(), 24), 0.025, 6, len), (p, c) => {
    const t = Math.min(1, Math.max(0, -p.y / len)), a = Math.atan2(p.z, p.x);
    c.setRGB(1, 1, 1);
    let b = sstep(0.45, 0.85, t);
    for (const [sa, sl] of streaks) { const da = Math.abs(((a - sa + Math.PI * 3) % (Math.PI * 2)) - Math.PI); b = Math.max(b, sstep(0.55, 0.18, da) * sstep(1 - sl - 0.1, 1 - sl + 0.05, t)); }
    mixC(c, 0x3a0806, b * 0.95);
    mixC(c, 0x120202, sstep(0.9, 1, t) * 0.8);
  });
  K.add(g, 'gloss', 0x8a857c, [0, 0, 0], null, 1, R, { grime: 0.42, freq: 7 });
  for (let k = 0; k < 4; k++) {
    const a = k / 4 * Math.PI * 2 + r(), L = len * (0.4 + r() * 0.3);
    const p = (t) => { const rr = 0.21 * Math.pow(1 - t, 1.5) + 0.02; return [Math.cos(a) * rr * 1.02, -t * len, Math.sin(a) * rr * 1.02]; };
    K.add(tube('stalr' + len + k, [p(0.02), p(L / len * 0.5), p(L / len)], 0.016, 10, 5), 'gloss', k % 2 ? 0xa39a88 : 0x6e675e, null, null, 1, R, { grime: 0.3 });
  }
  // bones fused into the rock: ribs, finger bones, a jaw
  const nb = 2 + Math.floor(r() * 3);
  for (let k = 0; k < nb; k++) {
    const t = 0.12 + r() * 0.45, a = r() * Math.PI * 2, rr = 0.21 * Math.pow(1 - t, 1.5) + 0.02;
    const base = [Math.cos(a) * rr * 0.7, -t * len, Math.sin(a) * rr * 0.7], bl = 0.08 + r() * 0.16;
    const tip = [base[0] + Math.cos(a) * bl, base[1] - bl * (0.3 + r() * 0.5), base[2] + Math.sin(a) * bl];
    addBone(K, R, base, tip, 0.006 + r() * 0.005, H.bone);
  }
  if (len >= 1.2) { const a = r() * Math.PI * 2, t = 0.2, rr = 0.21 * Math.pow(1 - t, 1.5); addSkull(K, R, [Math.cos(a) * rr * 0.85, -t * len, Math.sin(a) * rr * 0.85], [0.4, -a + Math.PI / 2, 0.2], 0.075, { seed: Math.round(len * 10) }); }
  K.add(sph(0.016, 8, 6), 'wet', 0x5a0408, [0, -len - 0.008, 0], null, [1, 1.6, 1], R, { grime: 0 });   // a fresh drop of blood at the tip
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
// ---- a small old coffin with iron bands (the chest: same footprint, lid hinged at the top-back edge, left ajar)
const COFFIN = [[-0.44, -0.17], [0.16, -0.29], [0.44, -0.21], [0.44, 0.21], [0.16, 0.29], [-0.44, 0.17]];
function coffinShape(k = 1, inset = 0) {
  const s = new THREE.Shape(); COFFIN.forEach(([x, z], i) => { const X = x * k - Math.sign(x) * inset, Z = z * k - Math.sign(z) * inset; if (i) s.lineTo(X, Z); else s.moveTo(X, Z); }); s.closePath(); return s;
}
function buildCoffin() {
  const K = new Kit(), R = K.root;
  const wood = 0x4c3626, woodDk = 0x2e2018;
  const walls = geo('coffinWalls', () => { const s = coffinShape(1); s.holes.push(coffinShape(1, 0.035)); const g = new THREE.ExtrudeGeometry(s, { depth: 0.34, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, 0.36, 0); g.computeVertexNormals(); return g; });
  K.add(walls, 'rough', wood, null, null, 1, R, { grime: 0.45, freq: 9 });
  K.add(geo('coffinFloor', () => { const g = new THREE.ExtrudeGeometry(coffinShape(1), { depth: 0.03, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, 0.03, 0); g.computeVertexNormals(); return g; }), 'rough', woodDk, null, null, 1, R);
  // plank seams and the dark inside
  for (let k = 1; k < 4; k++) for (const [a, b] of [[0, 1], [1, 2], [3, 4], [4, 5]]) {
    const A = COFFIN[a], B = COFFIN[b], y = k * 0.09, mx = (A[0] + B[0]) / 2, mz = (A[1] + B[1]) / 2, L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    K.add(box(L, 0.006, 0.006), 'rough', 0x140c08, [mx * 1.002, y, mz * 1.03], [0, -Math.atan2(B[1] - A[1], B[0] - A[0]), 0], 1, R, { grime: 0 });
  }
  K.add(geo('coffinIn', () => { const g = new THREE.ShapeGeometry(coffinShape(1, 0.04)); g.rotateX(-Math.PI / 2); g.translate(0, 0.33, 0); return g; }), 'rough', 0x0a0706, null, null, 1, R, { grime: 0 });
  // iron straps on the long sides, corner plates, nail heads
  for (const x of [-0.24, 0.3]) for (const sz of [-1, 1]) {
    const seg = x < 0.16 ? [COFFIN[sz > 0 ? 5 : 0], COFFIN[sz > 0 ? 4 : 1]] : [COFFIN[sz > 0 ? 4 : 1], COFFIN[sz > 0 ? 3 : 2]];
    const [A, B] = seg, f = (x - A[0]) / (B[0] - A[0]), z = A[1] + (B[1] - A[1]) * f, ang = -Math.atan2(B[1] - A[1], B[0] - A[0]);
    K.add(rbox(0.055, 0.36, 0.012, 0.004), 'metal', H.rust, [x, 0.18, z + sz * 0.007], [0, ang + (sz < 0 ? Math.PI : 0), 0], 1, R, { grime: 0.5, freq: 20 });
    for (let k = 0; k < 4; k++) K.add(sph(0.008, 6, 4), 'metal', H.rustDk, [x, 0.05 + k * 0.09, z + sz * 0.014], null, 1, R);
  }
  // a skeletal hand has pushed the lid up from inside: fingers hooked over the front rim
  K.at([0.06, 0.36, 0.23], [0, 0.15, 0], 1, () => {
    for (let i = 0; i < 4; i++) {
      const x = -0.03 + i * 0.02, l = i === 0 || i === 3 ? 0.8 : 1;
      K.add(ttube([[x, -0.06, -0.04], [x, 0.0, -0.015], [x + 0.002, 0.013, 0.02 * l], [x + 0.003, 0.0, 0.045 * l], [x + 0.003, -0.022 * l, 0.05 * l]], [0.0055, 0.005, 0.0047, 0.004, 0.0028], { segs: 12, radial: 5 }), 'rough', H.bone, null, null, 1, R, { grime: 0.4 });
    }
    K.add(lump('palmbone', 0.03, 1, 0.3, 6, 2, 1.2, 0.6, 1.1), 'rough', H.boneDk, [0.0, -0.075, -0.05], null, 1, R, { grime: 0.4 });
  });
  K.add(octa(0.035), 'glow', hdr(0xffc070, 1.5), [0.0, 0.3, 0.05], null, 1, R);   // a glint of the dead man's gold in the gap
  // the lid: a coffin plate with a raised panel and iron bands, pivot at the top-back edge
  const lid = K.group('lid', R, 0, 0.36, -0.3);
  lid.rotation.x = -0.12;
  K.add(geo('coffinLid', () => { const g = new THREE.ExtrudeGeometry(coffinShape(1.04), { depth: 0.035, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 }); g.rotateX(Math.PI / 2); g.translate(0, 0.04, 0.3); g.computeVertexNormals(); return g; }), 'rough', wood, null, null, 1, lid, { grime: 0.45, freq: 9 });
  K.add(geo('coffinPanel', () => { const g = new THREE.ExtrudeGeometry(coffinShape(0.82), { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.01, bevelSegments: 1 }); g.rotateX(Math.PI / 2); g.translate(0, 0.07, 0.3); g.computeVertexNormals(); return g; }), 'rough', 0x3e2c1e, null, null, 1, lid, { grime: 0.5, freq: 12 });
  for (const x of [-0.26, 0.05, 0.32]) K.add(rbox(0.05, 0.012, 0.62, 0.004), 'metal', H.rust, [x, 0.078, 0.3], null, 1, lid, { grime: 0.5 });
  K.add(rbox(0.07, 0.07, 0.014, 0.005), 'metal', H.rustDk, [0.05, 0.03, 0.61], null, 1, lid);
  K.add(box(0.012, 0.03, 0.004), 'metal', 0x050505, [0.05, 0.03, 0.62], null, 1, lid, { grime: 0 });
  // scratches on the lid's underside edge, dried blood down the front
  for (let k = 0; k < 3; k++) K.add(ttube([[0.12 + k * 0.05, 0.33, 0.27 + k * 0.004], [0.122 + k * 0.05, 0.24, 0.275], [0.12 + k * 0.05, 0.16 - k * 0.04, 0.28]], [0.008, 0.006, 0.002], { segs: 6, radial: 5 }), 'gloss', H.bloodDry, null, null, 1, R, { grime: 0.2 });
  return K.build();
}
export function chest() { const g = make('chest', buildCoffin); return { group: g, lid: by(g, 'lid') }; }

// ------------------------------------------------------------------ cursed relics (0..14; 100+ are tinted copies)
function addCandle(K, parent, p, h, r, seed, o = {}) {
  const rr = rng(seed);
  K.add(ttube([[p[0], p[1], p[2]], [p[0], p[1] + h * 0.5, p[2]], [p[0] + 0.002, p[1] + h, p[2]]], [r * 1.25, r * 1.05, r, r * 0.96], { segs: 6, radial: 12, noise: 0.06, nf: 40, cap: 1 }), 'gloss', o.col ?? H.wax, null, null, 1, parent, { grime: 0.35, freq: 40 });
  for (let k = 0; k < 4; k++) { const a = rr() * Math.PI * 2, dl = h * (0.3 + rr() * 0.6); K.add(ttube([[p[0] + Math.cos(a) * r, p[1] + h - 0.004, p[2] + Math.sin(a) * r], [p[0] + Math.cos(a) * r * 1.12, p[1] + h - dl * 0.5, p[2] + Math.sin(a) * r * 1.12], [p[0] + Math.cos(a) * r * 1.18, p[1] + h - dl, p[2] + Math.sin(a) * r * 1.18]], [r * 0.25, r * 0.22, r * 0.3], { segs: 5, radial: 5 }), 'gloss', o.col ?? H.wax, null, null, 1, parent, { grime: 0.3 }); }
  K.add(sph(r * 2.2, 10, 6), 'gloss', o.col ?? H.waxDk, [p[0], p[1] + 0.002, p[2]], null, [1, 0.12, 1], parent, { grime: 0.4 });
  K.rod('rough', 0x0a0806, [p[0], p[1] + h - 0.005, p[2]], [p[0], p[1] + h + 0.012, p[2]], 0.0015, parent, 4);
  if (o.flame !== false) {
    const fg = geo('flame', () => { const g = new THREE.LatheGeometry([[0, 0], [0.006, 0.006], [0.009, 0.016], [0.006, 0.03], [0, 0.042]].map(([a, b]) => new THREE.Vector2(a, b)), 10); return g; });
    const tgt = o.flameParent || parent;
    const off = o.flameParent ? [0, 0, 0] : [p[0], p[1] + h + 0.004, p[2]];
    K.add(fg, 'glow', hdr(0xff9a3a, 5), off, null, (o.fs ?? 1) * (0.8 + rr() * 0.4), tgt, { own: o.flameOwn });
    K.add(fg, 'glow', hdr(0xfff0c0, 9), [off[0], off[1] + 0.002, off[2]], null, (o.fs ?? 1) * 0.5, tgt, { own: o.flameOwn });
  }
}
function buildRelic(id) {
  const K = new Kit(), R = K.root;
  const pr = rng(Math.floor(hash3(id, 7, 3) * 4e9) + id);
  const G = (c, k = 4) => hdr(c, k);
  switch (id) {
    case 0: { // THE FOREMAN'S POCKET WATCH: stopped at 3:33, its glass cracked
      K.add(roughen('pwbase', rbox(0.16, 0.04, 0.1, 0.012), 0.004, 12, 2), 'rough', H.stoneDk, [0, 0.02, 0], null, 1, R, { grime: 0.4 });
      K.add(cyl(0.105, 0.105, 0.032, 36), 'polish', 0x8c6c34, [0, 0.15, 0], [Math.PI / 2, 0, 0], 1, R, { grime: 0.55, freq: 30 });
      K.add(tor(0.105, 0.008, 36, 6), 'polish', 0xa8823e, [0, 0.15, 0.016], null, 1, R, { grime: 0.4 });
      K.add(cyl(0.095, 0.095, 0.004, 36), 'rough', 0xcfc2a2, [0, 0.15, 0.017], [Math.PI / 2, 0, 0], 1, R, { grime: 0.45, freq: 40 });
      for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; K.add(box(0.004, k % 3 ? 0.01 : 0.02, 0.002), 'rough', 0x1e1814, [Math.sin(a) * 0.083, 0.15 + Math.cos(a) * 0.083, 0.02], [0, 0, -a], 1, R, { grime: 0 }); }
      const hand = (a, L, w) => K.add(plate('pwh' + L, [[-w, -0.012], [w, -0.012], [w * 0.5, L], [0, L + 0.008], [-w * 0.5, L]], 0.002), 'metal', 0x141210, [0, 0.15, 0.022], [0, 0, -a], 1, R, { grime: 0 });
      hand((3 + 33 / 60) / 12 * Math.PI * 2, 0.05, 0.005); hand(33 / 60 * Math.PI * 2, 0.075, 0.0035);
      K.add(sph(0.006, 8, 6), 'glow', G(0xff2a14, 3), [0, 0.15, 0.024], null, 1, R);
      K.add(cyl(0.097, 0.097, 0.003, 36), 'glass', 0xd0d8e0, [0, 0.15, 0.025], [Math.PI / 2, 0, 0], 1, R, { grime: 0 });
      // cracks radiating from a point of impact
      const hit = [0.03, 0.17];
      for (let k = 0; k < 9; k++) { const a = pr() * Math.PI * 2, L = 0.03 + pr() * 0.07; let x = hit[0], y = hit[1]; for (let j = 0; j < 3; j++) { const aa = a + (pr() - 0.5) * 0.6, l = L / 3; const nx = x + Math.cos(aa) * l, ny = y + Math.sin(aa) * l; if (Math.hypot(nx, ny - 0.15) > 0.094) break; K.add(box(l, 0.0012, 0.001), 'glow', G(0xd8e4ff, 0.9), [(x + nx) / 2, (y + ny) / 2, 0.0275], [0, 0, aa], 1, R); x = nx; y = ny; } }
      K.add(cyl(0.012, 0.012, 0.02, 12), 'polish', 0x9a7a3a, [0, 0.265, 0], null, 1, R, { grime: 0.4 });
      K.add(tor(0.02, 0.004, 14, 5), 'polish', 0x9a7a3a, [0, 0.29, 0], null, 1, R);
      const chain = [[0, 0.3, 0], [0.04, 0.27, 0.02], [0.07, 0.17, 0.03], [0.065, 0.06, 0.03], [0.04, 0.042, 0.03]];
      K.add(tube('pwchain', chain, 0.0035, 30, 4), 'polish', 0x8a6a30, null, null, 1, R, { grime: 0.4 });
      K.add(plate('pwblood', [[0, 0], [0.03, -0.01], [0.05, 0.015], [0.03, 0.03], [0.01, 0.025]], 0.002), 'gloss', H.bloodDry, [-0.08, 0.1, 0.018], [0, 0, 0.6], 1, R, { grime: 0.2 });
      break;
    }
    case 1: { // A CHILD'S LEFT SHOE: a worn little strap shoe, still damp inside
      const shoe = sculpt('childShoe', sph(1, 44, 26), (v, c) => {
        const d = v.clone().normalize(), x = d.x, up = d.y > 0;
        const hgt = 0.036 + 0.03 * sstep(0.7, -0.5, x), wid = 0.034 * (1 + 0.12 * sstep(-0.6, 0.6, x)) * (x > 0.85 ? 1 - (x - 0.85) * 1.2 : 1);
        const open = up && x < 0.12 && x > -0.82 && Math.abs(d.z) < 0.7 ? sstep(0.5, 0.85, d.y) : 0;
        v.set(x * 0.095, up ? d.y * hgt * (1 - 0.75 * open) + 0.012 : d.y * 0.012 + 0.012, d.z * wid);
        c.setRGB(1, 1, 1).multiplyScalar(0.8 + 0.3 * fbm(d.x * 6, d.y * 6, d.z * 6));
        mixC(c, 0x8a6a4a, sstep(0.6, 0.95, x) * sstep(0.2, 0.6, d.y) * 0.5);
        mixC(c, 0x050302, sstep(0.2, 0.6, open));
        mixC(c, 0x1a1410, sstep(0.1, -0.3, d.y));
      });
      K.add(shoe, 'gloss', 0x3a2418, [0, 0.0, 0], null, 1, R, { grime: 0.5, freq: 40 });
      K.add(rbox(0.2, 0.012, 0.074, 0.005), 'rough', 0x161210, [0.002, 0.006, 0], null, 1, R, { grime: 0.3 });
      K.add(rbox(0.04, 0.02, 0.066, 0.006), 'rough', 0x161210, [-0.074, 0.016, 0], null, 1, R, { grime: 0.3 });
      K.add(tor(0.036, 0.004, 16, 4, Math.PI), 'gloss', 0x24160e, [0.012, 0.05, 0], [0, Math.PI / 2, 0], [1, 1.05, 1.0], R);
      K.add(cyl(0.006, 0.006, 0.004, 10), 'polish', 0x6a5a40, [0.012, 0.045, 0.037], [Math.PI / 2, 0, 0], 1, R);
      K.add(ribbon([[-0.045, 0.06, 0.0], [-0.06, 0.085, 0.01], [-0.07, 0.1, 0.0]], 0.035, { segs: 5, nrm: [0, 0, 1] }), 'skin', 0x7a7266, null, null, 1, R, { grime: 0.5 });
      K.add(plate('shoeBl', [[0, 0], [0.04, -0.005], [0.05, 0.02], [0.02, 0.03]], 0.002), 'gloss', H.bloodDry, [-0.07, 0.03, 0.034], [0, 0.1, 0], 1, R);
      K.add(sph(0.008, 8, 6), 'glow', G(0xbfd8ff, 1.4), [-0.035, 0.03, 0], null, [1.6, 0.3, 0.8], R);
      break;
    }
    case 2: { // THE SHIFT BELL: a miner's hand bell, its lip crusted with blood
      K.add(lathe('shbell', [[0.0, 0.2], [0.035, 0.2], [0.05, 0.18], [0.058, 0.12], [0.075, 0.06], [0.095, 0.02], [0.1, 0.0], [0.092, 0.004]], 28), 'metal', 0x6a5a30, [0, 0.0, 0], null, 1, R, { grime: 0.55, freq: 20 });
      K.add(cyl(0.02, 0.026, 0.03, 12), 'metal', 0x4a3e22, [0, 0.215, 0], null, 1, R);
      K.add(lathe('shhandle', [[0, 0], [0.016, 0], [0.012, 0.04], [0.014, 0.09], [0.022, 0.11], [0.018, 0.125], [0, 0.13]], 14), 'rough', 0x3a2a1c, [0, 0.23, 0], null, 1, R, { grime: 0.5 });
      K.add(sph(0.018, 10, 8), 'metal', 0x3a3020, [0.02, 0.025, 0], null, 1, R);
      K.rod('metal', 0x3a3020, [0, 0.19, 0], [0.02, 0.035, 0], 0.003, R, 4);
      for (let k = 0; k < 7; k++) { const a = pr() * Math.PI * 2, l = 0.02 + pr() * 0.05; K.add(ttube([[Math.cos(a) * 0.098, 0.003, Math.sin(a) * 0.098], [Math.cos(a) * 0.09, 0.01 + l * 0.5, Math.sin(a) * 0.09], [Math.cos(a) * 0.084, 0.01 + l, Math.sin(a) * 0.084]], [0.006, 0.005, 0.002], { segs: 5, radial: 5 }), 'gloss', H.bloodDry, null, null, 1, R, { grime: 0.2 }); }
      K.add(tor(0.096, 0.006, 28, 4), 'gloss', H.bloodDry, [0, 0.004, 0], [Math.PI / 2, 0, 0], 1, R);
      K.add(tor(0.07, 0.006, 24, 4), 'glow', G(0xff3018, 1.6), [0, 0.02, 0], [Math.PI / 2, 0, 0], 1, R);
      break;
    }
    case 3: { // A JAR OF TEETH
      K.add(lathe('tjar', [[0, 0], [0.07, 0.002], [0.078, 0.02], [0.08, 0.17], [0.07, 0.2], [0.06, 0.215], [0.062, 0.235]], 24), 'glass', 0xc0ccbc, [0, 0, 0], null, 1, R, { grime: 0.3, freq: 30 });
      K.add(cyl(0.066, 0.066, 0.03, 20), 'metal', H.rust, [0, 0.245, 0], null, 1, R, { grime: 0.6 });
      K.add(cyl(0.081, 0.081, 0.06, 22, true), 'skin', 0xb8a884, [0, 0.1, 0], null, 1, R, { grime: 0.6, freq: 40 });
      for (let k = 0; k < 3; k++) K.add(box(0.05 - k * 0.01, 0.004, 0.002), 'rough', 0x1a1410, [0.0, 0.115 - k * 0.012, 0.082], [0, 0, (pr() - 0.5) * 0.2], 1, R, { grime: 0 });
      const tooth = geo('tooth', () => { const g = new THREE.CapsuleGeometry(0.008, 0.01, 2, 6); g.translate(0, 0.006, 0); return g; });
      for (let k = 0; k < 46; k++) {
        const a = pr() * Math.PI * 2, rr = Math.sqrt(pr()) * 0.062, y = 0.015 + Math.pow(pr(), 1.3) * 0.15;
        const c = new THREE.Color(H.tooth).lerp(_tc.set(H.toothDk), pr()); if (pr() < 0.12) c.multiplyScalar(0.35);
        K.add(tooth, 'gloss', c, [Math.cos(a) * rr, y, Math.sin(a) * rr], [pr() * 6, pr() * 6, pr() * 6], 0.9 + pr() * 0.5, R, { grime: 0.2 });
        if (k % 3 === 0) K.add(cone(0.004, 0.012, 4), 'gloss', c, [Math.cos(a) * rr, y - 0.01, Math.sin(a) * rr], [Math.PI + pr() - 0.5, 0, pr() - 0.5], 1, R);
      }
            break;
    }
    case 4: { // THE SPORE MASK: an old gas mask that something grew in
      K.add(roughen('smbase', rbox(0.13, 0.03, 0.1, 0.01), 0.004, 10, 4), 'rough', H.stoneDk, [0, 0.015, 0], null, 1, R);
      K.rod('rough', H.wood, [0, 0.02, -0.02], [0, 0.12, -0.03], 0.012, R, 6);
      const mk = headKit('sporeMask', { skin: 0x34332e, sock: -0.06, nose: 0.0, gaunt: 0, mouthW: 0.2, open: 0, wide: 0.86, long: 1.0, rough: 0.02, brow: 0, chin: 0 }, 36, 28);
      K.at([0, 0.17, 0], null, 0.085, () => {
        K.add(mk.g, 'gloss', 0xffffff, null, null, 1, R, { grime: 0.4, freq: 30 });
        for (const sd of [-1, 1]) {
          const c = mk.surf(sd * EYX, EYY, 0.04);
          K.add(tor(0.22, 0.05, 20, 6), 'metal', 0x4a4438, [c.x, c.y, c.z], [0, sd * 0.35, 0], 1, R, { grime: 0.5 });
          K.add(cyl(0.21, 0.21, 0.03, 20), 'glass', 0xc8c070, [c.x, c.y, c.z - 0.01], [Math.PI / 2, sd * 0.35, 0], 1, R);
          K.add(cyl(0.16, 0.16, 0.02, 16), 'glow', G(0xe8e070, 2.2), [c.x, c.y, c.z - 0.05], [Math.PI / 2, sd * 0.35, 0], 1, R);
        }
        const sn = mk.surf(0, -0.45, 0.02);
        K.add(cyl(0.2, 0.24, 0.42, 16), 'metal', H.rust, [sn.x, sn.y - 0.12, sn.z + 0.2], [1.1, 0, 0], 1, R, { grime: 0.6 });
        for (let k = 0; k < 4; k++) K.add(tor(0.235, 0.025, 18, 4), 'metal', H.rustDk, [sn.x, sn.y - 0.06 - k * 0.06, sn.z + 0.08 + k * 0.08], [1.1 + Math.PI / 2, 0, 0], 1, R);
        for (const sd of [-1, 1]) K.add(ttube([[sd * 0.78, 0.25, -0.1], [sd * 0.95, 0.2, -0.6], [sd * 0.5, 0.25, -1.1], [0, 0.3, -1.2]], 0.06, { segs: 10, radial: 5, sx: 0.4 }), 'gloss', 0x24221e, null, null, 1, R);
        // the fungus: pale caps, mould, threads
        for (let k = 0; k < 14; k++) {
          const p = mk.surf((pr() - 0.5) * 1.4, -0.2 + pr() * 0.9, 0.02), s = 0.08 + pr() * 0.14;
          K.add(lathe('mcap', [[0, 0.35], [0.5, 0.3], [0.85, 0.15], [1, 0.0], [0.8, 0.02]], 10), 'gloss', new THREE.Color(0xd8cfa8).multiplyScalar(0.7 + pr() * 0.4), [p.x, p.y + s * 0.4, p.z + 0.03], [pr() - 0.5, 0, pr() - 0.5], [s, s * 1.2, s], R, { grime: 0.3 });
          K.add(cyl(s * 0.18, s * 0.25, s * 0.5, 6), 'gloss', 0xc8c0a0, [p.x, p.y + s * 0.15, p.z + 0.02], null, 1, R);
        }
        for (let k = 0; k < 9; k++) { const p = mk.surf((pr() - 0.5) * 1.4, -0.6 + pr() * 1.2, 0.0); K.add(lump('mould' + (k % 3), 0.12, 1, 0.4, 4, k % 3, 1, 0.5, 1), 'rough', 0xbab49a, [p.x, p.y, p.z], [pr() * 3, pr() * 3, 0], 0.6 + pr() * 0.8, R, { grime: 0.5, freq: 40 }); }
        for (let k = 0; k < 6; k++) { const p = mk.surf((pr() - 0.5) * 1.2, -0.7, 0.0); K.add(ttube([[p.x, p.y, p.z], [p.x + (pr() - 0.5) * 0.2, p.y - 0.4, p.z + 0.1], [p.x + (pr() - 0.5) * 0.3, p.y - 0.9 - pr() * 0.5, p.z + 0.05]], 0.012, { segs: 8, radial: 3, cap: 0 }), 'rough', 0xd0caa8, null, null, 1, R, { grime: 0 }); }
      });
      break;
    }
    case 5: { // THE WEEPING ROOT: a root that grew into the shape of a person, weeping sap
      const bark = 0x3a2a1e;
      K.add(ttube([[0, 0.0, 0], [0.01, 0.07, 0.005], [-0.008, 0.14, -0.006], [0.006, 0.2, 0.004], [0, 0.245, 0]], [0.03, 0.022, 0.026, 0.02, 0.016, 0.012], { segs: 20, radial: 9, noise: 0.25, nf: 50, sx: 0.8 }), 'rough', bark, null, null, 1, R, { grime: 0.5, freq: 40 });
      K.add(lump('wrhead', 0.04, 2, 0.25, 5, 3, 0.85, 1.1, 0.85), 'rough', 0x46321f, [0.004, 0.275, 0], null, 1, R, { grime: 0.4 });
      for (const sd of [-1, 1]) {
        K.add(sph(0.008, 6, 4), 'rough', 0x050302, [0.03, 0.285, sd * 0.012], null, [0.6, 1.2, 1], R, { grime: 0 });
        K.add(ttube([[0.032, 0.28, sd * 0.012], [0.036, 0.25, sd * 0.013], [0.035, 0.2, sd * 0.012], [0.03, 0.17, sd * 0.012]], [0.003, 0.004, 0.0035, 0.002], { segs: 8, radial: 5 }), 'wet', 0x3a0404, null, null, 1, R, { grime: 0 });
        // arms: roots that wrap around the body and claw at its face
        K.add(ttube([[0, 0.21, sd * 0.02], [0.02, 0.17, sd * 0.06], [0.05, 0.2, sd * 0.05], [0.05, 0.25, sd * 0.03], [0.04, 0.29, sd * 0.03]], [0.011, 0.009, 0.007, 0.005, 0.003], { segs: 14, radial: 6, noise: 0.25, nf: 60 }), 'rough', bark, null, null, 1, R, { grime: 0.4 });
      }
      K.add(sph(0.008, 6, 4), 'rough', 0x050302, [0.032, 0.262, 0], null, [0.6, 0.6, 1.4], R, { grime: 0 });
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + pr() * 0.4, L = 0.08 + pr() * 0.06; K.add(ttube([[0, 0.03, 0], [Math.cos(a) * L * 0.5, 0.012, Math.sin(a) * L * 0.5], [Math.cos(a) * L, 0.003, Math.sin(a) * L]], [0.014, 0.009, 0.003], { segs: 8, radial: 6, noise: 0.2, nf: 60 }), 'rough', bark, null, null, 1, R, { grime: 0.4 }); }
      K.add(sph(0.03, 10, 6), 'wet', 0x2a0304, [0.04, 0.003, 0], null, [1.3, 0.1, 1], R);
      K.add(sph(0.006, 6, 4), 'glow', G(0xff2010, 4), [0.03, 0.285, 0.012], null, 1, R);
      K.add(sph(0.006, 6, 4), 'glow', G(0xff2010, 4), [0.03, 0.285, -0.012], null, 1, R);
      break;
    }
    case 6: { // THE BONE ROSARY: hung on a little iron hook, every fifth bead a skull
      K.add(cyl(0.05, 0.06, 0.02, 14), 'metal', H.rustDk, [0, 0.01, 0], null, 1, R, { grime: 0.5 });
      K.rod('metal', H.rust, [0, 0.02, 0], [0, 0.32, 0], 0.005, R, 6);
      K.add(tor(0.025, 0.004, 14, 4, Math.PI * 1.2), 'metal', H.rust, [0.025, 0.32, 0], [0, 0, 0], 1, R);
      const hook = [0.048, 0.31, 0];
      const loop = (t) => { const s = t < 0.5 ? -1 : 1, u = t < 0.5 ? t * 2 : (1 - t) * 2; return [hook[0] + Math.sin((1 - u) * Math.PI * 0.5) * 0.0, hook[1] - (1 - u) * 0.2 - (1 - u) * (1 - u) * 0.02, s * Math.sin((1 - u) * Math.PI) * 0.055]; };
      const N = 34;
      for (let k = 0; k <= N; k++) {
        const p = loop(k / N);
        if (k % 6 === 3) addSkull(K, R, [p[0] + 0.004, p[1], p[2]], [0, Math.PI / 2, 0], 0.011, { seed: k, jaw: false, mat: 'gloss', col: 0xe0d4b8 });
        else K.add(lump('rbead' + (k % 3), 0.0055, 1, 0.3, 8, k % 3, 1, 0.8, 1), 'gloss', 0xd8c8a4, p, [pr(), pr(), pr()], 1, R, { grime: 0.3 });
      }
      const bot = loop(0.5);
      K.rod('rough', 0x2a2018, [bot[0], bot[1] - 0.004, 0], [bot[0], bot[1] - 0.03, 0], 0.0015, R, 4);
      addBone(K, R, [bot[0], bot[1] - 0.03, 0], [bot[0], bot[1] - 0.12, 0], 0.0045, 0xd8c8a4, 'gloss');
      addBone(K, R, [bot[0], bot[1] - 0.055, -0.026], [bot[0], bot[1] - 0.055, 0.026], 0.0038, 0xd8c8a4, 'gloss');
      K.add(tor(0.008, 0.002, 10, 4), 'rough', 0x2a2018, [bot[0], bot[1] - 0.055, 0], [0, Math.PI / 2, 0], 1, R);
      K.add(sph(0.012, 8, 6), 'glow', G(0xff3a20, 2.2), [bot[0] + 0.006, bot[1] - 0.055, 0], null, 1, R);
      break;
    }
    case 7: { // THE SAINT'S FINGER, in a little glass reliquary
      K.add(lathe('rqfoot', [[0, 0], [0.075, 0], [0.078, 0.012], [0.05, 0.03], [0.03, 0.05], [0.06, 0.065], [0.065, 0.075], [0, 0.078]], 22), 'polish', 0x8a6a2c, [0, 0, 0], null, 1, R, { grime: 0.5, freq: 30 });
      K.add(cyl(0.05, 0.05, 0.16, 22, true), 'glass', 0xe0e4d8, [0, 0.16, 0], null, 1, R);
      for (const y of [0.08, 0.24]) K.add(tor(0.052, 0.008, 22, 6), 'polish', 0x9a7a34, [0, y, 0], [Math.PI / 2, 0, 0], 1, R, { grime: 0.4 });
      for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + Math.PI / 4; K.rod('polish', 0x9a7a34, [Math.cos(a) * 0.052, 0.08, Math.sin(a) * 0.052], [Math.cos(a) * 0.052, 0.24, Math.sin(a) * 0.052], 0.003, R, 5); }
      K.add(lathe('rqtop', [[0, 0], [0.055, 0], [0.04, 0.02], [0.015, 0.03], [0.01, 0.07], [0, 0.08]], 18), 'polish', 0x9a7a34, [0, 0.245, 0], null, 1, R, { grime: 0.4 });
      K.add(lump('rqcush', 0.035, 1, 0.15, 5, 2, 1, 0.45, 1), 'rough', 0x5a0a10, [0, 0.092, 0], null, 1, R, { grime: 0.3 });
      K.add(ttube([[0, 0.095, 0], [0.003, 0.13, 0.002], [0.0, 0.165, 0.004], [-0.004, 0.195, 0.004], [-0.003, 0.215, 0.002]], [0.0075, 0.0068, 0.0072, 0.006, 0.0062, 0.0048], { segs: 14, radial: 8, noise: 0.25, nf: 120 }), 'rough', 0x5a4636, null, null, 1, R, { grime: 0.5, freq: 80 });
      K.add(rbox(0.009, 0.016, 0.004, 0.0015), 'gloss', 0x9a8a50, [-0.0035, 0.21, 0.006], [0.15, 0, 0], 1, R);
      K.add(tor(0.0085, 0.0022, 12, 4), 'polish', 0xd8a840, [0.001, 0.12, 0.002], [Math.PI / 2, 0, 0], 1, R);
      K.add(sph(0.022, 10, 8), 'glow', G(0xffd080, 1.4), [0, 0.2, 0], null, [1, 1.8, 1], R);
      break;
    }
    case 8: { // A SKULL WITH A KEYHOLE
      K.add(roughen('skbase', rbox(0.16, 0.035, 0.14, 0.012), 0.004, 10, 6), 'rough', H.stoneDk, [0, 0.0175, 0], null, 1, R, { grime: 0.4 });
      addSkull(K, R, [0, 0.135, 0], [-0.1, 0, 0], 0.1, { hi: true, seed: 8 });
      K.add(rbox(0.05, 0.065, 0.012, 0.012), 'metal', H.rust, [0, 0.215, 0.077], [-0.45, 0, 0], 1, R, { grime: 0.5 });
      for (const [x, y] of [[-0.016, 0.24], [0.016, 0.24], [-0.016, 0.19], [0.016, 0.19]]) K.add(sph(0.004, 6, 4), 'metal', H.rustDk, [x, y, 0.082 + (y - 0.215) * -0.45], null, 1, R);
      K.add(cyl(0.008, 0.008, 0.02, 10), 'rough', 0x030202, [0, 0.222, 0.08], [Math.PI / 2 - 0.45, 0, 0], 1, R, { grime: 0 });
      K.add(box(0.006, 0.02, 0.02), 'rough', 0x030202, [0, 0.206, 0.083], [-0.45, 0, 0], 1, R, { grime: 0 });
      K.add(sph(0.007, 8, 6), 'glow', G(0xffa040, 6), [0, 0.216, 0.072], null, [1, 1.8, 1], R);
      break;
    }
    case 9: { // THE DROWNED BRIDE'S RING, still on her finger, wound in wet black hair and lace
      K.add(lump('silt', 0.09, 2, 0.25, 3, 4, 1, 0.3, 1), 'wet', 0x1c1a16, [0, 0.01, 0], null, 1, R, { grime: 0.3 });
      for (let k = 0; k < 16; k++) { const a = pr() * Math.PI * 2, r0 = 0.02 + pr() * 0.03, r1 = 0.07 + pr() * 0.05; K.add(ribbon([[Math.cos(a) * r0, 0.03, Math.sin(a) * r0], [Math.cos(a + 0.5) * (r0 + r1) / 2, 0.035 + pr() * 0.02, Math.sin(a + 0.5) * (r0 + r1) / 2], [Math.cos(a + 0.9) * r1, 0.015, Math.sin(a + 0.9) * r1]], 0.012, { segs: 8, nrm: [0, 1, 0] }), 'wet', 0x060606, null, null, 1, R, { grime: 0.2 }); }
      K.add(ribbon([[-0.05, 0.03, 0.03], [-0.01, 0.05, 0.05], [0.04, 0.035, 0.06], [0.07, 0.02, 0.03]], 0.04, { segs: 10, nrm: [0, 1, 0.3] }), 'skin', 0xd8d4c8, null, null, 1, R, { grime: 0.5, freq: 60 });
      const pts = [[0, 0.03, 0], [0.004, 0.08, 0], [0.012, 0.13, 0.004], [0.02, 0.17, 0.008], [0.028, 0.2, 0.012]];
      K.add(ttube(pts, [0.009, 0.0075, 0.008, 0.0065, 0.0068, 0.005, 0.0045], { segs: 16, radial: 7, noise: 0.15, nf: 150 }), 'rough', 0xb8ae94, null, null, 1, R, { grime: 0.4, freq: 80 });
      K.add(tor(0.0105, 0.003, 18, 6), 'polish', 0xe0b450, [0.006, 0.1, 0.001], [Math.PI / 2 - 0.08, 0, 0.08], 1, R, { grime: 0.15 });
      K.add(geo('bridegem', () => flat(new THREE.IcosahedronGeometry(0.007, 0))), 'gem', 0xd8e8ff, [0.016, 0.104, 0.001], null, [1, 0.8, 1], R);
      K.add(sph(0.008, 8, 6), 'glow', G(0xc8e0ff, 4), [0.016, 0.104, 0.001], null, 1, R);
      break;
    }
    case 10: { // THE CHAPEL'S TONGUELESS BELL: cracked, hung from a little yoke, nothing inside to ring it
      for (const sd of [-1, 1]) { K.add(roughen('cbpost', rbox(0.022, 0.34, 0.03, 0.004), 0.004, 20, sd + 3), 'rough', H.wood, [sd * 0.13, 0.17, 0], null, 1, R, { grime: 0.5 }); K.add(rbox(0.06, 0.015, 0.08, 0.004), 'rough', 0x2e2018, [sd * 0.13, 0.0075, 0], null, 1, R); }
      K.add(roughen('cbbeam', rbox(0.31, 0.03, 0.035, 0.005), 0.004, 20, 7), 'rough', H.wood, [0, 0.33, 0], null, 1, R, { grime: 0.5 });
      K.add(lathe('cbell', [[0.0, 0.18], [0.04, 0.18], [0.06, 0.16], [0.07, 0.1], [0.085, 0.05], [0.108, 0.015], [0.115, 0.0], [0.104, 0.003], [0.08, 0.02], [0.062, 0.08], [0.05, 0.15], [0.0, 0.165]], 28), 'metal', 0x4a4024, [0, 0.11, 0], null, 1, R, { grime: 0.6, freq: 20 });
      K.add(tor(0.016, 0.005, 12, 5), 'metal', H.rustDk, [0, 0.305, 0], null, 1, R);
      const crack = [[0.06, 0.27, 0.05], [0.07, 0.24, 0.05], [0.064, 0.21, 0.06], [0.08, 0.18, 0.07], [0.09, 0.15, 0.065], [0.1, 0.125, 0.07]];
      K.add(tube('cbcrack', crack, 0.0022, 20, 4), 'glow', G(0xff3818, 2.4), null, null, 1, R);
      K.add(cyl(0.09, 0.105, 0.01, 22), 'rough', 0x030202, [0, 0.112, 0], null, 1, R, { grime: 0 });
      break;
    }
    case 11: { // A WAX DOLL, wrapped in rag, stuck full of pins, melted down one side
      K.add(roughen('wdbase', rbox(0.11, 0.025, 0.09, 0.01), 0.004, 10, 3), 'rough', H.wood, [0, 0.0125, 0], null, 1, R, { grime: 0.5 });
      K.add(drape('wdrag', [[0.025, 0.2], [0.04, 0.17], [0.045, 0.1], [0.055, 0.03]], { folds: 0.15, tatter: 0.2, n: 18, rings: 10, seed: 4 }), 'skin', 0x8a8070, [0, 0, 0], null, 1, R, { grime: 0.6, freq: 50 });
      const dk = headKit('waxDoll', { skin: H.wax, sock: 0.1, dark: 0.0, nose: 0.05, gaunt: 0, mouthW: 0.18, mouthH: 0.02, lip: 0x8a3a2a, wide: 0.9, long: 0.92, lumps: 0.12, seed: 6 }, 28, 20);
      K.at([0, 0.235, 0], [0, 0, 0.25], 0.04, () => {
        K.add(dk.g, 'gloss', 0xffffff, null, null, 1, R, { grime: 0.25, freq: 60 });
        for (const sd of [-1, 1]) { const c = dk.surf(sd * EYX, EYY, 0.03); K.add(sph(0.12, 8, 6), 'wet', 0x050505, [c.x, c.y, c.z], null, 1, R); }
        for (let k = 0; k < 5; k++) K.add(ribbon([[-0.2 + k * 0.1, 0.85, 0.2], [-0.3 + k * 0.12, 0.5, -0.5], [-0.35 + k * 0.14, -0.3, -0.7]], 0.12, { segs: 6, nrm: [0, 0.3, -1] }), 'skin', 0x1a1410, null, null, 1, R, { grime: 0.2 });
      });
      for (let k = 0; k < 5; k++) { const y = 0.1 + pr() * 0.12, a = pr() * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.05, y, Math.sin(a) * 0.05], [Math.cos(a) * 0.003, y - 0.01, Math.sin(a) * 0.003]], [0.002, 0.002], { segs: 2, radial: 4 }), 'metal', 0x9a9a9a, null, null, 1, R, { grime: 0 }); K.add(sph(0.006, 8, 6), 'gloss', k % 2 ? 0x8a0a0a : 0x101010, [Math.cos(a) * 0.052, y + 0.001, Math.sin(a) * 0.052], null, 1, R); }
      for (let k = 0; k < 5; k++) { const z = 0.02 + pr() * 0.03, L = 0.04 + pr() * 0.12; K.add(ttube([[0.035, 0.22, z], [0.045, 0.22 - L * 0.5, z + 0.005], [0.048, 0.22 - L, z]], [0.006, 0.005, 0.007], { segs: 6, radial: 5 }), 'gloss', H.wax, null, null, 1, R, { grime: 0.3 }); }
      K.add(sph(0.025, 10, 6), 'gloss', H.waxDk, [0.04, 0.03, 0.02], null, [1.5, 0.25, 1.2], R);
      K.add(sph(0.005, 6, 4), 'glow', G(0xff3a20, 3), [0.034, 0.24, 0.0], null, 1, R);
      break;
    }
    case 12: { // THE STILL-WARM EGG: a flesh egg with pulsing veins, in a nest of hair and bone
      const egg = paint('fleshEgg', lathe('fegg', [[0, 0], [0.07, 0.025], [0.098, 0.1], [0.092, 0.19], [0.06, 0.25], [0, 0.27]], 26), (p, c) => {
        const v = fbm(p.x * 30, p.y * 30, p.z * 30), rd = Math.pow(1 - Math.abs(v - 0.5) * 2, 10);
        c.setRGB(1, 1, 1).multiplyScalar(0.85 + 0.3 * fbm(p.x * 12, p.y * 12, p.z * 12));
        mixC(c, 0x3a0a1a, rd * 0.85); mixC(c, H.fat, sstep(0.6, 0.75, fbm(p.x * 9 + 3, p.y * 9, p.z * 9)) * 0.4);
      });
      K.add(egg, 'wet', 0x6a2a2a, [0, 0.03, 0], null, 1, R, { grime: 0.15 });
      for (let k = 0; k < 8; k++) { const a = pr() * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.075, 0.06, Math.sin(a) * 0.075], [Math.cos(a + 0.25) * 0.1, 0.13, Math.sin(a + 0.25) * 0.1], [Math.cos(a + 0.1) * 0.095, 0.2, Math.sin(a + 0.1) * 0.095], [Math.cos(a + 0.35) * 0.06, 0.27, Math.sin(a + 0.35) * 0.06]], [0.004, 0.005, 0.0035, 0.002], { segs: 14, radial: 5 }), 'wet', 0x4a0a20, null, null, 1, R, { grime: 0.1 }); }
      for (let k = 0; k < 4; k++) { const a = pr() * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.09, 0.09, Math.sin(a) * 0.09], [Math.cos(a + 0.2) * 0.1, 0.15, Math.sin(a + 0.2) * 0.1], [Math.cos(a + 0.3) * 0.085, 0.22, Math.sin(a + 0.3) * 0.085]], 0.0022, { segs: 10, radial: 4 }), 'glow', G(0xff2a18, 2.2), null, null, 1, R); }
      for (let k = 0; k < 18; k++) { const a = pr() * Math.PI * 2, r0 = 0.06 + pr() * 0.03, r1 = 0.1 + pr() * 0.05; K.add(ribbon([[Math.cos(a) * r0, 0.035, Math.sin(a) * r0], [Math.cos(a + 0.6) * (r0 + r1) / 2, 0.02 + pr() * 0.03, Math.sin(a + 0.6) * (r0 + r1) / 2], [Math.cos(a + 1.1) * r1, 0.005, Math.sin(a + 1.1) * r1]], 0.014, { segs: 8, nrm: [0, 1, 0] }), 'wet', 0x080606, null, null, 1, R, { grime: 0.2 }); }
      for (let k = 0; k < 5; k++) { const a = pr() * Math.PI * 2; addBone(K, R, [Math.cos(a) * 0.08, 0.015, Math.sin(a) * 0.08], [Math.cos(a + 0.8) * 0.14, 0.012, Math.sin(a + 0.8) * 0.14], 0.004); }
      break;
    }
    case 13: { // THE MIRROR THAT SHOWS NO ONE: black glass in an ornate frame
      K.add(lathe('mrfoot', [[0, 0], [0.07, 0], [0.072, 0.01], [0.04, 0.025], [0.015, 0.04], [0.012, 0.06], [0, 0.065]], 18), 'polish', 0x7a5a2a, [0, 0, 0], null, 1, R, { grime: 0.5 });
      K.add(cyl(0.11, 0.11, 0.01, 40), 'wet', 0x020203, [0, 0.19, 0], [Math.PI / 2, 0, 0], [1, 1.3, 1], R, { grime: 0 });
      K.add(tor(0.115, 0.014, 44, 8), 'polish', 0x8a6a30, [0, 0.19, 0], null, [1, 1.3, 1], R, { grime: 0.55, freq: 40 });
      K.add(tor(0.128, 0.006, 44, 5), 'polish', 0x6a4a20, [0, 0.19, -0.002], null, [1, 1.3, 1], R, { grime: 0.5 });
      for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; K.add(lump('mrorn' + (k % 3), 0.014, 1, 0.35, 8, k % 3), 'polish', 0x8a6a30, [Math.cos(a) * 0.125, 0.19 + Math.sin(a) * 0.125 * 1.3, 0.006], null, 1, R, { grime: 0.5 }); }
      addSkull(K, R, [0, 0.355, 0.004], [0, 0, 0], 0.022, { seed: 13, jaw: false, mat: 'polish', col: 0x8a6a30 });
      for (let k = 0; k < 4; k++) K.add(box(0.008, 0.07 - Math.abs(k - 1.5) * 0.012, 0.001), 'glow', G(0x9fb0c8, 0.22), [-0.035 + k * 0.014, 0.2 - Math.abs(k - 1.5) * 0.008, 0.007], [0, 0, -0.12 + k * 0.05], 1, R);
      K.add(tor(0.11, 0.0025, 44, 4), 'glow', G(0xb8c8ff, 1.6), [0, 0.19, 0.008], null, [1, 1.3, 1], R);
      break;
    }
    case 14: { // THE HEART'S KEY: an old iron key bound in raw sinew
      K.add(roughen('hkbase', rbox(0.12, 0.03, 0.1, 0.01), 0.004, 10, 9), 'rough', H.stoneDk, [0, 0.015, 0], null, 1, R, { grime: 0.4 });
      const bowS = Array.from({ length: 24 }, (_, k) => { const t = k / 24 * Math.PI * 2; return [0.016 * 16 * Math.pow(Math.sin(t), 3) / 16 * 3.2, (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 * 0.05]; });
      K.add(plate('hkbow', bowS, 0.012, 0.003), 'metal', 0x3a3430, [0, 0.27, 0], null, 1, R, { grime: 0.5 });
      K.add(plate('hkbowin', bowS.map(([x, y]) => [x * 0.5, y * 0.5 + 0.004]), 0.024), 'glow', G(0xff2a14, 3), [0, 0.27, 0], null, 1, R);
      K.add(cyl(0.008, 0.008, 0.19, 10), 'metal', 0x3a3430, [0, 0.14, 0], null, 1, R, { grime: 0.5 });
      K.add(rbox(0.04, 0.035, 0.009, 0.003), 'metal', 0x3a3430, [0.022, 0.065, 0], null, 1, R);
      K.add(rbox(0.012, 0.02, 0.009, 0.003), 'metal', 0x3a3430, [0.038, 0.09, 0], null, 1, R);
      K.add(cyl(0.035, 0.03, 0.02, 14), 'metal', 0x2a2420, [0, 0.04, 0], null, 1, R);
      const sp = []; for (let k = 0; k <= 40; k++) { const t = k / 40, a = t * Math.PI * 9; sp.push([Math.cos(a) * 0.011, 0.07 + t * 0.17, Math.sin(a) * 0.011]); }
      K.add(ttube(sp, [0.0035, 0.0045, 0.004, 0.003], { segs: 90, radial: 5 }), 'wet', 0x7a1a1a, null, null, 1, R, { grime: 0.2 });
      const sp2 = []; for (let k = 0; k <= 30; k++) { const t = k / 30, a = t * Math.PI * 6 + 1; sp2.push([Math.cos(a) * 0.012, 0.09 + t * 0.12, Math.sin(a) * 0.012]); }
      K.add(ttube(sp2, 0.0028, { segs: 60, radial: 4 }), 'wet', 0xa8846a, null, null, 1, R, { grime: 0.2 });
      for (let k = 0; k < 3; k++) K.add(sph(0.004, 6, 4), 'wet', H.bloodWet, [(k - 1) * 0.006, 0.065 - k * 0.006, 0.01], [0, 0, 0], [1, 1.6, 1], R);
      break;
    }
    default: { // endless strata: one of the fifteen, tinted
      return null;
    }
  }
  return K.build();
}
function tintedRelic(id) {
  const src = make('relic' + (id % 15), () => buildRelic(id % 15));
  const r = rng(id * 7919 + 13);
  const tint = new THREE.Color().setHSL(r(), 0.35, 0.55), glowT = new THREE.Color().setHSL(r(), 0.9, 0.6);
  src.traverse((o) => {
    if (!o.isMesh || !o.geometry.attributes.color) return;
    o.geometry = o.geometry.clone();
    const c = o.geometry.attributes.color, k = o.material === MATS.glow ? glowT : tint;
    for (let i = 0; i < c.count; i++) { const L = (c.getX(i) + c.getY(i) + c.getZ(i)) / 3; c.setXYZ(i, c.getX(i) * 0.3 + L * k.r * 1.4, c.getY(i) * 0.3 + L * k.g * 1.4, c.getZ(i) * 0.3 + L * k.b * 1.4); }
  });
  return src;
}
export function relic(id = 0) { return id < 15 && id >= 0 ? make('relic' + id, () => buildRelic(id)) : make('relic' + id, () => tintedRelic(Math.abs(id))); }

// ---- the altar (pedestal): a blood-dark stone block, candle stubs on its corners; the relic sits on top at y = 1.0
export function pedestal() {
  return make('pedestal', () => {
    const K = new Kit(), R = K.root;
    K.add(roughen('altb', rbox(0.84, 0.12, 0.72, 0.03), 0.01, 6, 1), 'rough', 0x4e4a46, [0, 0.06, 0], null, 1, R, { grime: 0.5 });
    K.add(roughen('altbody', rbox(0.66, 0.76, 0.56, 0.03), 0.014, 5, 2), 'rough', 0x5c5751, [0, 0.5, 0], null, 1, R, { grime: 0.55, freq: 5 });
    K.add(roughen('alttop', rbox(0.8, 0.12, 0.68, 0.03), 0.01, 6, 3), 'rough', 0x56514b, [0, 0.94, 0], null, 1, R, { grime: 0.5 });
    // a carved ring of signs on the front, the grooves faintly red
    K.add(tor(0.17, 0.012, 40, 4), 'rough', 0x1e1a18, [0, 0.52, 0.281], null, [1, 1, 0.3], R, { grime: 0 });
    K.add(tor(0.17, 0.006, 40, 4), 'glow', hdr(0xff2410, 0.9), [0, 0.52, 0.282], null, [1, 1, 0.3], R);
    for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2 + 0.3; K.add(box(0.045, 0.008, 0.004), 'glow', hdr(0xff2410, 0.8), [Math.cos(a) * 0.09, 0.52 + Math.sin(a) * 0.09, 0.283], [0, 0, a + 1.2], 1, R); K.add(box(0.02, 0.006, 0.004), 'glow', hdr(0xff2410, 0.8), [Math.cos(a) * 0.12, 0.52 + Math.sin(a) * 0.12, 0.283], [0, 0, a], 1, R); }
    // dried blood: a pool on top and runs down the front and sides
    const pr = rng(31);
    K.add(plate('altpool', Array.from({ length: 16 }, (_, k) => { const a = k / 16 * Math.PI * 2, rr = 0.18 * (0.75 + pr() * 0.5); return [Math.cos(a) * rr * 1.3, Math.sin(a) * rr]; }), 0.004), 'gloss', 0x2a0505, [0.0, 1.0015, 0.08], [-Math.PI / 2, 0, 0], 1, R, { grime: 0.3 });
    for (let k = 0; k < 9; k++) {
      const x = -0.28 + k * 0.07 + (pr() - 0.5) * 0.05, L = 0.08 + Math.pow(pr(), 1.6) * 0.6, r0 = 0.004 + pr() * 0.006;
      K.add(ttube([[x, 1.0, 0.3], [x, 0.94, 0.343], [x + (pr() - 0.5) * 0.01, 0.88, 0.344], [x + (pr() - 0.5) * 0.02, 0.88 - L * 0.5, 0.283], [x + (pr() - 0.5) * 0.02, 0.88 - L, 0.283]], [r0, r0 * 1.2, r0, r0 * 0.8, r0 * 0.5], { segs: 12, radial: 5, sx: 0.4, ref: [0, 0, 1] }), 'gloss', k % 3 ? 0x1c0303 : 0x2a0404, null, null, 1, R, { grime: 0.25 });
    }
    // candle stubs, a little melted wax on each corner
    for (const [x, z, h] of [[-0.33, 0.27, 0.07], [0.31, 0.26, 0.05], [-0.32, -0.25, 0.1], [0.33, -0.26, 0.08], [0.24, 0.29, 0.035]]) addCandle(K, R, [x, 1.0, z], h, 0.022, Math.round((x + z + h) * 1000));
    for (const [x, z, h] of [[-0.38, 0.33, 0.06], [0.36, 0.32, 0.09]]) addCandle(K, R, [x, 0.12, z], h, 0.02, Math.round((x * z + h) * 1000));
    return K.build();
  });
}

// ---- a blood-stained page torn from a diary, weighted by a stone
export function note() {
  return make('note', () => {
    const K = new Kit(), R = K.root;
    const page = (key, w, h, seed, blood) => sculpt(key, geo('pg' + key, () => new THREE.PlaneGeometry(w, h, 30, 22)), (v, c) => {
      const u = v.x / (w / 2), t = v.y / (h / 2);
      const edge = Math.max(Math.abs(u), Math.abs(t));
      const tear = (fbm(v.x * 60 + seed, v.y * 60, seed) - 0.3) * 0.06 + (u + t > 1.3 ? (u + t - 1.3) * 0.5 : 0);
      if (edge > 0.88) { const k = Math.max(0.5, 1 - tear * sstep(0.88, 1, edge) * 4); v.x *= k; v.y *= k; }
      v.z = (fbm(v.x * 18 + seed, v.y * 18, 1) - 0.5) * 0.012 + Math.sin(v.x * 30) * 0.0015;
      c.setRGB(1, 1, 1).multiplyScalar(0.82 + 0.25 * fbm(v.x * 25, v.y * 25 + seed, 3));
      mixC(c, 0x8a6a3a, sstep(0.55, 0.75, fbm(v.x * 40 + seed, v.y * 40, 7)) * 0.5);
      mixC(c, 0x6a5030, sstep(0.75, 1, edge) * 0.5);
      if (blood) {
        const b = sstep(0.5, 0.62, fbm(v.x * 12 + 3 + seed, v.y * 12 - 2, 5) * (1 - 0.6 * sstep(-0.2, 0.6, u - t)));
        mixC(c, 0x3a0505, b * 0.95);
        mixC(c, 0x3a0505, sstep(0.82, 0.9, fbm(v.x * 70, v.y * 70, seed + 4)) * 0.9);
      }
    });
    K.add(page('note1', 0.24, 0.18, 2, true), 'skin', 0xd9ccaa, [0, 0.012, 0], [-Math.PI / 2 + 0.04, 0, 0.12], 1, R, { grime: 0.15, freq: 30 });
    K.add(page('note2', 0.22, 0.16, 6, false), 'skin', 0xc8b890, [0.04, 0.006, -0.06], [-Math.PI / 2, 0, -0.35], 1, R, { grime: 0.2, freq: 30 });
    const pr = rng(5);
    for (let k = 0; k < 7; k++) { const w = 0.15 - (k % 3) * 0.03 - pr() * 0.03; K.add(box(w, 0.0025, 0.004), 'rough', 0x1a1a24, [-0.015 + (pr() - 0.5) * 0.01, 0.0175, -0.06 + k * 0.019], [0, 0.12 + (pr() - 0.5) * 0.05, 0], 1, R, { grime: 0 }); }
    K.add(lump('noterock', 0.06, 1, 0.3, 3, 5, 1.2, 0.7, 1), 'rough', 0x4a4440, [0.1, 0.035, 0.05], null, 1, R);
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
    // a ring of skulls half sunk in the ash, staring out; melted candles between them
    for (let k = 0; k < 9; k++) {
      const a = k / 9 * Math.PI * 2 + (r() - 0.5) * 0.15;
      addSkull(K, R, [Math.cos(a) * 0.44, 0.055, Math.sin(a) * 0.44], [-0.12 + (r() - 0.5) * 0.3, Math.PI / 2 - a + (r() - 0.5) * 0.4, (r() - 0.5) * 0.35], 0.085, { seed: k * 3 + 1 });
      const b = a + Math.PI / 9;
      addCandle(K, R, [Math.cos(b) * 0.5, 0, Math.sin(b) * 0.5], 0.05 + r() * 0.12, 0.018 + r() * 0.008, 100 + k);
      if (k % 3 === 0) addCandle(K, R, [Math.cos(a) * 0.43, 0.2, Math.sin(a) * 0.43], 0.04 + r() * 0.04, 0.016, 200 + k);   // one stuck on a crown
    }
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.3; K.add(roughen('cflog', cyl(0.045, 0.05, 0.6, 8), 0.01, 12, 2), 'rough', 0x1e1610, [Math.cos(a) * 0.08, 0.12, Math.sin(a) * 0.08], [Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9], 1, R, { grime: 0.6, freq: 20 }); }
    for (let k = 0; k < 9; k++) K.add(lump('ember' + (k % 3), 0.03, 0, 0.3, 4, k), 'glow', hdr(0xff4a10, 2 + r() * 2), [(r() - 0.5) * 0.28, 0.03, (r() - 0.5) * 0.28], null, 1, R);
    K.add(sph(0.3, 14, 6), 'rough', 0x141110, [0, 0.0, 0], null, [1, 0.08, 1], R, { grime: 0.4 });
    // the bones of whoever sat here last, and a rotten log seat
    for (let k = 0; k < 6; k++) { const a = r() * Math.PI; addBone(K, R, [1.0 + Math.cos(a) * 0.25, 0.02, 0.1 + Math.sin(a) * 0.2], [1.0 - Math.cos(a) * 0.25, 0.03 + r() * 0.04, 0.1 - Math.sin(a) * 0.2], 0.012 + r() * 0.006); }
    addSkull(K, R, [0.92, 0.07, -0.12], [0.3, -0.5, 1.2], 0.08, { seed: 41 });
    K.at([1.12, 0.07, 0.32], [0, 0.5, Math.PI / 2], 0.9, () => addRibcage(K, R, 1, H.bone, 'rough', { n: 7 }));
    K.add(roughen('logseat', cyl(0.16, 0.18, 0.8, 12), 0.015, 6, 2), 'rough', 0x2e2218, [-1.0, 0.17, 0], [Math.PI / 2, 0, 0.1], 1, R, { grime: 0.5, freq: 18 });
    K.add(cyl(0.15, 0.15, 0.01, 12), 'rough', 0x4a3a2a, [-1.0, 0.17, 0.4], [Math.PI / 2, 0, 0], 1, R);
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

// grey-pink worm flesh: veins, stretch marks, darker folds, a paler underside (p in the part's own coordinates)
const fleshPaint = (seed, belly = 'y', k = 1) => (p, c) => {
  const f = fbm(p.x * 1.6 * k + seed, p.y * 1.6 * k, p.z * 1.6 * k), v = fbm(p.x * 3.2 * k, p.y * 3.2 * k + seed, p.z * 3.2 * k);
  c.setRGB(1, 1, 1).multiplyScalar(0.8 + 0.35 * f);
  mixC(c, 0x5a1c22, Math.pow(1 - Math.abs(v - 0.5) * 2, 12) * 0.9);
  mixC(c, 0x8a3a3a, sstep(0.58, 0.72, fbm(p.x * 0.9 * k + 4, p.y * 0.9 * k, p.z * 0.9 * k + seed)) * 0.55);
  mixC(c, 0xe0d0c4, Math.pow(1 - Math.abs(fbm(p.x * 6 * k, p.y * 0.8 * k, p.z * 6 * k + seed) - 0.5) * 2, 30) * 0.5);
};
// ---- THE GNAWER: a colossal worm of grey flesh whose round maw is ring after ring of human teeth
function buildRockjaw() {
  const K = new Kit(), R = K.root;
  const skin = 0x7a6460, belly = 0x8c766c;
  const barrel = (key, len, r0, r1, lip) => lathe(key, [[0, -len / 2], [r0 * 0.5, -len / 2 + 0.02], [r0 * 0.84, -len * 0.4], [r0, -len * 0.24], [(r0 + r1) / 2, 0], [r1, len * 0.3], [lip, len * 0.42], [lip * 0.97, len / 2], [r1 * 0.75, len / 2 + 0.02], [0, len / 2 + 0.02]], 30);
  const ringed = (key, len, r0, r1, lip, seed) => sculpt(key, barrel(key + 'b', len, r0, r1, lip), (v, c) => {
    const a = Math.atan2(v.z, v.x), rr = Math.hypot(v.x, v.z), ann = 1 + 0.035 * Math.sin(v.y * 9) + (fbm(Math.cos(a) * 2 + seed, v.y * 1.4, Math.sin(a) * 2) - 0.5) * 0.12;
    v.x *= ann; v.z *= ann; fleshPaint(seed)(v, c);
    mixC(c, 0x3a1a1c, sstep(0.25, 0.0, Math.abs(Math.sin(v.y * 9))) * 0.35 * sstep(0.3, 0.9, rr));
  });
  const head = K.group('head', R);
  K.add(ringed('gnhead', 1.9, 1.05, 1.3, 1.36, 2), 'wet', skin, [-0.35, 0, 0], [0, 0, -Math.PI / 2], 1, head, { grime: 0.25, freq: 2 });
  // faces of the swallowed pressing out through the skin
  const fk = headKit('gnFace', { skin: 0x9a8a86, sock: 0.2, open: 0.6, gape: 0.25, mouthW: 0.28, gaunt: 1, dark: 0.85, seed: 3 }, 36, 26);
  for (const [x, y, s] of [[-0.6, 0.55, 1], [-0.95, -0.25, -1]]) addHead(K, head, fk, [x, y, s * 1.12], s > 0 ? 0 : Math.PI, [0.3 * s, 0, 0.2], 0.24, { mat: 'wet', eyes: 'none', grime: 0.2 });
  const maw = K.group('maw', head, 0.85, 0, 0);
  K.add(paint('gnlip', tor(0.98, 0.24, 40, 12), fleshPaint(5, 'y', 2)), 'wet', 0x5a2a28, [0, 0, 0], [0, Math.PI / 2, 0], 1, maw, { grime: 0.2 });
  for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2; K.add(lump('gnlobe' + (k % 3), 0.3, 2, 0.3, 2.5, k % 3, 0.55, 0.9, 0.6), 'wet', 0x4a2422, [0.12, Math.cos(a) * 1.1, Math.sin(a) * 1.1], [a, 0, 0], 1, maw, { grime: 0.3, freq: 3 }); }
  // three rings of human teeth, each set in a bloody gum, pointing in toward the throat
  const r = rng(77);
  [[0.86, 26, 0.0, 1.3], [0.64, 20, -0.3, 1.1], [0.44, 14, -0.58, 0.9]].forEach(([rad, n, x, sz]) => {
    K.add(tor(rad + 0.06, 0.08 * sz, 40, 8), 'wet', 0x4a0c10, [x - 0.04, 0, 0], [0, Math.PI / 2, 0], 1, maw, { grime: 0.2 });
    for (let k = 0; k < n; k++) {
      if (r() < 0.06) continue;
      const a = k / n * Math.PI * 2 + r() * 0.08, y = Math.cos(a) * rad, z = Math.sin(a) * rad;
      const q = new THREE.Quaternion().setFromUnitVectors(_up, new THREE.Vector3(-0.45, -y, -z).normalize()), e = new THREE.Euler().setFromQuaternion(q);
      const col = new THREE.Color(H.tooth).lerp(_tc.set(H.toothDk), r() * 0.8); if (r() < 0.12) col.multiplyScalar(0.3);
      const molar = r() < 0.4, w = (molar ? 0.19 : 0.14) * sz, h = (molar ? 0.2 : 0.3) * sz * (0.8 + r() * 0.4);
      K.add(TOOTH(), 'gloss', col, [x + 0.02, y * 0.97, z * 0.97], [e.x, e.y, e.z + (r() - 0.5) * 0.3], [w, h / 2, w * 0.75], maw, { grime: 0.3, freq: 8 });
    }
  });
  K.add(cyl(0.5, 0.12, 1.4, 20, true), 'glow', hdr(0xff1808, 1.1), [-0.8, 0, 0], [0, 0, Math.PI / 2], 1, maw);
  K.add(sph(0.3, 14, 10), 'glow', hdr(0xff3010, 2.2), [-1.3, 0, 0], null, 1, maw);
  K.add(cyl(0.6, 0.3, 1.0, 20, true), 'wet', 0x2a0606, [-0.55, 0, 0], [0, 0, Math.PI / 2], 1, maw, { grime: 0.2 });
  // body segments (not parented: the renderer lays them along a trail): ringed barrels of flesh, a paler belly, now and then a hand pushing out
  for (let i = 0; i < 12; i++) {
    const seg = K.group('seg' + i, R, -1.6 - i * 1.15, 0, 0);
    const sc = 1 - i * 0.045;
    K.add(ringed('gnseg' + (i % 3), 1.6, 0.95, 1.14, 1.2, 7 + (i % 3)), 'wet', i % 2 ? skin : 0x8e7e7a, [0, 0, 0], [0, 0, -Math.PI / 2], sc, seg, { grime: 0.25, freq: 2 });
    K.add(sph(0.95, 18, 12), 'gloss', belly, [0, -0.45 * sc, 0], null, [0.62 * sc, 0.6 * sc, 0.98 * sc], seg, { grime: 0.35, freq: 4 });
    if (i % 4 === 1) K.at([0.1, 0.25 * sc, 1.06 * sc], [0, 0, 0.5], 3.2 * sc, () => addHand(K, seg, { long: 1.5, curl: 0.15, spread: 0.12, col: 0x9a8682, mat: 'wet', lo: true }));
    if (i % 4 === 3) addRibcageBits(K, seg, sc, i);
  }
  return K.build();
}
function addRibcageBits(K, seg, sc, i) {
  for (let k = 0; k < 4; k++) addBone(K, seg, [-0.4 + k * 0.25, 0.95 * sc, 0.25 * sc], [-0.35 + k * 0.25, 1.25 * sc, 0.55 * sc], 0.035 * sc, H.boneDk);
}
export function rockjaw() {
  const g = make('rockjaw', buildRockjaw);
  return { group: g, head: by(g, 'head'), maw: by(g, 'maw'), segs: Array.from({ length: 12 }, (_, i) => by(g, 'seg' + i)) };
}

// ---- THE SHRIEKING MOTHER: a giant pale bat-mother with a human face, screaming
function buildGloomwing() {
  const K = new Kit(), R = K.root;
  const sk = 0x928580, skD = 0x6a5852;
  const body = K.group('body', R);
  K.add(ttube([[-1.1, -0.2, 0], [-0.5, -0.05, 0], [0.1, 0.05, 0], [0.75, 0.15, 0]], [0.3, 0.62, 0.72, 0.66, 0.42], {
    segs: 24, radial: 22, sx: 0.85, ref: [0, 1, 0], key: 'motherBody', noise: 0.04, nf: 3,
    fn: (t, a) => 1 + (t > 0.45 && t < 0.85 ? 0.07 * Math.pow(Math.max(0, Math.sin((t - 0.45) / 0.4 * Math.PI * 6)), 3) * sstep(-0.6, 0.2, Math.sin(a + 1.6)) : 0) + (t < 0.4 ? 0.12 * sstep(0, -0.9, Math.sin(a + 1.57)) * Math.sin(t / 0.4 * Math.PI) : 0),
  }), 'gloss', sk, null, null, 1, body, { grime: 0.3, freq: 3 });
  for (let k = 0; k < 16; k++) K.add(lump('mvert', 0.07, 1, 0.3, 4, k % 4, 1.2, 0.8, 1), 'gloss', 0xc8bab0, [0.6 - k * 0.11, 0.68 - Math.abs(k - 5) * 0.02, 0], null, 1, body, { grime: 0.3 });
  for (let k = 0; k < 5; k++) { const a = -0.7 + k * 0.35; K.add(ttube([[-0.7, -0.5, 0], [-0.75 + Math.cos(a) * 0.3, -0.52, Math.sin(a) * 0.3], [-0.8 + Math.cos(a) * 0.5, -0.4, Math.sin(a) * 0.55]], 0.025, { segs: 8, radial: 5 }), 'gloss', 0x6a2a34, null, null, 1, body, { grime: 0 }); }   // veins over the swollen belly
  for (const s of [-1, 1]) {
    K.add(ttube([[-0.75, -0.35, s * 0.3], [-0.95, -0.85, s * 0.42], [-0.85, -1.25, s * 0.45], [-1.15, -1.55, s * 0.45]], [0.15, 0.1, 0.075, 0.05], { segs: 14, radial: 9 }), 'gloss', sk, null, null, 1, body, { grime: 0.3 });
    for (let k = 0; k < 4; k++) K.add(ttube([[-1.15, -1.55, s * 0.45], [-1.2, -1.75, s * (0.38 + k * 0.05)], [-1.12, -1.92, s * (0.34 + k * 0.08)]], [0.028, 0.02, 0.008], { segs: 8, radial: 5 }), 'gloss', 0x3a302a, null, null, 1, body);
  }
  const head = K.group('head', R, 1.0, 0.35, 0);
  const hk = headKit('mother', { skin: sk, sock: 0.24, gaunt: 1.1, open: 0.9, mouthW: 0.42, mouthY: -0.4, gape: 0.36, lip: 0x4a2a30, nose: 0.06, veins: 0.6, wide: 0.86, blood: 0.6, seed: 5, mouthCol: 0x3a0808 }, 60, 44);
  addHead(K, head, hk, [0.12, 0.05, 0], Math.PI / 2, [-0.15, 0, 0], 0.42, {
    pin: 0.075, eyeCol: hdr(0xffe6c0, 12), eyeOwn: 'eyes', fn: () => {
      addTeeth(K, head, hk, { y: -0.4 + 0.3, w: 0.36, n: 16, dir: -1, needle: true, size: 0.9, seed: 31, gap: 0.04, col: 0xe2dccc });
      addTeeth(K, head, hk, { y: -0.4 - 0.33, w: 0.31, n: 14, dir: 1, needle: true, size: 0.85, seed: 32, gap: 0.04, col: 0xe2dccc });
      for (const sd of [-1, 1]) K.add(cone(0.3, 1.25, 7), 'skin', skD, [sd * 0.62, 0.85, -0.25], [-0.25, 0, -sd * 0.42], [1, 1, 0.3], head, { grime: 0.4 });
      addHair(K, head, hk, { n: 40, len: 5, front: 0, mat: 'wet', col: 0x0a0909, wide: 0.14, seed: 17 });
    },
  });
  const wingR = K.group('wingR', R, 0.2, 0.25, 0.55), wingL = K.group('wingL', R, 0.2, 0.25, -0.55);
  addWing(K, wingR, 4.0, 2.3, 1, 0x7a6660, 0xc8bca8, 0.045, 'mother', 3, { hand: 3.2, vein: 0x4a1e26 });
  addWing(K, wingL, 4.0, 2.3, -1, 0x7a6660, 0xc8bca8, 0.045, 'mother', 3, { hand: [3.2, 3.2, -3.2], vein: 0x4a1e26 });
  return K.build();
}
export function gloomwing() {
  const g = make('gloomwing', buildGloomwing);
  return { group: g, wingL: by(g, 'wingL'), wingR: by(g, 'wingR'), body: by(g, 'body'), head: by(g, 'head'), eyes: by(g, 'eyes') };
}

// ---- THE BONE SAINT: a towering ossuary giant of skulls and long bones, candles burning on its shoulders
function buildWarden() {
  const K = new Kit(), R = K.root;
  const bone = H.bone, boneDk = H.boneDk, r = rng(66);
  const bundle = (parent, a, b, n, rad, spread) => { for (let k = 0; k < n; k++) { const o = [(r() - 0.5) * spread, 0, (r() - 0.5) * spread]; addBone(K, parent, [a[0] + o[0], a[1], a[2] + o[2]], [b[0] + o[0] * 0.8, b[1], b[2] + o[2] * 0.8], rad * (0.8 + r() * 0.4), k % 2 ? bone : boneDk); } };
  const wire = (parent, p, rr) => K.add(tor(rr, 0.018, 18, 4), 'metal', H.rust, p, [Math.PI / 2 + (r() - 0.5) * 0.3, 0, (r() - 0.5) * 0.3], 1, parent, { grime: 0.5 });
  for (const s of [-1, 1]) {
    const leg = K.group(s > 0 ? 'legR' : 'legL', R, 0, 1.95, s * 0.55);
    bundle(leg, [0, 0.05, 0], [0.1, -0.9, 0], 4, 0.05, 0.2);
    wire(leg, [0.04, -0.3, 0], 0.17); wire(leg, [0.08, -0.7, 0], 0.15);
    addSkull(K, leg, [0.18, -0.98, 0], [0, Math.PI / 2, 0], 0.13, { seed: 5 + s });
    bundle(leg, [0.1, -1.0, 0], [0.05, -1.72, 0], 3, 0.045, 0.18);
    wire(leg, [0.07, -1.35, 0], 0.14);
    for (let k = 0; k < 5; k++) addBone(K, leg, [-0.1 + r() * 0.05, -1.88, (r() - 0.5) * 0.3], [0.38 + r() * 0.1, -1.9, (r() - 0.5) * 0.3], 0.03);
    addSkull(K, leg, [0.15, -1.82, 0], [-0.3, Math.PI / 2, 0], 0.11, { seed: 9 + s });
    for (let k = 0; k < 3; k++) K.add(ribbon([[0.1, -0.1, (k - 1) * 0.12], [0.2, -0.5, (k - 1) * 0.14], [0.18, -0.9 - r() * 0.3, (k - 1) * 0.16]], 0.18, { segs: 8, nrm: [1, 0, 0] }), 'skin', 0x3a1c18, null, null, 1, leg, { grime: 0.5, freq: 6 });
  }
  const torso = K.group('torso', R, 0, 1.95, 0);
  K.add(lump('wpelv', 0.45, 2, 0.3, 3, 2, 1.0, 0.6, 1.5), 'rough', boneDk, [0, 0.05, 0], null, 1, torso, { grime: 0.5, freq: 4 });
  for (let k = 0; k < 14; k++) K.add(lump('wvert', 0.13, 1, 0.3, 4, k % 4, 1.2, 0.7, 1.2), 'rough', bone, [-0.38, 0.15 + k * 0.15, 0], null, 1, torso, { grime: 0.4 });
  K.at([0.05, 0.95, 0], null, 1, () => addRibcage(K, torso, 4.6, bone, 'rough', { n: 10 }));
  // the chest is packed with skulls
  for (let k = 0; k < 13; k++) { const y = 0.85 + r() * 1.0, z = (r() - 0.5) * 0.9, x = -0.15 + r() * 0.35; addSkull(K, torso, [x, y, z], [(r() - 0.5) * 0.6, Math.PI / 2 + (r() - 0.5) * 1.2, (r() - 0.5) * 0.6], 0.09 + r() * 0.03, { seed: k + 20 }); }
  // shoulders of fused skulls, candles burning on them
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) addSkull(K, torso, [(r() - 0.5) * 0.35, 1.72 + r() * 0.15, s * (0.85 + r() * 0.35)], [(r() - 0.5) * 0.8, Math.PI / 2 + (r() - 0.5) * 1.5, (r() - 0.5) * 0.8], 0.1 + r() * 0.03, { seed: 50 + k + s * 7 });
    for (let k = 0; k < 4; k++) addCandle(K, torso, [(r() - 0.5) * 0.4, 1.86, s * (0.9 + (r() - 0.5) * 0.4)], 0.14 + r() * 0.25, 0.04 + r() * 0.02, 300 + k + s * 10, { fs: 2.6 });
  }
  // the head: a great skull with burning sockets, crowned by a halo of long bones
  addSkull(K, torso, [0.32, 2.28, 0], [0.1, Math.PI / 2, 0], 0.3, { hi: true, seed: 77, eyes: 0xffffff, eyeMat: 'ember', pin: 0.11 });
  for (let k = 0; k < 15; k++) { const a = Math.PI * (0.08 + k / 14 * 0.84), b = (k % 3 - 1) * 0.55, d = new THREE.Vector3(Math.cos(a) * Math.sin(b) * 0.6 - 0.25, Math.sin(a), Math.cos(a) * Math.cos(b)).normalize(); addBone(K, torso, [0.1 + d.x * 0.4, 2.32 + d.y * 0.4, d.z * 0.4], [0.1 + d.x * 1.0, 2.32 + d.y * 1.0, d.z * 1.0], 0.024, bone); }
  K.add(tor(0.78, 0.022, 48, 4, Math.PI * 1.1), 'glow', hdr(0xffc060, 1.5), [-0.05, 2.3, 0], [0, 0, -0.05 * Math.PI], 1, torso);
  // a rotten red cope over its back
  K.add(drape('saintCope', [[0.75, 2.0], [1.15, 1.6], [1.25, 0.9], [1.3, 0.1], [1.35, -0.6]], { folds: 0.12, fk: 6, tatter: 0.4, open: 2.6, sx: 0.55, seed: 8, n: 40, rings: 22 }), 'skin', 0x4a1612, [-0.1, 0, 0], null, 1, torso, { grime: 0.55, freq: 4 });
  // the weak point: a heap of skulls on its back whose sockets glow like coals
  const crystals = K.group('crystals', torso, -0.85, 1.55, 0);
  for (let k = 0; k < 10; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.5; addSkull(K, crystals, [-0.1 - r() * 0.3, Math.sin(a) * d * 0.9 + 0.15, Math.cos(a) * d], [(r() - 0.5) * 0.5, -Math.PI / 2 + (r() - 0.5) * 1.2, (r() - 0.5) * 0.5], 0.1 + r() * 0.04, { seed: 90 + k, eyes: 0xffffff, eyeMat: 'ember', pin: 0.1 }); }
  for (let k = 0; k < 9; k++) K.add(lump('wember' + (k % 3), 0.06, 1, 0.3, 4, k % 3), 'ember', 0xffffff, [-0.25 - r() * 0.2, (r() - 0.5) * 0.9, (r() - 0.5) * 0.9], null, 1, crystals);
  // arms: bundles of bone, a skull at each elbow, a great skeletal hand
  for (const s of [-1, 1]) {
    const arm = K.group(s > 0 ? 'armR' : 'armL', torso, 0.05, 1.65, s * 1.25);
    bundle(arm, [0, 0.05, 0], [0.1, -0.95, 0], 3, 0.045, 0.16);
    wire(arm, [0.05, -0.45, 0], 0.13);
    addSkull(K, arm, [0.15, -1.0, 0], [0, Math.PI / 2, 0.3], 0.1, { seed: 60 + s });
    bundle(arm, [0.12, -1.05, 0], [0.25, -1.8, 0], 2, 0.04, 0.12);
    K.at([0.27, -1.82, 0], [0, 0, 0.15], [5.2, 5.2, -5.2 * s], () => addHand(K, arm, { long: 1.8, curl: 0.3, col: bone, mat: 'rough', lo: true, thin: 0.75, nails: false }));
  }
  return K.build();
}
export function warden() {
  const g = make('warden', buildWarden);
  const o = { group: g };
  for (const n of ['torso', 'armL', 'armR', 'legL', 'legR', 'crystals']) o[n] = by(g, n);
  return o;
}

// ---- THE DROWNED BRIDE: a pale serpent with a woman's face under a rotten veil; glowing slits down her neck
function buildWyrm() {
  const K = new Kit(), R = K.root;
  const skin = 0x8e999e, skin2 = 0x7f8a90, belly = 0xa8aca4;
  const head = K.group('head', R);
  head.scale.setScalar(1.3);
  K.add(lathe('brNeck', [[0, -1.05], [0.35, -0.95], [0.62, -0.55], [0.7, -0.1], [0.66, 0.35], [0.52, 0.7], [0.0, 0.85]], 26), 'gloss', skin, [-0.25, -0.05, 0], [0, 0, -Math.PI / 2], [1, 0.82, 0.88], head, { grime: 0.35, freq: 3 });
  const hk = headKit('bride', { skin: 0xa6b0b8, sock: 0.2, gaunt: 0.7, open: 0.35, gape: 0.18, mouthW: 0.22, lip: 0x4a4a62, nose: 0.1, veins: 0.7, blood: 0.7, seed: 21, mouthCol: 0x050303 }, 64, 48);
  addHead(K, head, hk, [0.42, 0.08, 0], Math.PI / 2, [-0.1, 0, 0], 0.62, {
    pin: 0.06, eyeCol: hdr(0xd8f4ff, 14), fn: () => {
      addTeeth(K, head, hk, { y: -0.5 + 0.15, w: 0.17, n: 8, dir: -1, seed: 5, gap: 0.15 });
      addHair(K, head, hk, { n: 60, len: 3.6, front: 0.0, mat: 'wet', col: 0x070707, wide: 0.16, seed: 23, down: [0, -0.6, -1] });
      // the veil: rotten lace over the crown, falling down her sides and trailing behind
      K.add(drape('brVeil', [[0.2, 1.22], [0.75, 1.0], [1.0, 0.5], [1.12, -0.3], [1.25, -1.6], [1.4, -2.6]], { folds: 0.16, fk: 8, tatter: 0.45, open: 2.9, seed: 6, n: 40, rings: 24 }), 'murk', 0xd8d2c4, [0, 0, -0.15], [0.2, -Math.PI / 2, 0], [1, 1.0, 1.15], head, { grime: 0.4, freq: 6 });
      for (let k = 0; k < 9; k++) { const a = -1 + k * 0.25; const c = hk.pt(Math.sin(a) * 0.8, 0.62, Math.cos(a) * 0.6, 0.05); K.add(lump('brflower' + (k % 3), 0.07, 1, 0.4, 6, k % 3), 'metal', 0x8a8a84, [c.x, c.y, c.z], null, 1, head, { grime: 0.6 }); }
    },
  });
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) K.add(cap(0.04, 0.42 - k * 0.04, 6), 'glow', hdr(0xb8f0ff, 3.4), [-0.5 - k * 0.14, -0.08, s * (0.62 - k * 0.012)], [0, 0, 0.25], 1, head, { own: 'gills' });
  // body segments (not parented): long pale scaled barrels, bruised, a ridge of rotten lace along the back
  const barrel = lathe('brseg', [[0, -1.35], [0.3, -1.32], [0.56, -1.15], [0.72, -0.8], [0.8, -0.2], [0.82, 0.6], [0.86, 0.95], [0.82, 1.15], [0.55, 1.27], [0, 1.3]], 28);
  const segG = sculpt('brseg2', barrel, (v, c) => {
    const s1 = Math.sin(v.y * 22) * Math.sin(Math.atan2(v.z, v.x) * 18);
    const k = 1 + 0.012 * s1 + (fbm(v.x * 3, v.y * 3, v.z * 3) - 0.5) * 0.04; v.x *= k; v.z *= k;
    c.setRGB(1, 1, 1).multiplyScalar(0.82 + 0.3 * fbm(v.x * 2, v.y * 2, v.z * 2));
    mixC(c, 0x56506a, sstep(0.56, 0.72, fbm(v.x * 1.4 + 3, v.y * 1.4, v.z * 1.4)) * 0.6);
    mixC(c, H.vein, Math.pow(1 - Math.abs(fbm(v.x * 4, v.y * 4 + 2, v.z * 4) - 0.5) * 2, 14) * 0.7);
    mixC(c, 0x2a2a30, sstep(0.3, 0.9, s1) * 0.15);
  });
  for (let i = 0; i < 14; i++) {
    const seg = K.group('seg' + i, R, -1.3 - i * 1.15, 0, 0);
    const sc = 1 - i * 0.05;
    K.add(segG, 'gloss', i % 2 ? skin : skin2, [0, 0, 0], [0, 0, -Math.PI / 2], [sc, sc, sc * 0.92], seg, { grime: 0.3, freq: 3 });
    K.add(cap(0.6, 1.3, 14), 'gloss', belly, [0, -0.3 * sc, 0], [0, 0, Math.PI / 2], [sc, sc * 0.55, sc * 0.95], seg, { grime: 0.35 });
    K.add(drape('brlace' + (i % 3), [[0.02, 0.0], [0.1, 0.3], [0.12, 0.55], [0.1, 0.75]], { folds: 0.3, tatter: 0.5, n: 16, rings: 8, seed: i % 3 + 2, sz: 6 }), 'skin', 0xcfc8b8, [0, 0.68 * sc, 0], null, [sc, sc, sc * 0.3], seg, { grime: 0.5, freq: 6 });
    for (const s of [-1, 1]) for (let k = 0; k < 2; k++) K.add(sph(0.04, 6, 4), 'glow', hdr(0xb8f0ff, 1.8), [-0.4 + k * 0.8, 0.05, s * 0.8 * sc], null, [1, 0.6, 0.4], seg);
  }
  return K.build();
}
export function wyrm() {
  const g = make('wyrm', buildWyrm);
  return { group: g, head: by(g, 'head'), gills: by(g, 'gills'), segs: Array.from({ length: 14 }, (_, i) => by(g, 'seg' + i)) };
}

// ---- THE RED HEART: a giant beating heart of wet muscle, its great vessels torn off, two huge grey-red fists
function buildHeart() {
  const K = new Kit(), R = K.root;
  const torso = K.group('torso', R);
  const heartG = sculpt('redHeart', sph(1, 72, 56), (v, c) => {
    const d = v.clone().normalize();
    // a lopsided cone: broad base up and to the right, the apex down and to the left
    const apex = sstep(0.1, -1, d.y);
    let x = d.x * (1 - apex * 0.55) + apex * -0.45, y = d.y * (d.y < 0 ? 1.25 : 0.95), z = d.z * (1 - apex * 0.5);
    const groove = Math.exp(-((d.x * 0.8 + d.y * 0.55 - 0.1) ** 2) / 0.012) * sstep(-0.2, 0.4, d.z);
    let r = 1 + 0.08 * gss(d.x, d.y, 0.55, 0.45, 0.4, 0.35) + 0.06 * gss(d.x, d.y, -0.5, 0.55, 0.35, 0.3) - 0.05 * groove + (fbm(d.x * 3, d.y * 3, d.z * 3) - 0.5) * 0.1;
    v.set(x * r * 3.0, y * r * 2.8, z * r * 2.1);
    const f = fbm(d.x * 5, d.y * 5, d.z * 5), vv = fbm(d.x * 8 + 3, d.y * 8, d.z * 8);
    c.setRGB(1, 1, 1).multiplyScalar(0.75 + 0.4 * f);
    mixC(c, H.fat, sstep(0.35, 0.8, groove + sstep(0.58, 0.74, fbm(d.x * 2.5 + 7, d.y * 2.5, d.z * 2.5)) * 0.8) * 0.8); mixC(c, 0x3a2030, sstep(0.5, 0.7, fbm(d.x * 1.5 + 2, d.y * 1.5, d.z * 1.5)) * 0.5);
    mixC(c, 0x2a0410, Math.pow(1 - Math.abs(vv - 0.5) * 2, 16) * 0.9);
    mixC(c, 0x14020a, sstep(0.7, 0.95, fbm(d.x * 12, d.y * 12, d.z * 12)) * 0.4);
  });
  K.add(heartG, 'wet', 0x401210, [0, 0, 0], null, 1, torso, { grime: 0.15, freq: 1.5 });
  // coronary arteries and veins over the surface
  const r = rng(808);
  const onHeart = (a, b) => { const d = new THREE.Vector3(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)); const apex = sstep(0.1, -1, d.y); return [+(d.x * (1 - apex * 0.55) - apex * 0.45) * 3.08, d.y * (d.y < 0 ? 1.25 : 0.95) * 2.88, d.z * (1 - apex * 0.5) * 2.18]; };
  for (let k = 0; k < 9; k++) {
    const a0 = r() * Math.PI * 2, pts = [];
    for (let j = 0; j < 6; j++) pts.push(onHeart(a0 + (r() - 0.5) * 0.5 + j * 0.15, 0.5 + j * 0.38).map((v) => +v.toFixed(3)));
    K.add(ttube(pts, [0.09, 0.08, 0.06, 0.03], { segs: 20, radial: 6, noise: 0.15, nf: 4 }), 'wet', k % 3 ? 0x6a0a10 : 0x3a1440, null, null, 1, torso, { grime: 0.15 });
  }
  // the torn-open chamber on its front: ragged lips, teeth, the glowing core inside
  for (let k = 0; k < 14; k++) {
    const a = k / 14 * Math.PI * 2 + (r() - 0.5) * 0.3, rr = 0.85 + r() * 0.25, d = new THREE.Vector3(Math.cos(a), Math.sin(a), 0.75).normalize();
    const qq = new THREE.Quaternion().setFromUnitVectors(_up, d), ee = new THREE.Euler().setFromQuaternion(qq);
    K.add(lump('hrlip' + (k % 3), 0.22 + r() * 0.2, 2, 0.4, 3, k % 3, 1, 1.2 + r(), 0.5), 'wet', k % 2 ? 0x4a0a0c : 0x3a0608, [Math.cos(a) * rr * 1.1, 0.2 + Math.sin(a) * rr, 1.72 + r() * 0.1], [ee.x + (r() - 0.5) * 0.6, ee.y, ee.z + r()], 1, torso, { grime: 0.2 });
    if (r() < 0.7) K.add(TOOTH(), 'gloss', new THREE.Color(H.tooth).lerp(_tc.set(H.toothDk), r()), [Math.cos(a) * 0.74, 0.2 + Math.sin(a) * 0.74, 1.88], [ee.x + 0.7 + (r() - 0.5) * 0.4, ee.y, ee.z + (r() - 0.5) * 0.5], [0.13, 0.14 + r() * 0.08, 0.1], torso, { grime: 0.3 });
  }
  K.add(sph(0.9, 18, 12), 'glow', hdr(0xff1a0c, 1.6), [0, 0.2, 1.4], null, [1, 1, 0.6], torso);
  K.add(lump('hrcore', 0.62, 3, 0.25, 3, 2), 'core', 0xffffff, [0, 0.2, 1.75], [0.3, 0.5, 0], 1, torso, { own: 'core' });
  // the head: the great vessels torn off at the top (aorta, pulmonary trunk, veins), their open ends dark
  const head = K.group('head', R, 0, 3.0, 0.4);
  const vessel = (pts, rad, col) => { K.add(ttube(pts, rad, { segs: 24, radial: 16, cap: 0, noise: 0.06, nf: 2 }), 'wet', col, null, null, 1, head, { grime: 0.2, freq: 2 }); const e = V3(pts[pts.length - 1]); K.add(cyl(rad[rad.length - 1] * 0.82, rad[rad.length - 1] * 0.82, 0.05, 16), 'rough', 0x0a0202, [e.x, e.y, e.z], null, 1, head, { grime: 0 }); };
  vessel([[0.6, -1.4, 0], [0.7, -0.2, 0.1], [0.4, 0.9, -0.2], [-0.4, 1.3, -0.5], [-1.1, 0.8, -0.7], [-1.3, 0.2, -0.8]], [0.62, 0.58, 0.55, 0.52], 0x8a2a24);
  vessel([[0.15, 0.6, -0.4], [0.25, 1.4, -0.45], [0.3, 1.9, -0.5]], [0.2, 0.18, 0.16], 0x8a2a24);
  vessel([[-0.3, 0.9, -0.55], [-0.35, 1.6, -0.6], [-0.3, 2.1, -0.65]], [0.18, 0.16, 0.14], 0x8a2a24);
  vessel([[-0.2, -1.2, 0.5], [-0.4, -0.2, 0.6], [-0.7, 0.6, 0.4], [-1.0, 1.1, 0.2]], [0.55, 0.5, 0.45], 0x6a2a4a);
  vessel([[1.6, -1.6, -0.6], [1.9, -0.6, -0.8], [2.0, 0.6, -0.9]], [0.42, 0.38, 0.34], 0x3a2a5a);
  for (let k = 0; k < 6; k++) K.add(ttube([[(r() - 0.5) * 2, -0.6, (r() - 0.5)], [(r() - 0.5) * 2.4, 0.1 + r() * 0.5, (r() - 0.5) * 1.2], [(r() - 0.5) * 2.8, 0.4 + r() * 0.6, (r() - 0.5) * 1.4]].map((p) => p.map((v) => +v.toFixed(3))), [0.08, 0.06, 0.02], { segs: 10, radial: 5 }), 'wet', 0xc8b0a0, null, null, 1, head, { grime: 0.3 });   // torn ligaments
  // two huge fists: separate groups, positioned by the renderer; grey-red skin, the forearms torn off above
  for (const s of [-1, 1]) {
    const fist = K.group(s > 0 ? 'fistR' : 'fistL', R, s * 5, -2, 1.0);
    const fc = 0x7a5852, fd = 0x5a3a36;
    K.at(null, [0, -s * 0.25, 0], [s, 1, 1], () => {
      K.add(lump('fistPalm', 0.5, 3, 0.1, 2.5, 4, 1.0, 0.95, 0.62), 'gloss', fc, [0, 0.15, -0.05], null, 1, fist, { grime: 0.35, freq: 3 });
      for (let k = 0; k < 4; k++) {
        const x = -0.39 + k * 0.26, L = k === 1 || k === 2 ? 1 : 0.88;
        const pts = [[x, -0.22, -0.08], [x * 1.02, -0.5 * L, 0.06], [x * 1.02, -0.52 * L, 0.38], [x, -0.3 * L, 0.55], [x * 0.98, -0.04, 0.48]];
        K.add(ttube(pts, [0.13, 0.135, 0.12, 0.125, 0.11, 0.1], { segs: 18, radial: 10, noise: 0.06, nf: 5 }), 'gloss', fc, null, null, 1, fist, { grime: 0.35, freq: 4 });
        K.add(sph(0.14, 12, 8), 'gloss', fd, [x, -0.3, -0.1], null, [1, 0.85, 1], fist, { grime: 0.4 });
        K.add(sph(0.12, 10, 8), 'gloss', fd, [x * 1.02, -0.5 * L, 0.2], null, [1, 0.8, 0.9], fist, { grime: 0.4 });
      }
      K.add(ttube([[0.48, 0.25, 0.12], [0.55, 0.0, 0.35], [0.38, -0.2, 0.6], [0.05, -0.24, 0.64]], [0.17, 0.16, 0.14, 0.11], { segs: 16, radial: 10, noise: 0.05, nf: 5 }), 'gloss', fc, null, null, 1, fist, { grime: 0.35, freq: 4 });
      K.add(rbox(0.16, 0.05, 0.13, 0.03), 'gloss', 0x4a3830, [0.0, -0.25, 0.73], [0.3, -0.3, 0], 1, fist, { grime: 0.3 });
      for (let k = 0; k < 4; k++) K.rod('gloss', 0x6a4a44, [-0.3 + k * 0.2, 0.5, -0.32], [-0.38 + k * 0.26, -0.18, -0.25], 0.035, fist, 6);
    });
    K.add(ttube([[0, 0.45, -0.05], [-s * 0.05, 1.4, -0.22], [-s * 0.1, 2.9, -0.4]], [0.38, 0.47, 0.52, 0.48], { segs: 16, radial: 18, cap: 0, noise: 0.08, nf: 3 }), 'gloss', 0x7a5852, null, null, 1, fist, { grime: 0.35, freq: 3 });
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.42, 1.3, Math.sin(a) * 0.42], [Math.cos(a + 0.3) * 0.48, 2.0, Math.sin(a + 0.3) * 0.48 - 0.2], [Math.cos(a + 0.1) * 0.52, 2.8, Math.sin(a + 0.1) * 0.52 - 0.4]], 0.035, { segs: 12, radial: 5 }), 'gloss', 0x4a2a3a, null, null, 1, fist, { grime: 0.2 }); }
    K.add(cyl(0.5, 0.5, 0.06, 18), 'wet', 0x5a0a0c, [-s * 0.1, 2.92, -0.4], null, 1, fist, { grime: 0.2 });
    K.add(cyl(0.12, 0.13, 0.4, 10), 'rough', H.bone, [-s * 0.1, 3.05, -0.4], null, 1, fist, { grime: 0.3 });
    for (let k = 0; k < 6; k++) K.add(ribbon([[-s * 0.1 + Math.cos(k) * 0.45, 2.92, -0.4 + Math.sin(k) * 0.45], [-s * 0.1 + Math.cos(k) * 0.5, 2.7, -0.4 + Math.sin(k) * 0.5], [-s * 0.1 + Math.cos(k) * 0.52, 2.45 - r() * 0.3, -0.4 + Math.sin(k) * 0.52]], 0.22, { segs: 5, nrm: [Math.cos(k), 0, Math.sin(k)] }), 'wet', 0x6a1414, null, null, 1, fist, { grime: 0.2 });
  }
  return K.build();
}
export function heart() {
  const g = make('heart', buildHeart);
  const core = by(g, 'core');
  if (core) core.material = MATS.core.clone();
  return { group: g, torso: by(g, 'torso'), core, fistL: by(g, 'fistL'), fistR: by(g, 'fistR'), head: by(g, 'head') };
}

// ================================================================== SHOCK HORROR: FIGURES, FACES AND REMAINS
// Every figure below is built once per type with its own copies of the shared materials (listed in `mats`, so the
// scare engine can fade a whole figure); clones share geometry. Figures face +X, feet at y = 0, unless noted.
const eul = (x, y, z) => { const e = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(x), V3(y), V3(z))); return [e.x, e.y, e.z]; };
// rotation that points a hand's fingers along F with its palm facing P
const handRot = (F, P) => { const Y = V3(F).negate(), Z = V3(P), X = new THREE.Vector3().crossVectors(Y, Z); return eul(X.toArray(), Y.toArray(), Z.toArray()); };
const headMatrix = (p, yaw, rot, s) => new THREE.Matrix4().compose(V3(p), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)), new THREE.Vector3(1, 1, 1)).multiply(new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(s, s, s)));
// a head whose lower jaw is its own pivot (hinged in front of the ears). upper(head)/lower(jaw) add extras in unit head coords
function addSplitHead(K, headGrp, hk, p, yaw, rot, s, o = {}) {
  const my = hk.o.mouthY ?? -0.5, lift = o.lift || 0;
  const base = geo(`sphNI${hk.w},${hk.h}`, () => sph(1, hk.w, hk.h).toNonIndexed());
  const yl = (x) => my + Math.min(1, Math.abs(x) / 0.72) * (-0.08 - my) + lift, _n = new THREE.Vector3();
  const halves = geo(`jawC${hk.w},${hk.h},${my},${lift}`, () => clipAll(base, [(q) => { _n.copy(q).normalize(); return yl(_n.x) - _n.y; }, (q) => { _n.copy(q).normalize(); return _n.z + 0.3; }]));
  const key = o.key || hk.g.uuid;
  const up = sculpt('hU' + key, halves[0], (v, c) => { v.normalize(); hk.f(v, c); }), lo = sculpt('hL' + key, halves[1], (v, c) => { v.normalize(); hk.f(v, c); });
  const M = headMatrix(p, yaw, rot, s), J = new THREE.Vector3(0, -0.12, -0.2).applyMatrix4(M);
  const jaw = K.group(o.jawName || 'jaw', headGrp, J.x, J.y, J.z);
  const inUnit = (grp, off, fn) => K.at(off, null, 1, () => K.at(p, [0, yaw, 0], 1, () => K.at(null, rot, s, fn)));
  const mw = hk.o.mouthW ?? 0.24, rim = [];
  if (o.rim !== false) for (const sd of [-1, 1]) { const pts = []; for (let k = 0; k <= 10; k++) { const x = sd * (mw * 0.92 + (0.74 - mw * 0.92) * k / 10), y = yl(x), c = hk.pt(x, y, Math.sqrt(Math.max(0.01, 1 - x * x - y * y)), -0.012); pts.push([+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)]); } rim.push(pts); }
  const addRim = (grp) => { for (const pts of rim) K.add(ttube(pts, [0.024, 0.02, 0.012], { segs: 20, radial: 6 }), 'wet', o.rimCol ?? 0x3a0a0a, null, null, 1, grp, { grime: 0.2 }); };
  inUnit(headGrp, null, () => { K.add(up, o.mat || 'gloss', 0xffffff, null, null, 1, headGrp, { grime: o.grime ?? 0.12, freq: o.freq ?? 30 }); addRim(headGrp); if (o.upper) o.upper(headGrp); });
  inUnit(jaw, [-J.x, -J.y, -J.z], () => { K.add(lo, o.mat || 'gloss', 0xffffff, null, null, 1, jaw, { grime: o.grime ?? 0.12, freq: o.freq ?? 30 }); addRim(jaw); if (o.lower) o.lower(jaw); });
  return { jaw, M, inUnit };
}
// ---- miner's clothes over a figure: shirt, braces, trousers, boots (rags at the hems)
function minerClothes(K, F, o = {}) {
  const { torso, tl, ls, wd } = F, r = rng(o.seed ?? 3);
  K.add(drape('mShirt' + ls.toFixed(2) + wd, [[0.06 * wd, tl * 1.02], [0.19 * wd, tl * 0.9], [0.2 * wd, tl * 0.7], [0.17 * wd, tl * 0.35], [0.16 * wd, 0.0], [0.18 * wd, -0.1]], { folds: 0.07, fk: 8, tatter: 0.12, sx: 0.66, seed: o.seed ?? 3, n: 30, rings: 16 }), 'skin', o.shirt ?? 0x5a4a3c, null, null, 1, torso, { grime: 0.5, freq: 14 });
  K.add(drape('mPants' + ls.toFixed(2) + wd, [[0.15 * wd, 0.04], [0.17 * wd, -0.1], [0.18 * wd, -0.18]], { folds: 0.05, n: 26, rings: 6, sx: 0.66 }), 'rough', o.pants ?? 0x2a2c30, null, null, 1, torso, { grime: 0.5 });
  for (const s of [-1, 1]) {
    K.add(ribbon([[0.1 * wd, tl * 0.98, s * 0.09 * wd], [0.14 * wd, tl * 0.6, s * 0.08 * wd], [0.13 * wd, 0.02, s * 0.07 * wd]], 0.025, { segs: 8, nrm: [1, 0, 0], cup: 0.1 }), 'gloss', 0x2a1a12, null, null, 1, torso, { grime: 0.4 });
    const leg = s > 0 ? F.legR : F.legL;
    if (leg) {
      K.add(ttube([[0, 0.02, 0], [0.03, -0.43 * ls, 0], [0.01, -0.78 * ls, 0]], [0.085 * wd, 0.066 * wd, 0.06 * wd, 0.055 * wd], { segs: 14, radial: 12, noise: 0.06, nf: 20, cap: 0 }), 'rough', o.pants ?? 0x2a2c30, null, null, 1, leg, { grime: 0.5, freq: 12 });
      const floor = -(F.hipY - 0.03);
      K.add(rbox(0.27, 0.13, 0.11 * wd, 0.04), 'gloss', 0x1c140e, [0.05, floor + 0.07, 0], [0, 0, o.footPitch ? -o.footPitch : 0], 1, leg, { grime: 0.45 });
    }
    const arm = s > 0 ? F.armR : F.armL;
    if (arm) K.add(ttube([[0, 0.03, 0], [0.0, -0.18 * ls, 0.0], [0.01, -0.36 * ls, 0.0]], [0.06 * wd, 0.055 * wd, 0.05 * wd], { segs: 8, radial: 10, noise: 0.08, nf: 25, cap: 0 }), 'skin', o.shirt ?? 0x5a4a3c, null, null, 1, arm, { grime: 0.5 });
  }
}

// ---- 1. the pale woman: a long nightgown, hair hanging over her face, arms hanging too long
function buildPaleWoman() {
  const K = new Kit(), R = K.root;
  const hk = headKit('paleWoman', { skin: 0xa2abb2, sock: 0.2, gaunt: 0.8, open: 0.2, gape: 0.12, mouthW: 0.2, nose: 0.1, veins: 0.45, blood: 0.55, seed: 31 }, 48, 36);
  const rot = [0.4, 0.25, 0.16], hs = 0.097;
  const F = figure(K, R, { H: 1.7, wd: 0.86, skin: 0x98a1a8, ribs: 0.4, head: hk, hs, headRot: rot, headOpts: { pin: 0.1, eyeCol: hdr(0xe8f0ff, 14) }, arms: { len: 1.2, rot: [[0.12, 0, 0], [-0.12, 0, 0]], elbow: [0.06, 0.1], long: 1.6, curl: 0.16 }, legBend: 0.02 });
  const hair = K.group('hair', F.head);
  K.at([0.012, hs, 0], [0, Math.PI / 2, 0], 1, () => K.at(null, rot, hs, () => addHair(K, hair, hk, { n: 80, len: 6.2, front: 0.5, mat: 'wet', col: 0x070707, wide: 0.22, seed: 12 })));
  const gown = paint('pwGownP', drape('pwGown', [[0.075, 0.6], [0.19, 0.53], [0.2, 0.46], [0.165, 0.3], [0.15, 0.18], [0.165, 0.0], [0.19, -0.35], [0.22, -0.7], [0.25, -0.87]], { folds: 0.1, fk: 11, tatter: 0.16, sx: 0.66, seed: 5, n: 48, rings: 30 }), (p, c) => {
    c.setRGB(1, 1, 1).multiplyScalar(0.85 + 0.25 * fbm(p.x * 9, p.y * 9, p.z * 9));
    mixC(c, 0x3a2a1a, sstep(-0.5, -0.86, p.y) * 0.6);
    mixC(c, H.blood, sstep(0.5, 0.62, fbm(p.x * 6 + 2, p.y * 4, p.z * 6)) * sstep(0.05, 0.12, p.x) * sstep(-0.4, 0.45, p.y) * 0.95);
    mixC(c, H.bloodDry, sstep(0.6, 0.7, fbm(p.x * 14, p.y * 14 + 5, p.z * 14)) * 0.7);
  });
  K.add(gown, 'skin', H.gown, null, null, 1, F.torso, { grime: 0.3, freq: 10 });
  for (const s of [-1, 1]) K.add(ttube([[0, 0.03, 0], [0.005, -0.08, 0], [0.01, -0.15, 0]], [0.062, 0.06, 0.066], { segs: 6, radial: 12, cap: 0, noise: 0.1, nf: 30 }), 'skin', H.gown, null, null, 1, s > 0 ? F.armR : F.armL, { grime: 0.4 });
  return ownMats(K.build());
}
export function paleWoman() { return named(make('paleWoman', buildPaleWoman), ['head', 'hair', 'armL', 'armR', 'torso']); }

// ---- 2. the ghoul crawler: emaciated, on all fours, spine arched high, a lipless jaw that opens (jaw.rotation.z < 0)
function buildGhoulCrawler() {
  const K = new Kit(), R = K.root;
  const skin = 0x626a5e;
  const spine = K.group('spine', R, -0.42, 0.68, 0);
  const sp = [[-0.12, -0.03, 0], [0.05, 0.08, 0], [0.38, 0.17, 0], [0.66, 0.04, 0], [0.84, -0.07, 0]];
  K.add(ttube(sp, [0.1, 0.085, 0.1, 0.125, 0.12, 0.07, 0.045], {
    segs: 30, radial: 18, sx: 0.72, ref: [0, 1, 0], key: 'ghoulBody', noise: 0.04, nf: 18,
    fn: (t, a) => { const down = sstep(-0.2, -0.9, Math.cos(a)); return 1 + (t > 0.45 && t < 0.8 ? 0.06 * Math.pow(Math.max(0, Math.sin((t - 0.45) / 0.35 * Math.PI * 6)), 3) * (1 - 0.5 * down) : 0) - (t > 0.2 && t < 0.45 ? 0.16 * down : 0) + 0.06 * Math.exp(-((t - 0.72) ** 2) / 0.004) * Math.exp(-((Math.abs(a - Math.PI / 2) - 1.0) ** 2) / 0.1); },
  }), 'gloss', skin, null, null, 1, spine, { grime: 0.35, freq: 16 });
  const curve = new THREE.CatmullRomCurve3(sp.map(V3));
  for (let k = 0; k < 22; k++) { const t = 0.05 + k / 22 * 0.85, p = curve.getPointAt(t), rr = interp([0.1, 0.085, 0.1, 0.125, 0.12, 0.07, 0.045], t); K.add(lump('gvert', 0.018, 1, 0.3, 6, k % 4, 1.2, 0.9, 1.1), 'gloss', 0x9a9a8c, [p.x, p.y + rr * 0.68, 0], null, 1, spine, { grime: 0.3 }); }
  for (let k = 0; k < 5; k++) K.add(ribbon([[-0.08 + k * 0.02, -0.02, (k - 2) * 0.05], [-0.1 + k * 0.02, -0.1, (k - 2) * 0.06], [-0.12 + k * 0.03, -0.2 - (k % 2) * 0.06, (k - 2) * 0.065]], 0.06, { segs: 6, nrm: [0, 0, 1] }), 'skin', H.rag, null, null, 1, spine, { grime: 0.6 });
  const head = K.group('head', spine, 0.86, -0.08, 0);
  const hk = headKit('ghoul', { skin: 0x5e665a, sock: 0.25, gaunt: 1.3, open: 0.3, gape: 0.2, mouthW: 0.3, nose: -0.18, lipless: true, veins: 0.5, rot: 0.3, wide: 0.78, long: 1.12, seed: 41, mouthCol: 0x220606 }, 48, 36);
  const S = addSplitHead(K, head, hk, [0.1, 0.02, 0], Math.PI / 2, [-0.5, 0, 0], 0.105, {
    key: 'ghoul',
    lower: (jaw) => addTeeth(K, jaw, hk, { y: -0.5 - 0.22, w: 0.25, n: 11, dir: 1, seed: 6, gap: 0.08, size: 1.05, black: 0.2 }),
    upper: () => { addTeeth(K, head, hk, { y: -0.5 + 0.2, w: 0.27, n: 12, dir: -1, seed: 4, gap: 0.08, size: 1.1, black: 0.2 }); for (const sd of [-1, 1]) { const c = hk.surf(sd * EYX, EYY); K.add(sph(1, 8, 6), 'glow', EYE_SICK, [c.x * 0.97, c.y, c.z + 0.05], null, 0.1, head); } for (const sd of [-1, 1]) { const c = hk.pt(sd, 0.05, -0.15); K.add(cone(0.16, 0.6, 6), 'gloss', skin, [c.x, c.y + 0.15, c.z - 0.1], [-0.6, 0, -sd * 1.0], [1, 1, 0.35], head); } },
  });
  for (let k = 0; k < 6; k++) { const c = hk.pt((k - 2.5) * 0.15, 0.9, -0.2); K.at([0.1, 0.02, 0], [0, Math.PI / 2, 0], 1, () => K.at(null, [-0.5, 0, 0], 0.105, () => K.add(ribbon([[c.x, c.y, c.z], [c.x * 1.3, c.y - 0.3, c.z - 0.9], [c.x * 1.5, c.y - 1.8, c.z - 1.2]], 0.08, { segs: 8, nrm: [0, 1, 0] }), 'wet', 0x0a0a0a, null, null, 1, head, { grime: 0.2 }))); }
  // limbs: arms reaching down to splayed hands, legs folded up like a spider's with the knees above the hips
  const limbs = [];
  for (const [nm, px, py, pz, front] of [['frontL', -0.04 + 0.46, 0.62, -0.15, true], ['frontR', 0.42, 0.62, 0.15, true], ['backL', -0.48, 0.66, -0.1, false], ['backR', -0.48, 0.66, 0.1, false]]) {
    const L = K.group(nm, R, px, py, pz), s = Math.sign(pz);
    limbs.push(L);
    if (front) {
      const elbow = [0.1, -0.3, s * 0.1], wrist = [0.22, -0.56, s * 0.06];
      K.add(ttube([[0, 0.02, 0], [0.04, -0.15, s * 0.06], elbow, [0.17, -0.44, s * 0.08], wrist], [0.042, 0.036, 0.028, 0.032, 0.026, 0.022, 0.018], { segs: 20, radial: 9, noise: 0.06, nf: 30 }), 'gloss', skin, null, null, 1, L, { grime: 0.35 });
      K.add(sph(0.02, 8, 6), 'gloss', 0x9a9a8c, elbow, null, [1, 1.2, 1], L);
      K.at([wrist[0], wrist[1] + 0.01, wrist[2]], handRot([1, -0.15, s * 0.15], [0, -1, 0]), [s > 0 ? -1 : 1, 1, 1], () => addHand(K, L, { long: 1.8, curl: 0.38, curls: [0.2, 0.9, 0.8], spread: 0.12, col: skin, thin: 0.85, nail: 0x2a2620 }));
    } else {
      const knee = [0.02, 0.16, s * 0.26], ankle = [-0.28, -0.6, s * 0.2];
      K.add(ttube([[0, 0.02, 0], [0.02, 0.1, s * 0.13], knee, [-0.14, -0.2, s * 0.25], ankle], [0.07, 0.055, 0.04, 0.042, 0.032, 0.026, 0.022], { segs: 20, radial: 9, noise: 0.05, nf: 25 }), 'gloss', skin, null, null, 1, L, { grime: 0.35 });
      K.add(sph(0.032, 8, 6), 'gloss', 0x9a9a8c, knee, null, [1.1, 1, 1], L);
      K.add(lump('gfoot', 0.065, 2, 0.12, 5, 7, 1.3, 0.38, 0.55), 'gloss', skin, [ankle[0] - 0.06, -0.635, ankle[2]], [0, 0.15 * s, 0], 1, L, { grime: 0.4 });
      for (let k = 0; k < 5; k++) K.add(ttube([[ankle[0] - 0.12, -0.645, ankle[2] + (k - 2) * 0.014], [ankle[0] - 0.165, -0.648, ankle[2] + (k - 2) * 0.017], [ankle[0] - 0.19, -0.656, ankle[2] + (k - 2) * 0.019]], [0.008, 0.006, 0.004], { segs: 5, radial: 5 }), 'gloss', skin, null, null, 1, L);
    }
  }
  return ownMats(K.build());
}
export function ghoulCrawler() {
  const g = make('ghoulCrawler', buildGhoulCrawler);
  const o = named(g, ['head', 'jaw', 'spine']);
  o.limbs = ['frontL', 'frontR', 'backL', 'backR'].map((n) => by(g, n));
  return o;
}

// ---- 3. the tall man: 3.1 m, impossibly thin, a long black coat, a smooth face with nothing on it
function buildTallMan() {
  const K = new Kit(), R = K.root;
  const hk = headKit('tallMan', { skin: 0xd4d6d6, sock: 0.035, dark: 0, nose: 0, brow: 0, lipless: true, noMouth: true, gaunt: 0.3, wide: 0.68, long: 1.28, chin: 0.02, seed: 61 }, 40, 30);
  const coat = 0x121114;
  const F = figure(K, R, { H: 3.1, wd: 0.62, skin: 0xc8cccc, armCol: coat, armMat: 'rough', legCol: 0x0e0e10, legMat: 'rough', footCol: 0x070707, ribs: 0, head: hk, hs: 0.12, headRot: [0.12, 0, 0.06], headOpts: { eyes: 'none' }, arms: { len: 1.15, elbow: [0.05, 0.05], long: 2.1, curl: 0.14 }, legBend: 0.03 });
  const { torso, tl, ls } = F;
  const coatG = drape('tmCoat', [[0.055, tl * 1.04], [0.14, tl * 0.95], [0.15, tl * 0.82], [0.12, tl * 0.45], [0.12, 0.0], [0.15, -0.35 * ls], [0.19, -0.62 * ls]], { folds: 0.09, fk: 7, tatter: 0.2, open: 0.55, sx: 0.66, seed: 9, n: 44, rings: 30, flare: 0.3 });
  K.add(coatG, 'skin', coat, null, null, 1, torso, { grime: 0.35, freq: 6 });
  K.add(drape('tmCollar', [[0.07, tl + 0.14], [0.08, tl + 0.06], [0.1, tl * 0.98]], { n: 24, rings: 4, open: 0.8, sx: 0.8 }), 'skin', 0x0c0b0d, null, null, 1, torso, { grime: 0.3 });
  return ownMats(K.build());
}
export function tallMan() { return named(make('tallMan', buildTallMan), ['head', 'armL', 'armR', 'legL', 'legR']); }

// ---- 4. the ghost child: 1.15 m, an old smock, the head on its own pivot at the neck (it can turn right round)
function buildGhostChild() {
  const K = new Kit(), R = K.root;
  const hk = headKit('ghostChild', { skin: 0xa8b1b8, sock: 0.21, gaunt: 0.3, open: 0.1, gape: 0.08, mouthW: 0.18, nose: 0.07, veins: 0.3, wide: 0.86, long: 1.0, chin: 0.02, seed: 71 }, 44, 32);
  const rot = [0.25, 0, 0.1], hs = 0.086;
  const F = figure(K, R, { H: 1.15, wd: 0.66, skin: 0x9ea7ae, ribs: 0.25, head: hk, hs, headRot: rot, headOpts: { pin: 0.11, eyeCol: hdr(0xe8f0ff, 14) }, arms: { len: 1.08, rot: [[0.14, 0, 0], [-0.14, 0, 0]], elbow: [0.04, 0.04], long: 1.2, curl: 0.25 } });
  K.at([0.012, hs, 0], [0, Math.PI / 2, 0], 1, () => K.at(null, rot, hs, () => addHair(K, F.head, hk, { n: 60, len: 2.3, front: 0.35, mat: 'wet', col: 0x0d0b0a, wide: 0.24, seed: 72 })));
  const { torso, tl } = F;
  const smock = paint('gcSmockP', drape('gcSmock', [[0.05, tl * 1.03], [0.125, tl * 0.92], [0.125, tl * 0.7], [0.115, tl * 0.3], [0.13, 0.0], [0.15, -0.22], [0.17, -0.33]], { folds: 0.1, fk: 9, tatter: 0.22, sx: 0.7, seed: 13, n: 40, rings: 22 }), (p, c) => {
    c.setRGB(1, 1, 1).multiplyScalar(0.82 + 0.3 * fbm(p.x * 12, p.y * 12, p.z * 12));
    mixC(c, 0x4a3a2a, sstep(-0.15, -0.33, p.y) * 0.6);
    mixC(c, H.bloodDry, sstep(0.6, 0.7, fbm(p.x * 8 + 9, p.y * 8, p.z * 8)) * 0.8);
  });
  K.add(smock, 'skin', 0xa8a294, null, null, 1, torso, { grime: 0.35, freq: 12 });
  for (const s of [-1, 1]) K.add(ttube([[0, 0.02, 0], [0.003, -0.06, 0], [0.006, -0.1, 0]], [0.045, 0.043, 0.048], { segs: 5, radial: 12, cap: 0, noise: 0.12, nf: 30 }), 'skin', 0xa8a294, null, null, 1, s > 0 ? F.armR : F.armL, { grime: 0.4 });
  return ownMats(K.build());
}
export function ghostChild() { return named(make('ghostChild', buildGhostChild), ['head', 'armL', 'armR']); }

// ---- 5. the hanged man: origin at the rope's top anchor; the noose hangs `rope` m down to his neck (swing group.rotation.z)
function buildHangedMan(rope) {
  const K = new Kit(), R = K.root;
  const body = K.group('body', R, 0, -rope - 1.55, 0);
  const hk = headKit('hanged', { skin: 0x8e8ea2, lip: 0x3a2a4a, sock: 0.14, open: 0.35, gape: 0.16, mouthW: 0.22, gaunt: 0.5, rot: 0.25, veins: 0.8, bruise: 0x3a2a4a, seed: 81 }, 44, 32);
  const F = figure(K, body, { H: 1.75, wd: 0.95, skin: 0x8a8a9c, ribs: 0.2, head: hk, hs: 0.1, headRot: [0.55, 0.2, 0.55], headOpts: { eyes: 'milk', milk: 0xb8bcb4, ears: true }, arms: { len: 1.0, elbow: [0.08, 0.1], long: 1.3, curl: 0.35 }, legBend: 0.06, feet: false });
  minerClothes(K, F, { seed: 4, footPitch: 0.9 });
  for (let k = 0; k < 5; k++) { const z = (k - 2) * 0.06; K.add(ribbon([[0.1, 0.04, z], [0.14, -0.08, z * 1.1], [0.12, -0.2 - (k % 2) * 0.05, z * 1.15]], 0.05, { segs: 5, nrm: [1, 0, 0] }), 'skin', 0x4a3c30, null, null, 1, F.torso, { grime: 0.6 }); }
  // the rope: from the anchor down to a knot behind his ear, the noose biting under the jaw
  const neck = new THREE.Vector3(0.03, -rope + 0.02, 0);
  const pts = [[0, 0, 0], [0.004, -rope * 0.4, 0.004], [-0.01, -rope * 0.8, 0.01], [-0.045, -rope + 0.14, 0.05]];
  K.add(ttube(pts, 0.016, { segs: Math.max(12, Math.round(rope * 10)), radial: 7, noise: 0.18, nf: 90 }), 'rough', 0x7a6a4a, null, null, 1, R, { grime: 0.4, freq: 40 });
  K.add(tor(0.075, 0.016, 22, 6), 'rough', 0x6e5e40, [neck.x, neck.y, neck.z], [Math.PI / 2 - 0.3, 0.2, 0.45], [1, 1.15, 1], R, { grime: 0.4 });
  for (let k = 0; k < 6; k++) K.add(tor(0.022, 0.012, 12, 5), 'rough', 0x7a6a4a, [-0.045, -rope + 0.12 - k * 0.022, 0.055], [Math.PI / 2, 0, 0.4], 1, R, { grime: 0.4 });
  K.add(tor(0.015, 0.003, 8, 3), 'metal', H.rustDk, [0, -0.01, 0], null, 1, R);
  return ownMats(K.build());
}
export function hangedMan(rope = 3) { const L = Math.max(0.5, Math.round(rope * 4) / 4); return named(make('hanged' + L, () => buildHangedMan(L)), ['body', 'head']); }

// ---- 6. a corpse on its back along X (head toward +X), its face turned toward us; armR is the near (camera-side) arm
function buildCorpse() {
  const K = new Kit(), R = K.root;
  const pose = K.group('pose', R, -0.86, 0.11, 0);
  pose.rotation.set(0, Math.PI, Math.PI / 2); pose.scale.set(1, 1, -1);
  const hk = headKit('corpse', { skin: 0x8c8a7e, sock: 0.24, open: 0.65, gape: 0.24, mouthW: 0.24, gaunt: 1.2, rot: 0.75, nose: 0.06, dark: 1, lip: 0x3a2e2a, seed: 91 }, 44, 32);
  const F = figure(K, pose, { H: 1.75, wd: 0.92, skin: 0x8a887c, ribs: 0.3, head: hk, hs: 0.1, headRot: [0.15, -0.95, 0], headOpts: { eyes: 'none', fn: () => { addTeeth(K, by(pose, 'head'), hk, { y: -0.5 + 0.2, w: 0.2, n: 9, dir: -1, seed: 9, gap: 0.25, black: 0.3 }); addTeeth(K, by(pose, 'head'), hk, { y: -0.5 - 0.22, w: 0.18, n: 8, dir: 1, seed: 10, gap: 0.3, black: 0.3 }); } },
    arms: { len: 1.0, rot: [[0.22, 0, -0.06], [-0.55, 0, -0.05]], elbow: [0.1, 0.35], long: 1.35, curl: 0.45 }, legBend: 0.04, feet: false });
  minerClothes(K, F, { seed: 9, shirt: 0x4a3e34, pants: 0x262626 });
  K.add(sph(0.3, 16, 8), 'wet', 0x1a0304, [0.2, 0.004, 0.0], null, [2.4, 0.015, 1.1], R, { grime: 0.2 });   // what leaked out of him
  return ownMats(K.build());
}
export function corpse() { return named(make('corpse', buildCorpse), ['head', 'armR']); }

// ---- 7. the jump-scare face: a head-and-shoulders bust ~0.55 m tall centred on the origin, FACING +Z (the camera).
// jaw opens downward with jaw.rotation.x > 0; eyeL / eyeR are pivots in the sockets. v: 0 pale woman, 1 rotting miner,
// 2 skull with its eyes still in, 3 lipless grey ghoul, 4 cracked porcelain doll, 5 the thing from below
const SCREAM = [
  { skin: 0xc2cad0, sock: 0.24, gaunt: 1.0, open: 1, gape: 0.36, mouthW: 0.42, mouthY: -0.6, lip: 0x4a3440, nose: 0.1, veins: 0.6, blood: 0.75, seed: 101, mouthCol: 0x2a0606 },
  { skin: 0x8e8a76, sock: 0.22, gaunt: 1.2, open: 1, gape: 0.34, mouthW: 0.38, mouthY: -0.6, lip: 0x3a2e28, nose: 0.1, rot: 0.85, veins: 0.3, blood: 0.4, seed: 102, rough: 0.02 },
  { ...SKULL, open: 1, gape: 0.3, mouthW: 0.3, mouthY: -0.62, seed: 103 },
  { skin: 0x76806e, sock: 0.28, gaunt: 1.4, open: 1, gape: 0.38, mouthW: 0.44, mouthY: -0.6, lipless: true, nose: -0.2, veins: 0.6, rot: 0.35, wide: 0.78, long: 1.12, seed: 104, mouthCol: 0x3a0808 },
  { skin: 0xe6dfd2, sock: 0.13, dark: 0.15, gaunt: 0, open: 1, gape: 0.32, mouthW: 0.36, mouthY: -0.6, lip: 0x9a2a2a, nose: 0.07, porcelain: 1, wide: 0.86, long: 0.98, seed: 105, rough: 0.004 },
  { skin: 0x8e6e68, sock: 0.06, dark: 0.3, gaunt: 0.2, open: 1, gape: 0.42, mouthW: 0.42, mouthY: -0.52, lipless: true, nose: -0.1, veins: 0.8, lumps: 0.22, rough: 0.05, wide: 0.92, long: 1.0, seed: 106, mouthCol: 0x4a0a0a },
];
function eyeball(key, iris = 0x4a3a2a) {
  return sculpt('eyeball' + key, sph(1, 26, 18), (v, c) => {
    const z = v.z, rr = Math.hypot(v.x, v.y);
    c.set(0xd8d0c0);
    mixC(c, 0x9a1a1a, Math.pow(1 - Math.abs(fbm(v.x * 6, v.y * 6, v.z * 6) - 0.5) * 2, 8) * sstep(0.6, -0.2, z) * 0.9);
    if (z > 0) { mixC(c, iris, sstep(0.48, 0.42, rr)); mixC(c, 0x020202, sstep(0.2, 0.16, rr)); }
  });
}
function buildScreamFace(v) {
  const K = new Kit(), R = K.root, o = SCREAM[v];
  const hk = headKit('scream' + v, o, 120, 90);
  const hs = 0.19, P = [0, 0.065, 0], rot = [-0.12, 0, 0];
  const head = K.group('head', R);
  const my = (o.mouthY ?? -0.5) * (o.long ?? 1.04), mv = 0.03 + o.gape;
  const skinC = o.skin;
  const mat = v === 4 ? 'wet' : v === 5 ? 'wet' : v === 2 ? 'rough' : 'gloss';
  const upperTeeth = () => {
    if (v === 5) return;
    addTeeth(K, head, hk, { y: o.mouthY + mv * 0.9, w: o.mouthW * 0.82, n: 14, dir: -1, seed: 11 + v, gap: v === 1 ? 0.25 : 0.06, size: 1.15, black: v === 1 ? 0.35 : 0.08, curve: 0.1, needle: v === 0 || v === 3 ? false : false });
    if (v === 3) { const pts = []; for (let k = 0; k <= 12; k++) { const u = (k / 12) * 2 - 1, c = hk.surf(u * o.mouthW * 0.84, o.mouthY + mv * 0.95 + 0.03 - u * u * 0.08, -0.03); pts.push([+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)]); } K.add(ttube(pts, [0.03, 0.04, 0.03], { segs: 30, radial: 6, sx: 0.6 }), 'wet', 0x4a1012, null, null, 1, head, { grime: 0.2 }); }
  };
  const lowerTeeth = (grp) => {
    if (v === 5) return;
    addTeeth(K, grp, hk, { y: o.mouthY - mv * 0.9, w: o.mouthW * 0.78, n: 13, dir: 1, seed: 31 + v, gap: v === 1 ? 0.3 : 0.06, size: 1.05, black: v === 1 ? 0.35 : 0.08, curve: 0.1 });
    K.add(lump('tongue', 0.2, 2, 0.2, 4, v, 1.2, 0.4, 1.5), 'wet', v === 2 ? 0x1a100c : 0x3a0e10, [0, o.mouthY - mv * 0.5, -0.05], [0.25, 0, 0], 1, grp, { grime: 0.2 });
  };
  const S = addSplitHead(K, head, hk, P, 0, rot, hs, {
    key: 'sf' + v, mat, grime: v === 4 ? 0.05 : 0.15, freq: 30,
    upper: () => {
      upperTeeth();
      K.add(sph(0.62, 20, 14), 'rough', 0x0e0303, [0, -0.36, -0.08], null, [1, 1.1, 1], head, { grime: 0 });   // the dark throat behind the mouth
      if (v !== 2) for (const sd of [-1, 1]) K.add(sph(1, 16, 12), 'wet', 0x140404, [sd * 0.42, -0.55, -0.12], null, [0.05, 0.32, 0.4], head, { grime: 0.2 });   // inner cheeks fill the sides when the jaw drops
      if (v === 0) addHair(K, head, hk, { n: 90, len: 3.4, front: 0, mat: 'wet', col: 0x060606, wide: 0.17, seed: 7 });
      if (v === 1) {
        K.add(roughen('helmDent', hemi(1.12, 30, 12), 0.07, 3, 7), 'gloss', C.helmet, [0, 0.36, -0.12], [-0.18, 0, 0.12], [1.0, 1.05, 1.08], head, { grime: 0.55, freq: 8 });
        K.add(cyl(1.3, 1.36, 0.1, 30), 'gloss', 0x4a4630, [0, 0.36, -0.12], [-0.18, 0, 0.12], [1.0, 1, 1.1], head, { grime: 0.55, freq: 8 });
        K.add(cyl(0.22, 0.24, 0.35, 16), 'polish', 0x6a5a30, [0.05, 0.92, 1.02], [Math.PI / 2 - 0.18, 0, 0], 1, head, { grime: 0.6 });
        K.add(cyl(0.2, 0.2, 0.04, 16), 'gloss', 0x0c0c0e, [0.05, 0.9, 1.2], [Math.PI / 2 - 0.18, 0, 0], 1, head, { grime: 0 });
        for (let k = 0; k < 4; k++) K.add(box(0.3, 0.008, 0.008), 'glow', hdr(0x9aa0aa, 0.5), [0.05, 0.9, 1.225], [0, 0, k * 0.8], 1, head);
        for (let k = 0; k < 40; k++) { const a = hash3(k, 1, 2) * 2 - 1, b = hash3(k, 3, 4) * 0.8 - 0.95; const c = hk.surf(a * 0.7, b, 0.01); K.add(box(0.012, 0.05, 0.012), 'rough', 0x2a2420, [c.x, c.y, c.z], [hash3(k, 5, 6), 0, hash3(k, 7, 8)], 1, head, { grime: 0 }); }
      }
      if (v === 3) for (const sd of [-1, 1]) { const c = hk.pt(sd, 0.08, -0.12); K.add(cone(0.18, 0.75, 6), 'gloss', skinC, [c.x, c.y + 0.2, c.z - 0.1], [-0.5, 0, -sd * 0.9], [1, 1, 0.35], head, { grime: 0.3 }); }
      if (v === 4) {
        for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2, rr = 1.02, y0 = 0.25 + Math.sin(a * 3) * 0.1; const pts = []; for (let j = 0; j < 9; j++) { const t = j / 8, aa = a + t * 0.4; pts.push([Math.sin(aa) * (rr + 0.08 * Math.sin(t * 12)), y0 + 0.65 * (1 - t) - t * 1.6, Math.cos(aa) * (rr + 0.08 * Math.cos(t * 12)) - 0.15 - t * 0.2]); } if (Math.cos(a) > 0.6) continue; K.add(ttube(pts.map((p) => p.map((q) => +q.toFixed(3))), [0.04, 0.035, 0.028, 0.015], { segs: 24, radial: 5 }), 'gloss', 0x3a2416, null, null, 1, head, { grime: 0.3 }); }
        K.add(roughen('dollCap', hemi(1.04, 28, 10), 0.03, 6, 3), 'gloss', 0x3a2416, [0, 0.16, -0.06], [-0.25, 0, 0], [0.84, 0.95, 0.98], head, { grime: 0.3 });
        for (const sd of [-1, 1]) { const c = hk.surf(sd * 0.32, 0.3, 0.01); K.add(box(0.26, 0.022, 0.02), 'rough', 0x2a1a12, [c.x, c.y, c.z], [0, 0, sd * -0.18], 1, head, { grime: 0 }); }
        const hole = hk.surf(0.42, 0.25, -0.05); K.add(sph(0.2, 12, 8), 'rough', 0x020101, [hole.x, hole.y, hole.z], null, [1.2, 0.9, 0.4], head, { grime: 0 });
      }
      if (v === 5) {
        const r = rng(55);
        for (let k = 0; k < 9; k++) {
          const x = (r() - 0.5) * 1.3, y = 0.05 + r() * 0.75, c = hk.surf(x, y, -0.03), s = 0.06 + r() * 0.08;
          K.add(eyeball('thing', k % 2 ? 0x6a5a10 : 0x3a1a0a), 'wet', 0xffffff, [c.x, c.y, c.z - s * 0.35], [(r() - 0.5) * 0.6, x * 0.6, 0], s, head, { grime: 0 }); K.add(tor(s * 0.9, s * 0.22, 18, 8), 'wet', 0x3a1816, [c.x, c.y, c.z + s * 0.12], [0, x * 0.6, 0], [1, 0.75, 1], head, { grime: 0.3 });
          K.add(sph(1, 8, 6), 'glow', k % 3 ? EYE_SICK : EYE_RED, [c.x + x * 0.02, c.y, c.z + s * 0.95], null, s * 0.22, head);
        }
        [[0.36, 22], [0.27, 18], [0.17, 13]].forEach(([rr, n], ring) => { for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + ring * 0.3; if (Math.sin(a) < -0.05) continue; const c = hk.surf(Math.cos(a) * rr * 1.05, o.mouthY + Math.sin(a) * rr * 0.95, -0.04 - ring * 0.12); const q = new THREE.Quaternion().setFromUnitVectors(_up, new THREE.Vector3(-Math.cos(a), -Math.sin(a), -0.4).normalize()), e = new THREE.Euler().setFromQuaternion(q); K.add(cone(0.035, 0.2 - ring * 0.03, 5), 'gloss', 0xe0d8c0, [c.x, c.y, c.z], [e.x, e.y, e.z], 1, head, { grime: 0.15 }); } });
      }
    },
    lower: (jaw) => {
      lowerTeeth(jaw);
      if (v === 5) [[0.36, 22], [0.27, 18], [0.17, 13]].forEach(([rr, n], ring) => { for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + ring * 0.3; if (Math.sin(a) >= -0.05) continue; const c = hk.surf(Math.cos(a) * rr * 1.05, o.mouthY + Math.sin(a) * rr * 0.95, -0.04 - ring * 0.12); const q = new THREE.Quaternion().setFromUnitVectors(_up, new THREE.Vector3(-Math.cos(a), -Math.sin(a), -0.4).normalize()), e = new THREE.Euler().setFromQuaternion(q); K.add(cone(0.035, 0.2 - ring * 0.03, 5), 'gloss', 0xe0d8c0, [c.x, c.y, c.z], [e.x, e.y, e.z], 1, jaw, { grime: 0.15 }); } });
    },
  });
  // eye pivots in the sockets
  const M = S.M;
  for (const sd of [-1, 1]) {
    const c = hk.surf(sd * EYX, EYY, v === 2 ? 0.05 : 0.0).applyMatrix4(M);
    const eye = K.group(sd < 0 ? 'eyeL' : 'eyeR', head, c.x, c.y, c.z);
    K.at(null, rot, hs, () => {
      if (v === 2 || (v === 1 && sd > 0)) {
        K.add(eyeball(v === 1 ? 'milky' : 'skull', v === 1 ? 0x9aa098 : 0x3a2a1a), 'wet', 0xffffff, [0, 0, -0.04], null, v === 2 ? 0.17 : 0.14, eye, { grime: 0 });
        K.add(sph(1, 8, 6), 'glow', v === 1 ? hdr(0xd8e0d8, 2) : EYE_COLD, [0, 0, v === 2 ? 0.13 : 0.1], null, 0.025, eye);
      } else if (v === 4 && sd < 0) {
        K.add(sph(0.13, 18, 12), 'wet', 0x1a0e08, [0, 0, -0.03], null, 1, eye, { grime: 0 });
        K.add(sph(0.06, 12, 8), 'wet', 0x020202, [0, 0, 0.08], null, [1, 1, 0.5], eye, { grime: 0 });
      } else if (v === 5) {
        K.add(eyeball('thing', 0x7a6a10), 'wet', 0xffffff, [0, 0, -0.02], null, 0.15, eye, { grime: 0 });
        K.add(sph(1, 8, 6), 'glow', EYE_SICK, [0, 0, 0.14], null, 0.04, eye);
      } else K.add(sph(1, 10, 8), 'glow', v === 3 ? EYE_SICK : EYE_COLD, [0, 0, 0.0], null, v === 4 ? 0.035 : 0.045, eye);
    });
  }
  // neck and shoulders
  const neckC = v === 2 ? H.bone : v === 4 ? 0xe6dfd2 : new THREE.Color(skinC).multiplyScalar(0.62);
  if (v === 2) { for (let k = 0; k < 4; k++) K.add(lump('cvert', 0.03, 1, 0.3, 6, k, 1.2, 0.75, 1.1), 'rough', H.bone, [0, -0.13 - k * 0.04, -0.05], null, 1, R, { grime: 0.4 }); for (const sd of [-1, 1]) addBone(K, R, [sd * 0.03, -0.25, 0.02], [sd * 0.26, -0.24, -0.02], 0.009); }
  else {
    K.add(ttube([[0, -0.05, -0.03], [0, -0.17, -0.035], [0, -0.27, -0.04]], [0.06, 0.055, 0.075], { segs: 8, radial: 16, cap: 0 }), mat, neckC, null, null, 1, R, { grime: 0.25 });
    K.add(ttube([[-0.27, -0.32, -0.06], [-0.12, -0.255, -0.03], [0.12, -0.255, -0.03], [0.27, -0.32, -0.06]], [0.05, 0.08, 0.08, 0.05], { segs: 16, radial: 14, sx: 0.9 }), mat, neckC, null, null, 1, R, { grime: 0.25 });
    if (v === 3) for (const sd of [-1, 1]) { K.rod('gloss', new THREE.Color(skinC).multiplyScalar(0.55), [sd * 0.03, -0.07, 0.03], [sd * 0.06, -0.24, 0.02], 0.009, R, 6); addBone(K, R, [sd * 0.03, -0.25, 0.04], [sd * 0.22, -0.25, 0.0], 0.008, 0x8a8a7a, 'gloss'); }
    if (v === 0) K.add(drape('sfGown', [[0.08, -0.2], [0.24, -0.26], [0.3, -0.32]], { n: 36, rings: 4, sx: 0.5, folds: 0.1 }), 'skin', H.gown, null, null, 1, R, { grime: 0.4 });
    if (v === 1) K.add(drape('sfShirt', [[0.08, -0.19], [0.24, -0.25], [0.3, -0.32]], { n: 36, rings: 4, sx: 0.5, folds: 0.12, open: 0.6 }), 'skin', 0x4a3e30, null, null, 1, R, { grime: 0.6 });
    if (v === 4) K.add(drape('sfLace', [[0.07, -0.15], [0.16, -0.2], [0.25, -0.24], [0.3, -0.3]], { n: 40, rings: 6, sx: 0.55, folds: 0.25, fk: 20, tatter: 0.2 }), 'skin', 0xe8e2d4, null, null, 1, R, { grime: 0.3 });
    if (v === 5) for (let k = 0; k < 8; k++) K.add(lump('thingfold' + (k % 3), 0.07, 2, 0.4, 3, k % 3, 1.4, 0.6, 1), 'wet', 0x7a5a54, [(k - 3.5) * 0.065, -0.24 - (k % 2) * 0.03, 0.03], null, 1, R, { grime: 0.3 });
  }
  return ownMats(K.build());
}
export function screamFace(v = 0) {
  const V = Math.max(0, Math.min(5, Math.round(v) || 0));
  return named(make('scream' + V, () => buildScreamFace(V)), ['jaw', 'eyeL', 'eyeR', 'head']);
}

// ---- 8. a stone face pushing out of the rock, facing +Z, ~0.9 m; open back, edges melting into the wall; jaw opens (+x)
function buildWallFace() {
  const K = new Kit(), R = K.root;
  const S = 0.42;
  const hk = headKit('wallFaceK', { skin: 0x7a7672, sock: 0.24, gaunt: 1.1, open: 0.8, gape: 0.26, mouthW: 0.3, nose: 0.12, rough: 0.03, lumps: 0.08, dark: 0.9, seed: 121 });
  const wf = (v, c) => {
    const dx = v.x / 0.82, dy = v.y / 1.05, rho = Math.hypot(dx, dy);
    const rock = new THREE.Vector3(v.x, v.y, (fbm(v.x * 2 + 3, v.y * 2, 1) - 0.5) * 0.25 - 0.02 * rho * rho);
    let p = rock;
    if (rho < 1) {
      const d = new THREE.Vector3(dx * 0.999, dy * 0.999, Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy)));
      const cc = new THREE.Color(); hk.f(d, cc); c.copy(cc);
      const fp = new THREE.Vector3(d.x, d.y, d.z * 0.85 - 0.05);
      const t = sstep(0.72, 1.0, rho);
      p = fp.lerp(rock, t); c.lerp(_tc.setRGB(0.5, 0.5, 0.5), t);
    } else c.setRGB(0.5, 0.5, 0.5);
    c.multiplyScalar((0.75 + 0.5 * fbm(v.x * 6, v.y * 6, 2)) * (1 - 0.65 * sstep(0.95, 1.55, rho)));
    mixC(c, 0x2a3a22, sstep(0.62, 0.75, fbm(v.x * 3 + 7, v.y * 3, 5)) * 0.4);
    v.set(p.x * S, p.y * S, p.z * S);
  };
  const myl = -0.5 * 1.04;
  const halves = geo('wfJawC', () => clipAll(geo('wfGridNI', () => new THREE.PlaneGeometry(2.6, 2.6, 110, 110).toNonIndexed()), [(c) => -0.5 + Math.min(1, Math.abs(c.x / 0.82) / 0.6) * 0.4 - c.y / 1.05, (c) => 0.95 - Math.hypot(c.x / 0.82, c.y / 1.05), (c) => c.y / 1.05 + 1]));
  const parts = [sculpt('wfU', halves[0], wf), sculpt('wfL', halves[1], wf)];
  K.add(parts[0], 'rough', 0x8a8580, null, null, 1, R, { grime: 0.3, freq: 8 });
  const J = [0, -0.16 * S, -0.1 * S];
  const jaw = K.group('jaw', R, ...J);
  K.add(parts[1], 'rough', 0x8a8580, [-J[0], -J[1], -J[2]], null, 1, jaw, { grime: 0.3, freq: 8 });
  K.add(sph(0.62 * S, 16, 10), 'rough', 0x050404, [0, myl * S, -0.18 * S], null, [1, 1.2, 0.6], R, { grime: 0 });
  K.at(null, null, S, () => {
    addTeeth(K, R, hk, { y: -0.5 + 0.24, w: 0.24, n: 10, dir: -1, seed: 3, gap: 0.15, col: 0x58544e, colDk: 0x3a3632, mat: 'rough' });
    for (const sd of [-1, 1]) { const c = hk.surf(sd * EYX, EYY); K.add(sph(1, 8, 6), 'glow', hdr(0xe8f0ff, 6), [c.x, c.y, c.z * 0.85 - 0.05 + 0.03], null, 0.035, R); }
  });
  K.at([-J[0], -J[1], -J[2]], null, S, () => addTeeth(K, jaw, hk, { y: -0.5 - 0.25, w: 0.22, n: 9, dir: 1, seed: 4, gap: 0.15, col: 0x58544e, colDk: 0x3a3632, mat: 'rough' }));
  return ownMats(K.build());
}
export function wallFace() { return named(make('wallFace', buildWallFace), ['jaw']); }

// ---- 9. a grey long-fingered hand bursting up: WRIST AT THE ORIGIN, fingers toward +Y; fingers[] curl with rotation.x > 0
function buildHandUp() {
  const K = new Kit(), R = K.root;
  const col = 0x8e9290;
  const palm = K.group('palm', R); palm.rotation.z = Math.PI;
  const fx = [0.031, 0.0105, -0.0105, -0.031], th = 0.9;
  const fingers = [0, 1, 2, 3, 4].map((i) => K.group('finger' + i, palm, i === 4 ? 0.036 * th : fx[i] * th, i === 4 ? -0.03 : -0.098, i === 4 ? 0.012 : 0));
  addHand(K, palm, { long: 1.7, curl: 0.2, col, thin: th, nail: 0x2a2620 }, fingers);
  K.add(paint('handFore', ttube([[0, 0.02, 0], [0.004, -0.15, 0.004], [0.0, -0.42, -0.01]], [0.03, 0.036, 0.045], { segs: 14, radial: 12, cap: 0, noise: 0.1, nf: 30 }), (p, c) => { c.setRGB(1, 1, 1); mixC(c, 0x1e1812, sstep(-0.02, -0.2, p.y) * 0.9 + sstep(0.6, 0.75, fbm(p.x * 40, p.y * 40, p.z * 40)) * 0.6); mixC(c, H.bloodDry, sstep(0.62, 0.72, fbm(p.x * 25 + 4, p.y * 25, p.z * 25)) * 0.8); }), 'gloss', col, null, null, 1, R, { grime: 0.5, freq: 25 });
  return ownMats(K.build());
}
export function hand() { const g = make('handUp', buildHandUp), o = named(g, []); o.fingers = [0, 1, 2, 3, 4].map((i) => by(g, 'finger' + i)); return o; }
// a 1.1 m arm along +Y (torn off at the shoulder end, y = 0), elbow pivot at 0.45, the hand pivot at the wrist
function buildArm() {
  const K = new Kit(), R = K.root;
  const col = 0x8e9290;
  K.add(ttube([[0, -0.02, 0], [0.004, 0.22, 0.004], [0, 0.45, 0]], [0.052, 0.046, 0.04, 0.036], { segs: 14, radial: 12, noise: 0.06, nf: 30, cap: 0 }), 'gloss', col, null, null, 1, R, { grime: 0.4, freq: 20 });
  K.add(cyl(0.05, 0.05, 0.02, 14), 'wet', 0x5a0a0c, [0, -0.02, 0], null, 1, R, { grime: 0.2 });
  K.add(cyl(0.014, 0.016, 0.07, 8), 'rough', H.bone, [0.006, -0.04, 0], null, 1, R, { grime: 0.3 });
  for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; K.add(ribbon([[Math.cos(a) * 0.05, 0.0, Math.sin(a) * 0.05], [Math.cos(a) * 0.055, -0.04, Math.sin(a) * 0.055], [Math.cos(a) * 0.05, -0.07 - hash3(k, 1, 1) * 0.04, Math.sin(a) * 0.05]], 0.04, { segs: 4, nrm: [Math.cos(a), 0, Math.sin(a)] }), 'wet', 0x6a1414, null, null, 1, R, { grime: 0.2 }); }
  const elbow = K.group('elbow', R, 0, 0.45, 0);
  K.add(sph(0.034, 10, 8), 'gloss', col, [-0.012, 0, 0], null, [1, 1.2, 1], elbow);
  K.add(ttube([[0, 0, 0], [0.004, 0.19, 0.003], [0, 0.38, 0]], [0.036, 0.032, 0.026, 0.022], { segs: 14, radial: 10, noise: 0.06, nf: 30 }), 'gloss', col, null, null, 1, elbow, { grime: 0.4, freq: 20 });
  const hnd = K.group('hand', elbow, 0, 0.38, 0);
  K.at(null, [0, 0, Math.PI], 1, () => addHand(K, hnd, { long: 1.7, curl: 0.25, col, thin: 0.9, nail: 0x2a2620 }));
  return ownMats(K.build());
}
export function arm() { return named(make('arm', buildArm), ['elbow', 'hand']); }

// ---- 10. two glowing eyes 7 cm apart facing +Z; lids are pivots: rotation.x 0 = open, ~1.35 = shut
function buildEyes() {
  const K = new Kit(), R = K.root;
  const lidG = geo('eyelid', () => new THREE.SphereGeometry(0.0148, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.58));
  for (const s of [-1, 1]) {
    const x = s * 0.035;
    K.add(sph(0.012, 16, 12), 'wet', 0x2a1614, [x, 0, 0], null, 1, R, { grime: 0 });
    K.add(cyl(0.0075, 0.0075, 0.0012, 20), 'glow', hdr(0xffd860, 9), [x, 0, 0.0112], [Math.PI / 2, 0, 0], 1, R, { own: 'iris' });
    K.add(box(0.0022, 0.0105, 0.0012), 'shadow', 0x000000, [x, 0, 0.0122], null, 1, R);
    const lid = K.group(s < 0 ? 'lidL' : 'lidR', R, x, 0, 0);
    K.add(lidG, 'gloss', 0x3a2c28, null, [-0.5, 0, 0], 1, lid, { grime: 0.3 });
  }
  return ownMats(K.build());
}
export function eyes() { const g = make('eyes', buildEyes), o = named(g, ['lidL', 'lidR']); const ir = by(g, 'iris'); o.mat = ir ? ir.material : o.mats[0]; return o; }

// ---- 11. skulls and bones
export function skull() {
  return named(make('skullOne', () => { const K = new Kit(); addSkull(K, K.root, [0, 0.107, 0], [-0.12, 0, 0], 0.1, { hi: true, seed: 21 }); return ownMats(K.build()); }), []);
}
export function skullPile() {
  return named(make('skullPile', () => {
    const K = new Kit(), R = K.root, r = rng(222);
    K.add(lump('spmound', 0.4, 2, 0.25, 2, 3, 1, 0.32, 0.75), 'rough', 0x2a2420, [0, 0.02, 0], null, 1, R, { grime: 0.5, freq: 6 });
    const layers = [[9, 0.34, 0.07], [7, 0.24, 0.2], [4, 0.13, 0.32], [1, 0, 0.43]];
    let n = 0;
    for (const [cnt, rad, y] of layers) for (let k = 0; k < cnt; k++) {
      const a = k / cnt * Math.PI * 2 + r() * 0.5, x = Math.cos(a) * rad, z = Math.sin(a) * rad * 0.7;
      const face = z > -0.05 || rad === 0;
      addSkull(K, R, [x, y, z], [(r() - 0.5) * 0.7 - 0.1, face ? (r() - 0.5) * 0.9 : Math.PI / 2 - a, (r() - 0.5) * 0.6], 0.075 + r() * 0.015, { hi: rad === 0, seed: 300 + k + cnt * 13 + n++ });
    }
    for (let k = 0; k < 9; k++) { const a = r() * Math.PI * 2; addBone(K, R, [Math.cos(a) * 0.1, 0.05 + r() * 0.15, Math.sin(a) * 0.08], [Math.cos(a) * 0.45, 0.02 + r() * 0.08, Math.sin(a) * 0.32], 0.012 + r() * 0.004); }
    return ownMats(K.build());
  }), []);
}
export function bones() {
  return named(make('bonesScatter', () => {
    const K = new Kit(), R = K.root, r = rng(333);
    for (let k = 0; k < 10; k++) { const x = (r() - 0.5) * 1.0, z = (r() - 0.5) * 0.5, a = r() * Math.PI, L = 0.25 + r() * 0.22; addBone(K, R, [x - Math.cos(a) * L / 2, 0.015, z - Math.sin(a) * L / 2], [x + Math.cos(a) * L / 2, 0.02 + r() * 0.02, z + Math.sin(a) * L / 2], 0.011 + r() * 0.005, k % 3 ? H.bone : H.boneDk); }
    K.add(lump('pelvis', 0.09, 2, 0.35, 4, 5, 1.3, 0.55, 1.0), 'rough', H.boneDk, [0.32, 0.04, 0.1], [0.4, 0.5, 0.2], 1, R, { grime: 0.5 });
    for (let k = 0; k < 6; k++) { const x = -0.2 + k * 0.06; K.add(ttube([[x, 0.01, -0.12], [x + 0.03, 0.05, -0.04], [x + 0.05, 0.03, 0.05], [x + 0.04, 0.008, 0.11]], [0.007, 0.009, 0.007, 0.005], { segs: 10, radial: 5, sx: 0.55, ref: [1, 0, 0] }), 'rough', H.bone, null, null, 1, R, { grime: 0.4 }); }
    for (let k = 0; k < 12; k++) K.add(cap(0.006, 0.02, 5), 'rough', H.bone, [(r() - 0.5) * 1.1, 0.006, (r() - 0.5) * 0.6], [Math.PI / 2, r() * 3, 0], 1, R, { grime: 0.4 });
    addSkull(K, R, [-0.42, 0.08, 0.06], [0.5, 0.6, 0.9], 0.085, { seed: 33 });
    return ownMats(K.build());
  }), []);
}
export function ribcage() {
  return named(make('ribcageOne', () => { const K = new Kit(); K.at([0, 0.085, 0], [0, 0, Math.PI / 2], 1.15, () => addRibcage(K, K.root, 1, H.bone, 'rough')); return ownMats(K.build()); }), []);
}

// ---- 12. a 1.9 m pod of silk and fungus with a human shape pressed against the inside (toward +Z); bulge = something pushing out
function buildCocoon() {
  const K = new Kit(), R = K.root;
  const pod = sculpt('cocoonPod', sph(1, 56, 44), (v, c) => {
    const d = v.clone().normalize(), x = d.x, y = d.y, z = d.z, F = sstep(0.1, 0.7, z);
    let r = 1 + (fbm(x * 3, y * 3, z * 3) - 0.5) * 0.12;
    r += F * (0.16 * gss(x, y, 0, 0.78, 0.15, 0.13) + 0.06 * gss(x, y, 0, 0.2, 0.3, 0.2));
    r -= F * 0.07 * (gss(x, y, 0.07, 0.8, 0.035, 0.03) + gss(x, y, -0.07, 0.8, 0.035, 0.03)) + F * 0.09 * gss(x, y, 0, 0.7, 0.04, 0.045); r += F * 0.06 * gss(x, y, 0, 0.75, 0.025, 0.04);
    for (const s of [-1, 1]) { r += F * 0.09 * gss(x, y, s * 0.2, 0.55, 0.07, 0.06); for (let k = 0; k < 4; k++) r += F * 0.05 * gss(x, y, s * (0.13 + k * 0.035), 0.66 + (k === 0 || k === 3 ? 0 : 0.03), 0.012, 0.07); }
    r += F * 0.05 * (gss(x, y, 0.12, -0.45, 0.1, 0.1) + gss(x, y, -0.12, -0.45, 0.1, 0.1));
    const hr = Math.hypot(x, z) || 1, R0 = crv([0.12, 0.5, 0.62, 0.72, 0.8, 0.84, 0.9, 0.95, 0.7, 0.72, 0.12], (y + 1) / 2);
    v.set(x / hr * R0 * r * 0.42, y * 0.95 + 0.95, z / hr * R0 * r * 0.38);
    c.setRGB(1, 1, 1).multiplyScalar(0.8 + 0.3 * fbm(x * 8, y * 8, z * 8));
    mixC(c, 0x9a8a4a, sstep(0.55, 0.7, fbm(x * 2.5 + 5, y * 2.5, z * 2.5)) * 0.6);
    mixC(c, 0x2a1a10, sstep(-0.6, -1, y) * 0.75);
    mixC(c, 0x4a0a08, sstep(0.62, 0.72, fbm(x * 5, y * 5 + 9, z * 5)) * sstep(0.3, -0.5, y) * 0.7);
  });
  K.add(pod, 'gloss', H.silk, null, null, 1, R, { grime: 0.2, freq: 10 });
  const r = rng(444);
  for (let k = 0; k < 10; k++) { const pts = []; const a0 = r() * Math.PI * 2, y0 = 0.1 + r() * 0.3; for (let j = 0; j < 14; j++) { const t = j / 13, a = a0 + t * Math.PI * (1.5 + r()), y = y0 + t * 1.5, tp = 1 - 0.35 * sstep(0.3, 1, Math.abs((y - 0.95) / 0.95)); pts.push([+(Math.cos(a) * 0.435 * tp).toFixed(3), +y.toFixed(3), +(Math.sin(a) * 0.395 * tp).toFixed(3)]); } K.add(ttube(pts, 0.004, { segs: 40, radial: 3, cap: 0 }), 'gloss', 0xd8d4c8, null, null, 1, R, { grime: 0.1 }); }
  for (let k = 0; k < 7; k++) { const a = r() * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.2, 1.8, Math.sin(a) * 0.18], [Math.cos(a) * 0.15 + (r() - 0.5) * 0.2, 2.3, Math.sin(a) * 0.15], [(r() - 0.5) * 0.6, 2.9, (r() - 0.5) * 0.4]], [0.012, 0.006, 0.004], { segs: 10, radial: 4, cap: 0 }), 'gloss', 0xd0ccc0, null, null, 1, R, { grime: 0.1 }); }
  for (let k = 0; k < 6; k++) { const a = r() * Math.PI * 2; K.add(ttube([[Math.cos(a) * 0.25, 0.25, Math.sin(a) * 0.22], [Math.cos(a) * 0.45, 0.05, Math.sin(a) * 0.4], [Math.cos(a) * 0.6, 0.0, Math.sin(a) * 0.55]], [0.01, 0.006, 0.004], { segs: 8, radial: 4, cap: 0 }), 'gloss', 0xd0ccc0, null, null, 1, R, { grime: 0.1 }); }
  K.add(sph(0.4, 18, 8), 'wet', 0x241a10, [0, 0.004, 0.05], null, [1.5, 0.02, 1.2], R, { grime: 0.3 });
  const bulge = K.group('bulge', R, 0.04, 0.9, 0.33);
  K.add(lump('bulgePalm', 0.06, 2, 0.15, 4, 3, 1, 1.1, 0.45), 'gloss', H.silk, [0, 0, 0], null, 1, bulge, { grime: 0.2 });
  for (let k = 0; k < 4; k++) K.add(cap(0.014, 0.07, 6), 'gloss', H.silk, [-0.03 + k * 0.02, 0.09 + (k === 1 || k === 2 ? 0.01 : 0), 0.0], [0, 0, (k - 1.5) * -0.1], [1, 1, 0.6], bulge, { grime: 0.2 });
  return ownMats(K.build());
}
export function cocoon() { return named(make('cocoon', buildCocoon), ['bulge']); }

// ---- 13. a gibbet cage on a chain: origin at the chain's top anchor, a skeleton slumped inside
function addChain(K, parent, a, b, link = 0.05, col = H.rust) {
  const A = V3(a), B = V3(b), d = B.clone().sub(A), L = d.length(), n = Math.max(1, Math.round(L / link));
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  for (let k = 0; k < n; k++) {
    const p = A.clone().addScaledVector(d, (k + 0.5) / n), e = new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, k % 2 ? Math.PI / 2 : 0, Math.PI / 2))));
    K.add(tor(link * 0.55, link * 0.14, 10, 4), 'metal', col, p.toArray(), [e.x, e.y, e.z], [1, 1.5, 1], parent, { grime: 0.5, freq: 40 });
  }
}
function buildCageHanging(chain) {
  const K = new Kit(), R = K.root;
  addChain(K, R, [0, 0, 0], [0, -chain + 0.05, 0], 0.06);
  K.add(tor(0.05, 0.01, 12, 4), 'metal', H.rustDk, [0, -0.01, 0], null, 1, R);
  const cage = K.group('cage', R, 0, -chain, 0);
  K.add(tor(0.05, 0.012, 12, 4), 'metal', H.rust, [0, -0.04, 0], [0, 0, Math.PI / 2], 1, cage);
  const prof = (t) => 0.1 + 0.24 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.6) * (t < 0.85 ? 1 : 0.95);
  const H0 = -0.1, H1 = -1.7, N = 12;
  for (let k = 0; k < N; k++) {
    const a = k / N * Math.PI * 2, pts = [];
    for (let j = 0; j <= 8; j++) { const t = j / 8; pts.push([+(Math.cos(a) * prof(t)).toFixed(3), +(H0 + (H1 - H0) * t).toFixed(3), +(Math.sin(a) * prof(t) * 0.9).toFixed(3)]); }
    K.add(ttube(pts, 0.009, { segs: 20, radial: 5, noise: 0.25, nf: 30 }), 'metal', H.rust, null, null, 1, cage, { grime: 0.6, freq: 25 });
  }
  for (const t of [0.0, 0.3, 0.6, 1.0]) K.add(tor(prof(t), 0.014, 30, 4), 'metal', H.rustDk, [0, H0 + (H1 - H0) * t, 0], [Math.PI / 2, 0, 0], [1, 0.9, 1], cage, { grime: 0.6 });
  K.add(cyl(prof(1) * 1.02, prof(1) * 1.02, 0.02, 24), 'metal', H.rustDk, [0, H1, 0], null, [1, 1, 0.9], cage, { grime: 0.6 });
  // the skeleton: sat on the bottom, knees drawn up, skull lolling, one arm hanging out through the bars
  const y0 = H1 + 0.02, r = rng(555);
  K.at([-0.06, y0 + 0.36, 0], [0, 0, 0.35], 0.95, () => addRibcage(K, cage, 1, H.bone, 'rough', { n: 9 }));
  K.add(lump('pelvis', 0.09, 2, 0.35, 4, 5, 1.0, 0.6, 1.3), 'rough', H.boneDk, [-0.05, y0 + 0.08, 0], null, 1, cage, { grime: 0.5 });
  addSkull(K, cage, [0.1, y0 + 0.66, 0.06], [0.7, 1.3, 0.4], 0.09, { hi: true, seed: 55 });
  for (const s of [-1, 1]) {
    addBone(K, cage, [0, y0 + 0.07, s * 0.09], [0.24, y0 + 0.36, s * 0.11], 0.016);
    addBone(K, cage, [0.24, y0 + 0.36, s * 0.11], [0.2, y0 + 0.02, s * 0.13], 0.013);
    for (let k = 0; k < 4; k++) addBone(K, cage, [0.2, y0 + 0.02, s * (0.1 + k * 0.012)], [0.3, y0 + 0.01, s * (0.09 + k * 0.02)], 0.005);
  }
  addBone(K, cage, [0.0, y0 + 0.52, 0.14], [0.06, y0 + 0.28, 0.27], 0.012);
  addBone(K, cage, [0.06, y0 + 0.28, 0.27], [0.12, y0 + 0.02, 0.4], 0.01);
  K.at([0.12, y0 + 0.02, 0.4], [0, 0, 0.3], 1, () => addHand(K, cage, { long: 1.3, curl: 0.4, col: H.bone, mat: 'rough', lo: true, nails: false, thin: 0.7 }));
  addBone(K, cage, [0.0, y0 + 0.52, -0.14], [0.2, y0 + 0.35, -0.16], 0.012);
  addBone(K, cage, [0.2, y0 + 0.35, -0.16], [0.24, y0 + 0.12, -0.05], 0.01);
  for (let k = 0; k < 5; k++) K.add(ribbon([[(r() - 0.5) * 0.2, y0 + 0.5, (r() - 0.5) * 0.3], [(r() - 0.5) * 0.25, y0 + 0.3, (r() - 0.5) * 0.35], [(r() - 0.5) * 0.3, y0 - 0.15 - r() * 0.3, (r() - 0.5) * 0.38]], 0.07, { segs: 7, nrm: [0, 0, 1] }), 'skin', H.rag, null, null, 1, cage, { grime: 0.6 });
  return ownMats(K.build());
}
export function cageHanging(chain = 3) { const L = Math.max(0.5, Math.round(chain * 4) / 4); return named(make('gibbet' + L, () => buildCageHanging(L)), ['cage']); }

// ---- 14. melted candles on the floor, ~0.4 m across; flames[] are HDR flame pivots to flicker
function buildCandles(n) {
  const K = new Kit(), R = K.root, r = rng(600 + n);
  K.add(lump('waxpool', 0.2, 2, 0.3, 3, n % 5, 1, 0.06, 0.8), 'gloss', H.waxDk, [0, 0.004, 0], null, 1, R, { grime: 0.4 });
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + r() * 0.7, d = i === 0 ? 0 : 0.06 + r() * 0.12, h = 0.06 + r() * 0.24, rad = 0.016 + r() * 0.012;
    const p = [Math.cos(a) * d, 0, Math.sin(a) * d * 0.8];
    const fl = K.group('flame' + i, R, p[0], h + 0.004, p[2]);
    addCandle(K, R, p, h, rad, 700 + i * 7 + n, { flameParent: fl, col: i % 3 ? H.wax : 0xb8ac88 });
  }
  return ownMats(K.build());
}
export function candles(n = 5) { const N = Math.max(1, Math.min(12, Math.round(n))), g = make('candles' + N, () => buildCandles(N)), o = named(g, []); o.flames = Array.from({ length: N }, (_, i) => by(g, 'flame' + i)); return o; }

// ---- 15. a ritual circle on the floor (y ~ 0.01): stones, bones, dark painted signs with a faint red glow in the grooves
function buildRitual(rr) {
  const K = new Kit(), R = K.root, r = rng(800);
  const ring = (a, b, col, mat, y) => K.add(geo(`rring${a},${b}`, () => { const g = new THREE.RingGeometry(a, b, 96, 1); g.rotateX(-Math.PI / 2); return g; }), mat, col, [0, y, 0], null, 1, R, { grime: mat === 'glow' ? 0 : 0.5, freq: 6 });
  ring(rr - 0.05, rr, 0x2a0606, 'rough', 0.006); ring(rr - 0.034, rr - 0.016, hdr(0xff1a0a, 0.8), 'glow', 0.008);
  ring(rr * 0.72 - 0.035, rr * 0.72, 0x2a0606, 'rough', 0.006); ring(rr * 0.72 - 0.024, rr * 0.72 - 0.011, hdr(0xff1a0a, 0.7), 'glow', 0.008);
  for (let k = 0; k < 3; k++) { const a0 = k / 3 * Math.PI * 2 + Math.PI / 2, a1 = a0 + Math.PI * 2 / 3, L = Math.hypot(Math.cos(a1) - Math.cos(a0), Math.sin(a1) - Math.sin(a0)) * rr * 0.7; K.add(box(L, 0.002, 0.03), 'rough', 0x2a0606, [(Math.cos(a0) + Math.cos(a1)) / 2 * rr * 0.7, 0.007, (Math.sin(a0) + Math.sin(a1)) / 2 * rr * 0.7], [0, -Math.atan2(Math.sin(a1) - Math.sin(a0), Math.cos(a1) - Math.cos(a0)), 0], 1, R, { grime: 0.4 }); K.add(box(L, 0.002, 0.008), 'glow', hdr(0xff1a0a, 0.7), [(Math.cos(a0) + Math.cos(a1)) / 2 * rr * 0.7, 0.009, (Math.sin(a0) + Math.sin(a1)) / 2 * rr * 0.7], [0, -Math.atan2(Math.sin(a1) - Math.sin(a0), Math.cos(a1) - Math.cos(a0)), 0], 1, R); }
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2, c = rr * 0.86;
    for (let j = 0; j < 3; j++) { const aa = a + (r() - 0.5) * 0.12, L = 0.04 + r() * 0.06; K.add(box(L, 0.002, 0.012), 'rough', 0x220505, [Math.cos(aa) * (c + (r() - 0.5) * 0.08), 0.007, Math.sin(aa) * (c + (r() - 0.5) * 0.08)], [0, r() * Math.PI, 0], 1, R, { grime: 0.3 }); }
    K.add(box(0.05, 0.002, 0.005), 'glow', hdr(0xff1a0a, 0.6), [Math.cos(a) * c, 0.009, Math.sin(a) * c], [0, -a, 0], 1, R);
  }
  for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2 + r() * 0.1; K.add(lump('rstone' + (k % 4), 0.035 + r() * 0.02, 1, 0.35, 4, k % 4, 1, 0.6, 1), 'rough', 0x4a4642, [Math.cos(a) * (rr + 0.08), 0.015, Math.sin(a) * (rr + 0.08)], [r(), r(), r()], 1, R, { grime: 0.5 }); }
  for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + Math.PI / 2; addSkull(K, R, [Math.cos(a) * rr * 0.72, 0.05, Math.sin(a) * rr * 0.72], [-0.1, Math.PI / 2 - a + Math.PI, 0], 0.06, { seed: 810 + k }); addCandle(K, R, [Math.cos(a + 0.5) * rr * 0.5, 0, Math.sin(a + 0.5) * rr * 0.5], 0.05 + r() * 0.05, 0.016, 820 + k, { flame: false, col: 0x8a7a5a }); }
  for (let k = 0; k < 5; k++) { const a = r() * Math.PI * 2, d = rr * (0.3 + r() * 0.3); addBone(K, R, [Math.cos(a) * d, 0.01, Math.sin(a) * d], [Math.cos(a + 0.3) * (d + 0.25), 0.012, Math.sin(a + 0.3) * (d + 0.25)], 0.009); }
  K.add(sph(rr * 0.25, 16, 6), 'gloss', 0x1a0303, [0, 0.003, 0], null, [1, 0.01, 1], R, { grime: 0.3 });
  return ownMats(K.build());
}
export function ritualCircle(r = 1.4) { const L = Math.max(0.4, Math.round(r * 10) / 10); return named(make('ritual' + L, () => buildRitual(L)), []); }

// ---- 16. small horrors: a meat hook on a chain (origin at the top), a crude grave cross, a dropped helmet, a sitting doll
export function meatHook() {
  return named(make('meatHook', () => {
    const K = new Kit(), R = K.root;
    addChain(K, R, [0, 0, 0], [0, -1.0, 0], 0.06);
    K.add(ttube([[0, -1.0, 0], [0, -1.16, 0], [0.03, -1.3, 0], [0.12, -1.38, 0], [0.18, -1.3, 0], [0.17, -1.2, 0]], [0.016, 0.017, 0.016, 0.013, 0.009, 0.004], { segs: 30, radial: 8 }), 'metal', H.rust, null, null, 1, R, { grime: 0.6, freq: 30 });
    K.add(tor(0.035, 0.01, 12, 5), 'metal', H.rustDk, [0, -1.0, 0], [0, Math.PI / 2, 0], 1, R);
    K.add(ttube([[0.12, -1.38, 0], [0.18, -1.3, 0], [0.17, -1.2, 0]], [0.018, 0.012, 0.006], { segs: 10, radial: 6 }), 'gloss', 0x2a0505, null, null, 1, R, { grime: 0.3 });
    const r = rng(901);
    for (let k = 0; k < 5; k++) K.add(ribbon([[0.1 + (r() - 0.5) * 0.05, -1.36, (r() - 0.5) * 0.06], [0.08 + (r() - 0.5) * 0.08, -1.5, (r() - 0.5) * 0.1], [0.06 + (r() - 0.5) * 0.1, -1.62 - r() * 0.2, (r() - 0.5) * 0.12]], 0.06, { segs: 7, nrm: [0, 0, 1] }), 'skin', k % 2 ? 0x5a1a14 : 0x6a5a48, null, null, 1, R, { grime: 0.6 });
    K.add(lump('hookmeat', 0.06, 2, 0.35, 4, 2, 1, 1.4, 0.8), 'wet', 0x5a1012, [0.13, -1.42, 0], null, 1, R, { grime: 0.2 });
    return ownMats(K.build());
  }), []);
}
export function woodCross() {
  return named(make('woodCross', () => {
    const K = new Kit(), R = K.root;
    K.add(lump('gravemound', 0.45, 2, 0.25, 2.5, 5, 1, 0.28, 0.6), 'rough', 0x2e2620, [0, 0, 0.15], null, 1, R, { grime: 0.5, freq: 8 });
    K.at([0, 0, 0], [0.04, 0, -0.06], 1, () => {
      K.add(roughen('crossV', rbox(0.085, 1.15, 0.045, 0.01), 0.008, 12, 1), 'rough', 0x3a2c20, [0, 0.52, 0], null, 1, R, { grime: 0.55, freq: 14 });
      K.add(roughen('crossH', rbox(0.56, 0.075, 0.04, 0.01), 0.008, 12, 2), 'rough', 0x42321f, [0.01, 0.8, 0.04], [0, 0, 0.05], 1, R, { grime: 0.55, freq: 14 });
      for (let k = 0; k < 4; k++) K.add(tor(0.06, 0.007, 14, 4), 'rough', 0x6a5a3a, [0.0, 0.8 + (k - 1.5) * 0.018, 0.02], [0.6, 0.6, k * 0.4], [1, 1.1, 0.8], R, { grime: 0.4 });
      K.add(ttube([[0.0, 0.75, 0.05], [0.02, 0.68, 0.06], [0.03, 0.6, 0.05]], 0.003, { segs: 6, radial: 4 }), 'metal', 0x4a4440, null, null, 1, R);
      K.add(rbox(0.05, 0.035, 0.004, 0.003), 'metal', 0x6a6458, [0.03, 0.585, 0.053], [0, 0, 0.2], 1, R, { grime: 0.5 });
    });
    for (let k = 0; k < 5; k++) K.add(lump('gstone' + (k % 3), 0.05, 1, 0.35, 4, k % 3), 'rough', 0x4a4642, [(k - 2) * 0.12, 0.03, 0.4 + (k % 2) * 0.05], null, 1, R, { grime: 0.5 });
    return ownMats(K.build());
  }), []);
}
export function minerHelmet() {
  return named(make('minerHelmet', () => {
    const K = new Kit(), R = K.root;
    K.at([0, 0.1, 0], [0.2, 0.4, 1.35], 1, () => {
      K.add(roughen('helmDropped', hemi(0.128, 26, 10), 0.012, 6, 11), 'gloss', C.helmet, [0, 0, 0], null, [1.04, 1.25, 0.98], R, { grime: 0.55, freq: 14 });
      K.add(cyl(0.165, 0.172, 0.014, 26), 'gloss', 0x4f4a30, [0, -0.003, 0], null, [1.12, 1, 1], R, { grime: 0.5 });
      K.add(rbox(0.03, 0.06, 0.05, 0.008), 'polish', 0x6a5a30, [0.135, 0.05, 0], null, 1, R, { grime: 0.5 });
      K.add(cyl(0.026, 0.024, 0.04, 14), 'polish', 0x6a5a30, [0.158, 0.06, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0.5 });
      K.add(cyl(0.028, 0.028, 0.004, 14), 'gloss', 0x0c0c0e, [0.18, 0.06, 0], [0, 0, Math.PI / 2], 1, R, { grime: 0 });
      K.add(sph(0.11, 16, 8), 'gloss', 0x2a0505, [0, 0.01, 0], null, [1.05, 0.12, 0.95], R, { grime: 0.4 });
    });
    K.add(sph(0.12, 14, 6), 'wet', 0x2a0304, [0.08, 0.003, 0.06], null, [1.4, 0.02, 1], R, { grime: 0.3 });
    return ownMats(K.build());
  }), []);
}
function buildDoll() {
  const K = new Kit(), R = K.root;
  const por = 0xe8e0d2;
  K.add(drape('dollDress', [[0.03, 0.19], [0.055, 0.16], [0.06, 0.1], [0.09, 0.04], [0.13, 0.0]], { folds: 0.2, fk: 14, tatter: 0.25, n: 32, rings: 10, seed: 3 }), 'skin', 0x8a8a9a, null, null, 1, R, { grime: 0.6, freq: 50 });
  K.add(drape('dollLace', [[0.03, 0.2], [0.07, 0.18], [0.08, 0.165]], { folds: 0.3, fk: 18, n: 30, rings: 3 }), 'skin', 0xd8d2c4, null, null, 1, R, { grime: 0.5 });
  for (const s of [-1, 1]) {
    K.add(ttube([[0.0, 0.03, s * 0.035], [0.08, 0.025, s * 0.045], [0.14, 0.02, s * 0.05]], [0.018, 0.015, 0.012], { segs: 8, radial: 8 }), 'wet', por, null, null, 1, R, { grime: 0.3 });
    K.add(lump('dollShoe', 0.018, 1, 0.1, 5, 2, 1.4, 1, 0.9), 'gloss', 0x1a1210, [0.155, 0.022, s * 0.05], null, 1, R, { grime: 0.3 });
    K.add(ttube([[0.0, 0.17, s * 0.05], [0.03, 0.12, s * 0.065], [0.06, 0.08, s * 0.06]], [0.013, 0.011, 0.01], { segs: 8, radial: 8 }), 'wet', por, null, null, 1, R, { grime: 0.3 });
    K.add(sph(0.011, 8, 6), 'wet', por, [0.065, 0.075, s * 0.06], null, [1.2, 1, 0.8], R);
  }
  const head = K.group('head', R, 0, 0.215, 0);
  const hk = headKit('doll', { skin: por, sock: 0.08, dark: 0.0, gaunt: 0, mouthW: 0.14, mouthH: 0.02, lip: 0x9a2a2a, nose: 0.05, porcelain: 1, wide: 0.92, long: 0.95, chin: 0.01, rough: 0.003, seed: 141 }, 40, 30);
  addHead(K, head, hk, [0.005, 0.07, 0], Math.PI / 2, [0.15, 0.4, 0.25], 0.062, {
    mat: 'wet', eyes: 'none', grime: 0.05, fn: () => {
      for (const sd of [-1, 1]) { const c = hk.surf(sd * EYX, EYY, 0.0); K.add(sph(0.15, 12, 8), 'wet', sd > 0 ? 0x2a1a10 : 0x050505, [c.x, c.y, c.z + 0.02], null, 1, head, { grime: 0 }); if (sd > 0) K.add(sph(1, 6, 4), 'glow', EYE_COLD, [c.x, c.y, c.z + 0.16], null, 0.03, head); }
      for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; if (Math.cos(a) > 0.55) continue; const pts = []; for (let j = 0; j < 8; j++) { const t = j / 7, aa = a + t * 0.3; pts.push([+(Math.sin(aa) * (1.05 + 0.1 * Math.sin(t * 14))).toFixed(3), +(0.5 - t * 1.4).toFixed(3), +(Math.cos(aa) * (1.0 + 0.1 * Math.cos(t * 14)) - 0.1).toFixed(3)]); } K.add(ttube(pts, [0.06, 0.05, 0.035], { segs: 16, radial: 5 }), 'gloss', 0x3a2416, null, null, 1, head, { grime: 0.3 }); }
      K.add(roughen('dollCap2', hemi(1.03, 24, 10), 0.03, 6, 5), 'gloss', 0x3a2416, [0, 0.14, -0.06], [-0.25, 0, 0], [0.84, 0.95, 0.98], head, { grime: 0.3 });
    },
  });
  return ownMats(K.build());
}
export function doll() { return named(make('doll', buildDoll), ['head']); }

// ---- 17. a hairy, glossy black spider (0.5 m across the legs) and a rat
function buildSpider() {
  const K = new Kit(), R = K.root, r = rng(1001);
  const blk = 0x0c0b0a;
  K.add(lump('spCeph', 0.04, 2, 0.12, 5, 2, 1.2, 0.7, 1), 'wet', blk, [0.02, 0.08, 0], null, 1, R, { grime: 0.2 });
  K.add(lump('spAbd', 0.065, 3, 0.1, 4, 5, 1.25, 0.9, 1.0), 'wet', 0x100e0c, [-0.075, 0.095, 0], null, 1, R, { grime: 0.25, freq: 40 });
  for (let k = 0; k < 4; k++) K.add(sph(0.012 - k * 0.002, 8, 6), 'gloss', 0x5a3a20, [-0.04 - k * 0.025, 0.15 - k * 0.008, 0], null, [1.4, 0.4, 1], R);
  for (let k = 0; k < 80; k++) { const a = r() * Math.PI * 2, b = r() * Math.PI; const d = [Math.sin(b) * Math.cos(a), Math.cos(b) * 0.9, Math.sin(b) * Math.sin(a)]; const q = new THREE.Quaternion().setFromUnitVectors(_up, V3(d).normalize()), e = new THREE.Euler().setFromQuaternion(q); K.add(cone(0.0015, 0.014, 3), 'rough', 0x2a2420, [-0.075 + d[0] * 0.08, 0.095 + d[1] * 0.06, d[2] * 0.065], [e.x, e.y, e.z], 1, R, { grime: 0 }); }
  for (let k = 0; k < 8; k++) { const row = k < 4 ? 0 : 1, i = k % 4; K.add(sph(row ? 0.0055 : 0.0045, 8, 6), 'wet', 0x050505, [0.062 - row * 0.008, 0.1 + row * 0.008, (i - 1.5) * 0.011], null, 1, R, { grime: 0 }); }
  for (const s of [-1, 1]) { K.add(sph(0.002, 6, 4), 'glow', EYE_RED, [0.068, 0.1, s * 0.006], null, 1, R); K.add(cone(0.007, 0.03, 6), 'wet', 0x1a0e0a, [0.07, 0.06, s * 0.012], [0, 0, Math.PI * 0.85], 1, R); }
  const legs = [];
  for (let i = 0; i < 8; i++) {
    const s = i % 2 ? 1 : -1, j = Math.floor(i / 2), a = [0.75, 0.3, -0.2, -0.7][j];
    const leg = K.group('leg' + i, R, 0.03 - j * 0.012, 0.08, s * 0.03);
    legs.push(leg);
    const dir = [Math.sin(a), 0, Math.cos(a) * s], reach = 0.24 - (j === 1 || j === 2 ? 0.02 : 0);
    const knee = [dir[0] * reach * 0.42, 0.075, dir[2] * reach * 0.42], foot = [dir[0] * reach, -0.08, dir[2] * reach];
    K.add(ttube([[0, 0, 0], [knee[0] * 0.5, knee[1] * 0.8, knee[2] * 0.5], knee, [(knee[0] + foot[0]) / 2, 0.02, (knee[2] + foot[2]) / 2], foot].map((p) => p.map((v) => +v.toFixed(4))), [0.0065, 0.006, 0.005, 0.0045, 0.003], { segs: 16, radial: 6, noise: 0.25, nf: 220 }), 'wet', blk, null, null, 1, leg, { grime: 0.15 });
    for (let k = 0; k < 10; k++) { const t = 0.1 + k * 0.085, p = t < 0.5 ? [knee[0] * t * 2, knee[1] * t * 2, knee[2] * t * 2] : [knee[0] + (foot[0] - knee[0]) * (t - 0.5) * 2, knee[1] + (foot[1] - knee[1]) * (t - 0.5) * 2, knee[2] + (foot[2] - knee[2]) * (t - 0.5) * 2]; K.add(cone(0.0012, 0.012, 3), 'rough', 0x2a2420, p, [r() * 3, r() * 3, r() * 3], 1, leg, { grime: 0 }); }
  }
  return K.build();
}
export function spider() { const g = make('spider', buildSpider); return { group: g, legs: Array.from({ length: 8 }, (_, i) => by(g, 'leg' + i)), mats: matsOf(g) }; }
function buildRat() {
  const K = new Kit(), R = K.root;
  const fur = 0x4a4038, pink = 0xb08880;
  K.add(lump('ratBody', 0.06, 3, 0.16, 7, 3, 1.75, 0.85, 0.95), 'rough', fur, [0, 0.055, 0], null, 1, R, { grime: 0.5, freq: 60 });
  K.add(lump('ratHead', 0.035, 2, 0.12, 7, 5, 1.4, 0.9, 0.9), 'rough', 0x52463c, [0.105, 0.058, 0], [0, 0, -0.15], 1, R, { grime: 0.45, freq: 60 });
  K.add(cone(0.02, 0.045, 10), 'rough', 0x5a4a40, [0.145, 0.05, 0], [0, 0, -Math.PI / 2 - 0.2], [1, 1, 0.85], R, { grime: 0.3 });
  K.add(sph(0.006, 8, 6), 'gloss', pink, [0.168, 0.045, 0], null, 1, R);
  for (const s of [-1, 1]) {
    K.add(sph(0.016, 10, 6, ), 'skin', pink, [0.09, 0.09, s * 0.022], [0, 0, 0], [0.5, 1, 1], R, { grime: 0.3 });
    K.add(sph(0.0055, 8, 6), 'wet', 0x050505, [0.125, 0.068, s * 0.019], null, 1, R);
    K.add(sph(0.0015, 6, 4), 'glow', EYE_RED, [0.13, 0.069, s * 0.021], null, 1, R);
    for (const x of [0.06, -0.05]) K.add(lump('ratFoot', 0.012, 1, 0.2, 6, 1, 1.5, 0.5, 1), 'gloss', pink, [x, 0.006, s * 0.035], null, 1, R);
    for (let k = 0; k < 3; k++) K.add(ttube([[0.16, 0.05, s * 0.01], [0.17, 0.05 + (k - 1) * 0.01, s * 0.04], [0.175, 0.045 + (k - 1) * 0.02, s * 0.07]], 0.0006, { segs: 4, radial: 3, cap: 0 }), 'rough', 0x1a1612, null, null, 1, R, { grime: 0 });
  }
  const tail = K.group('tail', R, -0.1, 0.05, 0);
  K.add(ttube([[0, 0, 0], [-0.06, -0.03, 0.01], [-0.13, -0.045, 0.04], [-0.2, -0.045, 0.02], [-0.25, -0.04, -0.02]], [0.009, 0.007, 0.005, 0.0035, 0.0015], { segs: 24, radial: 6, noise: 0.15, nf: 300 }), 'gloss', 0x9a7a70, null, null, 1, tail, { grime: 0.3 });
  return K.build();
}
export function rat() { const g = make('rat', buildRat); return { group: g, tail: by(g, 'tail'), mats: matsOf(g) }; }

// ---- 18. a pool of blood with a ragged edge (y ~ 0.004)
function buildBloodPool(rr) {
  const K = new Kit(), R = K.root, seed = Math.round(rr * 100);
  const pool = geo('bpool' + rr, () => {
    const A = 64, Rn = 10, pos = [], uv = [], idx = [], col = [];
    const edge = (a) => rr * (0.72 + 0.38 * fbm(Math.cos(a) * 1.8 + seed, Math.sin(a) * 1.8, 2) + 0.12 * Math.max(0, Math.sin(a * 5 + seed)) ** 6);
    pos.push(0, 0.006, 0); uv.push(0.5, 0.5); col.push(0.55, 0.55, 0.55);
    for (let i = 1; i <= Rn; i++) for (let j = 0; j < A; j++) {
      const t = i / Rn, a = j / A * Math.PI * 2, e = edge(a) * t;
      pos.push(Math.cos(a) * e, 0.006 * (1 - t * t) + 0.0008, Math.sin(a) * e); uv.push(0.5 + Math.cos(a) * t / 2, 0.5 + Math.sin(a) * t / 2);
      const k = 0.55 + 0.6 * t * t; col.push(k, k * 0.9, k * 0.9);
    }
    for (let j = 0; j < A; j++) idx.push(0, 1 + (j + 1) % A, 1 + j);
    for (let i = 1; i < Rn; i++) for (let j = 0; j < A; j++) { const a = 1 + (i - 1) * A + j, b = 1 + (i - 1) * A + (j + 1) % A, c = 1 + i * A + j, d = 1 + i * A + (j + 1) % A; idx.push(a, b, c, b, d, c); }
    return finishGeo(pos, uv, idx, col);
  });
  K.add(pool, 'wet', 0x3a0306, null, null, 1, R, { grime: 0.15, freq: 4 });
  const r = rng(seed + 9);
  for (let k = 0; k < 9; k++) { const a = r() * Math.PI * 2, d = rr * (1.05 + r() * 0.5), s = 0.012 + r() * 0.03; K.add(sph(1, 12, 4), 'wet', 0x3a0306, [Math.cos(a) * d, 0.002, Math.sin(a) * d], null, [s * (1 + r()), 0.002, s], R, { grime: 0 }); }
  return ownMats(K.build());
}
export function bloodPool(r = 0.6) { const L = Math.max(0.1, Math.round(r * 20) / 20); return named(make('bloodPool' + L, () => buildBloodPool(L)), []); }

// ---- 19. a pure black featureless man, 1.8 m (unlit black, for figures glimpsed far off)
function buildShadowFigure() {
  const K = new Kit(), R = K.root; K.shadow = false;
  const hk = headKit('shadowHead', { skin: 0x000000, sock: 0, nose: 0, brow: 0, lipless: true, noMouth: true, gaunt: 0, wide: 0.78, long: 1.1 }, 20, 14);
  figure(K, R, { H: 1.8, wd: 0.9, mat: 'shadow', ribs: 0, head: hk, hs: 0.105, headOpts: { eyes: 'none', mat: 'shadow' }, arms: { len: 1.12, elbow: [0.05, 0.05], long: 1.5, curl: 0.15, nails: false, lo: true } });
  return ownMats(K.build());
}
export function shadowFigure() { return named(make('shadowFigure', buildShadowFigure), []); }

// ---- 20. a body bag on the floor along X, and a 2 x 2 m wall of living flesh facing +Z
export function bodyBag() {
  return named(make('bodyBag', () => {
    const K = new Kit(), R = K.root;
    const bag = sculpt('bodyBag', sph(1, 56, 28), (v, c) => {
      const d = v.clone().normalize(), x = d.x, y = d.y, z = d.z;
      let w = 0.27 * (1 - 0.35 * sstep(0.55, 1, x) + 0.12 * gss(x, 0, 0.45, 0, 0.18, 1) - 0.3 * sstep(-0.6, -1, x));
      let h = 0.13 * (1 + 0.8 * gss(x, 0, 0.8, 0, 0.1, 1) + 0.35 * gss(x, 0, 0.42, 0, 0.12, 1) + 0.45 * gss(x, 0, 0.0, 0, 0.18, 1) + 0.9 * gss(x, 0, -0.9, 0, 0.06, 1) * (gss(z, 0, 0.45, 0, 0.25, 1) + gss(z, 0, -0.45, 0, 0.25, 1)));
      const px = x * 0.92, py = y > 0 ? y * h : y * 0.04, pz = z * w + (fbm(x * 9, y * 9, z * 9) - 0.5) * 0.02;
      v.set(px, py + 0.04, pz);
      c.setRGB(1, 1, 1).multiplyScalar(0.8 + 0.3 * fbm(x * 6, y * 6, z * 6));
      mixC(c, 0x2a0606, sstep(0.55, 0.68, fbm(x * 4 + 3, y * 4, z * 4)) * sstep(0.2, 0.7, x) * 0.85);
    });
    K.add(bag, 'gloss', 0x2c322c, null, null, 1, R, { grime: 0.3, freq: 10 });
    for (let k = 0; k < 44; k++) { const x = 0.8 - k * 0.035, xx = x / 0.92, hh = 0.13 * (1 + 0.8 * gss(xx, 0, 0.8, 0, 0.1, 1) + 0.35 * gss(xx, 0, 0.42, 0, 0.12, 1) + 0.45 * gss(xx, 0, 0.0, 0, 0.18, 1)); K.add(box(0.014, 0.008, 0.012), 'metal', 0x6a6a64, [x, 0.04 + hh * 0.98, 0], null, 1, R, { grime: 0.3 }); }
    K.add(rbox(0.05, 0.08, 0.003, 0.002), 'skin', 0xc8bc98, [-0.98, 0.08, 0.1], [0.4, 0.3, 0.2], 1, R, { grime: 0.5 });
    K.add(sph(0.3, 14, 6), 'wet', 0x220304, [0.55, 0.002, 0.15], null, [1.3, 0.02, 0.9], R, { grime: 0.2 });
    return ownMats(K.build());
  }), []);
}
export function fleshWall() {
  return named(make('fleshWall', () => {
    const K = new Kit(), R = K.root;
    const wall = sculpt('fleshWall', geo('fwGrid', () => new THREE.PlaneGeometry(2, 2, 90, 90)), (v, c) => {
      const x = v.x, y = v.y, e = Math.max(Math.abs(x), Math.abs(y)), fade = sstep(1.0, 0.7, e);
      const f1 = fbm(x * 1.6 + 3, y * 1.6, 1), f2 = fbm(x * 4, y * 4 + 2, 3), ridge = Math.pow(1 - Math.abs(fbm(x * 2.4, y * 2.4, 7) - 0.5) * 2, 6);
      v.z = (f1 * 0.22 + f2 * 0.05 + ridge * 0.06 - 0.12) * fade;
      c.setRGB(1, 1, 1).multiplyScalar(0.7 + 0.45 * f2);
      mixC(c, H.fat, sstep(0.62, 0.78, fbm(x * 3 + 9, y * 3, 2)) * 0.55);
      mixC(c, 0x2a0410, Math.pow(1 - Math.abs(fbm(x * 6, y * 6, 4) - 0.5) * 2, 14) * 0.8);
      mixC(c, 0x1a0e0c, (1 - fade) * 0.85);
    });
    K.add(wall, 'wet', 0x3e1614, null, null, 1, R, { grime: 0.15, freq: 5 });
    const r = rng(1201);
    const zAt = (x, y) => { const e = Math.max(Math.abs(x), Math.abs(y)), fade = sstep(1.0, 0.7, e); return (fbm(x * 1.6 + 3, y * 1.6, 1) * 0.22 + fbm(x * 4, y * 4 + 2, 3) * 0.05 + Math.pow(1 - Math.abs(fbm(x * 2.4, y * 2.4, 7) - 0.5) * 2, 6) * 0.06 - 0.12) * fade; };
    for (let k = 0; k < 14; k++) { const pts = []; let x = (r() - 0.5) * 1.6, y = (r() - 0.5) * 1.6; for (let j = 0; j < 7; j++) { pts.push([+x.toFixed(3), +y.toFixed(3), +(zAt(x, y) + 0.012).toFixed(3)]); x += (r() - 0.5) * 0.3; y += (r() - 0.5) * 0.3; } K.add(ttube(pts, [0.016, 0.012, 0.008, 0.004], { segs: 24, radial: 5 }), 'wet', k % 3 ? 0x3a0a2a : 0x6a0a10, null, null, 1, R, { grime: 0.1 }); }
    for (let k = 0; k < 5; k++) {
      const cx = (r() - 0.5) * 1.3, cy = (r() - 0.5) * 1.3, z0 = zAt(cx, cy);
      K.add(lump('fwgum' + (k % 3), 0.08, 2, 0.3, 4, k % 3, 1.4, 0.7, 0.4), 'wet', 0x4a0a10, [cx, cy, z0 + 0.01], null, 1, R, { grime: 0.2 });
      for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI - Math.PI / 2 + (r() - 0.5) * 0.3; const c = new THREE.Color(H.tooth).lerp(_tc.set(H.toothDk), r()); K.add(rbox(0.026, 0.04, 0.02, 0.006), 'gloss', c, [cx + Math.cos(a) * 0.07, cy + Math.sin(a) * 0.035, z0 + 0.03], [0.5 + (r() - 0.5) * 0.4, 0, a + Math.PI / 2], 1, R, { grime: 0.3 }); }
    }
    for (const [x, y] of [[-0.35, 0.3], [0.42, -0.1]]) { const z0 = zAt(x, y); K.add(eyeball('flesh', 0x5a4a20), 'wet', 0xffffff, [x, y, z0 + 0.005], [0, 0, 0], 0.03, R, { grime: 0 }); K.add(sph(1, 8, 6), 'glow', EYE_SICK, [x, y, z0 + 0.034], null, 0.006, R); K.add(lump('fwlid', 0.045, 1, 0.3, 4, 2, 1.3, 0.6, 0.5), 'wet', 0x6a1a1a, [x, y + 0.02, z0 + 0.012], null, 1, R, { grime: 0.2 }); }
    return ownMats(K.build());
  }), []);
}
