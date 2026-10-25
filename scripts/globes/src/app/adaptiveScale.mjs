// Keeps the picture quick: when frames come slower than a pointer can be followed, the canvas is
// drawn with fewer pixels (each step 0.8x as sharp, down to a floor), and, once frames have been
// quick for a while, sharpness is offered back a step at a time. A step that does not hold is
// taken back and not tried again for twice as long; a step that did not speed frames up (the
// screen itself is the limit, not the drawing) is taken back too.
//
// Phones (PHONE) are held to 60 frames a second (app/framePace.mjs), so their frames are slow
// past a sixtieth of a second, and their steps are finer (0.9x), from as sharp as the screen
// (up to 2 canvas pixels a CSS pixel) through 1 down to the same floor. There the page also says
// what each frame took the main thread (work): where that alone is about a sixtieth or more,
// fewer pixels could not bring frames to 60, and no step down is taken (unless frames come far
// slower still: the drawing holds them up as well). (The GPU's part cannot be told the same way:
// the page hears that the GPU is done only once the main thread is free, often a frame or two
// late. Sharpness is offered back by the frames' pace alone, as on desktops.)

import { FRAME_MS } from './framePace.mjs';

/** Each step's sharpness, relative to the one above it (desktops'). */
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

/** How a kind of device steps: each step's sharpness relative to the one above (step), how many
 *  steps at most (maxLevel), when frames are slow and when quick (ms apart), and a ratio every
 *  screen sharper than it passes through (anchor). */
export const DESKTOP = { step: STEP, maxLevel: MAX_LEVEL, slowMs: SLOW_MS, quickMs: QUICK_MS, anchor: 0 };
export const PHONE = { step: 0.9, maxLevel: 20, slowMs: 17.5, quickMs: 17.2, anchor: 1 };

/** The pixel ratio to draw at: `base` (the screen's own, up to 2) at `level` steps down. */
export function ratioAt(base, level, tier = DESKTOP) {
  // (From the screen's own, the steps of a tier with an anchor fall on it: the first is short.)
  const top = tier.anchor > 0 ? tier.anchor / tier.step ** Math.ceil(Math.log(base / tier.anchor) / -Math.log(tier.step) - 1e-9) : base;
  return Math.max(Math.min(base, top * tier.step ** level), Math.min(base, FLOOR_RATIO));
}

/** The first level at `ratio` or below. */
export function levelAt(base, ratio, tier = DESKTOP) {
  let level = 0;
  while (level < tier.maxLevel && ratioAt(base, level, tier) > ratio + 1e-9) level++;
  return level;
}

/** The lowest level worth stepping to: the first at the floor (the ones past it are no less
 *  sharp), or the tier's last. */
export function lowestLevel(base, tier = DESKTOP) {
  return levelAt(base, Math.min(base, FLOOR_RATIO), tier);
}

/** Phones' memory of the level frames last held at, for each way the phone is held (`way`), here
 *  or on the last visit: a view starts there (from the sharpest, its first seconds would crawl),
 *  but never blurrier than at `start`, where it would start without it (a slow spell once is
 *  not kept for good). null where none is kept, or none can be. */
const HELD_KEY = 'globes.sharpness.';
export function keptLevel(way, start) {
  try {
    const level = Number(localStorage.getItem(HELD_KEY + way) ?? NaN);
    return Number.isInteger(level) && level >= 0 ? Math.min(level, start) : null;
  } catch {
    return null;
  }
}
export function keepLevel(way, level) {
  try {
    localStorage.setItem(HELD_KEY + way, String(level));
  } catch {
    // (Nowhere to keep it: the next visit starts afresh.)
  }
}

/** The mean of the quicker nine tenths of some times (ms): frames paced by the display alternate
 *  between whole refreshes, which the middle frame alone would read as all quick or all slow; a
 *  hitch or two does not count. */
function typicalOf(times) {
  const sorted = times.sort((a, b) => a - b);
  const kept = sorted.slice(0, Math.ceil(sorted.length * 0.9));
  return kept.reduce((a, b) => a + b, 0) / kept.length;
}

/** The middle of some times (ms). */
function middleOf(times) {
  return times.sort((a, b) => a - b)[times.length >> 1];
}

export class AdaptiveScale {
  /** Steps down from the sharpest (0). */
  level = 0;
  /** The last level frames held at (quick), or null. */
  held = null;

  /** start: the time (ms). tier: how it steps (DESKTOP, PHONE); level: the one to start at;
   *  lowest: the last one it steps down to. */
  constructor(start = 0, { tier = DESKTOP, level = 0, lowest = tier.maxLevel } = {}) {
    this.tier = tier;
    this.level = level;
    this.lowest = lowest;
    this.warmUntil = start + WARMUP_MS;
    this.skipUntil = 0;
    this.holdUntil = 0;
    this.lastAt = -1;
    this.samples = [];
    this.span = 0;
    this.cpu = [];
    this.quickFor = 0;
    this.retryMs = RETRY_MS;
    this.probing = false;
    this.before = null;
    this.stepped = 0;
  }

  /** What a frame took the main thread (ms), where the page tells it (the middle of a second's
   *  frames is taken). */
  work(cpuMs) {
    this.cpu.push(cpuMs);
  }

  /** Call once per frame with the time (ms). Returns the new level when it changes, else null. */
  frame(now) {
    const dt = this.lastAt < 0 ? 0 : now - this.lastAt;
    this.lastAt = now;
    if (now < this.warmUntil || now < this.skipUntil || dt <= 0) {
      this.cpu.length = 0;
      return null;
    }
    if (dt > GAP_MS) {
      this.samples.length = 0;
      this.span = 0;
      return null;
    }
    this.samples.push(dt);
    this.span += dt;
    if (this.span < WINDOW_MS || this.samples.length < MIN_FRAMES) return null;

    const t = this.tier;
    const typical = typicalOf(this.samples);
    const span = this.span;
    this.samples = [];
    this.span = 0;
    // (The main thread's time on a frame, where the page says.)
    const cpu = this.cpu.length >= MIN_FRAMES ? middleOf(this.cpu) : null;
    this.cpu.length = 0;

    if (typical > t.slowMs) {
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
      if (now < this.holdUntil || this.level >= this.lowest) return null;
      // (Where the main thread alone takes about a sixtieth or more, fewer pixels could not bring
      // frames to 60: no step, unless frames come far slower than it holds them to, more than a
      // sixtieth and a half past its time, the drawing holding them up as well.)
      if (cpu !== null && cpu >= FRAME_MS * (1 - MIN_GAIN) && typical < cpu + 1.5 * FRAME_MS) return null;
      this.before = typical;
      // (Frames cost about what their pixels do, so a long way to go is gone in bigger steps.)
      this.stepped = Math.min(typical > 2 * t.slowMs ? 3 : typical > 1.4 * t.slowMs ? 2 : 1, this.lowest - this.level);
      return this.move(this.stepped, now);
    }

    this.before = null;
    if (typical < t.quickMs) {
      if (this.probing) {
        this.probing = false;
        this.retryMs = RETRY_MS;
      }
      this.held = this.level;
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

  /** The stage changed shape or the globe changed: measure afresh (from `level`, if given). */
  restart(now, level = this.level) {
    this.level = level;
    this.held = null;
    this.warmUntil = now + SETTLE_MS;
    this.samples = [];
    this.span = 0;
    this.cpu.length = 0;
    this.lastAt = -1;
    this.before = null;
    this.probing = false;
  }
}
