/**
 * The battlefield, in world units: x across, y up from the ground, the play plane at z = 0. The sky is
 * `SKY` tall; how wide it is follows the screen — a wide monitor gets a wide front, an upright phone a
 * narrow one — chosen when a run lays out its cities, so everything is placed in proportion to it.
 */
export const SKY = 20;
/** Where warheads come from: above the top of the frame, so they streak in. */
export const SPAWN_Y = SKY + 2;
export const GROUND = 0;

export const world = {
  width: 30,
};

export const half = (): number => world.width / 2;

/** The width for a screen of this aspect: as wide as it shows, within sensible bounds. */
export function widthFor(aspect: number): number {
  return Math.max(18, Math.min(34, (SKY + 3) * aspect * 0.98));
}

/** Points scale: the classic edition measured in pixels on a ~700 px tall field. */
export const PX = SKY / 700;
