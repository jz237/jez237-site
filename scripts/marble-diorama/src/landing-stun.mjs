// Amiga hard landings can leave the marble dizzy but still physically moving.
// Threshold and speed-to-duration curve are reconstructed, not recovered code.
export function landingStunTicks(speed) {
  if (speed < 6.5) return 0;
  return Math.round(120 * Math.min(2.85, 0.8 + (speed - 6.5) * 0.35));
}
export function updateLandingStun(sim, player, velocity) {
  if (!sim.course.rules?.landingStun || player.status !== "racing") return;
  const marble = sim.world.getCollider(player.collider);
  const center = sim.body(player).translation();
  let supported = false,
    impactSpeed = 0;
  sim.world.contactPairsWith(marble, (other) => {
    if (
      other.isSensor() ||
      sim.players.some((p) => p.collider === other.handle) ||
      sim.enemies.some((e) => e.colliders.includes(other.handle))
    )
      return;
    // Resolve authored movers explicitly: Rapier 0.20's restored wrapper can
    // report body handle 0 as the parent of an unparented static collider.
    const mover = sim.movers.find(
      (m) =>
        sim.world.getRigidBody(m.handle).collider(0).handle === other.handle,
    );
    const body = mover ? sim.world.getRigidBody(mover.handle) : null;
    sim.world.contactPair(marble, other, (manifold, flipped) => {
      const n = manifold.normal();
      if (!flipped) {
        n.x *= -1;
        n.y *= -1;
        n.z *= -1;
      }
      if (n.y < 0.35) return;
      for (let i = 0; i < manifold.numContacts(); i++) {
        if (manifold.contactDist(i) > 0.002) continue;
        const point = {
          x: center.x - n.x * 0.55,
          y: center.y - n.y * 0.55,
          z: center.z - n.z * 0.55,
        };
        supported = true;
        const ground = body?.velocityAtPoint(point) ?? { x: 0, y: 0, z: 0 };
        impactSpeed = Math.max(
          impactSpeed,
          -(
            (velocity.x - ground.x) * n.x +
            (velocity.y - ground.y) * n.y +
            (velocity.z - ground.z) * n.z
          ),
        );
      }
    });
  });
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
