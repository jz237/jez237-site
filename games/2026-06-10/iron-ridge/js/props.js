// Destructible props: explosive barrels, target dummies, knockable block
// walls. All dynamic props are real cannon bodies (asleep until disturbed).

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getHeight } from './terrain.js';
import { makeRng } from './noise.js';
import { CG, SCORING } from './config.js';

function barrelTexture() {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#b33a2b'; ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#8f2d22'; ctx.fillRect(0, 26, 64, 12);
  ctx.fillStyle = '#d8d2c0';
  ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('!', 32, 20);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function targetTexture() {
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#cfc4a0'; ctx.fillRect(0, 0, 128, 128);
  const rings = ['#c23b2e', '#e8e2cf', '#c23b2e', '#e8e2cf', '#c23b2e'];
  rings.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(64, 64, 56 - i * 11, 0, Math.PI * 2);
    ctx.fill();
  });
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Props {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.items = [];     // {kind, mesh, body, hp, points, alive, dynamic}
    this.rng = makeRng(8181);
    this.barrelTex = barrelTexture();
    this.targetTex = targetTexture();
    this.barrelGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.1, 10);
    this.barrelMat = new THREE.MeshStandardMaterial({ map: this.barrelTex, roughness: 0.6, metalness: 0.3 });
    this.blockGeo = new THREE.BoxGeometry(1.5, 0.75, 0.75);
    this.blockMat = new THREE.MeshStandardMaterial({ color: 0xa89a83, roughness: 0.95 });
    this.woodMat = new THREE.MeshStandardMaterial({ color: 0x9a7c52, roughness: 0.9 });
    this.targetMat = new THREE.MeshStandardMaterial({ map: this.targetTex, roughness: 0.85 });
  }

  clearAll() {
    for (const it of this.items) this.removeItem(it, false);
    this.items.length = 0;
  }

  removeItem(it, splice = true) {
    if (it.mesh) this.scene.remove(it.mesh);
    if (it.body) this.world.removeBody(it.body);
    it.alive = false;
    if (splice) {
      const i = this.items.indexOf(it);
      if (i >= 0) this.items.splice(i, 1);
    }
  }

  // ring placement around origin within [rMin, rMax], on ground
  ringSpot(rMin, rMax) {
    const a = this.rng() * Math.PI * 2;
    const r = rMin + this.rng() * (rMax - rMin);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    return { x, z, y: getHeight(x, z) };
  }

  spawnBarrel(x, z) {
    const y = getHeight(x, z);
    const mesh = new THREE.Mesh(this.barrelGeo, this.barrelMat);
    mesh.castShadow = true;
    this.scene.add(mesh);
    const body = new CANNON.Body({
      mass: 28,
      position: new CANNON.Vec3(x, y + 0.7, z),
      shape: new CANNON.Cylinder(0.45, 0.45, 1.1, 8),
      collisionFilterGroup: CG.PROP,
      collisionFilterMask: -1,
      linearDamping: 0.2,
      angularDamping: 0.4,
    });
    body.allowSleep = true;
    body.sleepSpeedLimit = 0.4;
    body.sleepTimeLimit = 0.6;
    this.world.addBody(body);
    const it = { kind: 'barrel', mesh, body, hp: 1, points: SCORING.barrel, alive: true, dynamic: true, radius: 0.8 };
    body.userData = { kind: 'prop', prop: it };
    this.items.push(it);
    return it;
  }

  spawnTarget(x, z) {
    const y = getHeight(x, z);
    const grp = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.5, 0.16), this.woodMat);
    post.position.y = 0.75;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 0.1), this.targetMat);
    panel.position.y = 2.2;
    grp.add(post, panel);
    grp.traverse(o => { if (o.isMesh) o.castShadow = true; });
    grp.position.set(x, y, z);
    grp.rotation.y = Math.atan2(-x, -z); // face the spawn area
    this.scene.add(grp);
    const body = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(x, y + 2.2, z),
      shape: new CANNON.Box(new CANNON.Vec3(0.85, 0.85, 0.3)),
      collisionFilterGroup: CG.PROP,
      collisionFilterMask: -1,
    });
    this.world.addBody(body);
    const it = { kind: 'target', mesh: grp, body, hp: 1, points: SCORING.target, alive: true, dynamic: false, radius: 1.4 };
    body.userData = { kind: 'prop', prop: it };
    this.items.push(it);
    return it;
  }

  spawnWall(x, z) {
    // small ruined hut: an L of stacked blocks, each a real dynamic body
    const y0 = getHeight(x, z);
    const yaw = this.rng() * Math.PI;
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    const layout = [];
    for (let i = -2; i <= 2; i++) layout.push([i * 1.55, 0]);
    for (let j = 1; j <= 3; j++) layout.push([-2 * 1.55, j * 0.8]);
    for (const row of [1, 2]) {
      for (let i = -2 + row; i <= 2 - row; i++) layout.push([i * 1.55 + (row % 2) * 0.7, 0, row]);
    }
    for (const [lx, lz, layer = 0] of layout) {
      const wx = x + lx * cos - lz * sin;
      const wz = z + lx * sin + lz * cos;
      const wy = getHeight(wx, wz) + 0.42 + layer * 0.78;
      const mesh = new THREE.Mesh(this.blockGeo, this.blockMat);
      mesh.castShadow = true;
      this.scene.add(mesh);
      const body = new CANNON.Body({
        mass: 16,
        position: new CANNON.Vec3(wx, wy, wz),
        shape: new CANNON.Box(new CANNON.Vec3(0.75, 0.375, 0.375)),
        quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw),
        collisionFilterGroup: CG.PROP,
        collisionFilterMask: -1,
        linearDamping: 0.25,
        angularDamping: 0.5,
      });
      body.allowSleep = true;
      body.sleepSpeedLimit = 0.5;
      body.sleepTimeLimit = 0.4;
      this.world.addBody(body);
      const it = { kind: 'block', mesh, body, hp: 2, points: SCORING.block, alive: true, dynamic: true, radius: 0.9 };
      body.userData = { kind: 'prop', prop: it };
      this.items.push(it);
    }
  }

  countAlive(kind) {
    let n = 0;
    for (const it of this.items) if (it.alive && it.kind === kind) n++;
    return n;
  }

  update() {
    for (const it of this.items) {
      if (!it.alive || !it.dynamic) continue;
      it.mesh.position.copy(it.body.position);
      it.mesh.quaternion.copy(it.body.quaternion);
    }
  }
}
