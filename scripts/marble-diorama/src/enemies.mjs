import RAPIER from "@dimforge/rapier3d-compat";

// The visible ball/capsule dimensions come directly from these definitions.
export const MUNCHER_HALF_HEIGHT = 0.25;
const copy = (v) => ({ ...v });
// A convex, low-poly bird: the rendered triangles and collision hull share
// these exact points, including the wings and beak.
export function birdGeometry(radius) {
  const vertices = new Float32Array([
    -radius,
    0,
    0,
    0,
    0,
    radius * 1.1,
    radius,
    0,
    0,
    0,
    0,
    -radius * 0.55,
    0,
    radius * 0.3,
    0,
    0,
    -radius * 0.3,
    0,
  ]);
  const indices = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    indices.push(i, j, 4, i, 5, j);
  }
  return { vertices, indices: new Uint32Array(indices) };
}
export function createEnemies(sim) {
  return (sim.course.enemies ?? []).map((def) => {
    const desc = (
      def.kind === "bird"
        ? RAPIER.RigidBodyDesc.kinematicPositionBased()
        : RAPIER.RigidBodyDesc.dynamic()
    )
      .setTranslation(def.x, def.y, def.z)
      .setCcdEnabled(true);
    if (def.kind === "muncher") desc.lockRotations();
    const body = sim.world.createRigidBody(desc);
    const shape =
      def.kind === "bird"
        ? RAPIER.ColliderDesc.convexHull(birdGeometry(def.radius).vertices)
        : def.kind !== "muncher"
          ? RAPIER.ColliderDesc.ball(def.radius)
          : RAPIER.ColliderDesc.capsule(MUNCHER_HALF_HEIGHT, def.radius);
    const col = sim.world.createCollider(
      shape
        .setMass(def.kind === "steelie" ? 1.4 : def.kind === "mini" ? 0.12 : 1)
        .setFriction(0.85)
        .setRestitution(0.12),
      body,
    );
    const pose = {
      position: copy(body.translation()),
      rotation: copy(body.rotation()),
    };
    return {
      def,
      handle: body.handle,
      collider: col.handle,
      previous: pose,
      current: pose,
      fallenAt: null,
    };
  });
}
export function steerEnemies(sim, dt) {
  for (const e of sim.enemies) {
    if (e.collected) continue;
    const b = sim.world.getRigidBody(e.handle),
      pos = b.translation(),
      vel = b.linvel(),
      home = e.def;
    e.previous = e.current;
    if (home.kind === "bird") {
      const duration = home.distance / (home.speed * sim.preset.enemySpeed),
        period = duration + (home.rest ?? 1),
        phase = (sim.tick * dt + (home.phase ?? 0)) % period,
        active = phase < duration;
      if (active) {
        const pos = {
          x:
            home.x +
            home.direction.x * home.speed * sim.preset.enemySpeed * phase,
          y: home.y,
          z:
            home.z +
            home.direction.z * home.speed * sim.preset.enemySpeed * phase,
        };
        const angle = Math.atan2(home.direction.x, home.direction.z);
        const rotation = {
          x: 0,
          y: Math.sin(angle / 2),
          z: 0,
          w: Math.cos(angle / 2),
        };
        if (!b.isEnabled() || sim.tick === 1) {
          b.setTranslation(pos, true);
          b.setRotation(rotation, true);
          e.previous = { position: copy(pos), rotation: copy(rotation) };
        }
        b.setEnabled(true);
        b.setNextKinematicTranslation(pos);
        b.setNextKinematicRotation(rotation);
      } else b.setEnabled(false);
      e.hidden = !active;
      continue;
    }
    if (pos.y < home.y - 5) {
      e.fallenAt ??= sim.tick;
      if (sim.tick - e.fallenAt > 360) {
        b.setTranslation({ x: home.x, y: home.y, z: home.z }, true);
        b.setLinvel({ x: 0, y: 0, z: 0 }, true);
        b.setAngvel({ x: 0, y: 0, z: 0 }, true);
        e.previous = {
          position: copy(b.translation()),
          rotation: copy(b.rotation()),
        };
        e.fallenAt = null;
      }
      continue;
    }
    let target = home,
      nearest = home.roam + 2;
    for (const p of sim.players) {
      const q = sim.body(p).translation(),
        distance = Math.hypot(q.x - pos.x, q.z - pos.z);
      if (
        p.status === "racing" &&
        Math.abs(q.y - pos.y) < 1.5 &&
        distance < nearest &&
        Math.hypot(q.x - home.x, q.z - home.z) < home.roam
      ) {
        target = q;
        if (home.kind === "mini")
          target = { x: home.x + (pos.x - q.x), z: home.z + (pos.z - q.z) };
        nearest = distance;
      }
    }
    const dx = target.x - pos.x,
      dz = target.z - pos.z,
      distance = Math.hypot(dx, dz),
      speed = Math.min(home.speed * sim.preset.enemySpeed, distance);
    const ex = (dx / Math.max(0.01, distance)) * speed - vel.x,
      ez = (dz / Math.max(0.01, distance)) * speed - vel.z;
    const ray = new RAPIER.Ray(pos, { x: 0, y: -1, z: 0 });
    const grounded = sim.world.castRay(
      ray,
      home.radius + (home.kind === "muncher" ? MUNCHER_HALF_HEIGHT : 0) + 0.1,
      true,
      undefined,
      undefined,
      sim.world.getCollider(e.collider),
      b,
    );
    if (!grounded) continue;
    if (home.kind !== "muncher") {
      const n = Math.max(1, Math.hypot(ex, ez));
      b.applyTorqueImpulse(
        {
          x: (ez / n) * (home.kind === "mini" ? 0.02 : 0.7) * dt,
          y: 0,
          z: (-ex / n) * (home.kind === "mini" ? 0.02 : 0.7) * dt,
        },
        true,
      );
    } else {
      const n = Math.max(1, Math.hypot(ex, ez));
      b.applyImpulse(
        { x: (ex / n) * 3 * dt, y: 0, z: (ez / n) * 3 * dt },
        true,
      );
    }
  }
}
export function updateEnemies(sim) {
  for (const e of sim.enemies) {
    if (e.collected) continue;
    const b = sim.world.getRigidBody(e.handle);
    e.current = {
      position: copy(b.translation()),
      rotation: copy(b.rotation()),
    };
    if (!["muncher", "mini", "bird"].includes(e.def.kind) || e.hidden) continue;
    for (const p of sim.players)
      if (p.status === "racing" && !e.collected) {
        sim.world.contactPair(
          sim.world.getCollider(e.collider),
          sim.world.getCollider(p.collider),
          (manifold) => {
            for (let i = 0; i < manifold.numContacts(); i++)
              if (manifold.contactDist(i) <= 0.002) {
                if (e.def.kind === "muncher" || e.def.kind === "bird")
                  sim.fall(p);
                else if (!e.collected) {
                  e.collected = true;
                  p.time += 3;
                  p.score += 500;
                  sim.events.push({
                    type: "collect",
                    player: sim.players.indexOf(p),
                    time: 3,
                    score: 500,
                  });
                }
              }
          },
        );
      }
    if (e.collected) b.setEnabled(false);
  }
}
