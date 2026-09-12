const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angle = v => Math.atan2(Math.sin(v), Math.cos(v));
// The lens follows the travel line and a suspended water datum. Hull pitch,
// rider tricks and momentary handlebar reversals never roll the horizon.
export function chaseFrame(memory, rider, dt, { orbit = 0, zoom = 11, pitch = .22 } = {}) {
  dt = clamp(dt, 0, .1);
  const h = rider.hydro, speed = Math.hypot(rider.vx, rider.vz);
  const water = Number.isFinite(h.waterHeight) ? h.waterHeight : 0;
  if (!memory.initialized) Object.assign(memory, { initialized: true, heading: rider.heading, rate: 0, water, lift: 0 });
  const travel = speed > 4 ? Math.atan2(rider.vx, rider.vz) : rider.heading;
  const desired = rider.heading + angle(travel - rider.heading) * .48;
  const rate = clamp(angle(desired - memory.heading) * 4, -1.65, 1.65);
  memory.rate += clamp(rate - memory.rate, -5 * dt, 5 * dt);
  memory.heading = angle(memory.heading + memory.rate * dt);
  memory.water += (water - memory.water) * (1 - Math.exp(-dt * 2.2));
  const lift = clamp((h.y || 0) - water - .3, 0, 5) * .32;
  memory.lift += (lift - memory.lift) * (1 - Math.exp(-dt * 3));
  const heading = memory.heading + orbit, fx = Math.sin(heading), fz = Math.cos(heading);
  const distance = clamp(zoom, 6, 25), pace = clamp(speed / 30, 0, 1);
  const look = 3.4 + pace * 2.8, turnLook = clamp(rider.yawVelocity || 0, -.7, .7) * pace * 1.3;
  return {
    position: { x: rider.x - fx * distance, y: memory.water + 1.35 + Math.sin(pitch) * distance - pace * .4 + memory.lift, z: rider.z - fz * distance },
    target: { x: rider.x + Math.sin(memory.heading + turnLook) * look, y: memory.water + .85 + memory.lift * 1.5, z: rider.z + Math.cos(memory.heading + turnLook) * look },
    fov: 62 + pace * 11
  };
}
