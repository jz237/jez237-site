// Blueprint copy for the APX-9 page: callout groups, specifications, system icons, detail-view definitions.
// Part ids referenced here are the canonical top-level / child ids from the modelling contract.

export const TITLE = 'APX-9';
export const SUBTITLE = 'AUTONOMOUS POLLINATION UNIT';

export const TAGLINES = [
  'POLLINATE A TOMORROW BRIGHTER',
  'NATURE TECHNOLOGY HARMONY',
  'A CLEANER GREENER TOMORROW',
  'BIOMIMETIC ROBOTICS FOR A HEALTHIER PLANET',
  'SMALL BEES A BRIGHTER TOMORROW',
  'ENGINEERED FOR A HEALTHIER PLANET',
];

/**
 * Callout groups. `anchors` lists part ids in order of preference: the first one that exists (and is visible) is where the
 * leader line lands. `card: false` groups show up in the inspector/directory only.
 */
export const GROUPS = {
  'wing-r': {
    title: 'RIGHT WING ASSEMBLY', short: 'Right wing',
    bullets: ['Carbon composite frame', 'Smart membrane', 'Micro-actuators', 'Foldable design'],
    anchors: ['wing-r'], order: 1,
  },
  'wing-l': {
    title: 'LEFT WING ASSEMBLY', short: 'Left wing',
    bullets: ['Carbon composite frame', 'Smart membrane', 'Micro-actuators', 'Foldable design'],
    anchors: ['wing-l'], order: 2,
  },
  'thorax-armor': {
    title: 'THORAX ARMOR', short: 'Thorax',
    bullets: ['Fuzzy biomimetic covering', 'Impact-resistant composite', 'Environmental sensors'],
    anchors: ['thorax-armor'], order: 3,
  },
  'head-shell': {
    title: 'HEAD SHELL', short: 'Head',
    bullets: ['Impact-resistant plating', 'Sensor housing', 'Thermal regulation'],
    anchors: ['head-shell'], order: 4,
  },
  optics: {
    title: 'COMPOUND OPTICAL SENSORS', short: 'Optics',
    bullets: ['High-resolution compound eyes', '360° vision', 'UV / IR detection', 'Polarized light sensing'],
    anchors: ['eye-r', 'eye-l', 'ocelli'], order: 5,
  },
  antenna: {
    title: 'ANTENNA MODULES', short: 'Antennae',
    bullets: ['Chemical sensors', 'Airflow analysis', 'Flower scent detection', 'Tactile sensing'],
    anchors: ['antenna-r', 'antenna-l'], order: 6,
  },
  'wing-mount': {
    title: 'WING MOUNT & FLIGHT ACTUATORS', short: 'Wing mount',
    bullets: ['High-torque oscillation servos', 'Wing angle control', 'Vibration dampers'],
    anchors: ['wing-mount-r', 'wing-mount-l', 'flight-motor'], order: 7,
  },
  stabilizer: {
    title: 'REAR STABILIZER SYSTEM', short: 'Stabilizer',
    bullets: ['Flight balance control', 'Micro-thrusters', 'Attitude sensors'],
    anchors: ['stabilizer'], order: 8,
  },
  'abdomen-shell': {
    title: 'ABDOMEN SHELL', short: 'Abdomen',
    bullets: ['Lightweight composite', 'Climate control', 'Payload bay'],
    anchors: ['abdomen-shell'], order: 9,
  },
  stinger: {
    title: 'STINGER / PROBE UNIT', short: 'Probe',
    bullets: ['Multi-function tool', 'Nectar sampling', 'Plant health scanning', 'Micro-injection (optional)'],
    anchors: ['stinger'], order: 10,
  },
  core: {
    title: 'CENTRAL POWER CORE', short: 'Power core',
    bullets: ['High-density micro-battery', 'Power management', 'Wireless charging coil', 'Thermal cooling system'],
    anchors: ['power-core'], order: 11,
  },
  pollination: {
    title: 'POLLINATION MODULE', short: 'Pollination',
    bullets: ['Pollen collection system', 'Gentle distribution mechanism', 'Bio-compatible materials', 'Real-time pollen analysis'],
    anchors: ['pollination-module'], order: 12,
  },
  legs: {
    title: 'ARTICULATED LEG ASSEMBLIES (x6)', short: 'Legs',
    bullets: ['Multi-axis micro-servos', 'Hydraulic dampers', 'Terrain adaptation', 'Pollen brush (rear legs)', 'Precision foot pads'],
    anchors: ['leg-rear-r', 'leg-mid-r', 'leg-front-r', 'leg-rear-l'], order: 13,
  },
  chassis: {
    title: 'INTERNAL CHASSIS', short: 'Chassis',
    bullets: ['Titanium load frame', 'Neural processor', 'Neck and petiole joints'],
    anchors: ['thorax-chassis', 'head-frame', 'abdomen-frame'], order: 14, card: false,
  },
};

export const SPECS = [
  ['MODEL', 'APX-9'],
  ['TYPE', 'Autonomous Pollination Unit'],
  ['LENGTH', '28 mm'],
  ['WINGSPAN', '52 mm'],
  ['WEIGHT', '12 g'],
  ['POWER SOURCE', 'Solid-state micro-battery'],
  ['FLIGHT ENDURANCE', 'Up to 6 hours'],
  ['MAX SPEED', '8 m/s'],
  ['SENSORS', 'Vision, UV/IR, Chemical, Environmental, Tactile'],
  ['POLLEN CAPACITY', '~120 mg'],
  ['OPERATING TEMP', '-10°C to 50°C'],
  ['AI SYSTEM', 'Onboard neural processor (flower recognition, navigation)'],
  ['COMMUNICATION', 'Swarm mesh / Long range'],
  ['MATERIALS', 'Carbon composite, Titanium, Bio-compatible polymers'],
];

/** Outline icons on a 24x24 grid (stroke 1.6, round caps). */
export const SYSTEMS = [
  {
    key: 'pollination', label: 'Pollination',
    svg: '<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8V4m0 16v-5.8M9.8 12H4m16 0h-5.8M10.6 10.6 6.5 6.5m11 11-4.1-4.1m0-2.8 4.1-4.1m-11 11 4.1-4.1"/><circle cx="12" cy="3.4" r="1.2"/><circle cx="12" cy="20.6" r="1.2"/><circle cx="3.4" cy="12" r="1.2"/><circle cx="20.6" cy="12" r="1.2"/>',
  },
  {
    key: 'biodiversity', label: 'Biodiversity',
    svg: '<path d="M5 19c0-8 4-13 14-14 0 9-4 14-12 14"/><path d="M5 19c3-4 6-7 10-9"/><path d="M8.5 9.5c-1.8-.2-3.2.4-4 1.6 1.4.7 2.8.5 4-.6"/>',
  },
  {
    key: 'food', label: 'Food Security',
    svg: '<path d="M12 21V8"/><path d="M12 8c0-2.6 1.6-4 3.6-4 .1 2.4-1.3 4-3.6 4Zm0 4c0-2.6-1.6-4-3.6-4-.1 2.4 1.3 4 3.6 4Zm0 4c0-2.6 1.6-4 3.6-4 .1 2.4-1.3 4-3.6 4Zm0 4c0-2.6-1.6-4-3.6-4-.1 2.4 1.3 4 3.6 4Z"/>',
  },
  {
    key: 'environment', label: 'Environmental Monitoring',
    svg: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5S14.6 18.1 12 20.5C9.4 18.1 8.2 15.3 8.2 12S9.4 5.9 12 3.5Z"/>',
  },
  {
    key: 'energy', label: 'Renewable Energy',
    svg: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M5.6 18.4l1.7-1.7M16.7 7.3l1.7-1.7"/>',
  },
  {
    key: 'swarm', label: 'Swarm Intelligence',
    svg: '<circle cx="12" cy="6" r="2"/><circle cx="5.5" cy="17" r="2"/><circle cx="18.5" cy="17" r="2"/><circle cx="12" cy="13" r="1.4"/><path d="M12 8v3.6m-1 .9-4 3m5 .5 0 0m2-3.9 4 2.9M7.5 17h9"/>',
  },
];

/**
 * Detail views (the two blow-up insets of the blueprint). `root` is the part that gets isolated and framed;
 * `items` map the blueprint call-outs to child ids (relative to the root: parent/child).
 */
export const DETAILS = {
  wing: {
    key: 'wing', title: 'WING STRUCTURE', sub: 'detailed view', root: 'wing-r', view: 'hero',
    items: [
      { label: 'Nano-vein frame', child: 'vein-frame' },
      { label: 'Smart membrane (self-healing)', child: 'membrane' },
      { label: 'Micro-actuator', child: 'micro-actuator-1' },
      { label: 'Flex joint', child: 'flex-joint' },
    ],
  },
  leg: {
    key: 'leg', title: 'LEG MECHANISM', sub: 'detailed view', root: 'leg-rear-r', view: 'side',
    items: [
      { label: 'Rotary servo', child: 'rotary-servo' },
      { label: 'Micro-hydraulic joint', child: 'hydraulic-joint' },
      { label: 'Shock absorber', child: 'shock-absorber' },
      { label: 'Pollen brush (rear leg)', child: 'pollen-brush' },
      { label: 'Adaptive foot pad', child: 'foot-pad' },
    ],
  },
};

export const VIEW_BUTTONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'side', label: 'Side' },
  { key: 'top', label: 'Top' },
  { key: 'front', label: 'Front' },
  { key: 'rear', label: 'Rear' },
  { key: 'under', label: 'Under' },
];

/** Narrated tour: each step selects a part (by id), optionally changes explode / view, and shows a line of copy. */
export const TOUR = [
  { id: null, explode: 0, view: 'hero', title: 'Assembled', text: 'APX-9: a 28 mm, 12 g autonomous pollination unit. Every shell, mechanism and joint you can see is a separate part.' },
  { id: null, explode: 1, view: 'hero', title: 'Exploded', text: 'Fully exploded: roughly every component floats clear of its neighbours. Drag to orbit, scroll to zoom, click any part.' },
  { id: 'head-shell', explode: 1, view: 'front', title: 'Head shell', text: 'Impact-resistant plating over a sensor housing with thermal regulation.' },
  { id: 'eye-r', explode: 1, view: 'front', title: 'Compound optical sensors', text: 'High-resolution compound eyes: 360° vision, UV / IR detection and polarized light sensing.' },
  { id: 'antenna-r', explode: 1, view: 'hero', title: 'Antenna modules', text: 'Chemical sensors, airflow analysis, flower scent detection and tactile sensing.' },
  { id: 'thorax-armor', explode: 1, view: 'hero', title: 'Thorax armor', text: 'Fuzzy biomimetic covering over an impact-resistant composite shell with environmental sensors.' },
  { id: 'wing-mount-r', explode: 1, view: 'hero', title: 'Wing mount & flight actuators', text: 'High-torque oscillation servos, wing angle control and vibration dampers.' },
  { id: 'flight-motor', explode: 0, xray: true, isolate: true, view: 'top', title: 'Inside the flight drive', text: 'Watch the 10-tooth pinion drive a compound reduction, a rotating crank and a reciprocating output rod. Motion is slowed so the mechanism can be followed.' },
  { id: 'wing-mount-r/servo-gearbox', explode: 0, xray: true, isolate: true, view: 'hero', title: 'Working planetary gearbox', text: 'Four brass planets spin on their pins while orbiting the sun gear. The fixed ring produces a 4:1 reduction at the wing output carrier.' },
  { id: 'wing-r', explode: 1, view: 'hero', title: 'Wing assembly', text: 'Carbon composite nano-vein frame with a smart, self-healing membrane and micro-actuators.' },
  { id: 'power-core', explode: 1, view: 'side', title: 'Central power core', text: 'High-density micro-battery, power management, wireless charging coil and a thermal cooling system.' },
  { id: 'pollination-module', explode: 1, view: 'side', title: 'Pollination module', text: 'Pollen collection, gentle distribution and real-time pollen analysis with bio-compatible materials.' },
  { id: 'abdomen-shell', explode: 1, view: 'hero2', title: 'Abdomen shell', text: 'Lightweight composite with climate control and a payload bay.' },
  { id: 'stabilizer', explode: 1, view: 'hero2', title: 'Rear stabilizer', text: 'Flight balance control, micro-thrusters and attitude sensors.' },
  { id: 'stinger', explode: 1, view: 'hero2', title: 'Probe unit', text: 'Multi-function tool for nectar sampling, plant health scanning and optional micro-injection.' },
  { id: 'leg-rear-r', explode: 1, view: 'side', title: 'Articulated legs', text: 'Six legs with multi-axis micro-servos, hydraulic dampers and precision foot pads; the rear pair carry pollen brushes.' },
  { id: null, explode: 0, view: 'hero', title: 'Reassembled', text: 'Back together: every part mates with its neighbours. Select any component to inspect it.' },
];
