/**
 * Projected map labels.
 *
 * Labels are real DOM, not canvas text: they stay crisp at any pixel ratio,
 * they can be styled per theme from CSS, and they are selectable and
 * inspectable. A pooled set of nodes is reused every update so the label layer
 * never thrashes the DOM.
 *
 * Placement is greedy by priority with rectangle collision, plus a terrain
 * occlusion test so a name never floats over the ridge that is hiding it.
 */

import { clamp } from './geo.js?v=philly-2026090611';

const MAX_NODES = 90;

export function createLabelLayer(THREE, options) {
  const { container, projection, sampleElevation, onSelect } = options;

  const root = document.createElement('div');
  root.className = 'map-labels';
  root.setAttribute('aria-hidden', 'true');
  container.appendChild(root);

  const pool = [];
  const candidates = [];
  // Real rendered widths, learned the first time each label is drawn. The
  // estimate below is only ever used for a name that has never been on screen.
  const measured = new Map();
  const projected = new THREE.Vector3();
  const rayPoint = new THREE.Vector3();

  function makeNode() {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'map-label';
    // Reachable by pointer, deliberately out of the tab order: the accessible
    // route to every one of these places is the search panel, which stays in a
    // stable order instead of reshuffling as the camera moves.
    el.tabIndex = -1;
    el.style.display = 'none';
    el.addEventListener('click', () => {
      const data = el._data;
      if (data && onSelect) onSelect(data);
    });
    root.appendChild(el);
    pool.push(el);
    return el;
  }

  return {
    root,

    /** Replace the label set. Each entry needs name, lon, lat, rank, kind. */
    setCandidates(list) {
      candidates.length = 0;
      for (const item of list) {
        if (!item || !Number.isFinite(item.lon) || !Number.isFinite(item.lat)) continue;
        if (!projection.contains(item.lon, item.lat)) continue;
        candidates.push({
          ...item,
          x: projection.lonToX(item.lon),
          z: projection.latToZ(item.lat),
          elev: sampleElevation(item.lon, item.lat),
        });
      }
      // Stable priority order once, so the per-frame pass is a linear scan.
      candidates.sort((a, b) => (a.rank - b.rank) || (b.pop || 0) - (a.pop || 0));
    },

    setVisible(on) {
      root.style.display = on ? '' : 'none';
    },

    /**
     * Reposition every label for the current camera.
     * Called at a reduced rate; nothing here mutates scene state.
     */
    update(camera, ctx) {
      const { width, height, exaggeration, density, size, showPlaces, showLandmarks } = ctx;
      if (!width || !height) return 0;

      const placed = [];
      const budget = Math.round(6 + density * (MAX_NODES - 6));
      // Density also gates *which* ranks are eligible, so turning it down
      // thins the map by importance rather than by whatever happens to fit.
      const rankCutoff = 1 + density * 3.4;
      const scale = size;

      let used = 0;
      for (const item of candidates) {
        if (used >= budget) break;
        if (item.rank > rankCutoff) continue;
        if (item.kind === 'landmark' ? !showLandmarks : !showPlaces) continue;

        projected.set(item.x, item.elev * exaggeration, item.z);
        const worldY = projected.y;
        projected.project(camera);
        if (projected.z > 1 || projected.z < -1) continue;

        const sx = (projected.x * 0.5 + 0.5) * width;
        const sy = (-projected.y * 0.5 + 0.5) * height;

        // Landmark labels are uppercase and letter-spaced, so they run far
        // wider per character than a place name at the same length. Guessing a
        // single rate for both truncated names at the frame edge on a phone.
        const key = `${item.kind}:${item.name}`;
        const perChar = item.kind === 'landmark' ? 8.8 : 6.8;
        const w = (measured.get(key) ?? (10 + item.name.length * perChar)) * scale;
        const h = 20 * scale;
        const box = { l: sx - w / 2, r: sx + w / 2, t: sy - h, b: sy + 4 };

        // Drop anything that would run off an edge rather than clipping it.
        if (box.l < 6 || box.r > width - 6) continue;
        if (box.b < 0 || box.t > height) continue;

        if (isOccluded(camera, item, worldY, exaggeration)) continue;
        if (placed.some((p) => overlaps(p, box))) continue;
        placed.push(box);

        const el = pool[used] || makeNode();
        if (el._name !== item.name || el._kind !== item.kind) {
          el.textContent = item.name;
          el._name = item.name;
          el._kind = item.kind;
          el.dataset.kind = item.kind;
          el.dataset.category = item.category || '';
          el.title = item.note || item.name;
        }
        el._data = item;
        el.style.display = '';
        // The trailing translate centres the node on its anchor and lifts the
        // text above it, making the rendered box the same box the declutter
        // and edge culling reason about. Without it the node's left edge sat
        // at the anchor and every label rendered half a width to the right of
        // its own collision model.
        el.style.transform = `translate3d(${Math.round(sx)}px, ${Math.round(sy)}px, 0) `
          + 'translate(-50%, -100%)';
        el.style.setProperty('--label-scale', String(scale));
        el.style.opacity = String(clamp(1.15 - item.rank * 0.08, 0.55, 1));

        // Learn this label's true width once, so every later frame declutters
        // and edge-culls against the real thing rather than an estimate.
        if (!measured.has(key)) {
          const real = el.offsetWidth;
          if (real > 0) measured.set(key, real / scale);
        }
        used += 1;
      }

      for (let i = used; i < pool.length; i += 1) {
        if (pool[i].style.display !== 'none') pool[i].style.display = 'none';
      }
      return used;
    },

    dispose() {
      root.remove();
      pool.length = 0;
    },
  };

  /**
   * March the segment from the label to the camera and reject the label if the
   * ground rises above it anywhere along the way. Sixteen samples is enough at
   * this scale, and the 0.06..0.92 span skips the ends where the ray is
   * necessarily at ground level.
   */
  function isOccluded(camera, item, worldY, exaggeration) {
    const cam = camera.position;
    const dx = cam.x - item.x;
    const dy = cam.y - worldY;
    const dz = cam.z - item.z;
    const STEPS = 16;
    for (let i = 1; i <= STEPS; i += 1) {
      const t = 0.06 + (i / STEPS) * 0.86;
      rayPoint.set(item.x + dx * t, worldY + dy * t, item.z + dz * t);
      const lon = projection.xToLon(rayPoint.x);
      const lat = projection.zToLat(rayPoint.z);
      if (!projection.contains(lon, lat)) continue;
      const ground = sampleElevation(lon, lat) * exaggeration;
      // A small bias keeps gently-rising ground in front of a label from
      // flickering it in and out.
      if (ground > rayPoint.y + 8) return true;
    }
    return false;
  }
}

function overlaps(a, b) {
  return !(a.r < b.l || a.l > b.r || a.b < b.t || a.t > b.b);
}

/**
 * Merge the OSM place nodes and the curated landmarks into one candidate list.
 * Landmarks win ties at equal rank because they carry authored notes.
 */
export function buildLabelCandidates(placesGeojson, landmarksDoc) {
  const out = [];
  // A curated landmark replaces the OSM place node of the same name outright.
  // Twenty names exist in both sets; without this the two candidates race in
  // the collision pass, and whichever wins at one zoom loses at another.
  const curated = new Set(
    (landmarksDoc?.landmarks || []).map((l) => l.n.toLowerCase()));
  for (const feature of placesGeojson?.features || []) {
    const p = feature.properties || {};
    const [lon, lat] = feature.geometry?.coordinates || [];
    if (!p.n) continue;
    if (curated.has(p.n.toLowerCase())) continue;
    out.push({
      name: p.n,
      lon,
      lat,
      rank: (p.rank ?? 3) + 0.5,
      pop: p.pop || 0,
      kind: 'place',
      category: p.k || 'place',
    });
  }
  for (const l of landmarksDoc?.landmarks || []) {
    out.push({
      name: l.n,
      lon: l.lon,
      lat: l.lat,
      rank: l.r ?? 2,
      pop: 0,
      kind: 'landmark',
      category: l.c || 'civic',
      note: l.d || '',
    });
  }
  return out;
}
