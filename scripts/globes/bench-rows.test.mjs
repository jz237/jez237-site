// ?bench's rows (src/app/bench.ts): run in turn, each set up, let settle, measured and put back as
// it was; the pixel ratios in their order, coming back to some, and none past the screen's own;
// rows other parts of the page add run after the rest, or alone (?bench=<group>); the whole run
// done in about two minutes; and its text fits a phone's screen held upright, the device's report
// and the pipelines' line with it. (Driven here frame by frame against a stand-in world, its frames
// 1/60 s apart, the sim's times counted each frame as main.ts counts them.)
// Run: node --test bench-rows.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const here = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(resolve(here, path), 'utf8');

/** bench.ts bundled for Node, with the pipeline counter it reads (a fresh copy each time: its rows
 *  are registered as it loads). */
let copies = 0;
async function benchModule() {
  const src = (path) => resolve(here, 'src', path).replaceAll('\\', '/');
  const entry = `export * from '${src('app/bench.ts')}';\nexport { pipelinesFirstFrame, watchPipelines } from '${src('gpu/pipelineCount.ts')}';`;
  const plugin = { name: 'entry', resolveId: (id) => (id === 'entry' ? '\0entry' : undefined), load: (id) => (id === '\0entry' ? entry : undefined) };
  const bundle = await rolldown({ input: 'entry', platform: 'node', plugins: [plugin], logLevel: 'silent' });
  const { output } = await bundle.generate({ format: 'esm' });
  await bundle.close();
  return import('data:text/javascript;base64,' + Buffer.from(`${output[0].code}\n// ${++copies}`).toString('base64'));
}

const PHONE_PASSES = { 'flip substep': 2.4, splash: 1.6, 'sand + container': 0.9, 'density field': 0.7, photons: 0.4, 'shift + probes': 0.1 };

/** A world with what the rows reach into, which keeps a log of what was done to it. (Its sim's
 *  passes' times stay as they are, as FluidSim's do while its step does not run.) */
function standIn() {
  const log = [];
  class Sim {
    cfg = { pressureIterations: 24, minSubsteps: 2, maxSubsteps: 3, minSubstepDt: 1 / 240 };
    // (The phone's passes, as bench #2 timed them.)
    gpuTimes = { ...PHONE_PASSES };
    step() {}
  }
  const layers = new Set([0, 1]);
  const world = {
    ratio: 1,
    renderer: { getPixelRatio: () => world.ratio },
    camera: { layers: { enable: (l) => layers.add(l), disable: (l) => layers.delete(l) } },
    layers,
    sim: new Sim(),
    controller: { glideTo: (x) => log.push(`glide ${x}`) },
    globe: { mesh: { visible: true } },
    studio: { table: { visible: true }, mirror: { visible: true } },
    // (No timestamps: the dispatch probe has nothing to time with.)
    device: {
      features: new Set(),
      createShaderModule: () => ({}),
      createComputePipeline: () => ({ getBindGroupLayout: () => ({}) }),
      createBuffer: () => ({}),
      createBindGroup: () => ({}),
    },
  };
  const ratios = [];
  const setRatio = (r) => {
    ratios.push(r);
    world.ratio = r ?? 1;
  };
  let takes = 0;
  let sims = [];
  const prof = {
    gpuSim: (ms) => sims.push(ms),
    take: () => {
      takes++;
      const gpuSim = sims.length ? Math.max(...sims) : null;
      sims = [];
      // (The drawing slows a little after the first row, as a phone warms.)
      const warm = takes > 2 ? 0.4 : 0;
      return { frames: 180, fps: 60, p50: 16.7, p90: 17.1, cpu: { input: 0.2, betta: 9, plants: 0, life: 0, food: 0, sim: 0.2, scene: 0.1, draw: 0.5 }, cpuTotal: 10.3, gpuSim, gpuDraw: (world.globe.mesh.visible ? 7.2 : 1.2) + warm, gpuQueue: 16.6 };
    },
  };
  return { world, setRatio, ratios, prof, log, takes: () => takes };
}

/** Runs a bench to its end (or a time limit): the seconds it took, and what each frame saw. */
function run(bench, s, limit = 600) {
  const { world, prof } = s;
  const t0 = performance.now();
  const seen = [];
  let now = t0;
  for (; now - t0 < limit * 1000 && !bench.finished; now += 1000 / 60) {
    // (As main.ts: the sim stepped, then its passes' times counted as the frame's.)
    world.sim.step();
    const simMs = Object.values(world.sim.gpuTimes).reduce((a, b) => a + b, 0);
    if (simMs > 0) prof.gpuSim(simMs);
    bench.frame(now);
    seen.push({ table: world.studio.table.visible, fish: world.layers.has(1), bowl: world.globe.mesh.visible, sim: Object.hasOwn(world.sim, 'step'), iters: world.sim.cfg.pressureIterations });
  }
  return { seconds: (now - t0) / 1000, seen };
}

globalThis.window = { devicePixelRatio: 2.625 };
globalThis.GPUBufferUsage = { STORAGE: 128, QUERY_RESOLVE: 512, COPY_SRC: 4, COPY_DST: 8, MAP_READ: 1 };
// (The user's phone held upright, in Chrome: its ?bench gave 384x693 css px.)
globalThis.innerWidth = 384;
globalThis.innerHeight = 693;

test('every row is run in turn, put back, and the whole is done in about two minutes', async () => {
  const { Bench } = await benchModule();
  const s = standIn();
  const bench = new Bench(s.world, s.prof, s.setRatio, '', true);
  const { seconds, seen } = run(bench, s);
  assert.ok(bench.finished);
  // The ratios: interleaved and repeated, then the parts left out at 0.6 and 1, then the sim's at
  // 0.6; and the page's own after.
  assert.deepEqual(s.ratios, [0.6, 1, 0.8, 1.25, 0.6, 1.5, 2, 1, 0.6, 1, 0.6, 1, 0.6, 1, 0.6, 1, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, null]);
  assert.ok(seconds > 100 && seconds < 115, `took ${seconds.toFixed(1)} s`);
  // Each part was left out for a while, and is back.
  for (const k of ['table', 'fish', 'bowl']) {
    assert.ok(seen.some((f) => !f[k]), `${k} never left out`);
    assert.ok(seen.at(-1)[k], `${k} not put back`);
  }
  assert.ok(seen.some((f) => f.sim) && !seen.at(-1).sim, "the sim's step not skipped, or not put back");
  assert.deepEqual(s.world.sim.gpuTimes, PHONE_PASSES);
  assert.deepEqual([...new Set(seen.map((f) => f.iters))].sort((a, b) => a - b), [8, 24, 40]);
  assert.deepEqual(s.world.sim.cfg, { pressureIterations: 24, minSubsteps: 2, maxSubsteps: 3, minSubstepDt: 1 / 240 });
  // (The shaken rows roll the bowl, and set it back in the middle.)
  assert.ok(s.log.filter((l) => l === 'glide 0.5').length >= 6 && s.log.at(-1) === 'glide 0');
  // A take before each row is measured (dropping the settling frames), one at its end.
  assert.equal(s.takes(), 2 * 22);
});

test("the fish's row leaves out the fish's own layer", () => {
  assert.equal(/const FISH_LAYER = (\d+);/.exec(read('src/app/bench.ts'))?.[1], /export const BOWL_KOI_LAYER = (\d+);/.exec(read('src/render/GlobeView.ts'))?.[1]);
});

test('no ratio past the screen\'s own; one group alone; rows added run after the rest', async () => {
  const { Bench, registerBenchRows } = await benchModule();
  window.devicePixelRatio = 1;
  let s = standIn();
  run(new Bench(s.world, s.prof, s.setRatio, 'ratio', true), s);
  assert.deepEqual(s.ratios, [0.6, 1, 0.8, 0.6, 1, null]);
  window.devicePixelRatio = 2.625;

  const ts = [];
  registerBenchRows('mine', [{ label: 'mine', ratio: 0.8, apply: (w) => (w.globe.mesh.visible = false), restore: (w) => (w.globe.mesh.visible = true), frame: (w, t) => ts.push(t) }]);
  s = standIn();
  run(new Bench(s.world, s.prof, s.setRatio, '', true), s);
  assert.deepEqual(s.ratios.slice(-2), [0.8, null]);
  s = standIn();
  const alone = new Bench(s.world, s.prof, s.setRatio, 'mine', true);
  const { seconds } = run(alone, s);
  assert.deepEqual(s.ratios, [0.8, null]);
  assert.ok(seconds > 9 && seconds < 10.5, `took ${seconds.toFixed(1)} s`);
  // (Its own frames, from the time it was set up: 4.5 s of them.)
  assert.ok(ts[0] < 0.02 && Math.abs(ts.at(-1) - 4.5) < 0.05);
  assert.ok(s.world.globe.mesh.visible);
});

test("its text fits a phone's screen held upright", async () => {
  const { Bench, describeDevice, pipelinesFirstFrame, watchPipelines } = await benchModule();
  // The pipelines a phone builds: the bowl's two, compiling as the page loads, the rest small;
  // three of them in the first frame.
  const device = { createShaderModule: (d) => ({ code: d.code }), createRenderPipeline: () => ({}), createRenderPipelineAsync: async () => ({}), createComputePipeline: () => ({}), createComputePipelineAsync: async () => ({}) };
  watchPipelines(device);
  const bowl = (koi) => device.createShaderModule({ code: `const GLOBES_KOI: bool = ${koi};\nfn globes_bowlTrace() {}\n${' '.repeat(140_000)}` });
  for (let k = 0; k < 40; k++) device.createComputePipeline({ label: `sim ${k}` });
  await Promise.all([device.createRenderPipelineAsync({ fragment: { module: bowl(false) } }), device.createRenderPipelineAsync({ fragment: { module: bowl(true) } })]);
  for (let k = 0; k < 37; k++) device.createRenderPipeline({ label: `renderPipeline_MeshBasicNodeMaterial_${k}` });
  await new Promise((r) => setTimeout(r, 2));
  const start = performance.now();
  for (let k = 0; k < 3; k++) device.createRenderPipeline({ label: `renderPipeline_SpriteNodeMaterial_${k}` });
  pipelinesFirstFrame(start);

  const s = standIn();
  const bench = new Bench(s.world, s.prof, s.setRatio, '', true);
  run(bench, s);
  // (The dispatch probe's answer comes a moment after it is asked.)
  await new Promise((r) => setTimeout(r, 0));
  // (The load's milestones, all that main.ts marks.)
  const load = [['script', 340], ['device', 520], ['renderer', 610], ['furnishings', 2140], ['sim', 2890], ['settled', 3400], ['compiled', 10760], ['first frame', 10810], ['drawn', 10920]];
  const text = bench.text(load);
  // (A phone's report, its GPU named at length as some browsers name it: its lines go after the
  // first.)
  const report = describeDevice(true, { vendor: 'qualcomm', architecture: 'adreno-8xx', device: '', description: 'Qualcomm Technologies, Inc. Adreno (TM) 830', features: ['timestamp-query', 'shader-f16', 'subgroups', 'texture-formats-tier1'], limits: { maxTextureDimension2D: 16384, maxStorageBuffersPerShaderStage: 10, maxComputeWorkgroupStorageSize: 32768, maxBufferSize: 2147483648 }, lowPower: false });
  const lines = [...text.split('\n'), ...report.flatMap((l) => l.split('\n'))];
  for (const l of lines) assert.ok(l.length <= 52, `too wide (${l.length}): ${l}`);
  assert.equal(report[1], 'has: timestamps · f16 · subgroups · tier1');
  // As many lines as the HUD holds on the screen, above the page's links (main.ts's HUD style).
  const css = /hud\.style\.cssText = '([^']+)'/.exec(read('src/main.ts'))[1];
  const [, size, leading] = /font:(\d+)px\/([\d.]+)/.exec(css);
  const holds = Math.floor((innerHeight - Number(/bottom:calc\((\d+)px/.exec(css)[1]) - 2 * Number(/padding:(\d+)px/.exec(css)[1])) / (size * leading));
  assert.ok(lines.length <= holds, `${lines.length} lines, the screen holds ${holds}`);
  assert.match(text, /^ratio {5}0\.60  60\.0 16\.7\/17\.1 10\.3  6\.1\/ 7\.2$/m);
  assert.match(text, /^ratio {5}0\.60  60\.0 16\.7\/17\.1 10\.3  6\.1\/ 7\.6$/m);
  // (A part left out: the drawing it saved, last, against the two ratio rows' mean; the sim's
  // passes not run, no time for them.)
  assert.match(text, /^-bowl {5}0\.60  60\.0 16\.7\/17\.1 10\.3  6\.1\/ 1\.6  5\.8$/m);
  assert.match(text, /^-sim {6}0\.60  60\.0 16\.7\/17\.1 10\.3   -\/ 7\.6 -0\.2$/m);
  assert.match(text, /^-sim {6}1\.00  60\.0 16\.7\/17\.1 10\.3   -\/ 7\.6  0\.0$/m);
  assert.match(text, /sim passes \(ms\): flip substep 2\.40 · splash 1\.60\n {2}sand \+ container 0\.90 · density field 0\.70\n {2}photons 0\.40 · shift \+ probes 0\.10$/m);
  assert.match(text, /a dispatch: no timestamps/);
  assert.match(text, /^pipelines: 82 built · bowl \d\.\d s · bowlKoi \d\.\d s\n {2}3 in the first frame · 0 late$/m);
  // (The bowl's compiles among the load's milestones, in the order they came.)
  const loadLine = text.slice(text.indexOf('load (s):')).replace(/\n {2}/g, ' · ').split('\n')[0];
  assert.match(loadLine, /^load \(s\): bowl compiled \d\.\d\d · bowlKoi compiled \d\.\d\d · script 0\.34 · device 0\.52 · .* · first frame 10\.81 · drawn 10\.92$/);
  assert.match(text, /reload/);
});
