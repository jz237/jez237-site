/**
 * Structures layer: data integrity, geometry placement, LOD policy, and the
 * state/URL/degraded plumbing that carries it.
 *
 * Reads the real shipped files under data/structures/, so a regeneration that
 * drops a bridge, breaks the binary layout, or drifts a tower off its footprint
 * fails here before it reaches a browser.
 *
 *   node --test tests/
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

import {
  parseTier, extrudeBuildings, buildBridge, mergeSolids, tierGrow, tierRange,
  drawFraction, drawIndexCount, heightScale, distanceToBox, deckProfile, resample,
  TIER_PLAN, TIER_ORDER,
  zoneReachM, shouldActivateZone,
  tierAssetPath, pointInFootprint, distanceToFootprint,
} from '../src/structures-data.js';
import { CONTROLS, LAYERS, defaults, coerce } from '../src/schema.js';
import { createStore } from '../src/state.js';
import { PRESETS, presetPatch, QUICK_JUMPS, HOME_PRESET } from '../src/presets.js';
import { encodeState, decodeState } from '../src/urlstate.js';
import { assess, ASSETS, MODE } from '../src/degraded.js';
import { THEMES, THEME_IDS } from '../src/themes.js';
import { createProjection } from '../src/geo.js';

const dataDir = new URL('../data/structures/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('buildings.json', dataDir), 'utf8'));
const bridgesDoc = JSON.parse(await readFile(new URL('bridges.json', dataDir), 'utf8'));
const terrainMeta = JSON.parse(
  await readFile(new URL('../data/terrain.json', import.meta.url), 'utf8'));
const projection = createProjection(terrainMeta);

const REQUIRED_BRIDGES = ['Benjamin Franklin Bridge', 'Walt Whitman Bridge',
  'Betsy Ross Bridge', 'Tacony-Palmyra Bridge'];
const SKYLINE = ['Comcast Technology Center', 'Comcast Center', 'One Liberty Place',
  'Two Liberty Place', 'BNY Mellon Center', 'Three Logan Square'];

const hex = /^#[0-9a-f]{6}$/i;
const inRegion = (lon, lat) => projection.contains(lon, lat);

test('browser assets carry one cache generation', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(index, /app\.css\?v=philly-\d+/);
  assert.match(index, /src\/main\.js\?v=philly-\d+/);

  const srcDir = new URL('../src/', import.meta.url);
  const files = (await readdir(srcDir)).filter((file) => file.endsWith('.js'));
  for (const file of files) {
    const source = await readFile(new URL(file, srcDir), 'utf8');
    const imports = source.matchAll(/from\s+['"](\.\.?\/[^'"]+\.js(?:\?[^'"]*)?)['"]/g);
    for (const match of imports) {
      assert.match(match[1], /\?v=philly-\d+$/, `${file}: ${match[1]} is not versioned`);
    }
  }
});

// ---------------------------------------------------------------------------
test('structures manifest', async (t) => {
  await t.test('describes bounded zones with tiers, counts and sizes', () => {
    assert.equal(manifest.format, 'PHB2');
    assert.ok(manifest.zones.length >= 2, 'two detail zones');
    for (const zone of manifest.zones) {
      assert.ok(inRegion(zone.bounds.west, zone.bounds.south), `${zone.id} sw outside region`);
      assert.ok(inRegion(zone.bounds.east, zone.bounds.north), `${zone.id} ne outside region`);
      const w = (zone.bounds.east - zone.bounds.west) * manifest.projection.metersPerDegLon;
      const h = (zone.bounds.north - zone.bounds.south) * manifest.projection.metersPerDegLat;
      // No unbounded full-region dump: every zone is a few kilometres, not 94.
      assert.ok(w < 20000 && h < 20000, `${zone.id} is ${Math.round(w)}x${Math.round(h)} m`);
      for (const tier of zone.tiers) {
        assert.ok(TIER_ORDER.includes(tier.tier), `${zone.id} unknown tier ${tier.tier}`);
        assert.ok(tier.count > 0 && tier.bytes > 8 && tier.vertices >= 3 * tier.count);
      }
    }
    assert.ok(manifest.totals.buildings > 10000, 'the fabric must be substantial');
    assert.ok(manifest.totals.bytes < 1.6e6,
      `payload ${manifest.totals.bytes} B exceeds the 1.6 MB budget`);
  });

  await t.test('heights are honest about their provenance', () => {
    const c = manifest.sourceCounts;
    const total = Object.values(c).reduce((a, b) => a + b, 0);
    assert.ok(c.measured / total > 0.5, 'most heights should be measured OSM values');
    assert.ok(c.curated > 0 && c.curated < 60, 'curated overrides are few and counted');
    assert.ok(manifest.heightSources.curated.includes('reference'),
      'the manifest must say curated heights are references, not surveys');
  });

  await t.test('the skyline towers are present, tall, and in the tall tier', () => {
    const center = manifest.zones.find((z) => z.id === 'center-city');
    const names = new Map(center.tallest.map((b) => [b.name, b]));
    for (const name of SKYLINE) {
      const b = names.get(name);
      assert.ok(b, `${name} missing from the tallest list`);
      assert.ok(b.height >= 150, `${name} is only ${b.height} m`);
    }
    assert.ok(names.get('Comcast Technology Center').height > 330);
    assert.equal(names.get('Comcast Technology Center').source, 'measured');
    assert.equal(names.get('One Liberty Place').source, 'curated');
  });
});

// ---------------------------------------------------------------------------
test('tier streams', async (t) => {
  for (const zone of manifest.zones) {
    for (const tier of zone.tiers) {
      await t.test(`${zone.id}/${tier.tier} parses, is sorted, and stays in its box`, async () => {
        const buffer = (await readFile(new URL(tier.file, dataDir))).buffer;
        const parsed = parseTier(buffer);
        assert.equal(parsed.count, tier.count, 'count matches the manifest');
        assert.equal(parsed.buildings.reduce((a, b) => a + b.poly.length / 2, 0),
          tier.vertices, 'vertex total matches the manifest');

        const floor = manifest.tiers.find((x) => x.tier === tier.tier).minHeightM;
        const halfW = (zone.bounds.east - zone.bounds.west) / 2 * manifest.projection.metersPerDegLon;
        const halfH = (zone.bounds.north - zone.bounds.south) / 2 * manifest.projection.metersPerDegLat;
        let prev = Infinity;
        for (const b of parsed.buildings) {
          assert.ok(b.height <= prev + 1e-6, 'tallest first');
          prev = b.height;
          assert.ok(b.height >= floor && b.height <= 400, `height ${b.height} outside tier`);
          assert.ok(b.minHeight >= 0 && b.minHeight < b.height);
          assert.ok(b.poly.length >= 6, 'at least a triangle');
          for (let k = 0; k < b.poly.length; k += 2) {
            assert.ok(Math.abs(b.poly[k]) <= halfW + 250, `x ${b.poly[k]} outside the zone`);
            assert.ok(Math.abs(b.poly[k + 1]) <= halfH + 250, `z ${b.poly[k + 1]} outside the zone`);
          }
        }
      });
    }
  }

  await t.test('rejects a corrupted stream instead of rendering garbage', () => {
    // PHB2: magic, count=1, then n=3, height 10.0 m, min 0, source 0, flags 0b101
    // (named, curated year), year 1753, and three vertices.
    const good = new Uint8Array([80, 72, 66, 50, 1, 0, 0, 0, 3, 0, 100, 0, 0, 0, 0, 5, 217, 6,
      0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0]);
    const parsed = parseTier(good.buffer);
    assert.equal(parsed.count, 1);
    assert.equal(parsed.buildings[0].year, 1753);
    assert.equal(parsed.buildings[0].yearSource, 'curated');
    assert.equal(parsed.buildings[0].named, true);
    const badMagic = new Uint8Array(good);
    badMagic[0] = 88;
    assert.throws(() => parseTier(badMagic.buffer), /bad magic/);
    assert.throws(() => parseTier(good.buffer.slice(0, 20)), /bad ring|truncated/);
    assert.throws(() => parseTier(new ArrayBuffer(4)), /too short/);
  });

  await t.test('accepts a cached PHB1 stream without historical dates', () => {
    const legacy = new Uint8Array([80, 72, 66, 49, 1, 0, 0, 0, 3, 0, 100, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0]);
    const parsed = parseTier(legacy.buffer);
    assert.equal(parsed.count, 1);
    assert.equal(parsed.buildings[0].named, true);
    assert.equal(parsed.buildings[0].year, 0);
    assert.equal(parsed.buildings[0].yearSource, 'none');
  });

  await t.test('versions tier URLs by manifest format', () => {
    assert.equal(tierAssetPath('center-city-tall.bin', 'PHB2'),
      'data/structures/center-city-tall.bin?format=PHB2');
  });
});

// ---------------------------------------------------------------------------
test('extrusion', async (t) => {
  const square = { height: 30, minHeight: 0, source: 'measured', named: false,
    poly: new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]) };
  const hex6 = { height: 12, minHeight: 2, source: 'levels', named: true,
    poly: new Float32Array([0, 0, 4, 0, 6, 3, 4, 6, 0, 6, -2, 3]) };

  await t.test('packs 2n vertices and 6n + 3(n-2) indices per building', () => {
    const packed = extrudeBuildings([square, hex6], {
      originX: 1000, originZ: -500, groundAt: () => 7,
    });
    assert.equal(packed.vertexCount, 8 + 12);
    assert.equal(packed.indexCount, (24 + 6) + (36 + 12));
    assert.deepEqual([...packed.buildingEnd], [30, 78]);
    for (const idx of packed.index) assert.ok(idx < packed.vertexCount, 'index in range');
  });

  await t.test('sits on the ground sampled at its own centroid, in world xz', () => {
    let asked = null;
    const packed = extrudeBuildings([square], {
      originX: 1000, originZ: -500, groundAt: (x, z) => { asked = [x, z]; return 42; },
    });
    assert.deepEqual(asked, [1005, -495], 'centroid, offset by the zone origin');
    for (let v = 0; v < packed.vertexCount; v += 1) assert.equal(packed.ground[v], 42);
    // Base ring at structural 0, roof ring at the height; world x/z carry the
    // origin. Winding may be normalised, so compare as sets.
    const corner = (v) => `${packed.position[v * 3]},${packed.position[v * 3 + 2]}`;
    const baseRing = new Set([0, 1, 2, 3].map(corner));
    assert.deepEqual([...baseRing].sort(),
      ['1000,-490', '1000,-500', '1010,-490', '1010,-500']);
    for (let v = 0; v < 4; v += 1) assert.equal(packed.position[v * 3 + 1], 0);
    for (let v = 4; v < 8; v += 1) assert.equal(packed.position[v * 3 + 1], 30);
    assert.equal(packed.info[0], 30);
  });

  await t.test('winding is normalised so a clockwise ring still gets a roof', () => {
    const cw = { ...square, poly: new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]) };
    const a = extrudeBuildings([square], { originX: 0, originZ: 0, groundAt: () => 0 });
    const b = extrudeBuildings([cw], { originX: 0, originZ: 0, groundAt: () => 0 });
    assert.equal(a.indexCount, b.indexCount);
    // Roof triangles reference roof-ring vertices only.
    const roof = [...b.index.slice(24)];
    assert.ok(roof.every((i) => i >= 4), 'roof uses the top ring');
  });

  await t.test('vertical scale is damped against terrain exaggeration', () => {
    assert.equal(heightScale(1, 1), 1);
    assert.ok(Math.abs(heightScale(10, 1) - Math.sqrt(10)) < 1e-9);
    assert.ok(Math.abs(heightScale(10, 2) - 2 * Math.sqrt(10)) < 1e-9);
    assert.equal(heightScale(0.2, 1), 1, 'never below true scale');
    assert.ok(heightScale(10, 0) > 0, 'never collapses to zero');
    // A 340 m tower at the default exaggeration stays a tower, not a needle:
    // less than one third of the width of a 6 km close-up frame.
    assert.ok(340 * heightScale(10, 1) < 6000 / 3);
  });
});

test('building footprint inspection', () => {
  const square = new Float32Array([0, 0, 20, 0, 20, 20, 0, 20]);
  assert.equal(pointInFootprint(10, 10, square), true);
  assert.equal(pointInFootprint(30, 10, square), false);
  assert.equal(distanceToFootprint(10, 10, square), 0);
  assert.equal(distanceToFootprint(25, 10, square), 5);
});

// ---------------------------------------------------------------------------
test('LOD policy', async (t) => {
  await t.test('performance mode never fetches the rowhouse tier', () => {
    assert.deepEqual(TIER_PLAN.performance, ['tall', 'mid']);
    assert.ok(TIER_PLAN.balanced.includes('low'));
    assert.ok(TIER_PLAN.cinematic.includes('low'));
  });

  await t.test('ranges grow with detail and quality, tall beyond mid beyond low', () => {
    for (const q of ['performance', 'balanced', 'cinematic']) {
      assert.ok(tierRange('tall', q, 0.6) > tierRange('mid', q, 0.6));
      assert.ok(tierRange('mid', q, 0.6) > tierRange('low', q, 0.6));
      assert.ok(tierRange('low', q, 1) > tierRange('low', q, 0));
    }
    assert.ok(tierRange('mid', 'cinematic', 0.6) > tierRange('mid', 'balanced', 0.6));
    assert.ok(tierRange('mid', 'balanced', 0.6) > tierRange('mid', 'performance', 0.6));
    assert.ok(tierRange('tall', 'balanced', 0.6) > 90000, 'the skyline shows from the overview');
  });

  await t.test('grow is 1 inside the range, 0 beyond it, smooth between', () => {
    const range = tierRange('low', 'balanced', 0.6);
    assert.equal(tierGrow('low', 0, 'balanced', 0.6), 1);
    assert.equal(tierGrow('low', range * 0.5, 'balanced', 0.6), 1);
    assert.equal(tierGrow('low', range * 2, 'balanced', 0.6), 0);
    const mid = tierGrow('low', range * 0.875, 'balanced', 0.6);
    assert.ok(mid > 0.3 && mid < 0.7, `midway grow ${mid}`);
    assert.equal(tierGrow('nope', 1, 'balanced', 0.6), 0);
  });

  await t.test('draw fraction is a tallest-first prefix, capped in performance mode', () => {
    assert.equal(drawFraction('balanced', 1), 1);
    assert.ok(drawFraction('performance', 1) <= 0.7);
    assert.ok(drawFraction('balanced', 0) > 0, 'never nothing: the skyline stays');
    assert.ok(drawFraction('balanced', 0.6) > drawFraction('balanced', 0.3));
    const packed = extrudeBuildings([
      { height: 50, minHeight: 0, poly: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]) },
      { height: 20, minHeight: 0, poly: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]) },
      { height: 10, minHeight: 0, poly: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]) },
    ], { originX: 0, originZ: 0, groundAt: () => 0 });
    assert.equal(drawIndexCount(packed, 1), packed.indexCount);
    assert.equal(drawIndexCount(packed, 0.34), packed.buildingEnd[0], 'one building: the tallest');
    assert.equal(drawIndexCount(packed, 0), 0);
    assert.equal(drawIndexCount(null, 1), 0);
  });

  await t.test('distance to a zone box is zero inside and euclidean outside', () => {
    const box = { minX: 0, maxX: 100, minZ: 0, maxZ: 100 };
    assert.equal(distanceToBox(50, 50, box), 0);
    assert.equal(distanceToBox(-30, 50, box), 30);
    assert.ok(Math.abs(distanceToBox(-30, -40, box) - 50) < 1e-9);
  });
});

// ---------------------------------------------------------------------------
test('bridges', async (t) => {
  await t.test('the four required Delaware crossings ship with real alignments', () => {
    const names = new Set(bridgesDoc.bridges.map((b) => b.name));
    for (const name of REQUIRED_BRIDGES) assert.ok(names.has(name), `missing ${name}`);
    assert.ok(bridgesDoc.attribution.includes('OpenStreetMap'));
    assert.equal(bridgesDoc.curated, true, 'must declare its structure as curated');
    for (const b of bridgesDoc.bridges) {
      assert.ok(b.centerline.length >= 2, `${b.id} needs a centerline`);
      for (const [lon, lat] of b.centerline) assert.ok(inRegion(lon, lat), `${b.id} off-region`);
      assert.ok(['suspension', 'truss', 'arch', 'lift', 'girder'].includes(b.type), b.type);
      assert.ok(b.length_m > 200 && b.length_m < 4000, `${b.id} length ${b.length_m}`);
      assert.ok(b.deck_width_m >= 8 && b.deck_width_m <= 60, `${b.id} width ${b.deck_width_m}`);
      assert.ok(b.clearance_m > 10 && b.clearance_m < 80);
      assert.ok(['osm-outline', 'osm-centerline', 'curated'].includes(b.geometry_source));
    }
    const bfb = bridgesDoc.bridges.find((b) => b.id === 'benjamin-franklin');
    assert.equal(bfb.type, 'suspension');
    assert.ok(bfb.tower_height_m > 100);
    // Its centre must sit over the Delaware between Philadelphia and Camden.
    const mid = bfb.centerline[Math.floor(bfb.centerline.length / 2)];
    assert.ok(mid[0] > -75.15 && mid[0] < -75.12 && mid[1] > 39.945 && mid[1] < 39.965,
      `Ben Franklin midpoint ${mid} is not on the river`);
  });

  await t.test('the deck is level at the clearance and only eases down at its ends', () => {
    const spec = { clearance_m: 41 };
    const mid = deckProfile(0.5, spec, 8, 6);
    assert.ok(mid.struct > 35, `midspan struct ${mid.struct}`);
    assert.ok(mid.ground > 6 && mid.ground < 8, 'bank elevation interpolates');
    // Level across the middle: no hump.
    for (const u of [0.25, 0.4, 0.6, 0.75]) {
      assert.ok(Math.abs(deckProfile(u, spec, 8, 6).struct - mid.struct) < 1e-9, `hump at ${u}`);
    }
    // Ends still stand proud, like the start of an approach viaduct.
    const ends = [deckProfile(0, spec, 8, 6), deckProfile(1, spec, 8, 6)];
    for (const e of ends) {
      assert.ok(e.struct > 10 && e.struct < mid.struct * 0.5, `end struct ${e.struct}`);
    }
    // Monotone taper: no grade steeper than the ends themselves.
    let prev = deckProfile(0, spec, 8, 6).struct;
    for (let u = 0.02; u <= 0.5; u += 0.02) {
      const cur = deckProfile(u, spec, 8, 6).struct;
      assert.ok(cur >= prev - 1e-9, 'deck dips on the way up');
      prev = cur;
    }
  });

  await t.test('a suspension bridge builds towers, cables and hangers on the deck', () => {
    const line = [[0, 0], [1200, 0]];
    const built = buildBridge({ type: 'suspension', main_span_m: 533, tower_height_m: 116,
      clearance_m: 41, deck_width_m: 39 }, resample(line, 40), () => 0);
    assert.ok(built.solids.vertexCount > 100 && built.solids.indexCount > 100);
    assert.ok(built.lines.length > 60, `only ${built.lines.length} cable segments`);
    // Every index points at a real vertex and every vertex is finite.
    for (const i of built.solids.index) assert.ok(i < built.solids.vertexCount);
    for (const v of built.solids.position) assert.ok(Number.isFinite(v));
    // The tallest structural vertex is the tower top.
    let top = 0;
    for (let v = 0; v < built.solids.vertexCount; v += 1) {
      top = Math.max(top, built.solids.position[v * 3 + 1]);
    }
    assert.ok(Math.abs(top - 116) < 1e-6, `tower top ${top}`);
    // Cable high points meet the tower tops; the sag stays above the deck.
    let cableMax = 0;
    let cableMin = Infinity;
    for (const seg of built.lines) {
      cableMax = Math.max(cableMax, seg.sa, seg.sb);
      cableMin = Math.min(cableMin, seg.sa, seg.sb);
    }
    assert.ok(Math.abs(cableMax - 116) < 1e-6);
    assert.ok(cableMin >= 0);
  });

  await t.test('a deck truss keeps its steel under the roadway; a through truss rises above', () => {
    const line = resample([[0, 0], [800, 0]], 40);
    const deckTop = (built) => {
      let top = 0;
      for (let v = 0; v < built.solids.vertexCount; v += 1) {
        top = Math.max(top, built.solids.position[v * 3 + 1]);
      }
      return top;
    };
    const belowSpec = { type: 'truss', main_span_m: 222, truss_height_m: 26,
      truss_position: 'below', clearance_m: 41, deck_width_m: 30 };
    const aboveSpec = { ...belowSpec, truss_position: 'above', truss_height_m: 52 };
    const below = buildBridge(belowSpec, line, () => 2);
    const above = buildBridge(aboveSpec, line, () => 2);
    const lineMax = (b) => Math.max(...b.lines.map((l) => Math.max(l.sa, l.sb)));
    assert.ok(lineMax(below) <= deckTop(below) + 1e-6, 'deck truss must not rise above the deck');
    assert.ok(lineMax(above) > deckTop(above) + 20, 'through truss must rise well above it');
    assert.ok(Math.min(...below.lines.map((l) => Math.min(l.sa, l.sb))) >= 1, 'never below water');
  });

  await t.test('every shipped bridge builds without a degenerate part', () => {
    const groundAt = () => 3;
    const parts = [];
    for (const spec of bridgesDoc.bridges) {
      const world = spec.centerline.map(([lon, lat]) =>
        [projection.lonToX(lon), projection.latToZ(lat)]);
      const built = buildBridge(spec, resample(world, 40), groundAt);
      assert.ok(built, `${spec.id} did not build`);
      assert.ok(built.solids.vertexCount > 0);
      parts.push(built.solids);
    }
    const merged = mergeSolids(parts);
    assert.equal(merged.vertexCount, parts.reduce((a, p) => a + p.vertexCount, 0));
    assert.equal(merged.indexCount, parts.reduce((a, p) => a + p.indexCount, 0));
    let maxIdx = 0;
    for (const i of merged.index) maxIdx = Math.max(maxIdx, i);
    assert.ok(maxIdx < merged.vertexCount, 'merged indices were re-based');
  });

  await t.test('footprints replaced by schematic models are dropped and recorded', () => {
    assert.deepEqual(manifest.replacedByModels,
      ['Citizens Bank Park', 'Independence Hall', 'Lincoln Financial Field', 'Philadelphia Museum of Art']);
    for (const zone of manifest.zones) {
      for (const b of zone.tallest || []) {
        assert.ok(!manifest.replacedByModels.includes(b.name), `${b.name} still extruded`);
      }
    }
  });

  await t.test('the bridge chips and preset sit on their spans and look back at the city', () => {
    const chips = QUICK_JUMPS.filter((j) => j.group === 'structures');
    assert.ok(chips.length >= 5, 'bridge and structure chips');
    const mPerDegLon = terrainMeta.projection.metersPerDegLon;
    const mPerDegLat = terrainMeta.projection.metersPerDegLat;
    const check = (name, lon, lat, id) => {
      const bridge = bridgesDoc.bridges.find((b) => b.id === id);
      assert.ok(bridge, `${name}: no bridge ${id}`);
      // Midpoint of the span, not the middle vertex: a straight bridge has
      // only two centerline points and the middle vertex would be an end.
      const a = bridge.centerline[0];
      const z = bridge.centerline[bridge.centerline.length - 1];
      const mid = [(a[0] + z[0]) / 2, (a[1] + z[1]) / 2];
      const dm = Math.hypot((lon - mid[0]) * mPerDegLon, (lat - mid[1]) * mPerDegLat);
      assert.ok(dm < 600, `${name} is ${Math.round(dm)} m from its span midpoint`);
    };
    for (const [name, id] of [['Walt Whitman Bridge', 'walt-whitman'],
      ['Betsy Ross Bridge', 'betsy-ross'], ['Tacony-Palmyra Bridge', 'tacony-palmyra'],
      ['Commodore Barry Bridge', 'commodore-barry']]) {
      const chip = chips.find((c) => c.name === name);
      assert.ok(chip, `missing chip ${name}`);
      check(name, chip.lon, chip.lat, id);
      assert.ok(chip.camDist <= 5000, `${name} chip is too far out to show the structure`);
    }
    const bfb = presetPatch('ben-franklin-bridge');
    assert.ok(bfb, 'Ben Franklin Bridge preset');
    check('Ben Franklin preset', bfb.camLon, bfb.camLat, 'benjamin-franklin');
    // The sports complex chip lands inside the notable zone that holds the stadiums.
    const sports = chips.find((c) => c.id === 'sports-complex');
    const inner = manifest.zones.find((z) => z.id === 'inner-city').bounds;
    assert.ok(sports.lon > inner.west && sports.lon < inner.east
      && sports.lat > inner.south && sports.lat < inner.north);
  });

  await t.test('the opening shot frames the full-fabric zone at structure range', () => {
    const home = presetPatch(HOME_PRESET);
    const zone = manifest.zones.find((z) => z.id === 'center-city').bounds;
    assert.ok(home.camLon > zone.west && home.camLon < zone.east
      && home.camLat > zone.south && home.camLat < zone.north, 'target inside Center City');
    // Inside the low tier's grow range at balanced quality, so the rowhouse
    // fabric is up on the first frame, not just the towers.
    assert.ok(home.camDist < tierRange('low', 'balanced', home.structureDetail) * 0.75);
  });

  await t.test('too short a line is refused rather than extruded', () => {
    assert.equal(buildBridge({ type: 'truss' }, [[0, 0], [5, 0]], () => 0), null);
  });
});

// ---------------------------------------------------------------------------
test('structures state plumbing', async (t) => {
  await t.test('the layer and its controls exist with unique keys and sane defaults', () => {
    assert.ok(LAYERS.structures, 'structures layer');
    assert.equal(LAYERS.structures.def, false, 'the opening view shows real rooftop photography');
    assert.ok(CONTROLS.structureDetail && CONTROLS.structureHeight);
    assert.equal(coerce('structureDetail', 5), 1);
    assert.equal(coerce('structureHeight', 0), 0.5, 'never flat');
    // Defaults are the opening skyline's values, held there by the core tests.
    assert.equal(defaults().structureDetail, presetPatch(HOME_PRESET).structureDetail);
    assert.equal(defaults().structureHeight, presetPatch(HOME_PRESET).structureHeight);
    assert.ok(defaults().structureDetail >= 0.6, 'the opening shot shows the fabric');
  });

  await t.test('architectural presets restore their required structures', () => {
    for (const preset of PRESETS) {
      const patch = presetPatch(preset.id);
      assert.ok(Number.isFinite(patch.structureDetail), `${preset.id} detail`);
      assert.ok(Number.isFinite(patch.structureHeight), `${preset.id} height`);
      assert.equal(patch.layers.structures, preset.id === 'architecture', `${preset.id} layers`);
    }
    assert.ok(presetPatch('night-metro').structureDetail > presetPatch('overview').structureDetail,
      'the night shot is the dense one');
  });

  await t.test('the layer toggle and controls round-trip through the URL', () => {
    const store = createStore();
    store.set({ structureDetail: 0.25, structureHeight: 1.8, layers: { structures: true } });
    const hash = encodeState(store.get());
    assert.ok(hash.includes('sd=0.25') && hash.includes('sh=1.8') && hash.includes('Lx=1'));
    const restored = createStore(decodeState(`#${hash}`));
    assert.equal(restored.get().structureDetail, 0.25);
    assert.equal(restored.get().structureHeight, 1.8);
    assert.equal(restored.get().layers.structures, true);
    store.reset();
    assert.equal(store.get().layers.structures, false);
    assert.equal(store.get().structureDetail, defaults().structureDetail);
  });

  await t.test('a missing manifest degrades to a disabled layer, not a broken map', () => {
    const results = Object.fromEntries(ASSETS.map((a) => [a.id, true]));
    results.structures = false;
    const status = assess(results);
    assert.equal(status.mode, MODE.PARTIAL);
    assert.ok(status.disableLayers.includes('structures'));
    assert.match(status.message, /buildings and bridges/);
    assert.equal(status.trustworthy, true, 'the terrain is still real');
  });

  await t.test('user-facing copy never claims every height is real or measured', async () => {
    // The manifest says most heights are measured and the rest are estimates
    // or curated references; the copy must never round that up. This is the
    // exact overclaim a review caught in the skyline blurb.
    const forbidden = [
      /\b(?:real|true|actual|exact)\s+heights?\b/i,
      /\bat (?:its|their) (?:real|true|actual) height/i,
      /every building is a real/i,
      /footprints with measured heights\b/i,
    ];
    const sources = [
      ['preset blurbs', PRESETS.map((p) => `${p.name}: ${p.blurb}`).join('\n')],
      ['index.html', await readFile(new URL('../index.html', import.meta.url), 'utf8')],
      ['README.md', await readFile(new URL('../README.md', import.meta.url), 'utf8')],
      ['games catalog', await readFile(new URL('../../../index.html', import.meta.url), 'utf8')],
    ];
    for (const [label, text] of sources) {
      for (const re of forbidden) {
        const m = re.exec(text);
        assert.equal(m, null, `${label} overclaims: "${m && m[0]}"`);
      }
    }
    // The optional layer's About entry says where its heights came from even
    // though the opening aerial scene no longer needs that caveat in its blurb.
    const about = sources.find(([label]) => label === 'index.html')[1];
    assert.match(about, /carry a measured OSM height/i);
    assert.match(about, /estimated from storey counts|public reference heights/i);
  });

  await t.test('every theme colours the layer', () => {
    for (const id of THEME_IDS) {
      const s = THEMES[id].structure;
      assert.ok(s, `${id} has no structure palette`);
      for (const key of ['wall', 'roof', 'glow', 'cable']) assert.match(s[key], hex, `${id}.${key}`);
      assert.ok(s.glowAmount >= 0 && s.glowAmount <= 1);
    }
    assert.ok(THEMES.noir.structure.glowAmount > THEMES.dusk.structure.glowAmount,
      'night lights the windows');
  });
});

// ---------------------------------------------------------------------------
test('lazy suburban zones', async (t) => {
  const lazy = manifest.zones.filter((z) => z.lazy);
  await t.test('the manifest marks the suburbs lazy and keeps the core eager', () => {
    assert.ok(lazy.length >= 6, `${lazy.length} lazy zones`);
    for (const id of ['center-city', 'inner-city']) {
      assert.equal(manifest.zones.find((z) => z.id === id).lazy, false, `${id} must load at start`);
    }
    const eagerBytes = manifest.zones.filter((z) => !z.lazy)
      .reduce((a, z) => a + z.tiers.reduce((b, t) => b + t.bytes, 0), 0);
    assert.ok(eagerBytes < 0.85e6, `eager payload ${eagerBytes} B`);
  });

  await t.test('reach is zero inside a zone and grows outside it', () => {
    const kop = manifest.zones.find((z) => z.id === 'schuylkill-valley');
    assert.equal(zoneReachM(kop.bounds, -75.38, 40.09), 0);
    const east = zoneReachM(kop.bounds, kop.bounds.east + 0.1, 40.09);
    assert.ok(east > 8000 && east < 9000, `0.1 deg east is ~8.5 km, got ${east}`);
    const cityHall = zoneReachM(kop.bounds, -75.1635, 39.9526);
    assert.ok(cityHall > 14000 && cityHall < 20000, `City Hall is ${cityHall} m from the zone`);
  });

  await t.test('activation needs a near target, a low camera and a lazy zone', () => {
    const kop = manifest.zones.find((z) => z.id === 'schuylkill-valley');
    assert.equal(shouldActivateZone(kop, { lon: -75.38, lat: 40.09, dist: 7000 }), true);
    assert.equal(shouldActivateZone(kop, { lon: -75.38, lat: 40.09, dist: 90000 }), false, 'too far out');
    assert.equal(shouldActivateZone(kop, { lon: -74.75, lat: 40.22, dist: 7000 }), false, 'Trenton is out of reach');
    const core = manifest.zones.find((z) => z.id === 'center-city');
    assert.equal(shouldActivateZone(core, { lon: -75.16, lat: 39.95, dist: 7000 }), false, 'core zones are eager');
    assert.equal(shouldActivateZone(null, { lon: 0, lat: 0, dist: 1 }), false);
  });
});

// ---------------------------------------------------------------------------
test('documented construction years', async (t) => {
  await t.test('the manifest counts dated buildings and every curated name was placed', () => {
    const d = manifest.dated;
    assert.ok(d.curated >= 25, `${d.curated} curated-dated buildings`);
    assert.ok(d.osm >= 40, `${d.osm} OSM-dated buildings`);
    assert.ok(d.undated > d.curated + d.osm, 'most buildings are honestly undated');
    assert.deepEqual(d.historicUnmatched, [], 'a curated name that matches nothing is a lie in waiting');
    assert.match(d.note, /licence reserves all database rights/);
  });

  await t.test('the streams carry years only where the manifest says they exist', async () => {
    let dated = 0;
    let undated = 0;
    for (const zone of manifest.zones) {
      for (const tier of zone.tiers) {
        const parsed = parseTier((await readFile(new URL(tier.file, dataDir))).buffer);
        for (const b of parsed.buildings) {
          if (b.year) {
            dated += 1;
            assert.ok(b.year >= 1600 && b.year <= 2030, `year ${b.year}`);
            assert.ok(b.yearSource !== 'none', 'a year always names its source');
          } else {
            undated += 1;
            assert.equal(b.yearSource, 'none');
          }
        }
      }
    }
    assert.equal(dated, manifest.dated.curated + manifest.dated.osm);
    assert.equal(undated, manifest.dated.undated);
  });

  await t.test('the curated list cites a source for every year', async () => {
    const doc = JSON.parse(await readFile(new URL('historic-buildings.json', dataDir.href.replace(/structures\/$/, '')), 'utf8'));
    for (const [name, entry] of Object.entries(doc.buildings)) {
      assert.ok(entry.year > 1600 && entry.year < 2030, `${name} year`);
      assert.match(entry.source, /Wikipedia|OpenStreetMap/, `${name} needs a public source`);
    }
    assert.match(doc.note, /absence of a date is not evidence of absence/);
  });
});
