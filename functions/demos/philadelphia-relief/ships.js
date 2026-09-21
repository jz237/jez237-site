import { cached, bounded, json, inside, clean, agent } from './_data.js';
export function compactShips(doc, now = Date.now()) {
  if (!Array.isArray(doc?.vessels)) throw new Error('Invalid vessel feed');
  return { configured: doc.configured === true,
    state: ['connected', 'connecting', 'idle', 'not-configured'].includes(doc.state) ? doc.state : 'unavailable',
    timestamp: now, source: 'AISStream', vessels: doc.vessels.slice(0, 300).filter(v =>
      /^\d{9}$/.test(v.id) && inside(v.lon, v.lat) && Number.isFinite(v.observedAt)
      && v.observedAt <= now + 60000 && v.observedAt >= now - 600000).map(v => ({
      id: v.id, name: clean(v.name, 80), lon: v.lon, lat: v.lat, observedAt: v.observedAt,
      speed: Number.isFinite(v.speed) && v.speed >= 0 && v.speed < 102.3 ? v.speed : null,
      course: Number.isFinite(v.course) && v.course >= 0 && v.course < 360 ? v.course : null,
      destination: clean(v.destination, 80), type: v.type, voyageAt: v.voyageAt,
      timeKind: v.timeKind === 'feed receive time' ? v.timeKind : 'local receive time' })) };
}
export async function onRequest(context) {
  return cached(context, '/demos/philadelphia-relief/ships?schema=1', async () => {
    if (!context.env?.AIRCRAFT_RELAY_KEY) return json({ configured: false, state: 'not-configured', vessels: [] });
    const response = await fetch('https://philly-aircraft-relay.jez237.workers.dev/ships', {
      signal: AbortSignal.timeout(10500), redirect: 'manual', headers: { 'User-Agent': agent,
        Authorization: `Bearer ${context.env.AIRCRAFT_RELAY_KEY}` } });
    const data = JSON.parse(new TextDecoder().decode(await bounded(response, 262144)));
    return json(compactShips(data), 15);
  });
}
