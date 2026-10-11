import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
    'peco-outages': [405, 'Method not allowed'],
  }[path];
  return new Response(body, { status });
};
test('accepts complete Functions deployment', async () => {
  await checkPhillyLive('https://example.test', mock());
});

const releaseAssets = { 'load/app-CURRENT.js': 'import "./chunk-CURRENT.js";',
  'load/chunk-CURRENT.js': 'export const ready = true;', 'load/style-CURRENT.css': 'body { margin: 0; }' };
const expectedBuild = { version: 1, sourceHash: 'current-source', entry: 'load/app-CURRENT.js',
  files: Object.fromEntries(Object.entries(releaseAssets).map(([path, value]) =>
    [path, createHash('sha256').update(value).digest('hex')])) };
for (const failure of ['', 'entry', 'manifest', 'entry bytes', 'chunk bytes', 'css bytes', 'missing chunk']) {
  test(`release identity ${failure ? `rejects stale ${failure}` : 'accepts matching page, manifest and assets'}`, async () => {
    const fetcher = async (url, options) => {
      const path = url.pathname.replace('/demos/philadelphia-relief/', '');
      if (!path) return new Response(`<select id="photoMode"></select><script type="module" src="${failure === 'entry' ? 'load/app-OLD.js' : expectedBuild.entry}"></script>`,
        { headers: { 'Content-Security-Policy': policy } });
      if (path === 'load/manifest.json') return Response.json(failure === 'manifest'
        ? { ...expectedBuild, sourceHash: 'old-source' } : expectedBuild);
      if (path in releaseAssets) {
        if (failure === 'missing chunk' && path.includes('chunk-')) return new Response('missing', { status: 404 });
        const stale = (failure === 'entry bytes' && path.includes('app-'))
          || (failure === 'chunk bytes' && path.includes('chunk-'))
          || (failure === 'css bytes' && path.endsWith('.css'));
        return new Response(stale ? 'previous release' : releaseAssets[path]);
      }
      return mock()(url, options);
    };
    const check = checkPhillyLive('https://example.test', fetcher, { expectedBuild });
    if (failure) await assert.rejects(check, /build mismatch/);
    else await check;
  });
}
test('rejects static-only deployment despite successful page response', async () => {
  await assert.rejects(checkPhillyLive('https://example.test', mock('policy')), /Cesium/);
});
for (const route of ['detail-imagery', 'street-detail', 'aircraft', 'peco-outages']) {
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

for (const failure of ['offline', 'stale', 'malformed', 'none']) {
  test(`PECO release check handles ${failure} snapshots`, async () => {
    const fetcher = (url, options) => url.pathname.endsWith('/peco-outages') && options.method === 'GET'
      ? Promise.resolve(failure === 'malformed' ? new Response('<html>offline</html>')
        : Response.json({ outages: [], serviceTotals: { outages: 0, customers: 0 },
          updatedAt: new Date(Date.now() - (failure === 'stale' ? 3600000 : 0)).toISOString() },
        { status: failure === 'offline' ? 503 : 200 })) : mock()(url, options);
    if (failure === 'none') await checkPhillyLive('https://example.test', fetcher, { requireOutages: true });
    else await assert.rejects(checkPhillyLive('https://example.test', fetcher, { requireOutages: true }), /PECO/);
  });
}
