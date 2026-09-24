// soldier.js — animated soldiers built from Quaternius' Toon Shooter Game Kit
// characters (CC0). Each kind is baked once into a single skinned mesh with
// vertex colours (body, head, shoulder pads and the kind's weapon, all bound to
// one skeleton), so a soldier is one draw call. The game drives the same
// parameters it always has (speed, stride phase, crouch, throw, death, aim
// twist); here they pick and blend the model's animation clips.
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLB, toFloat } from './assets.js';
import { clamp } from './util.js';

// tint: material name → colour for the body (weapons keep their own colours)
export const LOOKS = {
  joe: { src: 'soldier', gun: 'AK', h: 1.95, rim: [0.22, 0.18, 0.1], tint: { Character_Main: '#5d6c36', Pants: '#4c5530', Grey: '#a8332a' } },
  rifle: { src: 'enemy', gun: 'AK', h: 1.85, rim: [0.34, 0.07, 0.03], tint: { Enemy_Red: '#58708c', Grey: '#5d6470' } },
  lobber: { src: 'enemy', gun: null, h: 1.85, rim: [0.34, 0.07, 0.03], tint: { Enemy_Red: '#8a7147', Grey: '#6b6452' }, noGun: true },
  officer: { src: 'enemy', gun: 'Pistol', h: 1.92, rim: [0.38, 0.08, 0.03], tint: { Enemy_Red: '#343d49', Grey: '#23262b', DarkGrey: '#7a1c16' }, pistol: true },
  pow: { src: 'soldier', gun: null, h: 1.85, rim: [0.2, 0.3, 0.15], tint: { Character_Main: '#d2c8ad', Pants: '#766b52', Grey: '#9d937c', Black: '#5a4a38' }, noGun: true, tied: true },
};
const GUNS = ['AK', 'Pistol'];

// ------------------------------------------------------------------ templates
const TPL = {};
const _m = new THREE.Matrix4();

function template(kind) {
  if (TPL[kind]) return TPL[kind];
  const L = LOOKS[kind], src = GLB[L.src];
  const root = cloneSkinned(src.scene);
  root.updateMatrixWorld(true);
  const skinned = [], rigid = [];
  root.traverse((o) => { if (o.isSkinnedMesh) skinned.push(o); else if (o.isMesh) rigid.push(o); });
  const main = skinned[0], sk = main.skeleton;
  const idx = new Map(sk.bones.map((b, i) => [b.name, i]));
  const BMi = main.bindMatrix.clone().invert();
  const geos = [], body = new THREE.Box3(), tmpB = new THREE.Box3();
  const gunOf = (o) => { for (let p = o; p && !p.isBone; p = p.parent) if (GUNS.includes(p.name)) return p.name; return null; };
  const paint = (g, mat, gun) => {
    const c = new THREE.Color(!gun && L.tint[mat.name] ? L.tint[mat.name] : mat.color);
    const n = g.attributes.position.count, col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color', 'skinIndex', 'skinWeight'].includes(k)) g.deleteAttribute(k);
  };
  for (const sm of skinned) {
    const g = toFloat(sm.geometry);
    if (sm !== main) {
      // bound by its own skin: re-express it in the main mesh's bind space
      const K = sk.boneInverses[0].clone().invert().multiply(sm.skeleton.boneInverses[0]).multiply(sm.bindMatrix);
      g.applyMatrix4(BMi.clone().multiply(K));
      const si = g.attributes.skinIndex;
      for (let i = 0; i < si.count; i++) for (let j = 0; j < 4; j++) si.setComponent(i, j, idx.get(sm.skeleton.bones[si.getComponent(i, j)].name));
    }
    paint(g, sm.material, null);
    geos.push(g);
    tmpB.setFromObject(sm); body.union(tmpB);
  }
  let muzzle = null;
  for (const r of rigid) {
    const gun = gunOf(r);
    if (gun && gun !== L.gun) continue;
    let bone = r.parent; while (bone && !bone.isBone) bone = bone.parent;
    const j = sk.bones.indexOf(bone);
    const local = bone.matrixWorld.clone().invert().multiply(r.matrixWorld);   // part → bone
    const g = toFloat(r.geometry);
    if (gun) {
      // the muzzle is the gun vertex farthest from the hand
      const p = g.attributes.position, v = new THREE.Vector3();
      let best = -1;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(local); const d = v.lengthSq(); if (d > best) { best = d; muzzle = { bone: bone.name, local: v.clone() }; } }
    } else { tmpB.setFromObject(r); body.union(tmpB); }
    g.applyMatrix4(_m.copy(BMi).multiply(sk.boneInverses[j].clone().invert()).multiply(local));
    const n = g.attributes.position.count;
    g.setAttribute('skinIndex', new THREE.BufferAttribute(new Float32Array(n * 4).map((_, i) => (i % 4 === 0 ? j : 0)), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(n * 4).map((_, i) => (i % 4 === 0 ? 1 : 0)), 4));
    paint(g, r.material, gun);
    geos.push(g);
  }
  const geo = mergeGeometries(geos, false);
  const parent = main.parent;
  for (const o of [...skinned, ...rigid]) o.removeFromParent();
  const mesh = new THREE.SkinnedMesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true }));
  mesh.name = 'body';
  mesh.position.copy(main.position); mesh.quaternion.copy(main.quaternion); mesh.scale.copy(main.scale);
  parent.add(mesh);
  mesh.bind(sk, main.bindMatrix);
  // clips: the soldier model borrows the enemy's walk and run-and-shoot (same rig)
  const clips = {};
  for (const c of GLB.enemy.animations) clips[c.name] = c;
  for (const c of src.animations) clips[c.name] = c;
  const scale = L.h / (body.max.y - body.min.y);
  return (TPL[kind] = { root, clips, scale, muzzle });
}

function makeMaterial(look) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0.02 });
  const u = m.userData;
  u.uRim = { value: new THREE.Color(...look.rim) };
  u.uFlash = { value: 0 };
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

// ------------------------------------------------------------------ soldier
const UP = new THREE.Vector3(0, 1, 0);
const _q = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _qt = new THREE.Quaternion();

export class Soldier {
  constructor(kind) {
    this.kind = kind;
    const look = this.look = LOOKS[kind];
    const T = template(kind);
    this.rig = cloneSkinned(T.root);
    this.mesh = this.rig.getObjectByName('body');
    this.mesh.material = makeMaterial(look);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.obj = new THREE.Group();
    this.inner = new THREE.Group();
    this.inner.scale.setScalar(T.scale);
    this.inner.add(this.rig);
    this.obj.add(this.inner);
    this.bones = {};
    this.rig.traverse((o) => { if (o.isBone) this.bones[o.name] = o; });
    this.muzzleBone = T.muzzle ? this.bones[T.muzzle.bone] : this.bones.LowerArmR;
    this.muzzleLocal = T.muzzle ? T.muzzle.local : new THREE.Vector3();
    // one action per clip; times and weights are set by hand every frame
    this.mixer = new THREE.AnimationMixer(this.rig);
    this.act = {};
    for (const [name, clip] of Object.entries(T.clips)) {
      const a = this.mixer.clipAction(clip);
      a.play(); a.setEffectiveWeight(0); a.paused = true;
      this.act[name] = { a, w: 0, dur: clip.duration };
    }
    // locomotion variant per kind
    const armed = !look.noGun;
    this.runClip = armed ? (look.pistol ? 'Run_Gun' : 'Run_Shoot') : 'Run';
    this.walkClip = armed ? 'Walk_Shoot' : 'Walk';
    this.a = { phase: 0, speed: 0, twist: 0, crouch: 0, aim: 1, recoil: 0, throwT: -1, dead: 0, deadDir: 1, deadSpin: 0, t: Math.random() * 10, wave: 0 };
  }

  get material() { return this.mesh.material; }
  // free the per-soldier GPU objects (bone texture, material); the geometry is shared
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.obj.removeFromParent();
    this.mixer.stopAllAction();
    this.mesh.skeleton.dispose();
    this.mesh.material.dispose();
  }
  setFlash(v) { this.mesh.material.userData.uFlash.value = v; }

  // world-space muzzle point (call after pose())
  muzzle(out) {
    return out.copy(this.muzzleLocal).applyMatrix4(this.muzzleBone.matrixWorld);
  }

  pose(dt) {
    const a = this.a, look = this.look;
    a.t += dt;
    const s = clamp(a.speed, 0, 1), c = clamp(a.crouch, 0, 1);
    const want = {};
    const add = (k, w) => { if (w > 0 && this.act[k]) want[k] = (want[k] || 0) + w; };
    const time = {};
    if (a.dead > 0) {
      add('Death', 1); time.Death = Math.min(1, a.dead) * this.act.Death.dur * 0.98;
    } else if (a.sit) {
      add('Duck', 1); time.Duck = this.act.Duck.dur * 0.35;
    } else if (a.throwT >= 0) {
      add('Punch', 1); time.Punch = clamp(a.throwT / 0.8, 0, 1) * this.act.Punch.dur * 0.95;
    } else {
      // stand / walk / run by speed; the stride is locked to distance travelled
      const run = clamp((s - 0.35) / 0.35, 0, 1), walk = clamp(s / 0.25, 0, 1) * (1 - run), idle = 1 - run - walk;
      const up = 1 - c;
      add(this.runClip, run * up); add(this.walkClip, walk * up);
      const firing = a.recoil > 0.05 && !look.noGun;
      add(firing ? 'Idle_Shoot' : 'Idle', idle * up);
      add('Duck', c);
      time.Duck = this.act.Duck.dur * 0.35;
      const f = ((a.phase / (Math.PI * 2)) % 1 + 1) % 1;
      time[this.runClip] = f * this.act[this.runClip].dur;
      if (this.act[this.walkClip]) time[this.walkClip] = f * this.act[this.walkClip].dur;
    }
    // weights ease toward their targets (instant for death so it can't blend)
    const k = a.dead > 0 ? 1 : Math.min(1, dt * 14);
    let sum = 0;
    for (const [name, st] of Object.entries(this.act)) {
      st.w += ((want[name] || 0) - st.w) * k;
      if (st.w < 0.002) st.w = 0;
      sum += st.w;
    }
    for (const [name, st] of Object.entries(this.act)) {
      const w = sum > 0 ? st.w / sum : 0;
      st.a.setEffectiveWeight(w);
      if (w <= 0) continue;
      if (time[name] !== undefined) st.a.time = time[name];
      else st.a.time = (st.a.time + dt) % st.dur;
    }
    this.mixer.update(0);
    // bodies don't all land the same way; riders sit down onto the seat
    this.inner.rotation.set(0, a.dead > 0 ? a.deadSpin * 0.5 : 0, 0);
    this.inner.position.y = a.sit ? -0.55 : 0;
    // twist the torso toward the aim, on top of the clip
    this.obj.updateMatrixWorld(true);
    if (a.dead <= 0 && Math.abs(a.twist) > 0.01) {
      for (const bn of ['Abdomen', 'Torso']) {
        const b = this.bones[bn];
        b.parent.getWorldQuaternion(_qp);
        _qt.setFromAxisAngle(UP, a.twist * 0.5);
        _q.copy(_qp).invert().multiply(_qt).multiply(_qp);
        b.quaternion.premultiply(_q);
        b.updateMatrixWorld(true);
      }
    }
  }
}
