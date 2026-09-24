// Enemy AI tanks (seek, keep range, line-of-sight, lead shots) and the
// wave manager that phases from static targets to armoured opposition.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Tank } from './tank.js?v=polish2';
import { getHeight, raycastTerrain } from './terrain.js?v=polish2';
import { ENEMY, ENEMY_TYPES, PILLBOX, SHELL, CG, PLAY_RADIUS } from './config.js?v=polish2';

const WRECK_LIFE = 90; // seconds a burnt-out hull stays on the field
const WRECK_CAP = 7;   // most wrecks kept at once (newest win)

const _v1 = new THREE.Vector3();
const _from = new CANNON.Vec3();
const _to = new CANNON.Vec3();

let nextEnemyId = 1;

export class EnemyTank {
  constructor(scene, world, x, z, wave, typeName = 'standard') {
    this.id = String(nextEnemyId++); // stable id for co-op sync
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
      fixedGun: T.fixedGun,
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
    // Behaviour role. Scouts work round to your flank or rear, tank
    // destroyers snipe from range, some mediums/heavies use cover (hull-down
    // crests, wrecks), the rest duel in the open. The Colossus just comes.
    this.role = typeName === 'scout' ? 'flank'
      : typeName === 'destroyer' ? 'snipe'
      : typeName === 'boss' ? 'engage'
      : Math.random() < 0.55 ? 'cover' : 'engage';
    this.flankSide = Math.random() < 0.5 ? -1 : 1;
    this.coverPt = null;
    this.coverT = 0;
    this.coverShots = 0;
    this.retreatT = 0;
    this.scootT = 0;
    this.lastHp = this.tank.hp;
    this.smokeUsed = false;
    this.wantsSmoke = false;
  }

  // pick a firing position: a hull-down spot on the ring at preferred range
  // near our bearing, or the far side of a wreck
  findCover(pp, wrecks) {
    const t = this.tank, R = this.type.preferredRange;
    const bearing = Math.atan2(t.pos.x - pp.x, t.pos.z - pp.z);
    const eyeY = pp.y + 1.8;
    let best = null, bestScore = Infinity;
    const consider = (x, z, bonus) => {
      if (Math.hypot(x, z) > PLAY_RADIUS - 25) return;
      const gy = getHeight(x, z);
      const hull = raycastTerrain(pp.x, eyeY, pp.z, x, gy + 0.8, z);
      const turret = raycastTerrain(pp.x, eyeY, pp.z, x, gy + 2.6, z);
      let score = Math.hypot(x - t.pos.x, z - t.pos.z) - bonus;
      if (hull && !turret) score -= 60;      // hull-down: ideal
      else if (hull && turret) score += 40;  // blind: can't shoot from there
      if (score < bestScore) { bestScore = score; best = { x, z }; }
    };
    for (let k = 0; k < 9; k++) {
      const a = bearing + (k - 4) * 0.2, r = R * (0.8 + Math.random() * 0.4);
      consider(pp.x + Math.sin(a) * r, pp.z + Math.cos(a) * r, 0);
    }
    for (const w of wrecks || []) {
      const dx = w.x - pp.x, dz = w.z - pp.z, d = Math.hypot(dx, dz);
      if (d < 25 || d > R * 1.6) continue;
      const k = (d + 4.5) / d; // just behind the hulk, as seen from the player
      consider(pp.x + dx * k, pp.z + dz * k, 45);
    }
    return best;
  }

  losTo(playerBody, world) {
    const t = this.tank;
    _from.set(t.pos.x, t.pos.y + 1.8, t.pos.z);
    _to.set(playerBody.position.x, playerBody.position.y + 0.6, playerBody.position.z);
    if (this.smoke?.blocks(_from.x, _from.y, _from.z, _to.x, _to.y + 1.2, _to.z)) return false;
    this.losResult.reset();
    world.raycastClosest(_from, _to, {
      collisionFilterMask: ~CG.ENEMY,
      skipBackfaces: true,
    }, this.losResult);
    return this.losResult.hasHit && this.losResult.body === playerBody;
  }

  // returns shoot request {origin, dir} when it fires.
  // `targets` is either a single tank-like {alive, body} or an array of
  // them (co-op: host player + remote allies) — the nearest alive one wins.
  // ctx: { smoke, wrecks: [{x, z}] } — optional shared battlefield context
  think(dt, targets, world, fixedDt, ctx = {}) {
    const t = this.tank;
    this.smoke = ctx.smoke;
    if (!t.alive) {
      t.applyControls(fixedDt);
      return null;
    }

    let player = null;
    if (Array.isArray(targets)) {
      let best = Infinity;
      for (const cand of targets) {
        if (!cand?.alive) continue;
        const d = Math.hypot(cand.body.position.x - t.pos.x, cand.body.position.z - t.pos.z);
        if (d < best) { best = d; player = cand; }
      }
    } else {
      player = targets;
    }
    if (!player) player = { alive: false, body: t.body }; // idle: nothing to hunt

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
    const R = this.type.preferredRange;
    const hurt = t.hp < this.lastHp;
    this.lastHp = t.hp;
    if (hurt) { this.strafeDir *= -1; if (this.role === 'cover') this.coverT = 0; }
    // badly hurt: pop smoke once and back off behind it, front plate forward
    if (!this.smokeUsed && player.alive && t.hp < t.maxHp * 0.35 && this.typeName !== 'boss') {
      this.smokeUsed = true;
      this.wantsSmoke = true;
      this.retreatT = 5;
      this.coverPt = null;
    }
    const seek = () => {
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.6, -1, 1);
      throttle = Math.abs(d) < 0.5 ? 0.95 : Math.abs(d) < 1.2 ? 0.45 : 0.05;
    };
    const backOff = () => {
      const d = headTo(pp.x, pp.z);
      turn = THREE.MathUtils.clamp(-d * 1.2, -1, 1);
      throttle = -0.7;
    };
    const driveTo = (gx, gz) => {
      const d = headTo(gx, gz);
      turn = THREE.MathUtils.clamp(-d * 1.6, -1, 1);
      throttle = Math.abs(d) < 0.5 ? 0.95 : Math.abs(d) < 1.2 ? 0.5 : 0.08;
    };
    const orbit = () => {
      const lean = THREE.MathUtils.clamp((R - dist) * 0.025, -0.45, 0.45);
      const d = headTo(pp.x, pp.z) + this.strafeDir * (Math.PI / 2 + lean);
      const dn = Math.atan2(Math.sin(d), Math.cos(d));
      turn = THREE.MathUtils.clamp(-dn * 1.2, -1, 1);
      throttle = 0.4;
    };
    const engage = () => {
      if (!this.hasLOS || dist > R + 18) seek();
      else if (dist < this.type.minRange) backOff();
      else orbit();
    };

    if (!player.alive) {
      throttle = 0;
    } else if (this.retreatT > 0) {
      this.retreatT -= dt;
      backOff();
      throttle = -0.9;
    } else if (this.role === 'snipe') {
      // hold still and swing the whole hull onto the lead point
      if (!this.hasLOS || dist > R + 25) seek();
      else if (dist < this.type.minRange) backOff();
      else if (this.scootT > 0) { this.scootT -= dt; backOff(); throttle = -0.75; }
      else {
        const tof = dist / SHELL.enemySpeed;
        const d = headTo(pp.x + player.body.velocity.x * tof, pp.z + player.body.velocity.z * tof);
        turn = THREE.MathUtils.clamp(-d * 2.2, -1, 1);
        throttle = 0;
      }
    } else if (this.role === 'cover') {
      this.coverT -= dt;
      if (!this.coverPt || this.coverT <= 0) {
        this.coverPt = this.findCover(pp, ctx.wrecks);
        this.coverT = 7 + Math.random() * 4;
        this.coverShots = 0;
      }
      if (!this.coverPt || dist > R + 45) engage();
      else if (Math.hypot(this.coverPt.x - t.pos.x, this.coverPt.z - t.pos.z) > 3.5) driveTo(this.coverPt.x, this.coverPt.z);
      else {
        // in position: face the threat (front armour) and hold
        const d = headTo(pp.x, pp.z);
        turn = THREE.MathUtils.clamp(-d * 1.4, -1, 1);
        throttle = 0;
      }
    } else if (this.role === 'flank') {
      // work round to the target's side or rear before committing
      const q = player.body.quaternion;
      const fx = q ? 2 * (q.x * q.z + q.w * q.y) : 0, fz = q ? 1 - 2 * (q.x * q.x + q.y * q.y) : 1;
      const a = Math.atan2(-fx, -fz) + this.flankSide * 1.05;
      const gx = pp.x + Math.sin(a) * R * 0.85, gz = pp.z + Math.cos(a) * R * 0.85;
      const toGoal = Math.hypot(gx - t.pos.x, gz - t.pos.z);
      // how far round the target we are: 1 = directly behind it
      const behind = -((t.pos.x - pp.x) * fx + (t.pos.z - pp.z) * fz) / Math.max(1, dist);
      if (toGoal > 14 && behind < 0.35 && dist > 30) driveTo(gx, gz);
      else engage();
    } else {
      engage();
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
        // shoot and scoot: snipers reverse off the line, cover users move
        // on after a couple of shots so you can't pre-aim their spot
        if (this.role === 'snipe' && Math.random() < 0.45) this.scootT = 1.6;
        if (this.role === 'cover' && ++this.coverShots >= 2 + (Math.random() < 0.5 ? 1 : 0)) this.coverT = 0;
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
    const bossWave = w >= 5 && w % 5 === 0;
    // boss waves trade one escort slot for the Colossus
    const n = Math.max(1, Math.min(6, w === 1 ? 1 : 1 + Math.floor(w / 2)) - (bossWave ? 1 : 0));
    for (let i = 0; i < n; i++) {
      if (w >= 4 && ((i === 0 && w % 2 === 0) || (w >= 9 && i % 4 === 3))) tanks.push('destroyer');
      else if (w >= 6 && i % 3 === 2) tanks.push('heavy');
      else if (i % 2 === 1 || w <= 2) tanks.push('scout');
      else tanks.push('standard');
    }
    if (bossWave) tanks.push('boss');
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

  spawnWave(w, props, scene, world, playerPos, opts = {}) {
    const spec = this.waveSpec(w);
    // online rooms skip pillboxes: they aren't synced to clients, so they
    // must never gate a shared wave
    if (opts.noPillboxes) spec.pillboxes = 0;
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
  updatePillboxes(dt, player, world, props, losResult, smoke = null) {
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
      // LOS check (terrain/props, then any smoke screen)
      _from.set(bp.x, bp.y + 0.4, bp.z);
      _to.set(pp.x, pp.y + 0.6, pp.z);
      if (smoke?.blocks(_from.x, _from.y, _from.z, _to.x, _to.y + 1.2, _to.z)) continue;
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

  // random convoy course crossing near the player; broadcastable so co-op
  // clients can build an identical convoy
  static convoyLayout(playerPos) {
    const a = Math.random() * Math.PI * 2;
    const perp = a + Math.PI / 2;
    return {
      cx: playerPos.x + Math.cos(perp) * (40 + Math.random() * 30),
      cz: playerPos.z + Math.sin(perp) * (40 + Math.random() * 30),
      dirX: Math.cos(a),
      dirZ: Math.sin(a),
    };
  }

  // ---- bonus convoy: unarmed fast trucks crossing the battlefield ----
  spawnConvoy(scene, world, layout) {
    this.trucks = this.trucks || [];
    const { cx, cz, dirX, dirZ } = layout;
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
      const truck = { mesh: grp, body, dirX, dirZ, alive: true, age: 0, cid: i };
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

  cleanup(scene, world, effects, dt = 1 / 60) {
    // Wrecks burn, then smoulder on the field as cover and a record of the
    // fight. The oldest go first once more than WRECK_CAP are standing.
    let dead = 0;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.tank.alive) continue;
      dead++;
      e.deadTimer += dt;
      const pos = e.tank.visual.root.position;
      if (e.deadTimer < 6) {
        if (Math.random() < 0.3) effects.burningWreck(pos);
      } else {
        effects.wreckSmoke(pos, dt, e.deadTimer);
      }
      if (e.deadTimer > WRECK_LIFE || dead > WRECK_CAP) {
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
