// 3D models built from primitives with physically based materials: the Warden exo-suit, every machine,
// survivors, the five bosses and scenery pieces. Every model faces +x; the renderer turns it with
// rotation.y = -angle. Named parts (legs, torso, eye, core...) are animated by the renderer.
import * as THREE from '../vendor/three.module.min.js';

export const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
let M = null;
// shared materials (call once with the environment map and the grime texture)
export function materials(env, grime, stripe) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 1, ...o });
  M = {
    env, grime, stripe,
    dark: std({ color: 0x2a2e35, metalness: 0.75, roughness: 0.42, map: grime }),
    steel: std({ color: 0x9aa1ab, metalness: 0.92, roughness: 0.28 }),
    rubber: std({ color: 0x141518, metalness: 0, roughness: 0.92 }),
    black: std({ color: 0x0c0d10, metalness: 0.5, roughness: 0.5 }),
    copper: std({ color: 0xc27a45, metalness: 1, roughness: 0.32 }),
    glass: std({ color: 0x0a1018, metalness: 0.2, roughness: 0.06, envMapIntensity: 2.2 }),
    stripes: std({ map: stripe, metalness: 0.3, roughness: 0.55 }),
    paint: new Map(), glow: new Map(), cloth: new Map(),
  };
  return M;
}
export function paint(color, rough = 0.38, metal = 0.55) {
  const k = color + ':' + rough + ':' + metal;
  if (!M.paint.has(k)) M.paint.set(k, new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, map: M.grime, envMap: M.env, envMapIntensity: 1 }));
  return M.paint.get(k);
}
export function glow(color, k = 3) {
  const key = color + ':' + k;
  if (!M.glow.has(key)) M.glow.set(key, new THREE.MeshBasicMaterial({ color: hdr(color, k), toneMapped: false }));
  return M.glow.get(key);
}
function cloth(color) {
  if (!M.cloth.has(color)) M.cloth.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, envMap: M.env, envMapIntensity: 0.5 }));
  return M.cloth.get(color);
}
// add a mesh to a parent at a position / rotation
function add(p, geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true;
  p.add(m);
  return m;
}
const G = {};   // geometry cache
const geo = (k, f) => G[k] || (G[k] = f());
const box = (x, y, z) => geo(`b${x},${y},${z}`, () => new THREE.BoxGeometry(x, y, z));
const cyl = (a, b, h, n = 14) => geo(`c${a},${b},${h},${n}`, () => new THREE.CylinderGeometry(a, b, h, n));
const sph = (r, w = 18, h = 12) => geo(`s${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h));
const cap = (r, l, n = 10) => geo(`k${r},${l}`, () => new THREE.CapsuleGeometry(r, l, 4, n));
const tor = (r, t, n = 24) => geo(`t${r},${t}`, () => new THREE.TorusGeometry(r, t, 8, n));

// a leg as hip -> thigh -> knee -> shin -> foot; swing hip.rotation.z, bend knee.rotation.z
function leg(parent, mat, x, y, z, len = 0.5, w = 0.18) {
  const hip = new THREE.Group(); hip.position.set(x, y, z); parent.add(hip);
  add(hip, box(w, len, w * 1.15), mat, 0, -len / 2, 0);
  const knee = new THREE.Group(); knee.position.set(0, -len, 0); hip.add(knee);
  add(knee, sph(w * 0.62, 12, 8), M.dark, 0, 0, 0);
  add(knee, box(w * 0.85, len, w), M.dark, 0, -len / 2, 0);
  add(knee, box(w * 1.9, w * 0.5, w * 1.2), M.black, w * 0.3, -len - w * 0.1, 0);
  return { hip, knee };
}

// ------------------------------------------------------------------ the Warden
export function warden(color = 0x2f8cff, accent = 0x9fe8ff) {
  const g = new THREE.Group();
  const body = paint(color, 0.34, 0.5), trim = paint(0xd8dde4, 0.32, 0.6);
  const lower = new THREE.Group(); g.add(lower);
  add(lower, box(0.36, 0.22, 0.5), M.dark, 0, 0.98, 0);
  const L = leg(lower, body, 0, 0.94, -0.17, 0.46, 0.19), R = leg(lower, body, 0, 0.94, 0.17, 0.46, 0.19);
  const upper = new THREE.Group(); g.add(upper);
  add(upper, box(0.42, 0.34, 0.56), M.dark, 0, 1.16, 0);
  add(upper, box(0.5, 0.42, 0.74), body, 0.02, 1.44, 0);
  add(upper, box(0.18, 0.3, 0.5), trim, 0.24, 1.42, 0);
  add(upper, box(0.36, 0.5, 0.56), M.dark, -0.34, 1.4, 0);                         // backpack
  add(upper, tor(0.15, 0.035), glow(accent, 3.5), -0.53, 1.42, 0, 0, Math.PI / 2, 0);   // reactor ring
  for (const s of [-1, 1]) add(upper, box(0.42, 0.18, 0.28), body, 0, 1.66, s * 0.46, s * 0.25, 0, 0);   // shoulder pads
  const head = new THREE.Group(); head.position.set(0.05, 1.78, 0); upper.add(head);
  add(head, sph(0.19, 16, 12), M.dark, 0, 0, 0).scale.set(1.05, 0.95, 1);
  add(head, box(0.08, 0.06, 0.26), glow(accent, 4), 0.17, 0.02, 0);                   // visor
  // the blaster on the right arm, a support hand on the left
  add(upper, box(0.42, 0.14, 0.14), body, 0.18, 1.38, 0.42, 0, 0, -0.2);
  const gun = new THREE.Group(); gun.position.set(0.4, 1.3, 0.34); upper.add(gun);
  add(gun, box(0.7, 0.16, 0.16), M.black, 0.22, 0, 0);
  add(gun, box(0.36, 0.1, 0.1), M.steel, 0.68, 0.02, 0);
  add(gun, box(0.2, 0.2, 0.06), body, 0.06, 0.05, 0.1);
  const muzzle = add(gun, cyl(0.05, 0.05, 0.04, 10), glow(accent, 5), 0.88, 0.02, 0, 0, 0, Math.PI / 2);
  add(upper, box(0.4, 0.12, 0.12), body, 0.2, 1.3, -0.3, 0, 0.5, -0.3);
  return { g, lower, upper, L, R, head, gun, muzzle };
}

// ------------------------------------------------------------------ machines
export function crawler() {
  const g = new THREE.Group();
  const shell = paint(0x8a3324, 0.42, 0.6);
  const body = new THREE.Group(); body.position.y = 0.42; g.add(body);
  add(body, sph(0.36, 16, 10), shell, 0, 0, 0).scale.set(1.25, 0.62, 1.05);
  add(body, box(0.34, 0.12, 0.4), M.dark, -0.1, 0.18, 0);
  const eye = add(body, sph(0.08, 10, 8), glow(0xff3a2a, 6), 0.4, 0.04, 0);
  add(body, sph(0.05, 8, 6), glow(0xff3a2a, 4), 0.36, 0.06, 0.14);
  add(body, sph(0.05, 8, 6), glow(0xff3a2a, 4), 0.36, 0.06, -0.14);
  const legs = [];
  for (const [x, z] of [[0.22, 0.3], [-0.22, 0.3], [0.22, -0.3], [-0.22, -0.3]]) {
    const hip = new THREE.Group(); hip.position.set(x, 0.42, z); g.add(hip);
    const up = add(hip, box(0.06, 0.06, 0.38), M.dark, 0, 0.08, Math.sign(z) * 0.18, Math.sign(z) * 0.5, 0, 0);
    const knee = new THREE.Group(); knee.position.set(0, 0.17, Math.sign(z) * 0.34); hip.add(knee);
    add(knee, box(0.05, 0.5, 0.05), M.steel, 0, -0.2, Math.sign(z) * 0.08, Math.sign(z) * -0.3, 0, 0);
    legs.push({ hip, x, z, up });
  }
  return { g, body, eye, legs };
}
export function brute() {
  const g = new THREE.Group();
  const yel = paint(0xd89a1c, 0.45, 0.4);
  const body = new THREE.Group(); g.add(body);
  for (const s of [-1, 1]) {
    add(body, box(1.9, 0.5, 0.42), M.rubber, 0, 0.27, s * 0.72);
    for (let i = 0; i < 4; i++) add(body, cyl(0.2, 0.2, 0.46, 12), M.dark, -0.7 + i * 0.47, 0.25, s * 0.72, Math.PI / 2, 0, 0);
  }
  add(body, box(1.7, 0.55, 1.1), yel, 0, 0.75, 0);
  add(body, box(1.72, 0.12, 1.12), M.stripes, 0, 0.5, 0);
  add(body, box(0.8, 0.6, 0.9), yel, -0.45, 1.3, 0);
  add(body, box(0.5, 0.36, 0.8), M.glass, -0.2, 1.36, 0);
  const lamp = add(body, cyl(0.09, 0.09, 0.12, 10), glow(0xff8a1a, 6), -0.45, 1.66, 0);
  // the scoop
  const arm = new THREE.Group(); arm.position.set(0.6, 0.9, 0); body.add(arm);
  for (const s of [-1, 1]) add(arm, box(0.9, 0.14, 0.14), M.dark, 0.35, -0.1, s * 0.4, 0, 0, -0.5);
  const scoop = add(arm, box(0.25, 0.6, 1.5), M.dark, 0.8, -0.5, 0);
  add(arm, box(0.08, 0.1, 1.5), M.steel, 0.95, -0.82, 0);
  const eye = add(body, box(0.06, 0.08, 0.6), glow(0xff3a2a, 5), 0.86, 0.85, 0);
  return { g, body, arm, scoop, lamp, eye };
}
export function spitter() {
  const g = new THREE.Group();
  const shell = paint(0x3b3550, 0.36, 0.7);
  const legs = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const hip = new THREE.Group(); hip.position.set(0, 1.0, 0); hip.rotation.y = a; g.add(hip);
    add(hip, box(0.6, 0.07, 0.07), M.dark, 0.3, -0.2, 0, 0, 0, -0.75);
    add(hip, box(0.07, 0.62, 0.07), M.steel, 0.56, -0.68, 0, 0, 0, 0.2);
    legs.push(hip);
  }
  const head = new THREE.Group(); head.position.y = 1.15; g.add(head);
  add(head, sph(0.34, 18, 12), shell, 0, 0, 0).scale.set(1.1, 0.8, 1);
  add(head, box(0.5, 0.12, 0.56), M.dark, -0.05, 0.2, 0);
  add(head, cyl(0.08, 0.1, 0.7, 12), M.black, 0.52, 0, 0, 0, 0, Math.PI / 2);
  const core = add(head, sph(0.14, 12, 10), glow(0xff3df0, 5), 0.3, 0.06, 0);
  const tip = add(head, sph(0.07, 10, 8), glow(0xff3df0, 6), 0.9, 0, 0);
  return { g, head, core, tip, legs };
}
export function hive() {
  const g = new THREE.Group();
  const shell = paint(0x2c2436, 0.3, 0.5);
  const body = new THREE.Group(); body.position.y = 1.0; g.add(body);
  add(body, sph(0.82, 24, 16), shell, 0, 0, 0).scale.set(1, 1.15, 1);
  const vents = [];
  for (let i = 0; i < 4; i++) { const t = add(body, tor(0.84 - Math.abs(i - 1.5) * 0.12, 0.04, 32), glow(0xb35cff, 3), 0, -0.45 + i * 0.3, 0, Math.PI / 2, 0, 0); vents.push(t); }
  add(body, sph(0.24, 14, 10), glow(0xd18aff, 4), 0, 0.9, 0);
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; add(g, box(0.16, 0.9, 0.16), M.dark, Math.cos(a) * 0.75, 0.35, Math.sin(a) * 0.75, Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); }
  return { g, body, vents };
}
export function dart() {
  const g = new THREE.Group();
  const body = new THREE.Group(); body.position.y = 0.9; g.add(body);
  add(body, cyl(0.0, 0.17, 0.62, 10), paint(0x40384a, 0.3, 0.8), 0.06, 0, 0, 0, 0, -Math.PI / 2);
  for (const s of [-1, 1]) add(body, box(0.26, 0.03, 0.22), M.dark, -0.12, 0, s * 0.16, 0, 0, 0);
  const tail = add(body, sph(0.1, 10, 8), glow(0xc070ff, 6), -0.28, 0, 0);
  return { g, body, tail };
}
export function pylon() {
  const g = new THREE.Group();
  add(g, cyl(0.42, 0.5, 0.3, 16), M.dark, 0, 0.15, 0);
  add(g, cyl(0.12, 0.16, 1.3, 12), M.steel, 0, 0.9, 0);
  for (let i = 0; i < 3; i++) add(g, tor(0.24 - i * 0.04, 0.05, 20), M.copper, 0, 0.7 + i * 0.28, 0, Math.PI / 2, 0, 0);
  const top = add(g, sph(0.2, 16, 12), glow(0x6fe8ff, 4), 0, 1.65, 0);
  return { g, top };
}
export function splitter(shard = false) {
  const g = new THREE.Group();
  const body = new THREE.Group(); body.position.y = shard ? 0.5 : 0.75; g.add(body);
  const mat = paint(0x24402c, 0.25, 0.7);
  if (shard) {
    add(body, geo('ico', () => new THREE.IcosahedronGeometry(0.36, 0)), mat, 0, 0, 0);
    const core = add(body, sph(0.16, 10, 8), glow(0x7dff6a, 5), 0, 0, 0);
    return { g, body, core };
  }
  add(body, sph(0.46, 18, 12), mat, 0, 0, 0.26);
  add(body, sph(0.46, 18, 12), mat, 0, 0, -0.26);
  const core = add(body, tor(0.42, 0.06, 28), glow(0x7dff6a, 4), 0, 0, 0);
  return { g, body, core };
}
export function dummy() {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; add(g, box(0.06, 0.9, 0.06), M.dark, Math.cos(a) * 0.22, 0.42, Math.sin(a) * 0.22, Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); }
  const disc = new THREE.Group(); disc.position.y = 1.0; g.add(disc);
  add(disc, cyl(0.5, 0.5, 0.08, 24), paint(0xeeeeee, 0.6, 0), 0, 0, 0, 0, 0, Math.PI / 2);
  add(disc, cyl(0.34, 0.34, 0.1, 24), paint(0xff6a2a, 0.6, 0), 0, 0, 0, 0, 0, Math.PI / 2);
  add(disc, cyl(0.14, 0.14, 0.12, 16), glow(0xffd070, 3), 0, 0, 0, 0, 0, Math.PI / 2);
  return { g, disc };
}

// ------------------------------------------------------------------ survivors
const JACKETS = [0xd94a3a, 0x3a7bd9, 0xe0b23c, 0x4aa86a, 0x8a5ad0, 0xe07a2c];
const PANTS = [0x2b3140, 0x4a3b2c, 0x30323a, 0x5a5e66];
const SKIN = [0xf1c7a5, 0xd59c74, 0xa86f4a, 0x6e4630];
const HAIR = [0x1a1410, 0x5a3a20, 0xc8a060, 0x2a2a2a];
export function survivor(look = 0) {
  const g = new THREE.Group();
  const jacket = cloth(JACKETS[look % 6]), pants = cloth(PANTS[look % 4]), skin = cloth(SKIN[(look * 3) % 4]), hair = cloth(HAIR[(look * 5 + 1) % 4]);
  const legs = [];
  for (const s of [-1, 1]) { const hip = new THREE.Group(); hip.position.set(0, 0.82, s * 0.1); g.add(hip); add(hip, cap(0.08, 0.6, 8), pants, 0, -0.4, 0); legs.push(hip); }
  add(g, cap(0.18, 0.36, 10), jacket, 0, 1.15, 0).scale.set(0.8, 1, 1.1);
  add(g, sph(0.13, 14, 10), skin, 0.01, 1.58, 0);
  add(g, sph(0.135, 14, 10), hair, -0.02, 1.62, 0).scale.set(1, 0.7, 1);
  const arms = [];
  for (const s of [-1, 1]) { const sh = new THREE.Group(); sh.position.set(0, 1.38, s * 0.24); g.add(sh); add(sh, cap(0.06, 0.5, 8), jacket, 0, -0.3, 0); arms.push(sh); }
  return { g, legs, arms };
}

// ------------------------------------------------------------------ bosses
export function boss(key) {
  const g = new THREE.Group();
  const parts = { g, legs: [], eye: null, spin: null, mouth: null, glows: [] };
  if (key === 'foreman') {
    const yel = paint(0xd8961c, 0.42, 0.45);
    const body = new THREE.Group(); body.position.y = 2.4; g.add(body); parts.body = body;
    add(body, box(3.0, 1.2, 2.4), yel, 0, 0, 0);
    add(body, box(3.02, 0.2, 2.42), M.stripes, 0, -0.5, 0);
    add(body, box(1.2, 0.9, 1.6), yel, 0.8, 0.9, 0);
    add(body, box(0.6, 0.6, 1.4), M.glass, 1.2, 0.95, 0);
    parts.eye = add(body, box(0.1, 0.3, 1.2), glow(0xff3a2a, 5), 1.52, 0.2, 0);
    for (const s of [-1, 1]) parts.glows.push(add(body, cyl(0.16, 0.16, 0.2, 12), glow(0xff8a1a, 6), -0.8, 0.75, s * 0.8));
    add(body, cyl(0.4, 0.5, 1.2, 14), M.dark, -1.0, 0.9, 0);
    for (const [x, z] of [[1.2, 1.3], [-1.2, 1.3], [1.2, -1.3], [-1.2, -1.3]]) {
      const hip = new THREE.Group(); hip.position.set(x, 2.2, z); g.add(hip);
      add(hip, box(0.4, 1.4, 0.4), M.dark, 0, -0.5, Math.sign(z) * 0.3, Math.sign(z) * 0.4, 0, 0);
      add(hip, box(0.5, 1.6, 0.5), yel, 0, -1.4, Math.sign(z) * 0.55, Math.sign(z) * -0.1, 0, 0);
      add(hip, cyl(0.5, 0.6, 0.25, 14), M.dark, 0, -2.15, Math.sign(z) * 0.6);
      parts.legs.push(hip);
    }
  } else if (key === 'tramline') {
    const teal = paint(0x2b7c76, 0.4, 0.45), cream = paint(0xe0d6bc, 0.5, 0.2);
    const body = new THREE.Group(); body.position.y = 0.4; g.add(body); parts.body = body;
    add(body, box(4.2, 1.5, 2.0), teal, 0, 1.0, 0);
    add(body, box(4.22, 0.5, 2.02), cream, 0, 1.6, 0);
    add(body, box(3.6, 0.5, 2.04), M.glass, -0.1, 1.55, 0);
    for (let i = 0; i < 6; i++) add(body, box(0.42, 0.4, 2.06), glow(0xffe0a0, 1.6), -1.6 + i * 0.6, 1.55, 0);
    add(body, box(4.0, 0.25, 1.8), M.dark, 0, 0.18, 0);
    // ram plow
    const plow = new THREE.Group(); plow.position.set(2.2, 0.6, 0); body.add(plow); parts.plow = plow;
    for (const s of [-1, 1]) add(plow, box(1.3, 1.0, 0.16), M.stripes, 0.3, 0, s * 0.5, 0, s * 0.75, 0);
    parts.eye = add(body, box(0.1, 0.25, 1.4), glow(0xff3a2a, 5), 2.12, 1.3, 0);
    add(body, box(0.8, 0.1, 0.1), M.steel, 0, 2.2, 0);
    add(body, box(0.1, 0.6, 0.1), M.steel, 0, 1.95, 0);
    for (const x of [-1.4, 1.4]) for (const s of [-1, 1]) add(body, cyl(0.32, 0.32, 0.2, 14), M.black, x, 0.1, s * 0.9, Math.PI / 2, 0, 0);
  } else if (key === 'crucible') {
    const shell = paint(0x47403a, 0.55, 0.7);
    add(g, cyl(2.0, 2.4, 2.6, 28), shell, 0, 1.3, 0);
    for (let i = 0; i < 3; i++) add(g, tor(2.1 + i * 0.1, 0.09, 36), M.dark, 0, 0.5 + i * 0.9, 0, Math.PI / 2, 0, 0);
    parts.mouth = add(g, cyl(1.5, 1.5, 0.1, 28), glow(0xff6a1a, 4), 0, 2.62, 0);
    parts.glows.push(add(g, tor(1.6, 0.12, 36), glow(0xffa040, 5), 0, 2.62, 0, Math.PI / 2, 0, 0));
    for (const s of [-1, 1]) { add(g, cyl(0.3, 0.38, 2.4, 14), M.dark, -1.2, 3.4, s * 1.1); parts.glows.push(add(g, cyl(0.24, 0.24, 0.06, 12), glow(0xff8a2a, 3), -1.2, 4.6, s * 1.1)); }
    parts.eye = add(g, box(0.1, 0.5, 1.6), glow(0xff3a2a, 4), 2.25, 1.2, 0);
    const spin = new THREE.Group(); spin.position.y = 2.9; g.add(spin); parts.spin = spin;
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; add(spin, box(1.6, 0.18, 0.3), M.steel, Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8, 0, -a, 0); }
  } else if (key === 'archivist') {
    const body = new THREE.Group(); body.position.y = 2.6; g.add(body); parts.body = body;
    add(body, sph(1.5, 32, 20), M.glass, 0, 0, 0);
    parts.eye = add(body, sph(0.75, 24, 16), glow(0x3fb8ff, 3.5), 0, 0, 0);
    const spin = new THREE.Group(); body.add(spin); parts.spin = spin;
    add(spin, tor(1.95, 0.12, 48), M.steel, 0, 0, 0, Math.PI / 2, 0, 0);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; add(spin, box(0.5, 0.9, 0.12), paint(0x1d2a3a, 0.3, 0.8), Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0, 0, -a, 0); parts.glows.push(add(spin, box(0.1, 0.6, 0.14), glow(0x3fb8ff, 4), Math.cos(a) * 2.05, 0, Math.sin(a) * 2.05, 0, -a, 0)); }
    add(g, cyl(0.9, 1.3, 0.25, 24), M.dark, 0, 0.12, 0);
    parts.glows.push(add(g, tor(1.0, 0.06, 32), glow(0x3fb8ff, 3), 0, 0.28, 0, Math.PI / 2, 0, 0));
  } else {
    // the Overseer: a crowned tower with an eye and six claws
    const body = new THREE.Group(); g.add(body); parts.body = body;
    add(body, cyl(1.6, 2.4, 1.0, 6), M.dark, 0, 0.5, 0);
    add(body, cyl(1.2, 1.6, 2.2, 6), paint(0x3a1f22, 0.35, 0.7), 0, 2.1, 0);
    parts.eye = add(body, sph(0.7, 24, 16), glow(0xff2a3a, 4), 0.9, 2.3, 0);
    add(body, tor(0.78, 0.1, 32), M.steel, 0.9, 2.3, 0, 0, Math.PI / 2, 0);
    const spin = new THREE.Group(); spin.position.y = 3.4; body.add(spin); parts.spin = spin;
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const c = add(spin, geo('claw', () => new THREE.ConeGeometry(0.22, 1.4, 6)), M.steel, Math.cos(a) * 1.2, 0.4, Math.sin(a) * 1.2); c.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); }
    parts.glows.push(add(spin, tor(1.3, 0.08, 36), glow(0xff5a3a, 4), 0, 0, 0, Math.PI / 2, 0, 0));
  }
  return parts;
}
export function orb() {
  const g = new THREE.Group();
  add(g, sph(0.45, 18, 12), M.glass, 0, 1.6, 0);
  const core = add(g, sph(0.26, 14, 10), glow(0x3fb8ff, 5), 0, 1.6, 0);
  return { g, core };
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
export const GEO = { box, cyl, sph, cap, tor };
export { add };
