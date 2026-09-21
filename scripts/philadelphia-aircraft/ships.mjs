import WebSocket from 'ws';

const clean = (v, n = 80) => typeof v === 'string' ? v.replace(/@/g, '').trim().slice(0, n) : '';
const inside = (lon, lat) => Number.isFinite(lon) && Number.isFinite(lat)
  && lon >= -75.8 && lon <= -74.7 && lat >= 39.7 && lat <= 40.55;
const number = (v, max) => Number.isFinite(v) && v >= 0 && v < max ? v : null;
export function vesselReport(doc, prior, now = Date.now()) {
  const meta = doc?.MetaData, type = doc?.MessageType, report = doc?.Message?.[type];
  const id = String(meta?.MMSI || report?.UserID || '');
  if (!/^\d{9}$/.test(id) || !report || report.Valid === false) return null;
  if (type === 'ShipStaticData') return prior ? { ...prior,
    name: clean(report.Name) || prior.name, destination: clean(report.Destination),
    type: number(report.Type, 100), callSign: clean(report.CallSign, 12),
    voyageAt: now } : null;
  if (!['PositionReport', 'StandardClassBPositionReport', 'ExtendedClassBPositionReport'].includes(type)) return null;
  const lon = report.Longitude ?? meta?.longitude ?? meta?.Longitude;
  const lat = report.Latitude ?? meta?.latitude ?? meta?.Latitude;
  if (!inside(lon, lat)) return { id, outside: true };
  // AIS UTC-second alone is not a complete timestamp. Prefer the feed's full receive time.
  const received = Date.parse(meta?.time_utc);
  if (Number.isFinite(received) && (received < now - 600000 || received > now + 60000)) return null;
  return { ...prior, id, name: clean(meta?.ShipName) || prior?.name || `Vessel ${id}`, lon, lat,
    speed: number(report.Sog, 102.3), course: number(report.Cog, 360),
    heading: number(report.TrueHeading, 360), observedAt: Number.isFinite(received) ? received : now,
    timeKind: Number.isFinite(received) ? 'feed receive time' : 'local receive time',
    destination: prior?.destination || '', type: prior?.type ?? null, voyageAt: prior?.voyageAt ?? null };
}

export function createShipFeed({ key, Socket = WebSocket, now = Date.now }) {
  const vessels = new Map(); let socket, lastRequest = 0, nextAttempt = 0, failures = 0, state = 'idle';
  function stop() { const old = socket; socket = null; old?.terminate(); state = 'idle'; }
  function connect() {
    if (!key || socket || now() < nextAttempt) return;
    state = 'connecting';
    const current = new Socket('wss://stream.aisstream.io/v0/stream', {
      perMessageDeflate: true, handshakeTimeout: 10000, maxPayload: 65536 });
    socket = current;
    current.on('open', () => current.send(JSON.stringify({ APIKey: key,
      BoundingBoxes: [[[39.7, -75.8], [40.55, -74.7]]],
      FilterMessageTypes: ['PositionReport', 'StandardClassBPositionReport',
        'ExtendedClassBPositionReport', 'ShipStaticData'] })));
    current.on('message', bytes => {
      try {
        const doc = JSON.parse(bytes.toString());
        if (doc.MessageType === 'SubscriptionConfirmation') { state = 'connected'; failures = 0; return; }
        if (doc.error || doc.Error) { state = 'unavailable'; current.terminate(); return; }
        const id = String(doc.MetaData?.MMSI || '');
        const entry = vesselReport(doc, vessels.get(id), now());
        if (!entry) return;
        state = 'connected'; failures = 0;
        if (entry.outside) { vessels.delete(entry.id); return; }
        if (vessels.size >= 300 && !vessels.has(entry.id)) vessels.delete(vessels.keys().next().value);
        vessels.set(entry.id, entry);
      } catch { /* Ignore malformed individual radio reports. */ }
    });
    current.on('error', () => { state = 'unavailable'; });
    current.on('close', () => {
      if (socket !== current) return;
      socket = null; state = 'unavailable';
      nextAttempt = now() + Math.min(900000, 30000 * 2 ** Math.min(5, failures++));
    });
  }
  const idle = setInterval(() => {
    if (socket && now() - lastRequest > 75000) stop();
    for (const [id, row] of vessels) if (now() - row.observedAt > 600000) vessels.delete(id);
  }, 10000); idle.unref?.();
  return {
    snapshot() {
      lastRequest = now(); connect();
      return { configured: !!key, state: key ? state : 'not-configured', source: 'AISStream',
        timestamp: now(), vessels: [...vessels.values()].filter(v => now() - v.observedAt <= 600000) };
    },
    dispose() { clearInterval(idle); stop(); vessels.clear(); },
  };
}
