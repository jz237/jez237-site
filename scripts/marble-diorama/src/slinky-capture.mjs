// The source's 0x1b520 enters capture; 0x1b5f2 records the loss only when the
// slinky's 30-frame sequence ends. Reassembly uses the current recovery window
// until the original player reformation program has been calibrated separately.
export const SLINKY_REFORM_TICKS = 90;

export function finishSlinkyCapture(sim, player) {
  const capture = player.slinkyCapture;
  if (!capture || capture.released || sim.tick < capture.releaseTick) return;
  capture.released = true;
  player.deaths++;
  sim.events.push({
    type: "slinky-release",
    player: sim.players.indexOf(player),
    enemy: capture.enemy,
  });
}

export function slinkyCapturePose(capture, tick) {
  const elapsed = tick - capture.tick;
  const duration = Math.max(
    1,
    Math.min(30, capture.releaseTick - capture.tick),
  );
  const t = Math.max(0, Math.min(1, elapsed / duration));
  return {
    visible: elapsed >= 0 && tick < capture.releaseTick && t < 1,
    // Stay at the real contact position. The mouth closes around a shrinking
    // captured shell; no active marble is pulled or teleported to its center.
    position: capture.origin,
    rotation: capture.rotation,
    scale: 1 - t * t * (3 - 2 * t),
  };
}

export function slinkyReformPose(capture, tick, index) {
  const t =
    (tick - capture.releaseTick) / (capture.endTick - capture.releaseTick);
  if (t < 0 || t >= 1) return { visible: false };
  const ease = t * t * (3 - 2 * t),
    remaining = 1 - ease;
  const angle = index * 2.399963229728653;
  return {
    visible: true,
    position: {
      x: capture.destination.x + Math.cos(angle) * 1.8 * remaining,
      y: capture.destination.y + (1.2 + (index % 3) * 0.3) * remaining,
      z: capture.destination.z + Math.sin(angle) * 1.8 * remaining,
    },
    rotation: [
      remaining * (index + 2),
      remaining * (index * 0.4 + 1),
      remaining,
    ],
    scale: Math.min(1, t * 8),
  };
}
