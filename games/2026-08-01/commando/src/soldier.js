// soldier.js — rigid-skinned 3D soldiers. Each body part is a primitive bound
// 100% to one bone, all merged into a single SkinnedMesh (one draw call per
// soldier). Animation is procedural: run cycle driven by distance travelled,
// torso twist toward the aim, crouch, recoil, throw, death fall. Because the
// same model is rendered from any angle, frames can never disagree.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clamp, lerp } from './util.js';

// bone table: name, parent, rest offset from parent (model faces +Z; its left is +X)
const BONES = [
  ['root', null, [0, 0, 0]],
  ['hips', 'root', [0, 0.95, 0]],
  ['spine', 'hips', [0, 0.13, 0]],
  ['chest', 'spine', [0, 0.2, 0]],
  ['head', 'chest', [0, 0.23, 0]],
  ['armL', 'chest', [0.215, 0.15, 0]], ['foreL', 'armL', [0, -0.27, 0]],
  ['armR', 'chest', [-0.215, 0.15, 0]], ['foreR', 'armR', [0, -0.27, 0]],
  ['thighL', 'hips', [0.1, -0.04, 0]], ['shinL', 'thighL', [0, -0.43, 0]],
  ['thighR', 'hips', [-0.1, -0.04, 0]], ['shinR', 'thighR', [0, -0.43, 0]],
  ['gun', 'chest', [-0.1, -0.06, 0.2]],
];
const BI = Object.fromEntries(BONES.map((b, i) => [b[0], i]));

function restWorld() {
  const w = {};
  for (const [n, p, o] of BONES) {
    const base = p ? w[p] : [0, 0, 0];
    w[n] = [base[0] + o[0], base[1] + o[1], base[2] + o[2]];
  }
  return w;
}
const RW = restWorld();

// ------------------------------------------------------------------ looks
export const LOOKS = {
  joe: {
    skin: '#c98d60', top: '#556236', topBare: true, pants: '#5f6b40', pants2: '#4a5431', boots: '#2b2219',
    web: '#3b3423', hair: '#23170e', band: '#d02a1c', gun: '#1d1d1c', wood: '#5c3a21', rim: [0.22, 0.18, 0.1], scale: 1.14,
  },
  rifle: {
    skin: '#c59a74', top: '#566a80', pants: '#4b5d71', pants2: '#425266', boots: '#221c16',
    web: '#3f3a2c', helmet: '#3f4a3c', gun: '#232322', wood: '#5a3d26', rim: [0.34, 0.07, 0.03], pack: '#4c5040', scale: 1.08,
  },
  lobber: {
    skin: '#c59a74', top: '#52667a', pants: '#48596c', pants2: '#3f4f61', boots: '#221c16',
    web: '#3f3a2c', cap: '#5a4a32', gun: '#232322', wood: '#5a3d26', rim: [0.34, 0.07, 0.03], satchel: '#6b5a3a', scale: 1.08, noGun: true,
  },
  officer: {
    skin: '#caa07a', top: '#3e4b55', pants: '#36424b', pants2: '#303a42', boots: '#15110d',
    web: '#2a2620', peaked: '#37424c', band: '#9a1f18', gun: '#1b1b1b', wood: '#1b1b1b', rim: [0.38, 0.08, 0.03], scale: 1.1, pistol: true,
  },
  pow: {
    skin: '#c9946a', top: '#cdc6b0', topBare: false, pants: '#6f6650', pants2: '#655c47', boots: '#3a2e22',
    web: '#6f6650', hair: '#2a1e14', gun: '#000', wood: '#000', rim: [0.2, 0.3, 0.15], scale: 1.08, noGun: true, tied: true,
  },
};

const geoCache = {};

function part(list, geo, bone, color, o = {}) {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(o.x || 0, o.y || 0, o.z || 0),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(o.rx || 0, o.ry || 0, o.rz || 0)),
    new THREE.Vector3(o.sx ?? 1, o.sy ?? 1, o.sz ?? 1));
  geo.applyMatrix4(m);
  if (geo.index) geo = geo.toNonIndexed();
  for (const k of Object.keys(geo.attributes)) if (!['position', 'normal'].includes(k)) geo.deleteAttribute(k);
  const n = geo.attributes.position.count;
  const c = new THREE.Color(color);
  const col = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    si[i * 4] = BI[bone]; sw[i * 4] = 1;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  list.push(geo);
}
const cap = (r, len, seg = 7) => new THREE.CapsuleGeometry(r, len, 3, seg);
const box = (w, h, d, r = 0.03) => new RoundedBoxGeometry(w, h, d, 2, r);

function buildGeometry(kind) {
  if (geoCache[kind]) return geoCache[kind];
  const L = LOOKS[kind], parts = [];
  const W = RW;
  // pelvis + belt
  part(parts, box(0.34, 0.2, 0.23, 0.06), 'hips', L.pants, { x: 0, y: W.hips[1] + 0.02 });
  part(parts, box(0.36, 0.06, 0.25, 0.02), 'hips', L.web, { y: W.hips[1] + 0.11 });
  // torso: slightly tapered, broader at the chest
  const torso = box(0.36, 0.44, 0.22, 0.08);
  const tp = torso.attributes.position;
  for (let i = 0; i < tp.count; i++) { const y = tp.getY(i); const k = 1 + (y + 0.22) * 0.25; tp.setX(i, tp.getX(i) * k); }
  torso.computeVertexNormals();
  part(parts, torso, 'chest', L.top, { y: W.chest[1] - 0.02 });
  if (!L.tied) {
    // webbing: chest rig straps and pouches
    part(parts, box(0.37, 0.05, 0.235, 0.02), 'chest', L.web, { y: W.chest[1] - 0.12 });
    part(parts, box(0.05, 0.4, 0.24, 0.02), 'chest', L.web, { x: 0.1, y: W.chest[1] - 0.02, rz: 0.2 });
    part(parts, box(0.05, 0.4, 0.24, 0.02), 'chest', L.web, { x: -0.1, y: W.chest[1] - 0.02, rz: -0.2 });
    for (const x of [-0.12, 0, 0.12]) part(parts, box(0.09, 0.1, 0.06, 0.02), 'chest', L.web, { x, y: W.chest[1] - 0.1, z: 0.13 });
  }
  if (L.pack) part(parts, box(0.3, 0.34, 0.14, 0.05), 'chest', L.pack, { y: W.chest[1] + 0.0, z: -0.17 });
  if (L.satchel) part(parts, box(0.2, 0.2, 0.1, 0.04), 'hips', L.satchel, { x: 0.2, y: W.hips[1] - 0.02, z: -0.04 });
  // neck + head
  part(parts, new THREE.CylinderGeometry(0.055, 0.065, 0.12, 8), 'head', L.skin, { y: W.head[1] + 0.04 });
  const head = new THREE.SphereGeometry(0.115, 14, 10); head.scale(0.95, 1.1, 1.02);
  part(parts, head, 'head', L.skin, { y: W.head[1] + 0.17, z: 0.01 });
  part(parts, box(0.05, 0.03, 0.04, 0.01), 'head', L.skin, { y: W.head[1] + 0.15, z: 0.115 }); // nose
  if (L.helmet) {
    const h = new THREE.SphereGeometry(0.15, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55); h.scale(1, 0.85, 1.06);
    part(parts, h, 'head', L.helmet, { y: W.head[1] + 0.2 });
    part(parts, new THREE.CylinderGeometry(0.165, 0.17, 0.02, 14), 'head', L.helmet, { y: W.head[1] + 0.2 });
  }
  if (L.cap) {
    part(parts, new THREE.CylinderGeometry(0.12, 0.125, 0.08, 12), 'head', L.cap, { y: W.head[1] + 0.27 });
    part(parts, box(0.16, 0.015, 0.09, 0.005), 'head', L.cap, { y: W.head[1] + 0.24, z: 0.11 });
  }
  if (L.peaked) {
    part(parts, new THREE.CylinderGeometry(0.15, 0.12, 0.08, 14), 'head', L.peaked, { y: W.head[1] + 0.3 });
    part(parts, new THREE.CylinderGeometry(0.122, 0.122, 0.035, 14), 'head', L.band, { y: W.head[1] + 0.26 });
    part(parts, box(0.17, 0.015, 0.1, 0.005), 'head', '#111', { y: W.head[1] + 0.245, z: 0.11, rx: 0.2 });
  }
  if (L.hair) {
    const hh = new THREE.SphereGeometry(0.125, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5); hh.scale(1, 0.9, 1.05);
    part(parts, hh, 'head', L.hair, { y: W.head[1] + 0.19, z: -0.01 });
    part(parts, box(0.18, 0.12, 0.08, 0.03), 'head', L.hair, { y: W.head[1] + 0.13, z: -0.08 });
  }
  if (L.band) if (!L.peaked) {
    part(parts, new THREE.CylinderGeometry(0.123, 0.123, 0.04, 14), 'head', L.band, { y: W.head[1] + 0.22 });
    part(parts, box(0.035, 0.03, 0.2, 0.01), 'head', L.band, { x: 0.03, y: W.head[1] + 0.2, z: -0.18, rx: -0.5, ry: 0.2 });
    part(parts, box(0.035, 0.03, 0.17, 0.01), 'head', L.band, { x: -0.03, y: W.head[1] + 0.19, z: -0.16, rx: -0.7, ry: -0.25 });
  }
  // arms (bare for Joe: tank top)
  for (const s of ['L', 'R']) {
    const sx = s === 'L' ? 1 : -1, a = W['arm' + s], f = W['fore' + s];
    const sleeve = L.topBare ? L.skin : L.top;
    part(parts, new THREE.SphereGeometry(0.075, 10, 8), 'arm' + s, L.topBare ? L.top : L.top, { x: a[0], y: a[1] - 0.01 });
    part(parts, cap(L.topBare ? 0.058 : 0.062, 0.2), 'arm' + s, sleeve, { x: a[0], y: a[1] - 0.13 });
    part(parts, cap(L.topBare ? 0.05 : 0.055, 0.18), 'fore' + s, L.topBare ? L.skin : L.top, { x: f[0], y: f[1] - 0.11 });
    part(parts, new THREE.SphereGeometry(0.05, 8, 6), 'fore' + s, L.skin, { x: f[0], y: f[1] - 0.25 });
    // legs
    const t = W['thigh' + s], sh = W['shin' + s];
    part(parts, cap(0.085, 0.3), 'thigh' + s, L.pants, { x: t[0], y: t[1] - 0.2 });
    part(parts, box(0.1, 0.1, 0.06, 0.02), 'thigh' + s, L.pants2, { x: t[0] + sx * 0.08, y: t[1] - 0.24, z: 0.02 });
    part(parts, cap(0.07, 0.3), 'shin' + s, L.pants2, { x: sh[0], y: sh[1] - 0.18 });
    part(parts, box(0.115, 0.12, 0.26, 0.04), 'shin' + s, L.boots, { x: sh[0], y: sh[1] - 0.38, z: 0.045 });
  }
  // rifle (on the gun bone, pointing +Z)
  const g = W.gun;
  if (!L.noGun) {
    if (L.pistol) {
      part(parts, box(0.04, 0.08, 0.2, 0.01), 'gun', L.gun, { x: g[0], y: g[1], z: g[2] + 0.12 });
    } else {
      part(parts, box(0.05, 0.08, 0.5, 0.01), 'gun', L.gun, { x: g[0], y: g[1], z: g[2] + 0.18 });
      part(parts, new THREE.CylinderGeometry(0.014, 0.014, 0.34, 6).rotateX(Math.PI / 2), 'gun', L.gun, { x: g[0], y: g[1] + 0.015, z: g[2] + 0.6 });
      part(parts, box(0.045, 0.1, 0.24, 0.02), 'gun', L.wood, { x: g[0], y: g[1] - 0.03, z: g[2] - 0.15, rx: 0.12 });
      part(parts, box(0.04, 0.16, 0.06, 0.01), 'gun', L.gun, { x: g[0], y: g[1] - 0.1, z: g[2] + 0.2, rx: 0.3 });
      part(parts, box(0.05, 0.05, 0.16, 0.015), 'gun', L.wood, { x: g[0], y: g[1] - 0.005, z: g[2] + 0.36 });
    }
  } else if (!L.tied) {
    // slung rifle on the back
    part(parts, box(0.04, 0.07, 0.8, 0.01), 'chest', L.gun, { x: 0, y: W.chest[1] + 0.02, z: -0.16, rx: 1.2, ry: 0.5 });
  }
  const geo = mergeGeometries(parts, false);
  geo.computeBoundingSphere();
  geo.boundingSphere.radius = 1.6; geo.boundingSphere.center.set(0, 0.9, 0);
  geoCache[kind] = geo;
  return geo;
}

function makeMaterial(look) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72, metalness: 0.02 });
  const u = m.userData;
  u.uRim = { value: new THREE.Color(...look.rim) };
  u.uFlash = { value: 0 };
  u.uFade = { value: 1 };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = u.uRim; sh.uniforms.uFlash = u.uFlash;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRim; uniform float uFlash;')
      .replace('#include <opaque_fragment>', `
        float fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.2);
        outgoingLight += uRim * fres;
        outgoingLight = mix(outgoingLight, vec3(1.0, 0.95, 0.85), uFlash);
        #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => 'soldier-rim';
  return m;
}

export class Soldier {
  constructor(kind) {
    this.kind = kind;
    const look = this.look = LOOKS[kind];
    const bones = [], byName = {};
    for (const [n, p, o] of BONES) {
      const b = new THREE.Bone(); b.name = n; b.position.set(...o);
      if (p) byName[p].add(b);
      bones.push(b); byName[n] = b;
    }
    this.b = byName;
    const mesh = this.mesh = new THREE.SkinnedMesh(buildGeometry(kind), makeMaterial(look));
    mesh.add(bones[0]);
    bones[0].updateMatrixWorld(true);
    mesh.bind(new THREE.Skeleton(bones));
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.frustumCulled = true;
    this.obj = new THREE.Group();
    this.obj.add(mesh);
    mesh.scale.setScalar(look.scale);
    this.muzzleLocal = new THREE.Vector3(RW.gun[0], RW.gun[1] + 0.015, RW.gun[2] + (look.pistol ? 0.25 : 0.78));
    this.a = { phase: 0, speed: 0, twist: 0, crouch: 0, aim: 1, recoil: 0, throwT: -1, dead: 0, deadDir: 1, deadSpin: 0, t: Math.random() * 10, wave: 0 };
  }

  get material() { return this.mesh.material; }
  // free the per-soldier GPU objects (bone texture, material); the geometry is shared
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.obj.removeFromParent();
    this.mesh.skeleton.dispose();
    this.mesh.material.dispose();
  }
  setFlash(v) { this.mesh.material.userData.uFlash.value = v; }

  // world-space muzzle point (call after pose())
  muzzle(out) {
    const gun = this.b.gun;
    gun.updateWorldMatrix(true, false);
    const lp = this.muzzleLocal.clone().sub(new THREE.Vector3(...RW.gun));
    return out.copy(lp).applyMatrix4(gun.matrixWorld);
  }

  pose(dt) {
    const a = this.a, b = this.b;
    a.t += dt;
    const s = clamp(a.speed, 0, 1), ph = a.phase;
    const sw = Math.sin(ph), cw = Math.cos(ph);
    const c = a.crouch;
    // legs: pendulum thighs, knees fold on the forward swing
    const A = 0.62 * s;
    b.thighL.rotation.set(-sw * A - c * 1.25, 0, 0.02);
    b.thighR.rotation.set(sw * A - c * 0.35, 0, -0.02);
    b.shinL.rotation.set((0.15 + Math.max(0, cw) * 0.95) * s + c * 1.45, 0, 0);
    b.shinR.rotation.set((0.15 + Math.max(0, -cw) * 0.95) * s + c * 1.95, 0, 0);
    // hips bob twice per stride, drop when crouching
    b.hips.position.y = RW.hips[1] - Math.abs(sw) * 0.05 * s - c * 0.42 + 0.02 * s;
    // seated (motorcycle rider / sidecar gunner)
    if (a.sit) {
      b.thighL.rotation.set(-1.45, 0, 0.14); b.thighR.rotation.set(-1.45, 0, -0.14);
      b.shinL.rotation.set(1.3, 0, 0); b.shinR.rotation.set(1.3, 0, 0);
      b.hips.position.y = RW.hips[1] - 0.5;
    }
    b.hips.rotation.set(0, sw * 0.18 * s, 0);
    // upper body: lean into the run, twist toward the aim, breathe
    const breathe = Math.sin(a.t * 2.2) * 0.015 * (1 - s);
    b.spine.rotation.set(0.16 * s + c * 0.2 + breathe, a.twist * 0.45 - sw * 0.12 * s, 0);
    b.chest.rotation.set(-a.recoil * 0.12, a.twist * 0.45, 0);
    b.head.rotation.set(-0.12 * s + c * -0.1, 0, 0);
    // arms hold the rifle across the body (or swing when unarmed)
    const bob = cw * 0.06 * s;
    if (this.look.noGun) {
      if (this.look.tied) {
        b.armL.rotation.set(0.35, 0, 0.18); b.foreL.rotation.set(-0.9, 0, 0.6);
        b.armR.rotation.set(0.35, 0, -0.18); b.foreR.rotation.set(-0.9, 0, -0.6);
      } else {
        b.armL.rotation.set(sw * 0.7 * s, 0, 0.12); b.foreL.rotation.set(-0.4 - s * 0.5, 0, 0);
        b.armR.rotation.set(-sw * 0.7 * s, 0, -0.12); b.foreR.rotation.set(-0.4 - s * 0.5, 0, 0);
      }
    } else if (this.look.pistol) {
      b.armR.rotation.set(-1.45 + bob, 0, 0.1); b.foreR.rotation.set(-0.05, 0, 0);
      b.armL.rotation.set(sw * 0.6 * s, 0, 0.12); b.foreL.rotation.set(-0.5, 0, 0);
      b.gun.position.set(RW.gun[0] + 0.0 - RW.chest[0] + (-0.13), RW.gun[1] - RW.chest[1] + 0.14, RW.gun[2] - RW.chest[2] + 0.35);
    } else {
      // low ready: stock at the hip, hands on grip and handguard, elbows in
      b.armR.rotation.set(-0.3 + bob - a.recoil * 0.1, 0.15, -0.12); b.foreR.rotation.set(-1.05, 0, 0.25);
      b.armL.rotation.set(-0.75 + bob, -0.25, 0.3); b.foreL.rotation.set(-0.8, 0, -0.55);
      b.gun.position.set(RW.gun[0] - RW.chest[0] + 0.02, RW.gun[1] - RW.chest[1] - 0.1 + bob * 0.3, RW.gun[2] - RW.chest[2] + 0.02 - a.recoil * 0.06);
      b.gun.rotation.set(-0.06 - a.recoil * 0.1, 0.03, 0);
    }
    // grenade throw overrides the right arm: wind-up then overhead release
    if (a.throwT >= 0) {
      const t = a.throwT;
      const ang = t < 0.45 ? lerp(0, 1.2, t / 0.45) : lerp(1.2, -2.7, Math.min(1, (t - 0.45) / 0.3));
      b.armR.rotation.set(-ang - 0.4, 0, -0.35); b.foreR.rotation.set(-0.5 + (t < 0.45 ? -0.9 : 0), 0, 0);
      b.spine.rotation.y += t < 0.45 ? -0.35 : 0.3;
    }
    // death: topple from the feet, limbs go slack
    if (a.dead > 0) {
      const d = a.dead, e = d * d;
      this.mesh.rotation.x = -a.deadDir * e * 1.5;
      this.mesh.rotation.z = a.deadSpin * e * 0.4;
      this.mesh.position.y = 0.0;
      b.armL.rotation.set(-2.2 * e, 0, 0.9 * e); b.armR.rotation.set(-2.0 * e, 0, -1.0 * e);
      b.foreL.rotation.set(-0.3, 0, 0); b.foreR.rotation.set(-0.3, 0, 0);
      b.thighL.rotation.set(-0.3 * e, 0, 0.15); b.thighR.rotation.set(0.1 * e, 0, -0.2);
      b.shinL.rotation.set(0.5 * e, 0, 0); b.shinR.rotation.set(0.2 * e, 0, 0);
      b.hips.position.y = RW.hips[1] - e * 0.1;
      b.spine.rotation.set(0, 0, 0); b.chest.rotation.set(0, 0, 0);
    } else {
      this.mesh.rotation.x = 0; this.mesh.rotation.z = 0;
    }
  }
}
