/**
 * Close-range aerial imagery loader.
 *
 * A 94 km region at building resolution would be several gigabytes. Instead,
 * the bundled regional texture appears immediately and this module asks the
 * same-origin Pages Function for one overlapping 8 km detail window whenever
 * the camera settles below the close-range threshold. The coarse texture is
 * always retained as the failure/offline fallback.
 */

export const DETAIL_DISTANCE_M = 16000;
export const DETAIL_SPAN = Object.freeze({ lon: 0.096, lat: 0.072 });
export const DETAIL_GRID = Object.freeze({ lon: 0.04, lat: 0.03 });

const STABLE_CHECKS = 2;

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

function quantize(value, origin, step) {
  return origin + Math.round((value - origin) / step) * step;
}

export function detailCellFor(lon, lat, region) {
  const halfLon = DETAIL_SPAN.lon / 2;
  const halfLat = DETAIL_SPAN.lat / 2;
  const centerLon = clamp(
    quantize(lon, region.west, DETAIL_GRID.lon),
    region.west + halfLon,
    region.east - halfLon,
  );
  const centerLat = clamp(
    quantize(lat, region.south, DETAIL_GRID.lat),
    region.south + halfLat,
    region.north - halfLat,
  );
  const bounds = {
    west: centerLon - halfLon,
    east: centerLon + halfLon,
    south: centerLat - halfLat,
    north: centerLat + halfLat,
  };
  return {
    lon: centerLon,
    lat: centerLat,
    bounds,
    key: `${centerLon.toFixed(4)},${centerLat.toFixed(4)}`,
  };
}

export function detailImageSize(viewWidth, pixelRatio, quality) {
  const screenWidth = viewWidth * Math.min(pixelRatio || 1, 2);
  return quality === 'performance' || screenWidth < 1200 ? 2048 : 4096;
}

export function detailUrl(cell, size) {
  const query = new URLSearchParams({
    lon: cell.lon.toFixed(4),
    lat: cell.lat.toFixed(4),
    size: String(size),
  });
  return `detail-imagery?${query}`;
}

export function detailResolutionM(cell, size, projection) {
  const widthM = (cell.bounds.east - cell.bounds.west) * projection.metersPerDegLon;
  const heightM = (cell.bounds.north - cell.bounds.south) * projection.metersPerDegLat;
  return Math.max(widthM, heightM) / size;
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

  const report = (nextState) => {
    state = nextState;
    onStatus(api.stats());
  };

  const api = {
    consider(pose, enabled, viewWidth, pixelRatio, quality) {
      const close = enabled && pose.dist <= DETAIL_DISTANCE_M;
      terrain.setDetailActive(close && !!current);
      if (!close) {
        candidateKey = '';
        stableChecks = 0;
        if (state !== 'regional') report('regional');
        return;
      }

      const cell = detailCellFor(pose.lon, pose.lat, region);
      const size = detailImageSize(viewWidth, pixelRatio, quality);
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
        current = {
          key,
          cell,
          size,
          image,
          resolutionM: detailResolutionM(cell, size, projection),
        };
        pendingKey = '';
        failedKey = '';
        failedAt = 0;
        terrain.setDetailImagery(image, cell.bounds, region);
        terrain.setDetailActive(true);
        report('active');
      }).catch(() => {
        if (requestGeneration !== generation) return;
        pendingKey = '';
        failedKey = key;
        failedAt = Date.now();
        report('unavailable');
      });
    },

    attachTerrain(nextTerrain) {
      terrain = nextTerrain;
      if (current) terrain.setDetailImagery(current.image, current.cell.bounds, region);
      terrain.setDetailActive(state === 'active' && !!current);
    },

    stats() {
      return {
        state,
        active: state === 'active',
        size: current?.size || 0,
        resolutionM: current ? Math.round(current.resolutionM * 100) / 100 : null,
        bounds: current?.cell.bounds || null,
      };
    },

    retry() {
      failedKey = '';
      failedAt = 0;
    },

    dispose() {
      generation += 1;
      pendingKey = '';
      current = null;
      terrain.setDetailActive(false);
    },
  };

  return api;
}
