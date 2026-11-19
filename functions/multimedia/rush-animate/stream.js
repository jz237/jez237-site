const film = 'https://github.com/jz237/multimedia/releases/download/animate-countercurrent-2/animate-countercurrent-instruments-1080p.mp4';

export async function onRequest({ request }) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const headers = new Headers({ 'User-Agent': 'jez237-film-player' });
  for (const field of ['Range', 'If-Range', 'If-None-Match', 'If-Modified-Since']) {
    const value = request.headers.get(field);
    if (value) headers.set(field, value);
  }
  const remote = await fetch(film, { method: request.method, headers, redirect: 'follow' });
  if (![200, 206, 304, 416].includes(remote.status)) {
    return new Response('The film is temporarily unavailable.', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
  const media = new Headers({
    'Content-Type': 'video/mp4',
    'Content-Disposition': 'inline; filename="animate-countercurrent-instruments-1080p.mp4"',
    'Accept-Ranges': 'bytes',
    'Cache-Control': new URL(request.url).searchParams.get('v') === 'instruments-2' ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const field of ['Content-Length', 'Content-Range', 'ETag', 'Last-Modified']) {
    const value = remote.headers.get(field);
    if (value) media.set(field, value);
  }
  return new Response(request.method === 'HEAD' || remote.status === 304 ? null : remote.body, { status: remote.status, headers: media });
}
