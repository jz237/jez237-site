/**
 * The field as a grid of one-unit cells: x across, y up the field toward the far end. Row 0 is the
 * top row, where the millipede comes in; the bottom `ZONE` rows are the player's, and once the
 * millipede gets down there it stays, bouncing between their top and the floor.
 */
export const COLS = 21;
export const ROWS = 26;
export const ZONE = 6;
/** The first row of the player's zone. */
export const ZONE_TOP = ROWS - ZONE;

/** A column's or a row's centre, in world units. */
export const cellX = (c: number): number => c - (COLS - 1) / 2;
export const cellY = (r: number): number => ROWS - 1 - r + 0.5;
/** Continuous column and row of a world position: whole numbers at cell centres. */
export const colAt = (x: number): number => x + (COLS - 1) / 2;
export const rowAt = (y: number): number => ROWS - 1 - (y - 0.5);

/** The field's edges: the walls' inner faces and the top wall. */
export const LEFT = cellX(0) - 0.5;
export const RIGHT = cellX(COLS - 1) + 0.5;
export const TOP = ROWS;
/** How far up the player may go, and down. */
export const PLAYER_TOP = cellY(ZONE_TOP) + 0.2;
export const PLAYER_BOTTOM = 0.45;

export const inField = (c: number, r: number): boolean => c >= 0 && c < COLS && r >= 0 && r < ROWS;
