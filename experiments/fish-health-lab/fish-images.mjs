// Per-fish-type picture sets, treatment-step pictures and fish-type pictures.
// The crops are content-hashed JPEGs on media.jez237.com; their geometry,
// provenance and hashes are in scripts/fish-health-lab/betta-pilot-images-20261105.json
// (betta, steps, fish types), freshwater-images-20261105.json (goldfish,
// community, livebearer, cichlid, catfish) and split-images-20261105.json (the
// fish-type split: angelfish/discus, African/oscar, cory, pleco, guppy,
// molly/platy, gourami, barb/danio and the new fish-type tiles) and
// marine-fish-images-20261105.json (the seven saltwater fish types).
// A fish type without its own set, or a set without a picture for a result,
// falls back to the generic pictures.
import { CONDITIONS, currentFishId } from './data.mjs';
import { signImagesFor } from './choice-images.mjs';
import { leadSlot } from './visuals.mjs';
import { CROPS as BETTA_CROPS, IMAGE_SOURCE, MEDIA_BASE } from './fish-images-data.mjs';
import { CROPS as FRESH_CROPS, IMAGE_SOURCE as FRESH_IMAGE_SOURCE } from './fish-images-fresh-data.mjs';
import { CROPS as SPLIT_CROPS, IMAGE_SOURCE as SPLIT_IMAGE_SOURCE } from './fish-images-split-data.mjs';
import { CROPS as MARINE_CROPS, IMAGE_SOURCE as MARINE_IMAGE_SOURCE } from './fish-images-marine-data.mjs';
import { CROPS as FIX_CROPS, IMAGE_SOURCE as FIX_IMAGE_SOURCE } from './fish-images-fixes-data.mjs';
import { CROPS as DROPSY_CROPS, IMAGE_SOURCE as DROPSY_IMAGE_SOURCE } from './fish-images-dropsy-data.mjs';

// Each data file has its own IMAGE_SOURCE, so one batch can be published
// (uploaded to R2) while another is still previewed locally. 'media' uses the
// content-hashed R2 keys on media.jez237.com; 'local' maps the same names onto the
// untracked preview copies (experiments/fish-health-lab/<subdir>/<file> ->
// local-images/<subdir>/<file>). An entry without a source uses IMAGE_SOURCE.
const KEY_PREFIX = 'experiments/fish-health-lab/';
const withSource = (crops, source) => Object.fromEntries(Object.entries(crops).map(([id, entry]) => [id, { ...entry, source }]));
const PUBLISHED_CROPS = { ...withSource(BETTA_CROPS, IMAGE_SOURCE), ...withSource(FRESH_CROPS, FRESH_IMAGE_SOURCE), ...withSource(SPLIT_CROPS, SPLIT_IMAGE_SOURCE), ...withSource(MARINE_CROPS, MARINE_IMAGE_SOURCE) };
// Clean-up retakes (Nov 6 2026, fish-images-fixes-data.mjs) replace a crop under the same id;
// a retake without its own caption keeps the old one.
const FISH_FIXES = Object.fromEntries(Object.entries(FIX_CROPS).filter(([id, e]) => e.set === 'fish' && PUBLISHED_CROPS[id])
  .map(([id, e]) => [id, { ...PUBLISHED_CROPS[id], ...e, source: FIX_IMAGE_SOURCE }]));
// Saltwater dropsy with raised scales (Nov 6 2026 combination sweep): new crops, not replacements.
export const ALL_CROPS = { ...PUBLISHED_CROPS, ...FISH_FIXES, ...withSource(DROPSY_CROPS, DROPSY_IMAGE_SOURCE) };
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
// Saltwater sets (Nov 5 2026): sheet A is the 12 symptom choices, sheet B the marine
// results, plus one smooth growth per fish. Every marine result has a picture of the
// chosen kind of fish; the matching symptom picture follows as a second view.
const MARINE_CONDITIONS = {
  water: ['breathing'],
  'ich-marine': ['ich', 'dots'],
  'velvet-marine': ['velvet', 'dust'],
  brooklynella: ['brooklynella', 'patch'],
  uronema: ['uronema'],
  'black-spot': ['black-spot'],
  hlle: ['hlle'],
  flukes: ['flukes'],
  'fin-rot': ['fins'],
  ulcer: ['sores'],
  septicemia: ['septicemia'],
  dropsy: ['dropsy', 'swollen'],
  bloat: ['swollen'],
  popeye: ['popeye'],
  'cloudy-eye': ['eyes'],
  'swim-bladder': ['balance'],
  lymphocystis: ['lymphocystis', 'lumps'],
  growth: ['growth'],
  injury: ['injury'],
  normal: ['normal'],
};
const marineSet = prefix => ({
  water: 'marine',
  signs: Object.fromEntries(SIGN_IDS.map(id => [id, `${prefix}-${id}`])),
  conditions: Object.fromEntries(Object.entries(MARINE_CONDITIONS).map(([id, cells]) => [id, cells.map(cell => `${prefix}-${cell}`)])),
});
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
  // Saltwater: clownfish (Brooklynella), tangs (black spot, HLLE), angels and
  // butterflyfish (HLLE, lymphocystis), wrasses and gobies/blennies (jumping injuries;
  // gobies rest on the sand normally), damsels/chromis (velvet, Uronema), dottybacks/basslets.
  ...Object.fromEntries(['clownfish', 'tang', 'angel', 'wrasse', 'goby', 'damsel', 'dottyback'].map(id => [id, marineSet(id)])),
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

// What a picture shows, read from its written description (alt text). A result leads with
// the picture of the answer that led to it (Jez, Nov 6 2026 19:21: "check all the combinations
// so that this type of mismatch does not occur"). File names are not reliable for this: a
// saltwater "-eyes" crop is a cloudy eye, a freshwater one a bulging eye (Astra, 19:50).
const WHITE = [/white|grain|salt/i, /black|dust/i];
export const FEATURE_PICTURES = {
  breathing: [/gasp|breath|mouth open|gills? (held )?(open|flared)/i], gasping: [/gasp|breath|surface/i],
  'red-gills': [/red(,? inflamed)? gills|gills?[^.]*red/i],
  dots: WHITE, 'dots:white': WHITE, 'dots:unclear': WHITE, 'dots:black': [/black|pepper/i],
  dust: [/dust|speckl/i], fuzz: [/cotton|fluffy|tuft|fuzz|filament|cauliflower|growths/i],
  patch: [/patch|saddle|pale|pit|slime/i], 'patch:flat': [/patch|saddle/i], 'patch:unclear': [/patch|saddle|pale/i],
  'patch:slime': [/slime|peel|haze/i], 'patch:pits': [/\bpits?\b/i],
  fins: [/fin|tail|barbel/i],
  sores: [/sore|ulcer|wound|crater/i], 'sores:open': [/sore|ulcer|crater/i], 'sores:unclear': [/sore|ulcer|wound|red/i],
  'sores:streaks': [/streak|blotch/i], 'sores:scrape': [/scrape|cut|wound|split|torn|notch|chunk|sore/i],
  swollen: [/swollen|belly|abdomen|bloat/i], 'swollen:flat': [/swollen|belly|abdomen/i, /pinecone|pine cone/i], 'swollen:unclear': [/swollen|belly|abdomen|bloat/i],
  // Corys and plecos have no scales to raise: their dropsy picture is a tight, bloated belly.
  'swollen:pinecone': [/pinecone|pine cone|\btight\b/i], pinecone: [/pinecone|pine cone|\btight\b/i],
  eyes: [/eye/i], 'eyes:unclear': [/eye/i], 'eyes:cloudy': [/milky|cloudy/i, /bulg|protrud/i], 'eyes:bulging': [/bulg|protrud/i],
  balance: [/tilt|float|sink|upside|on its side|head-?down|headstand|lying/i],
  lumps: [/lump|growth|cauliflower|cluster/i], 'lumps:unclear': [/lump|growth|cauliflower|cluster/i],
  'lumps:cauliflower': [/cauliflower|cluster|growths/i], 'lumps:smooth': [/lump/i, /cauliflower|cluster/i], 'lumps:inflamed': [/red|sore|inflam/i],
  unclear: [/no marks|no obvious|clamped|hiding|resting|lesion|wobbl/i],
  rubbing: [/rub|scratch|scrap|flash/i],
};
export const pictureShows = (image, feature) => {
  const rule = FEATURE_PICTURES[feature];
  return Boolean(rule && image?.alt && rule[0].test(image.alt) && !(rule[1] && rule[1].test(image.alt)));
};
const ruleFor = feature => FEATURE_PICTURES[feature] ? feature : FEATURE_PICTURES[feature.split(':')[0]] ? feature.split(':')[0] : null;
// Results whose generic picture is only a plain sign borrow a fish that shows the disease itself.
const GENERIC_SET = {
  'black-spot': 'tang', hlle: 'tang', 'hole-in-head': 'angelfish', brooklynella: 'clownfish', uronema: 'damsel',
  septicemia: { fresh: 'guppy', marine: 'clownfish' }, growth: { fresh: 'betta', marine: 'clownfish' }, flukes: { fresh: 'community', marine: 'clownfish' },
  // The generic eye picture is cloudy *and* bulging; the guide asks which one it is (Astra, Nov 6 19:50).
  'cloudy-eye': { fresh: 'betta', marine: 'clownfish' }, popeye: { fresh: 'guppy', marine: 'clownfish' },
  dropsy: { fresh: 'betta', marine: 'clownfish' },
};

// Pictures for a sign ("dots") or a condition ("ich-fresh") for this fish type.
// Returns { images, fishSpecific }: the fish's own pictures when it has a set,
// otherwise the existing generic picture. With `features` (a result's answers: its
// matched signs, then behaviors) the picture showing one of those answers comes first,
// or, when none does, the picture of the answer itself (this fish's, else the generic one).
export function imagesFor(fishType, key, water = 'fresh', features = null) {
  const set = fishSetFor(fishType, water);
  const condition = CONDITIONS.find(c => c.id === key);
  let ids = set ? (set.conditions[key] || (set.signs[key] ? [set.signs[key]] : [])) : [];
  const fishSpecific = ids.length > 0;
  let borrowed = null;
  if (!ids.length && condition && features?.length && GENERIC_SET[key]) { // results only; the library keeps its generic pictures
    const pick = GENERIC_SET[key], other = FISH_SETS[typeof pick === 'string' ? pick : pick[water]];
    if (other && other.water === water) { ids = other.conditions[key] || []; borrowed = other; }
  }
  let images = ids.map(crop).filter(Boolean);
  if (!images.length) {
    const generic = condition ? genericCondition(key, water) : signImagesFor(water)[key];
    images = generic ? [generic] : [];
  }
  if (condition && features?.length && images.length) {
    const ruled = features.map(ruleFor).filter(Boolean);
    for (const feature of ruled) {
      const at = images.findIndex(image => pictureShows(image, feature));
      if (at >= 0) return { images: [images[at], ...images.filter((_, i) => i !== at)], fishSpecific };
    }
    if (ruled.length) {
      // Nothing in this result's pictures shows the answer: another picture of this fish that does,
      // else this fish's picture for the sign itself, else the generic sign picture.
      const first = ruled[0], base = first.split(':')[0];
      const from = set || borrowed;
      const pool = from ? [...new Set([...Object.values(from.conditions).flat(), ...Object.values(from.signs)])].map(crop).filter(Boolean) : [];
      const answer = pool.find(image => pictureShows(image, first))
        || [set?.signs[base] ? crop(set.signs[base]) : null, signImagesFor(water)[base]].find(image => image && (!FEATURE_PICTURES[first] || pictureShows(image, first) || first === base));
      if (answer) return { images: [answer, ...images], fishSpecific };
    }
  }
  return { images, fishSpecific };
}

export const imageFor = (fishType, key, water, features = null) => imagesFor(fishType, key, water, features).images[0] || null;

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
