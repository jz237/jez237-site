// A completed catapult flight pays on its first supported landing, not at
// takeoff or while passing above the destination. Original repeat policy is
// unknown; each player can claim each launcher once per race.
export function updateLaunchBonus(sim, player, contact, radius) {
  const pending = player.launchBonusPending;
  if (!pending || player.status !== "racing") return null;
  if (!contact.supported) {
    pending.airborne = true;
    return null;
  }
  if (!pending.airborne) return null;
  player.launchBonusPending = null;
  const launcher = sim.course.parts.find((p) => p.id === pending.part);
  const award = launcher?.launchBonus;
  if (!award || player.launchClaims?.includes(launcher.id)) return null;
  const target = sim.course.parts.find((p) => p.id === award.target);
  const pos = sim.body(player).translation();
  const c = Math.cos(target.angle ?? 0),
    s = Math.sin(target.angle ?? 0);
  const dx = pos.x - target.x,
    dz = pos.z - target.z;
  if (
    Math.abs(dx * c + dz * s) > target.w / 2 ||
    Math.abs(-dx * s + dz * c) > target.d / 2 ||
    Math.abs(pos.y - radius - target.y) > 0.02
  )
    return null;
  (player.launchClaims ??= []).push(launcher.id);
  player.score += award.score;
  return {
    type: "landing-bonus",
    target: target.id,
    launcher: launcher.id,
    score: award.score,
  };
}
