// Lancewing 2026 models with physically based materials: the skyray mounts and their armoured lancers,
// the Stormhunter, ember cores, power-up orbs, the five bosses and scenery pieces. Each model is built once from many detailed parts (bevelled armour plates,
// turned parts, hydraulic struts, bolts, cables, lamps), every static part is merged into one mesh per
// material per moving joint, and later copies are cheap clones that share geometry. A panel normal map
// adds seams, rivets and scratches to painted metal.
// Every model faces +x (its right side, +z, faces the camera). Named parts (wings, tail, lance, eye,
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
const STATIC_PARTS = new Set(['visor', 'lamp', 'eyes', 'rune', 'vent']);
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

// ------------------------------------------------------------------ shapes
// a flat bevelled plate from an outline in the x/z plane (wing membranes, fins, blades), thickness t
function plate(key, pts, t = 0.04, bev = 0.012) {
  return geo('p' + key + t, () => {
    const s = new THREE.Shape();
    pts.forEach(([x, z], i) => (i ? s.lineTo(x, z) : s.moveTo(x, z)));
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 1, curveSegments: 4 });
    g.rotateX(Math.PI / 2);
    g.translate(0, t / 2, 0);
    g.computeVertexNormals();
    return g;
  });
}
const mirror = (pts) => pts.map(([x, z]) => [x, -z]);
// an upright plate in the x/y plane (fins, blades seen from the side)
function fin(key, pts, t = 0.04) {
  return geo('f' + key + t, () => { const g = plate(key + 'src', pts, t).clone(); g.rotateX(-Math.PI / 2); g.computeVertexNormals(); return g; });
}
function leather(color = 0x4a3426) { return cloth(color, 0.7); }

// ------------------------------------------------------------------ the skyray: a plated manta mount
// origin at the belly, nose toward +x. Joints: wingL/wingR (rotate x to beat), tipL/tipR, tail, tail2, head.
const WING_IN = [[0.55, 0], [0.62, 0.35], [0.4, 0.95], [0.1, 1.15], [-0.42, 1.05], [-0.62, 0.55], [-0.55, 0]];
const WING_OUT = [[0.42, 0], [0.3, 0.42], [0.05, 0.86], [-0.08, 0.95], [-0.22, 0.7], [-0.38, 0.3], [-0.4, 0]];
function skyrayParts(K, root, o) {
  const hide = o.hide, arm = o.armor, trim = o.trim, belly = paint(o.belly || 0xb8b0a2, 0.7, 0.05), eye = glow(o.eye, 5);
  // hull: a flattened, tapered body with a pale belly
  K.add(sph(1, 30, 16), hide, 0.05, 0.42, 0, 0, 0, 0, 1.42, 0.33, 0.74, root);
  K.add(sph(1, 26, 12), belly, 0.08, 0.31, 0, 0, 0, 0, 1.28, 0.2, 0.62, root);
  K.add(sph(1, 20, 10), hide, -0.85, 0.44, 0, 0, 0, 0, 0.7, 0.24, 0.42, root);
  // armour: overlapping spine plates with trim and rivets, flank plates, a chest plate
  for (let i = 0; i < 6; i++) {
    const x = 0.98 - i * 0.36, y = 0.7 - Math.abs(x - 0.1) * 0.1, wd = 0.66 - Math.abs(i - 2) * 0.07;
    K.add(rbox(0.36, 0.07, wd, 0.025), arm, x, y, 0, 0, 0, -0.05 + i * 0.025, 1, 1, 1, root);
    K.add(rbox(0.06, 0.035, wd * 0.9, 0.012), trim, x + 0.15, y + 0.03, 0, 0, 0, 0, 1, 1, 1, root);
    bolts(K, M.steel, [[x - 0.1, y + 0.04, wd * 0.4, 0, 0, 0], [x - 0.1, y + 0.04, -wd * 0.4, 0, 0, 0]], 0.02, root);
  }
  for (const s of [-1, 1]) {
    K.add(rbox(1.0, 0.06, 0.3, 0.02), arm, 0.15, 0.55, s * 0.56, s * 0.42, 0, 0, 1, 1, 1, root);
    K.add(rbox(0.7, 0.05, 0.22, 0.02), arm, -0.6, 0.5, s * 0.42, s * 0.38, 0, 0, 1, 1, 1, root);
    K.add(rbox(0.9, 0.025, 0.05, 0.01), trim, 0.15, 0.58, s * 0.68, s * 0.42, 0, 0, 1, 1, 1, root);
    // gill slits under the wing roots
    for (let i = 0; i < 4; i++) K.add(box(0.025, 0.02, 0.18), M.black, 0.55 - i * 0.09, 0.26, s * 0.38, 0, s * 0.4, 0, 1, 1, 1, root);
  }
  K.add(rbox(0.5, 0.22, 0.56, 0.05), arm, 1.02, 0.36, 0, 0, 0, 0.25, 1, 1, 1, root);
  // harness: girth straps, saddle, stirrups, saddle bags
  for (const x of [0.22, -0.32]) K.add(tor(0.62, 0.025, 26, 6), leather(0x3a2a20), x, 0.43, 0, 0, Math.PI / 2, 0, 1, 0.48, 1.15, root);
  K.add(rbox(0.56, 0.12, 0.44, 0.04), leather(), -0.04, 0.8, 0, 0, 0, 0, 1, 1, 1, root);
  K.add(rbox(0.12, 0.2, 0.42, 0.04), leather(0x3a2a20), -0.3, 0.88, 0, 0, 0, 0.1, 1, 1, 1, root);
  K.add(rbox(0.1, 0.14, 0.34, 0.04), leather(0x3a2a20), 0.22, 0.86, 0, 0, 0, -0.2, 1, 1, 1, root);
  for (const s of [-1, 1]) { K.add(tor(0.06, 0.012, 12, 6), M.steel, 0.18, 0.48, s * 0.46, 0, 0, 0, 1, 1, 1, root); K.add(rbox(0.22, 0.16, 0.08, 0.03), leather(0x5a3a28), -0.42, 0.62, s * 0.44, s * 0.3, 0, 0, 1, 1, 1, root); }
  // head: armoured face, glowing eyes, forward horns, a dark mouth slit
  const head = K.group('head', root, 1.32, 0.46, 0);
  K.add(rbox(0.58, 0.26, 0.66, 0.08), hide, 0.04, 0, 0, 0, 0, -0.06, 1, 1, 1, head);
  K.add(rbox(0.52, 0.06, 0.62, 0.02), arm, 0.07, 0.14, 0, 0, 0, -0.16, 1, 1, 1, head);
  K.add(rbox(0.16, 0.18, 0.46, 0.03), arm, 0.33, 0.03, 0, 0, 0, 0.32, 1, 1, 1, head);
  K.add(rbox(0.04, 0.05, 0.4, 0.01), trim, 0.38, 0.12, 0, 0, 0, 0.32, 1, 1, 1, head);
  K.add(box(0.3, 0.02, 0.5), M.black, 0.2, -0.1, 0, 0, 0, 0.05, 1, 1, 1, head);
  for (const s of [-1, 1]) {
    K.add(sph(0.06, 12, 8), eye, 0.22, 0.04, s * 0.3, 0, 0, 0, 1, 0.7, 1, head);
    K.add(rbox(0.14, 0.04, 0.1, 0.012), arm, 0.22, 0.09, s * 0.3, 0, 0, -0.2, 1, 1, 1, head);
    K.add(cone(0.075, 0.62, 10), hide, 0.48, -0.04, s * 0.3, s * 0.12, 0, -Math.PI / 2 - 0.22, 1, 1, 1, head);
    K.add(tor(0.07, 0.015, 12, 6), trim, 0.3, -0.03, s * 0.3, 0, Math.PI / 2, 0, 1, 1, 1, head);
  }
  // tail: a tapering whip in two joints with armour rings and a blade fin
  const tail = K.group('tail', root, -1.3, 0.44, 0);
  for (let i = 0; i < 3; i++) { K.add(cyl(0.1 - i * 0.022, 0.13 - i * 0.022, 0.44, 10), hide, -0.2 - i * 0.4, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, tail); K.add(tor(0.11 - i * 0.022, 0.018, 14, 6), arm, -0.02 - i * 0.4, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, tail); }
  const tail2 = K.group('tail2', tail, -1.25, 0, 0);
  for (let i = 0; i < 3; i++) K.add(cyl(0.035 - i * 0.008, 0.05 - i * 0.008, 0.36, 8), hide, -0.18 - i * 0.34, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, tail2);
  K.add(fin('tailblade', [[0, 0], [-0.18, 0.2], [-0.6, 0.06], [-0.62, 0], [-0.6, -0.06], [-0.18, -0.16]], 0.03), arm, -1.0, 0, 0, 0, 0, 0, 1, 1, 1, tail2);
  K.add(fin('tailedge', [[-0.18, 0.2], [-0.62, 0.02], [-0.6, 0.06]], 0.035), glow(o.eye, 2.5), -1.0, 0, 0, 0, 0, 0, 1, 1, 1, tail2);
  // wings: an armoured inner wing and a hinged tip, both beat
  for (const s of [-1, 1]) {
    const w = K.group(s < 0 ? 'wingL' : 'wingR', root, 0.12, 0.5, s * 0.6);
    const pin = s < 0 ? mirror(WING_IN) : WING_IN, pout = s < 0 ? mirror(WING_OUT) : WING_OUT;
    K.add(plate('wi' + s, pin, 0.05), hide, 0, 0, 0, 0, 0, 0, 1, 1, 1, w);
    K.add(plate('wib' + s, pin, 0.02, 0), belly, 0, -0.03, 0, 0, 0, 0, 0.94, 1, 0.96, w);
    K.rod(arm, 0.56, 0.03, 0, 0.12, 0.03, s * 1.12, 0.045, w, 10);
    for (let i = 0; i < 4; i++) { const t = i / 4; K.add(rbox(0.26, 0.05, 0.26, 0.02), arm, 0.5 - t * 0.34, 0.05, s * (0.14 + t * 0.92), 0, s * 0.35, 0, 1, 1, 1, w); K.add(box(0.2, 0.012, 0.03), trim, 0.48 - t * 0.34, 0.085, s * (0.14 + t * 0.92), 0, s * 0.35, 0, 1, 1, 1, w); }
    for (let i = 0; i < 3; i++) K.add(box(0.7 - i * 0.1, 0.008, 0.012), M.black, -0.15, 0.03, s * (0.35 + i * 0.25), 0, s * (0.2 + i * 0.1), 0, 1, 1, 1, w);
    const tip = K.group(s < 0 ? 'tipL' : 'tipR', w, 0.04, 0, s * 1.08);
    K.add(plate('wo' + s, pout, 0.04), hide, 0, 0, 0, 0, 0, 0, 1, 1, 1, tip);
    K.rod(arm, 0.42, 0.02, 0, 0.0, 0.02, s * 0.9, 0.032, tip, 8);
    K.add(rbox(0.2, 0.04, 0.2, 0.015), arm, 0.3, 0.04, s * 0.3, 0, s * 0.5, 0, 1, 1, 1, tip);
    K.add(sph(0.035, 8, 6), glow(o.eye, 5), -0.05, 0.03, s * 0.92, 0, 0, 0, 1, 1, 1, tip);
  }
}

// ------------------------------------------------------------------ the lancer: an armoured knight seated on the saddle
// joints: rider, torso, helm, lance (with tip), shield
const HELM = [[0, -0.13], [0.11, -0.12], [0.135, -0.04], [0.14, 0.04], [0.12, 0.11], [0.07, 0.16], [0, 0.17]];
function riderParts(K, root, o) {
  const arm = o.armor, trim = o.trim, dark = paint(0x2a2c31, 0.4, 0.7), tab = cloth(o.cloth || o.armor, 0.85), acc = glow(o.accent, 4);
  const R = K.group('rider', root, -0.06, 0.86, 0);
  // legs astride the hull, boots in the stirrups
  for (const s of [-1, 1]) {
    K.add(rbox(0.38, 0.14, 0.15, 0.045), arm, 0.08, 0.02, s * 0.2, s * 0.15, 0, 0, 1, 1, 1, R);
    K.add(sph(0.075, 10, 8), trim, 0.26, 0.01, s * 0.27, 0, 0, 0, 1, 1, 1, R);
    K.add(rbox(0.13, 0.34, 0.13, 0.04), arm, 0.28, -0.17, s * 0.33, s * 0.35, 0, 0.1, 1, 1, 1, R);
    K.add(rbox(0.22, 0.08, 0.12, 0.03), dark, 0.33, -0.33, s * 0.4, s * 0.35, 0, 0, 1, 1, 1, R);
  }
  K.add(rbox(0.26, 0.12, 0.34, 0.04), dark, 0, 0.04, 0, 0, 0, 0, 1, 1, 1, R);
  for (const s of [-1, 1]) K.add(rbox(0.2, 0.14, 0.04, 0.015), arm, 0.02, 0.0, s * 0.19, 0, 0, 0.05, 1, 1, 1, R);   // tassets
  const T = K.group('torso', R, 0, 0.1, 0);
  // the cuirass: lames, breastplate with a ridge, backplate, gorget, a tabard in the class colour
  for (let i = 0; i < 3; i++) K.add(rbox(0.28 - i * 0.01, 0.06, 0.34 - i * 0.01, 0.02), arm, 0.02, 0.04 + i * 0.06, 0, 0, 0, 0, 1, 1, 1, T);
  K.add(rbox(0.32, 0.3, 0.4, 0.08), arm, 0.03, 0.34, 0, 0, 0, 0, 1, 1, 1, T);
  K.add(rbox(0.06, 0.26, 0.05, 0.02), trim, 0.18, 0.34, 0, 0, 0, 0, 1, 1, 1, T);
  K.add(rbox(0.12, 0.3, 0.36, 0.05), dark, -0.12, 0.34, 0, 0, 0, 0, 1, 1, 1, T);
  K.add(tor(0.11, 0.035, 18, 8), trim, 0.02, 0.52, 0, Math.PI / 2, 0, 0, 1, 1, 1, T);
  K.add(rbox(0.04, 0.36, 0.24, 0.015), tab, 0.17, 0.12, 0, 0, 0, 0.1, 1, 1, 1, T);
  K.add(box(0.012, 0.05, 0.08), acc, 0.198, 0.36, 0, 0, 0, 0, 1, 1, 1, T);
  for (const s of [-1, 1]) {
    K.add(sph(0.15, 16, 10), arm, 0.0, 0.49, s * 0.24, 0, 0, 0, 1.1, 0.78, 1, T);
    K.add(tor(0.14, 0.02, 18, 6), trim, 0.0, 0.46, s * 0.24, Math.PI / 2, 0, 0, 1.1, 1, 0.85, T);
    K.add(rbox(0.24, 0.05, 0.08, 0.02), arm, 0, 0.42, s * 0.3, 0, 0, 0, 1, 1, 1, T);
  }
  // helm with a visor slit and a crest by class
  const helm = K.group('helm', T, 0.03, 0.68, 0);
  K.add(lathe('helm', HELM, 22), arm, 0, 0, 0, 0, 0, 0, 1, 1, 1.05, helm);
  K.add(rbox(0.06, 0.12, 0.22, 0.02), arm, 0.12, -0.05, 0, 0, 0, 0.12, 1, 1, 1, helm);
  K.add(box(0.02, 0.022, 0.2), M.black, 0.14, 0.03, 0, 0, 0, 0, 1, 1, 1, helm);
  K.add(box(0.012, 0.012, 0.17), acc, 0.148, 0.03, 0, 0, 0, 0, 1, 1, 1, helm);
  const kind = o.kind;
  if (kind === 'player' || kind === 'lancer') for (let i = 0; i < 5; i++) K.add(rbox(0.07, 0.06 + i * 0.012, 0.035, 0.012), kind === 'player' ? glow(o.accent, 2.2) : tab, 0.06 - i * 0.07, 0.19 + Math.sin(i * 0.6) * 0.03, 0, 0, 0, 0.2 + i * 0.12, 1, 1, 1, helm);
  if (kind === 'reaver') for (const s of [-1, 1]) { K.add(cone(0.035, 0.32, 8), M.black, 0.0, 0.16, s * 0.12, s * -0.6, 0, -0.5, 1, 1, 1, helm); K.add(cone(0.02, 0.14, 6), trim, -0.08, 0.22, s * 0.2, s * -0.9, 0, -0.9, 1, 1, 1, helm); }
  if (kind === 'skirmisher') { K.add(rbox(0.04, 0.12, 0.02, 0.01), trim, 0.15, -0.02, 0, 0, 0, 0, 1, 1, 1, helm); K.add(cone(0.03, 0.12, 8), arm, 0, 0.21, 0, 0, 0, 0, 1, 1, 1, helm); }
  if (kind === 'shieldbearer') { K.add(rbox(0.3, 0.3, 0.3, 0.05), arm, 0.02, 0.0, 0, 0, 0, 0, 1, 1, 1, helm); K.add(box(0.012, 0.022, 0.24), acc, 0.175, 0.03, 0, 0, 0, 0, 1, 1, 1, helm); }
  if (kind === 'twinblade') for (const s of [-1, 1]) K.add(fin('hwing', [[0, 0], [-0.22, 0.16], [-0.18, 0.05], [-0.28, 0.02], [-0.12, -0.04]], 0.02), trim, -0.02, 0.1, s * 0.14, 0, 0, 0, 1, 1, 1, helm);
  if (kind === 'stormcaller') { K.add(cone(0.18, 0.42, 12), tab, -0.02, 0.1, 0, 0, 0, 0.25, 1, 1, 1, helm); for (const s of [-1, 1]) K.add(sph(0.022, 8, 6), acc, 0.14, 0.02, s * 0.05, 0, 0, 0, 1, 1, 1, helm); }
  // lance arm (+z, toward the camera): pauldron, couched forearm, gauntlet on the grip
  K.add(cap(0.06, 0.18, 10), arm, 0.1, 0.36, 0.28, 0, 0, -1.1, 1, 1, 1, T);
  K.add(rbox(0.24, 0.1, 0.1, 0.03), arm, 0.2, 0.28, 0.28, 0, 0, -0.1, 1, 1, 1, T);
  K.add(rbox(0.09, 0.09, 0.1, 0.025), dark, 0.32, 0.27, 0.27, 0, 0, 0, 1, 1, 1, T);
  const lance = K.group('lance', T, 0.3, 0.27, 0.27);
  lance.rotation.z = 0.1;
  if (kind === 'stormcaller') {
    K.add(cyl(0.022, 0.026, 2.1, 8), M.brass, 0.85, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, lance);
    for (let i = 0; i < 4; i++) K.add(tor(0.03, 0.008, 10, 6), M.copper, 0.2 + i * 0.5, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, lance);
    K.add(tor(0.11, 0.015, 16, 6), M.brass, 1.95, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, lance);
    K.mesh(ico(0.09, 1), glow(o.accent, 6), 'tip', 1.95, 0, 0, 0, 0, 0, lance);
  } else {
    K.add(lathe('lance', [[0, -0.3], [0.035, -0.28], [0.04, -0.1], [0.05, 0], [0.045, 0.3], [0.03, 1.4], [0.018, 1.95], [0, 2.1]], 12), kind === 'player' ? M.steel : arm, 0, 0, 0, 0, 0, -Math.PI / 2, 1, 1, 1, lance);
    K.add(lathe('vamp', [[0.02, -0.05], [0.16, 0.06], [0.07, 0.14], [0.03, 0.16]], 16), trim, 0.08, 0, 0, 0, 0, -Math.PI / 2, 1, 1, 1, lance);
    for (let i = 0; i < 3; i++) K.add(tor(0.042 - i * 0.004, 0.008, 10, 6), trim, 0.5 + i * 0.45, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, lance);
    K.mesh(cone(0.032, 0.24, 8), glow(o.accent, 5), 'tip', 2.0, 0, 0, 0, 0, -Math.PI / 2, lance);
    K.add(box(0.5, 0.004, 0.06), glow(o.accent, 1.6), 1.2, 0.03, 0, 0, 0, 0, 1, 1, 1, lance);
    if (kind === 'twinblade') K.add(fin('blade2', [[0, 0], [-0.5, 0.06], [-0.55, 0], [-0.5, -0.03]], 0.02), M.chrome, -0.28, 0, 0, 0, 0, 0, 1, 1, 1, lance);
  }
  // shield arm (-z)
  const sh = K.group('shield', T, 0.18, 0.3, -0.3);
  if (kind === 'shieldbearer') {
    K.add(rbox(0.07, 0.9, 0.62, 0.05), arm, 0.18, -0.05, 0.12, 0, 0.5, 0, 1, 1, 1, sh);
    K.add(rbox(0.03, 0.8, 0.08, 0.012), trim, 0.22, -0.05, 0.12, 0, 0.5, 0, 1, 1, 1, sh);
    K.add(rbox(0.03, 0.08, 0.5, 0.012), trim, 0.22, 0.15, 0.12, 0, 0.5, 0, 1, 1, 1, sh);
    K.add(sph(0.06, 10, 8), glow(o.accent, 3), 0.24, 0.15, 0.13, 0, 0, 0, 1, 1, 1, sh);
  } else {
    K.add(rbox(0.05, 0.36, 0.28, 0.06), arm, 0, 0, 0, 0, 0.3, 0, 1, 1, 1, sh);
    K.add(rbox(0.02, 0.3, 0.05, 0.01), trim, 0.03, 0, 0, 0, 0.3, 0, 1, 1, 1, sh);
  }
}
const KIND_LOOK = {
  player: { hide: 0x5e6c7a, armor: 0xd8dde4, trim: 0xd8a62f, eye: 0x9fe8ff, accent: 0x9fe8ff, cloth: 0x2f6cff },
  skirmisher: { hide: 0x6e5646, armor: 0x8a5040, trim: 0x8a8f96, eye: 0xff7a3a, accent: 0xff7a3a, cloth: 0xb04a3a },
  lancer: { hide: 0x4a5462, armor: 0x3a5a8a, trim: 0xb8bec6, eye: 0xff4a3a, accent: 0xff4a3a, cloth: 0x2a4a80 },
  reaver: { hide: 0x3c3248, armor: 0x4a3070, trim: 0x8a6fd0, eye: 0xd060ff, accent: 0xd060ff, cloth: 0x3a2060 },
  shieldbearer: { hide: 0x5a5a5e, armor: 0x8a8f96, trim: 0xc8a050, eye: 0xffb030, accent: 0xffb030, cloth: 0x5a5a60 },
  twinblade: { hide: 0x3a545c, armor: 0x2f8a72, trim: 0xc0d0c8, eye: 0x60ffd0, accent: 0x60ffd0, cloth: 0x1f5a4c },
  stormcaller: { hide: 0x545440, armor: 0x9a8040, trim: 0xe0c070, eye: 0x9fd0ff, accent: 0xa8d8ff, cloth: 0x50483a },
};
// a skyray with its lancer. o: { armor, accent } override the player's colours; elite adds gold trim
export function lancer(kind = 'player', o = {}) {
  const L = { ...KIND_LOOK[kind] || KIND_LOOK.lancer, ...o };
  if (o.elite) L.trim = 0xe8c050;
  const key = 'lancer:' + kind + ':' + L.armor + ':' + L.accent + ':' + (o.elite ? 1 : 0);
  const g = make(key, () => {
    const K = new Kit();
    K.noShadow = 'tip';
    const mount = K.group('mount');
    skyrayParts(K, mount, { hide: paint(L.hide, 0.62, 0.15), armor: paint(kind === 'player' ? 0x9aa3ad : L.armor, 0.34, 0.75), trim: paint(L.trim, 0.3, 0.85), eye: L.eye });
    riderParts(K, mount, { armor: paint(L.armor, 0.3, 0.75), trim: paint(L.trim, 0.28, 0.9), accent: L.accent, cloth: L.cloth, kind });
    return K.build();
  });
  const n = (k) => by(g, k);
  return { g, mount: n('mount'), wingL: n('wingL'), wingR: n('wingR'), tipL: n('tipL'), tipR: n('tipR'), tail: n('tail'), tail2: n('tail2'), head: n('head'), rider: n('rider'), torso: n('torso'), helm: n('helm'), lance: n('lance'), tip: n('tip'), shield: n('shield') };
}

// ------------------------------------------------------------------ the Stormhunter: a mechanical harrier with one eye
export function hunter() {
  const g = make('hunter', () => {
    const K = new Kit();
    const hull = paint(0x3a3e46, 0.3, 0.9), plateM = paint(0x7a8088, 0.26, 0.95), red = glow(0xff3020, 6);
    const body = K.group('body');
    K.add(rbox(1.5, 0.34, 0.42, 0.1), hull, 0, 0.7, 0, 0, 0, 0.05, 1, 1, 1, body);
    K.add(rbox(0.9, 0.2, 0.36, 0.06), plateM, 0.1, 0.9, 0, 0, 0, 0.04, 1, 1, 1, body);
    K.add(fin('keel', [[0.6, 0], [0.2, -0.3], [-0.5, -0.12], [-0.6, 0]], 0.06), hull, 0, 0.56, 0, 0, 0, 0, 1, 1, 1, body);
    for (let i = 0; i < 5; i++) K.add(box(0.04, 0.03, 0.36), M.black, 0.4 - i * 0.16, 0.88, 0, 0, 0, 0, 1, 1, 1, body);
    // neck and head with a hooked beak and the single eye
    K.add(cyl(0.1, 0.13, 0.4, 10), hull, 0.82, 0.86, 0, 0, 0, -1.1, 1, 1, 1, body);
    const head = K.group('head', body, 1.05, 0.92, 0);
    K.add(rbox(0.32, 0.22, 0.24, 0.06), plateM, 0, 0, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(cone(0.08, 0.36, 8), M.chrome, 0.28, -0.04, 0, 0, 0, -Math.PI / 2 - 0.35, 1, 1, 1, head);
    K.mesh(sph(0.075, 14, 10), red, 'eye', 0.12, 0.02, 0, 0, 0, 0, head);
    K.add(tor(0.085, 0.015, 16, 6), M.chrome, 0.13, 0.02, 0, 0, Math.PI / 2, 0, 1, 1, 1, head);
    for (const s of [-1, 1]) K.add(fin('crest', [[0, 0], [-0.3, 0.12], [-0.24, 0.02]], 0.02), hull, -0.08, 0.1, s * 0.08, 0, 0, 0, 1, 1, 1, head);
    // thrusters and tail blades
    for (const s of [-1, 1]) { K.add(cyl(0.08, 0.1, 0.3, 12), M.frame, -0.7, 0.7, s * 0.14, 0, 0, Math.PI / 2, 1, 1, 1, body); K.add(cyl(0.06, 0.06, 0.02, 12), glow(0xff8040, 6), -0.86, 0.7, s * 0.14, 0, 0, Math.PI / 2, 1, 1, 1, body); }
    const tail = K.group('tail', body, -0.75, 0.75, 0);
    for (let i = 0; i < 3; i++) K.add(plate('tf' + i, [[0, -0.06], [-0.9 + i * 0.1, -0.2 + i * 0.2], [-0.95 + i * 0.1, -0.1 + i * 0.2], [0, 0.06]], 0.02), plateM, 0, i * 0.02, (i - 1) * 0.12, 0, (i - 1) * 0.3, 0, 1, 1, 1, tail);
    // blade wings of overlapping steel feathers
    for (const s of [-1, 1]) {
      const w = K.group(s < 0 ? 'wingL' : 'wingR', body, 0.2, 0.9, s * 0.2);
      for (let i = 0; i < 6; i++) {
        const z = s * (0.15 + i * 0.32), len = 0.9 - i * 0.08;
        K.add(plate('fe' + (s < 0 ? 'l' : 'r') + i, s < 0 ? mirror([[0.2, 0], [0.05, 0.12], [-len, 0.1], [-len - 0.15, 0]]) : [[0.2, 0], [0.05, 0.12], [-len, 0.1], [-len - 0.15, 0]], 0.025), i % 2 ? plateM : hull, -i * 0.06, 0.01 * i, z, 0, s * (0.05 + i * 0.06), 0, 1, 1, 1, w);
      }
      K.rod(M.chrome, 0.2, 0.03, 0, -0.2, 0.03, s * 1.9, 0.03, w, 8);
      K.add(sph(0.04, 8, 6), red, -0.2, 0.03, s * 1.92, 0, 0, 0, 1, 1, 1, w);
    }
    // talons
    for (const s of [-1, 1]) { K.rod(M.frame, 0.1, 0.55, s * 0.12, 0.25, 0.25, s * 0.14, 0.03, body); for (let k = 0; k < 3; k++) K.add(cone(0.02, 0.14, 6), M.chrome, 0.3 + k * 0.04, 0.2, s * 0.14 + (k - 1) * 0.04, 0, 0, -2.4, 1, 1, 1, body); }
    return K.build();
  });
  return { g, body: by(g, 'body'), head: by(g, 'head'), eye: by(g, 'eye'), wingL: by(g, 'wingL'), wingR: by(g, 'wingR'), tail: by(g, 'tail') };
}

// ------------------------------------------------------------------ the ember core: a glowing crystal pod in a brass cage
export function core() {
  const g = make('core', () => {
    const K = new Kit();
    const c = K.group('cage');
    for (let i = 0; i < 3; i++) K.add(tor(0.26 - Math.abs(i - 1) * 0.07, 0.022, 20, 6), M.brass, 0, (i - 1) * 0.2, 0, Math.PI / 2, 0, 0, 1, 1, 1, c);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; K.rod(M.brass, Math.cos(a) * 0.19, -0.27, Math.sin(a) * 0.19, Math.cos(a) * 0.19, 0.27, Math.sin(a) * 0.19, 0.014, c, 6); }
    K.add(cone(0.12, 0.12, 8), M.brass, 0, 0.32, 0, 0, 0, 0, 1, 1, 1, c);
    K.add(cone(0.12, 0.12, 8), M.brass, 0, -0.32, 0, Math.PI, 0, 0, 1, 1, 1, c);
    K.mesh(ico(0.17, 0), glow(0xff7a2a, 4), 'crystal', 0, 0, 0, 0, 0, 0);
    K.mesh(sph(0.09, 10, 8), glow(0xffd8a0, 9), 'heart', 0, 0, 0, 0, 0, 0);
    return K.build();
  });
  const cr = by(g, 'crystal'); if (cr) cr.scale.set(1, 1.6, 1);
  return { g, cage: by(g, 'cage'), crystal: cr, heart: by(g, 'heart') };
}
// a power-up orb: a lit glass sphere in a gimbal
export function pickup(color) {
  const g = make('pickup' + color, () => {
    const K = new Kit();
    K.mesh(sph(0.42, 20, 14), glow(color, 2.2), 'orb', 0, 0, 0);
    const ring = K.group('ring');
    K.add(tor(0.6, 0.035, 32, 8), M.chrome, 0, 0, 0, 0, 0, 0, 1, 1, 1, ring);
    K.add(tor(0.6, 0.02, 32, 8), glow(color, 4), 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, ring);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; K.add(sph(0.06, 8, 6), M.brass, Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0, 0, 0, 0, 1, 1, 1, ring); }
    return K.build();
  });
  return { g, orb: by(g, 'orb'), ring: by(g, 'ring') };
}

// ------------------------------------------------------------------ bosses
export function boss(key) {
  const g = make('boss:' + key, () => buildBoss(key));
  const n = (k) => by(g, k);
  return { g, key, wingL: n('wingL'), wingR: n('wingR'), tipL: n('tipL'), tipR: n('tipR'), tail: n('tail'), head: n('head'), hatch: n('hatch'), core: n('core'), armL: n('armL'), armR: n('armR'),
    pts: all(g, 'wp'), segs: all(g, 'seg'), riders: all(g, 'rd'), halo: n('halo'), gem: n('gem'), furnace: n('furnace') };
}
function buildBoss(key) {
  const K = new Kit();
  if (key === 'gale') {
    // THE IRON GALE: a giant war skyray in riveted iron, three riders on its back over a sealed core hatch
    const hull = K.group('hull', K.root, 0, -1.25, 0);
    hull.scale.setScalar(3.4);
    skyrayParts(K, hull, { hide: paint(0x2c2a28, 0.55, 0.3), armor: paint(0x5a5550, 0.36, 0.85), trim: paint(0xb87a3a, 0.3, 0.9), eye: 0xff5a20, belly: 0x5a4a40 });
    for (let i = 0; i < 3; i++) {
      const r = K.group('wp' + i, K.root, [-1.6, 0, 1.6][i], 1.15, 0);
      r.scale.setScalar(1.15);
      riderParts(K, r, { armor: paint(0x6a2a24, 0.32, 0.75), trim: paint(0xb87a3a, 0.3, 0.9), accent: 0xff5a20, cloth: 0x4a1a14, kind: i === 1 ? 'reaver' : 'lancer' });
    }
    const hatch = K.group('hatch', K.root, 0, 1.25, 0);
    K.add(rbox(1.5, 0.18, 1.6, 0.06), paint(0x5a5550, 0.34, 0.85), 0, 0, 0, 0, 0, 0, 1, 1, 1, hatch);
    for (const s of [-1, 1]) K.add(rbox(1.4, 0.06, 0.1, 0.02), paint(0xb87a3a, 0.3, 0.9), 0, 0.1, s * 0.6, 0, 0, 0, 1, 1, 1, hatch);
    const core = K.group('wp3', K.root, 0, 1.2, 0);
    K.mesh(ico(0.75, 1), glow(0xff7a2a, 4), 'core', 0, 0, 0, 0, 0, 0, core);
    K.add(tor(0.85, 0.08, 28, 8), M.brass, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, core);
  } else if (key === 'wyvern') {
    // THE CRYSTAL WYVERN: a construct of dark stone plates and living crystal
    const stone = paint(0x4a5c6c, 0.5, 0.35), plateM = paint(0x648094, 0.32, 0.7), cry = glow(0x5ae8ff, 3), cryD = paint(0x9fe4ff, 0.1, 0.3), vein = glow(0x5ae8ff, 1.8);
    K.add(sph(1, 26, 16), stone, 0, 0, 0, 0, 0, 0, 3.2, 0.95, 1.4);
    for (let i = 0; i < 7; i++) { K.add(rbox(0.9, 0.16, 1.6 - Math.abs(i - 3) * 0.16, 0.06), plateM, 2.4 - i * 0.8, 0.82 - Math.abs(i - 3) * 0.06, 0, 0, 0, -0.08 + i * 0.03); K.add(box(0.7, 0.03, 0.06), vein, 2.4 - i * 0.8, 0.92 - Math.abs(i - 3) * 0.06, 0, 0, 0, -0.08 + i * 0.03); }
    for (let i = 0; i < 5; i++) { K.add(sph(0.42 - i * 0.03, 14, 10), stone, 3.1 + i * 0.42, 0.35 + i * 0.22, 0); K.add(rbox(0.34, 0.1, 0.5, 0.04), plateM, 3.1 + i * 0.42, 0.72 + i * 0.22, 0, 0, 0, -0.4); }
    const head = K.group('head', K.root, 5.3, 1.45, 0);
    K.add(rbox(1.1, 0.5, 0.7, 0.14), stone, 0.2, 0, 0, 0, 0, -0.1, 1, 1, 1, head);
    K.add(rbox(0.9, 0.16, 0.6, 0.06), plateM, 0.3, 0.3, 0, 0, 0, -0.2, 1, 1, 1, head);
    K.add(rbox(0.8, 0.16, 0.5, 0.06), stone, 0.35, -0.3, 0, 0, 0, 0.15, 1, 1, 1, head);
    for (const s of [-1, 1]) { K.add(sph(0.09, 10, 8), cry, 0.55, 0.12, s * 0.3, 0, 0, 0, 1, 1, 1, head); K.add(cone(0.1, 0.9, 6), cryD, -0.2, 0.45, s * 0.25, s * 0.3, 0, 0.9, 1, 1, 1, head); }
    const tail = K.group('tail', K.root, -3.0, 0, 0);
    for (let i = 0; i < 6; i++) { K.add(sph(0.5 - i * 0.07, 12, 8), stone, -i * 0.6, -0.1 * i, 0, 0, 0, 0, 1.3, 1, 1, tail); if (i % 2 === 0) K.add(cone(0.12, 0.6, 6), cryD, -i * 0.6, 0.45 - 0.1 * i, 0, 0, 0, 0.3, 1, 1, 1, tail); }
    K.add(fin('wtail', [[0, 0], [-1.2, 0.5], [-1.0, 0], [-1.2, -0.5]], 0.08), cryD, -3.6, -0.6, 0, 0, 0, 0, 1, 1, 1, tail);
    for (const s of [-1, 1]) {
      const w = K.group(s < 0 ? 'wingL' : 'wingR', K.root, 0.6, 0.5, s * 1.1);
      K.rod(plateM, 0.8, 0, 0, -0.2, 0.4, s * 3.4, 0.14, w, 10);
      K.rod(plateM, -0.2, 0.4, s * 3.4, -1.6, 0.1, s * 5.0, 0.1, w, 8);
      for (let i = 0; i < 6; i++) K.add(plate('cw' + (s < 0 ? 'l' : 'r') + i, s < 0 ? mirror([[0.5, 0], [0.2, 0.9], [-0.5, 1.2], [-0.6, 0]]) : [[0.5, 0], [0.2, 0.9], [-0.5, 1.2], [-0.6, 0]], 0.05), i % 2 ? cryD : plateM, 0.2 - i * 0.3, 0.15, s * (0.4 + i * 0.75), 0, s * (0.1 + i * 0.1), 0, 1, 1, 1, w);
    }
    for (let i = 0; i < 3; i++) {
      const c = K.group('wp' + i, K.root, [-1.4, 0.2, 1.8][i], 1.3, 0);
      K.mesh(ico(0.55, 0), cry, 'crys' + i, 0, 0.2, 0, 0, 0, 0, c);
      for (const s of [-1, 1]) K.add(cone(0.18, 0.8, 5), cryD, 0, 0.1, s * 0.4, s * 0.5, 0, 0, 1, 1, 1, c);
      K.add(tor(0.6, 0.06, 20, 6), M.brass, 0, -0.1, 0, Math.PI / 2, 0, 0, 1, 1, 1, c);
    }
  } else if (key === 'colossus') {
    // THE FORGE COLOSSUS: an iron giant wading through the sea, furnace heart, vents on the shoulders and head
    const iron = paint(0x3e3832, 0.42, 0.85), plateM = paint(0x6a6056, 0.36, 0.9), brass = paint(0xb88a40, 0.3, 0.95), fire = glow(0xff6a1a, 2.6), furnaceGlow = glow(0xff7a2a, 1.8);
    K.add(cyl(2.2, 2.6, 2.0, 24), iron, 0, 0.8, 0);
    K.add(tor(2.4, 0.18, 30, 8), brass, 0, 1.6, 0, Math.PI / 2, 0, 0);
    K.add(rbox(4.6, 4.8, 3.0, 0.4), iron, 0, 4.4, 0);
    for (let i = 0; i < 4; i++) K.add(rbox(4.0 - i * 0.2, 0.3, 3.1, 0.1), plateM, 0, 2.4 + i * 1.1, 0);
    K.add(rbox(4.9, 1.4, 3.2, 0.3), plateM, 0, 7.2, 0);
    const furnace = K.group('furnace', K.root, 0, 4.6, 1.52);
    K.mesh(box(1.8, 1.6, 0.1), furnaceGlow, 'furnace', 0, 0, 0, 0, 0, 0, furnace);
    for (let i = 0; i < 6; i++) K.add(box(0.08, 1.8, 0.16), M.black, -0.8 + i * 0.32, 0, 0.06, 0, 0, 0, 1, 1, 1, furnace);
    K.add(tor(1.25, 0.12, 4, 6), brass, 0, 0, 0.08, 0, 0, Math.PI / 4, 1, 1, 1, furnace);
    for (const s of [-1, 1]) {
      K.add(sph(1.3, 20, 14), plateM, s * 2.6, 8.0, 0, 0, 0, 0, 1, 0.8, 1);
      const v = K.group('wp' + (s < 0 ? 0 : 1), K.root, s * 2.4, 9.0, 0);
      K.add(cyl(0.7, 0.9, 0.5, 18), iron, 0, -0.1, 0, 0, 0, 0, 1, 1, 1, v);
      K.mesh(cyl(0.55, 0.55, 0.06, 18), fire, 'ventglow', 0, 0.16, 0, 0, 0, 0, v);
      for (let i = 0; i < 4; i++) K.add(box(1.1, 0.06, 0.08), M.black, 0, 0.2, -0.4 + i * 0.27, 0, 0, 0, 1, 1, 1, v);
      const a = K.group(s < 0 ? 'armL' : 'armR', K.root, s * 3.4, 7.8, 0);
      K.add(cap(0.7, 2.2, 14), iron, s * 0.3, -1.6, 0, 0, 0, s * 0.15, 1, 1, 1, a);
      K.add(rbox(1.4, 2.4, 1.4, 0.2), plateM, s * 0.55, -4.0, 0, 0, 0, s * 0.1, 1, 1, 1, a);
      K.add(rbox(1.5, 1.2, 1.5, 0.25), iron, s * 0.7, -5.6, 0, 0, 0, 0, 1, 1, 1, a);
      if (s > 0) { K.add(cyl(0.18, 0.18, 3.0, 10), M.frame, 0.9, -6.2, 0, 0, 0, Math.PI / 2, 1, 1, 1, a); K.add(rbox(1.0, 1.6, 1.4, 0.15), plateM, 2.3, -6.2, 0, 0, 0, 0, 1, 1, 1, a); K.add(box(0.06, 1.4, 1.2), fire, 2.82, -6.2, 0, 0, 0, 0, 1, 1, 1, a); }
      for (let i = 0; i < 5; i++) K.add(tor(0.12, 0.05, 8, 6), M.steel, s * 2.0, 6.6 - i * 0.32, 1.2, i % 2 ? 0 : Math.PI / 2, 0, 0);
    }
    const head = K.group('head', K.root, 0, 10.0, 0);
    K.add(rbox(1.7, 1.5, 1.6, 0.25), plateM, 0, 0, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(box(1.2, 0.18, 0.1), fire, 0, 0.1, 0.82, 0, 0, 0, 1, 1, 1, head);
    K.add(rbox(1.9, 0.3, 1.8, 0.1), brass, 0, -0.6, 0, 0, 0, 0, 1, 1, 1, head);
    const v2 = K.group('wp2', K.root, 0, 11.4, 0);
    K.add(cyl(0.55, 0.7, 0.5, 16), iron, 0, -0.2, 0, 0, 0, 0, 1, 1, 1, v2);
    K.mesh(cyl(0.42, 0.42, 0.06, 16), fire, 'ventglow2', 0, 0.06, 0, 0, 0, 0, v2);
  } else if (key === 'leviathan') {
    // THE GLACIER LEVIATHAN: head + seven body segments, frost cores on segments 2-4
    const hide = paint(0x2a3a48, 0.45, 0.25), ice = paint(0xcfe8f8, 0.15, 0.1), pale = paint(0x8aa8bc, 0.5, 0.1), frost = glow(0x8ae8ff, 4);
    for (let i = 0; i < 8; i++) {
      const s = K.group('seg' + i, K.root, 0, 0, 0);
      const r = i === 0 ? 1.45 : 1.3 - i * 0.07;
      if (i === 0) {
        K.add(sph(1, 22, 14), hide, 0, 0, 0, 0, 0, 0, 1.8, 1.0, 1.15, s);
        K.add(rbox(1.6, 0.4, 1.3, 0.15), pale, 0.8, -0.55, 0, 0, 0, 0.1, 1, 1, 1, s);
        for (let k = 0; k < 6; k++) K.add(cone(0.08, 0.35, 6), ice, 1.3 - k * 0.2, -0.3, 0.55, Math.PI, 0, 0, 1, 1, 1, s);
        for (const z of [-0.6, 0.6]) { K.add(sph(0.12, 10, 8), frost, 1.1, 0.35, z, 0, 0, 0, 1, 1, 1, s); K.add(cone(0.18, 1.4, 6), ice, -0.4, 0.9, z * 0.8, z * 0.4, 0, 1.1, 1, 1, 1, s); }
      } else {
        K.add(sph(1, 18, 12), hide, 0, 0, 0, 0, 0, 0, 1.0, r * 0.85, r, s);
        K.add(sph(1, 16, 10), pale, 0, -r * 0.3, 0, 0, 0, 0, 0.9, r * 0.55, r * 0.85, s);
        for (let k = 0; k < 3; k++) K.add(cone(0.12, 0.5 + (k === 1 ? 0.3 : 0), 6), ice, -0.3 + k * 0.3, r * 0.75, 0, 0, 0, 0, 1, 1, 1, s);
        for (const z of [-1, 1]) K.add(fin('levfin', [[0.3, 0], [-0.4, 0.6], [-0.6, 0]], 0.04), pale, 0, -0.2, z * r * 0.9, z * 0.6, 0, 0, 1, 1, 1, s);
        if (i >= 2 && i <= 4) { const c = K.group('wp' + (i - 2), s, 0, 1.15, 0); K.mesh(ico(0.6, 1), frost, 'frost' + i, 0, 0, 0, 0, 0, 0, c); K.add(tor(0.7, 0.07, 20, 6), ice, 0, -0.2, 0, Math.PI / 2, 0, 0, 1, 1, 1, c); }
      }
    }
  } else if (key === 'sovereign') {
    // THE ECLIPSE SOVEREIGN: a winged monarch in black armour with a crown gem, a black sun behind
    const blk = paint(0x2a2432, 0.28, 0.85), gold = paint(0xe0b050, 0.25, 1), robe = cloth(0x2e1a48, 0.9), vio = glow(0xc080ff, 3);
    K.add(lathe('robe', [[0, -1.6], [1.2, -1.5], [1.0, -0.6], [0.7, 0.4], [0.55, 1.0], [0, 1.1]], 20), robe, 0, 0, 0);
    K.add(rbox(1.2, 1.1, 0.9, 0.2), blk, 0, 1.3, 0);
    K.add(rbox(0.1, 0.9, 0.5, 0.04), gold, 0.62, 1.3, 0);
    for (const s of [-1, 1]) { K.add(sph(0.45, 16, 12), blk, 0, 1.75, s * 0.75, 0, 0, 0, 1, 0.8, 1); K.add(cone(0.12, 0.6, 6), gold, 0, 2.1, s * 0.85, s * -0.4, 0, 0, 1, 1, 1); }
    const head = K.group('head', K.root, 0.05, 2.35, 0);
    K.add(lathe('shelm', [[0, -0.32], [0.3, -0.3], [0.34, 0], [0.3, 0.25], [0, 0.32]], 18), blk, 0, 0, 0, 0, 0, 0, 1, 1, 1, head);
    K.add(box(0.04, 0.05, 0.4), vio, 0.33, 0.02, 0, 0, 0, 0, 1, 1, 1, head);
    for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; K.add(cone(0.06, 0.4, 5), gold, Math.cos(a) * 0.3, 0.42, Math.sin(a) * 0.3, 0, 0, 0, 1, 1, 1, head); }
    K.add(tor(0.32, 0.05, 20, 6), gold, 0, 0.3, 0, Math.PI / 2, 0, 0, 1, 1, 1, head);
    const gem = K.group('wp0', K.root, 0, 3.4, 0);
    K.mesh(ico(0.42, 0), glow(0xf0d8ff, 6), 'gem', 0, 0, 0, 0, 0, 0, gem);
    K.add(tor(0.5, 0.05, 20, 6), gold, 0, 0, 0, 0, 0, 0, 1, 1, 1, gem);
    for (const s of [-1, 1]) {
      const w = K.group(s < 0 ? 'wingL' : 'wingR', K.root, -0.3, 1.6, s * 0.6);
      for (let i = 0; i < 7; i++) {
        K.add(plate('sw' + (s < 0 ? 'l' : 'r') + i, s < 0 ? mirror([[0.3, 0], [0.1, 0.9], [-1.6 + i * 0.1, 1.2], [-1.8 + i * 0.1, 0]]) : [[0.3, 0], [0.1, 0.9], [-1.6 + i * 0.1, 1.2], [-1.8 + i * 0.1, 0]], 0.05), i % 2 ? blk : robe, 0.1 - i * 0.1, 0.3 + i * 0.25, s * (0.2 + i * 0.6), 0.0, s * (0.1 + i * 0.12), 0.25, 1, 1, 1, w);
        K.add(box(0.5, 0.03, 0.04), gold, 0.2 - i * 0.1, 0.36 + i * 0.25, s * (0.25 + i * 0.6), 0, 0, 0.25, 1, 1, 1, w);
        K.add(box(1.2, 0.02, 0.03), vio, -0.7 + i * 0.05, 0.32 + i * 0.25, s * (0.3 + i * 0.6), 0, s * (0.1 + i * 0.12), 0.25, 1, 1, 1, w);
      }
    }
    const halo = K.group('halo', K.root, -1.2, 2.2, 0);
    K.mesh(cyl(2.4, 2.4, 0.05, 40), M.black, 'disc', 0, 0, 0, 0, 0, Math.PI / 2, halo);
    K.mesh(tor(2.5, 0.12, 48, 8), glow(0xffc070, 4), 'corona', 0, 0, 0, 0, Math.PI / 2, 0, halo);
  }
  return K.build();
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
export const GEO = { box, cyl, sph, cap, tor, rbox };
// a plain mesh helper (scenery)
export function add(p, g, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
