// Hysteresis prevents a loading hitch from permanently reducing quality, or
// alternating between presets on every measurement window.
const levels = ['low', 'medium', 'high'];
export function adaptiveQuality(memory, quality, fps, seconds = 2) {
  if (!Number.isFinite(fps) || fps <= 0) return quality;
  memory.elapsed = (memory.elapsed || 0) + seconds;
  memory.cooldown = Math.max(0, (memory.cooldown || 0) - seconds);
  if (memory.elapsed < 4) return quality;
  memory.slow = fps < 46 ? (memory.slow || 0) + 1 : 0;
  memory.fast = fps >= 58 ? (memory.fast || 0) + seconds : 0;
  const index = levels.indexOf(quality);
  if (index > 0 && (fps < 26 || memory.slow >= 2)) {
    memory.slow = memory.fast = 0; memory.cooldown = 30;
    return levels[index - 1];
  }
  if (index < 2 && memory.fast >= 12 && !memory.cooldown) {
    memory.fast = memory.slow = 0; memory.cooldown = 30;
    return levels[index + 1];
  }
  return quality;
}
