import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

// Invalid requests exercise routing without downloading imagery or contacting
// aircraft providers. Missing Functions otherwise look like a healthy HTML site.
export async function checkPhillyLive(base, fetcher = fetch,
  { requireAircraft = false, requireOutages = false, expectedBuild = null } = {}) {
  const root = new URL('/demos/philadelphia-relief/', base);
  const request = async (path, method = 'GET') => {
    const url = new URL(path, root);
    url.searchParams.set('deployment-check', Date.now());
    return fetcher(url, { method, redirect: 'error', signal: AbortSignal.timeout(20000),
      headers: { Referer: root.href, Origin: root.origin, 'Cache-Control': 'no-cache' } });
  };
  const page = await request('');
  const csp = page.headers.get('content-security-policy') || '';
  const directives = Object.fromEntries(csp.split(';').map(s => {
    const [name, ...values] = s.trim().split(/\s+/); return [name, values];
  }));
  for (const [directive, source] of [
    ['script-src', "'unsafe-eval'"], ['script-src', 'https://cdn.jsdelivr.net'],
    ['style-src', 'https://cdn.jsdelivr.net'], ['connect-src', 'https://*.cesium.com'],
    ['connect-src', 'https://*.googleapis.com'], ['worker-src', 'blob:'],
  ]) {
    if (!directives[directive]?.includes(source)) {
      throw new Error(`Philadelphia deployment blocked: missing Cesium ${directive} permission.`);
    }
  }
  const html = await page.text();
  if (!page.ok || !html.includes('id="photoMode"')) {
    throw new Error('Philadelphia page missing from deployment.');
  }
  if (expectedBuild) {
    const entry = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g)]
      .map(match => match[1]).find(src => src.startsWith('load/app-'));
    if (entry !== expectedBuild.entry) {
      throw new Error(`Philadelphia build mismatch: expected ${expectedBuild.entry}, received ${entry || 'no entry'}.`);
    }
    const response = await request('load/manifest.json');
    let manifest;
    try { manifest = await response.json(); } catch { /* fail closed below */ }
    if (!response.ok || !isDeepStrictEqual(manifest, expectedBuild)) {
      throw new Error('Philadelphia build mismatch: deployed manifest differs from the release.');
    }
    for (const [path, expectedHash] of Object.entries(expectedBuild.files)) {
      const asset = await request(path);
      const hash = createHash('sha256').update(Buffer.from(await asset.arrayBuffer())).digest('hex');
      if (!asset.ok || hash !== expectedHash) {
        throw new Error(`Philadelphia build mismatch: ${path} is missing or has different contents.`);
      }
    }
  }
  for (const [path, method, status, text] of [
    ['detail-imagery', 'GET', 400, 'Invalid detail imagery request'],
    ['street-detail', 'GET', 400, 'Invalid neighborhood'],
    ['aircraft', 'POST', 405, 'Method not allowed'],
    ['peco-outages', 'POST', 405, 'Method not allowed'],
  ]) {
    const response = await request(path, method);
    if (response.status !== status || !(await response.text()).includes(text)) {
      throw new Error(`Philadelphia deployment blocked: ${path} Function is missing or incorrect (HTTP ${response.status}).`);
    }
  }
  if (requireOutages) {
    const response = await request('peco-outages');
    let data;
    try { data = await response.json(); } catch { /* reject non-JSON deployments */ }
    if (!response.ok || !Array.isArray(data?.outages) || !data.serviceTotals
      || !Number.isFinite(Date.parse(data.updatedAt)) || Date.now() - Date.parse(data.updatedAt) > 1800000) {
      throw new Error(`Philadelphia PECO check failed: no current outage snapshot (HTTP ${response.status}).`);
    }
    console.log(`PECO outage data verified: ${data.outages.length} regional locations / groups.`);
  }
  if (requireAircraft) {
    const response = await request('aircraft');
    let data;
    try { data = await response.json(); } catch { /* reject non-JSON deployments */ }
    if (!response.ok || !Array.isArray(data?.aircraft) || !Number.isFinite(data.timestamp)
      || data.timestamp < Date.now() - 120000 || data.timestamp > Date.now() + 30000) {
      throw new Error(`Philadelphia aircraft check failed: no fresh feed (HTTP ${response.status}).`);
    }
    console.log(`Aircraft data verified: ${data.aircraft.length} reports; fresh provider timestamp.`);
  }
  console.log(`Philadelphia live checks passed: Cesium policy, imagery, neighborhoods, aircraft (${root.host}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkPhillyLive(process.argv[2] || 'https://jez237.com', fetch,
    { requireAircraft: process.argv.includes('--require-aircraft'),
      requireOutages: process.argv.includes('--require-outages') });
}
