/** Idle pacing never changes geometry, image resolution or the user's quality setting. */
export function frameDelay({ saving, moving, live, streets, loading, now, lastInteraction }) {
  if (!saving || moving || loading || now - lastInteraction < 2000) return 0;
  return live || streets ? 50 : 500;
}

/** Pace moving scenes against display timestamps; sleep only when the scene is stationary. */
export function createFrameScheduler({ render, canRender = () => true,
  requestFrame = callback => requestAnimationFrame(callback),
  cancelFrame = ticket => cancelAnimationFrame(ticket),
  setTimer = (callback, delay) => setTimeout(callback, delay), clearTimer = ticket => clearTimeout(ticket),
  now = () => performance.now() }) {
  let frame, timer, due = 0, lastFrame;

  function onFrame(timestamp) {
    frame = undefined;
    if (!canRender()) return;
    // Allow sub-millisecond display-clock rounding at 60/120 Hz. Skipped frames
    // do no scene work. A late frame starts a fresh interval, without catch-up bursts.
    if (timestamp + 0.5 < due) {
      frame = requestFrame(onFrame);
      return;
    }
    lastFrame = timestamp;
    due = 0;
    render(timestamp);
  }

  return {
    request(interval = 0) {
      if (!canRender()) return;
      if (timer !== undefined) clearTimer(timer);
      timer = undefined;
      due = interval > 0 && lastFrame !== undefined ? lastFrame + interval : 0;
      // Input wakes share an outstanding frame and remove its deadline.
      if (frame !== undefined) return;
      const wait = due - now();
      if (interval >= 100 && wait > 0) {
        timer = setTimer(() => {
          timer = undefined;
          if (canRender()) frame = requestFrame(onFrame);
        }, wait);
      } else frame = requestFrame(onFrame);
    },
    cancel() {
      if (frame !== undefined) cancelFrame(frame);
      if (timer !== undefined) clearTimer(timer);
      frame = undefined; timer = undefined; lastFrame = undefined; due = 0;
    },
  };
}
