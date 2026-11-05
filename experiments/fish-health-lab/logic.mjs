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
  if (signs.has('pinecone')) urgent.push('Raised, pinecone-like scales');
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
      const fishScore = fish?.boosts[c.id] || 0;
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
  const visible = keys.filter(k => k !== 'unclear');
  return [...(visible.length ? visible : keys), ...((input.signs || []).includes('pinecone') ? ['pinecone'] : [])];
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
  const assessment = assessUrgency(input);
  const contextConcerns = [];
  if (assessment.checks.length && !findings.some(c => c.id === 'water')) {
    contextConcerns.push({ ...CONDITIONS.find(c => c.id === 'water'), reason: assessment.checks.join(' ') });
  }
  const alternatives = couldAlsoBe(findings, ranked, input);
  const messages = [];
  if (features.includes('dots') && features.includes('dust')) messages.push('You picked both salt-like grains and fine dust. Ich and velvet can look alike—velvet is much finer and gold-tinted.');
  if (features.includes('fuzz') && features.some(f => f.startsWith('patch'))) messages.push('You picked both fluffy threads and flat pale patches. Fungus and columnaris are often mixed up; flat patches usually mean columnaris.');
  if (input.initialSign === 'dots' && input.textureSign && !['dots', 'unclear'].includes(input.textureSign)) messages.push(`Your closer look was “${LABELS[input.textureSign]},” so we used that instead of “White dots.”`);
  if (findings.length > 1) messages.push('More than one problem may be going on. Start with the most urgent one, and check the labels before using two medicines together.');
  if (contextConcerns.length) messages.push('Your tank history or readings also point to a water problem. Fix that alongside the treatment.');
  const primary = findings[0] || null;
  return {
    status: !findings.length ? 'insufficient' : findings.length > 1 ? 'multiple' : 'single',
    primary, findings, diagnoses: findings, alternatives,
    title: primary ? `Most likely: ${primary.title}` : 'Not enough to go on yet',
    urgency: findings.reduce((best, c) => URGENCY[c.urgencyLevel].rank > URGENCY[best]?.rank ? c.urgencyLevel : best, findings[0]?.urgencyLevel || ''),
    unexplained, contextConcerns, messages, urgent: assessment.urgent,
  };
}

const LOOKALIKES = {
  'ich-fresh': [['velvet-fresh', 'Much finer gold dust rather than separate grains—check with a torch.'], ['normal', 'Natural spots and markings stay the same and don’t spread.']],
  'ich-marine': [['velvet-marine', 'Finer dust and much faster breathing. More dangerous—treat fast.'], ['black-spot', 'Black pepper specks instead of white grains, mostly on tangs.'], ['normal', 'Natural markings stay the same; ich spots come and go.']],
  'velvet-fresh': [['ich-fresh', 'Bigger, separate white grains like salt.'], ['normal', 'Natural shimmer follows the scales and lighting.']],
  'velvet-marine': [['ich-marine', 'Bigger, separate white grains; usually slower.'], ['brooklynella', 'Thick slime and peeling skin, especially on clownfish.'], ['water', 'Low oxygen also causes fast breathing—check aeration.']],
  'water-mold': [['columnaris', 'Flat pale patches or a white mouth rather than fluffy threads.']],
  columnaris: [['water-mold', 'Fluffy cotton-wool threads sticking out, not a flat patch.'], ['fin-rot', 'Slower fin loss, usually after dirty water.']],
  'fin-rot': [['injury', 'A clean split or tear after a fight or snag.'], ['columnaris', 'Fast fin loss with pale patches or a white mouth.']],
  ulcer: [['septicemia', 'Red streaks in the fins or blotches under the skin.'], ['injury', 'A single scrape after a bump or fight.']],
  septicemia: [['water', 'Ammonia burn also reddens fins and gills—test the water.'], ['ulcer', 'Open craters with missing scales.']],
  uronema: [['brooklynella', 'Thick slime and peeling rather than deep red sores.'], ['ulcer', 'Bacterial sores that grow more slowly.']],
  brooklynella: [['uronema', 'Deep red sores rather than slime and peeling.'], ['velvet-marine', 'A fine dusty sheen with very fast breathing.'], ['flukes', 'Scratching and extra slime without peeling.']],
  'black-spot': [['ich-marine', 'White grains instead of black specks.'], ['normal', 'Natural dark freckles that never change.']],
  hlle: [['uronema', 'Fresh, red, growing sores instead of pale pits.'], ['brooklynella', 'Peeling slime rather than pits.']],
  'hole-in-head': [['columnaris', 'Flat pale patches rather than pits.']],
  dropsy: [['bloat', 'Swollen belly but the scales lie flat.']],
  bloat: [['dropsy', 'Scales stick out like a pinecone when seen from above.'], ['swim-bladder', 'Floating or tilting along with the swelling.']],
  popeye: [['injury', 'Only one eye after a bump—usually heals with clean water.'], ['cloudy-eye', 'A milky film without bulging.']],
  'cloudy-eye': [['popeye', 'The eye bulges out as well.'], ['injury', 'One eye only, after a bump.']],
  'swim-bladder': [['water', 'Several fish struggling at once points to the water or oxygen.'], ['bloat', 'A swollen belly with flat scales.']],
  water: [['flukes', 'Scratching or flashing along with fast gills.']],
  flukes: [['water', 'Bad water causes similar scratching and fast breathing.']],
  lymphocystis: [['growth', 'One smooth lump instead of rough clusters.']],
  growth: [['lymphocystis', 'Rough cauliflower-like clusters.'], ['normal', 'Some species have natural bumps—compare with older photos.']],
  injury: [['fin-rot', 'Edges that keep shrinking or turn white/red.'], ['ulcer', 'A sore that grows instead of healing.']],
  normal: [['growth', 'A new or growing lump is not normal.']],
};

function couldAlsoBe(findings, ranked, input) {
  const taken = new Set(findings.map(c => c.id));
  const out = new Map();
  const add = (condition, reason) => {
    if (!condition || taken.has(condition.id) || out.has(condition.id) || !inScope(condition, input.water)) return;
    out.set(condition.id, { ...condition, comparisonReason: reason || condition.hint });
  };
  for (const finding of findings) {
    const curated = new Map((LOOKALIKES[finding.id] || []).map(([id, reason]) => [id, reason]));
    const runnersUp = finding.fits.flatMap(feature => (ranked.get(feature) || []).slice(0, 5));
    // Strong runners-up for the same signs first (they include fish-type weight),
    // then the curated look-alikes, then weaker runners-up.
    for (const other of runnersUp.filter(c => c.score >= 3)) add(other, curated.get(other.id));
    for (const [id, reason] of curated) add(CONDITIONS.find(c => c.id === id), reason);
    for (const other of runnersUp) add(other, curated.get(other.id));
  }
  return [...out.values()].slice(0, 4);
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
    `Most likely: ${diagnosis.primary?.title || 'No clear match from these answers'}${diagnosis.primary ? ` (${URGENCY[diagnosis.primary.urgencyLevel].label})` : ''}`,
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
