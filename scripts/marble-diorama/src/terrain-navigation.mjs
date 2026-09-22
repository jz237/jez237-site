// Tile coordinates are in the terrain part's local grid, before rotation.
export function terrainTileAt(part, position) {
  const dx = position.x - part.x,
    dz = position.z - part.z;
  const c = Math.cos(part.angle ?? 0),
    s = Math.sin(part.angle ?? 0);
  return {
    x: Math.floor((dx * c + dz * s + part.w / 2) / part.cellSize),
    z: Math.floor((-dx * s + dz * c + part.d / 2) / part.cellSize),
  };
}

// The original checks departure from an inclusive row/column span. Entering
// or jumping entirely across a gate does not trigger it. First match wins.
export function terrainRegionAfter(gates, previous, current, region) {
  if (!previous || (previous.x === current.x && previous.z === current.z))
    return region;
  for (const g of gates) {
    const cross = g.axis === "x" ? "z" : "x";
    const inside = (v) =>
      v[g.axis] === g.constant && v[cross] >= g.start && v[cross] <= g.end;
    if (inside(previous) && !inside(current))
      return current[g.axis] <= g.constant ? g.low : g.high;
  }
  return region;
}

export function validateTerrainGates(gates) {
  if (!Array.isArray(gates) || gates.length > 100)
    throw Error("Invalid terrain region gates.");
  for (const g of gates)
    if (
      !g ||
      !["x", "z"].includes(g.axis) ||
      ![g.constant, g.start, g.end, g.low, g.high].every(
        Number.isSafeInteger,
      ) ||
      ![g.constant, g.start, g.end].every((v) => Math.abs(v) <= 2000) ||
      g.end < g.start ||
      g.low < 0 ||
      g.low > 255 ||
      g.high < 0 ||
      g.high > 255
    )
      throw Error("Invalid terrain region gate.");
}

export function validateTerrainNavigation(course) {
  const n = course.navigation;
  if (!n) return;
  const part = course.parts.find((p) => p.id === n.partId);
  if (
    n.type !== "terrain-gates" ||
    part?.kind !== "terrain" ||
    !Array.isArray(n.initialRegions) ||
    n.initialRegions.length !== 2 ||
    !n.initialRegions.every((r) => Number.isInteger(r) && r >= 0 && r < 255)
  )
    throw Error("Invalid terrain navigation.");
  validateTerrainGates(n.gates);
}

export function createTerrainNavigation(course, player, position) {
  if (!course.navigation) return null;
  const part = course.parts.find((p) => p.id === course.navigation.partId);
  return {
    region: course.navigation.initialRegions[player],
    tile: terrainTileAt(part, position),
  };
}

export function advanceTerrainNavigation(course, state, position) {
  if (!state) return false;
  const part = course.parts.find((p) => p.id === course.navigation.partId);
  const tile = terrainTileAt(part, position);
  state.region = terrainRegionAfter(
    course.navigation.gates,
    state.tile,
    tile,
    state.region,
  );
  state.tile = tile;
  return state.region === 255;
}
