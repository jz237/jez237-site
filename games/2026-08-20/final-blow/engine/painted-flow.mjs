import {recoveryProgress} from "./combat-presentation.mjs";
// Authored eight-pose standing normals. Frame selection never changes combat timing.
export const PAINTED_FLOW_BANK = "painted-flow";
export const PAINTED_FLOW_FIGHTERS = ["jez", "benny", "alan", "ali", "commissioner", "cyraxx", "deathblow", "devil", "donald", "post"];
export function paintedFlowPose(fighter) {
  const a = fighter.attacking;
  if (!PAINTED_FLOW_FIGHTERS.includes(fighter.def?.id) || !a || !fighter.grounded
    || fighter.crouch || a.cancelProfileId?.startsWith("crouch") || a.cancelProfileId?.startsWith("air")
    || !["light", "heavy"].includes(a.kind) || a.superMove || a.animation
    || fighter.hitstunFrames > 0 || fighter.blockstunFrames > 0 || fighter.wakeupFrames > 0
    || fighter.down || fighter.dizzyFrames > 0 || fighter.grabbing || fighter.grabbed || fighter.cinematicFrame != null) return null;
  const frame = fighter.attackFrame;
  const start = a.activeStartFrame, end = a.activeEndFrame;
  if (![frame, start, end].every(Number.isFinite)) return null;
  const total = a.totalFrames || Math.round(a.duration * 60);
  const kick = a.limb === "kick";
  const startup = kick ? [8, 9, 10, 11] : [0, 1, 2, 3];
  const active = kick ? 12 : 4;
  const recovery = kick ? [13, 14, 15] : [5, 6, 7];
  const cell = frame < start ? startup[Math.min(3, Math.floor(Math.max(0, frame - 1) / Math.max(1, start - 1) * 4))]
    : frame < end ? active
    : recovery[Math.min(2, Math.floor(recoveryProgress(fighter,(frame - end) / Math.max(1, total - end)) * 3))];
  return { bank: PAINTED_FLOW_BANK, frame: cell };
}

export const PAINTED_FLOW_SCALE = Object.freeze({"jez": 1.074254, "benny": 1.021576, "alan": 1.188088, "ali": 1.135539, "commissioner": 1.07417, "cyraxx": 1.072464, "deathblow": 1.174745, "devil": 1.445695, "donald": 1.093067, "post": 1.01087});
