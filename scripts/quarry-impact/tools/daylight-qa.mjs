// Repeatable daylight fixture. The published baseline is immutable; use a new
// QUARRY_DAYLIGHT_PHASE for each candidate. No geometry or materials are edited.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const phase = process.env.QUARRY_DAYLIGHT_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_DAYLIGHT_OUTPUT || 'outputs/daylight', phase);
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
const publishedLighting = { fog: .0016, sun: 3, sky: .5, ambient: .3, exposure: 1, tone: 'aces' };
// Prefer the actual read-only runtime state on newer builds. Old published
// builds predate that hook; their known values remain an explicit fallback.
let diagnosticDefaults = process.env.QUARRY_DAYLIGHT_DEFAULTS
  ? JSON.parse(process.env.QUARRY_DAYLIGHT_DEFAULTS) : publishedLighting;
const diagnostics = [
  { name: 'no-sun', override: { sun: 0 } },
  { name: 'no-fill', override: { sky: 0, ambient: 0 } },
  { name: 'no-fog', override: { fog: 0 } },
  { name: 'reduced-fill', override: {} },
];
const views = [
  { name: 'rear-chase', player: [0, -20, 0], position: [0, 3.7, -28], target: [0, .85, -16] },
  { name: 'hood-gravel', player: [-15, -11, 0], position: [-15, 1.05, -9], target: [0, .35, 15] },
  { name: 'headwall-close', player: [12, 90, 0], position: [9, 3, 99], target: [23, 17, 154] },
  { name: 'road-approach', player: [80, -60, 0], position: [58, 6, -48], target: [99, 4, -72] },
  { name: 'forest-crest', player: [68, 82, 0], position: [67, 6, 83], target: [94, 25, 156] },
  { name: 'white-car', player: [0, -20, 0], position: [-5, 1.75, -25], target: [0, .8, -20] },
];
const track = Array.from({ length: 481 }, (_, i) => {
  const a = i / 480 * Math.PI * 2;
  return { x: 108 * Math.sin(a) + 12 * Math.sin(a * 3), z: 88 * Math.cos(a) + 9 * Math.sin(a * 2) };
}).reverse();
const assetPaths = ['assets/sky.hdr', 'assets/arena-floor-mask.rgba.gz',
  'models/quarry-headwall.glb', 'models/quarry-road-approach.glb',
  'models/coupe.glb', 'models/sedan.glb', 'models/hatch.glb'];
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra',
  settleMs: 1400, sampleMs: 1500, views: [], moving: [], diagnostics: [], assets: [],
  errors: [], failedRequests: [], diagnosticDefaults,
  neutralReference: { supported: false, reason: 'Published __quarry exposes no scene/material reference hook; no runtime injection.' } };

// Local HDR analysis follows Three's actual equirectUv convention, HDRLoader
// flipY=true, and inverse background shader rotation. Bright-tail centroid is
// less sensitive to one hot pixel than peak alone. Values are source radiance,
// not a measured physical lux calibration or proof of a direct solar disk.
async function analyzeHDR(daylight) {
  const bytes = await fs.readFile('dist/assets/sky.hdr');
  const parsed = new HDRLoader().setDataType(T.FloatType).parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const { width, height, data } = parsed;
  const luma = new Float32Array(width * height);
  let peak = -Infinity, peakIndex = 0;
  for (let i = 0; i < luma.length; i++) {
    luma[i] = data[i * 4] * .2126 + data[i * 4 + 1] * .7152 + data[i * 4 + 2] * .0722;
    if (luma[i] > peak) { peak = luma[i]; peakIndex = i; }
  }
  const rotation = daylight?.backgroundRotation ?? [0, 1.9, 0, 'XYZ'];
  const rotationArray = Array.isArray(rotation) ? rotation : [rotation.x, rotation.y, rotation.z, rotation.order];
  const rotationY = rotationArray[1];
  // WebGLBackground negates all three Euler components before lookup. Invert
  // that exact lookup matrix rather than assuming the source used only yaw.
  const inverseLookup = new T.Matrix4().makeRotationFromEuler(new T.Euler(
    -rotationArray[0], -rotationArray[1], -rotationArray[2], rotationArray[3] || 'XYZ')).invert();
  const direction = i => {
    const u = ((i % width) + .5) / width, v = 1 - (Math.floor(i / width) + .5) / height;
    const latitude = (v - .5) * Math.PI, longitude = (u - .5) * Math.PI * 2;
    return new T.Vector3(Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), Math.cos(latitude) * Math.sin(longitude))
      .applyMatrix4(inverseLookup);
  };
  const centroid = new T.Vector3(); let brightPixels = 0, solidAngleWeight = 0;
  for (let i = 0; i < luma.length; i++) {
    if (luma[i] < peak * .1) continue;
    const latitude = (.5 - (Math.floor(i / width) + .5) / height) * Math.PI;
    const weight = luma[i] * Math.cos(latitude);
    centroid.addScaledVector(direction(i), weight); solidAngleWeight += weight; brightPixels++;
  }
  centroid.normalize();
  const sun = new T.Vector3().fromArray(daylight?.sunDirection ?? [-70, 65, 45]).normalize(), peakDirection = direction(peakIndex);
  const describe = v => ({ vector: v.toArray(), azimuthFromPositiveZDegrees: Math.atan2(v.x, v.z) * 180 / Math.PI,
    elevationDegrees: Math.asin(v.y) * 180 / Math.PI });
  return { bytes: bytes.length, sha256: hash(bytes), width, height, rotationY, rotation: rotationArray,
    runtimeDirectionAndRotation: !!daylight, peakLuminance: peak,
    peakPixel: [peakIndex % width, Math.floor(peakIndex / width)], brightTailThreshold: peak * .1,
    brightPixels, solidAngleWeight, peak: describe(peakDirection), brightTail: describe(centroid), sun: describe(sun),
    peakSunSeparationDegrees: peakDirection.angleTo(sun) * 180 / Math.PI,
    brightTailSunSeparationDegrees: centroid.angleTo(sun) * 180 / Math.PI,
    convention: 'HDR row0 is top; flipY=true; source directions transformed by inverse of Three shader backgroundRotation with negated Euler components' };
}

await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Preserve existing evidence; choose a fresh phase');
report.hdr = await analyzeHDR();
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  const assetResponses = assetPaths.map(asset => {
    const pending = page.waitForResponse(r => r.url() === new URL(asset, url).href, { timeout: 120000 });
    pending.catch(() => {}); return { asset, pending };
  });
  await page.goto(url);
  await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  report.daylight = await page.evaluate(() => __quarry.daylight ?? null);
  if (report.daylight) {
    report.hdr = await analyzeHDR(report.daylight);
    if (!process.env.QUARRY_DAYLIGHT_DEFAULTS) {
      for (const key of Object.keys(publishedLighting))
        if (report.daylight[key] !== undefined) diagnosticDefaults[key] = report.daylight[key];
    }
  }
  report.diagnosticDefaults = { ...diagnosticDefaults };
  report.diagnosticDefaultsSource = process.env.QUARRY_DAYLIGHT_DEFAULTS ? 'explicit environment override' : report.daylight ? 'actual __quarry.daylight' : 'known published D6PoesV_ fallback';
  report.bundle = await page.locator('script[type="module"]').getAttribute('src');
  const response = await page.request.get(new URL(report.bundle, url).href); assert.equal(response.status(), 200);
  const bundleBytes = await response.body(); report.bundleSha256 = hash(bundleBytes);
  if (phase === 'baseline') {
    assert.equal(report.bundle, './assets/index-D6PoesV_.js');
    assert.equal(report.bundleSha256, '31c66e95366792b0e8056f8a606d8042d3614efde59022ff35122c10b6b14f62');
  }
  if (process.env.QUARRY_DAYLIGHT_EXPECTED_BUNDLE) assert.equal(report.bundle, process.env.QUARRY_DAYLIGHT_EXPECTED_BUNDLE);
  const localBundle = await fs.readFile(path.join('dist', report.bundle));
  assert.equal(report.bundleSha256, hash(localBundle));
  for (const { asset, pending } of assetResponses) {
    const response = await pending; assert.equal(response.status(), 200);
    const bytes = await response.body(), local = await fs.readFile(path.join('dist', asset));
    assert.equal(hash(bytes), hash(local), `Actual requested ${asset} must match tested dist`);
    report.assets.push({ asset, bytes: bytes.length, sha256: hash(bytes), observedApplicationRequest: true });
  }
  report.gpu = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async () => {
    await __quarry.start('playground'); __quarry.autopilot(false); __quarry.setQuality('ultra'); __quarry.mute();
    document.querySelector('#ui').style.visibility = 'hidden';
  });
  const sample = async () => {
    await page.waitForTimeout(report.settleMs); await page.evaluate(() => __quarry.benchmark());
    await page.waitForTimeout(report.sampleMs);
    const { frames } = await page.evaluate(() => __quarry.endBenchmark());
    const sorted = [...frames].sort((a, b) => a - b); assert.ok(sorted.length > 20);
    return { count: frames.length, meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
      p95Ms: sorted[Math.floor(sorted.length * .95)], p99Ms: sorted[Math.floor(sorted.length * .99)] };
  };
  const capture = async (view, destination = report.views) => {
    await page.evaluate(({ view, neutral }) => {
      __quarry.resume(); __quarry.setInput(neutral); __quarry.teleport(0, ...view.player); __quarry.simulate(.25);
      __quarry.captureCamera(view.position, view.target); document.querySelector('#ui').style.visibility = 'hidden';
    }, { view, neutral });
    const frameTimes = await sample(); await page.screenshot({ path: path.join(output, view.name + '.png') });
    destination.push({ ...view, frameTimes, ...await page.evaluate(() => ({ stats: __quarry.stats, car: __quarry.inspect()[0], daylight: __quarry.daylight ?? null })) });
    console.log(`Captured ${phase}/${view.name}`);
  };
  for (const view of views) await capture(view);
  await page.evaluate(({ track, neutral }) => {
    const start = track[415], next = track[416], yaw = Math.atan2(next.x - start.x, next.z - start.z);
    __quarry.resume(); __quarry.setInput(neutral); __quarry.teleport(0, start.x, start.z, yaw); __quarry.simulate(.25);
    __quarry.velocity(0, Math.sin(yaw) * 13, 0, Math.cos(yaw) * 13);
  }, { track, neutral });
  for (let i = 0; i < 4; i++) {
    const pose = await page.evaluate(({ i, track }) => {
      const q = __quarry;
      if (i) {
        q.resume();
        for (let step = 0; step < 3; step++) {
          const car = q.inspect()[0], p = car.position; let nearest = 0, distance = Infinity;
          for (let j = 1; j < 480; j++) { const d = Math.hypot(track[j].x - p[0], track[j].z - p[2]); if (d < distance) { distance = d; nearest = j; } }
          const target = track[(nearest + 9) % 480], desired = Math.atan2(target.x - p[0], target.z - p[2]), heading = Math.atan2(car.forward[0], car.forward[2]);
          const error = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
          q.setInput({ throttle: .45, steer: Math.max(-.55, Math.min(.55, error * 1.8)), brake: 0, handbrake: false }); q.simulate(.25);
        }
      }
      const car = q.inspect()[0], p = car.position, f = car.forward, len = Math.hypot(f[0], f[2]), fx = f[0] / len, fz = f[2] / len;
      const distance = 7.4 + Math.abs(q.cars[0].speed) * .04;
      const position = [p[0] - fx * distance, p[1] + 2.65, p[2] - fz * distance], target = [p[0] + fx * 4, p[1] + .5, p[2] + fz * 4];
      q.captureCamera(position, target); document.querySelector('#ui').style.visibility = 'hidden'; return { car, position, target };
    }, { i, track });
    const frameTimes = await sample(), name = `moving-chase-${String(i).padStart(2, '0')}`;
    await page.screenshot({ path: path.join(output, name + '.png') }); report.moving.push({ name, time: i * .75, ...pose, frameTimes }); console.log(`Captured ${phase}/${name}`);
  }
  const first = report.moving[0].car.position, last = report.moving.at(-1).car.position;
  report.movementMetres = Math.hypot(last[0] - first[0], last[2] - first[2]); assert.ok(report.movementMetres > 12);
  for (const diagnostic of diagnostics) {
    const override = diagnostic.name === 'reduced-fill'
      ? { sky: diagnosticDefaults.sky * .4, ambient: diagnosticDefaults.ambient / 3 } : diagnostic.override;
    const lighting = { ...diagnosticDefaults, ...override };
    for (const view of [views[0], views[5]]) {
      await page.evaluate(v => __quarry.lighting(v), lighting);
      await capture({ ...view, name: `diagnostic-${diagnostic.name}-${view.name}`, lighting }, report.diagnostics);
    }
  }
  // Newer builds add cached distant shadows. Preserve the ordinary near car
  // shadow map and all light values, disabling only that additional coverage.
  if (report.daylight?.staticShadows) {
    const lighting = { ...diagnosticDefaults, staticShadows: false };
    await page.evaluate(v => __quarry.lighting(v), lighting);
    for (const view of [views[0], views[2], views[3]])
      await capture({ ...view, name: `diagnostic-no-static-${view.name}`, lighting }, report.diagnostics);
    await page.evaluate(v => __quarry.lighting(v), { ...diagnosticDefaults, staticShadows: report.daylight.staticShadows.enabled });
  }
  await page.evaluate(v => __quarry.lighting(v), diagnosticDefaults);
  assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) {
  report.passed = false; report.error = String(error); process.exitCode = 1;
} finally {
  if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, output, bundle: report.bundle,
    bundleSha256: report.bundleSha256, views: report.views.length, moving: report.moving.length,
    diagnostics: report.diagnostics.length, movementMetres: report.movementMetres,
    hdrPeakSunSeparationDegrees: report.hdr.peakSunSeparationDegrees,
    errors: report.errors, failedRequests: report.failedRequests, browserClosed: report.browserClosed }));
}
