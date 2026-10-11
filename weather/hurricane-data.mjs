// NOAA/NHC data normalization. Kept separate from the map so source edge cases
// (missing values, intermediate advisories, units and month rollover) are testable.
export const NOAA_SERVICE = 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer';
export const LAYERS = { points: 5, cones: 7, history: 10, outlook: 3, warnings: 8 };
export const MAX_AGE = 12 * 60 * 60 * 1000;
export const REFRESH_INTERVAL = 10 * 60 * 1000;
const ZONES = { UTC: 0, GMT: 0, AST: -4, EDT: -4, EST: -5, CDT: -5, CST: -6, MDT: -6, MST: -7, PDT: -7, PST: -8, HST: -10 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function number(value) {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim()) || typeof value === 'boolean') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function stormId(properties = {}) {
  for (const value of [properties.idp_subset, properties.idp_source]) {
    const match = String(value || '').match(/^(?:al|ep|cp)\d{6}/i);
    if (match) return match[0].toLowerCase();
  }
  return null;
}

export function advisoryRank(value) {
  const match = String(value ?? '').match(/^(\d+)([a-z]?)$/i);
  return match ? Number(match[1]) * 27 + (match[2] ? match[2].toUpperCase().charCodeAt(0) - 64 : 0) : -1;
}

export function advisoryTime(text) {
  const match = String(text || '').match(/(\d{1,4})\s*(AM|PM)\s+(\w{3})\s+\w{3}\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/i);
  if (!match) return null;
  const [, clock, period, zone, month, day, year] = match;
  const offset = ZONES[zone.toUpperCase()];
  const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === month.toLowerCase());
  const hour12 = Number(clock.length > 2 ? clock.slice(0, -2) : clock);
  const minutes = clock.length > 2 ? Number(clock.slice(-2)) : 0;
  if (offset === undefined || monthIndex < 0 || hour12 < 1 || hour12 > 12 || minutes > 59 || Number(day) < 1 || Number(day) > 31) return null;
  if (new Date(Date.UTC(Number(year), monthIndex, Number(day))).getUTCMonth() !== monthIndex) return null;
  const hour = hour12 % 12 + (period.toUpperCase() === 'PM' ? 12 : 0);
  return Date.UTC(Number(year), monthIndex, Number(day), hour - offset, minutes);
}

export function forecastTime(properties, reference) {
  const match = String(properties.validtime || '').match(/^(\d{1,2})\/(\d{2})(\d{2})$/);
  if (!match || !Number.isFinite(reference)) return null;
  const [, day, hour, minute] = match.map(Number);
  if (day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  const base = new Date(reference);
  const expected = reference + (number(properties.tau) || 0) * 3600000;
  const candidates = [-1, 0, 1].map(delta => Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + delta, day, hour, minute))
    .filter(time => new Date(time).getUTCDate() === day);
  return candidates.sort((a, b) => Math.abs(a - expected) - Math.abs(b - expected))[0] ?? null;
}

export function historyTime(properties) {
  const match = String(properties.dtg || '').match(/^(\d{4})(\d{2})(\d{2})(\d{2})$/);
  return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4]) : null;
}

export function position(feature) {
  if (feature?.geometry?.type !== 'Point' || !Array.isArray(feature.geometry.coordinates) || feature.geometry.coordinates.length < 2) return null;
  const [lon, lat] = feature.geometry.coordinates.map(number);
  if (lon === null || lat === null || Math.abs(lon) > 180 || Math.abs(lat) > 90) return null;
  return [lat, lon];
}

export function wind(knots, unit = 'mph') {
  const value = number(knots);
  if (value === null || value < 0) return '—';
  return String(Math.round(value * (unit === 'km/h' ? 1.852 : unit === 'kt' ? 1 : 1.150779448)));
}

export function intensity(knots, type = '') {
  const n = number(knots);
  const code = String(type).toUpperCase();
  const other = {
    EX: ['Post-tropical', 'PT'], PTC: ['Post-tropical', 'PT'], LO: ['Remnant low', 'L'],
    PC: ['Potential tropical cyclone', 'P'], DB: ['Disturbance', 'D'],
    STD: ['Subtropical depression', 'SD'], STS: ['Subtropical storm', 'SS']
  };
  if (other[code]) return { label: other[code][0], badge: other[code][1], color: '#b1bccc', category: null };
  if (n === null || n < 0) return { label: 'Intensity unavailable', badge: '?', color: '#b1bccc', category: null };
  const category = n >= 137 ? 5 : n >= 113 ? 4 : n >= 96 ? 3 : n >= 83 ? 2 : n >= 64 ? 1 : 0;
  if (category) return { label: `Category ${category} hurricane`, badge: String(category), color: ['','#ffdc79','#ffb45d','#ff8264','#ee73a7','#d5a0ff'][category], category };
  return n >= 34 ? { label: 'Tropical storm', badge: 'S', color: '#6de4bd', category: 0 } : { label: 'Tropical depression', badge: 'D', color: '#6dcaf6', category: 0 };
}

export function direction(degrees) {
  const value = number(degrees);
  if (value === null) return '—';
  return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(((value % 360 + 360) % 360) / 22.5) % 16];
}

export function probability(value) {
  if (typeof value === 'string' && !/^\d{1,3}%?$/.test(value.trim())) return null;
  const n = number(typeof value === 'string' ? value.replace('%', '') : value);
  return n !== null && n >= 0 && n <= 100 ? n : null;
}

export function riskColor(value) {
  return value === null ? '#b1bccc' : value >= 70 ? '#ff827d' : value >= 40 ? '#ffc271' : '#f6e892';
}

export function basinFor(properties = {}) {
  const basin = String(properties.basin || '').toLowerCase();
  return basin === 'al' || basin === 'atlantic' ? 'atlantic' : ['ep', 'cp', 'pacific', 'eastern pacific', 'central pacific'].includes(basin) ? 'pacific' : 'unknown';
}

// Use the western copy of the Pacific when a track crosses 180 degrees.
// Otherwise a 179W -> 179E forecast draws a line across the entire world.
export function mapPosition(latlng, basin) {
  if (!latlng) return null;
  return [latlng[0], basin === 'pacific' && latlng[1] > 0 ? latlng[1] - 360 : latlng[1]];
}

export function mapFeature(feature, basin) {
  if (basin !== 'pacific' || !feature?.geometry?.coordinates) return feature;
  const visit = coordinates => Array.isArray(coordinates[0]) ? coordinates.map(visit) :
    [coordinates[0] > 0 ? coordinates[0] - 360 : coordinates[0], ...coordinates.slice(1)];
  return { ...feature, geometry: { ...feature.geometry, coordinates: visit(feature.geometry.coordinates) } };
}

export function officialUrl(storm) {
  const bin = String(storm?.bin || '').toLowerCase();
  return /^(at|ep|cp)[1-5]$/.test(bin) ? `https://www.nhc.noaa.gov/graphics_${bin}.shtml` : 'https://www.nhc.noaa.gov/';
}

export function buildStorms(collection, now = Date.now()) {
  const groups = new Map();
  for (const feature of collection?.features || []) {
    const p = feature.properties || {};
    const id = stormId(p);
    if (!id || !position(feature) || number(p.tau) === null || number(p.tau) < 0) continue;
    const rank = advisoryRank(p.advisnum);
    const group = groups.get(id);
    if (!group || rank > group.rank) groups.set(id, { rank, features: [feature] });
    else if (rank === group.rank) group.features.push(feature);
  }
  return [...groups].map(([id, group]) => {
    const unique = new Map();
    group.features.sort((a, b) => number(a.properties.tau) - number(b.properties.tau)).forEach(f => unique.set(number(f.properties.tau), f));
    const features = [...unique.values()];
    const initial = features.find(f => number(f.properties.tau) === 0);
    if (!initial) return null; // A future point must never masquerade as the current center.
    const p = initial.properties;
    const issuedAt = advisoryTime(p.advdate);
    const sourceUpdatedAt = number(p.idp_filedate);
    const reference = issuedAt ?? sourceUpdatedAt;
    const points = features.map(f => ({
      latlng: mapPosition(position(f), basinFor(p)), hour: number(f.properties.tau), wind: number(f.properties.maxwind),
      gust: number(f.properties.gust), type: String(f.properties.stormtype || ''),
      description: String(f.properties.tcdvlp || ''), time: number(f.properties.tau) === 0 ? issuedAt : forecastTime(f.properties, reference),
      label: String(f.properties.datelbl || ''), ...intensity(f.properties.maxwind, f.properties.stormtype)
    }));
    return {
      id, name: String(p.stormname || id.toUpperCase()).replace(/^(?:Potential Tropical Cyclone|Post-Tropical Cyclone|Subtropical Depression|Subtropical Storm|Tropical Depression|Tropical Storm|Major Hurricane|Hurricane)\s+/i, ''),
      basin: basinFor(p), bin: String(p.binnumber || ''), advisory: String(p.advisnum || '—'),
      advisoryLabel: String(p.advdate || ''), issuedAt, sourceUpdatedAt,
      stale: reference === null || now - reference > MAX_AGE || reference - now > 3600000,
      current: points[0], points, pressure: number(p.mslp) > 0 ? number(p.mslp) : null,
      movement: number(p.tcspd), direction: direction(p.tcdir),
      ...intensity(p.maxwind, p.stormtype)
    };
  }).filter(Boolean).sort((a, b) => (b.current.wind ?? -1) - (a.current.wind ?? -1) || a.name.localeCompare(b.name));
}

export function matchingFeatures(collection, storm, requireAdvisory = false) {
  return (collection?.features || []).filter(f => stormId(f.properties) === storm.id &&
    (!requireAdvisory || advisoryRank(f.properties?.advisnum) === advisoryRank(storm.advisory)));
}

export function queryUrl(layer) {
  const params = new URLSearchParams({ where: '1=1', outFields: '*', f: 'geojson', outSR: '4326', geometryPrecision: '4', resultRecordCount: '2000' });
  return `${NOAA_SERVICE}/${layer}/query?${params}`;
}

export function validateCollection(data) {
  if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features) || data.error || data.exceededTransferLimit || data.properties?.exceededTransferLimit) {
    throw new Error('NOAA returned an incomplete or invalid data collection.');
  }
  return data;
}

export function validateForecastCollection(data) {
  validateCollection(data);
  // An empty successful feed is meaningful. A populated feed that cannot yield
  // every system's current center is incomplete, not evidence of no storms.
  const ids = new Set();
  for (const feature of data.features) {
    const p = feature?.properties || {};
    const id = stormId(p);
    const hour = number(p.tau);
    if (!id || !position(feature) || hour === null || hour < 0 || advisoryRank(p.advisnum) < 0) {
      throw new Error('NOAA returned an invalid forecast position.');
    }
    ids.add(id);
  }
  const currentIds = new Set(buildStorms(data).map(storm => storm.id));
  if ([...ids].some(id => !currentIds.has(id))) {
    throw new Error('NOAA returned forecast positions without a current center.');
  }
  return data;
}

export async function fetchLayers(fetcher = fetch, now = Date.now()) {
  const result = { checkedAt: now, layers: {}, errors: [] };
  const requests = await Promise.allSettled(Object.entries(LAYERS).map(async ([name, id]) => {
    const response = await fetcher(queryUrl(id), { signal: AbortSignal.timeout(16000), cache: 'no-cache', credentials: 'omit' });
    if (!response.ok) throw new Error(`NOAA ${name}: HTTP ${response.status}`);
    const data = await response.json();
    return [name, name === 'points' ? validateForecastCollection(data) : validateCollection(data)];
  }));
  requests.forEach((request, i) => {
    if (request.status === 'fulfilled') result.layers[request.value[0]] = request.value[1];
    else result.errors.push(Object.keys(LAYERS)[i]);
  });
  return result;
}
