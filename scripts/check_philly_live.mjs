import { pathToFileURL } from 'node:url';

// Invalid requests exercise routing without downloading imagery or contacting
// aircraft providers. Missing Functions otherwise look like a healthy HTML site.
export async function checkPhillyLive(base, fetcher = fetch) {
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
  if (!page.ok || !(await page.text()).includes('id="photoMode"')) {
    throw new Error('Philadelphia page missing from deployment.');
  }
  for (const [path, method, status, text] of [
    ['detail-imagery', 'GET', 400, 'Invalid detail imagery request'],
    ['street-detail', 'GET', 400, 'Invalid neighborhood'],
    ['aircraft', 'POST', 405, 'Method not allowed'],
  ]) {
    const response = await request(path, method);
    if (response.status !== status || !(await response.text()).includes(text)) {
      throw new Error(`Philadelphia deployment blocked: ${path} Function is missing or incorrect (HTTP ${response.status}).`);
    }
  }
  console.log(`Philadelphia live checks passed: Cesium policy, imagery, neighborhoods, aircraft (${root.host}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkPhillyLive(process.argv[2] || 'https://jez237.com');
}
