// The picture's resolution as chosen on the betta bowl's page (ResolutionMenu.ts): Auto, the
// sharpest the page finds keeps frames coming 60 a second (the quality controller on phones, the
// scaler on desktops: as it always was), or a pixel ratio held however slowly frames then come.
// Fixed, it is 1, 1.5 or 2 canvas pixels a CSS pixel, or the screen's own where it has more (a
// phone's 2.6 to 3.5): past the screen's own, the picture is drawn larger and shrunk to fit it
// (supersampled), its edges the smoother.

/** Where the choice is kept on this device. */
export const STORAGE_KEY = 'betta.resolution';

/** The fixed ratios offered on a screen of this pixel ratio, least first: 1, 1.5 and 2, and the
 *  screen's own (to two places) where it is not one of them. */
export function fixedRatios(screen) {
  const own = Math.round(screen * 100) / 100;
  return [...new Set([1, 1.5, 2, ...(own > 1 ? [own] : [])])].sort((a, b) => a - b);
}

/** The screen's own ratio as offered (to two places). */
export function ownRatio(screen) {
  return Math.round(screen * 100) / 100;
}

/** A choice from its kept text ('auto', 'screen' or a ratio offered on this screen); anything else
 *  is Auto. */
export function parseChoice(text, screen) {
  if (text === 'screen') return 'screen';
  const r = text ? Number(text) : NaN;
  return fixedRatios(screen).includes(r) ? choiceFor(r, screen) : 'auto';
}

/** The ratio a choice holds the picture at on this screen, or null for Auto. */
export function ratioOf(choice, screen) {
  return choice === 'auto' ? null : choice === 'screen' ? ownRatio(screen) : choice;
}

/** The choice that holds a ratio offered on this screen ('screen' for the screen's own). */
export function choiceFor(ratio, screen) {
  return ratio === ownRatio(screen) ? 'screen' : ratio;
}

/** A ratio's words: "2×", and the picture's size at it on a stage of w x h CSS px (no side past
 *  `most` pixels, the GPU's limit, as the page holds it). */
export function describeRatio(ratio, w, h, most = Infinity) {
  const r = Math.min(ratio, most / w, most / h);
  return { ratio: `${ratio}×`, size: `${Math.round(w * r)} × ${Math.round(h * r)}` };
}
