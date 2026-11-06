// Reef picture manifest. Shrimp/crab/snail pictures (Jez, Nov 6 2026 01:08 EST:
// "Do shrimp crab or snail now ... as they would typically look in a typical
// aquarium") come from reef-images-inverts-data.mjs; corals and anemones are
// still empty, so every coral picture spot shows "Picture coming soon".
//
//   REEF_IMAGES[group].signs[signId]          → the sign tile (one image)
//   REEF_IMAGES[group].signs[`${kind}:${signId}`] → a kind-specific sign tile
//   REEF_IMAGES[group].conditions[conditionId] → [hero, ...more] for results,
//                                                 could-also cards and the library
//   REEF_IMAGES[group].conditions[`${kind}:${conditionId}`] → kind-specific set
//   REEF_IMAGES[group].kinds[kindId]           → the kind tile
// Each image: { id, url, width, height, alt, caption }. Never commit image binaries.
import { MEDIA_BASE } from './fish-images-data.mjs';
import { CROPS as INVERT_CROPS, IMAGE_SOURCE as INVERT_IMAGE_SOURCE } from './reef-images-inverts-data.mjs';

// 'media' = content-hashed R2 keys on media.jez237.com; 'local' = the untracked
// preview copies (experiments/fish-health-lab/inverts/x.jpg → local-images/inverts/x.jpg).
const KEY_PREFIX = 'experiments/fish-health-lab/';
export const invertUrlFor = entry => INVERT_IMAGE_SOURCE === 'media' ? MEDIA_BASE + entry.key : `local-images/${entry.key.slice(KEY_PREFIX.length)}`;
const pic = id => {
  const entry = INVERT_CROPS[id];
  if (!entry) throw new Error(`reef-images: no invert crop ${id}`);
  return { id, ...entry, url: invertUrlFor(entry) };
};
const pics = (...ids) => ids.map(pic);

// Which crop goes where. Kind-specific keys (`crab:…`) win over the plain key.
export const INVERT_SET = {
  kinds: { shrimp: 'kind-shrimp', crab: 'kind-crab', snail: 'kind-snail', other: 'kind-other' },
  signs: {
    'molt-stuck': 'sign-molt-stuck', 'empty-shell': 'sign-empty-shell', pale: 'sign-pale', deaths: 'sign-deaths',
    'not-moving': 'sign-not-moving', bulge: 'sign-bulge', legs: 'sign-legs', color: 'sign-color',
    spines: 'sign-spines', unclear: 'sign-unclear',
    'shrimp:legs': 'sign-shrimp-legs',
    'crab:molt-stuck': 'sign-crab-molt-stuck', 'crab:empty-shell': 'sign-crab-empty-shell', 'crab:pale': 'sign-crab-pale',
    'crab:deaths': 'sign-crab-deaths', 'crab:not-moving': 'sign-crab-not-moving', 'crab:legs': 'sign-crab-legs',
    'crab:color': 'sign-crab-color', 'crab:unclear': 'sign-crab-unclear',
    'snail:deaths': 'sign-snail-deaths', 'snail:unclear': 'sign-snail-unclear',
    'other:deaths': 'sign-other-deaths', 'other:not-moving': 'sign-other-not-moving', 'other:color': 'sign-other-color',
    'other:unclear': 'sign-other-unclear',
  },
  // [hero, ...more]. The plain set also fills the library/detail gallery.
  conditions: {
    'failed-molt': ['cond-failed-molt', 'cond-crab-failed-molt', 'sign-molt-stuck'],
    copper: ['cond-copper', 'sign-deaths', 'cond-other-copper'],
    acclimation: ['cond-acclimation', 'cond-crab-acclimation'],
    'invert-water': ['cond-invert-water', 'sign-pale'],
    starvation: ['cond-starvation', 'cond-snail-starvation', 'sign-color'],
    bopyrid: ['cond-bopyrid', 'sign-bulge'],
    'normal-molt': ['cond-normal-molt', 'cond-crab-normal-molt', 'sign-empty-shell'],
    'invert-injury': ['cond-invert-injury', 'sign-shrimp-legs', 'sign-legs'],
    flipped: ['cond-flipped', 'sign-not-moving'],
    'shrimp:invert-injury': ['sign-shrimp-legs', 'cond-invert-injury'],
    'crab:failed-molt': ['cond-crab-failed-molt', 'sign-crab-molt-stuck'],
    'crab:copper': ['sign-crab-deaths', 'cond-copper'],
    'crab:acclimation': ['cond-crab-acclimation'],
    'crab:normal-molt': ['cond-crab-normal-molt', 'sign-crab-empty-shell'],
    'crab:invert-water': ['sign-crab-not-moving', 'cond-invert-water'],
    'crab:starvation': ['sign-crab-color'],
    'snail:starvation': ['cond-snail-starvation'],
    'snail:copper': ['sign-snail-deaths', 'cond-copper'],
    'snail:acclimation': ['sign-snail-unclear'],
    'other:copper': ['cond-other-copper', 'sign-other-deaths'],
    'other:invert-water': ['sign-spines', 'cond-invert-water'],
    'other:acclimation': ['sign-other-not-moving'],
    'other:starvation': ['sign-other-color'],
  },
};

const mapValues = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

export const REEF_IMAGES = {
  coral: { kinds: {}, signs: {}, conditions: {} },
  invert: {
    kinds: mapValues(INVERT_SET.kinds, pic),
    signs: mapValues(INVERT_SET.signs, pic),
    conditions: mapValues(INVERT_SET.conditions, ids => pics(...ids)),
  },
};

// Library/detail slots per reef entry. Filled from conditions[id] in order; a
// filled slot shows its picture's caption instead of the slot label.
export const REEF_SLOTS = [
  { id: 'overview', label: 'What it looks like' },
  { id: 'closeup', label: 'Close-up' },
  { id: 'lookalikes', label: 'Look-alikes' },
];

const asList = value => (Array.isArray(value) ? value : value ? [value] : []);

// Pictures for a sign, condition or kind. Kind-specific pictures win; an empty
// list means "show the placeholder".
export function reefImagesFor(group, key, kind = '', section = 'conditions') {
  const set = REEF_IMAGES[group]?.[section] || {};
  const images = asList(kind && set[`${kind}:${key}`]).length ? asList(set[`${kind}:${key}`]) : asList(set[key]);
  return { images, placeholder: images.length === 0 };
}

export const reefImageFor = (group, key, kind, section) => reefImagesFor(group, key, kind, section).images[0] || null;

export function reefSlotsFor(group, id, kind = '') {
  const { images } = reefImagesFor(group, id, kind);
  return REEF_SLOTS.map((slot, i) => ({ ...slot, image: images[i] || null }));
}
