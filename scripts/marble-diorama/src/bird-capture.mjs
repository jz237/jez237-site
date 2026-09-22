// 0x143c8: marker102 becomes 36 expanding updates, then animation4's
// marker101 becomes 24 contracting updates. These new 3D fragment paths keep
// those clocks; safe respawn selection remains the simulation's existing rule.
export function finishBirdCapture(sim, player) {
  const c = player.birdCapture;
  if (!c || c.released || sim.tick < c.releaseTick) return;
  c.released = true;
  player.deaths++;
  sim.events.push({ type: "bird-reform", player: sim.players.indexOf(player) });
}

export function birdFragmentPose(c, tick, index) {
  if (tick < c.tick || tick >= c.endTick) return { visible: false };
  const expanding = tick < c.releaseTick;
  const t = expanding
    ? (tick - c.tick) / (c.releaseTick - c.tick)
    : (tick - c.releaseTick) / (c.endTick - c.releaseTick);
  const spread = expanding ? t : 1 - t;
  const center = expanding ? c.origin : c.destination;
  const angle = (index * Math.PI) / 4 + (expanding ? t : 1 - t) * Math.PI * 1.8;
  return {
    visible: true,
    position: {
      x: center.x + Math.cos(angle) * spread * 1.8,
      y: center.y + spread * (1.2 + (index % 3) * 0.16),
      z: center.z + Math.sin(angle) * spread * 1.8,
    },
    rotation: c.rotation,
    spin: spread * (index + 2),
    scale: 1,
  };
}
