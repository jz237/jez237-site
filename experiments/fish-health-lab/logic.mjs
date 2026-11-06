import { CONDITIONS, SYMPTOMS, BEHAVIORS, GROWTH_CHOICES, CLOSER_QUESTIONS, closerQuestionFor, fishTypeFor, URGENCY } from './data.mjs';
import { carePlanFor } from './treatments.mjs';

const closerLabels = Object.entries(CLOSER_QUESTIONS).flatMap(([sign, q]) => q.choices.filter(c => c.id !== 'unclear')
  .map(c => [`${sign}:${c.id}`, `${SYMPTOMS.find(s => s.id === sign).title}: ${c.title.toLowerCase()}`]));
const growthLabels = GROWTH_CHOICES.filter(c => c.id !== 'unclear').map(c => [`lumps:${c.id}`, `Raised lumps: ${c.title.toLowerCase()}`]);
export const LABELS = Object.fromEntries([...SYMPTOMS.map(s => [s.id, s.title]), ...BEHAVIORS.map(s => [s.id, s.label]), ...closerLabels, ...growthLabels, ['lumps:unclear', 'Raised lumps']]);
const numeric = value => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;
const DISTRESS = ['gasping', 'collapse', 'deaths'];

export function assessUrgency(input) {
  const signs = new Set(input.signs || []);
  const urgent = [];
  const checks = [];
  if (signs.has('gasping')) urgent.push('Severe or continuous gasping');
  if (signs.has('collapse')) urgent.push('Loss of balance with poor responsiveness');
  if (signs.has('deaths')) urgent.push('Fish deaths during this problem');
  if (signs.has('pinecone') || (signs.has('swollen') && input.closer === 'pinecone')) urgent.push('Raised, pinecone-like scales');
  if (input.water === 'marine' && (signs.has('breathing') || signs.has('gasping')) && signs.has('dust')) urgent.push('Marine fish with fast breathing and a fine dusting');
  const ammonia = numeric(input.ammonia), nitrite = numeric(input.nitrite);
  if (ammonia !== null && ammonia > 0) checks.push('Ammonia is detectable—do a water change and add a detoxifier now.');
  if (nitrite !== null && nitrite > 0) checks.push(input.water === 'marine'
    ? 'Nitrite is detectable—your biological filter may be struggling. Do a water change.'
    : 'Nitrite is detectable—do a water change and consider aquarium salt for salt-tolerant fish to protect the gills.');
  if (input.tankAge === 'new') checks.push('A new tank may not be cycled yet—test ammonia and nitrite every day.');
  if (input.affected === 'several' || signs.has('several')) checks.push('Several fish are affected—check the water as well as treating the illness.');
  if (input.onset === 'after-change') checks.push('This started after a water, equipment or chemical change—check that change and test the water now.');
  return { urgent, checks, level: urgent.length ? 'urgent' : checks.length ? 'check-water' : 'observe', waterUnknown: ammonia === null || nitrite === null };
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
  return DISTRESS.some(id => signs.includes(id)) ? 'today' : condition.urgency || 'week';
}

function reasonFor(condition, input, fits) {
  const fish = fishTypeFor(input.water, input.fishType);
  const seen = fits.map(id => LABELS[id] || id).join(' + ');
  const behaviors = (input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id) && (weightsFor(condition, input.water)[id] || 0) > 0).map(id => LABELS[id].toLowerCase());
  return [
    `You picked “${seen}”${behaviors.length ? `, plus ${behaviors.join(', ')}` : ''}.`,
    condition.check,
    fish?.boosts[condition.id] ? `It’s also common in ${fish.plural}.` : '',
  ].filter(Boolean).join(' ');
}

function decorate(condition, input, fits) {
  const fish = fishTypeFor(input.water, input.fishType);
  return {
    ...condition,
    fits,
    matched: fits.map(id => LABELS[id] || id),
    urgencyLevel: urgencyFor(condition, input),
    reason: reasonFor(condition, input, fits),
    plan: carePlanFor(condition.id, input.water),
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
  const unexplained = features.filter(id => !covered.has(id));
  let { alternatives, natural } = couldAlsoBe(findings, ranked, input);
  // Each "This looks more like mine" tap, in order.
  for (const id of input.chosen || []) {
    const swap = applyChoice(findings, alternatives, id, input);
    if (!swap) continue;
    findings.splice(0, findings.length, ...swap.findings);
    ({ alternatives, natural } = couldAlsoBe(findings, ranked, input, swap.previous));
  }
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
};

export function treatmentNote(a, b) {
  const fa = TREATMENT_FAMILY[a], fb = TREATMENT_FAMILY[b];
  if (!fa || !fb || fa === 'none' || fb === 'none') return '';
  return fa === fb ? 'same' : 'different';
}

const MAX_ALTERNATIVES = 3;

// Ranked look-alikes for the findings. 'normal' never becomes a card; when it
// would have been listed, the result carries one plain "natural markings" line.
function couldAlsoBe(findings, ranked, input, pinned = null) {
  const taken = new Set(findings.map(c => c.id));
  const out = new Map();
  let natural = '';
  const add = (condition, reason, from) => {
    if (!condition || taken.has(condition.id) || out.has(condition.id) || !inScope(condition, input.water)) return;
    if (condition.id === 'normal') { natural ||= from === 'bloat' ? ALTERNATIVE_TEXT.naturalBelly : ALTERNATIVE_TEXT.natural; return; }
    out.set(condition.id, { ...condition, from, comparisonReason: reason || LOOK_FOR[condition.id] || condition.hint });
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
    `Fish affected: ${show(input.affected)}`,
    `Tank established: ${show(input.tankAge)}`,
    `Onset / recent changes: ${show(input.onset)}`,
    `What I saw: ${diagnosis.findings.flatMap(c => c.matched).concat(diagnosis.unexplained.map(id => LABELS[id] || id)).join('; ') || 'Nothing obvious'}`,
    `Behavior: ${(input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id)).map(id => LABELS[id]).join('; ') || 'None selected'}`,
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
    ...diagnosis.findings.flatMap(c => c.plan ? ['', `What to do — ${c.title}:`, ...c.plan.steps.map((s, i) => `${i + 1}. ${s}`), `Usual treatment: ${c.plan.treatment}`, `Typical recovery: ${c.plan.recovery}`, ...(c.plan.reefUnsafe ? ['NOT REEF-SAFE — treat in a separate tank.'] : []), ...(c.plan.medicated ? ['Amounts: follow the product label.'] : [])] : []),
    '',
    `Picture page I started from: ${CONDITIONS.find(c => c.id === input.visualReference)?.title || 'None'}`,
    `Entries I compared: ${(input.comparisons || []).map(id => CONDITIONS.find(c => c.id === id)?.title).filter(Boolean).join('; ') || 'None'}`,
    '',
  ].join('\n');
}
