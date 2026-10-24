// Only retired URLs and separately hosted masters belong here. Canonical media
// redirects come from the manifest so additions cannot drift out of sync.
const legacyTargets = {
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-title-loop/port-richmond-title-loop-b10-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/port-richmond-title-loop-b10-1080p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-1080p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-1080p.mp4",
  "/multimedia/port-richmond-title-loop/port-richmond-title-loop-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/port-richmond-title-loop-b10-720p.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4",
  "/multimedia/port-richmond-title-loop/preview-b7.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/preview-b10.mp4",
  "/multimedia/port-richmond-title-loop/port-richmond-title-loop-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/port-richmond-title-loop-b10-720p.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b8-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4",
  "/multimedia/port-richmond-title-loop/preview-b8.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/preview-b10.mp4",
  "/multimedia/port-richmond-title-loop/port-richmond-title-loop-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/port-richmond-title-loop-b10-720p.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b9-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4",
  "/multimedia/port-richmond-title-loop/preview-b9.mp4": "https://media.jez237.com/multimedia/port-richmond-title-loop/preview-b10.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b10-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b11-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4",
  "/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-aramingo-walk/port-richmond-aramingo-walk-b13-720p.mp4",
  "/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-castor-terminal-walk/port-richmond-castor-terminal-walk-b13-720p.mp4",
  "/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-el-kensington-walk/port-richmond-el-kensington-walk-b13-720p.mp4",
  "/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-frankford-rec-walk/port-richmond-frankford-rec-walk-b13-720p.mp4",
  "/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-rowhomes-joyce-walk/port-richmond-rowhomes-joyce-walk-b13-720p.mp4",
  "/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b12-720p.mp4": "https://media.jez237.com/multimedia/port-richmond-weikel-tulip-walk/port-richmond-weikel-tulip-walk-b13-720p.mp4"
};

export function createMediaRedirectHandler(manifest) {
  const targets = {
    ...legacyTargets,
    ...Object.fromEntries(manifest.objects.map(({ path, url }) => ["/" + path, url]))
  };

  return function migratedMediaResponse(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return null;
    const url = new URL(request.url);
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return null; }
    const target = Object.hasOwn(targets, pathname) ? targets[pathname] : null;
    if (!target) return null;
    const destination = new URL(target);
    // Retain manifest cache-version parameters and the caller's exact query.
    if (url.search) {
      destination.search += destination.search ? "&" + url.search.slice(1) : url.search;
    }
    return new Response(null, { status: 301, headers: {
      Location: destination.href,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }});
  };
}
