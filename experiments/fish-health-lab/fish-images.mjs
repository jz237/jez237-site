// Per-fish-type picture sets, treatment-step pictures and fish-type pictures.
// The crops are content-hashed JPEGs on media.jez237.com; their geometry,
// provenance and hashes are in scripts/fish-health-lab/betta-pilot-images-20261105.json
// (betta, steps, fish types), freshwater-images-20261105.json (goldfish,
// community, livebearer, cichlid, catfish) and split-images-20261105.json (the
// fish-type split: angelfish/discus, African/oscar, cory, pleco, guppy,
// molly/platy, gourami, barb/danio and the new fish-type tiles).
// A fish type without its own set, or a set without a picture for a result,
// falls back to the generic pictures.
import { CONDITIONS, currentFishId } from './data.mjs';
import { signImagesFor } from './choice-images.mjs';
import { leadSlot } from './visuals.mjs';
import { CROPS as BETTA_CROPS, IMAGE_SOURCE, MEDIA_BASE } from './fish-images-data.mjs';
import { CROPS as FRESH_CROPS, IMAGE_SOURCE as FRESH_IMAGE_SOURCE } from './fish-images-fresh-data.mjs';
import { CROPS as SPLIT_CROPS, IMAGE_SOURCE as SPLIT_IMAGE_SOURCE } from './fish-images-split-data.mjs';

// Each data file has its own IMAGE_SOURCE, so one batch can be published
// (uploaded to R2) while another is still previewed locally. 'media' uses the
// content-hashed R2 keys on media.jez237.com; 'local' maps the same names onto the
// untracked preview copies (experiments/fish-health-lab/<subdir>/<file> ->
// local-images/<subdir>/<file>). An entry without a source uses IMAGE_SOURCE.
const KEY_PREFIX = 'experiments/fish-health-lab/';
const withSource = (crops, source) => Object.fromEntries(Object.entries(crops).map(([id, entry]) => [id, { ...entry, source }]));
export const ALL_CROPS = { ...withSource(BETTA_CROPS, IMAGE_SOURCE), ...withSource(FRESH_CROPS, FRESH_IMAGE_SOURCE), ...withSource(SPLIT_CROPS, SPLIT_IMAGE_SOURCE) };
export const localPathFor = entry => `local-images/${entry.key.slice(KEY_PREFIX.length)}`;
export const urlFor = entry => (entry.source || IMAGE_SOURCE) === 'media' ? MEDIA_BASE + entry.key : localPathFor(entry);
const crop = id => ALL_CROPS[id] && { ...ALL_CROPS[id], url: urlFor(ALL_CROPS[id]) };

// The standard freshwater mapping (the betta pilot's), for a set whose crops are
// named <prefix>-<cell>. `extra` adds or replaces conditions; `skip` drops ones a
// fish has no picture for (they fall back to the generic picture); `reuse` points a
// cell at an already-published crop of the right fish from an older, wider set.
const SIGN_IDS = ['dots', 'dust', 'fuzz', 'patch', 'fins', 'sores', 'swollen', 'eyes', 'lumps', 'breathing', 'balance', 'unclear'];
const STANDARD_CONDITIONS = {
  water: ['breathing', 'red-gills'],
  'ich-fresh': ['dots'],
  'velvet-fresh': ['dust'],
  'water-mold': ['fuzz'],
  columnaris: ['patch', 'cotton-mouth'],
  'fin-rot': ['fins'],
  ulcer: ['sores'],
  septicemia: ['septicemia'],
  dropsy: ['dropsy'],
  bloat: ['swollen'],
  popeye: ['eyes'],
  'cloudy-eye': ['cloudy-eye'],
  'swim-bladder': ['balance', 'sinking'],
  flukes: ['flukes', 'slime'],
  lymphocystis: ['lumps'],
  growth: ['growth'],
  injury: ['injury'],
  'hole-in-head': ['hole-in-head'],
  normal: ['normal'],
};
const freshSet = (prefix, { extra = {}, skip = [], reuse = {} } = {}) => {
  const cropId = cell => reuse[cell] || `${prefix}-${cell}`;
  return {
    water: 'fresh',
    signs: Object.fromEntries(SIGN_IDS.map(id => [id, cropId(id)])),
    conditions: Object.fromEntries(Object.entries({ ...STANDARD_CONDITIONS, ...extra })
      .filter(([id]) => !skip.includes(id))
      .map(([id, cells]) => [id, cells.map(cropId)])),
  };
};
const from = (old, cells) => Object.fromEntries(cells.map(cell => [cell, `${old}-${cell}`]));

// Which crop shows each sign and each condition, per fish type. The first
// picture of a condition is its hero; the rest appear in the reference detail.
export const FISH_SETS = {
  // Goldfish: swim bladder is the key problem (upside down, head-down, stuck on
  // the bottom); hole-in-the-head is a cichlid problem, so it stays generic.
  goldfish: freshSet('goldfish', { extra: { 'swim-bladder': ['balance', 'headstand', 'sinking'] }, skip: ['hole-in-head'] }),
  // Tetras and rasboras: a second ich picture shows dots across a school.
  community: freshSet('community', { extra: { 'ich-fresh': ['dots', 'school-dots'] }, skip: ['hole-in-head'] }),
  // The old livebearer, cichlid and catfish sets were split by kind of fish (Nov 5
  // 2026). Their published cells are re-used wherever a cell shows the right fish;
  // the rest are new cells. Old ids map to the first sub-group (LEGACY_FISH_IDS).
  // Guppies: a pregnant female is shown beside bloat because the two look alike.
  guppy: freshSet('guppy', {
    extra: { bloat: ['swollen', 'pregnant'] }, skip: ['hole-in-head'],
    reuse: from('livebearer', ['fuzz', 'fins', 'lumps', 'balance', 'unclear', 'septicemia', 'pregnant', 'normal']),
  }),
  // Mollies and platies: the "shimmies" (the listless picture) is usually the water.
  molly: freshSet('molly', {
    extra: { bloat: ['swollen', 'pregnant'], water: ['breathing', 'red-gills', 'unclear'] }, skip: ['hole-in-head'],
    reuse: from('livebearer', ['dots', 'dust', 'patch', 'sores', 'swollen', 'eyes', 'breathing', 'dropsy', 'cloudy-eye', 'growth', 'flukes', 'injury', 'red-gills', 'cotton-mouth', 'sinking', 'slime']),
  }),
  // Barbs and danios: a second ich picture shows dots across a school.
  barb: freshSet('barb', { extra: { 'ich-fresh': ['dots', 'school-dots'] }, skip: ['hole-in-head'] }),
  // Gouramis: dwarf gourami disease (faded colour, sores, swelling) sits with ulcers and bloat.
  gourami: freshSet('gourami', { extra: { ulcer: ['sores', 'dgd'], bloat: ['swollen', 'dgd'] }, skip: ['hole-in-head'] }),
  // Angelfish and discus: the full set, with a discus for hole-in-the-head.
  angelfish: freshSet('angelfish', {
    reuse: from('cichlid', ['fuzz', 'fins', 'sores', 'eyes', 'lumps', 'breathing', 'unclear', 'septicemia', 'growth', 'normal', 'cotton-mouth', 'slime']),
  }),
  // African cichlids and oscars: the full set; Malawi bloat sits beside bloat.
  african: freshSet('african', {
    extra: { bloat: ['swollen', 'malawi-bloat'] },
    reuse: from('cichlid', ['dots', 'patch', 'swollen', 'dropsy', 'cloudy-eye', 'flukes', 'hole-in-head', 'injury']),
  }),
  // Catfish have no scales to pinecone (dropsy is a bloated, tight belly) and
  // lying on their side replaces "sinking". Corys: worn barbels sit with fin rot,
  // a red sore belly from dirty gravel with ulcers.
  cory: freshSet('cory', {
    extra: { 'fin-rot': ['fins', 'barbels'], 'swim-bladder': ['balance', 'on-side'], ulcer: ['sores', 'red-belly'] }, skip: ['hole-in-head'],
    reuse: from('catfish', ['dust', 'fuzz', 'patch', 'sores', 'swollen', 'balance', 'unclear', 'septicemia', 'dropsy', 'growth', 'flukes', 'barbels', 'injury', 'normal', 'red-gills', 'cotton-mouth', 'on-side']),
  }),
  // Plecos: a sunken belly (underfeeding) is shown beside bloat as the opposite diet problem.
  pleco: freshSet('pleco', {
    extra: { 'swim-bladder': ['balance', 'on-side'], bloat: ['swollen', 'sunken-belly'] }, skip: ['hole-in-head'],
    reuse: from('catfish', ['dots', 'fins', 'eyes', 'lumps', 'breathing', 'cloudy-eye', 'slime']),
  }),
  betta: {
    water: 'fresh',
    signs: {
      dots: 'betta-dots', dust: 'betta-dust', fuzz: 'betta-fuzz', patch: 'betta-patch',
      fins: 'betta-fins', sores: 'betta-sores', swollen: 'betta-swollen', eyes: 'betta-eyes',
      lumps: 'betta-lumps', breathing: 'betta-breathing', balance: 'betta-balance', unclear: 'betta-unclear',
    },
    conditions: {
      water: ['betta-breathing', 'betta-red-gills'],
      'ich-fresh': ['betta-dots'],
      'velvet-fresh': ['betta-dust'],
      'water-mold': ['betta-fuzz'],
      columnaris: ['betta-patch', 'betta-cotton-mouth'],
      'fin-rot': ['betta-fins'],
      ulcer: ['betta-sores'],
      septicemia: ['betta-septicemia'],
      dropsy: ['betta-dropsy'],
      bloat: ['betta-swollen'],
      popeye: ['betta-eyes'],
      'cloudy-eye': ['betta-cloudy-eye'],
      'swim-bladder': ['betta-balance', 'betta-sinking'],
      flukes: ['betta-flukes', 'betta-slime'],
      lymphocystis: ['betta-lumps'],
      growth: ['betta-growth'],
      injury: ['betta-injury'],
      'hole-in-head': ['betta-hole-in-head'],
      normal: ['betta-normal'],
    },
  },
};

export function fishSetFor(fishType, water) {
  const set = FISH_SETS[currentFishId(water || 'fresh', fishType)];
  return set && (!water || set.water === water) ? set : null;
}

const genericCondition = (id, water) => {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return null;
  const choices = signImagesFor(water);
  return leadSlot(id)?.image || choices[condition.thumb || condition.art] || choices.unclear;
};

// Pictures for a sign ("dots") or a condition ("ich-fresh") for this fish type.
// Returns { images, fishSpecific }: the fish's own pictures when it has a set,
// otherwise the existing generic picture.
export function imagesFor(fishType, key, water = 'fresh') {
  const set = fishSetFor(fishType, water);
  const ids = set ? (set.conditions[key] || (set.signs[key] ? [set.signs[key]] : [])) : [];
  const own = ids.map(crop).filter(Boolean);
  if (own.length) return { images: own, fishSpecific: true };
  const generic = CONDITIONS.some(c => c.id === key) ? genericCondition(key, water) : signImagesFor(water)[key];
  return { images: generic ? [generic] : [], fishSpecific: false };
}

export const imageFor = (fishType, key, water) => imagesFor(fishType, key, water).images[0] || null;

// Fish-type step pictures (healthy fish). "other" is the shared Not sure choice.
// Guppy and angelfish/discus keep the published livebearer and cichlid tiles.
const TILE_CROPS = { guppy: 'fish-livebearer', angelfish: 'fish-cichlid' };
export const FISH_TYPE_IMAGES = Object.fromEntries([
  'betta', 'goldfish', 'guppy', 'molly', 'community', 'barb', 'gourami', 'angelfish', 'african', 'cory', 'pleco',
  'clownfish', 'tang', 'angel', 'wrasse', 'goby', 'damsel', 'dottyback', 'other',
].map(id => [id, crop(TILE_CROPS[id] || `fish-${id}`)]));

// Treatment-step pictures, shared by every fish. Rules are tried in order on a
// step's first sentence, then on the whole step. "urgent" steps get a red
// marker instead of a picture.
export const STEP_IMAGES = Object.fromEntries(['hospital', 'test', 'water-change', 'conditioner', 'medicine', 'heat', 'salt', 'aeration', 'pea', 'gravel', 'divider', 'watch']
  .map(id => [id, crop(`step-${id}`)]));

const STEP_RULES = [
  ['urgent', /^act (now|today|fast)/i],
  ['hospital', /\bmove\b/i],
  ['divider', /bull(y|ies)|nipp|separate/i],
  ['test', /\btest\b|check the water/i],
  ['water-change', /water change/i],
  ['conditioner', /conditioner|detoxif/i],
  ['medicine', text => !/no (home )?medicine/i.test(text) && /medication|medicated|treat (the|with|in)|keep treating|repeat( the)? treatment|praziquantel|copper|formalin|antibacterial|antifungal|metronidazole|chloroquine|\bdip\b/i.test(text)],
  ['heat', /temperature|\bheat|warm/i],
  ['aeration', /aeration|air stone|oxygen/i],
  ['salt', /\bsalt\b/i],
  ['gravel', /vacuum|gravel|uneaten|leftover|carbon|decoration/i],
  ['pea', /skip feeding|\bfeed|\bpea\b|diet|\bfoods?\b/i],
  ['watch', /watch|photo|compare|wait|leave|keep|look|clean water|clear|time/i],
];
const matches = (test, text) => typeof test === 'function' ? test(text) : test.test(text);

export function stepImageFor(step) {
  const first = step.split(/(?<=[.!?])\s/)[0];
  for (const text of [first, step]) {
    const rule = STEP_RULES.find(([, test]) => matches(test, text));
    if (rule) return { id: rule[0], image: STEP_IMAGES[rule[0]] || null };
  }
  return { id: 'watch', image: STEP_IMAGES.watch };
}

// One short line per step: the first sentence leads, anything after it is a
// smaller follow-on note.
export function splitStep(step) {
  const [lead, ...rest] = step.split(/(?<=[.!?])\s/);
  return { lead, more: rest.join(' ') };
}
