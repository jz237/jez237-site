const SOURCE =
  "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export";

const REGION = {
  west: -75.8,
  east: -74.7,
  south: 39.7,
  north: 40.55,
};
const TIERS = {
  detail: { span: { lon: 0.096, lat: 0.072 }, grid: { lon: 0.04, lat: 0.03 } },
  ultra: { span: { lon: 0.032, lat: 0.024 }, grid: { lon: 0.012, lat: 0.009 } },
  rooftop: { span: { lon: 0.012, lat: 0.009 }, grid: { lon: 0.0045, lat: 0.0035 } },
};
const ALLOWED_SIZES = new Set([2048, 4096]);
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
  const key = `aligned-v2,${tier},${lon.toFixed(4)},${lat.toFixed(4)},${size}`;
  const height = Math.round(size * spec.span.lat / spec.span.lon);
  return { tier, lon, lat, size, height, bounds, key };
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

  const sourceUrl = new URL(SOURCE);
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
  }).toString();

  try {
    const upstream = await fetch(sourceUrl, {
      headers: { Accept: "image/jpeg" },
      cf: { cacheEverything: true, cacheTtl: CACHE_SECONDS },
    });
    const contentType = upstream.headers.get("content-type") || "";
    if (!upstream.ok || !contentType.startsWith("image/jpeg")) {
      return plain(502, "Aerial detail source unavailable\n");
    }

    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", `public, max-age=${CACHE_SECONDS}, immutable`);
    headers.set("CDN-Cache-Control", `public, max-age=${CACHE_SECONDS}`);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set("X-Imagery-Detail-Key", detail.key);
    const response = new Response(upstream.body, {
      status: 200,
      headers,
    });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error(JSON.stringify({
      message: "USGS detail imagery fetch failed",
      error: error instanceof Error ? error.message : String(error),
    }));
    return plain(502, "Aerial detail source unavailable\n");
  }
}

export function onRequest(context) {
  if (context.request.method === "GET") return onRequestGet(context);
  return plain(405, "Method not allowed\n", { Allow: "GET" });
}
