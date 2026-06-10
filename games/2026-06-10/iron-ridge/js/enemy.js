// Enemy AI tanks (seek, keep range, line-of-sight, lead shots) and the
// wave manager that phases from static targets to armoured opposition.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Tank } from './tank.js';
import { getHeight } from './terrain.js';
import { ENEMY, ENEMY_TYPES, PILLBOX, SHELL, CG, PLAY_RADIUS } from './config.js';

const _v1 = new THREE.Vector3();
const _from = new CANNON.Vec3();
const _to = new CANNON.Vec3();

export class EnemyTank {
  constructor(scene, world, x, z, wave, typeName = 'standard') {
    const T = ENEMY_TYPES[typeName] ?? ENEMY_TYPES.standard;
    this.type = T;
    this.typeName = typeName;
    this.tank = new Tank(scene, world, {
      x, z,
      y: getHeight(x, z) + 1.5,
      scheme: T.scheme,
      hp: T.hp,
      isPlayer: false,
      shellSpeed: SHELL.enemySpeed,
      scale: T.scale,
      maxSpeed: T.maxSpeed,
      engineForce: T.engineForce,
      maxYawRate: T.maxYawRate,
    });
    this.tank.shellDmg = T.shellDamage;
    this.wave = wave;
    this.state = 'seek';
    this.thinkTimer = Math.random() * 0.4;
    this.reload = T.reload * (0.85 + Math.random() * 0.3) * Math.max(0.7, 1 - wave * 0.02);
    this.reloadT = this.reload * (0.4 + Math.random() * 0.6);
    this.aimNoise = Math.max(0.012, T.aimNoise - wave * 0.004);
    this.strafeDir = Math.random() > 0.5 ? 1 : -1;
    this.strafeT = 0;
    this.hasLOS = false;
    this.aimGoal = new THREE.Vector3();
    this.losResult = new CANNON.RaycastResult();
    this.deadTimer = 0;
    this.stuckT = 0;
    this.unstickT = 0;
    this.unstickTurn = 1;
  }

  losTo(playerBody, world) {
    const t = this.tank;
    _from.set(t.pos.x, t.pos.y + 1.8, t.pos.z);
    _to.set(playerBody.position.x, playerBody.position.y + 0.6, playerBody.position.z);
    this.losResult.reset();
    world.raycastClosest(_from, _to, {
      collisionFilterMask: ~CG.ENEMY,
      skipBackfaces: true,
    }, this.losResult);
    return this.losResult.hasHit && this.losResult.body === playerBody;
  }

  // returns shoot request {origin, dir} when it fires
  think(dt, player, world, fixedDt) {
    const t = this.tank;
    if (!t.alive) {
      t.applyControls(fixedDt);
      return null;
    }

    this.reloadT -= dt;
    this.strafeT -= dt;
    if (this.strafeT <= 0) {
      this.strafeT = 2.5 + Math.random() * 3;
      this.strafeDir *= -1;
    }

    const pp = player.body.position;
    const dx = pp.x - t.pos.x, dz = pp.z - t.pos.z;
    const dist = Math.hypot(dx, dz);

    this.thinkTimer -= dt;
    if (this.thinkTimer <= 0) {
      this.thinkTimer = 0.25 + Math.random() * 0.15;
      this.hasLOS = player.alive && dist < ENEMY.engageRange && this.losTo(player.body, world);
    }

    // --- movement ---
    let throttle = 0, turn = 0;
    const fwd = t.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
    const headTo = (tx, tz) => {
      const want = Math.atan2(tx - t.pos.x, tz - t.pos.z);
      const cur = Math.atan2(fwd.x, fwd.z);
      let d = want - cur;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      return d;
    };

    // NOTE: positive `turn` steers yaw NEGATIVE (matches player controls),
    // so steer with the negated heading error.
    if (!player.alive) {
      throttle = 0;
    } else if (!this.hasLOS || dist > this.type.preferredRange + 18) {
      // close in — pivot first, advance once roughly aligned
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.6, -1, 1);
      throttle = Math.abs(d) < 0.5 ? 0.95 : Math.abs(d) < 1.2 ? 0.45 : 0.05;
    } else if (dist < this.type.minRange) {
      // back off, keep gun on target
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.2, -1, 1);
      throttle = -0.7;
    } else {
      // hold range: orbit tangentially, leaning in/out to fix range error
      const lean = THREE.MathUtils.clamp((this.type.preferredRange - dist) * 0.025, -0.45, 0.45);
      const d = headTo(pp.x, pp.z) + this.strafeDir * (Math.PI / 2 + lean);
      const dn = Math.atan2(Math.sin(d), Math.cos(d));
      turn = THREE.MathUtils.clamp(-dn * 1.2, -1, 1);
      throttle = 0.4;
    }
    // keep inside the play area
    const rad = Math.hypot(t.pos.x, t.pos.z);
    if (rad > PLAY_RADIUS - 20) {
      const d = headTo(0, 0);
      turn = THREE.MathUtils.clamp(-d * 1.6, -1, 1);
      throttle = Math.abs(d) < 0.9 ? 0.9 : 0.1;
    }

    // unstick: pushing hard but not moving -> back out with a twist
    if (this.unstickT > 0) {
      this.unstickT -= dt;
      throttle = -0.85;
      turn = this.unstickTurn;
    } else if (Math.abs(throttle) > 0.4 && t.body.velocity.length() < 0.5) {
      this.stuckT += dt;
      if (this.stuckT > 2.2) {
        this.stuckT = 0;
        this.unstickT = 1.6;
        this.unstickTurn = Math.random() > 0.5 ? 1 : -1;
      }
    } else {
      this.stuckT = Math.max(0, this.stuckT - dt);
    }

    t.throttle = throttle;
    t.turn = turn;
    t.applyControls(fixedDt);

    // --- aiming: lead the player ---
    if (player.alive && this.hasLOS) {
      const tof = dist / SHELL.enemySpeed;
      this.aimGoal.set(
        pp.x + player.body.velocity.x * tof,
        pp.y + 0.6,
        pp.z + player.body.velocity.z * tof,
      );
      // (ballistic drop is zeroed out inside Tank.updateTurret)
      // inaccuracy
      this.aimGoal.x += (Math.random() - 0.5) * this.aimNoise * dist * 2;
      this.aimGoal.z += (Math.random() - 0.5) * this.aimNoise * dist * 2;
      t.setAim(this.aimGoal);

      if (this.reloadT <= 0 && t.aimAlignment(this.aimGoal) > 0.9985) {
        this.reloadT = this.reload;
        return t.fire();
      }
    } else {
      // idle scan
      _v1.set(t.pos.x + fwd.x * 40, t.pos.y, t.pos.z + fwd.z * 40);
      t.setAim(_v1);
    }
    return null;
  }
}

// ---------------------------------------------------------------------
export class WaveManager {
  constructor() {
    this.wave = 0;
    this.enemies = [];
    this.banner = null;
  }

  waveSpec(w) {
    // armor on EVERY wave — targets are bonus objectives, never the gate
    const tanks = [];
    const n = Math.min(6, w === 1 ? 1 : 1 + Math.floor(w / 2)); // 1,2,2,3,3,4…
    for (let i = 0; i < n; i++) {
      if (w >= 6 && i % 3 === 2) tanks.push('heavy');
      else if (i % 2 === 1 || w <= 2) tanks.push('scout');
      else tanks.push('standard');
    }
    return {
      targets: Math.max(2, 5 - (w >> 1)),
      barrels: Math.min(9, 3 + w),
      walls: w >= 2 ? Math.min(3, 1 + (w >> 1)) : 0,
      pillboxes: w >= 4 ? Math.min(2, 1 + Math.floor((w - 4) / 3)) : 0,
      tanks,
    };
  }

  // off-wave reinforcement when the field has gone quiet
  spawnPatrol(scene, world, playerPos, wave) {
    const n = wave >= 4 ? 2 : 1;
    const a = Math.random() * Math.PI * 2;
    const spawned = [];
    for (let i = 0; i < n; i++) {
      let x = playerPos.x + Math.cos(a + i * 0.4) * 115;
      let z = playerPos.z + Math.sin(a + i * 0.4) * 115;
      const rr = Math.hypot(x, z);
      if (rr > PLAY_RADIUS - 30) { x *= (PLAY_RADIUS - 30) / rr; z *= (PLAY_RADIUS - 30) / rr; }
      const e = new EnemyTank(scene, world, x, z, wave, 'scout');
      this.enemies.push(e);
      spawned.push(e);
    }
    return spawned;
  }

  spawnWave(w, props, scene, world, playerPos) {
    const spec = this.waveSpec(w);
    const minR = 40, maxR = 95 + Math.min(60, w * 8);
    for (let i = 0; i < spec.targets; i++) {
      const s = props.ringSpot(minR, maxR);
      props.spawnTarget(s.x, s.z);
    }
    for (let i = 0; i < spec.barrels; i++) {
      const s = props.ringSpot(minR * 0.7, maxR);
      props.spawnBarrel(s.x, s.z);
    }
    for (let i = 0; i < spec.walls; i++) {
      const s = props.ringSpot(minR + 15, maxR);
      props.spawnWall(s.x, s.z);
    }
    for (let i = 0; i < spec.pillboxes; i++) {
      const s = props.ringSpot(70, maxR + 20);
      props.spawnPillbox(s.x, s.z);
    }
    for (const typeName of spec.tanks) {
      // spawn well away from the player, outside their view if possible
      let x = 0, z = 0;
      for (let tries = 0; tries < 12; tries++) {
        const a = Math.random() * Math.PI * 2;
        const r = 110 + Math.random() * 70;
        x = playerPos.x + Math.cos(a) * r;
        z = playerPos.z + Math.sin(a) * r;
        if (Math.hypot(x, z) < PLAY_RADIUS - 30) break;
      }
      const rr = Math.hypot(x, z);
      if (rr > PLAY_RADIUS - 30) {
        x *= (PLAY_RADIUS - 30) / rr;
        z *= (PLAY_RADIUS - 30) / rr;
      }
      this.enemies.push(new EnemyTank(scene, world, x, z, w, typeName));
    }
    return spec;
  }

  // static gun emplacements: slew toward the player, fire on LOS
  updatePillboxes(dt, player, world, props, losResult) {
    const shots = [];
    if (!player?.alive) return shots;
    const pp = player.body.position;
    for (const it of props.items) {
      if (!it.alive || it.kind !== 'pillbox') continue;
      it.reloadT -= dt;
      const bp = it.body.position;
      const dx = pp.x - bp.x, dz = pp.z - bp.z;
      const dist = Math.hypot(dx, dz);
      if (dist > PILLBOX.range) continue;
      // slew the gun
      const want = Math.atan2(dx, dz);
      let d = want - it.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      const step = 1.5 * dt;
      it.yaw += THREE.MathUtils.clamp(d, -step, step);
      it.pivot.rotation.y = it.yaw;
      if (Math.abs(d) > 0.04 || it.reloadT > 0) continue;
      // LOS check
      _from.set(bp.x, bp.y + 0.4, bp.z);
      _to.set(pp.x, pp.y + 0.6, pp.z);
      losResult.reset();
      world.raycastClosest(_from, _to, { collisionFilterMask: ~CG.PROP, skipBackfaces: true }, losResult);
      if (!losResult.hasHit || losResult.body !== player.body) continue;
      it.reloadT = PILLBOX.reload;
      it.mesh.updateMatrixWorld(true);
      const origin = new THREE.Vector3();
      it.muzzle.getWorldPosition(origin);
      const dir = new THREE.Vector3(pp.x - origin.x, pp.y + 0.6 - origin.y, pp.z - origin.z).normalize();
      dir.x += (Math.random() - 0.5) * PILLBOX.aimNoise;
      dir.y += (Math.random() - 0.5) * PILLBOX.aimNoise * 0.5 + 0.012 * dist / 60;
      dir.z += (Math.random() - 0.5) * PILLBOX.aimNoise;
      dir.normalize();
      shots.push({ origin, dir, owner: { isPlayer: false, shellDmg: PILLBOX.shellDamage } });
    }
    return shots;
  }

  aliveEnemies() { return this.enemies.filter(e => e.tank.alive); }

  // ---- bonus convoy: unarmed fast trucks crossing the battlefield ----
  spawnConvoy(scene, world, playerPos) {
    this.trucks = this.trucks || [];
    const a = Math.random() * Math.PI * 2;
    const perp = a + Math.PI / 2;
    const cx = playerPos.x + Math.cos(perp) * (40 + Math.random() * 30);
    const cz = playerPos.z + Math.sin(perp) * (40 + Math.random() * 30);
    const dirX = Math.cos(a), dirZ = Math.sin(a);
    for (let i = 0; i < 3; i++) {
      const sx = cx - dirX * (120 + i * 14);
      const sz = cz - dirZ * (120 + i * 14);
      const grp = new THREE.Group();
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x70695a, roughness: 0.85 });
      const tiltMat = new THREE.MeshStandardMaterial({ color: 0x4f5a43, roughness: 0.95 });
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.2), cabMat);
      cab.position.set(0, 1.15, 1.45);
      grp.add(cab);
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 2.6), cabMat);
      bed.position.set(0, 0.9, -0.5);
      grp.add(bed);
      const tilt = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.85, 2.5), tiltMat);
      tilt.position.set(0, 1.55, -0.5);
      grp.add(tilt);
      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 10);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.95 });
      for (const [wx, wz] of [[-0.75, 1.4], [0.75, 1.4], [-0.75, -0.2], [0.75, -0.2], [-0.75, -1.3], [0.75, -1.3]]) {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.4, wz);
        grp.add(w);
      }
      grp.traverse(o => { if (o.isMesh) o.castShadow = true; });
      scene.add(grp);
      const body = new CANNON.Body({
        mass: 320,
        position: new CANNON.Vec3(sx, getHeight(sx, sz) + 1.6, sz),
        shape: new CANNON.Box(new CANNON.Vec3(0.85, 0.9, 2.1)),
        collisionFilterGroup: CG.ENEMY,
        collisionFilterMask: -1,
        linearDamping: 0.05,
        angularDamping: 0.9,
      });
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.atan2(dirX, dirZ));
      world.addBody(body);
      const truck = { mesh: grp, body, dirX, dirZ, alive: true, age: 0 };
      body.userData = { kind: 'truck', truck };
      this.trucks.push(truck);
    }
    return this.trucks;
  }

  stepTrucks(dt, scene, world) {
    if (!this.trucks) return;
    for (let i = this.trucks.length - 1; i >= 0; i--) {
      const t = this.trucks[i];
      t.age += dt;
      if (t.alive) {
        // kinematic-style drive: hold course at convoy speed
        t.body.velocity.x = t.dirX * 13;
        t.body.velocity.z = t.dirZ * 13;
        t.body.angularVelocity.set(0, 0, 0);
        t.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.atan2(t.dirX, t.dirZ));
        t.mesh.position.copy(t.body.position);
        t.mesh.position.y -= 1.0;
        t.mesh.quaternion.copy(t.body.quaternion);
      }
      if (t.age > 28 || (!t.alive && t.age > 3)) {
        scene.remove(t.mesh);
        world.removeBody(t.body);
        this.trucks.splice(i, 1);
      }
    }
  }

  clearConvoy(scene, world) {
    if (!this.trucks) return;
    for (const t of this.trucks) { scene.remove(t.mesh); world.removeBody(t.body); }
    this.trucks.length = 0;
  }

  cleanup(scene, world, effects) {
    // tick dead tanks, remove after burn-out
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.tank.alive) continue;
      e.deadTimer += 1 / 60;
      if (e.deadTimer < 6 && Math.random() < 0.3) {
        effects.burningWreck(e.tank.visual.root.position);
      }
      if (e.deadTimer > 25) {
        e.tank.removeFromWorld();
        this.enemies.splice(i, 1);
      }
    }
  }

  reset() {
    this.wave = 0;
    for (const e of this.enemies) e.tank.removeFromWorld();
    this.enemies.length = 0;
  }
}
