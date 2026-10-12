// A live layer of suppleness over the baked clips.
//
// The Blender clips are cyclic and play on a straight line; real animals bend. After the mixer has
// posed the skeleton each frame, this adds:
//   - path curvature: turning, the trunk and neck curve into the turn and the tail sweeps after them,
//     so the whole body follows the arc instead of rotating like a plank;
//   - attention: the neck and head turn (and tip) towards whatever the animal is watching,
//     spread over every neck vertebra so the neck curves rather than kinks;
//   - follow-through: each tail segment is a damped spring that lags behind the body's turning and
//     overshoots a little, softer towards the tip;
//   - gaze shifts: the head flicks to a new point and holds there while the neck catches up behind it
//     (the head counter-rotating as the neck arrives), rather than drifting smoothly like a camera;
//   - gait wave: a small sideways wave through the trunk and down the tail, locked to the stride, so a
//     walking animal swings its body over each planted foot;
//   - fidgets: idle glances to held points, and a slow tail sway, so a standing animal is never quite still.
// Bends are applied about each bone's own copy of the animal's vertical and lateral axes, captured
// once in the bind pose, so they read the same whatever the clip is doing.
import { Quaternion, Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);
const SIDE = new Vector3(1, 0, 0);
const qa = new Quaternion();
const qb = new Quaternion();

function chain(bones, prefix) {
  const out = [];
  for (let i = 1; i < 20; i++) {
    const b = bones.get(`${prefix}${i}`);
    if (!b) break;
    out.push(b);
  }
  return out;
}

export class Flex {
  constructor(model, opts = {}) {
    this.opts = opts;
    const bones = new Map();
    model.traverse((o) => o.isBone && bones.set(o.name, o));
    this.spine = chain(bones, 'spine');
    this.neck = chain(bones, 'neck');
    this.tail = chain(bones, 'tail');
    this.head = bones.get('head') || null;
    // per-bone vertical (yaw) and lateral (pitch) axes in the bone's own frame, from the bind pose
    model.updateMatrixWorld(true);
    const inv = new Quaternion();
    model.getWorldQuaternion(inv).invert();
    const axes = (b) => {
      const q = b.getWorldQuaternion(new Quaternion()).premultiply(inv).invert(); // model -> bone
      return { up: UP.clone().applyQuaternion(q).normalize(), side: SIDE.clone().applyQuaternion(q).normalize() };
    };
    for (const b of [...this.spine, ...this.neck, ...this.tail, ...(this.head ? [this.head] : [])]) b.userData.flex = axes(b);
    this.curv = 0; // smoothed path curvature (1/unit)
    this.gazeYaw = 0; // where the eyes are aimed (held, then re-aimed in a flick)
    this.gazePitch = 0;
    this.headYaw = 0; // fast: the head gets there first
    this.headPitch = 0;
    this.neckYaw = 0; // slow: the neck follows
    this.neckPitch = 0;
    this.idleAt = { yaw: 0, pitch: 0, t: 0 };
    this.tailX = new Float32Array(this.tail.length);
    this.tailV = new Float32Array(this.tail.length);
    this.t = Math.random() * 100;
  }

  bend(b, yaw, pitch = 0) {
    const ax = b.userData.flex;
    if (!ax) return;
    if (yaw) b.quaternion.multiply(qa.setFromAxisAngle(ax.up, yaw));
    if (pitch) b.quaternion.multiply(qb.setFromAxisAngle(ax.side, pitch));
  }

  // turnRate: rad/s of the body's heading; speed: units/s; segLen: length per vertebra (units);
  // look: {yaw, pitch} wanted for the head relative to the body (radians) or null
  // gait: {phase 0..1 through the stride cycle, amp radians per joint} while walking, or null
  update(dt, { turnRate = 0, speed = 0, segLen = 0.1, look = null, calm = 1, gait = null } = {}) {
    if (dt <= 0) return;
    this.t += dt;
    const flex = this.opts.flex ?? 1;
    // curvature of the path; turning on the spot still bends the body
    const k = speed > 0.02 ? turnRate / speed : turnRate * 1.6;
    // a body can only curve so far: about 65 degrees end to end for a supple animal
    const nS = this.spine.length, nN = this.neck.length, nT = this.tail.length;
    const joints = Math.max(4, nS + nN + nT);
    const kMax = (1.15 * flex) / (segLen * joints);
    const kWant = Math.max(-kMax, Math.min(kMax, k));
    this.curv += (kWant - this.curv) * Math.min(1, dt * 3.0);
    const arc = this.curv * segLen * flex; // rotation per joint for the body to lie on the arc
    // the trunk is stiffer than the neck and tail
    // attention. The wanted direction only re-aims the gaze once it has moved far enough away (a saccade);
    // the head snaps towards the gaze quickly, the neck follows slowly, and the head's share is what is
    // left over, so it counter-rotates as the neck arrives.
    let want = look;
    if (!want) {
      const I = this.idleAt;
      I.t -= dt;
      if (I.t <= 0) {
        I.t = 1.2 + Math.random() * 2.8;
        I.yaw = calm * (Math.random() - 0.5) * 0.7;
        I.pitch = calm * (Math.random() - 0.6) * 0.18;
      }
      want = I;
    }
    const wantYaw = Math.max(-1.2, Math.min(1.2, want.yaw));
    const wantPitch = Math.max(-0.5, Math.min(0.5, want.pitch));
    if (Math.abs(wantYaw - this.gazeYaw) > 0.14 || Math.abs(wantPitch - this.gazePitch) > 0.1) {
      this.gazeYaw = wantYaw;
      this.gazePitch = wantPitch;
    }
    const fast = Math.min(1, dt * (look ? 12 : 7)), slow = Math.min(1, dt * (look ? 2.6 : 1.3));
    this.headYaw += (this.gazeYaw - this.headYaw) * fast;
    this.headPitch += (this.gazePitch - this.headPitch) * fast;
    this.neckYaw += (this.gazeYaw - this.neckYaw) * slow;
    this.neckPitch += (this.gazePitch - this.neckPitch) * slow;
    const neckShare = nN ? 0.65 : 0;
    const nYaw = this.neckYaw * neckShare, nPitch = this.neckPitch * neckShare;
    // the stride: the trunk swings over each planted foot, the wave travelling back down the tail
    const gp = gait ? gait.phase * Math.PI * 4 : 0; // two footfalls of each side per cycle
    const ga = gait ? gait.amp * flex : 0;
    for (let i = 0; i < nS; i++) this.bend(this.spine[i], arc * 0.55 + ga * Math.sin(gp - i * 0.5) * 0.6);
    for (let i = 0; i < nN; i++) {
      const w = (i + 1) / ((nN * (nN + 1)) / 2); // more bend towards the head
      // the neck damps the trunk's swing so the head stays steady
      this.bend(this.neck[i], arc * 1.1 + nYaw * w * flex - ga * Math.sin(gp) * 0.5 * w, nPitch * w);
    }
    if (this.head) this.bend(this.head, (this.headYaw - nYaw) * flex, this.headPitch - nPitch);
    // tail: damped springs chasing the arc (which lies the other way behind the hips), softer to the tip
    const sway = calm * 0.05 * Math.sin(this.t * 0.8);
    for (let i = 0; i < nT; i++) {
      const f = (i + 1) / nT;
      const wave = ga * Math.sin(gp - (nS + i) * 0.5) * (0.6 + 0.8 * f);
      const target = -arc * (0.7 + 0.4 * f) + sway * f + wave;
      const kS = 40 * (1.2 - 0.7 * f), c = 2 * Math.sqrt(kS) * 0.55; // under-damped: a little overshoot
      // drive each segment by its parent's lag so the motion travels down the tail
      const drive = i > 0 ? (this.tailX[i - 1] - target) * 0.35 : 0;
      this.tailV[i] += (kS * (target + drive - this.tailX[i]) - c * this.tailV[i]) * dt;
      this.tailX[i] += this.tailV[i] * dt;
      this.bend(this.tail[i], this.tailX[i] * flex);
    }
  }
}
