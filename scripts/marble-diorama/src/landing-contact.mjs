// Real post-step support shared by landing reactions and awards.
export function landingContact(sim, player, velocity, radius) {
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
          x: center.x - n.x * radius,
          y: center.y - n.y * radius,
          z: center.z - n.z * radius,
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
  return { supported, impactSpeed };
}
