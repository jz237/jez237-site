/** Exact image responses, bounded on disk; browser eviction is always safe. */
export function createImageryCache({ storage = () => globalThis.caches,
  base = () => globalThis.location.href, now = Date.now,
  maxBytes = 96 * 1024 * 1024, maxEntries = 96 } = {}) {
  const name = 'philadelphia-relief.imagery.v1';
  let writes = Promise.resolve(), queuedBytes = 0, queuedEntries = 0;
  const key = path => new URL(path, base()).href;
  async function get(path) {
    try {
      const cache = await storage()?.open(name);
      if (!cache) return null;
      const url = key(path), response = await cache.match(url);
      if (!response) return null;
      if (Number(response.headers.get('X-Relief-Expires')) <= now()) {
        await cache.delete(url); return null;
      }
      return response;
    } catch { return null; }
  }
  function put(path, blob, originalHeaders) {
    if (queuedBytes + blob.size > maxBytes || queuedEntries >= maxEntries) return Promise.resolve();
    if (/no-store|no-cache/.test(new Headers(originalHeaders).get('Cache-Control') || '')) {
      return Promise.resolve();
    }
    queuedBytes += blob.size; queuedEntries++;
    writes = writes.then(async () => {
      const cache = await storage()?.open(name);
      if (!cache) return;
      const headers = new Headers(originalHeaders);
      const ttl = Math.min(2592000, Number(headers.get('Cache-Control')
        ?.match(/max-age=(\d+)/)?.[1] || 300));
      const age = Math.max(Number(headers.get('Age')) || 0,
        (now() - Date.parse(headers.get('Date'))) / 1000 || 0, 0);
      if (age >= ttl) return;
      headers.set('X-Relief-Expires', String(now() + (ttl - age) * 1000));
      headers.set('X-Relief-Bytes', String(blob.size));
      headers.set('X-Relief-Saved', String(now()));
      // Response bytes are already decoded from HTTP transfer encoding.
      headers.delete('Content-Encoding'); headers.delete('Content-Length');
      const url = key(path), entries = [];
      const keys = await cache.keys();
      const responses = await Promise.all(keys.map(request => cache.match(request)));
      for (const [i, request] of keys.entries()) {
        const response = responses[i];
        if (!response) continue;
        const expires = Number(response.headers.get('X-Relief-Expires'));
        if (expires <= now() || request.url === url) { await cache.delete(request); continue; }
        entries.push({ request, bytes: Number(response.headers.get('X-Relief-Bytes')) || maxBytes,
          saved: Number(response.headers.get('X-Relief-Saved')) || 0 });
      }
      entries.sort((a, b) => a.saved - b.saved);
      let bytes = entries.reduce((sum, e) => sum + e.bytes, 0);
      while (entries.length >= maxEntries || bytes + blob.size > maxBytes) {
        const oldest = entries.shift();
        if (!oldest) break;
        await cache.delete(oldest.request); bytes -= oldest.bytes;
      }
      await cache.put(url, new Response(blob, { headers }));
    }).catch(() => { /* Disk errors leave network loading available. */ })
      .finally(() => { queuedBytes -= blob.size; queuedEntries--; });
    return writes;
  }
  return { get, put, settled: () => writes };
}

export function tileImageUrl(cell, size) {
  const query = new URLSearchParams({ tier: cell.tier, lon: cell.lon.toFixed(4),
    lat: cell.lat.toFixed(4), size: String(size) });
  return `detail-imagery?${query}&v=tiles2`;
}

async function decodeTileImage(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image(); image.decoding = 'async'; image.src = url;
    await image.decode(); return image;
  } finally { URL.revokeObjectURL(url); }
}

async function imageBlob(response, progress) {
  if (!response.body?.getReader || !progress) return response.blob();
  const reader = response.body.getReader(), chunks = [];
  const total = Number(response.headers.get('Content-Length')) || 0;
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); loaded += value.byteLength; progress({ loaded, total, complete: false });
  }
  progress({ loaded, total, complete: true });
  return new Blob(chunks, { type: response.headers.get('Content-Type') || 'image/jpeg' });
}

export function createTileLoader({ cache = createImageryCache(),
  request = (...args) => fetch(...args), decode = decodeTileImage } = {}) {
  return async (cell, size, signal, { maxSize = size, progress } = {}) => {
    signal?.throwIfAborted();
    // A stored sharp tile replaces its preview without another download or downgrade.
    for (const storedSize of [2048, 1024, 512].filter(s => s >= size && s <= maxSize)) {
      const response = await cache.get(tileImageUrl(cell, storedSize));
      if (!response) continue;
      try {
        const image = await decode(await response.blob());
        signal?.throwIfAborted();
        return { image, size: storedSize, cached: true,
          source: response.headers.get('X-Imagery-Source') || 'USDA / USGS The National Map' };
      } catch (error) { if (signal?.aborted) throw error; }
    }
    signal?.throwIfAborted();
    const path = tileImageUrl(cell, size);
    const response = await request(path, { signal, credentials: 'same-origin' });
    if (!response.ok) throw new Error('Imagery tile unavailable');
    const blob = await imageBlob(response, progress), image = await decode(blob);
    signal?.throwIfAborted();
    void cache.put(path, blob, response.headers);
    return { image, size, cached: false,
      source: response.headers.get('X-Imagery-Source') || 'USDA / USGS The National Map' };
  };
}

export const fetchTile = createTileLoader();
