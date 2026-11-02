// Infantry body: one procedurally sculpted, smoothly skinned soldier (lofted
// torso and limbs, M1-style helmet, webbing, pack, rifle, rocket tube) drawn
// for every soldier with a single instanced draw. Each soldier's 19 bone
// matrices live in one row of a float texture that the vertex shader reads
// by slot, so the whole squad is GPU-skinned in one call (plus one shadow
// call). SoldierRig turns joint angles, a rifle placement and two-bone arm
// IK into those matrices, and plants the lowest contact point on the ground.

import * as THREE from 'three';

export const B = {
  pelvis: 0, spine: 1, chest: 2, neck: 3, head: 4,
  lUpper: 5, lFore: 6, lHand: 7, rUpper: 8, rFore: 9, rHand: 10,
  lThigh: 11, lShin: 12, lFoot: 13, rThigh: 14, rShin: 15, rFoot: 16,
  rifle: 17, tube: 18,
};
export const BONE_COUNT = 19;
// bind pose: standing, arms hanging, facing +Z (the soldier's left is +X)
const J = [
  [0, 0.97, 0], [0, 1.08, 0], [0, 1.27, 0], [0, 1.485, 0], [0, 1.555, 0.01],
  [0.185, 1.425, -0.01], [0.2, 1.14, -0.025], [0.205, 0.885, 0],
  [-0.185, 1.425, -0.01], [-0.2, 1.14, -0.025], [-0.205, 0.885, 0],
  [0.095, 0.925, 0], [0.1, 0.5, 0.005], [0.1, 0.088, -0.02],
  [-0.095, 0.925, 0], [-0.1, 0.5, 0.005], [-0.1, 0.088, -0.02],
  [0, 0, 0], [0, 0, 0],
].map(a => new THREE.Vector3(...a));
const PARENT = [-1, 0, 1, 2, 3, 2, 5, 6, 2, 8, 9, 0, 11, 12, 0, 14, 15, -1, -1];
// FK-driven bones, in the order of a pose's angle array
export const FK = [B.pelvis, B.spine, B.chest, B.neck, B.head, B.lThigh, B.lShin, B.lFoot, B.rThigh, B.rShin, B.rFoot,
  B.lUpper, B.lFore, B.rUpper, B.rFore];
export const ANG = FK.length * 3;

// rifle frame: right hand on the pistol grip at the origin, muzzle toward +Z
export const RIFLE_GRIP = new THREE.Vector3(0, -0.035, 0.0);
export const RIFLE_GUARD = new THREE.Vector3(0, -0.03, 0.31);
export const RIFLE_MUZZLE = new THREE.Vector3(0, 0.035, 0.74);
export const TUBE_GUARD = new THREE.Vector3(0, -0.02, 0.3);
export const TUBE_MUZZLE = new THREE.Vector3(0, 0.07, 0.8);
export const TUBE_REAR = new THREE.Vector3(0, 0.07, -0.62);

// ---------------------------------------------------------------- geometry
const MAT = { cloth: 0, skin: 1, boot: 2, helmet: 3, gear: 4, metal: 5, wood: 6, paint: 7 };
const COL = {
  cloth: 0x5d6448, trousers: 0x575d43, skin: 0xa07a62, boot: 0x2a231c, helmet: 0x4b5239,
  gear: 0x6c6649, pack: 0x5a5a40, metal: 0x2b2b2a, wood: 0x5b3b22, paint: 0x404b34,
};

class Builder {
  constructor() { this.pos = []; this.nor = []; this.col = []; this.bones = []; this.w = []; this.mat = []; this.idx = []; this.n = 0; }

  // append a geometry; weight(p) returns the share of bone a (rest goes to b)
  add(geo, color, mat, a, b = a, weight = null) {
    const g = geo.index ? geo : geo;
    if (!g.attributes.normal) g.computeVertexNormals();
    const P = g.attributes.position, N = g.attributes.normal, c = new THREE.Color(color);
    const p = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) {
      p.fromBufferAttribute(P, i);
      this.pos.push(p.x, p.y, p.z);
      this.nor.push(N.getX(i), N.getY(i), N.getZ(i));
      this.col.push(c.r, c.g, c.b);
      this.bones.push(a, b);
      this.w.push(weight ? THREE.MathUtils.clamp(weight(p), 0, 1) : 1);
      this.mat.push(mat);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) this.idx.push(g.index.getX(i) + this.n);
    else for (let i = 0; i < P.count; i++) this.idx.push(i + this.n);
    this.n += P.count;
    geo.dispose();
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('aBones', new THREE.Float32BufferAttribute(this.bones, 2));
    g.setAttribute('aW', new THREE.Float32BufferAttribute(this.w, 1));
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.mat, 1));
    g.setIndex(this.idx);
    return g;
  }
}

// Lofted surface through superelliptic rings stacked along Y. rings:
// [y, rx, rz, cx, cz]; ends are closed with a pole vertex.
function loft(rings, seg, ex = 2.4) {
  const pos = [], idx = [];
  const e = 2 / ex;
  for (const [y, rx, rz, cx = 0, cz = 0] of rings) {
    for (let s = 0; s <= seg; s++) {
      const a = (s / seg) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      pos.push(cx + rx * Math.sign(c) * Math.abs(c) ** e, y, cz + rz * Math.sign(sn) * Math.abs(sn) ** e);
    }
  }
  const R = rings.length, row = seg + 1;
  for (let r = 0; r < R - 1; r++) for (let s = 0; s < seg; s++) {
    const a = r * row + s, b = a + row;
    // rings run top to bottom or bottom to top; winding fixed below
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const top = pos.length / 3; pos.push(rings[0][3] ?? 0, rings[0][0] + (rings[0][0] > rings[R - 1][0] ? 0.012 : -0.012), rings[0][4] ?? 0);
  const bot = pos.length / 3; const L = rings[R - 1]; pos.push(L[3] ?? 0, L[0] + (rings[0][0] > L[0] ? -0.012 : 0.012), L[4] ?? 0);
  for (let s = 0; s < seg; s++) { idx.push(top, s + 1, s); idx.push(bot, (R - 1) * row + s, (R - 1) * row + s + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  // descending rings (top first) need the opposite winding to face outward
  if (rings[0][0] > rings[R - 1][0]) { for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } }
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const box = (w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) => {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx || ry || rz) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  g.translate(x, y, z);
  return g;
};
const cyl = (r0, r1, len, seg, x, y, z, rx = Math.PI / 2, ry = 0, rz = 0) => {
  const g = new THREE.CylinderGeometry(r0, r1, len, seg);
  g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  g.translate(x, y, z);
  return g;
};
const ell = (rx, ry, rz, x, y, z, ws = 10, hs = 7) => {
  const g = new THREE.SphereGeometry(1, ws, hs);
  g.scale(rx, ry, rz);
  g.translate(x, y, z);
  return g;
};
// smooth blend weight from 1 (below lo) to 0 (above hi) along y
const band = (lo, hi) => (p) => 1 - THREE.MathUtils.smoothstep(p.y, lo, hi);

function buildSoldier(hi) {
  const b = new Builder();
  const seg = hi ? 14 : 7, lseg = hi ? 10 : 6;

  // torso: hips -> waist -> chest -> shoulders, jacket over trousers
  b.add(loft([
    [0.8, 0.09, 0.075], [0.85, 0.155, 0.105], [0.92, 0.172, 0.118], [0.99, 0.163, 0.113, 0, -0.004],
    [1.07, 0.152, 0.108], [1.16, 0.164, 0.118, 0, 0.006], [1.26, 0.182, 0.128, 0, 0.012],
    [1.35, 0.193, 0.124, 0, 0.006], [1.41, 0.19, 0.11], [1.455, 0.15, 0.09], [1.49, 0.075, 0.062, 0, -0.005],
  ], seg, 2.6), COL.cloth, MAT.cloth, B.pelvis, B.spine, (p) => p.y < 1.0 ? 1 : 1 - THREE.MathUtils.smoothstep(p.y, 1.0, 1.12));
  // re-weight the upper torso onto the chest: second pass overrides via a
  // cheap trick — the chest shell is a slightly larger loft from the waist up
  b.add(loft([
    [1.1, 0.158, 0.112], [1.16, 0.167, 0.121, 0, 0.006], [1.26, 0.185, 0.131, 0, 0.012],
    [1.35, 0.196, 0.127, 0, 0.006], [1.41, 0.193, 0.113], [1.455, 0.152, 0.092], [1.495, 0.077, 0.064, 0, -0.005],
  ], seg, 2.6), COL.cloth, MAT.cloth, B.spine, B.chest, (p) => 1 - THREE.MathUtils.smoothstep(p.y, 1.12, 1.24));
  // neck and collar
  b.add(loft([[1.43, 0.058, 0.055, 0, -0.005], [1.5, 0.053, 0.052, 0, 0.0], [1.59, 0.05, 0.05, 0, 0.012]], lseg, 2),
    COL.skin, MAT.skin, B.chest, B.neck, band(1.46, 1.52));
  b.add(loft([[1.455, 0.088, 0.074, 0, -0.008], [1.505, 0.07, 0.066, 0, -0.006]], seg, 2.2), COL.cloth, MAT.cloth, B.chest);
  // head: skull, jaw, nose, ears
  {
    const g = ell(0.088, 0.112, 0.1, 0, 1.655, 0.012, hi ? 14 : 8, hi ? 10 : 6);
    const P = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i);
      const dy = v.y - 1.655;
      if (dy < -0.03) { v.x *= 1 - (-0.03 - dy) * 2.2; v.z += (-0.03 - dy) * 0.25; }        // narrower jaw, chin forward
      const nose = Math.exp(-((v.x / 0.022) ** 2 + ((dy + 0.012) / 0.03) ** 2)) * (v.z > 0.06 ? 1 : 0);
      v.z += nose * 0.025;
      if (dy > 0.0 && dy < 0.03 && v.z > 0.07) v.z -= 0.008 * Math.exp(-(((Math.abs(v.x) - 0.035) / 0.018) ** 2)); // eye sockets
      P.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    b.add(g, COL.skin, MAT.skin, B.head);
    if (hi) for (const s of [1, -1]) b.add(ell(0.014, 0.03, 0.02, s * 0.088, 1.65, 0.0, 6, 5), COL.skin, MAT.skin, B.head);
  }
  // M1-style steel helmet: lathe profile with a flared brim and a chin strap
  {
    const prof = [[0, 0.142], [0.05, 0.138], [0.088, 0.122], [0.115, 0.095], [0.13, 0.06], [0.138, 0.025], [0.142, 0.0],
      [0.158, -0.022], [0.163, -0.03], [0.15, -0.026], [0.135, -0.012]].map(([r, y]) => new THREE.Vector2(r, y)).reverse();
    const g = new THREE.LatheGeometry(prof, hi ? 16 : 9);
    g.scale(0.97, 0.92, 1.1);
    g.translate(0, 1.672, 0.004);
    b.add(g, COL.helmet, MAT.helmet, B.head);
    if (hi) b.add(loft([[1.68, 0.098, 0.03, 0, 0.0], [1.6, 0.09, 0.03, 0, 0.03], [1.55, 0.06, 0.035, 0, 0.06]], 8, 2), COL.gear, MAT.gear, B.head);
  }
  // arms (sleeves) with hands
  for (const s of [1, -1]) {
    const up = s > 0 ? B.lUpper : B.rUpper, fo = s > 0 ? B.lFore : B.rFore, ha = s > 0 ? B.lHand : B.rHand;
    const x = s * 0.185;
    b.add(loft([[1.47, 0.062, 0.064, x, -0.012], [1.4, 0.06, 0.062, s * 0.19, -0.012], [1.28, 0.052, 0.054, s * 0.195, -0.018],
      [1.16, 0.047, 0.05, s * 0.2, -0.024], [1.11, 0.046, 0.049, s * 0.2, -0.024]], lseg, 2.1),
    COL.cloth, MAT.cloth, up, fo, band(1.12, 1.19));
    b.add(loft([[1.17, 0.047, 0.05, s * 0.2, -0.024], [1.07, 0.046, 0.047, s * 0.202, -0.018], [0.95, 0.037, 0.04, s * 0.205, -0.006],
      [0.91, 0.04, 0.043, s * 0.205, -0.003]], lseg, 2.1), COL.cloth, MAT.cloth, fo, ha, band(0.88, 0.89));
    b.add(ell(0.032, 0.062, 0.044, s * 0.206, 0.835, 0.004, hi ? 8 : 5, hi ? 6 : 4), COL.skin, MAT.skin, ha);
    if (hi) b.add(ell(0.014, 0.03, 0.016, s * 0.19, 0.85, 0.035, 5, 4), COL.skin, MAT.skin, ha);   // thumb
  }
  // legs (trousers bloused into boots) and boots
  for (const s of [1, -1]) {
    const th = s > 0 ? B.lThigh : B.rThigh, sh = s > 0 ? B.lShin : B.rShin, ft = s > 0 ? B.lFoot : B.rFoot;
    b.add(loft([[0.99, 0.088, 0.096, s * 0.088, 0.0], [0.88, 0.087, 0.092, s * 0.096, 0.004], [0.72, 0.074, 0.08, s * 0.098, 0.006],
      [0.56, 0.06, 0.066, s * 0.1, 0.008], [0.48, 0.057, 0.064, s * 0.1, 0.008]], lseg, 2.2),
    COL.trousers, MAT.cloth, th, sh, (p) => THREE.MathUtils.smoothstep(p.y, 0.47, 0.56));
    b.add(loft([[0.53, 0.06, 0.066, s * 0.1, 0.008], [0.42, 0.063, 0.07, s * 0.1, -0.006], [0.32, 0.055, 0.061, s * 0.1, -0.01],
      [0.24, 0.057, 0.063, s * 0.1, -0.01]], lseg, 2.2), COL.trousers, MAT.cloth, sh);
    b.add(loft([[0.25, 0.048, 0.054, s * 0.1, -0.012], [0.15, 0.047, 0.055, s * 0.1, -0.016], [0.1, 0.05, 0.06, s * 0.1, -0.016]], lseg, 2.3),
      COL.boot, MAT.boot, sh, ft, (p) => THREE.MathUtils.smoothstep(p.y, 0.1, 0.16));
    // foot: rounded sole block, toe forward
    b.add(loft([[0.11, 0.048, 0.1, s * 0.1, 0.025], [0.06, 0.05, 0.125, s * 0.1, 0.035], [0.012, 0.049, 0.13, s * 0.1, 0.035],
      [0.0, 0.045, 0.12, s * 0.1, 0.035]], seg, 2.6), COL.boot, MAT.boot, ft);
  }
  // webbing: belt, ammo pouches, Y-harness straps, canteen, field pack, bedroll
  b.add(loft([[1.065, 0.166, 0.122], [1.015, 0.172, 0.126]], seg, 2.6), COL.gear, MAT.gear, B.pelvis, B.spine, () => 0.5);
  for (const x of [0.07, 0.14, -0.07, -0.14]) {
    const g = box(0.06, 0.07, 0.04, x, 1.03, 0.12 - Math.abs(x) * 0.18, 0, x * 1.6, 0);
    b.add(g, COL.gear, MAT.gear, B.pelvis, B.spine, () => 0.5);
  }
  if (hi) {
    for (const s of [1, -1]) {
      b.add(box(0.035, 0.36, 0.012, s * 0.1, 1.25, 0.131, -0.08, 0, s * 0.18), COL.gear, MAT.gear, B.chest, B.spine, (p) => THREE.MathUtils.smoothstep(p.y, 1.08, 1.2));
      b.add(box(0.035, 0.34, 0.012, s * 0.095, 1.25, -0.128, 0.08, 0, -s * 0.12), COL.gear, MAT.gear, B.chest, B.spine, (p) => THREE.MathUtils.smoothstep(p.y, 1.08, 1.2));
    }
    b.add(cyl(0.042, 0.042, 0.13, 8, -0.15, 0.97, -0.08, 0), COL.gear, MAT.gear, B.pelvis);
    b.add(box(0.12, 0.13, 0.03, 0.0, 1.0, -0.13), COL.gear, MAT.gear, B.pelvis);
  }
  {
    const g = loft([[1.4, 0.13, 0.06, 0, -0.19], [1.32, 0.15, 0.075, 0, -0.205], [1.18, 0.15, 0.078, 0, -0.205], [1.1, 0.13, 0.06, 0, -0.19]], seg, 3.5);
    b.add(g, COL.pack, MAT.gear, B.chest);
    b.add(cyl(0.052, 0.052, 0.34, hi ? 10 : 6, 0, 1.445, -0.17, 0, 0, Math.PI / 2), COL.gear, MAT.gear, B.chest);
  }
  // rifle (bone 17), built in its own frame
  {
    const R = B.rifle, gs = hi ? 8 : 5;
    b.add(box(0.04, 0.085, 0.27, 0, -0.03, -0.21, 0.06, 0, 0), COL.wood, MAT.wood, R);                    // stock
    b.add(box(0.045, 0.06, 0.06, 0, -0.06, -0.345), COL.wood, MAT.wood, R);                               // butt
    b.add(box(0.045, 0.075, 0.3, 0, 0.02, 0.07), COL.metal, MAT.metal, R);                                // receiver
    b.add(box(0.032, 0.09, 0.045, 0, -0.045, 0.0, -0.35, 0, 0), COL.wood, MAT.wood, R);                   // pistol grip
    b.add(box(0.028, 0.15, 0.06, 0, -0.07, 0.12, 0.28, 0, 0), COL.metal, MAT.metal, R);                   // magazine
    b.add(box(0.05, 0.055, 0.26, 0, 0.012, 0.33), COL.wood, MAT.wood, R);                                 // handguard
    b.add(cyl(0.011, 0.011, 0.3, gs, 0, 0.03, 0.6), COL.metal, MAT.metal, R);                             // barrel
    b.add(cyl(0.016, 0.016, 0.05, gs, 0, 0.03, 0.73), COL.metal, MAT.metal, R);                           // muzzle
    b.add(box(0.008, 0.05, 0.012, 0, 0.065, 0.66), COL.metal, MAT.metal, R);                              // front sight
    if (hi) b.add(box(0.02, 0.03, 0.06, 0, 0.07, 0.04), COL.metal, MAT.metal, R);                         // rear sight
  }
  // anti-tank launcher (bone 18): tube, warhead, grips, flared venturi
  {
    const T = B.tube, ts = hi ? 12 : 6;
    b.add(cyl(0.045, 0.045, 1.05, ts, 0, 0.07, -0.08), COL.paint, MAT.paint, T);
    b.add(cyl(0.062, 0.045, 0.14, ts, 0, 0.07, -0.64), COL.paint, MAT.paint, T);
    b.add(cyl(0.07, 0.07, 0.14, ts, 0, 0.07, 0.53), COL.paint, MAT.paint, T);
    b.add(cyl(0.0, 0.07, 0.2, ts, 0, 0.07, 0.7), COL.paint, MAT.paint, T);
    b.add(box(0.03, 0.09, 0.04, 0, -0.03, 0.0, -0.25, 0, 0), COL.metal, MAT.metal, T);
    b.add(box(0.03, 0.07, 0.04, 0, -0.02, 0.3, -0.15, 0, 0), COL.metal, MAT.metal, T);
    b.add(box(0.025, 0.05, 0.1, -0.06, 0.12, 0.1), COL.metal, MAT.metal, T);
  }
  return b.build();
}

// ---------------------------------------------------------------- shading
const VERT_PARS = /* glsl */`
attribute vec2 aBones; attribute float aW; attribute float aMat;
attribute float aSlot; attribute vec4 aInst;
uniform highp sampler2D uPose;
varying float vMat; varying vec3 vObj; varying vec4 vInst;
mat4 poseBone(float bf){
  int s=int(aSlot+.5), x=int(bf+.5)*3;
  vec4 r0=texelFetch(uPose,ivec2(x,s),0), r1=texelFetch(uPose,ivec2(x+1,s),0), r2=texelFetch(uPose,ivec2(x+2,s),0);
  return mat4(r0.x,r1.x,r2.x,0., r0.y,r1.y,r2.y,0., r0.z,r1.z,r2.z,0., r0.w,r1.w,r2.w,1.);
}`;
const SKIN_BASE = /* glsl */`
  mat4 skM=poseBone(aBones.x)*aW+poseBone(aBones.y)*(1.-aW);
  vMat=aMat; vObj=position; vInst=aInst;`;

function installSkinning(mat, uPose, withFragment) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uPose = uPose;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + VERT_PARS)
      .replace('#include <skinbase_vertex>', SKIN_BASE)
      .replace('#include <skinnormal_vertex>', 'objectNormal=(skM*vec4(objectNormal,0.)).xyz;')
      .replace('#include <skinning_vertex>', 'transformed=(skM*vec4(transformed,1.)).xyz;');
    if (!withFragment) return;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vMat; varying vec3 vObj; varying vec4 vInst;
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb(vec3 p){return vn(p)*.65+vn(p*2.1+7.3)*.35;}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  float m=vMat;
  if(m<.5){
    // woodland camouflage: brown and dark-green blotches, black slashes, weave
    vec3 p=vObj*vec3(6.,4.4,6.)+vInst.x*37.;
    vec3 c=diffuseColor.rgb*(.9+vInst.y*.22);
    c=mix(c,c*vec3(.72,.6,.44),smoothstep(.56,.6,fb(p)));
    c=mix(c,c*vec3(.5,.62,.42),smoothstep(.6,.64,fb(p*1.3+11.)));
    c=mix(c,vec3(.035,.035,.03),smoothstep(.7,.73,fb(p*1.9-4.))*.8);
    c*=.93+vn(vObj*210.)*.12;
    diffuseColor.rgb=c;
  } else if(m<1.5){
    diffuseColor.rgb*=mix(vec3(1.06,1.,.95),vec3(.55,.43,.36),vInst.z);
    // face: shadow under the helmet brim, eyes, brows and mouth
    if(vObj.y>1.5){
      diffuseColor.rgb*=mix(1.,.5,smoothstep(1.665,1.72,vObj.y));
      float fx=abs(vObj.x);
      if(vObj.z>.07){
        float eye=(1.-smoothstep(.006,.012,abs(vObj.y-1.664)))*(1.-smoothstep(.01,.017,abs(fx-.032)));
        float brow=(1.-smoothstep(.003,.006,abs(vObj.y-1.68)))*(1.-smoothstep(.012,.02,abs(fx-.032)));
        float mouth=(1.-smoothstep(.002,.005,abs(vObj.y-1.592)))*(1.-smoothstep(.012,.02,fx));
        diffuseColor.rgb*=1.-.75*max(eye,max(brow*.8,mouth*.6));
      }
    }
  } else if(m>2.5&&m<3.5){
    // helmet cover: scrim netting over steel
    float n=vn(vObj*90.); float k=fb(vObj*14.+vInst.x*9.);
    diffuseColor.rgb*=(.78+.32*n)*mix(.85,1.12,k);
  } else if(m>3.5&&m<4.5){
    diffuseColor.rgb*=.9+vn(vObj*160.)*.18;
  }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor=vMat<.5?.93:vMat<1.5?.62:vMat<2.5?.66:vMat<3.5?.86:vMat<4.5?.96:vMat<5.5?.42:vMat<6.5?.6:.58;`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
  metalnessFactor=(vMat>4.5&&vMat<5.5)?.6:(vMat>6.5?.25:0.);`);
  };
  mat.customProgramCacheKey = () => 'soldier-skin-1' + (withFragment ? 'f' : 'd');
}

// ---------------------------------------------------------------- crowd
export class SoldierCrowd {
  constructor(scene, max) {
    this.max = max;
    const W = BONE_COUNT * 3;
    this.data = new Float32Array(W * max * 4);
    this.tex = new THREE.DataTexture(this.data, W, max, THREE.RGBAFormat, THREE.FloatType);
    this.tex.magFilter = this.tex.minFilter = THREE.NearestFilter;
    this.tex.needsUpdate = true;
    this.uPose = { value: this.tex };
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 });
    installSkinning(mat, this.uPose, true);
    const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    installSkinning(depth, this.uPose, false);
    this.meshes = [buildSoldier(true), buildSoldier(false)].map((geo) => {
      const slot = new THREE.InstancedBufferAttribute(new Float32Array(max), 1);
      const inst = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4);
      slot.setUsage(THREE.DynamicDrawUsage); inst.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aSlot', slot);
      geo.setAttribute('aInst', inst);
      const m = new THREE.InstancedMesh(geo, mat, max);
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.customDepthMaterial = depth;
      m.castShadow = true;
      m.receiveShadow = true;
      m.frustumCulled = false;
      m.count = 0;
      scene.add(m);
      return m;
    });
    this.fill = [0, 0];
  }

  begin() { this.fill[0] = this.fill[1] = 0; }

  // one collapsed instance per mesh until the first real frame, so the
  // skinning and shadow shaders compile during the title screen
  prewarm() {
    for (const m of this.meshes) { m.setMatrixAt(0, new THREE.Matrix4()); m.count = 1; }
  }

  // queue one soldier: lod 0 near, 1 far; root = world matrix; skins = 19 Matrix4
  push(lod, slot, root, skins, look) {
    const m = this.meshes[lod], i = this.fill[lod]++;
    m.setMatrixAt(i, root);
    m.geometry.attributes.aSlot.array[i] = slot;
    m.geometry.attributes.aInst.array.set(look, i * 4);
    const d = this.data, base = slot * BONE_COUNT * 12;
    for (let b = 0; b < BONE_COUNT; b++) {
      const e = skins[b].elements, k = base + b * 12;
      d[k] = e[0]; d[k + 1] = e[4]; d[k + 2] = e[8]; d[k + 3] = e[12];
      d[k + 4] = e[1]; d[k + 5] = e[5]; d[k + 6] = e[9]; d[k + 7] = e[13];
      d[k + 8] = e[2]; d[k + 9] = e[6]; d[k + 10] = e[10]; d[k + 11] = e[14];
    }
  }

  end() {
    for (let l = 0; l < 2; l++) {
      const m = this.meshes[l];
      m.count = this.fill[l];
      m.instanceMatrix.needsUpdate = true;
      m.geometry.attributes.aSlot.needsUpdate = true;
      m.geometry.attributes.aInst.needsUpdate = true;
    }
    this.tex.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- rig
const _m = new THREE.Matrix4(), _t = new THREE.Matrix4(), _e = new THREE.Euler();
const _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _w = new THREE.Vector3(), _u = new THREE.Vector3();
const _S = new THREE.Vector3(), _E = new THREE.Vector3(), _T = new THREE.Vector3(), _P = new THREE.Vector3();
const UPPER_LEN = J[5].distanceTo(J[6]), FORE_LEN = J[6].distanceTo(J[7]);
const ARM_DIR = new THREE.Vector3().subVectors(J[6], J[5]).normalize();
const FORE_DIR = new THREE.Vector3().subVectors(J[7], J[6]).normalize();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);

// lowest points of the body, as [bone, local offset] (contacts with the ground)
const CONTACTS = [
  [B.lFoot, new THREE.Vector3(0, -0.088, -0.07)], [B.lFoot, new THREE.Vector3(0, -0.088, 0.16)],
  [B.rFoot, new THREE.Vector3(0, -0.088, -0.07)], [B.rFoot, new THREE.Vector3(0, -0.088, 0.16)],
  [B.lShin, new THREE.Vector3(0, 0, 0.06)], [B.rShin, new THREE.Vector3(0, 0, 0.06)],
  [B.lThigh, new THREE.Vector3(0, -0.2, 0)], [B.rThigh, new THREE.Vector3(0, -0.2, 0)],
  [B.pelvis, new THREE.Vector3(0, -0.04, 0)], [B.spine, new THREE.Vector3(0, 0.05, 0.0)],
  [B.chest, new THREE.Vector3(0, 0.1, 0)], [B.head, new THREE.Vector3(0, 0.08, 0.02)],
];
const CONTACT_PAD = [0, 0, 0, 0, 0.06, 0.06, 0.09, 0.09, 0.13, 0.13, 0.14, 0.12];

export class SoldierRig {
  constructor() {
    this.W = Array.from({ length: BONE_COUNT }, () => new THREE.Matrix4());
    this.S = Array.from({ length: BONE_COUNT }, () => new THREE.Matrix4());
  }

  fk(i, parentW, ang, a) {
    _e.set(ang[a], ang[a + 1], ang[a + 2], 'YXZ');
    _m.makeRotationFromEuler(_e);
    const p = PARENT[i], o = _v.copy(J[i]);
    if (p >= 0) o.sub(J[p]);
    _t.makeTranslation(o.x, o.y, o.z);
    this.W[i].multiplyMatrices(parentW, _t).multiply(_m);
  }

  // shoulder s -> target t with elbow pulled toward pole; writes 3 bones
  ik(up, fore, hand, t, pole, handQ) {
    const W = this.W;
    _S.copy(J[up]).sub(J[B.chest]).applyMatrix4(W[B.chest]);
    _T.copy(t);
    let d = _S.distanceTo(_T);
    const maxD = UPPER_LEN + FORE_LEN - 0.002, minD = Math.abs(UPPER_LEN - FORE_LEN) + 0.02;
    _w.subVectors(_T, _S).normalize();
    if (d > maxD) { _T.copy(_S).addScaledVector(_w, maxD); d = maxD; }
    if (d < minD) { _T.copy(_S).addScaledVector(_w, minD); d = minD; }
    const a = (UPPER_LEN * UPPER_LEN - FORE_LEN * FORE_LEN + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, UPPER_LEN * UPPER_LEN - a * a));
    _u.copy(pole).addScaledVector(_w, -pole.dot(_w));
    if (_u.lengthSq() < 1e-6) _u.set(0, -1, 0);
    _u.normalize();
    _E.copy(_S).addScaledVector(_w, a).addScaledVector(_u, h);
    _P.subVectors(_E, _S).normalize();
    _q.setFromUnitVectors(ARM_DIR, _P);
    W[up].makeRotationFromQuaternion(_q).setPosition(_S);
    _P.subVectors(_T, _E).normalize();
    _q.setFromUnitVectors(FORE_DIR, _P);
    W[fore].makeRotationFromQuaternion(_q).setPosition(_E);
    if (handQ) W[hand].makeRotationFromQuaternion(handQ); else W[hand].makeRotationFromQuaternion(_q);
    W[hand].setPosition(_T);
  }

  // pose: { ang: Float32Array(ANG), off: Vector3 (pelvis offset), air,
  //   rifle: Matrix4 (model space) | null, tube: Matrix4 | null,
  //   armsIK: bool, lTarget, rTarget, lPole, rPole }
  // returns the ground shift that was applied (for callers that track it)
  solve(pose, lift = 0) {
    const W = this.W, A = pose.ang;
    _e.set(A[0], A[1], A[2], 'YXZ');
    W[0].makeRotationFromEuler(_e).setPosition(J[0].x + pose.off.x, J[0].y + pose.off.y, J[0].z + pose.off.z);
    this.fk(B.spine, W[B.pelvis], A, 3);
    this.fk(B.chest, W[B.spine], A, 6);
    this.fk(B.neck, W[B.chest], A, 9);
    this.fk(B.head, W[B.neck], A, 12);
    this.fk(B.lThigh, W[B.pelvis], A, 15);
    this.fk(B.lShin, W[B.lThigh], A, 18);
    this.fk(B.lFoot, W[B.lShin], A, 21);
    this.fk(B.rThigh, W[B.pelvis], A, 24);
    this.fk(B.rShin, W[B.rThigh], A, 27);
    this.fk(B.rFoot, W[B.rShin], A, 30);
    // plant the lowest contact on the ground (then add any airborne lift)
    let low = Infinity;
    for (let c = 0; c < CONTACTS.length; c++) {
      const [bi, off] = CONTACTS[c];
      _v.copy(off).applyMatrix4(W[bi]);
      const y = _v.y - CONTACT_PAD[c];
      if (y < low) low = y;
    }
    const shift = pose.ground === false ? lift : lift - low;
    pose.shift = pose.shift === undefined ? shift : pose.shift + (shift - pose.shift) * Math.min(1, pose.groundK ?? 1);
    for (let i = 0; i <= B.rFoot; i++) if (i < B.lUpper || i > B.rHand) W[i].elements[13] += pose.shift;
    // the caller places the weapon off the posed torso and sets hand targets
    if (pose.place) pose.place(this);
    // arms: two-bone IK onto the weapon, or free FK when the hands let go
    if (pose.armsIK) {
      this.ik(B.lUpper, B.lFore, B.lHand, pose.lTarget, pose.lPole, null);
      this.ik(B.rUpper, B.rFore, B.rHand, pose.rTarget, pose.rPole, null);
    } else {
      this.fk(B.lUpper, W[B.chest], A, 33);
      this.fk(B.lFore, W[B.lUpper], A, 36);
      _t.makeTranslation(J[7].x - J[6].x, J[7].y - J[6].y, J[7].z - J[6].z);
      W[B.lHand].multiplyMatrices(W[B.lFore], _t);
      this.fk(B.rUpper, W[B.chest], A, 39);
      this.fk(B.rFore, W[B.rUpper], A, 42);
      _t.makeTranslation(J[10].x - J[9].x, J[10].y - J[9].y, J[10].z - J[9].z);
      W[B.rHand].multiplyMatrices(W[B.rFore], _t);
    }
    // skin = world * inverse(bind translation)
    for (let i = 0; i <= B.rFoot; i++) {
      this.S[i].copy(W[i]);
      const e = this.S[i].elements, j = J[i];
      e[12] -= e[0] * j.x + e[4] * j.y + e[8] * j.z;
      e[13] -= e[1] * j.x + e[5] * j.y + e[9] * j.z;
      e[14] -= e[2] * j.x + e[6] * j.y + e[10] * j.z;
    }
    if (pose.rifle) this.S[B.rifle].copy(pose.rifle); else this.S[B.rifle].copy(_zero);
    if (pose.tube) this.S[B.tube].copy(pose.tube); else this.S[B.tube].copy(_zero);
    return pose.shift;
  }

  // world-space (model frame) position of a joint after solve()
  joint(i, out) { return out.setFromMatrixPosition(this.W[i]); }
}

export { J as JOINTS };
