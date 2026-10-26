// Where a phone's picture starts, and what the page keeps of it between visits. Kept in
// localStorage ('betta.quality.v1'; every access in try/catch: a private window, storage blocked
// or full, all mean only that the next visit starts afresh), for each device (its GPU as the browser
// names it, and its screen) and each way it is held:
// - the level held longest (the controller's thermal memory: a warm phone's, not its first cool
//   seconds'), and the build it was held in (in a new build, whose shaders may cost more, a view
//   starts a rung lower);
// - how long the bowl's pipelines took to build there (the splash's progress, main.ts).
// With nothing kept, a level is guessed from the GPU's name (PRIORS: how fast it is against the
// S25 Ultra's Adreno 830, which ?bench has measured), at the sharpest the S25's costs, scaled by
// that, predict to fit; the controller's calibration, as the bowl comes into view, corrects it.

import { fixedCost, simCost, tracedPx } from './ladder.mjs';
import { aimFps, TARGET_FPS, TARGET_MS } from './controller.mjs';

export const RECORD_KEY = 'betta.quality.v1';

/** The GPUs a phone may have (matched in the adapter's vendor, architecture and description, as
 *  Chrome and Safari name them), and their speed against the S25 Ultra's (a first guess only).
 *  @type {[RegExp, number][]} */
export const PRIORS = [
  [/adreno-8|adreno \(tm\) 8/i, 1],
  [/adreno-7|adreno \(tm\) 7/i, 0.5],
  [/adreno/i, 0.25],
  [/immortalis|mali-g(7[12]\d|9\d\d)/i, 0.5],
  [/mali|valhall|bifrost/i, 0.3],
  [/xclipse|samsung/i, 0.5],
  [/apple/i, 0.8],
  [/powervr|img-tec|imagination/i, 0.25],
];
/** A GPU none of them names. */
export const UNKNOWN_SPEED = 0.4;

/** The S25 Ultra's costs at the sharpest knobs (?bench, phone-bench-3.txt, round 2): the sim a
 *  frame, the drawing's fixed part, and ms per million traced bowl pixels (its draw at ratios 0.6
 *  and 1, over the bowl's pixels then: from a view zoomed in, so on the high side). */
export const S25 = { simMs: 7, fixedMs: 1, msPerMpx: 160 };

/** How fast this GPU is against the S25 Ultra's (a guess, from its name). */
export function priorSpeed(info) {
  const name = info ? `${info.vendor} ${info.architecture} ${info.description}` : '';
  return PRIORS.find(([re]) => re.test(name))?.[1] ?? UNKNOWN_SPEED;
}

/** The sharpest level (of `levels`) the S25's costs, scaled by the GPU's speed, predict to fit, the
 *  bowl `area` CSS px^2 on screen. */
export function priorLevel(levels, speed, area) {
  for (let l = 0; l < levels.length; l++) {
    const k = levels[l];
    const ms = (S25.simMs * simCost({ fps: aimFps(k) }) + S25.fixedMs * fixedCost(k) + S25.msPerMpx * tracedPx(k, area)) / speed;
    if (ms <= (TARGET_MS * TARGET_FPS) / aimFps(k)) return l;
  }
  return levels.length - 1;
}

/** The device's key: its GPU and its screen (the same either way up: the way is kept apart). */
export function deviceKey(info, screen) {
  const gpu = info ? [info.vendor, info.architecture, info.description].join('/') : '?';
  return `${gpu}|${Math.min(screen.width, screen.height)}x${Math.max(screen.width, screen.height)}@${screen.devicePixelRatio.toFixed(2)}`;
}

export function readRecord(storage) {
  try {
    const r = JSON.parse(storage.getItem(RECORD_KEY) ?? 'null');
    return r && typeof r === 'object' && r.devices && typeof r.devices === 'object' ? r : null;
  } catch {
    return null;
  }
}

export function writeRecord(storage, record) {
  try {
    storage.setItem(RECORD_KEY, JSON.stringify(record));
  } catch {
    // (Nowhere to keep it: the next visit starts afresh.)
  }
}

/** Where a view starts (a level of `levels`): the level kept for this device held this way (a rung
 *  lower if kept in another build), else `prior`. */
export function startLevel(record, key, way, build, levels, prior) {
  const kept = record?.devices?.[key]?.[way];
  if (!kept || !Number.isInteger(kept.level) || kept.level < 0) return prior;
  return Math.min(kept.level + (kept.build === build ? 0 : 1), levels.length - 1);
}

/** The record with this device's level held this way (and its build) kept. */
export function keepLevel(record, key, way, build, level) {
  const devices = { ...(record?.devices ?? {}) };
  devices[key] = { ...(devices[key] ?? {}), [way]: { level, build } };
  return { ...(record ?? {}), devices };
}

/** How long the bowl's pipelines took to build on this device last time (ms), or null. */
export function keptCompileMs(record, key) {
  const ms = record?.devices?.[key]?.compileMs;
  return Number.isFinite(ms) && ms > 0 ? ms : null;
}

export function keepCompileMs(record, key, ms) {
  const devices = { ...(record?.devices ?? {}) };
  devices[key] = { ...(devices[key] ?? {}), compileMs: Math.round(ms) };
  return { ...(record ?? {}), devices };
}
