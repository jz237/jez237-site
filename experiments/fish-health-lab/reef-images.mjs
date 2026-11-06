// Reef picture manifest. Shrimp/crab/snail pictures (Jez, Nov 6 2026 01:08 EST:
// "Do shrimp crab or snail now ... as they would typically look in a typical
// aquarium") come from reef-images-inverts-data.mjs; coral and anemone pictures
// (Jez, Nov 6 2026 05:11 EST: "Proceed, don't go overboard on the realistic tank
// pics ...") come from reef-images-corals-data.mjs. Each set has its own
// IMAGE_SOURCE, so one can be published while the other is still a local preview.
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
import { CROPS as CORAL_CROPS, IMAGE_SOURCE as CORAL_IMAGE_SOURCE } from './reef-images-corals-data.mjs';

// 'media' = content-hashed R2 keys on media.jez237.com; 'local' = the untracked
// preview copies (experiments/fish-health-lab/corals/x.jpg → local-images/corals/x.jpg).
const KEY_PREFIX = 'experiments/fish-health-lab/';
const urlFor = (entry, source) => source === 'media' ? MEDIA_BASE + entry.key : `local-images/${entry.key.slice(KEY_PREFIX.length)}`;
export const invertUrlFor = entry => urlFor(entry, INVERT_IMAGE_SOURCE);
export const coralUrlFor = entry => urlFor(entry, CORAL_IMAGE_SOURCE);
const picker = (crops, url, name) => id => {
  const entry = crops[id];
  if (!entry) throw new Error(`reef-images: no ${name} crop ${id}`);
  return { id, ...entry, url: url(entry) };
};
const invertPic = picker(INVERT_CROPS, invertUrlFor, 'invert');
const coralPic = picker(CORAL_CROPS, coralUrlFor, 'coral');

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

// Corals: plain sign tiles use the most typical coral for that problem (acropora
// for bleaching/peeling/pests, a hammer coral for brown jelly, a toadstool leather
// for "won't open"); kind keys swap in the right coral where the animal matters.
export const CORAL_SET = {
  kinds: { soft: 'kind-soft', lps: 'kind-lps', sps: 'kind-sps', anemone: 'kind-anemone' },
  signs: {
    bleach: 'sign-bleach', peeling: 'sign-peeling', 'brown-jelly': 'sign-brown-jelly', closed: 'sign-closed',
    browning: 'sign-browning', 'red-bugs': 'sign-red-bugs', flatworms: 'sign-flatworms', slugs: 'sign-slugs',
    bites: 'sign-bites', 'zoa-melt': 'sign-zoa-melt', anemone: 'sign-anemone', aiptasia: 'sign-aiptasia',
    unclear: 'sign-unclear',
    'soft:bleach': 'sign-soft-bleach', 'lps:bleach': 'sign-lps-bleach', 'anemone:bleach': 'sign-anemone-bleach',
    'lps:peeling': 'sign-lps-peeling',
    'sps:brown-jelly': 'sign-sps-brown-jelly',
    'lps:closed': 'sign-lps-closed', 'sps:closed': 'sign-sps-closed',
    'lps:browning': 'sign-lps-browning', 'anemone:browning': 'sign-anemone-browning',
    'soft:slugs': 'sign-soft-slugs',
    'sps:bites': 'sign-sps-bites', 'soft:bites': 'sign-soft-bites', 'anemone:bites': 'sign-anemone-bites',
    'anemone:unclear': 'sign-anemone-unclear',
  },
  conditions: {
    bleaching: ['cond-bleaching', 'sign-lps-bleach', 'sign-anemone-bleach'],
    'alk-swing': ['cond-alk-swing', 'sign-lps-closed', 'sign-lps-peeling'],
    'high-nutrients': ['cond-high-nutrients', 'sign-browning', 'sign-lps-browning'],
    'low-nutrients': ['cond-low-nutrients'],
    rtn: ['cond-rtn', 'sign-peeling'],
    stn: ['cond-stn'],
    'brown-jelly': ['cond-brown-jelly', 'sign-brown-jelly', 'sign-sps-brown-jelly'],
    'light-shock': ['cond-light-shock'],
    'flow-placement': ['cond-flow-placement'],
    'red-bugs': ['cond-red-bugs', 'sign-red-bugs'],
    aefw: ['cond-aefw', 'sign-flatworms', 'sign-sps-bites'],
    'monti-nudi': ['cond-monti-nudi', 'sign-slugs'],
    'zoa-pests': ['cond-zoa-pests', 'sign-zoa-melt', 'sign-soft-slugs'],
    aiptasia: ['cond-aiptasia', 'sign-aiptasia'],
    'anemone-stress': ['cond-anemone-stress', 'sign-anemone', 'sign-anemone-unclear'],
    nipped: ['cond-nipped', 'sign-bites', 'sign-soft-bites'],
    'coral-normal': ['cond-coral-normal', 'sign-closed'],
    'soft:bleaching': ['sign-soft-bleach', 'cond-bleaching'],
    'lps:bleaching': ['sign-lps-bleach', 'cond-bleaching'],
    'anemone:bleaching': ['sign-anemone-bleach', 'cond-bleaching'],
    'sps:brown-jelly': ['sign-sps-brown-jelly', 'cond-brown-jelly'],
    'lps:high-nutrients': ['sign-lps-browning', 'cond-high-nutrients'],
    'anemone:high-nutrients': ['sign-anemone-browning', 'cond-high-nutrients'],
    'soft:nipped': ['sign-soft-bites', 'cond-nipped'],
    'anemone:nipped': ['sign-anemone-bites', 'cond-nipped'],
  },
};

const mapValues = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
const build = (set, pic) => ({
  kinds: mapValues(set.kinds, pic),
  signs: mapValues(set.signs, pic),
  conditions: mapValues(set.conditions, ids => ids.map(pic)),
});

export const REEF_IMAGES = {
  coral: build(CORAL_SET, coralPic),
  invert: build(INVERT_SET, invertPic),
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
