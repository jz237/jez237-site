// Original airborne update at 0x130f0–0x13106: subtract 0x6000 from
// 16.16 vertical velocity and clamp to -0x50000 before position integration.
export const NATIVE_GRAVITY = 0x6000 / 65536;
export const NATIVE_TERMINAL_SPEED = 5;

export function validateNativeDynamics(course, finite) {
  if (!course.nativeDynamics) return;
  if (
    !course.nativeCamera ||
    !finite(course.nativeDynamics.rate) ||
    course.nativeDynamics.rate < 1 ||
    course.nativeDynamics.rate > 120
  )
    throw Error(
      "Native dynamics need a camera coordinate scale and update rate.",
    );
}

export function nativeDynamics(course) {
  if (!course.nativeDynamics) return { gravity: 9.81, terminalSpeed: null };
  const rate = course.nativeDynamics.rate,
    unit = course.nativeCamera.heightScale;
  return {
    gravity: NATIVE_GRAVITY * unit * rate * rate,
    terminalSpeed: NATIVE_TERMINAL_SPEED * unit * rate,
  };
}

// Reference discrete free flight; contact and source ground snapping are not
// reproduced here. Rapier continues to own actual collision integration.
export function nativeFlightStep(position, velocity) {
  const next = {
    ...velocity,
    up: Math.max(-NATIVE_TERMINAL_SPEED, velocity.up - NATIVE_GRAVITY),
  };
  return {
    position: {
      x: position.x + next.x,
      z: position.z + next.z,
      height: position.height + next.up,
    },
    velocity: next,
  };
}
