/**
 * Deterministic tests for the app's pure core: schema coercion, the store,
 * preset transitions, layer toggles, URL round-trips and degraded-mode policy.
 *
 * These modules are kept free of DOM and WebGL precisely so the whole state
 * machine can be driven here, in Node, with no browser.
 *
 *   node --test tests/
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONTROLS, CAMERA, LAYERS, defaults, coerce, coercePatch,
} from '../src/schema.js';
import { createStore, isCheapChange } from '../src/state.js';
import {
  PRESETS, PRESET_IDS, HOME_PRESET, getPreset, presetPatch, blendPresets, PRESET_EXCLUDED,
  PRESET_EXCLUDED_LAYERS,
  TOUR, TOUR_DURATION, tourAt, tourTimeForShot, QUICK_JUMPS,
} from '../src/presets.js';
import { encodeState, decodeState, buildShareUrl } from '../src/urlstate.js';
import { assess, MODE, ASSETS, syntheticGrid, formatList, webglFailure } from '../src/degraded.js';
import {
  createProjection, createElevationSampler, metersPerPixel, equivalentZoom,
  scaleBar, compassPoint, formatLatLon, normalizeAngle, shortestAngleDelta,
  lerpAngle, easeInOutCubic, damp,
} from '../src/geo.js';
import { THEMES, THEME_IDS, getTheme, hexToRgb, sampleRamp, bakeRamp } from '../src/themes.js';
import { triangulate, groupLines, collectRings } from '../src/vectors.js';
import { warpForDistance, fogDensityFor, decodeHeightmap, buildMacroGrid } from '../src/terrain.js';
import { buildLabelCandidates } from '../src/labels.js';

// A stand-in for terrain.json with the same shape as the real one.
const META = {
  width: 8,
  height: 8,
  bounds: { west: -75.8, east: -74.7, south: 39.7, north: 40.55 },
  elevation: { min: -5, max: 377, step: 0.25 },
  projection: {
    lat0: 40.125, lon0: -75.25,
    metersPerDegLat: 111033.4, metersPerDegLon: 85253.6,
    widthM: 93778.9, heightM: 94378.4,
  },
  stats: { p02M: -0.5, p98M: 266.2, sampleSpacingM: 45.8 },
  probes: [],
};

// ---------------------------------------------------------------------------
test('schema', async (t) => {
  await t.test('every control and layer has a unique URL key', () => {
    const keys = new Map();
    for (const [id, spec] of Object.entries({ ...CONTROLS, ...CAMERA })) {
      assert.ok(spec.k, `${id} has no URL key`);
      assert.ok(!keys.has(spec.k), `key "${spec.k}" reused by ${id} and ${keys.get(spec.k)}`);
      keys.set(spec.k, id);
    }
    for (const [id, spec] of Object.entries(LAYERS)) {
      assert.ok(!keys.has(spec.k), `layer key "${spec.k}" collides with ${keys.get(spec.k)}`);
      keys.set(spec.k, id);
    }
  });

  await t.test('every default is inside its own declared domain', () => {
    for (const [id, spec] of Object.entries({ ...CONTROLS, ...CAMERA })) {
      if (spec.kind === 'enum') {
        assert.ok(spec.values.includes(spec.def), `${id} default not in values`);
      } else {
        assert.ok(spec.def >= spec.min && spec.def <= spec.max,
          `${id} default ${spec.def} outside [${spec.min}, ${spec.max}]`);
      }
    }
  });

  await t.test('every default survives its own coercion', () => {
    // A default that is not on its own step grid silently changes the first
    // time it round-trips through a URL, which is how keyLight 1.15 -> 1.16
    // broke a shared link during development.
    for (const [id] of Object.entries({ ...CONTROLS, ...CAMERA })) {
      const def = defaults()[id];
      assert.equal(coerce(id, def), def, `${id} default ${def} is not on its own grid`);
    }
  });

  await t.test('coerce clamps, snaps and wraps', () => {
    assert.equal(coerce('exaggeration', 1000), CONTROLS.exaggeration.max);
    assert.equal(coerce('exaggeration', -50), CONTROLS.exaggeration.min);
    assert.equal(coerce('sunAzimuth', 370), 10, 'azimuth wraps rather than clamping');
    assert.equal(coerce('sunAzimuth', -10), 350);
    assert.equal(coerce('camPitch', 200), CAMERA.camPitch.max);
    assert.equal(coerce('contourInterval', '50'), 50, 'numeric enums accept strings');
    assert.equal(coerce('contourInterval', 33), undefined, 'off-list enum is rejected');
    assert.equal(coerce('theme', 'nonsense'), undefined);
    assert.equal(coerce('theme', 'noir'), 'noir');
    assert.equal(coerce('nope', 1), undefined, 'unknown key is rejected');
    assert.equal(coerce('exaggeration', 'abc'), undefined);
    assert.equal(coerce('exaggeration', NaN), undefined);
  });

  await t.test('range coercion snaps onto the control step', () => {
    // 0.5 step: 12.3 must land on 12.5, not stay at 12.3.
    assert.equal(coerce('exaggeration', 12.3), 12.5);
    assert.equal(coerce('contourStrength', 0.337), 0.34);
  });

  await t.test('coercePatch drops junk and keeps good values', () => {
    const patch = coercePatch({
      exaggeration: 20, theme: 'slate', bogus: 5, camPitch: 999,
      layers: { water: false, notALayer: true },
    });
    assert.equal(patch.exaggeration, 20);
    assert.equal(patch.theme, 'slate');
    assert.equal(patch.camPitch, CAMERA.camPitch.max);
    assert.ok(!('bogus' in patch));
    assert.deepEqual(patch.layers, { water: false });
  });

  await t.test('coercePatch survives hostile input', () => {
    for (const input of [null, undefined, 42, 'string', [], { layers: 'no' }]) {
      assert.doesNotThrow(() => coercePatch(input));
    }
    assert.deepEqual(coercePatch({ layers: 'no' }), {});
  });
});

// ---------------------------------------------------------------------------
test('store', async (t) => {
  await t.test('starts at defaults and seeds from a patch', () => {
    assert.deepEqual(createStore().get().theme, defaults().theme);
    assert.equal(createStore({ theme: 'noir' }).get().theme, 'noir');
    assert.equal(createStore({ theme: 'bogus' }).get().theme, defaults().theme);
  });

  await t.test('notifies subscribers with exactly the changed keys', () => {
    const store = createStore();
    const seen = [];
    store.subscribe((state, changed) => seen.push([...changed]));
    store.set({ exaggeration: 22 });
    assert.deepEqual(seen, [['exaggeration']]);

    seen.length = 0;
    store.set({ exaggeration: 22 });
    assert.deepEqual(seen, [], 'setting the same value notifies nobody');
  });

  await t.test('layer toggles are independent and reported per layer', () => {
    const store = createStore();
    const seen = [];
    store.subscribe((state, changed) => seen.push([...changed]));

    store.toggleLayer('rail');
    assert.equal(store.isLayerOn('rail'), !LAYERS.rail.def);
    assert.deepEqual(seen, [['layers.rail']]);

    // Other layers must be untouched by a partial layer patch.
    const before = { ...store.get().layers };
    store.set({ layers: { water: false } });
    assert.equal(store.get().layers.water, false);
    for (const id of Object.keys(LAYERS)) {
      if (id !== 'water') assert.equal(store.get().layers[id], before[id], `${id} changed`);
    }
  });

  await t.test('toggling an unknown layer is a no-op', () => {
    const store = createStore();
    const before = store.get();
    store.toggleLayer('atlantis');
    store.setLayer('atlantis', true);
    assert.deepEqual(store.get().layers, before.layers);
  });

  await t.test('reset restores every default', () => {
    const store = createStore();
    store.set({ exaggeration: 22, theme: 'noir', camDist: 3000 });
    store.setLayer('rail', true);
    store.reset();
    assert.deepEqual(
      { ...store.get(), lastChangeSource: undefined },
      { ...defaults(), lastChangeSource: undefined });
  });

  await t.test('a subscriber that writes back does not tear state or recurse forever', () => {
    const store = createStore();
    let calls = 0;
    store.subscribe((state, changed) => {
      calls += 1;
      // Classic feedback: react to one key by writing another.
      if (changed.has('exaggeration') && state.contourStrength !== 0.5) {
        store.set({ contourStrength: 0.5 });
      }
    });
    store.set({ exaggeration: 20 });
    assert.equal(store.get().exaggeration, 20);
    assert.equal(store.get().contourStrength, 0.5);
    assert.ok(calls < 10, `runaway notification loop: ${calls} calls`);
  });

  await t.test('unsubscribe stops delivery', () => {
    const store = createStore();
    let calls = 0;
    const off = store.subscribe(() => { calls += 1; });
    store.set({ fov: 50 });
    off();
    store.set({ fov: 60 });
    assert.equal(calls, 1);
  });

  await t.test('isCheapChange separates uniform tweaks from rebuilds', () => {
    assert.equal(isCheapChange(new Set(['sunAzimuth', 'fogDensity'])), true);
    assert.equal(isCheapChange(new Set(['exaggeration'])), false);
    assert.equal(isCheapChange(new Set(['layers.water'])), false);
    assert.equal(isCheapChange(new Set(['quality'])), false);
  });
});

// ---------------------------------------------------------------------------
test('presets', async (t) => {
  await t.test('the eight cinematic shots all exist and the skyline opens', () => {
    for (const id of ['skyline', 'ben-franklin-bridge', 'overview', 'dawn-delaware',
      'schuylkill-flyover', 'wissahickon', 'main-line-ridge', 'night-metro']) {
      assert.ok(getPreset(id), `missing preset ${id}`);
    }
    assert.equal(new Set(PRESET_IDS).size, PRESETS.length, 'preset ids must be unique');
    assert.equal(PRESETS.length, 11);
    // Home restores the authored relief scene and its modeled skyline.
    assert.equal(HOME_PRESET, 'skyline');
    assert.equal(PRESETS[0].id, HOME_PRESET);
    assert.equal(defaults().preset, HOME_PRESET);
    const home = presetPatch(HOME_PRESET);
    assert.ok(home.camDist < 12000, `opening camera is ${home.camDist} m out`);
    assert.equal(home.layers.imagery, true);
    assert.equal(home.layers.structures, false);
    assert.ok(home.structureDetail >= 0.6);
    // The regional view survives as its own card.
    assert.ok(presetPatch('overview').camDist > 60000);
  });

  await t.test('the defaults are exactly the opening shot', () => {
    // This is what lets a default view serialise to an empty hash and makes
    // Home land where a fresh load does.
    const opening = presetPatch(HOME_PRESET);
    const base = defaults();
    for (const key of [...Object.keys(CONTROLS), ...Object.keys(CAMERA)]) {
      if (PRESET_EXCLUDED.has(key)) continue;
      assert.equal(base[key], opening[key], `default ${key} has drifted from the opening preset`);
    }
    for (const [lid, on] of Object.entries(opening.layers)) {
      assert.equal(base.layers[lid], on, `default layer ${lid} has drifted from the opening preset`);
    }
    // Hazard overlays are a viewer's own choice: off by default and not part
    // of any restaging, so a preset never switches them off.
    assert.equal(base.layers.flood, false);
    for (const preset of PRESETS) assert.equal(presetPatch(preset.id).layers.flood, undefined);
    assert.ok(PRESET_EXCLUDED_LAYERS.has('flood'));
  });

  await t.test('presets leave the viewer\'s own preferences alone', () => {
    for (const preset of PRESETS) {
      const patch = presetPatch(preset.id);
      for (const key of PRESET_EXCLUDED) {
        assert.equal(patch[key], undefined, `${preset.id} must not override ${key}`);
      }
    }
  });

  await t.test('every preset is fully specified and in range', () => {
    for (const preset of PRESETS) {
      const patch = presetPatch(preset.id);
      assert.ok(preset.blurb && preset.blurb.length > 40, `${preset.id} needs a real blurb`);
      for (const key of Object.keys(CAMERA)) {
        assert.ok(Number.isFinite(patch[key]), `${preset.id}.${key} missing`);
        assert.equal(patch[key], coerce(key, patch[key]),
          `${preset.id}.${key} = ${patch[key]} is outside its domain`);
      }
      for (const key of Object.keys(CONTROLS)) {
        if (PRESET_EXCLUDED.has(key)) continue;
        assert.notEqual(patch[key], undefined, `${preset.id}.${key} missing`);
        assert.equal(patch[key], coerce(key, patch[key]),
          `${preset.id}.${key} = ${patch[key]} is outside its domain`);
      }
      for (const id of Object.keys(LAYERS)) {
        if (PRESET_EXCLUDED_LAYERS.has(id)) {
          assert.equal(patch.layers[id], undefined, `${preset.id} must leave layer ${id} alone`);
          continue;
        }
        assert.equal(typeof patch.layers[id], 'boolean', `${preset.id} layer ${id}`);
      }
      // Every camera target has to be inside the region we actually have data for.
      assert.ok(patch.camLon >= META.bounds.west && patch.camLon <= META.bounds.east,
        `${preset.id} camera longitude is outside the region`);
      assert.ok(patch.camLat >= META.bounds.south && patch.camLat <= META.bounds.north,
        `${preset.id} camera latitude is outside the region`);
    }
  });

  await t.test('exaggeration comes down as the camera comes in', () => {
    // 26x on a 5.6 km shot put the camera inside the hillside: the surrounding
    // uplands reared to 5 km while the eye sat at 2.8 km. Vertical stretch has
    // to shrink as the horizontal frame does.
    const shots = PRESETS.map((p) => presetPatch(p.id))
      .sort((a, b) => a.camDist - b.camDist);
    for (let i = 1; i < shots.length; i += 1) {
      assert.ok(shots[i].exaggeration >= shots[i - 1].exaggeration,
        `a ${Math.round(shots[i].camDist / 1000)} km shot is less exaggerated than `
        + `a ${Math.round(shots[i - 1].camDist / 1000)} km one`);
    }
    // And no shot may stretch the ground taller than its own frame is wide.
    for (const shot of shots) {
      const relief = 380 * shot.exaggeration;
      const frameWidth = 2 * Math.tan((shot.fov * Math.PI) / 360) * shot.camDist;
      assert.ok(relief < frameWidth,
        `${shot.preset}: ${Math.round(relief)} m of relief in a `
        + `${Math.round(frameWidth)} m frame`);
    }
  });

  await t.test('unknown preset ids resolve to null, not a broken patch', () => {
    assert.equal(getPreset('nope'), null);
    assert.equal(presetPatch('nope'), null);
    assert.equal(blendPresets('nope', 'overview', 0.5), null);
  });

  await t.test('blend endpoints reproduce the presets exactly', () => {
    const from = presetPatch('overview');
    const to = presetPatch('night-metro');
    const start = blendPresets('overview', 'night-metro', 0);
    const end = blendPresets('overview', 'night-metro', 1);
    for (const key of [...Object.keys(CONTROLS), ...Object.keys(CAMERA)]) {
      if (CONTROLS[key]?.kind === 'enum' || PRESET_EXCLUDED.has(key)) continue;
      assert.ok(Math.abs(start[key] - from[key]) < 1e-6, `start ${key}`);
      assert.ok(Math.abs(end[key] - to[key]) < 1e-6, `end ${key}`);
    }
    const staged = (layers) => Object.fromEntries(Object.entries(layers)
      .filter(([id]) => !PRESET_EXCLUDED_LAYERS.has(id)));
    assert.deepEqual(staged(start.layers), from.layers);
    assert.deepEqual(staged(end.layers), to.layers);
    assert.equal(start.preset, 'overview');
    assert.equal(end.preset, 'night-metro');
  });

  await t.test('blend stays inside every control domain throughout', () => {
    for (let i = 0; i < PRESETS.length; i += 1) {
      const a = PRESETS[i].id;
      const b = PRESETS[(i + 1) % PRESETS.length].id;
      for (let t2 = 0; t2 <= 1.0001; t2 += 0.05) {
        const patch = blendPresets(a, b, t2);
        for (const [key, spec] of Object.entries(CONTROLS)) {
          if (PRESET_EXCLUDED.has(key)) {
            assert.equal(patch[key], undefined, `${key} must stay out of a blend`);
            continue;
          }
          if (spec.kind === 'enum') {
            assert.ok(spec.values.includes(patch[key]),
              `${a}->${b} @${t2.toFixed(2)}: ${key} left its value set`);
          } else {
            assert.ok(patch[key] >= spec.min - 1e-9 && patch[key] <= spec.max + 1e-9,
              `${a}->${b} @${t2.toFixed(2)}: ${key} = ${patch[key]} out of range`);
          }
        }
        for (const [key, spec] of Object.entries(CAMERA)) {
          assert.ok(Number.isFinite(patch[key]), `${key} went non-finite`);
          if (!spec.wrap) {
            assert.ok(patch[key] >= spec.min - 1e-6 && patch[key] <= spec.max + 1e-6,
              `${a}->${b} @${t2.toFixed(2)}: ${key} = ${patch[key]} out of range`);
          }
        }
      }
    }
  });

  await t.test('the tour opens on the skyline and visits every shot once', () => {
    assert.equal(TOUR[0].preset, HOME_PRESET);
    assert.deepEqual([...new Set(TOUR.map((s) => s.preset))].sort(), PRESET_IDS.filter((id) => !['architecture', 'hidden-reef', 'bauder-signs'].includes(id)).sort());
    assert.equal(TOUR.length, PRESETS.length - 3);
  });

  await t.test('discrete values snap once at the midpoint, never blend', () => {
    // 'overview' is dusk, 'wissahickon' is verdant.
    assert.equal(blendPresets('overview', 'wissahickon', 0.1).theme, 'dusk');
    assert.equal(blendPresets('overview', 'wissahickon', 0.9).theme, 'verdant');
    const seen = new Set();
    for (let t2 = 0; t2 <= 1; t2 += 0.02) {
      seen.add(blendPresets('overview', 'wissahickon', t2).theme);
    }
    assert.deepEqual([...seen].sort(), ['dusk', 'verdant'], 'no intermediate theme');
  });

  await t.test('distance interpolates geometrically, so long moves feel even', () => {
    const mid = blendPresets('overview', 'wissahickon', 0.5).camDist;
    const a = presetPatch('overview').camDist;
    const b = presetPatch('wissahickon').camDist;
    assert.ok(mid < (a + b) / 2, 'midpoint should be below the arithmetic mean');
    assert.ok(Math.abs(mid - Math.sqrt(a * b)) < 1, 'midpoint is the geometric mean');
  });

  await t.test('bearing blending takes the short way round', () => {
    assert.equal(Math.round(lerpAngle(350, 10, 0.5)), 0);
    assert.equal(Math.round(lerpAngle(10, 350, 0.5)), 0);
    assert.equal(shortestAngleDelta(350, 10), 20);
    assert.equal(shortestAngleDelta(10, 350), -20);
  });
});

// ---------------------------------------------------------------------------
test('flythrough', async (t) => {
  await t.test('the tour covers every shot and has a positive duration', () => {
    assert.ok(TOUR_DURATION > 30);
    for (const shot of TOUR) {
      assert.ok(getPreset(shot.preset), `tour references unknown preset ${shot.preset}`);
      assert.ok(shot.hold > 0 && shot.travel > 0);
    }
  });

  await t.test('tourAt returns a usable frame at every time, including the seams', () => {
    const samples = [0, 0.001, TOUR_DURATION / 2, TOUR_DURATION - 0.001, TOUR_DURATION];
    for (let time = 0; time < TOUR_DURATION; time += 0.37) samples.push(time);
    for (const time of samples) {
      const frame = tourAt(time);
      assert.ok(frame, `no frame at t=${time}`);
      assert.ok(frame.patch, `no patch at t=${time}`);
      assert.ok(['hold', 'travel'].includes(frame.phase));
      assert.ok(frame.index >= 0 && frame.index < TOUR.length);
      for (const key of Object.keys(CAMERA)) {
        assert.ok(Number.isFinite(frame.patch[key]), `t=${time}: ${key} not finite`);
      }
    }
  });

  await t.test('the tour loops and handles negative time', () => {
    const a = tourAt(0);
    const b = tourAt(TOUR_DURATION);
    assert.equal(a.shot, b.shot);
    assert.equal(a.phase, b.phase);
    assert.ok(tourAt(-1), 'negative time still resolves');
    assert.ok(tourAt(TOUR_DURATION * 3 + 5));
  });

  await t.test('shot markers land on their own hold phase', () => {
    TOUR.forEach((shot, i) => {
      const frame = tourAt(tourTimeForShot(i) + 0.01);
      assert.equal(frame.shot, shot.preset, `marker ${i} does not open its shot`);
      assert.equal(frame.phase, 'hold');
    });
  });

  await t.test('travel phases name the shot they are heading to', () => {
    const frame = tourAt(TOUR[0].hold + TOUR[0].travel / 2);
    assert.equal(frame.phase, 'travel');
    assert.equal(frame.shot, TOUR[0].preset);
    assert.equal(frame.nextShot, TOUR[1].preset);
  });
});

// ---------------------------------------------------------------------------
test('url state', async (t) => {
  await t.test('the default view serialises to nothing', () => {
    assert.equal(encodeState(createStore().get()), '');
  });

  await t.test('round-trips an arbitrary state', () => {
    const store = createStore();
    store.set({
      exaggeration: 18, theme: 'blueprint', sunAzimuth: 300, sunAltitude: 8,
      fogDensity: 0.7, camLon: -75.21, camLat: 40.05, camDist: 5600,
      camBearing: 197, camPitch: 74, contourInterval: 10, quality: 'cinematic',
      layers: { rail: true, roads: false, parks: false },
    });
    const before = store.get();
    const restored = createStore(decodeState(`#${encodeState(before)}`));
    for (const key of [...Object.keys(CONTROLS), ...Object.keys(CAMERA)]) {
      assert.equal(restored.get()[key], before[key], `${key} did not survive the round trip`);
    }
    assert.deepEqual(restored.get().layers, before.layers);
  });

  await t.test('a preset link restores the preset and its overrides', () => {
    const store = createStore(presetPatch('wissahickon'));
    store.set({ sunAzimuth: 42 });
    const hash = encodeState(store.get());
    assert.ok(hash.includes('P=wissahickon'));
    const restored = createStore(decodeState(`#${hash}`));
    assert.equal(restored.get().preset, 'wissahickon');
    assert.equal(restored.get().sunAzimuth, 42);
    // Untouched keys still come from the preset, not the global defaults.
    assert.equal(restored.get().contourInterval, presetPatch('wissahickon').contourInterval);
  });

  await t.test('only the delta from the preset is written', () => {
    const store = createStore(presetPatch('night-metro'));
    // Nothing changed beyond selecting the preset.
    assert.equal(encodeState(store.get()), 'P=night-metro');
  });

  await t.test('hostile and empty hashes are rejected safely', () => {
    for (const hash of ['', '#', '#####', null, undefined, 42, '#unknown=1',
      '#ex=<script>', '#P=../../etc/passwd', '#ex=NaN&th=%%%']) {
      assert.doesNotThrow(() => decodeState(hash), `threw on ${hash}`);
    }
    assert.equal(decodeState(''), null);
    assert.equal(decodeState('#unknown=1'), null);
    assert.equal(decodeState('#ex=<script>'), null, 'unusable value yields no patch');
    assert.equal(decodeState('#P=../../etc/passwd'), null, 'unknown preset is ignored');
  });

  await t.test('out-of-range values in a hash are clamped, not honoured', () => {
    const patch = decodeState('#ex=99999&p=-40&d=1');
    assert.equal(patch.exaggeration, CONTROLS.exaggeration.max);
    assert.equal(patch.camPitch, CAMERA.camPitch.min);
    assert.equal(patch.camDist, CAMERA.camDist.min);
    assert.equal(CAMERA.camDist.min, 200, 'close inspection camera floor');
  });

  await t.test('layer flags survive as booleans', () => {
    const patch = decodeState(`#${LAYERS.rail.k}=1&${LAYERS.roads.k}=0`);
    assert.equal(patch.layers.rail, true);
    assert.equal(patch.layers.roads, false);
  });

  await t.test('buildShareUrl replaces an existing hash', () => {
    const store = createStore(presetPatch('wissahickon'));
    const url = buildShareUrl(
      'https://jez237.com/games/demos/philadelphia-relief/#old=1',
      store.get(),
    );
    assert.equal(
      url,
      'https://jez237.com/games/demos/philadelphia-relief/#P=wissahickon',
    );
    assert.equal(buildShareUrl('https://x/', createStore().get()), 'https://x/');
  });
});

// ---------------------------------------------------------------------------
test('degraded mode', async (t) => {
  const allOk = () => Object.fromEntries(ASSETS.map((a) => [a.id, true]));

  await t.test('everything present is full mode with no message', () => {
    const status = assess(allOk());
    assert.equal(status.mode, MODE.FULL);
    assert.deepEqual(status.missing, []);
    assert.deepEqual(status.disableLayers, []);
    assert.equal(status.message, '');
  });

  await t.test('a missing heightmap falls back but stays usable and says so', () => {
    const status = assess({ ...allOk(), heightmap: false });
    assert.equal(status.mode, MODE.FALLBACK);
    assert.equal(status.usable, true);
    assert.equal(status.trustworthy, false, 'synthetic terrain must not claim to be real');
    assert.match(status.message, /not the real Philadelphia region/i);
    // Every data-backed layer is switched off: there is no real ground to drape.
    for (const asset of ASSETS.filter((a) => a.layer)) {
      assert.ok(status.disableLayers.includes(asset.layer), `${asset.layer} still on`);
    }
  });

  await t.test('missing metadata is also fallback', () => {
    assert.equal(assess({ ...allOk(), terrain: false }).mode, MODE.FALLBACK);
  });

  await t.test('some overlays missing is partial, and names them', () => {
    const status = assess({ ...allOk(), roads: false, rail: false });
    assert.equal(status.mode, MODE.PARTIAL);
    assert.equal(status.trustworthy, true, 'the terrain is still real');
    assert.deepEqual(status.disableLayers.sort(), ['rail', 'roads']);
    assert.match(status.message, /roads/);
    assert.match(status.message, /rail/);
  });

  await t.test('all overlays missing is relief-only', () => {
    const results = allOk();
    for (const asset of ASSETS.filter((a) => !a.required)) results[asset.id] = false;
    const status = assess(results);
    assert.equal(status.mode, MODE.RELIEF_ONLY);
    assert.equal(status.trustworthy, true);
    assert.match(status.message, /relief, hillshade and contours are\s+real/);
  });

  await t.test('assess never throws on missing or partial input', () => {
    for (const input of [undefined, null, {}, { heightmap: true }]) {
      assert.doesNotThrow(() => assess(input));
      assert.equal(assess(input).usable, true);
    }
    assert.equal(assess({}).mode, MODE.FALLBACK);
  });

  await t.test('webgl failure is the one unusable state', () => {
    assert.equal(webglFailure('unsupported').usable, false);
    assert.match(webglFailure('lost').message, /reload/i);
  });

  await t.test('the synthetic grid is finite, deterministic and in a sane range', () => {
    const a = syntheticGrid(64, 64);
    const b = syntheticGrid(64, 64);
    assert.equal(a.length, 64 * 64);
    assert.deepEqual([...a], [...b], 'must be reproducible');
    for (const v of a) assert.ok(Number.isFinite(v) && v >= 0 && v < 400);
    assert.ok(Math.max(...a) - Math.min(...a) > 40, 'needs real relief to be explorable');
  });

  await t.test('formatList reads like English', () => {
    assert.equal(formatList(['a']), 'a');
    assert.equal(formatList(['a', 'b']), 'a and b');
    assert.equal(formatList(['a', 'b', 'c']), 'a, b and c');
    assert.equal(formatList([]), '');
  });
});

// ---------------------------------------------------------------------------
test('geo', async (t) => {
  const projection = createProjection(META);

  await t.test('lon/lat round-trips through world metres', () => {
    for (const [lon, lat] of [[-75.1652, 39.9526], [-75.8, 39.7], [-74.7, 40.55]]) {
      const x = projection.lonToX(lon);
      const z = projection.latToZ(lat);
      assert.ok(Math.abs(projection.xToLon(x) - lon) < 1e-9);
      assert.ok(Math.abs(projection.zToLat(z) - lat) < 1e-9);
    }
  });

  await t.test('north is -Z and east is +X', () => {
    assert.ok(projection.latToZ(40.5) < projection.latToZ(39.8), 'north must be more negative');
    assert.ok(projection.lonToX(-74.8) > projection.lonToX(-75.7), 'east must be more positive');
  });

  await t.test('clamp keeps the camera inside the region', () => {
    assert.deepEqual(projection.clamp(-80, 45), { lon: META.bounds.west, lat: META.bounds.north });
    assert.deepEqual(projection.clamp(-70, 30), { lon: META.bounds.east, lat: META.bounds.south });
    assert.equal(projection.contains(-75.16, 39.95), true);
    assert.equal(projection.contains(-70, 39.95), false);
  });

  await t.test('grid mapping puts row 0 at the north edge', () => {
    const nw = projection.toGrid(META.bounds.west, META.bounds.north, 8, 8);
    const se = projection.toGrid(META.bounds.east, META.bounds.south, 8, 8);
    assert.deepEqual(nw, { gx: 0, gy: 0 });
    assert.deepEqual(se, { gx: 7, gy: 7 });
  });

  await t.test('elevation sampling is bilinear and clamps at the edges', () => {
    // A grid that ramps 0..70 from north to south, constant across each row.
    const grid = new Float32Array(8 * 8);
    for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) grid[y * 8 + x] = y * 10;
    const sample = createElevationSampler(grid, 8, 8, projection);

    assert.equal(sample(META.bounds.west, META.bounds.north), 0);
    assert.equal(sample(META.bounds.east, META.bounds.south), 70);
    const mid = sample(-75.25, (META.bounds.north + META.bounds.south) / 2);
    assert.ok(Math.abs(mid - 35) < 1e-4, `midpoint should be 35, got ${mid}`);
    // Outside the region the sampler clamps instead of returning NaN.
    assert.equal(Number.isFinite(sample(-90, 50)), true);
    assert.equal(sample(-90, 50), 0);
  });

  await t.test('scale readouts behave', () => {
    const mpp = metersPerPixel(86000, 40, 900);
    assert.ok(mpp > 50 && mpp < 100, `unexpected m/px: ${mpp}`);
    assert.equal(metersPerPixel(1000, 40, 0), 0, 'no viewport, no scale');
    assert.ok(equivalentZoom(mpp, 40) > 8 && equivalentZoom(mpp, 40) < 13);
    assert.equal(equivalentZoom(0, 40), 0);

    const bar = scaleBar(50, 120);
    assert.ok([1, 2, 5].includes(bar.meters / Math.pow(10, Math.floor(Math.log10(bar.meters)))));
    assert.ok(bar.pixels <= 120);
    assert.match(bar.label, /^\d+(\.\d+)? (m|km)$/);
    assert.equal(scaleBar(0, 120).meters, 0);
  });

  await t.test('compass and coordinate formatting', () => {
    assert.equal(compassPoint(0), 'N');
    assert.equal(compassPoint(90), 'E');
    assert.equal(compassPoint(180), 'S');
    assert.equal(compassPoint(270), 'W');
    assert.equal(compassPoint(360), 'N');
    assert.equal(compassPoint(-90), 'W');
    assert.equal(formatLatLon(39.9526, -75.1652), '39.9526° N, 75.1652° W');
  });

  await t.test('angle helpers normalise', () => {
    assert.equal(normalizeAngle(-10), 350);
    assert.equal(normalizeAngle(730), 10);
  });

  await t.test('easing and damping are well behaved', () => {
    assert.equal(easeInOutCubic(0), 0);
    assert.equal(easeInOutCubic(1), 1);
    assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
    assert.equal(easeInOutCubic(-5), 0, 'clamped');
    assert.equal(easeInOutCubic(5), 1);
    // Damping converges and never overshoots.
    let v = 0;
    for (let i = 0; i < 200; i += 1) v = damp(v, 10, 0.1, 1 / 60);
    assert.ok(Math.abs(v - 10) < 1e-6);
    assert.equal(damp(0, 10, 0, 0.016), 10, 'zero half-life snaps');
  });
});

// ---------------------------------------------------------------------------
test('themes', async (t) => {
  await t.test('every theme is complete and every colour is a valid hex', () => {
    const required = ['label', 'note', 'ramp', 'skyTop', 'skyFill', 'skyHorizon',
      'sunColor', 'fog', 'fogTint', 'water', 'waterShallow', 'waterSpec',
      'contour', 'contourIndex', 'road', 'rail', 'boundary', 'park',
      'ink', 'inkMuted', 'halo', 'ui'];
    const hex = /^#[0-9a-f]{6}$/i;
    for (const id of THEME_IDS) {
      const theme = THEMES[id];
      for (const key of required) assert.ok(theme[key], `${id} is missing ${key}`);
      for (const [key, value] of Object.entries(theme)) {
        if (typeof value === 'string' && value.startsWith('#')) {
          assert.match(value, hex, `${id}.${key} = ${value}`);
        }
      }
      for (const c of theme.road) assert.match(c, hex, `${id}.road`);
      assert.equal(theme.road.length, 3, `${id} needs a colour per road tier`);
      for (const key of ['bg', 'panel', 'accent', 'text']) {
        assert.match(theme.ui[key], hex, `${id}.ui.${key}`);
      }
      // Ramp stops must be sorted and span the whole 0..1 domain.
      assert.equal(theme.ramp[0][0], 0);
      assert.equal(theme.ramp[theme.ramp.length - 1][0], 1);
      for (let i = 1; i < theme.ramp.length; i += 1) {
        assert.ok(theme.ramp[i][0] > theme.ramp[i - 1][0], `${id} ramp not sorted`);
      }
    }
  });

  await t.test('getTheme falls back rather than returning undefined', () => {
    assert.equal(getTheme('nope').label, THEMES.dusk.label);
  });

  await t.test('hexToRgb handles both forms and linearises', () => {
    assert.deepEqual(hexToRgb('#ffffff'), [1, 1, 1]);
    assert.deepEqual(hexToRgb('#fff'), [1, 1, 1]);
    assert.deepEqual(hexToRgb('#000000'), [0, 0, 0]);
    const [r] = hexToRgb('#808080', true);
    assert.ok(r > 0.2 && r < 0.25, `mid grey should linearise to ~0.216, got ${r}`);
  });

  await t.test('ramp sampling is monotone in lightness and clamps', () => {
    for (const id of THEME_IDS) {
      const stops = THEMES[id].ramp;
      assert.deepEqual(sampleRamp(stops, -1), sampleRamp(stops, 0));
      assert.deepEqual(sampleRamp(stops, 2), sampleRamp(stops, 1));
      const low = sampleRamp(stops, 0.05).reduce((a, b) => a + b, 0);
      const high = sampleRamp(stops, 0.95).reduce((a, b) => a + b, 0);
      assert.ok(high > low, `${id}: high ground should be lighter than low ground`);
    }
  });

  await t.test('bakeRamp produces a full LUT', () => {
    const data = bakeRamp('dusk', 256);
    assert.equal(data.length, 256 * 3);
    assert.ok(data.some((v) => v > 0));
  });
});

// ---------------------------------------------------------------------------
test('terrain helpers', async (t) => {
  await t.test('heightmap decoding inverts the build-time encoding', () => {
    const width = 4;
    const height = 2;
    const meta = {
      width, height, elevation: { min: -5, step: 0.25 },
      probes: [{ x: 0, y: 0, q: 20 }, { x: 3, y: 1, q: 1000 }],
    };
    const qs = [20, 300, 5000, 65535, 0, 7, 40000, 1000];
    const data = new Uint8ClampedArray(width * height * 4);
    qs.forEach((q, i) => {
      data[i * 4] = (q >> 8) & 255;
      data[i * 4 + 1] = q & 255;
      data[i * 4 + 3] = 255;
    });
    const { grid, probeFailures } = decodeHeightmap({ data, width, height }, meta);
    assert.equal(probeFailures.length, 0, 'matching probes must pass');
    qs.forEach((q, i) => {
      assert.ok(Math.abs(grid[i] - (-5 + q * 0.25)) < 1e-6, `sample ${i}`);
    });
  });

  await t.test('integrity probes catch a mangled heightmap', () => {
    const meta = { width: 1, height: 1, elevation: { min: 0, step: 1 },
      probes: [{ x: 0, y: 0, q: 1234 }] };
    const data = new Uint8ClampedArray([9, 9, 0, 255]);
    const { probeFailures } = decodeHeightmap({ data, width: 1, height: 1 }, meta);
    assert.equal(probeFailures.length, 1);
    assert.equal(probeFailures[0].got, 9 * 256 + 9);
  });

  await t.test('macro grid averages down to the requested size', () => {
    const grid = new Float32Array(8 * 8).fill(50);
    const macro = buildMacroGrid(grid, 8, 8, 4);
    assert.equal(macro.length, 16);
    for (const v of macro) assert.ok(Math.abs(v - 50) < 1e-6);
  });

  await t.test('the mesh warp tightens as the camera closes in', () => {
    const wide = warpForDistance(86000);
    const close = warpForDistance(5600);
    assert.ok(close > wide, 'closer camera must concentrate more vertices');
    for (const d of [1, 1200, 5600, 86000, 190000, 1e9]) {
      const k = warpForDistance(d);
      assert.ok(Number.isFinite(k) && k >= 0.35 && k <= 3.4, `warp ${k} out of bounds at ${d}`);
    }
  });

  await t.test('fog density rises with the control and is never negative', () => {
    assert.equal(fogDensityFor(0), 0);
    assert.ok(fogDensityFor(1) > fogDensityFor(0.5));
    assert.ok(fogDensityFor(0.5) > fogDensityFor(0.2));
    assert.equal(fogDensityFor(-1), 0);
    // At the default the far side of the region should be hazy but not opaque.
    const far = 1 - Math.exp(-Math.pow(130000 * fogDensityFor(0.4), 2));
    assert.ok(far > 0.45 && far < 0.95, `far-field fog ${far.toFixed(2)} is wrong`);
    const near = 1 - Math.exp(-Math.pow(8000 * fogDensityFor(0.4), 2));
    assert.ok(near < 0.05, `near-field should stay clear, got ${near.toFixed(3)}`);
  });
});

// ---------------------------------------------------------------------------
test('vector geometry', async (t) => {
  await t.test('triangulate handles a square, a concave ring and degenerate input', () => {
    assert.equal(triangulate([[0, 0], [1, 0], [1, 1], [0, 1]]).length, 6);
    // An L shape: 6 vertices -> 4 triangles.
    const l = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]];
    assert.equal(triangulate(l).length, 12);
    assert.deepEqual(triangulate([[0, 0], [1, 1]]), []);
    assert.deepEqual(triangulate([]), []);
  });

  await t.test('triangulate works regardless of winding', () => {
    const cw = [[0, 0], [0, 1], [1, 1], [1, 0]];
    const ccw = [[0, 0], [1, 0], [1, 1], [0, 1]];
    assert.equal(triangulate(cw).length, 6);
    assert.equal(triangulate(ccw).length, 6);
  });

  await t.test('triangulate terminates on a self-intersecting ring', () => {
    const bowtie = [[0, 0], [2, 2], [2, 0], [0, 2]];
    assert.doesNotThrow(() => triangulate(bowtie));
  });

  await t.test('groupLines splits by key and flattens MultiLineStrings', () => {
    const geojson = {
      features: [
        { properties: { t: 1 }, geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } },
        { properties: { t: 1 },
          geometry: { type: 'MultiLineString', coordinates: [[[0, 0], [1, 0]], [[2, 2], [3, 3]]] } },
        { properties: { t: 2 }, geometry: { type: 'LineString', coordinates: [[5, 5], [6, 6]] } },
        { properties: { t: 3 }, geometry: { type: 'Point', coordinates: [0, 0] } },
        { properties: { t: 1 }, geometry: { type: 'LineString', coordinates: [[9, 9]] } },
      ],
    };
    const groups = groupLines(geojson, (p) => p.t);
    assert.equal(groups.get(1).length, 3, 'single-point lines are dropped');
    assert.equal(groups.get(2).length, 1);
    assert.equal(groups.has(3), false, 'points are not lines');
  });

  await t.test('groupLines honours a null key as "skip"', () => {
    const geojson = {
      features: [{ properties: { t: 1 },
        geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } }],
    };
    assert.equal(groupLines(geojson, () => null).size, 0);
    assert.equal(groupLines(null, (p) => p.t).size, 0);
  });

  await t.test('collectRings pulls outer rings and can filter by area', () => {
    const geojson = {
      features: [
        { properties: { area: 100 },
          geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } },
        { properties: { area: 900000 },
          geometry: { type: 'Polygon', coordinates: [[[0, 0], [2, 0], [2, 2], [0, 0]]] } },
      ],
    };
    assert.equal(collectRings(geojson).length, 2);
    assert.equal(collectRings(geojson, 1000).length, 1);
    assert.equal(collectRings(null).length, 0);
  });
});

// ---------------------------------------------------------------------------
test('labels', async (t) => {
  await t.test('candidates merge OSM places with curated landmarks', () => {
    const places = {
      features: [
        { properties: { n: 'Ardmore', rank: 3, pop: 100, k: 'suburb' },
          geometry: { type: 'Point', coordinates: [-75.29, 40.0] } },
        { properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } },
      ],
    };
    const landmarks = { landmarks: [{ n: 'City Hall', lon: -75.16, lat: 39.95, c: 'civic', r: 1, d: 'note' }] };
    const out = buildLabelCandidates(places, landmarks);
    assert.equal(out.length, 2, 'nameless places are dropped');
    const hall = out.find((c) => c.name === 'City Hall');
    assert.equal(hall.kind, 'landmark');
    assert.equal(hall.rank, 1);
    assert.equal(hall.note, 'note');
    // Landmarks outrank same-rank places so the authored set wins ties.
    assert.ok(hall.rank < out.find((c) => c.name === 'Ardmore').rank);
  });

  await t.test('a curated landmark supersedes the OSM place of the same name', () => {
    const places = {
      features: [
        { properties: { n: 'Levittown', rank: 2, k: 'town' },
          geometry: { type: 'Point', coordinates: [-74.838, 40.15476] } },
        { properties: { n: 'Bristol', rank: 2, k: 'borough' },
          geometry: { type: 'Point', coordinates: [-74.85, 40.10] } },
      ],
    };
    const landmarks = { landmarks: [
      { n: 'Levittown', lon: -74.838, lat: 40.1548, c: 'town', r: 1, d: 'x' },
    ] };
    const out = buildLabelCandidates(places, landmarks);
    const levittowns = out.filter((c) => c.name === 'Levittown');
    assert.equal(levittowns.length, 1, 'one name must yield one candidate');
    assert.equal(levittowns[0].kind, 'landmark', 'the curated entry wins');
    assert.equal(levittowns[0].rank, 1);
    assert.ok(out.some((c) => c.name === 'Bristol'), 'unrelated places survive');
    // Case must not defeat the dedupe.
    const shouty = { landmarks: [{ n: 'LEVITTOWN', lon: -74.8, lat: 40.1, r: 1 }] };
    assert.equal(buildLabelCandidates(places, shouty)
      .filter((c) => c.name.toLowerCase() === 'levittown').length, 1);
  });

  await t.test('empty input is handled', () => {
    assert.deepEqual(buildLabelCandidates(null, null), []);
    assert.deepEqual(buildLabelCandidates({}, {}), []);
  });
});

// ---------------------------------------------------------------------------
test('shipped data', async (t) => {
  const { readFile } = await import('node:fs/promises');
  const dataDir = new URL('../data/', import.meta.url);
  const places = JSON.parse(await readFile(new URL('places.geojson', dataDir), 'utf8'));
  const landmarksDoc = JSON.parse(await readFile(new URL('landmarks.json', dataDir), 'utf8'));

  await t.test('Levittown is present exactly once and where the chip flies', () => {
    const hits = places.features.filter((f) => f.properties?.n === 'Levittown');
    assert.equal(hits.length, 1, 'places.geojson must carry exactly one Levittown');
    const [lon, lat] = hits[0].geometry.coordinates;
    const jump = QUICK_JUMPS.find((j) => j.id === 'levittown');
    assert.ok(jump, 'quick jump missing');
    // Within ~1 km of the OSM node; the chip is curated, not scraped.
    assert.ok(Math.abs(jump.lon - lon) < 0.012 && Math.abs(jump.lat - lat) < 0.009,
      `chip (${jump.lon},${jump.lat}) is far from the data (${lon},${lat})`);
    const landmark = landmarksDoc.landmarks.find((l) => l.n === 'Levittown');
    assert.ok(landmark, 'curated landmark missing');
    assert.equal(landmark.r, 1, 'must sit in the always-shown tier');
  });

  await t.test('Port Richmond is present exactly once and always labelable', () => {
    const hits = places.features.filter((f) => f.properties?.n === 'Port Richmond');
    assert.equal(hits.length, 1, 'places.geojson must carry exactly one Port Richmond');
    const landmark = landmarksDoc.landmarks.find((l) => l.n === 'Port Richmond');
    assert.ok(landmark, 'curated landmark missing');
    assert.equal(landmark.r, 1, 'must sit in the always-shown tier');
    const candidates = buildLabelCandidates(places, landmarksDoc)
      .filter((c) => c.name === 'Port Richmond');
    assert.equal(candidates.length, 1, 'Port Richmond label must be deduplicated');
    assert.equal(candidates[0].kind, 'landmark', 'the curated label must win');
  });

  await t.test('every quick jump resolves against the shipped label data', () => {
    const candidates = buildLabelCandidates(places, landmarksDoc);
    const names = new Set(candidates.map((c) => c.name.toLowerCase()));
    // Areas like Center City or the Main Line are labelled via neighbourhoods,
    // so require resolution only for jumps that name a single settlement.
    for (const jump of QUICK_JUMPS) {
      const candidate = candidates.find((c) => c.name.toLowerCase() === jump.name.toLowerCase());
      if (!candidate) continue;
      assert.ok(Math.abs(candidate.lon - jump.lon) < 0.05
        && Math.abs(candidate.lat - jump.lat) < 0.05,
        `${jump.name}: chip and label disagree by more than ~5 km`);
    }
    assert.ok(names.has('levittown'), 'Levittown must be a label candidate');
    assert.ok(names.has('port richmond'), 'Port Richmond must be a label candidate');
    const dupes = candidates.map((c) => c.name.toLowerCase())
      .filter((n, i, arr) => arr.indexOf(n) !== i);
    assert.ok(!dupes.includes('levittown'), 'Levittown label is duplicated');
  });
});

// ---------------------------------------------------------------------------
test('quick jumps', async (t) => {
  await t.test('every required destination is reachable and inside the region', () => {
    const required = ['Center City', 'South Philadelphia', 'University City', 'Manayunk',
      'Chestnut Hill', 'Northeast Philadelphia', 'King of Prussia', 'Media',
      'Doylestown', 'Levittown', 'Camden', 'Cherry Hill', 'Valley Forge',
      'Walt Whitman Bridge', 'Betsy Ross Bridge', 'Tacony-Palmyra Bridge', 'Sports Complex'];
    const names = QUICK_JUMPS.map((j) => j.name);
    for (const name of required) assert.ok(names.includes(name), `missing quick jump: ${name}`);
    for (const jump of QUICK_JUMPS) {
      assert.ok(jump.lon >= META.bounds.west && jump.lon <= META.bounds.east, `${jump.name} lon`);
      assert.ok(jump.lat >= META.bounds.south && jump.lat <= META.bounds.north, `${jump.name} lat`);
      assert.equal(coerce('camDist', jump.camDist), jump.camDist, `${jump.name} camDist`);
      assert.equal(coerce('camPitch', jump.camPitch), jump.camPitch, `${jump.name} camPitch`);
    }
    assert.equal(new Set(QUICK_JUMPS.map((j) => j.id)).size, QUICK_JUMPS.length, 'ids unique');
  });
});
