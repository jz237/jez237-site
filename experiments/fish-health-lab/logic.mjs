import { CONDITIONS, SYMPTOMS, BEHAVIORS } from './data.mjs';

export const LABELS = Object.fromEntries([...SYMPTOMS.map(s => [s.id, s.title]), ...BEHAVIORS.map(s => [s.id, s.label])]);
const numeric = value => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;

export function assessUrgency(input) {
  const signs = new Set(input.signs || []);
  const urgent = [];
  const checks = [];
  if (signs.has('gasping')) urgent.push('Severe or continuous gasping');
  if (signs.has('collapse')) urgent.push('Loss of balance with poor responsiveness');
  if (signs.has('deaths')) urgent.push('Fish deaths during this problem');
  if (signs.has('pinecone')) urgent.push('Raised, pinecone-like scales');
  if (input.water === 'marine' && (signs.has('breathing') || signs.has('gasping')) && signs.has('dust')) urgent.push('Marine fish with respiratory signs and a fine dusting');
  const ammonia = numeric(input.ammonia), nitrite = numeric(input.nitrite);
  if (ammonia !== null && ammonia > 0) checks.push('Ammonia is detectable. Interpret the reading with pH, temperature and your test method; address water quality now.');
  if (nitrite !== null && nitrite > 0) checks.push(input.water === 'marine'
    ? 'Nitrite is detectable. Review biological filtration; nitrite toxicity differs between fresh and salt water.'
    : 'Nitrite is detectable. Freshwater fish may be at risk; investigate water quality promptly.');
  if (input.tankAge === 'new') checks.push('A new setup may have incomplete biological filtration—even when the water looks clear.');
  if (input.affected === 'several') checks.push('Several fish are affected. Prioritize the shared environment as well as a possible infectious cause.');
  if (input.onset === 'after-change') checks.push('Symptoms followed a water, equipment or chemical change. Check that change and the water immediately.');
  return { urgent, checks, level: urgent.length ? 'urgent' : checks.length ? 'check-water' : 'observe', waterUnknown: ammonia === null || nitrite === null };
}

export function rankConditions(input) {
  const signs = new Set(input.signs || []);
  const assessment = assessUrgency(input);
  return CONDITIONS.filter(c => c.scope === 'both' || input.water === 'unknown' || c.scope === input.water)
    .map(condition => {
      const matched = Object.entries(condition.weights).filter(([id]) => signs.has(id));
      let score = matched.reduce((sum, [, weight]) => sum + weight, 0);
      let comparisonReason = '';
      if (signs.has('dots') && condition.id.startsWith('velvet-') && !score) { score = 1; comparisonReason = 'Compare fine dusting with separate white grains.'; }
      if (signs.has('dots') && condition.id === 'growth' && !score) { score = 1; comparisonReason = 'Compare irregular larger growths with fine white spots.'; }
      if (signs.has('fuzz') && condition.id === 'growth' && !score) { score = 1; comparisonReason = 'An unclassified surface growth needs identification; color alone cannot establish its cause.'; }
      if (condition.id === 'water' && assessment.checks.length) score += 4 + assessment.checks.length;
      if (condition.id === 'water' && assessment.urgent.length) score += 2;
      return { ...condition, score, comparisonReason, matched: matched.map(([id]) => LABELS[id] || id), contextMatch: condition.id === 'water' && assessment.checks.length > 0 };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

// Visual comparisons use the observed pattern only. Appetite, distress and tank
// history belong to urgency/care, not to whether two skin changes look alike.
export function rankVisualConditions(input) {
  const pattern = input.primarySign || SYMPTOMS.find(s => (input.signs || []).includes(s.id))?.id;
  if (!pattern || pattern === 'unclear') return [];
  const matches = CONDITIONS.filter(c => c.scope === 'both' || input.water === 'unknown' || c.scope === input.water)
    .map(c => ({ ...c, score: c.weights[pattern] || 0, matched: [LABELS[pattern]] }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  // Fast breathing alone cannot distinguish a pathogen from oxygen/water stress.
  if (pattern === 'breathing') matches.sort((a, b) => Number(b.id === 'water') - Number(a.id === 'water'));
  return matches;
}

const LOOKALIKES = {
  'ich-fresh': [['velvet-fresh', 'Compare much finer dust with separate white grains.'], ['growth', 'Compare larger, irregular raised growths with small separate grains.'], ['normal', 'Stable markings or breeding tubercles can resemble spots; compare older photos and the species.']],
  'ich-marine': [['velvet-marine', 'Compare fine dusting with separate spots; either can affect the gills.'], ['growth', 'Larger irregular nodules are a different texture from fine white grains.'], ['normal', 'Compare stable species markings with genuinely new spots.']],
  'velvet-fresh': [['ich-fresh', 'Ich-like grains are coarser and more separate than the fine dust illustrated here.'], ['normal', 'Natural iridescence follows the scales and lighting; sheen alone does not establish velvet.']],
  'velvet-marine': [['ich-marine', 'Separate white grains can look similar at a distance; gill signs can overlap.'], ['normal', 'A normal reflective sheen is not proof of a parasite.']],
  'water-mold': [['columnaris', 'Pale or slimy bacterial lesions can be mistaken for fungus; compare flat patches with outward filaments.'], ['growth', 'A solid raised nodule is different from a tuft of cottony threads.']],
  columnaris: [['water-mold', 'Look for outward cottony filaments rather than a mainly flat pale lesion.'], ['ulcer', 'Trauma and other infections can cause overlapping skin damage.']],
  'fin-damage': [['columnaris', 'Progressive fin loss with pale lesions can need bacterial investigation.'], ['ulcer', 'Redness or an open wound may accompany injury or infection.']],
  ulcer: [['columnaris', 'Some bacterial skin lesions overlap with sores; appearance cannot identify the organism.'], ['water-mold', 'Cottony filaments may grow on an existing injury; investigate the original wound too.']],
  dropsy: [['normal', 'Normal body shape or egg development can resemble swelling; raised scales and illness need separate attention.']],
  'eye-change': [['normal', 'Some varieties normally have protruding eyes. Compare with this fish’s healthy appearance.']],
  buoyancy: [['water', 'Water or oxygen problems can also change posture and swimming.'], ['dropsy', 'Body swelling can accompany buoyancy trouble; check whether swelling is actually present.']],
  water: [['gill-parasites', 'Gill irritation can also cause rapid breathing; microscopy and water tests separate causes.'], ['velvet-fresh', 'Freshwater gill disease may have little visible dust; this is a breathing overlap, not a confirmed skin match.'], ['velvet-marine', 'Marine gill disease can progress quickly with little visible dust; breathing trouble needs urgent help.']],
  'gill-parasites': [['water', 'Low oxygen and water-quality problems can cause similar irritation and breathing changes.'], ['velvet-fresh', 'Freshwater velvet may involve the gills without an obvious skin pattern.'], ['velvet-marine', 'Marine velvet can affect the gills with few visible changes.']],
  growth: [['normal', 'Compare the location and shape with normal anatomy for this species.'], ['water-mold', 'Cottony threads project into the water; a solid lump has a different structure.']],
  normal: [['growth', 'A genuinely new or enlarging lump needs examination rather than assuming it is normal.']],
};

export function lookalikesFor(id, water) {
  const pairs = [...(LOOKALIKES[id] || [])];
  if (water === 'unknown' && /^(ich|velvet)-(fresh|marine)$/.test(id)) {
    pairs.unshift([id.replace(/-(fresh|marine)$/, id.endsWith('-fresh') ? '-marine' : '-fresh'), 'A similar pattern in a different water type. Identify the aquarium type before choosing care.']);
  }
  return pairs.map(([candidate, comparisonReason]) => ({ ...CONDITIONS.find(c => c.id === candidate), comparisonReason }))
    .filter(c => c.id && c.id !== id && (c.scope === 'both' || water === 'unknown' || c.scope === water));
}

export function describeIchPattern(input) {
  const signs = new Set(input.signs || []);
  if (input.water !== 'fresh') return { title: 'This is not a freshwater ich assessment.', text: 'Water type changes which parasites and management plans apply. Use the appropriate water-type comparisons below.' };
  if (signs.has('dots')) return { title: 'Ich is one possibility—not confirmed.', text: 'Separate white grains fit an ich-like pattern, but other growths and parasites can overlap. The number of visible spots cannot tell you how sick the fish is.' };
  if (['dust','fuzz','patch','lumps'].some(sign => signs.has(sign))) return { title: 'Your selected pattern is less typical of ich.', text: 'Fine dust, cottony threads, flat patches and larger growths raise different questions. Compare the relevant entries below rather than treating every pale change as ich.' };
  return { title: 'There is no clear visual match yet.', text: 'Unclear or absent skin spots cannot rule out gill disease or an environmental problem. Breathing, behavior and actual water readings become especially important.' };
}

export function buildCase(input) {
  const show = value => String(value || '').trim() || 'Not recorded';
  const number = value => numeric(value) === null ? 'Not measured / unknown' : String(value);
  const assessment = assessUrgency(input);
  const first = rankVisualConditions(input)[0];
  const candidates = first ? [first, ...lookalikesFor(first.id, input.water)] : [];
  const env = { fresh: 'Freshwater', marine: 'Saltwater', unknown: 'Not sure' }[input.water] || 'Not recorded';
  return [
    'FISH HEALTH — CASE NOTES',
    'These notes are observations, not a diagnosis.',
    '',
    `Water: ${env}`,
    `Fish / species: ${show(input.species)}`,
    `How long: ${show(input.duration)}`,
    `Fish affected: ${show(input.affected)}`,
    `Tank established: ${show(input.tankAge)}`,
    `Onset / recent changes: ${show(input.onset)}`,
    `Visible signs / behavior: ${(input.signs || []).map(id => LABELS[id] || id).join('; ') || 'No signs selected'}`,
    `Visible extent (not a severity score): ${show(input.visualExtent)}`,
    `Total ammonia: ${number(input.ammonia)} ppm (mg/L)`,
    `Nitrite: ${number(input.nitrite)} ppm (mg/L)`,
    `pH: ${number(input.ph)}`,
    `Temperature: ${number(input.temperature)} ${input.tempUnit === 'C' ? '°C' : '°F'}`,
    `Salinity (marine): ${show(input.salinity)}`,
    `New arrivals / previous treatment / other notes: ${show(input.notes)}`,
    '',
    `Urgent flags: ${assessment.urgent.join('; ') || 'None selected. This does not rule out serious disease.'}`,
    `Environmental checks: ${assessment.checks.join(' ') || 'Still check actual water quality and oxygen.'}`,
    `Guide reading suggestions (NOT established diagnoses): ${candidates.map(c => c.title).join('; ') || 'No clear match.'}`,
    `Visual page used to start this check (NOT evidence of a diagnosis): ${CONDITIONS.find(c => c.id === input.visualReference)?.title || 'None selected.'}`,
    `Entries manually chosen for comparison (user selections, not diagnoses): ${(input.comparisons || []).map(id => CONDITIONS.find(c => c.id === id)?.title).filter(Boolean).join('; ') || 'None selected.'}`,
    '',
  ].join('\n');
}
