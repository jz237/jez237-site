import { IMAGERY_STATES } from '../../../../games/demos/philadelphia-relief/data/imagery-states.js';

const SOURCE =
  "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export";

const REGION = {
  west: -75.8,
  east: -74.7,
  south: 39.7,
  north: 40.55,
};
const TIERS = {
  'tile-inspection': { span: { lon: 0.0032, lat: 0.0024 }, grid: { lon: 0.0032, lat: 0.0024 } },
  'tile-rooftop': { span: { lon: 0.0128, lat: 0.0096 }, grid: { lon: 0.0128, lat: 0.0096 } },
  'tile-ultra': { span: { lon: 0.0512, lat: 0.0384 }, grid: { lon: 0.0512, lat: 0.0384 } },
  'tile-detail': { span: { lon: 0.1024, lat: 0.0768 }, grid: { lon: 0.1024, lat: 0.0768 } },
  detail: { span: { lon: 0.096, lat: 0.072 }, grid: { lon: 0.04, lat: 0.03 } },
  ultra: { span: { lon: 0.032, lat: 0.024 }, grid: { lon: 0.012, lat: 0.009 } },
  inspection: { span: { lon: 0.006, lat: 0.0045 }, grid: { lon: 0.0005, lat: 0.0005 } },
  rooftop: { span: { lon: 0.012, lat: 0.009 }, grid: { lon: 0.0045, lat: 0.0035 } },
};
const ALLOWED_SIZES = new Set([512, 1024, 2048, 4096]);
const CACHE_SECONDS = 30 * 24 * 60 * 60;

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

function quantize(value, origin, step) {
  return origin + Math.round((value - origin) / step) * step;
}

export function detailRequest(searchParams) {
  const requestedLon = Number(searchParams.get("lon"));
  const requestedLat = Number(searchParams.get("lat"));
  const size = Number(searchParams.get("size"));
  const tier = searchParams.get("tier") || "detail";
  const spec = TIERS[tier];
  if (!Number.isFinite(requestedLon) || !Number.isFinite(requestedLat)) return null;
  if (!spec) return null;
  if (!ALLOWED_SIZES.has(size)) return null;
  if (requestedLon < REGION.west || requestedLon > REGION.east) return null;
  if (requestedLat < REGION.south || requestedLat > REGION.north) return null;

  const halfLon = spec.span.lon / 2;
  const halfLat = spec.span.lat / 2;
  const lon = clamp(
    quantize(requestedLon, REGION.west, spec.grid.lon),
    REGION.west + halfLon,
    REGION.east - halfLon,
  );
  const lat = clamp(
    quantize(requestedLat, REGION.south, spec.grid.lat),
    REGION.south + halfLat,
    REGION.north - halfLat,
  );
  const bounds = {
    west: lon - halfLon,
    east: lon + halfLon,
    south: lat - halfLat,
    north: lat + halfLat,
  };
  const key = `pan-v5,${tier},${lon.toFixed(4)},${lat.toFixed(4)},${size}`;
  const height = Math.round(size * spec.span.lat / spec.span.lon);
  return { tier, lon, lat, size, height, bounds, key };
}

// Select by actual state boundaries, not the rectangular bounds of a mosaic.
function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function imageryState(lon, lat) {
  return Object.keys(IMAGERY_STATES).find((state) => {
    const rings = IMAGERY_STATES[state];
    return inRing(lon, lat, rings[0]) && !rings.slice(1).some((ring) => inRing(lon, lat, ring));
  }) || null;
}

const STATE_SOURCES = {
  PA: { name: 'Pennsylvania PEMA 2021-2023 / PASDA', layers: 'show:3',
    url: 'https://services.pasda.psu.edu/server/rest/services/pasda/PEMAImagery2021_2023/MapServer/export' },
  NJ: { name: 'New Jersey OGIS 2020',
    url: 'https://maps.nj.gov/arcgis/rest/services/Basemap/Orthos_Natural_2020_NJ_WM/MapServer/export' },
  DE: { name: 'Delaware FirstMap 2022 / Sanborn',
    url: 'https://imagery.firstmap.delaware.gov/imagery/rest/services/DE_Imagery/DE_Imagery_2022/ImageServer/exportImage' },
  MD: { name: 'Maryland iMAP / DoIT six-inch imagery',
    url: 'https://mdgeodata.md.gov/imagery/rest/services/SixInch/SixInchImagery/ImageServer/exportImage' },
};

export function imagerySources(detail) {
  const b = detail.bounds;
  const sources = [];
  // Wide regional views use the inexpensive existing overview source.
  if (detail.tier !== 'detail' && detail.tier !== 'tile-detail') {
    if (b.west >= -75.23 && b.east <= -75.12 && b.south >= 39.93 && b.north <= 40.00) {
      sources.push({ name: 'City of Philadelphia 2024 / PASDA', layers: 'show:0,1,2,3',
        url: 'https://maps.pasda.psu.edu/ArcGIS/rest/services/pasda/PhiladelphiaImagery2024/MapServer/export' });
    }
    const state = imageryState((b.west + b.east) / 2, (b.south + b.north) / 2);
    if (state) sources.push(STATE_SOURCES[state]);
  }
  sources.push({ name: 'USDA / USGS The National Map', url: SOURCE });
  return sources;
}

function sameOriginRequest(request) {
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).hostname === new URL(request.url).hostname;
  } catch {
    return false;
  }
}

function plain(status, message, headers = {}) {
  return new Response(message, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      ...headers,
    },
  });
}

export async function onRequestGet(context) {
  const { request } = context;
  if (!sameOriginRequest(request)) return plain(403, "Forbidden\n");

  const url = new URL(request.url);
  const detail = detailRequest(url.searchParams);
  if (!detail) return plain(400, "Invalid detail imagery request\n");

  const cacheUrl = new URL(url.origin + url.pathname);
  cacheUrl.search = new URLSearchParams({ key: detail.key }).toString();
  const cacheKey = new Request(cacheUrl, { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const sources = imagerySources(detail);
  for (const source of sources) {
    const sourceUrl = new URL(source.url);
    sourceUrl.search = new URLSearchParams({
      bbox: [
        detail.bounds.west,
        detail.bounds.south,
        detail.bounds.east,
        detail.bounds.north,
      ].map((value) => value.toFixed(6)).join(","),
      bboxSR: "4326",
      imageSR: "4326",
      size: `${detail.size},${detail.height}`,
      format: "jpg",
      transparent: "false",
      f: "image",
      ...(source.layers ? { layers: source.layers } : {}),
    }).toString();

    try {
      const upstream = await fetch(sourceUrl, {
        headers: { Accept: "image/jpeg" },
        signal: AbortSignal.timeout(30000),
        cf: { cacheEverything: true, cacheTtl: CACHE_SECONDS },
      });
      const contentType = upstream.headers.get("content-type") || "";
      if (!upstream.ok || !contentType.startsWith("image/jpeg")) {
        continue;
      }

      const headers = new Headers(upstream.headers);
      const ttl = source === sources[0] ? CACHE_SECONDS : 300;
      headers.set("Cache-Control", `public, max-age=${ttl}`);
      headers.set("CDN-Cache-Control", `public, max-age=${ttl}`);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("X-Robots-Tag", "noindex, nofollow");
      headers.set("X-Imagery-Detail-Key", detail.key);
      headers.set("X-Imagery-Source", source.name);
      const response = new Response(upstream.body, {
        status: 200,
        headers,
      });
      context.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (error) {
      console.error(JSON.stringify({
        message: "Detail imagery fetch failed",
        source: source.name,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }
  return plain(502, "Aerial detail source unavailable\n");
}

export function onRequest(context) {
  if (context.request.method === "GET") return onRequestGet(context);
  return plain(405, "Method not allowed\n", { Allow: "GET" });
}
