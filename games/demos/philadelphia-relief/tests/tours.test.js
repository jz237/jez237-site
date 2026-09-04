/**
 * Guided tours: every tour resolves at every seam, every caption names its
 * source, overrides stay inside the region, and the grand tour is the
 * flythrough with captions laid on (so the two cannot drift).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TOURS, DEFAULT_TOUR, getTour, shotPatch, tourDuration, tourShotStart, tourFrame,
} from '../src/tours.js';
import { TOUR, PRESET_IDS, getPreset, blendPatches, presetPatch } from '../src/presets.js';
import { CAMERA, CONTROLS } from '../src/schema.js';

test('tours', async (t) => {
  await t.test('there are several tours and the default exists', () => {
    assert.ok(TOURS.length >= 3);
    assert.ok(getTour(DEFAULT_TOUR));
    assert.equal(new Set(TOURS.map((x) => x.id)).size, TOURS.length, 'tour ids unique');
    for (const tour of TOURS) {
      assert.ok(tour.name && tour.blurb, `${tour.id} needs a name and blurb`);
      assert.ok(tour.shots.length >= 3, `${tour.id} is too short to be a tour`);
    }
  });

  await t.test('the grand tour is the flythrough with captions, shot for shot', () => {
    const grand = getTour('grand');
    assert.equal(grand.shots.length, TOUR.length);
    grand.shots.forEach((shot, i) => {
      assert.equal(shot.preset, TOUR[i].preset);
      assert.equal(shot.hold, TOUR[i].hold);
      assert.equal(shot.travel, TOUR[i].travel);
      assert.ok(shot.caption, `grand shot ${i} (${shot.preset}) has no caption`);
    });
  });

  await t.test('every shot names a real preset and every caption names its source', () => {
    for (const tour of TOURS) {
      for (const [i, shot] of tour.shots.entries()) {
        assert.ok(getPreset(shot.preset), `${tour.id}#${i} preset ${shot.preset}`);
        assert.ok(shot.hold > 0, `${tour.id}#${i} hold`);
        assert.ok(shot.travel >= 0, `${tour.id}#${i} travel`);
        const c = shot.caption;
        assert.ok(c && c.title && c.text && c.source, `${tour.id}#${i} caption incomplete`);
        assert.ok(c.text.length > 30 && c.text.length < 320, `${tour.id}#${i} caption length`);
        // A caption that states a height, span or date must say where it got it.
        if (/\b\d{3,4}\b/.test(c.text)) {
          assert.match(c.source, /OpenStreetMap|reference|elevation|Wikipedia/i,
            `${tour.id}#${i} states a number without a data source`);
        }
      }
    }
  });

  await t.test('overrides are coerced and keep the camera inside the region', () => {
    for (const tour of TOURS) {
      for (const [i, shot] of tour.shots.entries()) {
        const patch = shotPatch(shot);
        assert.ok(patch, `${tour.id}#${i} no patch`);
        for (const key of Object.keys(CAMERA)) {
          assert.ok(Number.isFinite(patch[key]), `${tour.id}#${i} ${key}`);
          const spec = CAMERA[key];
          if (!spec.wrap) assert.ok(patch[key] >= spec.min && patch[key] <= spec.max, `${tour.id}#${i} ${key} out of range`);
        }
        assert.equal(patch.preset, shot.preset, 'override never changes the preset identity');
        if (shot.override) {
          for (const key of Object.keys(shot.override)) {
            assert.ok(key in CAMERA || key in CONTROLS, `${tour.id}#${i} override key ${key}`);
          }
        }
      }
    }
  });

  await t.test('every tour resolves at every seam and loops', () => {
    for (const tour of TOURS) {
      const total = tourDuration(tour);
      assert.ok(total > 15, `${tour.id} duration ${total}`);
      const samples = [0, 0.001, total / 2, total - 0.001, total, total * 2.5, -3];
      for (let time = 0; time < total; time += 0.31) samples.push(time);
      for (const time of samples) {
        const f = tourFrame(tour, time);
        assert.ok(f && f.patch && f.caption, `${tour.id} t=${time}`);
        assert.ok(['hold', 'travel'].includes(f.phase));
        for (const key of Object.keys(CAMERA)) {
          assert.ok(Number.isFinite(f.patch[key]), `${tour.id} t=${time} ${key}`);
        }
      }
      tour.shots.forEach((shot, i) => {
        const f = tourFrame(tour, tourShotStart(tour, i) + 0.01);
        assert.equal(f.index, i, `${tour.id} marker ${i} opens its own shot`);
        assert.equal(f.phase, 'hold');
        assert.equal(f.caption, shot.caption);
      });
    }
    assert.equal(tourFrame(null, 0), null);
  });

  await t.test('captions hand over at the midpoint of a travel', () => {
    const tour = getTour('crossings');
    const first = tour.shots[0];
    const early = tourFrame(tour, first.hold + first.travel * 0.2);
    const late = tourFrame(tour, first.hold + first.travel * 0.8);
    assert.equal(early.phase, 'travel');
    assert.equal(early.caption, first.caption);
    assert.equal(late.caption, tour.shots[1].caption);
  });

  await t.test('blendPatches honours the same rules as a preset blend', () => {
    const a = presetPatch('skyline');
    const b = { ...presetPatch('skyline'), camDist: 2600, camBearing: 205, preset: 'skyline' };
    const mid = blendPatches(a, b, 0.5);
    assert.ok(Math.abs(mid.camDist - Math.sqrt(a.camDist * 2600)) < 1, 'distance blends geometrically');
    assert.equal(mid.theme, a.theme);
    assert.equal(mid.preset, 'skyline');
    assert.equal(blendPatches(null, b, 0.5), null);
  });

  await t.test('the crossings tour visits every required bridge', () => {
    const titles = getTour('crossings').shots.map((s) => s.caption.title).join(' | ');
    for (const name of ['Benjamin Franklin', 'Walt Whitman', 'Betsy Ross', 'Tacony']) {
      assert.match(titles, new RegExp(name));
    }
    assert.ok(PRESET_IDS.includes('ben-franklin-bridge'));
  });
});
