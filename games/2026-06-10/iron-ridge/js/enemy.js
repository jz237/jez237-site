// Enemy AI tanks (seek, keep range, line-of-sight, lead shots) and the
// wave manager that phases from static targets to armoured opposition.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Tank } from './tank.js';
import { getHeight } from './terrain.js';
import { ENEMY, SHELL, CG, PLAY_RADIUS } from './config.js';

const _v1 = new THREE.Vector3();
const _from = new CANNON.Vec3();
const _to = new CANNON.Vec3();

export class EnemyTank {
  constructor(scene, world, x, z, wave) {
    this.tank = new Tank(scene, world, {
      x, z,
      y: getHeight(x, z) + 1.5,
      scheme: 'desert',
      hp: ENEMY.hp,
      isPlayer: false,
      shellSpeed: SHELL.enemySpeed,
    });
    this.wave = wave;
    this.state = 'seek';
    this.thinkTimer = Math.random() * 0.4;
    this.reload = ENEMY.reloadBase * (0.85 + Math.random() * 0.3);
    this.reloadT = this.reload * (0.4 + Math.random() * 0.6);
    this.aimNoise = Math.max(0.012, ENEMY.aimNoiseBase - wave * 0.005);
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
    } else if (!this.hasLOS || dist > ENEMY.preferredRange + 18) {
      // close in — pivot first, advance once roughly aligned
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.6, -1, 1);
      throttle = Math.abs(d) < 0.5 ? 0.95 : Math.abs(d) < 1.2 ? 0.45 : 0.05;
    } else if (dist < ENEMY.minRange) {
      // back off, keep gun on target
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.2, -1, 1);
      throttle = -0.7;
    } else {
      // hold range: orbit tangentially, leaning in/out to fix range error
      const lean = THREE.MathUtils.clamp((ENEMY.preferredRange - dist) * 0.025, -0.45, 0.45);
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
    return {
      targets: w <= 2 ? 4 + w * 2 : Math.max(2, 6 - w),
      barrels: Math.min(8, 2 + w),
      walls: w >= 2 ? Math.min(3, 1 + (w >> 1)) : 0,
      tanks: w < 3 ? 0 : Math.min(ENEMY.maxCount, 1 + Math.floor((w - 3) / 2)),
    };
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
    const spawned = [];
    for (let i = 0; i < spec.tanks; i++) {
      // spawn well away from the player, outside their view if possible
      let x = 0, z = 0;
      for (let tries = 0; tries < 12; tries++) {
        const a = Math.random() * Math.PI * 2;
        const r = 120 + Math.random() * 70;
        x = playerPos.x + Math.cos(a) * r;
        z = playerPos.z + Math.sin(a) * r;
        if (Math.hypot(x, z) < PLAY_RADIUS - 30) break;
      }
      const rr = Math.hypot(x, z);
      if (rr > PLAY_RADIUS - 30) {
        x *= (PLAY_RADIUS - 30) / rr;
        z *= (PLAY_RADIUS - 30) / rr;
      }
      const e = new EnemyTank(scene, world, x, z, w);
      this.enemies.push(e);
      spawned.push(e);
    }
    return spec;
  }

  aliveEnemies() { return this.enemies.filter(e => e.tank.alive); }

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
