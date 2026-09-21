import { acidPositionAt } from "./acid.mjs";

// Amiga recording 287.32-289.84s: solid-color reaction, sinking/dissolving,
// brief absence, then scattered return and reassembly. Approximate timings;
// the original sprite program and exact fragment paths have not been recovered.
export const ACID_RECOVERY_TICKS = 300;
export const ACID_RECOVERY_SECONDS = ACID_RECOVERY_TICKS / 120;
export function acidCapturePose(capture, zone, seconds, machineSpeed = 1) {
  const age = seconds - capture.tick / 120;
  const pool = acidPositionAt(zone, seconds * machineSpeed);
  const offset = capture.offset;
  return {
    age,
    visible: age >= 0 && age < 1,
    flash: age >= 0 && age < 0.2,
    dissolved: Math.max(0, Math.min(1, (age - 0.2) / 0.8)),
    position: { x: pool.x + offset.x, y: pool.y + 0.125, z: pool.z + offset.z },
  };
}
export function acidReturnPose(capture, seconds, i) {
  const age = seconds - capture.tick / 120;
  if (age < 1.2 || age >= ACID_RECOVERY_SECONDS) return { visible: false };
  const u = (age - 1.2) / (ACID_RECOVERY_SECONDS - 1.2);
  const ease = u * u * (3 - 2 * u),
    remaining = 1 - ease;
  const a = i * 2.399963;
  return {
    visible: true,
    position: {
      x: capture.destination.x + Math.cos(a) * 2.4 * remaining,
      y:
        capture.destination.y +
        (1.6 + (i % 3) * 0.45) * Math.sin(Math.PI * (0.22 + 0.78 * u)),
      z: capture.destination.z + Math.sin(a) * 2.4 * remaining,
    },
    scale: Math.min(1, u * 8),
    rotation: [remaining * (i + 4), remaining * (i * 0.4 + 3), remaining * 2],
  };
}
