// Night on the betta bowl's page (src/app/night.mjs, render/studio.ts): by day the studio's light is
// exactly the light the page has always been drawn in (the literals its shaders held), handed to the
// shaders in the order they read it; the fade between day and night is eased, takes about two seconds
// and turns back from where it is; the fish is drowsier at night, the more listless of that and Water
// mode's effects winning, those left as they are; and the choice is kept on the device, a storage that
// throws meaning only that the page starts by day.
// Run: node --test night.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { drowsy, FADE, keepNight, keptNight, NIGHT_LETHARGY, NightFade, STORAGE_KEY } from './src/app/night.mjs';
import { STUDIO_COLOURS, STUDIO_DAY, STUDIO_NIGHT, STUDIO_SHARES, STUDIO_WGSL, studioLight } from './src/render/studio.ts';
import { CLEAR_WATER } from './src/water/effects.ts';
import { readFileSync } from 'node:fs';

/** The studio's colours as its WGSL held them before Night (literals, in studio_wall, studio_room,
 *  studio_tableLight and studio_table), and the shares; the bowl's tints were no tint at all. */
const BEFORE = {
  wallEdge: 'vec3f(0.003, 0.014, 0.040)',
  wallMid: 'vec3f(0.014, 0.070, 0.160)',
  wallCore: 'vec3f(0.045, 0.170, 0.330)',
  wallFoot: 'vec3f(0.030, 0.040, 0.050)',
  roomLow: 'vec3f(0.010, 0.026, 0.046)',
  roomHigh: 'vec3f(0.020, 0.045, 0.075)',
  softbox: 'vec3f(1.00, 0.97, 0.92)',
  strip: 'vec3f(0.85, 0.92, 1.0)',
  top: 'vec3f(0.9, 0.92, 0.95)',
  pool: 'vec3f(1.0, 0.44, 0.09)',
  tableRoom: 'vec3f(0.18, 0.30, 0.42)',
  tableEdge: 'vec3f(0.05, 0.08, 0.11)',
  lamp: 'vec3f(1.0)',
  beam: 'vec3f(1.0)',
  ambient: 'vec3f(1.0)',
  key: 'vec3f(1.0)',
  // (The paper's darkening towards the top, mix(1.0, 0.6, ...); the pool's mottle, whole.)
  wallTop: '0.6',
  poolMottle: '1.0',
  // (And no grain.)
  grain: '0.0',
};

/** A WGSL literal's numbers as f32 (a vec3f of one number is that number thrice). */
function f32s(literal) {
  const n = [...literal.replace('vec3f', '').matchAll(/-?\d+(\.\d+)?/g)].map((m) => Math.fround(Number(m[0])));
  return literal.startsWith('vec3f') && n.length === 1 ? [n[0], n[0], n[0]] : n;
}

/** What studio_light reads into each of its names: [matrix, column, 'xyz' or 'w']. */
function reads() {
  const body = STUDIO_WGSL.slice(STUDIO_WGSL.indexOf('fn studio_light('));
  return Object.fromEntries([...body.slice(0, body.indexOf('\n}')).matchAll(/(studio\w+) = ([abcd])\[(\d)\]\.(xyz|w);/g)].map((m) => [m[1], ['abcd'.indexOf(m[2]), Number(m[3]), m[4]]]));
}

const wgslName = (name) => `studio${name[0].toUpperCase()}${name.slice(1)}`;

/** The code that reads the studio's light besides the studio's own: the bowl's, the backdrop's. */
const bowlCode = ['render/StudioBackdrop.ts', 'render/shaders.ts', 'render/bowl.ts', 'render/bowlScape.ts', 'fish/bettaWGSL.ts', 'fish/FishFood.ts'].map((f) => readFileSync(new URL(`./src/${f}`, import.meta.url), 'utf8')).join('\n');

test('by day the studio\'s light is what the shaders held, where studio_light reads it', () => {
  assert.deepEqual(Object.keys(STUDIO_DAY).sort(), Object.keys(BEFORE).sort());
  assert.deepEqual([...STUDIO_COLOURS, ...STUDIO_SHARES].sort(), Object.keys(BEFORE).sort());
  assert.deepEqual(Object.keys(STUDIO_NIGHT).sort(), Object.keys(BEFORE).sort());
  const out = studioLight(0, new Float32Array(64));
  const read = reads();
  for (const [name, literal] of Object.entries(BEFORE)) {
    const at = read[wgslName(name)];
    assert.ok(at, `studio_light does not read ${name}`);
    const [m, col, part] = at;
    const got = part === 'xyz' ? [...out.slice(16 * m + 4 * col, 16 * m + 4 * col + 3)] : [out[16 * m + 4 * col + 3]];
    assert.deepEqual(got, f32s(literal), name);
    // (Each is read in the studio's code or the bowl's: none is set for nothing.)
    const uses = STUDIO_WGSL.split(wgslName(name)).length - 3 + bowlCode.split(wgslName(name)).length - 1;
    assert.ok(uses > 0, `${name} is not read`);
  }
  // (No colour is left a literal in the functions that took them.)
  for (const fn of ['studio_wall', 'studio_room', 'studio_tableLight', 'studio_table']) {
    const body = STUDIO_WGSL.slice(STUDIO_WGSL.indexOf(`fn ${fn}(`)).split('\n}')[0];
    for (const literal of Object.values(BEFORE).filter((l) => l.includes(','))) assert.ok(!body.includes(literal), `${fn} still holds ${literal}`);
  }
});

test('by night the studio\'s light is the night\'s, and on the way it dims evenly', () => {
  const night = studioLight(1, new Float32Array(64));
  const half = studioLight(0.5, new Float32Array(64));
  STUDIO_COLOURS.forEach((name, k) => {
    for (let c = 0; c < 3; c++) {
      assert.ok(Math.abs(night[4 * k + c] / STUDIO_NIGHT[name][c] - 1) < 1e-6, `${name} at night`);
      // (Halfway, the geometric mean: as a dimmer turns a light down, not a cross-fade.)
      assert.ok(Math.abs(half[4 * k + c] / Math.sqrt(STUDIO_DAY[name][c] * STUDIO_NIGHT[name][c]) - 1) < 1e-6, `${name} halfway`);
    }
  });
  STUDIO_SHARES.forEach((name, k) => assert.ok(Math.abs(night[4 * k + 3] / STUDIO_NIGHT[name] - 1) < 1e-6, `${name} at night`));
  // (The room dark, the lamp's light much dimmer and blue, the beams brighter against it.)
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  for (const name of ['wallCore', 'roomHigh', 'softbox', 'tableRoom', 'lamp', 'ambient', 'key']) assert.ok(lum(STUDIO_NIGHT[name]) < 0.35 * lum(STUDIO_DAY[name]), name);
  assert.ok(STUDIO_NIGHT.lamp[2] > STUDIO_NIGHT.lamp[1] && STUDIO_NIGHT.lamp[1] > STUDIO_NIGHT.lamp[0], 'the lamp blue');
  assert.ok(STUDIO_NIGHT.pool[2] > 2 * STUDIO_NIGHT.pool[0], 'the pool blue');
  assert.ok(lum(STUDIO_NIGHT.beam) > 2 * lum(STUDIO_NIGHT.lamp), 'the beams stand out');
});

test('the fade is eased over about two seconds, never a cut, and turns back from where it is', () => {
  assert.ok(FADE >= 1.5 && FADE <= 2.5);
  const f = new NightFade(false);
  assert.equal(f.value, 0);
  assert.equal(f.step(0.1), 0, 'by day it stays day');
  f.set(true);
  const dt = 1 / 60;
  let last = 0;
  let biggest = 0;
  const steps = [];
  for (let t = 0; t < FADE + 0.5; t += dt) {
    const v = f.step(dt);
    assert.ok(v >= last, 'it never goes back of itself');
    biggest = Math.max(biggest, v - last);
    steps.push(v - last);
    last = v;
  }
  assert.equal(last, 1, 'night at last, exactly');
  // (Eased: slow at either end, no step of a frame more than a fiftieth of the way.)
  assert.ok(biggest < 0.02, `a frame's step of ${biggest}`);
  assert.ok(steps[1] < steps[Math.round(FADE / dt / 2)] / 5, 'eased in');
  const done = steps.findIndex((s, i) => i > 0 && s === 0 && steps[i - 1] > 0);
  assert.ok(Math.abs(done * dt - FADE) < 0.05, `over ${done * dt} s`);
  // Turned back halfway: from where it is, and back to day.
  const g = new NightFade(false);
  g.set(true);
  for (let i = 0; i < FADE / 2 / dt; i++) g.step(dt);
  const mid = g.value;
  g.set(false);
  const after = g.step(dt);
  assert.ok(after < mid && mid - after < 0.02, 'no jump as it turns');
  for (let i = 0; i < FADE / dt; i++) g.step(dt);
  assert.equal(g.value, 0);
  // Night kept from the last visit: night from the first frame; a long frame does not overshoot.
  assert.equal(new NightFade(true).value, 1);
  const h = new NightFade(false);
  h.set(true);
  assert.equal(h.step(10), 1);
  assert.equal(h.step(-1), 1, 'time never runs back');
});

test('the fish is drowsier at night; the more listless wins, Water mode\'s effects are left as they are', () => {
  const into = { ...CLEAR_WATER };
  assert.equal(drowsy(CLEAR_WATER, 0, into), CLEAR_WATER, 'by day, the effects themselves');
  const night = drowsy(CLEAR_WATER, 1, into);
  assert.equal(night.lethargy, NIGHT_LETHARGY);
  assert.deepEqual({ ...night, lethargy: 0 }, { ...CLEAR_WATER });
  assert.equal(CLEAR_WATER.lethargy, 0, 'the water\'s own untouched');
  assert.ok(NIGHT_LETHARGY >= 0.25 && NIGHT_LETHARGY < 0.4, 'it still patrols and displays (bettaSwim LISTLESS 0.4)');
  // (Halfway into the night, half as drowsy.)
  assert.equal(drowsy(CLEAR_WATER, 0.5, into).lethargy, NIGHT_LETHARGY / 2);
  // Water mode's fish more listless than the night makes it: as Water mode has it.
  const poorly = { ...CLEAR_WATER, lethargy: 0.6, gasp: 0.4, pale: 0.3, cloud: 0.5 };
  assert.equal(drowsy(poorly, 1, into), poorly);
  const mild = { ...CLEAR_WATER, lethargy: 0.1, gasp: 0.4, appetite: 0.7 };
  const both = drowsy(mild, 1, into);
  assert.deepEqual(both, { ...mild, lethargy: NIGHT_LETHARGY });
  assert.equal(mild.lethargy, 0.1);
});

test('Night is kept on the device; storage that cannot be had starts the page by day', () => {
  const store = new Map();
  const storage = () => ({ getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) });
  assert.equal(keptNight(storage), false, 'a first visit: day');
  keepNight(storage, true);
  assert.equal(store.get(STORAGE_KEY), '1');
  assert.equal(keptNight(storage), true);
  keepNight(storage, false);
  assert.equal(store.get(STORAGE_KEY), '0');
  assert.equal(keptNight(storage), false);
  for (const bad of ['true', 'night', '', '01']) {
    store.set(STORAGE_KEY, bad);
    assert.equal(keptNight(storage), false, bad);
  }
  // (localStorage itself out of reach, or its reads and writes refused.)
  const blocked = () => {
    throw new Error('SecurityError');
  };
  const refusing = () => ({ getItem: blocked, setItem: blocked });
  assert.equal(keptNight(blocked), false);
  assert.equal(keptNight(refusing), false);
  assert.doesNotThrow(() => keepNight(blocked, true));
  assert.doesNotThrow(() => keepNight(refusing, true));
});
