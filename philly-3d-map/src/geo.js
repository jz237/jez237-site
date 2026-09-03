/**
 * Projection, sampling and formatting maths.
 *
 * The scene uses a local equirectangular projection anchored at the centre of
 * the region. Across ~94 km that departs from a conformal projection by well
 * under one terrain sample, so it buys exact, trivially invertible round-trips
 * between lon/lat and world metres for the readout and the search box.
 *
 * World axes follow three.js conventions: +X east, +Y up, -Z north.
 *
 * Pure module — imported by the Node tests, so no DOM and no WebGL here.
 */

const EARTH_CIRCUMFERENCE = 40075016.686;

/**
 * @param {object} meta terrain.json
 */
export function createProjection(meta) {
  const b = meta.bounds;
  const p = meta.projection;
  const mLon = p.metersPerDegLon;
  const mLat = p.metersPerDegLat;
  const lon0 = p.lon0;
  const lat0 = p.lat0;

  const widthM = (b.east - b.west) * mLon;
  const heightM = (b.north - b.south) * mLat;

  return {
    bounds: b,
    widthM,
    heightM,
    lat0,
    lon0,
    metersPerDegLon: mLon,
    metersPerDegLat: mLat,

    lonToX: (lon) => (lon - lon0) * mLon,
    latToZ: (lat) => (lat0 - lat) * mLat,
    xToLon: (x) => lon0 + x / mLon,
    zToLat: (z) => lat0 - z / mLat,

    /** Clamp a coordinate into the region, so the camera cannot wander off. */
    clamp(lon, lat) {
      return {
        lon: Math.min(b.east, Math.max(b.west, lon)),
        lat: Math.min(b.north, Math.max(b.south, lat)),
      };
    },

    contains(lon, lat) {
      return lon >= b.west && lon <= b.east && lat >= b.south && lat <= b.north;
    },

    /**
     * Continuous grid coordinates. Row 0 is the NORTH edge, matching the
     * heightmap image's row order.
     */
    toGrid(lon, lat, w, h) {
      return {
        gx: ((lon - b.west) / (b.east - b.west)) * (w - 1),
        gy: ((b.north - lat) / (b.north - b.south)) * (h - 1),
      };
    },
  };
}

/**
 * Bilinear elevation sampler over a row-major grid whose row 0 is the north
 * edge. Returns metres, clamping at the region edge rather than returning NaN
 * so the readout stays usable when the pointer leaves the map.
 *
 * @param {ArrayLike<number>} grid elevations in metres
 */
export function createElevationSampler(grid, width, height, projection) {
  return function sample(lon, lat) {
    const { gx, gy } = projection.toGrid(lon, lat, width, height);
    const cx = Math.min(width - 1, Math.max(0, gx));
    const cy = Math.min(height - 1, Math.max(0, gy));
    const x0 = Math.floor(cx);
    const y0 = Math.floor(cy);
    const x1 = Math.min(width - 1, x0 + 1);
    const y1 = Math.min(height - 1, y0 + 1);
    const fx = cx - x0;
    const fy = cy - y0;
    const a = grid[y0 * width + x0];
    const b = grid[y0 * width + x1];
    const c = grid[y1 * width + x0];
    const d = grid[y1 * width + x1];
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  };
}

/** Ground metres covered by one screen pixel, for the scale bar. */
export function metersPerPixel(distanceM, fovDeg, viewportHeightPx) {
  if (!(viewportHeightPx > 0)) return 0;
  return (2 * Math.tan((fovDeg * Math.PI) / 360) * distanceM) / viewportHeightPx;
}

/** The web-mercator zoom level that would show the same ground scale. */
export function equivalentZoom(mPerPx, lat) {
  if (!(mPerPx > 0)) return 0;
  const groundPerTilePx = (EARTH_CIRCUMFERENCE * Math.cos((lat * Math.PI) / 180)) / 256;
  return Math.log2(groundPerTilePx / mPerPx);
}

/** Pick a round scale-bar length (1/2/5 x 10^n) that fits `maxPx`. */
export function scaleBar(mPerPx, maxPx) {
  const targetM = mPerPx * maxPx;
  if (!(targetM > 0)) return { meters: 0, pixels: 0, label: '' };
  const pow = Math.pow(10, Math.floor(Math.log10(targetM)));
  let meters = pow;
  for (const mult of [1, 2, 5, 10]) {
    if (pow * mult <= targetM) meters = pow * mult;
  }
  const label = meters >= 1000 ? `${meters / 1000} km` : `${meters} m`;
  return { meters, pixels: meters / mPerPx, label };
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/** Compass point for a bearing in degrees (0 = north, clockwise). */
export function compassPoint(bearingDeg) {
  const b = ((bearingDeg % 360) + 360) % 360;
  return COMPASS[Math.round(b / 22.5) % 16];
}

/** "39.9526 N, 75.1635 W" — signed decimals are ambiguous at a glance. */
export function formatLatLon(lat, lon, digits = 4) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(digits)}° ${ns}, ${Math.abs(lon).toFixed(digits)}° ${ew}`;
}

/**
 * Normalise a bearing into [0, 360) and pick the shorter of the two arcs when
 * interpolating, so a preset transition never spins the long way round.
 */
export function normalizeAngle(deg) {
  return ((deg % 360) + 360) % 360;
}

export function shortestAngleDelta(from, to) {
  let d = normalizeAngle(to) - normalizeAngle(from);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export function lerpAngle(from, to, t) {
  return normalizeAngle(from + shortestAngleDelta(from, to) * t);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/** Smooth, symmetric easing used for every camera move in the app. */
export function easeInOutCubic(t) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Frame-rate independent exponential smoothing.
 * `halfLife` is the time in seconds for the gap to halve.
 */
export function damp(current, target, halfLife, dt) {
  if (halfLife <= 0) return target;
  return target + (current - target) * Math.pow(2, -dt / halfLife);
}
