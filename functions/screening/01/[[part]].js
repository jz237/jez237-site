import screening from '../_lib/screen01.json';

const base = '/screening/01/';
const cookieName = '__Secure-JezScreen01';
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'Vary': 'Cookie, Authorization',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};
const locked = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><meta name="theme-color" content="#101816">
<title>Private screening · Jez237</title><link rel="stylesheet" href="/screening/watch.css"><script src="/screening/unlock.js" defer></script></head>
<body><main class="entry"><h1>Private screening</h1><p id="status" role="status">Open the complete private link you received to watch this film.</p>
<button type="button" id="retry" hidden>Try again</button><noscript><p>Enable JavaScript to open your private link.</p></noscript></main></body></html>`;

const digest = Uint8Array.from(screening.keyDigest.match(/../g), hex => parseInt(hex, 16));
function bytes(base64url) {
  return Uint8Array.from(atob(base64url.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
}
async function verified(ticket) {
  if (!ticket || !/^[A-Za-z0-9_-]{43}$/.test(ticket)) return null;
  const raw = bytes(ticket);
  const actual = await crypto.subtle.digest('SHA-256', raw);
  return crypto.subtle.timingSafeEqual(digest, actual) ? raw : null;
}
function sessionTicket(request) {
  const fields = (request.headers.get('Cookie') || '').split(';').map(s => s.trim());
  const field = fields.find(s => s.startsWith(cookieName + '='));
  return field ? field.slice(cookieName.length + 1) : '';
}
function blank(status, more = {}) {
  return new Response(null, {status, headers: {...headers, ...more}});
}

function range(value, size) {
  if (!value) return {low: 0, high: size - 1, partial: false};
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null;
  const low = match[1] ? start : Math.max(0, size - end);
  const high = match[1] && match[2] ? Math.min(size - 1, end) : size - 1;
  return low < size && high >= low ? {low, high, partial: true} : null;
}

async function openBytes(request, env, asset, raw, low, high) {
  const blockSize = screening.chunkSize;
  const first = Math.floor(low / blockSize);
  const last = Math.floor(high / blockSize);
  const cipherSize = asset.size + 16 * Math.ceil(asset.size / blockSize);
  const start = first * (blockSize + 16);
  const end = Math.min(asset.size, (last + 1) * blockSize) + (last + 1) * 16 - 1;
  const upstream = await env.ASSETS.fetch(new Request(new URL(asset.path, request.url), {
    headers: {Range: `bytes=${start}-${end}`},
  }));
  if (upstream.status !== 200 && upstream.status !== 206) throw new Error('Encrypted asset unavailable');
  const partial = upstream.status === 206;
  if (partial && upstream.headers.get('Content-Range') !== `bytes ${start}-${end}/${cipherSize}`) throw new Error('Unexpected asset range');
  // All three immutable assets have fixed manifest lengths. The full phone copy is under 8 MB.
  const expected = partial ? end - start + 1 : cipherSize;
  const length = upstream.headers.get('Content-Length');
  if (length !== null && Number(length) !== expected) throw new Error('Invalid asset length');
  const content = new Uint8Array(await upstream.arrayBuffer());
  if (content.length !== expected) throw new Error('Incomplete asset');
  const sealed = partial ? content : content.subarray(start, end + 1);
  const output = new Uint8Array(high - low + 1);
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  const iv = new Uint8Array(12);
  iv.set(bytes(asset.nonce));
  const counter = new DataView(iv.buffer);
  let offset = 0;
  for (let block = first; block <= last; block++) {
    const at = block * blockSize;
    const size = Math.min(blockSize, asset.size - at);
    counter.setUint32(8, block, false);
    const plain = new Uint8Array(await crypto.subtle.decrypt({name: 'AES-GCM', iv}, key, sealed.subarray(offset, offset + size + 16)));
    const from = Math.max(0, low - at);
    output.set(plain.subarray(from, Math.min(size, high - at + 1)), at + from - low);
    offset += size + 16;
  }
  return output;
}

async function assetResponse(request, env, raw, asset, type) {
  const tag = '"' + asset.path.split('/').pop() + '"';
  const ifRange = request.headers.get('If-Range');
  const rangeHeader = !ifRange || ifRange === tag ? request.headers.get('Range') : null;
  const span = range(rangeHeader, asset.size);
  if (!span) return blank(416, {'Content-Range': 'bytes */' + asset.size});
  const {low, high, partial} = span;
  const metadata = {...headers, 'Content-Type': type, 'Accept-Ranges': 'bytes', ETag: tag, 'Content-Length': String(high - low + 1)};
  if (type === 'video/mp4') metadata['Content-Disposition'] = 'inline; filename="film.mp4"';
  if (partial) metadata['Content-Range'] = `bytes ${low}-${high}/${asset.size}`;
  const body = request.method === 'HEAD' ? null : await openBytes(request, env, asset, raw, low, high);
  return new Response(body, {status: partial ? 206 : 200, headers: metadata});
}

export async function onRequest({request, env}) {
  const url = new URL(request.url);
  const route = url.pathname === base.slice(0, -1) ? '' : url.pathname.slice(base.length);
  if (route === 'unlock') {
    if (request.method !== 'POST') return blank(405, {Allow: 'POST'});
    if (request.headers.get('Origin') !== url.origin) return blank(403);
    const ticket = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.get('Authorization') || '')?.[1];
    if (!(await verified(ticket))) return blank(403);
    return blank(204, {'Set-Cookie': `${cookieName}=${ticket}; Path=${base}; Secure; HttpOnly; SameSite=Lax`});
  }
  if (!['GET', 'HEAD'].includes(request.method)) return blank(405, {Allow: 'GET, HEAD'});
  if (!['', 'film.mp4', 'poster.jpg'].includes(route)) return blank(404);
  const raw = await verified(sessionTicket(request));
  if (!raw) {
    if (route) return blank(404);
    return new Response(request.method === 'HEAD' ? null : locked, {headers: {...headers, 'Content-Type':'text/html; charset=utf-8'}});
  }
  const [asset,type] = route === 'film.mp4' ? [screening.assets.film, 'video/mp4']
    : route === 'poster.jpg' ? [screening.assets.still, 'image/jpeg'] : [screening.assets.card, 'text/html; charset=utf-8'];
  try {
    return await assetResponse(request, env, raw, asset, type);
  } catch {
    return blank(503, {'Retry-After': '5'});
  }
}
