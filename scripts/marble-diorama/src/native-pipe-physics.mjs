import { nativePipeIntent } from "./native-pipes.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeCameraBand } from "./native-camera.mjs";
import { transferForce } from "./powered-transfer.mjs";
import { physicalNativeGold } from "./native-gold-physics.mjs";

// Capture only inside the rendered bore, then carry the sphere through the
// same continuous passage. The source's destination jumps are not applied.
export function physicalNativePipes(sim, player, radius, wasPowered) {
  const gold = physicalNativeGold(sim, player, radius, wasPowered);
  if (gold) return gold;
  const paths = sim.traversalPaths.filter(
    (path) => path.nativePipe && path.nativePipe !== "ultimate-gold",
  );
  if (!paths.length) return null;
  if (!wasPowered && paths.some((path) => path.id === player.transferRoute?.id))
    player.transferRoute = null;
  const space = slinkyCoordinates(sim.course),
    body = sim.body(player);
  const position = body.translation(),
    velocity = body.linvel();
  const source = space.source(position, radius);
  const band = nativeCameraBand(
    sim.nativeCamera.scroll,
    space.camera.initialScroll,
  );
  for (const path of paths) {
    const upper = path.nativePipe === "beginner-upper";
    const orange = path.nativePipe === "intermediate-orange";
    if (
      band < (upper ? 23 : orange ? 26 : 34) ||
      band > (upper ? 44 : orange ? 47 : 61)
    )
      continue;
    const flow = transferForce(
      [path],
      position,
      velocity,
      radius,
      player.transferRoute,
      { gravity: sim.nativeDynamics.gravity, maxAcceleration: 40 },
    );
    if (!flow) continue;
    if (player.transferRoute?.id === path.id) return flow;
    const intent = nativePipeIntent(
      upper ? 18 : orange ? 32 : path.branch ? 20 : 19,
      {
        ...source,
        vy: velocity.y / (space.camera.heightScale * space.camera.rate),
      },
    );
    if (intent?.phase === "hold") {
      // Original horizontal clearing becomes bounded damping; gravity carries
      // the marble down the vertical shaft into the release band.
      flow.acceleration = { x: -velocity.x * 8, y: 0, z: -velocity.z * 8 };
      const length = Math.hypot(flow.acceleration.x, flow.acceleration.z);
      const scale = 20 / Math.max(20, length);
      flow.acceleration.x *= scale;
      flow.acceleration.z *= scale;
      return flow;
    }
    if (intent?.phase !== "release") continue;
    player.transferRoute = { id: path.id, branch: path.branch };
    return flow;
  }
  return null;
}
