// Presentation samples never write back into the deterministic simulation.
export function captureMotion(fighter) {
  return { x: fighter.x, y: fighter.y, animTime: fighter.animTime,
    walkTime: fighter.walkTime, attackTime: fighter.attackTime,
    attacking: fighter.attacking, facing: fighter.facing, grounded: fighter.grounded };
}

export function interpolateMotion(fighter, previous, alpha) {
  if (!previous || Math.hypot(fighter.x - previous.x, fighter.y - previous.y) > 100
    || fighter.cinematicFrame != null) return fighter;
  const t = Math.max(0, Math.min(1, alpha));
  const result = { ...fighter };
  for (const key of ["x", "y", "animTime", "walkTime", "attackTime"]) {
    if (key === "attackTime" && fighter.attacking !== previous.attacking) continue;
    if ((key === "animTime" || key === "walkTime") && fighter[key] < previous[key]) continue;
    if (Number.isFinite(previous[key]) && Number.isFinite(fighter[key])) {
      result[key] = previous[key] + (fighter[key] - previous[key]) * t;
    }
  }
  return result;
}

// Fit a transformed pair of sprite bounds inside the unobscured broadcast area.
// Pull back immediately when needed; the caller eases the release only.
export function fitFrame(bounds, safe) {
  const scale = Math.min(1, (safe.right - safe.left) / Math.max(1, bounds.right - bounds.left),
    (safe.bottom - safe.top) / Math.max(1, bounds.bottom - bounds.top));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  return { scale,
    x: clamp(0, safe.left - bounds.left * scale, safe.right - bounds.right * scale),
    y: clamp(0, safe.top - bounds.top * scale, safe.bottom - bounds.bottom * scale) };
}
