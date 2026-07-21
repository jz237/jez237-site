// Serves the Stunt Car Racer entry page fresh from the current deployment on
// every request. Added because the edge once pinned a stale build for this URL
// after the v140 rollout — Functions run before the static cache, so this
// route can never serve an old deployment again.
async function freshEntry({ request, env }) {
  const assetUrl = new URL('/games/2026-07-17/stunt-car-racer/source.html', request.url);
  let res = await env.ASSETS.fetch(assetUrl);
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get('Location');
    if (loc) res = await env.ASSETS.fetch(new URL(loc, request.url));
  }
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store');
  return out;
}
export const onRequestGet = freshEntry;
