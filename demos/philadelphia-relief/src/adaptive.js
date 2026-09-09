/**
 * Sustained-frame-rate quality adaptation — the pure half.
 *
 * The controller watches frame times and steps the *effective* quality level
 * down when the frame rate stays below a floor for a while, and back up when
 * it stays comfortably above a ceiling for longer. It is deliberately slow and
 * hysteretic: one bad frame (a tab switch, a tier upload, a screenshot) never
 * moves it, and it never oscillates, because moving up needs a long clean
 * window and every move starts a cool-down during which nothing is measured.
 *
 * The user's own choice is the ceiling: adaptation only ever runs when the
 * quality control is set to "auto", and the manual levels are left alone.
 */

export const LEVELS = ['performance', 'balanced', 'cinematic'];

export const DEFAULTS = Object.freeze({
  start: 'balanced',
  floorFps: 28,      // sustained below this -> step down
  ceilingFps: 54,    // sustained above this -> step up
  downWindow: 2.5,   // seconds the average must stay under the floor
  upWindow: 12,      // seconds the average must stay over the ceiling
  cooldown: 4,       // seconds ignored after any change (rebuilds, uploads)
  maxLevel: 'cinematic',
  minLevel: 'performance',
  maxDt: 0.5,        // a longer frame counts as one half-second slow sample
});

/**
 * Create a controller. Options override DEFAULTS. `sample(dt)` is called once
 * per frame with the frame time in seconds and returns the level to use
 * (unchanged most of the time); `change` reports the last step taken.
 */
export function createAdaptiveQuality(options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  let level = clampLevel(cfg.start, cfg);
  let quiet = cfg.cooldown;      // seconds left before sampling resumes
  let slowFor = 0;               // seconds the smoothed rate has been under the floor
  let fastFor = 0;               // seconds it has been over the ceiling
  let smoothed = 0;              // exponentially smoothed fps
  let steps = [];

  function reset() {
    quiet = cfg.cooldown;
    slowFor = 0;
    fastFor = 0;
    smoothed = 0;
  }

  function step(to, reason) {
    const from = level;
    level = to;
    steps.push({ from, to, reason, fps: Math.round(smoothed) });
    reset();
    return level;
  }

  return {
    get level() { return level; },
    get fps() { return smoothed; },
    get steps() { return steps.slice(); },
    get pressure() { return slowFor / cfg.downWindow; },

    /** Feed one frame; returns the effective level after this frame. */
    sample(dt) {
      if (!(dt > 0)) return level;
      // A very long frame is either a stall (tab switch, upload) or a machine
      // rendering at a crawl. Count it as one capped slow sample: a single
      // stall cannot trigger a step, a crawl still adds up.
      if (dt > cfg.maxDt) dt = cfg.maxDt;
      if (quiet > 0) {
        quiet -= dt;
        smoothed = smoothed ? smoothed : 1 / dt;
        return level;
      }
      const fps = 1 / dt;
      // Time-constant ~0.7 s: fast enough to notice a jam, slow enough to
      // ignore a hiccup.
      const k = Math.min(1, dt / 0.7);
      smoothed = smoothed ? smoothed + (fps - smoothed) * k : fps;

      if (smoothed < cfg.floorFps) {
        slowFor += dt;
        fastFor = 0;
        const lower = LEVELS[LEVELS.indexOf(level) - 1];
        if (slowFor >= cfg.downWindow && lower && LEVELS.indexOf(lower) >= LEVELS.indexOf(cfg.minLevel)) {
          return step(lower, 'slow');
        }
      } else if (smoothed > cfg.ceilingFps) {
        fastFor += dt;
        slowFor = 0;
        const higher = LEVELS[LEVELS.indexOf(level) + 1];
        if (fastFor >= cfg.upWindow && higher && LEVELS.indexOf(higher) <= LEVELS.indexOf(cfg.maxLevel)) {
          return step(higher, 'headroom');
        }
      } else {
        // Comfortable: decay both counters rather than zeroing them, so a
        // rate hovering around a threshold still resolves eventually.
        slowFor = Math.max(0, slowFor - dt);
        fastFor = Math.max(0, fastFor - dt);
      }
      return level;
    },

    /** Something external changed the scene (resize, tier upload): pause. */
    disturb() {
      quiet = Math.max(quiet, cfg.cooldown);
      slowFor = 0;
      fastFor = 0;
    },

    /** Move the ceiling (the user's manual choice) and clamp the level. */
    setMaxLevel(max) {
      cfg.maxLevel = clampLevel(max, { minLevel: 'performance', maxLevel: 'cinematic' });
      if (LEVELS.indexOf(level) > LEVELS.indexOf(cfg.maxLevel)) step(cfg.maxLevel, 'ceiling');
    },

    /** Forget the history (used when the user flips back to manual). */
    forget() {
      steps = [];
      reset();
    },
  };
}

/**
 * The quality the renderer should use for a store value: manual levels pass
 * through; "auto" defers to the controller's current level.
 */
export function resolveQuality(setting, controller) {
  if (setting === 'auto') return controller ? controller.level : DEFAULTS.start;
  return LEVELS.includes(setting) ? setting : DEFAULTS.start;
}

function clampLevel(name, cfg) {
  const i = LEVELS.indexOf(LEVELS.includes(name) ? name : DEFAULTS.start);
  const lo = LEVELS.indexOf(cfg.minLevel);
  const hi = LEVELS.indexOf(cfg.maxLevel);
  return LEVELS[Math.min(hi, Math.max(lo, i))];
}
