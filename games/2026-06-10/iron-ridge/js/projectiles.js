// Shells: pooled ballistic projectiles. Gravity-curved flight integrated at
// the fixed physics step; hits found by segment raycasts against the cannon
// world plus the tree spatial hash. Explosions push real impulses into
// nearby rigid bodies.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SHELL, CG } from './config.js';

const _from = new CANNON.Vec3();
const _to = new CANNON.Vec3();

export class Projectiles {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.pool = [];
    this.active = [];
    const geo = new THREE.SphereGeometry(SHELL.radius, 8, 6);
    geo.scale(1, 1, 3.2); // tracer-stretched
    const matP = new THREE.MeshBasicMaterial({ color: 0xffd089 });
    const matE = new THREE.MeshBasicMaterial({ color: 0xff8d6a });
    for (let i = 0; i < SHELL.maxActive; i++) {
      const mesh = new THREE.Mesh(geo, matP);
      mesh.visible = false;
      scene.add(mesh);
      this.pool.push({ mesh, matP, matE });
    }
    this.result = new CANNON.RaycastResult();
  }

  // owner: Tank instance; onHit(hit) with {point, normal, body, shell}
  spawn(origin, dir, speed, owner, onHit, power = 1) {
    const slot = this.pool.pop();
    if (!slot) return null;
    const s = {
      slot,
      pos: origin.clone(),
      vel: dir.clone().multiplyScalar(speed),
      life: 0,
      owner,
      onHit,
      power,
      fromPlayer: owner?.isPlayer ?? false,
    };
    slot.mesh.material = s.fromPlayer ? slot.matP : slot.matE;
    slot.mesh.visible = true;
    slot.mesh.position.copy(origin);
    this.active.push(s);
    return s;
  }

  kill(s) {
    s.slot.mesh.visible = false;
    this.pool.push(s.slot);
    const i = this.active.indexOf(s);
    if (i >= 0) this.active.splice(i, 1);
  }

  step(dt, foliage) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const s = this.active[i];
      s.life += dt;
      if (s.life > SHELL.maxLife) { this.kill(s); continue; }

      const prev = s.pos.clone();
      s.vel.y += SHELL.gravity * dt;
      s.pos.addScaledVector(s.vel, dt);

      // physics world raycast (skip the shooter's own group)
      _from.set(prev.x, prev.y, prev.z);
      _to.set(s.pos.x, s.pos.y, s.pos.z);
      const skip = s.fromPlayer ? CG.PLAYER : CG.ENEMY;
      this.result.reset();
      this.world.raycastClosest(_from, _to, {
        collisionFilterMask: ~skip,
        skipBackfaces: true,
      }, this.result);

      let hitT = Infinity, hit = null;
      if (this.result.hasHit) {
        hitT = this.result.hitPointWorld.distanceTo(_from);
        hit = {
          point: new THREE.Vector3().copy(this.result.hitPointWorld),
          normal: new THREE.Vector3().copy(this.result.hitNormalWorld),
          body: this.result.body,
          shell: s,
        };
      }

      // tree hits (instanced visuals have no bodies — use the hash)
      if (foliage) {
        const segLen = prev.distanceTo(s.pos);
        const steps = Math.max(1, Math.ceil(segLen / 1.5));
        outer:
        for (let k = 0; k <= steps; k++) {
          const t = k / steps;
          const px = prev.x + (s.pos.x - prev.x) * t;
          const py = prev.y + (s.pos.y - prev.y) * t;
          const pz = prev.z + (s.pos.z - prev.z) * t;
          const near = foliage.treesNear(px, pz, 1.6);
          for (const tree of near) {
            const dx = px - tree.x, dz = pz - tree.z;
            const rr = tree.radius + SHELL.radius;
            if (dx * dx + dz * dz < rr * rr && py > tree.y - 0.5 && py < tree.y + tree.height) {
              const d = t * segLen;
              if (d < hitT) {
                hitT = d;
                hit = {
                  point: new THREE.Vector3(px, py, pz),
                  normal: new THREE.Vector3(dx, 0.2, dz).normalize(),
                  body: null,
                  tree,
                  shell: s,
                };
              }
              break outer;
            }
          }
        }
      }

      if (hit) {
        this.kill(s);
        s.onHit?.(hit);
        continue;
      }

      // orient tracer along velocity
      const m = s.slot.mesh;
      m.position.copy(s.pos);
      m.lookAt(prev);
    }
  }

  // radial impulse + returns bodies within radius (for damage application)
  explode(point, radius, impulse) {
    const affected = [];
    const p = new CANNON.Vec3(point.x, point.y, point.z);
    for (const body of this.world.bodies) {
      if (body.mass <= 0) continue;
      const d = body.position.distanceTo(p);
      if (d > radius) continue;
      const fall = 1 - d / radius;
      const dir = body.position.vsub(p);
      dir.y += radius * 0.35;          // lift things a little
      dir.normalize();
      body.wakeUp();
      body.applyImpulse(dir.scale(impulse * fall * Math.min(1, body.mass / 100)));
      affected.push({ body, falloff: fall });
    }
    return affected;
  }

  clear() {
    while (this.active.length) this.kill(this.active[0]);
  }
}
