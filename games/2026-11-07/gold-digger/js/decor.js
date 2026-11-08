// Decorations and set pieces. Everything static is placed as model clones and then BAKED: merged per material into
// a handful of meshes, so a level full of timber, lanterns, mushrooms and crystals costs a few draw calls.
// Things that glow register light "emitters" the renderer's light pool can aim at.
// The wonders (one per level in the campaign) are big set pieces in a room whose back wall is pushed far back.
import * as THREE from '../vendor/three.module.min.js';
import { T, SOLID } from './config.js?v=16';

function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// merge every mesh under `roots` into one mesh per material (world transforms baked in)
export function bake(roots, opts = {}) {
  const buckets = new Map();
  for (const r of roots) {
    r.updateMatrixWorld(true);
    r.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.visible) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      if (mats.length !== 1) return;
      const m = mats[0];
      let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      g.applyMatrix4(o.matrixWorld);
      const n = g.attributes.position.count;
      const keep = { position: g.attributes.position, normal: g.attributes.normal || null, color: g.attributes.color || null, uv: g.attributes.uv || null };
      if (!keep.normal) { g.computeVertexNormals(); keep.normal = g.attributes.normal; }
      const e = buckets.get(m) || { m, parts: [], n: 0, uv: !!m.map || !!m.normalMap || !!m.roughnessMap, shadow: o.castShadow };
      e.parts.push({ g, keep, n });
      e.n += n;
      buckets.set(m, e);
    });
  }
  const group = new THREE.Group();
  for (const e of buckets.values()) {
    const pos = new Float32Array(e.n * 3), nrm = new Float32Array(e.n * 3), col = new Float32Array(e.n * 3), uv = e.uv ? new Float32Array(e.n * 2) : null;
    let o = 0;
    for (const p of e.parts) {
      const P = p.keep.position, N = p.keep.normal, C = p.keep.color, U = p.keep.uv;
      for (let i = 0; i < p.n; i++, o++) {
        pos[o * 3] = P.getX(i); pos[o * 3 + 1] = P.getY(i); pos[o * 3 + 2] = P.getZ(i);
        nrm[o * 3] = N.getX(i); nrm[o * 3 + 1] = N.getY(i); nrm[o * 3 + 2] = N.getZ(i);
        if (C) { col[o * 3] = C.getX(i); col[o * 3 + 1] = C.getY(i); col[o * 3 + 2] = C.getZ(i); } else { col[o * 3] = col[o * 3 + 1] = col[o * 3 + 2] = 1; }
        if (uv) { if (U) { uv[o * 2] = U.getX(i); uv[o * 2 + 1] = U.getY(i); } }
      }
      p.g.dispose();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (uv) g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.computeBoundingSphere();
    const mesh = new THREE.Mesh(g, e.m);
    mesh.castShadow = opts.shadow !== false && e.shadow !== false; mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

const WF_FRAG = `uniform float uT; uniform vec3 uCol; uniform float uLava; varying vec2 vUv; varying vec3 vW;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
void main(){
  bool lava = uLava > 0.5;
  float sp = lava ? 0.45 : 2.2;
  // the edges wobble as the sheet swings
  float wob = (n(vec2(vW.y * 1.1 - uT * sp * 0.8, 3.7)) - 0.5) * 0.22;
  float x = vUv.x + wob;
  float edge = smoothstep(0.0, 0.22, x) * smoothstep(1.0, 0.78, x);
  // long falling streaks (world space, so every fall has the same grain) and fine fast threads
  float st = fbm(vec2(vW.x * 6.0, vW.y * 0.45 + uT * sp));
  float th = n(vec2(vW.x * 26.0, vW.y * 1.2 + uT * sp * 1.7));
  float s = st * 0.8 + th * 0.35;
  float foot = smoothstep(0.24, 0.0, vUv.y), lip = smoothstep(0.9, 1.0, vUv.y);
  if (lava) {
    float crust = smoothstep(0.46, 0.62, fbm(vec2(vW.x * 3.0, vW.y * 0.35 + uT * sp * 0.6)));
    float core = 1.0 - abs(vUv.x - 0.5) * 2.0;
    vec3 hot = mix(vec3(2.0, 0.42, 0.06), vec3(2.8, 1.3, 0.3), smoothstep(0.55, 1.0, core) * (1.0 - crust) * (0.6 + 0.4 * st));
    vec3 c = mix(hot, vec3(0.22, 0.04, 0.02), crust * 0.85) + vec3(2.5, 0.6, 0.1) * foot;
    gl_FragColor = vec4(c, edge * smoothstep(0.0, 0.04, vUv.y));
  } else {
    float foam = foot * (0.6 + 0.6 * n(vec2(vW.x * 9.0, vW.y * 4.0 + uT * 3.0)));
    vec3 c = uCol * (0.4 + s * 1.0) + vec3(0.75, 0.85, 0.9) * (foam * 1.3 + lip * 0.35 + pow(th, 6.0) * 0.6);
    float a = edge * (0.25 + s * 0.7 + foam * 0.6) * smoothstep(0.0, 0.05, vUv.y);
    gl_FragColor = vec4(c, a * 0.8);
  }
}`;
const MIST_FRAG = `uniform float uT; uniform vec3 uCol; uniform float uA; varying vec2 vUv; varying vec3 vW;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
void main(){
  float f = fbm(vec2(vW.x * 0.45 + uT * 0.07, vW.y * 1.1 - uT * 0.025 + vW.z));
  float band = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.25, vUv.y);
  float side = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x);
  band *= 0.75 + 0.25 * n(vec2(vW.x * 0.8 - uT * 0.1, 7.0));
  gl_FragColor = vec4(uCol, smoothstep(0.3, 0.75, f) * band * side * uA);
}`;
const WF_VERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GW_VERT = `attribute float aPh; uniform float uT; uniform float uScale; varying float vA;
void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = 0.55 + 0.45 * sin(uT * 1.7 + aPh * 6.28); gl_PointSize = uScale * 0.09 / max(0.5, -mv.z) * (0.7 + vA * 0.6); gl_Position = projectionMatrix * mv; }`;
// each level's set (render.js VARIANTS); the first level of a depth uses the depth's own
const SETS = ['workings', 'garden', 'amethyst', 'streets', 'basalt'];
// floating motes: colour, size, life, drift; fire = the fire particle pool (embers)
const MOTES = {
  garden: { rate: 6, c: [0.3, 1, 0.8], s0: 0.12, s1: 0.06, life: 4, a: 0.7, vy: 0.15, grav: -0.02 },
  bluecap: { rate: 7, c: [0.45, 0.6, 1], s0: 0.12, s1: 0.05, life: 4, a: 0.7, vy: 0.12, grav: -0.02 },
  roots: { rate: 6, c: [1, 0.85, 0.4], s0: 0.08, s1: 0.05, life: 5, a: 0.75, vy: 0.04, jx: 0.5, grav: 0 },
  amethyst: { rate: 6, c: [0.85, 0.7, 1], s0: 0.25, s1: 0.05, life: 1.5, a: 0.8, vy: 0.05, jx: 0, fade: 0.6 },
  rose: { rate: 6, c: [1, 0.65, 0.75], s0: 0.22, s1: 0.05, life: 1.6, a: 0.8, vy: 0.05, jx: 0, fade: 0.6 },
  frost: { rate: 10, c: [0.9, 0.95, 1], s0: 0.07, s1: 0.06, life: 6, a: 0.75, vy: -0.35, jx: 0.4, dy: 3, grav: 0.02, fade: 0.3 },
  rust: { rate: 6, c: [1, 0.5, 0.22], s0: 0.06, s1: 0.04, life: 5, a: 0.6, vy: -0.15, jx: 0.3, dy: 3, grav: 0.03 },
  salt: { rate: 6, c: [0.95, 0.94, 0.88], s0: 0.06, s1: 0.04, life: 5, a: 0.55, vy: -0.08, jx: 0.3, dy: 2 },
  tide: { rate: 8, c: [0.5, 0.9, 1], s0: 0.06, s1: 0.1, life: 4, a: 0.6, vy: 0.5, jy: 0.4, jx: 0.15, dy: -2, grav: -0.05 },
  basalt: { rate: 6, fire: 1, c: [1, 0.45, 0.12], s0: 0.1, s1: 0.04, life: 3, a: 1, vy: 0.8, jy: 1, jx: 0.4, dy: -2, drag: 0.2, grav: -0.2 },
  obsidian: { rate: 7, fire: 1, c: [0.85, 0.3, 1], s0: 0.1, s1: 0.04, life: 3, a: 1, vy: 0.7, jy: 1, jx: 0.4, dy: -2, drag: 0.2, grav: -0.2 },
  sulfur: { rate: 6, fire: 1, c: [1, 0.75, 0.2], s0: 0.08, s1: 0.03, life: 3, a: 0.9, vy: 0.6, jy: 0.8, jx: 0.4, dy: -2, drag: 0.2, grav: -0.15 },
};
const GW_FRAG = `uniform sampler2D uTex; uniform vec3 uCol; varying float vA; void main(){ vec4 t = texture2D(uTex, gl_PointCoord); gl_FragColor = vec4(uCol * 2.2 * vA, t.a * vA); }`;

export function buildDecor(M, look, W, K) {
  const { make, obj, tex, q } = K;
  const R = rng((M.seed * 97 + M.depth * 13 + M.level * 5 + 11) >>> 0);
  const at = (x, y) => (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x];
  const open = (x, y) => !SOLID[at(x, y)] && at(x, y) !== T.WATER && at(x, y) !== T.LAVA;
  const solid = (x, y) => SOLID[at(x, y)] === 1;
  const group = new THREE.Group();
  const statics = [];
  const emitters = [];
  const anim = [];
  const dens = q.decor;
  const place = (o, x, y, z, s = 1, ry = 0) => { const g = obj(o); g.position.set(x, y, z); g.scale.multiplyScalar(s); g.rotation.y = ry; statics.push(g); return g; };
  const biome = M.biome;
  // candidate spots
  const floors = [], ceils = [];
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) {
    if (open(x, y) && solid(x, y - 1) && open(x, y + 1)) floors.push([x, y]);
    if (open(x, y) && solid(x, y + 1) && open(x, y - 1)) ceils.push([x, y]);
  }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  shuffle(floors); shuffle(ceils);
  const near = (x, y, list, d) => list.some((p) => Math.abs(p[0] - x) < d && Math.abs(p[1] - y) < d);
  const avoid = [[M.start.x, M.start.y]].concat(M.exit ? [[M.exit.x, M.exit.y]] : []);
  // ---- stalactites and stalagmites everywhere (background and a few framing the foreground)
  const nStal = Math.round(ceils.length * 0.22 * dens);
  for (let i = 0; i < nStal && i < ceils.length; i++) {
    const [x, y] = ceils[i];
    const back = R() < 0.75;
    const len = 0.6 + R() * (back ? 2.2 : 1.2);
    place(make('stalactite', len), x + R(), y + 1.05, back ? -1.4 - R() * 2.5 : 1.3 + R() * 1.1, 0.8 + R() * 0.6, R() * 6);
  }
  const nMite = Math.round(floors.length * 0.08 * dens);
  for (let i = 0; i < nMite && i < floors.length; i++) {
    const [x, y] = floors[i];
    const g = obj(make('stalactite', 0.8 + R() * 1.6)); g.rotation.z = Math.PI; g.position.set(x + R(), y - 0.05, -1.6 - R() * 2.5); g.scale.setScalar(0.8 + R() * 0.7); statics.push(g);
  }
  // ---- dressing: each level's set (render.js VARIANTS) has its own props
  const fl = floors.slice();
  const take = (n, minGap = 3, pred = () => true) => {
    const out = [];
    for (const p of fl) { if (out.length >= n) break; if (!pred(p)) continue; if (near(p[0], p[1], out, minGap) || near(p[0], p[1], avoid, 4)) continue; out.push(p); }
    return out;
  };
  const headroom = (x, y) => { let h = 0; while (h < 12 && open(x, y + h)) h++; return h; };
  const drop = (x, y) => { let h = 0; while (h < 14 && open(x, y - h)) h++; return h; };   // open cells below a ceiling spot
  const accent = look.accent;
  const set = look.set || SETS[biome % 5];
  const info = { set, roots: 0, shelves: 0 };
  const lantern = (x, y, col = [1, 0.6, 0.26]) => { const ln = obj(make('lantern')); ln.position.set(x, y, -0.55); statics.push(ln); emitters.push({ x, y, z: -0.2, col, int: 6, range: 9, pri: 3, flick: 1 }); };
  const crystals = (n, cols, back = 0.7, glowP = 0.5, smin = 0.5, smax = 1.9) => {
    for (const [x, y] of take(Math.round(n * dens), 2)) {
      const c = cols[Math.floor(R() * cols.length)], s = smin + R() * (smax - smin), z = R() < back ? -1 - R() * 2.5 : 1.2 + R() * 0.6;
      place(make('crystal', s, c), x + R(), y, z, 1, R() * 6);
      if (R() < glowP) emitters.push({ x: x + 0.5, y: y + s * 0.8, z, col: new THREE.Color(c).toArray(), int: 2.2 * s, range: 6, pri: 1.5 });
    }
  };
  // side walls a prop can cling to: [x at the wall face, y, facing +1 (wall on the left) or -1]
  const walls = [];
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) {
    if (!open(x, y) || !open(x, y + 1)) continue;
    if (solid(x - 1, y) && solid(x - 1, y + 1)) walls.push([x, y, 1]);
    else if (solid(x + 1, y) && solid(x + 1, y + 1)) walls.push([x + 1, y, -1]);
  }
  shuffle(walls);
  if (set === 'workings' || set === 'patina') {
    // timber frames across corridors with lanterns, rails and carts (the green drift's frames lean where the ground has moved)
    for (const [x, y] of take(Math.round((set === 'patina' ? 7 : 10) * dens), 5, ([x, y]) => headroom(x, y) >= 3 && headroom(x, y) <= 6 && open(x - 1, y) && open(x + 1, y))) {
      const h = headroom(x, y);
      const f = place(make('timberFrame', 3.2, h), x + 0.5, y, -0.9);
      if (set === 'patina') f.rotation.z = (R() - 0.5) * 0.12;
      if (set === 'workings' || R() < 0.5) lantern(x + 0.5 + (R() < 0.5 ? -1.1 : 1.1), y + h - 0.65);
    }
    for (const [x, y] of take(Math.round((set === 'patina' ? 2 : 4) * dens), 8, ([x, y]) => open(x + 2, y) && open(x - 2, y) && solid(x + 2, y - 1) && solid(x - 2, y - 1))) {
      place(make('rail', 5), x + 0.5, y, -1.5);
      if (R() < 0.6) place(make('cart'), x + 0.5 + (R() - 0.5) * 2, y + 0.05, -1.5);
    }
    // copper ore turned green and blue: malachite and azurite on the floors
    if (set === 'patina') crystals(14, [0x2fbf8a, 0x2f6fd0, 0x48d6b0], 0.75, 0.45, 0.4, 1.3);
  } else if (set === 'rust') {
    // iron frames, pipe runs along the back walls, chains from the roof, a few carts
    for (const [x, y] of take(Math.round(8 * dens), 5, ([x, y]) => headroom(x, y) >= 3 && headroom(x, y) <= 6 && open(x - 1, y) && open(x + 1, y))) {
      const h = headroom(x, y);
      place(make('girder', 3.2, h), x + 0.5, y, -0.9);
      if (R() < 0.6) lantern(x + 0.5 + (R() < 0.5 ? -1.1 : 1.1), y + h - 0.65, [1, 0.42, 0.18]);
    }
    for (const [x, y] of take(Math.round(6 * dens), 9, ([x, y]) => headroom(x, y) >= 3 && open(x - 3, y) && open(x + 3, y))) place(make('pipes', 5 + Math.floor(R() * 4)), x + 0.5, y + 0.8 + R() * 1.4, -2.1);
    for (const [x, y] of ceils.slice(0, Math.round(14 * dens))) { if (drop(x, y) < 4) continue; place(make('chain', 1 + R() * 2.5), x + 0.5, y + 1, -0.8 - R() * 2); }
    for (const [x, y] of take(Math.round(2 * dens), 8, ([x, y]) => open(x + 2, y) && open(x - 2, y) && solid(x + 2, y - 1) && solid(x - 2, y - 1))) { place(make('rail', 5), x + 0.5, y, -1.5); place(make('cart'), x + 0.5, y + 0.05, -1.5); }
  } else if (set === 'garden') {
    for (const [x, y] of take(Math.round(26 * dens), 2)) {
      const s = 0.6 + R() * 1.1, z = R() < 0.7 ? -0.9 - R() * 2.2 : 1.2 + R() * 0.8;
      place(make('mushroom', s), x + R(), y, z, 1, R() * 6);
      if (R() < 0.45) emitters.push({ x: x + 0.5, y: y + s, z, col: accent, int: 2.5 * s, range: 6, pri: 1.5, flick: 0 });
    }
    // hanging roots
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x3a2c22, roughness: 0.9 });
    for (const [x, y] of ceils.slice(0, Math.round(30 * dens))) {
      const len = 1 + R() * 3, pts = [];
      for (let k = 0; k <= 6; k++) pts.push(new THREE.Vector3(x + 0.5 + Math.sin(k + x) * 0.15, y + 1 - len * k / 6, -0.8 - R() * 1.5));
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.035 + R() * 0.03, 5), rootMat); statics.push(m);
    }
  } else if (set === 'bluecap') {
    // forests of tall bluecaps, a few of the round teal kind among them
    for (const [x, y] of take(Math.round(30 * dens), 2)) {
      const s = 0.7 + R() * 1.0, z = R() < 0.75 ? -0.9 - R() * 2.6 : 1.2 + R() * 0.8;
      if (R() < 0.8) place(make('tallcap', s), x + R(), y, z, 1, R() * 6); else place(make('mushroom', s * 0.8), x + R(), y, z, 1, R() * 6);
      if (R() < 0.4) emitters.push({ x: x + 0.5, y: y + s * 1.3, z, col: accent, int: 2.4 * s, range: 6, pri: 1.5 });
    }
  } else if (set === 'roots') {
    // great roots grown down through the roof of the cave, bracket fungus glowing on the walls
    let nr = 0;
    for (const [x, y] of ceils) {
      if (nr >= Math.round(9 * dens)) break;
      const d = drop(x, y);
      if (d < 4 || near(x, y, avoid, 4)) continue;
      const z = -1.15 - R() * 1.0, dx = (R() - 0.5) * 5, top = y + 1.6, bot = y - d + 0.6;
      statics.push(obj(make('bigRoot', [[x + 0.5, top + 1, z - 0.5], [x + 0.5 + dx * 0.25, y - d * 0.3, z + 0.4], [x + 0.5 + dx * 0.7, bot + d * 0.25, z - 0.3], [x + 0.5 + dx, bot - 0.5, z + 0.2]], 0.3 + R() * 0.25, nr + 1)));
      // bracket fungus glowing on the root, so it shows in the dark
      const my = y - d * (0.35 + R() * 0.3), mx = x + 0.5 + dx * 0.45;
      place(make('shelf'), mx, my, z + 0.35, 0.55 + R() * 0.3, (R() - 0.5) * 0.6);
      if (nr % 2 === 0) emitters.push({ x: mx, y: my + 0.3, z: z + 0.8, col: [1, 0.66, 0.25], int: 2.6, range: 6, pri: 1.6 });
      nr++; info.roots = nr;
    }
    let ns = 0;
    for (const [x, y, f] of walls) {
      if (ns >= Math.round(14 * dens)) break;
      if (R() < 0.6 || near(x, y, avoid, 4)) continue;
      const z = -0.5 - R() * 1.6;
      place(make('shelf'), x, y + 0.8 + R() * 1.2, z, 0.8 + R() * 0.7, f * Math.PI / 2);
      if (ns % 3 === 0) emitters.push({ x: x + f * 0.4, y: y + 1.2, z, col: [1, 0.66, 0.25], int: 2.2, range: 6, pri: 1.5 });
      ns++; info.shelves = ns;
    }
    for (const [x, y] of take(Math.round(8 * dens), 3)) place(make('mushroom', 0.5 + R() * 0.6), x + R(), y, -1 - R() * 2, 1, R() * 6);
  } else if (set === 'amethyst') {
    const cols = [0x9a5cff, 0xd9c8ff, 0xff7ad0, 0x7fd2ff];
    crystals(22, cols);
    for (const [x, y] of ceils.slice(0, Math.round(16 * dens))) { const g = obj(make('crystal', 0.5 + R() * 0.8, cols[Math.floor(R() * cols.length)])); g.rotation.z = Math.PI; g.position.set(x + R(), y + 1, -1 - R() * 2); statics.push(g); }
  } else if (set === 'frost') {
    // clear quartz and ice: icicles from every roof
    crystals(20, [0xcfeeff, 0xffffff, 0x9fd8ff], 0.7, 0.4, 0.5, 1.6);
    for (const [x, y] of ceils.slice(0, Math.round(34 * dens))) { if (R() < 0.25) continue; place(make('icicles', 1 + Math.floor(R() * 6)), x + R(), y + 1, R() < 0.8 ? -0.6 - R() * 2.4 : 1.2 + R() * 0.6, 0.8 + R() * 0.7, R() * 6); }
  } else if (set === 'rose') {
    // split geodes in the walls of the big rooms, rose quartz and citrine on the floors
    for (const [x, y] of take(Math.round(5 * dens), 9, ([x, y]) => headroom(x, y) >= 5)) {
      const s = 1.3 + R() * 0.9, hex = [0xff9ac0, 0xffc24a, 0xd9a0ff][Math.floor(R() * 3)];
      place(make('geode', 1 + Math.floor(R() * 3), hex), x + 0.5, y + s * 0.9 + R() * 0.6, -3.4 - R() * 0.8, s, (R() - 0.5) * 0.3);
      emitters.push({ x: x + 0.5, y: y + s, z: -2.4, col: new THREE.Color(hex).toArray(), int: 4, range: 8, pri: 2.5 });
    }
    crystals(18, [0xff8fb0, 0xffc24a, 0xffd6e0], 0.7, 0.45, 0.5, 1.6);
  } else if (set === 'streets' || set === 'tide') {
    for (const [x, y] of take(Math.round((set === 'tide' ? 4 : 8) * dens), 6, ([x, y]) => headroom(x, y) >= 5)) {
      if (R() < 0.6) place(make('pillarRuin'), x + 0.5, y - 0.1, -2.2 - R() * 1.5, 0.9 + R() * 0.3, R() * 6);
      else place(make('statue'), x + 0.5, y - 0.1, -2.6 - R() * 1.2, 0.8 + R() * 0.4, (R() - 0.5) * 0.8);
      emitters.push({ x: x + 0.5, y: y + 2.5, z: -1.8, col: accent, int: 1.2, range: 7, pri: 0.8 });
    }
    if (set === 'tide') for (const [x, y] of ceils.slice(0, Math.round(36 * dens))) { if (R() < 0.3 || drop(x, y) < 3) continue; place(make('kelp', 1 + Math.floor(R() * 5)), x + R(), y + 1, -0.7 - R() * 2.6, 0.8 + R() * 0.5, R() * 6); }
  } else if (set === 'salt') {
    // the old cisterns: arcades standing in the hollows, salt crystals everywhere
    for (const [x, y] of take(Math.round(4 * dens), 12, ([x, y]) => headroom(x, y) >= 6)) place(make('arcade', 2 + Math.floor(R() * 2)), x + 0.5, y - 0.15, -4.4 - R() * 0.8, 0.85 + R() * 0.25);
    for (const [x, y] of take(Math.round(18 * dens), 2)) { const z = R() < 0.75 ? -0.9 - R() * 2.4 : 1.2 + R() * 0.6; place(make('saltCubes', 1 + Math.floor(R() * 5)), x + R(), y, z, 0.8 + R() * 1.0, R() * 6); }
    for (const [x, y] of take(Math.round(3 * dens), 8, ([x, y]) => headroom(x, y) >= 5)) place(make('statue'), x + 0.5, y - 0.1, -2.8 - R(), 0.9, (R() - 0.5) * 0.6);
  } else if (set === 'basalt' || set === 'obsidian' || set === 'sulfur') {
    for (const [x, y] of take(Math.round((set === 'basalt' ? 12 : 5) * dens), 4)) place(make('basalt', 2 + R() * 3), x + R(), y - 0.1, -1.8 - R() * 2.5, 1, R() * 6);
    if (set === 'obsidian') crystals(22, [0x3a1d4a, 0x251530, 0x5a1a40], 0.7, 0.35, 0.6, 2.2);
    if (set === 'sulfur') crystals(14, [0xffd23a, 0xe8b020], 0.75, 0.3, 0.4, 1.2);
  }
  // steam vents (sulfur): mounds that breathe out yellow steam
  const vents = [];
  if (set === 'sulfur') for (const [x, y] of take(Math.round(7 * dens), 6, ([x, y]) => headroom(x, y) >= 3)) {
    const z = -0.9 - R() * 1.6;
    place(make('vent'), x + 0.5, y - 0.05, z, 0.9 + R() * 0.6, R() * 6);
    vents.push({ x: x + 0.5, y: y + 0.4, z, t: R() * 3 });
    emitters.push({ x: x + 0.5, y: y + 0.6, z, col: [1, 0.6, 0.15], int: 2, range: 5, pri: 1.2, flick: 1 });
  }
  // glow jellies drifting through the flooded halls (tide)
  const jellies = [];
  if (set === 'tide') for (const [x, y] of take(Math.round(12 * dens), 6, ([x, y]) => headroom(x, y) >= 4)) {
    const g = obj(make('jelly')); const s = 0.8 + R() * 0.9, z = -1.2 - R() * 2.5;
    g.scale.setScalar(s); group.add(g);
    jellies.push({ g, x: x + 0.5, y: y + 1.5 + R() * Math.max(0, headroom(x, y) - 3), z, ph: R() * 6, sp: 0.6 + R() * 0.5 });
  }
  // ---- waterfalls and lava falls from a ceiling down to the floor at the back
  const FALLS = { garden: ['water', 2], streets: ['water', 2], basalt: ['lava', 3], patina: ['water', 1], bluecap: ['water', 2], salt: ['water', 2], tide: ['water', 3], obsidian: ['lava', 2], sulfur: ['lava', 1] };
  const falls = [];
  if (FALLS[set]) {
    const [kind, n] = FALLS[set];
    for (const [x, y] of take(n, 10, ([x, y]) => headroom(x, y) >= 6)) {
      const h = headroom(x, y) + 1;
      const lava = kind === 'lava';
      const m = new THREE.Mesh(new THREE.PlaneGeometry(lava ? 1.6 : 1.4, h), new THREE.ShaderMaterial({ vertexShader: WF_VERT, fragmentShader: WF_FRAG, transparent: true, depthWrite: false, blending: lava ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: { uT: { value: 0 }, uCol: { value: new THREE.Color(0.35, 0.55, 0.6) }, uLava: { value: lava ? 1 : 0 } } }));
      m.position.set(x + 0.5, y + h / 2 - 0.2, -2.6); group.add(m);
      // a pool of spray (or a glow of heat) where it lands
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.6), new THREE.MeshBasicMaterial({ map: tex.glow, color: lava ? new THREE.Color(1.6, 0.45, 0.08) : new THREE.Color(0.5, 0.65, 0.72), transparent: true, opacity: lava ? 0.55 : 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
      pool.position.set(x + 0.5, y + 0.15, -2.45); group.add(pool);
      falls.push({ m, x: x + 0.5, y, lava, pool });
      emitters.push({ x: x + 0.5, y: y + 1.5, z: -2, col: lava ? [1, 0.36, 0.08] : accent, int: lava ? 10 : 1.5, range: lava ? 12 : 6, pri: lava ? 3 : 1, flick: lava ? 1 : 0 });
    }
  }
  // ---- low mist drifting over the floors
  const MISTS = { garden: [0.45, 0.7, 0.62], streets: [0.5, 0.66, 0.7], patina: [0.42, 0.6, 0.54], bluecap: [0.4, 0.5, 0.85], frost: [0.72, 0.8, 0.9], salt: [0.78, 0.78, 0.74], tide: [0.3, 0.66, 0.72], sulfur: [0.72, 0.66, 0.3] };
  const mists = [];
  if (MISTS[set]) {
    const spots = [];
    for (const [x, y] of floors) {
      if (spots.length >= Math.round(9 * dens)) break;
      if (near(x, y, spots, 7)) continue;
      let run = 0; for (let k = -3; k <= 3; k++) if (open(x + k, y) && solid(x + k, y - 1)) run++;
      if (run < 5) continue;
      spots.push([x, y]);
    }
    const col = new THREE.Color().fromArray(MISTS[set]);
    for (const [x, y] of spots) for (const [z, a, w] of [[-1.1, 0.24, 8], [-2.4, 0.18, 10]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.5), new THREE.ShaderMaterial({ vertexShader: WF_VERT, fragmentShader: MIST_FRAG, transparent: true, depthWrite: false,
        uniforms: { uT: { value: 0 }, uCol: { value: col }, uA: { value: a } } }));
      m.position.set(x + 0.5, y + 0.55, z); m.renderOrder = 2; m.frustumCulled = false; group.add(m); mists.push(m);
    }
  }
  // ---- glowworm threads
  const WORMS = { garden: [70, [0.35, 0.95, 1.0]], bluecap: [150, [0.5, 0.7, 1.0]], tide: [45, [0.3, 1.0, 0.85]] };
  let worms = null;
  const wd = WORMS[set] || (W.endless && R() < 0.3 ? WORMS.garden : null);
  if (wd) {
    const pts = [], ph = [];
    for (const [x, y] of ceils.slice(0, Math.round(wd[0] * dens))) {
      const len = 0.4 + R() * 2.2, z = -0.6 - R() * 3, bx = x + R();
      for (let k = 0; k < 8; k++) { pts.push(bx + (R() - 0.5) * 0.03, y + 1 - len * k / 8, z); ph.push(R()); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute('aPh', new THREE.Float32BufferAttribute(ph, 1));
    worms = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: GW_VERT, fragmentShader: GW_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uScale: { value: innerHeight * 1.2 }, uTex: { value: tex.spark }, uCol: { value: new THREE.Color().fromArray(wd[1]) } } }));
    worms.frustumCulled = false; group.add(worms);
  }
  // ---- daylight shafts: cracks to the surface
  const SHAFTS = { workings: [2, [0.9, 0.75, 0.45]], rust: [1, [1, 0.6, 0.35]], patina: [1, [0.6, 0.85, 0.75]], roots: [3, [0.85, 0.9, 0.5]] };
  const shafts = [];
  if (SHAFTS[set]) {
    const [n, sc] = SHAFTS[set];
    for (const [x, y] of ceils.slice(0, 60)) {
      if (shafts.length >= n) break;
      if (headroom(x, y - 6) < 6) continue;
      const h = 9;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, h), new THREE.MeshBasicMaterial({ map: tex.glow, color: new THREE.Color().fromArray(sc), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.position.set(x + 0.5, y + 1 - h / 2, -1.2); m.rotation.z = (R() - 0.5) * 0.25; m.scale.x = 0.6; group.add(m);
      shafts.push({ x: x + 0.5, y });
      emitters.push({ x: x + 0.5, y: y - 3, z: -0.5, col: [Math.min(1, sc[0] * 1.1), Math.min(1, sc[1] * 1.1), Math.min(1, sc[2] * 1.2)], int: 3, range: 10, pri: 1 });
    }
  }
  // ---- the wonder
  const wonder = M.finds.find((f) => f.kind === 'wonder');
  let wonderFx = null;
  if (wonder) wonderFx = buildWonder(wonder, M, look, K, statics, group, emitters, R);
  // ---- eyes in the dark: something watches from the deep recesses, and blinks out when the lamp comes near
  const eyes = [];
  {
    const ec = [[1, 0.55, 0.15], [0.45, 1, 0.8], [0.9, 0.6, 1], [0.55, 0.9, 1], [1, 0.4, 0.12]][biome % 5];
    for (const [x, y] of take(Math.round(6 * dens), 9, ([x, y]) => headroom(x, y) >= 3).slice(0, 6)) {
      const g = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ map: tex.spark, color: new THREE.Color(ec[0] * 1.7, ec[1] * 1.7, ec[2] * 1.7), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const gap = 0.07 + R() * 0.05;
      for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.11), mat); m.position.x = s * gap; g.add(m); }
      g.position.set(x + 0.2 + R() * 0.6, y + 0.5 + R() * 1.4, -2.7 - R() * 0.9); g.visible = false; group.add(g);
      eyes.push({ g, mat, a: 0, blink: R() * 5, x: g.position.x, y: g.position.y, ph: R() * 6 });
    }
  }
  // bake the statics
  const baked = bake(statics);
  group.add(baked);
  // drips: ceiling points that drip now and then
  const drips = ceils.slice(0, 30).filter(() => R() < 0.6).map(([x, y]) => ({ x: x + R(), y: y + 0.95, t: R() * 4 }));
  const update = (t, dt, P, fx) => {
    for (const m of mists) m.material.uniforms.uT.value = t;
    for (const e of eyes) {
      const d = Math.hypot(e.x - P.x, e.y - P.y), want = d > 7.5 && d < 24 ? 1 : 0;
      e.a += (want - e.a) * Math.min(1, dt * (want ? 0.5 : 5));
      e.g.visible = e.a > 0.02; if (!e.g.visible) continue;
      e.blink -= dt; let sy = 1;
      if (e.blink < 0) { sy = Math.max(0.06, Math.abs(e.blink + 0.08) / 0.08); if (e.blink < -0.16) e.blink = 2.5 + Math.random() * 5; }
      e.g.scale.y = sy; e.mat.opacity = e.a * 0.85;
      e.g.position.x = e.x + Math.sin(t * 0.35 + e.ph) * 0.06;
    }
    for (const f of falls) { f.m.material.uniforms.uT.value = t; f.pool.scale.set(1 + Math.sin(t * 3.1 + f.x) * 0.06, 1 + Math.sin(t * 4.3 + f.x) * 0.12, 1); if (Math.abs(f.x - P.x) < 18 && Math.random() < dt * (f.lava ? 6 : 10)) { if (f.lava) fx.fire(f.x + (Math.random() - 0.5), f.y + 0.3, -2.2, { n: 1, s: 0.9, life: 0.8 }); else fx.dust(f.x + (Math.random() - 0.5), f.y + 0.3, -2.2, { n: 1, s0: 0.5, s1: 2.2, life: 2, vy: 0.6, a: 0.25, col: [0.8, 0.9, 0.95] }); } }
    if (worms) worms.material.uniforms.uT.value = t;
    for (const d of drips) {
      d.t -= dt;
      if (d.t <= 0 && Math.abs(d.x - P.x) < 14 && Math.abs(d.y - P.y) < 9) { d.t = 2 + Math.random() * 5; fx.glintP.add({ x: d.x, y: d.y, z: -0.4, vx: 0, vy: -0.5, vz: 0, s0: 0.07, s1: 0.07, max: 1.4, a: 0.7, r: 0.6, g: 0.7, b: 0.8, drag: 0, grav: 14, fade: 0.1, floor: Math.floor(d.y - 0.95 - (function () { let k = 0; while (k < 12 && !SOLID[at(Math.floor(d.x), Math.floor(d.y) - 1 - k)]) k++; return k; })()) + 0.02 }); }
    }
    // the level's motes near the digger
    const mo = MOTES[set];
    if (mo && Math.random() < dt * mo.rate) {
      const x = P.x + (Math.random() - 0.5) * 16, y = P.y + Math.random() * 7 - 1 + (mo.dy || 0);
      (mo.fire ? fx.fireP : fx.glintP).add({ x, y, z: (Math.random() - 0.5) * 3, vx: (Math.random() - 0.5) * (mo.jx || 0.2), vy: mo.vy + Math.random() * (mo.jy || 0), vz: 0, s0: mo.s0, s1: mo.s1, max: mo.life, a: mo.a,
        r: mo.c[0], g: mo.c[1], b: mo.c[2], drag: mo.drag || 0, grav: mo.grav || 0, fade: mo.fade || 0.5 });
    }
    for (const v of vents) {
      v.t -= dt;
      if (v.t <= 0 && Math.abs(v.x - P.x) < 18 && Math.abs(v.y - P.y) < 10) { v.t = 0.12 + Math.random() * 0.2; fx.dust(v.x + (Math.random() - 0.5) * 0.2, v.y, v.z, { n: 1, s0: 0.25, s1: 1.6, life: 2.4, vy: 0.9, up: 0.6, jit: 0.25, a: 0.32, col: [0.95, 0.9, 0.62] }); }
    }
    for (const j of jellies) {
      const k = t * 0.4 * j.sp + j.ph;
      j.g.position.set(j.x + Math.sin(k * 0.7) * 1.2, j.y + Math.sin(k) * 0.6 + Math.max(0, Math.sin(k * 2.2)) * 0.25, j.z + Math.sin(k * 0.5) * 0.4);
      j.g.scale.y = j.g.scale.x * (1 - Math.max(0, Math.sin(k * 2.2)) * 0.18);
      j.g.rotation.z = Math.sin(k * 0.7) * 0.15;
    }
    if (wonderFx) wonderFx(t, dt, P, fx);
  };
  return { group, emitters, update, wonder, info };
}

// ------------------------------------------------------------------ wonders
function buildWonder(w, M, look, K, statics, group, emitters, R) {
  const { make, obj, tex } = K;
  const id = w.id >= 100 ? (w.id * 7) % 10 : w.id;
  const [rx0, ry0] = w.room || [Math.floor(w.x) - 5, Math.floor(w.y) - 3];
  const cx = rx0 + 8, fy = ry0 + 3, z0 = -5;
  const add = (o, x, y, z, s = 1, ry = 0, rz = 0) => { const g = obj(o); g.position.set(x, y, z); g.scale.multiplyScalar(s); g.rotation.set(0, ry, rz); statics.push(g); return g; };
  let anim = null;
  if (id === 0 || id === 1) {
    // a great shaft of daylight / the ore cathedral
    const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 16), new THREE.MeshBasicMaterial({ map: tex.glow, color: new THREE.Color(1, 0.86, 0.55), transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.position.set(cx, fy + 7, -3); m.scale.x = 0.7; group.add(m);
    emitters.push({ x: cx, y: fy + 4, z: -1, col: [1, 0.88, 0.6], int: 18, range: 16, pri: 7 });
    for (let i = 0; i < 4; i++) add(make('timberFrame', 4, 8), rx0 + 2 + i * 4, fy, -3.5 - (i % 2));
    if (id === 1) for (let i = 0; i < 6; i++) { const ln = add(make('lantern'), rx0 + 2 + i * 2.4, fy + 6.5, -3.0); emitters.push({ x: ln.position.x, y: ln.position.y, z: -2.6, col: [1, 0.62, 0.3], int: 5, range: 8, pri: 4, flick: 1 }); }
    anim = (t, dt, P, fx) => { if (Math.random() < dt * 20) fx.dust(cx + (Math.random() - 0.5) * 3, fy + Math.random() * 9, -2.5 + Math.random(), { n: 1, s0: 0.04, s1: 0.07, life: 5, vy: -0.05, jit: 0.1, a: 0.8, k: 2.2, grav: 0, drag: 0.1 }); };
  } else if (id === 2) {
    for (let i = 0; i < 7; i++) { const s = 2.2 + R() * 2.6; add(make('mushroom', s), rx0 + 1 + i * 2.2 + R(), fy - 0.2, -4.5 - R() * 3, 1, R() * 6); if (i % 2 === 0) emitters.push({ x: rx0 + 1 + i * 2.2, y: fy + s * 0.8, z: -3.5, col: look.accent, int: 6, range: 10, pri: 4 }); }
  } else if (id === 3) {
    emitters.push({ x: cx, y: fy + 6, z: -2, col: [0.3, 0.9, 1], int: 6, range: 14, pri: 4 });
  } else if (id === 4 || id === 5) {
    const cols = [0xb07aff, 0xe8dcff, 0xff8ad8, 0x9fd8ff];
    // a ring of giant crystals round the hollow behind the room: the floor ones stand up, the wall ones lean in
    for (let i = 0; i < 14; i++) {
      const a = i / 13 * Math.PI, s = 1.6 + R() * 2.2;
      const x = cx + Math.cos(a) * 6.8, y = fy - 0.3 + Math.sin(a) * 6.2, z = -6.5 - Math.sin(a) * 2.5 + R() * 0.6;
      add(make('crystal', s, cols[i % cols.length]), x, y, z, 1, R() * 6, (Math.PI / 2 - a) * 0.9);
    }
    for (let i = 0; i < 6; i++) add(make('crystal', 0.8 + R() * 1.2, cols[i % cols.length]), cx + (R() - 0.5) * 10, fy - 0.2, -3.5 - R() * 2.5, 1, R() * 6);
    emitters.push({ x: cx, y: fy + 3, z: -4.5, col: [0.75, 0.5, 1], int: 16, range: 16, pri: 5 });
    emitters.push({ x: cx - 5, y: fy + 1, z: -4, col: [0.6, 0.8, 1], int: 6, range: 9, pri: 4 });
  } else if (id === 6) {
    add(make('statue'), cx - 4.5, fy - 0.2, z0, 2.2, 0.5); add(make('statue'), cx + 4.5, fy - 0.2, z0, 2.2, -0.5);
    for (let i = -1; i <= 1; i += 2) add(make('pillarRuin'), cx + i * 2, fy - 0.2, z0 - 1, 1.8);
    emitters.push({ x: cx, y: fy + 4, z: -3, col: [0.4, 0.9, 1], int: 8, range: 12, pri: 4 });
  } else if (id === 7 || id === 8) {
    const lava = id === 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 14), new THREE.ShaderMaterial({ vertexShader: WF_VERT, fragmentShader: WF_FRAG, transparent: true, depthWrite: false, blending: lava ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uCol: { value: new THREE.Color(0.4, 0.65, 0.75) }, uLava: { value: lava ? 1 : 0 } } }));
    m.position.set(cx, fy + 6, -6); group.add(m);
    emitters.push({ x: cx, y: fy + 2, z: -4, col: lava ? [1, 0.38, 0.1] : [0.4, 0.8, 1], int: lava ? 22 : 6, range: 16, pri: 5, flick: lava ? 1 : 0 });
    anim = (t, dt, P, fx) => { m.material.uniforms.uT.value = t; if (Math.random() < dt * 14) { if (lava) fx.fire(cx + (Math.random() - 0.5) * 3, fy, -5.5, { n: 1, s: 1.4, life: 1 }); else fx.dust(cx + (Math.random() - 0.5) * 3, fy, -5.5, { n: 1, s0: 1, s1: 3.5, life: 2.5, vy: 1, a: 0.3, col: [0.8, 0.9, 1] }); } };
  } else {
    for (let i = 0; i < 9; i++) add(make('basalt', 4 + R() * 5), rx0 + 1 + i * 1.8, fy - 0.3, z0 - R(), 1.3, R() * 6);
    emitters.push({ x: cx, y: fy + 2, z: -3, col: [1, 0.4, 0.12], int: 10, range: 12, pri: 4, flick: 1 });
  }
  return anim;
}
