// The digger, rendered as a real person: a Microsoft Rocketbox avatar (MIT; see assets/LICENSE-Rocketbox.md)
// with its own motion-captured idles, plus motion-captured walk, run, jump, hit and fall clips retargeted onto
// it by scripts/gold-digger/build_digger.mjs. Procedural layers sit on top of the clips: two-handed pickaxe
// swings, overhand throws, ladder and rope climbing, swimming, a gripping hand and landing dips, all solved with
// a hinge-aware two-bone IK. Presentation only: it reads the sim player's state and never writes to it.
import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

const V = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const _a = V(), _b = V(), _c = V(), _t = V(), _u = V(), _v = V(), _w = V(), _x = V(), _y = V(), _z = V(), _p = V();
const _q = Q(), _q2 = Q(), _pq = Q(), _wq = Q(), _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _s = V();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const ease = (t) => t * t * (3 - 2 * t);

export function loadDiggerAsset(url) { return new GLTFLoader().loadAsync(url); }

// world-space bone helpers (convention free: every rotation is a world-space delta)
function setWorldQuat(o, qW) { o.parent.getWorldQuaternion(_pq); o.quaternion.copy(_pq.invert().multiply(qW)); o.updateMatrixWorld(true); }
function rotateWorld(o, qD) { o.getWorldQuaternion(_wq); setWorldQuat(o, _wq.premultiply(qD)); }
function setWorldPos(o, p) { o.parent.updateWorldMatrix(true, false); o.position.copy(o.parent.worldToLocal(_p.copy(p))); o.updateMatrixWorld(true); }

// two-bone IK that respects the middle joint's hinge: bend the hinge to the right angle, aim the chain, then
// roll it round the shoulder-target axis so the elbow (or knee) points at the pole
function ik2(A, B, C, target, pole, hingeLocal, w = 1) {
  if (w <= 0.001) return;
  A.getWorldPosition(_a); B.getWorldPosition(_b); C.getWorldPosition(_c);
  _t.copy(_c).lerp(target, w);
  const lab = _a.distanceTo(_b), lbc = _b.distanceTo(_c);
  const lat = clamp(_a.distanceTo(_t), 0.05, lab + lbc - 0.002);
  const want = Math.PI - Math.acos(clamp((lab * lab + lbc * lbc - lat * lat) / (2 * lab * lbc), -1, 1));
  B.getWorldQuaternion(_q); _x.copy(hingeLocal).applyQuaternion(_q).normalize();
  _u.subVectors(_b, _a).normalize(); _v.subVectors(_c, _b).normalize();
  const cur = Math.atan2(_w.crossVectors(_u, _v).dot(_x), _u.dot(_v));
  rotateWorld(B, _q2.setFromAxisAngle(_x, want - cur));
  C.getWorldPosition(_c);
  _u.subVectors(_c, _a).normalize(); _v.subVectors(_t, _a).normalize();
  rotateWorld(A, _q2.setFromUnitVectors(_u, _v));
  if (pole) {
    B.getWorldPosition(_b);
    const ax = _v; const e = _u.subVectors(_b, _a); e.addScaledVector(ax, -e.dot(ax));
    const pp = _w.copy(pole).addScaledVector(ax, -pole.dot(ax));
    if (e.lengthSq() > 1e-6 && pp.lengthSq() > 1e-6) {
      e.normalize(); pp.normalize();
      const ang = Math.atan2(_y.crossVectors(e, pp).dot(ax), e.dot(pp));
      rotateWorld(A, _q2.setFromAxisAngle(ax, ang));
    }
  }
}

export class Digger {
  constructor(gltf, gear) {
    this.root = new THREE.Group(); this.root.name = 'digger';
    const body = this.body = gltf.scene;
    this.root.add(body);
    this.mats = [];
    body.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
        o.material = o.material.clone(); this.mats.push(o.material);
        if (o.material.map) o.material.map.anisotropy = 4;
        o.material.color.multiplyScalar(/head/i.test(o.material.name) ? 0.9 : 0.74);   // a day underground: a little dust on everything
      }
    });
    const bones = {}; body.traverse((o) => { if (/^Bip01/.test(o.name)) bones[o.name === 'Bip01' ? 'Bip01' : o.name.replace(/^Bip01[ _]/, '').replace(/[ _]/g, '')] = o; });
    this.B = bones;
    const b = (n) => bones[n];
    this.pelvis = b('Pelvis'); this.spine = [b('Spine'), b('Spine1'), b('Spine2')];
    this.neck = b('Neck'); this.head = b('Head');
    this.spineBend = [b('Spine1'), b('Spine2')];   // (Biped: the thighs hang off 'Spine', so bends start above it)
    this.arm = { L: [b('LUpperArm'), b('LForearm'), b('LHand')], R: [b('RUpperArm'), b('RForearm'), b('RHand')] };
    this.leg = { L: [b('LThigh'), b('LCalf'), b('LFoot')], R: [b('RThigh'), b('RCalf'), b('RFoot')] };
    this.allBones = Object.values(bones);
    // ---- the bind pose in avatar space (the avatar faces +Z, up +Y)
    body.updateMatrixWorld(true);
    const bindW = new Map(), bindQ = new Map();
    for (const o of this.allBones) { bindW.set(o, o.matrixWorld.clone()); bindQ.set(o, o.getWorldQuaternion(Q())); }
    const P = (o) => new THREE.Vector3().setFromMatrixPosition(bindW.get(o));
    this.bindLocal = new Map(this.allBones.map((o) => [o, { q: o.quaternion.clone(), p: o.position.clone() }]));
    const F = new THREE.Vector3(0, 0, 1);
    const hinge = (upper, lower, end, dirSign) => {
      const u = P(lower).sub(P(upper)).normalize();
      const k = new THREE.Vector3().crossVectors(u, F.clone().multiplyScalar(dirSign)).normalize();
      return k.applyQuaternion(bindQ.get(lower).clone().invert());
    };
    this.hinge = {
      armL: hinge(this.arm.L[0], this.arm.L[1], this.arm.L[2], 1), armR: hinge(this.arm.R[0], this.arm.R[1], this.arm.R[2], 1),
      legL: hinge(this.leg.L[0], this.leg.L[1], this.leg.L[2], -1), legR: hinge(this.leg.R[0], this.leg.R[1], this.leg.R[2], -1),
    };
    this.hipH = P(this.pelvis).y; this.shoulderH = P(this.arm.R[0]).y;
    // ---- hands: curl axes for gripping, and the grip frame the pickaxe sits in
    this.hand = {};
    for (const s of ['L', 'R']) {
      const H = b(s + 'Hand'), hp = P(H);
      const idx = P(b(s + 'Finger1')), mid = P(b(s + 'Finger2')), pinky = P(b(s + 'Finger4')), thumbTip = P(b(s + 'Finger02'));
      const fing = mid.clone().sub(hp).normalize();
      const across = idx.clone().sub(pinky).normalize();
      let n = new THREE.Vector3().crossVectors(across, fing).normalize();
      if (thumbTip.clone().sub(hp).dot(n) < 0) n.negate();               // n: out of the palm
      const curlSign = new THREE.Vector3().crossVectors(across, fing).dot(n) > 0 ? 1 : -1;
      const joints = [];
      for (const f of ['1', '2', '3', '4', '0']) for (const j of ['', '1', '2']) {
        const o = b(s + 'Finger' + f + (j === '' ? '' : f + j).slice(f.length)) || b(s + 'Finger' + (j === '' ? f : f + j));
        if (!o) continue;
        joints.push({ o, axis: across.clone().applyQuaternion(bindQ.get(o).clone().invert()), k: f === '0' ? 0.45 : 1, sign: curlSign });
      }
      // grip frame (avatar space): +X along the handle toward the index side, -Y the way the knuckles strike
      const X = across.clone(), Y = fing.clone().addScaledVector(X, -fing.dot(X)).normalize().negate(), Z = new THREE.Vector3().crossVectors(X, Y);
      const centre = hp.clone().addScaledVector(fing, 0.075).addScaledVector(n, 0.025);
      const grip = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(centre);
      const local = bindW.get(H).clone().invert().multiply(grip);   // grip in the hand bone's space
      const gq = Q(); local.decompose(V(), gq, V());   // (the hand bone's space carries the rig's scale)
      this.hand[s] = { H, joints, local, gripQ: gq };
    }
    // ---- the avatar wears a baseball cap: tuck its crown and visor in so the helmet covers them
    {
      const hp = P(this.head), y0 = hp.y + 0.1, zFace = hp.z + 0.075;
      body.traverse((o) => {
        if (!o.isSkinnedMesh || !/head/i.test(o.material.name || '')) return;
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i); let x = pos.getX(i), z = pos.getZ(i);
          if (y > hp.y + 0.088 && z > zFace) z = zFace + (z - zFace) * 0.08;      // the visor folds back under the brim
          if (y > y0) { const k = 0.9; x = hp.x + (x - hp.x) * k; z = hp.z + (z - hp.z) * k; pos.setXYZ(i, x, y0 + (y - y0) * 0.45, z); }
          else pos.setZ(i, z);
        }
        pos.needsUpdate = true; o.geometry.computeBoundingSphere();
      });
    }
    // ---- gear: helmet on the head, pack on the upper spine, pickaxe in the right hand
    const holder = (bone, m) => { const h = new THREE.Object3D(); bone.add(h); bindW.get(bone).clone().invert().multiply(m).decompose(h.position, h.quaternion, h.scale); return h; };
    const yawToZ = new THREE.Matrix4().makeRotationY(-Math.PI / 2);   // gear models face +X; the avatar faces +Z
    const headTop = P(this.head);
    this.helmetHolder = holder(this.head, new THREE.Matrix4().makeTranslation(0, headTop.y - 0.036, headTop.z + 0.012).multiply(yawToZ).multiply(new THREE.Matrix4().makeScale(1.08, 0.92, 1.1)));
    this.helmetHolder.add(gear.helmet);
    const sp2 = P(this.spine[2]);
    this.packHolder = holder(this.spine[2], new THREE.Matrix4().makeTranslation(0, sp2.y - 0.05, sp2.z - 0.165).multiply(yawToZ).multiply(new THREE.Matrix4().makeScale(0.92, 0.92, 0.92)));
    this.packHolder.add(gear.pack);
    {
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x3a2516, roughness: 0.55 });
      for (const sx of [-1, 1]) {
        const cl = P(this.B[(sx < 0 ? 'L' : 'R') + 'Clavicle']), ua = P(this.B[(sx < 0 ? 'L' : 'R') + 'UpperArm']);
        const top = cl.clone().lerp(ua, 0.45);
        const pts = [V().set(top.x * 0.8, sp2.y + 0.02, sp2.z - 0.11), V().set(top.x, top.y + 0.055, top.z - 0.02), V().set(top.x * 1.02, top.y + 0.02, top.z + 0.09), V().set(top.x * 0.92, top.y - 0.16, top.z + 0.115), V().set(top.x * 0.85, top.y - 0.3, top.z + 0.085)];
        const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.012, 5), strapMat);
        tube.scale.set(1, 1, 1); tube.castShadow = true;
        const h = new THREE.Object3D(); this.spine[2].add(h); bindW.get(this.spine[2]).clone().invert().decompose(h.position, h.quaternion, h.scale); h.add(tube);
        tube.scale.z = 1; tube.geometry.scale(1, 1, 1);
      }
    }
    this.pick = gear.pick; this.pick.position.x = 0.06; this.pick.scale.setScalar(1.15);
    this.pickRoot = new THREE.Group(); this.pickRoot.add(this.pick); this.root.add(this.pickRoot);
    this.pickHold = new THREE.Object3D(); this.hand.R.H.add(this.pickHold);
    this.hand.R.local.decompose(this.pickHold.position, this.pickHold.quaternion, this.pickHold.scale);
    this.stow = holder(this.spine[2], new THREE.Matrix4().compose(V().set(-0.13, sp2.y - 0.43, sp2.z - 0.28), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.15)), V().set(1, 1, 1)));
    this.stowW = 0;
    this.lampLens = gear.lampLens; this.lampAnchor = gear.lampAnchor;
    for (const g of [gear.helmet, gear.pack, gear.pick]) g.traverse((o) => { if (o.isMesh) { o.castShadow = true; if (o.material.emissive && o.name !== 'lampLens') { o.material = o.material.clone(); this.mats.push(o.material); } } });
    // the avatar faces +Z; the game's digger faces +X when its root has no yaw
    body.rotation.y = Math.PI / 2;
    // ---- clips
    const meta = (gltf.parser && gltf.parser.json && gltf.parser.json.extras && gltf.parser.json.extras.clips) || {};
    this.meta = meta;
    this.mixer = new THREE.AnimationMixer(body);
    this.act = {};
    for (const clip of gltf.animations) {
      // keep the hips' sideways sway, but the game owns where the digger is
      const a = this.mixer.clipAction(clip); a.play(); a.setEffectiveWeight(0); this.act[clip.name] = a;
    }
    for (const n of ['walk', 'run', 'jump']) if (this.act[n]) this.act[n].timeScale = 0;
    for (const n of ['hit', 'hit2', 'ko', 'knock', 'launched', 'getup', 'victory']) if (this.act[n]) { this.act[n].setLoop(THREE.LoopOnce); this.act[n].clampWhenFinished = true; }
    this.w = {}; for (const n in this.act) this.w[n] = 0;
    this.idleName = 'idle_breathe_01'; this.w[this.idleName] = 1;
    // where the left foot lands in the walk and run cycles, so the two blend in step
    this.phaseOff = { walk: this.footPhase('walk'), run: this.footPhase('run') };
    // arms for the air: the run clip's mid-stride carry (the jump clip flings them overhead)
    this.armBones = [b('LClavicle'), ...this.arm.L, b('RClavicle'), ...this.arm.R];
    if (this.act.run) {
      for (const k in this.act) this.act[k].setEffectiveWeight(k === 'run' ? 1 : 0);
      this.act.run.time = this.act.run.getClip().duration * 0.12; this.mixer.update(0);
      this.airArms = this.armBones.map((o) => o.quaternion.clone());
    }
    // the pose the mixer last wrote (three only rewrites a bone when its value changes)
    this.saved = this.allBones.map((o) => ({ o, q: o.quaternion.clone(), p: o.position.clone() }));
    // state
    this.phase = 0; this.yaw = 0; this.z = 0; this.wasGround = true; this.prevVy = 0; this.landT = 9; this.landA = 0;
    this.hitT = 9; this.flinchT = 9; this.idleT = 0; this.deadT = -1; this.climbW = 0; this.swimW = 0; this.swingW = 0; this.throwW = 0;
    this.swimPh = 0; this.time = 0; this.pickMix = 0;
  }

  footPhase(name) {
    const a = this.act[name]; if (!a) return 0;
    for (const k in this.act) this.act[k].setEffectiveWeight(k === name ? 1 : 0);
    let best = 0, lo = 1e9; const foot = this.leg.L[2], d = a.getClip().duration;
    for (let i = 0; i < 40; i++) { a.time = (i / 40) * d; this.mixer.update(0); this.body.updateMatrixWorld(true); foot.getWorldPosition(_p); if (_p.y < lo) { lo = _p.y; best = i / 40; } }
    return best;
  }

  // S: { x, y, face, vx, vy, ground, climb, rope, swim, dead, pickF, aim, throwF, hurt, cage, ladderX }
  update(dt, S) {
    dt = Math.min(dt, 0.05); this.time += dt;
    const R = this.root;
    // ---- facing and placement
    const climb = S.climb && !S.dead, swim = S.swim && !S.dead && !climb;
    const wantYaw = S.yaw != null ? S.yaw : climb ? Math.PI / 2 : (S.face > 0 ? 0 : Math.PI);
    let dy = wantYaw - this.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * Math.min(1, dt * 13);
    this.z += ((climb ? (S.rope ? 0.26 : 0.36) : 0) - this.z) * Math.min(1, dt * 10);
    R.position.set(S.x, S.y, S.z != null ? S.z : this.z); R.rotation.set(0, this.yaw, 0);
    // ---- events
    if (S.ground && !this.wasGround && !climb && !swim) { const v = -this.prevVy; if (v > 3.5) { this.landT = 0; this.landA = clamp((v - 3.5) / 12, 0.15, 1); } }
    this.wasGround = S.ground; this.prevVy = S.vy;
    if (S.hurt) { if (S.ground && !climb && !swim && S.pickF < 0) this.hitT = 0; else this.flinchT = 0; }
    this.landT += dt; this.hitT += dt; this.flinchT += dt;
    this.climbW += ((climb ? 1 : 0) - this.climbW) * Math.min(1, dt * 9);
    this.swimW += ((swim ? 1 : 0) - this.swimW) * Math.min(1, dt * 5);
    // ---- clip weights
    const W = {}; for (const k in this.act) W[k] = 0;
    const sp = Math.abs(S.vx);
    if (S.dead) {
      if (this.deadT < 0) { this.deadT = 0; const k = this.act.ko; k.reset(); k.play(); k.timeScale = 1.15; }
      this.deadT += dt; W.ko = 1;
    } else {
      if (this.deadT >= 0) this.deadT = -1;
      if (climb || swim || S.cage) { W[this.idleName] = 1; this.idleT = 0; }
      else if (!S.ground) {
        W.jump = 1;
        const jv = 11.2, t = S.vy > 0 ? 0.55 + (1 - clamp(S.vy / jv, 0, 1)) * 0.25 : 0.8 + clamp(-S.vy / jv, 0, 1) * 0.3;
        this.act.jump.time = t;
      } else {
        const wWalk = sstep(0.1, 0.9, sp) * (1 - sstep(2.1, 3.5, sp)), wRun = sstep(2.1, 3.5, sp), wIdle = 1 - sstep(0.1, 0.9, sp);
        W.walk = wWalk; W.run = wRun; W[this.idleName] = wIdle;
        const mw = this.meta.walk || { dur: 1.042, speed: 1.142 }, mr = this.meta.run || { dur: 0.667, speed: 3.393 };
        const rw = sp / mw.speed / mw.dur, rr = sp / mr.speed / mr.dur, k = wWalk + wRun;
        if (k > 0.001) this.phase += dt * (rw * wWalk + rr * wRun) / k;
        this.act.walk.time = ((this.phase + this.phaseOff.walk) % 1) * this.act.walk.getClip().duration;
        this.act.run.time = ((this.phase + this.phaseOff.run) % 1) * this.act.run.getClip().duration;
        // a landing: the motion-captured landing crouch, faded out (less of it when running on)
        if (this.landT < 0.42) {
          const wl = (1 - this.landT / 0.42) * this.landA * (1 - sstep(1.5, 3.5, sp) * 0.7);
          for (const n in W) W[n] *= 1 - wl; W.jump = wl; this.act.jump.time = 1.12 + this.landT * 1.15;
        }
        // a hit: the motion-captured flinch for half a second
        if (this.hitT < 0.55) {
          if (this.hitT < dt * 1.5) { const h = this.act.hit; h.reset(); h.play(); h.time = 0.05; h.timeScale = 1.2; }
          const wh = 0.85 * (1 - sstep(0.3, 0.55, this.hitT));
          for (const n in W) W[n] *= 1 - wh; W.hit = wh;
        }
        // idle: now and then a look round
        if (wIdle > 0.95) { this.idleT += dt; if (this.idleT > 9 && this.idleName === 'idle_breathe_01' && this.act.idle_look_around_01) { this.idleName = 'idle_look_around_01'; this.act.idle_look_around_01.reset().play(); } }
        else { this.idleT = 0; if (this.idleName !== 'idle_breathe_01') this.idleName = 'idle_breathe_01'; }
        if (this.idleName === 'idle_look_around_01' && this.act.idle_look_around_01.time > this.act.idle_look_around_01.getClip().duration - 0.3) { this.idleName = 'idle_breathe_01'; this.idleT = 0; }
        if (this.idleName === 'idle_look_around_01') { W.idle_look_around_01 = W.idle_breathe_01; W.idle_breathe_01 = 0; }
      }
    }
    // smooth the weights (the walk/run blend and the timed overlays are already smooth)
    const fast = new Set(['walk', 'run', 'jump', 'hit']);
    let tot = 0;
    for (const n in this.act) { const k = fast.has(n) ? 18 : 8; this.w[n] += ((W[n] || 0) - this.w[n]) * Math.min(1, dt * k); tot += this.w[n]; }
    for (const n in this.act) this.act[n].setEffectiveWeight(tot > 0 ? this.w[n] / tot : 0);
    // ---- run the mixer from the pose it last wrote
    for (const s of this.saved) { s.o.quaternion.copy(s.q); s.o.position.copy(s.p); }
    this.mixer.update(dt);
    for (const s of this.saved) { s.q.copy(s.o.quaternion); s.p.copy(s.o.position); }
    // steady the arms in the air (and on a hard landing) so the pick does not fly about
    if (this.airArms && !S.dead) {
      const wa = this.w.jump * 0.7;
      if (wa > 0.01) this.armBones.forEach((o, i) => o.quaternion.slerp(this.airArms[i], wa));
    }
    R.updateMatrixWorld(true);
    // ---- procedural layers
    if (this.climbW > 0.01) this.blendIn(() => this.climbPose(S, 1), this.climbW);
    if (this.swimW > 0.01) this.blendIn(() => this.swimPose(S, dt, 1), this.swimW);
    if (this.landT < 0.4 && !S.dead && this.climbW < 0.5 && this.swimW < 0.5) this.dip(Math.sin(Math.PI * clamp(this.landT / 0.4, 0, 1)) * 0.06 * this.landA);
    if (this.flinchT < 0.3 && !S.dead) this.bendSpine(-0.35 * Math.sin(Math.PI * this.flinchT / 0.3), 0);
    // the head follows where the pick is aimed
    if (!S.dead && this.climbW < 0.5 && this.swimW < 0.5 && S.pickF < 0) this.lookPitch(S.aim === 1 ? -0.35 : S.aim === -1 ? 0.35 : 0, dt);
    this.swingW += ((S.pickF >= 0 && !S.dead ? 1 : 0) - this.swingW) * Math.min(1, dt * (S.pickF >= 0 ? 30 : 9));
    if (this.swingW > 0.01) this.swingPose(S, this.swingW);
    this.throwW += ((S.throwF >= 0 && !S.dead ? 1 : 0) - this.throwW) * Math.min(1, dt * (S.throwF >= 0 ? 30 : 9));
    if (this.throwW > 0.01 && this.climbW < 0.5) this.throwPose(S, this.throwW);
    // hands: the right one always grips the pick, the left grips on ladders, ropes and swings
    const gripL = Math.max(this.climbW, this.swingW, S.dead ? 0 : 0) * 1.15 + (1 - Math.max(this.climbW, this.swingW)) * 0.3;
    this.curl('R', S.dead ? 0.35 : this.swimW > 0.5 ? 0.15 : this.climbW > 0.5 ? gripL : 1.15); this.curl('L', this.swimW > 0.5 ? 0.15 : gripL);
    // ---- the pickaxe: in the right hand, or flying through its swing
    this.pickHold.updateWorldMatrix(true, false);
    _m.copy(this.pickHold.matrixWorld);
    this.stowW += ((Math.max(this.climbW, this.swimW) > 0.5 && this.swingW < 0.1 ? 1 : 0) - this.stowW) * Math.min(1, dt * 7);
    if (this.stowW > 0.01) {
      this.stow.updateWorldMatrix(true, false);
      _m.decompose(_a, _q, _s); this.stow.matrixWorld.decompose(_b, _q2, _s);
      const k = ease(this.stowW); _a.lerp(_b, k); _q.slerp(_q2, k); _m.compose(_a, _q, _s.set(1, 1, 1));
    }
    R.updateMatrixWorld(true);
    this.pickRoot.matrixAutoUpdate = false;
    this.pickRoot.matrix.copy(_m2.copy(R.matrixWorld).invert().multiply(_m));
    this.pickRoot.matrixWorldNeedsUpdate = true;
  }

  // run a full-body procedural pose, then cross-fade to it from the motion-captured pose by w
  blendIn(fn, w) {
    if (w > 0.995) { fn(); return; }
    const snap = this.snap || (this.snap = this.allBones.map((o) => ({ o, q: Q(), p: V() })));
    for (const s of snap) { s.q.copy(s.o.quaternion); s.p.copy(s.o.position); }
    fn();
    for (const s of snap) { _q.copy(s.o.quaternion); s.o.quaternion.copy(s.q).slerp(_q, w); _p.copy(s.o.position); s.o.position.copy(s.p).lerp(_p, w); }
    this.root.updateMatrixWorld(true);
  }

  // ------------------------------------------------------------------ layers
  curl(s, amt) {
    for (const j of this.hand[s].joints) {
      const bl = this.bindLocal.get(j.o);
      j.o.quaternion.copy(bl.q).multiply(_q.setFromAxisAngle(j.axis, j.sign * amt * j.k * 1.05));
    }
  }
  // world-space frame of the digger: forward, up, right (toward the camera when facing +X)
  frame() {
    this.root.getWorldQuaternion(_q);
    return { f: new THREE.Vector3(1, 0, 0).applyQuaternion(_q), u: new THREE.Vector3(0, 1, 0), r: new THREE.Vector3(0, 0, 1).applyQuaternion(_q) };
  }
  toWorld(x, y, z, out = V()) { return out.set(x, y, z).applyMatrix4(this.root.matrixWorld); }
  bendSpine(a, twist) {
    const { r } = this.frame();
    for (const o of this.spineBend) { if (a) rotateWorld(o, _q.setFromAxisAngle(r, -a / 2)); if (twist) rotateWorld(o, _q.setFromAxisAngle(_u.set(0, 1, 0), twist / 2)); }
  }
  lookPitch(a, dt) {
    this.look = lerp(this.look || 0, a, Math.min(1, dt * 8));
    if (Math.abs(this.look) < 0.01) return;
    const { r } = this.frame(); rotateWorld(this.neck, _q.setFromAxisAngle(r, -this.look * 0.4)); rotateWorld(this.head, _q.setFromAxisAngle(r, -this.look * 0.6));
  }
  // lower the hips and keep the feet where they were
  dip(d) {
    if (d <= 0.001) return;
    const fL = this.leg.L[2].getWorldPosition(V()), fR = this.leg.R[2].getWorldPosition(V());
    this.pelvis.getWorldPosition(_p); _p.y -= d; setWorldPos(this.pelvis, _p);
    const { f } = this.frame();
    ik2(...this.leg.L, fL, f, this.hinge.legL); ik2(...this.leg.R, fR, f, this.hinge.legR);
  }
  // reset a set of bones to their bind rotation (upright, neutral) before a full-body procedural pose
  neutral(list, w) { for (const o of list) { const bl = this.bindLocal.get(o); o.quaternion.slerp(bl.q, w); } this.root.updateMatrixWorld(true); }

  climbPose(S, w) {
    const sp = S.rope ? 0.42 : 0.5, rail = S.rope ? 0 : 0.19;
    const cx = S.ladderX, c = (S.y - 0.25) / sp, zr = 0.05;
    // each limb holds its rung, then reaches two rungs on: left hand with right foot, right hand with left foot
    const limb = (o, b) => { const k = (c + o) / 2, fr = k - Math.floor(k); return 0.25 + (2 * Math.floor(k) - o + b + 2 * sstep(0.6, 0.92, fr)) * sp; };
    const hL = limb(0, 4), hR = limb(1, 4), fR = limb(0, 1), fL = limb(1, 1);
    const { f, r } = this.frame();
    // body: upright, hips a little back from the rungs, leaning in
    this.neutral([this.pelvis, ...this.spine, this.neck, this.head, ...this.arm.L.slice(0, 2), ...this.arm.R.slice(0, 2), ...this.leg.L, ...this.leg.R, this.B.LClavicle, this.B.RClavicle], w);
    const bob = Math.sin(c * Math.PI) * 0.03;
    _p.set(S.x + (cx - S.x) * w, S.y + 0.88 + bob, 0); this.pelvis.getWorldPosition(_a); _p.z = lerp(_a.z, this.root.position.z, w);
    _p.x = lerp(_a.x, _p.x, w); _p.y = lerp(_a.y, _p.y, w); setWorldPos(this.pelvis, _p);
    this.bendSpine(0.12 * w, 0);
    if (!S.rope) { rotateWorld(this.neck, _q.setFromAxisAngle(r, 0.25 * w)); }
    const hand = (y, side) => V().set(cx + side * (rail || 0.03), y, zr + 0.04);
    const foot = (y, side) => V().set(cx + side * (S.rope ? 0.05 : 0.13), y + 0.06, zr + 0.13);
    // left/right in world: the digger faces -Z, so his left is -X
    const out = V().copy(r).multiplyScalar(-1);   // r points to his right
    const down = V().set(0, -1, 0);
    ik2(...this.arm.L, hand(hL, -1), _v.copy(down).add(V().copy(r).multiplyScalar(-0.6)).add(f.clone().multiplyScalar(-0.3)), this.hinge.armL, w);
    ik2(...this.arm.R, hand(S.rope ? hR - 0.0 : hR, 1), _v.copy(down).add(V().copy(r).multiplyScalar(0.6)).add(f.clone().multiplyScalar(-0.3)), this.hinge.armR, w);
    ik2(...this.leg.L, foot(fL, -1), V().copy(f).add(V().copy(r).multiplyScalar(-0.3)), this.hinge.legL, w);
    ik2(...this.leg.R, foot(fR, 1), V().copy(f).add(V().copy(r).multiplyScalar(0.3)), this.hinge.legR, w);
    void out;
  }

  swimPose(S, dt, w) {
    const moving = clamp((Math.abs(S.vx) + Math.abs(S.vy) * 0.6) / 1.6, 0, 1);
    this.swimPh += dt * lerp(0.7, 1.35, moving);
    const ph = this.swimPh % 1, tau = Math.PI * 2;
    const pitch = lerp(0.25, 1.25, moving * clamp(Math.abs(S.vx) / (Math.abs(S.vx) + Math.abs(S.vy) + 0.2), 0, 1));
    this.neutral([this.pelvis, ...this.spine, this.neck, this.head, ...this.arm.L.slice(0, 2), ...this.arm.R.slice(0, 2), ...this.leg.L, ...this.leg.R, this.B.LClavicle, this.B.RClavicle], w);
    const { f, r } = this.frame();
    // tip the whole body forward about the hips, and float it
    rotateWorld(this.pelvis, _q.setFromAxisAngle(r, -pitch * w));
    _p.set(S.x - f.x * 0.25 * pitch, S.y + 0.72 - pitch * 0.12, 0); this.pelvis.getWorldPosition(_a); _a.lerp(_p, w); setWorldPos(this.pelvis, _a);
    this.head.getWorldPosition(_b); rotateWorld(this.neck, _q.setFromAxisAngle(r, 0.5 * pitch * w));   // head up to breathe
    // the body's own axes now: along the spine (bf), belly-down (bd)
    this.spine[2].getWorldPosition(_c); this.pelvis.getWorldPosition(_a);
    const bf = V().subVectors(_c, _a).normalize(), bd = V().crossVectors(bf, r).normalize();
    // breaststroke: reach forward together, sweep out, draw in to the chest, push forward again
    const a = 0.5 + 0.5 * Math.cos(tau * ph), sw = Math.max(0, Math.sin(tau * ph)), amp = lerp(0.45, 1, moving);
    for (const side of [-1, 1]) {
      const A = side < 0 ? this.arm.L : this.arm.R;
      A[0].getWorldPosition(_t);
      const tgt = V().copy(_t).addScaledVector(bf, (0.12 + 0.42 * a) * amp + 0.05).addScaledVector(r, side * (0.12 + 0.28 * sw * amp)).addScaledVector(bd, 0.22 - 0.08 * a);
      ik2(...A, tgt, V().copy(bd).multiplyScalar(-0.3).addScaledVector(r, side).addScaledVector(bf, -0.6), side < 0 ? this.hinge.armL : this.hinge.armR, w);
    }
    // frog kick, half a cycle behind the arms
    const k = 0.5 + 0.5 * Math.cos(tau * (ph + 0.5));
    for (const side of [-1, 1]) {
      const L = side < 0 ? this.leg.L : this.leg.R;
      L[0].getWorldPosition(_t);
      const tgt = V().copy(_t).addScaledVector(bf, -(0.86 - 0.42 * k * amp)).addScaledVector(r, side * (0.1 + 0.2 * k * amp)).addScaledVector(bd, 0.12 * k);
      ik2(...L, tgt, V().copy(bd).multiplyScalar(-1).addScaledVector(r, side * 0.8), side < 0 ? this.hinge.legL : this.hinge.legR, w);
    }
  }

  // a two-handed pickaxe swing: wind up behind the head, strike forward (or up at the roof, or down at the floor)
  swingPose(S, w) {
    const f = S.pickF >= 0 ? S.pickF : 1, aim = S.aim;
    const wind = aim === 1 ? 2.0 : aim === -1 ? -0.55 : -0.7;
    const strike = aim === 1 ? 0.18 : aim === -1 ? 2.6 : 1.72;
    let th, cock;
    if (f < 0.4) { const e = ease(f / 0.4); th = lerp(aim === 1 ? 1.5 : 0.9, wind, e); cock = -0.6 * e; }
    else if (f < 0.58) { const e = Math.pow((f - 0.4) / 0.18, 1.6); th = lerp(wind, strike, e); cock = lerp(-0.6, 0.15, e); }
    else { th = strike - Math.sin((f - 0.58) / 0.42 * Math.PI) * 0.08 * (aim === 1 ? -1 : 1); cock = 0.15; }
    const reach = f < 0.4 ? lerp(0.45, 0.36, ease(f / 0.4)) : lerp(0.36, aim === 1 ? 0.5 : 0.6, sstep(0.4, 0.58, f));
    // body: lean back on the wind-up, drive forward through the strike, crouch for a floor strike
    const drive = f < 0.4 ? -0.18 * ease(f / 0.4) : f < 0.58 ? lerp(-0.18, aim === -1 ? 0.55 : aim === 1 ? -0.3 : 0.32, (f - 0.4) / 0.18) : (aim === -1 ? 0.55 : aim === 1 ? -0.3 : 0.32);
    this.bendSpine(drive * w, 0);
    if (aim === -1 && f > 0.35) this.dip(0.16 * w * sstep(0.35, 0.58, f));
    // hands on the handle: the right at the end, the left a hand's width up
    const pivot = this.toWorld(0.08, this.shoulderH - 0.08 - (aim === -1 && f > 0.4 ? 0.12 : 0), 0.0);
    const { f: fw, u, r } = this.frame();
    const dir = (a) => V().copy(fw).multiplyScalar(Math.sin(a)).addScaledVector(u, Math.cos(a));
    const hands = V().copy(pivot).addScaledVector(dir(th), reach).addScaledVector(r, 0.02);
    const hd = dir(th + cock);
    const dirSign = (strike > wind ? 1 : -1);
    const tangent = V().copy(fw).multiplyScalar(Math.cos(th + cock)).addScaledVector(u, -Math.sin(th + cock)).multiplyScalar(dirSign);
    const Y = tangent.clone().negate(); const X = hd.clone(); Y.addScaledVector(X, -Y.dot(X)).normalize(); const Z = V().crossVectors(X, Y);
    const M = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(hands);
    const poleR = V().set(0, -1, 0).addScaledVector(r, 0.7).addScaledVector(fw, -0.4), poleL = V().set(0, -1, 0).addScaledVector(r, -0.7).addScaledVector(fw, -0.4);
    const grip = (side, Mx, target, pole, hingeL) => {
      const A = this.arm[side], h = this.hand[side];
      const handQ = new THREE.Quaternion().setFromRotationMatrix(Mx).multiply(h.gripQ.clone().invert());
      A[2].getWorldScale(_s);
      const off = V().setFromMatrixPosition(h.local).multiply(_s).applyQuaternion(handQ);
      ik2(...A, target.clone().sub(off), pole, hingeL, w);
      A[2].getWorldQuaternion(_q); _q.slerp(handQ, w); setWorldQuat(A[2], _q);
    };
    // the right hand takes the handle's end; the pick then simply rides in it
    grip('R', M, hands, poleR, this.hinge.armR);
    // the left hand grips a hand's width up the handle where it really is now, palm facing the right one
    this.pickHold.updateWorldMatrix(true, false);
    const G = this.pickHold.matrixWorld;
    const leftT = V().setFromMatrixPosition(G).add(V().setFromMatrixColumn(G, 0).normalize().multiplyScalar(0.27));
    const MF = new THREE.Matrix4().extractRotation(G).multiply(new THREE.Matrix4().makeRotationX(Math.PI)).setPosition(leftT);
    grip('L', MF, leftT, poleL, this.hinge.armL);
    return true;
  }

  // an overhand throw with the left arm
  throwPose(S, w) {
    const f = S.throwF >= 0 ? S.throwF : 1;
    let x, y;
    if (f < 0.45) { const e = ease(f / 0.45); x = lerp(0.05, -0.28, e); y = lerp(1.05, 1.78, e); }
    else if (f < 0.7) { const e = (f - 0.45) / 0.25; x = lerp(-0.28, 0.5, e); y = lerp(1.78, 1.62, e); }
    else { const e = (f - 0.7) / 0.3; x = lerp(0.5, 0.35, e); y = lerp(1.62, 1.1, e); }
    this.bendSpine(0, (f < 0.45 ? -0.35 * ease(f / 0.45) : lerp(-0.35, 0.3, clamp((f - 0.45) / 0.3, 0, 1))) * w);
    const tgt = this.toWorld(x, y, -0.2);
    const { r, f: fw } = this.frame();
    ik2(...this.arm.L, tgt, V().set(0, -1, 0).addScaledVector(r, -0.8).addScaledVector(fw, -0.5), this.hinge.armL, w);
  }
}
