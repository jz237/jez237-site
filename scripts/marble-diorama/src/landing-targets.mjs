// Targets inherit their floor's transform. The same footprint is painted and
// scored, including after an editor move/rotation or JSON round trip.
export function landingTargets(course) {
  return (course.markings ?? [])
    .filter((mark) => mark.kind === "landing-target")
    .map((mark) => {
      const part = course.parts.find((p) => p.id === mark.part);
      const angle = part.angle ?? 0,
        c = Math.cos(angle),
        s = Math.sin(angle);
      const ox = mark.offset?.x ?? 0,
        oz = mark.offset?.z ?? 0;
      return {
        ...mark,
        x: part.x + ox * c - oz * s,
        y: part.y,
        z: part.z + ox * s + oz * c,
        angle,
        w: mark.width ?? part.w - 0.6,
        d: mark.depth ?? part.d - 0.6,
      };
    });
}

export function landingScore(target, position) {
  const c = Math.cos(target.angle),
    s = Math.sin(target.angle);
  const x = (position.x - target.x) * c + (position.z - target.z) * s;
  const z = -(position.x - target.x) * s + (position.z - target.z) * c;
  if (Math.abs(x) > target.w / 2 || Math.abs(z) > target.d / 2) return 0;
  const u = x / target.w + 0.5,
    v = z / target.d + 0.5;
  const [a, b, c0, d] = target.values;
  // The reference shows an intermediate 4500 award, not only integer labels.
  // Bilinear interpolation/100-point rounding remain a reconstruction.
  return (
    Math.round(
      ((a * (1 - u) + b * u) * (1 - v) + (c0 * (1 - u) + d * u) * v) * 10,
    ) * 100
  );
}

export function updateLandingTargets(targets, player, position, radius) {
  if (!player.grounded) {
    player.landingAirTicks = (player.landingAirTicks ?? 0) + 1;
    return null;
  }
  // The steering ground probe anticipates contact by 0.09 units. Keep the
  // airborne state until the marble actually settles onto the painted floor.
  if ((player.landingAirTicks ?? 0) >= 6) {
    for (const target of targets) {
      if (
        player.landingClaims?.includes(target.id) ||
        position.y - radius - target.y > 0.015 ||
        position.y - radius - target.y < -0.1
      )
        continue;
      const score = landingScore(target, position);
      if (!score) continue;
      (player.landingClaims ??= []).push(target.id);
      player.landingAirTicks = 0;
      player.score += score;
      return { type: "landing-bonus", target: target.id, score };
    }
  }
  return null;
}
