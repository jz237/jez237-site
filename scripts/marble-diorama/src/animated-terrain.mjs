import {
  terrainTileAt,
  terrainRegionAfter,
  validateTerrainGates,
} from "./terrain-navigation.mjs";
export { terrainRegionAfter } from "./terrain-navigation.mjs";
import {
  createIntermediateWaves,
  advanceIntermediateWaves,
  intermediateWaveCorners,
} from "./intermediate-wave-state.mjs";
import { WAVE_INDICES, WAVE_ROLES } from "./wave.mjs";
export {
  WAVE_INDICES as TERRAIN_QUAD_INDICES,
  WAVE_ROLES as TERRAIN_QUAD_ROLES,
};

export const TERRAIN_TRIANGLE_INDICES = new Uint32Array([
  0, 1, 2, 3, 5, 4, 0, 3, 4, 0, 4, 1, 1, 4, 5, 1, 5, 2, 2, 5, 3, 2, 3, 0,
]);
export const TERRAIN_TRIANGLE_ROLES = ["top", ...Array(7).fill("side")];
const rest = intermediateWaveCorners();
const references = (p, column, row) => {
  const x = column - p.animation.column,
    z = row - p.animation.row;
  return x >= 0 && x <= 4 && z >= 0 && z <= 21
    ? [z, x === 0 ? 0 : x === 4 ? 2 : 1]
    : null;
};
function cellPoints(p, cell) {
  const [column, row, ...h] = cell;
  return [
    [0, 0, 2],
    [1, 0, 1],
    [0, 1, 3],
    [1, 1, 0],
  ].map(([dx, dz, corner], i) => {
    const ref = references(p, column + dx, row + dz);
    return {
      x: -p.w / 2 + (column + dx) * p.cellSize,
      y: h[i],
      z: -p.d / 2 + (row + dz) * p.cellSize,
      ref: ref ? [...ref, corner] : null,
    };
  });
}

export function validateAnimatedTerrain(p, finite) {
  const a = p.animation;
  if (!a) return;
  if (
    p.kind !== "terrain" ||
    a.type !== "intermediate-wave" ||
    ![a.column, a.row].every(Number.isInteger) ||
    ![a.base, a.scale, a.rate].every(finite) ||
    a.scale <= 0 ||
    a.scale > 10 ||
    a.base <= -(p.h ?? 0.5) ||
    a.base + 78 * a.scale > 2000 ||
    a.rate < 1 ||
    a.rate > 60 ||
    !Array.isArray(a.gates) ||
    a.gates.length > 100 ||
    !Array.isArray(a.initialRegions) ||
    a.initialRegions.length !== 2 ||
    !a.initialRegions.every((r) => Number.isInteger(r) && r >= 0 && r <= 255)
  )
    throw Error("Invalid terrain animation.");
  validateTerrainGates(a.gates);
  let affected = 0;
  for (const cell of p.cells) {
    const points = cellPoints(p, cell);
    if (points.some((v) => v.ref)) affected++;
    for (const v of points)
      if (v.ref) {
        const [r, g, c] = v.ref,
          height = rest[r][g][c];
        if (
          (height === null) !== (v.y === null) ||
          (height !== null &&
            Math.abs(v.y - (a.base + height * a.scale)) > 1e-6)
        )
          throw Error(
            "Animated terrain cells must contain their resting corner heights.",
          );
      }
  }
  if (!affected) throw Error("Terrain animation has no affected cells.");
}

export function expandAnimatedTerrain(parts) {
  return parts.flatMap((p) => {
    if (!p.animation) return [p];
    const moving = [],
      consumed = new Set();
    const byCell = new Map(
      p.cells.map((cell) => [`${cell[0]},${cell[1]}`, cell]),
    );
    const emit = (cell, points, suffix) =>
      moving.push({
        id: `${p.id}:tile:${cell[0]},${cell[1]}:${suffix}`,
        kind: "moving",
        x: p.x,
        y: p.y,
        z: p.z,
        w: p.cellSize,
        d: p.cellSize,
        h: p.h,
        material: p.material,
        sourcePartId: p.id,
        terrainAngle: p.angle ?? 0,
        terrainTriangle: points,
        terrainAnimation: p.animation,
        motion: { axis: "terrain", amplitude: 0, period: 1 },
      });
    for (const cell of [...p.cells].sort(
      (a, b) => a[1] - b[1] || a[0] - b[0],
    )) {
      if (consumed.has(`${cell[0]},${cell[1]}`)) continue;
      const points = cellPoints(p, cell);
      if (!points.some((v) => v.ref)) {
        continue;
      }
      const a = p.animation;
      if (
        cell[0] >= a.column &&
        cell[0] < a.column + 4 &&
        cell[1] >= a.row &&
        cell[1] < a.row + 21 &&
        points.every((v) => v.y !== null)
      ) {
        let last = cell;
        for (let column = cell[0] + 1; column < a.column + 4; column++) {
          const next = byCell.get(`${column},${cell[1]}`);
          if (!next || next.slice(2).some((h) => h === null)) break;
          last = next;
          consumed.add(`${column},${cell[1]}`);
        }
        const end = cellPoints(p, last);
        emit(cell, [points[0], points[2], end[3], end[1]], "lane");
        continue;
      }
      for (const [half, indices] of [
        [0, [0, 2, 3]],
        [1, [0, 3, 1]],
      ]) {
        const triangle = indices.map((i) => points[i]);
        if (triangle.some((v) => v.y === null)) continue;
        emit(cell, triangle, half);
      }
    }
    return [
      // Every native offset is nonnegative. The welded resting board remains
      // the solid foundation; only faces raised above it need moving colliders.
      { ...p, animation: undefined },
      ...moving,
    ];
  });
}

const rotate = (v, q) => {
  const tx = 2 * (q.y * v[2] - q.z * v[1]),
    ty = 2 * (q.z * v[0] - q.x * v[2]),
    tz = 2 * (q.x * v[1] - q.y * v[0]);
  return [
    v[0] + q.w * tx + q.y * tz - q.z * ty,
    v[1] + q.w * ty + q.z * tx - q.x * tz,
    v[2] + q.w * tz + q.x * ty - q.y * tx,
  ];
};

// Each original top triangle remains planar. A kinematic body's centroid and
// normal carry the surface velocity; its convex prism deforms to the same
// three corners. The underside remains on the fixed board footprint.
export function terrainTrianglePose(p, rows = rest, previous) {
  const heights = p.terrainTriangle.map((v) =>
    v.ref
      ? p.terrainAnimation.base +
        rows[v.ref[0]][v.ref[1]][v.ref[2]] * p.terrainAnimation.scale
      : v.y,
  );
  if (previous?.terrainHeights?.every((h, i) => h === heights[i]))
    return previous;
  return poseFromHeights(p, heights);
}

export function interpolateTerrainTriangle(p, previous, current, alpha) {
  if (previous === current) return current;
  return poseFromHeights(
    p,
    current.terrainHeights.map(
      (h, i) =>
        previous.terrainHeights[i] + (h - previous.terrainHeights[i]) * alpha,
    ),
  );
}

function poseFromHeights(p, heights) {
  const cs = Math.cos(p.terrainAngle),
    sn = Math.sin(p.terrainAngle);
  const points = p.terrainTriangle.map((v, i) => {
    const h = heights[i];
    return [p.x + v.x * cs - v.z * sn, p.y + h, p.z + v.x * sn + v.z * cs];
  });
  const center = [0, 1, 2].map(
    (i) => points.reduce((n, v) => n + v[i], 0) / points.length,
  );
  const a = points[1].map((v, i) => v - points[0][i]),
    b = points[2].map((v, i) => v - points[0][i]);
  const normal = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const length = Math.hypot(...normal);
  for (let i = 0; i < 3; i++) normal[i] /= length;
  const qlength = Math.hypot(normal[2], -normal[0], 1 + normal[1]);
  const rotation = {
    x: normal[2] / qlength,
    y: 0,
    z: -normal[0] / qlength,
    w: (1 + normal[1]) / qlength,
  };
  const inverse = { x: -rotation.x, y: 0, z: -rotation.z, w: rotation.w };
  const all = [
    ...points,
    ...points.map((v) => [v[0], p.y - (p.h ?? 0.5), v[2]]),
  ];
  const vertices = new Float32Array(
    all.flatMap((v) =>
      rotate(
        v.map((n, i) => n - center[i]),
        inverse,
      ),
    ),
  );
  return {
    position: { x: center[0], y: center[1], z: center[2] },
    terrainHeights: heights,
    rotation,
    vertices,
  };
}

export function createTerrainAnimations(course, players) {
  return Object.fromEntries(
    course.parts
      .filter((p) => p.animation)
      .map((p) => [
        p.id,
        {
          nativeTick: 0,
          state: createIntermediateWaves(),
          previous: intermediateWaveCorners(),
          current: intermediateWaveCorners(),
          regions: p.animation.initialRegions.slice(0, players),
          tiles: Array(players).fill(null),
          alpha: 0,
        },
      ]),
  );
}
export function advanceTerrainAnimations(course, controllers, players, time) {
  const poses = {};
  for (const part of course.parts) {
    if (!part.animation) continue;
    const controller = controllers[part.id];
    const eligible = players.map((player, i) => {
      const tile = terrainTileAt(part, player.position);
      controller.regions[i] =
        player.navigationPartId === part.id
          ? player.region
          : terrainRegionAfter(
              part.animation.gates,
              controller.tiles[i],
              tile,
              controller.regions[i],
            );
      controller.tiles[i] = tile;
      return player.active ? controller.regions[i] : null;
    });
    const clock = time * part.animation.rate,
      target = Math.floor(clock + 1e-9);
    while (controller.nativeTick < target) {
      controller.previous = controller.current;
      controller.state = advanceIntermediateWaves(controller.state, eligible);
      controller.current = intermediateWaveCorners(controller.state.writes);
      controller.nativeTick++;
    }
    controller.alpha = Math.max(0, Math.min(1, clock - target));
    poses[part.id] = controller.current.map((groups, r) =>
      groups.map((corners, g) =>
        corners.map((h, c) =>
          h === null
            ? null
            : controller.previous[r][g][c] +
              (h - controller.previous[r][g][c]) * controller.alpha,
        ),
      ),
    );
  }
  return poses;
}
