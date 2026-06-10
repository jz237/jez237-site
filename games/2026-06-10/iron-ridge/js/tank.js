// Tank: detailed code-built mesh (hull, turret, elevating barrel, tracks,
// road wheels) on a cannon-es RaycastVehicle with skid-steer controls.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TANK, SHELL, CG } from './config.js';
import { getHeight } from './terrain.js';

const _conn = new CANNON.Vec3();
const _connW = new CANNON.Vec3();
const _pv = new CANNON.Vec3();
const _f = new CANNON.Vec3();
const _rel = new CANNON.Vec3();
const UP = new CANNON.Vec3(0, 1, 0);
const _v3a = new THREE.Vector3();
const _v3b = new THREE.Vector3();

function trackTexture() {
  const cv = document.createElement('canvas');
  cv.width = 32; cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#2c2c2e'; ctx.fillRect(0, 0, 32, 64);
  ctx.fillStyle = '#1c1c1e'; ctx.fillRect(0, 4, 32, 10);
  ctx.fillStyle = '#3a3a3d'; ctx.fillRect(0, 18, 32, 4);
  ctx.fillStyle = '#1c1c1e'; ctx.fillRect(0, 36, 32, 10);
  ctx.fillStyle = '#3a3a3d'; ctx.fillRect(0, 50, 32, 4);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 5);
  return tex;
}

const SCHEMES = {
  olive: { hull: 0x5b6b3f, accent: 0x4c5a34, dark: 0x39432a, barrel: 0x465233, mark: '★' },
  desert: { hull: 0x9a8a64, accent: 0x877754, dark: 0x655a40, barrel: 0x7d6f4f, mark: '◆' },
  scout: { hull: 0x77816b, accent: 0x636e58, dark: 0x474f40, barrel: 0x59624e, mark: '▲' },
  heavy: { hull: 0x6a5d45, accent: 0x564b38, dark: 0x3d352a, barrel: 0x4d4334, mark: '☠' },
};

function markingTexture(mark, tint) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = tint;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mark, 32, 36);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildTankMesh(scheme = 'olive') {
  const colors = SCHEMES[scheme] ?? SCHEMES.olive;

  const hullMat = new THREE.MeshStandardMaterial({ color: colors.hull, roughness: 0.72, metalness: 0.18 });
  const accentMat = new THREE.MeshStandardMaterial({ color: colors.accent, roughness: 0.78, metalness: 0.15 });
  const darkMat = new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.85, metalness: 0.1 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: colors.barrel, roughness: 0.6, metalness: 0.35 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.95 });
  const trackMat = new THREE.MeshStandardMaterial({ map: trackTexture(), roughness: 0.95, metalness: 0.05 });

  const root = new THREE.Group();

  // ---- hull ----
  const hull = new THREE.Group();
  root.add(hull);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.62, 4.4), hullMat);
  lower.position.y = 0.62;
  hull.add(lower);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.42, 3.6), hullMat);
  upper.position.set(0, 1.12, -0.1);
  hull.add(upper);
  // sloped glacis plate
  const glacis = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.14, 1.45), accentMat);
  glacis.position.set(0, 1.05, 1.95);
  glacis.rotation.x = -0.62;
  hull.add(glacis);
  // rear plate + exhausts
  const rear = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 0.3), accentMat);
  rear.position.set(0, 0.85, -2.22);
  rear.rotation.x = 0.35;
  hull.add(rear);
  for (const sx of [-0.7, 0.7]) {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 6), darkMat);
    ex.position.set(sx, 1.18, -2.05);
    ex.rotation.x = 1.1;
    hull.add(ex);
  }
  // fenders + stowage
  for (const sx of [-1.31, 1.31]) {
    const fender = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 4.3), accentMat);
    fender.position.set(sx, 1.0, 0);
    hull.add(fender);
  }
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.9), darkMat);
  crate.position.set(-0.9, 1.42, -1.25);
  hull.add(crate);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.8, 8), darkMat);
  drum.position.set(0.9, 1.42, -1.3);
  drum.rotation.z = Math.PI / 2;
  drum.rotation.y = Math.PI / 2;
  hull.add(drum);
  // headlights
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xfff7d0, emissive: 0x55502c, roughness: 0.3 });
  for (const sx of [-0.95, 0.95]) {
    const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.1, 8), lightMat);
    hl.rotation.x = Math.PI / 2 - 0.55;
    hl.position.set(sx, 1.28, 2.06);
    hull.add(hl);
  }
  // tow hooks + spare track links on the glacis
  for (const sx of [-0.7, 0.7]) {
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.26), darkMat);
    hook.position.set(sx, 0.62, 2.28);
    hull.add(hook);
  }
  const spare = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.34), darkMat);
  spare.position.set(0, 1.22, 1.62);
  spare.rotation.x = -0.62;
  hull.add(spare);
  // shovel/tools on the left fender
  const tool = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 1.5), darkMat);
  tool.position.set(-1.31, 1.06, 0.5);
  hull.add(tool);
  // mud flaps
  for (const sx of [-1.31, 1.31]) {
    for (const zz of [2.2, -2.2]) {
      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.05), accentMat);
      flap.position.set(sx, 0.78, zz);
      hull.add(flap);
    }
  }

  // ---- tracks & wheels ----
  const wheels = [];
  for (const side of [-1, 1]) {
    const sx = side * 1.06;
    const run = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 4.5), trackMat);
    run.position.set(sx, 0.42, 0);
    hull.add(run);
    for (let i = 0; i < 5; i++) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.36, 12), rubberMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(sx + side * 0.09, 0.36, 1.6 - i * 0.8);
      hull.add(w);
      wheels.push(w);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8), accentMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.copy(w.position);
      hull.add(cap);
      wheels.push(cap);
    }
    for (const zz of [2.05, -2.05]) {
      const spr = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.34, 10), darkMat);
      spr.rotation.z = Math.PI / 2;
      spr.position.set(sx, 0.52, zz);
      hull.add(spr);
      wheels.push(spr);
    }
  }

  // ---- turret ----
  const turret = new THREE.Group();
  turret.position.set(0, 1.34, 0.25);
  root.add(turret);
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.18, 0.55, 12), hullMat);
  tBase.position.y = 0.26;
  turret.add(tBase);
  const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.95, 0.34, 12), accentMat);
  tTop.position.y = 0.7;
  turret.add(tTop);
  const bustle = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.45, 0.9), accentMat);
  bustle.position.set(0, 0.38, -0.95);
  turret.add(bustle);
  const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.12, 10), darkMat);
  hatch.position.set(-0.3, 0.92, -0.15);
  turret.add(hatch);
  const mg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 6), darkMat);
  mg.position.set(0.34, 0.98, 0.1);
  mg.rotation.x = Math.PI / 2 - 0.15;
  turret.add(mg);
  // antenna
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 1.4, 4), darkMat);
  ant.position.set(0.55, 1.3, -1.1);
  ant.rotation.z = 0.12;
  turret.add(ant);
  // periscopes + turret side markings
  for (const sx of [-0.18, 0.18]) {
    const peri = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.18), darkMat);
    peri.position.set(sx, 0.92, 0.32);
    turret.add(peri);
  }
  const markTex = markingTexture(colors.mark, '#e8e2cf');
  const markMat = new THREE.MeshBasicMaterial({ map: markTex, transparent: true, polygonOffset: true, polygonOffsetFactor: -1 });
  for (const side of [-1, 1]) {
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), markMat);
    mark.position.set(side * 0.93, 0.32, -0.2);
    mark.rotation.y = side * Math.PI / 2;
    mark.rotation.z = side > 0 ? 0 : Math.PI;
    turret.add(mark);
  }
  // bustle stowage rack
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.5), darkMat);
  rack.position.set(0, 0.62, -1.42);
  turret.add(rack);
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.0, 7), accentMat);
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0, 0.76, -1.42);
  turret.add(roll);

  // ---- elevating barrel assembly ----
  const pivot = new THREE.Group();        // pitch pivot
  pivot.position.set(0, 0.42, 0.55);
  turret.add(pivot);
  const mantlet = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.45), darkMat);
  mantlet.position.z = 0.1;
  pivot.add(mantlet);
  const recoilGrp = new THREE.Group();    // slides back on fire
  pivot.add(recoilGrp);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 3.3, 10), barrelMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 1.85;
  recoilGrp.add(barrel);
  const brake = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.42, 10), darkMat);
  brake.rotation.x = Math.PI / 2;
  brake.position.z = 3.4;
  recoilGrp.add(brake);
  const muzzle = new THREE.Object3D();
  muzzle.position.z = 3.65;
  recoilGrp.add(muzzle);

  root.traverse(o => { if (o.isMesh) { o.castShadow = true; } });

  return { root, hull, turret, pivot, recoilGrp, muzzle, wheels, trackMats: [trackMat] };
}

export class Tank {
  constructor(scene, world, opts = {}) {
    this.scene = scene;
    this.world = world;
    this.isPlayer = !!opts.isPlayer;
    this.hp = opts.hp ?? TANK.hp;
    this.maxHp = this.hp;
    this.alive = true;
    const sc = opts.scale ?? 1;
    this.scale = sc;
    // per-variant performance tuning (scouts are nimble, heavies ponderous)
    this.tuning = {
      maxSpeed: opts.maxSpeed ?? TANK.maxSpeed,
      engineForce: opts.engineForce ?? TANK.engineForce,
      maxYawRate: opts.maxYawRate ?? TANK.maxYawRate,
    };
    this.visual = buildTankMesh(opts.scheme ?? (this.isPlayer ? 'olive' : 'desert'));
    this.visual.root.scale.setScalar(sc);
    scene.add(this.visual.root);

    // physics chassis — shape offset up so the centre of mass sits low
    const half = TANK.chassisHalf;
    const body = new CANNON.Body({
      mass: TANK.mass * sc * sc,
      position: new CANNON.Vec3(opts.x ?? 0, (opts.y ?? 2) + 0.7, opts.z ?? 0),
      collisionFilterGroup: this.isPlayer ? CG.PLAYER : CG.ENEMY,
      collisionFilterMask: -1,
      angularDamping: 0.65,
      linearDamping: 0.08,
    });
    body.addShape(
      new CANNON.Box(new CANNON.Vec3(half.x * sc, half.y * sc, half.z * sc)),
      new CANNON.Vec3(0, 0.55 * sc, 0),
    );
    body.allowSleep = false;
    body.userData = { kind: 'tank', tank: this };
    this.body = body;

    // custom track suspension: spring/damper at each corner against the
    // analytic terrain (cannon's RaycastVehicle fights tracked vehicles —
    // its lateral wheel constraints cancel skid-steer entirely)
    this.suspension = [
      { x: -1.05 * sc, z: 1.65 * sc }, { x: 1.05 * sc, z: 1.65 * sc },
      { x: -1.05 * sc, z: -1.65 * sc }, { x: 1.05 * sc, z: -1.65 * sc },
    ].map(p => ({ ...p, contact: false, comp: 0 }));
    this.contacts = 0;
    world.addBody(body);

    // interpolation buffers
    this.prevPos = new CANNON.Vec3().copy(body.position);
    this.prevQuat = new CANNON.Quaternion().copy(body.quaternion);

    // turret state (relative yaw to hull, world-space goal set by aim)
    this.turretYaw = 0;
    this.barrelPitch = 0;
    this.aimPoint = new THREE.Vector3(0, 0, 100);

    // gun state
    this.shellSpeed = opts.shellSpeed ?? SHELL.speed;
    this.rack = SHELL.rackSize;
    this.chamber = 1;          // 0..1 ready
    this.restocking = 0;       // >0 while refilling rack
    this.recoil = 0;

    this.throttle = 0;
    this.turn = 0;
    this.trackScroll = 0;
    this.smokeTimer = 0;
    this.lowHpSmoke = 0;
    this.overturned = 0;
  }

  get pos() { return this.body.position; }

  speedAlongForward() {
    const fwd = this.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
    return this.body.velocity.dot(fwd);
  }

  // called every fixed step BEFORE world.step
  applyControls(dt) {
    const body = this.body;
    const q = body.quaternion;
    const up = q.vmult(UP);

    // ---- suspension: spring/damper per corner vs analytic terrain ----
    const sc = this.scale, sc2 = sc * sc;
    let contacts = 0;
    for (const w of this.suspension) {
      _conn.set(w.x, 0.1 * sc, w.z);
      body.pointToWorldFrame(_conn, _connW);
      const groundY = getHeight(_connW.x, _connW.z);
      const comp = (TANK.suspensionRest + TANK.wheelRadius) * sc - (_connW.y - groundY);
      w.contact = comp > 0 && up.y > 0.25;
      w.comp = Math.max(0, comp);
      if (!w.contact) continue;
      contacts++;
      body.getVelocityAtWorldPoint(_connW, _pv);
      let F = TANK.suspK * sc2 * Math.min(comp, 0.45) - TANK.suspC * sc2 * _pv.y;
      if (F < 0) F = 0;
      if (F > 6200 * sc2) F = 6200 * sc2; // ~3.5x static share — soaks impacts without launching
      _f.set(0, F, 0);
      _connW.vsub(body.position, _rel); // applyForce wants a COM-relative point
      body.applyForce(_f, _rel);
    }
    this.contacts = contacts;
    const traction = contacts / 4;

    if (this.alive && traction > 0) {
      const speed = this.speedAlongForward();
      // flattened forward axis (slope-projected drive direction)
      const fwd = q.vmult(new CANNON.Vec3(0, 0, 1));
      fwd.y = 0;
      if (fwd.length() > 0.01) {
        fwd.normalize();
        let force = 0;
        if (this.throttle > 0.01) {
          force = speed < this.tuning.maxSpeed ? this.tuning.engineForce * sc2 * this.throttle : 0;
        } else if (this.throttle < -0.01) {
          force = speed > -TANK.maxReverse ? -TANK.reverseForce * sc2 * -this.throttle : 0;
        } else {
          // tracks resist rolling when coasting
          force = -THREE.MathUtils.clamp(speed * TANK.rollResist * sc2, -2800 * sc2, 2800 * sc2);
        }
        _f.set(fwd.x * force * traction, 0, fwd.z * force * traction);
        body.applyForce(_f);

        // lateral track grip (kills sideways sliding)
        const right = q.vmult(new CANNON.Vec3(1, 0, 0));
        right.y = 0;
        right.normalize();
        const latV = body.velocity.dot(right);
        const grip = THREE.MathUtils.clamp(-latV * TANK.latGrip * sc2, -TANK.latGripMax * sc2, TANK.latGripMax * sc2);
        _f.set(right.x * grip * traction, 0, right.z * grip * traction);
        body.applyForce(_f);
      }

      // commanded yaw rate — how tracked steering actually behaves
      const dir = speed < -0.5 ? -1 : 1;
      if (Math.abs(this.turn) > 0.01) {
        const targetRate = -this.turn * dir * this.tuning.maxYawRate * traction;
        body.angularVelocity.y += (targetRate - body.angularVelocity.y) * Math.min(1, dt * 10);
      } else {
        body.angularVelocity.y *= 1 - Math.min(1, dt * 6);
      }
    }

    if (!this.alive) {
      // dead tank: brake to a stop
      body.velocity.x *= 1 - Math.min(1, dt * 2);
      body.velocity.z *= 1 - Math.min(1, dt * 2);
      return;
    }

    // self-right when overturned (real tanks have recovery crews; we don't)
    if (up.y < 0.35) this.overturned += dt;
    else this.overturned = Math.max(0, this.overturned - dt * 2);
    if (this.overturned > 1.8) {
      const fwd2 = this.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
      const yaw = Math.atan2(fwd2.x, fwd2.z);
      const upright = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
      this.body.quaternion.slerp(upright, 4 * dt, this.body.quaternion);
      this.body.position.y += 1.5 * dt;
      this.body.angularVelocity.scale(0.85, this.body.angularVelocity);
      this.body.velocity.scale(0.92, this.body.velocity);
      if (up.y > 0.92) this.overturned = 0;
    }

    // gun timers
    if (this.restocking > 0) {
      this.restocking -= dt;
      if (this.restocking <= 0) { this.rack = SHELL.rackSize; this.chamber = 1; }
    } else if (this.chamber < 1) {
      this.chamber = Math.min(1, this.chamber + dt / SHELL.chamberTime);
    }
    this.recoil = Math.max(0, this.recoil - dt * 3.2);
  }

  canFire() {
    return this.alive && this.rack > 0 && this.chamber >= 1 && this.restocking <= 0;
  }

  // returns {origin, dir} muzzle ray or null
  fire() {
    if (!this.canFire()) return null;
    this.rack--;
    this.chamber = 0;
    if (this.rack <= 0) this.restocking = SHELL.restockTime;
    this.recoil = 1;

    this.visual.root.updateMatrixWorld(true);
    const origin = new THREE.Vector3();
    this.visual.muzzle.getWorldPosition(origin);
    const back = new THREE.Vector3();
    this.visual.pivot.getWorldPosition(back);
    const dir = origin.clone().sub(back).normalize();

    // physical recoil shove (slightly above COM for a nose-lift kick)
    const imp = dir.clone().multiplyScalar(-this.body.mass * 1.45);
    this.body.applyImpulse(
      new CANNON.Vec3(imp.x, imp.y * 0.3, imp.z),
      new CANNON.Vec3(0, 0.9, 0),
    );
    return { origin, dir };
  }

  reloadNow() {
    if (this.restocking > 0 || this.rack >= SHELL.rackSize) return false;
    this.restocking = SHELL.restockTime * (1 - this.rack / SHELL.rackSize) + 1.2;
    this.rack = 0;
    return true;
  }

  setAim(point) { this.aimPoint.copy(point); }

  // turret slew toward aim point. Ballistic zeroing happens in world space
  // (gravity is vertical), then the virtual target is transformed into the
  // hull's local frame so slopes/hull tilt never throw the gun off.
  updateTurret(dt) {
    const root = this.visual.root;
    root.updateMatrixWorld(true);
    const pivotW = _v3a.setFromMatrixPosition(this.visual.pivot.matrixWorld);

    const dx = this.aimPoint.x - pivotW.x;
    const dz = this.aimPoint.z - pivotW.z;
    const flat = Math.hypot(dx, dz);
    const dy = this.aimPoint.y - pivotW.y;

    // exact low-arc launch elevation through the aim point
    const v2 = this.shellSpeed * this.shellSpeed;
    const g = 9.81;
    const disc = v2 * v2 - g * (g * flat * flat + 2 * dy * v2);
    let aimAngle;
    if (disc > 0 && flat > 1) {
      aimAngle = Math.atan((v2 - Math.sqrt(disc)) / (g * flat));
    } else {
      const tof = flat / this.shellSpeed;
      aimAngle = Math.atan2(dy + 0.5 * g * tof * tof, Math.max(flat, 1));
    }

    // virtual target sitting on that elevation line, in hull-local space
    _v3b.set(this.aimPoint.x, pivotW.y + Math.tan(aimAngle) * flat, this.aimPoint.z);
    root.worldToLocal(_v3b);
    _v3b.sub(this.visual.turret.position); // relative to turret ring

    const desired = Math.atan2(_v3b.x, _v3b.z);
    let delta = desired - this.turretYaw;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    const maxStep = TANK.turretSlewRate * dt;
    this.turretYaw += THREE.MathUtils.clamp(delta, -maxStep, maxStep);
    this.turretYaw = Math.atan2(Math.sin(this.turretYaw), Math.cos(this.turretYaw));

    const flatLocal = Math.hypot(_v3b.x, _v3b.z);
    const pitchDes = THREE.MathUtils.clamp(
      -Math.atan2(_v3b.y - this.visual.pivot.position.y, flatLocal),
      TANK.barrelMinPitch, TANK.barrelMaxPitch,
    );
    this.barrelPitch = THREE.MathUtils.damp(this.barrelPitch, pitchDes, 9, dt);

    this.visual.turret.rotation.y = this.turretYaw;
    this.visual.pivot.rotation.x = this.barrelPitch;
    this.visual.recoilGrp.position.z = -this.recoil * 0.34;
  }

  visualYaw() {
    const e = new THREE.Euler().setFromQuaternion(this.visual.root.quaternion, 'YXZ');
    return e.y;
  }

  // ratio 0..1 of how closely the barrel points at `point`
  aimAlignment(point) {
    this.visual.root.updateMatrixWorld(true);
    const origin = new THREE.Vector3();
    this.visual.muzzle.getWorldPosition(origin);
    const back = new THREE.Vector3();
    this.visual.pivot.getWorldPosition(back);
    const dir = origin.sub(back).normalize();
    const want = new THREE.Vector3().subVectors(point, back).normalize();
    return dir.dot(want);
  }

  savePrev() {
    this.prevPos.copy(this.body.position);
    this.prevQuat.copy(this.body.quaternion);
  }

  syncVisual(alpha, dt) {
    const r = this.visual.root;
    r.position.set(
      this.prevPos.x + (this.body.position.x - this.prevPos.x) * alpha,
      this.prevPos.y + (this.body.position.y - this.prevPos.y) * alpha,
      this.prevPos.z + (this.body.position.z - this.prevPos.z) * alpha,
    );
    const q = this.prevQuat;
    const b = this.body.quaternion;
    r.quaternion.set(
      q.x + (b.x - q.x) * alpha,
      q.y + (b.y - q.y) * alpha,
      q.z + (b.z - q.z) * alpha,
      q.w + (b.w - q.w) * alpha,
    ).normalize();
    // visual origin sits at ground level; wheel contact rest point is
    // connection.y - restLength - radius below the body origin
    r.position.y -= ((0.52 + TANK.wheelRadius - 0.1) - 0.1) * this.scale;

    // wheels spin / track scroll
    const speed = this.speedAlongForward();
    this.trackScroll += speed * dt * 0.8;
    for (const m of this.visual.trackMats) m.map.offset.y = this.trackScroll % 1;
    for (const w of this.visual.wheels) w.rotation.x += speed * dt * 2.4;

    this.updateTurret(dt);
  }

  damage(amount) {
    if (!this.alive) return false;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      return true; // killed
    }
    return false;
  }

  destroyVisual() {
    // charred wreck: darken everything
    this.visual.root.traverse(o => {
      if (o.isMesh && o.material && !o.userData.charred) {
        o.userData.charred = true;
        o.material = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 1 });
      }
    });
  }

  removeFromWorld() {
    this.scene.remove(this.visual.root);
    this.world.removeBody(this.body);
  }
}
