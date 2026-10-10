const BASE_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};

function error(status, message) {
  return new Response(message, {status, headers: {...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8'}});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== 'jez237.com' || url.protocol !== 'https:') return error(404, 'Not found');
    if (!['GET', 'HEAD'].includes(request.method)) return error(405, 'Method not allowed');
    const match = /^\/software-downloads\/(photocraft|vectorcraft|signforge|filmcraft)\/([a-f0-9]{64})\/(PhotoCraft|VectorCraft|SignForge|FilmCraft)-(\d+\.\d+\.\d+)-Setup-x64\.exe$/.exec(url.pathname);
    if (!match || match[1] !== match[3].toLowerCase()) return error(404, 'Not found');
    try {
      const key = url.pathname.slice(1);
      const object = request.method === 'HEAD' ? await env.INSTALLERS.head(key) : await env.INSTALLERS.get(key);
      if (!object) return error(404, 'Not found');
      const headers = new Headers(BASE_HEADERS);
      headers.set('Content-Type', 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${url.pathname.split('/').pop()}"`);
      headers.set('Content-Length', String(object.size));
      headers.set('ETag', object.httpEtag);
      headers.set('X-Installer-SHA256', match[2]);
      return new Response(request.method === 'HEAD' ? null : object.body, {headers});
    } catch {
      console.error(JSON.stringify({event: 'installer_storage_unavailable'}));
      return error(503, 'Download temporarily unavailable');
    }
  },
};
