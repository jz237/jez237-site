// The betta bowl's furnishings made as scapeWorker.mjs makes them (the wood and the rocks in a
// worker of their own, handed over as a worker hands them; the plants meanwhile) are the same, to
// the bit, as made in one go (scapeBuild.mjs buildFurnishings), at the phones' detail; their
// texture has room for the bubble nest's rows where the shader looks for them, which the page fills
// (the worker never makes the nest); and the page asks its worker, as it is read (betta.html), what
// main.ts asks of it.
// Run: node --test scape-build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
import { NEST_MAX, nest, nestRows, withNest } from './src/render/scape/nest.mjs';
import { buildFurnishings, furnishingsOf } from './src/render/scape/scapeBuild.mjs';
import { buildScapePieces, SCAPE_PIECE_NAMES } from './src/render/scape/scene.mjs';

const N = 256;
const EXTENT = 0.99125;
const NONE = -1.2;
const DETAIL = 0.5;

/** The pieces named, made in a thread of their own (its own modules, as a worker's are). */
function apart(only) {
  const scene = new URL('./src/render/scape/scene.mjs', import.meta.url).href;
  const code = `import { parentPort, workerData } from 'node:worker_threads';
import { buildScapePieces } from ${JSON.stringify(scene)};
parentPort.postMessage(buildScapePieces(workerData));`;
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(`data:text/javascript,${encodeURIComponent(code)}`), { workerData: { detail: DETAIL, only } });
    worker.once('message', (pieces) => {
      void worker.terminate();
      resolve(pieces);
    });
    worker.once('error', reject);
  });
}

const bytes = (a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength);

test('furnishings made in two workers are the ones made in one go', async () => {
  const others = apart(['wood', 'rocks']);
  const here = buildScapePieces({ detail: DETAIL, only: ['plants'] });
  const pieces = [...(await others), ...here].sort((a, b) => SCAPE_PIECE_NAMES.indexOf(a.name) - SCAPE_PIECE_NAMES.indexOf(b.name));
  assert.deepEqual(pieces.map((p) => p.name), SCAPE_PIECE_NAMES);
  const split = furnishingsOf(pieces, N, EXTENT, NONE);
  const whole = buildFurnishings(N, EXTENT, NONE, DETAIL);
  assert.equal(split.width, whole.width);
  assert.equal(split.height, whole.height);
  assert.ok(bytes(split.data).equals(bytes(whole.data)), 'the BVH texels');
  assert.ok(bytes(split.map).equals(bytes(whole.map)), "the bed's solids");
  assert.deepStrictEqual(split.obstacles, whole.obstacles);
  assert.deepStrictEqual(split.motion, whole.motion);
});

test("the texture has room for the nest's bubbles after the vertices, where texel 3 says, and the page writes them in, each number to six decimals", () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
  const f = buildFurnishings(N, EXTENT, NONE, DETAIL);
  const D = f.data;
  const rows = D[15];
  // (After the vertices: two texels each, from texel 1's w.)
  assert.equal(rows, D[7] + D[11] * 2);
  const NEST = nest();
  assert.ok(NEST.length > 100 && NEST.length <= NEST_MAX);
  assert.ok((rows + NEST_MAX) * 4 <= D.length);
  // (Left empty by the worker, which never makes the nest: that would hold the furnishings up. The
  // page has made it as it loaded, and writes it in.)
  assert.ok(D.subarray(rows * 4, (rows + NEST_MAX) * 4).every((x) => x === 0));
  for (const file of ['scapeBuild.mjs', 'scapeWorker.mjs', 'scapePieceWorker.mjs']) {
    assert.doesNotMatch(read(`./src/render/scape/${file}`), /\b(nest|nestRows|withNest)\(/, file);
  }
  assert.doesNotMatch(read('./src/render/scape/nest.mjs'), /^(export )?(const|let) \w+ = (buildNest|nest)\(\)/m);
  assert.match(read('./src/render/scape/furnishings.ts'), /data: withNest\(b\.data\)/);
  assert.equal(withNest(D), D);
  const want = nestRows();
  assert.equal(want.length, NEST.length * 4);
  for (let i = 0; i < want.length; i++) {
    // (As a WGSL literal of it to six decimals would be: the nearest f32 to the nearest f64.)
    const x = NEST[i >> 2][i & 3];
    assert.equal(want[i], Math.fround(Number(x.toFixed(6))));
    assert.equal(D[rows * 4 + i], want[i]);
  }
  // (Not a const array in the bowl's shader: see bowlScape.ts scape_nestAlong.)
  assert.ok(!read('./src/render/bowlScape.ts').includes('array<'));
});

test('betta.html asks the furnishings what main.ts asks', () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
  const main = read('./src/main.ts');
  const page = read('./betta.html');
  const one = (text, pattern) => {
    const m = text.match(pattern);
    assert.ok(m, `${pattern} not found`);
    return m[1];
  };
  // (Its phone test is main.ts's LITE.)
  assert.ok(page.includes(one(main, /const LITE = .*q === '0' \? false : (.*?)\)\)\(/)));
  assert.match(main, /furnish\(BED_SOLIDS_N, o\.globe\.innerRadius, BED_SOLIDS_NONE, LITE \? 0\.5 : 1\)/);
  const ask = one(page, /const ask = (\{.*\});/);
  assert.equal(ask, `{ n: ${one(read('./src/sim/FluidSim.ts'), /export const BED_SOLIDS_N = (.*);/)}, extent: ${one(read('./src/config.ts'), /innerRadius: ([\d.]+),/)}, none: ${one(read('./src/sim/FluidSim.ts'), /export const BED_SOLIDS_NONE = (.*);/)}, detail: lite ? 0.5 : 1 }`);
});
