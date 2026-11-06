// "Can I use this medicine in my tank?" (Jez, Nov 6 2026 07:32 EST: "Do option 1").
// Pick the medicine type and what lives in the tank; get a plain answer for each
// and an overall one. Hobbyist rules of thumb, kept simple. No doses: always
// follow the label.
//
// Verdicts, mildest first:
//   ok       → fine to use (as the label says)
//   care     → use with care (lower dose, watch closely, move the sensitive ones)
//   hospital → only in a separate hospital tank or tub
//   kills    → will kill them / never in this tank

export const VERDICTS = {
  ok: { rank: 0, label: 'Fine to use', short: 'Fine' },
  care: { rank: 1, label: 'Use with care', short: 'Care' },
  hospital: { rank: 2, label: 'Hospital tank only', short: 'Hospital tank' },
  kills: { rank: 3, label: 'Will kill them', short: 'Will kill' },
};

export const MED_WATERS = [
  { id: 'fresh', title: 'Freshwater tank' },
  { id: 'marine', title: 'Saltwater / reef tank' },
  { id: 'pond', title: 'Pond' },
];

// What else is in the tank. `fish` is always there (the fish being treated).
export const MED_RESIDENTS = {
  fresh: [
    { id: 'fish', title: 'Fish', always: true },
    { id: 'scaleless', title: 'Corys, loaches or plecos', text: 'Scaleless and sensitive fish' },
    { id: 'shrimp', title: 'Shrimp', text: 'Cherry, amano and co.' },
    { id: 'snails', title: 'Snails', text: 'Nerites, mystery snails' },
    { id: 'plants', title: 'Live plants' },
  ],
  marine: [
    { id: 'fish', title: 'Fish', always: true },
    { id: 'corals', title: 'Corals or anemones' },
    { id: 'inverts', title: 'Shrimp, crabs or snails' },
    { id: 'rock', title: 'Live rock or sand', text: 'Most reef tanks' },
  ],
  pond: [
    { id: 'fish', title: 'Fish', always: true },
    { id: 'plants', title: 'Pond plants' },
    { id: 'snails', title: 'Snails or mussels' },
  ],
};

// Every medicine: per water type, a verdict and a one-line reason for each
// resident (`filter` = the good bacteria in the filter, always checked), plus a tip.
// A missing water means "not used there".
export const MEDICINES = [
  {
    id: 'copper', title: 'Copper', text: 'Cupramine, Coppersafe, copper ich cures', for: 'Ich, velvet (mainly saltwater)',
    fresh: {
      fish: ['care', 'Works, but many freshwater fish are sensitive—use a test kit and the low end of the dose.'],
      scaleless: ['kills', 'Corys, loaches and plecos often die from copper.'],
      shrimp: ['kills', 'Even tiny amounts of copper kill shrimp.'],
      snails: ['kills', 'Copper kills snails.'],
      plants: ['care', 'Can harm some plants.'],
      filter: ['ok', 'Doesn’t usually hurt the filter bacteria.'],
    },
    marine: {
      fish: ['ok', 'The standard saltwater treatment for ich and velvet—with a copper test kit.'],
      corals: ['kills', 'Copper kills corals and anemones.'],
      inverts: ['kills', 'Copper kills shrimp, crabs and snails.'],
      rock: ['hospital', 'Rock and sand soak up copper and leak it back for years—never in a tank with live rock.'],
      filter: ['ok', 'Doesn’t usually hurt the filter bacteria.'],
    },
    pond: {
      fish: ['care', 'Hard to dose right in a pond; koi tolerate it, but a test kit is a must.'],
      plants: ['care', 'Can harm pond plants.'],
      snails: ['kills', 'Copper kills snails and mussels.'],
      filter: ['ok', 'Doesn’t usually hurt the filter bacteria.'],
    },
    tip: 'Copper is the classic “hospital tank” medicine: treat the fish in a bare tank, not the display.',
  },
  {
    id: 'ich-meds', title: 'Ich medicine (malachite green / formalin)', text: 'Ich-X, Rid-Ich, Kordon, white spot cures', for: 'Ich, velvet, skin parasites',
    fresh: {
      fish: ['ok', 'Fine for most fish at the label dose.'],
      scaleless: ['care', 'Use half the dose for corys, loaches and plecos.'],
      shrimp: ['care', 'Many keepers lose shrimp—move them out, or use a half dose and watch closely.'],
      snails: ['care', 'Snails can be harmed—move them out if you can.'],
      plants: ['ok', 'Plants are usually fine.'],
      filter: ['care', 'Formalin uses up oxygen—add an air stone while treating.'],
    },
    marine: {
      fish: ['ok', 'Used as a dip or in a hospital tank.'],
      corals: ['kills', 'Kills corals—never in a reef.'],
      inverts: ['kills', 'Kills shrimp, crabs and snails.'],
      rock: ['hospital', 'Kills the life in live rock and sand.'],
      filter: ['care', 'Uses up oxygen—add air.'],
    },
    pond: {
      fish: ['ok', 'A common pond treatment—dose by your pond volume.'],
      plants: ['ok', 'Pond plants are usually fine.'],
      snails: ['care', 'Snails and mussels can be harmed.'],
      filter: ['care', 'Uses up oxygen—add air while treating, especially when it’s warm.'],
    },
    tip: 'Turn off UV and take out carbon while treating, and add air.',
  },
  {
    id: 'prazi', title: 'Praziquantel', text: 'PraziPro, fluke and worm treatments', for: 'Flukes, gut worms',
    fresh: {
      fish: ['ok', 'Gentle on fish.'], scaleless: ['ok', 'Usually fine.'],
      shrimp: ['ok', 'Usually fine for shrimp.'], snails: ['care', 'Usually fine, but some snails react—watch them.'],
      plants: ['ok', 'Fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    marine: {
      fish: ['ok', 'Gentle on fish.'],
      corals: ['care', 'Most corals are fine, but dying worms can foul the water—watch closely.'],
      inverts: ['care', 'Can kill bristle worms, flatworms and some snails.'],
      rock: ['care', 'Kills worms living in the rock—do a water change after.'],
      filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    pond: {
      fish: ['ok', 'A good pond fluke treatment—dose by volume.'],
      plants: ['ok', 'Fine.'], snails: ['ok', 'Usually fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    tip: 'One of the gentlest treatments—a good first choice for flukes.',
  },
  {
    id: 'antibiotics', title: 'Antibiotics', text: 'Kanamycin, nitrofurazone, erythromycin, minocycline', for: 'Bacterial infections, ulcers, fin rot',
    fresh: {
      fish: ['ok', 'Fine for the fish.'], scaleless: ['ok', 'Usually fine.'],
      shrimp: ['care', 'Some antibiotics harm shrimp—move them if you can.'], snails: ['care', 'Watch snails closely.'],
      plants: ['ok', 'Usually fine.'],
      filter: ['care', 'Some (erythromycin especially) hurt the filter bacteria—watch ammonia.'],
    },
    marine: {
      fish: ['ok', 'Fine for the fish.'],
      corals: ['hospital', 'Antibiotics can upset corals and the tank’s bacteria—treat the fish in a hospital tank.'],
      inverts: ['care', 'Some inverts are sensitive.'],
      rock: ['care', 'Can upset the bacteria in the rock.'],
      filter: ['care', 'Can hurt the filter bacteria—watch ammonia.'],
    },
    pond: {
      fish: ['hospital', 'Treating a whole pond takes huge amounts and harms the filter—treat the sick fish in a tub, or ask a koi vet.'],
      plants: ['ok', 'Usually fine.'], snails: ['care', 'Watch snails.'],
      filter: ['hospital', 'Will knock back the pond filter.'],
    },
    tip: 'Best used in a hospital tank, and watch ammonia while you treat.',
  },
  {
    id: 'salt', title: 'Aquarium salt', text: 'Plain aquarium or pond salt', for: 'Freshwater fungus, mild parasites, nitrite',
    fresh: {
      fish: ['ok', 'Most freshwater fish handle a treatment dose for a short time.'],
      scaleless: ['care', 'Corys, loaches, plecos and many tetras dislike salt—low dose only.'],
      shrimp: ['care', 'Low doses are OK; treatment doses can kill shrimp.'],
      snails: ['care', 'Snails can be harmed at treatment doses.'],
      plants: ['care', 'Many plants suffer at treatment doses.'],
      filter: ['ok', 'Fine at normal doses.'],
    },
    pond: {
      fish: ['ok', 'Widely used in ponds—know your pond volume.'],
      plants: ['care', 'Pond plants suffer at higher doses.'],
      snails: ['care', 'Snails can be harmed at treatment doses.'],
      filter: ['ok', 'Fine at normal doses.'],
    },
    tip: 'Salt doesn’t evaporate—only water changes take it out, so keep track of how much is in.',
  },
  {
    id: 'meth-blue', title: 'Methylene blue', text: 'Blue dye treatment', for: 'Fungus on eggs, short baths',
    fresh: {
      fish: ['ok', 'Fine for fish.'], scaleless: ['care', 'Use a lower dose.'],
      shrimp: ['care', 'Can harm shrimp.'], snails: ['care', 'Can harm snails.'],
      plants: ['kills', 'Harms plants and stains everything blue.'],
      filter: ['kills', 'Kills the filter bacteria—use it only in a hospital tank or a short bath.'],
    },
    marine: {
      fish: ['ok', 'Used as a short bath.'],
      corals: ['kills', 'Never in a reef.'], inverts: ['kills', 'Never with inverts.'],
      rock: ['kills', 'Kills the life in live rock.'],
      filter: ['kills', 'Kills the filter bacteria.'],
    },
    tip: 'Use it as a bath or in a bare hospital tank, never in the main tank.',
  },
  {
    id: 'metro', title: 'Metronidazole', text: 'Metro, Hex-shield type treatments', for: 'Hole-in-the-head, internal parasites, bloat',
    fresh: {
      fish: ['ok', 'Gentle on fish.'], scaleless: ['ok', 'Usually fine.'],
      shrimp: ['ok', 'Usually fine.'], snails: ['ok', 'Usually fine.'],
      plants: ['ok', 'Fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    marine: {
      fish: ['ok', 'Gentle on fish; often given in food.'],
      corals: ['care', 'Usually tolerated, but a hospital tank or medicated food is safer.'],
      inverts: ['ok', 'Usually fine.'], rock: ['ok', 'Usually fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    pond: {
      fish: ['care', 'Works best in food—dosing a whole pond is expensive.'],
      plants: ['ok', 'Fine.'], snails: ['ok', 'Usually fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    tip: 'Works best soaked into food when the fish is still eating.',
  },
  {
    id: 'fenbendazole', title: 'Fenbendazole (planaria & hydra treatments)', text: 'Panacur, No Planaria type products', for: 'Planaria, hydra, worms',
    fresh: {
      fish: ['ok', 'Fine for fish.'], scaleless: ['ok', 'Usually fine.'],
      shrimp: ['ok', 'Shrimp keepers use it—shrimp are usually fine.'],
      snails: ['kills', 'Kills snails.'],
      plants: ['ok', 'Fine.'], filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    marine: {
      fish: ['ok', 'Fine for fish.'],
      corals: ['care', 'Some corals react—watch closely.'],
      inverts: ['kills', 'Kills snails, bristle worms and some starfish.'],
      rock: ['care', 'Kills worms in the rock—watch for a water quality dip.'],
      filter: ['ok', 'Doesn’t hurt the filter.'],
    },
    tip: 'Take snails out first, and do water changes after to clear the dead worms.',
  },
  {
    id: 'reef-safe', title: '“Reef-safe” or herbal remedies', text: 'Plant-extract ich and stress cures', for: 'Sold for ich and stress',
    fresh: {
      fish: ['care', 'Safe, but won’t reliably cure ich or velvet—don’t rely on it for a real outbreak.'],
      scaleless: ['ok', 'Usually fine.'], shrimp: ['ok', 'Usually fine.'], snails: ['ok', 'Usually fine.'],
      plants: ['ok', 'Fine.'], filter: ['ok', 'Fine.'],
    },
    marine: {
      fish: ['care', 'Safe, but won’t reliably cure ich or velvet—use a proven treatment in a hospital tank.'],
      corals: ['ok', 'Usually fine.'], inverts: ['ok', 'Usually fine.'], rock: ['ok', 'Usually fine.'], filter: ['ok', 'Fine.'],
    },
    pond: {
      fish: ['care', 'Safe, but won’t reliably cure white spot or parasites.'],
      plants: ['ok', 'Fine.'], snails: ['ok', 'Fine.'], filter: ['ok', 'Fine.'],
    },
    tip: '“Reef-safe” usually means “won’t hurt anything”—including the parasite. Watch the fish closely.',
  },
];

export const medicineFor = id => MEDICINES.find(m => m.id === id) || null;
export const residentsFor = water => MED_RESIDENTS[water] || [];
export const medicinesFor = water => MEDICINES.filter(m => m[water]);

// input: { medicine, water, residents: ['shrimp', ...], hospital: false }
// → { verdict, rows: [{ id, title, verdict, reason }], tip } or null.
export function checkMedicine({ medicine, water, residents = [], hospital = false }) {
  const med = medicineFor(medicine), table = med?.[water];
  if (!table) return null;
  const picked = residentsFor(water).filter(r => r.always || residents.includes(r.id));
  const rows = picked.map(r => ({ id: r.id, title: r.title, verdict: table[r.id]?.[0] || 'care', reason: table[r.id]?.[1] || 'No clear rule—watch closely.' }));
  if (table.filter) rows.push({ id: 'filter', title: 'Filter bacteria', verdict: table.filter[0], reason: table.filter[1] });
  // In a bare hospital tank only the fish being treated count; a hospital
  // filter that the medicine harms just means more water changes ("care").
  const counted = hospital
    ? rows.filter(r => ['fish', 'scaleless', 'filter'].includes(r.id)).map(r => r.id === 'filter' && VERDICTS[r.verdict].rank > 1 ? { ...r, verdict: 'care' } : r)
    : rows;
  const verdict = counted.reduce((a, r) => (VERDICTS[r.verdict].rank > VERDICTS[a].rank ? r.verdict : a), 'ok');
  return { medicine: med, verdict, rows, tip: med.tip, hospital, water };
}

// The one-line headline for the overall answer.
export function headline(result) {
  if (!result) return '';
  const { verdict, hospital, rows } = result;
  if (hospital) {
    if (verdict === 'kills') return 'Not for these fish, even in a hospital tank—pick a gentler medicine.';
    return verdict === 'ok' ? 'Fine to use in a hospital tank.' : 'OK in a hospital tank—use with care.';
  }
  const killed = rows.filter(r => r.verdict === 'kills' && r.id !== 'filter').map(r => r.title.toLowerCase());
  if (verdict === 'kills') return killed.length ? `Not in this tank—it will kill your ${killed.join(' and ')}. Use a hospital tank.` : 'Not in this tank—use a hospital tank.';
  if (verdict === 'hospital') return 'Not in this tank—treat the fish in a separate hospital tank.';
  if (verdict === 'care') return 'You can use it here, with care.';
  return 'Fine to use in this tank.';
}
