// 3D models with physically based materials: the infiltrator, every security robot, the Seeker, the five
// bosses, power-up pods and the lift. Each model is built once from many detailed parts (bevelled armour
// plates, turned parts, hydraulic struts, bolts, cables, lamps); every static part is merged into one mesh
// per material per moving joint, and later copies are cheap clones that share geometry. A panel normal
// map adds seams, rivets and scratches to painted metal.
// Every model faces +x; the renderer turns it with rotation.y = -angle. Named parts (hips, knees, arms,
// eye, wheel, shield, tube...) are animated by the renderer.
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
const STATIC_PARTS = new Set(['static']);
// skinned kits (the robots, the infiltrator): the static parts of the whole model go into ONE mesh per material
// (and shadow flag), each vertex rigidly bound to its joint group (one bone per joint, weight 1), so a robot costs
// a handful of draw calls instead of one per joint per material. The joint groups, named meshes (eyes, lamps,
// muzzles, visors, fields...) are the ones the unskinned build makes; the merged meshes use twins of the shared
// class materials (same settings, name and userData, see SKM below).
let skinNext = false;
const _I4 = new THREE.Matrix4();
class Kit {
  constructor() { this.root = new THREE.Group(); this.buckets = new Map(); this.named = []; this.parts = []; this.skin = skinNext; }
  group(name, parent = this.root, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.name = name || ''; g.position.set(x, y, z); parent.add(g); return g; }
  // a static part: merged later with everything else in the same parent and material
  add(g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx, parent = this.root) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
    const cls = mat.userData.cls;
    const noSh = !!(this.noShadow && parent.name.startsWith(this.noShadow));
    const key = (this.skin ? (noSh ? 'n' : 's') : parent.uuid) + '|' + (cls || mat.uuid);
    let b = this.buckets.get(key);
    if (!b) { b = { parent, mat: cls ? M.cls[cls] : mat, list: [], colored: !!cls, noSh }; this.buckets.set(key, b); }
    b.list.push([g, m, mat.color, parent]);
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
    if (this.skin) return this.buildSkinned();
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
  buildSkinned() {
    this.root.updateMatrixWorld(true);
    const bones = [], idx = new Map();
    for (const b of this.buckets.values()) for (const e of b.list) if (!idx.has(e[3])) { idx.set(e[3], bones.length); bones.push(e[3]); }
    const skel = new THREE.Skeleton(bones, bones.map((o) => o.matrixWorld.clone().invert()));
    for (const { mat, list, colored, noSh } of this.buckets.values()) {
      // every part in model space (its joint's rest pose); merge() makes every part non-indexed, so a part's
      // vertex count in the merged buffer is its index count (the bug that once bound vertices to nothing)
      const g = merge(list.map(([q, m, c, p]) => [q, new THREE.Matrix4().multiplyMatrices(p.matrixWorld, m), c]), colored);
      const n = g.attributes.position.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
      let o = 0;
      for (const [q, , , p] of list) {
        const c = vcount(q), b = idx.get(p);
        for (let k = 0; k < c; k++) { si[(o + k) * 4] = b; sw[(o + k) * 4] = 1; }
        o += c;
      }
      if (o !== n) throw new Error(`skinned merge: ${o} skinned vertices, ${n} merged`);
      g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
      g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
      if (!SKM.has(mat)) SKM.set(mat, mat.clone());
      const m = new THREE.SkinnedMesh(g, SKM.get(mat));
      m.castShadow = !mat.isMeshBasicMaterial && !noSh; m.receiveShadow = true; m.customDepthMaterial = skinDepth();
      m.boundingSphere = g.boundingSphere.clone(); m.boundingSphere.radius += 0.4;   // rest pose + room for the joints to swing
      this.root.add(m);
      m.bind(skel, _I4);
    }
    this.buckets.clear();
    PARTS.set(this.root, this.parts.map((q) => ({ g: q.g, mat: q.mat, m: q.m, parent: q.parent === this.root ? '' : q.parent.name })));
    return this.root;
  }
}
// skinned meshes draw their shadows with their own depth material, so the shared one never flips between its
// skinned and unskinned programs (both are compiled in the warm-up; this only saves the switching)
let SKIN_DEPTH = null;
// skinned meshes use twins of the shared class materials (same settings, name and userData): three rebuilds a
// material's program state every time the next object's skinning differs from the last one drawn with it, and
// the bosses, pods, pieces and Seeker keep the originals. Twins share the compiled programs (same cache key).
const SKM = new Map();
export const skinTwin = (mat) => SKM.get(mat) || mat;
const skinDepth = () => SKIN_DEPTH || (SKIN_DEPTH = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }));
// a clone of a skinned model gets its own skeleton made of its own joints (same traversal order)
function rebind(proto, c) {
  const a = [], b = [];
  proto.traverse((o) => a.push(o));
  if (!a.some((o) => o.isSkinnedMesh)) return;
  c.traverse((o) => b.push(o));
  const at = new Map(a.map((o, i) => [o, i])), made = new Map();
  for (let i = 0; i < a.length; i++) {
    if (!a[i].isSkinnedMesh) continue;
    const S = a[i].skeleton;
    let s2 = made.get(S);
    if (!s2) { s2 = new THREE.Skeleton(S.bones.map((o) => b[at.get(o)]), S.boneInverses); made.set(S, s2); }
    b[i].bind(s2, _I4); b[i].customDepthMaterial = a[i].customDepthMaterial;
  }
}
// a model taken out of the scene for good: free its skeletons' bone textures (geometry and materials are shared)
export function release(g) {
  if (g) g.traverse((o) => { if (o.isSkinnedMesh && o.skeleton && !PROTO_SKEL.has(o.skeleton)) o.skeleton.dispose(); });
}
const vcount = (g) => (g.index ? g.index.count : g.attributes.position.count);
function merge(list, colored) {
  let n = 0;
  const parts = list.map(([g, m]) => {
    const q = (g.index ? g.toNonIndexed() : g.clone());
    if (!q.attributes.normal) q.computeVertexNormals();
    q.applyMatrix4(m); n += q.attributes.position.count; return q;
  });
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
  // no NaN may reach the shaders (a NaN normal lights a part as a white bloom blob): report it and fix it up
  let bad = 0;
  for (let i = 0; i < pos.length; i++) if (!Number.isFinite(pos[i])) { pos[i] = 0; bad++; }
  for (let i = 0; i < nor.length; i += 3) {
    const l = Math.hypot(nor[i], nor[i + 1], nor[i + 2]);
    if (!(l > 1e-6) || !Number.isFinite(l)) { nor[i] = 0; nor[i + 1] = 1; nor[i + 2] = 0; bad++; }
  }
  for (let i = 0; i < uv.length; i++) if (!Number.isFinite(uv[i])) { uv[i] = 0; bad++; }
  if (bad) console.warn('models: merge fixed', bad, 'bad values');
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
// the robots and the infiltrator are skinned (one mesh per material); bosses, pods and the lift are not
const SKINNED = /^(inf|sentry$|patroller$|marksman$|aegis$|mortar$|ripper$|twin$|drone$)/;
const PROTO_SKEL = new WeakSet();
function make(key, build) {
  if (!PROTO.has(key)) {
    skinNext = SKINNED.test(key);
    try { PROTO.set(key, build()); } finally { skinNext = false; }
    PROTO.get(key).traverse((o) => { if (o.isSkinnedMesh) PROTO_SKEL.add(o.skeleton); });
  }
  const p = PROTO.get(key), c = p.clone(true);
  rebind(p, c);
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

// ------------------------------------------------------------------ the infiltrator
// a light armoured infiltration suit: soft-weave undersuit with composite plates, a slim power cell on
// the back, a full helmet with a split visor and a compact carbine with a shoulder-stock flashlight.
// Joints: lower (pelvis) -> hipL/R -> kneeL/R; upper (waist) -> head, armL/R -> elbowL/R, gun -> lamp
function infLeg(K, parent, side, plate, under) {
  const z = side * 0.115;
  const hip = K.group('hip' + (side < 0 ? 'L' : 'R'), parent, 0, 0.93, z);
  K.add(sph(0.085, 14, 10), under, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
  K.add(cap(0.075, 0.3, 12), under, 0, -0.22, 0, 0, 0, 0, 1, 1, 1, hip);                      // thigh (undersuit)
  K.add(rbox(0.07, 0.3, 0.15, 0.025), plate, 0.075, -0.2, 0, 0, 0, 0.04, 1, 1, 1, hip);        // thigh plate
  K.add(rbox(0.12, 0.08, 0.05, 0.015), M.dark, 0.0, -0.12, side * 0.085, 0, 0, 0, 1, 1, 1, hip); // holster strap
  K.add(rbox(0.1, 0.12, 0.04, 0.012), M.dark, -0.01, -0.26, side * 0.09, 0, 0, 0, 1, 1, 1, hip);
  const knee = K.group('knee' + (side < 0 ? 'L' : 'R'), hip, 0, -0.43, 0);
  K.add(sph(0.07, 12, 8), under, 0, 0, 0, 0, 0, 0, 1, 1, 1, knee);
  K.add(rbox(0.08, 0.11, 0.12, 0.03), plate, 0.06, 0.01, 0, 0, 0, -0.15, 1, 1, 1, knee);        // knee guard
  K.add(cap(0.062, 0.3, 12), under, 0, -0.21, 0, 0, 0, 0, 1, 1, 1, knee);                     // shin
  K.add(rbox(0.06, 0.26, 0.11, 0.02), plate, 0.06, -0.2, 0, 0, 0, 0, 1, 1, 1, knee);            // shin plate
  K.add(rbox(0.07, 0.03, 0.07, 0.01), glow(0x6fe3ff, 2.2), 0.095, -0.12, 0, 0, 0, 0, 1, 1, 1, knee);   // status pip
  K.add(rbox(0.27, 0.09, 0.12, 0.03), M.black, 0.05, -0.43, 0, 0, 0, 0, 1, 1, 1, knee);         // boot sole
  K.add(rbox(0.2, 0.1, 0.11, 0.035), M.dark, 0.05, -0.37, 0, 0, 0, -0.12, 1, 1, 1, knee);       // boot upper
  K.add(rbox(0.08, 0.05, 0.1, 0.015), plate, 0.13, -0.36, 0, 0, 0, -0.3, 1, 1, 1, knee);        // toe cap
}
function infArm(K, parent, side, plate, under) {
  const sh = K.group('arm' + (side < 0 ? 'L' : 'R'), parent, 0.02, 1.5, side * 0.235);
  K.add(sph(0.075, 12, 8), under, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
  K.add(sph(0.11, 14, 10), plate, 0, 0.03, side * 0.02, 0, 0, 0, 1.05, 0.7, 1, sh);              // pauldron
  K.add(cap(0.055, 0.2, 10), under, 0.02, -0.13, 0, 0, 0, 0.15, 1, 1, 1, sh);                    // upper arm
  K.add(rbox(0.05, 0.16, 0.09, 0.015), plate, 0.04, -0.13, side * 0.04, 0, 0, 0.15, 1, 1, 1, sh);
  const el = K.group('elbow' + (side < 0 ? 'L' : 'R'), sh, 0.04, -0.27, 0);
  K.add(sph(0.05, 10, 8), under, 0, 0, 0, 0, 0, 0, 1, 1, 1, el);
  K.add(cap(0.05, 0.2, 10), under, 0.13, 0, 0, 0, 0, -Math.PI / 2, 1, 1, 1, el);                 // forearm, forward
  K.add(rbox(0.18, 0.07, 0.08, 0.02), plate, 0.13, 0.03, 0, 0, 0, 0, 1, 1, 1, el);               // bracer
  K.add(rbox(0.07, 0.07, 0.07, 0.02), M.black, 0.27, 0, 0, 0, 0, 0, 1, 1, 1, el);                // glove
  return el;
}
export function infiltrator(color = 0x3d4a5c, accent = 0x6fe3ff) {
  const g = make('inf' + color, () => {
    const K = new Kit();
    const plate = paint(0xc9ced6, 0.3, 0.45), body = paint(color, 0.36, 0.5), under = cloth(0x23262c, 0.8), gun = paint(0x2b2e34, 0.32, 0.8);
    const lower = K.group('lower');
    K.add(rbox(0.22, 0.17, 0.32, 0.05), body, 0, 0.98, 0, 0, 0, 0, 1, 1, 1, lower);              // pelvis
    K.add(rbox(0.25, 0.05, 0.35, 0.015), M.frame, 0, 1.06, 0, 0, 0, 0, 1, 1, 1, lower);          // belt
    K.add(rbox(0.05, 0.04, 0.1, 0.01), M.chrome, 0.125, 1.06, 0, 0, 0, 0, 1, 1, 1, lower);       // buckle
    K.add(box(0.006, 0.016, 0.07), glow(accent, 3), 0.152, 1.06, 0, 0, 0, 0, 1, 1, 1, lower);
    for (const s of [-1, 1]) { K.add(rbox(0.08, 0.1, 0.06, 0.015), cloth(0x30352e), -0.06, 1.0, s * 0.17, 0, 0, 0, 1, 1, 1, lower); K.add(rbox(0.13, 0.16, 0.03, 0.012), plate, 0.02, 0.92, s * 0.17, 0, 0, s * 0.06, 1, 1, 1, lower); }
    infLeg(K, lower, -1, plate, under); infLeg(K, lower, 1, plate, under);
    const upper = K.group('upper', K.root, 0, 0, 0);
    // abdomen: ribbed undersuit, then the chest rig
    for (let i = 0; i < 3; i++) K.add(cyl(0.125 - i * 0.004, 0.13 - i * 0.004, 0.06, 16), under, 0, 1.12 + i * 0.065, 0, 0, 0, 0, 0.9, 1, 1.25, upper);
    K.add(rbox(0.26, 0.34, 0.42, 0.07), body, 0.01, 1.4, 0, 0, 0, 0, 1, 1, 1, upper);               // chest
    K.add(rbox(0.06, 0.24, 0.3, 0.03), plate, 0.13, 1.42, 0, 0, 0, 0.06, 1, 1, 1, upper);           // breast plate
    for (const s of [-1, 1]) K.add(rbox(0.05, 0.16, 0.12, 0.02), plate, 0.12, 1.33, s * 0.15, 0, s * 0.25, 0.04, 1, 1, 1, upper);
    K.add(rbox(0.012, 0.03, 0.16, 0.008), glow(accent, 3.5), 0.163, 1.5, 0, 0, 0, 0, 1, 1, 1, upper);   // chest status bar
    for (let i = 0; i < 3; i++) K.add(rbox(0.05, 0.07, 0.07, 0.015), cloth(0x30352e), 0.13, 1.25, -0.11 + i * 0.11, 0, 0, 0, 1, 1, 1, upper); // pouches
    K.add(tor(0.11, 0.028, 18, 8), M.frame, 0.01, 1.6, 0, Math.PI / 2, 0, 0, 1, 1, 1, upper);       // collar ring
    // power cell on the back: a slim pack with a glowing window and cooling fins
    K.add(rbox(0.12, 0.36, 0.28, 0.035), M.dark, -0.18, 1.4, 0, 0, 0, 0, 1, 1, 1, upper);
    K.mesh(rbox(0.015, 0.22, 0.06, 0.006), glow(accent, 3), 'cell', -0.243, 1.42, 0, 0, 0, 0, upper);
    for (let i = 0; i < 5; i++) K.add(box(0.035, 0.012, 0.24), M.frame, -0.25, 1.28 + i * 0.03, 0, 0, 0, 0, 1, 1, 1, upper);
    for (const s of [-1, 1]) K.add(cyl(0.025, 0.025, 0.3, 8), M.steel, -0.21, 1.42, s * 0.15, 0, 0, 0, 1, 1, 1, upper);
    K.rod(M.rubber, -0.2, 1.55, -0.1, 0.0, 1.62, -0.13, 0.012, upper, 6);
    // head: neck seal, helmet shell, split visor, jaw filter, a small sensor fin
    const head = K.group('head', upper, 0.02, 1.7, 0);
    K.add(cyl(0.06, 0.07, 0.08, 12), under, 0, -0.06, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(lathe('ihelm', [[0, -0.12], [0.1, -0.12], [0.135, -0.05], [0.14, 0.03], [0.12, 0.1], [0.07, 0.145], [0, 0.155]], 24), body, 0, 0, 0, 0, 0, 0, 1.06, 1, 0.95, head);
    K.add(sph(0.12, 20, 12), M.glass, 0.055, 0.0, 0, 0, 0, 0, 0.75, 0.48, 0.92, head);
    K.mesh(rbox(0.02, 0.022, 0.085, 0.008), glow(accent, 4.5), 'visorL', 0.135, 0.01, -0.05, 0, -0.25, 0, head);
    K.mesh(rbox(0.02, 0.022, 0.085, 0.008), glow(accent, 4.5), 'visorR', 0.135, 0.01, 0.05, 0, 0.25, 0, head);
    K.add(rbox(0.07, 0.07, 0.1, 0.025), plate, 0.1, -0.07, 0, 0, 0, 0.3, 1, 1, 1, head);             // jaw filter
    for (const s of [-1, 1]) K.add(cyl(0.022, 0.022, 0.02, 10), M.black, 0.115, -0.08, s * 0.035, Math.PI / 2, 0, 0, 1, 1, 1, head);
    K.add(rbox(0.16, 0.03, 0.02, 0.008), plate, -0.02, 0.14, 0, 0, 0, -0.2, 1, 1, 1, head);           // crest
    for (const s of [-1, 1]) K.add(cyl(0.035, 0.035, 0.03, 12), M.frame, 0.0, 0.0, s * 0.135, Math.PI / 2, 0, 0, 1, 1, 1, head);  // ear pods
    K.add(cyl(0.006, 0.006, 0.16, 4), M.steel, -0.05, 0.12, -0.12, 0.25, 0, 0.3, 1, 1, 1, head);
    K.add(sph(0.012, 6, 4), glow(0xff5a4a, 5), -0.07, 0.2, -0.14, 0, 0, 0, 1, 1, 1, head);
    // arms in a two-handed carbine hold
    infArm(K, upper, -1, plate, under);
    infArm(K, upper, 1, plate, under);
    const gunG = K.group('gun', upper, 0.3, 1.24, 0.06);
    K.add(rbox(0.36, 0.1, 0.07, 0.02), gun, 0.1, 0, 0, 0, 0, 0, 1, 1, 1, gunG);                     // receiver
    K.add(rbox(0.16, 0.08, 0.05, 0.015), M.dark, -0.14, 0.0, 0, 0, 0, 0.08, 1, 1, 1, gunG);         // stock
    K.add(rbox(0.05, 0.12, 0.045, 0.012), M.black, 0.07, -0.09, 0, 0, 0, 0.2, 1, 1, 1, gunG);        // grip cell
    K.add(cyl(0.024, 0.026, 0.32, 12), M.black, 0.42, 0.01, 0, 0, 0, Math.PI / 2, 1, 1, 1, gunG);     // barrel
    for (let i = 0; i < 3; i++) K.add(tor(0.034, 0.008, 14, 6), M.chrome, 0.32 + i * 0.07, 0.01, 0, 0, Math.PI / 2, 0, 1, 1, 1, gunG);
    K.add(rbox(0.12, 0.03, 0.05, 0.01), glow(accent, 2.6), 0.12, 0.065, 0, 0, 0, 0, 1, 1, 1, gunG);    // charge strip
    K.add(cyl(0.03, 0.03, 0.08, 12), M.dark, 0.3, -0.05, -0.04, 0, 0, Math.PI / 2, 1, 1, 1, gunG);    // flashlight body
    K.mesh(cyl(0.028, 0.028, 0.01, 12), glow(0xfff4dc, 7), 'lamp', 0.345, -0.05, -0.04, 0, 0, Math.PI / 2, gunG);
    K.mesh(cyl(0.03, 0.03, 0.02, 12), glow(accent, 5), 'muzzle', 0.585, 0.01, 0, 0, 0, Math.PI / 2, gunG);
    K.rod(M.rubber, -0.18, 1.35, 0.12, 0.25, 1.22, 0.06, 0.01, upper, 6);
    return K.build();
  });
  return { g, lower: by(g, 'lower'), upper: by(g, 'upper'), head: by(g, 'head'), gun: by(g, 'gun'), lamp: by(g, 'lamp'), muzzle: by(g, 'muzzle'), cell: by(g, 'cell'),
    L: { hip: by(g, 'hipL'), knee: by(g, 'kneeL'), arm: by(g, 'armL'), elbow: by(g, 'elbowL') }, R: { hip: by(g, 'hipR'), knee: by(g, 'kneeR'), arm: by(g, 'armR'), elbow: by(g, 'elbowR') } };
}

// ------------------------------------------------------------------ security robots
// every robot: 'body' (bob/tilt), 'eye' (glows up while it aims), optional legs/wheel/head/shield/tube
const EYE = 0xff4a2a;
function legPair(K, parent, y, z, len, shell, joint) {
  for (const s of [-1, 1]) {
    const hip = K.group('leg' + (s < 0 ? 'L' : 'R'), parent, 0, y, s * z);
    K.add(sph(0.08, 12, 8), joint, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
    K.add(rbox(0.12, len * 0.55, 0.11, 0.03), shell, 0.04, -len * 0.25, 0, 0, 0, -0.35, 1, 1, 1, hip);   // thigh, angled forward
    K.add(sph(0.06, 10, 8), joint, 0.13, -len * 0.5, 0, 0, 0, 0, 1, 1, 1, hip);
    K.rod(M.dark, 0.13, -len * 0.5, 0, -0.02, -len * 0.92, 0, 0.04, hip);                                   // reverse shin
    K.rod(M.chrome, 0.06, -len * 0.3, s * 0.05, 0.0, -len * 0.8, s * 0.05, 0.012, hip);
    K.add(rbox(0.24, 0.05, 0.14, 0.02), M.black, 0.03, -len * 0.97, 0, 0, 0, 0, 1, 1, 1, hip);              // foot
    for (const t of [-1, 1]) K.add(cone(0.025, 0.07, 6), M.steel, 0.16, -len * 0.98, t * 0.05, 0, 0, -Math.PI / 2, 1, 1, 1, hip);
  }
}
export function sentry() {
  const g = make('sentry', () => {
    const K = new Kit();
    K.noShadow = 'leg';
    const shell = paint(0xd8dde2, 0.32, 0.35), trim = paint(0xe0782a, 0.4, 0.4);
    const body = K.group('body', K.root, 0, 0.82, 0);
    K.add(lathe('sentryb', [[0, -0.22], [0.22, -0.2], [0.3, -0.08], [0.31, 0.06], [0.26, 0.2], [0.14, 0.28], [0, 0.3]], 24), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1.1, body);
    K.add(tor(0.3, 0.025, 28, 8), M.frame, 0, -0.05, 0, Math.PI / 2, 0, 0, 1, 1, 1.1, body);
    K.add(cyl(0.31, 0.31, 0.06, 28, 1), M.stripes, 0, -0.12, 0, 0, 0, 0, 1, 1, 1.1, body);
    // visor band: a dark glass slot with the eye bar behind it
    K.add(rbox(0.12, 0.08, 0.42, 0.03), M.glass, 0.24, 0.1, 0, 0, 0, -0.2, 1, 1, 1, body);
    K.mesh(rbox(0.03, 0.035, 0.3, 0.01), glow(EYE, 4), 'eye', 0.29, 0.1, 0, 0, 0, -0.2, body);
    K.add(rbox(0.16, 0.04, 0.2, 0.015), trim, 0.05, 0.27, 0, 0, 0, 0, 1, 1, 1, body);            // head plate
    for (const s of [-1, 1]) { K.add(rbox(0.08, 0.14, 0.05, 0.02), M.dark, -0.05, -0.02, s * 0.33, 0, 0, 0, 1, 1, 1, body); K.add(sph(0.025, 8, 6), glow(0xffb347, 3), -0.02, 0.06, s * 0.36, 0, 0, 0, 1, 1, 1, body); }
    // shoulder blaster on the right
    const gun = K.group('gun', body, 0.05, 0.05, 0.38);
    K.add(rbox(0.3, 0.1, 0.1, 0.03), M.dark, 0.1, 0, 0, 0, 0, 0, 1, 1, 1, gun);
    K.add(cyl(0.03, 0.035, 0.25, 10), M.black, 0.33, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, gun);
    K.add(tor(0.04, 0.01, 12, 6), M.chrome, 0.38, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, gun);
    K.mesh(cyl(0.03, 0.03, 0.02, 10), glow(EYE, 4), 'muzzle', 0.46, 0, 0, 0, 0, Math.PI / 2, gun);
    K.add(rbox(0.22, 0.12, 0.1, 0.03), M.frame, -0.12, -0.18, 0, 0, 0, 0, 1, 1, 1, body);       // back pack
    K.add(cyl(0.01, 0.01, 0.2, 4), M.steel, -0.1, 0.34, -0.1, 0.2, 0, 0.2, 1, 1, 1, body);
    bolts(K, M.steel, Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return [Math.cos(a) * 0.31, -0.12, Math.sin(a) * 0.34, 0, -a, Math.PI / 2]; }), 0.015, body);
    legPair(K, K.root, 0.62, 0.17, 0.62, shell, M.frame);
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), gun: by(g, 'gun'), legs: [by(g, 'legL'), by(g, 'legR')] };
}
export function patroller() {
  const g = make('patroller', () => {
    const K = new Kit();
    const shell = paint(0x2a3d66, 0.34, 0.55), trim = paint(0xd8dde2, 0.3, 0.4);
    // a gyro-balanced ball wheel with a mast head on top
    const wheel = K.group('wheel', K.root, 0, 0.32, 0);
    K.add(sph(0.3, 22, 16), M.rubber, 0, 0, 0, 0, 0, 0, 1, 1, 1, wheel);
    for (let i = 0; i < 6; i++) K.add(tor(0.3, 0.012, 28, 4), M.frame, 0, 0, 0, 0, (i / 6) * Math.PI, 0, 1, 1, 1, wheel);
    const body = K.group('body', K.root, 0, 0.32, 0);
    K.add(tor(0.33, 0.06, 28, 10), shell, 0, 0.05, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);         // fork ring
    for (const s of [-1, 1]) K.add(rbox(0.12, 0.42, 0.06, 0.02), shell, 0, 0.25, s * 0.33, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.42, 0.24, 0.5, 0.06), shell, 0, 0.55, 0, 0, 0, 0, 1, 1, 1, body);              // chassis
    K.add(rbox(0.43, 0.04, 0.51, 0.015), M.stripes, 0, 0.45, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 4; i++) K.add(box(0.012, 0.12, 0.36), M.black, -0.215, 0.55, 0, 0, 0, 0, 1, 1, 1, body);
    for (const s of [-1, 1]) { K.add(cyl(0.035, 0.035, 0.3, 10), M.black, 0.24, 0.5, s * 0.18, 0, 0, Math.PI / 2, 1, 1, 1, body); K.mesh(cyl(0.03, 0.03, 0.02, 10), glow(0x6fd8ff, 4), 'muzzle' + (s < 0 ? 'L' : 'R'), 0.4, 0.5, s * 0.18, 0, 0, Math.PI / 2, body); }
    const head = K.group('head', body, 0, 0.67, 0);
    K.rod(M.steel, 0, 0, 0, 0, 0.32, 0, 0.03, head);
    K.add(rbox(0.2, 0.14, 0.32, 0.04), trim, 0.02, 0.38, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(rbox(0.05, 0.08, 0.26, 0.02), M.glass, 0.12, 0.38, 0, 0, 0, 0, 1, 1, 1, head);
    K.mesh(rbox(0.02, 0.03, 0.2, 0.01), glow(0x6fd8ff, 4.5), 'eye', 0.145, 0.38, 0, 0, 0, 0, head);
    K.add(cyl(0.006, 0.006, 0.24, 4), M.steel, -0.04, 0.55, 0.1, 0, 0, 0, 1, 1, 1, head);
    K.add(sph(0.016, 6, 4), glow(EYE, 5), -0.04, 0.68, 0.1, 0, 0, 0, 1, 1, 1, head);
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), head: by(g, 'head'), wheel: by(g, 'wheel') };
}
export function marksman() {
  const g = make('marksman', () => {
    const K = new Kit();
    K.noShadow = 'tri';
    const shell = paint(0x3b3f46, 0.3, 0.75), trim = paint(0x9aa3ad, 0.3, 0.7);
    const body = K.group('body', K.root, 0, 1.25, 0);
    K.add(rbox(0.34, 0.3, 0.3, 0.06), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.36, 0.04, 0.32, 0.015), trim, 0, -0.1, 0, 0, 0, 0, 1, 1, 1, body);
    // the long rail rifle and its scope eye
    const head = K.group('head', body, 0.05, 0.22, 0);
    K.add(sph(0.13, 18, 12), shell, 0, 0, 0, 0, 0, 0, 1, 0.8, 1, head);
    K.add(cyl(0.085, 0.085, 0.1, 18), M.frame, 0.14, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, head);
    K.add(cyl(0.07, 0.07, 0.01, 18), M.glass, 0.19, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, head);
    K.mesh(sph(0.04, 12, 8), glow(EYE, 5), 'eye', 0.18, 0, 0, 0, 0, 0, head);
    const gun = K.group('gun', body, 0.1, 0.0, 0);
    for (const s of [-1, 1]) K.add(rbox(0.9, 0.025, 0.03, 0.008), M.steel, 0.5, s * 0.03, 0, 0, 0, 0, 1, 1, 1, gun);   // twin rails
    for (let i = 0; i < 5; i++) K.add(rbox(0.03, 0.1, 0.07, 0.01), M.frame, 0.16 + i * 0.18, 0, 0, 0, 0, 0, 1, 1, 1, gun);
    for (let i = 0; i < 4; i++) K.add(box(0.12, 0.012, 0.012), glow(0xff6a4a, 2.5), 0.25 + i * 0.18, 0, 0, 0, 0, 0, 1, 1, 1, gun);
    K.mesh(cyl(0.03, 0.03, 0.02, 10), glow(EYE, 4), 'muzzle', 0.96, 0, 0, 0, 0, Math.PI / 2, gun);
    K.add(rbox(0.2, 0.16, 0.12, 0.03), M.dark, -0.22, 0.02, 0, 0, 0, 0, 1, 1, 1, body);          // counterweight
    K.add(cyl(0.05, 0.05, 0.14, 12), M.copper, -0.3, 0.08, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    // tripod
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Math.PI / 3, c = Math.cos(a), s = Math.sin(a);
      const L = K.group('tri' + i, K.root, c * 0.1, 1.12, s * 0.1);
      K.add(sph(0.05, 10, 8), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, L);
      K.rod(shell, 0, 0, 0, c * 0.32, -0.55, s * 0.32, 0.04, L);
      K.add(sph(0.04, 8, 6), M.frame, c * 0.32, -0.55, s * 0.32, 0, 0, 0, 1, 1, 1, L);
      K.rod(M.steel, c * 0.32, -0.55, s * 0.32, c * 0.42, -1.1, s * 0.42, 0.028, L);
      K.add(cyl(0.06, 0.07, 0.03, 10), M.black, c * 0.42, -1.1, s * 0.42, 0, 0, 0, 1, 1, 1, L);
    }
    // armoured housing: a hood over the rails, side plates, cooling fins, an ammo drum and a sensor mast
    K.add(rbox(0.6, 0.05, 0.17, 0.02), shell, 0.45, 0.075, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.3, 0.012, 0.04, 0.005), glow(0xff6a4a, 2.2), 0.45, 0.103, 0, 0, 0, 0, 1, 1, 1, body);
    for (const sd of [-1, 1]) { K.add(rbox(0.3, 0.26, 0.05, 0.02), trim, 0, 0, sd * 0.18, 0, sd * 0.12, 0, 1, 1, 1, body); K.add(rbox(0.16, 0.02, 0.012, 0.005), glow(0xff6a4a, 2.5), 0.02, 0.06, sd * 0.207, 0, sd * 0.12, 0, 1, 1, 1, body); }
    for (let i = 0; i < 4; i++) K.add(box(0.025, 0.07, 0.28), M.frame, -0.12 + i * 0.065, 0.18, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.09, 0.09, 0.1, 16), M.dark, 0.06, -0.13, 0.19, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.04, 0.04, 0.11, 12), M.brass, 0.06, -0.13, 0.19, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.006, 0.006, 0.34, 4), M.steel, -0.2, 0.32, 0.12, 0, 0, 0, 1, 1, 1, body);
    K.add(sph(0.016, 6, 4), glow(EYE, 5), -0.2, 0.5, 0.12, 0, 0, 0, 1, 1, 1, body);
    bolts(K, M.steel, [[0.12, 0.08, 0.205, Math.PI / 2, 0, 0], [-0.12, 0.08, 0.205, Math.PI / 2, 0, 0], [0.12, 0.08, -0.205, Math.PI / 2, 0, 0], [-0.12, 0.08, -0.205, Math.PI / 2, 0, 0]], 0.014, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), head: by(g, 'head'), gun: by(g, 'gun'), legs: [by(g, 'tri0'), by(g, 'tri1'), by(g, 'tri2')] };
}
export function aegis() {
  const g = make('aegis', () => {
    const K = new Kit();
    K.noShadow = 'leg';
    const shell = paint(0x5a6248, 0.42, 0.5), deep = paint(0x3a3f2e, 0.45, 0.5);
    const body = K.group('body', K.root, 0, 0.95, 0);
    K.add(rbox(0.5, 0.56, 0.62, 0.09), shell, -0.05, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.3, 0.12, 0.4, 0.04), deep, -0.05, 0.33, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.12, 0.08, 0.3, 0.03), M.glass, 0.12, 0.3, 0, 0, 0, -0.3, 1, 1, 1, body);
    K.mesh(rbox(0.03, 0.03, 0.22, 0.01), glow(EYE, 4), 'eye', 0.16, 0.31, 0, 0, 0, -0.3, body);
    for (const s of [-1, 1]) K.add(cyl(0.1, 0.1, 0.12, 16), M.frame, -0.05, 0.05, s * 0.36, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.035, 0.04, 0.3, 10), M.black, 0.2, 0.0, 0.22, 0, 0, Math.PI / 2, 1, 1, 1, body);  // gun under the shield arm
    K.mesh(cyl(0.035, 0.035, 0.02, 10), glow(EYE, 4), 'muzzle', 0.36, 0.0, 0.22, 0, 0, Math.PI / 2, body);
    K.add(rbox(0.26, 0.3, 0.3, 0.05), deep, -0.36, 0.0, 0, 0, 0, 0, 1, 1, 1, body);             // generator
    K.add(tor(0.1, 0.02, 16, 6), glow(0xffd23f, 2.5), -0.5, 0.0, 0, 0, Math.PI / 2, 0, 1, 1, 1, body);
    // the tower shield: a curved slab with a glowing edge, held in front
    const sh = K.group('shield', K.root, 0.42, 0.85, 0);
    for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.24; K.add(rbox(0.07, 1.1, 0.26, 0.02), M.steel, Math.cos(a) * 0.12 - 0.12, 0, Math.sin(a) * 0.55, 0, -a, 0, 1, 1, 1, sh); }
    K.add(rbox(0.04, 1.12, 0.02, 0.008), glow(0xffd23f, 3), 0.01, 0, -0.56, 0, 0.5, 0, 1, 1, 1, sh);
    K.add(rbox(0.04, 1.12, 0.02, 0.008), glow(0xffd23f, 3), 0.01, 0, 0.56, 0, -0.5, 0, 1, 1, 1, sh);
    K.add(rbox(0.05, 0.06, 1.0, 0.01), M.stripes, 0.02, 0.5, 0, 0, 0, 0, 1, 1, 1, sh);
    K.mesh(rbox(0.02, 0.9, 1.02, 0.01), glow(0xffd23f, 0.6), 'field', 0.06, 0, 0, 0, 0, 0, sh);
    for (const s of [-1, 1]) for (const y of [-0.4, 0.4]) K.add(cyl(0.025, 0.025, 0.03, 8), M.chrome, 0.03, y, s * 0.3, 0, 0, Math.PI / 2, 1, 1, 1, sh);
    legPair(K, K.root, 0.62, 0.22, 0.62, shell, M.frame);
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), shield: by(g, 'shield'), field: by(g, 'field'), legs: [by(g, 'legL'), by(g, 'legR')] };
}
export function mortar() {
  const g = make('mortar', () => {
    const K = new Kit();
    K.noShadow = 'leg';
    const shell = paint(0xa4532a, 0.45, 0.45), deep = paint(0x5a2f1a, 0.5, 0.4);
    const body = K.group('body', K.root, 0, 0.55, 0);
    K.add(lathe('mortb', [[0, -0.16], [0.3, -0.14], [0.42, -0.04], [0.42, 0.06], [0.32, 0.16], [0, 0.18]], 24), shell, 0, 0, 0, 0, 0, 0, 1.15, 1, 1, body);
    for (let i = 0; i < 3; i++) K.add(rbox(0.5 - i * 0.08, 0.04, 0.12, 0.015), deep, -0.05, 0.17, -0.2 + i * 0.2, 0, 0, 0, 1, 1, 1, body);
    K.mesh(sph(0.06, 10, 8), glow(EYE, 5), 'eye', 0.44, 0.02, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) K.add(sph(0.03, 8, 6), glow(EYE, 3.5), 0.42, 0.06, s * 0.09, 0, 0, 0, 1, 1, 1, body);
    // the launch tube on a trunnion: the renderer pitches it while it aims
    const tube = K.group('tube', body, -0.05, 0.2, 0);
    for (const s of [-1, 1]) K.add(cyl(0.07, 0.07, 0.06, 14), M.frame, 0, 0, s * 0.17, Math.PI / 2, 0, 0, 1, 1, 1, tube);
    K.add(cyl(0.13, 0.15, 0.62, 20), M.dark, 0, 0.26, 0, 0, 0, 0, 1, 1, 1, tube);
    K.add(tor(0.14, 0.02, 20, 6), M.chrome, 0, 0.56, 0, Math.PI / 2, 0, 0, 1, 1, 1, tube);
    K.add(tor(0.15, 0.015, 20, 6), M.chrome, 0, 0.12, 0, Math.PI / 2, 0, 0, 1, 1, 1, tube);
    K.mesh(cyl(0.1, 0.1, 0.02, 16), glow(0xff8a2a, 3), 'muzzle', 0, 0.57, 0, 0, 0, 0, tube);
    K.add(rbox(0.16, 0.2, 0.28, 0.03), deep, -0.32, 0.1, 0, 0, 0, 0, 1, 1, 1, body);           // shell magazine
    for (let i = 0; i < 3; i++) K.add(cyl(0.04, 0.04, 0.22, 10), M.brass, -0.32, 0.22, -0.08 + i * 0.08, 0, 0, 0, 1, 1, 1, body);
    // four crab legs
    [[0.25, 0.32], [-0.25, 0.32], [0.25, -0.32], [-0.25, -0.32]].forEach(([x, z], i) => {
      const s = Math.sign(z), hip = K.group('leg' + i, K.root, x, 0.55, z);
      K.add(sph(0.06, 10, 8), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(shell, 0, 0, 0, 0, 0.18, s * 0.35, 0.045, hip);
      K.add(sph(0.05, 8, 6), M.frame, 0, 0.18, s * 0.35, 0, 0, 0, 1, 1, 1, hip);
      K.rod(M.steel, 0, 0.18, s * 0.35, 0, -0.53, s * 0.48, 0.032, hip);
      K.add(cone(0.04, 0.1, 6), M.black, 0, -0.56, s * 0.49, Math.PI, 0, 0, 1, 1, 1, hip);
    });
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), tube: by(g, 'tube'), legs: all(g, 'leg') };
}
export function ripper() {
  const g = make('ripper', () => {
    const K = new Kit();
    K.noShadow = 'leg';
    const shell = paint(0x1b1c20, 0.3, 0.8), edge = paint(0x8a1a1a, 0.35, 0.6);
    const body = K.group('body', K.root, 0, 0.5, 0);
    K.add(lathe('ripb', [[0, -0.12], [0.16, -0.1], [0.22, -0.02], [0.2, 0.08], [0.1, 0.13], [0, 0.14]], 18), shell, 0, 0, 0, 0, 0, 0, 2.0, 1, 1, body);
    for (let i = 0; i < 4; i++) K.add(rbox(0.1, 0.03, 0.26 - i * 0.03, 0.01), edge, -0.25 + i * 0.12, 0.13, 0, 0, 0, 0.15, 1, 1, 1, body);   // spine plates
    K.add(rbox(0.16, 0.1, 0.16, 0.03), M.dark, 0.4, 0.02, 0, 0, 0, 0, 1, 1, 1, body);
    K.mesh(rbox(0.02, 0.025, 0.12, 0.008), glow(EYE, 6), 'eye', 0.485, 0.04, 0, 0, 0, 0, body);
    // twin blade arms that sweep forward on a lunge
    for (const s of [-1, 1]) {
      const bl = K.group('blade' + (s < 0 ? 'L' : 'R'), body, 0.3, 0.0, s * 0.14);
      K.add(sph(0.045, 8, 6), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, bl);
      K.add(rbox(0.3, 0.025, 0.05, 0.008), M.chrome, 0.18, -0.03, s * 0.04, 0, s * 0.25, -0.25, 1, 1, 1, bl);
      K.add(rbox(0.26, 0.008, 0.02, 0.003), glow(0xff3a2a, 3), 0.18, -0.045, s * 0.07, 0, s * 0.25, -0.25, 1, 1, 1, bl);
    }
    for (let i = 0; i < 3; i++) K.add(rbox(0.24, 0.05, 0.4 - i * 0.07, 0.02), shell, 0.16 - i * 0.19, 0.15, 0, 0, 0, 0.12, 1, 1, 1, body);   // carapace
    for (let i = 0; i < 4; i++) K.add(cone(0.032, 0.18, 5), M.chrome, -0.26 + i * 0.15, 0.24, 0, 0, 0, -0.5, 1, 1, 1, body);                    // dorsal spikes
    for (const sd of [-1, 1]) {
      K.add(box(0.26, 0.02, 0.012), glow(0xff3a2a, 3), 0.0, 0.03, sd * 0.225, 0, 0, 0, 1, 1, 1, body);                                       // vents
      K.add(cone(0.022, 0.16, 5), M.chrome, 0.52, -0.02, sd * 0.06, 0, sd * 0.3, -Math.PI / 2, 1, 1, 1, body);                               // mandibles
      K.add(rbox(0.2, 0.08, 0.05, 0.02), edge, 0.1, 0.05, sd * 0.2, 0, 0, 0, 1, 1, 1, body);
    }
    K.add(cyl(0.012, 0.012, 0.4, 4), M.steel, -0.35, 0.1, 0, 0, 0, 1.0, 1, 1, 1, body);        // tail
    K.add(sph(0.018, 6, 4), glow(EYE, 5), -0.52, 0.22, 0, 0, 0, 0, 1, 1, 1, body);
    [[0.18, 0.2], [-0.18, 0.2], [0.18, -0.2], [-0.18, -0.2]].forEach(([x, z], i) => {
      const s = Math.sign(z), hip = K.group('leg' + i, K.root, x, 0.5, z);
      K.add(sph(0.04, 8, 6), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.rod(shell, 0, 0, 0, Math.sign(x) * 0.08, 0.14, s * 0.26, 0.03, hip);
      K.rod(M.steel, Math.sign(x) * 0.08, 0.14, s * 0.26, Math.sign(x) * 0.12, -0.48, s * 0.34, 0.022, hip);
      K.add(cone(0.025, 0.08, 6), M.chrome, Math.sign(x) * 0.12, -0.5, s * 0.34, Math.PI, 0, 0, 1, 1, 1, hip);
    });
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), blades: [by(g, 'bladeL'), by(g, 'bladeR')], legs: all(g, 'leg') };
}
export function twin() {
  const g = make('twin', () => {
    const K = new Kit();
    const shell = paint(0x2f8a8a, 0.3, 0.6), trim = paint(0xd8dde2, 0.3, 0.4);
    const body = K.group('body', K.root, 0, 0.95, 0);
    K.add(sph(0.3, 24, 16), shell, 0, 0, 0, 0, 0, 0, 1, 0.9, 1, body);
    K.add(tor(0.3, 0.03, 28, 8), trim, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(cyl(0.16, 0.16, 0.06, 20), M.frame, 0.26, 0.02, 0, 0, 0, Math.PI / 2, 1, 1, 1, body);
    K.add(cyl(0.13, 0.13, 0.01, 20), M.glass, 0.3, 0.02, 0, 0, 0, Math.PI / 2, 1, 1, 1, body);
    K.mesh(sph(0.07, 14, 10), glow(0x7dfff0, 4.5), 'eye', 0.29, 0.02, 0, 0, 0, 0, body);
    for (const s of [-1, 1]) {
      K.add(cyl(0.035, 0.035, 0.3, 10), M.black, 0.15, -0.16, s * 0.2, 0, 0, Math.PI / 2, 1, 1, 1, body);
      K.add(cyl(0.08, 0.06, 0.12, 12), M.dark, -0.12, -0.22, s * 0.18, 0, 0, 0, 1, 1, 1, body);   // thruster pods
      K.add(cyl(0.05, 0.05, 0.01, 12), glow(0x7dfff0, 3), -0.12, -0.285, s * 0.18, 0, 0, 0, 1, 1, 1, body);
    }
    K.mesh(tor(0.38, 0.012, 32, 6), glow(0x7dfff0, 2.2), 'ring', 0, 0, 0, Math.PI / 2, 0, 0, body);
    K.add(cyl(0.008, 0.008, 0.25, 4), M.steel, -0.1, 0.33, 0, 0, 0, -0.3, 1, 1, 1, body);
    K.add(cyl(0.18, 0.24, 0.04, 20), M.dark, 0, -0.9, 0, 0, 0, 0);                              // hover shadow plate (floor)
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), ring: by(g, 'ring') };
}
export function drone() {
  const g = make('drone', () => {
    const K = new Kit();
    const shell = paint(0xcfe6f2, 0.25, 0.5);
    const body = K.group('body', K.root, 0, 1.4, 0);
    K.add(lathe('cdrone', [[0, -0.09], [0.14, -0.08], [0.2, -0.02], [0.18, 0.04], [0.1, 0.09], [0, 0.1]], 18), shell, 0, 0, 0, 0, 0, 0, 1.1, 1, 1, body);
    K.mesh(sph(0.05, 10, 8), glow(0x7fd8ff, 5), 'eye', 0.18, -0.02, 0, 0, 0, 0, body);
    K.add(cone(0.06, 0.18, 8), M.chrome, 0.26, -0.03, 0, 0, 0, -Math.PI / 2, 1, 1, 1, body);    // ice spike
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.785, c = Math.cos(a), s = Math.sin(a);
      K.rod(M.frame, c * 0.14, 0, s * 0.14, c * 0.32, 0.02, s * 0.32, 0.016, body, 6);
      K.add(tor(0.12, 0.012, 20, 4), M.steel, c * 0.32, 0.03, s * 0.32, Math.PI / 2, 0, 0, 1, 1, 1, body);
      const rot = K.group('rotor' + i, body, c * 0.32, 0.05, s * 0.32);
      K.add(box(0.22, 0.006, 0.03), M.black, 0, 0, 0, 0, 0, 0, 1, 1, 1, rot);
    }
    K.add(tor(0.17, 0.012, 24, 6), glow(0x7fd8ff, 3), 0, -0.05, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    return K.build();
  });
  return { g, body: by(g, 'body'), eye: by(g, 'eye'), rotors: all(g, 'rotor') };
}
export const ROBOT_MODELS = { sentry, patroller, marksman, aegis, mortar, ripper, twin, drone };

// ------------------------------------------------------------------ the Seeker
// a faceted dark orb with one red iris, a cage of rings and fins; tendrils are drawn as arcs by the renderer
export function seeker() {
  const g = make('seeker', () => {
    const K = new Kit();
    const core = K.group('core', K.root, 0, 1.5, 0);
    const shellG = geo('seekShell', () => { const q = new THREE.IcosahedronGeometry(0.62, 1).toNonIndexed(); q.computeVertexNormals(); return q; });
    const shellM = new THREE.MeshStandardMaterial({ color: 0x1a1c22, metalness: 1, roughness: 0.22, flatShading: true, envMap: M.env, envMapIntensity: 1.6 });
    shellM.userData.cls = null;
    K.mesh(shellG, shellM, 'shell', 0, 0, 0, 0, 0, 0, core);
    const iris = K.group('iris', core, 0, 0, 0);
    K.add(cyl(0.3, 0.3, 0.08, 28), M.black, 0.5, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, iris);
    K.add(tor(0.28, 0.03, 28, 8), M.chrome, 0.54, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, iris);
    K.mesh(sph(0.2, 20, 14), glow(0xff2a1a, 5), 'eye', 0.5, 0, 0, 0, 0, 0, iris);
    K.add(sph(0.08, 12, 8), glow(0xffd0a0, 8), 0.64, 0, 0, 0, 0, 0, 1, 1, 1, iris);
    const halo = K.group('halo', core, 0, 0, 0);
    K.add(tor(0.86, 0.025, 48, 6), M.frame, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, halo);
    K.add(tor(0.86, 0.012, 48, 6), glow(0xff3a2a, 2.5), 0, 0.03, 0, Math.PI / 2, 0, 0, 1, 1, 1, halo);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.add(cone(0.06, 0.26, 4), M.dark, Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95, 0, -a, -Math.PI / 2, 1, 1, 1, halo); }
    const halo2 = K.group('halo2', core, 0, 0, 0);
    K.add(tor(0.74, 0.018, 48, 6), M.steel, 0, 0, 0, 0, 0, 0, 1, 1, 1, halo2);
    return K.build();
  });
  return { g, core: by(g, 'core'), shell: by(g, 'shell'), iris: by(g, 'iris'), eye: by(g, 'eye'), halo: by(g, 'halo'), halo2: by(g, 'halo2') };
}

// ------------------------------------------------------------------ bosses
export function boss(key) {
  const g = make('boss' + key, () => buildBoss(key));
  return { g, key, body: by(g, 'bbody'), eye: by(g, 'eye'), legs: all(g, 'bleg'), fans: all(g, 'fan'), hammer: by(g, 'hammer'), spin: by(g, 'spin'), glows: all(g, 'bglow'), cannon: by(g, 'cannon') };
}
function buildBoss(key) {
  const K = new Kit();
  let gi = 0;
  const glowPart = (geom, color, k, x, y, z, rx = 0, ry = 0, rz = 0, parent = K.root) => K.mesh(geom, glow(color, k), 'bglow' + String(gi++).padStart(2, '0'), x, y, z, rx, ry, rz, parent);
  if (key === 'sentinel') {
    // SENTINEL MK IV: a two-legged security walker, white composite armour, a sensor cluster and shoulder cannons
    const white = paint(0xdfe3e8, 0.3, 0.35), grey = paint(0x5a6270, 0.35, 0.6), orange = paint(0xe0782a, 0.4, 0.4);
    const body = K.group('bbody', K.root, 0, 2.7, 0);
    K.add(rbox(1.5, 1.0, 1.9, 0.18), white, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(1.52, 0.16, 1.92, 0.04), M.stripes, 0, -0.38, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.9, 0.5, 1.2, 0.12), grey, 0.5, 0.45, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.3, 0.32, 1.0, 0.08), M.glass, 0.9, 0.35, 0, 0, 0, -0.3, 1, 1, 1, body);
    K.mesh(rbox(0.06, 0.12, 0.8, 0.02), glow(EYE, 5), 'eye', 1.0, 0.35, 0, 0, 0, -0.3, body);
    for (const s of [-1, 1]) K.add(sph(0.06, 10, 8), glow(0xffb347, 4), 0.95, 0.55, s * 0.4, 0, 0, 0, 1, 1, 1, body);
    const cannon = K.group('cannon', body, 0.1, 0.55, 0);
    for (const s of [-1, 1]) {
      K.add(rbox(0.9, 0.36, 0.42, 0.08), grey, 0.2, 0, s * 1.15, 0, 0, 0, 1, 1, 1, cannon);
      for (const t of [-1, 1]) { K.add(cyl(0.07, 0.08, 0.7, 12), M.black, 0.85, 0, s * 1.15 + t * 0.11, 0, 0, Math.PI / 2, 1, 1, 1, cannon); glowPart(cyl(0.06, 0.06, 0.02, 12), EYE, 4, 1.2, 0, s * 1.15 + t * 0.11, 0, 0, Math.PI / 2, cannon); }
      K.add(rbox(0.5, 0.2, 0.44, 0.05), orange, -0.2, 0.25, s * 1.15, 0, 0, 0, 1, 1, 1, cannon);
      for (let i = 0; i < 3; i++) K.add(cyl(0.06, 0.06, 0.12, 10), M.chrome, -0.3 + i * 0.16, 0.38, s * 1.15, 0, 0, 0, 1, 1, 1, cannon);
    }
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) K.add(box(0.5, 0.04, 0.06), M.black, -0.5, 0.2 - i * 0.12, s * 0.97, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.6, 0.7, 1.0, 0.1), grey, -0.85, 0.1, 0, 0, 0, 0, 1, 1, 1, body);            // power plant
    glowPart(tor(0.24, 0.05, 24, 8), 0x6fe3ff, 3, -1.16, 0.1, 0, 0, Math.PI / 2, 0, body);
    bolts(K, M.steel, Array.from({ length: 10 }, (_, i) => [-0.65 + i * 0.14, -0.3, 0.96, Math.PI / 2, 0, 0]), 0.03, body);
    bolts(K, M.steel, Array.from({ length: 10 }, (_, i) => [-0.65 + i * 0.14, -0.3, -0.96, Math.PI / 2, 0, 0]), 0.03, body);
    for (const s of [-1, 1]) {
      const hip = K.group('bleg' + (s < 0 ? 0 : 1), K.root, 0, 2.3, s * 0.75);
      K.add(sph(0.32, 16, 12), M.frame, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.5, 1.1, 0.42, 0.1), white, 0.15, -0.5, 0, 0, 0, -0.3, 1, 1, 1, hip);
      K.add(sph(0.26, 14, 10), M.frame, 0.32, -1.05, 0, 0, 0, 0, 1, 1, 1, hip);
      K.add(rbox(0.42, 1.1, 0.4, 0.08), grey, 0.12, -1.6, 0, 0, 0, 0.3, 1, 1, 1, hip);
      K.rod(M.chrome, 0.0, -0.3, s * 0.25, 0.25, -1.4, s * 0.25, 0.06, hip);
      K.add(rbox(1.0, 0.24, 0.7, 0.08), M.dark, 0.1, -2.18, 0, 0, 0, 0, 1, 1, 1, hip);
      for (const t of [-1, 1]) K.add(cone(0.1, 0.3, 6), M.steel, 0.62, -2.22, t * 0.25, 0, 0, -Math.PI / 2, 1, 1, 1, hip);
      K.add(rbox(0.44, 0.16, 0.42, 0.04), M.stripes, 0.12, -1.25, 0, 0, 0, 0.3, 1, 1, 1, hip);
    }
  } else if (key === 'carrier') {
    // CRYO CARRIER: a hovering wing with four ducted fans and a drone bay, frosted armour
    const frost = paint(0xd6e8f2, 0.22, 0.45), steel = paint(0x6a7a88, 0.3, 0.8);
    const body = K.group('bbody', K.root, 0, 2.6, 0);
    K.add(lathe('carr', [[0, -0.5], [1.1, -0.45], [1.6, -0.2], [1.7, 0.05], [1.3, 0.35], [0.6, 0.5], [0, 0.55]], 32), frost, 0, 0, 0, 0, 0, 0, 1, 0.8, 1.2, body);
    K.add(tor(1.62, 0.07, 48, 8), steel, 0, -0.08, 0, Math.PI / 2, 0, 0, 1, 1.2, 1, body);
    K.add(rbox(0.7, 0.3, 1.2, 0.1), steel, 1.3, 0.05, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.2, 0.18, 0.9, 0.06), M.glass, 1.62, 0.1, 0, 0, 0, -0.2, 1, 1, 1, body);
    K.mesh(rbox(0.05, 0.08, 0.7, 0.02), glow(0x7fd8ff, 5), 'eye', 1.7, 0.1, 0, 0, 0, -0.2, body);
    glowPart(cyl(0.6, 0.6, 0.06, 32), 0x7fd8ff, 2.2, 0, -0.46, 0, 0, 0, 0, body);              // drone bay
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; K.add(box(0.5, 0.05, 0.08), M.frame, Math.cos(a) * 0.35, -0.47, Math.sin(a) * 0.35, 0, -a, 0, 1, 1, 1, body); }
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; K.add(cone(0.08, 0.5, 5), M.glassT, Math.cos(a) * 1.4, -0.4, Math.sin(a) * 1.6, Math.PI, 0, 0, 1, 1, 1, body); }   // icicles
    [[0.9, 1.3], [-0.9, 1.3], [0.9, -1.3], [-0.9, -1.3]].forEach(([x, z], i) => {
      K.add(tor(0.55, 0.1, 32, 10), steel, x, 0, z, Math.PI / 2, 0, 0, 1, 1, 1, body);
      K.add(cyl(0.12, 0.12, 0.3, 12), M.frame, x, 0, z, 0, 0, 0, 1, 1, 1, body);
      const fan = K.group('fan' + i, body, x, 0.02, z);
      for (let b = 0; b < 5; b++) K.add(rbox(0.5, 0.02, 0.12, 0.01), M.dark, 0.25, 0, 0, 0.3, (b / 5) * Math.PI * 2, 0, 1, 1, 1, fan);
      glowPart(tor(0.5, 0.02, 32, 4), 0x7fd8ff, 2.5, x, -0.08, z, Math.PI / 2, 0, 0, body);
    });
    // upper deck: cryo tanks in cradles, radial ribs, an antenna array and nav lights
    K.add(rbox(1.5, 0.14, 1.1, 0.05), steel, -0.25, 0.46, 0, 0, 0, 0, 1, 1, 1, body);
    for (const sd of [-1, 1]) {
      K.add(cap(0.2, 0.8, 14), frost, -0.3, 0.68, sd * 0.36, 0, 0, Math.PI / 2, 1, 1, 1, body);
      for (const t of [-0.35, 0, 0.35]) K.add(tor(0.21, 0.025, 18, 6), M.frame, -0.3 + t, 0.68, sd * 0.36, 0, Math.PI / 2, 0, 1, 1, 1, body);
      K.add(box(0.7, 0.02, 0.02), glow(0x7fd8ff, 3), -0.3, 0.89, sd * 0.36, 0, 0, 0, 1, 1, 1, body);
      K.add(sph(0.06, 10, 8), glow(sd < 0 ? 0xff3a2a : 0x5dff8a, 5), 0, 0.05, sd * 2.02, 0, 0, 0, 1, 1, 1, body);
    }
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; K.add(box(0.7, 0.05, 0.07), M.frame, Math.cos(a) * 1.15, 0.36, Math.sin(a) * 1.38, 0, -a, 0.2 * Math.cos(a), 1, 1, 1, body); }
    for (let i = 0; i < 3; i++) { K.add(cyl(0.012, 0.012, 0.6 + i * 0.15, 4), M.steel, -1.0 - i * 0.12, 0.8 + i * 0.07, -0.25 + i * 0.25, 0, 0, 0, 1, 1, 1, body); K.add(sph(0.025, 6, 4), glow(i === 1 ? EYE : 0x7fd8ff, 5), -1.0 - i * 0.12, 1.1 + i * 0.15, -0.25 + i * 0.25, 0, 0, 0, 1, 1, 1, body); }
    K.add(rbox(0.12, 0.2, 1.2, 0.04), glow(0x9fe8ff, 2.6), -1.66, 0.0, 0, 0, 0, 0, 1, 1, 1, body);          // exhaust
  } else if (key === 'crusher') {
    // FURNACE CRUSHER: a tracked press with a hydraulic hammer plate and molten vents
    const iron = paint(0x4a4038, 0.5, 0.7), hot = paint(0x8a3a1a, 0.45, 0.6);
    const body = K.group('bbody', K.root, 0, 1.3, 0);
    K.add(rbox(3.0, 1.4, 2.6, 0.2), iron, -0.2, 0.3, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(3.02, 0.22, 2.62, 0.05), M.stripes, -0.2, -0.3, 0, 0, 0, 0, 1, 1, 1, body);
    for (const s of [-1, 1]) {
      K.add(rbox(3.2, 0.7, 0.6, 0.15), M.rubber, -0.2, -0.85, s * 1.3, 0, 0, 0, 1, 1, 1, body);   // tracks
      for (let i = 0; i < 6; i++) K.add(cyl(0.26, 0.26, 0.62, 14), M.frame, -1.4 + i * 0.48, -0.85, s * 1.3, Math.PI / 2, 0, 0, 1, 1, 1, body);
      for (let i = 0; i < 12; i++) K.add(box(0.1, 0.06, 0.62), M.steel, -1.75 + i * 0.3, -1.2, s * 1.3, 0, 0, 0, 1, 1, 1, body);
    }
    for (let i = 0; i < 4; i++) glowPart(rbox(0.5, 0.08, 0.2, 0.03), 0xff7a2a, 4, -1.0 + i * 0.6, 1.02, 0.9, 0, 0, 0, body);   // vents
    for (let i = 0; i < 4; i++) glowPart(rbox(0.5, 0.08, 0.2, 0.03), 0xff7a2a, 4, -1.0 + i * 0.6, 1.02, -0.9, 0, 0, 0, body);
    for (const s of [-1, 1]) { K.add(cyl(0.22, 0.26, 1.2, 14), hot, -1.2, 1.4, s * 0.7, 0, 0, 0, 1, 1, 1, body); K.add(cyl(0.24, 0.24, 0.06, 14), M.black, -1.2, 2.02, s * 0.7, 0, 0, 0, 1, 1, 1, body); glowPart(cyl(0.18, 0.18, 0.02, 14), 0xffa040, 5, -1.2, 2.04, s * 0.7, 0, 0, 0, body); }
    K.mesh(rbox(0.06, 0.2, 1.4, 0.02), glow(0xffa040, 5), 'eye', 1.32, 0.6, 0, 0, 0, 0, body);
    // the hammer: a heavy plate on twin rams; the renderer lifts it and slams it down
    const ham = K.group('hammer', body, 1.6, 1.0, 0);
    for (const s of [-1, 1]) { K.rod(M.chrome, -0.4, 0.0, s * 0.6, 0.4, 0.3, s * 0.6, 0.12, ham); K.add(cyl(0.2, 0.2, 0.6, 14), M.frame, -0.5, 0, s * 0.6, 0, 0, Math.PI / 2, 1, 1, 1, ham); }
    K.add(rbox(1.2, 0.35, 2.4, 0.08), iron, 0.6, 0.35, 0, 0, 0, 0, 1, 1, 1, ham);
    K.add(rbox(1.22, 0.1, 2.42, 0.03), hot, 0.6, 0.15, 0, 0, 0, 0, 1, 1, 1, ham);
    for (let i = 0; i < 5; i++) K.add(cone(0.12, 0.3, 6), M.steel, 0.6, 0.0, -0.9 + i * 0.45, Math.PI, 0, 0, 1, 1, 1, ham);
    glowPart(rbox(1.0, 0.04, 2.2, 0.02), 0xff6a1a, 2.5, 0.6, 0.11, 0, 0, 0, 0, ham);
    // detail pass: side skirts and toothed sprockets over the tracks, plating seams and rivets, hydraulic ram
    // housings feeding the hammer, an operator block, heat-banded stacks with hoses, a rear furnace door
    const soot = paint(0x2a2622, 0.6, 0.5);
    for (const s of [-1, 1]) {
      K.add(rbox(3.3, 0.34, 0.12, 0.04), iron, -0.2, -0.42, s * 1.64, 0, 0, 0, 1, 1, 1, body);
      K.add(rbox(3.32, 0.09, 0.13, 0.02), M.stripes, -0.2, -0.6, s * 1.64, 0, 0, 0, 1, 1, 1, body);
      for (const ex of [-1.78, 1.38]) {
        K.add(cyl(0.34, 0.34, 0.5, 18), M.frame, ex, -0.85, s * 1.3, Math.PI / 2, 0, 0, 1, 1, 1, body);
        for (let t = 0; t < 9; t++) { const a = (t / 9) * Math.PI * 2; K.add(box(0.09, 0.12, 0.52), M.steel, ex + Math.cos(a) * 0.37, -0.85 + Math.sin(a) * 0.37, s * 1.3, 0, 0, a, 1, 1, 1, body); }
        K.add(cyl(0.12, 0.12, 0.58, 10), M.chrome, ex, -0.85, s * 1.3, Math.PI / 2, 0, 0, 1, 1, 1, body);
      }
      for (let i = 0; i < 4; i++) K.add(box(0.035, 1.18, 0.02), M.black, -1.35 + i * 0.8, 0.32, s * 1.305, 0, 0, 0, 1, 1, 1, body);
      bolts(K, M.steel, Array.from({ length: 12 }, (_, i) => [-1.6 + i * 0.26, 0.86, s * 1.31, Math.PI / 2, 0, 0]), 0.026, body);
      bolts(K, M.steel, Array.from({ length: 12 }, (_, i) => [-1.6 + i * 0.26, -0.22, s * 1.31, Math.PI / 2, 0, 0]), 0.026, body);
      K.add(cyl(0.17, 0.17, 0.95, 16), hot, 0.62, 1.12, s * 0.6, 0, 0, Math.PI / 2, 1, 1, 1, body);          // ram housings
      for (const t of [0.25, 0.62, 0.99]) K.add(tor(0.18, 0.025, 18, 6), M.frame, t, 1.12, s * 0.6, 0, Math.PI / 2, 0, 1, 1, 1, body);
      K.add(rbox(0.3, 0.16, 0.3, 0.04), M.frame, 0.12, 1.06, s * 0.6, 0, 0, 0, 1, 1, 1, body);
      // stacks: heat bands, a grille cap and a flexible hose down into the hull
      for (const y of [1.0, 1.35, 1.7]) K.add(tor(0.255, 0.028, 20, 6), y === 1.35 ? glow(0xff7a2a, 2.4) : M.frame, -1.2, y, s * 0.7, Math.PI / 2, 0, 0, 1, 1, 1, body);
      for (let i = 0; i < 4; i++) K.add(box(0.44, 0.03, 0.04), M.black, -1.2, 2.07, s * 0.7 - 0.15 + i * 0.1, 0, 0, 0, 1, 1, 1, body);
      K.rod(M.rubber, -1.2, 1.15, s * 0.95, -1.55, 0.9, s * 1.12, 0.07, body, 8);
      K.rod(M.rubber, -1.55, 0.9, s * 1.12, -1.6, 0.4, s * 1.2, 0.07, body, 8);
      K.add(cyl(0.09, 0.09, 0.12, 10), M.brass, -1.2, 1.15, s * 0.92, Math.PI / 2, 0, 0, 1, 1, 1, body);
    }
    for (let i = 0; i < 3; i++) K.add(box(2.4, 0.02, 0.035), M.black, -0.3, 1.005, -0.5 + i * 0.5, 0, 0, 0, 1, 1, 1, body);          // top plating seams
    K.add(rbox(0.9, 0.42, 0.72, 0.08), soot, 0.45, 1.2, 0, 0, 0, 0, 1, 1, 1, body);                        // operator block
    K.add(rbox(0.12, 0.12, 0.6, 0.03), M.glass, 0.92, 1.26, 0, 0, 0, -0.25, 1, 1, 1, body);
    K.add(rbox(0.04, 0.03, 0.5, 0.01), glow(0xffa040, 3), 0.97, 1.27, 0, 0, 0, -0.25, 1, 1, 1, body);
    for (let i = 0; i < 2; i++) K.add(cyl(0.012, 0.012, 0.5, 4), M.steel, 0.2 + i * 0.12, 1.65, 0.25, 0, 0, 0, 1, 1, 1, body);   // antennas
    K.add(sph(0.03, 6, 4), glow(EYE, 5), 0.2, 1.92, 0.25, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(0.1, 0.95, 1.7, 0.04), soot, -1.76, 0.35, 0, 0, 0, 0, 1, 1, 1, body);                       // furnace door
    for (let i = 0; i < 4; i++) { K.add(box(0.03, 0.06, 1.3), glow(0xff6a1a, 3.2), -1.82, 0.08 + i * 0.18, 0, 0, 0, 0, 1, 1, 1, body); K.add(box(0.05, 0.05, 1.42), M.black, -1.83, 0.17 + i * 0.18, 0, 0, 0, 0, 1, 1, 1, body); }
    for (const z of [-0.75, 0.75]) K.add(cyl(0.05, 0.05, 1.0, 8), M.chrome, -1.84, 0.35, z, 0, 0, 0, 1, 1, 1, body);   // door hinges
    K.add(rbox(0.3, 0.25, 2.62, 0.05), M.frame, 1.28, -0.28, 0, 0, 0, 0, 1, 1, 1, body);                    // front bumper
    for (let i = 0; i < 6; i++) K.add(cone(0.08, 0.22, 6), M.steel, 1.46, -0.28, -1.0 + i * 0.4, 0, 0, -Math.PI / 2, 1, 1, 1, body);
  } else if (key === 'hydra') {
    // DATA-CORE HYDRA: a server monolith wrapped in a light ring; its turret heads are separate models
    const rack = paint(0x1c222c, 0.3, 0.8), trim = paint(0x9aa3ad, 0.3, 0.7);
    const body = K.group('bbody', K.root, 0, 0, 0);
    K.add(cyl(1.7, 1.9, 0.4, 8), M.dark, 0, 0.2, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(rbox(1.6, 3.2, 1.6, 0.12), rack, 0, 2.0, 0, 0, Math.PI / 4, 0, 1, 1, 1, body);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; for (let k = 0; k < 9; k++) glowPart(box(0.5, 0.04, 0.02), k % 3 ? 0x3cc8ff : 0x5dff9a, 2.5, Math.cos(a) * 0.82, 0.8 + k * 0.3, Math.sin(a) * 0.82, 0, -a + Math.PI / 2, 0, body); }
    K.add(rbox(1.7, 0.2, 1.7, 0.05), trim, 0, 3.65, 0, 0, Math.PI / 4, 0, 1, 1, 1, body);
    K.mesh(sph(0.45, 24, 16), glow(0x3cc8ff, 4), 'eye', 0, 4.0, 0, 0, 0, 0, body);
    const spin = K.group('spin', K.root, 0, 2.4, 0);
    K.add(tor(1.6, 0.06, 48, 8), M.chrome, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, spin);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; K.add(rbox(0.2, 0.1, 0.1, 0.02), trim, Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6, 0, -a, 0, 1, 1, 1, spin); }
    glowPart(tor(1.6, 0.02, 48, 4), 0x3cc8ff, 3, 0, 0.08, 0, Math.PI / 2, 0, 0, spin);
    // detail pass: a stepped plinth with floor clamps and cable runs, coolant pipes up the corners, blade bays
    // and status LEDs on every face, a finned heatsink crown, data emitters riding the light ring
    K.add(cyl(2.25, 2.4, 0.12, 8), M.frame, 0, 0.06, 0, 0, 0, 0, 1, 1, 1, body);
    K.add(tor(1.82, 0.04, 8, 6), glow(0x3cc8ff, 2.2), 0, 0.41, 0, Math.PI / 2, 0, Math.PI / 8, 1, 1, 1, body);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      K.add(rbox(0.5, 0.18, 0.34, 0.04), trim, Math.cos(a) * 2.1, 0.14, Math.sin(a) * 2.1, 0, -a, 0, 1, 1, 1, body);
      K.rod(M.rubber, Math.cos(a) * 1.75, 0.32, Math.sin(a) * 1.75, Math.cos(a) * 2.7, 0.06, Math.sin(a) * 2.7, 0.06, body, 8);
      K.add(cyl(0.08, 0.08, 0.1, 10), M.brass, Math.cos(a) * 1.74, 0.36, Math.sin(a) * 1.74, 0, 0, 0, 1, 1, 1, body);
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;                       // the monolith's corners
      K.add(cyl(0.08, 0.08, 3.1, 10), M.chrome, Math.cos(a) * 1.16, 2.0, Math.sin(a) * 1.16, 0, 0, 0, 1, 1, 1, body);
      for (const y of [0.7, 1.6, 2.5, 3.3]) K.add(rbox(0.22, 0.08, 0.22, 0.02), M.frame, Math.cos(a) * 1.12, y, Math.sin(a) * 1.12, 0, -a + Math.PI / 4, 0, 1, 1, 1, body);
      // each face: two columns of blade bays either side of the light strips, with status LEDs
      const f = a + Math.PI / 4, nx = Math.cos(f), nz = Math.sin(f), tx = -nz, tz = nx;
      for (const side of [-1, 1]) for (let k = 0; k < 10; k++) {
        const y = 0.75 + k * 0.28, o = side * 0.52;
        K.add(box(0.36, 0.2, 0.04), M.black, nx * 0.81 + tx * o, y, nz * 0.81 + tz * o, 0, -f + Math.PI / 2, 0, 1, 1, 1, body);
        if ((k * 7 + i * 3 + (side > 0 ? 5 : 0)) % 4 !== 0) K.add(box(0.035, 0.035, 0.02), glow((k + i) % 5 === 0 ? 0xffb347 : 0x5dff9a, 4), nx * 0.835 + tx * (o + side * 0.13), y, nz * 0.835 + tz * (o + side * 0.13), 0, -f + Math.PI / 2, 0, 1, 1, 1, body);
      }
    }
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; K.add(box(0.3, 0.32, 0.035), M.steel, Math.cos(a) * 0.62, 3.9, Math.sin(a) * 0.62, 0, -a, 0, 1, 1, 1, body); }   // heatsink crown
    K.add(tor(0.47, 0.03, 24, 6), glow(0x3cc8ff, 3), 0, 3.78, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    K.add(tor(1.3, 0.05, 40, 8), M.frame, 0, 1.15, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);                       // a lower collar
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
      K.add(cone(0.06, 0.24, 6), M.steel, Math.cos(a) * 1.72, 0, Math.sin(a) * 1.72, 0, -a, -Math.PI / 2, 1, 1, 1, spin);   // data emitters
      if (i % 2 === 0) K.add(sph(0.035, 6, 4), glow(0x9fe8ff, 5), Math.cos(a) * 1.86, 0, Math.sin(a) * 1.86, 0, 0, 0, 1, 1, 1, spin);
    }
  } else {
    // CUSTODIAN CORE: a floating reactor heart in nested rings; its armour plates are separate models
    const shell = paint(0x2a2e26, 0.3, 0.8);
    const body = K.group('bbody', K.root, 0, 2.6, 0);
    K.add(sph(1.3, 32, 24), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 6; i++) K.add(tor(1.32, 0.04, 48, 6), M.frame, 0, 0, 0, 0, (i / 6) * Math.PI, 0, 1, 1, 1, body);
    K.mesh(sph(0.62, 24, 16), glow(0x7dff6a, 4.5), 'eye', 0.85, 0, 0, 0, 0, 0, body);
    K.add(tor(0.66, 0.06, 32, 8), M.chrome, 0.95, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, body);
    const spin = K.group('spin', body, 0, 0, 0);
    K.add(tor(1.9, 0.05, 64, 8), M.steel, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, spin);
    glowPart(tor(1.9, 0.02, 64, 4), 0x7dff6a, 3, 0, 0.06, 0, Math.PI / 2, 0, 0, spin);
    K.add(tor(2.3, 0.04, 64, 8), M.frame, 0, 0, 0, 0.4, 0, 0, 1, 1, 1, spin);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; K.add(cone(0.12, 0.5, 6), M.dark, Math.cos(a) * 1.5, -1.0, Math.sin(a) * 1.5, Math.PI, 0, 0, 1, 1, 1, body); }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.26;
      if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.5) continue;                                 // leave the eye clear
      K.add(rbox(0.12, 0.62, 0.62, 0.04), shell, Math.cos(a) * 1.3, 0, Math.sin(a) * 1.3, 0, -a, 0, 1, 1, 1, body);
      K.add(box(0.03, 0.66, 0.03), glow(0x7dff6a, 3), Math.cos(a + 0.26) * 1.33, 0, Math.sin(a + 0.26) * 1.33, 0, -a, 0, 1, 1, 1, body);
    }
    K.add(cyl(0.45, 0.65, 0.3, 16), M.dark, 0, 1.3, 0, 0, 0, 0, 1, 1, 1, body);                         // crown
    K.add(tor(0.5, 0.04, 24, 6), glow(0x7dff6a, 3), 0, 1.42, 0, Math.PI / 2, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.add(cone(0.06, 0.35, 5), M.steel, Math.cos(a) * 0.5, 1.6, Math.sin(a) * 0.5, 0, 0, 0, 1, 1, 1, body); }
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.6; K.rod(M.rubber, Math.cos(a) * 0.9, 1.6, Math.sin(a) * 0.9, Math.cos(a) * 1.25, 0.3, Math.sin(a) * 1.25, 0.06, K.root, 8); }
    K.add(cyl(0.9, 1.4, 0.3, 24), M.dark, 0, 0.15, 0, 0, 0, 0);                                     // pedestal on the floor
    glowPart(tor(1.2, 0.05, 48, 6), 0x7dff6a, 2.5, 0, 0.32, 0, Math.PI / 2, 0, 0);
  }
  return K.build();
}
// the hydra's turret heads and the Custodian Core's armour plates (positioned by the renderer from the sim)
export function hydraHead() {
  const g = make('hydraHead', () => {
    const K = new Kit();
    const shell = paint(0x2a3442, 0.3, 0.8);
    const neck = K.group('neck', K.root, 0, 0, 0);
    for (let i = 0; i < 5; i++) K.add(cyl(0.18 - i * 0.015, 0.2 - i * 0.015, 0.3, 12), i % 2 ? M.frame : shell, 0, 0.3 + i * 0.32, 0, 0, 0, 0, 1, 1, 1, neck);
    const head = K.group('hhead', K.root, 0, 1.9, 0);
    K.add(rbox(0.7, 0.36, 0.5, 0.08), shell, 0, 0, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(rbox(0.2, 0.2, 0.4, 0.05), M.glass, 0.32, 0.04, 0, 0, 0, -0.2, 1, 1, 1, head);
    K.mesh(sph(0.1, 14, 10), glow(0x3cc8ff, 5), 'eye', 0.38, 0.04, 0, 0, 0, 0, head);
    for (const s of [-1, 1]) { K.add(cyl(0.05, 0.06, 0.5, 10), M.black, 0.5, -0.08, s * 0.16, 0, 0, Math.PI / 2, 1, 1, 1, head); K.add(cyl(0.045, 0.045, 0.02, 10), glow(0x3cc8ff, 4), 0.76, -0.08, s * 0.16, 0, 0, Math.PI / 2, 1, 1, 1, head); }
    for (let i = 0; i < 4; i++) K.add(box(0.3, 0.02, 0.52), M.frame, -0.1 + i * 0.06, 0.2, 0, 0, 0, 0, 1, 1, 1, head);
    return K.build();
  });
  return { g, head: by(g, 'hhead'), eye: by(g, 'eye') };
}
export function overPlate() {
  const g = make('overPlate', () => {
    const K = new Kit();
    const shell = paint(0x4a4f42, 0.35, 0.8);
    for (let i = 0; i < 6; i++) { const a = (i - 2.5) * 0.19; K.add(rbox(0.22, 1.8, 0.5, 0.05), shell, Math.cos(a) * 2.5 - 2.5, 0, Math.sin(a) * 2.5, 0, -a, 0, 1, 1, 1); }
    for (const s of [-1, 1]) K.add(rbox(0.06, 1.85, 0.04, 0.01), glow(0x7dff6a, 3), Math.cos(0.5) * 2.5 - 2.5 + 0.1, 0, s * Math.sin(0.5) * 2.5, 0, -s * 0.5, 0, 1, 1, 1);
    for (const y of [-0.8, 0.8]) for (let i = 0; i < 3; i++) { const a = (i - 1) * 0.36; K.add(rbox(0.26, 0.08, 0.95, 0.02), M.frame, Math.cos(a) * 2.5 - 2.5 + 0.03, y, Math.sin(a) * 2.5, 0, -a, 0, 1, 1, 1); }
    return K.build();
  });
  return { g };
}

// ------------------------------------------------------------------ power-up pods and the lift
export function pickup(color) {
  const g = make('pickup' + color, () => {
    const K = new Kit();
    const pod = K.group('pod', K.root, 0, 0.9, 0);
    const capP = [[0, 0.26], [0.16, 0.24], [0.26, 0.17], [0.29, 0.08], [0.29, 0.05]];
    K.add(lathe('pcap', capP, 28), M.chrome, 0, 0.07, 0, 0, 0, 0, 1, 1, 1, pod);
    K.add(lathe('pcap', capP, 28), M.chrome, 0, -0.07, 0, Math.PI, 0, 0, 1, 1, 1, pod);
    K.add(cyl(0.26, 0.26, 0.26, 28, 1), M.glassT, 0, 0, 0, 0, 0, 0, 1, 1, 1, pod);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.rod(M.frame, Math.cos(a) * 0.27, -0.14, Math.sin(a) * 0.27, Math.cos(a) * 0.27, 0.14, Math.sin(a) * 0.27, 0.016, pod, 6); }
    K.mesh(ico(0.14, 1), glow(color, 5), 'core', 0, 0, 0, 0, 0, 0, pod);
    const ring = K.group('ring', K.root, 0, 0.9, 0);
    K.add(tor(0.45, 0.025, 40, 8), M.chrome, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
    K.add(tor(0.45, 0.01, 40, 6), glow(color, 3), 0, 0.03, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
    K.add(cyl(0.36, 0.44, 0.07, 28), M.dark, 0, 0.035, 0);
    K.add(tor(0.38, 0.018, 32, 6), glow(color, 2.5), 0, 0.08, 0, Math.PI / 2, 0, 0);
    return K.build();
  });
  return { g, pod: by(g, 'pod'), ring: by(g, 'ring'), core: by(g, 'core') };
}
export function liftPad() {
  const g = make('lift', () => {
    const K = new Kit();
    K.add(cyl(1.9, 2.0, 0.12, 48), M.dark, 0, 0.06, 0);
    K.add(cyl(1.55, 1.55, 0.14, 48), M.frame, 0, 0.08, 0);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; K.add(box(0.6, 0.02, 0.06), M.black, Math.cos(a) * 1.15, 0.155, Math.sin(a) * 1.15, 0, -a, 0); }
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.2; K.add(rbox(0.3, 0.06, 0.14, 0.02), M.stripes, Math.cos(a) * 1.75, 0.13, Math.sin(a) * 1.75, 0, -a, 0); }
    const ring = K.group('ring', K.root, 0, 0, 0);
    K.mesh(tor(1.62, 0.04, 64, 6), glow(0x7dff9a, 3), 'ringglow', 0, 0.17, 0, Math.PI / 2, 0, 0, ring);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; K.add(cyl(0.08, 0.1, 1.4, 12), M.frame, Math.cos(a) * 2.1, 0.7, Math.sin(a) * 2.1); K.add(sph(0.08, 10, 8), glow(0x7dff9a, 4), Math.cos(a) * 2.1, 1.45, Math.sin(a) * 2.1); }
    return K.build();
  });
  return { g, ring: by(g, 'ringglow') };
}

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
export const GEO = { box, cyl, sph, cap, tor, rbox, cone, lathe };
export function add(p, g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
export const mat = () => M;
export { paint as paintMat, glow as glowMat };
