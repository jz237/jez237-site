import { sourceCameraPlayer } from "./native-camera.mjs";
import {
  advanceSteelieController,
  steelieVelocityStep,
  steelieGroundDragStep,
} from "./native-steelie.mjs";

export function advanceNativeSteelie(sim, e, grounded, dt) {
  const camera = sim.course.nativeCamera;
  const terrain = sim.course.parts.find((p) => p.id === camera.partId);
  const body = sim.world.getRigidBody(e.handle);
  const source = (position, radius) =>
    sourceCameraPlayer(terrain, camera, { position, active: true }, radius);
  const position = {
    ...source(body.translation(), e.def.radius),
    motionState: grounded ? 0 : 2,
  };
  const players = sim.players.map((p) => ({
    ...source(sim.body(p).translation(), p.radius ?? 0.55),
    active: p.status === "racing",
    region: p.navigation?.region,
    // Rapier's supported/falling distinction is the physical equivalent used
    // here; original player animation/capture states remain a separate audit.
    motionState: p.grounded ? 0 : 2,
    animationState: 0,
  }));
  const spawned = advanceSteelieController(
    e.def.nativeSteelie,
    e.nativeSteelie,
    sim.tick * dt * sim.preset.machineSpeed,
    camera.rate,
    sim.nativeCamera,
    position,
    players,
  );
  if (spawned) {
    body.setTranslation({ x: e.def.x, y: e.def.y, z: e.def.z }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    e.defeated = false;
    e.fallenAt = null;
    e.supportedY = e.def.y;
    e.lastContactPlayer = undefined;
    e.steelieTouch = false;
    e.previous = e.current = {
      position: { ...body.translation() },
      rotation: { ...body.rotation() },
    };
  }
  e.hidden = !e.nativeSteelie.loaded || !!e.defeated;
  body.setEnabled(!e.hidden);
  return spawned;
}

export function steerNativeSteelie(sim, e, dt) {
  const b = sim.world.getRigidBody(e.handle);
  const c = sim.course.nativeCamera;
  const part = sim.course.parts.find((p) => p.id === c.partId);
  const rate = c.rate * sim.preset.machineSpeed;
  const scale = (part.cellSize / 8) * rate;
  const v = e.nativeSteelie.velocity;
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  const current = b.linvel();
  const local = {
    x: (current.x * cs + current.z * sn) / scale,
    z: (-current.x * sn + current.z * cs) / scale,
  };
  const next = steelieGroundDragStep(steelieVelocityStep(local, v));
  const change = { x: next.x - local.x, z: next.z - local.z };
  // Source steering adds 1/32 of its velocity error per original update.
  // Apply that response through rolling torque, preserving physical impacts
  // and the rendered sphere's rotation. No position/velocity replacement.
  const gain = 1 - Math.pow(31 / 32, rate * dt);
  const impulse = 1.4 * b.mass() * e.def.radius * gain * 32 * scale;
  b.applyTorqueImpulse(
    {
      x: (change.x * sn + change.z * cs) * impulse,
      y: 0,
      z: -(change.x * cs - change.z * sn) * impulse,
    },
    true,
  );
}
