// Amiga hard landings can leave the marble dizzy but still physically moving.
// Threshold and speed-to-duration curve are reconstructed, not recovered code.
export function landingStunTicks(speed) {
  if (speed < 6.5) return 0;
  return Math.round(120 * Math.min(2.85, 0.8 + (speed - 6.5) * 0.35));
}
// The original steering path uses (31 - recoveryCounter) / 32, not a
// whole-effect input lock. Its counter rises then falls during recovery.
// Keep the existing measured-duration approximation until original height
// damage and update cadence are calibrated; see LANDING-DIZZINESS.md.
export function landingControlScale(player, tick) {
  const duration = player.stunnedUntil - player.stunTick;
  if (duration <= 0 || tick < player.stunTick || tick >= player.stunnedUntil)
    return 1;
  // Thirty original updates advance one clock unit. Wall-clock rate remains
  // the current PAL approximation. Only the surviving recovery range is used;
  // the original severe-impact shatter path is a separate unresolved mechanic.
  const updates = Math.max(
    2,
    Math.min(62, 2 * Math.round(((duration / 120) * ((30 * 50) / 64)) / 2)),
  );
  const elapsed = Math.floor(((tick - player.stunTick) / duration) * updates);
  const counter = Math.min(elapsed, updates - elapsed);
  return (31 - counter) / 32;
}
export function updateLandingStun(sim, player, { supported, impactSpeed }) {
  if (!sim.course.rules?.landingStun || player.status !== "racing") return;
  if (supported) {
    const duration = landingStunTicks(impactSpeed);
    if (
      player.impactAirTicks >= 12 &&
      !player.impactLaunched &&
      sim.tick >= player.stunnedUntil &&
      duration
    ) {
      player.stunTick = sim.tick;
      player.stunnedUntil = sim.tick + duration;
      sim.events.push({
        type: "stun",
        player: sim.players.indexOf(player),
        speed: impactSpeed,
        duration,
      });
    }
    player.impactAirTicks = 0;
    // The observed Ultimate catapult transfer lands without dizziness. Consume
    // its protection at the next contact, allowing the solver's takeoff contact
    // to persist for two ticks. A later ordinary drop is evaluated normally.
    if (sim.tick - player.springTick > 2) player.impactLaunched = false;
  } else player.impactAirTicks++;
}
