// UNDERSTORM 2026 — every model is built from primitives at load. No external art.
import * as THREE from '../vendor/three.module.min.js';

const C = (hex, m = 1) => new THREE.Color(hex).multiplyScalar(m);
const std = (color, metalness, roughness, o = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...o });
const glow = (hex, m) => new THREE.MeshBasicMaterial({ color: C(hex, m) });
export const MAT = {
  hull: std(0x9aa3ad, 0.8, 0.36), white: std(0xe9eef3, 0.35, 0.32), dark: std(0x20242b, 0.65, 0.5), rust: std(0x7d4c33, 0.55, 0.7), brass: std(0xb98a3c, 0.9, 0.35),
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
  const g = grp(), body = grp(); g.add(body); g.userData.body = body; const H1 = enemy ? MAT.dark : MAT.white, H2 = enemy ? MAT.rust : MAT.hull, GL = enemy ? MAT.gR : MAT.gT, DK = MAT.dark;
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
