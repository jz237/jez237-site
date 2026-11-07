export const SOURCES = [
  { id: 'parasites', name: 'Merck · Fish diseases: pet owner guide', url: 'https://www.merckvetmanual.com/all-other-pets/fish/disorders-and-diseases-of-fish#v3226749' },
  { id: 'bacteria', name: 'Merck · Skin problems: pet owner guide', url: 'https://www.merckvetmanual.com/all-other-pets/fish/disorders-and-diseases-of-fish#Skin-Disorders_v3226728' },
  { id: 'management', name: 'Merck · Routine health care of fish', url: 'https://www.merckvetmanual.com/all-other-pets/fish/routine-health-care-of-fish' },
  { id: 'growths', name: 'Merck · Lymphocystis and other viral skin growths', url: 'https://www.merckvetmanual.com/all-other-pets/fish/disorders-and-diseases-of-fish#v3226746' },
  // Dr. Gerald Bassleer's practical diagnosis articles (recommended by The Hidden Reef's owner, Nov 7 2026).
  { id: 'bassleer-white-spots', name: 'Bassleer · White spots on aquarium fish', url: 'https://bassleer.com/blog/2026/04/28/white-spots-on-aquarium-fish-what-they-mean/' },
  { id: 'bassleer-parasite-fungus', name: 'Bassleer · Parasite or fungus? How to tell', url: 'https://bassleer.com/blog/2026/08/05/fish-parasite-vs-fungus-how-to-tell-them-apart/' },
  { id: 'bassleer-marine-parasites', name: 'Bassleer · Marine fish parasites', url: 'https://bassleer.com/blog/2026/08/11/marine-fish-parasite-guide-for-fast-diagnosis/' },
  { id: 'bassleer-fungus-columnaris', name: 'Bassleer · Fungus or columnaris?', url: 'https://bassleer.com/blog/2026/08/04/fish-fungus-vs-columnaris-how-to-tell-them-apart/' },
  { id: 'bassleer-fin-rot', name: 'Bassleer · Spotting fin rot early', url: 'https://bassleer.com/blog/2026/08/20/how-to-recognize-fin-rot-early-in-aquarium-fish/' },
  { id: 'bassleer-ulcers', name: 'Bassleer · Why fish get ulcers', url: 'https://bassleer.com/blog/2026/08/29/why-does-my-fish-have-ulcers-causes-and-care/' },
  { id: 'bassleer-swelling', name: 'Bassleer · Dropsy or constipation?', url: 'https://bassleer.com/blog/2026/09/19/dropsy-vs-constipation-in-fish/' },
  { id: 'bassleer-popeye', name: 'Bassleer · Popeye recovery', url: 'https://bassleer.com/blog/2026/10/05/betta-popeye-recovery-a-practical-treatment-plan/' },
  { id: 'bassleer-gasping', name: 'Bassleer · Fish gasping at the surface', url: 'https://bassleer.com/blog/2026/08/10/fish-gasping-at-surface-causes-and-what-to-do/' },
  { id: 'bassleer-flashing', name: 'Bassleer · Fish flashing against objects', url: 'https://bassleer.com/blog/2026/05/02/fish-flashing-against-objects-what-it-means/' },
  { id: 'bassleer-parasites-bacteria', name: 'Bassleer · Parasites or bacteria?', url: 'https://bassleer.com/blog/2026/10/03/parasites-versus-bacterial-infections-in-fish/' },
  { id: 'bassleer-stress', name: 'Bassleer · Stress or disease?', url: 'https://bassleer.com/blog/2026/06/11/fish-stress-vs-disease-how-to-tell/' },
];

export const SYMPTOMS = [
  { id: 'dots', title: 'White dots', text: 'Separate grains, like salt', art: 'dots' },
  { id: 'dust', title: 'Fine dust or sheen', text: 'Much finer than salt grains', art: 'dust' },
  { id: 'fuzz', title: 'Cottony growth', text: 'Fuzzy threads or tufts', art: 'fuzz' },
  { id: 'patch', title: 'Pale patches', text: 'Pale areas, slime or pits', art: 'patch' },
  { id: 'fins', title: 'Damaged fins', text: 'Torn, shortened or ragged', art: 'fins' },
  { id: 'sores', title: 'Redness or sores', text: 'Red areas or open wounds', art: 'sores' },
  { id: 'swollen', title: 'Swollen body', text: 'Unusual belly enlargement', art: 'swollen' },
  { id: 'eyes', title: 'Eye changes', text: 'Cloudy or bulging eyes', art: 'eyes' },
  { id: 'lumps', title: 'Raised lumps', text: 'Larger, irregular growths', art: 'lumps' },
  { id: 'breathing', title: 'Fast breathing', text: 'Rapid gills or surface gasping', art: 'breathing' },
  { id: 'balance', title: 'Swimming trouble', text: 'Tilting, floating or sinking', art: 'balance' },
  { id: 'unclear', title: 'Nothing obvious', text: 'It just isn’t acting right', art: 'plain' },
];

export const BEHAVIORS = [
  { id: 'rubbing', label: 'Rubbing, scratching or flashing' },
  { id: 'clamped', label: 'Fins held tightly against body' },
  { id: 'appetite', label: 'Eating less or refusing food' },
  { id: 'red-gills', label: 'Red or inflamed gills' },
  { id: 'several', label: 'Other fish have it too' },
  { id: 'pinecone', label: 'Scales sticking out like a pinecone' },
  { id: 'gasping', label: 'Severe or continuous gasping' },
  { id: 'collapse', label: 'Cannot stay upright / barely responsive' },
  { id: 'deaths', label: 'Fish have died during this problem' },
];

export const GROWTH_CHOICES = [
  { id: 'cauliflower', title: 'Rough, wart-like clusters', text: 'Firm bumps bunched together like tiny cauliflower—not soft threads.' },
  { id: 'smooth', title: 'A smooth, rounded lump', text: 'A solid bump under or on the skin, without a rough clustered surface.' },
  { id: 'inflamed', title: 'A red, inflamed or open lump', text: 'The lump looks red, swollen or broken open.' },
  { id: 'unclear', title: 'I can’t tell / none of these fit', text: 'We’ll go with the most common cause.' },
];

// One extra "look closer" question for signs that cover several common
// conditions. Answers become refined feature keys such as "patch:slime".
export const CLOSER_QUESTIONS = {
  dots: {
    water: 'marine', title: 'What colour are the specks?', hint: 'Look in good light, from the side.',
    choices: [
      { id: 'white', title: 'White, like grains of salt', text: 'Separate white dots on the body and fins' },
      { id: 'black', title: 'Tiny black specks', text: 'Like ground pepper—classic on yellow tangs' },
      { id: 'unclear', title: 'Not sure', text: 'Go with the most common cause' },
    ],
  },
  patch: {
    title: 'What does the pale area look like?', hint: 'Pick the closest. It’s fine to be unsure.',
    choices: [
      { id: 'flat', title: 'A flat pale or grey patch', text: 'Sometimes a “saddle” on the back or a fuzzy-looking mouth' },
      { id: 'slime', title: 'Thick slime or peeling skin', text: 'Cloudy, mucus-coated or shedding skin' },
      { id: 'pits', title: 'Pits or holes on the head or side', text: 'Small pale craters, or eroded lines along the side' },
      { id: 'unclear', title: 'Not sure', text: 'Go with the most common cause' },
    ],
  },
  sores: {
    title: 'What do the red areas look like?', hint: 'Pick the closest. It’s fine to be unsure.',
    choices: [
      { id: 'open', title: 'An open sore or ulcer', marineTitle: 'A deep red sore that keeps growing', text: 'Missing scales or a crater in the skin' },
      { id: 'streaks', title: 'Red streaks or blotches', text: 'Bloody-looking fins or red patches under the skin' },
      { id: 'scrape', title: 'A single scrape or wound', text: 'Showed up after a bump, jump or fight' },
      { id: 'unclear', title: 'Not sure', text: 'Go with the most common cause' },
    ],
  },
  swollen: {
    title: 'Look from above: what are the scales doing?', hint: 'Dropsy is serious, so check this one.',
    // Corys and plecos have armour plates, not scales: dropsy shows as a tight, stiff swelling.
    catfishTitle: 'Look from above: how does the swelling look?',
    choices: [
      { id: 'flat', title: 'Lying flat and smooth', catfishTitle: 'Just a full, soft belly', text: 'Just a round, full belly', catfishText: 'Looks like it ate well' },
      { id: 'pinecone', title: 'Sticking out like a pine cone', catfishTitle: 'Swollen tight all over', text: 'Scales raised all over the body', catfishText: 'Body stiff and bloated, skin stretched shiny' },
      { id: 'unclear', title: 'Not sure', text: 'Go with the most common cause' },
    ],
  },
  eyes: {
    title: 'What is happening to the eye?', hint: 'Compare both eyes.',
    choices: [
      { id: 'cloudy', title: 'Cloudy or milky', text: 'A white or grey film over the eye' },
      { id: 'bulging', title: 'Bulging out', text: 'One or both eyes sticking out' },
      { id: 'unclear', title: 'Not sure', text: 'Go with the most common cause' },
    ],
  },
};

export function closerQuestionFor(sign, water) {
  const question = CLOSER_QUESTIONS[sign];
  if (!question || (question.water && question.water !== water)) return null;
  return question;
}

// Optional fish type. Boosts only re-weight conditions that already fit a sign;
// they never add an unrelated disease on their own.
export const FISH_TYPES = {
  fresh: [
    { id: 'betta', plural: 'bettas', title: 'Betta', text: 'Siamese fighting fish', icon: 'betta', boosts: { 'velvet-fresh': 2, 'fin-rot': 2, dropsy: 1, bloat: 1 } },
    { id: 'goldfish', plural: 'goldfish', title: 'Goldfish', text: 'Fancy, common or koi', icon: 'goldfish', boosts: { 'swim-bladder': 3, bloat: 2, flukes: 2, ulcer: 2 } },
    { id: 'guppy', plural: 'guppies', title: 'Guppy', text: 'Fancy & endler', icon: 'livebearer', boosts: { columnaris: 3, 'fin-rot': 2 } },
    { id: 'molly', plural: 'mollies and platies', title: 'Molly / platy', text: 'Incl. swordtails', icon: 'livebearer', boosts: { columnaris: 3, bloat: 1 } },
    { id: 'community', plural: 'tetras and rasboras', title: 'Tetra / rasbora', text: 'Small community fish', icon: 'tetra', boosts: { 'ich-fresh': 1, columnaris: 1 } },
    { id: 'barb', plural: 'barbs and danios', title: 'Barb / danio', text: 'Tiger barb & zebras', icon: 'tetra', boosts: { 'ich-fresh': 2, injury: 2 } },
    { id: 'gourami', plural: 'gouramis', title: 'Gourami', text: 'Dwarf, honey, pearl', icon: 'betta', boosts: { ulcer: 2, bloat: 2 } },
    { id: 'angelfish', plural: 'angelfish and discus', title: 'Angelfish / discus', text: 'Tall, flat cichlids', icon: 'cichlid', boosts: { 'hole-in-head': 3, flukes: 2 } },
    { id: 'african', plural: 'African cichlids and oscars', title: 'African / oscar', text: 'Chunky cichlids', icon: 'cichlid', boosts: { bloat: 3, 'hole-in-head': 2 } },
    { id: 'cory', plural: 'corys', title: 'Cory', text: 'Corydoras catfish', icon: 'catfish', boosts: { ulcer: 2, injury: 1 } },
    { id: 'pleco', plural: 'plecos', title: 'Pleco', text: 'Bristlenose & co.', icon: 'catfish', boosts: { bloat: 1, popeye: 2 } },
  ],
  marine: [
    { id: 'clownfish', plural: 'clownfish', title: 'Clownfish', text: 'Ocellaris & maroon', icon: 'clownfish', boosts: { brooklynella: 4, uronema: 1 } },
    { id: 'tang', plural: 'tangs', title: 'Tang', text: 'Surgeonfish', icon: 'tang', boosts: { 'black-spot': 3, hlle: 3, 'ich-marine': 1 } },
    { id: 'angel', plural: 'angelfish and butterflyfish', title: 'Angel / butterfly', text: 'Dwarf & large angels', icon: 'angel', boosts: { hlle: 2, lymphocystis: 2 } },
    { id: 'wrasse', plural: 'wrasses', title: 'Wrasse', text: 'Six-line, fairy, cleaner', icon: 'wrasse', boosts: { flukes: 2 } },
    { id: 'goby', plural: 'gobies and blennies', title: 'Goby / blenny', text: 'Small bottom perchers', icon: 'wrasse', boosts: { flukes: 1 } },
    { id: 'damsel', plural: 'damsels and chromis', title: 'Damsel / chromis', text: 'Hardy schooling fish', icon: 'damsel', boosts: { uronema: 3, 'velvet-marine': 1 } },
    { id: 'dottyback', plural: 'dottybacks and basslets', title: 'Dottyback / basslet', text: 'Royal gramma & co.', icon: 'wrasse', boosts: { 'ich-marine': 1 } },
  ],
};

// Fish types that were split up (Nov 5 2026). An old id from a link or older code
// opens the first new sub-group, so nothing that used it breaks.
export const LEGACY_FISH_IDS = { fresh: { livebearer: 'guppy', cichlid: 'angelfish', catfish: 'cory' }, marine: {} };
export const currentFishId = (water, id) => LEGACY_FISH_IDS[water]?.[id] || id;

export function fishTypeFor(water, id) {
  const current = currentFishId(water, id);
  return (FISH_TYPES[water] || []).find(f => f.id === current) || null;
}

export const URGENCY = {
  today: { label: 'Act today', rank: 3 },
  week: { label: 'Treat this week', rank: 2 },
  watch: { label: 'Watch it', rank: 1 },
};

// Hobbyist best-guess weights. Refined keys ("patch:slime") override the base
// sign when present; a refined weight of 0 rules a condition out.
// Weights rank the guide's guesses only and are never shown as percentages.
export const CONDITIONS = [
  {
    id: 'water', title: 'Ammonia/nitrite burn or low oxygen', scope: 'both', kind: 'Water problem', art: 'breathing', urgency: 'today',
    summary: 'The most common reason fish suddenly struggle. Bad water or low oxygen stresses fish fast—breathing, balance and appetite can all go off.',
    hint: 'Fast breathing, red gills or several fish affected at once.',
    weights: { breathing: 5, unclear: 4, balance: 2, appetite: 1, 'red-gills': 5, several: 3, gasping: 4, collapse: 2, deaths: 3 },
    clues: ['Fast breathing, gasping at the surface or hanging near the filter outlet.', 'Red or inflamed gills, or several fish acting off at the same time—often after a new setup, overfeeding or a filter problem.'],
    distinguish: 'Gill flukes and velvet can also cause fast breathing. Fish that gasp even with plenty of bubbles often have nitrite in the water, and gasping only around dawn points to oxygen running low overnight. Test the water first—it’s quick and rules the most common cause in or out.',
    check: 'Fast breathing is most often a water or oxygen problem, especially with red gills or more than one fish affected.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "balance": "Losing balance—tilting, sinking or struggling to stay upright—often starts with bad water or low oxygen, especially when it comes on suddenly." },
    avoid: 'Don’t add medicine until you’ve tested the water. An air stone helps but won’t fix ammonia or nitrite. Don’t replace all your filter media at once.',
    source: ['management', 'bassleer-gasping', 'bassleer-stress'],
    tips: { goldfish: 'Goldfish are messy and need big, regular water changes—overstocking is a common cause.', molly: 'Mollies “shimmy” (wobble in place with clamped fins) when the water is dirty or too soft—test and change water.' },
  },
  {
    id: 'ich-fresh', title: 'Ich (white spot disease)', scientific: 'Ichthyophthirius multifiliis', scope: 'fresh', kind: 'Parasite', art: 'dots', urgency: 'today',
    summary: 'A very common parasite. It looks like the fish has been sprinkled with salt.',
    hint: 'Separate white grains, like salt, on the body and fins.',
    weights: { dots: 6, 'dots:white': 7, rubbing: 2, clamped: 1, several: 2, breathing: 1, appetite: 1 },
    clues: ['Separate white grains on the body or fins, rather than fluffy threads.', 'Rubbing, clamped fins, less appetite or fast breathing often come with it.'],
    distinguish: 'Velvet is a much finer gold dust; fungus is fluffy threads; bigger lumps are something else. Breeding tubercles on male goldfish, and sand stuck in slime after scratching, can look like spots.',
    check: 'Separate salt-like white grains are the classic sign of ich.',
    avoid: 'Spots falling off doesn’t mean it’s over—finish the full course. If you raise the heat, add extra aeration too. Don’t mix several medicines at once.',
    source: ['parasites', 'bassleer-white-spots'], atlas: true,
    tips: {
      cory: 'Corys, plecos and other scaleless fish are sensitive: skip salt and use a medicine labelled safe for scaleless fish, at the dose its label gives for them.',
      pleco: 'Plecos, corys and other scaleless fish are sensitive: skip salt and use a medicine labelled safe for scaleless fish, at the dose its label gives for them.',
      barb: 'Barbs and danios catch ich easily, especially new arrivals—treat the whole tank.',
      goldfish: 'Goldfish are coldwater fish—raise the heat gently, to no more than about 75 °F (24 °C).',
      betta: 'Bettas handle warmth well; keep the lid on and the water calm.',
    },
  },
  {
    id: 'ich-marine', title: 'Marine ich (Cryptocaryon)', scientific: 'Cryptocaryon irritans', scope: 'marine', kind: 'Parasite', art: 'dots', urgency: 'today',
    summary: 'The saltwater version of white spot. A different parasite from freshwater ich, and it lives in the whole display tank.',
    hint: 'White salt-like grains on a saltwater fish.',
    weights: { dots: 6, 'dots:white': 7, 'dots:black': 1, rubbing: 2, breathing: 3, several: 2, appetite: 1, clamped: 1 },
    clues: ['White spots on the skin or fins; spots may come and go.', 'Scratching on rocks, fast breathing and several exposed fish.'],
    distinguish: 'Marine velvet is a finer dust and moves faster. Tiny black specks on a tang point to black spot disease instead.',
    check: 'Separate white grains on a saltwater fish are the classic sign of marine ich.',
    // Wording when a different answer led here (Nov 6 2026 combination sweep).
    checks: { "breathing+rubbing": "Fast breathing with scratching, especially on a tang, is often marine ich starting on the gills—look for white grains on the fins and body.", "breathing": "Fast breathing on a saltwater fish—especially a tang—can be marine ich starting on the gills; look for white grains on the fins and body." },
    avoid: 'Don’t copy freshwater ich advice. Never dose copper in a reef or a tank with invertebrates.',
    source: ['parasites', 'bassleer-marine-parasites'],
    tips: { tang: 'Tangs are ich magnets—treat every fish that shared the tank, not just the spotty one.' },
  },
  {
    id: 'velvet-fresh', title: 'Velvet', scientific: 'Piscinoodinium species', scope: 'fresh', kind: 'Parasite', art: 'dust', urgency: 'today',
    summary: 'A fine gold or rusty dust on the skin. Easy to miss—shine a torch across the fish to see it.',
    hint: 'Very fine gold or rust-coloured dust; check with a torch.',
    weights: { dust: 6, breathing: 3, rubbing: 2, clamped: 1, appetite: 1, gasping: 2, several: 1 },
    clues: ['A very fine dusting rather than obvious salt-grain dots.', 'Clamped fins, rubbing, fast breathing.'],
    distinguish: 'Ich grains are bigger and more separate. Natural shimmer follows the scales and lighting.',
    check: 'A fine gold-brown dust, especially with clamped fins or fast breathing, is classic velvet.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "breathing": "Fast breathing with clamped fins is a classic early velvet sign—shine a flashlight from the side to look for a fine gold dust, which is easy to miss." },
    avoid: 'Don’t wait for it to “clear up”—velvet gets worse quickly.', source: ['parasites', 'bassleer-parasite-fungus'],
    tips: { betta: 'Bettas get velvet a lot. Shine a torch from the side to see the gold dust.' },
  },
  {
    id: 'velvet-marine', title: 'Marine velvet (Amyloodinium)', scientific: 'Amyloodinium ocellatum', scope: 'marine', kind: 'Parasite', art: 'dust', urgency: 'today',
    summary: 'One of the fastest killers in saltwater. Fish breathe fast and may show a fine dusty sheen—or almost nothing.',
    hint: 'Fine dusty sheen with fast breathing—moves very fast.',
    weights: { dust: 6, breathing: 4, gasping: 4, deaths: 3, several: 2, appetite: 1, clamped: 1 },
    clues: ['A fine dusting or dull sheen, though it may be hard to see.', 'Fast breathing and sudden losses are big warning signs.'],
    distinguish: 'Marine ich has bigger, separate spots. Low oxygen and gill flukes also cause fast breathing.',
    check: 'A fine dust on a saltwater fish—usually with fast breathing—is a strong velvet warning.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "breathing": "Fast breathing on a saltwater fish is a strong velvet warning, even before any dust shows." },
    avoid: 'Don’t wait for obvious spots. Never put copper in a reef display.', source: ['parasites', 'bassleer-marine-parasites'],
    tips: { clownfish: 'Clowns get velvet too; if it’s slime and peeling skin rather than dust, think Brooklynella.' },
  },
  {
    id: 'water-mold', title: 'Fungus (cottony water mold)', scientific: 'For example, Saprolegnia species', scope: 'fresh', kind: 'Fungus-like', art: 'fuzz', urgency: 'week',
    summary: 'White cotton-wool tufts that grow on an injury or weak spot.',
    hint: 'Fluffy cotton-wool threads sticking out from the skin.',
    weights: { fuzz: 6, sores: 2, 'sores:streaks': 0, fins: 1, patch: 1 },
    clues: ['Clearly fuzzy threads or tufts on a damaged area.', 'Often starts on a wound, torn fin or after rough handling.'],
    distinguish: 'A flat, clinging grey-white patch is more likely columnaris (bacterial), even if people call it “fungus”—especially on the lips or as a saddle behind the back fin. Fungus grows over days; columnaris can spread in hours.',
    check: 'Fuzzy threads sticking out into the water are classic fungus.',
    avoid: 'Don’t scrape or pull off the growth.', source: ['parasites', 'bacteria', 'bassleer-fungus-columnaris'],
  },
  {
    id: 'columnaris', title: 'Columnaris (cotton-mouth / saddleback)', scientific: 'Flavobacterium columnare', scope: 'fresh', kind: 'Bacteria', art: 'patch', urgency: 'today',
    summary: 'A fast-moving bacterial infection. Pale patches on the back, mouth or fins that can look “fuzzy”.',
    hint: 'Pale saddle on the back, fuzzy mouth or fraying fins.',
    weights: { patch: 5, 'patch:flat': 7, 'patch:slime': 2, 'patch:pits': 0, fins: 3, fuzz: 2, breathing: 1, sores: 1, deaths: 2, several: 1 },
    clues: ['Pale skin or mouth lesions, or a pale “saddle” across the back.', 'Fins fraying from the edges; it can spread through a tank fast in warm water.'],
    distinguish: 'True fungus has fluffy threads sticking out, grows over days and usually starts on a wound. Columnaris can go from one fish to several within hours. Fin rot is usually slower and follows dirty water.',
    check: 'Flat pale patches—especially a saddle on the back or a white mouth—are classic columnaris.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "fins": "Fins that fall apart fast, with pale or white edges, can be columnaris rather than ordinary fin rot—especially in livebearers.", "fuzz": "A fuzzy-looking white patch, especially on the mouth, is often columnaris rather than true fungus.", "patch:slime": "Pale, slimy or peeling patches that spread fast can be columnaris." },
    avoid: 'Don’t raise the heat—columnaris loves warm water.', source: ['bacteria', 'bassleer-fungus-columnaris'],
    tips: { guppy: 'Guppies, mollies and platies are very prone to columnaris.', molly: 'Mollies, platies and guppies are very prone to columnaris.' },
  },
  {
    id: 'fin-rot', title: 'Fin rot', scope: 'both', kind: 'Bacteria', art: 'fins', urgency: 'week',
    summary: 'Fins that look ragged, shorter or have white or red edges. Almost always starts with dirty water or stress.',
    hint: 'Ragged, shrinking fins with white or red edges.',
    weights: { fins: 6, sores: 1, clamped: 1 },
    clues: ['Split, shortened or ragged fin edges, sometimes white or red.', 'Gets slowly worse rather than appearing all at once.'],
    distinguish: 'A tear from a fight is one clean split that stays the same size and regrows clear. Fin rot has a fuzzy, discoloured edge that creeps toward the body—a photo each day shows which. Fast fin loss with pale patches suggests columnaris.',
    check: 'Ragged, shrinking fins are the classic sign of fin rot.',
    avoid: 'Don’t trim fins or use human products. Mild fraying often heals with clean water alone; get a medicine if the edge keeps moving or redness reaches the base of the fin.', source: ['bacteria', 'management', 'bassleer-fin-rot'],
    tips: { betta: 'Long-finned bettas: also check decorations for sharp edges, and watch for tail-biting.', guppy: 'Guppies’ big tails rot easily—clean water matters most.' },
  },
  {
    id: 'ulcer', title: 'Bacterial ulcers', scope: 'both', kind: 'Bacteria', art: 'sores', urgency: 'week',
    summary: 'Open red sores where scales are missing, usually from bacteria taking hold after stress or bad water.',
    hint: 'Open red sores or craters where scales are missing.',
    weights: { sores: 6, 'sores:open': 8, 'sores:streaks': 3, 'sores:scrape': 2, patch: 1, appetite: 1, 'lumps:inflamed': 8 },
    marineWeights: { sores: 4, 'sores:open': 5 },
    clues: ['Red, open sores, often with missing scales.', 'May start as a red spot and get bigger.'],
    distinguish: 'A single sore where the fish rubs or got hit is more likely an injury; sores on several fish point to the water, parasites or infection. Red streaks in the fins point to septicemia.',
    check: 'Open red sores are most often bacterial ulcers.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "lumps:inflamed": "A red, inflamed lump is often a bacterial infection under the skin, and it can open into an ulcer." },
    avoid: 'Don’t use human skin creams or random leftover antibiotics.', source: ['bacteria', 'management', 'bassleer-ulcers'],
    tips: {
      goldfish: 'Goldfish and koi are prone to ulcers (Aeromonas)—check the water first.',
      gourami: 'Dwarf gouramis with sores, faded colour and swelling may have dwarf gourami disease (a virus)—keep them apart from other gouramis.',
      cory: 'Corys get red, sore bellies from dirty or sharp gravel—vacuum the substrate and use smooth sand.',
    },
  },
  {
    id: 'septicemia', title: 'Hemorrhagic septicemia (red streaks)', scope: 'both', kind: 'Bacteria', art: 'sores', urgency: 'today',
    summary: 'A body-wide bacterial infection. Red streaks in the fins, red blotches under the skin, often after bad water or stress.',
    hint: 'Bloody streaks in the fins or red blotches under the skin.',
    weights: { sores: 3, 'sores:streaks': 8, 'sores:open': 2, 'sores:scrape': 0, fins: 1, appetite: 1, 'red-gills': 1, deaths: 2 },
    clues: ['Red streaks in the fins or tail, or red blotches on the body.', 'The fish may be lethargic and off its food.'],
    distinguish: 'Ammonia burn can also redden fins and gills—test the water. Open craters are more like ulcers.',
    check: 'Red streaks and blotches are a classic sign of a bacterial blood infection.',
    avoid: 'Don’t wait—this one can spread and kill.', source: ['bacteria', 'bassleer-parasites-bacteria'],
  },
  {
    id: 'dropsy', title: 'Dropsy', scope: 'both', kind: 'Internal infection', art: 'swollen', urgency: 'today',
    summary: 'Fluid builds up inside the fish, so it swells and the scales stick out like a pinecone. A sign of a serious internal problem.',
    hint: 'Swollen body with scales sticking out like a pinecone.',
    weights: { swollen: 3, 'swollen:pinecone': 9, 'swollen:flat': 1, pinecone: 9, appetite: 1, balance: 1 },
    clues: ['A swollen body; seen from above, the scales stick out like a pinecone.', 'Often lethargic, not eating, sometimes bulging eyes.'],
    distinguish: 'Look straight down from above in good light—side views fool you on deep-bodied fish. A swollen belly with flat scales, mostly toward the vent, is more often bloat, constipation or eggs.',
    check: 'Pinecone scales—usually on a swollen body—are the classic sign of dropsy.',
    avoid: 'Don’t leave it in the main tank—move it out.', source: ['management', 'bacteria', 'bassleer-swelling'],
    tips: { betta: 'Bettas are prone to dropsy; catching it early gives the best chance.' },
  },
  {
    id: 'bloat', title: 'Bloat or constipation', scope: 'both', kind: 'Digestion', art: 'swollen', urgency: 'week',
    summary: 'A swollen belly from overfeeding, dry food or a blocked gut—usually fixable with a short fast.',
    hint: 'Swollen belly but scales lie flat.',
    weights: { swollen: 6, 'swollen:pinecone': 1, appetite: 1, balance: 3 },
    clues: ['A round, swollen belly with scales lying flat.', 'Stringy poop or no poop, sometimes floating or tilting.'],
    distinguish: 'If the scales stick out like a pinecone when you look from above, it’s dropsy. Females may just be full of eggs—evenly round and still eating. A thin fish with a swollen belly, or swelling on one side only, is more than constipation.',
    check: 'A swollen belly with flat scales is most often bloat or constipation.',
    avoid: 'Don’t keep feeding dry flakes while it’s swollen.', source: ['management', 'bassleer-swelling'],
    tips: {
      guppy: 'A swollen female may simply be pregnant—look for a dark “gravid spot” near the vent. Thin red threads poking out of the vent are Camallanus worms and need a dewormer.',
      molly: 'A swollen female molly or platy may simply be pregnant—look for a dark “gravid spot” near the vent.',
      african: 'African cichlids: swelling plus no appetite and white, stringy poop can be “Malawi bloat”—act quickly.',
      gourami: 'In dwarf gouramis, swelling plus faded colour and sores can be dwarf gourami disease.',
      pleco: 'Plecos need sinking wafers and veg; too much protein bloats them, too little food leaves a sunken belly.',
      goldfish: 'Fancy goldfish: soak dry food before feeding.',
    },
  },
  {
    id: 'popeye', title: 'Popeye', scope: 'both', kind: 'Eye', art: 'eyes', urgency: 'week',
    summary: 'One or both eyes bulge out. One eye is usually an injury; both eyes usually means bad water or infection.',
    hint: 'Eye bulging out of the head.',
    weights: { eyes: 4, 'eyes:bulging': 8, 'eyes:cloudy': 1, appetite: 1 },
    clues: ['One or both eyes sticking out further than normal.', 'The eye may also look cloudy.'],
    distinguish: 'Both eyes bulging, or a swollen belly or pinecone scales as well, points to the water or a body-wide problem rather than a knock. A clear bulging eye has a better outlook than a cloudy or bloody one. Some goldfish (telescope eyes) naturally have bulging eyes. Only cloudy, not bulging, is cloudy eye.',
    check: 'A bulging eye is classic popeye.',
    avoid: 'Don’t use human eye drops or touch the eye.', source: ['management', 'bacteria', 'bassleer-popeye'],
    tips: { pleco: 'Plecos often get popeye from a knock or poor water—check for sharp decor and test the water.' },
  },
  {
    id: 'cloudy-eye', title: 'Cloudy eye', scope: 'both', kind: 'Eye', art: 'eyes', urgency: 'week',
    summary: 'A milky film over the eye, usually from poor water or a minor infection. Often clears with clean water.',
    hint: 'Milky white or grey film over the eye.',
    weights: { eyes: 4, 'eyes:cloudy': 8, 'eyes:bulging': 1 },
    clues: ['A white or grey film over one or both eyes.', 'Often appears after water quality slips.'],
    distinguish: 'A bulging eye is popeye. In saltwater, cloudy eyes plus scratching can be flukes.',
    check: 'A milky film over the eye is classic cloudy eye.',
    avoid: 'Don’t rub or touch the eye.', source: ['management', 'bacteria'],
  },
  {
    id: 'swim-bladder', title: 'Swim bladder disorder', scope: 'both', kind: 'Buoyancy', art: 'balance', urgency: 'week',
    summary: 'The fish can’t control its balance—floating, sinking or swimming tilted. Often linked to overeating or constipation.',
    hint: 'Floating, sinking or swimming on its side.',
    weights: { balance: 6, swollen: 2, appetite: 1 },
    clues: ['Floating at the top, stuck at the bottom, or swimming tilted.', 'Often right after a big meal.'],
    distinguish: 'If several fish are struggling at once, check the water and oxygen first.',
    check: 'Floating, sinking or tilting is most often a swim bladder problem.',
    avoid: 'Don’t keep feeding floating dry food while it’s struggling.', source: ['management', 'bacteria'],
    tips: { goldfish: 'Round-bodied fancy goldfish are the classic swim-bladder fish—soak food and feed less.', betta: 'Bettas often get it from overfeeding—a fast usually helps.' },
  },
  {
    id: 'flukes', title: 'Skin or gill flukes', scope: 'both', kind: 'Parasite', art: 'breathing', urgency: 'week',
    summary: 'Tiny worms on the skin or gills. Fish flash, scratch and breathe fast, often with extra slime.',
    hint: 'Scratching or flashing, fast gills, extra slime.',
    weights: { breathing: 3, rubbing: 4, clamped: 1, unclear: 2, 'red-gills': 2, several: 1, gasping: 1 },
    freshWeights: { 'patch:slime': 6 },
    marineWeights: { 'patch:slime': 5, eyes: 2, 'eyes:cloudy': 5 },
    clues: ['Flashing or scratching on rocks, fast gill movement.', 'Extra slime, faded colours; in saltwater, cloudy eyes.'],
    distinguish: 'Bad water causes similar scratching and breathing. Test first. Gill flukes can leave the body looking normal—watch for yawning or one gill cover moving more than the other.',
    check: 'Scratching plus fast gills or extra slime is classic flukes.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "eyes": "On a saltwater fish, cloudy eyes—especially with scratching or rubbing—are a classic sign of skin flukes.", "eyes:cloudy": "On a saltwater fish, cloudy eyes—especially with scratching or rubbing—are a classic sign of skin flukes.", "patch:slime": "Extra slime or a cloudy coat on the skin, especially with scratching or fast gills, is classic flukes.", "breathing": "Fast gills, especially with scratching or flashing, are classic gill flukes.", "unclear+rubbing": "Scratching or flashing with nothing else to see on the fish is classic flukes.", "unclear": "Flukes are too small to see, so a fish that’s off with no marks can have them—watch for scratching, flashing or fast gills." },
    avoid: 'Don’t pick a medicine just because a fish scratched once.', source: ['parasites', 'bassleer-flashing'],
    tips: { goldfish: 'Goldfish and koi often carry flukes—worth treating new arrivals.', angelfish: 'Angelfish and discus often carry gill flukes—fast breathing with one gill held shut is a clue.', wrasse: 'Wrasses are fluke-prone; treat in a hospital tank.', goby: 'Gobies and blennies can carry flukes—treat in a hospital tank.' },
  },
  {
    id: 'lymphocystis', title: 'Lymphocystis', scientific: 'Lymphocystivirus', scope: 'both', kind: 'Virus', art: 'lumps', urgency: 'watch',
    summary: 'A harmless-looking virus that causes white cauliflower-like growths on the fins or skin. Usually goes away on its own.',
    hint: 'White cauliflower-like clusters on fins or skin.',
    weights: { lumps: 1, 'lumps:cauliflower': 9, 'lumps:unclear': 4, 'lumps:smooth': 1, 'lumps:inflamed': 0 },
    marineWeights: { fuzz: 4 },
    clues: ['Rough, white or pink nodules bunched into cauliflower-like clusters.', 'Usually on fins; the fish acts normally.'],
    distinguish: 'A single smooth lump is more like a cyst or tumor. Fluffy threads are fungus.',
    check: 'Cauliflower-like white clusters are the classic look of lymphocystis.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "fuzz": "Cottony or cauliflower-like white growths on a saltwater fish are most often lymphocystis." },
    avoid: 'Don’t cut or scrape off the growths, and don’t use ich medicine on them.', source: ['growths', 'management'],
    tips: { angel: 'Marine angels and butterflyfish get lymphocystis often; it usually clears with good water and food.' },
  },
  {
    id: 'growth', title: 'Cyst or tumor', scope: 'both', kind: 'Growth', art: 'lumps', urgency: 'watch',
    summary: 'A smooth lump under or on the skin. Many are slow-growing and harmless for a long time.',
    hint: 'A single smooth, rounded lump.',
    weights: { lumps: 3, 'lumps:smooth': 8, 'lumps:unclear': 3, 'lumps:cauliflower': 1, 'lumps:inflamed': 1, patch: 0 },
    clues: ['One or more smooth, rounded lumps.', 'Changes slowly over weeks or months.'],
    distinguish: 'Rough clusters suggest lymphocystis. A red, open lump is more like an abscess or ulcer.',
    check: 'A smooth, rounded lump is most often a cyst or tumor.',
    avoid: 'Don’t cut, squeeze or burn a growth.', source: ['growths', 'management'],
  },
  {
    id: 'injury', title: 'Injury, scrape or fin nipping', scope: 'both', kind: 'Injury', art: 'sores', urgency: 'watch',
    summary: 'Bumps, jumps, nets and bullies cause a lot of damage. Clean water lets it heal.',
    hint: 'A clean split or scrape after a bump, jump or fight.',
    weights: { sores: 2, 'sores:scrape': 8, 'sores:streaks': 0, fins: 3, 'eyes:bulging': 2, 'lumps:inflamed': 3 },
    clues: ['A clean split in a fin, a scrape or one cloudy/bulging eye after a bump.', 'Often a tankmate chasing or nipping.'],
    distinguish: 'A clean tear should stay the same size and start regrowing clear within days. If it keeps spreading, turns red or white at the edges, or grows fuzz, it’s become infected.',
    check: 'A single scrape or a clean tear after a bump or fight is usually just an injury.',
    avoid: 'Don’t medicate a clean injury straight away—keep the water clean and watch.', source: ['management', 'bassleer-fin-rot'],
    tips: {
      betta: 'Bettas often tear fins on sharp plastic plants—swap to silk or live plants.',
      barb: 'Tiger barbs nip fins—keep them in groups of 6+ and away from long-finned fish.',
      cory: 'Sharp gravel wears down cory whiskers—smooth sand is kinder.',
    },
  },
  {
    id: 'uronema', title: 'Uronema', scientific: 'Uronema marinum', scope: 'marine', kind: 'Parasite', art: 'sores', urgency: 'today',
    summary: 'A saltwater parasite that eats into the skin and muscle, making deep red sores that spread fast.',
    hint: 'Deep red sores on a saltwater fish that keep getting bigger.',
    weights: { sores: 5, 'sores:open': 8, 'sores:streaks': 3, 'sores:scrape': 1, patch: 2, 'patch:flat': 3, deaths: 2, several: 1 },
    clues: ['Red, deep or ragged sores that grow day by day.', 'Pale patches that turn into ulcers.'],
    distinguish: 'Brooklynella shows more slime and peeling than deep sores. A single scrape is an injury.',
    check: 'Deep red sores on a saltwater fish that keep growing are a classic Uronema warning.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "patch": "On a saltwater fish—especially damsels and chromis—a pale patch can be the start of Uronema, which turns into deep red sores fast.", "patch:flat": "On a saltwater fish—especially damsels and chromis—a pale patch can be the start of Uronema, which turns into deep red sores fast." },
    avoid: 'Don’t wait to see if it heals on its own.', source: ['parasites', 'bassleer-marine-parasites'],
    tips: { damsel: 'Chromis and damsels are very prone to Uronema.' },
  },
  {
    id: 'brooklynella', title: 'Brooklynella (clownfish disease)', scientific: 'Brooklynella hostilis', scope: 'marine', kind: 'Parasite', art: 'patch', urgency: 'today',
    summary: 'A fast saltwater parasite, best known in clownfish. Thick slime, peeling skin and fast breathing.',
    hint: 'Thick slime and peeling skin, especially on clownfish.',
    weights: { patch: 4, 'patch:slime': 8, 'patch:flat': 3, 'patch:pits': 0, breathing: 2, appetite: 1, deaths: 1 },
    clues: ['Thick white slime, skin that looks like it’s peeling off.', 'Fast breathing and loss of appetite; can kill in days.'],
    distinguish: 'Marine velvet is a fine dust. Uronema makes deep red sores.',
    check: 'Thick slime and peeling skin—especially on a clownfish—is classic Brooklynella.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "breathing": "In a clownfish, fast breathing is an early Brooklynella warning—check for thick slime or peeling skin.", "patch": "A pale or cloudy patch on a saltwater fish—especially a clownfish—can be Brooklynella; watch for thick slime or peeling skin.", "patch:flat": "A pale or cloudy patch on a saltwater fish—especially a clownfish—can be Brooklynella; watch for thick slime or peeling skin." },
    avoid: 'Don’t wait—this one moves fast.', source: ['parasites', 'bassleer-marine-parasites'],
    tips: { clownfish: 'Clownfish are the classic Brooklynella fish—check every clown in the tank.' },
  },
  {
    id: 'black-spot', title: 'Black spot disease (turbellarians)', scientific: 'Paravortex species', scope: 'marine', kind: 'Parasite', art: 'dots', thumb: 'dust', urgency: 'week',
    summary: 'Tiny flatworms that look like black pepper specks, mostly on tangs. Annoying but very treatable.',
    hint: 'Tiny black pepper-like specks, mostly on tangs.',
    weights: { dots: 2, 'dots:black': 9, 'dots:white': 0, rubbing: 1 },
    clues: ['Small black specks all over the body and fins.', 'Scratching, faded colour; classic on yellow tangs.'],
    distinguish: 'White grains are marine ich. Some fish naturally have dark freckles—compare with older photos.',
    check: 'Tiny black specks—especially on a tang—are classic black spot disease.',
    avoid: 'Don’t treat the reef display with flatworm medicine.', source: ['parasites'],
    tips: { tang: 'Yellow tangs are the classic black-spot fish.' },
  },
  {
    id: 'hlle', title: 'HLLE (head & lateral line erosion)', scope: 'marine', kind: 'Diet / environment', art: 'patch', urgency: 'watch',
    summary: 'Pale pits and eroded lines on the head and along the side. Linked to diet, carbon dust and water quality—rarely fatal.',
    hint: 'Pale pits on the head or along the side line.',
    weights: { patch: 3, 'patch:pits': 9, 'patch:slime': 0, 'patch:flat': 1 },
    clues: ['Small pits or holes on the face, spreading along the line on the side of the body.', 'The fish usually acts normally.'],
    distinguish: 'Fresh red sores are Uronema or ulcers; peeling slime is Brooklynella.',
    check: 'Pits on the head and along the side line are classic HLLE.',
    // Wording when the result came from a different answer (Nov 6 2026 combination sweep).
    checks: { "patch": "Pale, eroding patches on the head or along the side of a tang or angelfish are classic HLLE." },
    avoid: 'Don’t rush in with medicine—fix diet and environment.', source: ['management'],
    tips: { tang: 'Tangs are prone to HLLE—lots of seaweed and a big tank help.', angel: 'Large angels get HLLE; improve diet and reduce carbon dust.' },
  },
  {
    id: 'hole-in-head', title: 'Hole-in-the-head (HITH)', scientific: 'Often linked to Hexamita', scope: 'fresh', kind: 'Parasite / diet', art: 'patch', urgency: 'week',
    summary: 'Small pits or holes on the head, mostly in cichlids. Linked to an internal parasite, diet and high nitrate.',
    hint: 'Small pits or holes on the head, mostly in cichlids.',
    weights: { patch: 2, 'patch:pits': 9, 'patch:slime': 0, 'patch:flat': 0 },
    clues: ['Small holes or pale pits on the head and face.', 'Sometimes white stringy poop and less appetite.'],
    distinguish: 'Flat pale patches are more like columnaris.',
    check: 'Pits or holes on the head of a freshwater fish are classic hole-in-the-head.',
    avoid: 'Don’t ignore it—the pits can get deeper.', source: ['parasites'],
    tips: { angelfish: 'Discus and angelfish get HITH—clean water and a varied diet help.', african: 'Oscars get HITH most often—big water changes and a varied diet help.' },
  },
  {
    id: 'normal', title: 'Normal markings or anatomy', scope: 'both', kind: 'Look-alike', art: 'plain', urgency: 'watch',
    summary: 'Some “spots” and bumps are perfectly normal for the species. Compare with older photos.',
    hint: 'Was it always there? Natural markings stay the same.',
    weights: { dots: 1, lumps: 1, eyes: 1, patch: 1, swollen: 1 },
    clues: ['The feature was there before, stays the same and fits the species.', 'The fish eats and acts normally.'],
    distinguish: 'Normal markings don’t explain fast breathing, scratching or spreading changes.',
    check: 'If it hasn’t changed and the fish acts normally, it may just be how the fish looks.',
    avoid: 'Don’t medicate a stable marking on its own.', source: ['management', 'bassleer-stress'],
    tips: { guppy: 'Female guppies, mollies and platies swell up when pregnant—that’s normal.', molly: 'Female mollies and platies swell up when pregnant—that’s normal.', goldfish: 'Male goldfish get small white breeding stars on the gill covers in spring—normal.' },
  },
];

export const ATLAS_URL = 'https://media.jez237.com/experiments/fish-health-lab/ich-comparison-b7e2ede9.jpg';
