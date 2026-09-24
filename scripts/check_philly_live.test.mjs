import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPhillyLive } from './check_philly_live.mjs';

const policy = "script-src 'unsafe-eval' https://cdn.jsdelivr.net; style-src https://cdn.jsdelivr.net; connect-src https://*.cesium.com https://*.googleapis.com; worker-src blob:";
const mock = (missing = '') => async url => {
  const path = url.pathname.split('/').pop();
  if (!path) return new Response('<select id="photoMode"></select>', {
    headers: { 'Content-Security-Policy': missing === 'policy' ? "script-src 'self'" : policy },
  });
  if (missing === path) return new Response('<html>Not found</html>', { status: 404 });
  const [status, body] = {
    'detail-imagery': [400, 'Invalid detail imagery request'],
    'street-detail': [400, '{"error":"Invalid neighborhood"}'],
    aircraft: [405, 'Method not allowed'],
  }[path];
  return new Response(body, { status });
};
test('accepts complete Functions deployment', async () => {
  await checkPhillyLive('https://example.test', mock());
});
test('rejects static-only deployment despite successful page response', async () => {
  await assert.rejects(checkPhillyLive('https://example.test', mock('policy')), /Cesium/);
});
for (const route of ['detail-imagery', 'street-detail', 'aircraft']) {
  test(`rejects missing ${route} even with working Cesium policy`, async () => {
    await assert.rejects(checkPhillyLive('https://example.test', mock(route)), /Function/);
  });
}

for (const failure of ['offline', 'stale', 'malformed']) {
  test(`full aircraft check rejects ${failure} feed even when route exists`, async () => {
    const fetcher = (url, options) => url.pathname.endsWith('/aircraft') && options.method === 'GET'
      ? Promise.resolve(failure === 'malformed' ? new Response('<html>offline</html>')
        : Response.json({ aircraft: [], timestamp: failure === 'stale' ? Date.now() - 180000 : Date.now() },
          { status: failure === 'offline' ? 503 : 200 })) : mock()(url, options);
    await assert.rejects(checkPhillyLive('https://example.test', fetcher,
      { requireAircraft: true }), /no fresh feed/);
  });
}
test('full aircraft check accepts a fresh empty region without requiring fabricated reports', async () => {
  const fetcher = (url, options) => url.pathname.endsWith('/aircraft') && options.method === 'GET'
    ? Promise.resolve(Response.json({ aircraft: [], timestamp: Date.now() })) : mock()(url, options);
  await checkPhillyLive('https://example.test', fetcher, { requireAircraft: true });
});
