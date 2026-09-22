// Recovered marbdat +0x0c sequence: 32 frames, two source updates per frame.
// These stage numbers describe repeated graphics, not copied bitmap assets.
export const STEELIE_BREAK_STAGES = Object.freeze([
  0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 9,
  9, -1, -1, -1, -1, -1,
]);

export function steelieBreakPose(capture, sourceTime, index) {
  const age = sourceTime - capture.sourceTick;
  const frame = Math.floor(age / 2),
    stage = STEELIE_BREAK_STAGES[frame];
  if (age < 0 || stage === undefined || stage < 0) return { visible: false };
  const angle = (((index % 4) + 0.5) * Math.PI) / 2;
  const direction = {
    x: Math.cos(angle),
    y: index < 4 ? 1 : -1,
    z: Math.sin(angle),
  };
  const burst = Math.max(0, (age - 18) / 36);
  const crack = Math.min(5, stage) * 0.025 * capture.radius;
  const distance = crack + capture.radius * 2.4 * Math.sqrt(burst);
  const rise =
    capture.radius *
    (index < 4 ? 2.6 : 1.4) *
    Math.sin(Math.PI * Math.min(1, burst * 1.3));
  return {
    visible: true,
    position: {
      x: direction.x * distance,
      y:
        age < 18
          ? direction.y * crack
          : Math.max(-capture.radius * 0.5, rise - capture.radius * burst),
      z: direction.z * distance,
    },
    scale:
      (capture.radius / 0.55) * (1 - 0.8 * Math.max(0, (burst - 0.7) / 0.3)),
    spin: burst * (index % 2 ? 1 : -1) * 2.5,
    stage,
  };
}

// Original second sprite sequence begins at source update 18 and is blank
// from update 62. Newly drawn 3D chips use that envelope, with authored paths.
export function steelieChipPose(capture, sourceTime, index) {
  const age = sourceTime - capture.sourceTick;
  if (age < 18 || age >= 62) return { visible: false };
  const u = (age - 18) / 44,
    a = index * 2.399963,
    r = capture.radius;
  const distance = r * (0.15 + 2.2 * u) * (1 + (index % 4) * 0.08);
  return {
    visible: true,
    position: {
      x: Math.cos(a) * distance,
      y: r * (0.15 + (1.2 + (index % 5) * 0.3) * Math.sin(Math.PI * u)),
      z: Math.sin(a) * distance,
    },
    scale: r * 0.12 * (1 - u),
  };
}
