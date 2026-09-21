import { tubePosition } from "./traversal-bonuses.mjs";
import { tubeRadiusAt } from "./surface-geometry.mjs";

// A bounded airflow acts on the physical sphere. It never changes its position,
// velocity, gravity setting or visibility directly; the real bore constrains it.
export function transferForce(paths, position, velocity, radius) {
  for (const path of paths) {
    if (
      !path.flowSpeed ||
      ["x", "y", "z"].some(
        (axis) =>
          position[axis] < path.bounds[axis][0] ||
          position[axis] > path.bounds[axis][1],
      )
    )
      continue;
    const q = tubePosition(path, position);
    if (
      q.distance >
      tubeRadiusAt(path, q.progress, path.length) - radius + 0.12
    )
      continue;
    const end = path.points.at(-1);
    if (
      Object.keys(path.exit).reduce(
        (v, k) => v + (position[k] - end[k]) * path.exit[k],
        0,
      ) > 0.05
    )
      continue;
    const along = Object.keys(q.tangent).reduce(
      (v, k) => v + velocity[k] * q.tangent[k],
      0,
    );
    const offset = Object.keys(q.tangent).reduce(
      (v, k) => v + (q.center[k] - position[k]) * q.tangent[k],
      0,
    );
    const speed =
      (path.flowExitSpeed ?? path.flowSpeed) +
      (path.flowSpeed - (path.flowExitSpeed ?? path.flowSpeed)) *
        Math.min(1, (path.length - q.progress) / 3);
    const force = Object.fromEntries(
      ["x", "y", "z"].map((k) => [
        k,
        q.tangent[k] * (speed - along) * 8 +
          (q.center[k] - position[k] - offset * q.tangent[k]) * 12 -
          (velocity[k] - along * q.tangent[k]) * 4 +
          (k === "y" ? 9.81 : 0),
      ]),
    );
    const scale = 25 / Math.max(25, Math.hypot(force.x, force.y, force.z));
    return {
      id: path.id,
      acceleration: {
        x: force.x * scale,
        y: force.y * scale,
        z: force.z * scale,
      },
    };
  }
  return null;
}
