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
  const candidates = rankConditions(input).slice(0, 4);
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
