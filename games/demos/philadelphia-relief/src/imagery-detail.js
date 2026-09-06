/**
 * Camera-following aerial imagery levels.
 *
 * The regional texture is always available immediately. A city-detail cell
 * replaces it below 16 km, a smaller source-resolution block cell replaces
 * that below 4.8 km, and a camera-following roof cell takes over for the final
 * useful descent. The camera quality floor prevents magnifying the delivered
 * source beyond roughly one imagery sample per screen pixel. Cells overlap,
 * cross-fade in the terrain shader and are prefetched into the browser/edge
 * cache after the camera settles.
 */

export const DETAIL_DISTANCE_M = 16000;
export const ULTRA_DISTANCE_M = 4800;
export const ROOFTOP_DISTANCE_M = 1600;
export const IMAGERY_DETAIL_MODES = Object.freeze(['data', 'standard', 'maximum']);
export const DETAIL_TIERS = Object.freeze({
  detail: Object.freeze({ span: Object.freeze({ lon: 0.096, lat: 0.072 }),
    grid: Object.freeze({ lon: 0.04, lat: 0.03 }) }),
  ultra: Object.freeze({ span: Object.freeze({ lon: 0.032, lat: 0.024 }),
    grid: Object.freeze({ lon: 0.012, lat: 0.009 }) }),
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

export function imageryTierFor(distanceM, mode = 'standard') {
  if (distanceM > DETAIL_DISTANCE_M) return null;
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
  return `detail-imagery?${query}&v=aligned2`;
}

export function detailResolutionM(cell, size, projection) {
  const widthM = (cell.bounds.east - cell.bounds.west) * projection.metersPerDegLon;
  const heightM = (cell.bounds.north - cell.bounds.south) * projection.metersPerDegLat;
  return Math.max(widthM, heightM) / size;
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

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('detail image failed to decode'));
    image.src = path;
  });
}

export function createImageryDetail(options) {
  const { terrain: initialTerrain, region, projection, onStatus = () => {} } = options;
  let terrain = initialTerrain;
  let candidateKey = '';
  let stableChecks = 0;
  let pendingKey = '';
  let current = null;
  let failedKey = '';
  let failedAt = 0;
  let generation = 0;
  let state = 'regional';
  let prefetched = 0;
  let prefetchTimer = 0;
  let prefetchIdle = 0;
  let prefetchGeneration = 0;

  const report = (nextState) => {
    state = nextState;
    onStatus(api.stats());
  };

  function prefetch(cell, size, mode) {
    if (mode === 'data' || typeof fetch !== 'function') return;
    const requestGeneration = ++prefetchGeneration;
    const run = () => {
      prefetchIdle = 0;
      if (requestGeneration !== prefetchGeneration) return;
      for (const next of neighbourCells(cell, region)) {
        fetch(detailUrl(next, size), { cache: 'force-cache', credentials: 'same-origin' })
          .then((response) => { if (response.ok) prefetched += 1; })
          .catch(() => {});
      }
    };
    // Neighbour cells are speculative. Let the visible tile decode and the
    // opening interaction settle before spending bandwidth and image memory;
    // moving to another cell invalidates this job before it starts.
    clearTimeout(prefetchTimer);
    if (prefetchIdle && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(prefetchIdle);
      prefetchIdle = 0;
    }
    prefetchTimer = setTimeout(() => {
      prefetchTimer = 0;
      if (requestGeneration !== prefetchGeneration) return;
      if (typeof requestIdleCallback === 'function') {
        prefetchIdle = requestIdleCallback(run, { timeout: 5000 });
      } else {
        run();
      }
    }, 6000);
  }

  const api = {
    consider(pose, enabled, viewWidth, pixelRatio, quality, mode = 'standard') {
      const tier = enabled ? imageryTierFor(pose.dist, mode) : null;
      terrain.setDetailActive(!!tier && !!current);
      if (!tier) {
        candidateKey = '';
        stableChecks = 0;
        if (state !== 'regional') report('regional');
        return;
      }

      const cell = detailCellFor(pose.lon, pose.lat, region, tier);
      const size = detailImageSize(viewWidth, pixelRatio, quality, mode, tier);
      const key = `${cell.key},${size}`;
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
      const requestGeneration = ++generation;
      report('loading');
      loadImage(detailUrl(cell, size)).then((image) => {
        if (requestGeneration !== generation) return;
        current = { key, cell, size, image,
          resolutionM: detailResolutionM(cell, size, projection) };
        pendingKey = '';
        failedKey = '';
        failedAt = 0;
        terrain.setDetailImagery(image, cell.bounds, region);
        terrain.setDetailActive(true);
        report('active');
        prefetch(cell, size, mode);
      }).catch(() => {
        if (requestGeneration !== generation) return;
        pendingKey = '';
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
        size: current?.size || 0,
        resolutionM: current ? Math.round(current.resolutionM * 100) / 100 : null,
        bounds: current?.cell.bounds || null, prefetched,
      };
    },

    retry() { failedKey = ''; failedAt = 0; },

    dispose() {
      generation += 1;
      prefetchGeneration += 1;
      clearTimeout(prefetchTimer);
      if (prefetchIdle && typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(prefetchIdle);
      }
      pendingKey = '';
      current = null;
      terrain.setDetailActive(false);
    },
  };

  return api;
}
