// The quality ladder of a phone's picture (the controller, controller.mjs, steps along it): its
// levels, sharpest first, each a set of knobs, and what each is predicted to cost the GPU. Every
// knob is a uniform, a canvas size, a pass skipped or a dispatch put off: no level builds a
// pipeline, so moving between them never stalls (a bowl pipeline costs a phone seconds).
//
// A level's knobs:
// - ratio: the picture's pixel ratio (canvas pixels a CSS pixel), from the screen's own (up to 2)
//   down in steps of 0.9 through 1 to the floor (adaptiveScale.mjs, PHONE);
// - mirrorEvery: the table's mirror redrawn every frame (1), or every other frame while nothing
//   moves (2: the bowl, its lid and the camera all still);
// - plantEvery: the plants' motion worked out every so many frames (phones: every other one, as
//   before the ladder; every third, the main thread's ladder's: CPU_RUNGS);
// - march: the water march's step, in voxels of the density map (GlobeView setMarchStep);
// - fps: the frames a second the page is held to (framePace.mjs): 60, or 30, the floor of a GPU
//   too slow for the lowest level at 60 (said so in ?stats).
//
// The ladder is data: a tier's base (its sharpest level), then its rungs in order, each giving up
// one thing more, the least missed first. The 'ratio' rung is the whole sweep of the picture's
// steps. The mirror at half rate while still comes first: what it shows is a blur, and it does not
// move (a frozen frame is the same to the pixel). The march's longer steps follow the sweep, at the
// floor's ratio: they move a few pixels of the water's edge seen from below (0.75: 2% of a portrait
// frame's pixels, 0.2% by more than 8/255). (Fewer samples of the lamp's haze, the plan's other
// cheap knob, were left out: at 3 a hot spot under the lamp and moire through the haze, at 2
// coarser streaks, plain at a phone's size.) (The bowl traced on an interleaved lattice, a quarter
// of its pixels a frame - render/bowlRender.ts, ?up=2 - is not a rung: phones always draw it so, at
// every level, and the cost model's cost of a traced pixel takes it in, a steady share. A rung that
// changes it would be a rung of its own knobs; main.ts applies each knob a level sets by its name,
// applyKnobs.)

import { FLOOR_RATIO, PHONE as PHONE_STEPS, ratioAt } from '../adaptiveScale.mjs';

/** A phone's picture: its sharpest level, and the rungs below it. */
export const PHONE = {
  base: { mirrorEvery: 1, plantEvery: 2, march: 0.6, fps: 60 },
  rungs: [{ mirrorEvery: 2 }, 'ratio', { march: 0.75 }, { march: 0.9 }],
  /** The steps of the ratio's sweep (adaptiveScale.mjs). */
  steps: PHONE_STEPS,
  floor: FLOOR_RATIO,
};

/** The main thread's ladder (what it can give up when it is the limit): the plants' motion less
 *  often, then 30 frames a second. (The fins are never solved more coarsely to save time: e9a4e4220
 *  undid that. Their solver is in a worker on phones of four cores or more: bettaWorker.mjs.) */
export const CPU_RUNGS = [{}, { plantEvery: 3 }, { fps: 30 }];

/** The largest march step any level takes (voxels): the march band (marchBand.ts) is worked out for
 *  it, so it holds for every level (a band for a longer step leaves out no more than one for a
 *  shorter: the frame is the same). */
export function longestMarch(tier = PHONE) {
  return Math.max(tier.base.march, ...tier.rungs.filter((r) => r !== 'ratio' && r.march !== undefined).map((r) => r.march));
}

/** The levels of a tier on a screen of this pixel ratio (base: devicePixelRatio, up to 2),
 *  sharpest first. */
export function buildLadder(screenRatio, tier = PHONE) {
  const levels = [];
  let knobs = { ...tier.base, ratio: ratioAt(screenRatio, 0, tier.steps) };
  levels.push(knobs);
  for (const rung of tier.rungs) {
    if (rung === 'ratio') {
      for (let l = 1; l <= tier.steps.maxLevel; l++) {
        const ratio = ratioAt(screenRatio, l, tier.steps);
        if (ratio >= knobs.ratio - 1e-9) break;
        knobs = { ...knobs, ratio };
        levels.push(knobs);
        if (ratio <= Math.min(screenRatio, tier.floor) + 1e-9) break;
      }
      continue;
    }
    knobs = { ...knobs, ...rung };
    levels.push(knobs);
  }
  return levels;
}

/** The knobs of a GPU level and a CPU level together: each the less costly of the two. */
export function merge(level, cpu) {
  return { ...level, plantEvery: Math.max(level.plantEvery, cpu.plantEvery ?? 1), fps: Math.min(level.fps, cpu.fps ?? 60) };
}

// What the knobs cost, relative to the sharpest level's (guesses: the controller measures, and
// fits the cost per traced pixel and the fixed cost to what it measures; these only share it out).
/** The share of a traced bowl pixel's cost that is the water march (scales with 1 / its step): the
 *  phone's bowl is bound by its march's reads. */
export const MARCH_SHARE = 0.6;
/** The share of the frame's fixed cost (the drawing that does not scale with the bowl's pixels)
 *  that is the table's mirror (it traces the bowl again, at a fixed sharpness). */
export const MIRROR_SHARE = 0.7;

/** A traced pixel's cost at these knobs, relative to the sharpest level's. */
export function rayCost(k) {
  return 1 - MARCH_SHARE + (MARCH_SHARE * 0.6) / k.march;
}

/** The fixed cost at these knobs, relative to the sharpest level's (the mirror at half rate while
 *  still, as when the controller measures: it measures the bowl at rest). */
export function fixedCost(k) {
  return 1 - MIRROR_SHARE + MIRROR_SHARE / k.mirrorEvery;
}

/** The bowl's pixels traced a frame at these knobs (millions): its area on screen (CSS px^2) by
 *  the pixel ratio squared, weighted by what each costs. */
export function tracedPx(k, area) {
  return (area * k.ratio * k.ratio * rayCost(k)) / 1e6;
}

/** The sim's cost at these knobs, relative to at 60 frames a second: a frame of 1/30 s takes three
 *  substeps where one of 1/60 takes two (FluidSim.step; phones' maxSubstepDt 1/100). */
export function simCost(k) {
  return k.fps < 60 ? 1.5 : 1;
}
