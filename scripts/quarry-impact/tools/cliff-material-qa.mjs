// Fresh matched cliff-material evidence. No runtime, geometry, lighting or
// physics edits. Driving views use the application's normal chase/hood camera;
// inspection views retain exact camera/player anchors and a20m orbit target.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';
import { circuitRuntimeAssetPlan } from './circuit-runtime-assets.mjs';

const phase = process.env.QUARRY_CLIFF_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const expected = phase === 'baseline' ? './assets/index-NMtzVGSo.js' : process.env.QUARRY_CLIFF_EXPECTED_BUNDLE;
assert.ok(expected, 'Candidate needs an exact expected application module');
const output = path.resolve(process.env.QUARRY_CLIFF_OUTPUT || 'outputs/cliff-material', phase);
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
const trackPoint = degrees => { const a = degrees * Math.PI / 180; return { x: 108 * Math.sin(a) + 12 * Math.sin(3 * a), z: 88 * Math.cos(a) + 9 * Math.sin(2 * a) }; };
const driving = (name, sector, degrees, hood = false) => {
  const p = trackPoint(degrees), next = trackPoint(degrees - .2);
  return { name, sector, kind: hood ? 'normal-hood' : 'normal-chase', hood, player: [p.x, p.z, Math.atan2(next.x - p.x, next.z - p.z)] };
};
const inspection = (name, sector, position, aim) => {
  const delta = aim.map((v, i) => v - position[i]), length = Math.hypot(...delta);
  return { name, sector, kind: 'fixed-inspection', position, aim,
    target: position.map((v, i) => v + delta[i] / length * 20),
    player: [position[0], position[2], Math.atan2(delta[0], delta[2])] };
};
const views = [
  { name: 'arena-normal-chase', sector: 'north-headwall', kind: 'normal-chase', hood: false, player: [0, -20, 0] },
  driving('east-road-chase', 'east-bay', 55), driving('east-road-hood', 'east-bay', 55, true),
  driving('legacy-road-chase', 'legacy-west', -60), driving('legacy-road-hood', 'legacy-west', -60, true),
  inspection('headwall-medium', 'north-headwall', [9, 3, 99], [23, 17, 154]),
  inspection('headwall-close', 'north-headwall', [13, 3, 120], [23, 13, 151]),
  inspection('east-bay-medium', 'east-bay', [81, 3, 84], [113, 16, 122]),
  inspection('east-bay-close', 'east-bay', [88, 2.15, 98], [103, 10, 112]),
  inspection('legacy-medium', 'legacy-west', [-75, 3, 51], [-135, 18, 96]),
  inspection('legacy-close', 'legacy-west', [-110, 3, 68], [-143, 17, 88]),
];
const selected = process.env.QUARRY_CLIFF_VIEWS?.split(',');
const captures = selected ? views.filter(view => selected.includes(view.name)) : views;
assert.ok(captures.length && (!selected || captures.length === selected.length), 'Unknown requested view');
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra',
  protocol: 'Five ordinary physically settled chase/hood views and six matched close/medium inspections of original western wall, authored north headwall and EastBay. Player/shadow/reflection anchor is near each inspection camera. No global light, exposure or material override. This is visual QA, not a benchmark.',
  acceptance: ['Visible improvement from normal driving distance, not only close microdetail.', 'Believable quarry rock scale and fracture direction, without pale washed blankets or regularly tiled streaks.', 'Retain coherent mineral colour and relief across authored/legacy joins, benches, toe and rubble.', 'No texture stretching, swimming, sampler failure or detached-looking stones introduced.', 'Preserve accepted cars, road/ground, forest, lighting and physical geometry unless independently authorized.'],
  views: [], assets: [], errors: [], failedRequests: [] };
await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Preserve earlier evidence');
const response = await fetch(url); assert.equal(response.status, 200); const html = await response.text();
assert.equal(html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1], expected);
const extras = ['assets/sky.hdr', 'assets/arena-floor-mask.rgba.gz',
  ...['rock', 'gravel'].flatMap(name => ['diff', 'nor_gl', 'rough'].map(channel => `assets/${name}_${channel}.jpg`)),
  ...['coupe', 'sedan', 'hatch', 'quarry-cut', 'quarry-extension', 'quarry-headwall', 'quarry-east-bay', 'quarry-road-approach', 'quarry-roadside', 'rocks-lod'].map(name => `models/${name}.glb`),
  expected.replace(/^\.\//, ''), ...[...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\.\/([^"]+)"/g)].map(match => match[1]),
  ...(phase === 'baseline' ? [] : ['diff', 'nor_gl', 'rough'].map(channel => `assets/geology_rock_${channel}.jpg`)),
  ...JSON.parse(process.env.QUARRY_CLIFF_EXTRA_ASSETS || '[]')];
const retired = JSON.parse(process.env.QUARRY_CLIFF_RETIRED_ASSETS || '[]');
assert.ok(phase !== 'baseline' || retired.length === 0, 'Baseline requires all historical cliff maps');
const plan = [...await forestRuntimeAssetPlan({ publicAssets: true }), ...await circuitRuntimeAssetPlan()];
for (const file of extras) if (!retired.includes(file) && !plan.some(asset => asset.file === file)) {
  assert.match(file, /^(assets|models)\//); assert.equal(path.posix.normalize(file), file);
  const bytes = await fs.readFile(path.join('dist', file)); plan.push({ file, bytes: bytes.length, sha256: hash(bytes) });
  if (file.startsWith('assets/geology_rock_')) {
    const source = await fs.readFile(path.join('public', file));
    assert.equal(hash(bytes), hash(source), `Frozen ${file} must match the current authored photograph`);
  }
}
report.retiredExpectedAssets = retired;
report.geologyProgramsExpected = phase !== 'baseline';
let browser, page;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    // Test-only instrumentation: identify the actually linked geology shaders,
    // enumerate active uniforms and count their real draw submissions. No scene
    // or product hook is added. Timings from this fixture are not benchmarks.
    window.__cliffShaderPrograms = []; window.__cliffShaderFailures = [];
    const prototype = WebGL2RenderingContext.prototype;
    const originalLink = prototype.linkProgram, originalUse = prototype.useProgram;
    const programs = new WeakMap(), current = new WeakMap();
    prototype.linkProgram = function (program) {
      originalLink.call(this, program);
      const shaders = (this.getAttachedShaders(program) || []).map(shader => ({
        type: this.getShaderParameter(shader, this.SHADER_TYPE), source: this.getShaderSource(shader) || '', log: this.getShaderInfoLog(shader),
      }));
      if (!shaders.some(shader => shader.source.includes('vec4 geologyPhoto'))) return;
      const samplerTypes = new Set([this.SAMPLER_2D, this.SAMPLER_CUBE, this.SAMPLER_3D, this.SAMPLER_2D_SHADOW, this.SAMPLER_2D_ARRAY, this.SAMPLER_2D_ARRAY_SHADOW, this.SAMPLER_CUBE_SHADOW, this.INT_SAMPLER_2D, this.INT_SAMPLER_3D, this.INT_SAMPLER_CUBE, this.INT_SAMPLER_2D_ARRAY, this.UNSIGNED_INT_SAMPLER_2D, this.UNSIGNED_INT_SAMPLER_3D, this.UNSIGNED_INT_SAMPLER_CUBE, this.UNSIGNED_INT_SAMPLER_2D_ARRAY]);
      const samplers = [];
      for (let i = 0; i < this.getProgramParameter(program, this.ACTIVE_UNIFORMS); i++) {
        const uniform = this.getActiveUniform(program, i);
        if (uniform && samplerTypes.has(uniform.type)) samplers.push({ name: uniform.name, type: uniform.type, size: uniform.size });
      }
      const source = shaders.map(shader => shader.source).join('\n');
      const record = { id: window.__cliffShaderPrograms.length, linked: !!this.getProgramParameter(program, this.LINK_STATUS),
        name: source.match(/#define SHADER_NAME\s+([^\n]+)/)?.[1], samplers,
        activeSamplerElements: samplers.reduce((sum, uniform) => sum + uniform.size, 0), maxFragmentTextureUnits: this.getParameter(this.MAX_TEXTURE_IMAGE_UNITS),
        declarationLines: source.split('\n').filter(line => /uniform\s+sampler|#define NUM_.*SHADOW/.test(line)),
        draws: 0, submittedElements: 0, submittedInstances: 0 };
      window.__cliffShaderPrograms.push(record); programs.set(program, record);
      if (!record.linked) window.__cliffShaderFailures.push({ ...record, log: this.getProgramInfoLog(program), shaders });
    };
    prototype.useProgram = function (program) { originalUse.call(this, program); current.set(this, program); };
    for (const method of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
      const original = prototype[method];
      prototype[method] = function (...args) {
        const record = programs.get(current.get(this));
        if (record) {
          const instances = method.endsWith('Instanced') ? args.at(-1) : 1;
          const count = method.startsWith('drawArrays') ? args[2] : args[1];
          record.draws++; record.submittedElements += count * instances; record.submittedInstances += instances;
        }
        return original.apply(this, args);
      };
    }
  });
  const observed = await observeForestRequests(page, url, plan);
  page.on('pageerror', error => { report.errors.push(error.message); console.error(error.message); });
  page.on('console', message => { if (message.type() === 'error') { report.errors.push(message.text()); console.error(message.text().slice(0, 500)); } });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(url); await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 180000 });
  await verifyForestRequests(observed, report.assets);
  assert.deepEqual(report.errors, [], 'Boot and initial shaders must pass');
  report.bundle = await page.locator('script[type="module"]').getAttribute('src'); assert.equal(report.bundle, expected);
  report.bundleSha256 = report.assets.find(asset => asset.file === expected.replace(/^\.\//, '')).sha256;
  if (phase === 'baseline') assert.equal(report.bundleSha256, '841e09c8658ed520948330123b331de9000cf6c1f1f294af748df7f4621f20f0');
  report.daylight = await page.evaluate(() => __quarry.daylight);
  report.gpu = await page.evaluate(() => { const gl = document.querySelector('canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info'); return gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER); });
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async () => { await __quarry.start('playground'); __quarry.setQuality('ultra'); __quarry.autopilot(false); __quarry.mute(); });
  await page.keyboard.press('KeyT'); await page.waitForFunction(() => __quarry.cars.length === 1 && __quarry.state === 'playing');
  report.trafficDisabled = true; let hood = false;
  for (const view of captures) {
    await page.evaluate(({ view, neutral }) => { const q = __quarry; q.resume(); q.setInput(neutral); q.teleport(0, ...view.player); q.simulate(.25); document.querySelector('#ui').style.visibility = 'hidden'; }, { view, neutral });
    if (hood !== !!view.hood) { await page.keyboard.press('KeyC'); hood = !!view.hood; }
    await page.waitForTimeout(1800);
    if (view.kind === 'fixed-inspection') {
      await page.evaluate(view => __quarry.captureCamera(view.position, view.target), view);
    } else await page.evaluate(() => __quarry.pause());
    await page.evaluate(() => { document.querySelector('#ui').style.visibility = 'hidden'; });
    await page.waitForTimeout(500);
    assert.deepEqual(report.errors, [], 'Visible material must compile without errors');
    await page.screenshot({ path: path.join(output, view.name + '.png') });
    report.views.push({ ...view, ...await page.evaluate(() => ({ actualCamera: __quarry.cameraPose, player: __quarry.inspect()[0], stats: __quarry.stats,
      geologyDraws: window.__cliffShaderPrograms.map(program => ({ id: program.id, draws: program.draws })) })) });
    console.log(`Captured ${phase}/${view.name}`);
  }
  report.geologyShaderPrograms = await page.evaluate(() => window.__cliffShaderPrograms);
  if (report.geologyProgramsExpected) {
    assert.ok(report.geologyShaderPrograms.length > 0, 'The candidate must compile its actual geology material');
    assert.ok(report.geologyShaderPrograms.some(program => program.draws > 0), 'The candidate geology material must actually be drawn');
    for (const program of report.geologyShaderPrograms) {
      assert.ok(program.linked, 'Every observed geology shader must link');
      assert.ok(program.activeSamplerElements <= program.maxFragmentTextureUnits, 'Observed geology samplers must fit the actual fragment limit');
    }
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) { report.passed = false; report.error = error.stack ?? String(error); process.exitCode = 1; }
finally {
  if (page && !page.isClosed()) {
    report.geologyShaderPrograms = await page.evaluate(() => window.__cliffShaderPrograms || []).catch(() => []);
    const failures = await page.evaluate(() => window.__cliffShaderFailures || []).catch(() => []);
    report.geologyShaderLinkFailures = failures.length;
    if (failures.length) {
      await fs.writeFile(path.join(output, 'shader-link-failures.json'), JSON.stringify(failures, null, 2) + '\n');
      report.shaderLinkFailureDetails = 'shader-link-failures.json';
    }
  }
  if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, bundle: report.bundle, sha256: report.bundleSha256, views: report.views.length, assets: report.assets.length, errors: report.errors, browserClosed: report.browserClosed, output }));
}
