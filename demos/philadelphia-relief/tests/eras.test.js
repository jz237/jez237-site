/**
 * Historical views: the era rules, what a documented year does to a building,
 * and which bridges and landmarks exist in each era, checked against the
 * shipped data.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ERAS, ERA_IDS, getEra, eraYear, eraRules, buildingEraState, bridgesInEra, landmarkInEra,
  PRESENT_YEAR,
} from '../src/eras.js';

const dataDir = new URL('../data/', import.meta.url);
const bridges = JSON.parse(await readFile(new URL('structures/bridges.json', dataDir), 'utf8')).bridges;
const landmarks = JSON.parse(await readFile(new URL('landmarks.json', dataDir), 'utf8')).landmarks;
const extent = JSON.parse(await readFile(new URL('eras/philadelphia-1776.geojson', dataDir), 'utf8'));

test('eras', async (t) => {
  await t.test('four eras, present first, each with a note and sources', () => {
    assert.deepEqual(ERA_IDS, ['present', '1950s', 'industrial', '1776']);
    assert.equal(eraYear('present'), PRESENT_YEAR);
    for (const era of ERAS.slice(1)) {
      assert.ok(era.note.length > 80, `${era.id} explains itself`);
      assert.ok(era.sources.length >= 2, `${era.id} cites sources`);
      for (const [, url] of era.sources) assert.match(url, /^https:\/\/(en\.wikipedia\.org|www\.loc\.gov)\//);
    }
    assert.equal(getEra('nonsense').id, 'present');
  });

  await t.test('rules: rail from 1834, motorways hidden then ghosted, the 1776 extent only in 1776', () => {
    assert.deepEqual(eraRules('present'), { year: PRESENT_YEAR, present: true, rail: true,
      motorways: 'show', extent1776: false, ghostUndated: false });
    assert.equal(eraRules('1950s').motorways, 'ghost');
    assert.equal(eraRules('industrial').motorways, 'hide');
    assert.equal(eraRules('industrial').rail, true);
    assert.equal(eraRules('1776').rail, false);
    assert.equal(eraRules('1776').extent1776, true);
    assert.equal(eraRules('1950s').ghostUndated, true);
  });

  await t.test('a documented year decides solid or hidden; no year means ghost', () => {
    assert.equal(buildingEraState(1753, '1776'), 'solid');
    assert.equal(buildingEraState(1901, '1776'), 'hidden');
    assert.equal(buildingEraState(1901, 'industrial'), 'hidden', 'City Hall was finished in 1901');
    assert.equal(buildingEraState(1901, '1950s'), 'solid');
    assert.equal(buildingEraState(0, '1950s'), 'ghost');
    assert.equal(buildingEraState(0, 'present'), 'solid');
    assert.equal(buildingEraState(2018, 'present'), 'solid');
  });

  await t.test('the Delaware crossings appear in the right eras', () => {
    const names = (era) => bridgesInEra(bridges, era).map((b) => b.name).sort();
    assert.deepEqual(names('1776'), []);
    assert.deepEqual(names('industrial'), [], 'no road bridge crossed the Delaware here before 1926');
    assert.deepEqual(names('1950s'), ['Benjamin Franklin Bridge', 'Burlington-Bristol Bridge', 'Tacony-Palmyra Bridge']);
    assert.equal(names('present').length, bridges.length);
    for (const b of bridges) assert.ok(b.opened > 1900 && b.opened < 2000, `${b.name} has an opening year`);
  });

  await t.test('dated landmarks vanish before their time; undated ones stay', () => {
    const levittown = landmarks.find((l) => l.n === 'Levittown');
    assert.equal(levittown.since, 1952);
    assert.equal(landmarkInEra(levittown, '1950s'), true);
    assert.equal(landmarkInEra(levittown, 'industrial'), false);
    const hall = landmarks.find((l) => l.n === 'Independence Hall');
    assert.equal(landmarkInEra(hall, '1776'), true, 'no since: stays');
    assert.ok(landmarks.filter((l) => l.since).length >= 10);
  });

  await t.test('the 1776 extent is labelled approximate and cites the public-domain plan', () => {
    assert.match(extent.note, /approximate/i);
    assert.match(extent.source.name, /Faden/);
    assert.equal(extent.source.license, 'public domain');
    assert.match(extent.source.url, /^https:\/\/www\.loc\.gov\//);
    for (const f of extent.features) {
      assert.match(f.properties.n, /approximate/);
      const ring = f.geometry.coordinates[0];
      assert.ok(ring.length >= 5);
      assert.deepEqual(ring[0], ring[ring.length - 1]);
      for (const [lon, lat] of ring) assert.ok(lon > -75.3 && lon < -75.1 && lat > 39.9 && lat < 40.1);
    }
  });
});
