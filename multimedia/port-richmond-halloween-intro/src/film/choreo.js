// v2 "HIDE": creature choreography — every actor's placement and pose as a pure function of film time t.
// Root tracks live in src/film/tracks.js (shared with the shots); this file turns them into poses.
//
// Bone axes (measured on the exported rig, local, relative to rest):
//   spine_* / neck / head +X bend forward (chin down); head Y turns, Z tilts
//   upperarm +X raises the arm forward; lowerarm +X bends the elbow; hand +X flexes the wrist
//   fingers -X curl into a fist (Rig.grip); jaw -X opens
//   thigh +X swings the leg forward; calf -X bends the knee; foot +X lifts the toes
import * as THREE from 'three';
import { CUES } from './cues.js';
import { MARKS, T, track, trackDist, trackYaw, scarecrowAt, yawTo, lerpAngle, smooth, smoother, clamp, lerp } from './tracks.js';
import { fbm1, noise1, flinch, kick } from './shots.js';

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const PELVIS_H = 0.955;

// breathing + idle micro-motion shared by the infected
function idle(rig, t, seed, k = 1) {
  const br = Math.sin(t * 2.1 + seed) * 0.5 + 0.5;
  const irregular = 0.6 + 0.4 * fbm1(t * 0.7, seed + 3);
  rig.rot('spine_03', 1.6 * br * irregular * k, 0, 0);
  rig.rot('spine_05', -1.2 * br * irregular * k, 0, 0);
  rig.rot('clavicle_l', 0, 0, 1.2 * br * k);
  rig.rot('clavicle_r', 0, 0, -1.2 * br * k);
  rig.rot('head', fbm1(t * 0.6, seed + 5) * 3 * k, fbm1(t * 0.45, seed + 6) * 5 * k, fbm1(t * 0.5, seed + 7) * 4 * k);
}
function hangArms(rig, t, seed, dangleL = 0, dangleR = 0, swing = 0) {
  for (const [S, d, s] of [['l', dangleL, 1], ['r', dangleR, -1]]) {
    const sw = swing * (S === 'l' ? 1 : -1);
    rig.rot(`upperarm_${S}`, 5 + 3 * fbm1(t * 0.5, seed + (S === 'l' ? 11 : 13)) + sw * 10 * (1 - d), 0, s * 3);
    rig.rot(`lowerarm_${S}`, (16 + 4 * fbm1(t * 0.7, seed + (S === 'l' ? 17 : 19))) * (1 - d * 0.8), 0, 0);
    rig.rot(`hand_${S}`, 8 * (1 - d), 0, 0);
    rig.grip(S, 0.35 + 0.1 * fbm1(t * 1.3, seed + (S === 'l' ? 23 : 29)));
  }
}
function twitch(rig, S, t, seed, amt = 1) {
  for (const [i, f] of ['index', 'middle', 'ring', 'pinky'].entries()) {
    const n = Math.max(0, noise1(t * 3.1 + i * 1.7, seed + i) - 0.35) * 2.2;
    rig.rot(`${f}_01_${S}`, -18 * n * amt);
    rig.rot(`${f}_02_${S}`, -14 * n * amt);
  }
}
// shambling walk: phase from distance travelled; limp drags the right leg
function walk(rig, phase, amt, limp = 0.4, hunch = 0) {
  if (amt <= 0) return;
  const s = Math.sin(phase), c = Math.cos(phase);
  rig.rot('pelvis', 0, 5 * s * amt, 3 * c * amt);
  rig.rot('spine_02', hunch * 0.5, -4 * s * amt, -2 * c * amt);
  rig.rot('spine_04', hunch * 0.5, -3 * s * amt, 0);
  rig.rot('thigh_l', (22 * s) * amt, 0, 0);
  rig.rot('thigh_r', (-22 * s) * amt * (1 - limp * 0.5), 0, 0);
  rig.rot('calf_l', -(10 + 30 * Math.max(0, -c)) * amt, 0, 0);
  rig.rot('calf_r', -(8 + 30 * Math.max(0, c)) * amt * (1 - limp * 0.7), 0, 0);
  rig.rot('foot_l', 8 * Math.max(0, s) * amt, 0, 0);
  rig.rot('foot_r', -6 * limp * amt, 0, 6 * limp * amt);
}
function brokenNeck(rig, side, amt, sway = 0) {
  rig.rot('neck_02', 10 * amt, 0, side * (32 + sway * 6) * amt);
  rig.rot('head', 14 * amt, side * 8 * amt, side * (28 + sway * 8) * amt);
}
// orient a bone in world space: local +Z (the face) toward `target`, local +Y toward `upHint` (projected), blend w
const _m4 = new THREE.Matrix4(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _vp = new THREE.Vector3();
function faceToward(rig, name, target, upHint, w = 1) {
  const b = rig.bones[name];
  if (!b || w <= 0) return;
  b.updateWorldMatrix(true, false);
  _vp.setFromMatrixPosition(b.matrixWorld);
  const f = target.clone().sub(_vp).normalize();
  const u = upHint.clone().sub(f.clone().multiplyScalar(upHint.dot(f))).normalize();
  const r = new THREE.Vector3().crossVectors(u, f).normalize();
  _m4.makeBasis(r, u, f);
  _qa.setFromRotationMatrix(_m4);
  b.getWorldQuaternion(_qb);
  _qb.slerp(_qa, w);
  const parentQ = b.parent.getWorldQuaternion(new THREE.Quaternion());
  b.quaternion.copy(parentQ.invert().multiply(_qb));
}

// seated slump on a step (pelvis on the tread, legs down the steps)
function seated(rig, k = 1) {
  rig.rot('thigh_l', 86 * k, 0, -6 * k); rig.rot('thigh_r', 84 * k, 0, 5 * k);
  rig.rot('calf_l', -88 * k); rig.rot('calf_r', -82 * k);
  rig.rot('foot_l', 8 * k); rig.rot('foot_r', 12 * k);
  rig.rot('spine_01', 14 * k); rig.rot('spine_03', 12 * k); rig.rot('spine_05', 10 * k);
}

export function makeChoreo({ cast, world, props }) {
  const A = cast.actors;
  const act = (...names) => { for (const n of names) if (A[n]) return A[n]; return null; };
  const gy = (x, z) => (world && world.surfaceY ? world.surfaceY(x, z) : 0);
  const camPos = new THREE.Vector3();
  const carA = v3(-1.92, 0, 10.5);
  const FLOOR3609 = 0.382;
  const puddle = props && props.api ? props.api.puddle : null;
  // aim car B's face drip and the head clang at the face-paint infected's actual marks
  const carB = props && props.api ? props.api.carB : null;
  if (carB) {
    const F0 = T.facepaint.face, L0 = T.facepaint.lungeTo;
    try {
      carB.setDripTarget && carB.setDripTarget(v3(F0.x + 0.03, gy(F0.x, F0.z) + 0.14, F0.z));
      if (carB.clang && carB.clang.setPoint) {
        const uy = carB.underbodyY ? carB.underbodyY(L0.x, L0.z) : gy(L0.x, L0.z) + 0.3;
        carB.clang.setPoint(v3(L0.x, uy, L0.z));
      }
    } catch (e) { console.warn('[prh] carB hooks', e); }
  }

  // the infected's own breathing in the U3 close-up (exported for the audio: bubbling in the puddle)
  const breathTimesFacepaint = [];
  for (let t = CUES.faceDown + 0.5, i = 0; t < CUES.lunge2 - 0.1; i++) { breathTimesFacepaint.push(+t.toFixed(3)); t += 1.45 + 0.45 * Math.abs(Math.sin(i * 2.17 + 0.6)); }
  const breathPhase = (t, times) => { let last = -1e9; for (const b of times) { if (b <= t) last = b; else break; } return t - last; };
  // its breaths ring out across the puddle under its mouth (CAR puddle API); per-frame setBreathSource adds the heave
  if (puddle && puddle.addBreath) {
    const F0 = T.facepaint.face;
    try { puddle.addBreath(breathTimesFacepaint.filter((b) => b > CUES.faceDown + 0.6 && b < CUES.gazeLock2), v3(F0.x - 0.03, gy(F0.x, F0.z) + 0.005, F0.z + 0.05)); } catch (e) { console.warn('[prh] puddle breath', e); }
  }

  // ------------------------------------------------------------ the scarecrow (infected in a scarecrow costume)
  function scarecrow(a, t) {
    // gone from the street in blackout two (back for the street waking)
    const on = t < (CUES.flicker2 + CUES.flicker2End) / 2 || t >= CUES.shotS1;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    const S = MARKS.scarecrowSeat;
    const st = scarecrowAt(t);
    if (st.mode === 'seated') {
      a.place(S.x + 0.06, S.y + 0.10 - PELVIS_H, S.z, S.yaw);
      seated(rig, 1);
      rig.rot('upperarm_l', 16, 0, 10); rig.rot('lowerarm_l', 52); rig.rot('upperarm_r', 12, 0, -8); rig.rot('lowerarm_r', 58);
      rig.grip('l', 0.4); rig.grip('r', 0.45);
      // head slumped forward like a stuffed figure; lifts toward the P3 camera at scarecrowHeadLift
      const lift = smoother(CUES.scarecrowHeadLift, CUES.scarecrowHeadLift + 1.5, t);
      rig.rot('spine_05', 10 - 8 * lift);
      rig.rot('neck_02', 38 - 30 * lift, 0, 10 + 14 * lift);
      rig.rot('head', 22 - 20 * lift, -10 * lift, 8 + 18 * lift);
      idle(rig, t, 5, 0.12 + 0.2 * lift);
      return;
    }
    const keys = t < 17.5 ? T.scarecrow.offStoop : t < 23.0 ? T.scarecrow.c1 : t < 25.2 ? T.scarecrow.c2 : t < 33.6 ? T.scarecrow.c3 : T.scarecrow.wakes;
    const towardCar = yawTo(st, carA);
    const yaw = t >= CUES.shotS1 ? trackYaw(keys, t, towardCar) : (st.mode === 'stand' ? towardCar : trackYaw(keys, t, towardCar));
    a.place(st.x, gy(st.x, st.z), st.z, yaw);
    const moving = clamp((st.speed || 0) / 0.9, 0, 1);
    const phase = trackDist(keys, Math.max(t, keys[0].t)) * 4.8;
    rig.rot('spine_02', 7); rig.rot('spine_04', 6);
    walk(rig, phase, moving * 0.9, 0.25, 8);
    hangArms(rig, t, 7, 0.15, 0.85, Math.sin(phase) * moving);
    // head down under the lamp until blackout one; afterwards it watches the car
    const headDown = t < CUES.flicker1 && t >= 17.5 ? 1 : 0;
    brokenNeck(rig, 1, 1.0, Math.sin(phase * 0.5) * moving + 0.25 * Math.sin(t * 0.9));
    if (headDown) { rig.rot('neck_02', 26); rig.rot('head', 18); }
    idle(rig, t, 7, 0.35);
  }

  // ------------------------------------------------------------ the WreckVictim (scare one through car A's window)
  const W = MARKS.smashWindow;
  function wreck(a, t, camera) {
    const on = t < 33.6 || t >= CUES.shotS1;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    camera.getWorldPosition(camPos);
    const winC = v3(W.x, W.y, W.z);
    const n = v3(W.nx, 0, W.nz).normalize(); // outward (toward the sidewalk)
    const inward = n.clone().negate();
    if (t >= CUES.shotS1) {
      // out of the window onto the sidewalk, then after us
      const tr = track(T.wreck.out, t);
      const yaw = trackYaw(T.wreck.out, t, Math.PI * 0.1);
      a.place(tr.x, gy(tr.x, tr.z), tr.z, yaw);
      const up = smooth(52.5, 54.2, t);
      const phase = trackDist(T.wreck.out, Math.max(t, 54.0)) * 4.6;
      rig.rot('spine_01', 40 * (1 - up)); rig.rot('spine_03', 20 * (1 - up) + 8);
      rig.rot('thigh_l', 60 * (1 - up)); rig.rot('thigh_r', 70 * (1 - up)); rig.rot('calf_l', -90 * (1 - up)); rig.rot('calf_r', -80 * (1 - up));
      a.root.position.y -= 0.45 * (1 - up);
      walk(rig, phase, up * clamp((tr.speed || 0) / 0.8, 0, 1), 0.5, 10);
      hangArms(rig, t, 13, 0.0, 0.9, Math.sin(phase));
      rig.rot('upperarm_l', 45 * up, 0, 0); rig.rot('lowerarm_l', 25 * up);
      rig.rot('jaw', -14 - 8 * Math.sin(t * 4.2));
      idle(rig, t, 13, 0.5);
      return;
    }
    // crouched in the dark beside the car, then rises and drives through the glass
    const rise = smoother(T.wreck.rise[0], T.wreck.rise[1], t);
    const push = smooth(CUES.smashFace - 0.1, CUES.smashFace + 0.25, t);
    const climb = smooth(CUES.smashHoldEnd, 33.6, t);
    const base = v3(T.wreck.crouch.x, 0, T.wreck.crouch.z);
    const p = base.clone().addScaledVector(inward, 0.04 * rise + 0.08 * push + 0.2 * climb); // feet stay off the car's flank; the torso leans in
    const yaw = Math.atan2(inward.x, inward.z);
    a.place(p.x, gy(p.x, p.z), p.z, yaw);
    const crouch = 1 - rise;
    rig.rot('thigh_l', 95 * crouch + 18 * rise); rig.rot('thigh_r', 85 * crouch + 8 * rise);
    rig.rot('calf_l', -125 * crouch - 25 * rise); rig.rot('calf_r', -115 * crouch - 12 * rise);
    rig.rot('foot_l', -28 * crouch); rig.rot('foot_r', -24 * crouch);
    a.root.position.y -= 0.52 * crouch;
    rig.rot('spine_01', 28 * crouch + 16 * rise + 14 * push + 12 * climb); rig.rot('spine_03', 22 * crouch + 12 * rise + 14 * push + 10 * climb); rig.rot('spine_05', 10 * crouch + 6 * rise + 8 * push);
    rig.rot('neck_02', 20 * crouch - 10 * push); rig.rot('head', 16 * crouch);
    idle(rig, t, 13, crouch * 0.6 + 0.3);
    a.root.updateMatrixWorld(true);
    // solve the lean: fold at the hips until the head is at the window's height, then shift the body so the head
    // goes through the opening (the feet stay >= 0.28 m off the car's flank: if that blocks, the spine folds more)
    if (rise > 0.001) {
      const headT = winC.clone().addScaledVector(inward, 0.02 + 0.2 * push + 0.22 * climb).add(v3(0, 0.06 - 0.04 * push, 0));
      const wDepth = rise; // before the rise it is crouched in the dark
      for (let it = 0; it < 6; it++) {
        a.root.updateMatrixWorld(true);
        const h = rig.worldPos('head'), hip = rig.worldPos('pelvis');
        const dy = h.y - lerp(h.y, headT.y, wDepth);
        if (Math.abs(dy) < 0.004) break;
        const L = Math.max(0.35, h.distanceTo(hip));
        rig.rot('pelvis', THREE.MathUtils.radToDeg(clamp(dy / L, -0.3, 0.3)) * 0.8, 0, 0);
      }
      a.root.updateMatrixWorld(true);
      const h = rig.worldPos('head');
      const need = (headT.clone().sub(h)).dot(inward) * wDepth; // how far the head must still move inward
      const flank = winC.clone().addScaledVector(n, 0.28); // the closest the feet may stand to the car
      const room = (flank.clone().sub(a.root.position)).dot(inward);
      const move = Math.min(need, Math.max(0, room));
      a.root.position.addScaledVector(inward, move);
      // along the car: centre the head on the opening
      const along = v3(-inward.z, 0, inward.x);
      a.root.position.addScaledVector(along, (headT.clone().sub(h)).dot(along) * wDepth);
      if (need - move > 0.01) { rig.rot('spine_03', 24 * clamp((need - move) / 0.3, 0, 1)); rig.rot('spine_05', 12 * clamp((need - move) / 0.3, 0, 1)); }
      a.root.updateMatrixWorld(true);
    }
    if (rise > 0) {
      // right forearm leads through the glass, then both hands reach in; the left closes on the seat back
      const shR = rig.worldPos('upperarm_r'), shL = rig.worldPos('upperarm_l');
      const punch = smoother(CUES.windowSmash - 0.14, CUES.windowSmash + 0.02, t);
      const reach = smooth(CUES.windowSmash + 0.05, CUES.smashGrab, t);
      const flail = Math.sin(t * 9.0) * 0.06 * reach;
      const tR = winC.clone().addScaledVector(inward, 0.15 + 0.45 * reach).add(v3(0, 0.02 - 0.17 * reach + flail, -0.1 + 0.42 * reach)); // claws low and to the side: the face stays clear
      rig.ik('upperarm_r', 'lowerarm_r', 'hand_r', tR, shR.clone().add(v3(0, -0.4, 0)), punch);
      rig.grip('r', 0.75 - 0.5 * reach + 0.3 * Math.max(0, Math.sin(t * 7)), 1);
      const grab = (props && props.anchors && props.anchors.carA_seatGrab) ? props.anchors.carA_seatGrab : null;
      const seatPt = grab && grab.a ? grab.a.clone().lerp(grab.b, 0.35) : winC.clone().addScaledVector(inward, 0.75).add(v3(0, 0.12, 0.25));
      const tL = winC.clone().addScaledVector(inward, 0.3).lerp(seatPt, smooth(CUES.smashFace, CUES.smashGrab, t));
      rig.ik('upperarm_l', 'lowerarm_l', 'hand_l', tL, shL.clone().add(v3(0, -0.4, 0)), smooth(CUES.windowSmash, CUES.smashFace, t));
      rig.grip('l', 0.2 + 0.7 * smooth(CUES.smashGrab - 0.05, CUES.smashGrab + 0.08, t), 1);
      // the head shoves in through the hole after the arms, tracking us
      if (push > 0) {
        // the face comes up toward us through the hole, crown up (a small cant only), eyes on us
        rig.lookAt('neck_02', camPos, 0.4 * push);
        faceToward(rig, 'head', camPos, v3(0.18, 1, 0.1).normalize(), 0.9 * push);
        rig.lookAt('eye_l', camPos, push); rig.lookAt('eye_r', camPos, push);
      }
      rig.rot('jaw', -(12 + 22 * push + 6 * Math.sin(t * 8)) * rise);
    }
  }

  // ------------------------------------------------------------ the face-paint infected (scare two, under car B)
  function facepaint(a, t, camera) {
    const on = (t >= 37.4 && t < 52.6) || (t >= CUES.shotS3 && t < 64.2) || t >= CUES.titleFadeIn;
    a.show(on);
    // the drool string from its mouth corner to the puddle (CREATURES mesh, hidden by default): only while it lies there
    if (a._drool === undefined) a._drool = a.root.getObjectByName('DroolPuddle') || null;
    if (a._drool) a._drool.visible = t > CUES.faceDown + 0.9 && t < CUES.lunge2;
    if (!on) return;
    const rig = a.rig; rig.reset();
    camera.getWorldPosition(camPos);
    const F = T.facepaint.face;
    const towardCar = -Math.PI / 2; // facing -X
    if (t >= CUES.titleFadeIn) {
      // aftermath: shambling toward 3609 with the others
      const tr = track(T.facepaint.title, t);
      a.place(tr.x, gy(tr.x, tr.z), tr.z, trackYaw(T.facepaint.title, t, Math.PI * 0.8));
      const phase = trackDist(T.facepaint.title, Math.max(t, 79.6)) * 4.8;
      walk(rig, phase, clamp((tr.speed || 0) / 0.6, 0, 1), 0.4, 8);
      hangArms(rig, t, 3, 0.2, 0.1, Math.sin(phase));
      idle(rig, t, 3, 0.5);
      return;
    }
    if (t >= CUES.shotS3) {
      // prone, dragging itself out from under car B's street side by the tail as we run past: propped on its left
      // forearm, head up and on us, the right hand swiping at our ankle (the dropped phone still glows under the car)
      const tr = track(T.facepaint.s3, t);
      const hd = v3(0.82, 0, 0.57).normalize(); // its head points out toward the street
      const yA = hd.clone(), zA = v3(0, -1, 0), xA = new THREE.Vector3().crossVectors(yA, zA);
      a.root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, yA, zA));
      a.root.position.set(tr.x - hd.x * 1.5, gy(tr.x, tr.z) + 0.13, tr.z - hd.z * 1.5);
      rig.rot('spine_03', -14); rig.rot('spine_04', -12); rig.rot('spine_05', -10);
      rig.rot('neck_01', -24); rig.rot('neck_02', -18);
      rig.rot('thigh_l', -4, 0, 6); rig.rot('thigh_r', -2, 0, -4); rig.rot('foot_l', 40); rig.rot('foot_r', 40);
      a.root.updateMatrixWorld(true);
      faceToward(rig, 'head', camPos.clone().add(v3(0, -0.4, 0)), v3(0, 1, 0), 0.9);
      rig.lookAt('eye_l', camPos, 1); rig.lookAt('eye_r', camPos, 1);
      const g = gy(tr.x, tr.z) + 0.03;
      const shL = rig.worldPos('upperarm_l').clone(), shR = rig.worldPos('upperarm_r').clone();
      const side = v3(-hd.z, 0, hd.x); // its left, in world (head along +hd, chest down)
      rig.ik('upperarm_l', 'lowerarm_l', 'hand_l', shL.clone().addScaledVector(hd, 0.32).addScaledVector(side, 0.12).setY(g), shL.clone().add(v3(0, 0.3, 0)).addScaledVector(hd, -0.2), 1);
      const sw = smooth(CUES.nearMiss - 0.3, CUES.nearMiss, t) * (1 - smooth(CUES.nearMiss + 0.35, CUES.nearMiss + 0.9, t));
      const ankle = v3(camPos.x, g + 0.08, camPos.z).addScaledVector(hd, -0.12);
      const rest = shR.clone().addScaledVector(hd, 0.35).addScaledVector(side, -0.15).setY(g);
      rig.ik('upperarm_r', 'lowerarm_r', 'hand_r', rest.lerp(ankle, sw), shR.clone().add(v3(0, 0.35, 0)), 1);
      rig.grip('l', 0.55, 1); rig.grip('r', 0.15 + 0.8 * smooth(CUES.nearMiss, CUES.nearMiss + 0.12, t), 1);
      rig.rot('jaw', -26 - 10 * Math.max(0, Math.sin(t * 6)));
      return;
    }
    if (t < CUES.feetStop) {
      const tr = track(T.facepaint.walkIn, t);
      a.place(tr.x, gy(tr.x, tr.z), tr.z, trackYaw(T.facepaint.walkIn, t, towardCar));
      const phase = trackDist(T.facepaint.walkIn, Math.max(t, T.facepaint.walkIn[0].t)) * 5.0;
      walk(rig, phase, clamp((tr.speed || 0) / 0.8, 0, 1), 0.35, 8);
      hangArms(rig, t, 3, 0.2, 0.1, Math.sin(phase));
      idle(rig, t, 3, 0.4);
      return;
    }
    // stopped beside the car -> kneel -> hands down -> lie down, cheek in the puddle -> lunge
    const S0 = T.facepaint.standAt;
    const turn = smooth(CUES.feetStop, CUES.feetStop + 0.5, t);
    const kneel = smoother(CUES.kneel - 0.35, CUES.kneel, t);
    const hands = smoother(CUES.handsDown - 0.4, CUES.handsDown, t);
    const down = smoother(CUES.faceDown, CUES.faceDown + 1.0, t);
    const lunge = smoother(CUES.lunge2, CUES.contact2, t);
    const wedge = smooth(CUES.contact2, 52.0, t);
    // the pelvis travels from standing over its feet to kneeling, then forward as the chest goes down
    const hipX = S0.x - 0.05 * kneel - 0.15 * down - 0.33 * lunge - 0.05 * wedge;
    const hipY = gy(S0.x, S0.z) + PELVIS_H - 0.42 * kneel - 0.12 * down - 0.04 * lunge;
    a.place(hipX, hipY - PELVIS_H, S0.z + 0.02 * down, lerpAngle(trackYaw(T.facepaint.walkIn, CUES.feetStop - 0.05, towardCar), towardCar, turn));
    // kneeling legs: thighs down to the knees, shins flat behind
    rig.rot('thigh_l', -6 * kneel + 40 * down); rig.rot('thigh_r', -4 * kneel + 36 * down);
    rig.rot('calf_l', -92 * kneel - 20 * down); rig.rot('calf_r', -95 * kneel - 18 * down);
    rig.rot('foot_l', 40 * kneel); rig.rot('foot_r', 38 * kneel);
    // torso folds forward and down toward the asphalt
    rig.rot('pelvis', 18 * hands + 22 * down, 0, 0);
    rig.rot('spine_01', 10 * hands + 14 * down + 4 * lunge);
    rig.rot('spine_02', 8 * hands + 12 * down);
    rig.rot('spine_03', 8 * hands + 10 * down - 6 * lunge);
    rig.rot('spine_04', 6 * hands + 8 * down - 6 * lunge);
    rig.rot('spine_05', 4 * hands + 6 * down);
    // breathing: shoulders heave on its breaths
    const bp = breathPhase(t, breathTimesFacepaint);
    // it stops breathing once it has us (gaze lock -> lunge): the stillness is the warning
    const holdB = smooth(CUES.gazeLock2, CUES.gazeLock2 + 0.25, t) * (1 - smooth(CUES.lunge2 - 0.08, CUES.lunge2, t));
    const heave = Math.exp(-((bp - 0.35) ** 2) / 0.08) * (1 - lunge) * (1 - holdB);
    rig.rot('spine_04', -3 * heave); rig.rot('clavicle_l', 0, 0, 2.5 * heave); rig.rot('clavicle_r', 0, 0, -2.5 * heave);
    a.root.updateMatrixWorld(true);
    // head: lowered sideways, cheek to the asphalt at the puddle mark, then shoved under the sill
    const faceT = v3(F.x, F.y, F.z).lerp(v3(T.facepaint.lungeTo.x, F.y - 0.01, T.facepaint.lungeTo.z), lunge);
    if (lunge > 0 && t < CUES.contact2 + 0.12) faceT.y += 0.07 * Math.sin(Math.PI * clamp((t - CUES.contact2 + 0.06) / 0.18, 0, 1)); // the clang
    rig.rot('neck_01', 18 * down - 10 * lunge, 0, 0);
    rig.rot('neck_02', 10 * down, 0, 0);
    // solve: fold at the hips until the head joint is down at the mark's height, then slide the body so the head
    // lands on the mark (the knees slide a little; they are outside the slit)
    if (down > 0.001) {
      const headY = gy(faceT.x, faceT.z) + 0.115 + (faceT.y - F.y); // (+1 cm for the hood at the side of the head)
      for (let it = 0; it < 5; it++) {
        a.root.updateMatrixWorld(true);
        const h = rig.worldPos('head'), hip = rig.worldPos('pelvis');
        const want = lerp(h.y, headY, down);
        const dy = h.y - want;
        if (Math.abs(dy) < 0.004) break;
        const L = Math.max(0.35, Math.hypot(h.x - hip.x, h.z - hip.z, h.y - hip.y));
        rig.rot('pelvis', THREE.MathUtils.radToDeg(clamp(dy / L, -0.35, 0.35)) * 0.85, 0, 0);
      }
      a.root.updateMatrixWorld(true);
      const h = rig.worldPos('head');
      a.root.position.x += (faceT.x + 0.04 - h.x) * down;
      a.root.position.z += (faceT.z - h.z) * down;
      a.root.updateMatrixWorld(true);
    }
    // the face turns toward us, ear to the ground (a sideways face looking under the car): the head's up axis lies
    // along the street (+Z), so one eye sits above the other; the lunge rights it a little as it shoves in
    if (down > 0) {
      const upHint = v3(0.0, 0.18 + 0.12 * lunge, 1.0).normalize(); // stays sideways as it comes (wrong, and it keeps the face under the sill)
      faceToward(rig, 'neck_02', camPos, upHint, 0.35 * down);
      faceToward(rig, 'head', camPos.clone().add(v3(0, 0.02, 0)), upHint, down);
    }
    // jaw: slack, works on its breaths; the snarl on the lunge
    rig.rot('jaw', -(6 + 7 * heave + 4 * noise1(t * 6, 3)) * (1 - lunge) - 34 * lunge * (1 - wedge * 0.4) - 10 * Math.max(0, Math.sin(t * 7)) * wedge);
    // the phone buzz: a twitch of the head toward the sound, then the eyes roll to the glow below our face, then lock
    if (t > CUES.phoneBuzz2) {
      const tw = kick(t, CUES.phoneBuzz2 + 0.12, 6, 7) + 0.6 * kick(t, CUES.phoneBuzz2 + 0.82, 6, 8);
      rig.rot('head', 4 * tw, 0, -3 * tw);
    }
    const lock = smooth(CUES.gazeLock2, CUES.gazeLock2 + 0.08, t);
    const toGlow = smooth(CUES.phoneBuzz2 + 0.25, CUES.phoneBuzz2 + 0.7, t) * (1 - lock);
    rig.rot('eye_l', 0, (1 - lock) * (1 - toGlow) * 10 * fbm1(t * 0.4, 71), (1 - lock) * 4);
    rig.rot('eye_r', 0, (1 - lock) * (1 - toGlow) * 10 * fbm1(t * 0.4, 71) - 4 * (1 - lock), 0);
    if (toGlow > 0 || lock > 0) {
      const glowAt = camPos.clone().add(v3(0.05, -0.1, 0.06));
      rig.lookAt('eye_l', lock > 0 ? camPos : glowAt, Math.max(toGlow * 0.85, lock)); rig.lookAt('eye_r', lock > 0 ? camPos : glowAt, Math.max(toGlow * 0.85, lock));
    }
    // hands: planted flat either side of the head; the right shoots under the car at us on the lunge
    a.root.updateMatrixWorld(true);
    const shR = rig.worldPos('upperarm_r'), shL = rig.worldPos('upperarm_l');
    const g = gy(F.x, F.z) + 0.03;
    const plantL = v3(F.x + 0.32, g, F.z - 0.33), plantR = v3(F.x + 0.36, g, F.z + 0.30);
    const handsW = hands;
    rig.ik('upperarm_l', 'lowerarm_l', 'hand_l', plantL.clone().lerp(v3(F.x - 0.15, g + 0.02, F.z - 0.32), lunge * 0.6), shL.clone().add(v3(0.3, 0.3, -0.3)), handsW);
    // the grab: the hand flies at the lens from below-right and claws at our chest/phone, ~0.28 m in front of us
    const toFace = v3(F.x - camPos.x, 0, F.z - camPos.z).normalize();
    const grabT = camPos.clone().addScaledVector(toFace, 0.3).add(v3(0, -0.05, 0)).addScaledVector(v3(-toFace.z, 0, toFace.x), 0.2); // beside the face, not across it
    const yank = smooth(CUES.grabYank, CUES.grabYank + 0.15, t) * (1 - smooth(CUES.kickFree, CUES.kickFree + 0.15, t));
    const reachR = plantR.clone().lerp(grabT.clone().add(v3(0.1 * yank, 0, 0)), smooth(CUES.lunge2 + 0.05, CUES.contact2, t) * (1 - wedge * 0.5));
    rig.ik('upperarm_r', 'lowerarm_r', 'hand_r', reachR, shR.clone().add(v3(0.3, 0.3, 0.3)), handsW);
    rig.rot('hand_l', -30 * handsW); rig.rot('hand_r', -30 * handsW * (1 - lunge));
    rig.grip('l', 0.15 + 0.1 * Math.max(0, noise1(t * 2.3, 9)), 1);
    rig.grip('r', 0.1 + 0.8 * smooth(CUES.contact2 - 0.05, CUES.contact2 + 0.08, t) * (1 - smooth(CUES.kickFree, CUES.kickFree + 0.1, t)) + 0.4 * wedge * Math.max(0, Math.sin(t * 6)), 1);
    twitch(rig, 'l', t, 51, (1 - lunge));
    // the puddle ripples on its breaths (mouth at the face mark)
    if (puddle && puddle.setBreathSource) puddle.setBreathSource(v3(F.x, g, F.z + 0.05), (t > CUES.faceDown + 0.6 && t < CUES.lunge2) ? heave : 0);
  }

  // ------------------------------------------------------------ the walker (feet only, passing car B in U2)
  function walker(a, t) {
    const on = t >= 36.2 && t < 40.4;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    const tr = track(T.walker, t);
    a.place(tr.x, gy(tr.x, tr.z), tr.z, trackYaw(T.walker, t, 0));
    const phase = trackDist(T.walker, Math.max(t, T.walker[0].t)) * 5.2;
    walk(rig, phase, 1.0, 0.7, 6);
    hangArms(rig, t, 19, 0, 0.4, Math.sin(phase));
    idle(rig, t, 19, 0.4);
  }

  // ------------------------------------------------------------ the screamer (3605 stoop)
  function screamer(a, t) {
    const on = t >= CUES.shotS1;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    const tr = track(T.screamer, t);
    const yaw = t < 55.6 ? -Math.PI / 2 : trackYaw(T.screamer, t, -Math.PI / 2 - 0.4);
    a.place(tr.x, gy(tr.x, tr.z), tr.z, yaw);
    const up = smooth(52.5, 53.0, t);
    const shriek = smooth(CUES.screamerShriek - 0.3, CUES.screamerShriek, t) * (1 - smooth(CUES.screamerShriek + 1.4, CUES.screamerShriek + 2.0, t));
    const lunge = smooth(CUES.screamerDescends, CUES.screamerDescends + 0.5, t) * (1 - smooth(60.6, 61.3, t));
    rig.rot('thigh_l', 70 * (1 - up)); rig.rot('thigh_r', 65 * (1 - up)); rig.rot('calf_l', -100 * (1 - up)); rig.rot('calf_r', -95 * (1 - up));
    a.root.position.y -= 0.35 * (1 - up);
    rig.rot('spine_03', -14 * shriek + 18 * lunge); rig.rot('neck_02', -20 * shriek); rig.rot('head', -24 * shriek - 10 * lunge);
    rig.rot('jaw', -40 * shriek - 18 * lunge - 6);
    for (const [S, sx] of [['l', 1], ['r', -1]]) {
      rig.rot(`upperarm_${S}`, 20 * shriek + 75 * lunge, 0, sx * 55 * shriek);
      rig.rot(`lowerarm_${S}`, 25 * shriek + 10 * lunge);
      rig.grip(S, 0.7 * shriek + 0.3 + 0.2 * lunge, 1);
    }
    const phase = trackDist(T.screamer, Math.max(t, 55.6)) * 4.6;
    walk(rig, phase, clamp((tr.speed || 0) / 0.8, 0, 1.2), 0.0, 14);
    idle(rig, t, 19, 0.6);
  }

  // ------------------------------------------------------------ the brute (E Venango end)
  function brute(a, t) {
    const on = t >= 53.5;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    a.root.scale.setScalar(1.13);
    const tr = track(T.brute, t);
    a.place(tr.x, gy(tr.x, tr.z), tr.z, trackYaw(T.brute, t, Math.PI));
    const speed = clamp((tr.speed || 0) / 1.6, 0, 1.25);
    const phase = trackDist(T.brute, Math.max(t, T.brute[0].t)) * 3.3;
    // a heavy, driving charge: hunched over its hips, head thrust forward, shoulders rolling, arms out to grab
    walk(rig, phase, 0.6 + 0.6 * speed, 0.05, 22);
    rig.rot('spine_01', 10); rig.rot('spine_03', 9, 6 * Math.sin(phase)); rig.rot('spine_05', 6);
    rig.rot('neck_01', -16); rig.rot('neck_02', -10); rig.rot('head', -8, 0, 5 * Math.sin(phase * 0.5));
    rig.rot('clavicle_l', 0, 0, 8); rig.rot('clavicle_r', 0, 0, -8);
    for (const [S, sg] of [['l', 1], ['r', -1]]) {
      const sw = Math.sin(phase + (S === 'l' ? 0 : Math.PI));
      rig.rot(`upperarm_${S}`, 38 + 22 * sw * speed, 0, sg * 16);
      rig.rot(`lowerarm_${S}`, 42 - 12 * sw);
      rig.grip(S, 0.35 + 0.35 * Math.max(0, sw), 1);
    }
    idle(rig, t, 31, 0.5);
    rig.rot('jaw', -22 - 8 * Math.max(0, Math.sin(t * 5.3)));
  }

  // ------------------------------------------------------------ the crawler (out from under car_00)
  function crawler(a, t) {
    const on = t >= 53.8;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    const tr = track(T.crawler, t);
    const yaw = trackYaw(T.crawler, t, 0.4);
    a.place(tr.x, gy(tr.x, tr.z) + 0.20, tr.z, yaw);
    a.root.rotateX(Math.PI / 2 - 0.18);
    for (const S of ['l', 'r']) { const b = rig.bones[`thigh_${S}`]; if (b) b.scale.setScalar(0.32); const c = rig.bones[`calf_${S}`]; if (c) c.scale.setScalar(0.02); }
    rig.rot('neck_02', -38); rig.rot('head', -22);
    const cyc = trackDist(T.crawler, Math.max(t, T.crawler[0].t)) * 6.5 + t * 0.5;
    for (const [S, ph, sx] of [['l', 0, 1], ['r', Math.PI, -1]]) {
      const s = Math.sin(cyc + ph);
      rig.rot(`upperarm_${S}`, 110 + 40 * s, 0, sx * (20 - 10 * s));
      rig.rot(`lowerarm_${S}`, 40 - 35 * s);
      rig.rot(`hand_${S}`, -20);
      rig.grip(S, 0.5 + 0.4 * Math.max(0, -s), 1);
    }
    rig.rot('spine_03', 0, 6 * Math.sin(cyc), 0);
    rig.rot('jaw', -18 - 8 * Math.sin(t * 3));
  }

  // ------------------------------------------------------------ the homeowner (scare three, inside 3609)
  // All fours, solved properly: the pelvis tips forward P deg (90 = torso level), the thighs swing back to vertical
  // under the hips, the shins lie flat behind; the knees are put on the floor, the root slides so the HEAD sits on
  // its track mark (T.homeowner keys are head positions), and the hands are planted by IK under the shoulders.
  function allFours(rig, P, crawl, phase, headUp) {
    rig.rot('pelvis', P);
    const sw = 13 * crawl * Math.sin(phase);
    rig.rot('thigh_l', P - 8 + sw, 0, -5); rig.rot('thigh_r', P - 8 - sw, 0, 5);
    rig.rot('calf_l', -98 - 10 * crawl * Math.max(0, Math.sin(phase))); rig.rot('calf_r', -98 - 10 * crawl * Math.max(0, -Math.sin(phase)));
    rig.rot('foot_l', 42); rig.rot('foot_r', 42);
    rig.rot('spine_01', -7, 4 * crawl * Math.sin(phase)); rig.rot('spine_02', -5); rig.rot('spine_03', 3);
    rig.rot('spine_04', 8, -4 * crawl * Math.sin(phase)); rig.rot('spine_05', 10);
    rig.rot('clavicle_l', 0, 0, -6); rig.rot('clavicle_r', 0, 0, 6); // shoulder blades up: a predator's hunch
    rig.rot('neck_01', -headUp * 0.45); rig.rot('neck_02', -headUp * 0.35); rig.rot('head', -headUp * 0.2);
  }
  const _hL = new THREE.Vector3(), _hFwd = new THREE.Vector3(), _hLeft = new THREE.Vector3();
  function plantHands(a, yaw, crawl, phase, w) {
    const rig = a.rig;
    _hFwd.set(Math.sin(yaw), 0, Math.cos(yaw)); _hLeft.set(Math.cos(yaw), 0, -Math.sin(yaw));
    for (const [S, sg, ph] of [['l', 1, 0], ['r', -1, Math.PI]]) {
      a.root.updateMatrixWorld(true);
      const sh = rig.worldPos(`upperarm_${S}`, _hL).clone();
      const step = crawl * 0.12 * Math.sin(phase + ph);
      const lift = crawl * 0.08 * Math.max(0, Math.cos(phase + ph));
      const tgt = v3(sh.x, FLOOR3609 + 0.04 + lift, sh.z).addScaledVector(_hFwd, 0.12 + step).addScaledVector(_hLeft, sg * 0.07);
      const pole = sh.clone().addScaledVector(_hFwd, -0.45).addScaledVector(_hLeft, sg * 0.3).add(v3(0, 0.05, 0));
      rig.ik(`upperarm_${S}`, `lowerarm_${S}`, `hand_${S}`, tgt, pole, w);
      rig.rot(`hand_${S}`, -62 * w, 0, 0);
    }
  }
  function homeowner(a, t, camera) {
    const on = t >= 63.0 && t < CUES.cutToBlack + 0.01;
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    camera.getWorldPosition(camPos);
    const K = T.homeowner, R = MARKS.homeownerReveal;
    const tr = track(K, t);
    const moving = clamp((tr.speed || 0) / 0.5, 0, 1);
    const phase = trackDist(K, Math.max(t, K[0].t)) * 9.5;
    const toCamYaw = Math.atan2(camPos.x - tr.x, camPos.z - tr.z);
    // heading: along her path while she crawls; toward us from the creak on
    const pathYaw = trackYaw(K, t, toCamYaw);
    const turnIn = smooth(CUES.creak3 - 0.35, CUES.reveal3 - 0.05, t);
    const yaw = lerpAngle(pathYaw, toCamYaw, turnIn);
    // attack phases
    const coil = smooth(CUES.attack3 - 0.02, CUES.attack3 + 0.16, t) * (1 - smooth(CUES.attack3 + 0.16, CUES.attack3 + 0.3, t));
    const rise = smoother(CUES.attack3 + 0.05, CUES.attack3 + 0.3, t);
    const lunge = smoother(CUES.attack3 + 0.12, CUES.contact3, t);
    const hidden = t < CUES.sofaSlip - 0.35 ? 1 : 0;
    // torso pitch: low and level while hiding / crawling, rears up on the attack, then throws itself forward onto us
    const P = 84 - 4 * moving + 6 * hidden - 34 * rise + 30 * lunge;
    const headUp = hidden ? 25 : 58 + 10 * turnIn;
    a.place(tr.x, FLOOR3609, tr.z, yaw);
    allFours(rig, P, moving * (1 - turnIn), phase, headUp);
    // idle: breathing heave through the back; her head sways while she waits, then goes dead still at the reveal
    const still = smooth(CUES.reveal3 - 0.1, CUES.reveal3 + 0.05, t) * (1 - smooth(CUES.attack3 - 0.05, CUES.attack3, t));
    idle(rig, t, 41, 0.45 * (1 - still));
    a.root.updateMatrixWorld(true);
    // knees on the floor, head on its mark (before the attack); during the attack the head flies at the lens
    const kl = rig.worldPos('calf_l').y, kr = rig.worldPos('calf_r').y;
    a.root.position.y += FLOOR3609 + 0.055 - Math.min(kl, kr);
    a.root.updateMatrixWorld(true);
    const eyeY = FLOOR3609 + MARKS.homeownerEyeH;
    const lens = camPos.clone();
    const toHer = v3(R.x - lens.x, 0, R.z - lens.z).normalize();
    // head target: the track; at the attack it coils back + up, then drives to ~0.17 m in front of the lens
    // head height: low behind the sofa; up for the glimpse as she rounds its end (it looks for us); then prowling
    // low along the wall under the frame; up to our eye level as she turns to us after the creak
    const peek = smooth(CUES.sofaSlip - 0.3, CUES.sofaSlip + 0.1, t) * (1 - smooth(CUES.sofaSlip + 0.55, CUES.sofaSlip + 0.95, t));
    const prowl = smooth(CUES.sofaSlip + 0.55, CUES.sofaSlip + 0.95, t) * (1 - smooth(CUES.creak3 - 0.25, CUES.reveal3 - 0.05, t));
    const headT = v3(tr.x, eyeY - (hidden ? 0.22 : 0.06 * moving) + 0.04 * peek - 0.26 * prowl, tr.z);
    if (t >= CUES.attack3 - 0.02) {
      const back = headT.clone().addScaledVector(toHer, 0.06).add(v3(0, 0.07, 0));
      const hit = lens.clone().addScaledVector(toHer, 0.3).add(v3(0, -0.05, 0)); // head joint; her eyes end ~0.23 m from the lens
      headT.lerp(back, coil).lerp(hit, lunge);
      // on us: she keeps driving in, the head thrusting at the lens in biting jerks until the cut
      if (t > CUES.contact3) {
        const x = t - CUES.contact3;
        const drive = 0.11 * smooth(0, 0.5, x) + 0.045 * Math.max(0, Math.sin(x * 17.0)) * Math.exp(-x * 0.8);
        headT.addScaledVector(toHer, -drive).add(v3(0.012 * Math.sin(x * 23), 0.01 * Math.sin(x * 29), 0));
      }
    }
    for (let it = 0; it < 3; it++) {
      a.root.updateMatrixWorld(true);
      const h = rig.worldPos('head');
      const kxz = t < CUES.attack3 ? 1 : 1;
      a.root.position.x += (headT.x - h.x) * kxz; a.root.position.z += (headT.z - h.z) * kxz;
      if (t >= CUES.attack3 - 0.02) a.root.position.y += (headT.y - h.y) * Math.max(rise, lunge);
      else {
        // fold at the neck to bring the eyes to their height without lifting the knees off the floor
        const dy = headT.y - h.y;
        rig.rot('neck_01', THREE.MathUtils.radToDeg(clamp(-dy / 0.22, -0.5, 0.5)) * 0.8);
      }
    }
    a.root.updateMatrixWorld(true);
    // the face: drifts low and searching while she crawls, turns to us at the creak, locks on, then drives at us
    const look = smooth(CUES.creak3 - 0.5, CUES.reveal3, t);
    if (look > 0) {
      rig.lookAt('neck_02', camPos, 0.45 * look);
      rig.lookAt('head', camPos.clone().add(v3(0, -0.03, 0)), 0.95 * look);
      // a small, wrong tilt held at the reveal (the head cocked like a bird's)
      rig.rot('head', 0, 0, (14 * (1 - lunge)) * look * MARKS.homeownerSide);
    }
    rig.lookAt('eye_l', camPos, look); rig.lookAt('eye_r', camPos, look);
    // arms: planted and stepping while she crawls; on the attack both hands come up and close on us
    const reachW = smooth(CUES.attack3 + 0.08, CUES.attack3 + 0.3, t);
    plantHands(a, yaw, moving * (1 - turnIn), phase, 1 - reachW);
    if (reachW > 0) {
      const right = v3(Math.cos(toCamYaw), 0, -Math.sin(toCamYaw)); // her left side, in world (model faces +Z, left = +X)
      for (const [S, sg] of [['l', 1], ['r', -1]]) {
        a.root.updateMatrixWorld(true);
        const sh = rig.worldPos(`upperarm_${S}`).clone();
        const tgt = lens.clone().addScaledVector(toHer, 0.09).addScaledVector(right, sg * (0.2 - 0.05 * lunge)).add(v3(0, -0.06 + 0.04 * sg, 0));
        const pole = sh.clone().addScaledVector(right, sg * 0.4).add(v3(0, -0.35, 0));
        rig.ik(`upperarm_${S}`, `lowerarm_${S}`, `hand_${S}`, tgt, pole, reachW);
      }
    }
    const grab = smooth(CUES.contact3 - 0.06, CUES.contact3 + 0.08, t);
    rig.grip('l', 0.25 + 0.65 * grab + 0.15 * coil, 1); rig.grip('r', 0.25 + 0.65 * grab + 0.15 * coil, 1);
    twitch(rig, 'l', t, 43, (1 - reachW) * (1 - still)); twitch(rig, 'r', t, 47, (1 - reachW) * (1 - still));
    if (t > CUES.contact3) { const x = t - CUES.contact3; const k = Math.exp(-x * 0.9); rig.rot('head', 7 * Math.sin(x * 31) * k, 6 * Math.sin(x * 23) * k, 9 * Math.sin(x * 17) * k); }
    // the jaw is gone: what is left works on her breaths while she crawls, gapes at the reveal, convulses on the attack
    rig.rot('jaw', -8 - 6 * Math.max(0, Math.sin(t * 2.3)) * (1 - still) - 16 * still - 30 * rise - 9 * Math.max(0, Math.sin(t * 13)) * lunge);
  }

  // ------------------------------------------------------------ extras: the block fills up after the shriek
  // (head-down shamblers converging on 3609 from both ends; small in frame, read as silhouettes on the wet street)
  const EXTRA = [
    { keys: [{ t: 52.5, p: [-0.6, -7.5] }, { t: 64.0, p: [1.6, 2.6] }, { t: 88.0, p: [3.2, 4.4] }], limp: 0.5, hunch: 12, seed: 61, from: 53.4 },
    { keys: [{ t: 52.5, p: [3.7, -6.2] }, { t: 64.0, p: [4.1, 1.4] }, { t: 88.0, p: [4.3, 2.9] }], limp: 0.2, hunch: 18, seed: 67, from: 53.9 },
    { keys: [{ t: 52.5, p: [-2.4, -11.5] }, { t: 64.0, p: [0.4, -1.2] }, { t: 88.0, p: [2.6, 3.0] }], limp: 0.7, hunch: 6, seed: 71, from: 54.6 },
    { keys: [{ t: 52.5, p: [1.2, 27.5] }, { t: 64.0, p: [0.9, 18.2] }, { t: 88.0, p: [2.2, 6.6] }], limp: 0.3, hunch: 10, seed: 73, from: 54.0 },
    { keys: [{ t: 52.5, p: [-0.2, -16.0] }, { t: 64.0, p: [0.6, -6.0] }, { t: 88.0, p: [2.4, 1.6] }], crawl: true, seed: 79, from: 55.0 },
    { keys: [{ t: 52.5, p: [-3.6, 23.0] }, { t: 64.0, p: [-2.0, 14.5] }, { t: 88.0, p: [1.4, 7.8] }], limp: 0.45, hunch: 14, seed: 83, from: 54.2 },
  ];
  function extra(a, i, t) {
    const E = EXTRA[i];
    const on = !!E && t >= E.from && (t < CUES.doorSlam || t >= CUES.titleFadeIn);
    a.show(on);
    if (!on) return;
    const rig = a.rig; rig.reset();
    const tr = track(E.keys, t);
    const yaw = trackYaw(E.keys, t, Math.PI * 0.6);
    if (E.crawl) {
      a.place(tr.x, gy(tr.x, tr.z) + 0.2, tr.z, yaw);
      a.root.rotateX(Math.PI / 2 - 0.18);
      for (const S of ['l', 'r']) { const b = rig.bones[`thigh_${S}`]; if (b) b.scale.setScalar(0.32); const c = rig.bones[`calf_${S}`]; if (c) c.scale.setScalar(0.02); }
      const cyc = trackDist(E.keys, Math.max(t, E.keys[0].t)) * 6.5 + t * 0.5;
      for (const [S, ph, sx] of [['l', 0, 1], ['r', Math.PI, -1]]) {
        const sn = Math.sin(cyc + ph);
        rig.rot(`upperarm_${S}`, 110 + 40 * sn, 0, sx * (20 - 10 * sn)); rig.rot(`lowerarm_${S}`, 40 - 35 * sn); rig.grip(S, 0.5, 1);
      }
      rig.rot('neck_02', -38); rig.rot('head', -22);
      return;
    }
    a.place(tr.x, gy(tr.x, tr.z), tr.z, yaw);
    const phase = trackDist(E.keys, Math.max(t, E.keys[0].t)) * 4.8 + E.seed;
    walk(rig, phase, clamp((tr.speed || 0) / 0.5, 0.3, 1), E.limp, E.hunch);
    hangArms(rig, t, E.seed, 0.2, 0.6, Math.sin(phase));
    brokenNeck(rig, i % 2 ? 1 : -1, 0.35 + 0.2 * (i % 3), Math.sin(phase * 0.5));
    idle(rig, t, E.seed, 0.4);
    rig.rot('jaw', -10 - 6 * Math.max(0, Math.sin(t * 3 + i)));
  }

  return {
    breathTimesFacepaint,
    update(t, camera) {
      for (let i = 0; i < EXTRA.length; i++) { const e = A[`extra${i}`]; if (e) extra(e, i, t); }
      const sc = act('scarecrow', 'watcher'); if (sc) scarecrow(sc, t);
      const wr = act('wreck', 'window'); if (wr) wreck(wr, t, camera);
      const fp = act('facepaint', 'hero'); if (fp) facepaint(fp, t, camera);
      const wk = act('walker'); if (wk) walker(wk, t);
      const sr = act('screamer'); if (sr) screamer(sr, t);
      const br = act('brute'); if (br) brute(br, t);
      const cr = act('crawler'); if (cr) crawler(cr, t);
      const ho = act('homeowner'); if (ho) homeowner(ho, t, camera);
      // anything else in the cast stays hidden
      for (const [n, a] of Object.entries(A)) {
        if (!['scarecrow', 'watcher', 'wreck', 'window', 'facepaint', 'hero', 'walker', 'screamer', 'brute', 'crawler', 'homeowner'].includes(n) && !n.startsWith('extra')) a.show(false);
      }
      // fallbacks: when the v2 actor exists, a separate v1 stand-in stays hidden (index.js may alias the v1 names
      // onto the v2 actors, in which case they are the same object and must not be hidden)
      if (A.scarecrow && A.watcher && A.watcher !== A.scarecrow) A.watcher.show(false);
      if (A.wreck && A.window && A.window !== A.wreck) A.window.show(false);
      if (A.facepaint && A.hero && A.hero !== A.facepaint) A.hero.show(false);
    },
  };
}
