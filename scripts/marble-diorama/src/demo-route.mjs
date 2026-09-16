// Steering hints describe the safe corridor around an authored waypoint.
// They never change the playable mesh, marble radius, clock or player controls.
export function roundDemoCorners(
  route,
  { radius = 1, from = 0, to = route.length - 1 } = {},
) {
  return route.map((point, index) => {
    if (index < from || index > to || point.stop || point.waitFor) return point;
    return {
      ...point,
      flow: true,
      ...(!point.collect && (point.radius ?? 0.75) > 0.6
        ? { radius: Math.max(radius, point.radius ?? 0.75) }
        : {}),
    };
  });
}
