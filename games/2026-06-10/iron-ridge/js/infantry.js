// Ground infantry: skinned, procedurally animated riflemen and anti-tank
// rocket teams (soldier-model.js draws the whole squad in one call). They
// fight like infantry: bound forward in short rushes, sprint for trees,
// rocks and wrecks and fight from behind them (peek, fire, duck back), kneel
// or go prone to shoot, flinch and hit the dirt when shells land or MG
// rounds crack past, and dive out of the way of a charging tank. They die
// with weight: knees buckle when shot, blasts throw them, and bodies stay on
// the field for a while before sinking away.

import * as THREE from 'three';
import { getHeight } from './terrain.js?v=real2';
import { INFANTRY } from './config.js?v=real2';
import { SoldierCrowd, SoldierRig, B, ANG, JOINTS, RIFLE_GRIP, RIFLE_GUARD, RIFLE_MUZZLE, TUBE_GUARD, TUBE_MUZZLE, TUBE_REAR } from './soldier-model.js?v=real2';

const CORPSES = 30;
const CORPSE_LIFE = 24;
const rnd = (a, b) => a + Math.random() * (b - a);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// ---------------------------------------------------------------- poses
// angles [x pitch (+ = forward), y yaw, z roll] per FK bone, Euler YXZ
const KEYS = ['pelvis', 'spine', 'chest', 'neck', 'head', 'lThigh', 'lShin', 'lFoot', 'rThigh', 'rShin', 'rFoot', 'lUpper', 'lFore', 'rUpper', 'rFore'];
const pose = (o) => {
  const a = new Float32Array(ANG);
  KEYS.forEach((k, i) => { const v = o[k]; if (v) { a[i * 3] = v[0] ?? 0; a[i * 3 + 1] = v[1] ?? 0; a[i * 3 + 2] = v[2] ?? 0; } });
  return a;
};
const P = {
  stand: pose({ pelvis: [0, 0.42], spine: [0.03, -0.14], chest: [0.03, -0.17], neck: [0.12, -0.06], head: [0.12, -0.05, 0.14],
    lThigh: [-0.14, -0.32, 0.07], lShin: [0.14], lFoot: [0, 0.2], rThigh: [0.1, -0.2, -0.08], rShin: [0.1], rFoot: [0, -0.2] }),
  kneel: pose({ pelvis: [0.08, 0.42], spine: [0.05, -0.14], chest: [0.05, -0.18], neck: [0.14, -0.06], head: [0.12, -0.05, 0.14],
    lThigh: [-1.35, -0.38, 0.1], lShin: [1.38], lFoot: [-0.05, 0.25], rThigh: [0.1, -0.15, -0.18], rShin: [1.45], rFoot: [-0.15] }),
  kneelhold: pose({ pelvis: [0.3, 0.2], spine: [0.22, -0.08], chest: [0.24, -0.08], neck: [0.22], head: [0.15],
    lThigh: [-1.55, -0.25, 0.12], lShin: [1.62], lFoot: [-0.1], rThigh: [-0.15, -0.1, -0.15], rShin: [1.62], rFoot: [-0.25] }),
  duck: pose({ pelvis: [0.5], spine: [0.34], chest: [0.36], neck: [0.45], head: [0.3],
    lThigh: [-1.9, -0.18, 0.24], lShin: [2.05], lFoot: [-0.62], rThigh: [-1.85, 0.18, -0.24], rShin: [2.05], rFoot: [-0.65] }),
  prone: pose({ pelvis: [1.5, 0.05], spine: [-0.12], chest: [-0.3, -0.05], neck: [-0.55], head: [-0.45, 0, 0.1],
    lThigh: [0.04, 0, 0.2], lShin: [0.12], lFoot: [0.55], rThigh: [0.02, -0.1, -0.3], rShin: [0.55], rFoot: [0.55] }),
  proneflat: pose({ pelvis: [1.54, 0.05], spine: [-0.03], chest: [-0.05], neck: [-0.2], head: [-0.1, 0.55],
    lThigh: [0.0, 0, 0.18], lShin: [0.1], lFoot: [0.55], rThigh: [0.0, -0.1, -0.26], rShin: [0.4], rFoot: [0.55] }),
  dive: pose({ pelvis: [1.15], spine: [-0.12], chest: [-0.18], neck: [-0.5], head: [-0.3],
    lThigh: [0.28, 0, 0.12], lShin: [0.45], lFoot: [0.6], rThigh: [0.1, 0, -0.12], rShin: [0.75], rFoot: [0.6] }),
  jolt: pose({ pelvis: [-0.12, 0, 0.1], spine: [-0.2], chest: [-0.35, 0.35], neck: [-0.3], head: [-0.45, 0.2],
    lThigh: [-0.1, 0, 0.08], lShin: [0.3], rThigh: [0.1, 0, -0.08], rShin: [0.3],
    lUpper: [-0.6, 0, 0.6], lFore: [-0.9], rUpper: [-0.3, 0, -0.7], rFore: [-0.8] }),
  buckle: pose({ pelvis: [0.35, 0, 0.12], spine: [0.3], chest: [0.35, 0.2, 0.1], neck: [0.45], head: [0.45, 0, 0.25],
    lThigh: [-1.0, 0, 0.15], lShin: [1.9], lFoot: [-0.5], rThigh: [-0.55, 0, -0.1], rShin: [1.55], rFoot: [-0.4],
    lUpper: [-0.3, 0, 0.25], lFore: [-0.3], rUpper: [-0.2, 0, -0.3], rFore: [-0.4] }),
  deadProne: pose({ pelvis: [1.56, 0, 0.04], spine: [0.04, 0.1], chest: [0.05, 0.1, 0.05], neck: [0.1, 0.3], head: [0.1, 1.05, 0.1],
    lThigh: [0, 0, 0.3], lShin: [0.25], lFoot: [0.8], rThigh: [-0.35, 0, -0.15], rShin: [1.1], rFoot: [0.6],
    lUpper: [-0.6, 0, 1.25], lFore: [-0.5], rUpper: [0.3, 0, -0.45], rFore: [-0.2] }),
  deadSupine: pose({ pelvis: [-1.56, 0, -0.04], spine: [-0.05], chest: [-0.06], neck: [-0.3], head: [-0.2, 0.8],
    lThigh: [0, 0.3, 0.25], lShin: [0.25], lFoot: [-0.6], rThigh: [-0.5, -0.2, -0.2], rShin: [1.0], rFoot: [-0.5],
    lUpper: [0.2, 0, 1.35], lFore: [-0.8], rUpper: [-0.3, 0, -1.1], rFore: [-0.35] }),
  thrown: pose({ spine: [-0.3], chest: [-0.2, 0.3], neck: [-0.4], head: [-0.3, 0.4],
    lThigh: [-0.7, 0, 0.45], lShin: [1.0], lFoot: [0.3], rThigh: [0.35, 0, -0.35], rShin: [0.5], rFoot: [0.3],
    lUpper: [-1.3, 0, 1.6], lFore: [-0.5], rUpper: [-0.8, 0, -1.7], rFore: [-0.7] }),
};

// procedural run cycle: c = 0 upright jog … 1 crouched combat run
function gait(out, ph, c, amp) {
  out.fill(0);
  const lean = 0.22 + 0.36 * c, s = Math.sin(ph);
  out[0] = lean * 0.6; out[1] = 0.13 * s * amp; out[2] = 0.035 * s * amp;
  out[3] = lean * 0.25; out[4] = -0.05 * s * amp;
  out[6] = lean * 0.15; out[7] = -0.07 * s * amp;
  out[9] = -lean * 0.6; out[12] = -lean * 0.2;
  for (let side = 0; side < 2; side++) {
    const p = ph + side * Math.PI, sp = Math.sin(p), cp = Math.cos(p), o = side ? 24 : 15;
    const thighAbs = -(0.08 + 0.42 * c) - (0.52 - 0.1 * c) * sp * amp;
    const knee = 0.22 + 0.85 * c + 1.2 * Math.pow(Math.max(0, cp), 1.4) * amp;
    out[o] = thighAbs - out[0];
    out[o + 2] = (side ? -1 : 1) * 0.04;
    out[o + 3] = knee;
    out[o + 6] = -(thighAbs + knee) + 0.1 + 0.25 * Math.max(0, -cp) * Math.max(0, -sp) * amp;
  }
}

// ---------------------------------------------------------------- weapons
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3();
const _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3();
const _M = new THREE.Matrix4(), _L = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _one = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0), FWD = new THREE.Vector3(0, 0, 1);
const R_SHOULDER = new THREE.Vector3().subVectors(JOINTS[B.rUpper], JOINTS[B.chest]);
const L_SHOULDER = new THREE.Vector3().subVectors(JOINTS[B.lUpper], JOINTS[B.chest]);
const HELMET_TOP = new THREE.Vector3(0.03, 0.19, 0.03);

// matrix whose +Z is dir and +Y leans toward upRef, at pos
function basis(out, pos, dir, upRef) {
  _z.copy(dir).normalize();
  _x.crossVectors(upRef, _z);
  if (_x.lengthSq() < 1e-6) _x.set(1, 0, 0);
  _x.normalize();
  _y.crossVectors(_z, _x);
  return out.makeBasis(_x, _y, _z).setPosition(pos);
}

// chest-frame carries: [grip position, muzzle direction, up reference]
const CARRY = {
  port: [new THREE.Vector3(-0.12, -0.17, 0.21), new THREE.Vector3(0.55, 0.8, 0.25), new THREE.Vector3(0, 0, 1)],
  low: [new THREE.Vector3(-0.11, -0.05, 0.27), new THREE.Vector3(0.08, -0.42, 1), new THREE.Vector3(0, 1, 0)],
  hold: [new THREE.Vector3(-0.09, -0.13, 0.25), new THREE.Vector3(0.15, 0.95, 0.22), new THREE.Vector3(0, 0, 1)],
  back: [new THREE.Vector3(0.02, -0.05, -0.25), new THREE.Vector3(-0.55, 0.83, 0), new THREE.Vector3(0, 0, -1)],
};

function makeUnit(slot) {
  const u = {
    slot, alive: false, dead: false, x: 0, z: 0, gy: 0, yaw: 0, fireT: 1, rpg: false,
    mode: 'advance', modeT: 0, modeDur: 3, posture: 'run', firePosture: 'kneel', sup: 0, dest: null, claim: null,
    speed: 0, ph: Math.random() * 6, aimYaw: 0, aimPitch: 0, recoil: 0, peek: false, peekT: 0, diveCool: 0, shoutT: 0,
    airY: 0, vx: 0, vy: 0, vz: 0, spinX: 0, spinZ: 0, deathT: 0, deathKind: '', deadPose: null, landed: false, sink: 0,
    scale: 1, look: new Float32Array(4),
    tgt: new Float32Array(ANG), k: 12, rifleMode: 'port', tubeMode: null,
    rp: new THREE.Vector3(), rq: new THREE.Quaternion(), tp: new THREE.Vector3(), tq: new THREE.Quaternion(), wInit: false,
    drop: new THREE.Matrix4(), tubeDrop: new THREE.Matrix4(),
    muzzle: new THREE.Vector3(), rear: new THREE.Vector3(),
    pose: {
      ang: new Float32Array(ANG), off: new THREE.Vector3(), ground: true, groundK: 1,
      armsIK: true, lTarget: new THREE.Vector3(), rTarget: new THREE.Vector3(),
      lPole: new THREE.Vector3(0.5, -0.8, -0.2), rPole: new THREE.Vector3(-0.8, -0.6, -0.3),
      rifle: new THREE.Matrix4(), tube: null, tubeM: new THREE.Matrix4(),
    },
  };
  u.pose.place = (rig) => placeWeapons(u, rig);
  return u;
}

// weapon matrices off the posed torso (smoothed), then the hand IK targets
function placeWeapons(u, rig) {
  const W = rig.W, C = W[B.chest], pose = u.pose;
  const rs = _a.copy(R_SHOULDER).applyMatrix4(C);
  const aimDir = _b.set(Math.sin(u.aimYaw) * Math.cos(u.aimPitch), Math.sin(u.aimPitch), Math.cos(u.aimYaw) * Math.cos(u.aimPitch));
  const k = u.wInit ? Math.min(1, u.wk) : 1;
  // ---- rifle
  const mode = u.rifleMode;
  if (mode === 'ground') _M.copy(u.drop);
  else if (mode === 'aim') {
    _c.copy(rs).addScaledVector(aimDir, 0.3 - u.recoil * 0.05);
    _c.x += 0.065 * Math.cos(u.aimYaw); _c.z -= 0.065 * Math.sin(u.aimYaw); _c.y -= 0.07;
    _d.copy(aimDir); _d.y += u.recoil * 0.05;
    basis(_M, _c, _d, UP);
  } else {
    const [p, dir, up] = CARRY[mode] || CARRY.port;
    basis(_L, p, dir, up);
    _M.multiplyMatrices(C, _L);
  }
  _M.decompose(_c, _Q, _d);
  if (k < 1) { u.rp.lerp(_c, k); u.rq.slerp(_Q, k); } else { u.rp.copy(_c); u.rq.copy(_Q); }
  pose.rifle.compose(u.rp, u.rq, _one);
  // ---- rocket launcher on the right shoulder (aimed, or carried pitched up)
  pose.tube = null;
  if (u.tubeMode) {
    if (u.tubeMode === 'ground') _M.copy(u.tubeDrop);
    else {
      const up = u.tubeMode === 'carry' ? 0.5 : 0;
      _d.set(Math.sin(u.aimYaw) * Math.cos(u.aimPitch + up), Math.sin(u.aimPitch + up), Math.cos(u.aimYaw) * Math.cos(u.aimPitch + up));
      _c.copy(rs).addScaledVector(_d, 0.1);
      _c.x += 0.03 * Math.cos(u.aimYaw); _c.z -= 0.03 * Math.sin(u.aimYaw); _c.y -= 0.075;
      basis(_M, _c, _d, UP);
    }
    _M.decompose(_c, _Q, _d);
    if (k < 1) { u.tp.lerp(_c, k); u.tq.slerp(_Q, k); } else { u.tp.copy(_c); u.tq.copy(_Q); }
    pose.tubeM.compose(u.tp, u.tq, _one);
    pose.tube = pose.tubeM;
  }
  u.wInit = true;
  if (!pose.armsIK) return;
  // hands: wrists sit a palm's length short of the grip points
  const held = u.rpg ? pose.tubeM : pose.rifle;
  const gripL = u.rpg ? RIFLE_GRIP : RIFLE_GRIP, guardL = u.rpg ? TUBE_GUARD : RIFLE_GUARD;
  _c.copy(gripL).applyMatrix4(held);
  pose.rTarget.copy(_c).addScaledVector(_d.subVectors(rs, _c).normalize(), 0.07);
  const ls = _a.copy(L_SHOULDER).applyMatrix4(C);
  if (u.posture === 'duck') {
    // ducking: free hand clamps the helmet down
    _c.copy(JOINTS[B.head]).add(HELMET_TOP).sub(JOINTS[B.head]).applyMatrix4(W[B.head]);
    pose.lTarget.copy(_c);
  } else {
    _c.copy(guardL).applyMatrix4(held);
    pose.lTarget.copy(_c).addScaledVector(_d.subVectors(ls, _c).normalize(), 0.07);
  }
}

// ---------------------------------------------------------------- squad
export class Infantry {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.size = INFANTRY.max + CORPSES;
    this.crowd = new SoldierCrowd(scene, this.size);
    this.meshes = this.crowd.meshes;
    this.rig = new SoldierRig();
    this.units = Array.from({ length: this.size }, (_, i) => makeUnit(i));
    this.time = 0;
    this.claims = new Map();
    this.coverFn = null;      // (x, z, r) => [{x, z, r}] trees, rocks, wrecks
    this.onEvent = null;      // (unit, kind) => sounds: shout-*, hurt, bodyfall
    this._root = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._p = new THREE.Vector3();
    this._s = new THREE.Vector3();
  }

  aliveCount() {
    let n = 0;
    for (const u of this.units) if (u.alive) n++;
    return n;
  }

  // free slot, else the oldest corpse
  takeSlot() {
    let best = null, age = -1;
    for (const u of this.units) {
      if (!u.alive && !u.dead) return u;
      if (u.dead && u.deathT > age) { age = u.deathT; best = u; }
    }
    return best;
  }

  // rpg: how many of the squad carry rocket launchers
  spawnSquad(x, z, n, rpg = 0) {
    let spawned = 0, live = 0;
    for (const u of this.units) if (u.alive) live++;
    while (spawned < n && live + spawned < INFANTRY.max) {
      const u = this.takeSlot();
      if (!u) break;
      this.release(u);
      u.alive = true; u.dead = false;
      const a = Math.random() * Math.PI * 2, r = 1.5 + Math.random() * 5;
      u.x = x + Math.cos(a) * r; u.z = z + Math.sin(a) * r; u.gy = getHeight(u.x, u.z);
      u.yaw = Math.random() * Math.PI * 2;
      u.rpg = spawned < rpg;
      u.fireT = u.rpg ? 3 + Math.random() * INFANTRY.rpgReload : 1 + Math.random() * INFANTRY.reload;
      u.ph = Math.random() * 7; u.sup = 0; u.dest = null; u.speed = 0;
      u.airY = 0; u.vy = 0; u.recoil = 0; u.sink = 0; u.diveCool = 0; u.shoutT = Math.random() * 3;
      u.scale = 0.95 + Math.random() * 0.09;
      u.lane = (spawned - (n - 1) / 2) * rnd(4, 7) + rnd(-2, 2);
      u.look[0] = Math.random() * 20; u.look[1] = Math.random(); u.look[2] = Math.pow(Math.random(), 1.6); u.look[3] = 0;
      u.pose.shift = undefined; u.wInit = false;
      u.tubeMode = u.rpg ? 'carry' : null;
      this.setMode(u, 'advance');
      u.pose.ang.set(P.stand);
      spawned++;
    }
    return spawned;
  }

  release(u) {
    if (u.claim) { this.claims.delete(u.claim); u.claim = null; }
  }

  setMode(u, mode, dur = 0) {
    u.mode = mode; u.modeT = 0; u.modeDur = dur;
    if (mode !== 'advance') u.dest = null;
    if (mode !== 'cover') this.release(u);
  }

  event(u, kind, chance = 1) {
    if (this.onEvent && Math.random() < chance) this.onEvent(u, kind);
  }

  // pick the next bound: a free piece of cover nearer the enemy, else a rush forward
  pickDest(u, tx, tz, d) {
    const want = u.rpg ? INFANTRY.stopRange * 1.9 : INFANTRY.stopRange;
    // far out they rush across open ground; cover matters once in the fight
    if (this.coverFn && d < want + 18 && Math.random() < 0.8) {
      let best = null, bestS = Infinity;
      const closing = d > want + 6;
      for (const c of this.coverFn(u.x, u.z, 15)) {
        const cd = Math.hypot(tx - c.x, tz - c.z);
        // each bound must gain ground until they're at fighting range
        if (cd < want * 0.55 || cd > (closing ? d - 5 : d + 3)) continue;
        const key = `${Math.round(c.x * 2)}|${Math.round(c.z * 2)}`;
        if (this.claims.has(key) && this.claims.get(key) !== u) continue;
        const s = Math.hypot(c.x - u.x, c.z - u.z) * 0.6 + Math.abs(cd - want) * 0.45;
        if (s < bestS) { bestS = s; best = { c, key, cd }; }
      }
      if (best) {
        const { c, key, cd } = best;
        const k = (c.r + 0.6) / cd;
        u.dest = { x: c.x - (tx - c.x) * k, z: c.z - (tz - c.z) * k, cover: c, key };
        this.claims.set(key, u);
        u.claim = key;
        return;
      }
    }
    // each man keeps his own lane so the squad advances spread out
    const b0 = Math.atan2(tx - u.x, tz - u.z);
    const lx = tx + Math.cos(b0) * u.lane, lz = tz - Math.sin(b0) * u.lane;
    const ang = Math.atan2(lx - u.x, lz - u.z) + (Math.random() - 0.5) * 0.5;
    const len = Math.min(d > want + 18 ? rnd(11, 17) : rnd(7, 12), Math.max(2.5, d - want));
    u.dest = { x: u.x + Math.sin(ang) * len, z: u.z + Math.cos(ang) * len, cover: null };
  }

  turn(u, want, rate, dt) {
    const dy = wrap(want - u.yaw);
    u.yaw += THREE.MathUtils.clamp(dy, -rate * dt, rate * dt);
    return Math.abs(dy);
  }

  // advance toward the nearest target, find cover, shoot from it.
  // onShoot(unit, target, kind) fires per rifle shot or rocket.
  step(dt, targets, onShoot) {
    this.time += dt;
    for (const u of this.units) if (u.dead) this.stepDead(u, dt);
    if (!targets.length) return;
    for (const u of this.units) {
      if (!u.alive) continue;
      let best = null, bestD = Infinity;
      for (const t of targets) {
        const d = Math.hypot(t.body.position.x - u.x, t.body.position.z - u.z);
        if (d < bestD) { bestD = d; best = t; }
      }
      if (!best) continue;
      this.think(u, best, bestD, dt, onShoot);
    }
    // keep a little personal space
    const L = this.units;
    for (let i = 0; i < L.length; i++) {
      const a = L[i];
      if (!a.alive || a.airY > 0) continue;
      for (let j = i + 1; j < L.length; j++) {
        const b = L[j];
        if (!b.alive) continue;
        const dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz;
        if (d2 > 0.81 || d2 < 1e-6) continue;
        const d = Math.sqrt(d2), push = (0.9 - d) * 0.5 / d;
        a.x -= dx * push; a.z -= dz * push; b.x += dx * push; b.z += dz * push;
      }
    }
  }

  think(u, t, d, dt, onShoot) {
    const tp = t.body.position, tx = tp.x, tz = tp.z;
    u.lastD = d;
    const bearing = Math.atan2(tx - u.x, tz - u.z);
    u.sup = Math.max(0, u.sup - dt * 0.2);
    u.modeT += dt; u.fireT -= dt; u.diveCool -= dt; u.shoutT -= dt;
    u.recoil = Math.max(0, u.recoil - dt * 9);
    // a tank bearing down: throw yourself clear of its tracks
    if (u.mode !== 'dive' && u.diveCool <= 0 && d < 12) {
      const tv = t.body.velocity, ts = Math.hypot(tv.x, tv.z);
      const closing = ts > 2.5 ? -((tx - u.x) * tv.x + (tz - u.z) * tv.z) / Math.max(0.1, d) : 0;
      if (closing > ts * 0.55) {
        u.diveCool = 3.5;
        if (Math.random() < 0.72) {
          const side = Math.sign((tv.x * (u.z - tz) - tv.z * (u.x - tx)) || 1);
          const dirX = -tv.z / ts * side, dirZ = tv.x / ts * side;
          u.vx = dirX * rnd(4.2, 5.4) + tv.x / ts * 0.6; u.vz = dirZ * rnd(4.2, 5.4) + tv.z / ts * 0.6;
          u.vy = rnd(2.4, 3.2); u.airY = 0.02;
          u.yaw = Math.atan2(u.vx, u.vz);
          this.setMode(u, 'dive');
          if (u.shoutT <= 0) { u.shoutT = 4; this.event(u, 'shout-tank', 0.7); }
          return;
        }
      }
    }
    let move = 0, faceTarget = true, canFire = false, crouch = false;
    switch (u.mode) {
      case 'advance': {
        if (!u.dest) {
          const want = u.rpg ? INFANTRY.stopRange * 1.9 : INFANTRY.stopRange;
          if (d < want + 2 && !this.coverFn) { this.enterFire(u); break; }
          this.pickDest(u, tx, tz, d);
          u.modeDur = rnd(3.5, 6.5);
          if (u.shoutT <= 0 && Math.random() < 0.25) { u.shoutT = 6; this.event(u, 'shout-advance'); }
        }
        const dx = u.dest.x - u.x, dz = u.dest.z - u.z, dd = Math.hypot(dx, dz);
        crouch = u.sup > 0.12 || d < 45;
        if (dd < 0.45) {
          // far out, cover is a breather between rushes; in range, a firing post
          const want = u.rpg ? INFANTRY.stopRange * 1.9 : INFANTRY.stopRange;
          if (u.dest.cover) this.setMode(u, 'cover', d > want + 8 ? rnd(1.4, 3.2) : rnd(8, 14)); else this.enterFire(u);
          break;
        }
        if (u.modeT > u.modeDur && !u.dest.cover) { this.enterFire(u); break; }
        move = u.dest.cover ? (crouch ? 3.3 : 4.3) : (crouch ? 2.7 : INFANTRY.speed);
        if (dd < 1.6) move *= dd / 1.6 + 0.3;
        faceTarget = false;
        this.turn(u, Math.atan2(dx, dz), 7, dt);
        break;
      }
      case 'fire': {
        canFire = true;
        if (u.sup > 0.45 && u.firePosture !== 'prone') u.firePosture = 'prone';
        if (u.modeT > u.modeDur) {
          const want = u.rpg ? INFANTRY.stopRange * 1.9 : INFANTRY.stopRange;
          if (d > want + 4 || Math.random() < 0.3) this.setMode(u, 'advance'); else this.enterFire(u);
        }
        break;
      }
      case 'cover': {
        // alternate: peek out and shoot, then duck back behind it
        u.peekT -= dt;
        if (u.peekT <= 0) { u.peek = !u.peek && u.sup < 0.5; u.peekT = u.peek ? rnd(2, 3.6) : rnd(1.2, 2.6); }
        canFire = u.peek;
        const c = u.claimCover;
        const leave = u.modeT > u.modeDur || !u.claim;
        if (leave) { this.setMode(u, 'advance'); break; }
        break;
      }
      case 'duck':
        if (u.modeT > u.modeDur) {
          if (u.sup > 0.4) this.setMode(u, 'prone', rnd(3, 6));
          else this.enterFire(u);
        }
        break;
      case 'prone':
        canFire = u.sup < 0.55;
        if (u.modeT > u.modeDur && u.sup < 0.35) this.setMode(u, 'getup', 0.55);
        break;
      case 'getup':
        if (u.modeT > u.modeDur) this.setMode(u, 'advance');
        break;
      case 'dive': {
        faceTarget = false;
        u.vy -= 15 * dt;
        u.airY += u.vy * dt;
        u.x += u.vx * dt; u.z += u.vz * dt;
        if (u.airY <= 0 && u.vy < 0) {
          u.airY = 0; u.vx = u.vz = 0;
          this.setMode(u, 'prone', rnd(1.6, 3.2));
          u.sup = Math.max(u.sup, 0.5);
        }
        break;
      }
    }
    // the rush keeps the cover's claim until they're in it
    if (u.mode === 'cover' && !u.claim) this.setMode(u, 'advance');
    u.speed += (move - u.speed) * Math.min(1, dt * 6);
    if (u.speed > 0.05 && u.mode !== 'dive') {
      u.x += Math.sin(u.yaw) * u.speed * dt;
      u.z += Math.cos(u.yaw) * u.speed * dt;
    }
    u.ph += dt * (u.speed / (crouch ? 1.55 : 2.05)) * Math.PI * 2;
    if (faceTarget && u.mode !== 'dive') {
      const err = this.turn(u, bearing, u.mode === 'prone' ? 1.5 : 4.5, dt);
      // aim: yaw residual through the torso, pitch toward the hull
      u.aimYaw = THREE.MathUtils.clamp(wrap(bearing - u.yaw), -0.5, 0.5);
      const shoulderY = u.mode === 'prone' ? 0.35 : (u.mode === 'fire' && u.firePosture === 'stand') ? 1.45 : 1.0;
      u.aimPitch = Math.atan2(tp.y + 1.0 - (u.gy + shoulderY), Math.max(4, d));
      if (canFire && err < 0.2 && u.modeT > 0.6) this.shoot(u, t, d, onShoot);
    } else { u.aimYaw *= 0.9; u.aimPitch *= 0.9; }
  }

  enterFire(u) {
    const r = Math.random();
    u.firePosture = u.rpg ? 'kneel' : u.sup > 0.4 ? 'prone' : r < 0.55 ? 'kneel' : r < 0.72 ? 'stand' : 'prone';
    // out of range it's a pause between rushes; in range a proper firing spell
    this.setMode(u, 'fire', u.lastD > (u.rpg ? INFANTRY.rpgRange : INFANTRY.fireRange) ? rnd(1.2, 2.6) : rnd(3, 6.5));
  }

  shoot(u, t, d, onShoot) {
    if (u.fireT > 0) return;
    if (u.rpg) {
      if (d < INFANTRY.rpgRange && u.mode === 'fire') {
        u.fireT = INFANTRY.rpgReload * (0.8 + Math.random() * 0.5);
        u.recoil = 1;
        onShoot(u, t, 'rpg');
        u.modeDur = Math.min(u.modeDur, u.modeT + 1.2);   // relocate after the shot
      }
    } else if (d < INFANTRY.fireRange) {
      u.fireT = INFANTRY.reload * (0.5 + Math.random() * 0.45);
      u.recoil = 1;
      onShoot(u, t, 'rifle');
    }
  }

  // shells, artillery and MG fire landing nearby: flinch, duck, hit the dirt
  suppress(x, z, r, amount = 1, kind = 'shell') {
    for (const u of this.units) {
      if (!u.alive) continue;
      const d = Math.hypot(u.x - x, u.z - z);
      if (d > r) continue;
      u.sup = Math.min(1.5, u.sup + amount * (1 - d / r));
      if (u.mode === 'dive' || u.mode === 'prone') continue;
      if (u.sup > 0.8) {
        this.setMode(u, 'prone', rnd(3, 6));
      } else if (u.sup > 0.32 && (u.mode === 'advance' || (u.mode === 'fire' && u.firePosture === 'stand'))) {
        this.setMode(u, 'duck', rnd(0.7, 1.5));
      }
      if (u.shoutT <= 0) { u.shoutT = 5; this.event(u, kind === 'mg' ? 'shout-cover' : 'shout-incoming', 0.5); }
    }
  }

  // MG burst cracking past: suppress anyone within 2.5 m of the round's path
  nearMiss(o, dir, dist) {
    for (const u of this.units) {
      if (!u.alive) continue;
      const cx = u.x - o.x, cz = u.z - o.z, cy = u.gy + 0.8 - o.y;
      const t = cx * dir.x + cy * dir.y + cz * dir.z;
      if (t < 0 || t > dist + 2) continue;
      const px = cx - dir.x * t, py = cy - dir.y * t, pz = cz - dir.z * t;
      if (px * px + py * py + pz * pz < 6.25) this.suppress(u.x, u.z, 0.5, 0.16, 'mg');
    }
  }

  // ---- deaths ----
  // how: 'shot' (from fx,fz), 'blast' (thrown away from fx,fz), 'crush'
  kill(u, how = 'shot', fx = u.x, fz = u.z, power = 1) {
    if (!u.alive) return;
    u.alive = false; u.dead = true; u.deathT = 0; u.deathKind = how; u.landed = false; u.sink = 0;
    this.release(u);
    u.pose.armsIK = false;
    const dx = u.x - fx, dz = u.z - fz, dl = Math.hypot(dx, dz) || 1;
    if (how === 'shot') {
      // fall away from the shooter: backward if hit from the front
      const front = Math.cos(Math.atan2(-dx, -dz) - u.yaw) > 0;
      u.deadPose = front ? P.deadSupine : P.deadProne;
      if (Math.random() < 0.2) u.deadPose = front ? P.deadProne : P.deadSupine;
      u.vx = u.vz = u.vy = 0; u.airY = 0;
      this.event(u, 'hurt', 0.8);
    } else {
      const k = how === 'crush' ? 0.5 : Math.min(1.6, power);
      const hs = rnd(2.5, 5.5) * k + 1;
      u.vx = dx / dl * hs; u.vz = dz / dl * hs; u.vy = rnd(2.2, 4.6) * k + 1.2;
      u.airY = Math.max(u.airY, 0.05);
      u.spinX = rnd(-9, 9) * k; u.spinZ = rnd(-5, 5) * k;
      u.deadPose = null;
    }
    // a comrade nearby calls for the medic
    if (Math.random() < 0.35) {
      for (const o of this.units) {
        if (o.alive && o.shoutT <= 0 && Math.hypot(o.x - u.x, o.z - u.z) < 15) { o.shoutT = 6; this.event(o, 'shout-medic'); break; }
      }
    }
    // the weapon tumbles to the ground beside the body
    const a = Math.random() * Math.PI * 2;
    _a.set(rnd(-0.6, 0.6), 0.03, rnd(0.2, 0.9));
    _b.set(Math.cos(a), 0, Math.sin(a));
    basis(u.drop, _a, _b, _c.set(-_b.z, 0, _b.x));
    if (u.rpg) basis(u.tubeDrop, _a.set(rnd(-1, 1), 0.07, rnd(-0.8, 0.3)), _b.set(Math.sin(a + 1), 0, Math.cos(a + 1)), UP);
  }

  stepDead(u, dt) {
    u.deathT += dt;
    if (u.deathKind !== 'shot' && !u.landed) {
      u.vy -= 15 * dt;
      u.airY += u.vy * dt;
      u.x += u.vx * dt; u.z += u.vz * dt;
      if (u.airY <= 0 && u.vy < 0) {
        u.airY = 0;
        if (Math.abs(u.vy) > 4 && u.deathT < 1.5) { u.vy *= -0.25; u.vx *= 0.4; u.vz *= 0.4; u.airY = 0.01; }
        else {
          u.landed = true; u.vx = u.vz = 0;
          const px = wrap(u.pose.ang[0]);
          u.deadPose = px > 0 ? P.deadProne : P.deadSupine;
          this.event(u, 'bodyfall', 0.6);
        }
      }
    }
    if (u.deathKind === 'shot' && !u.fell && u.deathT > 0.75) { u.fell = true; this.event(u, 'bodyfall', 0.5); }
    if (u.deathT > CORPSE_LIFE) u.sink = (u.deathT - CORPSE_LIFE) * 0.25;
    if (u.deathT > CORPSE_LIFE + 2.4) { u.dead = false; u.fell = false; }
  }

  // kill every soldier within r of a point; onKill(unit) per casualty
  killRadius(x, z, r, onKill, power = 1) {
    let n = 0;
    for (const u of this.units) {
      if (!u.alive) continue;
      if (Math.hypot(u.x - x, u.z - z) < r) {
        this.kill(u, 'blast', x, z, power);
        onKill?.(u);
        n++;
      }
    }
    return n;
  }

  // nearest soldier on a ray; the target's height follows their posture
  mgHit(origin, dir, maxDist) {
    let best = null, bestT = maxDist;
    for (const u of this.units) {
      if (!u.alive) continue;
      const low = u.mode === 'prone' || u.mode === 'dive';
      const crouched = u.mode === 'duck' || u.mode === 'cover' || u.mode === 'getup' || (u.mode === 'fire' && u.firePosture === 'kneel');
      const cy0 = low ? 0.25 : crouched ? 0.6 : 0.95, half = low ? 0.35 : crouched ? 0.65 : 1.0, rad = low ? 0.95 : 0.75;
      const gy = u.gy + u.airY;
      const cx = u.x - origin.x, cy = gy + cy0 - origin.y, cz = u.z - origin.z;
      const t = cx * dir.x + cy * dir.y + cz * dir.z;
      if (t < 1 || t > bestT) continue;
      const px = origin.x + dir.x * t - u.x;
      const py = origin.y + dir.y * t - (gy + cy0);
      const pz = origin.z + dir.z * t - u.z;
      if (px * px + pz * pz < rad * rad && Math.abs(py) < half + 0.35) {
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
      if (!u.alive || u.airY > 0.4) continue;
      if (Math.hypot(u.x - p.x, u.z - p.z) < INFANTRY.crushRadius * (tank.scale ?? 1)) {
        this.kill(u, 'crush', p.x, p.z, 1);
        onKill?.(u, tank.isPlayer);
      }
    }
  }

  clear() {
    for (const u of this.units) { u.alive = false; u.dead = false; this.release(u); }
  }

  // ---- animation ----
  targetPose(u, dt) {
    const tgt = u.tgt, pose = u.pose;
    pose.armsIK = u.alive;
    u.tubeMode = u.rpg ? 'carry' : null;
    if (!u.alive) {
      // dying and dead
      u.rifleMode = 'ground';
      if (u.rpg) u.tubeMode = 'ground';
      if (u.deathKind === 'shot') {
        if (u.deathT < 0.16) { tgt.set(P.jolt); u.k = 16; u.rifleMode = 'low'; }
        else if (u.deathT < 0.6) { tgt.set(P.buckle); u.k = 9; }
        else { tgt.set(u.deadPose); u.k = 5.5; }
      } else if (!u.landed) {
        tgt.set(P.thrown); u.k = 7;
      } else { tgt.set(u.deadPose); u.k = 7; }
      return;
    }
    u.rifleMode = u.rpg ? 'back' : 'port';
    let pz = u.posture = 'run';
    switch (u.mode) {
      case 'advance':
        pz = u.speed > 0.4 ? (u.sup > 0.12 || u.speed < 3 ? 'crouchrun' : 'run') : 'stand';
        break;
      case 'fire': pz = u.firePosture; break;
      case 'cover': pz = u.peek ? 'kneel' : 'kneelhold'; break;
      case 'duck': pz = 'duck'; break;
      case 'prone': pz = u.sup < 0.55 ? 'prone' : 'proneflat'; break;
      case 'getup': pz = 'kneelhold'; break;
      case 'dive': pz = 'dive'; break;
    }
    u.posture = pz;
    const aiming = pz === 'stand' || pz === 'kneel' || pz === 'prone';
    if (pz === 'run' || pz === 'crouchrun') {
      gait(tgt, u.ph, pz === 'crouchrun' ? 1 : 0, Math.min(1.2, u.speed / 3.4));
      u.k = 22;
      if (!u.rpg) u.rifleMode = pz === 'crouchrun' ? 'low' : 'port';
    } else {
      tgt.set(P[pz]);
      u.k = pz === 'dive' ? 10 : pz === 'prone' || pz === 'proneflat' ? 6 : 9;
      if (!u.rpg) u.rifleMode = aiming ? 'aim' : pz === 'dive' ? 'low' : 'hold';
      if (u.rpg && aiming) u.tubeMode = 'aim';
    }
    // elbows: out and down when shouldering, tucked when carrying
    if (aiming) { pose.rPole.set(-1, -0.45, -0.1); pose.lPole.set(0.3, -1, 0.15); }
    else { pose.rPole.set(-0.45, -1, -0.25); pose.lPole.set(0.2, -1, 0.15); }
    if (pz === 'prone') { pose.rPole.set(-0.7, -1, 0); pose.lPole.set(0.5, -1, 0.1); }
  }

  // blend toward the target pose, solve the rig, and queue every visible body
  updateVisuals(dt = 0) {
    const cam = this.camera, crowd = this.crowd, rig = this.rig;
    crowd.begin();
    for (const u of this.units) {
      if (!u.alive && !u.dead) continue;
      u.gy = getHeight(u.x, u.z);
      const dist = cam ? Math.hypot(u.x - cam.position.x, u.z - cam.position.z) : 0;
      if (dist > 320) continue;
      this.targetPose(u, dt);
      const ang = u.pose.ang, tgt = u.tgt;
      const k = dt > 0 ? 1 - Math.exp(-u.k * dt) : 1;
      if (!u.alive && u.deathKind !== 'shot' && !u.landed) {
        // tumbling through the air: the trunk spins freely, limbs flail
        ang[0] += u.spinX * dt; ang[2] += u.spinZ * dt;
        for (let i = 3; i < ANG; i++) ang[i] += (tgt[i] - ang[i]) * k;
      } else {
        if (!u.alive && u.landed && u.deathT < 30) { ang[0] = wrap(ang[0]); ang[2] = wrap(ang[2]); }
        for (let i = 0; i < ANG; i++) ang[i] += (tgt[i] - ang[i]) * k;
      }
      u.wk = dt > 0 ? 1 - Math.exp(-(u.alive ? 16 : 10) * dt) : 1;
      u.pose.groundK = dt > 0 ? 1 - Math.exp(-((u.alive && u.airY <= 0) ? 22 : 40) * dt) : 1;
      rig.solve(u.pose, u.airY);
      this._p.set(u.x, u.gy - u.sink, u.z);
      this._q.setFromAxisAngle(UP, u.yaw);
      this._s.setScalar(u.scale);
      this._root.compose(this._p, this._q, this._s);
      crowd.push(dist < 42 ? 0 : 1, u.slot, this._root, rig.S, u.look);
      if (u.alive) {
        if (u.rpg) {
          u.muzzle.copy(TUBE_MUZZLE).applyMatrix4(u.pose.tubeM).applyMatrix4(this._root);
          u.rear.copy(TUBE_REAR).applyMatrix4(u.pose.tubeM).applyMatrix4(this._root);
        } else u.muzzle.copy(RIFLE_MUZZLE).applyMatrix4(u.pose.rifle).applyMatrix4(this._root);
      }
    }
    crowd.end();
  }

  // muzzle point for tracers (rocket tubes fire from the warhead tip)
  muzzleOf(u, out) {
    if (u.muzzle.lengthSq() > 0) return out.copy(u.muzzle);
    return out.set(u.x + Math.sin(u.yaw) * 0.6, getHeight(u.x, u.z) + 1.3, u.z + Math.cos(u.yaw) * 0.6);
  }

  rearOf(u, out) { return out.copy(u.rear); }
}
