/**
 * Structures layer — the pure half.
 *
 * Binary footprint parsing, extrusion into consolidated typed arrays, the
 * schematic bridge builder, and the LOD / budget policy. No THREE, no DOM, so
 * the Node tests can drive every one of these against real data files.
 *
 * Vertical model. Every vertex carries two heights that the shader combines:
 *
 *   y = aGround * uExag  +  (structural height) * uHScale
 *
 * `aGround` is the sampled DEM elevation under the structure, so a building
 * rides the terrain exactly like the road it stands on. The structural part
 * is scaled by `uHScale`, which the app sets to sqrt(exaggeration) times the
 * user's structure-height slider: towers stay proportionate to hills at the
 * regional shot without becoming needles up close.
 */

import { triangulate } from './vectors.js?v=philly-2026090612';

export const TIER_ORDER = ['tall', 'mid', 'low'];

/** Which tiers each quality mode fetches at all. Low = rowhouse fabric. */
export const TIER_PLAN = {
  performance: ['tall', 'mid'],
  balanced: ['tall', 'mid', 'low'],
  cinematic: ['tall', 'mid', 'low'],
};

/**
 * Distance (metres from the camera to the zone) inside which a tier grows in.
 * Scaled by the detail slider and the quality mode at runtime.
 */
export const TIER_RANGE_M = { tall: 140000, mid: 42000, low: 15000 };

const QUALITY_RANGE_MUL = { performance: 0.6, balanced: 1.0, cinematic: 1.45 };
const QUALITY_BUDGET_MUL = { performance: 0.7, balanced: 1.0, cinematic: 1.0 };

const SOURCE_NAMES = ['measured', 'levels', 'default', 'curated', 'merged'];

// ---------------------------------------------------------------------------
// Binary tier format (see tools/build_structures.py)
// ---------------------------------------------------------------------------

/**
 * Parse one PHB1 or PHB2 tier stream. PHB1 is retained as a compatibility
 * fallback for browsers that cached the original building payload; PHB2 adds
 * the documented construction year used by the historical views.
 */
export function parseTier(buffer) {
  const view = new DataView(buffer);
  if (view.byteLength < 8) throw new Error('structures: tier stream too short');
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1),
    view.getUint8(2), view.getUint8(3));
  if (magic !== 'PHB1' && magic !== 'PHB2') {
    throw new Error(`structures: bad magic "${magic}"`);
  }
  const hasYear = magic === 'PHB2';

  const count = view.getUint32(4, true);
  const buildings = new Array(count);
  let offset = 8;
  for (let i = 0; i < count; i += 1) {
    const headerBytes = hasYear ? 10 : 8;
    if (offset + headerBytes > view.byteLength) {
      throw new Error('structures: truncated tier stream');
    }
    const n = view.getUint16(offset, true);
    const height = view.getUint16(offset + 2, true) / 10;
    const minHeight = view.getUint16(offset + 4, true) / 10;
    const source = SOURCE_NAMES[view.getUint8(offset + 6)] || 'default';
    const flags = view.getUint8(offset + 7);
    const named = (flags & 1) === 1;
    // Documented construction year (0 = undated) and where it came from.
    const year = hasYear ? view.getUint16(offset + 8, true) : 0;
    const yearSource = hasYear
      ? ((flags & 4) ? 'curated' : (flags & 2) ? 'osm' : 'none')
      : 'none';
    offset += headerBytes;
    if (n < 3 || offset + n * 4 > view.byteLength) {
      throw new Error(`structures: building ${i} has a bad ring (${n} vertices)`);
    }
    const poly = new Float32Array(n * 2);
    for (let k = 0; k < n; k += 1) {
      poly[k * 2] = view.getInt16(offset, true);
      poly[k * 2 + 1] = view.getInt16(offset + 2, true);
      offset += 4;
    }
    buildings[i] = { height, minHeight, source, named, poly, year, yearSource };
  }
  return { count, buildings, bytes: view.byteLength };
}

/**
 * Version structure payload URLs by their declared binary format. This keeps
 * a previously cached PHB1 response from being paired with the PHB2 parser
 * after an in-place static-site deployment.
 */
export function tierAssetPath(file, format = 'PHB1') {
  return `data/structures/${file}?format=${encodeURIComponent(format)}`;
}

// ---------------------------------------------------------------------------
// Extrusion
// ---------------------------------------------------------------------------

function ringArea(poly) {
  let a = 0;
  const n = poly.length / 2;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    a += poly[i * 2] * poly[j * 2 + 1] - poly[j * 2] * poly[i * 2 + 1];
  }
  return a / 2;
}

/**
 * Extrude a tier's footprints into one consolidated vertex set.
 *
 * Per building with n ring vertices: 2n vertices (a base ring and a roof ring),
 * 6n wall indices, 3(n-2) roof indices. Face normals are recovered from screen
 * derivatives in the shader, so no normal attribute is stored and walls can
 * share their ring vertices. About 400 bytes per rowhouse on the GPU.
 *
 * Buildings are packed in the order given (tallest first from the build), so
 * a draw-range prefix is always the skyline.
 */
export function extrudeBuildings(buildings, ctx) {
  const { originX, originZ, groundAt } = ctx;
  let vertCount = 0;
  let indexCount = 0;
  for (const b of buildings) {
    const n = b.poly.length / 2;
    vertCount += 2 * n;
    indexCount += 6 * n + 3 * (n - 2);
  }

  const position = new Float32Array(vertCount * 3);
  const ground = new Float32Array(vertCount);
  const facadeOrigin = new Float32Array(vertCount * 2);
  const info = new Float32Array(vertCount * 2);     // (height, minHeight)
  const year = new Float32Array(vertCount);         // documented year, 0 = undated
  const index = new Uint32Array(indexCount);
  const buildingEnd = new Uint32Array(buildings.length); // index count after each

  let v = 0;
  let i = 0;
  let written = 0;
  for (let bIdx = 0; bIdx < buildings.length; bIdx += 1) {
    const b = buildings[bIdx];
    const n = b.poly.length / 2;

    // Normalise winding so the roof triangulation and wall order are stable.
    const ccw = ringArea(b.poly) < 0;   // +z is south, so screen-CCW flips sign
    const ring = new Array(n);
    let cx = 0;
    let cz = 0;
    for (let k = 0; k < n; k += 1) {
      const src = ccw ? k : n - 1 - k;
      const x = b.poly[src * 2];
      const z = b.poly[src * 2 + 1];
      ring[k] = [x, z];
      cx += x;
      cz += z;
    }
    const g = groundAt(originX + cx / n, originZ + cz / n);

    const base = v;
    for (let k = 0; k < n; k += 1) {
      const [x, z] = ring[k];
      // base ring
      position[(base + k) * 3] = originX + x;
      position[(base + k) * 3 + 1] = 0;
      position[(base + k) * 3 + 2] = originZ + z;
      // roof ring
      position[(base + n + k) * 3] = originX + x;
      position[(base + n + k) * 3 + 1] = b.height;
      position[(base + n + k) * 3 + 2] = originZ + z;
      facadeOrigin.set([originX + cx / n, originZ + cz / n], (base + k) * 2);
      facadeOrigin.set([originX + cx / n, originZ + cz / n], (base + n + k) * 2);
      ground[base + k] = g;
      ground[base + n + k] = g;
      info[(base + k) * 2] = b.height;
      info[(base + k) * 2 + 1] = b.minHeight;
      info[(base + n + k) * 2] = b.height;
      info[(base + n + k) * 2 + 1] = b.minHeight;
      year[base + k] = b.year || 0;
      year[base + n + k] = b.year || 0;
    }
    for (let k = 0; k < n; k += 1) {
      const k2 = (k + 1) % n;
      const b0 = base + k;
      const b1 = base + k2;
      const t0 = base + n + k;
      const t1 = base + n + k2;
      index[i] = b0; index[i + 1] = b1; index[i + 2] = t1;
      index[i + 3] = b0; index[i + 4] = t1; index[i + 5] = t0;
      i += 6;
    }
    const tris = triangulate(ring);
    for (let k = 0; k < tris.length; k += 1) index[i + k] = base + n + tris[k];
    i += tris.length;
    // A ring the triangulator could not close leaves a hole in the roof but
    // never corrupts the stream: pad so the per-building index count is exact.
    const expected = 6 * n + 3 * (n - 2);
    const got = 6 * n + tris.length;
    for (let k = got; k < expected; k += 1) index[i++] = base;
    written += expected;
    buildingEnd[bIdx] = written;
    v += 2 * n;
  }

  return { position, ground, facadeOrigin, info, year, index, buildingEnd, vertexCount: vertCount,
    indexCount, buildingCount: buildings.length };
}

// ---------------------------------------------------------------------------
// LOD / budget policy
// ---------------------------------------------------------------------------

/**
 * How far a tier is allowed to appear from, for the current settings.
 * `detail` is the 0..1 density slider.
 */
export function tierRange(tier, quality, detail) {
  const base = TIER_RANGE_M[tier] || 0;
  const q = QUALITY_RANGE_MUL[quality] ?? 1;
  return base * q * (0.35 + 0.95 * clamp01(detail));
}

/**
 * Grow factor 0..1 for a tier at `distanceM` from the camera. Structures rise
 * out of the ground over the last quarter of their range rather than popping.
 */
export function tierGrow(tier, distanceM, quality, detail) {
  const range = tierRange(tier, quality, detail);
  if (range <= 0) return 0;
  if (distanceM <= range * 0.75) return 1;
  if (distanceM >= range) return 0;
  const t = (range - distanceM) / (range * 0.25);
  return t * t * (3 - 2 * t);
}

/**
 * Fraction of a tier's (tallest-first) buildings to draw. Performance mode
 * never draws more than 70% of any tier even at full detail.
 */
export function drawFraction(quality, detail) {
  const q = QUALITY_BUDGET_MUL[quality] ?? 1;
  return clamp01((0.12 + 0.88 * clamp01(detail)) * q);
}

/** Index count to draw from a packed tier for a given fraction. */
export function drawIndexCount(packed, fraction) {
  if (!packed || !packed.buildingCount) return 0;
  const n = Math.max(0, Math.min(packed.buildingCount,
    Math.round(packed.buildingCount * clamp01(fraction))));
  return n === 0 ? 0 : packed.buildingEnd[n - 1];
}

/** Structure vertical scale: damped against the terrain exaggeration. */
export function heightScale(exaggeration, structureHeight) {
  return Math.sqrt(Math.max(1, exaggeration)) * Math.max(0.05, structureHeight);
}

/** Nearest distance from a point (world xz) to an axis-aligned zone box. */
/**
 * Metres from a lon/lat point to a zone's bounds (0 inside), on the same
 * flat-earth scale the projection uses.
 */
export function zoneReachM(bounds, lon, lat) {
  const mLon = 111320 * Math.cos(((bounds.south + bounds.north) / 2) * (Math.PI / 180));
  const dx = lon < bounds.west ? bounds.west - lon : lon > bounds.east ? lon - bounds.east : 0;
  const dy = lat < bounds.south ? bounds.south - lat : lat > bounds.north ? lat - bounds.north : 0;
  return Math.hypot(dx * mLon, dy * 111033);
}

/**
 * Coarse test for a lazy zone: the orbit target is within `reachM` of it and
 * the camera is close enough that its buildings would show at all. The
 * renderer then asks whether the zone's box is actually in the view frustum
 * before fetching it. Never unloads: a zone you have visited stays warm.
 */
export function shouldActivateZone(zone, pose, { reachM = 30000, maxDistM = 45000 } = {}) {
  if (!zone || !zone.lazy || !zone.bounds || !pose) return false;
  if (!(pose.dist <= maxDistM)) return false;
  return zoneReachM(zone.bounds, pose.lon, pose.lat) <= reachM;
}

export function distanceToBox(x, z, box) {
  const dx = Math.max(box.minX - x, 0, x - box.maxX);
  const dz = Math.max(box.minZ - z, 0, z - box.maxZ);
  return Math.hypot(dx, dz);
}

/** Even/odd footprint containment, in the tier's local metre coordinates. */
export function pointInFootprint(x, z, poly) {
  let inside = false;
  const n = poly?.length / 2 || 0;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = poly[i * 2];
    const zi = poly[i * 2 + 1];
    const xj = poly[j * 2];
    const zj = poly[j * 2 + 1];
    const crosses = ((zi > z) !== (zj > z))
      && (x < (xj - xi) * (z - zi) / ((zj - zi) || 1e-9) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

function distanceToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const d2 = dx * dx + dz * dz;
  const t = d2 ? clamp01(((px - ax) * dx + (pz - az) * dz) / d2) : 0;
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

/** Distance to a footprint edge (0 when inside). */
export function distanceToFootprint(x, z, poly) {
  if (pointInFootprint(x, z, poly)) return 0;
  let best = Infinity;
  const n = poly?.length / 2 || 0;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    best = Math.min(best, distanceToSegment(x, z,
      poly[i * 2], poly[i * 2 + 1], poly[j * 2], poly[j * 2 + 1]));
  }
  return best;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}

// ---------------------------------------------------------------------------
// Bridges
// ---------------------------------------------------------------------------

/**
 * Deck elevation profile along the span, in structural metres above the
 * interpolated bank elevation.
 *
 * The OSM outline covers the elevated structure only, so the deck is level at
 * the navigation clearance across nearly all of it and eases down to about a
 * third of that in the last fifth at each end — the height an approach
 * viaduct still has where it leaves the outline. Forcing the ends to the
 * banks produced a 33% grade hump that read as an arch on every bridge.
 */
export function deckProfile(t, spec, groundA, groundB) {
  const bank = groundA + (groundB - groundA) * t;
  const rise = Math.max(0, (spec.clearance_m ?? 20) - Math.min(groundA, groundB));
  const edge = 0.2;
  const ease = (u) => u * u * (3 - 2 * u);
  let taper = 1;
  if (t < edge) taper = 0.35 + 0.65 * ease(t / edge);
  else if (t > 1 - edge) taper = 0.35 + 0.65 * ease((1 - t) / edge);
  return { ground: bank, struct: 4 + rise * taper };
}

/**
 * Build one bridge as schematic geometry: a deck ribbon on piers, plus a
 * form per type — suspension towers and cables, truss chords, a tied arch, or
 * lift towers. Solids share the building vertex layout; thin members come
 * back as line segments for the screen-space line shader.
 *
 * `worldLine` is the centerline in world xz metres; `groundAt(x, z)` samples
 * the DEM. Water is treated as elevation 0.
 */
export function buildBridge(spec, worldLine, groundAt) {
  const solids = { position: [], ground: [], info: [], index: [] };
  const lines = [];   // each: { a: [x, z], b: [x, z], ga, gb, sa, sb }

  const pts = resample(worldLine, 40);
  const total = polylineLength(pts);
  if (total < 20) return null;
  const width = spec.deck_width_m || 20;
  const gA = Math.max(0, groundAt(pts[0][0], pts[0][1]));
  const gB = Math.max(0, groundAt(pts[pts.length - 1][0], pts[pts.length - 1][1]));

  // ---- deck ribbon ----------------------------------------------------------
  const deck = [];
  let along = 0;
  for (let i = 0; i < pts.length; i += 1) {
    if (i > 0) along += dist(pts[i - 1], pts[i]);
    const t = along / total;
    const dir = tangent(pts, i);
    const nx = -dir[1];
    const nz = dir[0];
    const prof = deckProfile(t, spec, gA, gB);
    deck.push({ x: pts[i][0], z: pts[i][1], nx, nz, t, ...prof });
  }
  const deckDepth = 3;
  const base = () => solids.position.length / 3;
  for (let i = 0; i < deck.length - 1; i += 1) {
    const a = deck[i];
    const b = deck[i + 1];
    const v0 = base();
    for (const [p, side] of [[a, -1], [a, 1], [b, 1], [b, -1]]) {
      pushVertex(solids, p.x + p.nx * side * width / 2, p.struct, p.z + p.nz * side * width / 2,
        p.ground, deckDepth, p.struct - deckDepth);
    }
    for (const [p, side] of [[a, -1], [a, 1], [b, 1], [b, -1]]) {
      pushVertex(solids, p.x + p.nx * side * width / 2, p.struct - deckDepth,
        p.z + p.nz * side * width / 2, p.ground, deckDepth, p.struct - deckDepth);
    }
    // top, bottom, two sides
    quad(solids, v0, v0 + 1, v0 + 2, v0 + 3);
    quad(solids, v0 + 7, v0 + 6, v0 + 5, v0 + 4);
    quad(solids, v0 + 4, v0 + 5, v0 + 1, v0);
    quad(solids, v0 + 3, v0 + 2, v0 + 6, v0 + 7);
  }

  // ---- piers every ~90 m, from the ground up to the deck -------------------
  const pierEvery = spec.type === 'suspension' ? 120 : 90;
  const pierCount = Math.max(1, Math.floor(total / pierEvery));
  for (let p = 1; p < pierCount; p += 1) {
    const t = p / pierCount;
    const d = sampleDeck(deck, t);
    if (!d) continue;
    const g = Math.max(0, groundAt(d.x, d.z));
    box(solids, d.x, d.z, Math.min(width * 0.55, 14), 5, g, 0, d.struct - deckDepth + (d.ground - g));
  }

  // ---- type-specific form -------------------------------------------------
  const mainSpan = Math.min(spec.main_span_m || total * 0.5, total * 0.9);
  const tA = 0.5 - mainSpan / total / 2;
  const tB = 0.5 + mainSpan / total / 2;

  if (spec.type === 'suspension') {
    const towerH = spec.tower_height_m || 100;
    const towers = [];
    for (const t of [tA, tB]) {
      const d = sampleDeck(deck, t);
      const g = Math.max(0, groundAt(d.x, d.z));
      for (const side of [-1, 1]) {
        const x = d.x + d.nx * side * (width / 2 - 2);
        const z = d.z + d.nz * side * (width / 2 - 2);
        // Legs from the water to the top, joined by a portal beam.
        box(solids, x, z, 6, 6, g, 0, towerH);
        towers.push({ x, z, side, g, top: towerH, deckStruct: d.struct });
      }
      // portal beams
      const l = towers[towers.length - 2];
      const r = towers[towers.length - 1];
      for (const h of [d.struct + 8, towerH - 6]) {
        beam(solids, l.x, l.z, r.x, r.z, 4, g, h - 4, h);
      }
    }
    // Main cables: anchorage (deck level at the ends) -> tower top -> sag -> tower top -> anchorage.
    for (const side of [-1, 1]) {
      const at = (t) => {
        const d = sampleDeck(deck, t);
        return { x: d.x + d.nx * side * (width / 2 - 2), z: d.z + d.nz * side * (width / 2 - 2), d };
      };
      const p0 = at(Math.max(0.02, tA - mainSpan / total * 0.45));
      const p1 = at(tA);
      const p2 = at(tB);
      const p3 = at(Math.min(0.98, tB + mainSpan / total * 0.45));
      const sagLow = p1.d.struct + 6;
      cableCurve(lines, p0, p1, p0.d.struct, towerH, 12);
      // parabola between the towers
      const segs = 24;
      let prev = null;
      for (let s = 0; s <= segs; s += 1) {
        const u = s / segs;
        const t = tA + (tB - tA) * u;
        const p = at(t);
        const h = towerH - (towerH - sagLow) * (1 - Math.pow(2 * u - 1, 2));
        const cur = { x: p.x, z: p.z, g: 0, s: h, ds: p.d.struct };
        if (prev) lines.push({ a: [prev.x, prev.z], b: [cur.x, cur.z], ga: prev.g, gb: cur.g,
          sa: prev.s, sb: cur.s });
        // hangers every third sample
        if (s % 3 === 0 && s > 0 && s < segs) {
          lines.push({ a: [cur.x, cur.z], b: [cur.x, cur.z], ga: 0, gb: p.d.ground,
            sa: cur.s, sb: cur.ds });
        }
        prev = cur;
      }
      cableCurve(lines, p2, p3, towerH, p3.d.struct, 12);
    }
  } else if (spec.type === 'truss') {
    const depth = spec.truss_height_m || 25;
    // A deck truss carries the roadway on top of the steel (Betsy Ross); a
    // through truss rises above it at the piers (Commodore Barry). Either way
    // the profile is a cantilever's: deepest over the piers, shallowest midspan.
    const below = spec.truss_position === 'below';
    for (const side of [-1, 1]) {
      let prev = null;
      const segs = 28;
      for (let s = 0; s <= segs; s += 1) {
        const t = tA + (tB - tA) * (s / segs);
        const d = sampleDeck(deck, t);
        const x = d.x + d.nx * side * (width / 2);
        const z = d.z + d.nz * side * (width / 2);
        const u = s / segs;
        const span = depth * (0.45 + 0.55 * Math.pow(Math.abs(2 * u - 1), 1.4));
        const top = below ? d.struct - deckDepth : d.struct + span;
        const bot = below ? Math.max(1, d.struct - deckDepth - span) : d.struct - deckDepth;
        const cur = { x, z, g: d.ground, top, bot };
        if (prev) {
          // The chord that is not the deck edge.
          lines.push({ a: [prev.x, prev.z], b: [cur.x, cur.z], ga: prev.g, gb: cur.g,
            sa: below ? prev.bot : prev.top, sb: below ? cur.bot : cur.top });
          if (s % 2 === 0) {
            lines.push({ a: [prev.x, prev.z], b: [cur.x, cur.z], ga: prev.g, gb: cur.g,
              sa: prev.bot, sb: cur.top });   // diagonal
          }
        }
        if (s % 2 === 0) {
          lines.push({ a: [cur.x, cur.z], b: [cur.x, cur.z], ga: cur.g, gb: cur.g,
            sa: cur.bot, sb: cur.top });       // vertical
        }
        prev = cur;
      }
    }
  } else if (spec.type === 'arch') {
    const rise = spec.arch_rise_m || 30;
    for (const side of [-1, 1]) {
      let prev = null;
      const segs = 20;
      for (let s = 0; s <= segs; s += 1) {
        const u = s / segs;
        const t = tA + (tB - tA) * u;
        const d = sampleDeck(deck, t);
        const x = d.x + d.nx * side * (width / 2);
        const z = d.z + d.nz * side * (width / 2);
        const h = d.struct + rise * Math.sin(Math.PI * u);
        const cur = { x, z, g: d.ground, s: h, ds: d.struct };
        if (prev) lines.push({ a: [prev.x, prev.z], b: [cur.x, cur.z], ga: prev.g, gb: cur.g,
          sa: prev.s, sb: cur.s });
        if (s % 2 === 0 && s > 0 && s < segs) {
          lines.push({ a: [cur.x, cur.z], b: [cur.x, cur.z], ga: cur.g, gb: cur.g,
            sa: cur.ds, sb: cur.s });
        }
        prev = cur;
      }
    }
  } else if (spec.type === 'lift') {
    const towerH = spec.tower_height_m || 60;
    for (const t of [tA, tB]) {
      const d = sampleDeck(deck, t);
      const g = Math.max(0, groundAt(d.x, d.z));
      for (const side of [-1, 1]) {
        box(solids, d.x + d.nx * side * (width / 2 + 2), d.z + d.nz * side * (width / 2 + 2),
          5, 5, g, 0, towerH);
      }
      beam(solids, d.x - d.nx * (width / 2 + 2), d.z - d.nz * (width / 2 + 2),
        d.x + d.nx * (width / 2 + 2), d.z + d.nz * (width / 2 + 2), 3, g, towerH - 3, towerH);
    }
  }

  return {
    solids: {
      position: new Float32Array(solids.position),
      ground: new Float32Array(solids.ground),
      info: new Float32Array(solids.info),
      index: new Uint32Array(solids.index),
      vertexCount: solids.position.length / 3,
      indexCount: solids.index.length,
    },
    lines,
    lengthM: total,
    towerTops: spec.type === 'suspension' || spec.type === 'lift'
      ? (spec.tower_height_m || 0) : null,
  };
}

// ---- small geometry helpers ------------------------------------------------

function pushVertex(out, x, y, z, ground, height, minHeight) {
  out.position.push(x, y, z);
  out.ground.push(ground);
  out.info.push(height, minHeight);
}

function quad(out, a, b, c, d) {
  out.index.push(a, b, c, a, c, d);
}

/** Axis-aligned-in-plan box from structural height `y0` to `y1`. */
function box(out, cx, cz, w, d, ground, y0, y1) {
  const v0 = out.position.length / 3;
  const corners = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
  for (const [dx, dz] of corners) pushVertex(out, cx + dx, y0, cz + dz, ground, y1 - y0, y0);
  for (const [dx, dz] of corners) pushVertex(out, cx + dx, y1, cz + dz, ground, y1 - y0, y0);
  for (let k = 0; k < 4; k += 1) {
    const k2 = (k + 1) % 4;
    quad(out, v0 + k, v0 + k2, v0 + 4 + k2, v0 + 4 + k);
  }
  quad(out, v0 + 4, v0 + 5, v0 + 6, v0 + 7);
}

/** A rectangular beam between two plan points, `w` wide, from y0 to y1. */
function beam(out, x1, z1, x2, z2, w, ground, y0, y1) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz) || 1;
  const nx = (-dz / len) * (w / 2);
  const nz = (dx / len) * (w / 2);
  const v0 = out.position.length / 3;
  const ring = [[x1 + nx, z1 + nz], [x2 + nx, z2 + nz], [x2 - nx, z2 - nz], [x1 - nx, z1 - nz]];
  for (const [x, z] of ring) pushVertex(out, x, y0, z, ground, y1 - y0, y0);
  for (const [x, z] of ring) pushVertex(out, x, y1, z, ground, y1 - y0, y0);
  for (let k = 0; k < 4; k += 1) {
    const k2 = (k + 1) % 4;
    quad(out, v0 + k, v0 + k2, v0 + 4 + k2, v0 + 4 + k);
  }
  quad(out, v0 + 4, v0 + 5, v0 + 6, v0 + 7);
}

/** A sagging cable from (p0, h0) to (p1, h1), catenary-ish. */
function cableCurve(lines, p0, p1, h0, h1, segs) {
  let prev = null;
  for (let s = 0; s <= segs; s += 1) {
    const u = s / segs;
    const x = p0.x + (p1.x - p0.x) * u;
    const z = p0.z + (p1.z - p0.z) * u;
    const h = h0 + (h1 - h0) * (u * u);
    const cur = { x, z, s: h };
    if (prev) lines.push({ a: [prev.x, prev.z], b: [cur.x, cur.z], ga: 0, gb: 0, sa: prev.s, sb: cur.s });
    prev = cur;
  }
}

function dist(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function polylineLength(pts) {
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) total += dist(pts[i - 1], pts[i]);
  return total;
}

function tangent(pts, i) {
  const a = pts[Math.max(0, i - 1)];
  const b = pts[Math.min(pts.length - 1, i + 1)];
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

/** Resample a polyline to `count` evenly spaced points. */
export function resample(line, count) {
  if (line.length < 2) return line.slice();
  const total = polylineLength(line);
  if (total === 0) return [line[0], line[line.length - 1]];
  const out = [];
  let seg = 0;
  let segStart = 0;
  let segLen = dist(line[0], line[1]);
  for (let k = 0; k < count; k += 1) {
    const target = (k / (count - 1)) * total;
    while (seg < line.length - 2 && target > segStart + segLen) {
      segStart += segLen;
      seg += 1;
      segLen = dist(line[seg], line[seg + 1]);
    }
    const u = segLen > 0 ? (target - segStart) / segLen : 0;
    out.push([
      line[seg][0] + (line[seg + 1][0] - line[seg][0]) * u,
      line[seg][1] + (line[seg + 1][1] - line[seg][1]) * u,
    ]);
  }
  return out;
}

function sampleDeck(deck, t) {
  if (!deck.length) return null;
  const f = Math.min(deck.length - 1, Math.max(0, t * (deck.length - 1)));
  const i = Math.floor(f);
  const j = Math.min(deck.length - 1, i + 1);
  const u = f - i;
  const a = deck[i];
  const b = deck[j];
  return {
    x: a.x + (b.x - a.x) * u,
    z: a.z + (b.z - a.z) * u,
    nx: a.nx + (b.nx - a.nx) * u,
    nz: a.nz + (b.nz - a.nz) * u,
    ground: a.ground + (b.ground - a.ground) * u,
    struct: a.struct + (b.struct - a.struct) * u,
  };
}

/** Merge several solid sets into one (for a single bridge draw call). */
export function mergeSolids(parts) {
  let vCount = 0;
  let iCount = 0;
  for (const p of parts) {
    vCount += p.vertexCount;
    iCount += p.indexCount;
  }
  const position = new Float32Array(vCount * 3);
  const ground = new Float32Array(vCount);
  const info = new Float32Array(vCount * 2);
  const year = new Float32Array(vCount);
  const index = new Uint32Array(iCount);
  let vo = 0;
  let io = 0;
  for (const p of parts) {
    position.set(p.position, vo * 3);
    ground.set(p.ground, vo);
    info.set(p.info, vo * 2);
    if (p.year) year.set(p.year, vo);
    for (let k = 0; k < p.indexCount; k += 1) index[io + k] = p.index[k] + vo;
    vo += p.vertexCount;
    io += p.indexCount;
  }
  return { position, ground, info, year, index, vertexCount: vCount, indexCount: iCount };
}
