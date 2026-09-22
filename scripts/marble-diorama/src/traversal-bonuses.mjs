import { tubeCurve, tubeRadiusAt, tubeGeometry } from "./surface-geometry.mjs";

// These checkpoints use the exact center curve that builds the tube's shared
// visible/collision rings. They do not add forces or alter its physical surface.
export function traversalPaths(course) {
  return course.parts
    .filter((p) => p.kind === "tube" && (p.traversalBonus || p.flowSpeed))
    .flatMap((p) =>
      (p.fork ? [0, 1] : [0]).map((branch) => {
        const curves = p.fork
          ? [
              tubeCurve({ path: p.path.slice(0, p.fork.at + 1) }),
              tubeCurve({
                path: branch ? p.fork.path : p.path.slice(p.fork.at),
              }),
            ]
          : [tubeCurve(p)];
        const length = curves.reduce((n, c) => n + c.getLength(), 0);
        const samples = curves.flatMap((curve, i) => {
          const count = Math.max(24, Math.ceil(curve.getLength() * 8));
          return Array.from({ length: count + 1 }, (_, j) =>
            curve.getPointAt(j / count),
          ).slice(i ? 1 : 0);
        });
        const c = Math.cos(p.angle ?? 0),
          s = Math.sin(p.angle ?? 0);
        const points = samples.map((v) => {
          return {
            x: p.x + v.x * c - v.z * s,
            y: p.y + v.y,
            z: p.z + v.x * s + v.z * c,
          };
        });
        if (p.fork?.merge) points.reverse();
        const end = points.at(-1),
          before = points.at(-2);
        const n = Math.hypot(
          end.x - before.x,
          end.y - before.y,
          end.z - before.z,
        );
        return {
          id: p.id,
          branch,
          fork: !!p.fork,
          merge: !!p.fork?.merge,
          reverseFlow: !!p.fork?.merge,
          chamber: p.fork ? tubeGeometry(p).chamber : null,
          junctionProgress: p.fork
            ? p.fork.merge
              ? length - curves[0].getLength()
              : curves[0].getLength()
            : null,
          exitRoute: p.fork?.exitRoutes?.[branch],
          cumulative: points.reduce((a, v, i) => {
            a.push(
              i
                ? a[i - 1] +
                    Math.hypot(
                      v.x - points[i - 1].x,
                      v.y - points[i - 1].y,
                      v.z - points[i - 1].z,
                    )
                : 0,
            );
            return a;
          }, []),
          score: p.traversalBonus,
          flare: p.flare,
          flowSpeed: p.flowSpeed,
          flowExitSpeed: p.flowExitSpeed,
          nativeTransfer: p.nativeTransfer === true,
          nativePipe: p.nativePipe,
          outletProfile: p.fork?.outletProfile,
          radius: p.radius ?? 1.4,
          length,
          points,
          bounds: Object.fromEntries(
            ["x", "y", "z"].map((axis) => [
              axis,
              [
                Math.min(...points.map((v) => v[axis])) -
                  Math.max(
                    p.radius ?? 1.4,
                    Math.hypot(
                      p.fork?.outletProfile?.width ?? 0,
                      p.fork?.outletProfile?.height ?? 0,
                    ) / 2,
                  ),
                Math.max(...points.map((v) => v[axis])) +
                  Math.max(
                    p.radius ?? 1.4,
                    Math.hypot(
                      p.fork?.outletProfile?.width ?? 0,
                      p.fork?.outletProfile?.height ?? 0,
                    ) / 2,
                  ),
              ],
            ]),
          ),
          exit: {
            x: (end.x - before.x) / n,
            y: (end.y - before.y) / n,
            z: (end.z - before.z) / n,
          },
        };
      }),
    );
}

export function tubePosition(path, position) {
  let best = { distance: Infinity, progress: 0 };
  for (let i = 1; i < path.points.length; i++) {
    const a = path.points[i - 1],
      b = path.points[i];
    const dx = b.x - a.x,
      dy = b.y - a.y,
      dz = b.z - a.z;
    const u = Math.max(
      0,
      Math.min(
        1,
        ((position.x - a.x) * dx +
          (position.y - a.y) * dy +
          (position.z - a.z) * dz) /
          (dx * dx + dy * dy + dz * dz),
      ),
    );
    const distance = Math.hypot(
      position.x - a.x - u * dx,
      position.y - a.y - u * dy,
      position.z - a.z - u * dz,
    );
    if (distance < best.distance)
      best = {
        distance,
        progress: path.cumulative
          ? path.cumulative[i - 1] +
            u * (path.cumulative[i] - path.cumulative[i - 1])
          : ((i - 1 + u) / (path.points.length - 1)) * path.length,
        center: { x: a.x + u * dx, y: a.y + u * dy, z: a.z + u * dz },
        tangent: {
          x: dx / Math.hypot(dx, dy, dz),
          y: dy / Math.hypot(dx, dy, dz),
          z: dz / Math.hypot(dx, dy, dz),
        },
      };
  }
  return best;
}

export function updateTraversalBonuses(paths, player, position, radius) {
  const events = [];
  player.traversals ??= {};
  for (const path of paths) {
    if (!path.score || player.traversalClaims?.includes(path.id)) continue;
    // Native selection happens above the inlet. Both paths share precisely
    // the same lower leg, so track that leg once until the outlet is chosen.
    const branch =
      player.transferRoute?.branch ?? (path.nativeTransfer ? 0 : null);
    if (path.fork && branch !== path.branch) continue;
    if (
      ["x", "y", "z"].some(
        (axis) =>
          position[axis] < path.bounds[axis][0] ||
          position[axis] > path.bounds[axis][1],
      )
    ) {
      delete player.traversals[path.id];
      continue;
    }
    const q = tubePosition(path, position),
      inside =
        inTransferChamber(path, position) ||
        q.distance <=
          tubeRadiusAt(path, q.progress, path.length) - radius + 0.12;
    const state = Object.hasOwn(player.traversals, path.id)
      ? player.traversals[path.id]
      : null;
    if (!state) {
      if (inside && q.progress <= Math.min(1.5, path.length * 0.15))
        player.traversals = {
          ...player.traversals,
          [path.id]: { progress: q.progress },
        };
      continue;
    }
    // Reject a skipped middle, a backwards retreat out of the entrance, and
    // any departure through the side. Falling clears incomplete traversals.
    if (!inside || Math.abs(q.progress - state.progress) > 1) {
      delete player.traversals[path.id];
      continue;
    }
    state.progress = q.progress;
    const end = path.points.at(-1),
      t = path.exit;
    const beyond =
      (position.x - end.x) * t.x +
      (position.y - end.y) * t.y +
      (position.z - end.z) * t.z;
    if (beyond >= 0 && q.progress >= path.length - 0.25) {
      (player.traversalClaims ??= []).push(path.id);
      delete player.traversals[path.id];
      player.score += path.score;
      events.push({
        type: "traversal-bonus",
        part: path.id,
        score: path.score,
      });
    }
  }
  return events;
}

export function inTransferChamber(path, position) {
  return (
    !!path.chamber?.length &&
    path.chamber.every(
      ({ normal: n, constant }) =>
        n.x * position.x + n.y * position.y + n.z * position.z <=
        constant + 1e-6,
    )
  );
}
