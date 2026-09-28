// Fresh, immutable forest-edge evidence. Run from the project root, using a
// unique phase for every candidate. Fixed cameras never depend on new assets.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';

const phase = process.env.QUARRY_FOREST_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_FOREST_OUTPUT || 'outputs/forest-edge', phase);
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
const allViews = [
  { name: 'rear-chase', player: [0, -20, 0], position: [0, 3.7, -28], target: [0, .85, -16] },
  { name: 'forest-crest', player: [68, 82, 0], position: [67, 6, 83], target: [94, 25, 156] },
  { name: 'forest-front-north', player: [0, 212, 0], position: [0, 27.8, 221.11565], target: [0, 33.2, 249.11565] },
  { name: 'forest-front-east', player: [122, 163, 0], position: [128.37105, 27.6, 169.75265], target: [144.47708, 34, 191.05060] },
  { name: 'rim-transition', player: [77, 198, 0], position: [81.19677, 33.1, 206.56137], target: [52, 33, 231] },
  { name: 'north-overview', player: [0, 196, 0], position: [-20, 43, 194], target: [73, 39, 234] },
  { name: 'forest-mineral-join', player: [65, 144, 0], position: [65, 42, 144], target: [83, 31, 220] },
];
const selectedViews = process.env.QUARRY_FOREST_VIEWS?.split(',');
const views = selectedViews ? allViews.filter(v => selectedViews.includes(v.name)) : allViews;
assert.ok(views.length && (!selectedViews || views.length === selectedViews.length), 'Unknown forest view');
const track = Array.from({ length: 481 }, (_, i) => {
  const a = i / 480 * Math.PI * 2;
  return { x: 108 * Math.sin(a) + 12 * Math.sin(a * 3), z: 88 * Math.cos(a) + 9 * Math.sin(a * 2) };
}).reverse();
const assetPaths = ['assets/sky.hdr', 'assets/arena-floor-mask.rgba.gz',
  'models/quarry-headwall.glb', 'models/quarry-road-approach.glb',
  'models/coupe.glb', 'models/sedan.glb', 'models/hatch.glb',
  ...JSON.parse(process.env.QUARRY_FOREST_EXTRA_ASSETS || '[]')];
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra',
  settleMs: 1400, sampleMs: 1500, views: [], moving: [], assets: [], modules: [], forestAssets: [],
  errors: [], failedRequests: [], notes: [
    'Fixed cameras and their player/shadow anchors are identical across phases.',
    'Moving samples follow real fixed-step vehicle motion on the reverse eastern approach; exact poses are recorded.',
    'Frame intervals are short diagnostic samples, not sustained GPU timings.',
    'Forest-front cameras inspect the mineral rim-to-woodland join from immediately beyond the retained crest.'
  ] };

await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false,
  'Preserve existing evidence; choose a fresh phase');
// Check the static server before opening Chrome, then check the actual browser
// module response again so a stale process/cache cannot masquerade as baseline.
const htmlResponse = await fetch(url); assert.equal(htmlResponse.status, 200);
const html = await htmlResponse.text();
const servedModule = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
assert.ok(servedModule, 'Served HTML must contain the application module');
const expected = phase.startsWith('baseline') ? './assets/index-HulQOYoj.js' : process.env.QUARRY_FOREST_EXPECTED_BUNDLE;
if (expected) assert.equal(servedModule, expected);
// A source/public file may exist before it is integrated into a build. Only
// require the new mask when the actually served application references it;
// its body must still be observed from the page's real loading request below.
if (!phase.startsWith('baseline')) {
  const moduleResponse = await fetch(new URL(servedModule, url)); assert.equal(moduleResponse.status, 200);
  const moduleSource = await moduleResponse.text();
  for (const asset of ['assets/north-forest-floor.rgba.gz'])
    if (moduleSource.includes(asset) && !assetPaths.includes(asset)) assetPaths.push(asset);
}
let browser;
try {
  const forestAssets = await forestRuntimeAssetPlan({ historical: phase.startsWith('baseline') });
  report.forestAssetsExpected = forestAssets;
  browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  const forestRequests = await observeForestRequests(page, url, forestAssets);
  await page.addInitScript(() => {
    window.__forestShaderResources = [];
    for (const Constructor of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
      if (!Constructor) continue;
      const prototype = Constructor.prototype, original = prototype.linkProgram;
      prototype.linkProgram = function (program) {
        const result = original.call(this, program);
        const shaders = this.getAttachedShaders(program) ?? [];
        if (!shaders.some(shader => this.getShaderSource(shader)?.includes('northFloorMask'))) return result;
        const samplerTypes = new Set([this.SAMPLER_2D, this.SAMPLER_CUBE, this.SAMPLER_3D,
          this.SAMPLER_2D_SHADOW, this.SAMPLER_2D_ARRAY, this.SAMPLER_2D_ARRAY_SHADOW,
          this.SAMPLER_CUBE_SHADOW, this.INT_SAMPLER_2D, this.INT_SAMPLER_3D,
          this.INT_SAMPLER_CUBE, this.INT_SAMPLER_2D_ARRAY, this.UNSIGNED_INT_SAMPLER_2D,
          this.UNSIGNED_INT_SAMPLER_3D, this.UNSIGNED_INT_SAMPLER_CUBE, this.UNSIGNED_INT_SAMPLER_2D_ARRAY]);
        const linked = this.getProgramParameter(program, this.LINK_STATUS), samplers = [];
        if (linked) for (let i = 0, count = this.getProgramParameter(program, this.ACTIVE_UNIFORMS); i < count; i++) {
          const uniform = this.getActiveUniform(program, i);
          if (uniform && samplerTypes.has(uniform.type)) samplers.push({ name: uniform.name, size: uniform.size, type: uniform.type });
        }
        window.__forestShaderResources.push({ linked, samplers,
          activeSamplerElements: samplers.reduce((sum, uniform) => sum + uniform.size, 0),
          maxFragmentTextureUnits: this.getParameter(this.MAX_TEXTURE_IMAGE_UNITS),
          maxCombinedTextureUnits: this.getParameter(this.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
          log: this.getProgramInfoLog(program) });
        return result;
      };
    }
  });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  const observations = new Map();
  const observe = asset => {
    const pending = page.waitForResponse(r => r.url() === new URL(asset, url).href, { timeout: 120000 });
    pending.catch(() => {}); observations.set(asset, pending);
  };
  assetPaths.forEach(observe); observe(servedModule);
  const graphics = html.match(/<link[^>]+rel="modulepreload"[^>]+href="([^"]*graphics[^"]+)"/)?.[1];
  if (graphics) observe(graphics);
  await page.goto(url);
  await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  await verifyForestRequests(forestRequests, report.forestAssets);
  report.bundle = await page.locator('script[type="module"]').getAttribute('src');
  assert.equal(report.bundle, servedModule);
  for (const [asset, pending] of observations) {
    const response = await pending; assert.equal(response.status(), 200);
    const bytes = await response.body(), local = await fs.readFile(path.join('dist', asset));
    const sha256 = hash(bytes); assert.equal(sha256, hash(local), `Actual requested ${asset} must match dist`);
    const record = { asset, bytes: bytes.length, sha256, observedApplicationRequest: true };
    if (asset.endsWith('.js')) report.modules.push(record); else report.assets.push(record);
    if (asset === report.bundle) report.bundleSha256 = sha256;
  }
  if (phase.startsWith('baseline')) assert.equal(report.bundleSha256,
    'e1bc78160d5d9483c94142e164522d7d225e010166ad5397751575b61a567961');
  report.daylight = await page.evaluate(() => __quarry.daylight);
  report.gpu = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async () => {
    await __quarry.start('playground'); __quarry.autopilot(false); __quarry.setQuality('ultra'); __quarry.mute();
  });
  // Use the existing real UI action to remove traffic and its changing shadow/
  // reflection state. No runtime fixture hook or production setting is added.
  await page.keyboard.press('KeyT');
  await page.waitForFunction(() => __quarry.cars.length === 1 && __quarry.state === 'playing');
  report.trafficDisabled = true;
  await page.evaluate(() => { document.querySelector('#ui').style.visibility = 'hidden'; });
  const sample = async () => {
    await page.waitForTimeout(report.settleMs); await page.evaluate(() => __quarry.benchmark());
    await page.waitForTimeout(report.sampleMs);
    const { frames } = await page.evaluate(() => __quarry.endBenchmark());
    const sorted = [...frames].sort((a, b) => a - b); assert.ok(sorted.length > 20);
    return { count: frames.length, meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
      p95Ms: sorted[Math.floor(sorted.length * .95)], p99Ms: sorted[Math.floor(sorted.length * .99)] };
  };
  for (const view of views) {
    await page.evaluate(({ view, neutral }) => {
      __quarry.resume(); __quarry.setInput(neutral); __quarry.teleport(0, ...view.player); __quarry.simulate(.25);
      __quarry.captureCamera(view.position, view.target); document.querySelector('#ui').style.visibility = 'hidden';
    }, { view, neutral });
    const frameTimes = await sample(); await page.screenshot({ path: path.join(output, `${view.name}.png`) });
    report.views.push({ ...view, frameTimes, ...await page.evaluate(() => ({
      stats: __quarry.stats, car: __quarry.inspect()[0], daylight: __quarry.daylight,
      northForest: __quarry.northForest ?? null, actualCamera: __quarry.cameraPose ?? null })) });
    console.log(`Captured ${phase}/${view.name}`);
  }
  if (!selectedViews) {
  await page.evaluate(({ track, neutral }) => {
    const start = track[415], next = track[416], yaw = Math.atan2(next.x - start.x, next.z - start.z);
    __quarry.resume(); __quarry.recover(); __quarry.setInput(neutral);
    __quarry.teleport(0, start.x, start.z, yaw); __quarry.simulate(.25);
    __quarry.velocity(0, Math.sin(yaw) * 13, 0, Math.cos(yaw) * 13);
  }, { track, neutral });
  for (const i of [0, 2]) {
    const pose = await page.evaluate(({ i, track }) => {
      const q = __quarry;
      if (i) {
        q.resume();
        for (let step = 0; step < 6; step++) {
          const car = q.inspect()[0], p = car.position; let nearest = 0, distance = Infinity;
          for (let j = 1; j < 480; j++) { const d = Math.hypot(track[j].x - p[0], track[j].z - p[2]); if (d < distance) { distance = d; nearest = j; } }
          const target = track[(nearest + 9) % 480], desired = Math.atan2(target.x - p[0], target.z - p[2]), heading = Math.atan2(car.forward[0], car.forward[2]);
          const error = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
          q.setInput({ throttle: .45, steer: Math.max(-.55, Math.min(.55, error * 1.8)), brake: 0, handbrake: false }); q.simulate(.25);
        }
      }
      const car = q.inspect()[0], p = car.position, f = car.forward, len = Math.hypot(f[0], f[2]), fx = f[0] / len, fz = f[2] / len;
      const distance = 7.4 + Math.abs(q.cars[0].speed) * .04;
      const position = [p[0] - fx * distance, p[1] + 2.65, p[2] - fz * distance];
      const target = [p[0] + fx * 4, p[1] + .5, p[2] + fz * 4];
      q.captureCamera(position, target); document.querySelector('#ui').style.visibility = 'hidden'; return { car, position, target };
    }, { i, track });
    const frameTimes = await sample(), name = `moving-chase-${String(i).padStart(2, '0')}`;
    await page.screenshot({ path: path.join(output, `${name}.png`) });
    report.moving.push({ name, time: i * .75, ...pose, frameTimes,
      ...await page.evaluate(() => ({ stats: __quarry.stats, northForest: __quarry.northForest ?? null,
        actualCamera: __quarry.cameraPose ?? null })) });
    console.log(`Captured ${phase}/${name}`);
  }
  const first = report.moving[0].car.position, last = report.moving.at(-1).car.position;
  report.movementMetres = Math.hypot(last[0] - first[0], last[2] - first[2]); assert.ok(report.movementMetres > 12);
  }
  if (process.env.QUARRY_FOREST_DIAGNOSTICS === '1') {
    const { tsImport } = await import('tsx/esm/api');
    const { backdropGroundHeight } = await tsImport('../src/scenery-backdrop.ts', import.meta.url);
    const placements = JSON.parse(await fs.readFile('src/quarry-north-forest.json'));
    const stand = placements.stands.find(value => value.id === 'stand-3');
    const trees = placements.trees.filter(tree => tree.stand === stand.id);
    const centreY = trees.reduce((sum, tree) => sum + tree.y, 0) / trees.length;
    const angle = Math.atan2(stand.x / 1.08, stand.z), nx = Math.sin(angle), nz = Math.cos(angle);
    const pose = horizontalDistance => {
      const x = stand.x + nx * horizontalDistance, z = stand.z + nz * horizontalDistance;
      const y = Math.max(backdropGroundHeight(x, z) + 2, centreY + 7);
      return { position: [x, y, z], target: [x - nx * 20, y - 2, z - nz * 20] };
    };
    const paired = pose(50); // Within both55m/.15 hysteresis states, including height.
    report.diagnostics = [];
    for (const [name, seedDistance, expectedLOD] of [['lod-far-same-view', 72, 1], ['lod-near-same-view', 35, 0]]) {
      const seed = pose(seedDistance);
      await page.evaluate(({ seed, paired, neutral }) => {
        __quarry.resume(); __quarry.recover(); __quarry.setInput(neutral);
        __quarry.teleport(0, paired.position[0], paired.position[2], 0); __quarry.simulate(.25);
        __quarry.captureCamera(seed.position, seed.target);
      }, { seed, paired, neutral });
      await page.waitForTimeout(500);
      await page.evaluate(p => __quarry.captureCamera(p.position, p.target), paired);
      const frameTimes = await sample(); await page.screenshot({ path: path.join(output, name + '.png') });
      const actual = await page.evaluate(() => ({ actualCamera: __quarry.cameraPose, northForest: __quarry.northForest, stats: __quarry.stats }));
      report.diagnostics.push({ name, intendedPose: paired, seedDistance, expectedLOD, frameTimes, ...actual });
      const cell = actual.northForest.find(cell => cell.id === 'north-forest-stand-3');
      assert.equal(cell?.lod, expectedLOD, 'Same-camera pair must exercise both actual hysteresis states');
      console.log(`Captured ${phase}/${name} at actual stand distance${cell.distance.toFixed(2)}m, LOD${cell.lod}`);
    }
    const eye = [0, backdropGroundHeight(0, 237) + 2, 237], target = [0, backdropGroundHeight(0, 241) + .1, 241];
    await page.evaluate(({ eye, target, neutral }) => {
      __quarry.resume(); __quarry.recover(); __quarry.setInput(neutral); __quarry.teleport(0, 0, 237, 0); __quarry.simulate(.25);
      __quarry.captureCamera(eye, target);
    }, { eye, target, neutral });
    const frameTimes = await sample(), name = 'floor-detail-2m';
    await page.screenshot({ path: path.join(output, name + '.png') });
    report.diagnostics.push({ name, intendedPose: { position: eye, target }, frameTimes,
      ...await page.evaluate(() => ({ actualCamera: __quarry.cameraPose, northForest: __quarry.northForest, stats: __quarry.stats })) });
    console.log(`Captured ${phase}/${name}`);
  }
  report.forestShaderResources = await page.evaluate(() => window.__forestShaderResources);
  if (assetPaths.includes('assets/north-forest-floor.rgba.gz')) {
    assert.ok(report.forestShaderResources.length, 'Observe the actual linked forest-floor program');
    for (const shader of report.forestShaderResources) {
      assert.equal(shader.linked, true, shader.log);
      assert.ok(shader.activeSamplerElements <= shader.maxFragmentTextureUnits,
        'Current forest-floor samplers are fragment-only and must fit the device limit');
    }
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) {
  report.passed = false; report.error = String(error); process.exitCode = 1;
} finally {
  if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, output,
    bundle: report.bundle, bundleSha256: report.bundleSha256, views: report.views.length,
    moving: report.moving.length, movementMetres: report.movementMetres,
    errors: report.errors, failedRequests: report.failedRequests, browserClosed: report.browserClosed }));
}
