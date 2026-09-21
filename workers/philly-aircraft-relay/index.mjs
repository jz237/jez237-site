import { timingSafeEqual } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Retry-After': '30' } });
const agent = 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)';

export function authorized(request, secret) {
  if (typeof secret !== 'string' || secret.length < 32) return false;
  const supplied = new TextEncoder().encode(request.headers.get('Authorization') || '');
  const expected = new TextEncoder().encode(`Bearer ${secret}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function tunnelOrigin(value) {
  if (typeof value !== 'string' || value.length > 200) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /^[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com$/.test(url.hostname)
      && !url.username && !url.password && !url.port && url.pathname === '/' && !url.search && !url.hash
      ? url.origin : null;
  } catch { return null; }
}

export default {
  async fetch(request, env) {
    if (!authorized(request, env.RELAY_KEY)) return json({ error: 'Unauthorized' }, 401);
    const path = new URL(request.url).pathname;
    if (path === '/register' && request.method === 'POST') {
      // The address is the entire request body; cap it before parsing or storing.
      let body = '';
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Missing address' }, 400);
      try {
        for (;;) {
          const { value, done } = await reader.read(); if (done) break;
          body += new TextDecoder().decode(value);
          if (body.length > 200) { await reader.cancel(); return json({ error: 'Address too long' }, 413); }
        }
      } finally { reader.releaseLock(); }
      const origin = tunnelOrigin(body);
      if (!origin) return json({ error: 'Invalid tunnel address' }, 400);
      // Authenticate the receiving process before changing the active address.
      try {
        const health = await fetch(`${origin}/health`, { redirect: 'manual', signal: AbortSignal.timeout(6000),
          headers: { Authorization: `Bearer ${env.RELAY_KEY}`, 'User-Agent': agent } });
        const valid = health.status === 204 && health.headers.get('X-Philadelphia-Aircraft-Relay') === '1';
        await health.body?.cancel();
        if (!valid) {
          console.warn(JSON.stringify({ event: 'relay-health', status: health.status }));
          return json({ error: 'Relay not ready' }, 503);
        }
        await env.REGISTRY.put('origin', origin);
        return new Response(null, { status: 204 });
      } catch { console.warn(JSON.stringify({ event: 'relay-health', status: 'connection-failed' }));
        return json({ error: 'Relay not ready' }, 503); }
    }
    if (path !== '/aircraft' || request.method !== 'GET') return json({ error: 'Not found' }, 404);
    try {
      const origin = tunnelOrigin(await env.REGISTRY.get('origin'));
      if (!origin) return json({ error: 'Computer relay offline' }, 503);
      const response = await fetch(`${origin}/aircraft`, { redirect: 'manual', signal: AbortSignal.timeout(9500),
        headers: { Authorization: `Bearer ${env.RELAY_KEY}`, Accept: 'application/json', 'User-Agent': agent },
        cf: { cacheTtl: 0 } });
      if (![200, 503].includes(response.status)
        || response.headers.get('X-Philadelphia-Aircraft-Relay') !== '1') {
        await response.body?.cancel(); return json({ error: 'Computer relay offline' }, 503);
      }
      const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      for (const key of ['Retry-After', 'X-Aircraft-Access-Required']) {
        const value = response.headers.get(key); if (value) headers.set(key, value);
      }
      return new Response(response.body, { status: response.status, headers });
    } catch { return json({ error: 'Computer relay offline' }, 503); }
  },
};
