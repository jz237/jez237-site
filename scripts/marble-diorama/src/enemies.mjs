import RAPIER from "@dimforge/rapier3d-compat";
import { contactPhysicalBird } from "./native-bird-physics.mjs";
import {
  nativeMiniatureSolids,
  contactPhysicalMiniature,
} from "./native-miniature-physics.mjs";
import { createSteelieState } from "./native-steelie.mjs";
import { createSlinkyState } from "./native-slinky.mjs";
import {
  initialSlinkyPose,
  advanceNativeSlinky,
  contactNativeSlinky,
} from "./native-slinky-physics.mjs";
import {
  advanceNativeSteelie,
  steerNativeSteelie,
  nativeSteelieFallen,
  awardNativeSteelieDefeat,
  updateNativeSteelieLanding,
} from "./native-steelie-physics.mjs";

// Animated actors share articulated solids with the renderer.
import { actorShapes, MUNCHER_HALF_HEIGHT } from "./actor-shapes.mjs";
export { MUNCHER_HALF_HEIGHT } from "./actor-shapes.mjs";
const copy = (v) => ({ ...v });
export function birdMotionAt(home, time, speedMultiplier = 1) {
  const duration = home.distance / (home.speed * speedMultiplier),
    period = duration + (home.rest ?? 1),
    phase = (time + (home.phase ?? 0)) % period;
  return {
    active: phase < duration,
    position: {
      x: home.x + home.direction.x * home.speed * speedMultiplier * phase,
      y: home.y,
      z: home.z + home.direction.z * home.speed * speedMultiplier * phase,
    },
  };
}
const collisionShapes = new WeakMap();
const walks = (def) =>
  def.kind === "muncher" ||
  (def.kind === "mini" && ["muncher", "acid"].includes(def.form));
const mass = (def) =>
  def.kind === "steelie" ? 1.4 : def.kind === "mini" ? 0.12 : 1;
function colliderDesc(solid) {
  return solid.trimesh
    ? RAPIER.ColliderDesc.trimesh(solid.vertices, solid.indices)
    : RAPIER.ColliderDesc.convexHull(solid.vertices);
}
function cachedShape(solid) {
  if (!collisionShapes.has(solid))
    collisionShapes.set(solid, colliderDesc(solid).shape);
  return collisionShapes.get(solid);
}
export function createEnemies(sim) {
  return (sim.course.enemies ?? []).map((def) => {
    const desc = (
      def.kind === "bird" || def.nativeSlinky
        ? RAPIER.RigidBodyDesc.kinematicPositionBased()
        : RAPIER.RigidBodyDesc.dynamic()
    )
      .setTranslation(def.x, def.y, def.z)
      .setCcdEnabled(true);
    if (walks(def)) desc.lockRotations();
    // Keep articulated miniature mass centered on its supporting footprint.
    // Recomputing mass from a curling head shifts the body's origin and can
    // pull its static foot through the floor.
    if (def.kind === "mini" && walks(def))
      desc.setAdditionalMassProperties(
        mass(def),
        { x: 0, y: 0, z: 0 },
        { x: 0.002, y: 0.002, z: 0.002 },
        { x: 0, y: 0, z: 0, w: 1 },
      );
    const body = sim.world.createRigidBody(desc);
    const nativeSlinky = def.nativeSlinky
      ? createSlinkyState(def.nativeSlinky)
      : null;
    const initial = nativeSlinky
      ? initialSlinkyPose(sim.course, { def, nativeSlinky })
      : null;
    const solids =
      def.nativeMiniatureSlot !== undefined
        ? nativeMiniatureSolids(def)
        : (initial?.solids ?? actorShapes(def, 0));
    const colliders = (solids ?? [null]).map(
      (solid) =>
        sim.world.createCollider(
          (solid ? colliderDesc(solid) : RAPIER.ColliderDesc.ball(def.radius))
            .setMass(
              (def.kind === "mini" && walks(def) ? 0 : mass(def)) /
                (solids?.length ?? 1),
            )
            .setFriction(0.85)
            .setRestitution(0.12),
          body,
        ).handle,
    );
    const pose = {
      ...(initial ||
      def.nativeBirdSlot !== undefined ||
      def.nativeMiniatureSlot !== undefined
        ? { solids }
        : {}),
      position: copy(body.translation()),
      rotation: copy(body.rotation()),
    };
    if (
      def.nativeSteelie ||
      nativeSlinky ||
      def.nativeBirdSlot !== undefined ||
      def.nativeMiniatureSlot !== undefined
    )
      body.setEnabled(false);
    return {
      def,
      handle: body.handle,
      collider: colliders[0],
      colliders,
      previous: pose,
      current: pose,
      fallenAt: null,
      supportedY: def.y,
      ...(def.nativeSteelie
        ? { nativeSteelie: createSteelieState(), hidden: true }
        : {}),
      ...(nativeSlinky ? { nativeSlinky, hidden: true } : {}),
      ...(def.nativeBirdSlot !== undefined ? { hidden: true } : {}),
      ...(def.nativeMiniatureSlot !== undefined ? { hidden: true } : {}),
    };
  });
}
export function steerEnemies(sim, dt) {
  for (const e of sim.enemies) {
    if (
      e.def.nativeBirdSlot !== undefined ||
      e.def.nativeMiniatureSlot !== undefined
    )
      continue;
    if (e.collected || (e.defeated && !e.nativeSteelie && !e.nativeSlinky))
      continue;
    const b = sim.world.getRigidBody(e.handle),
      pos = b.translation(),
      vel = b.linvel(),
      home = e.def;
    e.previous = e.current;
    if (e.nativeSlinky) {
      advanceNativeSlinky(sim, e, dt);
      continue;
    }
    const solids = actorShapes(home, sim.tick * dt * sim.preset.enemySpeed);
    if (solids)
      solids.forEach((solid, i) => {
        if (!solid.dynamic) return;
        const collider = sim.world.getCollider(e.colliders[i]);
        collider.setShape(cachedShape(solid));
        collider.setMass(
          (home.kind === "mini" && walks(home) ? 0 : mass(home)) /
            solids.length,
        );
      });
    if (home.kind === "bird") {
      const { active, position: pos } = birdMotionAt(
        home,
        sim.tick * dt,
        sim.preset.enemySpeed,
      );
      if (active) {
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
    if (e.nativeSteelie) {
      const spawned = advanceNativeSteelie(sim, e, !!grounded, dt);
      if (spawned || e.hidden || e.defeated) continue;
    }
    // Descending a ramp is not a defeat. Native guards use source terrain/drop
    // limits; the older campaign retains its unsupported five-unit fall rule.
    const fallen = e.nativeSteelie
      ? nativeSteelieFallen(sim, e, !!grounded)
      : home.kind === "steelie"
        ? !grounded && pos.y < e.supportedY - 5
        : pos.y < home.y - 5;
    if (fallen) {
      e.fallenAt ??= sim.tick;
      if (home.kind === "steelie") {
        e.defeated = true;
        b.setEnabled(false);
        if (e.nativeSteelie) {
          e.hidden = true;
          awardNativeSteelieDefeat(sim, e);
          continue;
        }
        // The older authored campaign retains its last-contact rule until its
        // separate native-board replacement has passed release acceptance.
        const player = sim.players[e.lastContactPlayer];
        if (player) {
          player.score += 1000;
          sim.events.push({
            type: "steelie-defeat",
            enemy: home.id,
            player: e.lastContactPlayer,
            score: 1000,
          });
        }
        continue;
      }
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
    if (grounded) e.supportedY = pos.y;
    if (e.nativeSteelie) {
      if (grounded) steerNativeSteelie(sim, e, dt);
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
    if (!grounded) continue;
    if (walks(home) && distance > 0.05) {
      const desired = Math.atan2(dx, dz),
        old = e.heading ?? desired;
      const difference = Math.atan2(
        Math.sin(desired - old),
        Math.cos(desired - old),
      );
      e.heading = old + Math.max(-3 * dt, Math.min(3 * dt, difference));
      b.setRotation(
        { x: 0, y: Math.sin(e.heading / 2), z: 0, w: Math.cos(e.heading / 2) },
        true,
      );
    }
    if (!walks(home)) {
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
        {
          x: (ex / n) * 3 * mass(home) * dt,
          y: 0,
          z: (ez / n) * 3 * mass(home) * dt,
        },
        true,
      );
    }
  }
}
export function updateEnemies(sim, incomingVelocity = []) {
  for (const e of sim.enemies) {
    updateNativeSteelieLanding(sim, e);
    if (e.collected || e.defeated) continue;
    const b = sim.world.getRigidBody(e.handle);
    e.current = {
      ...e.current,
      position: copy(b.translation()),
      rotation: copy(b.rotation()),
    };
    if (e.hidden) continue;
    let steelieTouch = false;
    for (const p of sim.players)
      if (p.status === "racing" && !e.collected) {
        for (const handle of e.colliders)
          sim.world.contactPair(
            sim.world.getCollider(handle),
            sim.world.getCollider(p.collider),
            (manifold) => {
              for (let i = 0; i < manifold.numContacts(); i++)
                if (manifold.contactDist(i) <= 0.002) {
                  if (e.def.nativeMiniatureSlot !== undefined) {
                    contactPhysicalMiniature(sim, e, p);
                  } else if (e.def.nativeBirdSlot !== undefined) {
                    contactPhysicalBird(sim, e, p);
                  } else if (e.nativeSlinky) {
                    if (p.status === "racing")
                      contactNativeSlinky(
                        sim,
                        e,
                        p,
                        incomingVelocity[sim.players.indexOf(p)] ??
                          sim.body(p).linvel(),
                      );
                  } else if (e.def.kind === "steelie") {
                    e.lastContactPlayer = sim.players.indexOf(p);
                    steelieTouch = true;
                  } else if (e.def.kind === "muncher" || e.def.kind === "bird")
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
    if (e.nativeSteelie) {
      if (steelieTouch && !e.steelieTouch) e.nativeSteelie.bump = true;
      e.steelieTouch = steelieTouch;
    }
  }
}
