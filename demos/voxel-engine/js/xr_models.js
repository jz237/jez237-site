// The tools as held in VR: a handful of boxes each, on a 1 cm grid, in the
// axes of the controller's pointing ray (-Z ahead, +Y up, +X right, origin
// where the ray starts). Each box: [x0, y0, z0, x1, y1, z1, r, g, b] in
// metres and display colour. The barrel of every tool lies on the ray, so
// the aim line leaves its muzzle.
const STEEL = [0.2, 0.21, 0.24], DARK = [0.09, 0.1, 0.12], WOOD = [0.46, 0.3, 0.16], RED = [0.78, 0.14, 0.1];
const BRASS = [0.82, 0.62, 0.16], GLOW = [0.25, 0.7, 1.0], PALE = [0.62, 0.64, 0.67], GREEN = [0.24, 0.42, 0.2];

const box = (x0, y0, z0, x1, y1, z1, c) => [x0, y0, z0, x1, y1, z1, c[0], c[1], c[2]];
const GRIP = box(-0.015, -0.11, 0.02, 0.015, -0.01, 0.06, DARK);

export const TOOL_MODELS = [
  // Sledgehammer: a long handle with the head out in front.
  [box(-0.012, -0.012, -0.34, 0.012, 0.012, 0.1, WOOD), box(-0.035, -0.075, -0.42, 0.035, 0.075, -0.34, STEEL)],
  // Rifle.
  [GRIP, box(-0.015, -0.02, -0.16, 0.015, 0.025, 0.2, STEEL), box(-0.008, -0.008, -0.38, 0.008, 0.008, -0.16, DARK), box(-0.012, -0.06, 0.12, 0.012, -0.02, 0.2, WOOD)],
  // Shotgun: two barrels side by side.
  [GRIP, box(-0.02, -0.025, -0.1, 0.02, 0.02, 0.18, WOOD), box(-0.021, -0.012, -0.34, -0.001, 0.012, -0.1, STEEL), box(0.001, -0.012, -0.34, 0.021, 0.012, -0.1, STEEL)],
  // Rocket launcher: a fat tube with a red nose.
  [GRIP, box(-0.035, -0.035, -0.3, 0.035, 0.035, 0.28, GREEN), box(-0.04, -0.04, -0.34, 0.04, 0.04, -0.3, RED), box(-0.01, 0.035, -0.06, 0.01, 0.06, 0.0, DARK)],
  // A charge in the hand: the block, its cap and the light on it.
  [box(-0.045, -0.03, -0.1, 0.045, 0.03, 0.02, BRASS), box(-0.015, 0.03, -0.07, 0.015, 0.045, -0.04, DARK), box(-0.008, 0.045, -0.063, 0.008, 0.055, -0.047, RED)],
  // Gravity gun: a fork around a glowing core.
  [GRIP, box(-0.025, -0.025, -0.08, 0.025, 0.025, 0.14, STEEL), box(-0.05, -0.01, -0.26, -0.03, 0.01, -0.06, PALE), box(0.03, -0.01, -0.26, 0.05, 0.01, -0.06, PALE), box(-0.015, -0.015, -0.12, 0.015, 0.015, -0.09, GLOW)],
  // Cannon: short and wide.
  [GRIP, box(-0.055, -0.055, -0.26, 0.055, 0.055, 0.06, DARK), box(-0.065, -0.065, -0.3, 0.065, 0.065, -0.26, STEEL), box(-0.03, -0.03, 0.06, 0.03, 0.03, 0.12, STEEL)],
  // Spawner: an open frame with a crate in it.
  [GRIP, box(-0.05, -0.05, -0.16, 0.05, -0.04, -0.04, PALE), box(-0.05, 0.04, -0.16, 0.05, 0.05, -0.04, PALE), box(-0.025, -0.025, -0.125, 0.025, 0.025, -0.075, WOOD)],
  // Flamethrower: a tank under a thin lance with a brass nozzle.
  [GRIP, box(-0.03, -0.09, 0.0, 0.03, -0.02, 0.2, RED), box(-0.012, -0.012, -0.3, 0.012, 0.012, 0.16, STEEL), box(-0.018, -0.018, -0.34, 0.018, 0.018, -0.3, BRASS)],
];
// Empty hands and the hand without a tool: a mitt.
export const HAND_MODEL = [box(-0.035, -0.045, -0.02, 0.035, 0.01, 0.07, PALE), box(-0.03, -0.035, -0.07, 0.03, 0.005, -0.02, PALE)];
// Line and dot: ready to act, nothing in reach, and a shot that will land
// short of where the controller points (something stands between the
// player's body and that spot).
export const AIM_COLOURS = { ready: [1.0, 0.82, 0.35], idle: [0.75, 0.8, 0.86], blocked: [1.0, 0.3, 0.2] };
