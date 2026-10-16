// Where every infected is, as a pure function of film time t: root position on the ground plane (x, z), facing yaw
// (model faces +Z at yaw 0, like choreo.js) and a coarse "mode" the choreography turns into a pose. Shared by the
// choreography (poses) and the shots (camera targets), so framing and staging can never disagree.
// v2 "HIDE": see docs/DESIGN-v2.md. Times come from src/film/cues.js.
import * as THREE from 'three';
import { CUES } from './cues.js';

export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const smoother = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
export const yawTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
export const lerpAngle = (a, b, k) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return a + d * k; };

// position along a polyline of {t, p:[x,z]} keys with smoothstep easing per segment (or linear), plus speed (m/s)
export function track(keys, t) {
  if (t <= keys[0].t) return { x: keys[0].p[0], z: keys[0].p[1], speed: 0, seg: -1 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b.t) {
      const u = (t - a.t) / (b.t - a.t);
      const lin = b.ease === 'linear';
      const e = lin ? u : u * u * (3 - 2 * u);
      const dist = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1]);
      const sp = dist / (b.t - a.t) * (lin ? 1 : 1.5 * (1 - Math.abs(2 * u - 1)));
      return { x: lerp(a.p[0], b.p[0], e), z: lerp(a.p[1], b.p[1], e), speed: sp, seg: i };
    }
  }
  const k = keys[keys.length - 1];
  return { x: k.p[0], z: k.p[1], speed: 0, seg: keys.length - 1 };
}
// cumulative distance along the track (drives stride phase deterministically)
export function trackDist(keys, t, step = 1 / 30) {
  let d = 0, prev = track(keys, keys[0].t);
  for (let s = keys[0].t + step; s <= t; s += step) {
    const c = track(keys, s);
    d += Math.hypot(c.x - prev.x, c.z - prev.z);
    prev = c;
  }
  return d;
}
// heading along a track (looks a little ahead), falling back to `rest` when standing
export function trackYaw(keys, t, rest) {
  const a = track(keys, t), b = track(keys, t + 0.35);
  if (Math.hypot(b.x - a.x, b.z - a.z) > 0.004) return yawTo(a, b);
  return rest;
}

// ---------------------------------------------------------------------------------------------------------------
// Staging marks. Defaults are the lead's estimates; initTracks() refines them from the props / world anchors.
export const MARKS = {
  // the infected scarecrow sits on the 3607 display (props anchor displaySeatInfected when DRESS provides it)
  scarecrowSeat: { x: 5.18, y: 0.352, z: 4.72, yaw: -Math.PI / 2 },
  // the WreckVictim crouches in the dark between car A's curb side and the NW houses
  wreckCrouch: { x: -3.25, z: 11.15 },
  // car A curb-side rear window (scare one) — CAR anchor carA_smashWindow refines it
  smashWindow: { x: -2.86, y: 0.62, z: 11.05, nx: -1, nz: 0 },
  // car B: where the face lies in the puddle (street side, ~0.65 m from the camera) — CAR anchor carB_puddle refines
  facepaintFace: { x: -0.95, y: -0.33, z: 17.15 },
  underEye: { x: -1.60, y: -0.245, z: 17.1 },
  // 3609 refuge: sitting against the door
  doorSit: { x: 5.97, y: 1.2, z: 3.62 },
  homeownerStrip: { x: 9.0, z: 2.0 }, // hidden floor strip in front of the sofa (DRESS anchor sofaFloorStrip)
  homeownerGap: { x: 7.9, z: 0.45 }, // around the sofa end toward the door (DRESS anchor sofaEndGap)
  homeownerReveal: { x: 6.43, z: 3.98 }, // where her HEAD is at the reveal: on all fours beside us, ~0.55 m from the lens
  homeownerSide: 1, // +1: she comes along the right wall (+Z, the photo side), -1: along the stair side (-Z)
  homeownerEyeH: 0.72, // her eye height above the 3609 floor at the reveal (ours, sitting: 0.82)
};

// scare three: she ends beside us on the side of the sofa gap DRESS built, at our level, just inside arm's reach
function placeReveal() {
  const side = MARKS.homeownerGap.z > MARKS.doorSit.z - 0.6 ? 1 : -1;
  MARKS.homeownerSide = side;
  MARKS.homeownerReveal.x = MARKS.doorSit.x + 0.46;
  MARKS.homeownerReveal.z = MARKS.doorSit.z + side * 0.36;
}

export function initTracks({ props = null, world = null } = {}) {
  const A = (props && props.anchors) || {};
  const P = (n) => (A[n] && A[n].position ? A[n].position : null);
  const seat = P('displaySeatInfected');
  if (seat) {
    MARKS.scarecrowSeat.x = seat.x; MARKS.scarecrowSeat.y = seat.y; MARKS.scarecrowSeat.z = seat.z;
    if (A.displaySeatInfected.quaternion) {
      const f = new THREE.Vector3(0, 0, 1).applyQuaternion(A.displaySeatInfected.quaternion);
      MARKS.scarecrowSeat.yaw = Math.atan2(f.x, f.z);
    }
  }
  const win = A.carA_smashWindow;
  if (win && win.position) {
    MARKS.smashWindow.x = win.position.x; MARKS.smashWindow.y = win.position.y; MARKS.smashWindow.z = win.position.z;
    if (win.normal) { MARKS.smashWindow.nx = win.normal.x; MARKS.smashWindow.nz = win.normal.z; }
  }
  const pud = P('carB_puddle');
  if (pud) { MARKS.facepaintFace.x = pud.x + 0.08; MARKS.facepaintFace.z = pud.z; MARKS.facepaintFace.y = pud.y + 0.075; } // a little outside the sill so the slit shows the whole face
  const ue = P('carB_eye');
  if (ue) { MARKS.underEye.x = ue.x; MARKS.underEye.y = (world && world.groundY ? world.groundY(ue.x, ue.z) + 0.065 : ue.y); MARKS.underEye.z = ue.z; }
  const strip = P('sofaFloorStrip');
  if (strip) { MARKS.homeownerStrip.x = strip.x; MARKS.homeownerStrip.z = strip.z; }
  const gap = P('sofaEndGap');
  if (gap) { MARKS.homeownerGap.x = gap.x; MARKS.homeownerGap.z = gap.z; }
  const sit = P('door3609Inside');
  if (sit) { MARKS.doorSit.x = sit.x; MARKS.doorSit.z = sit.z; }
  placeReveal();
  rebuild();
  return MARKS;
}

// ---------------------------------------------------------------------------------------------------------------
// Tracks (rebuilt from MARKS)
export const T = {};
function rebuild() {
  const S = MARKS.scarecrowSeat;
  // the scarecrow: seated on the display -> off the stoop (P4) -> [ellipsis] under the failing light (C1) ->
  // closer after blackout one -> [ellipsis] walking toward car A (C2) -> [ellipsis] standing at the edge of the light,
  // lurching closer in blackout two (C3) -> toward car A's nose (C4) -> [ellipsis] the street wakes / S3
  T.scarecrow = {
    seatedUntil: 14.2,
    offStoop: [{ t: 14.2, p: [S.x, S.z] }, { t: 15.6, p: [S.x - 0.9, S.z - 0.15] }, { t: 17.5, p: [2.6, 3.4] }],
    // C1: far, under the failing lamp, head down; in blackout one it jumps to the near edge of the lamp's pool, head up
    c1: [{ t: 17.5, p: [1.35, -21.0] }, { t: CUES.flicker1, p: [1.35, -21.0] }, { t: CUES.flicker1End, p: [0.35, -13.2], ease: 'linear' }, { t: 23.0, p: [0.35, -13.1] }],
    // C2: we see it walk out of the pool toward car A (telephoto, over its shoulder)
    c2: [{ t: 23.0, p: [0.36, -13.0] }, { t: 25.2, p: [0.28, -11.2] }],
    // C3: stopped, a silhouette against the lamp; in blackout two it leaves the street (between the parked cars)
    c3: [{ t: 25.2, p: [0.26, -11.0] }, { t: CUES.flicker2, p: [0.26, -10.95] }, { t: CUES.flicker2End, p: [3.6, -10.4], ease: 'linear' }, { t: 29.4, p: [4.2, -9.8] }, { t: 33.6, p: [4.4, -8.6] }],
    wakes: [{ t: 52.5, p: [0.75, 6.4] }, { t: 57.4, p: [0.9, 9.4] }, { t: 60.6, p: [1.25, 10.6] }, { t: 64.0, p: [2.6, 7.4] }, { t: 88.0, p: [3.2, 5.6] }],
  };
  // the WreckVictim: crouched below car A's curb-side windows, rises and punches through at windowSmash, pushes in;
  // later it drags itself back out onto the NW sidewalk and comes toward us
  const W = MARKS.smashWindow;
  T.wreck = {
    crouch: { x: MARKS.wreckCrouch.x, z: W.z + 0.1 },
    rise: [CUES.windowSmash - 0.32, CUES.windowSmash - 0.02],
    out: [{ t: 52.5, p: [W.x - 0.55, W.z + 0.2] }, { t: 54.0, p: [W.x - 0.75, W.z + 1.0] }, { t: 58.0, p: [-3.5, 14.2] }, { t: 64.0, p: [-1.4, 16.0] }, { t: 88.0, p: [1.5, 8.2] }],
  };
  // the face-paint infected: walks in along the street, stops beside car B, kneels, lies down with its face in the
  // puddle, lunges under the sill, stays wedged clawing; out from under it for the near miss in S3
  const F = MARKS.facepaintFace;
  T.facepaint = {
    walkIn: [{ t: 37.6, p: [0.4, 13.6] }, { t: 39.2, p: [F.x + 0.95, F.z + 0.1] }],
    standAt: { x: F.x + 0.95, z: F.z + 0.1 },
    face: { x: F.x, y: F.y, z: F.z },
    lungeTo: { x: F.x - 0.36, z: F.z - 0.03 },
    // (head positions) dragging itself out from under car B's street side near the tail, toward our run
    s3: [{ t: 57.4, p: [F.x - 0.1, F.z + 0.75] }, { t: 58.4, p: [F.x + 0.25, F.z + 1.05] }, { t: 59.0, p: [F.x + 0.38, F.z + 1.2] }, { t: 64.0, p: [F.x + 0.9, F.z + 1.4] }],
    title: [{ t: 79.6, p: [0.9, 11.8] }, { t: 88.0, p: [1.9, 7.9] }],
  };
  // the walker whose feet pass in U2 (feet only)
  T.walker = [{ t: 36.4, p: [0.42, 12.2] }, { t: 40.2, p: [0.36, 22.0], ease: 'linear' }];
  // the screamer on the 3605 stoop: shriek, down the stoop, lunge toward the street as we pass
  // (on the top step toward the street, out of the door light's glare: the lit wall behind silhouettes it)
  T.screamer = [{ t: 52.5, p: [4.55, 13.3] }, { t: 55.6, p: [4.55, 13.3] }, { t: 57.4, p: [4.05, 13.25] }, { t: 59.4, p: [3.55, 12.9] }, { t: 60.2, p: [2.55, 12.1], ease: 'linear' }, { t: 64.0, p: [2.4, 8.4] }, { t: 88.0, p: [3.0, 6.0] }];
  // the brute: steps out at the E Venango end and blocks it
  // the brute: out of the E Venango end and straight at us (it drives us across the street), then after us
  T.brute = [{ t: 53.6, p: [-1.0, 24.2] }, { t: 54.6, p: [-0.85, 22.6] }, { t: 56.2, p: [-1.35, 20.9] }, { t: 57.5, p: [-1.9, 20.5] },
    { t: 58.6, p: [-1.6, 19.6] }, { t: 61.0, p: [0.4, 15.4] }, { t: 64.0, p: [2.4, 9.6] }, { t: 88.0, p: [3.3, 6.4] }];
  // the crawler: out from under car_00 into the street (S2), toward 3609
  T.crawler = [{ t: 54.0, p: [-1.35, -2.6] }, { t: 57.4, p: [-0.2, -1.2] }, { t: 64.0, p: [0.9, 1.6] }, { t: 88.0, p: [2.4, 2.9] }];
  // the homeowner: hidden on the floor in front of the sofa; slips around its end toward the door while we look at
  // the photo; on all fours beside us at the creak; rises into us
  // (keys are where her HEAD is; the body trails behind along the path)
  const H = MARKS.homeownerStrip, G = MARKS.homeownerGap, R = MARKS.homeownerReveal, sd = MARKS.homeownerSide;
  const gx = G.x, gz = G.z;
  T.homeowner = [
    { t: 63.0, p: [lerp(H.x, gx, 0.55), lerp(H.z, gz, 0.55)] }, // crouched in the strip in front of the sofa, by the gap
    { t: CUES.sofaSlip - 0.35, p: [lerp(H.x, gx, 0.7), lerp(H.z, gz, 0.7)] },
    { t: CUES.sofaSlip + 0.55, p: [gx - 0.15, gz + sd * 0.05] }, // around the sofa end (the glimpse)
    { t: CUES.sofaSlip + 1.15, p: [lerp(gx, R.x, 0.55), lerp(gz, R.z + sd * 0.05, 0.6)] }, // out of frame, below the photo
    { t: CUES.creak3 - 0.05, p: [R.x + 0.16, R.z + sd * 0.03] }, // the last creeping hand placement = the creak
    { t: CUES.reveal3, p: [R.x, R.z] },
  ];
}
rebuild();

// a few derived world points the shots aim at (head heights are approximate; choreography owns the exact pose)
export function scarecrowAt(t) {
  const S = T.scarecrow;
  if (t < S.seatedUntil) return { x: MARKS.scarecrowSeat.x, z: MARKS.scarecrowSeat.z, mode: 'seated' };
  if (t < 17.5) return { ...track(S.offStoop, t), mode: 'walk' };
  if (t < 23.0) return { ...track(S.c1, t), mode: t < CUES.flicker1 ? 'stand' : 'walk' };
  if (t < 25.2) return { ...track(S.c2, t), mode: 'walk' };
  if (t < 33.6) return { ...track(S.c3, t), mode: t < CUES.flicker2 ? 'stand' : 'walk' };
  if (t < 52.5) return { x: 0.2, z: 6.2, mode: 'stand' };
  return { ...track(S.wakes, t), mode: 'walk' };
}
