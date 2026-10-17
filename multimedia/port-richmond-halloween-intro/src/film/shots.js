// v2 "HIDE": the shot list. Each shot owns a camera (keyframed in absolute world coordinates, Three.js frame), a
// lens (vertical FOV), a depth of field, a handheld amount and the acoustic space it plays in. Cuts are hard (shot
// boundaries). Everything is a pure function of t (renderAt-safe). docs/DESIGN-v2.md describes the film.
//
// makeShots({ world, props }) refines the default marks from the world / props anchors once they are loaded.
import * as THREE from 'three';
import { CUES, FILM } from './cues.js';
import { MARKS, T, track, scarecrowAt, smooth, smoother, clamp, lerp } from './tracks.js';

// ---------------------------------------------------------------- deterministic noise (same family as camera.js)
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return s - Math.floor(s); }
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  const a = hash(i + seed * 57.0) * 2 - 1, b = hash(i + 1 + seed * 57.0) * 2 - 1;
  return a + (b - a) * u;
}
export function fbm1(x, seed = 0, oct = 3) { let v = 0, amp = 0.5, fr = 1; for (let o = 0; o < oct; o++) { v += amp * noise1(x * fr, seed + o * 13); fr *= 2.03; amp *= 0.5; } return v; }
export function kick(t, t0, freq = 7, damp = 6) { if (t < t0) return 0; const x = t - t0; return Math.exp(-damp * x) * Math.sin(2 * Math.PI * freq * x); }
export function flinch(t, t0, rise = 0.06, decay = 0.9) { if (t < t0) return 0; const x = t - t0; return (1 - Math.exp(-x / rise)) * Math.exp(-x / decay); }

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function catmull(p0, p1, p2, p3, t) {
  const d = (a, b) => Math.max(1e-4, Math.pow(a.distanceTo(b), 0.5));
  const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
  const tt = t1 + (t2 - t1) * t;
  const A1 = p0.clone().multiplyScalar((t1 - tt) / (t1 - t0)).add(p1.clone().multiplyScalar((tt - t0) / (t1 - t0)));
  const A2 = p1.clone().multiplyScalar((t2 - tt) / (t2 - t1)).add(p2.clone().multiplyScalar((tt - t1) / (t2 - t1)));
  const A3 = p2.clone().multiplyScalar((t3 - tt) / (t3 - t2)).add(p3.clone().multiplyScalar((tt - t2) / (t3 - t2)));
  const B1 = A1.clone().multiplyScalar((t2 - tt) / (t2 - t0)).add(A2.clone().multiplyScalar((tt - t0) / (t2 - t0)));
  const B2 = A2.clone().multiplyScalar((t3 - tt) / (t3 - t1)).add(A3.clone().multiplyScalar((tt - t1) / (t3 - t1)));
  return B1.multiplyScalar((t2 - tt) / (t2 - t1)).add(B2.multiplyScalar((tt - t1) / (t2 - t1)));
}

// evaluate a key list [{t, p:Vector3, l:Vector3, fov, hand, ease}] at t (Catmull-Rom on p and l)
function evalKeys(K, t) {
  if (t <= K[0].t) return { p: K[0].p.clone(), l: K[0].l.clone(), fov: K[0].fov, hand: K[0].hand ?? 0 };
  for (let i = 0; i < K.length - 1; i++) {
    if (t < K[i + 1].t) {
      let u = (t - K[i].t) / (K[i + 1].t - K[i].t);
      const e = K[i + 1].ease || 'smooth';
      if (e === 'smooth') u = u * u * (3 - 2 * u) * 0.5 + u * 0.5;
      else if (e === 'in') u = u * u;
      else if (e === 'out') u = 1 - (1 - u) * (1 - u);
      else if (e === 'snap') u = u * u * (3 - 2 * u);
      const a = Math.max(0, i - 1), d = Math.min(K.length - 1, i + 2);
      const p = catmull(K[a].p, K[i].p, K[i + 1].p, K[d].p, u);
      const l = catmull(K[a].l, K[i].l, K[i + 1].l, K[d].l, u);
      return { p, l, fov: lerp(K[i].fov, K[i + 1].fov, u), hand: lerp(K[i].hand ?? 0, K[i + 1].hand ?? 0, u) };
    }
  }
  const k = K[K.length - 1];
  return { p: k.p.clone(), l: k.l.clone(), fov: k.fov, hand: k.hand ?? 0 };
}

export function makeShots({ world = null, props = null } = {}) {
  const A = (props && props.anchors) || {};
  const AP = (n, fb) => (A[n] && A[n].position ? A[n].position.clone() : fb.clone());
  const gy = (x, z) => (world && world.groundY ? world.groundY(x, z) : -0.3);
  const eyeAt = (x, z, h = 1.62) => V(x, gy(x, z) + h, z);
  const FLOOR3609 = 0.382;

  // ---------------------------------------------------------------- P1: the hero pumpkin, rack focus up the block
  const pumpkin = AP('heroPumpkin', V(5.2, 0.54, 4.73));
  const lamp = V(-1.196, 8.663, -20.396);
  const p1 = (() => {
    // in front of the carved face (10 deg off its axis), 1.25 m back, a touch above it: the grinning face on the
    // right, the street running up the block to the failing lamp on the left (where the scarecrow will stand)
    const face = (A.heroPumpkin && A.heroPumpkin.face ? A.heroPumpkin.face.clone() : V(-0.48, 0, 0.88)).setY(0).normalize();
    const off = face.clone().applyAxisAngle(V(0, 1, 0), THREE.MathUtils.degToRad(10));
    const cam = pumpkin.clone().addScaledVector(off, 1.25).add(V(0, 0.09, 0));
    const dP = pumpkin.clone().sub(cam).normalize(), dL = lamp.clone().sub(cam).normalize();
    const look = cam.clone().add(dP.clone().multiplyScalar(0.55).add(dL.clone().multiplyScalar(0.45)).normalize().multiplyScalar(10));
    return { cam, look, focusNear: pumpkin.distanceTo(cam), focusFar: lamp.distanceTo(cam) * 0.9 };
  })();

  // ---------------------------------------------------------------- shared POV marks
  // peeking up between the front seats: eye ~1.08 m above the street so the figure under the far lamp clears the dash
  const carEye = AP('carA_eye', V(-2.28, 0.66, 11.05)).add(V(0.04, 0.14, -0.05));
  const W = MARKS.smashWindow;
  const win = V(W.x, W.y, W.z);
  const doorStreet = AP('carA_exitStreet', V(-0.55, -0.1, 11.15));
  // lying under car B with the head on the asphalt: the eye ~6.5 cm off the street, so the sill sits a few degrees
  // above the eye line and the slit shows the street, the stoops and whatever stands beside the car
  const underEye = AP('carB_eye', V(MARKS.underEye.x, MARKS.underEye.y, MARKS.underEye.z));
  underEye.y = gy(underEye.x, underEye.z) + 0.065;
  const face = () => V(T.facepaint.face.x, T.facepaint.face.y + 0.02, T.facepaint.face.z);
  const lunged = () => V(T.facepaint.lungeTo.x, T.facepaint.face.y + 0.01, T.facepaint.lungeTo.z);
  const skull = AP('skeletonHead', V(5.12, 1.18, 5.05));
  const photo = AP('familyPhoto', V(6.95, 1.95, 4.42));
  const doorIn = AP('door3609Inside', V(5.97, FLOOR3609 + 0.82, 3.62));
  const sit = V(doorIn.x, FLOOR3609 + 0.82, doorIn.z);
  const kitchen = AP('kitchenDoorway3609', V(12.19, FLOOR3609, 2.57));
  const stairs = AP('stairsFoot3609', V(8.46, FLOOR3609, 0.53));
  const scHead = (t, h = 1.62) => { const s = scarecrowAt(t); return V(s.x, gy(s.x, s.z) + h, s.z); };

  // ---------------------------------------------------------------- the shot list
  const S = [];
  const add = (o) => { S.push(o); return o; };

  add({ id: 'P1', start: 0.0, end: CUES.shotP2, space: 'exterior', kind: 'insert',
    keys: [
      { t: 0.0, p: p1.cam, l: p1.look, fov: 31 },
      { t: CUES.shotP2, p: p1.cam.clone().add(p1.look.clone().sub(p1.cam).normalize().multiplyScalar(0.1)), l: p1.look, fov: 30, ease: 'linear' },
    ],
    dof: (t) => ({ focus: lerp(p1.focusNear, p1.focusFar, smoother(CUES.rackFocus, CUES.rackFocus + 0.95, t)), aperture: 1.0 }),
  });
  add({ id: 'P2', start: CUES.shotP2, end: CUES.shotP3, space: 'exterior', kind: 'wide',
    keys: [
      { t: CUES.shotP2, p: eyeAt(-2.4, 0.6, 0.5), l: V(5.0, 0.95, 8.4), fov: 40 },
      { t: CUES.shotP3, p: eyeAt(-2.4, 0.85, 0.5), l: V(5.0, 0.95, 8.65), fov: 40, ease: 'linear' },
    ],
  });
  // the skeleton in the right third, the slumped sack-mask beside it in the left third (it lifts its head, soft)
  const seatHead = V(MARKS.scarecrowSeat.x, MARKS.scarecrowSeat.y + 0.95, MARKS.scarecrowSeat.z);
  const p3Aim = skull.clone().lerp(seatHead, 0.42);
  add({ id: 'P3', start: CUES.shotP3, end: CUES.shotP4, space: 'exterior', kind: 'medium',
    keys: [
      { t: CUES.shotP3, p: skull.clone().add(V(-2.15, -0.06, 1.12)), l: p3Aim, fov: 28 },
      { t: CUES.shotP4, p: skull.clone().add(V(-1.98, -0.06, 1.03)), l: p3Aim, fov: 27.5, ease: 'linear' },
    ],
    dof: () => ({ focus: skull.distanceTo(skull.clone().add(V(-2.1, -0.06, 1.08))), aperture: 1.6 }),
  });
  const highWin = V(3.75, 4.95, 17.7); // in front of 3603's upstairs window, pulled out over the sidewalk
  add({ id: 'P4', start: CUES.shotP4, end: CUES.shotC1, space: 'exterior', kind: 'high',
    keys: [{ t: CUES.shotP4, p: highWin, l: V(-1.7, -0.3, -6.5), fov: 44 }, { t: CUES.shotC1, p: highWin, l: V(-1.7, -0.3, -6.5), fov: 44 }],
  });

  // C1 / C3: POV hiding in car A's back seat; the look drifts toward the scarecrow (lagging, never locked)
  const lookAhead = AP('carA_lookAhead', V(0.6, 0.45, -17.5));
  add({ id: 'C1', start: CUES.shotC1, end: CUES.shotC2, space: 'carA', kind: 'pov', pov: true,
    keys: [
      // eyes on the figure under the failing lamp (~31 m), a slow strain (lens creeps in)
      // first beat wide: both headrests, the gap, dash and the beaded windshield (where we are), then the strain in
      { t: CUES.shotC1, p: carEye, l: V(1.2, 0.85, -21.0), fov: 48, hand: 0.2 },
      { t: 18.9, p: carEye.clone().add(V(0.01, 0.003, -0.02)), l: V(1.22, 0.88, -21.0), fov: 36, hand: 0.16 },
      { t: 19.4, p: carEye.clone().add(V(0.015, 0.005, -0.03)), l: V(1.25, 0.9, -21.0), fov: 29, hand: 0.14 },
      // the lamp comes back: our eyes are still on the old spot; it is standing at the near edge of the light now
      { t: CUES.flicker1End + 0.05, p: carEye.clone().add(V(0.015, 0.005, -0.03)), l: V(1.25, 0.88, -21.0), fov: 29, hand: 0.14 },
      { t: CUES.flicker1End + 0.4, p: carEye.clone().add(V(0.0, -0.012, 0.035)), l: V(0.35, 0.85, -13.2), fov: 34, hand: 0.4, ease: 'out' },
      { t: CUES.shotC2, p: carEye.clone().add(V(0.0, -0.006, 0.012)), l: V(0.35, 0.9, -13.1), fov: 32, hand: 0.28 },
    ],
    follow: { target: (t) => scHead(t, 1.2), weight: 0.15 },
    dof: () => ({ focus: 22, aperture: 0.05 }), // eyes on the far figure; keep the near interior's blur small (gather artifacts)
    breath: 0.6,
  });
  add({ id: 'C2', start: CUES.shotC2, end: CUES.shotC3, space: 'exterior', kind: 'ots',
    keys: (() => {
      const k = [];
      for (const t of [CUES.shotC2, 24.1, CUES.shotC3]) {
        const s = track(T.scarecrow.c2, t);
        // tight behind its right shoulder, head height: the sack mask fills the right third, car A dark beyond
        k.push({ t, p: V(s.x - 0.2, gy(s.x, s.z) + 1.4, s.z - 0.92), l: V(-1.15, 0.55, 10.5), fov: 36, hand: 0.12 });
      }
      return k;
    })(),
    dof: () => ({ focus: 1.05, aperture: 0.5 }),
  });
  const lean = carEye.clone().add(V(0.07, 0.015, -0.12));
  add({ id: 'C3', start: CUES.shotC3, end: CUES.smashHoldEnd, space: 'carA', kind: 'pov', pov: true,
    keys: [
      { t: CUES.shotC3, p: carEye, l: V(0.26, 0.9, -11.0), fov: 38, hand: 0.3 },
      { t: CUES.flicker2, p: carEye.clone().add(V(0.01, 0, -0.02)), l: V(0.26, 0.88, -11.0), fov: 35, hand: 0.2 },
      // the lamp is back and the street is empty: hold on the spot, then search ahead / right
      { t: CUES.flicker2End + 0.35, p: carEye.clone().add(V(0.0, -0.01, 0.02)), l: V(0.26, 0.8, -11.0), fov: 37, hand: 0.35 },
      { t: CUES.leanLook, p: carEye.clone().add(V(0.03, 0.0, -0.04)), l: V(2.6, 0.8, -10.5), fov: 42, hand: 0.3 },
      // lean in between the seats and look LEFT through the driver's windows: the sidewalk, nothing
      { t: 28.6, p: lean, l: V(-4.5, 0.75, 7.6), fov: 46, hand: 0.25 },
      { t: CUES.windowSmash, p: lean.clone().add(V(-0.01, 0, 0.01)), l: V(-4.7, 0.7, 8.4), fov: 46, hand: 0.15 },
      // SCARE ONE: the window right beside us: whip to it, jerk away to the right
      { t: CUES.windowSmash + 0.16, p: lean.clone().add(V(0.13, 0.02, 0.06)), l: win.clone().add(V(0.3, 0.12, -0.15)), fov: 50, hand: 0.9, ease: 'out' },
      { t: CUES.smashFace + 0.3, p: lean.clone().add(V(0.2, 0.0, 0.1)), l: win.clone().add(V(0.42, 0.06, 0.0)), fov: 50, hand: 0.75 },
      { t: CUES.smashHoldEnd, p: V(-1.72, carEye.y - 0.03, carEye.z + 0.05), l: win.clone().add(V(0.45, 0.02, 0.05)), fov: 52, hand: 0.7 },
    ],
    follow: { target: (t) => scHead(t, 1.2), weight: (t) => 0.3 * (1 - smooth(CUES.flicker2 + 0.2, CUES.flicker2End, t)) },
    recoil: (t) => {
      const s = flinch(t, CUES.windowSmash, 0.03, 0.6);
      return { yaw: 0.05 * kick(t, CUES.windowSmash, 9, 7), pitch: 0.06 * s, roll: 0.07 * s + 0.03 * kick(t, CUES.smashGrab, 8, 6), back: 0.05 * s, down: 0.02 * s };
    },
    dof: (t) => ({ focus: t < CUES.windowSmash ? 16 : 0.7, aperture: t < CUES.windowSmash ? 0.05 : 0.2 }),
    breath: 0.8,
  });
  add({ id: 'C4', start: CUES.smashHoldEnd, end: CUES.shotU1, space: (t) => (t < CUES.carDoorOpen + 0.25 ? 'carA' : 'exterior'), kind: 'pov', pov: true,
    keys: [
      { t: CUES.smashHoldEnd, p: V(-1.72, carEye.y - 0.03, carEye.z + 0.05), l: win.clone().add(V(0.45, 0.02, 0.05)), fov: 52, hand: 0.7 },
      { t: CUES.carDoorOpen, p: V(-1.62, carEye.y - 0.05, carEye.z + 0.05), l: V(-0.6, 0.45, 11.2), fov: 54, hand: 0.9, ease: 'out' },
      { t: CUES.carDoorOpen + 0.5, p: V(-0.95, carEye.y - 0.12, carEye.z + 0.1), l: V(0.6, 0.0, 11.6), fov: 56, hand: 1.0 },
      { t: CUES.fallAsphalt, p: V(-0.35, gy(-0.35, 11.3) + 0.32, 11.3), l: V(1.4, -0.3, 11.8), fov: 56, hand: 1.0, ease: 'in' },
      { t: CUES.fallAsphalt + 0.55, p: V(-0.22, gy(-0.2, 11.4) + 0.38, 11.4), l: V(-2.1, 0.6, 10.95), fov: 54, hand: 0.8, ease: 'out' },
      { t: CUES.shotU1, p: V(-0.18, gy(-0.2, 11.6) + 0.42, 11.6), l: V(-2.0, 0.7, 10.9), fov: 54, hand: 0.7 },
    ],
    recoil: (t) => { const s = flinch(t, CUES.fallAsphalt, 0.02, 0.35); return { pitch: -0.12 * s, roll: 0.15 * s, down: 0.06 * s }; },
    dof: () => ({ focus: 2.2, aperture: 0.15 }),
    breath: 1.2,
  });

  // ---------------------------------------------------------------- UNDER car B
  add({ id: 'U1', start: CUES.shotU1, end: 35.4, space: (t) => (t < 34.7 ? 'exterior' : 'underB'), kind: 'pov', pov: true,
    keys: [
      { t: CUES.shotU1, p: V(0.7, gy(0.7, 16.7) + 0.32, 16.7), l: V(-1.6, gy(-1.6, 17.0) + 0.1, 17.0), fov: 54, hand: 0.9 },
      { t: 34.7, p: V(-0.7, gy(-0.7, 16.95) + 0.17, 16.95), l: V(-2.6, gy(-2.6, 17.1) + 0.12, 17.1), fov: 54, hand: 0.8, ease: 'in' },
      { t: 35.4, p: V(-1.25, underEye.y, 17.05), l: V(-3.0, underEye.y, 17.2), fov: 54, hand: 0.5 },
    ],
    breath: 1.0,
  });
  const out = V(2.4, underEye.y - 0.04, underEye.z);
  add({ id: 'U2', start: 35.4, end: CUES.faceDown, space: 'underB', kind: 'pov', pov: true,
    keys: [
      { t: 35.4, p: underEye.clone().add(V(0.05, 0.0, 0.0)), l: out.clone().add(V(0, 0, -0.6)), fov: 50, hand: 0.35 },
      { t: 36.6, p: underEye, l: out.clone().add(V(0, 0, -0.9)), fov: 50, hand: 0.15 },
      { t: 38.4, p: underEye, l: out.clone().add(V(0, 0, 0.0)), fov: 49, hand: 0.12 },
      { t: CUES.feetStop + 0.2, p: underEye, l: V(-0.2, underEye.y + 0.05, T.facepaint.standAt.z), fov: 48, hand: 0.1 },
      { t: CUES.kneel, p: underEye, l: V(-0.25, underEye.y + 0.02, T.facepaint.standAt.z), fov: 47, hand: 0.12 },
      { t: CUES.faceDown, p: underEye, l: face(), fov: 46, hand: 0.1 },
    ],
    dof: (t) => ({ focus: t < CUES.feetStop ? 2.0 : 1.2, aperture: 0.35 }),
    breath: 0.25,
  });
  add({ id: 'U3', start: CUES.faceDown, end: 48.4, space: 'underB', kind: 'pov', pov: true,
    keys: [
      { t: CUES.faceDown, p: underEye, l: face(), fov: 46, hand: 0.1 },
      { t: CUES.inspectStart, p: underEye, l: face(), fov: 44, hand: 0.06 },
      { t: CUES.gazeLock2, p: underEye, l: face(), fov: 33, hand: 0.03, ease: 'linear' },
      { t: CUES.lunge2, p: underEye, l: face(), fov: 33, hand: 0.02 },
      // the lunge: its face comes in under the sill to ~0.45 m, centred, the hand clawing past on the right
      { t: CUES.contact2, p: underEye.clone().add(V(-0.06, 0.0, 0.0)), l: lunged().add(V(0, 0.0, 0.0)), fov: 42, hand: 1.0, ease: 'out' },
      { t: CUES.grabYank + 0.12, p: underEye.clone().add(V(0.06, 0.0, 0.0)), l: lunged().add(V(0, -0.01, 0.03)), fov: 44, hand: 1.0, ease: 'out' },
      { t: CUES.kickFree + 0.15, p: underEye.clone().add(V(-0.14, 0.0, 0.02)), l: lunged().add(V(0.05, 0.0, 0.0)), fov: 46, hand: 1.0, ease: 'out' },
      { t: 48.4, p: underEye.clone().add(V(-0.25, 0.0, 0.03)), l: face().add(V(-0.25, 0.02, 0.0)), fov: 48, hand: 0.9 },
    ],
    recoil: (t) => { const s = flinch(t, CUES.contact2, 0.025, 0.5); return { roll: 0.06 * kick(t, CUES.contact2, 11, 6), pitch: 0.03 * s, yaw: 0.04 * kick(t, CUES.grabYank, 7, 5) }; },
    // from the lunge the focus rides its face (main.js resolves `track` to the live head distance): the scare's face is
    // the sharpest thing in the frame instead of a 0.45 m guess it rushed through
    dof: (t) => (t < CUES.lunge2 ? { focus: underEye.distanceTo(face()), aperture: 0.45 } : { focus: 0.45, aperture: 0.45, track: 'facepaint' }),
    breath: 0.12,
  });
  add({ id: 'U4', start: 48.4, end: CUES.shotS1, space: (t) => (t < CUES.rollOut + 0.4 ? 'underB' : 'exterior'), kind: 'pov', pov: true,
    keys: [
      { t: 48.4, p: underEye.clone().add(V(-0.25, 0.0, 0.03)), l: face().add(V(-0.25, 0.02, 0.0)), fov: 48, hand: 0.9 },
      { t: CUES.rollOut, p: V(-2.62, underEye.y + 0.01, underEye.z + 0.2), l: face().add(V(-0.3, 0.05, 0.0)), fov: 50, hand: 0.9 },
      { t: CUES.rollOut + 0.8, p: V(-3.3, gy(-3.4, 17.5) + 0.32, 17.5), l: V(-1.5, gy(-1.5, 17.3) + 1.4, 17.2), fov: 52, hand: 1.0 },
      { t: CUES.standUp, p: V(-3.55, gy(-3.6, 17.8) + 1.15, 17.8), l: V(-1.9, 0.75, 17.2), fov: 52, hand: 0.8 },
      { t: CUES.standUp + 0.7, p: eyeAt(-3.62, 17.9, 1.6), l: V(2.5, 0.9, 16.0), fov: 52, hand: 0.6 },
      { t: CUES.shotS1, p: eyeAt(-3.64, 17.95, 1.62), l: V(-1.5, 1.0, 13.0), fov: 52, hand: 0.6 },
    ],
    recoil: (t) => ({ roll: (t > CUES.rollOut && t < CUES.rollOut + 0.8) ? 0.9 * Math.sin(Math.PI * (t - CUES.rollOut) / 0.8) : 0 }),
    breath: 1.2,
  });

  // ---------------------------------------------------------------- THE STREET WAKES
  const s1Eye = eyeAt(-3.64, 17.95, 1.62);
  add({ id: 'S1', start: CUES.shotS1, end: CUES.shotS2, space: 'exterior', kind: 'pov', pov: true,
    keys: [
      { t: CUES.shotS1, p: s1Eye, l: V(-2.7, 0.7, 11.2), fov: 52, hand: 0.6 },
      { t: CUES.screamerShriek - 0.25, p: s1Eye.clone().add(V(0.05, 0, -0.08)), l: V(-2.6, 0.75, 11.3), fov: 52, hand: 0.6 },
      { t: CUES.screamerShriek + 0.25, p: s1Eye.clone().add(V(0.08, 0.04, -0.1)), l: V(4.6, 1.75, 13.3), fov: 32, hand: 0.7, ease: 'out' },
      { t: CUES.bruteBlocks + 0.1, p: s1Eye.clone().add(V(0.12, 0.04, -0.1)), l: V(4.5, 1.7, 13.35), fov: 34, hand: 0.6 },
      { t: CUES.bruteBlocks + 0.45, p: s1Eye.clone().add(V(0.15, 0, -0.08)), l: V(-0.6, 1.4, 22.6), fov: 50, hand: 0.8, ease: 'out' },
      { t: CUES.shotS2, p: s1Eye.clone().add(V(0.2, 0, -0.06)), l: V(-0.4, 1.3, 22.4), fov: 50, hand: 0.8 },
    ],
    dof: () => ({ focus: 9, aperture: 0.05 }),
    breath: 1.6,
  });
  add({ id: 'S2', start: CUES.shotS2, end: CUES.shotS3, space: 'exterior', kind: 'high',
    keys: [{ t: CUES.shotS2, p: highWin, l: V(-1.7, -0.4, -3.0), fov: 46 }, { t: CUES.shotS3, p: highWin.clone().add(V(-0.04, 0, 0)), l: V(-1.7, -0.4, -3.0), fov: 45.5, ease: 'linear' }],
  });
  // the run: around car B's tail, across the street, past the scarecrow and the screamer, up 3609's stoop
  const run = [
    [CUES.shotS3, -3.35, 18.7], [57.85, -2.75, 20.25], [58.25, -1.4, 20.35], [CUES.nearMiss, -0.1, 18.9], [59.2, 0.95, 16.6],
    [CUES.screamerDescends, 1.55, 14.4], [60.2, 2.1, 12.2], [60.9, 2.85, 10.0], [61.6, 3.65, 7.6], [62.3, 4.05, 5.4], [CUES.reachStoop, 4.4, 4.2],
  ];
  const runKeys = run.map(([t, x, z], i) => {
    const nx = run[Math.min(run.length - 1, i + 1)];
    const dir = V(nx[1] - x, 0, nx[2] - z);
    if (dir.lengthSq() < 1e-6) dir.set(1, 0, -0.6);
    dir.normalize();
    return { t, p: eyeAt(x, z, 1.6), l: eyeAt(x + dir.x * 6, z + dir.z * 6, 1.25), fov: 58, hand: 1.0, ease: 'none' };
  });
  // glances at the threats while running
  const glance = (t0, t1, target, w) => (t) => w * smooth(t0, t0 + 0.15, t) * (1 - smooth(t1 - 0.15, t1, t)) * 1 + 0 * target;
  add({ id: 'S3', start: CUES.shotS3, end: CUES.doorEnter, space: 'exterior', kind: 'pov', pov: true, run: true,
    keys: [
      ...runKeys,
      { t: 63.2, p: V(4.95, FLOOR3609 + 1.6, 3.7), l: V(6.5, 1.75, 3.5), fov: 56, hand: 0.9 },
      { t: CUES.doorEnter, p: V(5.5, FLOOR3609 + 1.6, 3.63), l: V(7.0, 1.7, 3.4), fov: 56, hand: 0.9 },
    ],
    glances: [
      { t0: CUES.nearMiss - 0.3, t1: CUES.nearMiss + 0.5, target: () => { const f = track(T.facepaint.s3, CUES.nearMiss); return V(f.x, -0.05, f.z); }, w: 0.85 },
      { t0: CUES.screamerDescends - 0.1, t1: CUES.screamerDescends + 0.65, target: () => V(3.5, 1.3, 12.9), w: 0.6 },
      { t0: 60.25, t1: 60.85, target: (t) => scHead(t, 1.4), w: 0.55 },
    ],
    dof: () => ({ focus: 6, aperture: 0.1 }),
    breath: 2.0,
  });
  void glance;

  // ---------------------------------------------------------------- FALSE SAFETY (3609)
  const E = FLOOR3609 + 1.6;
  const inside = V(6.05, E, 3.6);
  add({ id: 'R1', start: CUES.doorEnter, end: CUES.silenceStart, space: (t) => (t < CUES.doorSlam ? 'exterior' : 'room3609'), kind: 'pov', pov: true,
    keys: [
      { t: CUES.doorEnter, p: V(5.5, E, 3.63), l: V(7.0, 1.7, 3.4), fov: 56, hand: 0.9 },
      { t: 63.95, p: V(6.1, E, 3.58), l: V(8.5, 1.6, 3.0), fov: 56, hand: 0.8 },
      { t: 64.3, p: V(6.12, E, 3.6), l: V(5.2, 1.85, 3.66), fov: 54, hand: 0.8, ease: 'out' },
      { t: CUES.doorSlam, p: V(6.0, E - 0.02, 3.62), l: V(5.3, 1.85, 3.64), fov: 54, hand: 0.9 },
      { t: CUES.deadbolt, p: V(6.0, E - 0.06, 3.6), l: V(5.62, 1.42, 3.28), fov: 52, hand: 0.5 },
      { t: CUES.doorSlap - 0.1, p: V(6.02, E - 0.04, 3.6), l: V(5.6, 2.05, 3.62), fov: 52, hand: 0.35 },
      { t: CUES.doorSlap + 0.25, p: V(6.2, E - 0.03, 3.58), l: V(5.6, 2.08, 3.62), fov: 52, hand: 0.6, ease: 'out' },
      { t: CUES.silenceStart, p: V(6.42, E - 0.02, 3.55), l: V(5.6, 2.05, 3.6), fov: 52, hand: 0.35 },
    ],
    recoil: (t) => { const a = flinch(t, CUES.doorSlam, 0.02, 0.25), b = flinch(t, CUES.doorSlap, 0.03, 0.5); return { pitch: 0.02 * a, roll: 0.01 * kick(t, CUES.doorSlam, 10, 9), back: 0.06 * b, yaw: 0.02 * b }; },
    breath: 1.6,
  });
  add({ id: 'R2', start: CUES.silenceStart, end: CUES.slideDown, space: 'room3609', kind: 'pov', pov: true,
    keys: [
      { t: CUES.silenceStart, p: V(6.42, E - 0.02, 3.55), l: V(5.6, 2.05, 3.6), fov: 52, hand: 0.3 },
      { t: 66.7, p: V(6.45, E - 0.02, 3.52), l: V(8.6, 1.3, 2.7), fov: 52, hand: 0.25 },
      { t: CUES.checkKitchen + 0.3, p: V(6.5, E - 0.02, 3.5), l: kitchen.clone().add(V(0, 1.05, 0)), fov: 48, hand: 0.2 },
      { t: CUES.checkKitchen + 1.3, p: V(6.52, E - 0.02, 3.48), l: kitchen.clone().add(V(-0.4, 1.0, -0.3)), fov: 48, hand: 0.18 },
      { t: CUES.checkStairs, p: V(6.52, E - 0.02, 3.45), l: stairs.clone().add(V(0.1, 0.9, 0.0)), fov: 50, hand: 0.2 },
      { t: CUES.checkStairs + 0.9, p: V(6.52, E - 0.02, 3.45), l: stairs.clone().add(V(1.2, 2.4, 0.0)), fov: 50, hand: 0.18 },
      { t: CUES.relief, p: V(6.5, E - 0.05, 3.48), l: V(8.4, 1.15, 2.5), fov: 52, hand: 0.15 },
      { t: CUES.slideDown, p: V(6.45, E - 0.07, 3.5), l: V(8.4, 1.1, 2.5), fov: 52, hand: 0.15 },
    ],
    breath: 0.9,
  });
  // looking up at the family photo: the photo in the upper right, the sofa's right end (where she slips round) in the
  // lower left of the same frame
  const photoAim = (() => {
    const gap = AP('sofaEndGap', V(8.23, FLOOR3609, 3.94)).add(V(0, 0.5, 0));
    const dP = photo.clone().sub(sit).normalize(), dG = gap.clone().sub(sit).normalize();
    return sit.clone().add(dP.multiplyScalar(0.64).add(dG.multiplyScalar(0.36)).normalize().multiplyScalar(2));
  })();
  add({ id: 'R3', start: CUES.slideDown, end: CUES.creak3, space: 'room3609', kind: 'pov', pov: true,
    keys: [
      { t: CUES.slideDown, p: V(6.45, E - 0.07, 3.5), l: V(8.4, 1.1, 2.5), fov: 52, hand: 0.15 },
      { t: 71.6, p: V(doorIn.x + 0.06, E - 0.08, doorIn.z), l: V(8.4, 1.05, 2.6), fov: 52, hand: 0.15 },
      { t: 72.6, p: sit, l: V(8.2, 0.95, 2.8), fov: 52, hand: 0.12, ease: 'in' },
      { t: CUES.lookPhoto, p: sit, l: V(8.0, 1.0, 2.9), fov: 52, hand: 0.1 },
      { t: CUES.lookPhoto + 0.8, p: sit, l: photoAim, fov: 50, hand: 0.08 },
      { t: CUES.sofaSlip + 0.6, p: sit, l: photoAim.clone().add(V(0.0, 0.01, 0.0)), fov: 48, hand: 0.06, ease: 'linear' },
      // after the glimpse the eyes settle on her smiling face in the photo (slow push in)
      { t: CUES.creak3, p: sit, l: photoAim.clone().lerp(photo, 0.55), fov: 39, hand: 0.05 },
    ],
    recoil: (t) => { const s = flinch(t, 72.6, 0.03, 0.4); return { down: 0.02 * s, pitch: -0.02 * s }; },
    breath: 0.5,
  });
  const R = MARKS.homeownerReveal;
  const herFace = V(R.x, FLOOR3609 + MARKS.homeownerEyeH, R.z);
  // the face comes straight at the lens along toHer: keep looking down that line (she fills the frame at contact)
  const toHer = herFace.clone().sub(sit).setY(0).normalize();
  const along = (d, dy = 0) => sit.clone().addScaledVector(toHer, d).add(V(0, herFace.y - sit.y + dy, 0));
  add({ id: 'R5', start: CUES.creak3, end: CUES.cutToBlack, space: 'room3609', kind: 'pov', pov: true,
    keys: [
      { t: CUES.creak3, p: sit, l: photoAim.clone().lerp(photo, 0.55), fov: 39, hand: 0.05 },
      { t: CUES.creak3 + 0.1, p: sit, l: photoAim.clone().lerp(photo, 0.55).lerp(herFace, 0.12), fov: 41, hand: 0.08 },
      { t: CUES.reveal3, p: sit.clone().add(V(0.0, -0.005, 0.0)), l: herFace.clone().add(V(0, 0.02, 0)), fov: 47, hand: 0.2, ease: 'out' },
      // frozen: we recoil a few cm against the door and do not breathe
      { t: CUES.reveal3 + 0.18, p: sit.clone().addScaledVector(toHer, -0.035).add(V(0, 0.01, 0)), l: herFace.clone().add(V(0, 0.03, 0)), fov: 47, hand: 0.12, ease: 'out' },
      { t: CUES.attack3, p: sit.clone().addScaledVector(toHer, -0.04).add(V(0, 0.01, 0)), l: herFace.clone().add(V(0, 0.03, 0)), fov: 47, hand: 0.15 },
      { t: CUES.contact3, p: sit.clone().addScaledVector(toHer, -0.07).add(V(0, -0.03, 0)), l: along(0.6, -0.06), fov: 54, hand: 1.0, ease: 'out' },
      { t: CUES.cutToBlack, p: sit.clone().addScaledVector(toHer, -0.08).add(V(0, -0.09, 0)), l: along(0.6, -0.13), fov: 56, hand: 1.0 }, // ends on the open throat
    ],
    recoil: (t) => {
      if (t < CUES.contact3) return { back: 0.03 * flinch(t, CUES.reveal3, 0.03, 0.5) };
      const x = t - CUES.contact3;
      const k = Math.exp(-x * 1.1);
      // shoved back against the door, the view thrashing as she bites at us
      return { roll: (0.12 * Math.sin(x * 29) + 0.05 * Math.sin(x * 47)) * k, yaw: 0.05 * Math.sin(x * 37) * k, pitch: -0.08 * flinch(t, CUES.contact3, 0.03, 0.8) + 0.035 * Math.sin(x * 41) * k, down: 0.06 * flinch(t, CUES.contact3, 0.05, 1.0), back: 0.03 * flinch(t, CUES.contact3, 0.03, 0.6) };
    },
    breath: 0.3,
  });

  // ---------------------------------------------------------------- black + the title background
  add({ id: 'BLACK', start: CUES.cutToBlack, end: CUES.titleFadeIn, space: 'black', kind: 'black',
    keys: [{ t: CUES.cutToBlack, p: sit, l: herFace, fov: 58 }, { t: CUES.titleFadeIn, p: sit, l: herFace, fov: 58 }],
  });
  const titleCam = highWin.clone().add(V(0.0, 0.35, 0.25)); // the same upstairs window as P4 / S2: calm, swarming, aftermath
  add({ id: 'TITLE', start: CUES.titleFadeIn, end: 1e9, space: 'exterior', kind: 'title',
    keys: [
      { t: CUES.titleFadeIn, p: titleCam, l: V(-1.4, -0.6, -4.5), fov: 50 },
      { t: FILM.duration, p: titleCam.clone().add(V(0.0, 0.0, 0.0)), l: V(-1.4, -0.62, -4.5), fov: 49.4, ease: 'linear' },
    ],
  });

  // evaluate key lists once into vectors
  for (const s of S) {
    s.K = s.keys.map((k) => ({ ...k, p: k.p.clone(), l: k.l.clone() }));
    s.spaceAt = typeof s.space === 'function' ? s.space : () => s.space;
  }

  function shotAt(t) {
    for (let i = S.length - 1; i >= 0; i--) if (t >= S[i].start) return S[i];
    return S[0];
  }

  // footsteps for the running POV (audio + bob): every stride along the run path
  const footsteps = [];
  {
    const sh = S.find((s) => s.id === 'S3');
    let prev = evalKeys(sh.K, sh.start).p, dist = 0, side = 0;
    for (let t = sh.start + 1 / 120; t < sh.end; t += 1 / 120) {
      const p = evalKeys(sh.K, t).p;
      const d = Math.hypot(p.x - prev.x, p.z - prev.z);
      dist += d; prev = p;
      const sp = d * 120;
      const stride = sp > 2.4 ? 1.2 : 0.9;
      if (sp > 0.4 && dist >= stride) { dist = 0; side ^= 1; footsteps.push({ t: +t.toFixed(3), side, speed: +sp.toFixed(2), intensity: clamp(0.45 + sp * 0.18, 0.4, 1), surface: p.y > 1.7 ? 'concrete' : (p.x > 3.0 ? 'concrete' : 'asphalt') }); }
    }
    for (const t of [63.75, 64.05, 64.35]) footsteps.push({ t, side: 0, speed: 1.2, intensity: 0.6, surface: 'wood' });
  }
  // the victim's breaths (POV): onset times, for breath fog and the audio
  const breaths = [];
  for (const s of S) {
    if (!s.pov || !s.breath) continue;
    const period = 3.6 / (1 + s.breath * 1.4);
    for (let t = s.start + 0.2; t < s.end; t += period) breaths.push({ t: +(t + 0.08 * Math.sin(t * 7.31)).toFixed(3), shot: s.id, strength: Math.min(1, 0.3 + s.breath * 0.35) });
  }

  const _rock = new THREE.Matrix4();
  function base(t) {
    const s = shotAt(t);
    const e = evalKeys(s.K, t);
    if (s.follow) {
      const w = typeof s.follow.weight === 'function' ? s.follow.weight(t) : s.follow.weight;
      if (w > 0) e.l.lerp(s.follow.target(t), w);
    }
    if (s.glances) for (const g of s.glances) {
      const w = g.w * smooth(g.t0, g.t0 + 0.15, t) * (1 - smooth(g.t1 - 0.15, g.t1, t));
      if (w > 0) e.l.lerp(g.target(t), w);
    }
    return { shot: s, ...e };
  }

  function apply(t, camera) {
    const b = base(t);
    const s = b.shot;
    const sh = b.hand || 0;
    const r = s.recoil ? s.recoil(t) : {};
    // handheld: low drift + breathing + jitter (POV only); tripod shots stay locked
    let hx = 0, hy = 0, yawN = 0, pitchN = 0, rollN = 0;
    if (s.pov || sh > 0) {
      const br = s.breath || 0;
      const brRate = 0.22 + 0.16 * br;
      hx = fbm1(t * 0.35, 1) * 0.010 * (0.3 + sh) + fbm1(t * 3.1, 2) * 0.004 * sh;
      hy = fbm1(t * 0.31, 3) * 0.008 * (0.3 + sh) + Math.sin(t * Math.PI * 2 * brRate) * 0.003 * (0.5 + br) + fbm1(t * 2.9, 4) * 0.004 * sh;
      yawN = fbm1(t * 0.27, 5) * 0.010 * (0.3 + sh) + fbm1(t * 2.3, 6) * 0.008 * sh * sh;
      pitchN = fbm1(t * 0.29, 7) * 0.008 * (0.3 + sh) + fbm1(t * 2.6, 8) * 0.007 * sh * sh;
      rollN = fbm1(t * 0.22, 9) * 0.010 * (0.3 + sh);
    }
    // running bob
    let bobY = 0, bobR = 0;
    if (s.run) for (const f of footsteps) {
      const dt = t - f.t;
      if (dt < -0.05 || dt > 0.5) continue;
      bobY -= 0.035 * Math.exp(-((dt - 0.05) ** 2) / 0.003);
      bobR += (f.side ? 1 : -1) * 0.012 * Math.exp(-((dt - 0.08) ** 2) / 0.008);
    }
    // inside car A the camera rides the car's rocking (the smash, the infected's pushes, the door shove)
    const space = s.spaceAt(t);
    const carA = props && props.api ? props.api.carA : null;
    if (space === 'carA' && carA && carA.rockMatrixAt) {
      const m = carA.rockMatrixAt(t, _rock);
      if (m) { b.p.applyMatrix4(m); b.l.applyMatrix4(m); }
    }
    camera.position.copy(b.p);
    camera.up.set(0, 1, 0);
    camera.lookAt(b.l);
    camera.translateX(hx);
    camera.translateY(hy + bobY - (r.down || 0));
    camera.translateZ(r.back || 0);
    camera.rotateY(yawN + (r.yaw || 0));
    camera.rotateX(pitchN + (r.pitch || 0));
    camera.rotateZ(rollN + bobR + (r.roll || 0));
    if (camera.fov !== b.fov) { camera.fov = b.fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld(true);
    return b;
  }

  return {
    shots: S,
    shotAt,
    base,
    apply,
    spaceAt: (t) => shotAt(t).spaceAt(t),
    dofAt: (t) => { const s = shotAt(t); return s.dof ? { enabled: true, ...s.dof(t) } : { enabled: false, focus: 10, aperture: 0 }; },
    cameraAt: (t) => { const b = base(t); return { position: b.p, lookAt: b.l, fov: b.fov, shot: b.shot.id, space: b.shot.spaceAt(t) }; },
    footsteps,
    breaths,
    marks: { pumpkin, skull, photo, sit, herFace, carEye, underEye, win, highWin, titleCam, doorStreet, inside },
  };
}
