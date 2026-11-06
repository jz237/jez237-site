// Scientific / clinical name of each diagnosis, shown in small print under the
// result title and in the reference pages (Jez, Nov 6 2026 09:07 EST: "in the
// diagnosis in very tiny print put the scientific name of the diagnosis. So I think
// cloudy eye would be keratitis or something like that"). *Asterisks* mark the
// italic part (genus/species). Plain "normal" or placement results have none.

export const SCIENCE = {
  // Fish (freshwater & saltwater)
  water: 'Ammonia/nitrite toxicosis or hypoxia',
  'ich-fresh': '*Ichthyophthirius multifiliis* (ichthyophthiriasis)',
  'ich-marine': '*Cryptocaryon irritans* (cryptocaryoniasis)',
  'velvet-fresh': '*Piscinoodinium pillulare* (piscinoodiniosis)',
  'velvet-marine': '*Amyloodinium ocellatum* (amyloodiniosis)',
  'water-mold': '*Saprolegnia* spp. (saprolegniasis)',
  columnaris: '*Flavobacterium columnare* (columnaris disease)',
  'fin-rot': 'Bacterial fin erosion (*Aeromonas*, *Pseudomonas* spp.)',
  ulcer: 'Ulcerative dermatitis (*Aeromonas* spp.)',
  septicemia: 'Motile *Aeromonas* septicemia (*A. hydrophila*)',
  dropsy: 'Ascites with lepidorthosis',
  bloat: 'Gastrointestinal impaction (constipation)',
  popeye: 'Exophthalmia',
  'cloudy-eye': 'Corneal opacity (keratitis)',
  'swim-bladder': 'Swim bladder disorder (buoyancy dysfunction)',
  flukes: 'Monogenean infection (*Gyrodactylus*, *Dactylogyrus* spp.)',
  lymphocystis: '*Lymphocystivirus* (Iridoviridae)',
  growth: 'Neoplasia or cyst',
  injury: 'Traumatic dermal injury',
  uronema: '*Uronema marinum* (scuticociliatosis)',
  brooklynella: '*Brooklynella hostilis* (brooklynellosis)',
  'black-spot': '*Paravortex* spp. (turbellarian infection)',
  hlle: 'Head and lateral line erosion syndrome',
  'hole-in-head': '*Spironucleus* (*Hexamita*) spp. (hexamitiasis)',

  // Corals & anemones
  bleaching: 'Coral bleaching (loss of Symbiodiniaceae)',
  'alk-swing': 'Carbonate alkalinity instability',
  'high-nutrients': 'Eutrophication (excess nitrate/phosphate)',
  'low-nutrients': 'Oligotrophic stress (nutrient limitation)',
  rtn: 'Rapid tissue necrosis',
  stn: 'Slow tissue necrosis',
  'brown-jelly': 'Brown jelly disease (*Porpostoma guamense*)',
  'light-shock': 'Photoinhibition (light stress)',
  'red-bugs': '*Tegastes acroporanus* (parasitic copepod)',
  aefw: '*Amakusaplana acroporae* (polyclad flatworm)',
  'monti-nudi': '*Phestilla* sp. (aeolid nudibranch)',
  'zoa-pests': 'Zoanthid pox; Pycnogonida; *Aeolidiopsis* sp.',
  aiptasia: '*Exaiptasia diaphana*',

  // Shrimp, crabs, snails & other inverts
  'failed-molt': 'Incomplete ecdysis (dysecdysis)',
  copper: 'Copper toxicosis',
  acclimation: 'Osmotic or thermal shock',
  'invert-water': 'Hypoxia or ammonia toxicosis',
  starvation: 'Inanition (starvation)',
  bopyrid: 'Bopyridae (parasitic isopod)',
  'normal-molt': 'Ecdysis (normal molt)',
  'invert-injury': 'Autotomy or traumatic limb loss',

  // Pond fish
  'anchor-worm': '*Lernaea cyprinacea* (lernaeosis)',
  'fish-lice': '*Argulus* spp. (argulosis)',
  'pond-ulcer': 'Ulcerative dermatitis (atypical *Aeromonas salmonicida*)',
  'pond-bacterial': 'Motile *Aeromonas* septicemia (*A. hydrophila*)',
  'pond-flukes': 'Monogeneans and protozoa (*Gyrodactylus*, *Ichthyobodo*, *Trichodina*)',
  'pond-ich': '*Ichthyophthirius multifiliis* (ichthyophthiriasis)',
  'pond-low-oxygen': 'Hypoxia',
  'pond-poor-water': 'Ammonia/nitrite toxicosis',
  'pond-water-swing': 'Chlorine toxicosis or pH shock',
  'pond-fungus': '*Saprolegnia* spp. (saprolegniasis)',
  'pond-dropsy': 'Ascites with lepidorthosis',
  'carp-pox': 'Cyprinid herpesvirus 1 (CyHV-1)',
  khv: 'Cyprinid herpesvirus 3 (CyHV-3)',
  'pond-swim-bladder': 'Swim bladder disorder (buoyancy dysfunction)',
  'winter-rest': 'Winter torpor',
};

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The small-print line for a diagnosis, or '' when it has none.
export function scienceLine(id, tag = 'p') {
  const text = SCIENCE[id];
  if (!text) return '';
  const html = esc(text).replace(/\*([^*]+)\*/g, '<i>$1</i>');
  return `<${tag} class="sci-name" data-science="${esc(id)}">${html}</${tag}>`;
}
