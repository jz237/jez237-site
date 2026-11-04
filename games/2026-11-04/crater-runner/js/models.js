// Models built from primitives with physically based materials: the six-wheeled rover (separate
// wheel/arm nodes so the suspension can move them), attackers, drones, tanks, mines, rocks, the five
// bosses and the mining-base ruins.
import * as THREE from '../vendor/three.module.min.js';

let M = null; // shared materials
export function materials(T, env) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.6, ...o });
  M = {
    panel: std({ map: T.panel, normalMap: T.panelN, normalScale: new THREE.Vector2(0.6, 0.6), color: 0xffffff, roughness: 0.48, metalness: 0.05 }),
    frame: std({ color: 0x2b2e33, roughness: 0.42, metalness: 0.85 }),
    alu: std({ color: 0xb8bcc2, roughness: 0.3, metalness: 1 }),
    dark: std({ color: 0x151719, roughness: 0.7, metalness: 0.3 }),
    foil: std({ map: T.foil, normalMap: T.foilN, normalScale: new THREE.Vector2(1.2, 1.2), color: 0xffffff, roughness: 0.22, metalness: 1, envMapIntensity: 1.2 }),
    solar: std({ map: T.solar, color: 0xffffff, roughness: 0.18, metalness: 0.6, envMapIntensity: 1.3 }),
    tyre: std({ color: 0x3a3c40, roughness: 0.85, metalness: 0.45 }),
    hub: std({ color: 0x8a8f96, roughness: 0.35, metalness: 1 }),
    orange: std({ color: 0xd2652d, roughness: 0.5, metalness: 0.1 }),
    lamp: new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xfff2d8, emissiveIntensity: 4 }),
    glass: std({ color: 0x0b1018, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.6 }),
    rock: std({ map: T.rock, normalMap: T.rockN, normalScale: new THREE.Vector2(1.4, 1.4), color: 0xb6b2ac, roughness: 0.93, metalness: 0, envMapIntensity: 0.25 }),
    // enemies: gunmetal hulls with red-hot vents (original designs: no classic-game look)
    hull: std({ color: 0x4a4f57, roughness: 0.35, metalness: 0.9 }),
    hull2: std({ color: 0x6d5a48, roughness: 0.55, metalness: 0.7 }),
    hot: new THREE.MeshStandardMaterial({ color: 0x220800, emissive: 0xff4a1a, emissiveIntensity: 5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0xff2020, emissiveIntensity: 6 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x001020, emissive: 0x39c8ff, emissiveIntensity: 4 }),
    mine: std({ color: 0x383a2e, roughness: 0.6, metalness: 0.7 }),
    rust: std({ color: 0x7a4a2e, roughness: 0.8, metalness: 0.5 }),
    concrete: std({ color: 0x8c8a86, roughness: 0.95, metalness: 0 }),
    white: std({ color: 0xd8d8d4, roughness: 0.55, metalness: 0.1 }),
  };
  return M;
}

function box(w, h, d, mat, x = 0, y = 0, z = 0, bevel = 0) {
  let g;
  if (bevel > 0) {
    const s = new THREE.Shape(), hw = w / 2 - bevel, hh = h / 2 - bevel;
    s.moveTo(-hw, -h / 2); s.lineTo(hw, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh); s.lineTo(w / 2, hh);
    s.quadraticCurveTo(w / 2, h / 2, hw, h / 2); s.lineTo(-hw, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh); s.lineTo(-w / 2, -hh); s.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);
    g = new THREE.ExtrudeGeometry(s, { depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.6, bevelSegments: 2, curveSegments: 4 });
    g.translate(0, 0, -(d - bevel * 2) / 2);
    // planar UVs so the panel texture lands sensibly
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + p.getZ(i)) / 2.2 + 0.5, p.getY(i) / 1.2 + 0.5);
  } else g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function cyl(rt, rb, h, mat, seg = 16) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.castShadow = true; m.receiveShadow = true; return m; }
// merge [geometry, matrix] pairs into one indexed geometry (position, normal, uv)
export function merge(parts) {
  let nv = 0, ni = 0;
  for (const [g] of parts) { nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint32Array(ni);
  let ov = 0, oi = 0;
  const v = new THREE.Vector3(), nm = new THREE.Matrix3();
  for (const [g, m] of parts) {
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv;
    nm.getNormalMatrix(m);
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m); pos.set([v.x, v.y, v.z], (ov + i) * 3);
      v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor.set([v.x, v.y, v.z], (ov + i) * 3);
      if (U) uv.set([U.getX(i), U.getY(i)], (ov + i) * 2);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx[oi + i] = g.index.getX(i) + ov;
    else for (let i = 0; i < P.count; i++) idx[oi + i] = ov + i;
    ov += P.count; oi += g.index ? g.index.count : P.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}
const M4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));
let WHEEL_GEO = null;
function wheelGeos() {
  if (WHEEL_GEO) return WHEEL_GEO;
  const tyre = merge([[new THREE.TorusGeometry(WHEEL_R - 0.1, 0.12, 10, 28), M4()], [new THREE.CylinderGeometry(WHEEL_R - 0.04, WHEEL_R - 0.04, 0.3, 28, 1, true), M4(0, 0, 0, Math.PI / 2)]]);
  const treads = [];
  const tb = new THREE.BoxGeometry(0.06, 0.05, 0.32);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; treads.push([tb, M4(Math.cos(a) * WHEEL_R, Math.sin(a) * WHEEL_R, 0, 0, 0, a)]); }
  treads.push([new THREE.CylinderGeometry(0.16, 0.16, 0.34, 14), M4(0, 0, 0, Math.PI / 2)]);
  WHEEL_GEO = { tyre, hub: merge(treads) };
  return WHEEL_GEO;
}
const shadowAll = (o) => o.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });

// ------------------------------------------------------------------ the rover
export const WHEEL_R = 0.43;
export const RIDE = 0.95; // body origin height above the wheel-bottom line at rest
export function rover(tint = 0xffffff) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const panel = M.panel.clone(); panel.color.set(tint);
  // chassis tub, deck and nose
  body.add(box(3.3, 0.5, 1.9, M.frame, 0, 0.05, 0, 0.08));
  body.add(box(2.7, 0.55, 1.75, panel, -0.15, 0.5, 0, 0.12));
  body.add(box(0.9, 0.42, 1.7, panel, 1.25, 0.32, 0, 0.12));
  const foil = box(1.0, 0.36, 1.6, M.foil, -1.0, 0.95, 0, 0.06); body.add(foil);
  // cab with glass
  const cab = box(1.05, 0.62, 1.4, panel, 0.55, 1.05, 0, 0.14); body.add(cab);
  const win = box(0.05, 0.36, 1.2, M.glass, 1.09, 1.08, 0); win.rotation.z = -0.35; body.add(win);
  // solar deck on a hinge
  const sol = box(1.7, 0.05, 2.1, M.solar, -0.65, 0.84, 0); sol.rotation.z = 0.05; body.add(sol);
  // mast, high-gain dish, antenna
  const mast = cyl(0.04, 0.05, 1.0, M.alu); mast.position.set(-1.25, 1.55, 0.55); body.add(mast);
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 10, 0, Math.PI * 2, 0, 0.9), M.white);
  dish.material = M.white; dish.position.set(-1.25, 2.1, 0.55); dish.rotation.set(0, 0, -0.9); dish.castShadow = true; body.add(dish);
  const ant = cyl(0.012, 0.012, 1.2, M.dark, 6); ant.position.set(-1.45, 1.75, -0.6); body.add(ant);
  // turret pod on top with the anti-air gun pointing up
  const tur = new THREE.Group(); tur.position.set(0.2, 1.42, 0); body.add(tur);
  tur.add(cyl(0.28, 0.34, 0.22, M.frame, 20));
  const upGun = new THREE.Group(); tur.add(upGun);
  for (const z of [-0.09, 0.09]) { const b = cyl(0.045, 0.055, 0.75, M.dark, 10); b.position.set(0, 0.45, z); upGun.add(b); }
  const muzzleUp = new THREE.Object3D(); muzzleUp.position.set(0, 0.85, 0); upGun.add(muzzleUp);
  // forward cannon under the nose
  const fwd = new THREE.Group(); fwd.position.set(1.62, 0.2, 0); body.add(fwd);
  const fb = cyl(0.07, 0.09, 0.7, M.dark, 12); fb.rotation.z = Math.PI / 2; fb.position.x = 0.25; fwd.add(fb);
  fwd.add(box(0.3, 0.26, 0.4, M.frame));
  const muzzleFwd = new THREE.Object3D(); muzzleFwd.position.set(0.62, 0, 0); fwd.add(muzzleFwd);
  // headlights + orange marker strip
  for (const z of [-0.6, 0.6]) { const l = box(0.06, 0.12, 0.26, M.lamp, 1.71, 0.44, z); body.add(l); }
  body.add(box(0.05, 0.05, 1.5, M.orange, 1.71, 0.58, 0));
  // wheels and arms (three axles, both sides)
  const wheels = [], arms = [];
  const WG = wheelGeos();
  for (const ax of [-1.35, 0, 1.35]) for (const side of [-1, 1]) {
    const w = new THREE.Group();
    const spin = new THREE.Group(); w.add(spin);
    spin.add(new THREE.Mesh(WG.tyre, M.tyre), new THREE.Mesh(WG.hub, M.hub));
    shadowAll(w);
    w.position.set(ax, 0, side * 1.12);
    root.add(w);
    wheels.push({ g: w, spin, ax, side });
    const arm = box(0.9, 0.09, 0.1, M.alu); root.add(arm);
    const shock = cyl(0.05, 0.05, 0.5, M.orange, 8); root.add(shock);
    arms.push({ arm, shock, ax, side });
  }
  // engine glow at the back (night readability)
  const tail = box(0.05, 0.1, 1.2, M.hot, -1.66, 0.25, 0); body.add(tail);
  root.userData = { body, wheels, arms, tur, upGun, fwd, muzzleUp, muzzleFwd, panel };
  return root;
}

// ------------------------------------------------------------------ enemies
export function flyer() {
  // a wedge interceptor: swept twin hull, glowing intake, ventral bomb rack
  const g = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(1.5, 0); s.lineTo(-0.9, 0.9); s.lineTo(-1.2, 0.45); s.lineTo(-0.7, 0); s.lineTo(-1.2, -0.45); s.lineTo(-0.9, -0.9); s.lineTo(1.5, 0);
  const hullG = new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 });
  hullG.rotateX(Math.PI / 2); hullG.translate(0, 0.14, 0);
  const hull = new THREE.Mesh(hullG, M.hull); g.add(hull);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.glass); top.scale.set(1.4, 0.6, 0.8); top.position.set(0.25, 0.2, 0); g.add(top);
  for (const z of [-0.55, 0.55]) { const e = box(0.45, 0.16, 0.22, M.hot, -1.0, 0.05, z); g.add(e); }
  const rack = box(0.7, 0.14, 0.3, M.frame, 0.1, -0.12, 0); g.add(rack);
  const eye = box(0.1, 0.07, 0.5, M.eye, 1.0, 0.18, 0); g.add(eye);
  shadowAll(g);
  return g;
}
export function drone() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), M.hull); g.add(core);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), M.eye); eye.position.set(-0.36, 0, 0); g.add(eye);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 24), M.alu); ring.rotation.y = Math.PI / 2; g.add(ring);
  for (let i = 0; i < 4; i++) { const sp = cyl(0.02, 0.07, 0.5, M.frame, 6); const a = (i / 4) * Math.PI * 2; sp.position.set(0, Math.cos(a) * 0.55, Math.sin(a) * 0.55); sp.rotation.x = a; g.add(sp); }
  shadowAll(g);
  g.userData.ring = ring;
  return g;
}
export function tank() {
  const g = new THREE.Group();
  for (const z of [-0.62, 0.62]) {
    const tr = box(2.6, 0.5, 0.42, M.dark, 0, 0.25, z, 0.15); g.add(tr);
    for (let i = 0; i < 5; i++) { const w = cyl(0.19, 0.19, 0.46, M.hub, 12); w.rotation.x = Math.PI / 2; w.position.set(-1 + i * 0.5, 0.22, z); g.add(w); }
  }
  g.add(box(2.3, 0.45, 1.3, M.hull2, 0, 0.68, 0, 0.1));
  const tur = new THREE.Group(); tur.position.set(-0.1, 1.0, 0); g.add(tur);
  tur.add(box(1.1, 0.38, 0.95, M.hull2, 0, 0, 0, 0.12));
  const gun = cyl(0.07, 0.09, 1.4, M.dark, 10); gun.rotation.z = Math.PI / 2; gun.position.set(-0.9, 0.02, 0); tur.add(gun);
  tur.add(box(0.12, 0.08, 0.3, M.eye, 0.5, 0.15, 0));
  shadowAll(g);
  g.userData.tur = tur; g.userData.gun = gun;
  return g;
}
export function mine() {
  const g = new THREE.Group();
  const d = cyl(0.42, 0.5, 0.16, M.mine, 18); d.position.y = 0.06; g.add(d);
  const top = cyl(0.2, 0.26, 0.1, M.frame, 14); top.position.y = 0.18; g.add(top);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), M.eye.clone()); led.position.y = 0.25; g.add(led);
  for (let i = 0; i < 6; i++) { const p = cyl(0.015, 0.015, 0.14, M.alu, 4); const a = (i / 6) * Math.PI * 2; p.position.set(Math.cos(a) * 0.32, 0.22, Math.sin(a) * 0.32); g.add(p); }
  shadowAll(g);
  g.userData.led = led;
  return g;
}
export function bomb() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 4, 10), M.hull); b.castShadow = true; g.add(b);
  const band = cyl(0.17, 0.17, 0.08, M.hot, 12); g.add(band);
  for (let i = 0; i < 4; i++) { const f = box(0.02, 0.18, 0.16, M.frame); const a = (i / 4) * Math.PI * 2; f.position.set(Math.cos(a) * 0.12, 0.3, Math.sin(a) * 0.12); f.rotation.y = -a; g.add(f); }
  return g;
}

// ------------------------------------------------------------------ rocks: displaced icospheres, cached variants
const rockCache = new Map();
export function rockGeometry(seed, flat = 1) {
  const key = (seed % 12) + ':' + flat;
  if (rockCache.has(key)) return rockCache.get(key);
  let s = (seed % 12) * 9301 + 49297;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const g = new THREE.IcosahedronGeometry(1, 3);
  const p = g.attributes.position;
  const bumps = [];
  for (let i = 0; i < 7; i++) bumps.push([r() * 2 - 1, r() * 2 - 1, r() * 2 - 1, 0.15 + r() * 0.25]);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    let k = 1;
    for (const [bx, by, bz, a] of bumps) { const d = v.x * bx + v.y * by + v.z * bz; k += a * Math.max(0, d) * d * 0.6; }
    k += (Math.sin(v.x * 7 + seed) * Math.sin(v.y * 6) * Math.sin(v.z * 8)) * 0.06;
    // facets: quantise a little for a chipped look
    v.multiplyScalar(k);
    v.y *= flat;
    if (v.y < -0.3) v.y = -0.3 + (v.y + 0.3) * 0.3;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  // triplanar-ish UVs
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.5 + p.getZ(i) * 0.5, p.getY(i) * 0.5);
  rockCache.set(key, g);
  return g;
}
export function rock(seed, r, kind) {
  const g = new THREE.Group();
  if (kind === 'wall') {
    // a ridge of stacked slabs
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(rockGeometry(seed + i * 3, 0.8), M.rock);
      const sz = 0.55 + ((seed + i) % 3) * 0.12;
      m.scale.set(0.55, sz, 0.75 + (i % 2) * 0.3);
      m.position.set((i % 2 - 0.5) * 0.25, 0.35 + i * 0.36, (i - 2) * 0.55);
      m.rotation.set(i, i * 2.1, 0.3);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    }
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(rockGeometry(seed + 20 + i, 0.7), M.rock);
      m.scale.setScalar(0.7); m.position.set(0, 0.4, (i - 1) * 1.3); m.castShadow = m.receiveShadow = true; g.add(m);
    }
    return g;
  }
  const m = new THREE.Mesh(rockGeometry(seed, 0.85), M.rock);
  m.scale.set(r * 1.05, r, r * 1.1);
  m.position.y = r * 0.72;
  m.rotation.y = seed;
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return g;
}

// ------------------------------------------------------------------ bosses (original designs)
export function boss(key) {
  const g = new THREE.Group();
  const parts = { glow: [] };
  if (key === 'warden' || key === 'lancer' || key === 'carrier') {
    const big = key === 'carrier' ? 1.5 : key === 'lancer' ? 1.15 : 1;
    const hull = box(7.5 * big, 1.4 * big, 3 * big, M.hull, 0, 0, 0, 0.4);
    g.add(hull);
    g.add(box(4 * big, 0.9 * big, 2.2 * big, M.hull2, -0.5, 0.9 * big, 0, 0.3));
    if (key === 'lancer') { const lance = cyl(0.25, 0.08, 5, M.alu, 12); lance.rotation.z = -Math.PI / 2; lance.position.set(5.5, 0, 0); g.add(lance); for (const z of [-1.8, 1.8]) { const fin = box(2.5, 0.12, 1.6, M.white, -1, 0.3, z); fin.rotation.x = z > 0 ? 0.3 : -0.3; g.add(fin); } }
    for (const [x, z] of [[-3, -1.9], [-3, 1.9], [2.6, -1.9], [2.6, 1.9]]) {
      const pod = cyl(0.55 * big, 0.7 * big, 1.1 * big, M.frame, 16); pod.position.set(x * big, -0.4, z * big); g.add(pod);
      const fl = cyl(0.4 * big, 0.5 * big, 0.12, M.hot, 16); fl.position.set(x * big, -1.0 * big, z * big); g.add(fl); parts.glow.push(fl);
    }
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.75 * big, 18, 12), M.eye.clone()); belly.position.set(0, -0.8 * big, 0); belly.scale.y = 0.6; g.add(belly);
    parts.core = belly;
    if (key === 'carrier') {
      for (let i = 0; i < 3; i++) g.add(box(1.2, 0.5, 0.5, M.blue, -3 + i * 3, 0.2, 2.35));
      const bay = box(3, 0.3, 2.2, M.dark, 2.5, -1.15, 0); g.add(bay);
    }
  } else {
    // ground bosses: the crawler (basalt fortress on four track units) and the excavator (bucket wheel)
    const ex = key === 'excavator';
    for (const x of [-2.3, 2.3]) for (const z of [-1.7, 1.7]) {
      const tr = box(2.1, 1.0, 1.0, M.dark, x, 0.5, z, 0.3); g.add(tr);
      for (let i = 0; i < 3; i++) { const w = cyl(0.32, 0.32, 1.04, M.hub, 12); w.rotation.x = Math.PI / 2; w.position.set(x - 0.65 + i * 0.65, 0.45, z); g.add(w); }
    }
    g.add(box(6.4, 1.6, 3.6, ex ? M.rust : M.hull2, 0, 1.75, 0, 0.3));
    g.add(box(3.6, 1.2, 2.8, M.hull, 0.6, 3.05, 0, 0.25));
    if (ex) {
      const wheel = new THREE.Group(); wheel.position.set(-3.6, 2.4, 0); g.add(wheel);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.18, 8, 24), M.rust); wheel.add(rim);
      for (let i = 0; i < 8; i++) { const b = box(0.6, 0.5, 0.8, M.frame); const a = (i / 8) * Math.PI * 2; b.position.set(Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0); b.rotation.z = a; wheel.add(b); }
      parts.wheel = wheel;
    } else {
      const gun = cyl(0.22, 0.3, 3.2, M.dark, 14); gun.rotation.z = Math.PI / 2; gun.position.set(-2.6, 3.1, 0); g.add(gun);
      const mort = cyl(0.35, 0.4, 1.2, M.frame, 14); mort.position.set(1.6, 3.9, 0); mort.rotation.z = 0.5; g.add(mort);
    }
    const core = box(0.25, 0.9, 1.6, M.eye.clone(), -3.25, 1.75, 0); g.add(core);
    parts.core = core;
    for (const z of [-1.2, 1.2]) { const v = box(0.8, 0.15, 0.5, M.hot, 1.5, 2.6, z * 1.2); g.add(v); parts.glow.push(v); }
  }
  shadowAll(g);
  g.userData = parts;
  return g;
}

// ------------------------------------------------------------------ mining-base ruins (sector 4 scenery)
export function ruin(kind, seed) {
  const g = new THREE.Group();
  const r = ((seed * 9301 + 49297) % 233280) / 233280;
  if (kind === 0) { // cracked habitat dome
    const d = new THREE.Mesh(new THREE.SphereGeometry(4 + r * 3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2 * (0.75 + r * 0.25)), M.white); g.add(d);
    const ring = cyl(4.2 + r * 3, 4.4 + r * 3, 0.6, M.concrete, 24); ring.position.y = 0.3; g.add(ring);
    for (let i = 0; i < 4; i++) { const ribG = new THREE.TorusGeometry(4 + r * 3, 0.08, 6, 24, Math.PI); const rib = new THREE.Mesh(ribG, M.frame); rib.rotation.y = (i / 4) * Math.PI; g.add(rib); }
  } else if (kind === 1) { // gantry / derrick
    const h = 9 + r * 7;
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const leg = cyl(0.12, 0.15, h, M.rust, 6); leg.position.set(x, h / 2, z); g.add(leg); }
    for (let y = 2; y < h; y += 2.2) { for (const rot of [0, Math.PI / 2]) { const b = box(2.2, 0.1, 0.1, M.rust, 0, y, 0); b.rotation.y = rot; g.add(b); } }
    const top = box(3.5, 0.6, 2.6, M.frame, 0.5, h, 0); g.add(top);
    const lamp = box(0.3, 0.3, 0.3, M.hot, 1.8, h + 0.3, 0); g.add(lamp);
  } else if (kind === 2) { // fallen conveyor
    const len = 14 + r * 8;
    const c = box(len, 0.6, 1.4, M.rust, 0, 2.2, 0); c.rotation.z = 0.12 + r * 0.1; g.add(c);
    for (let i = 0; i < 3; i++) { const p = cyl(0.25, 0.3, 2 + i * 0.6, M.concrete, 8); p.position.set(-len / 2 + 2 + i * (len / 3), 1 + i * 0.3, 0); g.add(p); }
  } else { // storage tanks
    for (let i = 0; i < 3; i++) { const t = cyl(1.6, 1.6, 4 + r * 2, i === 1 ? M.rust : M.white, 18); t.position.set(i * 3.6 - 3.6, 2.2, (i % 2) * 1.5); g.add(t); }
    const pipe = cyl(0.2, 0.2, 9, M.alu, 8); pipe.rotation.z = Math.PI / 2; pipe.position.set(0, 3.4, 0.8); g.add(pipe);
  }
  shadowAll(g);
  return g;
}
