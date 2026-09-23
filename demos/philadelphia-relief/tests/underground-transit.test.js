import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transitMask } from '../src/underground-transit.js';
const data = JSON.parse(readFileSync(new URL('../data/underground/septa-rail.json',import.meta.url)));

test('published network includes all Metro rail groups and all 13 Regional Rail lines', () => {
  const ids = data.routes.map(r => r.id);
  for (const id of ['L1','B1','B2','B3','T1','T2','T3','T4','T5','G1','D1','D2','M1']) {
    assert.ok(ids.includes(id), id);
  }
  assert.equal(data.routes.filter(r => r.mode === 'regional').length, 13);
  assert.equal(data.routes.length, 26);
  for (const route of data.routes) {
    const bit = transitMask(data.routes,route.id);
    assert.ok(data.segments.some(s => s[5] & bit), route.id);
    assert.ok(data.stops.some(s => s[3] & bit), route.id);
  }
});

test('key termini and missing branches are present beyond Center City', () => {
  const stops = id => data.stops.filter(s => s[3] & transitMask(data.routes,id)).map(s => s[0]);
  assert.ok(stops('L1').some(n => n.includes('Frankford Transit')));
  assert.ok(stops('L1').some(n => n.includes('69th')));
  assert.ok(stops('B1').some(n => n.includes('Fern Rock')));
  assert.ok(stops('B1').some(n => n.includes('NRG')));
  assert.ok(stops('B3').some(n => /8th/.test(n)));
  assert.ok(stops('TRE').includes('Trenton Transit Center'));
  assert.ok(stops('PAO').includes('Thorndale'));
  assert.ok(stops('LAN').includes('Doylestown'));
});

test('shared corridors retain membership while mode filters stay separate', () => {
  const metro = transitMask(data.routes,'metro'), regional = transitMask(data.routes,'regional');
  assert.equal(metro & regional, 0);
  assert.equal(metro | regional, transitMask(data.routes,'all'));
  assert.equal(transitMask(data.routes,'unknown'), 0);
  assert.ok(data.segments.some(s => (s[5] & metro) && (s[5] & (s[5]-1))));
  for (const segment of data.segments) {
    assert.ok(segment.slice(0,4).every(Number.isFinite));
    assert.ok([0,1,2].includes(segment[4]));
    assert.ok(segment[5] > 0 && segment[5] <= transitMask(data.routes,'all'));
  }
});
