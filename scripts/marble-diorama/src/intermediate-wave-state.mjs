// Original Intermediate terrain states, in original height units. This module
// deliberately accepts animation frame numbers rather than seconds: the native
// update cadence must be calibrated separately from the 120 Hz simulation.
// Corner order matches terrain-geometry's source vertex records (NW, SW, SE, NE).
const heights = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 18, 19, 22, 23, 26, 30,
];
const phases = [
  [1, 2, 1, 0],
  [2, 5, 3, 0],
  [2, 6, 8, 4],
  [1, 9, 12, 7],
  [9, 14, 11, 1],
  [8, 15, 13, 4],
  [5, 14, 16, 9],
  [2, 13, 18, 12],
  [12, 18, 13, 2],
  [10, 17, 15, 6],
  [6, 15, 17, 10],
];

// Each side opening has an entry corner, a complete connection, then an exit
// corner. The end row keeps its outer ledge fixed and opens into absent terrain.
const sideType = (row) =>
  row === 21
    ? 4
    : [4, 5, 6, 16, 17, 18].includes(row)
      ? ((row - 4) % 12) + 1
      : 0;

function corners(row, height) {
  const type = sideType(row);
  const left =
    type === 4
      ? [48, 48, null, height]
      : [48 + height, 48 + height, height, height];
  const center =
    type === 4 ? [height, null, null, height] : Array(4).fill(height);
  const right = [
    [height, height, null, null],
    [height, height, 0, null],
    [height, height, 0, 0],
    [height, height, null, 0],
    [height, null, null, null],
  ][type];
  return [left, center, right];
}

// Reset once, then apply actors in their original update order. A later actor
// overwrites its four rows; combining their heights with max/add is incorrect.
// The returned 22 rows contain left/center/right vertex corner records. Center
// records are shared by the three interior vertices across the lane.
export function intermediateWaveCorners(frames = []) {
  const rows = Array.from({ length: 22 }, (_, row) => corners(row, 0));
  for (const frame of frames) {
    if (!Number.isInteger(frame) || frame < 0 || frame > 255)
      throw Error("Wave frame must be an unsigned byte.");
    const phase = phases[frame <= 6 ? frame : 7 + ((frame - 7) & 3)];
    const first = frame >> 2;
    for (let i = 0; i < 4 && first + i < rows.length; i++)
      rows[first + i] = corners(first + i, heights[phase[i]]);
  }
  return rows;
}

// Age counts completed native actor updates since creation, not display frames.
// Five startup frames each last four updates, then two each last two updates,
// followed by 19 four-frame traveling loops and seven ending frames.
export function intermediateWaveAnimation(age) {
  if (!Number.isInteger(age) || age < 0)
    throw Error("Wave age must be a nonnegative native update count.");
  const frame =
    age <= 20
      ? Math.floor(age / 4)
      : age <= 24
        ? 5 + Math.floor((age - 20) / 2)
        : Math.min(90, 7 + age - 24);
  const writesTerrain =
    age > 0 &&
    age <= 107 &&
    (age <= 20 ? age % 4 === 0 : age <= 24 ? age % 2 === 0 : true);
  return {
    frame,
    writesTerrain,
    releasesNext: age === 47,
    finished: age >= 107,
  };
}

export function createIntermediateWaves() {
  return { ready: true, actors: Array(25).fill(null), writes: [] };
}

// One native actor update. Regions are already-resolved original regions; null
// denotes an inactive player. Wall-clock conversion and region transitions
// belong to the campaign, not this state machine. Existing crests finish when
// players leave the lane; a released launch waits until a player returns.
export function advanceIntermediateWaves(state, regions) {
  const actors = state.actors.slice();
  let ready = state.ready;
  let created = -1;
  if (ready && regions.some((region) => region === 9 || region === 10)) {
    const free = actors.indexOf(null);
    if (free !== -1) {
      actors[free] = 0;
      created = free;
      ready = false;
    }
  }
  const writes = [];
  for (let i = 0; i < actors.length; i++) {
    // A new actor spends this update initializing its script (state 3), which
    // stops on the first animation command. State 2 starts on the next update.
    if (actors[i] === null || i === created) continue;
    const age = actors[i] + 1;
    const animation = intermediateWaveAnimation(age);
    if (animation.writesTerrain) writes.push(animation.frame);
    if (animation.releasesNext) ready = true;
    actors[i] = animation.finished ? null : age;
  }
  return { ready, actors, writes };
}
