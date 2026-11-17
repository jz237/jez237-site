/**
 * Named sharing and the categorised search index.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { buildShareUrl, readViewName, cleanViewName, decodeState, resolveViewHash, VIEW_NAME_MAX } from '../src/urlstate.js';
import { defaults } from '../src/schema.js';
import { createStore } from '../src/state.js';
import { presetPatch } from '../src/presets.js';
import { selectPhotoMode } from '../src/photo-policy.js';
import { buildSearchIndex } from '../src/ui.js';

const dataDir = new URL('../data/', import.meta.url);
const places = JSON.parse(await readFile(new URL('places.geojson', dataDir), 'utf8'));
const landmarks = JSON.parse(await readFile(new URL('landmarks.json', dataDir), 'utf8'));
const cards = JSON.parse(await readFile(new URL('landmark-cards.json', dataDir), 'utf8')).cards;

test('named sharing', async (t) => {
  await t.test('a name rides in the hash and comes back clean', () => {
    const state = { ...defaults(), camDist: 9000 };
    const url = buildShareUrl('https://example.test/map/#old', state, '  Manayunk\tat sunrise  ');
    assert.match(url, /^https:\/\/example\.test\/map\/#/);
    assert.match(url, /(^|[#&])d=9000(&|$)/);
    assert.match(url, /n=Manayunk%20at%20sunrise/);
    assert.equal(readViewName(url.slice(url.indexOf('#'))), 'Manayunk at sunrise');
    // The name never leaks into the state patch.
    const patch = decodeState(url.slice(url.indexOf('#')));
    assert.equal(patch.camDist, 9000);
    assert.equal(patch.n, undefined);
  });

  await t.test('no name, no key; junk names are trimmed, capped and de-controlled', () => {
    assert.doesNotMatch(buildShareUrl('https://example.test/', defaults(), ''), /n=/);
    assert.equal(buildShareUrl('https://example.test/', defaults(), ''), 'https://example.test/');
    assert.equal(cleanViewName('a\u0000b\nc'), 'a b c');
    assert.equal(cleanViewName('x'.repeat(200)).length, VIEW_NAME_MAX);
    assert.equal(cleanViewName(42), '');
    assert.equal(readViewName('#d=1'), '');
    assert.equal(readViewName(''), '');
  });

  await t.test('a name at the length limit can still be shared when it ends with an emoji', () => {
    const fits = 'A'.repeat(VIEW_NAME_MAX - 2) + '🌆';
    const clipped = 'A'.repeat(VIEW_NAME_MAX - 1);
    for (const [input, expected] of [[fits, fits], [clipped + '🌆', clipped], ['B\uD83CCD', 'BCD']]) {
      const hash = new URL(buildShareUrl('https://example.test/map/?from=share', defaults(), input)).hash;
      assert.equal(readViewName(hash), expected);
    }
    assert.equal(readViewName('#n=' + encodeURIComponent(clipped + '🌆')), clipped);
  });
});

test('a shared view restores the same camera, layers and settings in an existing tab as on startup', () => {
  const hash = '#d=12000&n=River%20overview';
  const { state, name } = resolveViewHash(hash);
  const open = createStore({ ...presetPatch('architecture'), camLon: -75.1636,
    photoMode: 'photo', streetMotion: 'on', layers: { flood: true, imagery: false } });
  open.set(state, { source: 'hash' });
  const { lastChangeSource, ...restored } = open.get();
  assert.equal(lastChangeSource, 'hash');
  assert.deepEqual(restored, { ...defaults(), camDist: 12000 });
  assert.deepEqual(restored, createStore(state).get());
  assert.equal(name, 'River overview');
  assert.equal(resolveViewHash('#P=architecture').state.preset, 'architecture');
});

test('empty and name-only links restore defaults while ordinary document anchors stay local', () => {
  assert.deepEqual(resolveViewHash('#n=Home'), { name: 'Home', state: defaults() });
  assert.deepEqual(resolveViewHash(''), { name: '', state: defaults() });
  assert.deepEqual(resolveViewHash('#'), resolveViewHash(''));
  assert.equal(resolveViewHash('#studio'), null);
  assert.equal(buildShareUrl('https://example.test/map/?from=share#d=650', defaults()),
    'https://example.test/map/?from=share');
});

test('explicit photo requests use full graphics unless a link also requests lighter graphics', () => {
  const device = { lightweight: 1, disabledLayers: ['imagery'] };
  assert.equal(resolveViewHash('#d=650', device).state.lightweight, 1);
  const photo = resolveViewHash('#pm=photo&d=650', device).state;
  assert.equal(photo.lightweight, 0);
  assert.equal(photo.layers.imagery, false);
  assert.equal(resolveViewHash('#pm=photo&lg=1').state.lightweight, 1);
  assert.equal(resolveViewHash('#pm=auto&lg=0', device).state.lightweight, 0);
  assert.deepEqual(selectPhotoMode('photo'), { photoMode: 'photo', lightweight: 0 });
  assert.deepEqual(selectPhotoMode('auto'), { photoMode: 'auto' });
});

test('search index', async (t) => {
  const entries = buildSearchIndex(places, landmarks, { cards });
  const groups = new Set(entries.map((e) => e.group));

  await t.test('covers scenes, tours, eras, layers, bridges, landmarks and places', () => {
    for (const g of ['Scenes', 'Tours', 'Eras', 'Layers', 'Bridges & structures', 'Landmarks', 'Places']) {
      assert.ok(groups.has(g), `group ${g}`);
    }
    assert.ok(entries.some((e) => e.kind === 'tour' && e.tourId === 'grand'));
    assert.ok(entries.some((e) => e.kind === 'era' && e.eraId === '1776'));
    assert.ok(!entries.some((e) => e.kind === 'era' && e.eraId === 'present'), 'the present is not a view to search for');
    assert.equal(entries.filter((e) => e.kind === 'flood').length, 2);
    assert.ok(entries.some((e) => e.kindLabel === 'Bridge' && /Walt Whitman/.test(e.name)));
  });

  await t.test('landmarks take their category from their card', () => {
    const hall = entries.find((e) => e.name === 'Independence Hall');
    assert.equal(hall.kindLabel, 'Civic');
    assert.equal(hall.card, true);
    const boathouses = entries.find((e) => e.name === 'Boathouse Row');
    assert.equal(boathouses.kindLabel, 'Water');
    // A name that is also a scene stays a scene: the authored shot outranks the label.
    assert.equal(entries.find((e) => e.name === 'Wissahickon Valley').kind, 'preset');
    const uncarded = entries.find((e) => e.kind === 'landmark' && !e.card);
    assert.equal(uncarded.kindLabel, 'Landmark');
  });
});
