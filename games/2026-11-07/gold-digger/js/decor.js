// Decorations and set pieces. Everything static is placed as model clones and then BAKED: merged per material into
// a handful of meshes, so a level full of timber, lanterns, mushrooms and crystals costs a few draw calls.
// Things that glow register light "emitters" the renderer's light pool can aim at.
// The wonders (one per level in the campaign) are big set pieces in a room whose back wall is pushed far back.
import * as THREE from '../vendor/three.module.min.js';
import { T, SOLID } from './config.js?v=1';

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
void main(){
  vec2 p = vec2(vUv.x * 6.0, vUv.y * 3.0 + uT * (uLava > 0.5 ? 0.35 : 1.6));
  float s = n(p * vec2(1.0, 4.0)) * 0.6 + n(p * vec2(2.3, 9.0)) * 0.4;
  float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
  float a = edge * (0.35 + s * 0.65) * smoothstep(0.0, 0.08, vUv.y);
  vec3 c = uLava > 0.5 ? mix(vec3(3.2, 0.7, 0.1), vec3(0.3, 0.05, 0.02), smoothstep(0.5, 0.75, s)) : uCol * (0.6 + s * 0.8);
  gl_FragColor = vec4(c, uLava > 0.5 ? edge : a * 0.75);
}`;
const WF_VERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GW_VERT = `attribute float aPh; uniform float uT; uniform float uScale; varying float vA;
void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = 0.55 + 0.45 * sin(uT * 1.7 + aPh * 6.28); gl_PointSize = uScale * 0.09 / max(0.5, -mv.z) * (0.7 + vA * 0.6); gl_Position = projectionMatrix * mv; }`;
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
  const place = (o, x, y, z, s = 1, ry = 0) => { const g = obj(o); g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.y = ry; statics.push(g); return g; };
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
  // ---- biome dressing
  const fl = floors.slice();
  const take = (n, minGap = 3, pred = () => true) => {
    const out = [];
    for (const p of fl) { if (out.length >= n) break; if (!pred(p)) continue; if (near(p[0], p[1], out, minGap) || near(p[0], p[1], avoid, 4)) continue; out.push(p); }
    return out;
  };
  const headroom = (x, y) => { let h = 0; while (h < 12 && open(x, y + h)) h++; return h; };
  const accent = look.accent;
  if (biome === 0) {
    // timber frames across corridors, lanterns, rails and carts
    for (const [x, y] of take(Math.round(10 * dens), 5, ([x, y]) => headroom(x, y) >= 3 && headroom(x, y) <= 6 && open(x - 1, y) && open(x + 1, y))) {
      const h = headroom(x, y);
      place(make('timberFrame', 3.2, h), x + 0.5, y, -0.9);
      const ln = obj(make('lantern')); ln.position.set(x + 0.5 + (R() < 0.5 ? -1.1 : 1.1), y + h - 0.65, -0.55); statics.push(ln);
      emitters.push({ x: ln.position.x, y: ln.position.y, z: -0.2, col: [1, 0.6, 0.26], int: 6, range: 9, pri: 3, flick: 1 });
    }
    for (const [x, y] of take(Math.round(4 * dens), 8, ([x, y]) => open(x + 2, y) && open(x - 2, y) && solid(x + 2, y - 1) && solid(x - 2, y - 1))) {
      place(make('rail', 5), x + 0.5, y, -1.5);
      if (R() < 0.6) place(make('cart'), x + 0.5 + (R() - 0.5) * 2, y + 0.05, -1.5);
    }
  } else if (biome === 1) {
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
  } else if (biome === 2) {
    const cols = [0x9a5cff, 0xd9c8ff, 0xff7ad0, 0x7fd2ff];
    for (const [x, y] of take(Math.round(22 * dens), 2)) {
      const c = cols[Math.floor(R() * cols.length)], s = 0.5 + R() * 1.4, z = R() < 0.7 ? -1 - R() * 2.5 : 1.2 + R() * 0.6;
      place(make('crystal', s, c), x + R(), y, z, 1, R() * 6);
      if (R() < 0.5) emitters.push({ x: x + 0.5, y: y + s * 0.8, z, col: new THREE.Color(c).toArray(), int: 2.2 * s, range: 6, pri: 1.5 });
    }
    for (const [x, y] of ceils.slice(0, Math.round(16 * dens))) { const g = obj(make('crystal', 0.5 + R() * 0.8, cols[Math.floor(R() * cols.length)])); g.rotation.z = Math.PI; g.position.set(x + R(), y + 1, -1 - R() * 2); statics.push(g); }
  } else if (biome === 3) {
    for (const [x, y] of take(Math.round(8 * dens), 6, ([x, y]) => headroom(x, y) >= 5)) {
      if (R() < 0.6) place(make('pillarRuin'), x + 0.5, y - 0.1, -2.2 - R() * 1.5, 0.9 + R() * 0.3, R() * 6);
      else place(make('statue'), x + 0.5, y - 0.1, -2.6 - R() * 1.2, 0.8 + R() * 0.4, (R() - 0.5) * 0.8);
      emitters.push({ x: x + 0.5, y: y + 2.5, z: -1.8, col: accent, int: 1.2, range: 7, pri: 0.8 });
    }
  } else if (biome === 4) {
    for (const [x, y] of take(Math.round(12 * dens), 4)) place(make('basalt', 2 + R() * 3), x + R(), y - 0.1, -1.8 - R() * 2.5, 1, R() * 6);
  }
  // ---- waterfalls (drowned + grotto) and lava falls (ember) from a ceiling down to the floor at the back
  const falls = [];
  if (biome === 3 || biome === 1 || biome === 4) {
    const n = biome === 4 ? 3 : 2;
    for (const [x, y] of take(n, 10, ([x, y]) => headroom(x, y) >= 6)) {
      const h = headroom(x, y) + 1;
      const lava = biome === 4;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(lava ? 1.6 : 1.4, h), new THREE.ShaderMaterial({ vertexShader: WF_VERT, fragmentShader: WF_FRAG, transparent: true, depthWrite: false, blending: lava ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: { uT: { value: 0 }, uCol: { value: new THREE.Color(0.35, 0.55, 0.6) }, uLava: { value: lava ? 1 : 0 } } }));
      m.position.set(x + 0.5, y + h / 2 - 0.2, -2.6); group.add(m);
      falls.push({ m, x: x + 0.5, y, lava });
      emitters.push({ x: x + 0.5, y: y + 1.5, z: -2, col: lava ? [1, 0.36, 0.08] : accent, int: lava ? 10 : 1.5, range: lava ? 12 : 6, pri: lava ? 3 : 1, flick: lava ? 1 : 0 });
    }
  }
  // ---- glowworm threads (grotto, endless)
  let worms = null;
  if (biome === 1 || (W.endless && R() < 0.3)) {
    const pts = [], ph = [];
    for (const [x, y] of ceils.slice(0, Math.round(70 * dens))) {
      const len = 0.4 + R() * 2.2, z = -0.6 - R() * 3, bx = x + R();
      for (let k = 0; k < 8; k++) { pts.push(bx + (R() - 0.5) * 0.03, y + 1 - len * k / 8, z); ph.push(R()); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute('aPh', new THREE.Float32BufferAttribute(ph, 1));
    worms = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: GW_VERT, fragmentShader: GW_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uScale: { value: innerHeight * 1.2 }, uTex: { value: tex.spark }, uCol: { value: new THREE.Color(0.35, 0.95, 1.0) } } }));
    worms.frustumCulled = false; group.add(worms);
  }
  // ---- daylight shafts (copper workings: cracks to the surface)
  const shafts = [];
  if (biome === 0) {
    for (const [x, y] of ceils.slice(0, 40)) {
      if (shafts.length >= 2) break;
      if (headroom(x, y - 6) < 6) continue;
      const h = 9;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, h), new THREE.MeshBasicMaterial({ map: tex.glow, color: new THREE.Color(0.9, 0.75, 0.45), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.position.set(x + 0.5, y + 1 - h / 2, -1.2); m.rotation.z = (R() - 0.5) * 0.25; m.scale.x = 0.6; group.add(m);
      shafts.push({ x: x + 0.5, y });
      emitters.push({ x: x + 0.5, y: y - 3, z: -0.5, col: [1, 0.85, 0.55], int: 3, range: 10, pri: 1 });
    }
  }
  // ---- the wonder
  const wonder = M.finds.find((f) => f.kind === 'wonder');
  let wonderFx = null;
  if (wonder) wonderFx = buildWonder(wonder, M, look, K, statics, group, emitters, R);
  // bake the statics
  const baked = bake(statics);
  group.add(baked);
  // drips: ceiling points that drip now and then
  const drips = ceils.slice(0, 30).filter(() => R() < 0.6).map(([x, y]) => ({ x: x + R(), y: y + 0.95, t: R() * 4 }));
  const update = (t, dt, P, fx) => {
    for (const f of falls) { f.m.material.uniforms.uT.value = t; if (Math.abs(f.x - P.x) < 18 && Math.random() < dt * (f.lava ? 6 : 10)) { if (f.lava) fx.fire(f.x + (Math.random() - 0.5), f.y + 0.3, -2.2, { n: 1, s: 0.9, life: 0.8 }); else fx.dust(f.x + (Math.random() - 0.5), f.y + 0.3, -2.2, { n: 1, s0: 0.5, s1: 2.2, life: 2, vy: 0.6, a: 0.25, col: [0.8, 0.9, 0.95] }); } }
    if (worms) worms.material.uniforms.uT.value = t;
    for (const d of drips) {
      d.t -= dt;
      if (d.t <= 0 && Math.abs(d.x - P.x) < 14 && Math.abs(d.y - P.y) < 9) { d.t = 2 + Math.random() * 5; fx.glintP.add({ x: d.x, y: d.y, z: -0.4, vx: 0, vy: -0.5, vz: 0, s0: 0.07, s1: 0.07, max: 1.4, a: 0.7, r: 0.6, g: 0.7, b: 0.8, drag: 0, grav: 14, fade: 0.1, floor: Math.floor(d.y - 0.95 - (function () { let k = 0; while (k < 12 && !SOLID[at(Math.floor(d.x), Math.floor(d.y) - 1 - k)]) k++; return k; })()) + 0.02 }); }
    }
    // biome motes near the digger
    if (Math.random() < dt * 6) {
      const x = P.x + (Math.random() - 0.5) * 16, y = P.y + Math.random() * 7 - 1;
      if (biome === 1) fx.glintP.add({ x, y, z: (Math.random() - 0.5) * 3, vx: (Math.random() - 0.5) * 0.2, vy: 0.15, vz: 0, s0: 0.12, s1: 0.06, max: 4, a: 0.7, r: 0.3, g: 1, b: 0.8, drag: 0, grav: -0.02, fade: 0.5 });
      if (biome === 4) fx.fireP.add({ x, y: y - 2, z: (Math.random() - 0.5) * 3, vx: (Math.random() - 0.5) * 0.4, vy: 0.8 + Math.random(), vz: 0, s0: 0.1, s1: 0.04, max: 3, a: 1, r: 1, g: 0.45, b: 0.12, drag: 0.2, grav: -0.2, fade: 0.5 });
      if (biome === 2) fx.glintP.add({ x, y, z: (Math.random() - 0.5) * 3, vx: 0, vy: 0.05, vz: 0, s0: 0.25, s1: 0.05, max: 1.5, a: 0.8, r: 0.85, g: 0.7, b: 1, drag: 0, grav: 0, fade: 0.6 });
    }
    if (wonderFx) wonderFx(t, dt, P, fx);
  };
  return { group, emitters, update, wonder };
}

// ------------------------------------------------------------------ wonders
function buildWonder(w, M, look, K, statics, group, emitters, R) {
  const { make, obj, tex } = K;
  const id = w.id >= 100 ? (w.id * 7) % 10 : w.id;
  const [rx0, ry0] = w.room || [Math.floor(w.x) - 5, Math.floor(w.y) - 3];
  const cx = rx0 + 8, fy = ry0 + 3, z0 = -5;
  const add = (o, x, y, z, s = 1, ry = 0, rz = 0) => { const g = obj(o); g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.set(0, ry, rz); statics.push(g); return g; };
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
    for (let i = 0; i < 7; i++) { const s = 2.5 + R() * 3.5; add(make('mushroom', s), rx0 + 1 + i * 2.2 + R(), fy - 0.2, z0 + R() * 2, 1, R() * 6); emitters.push({ x: rx0 + 1 + i * 2.2, y: fy + s * 0.8, z: z0 + 1, col: look.accent, int: 5, range: 9, pri: 4 }); }
  } else if (id === 3) {
    emitters.push({ x: cx, y: fy + 6, z: -2, col: [0.3, 0.9, 1], int: 6, range: 14, pri: 4 });
  } else if (id === 4 || id === 5) {
    const cols = [0xb07aff, 0xe8dcff, 0xff8ad8];
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI, s = 2 + R() * 3;
      add(make('crystal', s, cols[i % 3]), cx + Math.cos(a) * 7, fy + Math.sin(a) * 4 - 0.4, z0 - Math.sin(a) * 2, 1, R() * 6, (Math.PI / 2 - a) * 0.6);
    }
    emitters.push({ x: cx, y: fy + 3, z: -2.5, col: [0.75, 0.5, 1], int: 14, range: 14, pri: 5 });
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
