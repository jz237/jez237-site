// Authored eight-pose standing normals. Frame selection never changes combat timing.
export const PAINTED_FLOW_BANK = "painted-flow";
export const PAINTED_FLOW_FIGHTERS = ["jez", "benny"];
export function paintedFlowPose(fighter) {
  const a = fighter.attacking;
  if (!PAINTED_FLOW_FIGHTERS.includes(fighter.def?.id) || !a || !fighter.grounded
    || fighter.crouch || a.cancelProfileId?.startsWith("crouch")
    || !["light", "heavy"].includes(a.kind) || a.superMove || a.animation
    || fighter.hitstunFrames > 0 || fighter.grabbed || fighter.cinematicFrame != null) return null;
  const frame = fighter.attackFrame;
  const start = a.activeStartFrame, end = a.activeEndFrame;
  if (![frame, start, end].every(Number.isFinite)) return null;
  const total = a.totalFrames || Math.round(a.duration * 60);
  const kick = a.limb === "kick";
  // Jez's full punch is authored at cell 3; cell 4 is its bent-elbow recoil.
  const startup = kick ? [8, 9, 10, 11] : [0, 1, 2, fighter.def.id === "jez" ? 2 : 3];
  const active = kick ? 12 : fighter.def.id === "jez" ? 3 : 4;
  const recovery = kick ? [13, 14, 15] : fighter.def.id === "jez" ? [4, 5, 7] : [5, 6, 7];
  const cell = frame < start ? startup[Math.min(3, Math.floor(Math.max(0, frame - 1) / Math.max(1, start - 1) * 4))]
    : frame < end ? active
    : recovery[Math.min(2, Math.floor((frame - end) / Math.max(1, total - end) * 3))];
  return { bank: PAINTED_FLOW_BANK, frame: cell };
}
