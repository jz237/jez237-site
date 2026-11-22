// UNDERSTORM 2026 — every model is built from primitives at load. No external art.
import * as THREE from '../vendor/three.module.min.js';

const C = (hex, m = 1) => new THREE.Color(hex).multiplyScalar(m);
const std = (color, metalness, roughness, o = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...o });
const glow = (hex, m) => new THREE.MeshBasicMaterial({ color: C(hex, m) });
export const MAT = {
  hull: std(0x9aa3ad, 0.8, 0.36), white: std(0xe9eef3, 0.35, 0.32), shipA: std(0x4c5a6c, 0.72, 0.34), shipB: std(0xc9d2da, 0.6, 0.3), accent: std(0xff8a2a, 0.35, 0.45, { emissive: 0x7a2c00, emissiveIntensity: 0.5 }), dark: std(0x20242b, 0.65, 0.5), rust: std(0x7d4c33, 0.55, 0.7), brass: std(0xb98a3c, 0.9, 0.35),
  glass: std(0xaeeaff, 0.1, 0.06, { transparent: true, opacity: 0.46, emissive: 0x1a6a80, emissiveIntensity: 0.9 }),
  glassA: std(0xffd9a0, 0.1, 0.06, { transparent: true, opacity: 0.5, emissive: 0x80501a, emissiveIntensity: 0.9 }),
  glassV: std(0xc8b0ff, 0.2, 0.05, { transparent: true, opacity: 0.8, emissive: 0x4a2ac0, emissiveIntensity: 1.1, flatShading: true }),
  whale: std(0x9fd8d0, 0.1, 0.25, { transparent: true, opacity: 0.62, emissive: 0x0e3a3a, emissiveIntensity: 0.8 }),
  gT: glow(0x52ffd8, 2.6), gA: glow(0xffb347, 2.6), gR: glow(0xff4a3a, 3), gV: glow(0xc8a0ff, 2.4), gW: glow(0xffffff, 2.2), gDim: glow(0x5a4a8a, 0.8),
};
const PI = Math.PI;
export const G = { sph: new THREE.SphereGeometry(1, 18, 12), ico: new THREE.IcosahedronGeometry(1, 0), ico1: new THREE.IcosahedronGeometry(1, 1), box: new THREE.BoxGeometry(1, 1, 1), cone: new THREE.ConeGeometry(1, 1, 10),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 14), tor: new THREE.TorusGeometry(1, 0.12, 6, 22), torF: new THREE.TorusGeometry(1, 0.26, 8, 22), oct: new THREE.OctahedronGeometry(1, 0), half: new THREE.SphereGeometry(1, 18, 10, 0, PI * 2, 0, PI / 2), arc: new THREE.TorusGeometry(1, 0.14, 6, 14, PI) };
const grp = () => new THREE.Group();
export const add = (g, geo, mat, p = [0, 0, 0], s = 1, r) => { const m = new THREE.Mesh(geo, mat); m.position.set(p[0], p[1], p[2]); if (typeof s === 'number') m.scale.setScalar(s); else m.scale.set(s[0], s[1], s[2]); if (r) m.rotation.set(r[0], r[1], r[2]); m.castShadow = !!mat.isMeshStandardMaterial && !mat.transparent; g.add(m); return m; };
const XP = [0, 0, -PI / 2], XM = [0, 0, PI / 2]; // cone pointing +x / -x

export function makeShip(enemy) {
  // an original twin-boom salvage fighter: needle fuselage, swept wings out to two engine booms
  const g = grp(), body = grp(); g.add(body); g.userData.body = body; const H1 = enemy ? MAT.dark : MAT.shipA, H2 = enemy ? MAT.rust : MAT.shipB, AC = enemy ? MAT.rust : MAT.accent, GL = enemy ? MAT.gR : MAT.gT, DK = MAT.dark;
  add(body, G.sph, H1, [-0.05, 0, 0], [0.82, 0.17, 0.22]); add(body, G.cone, H1, [0.98, -0.01, 0], [0.13, 0.9, 0.17], XP); add(body, G.cone, H2, [-0.72, 0, 0], [0.16, 0.5, 0.2], XM);
  add(body, G.sph, enemy ? MAT.gR : MAT.glassA, [0.3, 0.11, 0], [0.34, 0.12, 0.13]); add(body, G.box, DK, [0.3, 0.06, 0], [0.74, 0.03, 0.3]);
  add(body, G.box, H2, [-0.5, 0.26, 0], [0.42, 0.36, 0.035], [0, 0, -0.55]); add(body, G.box, GL, [-0.62, 0.42, 0], [0.12, 0.04, 0.045]);
  add(body, G.box, DK, [0.05, -0.15, 0], [0.5, 0.08, 0.2]); add(body, G.box, GL, [0.05, -0.2, 0], [0.42, 0.015, 0.05]);
  for (const s of [1, -1]) {
    add(body, G.box, H2, [-0.18, -0.01, s * 0.4], [0.86, 0.045, 0.52], [0, s * 0.42, 0]); add(body, G.box, DK, [-0.34, 0.02, s * 0.36], [0.4, 0.05, 0.3], [0, s * 0.42, 0]);
    add(body, G.cyl, H1, [-0.3, -0.02, s * 0.7], [0.095, 0.95, 0.095], XP); add(body, G.cone, H1, [0.3, -0.02, s * 0.7], [0.095, 0.26, 0.095], XP);
    add(body, G.cyl, DK, [-0.8, -0.02, s * 0.7], [0.125, 0.16, 0.125], XP); add(body, G.sph, GL, [-0.86, -0.02, s * 0.7], [0.06, 0.09, 0.09]);
    add(body, G.box, H2, [-0.55, 0.13, s * 0.74], [0.3, 0.22, 0.03], [s * 0.35, 0, -0.5]); add(body, G.box, GL, [-0.05, 0.035, s * 0.7], [0.5, 0.02, 0.03]);
    add(body, G.sph, GL, [-0.52, 0, s * 0.93], 0.035); add(body, G.box, H2, [-0.4, -0.01, s * 0.86], [0.34, 0.03, 0.2], [0, s * 0.5, 0]);
  }
  add(body, G.sph, enemy ? MAT.gR : MAT.gA, [1.4, -0.01, 0], 0.03); add(body, G.sph, GL, [-0.95, 0, 0], [0.1, 0.11, 0.13]);
  // detail: canopy frame, dorsal spine, intakes, nozzle rings, gun, aerials, stripes and tip lights
  for (const q of [0.1, 0.3, 0.5]) add(body, G.box, DK, [q, 0.165, 0], [0.018, 0.1, 0.27]); add(body, G.box, DK, [0.3, 0.215, 0], [0.5, 0.014, 0.02]);
  add(body, G.box, H1, [-0.3, 0.13, 0], [0.62, 0.07, 0.07]); add(body, G.box, AC, [-0.06, 0.168, 0], [0.16, 0.012, 0.075]); add(body, G.box, AC, [0.72, 0.062, 0], [0.12, 0.012, 0.12]);
  add(body, G.cyl, DK, [0.72, -0.19, 0], [0.028, 0.62, 0.028], XP); add(body, G.cyl, H2, [0.42, -0.19, 0], [0.05, 0.16, 0.05], XP); add(body, G.sph, GL, [1.04, -0.19, 0], 0.022);
  add(body, G.cyl, DK, [-0.42, 0.44, 0], [0.008, 0.36, 0.008], [0, 0, -0.5]); add(body, G.box, DK, [0.62, 0.0, 0.2], [0.26, 0.012, 0.012]); add(body, G.box, DK, [0.62, 0.0, -0.2], [0.26, 0.012, 0.012]);
  for (const s of [1, -1]) {
    add(body, G.tor, DK, [-0.88, -0.02, s * 0.7], [0.13, 0.13, 0.5], [0, PI / 2, 0]); add(body, G.tor, H2, [0.12, -0.02, s * 0.7], [0.1, 0.1, 0.4], [0, PI / 2, 0]); add(body, G.tor, H2, [-0.5, -0.02, s * 0.7], [0.1, 0.1, 0.4], [0, PI / 2, 0]);
    add(body, G.box, DK, [0.2, -0.085, s * 0.7], [0.2, 0.05, 0.11]); add(body, G.cone, GL, [-1.0, -0.02, s * 0.7], [0.07, 0.3, 0.07], XM);
    add(body, G.box, AC, [-0.2, 0.016, s * 0.44], [0.08, 0.012, 0.42], [0, s * 0.42, 0]); add(body, G.box, DK, [-0.02, 0.016, s * 0.4], [0.5, 0.012, 0.012], [0, s * 0.42, 0]); add(body, G.box, DK, [-0.32, 0.016, s * 0.52], [0.5, 0.012, 0.012], [0, s * 0.42, 0]);
    add(body, G.sph, s > 0 ? MAT.gR : MAT.gT, [-0.46, 0.0, s * 0.98], 0.022); add(body, G.box, H1, [-0.62, 0.245, s * 0.78], [0.12, 0.012, 0.035], [s * 0.35, 0, -0.5]);
  }
  body.rotation.x = 0.42;
  if (enemy) g.scale.x = -1;
  return g;
}
export function makeAnchor(enemy) {
  const g = grp(), GL = enemy ? MAT.gR : MAT.gT; add(g, G.ico, GL, [0, 0, 0], 0.36); add(g, G.ico1, MAT.glass, [0, 0, 0], 0.58);
  const r = grp(); g.add(r); g.userData.ring = r; for (let i = 0; i < 3; i++) { const c = grp(); c.rotation.x = (i * PI * 2) / 3; add(c, G.arc, enemy ? MAT.dark : MAT.hull, [0, 0, 0], 0.72, [PI / 2, 0, 0]); add(c, G.cone, enemy ? MAT.rust : MAT.brass, [0.72, 0, 0], [0.1, 0.36, 0.1], XP); r.add(c); }
  return g;
}

export const FOE_MODELS = {
  mote() { const g = grp(); add(g, G.sph, MAT.glass, [0, 0, 0], [0.55, 0.5, 0.5]); g.userData.core = add(g, G.sph, MAT.gA, [0, 0, 0], 0.2); for (let i = 0; i < 4; i++) add(g, G.cone, MAT.glass, [0.8, (i - 1.5) * 0.2, (i % 2 - 0.5) * 0.3], [0.06, 1, 0.06], XM); return g; },
  shard() { const g = grp(); add(g, G.oct, MAT.glassV, [0, 0, 0], [0.85, 0.3, 0.3]); g.userData.core = add(g, G.sph, MAT.gR, [0, 0, 0], 0.16); return g; },
  turret() { const g = grp(), b = grp(); g.add(b); g.userData.base = b; add(b, G.cyl, MAT.dark, [0, -0.35, 0], [0.75, 0.4, 0.75]); add(b, G.tor, MAT.brass, [0, -0.15, 0], 0.7, [PI / 2, 0, 0]); const p = grp(); g.add(p); g.userData.pivot = p; add(p, G.sph, MAT.hull, [0, 0, 0], 0.48); add(p, G.cyl, MAT.dark, [0, 0.6, 0], [0.13, 0.9, 0.13]); add(p, G.sph, MAT.gR, [0, 1.05, 0], 0.11); return g; },
  puffer() { const g = grp(); add(g, G.sph, MAT.glassA, [0, 0, 0], 0.8); g.userData.core = add(g, G.ico, MAT.gA, [0, 0, 0], 0.3); for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2, b = (i % 3 - 1) * 0.7; add(g, G.cone, MAT.dark, [Math.cos(a) * 0.85 * Math.cos(b), Math.sin(a) * 0.85 * Math.cos(b), Math.sin(b) * 0.85], [0.09, 0.42, 0.09], [b, 0, a - PI / 2]); } return g; },
  spinner() { const g = grp(), s = grp(); g.add(s); g.userData.spin = s; add(s, G.torF, MAT.hull, [0, 0, 0], 0.7); for (const a of [0, PI]) add(s, G.sph, MAT.dark, [Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0], 0.3); for (const a of [PI / 2, -PI / 2]) add(s, G.sph, MAT.gA, [Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0], 0.14); add(g, G.ico, MAT.gR, [0, 0, 0], 0.26); return g; },
  crawler() { const g = grp(), s = grp(); g.add(s); g.userData.spin = s; add(s, G.cyl, MAT.dark, [0, 0, 0], [0.55, 0.5, 0.55], [PI / 2, 0, 0]); for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; add(s, G.box, MAT.brass, [Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0], [0.22, 0.14, 0.56], [0, 0, a]); } add(g, G.sph, MAT.gA, [0, 0, 0.3], 0.17); add(g, G.sph, MAT.gA, [0, 0, -0.3], 0.17); return g; },
  carrier() { const g = grp(); add(g, G.box, MAT.hull, [0, 0, 0], [1.25, 0.85, 0.85]); add(g, G.box, MAT.gT, [0, 0, 0], [1.27, 0.12, 0.87]); add(g, G.box, MAT.dark, [0, 0, 0], [0.3, 0.9, 0.9]); g.userData.spin = add(g, G.tor, MAT.brass, [0, 0.62, 0], 0.55, [PI / 2, 0, 0]); add(g, G.cyl, MAT.dark, [0, 0.5, 0], [0.06, 0.3, 0.06]); return g; },
  glassback() { const g = grp(); add(g, G.half, MAT.dark, [-0.15, 0, 0], [0.95, 0.8, 0.95], XM); add(g, G.tor, MAT.brass, [-0.12, 0, 0], 0.93, [0, PI / 2, 0]); add(g, G.sph, MAT.glass, [0.35, 0, 0], [0.8, 0.62, 0.62]); add(g, G.sph, MAT.gA, [0.45, 0, 0], 0.22); add(g, G.sph, MAT.gR, [-0.92, 0, 0], 0.1); return g; },
  gunship() { const g = grp(); add(g, G.box, MAT.hull, [0.2, 0, 0], [2.2, 0.8, 1.1]); add(g, G.cone, MAT.dark, [-1.5, 0, 0], [0.5, 1.4, 0.56], XM); add(g, G.sph, MAT.glassA, [-0.7, 0.36, 0], [0.5, 0.2, 0.3]); for (const s of [1, -1]) { add(g, G.cyl, MAT.dark, [-0.2, s * 0.72, 0], [0.24, 1.7, 0.24], XP); add(g, G.sph, MAT.gR, [-1.1, s * 0.72, 0], 0.15); add(g, G.sph, MAT.gA, [1.35, s * 0.3, 0], 0.2); add(g, G.box, MAT.rust, [0.6, s * 0.2, 0.75], [1, 0.08, 0.5]); add(g, G.box, MAT.rust, [0.6, s * 0.2, -0.75], [1, 0.08, 0.5]); } return g; },
  lurker() { const g = grp(); add(g, G.sph, MAT.dark, [0, 0, 0], [0.75, 0.5, 0.5]); add(g, G.cone, MAT.dark, [0.9, 0, 0], [0.34, 1.1, 0.34], XP); for (const s of [1, -1]) { add(g, G.sph, MAT.gR, [-0.5, 0.14, s * 0.26], 0.09); add(g, G.cone, MAT.glass, [0.3, s * 0.4, 0], [0.06, 1.2, 0.2], [0, 0, -PI / 2 + s * 0.5]); } return g; },
  weaver() { const g = grp(); add(g, G.sph, MAT.hull, [0, 0, 0], [0.75, 0.62, 0.62]); add(g, G.cone, MAT.dark, [-0.75, -0.1, 0], [0.34, 0.6, 0.4], XM); add(g, G.sph, MAT.gR, [-0.3, 0.3, 0.36], 0.12); add(g, G.sph, MAT.gR, [-0.3, 0.3, -0.36], 0.12); g.userData.segs = []; for (let i = 0; i < 12; i++) { const s = grp(); add(s, G.sph, MAT.dark, [0, 0, 0], [0.52, 0.5, 0.5]); add(s, G.tor, MAT.brass, [0, 0, 0], 0.5, [0, PI / 2, 0]); add(s, G.sph, MAT.gA, [0, 0.42, 0], 0.09); s.visible = false; g.add(s); g.userData.segs.push(s); } return g; },
  whale() { const g = grp(), b = grp(); g.add(b); g.userData.body = b; add(b, G.sph, MAT.whale, [0, 0, 0], [1.25, 0.6, 0.62]); add(b, G.cone, MAT.whale, [1.45, 0, 0], [0.34, 1.1, 0.4], XP); add(b, G.box, MAT.whale, [1.95, 0, 0], [0.3, 0.05, 1.1]); for (const s of [1, -1]) { add(b, G.box, MAT.whale, [-0.2, -0.25, s * 0.6], [0.6, 0.05, 0.45], [s * 0.5, 0, 0]); add(b, G.sph, MAT.gW, [-0.95, 0.1, s * 0.34], 0.045); } for (let i = 0; i < 5; i++) add(b, G.sph, MAT.gT, [-0.7 + i * 0.38, 0.02 + Math.sin(i) * 0.1, 0], [0.12, 0.035, 0.035]); return g; },
  predator() { const g = grp(), b = grp(); g.add(b); g.userData.rot = b; add(b, G.cone, MAT.dark, [0.1, 0, 0], [0.3, 1.5, 0.22], XP); add(b, G.box, MAT.rust, [-0.3, 0, 0], [0.5, 0.05, 1.1], [0, 0, 0]); add(b, G.box, MAT.rust, [-0.45, 0.2, 0], [0.4, 0.4, 0.05], [0, 0, -0.6]); add(b, G.sph, MAT.gR, [0.45, 0.08, 0.12], 0.07); add(b, G.sph, MAT.gR, [0.45, 0.08, -0.12], 0.07); return g; },
  seeker() { const g = grp(); add(g, G.ico1, MAT.dark, [0, 0, 0], 0.6); g.userData.on = add(g, G.sph, MAT.gW, [-0.38, 0, 0], 0.28); g.userData.off = add(g, G.sph, MAT.gDim, [-0.38, 0, 0], 0.22); for (let i = 0; i < 3; i++) add(g, G.cone, MAT.dark, [0.7, (i - 1) * 0.3, 0], [0.08, 0.8, 0.08], XM); return g; },
  mine() { const g = grp(); add(g, G.ico, MAT.dark, [0, 0, 0], 0.5); g.userData.core = add(g, G.sph, MAT.gR, [0, 0, 0], 0.2); for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; add(g, G.cone, MAT.brass, [Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0], [0.08, 0.34, 0.08], [0, 0, a - PI / 2]); } add(g, G.cone, MAT.brass, [0, 0, 0.6], [0.08, 0.34, 0.08], [PI / 2, 0, 0]); return g; },
  spitter() { const g = grp(), b = grp(); g.add(b); g.userData.base = b; add(b, G.half, MAT.rust, [0, -0.5, 0], [0.9, 0.9, 0.9]); add(b, G.tor, MAT.dark, [0, 0.35, 0], 0.42, [PI / 2, 0, 0]); add(b, G.sph, MAT.gA, [0, 0.2, 0], 0.26); return g; },
  wreck() { const g = makeShip(true); g.userData.lamp = add(g, G.sph, MAT.gR, [0.3, 0.2, 0], 0.12); g.scale.setScalar(1.25); g.scale.x = -1.25; return g; },
};

export const PART_MODELS = {
  pod() { const g = grp(); add(g, G.cyl, MAT.hull, [0, 0, 0], [0.8, 1.7, 0.8], XP); add(g, G.cone, MAT.dark, [-1, 0, 0], [0.7, 0.7, 0.7], XP); add(g, G.tor, MAT.brass, [-0.4, 0, 0], 0.82, [0, PI / 2, 0]); g.userData.weak = add(g, G.sph, MAT.gA, [-0.75, 0, 0], 0.42); return g; },
  claw() { const g = grp(); add(g, G.sph, MAT.dark, [0, 0, 0], 0.7); for (const s of [1, -1]) { add(g, G.arc, MAT.hull, [-0.3, 0, 0], [0.9, 0.9, 1.6], [0, 0, s > 0 ? PI / 2 : -PI / 2 + PI]); add(g, G.cone, MAT.brass, [-1, s * 0.5, 0], [0.16, 0.7, 0.16], XM); } g.userData.weak = add(g, G.sph, MAT.gA, [0, 0, 0.5], 0.34); return g; },
  eye() { const g = grp(); add(g, G.ico1, MAT.dark, [0.15, 0, 0], 0.95); add(g, G.tor, MAT.brass, [-0.3, 0, 0], 0.8, [0, PI / 2, 0]); g.userData.weak = add(g, G.sph, MAT.gR, [-0.42, 0, 0], 0.62); g.userData.lid = add(g, G.half, MAT.hull, [-0.36, 0, 0], [0.74, 0.74, 0.74], XM); return g; },
  hull() { const g = grp(); add(g, G.ico1, MAT.rust, [0, 0, 0], [1, 1, 0.9]); add(g, G.box, MAT.dark, [0, 0, 0.5], [1.3, 0.2, 0.6]); add(g, G.box, MAT.hull, [0.1, 0.5, 0.3], [0.9, 0.14, 0.9]); add(g, G.box, MAT.hull, [0.1, -0.5, 0.3], [0.9, 0.14, 0.9]); return g; },
  core() { const g = grp(); g.userData.weak = add(g, G.ico, MAT.gR, [0, 0, 0], 0.6); g.userData.shell = add(g, G.ico1, MAT.glassA, [0, 0, 0], 0.92); const s = grp(); g.add(s); g.userData.spin = s; add(s, G.tor, MAT.brass, [0, 0, 0], 1.02); add(s, G.tor, MAT.hull, [0, 0, 0], 1.02, [PI / 2, 0, 0]); return g; },
  plate() { const g = grp(); add(g, G.box, MAT.hull, [0, 0, 0], [0.5, 2, 1.8]); add(g, G.box, MAT.dark, [0.1, 0, 0], [0.4, 1.6, 2]); add(g, G.box, MAT.gA, [-0.27, 0, 0], [0.04, 1.2, 0.1]); return g; },
  shutter() { const g = grp(); g.userData.slide = add(g, G.box, MAT.hull, [0, 0, 0], [0.8, 1.96, 2.2]); add(g.userData.slide, G.box, MAT.dark, [-0.52, 0, 0], [0.1, 0.9, 0.9]); add(g.userData.slide, G.box, MAT.gA, [-0.58, 0, 0], [0.04, 0.12, 0.7]); return g; },
  gun() { const g = grp(); add(g, G.sph, MAT.dark, [0, 0, 0], 0.9); add(g, G.cyl, MAT.hull, [-0.8, 0, 0], [0.26, 1, 0.26], XP); g.userData.weak = add(g, G.sph, MAT.gA, [0, 0, 0.6], 0.4); return g; },
  ringer() { const g = grp(); const s = grp(); g.add(s); g.userData.spin = s; add(s, G.torF, MAT.hull, [0, 0, 0], 0.8); g.userData.weak = add(g, G.ico, MAT.gA, [0, 0, 0], 0.4); return g; },
  lobber() { const g = grp(); add(g, G.half, MAT.rust, [0, -0.3, 0], 0.95); add(g, G.tor, MAT.dark, [0, 0.4, 0], 0.5, [PI / 2, 0, 0]); g.userData.weak = add(g, G.sph, MAT.gA, [0, 0.3, 0], 0.4); return g; },
  maw() { const g = grp(); add(g, G.sph, MAT.dark, [0, 0, 0], [1, 0.8, 0.8]); for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2; add(g, G.cone, MAT.white, [-0.85, Math.sin(a) * 0.5, Math.cos(a) * 0.5], [0.08, 0.4, 0.08], XM); } for (let i = 0; i < 5; i++) add(g, G.box, MAT.rust, [0.2 + i * 0.1, 0.75, 0], [0.5, 0.5 - i * 0.07, 0.04], [0, 0, -0.5]); return g; },
  seg() { const g = grp(); add(g, G.ico1, MAT.dark, [0, 0, 0], 0.95); add(g, G.tor, MAT.gV, [0, 0, 0], 0.9, [0, PI / 2, 0]); for (let i = 0; i < 4; i++) { const a = (i / 4) * PI * 2; add(g, G.cone, MAT.dark, [0, Math.sin(a), Math.cos(a)], [0.16, 0.7, 0.16], [a - PI / 2, 0, 0]); } return g; },
  ace() { const g = makeShip(true); g.scale.setScalar(1.6); g.scale.x = -1.6; return g; },
  anchor() { const g = makeAnchor(true); g.scale.setScalar(1.3); return g; },
};

// ---------------------------------------------------------------- richer silhouettes for the common enemies
const EXTRA = {
  mote(g) { add(g, G.tor, MAT.glassA, [0.05, 0, 0], [0.5, 0.5, 0.5], [0, PI / 2, 0]); add(g, G.half, MAT.glass, [-0.1, 0, 0], [0.62, 0.4, 0.62], XM); for (let i = 0; i < 5; i++) add(g, G.cone, MAT.glassA, [1.0 + (i % 2) * 0.25, (i - 2) * 0.16, ((i * 7) % 3 - 1) * 0.22], [0.035, 1.3, 0.035], XM); add(g, G.sph, MAT.gW, [-0.3, 0.12, 0.3], 0.05); add(g, G.sph, MAT.gW, [-0.3, 0.12, -0.3], 0.05); },
  turret(g) { const p = g.userData.pivot, b = g.userData.base; add(p, G.cyl, MAT.dark, [0.2, 0.55, 0], [0.09, 0.8, 0.09]); add(p, G.cyl, MAT.dark, [-0.2, 0.55, 0], [0.09, 0.8, 0.09]); add(p, G.box, MAT.brass, [0, 0.2, 0], [0.62, 0.14, 0.5]); add(p, G.half, MAT.rust, [0, 0.05, 0.1], [0.56, 0.5, 0.56]); for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; add(b, G.sph, MAT.brass, [Math.cos(a) * 0.7, -0.52, Math.sin(a) * 0.7], 0.07); } add(b, G.box, MAT.gA, [0, -0.3, 0.74], [0.4, 0.05, 0.03]); },
  gunship(g) { add(g, G.box, MAT.rust, [1.2, 0.6, 0], [0.7, 0.7, 0.06], [0, 0, 0.5]); add(g, G.box, MAT.rust, [1.2, -0.6, 0], [0.7, 0.7, 0.06], [0, 0, -0.5]); add(g, G.sph, MAT.dark, [-0.2, -0.55, 0], [0.4, 0.28, 0.4]); add(g, G.cyl, MAT.hull, [-0.55, -0.62, 0], [0.07, 0.6, 0.07], XP); add(g, G.box, MAT.dark, [0.2, 0.44, 0], [1.6, 0.1, 0.9]); add(g, G.box, MAT.gA, [0.2, 0.0, 0.56], [1.4, 0.05, 0.02]); add(g, G.cyl, MAT.hull, [0.9, 0.9, 0], [0.02, 0.9, 0.02]); add(g, G.sph, MAT.gR, [0.9, 1.35, 0], 0.05); for (const s of [1, -1]) { add(g, G.cyl, MAT.dark, [1.3, s * 0.3, 0], [0.22, 0.3, 0.22], XP); add(g, G.box, MAT.hull, [-0.6, s * 0.72, 0.3], [0.5, 0.08, 0.2]); } },
  carrier(g) { for (const x of [-0.42, 0.42]) add(g, G.box, MAT.brass, [x, 0, 0], [0.07, 0.9, 0.9]); for (const s of [1, -1]) { add(g, G.cyl, MAT.dark, [0.5, -0.5, s * 0.36], [0.12, 0.3, 0.12]); add(g, G.sph, MAT.gT, [0.5, -0.68, s * 0.36], 0.08); add(g, G.cyl, MAT.dark, [-0.5, -0.5, s * 0.36], [0.12, 0.3, 0.12]); add(g, G.sph, MAT.gT, [-0.5, -0.68, s * 0.36], 0.08); } add(g, G.sph, MAT.glass, [0, 0.1, 0.46], [0.3, 0.22, 0.1]); },
  glassback(g) { for (let i = 0; i < 4; i++) add(g, G.cone, MAT.brass, [-0.5 + i * 0.12, 0.66 - i * 0.04, 0], [0.07, 0.5 - i * 0.07, 0.07], [0, 0, 0.5]); for (const s of [1, -1]) { add(g, G.box, MAT.glass, [0.6, s * 0.3, 0], [0.9, 0.04, 0.5], [0, 0, s * 0.5]); add(g, G.cone, MAT.dark, [-0.86, s * 0.42, 0], [0.09, 0.44, 0.09], XM); } add(g, G.cone, MAT.glass, [1.25, 0, 0], [0.16, 0.9, 0.3], XP); },
  predator(g) { const b = g.userData.rot; add(b, G.box, MAT.dark, [-0.75, 0, 0], [0.5, 0.04, 0.6]); add(b, G.cone, MAT.rust, [-0.7, 0, 0], [0.14, 0.7, 0.1], XM); add(b, G.box, MAT.rust, [0.0, -0.16, 0], [0.5, 0.3, 0.04], [0, 0, 0.5]); for (const s of [1, -1]) add(b, G.box, MAT.dark, [0.05, 0, s * 0.42], [0.5, 0.03, 0.5], [0, s * 0.7, 0]); add(b, G.sph, MAT.gR, [-0.86, 0, 0], [0.12, 0.05, 0.08]); },
  spinner(g) { const s = g.userData.spin; for (let i = 0; i < 4; i++) { const a = (i / 4) * PI * 2 + PI / 4; add(s, G.box, MAT.brass, [Math.cos(a) * 0.98, Math.sin(a) * 0.98, 0], [0.5, 0.1, 0.3], [0, 0, a]); } add(g, G.tor, MAT.gA, [0, 0, 0], 0.4); add(g, G.cyl, MAT.dark, [0, 0, 0], [0.2, 0.5, 0.2], [PI / 2, 0, 0]); },
  lurker(g) { for (let i = 0; i < 4; i++) add(g, G.cone, MAT.dark, [0.9, (i - 1.5) * 0.22, (i % 2 - 0.5) * 0.4], [0.05, 1.5, 0.05], XP); add(g, G.half, MAT.rust, [-0.2, 0.2, 0], [0.6, 0.4, 0.5]); },
};
// second pass: the rest of the roster gets its own extra parts
Object.assign(EXTRA, {
  shard(g) { for (const s of [1, -1]) { add(g, G.oct, MAT.glassV, [-0.25, s * 0.28, 0], [0.5, 0.1, 0.12], [0, 0, s * 0.5]); add(g, G.oct, MAT.glassV, [-0.25, 0, s * 0.28], [0.5, 0.1, 0.1], [0, s * 0.5, 0]); } add(g, G.tor, MAT.gV, [0.1, 0, 0], [0.2, 0.2, 0.2], [0, PI / 2, 0]); },
  crawler(g) { const s = g.userData.spin; for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2 + 0.26; add(s, G.cone, MAT.dark, [Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0], [0.07, 0.26, 0.07], [0, 0, a - PI / 2]); } add(g, G.tor, MAT.brass, [0, 0, 0.3], 0.3); add(g, G.tor, MAT.brass, [0, 0, -0.3], 0.3); add(g, G.cyl, MAT.hull, [0, 0, 0], [0.16, 0.74, 0.16], [PI / 2, 0, 0]); },
  weaver(g) { for (const s of [1, -1]) { add(g, G.cone, MAT.brass, [-0.95, -0.2, s * 0.22], [0.07, 0.6, 0.07], [0, s * 0.3, PI / 2 + 0.3]); add(g, G.box, MAT.dark, [0.1, 0.5, s * 0.3], [0.5, 0.05, 0.3], [s * 0.5, 0, 0.2]); } add(g, G.tor, MAT.brass, [0.2, 0, 0], 0.6, [0, PI / 2, 0]); add(g, G.box, MAT.dark, [0, 0.62, 0], [0.9, 0.08, 0.1]); },
  seeker(g) { for (let i = 0; i < 3; i++) { const a = (i / 3) * PI * 2; add(g, G.box, MAT.brass, [0.35, Math.cos(a) * 0.5, Math.sin(a) * 0.5], [0.6, 0.04, 0.22], [a, 0, 0]); } add(g, G.tor, MAT.brass, [-0.3, 0, 0], 0.34, [0, PI / 2, 0]); add(g, G.cyl, MAT.dark, [0.75, 0, 0], [0.2, 0.3, 0.2], XP); },
  mine(g) { add(g, G.tor, MAT.brass, [0, 0, 0], 0.52); add(g, G.tor, MAT.brass, [0, 0, 0], 0.52, [PI / 2, 0, 0]); add(g, G.cone, MAT.brass, [0, 0, -0.6], [0.08, 0.34, 0.08], [-PI / 2, 0, 0]); for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2 + 0.52; add(g, G.sph, MAT.dark, [Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0.2], 0.07); } },
  spitter(g) { const b = g.userData.base; for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2; add(b, G.cyl, MAT.dark, [Math.cos(a) * 0.62, -0.1, Math.sin(a) * 0.62], [0.09, 0.7, 0.09], [Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]); add(b, G.sph, MAT.brass, [Math.cos(a) * 0.86, -0.42, Math.sin(a) * 0.86], 0.09); } add(b, G.tor, MAT.brass, [0, -0.4, 0], 0.92, [PI / 2, 0, 0]); add(b, G.cyl, MAT.dark, [0, 0.5, 0], [0.3, 0.3, 0.3]); },
  whale(g) { const b = g.userData.body; add(b, G.box, MAT.whale, [0.2, 0.62, 0], [0.5, 0.3, 0.04], [0, 0, 0.5]); for (let i = 0; i < 6; i++) add(b, G.tor, MAT.whale, [-0.9 + i * 0.12, -0.2, 0], [0.3 + i * 0.03, 0.3 + i * 0.03, 0.5], [0, PI / 2, 0]); for (const s of [1, -1]) for (let i = 0; i < 4; i++) add(b, G.sph, MAT.gT, [-0.2 + i * 0.3, -0.12, s * 0.58], [0.05, 0.02, 0.02]); },
  puffer(g) { add(g, G.tor, MAT.brass, [0, 0, 0], 0.82); add(g, G.tor, MAT.brass, [0, 0, 0], 0.82, [PI / 2, 0, 0]); for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2 + 0.3; add(g, G.sph, MAT.gA, [Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.62], 0.05); } },
});
for (const k in EXTRA) { const base = FOE_MODELS[k]; FOE_MODELS[k] = () => { const g = base(); EXTRA[k](g); return g; }; }

// ---------------------------------------------------------------- boss bodies: the bulk behind the parts you can hit
const ring = (g, n, r, fn) => { for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2; fn(a, Math.cos(a) * r, Math.sin(a) * r, i); } };
export const BOSS_BODIES = {
  // a derelict tug: slab hull, bridge tower, tanks, a gantry and running lights
  sleeper() { const g = grp(); add(g, G.box, MAT.rust, [3.4, 0, -0.4], [6.2, 9.4, 2.2]); add(g, G.box, MAT.dark, [3.2, 0, 0.5], [5.2, 0.3, 0.6]); add(g, G.box, MAT.hull, [1.6, 2.2, 0.6], [2.6, 0.16, 0.8]); add(g, G.box, MAT.hull, [1.6, -2.2, 0.6], [2.6, 0.16, 0.8]);
    add(g, G.box, MAT.hull, [3.6, 5.4, 0], [3.2, 1.6, 1.6]); add(g, G.box, MAT.glassA, [2.6, 5.5, 0.82], [0.9, 0.5, 0.05]); add(g, G.cyl, MAT.dark, [4.4, 6.8, 0], [0.05, 1.6, 0.05]); add(g, G.sph, MAT.gR, [4.4, 7.6, 0], 0.09);
    for (const y of [-2.6, 2.6]) { add(g, G.cyl, MAT.hull, [4.6, y, 0.8], [0.9, 3.4, 0.9], [0, 0, PI / 2]); add(g, G.tor, MAT.brass, [3.4, y, 0.8], 0.92, [0, PI / 2, 0]); add(g, G.tor, MAT.brass, [5.6, y, 0.8], 0.92, [0, PI / 2, 0]); }
    add(g, G.box, MAT.brass, [0.6, 5.0, 0.2], [5.6, 0.22, 0.22], [0, 0, 0.12]); add(g, G.box, MAT.brass, [0.6, 4.4, 0.2], [5.2, 0.12, 0.12], [0, 0, 0.22]); add(g, G.cyl, MAT.dark, [3.6, -5.2, 0.2], [1.1, 2.4, 1.1], [0, 0, PI / 2]); add(g, G.cone, MAT.dark, [1.9, -5.2, 0.2], [1.0, 1.2, 1.0], XP);
    for (let i = 0; i < 7; i++) add(g, G.box, i % 3 ? MAT.gA : MAT.gT, [1.2 + (i % 4) * 0.9, -1 + ((i * 5) % 7) * 0.45, 0.72], [0.3, 0.08, 0.02]); return g; },
  // vapour made solid: a slow ring of glass shards around the eye
  veil() { const g = grp(), s = grp(); g.add(s); g.userData.spin = s; ring(s, 11, 2.2, (a, x, y, i) => add(s, G.oct, MAT.glassV, [x * (0.8 + (i % 3) * 0.14), y * (0.8 + (i % 3) * 0.14), ((i * 5) % 3 - 1) * 0.5], [0.16 + (i % 2) * 0.08, 0.7 + (i % 3) * 0.25, 0.16], [0, 0, a - PI / 2]));
    const t = grp(); g.add(t); g.userData.spin2 = t; ring(t, 6, 1.5, (a, x, y) => add(t, G.cone, MAT.glass, [x, y, 0], [0.09, 1.4, 0.09], [0, 0, a - PI / 2])); add(g, G.sph, MAT.glass, [0, 0, -0.4], 1.7); return g; },
  // the hauler's reactor housing: containment ring, struts and coolant lines
  reactor() { const g = grp(); add(g, G.cyl, MAT.dark, [0.6, 0, -1.6], [4.9, 1.8, 4.9], [PI / 2, 0, 0]); add(g, G.torF, MAT.brass, [0, 0, -0.6], 4.5); add(g, G.tor, MAT.gA, [0, 0, -0.3], 4.05); add(g, G.torF, MAT.hull, [0, 0, -1.2], 5.2);
    ring(g, 8, 4.9, (a, x, y) => { add(g, G.box, MAT.hull, [x, y, -0.9], [1.4, 0.36, 0.5], [0, 0, a]); add(g, G.sph, MAT.brass, [x * 0.92, y * 0.92, -0.4], 0.16); });
    for (const y of [-3.2, 3.2]) add(g, G.cyl, MAT.rust, [5.5, y, -1], [0.34, 6, 0.34], [0, 0, PI / 2]); add(g, G.box, MAT.rust, [6.6, 0, -1.4], [3.2, 9.5, 1.8]); return g; },
  // a wall of plant machinery with three bays
  regulator() { const g = grp(); add(g, G.box, MAT.hull, [4.2, 0, -1], [5.6, 16.5, 2.4]); add(g, G.box, MAT.dark, [1.5, 0, -0.2], [0.5, 16.5, 1.2]);
    for (const y of [-4.6, 0, 4.6]) { for (const s of [1, -1]) { add(g, G.box, MAT.brass, [-0.6, y + s * 2.25, 0.2], [3.6, 0.16, 1.4]); } add(g, G.cyl, MAT.dark, [3.2, y, 0.4], [0.9, 0.5, 0.9], [PI / 2, 0, 0]); add(g, G.sph, MAT.gT, [3.2, y, 0.68], [0.6, 0.6, 0.05]); add(g, G.box, MAT.gA, [2.0, y + 1.6, 0.42], [0.5, 0.07, 0.02]); }
    for (const x of [4.6, 5.6, 6.4]) add(g, G.cyl, MAT.rust, [x, 0, 0.4], [0.22, 16.5, 0.22]); for (const y of [-7, 7]) add(g, G.cyl, MAT.brass, [2.6, y, 0.3], [0.6, 1.4, 0.6]); return g; },
  // a crystal flower: petals that breathe around the heart
  bloomheart() { const g = grp(), s = grp(); g.add(s); g.userData.petals = []; ring(s, 9, 2.7, (a, x, y, i) => { const p = add(s, G.oct, MAT.glassV, [x, y, -0.5 - (i % 2) * 0.4], [0.5, 2.2 + (i % 3) * 0.4, 0.34], [0, 0, a - PI / 2]); p.userData.a = a; g.userData.petals.push(p); });
    ring(g, 6, 1.5, (a, x, y) => add(g, G.oct, MAT.glassA, [x, y, -0.2], [0.2, 0.9, 0.2], [0, 0, a - PI / 2])); add(g, G.cone, MAT.dark, [3.4, 0, -1], [0.8, 4.6, 0.8], XP); add(g, G.cone, MAT.dark, [3.2, 1.6, -1.2], [0.4, 3.6, 0.4], [0, 0, -1.2]); add(g, G.cone, MAT.dark, [3.2, -1.6, -1.2], [0.4, 3.6, 0.4], [0, 0, -1.94]); return g; },
  // a casting machine: crucible, chimney, chains and mould arms
  caster() { const g = grp(); add(g, G.half, MAT.rust, [4.2, -1.4, -1.2], [3.8, 3.8, 3.2], [PI, 0, 0]); add(g, G.sph, MAT.gA, [4.2, -1.3, -1.2], [3.5, 0.24, 2.9]); add(g, G.tor, MAT.brass, [4.2, -1.3, -1.2], 3.75, [PI / 2, 0, 0]);
    add(g, G.cyl, MAT.dark, [5.4, 5, -1.4], [1.1, 7, 1.1]); add(g, G.tor, MAT.brass, [5.4, 4, -1.4], 1.15, [PI / 2, 0, 0]); add(g, G.tor, MAT.brass, [5.4, 6.5, -1.4], 1.15, [PI / 2, 0, 0]);
    for (const [x, y, r] of [[-1.6, 3.4, 0.5], [-2.6, 0, 0], [-1.6, -3.4, -0.5]]) { add(g, G.box, MAT.hull, [x + 1.4, y * 0.75, -0.6], [3.4, 0.4, 0.5], [0, 0, r]); add(g, G.sph, MAT.brass, [x + 3, y * 0.5, -0.5], 0.3); }
    for (const x of [2.2, 3.4, 6.2]) add(g, G.cyl, MAT.dark, [x, 5.4, -0.8], [0.04, 7, 0.04]); add(g, G.box, MAT.hull, [1.6, 0, -0.9], [1.2, 5.2, 1]); return g; },
  // a long hunter: fins and a spine, turned with the body
  hunter() { const g = grp(); g.userData.rot = 1; for (let i = 0; i < 6; i++) { add(g, G.sph, MAT.dark, [-0.2 + i * 0.62, 0, 0], [0.5, 0.74 - i * 0.08, 0.6 - i * 0.05]); add(g, G.cone, MAT.rust, [-0.2 + i * 0.62, 0.8 - i * 0.07, 0], [0.09, 0.6, 0.09]); }
    add(g, G.box, MAT.rust, [0.8, 1.2, 0], [1.6, 1.3, 0.05], [0, 0, 0.6]); for (const s of [1, -1]) { add(g, G.box, MAT.rust, [0.4, -0.3, s * 0.8], [1.3, 0.05, 1.0], [0, s * 0.5, 0.2]); add(g, G.box, MAT.dark, [3.9, 0, s * 0.5], [1.2, 0.06, 1.0], [0, -s * 0.6, 0]); } add(g, G.cone, MAT.dark, [3.4, 0, 0], [0.36, 1.4, 0.4], XP);
    for (let i = 0; i < 5; i++) add(g, G.sph, MAT.gT, [0.2 + i * 0.6, -0.2, 0.52 - i * 0.04], 0.05); return g; },
  // the storm front: brows of dark rock around each eye, and rods that draw the lightning
  front() { const g = grp(); add(g, G.box, MAT.dark, [3.4, 0, -1], [6, 20, 2.4]); for (const y of [-5, 0, 5]) { add(g, G.torF, MAT.dark, [-1.4, y, -0.2], 1.9, [0, PI / 2 - 0.5, 0]); for (const s of [1, -1]) { add(g, G.cone, MAT.rust, [-1.9, y + s * 1.9, 0], [0.3, 1.5, 0.3], [0, 0, PI / 2 + s * 0.5]); add(g, G.ico1, MAT.dark, [0.2, y + s * 2.4, -0.2], [1.6, 1.0, 1.3]); } add(g, G.cone, MAT.brass, [-2.6, y + 2.45, 0.3], [0.05, 1.3, 0.05], XM); add(g, G.sph, MAT.gA, [-3.25, y + 2.45, 0.3], 0.07); } return g; },
  // the Eye of the Storm: three gyroscope rings around the core
  core() { const g = grp(); g.userData.rings = [add(g, G.torF, MAT.brass, [0, 0, -0.4], 4.7), add(g, G.torF, MAT.hull, [0, 0, -0.4], 5.4), add(g, G.tor, MAT.gV, [0, 0, -0.4], 6.1)];
    const s = grp(); g.add(s); g.userData.spin = s; ring(s, 8, 6.6, (a, x, y) => { add(s, G.box, MAT.dark, [x, y, -1.2], [2.6, 0.4, 0.6], [0, 0, a]); add(s, G.oct, MAT.glassV, [x * 1.16, y * 1.16, -1], [0.3, 1.2, 0.3], [0, 0, a - PI / 2]); }); add(g, G.sph, MAT.glass, [0, 0, -1.4], 3.2); return g; },
};

// the thing behind you in the Throat: jaws, teeth and a lit gullet
// Moving parts and running lights for the machine bosses: turning radar dishes, a rocking antenna array, blinking
// lamps along the top and bottom, and exhaust stacks at the back that the renderer makes steam from.
export const MECH_BOSS = { sleeper: 1, reactor: 1, regulator: 1, caster: 1, front: 1 };
export function dressBoss(g) {
  const bb = new THREE.Box3().setFromObject(g), cx = (bb.min.x + bb.max.x) / 2, w = bb.max.x - bb.min.x, top = bb.max.y, bot = bb.min.y, zf = Math.min(1.2, bb.max.z) + 0.05, anim = [], vents = [];
  for (const [k, q] of [[0.3, 1], [0.72, -1]]) { const d = grp(); d.position.set(bb.min.x + w * k, top + 0.5, 0.2); add(d, G.cyl, MAT.dark, [0, -0.3, 0], [0.07, 0.6, 0.07]); add(d, G.half, MAT.hull, [0, 0.12, 0.1], [0.62, 0.3, 0.62], [1.2, 0, 0]); add(d, G.cyl, MAT.brass, [0, 0.16, 0.36], [0.03, 0.5, 0.03], [1.2, 0, 0]); add(d, G.sph, MAT.gR, [0, 0.3, 0.6], 0.05); g.add(d); anim.push({ o: d, ax: 'y', sp: 0.9 * q, ph: k * 5 }); }
  const arr = grp(); arr.position.set(cx, bot - 0.3, 0.3); for (let i = -2; i <= 2; i++) { add(arr, G.cyl, MAT.dark, [i * 0.4, -0.4 - Math.abs(i) * 0.1, 0], [0.025, 0.9 - Math.abs(i) * 0.2, 0.025]); add(arr, G.sph, i % 2 ? MAT.gA : MAT.gT, [i * 0.4, -0.9 + Math.abs(i) * 0.02, 0], 0.045); } add(arr, G.box, MAT.brass, [0, 0, 0], [2, 0.08, 0.2]); g.add(arr); anim.push({ o: arr, ax: 'z', sp: 0.7, swing: 0.12, base: 0, ph: 1 });
  for (let i = 0; i < 7; i++) { const top2 = i % 2 === 0, m = add(g, G.sph, top2 ? MAT.gR : MAT.gA, [bb.min.x + w * (0.12 + i * 0.12), top2 ? top + 0.08 : bot - 0.08, zf * 0.6], 0.07); anim.push({ o: m, blink: 1, sp: 3 + (i % 3), ph: i * 1.7 }); }
  for (let i = 0; i < 3; i++) { const vx = bb.max.x - 0.5 - i * 0.9; add(g, G.cyl, MAT.dark, [vx, top + 0.2, -0.2], [0.2, 0.9, 0.2]); add(g, G.tor, MAT.brass, [vx, top + 0.6, -0.2], [0.22, 0.22, 0.3], [PI / 2, 0, 0]); vents.push([vx, top + 0.7]); }
  for (let i = 0; i < 5; i++) { const y = bot + (top - bot) * (0.15 + i * 0.17); add(g, G.cyl, MAT.brass, [cx + w * 0.1, y, zf * 0.7], [0.05, w * 0.7, 0.05], [0, 0, PI / 2]); add(g, G.tor, MAT.dark, [cx - w * 0.2 + (i % 3) * w * 0.2, y, zf * 0.7], [0.1, 0.1, 0.3], [0, PI / 2, 0]); }
  g.userData.anim = anim; g.userData.vents = vents;
}

export function makePursuer() {
  const g = grp(), up = grp(), dn = grp(); g.add(up, dn); g.userData.up = up; g.userData.dn = dn;
  for (const [j, s] of [[up, 1], [dn, -1]]) { add(j, G.ico1, MAT.rust, [-3.2, s * 5.2, 0], [5.2, 4.6, 3]); add(j, G.box, MAT.gR, [-0.5, s * 1.56, 0], [1.9, 0.09, 2.7]); add(j, G.box, MAT.rust, [-0.6, s * 2.2, 0], [2.6, 1.3, 2.6], [0, 0, s * 0.25]); for (let i = 0; i < 7; i++) add(j, G.cone, MAT.white, [0.3 - i * 0.14, s * (1.5 - i * 0.02), (i - 3) * 0.36], [0.24, 2.0 - Math.abs(i - 3) * 0.2, 0.24], [s > 0 ? PI : 0, 0, 0]); add(j, G.sph, MAT.gA, [-0.2, s * 3.4, 1.4], [0.6, 0.34, 0.3]); add(j, G.sph, MAT.gA, [-0.2, s * 3.4, -1.4], [0.6, 0.34, 0.3]); for (let i = 0; i < 4; i++) add(j, G.cone, MAT.rust, [-1.4 - i * 0.7, s * (6.2 + i * 0.3), 0], [0.3, 1.6, 0.3], [0, 0, s > 0 ? 0.5 : PI - 0.5]); }
  add(g, G.sph, MAT.gR, [-2.6, 0, 0], [1.2, 2.6, 1.6]); add(g, G.sph, MAT.gA, [-1.9, 0, 0], [0.5, 1.6, 1]);
  return g;
}
