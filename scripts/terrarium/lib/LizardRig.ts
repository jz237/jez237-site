import * as THREE from 'three';
import {LizardModel, LIZARD_SCALE, LizardLimbData} from './LizardModel';

/**
 * Procedural skeleton for the agamid. The brain sets intentions (where the
 * body is, which way it faces, how fast it goes, where it looks); the rig turns
 * them into bone matrices every frame:
 *  - trot-like gait with diagonal limb pairs, planted feet, heel peel and toe roll
 *  - two-bone IK for each sprawling limb with an outward elbow/knee
 *  - a standing wave in the trunk synchronised with the steps, head stabilised
 *  - a simulated tail that drags on the ground and follows the body's path
 *  - breathing, gular pumping, beard display, jaw, tongue, blinking eyes
 * Units: the sculpt is in centimetres; the scene is in metres.
 */

export interface GroundQuery {
  heightAt(x: number, z: number): number;
  normalAt(x: number, z: number, out?: THREE.Vector3): THREE.Vector3;
}

const K = LIZARD_SCALE; // metres per sculpt centimetre
const UP = new THREE.Vector3(0, 1, 0);
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpV3 = new THREE.Vector3();
const tmpM = new THREE.Matrix4(), tmpM2 = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (t: number) => t * t * (3 - 2 * t);

function frameMatrix(x: THREE.Vector3, upHint: THREE.Vector3, out: THREE.Matrix4) {
  const X = tmpV.copy(x).normalize();
  const Z = tmpV2.crossVectors(X, upHint);
  if (Z.lengthSq() < 1e-8) Z.crossVectors(X, new THREE.Vector3(0, 0, 1));
  Z.normalize();
  const Y = tmpV3.crossVectors(Z, X).normalize();
  return out.makeBasis(X, Y, Z);
}

interface Leg {
  data: LizardLimbData;
  front: boolean;
  side: number;
  offset: number;
  planted: THREE.Vector3; // hand-bone origin on the ground (world)
  plantedYaw: number;
  normal: THREE.Vector3;
  swing: boolean;
  swingT: number;
  swingDur: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  fromYaw: number;
  toYaw: number;
  heel: number; // 0 flat .. 1 heel raised (late stance)
  homeLocal: THREE.Vector3; // hand origin in the body frame (sculpt cm)
  lastPhase: number;
  liftScale: number;
  wristAbove: number; // wrist height above the hand origin (cm)
  digitRel: THREE.Matrix4[];
  handBindInv: THREE.Matrix4;
  bindUpper: THREE.Matrix4;
  bindLower: THREE.Matrix4;
  reach: number;
  forcedStep: boolean;
}

export interface RigInputs {
  /** body centre on the ground (x, z); y is solved from the surface */
  x: number; z: number;
  heading: number; // radians, 0 = +X, positive turns toward -Z (left)
  speed: number; // m/s along the heading
  turnRate: number; // rad/s
  clearance: number; // belly clearance in sculpt cm (0 = lying flat)
  chestLift: number; // extra chest height (cm) from straightened front legs
  headPitch: number; // radians, positive = head up (added to look)
  look: THREE.Vector3 | null; // world point to look at
  jaw: number; // 0..1
  tongue: number; // 0..1
  display: number; // 0..1 beard puff
  lid: number; // 1 open .. 0 closed (combined with blinks)
  breath: number; // breathing depth multiplier
  lunge: number; // 0..1 forward thrust of head and chest
  bob: number; // head-bob offset in cm (push-ups)
  wave: number; // 0..1 arm-wave amount (left front limb)
  sideLean: number; // body roll, radians
  tailTwitch: number; // 0..1 predatory flicking of the tail tip
}

export class LizardRig {
  readonly inputs: RigInputs = {
    x: 0, z: 0, heading: 0, speed: 0, turnRate: 0, clearance: 0.7, chestLift: 0, headPitch: 0,
    look: null, jaw: 0, tongue: 0, display: 0, lid: 1, breath: 1, lunge: 0, bob: 0, wave: 0, sideLean: 0, tailTwitch: 0,
  };
  /** Gait phase 0..1 and the derived standing wave in the trunk. */
  phase = 0;
  private bend = 0;
  private bodyY = 0;
  private bodyPitch = 0;
  private bodyRoll = 0;
  private legs: Leg[] = [];
  private spineNames = ['head', 'neck', 'chest', 'spine2', 'spine1', 'pelvis'];
  private spineIdx: number[];
  private spineBindX: number[];
  private spineBindY: number[];
  private tailIdx: number[];
  private tailBind: THREE.Vector3[];
  private tailPts: THREE.Vector3[] = [];
  private tailPrev: THREE.Vector3[] = [];
  private tailLen: number[] = [];
  private tailRadius: number[] = [];
  private bindTilt: THREE.Matrix4[] = [];
  private boneWorld: THREE.Matrix4[];
  private headLift = [0, 0];
  private headYaw = 0;
  private headPitchCur = 0;
  private headGoalYaw = 0;
  private headGoalPitch = 0;
  private headHold = 0;
  private blinkT = 2;
  private blink = 0;
  private time = 0;
  private gularT = 0;
  private eyeLook = new THREE.Euler();
  private eyeGoal = new THREE.Euler();
  private eyeHold = 0;
  readonly rootX = 4.1; // sculpt x of the body centre
  /** World position of the snout tip, updated each frame. */
  readonly snout = new THREE.Vector3();
  readonly headForward = new THREE.Vector3(1, 0, 0);
  readonly mouth = new THREE.Vector3();
  moving = false;
  /** 0 walking .. 1 full sprint: the body rises, the nose lifts and the tail comes off the ground. */
  private sprint = 0;
  private initialised = false;
  /** Called whenever a foot is put down (world position). */
  onFootDown?: (p: THREE.Vector3, front: boolean) => void;

  constructor(readonly model: LizardModel, readonly ground: GroundQuery) {
    const d = model.data;
    this.spineIdx = this.spineNames.map((n) => model.bone(n));
    this.spineBindX = this.spineIdx.map((i) => d.bones[i].origin[0]);
    this.spineBindY = this.spineIdx.map((i) => d.bones[i].origin[1]);
    this.tailIdx = Array.from({length: 10}, (_, i) => model.bone(`tail${i + 1}`));
    this.tailBind = this.tailIdx.map((i) => new THREE.Vector3(...(d.bones[i].origin as [number, number, number])));
    // tail tip beyond the last bone
    this.tailBind.push(new THREE.Vector3(-16.3, 0.23, 0));
    this.boneWorld = d.bones.map(() => new THREE.Matrix4());
    // Bind tilt of every spine/tail bone: its frame if it followed the bind curve.
    const chainX = [...this.spineBindX, ...this.tailBind.map((p) => p.x)];
    const chainY = [...this.spineBindY, ...this.tailBind.map((p) => p.y)];
    const chainIdx = [...this.spineIdx, ...this.tailIdx];
    chainIdx.forEach((bi, k) => {
      const a = Math.max(0, k - 1), b = Math.min(chainX.length - 1, k + 1);
      const tan = new THREE.Vector3(chainX[a] - chainX[b], chainY[a] - chainY[b], 0).normalize();
      this.bindTilt[bi] = frameMatrix(tan, UP, new THREE.Matrix4()).clone();
    });
    const pelvisX = d.bones[model.bone('pelvis')].origin[0];
    let prev = new THREE.Vector3(pelvisX, d.bones[model.bone('pelvis')].origin[1], 0);
    for (const p of this.tailBind) {
      this.tailLen.push(prev.distanceTo(p) * K);
      prev = p;
    }
    const prof = d.profile;
    const radiusAt = (x: number) => {
      const i = clamp(Math.round((x + 17.2) / 0.5), 0, prof.length - 1);
      return Math.max(prof[i][1], prof[i][3]);
    };
    this.tailRadius = this.tailBind.map((p) => radiusAt(p.x) * K * 0.85);

    const offsets: Record<string, number> = {'front-1': 0.0, 'hind1': 0.06, 'front1': 0.5, 'hind-1': 0.56};
    for (const limb of d.limbs) {
      const handBind = model.bind[limb.bones.hand];
      const front = limb.kind === 'front';
      const leg: Leg = {
        data: limb, front, side: limb.side, offset: offsets[`${limb.kind}${limb.side}`] ?? 0,
        planted: new THREE.Vector3(), plantedYaw: 0, normal: new THREE.Vector3(0, 1, 0),
        swing: false, swingT: 0, swingDur: 0.2, from: new THREE.Vector3(), to: new THREE.Vector3(), fromYaw: 0, toYaw: 0,
        heel: 0,
        homeLocal: new THREE.Vector3(limb.wrist[0] + limb.forward[0] * 0.05, 0, limb.wrist[2] * 1.02),
        lastPhase: 0, liftScale: front ? 0.55 : 0.75, wristAbove: limb.wrist[1] - 0.13,
        digitRel: limb.bones.digits.map((b) => handBind.clone().invert().multiply(model.bind[b])),
        handBindInv: handBind.clone().invert(),
        bindUpper: model.bind[limb.bones.upper].clone(),
        bindLower: model.bind[limb.bones.lower].clone(),
        reach: (limb.upperLength + limb.lowerLength) * K,
        forcedStep: false,
      };
      this.legs.push(leg);
    }
  }

  // ---------------------------------------------------------------------------
  /** Body frame (world) at the current pose: origin at the sculpt root point. */
  private body = new THREE.Matrix4();
  private bodyFwd = new THREE.Vector3();
  private bodyUp = new THREE.Vector3();
  private bodyRight = new THREE.Vector3();

  /** Converts a sculpt-space point (cm, body frame) into world space. */
  bodyToWorld(p: THREE.Vector3, out: THREE.Vector3) {
    return out.set((p.x - this.rootX) * K, p.y * K, p.z * K).applyMatrix4(this.body);
  }

  private homeWorld(leg: Leg, out: THREE.Vector3, ahead = 0) {
    const h = leg.homeLocal;
    const along = (h.x - this.rootX) * K + ahead;
    // On a narrow perch (a log) the outer support may be far below: bring the
    // foot inward until it lands on something within reach, so it grips the edge.
    const reachDown = (leg.front ? 1.9 : 2.1) * K + this.inputs.clearance * K;
    for (let k = 0; k <= 6; k++) {
      const w = 1 - k * 0.12;
      out.copy(this.bodyFwd).multiplyScalar(along).addScaledVector(this.bodyRight, h.z * K * w);
      out.x += this.inputs.x;
      out.z += this.inputs.z;
      out.y = this.ground.heightAt(out.x, out.z);
      if (this.bodyY - out.y < reachDown + 1.2 * K) return out;
    }
    // Nothing within reach: hold the foot against the side of the perch.
    out.y = Math.max(out.y, this.bodyY - reachDown);
    return out;
  }

  /** Teleports the lizard: feet planted at their homes, tail laid out behind. */
  reset() {
    const I = this.inputs;
    this.computeBodyFrame(1, true);
    for (const leg of this.legs) {
      this.homeWorld(leg, leg.planted);
      leg.plantedYaw = I.heading;
      leg.swing = false;
      this.ground.normalAt(leg.planted.x, leg.planted.z, leg.normal);
    }
    this.tailPts = [];
    this.tailPrev = [];
    const pelvis = this.bodyToWorld(new THREE.Vector3(0.9, this.spineBindY[5], 0), new THREE.Vector3());
    let p = pelvis.clone();
    for (let i = 0; i < this.tailBind.length; i++) {
      p = p.clone().addScaledVector(this.bodyFwd, -this.tailLen[i]);
      p.y = this.ground.heightAt(p.x, p.z) + this.tailRadius[i];
      this.tailPts.push(p.clone());
      this.tailPrev.push(p.clone());
    }
    this.initialised = true;
  }

  private computeBodyFrame(dt: number, snap = false) {
    const I = this.inputs;
    const fwd = new THREE.Vector3(Math.cos(I.heading), 0, -Math.sin(I.heading));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x); // +Z when facing +X
    // Sample the surface under the chest, pelvis and flanks.
    const c = this.ground.heightAt(I.x + fwd.x * 0.035, I.z + fwd.z * 0.035);
    const p = this.ground.heightAt(I.x - fwd.x * 0.03, I.z - fwd.z * 0.03);
    const l = this.ground.heightAt(I.x - right.x * 0.022, I.z - right.z * 0.022);
    const r = this.ground.heightAt(I.x + right.x * 0.022, I.z + right.z * 0.022);
    const mid = this.ground.heightAt(I.x, I.z);
    const base = Math.max(mid, (c + p) / 2, (l + r) / 2 - 0.004);
    const pitch = Math.atan2(c - p, 0.065) + this.sprint * 0.14;
    const roll = Math.atan2(l - r, 0.044) * 0.6 + I.sideLean;
    const bob = this.moving ? Math.abs(Math.sin(this.phase * Math.PI * 2)) * 0.18 : 0;
    // body centre height: belly clearance + half the trunk depth
    const targetY = base + (I.clearance + 1.05 + bob + this.sprint * 0.9) * K;
    if (snap) {this.bodyY = targetY; this.bodyPitch = pitch; this.bodyRoll = roll;}
    else {
      this.bodyY = damp(this.bodyY, targetY, 9, dt);
      this.bodyPitch = damp(this.bodyPitch, pitch, 7, dt);
      this.bodyRoll = damp(this.bodyRoll, roll, 6, dt);
    }
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.bodyRoll, I.heading, this.bodyPitch, 'YZX'));
    this.body.compose(new THREE.Vector3(I.x, this.bodyY - this.spineBindYAt(this.rootX) * K, I.z), q, new THREE.Vector3(1, 1, 1));
    this.bodyFwd.set(1, 0, 0).applyQuaternion(q);
    this.bodyUp.set(0, 1, 0).applyQuaternion(q);
    this.bodyRight.set(0, 0, 1).applyQuaternion(q);
  }

  private spineBindYAt(x: number) {
    const prof = this.model.data.profile;
    const i = clamp(Math.round((x + 17.2) / 0.5), 0, prof.length - 1);
    return prof[i][4];
  }

  // ---------------------------------------------------------------------------
  update(dt: number) {
    if (!this.initialised) this.reset();
    dt = Math.min(dt, 1 / 20);
    this.time += dt;
    const I = this.inputs;
    const speedCm = Math.abs(I.speed) / K;
    this.moving = speedCm > 0.6 || Math.abs(I.turnRate) > 0.25;
    this.sprint = damp(this.sprint, smooth(clamp((speedCm - 12) / 14, 0, 1)), 6, dt);
    // Stride frequency rises with speed; lizards take quick, short steps.
    const freq = clamp(1.3 + speedCm / 11, 1.3, 5.2) * (Math.abs(I.turnRate) > 0.25 && speedCm < 2 ? 1.5 : 1);
    const duty = clamp(0.68 - speedCm / 260, 0.5, 0.68);
    if (this.moving) this.phase = (this.phase + dt * freq) % 1;
    this.computeBodyFrame(dt);

    // Lateral standing wave in the trunk, synchronised with the diagonal pairs.
    const amp = this.moving ? clamp(0.05 + speedCm / 160, 0.05, 0.3) : 0;
    const steer = clamp(I.turnRate * 0.12, -0.35, 0.35);
    this.bend = damp(this.bend, -amp * Math.cos(this.phase * Math.PI * 2) + steer, 14, dt);

    this.updateHead(dt);
    this.solveSpine(dt);
    this.updateTail(dt, speedCm);
    this.updateLegs(dt, freq, duty, speedCm);
    this.updateFace(dt);
    this.commit();
  }

  private updateHead(dt: number) {
    const I = this.inputs;
    // Lizards move the head in quick saccades, then hold it still.
    let goalYaw = 0, goalPitch = 0;
    if (I.look) {
      const chestWorld = this.bodyToWorld(new THREE.Vector3(9.4, 2.6, 0), new THREE.Vector3());
      const d = I.look.clone().sub(chestWorld);
      const local = new THREE.Vector3(d.dot(this.bodyFwd), d.dot(this.bodyUp), d.dot(this.bodyRight));
      goalYaw = clamp(-Math.atan2(local.z, local.x) - this.bend * 0.6, -1.1, 1.1);
      goalPitch = clamp(Math.atan2(local.y, Math.hypot(local.x, local.z)), -0.6, 0.6);
    }
    goalPitch += I.headPitch;
    this.headHold -= dt;
    const err = Math.abs(goalYaw - this.headGoalYaw) + Math.abs(goalPitch - this.headGoalPitch);
    if (err > 0.14 || (this.headHold < 0 && err > 0.03)) {
      this.headGoalYaw = goalYaw;
      this.headGoalPitch = goalPitch;
      this.headHold = 0.4 + Math.random() * 1.2;
    }
    // fast, critically damped approach = a crisp, bird-like head flick
    this.headYaw = damp(this.headYaw, this.headGoalYaw, 16, dt);
    this.headPitchCur = damp(this.headPitchCur, this.headGoalPitch, 14, dt);
  }

  /** A point along the tail (0 = base). */
  tailPoint(i: number) {return this.tailPts[Math.min(i, this.tailPts.length - 1)] ?? this.spinePos[5];}

  /** World positions of head..pelvis (for picking). */
  spinePoints() {return this.spinePos;}

  // Positions/orientations of head..pelvis (world), computed each frame.
  private spinePos: THREE.Vector3[] = Array.from({length: 6}, () => new THREE.Vector3());
  private spineFrame: THREE.Matrix4[] = Array.from({length: 6}, () => new THREE.Matrix4());

  private solveSpine(dt: number) {
    void dt;
    const I = this.inputs;
    const b = this.bend;
    // Joint yaw (lateral) and pitch (vertical) angles from the root outward.
    // Order matches spineNames: head, neck, chest, spine2, spine1, pelvis.
    const lift = I.chestLift;
    const chestPitch = Math.atan2(lift * 0.9, 4.5) + I.lunge * 0.05;
    const neckYaw = this.headYaw * 0.45 - b * 0.55;
    const headYaw = this.headYaw * 0.55 - b * 0.25;
    const neckPitch = this.headPitchCur * 0.45 - chestPitch * 0.7;
    const headPitch = this.headPitchCur * 0.55 - chestPitch * 0.25;
    const fwdYaw = [b * 0.32, b * 0.34, neckYaw, headYaw];
    const fwdPitch = [chestPitch * 0.5, chestPitch * 0.5, neckPitch, headPitch];
    const backYaw = [b * 0.4, b * 0.4];
    const backPitch = [0, 0];
    // forward chain: root -> spine2 -> chest -> neck -> head
    const root = this.bodyToWorld(new THREE.Vector3(this.rootX, this.spineBindYAt(this.rootX), 0), new THREE.Vector3());
    const chainF = [3, 2, 1, 0];
    const chainB = [4, 5];
    const walk = (order: number[], yaws: number[], pitches: number[], dir: 1 | -1): THREE.Quaternion => {
      let pos = root.clone();
      let px = this.rootX, py = this.spineBindYAt(this.rootX);
      const q = new THREE.Quaternion().setFromRotationMatrix(tmpM.extractRotation(this.body));
      for (let k = 0; k < order.length; k++) {
        const idx = order[k];
        // rotate at this joint (before the segment leading to the next bone)
        const yaw = yaws[k] * dir, pitch = pitches[k];
        const jq = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, pitch * dir, 'YZX'));
        q.multiply(jq);
        const nx = this.spineBindX[idx], ny = this.spineBindY[idx];
        const seg = new THREE.Vector3((nx - px) * K, (ny - py) * K, 0);
        if (idx === 0) seg.x += I.lunge * 1.6 * K; // head thrust
        if (idx === 1) seg.x += I.lunge * 1.0 * K; // neck stretch
        seg.applyQuaternion(q);
        pos = pos.clone().add(seg);
        this.spinePos[idx].copy(pos);
        px = nx; py = ny;
      }
      return q;
    };
    const headQ = walk(chainF, fwdYaw, fwdPitch, 1);
    walk(chainB, backYaw, backPitch, -1);
    // head bob (push-ups) raises the front of the chain
    if (I.bob) for (const k of [0, 1, 2]) this.spinePos[k].addScaledVector(this.bodyUp, I.bob * K * (k === 2 ? 0.7 : 1));
    // Keep the head and neck above whatever lies under them (stones, roots, the log).
    for (const k of [1, 0]) {
      const p = this.spinePos[k];
      const need = this.ground.heightAt(p.x, p.z) + (k === 0 ? 0.75 : 0.95) * K;
      const lift = need - p.y;
      if (lift > 0) {
        this.headLift[k] = Math.max(this.headLift[k], lift);
      }
      this.headLift[k] = Math.max(0, this.headLift[k] - 0.02 * K);
      p.y += this.headLift[k];
      if (k === 1) this.spinePos[0].y += this.headLift[1];
    }
    // Frames from neighbouring joints (tangent toward the head).
    const snoutLocal = new THREE.Vector3(12.46 - this.spineBindX[0], 2.45 - this.spineBindY[0], 0);
    for (let k = 0; k < 6; k++) {
      let ahead: THREE.Vector3, behind: THREE.Vector3;
      if (k === 0) {
        // head direction from the accumulated chain: neck -> head extended
        ahead = this.spinePos[0].clone().add(snoutLocal.clone().multiplyScalar(K).applyQuaternion(headQ));
        behind = this.spinePos[1];
        const t = ahead.clone().sub(behind);
        frameMatrix(t, this.bodyUp, tmpM);
        this.spineFrame[0].copy(tmpM).multiply(tmpM2.copy(this.bindTilt[this.spineIdx[0]]).transpose());
        this.snout.copy(ahead);
        this.headForward.copy(t.normalize());
        continue;
      }
      ahead = k > 0 ? this.spinePos[k - 1] : this.spinePos[k];
      behind = k < 5 ? this.spinePos[k + 1] : this.tailPts.length ? this.tailPts[0] : this.spinePos[k];
      const up = this.bodyUp.clone();
      frameMatrix(ahead.clone().sub(behind), up, tmpM);
      this.spineFrame[k].copy(tmpM).multiply(tmpM2.copy(this.bindTilt[this.spineIdx[k]]).transpose());
    }
  }

  private updateTail(dt: number, speedCm: number) {
    // Follow-the-leader rope: each joint keeps its place on the ground (drag)
    // and is pulled gently straight; a small travelling wobble rides on top.
    const pelvis = this.spinePos[5];
    const back = new THREE.Vector3().copy(this.spinePos[4]).sub(pelvis);
    back.y = 0;
    back.normalize().negate();
    const N = this.tailPts.length;
    const sway = this.moving ? clamp(0.04 + speedCm / 260, 0, 0.2) : 0;
    let prev = pelvis.clone();
    let prevDir = back.clone();
    const relax = 1 - Math.exp(-dt * (this.moving ? 3.2 : 1.6));
    for (let i = 0; i < N; i++) {
      const p = this.tailPts[i];
      const L = this.tailLen[i];
      const drag = new THREE.Vector3(p.x - prev.x, 0, p.z - prev.z);
      if (drag.lengthSq() < 1e-12) drag.copy(prevDir);
      drag.normalize();
      // straighten toward the previous segment, more strongly near the base
      const straight = clamp(0.42 - i * 0.03, 0.12, 0.42);
      const dir = drag.lerp(prevDir, clamp(straight * relax * 6, 0, 1)).normalize();
      // limit the bend at each joint
      const maxBend = 0.42;
      const cross = prevDir.x * dir.z - prevDir.z * dir.x;
      const dot = prevDir.x * dir.x + prevDir.z * dir.z;
      let ang = Math.atan2(cross, dot);
      ang = clamp(ang, -maxBend, maxBend);
      // travelling wobble
      ang += Math.sin((this.phase - i * 0.11) * Math.PI * 2) * sway * 0.28;
      // a hunting lizard flicks the tip of its tail
      if (this.inputs.tailTwitch > 0 && i >= N - 4) ang += Math.sin(this.time * 19 + i * 1.3) * 0.22 * this.inputs.tailTwitch * ((i - (N - 5)) / 4);
      const ca = Math.cos(ang), sa = Math.sin(ang);
      dir.set(prevDir.x * ca - prevDir.z * sa, 0, prevDir.x * sa + prevDir.z * ca);
      // rest on the ground; the base hangs from the raised pelvis
      const gx = prev.x + dir.x * L, gz = prev.z + dir.z * L;
      // the base of the tail is carried a little clear of the ground on the move, more in a sprint
      const carry = (this.moving ? 0.25 : 0) + this.sprint * 1.6;
      const g = this.ground.heightAt(gx, gz) + this.tailRadius[i] + carry * K * Math.max(0, 1 - i / (N * 0.7)) * 0.8;
      let y = Math.max(g, prev.y - L * 0.55);
      y = Math.min(y, prev.y + L * 0.5);
      const dy = y - prev.y;
      const h = Math.sqrt(Math.max(1e-10, L * L - dy * dy));
      p.set(prev.x + dir.x * h, y, prev.z + dir.z * h);
      prevDir = dir;
      prev = p;
    }
  }

  private updateLegs(dt: number, freq: number, duty: number, speedCm: number) {
    const I = this.inputs;
    const vel = new THREE.Vector3(Math.cos(I.heading), 0, -Math.sin(I.heading)).multiplyScalar(I.speed);
    const swingDur = (1 - duty) / freq;
    const stanceDur = duty / freq;
    const home = new THREE.Vector3();
    for (const leg of this.legs) {
      const ph = (this.phase + leg.offset) % 1;
      if (leg.swing) {
        leg.swingT += dt / leg.swingDur;
        // keep re-aiming at the predicted landing spot
        const remaining = Math.max(0, 1 - leg.swingT) * leg.swingDur;
        this.homeWorld(leg, home, (I.speed * stanceDur * 0.5 + I.speed * remaining));
        leg.to.lerp(home, clamp(dt * 20, 0, 1));
        leg.toYaw = I.heading + I.turnRate * remaining;
        if (leg.swingT >= 1) {
          leg.swing = false;
          leg.planted.copy(leg.to);
          leg.planted.y = this.ground.heightAt(leg.to.x, leg.to.z);
          leg.plantedYaw = leg.toYaw;
          this.ground.normalAt(leg.planted.x, leg.planted.z, leg.normal);
          leg.forcedStep = false;
          this.onFootDown?.(leg.planted, leg.front);
        }
      } else {
        this.homeWorld(leg, home);
        const drift = home.distanceTo(leg.planted);
        const yawErr = Math.abs(wrapAngle(I.heading - leg.plantedYaw));
        const gaitLift = this.moving && ph >= duty && leg.lastPhase < duty;
        const strained = drift > leg.reach * 0.55 || yawErr > 0.9;
        // When standing still, tidy up feet that are badly out of place one at a time.
        const settle = !this.moving && (drift > 0.012 || yawErr > 0.35) && !this.legs.some((l) => l.swing);
        if (gaitLift || strained || settle) {
          leg.swing = true;
          leg.swingT = 0;
          leg.swingDur = this.moving ? swingDur : 0.16;
          leg.from.copy(leg.planted);
          leg.fromYaw = leg.plantedYaw;
          this.homeWorld(leg, leg.to, this.moving ? I.speed * (stanceDur * 0.5 + swingDur) : 0);
          leg.toYaw = I.heading;
        }
      }
      leg.lastPhase = ph;
      // Heel peel during the last fifth of stance.
      const peel = this.moving && !leg.swing ? smooth(clamp((ph - (duty - 0.18)) / 0.18, 0, 1)) : 0;
      leg.heel = damp(leg.heel, leg.swing ? 0.35 : peel, 20, dt);
    }
    void vel; void speedCm;
  }

  private updateFace(dt: number) {
    const I = this.inputs;
    // blinks: the lower lid rises, quickly
    this.blinkT -= dt;
    if (this.blinkT < 0) {
      this.blink = 1;
      this.blinkT = 2.5 + Math.random() * 6;
    }
    this.blink = Math.max(0, this.blink - dt * 4.5);
    const b = this.blink > 0 ? Math.sin(this.blink * Math.PI) : 0;
    const open = clamp(I.lid * (1 - b), 0, 1);
    for (const e of this.model.eyes) e.open.value = open;
    // eyes make their own small saccades
    this.eyeHold -= dt;
    if (this.eyeHold < 0) {
      this.eyeGoal.set((Math.random() - 0.5) * 0.25, 0, (Math.random() - 0.5) * 0.35);
      this.eyeHold = 0.6 + Math.random() * 2;
    }
    this.eyeLook.x = damp(this.eyeLook.x, this.eyeGoal.x, 20, dt);
    this.eyeLook.z = damp(this.eyeLook.z, this.eyeGoal.z, 20, dt);
    for (const e of this.model.eyes) e.look.set(this.eyeLook.x, 0, this.eyeLook.z * e.side);
    this.gularT += dt;
  }

  // ---------------------------------------------------------------------------
  private setBone(i: number, pos: THREE.Vector3, rot: THREE.Matrix4, sy = 1, sz = 1) {
    const m = this.boneWorld[i];
    m.copy(rot);
    m.scale(new THREE.Vector3(K, K * sy, K * sz));
    m.setPosition(pos);
    // Bones carry: world = T(pos) * R * S * inverse(bind) — inverse bind is in the skeleton.
    this.model.bones[i].matrix.copy(m);
  }

  private commit() {
    const I = this.inputs;
    const model = this.model;
    const breathe = Math.sin(this.time * Math.PI * 2 / 2.6) * 0.5 + 0.5;
    const flank = 1 + 0.035 * breathe * I.breath;
    // spine
    for (let k = 0; k < 6; k++) {
      const bi = this.spineIdx[k];
      const sy = k === 2 || k === 3 ? 1 + (flank - 1) * 0.6 : 1;
      const sz = k === 2 || k === 3 || k === 4 ? flank : 1;
      this.setBone(bi, this.spinePos[k], this.spineFrame[k], sy, sz);
    }
    // tail
    for (let i = 0; i < this.tailIdx.length; i++) {
      const bi = this.tailIdx[i];
      const ahead = i === 0 ? this.spinePos[5] : this.tailPts[i - 1];
      const behind = this.tailPts[Math.min(i + 1, this.tailPts.length - 1)];
      frameMatrix(tmpV3.copy(ahead).sub(behind), this.bodyUp, tmpM);
      const rot = tmpM.clone().multiply(tmpM2.copy(this.bindTilt[bi]).transpose());
      this.setBone(bi, this.tailPts[i], rot);
    }
    // jaw and gular hang from head and neck
    const head = model.bone('head'), neck = model.bone('neck');
    const headM = this.boneWorld[head];
    const jawIdx = model.bone('jaw'), gIdx = model.bone('gular');
    const hb = model.data.bones[head].origin, jb = model.data.bones[jawIdx].origin;
    const jawM = headM.clone().multiply(tmpM.makeTranslation(jb[0] - hb[0], jb[1] - hb[1], jb[2] - hb[2])).multiply(tmpM2.makeRotationZ(-I.jaw * 0.55));
    model.bones[jawIdx].matrix.copy(jawM);
    this.boneWorld[jawIdx].copy(jawM);
    const nb = model.data.bones[neck].origin, gb = model.data.bones[gIdx].origin;
    const gular = Math.sin(this.gularT * Math.PI * 2 / 1.7) * 0.5 + 0.5;
    const puff = 1 + I.display * 0.55 + gular * 0.05 * I.breath;
    const gM = this.boneWorld[neck].clone().multiply(tmpM.makeTranslation(gb[0] - nb[0], gb[1] - nb[1], gb[2] - nb[2])).multiply(tmpM2.makeScale(1, puff, 1 + I.display * 0.35));
    model.bones[gIdx].matrix.copy(gM);
    this.boneWorld[gIdx].copy(gM);
    model.skin.uDisplay.value = damp(model.skin.uDisplay.value, I.display, 3, 1 / 60);
    model.tongueOut = I.tongue;
    // mouth point (for drinking, eating): inside the jaw, near the front
    this.mouth.set(11.95 - jb[0], model.data.mouth[1][1] - jb[1] - 0.05, 0).applyMatrix4(jawM);
    // legs
    for (const leg of this.legs) this.solveLeg(leg);
    for (const e of model.eyes) {
      e.look.x = clamp(e.look.x, -0.3, 0.3);
    }
    model.syncAttachments();
  }

  private solveLeg(leg: Leg) {
    const I = this.inputs;
    const model = this.model;
    const d = leg.data;
    const girdle = leg.front ? 2 : 5; // chest or pelvis
    const gIdx = this.spineIdx[girdle];
    // Shoulder/hip rides on its girdle bone.
    const g = this.boneWorld[gIdx];
    const gOrigin = model.data.bones[gIdx].origin;
    const S = new THREE.Vector3(d.root[0] - gOrigin[0], d.root[1] - gOrigin[1], d.root[2] - gOrigin[2]);
    S.applyMatrix4(g);
    // Foot: planted or swinging.
    const foot = new THREE.Vector3();
    let yaw: number;
    const normal = leg.normal.clone();
    let lift = 0;
    if (leg.swing) {
      const t = smooth(clamp(leg.swingT, 0, 1));
      foot.lerpVectors(leg.from, leg.to, t);
      const gy = this.ground.heightAt(foot.x, foot.z);
      lift = Math.sin(Math.PI * clamp(leg.swingT, 0, 1)) * leg.liftScale * K * (this.moving ? 1 : 0.6);
      foot.y = Math.max(gy, leg.from.y + (leg.to.y - leg.from.y) * t) + lift;
      yaw = leg.fromYaw + wrapAngle(leg.toYaw - leg.fromYaw) * t;
      normal.lerp(UP, 0.5).normalize();
    } else {
      foot.copy(leg.planted);
      yaw = leg.plantedYaw;
    }
    // Arm wave: the left front limb lifts and circles slowly.
    let waveLift = 0;
    if (leg.front && leg.side < 0 && I.wave > 0.01) {
      const w = I.wave;
      const c = this.time * Math.PI * 2 * 0.55;
      waveLift = w;
      const homeW = this.homeWorld(leg, new THREE.Vector3());
      foot.lerp(homeW, w);
      foot.addScaledVector(this.bodyUp, w * (1.6 + 0.5 * Math.sin(c)) * K);
      foot.addScaledVector(this.bodyFwd, w * (0.6 * Math.cos(c) + 0.4) * K);
      foot.addScaledVector(this.bodyRight, w * leg.side * 0.4 * K);
    }
    // Hand frame: forward along the foot's yaw (plus its bind splay), up along the ground normal.
    const splay = Math.atan2(-d.forward[2], d.forward[0]);
    const fYaw = yaw + splay;
    const fwd = new THREE.Vector3(Math.cos(fYaw), 0, -Math.sin(fYaw));
    fwd.addScaledVector(normal, -fwd.dot(normal)).normalize();
    let handRot = frameMatrix(fwd, normal, new THREE.Matrix4()).clone();
    // Heel peel: rotate the hand about the toe line (lifts the wrist end).
    const peelAngle = leg.heel * (leg.front ? 0.45 : 0.6) + waveLift * 0.5;
    const toeLine = new THREE.Vector3(d.palm[0] - d.wrist[0], 0, d.palm[2] - d.wrist[2]).length() * K * 2.2;
    const side = new THREE.Vector3().setFromMatrixColumn(handRot, 2);
    const pivot = foot.clone().addScaledVector(fwd, toeLine);
    const rq = tmpQ.setFromAxisAngle(side, peelAngle);
    const handPos = foot.clone().sub(pivot).applyQuaternion(rq).add(pivot);
    handRot = new THREE.Matrix4().makeRotationFromQuaternion(rq).multiply(handRot);
    // The hand bind origin sits slightly above the sole.
    handPos.addScaledVector(normal, 0.12 * K);
    // Absolute hand axes (fwd, up, side), matching how the bind frame was built.
    this.setBone(d.bones.hand, handPos, handRot);
    // Wrist target sits above the hand origin.
    const up = new THREE.Vector3().setFromMatrixColumn(handRot, 1);
    const W = handPos.clone().addScaledVector(up, leg.wristAbove * K);
    // Two-bone IK with an outward, raised elbow/knee.
    const a = d.upperLength * K, b = d.lowerLength * K;
    const toW = W.clone().sub(S);
    let dist = toW.length();
    const maxR = (a + b) * 0.999, minR = Math.abs(a - b) + 1e-4;
    if (dist > maxR) {
      // Out of reach: the whole foot follows the wrist rather than stretching the skin.
      const clamped = S.clone().addScaledVector(toW.clone().normalize(), maxR);
      handPos.add(clamped.clone().sub(W));
      W.copy(clamped);
      dist = maxR;
      this.setBone(d.bones.hand, handPos, handRot);
    }
    if (dist < minR) dist = minR;
    const dir = W.clone().sub(S).normalize();
    const pole = S.clone().addScaledVector(this.bodyRight, leg.side * 0.04).addScaledVector(this.bodyUp, 0.03).addScaledVector(this.bodyFwd, leg.front ? -0.015 : 0.02);
    const toPole = pole.sub(S);
    const perp = toPole.addScaledVector(dir, -toPole.dot(dir)).normalize();
    const x = (a * a - b * b + dist * dist) / (2 * dist);
    const y = Math.sqrt(Math.max(0, a * a - x * x));
    const E = S.clone().addScaledVector(dir, x).addScaledVector(perp, y);
    // Bone frames: x along the segment, z = limb plane normal (as in the bind).
    const plane = new THREE.Vector3().crossVectors(E.clone().sub(S), W.clone().sub(E)).normalize();
    const upperRot = new THREE.Matrix4();
    {
      const X = E.clone().sub(S).normalize();
      const Z = plane.clone().addScaledVector(X, -plane.dot(X)).normalize();
      const Y = new THREE.Vector3().crossVectors(Z, X);
      upperRot.makeBasis(X, Y, Z);
    }
    const lowerRot = new THREE.Matrix4();
    {
      const X = W.clone().sub(E).normalize();
      const Z = plane.clone().addScaledVector(X, -plane.dot(X)).normalize();
      const Y = new THREE.Vector3().crossVectors(Z, X);
      lowerRot.makeBasis(X, Y, Z);
    }
    // The bind frames were built the same way, so these are absolute bone axes.
    this.setBone(d.bones.upper, S, upperRot);
    this.setBone(d.bones.lower, E, lowerRot);
    // Digits follow the hand; toes stay flat while the heel peels, curl a little in swing.
    const hw = this.boneWorld[d.bones.hand];
    d.bones.digits.forEach((bi, i) => {
      const rel = leg.digitRel[i];
      const curl = leg.swing ? -0.25 : -peelAngle * 0.95;
      const m = hw.clone().multiply(rel).multiply(tmpM.makeRotationZ(curl + (leg.swing ? 0 : 0.03 * Math.sin(this.time * 3 + i))));
      model.bones[bi].matrix.copy(m);
      this.boneWorld[bi].copy(m);
    });
  }
}
