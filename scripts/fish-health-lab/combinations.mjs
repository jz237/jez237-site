// Every answer combination the fish check can produce, and what each result says and shows
// (Jez, Nov 6 2026 19:21: "check all the combinations so that this type of mismatch does not
// occur"; Astra 19:50: the first tests only looked for breathing wording). Used by
// combinations.test.mjs; run directly for a report: node scripts/fish-health-lab/combinations.mjs
import { assessDiagnosis } from '../../experiments/fish-health-lab/logic.mjs';
import { SYMPTOMS, BEHAVIORS, GROWTH_CHOICES, FISH_TYPES, closerQuestionFor } from '../../experiments/fish-health-lab/data.mjs';
import { imageFor, FEATURE_PICTURES, pictureShows } from '../../experiments/fish-health-lab/fish-images.mjs';

const VISUAL = SYMPTOMS.map(s => s.id), BEHAVIOR_IDS = BEHAVIORS.map(b => b.id);
const upTo = (list, n) => { const out = [[]]; const go = (start, cur) => { for (let i = start; i < list.length; i++) { const next = [...cur, list[i]]; out.push(next); if (next.length < n) go(i + 1, next); } }; go(0, []); return out; };

// Every input: water × fish type × picture × texture/closer/growth answer × up to `behaviors`
// behaviors, plus each extra visual sign (with no behaviors).
export function* inputs({ behaviors = 2 } = {}) {
  const behaviorSets = upTo(BEHAVIOR_IDS, behaviors);
  for (const water of ['fresh', 'marine']) for (const fishType of ['', ...FISH_TYPES[water].map(f => f.id)]) for (const sign of VISUAL) {
    const textures = water === 'fresh' && sign === 'dots' ? ['dots', 'dust', 'fuzz', 'patch', 'lumps', 'unclear'] : [null];
    for (const texture of textures) {
      const main = texture && texture !== 'unclear' ? texture : sign;
      const question = texture ? null : closerQuestionFor(sign, water);
      for (const closer of question ? question.choices.map(c => c.id) : ['']) {
        const extras = [[], ...VISUAL.filter(v => v !== main && v !== 'unclear').map(v => [v])];
        for (const extra of extras) {
          const visualSigns = [main, ...extra];
          const growths = visualSigns.includes('lumps') ? GROWTH_CHOICES.map(g => g.id) : [''];
          for (const growthAppearance of growths) for (const picked of extra.length ? [[]] : behaviorSets)
            yield { water, fishType, primarySign: main, initialSign: sign, textureSign: texture || '', closer, growthAppearance, visualSigns, signs: [...visualSigns, ...picked] };
        }
      }
    }
  }
}

// Words that claim a sign. A sentence only counts as a claim when the words aren't advice
// ("watch for…", "especially with…", "if…") or a description of the disease itself.
const CLAIMS = {
  breathing: [/fast breathing|breathe fast|breathing fast|fast gills|breathing hard/i, ['breathing', 'gasping', 'red-gills']],
  gasping: [/gasping/i, ['gasping', 'breathing']],
  'red-gills': [/red gills|inflamed gills/i, ['red-gills']],
  several: [/several fish|more than one fish|other fish (have|are)|whole tank is sick|fish are dying|fish have died/i, ['several', 'deaths']],
  dots: [/white (grains|dots|spots)|salt-like|sprinkled with salt/i, ['dots']],
  dust: [/gold(-brown)? dust|fine dust/i, ['dust']],
  fuzz: [/cotton|fluffy|fuzzy threads|threads sticking/i, ['fuzz', 'lumps']],
  slime: [/extra slime|thick slime|peeling skin/i, ['patch']],
  pits: [/\bpits\b/i, ['patch']],
  fins: [/ragged|shrinking fins|torn fin/i, ['fins']],
  sores: [/open (red )?sores?/i, ['sores']],
  streaks: [/red streaks|blotches/i, ['sores']],
  swollen: [/swollen belly|swelling|bloated/i, ['swollen', 'pinecone']],
  pinecone: [/pinecone|pine cone/i, ['pinecone', 'swollen']],
  eyes: [/bulging eye|milky film|cloudy eye/i, ['eyes']],
  balance: [/floating|tilting|can’t stay level|losing balance/i, ['balance', 'collapse']],
  lumps: [/lump|cauliflower/i, ['lumps', 'fuzz']],
  rubbing: [/scratching|flashing|rubbing/i, ['rubbing']],
  appetite: [/not eating|refusing food|stopped eating/i, ['appetite']],
};
const ADVICE = /(often shows as|especially|even before|easy to miss|watch for|check for|look for|look from|\bif |unless|rule out|rather than|\bcan |\bmay |could |\bnot |without|until|usually with)[^.]*$/i;
const has = (input, keys) => keys.some(k => [...input.signs, input.initialSign || ''].some(s => s === k || s.split(':')[0] === k) || (k === 'several' && input.affected === 'several'));

export function claimsIn(text, input) {
  const found = [];
  for (const sentence of (text || '').split(/(?<=[.!?])\s+/)) for (const [sign, [re, keys]] of Object.entries(CLAIMS)) {
    const m = sentence.match(re);
    if (m && !has(input, keys) && !ADVICE.test(sentence.slice(0, m.index))) found.push({ sign, sentence });
  }
  return found;
}

// What each result says ("Why we think so", the attention box, water notes) and the picture it shows.
export function check(input) {
  const d = assessDiagnosis(input), problems = [];
  const behaviors = input.signs.filter(id => BEHAVIOR_IDS.includes(id));
  for (const c of d.findings) {
    const why = c.reason.replace(/^You (picked|said)[^.]*\.\s*/, '');
    for (const claim of claimsIn(why, input)) problems.push({ kind: 'wording', id: c.id, ...claim });
    if (c.chosen) continue;
    const features = [...c.fits, ...behaviors];
    const ruled = features.filter(f => FEATURE_PICTURES[f] || FEATURE_PICTURES[f.split(':')[0]]);
    const image = imageFor(input.fishType, c.id, input.water, features);
    if (ruled.length && !ruled.some(f => pictureShows(image, FEATURE_PICTURES[f] ? f : f.split(':')[0])))
      problems.push({ kind: 'picture', id: c.id, features: ruled, alt: image?.alt });
  }
  for (const text of [...d.messages, ...d.contextConcerns.map(c => c.reason)]) for (const claim of claimsIn(text, input)) problems.push({ kind: 'wording', id: 'notes', ...claim });
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tally = new Map(); let runs = 0;
  for (const input of inputs({ behaviors: Number(process.argv[2] || 2) })) {
    runs++;
    for (const p of check(input)) {
      const key = `${p.kind} ${input.water} ${p.id} ${p.kind === 'wording' ? `${p.sign}: ${p.sentence}` : `${p.features.join('+')} → ${p.alt}`}`;
      const e = tally.get(key) || { n: 0, example: input }; e.n++; tally.set(key, e);
    }
  }
  for (const [k, e] of [...tally].sort()) console.log(`${k}  [${e.n}× e.g. ${e.example.fishType || '-'} ${e.example.signs.join(',')}${e.example.closer ? ' closer:' + e.example.closer : ''}${e.example.growthAppearance ? ' growth:' + e.example.growthAppearance : ''}]`);
  console.log(JSON.stringify({ runs, problems: tally.size }));
}
