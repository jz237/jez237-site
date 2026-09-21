import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createRelay, FEED } from '../../../scripts/philadelphia-aircraft/relay.mjs';
import gateway, { tunnelOrigin } from '../../../workers/philly-aircraft-relay/index.mjs';
import { onRequest } from '../../../functions/demos/philadelphia-relief/aircraft.js';

const token = 'a-test-secret-with-more-than-thirty-two-characters';
const headers = { Authorization: `Bearer ${token}` };
async function withRelay(options, run) {
  const server = createRelay({ token, ...options });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}

test('home relay is authenticated, fixed-route, idle until requested and shares concurrent requests', async () => {
  let calls = 0, time = Date.now();
  await withRelay({ now: () => time, fetchFeed: async url => {
    assert.equal(url, FEED); calls++;
    await new Promise(resolve => setTimeout(resolve, 15));
    return Response.json({ now: time, ac: [{ hex: 'abc123', lat: 40, lon: -75.2, privateField: 'removed' }] });
  } }, async base => {
    assert.equal(calls, 0);
    assert.equal((await fetch(`${base}/aircraft`)).status, 401);
    assert.equal((await fetch(`${base}/health`, { headers })).status, 204);
    assert.equal((await fetch(`${base}/aircraft?url=https://example.com`, { headers })).status, 404);
    assert.equal((await fetch(`${base}/aircraft`, { method: 'POST', headers })).status, 404);
    assert.equal(calls, 0);
    const results = await Promise.all(Array.from({ length: 8 }, () => fetch(`${base}/aircraft`, { headers }).then(r => r.json())));
    assert.equal(calls, 1); assert.equal(results[0].ac[0].privateField, undefined);
    await fetch(`${base}/aircraft`, { headers }); assert.equal(calls, 1);
    time += 15001;
    await fetch(`${base}/aircraft`, { headers }); assert.equal(calls, 2);
  });
});

test('home relay respects provider backoff and never returns old or fabricated aircraft after failure', async () => {
  let calls = 0, time = Date.now(), code = 429;
  await withRelay({ now: () => time, fetchFeed: async () => {
    calls++; return new Response('denied', { status: code, headers: { 'Retry-After': '600' } });
  } }, async base => {
    const first = await fetch(`${base}/aircraft`, { headers });
    assert.equal(first.status, 503); assert.equal(first.headers.get('Retry-After'), '600');
    assert.equal((await first.json()).aircraft, undefined);
    time += 30000; await fetch(`${base}/aircraft`, { headers }); assert.equal(calls, 1);
    time += 600000; code = 403;
    const denied = await fetch(`${base}/aircraft`, { headers });
    assert.equal(denied.headers.get('X-Aircraft-Access-Required'), '1');
    assert.equal(denied.headers.get('Retry-After'), '3600');
    time += 50000; await fetch(`${base}/aircraft`, { headers }); assert.equal(calls, 2);
  });
});

test('home relay bounds provider responses and rejects stale reports', async () => {
  for (const body of [JSON.stringify({ now: Date.now() - 180000, ac: [] }), 'a'.repeat(1048577)]) {
    await withRelay({ fetchFeed: async () => new Response(body) }, async base => {
      const response = await fetch(`${base}/aircraft`, { headers });
      assert.equal(response.status, 503); assert.equal((await response.json()).retryAfter, 30);
    });
  }
});

test('gateway registration rejects arbitrary origins and unauthenticated changes', async () => {
  for (const url of ['http://abc.trycloudflare.com', 'https://abc.trycloudflare.com.evil.example',
    'https://user@abc.trycloudflare.com', 'https://127.0.0.1', 'https://abc.trycloudflare.com/x',
    'https://abc.trycloudflare.com?token=1']) assert.equal(tunnelOrigin(url), null);
  assert.equal(tunnelOrigin('https://some-test-name.trycloudflare.com'), 'https://some-test-name.trycloudflare.com');
  const env = { RELAY_KEY: token, REGISTRY: { put: () => assert.fail('Must not write') } };
  assert.equal((await gateway.fetch(new Request('https://gateway/register', { method: 'POST' }), env)).status, 401);
  assert.equal((await gateway.fetch(new Request('https://gateway/register',
    { method: 'POST', headers, body: 'https://localhost/' }), env)).status, 400);
});

test('Pages sends its secret only to the fixed relay, normalizes reports and identifies an offline computer', async () => {
  const originalFetch = globalThis.fetch, originalCaches = globalThis.caches;
  const pending = [];
  globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
  const context = { env: { AIRCRAFT_RELAY_KEY: token },
    request: new Request('https://jez237.com/demos/philadelphia-relief/aircraft?url=https://evil.example'),
    waitUntil: p => pending.push(p) };
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://philly-aircraft-relay.jez237.workers.dev/aircraft');
      assert.equal(options.headers.Authorization, `Bearer ${token}`); assert.equal(options.redirect, 'manual');
      return Response.json({ now: Date.now(), ac: [] });
    };
    const success = await onRequest(context);
    assert.equal(success.status, 200); assert.equal((await success.json()).relay, 'home');
    globalThis.fetch = async () => new Response('Offline', { status: 503 });
    const offline = await (await onRequest(context)).json();
    assert.equal(offline.relayUnavailable, true); assert.equal(offline.accessRequired, false);
    globalThis.fetch = async () => new Response('Denied', { status: 503,
      headers: { 'X-Aircraft-Access-Required': '1' } });
    assert.equal((await (await onRequest(context)).json()).accessRequired, true);
    await Promise.all(pending);
  } finally { globalThis.fetch = originalFetch; globalThis.caches = originalCaches; }
});
