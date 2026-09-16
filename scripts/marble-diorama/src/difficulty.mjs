// Remake presets. Level zero preserves the measured reference clock; effects
// at levels 1–7 are provisional until original difficulty traces are available.
export const difficultyPreset = (level = 0) => {
  const n = Math.max(0, Math.min(7, Math.trunc(Number(level)) || 0));
  return {
    level: n,
    clockRate: 1 + n * 0.035,
    enemySpeed: 1 + n * 0.12,
    machineSpeed: 1 + n * 0.055,
    force: 1 + n * 0.06,
  };
};
