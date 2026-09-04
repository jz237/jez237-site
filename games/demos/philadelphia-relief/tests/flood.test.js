/**
 * Flood data: the packed FEMA file decodes, matches its manifest, stays inside
 * the region, and carries its provenance and use constraints.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import {
  decodeFlood, ringAreaKm2, scenarioClass, snapScenario, floodSelection, floodLegend,
  FEMA_STYLE,
} from '../src/flood.js';

const dataDir = new URL('../data/flood/', import.meta.url);

async function loadPack(stem) {
  const manifest = JSON.parse(await readFile(new URL(`${stem}.json`, dataDir), 'utf8'));
  const bytes = await readFile(new URL(`${stem}.bin`, dataDir));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return { manifest, decoded: decodeFlood(buffer) };
}

function checkPack(manifest, decoded) {
  assert.equal(decoded.count, Object.values(manifest.kept).reduce((a, b) => a + b, 0));
  const [west, south, east, north] = manifest.bounds;
  assert.deepEqual(decoded.bounds, { west, south, east, north });
  let vertices = 0;
  let area = 0;
  for (const [cls, polys] of decoded.classes) {
    assert.ok(cls < manifest.classes.length, `class ${cls} named in the manifest`);
    assert.equal(polys.length, manifest.kept[manifest.classes[cls]]);
    for (const { ring } of polys) {
      assert.ok(ring.length >= 4);
      assert.deepEqual(ring[0], ring[ring.length - 1], 'rings are closed');
      for (const [lon, lat] of ring) {
        assert.ok(lon >= west && lon <= east && lat >= south && lat <= north, 'inside the region');
      }
      vertices += ring.length - 1;
      area += ringAreaKm2(ring);
    }
  }
  assert.equal(vertices, manifest.vertices);
  return area;
}

test('FEMA flood zones', { skip: !existsSync(new URL('fema-nfhl.bin', dataDir)) }, async (t) => {
  const { manifest, decoded } = await loadPack('fema-nfhl');

  await t.test('decodes and matches the manifest', () => {
    const area = checkPack(manifest, decoded);
    assert.deepEqual(manifest.classes, ['sfha', 'coastal', 'moderate']);
    assert.ok(manifest.kept.sfha > 1000 && manifest.kept.moderate > 500 && manifest.kept.coastal > 10);
    assert.ok(area > 500 && area < 2000, `plausible flooded area ${area.toFixed(0)} km²`);
    assert.ok(manifest.bytes < 1.6e6, 'the shipped file stays small');
  });

  await t.test('carries its provenance and caveats', () => {
    assert.match(manifest.source.name, /FEMA National Flood Hazard Layer/);
    assert.match(manifest.source.license, /public domain/i);
    assert.match(manifest.source.note, /not for insurance/i);
    assert.match(manifest.source.url, /^https:\/\/hazards\.fema\.gov\//);
    assert.ok(manifest.source.fetched);
    assert.ok(manifest.withBaseFloodElevation > 100);
  });

  await t.test('base flood elevations are tenths of a foot where mapped', () => {
    let withBfe = 0;
    for (const polys of decoded.classes.values()) {
      for (const { value } of polys) if (value !== null) { withBfe += 1; assert.ok(value > 0 && value < 6000); }
    }
    assert.ok(withBfe > 100);
  });
});

test('NOAA sea level rise', { skip: !existsSync(new URL('noaa-slr.bin', dataDir)) }, async (t) => {
  const { manifest, decoded } = await loadPack('noaa-slr');

  await t.test('decodes, matches the manifest and grows with the scenario', () => {
    checkPack(manifest, decoded);
    const areas = manifest.classes.map((c, i) => (decoded.classes.get(i) || [])
      .reduce((a, p) => a + ringAreaKm2(p.ring), 0));
    for (let i = 1; i < areas.length; i += 1) {
      assert.ok(areas[i] >= areas[i - 1] * 0.98, `${manifest.classes[i]} floods at least as much as ${manifest.classes[i - 1]}`);
    }
  });

  await t.test('quotes NOAA use constraint and datum', () => {
    assert.match(manifest.source.credit, /NOAA/);
    assert.match(manifest.source.useConstraint, /scale of potential flooding, not the exact location/);
    assert.match(manifest.source.datum, /MHHW/);
    assert.equal(scenarioClass(manifest.scenariosFt, manifest.scenariosFt[2]), 2);
    assert.equal(scenarioClass(manifest.scenariosFt, 99), null);
  });
});

test('flood decoder rejects junk', () => {
  const junk = new Uint8Array(48);
  assert.throws(() => decodeFlood(junk.buffer), /bad magic/);
  const header = new Uint8Array(HEADER_LIKE());
  assert.throws(() => decodeFlood(header.buffer), /truncated/);
});

function HEADER_LIKE() {
  const buf = new ArrayBuffer(44);
  const v = new DataView(buf);
  [80, 72, 70, 49].forEach((c, i) => v.setUint8(i, c));
  v.setUint32(4, 1, true);
  v.setFloat64(8, -75.8, true); v.setFloat64(16, 39.7, true);
  v.setFloat64(24, -74.7, true); v.setFloat64(32, 40.6, true);
  return buf;
}

test('flood selection and legend', async (t) => {
  await t.test('scenarios snap to the published feet', () => {
    assert.equal(snapScenario([1, 2, 3, 4, 5, 6, 8, 10], 7), 6);
    assert.equal(snapScenario([1, 2, 3, 4, 5, 6, 8, 10], 9), 8);
    assert.equal(snapScenario([1, 2, 3, 4, 5, 6, 8, 10], 10), 10);
    assert.equal(snapScenario([1, 2, 3, 4, 5, 6, 8, 10], 0), 1);
    assert.equal(snapScenario(undefined, 3), 3);
  });

  await t.test('the layer off shows nothing; FEMA shows its three classes; SLR one scenario', () => {
    const off = floodSelection({ layers: { flood: false }, floodMode: 'fema', seaLevelRise: 3 });
    assert.equal(off.on, false);
    assert.equal(off.keys.size, 0);
    assert.equal(floodLegend(off), null);
    const fema = floodSelection({ layers: { flood: true }, floodMode: 'fema', seaLevelRise: 3 }, {});
    assert.deepEqual([...fema.keys].sort(), ['fema:coastal', 'fema:moderate', 'fema:sfha']);
    const legend = floodLegend(fema, { fema: { source: { fetched: '2026-09-04' } } });
    assert.equal(legend.rows.length, Object.keys(FEMA_STYLE).length);
    assert.match(legend.source, /FEMA National Flood Hazard Layer, public domain, fetched 2026-09-04/);
    assert.match(legend.caveat, /Not for insurance/);
    const slr = floodSelection({ layers: { flood: true }, floodMode: 'slr', seaLevelRise: 7 },
      { slr: { scenariosFt: [1, 2, 3, 4, 5, 6, 8, 10] } });
    assert.deepEqual([...slr.keys], ['slr:6ft']);
    assert.equal(slr.scenarioFt, 6);
    assert.match(floodLegend(slr, {}).caveat, /scale of potential flooding, not the exact location/);
  });

  await t.test('a source that failed to load is reported, not faked', () => {
    const sel = floodSelection({ layers: { flood: true }, floodMode: 'slr', seaLevelRise: 3 }, { slr: null });
    assert.equal(sel.available, false);
    const legend = floodLegend(sel, { slr: null });
    assert.equal(legend.rows.length, 0);
    assert.match(legend.caveat, /could not be loaded/);
  });
});
