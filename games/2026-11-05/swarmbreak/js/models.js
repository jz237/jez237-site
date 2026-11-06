// 3D models with physically based materials: the Warden exo-suit, every machine, survivors, the five
// bosses and scenery pieces. Each model is built once from many detailed parts (bevelled armour plates,
// turned parts, hydraulic struts, bolts, cables, lamps), every static part is merged into one mesh per
// material per moving joint, and later copies are cheap clones that share geometry. A panel normal map
// adds seams, rivets and scratches to painted metal.
// Every model faces +x; the renderer turns it with rotation.y = -angle. Named parts (legs, torso, eye,
// core...) are animated by the renderer.
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
const STATIC_PARTS = new Set(['chestlight', 'reactor', 'reactorcore', 'antennatip', 'visor', 'helmlamp', 'coil', 'sensor', 'beacon', 'nose', 'bull', 'tail', 'head', 'ceye', 'atip']);
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

// ------------------------------------------------------------------ the Warden
// a leg as hip -> thigh -> knee -> shin -> foot; the renderer swings hip.rotation.z and bends knee.rotation.z
function wardenLeg(K, parent, side, body, trim) {
  const z = side * 0.17;
  const hip = K.group('hip' + (side < 0 ? 'L' : 'R'), parent, 0, 0.94, z);
  K.add(sph(0.11, 14, 10), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
  K.add(rbox(0.22, 0.42, 0.21, 0.05), body, 0.02, -0.24, 0, 0, 0, 0, 1, 1, 1, hip);           // thigh armour
  K.add(rbox(0.06, 0.3, 0.16, 0.02), trim, 0.13, -0.22, 0, 0, 0, 0.05, 1, 1, 1, hip);        // front plate
  K.rod(M.chrome, -0.1, -0.08, 0, -0.1, -0.38, 0, 0.022, hip);                               // thigh piston
  K.rod(M.frame, -0.1, -0.02, 0, -0.1, -0.2, 0, 0.036, hip);
  K.add(cyl(0.03, 0.03, 0.24, 8), M.frame, 0, -0.24, side * -0.11, Math.PI / 2, 0, 0, 1, 1, 1, hip);
  const knee = K.group('knee' + (side < 0 ? 'L' : 'R'), hip, 0, -0.46, 0);
  K.add(sph(0.085, 14, 10), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, knee);
  K.add(rbox(0.1, 0.14, 0.17, 0.04), trim, 0.08, 0.01, 0, 0, 0, -0.2, 1, 1, 1, knee);        // knee cap
  K.add(rbox(0.19, 0.4, 0.18, 0.05), body, 0, -0.23, 0, 0, 0, 0, 1, 1, 1, knee);             // shin
  K.add(rbox(0.05, 0.28, 0.12, 0.02), M.dark, 0.1, -0.24, 0, 0, 0, 0, 1, 1, 1, knee);
  K.rod(M.chrome, -0.09, -0.05, 0, -0.09, -0.36, 0, 0.018, knee);
  K.add(cyl(0.07, 0.08, 0.06, 12), M.frame, 0, -0.45, 0, 0, 0, 0, 1, 1, 1, knee);             // ankle
  K.add(rbox(0.36, 0.08, 0.17, 0.03), M.black, 0.06, -0.5, 0, 0, 0, 0, 1, 1, 1, knee);        // sole
  K.add(rbox(0.22, 0.08, 0.16, 0.035), body, 0.08, -0.44, 0, 0, 0, -0.15, 1, 1, 1, knee);     // toe cap
  K.add(rbox(0.08, 0.07, 0.15, 0.02), M.dark, -0.1, -0.46, 0, 0, 0, 0, 1, 1, 1, knee);        // heel
}
export function warden(color = 0x2f8cff, accent = 0x9fe8ff) {
  const g = make('warden' + color, () => {
    const K = new Kit();
    const body = paint(color, 0.32, 0.5), trim = paint(0xd8dde4, 0.3, 0.6), gunmetal = paint(0x30343b, 0.35, 0.8);
    const lower = K.group('lower');
    // pelvis + belt
    K.add(rbox(0.34, 0.2, 0.46, 0.05), M.dark, 0, 1.0, 0, 0, 0, 0, 1, 1, 1, lower);
    K.add(rbox(0.38, 0.06, 0.5, 0.02), M.frame, 0, 1.1, 0, 0, 0, 0, 1, 1, 1, lower);
    K.add(rbox(0.1, 0.16, 0.2, 0.03), body, 0.18, 0.98, 0, 0, 0, 0.1, 1, 1, 1, lower);
    for (const s of [-1, 1]) { K.add(rbox(0.1, 0.1, 0.08, 0.02), cloth(0x3a3a30), 0.02, 1.06, s * 0.27, 0, 0, 0, 1, 1, 1, lower); K.add(rbox(0.07, 0.16, 0.1, 0.02), body, 0, 0.95, s * 0.25, s * 0.15, 0, 0, 1, 1, 1, lower); }
    wardenLeg(K, lower, -1, body, trim); wardenLeg(K, lower, 1, body, trim);
    const upper = K.group('upper');
    // abdomen slats and chest
    for (let i = 0; i < 3; i++) K.add(rbox(0.3 - i * 0.02, 0.07, 0.44, 0.025), M.frame, 0.03, 1.17 + i * 0.075, 0, 0, 0, 0, 1, 1, 1, upper);
    K.add(rbox(0.46, 0.4, 0.68, 0.08), body, 0.02, 1.46, 0, 0, 0, 0, 1, 1, 1, upper);
    for (const s of [-1, 1]) K.add(rbox(0.12, 0.26, 0.28, 0.05), trim, 0.21, 1.48, s * 0.15, 0, s * 0.12, 0.08, 1, 1, 1, upper);   // pec plates
    K.mesh(rbox(0.04, 0.05, 0.22, 0.015), glow(accent, 4), 'chestlight', 0.27, 1.34, 0, 0, 0, 0, upper);
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) K.add(box(0.12, 0.018, 0.04), M.black, 0.05, 1.36 + i * 0.04, s * 0.345, 0, 0, 0, 1, 1, 1, upper);          // side vents
    K.add(tor(0.15, 0.035, 20, 8), M.frame, 0.04, 1.68, 0, Math.PI / 2, 0, 0, 1, 1, 1, upper);                                                             // collar
    // backpack: reactor, twin canisters, antenna
    K.add(rbox(0.3, 0.5, 0.54, 0.06), M.dark, -0.34, 1.42, 0, 0, 0, 0, 1, 1, 1, upper);
    for (const s of [-1, 1]) { K.add(cap(0.075, 0.32, 12), gunmetal, -0.44, 1.42, s * 0.2, 0, 0, 0, 1, 1, 1, upper); K.add(tor(0.078, 0.012, 16, 6), M.chrome, -0.44, 1.56, s * 0.2, Math.PI / 2, 0, 0, 1, 1, 1, upper); K.add(tor(0.078, 0.012, 16, 6), M.chrome, -0.44, 1.3, s * 0.2, Math.PI / 2, 0, 0, 1, 1, 1, upper); }
    K.add(cyl(0.13, 0.13, 0.06, 20), M.frame, -0.5, 1.45, 0, 0, 0, Math.PI / 2, 1, 1, 1, upper);
    K.mesh(tor(0.1, 0.025, 24, 8), glow(accent, 3.5), 'reactor', -0.535, 1.45, 0, 0, Math.PI / 2, 0, upper);
    K.mesh(sph(0.05, 12, 8), glow(accent, 5), 'reactorcore', -0.54, 1.45, 0, 0, 0, 0, upper);
    K.rod(M.steel, -0.42, 1.66, -0.2, -0.46, 2.05, -0.22, 0.008, upper);
    K.mesh(sph(0.018, 8, 6), glow(0xff4a3a, 5), 'antennatip', -0.46, 2.06, -0.22, 0, 0, 0, upper);
    // pauldrons
    for (const s of [-1, 1]) {
      K.add(sph(0.2, 18, 12), body, 0, 1.66, s * 0.44, 0, 0, 0, 1.15, 0.75, 1, upper);
      K.add(tor(0.19, 0.022, 24, 6), trim, 0, 1.63, s * 0.44, Math.PI / 2, 0, 0, 1.15, 1, 1, upper);
      K.add(rbox(0.3, 0.05, 0.05, 0.015), M.stripes, 0, 1.75, s * 0.5, 0, 0, 0, 1, 1, 1, upper);
    }
    // helmet: a turned dome, curved visor, cheek plates, crest
    const head = K.group('head', upper, 0.05, 1.8, 0);
    K.add(lathe('helm', [[0, -0.15], [0.13, -0.14], [0.17, -0.06], [0.18, 0.03], [0.15, 0.12], [0.08, 0.18], [0, 0.19]], 24), M.dark, 0, 0, 0, 0, 0, 0, 1, 1, 1.05, head);
    K.add(sph(0.155, 24, 12, ), M.glass, 0.04, 0.02, 0, 0, 0, 0, 0.85, 0.55, 1, head);
    K.mesh(rbox(0.04, 0.045, 0.24, 0.015), glow(accent, 4.5), 'visor', 0.16, 0.02, 0, 0, 0, 0, head);
    for (const s of [-1, 1]) K.add(rbox(0.16, 0.12, 0.04, 0.015), body, 0.05, -0.06, s * 0.17, 0, s * 0.2, 0, 1, 1, 1, head);
    K.add(rbox(0.26, 0.05, 0.035, 0.012), trim, -0.02, 0.18, 0, 0, 0, -0.15, 1, 1, 1, head);
    K.mesh(cyl(0.02, 0.025, 0.04, 8), glow(0xfff2d0, 6), 'helmlamp', 0.12, 0.1, -0.12, 0, 0, Math.PI / 2, head);
    // arms: right arm holds the blaster, left braces it
    for (const s of [-1, 1]) {
      K.add(sph(0.08, 12, 10), M.frame, 0.06, 1.55, s * 0.4, 0, 0, 0, 1, 1, 1, upper);
      K.add(cap(0.065, 0.2, 10), body, 0.14, 1.45, s * 0.42, 0, 0, -0.9, 1, 1, 1, upper);
      K.add(sph(0.06, 10, 8), M.frame, 0.25, 1.36, s * 0.4, 0, 0, 0, 1, 1, 1, upper);
      K.add(rbox(0.24, 0.1, 0.11, 0.03), trim, 0.36, 1.33, s * 0.36, 0, s * -0.2, -0.1, 1, 1, 1, upper);
      K.add(rbox(0.08, 0.08, 0.09, 0.025), M.black, 0.5, 1.31, s * 0.33, 0, 0, 0, 1, 1, 1, upper);
    }
    const gun = K.group('gun', upper, 0.42, 1.3, 0.3);
    K.add(rbox(0.42, 0.14, 0.12, 0.03), gunmetal, 0.18, 0, 0, 0, 0, 0, 1, 1, 1, gun);                    // receiver
    K.add(rbox(0.16, 0.12, 0.08, 0.02), M.dark, -0.06, -0.02, 0, 0, 0, -0.1, 1, 1, 1, gun);              // stock
    K.add(rbox(0.07, 0.16, 0.06, 0.015), M.black, 0.12, -0.12, 0, 0, 0, 0.25, 1, 1, 1, gun);             // magazine
    K.add(cyl(0.035, 0.035, 0.5, 12), M.black, 0.6, 0.015, 0, 0, 0, Math.PI / 2, 1, 1, 1, gun);          // barrel
    for (let i = 0; i < 4; i++) K.add(tor(0.045, 0.011, 14, 6), M.chrome, 0.42 + i * 0.09, 0.015, 0, 0, Math.PI / 2, 0, 1, 1, 1, gun);
    for (let i = 0; i < 3; i++) K.mesh(tor(0.04, 0.008, 14, 6), glow(accent, 3), 'coil' + i, 0.46 + i * 0.09, 0.015, 0, 0, Math.PI / 2, 0, gun);
    K.add(cyl(0.028, 0.028, 0.16, 10), M.dark, 0.2, 0.11, 0, 0, 0, Math.PI / 2, 1, 1, 1, gun);           // scope
    K.add(cyl(0.024, 0.024, 0.01, 10), M.glass, 0.285, 0.11, 0, 0, 0, Math.PI / 2, 1, 1, 1, gun);
    K.mesh(cyl(0.045, 0.045, 0.03, 12), glow(accent, 5), 'muzzle', 0.87, 0.015, 0, 0, 0, Math.PI / 2, gun);
    for (const s of [-1, 1]) {
      K.add(rbox(0.05, 0.05, 0.08, 0.015), M.frame, 0.2, 1.7, s * 0.48, 0, 0, 0, 1, 1, 1, upper);
      K.add(box(0.012, 0.03, 0.06), glow(0xfff0d0, 5), 0.226, 1.7, s * 0.48, 0, 0, 0, 1, 1, 1, upper);          // shoulder lamps
      K.add(rbox(0.16, 0.2, 0.04, 0.015), body, -0.02, 1.0, s * 0.27, 0, 0, s * 0.05, 1, 1, 1, lower);              // hip flaps
      K.add(rbox(0.09, 0.12, 0.06, 0.02), cloth(0x2e3326), -0.14, 1.02, s * 0.2, 0, 0, 0, 1, 1, 1, lower);          // pouches
      K.rod(M.rubber, -0.42, 1.36, s * 0.2, 0.12, 1.33, s * 0.4, 0.016, upper, 6);                                     // power cables
    }
    K.add(rbox(0.12, 0.04, 0.1, 0.012), M.frame, 0.36, 1.38, -0.37, 0, 0, 0, 1, 1, 1, upper);
    K.add(box(0.1, 0.008, 0.07), glow(accent, 2.5), 0.36, 1.405, -0.37, 0, 0, 0, 1, 1, 1, upper);                   // forearm display
    K.add(cone(0.05, 0.09, 3), glow(accent, 3.5), 0.285, 1.56, 0, 0, Math.PI / 2, -Math.PI / 2, 1, 1, 0.4, upper);   // chest emblem
    K.add(rbox(0.06, 0.05, 0.12, 0.012), M.chrome, 0.19, 1.1, 0, 0, 0, 0, 1, 1, 1, lower);
    K.add(box(0.008, 0.02, 0.07), glow(accent, 3), 0.222, 1.1, 0, 0, 0, 0, 1, 1, 1, lower);                          // belt light
    for (let i = 0; i < 4; i++) K.add(box(0.02, 0.06, 0.4), M.frame, -0.19, 1.24 + i * 0.07, 0, 0, 0, 0, 1, 1, 1, upper);  // backpack fins
    return K.build();
  });
  return { g, lower: by(g, 'lower'), upper: by(g, 'upper'), L: { hip: by(g, 'hipL'), knee: by(g, 'kneeL') }, R: { hip: by(g, 'hipR'), knee: by(g, 'kneeR') }, head: by(g, 'head'), gun: by(g, 'gun'), muzzle: by(g, 'muzzle') };
}

// ------------------------------------------------------------------ machines
export function crawler() {
  const g = make('crawler', () => {
    const K = new Kit();
    K.noShadow = 'leg';   // thin legs: their shadows are not worth the extra pass
    const shell = paint(0x8a3324, 0.4, 0.6), plate = paint(0x5a2218, 0.45, 0.6);
    const body = K.group('body', K.root, 0, 0.42, 0);
    K.add(lathe('crawl', [[0, -0.18], [0.24, -0.16], [0.34, -0.06], [0.36, 0.04], [0.3, 0.13], [0.16, 0.19], [0, 0.2]], 20), shell, 0, 0, 0, 0, 0, 0, 1.25, 1, 1.05, body);
    for (let i = 0; i < 3; i++) K.add(rbox(0.16, 0.05, 0.44 - i * 0.06, 0.02), plate, -0.2 + i * 0.12, 0.2 - i * 0.012, 0, 0, 0, 0.12, 1, 1, 1, body);   // back plates
    K.add(rbox(0.22, 0.14, 0.26, 0.04), M.dark, 0.36, 0.0, 0, 0, 0, 0, 1, 1, 1, body);                  // head
    for (const s of [-1, 1]) {
      K.add(cone(0.03, 0.18, 6), M.steel, 0.5, -0.06, s * 0.08, 0, 0, -Math.PI / 2 - 0.4, 1, 1, 1, body); // mandibles
      K.add(cyl(0.012, 0.012, 0.3, 6), M.black, 0.0, 0.0, s * 0.2, 0, 0, 1.2, 1, 1, 1, body);            // cables
    }
    K.mesh(sph(0.07, 12, 10), glow(0xff3a2a, 6), 'ceye', 0.47, 0.04, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) K.add(sph(0.04, 8, 6), glow(0xff3a2a, 4), 0.46, 0.08, s * 0.08, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.008, 0.008, 0.25, 4), M.steel, 0.2, 0.3, -0.1, 0.3, 0, -0.3, 1, 1, 1, body);
    K.add(sph(0.08, 14, 10), M.glass, 0.1, 0.2, 0, 0, 0, 0, 1, 0.6, 1, body);
    K.add(tor(0.08, 0.012, 16, 6), M.frame, 0.1, 0.2, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.006, 0.006, 0.22, 4), M.steel, 0.15, 0.28, 0.1, -0.3, 0, -0.3, 1, 1, 1, body);
    K.add(sph(0.015, 6, 4), glow(0xff3a2a, 5), 0.2, 0.38, 0.13, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; K.add(rbox(0.12, 0.07, 0.04, 0.012), M.dark, Math.cos(a) * 0.43, -0.07, Math.sin(a) * 0.36, 0, -a + Math.PI / 2, 0, 1, 1, 1, body); }
    K.add(tor(0.22, 0.02, 24, 6), glow(0xff5a2a, 2.2), 0, -0.17, 0, Math.PI / 2, 0, 0, 1.2, 1, 1, body);
    bolts(K, M.steel, [[-0.2, 0.235, 0.15, 0, 0, 0], [-0.2, 0.235, -0.15, 0, 0, 0], [0.0, 0.225, 0.17, 0, 0, 0], [0.0, 0.225, -0.17, 0, 0, 0]], 0.018, body);
    // four legs: coxa joint, femur rising, tibia down to a claw
    [[0.22, 0.3], [-0.22, 0.3], [0.22, -0.3], [-0.22, -0.3]].forEach(([x, z], i) => {
      const s = Math.sign(z);
      const hip = K.group('leg' + i, K.root, x, 0.42, z);
      K.add(sph(0.06, 10, 8), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.dark, 0, 0, 0, 0, 0.2, s * 0.32, 0.035, hip);
      K.add(sph(0.045, 8, 6), M.frame, 0, 0.2, s * 0.32, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.chrome, 0, 0.1, s * 0.12, 0, 0.18, s * 0.28, 0.012, hip);
      K.rod(M.steel, 0, 0.2, s * 0.32, 0, -0.4, s * 0.44, 0.028, hip);
      K.add(cone(0.035, 0.1, 6), M.black, 0, -0.44, s * 0.45, Math.PI, 0, 0, 1, 1, 1, hip);
    });
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), legs: all(g, 'leg').map((hip) => ({ hip })) };
}
export function brute() {
  const g = make('brute', () => {
    const K = new Kit();
    const yel = paint(0xd89a1c, 0.45, 0.4), deep = paint(0x8a5f12, 0.5, 0.4);
    const body = K.group('body');
    for (const s of [-1, 1]) {
      // tracks: drive sprocket, road wheels, return rollers, linked tread
      K.add(rbox(1.95, 0.52, 0.4, 0.2), M.rubber, 0, 0.28, s * 0.72, 0, 0, 0, 1, 1, 1, body);
      for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; K.add(box(0.08, 0.04, 0.42), M.black, Math.cos(a) * 0.95, 0.28 + Math.sin(a) * 0.26, s * 0.72, 0, 0, a, 1, 1, 1, body); }
      for (let i = 0; i < 4; i++) { K.add(cyl(0.18, 0.18, 0.44, 16), M.dark, -0.6 + i * 0.4, 0.24, s * 0.72, Math.PI / 2, 0, 0, 1, 1, 1, body); K.add(cyl(0.08, 0.08, 0.46, 8), M.steel, -0.6 + i * 0.4, 0.24, s * 0.72, Math.PI / 2, 0, 0, 1, 1, 1, body); }
      K.add(cyl(0.22, 0.22, 0.44, 12), M.frame, 0.86, 0.3, s * 0.72, Math.PI / 2, 0, 0, 1, 1, 1, body);
      K.add(rbox(1.7, 0.08, 0.46, 0.02), deep, 0, 0.56, s * 0.72, 0, 0, 0, 1, 1, 1, body);     // track guard
    }
    K.add(rbox(1.7, 0.55, 1.08, 0.08), yel, 0, 0.82, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(1.72, 0.12, 1.1, 0.02), M.stripes, 0, 0.56, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.5, 0.2, 0.9, 0.04), M.dark, -0.62, 1.16, 0, 0, 0, 0, 1, 1, 1, body);           // engine deck
    for (let i = 0; i < 5; i++) K.add(box(0.36, 0.02, 0.04), M.black, -0.62, 1.27, -0.3 + i * 0.15, 0, 0, 0, 1, 1, 1, body);   // grille
    for (const s of [-1, 1]) { K.add(cyl(0.06, 0.07, 0.5, 10), M.frame, -0.8, 1.45, s * 0.36, 0, 0, 0, 1, 1, 1, body); K.add(cyl(0.075, 0.075, 0.04, 10), M.black, -0.8, 1.71, s * 0.36, 0, 0, 0, 1, 1, 1, body); }
    // cab with roll cage
    K.add(rbox(0.72, 0.6, 0.86, 0.06), yel, -0.05, 1.38, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.5, 0.38, 0.88, 0.04), M.glass, 0.12, 1.42, 0, 0, 0, 0, 1, 1, 1, body);
    for (const [x, z] of [[0.3, 0.43], [0.3, -0.43], [-0.4, 0.43], [-0.4, -0.43]]) K.rod(M.frame, x, 1.1, z, x, 1.74, z, 0.03, body);
    K.add(rbox(0.8, 0.05, 0.92, 0.02), M.frame, -0.05, 1.74, 0, 0, 0, 0, 1, 1, 1, body);
    K.mesh(cyl(0.08, 0.08, 0.12, 12), glow(0xff8a1a, 6), 'lamp', -0.3, 1.83, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) K.mesh(cyl(0.06, 0.06, 0.04, 12), glow(0xfff0c0, 5), 'head' + s, 0.86, 0.95, s * 0.4, 0, 0, Math.PI / 2, body);
    // the scoop on hydraulic arms
    const arm = K.group('arm', body, 0.55, 0.92, 0);
    for (const s of [-1, 1]) {
      K.add(rbox(0.9, 0.14, 0.12, 0.03), M.dark, 0.36, -0.12, s * 0.42, 0, 0, -0.5, 1, 1, 1, arm);
      K.rod(M.frame, -0.1, 0.2, s * 0.3, 0.5, -0.2, s * 0.3, 0.05, arm);
      K.rod(M.chrome, 0.3, -0.07, s * 0.3, 0.6, -0.27, s * 0.3, 0.025, arm);
    }
    const scoop = K.group('scoop', arm, 0.8, -0.5, 0);
    K.add(rbox(0.25, 0.62, 1.5, 0.05), M.dark, 0, 0, 0, 0, 0, 0, 1, 1, 1, scoop);
    K.add(rbox(0.5, 0.06, 1.5, 0.02), M.dark, 0.18, -0.3, 0, 0, 0, 0, 1, 1, 1, scoop);
    for (let i = 0; i < 7; i++) K.add(cone(0.05, 0.16, 6), M.steel, 0.45, -0.3, -0.63 + i * 0.21, 0, 0, -Math.PI / 2, 1, 1, 1, scoop);
    for (const s of [-1, 1]) K.add(rbox(0.5, 0.6, 0.05, 0.02), M.dark, 0.18, 0, s * 0.74, 0, 0, 0, 1, 1, 1, scoop);
    K.mesh(box(0.06, 0.08, 0.6), glow(0xff3a2a, 5), 'ceye', 0.86, 0.85, 0, 0, 0, 0, body);
    bolts(K, M.steel, [[0.86, 0.7, 0.3], [0.86, 0.7, -0.3], [0.86, 1.0, 0.3], [0.86, 1.0, -0.3]], 0.025, body);
    for (const s of [-1, 1]) {
      K.rod(M.rubber, 0.3, 1.0, s * 0.4, 0.75, 0.75, s * 0.42, 0.022, body, 6);
      K.rod(M.frame, 0.3, 1.55, s * 0.45, 0.42, 1.62, s * 0.62, 0.012, body, 4);
      K.add(rbox(0.04, 0.12, 0.08, 0.01), M.chrome, 0.42, 1.62, s * 0.64, 0, 0, 0, 1, 1, 1, body);                    // mirrors
      K.add(cyl(0.05, 0.05, 0.03, 10), glow(0xff5a1a, 2.5), -0.8, 1.73, s * 0.36, 0, 0, 0, 1, 1, 1, body);            // exhaust heat
      for (let i = 0; i < 4; i++) K.add(box(0.22, 0.02, 0.03), M.frame, -0.45, 0.7 + i * 0.15, s * 0.56, 0, 0, 0, 1, 1, 1, body);   // ladder
    }
    bolts(K, M.steel, Array.from({ length: 8 }, (_, i) => [-0.75 + i * 0.21, 0.98, 0.55, Math.PI / 2, 0, 0]), 0.02, body);
    bolts(K, M.steel, Array.from({ length: 8 }, (_, i) => [-0.75 + i * 0.21, 0.98, -0.55, Math.PI / 2, 0, 0]), 0.02, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), arm: by(g, 'arm'), scoop: by(g, 'scoop'), lamp: by(g, 'lamp'), eye: by(g, 'eye') };
}
export function spitter() {
  const g = make('spitter', () => {
    const K = new Kit();
    K.noShadow = 'leg';
    const shell = paint(0x3b3550, 0.34, 0.7), trim = paint(0xb8b0c8, 0.3, 0.6);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.5;
      const hip = K.group('leg' + i, K.root, 0, 1.0, 0); hip.rotation.y = a;
      K.add(sph(0.06, 10, 8), M.frame, 0.1, -0.05, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.dark, 0.1, -0.05, 0, 0.5, -0.35, 0, 0.04, hip);
      K.add(sph(0.05, 10, 8), M.frame, 0.5, -0.35, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.chrome, 0.2, -0.05, 0.05, 0.45, -0.3, 0.05, 0.012, hip);
      K.rod(M.steel, 0.5, -0.35, 0, 0.62, -0.98, 0, 0.032, hip);
      K.add(cyl(0.09, 0.11, 0.04, 10), M.black, 0.62, -0.98, 0, 0, 0, 0, 1, 1, 1, hip);
    }
    const head = K.group('head', K.root, 0, 1.15, 0);
    K.add(lathe('spit', [[0, -0.26], [0.2, -0.24], [0.33, -0.1], [0.35, 0.03], [0.28, 0.17], [0.12, 0.25], [0, 0.26]], 22), shell, 0, 0, 0, 0, 0, 0, 1.1, 0.85, 1, head);
    K.add(tor(0.355, 0.03, 30, 6), trim, 0, 0.01, 0, Math.PI / 2, 0, 0, 1.1, 1, 1, head);
    K.add(rbox(0.46, 0.08, 0.5, 0.03), M.dark, -0.06, 0.22, 0, 0, 0, 0, 1, 1, 1, head);
    for (const s of [-1, 1]) K.add(rbox(0.2, 0.14, 0.06, 0.02), M.dark, -0.18, 0.05, s * 0.36, 0, 0, 0, 1, 1, 1, head);      // vents
    // barrel: glass charging sleeve, cooling fins, muzzle
    K.add(cyl(0.085, 0.1, 0.25, 14), M.frame, 0.4, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, head);
    K.add(cyl(0.07, 0.07, 0.24, 14), M.glassT, 0.6, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, head);
    for (let i = 0; i < 4; i++) K.add(tor(0.075, 0.014, 14, 6), M.chrome, 0.5 + i * 0.07, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, head);
    K.add(cyl(0.06, 0.05, 0.18, 12), M.black, 0.8, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, head);
    K.mesh(sph(0.12, 14, 10), glow(0xff3df0, 5), 'core', 0.6, 0, 0, 0, 0, 0, head);
    K.mesh(sph(0.06, 10, 8), glow(0xff3df0, 6), 'tip', 0.9, 0, 0, 0, 0, 0, head);
    K.mesh(sph(0.045, 10, 8), glow(0xff3a2a, 5), 'sensor', 0.3, 0.14, 0.16, 0, 0, 0, head);
    K.rod(M.steel, -0.2, 0.25, -0.12, -0.25, 0.55, -0.15, 0.008, head);
    for (const s of [-1, 1]) {
      K.add(cyl(0.12, 0.12, 0.16, 18), paint(0x55506a, 0.35, 0.7), -0.12, -0.04, s * 0.42, Math.PI / 2, 0, 0, 1, 1, 1, head);
      for (let i = 0; i < 3; i++) K.add(tor(0.122, 0.01, 18, 4), M.frame, -0.12, -0.04, s * (0.36 + i * 0.06), 0, 0, 0, 1, 1, 1, head);
      K.rod(M.rubber, -0.06, -0.04, s * 0.34, 0.4, -0.06, s * 0.1, 0.022, head, 6);
      for (let i = 0; i < 3; i++) K.add(rbox(0.16, 0.06, 0.12, 0.02), shell, 0.12 - i * 0.14, 0.18, s * 0.24, s * 0.35, 0, 0, 1, 1, 1, head);
    }
    K.add(cyl(0.16, 0.2, 0.14, 18), M.frame, 0, -0.25, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(tor(0.18, 0.015, 20, 4), glow(0xff3df0, 2.5), 0, -0.2, 0, Math.PI / 2, 0, 0, 1, 1, 1, head);
    return K.build();
  });
  return { g, head: by(g, 'head'), core: by(g, 'core'), tip: by(g, 'tip'), legs: all(g, 'leg') };
}
export function hive() {
  const g = make('hive', () => {
    const K = new Kit();
    const shell = paint(0x2c2436, 0.3, 0.5), rib = paint(0x463a55, 0.35, 0.6);
    const body = K.group('body', K.root, 0, 1.0, 0);
    K.add(lathe('hive', [[0, -0.92], [0.42, -0.86], [0.72, -0.6], [0.84, -0.2], [0.82, 0.25], [0.66, 0.62], [0.36, 0.86], [0.16, 0.94], [0, 0.96]], 28), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; K.add(rbox(0.08, 1.5, 0.06, 0.025), rib, Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8, 0, -a, 0, 1, 1, 1, body); }
    const vents = [];
    for (let i = 0; i < 4; i++) vents.push(K.mesh(tor(0.86 - Math.abs(i - 1.5) * 0.1, 0.035, 36, 6), glow(0xb35cff, 3), 'vent' + i, 0, -0.45 + i * 0.3, 0, Math.PI / 2, 0, 0, body));
    K.add(cyl(0.3, 0.22, 0.12, 18), M.frame, 0, 0.94, 0, 0, 0, 0, 1, 1, 1, body);
    K.mesh(sph(0.2, 14, 10), glow(0xd18aff, 4), 'beacon', 0, 1.04, 0, 0, 0, 0, body);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; K.add(cone(0.05, 0.3, 6), M.steel, Math.cos(a) * 0.55, 0.65, Math.sin(a) * 0.55, Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7, 1, 1, 1, body); }
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; K.rod(M.copper, Math.cos(a) * 0.6, -0.6, Math.sin(a) * 0.6, Math.cos(a + 0.5) * 0.75, 0.3, Math.sin(a + 0.5) * 0.75, 0.025, body, 6); }
    for (let j = 0; j < 4; j++) for (let i = 0; i < 12; i++) {
      const el = -0.55 + j * 0.38, a = (i / 12) * Math.PI * 2 + j * 0.26, rr = 0.82 * Math.cos(el * 0.9) + 0.02;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr, y = Math.sin(el) * 0.92;
      const n = new THREE.Vector3(x, y * 0.6, z).normalize(), e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(_up, n));
      K.add(cyl(0.06, 0.07, 0.04, 6), (i + j) % 3 ? rib : M.frame, x, y, z, e.x, e.y, e.z, 1, 1, 1, body);
      if ((i + j) % 4 === 0) K.add(cyl(0.025, 0.025, 0.05, 6), glow(0xd18aff, 3), x * 1.02, y * 1.02, z * 1.02, e.x, e.y, e.z, 1, 1, 1, body);
    }
    // claws
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4, c = Math.cos(a), s = Math.sin(a);
      K.rod(M.dark, c * 0.55, 0.35, s * 0.55, c * 0.95, 0.4, s * 0.95, 0.07, K.root);
      K.add(sph(0.08, 10, 8), M.frame, c * 0.95, 0.4, s * 0.95, 0, 0, 0, 1, 1, 1, K.root);
      K.rod(M.steel, c * 0.95, 0.4, s * 0.95, c * 1.05, 0.0, s * 1.05, 0.05, K.root);
    }
    return K.build();
  });
  return { g, body: by(g, 'body'), vents: all(g, 'vent') };
}
export function dart() {
  const g = make('dart', () => {
    const K = new Kit();
    const skin = paint(0x40384a, 0.3, 0.8);
    const body = K.group('body', K.root, 0, 0.9, 0);
    K.add(lathe('dart', [[0, -0.34], [0.09, -0.3], [0.15, -0.12], [0.15, 0.1], [0.1, 0.28], [0, 0.4]], 14), skin, 0, 0, 0, 0, 0, -Math.PI / 2, 1, 1, 1, body);
    for (const s of [-1, 1]) { K.add(rbox(0.24, 0.025, 0.24, 0.01), M.dark, -0.14, 0, s * 0.18, 0, s * 0.3, 0, 1, 1, 1, body); K.add(rbox(0.1, 0.02, 0.12, 0.008), M.dark, 0.18, 0, s * 0.12, 0, 0, 0, 1, 1, 1, body); }
    K.add(rbox(0.2, 0.14, 0.02, 0.008), M.dark, -0.2, 0.08, 0, 0, 0, 0.2, 1, 1, 1, body);
    K.add(cyl(0.09, 0.07, 0.08, 12), M.frame, -0.32, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, body);
    K.mesh(sph(0.075, 10, 8), glow(0xc070ff, 6), 'tail', -0.37, 0, 0, 0, 0, 0, body);
    K.mesh(sph(0.03, 8, 6), glow(0xff3a2a, 5), 'nose', 0.38, 0.02, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) K.add(sph(0.018, 6, 4), glow(s < 0 ? 0xff3a2a : 0x7dff9a, 5), -0.2, 0, s * 0.29, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.006, 0.006, 0.14, 4), M.steel, 0.05, 0.12, 0, 0, 0, -0.4, 1, 1, 1, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), tail: by(g, 'tail') };
}
export function pylon() {
  const g = make('pylon', () => {
    const K = new Kit();
    K.add(cyl(0.42, 0.5, 0.22, 20), M.dark, 0, 0.11, 0);
    K.add(cyl(0.44, 0.44, 0.06, 20), M.stripes, 0, 0.25, 0);
    bolts(K, M.steel, Array.from({ length: 8 }, (_, i) => [Math.cos(i * 0.785) * 0.36, 0.23, Math.sin(i * 0.785) * 0.36, 0, 0, 0]), 0.03);
    K.add(cyl(0.11, 0.15, 1.3, 14), M.steel, 0, 0.9, 0);
    // ceramic insulator stack
    for (let i = 0; i < 5; i++) K.add(lathe('ins', [[0.06, -0.04], [0.2, -0.01], [0.2, 0.01], [0.06, 0.04]], 18), M.ceramic, 0, 0.5 + i * 0.14, 0);
    for (let i = 0; i < 3; i++) K.add(tor(0.13, 0.03, 18, 6), M.copper, 0, 1.25 + i * 0.09, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < 3; i++) { const a = i * 2.09; K.add(tor(0.22, 0.012, 20, 4), M.steel, 0, 1.65, 0, Math.PI / 2 + 0.6, a, 0); }
    K.mesh(sph(0.17, 16, 12), glow(0x6fe8ff, 4), 'top', 0, 1.65, 0);
    for (let i = 0; i < 3; i++) { const a = i * 2.09; K.rod(M.dark, Math.cos(a) * 0.38, 0.2, Math.sin(a) * 0.38, Math.cos(a) * 0.12, 0.9, Math.sin(a) * 0.12, 0.022); }
    return K.build();
  });
  return { g, top: by(g, 'top') };
}
export function splitter(shard = false) {
  const g = make(shard ? 'shard' : 'splitter', () => {
    const K = new Kit();
    const mat = paint(0x24402c, 0.25, 0.7), plate = paint(0x3a5a40, 0.3, 0.7);
    const body = K.group('body', K.root, 0, shard ? 0.5 : 0.75, 0);
    if (shard) {
      for (let i = 0; i < 8; i++) { const v = new THREE.Vector3(Math.sin(i * 2.4) * 1, Math.cos(i * 1.7), Math.sin(i * 0.9 + 1)).normalize(); const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(_up, v)); K.add(cone(0.06, 0.24, 5), M.steel, v.x * 0.32, v.y * 0.32, v.z * 0.32, e.x, e.y, e.z, 1, 1, 1, body); }
      K.add(ico(0.32, 1), mat, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
      K.mesh(sph(0.15, 12, 10), glow(0x7dff6a, 5), 'core', 0, 0, 0, 0, 0, 0, body);
      return K.build();
    }
    for (const s of [-1, 1]) {
      K.add(sph(0.44, 22, 16), mat, 0, 0, s * 0.26, 0, 0, 0, 1, 1, 1, body);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; K.add(rbox(0.26, 0.26, 0.05, 0.02), plate, Math.cos(a) * 0.36, Math.sin(a) * 0.36, s * 0.42, Math.sin(a) * 0.5 * s, -Math.cos(a) * 0.5 * s, 0, 1, 1, 1, body); }
      K.add(cyl(0.08, 0.1, 0.12, 10), M.frame, -0.4, 0, s * 0.26, 0, 0, Math.PI / 2, 1, 1, 1, body);
    }
    K.mesh(tor(0.4, 0.06, 32, 8), glow(0x7dff6a, 4), 'core', 0, 0, 0, 0, 0, 0, body);
    K.add(tor(0.43, 0.03, 32, 6), M.chrome, 0, 0, 0.06, 0, 0, 0, 1, 1, 1, body);
    K.add(tor(0.43, 0.03, 32, 6), M.chrome, 0, 0, -0.06, 0, 0, 0, 1, 1, 1, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), core: by(g, 'core') };
}
export function dummy() {
  const g = make('dummy', () => {
    const K = new Kit();
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; K.rod(M.dark, 0, 0.85, 0, Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4, 0.03); K.add(cyl(0.05, 0.06, 0.03, 8), M.rubber, Math.cos(a) * 0.4, 0.015, Math.sin(a) * 0.4); }
    K.add(cyl(0.05, 0.05, 0.2, 8), M.steel, 0, 0.9, 0);
    const disc = K.group('disc', K.root, 0, 1.0, 0);
    K.add(cyl(0.5, 0.5, 0.06, 32), paint(0xeeeeee, 0.6, 0), 0, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, disc);
    K.add(cyl(0.38, 0.38, 0.07, 32), paint(0xff6a2a, 0.6, 0), 0, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, disc);
    K.add(cyl(0.26, 0.26, 0.08, 32), paint(0xeeeeee, 0.6, 0), 0, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, disc);
    K.add(tor(0.5, 0.025, 32, 6), M.frame, 0, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, disc);
    K.mesh(cyl(0.12, 0.12, 0.09, 16), glow(0xffd070, 3), 'bull', 0, 0, 0, 0, 0, Math.PI / 2, disc);
    return K.build();
  });
  return { g, disc: by(g, 'disc') };
}

// ------------------------------------------------------------------ survivors
const JACKETS = [0xd94a3a, 0x3a7bd9, 0xe0b23c, 0x4aa86a, 0x8a5ad0, 0xe07a2c];
const PANTS = [0x2b3140, 0x4a3b2c, 0x30323a, 0x5a5e66];
const SKIN = [0xf1c7a5, 0xd59c74, 0xa86f4a, 0x6e4630];
const HAIR = [0x1a1410, 0x5a3a20, 0xc8a060, 0x2a2a2a];
export function survivor(look = 0) {
  const g = make('surv' + (look % 12), () => {
    const K = new Kit();
    const jacket = cloth(JACKETS[look % 6], 0.8), pants = cloth(PANTS[look % 4]), skin = cloth(SKIN[(look * 3) % 4], 0.6), hair = cloth(HAIR[(look * 5 + 1) % 4], 0.7), shoe = cloth(0x1d1d1f, 0.6), trim = cloth(0xe8e4da, 0.7);
    for (const s of [-1, 1]) {
      const hip = K.group('leg' + (s < 0 ? 'A' : 'B'), K.root, 0, 0.84, s * 0.1);
      K.add(cap(0.075, 0.34, 10), pants, 0, -0.2, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(cap(0.065, 0.3, 10), pants, 0.01, -0.56, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.2, 0.08, 0.1, 0.035), shoe, 0.04, -0.8, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(box(0.2, 0.02, 0.1), trim, 0.04, -0.835, 0, 0, 0, 0, 1, 1, 1, hip);
    }
    K.add(cyl(0.15, 0.14, 0.08, 14), cloth(0x2a2420, 0.5), 0, 0.88, 0, 0, 0, 0, 1, 1, 1.2);       // belt
    K.add(cap(0.17, 0.3, 12), jacket, 0, 1.16, 0, 0, 0, 0, 0.78, 1, 1.12);                          // torso
    K.add(tor(0.09, 0.035, 14, 6), jacket, 0, 1.42, 0, Math.PI / 2, 0, 0, 1, 1, 1);                 // collar
    K.add(box(0.005, 0.32, 0.01), trim, 0.135, 1.16, 0, 0, 0, 0, 1, 1, 1);                          // zip
    if (look % 3 === 0) K.add(rbox(0.14, 0.3, 0.26, 0.05), cloth(0x3a4a3a), -0.17, 1.2, 0);         // backpack
    if (look % 3 === 1) K.rod(cloth(0x5a3a2a), 0.1, 1.38, -0.12, -0.08, 0.98, 0.16, 0.015);        // bag strap
    K.add(cyl(0.05, 0.055, 0.08, 10), skin, 0.01, 1.47, 0);                                          // neck
    K.add(sph(0.12, 18, 14), skin, 0.015, 1.6, 0, 0, 0, 0, 0.95, 1.08, 0.9);                         // head
    K.add(sph(0.125, 18, 10), hair, -0.02, 1.64, 0, 0, 0, 0.2, 1, 0.75, 0.95);                       // hair
    K.add(sph(0.022, 8, 6), skin, 0.13, 1.59, 0, 0, 0, 0, 1, 1, 1);                                  // nose
    for (const s of [-1, 1]) K.add(sph(0.012, 6, 4), cloth(0x101010, 0.3), 0.11, 1.63, s * 0.04);   // eyes
    for (const s of [-1, 1]) {
      const sh = K.group('arm' + (s < 0 ? 'A' : 'B'), K.root, 0, 1.36, s * 0.22);
      K.add(sph(0.075, 10, 8), jacket, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
      K.add(cap(0.058, 0.24, 10), jacket, 0, -0.17, 0, 0, 0, 0, 1, 1, 1, sh);
      K.add(cap(0.05, 0.2, 10), jacket, 0.02, -0.42, 0, 0, 0, 0, 1, 1, 1, sh);
      K.add(sph(0.045, 10, 8), skin, 0.03, -0.58, 0, 0, 0, 0, 1, 1.2, 0.8, sh);
    }
    return K.build();
  });
  return { g, legs: all(g, 'leg'), arms: all(g, 'arm') };
}

// ------------------------------------------------------------------ bosses
export function boss(key) {
  const g = make('boss' + key, () => buildBoss(key));
  const parts = { g, legs: all(g, 'bleg'), eye: by(g, 'eye'), spin: by(g, 'spin'), body: by(g, 'bbody'), plow: by(g, 'plow'), glows: all(g, 'bglow') };
  return parts;
}
function buildBoss(key) {
  const K = new Kit();
  let gi = 0;
  const glowPart = (geom, color, k, x, y, z, rx = 0, ry = 0, rz = 0, parent = K.root) => K.mesh(geom, glow(color, k), 'bglow' + String(gi++).padStart(2, '0'), x, y, z, rx, ry, rz, parent);
  if (key === 'foreman') {
    // a four-legged construction walker with a cab, exhausts and hydraulic legs
    const yel = paint(0xd8961c, 0.42, 0.45), deep = paint(0x7a5210, 0.45, 0.45);
    const body = K.group('bbody', K.root, 0, 2.4, 0);
    K.add(rbox(3.0, 1.2, 2.4, 0.16), yel, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(3.02, 0.22, 2.42, 0.04), M.stripes, 0, -0.5, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(2.6, 0.12, 2.0, 0.04), deep, 0, 0.62, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 6; i++) K.add(box(0.9, 0.03, 0.08), M.black, -0.9, 0.7, -0.5 + i * 0.2, 0, 0, 0, 1, 1, 1, body);   // deck grille
    K.add(rbox(1.2, 0.9, 1.6, 0.1), yel, 0.8, 0.9, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.62, 0.62, 1.42, 0.06), M.glass, 1.15, 0.95, 0, 0, 0, 0, 1, 1, 1, body);
    for (const z of [-0.72, 0.72]) for (const x of [0.25, 1.4]) K.rod(M.frame, x, 0.45, z, x, 1.42, z, 0.05, body);
    K.add(rbox(1.3, 0.08, 1.7, 0.03), M.frame, 0.8, 1.4, 0, 0, 0, 0, 1, 1, 1, body);
    K.mesh(box(0.1, 0.3, 1.2), glow(0xff3a2a, 5), 'eye', 1.52, 0.2, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) { glowPart(cyl(0.16, 0.16, 0.2, 14), 0xff8a1a, 6, -0.8, 0.75, s * 0.8, 0, 0, 0, body); glowPart(cyl(0.12, 0.12, 0.05, 12), 0xfff0c0, 5, 1.51, -0.2, s * 0.9, 0, 0, Math.PI / 2, body); }
    for (const s of [-1, 1]) { K.add(cyl(0.16, 0.2, 1.3, 14), M.frame, -1.1, 1.2, s * 0.6, 0, 0, 0, 1, 1, 1, body); K.add(cyl(0.2, 0.2, 0.06, 14), M.black, -1.1, 1.86, s * 0.6, 0, 0, 0, 1, 1, 1, body); }
    bolts(K, M.steel, Array.from({ length: 10 }, (_, i) => [-1.3 + i * 0.28, 0.35, 1.21, Math.PI / 2, 0, 0]), 0.035, body);
    bolts(K, M.steel, Array.from({ length: 10 }, (_, i) => [-1.3 + i * 0.28, 0.35, -1.21, Math.PI / 2, 0, 0]), 0.035, body);
    // legs (the renderer lifts these hips and swings them)
    [[1.2, 1.3], [-1.2, 1.3], [1.2, -1.3], [-1.2, -1.3]].forEach(([x, z], i) => {
      const s = Math.sign(z), hip = K.group('bleg' + i, K.root, x, 2.2, z);
      K.add(sph(0.32, 14, 10), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.46, 1.3, 0.46, 0.08), M.dark, 0, -0.5, s * 0.3, s * 0.4, 0, 0, 1, 1, 1, hip);
      K.add(sph(0.26, 12, 10), M.frame, 0, -1.0, s * 0.55, 0, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.54, 1.4, 0.54, 0.1), yel, 0, -1.5, s * 0.6, s * -0.08, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.56, 0.2, 0.56, 0.04), M.stripes, 0, -1.1, s * 0.58, s * -0.08, 0, 0, 1, 1, 1, hip);
      K.rod(M.chrome, 0.32, -0.2, s * 0.1, 0.32, -1.2, s * 0.55, 0.06, hip);
      K.rod(M.frame, 0.32, -0.1, s * 0.05, 0.32, -0.6, s * 0.3, 0.1, hip);
      K.add(cyl(0.55, 0.65, 0.25, 16), M.dark, 0, -2.15, s * 0.66, 0, 0, 0, 1, 1, 1, hip);
      for (let k = 0; k < 4; k++) { const a = k * 1.571 + 0.785; K.add(cone(0.09, 0.3, 6), M.steel, Math.cos(a) * 0.6, -2.25, s * 0.66 + Math.sin(a) * 0.6, Math.PI / 2, 0, -a + Math.PI / 2, 1, 1, 1, hip); }
    });
  } else if (key === 'tramline') {
    // an armoured tram with a ram plow, pantograph, bogies and lit windows
    const teal = paint(0x2b7c76, 0.4, 0.45), cream = paint(0xe0d6bc, 0.5, 0.2);
    const body = K.group('bbody', K.root, 0, 0.4, 0);
    K.add(rbox(4.2, 1.5, 2.0, 0.14), teal, 0, 1.0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(4.22, 0.5, 2.02, 0.08), cream, 0, 1.6, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(4.0, 0.2, 1.8, 0.08), cream, 0, 1.92, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) { K.add(rbox(0.5, 0.42, 0.04, 0.04), M.glass, -1.6 + i * 0.62, 1.58, s * 1.01, 0, 0, 0, 1, 1, 1, body); glowPart(box(0.42, 0.34, 0.01), 0xffe0a0, 1.6, -1.6 + i * 0.62, 1.58, s * 1.03, 0, 0, 0, body); }
    for (const s of [-1, 1]) for (const x of [-0.8, 0.8]) { K.add(box(0.02, 1.0, 0.03), M.black, x - 0.28, 1.1, s * 1.01, 0, 0, 0, 1, 1, 1, body); K.add(box(0.02, 1.0, 0.03), M.black, x + 0.28, 1.1, s * 1.01, 0, 0, 0, 1, 1, 1, body); }   // doors
    glowPart(box(0.05, 0.25, 1.0), 0xffb347, 3, 2.11, 1.85, 0, 0, 0, 0, body);       // destination sign
    for (const s of [-1, 1]) glowPart(cyl(0.12, 0.12, 0.05, 12), 0xfff0c0, 5, 2.12, 0.6, s * 0.7, 0, 0, Math.PI / 2, body);
    // pantograph
    K.add(rbox(0.8, 0.1, 0.6, 0.03), M.dark, 0, 2.06, 0, 0, 0, 0, 1, 1, 1, body);
    K.rod(M.steel, -0.3, 2.1, -0.25, 0.2, 2.7, 0, 0.02, body); K.rod(M.steel, -0.3, 2.1, 0.25, 0.2, 2.7, 0, 0.02, body); K.rod(M.steel, 0.2, 2.7, 0, -0.2, 3.1, 0, 0.02, body);
    K.add(box(0.06, 0.04, 1.0), M.copper, -0.2, 3.12, 0, 0, 0, 0, 1, 1, 1, body);
    // bogies
    for (const x of [-1.4, 1.4]) { K.add(rbox(1.2, 0.3, 1.9, 0.06), M.dark, x, 0.25, 0, 0, 0, 0, 1, 1, 1, body); for (const dx of [-0.35, 0.35]) for (const s of [-1, 1]) { K.add(cyl(0.3, 0.3, 0.14, 18), M.black, x + dx, 0.1, s * 0.92, Math.PI / 2, 0, 0, 1, 1, 1, body); K.add(cyl(0.12, 0.12, 0.16, 10), M.steel, x + dx, 0.1, s * 0.92, Math.PI / 2, 0, 0, 1, 1, 1, body); } }
    const plow = K.group('plow', body, 2.2, 0.6, 0);
    for (const s of [-1, 1]) K.add(rbox(1.3, 1.0, 0.16, 0.04), M.stripes, 0.3, 0, s * 0.5, 0, s * 0.75, 0, 1, 1, 1, plow);
    for (let i = 0; i < 5; i++) K.add(cone(0.08, 0.3, 6), M.steel, 0.8, -0.4 + i * 0.2, 0, 0, 0, -Math.PI / 2, 1, 1, 1, plow);
    K.mesh(box(0.1, 0.25, 1.4), glow(0xff3a2a, 5), 'eye', 2.12, 1.3, 0, 0, 0, 0, body);
  } else if (key === 'crucible') {
    // a banded furnace vessel with a molten mouth, stacks, chains and turning stirring arms
    const shell = paint(0x47403a, 0.55, 0.7), band = paint(0x2e2a26, 0.5, 0.8);
    K.add(lathe('cruc', [[0, 0], [2.4, 0], [2.45, 0.3], [2.3, 1.2], [2.15, 2.2], [2.0, 2.55], [1.55, 2.6], [1.5, 2.5], [0, 2.5]], 36), shell, 0, 0, 0);
    for (let i = 0; i < 4; i++) K.add(tor(2.38 - i * 0.07, 0.1, 40, 8), band, 0, 0.4 + i * 0.62, 0, Math.PI / 2, 0, 0, 1, 1, 1);
    bolts(K, M.steel, Array.from({ length: 24 }, (_, i) => [Math.cos(i * 0.2618) * 2.43, 0.4, Math.sin(i * 0.2618) * 2.43, 0, -i * 0.2618, 0]), 0.05);
    K.mesh(cyl(1.5, 1.5, 0.1, 32), glow(0xff6a1a, 4), 'mouth', 0, 2.58, 0);
    glowPart(tor(1.55, 0.12, 40, 8), 0xffa040, 5, 0, 2.62, 0, Math.PI / 2, 0, 0);
    for (const s of [-1, 1]) {
      K.add(cyl(0.3, 0.38, 2.4, 16), M.dark, -1.2, 3.4, s * 1.1); K.add(tor(0.34, 0.05, 16, 6), band, -1.2, 4.2, s * 1.1, Math.PI / 2, 0, 0);
      glowPart(cyl(0.24, 0.24, 0.06, 12), 0xff8a2a, 3, -1.2, 4.6, s * 1.1);
      // chain hanging from the rim
      for (let k = 0; k < 6; k++) K.add(tor(0.07, 0.02, 10, 4), M.steel, 1.6, 2.3 - k * 0.14, s * 1.4, 0, k % 2 ? Math.PI / 2 : 0, 0);
    }
    for (let i = 0; i < 3; i++) { const a = i * 2.09 + 0.5; K.rod(M.copper, Math.cos(a) * 2.35, 0.3, Math.sin(a) * 2.35, Math.cos(a + 0.3) * 2.1, 2.3, Math.sin(a + 0.3) * 2.1, 0.07); glowPart(cyl(0.1, 0.1, 0.05, 10), i ? 0x7dff6a : 0xff3a2a, 4, Math.cos(a - 0.3) * 2.36, 1.5, Math.sin(a - 0.3) * 2.36, 0, -a + 0.3, Math.PI / 2); }
    K.mesh(box(0.1, 0.5, 1.6), glow(0xff3a2a, 4), 'eye', 2.3, 1.2, 0);
    const spin = K.group('spin', K.root, 0, 2.9, 0);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; K.add(rbox(1.6, 0.18, 0.3, 0.05), M.steel, Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8, 0, -a, 0, 1, 1, 1, spin); K.add(cyl(0.06, 0.06, 0.7, 8), M.frame, Math.cos(a) * 1.5, -0.35, Math.sin(a) * 1.5, 0, 0, 0, 1, 1, 1, spin); }
    K.add(cyl(0.3, 0.3, 0.4, 16), M.dark, 0, 0.1, 0, 0, 0, 0, 1, 1, 1, spin);
  } else if (key === 'archivist') {
    // a floating archive core: glass sphere, data rings, panel petals, antenna spokes
    const body = K.group('bbody', K.root, 0, 2.6, 0);
    K.add(sph(1.5, 40, 28), M.glassT, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.mesh(sph(0.75, 28, 20), glow(0x3fb8ff, 3.5), 'eye', 0, 0, 0, 0, 0, 0, body);
    for (let i = 0; i < 3; i++) glowPart(tor(0.95 + i * 0.15, 0.015, 48, 4), 0x9fe8ff, 3, 0, 0, 0, Math.PI / 2 + i * 0.6, i * 0.9, 0, body);
    K.add(tor(1.52, 0.06, 48, 8), M.chrome, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    const spin = K.group('spin', body);
    K.add(tor(1.95, 0.12, 64, 10), M.steel, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, spin);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      K.add(rbox(0.5, 0.9, 0.12, 0.04), paint(0x1d2a3a, 0.3, 0.8), Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0, 0, -a, 0, 1, 1, 1, spin);
      glowPart(box(0.1, 0.6, 0.14), 0x3fb8ff, 4, Math.cos(a) * 2.06, 0, Math.sin(a) * 2.06, 0, -a, 0, spin);
      K.rod(M.steel, Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5, Math.cos(a) * 1.95, 0, Math.sin(a) * 1.95, 0.03, spin);
    }
    for (let i = 0; i < 4; i++) { const a = i * 1.571 + 0.4; K.rod(M.frame, Math.cos(a) * 1.2, 0.9, Math.sin(a) * 1.2, Math.cos(a) * 1.4, 1.9, Math.sin(a) * 1.4, 0.03, body); K.mesh(sph(0.06, 8, 6), glow(0xff4a3a, 5), 'atip' + i, Math.cos(a) * 1.4, 1.95, Math.sin(a) * 1.4, 0, 0, 0, body); }
    K.add(cyl(0.9, 1.3, 0.25, 32), M.dark, 0, 0.12, 0);
    K.add(cyl(0.6, 0.9, 0.4, 32), M.frame, 0, 0.45, 0);
    glowPart(tor(1.0, 0.06, 40, 6), 0x3fb8ff, 3, 0, 0.28, 0, Math.PI / 2, 0, 0);
  } else {
    // the Overseer: a tiered hexagonal tower, an iris eye, six jointed claws, cables and vents
    const hull = paint(0x3a1f22, 0.35, 0.7), dark = paint(0x221416, 0.4, 0.7);
    const body = K.group('bbody');
    K.add(cyl(1.6, 2.4, 1.0, 6), M.dark, 0, 0.5, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(1.25, 1.6, 2.2, 6), hull, 0, 2.1, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(1.0, 1.25, 0.5, 6), dark, 0, 3.45, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; for (let k = 0; k < 3; k++) K.add(box(0.06, 0.04, 0.5), M.black, Math.cos(a) * 1.5, 1.5 + k * 0.12, Math.sin(a) * 1.5, 0, -a, 0, 1, 1, 1, body); glowPart(box(0.05, 0.6, 0.3), 0xff5a3a, 2.5, Math.cos(a) * 1.46, 2.6, Math.sin(a) * 1.46, 0, -a, 0, body); }
    for (let i = 0; i < 4; i++) { const a = i * 1.571 + 0.3; K.rod(M.rubber, Math.cos(a) * 2.2, 0.15, Math.sin(a) * 2.2, Math.cos(a) * 1.3, 2.9, Math.sin(a) * 1.3, 0.07, body, 8); }
    K.add(cyl(0.85, 0.85, 0.3, 24), M.frame, 1.0, 2.3, 0, 0, 0, Math.PI / 2, 1, 1, 1, body);
    K.mesh(sph(0.7, 28, 20), glow(0xff2a3a, 4), 'eye', 0.95, 2.3, 0, 0, 0, 0, body);
    K.add(tor(0.78, 0.1, 40, 8), M.steel, 1.15, 2.3, 0, 0, Math.PI / 2, 0, 1, 1, 1, body);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; K.add(rbox(0.05, 0.3, 0.12, 0.02), M.chrome, 1.2, 2.3 + Math.sin(a) * 0.62, Math.cos(a) * 0.62, a, 0, 0, 1, 1, 1, body); }   // iris blades
    const spin = K.group('spin', body, 0, 3.6, 0);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      K.add(sph(0.16, 10, 8), M.frame, c * 1.0, 0, s * 1.0, 0, 0, 0, 1, 1, 1, spin);
      K.rod(M.steel, c * 1.0, 0, s * 1.0, c * 1.4, 0.7, s * 1.4, 0.09, spin);
      K.add(sph(0.12, 10, 8), M.frame, c * 1.4, 0.7, s * 1.4, 0, 0, 0, 1, 1, 1, spin);
      K.rod(M.chrome, c * 1.4, 0.7, s * 1.4, c * 1.2, 1.4, s * 1.2, 0.06, spin);
      K.add(cone(0.08, 0.3, 6), M.steel, c * 1.18, 1.55, s * 1.18, 0, 0, 0, 1, 1, 1, spin);
    }
    glowPart(tor(1.3, 0.08, 40, 8), 0xff5a3a, 4, 0, 0, 0, Math.PI / 2, 0, 0, spin);
  }
  return K.build();
}
export function orb() {
  const g = make('orb', () => {
    const K = new Kit();
    K.add(sph(0.45, 24, 16), M.glassT, 0, 1.6, 0);
    K.add(tor(0.47, 0.035, 32, 6), M.chrome, 0, 1.6, 0, Math.PI / 2, 0, 0);
    K.add(tor(0.47, 0.025, 32, 6), M.steel, 0, 1.6, 0, 0, 0, 0);
    for (let i = 0; i < 4; i++) { const a = i * 1.571; K.add(cone(0.06, 0.2, 6), M.steel, Math.cos(a) * 0.5, 1.6, Math.sin(a) * 0.5, Math.PI / 2, 0, -a + Math.PI / 2); }
    K.mesh(sph(0.24, 16, 12), glow(0x3fb8ff, 5), 'core', 0, 1.6, 0);
    return K.build();
  });
  return { g, core: by(g, 'core') };
}

// ------------------------------------------------------------------ v1.3 machines
// BULWARK: a squat two-legged guard behind a curved riot shield (the 'shield' part fades as it cracks)
export function bulwark() {
  const g = make('bulwark', () => {
    const K = new Kit();
    const armor = paint(0x5a6270, 0.36, 0.7), trim = paint(0xc8a030, 0.4, 0.5);
    const body = K.group('body');
    for (const s of [-1, 1]) {
      K.add(rbox(0.36, 0.5, 0.3, 0.06), M.dark, -0.05, 0.3, s * 0.36, 0, 0, 0, 1, 1, 1, body);
      K.add(rbox(0.44, 0.12, 0.34, 0.04), M.black, 0.04, 0.06, s * 0.36, 0, 0, 0, 1, 1, 1, body);
      K.rod(M.chrome, -0.12, 0.55, s * 0.3, -0.12, 0.18, s * 0.36, 0.03, body, 8);
      K.add(sph(0.12, 12, 8), M.frame, -0.05, 0.62, s * 0.34, 0, 0, 0, 1, 1, 1, body);
    }
    K.add(rbox(0.7, 0.7, 0.9, 0.12), armor, -0.1, 1.0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.72, 0.12, 0.92, 0.03), M.stripes, -0.1, 0.66, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.4, 0.3, 0.6, 0.08), M.dark, -0.42, 1.12, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 4; i++) K.add(box(0.04, 0.2, 0.5), M.frame, -0.64, 1.05 + (i % 2) * 0.05, -0.18 + i * 0.12, 0, 0, 0, 1, 1, 1, body);
    // helmet head with a visor slit
    K.add(rbox(0.36, 0.28, 0.4, 0.1), armor, 0.02, 1.48, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(box(0.03, 0.05, 0.28), glow(0xff3a2a, 5), 0.2, 1.5, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.1, 0.06, 0.42, 0.02), trim, 0.06, 1.63, 0, 0, 0, 0, 1, 1, 1, body);
    // shield arm
    K.rod(M.frame, 0.1, 1.15, 0.38, 0.55, 1.0, 0.2, 0.05, body, 8);
    K.add(sph(0.08, 10, 8), M.frame, 0.1, 1.15, 0.38, 0, 0, 0, 1, 1, 1, body);
    const shield = K.group('shield', body, 0, 0, 0);
    const arc = geo('bshield', () => { const c = new THREE.CylinderGeometry(1.05, 1.05, 1.5, 28, 1, true, Math.PI / 2 - 1.05, 2.1); return c; });
    K.add(arc, paint(0x3d4450, 0.3, 0.85), 0, 0.95, 0, 0, 0, 0, 1, 1, 1, shield);
    K.add(geo('bshield2', () => new THREE.CylinderGeometry(1.1, 1.1, 1.5, 28, 1, true, Math.PI / 2 - 1.05, 2.1)), M.frame, 0, 0.95, 0, 0, 0, 0, 1, 1, 1, shield);
    for (const y of [0.22, 1.68]) K.add(geo('brim', () => new THREE.TorusGeometry(1.075, 0.03, 6, 28, 2.1)), trim, 0, y, 0, Math.PI / 2, 0, -1.05, 1, 1, 1, shield);
    for (let i = 0; i < 5; i++) { const a = -0.8 + i * 0.4; K.add(box(0.03, 1.3, 0.05), M.dark, Math.cos(a) * 1.11, 0.95, Math.sin(a) * 1.11, 0, -a, 0, 1, 1, 1, shield); }
    K.add(box(0.05, 0.12, 0.9), M.glassT, 1.1, 1.25, 0, 0, 0, 0, 1, 1, 1, shield);                    // view slot
    K.mesh(geo('bglowedge', () => new THREE.TorusGeometry(1.08, 0.015, 4, 28, 2.1)), glow(0x6fe8ff, 3), 'shieldglow', 0, 0.95, 0, Math.PI / 2, 0, -1.05, shield);
    return K.build();
  });
  return { g, body: by(g, 'body'), shield: by(g, 'shield'), shieldGlow: by(g, 'shieldglow') };
}
// LEAPER: a mantis-like jumper with big folded hind legs (the 'hindL'/'hindR' groups fold when it crouches)
export function leaper() {
  const g = make('leaper', () => {
    const K = new Kit();
    const shell = paint(0x6a4a1c, 0.36, 0.6), plate = paint(0xb87a22, 0.34, 0.6);
    const body = K.group('body', K.root, 0, 0.62, 0);
    K.add(lathe('leapb', [[0, -0.18], [0.16, -0.16], [0.24, -0.06], [0.24, 0.06], [0.16, 0.15], [0, 0.17]], 16), shell, -0.05, 0, 0, 0, 0, Math.PI / 2, 1.3, 1, 1, body);
    for (let i = 0; i < 4; i++) K.add(rbox(0.12, 0.05, 0.3 - i * 0.04, 0.02), plate, -0.25 + i * 0.12, 0.15 + i * 0.01, 0, 0, 0, -0.15, 1, 1, 1, body);
    K.add(rbox(0.2, 0.16, 0.2, 0.05), M.dark, 0.32, 0.08, 0, 0, 0, -0.2, 1, 1, 1, body);
    for (const s of [-1, 1]) { K.add(sph(0.04, 8, 6), glow(0xffa020, 6), 0.42, 0.12, s * 0.06, 0, 0, 0, 1, 1, 1, body); K.add(cone(0.025, 0.14, 5), M.steel, 0.44, 0.0, s * 0.05, 0, 0, -Math.PI / 2 - 0.5, 1, 1, 1, body); }
    K.add(cyl(0.006, 0.006, 0.3, 4), M.steel, 0.35, 0.28, 0.05, 0.3, 0, -0.6, 1, 1, 1, body);
    // front legs
    for (const s of [-1, 1]) { K.rod(M.dark, 0.2, -0.05, s * 0.12, 0.35, -0.35, s * 0.2, 0.025, body, 6); K.rod(M.steel, 0.35, -0.35, s * 0.2, 0.42, -0.6, s * 0.22, 0.02, body, 6); }
    // hind legs: thigh up and back, shin down to a long foot
    for (const s of [-1, 1]) {
      const hip = K.group('hind' + (s < 0 ? 'L' : 'R'), body, -0.2, 0.0, s * 0.2);
      K.add(sph(0.07, 10, 8), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(shell, 0, 0, 0, -0.1, 0.35, s * 0.08, 0.06, hip, 8);
      K.add(sph(0.05, 8, 6), M.frame, -0.1, 0.35, s * 0.08, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.steel, -0.1, 0.35, s * 0.08, -0.35, -0.55, s * 0.1, 0.03, hip, 6);
      K.rod(M.chrome, -0.02, 0.12, s * 0.06, -0.22, -0.05, s * 0.09, 0.012, hip, 4);
      K.add(rbox(0.3, 0.04, 0.08, 0.015), M.black, -0.24, -0.6, s * 0.1, 0, 0, 0, 1, 1, 1, hip);
    }
    return K.build();
  });
  return { g, body: by(g, 'body'), hindL: by(g, 'hindL'), hindR: by(g, 'hindR') };
}
// MIMIC (revealed): a hunched metal skeleton bursting out of a survivor's torn jacket, long clawed arms
export function mimic(look = 0) {
  const g = make('mimic' + (look % 6), () => {
    const K = new Kit();
    const bone = paint(0x8a8f98, 0.3, 0.9), jacket = cloth([0xd94a3a, 0x3a7bd9, 0xe0b23c, 0x4aa86a, 0x8a5ad0, 0xe07a2c][look % 6], 0.85);
    const body = K.group('body');
    for (const s of [-1, 1]) { K.rod(M.dark, 0, 0.8, s * 0.12, 0.05, 0.4, s * 0.16, 0.05, body, 8); K.rod(bone, 0.05, 0.4, s * 0.16, -0.05, 0.03, s * 0.18, 0.04, body, 8); K.add(rbox(0.22, 0.05, 0.1, 0.02), M.black, 0.03, 0.03, s * 0.18, 0, 0, 0, 1, 1, 1, body); }
    for (let i = 0; i < 6; i++) K.add(rbox(0.12, 0.07, 0.16, 0.025), bone, 0.04 + i * 0.03, 0.85 + i * 0.1, 0, 0, 0, -0.3, 1, 1, 1, body);   // spine, hunched forward
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) K.add(tor(0.14, 0.012, 10, 4, ), bone, 0.12, 1.0 + i * 0.09, s * 0.05, 0, Math.PI / 2, 0, 0.6, 1, 1, body);   // ribs
    K.add(rbox(0.3, 0.36, 0.42, 0.08), jacket, 0.02, 1.12, 0, 0, 0, -0.3, 1, 1, 1, body);
    K.add(rbox(0.06, 0.4, 0.44, 0.02), M.black, 0.18, 1.12, 0, 0, 0, -0.3, 1, 1, 1, body);                 // torn open
    K.add(sph(0.13, 14, 10), bone, 0.32, 1.48, 0, 0, 0, 0, 1.1, 0.9, 0.95, body);
    for (let i = 0; i < 4; i++) K.add(sph(0.025, 6, 4), glow(0xff2a2a, 7), 0.43, 1.5 + (i % 2) * 0.05, -0.04 + Math.floor(i / 2) * 0.08, 0, 0, 0, 1, 1, 1, body);
    K.add(cone(0.06, 0.14, 6), M.steel, 0.44, 1.38, 0, 0, 0, -Math.PI / 2, 1, 1, 1, body);
    for (const s of [-1, 1]) {
      K.add(sph(0.06, 8, 6), M.frame, 0.1, 1.32, s * 0.24, 0, 0, 0, 1, 1, 1, body);
      K.rod(bone, 0.1, 1.32, s * 0.24, 0.35, 0.95, s * 0.32, 0.035, body, 6);
      K.rod(bone, 0.35, 0.95, s * 0.32, 0.6, 0.55, s * 0.3, 0.03, body, 6);
      for (let f = 0; f < 3; f++) K.add(cone(0.02, 0.18, 5), M.chrome, 0.68, 0.5, s * 0.3 + (f - 1) * 0.04, 0, 0, -Math.PI / 2 - 0.6, 1, 1, 1, body);
    }
    return K.build();
  });
  return { g, body: by(g, 'body') };
}

// ------------------------------------------------------------------ power-up pods and the wingman drone
// a hovering supply pod: chrome caps, a glass band with a glowing core in the power-up's colour, a
// spinning gyro ring and a landing cradle; the renderer spins 'pod' and 'ring' and floats it
export function pickup(color) {
  const g = make('pickup' + color, () => {
    const K = new Kit();
    const pod = K.group('pod', K.root, 0, 1.05, 0);
    const capP = [[0, 0.3], [0.18, 0.28], [0.3, 0.2], [0.34, 0.1], [0.34, 0.06]];
    K.add(lathe('pcap', capP, 28), M.chrome, 0, 0.08, 0, 0, 0, 0, 1, 1, 1, pod);
    K.add(lathe('pcap', capP, 28), M.chrome, 0, -0.08, 0, Math.PI, 0, 0, 1, 1, 1, pod);
    K.add(cyl(0.3, 0.3, 0.3, 28, 1), M.glassT, 0, 0, 0, 0, 0, 0, 1, 1, 1, pod);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.rod(M.frame, Math.cos(a) * 0.31, -0.16, Math.sin(a) * 0.31, Math.cos(a) * 0.31, 0.16, Math.sin(a) * 0.31, 0.018, pod, 6); }
    K.mesh(ico(0.16, 1), glow(color, 5), 'core', 0, 0, 0, 0, 0, 0, pod);
    K.add(sph(0.05, 10, 8), glow(color, 6), 0, 0.42, 0, 0, 0, 0, 1, 1, 1, pod);
    K.add(cyl(0.012, 0.012, 0.12, 6), M.steel, 0, 0.36, 0, 0, 0, 0, 1, 1, 1, pod);
    const ring = K.group('ring', K.root, 0, 1.05, 0);
    K.add(tor(0.52, 0.03, 40, 8), M.chrome, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
    K.add(tor(0.52, 0.012, 40, 6), glow(color, 3), 0, 0.035, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; K.add(box(0.1, 0.06, 0.06), M.frame, Math.cos(a) * 0.52, 0, Math.sin(a) * 0.52, 0, -a, 0, 1, 1, 1, ring); }
    // cradle on the floor
    K.add(cyl(0.42, 0.5, 0.08, 28), M.dark, 0, 0.04, 0);
    K.add(tor(0.44, 0.02, 32, 6), glow(color, 2.5), 0, 0.09, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.785; K.add(box(0.12, 0.05, 0.05), M.stripes, Math.cos(a) * 0.36, 0.1, Math.sin(a) * 0.36, 0, -a, 0); }
    return K.build();
  });
  return { g, pod: by(g, 'pod'), ring: by(g, 'ring'), core: by(g, 'core') };
}
export function wingdrone() {
  const g = make('wingdrone', () => {
    const K = new Kit();
    const body = K.group('dbody', K.root, 0, 1.9, 0);
    const shell = paint(0x3a4a40, 0.3, 0.7);
    K.add(lathe('wdrone', [[0, -0.08], [0.12, -0.07], [0.17, -0.02], [0.16, 0.04], [0.09, 0.08], [0, 0.09]], 18), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(sph(0.05, 10, 8), M.glass, 0.13, -0.02, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.02, 0.02, 0.22, 8), M.black, 0.1, -0.08, 0, 0, 0, Math.PI / 2, 1, 1, 1, body);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.785, c = Math.cos(a), s = Math.sin(a);
      K.rod(M.frame, c * 0.12, 0, s * 0.12, c * 0.3, 0.02, s * 0.3, 0.015, body, 6);
      K.add(cyl(0.035, 0.035, 0.04, 10), M.dark, c * 0.3, 0.03, s * 0.3, 0, 0, 0, 1, 1, 1, body);
      const rot = K.group('rotor' + i, body, c * 0.3, 0.06, s * 0.3);
      K.add(box(0.26, 0.006, 0.03), M.black, 0, 0, 0, 0, 0, 0, 1, 1, 1, rot);
      K.add(tor(0.13, 0.008, 20, 4), M.steel, c * 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, rot);
    }
    K.add(tor(0.16, 0.012, 24, 6), glow(0x7dff9a, 4), 0, -0.02, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(sph(0.025, 8, 6), glow(0x7dff9a, 6), 0, -0.09, 0, 0, 0, 0, 1, 1, 1, body);
    return K.build();
  });
  return { g, body: by(g, 'dbody'), rotors: all(g, 'rotor') };
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
export const GEO = { box, cyl, sph, cap, tor, rbox };
// a plain mesh helper (scenery)
export function add(p, g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
