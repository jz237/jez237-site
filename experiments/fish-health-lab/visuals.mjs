// Image inventory, not diagnostic evidence. Empty slots never pretend to be cases.
// To add an asset, fill a slot below; the library, viewer and comparison use it.
import { CONDITIONS, SYMPTOMS, ATLAS_URL } from './data.mjs';

export const GUIDE_URL = 'https://media.jez237.com/experiments/fish-health-lab/ich-guide-9c778127.jpg';
export const SLOT_TYPES = [
  { id: 'overview', label: 'Whole-fish guide', brief: 'An overview showing where the visible changes occur.' },
  { id: 'variations', label: 'Different fish', brief: 'The pattern across different species, colors and fin types.' },
  { id: 'closeup', label: 'Close-up detail', brief: 'A clear close-up showing texture, shape and distribution.' },
  { id: 'subtle', label: 'Subtle appearance', brief: 'Few visible changes, including signs that are easy to miss.' },
  { id: 'marked', label: 'Marked changes', brief: 'More obvious visible changes; appearance is not a severity score.' },
  { id: 'lookalikes', label: 'Look-alikes', brief: 'Similar-looking problems and the clues that help separate them.' },
];

const images = {
  'ich-fresh': {
    overview: {
      url: GUIDE_URL,
      alt: 'Educational illustrated freshwater ich guide with an angelfish, spot detail, microscopy and look-alikes.',
      caption: 'Recognition clues, important look-alikes and how freshwater ich is confirmed.',
      provenance: 'AI educational illustration',
      source: 'Previously created for this experiment; not a confirmed patient photograph.',
    },
    variations: {
      url: ATLAS_URL,
      alt: 'Educational ich comparison atlas showing varied spotting on different freshwater fish.',
      caption: 'A comparison sheet of ich-like presentations across different freshwater fish.',
      provenance: 'AI educational illustration',
      source: 'Previously created for this experiment; not confirmed patient photographs.',
    },
    closeup: {
      url: 'https://media.jez237.com/experiments/fish-health-lab/ich-closeup-8b9f20a5.jpg',
      alt: 'Illustrated close-up clues for ich-like white grains on dark skin, translucent fins and pale skin.',
      caption: 'Compare separate white grains and their contrast on different skin and fin surfaces.',
      provenance: 'AI educational illustration',
      source: 'Created for the ich walkthrough; not a confirmed patient photograph.',
    },
    subtle: {
      url: 'https://media.jez237.com/experiments/fish-health-lab/ich-subtle-68567f0c.jpg',
      alt: 'Illustrated subtle ich-like appearances with few spots, pale-skin contrast and a gill-region reminder.',
      caption: 'Few visible spots or difficult-to-see skin changes do not establish mild illness. Gill infection may lack visible skin spots.',
      provenance: 'AI educational illustration',
      source: 'Created for the ich walkthrough; not a confirmed patient photograph.',
    },
    marked: {
      url: 'https://media.jez237.com/experiments/fish-health-lab/ich-marked-d250101b.jpg',
      alt: 'Illustrated examples of conspicuous ich-like spotting on an angelfish, betta and neon tetra.',
      caption: 'More obvious skin and fin spotting, with differences in contrast across freshwater fish. Not a progression or severity scale.',
      provenance: 'AI educational illustration',
      source: 'Created for the ich walkthrough; not a confirmed patient photograph.',
    },
    lookalikes: {
      url: 'https://media.jez237.com/experiments/fish-health-lab/ich-lookalikes-b9f7de50.jpg',
      alt: 'Illustrated comparison of ich-like grains, fine dust, cottony growth, pale patches, larger growths and normal markings.',
      caption: 'Compare texture, shape and distribution. Some look-alikes require professional examination and microscopy to distinguish.',
      provenance: 'AI educational illustration',
      source: 'Created for the ich walkthrough; not confirmed patient photographs or diagnoses.',
    },
  },
};

export const VISUAL_LIBRARY = Object.fromEntries(CONDITIONS.map(condition => [condition.id,
  SLOT_TYPES.map(type => ({
    ...type,
    brief: type.id === 'overview' ? condition.summary
      : type.id === 'lookalikes' ? condition.distinguish
      : condition.id === 'normal' ? 'Compare healthy species anatomy and varieties; do not infer illness from a normal feature.'
      : condition.id === 'water' ? 'Record posture, gill movement and tank context. A still photo cannot measure oxygen or water quality.'
      : type.brief,
    image: images[condition.id]?.[type.id] || null,
  })),
]));

export function slotsFor(id) { return VISUAL_LIBRARY[id] || []; }
export function leadSlot(id) { return slotsFor(id).find(slot => slot.image) || slotsFor(id)[0]; }
export function patternFor(id) {
  const condition = CONDITIONS.find(item => item.id === id);
  return SYMPTOMS.find(item => item.art === condition?.art)?.id || 'unclear';
}
