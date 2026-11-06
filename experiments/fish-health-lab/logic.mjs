import { CONDITIONS, SYMPTOMS, BEHAVIORS, GROWTH_CHOICES, CLOSER_QUESTIONS, closerQuestionFor, fishTypeFor, URGENCY } from './data.mjs';
import { carePlanFor } from './treatments.mjs';

const closerLabels = Object.entries(CLOSER_QUESTIONS).flatMap(([sign, q]) => q.choices.filter(c => c.id !== 'unclear')
  .map(c => [`${sign}:${c.id}`, `${SYMPTOMS.find(s => s.id === sign).title}: ${c.title.toLowerCase()}`]));
const growthLabels = GROWTH_CHOICES.filter(c => c.id !== 'unclear').map(c => [`lumps:${c.id}`, `Raised lumps: ${c.title.toLowerCase()}`]);
export const LABELS = Object.fromEntries([...SYMPTOMS.map(s => [s.id, s.title]), ...BEHAVIORS.map(s => [s.id, s.label]), ...closerLabels, ...growthLabels, ['lumps:unclear', 'Raised lumps']]);
const numeric = value => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;
const DISTRESS = ['gasping', 'collapse', 'deaths'];
// Corys and plecos have armour plates, not scales; their swelling answers read differently.
const CATFISH = ['cory', 'pleco'];
const CATFISH_LABELS = { 'swollen:pinecone': 'Swollen tight all over', 'swollen:flat': 'Just a full, soft belly', pinecone: 'Swollen tight and stiff all over' };
// Look-alike checks that talk about scales, for corys and plecos.
const CATFISH_REASONS = { dropsy: 'Look from above: swollen tight and stiff all over = dropsy.', bloat: 'Look from above: just a full, soft belly = bloat.' };
const labelFor = (id, input) => (CATFISH.includes(input.fishType) && CATFISH_LABELS[id]) || LABELS[id] || id;

// Salinity as typed: "35 ppt", "35", "1.025" or "SG 1.025".
// → { ppt } when it can be read, { unreadable: true } when it can't, null when blank.
// Specific gravity 1.000–1.100 converts at about 25 °C; ppt is taken from 0–70.
export function readSalinity(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  if (/\d\s*[mµu]S(\/cm)?\b|siemens|conductiv/i.test(raw)) return { unreadable: true }; // conductivity, not salinity
  if (/-\s*\d/.test(raw)) return { unreadable: true }; // a negative reading
  const n = parseFloat(raw.replace(',', '.').replace(/^[^0-9.]+/, ''));
  if (!Number.isFinite(n) || n < 0) return { unreadable: true };
  // Units win when they're given: "%", "ppt"/"psu"/"‰", or "SG".
  if (/%/.test(raw)) return n <= 7 ? { ppt: n * 10 } : { unreadable: true };
  if (/ppt|psu|‰|g\/l/i.test(raw)) return n <= 70 ? { ppt: n } : { unreadable: true };
  if (/\bsg\b|specific gravity/i.test(raw)) return n >= 0.98 && n <= 1.1 ? { ppt: Math.max(0, (n - 1) * 1310) } : { unreadable: true };
  if (n >= 0.98 && n <= 1.1) return { ppt: Math.max(0, (n - 1) * 1310) };
  if (n > 1.1 && n < 3) return { unreadable: true };
  if (n <= 70) return { ppt: n };
  return { unreadable: true };
}
export const salinityPpt = text => readSalinity(text)?.ppt ?? null;
const UNSAFE_DETOX = 'do a water change now. A detoxifier that binds ammonia and nitrite helps too (if you’re also medicating, check both labels say they can be used together).';

export function assessUrgency(input) {
  const signs = new Set(input.signs || []);
  const urgent = [];
  const checks = [];
  if (signs.has('gasping')) urgent.push('Severe or continuous gasping');
  if (signs.has('collapse')) urgent.push('Loss of balance with poor responsiveness');
  if (signs.has('deaths')) urgent.push('Fish deaths during this problem');
  if (signs.has('pinecone') || (signs.has('swollen') && input.closer === 'pinecone')) urgent.push(CATFISH.includes(input.fishType) ? 'Tight, all-over swelling (possible dropsy)' : 'Raised, pinecone-like scales');
  if (input.water === 'marine' && (signs.has('breathing') || signs.has('gasping')) && signs.has('dust')) urgent.push('Marine fish with fast breathing and a fine dusting');
  const ammonia = numeric(input.ammonia), nitrite = numeric(input.nitrite);
  if (ammonia !== null && ammonia > 0) checks.push(`Ammonia is detectable—${UNSAFE_DETOX}`);
  if (ammonia !== null && ammonia >= 1) urgent.push(`Ammonia ${ammonia} ppm is toxic`);
  if (numeric(input.nitrite) !== null && numeric(input.nitrite) >= 1) urgent.push(`Nitrite ${numeric(input.nitrite)} ppm is toxic`);
  if (nitrite !== null && nitrite > 0) checks.push(input.water === 'marine'
    ? 'Nitrite is detectable—your biological filter may be struggling. Do a water change.'
    : 'Nitrite is detectable—do a water change and consider aquarium salt for salt-tolerant fish to protect the gills.');
  // Readings: outside the usual range → a water check; far outside → urgent as well.
  const marine = input.water === 'marine';
  const ph = numeric(input.ph);
  if (ph !== null && ph > 0) {
    const [low, high] = marine ? [7.8, 8.6] : [6, 8.5], [danger, dangerHigh] = marine ? [7.4, 9] : [5.5, 9.5];
    if (ph < danger || ph > dangerHigh) {
      urgent.push(`pH ${ph} is dangerously ${ph < danger ? 'low' : 'high'}`);
      checks.push(`pH ${ph} is far outside the usual ${low}–${high}. Do a partial water change now with temperature-matched water, then bring the rest back slowly over a few days.`);
    } else if (ph < low || ph > high) checks.push(`pH ${ph} is outside the usual ${low}–${high} for ${marine ? 'saltwater' : 'most freshwater fish'}—correct it slowly over a few days, not all at once.`);
  }
  const temp = numeric(input.temperature);
  if (temp !== null && temp > 0) {
    const unit = input.tempUnit === 'C' ? 'C' : 'F', f = unit === 'C' ? temp * 9 / 5 + 32 : temp;
    // [usual low, usual high, danger low, danger high] in °F, and what "back to normal" means.
    const coldwater = !marine && input.fishType === 'goldfish';
    const unknownFresh = !marine && !input.fishType;
    // Goldfish are coldwater fish: fine from the 40s (ponds in winter) to the mid-70s.
    const range = marine ? { usual: [72, 84], danger: [65, 89], target: '76–79 °F / 25–26 °C', who: 'reef fish' }
      : coldwater ? { usual: [40, 77], danger: [34, 88], target: '60–75 °F / 16–24 °C', who: 'goldfish' }
      : { usual: [64, 86], danger: [unknownFresh ? 34 : 55, 92], target: '75–80 °F / 24–27 °C', who: 'tropical fish' };
    if (unit === 'F' && temp >= 15 && temp <= 35) checks.push(`${temp} °F would be near freezing—did you mean °C? Switch the unit next to the reading.`);
    else if (unit === 'C' && temp > 45) checks.push(`${temp} °C would be far too hot for any fish—did you mean °F? Switch the unit next to the reading.`);
    else if (f <= range.danger[0] || f >= range.danger[1]) {
      urgent.push(`${temp} °${unit} is dangerously ${f <= range.danger[0] ? 'cold' : 'hot'} for ${range.who}`);
      checks.push(`${temp} °${unit} is far outside what ${range.who} handle. Add aeration and bring it back toward ${range.target} by a few degrees an hour${coldwater ? '' : '—check the heater'}.`);
    } else if (f < range.usual[0] || f > range.usual[1]) {
      checks.push(`${temp} °${unit} is ${f < range.usual[0] ? 'colder' : 'warmer'} than most ${range.who} like (${range.target})${coldwater ? '' : '—check the heater'}; change it slowly.${unknownFresh && f < range.usual[0] ? (f < 50 ? ' If these are tropical fish, act now—it’s far too cold. Goldfish and pond fish can cope with this.' : ' (Fine for goldfish and other coldwater fish.)') : ''}`);
    }
  }
  const salinity = readSalinity(input.salinity);
  if (marine && salinity?.unreadable) checks.push(`The salinity reading “${String(input.salinity).trim()}” doesn’t look right—enter it as ppt (e.g. 35) or specific gravity (e.g. 1.025), and re-check your refractometer or hydrometer.`);
  else if (marine && salinity) {
    const ppt = salinity.ppt;
    if (ppt < 25 || ppt > 42) urgent.push(`Salinity about ${Math.round(ppt)} ppt is dangerously ${ppt < 25 ? 'low' : 'high'}`);
    if (ppt < 30 || ppt > 37) checks.push(`Salinity looks ${ppt < 30 ? 'low' : 'high'} (about ${Math.round(ppt)} ppt; reef tanks usually run 33–35 ppt / 1.024–1.026). Correct it slowly—no more than about 1 ppt a day.`);
  }
  if (input.tankAge === 'new') checks.push('A new tank may not be cycled yet—test ammonia and nitrite every day.');
  if (input.affected === 'several' || signs.has('several')) checks.push('Several fish are affected—check the water as well as treating the illness.');
  if (input.onset === 'after-change') checks.push('This started after a water, equipment or chemical change—check that change and test the water now.');
  // What the urgent banner tells you to do. A salinity problem is fixed slowly, not with a big change.
  const salinityAlarm = urgent.some(u => /^Salinity/.test(u)), onlySalinity = salinityAlarm && urgent.every(u => /^Salinity/.test(u));
  const action = onlySalinity ? 'Add aeration and correct the salinity slowly—about 1 ppt a day, not with one big water change.'
    : salinityAlarm ? 'Add aeration and do a water change now with water at the tank’s current salinity; then correct the salinity itself slowly (about 1 ppt a day).'
    : 'Add aeration, test the water and do a water change now.';
  return { urgent, checks, action, level: urgent.length ? 'urgent' : checks.length ? 'check-water' : 'observe', waterUnknown: ammonia === null || nitrite === null };
}

function weightsFor(condition, water) {
  return { ...condition.weights, ...(water === 'fresh' ? condition.freshWeights : water === 'marine' ? condition.marineWeights : {}) };
}

// A refined key ("patch:slime") uses its own weight when the condition lists it
// (0 rules it out); otherwise it falls back to the base sign.
export function weightOf(condition, key, water) {
  const weights = weightsFor(condition, water);
  if (key in weights) return weights[key];
  const base = key.split(':')[0];
  return base !== key ? weights[base] || 0 : 0;
}

const inScope = (condition, water) => condition.scope === 'both' || water === 'unknown' || condition.scope === water;

// Library filter: every condition that fits a plain sign in this water type.
export function rankConditions(input) {
  const signs = input.signs || [];
  return CONDITIONS.filter(c => inScope(c, input.water))
    .map(c => ({ ...c, score: signs.reduce((sum, id) => sum + weightOf(c, id, input.water), 0) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

// Candidates for one visible feature: the sign must fit first; behaviors and the
// fish type then re-weight those candidates (they never add unrelated ones).
export function rankForFeature(feature, input) {
  const behaviors = (input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id));
  const fish = fishTypeFor(input.water, input.fishType);
  return CONDITIONS.filter(c => inScope(c, input.water))
    .map(c => {
      const base = weightOf(c, feature, input.water);
      if (base <= 0) return null;
      const behaviorScore = behaviors.reduce((sum, id) => sum + (weightsFor(c, input.water)[id] || 0), 0);
      // The fish type only re-orders conditions that genuinely fit the sign (base ≥ 2).
      const fishScore = base >= 2 ? fish?.boosts[c.id] || 0 : 0;
      return { ...c, base, score: base + behaviorScore + fishScore };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.base - a.base || a.id.localeCompare(b.id));
}

// Kept for the library and older callers: ranks by the primary feature.
export function rankVisualConditions(input) {
  const feature = featureKeys(input)[0];
  return feature ? rankForFeature(feature, input) : [];
}

export function featureKeys(input) {
  const selected = input.primarySign || SYMPTOMS.find(s => (input.signs || []).includes(s.id))?.id;
  const patterns = [...new Set([selected, ...(input.visualSigns || [])])].filter(id => id && SYMPTOMS.some(s => s.id === id));
  const question = closerQuestionFor(selected, input.water);
  const closer = question?.choices.some(c => c.id === input.closer && c.id !== 'unclear') ? input.closer : '';
  const growth = GROWTH_CHOICES.some(c => c.id === input.growthAppearance) ? input.growthAppearance : '';
  const keys = patterns.map(id => {
    if (id === selected && closer) return `${id}:${closer}`;
    if (id === 'lumps' && growth) return `lumps:${growth}`;
    return id;
  });
  // "Nothing obvious" only stands alone; real visible signs take over.
  // Pinecone scales count as a real visible sign too.
  const visible = keys.filter(k => k !== 'unclear');
  const pinecone = (input.signs || []).includes('pinecone') ? ['pinecone'] : [];
  return [...(visible.length || pinecone.length ? visible : keys), ...pinecone];
}

export function urgencyFor(condition, input) {
  const signs = input.signs || [];
  if (DISTRESS.some(id => signs.includes(id))) return 'today';
  // African cichlids: swelling (and especially swelling + not eating) can be Malawi bloat—act quickly.
  if (condition.id === 'bloat' && input.fishType === 'african') return 'today';
  return condition.urgency || 'week';
}

function reasonFor(condition, input, fits) {
  const fish = fishTypeFor(input.water, input.fishType);
  const seen = fits.map(id => labelFor(id, input)).join(' + ');
  const behaviors = (input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id) && (weightsFor(condition, input.water)[id] || 0) > 0).map(id => labelFor(id, input).toLowerCase());
  return [
    `You picked “${seen}”${behaviors.length ? `, plus ${behaviors.join(', ')}` : ''}.`,
    condition.id === 'bloat' && CATFISH.includes(input.fishType) ? 'A full, soft belly in a cory or pleco is most often bloat or constipation.' : condition.id === 'dropsy' && CATFISH.includes(input.fishType) ? 'A tight, stiff swelling all over is how dropsy shows in corys and plecos—they have no scales to stick out.' : condition.check,
    fish?.boosts[condition.id] ? `It’s also common in ${fish.plural}.` : '',
    condition.id === 'bloat' && input.fishType === 'african' ? 'In African cichlids (mbuna, peacocks), swelling—especially with no appetite or white, stringy poop—is often Malawi bloat, which needs treating today. In oscars it’s more often overeating or a blockage.' : '',
  ].filter(Boolean).join(' ');
}

function decorate(condition, input, fits) {
  const fish = fishTypeFor(input.water, input.fishType);
  return {
    ...condition,
    fits,
    matched: fits.map(id => labelFor(id, input)),
    urgencyLevel: urgencyFor(condition, input),
    reason: reasonFor(condition, input, fits),
    plan: carePlanFor(condition.id, input.water, input.fishType),
    tip: fish ? condition.tips?.[fish.id] || '' : '',
  };
}

// A confident hobbyist best guess for each visible sign, with "could also be"
// alternatives. Distinct signs can share one cause or be two problems at once.
export function assessDiagnosis(input) {
  const features = featureKeys(input);
  const ranked = new Map(features.map(f => [f, rankForFeature(f, input)]));
  const primaryId = ranked.get(features[0])?.[0]?.id;
  const leaders = new Map();
  for (const feature of features) {
    const top = ranked.get(feature)[0];
    if (top && !leaders.has(top.id)) leaders.set(top.id, top);
  }
  // A condition fits a feature it leads, or any other feature it strongly matches.
  const candidates = [...leaders.values()].map(c => ({ ...c, fits: features.filter(f => ranked.get(f)[0]?.id === c.id || weightOf(c, f, input.water) >= 3) }))
    .filter(c => c.fits.length)
    .sort((a, b) => b.fits.length - a.fits.length || Number(b.id === primaryId) - Number(a.id === primaryId) || b.score - a.score || a.id.localeCompare(b.id));
  const covered = new Set(), findings = [];
  for (const candidate of candidates) {
    if (candidate.fits.every(id => covered.has(id))) continue;
    findings.push(decorate(candidate, input, candidate.fits));
    candidate.fits.forEach(id => covered.add(id));
  }
  // When two problems both fit, the more urgent one leads (a stable sort keeps the rest in order).
  findings.sort((a, b) => URGENCY[b.urgencyLevel].rank - URGENCY[a.urgencyLevel].rank);
  // Columnaris spreads fastest and its plan conflicts with the heat step for ich/velvet: it leads.
  const col = findings.findIndex(c => c.id === 'columnaris');
  if (col > 0 && findings.some(c => ['ich-fresh', 'velvet-fresh'].includes(c.id))) findings.unshift(...findings.splice(col, 1));
  const unexplained = features.filter(id => !covered.has(id));
  let { alternatives, natural } = couldAlsoBe(findings, ranked, input);
  // Each "This looks more like mine" tap, in order.
  for (const id of input.chosen || []) {
    const swap = applyChoice(findings, alternatives, id, input);
    if (!swap) continue;
    findings.splice(0, findings.length, ...swap.findings);
    ({ alternatives, natural } = couldAlsoBe(findings, ranked, input, swap.previous));
  }
  reconcilePlans(findings);
  const assessment = assessUrgency(input);
  const contextConcerns = [];
  if (assessment.checks.length && !findings.some(c => c.id === 'water')) {
    contextConcerns.push({ ...CONDITIONS.find(c => c.id === 'water'), reason: assessment.checks.join(' ') });
  }
  const messages = [];
  if (features.includes('dots') && features.includes('dust')) messages.push('You picked both salt-like grains and fine dust. Ich and velvet can look alike—velvet is much finer and gold-tinted.');
  if (features.includes('fuzz') && features.some(f => f.startsWith('patch'))) messages.push('You picked both fluffy threads and flat pale patches. Fungus and columnaris are often mixed up; flat patches usually mean columnaris.');
  if (input.initialSign === 'dots' && input.textureSign && !['dots', 'unclear'].includes(input.textureSign)) messages.push(`Your closer look was “${LABELS[input.textureSign]},” so we used that instead of “White dots.”`);
  if (findings.length > 1) messages.push('More than one problem may be going on. Start with the most urgent one, and check the labels before using two medicines together.');
  // Ich/velvet plans raise the temperature; columnaris needs it lower.
  if (findings.some(c => c.id === 'columnaris') && findings.some(c => ['ich-fresh', 'velvet-fresh'].includes(c.id))) messages.push(HEAT_CONFLICT);
  // Two plans that need to be done in order, or in two places.
  const planText = c => c.plan ? [...c.plan.steps, c.plan.treatment].join(' ') : '';
  if (findings.some(c => /treat the whole tank/i.test(planText(c))) && findings.some(c => /\bmove (the|a badly affected|all|every) fish to a (bare )?hospital/i.test(planText(c))))
    messages.push('One plan treats the whole tank and another moves the fish to a hospital tank. If you move it, treat it there for both problems—the fish left in the main tank still need the whole-tank treatment.');
  if (findings.some(c => /skip feeding|stop feeding/i.test(planText(c))) && findings.some(c => /feed (a good|a varied|plenty)/i.test(planText(c)) && !/skip feeding|stop feeding/i.test(planText(c))))
    messages.push('Do the 1–2 day fast first, then start the better diet.');
  if (input.onset === 'new-fish') messages.push('This started after a new fish or shared equipment—new arrivals often bring ich, velvet and flukes with them. Quarantine new fish from now on.');
  if (contextConcerns.length) messages.push('Your tank history or readings also point to a water problem. Fix that alongside the treatment.');
  const primary = findings[0] || null;
  return {
    status: !findings.length ? 'insufficient' : findings.length > 1 ? 'multiple' : 'single',
    primary, findings, diagnoses: findings, alternatives, naturalNote: natural,
    chosen: Boolean(primary?.chosen),
    title: primary ? `Most likely: ${primary.title}` : 'Not enough to go on yet',
    urgency: findings.reduce((best, c) => URGENCY[c.urgencyLevel].rank > URGENCY[best]?.rank ? c.urgencyLevel : best, findings[0]?.urgencyLevel || ''),
    unexplained, contextConcerns, messages, urgent: assessment.urgent,
  };
}

// "Could also be" checks: each reason is something the keeper can do or look
// for (verb or "Look for" first, about 12 words at most).
const LOOKALIKES = {
  'ich-fresh': [['velvet-fresh', 'Shine a flashlight from the side: fine gold dust = velvet.'], ['normal', 'Check old photos: natural spots never change or spread.']],
  'ich-marine': [['velvet-marine', 'Look for fine dust and very fast breathing = velvet.'], ['black-spot', 'Look for black pepper specks instead of white grains.'], ['normal', 'Watch for a few days: ich spots come and go.']],
  'velvet-fresh': [['ich-fresh', 'Look for bigger, separate white grains, like salt = ich.'], ['normal', 'Change the light angle: natural shimmer moves with the scales.']],
  'velvet-marine': [['ich-marine', 'Look for bigger, separate white grains = marine ich.'], ['brooklynella', 'Look for thick slime and peeling skin = Brooklynella.'], ['water', 'Test the water and check aeration: low oxygen causes fast breathing.', ['breathing']]],
  'water-mold': [['columnaris', 'Look for flat pale patches or a white mouth = columnaris.']],
  columnaris: [['water-mold', 'Look for fluffy cotton-wool threads sticking out = fungus.'], ['fin-rot', 'Look for slow fin loss after dirty water = fin rot.', ['fins']]],
  'fin-rot': [['injury', 'Look for one clean split or tear = injury.'], ['columnaris', 'Look for fast fin loss with pale patches = columnaris.']],
  ulcer: [['septicemia', 'Look for red streaks in the fins or under the skin.'], ['injury', 'Look for a single scrape after a bump or fight.']],
  septicemia: [['water', 'Test ammonia: water burns also redden fins and gills.'], ['ulcer', 'Look for open craters with missing scales = ulcer.']],
  uronema: [['brooklynella', 'Look for thick slime and peeling, not deep red sores.'], ['ulcer', 'Watch for a day: ulcers grow more slowly.']],
  brooklynella: [['uronema', 'Look for deep red sores instead of slime = Uronema.'], ['velvet-marine', 'Shine a flashlight from the side: fine dust = velvet.'], ['flukes', 'Look for scratching and extra slime without peeling = flukes.']],
  'black-spot': [['ich-marine', 'Look for white grains instead of black specks = ich.'], ['normal', 'Check old photos: natural freckles never change.']],
  hlle: [['uronema', 'Look for fresh, red, growing sores instead of pale pits.'], ['brooklynella', 'Look for peeling slime instead of pits.']],
  'hole-in-head': [['columnaris', 'Look for flat pale patches instead of pits.']],
  dropsy: [['bloat', 'Look from above: scales lying flat = bloat.']],
  bloat: [['dropsy', 'Look from above: scales sticking out like a pinecone = dropsy.'], ['swim-bladder', 'Watch it swim: floating or tilting = swim bladder.'], ['normal', 'Watch it: a full or pregnant fish acts normally.']],
  popeye: [['injury', 'Check both eyes: only one, after a bump = injury.'], ['cloudy-eye', 'Look for a milky film without bulging.']],
  'cloudy-eye': [['popeye', 'Look from above: a bulging eye = popeye.'], ['injury', 'Check both eyes: only one, after a bump = injury.']],
  'swim-bladder': [['water', 'Check tankmates: several struggling points to the water.'], ['bloat', 'Look for a swollen belly with flat scales = bloat.']],
  water: [['flukes', 'Look for scratching or flashing against things = flukes.']],
  flukes: [['water', 'Test the water: bad water causes the same scratching.']],
  lymphocystis: [['growth', 'Look for one smooth lump instead of rough clusters.']],
  growth: [['lymphocystis', 'Look for rough, cauliflower-like clusters = lymphocystis.'], ['normal', 'Check old photos: some fish have natural bumps.']],
  injury: [['fin-rot', 'Watch the edges: still shrinking or white = fin rot.', ['fins']], ['ulcer', 'Watch the sore: growing instead of healing = ulcer.']],
  normal: [['growth', 'Look for a new or growing lump—that is not normal.']],
};

// The check to show when a condition comes up without a curated pair.
export const LOOK_FOR = {
  water: 'Test ammonia and nitrite, and look for red gills.',
  'ich-fresh': 'Look for separate white grains, like salt.',
  'ich-marine': 'Look for separate white grains, like salt.',
  'velvet-fresh': 'Shine a flashlight from the side: look for gold dust.',
  'velvet-marine': 'Look for fine dust plus very fast breathing.',
  'water-mold': 'Look for fluffy cotton-wool threads sticking out.',
  columnaris: 'Look for flat pale patches or a white mouth.',
  'fin-rot': 'Look for ragged fins with white or red edges.',
  ulcer: 'Look for open red craters with missing scales.',
  septicemia: 'Look for red streaks in the fins or under the skin.',
  dropsy: 'Look from above: scales sticking out like a pinecone.',
  bloat: 'Look for a swollen belly with flat scales.',
  popeye: 'Look from above: is the eye bulging out?',
  'cloudy-eye': 'Look for a milky film over the eye.',
  'swim-bladder': 'Watch it swim: floating, sinking or tilting?',
  flukes: 'Look for scratching, flashing and extra slime.',
  lymphocystis: 'Look for rough, cauliflower-like white clusters.',
  growth: 'Look for one smooth, rounded lump.',
  injury: 'Look for one clean scrape or split after a bump.',
  uronema: 'Look for deep red sores that keep growing.',
  brooklynella: 'Look for thick slime and peeling skin.',
  'black-spot': 'Look for black pepper specks, mostly on tangs.',
  hlle: 'Look for pale pits on the head or side line.',
  'hole-in-head': 'Look for small pits or holes on the head.',
  normal: 'Check old photos: natural markings never change.',
};

// What the first treatment is, per condition. Two conditions with the same
// family share their first steps; different families need a check before dosing.
export const TREATMENT_FAMILY = {
  water: 'water-quality', 'fin-rot': 'water-quality', popeye: 'water-quality', 'cloudy-eye': 'water-quality',
  'ich-fresh': 'antiparasitic', 'velvet-fresh': 'antiparasitic',
  'ich-marine': 'copper', 'velvet-marine': 'copper',
  'water-mold': 'antifungal',
  columnaris: 'antibacterial', ulcer: 'antibacterial', septicemia: 'antibacterial', dropsy: 'antibacterial',
  flukes: 'dewormer', 'black-spot': 'dewormer',
  uronema: 'formalin', brooklynella: 'formalin',
  'hole-in-head': 'metronidazole',
  bloat: 'diet', 'swim-bladder': 'diet',
  lymphocystis: 'supportive', growth: 'supportive', hlle: 'supportive', injury: 'supportive',
  normal: 'none',
};

export const ALTERNATIVE_TEXT = {
  danger: 'Rule this out first — more dangerous',
  same: 'Same first steps',
  different: 'Different treatment — check before dosing',
  natural: 'Or it may just be natural markings — if it’s looked like this since you got it.',
  naturalBelly: 'Or it may just be a full belly or a pregnant livebearer — if it’s acting normally.',
  naturalFull: 'Or it may just be a full belly — if it’s acting normally.',
};

export function treatmentNote(a, b) {
  const fa = TREATMENT_FAMILY[a], fb = TREATMENT_FAMILY[b];
  if (!fa || !fb || fa === 'none' || fb === 'none') return '';
  return fa === fb ? 'same' : 'different';
}

const MAX_ALTERNATIVES = 3;
const ALARMS = ['deaths', 'gasping', 'collapse', 'several'];
const LIVEBEARERS = ['guppy', 'molly', ''];

// Ranked look-alikes for the findings. 'normal' never becomes a card; when it
// would have been listed, the result carries one plain "natural markings" line.
function couldAlsoBe(findings, ranked, input, pinned = null) {
  const taken = new Set(findings.map(c => c.id));
  const out = new Map();
  let natural = '';
  const add = (condition, reason, from) => {
    if (!condition || taken.has(condition.id) || out.has(condition.id) || !inScope(condition, input.water)) return;
    if (condition.id === 'normal') {
      // No "it may be normal" line next to deaths, gasping, collapse or several sick fish, or possible Malawi bloat.
      if (ALARMS.some(id => (input.signs || []).includes(id)) || findings.some(f => f.id === 'bloat' && input.fishType === 'african')) return;
      natural ||= from === 'bloat' ? (input.water === 'fresh' && (!input.fishType || LIVEBEARERS.includes(input.fishType)) ? ALTERNATIVE_TEXT.naturalBelly : ALTERNATIVE_TEXT.naturalFull) : ALTERNATIVE_TEXT.natural;
      return;
    }
    const catfishReason = CATFISH.includes(input.fishType) && /scales/i.test(reason || LOOK_FOR[condition.id] || '') ? CATFISH_REASONS[condition.id] : '';
    out.set(condition.id, { ...condition, from, comparisonReason: catfishReason || reason || LOOK_FOR[condition.id] || condition.hint });
  };
  // The guess the user just swapped away from stays first in the list.
  if (pinned) add(pinned, LOOKALIKES[findings[0].id]?.find(([id]) => id === pinned.id)?.[1], findings[0].id);
  for (const finding of findings) {
    // Curated look-alikes can be limited to the signs they explain (e.g. "fin rot"
    // only next to columnaris when fins were picked).
    const bases = new Set(finding.fits.map(f => f.split(':')[0]));
    const curated = new Map((LOOKALIKES[finding.id] || []).filter(([, , when]) => !when || when.some(b => bases.has(b))).map(([id, reason]) => [id, reason]));
    // Runners-up must genuinely fit the same sign (weight ≥ 2), not just touch it.
    const runnersUp = finding.fits.flatMap(feature => (ranked.get(feature) || []).filter(c => c.base >= 2).slice(0, 5));
    // Strong runners-up for the same signs first (they include fish-type weight),
    // then the curated look-alikes, then weaker runners-up.
    for (const other of runnersUp.filter(c => c.score >= 3)) add(other, curated.get(other.id), finding.id);
    for (const [id, reason] of curated) add(CONDITIONS.find(c => c.id === id), reason, finding.id);
    for (const other of runnersUp) add(other, curated.get(other.id), finding.id);
  }
  const top = findings[0];
  const alternatives = [...out.values()].slice(0, MAX_ALTERNATIVES).map(c => {
    const urgencyLevel = urgencyFor(c, input);
    return {
      ...c, urgencyLevel,
      moreUrgent: Boolean(top && URGENCY[urgencyLevel].rank > URGENCY[top.urgencyLevel].rank),
      treatmentNote: treatmentNote(c.id, c.from),
    };
  });
  return { alternatives, natural };
}

// "This looks more like mine": the chosen look-alike takes the place of the
// finding it was listed for and becomes the top result; the old guess is pinned
// first in the new "could also be" list.
function applyChoice(findings, alternatives, id, input) {
  const pick = alternatives.find(c => c.id === id);
  if (!pick) return null;
  const index = Math.max(0, findings.findIndex(c => c.id === pick.from));
  const previous = findings[index];
  const condition = CONDITIONS.find(c => c.id === id);
  const chosen = { ...decorate(condition, input, previous.fits), chosen: true, reason: `You said this looks more like your fish. ${condition.check}` };
  return { findings: [chosen, ...findings.filter((_, i) => i !== index)], previous };
}

export function lookalikesFor(id, water) {
  return (LOOKALIKES[id] || []).map(([candidate, comparisonReason]) => ({ ...CONDITIONS.find(c => c.id === candidate), comparisonReason }))
    .filter(c => c.id && c.id !== id && inScope(c, water));
}

// Ich and velvet plans raise the temperature; columnaris needs it lower. When both
// show, the heat steps are replaced everywhere the plan appears (results, care page, notes).
const HEAT_STEP = /raise the temperature/i;
export const HEAT_CONFLICT = 'Don’t raise the temperature while columnaris is active—warm water speeds it up. Treat the columnaris first, keep the temperature steady, and use a medicine for the spots without the heat step.';
function reconcilePlans(findings) {
  if (!(findings.some(c => c.id === 'columnaris') && findings.some(c => ['ich-fresh', 'velvet-fresh'].includes(c.id)))) return;
  for (const c of findings) {
    if (!['ich-fresh', 'velvet-fresh'].includes(c.id) || !c.plan) continue;
    if (/heat|warm/i.test(c.tip || '')) c.tip = '';
    if (!c.plan.steps.some(step => HEAT_STEP.test(step))) continue; // this variant has no heat step to change
    c.plan = {
      ...c.plan,
      steps: c.plan.steps.map(step => HEAT_STEP.test(step)
        ? (c.id === 'ich-fresh' ? 'Keep the temperature steady—don’t raise it while columnaris is active. Add extra aeration.' : step.replace(/ and raise the temperature a little\.?/i, '. Keep the temperature steady while columnaris is active.'))
        : step),
      treatment: `${c.plan.treatment.replace(/^Gradual heat \+ /i, '').replace(/^an /, 'An ')} (no heat while columnaris is active)`,
    };
  }
}

export function buildCase(input) {
  const show = value => String(value || '').trim() || 'Not recorded';
  const number = value => numeric(value) === null ? 'Not measured / unknown' : String(value);
  const assessment = assessUrgency(input);
  const diagnosis = assessDiagnosis(input);
  const env = { fresh: 'Freshwater', marine: 'Saltwater', unknown: 'Not sure' }[input.water] || 'Not recorded';
  const fish = fishTypeFor(input.water, input.fishType);
  return [
    'FISH HEALTH — MY NOTES',
    'Best guess from a hobby guide, not a vet diagnosis.',
    '',
    `Water: ${env}`,
    `Kind of fish: ${fish?.title || 'Not sure / other'}`,
    `Fish / species notes: ${show(input.species)}`,
    `How long: ${show(input.duration)}`,
    `Fish affected: ${({ unknown: 'Not sure', one: 'One fish', several: 'Several / most fish' })[input.affected] || show(input.affected)}`,
    `Tank established: ${({ unknown: 'Not sure', new: 'New / recently restarted', established: 'Established and running' })[input.tankAge] || show(input.tankAge)}`,
    `Onset / recent changes: ${({ unknown: 'Not sure / nothing obvious', 'new-fish': 'New fish or shared equipment', 'after-change': 'Water change, chemical, filter or power issue', gradual: 'Slow change, no clear event' })[input.onset] || show(input.onset)}`,
    `What I saw: ${diagnosis.findings.flatMap(c => c.matched).concat(diagnosis.unexplained.map(id => LABELS[id] || id)).join('; ') || 'Nothing obvious'}`,
    `Behavior: ${(input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id)).map(id => labelFor(id, input)).join('; ') || 'None selected'}`,
    `Total ammonia: ${number(input.ammonia)} ppm (mg/L)`,
    `Nitrite: ${number(input.nitrite)} ppm (mg/L)`,
    `pH: ${number(input.ph)}`,
    `Temperature: ${number(input.temperature)} ${input.tempUnit === 'C' ? '°C' : '°F'}`,
    `Salinity (marine): ${show(input.salinity)}`,
    `New arrivals / previous treatment / other notes: ${show(input.notes)}`,
    '',
    `Most likely: ${diagnosis.primary?.title || 'No clear match from these answers'}${diagnosis.primary ? ` (${URGENCY[diagnosis.primary.urgencyLevel].label})` : ''}${diagnosis.chosen ? ' — I picked this from the look-alikes' : ''}`,
    `Also likely: ${diagnosis.findings.slice(1).map(c => `${c.title} (${URGENCY[c.urgencyLevel].label})`).join('; ') || 'None'}`,
    `Could also be: ${diagnosis.alternatives.map(c => c.title).join('; ') || 'None listed'}`,
    `Urgent signs: ${assessment.urgent.join('; ') || 'None selected'}`,
    `Water checks: ${assessment.checks.join(' ') || 'Test ammonia and nitrite if you haven’t lately.'}`,
    ...(diagnosis.messages.length ? ['', 'Notes from the guide:', ...diagnosis.messages.map(m => `- ${m}`)] : []),
    ...diagnosis.findings.flatMap(c => c.plan ? ['', `What to do — ${c.title}:`, ...c.plan.steps.map((s, i) => `${i + 1}. ${s}`), `Usual treatment: ${c.plan.treatment}`, `Typical recovery: ${c.plan.recovery}`, ...(c.plan.reefUnsafe ? ['NOT REEF-SAFE — treat in a separate tank.'] : []), ...(c.plan.medicated ? ['Amounts: follow the product label.'] : [])] : []),
    '',
    `Picture page I started from: ${CONDITIONS.find(c => c.id === input.visualReference)?.title || 'None'}`,
    `Entries I compared: ${(input.comparisons || []).map(id => CONDITIONS.find(c => c.id === id)?.title).filter(Boolean).join('; ') || 'None'}`,
    '',
  ].join('\n');
}
