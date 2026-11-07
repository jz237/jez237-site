// Rimstorm 2026 models: the Rimrunner hover-sled, every enemy, power-up pods, the guard droid and the five
// bosses, each built once from many detailed parts (bevelled plates, turned hulls, struts, rings, lamps).
// Static parts are merged per material class per moving joint (vertex-coloured class materials), later
// copies are cheap clones that share geometry, and a panel normal map adds seams, rivets and scratches.
// (The Kit is Swarmbreak's.)
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
    crystal: std({ color: 0xbfe6ff, metalness: 0.1, roughness: 0.06, transparent: true, opacity: 0.62, envMapIntensity: 2.6, emissive: 0x24507a, emissiveIntensity: 0.6 }),
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
function cloth(color, rough = 0.85) {
  const k = color + ':' + rough;
  if (!M.cloth.has(k)) { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, envMap: M.env, envMapIntensity: 0.5 }); m.userData.cls = 'rough'; M.cloth.set(k, m); }
  return M.cloth.get(k);
}

// ------------------------------------------------------------------ geometry library (cached)
const G = {};
const geo = (k, f) => G[k] || (G[k] = f());
const box = (x, y, z) => geo(`b${x},${y},${z}`, () => new THREE.BoxGeometry(x, y, z));
const cyl = (a, b, h, n = 16) => geo(`c${a},${b},${h},${n}`, () => new THREE.CylinderGeometry(a, b, h, n));
const sph = (r, w = 20, h = 14) => geo(`s${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h));
const cap = (r, l, n = 12) => geo(`k${r},${l},${n}`, () => new THREE.CapsuleGeometry(r, l, 6, n));
const tor = (r, t, n = 28, m = 8) => geo(`t${r},${t},${n},${m}`, () => new THREE.TorusGeometry(r, t, m, n));
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

// ------------------------------------------------------------------ the kit: collect parts, merge the static ones
const STATIC_PARTS = new Set(['hud', 'jet', 'visor', 'band', 'nozzle', 'coil', 'muzzle']);
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
  // a separate mesh (lamps, eyes, cores the renderer scales or swaps)
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
const bolts = (K, mat, pts, r = 0.018, parent) => { for (const [x, y, z, rx = 0, ry = 0, rz = Math.PI / 2] of pts) K.add(cyl(r, r, 0.02, 6), mat, x, y, z, rx, ry, rz, 1, 1, 1, parent); };

// ------------------------------------------------------------------ conventions
// Every model faces -z (down the tube, away from the rim) with +y up (the lane's inward normal). The
// renderer turns climbers around so they face the rim. One unit is about a metre at the rim's scale
// (a rim lane is ~3.9 wide). Threat classes are colour-coded so they read at phone size:
//   splitter red-orange, hopper green, spinewright violet, arc mite cyan, lancer amber, shocker blue, mirror pink.
export const CLASS_COLOR = { splitter: 0xff6a3a, hopper: 0x7dff6a, spinewright: 0xb07aff, mite: 0x5ae8ff, lancer: 0xffb03a, shocker: 0x5a8aff, mirror: 0xff5ad0 };

// ------------------------------------------------------------------ the Rimrunner: a hover-sled
// named parts: engL/engR (thrust glow), pads (hover glow), barrels (recoil), canopy, fins
export function rimrunner(color = 0x2f8cff, accent = 0x9fe8ff) {
  const g = make('rim' + color, () => {
    const K = new Kit();
    const hull = paint(color, 0.3, 0.55), trim = paint(0xdfe4ea, 0.28, 0.6), gun = paint(0x2c3038, 0.34, 0.85), deep = paint(0x1a1d22, 0.45, 0.7);
    const body = K.group('body');
    // central fuselage: a turned nose cone into a flattened hull
    K.add(lathe('rrnose', [[0, -1.9], [0.18, -1.75], [0.36, -1.35], [0.5, -0.8], [0.56, -0.2], [0.55, 0.5], [0.46, 1.1], [0.3, 1.4], [0, 1.45]], 28), hull, 0, 0.42, 0, Math.PI / 2, 0, 0, 1, 1, 0.5, body);
    K.add(rbox(1.1, 0.22, 2.2, 0.08), M.dark, 0, 0.26, 0.15, 0, 0, 0, 1, 1, 1, body);                  // belly pan
    K.add(rbox(0.9, 0.08, 1.6, 0.03), M.frame, 0, 0.14, 0.2, 0, 0, 0, 1, 1, 1, body);                   // keel plate
    K.add(box(0.7, 0.03, 1.2), glow(accent, 2.2), 0, 0.1, 0.2, 0, 0, 0, 1, 1, 1, body);                  // under-glow bar
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) K.add(box(0.04, 0.05, 0.22), M.black, s * 0.5, 0.36, -0.5 + i * 0.32, 0, 0, s * 0.3, 1, 1, 1, body);   // side vents
    K.add(rbox(0.5, 0.06, 0.9, 0.02), trim, 0, 0.66, 0.35, -0.05, 0, 0, 1, 1, 1, body);                 // spine plate
    K.add(rbox(0.06, 0.18, 0.7, 0.02), M.stripes, 0, 0.72, 0.45, 0, 0, 0, 1, 1, 1, body);               // dorsal stripe fin
    for (const s of [-1, 1]) {
      K.add(rbox(0.22, 0.05, 0.5, 0.02), deep, s * 0.22, 0.6, 0.75, 0, 0, s * 0.12, 1, 1, 1, body);       // engine deck panels
      K.add(rbox(0.12, 0.04, 0.3, 0.015), trim, s * 0.3, 0.55, -1.0, 0.15, 0, s * 0.3, 1, 1, 1, body);    // nose cheek plates
      K.add(box(0.02, 0.02, 0.36), glow(accent, 3), s * 0.36, 0.5, -0.95, 0.15, 0, s * 0.3, 1, 1, 1, body);  // cheek light lines
      for (let i = 0; i < 3; i++) K.add(cyl(0.02, 0.02, 0.02, 6), M.chrome, s * 0.2, 0.64, 0.5 + i * 0.18, 0, 0, Math.PI / 2, 1, 1, 1, body);   // rivets
    }
    // canopy with frame struts and a pilot helmet under the glass
    K.add(sph(0.36, 24, 14), M.glass, 0, 0.66, -0.55, 0, 0, 0, 0.75, 0.6, 1.5, body);
    K.add(tor(0.36, 0.03, 24, 6), M.frame, 0, 0.62, -0.55, Math.PI / 2, 0, 0, 0.78, 1.5, 1, body);
    K.rod(M.frame, 0, 0.88, -0.95, 0, 0.88, -0.2, 0.018, body);
    for (const s of [-1, 1]) K.rod(M.frame, s * 0.18, 0.62, -0.9, s * 0.12, 0.84, -0.55, 0.014, body);
    K.add(sph(0.12, 12, 10), M.ceramic, 0, 0.78, -0.42, 0, 0, 0, 1, 1, 1, body);
    K.mesh(sph(0.05, 10, 8), glow(accent, 5), 'hud', 0, 0.7, -0.35, 0, 0, 0, body);
    // sensor mast and antenna dish behind the canopy
    K.add(cyl(0.06, 0.08, 0.16, 10), M.steel, 0, 0.78, 0.0, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.13, 0.03, 0.05, 14), M.chrome, 0, 0.88, 0.0, 0.5, 0, 0, 1, 1, 1, body);
    // side pontoons with hover pads, intakes and twin emitter barrels
    for (const s of [-1, 1]) {
      const side = K.group(s < 0 ? 'podL' : 'podR', body, s * 1.05, 0.3, 0.1);
      K.add(cap(0.24, 1.7, 14), hull, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, side);
      K.add(rbox(0.5, 0.12, 1.9, 0.05), M.dark, 0, -0.18, 0, 0, 0, 0, 1, 1, 1, side);
      K.add(rbox(0.16, 0.3, 0.5, 0.04), trim, s * -0.28, 0.02, -0.2, 0, 0, s * 0.2, 1, 1, 1, side);   // strut fairing
      K.rod(M.chrome, s * -0.5, 0.05, -0.4, 0, 0.02, -0.4, 0.03, side);
      K.rod(M.chrome, s * -0.5, 0.05, 0.5, 0, 0.02, 0.5, 0.03, side);
      K.rod(M.copper, s * -0.45, 0.12, -0.1, s * -0.05, 0.12, 0.3, 0.012, side);                        // fuel line
      for (let i = 0; i < 3; i++) K.add(tor(0.245, 0.018, 20, 6), M.frame, 0, 0, -0.6 + i * 0.6, 0, 0, 0, 1, 1, 1, side);
      // intake scoop at the front of the pontoon
      K.add(rbox(0.3, 0.18, 0.24, 0.04), trim, 0, 0.14, -0.78, 0.2, 0, 0, 1, 1, 1, side);
      K.add(box(0.22, 0.1, 0.05), M.black, 0, 0.15, -0.9, 0.2, 0, 0, 1, 1, 1, side);
      K.mesh(rbox(0.36, 0.04, 1.5, 0.02), glow(accent, 3), 'pad' + (s < 0 ? 'L' : 'R'), 0, -0.26, 0, 0, 0, 0, side);
      for (let i = 0; i < 3; i++) K.add(cyl(0.1, 0.12, 0.03, 12), glow(accent, 4), 0, -0.27, -0.5 + i * 0.5, 0, 0, 0, 1, 1, 1, side);   // emitter discs
      // engine at the back: shroud, petals, glowing throat
      K.add(lathe('rreng', [[0.16, 0], [0.24, 0.1], [0.26, 0.35], [0.2, 0.5], [0.16, 0.52]], 20), gun, 0, 0, 0.95, Math.PI / 2, 0, 0, 1, 1, 1, side);
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.add(box(0.05, 0.03, 0.14), M.steel, Math.cos(a) * 0.2, Math.sin(a) * 0.2, 1.5, 0, 0, a, 1, 1, 1, side); }
      K.add(tor(0.2, 0.025, 18, 6), M.chrome, 0, 0, 1.36, 0, 0, 0, 1, 1, 1, side);
      K.mesh(cyl(0.15, 0.12, 0.06, 16), glow(0xffb26a, 5), s < 0 ? 'engL' : 'engR', 0, 0, 1.46, Math.PI / 2, 0, 0, side);
      // emitter barrel forward
      const bar = K.group(s < 0 ? 'barL' : 'barR', side, 0, 0.12, -0.95);
      K.add(cyl(0.07, 0.08, 0.9, 12), gun, 0, 0, -0.35, Math.PI / 2, 0, 0, 1, 1, 1, bar);
      K.add(rbox(0.1, 0.12, 0.3, 0.02), deep, 0, 0.08, -0.05, 0, 0, 0, 1, 1, 1, bar);                       // capacitor housing
      for (let i = 0; i < 3; i++) K.add(tor(0.085, 0.014, 14, 6), M.chrome, 0, 0, -0.1 - i * 0.22, 0, 0, 0, 1, 1, 1, bar);
      for (let i = 0; i < 2; i++) K.mesh(tor(0.075, 0.01, 14, 6), glow(accent, 3.5), 'coil' + i, 0, 0, -0.2 - i * 0.22, 0, 0, 0, bar);
      K.add(cyl(0.09, 0.07, 0.08, 12), M.steel, 0, 0, -0.78, Math.PI / 2, 0, 0, 1, 1, 1, bar);              // muzzle brake
      K.mesh(cyl(0.06, 0.06, 0.03, 12), glow(accent, 6), 'muzzle' + (s < 0 ? 'L' : 'R'), 0, 0, -0.84, Math.PI / 2, 0, 0, bar);
      // wing fin with a light edge and a nav light
      K.add(rbox(0.7, 0.05, 0.6, 0.02), hull, s * 0.35, 0.2, 0.75, 0, s * 0.25, s * -0.35, 1, 1, 1, side);
      K.add(box(0.5, 0.02, 0.05), glow(accent, 3.5), s * 0.45, 0.28, 0.98, 0, s * 0.25, s * -0.35, 1, 1, 1, side);
      K.add(box(0.05, 0.05, 0.05), glow(s < 0 ? 0xff3a2a : 0x3aff6a, 5), s * 0.24, 0.3, -0.85, 0, 0, 0, 1, 1, 1, side);   // nav light (port red / starboard green)
      K.add(rbox(0.04, 0.22, 0.3, 0.01), trim, s * 0.62, 0.4, 0.9, 0, 0, s * -0.6, 1, 1, 1, side);           // winglet
    }
    // tail: twin rudders joined by a spoiler, a sensor mast
    for (const s of [-1, 1]) K.add(rbox(0.05, 0.42, 0.5, 0.02), hull, s * 0.22, 0.82, 0.95, 0, 0, s * 0.18, 1, 1, 1, body);
    K.add(rbox(0.62, 0.04, 0.26, 0.015), trim, 0, 1.0, 1.08, -0.12, 0, 0, 1, 1, 1, body);
    K.add(box(0.5, 0.02, 0.03), glow(0xff3a2a, 4), 0, 1.02, 1.21, 0, 0, 0, 1, 1, 1, body);                  // brake light bar
    K.rod(M.steel, 0, 0.68, 1.0, 0, 1.0, 1.2, 0.012, body);
    K.add(sph(0.025, 8, 6), glow(0xff3a2a, 6), 0, 1.01, 1.21, 0, 0, 0, 1, 1, 1, body);
    K.add(cone(0.08, 0.3, 3), glow(accent, 3), 0, 0.63, -1.2, -Math.PI / 2, 0, 0, 1, 1, 0.3, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), engL: by(g, 'engL'), engR: by(g, 'engR'), padL: by(g, 'padL'), padR: by(g, 'padR'), barL: by(g, 'barL'), barR: by(g, 'barR'), podL: by(g, 'podL'), podR: by(g, 'podR') };
}

// ------------------------------------------------------------------ enemies
// SPLITTER: two armoured half-pods clamped together around a glowing seam (it comes apart into two hoppers)
export function splitter() {
  const g = make('splitter', () => {
    const K = new Kit();
    const shell = paint(0xc84a2c, 0.32, 0.55), plate = paint(0x2b2f36, 0.4, 0.8), pale = paint(0xe8d6c8, 0.36, 0.4);
    for (const s of [-1, 1]) {
      const h = K.group(s < 0 ? 'halfL' : 'halfR', K.root, s * 0.42, 0.7, 0);
      K.add(sph(0.62, 24, 16), shell, 0, 0, 0, 0, 0, 0, 0.75, 0.8, 1.15, h);
      K.add(rbox(0.12, 0.9, 1.3, 0.05), plate, s * -0.42, 0, 0, 0, 0, 0, 1, 1, 1, h);
      for (let i = 0; i < 3; i++) K.add(tor(0.5, 0.03, 22, 6), M.frame, s * 0.05, 0, -0.45 + i * 0.45, 0, 0, 0, 0.85, 0.95, 1, h);
      for (let i = 0; i < 3; i++) K.add(cone(0.08, 0.42, 6), M.steel, s * 0.35, 0.38 - i * 0.38, -0.2 + i * 0.1, 0, 0, s * -1.2, 1, 1, 1, h);   // spikes
      // armour scales over the shell and a pale nose cap
      for (let i = 0; i < 3; i++) K.add(rbox(0.36, 0.05, 0.32, 0.02), plate, s * 0.2, 0.42, -0.4 + i * 0.36, 0.1, 0, s * -0.55, 1, 1, 1, h);
      K.add(sph(0.3, 16, 10, ), pale, s * 0.06, 0.02, -0.62, 0, 0, 0, 1, 0.9, 0.7, h);
      // vent grille and exhaust
      for (let i = 0; i < 4; i++) K.add(box(0.03, 0.22, 0.04), M.black, s * 0.44, -0.12, -0.15 + i * 0.1, 0, 0, s * 0.25, 1, 1, 1, h);
      K.add(cyl(0.16, 0.2, 0.2, 12), plate, 0, 0, 0.72, Math.PI / 2, 0, 0, 1, 1, 1, h);
      K.add(tor(0.17, 0.025, 14, 6), M.chrome, 0, 0, 0.8, 0, 0, 0, 1, 1, 1, h);
      K.mesh(cyl(0.12, 0.1, 0.04, 12), glow(0xff8a4a, 4), 'jet' + (s < 0 ? 'L' : 'R'), 0, 0, 0.84, Math.PI / 2, 0, 0, h);
      // eye cluster
      K.add(sph(0.1, 10, 8), glow(0xffd27a, 6), s * 0.2, 0.18, -0.68, 0, 0, 0, 1, 1, 1, h);
      K.add(sph(0.05, 8, 6), glow(0xff7a3a, 6), s * 0.32, 0.02, -0.64, 0, 0, 0, 1, 1, 1, h);
      K.add(sph(0.05, 8, 6), glow(0xff7a3a, 6), s * 0.12, -0.06, -0.7, 0, 0, 0, 1, 1, 1, h);
      K.add(tor(0.11, 0.02, 12, 6), M.chrome, s * 0.2, 0.18, -0.66, 0, 0, 0, 1, 1, 1, h);
      K.add(box(0.02, 0.4, 0.02), glow(0xff6a2a, 3.5), s * 0.5, 0.0, 0.2, 0, 0, s * 0.3, 1, 1, 1, h);       // flank light line
    }
    K.mesh(rbox(0.1, 0.95, 1.25, 0.04), glow(0xff6a2a, 3.5), 'seam', 0, 0.7, 0, 0, 0, 0);
    for (const z of [-0.45, 0.45]) {
      K.add(rbox(1.1, 0.12, 0.16, 0.04), M.chrome, 0, 1.2, z, 0, 0, 0, 1, 1, 1);                      // clamps
      K.add(cyl(0.05, 0.05, 0.2, 8), M.steel, 0, 1.28, z, 0, 0, 0, 1, 1, 1);
      K.add(sph(0.035, 8, 6), glow(0xffd27a, 6), 0, 1.4, z, 0, 0, 0, 1, 1, 1);
    }
    K.rod(M.copper, -0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.025); K.rod(M.copper, -0.3, 0.25, 0.1, 0.3, 0.25, 0.1, 0.02);   // cables
    return K.build();
  });
  return { g, L: by(g, 'halfL'), R: by(g, 'halfR'), seam: by(g, 'seam') };
}
// HOPPER: a squat grappler on four sprung legs, two hooked arms in front
export function hopper() {
  const g = make('hopper', () => {
    const K = new Kit();
    const shell = paint(0x2fbf6a, 0.3, 0.5), dark = paint(0x23262c, 0.4, 0.8), pale = paint(0xd8e8d0, 0.35, 0.4);
    const body = K.group('body', K.root, 0, 0.75, 0);
    K.add(lathe('hopbody', [[0, -0.3], [0.5, -0.28], [0.68, -0.1], [0.7, 0.1], [0.55, 0.3], [0.3, 0.42], [0, 0.45]], 24), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1.15, body);
    K.add(tor(0.69, 0.05, 24, 6), M.frame, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1.15, 1, body);
    K.add(rbox(0.5, 0.12, 0.5, 0.04), dark, 0, 0.42, 0.05, 0, 0, 0, 1, 1, 1, body);
    // carapace plates and a dorsal light strip
    for (const s of [-1, 1]) K.add(rbox(0.42, 0.05, 0.7, 0.02), pale, s * 0.36, 0.3, 0.05, 0, 0, s * -0.45, 1, 1, 1, body);
    K.add(box(0.05, 0.02, 0.6), glow(0x9fff7a, 3.5), 0, 0.5, 0.05, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 4; i++) K.add(cyl(0.025, 0.025, 0.02, 6), M.chrome, -0.15 + i * 0.1, 0.49, -0.18, 0, 0, 0, 1, 1, 1, body);
    // sensor face: a big eye and two small ones
    K.mesh(sph(0.16, 14, 10), glow(0xb6ff5a, 4.5), 'eye', 0, 0.12, -0.7, 0, 0, 0, body);
    K.add(tor(0.17, 0.03, 16, 6), M.chrome, 0, 0.12, -0.68, 0, 0, 0, 1, 1, 1, body);
    for (const s of [-1, 1]) { K.add(sph(0.06, 8, 6), glow(0xd8ff9a, 6), s * 0.26, 0.2, -0.64, 0, 0, 0, 1, 1, 1, body); K.add(rbox(0.16, 0.06, 0.1, 0.02), dark, s * 0.26, 0.28, -0.62, 0, 0, 0, 1, 1, 1, body); }
    // jump jets and an exhaust stack
    for (const s of [-1, 1]) K.add(cyl(0.12, 0.16, 0.24, 10), dark, s * 0.32, 0.25, 0.62, Math.PI / 2 - 0.4, 0, 0, 1, 1, 1, body);
    for (const s of [-1, 1]) K.mesh(cyl(0.1, 0.08, 0.03, 10), glow(0x9fffd0, 4), 'jet' + (s < 0 ? 'L' : 'R'), s * 0.32, 0.2, 0.74, Math.PI / 2 - 0.4, 0, 0, body);
    K.add(cyl(0.06, 0.08, 0.3, 8), M.steel, 0, 0.55, 0.45, -0.5, 0, 0, 1, 1, 1, body);
    // legs: hip, thigh, knee, piston, shin, foot pad
    for (const [sx, sz, nm] of [[-1, -1, 'legFL'], [1, -1, 'legFR'], [-1, 1, 'legBL'], [1, 1, 'legBR']]) {
      const hip = K.group(nm, body, sx * 0.48, -0.1, sz * 0.42);
      K.add(sph(0.11, 10, 8), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(dark, 0, 0, 0, sx * 0.45, 0.25, sz * 0.25, 0.06, hip);
      K.add(sph(0.075, 10, 8), M.steel, sx * 0.45, 0.25, sz * 0.25, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.chrome, sx * 0.45, 0.25, sz * 0.25, sx * 0.62, -0.62, sz * 0.38, 0.04, hip);
      K.rod(M.copper, sx * 0.2, 0.08, sz * 0.12, sx * 0.55, -0.3, sz * 0.33, 0.02, hip);                    // spring piston
      K.add(cyl(0.11, 0.13, 0.05, 10), M.rubber, sx * 0.62, -0.68, sz * 0.38, 0, 0, 0, 1, 1, 1, hip);
      K.add(cone(0.07, 0.16, 8), M.steel, sx * 0.62, -0.78, sz * 0.38, Math.PI, 0, 0, 1, 1, 1, hip);
    }
    // grappling arms with two-prong claws
    for (const s of [-1, 1]) {
      const arm = K.group(s < 0 ? 'armL' : 'armR', body, s * 0.38, -0.05, -0.55);
      K.rod(dark, 0, 0, 0, s * 0.1, -0.15, -0.55, 0.07, arm);
      K.add(sph(0.08, 8, 6), M.frame, s * 0.1, -0.15, -0.55, 0, 0, 0, 1, 1, 1, arm);
      K.rod(M.chrome, s * 0.1, -0.15, -0.55, s * -0.18, -0.35, -0.82, 0.045, arm);
      K.add(tor(0.14, 0.035, 12, 6), M.steel, s * -0.24, -0.42, -0.86, 0, Math.PI / 2, 0, 1, 1, 1, arm);   // hook
      K.add(cone(0.04, 0.2, 6), M.chrome, s * -0.3, -0.3, -0.98, -Math.PI / 2, 0, 0, 1, 1, 1, arm);
    }
    return K.build();
  });
  return { g, body: by(g, 'body'), legs: all(g, 'leg'), arms: [by(g, 'armL'), by(g, 'armR')], eye: by(g, 'eye') };
}
// SPINEWRIGHT: a segmented burrower that extrudes crystal from its tail
export function spinewright() {
  const g = make('spinewright', () => {
    const K = new Kit();
    const shell = paint(0x8a52e8, 0.28, 0.45), dark = paint(0x24222c, 0.4, 0.7), pale = paint(0xd8ccf0, 0.3, 0.4);
    for (let i = 0; i < 4; i++) {
      const seg = K.group('seg' + i, K.root, 0, 0.6, -0.9 + i * 0.6);
      const r = 0.55 - i * 0.07;
      K.add(sph(r, 20, 14), shell, 0, 0, 0, 0, 0, 0, 1.1, 0.8, 0.9, seg);
      K.add(tor(r * 1.05, 0.04, 22, 6), M.frame, 0, 0, 0, 0, 0, 0, 1.05, 0.8, 1, seg);
      for (const s of [-1, 1]) {
        K.rod(dark, s * r * 0.9, -0.1, 0, s * (r + 0.35), -0.55, 0.1, 0.035, seg);
        K.add(sph(0.05, 8, 6), M.steel, s * (r + 0.35), -0.57, 0.1, 0, 0, 0, 1, 1, 1, seg);
        K.add(box(0.03, 0.14, 0.03), glow(0xd8a6ff, 4), s * r * 1.02, 0.05, 0, 0, 0, s * 0.3, 1, 1, 1, seg);   // gill light
      }
      K.add(rbox(r * 1.2, 0.08, 0.3, 0.03), dark, 0, r * 0.75, 0, 0, 0, 0, 1, 1, 1, seg);
      // crystal studs growing out of the back
      K.add(cone(0.07, 0.3 - i * 0.03, 5), M.crystal, 0, r * 0.75 + 0.18, 0, 0, 0, 0, 1, 1, 1, seg);
      for (const s of [-1, 1]) K.add(cone(0.05, 0.2, 5), M.crystal, s * r * 0.45, r * 0.7 + 0.1, 0.05, 0, 0, s * -0.5, 1, 1, 1, seg);
    }
    // head: armoured skull, mandibles, three eyes and a sensor visor
    K.add(rbox(0.6, 0.3, 0.4, 0.08), dark, 0, 0.58, -1.35, 0, 0, 0, 1, 1, 1);
    K.add(rbox(0.5, 0.08, 0.36, 0.03), pale, 0, 0.76, -1.33, 0.1, 0, 0, 1, 1, 1);
    for (const s of [-1, 1]) {
      K.add(cone(0.08, 0.5, 6), M.chrome, s * 0.22, 0.48, -1.65, -Math.PI / 2 + 0.2, s * 0.3, 0, 1, 1, 1);
      K.add(cone(0.05, 0.3, 6), M.steel, s * 0.3, 0.38, -1.55, -Math.PI / 2 + 0.5, s * 0.6, 0, 1, 1, 1);
      K.add(sph(0.05, 8, 6), glow(0xf0c0ff, 6), s * 0.18, 0.7, -1.56, 0, 0, 0, 1, 1, 1);
    }
    K.mesh(rbox(0.5, 0.06, 0.06, 0.02), glow(0xd8a6ff, 5), 'visor', 0, 0.66, -1.56, 0, 0, 0);
    // crystal emitter: a chrome collar with shards around a glowing nozzle
    K.add(cyl(0.18, 0.28, 0.3, 6), M.chrome, 0, 0.6, 1.25, Math.PI / 2, 0, 0, 1, 1, 1);
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; K.add(cone(0.05, 0.28, 5), M.crystal, Math.cos(a) * 0.24, 0.6 + Math.sin(a) * 0.24, 1.45, Math.PI / 2, 0, 0, 1, 1, 1); }
    K.mesh(cone(0.16, 0.5, 6), glow(0xc0a0ff, 4), 'nozzle', 0, 0.6, 1.5, Math.PI / 2, 0, 0);
    return K.build();
  });
  return { g, segs: all(g, 'seg'), nozzle: by(g, 'nozzle') };
}
// ARC MITE: a crackling core held in three tesla prongs, with a spinning ring
export function mite() {
  const g = make('mite', () => {
    const K = new Kit();
    const dark = paint(0x2a2d36, 0.35, 0.85), teal = paint(0x2a8a9a, 0.3, 0.6);
    K.mesh(ico(0.32, 1), glow(0x8fe8ff, 5), 'core', 0, 0.75, 0);
    K.add(sph(0.42, 18, 12), M.glassT, 0, 0.75, 0);
    K.add(tor(0.43, 0.025, 20, 6), M.chrome, 0, 0.75, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
      K.rod(dark, c * 0.3, 0.75 + s * 0.3, 0, c * 0.8, 0.75 + s * 0.8, 0, 0.06);
      for (let j = 0; j < 3; j++) K.add(tor(0.075, 0.02, 10, 6), M.copper, c * (0.42 + j * 0.11), 0.75 + s * (0.42 + j * 0.11), 0, 0, 0, a + Math.PI / 2, 1, 1, 1);   // coil windings
      K.add(sph(0.11, 12, 8), M.copper, c * 0.84, 0.75 + s * 0.84, 0);
      K.add(sph(0.05, 8, 6), glow(0xbff4ff, 6), c * 0.95, 0.75 + s * 0.95, 0);
      K.add(rbox(0.16, 0.1, 0.22, 0.03), teal, c * 0.55, 0.75 + s * 0.55, 0.12, 0, 0, a, 1, 1, 1);           // capacitor packs
    }
    const ring = K.group('ring', K.root, 0, 0.75, 0);
    K.add(tor(0.62, 0.05, 32, 6), M.chrome, 0, 0, 0, 0, 0, 0, 1, 1, 1, ring);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.add(box(0.1, 0.1, 0.16), dark, Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0, 0, 0, a, 1, 1, 1, ring); K.add(box(0.03, 0.03, 0.18), glow(0x8fe8ff, 4), Math.cos(a) * 0.68, Math.sin(a) * 0.68, 0, 0, 0, a, 1, 1, 1, ring); }
    return K.build();
  });
  return { g, core: by(g, 'core'), ring: by(g, 'ring') };
}
// LANCER: a gunship drone with a long lance cannon and a charge core
export function lancer() {
  const g = make('lancer', () => {
    const K = new Kit();
    const shell = paint(0xe0aa30, 0.28, 0.6), dark = paint(0x25282e, 0.38, 0.85), pale = paint(0xe8e2d4, 0.32, 0.4);
    K.add(lathe('lancebody', [[0, -0.9], [0.3, -0.75], [0.45, -0.3], [0.48, 0.3], [0.36, 0.7], [0, 0.82]], 22), shell, 0, 0.75, 0, Math.PI / 2, 0, 0, 1.25, 1, 0.8);
    K.add(rbox(0.5, 0.08, 0.9, 0.03), dark, 0, 1.12, 0.15, 0, 0, 0);                                       // dorsal plate
    for (let i = 0; i < 3; i++) K.add(box(0.36, 0.03, 0.04), M.black, 0, 1.17, -0.1 + i * 0.18, 0, 0, 0);   // vents
    // lance barrel with shroud, capacitor rings and a muzzle crown
    K.add(cyl(0.11, 0.13, 1.9, 14), dark, 0, 0.75, -1.4, Math.PI / 2, 0, 0);
    K.add(rbox(0.3, 0.3, 0.7, 0.06), pale, 0, 0.75, -0.75, 0, 0, 0);
    for (let i = 0; i < 4; i++) K.add(tor(0.14, 0.025, 14, 6), M.chrome, 0, 0.75, -0.8 - i * 0.4, 0, 0, 0);
    for (let i = 0; i < 3; i++) K.add(tor(0.125, 0.012, 14, 6), glow(0xffb03a, 3.5), 0, 0.75, -1.0 - i * 0.4, 0, 0, 0);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; K.add(box(0.04, 0.04, 0.2), M.steel, Math.cos(a) * 0.15, 0.75 + Math.sin(a) * 0.15, -2.3, 0, 0, a); }
    K.mesh(sph(0.2, 14, 10), glow(0xffb03a, 4), 'charge', 0, 0.75, -2.38);
    for (const s of [-1, 1]) {
      K.add(rbox(1.0, 0.06, 0.7, 0.03), shell, s * 0.7, 0.72, 0.15, 0, s * 0.2, s * -0.12);
      K.add(box(0.8, 0.02, 0.04), glow(0xffd27a, 3), s * 0.75, 0.76, -0.18, 0, s * 0.2, s * -0.12);          // wing leading-edge light
      K.add(rbox(0.08, 0.32, 0.5, 0.03), dark, s * 1.15, 0.8, 0.25, 0, 0, s * -0.1);
      K.add(cyl(0.12, 0.15, 0.4, 10), dark, s * 0.5, 0.75, 0.75, Math.PI / 2, 0, 0);
      K.add(tor(0.13, 0.02, 12, 6), M.chrome, s * 0.5, 0.75, 0.95, 0, 0, 0);
      K.mesh(cyl(0.1, 0.08, 0.03, 10), glow(0xffd27a, 4), 'jet' + (s < 0 ? 'L' : 'R'), s * 0.5, 0.75, 0.96, Math.PI / 2, 0, 0);
      // under-wing missiles
      K.add(cyl(0.05, 0.05, 0.5, 8), pale, s * 0.85, 0.6, 0.05, Math.PI / 2, 0, 0);
      K.add(cone(0.05, 0.12, 8), glow(0xff5a3a, 3), s * 0.85, 0.6, -0.26, -Math.PI / 2, 0, 0);
    }
    K.add(sph(0.22, 14, 10), M.glass, 0, 1.08, -0.25, 0, 0, 0, 1, 0.6, 1.4);
    K.add(tor(0.22, 0.02, 16, 6), M.frame, 0, 1.06, -0.25, Math.PI / 2, 0, 0, 1, 1.4, 1);
    return K.build();
  });
  return { g, charge: by(g, 'charge') };
}
// SHOCKER: a pylon walker with twin electrode horns; the horns glow before it strikes the lane
export function shocker() {
  const g = make('shocker', () => {
    const K = new Kit();
    const shell = paint(0x2f6ae8, 0.28, 0.55), dark = paint(0x23262d, 0.4, 0.8);
    K.add(rbox(1.0, 0.5, 1.2, 0.12), dark, 0, 0.45, 0);
    K.add(lathe('shockdome', [[0, 0], [0.5, 0.02], [0.55, 0.2], [0.42, 0.45], [0, 0.55]], 22), shell, 0, 0.7, 0);
    K.add(tor(0.52, 0.04, 22, 6), M.frame, 0, 0.74, 0, Math.PI / 2, 0, 0);
    // capacitor banks on both flanks and hazard stripes on the deck
    for (const s of [-1, 1]) {
      for (let i = 0; i < 3; i++) { K.add(cyl(0.08, 0.08, 0.36, 10), M.ceramic, s * 0.58, 0.48, -0.36 + i * 0.36, 0, 0, Math.PI / 2); K.add(cyl(0.085, 0.085, 0.04, 10), glow(0x9fc8ff, 3), s * 0.78, 0.48, -0.36 + i * 0.36, 0, 0, Math.PI / 2); }
      K.add(rbox(0.12, 0.1, 0.9, 0.03), M.stripes, s * 0.45, 0.72, 0.1, 0, 0, s * 0.4);
    }
    for (const s of [-1, 1]) {
      const horn = K.group(s < 0 ? 'hornL' : 'hornR', K.root, s * 0.42, 1.0, -0.1);
      K.rod(M.chrome, 0, 0, 0, s * 0.35, 0.9, -0.25, 0.06, horn);
      for (let i = 0; i < 5; i++) K.add(cyl(0.12 - i * 0.012, 0.12 - i * 0.012, 0.04, 12), M.ceramic, s * (0.04 + i * 0.07), 0.12 + i * 0.17, -0.04 - i * 0.048, -0.27, 0, s * -0.37, 1, 1, 1, horn);   // insulator discs
      K.mesh(sph(0.12, 12, 8), glow(0x9fe8ff, 4), 'tip' + (s < 0 ? 'L' : 'R'), s * 0.36, 0.95, -0.26, 0, 0, 0, horn);
    }
    // walker legs with feet
    for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
      K.add(sph(0.1, 10, 8), M.frame, x * 0.8, 0.35, z * 0.8);
      K.rod(dark, x * 0.8, 0.35, z * 0.8, x * 1.15, 0.3, z * 1.05, 0.06);
      K.rod(M.chrome, x * 1.15, 0.3, z * 1.05, x * 1.3, 0.02, z * 1.2, 0.045);
      K.add(cyl(0.14, 0.16, 0.06, 10), M.steel, x * 1.3, 0.02, z * 1.2);
    }
    K.mesh(rbox(0.5, 0.05, 0.05, 0.02), glow(0x9fe8ff, 4), 'band', 0, 0.62, -0.62);
    for (const s of [-1, 1]) K.add(sph(0.05, 8, 6), glow(0xff5a3a, 6), s * 0.3, 0.72, -0.6);                 // warning lamps
    return K.build();
  });
  return { g, tips: [by(g, 'tipL'), by(g, 'tipR')] };
}
// MIRROR: a chrome gyro core inside a faceted crystal shell that sends the first shot back
export function mirror() {
  const g = make('mirror', () => {
    const K = new Kit();
    K.add(sph(0.36, 20, 14), M.chrome, 0, 0.8, 0);
    K.mesh(sph(0.16, 12, 8), glow(0xff5ad0, 5), 'core', 0, 0.8, -0.3);
    for (let i = 0; i < 2; i++) K.add(tor(0.48 + i * 0.08, 0.025, 28, 6), i ? M.brass : M.chrome, 0, 0.8, 0, i ? Math.PI / 2 : 0.4, i ? 0 : 0.8, 0);   // gyro rings
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.add(sph(0.035, 8, 6), glow(0xff8ae0, 6), Math.cos(a) * 0.52, 0.8 + Math.sin(a) * 0.52, 0); }
    const shell = K.group('shell', K.root, 0, 0.8, 0);
    K.mesh(new THREE.OctahedronGeometry(0.85, 0), M.crystal, 'facets', 0, 0, 0, 0, 0, 0, shell);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; K.add(box(0.06, 0.06, 0.9), M.frame, Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0, 0, 0, a, 1, 1, 1, shell); }
    for (const y of [-0.85, 0.85]) K.add(cone(0.08, 0.22, 6), M.chrome, 0, y, 0, y > 0 ? 0 : Math.PI, 0, 0, 1, 1, 1, shell);   // shell tips
    // a little thruster skirt underneath
    K.add(cyl(0.22, 0.3, 0.16, 12), paint(0x3a2a40, 0.35, 0.8), 0, 0.1, 0);
    K.add(cyl(0.18, 0.18, 0.03, 12), glow(0xff5ad0, 3), 0, 0.01, 0);
    return K.build();
  });
  return { g, shell: by(g, 'shell'), core: by(g, 'core'), facets: by(g, 'facets') };
}
// the crystal a spinewright lays (instanced along the lane): a hexagonal shard, 1 unit long on z
export function spineGeometry() {
  return geo('spineshard', () => {
    const g = new THREE.CylinderGeometry(0.22, 0.34, 1, 6, 1);
    g.rotateX(Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const z = p.getZ(i); p.setY(i, p.getY(i) * (1.2 - Math.abs(z) * 0.4)); }
    g.computeVertexNormals();
    return g;
  });
}
// a power-up pod: a capsule cage around a coloured core with the power-up's emblem floating inside
export function pod(color, kind = '') {
  const g = make('pod' + color + kind, () => {
    const K = new Kit();
    K.mesh(sph(0.26, 16, 12), glow(color, 3.5), 'core', 0, 0.7, 0);
    K.add(sph(0.5, 20, 14), M.glassT, 0, 0.7, 0);
    for (let i = 0; i < 3; i++) K.add(tor(0.5, 0.035, 28, 6), M.chrome, 0, 0.7, 0, (i * Math.PI) / 3, Math.PI / 2, 0);
    K.add(tor(0.52, 0.02, 28, 6), glow(color, 2.5), 0, 0.7, 0, Math.PI / 2, 0, 0);
    for (const y of [0.18, 1.22]) { K.add(cyl(0.18, 0.22, 0.1, 14), M.frame, 0, y, 0); K.add(cyl(0.1, 0.1, 0.04, 12), glow(color, 4), 0, y + (y > 1 ? 0.06 : -0.06), 0); }
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; K.rod(M.steel, Math.cos(a) * 0.2, 0.22, Math.sin(a) * 0.2, Math.cos(a) * 0.2, 1.18, Math.sin(a) * 0.2, 0.015); }
    // emblem in front of the core
    const em = glow(0xffffff, 3);
    if (kind === 'twin') { for (const s of [-1, 1]) K.add(box(0.07, 0.07, 0.36), em, s * 0.1, 0.7, -0.3); }
    else if (kind === 'rapid') { for (let i = 0; i < 3; i++) K.add(cone(0.1, 0.12, 3), em, 0, 0.7, -0.22 - i * 0.12, -Math.PI / 2, 0, 0, 1, 1, 0.4); }
    else if (kind === 'droid') K.add(box(0.18, 0.18, 0.18), em, 0, 0.7, -0.32, 0.6, 0.6, 0);
    else if (kind === 'hop') K.add(cone(0.14, 0.24, 4), em, 0, 0.74, -0.32, 0, Math.PI / 4, 0);
    return K.build();
  });
  return { g, core: by(g, 'core') };
}
// guard droid: a little tripod turret that sits at the rim of a lane
export function droid() {
  const g = make('droid', () => {
    const K = new Kit();
    const shell = paint(0x2fae6a, 0.3, 0.6), dark = paint(0x25282e, 0.4, 0.85);
    K.add(cyl(0.45, 0.55, 0.25, 18), dark, 0, 0.2, 0);
    K.add(tor(0.5, 0.03, 22, 6), glow(0x7dff9a, 2.5), 0, 0.33, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; K.rod(M.steel, Math.cos(a) * 0.4, 0.15, Math.sin(a) * 0.4, Math.cos(a) * 0.75, -0.05, Math.sin(a) * 0.75, 0.04); K.add(cyl(0.08, 0.1, 0.04, 8), M.rubber, Math.cos(a) * 0.75, -0.06, Math.sin(a) * 0.75); }
    const head = K.group('head', K.root, 0, 0.55, 0);
    K.add(sph(0.36, 18, 12), shell, 0, 0, 0, 0, 0, 0, 1, 0.8, 1, head);
    K.add(rbox(0.5, 0.1, 0.3, 0.03), dark, 0, 0.22, 0.1, 0, 0, 0, 1, 1, 1, head);
    K.add(cyl(0.12, 0.12, 0.22, 12), M.brass, 0, 0, 0.32, Math.PI / 2, 0, 0, 1, 1, 1, head);              // ammo drum
    K.rod(M.steel, 0.12, 0.25, 0.15, 0.2, 0.6, 0.2, 0.012, head);                                       // antenna
    K.add(sph(0.025, 6, 4), glow(0xff3a2a, 6), 0.2, 0.61, 0.2, 0, 0, 0, 1, 1, 1, head);
    for (const s of [-1, 1]) { K.add(cyl(0.06, 0.07, 0.8, 10), dark, s * 0.16, 0, -0.45, Math.PI / 2, 0, 0, 1, 1, 1, head); K.add(tor(0.07, 0.015, 10, 6), M.chrome, s * 0.16, 0, -0.6, 0, 0, 0, 1, 1, 1, head); K.add(box(0.03, 0.03, 0.03), glow(0x7dff9a, 6), s * 0.16, 0, -0.86, 0, 0, 0, 1, 1, 1, head); }
    K.mesh(rbox(0.3, 0.06, 0.04, 0.02), glow(0x7dff9a, 5), 'eye', 0, 0.12, -0.33, 0, 0, 0, head);
    return K.build();
  });
  return { g, head: by(g, 'head') };
}

// ------------------------------------------------------------------ bosses
// Each boss is built around the tube axis (x/y) and faces the rim (+z); its outer radius is about 4.6 (the
// renderer scales it to fill most of the tube at its depth). Armour segments, heads and facets are separate
// models the renderer places per lane. Every boss has a named 'core' (scaled when it is open) and most a
// 'spin' group that turns.
const ring = (K, n, r, f) => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; f(a, Math.cos(a) * r, Math.sin(a) * r, i); } };
export function bossCore(key) {
  const g = make('boss' + key, () => {
    const K = new Kit();
    const dark = paint(0x22252c, 0.38, 0.85), gun = paint(0x30343c, 0.34, 0.85);
    if (key === 'maelstrom') {
      // MAELSTROM CORE: a turbine reactor. Stator drum with radial vanes, gimballed cage rings round a blazing
      // core, an iris of petals at the front, conduits out to the armour ring, thrusters behind.
      const hull = paint(0x3a5a78, 0.3, 0.75), pale = paint(0xd8e2ec, 0.3, 0.5);
      K.add(lathe('maeldrum', [[0.5, -3.4], [2.6, -3.2], [3.6, -2.2], [3.9, -0.6], [3.7, 0.6], [3.0, 1.0], [2.4, 1.1]], 48), hull, 0, 0, 0, Math.PI / 2, 0, 0);
      K.add(tor(3.8, 0.22, 64, 10), M.frame, 0, 0, -0.6);
      K.add(tor(3.5, 0.14, 64, 8), M.chrome, 0, 0, 0.7);
      ring(K, 24, 3.75, (a, x, y) => K.add(rbox(0.22, 0.9, 1.9, 0.05), M.steel, x, y, -1.2, 0, 0, a));            // stator vanes
      ring(K, 12, 4.1, (a, x, y, i) => { K.add(rbox(0.9, 0.5, 1.2, 0.08), i % 2 ? pale : dark, x, y, -0.4, 0, 0, a); K.add(box(0.5, 0.06, 0.06), glow(0x5ad8ff, 4), x * 1.04, y * 1.04, 0.22, 0, 0, a + Math.PI / 2); });
      ring(K, 8, 4.3, (a, x, y) => { K.rod(M.copper, x * 0.75, y * 0.75, 0.4, x, y, -0.4, 0.09); K.add(sph(0.18, 10, 8), glow(0xff5a3a, 5), x * 1.02, y * 1.02, 0.3); });   // conduits + warning lamps
      // the iris: petals around the core mouth
      ring(K, 10, 2.5, (a, x, y) => K.add(rbox(1.1, 0.12, 1.6, 0.05), gun, x, y, 1.3, 0, 0, a + Math.PI / 2, 1, 1, 1));
      ring(K, 10, 2.15, (a, x, y) => K.add(box(0.06, 0.06, 0.6), glow(0x5ad8ff, 3.5), x, y, 1.9, 0, 0, a));
      K.mesh(sph(1.9, 32, 24), glow(0x5ad8ff, 1.7), 'core', 0, 0, 1.2);
      const spin = K.group('spin', K.root, 0, 0, 1.2);
      for (let i = 0; i < 3; i++) K.add(tor(2.35 + i * 0.22, 0.07, 64, 8), i === 1 ? M.brass : M.chrome, 0, 0, 0, i * 1.05, i * 0.6, 0, 1, 1, 1, spin);
      ring(K, 6, 2.4, (a, x, y) => K.add(cone(0.25, 1.4, 8), M.chrome, x, y, 0.5, Math.PI / 2, 0, 0, 1, 1, 1, spin));
      // thrusters behind
      ring(K, 6, 1.6, (a, x, y) => { K.add(cyl(0.5, 0.65, 1.0, 16), dark, x, y, -3.6, Math.PI / 2, 0, 0); K.add(cyl(0.42, 0.42, 0.05, 16), glow(0x9fe8ff, 4), x, y, -4.12, Math.PI / 2, 0, 0); });
    } else if (key === 'hydra') {
      // THE HYDRA: a bio-mechanical bulb from the deep. Ribbed shell plates, rows of photophores, a crown of
      // segmented stalks, a ring of teeth round the glowing maw.
      const shell = paint(0x2f8a7a, 0.3, 0.45), plate = paint(0x1b3a40, 0.36, 0.7), bone = paint(0xe6e0d0, 0.4, 0.2);
      K.add(lathe('hydrabody', [[0, -3.6], [2.4, -3.2], [3.7, -1.6], [3.9, 0.2], [3.4, 1.4], [2.4, 2.1], [1.6, 2.3]], 48), shell, 0, 0, 0, Math.PI / 2, 0, 0);
      ring(K, 14, 3.55, (a, x, y) => K.add(rbox(1.3, 0.22, 3.4, 0.1), plate, x, y, -0.8, 0, 0, a + Math.PI / 2));    // rib plates
      ring(K, 14, 3.62, (a, x, y) => K.add(box(0.06, 0.06, 3.0), glow(0x5affc8, 2.6), x * 1.04, y * 1.04, -0.8, 0, 0, a));   // light seams
      for (let row = 0; row < 3; row++) ring(K, 18, 3.2 - row * 0.35, (a, x, y) => K.add(sph(0.13, 8, 6), glow(row === 1 ? 0x7affd8 : 0x3fd8ff, 5), x * 1.12, y * 1.12, -2.2 + row * 1.2));   // photophores
      ring(K, 8, 3.6, (a, x, y) => { for (let j = 0; j < 4; j++) K.add(sph(0.36 - j * 0.06, 12, 8), j % 2 ? plate : shell, x * (1 + j * 0.12), y * (1 + j * 0.12), -2.6 - j * 0.45); K.add(cone(0.12, 0.6, 6), bone, x * 1.5, y * 1.5, -4.2, -Math.PI / 2, 0, 0); });   // crown stalks
      ring(K, 16, 1.75, (a, x, y) => K.add(cone(0.16, 0.7, 6), bone, x, y, 2.35, Math.PI / 2 - 0.5, 0, 0, 1, 1, 1));   // teeth
      K.add(tor(1.9, 0.2, 48, 10), plate, 0, 0, 2.2);
      K.mesh(sph(1.4, 28, 20), glow(0x5affc8, 1.9), 'core', 0, 0, 2.0);
      const spin = K.group('spin', K.root, 0, 0, 2.0);
      for (let i = 0; i < 2; i++) K.add(tor(1.55 + i * 0.25, 0.05, 48, 6), M.chrome, 0, 0, 0, i * 1.4 + 0.3, i * 0.7, 0, 1, 1, 1, spin);
    } else if (key === 'furnace') {
      // FURNACE WHEEL: a forge wheel. Copper rim with fire vents, eight heavy spokes, cooling fins, a grilled
      // hub with the furnace burning behind the bars.
      const iron = paint(0x3a3230, 0.5, 0.85), hot = paint(0x6a3a22, 0.4, 0.8);
      K.add(cyl(3.4, 3.8, 2.6, 48), dark, 0, 0, -0.9, Math.PI / 2, 0, 0);
      K.add(tor(4.0, 0.45, 64, 12), M.copper, 0, 0, 0.3);
      K.add(tor(3.3, 0.18, 64, 8), M.brass, 0, 0, 0.6);
      ring(K, 8, 2.3, (a, x, y) => { K.add(rbox(0.7, 3.4, 0.6, 0.12), iron, x * 0.62, y * 0.62, 0.4, 0, 0, a - Math.PI / 2); K.add(box(0.12, 3.0, 0.08), glow(0xff7a2a, 3), x * 0.62, y * 0.62, 0.74, 0, 0, a - Math.PI / 2); });   // spokes
      ring(K, 32, 3.95, (a, x, y) => K.add(rbox(0.12, 0.7, 1.8, 0.03), iron, x, y, -1.0, 0, 0, a));               // cooling fins
      ring(K, 16, 4.25, (a, x, y, i) => { if (i % 2) K.add(cyl(0.22, 0.3, 0.5, 10), hot, x, y, 0.2, 0, 0, a - Math.PI / 2); else K.add(sph(0.16, 8, 6), glow(0xffb03a, 6), x, y, 0.55); });   // vents
      K.mesh(cyl(1.7, 1.7, 0.4, 40), glow(0xff7a2a, 1.25), 'core', 0, 0, 0.8, Math.PI / 2, 0, 0);
      K.add(tor(1.85, 0.22, 48, 10), M.copper, 0, 0, 0.9);
      for (let i = -3; i <= 3; i++) K.add(cyl(0.08, 0.08, 3.4 * Math.sqrt(1 - (i / 4) ** 2), 8), iron, i * 0.45, 0, 1.15, 0, 0, 0);   // hub grille
      ring(K, 12, 1.9, (a, x, y) => K.add(cyl(0.07, 0.07, 0.14, 8), M.steel, x, y, 1.05, Math.PI / 2, 0, 0));     // rivets
      ring(K, 4, 2.9, (a, x, y) => { K.add(cyl(0.35, 0.45, 2.4, 14), iron, x, y, -2.6, Math.PI / 2, 0, 0); K.add(cyl(0.3, 0.3, 0.05, 14), glow(0xff9a3a, 4), x, y, -3.82, Math.PI / 2, 0, 0); });   // exhaust stacks
    } else if (key === 'prism') {
      // PRISM QUEEN: a crystal crown around a single eye. Spires radiate from a chrome filigree halo; the eye
      // sits in an iris ring that opens and shuts.
      const silver = paint(0xc8d2e0, 0.2, 0.9);
      K.mesh(new THREE.IcosahedronGeometry(2.6, 0), M.crystal, 'crystal', 0, 0, -0.4);
      ring(K, 10, 2.7, (a, x, y) => K.add(cone(0.55, 4.0, 6), M.crystal, x, y, -0.6, 0, 0, a - Math.PI / 2));     // great spires
      ring(K, 10, 2.4, (a, x, y) => K.add(cone(0.3, 2.4, 6), M.crystal, x * 1.2, y * 1.2, 0.4, 0.4, 0, a - Math.PI / 2 + Math.PI / 10));   // lesser spires
      K.add(tor(3.3, 0.1, 64, 8), silver, 0, 0, 0.6);
      K.add(tor(3.55, 0.05, 64, 6), glow(0xff8ae0, 3), 0, 0, 0.6);
      ring(K, 20, 3.3, (a, x, y) => K.add(sph(0.12, 8, 6), M.chrome, x, y, 0.6));
      ring(K, 6, 1.6, (a, x, y) => K.rod(silver, x, y, 1.6, x * 2, y * 2, 0.6, 0.06));                               // filigree struts
      K.add(tor(1.25, 0.18, 40, 10), M.chrome, 0, 0, 1.7);
      ring(K, 12, 1.45, (a, x, y) => K.add(rbox(0.36, 0.1, 0.5, 0.03), silver, x, y, 1.75, 0, 0, a + Math.PI / 2));   // iris blades
      K.mesh(sph(1.05, 28, 20), glow(0xff5ad0, 2.2), 'core', 0, 0, 1.8);
      const spin = K.group('spin', K.root, 0, 0, 0);
      ring(K, 7, 4.2, (a, x, y) => K.add(new THREE.OctahedronGeometry(0.45, 0), M.crystal, x, y, -0.2, a, a * 0.5, 0, 1, 1.8, 1, spin));   // orbiting shards
    } else {
      // SINGULARITY ENGINE: a black sphere in nested accretion rings, eight containment pylons with blazing
      // tips, a lattice frame and a violet core that the rings feed.
      const pylon = paint(0x2a2440, 0.3, 0.85), pale = paint(0xbcb4d8, 0.3, 0.7);
      K.add(sph(2.7, 40, 28), M.black, 0, 0, 0);
      K.add(tor(2.85, 0.12, 64, 8), M.chrome, 0, 0, 0);
      K.mesh(sph(1.5, 28, 20), glow(0xb08aff, 1.4), 'core', 0, 0, 1.75);
      K.add(tor(1.65, 0.16, 48, 10), pale, 0, 0, 1.8);
      ring(K, 8, 3.2, (a, x, y) => {
        K.add(rbox(0.45, 0.45, 3.2, 0.08), pylon, x, y, -0.6, 0, 0, a);
        K.add(cone(0.3, 0.9, 8), M.chrome, x * 1.08, y * 1.08, 1.4, Math.PI / 2, 0, 0);
        K.add(sph(0.22, 10, 8), glow(0xd8b8ff, 6), x * 1.08, y * 1.08, 1.95);
        K.add(box(0.06, 0.06, 2.6), glow(0xb08aff, 3), x * 1.07, y * 1.07, -0.6, 0, 0, a);
        K.rod(M.frame, x * 0.85, y * 0.85, -2.0, x * 1.3, y * 1.3, -2.6, 0.08);
      });
      ring(K, 16, 4.0, (a, x, y) => K.add(rbox(0.2, 0.2, 1.2, 0.04), M.frame, x, y, -1.4, 0, 0, a));                 // lattice
      K.add(tor(4.05, 0.1, 64, 8), M.frame, 0, 0, -0.8); K.add(tor(4.05, 0.1, 64, 8), M.frame, 0, 0, -2.0);
      const spin = K.group('spin', K.root);
      for (let i = 0; i < 4; i++) K.add(tor(3.4 + i * 0.3, 0.06 + i * 0.03, 72, 8), i % 2 ? M.chrome : pale, 0, 0, 0, i * 0.5, i * 0.3, 0, 1, 1, 1, spin);
      K.add(tor(3.55, 0.03, 72, 6), glow(0xb08aff, 3.5), 0, 0, 0, 0.25, 0.15, 0, 1, 1, 1, spin);
    }
    return K.build();
  });
  return { g, core: by(g, 'core'), spin: by(g, 'spin') };
}
// one armour segment (covers one lane at the boss's depth; the renderer bends it into place)
export function armourSeg(key) {
  const g = make('seg' + key, () => {
    const K = new Kit();
    const col = key === 'furnace' ? 0x5a3624 : key === 'singularity' ? 0x2e2648 : 0x34485a;
    const p = paint(col, 0.32, 0.85), lip = key === 'furnace' ? 0xff7a2a : key === 'singularity' ? 0xb08aff : 0x5ad8ff;
    // an armour slab standing on the lane: a bevelled plate with ribs, pistons, hazard bands and a glowing lip
    K.add(rbox(2.8, 2.2, 0.9, 0.14), p, 0, 1.1, 0);
    for (let i = 0; i < 3; i++) K.add(rbox(2.5, 0.16, 1.05, 0.05), M.frame, 0, 0.45 + i * 0.6, 0);
    for (const s of [-1, 1]) {
      K.add(cyl(0.13, 0.13, 2.0, 10), M.chrome, s * 1.3, 1.1, 0.3); K.add(rbox(0.3, 0.5, 0.5, 0.06), M.dark, s * 1.2, 0.25, -0.3);
      K.add(cyl(0.18, 0.18, 0.25, 10), M.steel, s * 1.3, 0.2, 0.3);
      K.add(rbox(0.5, 0.12, 0.06, 0.02), M.stripes, s * 0.85, 1.8, 0.47);
    }
    K.add(rbox(1.2, 0.5, 0.2, 0.06), M.dark, 0, 1.4, 0.5);
    for (let i = 0; i < 4; i++) K.add(cyl(0.05, 0.05, 0.06, 8), M.steel, -0.45 + i * 0.3, 1.4, 0.62, Math.PI / 2, 0, 0);
    for (let i = 0; i < 3; i++) K.add(box(0.5, 0.04, 0.04), M.black, 0, 0.8 + i * 0.12, 0.47);
    K.mesh(box(2.4, 0.08, 0.1), glow(lip, 4), 'edge', 0, 2.2, 0.42);
    K.add(box(0.08, 1.6, 0.06), glow(lip, 2.5), 0, 1.1, 0.48);
    return K.build();
  });
  return { g, edge: by(g, 'edge') };
}
// a hydra head on a segmented neck: faces -z like the enemies (the renderer turns it toward the rim)
export function hydraHead() {
  const g = make('hydrahead', () => {
    const K = new Kit();
    const shell = paint(0x3fc0a0, 0.28, 0.45), dark = paint(0x1d2a2e, 0.4, 0.8), bone = paint(0xe6e0d0, 0.4, 0.2);
    for (let i = 0; i < 5; i++) {
      K.add(sph(0.62 - i * 0.04, 18, 12), i % 2 ? dark : shell, 0, 0.8, 0.6 + i * 0.5, 0, 0, 0, 1, 0.9, 1.1);
      K.add(tor(0.6 - i * 0.04, 0.035, 20, 6), glow(0x5affc8, 2.5), 0, 0.8, 0.6 + i * 0.5, 0, 0, 0, 1, 0.9, 1);
    }
    const head = K.group('head', K.root, 0, 0.9, 0);
    K.add(lathe('hydrahd', [[0, -0.8], [0.6, -0.6], [0.75, 0], [0.55, 0.6], [0.2, 1.0], [0, 1.05]], 22), shell, 0, 0, 0, -Math.PI / 2, 0, 0, 1, 0.8, 1, head);
    K.add(rbox(0.9, 0.12, 0.9, 0.05), dark, 0, 0.5, 0.1, 0.15, 0, 0, 1, 1, 1, head);                           // crest plate
    for (const s of [-1, 1]) {
      K.add(cone(0.12, 0.9, 6), bone, s * 0.4, 0.55, 0.4, 0.7, 0, s * 0.4, 1, 1, 1, head);                     // horns sweep back
      K.mesh(sph(0.13, 12, 8), glow(0x7affd8, 7), 'eye' + (s < 0 ? 'L' : 'R'), s * 0.32, 0.22, -0.7, 0, 0, 0, head);
      K.add(sph(0.07, 8, 6), glow(0x7affd8, 6), s * 0.48, 0.12, -0.5, 0, 0, 0, 1, 1, 1, head);
      K.add(box(0.03, 0.03, 0.7), glow(0x5affc8, 3), s * 0.62, 0.1, 0, 0, 0, 0, 1, 1, 1, head);
    }
    const jaw = K.group('jaw', head, 0, -0.25, -0.2);
    K.add(rbox(0.8, 0.2, 0.9, 0.06), dark, 0, 0, -0.3, 0, 0, 0, 1, 1, 1, jaw);
    for (let i = 0; i < 4; i++) K.add(cone(0.05, 0.22, 4), bone, -0.25 + i * 0.17, 0.14, -0.65, 0, 0, 0, 1, 1, 1, jaw);
    for (let i = 0; i < 4; i++) K.add(cone(0.05, 0.2, 4), bone, -0.25 + i * 0.17, 0.32, -0.85, Math.PI, 0, 0, 1, 1, 1, head);
    K.mesh(sph(0.3, 14, 10), glow(0x7dffd8, 3.5), 'maw', 0, -0.05, -0.75, 0, 0, 0, head);
    return K.build();
  });
  return { g, head: by(g, 'head'), jaw: by(g, 'jaw'), maw: by(g, 'maw') };
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
export function crystalCluster() {
  return geo('crystalcl', () => {
    const list = [];
    const prism = (r, h) => { const g = new THREE.CylinderGeometry(r, r, h, 6, 1); const tip = new THREE.ConeGeometry(r, r * 2.2, 6); tip.translate(0, h / 2 + r * 1.1, 0); const m = merge([[g, new THREE.Matrix4(), null], [tip, new THREE.Matrix4(), null]], false); g.dispose(); tip.dispose(); m.translate(0, h / 2, 0); return m; };
    const parts = [[0.42, 2.4, 0, 0, 0], [0.28, 1.6, 0.5, 0.4, 0.35], [0.3, 1.4, -0.45, -0.5, -0.2], [0.2, 1.0, 0.1, 0.9, -0.45], [0.22, 1.1, -0.3, 0.6, 0.5]];
    for (const [r, h, ax, az, tw] of parts) { const g = prism(r, h); list.push([g, new THREE.Matrix4().compose(new THREE.Vector3(ax * 0.5, 0, az * 0.5), new THREE.Quaternion().setFromEuler(new THREE.Euler(ax * 0.6, tw, az * 0.6)), new THREE.Vector3(1, 1, 1))]); }
    const g = merge(list.map(([q, m]) => [q, m, null]), false);
    for (const [q] of list) q.dispose();
    g.computeVertexNormals();
    return g;
  });
}
export function crystalGeometry() {
  return geo('crystal', () => { const g = new THREE.CylinderGeometry(0.0, 0.5, 2.4, 6, 1); g.translate(0, 1.2, 0); return g; });
}
// a smooth weathered boulder (indexed sphere pushed around by a few octaves of position noise)
export function boulderGeometry(seed) {
  const k = 'boulder' + (seed % 5);
  return geo(k, () => {
    const sd = (seed % 5) * 1.7 + 0.3;
    const g = new THREE.SphereGeometry(1, 28, 18);
    const p = g.attributes.position;
    const sx = 0.8 + ((sd * 7.1) % 1) * 0.5, sy = 0.6 + ((sd * 3.3) % 1) * 0.5, sz = 0.8 + ((sd * 5.7) % 1) * 0.5;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = Math.sin(x * 2.1 + sd) * Math.sin(y * 2.4 + sd * 2) * Math.sin(z * 1.9 + sd * 3) * 0.22
        + Math.sin(x * 5.3 + sd * 4) * Math.sin(y * 4.7) * Math.sin(z * 5.9 + sd) * 0.08
        + Math.sin(x * 11.0 + sd) * Math.sin(y * 13.0 + sd) * Math.sin(z * 12.0) * 0.03;
      const r = 1 + n - Math.max(0, y * 0.15);
      p.setXYZ(i, x * r * sx, y * r * sy, z * r * sz);
    }
    g.computeVertexNormals();
    return g;
  });
}
// a deep-sea jelly: a thin bell and eight trailing, wavy tentacles in one geometry (drawn glowing)
export function jellyGeometry() {
  return geo('jelly', () => {
    const I = new THREE.Matrix4();
    const bell = new THREE.LatheGeometry([[0.0, 0.55], [0.3, 0.52], [0.55, 0.4], [0.72, 0.2], [0.8, 0.0], [0.76, -0.08], [0.6, -0.04]].map(([r, y]) => new THREE.Vector2(r, y)), 24);
    const inner = new THREE.SphereGeometry(0.3, 12, 8);
    inner.translate(0, 0.18, 0);
    const list = [[bell, I], [inner, I]];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, rr = 0.55 + (i % 2) * 0.15, L = 1.6 + (i % 3) * 0.5;
      const t = new THREE.CylinderGeometry(0.025, 0.006, L, 4, 10, true);
      t.translate(0, -L / 2, 0);
      const p = t.attributes.position;
      for (let j = 0; j < p.count; j++) { const y = p.getY(j); p.setX(j, p.getX(j) + Math.sin(-y * 3 + i) * 0.12 * (-y / L)); p.setZ(j, p.getZ(j) + Math.cos(-y * 2.4 + i) * 0.1 * (-y / L)); }
      list.push([t, new THREE.Matrix4().makeTranslation(Math.cos(a) * rr, -0.05, Math.sin(a) * rr)]);
    }
    const g = merge(list.map(([q, m]) => [q, m, null]), false);
    for (const [q] of list) q.dispose();
    return g;
  });
}
export const GEO = { box, cyl, sph, cap, tor, rbox, cone, ico };
