// The betta bowl's furnishings made as scapeWorker.mjs makes them (the wood and the rocks in a
// worker of their own, handed over as a worker hands them; the plants meanwhile) are the same, to
// the bit, as made in one go (scapeBuild.mjs buildFurnishings), at the phones' detail; and the
// page asks its worker, as it is read (betta.html), what main.ts asks of it.
// Run: node --test scape-build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
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
