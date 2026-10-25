// The drop map's kernels (src/sim/shaders/splash.wgsl, Splash.ts): drops run together into the
// largest drop they touch, whether one thread walks a drop's texels or its LANES threads share
// them (each keeping the largest it finds, passing over any smaller than its team's largest so far,
// then the team's largest, the first listed of that size); and the map the renderer reads, resolved
// only over the tiles drops reach this frame or reached the last, its counts emptied there for the
// frame after (no clearing of the whole map), is the map of this frame's drops at every texel,
// frame after frame and once cleared. These run the kernels' logic, ported, over random drops, and
// hold the shader to it.
// Run: node --test drop-map.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const code = source('./src/sim/shaders/splash.wgsl');
const splash = source('./src/sim/Splash.ts');

function random(seed) {
  let s = seed;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
/** A drop's size as the shader compares its bits (f32, positive). */
const f32 = Math.fround;
const bits = (a) => new Uint32Array(new Float32Array([a]).buffer)[0];
const NONE = 0xffffffff;

/** Whether drop i (size own: its own, a line's 0) may run into drop o of size ao. */
const may = (i, own, o, ao) => o !== i && ao > 0 && !(ao < own || (ao === own && o > i));

test("a drop's size's bits order as the sizes do", () => {
  const rand = random(7);
  for (let k = 0; k < 2000; k++) {
    const a = f32(1e-4 + rand() * 0.03), b = f32(1e-4 + rand() * 0.03);
    assert.equal(Math.sign(bits(a) - bits(b)), Math.sign(a - b));
  }
});

test("a drop's lanes, each looking through its share, find the largest one thread finds", () => {
  assert.match(code, /if \(!\(ao > 0\.0\) \|\| ao < r\.own \|\| \(ao == r\.own && o > i\)\) \{ continue; \}/);
  assert.match(code, /if \(best != NONE && \(ao < bestA \|\| \(ao == bestA && o >= best\)\)\) \{ continue; \}/);
  assert.match(code, /if \(team != NONE && bitcast<u32>\(ao\) < atomicLoad\(&spTeamA\[team\]\)\) \{ continue; \}/);
  assert.match(code, /best = o;\s+bestA = ao;\s+if \(team != NONE\) \{ atomicMax\(&spTeamA\[team\], bitcast<u32>\(ao\)\); \}/);
  assert.match(code, /if \(found\.x != NONE && found\.y == atomicLoad\(&spTeamA\[team\]\)\) \{ atomicMin\(&spTeamO\[team\], found\.x\); \}/);
  const lanes = Number(code.match(/const LANES: u32 = (\d+)u;/)[1]);
  const side = Number(code.match(/const LANES_SIDE: u32 = (\d+)u;/)[1]);
  const teams = Number(code.match(/const TEAMS: u32 = (\d+)u;/)[1]);
  assert.equal(side * side, lanes);
  assert.equal(lanes * teams, 256);
  assert.equal(Number(splash.match(/const DROP_TEAMS = (\d+);/)[1]), teams);
  const rand = random(11);
  for (let trial = 0; trial < 3000; trial++) {
    // Drop i and the texels round it (a window, its lanes a square stepping over it), each listing
    // up to four drops; some of them touch drop i. (Sizes from a few, so that some are equal.)
    const i = Math.floor(rand() * 40);
    const sizes = Array.from({ length: 40 }, () => f32([0.002, 0.004, 0.006][Math.floor(rand() * 3)] + (rand() < 0.5 ? 0 : rand() * 0.004)));
    const line = rand() < 0.2;
    const own = line ? 0 : sizes[i];
    const touches = sizes.map(() => rand() < 0.5);
    const h = [1 + Math.floor(rand() * 4), 1 + Math.floor(rand() * 4)];
    const texels = [];
    for (let dy = -h[1]; dy <= h[1]; dy++) for (let dx = -h[0]; dx <= h[0]; dx++) texels.push({ dx, dy, list: Array.from({ length: Math.floor(rand() * 5) }, () => Math.floor(rand() * 40)) });
    // One thread, the texels in turn.
    const alone = () => {
      let best = NONE, bestA = 0;
      for (const t of texels) for (const o of t.list) {
        if (!may(i, own, o, sizes[o])) continue;
        if (best !== NONE && (sizes[o] < bestA || (sizes[o] === bestA && o >= best))) continue;
        if (!touches[o]) continue;
        best = o;
        bestA = sizes[o];
      }
      return best;
    };
    // The team: each lane its texels, the lanes' steps in a random order, its largest so far
    // shared; then the largest of theirs, and of that size the first listed.
    const team = () => {
      let teamA = 0;
      const lanesState = Array.from({ length: lanes }, (_, l) => ({
        work: texels.filter((t) => (((t.dx + h[0]) % side) === l % side) && (((t.dy + h[1]) % side) === Math.floor(l / side))).flatMap((t) => t.list),
        k: 0,
        best: NONE,
        bestA: 0,
      }));
      for (;;) {
        const live = lanesState.filter((s) => s.k < s.work.length);
        if (!live.length) break;
        const s = live[Math.floor(rand() * live.length)];
        const o = s.work[s.k++];
        if (!may(i, own, o, sizes[o])) continue;
        if (s.best !== NONE && (sizes[o] < s.bestA || (sizes[o] === s.bestA && o >= s.best))) continue;
        if (bits(sizes[o]) < teamA) continue;
        if (!touches[o]) continue;
        s.best = o;
        s.bestA = sizes[o];
        teamA = Math.max(teamA, bits(sizes[o]));
      }
      let into = NONE;
      for (const s of lanesState) if (s.best !== NONE && bits(s.bestA) === teamA) into = Math.min(into, s.best);
      return into;
    };
    assert.equal(team(), alone(), `trial ${trial}`);
  }
});

test("the map the renderer reads is this frame's drops' at every texel, resolved over the tiles they reach or reached", () => {
  assert.match(code, /if \(m == 0u\) \{\s+let tiles = \(S\.mapN \+ TILE - 1u\) \/ TILE;\s+atomicStore\(&mapTiles\[S\.cur \* tiles \* tiles \+ u32\(t\.x\) \/ TILE \+ tiles \* \(u32\(t\.y\) \/ TILE\)\], 1u\);/);
  assert.match(code, /let m = atomicAdd\(&dropMap\[S\.cur \* NN \+ idx\], 1u\);/);
  assert.match(code, /spCount = atomicLoad\(&mapTiles\[S\.cur \* tiles \* tiles \+ tile\]\) \| atomicLoad\(&mapTiles\[was\]\);\s+atomicStore\(&mapTiles\[was\], 0u\);/);
  assert.match(code, /let n = min\(atomicLoad\(&dropMap\[S\.cur \* NN \+ idx\]\), MAP_K\);\s+atomicStore\(&dropMap\[\(1u - S\.cur\) \* NN \+ idx\], 0u\);/);
  assert.doesNotMatch(splash.slice(splash.indexOf('encode(enc: GPUCommandEncoder'), splash.indexOf('clear(enc: GPUCommandEncoder')), /clearBuffer\(b\.dropMap/);
  const N = 64, T = 16, tiles = N / T, K = 4;
  const counts = [new Uint32Array(N * N), new Uint32Array(N * N)];
  const marks = [new Uint8Array(tiles * tiles), new Uint8Array(tiles * tiles)];
  const tex = new Uint32Array(N * N);
  const tileOf = (x, y) => Math.floor(x / T) + tiles * Math.floor(y / T);
  const resolve = (cur) => {
    for (let tile = 0; tile < tiles * tiles; tile++) {
      const on = marks[cur][tile] | marks[1 - cur][tile];
      marks[1 - cur][tile] = 0;
      if (!on) continue;
      const tx = tile % tiles, ty = Math.floor(tile / tiles);
      for (let y = ty * T; y < ty * T + T; y++) for (let x = tx * T; x < tx * T + T; x++) {
        tex[x + N * y] = Math.min(counts[cur][x + N * y], K);
        counts[1 - cur][x + N * y] = 0;
      }
    }
  };
  const rand = random(3);
  for (let frame = 1; frame <= 200; frame++) {
    const cur = frame & 1;
    // This frame's drops: a few clusters, now and then none.
    const want = new Uint32Array(N * N);
    const clusters = rand() < 0.15 ? 0 : Math.floor(rand() * 4);
    for (let c = 0; c < clusters; c++) {
      const cx = Math.floor(rand() * N), cy = Math.floor(rand() * N);
      for (let k = 0; k < 30; k++) {
        const x = Math.min(N - 1, Math.max(0, cx + Math.floor((rand() - 0.5) * 20))), y = Math.min(N - 1, Math.max(0, cy + Math.floor((rand() - 0.5) * 20)));
        want[x + N * y]++;
        if (counts[cur][x + N * y]++ === 0) marks[cur][tileOf(x, y)] = 1;
      }
    }
    resolve(cur);
    for (let p = 0; p < N * N; p++) assert.equal(tex[p], Math.min(want[p], K), `frame ${frame}, texel ${p}`);
    // (The next frame's counts empty.)
    assert.ok(counts[1 - cur].every((c) => c === 0), `frame ${frame}`);
  }
  // Cleared (Splash.clear): the counts emptied, the tiles last drawn resolved from them, the marks
  // dropped; the map holds none.
  assert.match(splash, /enc\.clearBuffer\(b\.dropMap, 0, 2 \* DROP_MAP_N \* DROP_MAP_N \* 4\);[\s\S]*this\.run\(pass, 'spMapResolve', this\.mapGroups\);[\s\S]*enc\.clearBuffer\(b\.mapTiles\);/);
  counts[0].fill(0);
  counts[1].fill(0);
  resolve(200 & 1);
  marks[0].fill(0);
  marks[1].fill(0);
  assert.ok(tex.every((v) => v === 0));
});
