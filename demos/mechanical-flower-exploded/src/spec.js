// Single source of truth for poster copy and callout ids.
// Poster coordinates are reference-image pixels (1122 x 1402) of reference/infographic-exploded.png.

export const POSTER = { w: 1122, h: 1402 };

export const TITLE = { main: 'MECHANICAL FLOWER — EXPLODED VIEW', sub: 'Clockwork botanical assembly' };
export const TAGLINE = { head: 'BEAUTY IN MOTION', body: 'Precision mechanics meet natural elegance.' };
export const FOOTER = 'NATURE INSPIRES. ENGINEERING REALIZES.';
export const DIMENSIONS = { height: '240 mm', width: '150 mm', caption: '(ASSEMBLED DIMENSIONS)' };
export const BLOOM_STAGES = [
  { id: 'closed', label: 'CLOSED', bloom: 0 },
  { id: 'initiation', label: 'INITIATION', bloom: 0.34 },
  { id: 'expansion', label: 'EXPANSION', bloom: 0.68 },
  { id: 'full', label: 'FULL BLOOM', bloom: 1 },
];

// side: which column the text block sits in. `anchor` is the id of the 3D anchor the leader line points at.
export const CALLOUTS = [
  { id: 'outerPetals', side: 'left', title: 'Outer Petal Assembly', body: '12 articulated enamel petals with jeweled fasteners. Open and close in sequence via cam drive.' },
  { id: 'innerPetals', side: 'left', title: 'Inner Petal Array', body: '8 inner petals with iridescent enamel finish. Guided by precision hinges and linkages.' },
  { id: 'stamenCage', side: 'left', title: 'Stamen Cage', body: 'Precision brass filaments with jeweled tips. Rises and retracts with the bloom cycle.' },
  { id: 'filigreeRing', side: 'left', title: 'Filigree Gear Ring', body: 'Ornate drive ring that coordinates petal movement with stamen and light systems.' },
  { id: 'leafPanel', side: 'left', title: 'Leaf Panel', body: 'Enamelled leaf with vein detailing and jeweled mounts. Articulated for natural movement.' },
  { id: 'core', side: 'right', title: 'Luminous Core', body: 'Crystal energy core with internal light modulation. Powers the mechanical bloom sequence.' },
  { id: 'driveGears', side: 'right', title: 'Primary Drive Gears', body: 'Multi-stage brass gear set. Transfers rotational motion from stem to bloom assemblies.' },
  { id: 'braidedStem', side: 'right', title: 'Braided Stem Conduit', body: 'Houses power, light, and control mechanisms. Flexible, ornate, and durable.' },
  { id: 'retentionCollar', side: 'right', title: 'Retention Collar', body: 'Secures stem segments. Features decorative jewels and alignment pins.' },
  { id: 'stemSegment', side: 'right', title: 'Modular Stem Segment', body: 'Interlocking segments with integrated wiring and reinforcement.' },
];

export const INSETS = [
  { id: 'core', title: 'CORE DETAIL', caption: 'Layered crystal core with prismatic light refraction.' },
  { id: 'gear', title: 'GEAR DETAIL', caption: 'Precision-cut brass gears with jeweled bearings.' },
  { id: 'enamel', title: 'ENAMEL DETAIL', caption: 'Hand-finished enamel with gold filigree.' },
];
