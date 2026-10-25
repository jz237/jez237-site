// The pressure solve's fused sweep (src/sim/shaders/pressure_fused.wgsl): a whole red-black sweep
// in one dispatch, each workgroup relaxing the red cells of its tile and one round it, then its
// black ones, into the other of two buffers. It must leave every cell as the two dispatches of
// pressure.wgsl do, to the bit (the det harnesses hash the solve's psi): these run its walk over
// the cells, ported line for line, against theirs, in single precision, on grids that fill their
// tiles and grids that do not, with dry tiles left alone; and hold the shader to that walk.
// Run: node --test pressure-sweep.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const fused = source('./src/sim/shaders/pressure_fused.wgsl');
const split = source('./src/sim/shaders/pressure.wgsl');
const common = source('./src/sim/shaders/common.wgsl');
const sim = source('./src/sim/FluidSim.ts');

const f = Math.fround;
const TILE = [16, Number(common.match(/const PRESSURE_TILE_Y: u32 = (\d+)u;/)[1]), Number(common.match(/const PRESSURE_TILE_Z: u32 = (\d+)u;/)[1])];
const SOR = f(1.85);
// WGSL's mix: e1 * (1 - e3) + e2 * e3.
const mix = (a, b, t) => f(f(a * f(1 - t)) + f(b * t));

/** A grid of n^3 cells, water in a ball inside it (two cells clear of its edges, as the glass's
 *  margin keeps it) up to row `top`, random equations, and the tiles that hold water flagged. */
function grid(n, seed, top = n) {
  let s = seed;
  const rand = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const C = n * n * n;
  const w = Array.from({ length: 6 }, () => new Float32Array(C));
  const rhs = new Float32Array(C);
  const diag = new Float32Array(C);
  const psi = new Float32Array(C);
  const r = n / 2 - 2;
  for (let k = 0; k < n; k++) for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const c = i + n * (j + n * k);
    if ((i + 0.5 - n / 2) ** 2 + (j + 0.5 - n / 2) ** 2 + (k + 0.5 - n / 2) ** 2 > r * r || j >= top || rand() < 0.1) continue;
    for (let a = 0; a < 6; a++) w[a][c] = Math.round(rand() * 255) / 255;
    rhs[c] = f(rand() - 0.5);
    diag[c] = f(1 / (1 + 5 * rand()));
    psi[c] = f(rand() - 0.5);
  }
  const tiles = TILE.map((t) => Math.ceil(n / t));
  const wet = new Uint8Array(tiles[0] * tiles[1] * tiles[2]);
  const tileOf = (i, j, k) => Math.floor(i / TILE[0]) + tiles[0] * (Math.floor(j / TILE[1]) + tiles[1] * Math.floor(k / TILE[2]));
  for (let k = 0; k < n; k++) for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (diag[i + n * (j + n * k)] !== 0) wet[tileOf(i, j, k)] = 1;
  return { n, w, rhs, diag, psi, tiles, wet, tileOf };
}

/** pressure.wgsl relax: cell c from its neighbours' psi (at(d): along x, y, z, the lower then
 *  the upper), in its order. */
function relaxed(g, c, own, at) {
  const { w, rhs, diag } = g;
  if (diag[c] === 0) return own;
  const sum = f(f(f(f(f(f(w[0][c] * at(0)) + f(w[1][c] * at(1))) + f(w[2][c] * at(2))) + f(w[3][c] * at(3))) + f(w[4][c] * at(4))) + f(w[5][c] * at(5)));
  return mix(own, f(f(sum - rhs[c]) * diag[c]), SOR);
}

/** Two dispatches of pressure.wgsl, a colour each, in place (dry tiles stop at once). */
function sweepSplit(g, psi) {
  const { n, wet, tileOf } = g;
  for (const colour of [0, 1]) {
    for (let k = 0; k < n; k++) for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      if ((i + j + k + colour) % 2 !== 0 || !wet[tileOf(i, j, k)]) continue;
      const c = i + n * (j + n * k);
      const step = [-1, 1, -n, n, -n * n, n * n];
      psi[c] = relaxed(g, c, psi[c], (d) => psi[c + step[d]]);
    }
  }
}

/** pressure_fused.wgsl's walk: each wet tile's box read from psiIn, its red cells relaxed in the
 *  box, then its black ones, both written to psiOut. */
function sweepFused(g, psiIn, psiOut) {
  const { n, tiles, wet } = g;
  const BOX = [20, TILE[1] + 4, TILE[2] + 4];
  const box = new Float32Array(BOX[0] * BOX[1] * BOX[2]);
  const boxIdx = (x, y, z) => x + BOX[0] * (y + BOX[1] * z);
  const inside = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n;
  const cell = (x, y, z) => x + n * (y + n * z);
  const threads = 8 * TILE[1] * TILE[2];
  for (let tz = 0; tz < tiles[2]; tz++) for (let ty = 0; ty < tiles[1]; ty++) for (let tx = 0; tx < tiles[0]; tx++) {
    if (!wet[tx + tiles[0] * (ty + tiles[1] * tz)]) continue;
    const tile = [tx * TILE[0], ty * TILE[1], tz * TILE[2]];
    const o = tile.map((v) => v - 2);
    for (let k = 0; k < box.length; k++) {
      const c = [o[0] + (k % BOX[0]), o[1] + (Math.floor(k / BOX[0]) % BOX[1]), o[2] + Math.floor(k / (BOX[0] * BOX[1]))];
      box[k] = inside(...c) ? psiIn[cell(...c)] : 0;
    }
    const step = [-1, 1, -BOX[0], BOX[0], -BOX[0] * BOX[1], BOX[0] * BOX[1]];
    const relax = (c, b) => (inside(...c) ? relaxed(g, cell(...c), box[b], (d) => box[b + step[d]]) : box[b]);
    const redRows = (BOX[1] - 2) * (BOX[2] - 2);
    for (let k = 0; k < 9 * redRows; k++) {
      const row = Math.floor(k / 9);
      const r = [o[0] + 1, o[1] + 1 + (row % (BOX[1] - 2)), o[2] + 1 + Math.floor(row / (BOX[1] - 2))];
      const c = [r[0] + 2 * (k % 9) + ((r[0] + r[1] + r[2]) & 1), r[1], r[2]];
      const b = boxIdx(c[0] - o[0], c[1] - o[1], c[2] - o[2]);
      box[b] = relax(c, b);
    }
    for (let li = 0; li < threads; li++) {
      const lid = [li % 8, Math.floor(li / 8) % TILE[1], Math.floor(li / (8 * TILE[1]))];
      const row = [tile[0], tile[1] + lid[1], tile[2] + lid[2]];
      const s = row[0] + row[1] + row[2];
      const red = [row[0] + 2 * lid[0] + (s & 1), row[1], row[2]];
      const black = [row[0] + 2 * lid[0] + ((s + 1) & 1), row[1], row[2]];
      if (black.every((v) => v < n)) psiOut[cell(...black)] = relax(black, boxIdx(black[0] - o[0], black[1] - o[1], black[2] - o[2]));
      if (red.every((v) => v < n)) psiOut[cell(...red)] = box[boxIdx(red[0] - o[0], red[1] - o[1], red[2] - o[2])];
    }
  }
}

test('fused sweeps leave every cell as the red and black dispatches do, to the bit', () => {
  // (A phone's grid, 40: its tiles along x overhang it; ones that fill their tiles; a small one.)
  for (const [n, seed] of [[40, 1], [48, 2], [32, 3], [20, 4]]) {
    const g = grid(n, seed);
    const want = Float32Array.from(g.psi);
    // (cell_prep.wgsl holds the other buffer at nought off the water; on it, anything.)
    const a = Float32Array.from(g.psi);
    const b = Float32Array.from(g.psi, (v, c) => (g.diag[c] === 0 ? 0 : NaN));
    for (let sweep = 0; sweep < 6; sweep++) {
      sweepSplit(g, want);
      if (sweep % 2 === 0) sweepFused(g, a, b);
      else sweepFused(g, b, a);
      const got = sweep % 2 === 0 ? b : a;
      for (let c = 0; c < want.length; c++) assert.ok(Object.is(got[c], want[c]), `grid ${n}, sweep ${sweep}, cell ${c}: ${got[c]} for ${want[c]}`);
    }
    assert.ok(g.wet.some((t) => !t) && g.wet.some((t) => t), `grid ${n} has wet and dry tiles`);
  }
});

test('the sweeps may switch between fused and two colours from one step to the next, to the bit', () => {
  // (Steps over water that rises and falls through the tiles, mostly to a tile's edge, where the
  // wet tile's cells read the dry one's, each with new equations and the last solve as its warm
  // start: cellPrep zeroes both buffers off the new water and leaves the rest, so the other buffer
  // holds an older step's solve wherever the water stayed. Without the zeroing this fails.)
  const n = 40;
  let want = null;
  let psi = null;
  let other = null;
  for (const [seed, top, fusedNow] of [[5, 32, true], [6, 16, false], [7, 16, true], [8, 36, false], [9, 24, true], [10, 30, false]]) {
    const g = grid(n, seed, top);
    want ??= Float32Array.from(g.psi);
    psi ??= Float32Array.from(g.psi);
    other ??= new Float32Array(g.psi.length);
    for (const buffer of [want, psi, other]) for (let c = 0; c < buffer.length; c++) if (g.diag[c] === 0) buffer[c] = 0;
    for (let sweep = 0; sweep < 4; sweep++) {
      sweepSplit(g, want);
      if (!fusedNow) sweepSplit(g, psi);
      else if (sweep % 2 === 0) sweepFused(g, psi, other);
      else sweepFused(g, other, psi);
    }
    for (let c = 0; c < want.length; c++) assert.ok(Object.is(psi[c], want[c]), `step ${seed}, cell ${c}: ${psi[c]} for ${want[c]}`);
  }
});

test("the fused sweep's shader walks its cells and sums their neighbours as these do", () => {
  // (The neighbours in pressure.wgsl's order - x, y, z, lower then upper - and the same relaxation.)
  assert.match(split, /let sum = wA\.x \* psi\[o \+ odd - 1u\] \+ wA\.y \* psi\[o \+ odd\]\s+\+ wA\.z \* psi\[o - h\] \+ wA\.w \* psi\[o \+ h\]\s+\+ wB\.x \* psi\[o - hn\] \+ wB\.y \* psi\[o \+ hn\];/);
  assert.match(split, /let gs = \(sum - r\.x\) \* r\.y;\s+psi\[c\] = mix\(psi\[c\], gs, P\.sor\);/);
  assert.match(fused, /let sum = wA\.x \* box\[b - 1u\] \+ wA\.y \* box\[b \+ 1u\]\s+\+ wA\.z \* box\[b - BOX_X\] \+ wA\.w \* box\[b \+ BOX_X\]\s+\+ wB\.x \* box\[b - BOX_XY\] \+ wB\.y \* box\[b \+ BOX_XY\];/);
  assert.match(fused, /let gs = \(sum - r\.x\) \* r\.y;\s+return mix\(box\[b\], gs, P\.sor\);/);
  // (The walk ported above.)
  for (const line of [
    'const BOX_X: u32 = 20u;',
    'const BOX_Y: u32 = PRESSURE_TILE_Y + 4u;',
    'const BOX_Z: u32 = PRESSURE_TILE_Z + 4u;',
    'const RED_ROWS: u32 = (BOX_Y - 2u) * (BOX_Z - 2u);',
    '@compute @workgroup_size(8, PRESSURE_TILE_Y, PRESSURE_TILE_Z)',
    'let tile = wid * vec3u(16u, PRESSURE_TILE_Y, PRESSURE_TILE_Z);',
    'if (pressureTiles[pressureTile(tile)] == 0u) { return; }',
    'let o = vec3i(tile) - vec3i(2);',
    'let c = o + vec3i(i32(k % BOX_X), i32((k / BOX_X) % BOX_Y), i32(k / BOX_XY));',
    'for (var k = li; k < 9u * RED_ROWS; k += THREADS) {',
    'let r = o + vec3i(1, 1 + i32(row % (BOX_Y - 2u)), 1 + i32(row / (BOX_Y - 2u)));',
    'let c = r + vec3i(2 * i32(k % 9u) + ((r.x + r.y + r.z) & 1), 0, 0);',
    'let row = vec3i(tile + vec3u(0u, lid.y, lid.z));',
    'let red = row + vec3i(2 * i32(lid.x) + (s & 1), 0, 0);',
    'let black = row + vec3i(2 * i32(lid.x) + ((s + 1) & 1), 0, 0);',
    'if (any(c < vec3i(0)) || any(c >= vec3i(n))) { return box[b]; }',
    'if (r.y == 0.0) { return box[b]; }',
  ]) assert.ok(fused.includes(line), `pressure_fused.wgsl: "${line}" has changed`);
});

test('the sim sweeps fused in pairs, so the solve ends in psi, and keeps the other buffer at nought off the water', () => {
  assert.match(sim, /if \(this\.fusedSweeps && this\.canFuse\) \{/);
  assert.match(sim, /for \(; sweeps >= 2; sweeps -= 2\) \{\s+for \(const group of fusedSweep\.bindGroups\) \{/);
  // (Wherever the grid has the fused kernel, while the sweeps go as two colours too: fusedSweeps
  // may switch them between steps.)
  assert.match(sim, /psi2: make\('pressure \(other\)', this\.canFuse \? C \* 4 : 16\)/);
  assert.match(sim, /\{ PING_PONG: this\.canFuse \? 1 : 0 \}/);
  assert.match(sim, /\.\.\.\(this\.canFuse\s+\? \[\['pressureFused'/);
  assert.match(sim, /\[\[b\.cellFaceW, b\.rhs, b\.psi, b\.pressureTiles, b\.psi2\], \[b\.cellFaceW, b\.rhs, b\.psi2, b\.pressureTiles, b\.psi\]\]/);
  assert.match(source('./src/sim/shaders/cell_prep.wgsl'), /psi\[pc\] = 0\.0;\s+if \(PING_PONG\) \{ psiOther\[pc\] = 0\.0; \}/);
});
