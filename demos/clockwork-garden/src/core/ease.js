// Easing and timeline helpers. All animation in the film is a pure function of
// the timeline time t (seconds), so seeking is exact and repeatable.

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, k) => a + (b - a) * k;
export const invLerp = (a, b, x) => clamp((x - a) / (b - a));
export const smooth = (k) => k * k * (3 - 2 * k);
export const smoother = (k) => k * k * k * (k * (k * 6 - 15) + 10);
export const seg = (t, a, b) => invLerp(a, b, t);
export const sseg = (t, a, b) => smooth(invLerp(a, b, t));
export const ssseg = (t, a, b) => smoother(invLerp(a, b, t));

export const easeInCubic = (k) => k * k * k;
export const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
export const easeInOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeInOutSine = (k) => -(Math.cos(Math.PI * k) - 1) / 2;
export const easeOutQuart = (k) => 1 - Math.pow(1 - k, 4);
export const easeInQuad = (k) => k * k;
export const easeOutBack = (k, s = 1.4) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);

// Damped spring settle used for mechanical overshoot after a motion completes.
export function settle(k, freq = 3, damping = 5) {
  if (k <= 0) return 0;
  if (k >= 1.5) return 1;
  return 1 - Math.exp(-damping * k) * Math.cos(freq * Math.PI * 2 * k);
}

// Bell-shaped window: 0 outside [a,d], 1 in [b,c], smooth ramps.
export function window4(t, a, b, c, d) {
  if (t <= a || t >= d) return 0;
  if (t < b) return smooth((t - a) / (b - a));
  if (t > c) return smooth(1 - (t - c) / (d - c));
  return 1;
}

// Integral of a smoothstep ramp: angle accumulated by a shaft that spins up.
// Returns rotations-equivalent distance for a speed that ramps from 0 to
// `speed` between t0 and t1 and stays constant afterwards.
export function rampIntegral(t, t0, t1, speed) {
  if (t <= t0) return 0;
  const d = t1 - t0;
  if (t < t1) {
    const k = (t - t0) / d;
    // integral of 3k^2 - 2k^3 dk = k^3 - k^4/2
    return speed * d * (k * k * k - 0.5 * k * k * k * k);
  }
  return speed * d * 0.5 + speed * (t - t1);
}

// Trapezoidal velocity profile: accelerate over [0,a], cruise, decelerate over
// [1-b,1]. Returns normalised distance travelled. Used for travelling pulses
// and creatures that launch, cruise and arrive.
export function trapezoid(k, a = 0.15, b = 0.15) {
  k = clamp(k);
  const v = 1 / (1 - a / 2 - b / 2);
  if (k < a) return clamp((v * k * k) / (2 * a));
  if (k <= 1 - b || b <= 0) return clamp(v * (a / 2 + k - a));
  const d = k - (1 - b);
  return clamp(v * (a / 2 + (1 - b) - a + d - (d * d) / (2 * b)));
}

// Catmull-Rom interpolation across scalar keyframes [[t, v], ...].
export function keyed(t, keys, ease = smooth) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}
