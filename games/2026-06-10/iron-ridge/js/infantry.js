// Ground infantry: cheap instanced riflemen that swarm the field. They
// barely scratch armor — they exist to be mowed down by the coax MG,
// shell splash, artillery, or your tracks. Four InstancedMeshes (body,
// head, helmet, rifle) share one matrix per soldier: 4 draw calls total.

import * as THREE from 'three';
import { getHeight } from './terrain.js?v=5';
import { INFANTRY } from './config.js?v=5';

const _m = new THREE.Matrix4();
const _lm = new THREE.Matrix4();
const _fm = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3(1, 1, 1);
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);

const UNIFORMS = [0x5c6647, 0x66604a, 0x4f5a50]; // olive/khaki/grey-green
const HIP_Y = 0.66;

export class Infantry {
  constructor(scene) {
    this.scene = scene;
    const mats = {
      cloth: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
      clothDark: new THREE.MeshStandardMaterial({ color: 0x474f38, roughness: 0.92 }),
      skin: new THREE.MeshStandardMaterial({ color: 0xc9a279, roughness: 0.8 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x3d4438, roughness: 0.6, metalness: 0.3 }),
      gun: new THREE.MeshStandardMaterial({ color: 0x2e2a24, roughness: 0.7, metalness: 0.3 }),
      pack: new THREE.MeshStandardMaterial({ color: 0x555c40, roughness: 0.95 }),
      boot: new THREE.MeshStandardMaterial({ color: 0x2a241d, roughness: 0.9 }),
    };
    // torso with webbing belt, head under a brimmed helmet, slung rifle,
    // field pack, cross-chest arms; legs get their own matrices so they swing
    const torso = new THREE.CapsuleGeometry(0.19, 0.42, 3, 7);
    torso.translate(0, 1.02, 0);
    const belt = new THREE.CylinderGeometry(0.21, 0.21, 0.09, 8);
    belt.translate(0, 0.8, 0);
    const head = new THREE.SphereGeometry(0.135, 7, 6);
    head.translate(0, 1.43, 0);
    const helmet = new THREE.SphereGeometry(0.18, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.62);
    helmet.scale(1, 0.85, 1.08);
    helmet.translate(0, 1.46, 0);
    const rifle = new THREE.BoxGeometry(0.05, 0.07, 0.86);
    rifle.translate(0.19, 1.07, 0.3);
    const mag = new THREE.BoxGeometry(0.05, 0.13, 0.08);
    mag.translate(0.19, 0.99, 0.22);
    const pack = new THREE.BoxGeometry(0.3, 0.34, 0.16);
    pack.translate(0, 1.08, -0.25);
    const arms = new THREE.BoxGeometry(0.4, 0.09, 0.1);
    arms.rotateY(-0.5);
    arms.translate(0.03, 1.12, 0.14);
    // legs pivot at the hip: geometry hangs downward from the origin
    const legGeo = () => {
      const g = new THREE.BoxGeometry(0.12, 0.56, 0.15);
      g.translate(0, -0.28, 0);
      return g;
    };
    const bootGeo = () => {
      const g = new THREE.BoxGeometry(0.13, 0.09, 0.24);
      g.translate(0, -0.6, 0.04);
      return g;
    };

    const make = (geo, mat) => {
      const m = new THREE.InstancedMesh(geo, mat, INFANTRY.max);
      m.castShadow = true;
      m.frustumCulled = false;
      for (let i = 0; i < INFANTRY.max; i++) m.setMatrixAt(i, _zero);
      scene.add(m);
      return m;
    };
    // parts sharing the soldier's base matrix
    this.staticMeshes = [
      make(torso, mats.cloth),
      make(belt, mats.clothDark),
      make(head, mats.skin),
      make(helmet, mats.steel),
      make(rifle, mats.gun),
      make(mag, mats.gun),
      make(pack, mats.pack),
      make(arms, mats.cloth),
    ];
    // legs swing around the hip
    this.legL = make(legGeo(), mats.clothDark);
    this.legR = make(legGeo(), mats.clothDark);
    this.bootL = make(bootGeo(), mats.boot);
    this.bootR = make(bootGeo(), mats.boot);
    this.meshes = [...this.staticMeshes, this.legL, this.legR, this.bootL, this.bootR];

    // per-soldier uniform tint on torso + arms
    const col = new THREE.Color();
    for (let i = 0; i < INFANTRY.max; i++) {
      col.set(UNIFORMS[i % UNIFORMS.length]);
      this.staticMeshes[0].setColorAt(i, col);
      this.staticMeshes[7].setColorAt(i, col);
    }
    for (const m of [this.staticMeshes[0], this.staticMeshes[7]]) {
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }

    this.units = new Array(INFANTRY.max).fill(null).map(() => ({
      alive: false, x: 0, z: 0, yaw: 0, fireT: 1, phase: Math.random() * 7, walk: 0, swingAmp: 0,
    }));
    this.time = 0;
  }

  aliveCount() {
    let n = 0;
    for (const u of this.units) if (u.alive) n++;
    return n;
  }

  spawnSquad(x, z, n) {
    let spawned = 0;
    for (const u of this.units) {
      if (spawned >= n) break;
      if (u.alive) continue;
      u.alive = true;
      const a = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 5;
      u.x = x + Math.cos(a) * r;
      u.z = z + Math.sin(a) * r;
      u.yaw = Math.random() * Math.PI * 2;
      u.fireT = 1 + Math.random() * INFANTRY.reload;
      u.phase = Math.random() * 7;
      spawned++;
    }
    return spawned;
  }

  // advance toward the nearest target, stop and shoot in range.
  // onShoot(unit, target) fires per rifle shot.
  step(dt, targets, onShoot) {
    this.time += dt;
    if (!targets.length) return;
    for (const u of this.units) {
      if (!u.alive) continue;
      let best = null, bestD = Infinity;
      for (const t of targets) {
        const d = Math.hypot(t.body.position.x - u.x, t.body.position.z - u.z);
        if (d < bestD) { bestD = d; best = t; }
      }
      if (!best) continue;
      const dx = best.body.position.x - u.x;
      const dz = best.body.position.z - u.z;
      const want = Math.atan2(dx, dz);
      let dy = want - u.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      u.yaw += THREE.MathUtils.clamp(dy, -2.4 * dt, 2.4 * dt);
      if (bestD > INFANTRY.stopRange) {
        // weave a little so they don't march in a laser line
        const weave = Math.sin(this.time * 1.3 + u.phase) * 0.5;
        u.x += Math.sin(u.yaw + weave) * INFANTRY.speed * dt;
        u.z += Math.cos(u.yaw + weave) * INFANTRY.speed * dt;
        u.walk += dt;
        u.swingAmp = Math.min(1, u.swingAmp + dt * 6);
      } else {
        u.swingAmp = Math.max(0, u.swingAmp - dt * 6);
      }
      u.fireT -= dt;
      if (u.fireT <= 0 && bestD < INFANTRY.fireRange) {
        u.fireT = INFANTRY.reload * (0.7 + Math.random() * 0.8);
        onShoot(u, best);
      }
    }
  }

  // kill every soldier within r of a point; onKill(unit) per casualty
  killRadius(x, z, r, onKill) {
    let n = 0;
    for (const u of this.units) {
      if (!u.alive) continue;
      if (Math.hypot(u.x - x, u.z - z) < r) {
        u.alive = false;
        onKill?.(u);
        n++;
      }
    }
    return n;
  }

  // nearest soldier intersected by a ray (cylinder test, torso height)
  mgHit(origin, dir, maxDist) {
    let best = null, bestT = maxDist;
    for (const u of this.units) {
      if (!u.alive) continue;
      const gy = getHeight(u.x, u.z);
      const cx = u.x - origin.x, cy = gy + 0.9 - origin.y, cz = u.z - origin.z;
      const t = cx * dir.x + cy * dir.y + cz * dir.z;
      if (t < 1 || t > bestT) continue;
      const px = origin.x + dir.x * t - u.x;
      const py = origin.y + dir.y * t - (gy + 0.9);
      const pz = origin.z + dir.z * t - u.z;
      if (px * px + pz * pz < 0.75 * 0.75 && Math.abs(py) < 1.4) {
        bestT = t;
        best = u;
      }
    }
    return best ? { unit: best, dist: bestT } : null;
  }

  // tanks grind through squads; onKill(unit, byPlayer)
  crush(tank, onKill) {
    if (!tank.alive || tank.body.velocity.length() < 1.5) return;
    const p = tank.body.position;
    for (const u of this.units) {
      if (!u.alive) continue;
      if (Math.hypot(u.x - p.x, u.z - p.z) < INFANTRY.crushRadius * (tank.scale ?? 1)) {
        u.alive = false;
        onKill?.(u, tank.isPlayer);
      }
    }
  }

  clear() {
    for (const u of this.units) u.alive = false;
  }

  // walking bob + lean shared by all parts; legs swing around the hip
  updateVisuals() {
    for (let i = 0; i < this.units.length; i++) {
      const u = this.units[i];
      if (!u.alive) {
        for (const m of this.meshes) m.setMatrixAt(i, _zero);
        continue;
      }
      const stride = Math.sin(u.walk * 8 + u.phase);
      const bob = Math.abs(stride) * 0.055 * u.swingAmp;
      _p.set(u.x, getHeight(u.x, u.z) + bob, u.z);
      _e.set(stride * 0.05 * u.swingAmp, u.yaw, 0);
      _q.setFromEuler(_e);
      _m.compose(_p, _q, _s);
      for (const m of this.staticMeshes) m.setMatrixAt(i, _m);
      // legs: base × T(hip) × RotX(±swing)
      const swing = stride * 0.55 * u.swingAmp;
      for (const [mesh, boot, sideX, sign] of [
        [this.legL, this.bootL, -0.095, 1],
        [this.legR, this.bootR, 0.095, -1],
      ]) {
        _lm.makeRotationX(swing * sign);
        _lm.setPosition(sideX, HIP_Y, 0);
        _fm.multiplyMatrices(_m, _lm);
        mesh.setMatrixAt(i, _fm);
        boot.setMatrixAt(i, _fm);
      }
    }
    for (const m of this.meshes) m.instanceMatrix.needsUpdate = true;
  }

  // muzzle point for tracer visuals
  muzzleOf(u, out) {
    out.set(
      u.x + Math.sin(u.yaw) * 0.6,
      getHeight(u.x, u.z) + 1.1,
      u.z + Math.cos(u.yaw) * 0.6,
    );
    return out;
  }
}
