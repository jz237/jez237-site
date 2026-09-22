// 0xea10 derives two planar corner-height differences. At 0x14a88, each
// signed difference with magnitude >=12 is multiplied by four; shifting by
// eleven turns it into a 16.16 velocity increment. Silly adds that increment
// (uphill); the other courses subtract it. Airborne gravity is a separate rule.
export function sourceSlopeStep(velocity, gradient, uphill = false) {
  const component = (d) => (Math.abs(d) >= 12 ? d * 4 : d) / 32;
  const direction = uphill ? 1 : -1;
  return {
    x: velocity.x + direction * component(gradient.x),
    z: velocity.z + direction * component(gradient.z),
  };
}

// Actual contact normals supply the plane, in world space. The counterforce
// removes only ordinary tangential gravity, retaining downward normal loading
// and unchanged free flight. The 7/5 factor accounts for a rolling solid sphere
// accelerated at its center; the source velocities describe translation.
export function nativeSlopeAcceleration(course, normal, gravity, speed = 1) {
  if (!course.nativeDynamics?.uphillSlopes || !normal || normal.y < 0.35)
    return null;
  const camera = course.nativeCamera,
    part = course.parts.find((p) => p.id === camera.partId);
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  const gx = -normal.x / normal.y,
    gz = -normal.z / normal.y;
  const snap = (v) => (Math.abs(v - Math.round(v)) < 1e-4 ? Math.round(v) : v);
  const gradient = {
    x: snap(((gx * cs + gz * sn) * part.cellSize) / camera.heightScale),
    z: snap(((-gx * sn + gz * cs) * part.cellSize) / camera.heightScale),
  };
  const source = sourceSlopeStep({ x: 0, z: 0 }, gradient, true);
  const factor = (part.cellSize / 8) * (camera.rate * speed) ** 2;
  const ax = (source.x * cs - source.z * sn) * factor,
    az = (source.x * sn + source.z * cs) * factor;
  const ay = gx * ax + gz * az;
  return {
    x: 1.4 * ax - gravity * normal.y * normal.x,
    y: 1.4 * ay + gravity * (1 - normal.y * normal.y),
    z: 1.4 * az - gravity * normal.y * normal.z,
  };
}

export function applyNativeSlope(sim, p, dt) {
  if (!sim.course.nativeDynamics?.uphillSlopes) return;
  const body = sim.body(p),
    marble = sim.world.getCollider(p.collider);
  const terrain = new Set(sim.staticColliderHandles);
  let normal = null;
  sim.world.contactPairsWith(marble, (other) => {
    if (!terrain.has(other.handle) || other.isSensor()) return;
    sim.world.contactPair(marble, other, (manifold, flipped) => {
      const n = manifold.normal();
      if (!flipped) {
        n.x *= -1;
        n.y *= -1;
        n.z *= -1;
      }
      if (n.y < 0.35 || (normal && n.y < normal.y)) return;
      for (let i = 0; i < manifold.numContacts(); i++)
        if (manifold.contactDist(i) <= 0.002) {
          normal = n;
          break;
        }
    });
  });
  // A cached manifold can be empty for one step at a triangle boundary.
  // Confirm support directly against the same closed collider geometry. This
  // uses the real sphere radius, not a larger invisible supporting shape.
  if (!normal) {
    const center = body.translation(),
      radius = marble.radius();
    for (const handle of terrain) {
      const collider = sim.world.getCollider(handle);
      if (!collider.isEnabled() || collider.isSensor()) continue;
      const projection = collider.projectPoint(center, false);
      const dx = center.x - projection.point.x,
        dy = center.y - projection.point.y,
        dz = center.z - projection.point.z;
      const distance = Math.hypot(dx, dy, dz);
      if (
        distance < radius - 0.002 ||
        distance > radius + 0.002 ||
        dy / distance < 0.35
      )
        continue;
      const n = { x: dx / distance, y: dy / distance, z: dz / distance };
      if (!normal || n.y > normal.y) normal = n;
    }
  }
  const a = nativeSlopeAcceleration(
    sim.course,
    normal,
    sim.nativeDynamics.gravity,
    sim.preset.machineSpeed,
  );
  if (a)
    body.applyImpulse(
      {
        x: a.x * body.mass() * dt,
        y: a.y * body.mass() * dt,
        z: a.z * body.mass() * dt,
      },
      true,
    );
}
