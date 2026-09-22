import { nativeCameraBand } from "./native-camera.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeTransferIntent, SILLY_TRANSFER } from "./native-transfer.mjs";
import { transferForce } from "./powered-transfer.mjs";

// Inlet acceleration and outlet decisions use source rules. The connecting
// bends use bounded airflow through the same open mesh used by contact.
export function physicalNativeTransfer(sim, player, index, radius, wasPowered) {
  const paths = sim.traversalPaths.filter((p) => p.nativeTransfer);
  if (!paths.length) return null;
  const body = sim.body(player),
    position = body.translation(),
    velocity = body.linvel();
  const space = slinkyCoordinates(sim.course),
    rate = space.camera.rate;
  const liftAcceleration =
    SILLY_TRANSFER.liftVelocityStep * space.camera.heightScale * rate * rate;
  const dynamics = {
    gravity: sim.nativeDynamics.gravity,
    maxAcceleration: Math.max(
      25,
      liftAcceleration + sim.nativeDynamics.gravity,
    ),
  };
  // Outside the actual open bore there is no force and no selection.
  let flow = transferForce(
    paths,
    position,
    velocity,
    radius,
    player.transferRoute,
    dynamics,
  );
  if (!flow) return null;
  const source = space.source(position, radius);
  const band = nativeCameraBand(
    sim.nativeCamera.scroll,
    space.camera.initialScroll,
  );
  const loaded = band >= 20 && band <= 51;
  if (!loaded) return null;
  if (!wasPowered && source.height <= SILLY_TRANSFER.releaseHeight)
    player.transferRoute = null;
  if (player.transferRoute && source.height > SILLY_TRANSFER.releaseHeight)
    return flow;
  const actors = [
    ...sim.players
      .filter((p) => p !== player && p.status === "racing")
      .map((p) => ({
        ...space.source(sim.body(p).translation()),
        active: true,
      })),
    ...sim.enemies
      .filter(
        (e) =>
          !e.hidden &&
          !e.defeated &&
          !e.collected &&
          (e.nativeSteelie || e.nativeSlinky),
      )
      .map((e) => ({
        ...space.source(sim.world.getRigidBody(e.handle).translation()),
        active: true,
      })),
    ...sim.acid
      .filter((a) => a.zone.nativeAcidSlot !== undefined && !a.hidden)
      .map((a) => ({ ...space.source(a.current.position), active: true })),
  ];
  // The hash supplies a deterministic replacement RNG; source selection timing
  // and clearance rules are recovered, but original RNG state is not emulated.
  const random = () => {
    let n = sim.options.seed ^ sim.tick ^ Math.imul(index, 0x9e3779b9);
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    return (n ^ (n >>> 16)) & 1;
  };
  const intent = nativeTransferIntent(
    { ...source, vy: velocity.y / (space.camera.heightScale * rate) },
    { loaded, random, actors },
  );
  if (!intent && !player.transferRoute) return null;
  if (intent?.phase === "lift") {
    const center = space.world(708, 716, source.height);
    // Original horizontal velocity clearing becomes bounded centering. Its
    // two-unit height nudge is deliberately not copied into the rigid body.
    let x = (center.x - position.x) * 20 - velocity.x * 10;
    let z = (center.z - position.z) * 20 - velocity.z * 10;
    const scale = 20 / Math.max(20, Math.hypot(x, z));
    flow.acceleration = { x: x * scale, y: liftAcceleration, z: z * scale };
  } else if (intent?.phase === "release" && !player.transferRoute) {
    const path = paths.find((p) => p.branch === intent.branch);
    player.transferRoute = {
      id: path.id,
      branch: intent.branch,
      exitRoute: path.exitRoute,
    };
    flow = transferForce(
      paths,
      position,
      velocity,
      radius,
      player.transferRoute,
      dynamics,
    );
  }
  return flow;
}
