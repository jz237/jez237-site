// Numbers only: every pose the iteration loop tunes. World units: x = (px-545)/40, y = (470-py)/40 in the reference infographic.
export const CAMERA = { fov: 20, elevDeg: 12, target: [0.4, -5.9, 0], dist: 99.4 };

export const PX = { x0: 545, y0: 470, k: 40 };
export const fromPx = (px, py, z = 0) => [(px - PX.x0) / PX.k, (PX.y0 - py) / PX.k, z];

// Petal rings. closed/open hinge angles in degrees (positive = tip leans outward).
export const RINGS = {
  A: { r: 2.3, y: -2.0, closed: -9, open: 62, win: [0.0, 0.75] },
  B: { r: 1.0, y: -1.2, closed: -14, open: 34, win: [0.2, 1.0] },
  I: { r: 1.4, y: -1.2, closed: -6, open: 34, win: [0.3, 1.0] },
  D: { r: 1.85, y: -1.6, closed: -8, open: 48, win: [0.1, 0.88] },
};

// Exploded petal table: [phiDeg, r, y, openThetaDeg, rollDeg, kind, ring-size scale]
// phi 0 = +x (right), 90 = toward camera, 180 = left. Cap petals keep a small opening so they read as a bud.
export const OUTER_EXPLODED = [
  { phi: 200, r: 3.7, y: 5.2, th: 54, closedTh: 4, roll: -0.25, kind: 'greenBlue', zOff: -0.4, L: 4.9 },
  { phi: 172, r: 4.1, y: 4.1, th: 76, closedTh: 8, roll: 0.2, kind: 'crimson', zOff: 0.2, L: 4.6 },
  { phi: 158, r: 2.1, y: 4.5, th: 66, closedTh: 8, roll: 0.0, kind: 'tealViolet', zOff: 1.2, L: 4.5 },
  { phi: -20, r: 3.7, y: 5.0, th: 56, closedTh: 4, roll: 0.25, kind: 'violetBlue', zOff: -0.4, L: 4.9 },
  { phi: 8, r: 4.3, y: 4.2, th: 74, closedTh: 8, roll: -0.2, kind: 'magentaViolet', zOff: 0.2, L: 4.7 },
  { phi: 24, r: 2.1, y: 4.4, th: 70, closedTh: 8, roll: 0.0, kind: 'tealMagenta', zOff: 1.2, L: 4.5 },
  { phi: 180, r: 0.9, y: 5.6, th: -12, closedTh: 0, roll: 0.05, kind: 'tealViolet', zOff: 0.0, L: 3.8, cap: true },
  { phi: 0, r: 0.9, y: 5.6, th: -12, closedTh: 0, roll: -0.05, kind: 'crimson', zOff: 0.0, L: 3.8, cap: true },
  { phi: 90, r: 0.55, y: 5.2, th: 4, closedTh: 0, roll: 0.0, kind: 'violetBlue', zOff: 0.0, L: 3.5, cap: true },
  { phi: 250, r: 3.0, y: 5.5, th: 58, closedTh: 4, roll: 0.1, kind: 'magentaViolet', zOff: 0, L: 4.5 },
  { phi: 290, r: 3.0, y: 5.0, th: 60, closedTh: 4, roll: -0.1, kind: 'greenBlue', zOff: 0, L: 4.5 },
  { phi: 270, r: 1.5, y: 6.4, th: 40, closedTh: 2, roll: 0.0, kind: 'tealMagenta', zOff: 0, L: 4.3 },
];

export const INNER_EXPLODED = [
  { phi: 196, r: 3.1, y: 2.3, th: 80, closedTh: 4, roll: -0.15, kind: 'crimson', zOff: 0.3, L: 3.9 },
  { phi: 172, r: 3.5, y: 0.9, th: 86, closedTh: 4, roll: 0.15, kind: 'greenBlue', zOff: 0.6, L: 4.2 },
  { phi: 156, r: 1.8, y: 2.7, th: 62, closedTh: 6, roll: 0.0, kind: 'tealMagenta', zOff: 1.0, L: 4.0 },
  { phi: -16, r: 3.0, y: 2.4, th: 66, closedTh: 4, roll: 0.15, kind: 'violetBlue', zOff: 0.3, L: 3.9 },
  { phi: 12, r: 3.7, y: 1.8, th: 78, closedTh: 4, roll: -0.1, kind: 'tealViolet', zOff: 0.4, L: 4.1 },
  { phi: 30, r: 3.5, y: 0.5, th: 92, closedTh: 4, roll: 0.1, kind: 'magentaViolet', zOff: 0.8, L: 4.2 },
  { phi: 252, r: 2.8, y: 2.0, th: 70, closedTh: 4, roll: 0, kind: 'tealViolet', zOff: 0, L: 3.9 },
  { phi: 292, r: 2.8, y: 1.5, th: 70, closedTh: 4, roll: 0, kind: 'crimson', zOff: 0, L: 3.9 },
];

// Spindle stack: items listed top to bottom in the exploded view. type 'gear' | 'washer'
export const STACK = [
  { type: 'gear', y: 5.45, R: 0.85, teeth: 14, spokes: 0, th: 0.14, gem: 'ruby' },
  { type: 'gear', y: 4.55, R: 1.7, teeth: 30, spokes: 6, th: 0.17, gem: 'sapphire' },
  { type: 'washer', y: 3.9, R: 0.5 },
  { type: 'gear', y: 3.05, R: 1.5, teeth: 26, spokes: 5, th: 0.16, gem: 'aqua' },
  { type: 'washer', y: 2.55, R: 0.42 },
  { type: 'gear', y: 2.1, R: 1.1, teeth: 20, spokes: 4, th: 0.15, gem: 'rose' },
  { type: 'washer', y: 1.55, R: 0.38 },
  { type: 'washer', y: -2.6, R: 0.42 },
  { type: 'gear', y: -4.6, R: 1.0, teeth: 18, spokes: 4, th: 0.14, gem: 'emerald' },
  { type: 'gear', y: -5.4, R: 1.3, teeth: 24, spokes: 5, th: 0.15, gem: 'ruby' },
  { type: 'washer', y: -5.9, R: 0.45 },
  { type: 'gear', y: -6.5, R: 1.35, teeth: 26, spokes: 5, th: 0.16, gem: 'sapphire' },
  { type: 'gear', y: -7.15, R: 1.1, teeth: 22, spokes: 4, th: 0.14, gem: 'aqua' },
  { type: 'gear', y: -7.8, R: 1.45, teeth: 28, spokes: 6, th: 0.17, gem: 'rose' },
  { type: 'washer', y: -8.3, R: 0.55 },
];
// Side pair of small ring gears next to the upper stack
export const SIDE_GEARS = [
  { x: -1.45, y: 3.45, R: 0.55, teeth: 14, gem: 'amber' },
  { x: 1.45, y: 3.45, R: 0.55, teeth: 14, gem: 'amber' },
];

// Camera-facing drive gears. Exploded and assembled positions.
export const DRIVE_GEARS = [
  { id: 'dgL1', R: 0.8, teeth: 16, spokes: 4, gem: 'sapphire', exp: [-3.9, -6.05, 0.4], asm: [-2.2, -3.0, 1.9], dir: -1 },
  { id: 'dgL2', R: 1.4, teeth: 28, spokes: 5, gem: 'ruby', exp: [-2.6, -6.9, 0.6], asm: [-2.5, -4.1, 1.2], dir: 1 },
  { id: 'dgL3', R: 0.9, teeth: 18, spokes: 4, gem: 'sapphire', exp: [-5.55, -6.9, 0.2], asm: [-1.2, -4.3, 2.1], dir: -1 },
  { id: 'dgR1', R: 1.15, teeth: 24, spokes: 5, gem: 'ruby', exp: [2.25, -6.9, 0.6], asm: [2.3, -3.2, 1.7], dir: 1 },
  { id: 'dgR2', R: 0.75, teeth: 16, spokes: 4, gem: 'amber', exp: [3.9, -6.05, 0.3], asm: [1.4, -4.4, 2.0], dir: -1 },
  { id: 'dgR3', R: 0.7, teeth: 14, spokes: 4, gem: 'sapphire', exp: [5.5, -7.0, 0.2], asm: [3.1, -4.4, 1.0], dir: 1 },
];

// Retention collars on the braid. y in exploded coordinates.
export const COLLARS = [
  { y: -8.95, R: 1.38, h: 0.75, jewels: 10, pins: 3, serrated: true },
  { y: -11.45, R: 1.3, h: 0.78, jewels: 9, pins: 3, serrated: false },
  { y: -15.0, R: 1.3, h: 0.78, jewels: 9, pins: 3, serrated: false },
  { y: -16.9, R: 1.3, h: 0.78, jewels: 9, pins: 3, serrated: false },
  { y: -19.2, R: 1.3, h: 0.78, jewels: 9, pins: 3, serrated: false },
  { y: -21.1, R: 1.38, h: 0.8, jewels: 10, pins: 3, serrated: true },
];
export const STEM_LIFT = 6.6;

// Leaves: exploded hub world position + z rotation; clamp point (world) where the petiole meets the braid.
export const LEAVES = [
  { id: 'leafL', L: 8.6, W: 3.4, bend: -0.62, sweep: 0.12, kind: 'leaf', seed: 3, hub: [-3.4, -12.6, 0.4], rotZ: 1.13, tiltX: -0.18, clamp: [-1.35, -17.0, 0.3], asmClampY: -13.2, asmRotZ: 1.1, asmOut: -1.15 },
  { id: 'leafR', L: 8.3, W: 3.1, bend: -0.5, sweep: -0.08, kind: 'leafBlue', seed: 8, hub: [3.4, -14.9, 0.2], rotZ: -1.46, tiltX: -0.12, clamp: [1.55, -16.9, 0.2], asmClampY: -17.8, asmRotZ: -1.15, asmOut: 1.15 },
];

// Floating screws: reference pixel positions (cap = jewel head colour or null).
export const SCREWS_PX = [
  [277, 108], [383, 93], [468, 88], [707, 98], [845, 125], [428, 154, 'rose'], [445, 200], [650, 199], [641, 170, 'ruby'], [705, 176],
  [318, 326], [340, 334], [232, 387], [245, 378], [386, 405, 'ruby'], [262, 432], [703, 410], [797, 326], [842, 371], [853, 438],
  [767, 492], [678, 533], [383, 541], [417, 543], [523, 588], [306, 649], [335, 658], [744, 669], [769, 651], [270, 742],
  [811, 738], [413, 800], [457, 830], [638, 830], [680, 806], [126, 868], [176, 873], [211, 1000], [243, 1025], [301, 1060, 'ruby'],
  [477, 1052], [512, 998], [523, 1021], [633, 1018], [606, 1100], [882, 1090], [846, 1126], [912, 1055], [440, 1100], [481, 1182],
  [467, 1221], [473, 1322], [611, 1222], [622, 1311], [604, 1126], [684, 1166], [811, 1156, 'ruby'], [745, 1131, 'ruby'], [641, 960], [645, 992],
  [438, 1002], [295, 996], [575, 232], [492, 236, 'rose'], [591, 234], [531, 255], [457, 506], [650, 507], [657, 495], [626, 477],
  [602, 459], [551, 128], [331, 110], [291, 151], [855, 187], [882, 209], [619, 390], [363, 395], [723, 407], [812, 346, 'rose'],
  [739, 333], [353, 304], [448, 349], [371, 361],
];

// Leader-line anchor targets. `of` is a rig id; `p` is a point in that part's local frame (or `px` world from the reference).
export const ANCHOR_PX = {
  outerPetals: [297, 178],
  innerPetals: [290, 335],
  stamenCage: [435, 517],
  filigreeRing: [305, 688],
  leafPanel: [205, 945],
  core: [640, 551],
  driveGears: [655, 765],
  braidedStem: [610, 945],
  retentionCollar: [590, 1150],
  stemSegment: [645, 1303],
};
