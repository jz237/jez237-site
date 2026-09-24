import { pathToFileURL } from 'node:url';

// Test the delivered parent-site policy: a nested site's _headers file does
// not configure the policy when that site is hosted inside the jez237 build.
export async function checkHiddenReefImages(base, fetcher = fetch) {
  for (const site of ['hidden-reef', 'hidden-reef-header-preview']) {
    for (const page of ['', 'category/?cat=saltwater', 'showroom/']) {
      const url = new URL(`/prototypes/${site}/${page}`, base);
      url.searchParams.set('deployment-check', Date.now());
      const response = await fetcher(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
        throw new Error(`Hidden Reef image check: missing page ${url.pathname}.`);
      }
      const csp = response.headers.get('content-security-policy');
      if (!csp) throw new Error(`Hidden Reef image check: missing security policy on ${url.pathname}.`);
      // Browsers enforce every delivered policy, rather than combining allowlists.
      for (const policy of csp.split(',')) {
        const directives = policy.split(';').map(value => value.trim().split(/\s+/));
        const images = directives.find(([name]) => name === 'img-src')
          || directives.find(([name]) => name === 'default-src');
        if (!images?.includes('https://cdn.shoplightspeed.com') || !images.includes("'self'")) {
          throw new Error(`Hidden Reef image check: product or local images blocked on ${url.pathname}.`);
        }
      }
      await response.body?.cancel();
    }
    const image = await fetcher(new URL(`/prototypes/${site}/assets/department/saltwater-reef.jpg`, base),
      { signal: AbortSignal.timeout(20000) });
    if (!image.ok || !image.headers.get('content-type')?.startsWith('image/')) {
      throw new Error(`Hidden Reef image check: missing department image in ${site}.`);
    }
    await image.body?.cancel();
  }
  console.log('Hidden Reef image checks passed: both storefronts allow local and Lightspeed images.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkHiddenReefImages(process.argv[2] || 'https://jez237.com');
}
