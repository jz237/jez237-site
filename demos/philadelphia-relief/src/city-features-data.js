// Curated public corridors. Coordinates and mechanisms are simplified, not engineering surveys.
export const BRIDGE_DEMOS = {
  tacony: { name: 'Tacony–Palmyra', type: 'bascule', span: 79.25, width: 16.8, deck: 16,
    ends: [[-75.045232,40.015071],[-75.041084,40.009544]],
    note: 'Two leaves rotate upward. Span placement and opening angle are illustrative.',
    source: 'https://www.geokon.com/Bridges' },
  burlington: { name: 'Burlington–Bristol', type: 'lift', span: 165, width: 8, deck: 18.6,
    rise: 22.56, ends: [[-74.868087,40.07783],[-74.870442,40.08377]],
    note: 'The road span rises vertically between towers. Model proportions are simplified.',
    source: 'https://www.colliersengineering.com/news/burlington-bristol-bridge-deck-replacement/' },
};
export const UNDERGROUND_BOUNDS = { west: -75.191, east: -75.14, north: 39.967, south: 39.940 };
export const UNDERGROUND_ROUTES = [
  { id: 'market', name: 'Market–Frankford · selected subway corridor', color: '#60b5ff', level: -65,
    source: 'https://schedules.septa.org/maps/line-map-mfl.pdf',
    path: [[-75.1858,39.9548],[-75.1797,39.9541],[-75.1644,39.9525],
      [-75.1623,39.9522],[-75.1588,39.9518],[-75.1538,39.9512],[-75.1433,39.95]],
    stations: [['15th / City Hall',-75.1644,39.9525],['8th–Market',-75.1538,39.9512],
      ['2nd Street',-75.1433,39.95]] },
  { id: 'broad', name: 'Broad Street · selected subway corridor', color: '#ffad59', level: -105,
    source: 'https://schedules.septa.org/maps/line-map-bsl.pdf',
    path: [[-75.1608,39.9615],[-75.1621,39.9559],[-75.164,39.9542],[-75.1646,39.9521],
      [-75.1642,39.9503],[-75.1648,39.9479],[-75.1659,39.943]],
    stations: [['Spring Garden',-75.1608,39.9615],['Walnut–Locust',-75.1648,39.9479],
      ['Lombard–South',-75.1659,39.943]] },
  { id: 'patco', name: 'PATCO · Philadelphia tunnel segment', color: '#ff6578', level: -145,
    source: 'https://www.ridepatco.org/stations/routemap.html',
    path: [[-75.1678,39.9487],[-75.1648,39.9484],[-75.1603,39.9478],
      [-75.1546,39.9471],[-75.1538,39.9512]],
    stations: [['15–16th & Locust',-75.1678,39.9487],['9–10th & Locust',-75.1566,39.9474]] },
  { id: 'dock', name: 'Dock Creek · approximate historic course', color: '#61e0c4', level: -30,
    source: 'https://www.nps.gov/inde/planyourvisit/dock-creek.htm',
    path: [[-75.1471,39.9492],[-75.1467,39.9478],[-75.1452,39.9469],[-75.1412,39.946]],
    stations: [['Dock Creek · historic',-75.1452,39.9469]] },
];

export function openingPose(type, value, rise = 22.56) {
  const fraction = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  return { fraction, angle: type === 'bascule' ? fraction * Math.PI * .43 : 0,
    lift: type === 'lift' ? fraction * rise : 0 };
}
export function openingCycle(seconds) {
  // One bounded demonstration: open, hold, close, then stop; never an endless loop.
  const t = Math.max(0, seconds);
  const smooth = x => x * x * (3 - 2 * x);
  return t < 7 ? smooth(t / 7) : t < 10 ? 1 : t < 17 ? 1 - smooth((t - 10) / 7) : 0;
}

// Recover displaced world coordinates from the existing vertex shader, then cut a hole.
export function cutawayShader(source, vertex) {
  const body = source.replace(/void\s+main\s*\(\s*(?:void)?\s*\)/, 'void cityOriginalMain()');
  return (vertex ? 'uniform mat4 cityInverseVP;\nvarying vec3 cityWorld;\n'
    : 'uniform vec4 cityBounds;\nvarying vec3 cityWorld;\n') + body + (vertex ? `
void main() {
  cityOriginalMain();
  vec4 world = cityInverseVP * gl_Position;
  cityWorld = world.xyz / world.w;
}` : `
void main() {
  if (cityWorld.x > cityBounds.x && cityWorld.x < cityBounds.y
    && cityWorld.z > cityBounds.z && cityWorld.z < cityBounds.w) discard;
  cityOriginalMain();
}`);
}
