// Verified Merck pet-owner sections (HTML ids checked against saved pages,
// 2026-11-05). These are "Read more" destinations. Never add observations or
// readings to URLs.
const OWNER_GUIDE = 'https://www.merckvetmanual.com/all-other-pets/fish/disorders-and-diseases-of-fish';
const ROUTINE_CARE = 'https://www.merckvetmanual.com/all-other-pets/fish/routine-health-care-of-fish';

const GUIDES = {
  water: { section: 'v3226628', title: 'Ammonia & water quality', scope: 'both' },
  'ich-fresh': { section: 'v3226751', title: 'Ich', scope: 'fresh' },
  'ich-marine': { section: 'v3226751', title: 'Marine ich', scope: 'marine' },
  'velvet-fresh': { section: 'v3226757', title: 'Velvet', scope: 'fresh' },
  'velvet-marine': { section: 'v3226757', title: 'Marine velvet', scope: 'marine' },
  'water-mold': { section: 'v3226818', title: 'Water mold', scope: 'fresh' },
  columnaris: { section: 'v3226736', title: 'Columnaris', scope: 'fresh' },
  'fin-rot': { section: 'Skin-Disorders_v3226728', title: 'Fin & skin infections', scope: 'both' },
  ulcer: { section: 'v3226807', title: 'Bacterial ulcers', scope: 'both' },
  septicemia: { section: 'v3226807', title: 'Bacterial infections', scope: 'both' },
  dropsy: { section: 'Disorders-Affecting-Multiple-Body-Systems_v3226802', title: 'Dropsy & internal illness', scope: 'both' },
  bloat: { section: 'Nutritional-Disorders_v3226683', title: 'Diet problems', scope: 'both' },
  popeye: { section: 'Eye-Disorders_v3226655', title: 'Eye problems', scope: 'both' },
  'cloudy-eye': { section: 'Eye-Disorders_v3226655', title: 'Eye problems', scope: 'both' },
  'swim-bladder': { url: ROUTINE_CARE, title: 'Caring for an unwell fish', scope: 'both' },
  flukes: { section: 'v3226787', title: 'Flukes', scope: 'both' },
  lymphocystis: { section: 'v3226746', title: 'Lymphocystis', scope: 'both' },
  growth: { section: 'Skin-Disorders_v3226728', title: 'Skin growths', scope: 'both' },
  injury: { section: 'Skin-Disorders_v3226728', title: 'Skin damage', scope: 'both' },
  uronema: { section: 'v3226774', title: 'Uronema', scope: 'marine' },
  brooklynella: { section: 'v3226771', title: 'Brooklynella', scope: 'marine' },
  'black-spot': { url: OWNER_GUIDE, title: 'Fish parasites', scope: 'marine' },
  hlle: { url: OWNER_GUIDE, title: 'Fish diseases', scope: 'marine' },
  'hole-in-head': { section: 'v3226647', title: 'Hexamita & hole-in-the-head', scope: 'fresh' },
};

export function treatmentGuideFor(id, water) {
  const guide = GUIDES[id];
  if (!guide || (guide.scope !== 'both' && guide.scope !== water)) return null;
  return { ...guide, url: guide.url || `${OWNER_GUIDE}#${guide.section}`, provider: 'Merck Veterinary Manual · Pet owner guide' };
}

// "What to do now" plans. Treatment types, never doses: amounts always come from
// the product label. Saltwater plans that use copper, formalin, chloroquine,
// praziquantel or antibiotics are flagged not reef-safe (treat in a separate tank).
const HOSPITAL = 'Move the fish to a hospital (quarantine) tank with a heater and air stone.';
const MARINE_HOSPITAL = 'Move the fish to a bare hospital tank—never medicate a reef display.';
const TEST = 'Test ammonia and nitrite, then do a 25–30% water change.';

const PLANS = {
  water: {
    steps: [
      'Test ammonia, nitrite and pH now.',
      'Do a 30–50% water change with dechlorinated, temperature-matched water (saltwater: salinity-matched). Repeat daily until ammonia and nitrite read zero.',
      'Add aeration—an air stone or point the filter outlet at the surface.',
      'If ammonia or nitrite reads above zero, add a detoxifier that binds them (also medicating? check the medicine label says the two can be used together), and feed lightly for a few days.',
    ],
    treatment: 'Water changes, more oxygen, and a detoxifier if ammonia or nitrite shows',
    recovery: 'Breathing often improves within hours; burned gills heal in 1–2 weeks.',
  },
  'ich-fresh': {
    steps: [
      'Treat the whole tank—every fish has been exposed.',
      `${TEST} Vacuum the gravel to remove fallen cysts.`,
      'Raise the temperature slowly over a day or two (to about 80 °F / 27 °C if your fish tolerate it) and add extra aeration.',
      'Add an ich medication, or aquarium salt for fish that tolerate it (not corys, plecos, loaches or other scaleless fish).',
      'Keep treating for 3 days after the last spot has gone.',
    ],
    treatment: 'Gradual heat + an ich medication (or aquarium salt for salt-tolerant fish)',
    recovery: 'Usually 1–2 weeks.', medicated: true,
  },
  'ich-marine': {
    steps: [
      'Move all fish to a bare hospital tank—the parasite lives in the whole display.',
      'Treat the hospital tank with copper (test copper daily) or use the tank-transfer method.',
      'Leave the display with no fish for 6–8 weeks so the parasite dies off. Corals and inverts can stay.',
      'Test ammonia in the hospital tank every day and change water as needed.',
    ],
    treatment: 'Copper or tank transfer in a hospital tank, plus a fish-free display',
    recovery: '2–4 weeks of treatment; display fallow 6–8 weeks.', medicated: true, reefUnsafe: true,
  },
  'velvet-fresh': {
    steps: [
      'Dim the tank lights or turn them off for a few days—velvet needs light.',
      `${TEST} Add aeration.`,
      'Treat the whole tank with a velvet or copper-based medication and raise the temperature a little.',
      'Keep treating for about a week after the dust has gone.',
    ],
    treatment: 'Darkness + a velvet/copper medication for the whole tank',
    recovery: 'About 1–2 weeks.', medicated: true,
  },
  'velvet-marine': {
    steps: [
      'Act now—marine velvet can kill within days.',
      'Move every fish to a bare hospital tank with strong aeration.',
      'A temperature- and pH-matched freshwater dip gives quick relief; then treat the hospital tank with copper or chloroquine.',
      'Leave the display with no fish for 6–8 weeks.',
    ],
    treatment: 'Copper or chloroquine in a hospital tank, plus a fish-free display',
    recovery: '2–4 weeks in the hospital tank; display fallow 6–8 weeks.', medicated: true, reefUnsafe: true,
  },
  'water-mold': {
    steps: [
      'Look for the cause—fungus grows on injuries, dead tissue and leftover food.',
      `${TEST} Remove uneaten food.`,
      'Treat with a fungus remedy (antifungal). Methylene blue only in a hospital tank or as a short bath—it harms the filter and plants. Aquarium salt helps salt-tolerant fish.',
      'Move a badly affected fish to a hospital tank if it is spreading.',
    ],
    treatment: 'An antifungal medication (plus salt for salt-tolerant fish)',
    recovery: 'About 1 week with treatment.', medicated: true,
  },
  columnaris: {
    steps: [
      `${HOSPITAL} Columnaris spreads fast.`,
      `${TEST} If the water is warm, lower it a couple of degrees.`,
      'Treat with an antibacterial medication labelled for columnaris; aquarium salt helps salt-tolerant fish.',
      'Disinfect nets and keep treating until the patches have gone.',
    ],
    treatment: 'Antibacterial medication (plus salt for salt-tolerant fish)',
    recovery: '1–2 weeks if caught early.', medicated: true,
  },
  'fin-rot': {
    steps: [
      'Test ammonia and nitrite—fin rot almost always follows dirty water.',
      'Do a 30–50% water change, then keep up regular weekly changes.',
      'If the fins keep shrinking or the edges are red or white, treat with an antibacterial fin-rot medication.',
      'Remove sharp decorations and fin-nipping tankmates.',
    ],
    marine: { steps: ['Test the water and do a water change.', 'If the fins keep shrinking, move the fish to a hospital tank and treat with an antibacterial medication there.', 'Check for bullies and sharp rockwork.'], reefUnsafe: true },
    treatment: 'Clean water first, then an antibacterial if it keeps spreading',
    recovery: 'Rot stops in about a week; fins regrow over 3–6 weeks.', medicated: true,
  },
  ulcer: {
    steps: [HOSPITAL, 'Test the main tank water and do a water change there too.', 'Treat with an antibacterial medication—medicated food works well for ulcers.', 'Keep the water very clean while it heals.'],
    marine: { steps: [MARINE_HOSPITAL, 'Test the display water and do a water change.', 'Treat in the hospital tank with an antibacterial medication or medicated food.'], reefUnsafe: true },
    treatment: 'Antibacterial medication or medicated food',
    recovery: '2–4 weeks; scales grow back slowly.', medicated: true,
  },
  septicemia: {
    steps: ['Test ammonia, nitrite and oxygen right away—this usually follows bad water or stress.', 'Do a big water change and add aeration.', `${HOSPITAL} Treat with an antibacterial medication or medicated food.`],
    marine: { steps: ['Test the water and do a big water change.', MARINE_HOSPITAL, 'Treat in the hospital tank with an antibacterial medication or medicated food.'], reefUnsafe: true },
    treatment: 'Fix the water + antibacterial medication',
    recovery: '1–3 weeks.', medicated: true,
  },
  dropsy: {
    steps: [HOSPITAL, 'Test the main tank water and do a water change.', 'Treat with an antibacterial medication or medicated food; Epsom salt in the hospital tank can help reduce swelling.', 'Be prepared: dropsy is often hard to cure once the scales stick out.'],
    marine: { steps: [MARINE_HOSPITAL, 'Test the display water and do a water change.', 'Treat in the hospital tank with an antibacterial medication or medicated food.', 'Be prepared: dropsy is often hard to cure once the scales stick out.'], treatment: 'Isolate + antibacterial food or medication', reefUnsafe: true },
    treatment: 'Isolate + antibacterial food or medication (Epsom salt for swelling)',
    recovery: 'Days to weeks; many fish don’t recover once pineconing is advanced.', medicated: true,
  },
  bloat: {
    steps: ['Skip feeding for 1–2 days.', 'Then feed small amounts of a skinned, cooked pea (plant-eaters) or thawed foods like daphnia.', 'Soak dry food before feeding from now on.', 'Look from above each day—if the scales start to stick out, treat it as dropsy.'],
    marine: { steps: ['Skip feeding for 1–2 days.', 'Then feed small amounts of thawed, varied foods.', 'Look from above each day—if the scales start to stick out, treat it as dropsy.'] },
    // African cichlids: swelling is often Malawi bloat, which needs treating today.
    african: {
      steps: ['Act today—in African cichlids this is often Malawi bloat, and it moves fast.', `${HOSPITAL} Stop feeding.`, 'Treat with metronidazole—in food if it still eats, otherwise in the water—following the label.', 'Do a big water change in the main tank, and feed a lower-protein, plant-based diet from now on.'],
      treatment: 'Metronidazole in a hospital tank, then a plant-based diet', recovery: 'Days to 2 weeks if caught early; it can be fatal once the fish stops eating.', medicated: true,
    },
    treatment: 'A short fast, then fibre-rich or thawed foods',
    recovery: 'Usually a few days.',
  },
  popeye: {
    steps: [TEST, 'If only one eye bulges, it is probably an injury—clean water and time usually fix it.', `If both eyes bulge or it gets worse: ${HOSPITAL.toLowerCase()} Add Epsom salt and treat with an antibacterial medication.`],
    marine: { steps: ['Test the water and do a water change.', 'One eye: probably an injury—clean water and time usually fix it.', 'Both eyes or getting worse: treat in a hospital tank with an antibacterial medication.'], treatment: 'Clean water; antibacterial in a hospital tank if both eyes', reefUnsafe: true },
    treatment: 'Clean water; Epsom salt + antibacterial if both eyes',
    recovery: '2–4 weeks; the swelling goes down slowly.', medicated: true,
  },
  'cloudy-eye': {
    steps: [TEST, 'Keep the water extra clean for a week—most cloudy eyes clear on their own.', 'If it doesn’t improve or spreads to other fish, treat with an antibacterial medication.'],
    marine: { steps: ['Test the water and do a water change.', 'Watch for scratching—if the fish is also flashing, treat for flukes instead.', 'If it doesn’t clear in a week, treat in a hospital tank with an antibacterial medication.'], reefUnsafe: true },
    treatment: 'Clean water; antibacterial if it doesn’t clear',
    recovery: 'About 1–2 weeks.', medicated: true,
  },
  'swim-bladder': {
    steps: ['Skip feeding for 1–2 days.', 'Then feed small amounts of a skinned, cooked pea (plant-eaters) or thawed foods—no floating dry food.', 'Lower the water level a little and keep the temperature steady so it can rest.', 'If several fish are struggling or it came on suddenly, check the water first.'],
    marine: { steps: ['Skip feeding for 1–2 days, then feed small amounts of thawed foods.', 'Keep the water stable and the flow gentle so it can rest.', 'If several fish are struggling, check the water and oxygen first.'] },
    treatment: 'Fast 1–2 days, then peas or thawed foods',
    recovery: 'A few days to a week; some fancy goldfish get it on and off.',
  },
  flukes: {
    steps: ['Test the water first—bad water causes similar scratching.', 'Treat the tank with praziquantel, the usual fluke treatment.', 'Repeat the treatment after about a week to catch newly hatched flukes.'],
    marine: { steps: ['Test the water first—bad water causes similar scratching.', MARINE_HOSPITAL, 'A temperature- and pH-matched freshwater dip knocks off many flukes; then treat with praziquantel.', 'Repeat the treatment after about a week.'], reefUnsafe: true },
    treatment: 'Praziquantel (two rounds)',
    recovery: 'About 2 weeks.', medicated: true,
  },
  lymphocystis: {
    steps: ['Keep the water clean and stable—there’s no medicine for this virus.', 'Feed a good, varied diet to help the fish fight it off.', 'Leave the growths alone; most fall off on their own.'],
    treatment: 'No medicine—clean water and good food',
    recovery: 'Weeks to a few months; rarely dangerous.',
  },
  growth: {
    steps: ['Take a photo every week to see if it is growing.', 'Keep the water clean—there’s no home medicine for cysts and tumors.', 'If it grows fast, opens up or stops the fish eating or swimming, an aquatic vet can sometimes remove it.'],
    treatment: 'Watch and keep the water clean',
    recovery: 'Often stays the same for months; many fish live normally.',
  },
  injury: {
    steps: ['Look for bullies or fin-nippers and check decorations for sharp edges.', 'Keep the water extra clean so the wound doesn’t get infected.', 'Separate the fish (or the bully) if injuries keep happening.'],
    treatment: 'Clean water; separate bullies',
    recovery: '1–2 weeks for scrapes; fins regrow over several weeks.',
  },
  uronema: {
    steps: ['Act fast—Uronema eats into the muscle and spreads quickly.', MARINE_HOSPITAL, 'Treat with a formalin bath or a medication labelled for Uronema/marine ciliates. Don’t lower the salinity—Uronema copes with low salinity.', 'Keep the hospital water very clean and watch tankmates.'],
    treatment: 'Formalin or a ciliate medication in a hospital tank',
    recovery: 'It can kill within days; caught early, 1–3 weeks.', medicated: true, reefUnsafe: true,
  },
  brooklynella: {
    steps: ['Act today—it can kill within days.', MARINE_HOSPITAL, 'Give a formalin bath, then keep treating in the hospital tank.', 'Keep it there for about 2 weeks after it looks better, and check every other clownfish.'],
    treatment: 'Formalin bath + treatment in a hospital tank',
    recovery: '1–2 weeks with fast treatment.', medicated: true, reefUnsafe: true,
  },
  'black-spot': {
    steps: ['A temperature- and pH-matched freshwater dip often makes the black specks drop off.', MARINE_HOSPITAL, 'Treat the hospital tank with praziquantel or a flatworm medication.', 'Repeat after about a week to catch new hatchlings.'],
    treatment: 'Freshwater dip + praziquantel in a hospital tank',
    recovery: 'About 2 weeks.', medicated: true, reefUnsafe: true,
  },
  hlle: {
    steps: ['Improve the diet: plenty of seaweed/nori, plus varied, vitamin-enriched foods.', 'Rinse or replace activated carbon (carbon dust is linked to HLLE) and check for stray voltage from equipment.', 'Keep water quality high. Mild HLLE often improves over a few months.'],
    treatment: 'Better diet and environment—no medicine needed',
    recovery: 'Months; the pits fill in slowly.',
  },
  'hole-in-head': {
    steps: ['Do bigger, regular water changes—HITH is linked to high nitrate and poor diet.', 'Treat with metronidazole (often as medicated food).', 'Feed a varied, vitamin-rich diet.'],
    treatment: 'Metronidazole + water changes and a better diet',
    recovery: 'Weeks to months.', medicated: true,
  },
  normal: {
    steps: ['Compare with older photos of this fish or others of the same kind.', 'Watch for a week—normal markings don’t change or spread.', 'Keep testing the water as usual.'],
    treatment: 'None needed',
    recovery: 'Nothing to recover from.',
  },
};

export function carePlanFor(id, water, fishType = '') {
  const plan = PLANS[id];
  if (!plan) return null;
  const variant = water === 'fresh' && fishType && plan[fishType] ? plan[fishType] : water === 'marine' && plan.marine ? plan.marine : {};
  return {
    steps: variant.steps || plan.steps,
    treatment: variant.treatment || plan.treatment,
    recovery: variant.recovery || plan.recovery,
    medicated: Boolean(variant.medicated ?? plan.medicated),
    reefUnsafe: water === 'marine' && Boolean(variant.reefUnsafe ?? plan.reefUnsafe),
  };
}

export const PLAN_IDS = Object.keys(PLANS);

// Called only from a direct click. A real target=_blank anchor remains the
// fallback when pop-ups are blocked; modified clicks keep normal browser behavior.
export function openTreatmentPopup(event, link, openWindow = window.open.bind(window)) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;
  const guide = treatmentGuideFor(link.dataset.treatment, link.dataset.water);
  if (!guide) return false;
  let popup;
  try {
    popup = openWindow('about:blank', '_blank', 'popup,width=1040,height=800,resizable=yes,scrollbars=yes');
    if (!popup) return false;
    popup.opener = null;
    const referrer = popup.document.createElement('meta');
    referrer.name = 'referrer'; referrer.content = 'no-referrer';
    popup.document.head.append(referrer);
    // Use a noreferrer link inside the popup. A location.replace initiated by
    // the source page can retain that page's origin as the navigation referrer.
    const destination = popup.document.createElement('a');
    destination.href = guide.url;
    destination.target = '_self';
    destination.rel = 'noopener noreferrer';
    (popup.document.body || popup.document.documentElement).append(destination);
    destination.click();
    event.preventDefault();
    return true;
  } catch {
    try { popup?.close(); } catch { /* Keep the native link fallback. */ }
    return false;
  }
}
