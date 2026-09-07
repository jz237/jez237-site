// Presentation samples never write back into the deterministic simulation.
export function captureMotion(fighter) {
  return { x: fighter.x, y: fighter.y, animTime: fighter.animTime,
    walkTime: fighter.walkTime, strideTime: fighter.strideTime, vx: fighter.vx, vy: fighter.vy, attackTime: fighter.attackTime,
    attacking: fighter.attacking, facing: fighter.facing, grounded: fighter.grounded };
}

export function interpolateMotion(fighter, previous, alpha) {
  if (!previous || Math.hypot(fighter.x - previous.x, fighter.y - previous.y) > 100
    || fighter.cinematicFrame != null) return fighter;
  const t = Math.max(0, Math.min(1, alpha));
  const result = { ...fighter };
  for (const key of ["x", "y", "vx", "vy", "animTime", "walkTime", "strideTime", "attackTime"]) {
    if (key === "attackTime" && fighter.attacking !== previous.attacking) continue;
    if ((key === "animTime" || key === "walkTime") && fighter[key] < previous[key]) continue;
    if (Number.isFinite(previous[key]) && Number.isFinite(fighter[key])) {
      result[key] = previous[key] + (fighter[key] - previous[key]) * t;
    }
  }
  return result;
}

// A fixed wide shot: independent of pose, spacing, HUD height or frame time.
// Full-size stage coordinates are 1280x720 with the floor at y=600.
export function fixedDemoFrame() {
  return { scale: 0.72, x: 1280 * (1 - 0.72) / 2, y: 560 - 600 * 0.72 };
}

// Blend feet-anchored lean, recoil and landing compression between simulation ticks.
// Combat poses and hit timing stay discrete.
export function interpolateBodyMotion(current, previous, alpha) {
  if (!previous) return current;
  const t = Math.max(0, Math.min(1, alpha));
  const result = { ...current };
  for (const key of ["rotation", "flipRotation", "scaleX", "scaleY", "offsetX", "offsetY"]) {
    if (Number.isFinite(previous[key]) && Number.isFinite(current[key])) {
      // A completed flip must not interpolate backwards through a full turn.
      if (key === "flipRotation" && Math.abs(current[key] - previous[key]) > Math.PI) continue;
      result[key] = previous[key] + (current[key] - previous[key]) * t;
    }
  }
  return result;
}
