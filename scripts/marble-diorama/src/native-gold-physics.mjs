import {
  GOLD_TRANSFER,
  nativeGoldTransferIntent,
} from "./native-gold-transfer.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeCameraBand } from "./native-camera.mjs";
import { transferForce } from "./powered-transfer.mjs";
import { tubePosition } from "./traversal-bonuses.mjs";

export function physicalNativeGold(sim, player, radius, wasPowered) {
  const paths = sim.traversalPaths.filter(
    (p) => p.nativePipe === "ultimate-gold",
  );
  if (!paths.length) return null;
  const space = slinkyCoordinates(sim.course),
    body = sim.body(player);
  const position = body.translation(),
    velocity = body.linvel();
  const band = nativeCameraBand(
    sim.nativeCamera.scroll,
    space.camera.initialScroll,
  );
  if (band < GOLD_TRANSFER.cameraBand[0] || band > GOLD_TRANSFER.cameraBand[1])
    return null;
  const dynamics = { gravity: sim.nativeDynamics.gravity, maxAcceleration: 40 };
  let flow = transferForce(
    paths,
    position,
    velocity,
    radius,
    player.transferRoute,
    dynamics,
  );
  if (!flow) return null;
  if (!wasPowered && tubePosition(paths[0], position).progress < 1.5)
    player.transferRoute = null;
  if (player.transferRoute?.id === flow.id) return flow;
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
  const intent = nativeGoldTransferIntent(
    {
      ...space.source(position, radius),
      vy: velocity.y / (space.camera.heightScale * space.camera.rate),
    },
    {
      actors,
      random: () => {
        let n =
          sim.options.seed ^
          sim.tick ^
          Math.imul(sim.players.indexOf(player), 0x9e3779b9);
        n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
        n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
        return (n ^ (n >>> 16)) & 1;
      },
    },
  );
  if (!intent) return null;
  const selected = paths.find(
    (p) => p.id === flow.id && p.branch === intent.branch,
  );
  player.transferRoute = {
    id: flow.id,
    branch: intent.branch,
    ...(selected.exitRoute ? { exitRoute: selected.exitRoute } : {}),
  };
  // Retain the source choice, but move solely by bounded force through the
  // rendered connecting shell. Never assign the source destination/velocity.
  return transferForce(
    paths,
    position,
    velocity,
    radius,
    player.transferRoute,
    dynamics,
  );
}
