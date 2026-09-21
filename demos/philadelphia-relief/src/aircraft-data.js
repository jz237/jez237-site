/** Geographic flight reports. Coordinates and measurements always remain unexaggerated. */
export const FLIGHT_BOUNDS = { west: -75.8, east: -74.7, south: 39.7, north: 40.55 };
export const STALE_AFTER = 45, EXPIRE_AFTER = 120, TRAIL_SECONDS = 180;
const finite = n => typeof n === 'number' && Number.isFinite(n);
const clean = (s, max = 24) => typeof s === 'string'
  ? s.replace(/[^a-zA-Z0-9 ._-]/g, '').trim().slice(0, max) : '';
export const inFlightBounds = p => finite(p?.lon) && finite(p?.lat)
  && p.lon >= FLIGHT_BOUNDS.west && p.lon <= FLIGHT_BOUNDS.east
  && p.lat >= FLIGHT_BOUNDS.south && p.lat <= FLIGHT_BOUNDS.north;
const measure = (n, low, high) => finite(n) && n >= low && n <= high ? n : null;

export function compactAircraft(doc, receivedAt = Date.now()) {
  if (!Array.isArray(doc?.ac) || !finite(doc.now)) throw new Error('Invalid aircraft feed');
  const timestamp = doc.now > 1e12 ? doc.now : doc.now * 1000;
  if (timestamp > receivedAt + 30000 || timestamp < receivedAt - 120000) {
    throw new Error('Outdated aircraft feed');
  }
  const ids = new Set(), aircraft = [];
  for (const a of doc.ac.slice(0, 2000)) {
    const id = typeof a?.hex === 'string' ? a.hex.toLowerCase() : '';
    if (!inFlightBounds(a) || !/^[a-f0-9]{6}$/i.test(a.hex || '') || a.alt_baro === 'ground'
      || !finite(a.seen_pos) || a.seen_pos < 0 || a.seen_pos > 60 || ids.has(id)) continue;
    const baro = measure(a.alt_baro, -1500, 65000), geom = measure(a.alt_geom, -1500, 65000);
    if (baro === null && geom === null) continue;
    ids.add(id);
    aircraft.push({ id, callsign: clean(a.flight), registration: clean(a.r),
      type: clean(a.t, 8), category: clean(a.category, 2), lon: a.lon, lat: a.lat,
      altitudeFt: baro ?? geom, altitudeKind: baro === null ? 'geometric' : 'barometric',
      height: (geom ?? baro) * .3048, geometric: geom !== null,
      speed: measure(a.gs, 0, 1500), track: measure(a.track, 0, 360),
      verticalRate: measure(a.baro_rate ?? a.geom_rate, -15000, 15000),
      observedAt: timestamp - a.seen_pos * 1000 });
  }
  return { source: 'adsb.fi', license: 'personal-non-commercial', timestamp, aircraft };
}

export function flightMatches(a, filter) {
  if (filter === 'low') return a.altitudeFt < 10000;
  if (filter === 'helicopter') return a.category === 'A7';
  if (filter === 'large') return ['A3', 'A4', 'A5'].includes(a.category);
  return true;
}

export function ageSeconds(a, now = Date.now()) { return Math.max(0, (now - a.observedAt) / 1000); }

/** Smooth between actual reports with a short playback buffer; never invent future positions. */
export function flightPosition(samples, at) {
  if (!samples.length) return null;
  if (at <= samples[0].observedAt) return samples[0];
  for (let i = 1; i < samples.length; i++) {
    const b = samples[i], a = samples[i - 1];
    if (at > b.observedAt) continue;
    const t = (at - a.observedAt) / Math.max(1, b.observedAt - a.observedAt);
    const angle = a.track === null || b.track === null ? 0 : ((b.track - a.track + 540) % 360) - 180;
    return { ...b, lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t,
      height: a.height + (b.height - a.height) * t,
      track: a.track === null ? b.track : (a.track + angle * t + 360) % 360 };
  }
  return samples.at(-1);
}

export function appendFlightSample(samples, a) {
  if (samples.length && a.observedAt <= samples.at(-1).observedAt) return samples;
  const last = samples.at(-1);
  // Receiver jumps or long gaps must not draw a fictitious flight across the landscape.
  if (last && (a.observedAt - last.observedAt > 60000
    || Math.hypot((a.lon - last.lon) * 85000, (a.lat - last.lat) * 111000)
      / ((a.observedAt - last.observedAt) / 1000) > 800)) samples.length = 0;
  samples.push(a);
  while (samples.length > 1 && samples[0].observedAt < a.observedAt - TRAIL_SECONDS * 1000) samples.shift();
  return samples;
}

/** Keep aircraft clear of exaggerated terrain, without exaggerating their altitude above it. */
export function flightDisplayHeight(a, ground, exaggeration = 1) {
  return ground * exaggeration + Math.max(35, a.height - ground);
}
