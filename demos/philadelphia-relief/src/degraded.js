/**
 * Degraded-mode policy.
 *
 * The app ships every byte it needs from its own origin, so a failure here
 * means the network or the host is broken rather than a third party being
 * down. Either way the rule is the same: never show a blank canvas. Decide
 * what can still be drawn, say plainly what is missing, and carry on.
 *
 * Pure module — the tests drive it with synthetic load results.
 */

/** Everything the app fetches, and what it costs us to lose. */
export const ASSETS = [
  { id: 'terrain', path: 'data/terrain.json', kind: 'meta', required: true,
    label: 'terrain metadata' },
  { id: 'heightmap', path: 'data/heightmap.webp', kind: 'image', required: true,
    label: 'elevation heightmap' },
  { id: 'imagery', path: 'data/imagery.webp?v=aligned2', kind: 'image', layer: 'imagery',
    label: 'aerial imagery' },
  { id: 'cityImagery', path: 'data/imagery-city.webp?v=aligned2', kind: 'image', supplemental: true,
    label: 'city aerial imagery' },
  { id: 'reefImagery', path: 'data/imagery-levittown.webp', kind: 'image', supplemental: true,
    label: 'Levittown aerial imagery' },
  { id: 'water', path: 'data/water.geojson', kind: 'geojson', layer: 'water',
    label: 'waterways' },
  { id: 'parks', path: 'data/parks.geojson', kind: 'geojson', layer: 'parks',
    label: 'parks' },
  { id: 'roads', path: 'data/roads.geojson?v=streets-2026090602', kind: 'geojson', layer: 'roads',
    label: 'roads' },
  { id: 'rail', path: 'data/rail.geojson', kind: 'geojson', layer: 'rail',
    label: 'rail' },
  { id: 'boundaries', path: 'data/boundaries.geojson', kind: 'geojson',
    layer: 'boundaries', label: 'boundaries' },
  { id: 'places', path: 'data/places.geojson', kind: 'geojson', layer: 'places',
    label: 'place labels' },
  { id: 'landmarks', path: 'data/landmarks.json?v=bauder1', kind: 'json', layer: 'landmarks',
    label: 'landmarks' },
  { id: 'structures', path: 'data/structures/buildings.json', kind: 'manifest',
    layer: 'structures', label: 'buildings and bridges' },
];

export const MODE = {
  FULL: 'full',
  PARTIAL: 'partial',
  RELIEF_ONLY: 'relief-only',
  FALLBACK: 'fallback',
};

/**
 * Decide the running mode from a map of asset id -> boolean (loaded ok).
 *
 * - Both required assets present, nothing else missing  -> full
 * - Required present, some overlays missing             -> partial
 * - Required present, every overlay missing             -> relief-only
 * - A required asset missing                            -> fallback
 */
export function assess(results) {
  const missing = [];
  const disableLayers = [];
  let requiredMissing = false;

  for (const asset of ASSETS) {
    if (asset.supplemental) continue;
    const ok = !!results?.[asset.id];
    if (ok) continue;
    missing.push(asset);
    if (asset.required) requiredMissing = true;
    else if (asset.layer) disableLayers.push(asset.layer);
  }

  const overlayCount = ASSETS.filter((a) => !a.required && !a.supplemental).length;

  if (requiredMissing) {
    return {
      mode: MODE.FALLBACK,
      missing: missing.map((a) => a.id),
      disableLayers: ASSETS.filter((a) => a.layer).map((a) => a.layer),
      title: 'Elevation data unavailable',
      message:
        'The terrain heightmap could not be loaded, so this is a synthetic ' +
        'stand-in surface, not the real Philadelphia region. Every control ' +
        'still works; the shape of the ground does not mean anything. ' +
        'Reload to try again.',
      usable: true,
      trustworthy: false,
    };
  }

  if (disableLayers.length === overlayCount) {
    return {
      mode: MODE.RELIEF_ONLY,
      missing: missing.map((a) => a.id),
      disableLayers,
      title: 'Overlays unavailable',
      message:
        'The elevation model loaded, so the relief, hillshade and contours are ' +
        'real. None of the map overlays could be fetched, so there are no ' +
        'rivers, roads or labels on top of it.',
      usable: true,
      trustworthy: true,
    };
  }

  if (missing.length) {
    const names = missing.map((a) => a.label);
    return {
      mode: MODE.PARTIAL,
      missing: missing.map((a) => a.id),
      disableLayers,
      title: 'Some layers unavailable',
      message:
        `The terrain is intact. These overlays could not be loaded and their ` +
        `controls are switched off: ${formatList(names)}.`,
      usable: true,
      trustworthy: true,
    };
  }

  return {
    mode: MODE.FULL,
    missing: [],
    disableLayers: [],
    title: '',
    message: '',
    usable: true,
    trustworthy: true,
  };
}

/** "a, b and c" */
export function formatList(items) {
  const list = items.filter(Boolean);
  if (list.length <= 1) return list[0] || '';
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

/**
 * Message for a WebGL context that never came up or was lost. This is the one
 * failure the app genuinely cannot render around.
 */
export function webglFailure(reason) {
  return {
    mode: MODE.FALLBACK,
    missing: ['webgl'],
    disableLayers: [],
    title: '3D rendering unavailable',
    message:
      reason === 'lost'
        ? 'The graphics context was lost — usually the browser reclaiming GPU ' +
          'memory. Reload the page to restore the map.'
        : 'This browser could not start WebGL 2, which the terrain renderer ' +
          'needs. Try a current desktop browser, or enable hardware ' +
          'acceleration if it is switched off.',
    usable: false,
    trustworthy: false,
  };
}

/**
 * A stand-in elevation grid used when the real heightmap is missing.
 *
 * Deliberately smooth and obviously generic: it keeps the camera, controls and
 * layout explorable so the failure is legible, and it is paired with a banner
 * that says outright the shape is not real terrain. Deterministic, so the
 * degraded path renders the same everywhere and can be asserted in tests.
 */
export function syntheticGrid(width, height) {
  const grid = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      // A couple of broad ridges and a diagonal valley; range roughly 0-180 m
      // so the exaggeration slider behaves like it does with real data.
      const ridge = Math.sin(u * 5.1 + 0.6) * Math.cos(v * 3.7 - 0.4);
      const swell = Math.sin((u + v) * 2.3) * 0.5;
      const valley = -Math.exp(-Math.pow((u - v) * 3.4, 2)) * 1.4;
      grid[y * width + x] = Math.max(0, (ridge + swell + valley + 1.6) * 55);
    }
  }
  return grid;
}
