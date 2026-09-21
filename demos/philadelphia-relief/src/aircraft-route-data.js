const clean = (value, limit = 120) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
export const routeCallsign = value => /^[A-Z0-9]{3,8}$/.test(value || '') ? value : null;

export function compactRoute(data, callsign) {
  if (!routeCallsign(callsign) || data?.callsign !== callsign || !Array.isArray(data._airports)
    || data._airports.length < 2 || data._airports.length > 8) return null;
  const airports = data._airports.map(a => ({ code: clean(a?.iata || a?.icao, 4),
    name: clean(a?.name), city: clean(a?.location, 80), lat: a?.lat, lon: a?.lon }));
  if (airports.some(a => !/^[A-Z0-9]{3,4}$/.test(a.code) || !a.name
    || !Number.isFinite(a.lat) || Math.abs(a.lat) > 90
    || !Number.isFinite(a.lon) || Math.abs(a.lon) > 180)) return null;
  return { callsign, airports, source: 'Virtual Radar Server via ADSB.lol', confirmed: false };
}

function distance(a, b) {
  const rad = Math.PI / 180, lat = (b.lat - a.lat) * rad, lon = (b.lon - a.lon) * rad;
  const h = Math.sin(lat / 2) ** 2
    + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(lon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h))));
}

// Reject obvious reused-callsign mismatches, without claiming to verify a filed flight plan.
export function routeFits(route, aircraft) {
  if (!route || route.callsign !== aircraft.callsign
    || !Number.isFinite(aircraft.lat) || !Number.isFinite(aircraft.lon)) return false;
  return route.airports.some((end, i) => {
    if (!i) return false;
    const start = route.airports[i - 1], direct = distance(start, end);
    return distance(start, aircraft) + distance(aircraft, end) - direct <= Math.max(100, direct * .08);
  });
}
