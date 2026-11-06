// Per-fish-type picture sets, treatment-step pictures and fish-type pictures.
// The crops are content-hashed JPEGs on media.jez237.com; their geometry,
// provenance and hashes are in scripts/fish-health-lab/betta-pilot-images-20261105.json.
// A fish type without its own set falls back to the generic pictures.
import { CONDITIONS } from './data.mjs';
import { signImagesFor } from './choice-images.mjs';
import { leadSlot } from './visuals.mjs';
import { CROPS, IMAGE_SOURCE, MEDIA_BASE } from './fish-images-data.mjs';

// IMAGE_SOURCE 'media' (published) uses the content-hashed R2 keys on
// media.jez237.com. 'local' maps the same names onto the untracked preview copies
// (experiments/fish-health-lab/<subdir>/<file> -> local-images/<subdir>/<file>).
const KEY_PREFIX = 'experiments/fish-health-lab/';
export const localPathFor = entry => `local-images/${entry.key.slice(KEY_PREFIX.length)}`;
export const urlFor = entry => IMAGE_SOURCE === 'media' ? MEDIA_BASE + entry.key : localPathFor(entry);
const crop = id => CROPS[id] && { ...CROPS[id], url: urlFor(CROPS[id]) };

// Which crop shows each sign and each condition, per fish type. The first
// picture of a condition is its hero; the rest appear in the reference detail.
export const FISH_SETS = {
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
  const set = FISH_SETS[fishType];
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
export const FISH_TYPE_IMAGES = Object.fromEntries(['betta', 'goldfish', 'community', 'livebearer', 'cichlid', 'catfish', 'clownfish', 'tang', 'angel', 'wrasse', 'damsel', 'other']
  .map(id => [id, crop(`fish-${id}`)]));

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
