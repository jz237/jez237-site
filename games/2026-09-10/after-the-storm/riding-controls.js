const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// Continuous at the dead zone, with extra precision around the centre.
export function steeringAxis(value, deadzone = .08) {
  if (!Number.isFinite(value)) return 0;
  const magnitude = clamp((Math.abs(value) - deadzone) / (1 - deadzone), 0, 1);
  return Math.sign(value) * magnitude ** 1.2;
}
export function touchHelm(input, { enabled = false, active = false, steer = 0, steering = false, autoThrottle = false } = {}) {
  if (!enabled || !active) return input;
  return { ...input, steer: steering ? steer : input.steer,
    throttle: input.brake ? 0 : Math.max(input.throttle || 0, autoThrottle ? 1 : 0) };
}
