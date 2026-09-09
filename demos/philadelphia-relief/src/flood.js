/**
 * Flood layer data — the pure half.
 *
 * Decodes the PHF1 binary written by tools/floodpack.py into rings the
 * area-mesh builder already understands, grouped by class. Nothing here
 * touches WebGL or the DOM, so it is unit-tested against the shipped file.
 */

const MAGIC = 'PHF2';
const HEADER_BYTES = 4 + 4 + 8 * 4;

/**
 * Decode a packed flood file. Returns { count, bounds, holes, classes:
 * Map<classIndex, [{ ring, holes, value }]> } where each ring is a closed
 * [lon, lat] list and `holes` are the polygon's interior rings.
 */
export function decodeFlood(buffer) {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  if (magic !== MAGIC) throw new Error(`flood: bad magic ${JSON.stringify(magic)}`);
  const count = view.getUint32(4, true);
  const bounds = {
    west: view.getFloat64(8, true),
    south: view.getFloat64(16, true),
    east: view.getFloat64(24, true),
    north: view.getFloat64(32, true),
  };
  const sx = (bounds.east - bounds.west) / 65535;
  const sy = (bounds.north - bounds.south) / 65535;
  const classes = new Map();
  let holes = 0;
  let offset = HEADER_BYTES;
  const readRing = (i) => {
    if (offset + 2 > buffer.byteLength) throw new Error(`flood: truncated at polygon ${i}`);
    const n = view.getUint16(offset, true);
    offset += 2;
    if (offset + n * 4 > buffer.byteLength) throw new Error(`flood: truncated ring ${i}`);
    const ring = new Array(n + 1);
    for (let v = 0; v < n; v += 1) {
      const qx = view.getUint16(offset + v * 4, true);
      const qy = view.getUint16(offset + v * 4 + 2, true);
      ring[v] = [bounds.west + qx * sx, bounds.south + qy * sy];
    }
    ring[n] = ring[0];
    offset += n * 4;
    return ring;
  };
  for (let i = 0; i < count; i += 1) {
    if (offset + 5 > buffer.byteLength) throw new Error(`flood: truncated at polygon ${i}`);
    const cls = view.getUint8(offset);
    const value = view.getInt16(offset + 1, true);
    const rings = view.getUint16(offset + 3, true);
    offset += 5;
    if (rings < 1) throw new Error(`flood: polygon ${i} has no rings`);
    const ring = readRing(i);
    const inner = [];
    for (let h = 1; h < rings; h += 1) inner.push(readRing(i));
    holes += inner.length;
    if (!classes.has(cls)) classes.set(cls, []);
    classes.get(cls).push({ ring, holes: inner, value: value === -32768 ? null : value });
  }
  if (offset !== buffer.byteLength) throw new Error('flood: trailing bytes');
  return { count, bounds, holes, classes };
}

/**
 * Which NOAA scenario polygons to draw for a chosen rise: the scenarios are
 * cumulative extents, so the chosen foot value and everything below it
 * belong to the flooded area, and only the chosen one needs drawing when the
 * larger extent contains the smaller. We draw exactly the chosen scenario.
 */
export function scenarioClass(scenariosFt, chosenFt) {
  const i = scenariosFt.indexOf(chosenFt);
  return i >= 0 ? i : null;
}

/** A rough area check used by the tests and the legend (km²). */
export function ringAreaKm2(ring, latRef = 39.95) {
  const mLon = 111320 * Math.cos((latRef * Math.PI) / 180);
  const mLat = 111033;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    a += (x1 * mLon) * (y2 * mLat) - (x2 * mLon) * (y1 * mLat);
  }
  return Math.abs(a) / 2 / 1e6;
}

/** Draw styles per FEMA class, and one for every NOAA scenario. */
export const FEMA_STYLE = {
  sfha: { color: '#3a86ff', opacity: 0.55, label: '1% annual-chance flood (zones AE, A, AO, AH)' },
  coastal: { color: '#9b5de5', opacity: 0.62, label: '1% coastal high hazard, wave action (zone VE)' },
  moderate: { color: '#6cc3e6', opacity: 0.4, label: '0.2% annual-chance flood (shaded zone X)' },
};
export const SLR_STYLE = { color: '#2a7de1', opacity: 0.62 };
export const SLR_SCENARIOS_FT = [1, 2, 3, 4, 5, 6, 8, 10];

/** The published scenario at or below the slider (or the lowest one). */
export function snapScenario(scenariosFt, wantedFt) {
  const list = (scenariosFt && scenariosFt.length ? scenariosFt : SLR_SCENARIOS_FT)
    .slice().sort((a, b) => a - b);
  let best = list[0];
  for (const ft of list) if (ft <= wantedFt) best = ft;
  return best;
}

/**
 * What the flood layer should show for a state: the source, the set of
 * `source:class` keys to make visible, and the snapped scenario. `manifests`
 * maps source -> manifest (or null when its data failed to load).
 */
export function floodSelection(state, manifests = {}) {
  const on = !!state.layers?.flood;
  const source = state.floodMode === 'slr' ? 'slr' : 'fema';
  const keys = new Set();
  let scenarioFt = null;
  if (on && source === 'fema') {
    for (const cls of Object.keys(FEMA_STYLE)) keys.add(`fema:${cls}`);
  } else if (on) {
    scenarioFt = snapScenario(manifests.slr?.scenariosFt, Number(state.seaLevelRise) || 1);
    keys.add(`slr:${scenarioFt}ft`);
  }
  const manifest = manifests[source];
  return { on, source, keys, scenarioFt, available: manifest !== null };
}

/** Legend content for a selection (null when the layer is off). */
export function floodLegend(selection, manifests = {}) {
  if (!selection.on) return null;
  const manifest = manifests[selection.source];
  if (manifest === null) {
    return {
      title: selection.source === 'fema' ? 'FEMA flood zones' : 'Sea level rise',
      rows: [], source: 'Data unavailable', url: '#', caveat: 'The flood data could not be loaded.',
    };
  }
  if (selection.source === 'fema') {
    return {
      title: 'FEMA flood hazard zones',
      rows: Object.values(FEMA_STYLE).map((s) => ({ color: s.color, label: s.label })),
      source: 'FEMA National Flood Hazard Layer, public domain'
        + (manifest?.source?.fetched ? `, fetched ${manifest.source.fetched}` : ''),
      url: 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28',
      caveat: 'Simplified to about 25 m; areas under a hectare dropped. The effective FIRM is the '
        + 'regulatory product. Not for insurance, permitting or engineering decisions.',
    };
  }
  return {
    title: `Sea level rise: ${selection.scenarioFt} ft above MHHW`,
    rows: [{ color: SLR_STYLE.color,
      label: `Inundated at high tide with ${selection.scenarioFt} ft of rise` }],
    source: 'NOAA Office for Coastal Management, Sea Level Rise Viewer data'
      + (manifest?.source?.fetched ? `, fetched ${manifest.source.fetched}` : ''),
    url: 'https://coast.noaa.gov/slrdata/',
    caveat: 'These data illustrate the scale of potential flooding, not the exact location, and do '
      + 'not account for erosion, subsidence, or future construction.',
  };
}
