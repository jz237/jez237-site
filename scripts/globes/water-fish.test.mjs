// What poor water does to the betta (src/water/effects.ts), as the fish takes it: listless
// (lethargy), it lies on the sand far more and swims slower, and leaves off displaying and lapping;
// short of air (gasp), it goes up for it more often and lingers at the film; clamped, its fins fold
// in; off its food (appetite), it leaves pellets be or spits them out, and they sink; unwilling to
// tend its nest, it adds nothing to it and the nest thins. Seeded throughout; in clear water every
// one of these leaves the fish as it was, to the bit (betta-swim.test.mjs and betta-worker.test.mjs
// hold its routes; here its fins and its body).
// Run: node --test water-fish.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';
import { BodyMotion } from '../betta-atelier/src/body-motion.js';
import { FinDynamics } from '../betta-atelier/src/fin-dynamics.js';
import { BEHAVIORS, BettaSwim, REST_HEIGHT, bettaMouth, bettaMouthHeight } from './src/fish/bettaSwim.mjs';
import { BettaSpecimen } from './src/fish/bettaSpecimen.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { BED_LEVEL, GLASS_INNER } from './src/render/scape/mesh.mjs';

// (The page's specimen loads its photographs: images that never arrive.)
globalThis.document ??= { createElementNS: () => ({ addEventListener() {}, removeEventListener() {}, style: {} }) };

const here = dirname(fileURLToPath(import.meta.url));
/** A TypeScript module of the page's, bundled for Node. */
async function load(path) {
  const bundle = await rolldown({ input: resolve(here, path), platform: 'node', logLevel: 'silent' });
  const { output } = await bundle.generate({ format: 'esm' });
  await bundle.close();
  return import('data:text/javascript;base64,' + Buffer.from(output[0].code).toString('base64'));
}
const { FishFood } = await load('src/fish/FishFood.ts');
const { BowlLife } = await load('src/interaction/BowlLife.ts');

// The betta bowl: its glass, its water's level, its sand; and the fish's driftwood across the middle.
const env = { radius: 0.99125, sandLevel: -0.6, level: 0.181, iso: 0.5, gravity: [0, -24, 0] };
const calm = () => ({ flow: [0, 0, 0], angular: [0, 0, 0], submerged: 1, airAbove: 0, surface: env.level, sand: env.sandLevel, centroid: [0, -0.2, 0] });
const wood = { a: [-0.35, -0.42, -0.05], b: [0.3, -0.4, 0.08], r: 0.08 };

/** Ten minutes of a fish (each seed's) with the water doing this to it: how its time was spent
 *  (shares of each mode), its gulps a minute, its mean speed, and the most its lips were above the
 *  film. */
function swimFor({ lethargy = 0, gasp = 0 }, seeds = [237, 42, 901], minutes = 10) {
  const time = {};
  let frames = 0, gulps = 0, speed = 0, breach = -Infinity;
  for (const seed of seeds) {
    const s = new BettaSwim(seed);
    s.obstacles = [wood];
    s.lethargy = lethargy;
    s.gasp = gasp;
    for (let i = 0; i < minutes * 3600; i++) {
      s.advance(1 / 60, [0, 0, 0], env, true, calm());
      time[s.mode] = (time[s.mode] ?? 0) + 1;
      frames++;
      speed += Math.hypot(...s.velocity);
      breach = Math.max(breach, bettaMouthHeight(s.position[1], s.pitch) - env.level);
      assert.ok(s.position.every(Number.isFinite) && Math.hypot(...s.position) <= env.radius - 0.2 + 1e-8);
    }
    gulps += s.gulps;
  }
  for (const k of Object.keys(time)) time[k] /= frames;
  return { time, gulpsPerMinute: gulps / (seeds.length * minutes), speed: speed / frames, breach };
}

test('listless, it lies on the sand far more, swims slower, and from 0.4 leaves off displaying and lapping', () => {
  const clear = swimFor({}), some = swimFor({ lethargy: 0.3 }), half = swimFor({ lethargy: 0.6 }), most = swimFor({ lethargy: 1 });
  const rest = (r) => r.time.rest ?? 0;
  assert.ok(rest(clear) < 0.1, `clear: resting ${rest(clear).toFixed(2)} of the time`);
  assert.ok(rest(some) > 2 * rest(clear) && rest(half) > rest(some) && rest(most) > rest(half), `resting ${[clear, some, half, most].map((r) => rest(r).toFixed(2))}`);
  assert.ok(rest(most) > 0.6, `at 1 it mostly lies on the bottom (${rest(most).toFixed(2)})`);
  assert.ok(most.speed < 0.75 * clear.speed && half.speed < clear.speed, `speeds ${clear.speed.toFixed(3)}, ${half.speed.toFixed(3)}, ${most.speed.toFixed(3)}`);
  assert.ok((clear.time.mirror ?? 0) > 0.01 && (clear.time.lap ?? 0) > 0.05, 'precondition: a well fish displays and laps');
  for (const r of [half, most]) assert.ok(!r.time.mirror && !r.time.lap, 'no displays or laps from 0.4');
  assert.ok((some.time.mirror ?? 0) < clear.time.mirror && (some.time.lap ?? 0) < clear.time.lap, 'fewer, short of 0.4');
});

test('the least bit listless, it rests as often and as long as a well fish, and more the more listless it is', () => {
  // (Twenty-four fish, ten minutes each: how much of the time it lies on the sand, and how many times
  // an hour it goes down. Twelve were too few to tell 0.01 from clear: one sample read 0.8 of it,
  // forty-eight 1.01.)
  const seeds = Array.from({ length: 24 }, (_, k) => 237 + 1009 * k);
  const resting = (lethargy) => {
    let frames = 0, lying = 0, downs = 0;
    for (const seed of seeds) {
      const s = new BettaSwim(seed);
      s.obstacles = [wood];
      s.lethargy = lethargy;
      let was = '';
      for (let i = 0; i < 600 * 60; i++) {
        s.advance(1 / 60, [0, 0, 0], env, true, calm());
        frames++;
        if (s.mode === 'rest') {
          lying++;
          if (was !== 'rest') downs++;
        }
        was = s.mode;
      }
    }
    return { share: lying / frames, perHour: downs / (seeds.length / 6) };
  };
  const clear = resting(0);
  const table = Object.fromEntries([0.01, 0.05, 0.1, 0.2, 0.3, 0.6, 1].map((l) => [l, resting(l)]));
  const shown = JSON.stringify(Object.fromEntries(Object.entries({ 0: clear, ...table }).map(([l, r]) => [l, `${(100 * r.share).toFixed(1)}%, ${r.perHour.toFixed(1)}/h`])));
  assert.ok(clear.share > 0.02 && clear.perHour > 3, `clear water: ${shown}`);
  for (const l of [0.01, 0.05, 0.1, 0.2]) assert.ok(table[l].share >= 0.85 * clear.share && table[l].perHour >= 0.85 * clear.perHour, `at ${l} it rests less than a well fish: ${shown}`);
  assert.ok(table[0.2].share > clear.share && table[0.3].share > table[0.2].share && table[0.6].share > table[0.3].share && table[1].share > table[0.6].share, `rising: ${shown}`);
});

test('lying listless, it settles on the sand, leaning over a little, and stays far longer', () => {
  const s = new BettaSwim(42);
  s.obstacles = [wood];
  s.lethargy = 1;
  let longest = 0, run = 0, lean = 0;
  for (let i = 0; i < 600 * 60; i++) {
    s.advance(1 / 60, [0, 0, 0], env, true, calm());
    const down = s.mode === 'rest' && s.restSettled;
    run = down ? run + 1 / 60 : 0;
    longest = Math.max(longest, run);
    if (down && run > 10) {
      assert.ok(Math.abs(s.position[1] - (env.sandLevel + REST_HEIGHT)) < 0.012 && s.speed < 0.01 && s.drive < 0.1, 'on the sand, still, fins easy');
      lean = Math.max(lean, Math.abs(s.roll));
    }
  }
  assert.ok(longest > 40, `its longest lie ${longest.toFixed(0)} s (a well fish's are 7-14 s)`);
  assert.ok(lean > 0.2 && lean < 0.4, `leaning ${lean.toFixed(2)} rad`);
});

test('in the bowl itself, among its wood, stones, plants and equipment, listless it still mostly lies on the sand: beside them, not in them', () => {
  const obstacles = buildScapePieces({ detail: 0.5 }).flatMap((p) => p.obstacles);
  const bowl = { radius: GLASS_INNER, sandLevel: BED_LEVEL, level: env.level, iso: env.iso, gravity: env.gravity };
  const water = () => ({ ...calm(), sand: BED_LEVEL });
  const off = (p, o) => {
    const ab = o.b.map((x, k) => x - o.a[k]), ap = p.map((x, k) => x - o.a[k]);
    const t = Math.min(Math.max(ab.reduce((a, x, k) => a + x * ap[k], 0) / ab.reduce((a, x) => a + x * x, 0), 0), 1);
    return Math.hypot(...p.map((x, k) => x - o.a[k] - ab[k] * t));
  };
  for (const [lethargy, least] of [[0.6, 0.4], [1, 0.6]]) {
    for (const seed of [237, 42]) {
      const s = new BettaSwim(seed);
      s.obstacles = obstacles;
      s.lethargy = lethargy;
      let lying = 0;
      for (let i = 0; i < 600 * 60; i++) {
        s.advance(1 / 60, [0, 0, 0], bowl, true, water());
        if (s.mode !== 'rest') continue;
        lying++;
        // (Its neck held out of each one's core, as it always is; its body kept out of their solid
        // parts by the specimen's contact passes.)
        for (const o of obstacles) assert.ok(off(s.position, o) >= 0.6 * o.r - 1e-6, `${seed}: lay in one's core (${off(s.position, o).toFixed(3)} of ${(0.6 * o.r).toFixed(3)})`);
      }
      assert.ok(lying / 36000 > least, `${seed}, ${lethargy}: lying ${(lying / 36000).toFixed(2)} of the time`);
    }
  }
});

test('short of air, it goes up for it far more often and lingers at the film, its lips never breaking it', () => {
  const clear = swimFor({}), some = swimFor({ gasp: 0.3 }), much = swimFor({ gasp: 0.7 }), most = swimFor({ gasp: 1 });
  const rates = [clear, some, much, most].map((r) => r.gulpsPerMinute);
  assert.ok(rates[0] > 0.4 && rates[0] < 1, `clear: ${rates[0].toFixed(2)} gulps a minute`);
  assert.ok(rates[1] > 1.5 * rates[0] && rates[2] > 2 * rates[1] && rates[3] > rates[2], `gulps a minute ${rates.map((r) => r.toFixed(2))}`);
  assert.ok(rates[3] > 8 * rates[0], 'much more often at 1');
  // (Lingering: from 0.4 up it stays for several gulps, most of its time at 1.)
  const atFilm = (r) => r.time.gulp ?? 0;
  assert.ok(atFilm(some) < 0.06 && atFilm(much) > 0.15 && atFilm(most) > 0.35, `at the film ${[clear, some, much, most].map((r) => atFilm(r).toFixed(2))}`);
  for (const r of [clear, some, much, most]) assert.ok(r.breach <= 0.006, `lips ${r.breach.toFixed(4)} over the film`);
  // Listless and short of air both: it lies on the sand between its trips up.
  const both = swimFor({ lethargy: 1, gasp: 0.7 });
  assert.ok((both.time.rest ?? 0) > 0.15 && both.gulpsPerMinute > 4 * rates[0], `both: resting ${(both.time.rest ?? 0).toFixed(2)}, ${both.gulpsPerMinute.toFixed(1)} gulps a minute`);
});

test('its lips stay shut between the gulps it lingers for, and its breathing quickens', () => {
  const s = new BettaSwim(237);
  s.gasp = 1;
  let held = 0, shut = 0, gulpsAt = 0;
  for (let i = 0; i < 120 * 60; i++) {
    s.advance(1 / 60, [0, 0, 0], env, true, calm());
    if (s.mode === 'gulp' && s.gulpClock < 0) {
      held++;
      if (s.gulp < 0.05) shut++;
    }
    if (s.mode === 'gulp') gulpsAt = Math.max(gulpsAt, s.gulps);
  }
  assert.ok(held > 120 && shut / held > 0.8, `between gulps ${held} frames, ${shut} shut`);
  // (The specimen breathes the quicker: the gait's breathing phase runs ahead.)
  const breath = (gasp) => {
    const fish = new BettaSpecimen({ textures: false }), host = { obstacles: [], food: null, gapeWant: 0, flared: false, water: { lethargy: 0, gasp, clamp: 0 } };
    for (let i = 0; i < 120; i++) fish.step(1 / 60, null, env, host);
    return fish.fish.userData.gait.breathPhase;
  };
  assert.ok(breath(1) > 1.8 * breath(0), `breathing ${breath(0).toFixed(1)} -> ${breath(1).toFixed(1)} rad in 2 s`);
});

/** A broad fin (kind 0: the caudal; 1, 2: dorsal, anal) or a ventral (4), as fin-dynamics.test's
 *  betta-flex.test.mjs makes them, settled for 4 s in still water with the fins clamped so far (or
 *  with no clamp given at all: undefined): its nodes. */
function settledFin(kind, clamp) {
  const fin = new FinDynamics({ kind, side: kind === 4 ? 1 : 0, columns: 17, rows: 13, point(u, v) {
    if (kind === 4) return [0.05 + 0.08 * u + v * (0.3 + 0.1 * u), -0.3 - v * 0.9, 0.05 + v * 0.14];
    if (kind) return [-0.65 + u * 1.65, (kind === 1 ? 1 : -1) * (0.28 + v * (0.25 + u * 0.7)), 0];
    const a = (u - 0.5) * 2.7;
    return [0.8 + Math.cos(a) * v, Math.sin(a) * v + (u - 0.5) * 0.12, 0];
  } });
  const body = new BodyMotion();
  const state = { body, time: 0, phase: 0, pectoralPhase: 0, drive: 0, effort: 0, turn: 0, flare: 0, heading: 0, velocity: [0, 0, 0], angularVelocity: 0, origin: [0, 0, 0], strength: 0, direction: 'front', externalFlow: [0, 0, 0] };
  if (clamp !== undefined) state.clamp = clamp;
  for (let i = 0; i < 240; i++) fin.advance(1 / 60, { ...state, time: i / 60 });
  return fin;
}

test('clamped, the caudal narrows, the dorsal and anal lie down, the ventrals tuck back and in', () => {
  // (Without a clamp, as the Atelier has it, the fins are as they were, to the bit.)
  for (const kind of [0, 1, 2, 4]) assert.deepEqual(settledFin(kind, 0).position, settledFin(kind, undefined).position);
  const tips = (fin) => Array.from({ length: fin.columns }, (_, i) => (fin.rows - 1) * fin.columns + i).map((n) => [0, 1, 2].map((k) => fin.position[n * 3 + k]));
  // The caudal's fan: the spread of its fringe, top to bottom.
  const spread = (fin) => Math.max(...tips(fin).map((p) => p[1])) - Math.min(...tips(fin).map((p) => p[1]));
  const caudal = [0, 0.3, 1].map((c) => spread(settledFin(0, c)));
  assert.ok(caudal[1] < 0.9 * caudal[0] && caudal[2] < 0.55 * caudal[0], `caudal spread ${caudal.map((v) => v.toFixed(3))}`);
  // The dorsal and the anal: how far their fringe stands off the body.
  for (const kind of [1, 2]) {
    const stand = (fin) => Math.max(...tips(fin).map((p) => Math.abs(p[1])));
    const [open, half, shut] = [0, 0.3, 1].map((c) => stand(settledFin(kind, c)));
    assert.ok(half < open && shut < 0.75 * open, `fin ${kind} stands ${[open, half, shut].map((v) => v.toFixed(3))}`);
  }
  // The ventral: its tip back along the body (x) and in towards the other (z).
  const [open, shut] = [0, 1].map((c) => tips(settledFin(4, c)).at(-1));
  assert.ok(shut[0] > open[0] + 0.2 && shut[1] > open[1] + 0.15 && shut[2] < open[2], `ventral tip ${open.map((v) => v.toFixed(2))} -> ${shut.map((v) => v.toFixed(2))}`);
  for (const kind of [0, 1, 2, 4]) {
    const m = settledFin(kind, 1).metrics();
    assert.equal(m.anchorError, 0);
    assert.ok(m.maxRayStrain < 0.07, `fin ${kind}: rays stretched ${m.maxRayStrain.toFixed(3)}`);
  }
});

test('the fish in clear water is the fish as it was: no water given, or clear water, to the bit', () => {
  const run = (water) => {
    const fish = new BettaSpecimen({ textures: false }), host = { obstacles: [], food: null, gapeWant: 0, flared: false, ...(water ? { water } : {}) };
    for (let i = 0; i < 240; i++) fish.step(1 / 60, null, env, host);
    return fish.vertices;
  };
  assert.deepEqual(run({ lethargy: 0, gasp: 0, clamp: 0 }), run(null));
  // (Clamped from the start, its fins fold in over a few seconds, and open out as slowly.)
  const fish = new BettaSpecimen({ textures: false }), host = { obstacles: [], food: null, gapeWant: 0, flared: false, water: { lethargy: 0, gasp: 0, clamp: 1 } };
  for (let i = 0; i < 60; i++) fish.step(1 / 60, null, env, host);
  assert.ok(fish.clamp > 0.3 && fish.clamp < 0.7, `a second in: ${fish.clamp.toFixed(2)}`);
  for (let i = 0; i < 240; i++) fish.step(1 / 60, null, env, host);
  assert.ok(fish.clamp > 0.9);
  host.water = { lethargy: 0, gasp: 0, clamp: 0 };
  for (let i = 0; i < 900; i++) fish.step(1 / 60, null, env, host);
  assert.equal(fish.clamp, 0, 'open again, the fold all gone');
});

/** Seeded Math.random (mulberry32) for `fn`: FishFood's pellets draw from it. */
function seeded(seed, fn) {
  const real = Math.random;
  let a = seed >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    return fn();
  } finally {
    Math.random = real;
  }
}

/** A meal of `pellets` pellets dropped in through the mouth of the bowl, the fish (a seed's swim, as
 *  Betta.ts feeds it: its lips and the way it faces, its reach) as keen on food as `appetite`; the
 *  water as probes read it (still; the film at the level), for `seconds`. Returns those eaten, and
 *  those left (floating, sinking or on the sand); and the pellets it spat out, each time it did:
 *  how high each was and how long until it soaked, then, and a few seconds on. */
function meal(appetite, seed, pellets = 5, seconds = 150) {
  return seeded(seed, () => {
    const s = new BettaSwim(seed), food = new FishFood();
    food.enabled = food.pellets = true;
    const fish = {
      food: null,
      gapeWant: 0,
      reach: 0.055,
      appetite,
      mouthAt: () => bettaMouth(s.position, s.heading, s.pitch),
      ahead: () => [-Math.cos(s.heading) * Math.cos(s.pitch), Math.sin(s.pitch), Math.sin(s.heading) * Math.cos(s.pitch)],
      busy: () => s.mode === 'startle',
    };
    for (let i = 0; i < 300; i++) s.advance(1 / 60, [0, 0, 0], env, true, calm());
    for (let k = 0; k < pellets; k++) food.spawn([0.12 * Math.cos(k * 1.3), env.level + 0.06, 0.12 * Math.sin(k * 1.3)], 1);
    const probes = new Float32Array(8 * 4), sand = new Float32Array(8).fill(env.sandLevel);
    const foodEnv = { rotation: [1, 0, 0, 0, 1, 0, 0, 0, 1], gravity: env.gravity, iso: env.iso, radius: env.radius };
    const spat = [], seen = new Set();
    for (let i = 0; i < seconds * 60; i++) {
      for (const f of food.slots) {
        if (!f?.spat[0] || seen.has(f)) continue;
        seen.add(f);
        spat.push({ f, at: i, y: f.pos[1], soaked: f.age >= f.soak });
      }
      for (const sp of spat) if (i === sp.at + 300) sp.later = sp.f.landed ? env.sandLevel : sp.f.pos[1];
      food.aim([fish]);
      s.food = fish.food ? fish.food.pos : null;
      s.gape = fish.gapeWant;
      s.advance(1 / 60, [0, 0, 0], env, true, calm());
      const at = food.probePoints();
      for (let k = 0; k < 7; k++) probes[k * 4 + 3] = Math.min(Math.max(0.5 + (env.level - at[k * 4 + 1]) * 20, 0), 1.2);
      food.update(1 / 60, probes, sand, 0, foodEnv, [fish]);
    }
    return { eaten: food.eatenCount, left: food.count, spat };
  });
}

test('off its food, it leaves pellets be or spits them out, and they sink; at 0 it lets them all sink', () => {
  const seeds = [237, 42, 901];
  const tally = (appetite) => seeds.map((seed) => meal(appetite, seed)).reduce((a, m) => ({ eaten: a.eaten + m.eaten, left: a.left + m.left }), { eaten: 0, left: 0 });
  const keen = tally(1), half = tally(0.6), off = tally(0.3), none = tally(0);
  assert.deepEqual(keen, { eaten: 15, left: 0 }, 'keen, it eats the lot');
  assert.ok(half.left <= 2, `at 0.6 it eats nearly all (${half.left} left)`);
  assert.ok(off.left >= 4 && off.eaten >= 2, `at 0.3 it eats some (${off.eaten}) and leaves some (${off.left})`);
  assert.deepEqual(none, { eaten: 0, left: 15 }, 'at 0 it eats none');
});

test('off its food, it notices pellets later, and what it spits out sinks at once', () => {
  // (What it spat out: from its lips at the film, soaked through, and going down.)
  const spat = [237, 42, 901, 7, 31337, 1, 2, 3].flatMap((seed) => meal(0.3, seed).spat);
  assert.ok(spat.length >= 2, `spat out ${spat.length}`);
  for (const sp of spat) {
    assert.ok(sp.soaked && sp.y > env.level - 0.08, `spat out at ${sp.y.toFixed(3)}, soaked ${sp.soaked}`);
    assert.ok(sp.later === undefined || sp.later < sp.y - 0.02, `then at ${sp.later?.toFixed(3)}`);
  }
  // (When it first goes for one, keen and less so.)
  const firstAim = (appetite) =>
    seeded(5, () => {
      const food = new FishFood();
      food.enabled = food.pellets = true;
      food.spawn([0, env.level, 0], 1);
      const fish = { food: null, gapeWant: 0, reach: 0.055, appetite, mouthAt: () => [0.3, 0, 0], ahead: () => [-1, 0, 0], busy: () => false };
      for (let i = 0; i < 600; i++) {
        food.aim([fish]);
        if (fish.food) return i / 60;
        food.update(1 / 60, null, null, 0, { rotation: [1, 0, 0, 0, 1, 0, 0, 0, 1], gravity: env.gravity, iso: env.iso, radius: env.radius }, []);
      }
      return Infinity;
    });
  const keen = firstAim(1), slow = firstAim(0.55);
  assert.ok(keen < 1.5 && slow > 1.5 * keen && slow < Infinity, `noticed at ${keen.toFixed(2)} s, and ${slow.toFixed(2)} s`);
});

test("unwilling to tend its nest, it adds nothing to it and the nest thins; content again, it builds again", () => {
  const life = new BowlLife(env.radius), rotation = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const trip = () => {
    for (const mode of ['gulp', 'dive']) life.update(1 / 60, null, env.level, env.iso, rotation, 0, mode);
  };
  const before = life.bubbles;
  trip();
  assert.ok(life.bubbles > before, 'a well fish adds to it each time it takes air');
  life.tending = 0.3;
  const full = life.bubbles;
  trip();
  assert.ok(life.bubbles <= full, 'unwilling, it adds nothing');
  assert.equal(life.nestNeed, 0, 'and it wants nothing rebuilt (no extra trips up)');
  for (let i = 0; i < 60 * 60; i++) life.update(1 / 60, null, env.level, env.iso, rotation, 0, 'rest');
  assert.ok(life.bubbles < full - 25 && life.bubbles > 0, `a minute later ${life.bubbles} of ${full}`);
  for (let i = 0; i < 6 * 60 * 60; i++) life.update(1 / 60, null, env.level, env.iso, rotation, 0, 'rest');
  assert.equal(life.bubbles, 0, 'left long enough, it is gone');
  life.tending = 0.8;
  assert.ok(life.nestNeed > 0.9);
  trip();
  assert.ok(life.bubbles > 0, 'content again, it builds again');
});

test('in the water these leave it as well as ever: no episode of a well fish is lost in clear water', () => {
  const clear = swimFor({}, [237], 15);
  for (const mode of BEHAVIORS) assert.ok(clear.time[mode] > 0, `clear water: no ${mode}`);
});
