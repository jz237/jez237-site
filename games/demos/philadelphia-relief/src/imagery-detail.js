/**
 * Camera-following aerial imagery levels.
 *
 * The regional texture is always available immediately. A city-detail cell
 * replaces it below 16 km, a smaller source-resolution block cell replaces
 * that below 4.8 km, and a camera-following roof cell takes over for the final
 * descent; inspection cells bring local aerial imagery down to 200 m.
 * Source resolution varies outside the local coverage areas. Cells overlap,
 * cross-fade in the terrain shader and load only for the visible cell after the camera settles.
 * A smaller preview arrives before full detail; obsolete requests are canceled.
 */

export const DETAIL_DISTANCE_M = 16000;
export const ULTRA_DISTANCE_M = 4800;
export const ROOFTOP_DISTANCE_M = 1600;
export const INSPECTION_DISTANCE_M = 400;
export const IMAGERY_DETAIL_MODES = Object.freeze(['data', 'standard', 'maximum']);
export const DETAIL_TIERS = Object.freeze({
  detail: Object.freeze({ span: Object.freeze({ lon: 0.096, lat: 0.072 }),
    grid: Object.freeze({ lon: 0.04, lat: 0.03 }) }),
  ultra: Object.freeze({ span: Object.freeze({ lon: 0.032, lat: 0.024 }),
    grid: Object.freeze({ lon: 0.012, lat: 0.009 }) }),
  inspection: Object.freeze({ span: Object.freeze({ lon: 0.006, lat: 0.0045 }),
    grid: Object.freeze({ lon: 0.0005, lat: 0.0005 }) }),
  rooftop: Object.freeze({ span: Object.freeze({ lon: 0.012, lat: 0.009 }),
    grid: Object.freeze({ lon: 0.0045, lat: 0.0035 }) }),
});
export const DETAIL_SPAN = DETAIL_TIERS.detail.span;
export const DETAIL_GRID = DETAIL_TIERS.detail.grid;

const STABLE_CHECKS = 2;
const PREFETCH_NEIGHBOURS = Object.freeze([[1, 0], [-1, 0], [0, 1], [0, -1]]);

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

function quantize(value, origin, step) {
  return origin + Math.round((value - origin) / step) * step;
}

export function detailCellFor(lon, lat, region, tier = 'detail') {
  const spec = DETAIL_TIERS[tier] || DETAIL_TIERS.detail;
  const halfLon = spec.span.lon / 2;
  const halfLat = spec.span.lat / 2;
  const centerLon = clamp(quantize(lon, region.west, spec.grid.lon),
    region.west + halfLon, region.east - halfLon);
  const centerLat = clamp(quantize(lat, region.south, spec.grid.lat),
    region.south + halfLat, region.north - halfLat);
  const bounds = {
    west: centerLon - halfLon, east: centerLon + halfLon,
    south: centerLat - halfLat, north: centerLat + halfLat,
  };
  return {
    tier, lon: centerLon, lat: centerLat, bounds,
    key: `${tier}:${centerLon.toFixed(4)},${centerLat.toFixed(4)}`,
  };
}

export function cellContainsPose(cell, pose, inset = 0) {
  const b = cell.bounds;
  const dx = (b.east - b.west) * inset;
  const dy = (b.north - b.south) * inset;
  return pose.lon >= b.west + dx && pose.lon <= b.east - dx
    && pose.lat >= b.south + dy && pose.lat <= b.north - dy;
}

// At steep angles the orbit target is far beyond the foreground the viewer
// is inspecting. Sample lower in the visible ground footprint, rather than
// choosing both the tile and its detail solely from that distant target.
export function imageryFocus(pose, projection) {
  const pitch = Math.min(85, Math.max(0, pose.pitch || 0));
  const weight = Math.min(1, Math.max(0, (pitch - 25) / 35));
  if (!weight) return pose;
  const rad = Math.PI / 180;
  const lowerPitch = pitch - (pose.fov || 40) * 0.25 * weight;
  const height = pose.dist * Math.cos(pitch * rad);
  const offset = pose.dist * Math.sin(pitch * rad) - height * Math.tan(lowerPitch * rad);
  const bearing = (pose.bearing || 0) * rad;
  return { ...pose,
    lon: pose.lon - Math.sin(bearing) * offset / projection.metersPerDegLon,
    lat: pose.lat - Math.cos(bearing) * offset / projection.metersPerDegLat,
    dist: height / Math.cos(lowerPitch * rad),
  };
}

export function imageryTierFor(distanceM, mode = 'standard') {
  if (distanceM > DETAIL_DISTANCE_M) return null;
  if (mode !== 'data' && distanceM <= INSPECTION_DISTANCE_M) return 'inspection';
  if (mode !== 'data' && distanceM <= ROOFTOP_DISTANCE_M) return 'rooftop';
  if (mode !== 'data' && distanceM <= ULTRA_DISTANCE_M) return 'ultra';
  return 'detail';
}

export function detailImageSize(viewWidth, pixelRatio, quality,
  mode = 'standard', tier = 'detail') {
  if (mode === 'data') return 2048;
  if (mode === 'maximum') return 4096;
  const screenWidth = viewWidth * Math.min(pixelRatio || 1, 2);
  if (quality === 'performance' || screenWidth < 1200) return 2048;
  return tier === 'ultra' ? 2048 : 4096;
}

export function detailUrl(cell, size) {
  const query = new URLSearchParams({
    tier: cell.tier || 'detail', lon: cell.lon.toFixed(4),
    lat: cell.lat.toFixed(4), size: String(size),
  });
  return `detail-imagery?${query}&v=pan5`;
}

export function detailResolutionM(cell, size, projection) {
  const widthM = (cell.bounds.east - cell.bounds.west) * projection.metersPerDegLon;
  const heightM = (cell.bounds.north - cell.bounds.south) * projection.metersPerDegLat;
  const imageHeight = Math.round(size * (cell.bounds.north - cell.bounds.south)
    / (cell.bounds.east - cell.bounds.west));
  return Math.max(widthM / size, heightM / imageHeight);
}

export function neighbourCells(cell, region) {
  const spec = DETAIL_TIERS[cell.tier] || DETAIL_TIERS.detail;
  const seen = new Set([cell.key]);
  const cells = [];
  for (const [dx, dy] of PREFETCH_NEIGHBOURS) {
    const next = detailCellFor(cell.lon + dx * spec.grid.lon,
      cell.lat + dy * spec.grid.lat, region, cell.tier);
    if (!seen.has(next.key)) {
      seen.add(next.key);
      cells.push(next);
    }
  }
  return cells;
}

async function loadImage(path, signal) {
  const response = await fetch(path, { credentials: 'same-origin', signal });
  if (!response.ok) throw new Error('detail imagery unavailable');
  const source = response.headers.get('X-Imagery-Source') || 'USDA / USGS The National Map';
  const objectUrl = URL.createObjectURL(await response.blob());
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return { image, source };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function createImageryDetail(options) {
  const { terrain: initialTerrain, region, projection, onStatus = () => {} } = options;
  const imageLoader = options.loadImage || loadImage;
  let terrain = initialTerrain;
  let candidateKey = '';
  let stableChecks = 0;
  let pendingKey = '';
  let current = null;
  let failedKey = '';
  let failedAt = 0;
  let generation = 0;
  let state = 'regional';
  let pendingController = null;
  let pendingSize = 0;
  let pendingCellKey = '';
  let pendingCell = null;
  const previews = new Map();

  const report = (nextState) => {
    state = nextState;
    onStatus(api.stats());
  };

  function cancelPending() {
    if (!pendingController) return;
    generation += 1;
    pendingController.abort();
    pendingController = null;
    pendingKey = '';
    pendingCellKey = '';
    pendingCell = null;
    pendingSize = 0;
  }

  const api = {
    consider(pose, enabled, viewWidth, pixelRatio, quality, mode = 'standard') {
      const tier = enabled ? imageryTierFor(pose.dist, mode) : null;
      terrain.setDetailActive(!!tier && !!current);
      if (!tier) {
        cancelPending();
        candidateKey = '';
        stableChecks = 0;
        if (state !== 'regional') report('regional');
        return;
      }

      // Keep a useful in-flight tile instead of canceling at every small grid
      // boundary crossed while panning. Current tiles have a tighter margin so
      // the next preview starts before the old coverage leaves the screen.
      const cell = pendingCell?.tier === tier && cellContainsPose(pendingCell, pose, 0.08)
        ? pendingCell : current?.cell.tier === tier && cellContainsPose(current.cell, pose, 0.22)
          ? current.cell : detailCellFor(pose.lon, pose.lat, region, tier);
      const targetSize = detailImageSize(viewWidth, pixelRatio, quality, mode, tier);
      // Resolve visible detail quickly, then refine the same cell. Do not spend
      // bandwidth on four neighbouring exports while the user is waiting.
      const preview = mode !== 'data' && current?.cell.key !== cell.key;
      const size = preview ? 1024 : targetSize;
      const key = `${cell.key},${size}`;
      if (pendingKey && pendingKey !== key) cancelPending();
      if (current?.key === key) {
        terrain.setDetailActive(true);
        if (state !== 'active') report('active');
        return;
      }
      if (pendingKey === key) return;
      if (failedKey === key && Date.now() - failedAt < 60000) return;
      if (failedKey === key) failedKey = '';
      if (candidateKey !== key) {
        candidateKey = key;
        stableChecks = 1;
        return;
      }
      stableChecks += 1;
      if (stableChecks < STABLE_CHECKS) return;

      pendingKey = key;
      pendingCellKey = cell.key;
      pendingCell = cell;
      pendingSize = size;
      pendingController = new AbortController();
      const requestGeneration = ++generation;
      report('loading');
      const cached = previews.get(key);
      const loading = cached ? Promise.resolve(cached)
        : imageLoader(detailUrl(cell, size), pendingController.signal);
      loading.then(({ image, source }) => {
        if (requestGeneration !== generation) return;
        if (size === 1024) {
          previews.delete(key);
          previews.set(key, { image, source });
          if (previews.size > 8) previews.delete(previews.keys().next().value);
        }
        current = { key, cell, size, image, source,
          resolutionM: detailResolutionM(cell, size, projection) };
        pendingKey = '';
        pendingController = null;
        pendingSize = 0;
        pendingCellKey = '';
        pendingCell = null;
        failedKey = '';
        failedAt = 0;
        terrain.setDetailImagery(image, cell.bounds, region);
        terrain.setDetailActive(true);
        report('active');

      }).catch(() => {
        if (requestGeneration !== generation) return;
        pendingKey = '';
        pendingController = null;
        pendingSize = 0;
        pendingCellKey = '';
        pendingCell = null;
        failedKey = key;
        failedAt = Date.now();
        report('unavailable');
      });
    },

    tick(dt) { terrain.tickDetailTransition?.(dt); },

    attachTerrain(nextTerrain) {
      terrain = nextTerrain;
      if (current) terrain.setDetailImagery(current.image, current.cell.bounds, region, true);
      terrain.setDetailActive(state === 'active' && !!current);
    },

    stats() {
      return {
        state, active: state === 'active', tier: current?.cell.tier || null,
        size: current?.size || 0, source: current?.source || null,
        resolutionM: current ? Math.round(current.resolutionM * 100) / 100 : null,
        bounds: current?.cell.bounds || null, pendingSize,
        refining: state === 'loading' && pendingCellKey === current?.cell.key,
      };
    },

    retry() { failedKey = ''; failedAt = 0; },

    dispose() {
      generation += 1;
      cancelPending();
      pendingKey = '';
      current = null;
      previews.clear();
      terrain.setDetailActive(false);
    },
  };

  return api;
}
