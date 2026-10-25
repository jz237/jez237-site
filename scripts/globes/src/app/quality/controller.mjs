// Holds a phone's frames to 60 a second with the sharpest picture that fits: steps along the
// quality ladder (ladder.mjs) by what the GPU measurably spends on a frame - the sim's passes and
// three's render passes, timed with timestamp queries where the device has them, else the queue's
// own pace - against a sustained budget of 14.5 ms (a phone's GPU slows as it warms, 30-40% within
// a minute on the S25 Ultra: the margin under 16.7 is for that).
//
// - It predicts what each level would cost: the sim (measured), a fixed part (the mirror, the
//   backdrop, the output) and the bowl's traced pixels (its area on screen by the pixel ratio
//   squared, by what a ray costs at the level's knobs), the last two fitted to what it measures
//   (CostModel), so a level is chosen by what it will cost here, as the bowl is now framed (a zoom
//   in or a turn of the phone holds the traced pixels about the same).
// - Calibration: in the first frames the bowl is drawn (as it comes into view) it fits the model
//   and goes straight to the sharpest level predicted to fit; and in its first second at rest, up
//   to the sharpest predicted at 12 ms, if that is sharper (a try, as below: the model, fitted to a
//   bowl coming into view, can be wide of it at rest).
// - Over budget: straight down to the sharpest level predicted at 13 ms or under (one to three
//   rungs), then a dwell of 2 s. Slow frames with neither the GPU nor the main thread busy (the
//   compositor, another tab): a rung down after three windows, taken back if it bought nothing.
// - Up: one rung, once frames have held for a while (8 s, twice as long after each try that did
//   not hold, up to 64 s) and the rung is predicted at 12 ms or under; a try that does not hold is
//   taken back at once. The gap between 12 and 14.5 is wider than a rung's cost, so a phone that
//   warms settles a rung lower rather than going up and down.
// - While the bowl moves (dragged, rolling back, gliding, zoomed) the water and the march cost more
//   for a while: a rung down at once if the GPU goes over budget, put back 1.5 s after it stops.
//   Those frames teach nothing (the model, the holds, the tries up leave them out).
// - The main thread has its own ladder (CPU_RUNGS): when it is the limit, fewer pixels would not
//   help, so only that ladder moves.
// - 30 fps: frames at the lowest level slower than about 37 a second (27 ms apart) for three
//   windows are held to 30 a second (twice the budget, so it climbs again); back to 60 once the
//   lowest level at 60 is predicted to come every 25 ms or sooner on this screen (its refresh, as
//   FramePace sees it), for 20 s. Both by the frames' spacing, not the GPU's time: a late frame
//   lands on the screen's next refresh, so on a fast screen (120 Hz) 18-24 ms of GPU is 40 frames a
//   second, better than 30 held (and a frame that late takes a third substep, which would read as
//   the GPU's own slowness).
// - Thermal memory: the level held longest over the last two minutes (heldLongest), which the page
//   keeps for its next visit (record.mjs).
// (Pure: no DOM, no GPU. main.ts feeds it each frame and applies the knobs it returns.)

import { CPU_RUNGS, fixedCost, merge, simCost, tracedPx } from './ladder.mjs';

/** The GPU's sustained budget a frame at 60 fps (ms); a jump down lands at or under TARGET; a try
 *  up is made only at or under UP. (Twice each at 30 fps.) */
export const BUDGET_MS = 14.5;
export const TARGET_MS = 13;
export const UP_MS = 12;
/** Frames further apart than this (typical, ms) miss 60 (FramePace holds them to it). */
const SLOW_MS = 17.5;
/** Slow frames with the GPU busier than this are the GPU's doing. */
const BUSY_MS = 12.5;
/** The main thread is the limit past this (ms a frame), and has room again under CPU_FREE_MS. */
export const CPU_MS = 11;
const CPU_FREE_MS = 8;
const WINDOW_MS = 1000;
const MIN_FRAMES = 6;
/** Timed frames a window needs to be judged by them. */
const MIN_TIMED = 4;
/** After the start or a move: frames not counted (a new canvas's first frames; and the GPU's
 *  times arrive a few frames late, from frames drawn before it). */
const WARMUP_MS = 300;
const SETTLE_MS = 400;
/** Calibration ends once this many timed frames had the bowl at least CAL_SHOWN of the way into
 *  view, or after CAL_MAX_MS (no move then). */
const CAL_FRAMES = 6;
const CAL_SHOWN = 0.4;
const CAL_MAX_MS = 4000;
const DWELL_MS = 2000;
const RETRY_MS = 8000;
const RETRY_MAX_MS = 64000;
/** While the bowl moves: the GPU over budget for this long (its timed frames') takes a rung down
 *  at once, put back RESTORE_MS after the bowl is still. */
const RELIEF_MS = 250;
const RESTORE_MS = 1500;
const SLOW_WINDOWS = 3;
const FLOOR_WINDOWS = 3;
/** Frames further apart than this at the lowest level (typical, ms: under about 37 a second). */
const FLOOR_SLOW_MS = 27;
/** Back to 60 once the lowest level there is predicted to come this often or more (ms). */
const LEAVE_30_INTERVAL_MS = 25;
const LEAVE_30_MS = 20000;
/** Thermal memory: time held at a level counts for less the longer ago (half as much 80 s on: the
 *  last two minutes, about). */
const HELD_HALF_MS = 80000;
/** A gap this long (the page hidden) says nothing about the frame rate. */
const GAP_MS = 1000;
/** A step taken for slow frames must make them this much quicker to stay. */
const MIN_GAIN = 0.08;
/** The GPU's times arrive this many frames after the frame they time (the bowl's area then). */
const LAG = 2;

/** The mean of the lower nine tenths (a hitch or two does not count; frames paced by the display
 *  alternate between whole refreshes, which a middle value would read as all quick or all slow). */
export function typical(v) {
  const s = [...v].sort((a, b) => a - b);
  const kept = s.slice(0, Math.ceil(s.length * 0.9));
  return kept.reduce((a, b) => a + b, 0) / kept.length;
}

function middle(v) {
  return [...v].sort((a, b) => a - b)[v.length >> 1];
}

/** The drawing's cost (ms) as a fixed part (scaled by the level's fixedCost) plus a cost per
 *  traced pixel: fitted to the frames measured (least squares, the older ones counting less: a
 *  warming GPU drifts), the fixed part drawn towards the cost of so many traced pixels where the
 *  frames do not tell the two apart (all at one size). */
export class CostModel {
  /** ms, and ms per million traced pixels; null until fitted. */
  a = null;
  c = null;
  /** The lowest cost per pixel a window has found (the thermal note: how much slower a pixel is
   *  now than when the GPU was coolest). */
  coolest = null;
  points = [];

  /** fixedPx: the fixed part's cost in traced pixels' worth (millions), as a prior. */
  constructor(fixedPx) {
    this.fixedPx = fixedPx;
  }

  /** A measurement: the fixed part's scale (fixedCost), the traced pixels (millions), the ms. */
  add(f, x, y, weight = 1) {
    for (const p of this.points) p.w *= 0.9;
    this.points.push({ f, x, y, w: weight });
    this.points = this.points.filter((p) => p.w > 0.05).slice(-64);
  }

  fit() {
    const pts = this.points;
    if (!pts.length) return false;
    let sw = 0, sff = 0, sfx = 0, sxx = 0, sfy = 0, sxy = 0;
    for (const { f, x, y, w } of pts) {
      sw += w; sff += w * f * f; sfx += w * f * x; sxx += w * x * x; sfy += w * f * y; sxy += w * x * y;
    }
    // Least squares, with a prior: a = k c, as strong as two frames (it decides only what the
    // frames leave open).
    const k = this.fixedPx;
    const kappa = 2 * Math.max(sw / pts.length, 1);
    const m00 = sff + kappa, m01 = sfx - kappa * k, m11 = sxx + kappa * k * k;
    const det = m00 * m11 - m01 * m01;
    if (!(det > 0)) return false;
    let a = (sfy * m11 - m01 * sxy) / det;
    let c = (m00 * sxy - m01 * sfy) / det;
    if (!Number.isFinite(a) || !Number.isFinite(c)) return false;
    // (Neither negative: refit the other with it at 0.)
    if (c < 0) { c = 0; a = sfy / sff; }
    if (a < 0) { a = 0; c = sxx > 0 ? sxy / sxx : 0; }
    this.a = a;
    this.c = c;
    return true;
  }
}

export class QualityController {
  /** The GPU's level (an index into levels, 0 the sharpest) and the main thread's (into cpuRungs). */
  level;
  cpuLevel = 0;
  /** Held to 30 frames a second (the floor). */
  fps30 = false;
  /** The last measurements (for ?stats): ms a frame, null where unknown. */
  last = { gpu: null, sim: null, draw: null, cpu: null, interval: null, timed: false };
  /** The last move and why. */
  lastMove = null;

  /** levels: the ladder (buildLadder); level: where to start; now: the time (ms). */
  constructor(levels, { level = 0, now = 0, cpuRungs = CPU_RUNGS } = {}) {
    this.levels = levels;
    this.cpuRungs = cpuRungs;
    this.level = Math.min(Math.max(level, 0), levels.length - 1);
    // (The fixed part: the S25 Ultra's ~1 ms against its ~160 ms a million traced pixels. Without
    // timestamps, the queue's pace: the sim's ~6 ms too.)
    this.drawModel = new CostModel(0.006);
    this.totalModel = new CostModel(0.045);
    /** The sim's GPU time a frame at 60 fps (ms, smoothed), where timed. */
    this.sim60 = null;
    this.calibrating = true;
    this.calStart = now;
    this.skipUntil = now + WARMUP_MS;
    this.dwellUntil = 0;
    this.holdUntil = 0;
    this.holdMs = RETRY_MAX_MS;
    this.lastAt = -1;
    this.retryMs = RETRY_MS;
    this.cpuRetryMs = RETRY_MS;
    this.leave30Ms = LEAVE_30_MS;
    this.probing = false;
    this.probeFrom = 0;
    this.catchUp = false;
    this.cpuProbing = false;
    this.leaving30 = false;
    this.quickFor = 0;
    this.cpuQuickFor = 0;
    this.floor30For = 0;
    this.slowWindows = 0;
    this.floorWindows = 0;
    this.before = null;
    this.relief = null;
    this.movedAt = -Infinity;
    this.held = new Map();
    // (The screen's refresh, ms: frame() is told it.)
    this.refresh = 1000 / 60;
    this.area = 0;
    this.restArea = 0;
    this.xs = [];
    this.recent = [];
    this.clearWindow();
  }

  /** The knobs to draw with now. */
  get knobs() {
    return this.knobsAt(this.level);
  }

  knobsAt(level, fps30 = this.fps30) {
    const k = merge(this.levels[level], this.cpuRungs[this.cpuLevel]);
    return fps30 ? { ...k, fps: 30 } : k;
  }

  get lowest() {
    return this.levels.length - 1;
  }

  /** Whether it has measured enough to predict. */
  get trained() {
    return this.model.c !== null;
  }

  get model() {
    return this.timed ? this.drawModel : this.totalModel;
  }

  /** Timed by timestamps (else by the queue's pace). */
  get timed() {
    return this.sim60 !== null;
  }

  /** Frames a refresh at 60 a frame (1), or two at 30: the budget and the pace scale with it. */
  get pace() {
    return 60 / this.knobs.fps;
  }

  get budget() {
    return this.pace * BUDGET_MS;
  }

  /** What a level would cost the GPU a frame (ms), the bowl as large as it is or will be at rest
   *  in this view; null before anything is measured. */
  predict(level, fps30 = this.fps30) {
    const m = this.model;
    if (m.c === null) return null;
    const k = this.knobsAt(level, fps30);
    const area = Math.max(this.area, this.restArea);
    return (this.timed ? this.sim60 * simCost(k) : 0) + m.a * (this.timed ? fixedCost(k) : 1) + m.c * tracedPx(k, area);
  }

  /** What a level would cost, from what the current one measured (ms): the model's prediction
   *  scaled to it (a warming GPU, a cost the model has not caught up with). */
  expect(level, measured, fps30 = this.fps30) {
    const p = this.predict(level, fps30);
    const here = this.predict(this.level);
    return p === null || here === null || measured === null ? p : (p * measured) / here;
  }

  /** The sharpest level expected at or under ms (the lowest, if none). */
  best(ms, measured = null, fps30 = this.fps30) {
    for (let l = 0; l < this.levels.length; l++) {
      const p = this.expect(l, measured, fps30);
      if (p !== null && p <= ms) return l;
    }
    return this.lowest;
  }

  /** The level held longest over the last two minutes (and how long, ms, weighted), or null. */
  get heldLongest() {
    let best = null;
    for (const [key, ms] of this.held) {
      if (!best || ms > best.ms) best = { level: Number(key.split(':')[0]), fps30: key.endsWith(':30'), ms };
    }
    return best;
  }

  /** One frame, at `now` (ms): what it took the main thread (cpu, ms), the GPU's times of a frame
   *  if new ones came in since the last ({ sim, draw } ms) or else the queue's pace of one (queue,
   *  ms), the bowl's area on screen now and at rest in this view (CSS px^2), whether the bowl, its
   *  lid or the camera moved, the sim's substeps that frame, and the screen's refresh (ms). Returns
   *  the knobs when they change, else null.
   *  @param {number} now
   *  @param {{ cpu?: number | null, gpu?: { sim: number, draw: number } | null, queue?: number | null, area?: number, restArea?: number, moving?: boolean, substeps?: number, refresh?: number }} [sample] */
  frame(now, { cpu = null, gpu = null, queue = null, area = 0, restArea = 0, moving = false, substeps = 0, refresh = 1000 / 60 } = {}) {
    const dt = this.lastAt < 0 ? 0 : now - this.lastAt;
    this.lastAt = now;
    this.area = area;
    this.restArea = restArea;
    this.refresh = refresh;
    // (The bowl's traced pixels at each frame, to match the GPU's times, a few frames late.)
    this.xs.push(tracedPx(this.knobs, area));
    if (this.xs.length > LAG + 1) this.xs.shift();
    const x = this.xs[0];
    if (gpu) {
      // (The sim's work at 60, from the substeps it took: half of it by the frame, half by the
      // substep, two a frame at 60. A frame late takes three, and is not the GPU's slowness.)
      const sim60 = gpu.sim / (substeps > 0 ? 0.5 + 0.25 * substeps : simCost(this.knobs));
      this.sim60 = this.sim60 === null ? sim60 : 0.8 * this.sim60 + 0.2 * sim60;
      this.last = { ...this.last, gpu: gpu.sim + gpu.draw, sim: gpu.sim, draw: gpu.draw, timed: true };
    } else if (queue !== null && !this.timed) {
      this.last = { ...this.last, gpu: queue, timed: false };
    }
    if (moving) {
      this.movedAt = now;
      this.w.moved = true;
    }
    const settling = now < this.skipUntil;
    if (dt > GAP_MS) {
      this.clearWindow();
      return null;
    }

    // While it moves: a rung down at once if the GPU goes over budget, put back once it has been
    // still a while.
    const sample = gpu ? gpu.sim + gpu.draw : this.timed ? null : queue;
    if (!this.calibrating && !settling) {
      const relief = this.relieve(now, sample, moving);
      if (relief) return relief;
    }
    if (settling) return null;

    if (dt > 0) {
      this.w.intervals.push(dt);
      this.w.span += dt;
    }
    if (cpu !== null) this.w.cpu.push(cpu);
    if (sample !== null) {
      this.w.gpu.push(sample);
      if (gpu) this.w.draw.push(gpu.draw);
      this.w.x.push(x);
      // (Calibration fits every frame on its own: the bowl comes into view through it.)
      if (this.calibrating) {
        const k = this.knobs;
        if (gpu) this.drawModel.add(fixedCost(k), x, gpu.draw);
        else this.totalModel.add(1, x, queue);
        if (x >= CAL_SHOWN * tracedPx(k, restArea) && restArea > 0) this.w.shown++;
      }
    }
    if (this.calibrating) return this.calibrate(now);
    if (this.w.span < WINDOW_MS || this.w.intervals.length < MIN_FRAMES) return null;
    return this.judge(now);
  }

  /** Calibration's end: the sharpest level predicted to fit, from the model just fitted. */
  calibrate(now) {
    const done = this.w.shown >= CAL_FRAMES;
    if (!done && now - this.calStart < CAL_MAX_MS) return null;
    this.calibrating = false;
    this.clearWindow();
    if (!done || !this.model.fit()) return null;
    this.catchUp = true;
    this.dwellUntil = now + DWELL_MS;
    const to = this.best(this.pace * TARGET_MS);
    return to === this.level ? null : this.move(to, now, 'calibrated');
  }

  relieve(now, sample, moving) {
    if (sample !== null) {
      this.recent.push([now, sample]);
      while (this.recent.length && this.recent[0][0] < now - RELIEF_MS) this.recent.shift();
    }
    const still = now - this.movedAt >= RESTORE_MS;
    if (this.relief !== null) {
      if (!still) return null;
      const back = this.relief;
      this.relief = null;
      // (Unless it has been moved since, for its own reasons.)
      return this.level === back + 1 ? this.move(back, now, 'still again') : null;
    }
    if (!moving || this.level >= this.lowest || this.recent.length < MIN_TIMED) return null;
    const mean = this.recent.reduce((a, [, ms]) => a + ms, 0) / this.recent.length;
    if (mean <= this.budget) return null;
    this.relief = this.level;
    return this.move(this.level + 1, now, 'moving');
  }

  /** A window's end: its frames judged. */
  judge(now) {
    const w = this.w;
    this.clearWindow();
    const interval = typical(w.intervals);
    const cpu = w.cpu.length >= MIN_FRAMES ? middle(w.cpu) : null;
    const gpu = w.gpu.length >= MIN_TIMED ? typical(w.gpu) : null;
    this.last = { ...this.last, interval, cpu };
    // (Frames while it moved, or just after, teach nothing about the bowl at rest.)
    if (w.moved || now - this.movedAt < RESTORE_MS) return null;
    const catchUp = this.catchUp;
    this.catchUp = false;
    if (gpu !== null) {
      const k = this.knobs;
      const x = w.x.reduce((a, b) => a + b, 0) / w.x.length;
      // (A window's mean counts for a few frames.)
      if (this.timed) this.drawModel.add(fixedCost(k), x, typical(w.draw), 3);
      else this.totalModel.add(1, x, gpu, 3);
      const m = this.model;
      if (m.fit()) m.coolest = Math.min(m.coolest ?? m.c, m.c);
    }
    const fps30 = this.fps30;
    const pace = this.pace;
    const slow = interval > pace * SLOW_MS;
    const over = gpu !== null && (gpu > this.budget || (slow && gpu > pace * BUSY_MS));
    const cpuBound = cpu !== null && cpu > CPU_MS;

    // A try up that did not hold: back at once, and the next try waits twice as long.
    if (this.probing) {
      this.probing = false;
      if (over || (gpu === null && slow)) {
        this.retryMs = Math.min(2 * this.retryMs, RETRY_MAX_MS);
        return this.move(this.probeFrom, now, 'try failed');
      }
      this.retryMs = RETRY_MS;
    }
    if (this.leaving30) {
      this.leaving30 = false;
      if (interval > FLOOR_SLOW_MS) {
        this.leave30Ms = Math.min(2 * this.leave30Ms, 8 * LEAVE_30_MS);
        return this.to30(now, 'back to 30 fps');
      }
      this.leave30Ms = LEAVE_30_MS;
    }
    if (this.cpuProbing) {
      this.cpuProbing = false;
      if (cpuBound && slow) {
        this.cpuRetryMs = Math.min(2 * this.cpuRetryMs, RETRY_MAX_MS);
        return this.moveCpu(this.cpuLevel + 1, now);
      }
      this.cpuRetryMs = RETRY_MS;
    }

    // The main thread is the limit: fewer pixels cannot help.
    if (cpuBound) {
      this.quickFor = 0;
      this.cpuQuickFor = 0;
      if (slow && now >= this.dwellUntil && this.cpuLevel < this.cpuRungs.length - 1) return this.moveCpu(this.cpuLevel + 1, now);
      return null;
    }
    if (cpu !== null && cpu < CPU_FREE_MS && this.cpuLevel > 0 && !slow) {
      this.cpuQuickFor += w.span;
      if (this.cpuQuickFor >= this.cpuRetryMs) {
        this.cpuProbing = true;
        return this.moveCpu(this.cpuLevel - 1, now);
      }
    }

    // A step down for slow frames that the GPU and main thread did not explain: kept only if it
    // made them quicker.
    if (this.before !== null) {
      const before = this.before;
      this.before = null;
      if (interval > before * (1 - MIN_GAIN)) {
        this.holdUntil = now + this.holdMs;
        this.holdMs = Math.min(2 * this.holdMs, 8 * RETRY_MAX_MS);
        return this.move(this.level - 1, now, 'bought nothing');
      }
    }

    if (over || (gpu === null && slow)) {
      this.quickFor = 0;
      this.slowWindows = 0;
      if (now < this.dwellUntil) return null;
      if (this.level >= this.lowest) {
        // The lowest level (held there, for the thermal memory), and frames that cannot come near
        // 60: 30 frames a second.
        this.hold(w.span);
        this.floorWindows = interval > FLOOR_SLOW_MS ? this.floorWindows + 1 : 0;
        if (!fps30 && this.floorWindows >= FLOOR_WINDOWS) return this.to30(now, 'lowest level too slow', gpu);
        return null;
      }
      this.floorWindows = 0;
      // (Straight to the level predicted to fit, one to three rungs; unpredicted, by how slow.)
      const by = this.trained ? this.best(pace * TARGET_MS, gpu) - this.level : gpu === null ? (interval > 2 * SLOW_MS ? 3 : interval > 1.4 * SLOW_MS ? 2 : 1) : 1;
      this.dwellUntil = now + DWELL_MS;
      return this.move(Math.min(this.level + Math.min(Math.max(by, 1), 3), this.lowest), now, gpu === null ? 'slow frames' : 'gpu over budget');
    }
    this.floorWindows = 0;
    if (slow) {
      // Neither the GPU nor the main thread: the compositor, another tab? A rung, after a while.
      this.quickFor = 0;
      if (++this.slowWindows >= SLOW_WINDOWS && now >= this.holdUntil && this.level < this.lowest) {
        this.slowWindows = 0;
        this.before = interval;
        return this.move(this.level + 1, now, 'slow, not the gpu');
      }
      return null;
    }
    this.slowWindows = 0;

    // Held: kept in mind (thermal memory), and a try up once it has held long enough.
    this.hold(w.span);
    this.quickFor += w.span;
    if (fps30) {
      // (Back to 60 once its lowest level is predicted to come often enough there, for a while.)
      const p = this.expect(this.lowest, gpu, false);
      this.floor30For = p !== null && this.spacing(p) <= LEAVE_30_INTERVAL_MS ? this.floor30For + w.span : 0;
      if (this.floor30For >= this.leave30Ms) {
        const to = this.best(TARGET_MS, gpu, false);
        this.floor30For = 0;
        this.fps30 = false;
        this.leaving30 = true;
        return this.move(to, now, 'back to 60 fps', true);
      }
    }
    if (catchUp && gpu !== null) {
      const to = this.best(pace * UP_MS, gpu);
      if (to < this.level) return this.probe(to, now, 'calibrated at rest');
    }
    if (this.level === 0 || this.quickFor < this.retryMs || now < this.dwellUntil) return null;
    const p = this.expect(this.level - 1, gpu);
    if (p !== null && p > pace * UP_MS) return null;
    return this.probe(this.level - 1, now, 'trying sharper');
  }

  /** How far apart frames of `gpu` ms come at 60 on this screen (ms): a late one lands on its next
   *  refresh. */
  spacing(gpu) {
    const r = this.refresh;
    return Math.max(1000 / 60, Math.ceil(gpu / r - 1e-9) * r);
  }

  /** A try up, to `level`: back where it was at once if it does not hold. */
  probe(level, now, why) {
    this.probing = true;
    this.probeFrom = this.level;
    return this.move(level, now, why);
  }

  to30(now, why, measured = null) {
    const to = this.trained ? this.best(2 * TARGET_MS, measured, true) : this.level;
    this.fps30 = true;
    this.floorWindows = 0;
    this.floor30For = 0;
    this.dwellUntil = now + DWELL_MS;
    return this.move(to, now, why, true);
  }

  hold(span) {
    const decay = 0.5 ** (span / HELD_HALF_MS);
    for (const [key, ms] of this.held) this.held.set(key, ms * decay);
    const mine = `${this.level}:${this.fps30 ? 30 : 60}`;
    this.held.set(mine, (this.held.get(mine) ?? 0) + span);
  }

  move(level, now, why, force = false) {
    if (level === this.level && !force) return null;
    this.level = level;
    this.quickFor = 0;
    this.skipUntil = now + SETTLE_MS;
    this.recent = [];
    this.xs = [];
    this.clearWindow();
    this.lastMove = { why, at: now };
    return this.knobs;
  }

  moveCpu(level, now) {
    this.cpuLevel = level;
    this.cpuQuickFor = 0;
    this.skipUntil = now + SETTLE_MS;
    this.dwellUntil = now + DWELL_MS;
    this.clearWindow();
    this.lastMove = { why: 'main thread', at: now };
    return this.knobs;
  }

  /** The view changed (the phone turned; the bowl's area on screen now and at rest, CSS px^2):
   *  measured afresh from `level` (null: where the model predicts, if it can).
   *  @param {number} now
   *  @param {number | null} [level]
   *  @param {{ area: number, restArea: number } | null} [view] */
  restart(now, level = null, view = null) {
    if (view) {
      this.area = view.area;
      this.restArea = view.restArea;
    }
    this.relief = null;
    this.probing = false;
    this.before = null;
    this.lastAt = -1;
    // (What it held the other way is kept for that way, by the page: record.keep.)
    this.held.clear();
    const to = level ?? (this.trained ? this.best(this.pace * TARGET_MS) : this.level);
    this.level = Math.min(Math.max(to, 0), this.lowest);
    this.skipUntil = now + SETTLE_MS;
    this.recent = [];
    this.xs = [];
    this.clearWindow();
    return this.knobs;
  }

  clearWindow() {
    this.w = { intervals: [], cpu: [], gpu: [], draw: [], x: [], span: 0, moved: false, shown: 0 };
  }

  /** For ?stats: lines of 52 characters at most. */
  describe(now) {
    const k = this.knobs;
    const f1 = (v) => (v === null || v === undefined ? '-' : v.toFixed(1));
    const l = this.last;
    const lines = [`quality ${this.level}/${this.lowest}${this.cpuLevel ? ` · cpu ${this.cpuLevel}` : ''} · ratio ${k.ratio.toFixed(2)} · ${k.fps} fps`];
    lines.push(`  mirror 1/${k.mirrorEvery} · plants 1/${k.plantEvery} · march ${k.march}`);
    const gpu = l.timed ? `gpu ${f1(l.gpu)} ms (sim ${f1(l.sim)} + draw ${f1(l.draw)})` : `gpu ~${f1(l.gpu)} ms (queue)`;
    lines.push(`  ${gpu} · budget ${f1(this.budget)}`);
    const up = this.level > 0 ? this.predict(this.level - 1) : null;
    lines.push(`  pred ${f1(this.predict(this.level))}${up !== null ? ` · up ${f1(up)}` : ''} · cpu ${f1(l.cpu)} · frames ${f1(l.interval)}`);
    const held = this.heldLongest;
    const m = this.model;
    const warm = m.c !== null && m.coolest ? m.c / m.coolest - 1 : null;
    // (Thermal: how much more a pixel costs now than when the GPU was coolest.)
    lines.push(`  held longest ${held ? `${held.level}${held.fps30 ? '@30' : ''} (${(held.ms / 60000).toFixed(1)} min)` : '-'}${warm !== null && warm >= 0.1 ? ` · warm: px +${Math.round(warm * 100)}%` : ''}`);
    if (this.calibrating) lines.push('  calibrating, as the bowl comes into view');
    else if (this.lastMove) lines.push(`  last move: ${this.lastMove.why}, ${((now - this.lastMove.at) / 1000).toFixed(0)} s ago`);
    if (this.fps30) lines.push('  30 fps: the GPU cannot hold 60 at the lowest level');
    return lines;
  }
}
