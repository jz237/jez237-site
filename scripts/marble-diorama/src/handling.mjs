// Optional accessible handling. All assistance is contact torque, so the
// sphere continues to roll against the same visible collision surface.
export function handlingBrake(input, spin, dt, inertia) {
  const length = Math.hypot(input.x, input.z);
  const amount = Math.min(1, length);
  const axis =
    length > 0.001
      ? { x: input.z / length, z: -input.x / length }
      : { x: 0, z: 0 };
  const along = spin.x * axis.x + spin.z * axis.z;
  // Release brakes both axes; held input mainly brakes sideways drift.
  const keep = Math.max(0, along) * amount;
  const x = spin.x - axis.x * keep,
    z = spin.z - axis.z * keep;
  const speed = Math.hypot(x, z);
  const impulse = Math.min(speed * inertia, speed * 0.7 * dt, 3.5 * dt);
  return speed > 0
    ? { x: (-x / speed) * impulse, y: 0, z: (-z / speed) * impulse }
    : { x: 0, y: 0, z: 0 };
}
