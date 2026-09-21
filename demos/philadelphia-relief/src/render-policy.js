/** Idle pacing never changes geometry, image resolution or the user's quality setting. */
export function frameDelay({ saving, moving, live, loading, now, lastInteraction }) {
  if (!saving || moving || loading || now - lastInteraction < 2000) return 0;
  return live ? 50 : 500;
}
