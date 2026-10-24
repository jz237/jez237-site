// Keeps the picture quick: when frames come slower than a pointer can be followed, the canvas is
// drawn with fewer pixels (each step 0.8x as sharp, down to a floor), and, once frames have been
// quick for a while, sharpness is offered back a step at a time. A step that does not hold is
// taken back and not tried again for twice as long; a step that did not speed frames up (the
// screen itself is the limit, not the drawing) is taken back too.

/** Each step's sharpness, relative to the one above it. */
export const STEP = 0.8;
export const MAX_LEVEL = 5;
/** The lowest pixel ratio (canvas pixels per CSS pixel) worth drawing at. */
export const FLOOR_RATIO = 0.6;

export const SLOW_MS = 22;
export const QUICK_MS = 18.5;
/** A step must make frames at least this much quicker (fraction of the time they took) to stay. */
export const MIN_GAIN = 0.08;
const WINDOW_MS = 1000;
const MIN_FRAMES = 6;
const WARMUP_MS = 2500;
const SETTLE_MS = 400;
const RETRY_MS = 8000;
const RETRY_MAX_MS = 64000;
/** A gap this long (the page hidden, the debugger) says nothing about the frame rate. */
const GAP_MS = 1000;

/** The pixel ratio to draw at: `base` (the screen's own, up to 2) at `level` steps down. */
export function ratioAt(base, level) {
  return Math.max(base * STEP ** level, Math.min(base, FLOOR_RATIO));
}

export class AdaptiveScale {
  /** Steps down from the sharpest (0). */
  level = 0;

  constructor(start = 0) {
    this.warmUntil = start + WARMUP_MS;
    this.skipUntil = 0;
    this.holdUntil = 0;
    this.lastAt = -1;
    this.samples = [];
    this.span = 0;
    this.quickFor = 0;
    this.retryMs = RETRY_MS;
    this.probing = false;
    this.before = null;
    this.stepped = 0;
  }

  /** Call once per frame with the time (ms). Returns the new level when it changes, else null. */
  frame(now) {
    const dt = this.lastAt < 0 ? 0 : now - this.lastAt;
    this.lastAt = now;
    if (now < this.warmUntil || now < this.skipUntil || dt <= 0) return null;
    if (dt > GAP_MS) {
      this.samples.length = 0;
      this.span = 0;
      return null;
    }
    this.samples.push(dt);
    this.span += dt;
    if (this.span < WINDOW_MS || this.samples.length < MIN_FRAMES) return null;

    // (The mean without the slowest tenth: frames paced by the display alternate between whole
    // refreshes, which the middle frame alone would read as all quick or all slow; a hitch or two
    // does not count.)
    const sorted = this.samples.sort((a, b) => a - b);
    const kept = sorted.slice(0, Math.ceil(sorted.length * 0.9));
    const typical = kept.reduce((a, b) => a + b, 0) / kept.length;
    const span = this.span;
    this.samples = [];
    this.span = 0;

    if (typical > SLOW_MS) {
      this.quickFor = 0;
      if (this.probing) {
        // (The sharper picture did not hold: back, and wait longer before trying again.)
        this.probing = false;
        this.retryMs = Math.min(this.retryMs * 2, RETRY_MAX_MS);
        return this.move(1, now);
      }
      if (this.before !== null && typical > this.before * (1 - MIN_GAIN)) {
        // (The last step bought nothing: the frames are held up elsewhere. Take it back.)
        this.before = null;
        this.holdUntil = now + RETRY_MAX_MS;
        return this.move(-this.stepped, now);
      }
      if (now < this.holdUntil || this.level >= MAX_LEVEL) return null;
      this.before = typical;
      // (Frames cost about what their pixels do, so a long way to go is gone in bigger steps.)
      this.stepped = Math.min(typical > 2 * SLOW_MS ? 3 : typical > 1.4 * SLOW_MS ? 2 : 1, MAX_LEVEL - this.level);
      return this.move(this.stepped, now);
    }

    this.before = null;
    if (typical < QUICK_MS) {
      if (this.probing) {
        this.probing = false;
        this.retryMs = RETRY_MS;
      }
      if (this.level === 0) return null;
      this.quickFor += span;
      if (this.quickFor >= this.retryMs) {
        this.probing = true;
        return this.move(-1, now);
      }
    }
    return null;
  }

  move(by, now) {
    this.level += by;
    this.quickFor = 0;
    this.skipUntil = now + SETTLE_MS;
    return this.level;
  }

  /** The stage changed shape or the globe changed: measure afresh. */
  restart(now) {
    this.warmUntil = now + SETTLE_MS;
    this.samples = [];
    this.span = 0;
    this.lastAt = -1;
    this.before = null;
  }
}
