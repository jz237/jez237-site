// The pipeline counter (src/gpu/pipelineCount.ts) against a stand-in device: the bowl's large
// pipelines named by their pass, a second of a pass numbered, one built at once told apart (its
// compile is not timed: the frame that first draws with it waits for it), those built in the first
// frame counted, those after it counted and named; and its HUD lines a phone's width.
// Run: node --test pipeline-count.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const here = dirname(fileURLToPath(import.meta.url));
const bundle = await rolldown({ input: resolve(here, 'src/gpu/pipelineCount.ts'), platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
await bundle.close();
const { describePipelines, pipelineMarks, pipelineSnapshot, pipelinesFirstFrame, watchPipelines } = await import('data:text/javascript;base64,' + Buffer.from(output[0].code).toString('base64'));

const tick = () => new Promise((r) => setTimeout(r, 2));

test("the bowl's pipelines, one built at once, the first frame's and the late ones", async () => {
  const device = { createShaderModule: (d) => ({ code: d.code }), createRenderPipeline: () => ({}), createRenderPipelineAsync: async () => ({}), createComputePipeline: () => ({}), createComputePipelineAsync: async () => ({}) };
  watchPipelines(device);
  const bowl = (koi) => device.createShaderModule({ code: `const GLOBES_KOI: bool = ${koi};\nfn globes_bowlTrace() {}\n${' '.repeat(140_000)}` });
  const small = device.createShaderModule({ code: 'fn main() {}' });
  const main = bowl(false);
  for (let k = 0; k < 5; k++) device.createComputePipeline({ label: `sim ${k}` });
  await Promise.all([device.createRenderPipelineAsync({ fragment: { module: main } }), device.createRenderPipelineAsync({ fragment: { module: bowl(true) } })]);
  await tick();
  // The first frame: the bowl again, for a target it was not built for, at once; and a small one.
  const start = performance.now();
  device.createRenderPipeline({ label: 'renderPipeline_bowl_mirror', fragment: { module: main } });
  device.createRenderPipeline({ label: 'renderPipeline_SpriteNodeMaterial_7', fragment: { module: small } });
  pipelinesFirstFrame(start);
  // After it: four more, the first three named.
  for (let k = 0; k < 4; k++) device.createRenderPipeline({ label: `renderPipeline_MeshPhysicalNodeMaterial_${k}_with_a_long_name`, fragment: { module: small } });
  await device.createComputePipelineAsync({ label: 'late compute' });

  const snap = pipelineSnapshot();
  assert.equal(snap.total, 14);
  assert.deepEqual(snap.large.map((b) => [b.label, b.sync, b.ready !== null]), [['bowl', false, true], ['bowlKoi', false, true], ['bowl#2', true, false]]);
  assert.equal(snap.inFirstFrame, 2);
  assert.equal(snap.sinceFirstFrame, 5);
  assert.equal(snap.lateLabels.at(-1), 'late compute');
  // (Only a compile it timed is a milestone of the load.)
  assert.deepEqual(pipelineMarks().map(([n]) => n), ['bowl compiled', 'bowlKoi compiled']);

  const text = describePipelines();
  for (const l of text.split('\n')) assert.ok(l.length <= 52, `too wide (${l.length}): ${l}`);
  assert.match(text, /^pipelines: 14 built · bowl \d\.\d s · bowlKoi \d\.\d s\n {2}bowl#2 sync · 2 in the first frame · 5 late\n/);
  assert.equal(text.split('\n').filter((l) => l.includes('MeshPhysicalNodeMaterial')).length, 3);
  assert.match(text, /\+2$/);
});
