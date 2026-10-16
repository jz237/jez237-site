// Shared world frame for the Port Richmond Halloween intro.
//
// The game (PORT RICHMOND, UE5) stores world data in LOCAL metres: x east, y north, z up
// (data/derived/world/placements.json; UE units = x * 100, -y * 100). We re-centre on the
// 3600 block of Witte St and rotate so that Witte runs along the Three.js Z axis:
//
//   -Z  = north-east along Witte, toward E Pacific St and the terminal wall
//   +Z  = south-west, toward E Venango St (the title loop's starting corner)
//   +X  = the south-east (odd) side: 3601..3619 Witte, Bauder Graphics (3613-15)
//   -X  = the north-west (even) side: 3602..3622 Witte, the one-side parking lane
//   +Y  = up (metres)
//
// The mapping is a pure rotation + translation (no mirror), so handedness is preserved.

export const GAME_ORIGIN = { x: 240.0, y: 1422.0, z: 6.6 }; // street centre near 3609/3610 Witte, ground level
export const WITTE_DIR = { x: 0.8254, y: 0.5645 }; // game-frame unit vector toward the terminal wall (NE)
export const WITTE_RIGHT = { x: 0.5645, y: -0.8254 }; // game-frame unit vector toward the SE (odd) side

// game local metres -> Three.js metres
export function gameToThree(gx, gy, gz = GAME_ORIGIN.z) {
  const dx = gx - GAME_ORIGIN.x;
  const dy = gy - GAME_ORIGIN.y;
  return {
    x: dx * WITTE_RIGHT.x + dy * WITTE_RIGHT.y,
    y: gz - GAME_ORIGIN.z,
    z: -(dx * WITTE_DIR.x + dy * WITTE_DIR.y),
  };
}

// Three.js metres -> game local metres
export function threeToGame(x, y, z) {
  const along = -z;
  return {
    x: GAME_ORIGIN.x + x * WITTE_RIGHT.x + along * WITTE_DIR.x,
    y: GAME_ORIGIN.y + x * WITTE_RIGHT.y + along * WITTE_DIR.y,
    z: y + GAME_ORIGIN.z,
  };
}

// A game-frame yaw (degrees, counter-clockwise from +x east, i.e. atan2(y, x)) -> Three.js rotation.y (radians).
// Three.js rotation.y = 0 faces -Z; positive rotates toward -X (counter-clockwise seen from above).
export function gameYawDegToThreeRotY(yawDeg) {
  const witteYaw = Math.atan2(WITTE_DIR.y, WITTE_DIR.x); // game yaw of the -Z axis
  return (yawDeg * Math.PI) / 180 - witteYaw;
}

// Reference measurements on this block (Three.js frame):
//   SE facade line x ~= +5.0 ; NW facade line x ~= -5.4 ; building-to-building ~10.4 m.
//   3601 Witte (Venango corner) z ~= +21.6 ; 3619 Witte z ~= -25.2 ; Bauder Graphics frontage z in [-17.1, -6.2].
//   Game player start / title-loop start: game (219.28, 1413.19, 7.44), facing the terminal wall -> Three ~ (-4.4, 0.84, +22.1).
