import { routeCallsign, routeFits } from './aircraft-route-data.js?v=philly-2026092115';

const cache = new Map();
const node = (tag, text, cls = '') => {
  const item = document.createElement(tag); item.textContent = text; item.className = cls; return item;
};
function lookup(callsign) {
  const hit = cache.get(callsign); if (hit && hit.until > Date.now()) return hit.promise;
  const entry = { until: Date.now() + 60000 };
  entry.promise = fetch(`aircraft-route?callsign=${encodeURIComponent(callsign)}`, {
    signal: AbortSignal.timeout(8000) }).then(async response => {
    if (!response.ok) throw new Error('Route unavailable');
    const data = await response.json(); entry.until = Date.now() + (data.route ? 3600000 : 600000);
    return { route: data.route };
  }).catch(() => ({ unavailable: true }));
  if (cache.size >= 100) cache.delete(cache.keys().next().value);
  cache.set(callsign, entry); return entry.promise;
}

export function aircraftRouteCard(aircraft, currentAircraft) {
  const box = node('div', '', 'aircraft-route'); box.setAttribute('aria-live', 'polite');
  const callsign = routeCallsign(aircraft.callsign);
  box.append(node('small', 'DEPARTURE → DESTINATION', 'aircraft-route-heading'));
  const content = node('div', callsign ? 'Looking up airports…'
    : 'Route unavailable — no callsign reported.');
  box.append(content);
  if (!callsign) return box;
  // Hovering briefly across pins should not generate a request for every aircraft.
  setTimeout(async () => {
    if (!box.isConnected || !currentAircraft()) return;
    const result = await lookup(callsign), current = currentAircraft();
    if (!box.isConnected || !current || current.callsign !== callsign) return;
    const route = result.route;
    if (!routeFits(route, current)) {
      content.textContent = result.unavailable ? 'Airport lookup temporarily unavailable.'
        : route ? 'No listed route matches this aircraft’s location.'
          : 'Departure and destination unavailable for this callsign.';
      return;
    }
    content.replaceChildren();
    for (const [i, airport] of route.airports.entries()) {
      const label = i === 0 ? 'From' : i === route.airports.length - 1 ? 'To' : 'Via';
      const row = node('div', '', 'aircraft-route-stop');
      row.append(node('span', label), node('strong', airport.code),
        node('span', airport.city || airport.name, 'aircraft-route-city'));
      row.title = airport.name; content.append(row);
    }
    content.append(node('small', route.airports.length > 2
      ? 'Listed itinerary · current leg unknown. Not live-confirmed.'
      : 'Listed route · not live-confirmed. Schedules and diversions may differ.', 'aircraft-route-note'));
    const source = node('a', 'Route data: Virtual Radar Server', 'aircraft-route-source');
    source.href = 'https://github.com/vradarserver/standing-data';
    source.target = '_blank'; source.rel = 'noopener noreferrer'; content.append(source);
  }, 200);
  return box;
}
