import { CONDITIONS, SYMPTOMS, BEHAVIORS, GROWTH_CHOICES } from './data.mjs';

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

// Use each explicit visual sign, not generic appetite/distress points, to form
// likely matches. Distinct signs can share a cause or represent concurrent issues.
// These rules do not assign clinical probabilities or interpret free-text notes.
export function assessDiagnosis(input) {
  const selected = input.primarySign || SYMPTOMS.find(s => (input.signs || []).includes(s.id))?.id;
  const patterns = [...new Set([selected, ...(input.visualSigns || [])])]
    .filter(id => id && id !== 'unclear' && SYMPTOMS.some(s => s.id === id));
  const hasPinecone = (input.signs || []).includes('pinecone');
  const features = [...patterns, ...(hasPinecone ? ['pinecone'] : [])];
  const matchForPattern = pattern => {
    if (pattern !== 'lumps') return rankVisualConditions({ water: input.water, primarySign: pattern })[0];
    const id = input.growthAppearance === 'cauliflower' ? 'lymphocystis' : input.growthAppearance === 'inflamed' ? 'ulcer' : 'growth';
    const condition = CONDITIONS.find(c => c.id === id);
    const match = { ...condition, weights: { ...condition.weights, lumps: 6 } };
    if (input.growthAppearance === 'smooth') {
      match.possibleCauses = [
        { title: 'A cyst', text: 'A localized cyst can appear as a rounded lump; a smooth surface does not prove it.' },
        { title: 'A tumor or other tissue growth', text: 'A persistent solid mass can look similar. It may be benign or malignant; the outside appearance cannot tell.' },
        { title: 'An old injury or localized swelling', text: 'Compare older photos and watch for redness, broken skin or growth over time.' },
      ];
      match.summary = 'A smooth lump can be a cyst, tumor or another localized swelling. These answers do not yet distinguish the cause.';
    }
    return match;
  };
  const leaders = new Map();
  for (const pattern of patterns) {
    const match = matchForPattern(pattern);
    if (match) leaders.set(match.id, { ...match, weights: { ...leaders.get(match.id)?.weights, ...match.weights } });
  }
  if (hasPinecone) leaders.set('dropsy', CONDITIONS.find(c => c.id === 'dropsy'));
  const primaryId = matchForPattern(selected)?.id;
  const candidates = [...leaders.values()].map(condition => ({
    ...condition,
    fits: features.filter(id => (condition.weights[id] || 0) >= 3),
  })).filter(c => c.fits.length)
    .sort((a, b) => b.fits.length - a.fits.length || Number(!!b.diagnosis) - Number(!!a.diagnosis) || Number(b.id === primaryId) - Number(a.id === primaryId) || a.id.localeCompare(b.id));
  const covered = new Set(), findings = [];
  for (const candidate of candidates) {
    if (candidate.fits.every(id => covered.has(id))) continue;
    findings.push({ ...candidate, matched: candidate.fits.map(id => id === 'lumps' && GROWTH_CHOICES.some(c => c.id === input.growthAppearance && c.id !== 'unclear')
      ? `${LABELS[id]}: ${GROWTH_CHOICES.find(c => c.id === input.growthAppearance).title.toLowerCase()}` : LABELS[id]) });
    candidate.fits.forEach(id => covered.add(id));
  }
  // Keep the named probable match beside that heading; unresolved observations
  // stay visible as separate concerns even when they account for more signs.
  findings.sort((a, b) => Number(!!b.diagnosis) - Number(!!a.diagnosis));
  const unexplained = features.filter(id => !covered.has(id));
  const assessment = assessUrgency(input);
  const contextConcerns = [];
  if (assessment.checks.length && !findings.some(c => c.id === 'water')) {
    contextConcerns.push({ ...CONDITIONS.find(c => c.id === 'water'), reason: assessment.checks.join(' ') });
  }
  const findingIds = new Set(findings.map(c => c.id));
  const alternativeMap = new Map();
  for (const finding of findings) for (const other of lookalikesFor(finding.id, input.water)) {
    if (!findingIds.has(other.id) && !alternativeMap.has(other.id)) alternativeMap.set(other.id, other);
  }
  const messages = [];
  if (patterns.includes('dots') && patterns.includes('dust')) messages.push('You selected both separate grains and fine dust. Those textures point to different possibilities; compare them closely before choosing a treatment.');
  if (patterns.includes('fuzz') && patterns.includes('patch')) messages.push('You selected both outward threads and flat pale patches. They can be hard to tell apart; color alone cannot choose between their causes.');
  if (selected === 'unclear' && patterns.length) messages.push('The extra visible signs give us more to work with than the first “Nothing obvious” choice. The possibilities below use those specific signs.');
  if (input.initialSign === 'dots' && input.textureSign && !['dots','unclear'].includes(input.textureSign)) messages.push(`Your closer texture choice was “${LABELS[input.textureSign]},” so it is used instead of the first “White dots” choice.`);
  if (findings.length > 1) messages.push('Different signs may share a cause, or more than one problem may be present. These are possibilities to check—not a reason to combine medicines.');
  if (contextConcerns.length) messages.push('The tank history or readings also raise an environmental concern. That can coexist with a skin problem, rather than replacing it.');
  const diagnoses = findings.filter(c => c.diagnosis);
  const unresolvedFindings = findings.filter(c => !c.diagnosis);
  const title = diagnoses.length > 1 ? 'Probable diagnoses' : diagnoses.length ? 'Probable diagnosis' : findings.length ? 'Possible causes — not narrowed down yet' : 'No clear diagnosis yet';
  return {
    status: !findings.length ? 'insufficient' : findings.length > 1 ? 'multiple' : 'single',
    primary: findings[0] || null, findings, alternatives: [...alternativeMap.values()],
    diagnoses, unresolvedFindings, title,
    unexplained, contextConcerns, messages, urgent: assessment.urgent,
  };
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
  water: [['gill-parasites', 'Gill irritation can also cause rapid breathing. Check the tank and watch for rubbing or excess mucus.'], ['velvet-fresh', 'Freshwater gill disease may have little visible dust; this is a breathing overlap, not a confirmed skin match.'], ['velvet-marine', 'Marine gill disease can progress quickly with little visible dust; breathing trouble needs urgent help.']],
  'gill-parasites': [['water', 'Low oxygen and water-quality problems can cause similar irritation and breathing changes.'], ['velvet-fresh', 'Freshwater velvet may involve the gills without an obvious skin pattern.'], ['velvet-marine', 'Marine velvet can affect the gills with few visible changes.']],
  growth: [['normal', 'Compare the location and shape with normal anatomy for this species.'], ['water-mold', 'Cottony threads project into the water; a solid lump has a different structure.']],
  lymphocystis: [['growth', 'A cyst, tumor or other solid lump can resemble a wart; compare the surface and changes over time.'], ['water-mold', 'Cottony threads are soft outward filaments, not solid cauliflower-like nodules.']],
  normal: [['growth', 'A genuinely new or enlarging lump needs attention rather than assuming it is normal.']],
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
  const diagnosis = assessDiagnosis(input);
  const env = { fresh: 'Freshwater', marine: 'Saltwater', unknown: 'Not sure' }[input.water] || 'Not recorded';
  return [
    'FISH HEALTH — CASE NOTES',
    'A probable match from this guide is not a confirmed diagnosis.',
    '',
    `Water: ${env}`,
    `Fish / species: ${show(input.species)}`,
    `How long: ${show(input.duration)}`,
    `Fish affected: ${show(input.affected)}`,
    `Tank established: ${show(input.tankAge)}`,
    `Onset / recent changes: ${show(input.onset)}`,
    `Visible signs / behavior: ${(input.signs || []).map(id => LABELS[id] || id).join('; ') || 'No signs selected'}`,
    ...(diagnosis.findings.some(c => c.fits.includes('lumps')) ? [`Growth appearance: ${GROWTH_CHOICES.find(c => c.id === input.growthAppearance)?.title || 'Not recorded'}`] : []),
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
    `Probable diagnosis / possible problems: ${diagnosis.diagnoses.map(c => c.title).join('; ') || 'No specific disease identified from these answers.'}`,
    `Observed patterns with unresolved causes (not diagnoses): ${diagnosis.unresolvedFindings.map(c => c.title).join('; ') || 'None listed.'}`,
    `Possible causes to distinguish (not established): ${diagnosis.unresolvedFindings.flatMap(c => (c.possibleCauses || []).map(cause => cause.title)).join('; ') || 'None listed.'}`,
    `Other similar-looking possibilities: ${diagnosis.alternatives.map(c => c.title).join('; ') || 'None listed.'}`,
    `Other environmental concerns: ${diagnosis.contextConcerns.map(c => c.reason).join('; ') || 'None flagged by the entered readings/history.'}`,
    `Unresolved signs: ${diagnosis.unexplained.map(id => LABELS[id]).join('; ') || 'None identified by the guide; this does not rule out other causes.'}`,
    `Visual page used to start this check (NOT evidence of a diagnosis): ${CONDITIONS.find(c => c.id === input.visualReference)?.title || 'None selected.'}`,
    `Entries manually chosen for comparison (user selections, not diagnoses): ${(input.comparisons || []).map(id => CONDITIONS.find(c => c.id === id)?.title).filter(Boolean).join('; ') || 'None selected.'}`,
    '',
  ].join('\n');
}
