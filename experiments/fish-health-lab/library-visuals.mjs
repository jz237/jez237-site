// Reference-library visual pages for the fish diseases (Jez, Nov 6 2026 09:30–09:38 EST:
// the library was missing pictures; "I'd like to see more detailed visual information such
// as infographic and close-ups images of the disease ... in addition to what you said" →
// "Yes proceed with your recommendation": an on-page infographic with real text, AI
// pictures only).
//
// Each disease page: an infographic (four numbered close-ups, a "where it shows" fish map,
// how it changes over time, and a "not this" look-alike), then the same disease on every
// kind of fish that has a picture (the fish-type sets the guided check already uses).
import { CONDITIONS, FISH_TYPES } from './data.mjs';
import { FISH_SETS, ALL_CROPS, urlFor } from './fish-images.mjs';
import { slotsFor } from './visuals.mjs';
import { MEDIA_BASE } from './fish-images-data.mjs';
import { CROPS as LIB_CROPS, IMAGE_SOURCE as LIB_IMAGE_SOURCE } from './library-images-data.mjs';
import { CROPS as LIB_REEF_CROPS, IMAGE_SOURCE as LIB_REEF_IMAGE_SOURCE } from './library-reef-images-data.mjs';

// Where on the fish it shows (keys of ZONES) and how it usually changes.
export const LIB_INFO = {
  water: { zones: ['gills', 'mouth', 'fins'], time: ['Hanging at the top, breathing faster', 'Gasping, red gills, clamped fins', 'Lying on the bottom, fish dying'] },
  'ich-fresh': { zones: ['fins', 'body', 'gills'], time: ['A few salt grains on the fins', 'Grains spread over body and fins', 'Covered, rubbing, breathing hard'] },
  'ich-marine': { zones: ['fins', 'body', 'gills'], time: ['A few dots on the fins', 'Dots over body, scratching', 'Fast breathing, off food'] },
  'velvet-fresh': { zones: ['body', 'fins', 'gills'], time: ['Faint gold sheen, clamped fins', 'Gold dust all over', 'Peeling skin, fast breathing'] },
  'velvet-marine': { zones: ['body', 'fins', 'gills'], time: ['Fast breathing, faint dust', 'Gold dust, cloudy eyes', 'Peeling skin, deaths within days'] },
  'water-mold': { zones: ['body', 'fins'], time: ['A small white tuft on a wound', 'Fluffy cotton growing out', 'Large grey patches'] },
  columnaris: { zones: ['body', 'mouth', 'fins', 'gills'], time: ['A pale patch or fuzzy lips', 'Saddle patch spreads', 'Eroded fins and gills, fast'] },
  'fin-rot': { zones: ['fins'], time: ['Milky or cloudy fin edge', 'Ragged edge, red streaks', 'Fins rotted short'] },
  ulcer: { zones: ['body'], time: ['A raised red spot', 'An open red crater', 'Deep sore, more fish affected'] },
  septicemia: { zones: ['fins', 'belly', 'gills'], time: ['Pink tinge in the fins', 'Red streaks and blotches', 'Bloody patches, lethargic'] },
  dropsy: { zones: ['belly', 'body', 'eyes'], time: ['Belly swelling', 'Scales start to lift', 'Pine-cone scales all over'] },
  bloat: { zones: ['belly'], time: ['Round belly after eating', 'Stringy or no poop', 'Floating or tilting'] },
  popeye: { zones: ['eyes'], time: ['Eye looks a bit larger', 'Eye bulging out', 'Cloudy, bloody or both eyes'] },
  'cloudy-eye': { zones: ['eyes'], time: ['A slight grey haze', 'Milky film over the eye', 'Both eyes white'] },
  'swim-bladder': { zones: ['belly', 'body'], time: ['Slight tilt after meals', 'Floating or head-down', 'Stuck at the top or bottom'] },
  flukes: { zones: ['gills', 'body'], time: ['Occasional rubbing', 'Flashing, fast breathing', 'Grey slime, red gills'] },
  lymphocystis: { zones: ['fins', 'mouth', 'body'], time: ['A few small pearls', 'Cauliflower clusters', 'Large clumps (fall off later)'] },
  growth: { zones: ['body', 'head'], time: ['A small smooth bump', 'A larger lump', 'Grows slowly over months'] },
  injury: { zones: ['fins', 'body'], time: ['Fresh tear or scrape', 'Edges heal clean', 'Regrows in 2–4 weeks'] },
  uronema: { zones: ['body'], time: ['A pale blotch', 'Red raw patch', 'Deep ulcers, fish dies fast'] },
  brooklynella: { zones: ['body', 'gills'], time: ['A faint milky haze', 'Thick white slime', 'Skin peeling, hard breathing'] },
  'black-spot': { zones: ['body', 'fins'], time: ['A few black specks', 'Pepper all over', 'Rubbing, off food'] },
  hlle: { zones: ['head', 'lateralLine'], time: ['Pale pinholes on the face', 'Pits along the head', 'Eroded channels along the side'] },
  'hole-in-head': { zones: ['head', 'lateralLine'], time: ['Small pits on the forehead', 'Pits with white matter', 'Larger holes along the side'] },
};

export const ZONES = {
  fins: 'Fins & tail', body: 'Body', gills: 'Gills', eyes: 'Eyes', mouth: 'Mouth', belly: 'Belly', head: 'Head', lateralLine: 'Lateral line',
};

// Side-view fish map: each zone is a highlightable shape.
const ZONE_SHAPES = {
  fins: '<path d="M52 72 18 46l8 30-8 30 34-28Z"/><path d="M96 46q22-28 54-16l6 18Z"/><path d="M110 104q14 20 38 14l4-12Z"/><path d="M128 84q14 6 18 22l-14-4Z"/>',
  body: '<path d="M60 76q26-34 88-34 18 2 30 10l-6 48q-34 18-112 0Z"/>',
  gills: '<path d="M176 56q-10 24 0 44l8-4q-6-18 0-36Z"/>',
  eyes: '<circle cx="196" cy="68" r="7"/>',
  mouth: '<path d="M212 78q8 2 10 6-4 4-10 4Z"/>',
  belly: '<path d="M88 96q40 14 84 2l-2 10q-40 12-80-2Z"/>',
  head: '<path d="M180 52q22 4 34 22-4 18-34 26Z"/>',
  lateralLine: '<path d="M62 78q60-10 118-8" fill="none" stroke-width="5" stroke-linecap="round"/>',
};

export function fishMap(zones = []) {
  const on = new Set(zones);
  const outline = '<path class="map-outline" d="M52 76q30-40 100-38 46 2 70 38-24 34-70 36-70 2-100-36Z"/><path class="map-outline" d="M52 76 16 46l8 30-8 30Z"/>';
  const shapes = Object.entries(ZONE_SHAPES).map(([id, d]) => `<g class="map-zone${on.has(id) ? ' on' : ''}" data-zone="${id}">${d}</g>`).join('');
  return `<svg class="fish-map" viewBox="0 0 236 140" role="img" aria-label="Where it shows: ${zones.map(z => ZONES[z]).join(', ')}">${outline}${shapes}</svg>`;
}

const KEY_PREFIX = 'experiments/fish-health-lab/';
const libPic = id => {
  const [e, source] = LIB_CROPS[id] ? [LIB_CROPS[id], LIB_IMAGE_SOURCE] : [LIB_REEF_CROPS[id], LIB_REEF_IMAGE_SOURCE];
  return e && { id, ...e, url: source === 'media' ? MEDIA_BASE + e.key : `local-images/${e.key.slice(KEY_PREFIX.length)}` };
};

// Four close-ups: the new library sheet, or (ich, velvet, cottony growth) their existing detail pictures.
const OLD_DETAIL_SLOTS = ['closeup', 'subtle', 'marked', 'lookalikes', 'variations', 'overview'];
export function closeupsFor(id) {
  const fresh = [1, 2, 3, 4].map(n => libPic(`lib-${id}-${n}`)).filter(Boolean);
  if (fresh.length) return fresh;
  return OLD_DETAIL_SLOTS.map(slot => slotsFor(id).find(s => s.id === slot && s.image)).filter(Boolean).slice(0, 4)
    .map(s => ({ id: `${id}-${s.id}`, url: s.image.url, alt: s.image.alt, caption: s.label, width: s.image.width, height: s.image.height }));
}

// Same order as the "What kind of fish?" step: freshwater first.
const ORDER = ['fresh', 'marine'].flatMap(w => (FISH_TYPES[w] || []).map(f => `${w}:${f.id}`));
const fishTitle = (water, id) => FISH_TYPES[water]?.find(f => f.id === id)?.title || id;

// The disease on every kind of fish that has its own picture of it.
export function fishStripFor(id) {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return [];
  return Object.entries(FISH_SETS)
    .filter(([, set]) => set.conditions[id] && (condition.scope === 'both' || condition.scope === set.water))
    .map(([fishId, set]) => {
      const crop = ALL_CROPS[set.conditions[id][0]];
      return crop && { fish: fishId, water: set.water, title: fishTitle(set.water, fishId), url: urlFor(crop), alt: crop.alt, width: crop.width, height: crop.height };
    })
    .filter(Boolean)
    .sort((a, b) => ORDER.indexOf(`${a.water}:${a.fish}`) - ORDER.indexOf(`${b.water}:${b.fish}`));
}

// The picture that leads a library card: a fish-type picture, else the first close-up.
export function leadImageFor(id) {
  const strip = fishStripFor(id);
  return strip[0] || closeupsFor(id)[0] || null;
}

export const libraryPictureCount = id => fishStripFor(id).length + closeupsFor(id).length;

// Coral, shrimp/crab/snail and pond pages (same visual guide). Coral and invert pages
// list where to look instead of a fish map; pond pages use the fish map.
export const REEF_LIB_INFO = {
  bleaching: { look: ['Whole colony', 'Branch tips', 'Polyps still out'], time: ['Pale, pastel colour', 'Bone-white, flesh still on', 'Flesh starts to die if heat stays'] },
  'alk-swing': { look: ['Branch tips', 'Polyps', 'Several corals at once'], time: ['Polyps pulled in', 'Burnt tips', 'Flesh loss'] },
  'high-nutrients': { look: ['Colour', 'Rock and sand'], time: ['Colours dull', 'Brown corals, more algae', 'Algae smothering corals'] },
  'low-nutrients': { look: ['Colour', 'Growth'], time: ['Pastel colour', 'Pale, slow growth', 'Tissue thins, tips burn'] },
  rtn: { look: ['Branches', 'Flesh edge'], time: ['A white patch appears', 'Flesh slides off in hours', 'Whole colony white in a day or two'] },
  stn: { look: ['Base of the colony', 'Flesh edge'], time: ['A thin white band at the base', 'Creeps up a little each day', 'Algae grows on the bare skeleton'] },
  'brown-jelly': { look: ['Flesh', 'Neighbouring heads'], time: ['A brown slimy patch', 'Flesh dissolving under jelly', 'Spreads head to head'] },
  'light-shock': { look: ['Top of the coral', 'Shaded underside'], time: ['Polyps pulled in', 'Pale on top', 'White on top, underside fine'] },
  'flow-placement': { look: ['The side facing the pump', 'Neighbours', 'Shaded spots'], time: ['Stays shut', 'Brown or bent over', 'Flesh dies where stung or blasted'] },
  'red-bugs': { look: ['Branches (use a flashlight)'], time: ['Polyps stay in', 'Colour fades', 'Slow flesh loss'] },
  aefw: { look: ['Branches', 'Bare skeleton (eggs)'], time: ['Hard to see, slight fading', 'Half-moon bites', 'Flesh loss from the base'] },
  'monti-nudi': { look: ['Under the plate edges'], time: ['A few slugs', 'Egg spirals under the plates', 'Bare patches spreading'] },
  'zoa-pests': { look: ['Polyps', 'At night with a flashlight'], time: ['Polyps stay shut', 'White bumps or melting', 'Colony shrinks'] },
  aiptasia: { look: ['Rock', 'Near corals'], time: ['One or two small anemones', 'More every week', 'Corals nearby close up'] },
  'anemone-stress': { look: ['Foot and position', 'Mouth', 'Tentacles'], time: ['Wanders or hides', 'Shrinks, mouth gaping', 'Spits food, may bleach'] },
  nipped: { look: ['Edges', 'Missing polyps'], time: ['A few chewed polyps', 'Ragged edges', 'Patches gone'] },
  'failed-molt': { look: ['Behind the head', 'Tail'], time: ['Slow, hiding before a molt', 'Stuck half out', 'Dies if it can’t get free'] },
  copper: { look: ['Snails', 'Shrimp', 'Urchins and starfish'], time: ['Inverts slow down', 'Snails upturned, shrimp pale', 'Deaths within days'] },
  acclimation: { look: ['New arrivals', 'Starfish arms'], time: ['Still and pale', 'Shut in shell or curled', 'Deaths within a day or two'] },
  'invert-water': { look: ['Body colour', 'Waterline', 'Glass'], time: ['Milky shrimp, slow snails', 'Snails climb out', 'Several deaths'] },
  starvation: { look: ['Glass and rock (food left?)', 'Colour'], time: ['Slower, paler', 'Snails wander bare glass', 'Losses over weeks'] },
  bopyrid: { look: ['Side of the head'], time: ['A small bump', 'An obvious one-sided bulge', 'Usually stays like that'] },
  'invert-injury': { look: ['Legs and claws', 'Shells'], time: ['A missing leg', 'Fights, hermits out of shells', 'Regrows over 2–3 molts'] },
  flipped: { look: ['Sand'], time: ['On its back', 'Can’t turn over', 'Starves or gets eaten'] },
  'anchor-worm': { zones: ['body', 'fins'], time: ['A red spot', 'A thread sticking out', 'Several worms, sores'] },
  'fish-lice': { zones: ['body', 'fins'], time: ['Flashing, jumping', 'Discs on the skin, red marks', 'Sores, weak fish'] },
  'pond-ulcer': { zones: ['body'], time: ['A raised red lump', 'An open crater', 'Deep ulcer, several fish'] },
  'pond-bacterial': { zones: ['fins', 'belly', 'body'], time: ['Clamped fins', 'Red streaks and blotches', 'Listless, bleeding'] },
  'pond-flukes': { zones: ['gills', 'body'], time: ['Occasional rubbing', 'Darting, slimy skin', 'Gasping, pale gills'] },
  'pond-ich': { zones: ['fins', 'body', 'gills'], time: ['A few dots', 'Dots all over', 'Rubbing, gasping'] },
  'pond-low-oxygen': { zones: ['mouth', 'gills'], time: ['Fish near the surface', 'Gulping air at dawn', 'Deaths overnight'] },
  'pond-poor-water': { zones: ['fins', 'gills'], time: ['Listless fish', 'Clamped, red fins', 'Gasping, deaths'] },
  'pond-water-swing': { zones: ['gills'], time: ['Darting right after', 'Gasping, hanging still', 'Usually recovers in a day'] },
  'pond-fungus': { zones: ['body', 'fins'], time: ['A small tuft on a wound', 'Fluffy patches', 'Spreads over the body'] },
  'pond-dropsy': { zones: ['belly', 'body', 'eyes'], time: ['Swollen belly', 'Scales lift', 'Pine-cone all over'] },
  'carp-pox': { zones: ['body', 'fins'], time: ['Small waxy spots in cold water', 'Larger patches', 'Fades as it warms'] },
  khv: { zones: ['eyes', 'gills', 'body'], time: ['Listless, off food', 'Sunken eyes, rough skin', 'Fish dying within days'] },
  predator: { zones: ['body'], time: ['Fish hiding', 'Stab and scratch marks', 'Fish missing'] },
  'pond-swim-bladder': { zones: ['belly'], time: ['Tilting after food', 'Floating or head-down', 'Stuck top or bottom'] },
};
