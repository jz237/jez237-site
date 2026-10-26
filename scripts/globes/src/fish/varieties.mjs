// The betta's colour varieties, chosen in the fish's controls (app/VarietyMenu.ts) and remembered on
// this device. Classic is the photographed fish as it is; each other one is painted over it (Betta.ts
// showVariety, bettaPaint.mjs): its colours in two maps where the photographs lie, and the rest in a few
// numbers for the shader (bettaWGSL.ts): the scales' play of colour, an outer band on the fins, and a
// metallic coat on the scales. The photographs' light and shade stay: every scale, ray and fold.
// (Plain data, no imports: the tests read it in Node. Colours are sRGB, as a swatch shows them.)

/** Where the choice is kept on this device. */
export const STORAGE_KEY = 'betta.variety';

/** Each variety, in the menu's order:
 *  - body: its colour down the flank (back, side, belly) and on its head (to the gill covers);
 *  - fins: at their roots and out at their edges, the caudal's and the others' alike;
 *  - patches: a marble's (koi's), irregular, on body and fins: each colour, how much of the fish it
 *    covers (0..1) and how large its patches are (photograph px), and the noise's seed;
 *  - sheen: the scales' play of colour (thin film), turned towards a tint, by share (0: the photograph's
 *    own rainbow);
 *  - band: an outer band on every fin, its colour and where it starts, root (0) to fringe (1);
 *  - coat: a metallic coat on the scales (a dragon's), its colour and how far over each scale it reaches
 *    (0: its brightest flecks; 1: all but the edges);
 *  - amount: how much of it shows over the photographs' own colours (1 unless given);
 *  - detail: how much of the photographs' light and shade it keeps, as a power of their luminance (1
 *    unless given: every dark edge between the scales and rays; a white fish's are fainter);
 *  - swatch: its menu swatch, body and fins. */
export const VARIETIES = [
  {
    id: 'classic',
    name: 'Classic',
    swatch: ['#2b6f97', '#b3202b'],
  },
  {
    id: 'super-red',
    name: 'Super Red',
    body: { back: '#64070c', side: '#a20f15', belly: '#b92519', head: '#740a0d' },
    fins: { root: '#8c0910', edge: '#b8161b' },
    sheen: { tint: '#ff3a2c', share: 0.75 },
    swatch: ['#a20f15', '#b8161b'],
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    amount: 0.9,
    detail: 0.6,
    body: { back: '#0b2a78', side: '#1c4fc0', belly: '#2558bd', head: '#0e2464' },
    fins: { root: '#123c9c', edge: '#2054c8' },
    sheen: { tint: '#3d7bff', share: 0.6 },
    coat: { colour: '#5a8cff', reach: 0.15 },
    swatch: ['#1c4fc0', '#2054c8'],
  },
  {
    id: 'black-samurai',
    name: 'Black Samurai',
    detail: 0.75,
    body: { back: '#08090c', side: '#0b0c10', belly: '#101116', head: '#07080a' },
    fins: { root: '#07080b', edge: '#121318' },
    sheen: { tint: '#6f9cff', share: 0.6 },
    coat: { colour: '#aac3ea', reach: 0.85 },
    swatch: ['#9fb3d1', '#0c0d11'],
  },
  {
    id: 'mustard-gas',
    name: 'Mustard Gas',
    detail: 0.75,
    body: { back: '#0d3042', side: '#17605f', belly: '#1d6a63', head: '#0d2a38' },
    fins: { root: '#102f6a', edge: '#173d78' },
    sheen: { tint: '#2fd0b0', share: 0.45 },
    band: { colour: '#c8941f', from: 0.52 },
    swatch: ['#17605f', '#c8941f'],
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    detail: 0.6,
    body: { back: '#0b2a78', side: '#1c4fc0', belly: '#2558bd', head: '#0e2464' },
    fins: { root: '#133e9e', edge: '#1d4fbe' },
    sheen: { tint: '#3d7bff', share: 0.6 },
    band: { colour: '#e9edf0', from: 0.58 },
    swatch: ['#1c4fc0', '#e9edf0'],
  },
  {
    id: 'koi',
    name: 'Koi Marble',
    detail: 0.5,
    body: { back: '#d8d4cc', side: '#e6e2da', belly: '#ece8e0', head: '#ddd8cf' },
    fins: { root: '#d9d6d0', edge: '#cfcdca' },
    patches: { colours: [['#e2481a', 0.46, 230], ['#0b0b0d', 0.16, 140]], seed: 7 },
    sheen: { tint: '#e8f0ff', share: 0.5 },
    swatch: ['#e6e2da', '#e2481a'],
  },
  {
    id: 'platinum',
    name: 'Platinum White',
    detail: 0.45,
    body: { back: '#e3e3e0', side: '#eeeeeb', belly: '#f2f2ef', head: '#e6e6e2' },
    fins: { root: '#e4e5e4', edge: '#d6d8d9' },
    sheen: { tint: '#eef4ff', share: 0.7 },
    coat: { colour: '#f4f6f9', reach: 0.8 },
    swatch: ['#eeeeeb', '#d6d8d9'],
  },
  {
    id: 'copper',
    name: 'Copper',
    detail: 0.9,
    body: { back: '#4a1a0a', side: '#7a3414', belly: '#86401c', head: '#4f1d0c' },
    fins: { root: '#6e2810', edge: '#4c1b0b' },
    sheen: { tint: '#ffb057', share: 0.7 },
    coat: { colour: '#e39a52', reach: 0.75 },
    swatch: ['#c27a3e', '#6e2810'],
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    body: { back: '#3a2706', side: '#4a320a', belly: '#6a4c12', head: '#b88a1e' },
    fins: { root: '#c99418', edge: '#ddb036' },
    sheen: { tint: '#ffd24a', share: 0.7 },
    coat: { colour: '#e9b52a', reach: 0.9 },
    swatch: ['#e9b52a', '#ddb036'],
  },
  {
    id: 'galaxy-koi',
    name: 'Galaxy Koi',
    detail: 0.8,
    body: { back: '#0b1a3c', side: '#13285a', belly: '#1b3266', head: '#0c1a38' },
    fins: { root: '#132a62', edge: '#1a3878' },
    patches: { colours: [['#b4ccff', 0.16, 26], ['#e2481a', 0.34, 200], ['#e1e4ea', 0.08, 150]], seed: 3 },
    sheen: { tint: '#5d8dff', share: 0.6 },
    swatch: ['#13285a', '#e2481a'],
  },
];

/** The variety kept as `text` ('classic' for anything not one of them). */
export function parseVariety(text) {
  return VARIETIES.some((v) => v.id === text) ? text : 'classic';
}

/** The variety kept on this device. storage: what gives localStorage (reaching it can throw, as
 *  reading it can: storage blocked, a private window), each meaning only Classic, as for a first
 *  visit. */
export function keptVariety(storage) {
  try {
    return parseVariety(storage().getItem(STORAGE_KEY));
  } catch {
    return 'classic';
  }
}

/** The variety kept on this device (not kept where storage cannot be had). */
export function keepVariety(storage, id) {
  try {
    storage().setItem(STORAGE_KEY, parseVariety(id));
  } catch {
    // (Not remembered.)
  }
}

/** The variety of this id (Classic for none). */
export function varietyOf(id) {
  return VARIETIES.find((v) => v.id === id) ?? VARIETIES[0];
}

/** An sRGB colour ('#rrggbb') as linear light, 0..1 a channel. */
export function linearOf(hex) {
  return [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
  });
}

/** Where a band starts when there is none (past every fin's fringe), and a coat's reach when there is
 *  none (no scale is bright enough for it). */
const NO_BAND = 2;
const NO_COAT = -8;

/** The shader's numbers for a variety (bettaWGSL.ts bettaLook, a mat4's columns, into out): [0] how
 *  much of it shows (0: the photographs' own colours), the colour maps' gain (to the power of its
 *  detail, as the maps are painted), its detail, and 1 / the body's mean luminance in the photographs
 *  (refs: bettaPaint.mjs measure's gain, body and fins); [1] the sheen's tint and share; [2] the band's
 *  colour over the fins' mean luminance, and its start; [3] the coat's colour and reach (shifted to
 *  where bettaWGSL.ts's smoothstep reads it: reach 1 covers all but the darkest edges). Classic's are
 *  all 0 but for the band and the coat, which are off, so its fish is the photographs' alone. */
export function varietyLook(variety, refs, out = new Float32Array(16)) {
  out.fill(0);
  out[11] = NO_BAND;
  out[15] = NO_COAT;
  if (variety.id === 'classic') return out;
  const detail = variety.detail ?? 1;
  out.set([variety.amount ?? 1, refs.gain ** detail, detail, 1 / refs.body], 0);
  if (variety.sheen) out.set([...linearOf(variety.sheen.tint), variety.sheen.share], 4);
  if (variety.band) out.set([...linearOf(variety.band.colour).map((c) => c / refs.fins), variety.band.from], 8);
  if (variety.coat) out.set([...linearOf(variety.coat.colour), 1.4 * variety.coat.reach + 0.1], 12);
  return out;
}
