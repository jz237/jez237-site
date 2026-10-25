// The betta bowl's interleave (render/bowlRender.ts), held to its CPU mirror (render/bowlResolve.mjs):
// a still view comes to the full trace exactly in four frames; a reset or a moving view keeps
// nothing traced before it; the change test, and what a change round a pixel does to its sample
// (held within its neighbours' span; filled in where most round it changed); the fish and spray
// never kept, the fish's pixels marked for its own pass; a sample that is not a number spreads
// nowhere. And the resolve's WGSL as three reads it (each pass's function first).
// Run: node --test upsample-resolve.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { changed, changedCounters, CHANGE_TAU, clean, easu, HIT, idOf, latticeSize, PHASES, resolvePixel, Schedule, TAPS, viewOffset, WIDE_CHANGE } from './src/render/bowlResolve.mjs';

/** A picture of w x h, as a full trace draws it: by pixel [r, g, b, 1 + hit] (0 alpha: a miss). */
function scene(w, h, seed = 1) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296);
  return Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => {
    // (The bowl's outline, a disc; inside it two kinds of ground and a line one pixel thin.)
    if ((x - w / 2) ** 2 + (y - h / 2) ** 2 > (0.45 * Math.min(w, h)) ** 2) return [0, 0, 0, 0];
    const id = y === 3 ? HIT.SURFACE + HIT.CROSSED : x < w / 2 ? HIT.SAND : HIT.WOOD;
    return [rnd() * 2, rnd(), rnd() * 0.5, 1 + id];
  }));
}

/** The lattice of a k x k phase of a picture: texel (i, j) is pixel (k i + px, k j + py)'s (one past
 *  the edge is the edge's: the lattice is a pixel wider where the picture's size is odd). */
function lattice(pic, k, [px, py]) {
  const [w, h] = latticeSize(pic[0].length, pic.length, k);
  return Array.from({ length: h }, (_, j) => Array.from({ length: w }, (_, i) => pic[Math.min(k * j + py, pic.length - 1)][Math.min(k * i + px, pic[0].length - 1)].slice()));
}

/** Runs the interleave over frames of pictures (one each), returning the last frame's resolve. */
function run(frames, { still = () => true, fishRung = true, tau = CHANGE_TAU, wide = WIDE_CHANGE } = {}) {
  const k = 2;
  const schedule = new Schedule(k);
  const lats = PHASES[k].map(() => null);
  let flags = null;
  let out = null;
  frames.forEach((pic, n) => {
    const { phase, oldValid } = schedule.next(still(n));
    const now = lattice(pic, k, PHASES[k][phase]);
    const before = lats[phase] ?? now.map((row) => row.map(() => [0, 0, 0, 0]));
    flags = changedCounters({ now, before, oldValid, last: flags, still: still(n), k, tau });
    lats[phase] = now;
    const filled = lats.map((l) => l ?? now.map((row) => row.map(() => [0, 0, 0, 0])));
    out = pic.map((row, y) => row.map((_, x) => resolvePixel({ x, y, k, lattices: filled, current: phase, schedule, flags, fishRung, wide })));
  });
  return out;
}

test('a still view is the full trace exactly once each phase has been traced, and not before', () => {
  for (const [w, h] of [[16, 12], [13, 9]]) {
    const pic = scene(w, h);
    for (let n = 1; n <= 6; n++) {
      const out = run(Array(n).fill(pic));
      const exact = out.every((row, y) => row.every((p, x) => p.kept && p.colour.every((v, c) => v === pic[y][x][c]) && p.id === idOf(pic[y][x])));
      assert.equal(exact, n >= 4, `${w}x${h}, ${n} frames`);
    }
  }
});

test('the lattice\'s camera puts each texel\'s ray through its pixel\'s centre', () => {
  // (setViewOffset(W, H, ox, oy, k Lw, k Lh) on a view of Lw texels: texel i's centre at ox + k i + k / 2.)
  for (const k of [1, 2]) {
    for (const ph of PHASES[k]) {
      const [ox, oy] = viewOffset(k, ph);
      for (let i = 0; i < 5; i++) {
        assert.equal(ox + k * i + k / 2, k * i + ph[0] + 0.5);
        assert.equal(oy + k * i + k / 2, k * i + ph[1] + 0.5);
      }
    }
  }
  assert.deepEqual(latticeSize(13, 9, 2), [7, 5]);
  // (Each pixel's phase is traced once in four frames.)
  const seen = new Set(PHASES[2].map(([x, y]) => `${x},${y}`));
  assert.equal(seen.size, 4);
});

test('a reset, or a view that moved, keeps nothing traced before it (four frames to come back)', () => {
  const pic = scene(16, 12);
  for (const movedAt of [5, 6]) {
    for (let after = 0; after <= 4; after++) {
      const frames = Array(movedAt + 1 + after).fill(pic);
      const out = run(frames, { still: (n) => n !== movedAt });
      const kept = out.flat().filter((p) => p.kept).length;
      const n = out.flat().length;
      // (The moving frame keeps only its own phase; each still frame after it one phase more.)
      if (after < 3) assert.ok(kept < n, `moved at ${movedAt}, ${after} after: ${kept}/${n} kept`);
      else assert.equal(kept, n, `moved at ${movedAt}, ${after} after`);
    }
  }
  const s = new Schedule(2);
  for (let n = 0; n < 4; n++) s.next(true);
  s.reset();
  const { phase } = s.next(true);
  assert.deepEqual([0, 1, 2, 3].map((i) => s.valid(i)), [0, 1, 2, 3].map((i) => i === phase));
});

test('while the view moves the lattice holds its place, and goes on from the next phase once still', () => {
  const s = new Schedule(2);
  const phases = [true, true, false, false, false, true, true, true].map((still) => s.next(still).phase);
  assert.deepEqual(phases, [0, 1, 2, 2, 2, 3, 0, 1]);
});

test('the change test: light that changes by more than tau, or a hit that changes with its colour', () => {
  const a = [1, 1, 1, 1 + HIT.SAND];
  assert.equal(changed(a, a), false);
  assert.equal(changed([1.2, 1.2, 1.2, a[3]], a), false, 'a fifth brighter: the dapple drifting');
  assert.equal(changed([2, 2, 2, a[3]], a), false, 'twice as bright: a line of the dapple passing');
  assert.equal(changed([3, 3, 3, a[3]], a), true, 'three times as bright');
  assert.equal(changed([1.01, 1.01, 1.01, 1 + HIT.WOOD], a), false, 'another hit, the same colour');
  assert.equal(changed([1.1, 1.1, 1.1, 1 + HIT.WOOD], a), true, 'another hit, another colour');
  assert.equal(changed([0.001, 0, 0, a[3]], [0.004, 0, 0, a[3]]), false, 'dark: under the floor');
  // (The counters: set to the frames each pixel waits for, then run down; nothing while moving.)
  const now = [[a, [3, 3, 3, a[3]]]];
  const before = [[a, a]];
  let c = changedCounters({ now, before, oldValid: true, last: null, still: true, k: 2 });
  assert.deepEqual(c, [[0, 3]]);
  c = changedCounters({ now: before, before, oldValid: true, last: c, still: true, k: 2 });
  assert.deepEqual(c, [[0, 2]]);
  assert.deepEqual(changedCounters({ now, before, oldValid: false, last: c, still: true, k: 2 }), [[0, 1]]);
  assert.deepEqual(changedCounters({ now, before, oldValid: true, last: c, still: false, k: 2 }), [[0, 0]]);
});

test('round a change a sample is held within its neighbours\' span; where most changed, filled in', () => {
  const w = 16, h = 12;
  const pic = scene(w, h);
  // (A block's pixel brightens for good: its block's counters are set the frame its phase is traced.)
  const lit = pic.map((row) => row.map((p) => p.slice()));
  for (let y = 4; y < 6; y++) for (let x = 6; x < 8; x++) lit[y][x] = [5, 5, 5, lit[y][x][3]];
  const out = run([pic, pic, pic, pic, lit, lit]);
  const near = out[4][8];
  assert.ok(near.kept, 'beside the change: kept');
  // (Every block lit: the counters set everywhere, so nothing kept but this frame's phase.)
  const all = pic.map((row) => row.map((p) => (p[3] > 0 ? [p[0] * 4, p[1] * 4, p[2] * 4, p[3]] : p)));
  const out2 = run([pic, pic, pic, pic, all]);
  const inside = out2.flat().filter((p, i) => pic.flat()[i][3] > 0);
  assert.ok(inside.filter((p) => p.kept).length < inside.length / 2, 'most filled in');
  // (A clamp keeps it within what its nearest four of this frame span.)
  const s = new Schedule(2);
  const flat = [[1, 1, 1, 1 + HIT.SAND]];
  const lats = PHASES[2].map(() => [[...flat[0]], [...flat[0]]].map((c) => [c, c, c]));
  for (let n = 0; n < 4; n++) s.next(true);
  lats[0] = [[[9, 9, 9, 1 + HIT.SAND], [1, 1, 1, 1 + HIT.SAND]], [[1, 1, 1, 1 + HIT.SAND], [1, 1, 1, 1 + HIT.SAND]]];
  const cur = s.next(true).phase;
  const flags = [[3, 0], [0, 0]];
  const p = resolvePixel({ x: 0, y: 0, k: 2, lattices: lats, current: (cur + 1) % 4, schedule: s, flags });
  assert.ok(p.colour.every((v) => v <= 9 && v >= 1));
});

test('the fish and spray are never kept; the fish\'s pixels are marked for its pass, and left out of a fill', () => {
  const w = 16, h = 12;
  for (const fish of [HIT.FISH, HIT.FISH + HIT.CROSSED, HIT.SPLASH]) {
    const pic = scene(w, h).map((row, y) => row.map((p, x) => (x >= 6 && x < 10 && y >= 4 && y < 8 ? [9, 0, 0, 1 + fish] : p)));
    const out = run(Array(6).fill(pic));
    const inBox = out.slice(4, 8).flatMap((row) => row.slice(6, 10));
    assert.equal(inBox.filter((p) => p.kept).length, 4 * 4 / 4, `only this frame's phase of ${fish} kept`);
    const marked = out.flat().filter((p) => p.mark).length;
    if (fish === HIT.SPLASH) assert.equal(marked, 0);
    else assert.ok(marked >= 16, `the fish's ${marked} pixels marked`);
    if (fish !== HIT.SPLASH) assert.equal(run(Array(6).fill(pic), { fishRung: false }).flat().filter((p) => p.mark).length, 0, 'no marks without the fish\'s pass');
  }
  // (Filled in next to the fish, its pass drawing it: the fish's taps not drawn from.)
  const taps = TAPS.map((_, t) => (t === 3 ? [9, 0, 0, 1 + HIT.FISH] : [1, 1, 1, 1 + HIT.SAND]));
  const use = taps.map((c) => idOf(c) !== HIT.FISH);
  assert.deepEqual(easu([0.5, 0.5], taps, use), [1, 1, 1]);
});

test('a sample that is not a number reaches no pixel but its own, which shows the backdrop', () => {
  const w = 16, h = 12;
  const pic = scene(w, h);
  const bad = pic.map((row) => row.map((p) => p.slice()));
  bad[6][8] = [NaN, Infinity, 1, 1 + HIT.SAND];
  bad[5][9] = [1, 1, 1, NaN];
  for (let n = 1; n <= 6; n++) {
    const out = run(Array(n).fill(bad));
    for (const p of out.flat()) assert.ok(p.colour.every(Number.isFinite), `${n} frames: a colour not a number`);
  }
  assert.deepEqual(clean([NaN, -Infinity, 2, 3]), [0, 0, 2, 3]);
  // (Its alpha not a number: the pixel is a miss.)
  assert.equal(idOf(clean([1, 1, 1, NaN])), HIT.MISS);
});

test('EASU: a flat picture stays flat, an edge stays within its sides, and no taps give nothing', () => {
  const flat = TAPS.map(() => [0.5, 0.25, 2, 4]);
  const all = TAPS.map(() => true);
  for (const pp of [[0.5, 0], [0, 0.5], [0.5, 0.5], [0.25, 0.75]]) {
    easu(pp, flat, all).forEach((v, c) => assert.ok(Math.abs(v - flat[0][c]) < 1e-6));
  }
  const edge = TAPS.map(([x]) => (x <= 0 ? [0, 0, 0, 4] : [1, 1, 1, 4]));
  const v = easu([0.5, 0.5], edge, all);
  assert.ok(v.every((c) => c >= 0 && c <= 1));
  assert.equal(easu([0.5, 0.5], flat, TAPS.map(() => false)), null);
});

// (The resolve's WGSL: three's wgslFn takes the first function of its code as the one called, so
// each pass's must come first; its helpers follow. Bundled the shaders' TypeScript would need Vite:
// Node strips the types itself from 22.18 and 23.6.)
const wgsl = await import('./src/render/bowlResolveWGSL.ts').catch(() => null);
test('the passes\' WGSL: each one\'s function first, braces balanced, every debug view', { skip: wgsl ? false : `needs a Node that strips TypeScript's types (this is ${process.version})` }, () => {
  const first = (code) => code.replace(/^(?:\s*\/\/[^\n]*|\s*)+/, '').match(/^fn (\w+)\(/)?.[1];
  const balanced = (code) => [...code].reduce((d, c) => (d < 0 ? d : d + (c === '{' ? 1 : c === '}' ? -1 : 0)), 0) === 0;
  for (const debug of [0, 'id', 'age', 'changed', 'nan']) {
    const code = wgsl.resolveWGSL(2, debug);
    assert.equal(first(code), 'bowlUp_resolve', `debug ${debug}`);
    assert.ok(balanced(code), `debug ${debug}`);
    // (No array indexed by a variable: a private array per invocation on the phone, docs/architecture.md.)
    assert.ok(!/array</.test(code));
  }
  assert.equal(first(wgsl.flagsWGSL()), 'bowlUp_flags');
  assert.equal(first(wgsl.COMPOSITE_WGSL), 'bowlUp_composite');
  for (const code of [wgsl.resolveWGSL(2), wgsl.flagsWGSL(), wgsl.COMPOSITE_WGSL]) assert.ok(balanced(code));
});
