// Bone helpers for the infected rigs (UE-Manny-like names from tools/creatures/za_rig.py).
// Axis conventions measured on the exported rig (local, relative to the rest pose):
//   upperarm/lowerarm: +X raises the arm forward (flexion); hand: +X flexes the wrist toward the palm side
//   fingers (index..pinky _01.._03): -X curls into the palm; thumb similar on its own axes
//   jaw: -X opens; head/neck: +X nods forward (chin down), Y turns, Z tilts (ear toward shoulder)
//   spine_*: +X bends forward; thigh: -X lifts the leg forward; calf: +X bends the knee
import * as THREE from 'three';

const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _m = new THREE.Matrix4();
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

export class Rig {
  constructor(root) {
    this.root = root;
    this.bones = {};
    root.traverse((o) => { if (o.isBone) this.bones[o.name] = o; });
    this.rest = {};
    this.restPos = {};
    for (const [n, b] of Object.entries(this.bones)) { this.rest[n] = b.quaternion.clone(); this.restPos[n] = b.position.clone(); }
  }
  reset() {
    for (const [n, b] of Object.entries(this.bones)) { b.quaternion.copy(this.rest[n]); b.position.copy(this.restPos[n]); b.scale.set(1, 1, 1); }
  }
  // compose local-axis rotations (degrees) onto the CURRENT local rotation
  rot(name, x = 0, y = 0, z = 0) {
    const b = this.bones[name];
    if (!b) return;
    if (x) b.quaternion.multiply(_q.setFromAxisAngle(AX.x, x * Math.PI / 180));
    if (y) b.quaternion.multiply(_q.setFromAxisAngle(AX.y, y * Math.PI / 180));
    if (z) b.quaternion.multiply(_q.setFromAxisAngle(AX.z, z * Math.PI / 180));
  }
  // rotate a bone so its +Y (bone direction) points from its head toward a world target, blended by w
  aim(name, worldTarget, w = 1) {
    const b = this.bones[name];
    if (!b || w <= 0) return;
    b.updateWorldMatrix(true, false);
    const head = new THREE.Vector3().setFromMatrixPosition(b.matrixWorld);
    const want = worldTarget.clone().sub(head).normalize();
    const cur = new THREE.Vector3(0, 1, 0).applyQuaternion(b.getWorldQuaternion(new THREE.Quaternion())).normalize();
    const delta = new THREE.Quaternion().setFromUnitVectors(cur, want);
    if (w < 1) delta.slerp(new THREE.Quaternion(), 1 - w);
    // apply delta in world space: local = parentInv * delta * world
    const parentQ = b.parent.getWorldQuaternion(new THREE.Quaternion());
    const worldQ = b.getWorldQuaternion(new THREE.Quaternion());
    const newWorld = delta.multiply(worldQ);
    b.quaternion.copy(parentQ.invert().multiply(newWorld));
  }
  // turn a bone so its local +Z (the face, for head/neck) points at a world target, keeping its current up,
  // blended by w. Absolute: compensates whatever the spine/neck already did.
  lookAt(name, target, w = 1) {
    const b = this.bones[name];
    if (!b || w <= 0) return;
    b.updateWorldMatrix(true, false);
    const pos = new THREE.Vector3().setFromMatrixPosition(b.matrixWorld);
    const qW = b.getWorldQuaternion(new THREE.Quaternion());
    const curU = new THREE.Vector3(0, 1, 0).applyQuaternion(qW);
    const f = target.clone().sub(pos).normalize();
    const r = new THREE.Vector3().crossVectors(curU, f);
    if (r.lengthSq() < 1e-8) return;
    r.normalize();
    const u = new THREE.Vector3().crossVectors(f, r).normalize();
    const qD = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(r, u, f));
    const qNew = qW.clone().slerp(qD, w);
    const parentQ = b.parent.getWorldQuaternion(new THREE.Quaternion());
    b.quaternion.copy(parentQ.invert().multiply(qNew));
  }
  // two-bone IK (upper -> lower -> end) reaching a world target; pole = world point the elbow/knee bends toward
  ik(upper, lower, end, target, pole, w = 1) {
    const A = this.bones[upper], B = this.bones[lower], C = this.bones[end];
    if (!A || !B || !C || w <= 0) return;
    this.root.updateMatrixWorld(true);
    const a = new THREE.Vector3().setFromMatrixPosition(A.matrixWorld);
    const b = new THREE.Vector3().setFromMatrixPosition(B.matrixWorld);
    const c = new THREE.Vector3().setFromMatrixPosition(C.matrixWorld);
    const lab = a.distanceTo(b), lbc = b.distanceTo(c);
    const t = a.clone().lerp(target, 1).sub(a);
    let lat = Math.min(t.length(), (lab + lbc) * 0.999);
    t.setLength(lat);
    const T = a.clone().add(t);
    // elbow position: in the plane (a, T, pole)
    const cosA = Math.max(-1, Math.min(1, (lab * lab + lat * lat - lbc * lbc) / (2 * lab * lat)));
    const dir = t.clone().normalize();
    const pdir = pole.clone().sub(a);
    pdir.sub(dir.clone().multiplyScalar(pdir.dot(dir))).normalize();
    const elbow = a.clone().add(dir.clone().multiplyScalar(Math.cos(Math.acos(cosA)) * lab)).add(pdir.multiplyScalar(Math.sin(Math.acos(cosA)) * lab));
    const fullElbow = elbow, fullEnd = T;
    if (w < 1) {
      fullElbow.lerp(b, 1 - w);
      fullEnd.lerp(c, 1 - w);
    }
    this.aim(upper, fullElbow, 1);
    this.root.updateMatrixWorld(true);
    this.aim(lower, fullEnd, 1);
  }
  // curl the four fingers (0 open .. 1 fist) and the thumb, side 'l' | 'r'
  grip(side, amount, spread = 0) {
    for (const [f, k] of [['index', 1.0], ['middle', 1.05], ['ring', 1.1], ['pinky', 1.15]]) {
      this.rot(`${f}_01_${side}`, -62 * amount * k, 0, (f === 'index' ? -1 : f === 'pinky' ? 1 : 0) * spread * 8);
      this.rot(`${f}_02_${side}`, -78 * amount * k);
      this.rot(`${f}_03_${side}`, -48 * amount * k);
    }
    this.rot(`thumb_01_${side}`, -18 * amount, 0, 0);
    this.rot(`thumb_02_${side}`, -25 * amount);
    this.rot(`thumb_03_${side}`, -35 * amount);
  }
  worldPos(name, out = new THREE.Vector3()) {
    const b = this.bones[name];
    b.updateWorldMatrix(true, false);
    return out.setFromMatrixPosition(b.matrixWorld);
  }
}
