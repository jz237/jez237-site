const ARCHIVE_PATH = '/experiments/image-gen-2-benchmark/';

export async function onRequestGet({ request, env, params }) {
  const id = params.id;
  if (typeof id !== 'string' || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id)) {
    return new Response('Infographic not found.', { status: 404 });
  }

  const packUrl = new URL(`${ARCHIVE_PATH}infographic-articles-${id.slice(0, 7)}.json`, request.url);
  const asset = await env.ASSETS.fetch(new Request(packUrl, { redirect: 'error' }));
  if (!asset.ok) {
    const status = asset.status === 404 ? 404 : 502;
    return new Response(status === 404 ? 'Infographic not found.' : 'Article archive is unavailable.', { status });
  }

  const pages = await asset.json();
  if (typeof pages[id] !== 'string') {
    return new Response('Infographic not found.', { status: 404 });
  }

  const url = new URL(request.url);
  if (!url.pathname.endsWith('/')) {
    url.pathname += '/';
    return Response.redirect(url, 308);
  }

  return new Response(pages[id], {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
