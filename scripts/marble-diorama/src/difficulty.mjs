// The Amiga selector changes course allocations. Former speed multipliers were
// unreferenced remake guesses. See DIFFICULTY-REFERENCE.md.
export const normalizeDifficulty = (level = 0) =>
  Math.max(0, Math.min(7, Math.trunc(Number(level)) || 0));

export const difficultyPreset = (level = 0) => {
  return {
    level: normalizeDifficulty(level),
    clockRate: 1,
    enemySpeed: 1,
    machineSpeed: 1,
    force: 1,
  };
};
