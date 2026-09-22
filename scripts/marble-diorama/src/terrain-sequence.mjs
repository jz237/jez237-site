import { terrainGeometry, validateTerrain } from "./terrain-geometry.mjs";
import {
  terrainTileAt,
  terrainRegionAfter,
  validateTerrainGates,
} from "./terrain-navigation.mjs";

export function terrainFramePart(part, frame) {
  const overrides = new Map(
    part.animation.frames[frame].map((c) => [`${c[0]},${c[1]}`, c]),
  );
  return {
    ...part,
    animation: undefined,
    cells: part.cells.map((c) => overrides.get(`${c[0]},${c[1]}`) ?? c),
  };
}

export function validateTerrainSequence(part, finite) {
  const a = part.animation;
  if (
    part.kind !== "terrain" ||
    !finite(a.secondsPerFrame) ||
    a.secondsPerFrame < 0.05 ||
    a.secondsPerFrame > 30 ||
    !Array.isArray(a.frames) ||
    a.frames.length < 2 ||
    a.frames.length > 8 ||
    !Array.isArray(a.activationRegions) ||
    a.activationRegions.length !== 2 ||
    !a.activationRegions.every(
      (r) => Number.isInteger(r) && r >= 0 && r < 255,
    ) ||
    a.activationRegions[0] > a.activationRegions[1] ||
    !Array.isArray(a.initialRegions) ||
    a.initialRegions.length !== 2 ||
    !a.initialRegions.every((r) => Number.isInteger(r) && r >= 0 && r < 255)
  )
    throw Error("Invalid terrain sequence.");
  validateTerrainGates(a.gates);
  const keys = new Set(part.cells.map((c) => `${c[0]},${c[1]}`));
  for (let i = 0; i < a.frames.length; i++) {
    const cells = a.frames[i];
    if (
      !Array.isArray(cells) ||
      !cells.length ||
      cells.length > part.cells.length
    )
      throw Error("Invalid terrain sequence frame.");
    validateTerrain({ ...part, animation: undefined, cells }, finite);
    if (cells.some((c) => !keys.has(`${c[0]},${c[1]}`)))
      throw Error("Terrain sequence frames must replace existing cells.");
  }
  const first = terrainFramePart(part, 0);
  if (first.cells.some((c, i) => c.some((v, j) => v !== part.cells[i][j])))
    throw Error("Terrain sequence must start with its first frame.");
}

// Each state is a complete welded mesh. Swapping one collider keeps seams
// between changing and fixed cells out of the marble's contact surface.
export function compileTerrainSequence(part) {
  const frames = part.animation.frames.map((_, i) =>
    terrainGeometry(terrainFramePart(part, i)),
  );
  return {
    part: {
      ...part,
      sourcePartId: part.id,
      motion: { axis: "terrain-sequence" },
    },
    frames,
    ...frames[0],
  };
}

export function createTerrainSequence(part, players) {
  return {
    active: false,
    startedAt: null,
    frame: 0,
    regions: part.animation.initialRegions.slice(0, players),
    tiles: Array(players).fill(null),
  };
}

export function advanceTerrainSequence(part, state, players, time) {
  const a = part.animation;
  const eligible = players.map((player, i) => {
    const tile = terrainTileAt(part, player.position);
    state.regions[i] =
      player.navigationPartId === part.id
        ? player.region
        : terrainRegionAfter(a.gates, state.tiles[i], tile, state.regions[i]);
    state.tiles[i] = tile;
    return (
      player.active &&
      state.regions[i] >= a.activationRegions[0] &&
      state.regions[i] <= a.activationRegions[1]
    );
  });
  const active = eligible.some(Boolean);
  if (active) {
    if (!state.active) state.startedAt = time;
    state.frame =
      Math.floor((time - state.startedAt + 1e-9) / a.secondsPerFrame) %
      a.frames.length;
  }
  state.active = active;
  return { frame: state.frame };
}
