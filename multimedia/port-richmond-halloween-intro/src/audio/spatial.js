// Camera-relative placement of world-anchored sounds.
//
// The lead owns the camera. If src/film exports a deterministic pose function (cameraPose(t) / getCameraPose(t)),
// the audio engine uses it (see index.js: resolveExternal). Until then this placeholder path, written from the
// beats in src/film/cues.js, gives every world-anchored source a plausible stereo position over time.
//
// Three.js frame (src/world/frame.js): -Z = NE along Witte, +X = SE (odd) side, +Y up. Yaw = camera rotation.y:
// 0 faces -Z, positive turns toward -X (counter-clockwise seen from above).

import { CUES, PLACES, FILM } from '../film/cues.js';

const H = 1.62;     // standing eye height
const CAR_H = 1.05; // low in car A's back seat, peeking between the front seats
const UNDER_H = 0.15; // pinned under car B, per the brief ("camera ~15 cm off the asphalt")
const SIT_H = 0.5;  // slid down the refuge door, sitting on the floor

// v2 "HIDE" is told in cuts, not one continuous walk: this placeholder gives every world-anchored sound a plausible
// listener position over time, built ONLY from src/film/cues.js (CUES, PLACES) and the section structure in
// docs/DESIGN-v2.md, per the brief ("until shots.js exists, derive it from the section times in cues.js"). It is
// replaced automatically the moment src/film/shots.js exports cameraAt(t) (see resolveExternal in index.js).
// [cue-relative time, x, y, z, yaw] (y defaults to standing H when omitted below the key's own height is used instead)
function placeholderKeys() {
  const C = CUES;
  const P = PLACES;
  return [
    // ---- PROLOGUE: THE DISPLAY (objective, composed shots near the 3607/3605 stoops)
    [0.0, 4.1, H, 5.7, -1.42],                                     // P1 insert: close on the 3607 pumpkin
    [C.shotP2, -2.0, H, 4.2, -1.65],                                // P2 wide: NW sidewalk, across to the SE stoops
    [C.shotP3, 3.6, H, 6.0, -1.55],                                 // P3 medium: the skeleton animatronic (3607)
    [C.shotP4, -4.6, H + 2.9, 2.0, 0.0],                            // P4 high wide: NW 2nd-floor window, looking NE up Witte
    // ---- ACT 1: THE CAR (POV, hiding in car A's back seat; yaw 0 faces -Z, up the block through the windshield)
    [C.shotC1, P.carA.x, CAR_H, P.carA.z, 0.0],
    [C.flicker1, P.carA.x, CAR_H, P.carA.z, 0.03],
    [C.shotC3, P.carA.x, CAR_H, P.carA.z, 0.08],
    [C.windowSmash - 0.05, P.carA.x, CAR_H, P.carA.z, 0.3],         // the smash is beside us on the left (curb side)
    [C.carDoorOpen, P.carA.x - 0.3, 0.9, P.carA.z + 0.45, 0.55],    // scrambling out the street-side rear door
    [C.fallAsphalt, P.carA.x - 1.1, 0.35, P.carA.z + 1.1, 0.9],     // on the wet asphalt, looking back
    // ---- ACT 2: UNDER (POV, pinned under car B)
    [C.shotU1, P.carB.x + 0.5, 0.6, P.carB.z - 0.7, 0.65],          // sliding under from the street side
    [C.underSettle, P.carB.x, UNDER_H, P.carB.z, 0.2],
    [C.faceDown, P.carB.x, UNDER_H, P.carB.z, 0.12],
    [C.lunge2, P.carB.x, UNDER_H, P.carB.z, 0.1],
    [C.kickFree, P.carB.x - 0.3, UNDER_H + 0.1, P.carB.z - 0.5, -0.3],
    [C.rollOut, P.carB.x - 0.7, 0.4, P.carB.z - 1.1, -0.65],        // rolling out the sidewalk side
    [C.standUp, P.carB.x - 0.85, H, P.carB.z - 1.3, -0.8],
    // ---- ACT 3: THE STREET WAKES (POV run for the refuge door)
    [C.shotS1, P.carB.x - 0.6, H, P.carB.z - 0.9, -0.9],
    [C.bruteBlocks, P.carB.x - 0.5, H, P.carB.z - 1.1, -1.05],
    [C.shotS3, -0.2, H, 10.3, -1.25],                               // out into the open street
    [C.nearMiss, 2.4, H, 6.0, -1.6],
    [C.reachStoop, P.refugeDoor.x - 0.7, H, P.refugeDoor.z + 0.35, -1.95],
    // ---- ACT 4: FALSE SAFETY (inside 3609)
    [C.doorEnter, P.refugeDoor.x, H, P.refugeDoor.z, -2.05],
    [C.doorSlam, P.refugeDoor.x + 0.35, H, P.refugeDoor.z - 0.25, -2.65],
    [C.checkKitchen, P.refugeRoom.x - 0.3, H, P.refugeRoom.z + 0.3, -2.3],
    [C.checkStairs, P.refugeRoom.x - 0.4, H, P.refugeRoom.z + 0.1, -2.5],
    [C.relief, P.refugeRoom.x - 0.5, H, P.refugeRoom.z, -2.85],
    [C.slideDown, P.refugeRoom.x - 0.5, SIT_H, P.refugeRoom.z, -2.85],
    [C.lookPhoto, P.refugeRoom.x - 0.45, SIT_H, P.refugeRoom.z - 0.05, -2.6],
    [C.creak3, P.refugeRoom.x - 0.4, SIT_H, P.refugeRoom.z - 0.1, -2.4],
    [C.cutToBlack, P.refugeRoom.x - 0.3, SIT_H - 0.08, P.refugeRoom.z, -2.0],
    // ---- HANDOFF: a new static high wide of Witte St (not the title-loop camera)
    [C.titleFadeIn, 0.9, 1.95, 23.4, 0.0],
    [FILM.duration, 0.9, 1.95, 21.9, 0.0],
  ];
}

export function placeholderCamera() {
  const keys = placeholderKeys();
  const at = (k) => ({ x: k[1], y: k[2], z: k[3], yaw: k[4] });
  return (t) => {
    if (t <= keys[0][0]) return at(keys[0]);
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const a = keys[i - 1];
        const b = keys[i];
        const u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]);
        const s = u * u * (3 - 2 * u);
        return { x: a[1] + (b[1] - a[1]) * s, y: a[2] + (b[2] - a[2]) * s, z: a[3] + (b[3] - a[3]) * s, yaw: a[4] + (b[4] - a[4]) * s };
      }
    }
    return at(keys[keys.length - 1]);
  };
}

// Normalise whatever the lead's camera export returns into { x, y, z, yaw }.
export function adaptCamera(fn) {
  if (typeof fn !== 'function') return null;
  return (t) => {
    const p = fn(t);
    if (!p) return null;
    const pos = p.position || p;
    let yaw = p.yaw;
    if (yaw === undefined && p.quaternion) {
      const q = p.quaternion;
      // forward = q * (0, 0, -1)
      const fx = -2 * (q.x * q.z + q.w * q.y);
      const fz = -(1 - 2 * (q.x * q.x + q.y * q.y));
      yaw = Math.atan2(-fx, -fz);
    }
    if (yaw === undefined && p.rotation) yaw = p.rotation.y;
    if (yaw === undefined && p.lookAt) yaw = Math.atan2(-(p.lookAt.x - pos.x), -(p.lookAt.z - pos.z));
    return { x: pos.x, y: pos.y, z: pos.z, yaw: yaw || 0 };
  };
}

// Camera-relative direction of a world point: pan in [-1, 1] (right positive), distance, and whether it is behind.
export function relate(cam, p) {
  const dx = p.x - cam.x;
  const dz = p.z - cam.z;
  const dy = (p.y ?? cam.y) - cam.y;
  const s = Math.sin(cam.yaw);
  const c = Math.cos(cam.yaw);
  // forward f = (-sin, 0, -cos); right r = (cos, 0, -sin)
  const fwd = -dx * s - dz * c;
  const right = dx * c - dz * s;
  const az = Math.atan2(right, fwd);
  const dist = Math.sqrt(dx * dx + dz * dz + dy * dy);
  return { pan: Math.max(-1, Math.min(1, Math.sin(az))), az, dist, behind: Math.abs(az) > Math.PI / 2 };
}
