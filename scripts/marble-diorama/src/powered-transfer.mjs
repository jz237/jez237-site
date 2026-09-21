import { tubePosition, inTransferChamber } from "./traversal-bonuses.mjs";
import { tubeRadiusAt } from "./surface-geometry.mjs";

// A bounded airflow acts on the physical sphere. It never changes its position,
// velocity, gravity setting or visibility directly; the real bore constrains it.
export function transferForce(
  paths,
  position,
  velocity,
  radius,
  choice = null,
) {
  for (const path of paths) {
    if (path.fork && choice?.id === path.id && path.branch !== choice.branch)
      continue;
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
      !inTransferChamber(path, position) &&
      q.distance > tubeRadiusAt(path, q.progress, path.length) - radius + 0.12
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
    const speed = Math.min(
      path.fork
        ? 3.5 +
            Math.min(1, Math.abs(q.progress - path.junctionProgress) / 3) *
              (path.flowSpeed - 3.5)
        : path.flowSpeed,
      (path.flowExitSpeed ?? path.flowSpeed) +
        (path.flowSpeed - (path.flowExitSpeed ?? path.flowSpeed)) *
          Math.min(1, (path.length - q.progress) / 3),
    );
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
      branch: path.branch,
      exitRoute: path.exitRoute,
      acceleration: {
        x: force.x * scale,
        y: force.y * scale,
        z: force.z * scale,
      },
    };
  }
  return null;
}

// Seeded once on entry and retained through the passage. The arcade code's
// two-way choice and occupied-exit fallback inform this reconstruction; exact
// Amiga selection/clearance is still unverified.
export function chooseTransfer(paths, position, radius, seed, occupied = []) {
  const entry = paths.find(
    (p) =>
      p.fork &&
      p.flowSpeed &&
      (() => {
        const q = tubePosition(p, position);
        return (
          q.progress < 1.5 &&
          q.distance < tubeRadiusAt(p, q.progress, p.length) - radius + 0.12
        );
      })(),
  );
  if (!entry) return null;
  let n = seed | 0;
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  let branch = (n ^ (n >>> 16)) & 1;
  const exits = paths.filter((p) => p.id === entry.id);
  const blocked = (p) =>
    occupied.some(
      (v) =>
        Math.hypot(
          v.x - p.points.at(-1).x,
          v.y - p.points.at(-1).y,
          v.z - p.points.at(-1).z,
        ) < 2.2,
    );
  if (blocked(exits[branch]) && !blocked(exits[1 - branch]))
    branch = 1 - branch;
  return { id: entry.id, branch, exitRoute: exits[branch].exitRoute };
}
