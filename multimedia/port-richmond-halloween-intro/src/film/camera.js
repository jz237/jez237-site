// First-person camera rig for the film: a keyframed path + look targets, with deterministic handheld motion,
// footstep bob, breathing and scare recoils. Everything is a pure function of t (renderAt-safe).
//
// The viewer is the player (first person). Shots are authored as KEYS below (Three.js frame, see world/frame.js).
// Footstep times are derived from the path (stride length by speed) and exported for the sound design.
import * as THREE from 'three';
import { CUES } from './cues.js';

// ---------------------------------------------------------------- deterministic noise
function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash(i + seed * 57.0) * 2 - 1;
  const b = hash(i + 1 + seed * 57.0) * 2 - 1;
  return a + (b - a) * u;
}
export function fbm1(x, seed = 0, oct = 3) {
  let v = 0, amp = 0.5, fr = 1;
  for (let o = 0; o < oct; o++) { v += amp * noise1(x * fr, seed + o * 13); fr *= 2.03; amp *= 0.5; }
  return v;
}
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const smoother = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
// damped spring impulse response, 0 before t0, peak ~1 shortly after
export function kick(t, t0, freq = 7, damp = 6) {
  if (t < t0) return 0;
  const x = t - t0;
  return Math.exp(-damp * x) * Math.sin(2 * Math.PI * freq * x);
}
// one-sided bump that rises fast and settles: used for flinches
export function flinch(t, t0, rise = 0.06, decay = 0.9) {
  if (t < t0) return 0;
  const x = t - t0;
  return (1 - Math.exp(-x / rise)) * Math.exp(-x / decay);
}

// ---------------------------------------------------------------- keyframes
// Each key: t, p = [x, eye height above the ground, z], l = absolute look target, fov (vertical degrees),
// shake (handheld amount 0..1), cut (start a new spline run). Positions come from the ported world / props
// anchors (review/anchors.json): the street rises ~1 m from E Venango (y -0.46) to the terminal end, the SE
// sidewalk and stoop landings sit ~0.35 m up, the 3609 front room floor is at y 0.382.
const EYE = 1.62;
export const TITLE_FOV = 58.7; // the game's title camera: 90 deg horizontal at 16:9
export const KEYS = [
  // 1. THE BLOCK — the title loop's starting view, then a slow walk up the SE side of Witte
  { t: 0.0, p: [0.9, EYE, 26.4], l: [0.98, 1.20, 15.0], fov: 52, shake: 0.22 },
  { t: 5.0, p: [1.35, EYE, 21.6], l: [2.2, 1.0, 10.0], fov: 51, shake: 0.22 },
  { t: 8.6, p: [1.95, EYE, 18.4], l: [4.9, 1.05, 14.2], fov: 50, shake: 0.22 }, // the bat tapping the 3605 railing
  { t: 11.5, p: [2.45, EYE, 15.6], l: [4.6, 0.55, -4.0], fov: 48, shake: 0.22 }, // porch figures beside Bauder, far ahead
  { t: 14.4, p: [2.95, EYE, 12.2], l: [3.5, 0.2, 8.6], fov: 46, shake: 0.2 },
  // 2. SOMETHING IS WRONG — candy pail, keys in 3609's lock, the buzzing phone, the TV window, the watcher moved
  { t: 16.0, p: [3.2, EYE, 10.4], l: [3.42, -0.12, 8.7], fov: 40, shake: 0.16 },
  { t: 17.8, p: [3.45, EYE, 9.75], l: [5.6, 1.45, 4.0], fov: 30, shake: 0.12 },
  { t: 19.4, p: [3.85, EYE, 8.75], l: [5.13, 0.42, 5.45], fov: 34, shake: 0.12 },
  { t: 21.4, p: [3.95, EYE, 8.5], l: [5.2, 0.62, 5.6], fov: 34, shake: 0.12 },
  { t: 22.5, p: [4.0, EYE, 8.35], l: [5.65, 1.82, 6.4], fov: 40, shake: 0.14 },
  { t: 23.8, p: [4.02, EYE, 8.25], l: [5.68, 1.78, 6.5], fov: 40, shake: 0.14 },
  { t: 24.6, p: [4.05, EYE, 8.15], l: [6.0, 0.95, -5.2], fov: 40, shake: 0.14 },
  { t: 27.55, p: [4.15, EYE, 8.0], l: [6.0, 1.0, -5.0], fov: 38, shake: 0.1 },
  // scare one: flinch (procedural), whip right to the window, back away with the face in frame
  { t: 27.95, p: [3.78, EYE - 0.03, 7.85], l: [5.68, 1.64, 6.32], fov: 42, shake: 0.65, ease: 'linear' },
  { t: 29.3, p: [3.15, EYE, 7.7], l: [5.68, 1.62, 6.3], fov: 40, shake: 0.5 },
  { t: 30.5, p: [1.75, EYE, 8.7], l: [5.65, 1.62, 6.35], fov: 46, shake: 0.5 },
  // 3. THE RECOGNITION — back across to the abandoned car, its rear glass reflects someone behind us, the slow turn
  { t: 32.2, p: [0.35, EYE, 10.0], l: [-1.2, 0.9, 11.4], fov: 48, shake: 0.36 },
  { t: 33.6, p: [-0.13, EYE, 10.89], l: [-1.13, 0.80, 9.89], fov: 46, shake: 0.26 },
  { t: 35.0, p: [-0.13, EYE, 10.9], l: [-1.13, 0.78, 9.86], fov: 45, shake: 0.2 },
  { t: 36.6, p: [-0.12, EYE, 10.92], l: [-0.15, 1.15, 8.9], fov: 40, shake: 0.18 },
  { t: 37.8, p: [-0.12, EYE, 10.93], l: [0.22, 1.19, 9.82], fov: 30, shake: 0.14 },
  { t: 41.0, p: [-0.12, EYE, 10.94], l: [0.21, 1.2, 9.83], fov: 26, shake: 0.1 },
  { t: 42.2, p: [-0.12, EYE, 10.94], l: [0.2, 1.2, 9.84], fov: 26, shake: 0.12 },
  // scare two: the lunge pins us against the open car door; the hand closes on the door frame beside our head
  { t: 42.5, p: [-0.13, EYE - 0.05, 11.0], l: [0.08, 1.15, 10.6], fov: 38, shake: 0.9, ease: 'linear' },
  { t: 42.78, p: [-0.03, EYE - 0.03, 11.1], l: [-0.42, 0.98, 11.0], fov: 52, shake: 0.7, ease: 'linear' },
  { t: 43.05, p: [-0.08, EYE - 0.06, 11.02], l: [0.05, 1.12, 10.6], fov: 42, shake: 0.8, ease: 'linear' },
  { t: 43.35, p: [0.05, EYE - 0.05, 11.1], l: [0.1, 1.1, 10.62], fov: 42, shake: 0.85 },
  { t: 44.2, p: [0.55, EYE, 11.75], l: [0.05, 1.1, 10.5], fov: 46, shake: 0.85 },
  { t: 45.3, p: [-0.95, EYE, 13.55], l: [-0.2, 1.1, 10.4], fov: 48, shake: 0.75 },
  // 4. THE STREET WAKES
  { t: 46.4, p: [-0.75, EYE, 13.9], l: [-1.9, -0.1, 14.6], fov: 48, shake: 0.5 },
  { t: 47.8, p: [-0.6, EYE, 13.8], l: [5.4, 4.4, 12.0], fov: 40, shake: 0.35 }, // curtain at 3605 upstairs
  { t: 49.3, p: [1.45, EYE, 12.35], l: [-1.2, 0.12, 7.85], fov: 40, shake: 0.4 }, // out into the street: the car's rear corner
  { t: 50.9, p: [1.7, EYE, 11.75], l: [-0.5, 0.12, 7.95], fov: 32, shake: 0.36 }, // something drags itself into the hazard light
  { t: 52.0, p: [1.45, EYE, 11.95], l: [2.8, 0.95, -2.0], fov: 46, shake: 0.38 }, // the watcher walking toward us
  { t: 54.4, p: [1.25, EYE, 12.05], l: [0.6, 1.4, -20.0], fov: 42, shake: 0.38 }, // screamer far up the block
  { t: 56.4, p: [1.1, EYE, 12.2], l: [-0.6, 1.2, 22.5], fov: 46, shake: 0.55 }, // the brute blocks E Venango
  { t: 58.4, p: [1.05, EYE, 12.05], l: [-0.6, 1.25, 21.5], fov: 46, shake: 0.55 },
  { t: 59.3, p: [1.1, EYE, 11.85], l: [1.6, 1.3, 6.2], fov: 46, shake: 0.7 }, // the watcher is right there
  { t: 60.6, p: [1.3, EYE, 11.55], l: [-1.0, 1.3, 9.2], fov: 47, shake: 0.7 }, // the pursuer limps back
  { t: 62.2, p: [1.95, EYE, 10.1], l: [5.4, 1.3, 3.8], fov: 48, shake: 0.85 }, // the open door
  { t: 63.8, p: [3.2, EYE, 6.2], l: [5.6, 1.3, 3.6], fov: 50, shake: 0.95 },
  { t: 64.6, p: [4.75, EYE, 4.1], l: [6.4, 1.6, 3.1], fov: 52, shake: 0.95 },
  // 5. FALSE SAFETY — into 3609, shove the door shut, silence, check the room (turning away from the hinge corner),
  //    then turn back toward the door the other way round: the corner beside the doorway is occupied
  { t: 65.0, p: [6.05, EYE, 3.3], l: [4.6, 1.55, 3.95], fov: 52, shake: 0.8 },
  { t: 65.8, p: [6.45, EYE, 3.45], l: [5.55, 1.45, 3.7], fov: 50, shake: 0.45 },
  { t: 67.4, p: [6.72, EYE - 0.02, 3.52], l: [5.6, 1.42, 3.68], fov: 50, shake: 0.2 },
  { t: 69.4, p: [6.75, EYE - 0.02, 3.55], l: [5.6, 1.40, 3.75], fov: 50, shake: 0.16 },
  { t: 70.0, p: [6.76, EYE - 0.02, 3.56], l: [6.1, 1.38, 5.6], fov: 50, shake: 0.16 }, // turning left, away from the corner
  { t: 70.8, p: [6.78, EYE - 0.02, 3.55], l: [9.3, 1.35, 3.95], fov: 50, shake: 0.16 }, // lamp, sofa
  { t: 71.8, p: [6.8, EYE - 0.02, 3.52], l: [8.5, 0.95, 0.75], fov: 50, shake: 0.15 }, // the stairs
  { t: 72.8, p: [6.8, EYE - 0.04, 3.5], l: [12.0, 1.25, 2.6], fov: 48, shake: 0.13 }, // kitchen doorway: nothing
  { t: 74.0, p: [6.8, EYE - 0.07, 3.5], l: [10.5, 1.1, 2.3], fov: 50, shake: 0.12 }, // exhale
  { t: 74.8, p: [6.78, EYE - 0.06, 3.52], l: [7.6, 1.2, 0.9], fov: 50, shake: 0.16 }, // turning back toward the door, the other way
  { t: 75.3, p: [6.76, EYE - 0.06, 3.54], l: [6.3, 1.12, 2.6], fov: 50, shake: 0.3 },
  { t: 75.8, p: [6.8, EYE - 0.08, 3.62], l: [6.4, 1.78, 2.95], fov: 52, shake: 0.6 },
  { t: 76.0, p: [6.84, EYE - 0.1, 3.68], l: [6.55, 1.86, 3.2], fov: 54, shake: 0.95 },
  { t: 76.6, p: [6.9, EYE - 0.16, 3.74], l: [6.6, 1.80, 3.3], fov: 56, shake: 1.0 },
  // 6. THE HANDOFF — cut to the game's title camera (titleStart3s: matches the title screen framing)
  { t: 76.61, p: [0.91, 1.95, 23.4], l: [0.99, 1.288, 15.4], fov: TITLE_FOV, shake: 0.0, cut: true },
  { t: 88.0, p: [0.91, 1.95, 21.9], l: [0.99, 1.288, 13.9], fov: TITLE_FOV, shake: 0.0, abs: true },
];

// approximate ground until the world's real groundY is attached (setGround)
export function approxGround(x, z) {
  if (x > 5.62 && z > -0.2 && z < 4.3) return 0.382; // 3609 front room
  if (x > 2.95) return 0.30 + (10 - z) * 0.006; // SE sidewalk
  if (x < -3.0) return -0.05 + (10 - z) * 0.008;
  return -0.40 + (10 - z) * 0.0105;
}

function catmull(p0, p1, p2, p3, t) {
  // centripetal Catmull-Rom (alpha 0.5) on THREE.Vector3
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

export class CameraRig {
  constructor(keys = KEYS, ground = approxGround) {
    this.ground = ground;
    this.setKeys(keys);
  }

  setGround(fn) {
    this.ground = fn;
    this.setKeys(this.srcKeys);
  }

  setKeys(keys) {
    this.srcKeys = keys;
    this.keys = keys.map((k) => {
      const abs = k.cut || k.abs; // title keys are absolute heights
      const y = abs ? k.p[1] : this.ground(k.p[0], k.p[2]) + k.p[1];
      return { ...k, P: new THREE.Vector3(k.p[0], y, k.p[2]), L: new THREE.Vector3(...k.l) };
    });
    this.footsteps = this.computeFootsteps();
  }

  segment(t) {
    const K = this.keys;
    if (t <= K[0].t) return [0, 0, 0];
    for (let i = 0; i < K.length - 1; i++) {
      if (t < K[i + 1].t) {
        const u = (t - K[i].t) / (K[i + 1].t - K[i].t);
        return [i, i + 1, K[i].ease === 'linear' ? u : u * u * (3 - 2 * u) * 0.5 + u * 0.5];
      }
    }
    return [K.length - 1, K.length - 1, 0];
  }

  // base (un-shaken) pose
  base(t) {
    const K = this.keys;
    const [i, j, u] = this.segment(t);
    if (i === j) return { p: K[i].P.clone(), l: K[i].L.clone(), fov: K[i].fov, shake: K[i].shake };
    // a cut key starts a new spline run
    const prevI = (k) => (k > 0 && !K[k].cut ? k - 1 : k);
    const nextI = (k) => (k < K.length - 1 && !K[k + 1].cut ? k + 1 : k);
    if (K[j].cut) return { p: K[i].P.clone(), l: K[i].L.clone(), fov: K[i].fov, shake: K[i].shake };
    const a = prevI(i), d = nextI(j);
    const p = catmull(K[a].P, K[i].P, K[j].P, K[d].P, u);
    const l = catmull(K[a].L, K[i].L, K[j].L, K[d].L, u);
    return { p, l, fov: K[i].fov + (K[j].fov - K[i].fov) * u, shake: K[i].shake + (K[j].shake - K[i].shake) * u };
  }

  computeFootsteps() {
    // walk the path in 1/120 s steps, emit a step every stride along the ground plane
    const out = [];
    let dist = 0;
    let prev = this.base(0).p;
    let side = 0;
    const end = this.keys[this.keys.length - 1].t;
    for (let t = 1 / 120; t <= end; t += 1 / 120) {
      const p = this.base(t).p;
      const k = this.keys[this.segment(t)[0]];
      if (k && k.cut) { prev = p; continue; }
      const d = Math.hypot(p.x - prev.x, p.z - prev.z);
      if (d > 0.5) { prev = p; continue; } // a jump (cut)
      const speed = d * 120;
      const stride = speed > 2.2 ? 1.25 : speed > 1.2 ? 0.95 : 0.72;
      dist += d;
      if (speed > 0.25 && dist >= stride) {
        dist = 0;
        side ^= 1;
        out.push({ t, side, speed, intensity: clamp(0.35 + speed * 0.28, 0.3, 1.0), surface: this.surfaceAt(p) });
      }
      prev = p;
    }
    return out;
  }

  surfaceAt(p) {
    if (p.x > 5.1 && p.z < 3.8 && p.z > 0.0) return 'wood'; // inside 3609
    if (p.x > 3.0 || p.x < -3.6) return 'concrete'; // sidewalks
    return 'asphalt';
  }

  // vertical bob from footsteps: each step is a soft dip
  bob(t) {
    let y = 0, roll = 0;
    for (const s of this.footsteps) {
      const dt = t - s.t;
      if (dt < -0.05 || dt > 0.6) continue;
      const amp = 0.012 + 0.02 * clamp((s.speed - 0.8) / 2.0, 0, 1);
      y -= amp * Math.exp(-((dt - 0.06) ** 2) / 0.004);
      roll += (s.side ? 1 : -1) * amp * 0.6 * Math.exp(-((dt - 0.1) ** 2) / 0.01);
    }
    return { y, roll };
  }

  // scare recoils and flinches (rotation offsets in radians + positional offsets in metres, camera-local)
  recoil(t) {
    let yaw = 0, pitch = 0, roll = 0, back = 0, down = 0;
    // scare one: recoil away from the window (window is on the camera's right)
    const s1 = flinch(t, CUES.scare1, 0.045, 0.8);
    yaw += -0.16 * s1 + 0.02 * kick(t, CUES.scare1, 9, 7);
    pitch += 0.05 * s1;
    roll += -0.05 * s1;
    back += 0.22 * s1;
    const s1b = flinch(t, CUES.scare1Knock2, 0.04, 0.5);
    back += 0.06 * s1b; roll += 0.02 * kick(t, CUES.scare1Knock2, 10, 8);
    // scare two: violent jolt back as the hand grabs the frame beside us
    const s2 = flinch(t, CUES.scare2Contact - 0.08, 0.05, 0.7);
    pitch += 0.08 * s2; roll += 0.06 * kick(t, CUES.scare2Contact, 8, 6); back += 0.18 * s2;
    // scare three: grabbed — strong shake toward the attacker
    if (t > CUES.scare3Contact) {
      const x = t - CUES.scare3Contact;
      roll += 0.09 * Math.sin(x * 31) * Math.exp(-x * 2.5);
      pitch += -0.07 * flinch(t, CUES.scare3Contact, 0.03, 0.8);
      down += 0.08 * flinch(t, CUES.scare3Contact, 0.05, 1.2);
    }
    return { yaw, pitch, roll, back, down };
  }

  apply(t, camera) {
    const b = this.base(t);
    const bob = this.bob(t);
    const r = this.recoil(t);
    const sh = b.shake;
    // handheld: low-frequency drift + breathing + higher-frequency jitter scaled with shake
    const hx = fbm1(t * 0.35, 1) * 0.012 * (0.3 + sh) + fbm1(t * 3.1, 2) * 0.004 * sh;
    const hy = fbm1(t * 0.31, 3) * 0.010 * (0.3 + sh) + Math.sin(t * Math.PI * 2 * 0.24) * 0.004 + fbm1(t * 2.9, 4) * 0.004 * sh;
    const yawN = fbm1(t * 0.27, 5) * 0.012 * (0.4 + sh) + fbm1(t * 2.3, 6) * 0.006 * sh * sh;
    const pitchN = fbm1(t * 0.29, 7) * 0.010 * (0.4 + sh) + fbm1(t * 2.6, 8) * 0.005 * sh * sh;
    const rollN = fbm1(t * 0.22, 9) * 0.010 * (0.3 + sh);

    camera.position.copy(b.p);
    camera.up.set(0, 1, 0);
    camera.lookAt(b.l);
    camera.translateX(hx);
    camera.translateY(hy + bob.y - r.down);
    camera.translateZ(r.back);
    camera.rotateY(yawN + r.yaw);
    camera.rotateX(pitchN + r.pitch);
    camera.rotateZ(rollN + bob.roll + r.roll);
    if (camera.fov !== b.fov) { camera.fov = b.fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld(true);
    return b;
  }
}

export function footstepTimes(rig) {
  return rig.footsteps.map((s) => ({ t: s.t, surface: s.surface, intensity: s.intensity, side: s.side }));
}
