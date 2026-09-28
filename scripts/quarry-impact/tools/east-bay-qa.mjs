// Immutable matched evidence for the25–55degree extraction bay. No runtime hooks
// or geometry change. Fixed views use the actual camera pose; moving samples are
// a physically simulated50m approach on the retained road with normal chase offsets.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';

const phase = process.env.QUARRY_EAST_BAY_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_EAST_BAY_OUTPUT || 'outputs/east-bay', phase);
const expected = phase === 'baseline' ? './assets/index-DPLZ7ukd.js' : process.env.QUARRY_EAST_BAY_EXPECTED_BUNDLE;
assert.ok(expected, 'Candidate needs an exact expected application module');
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
const view = (name, position, aim) => {
  const direction = aim.map((v, i) => v - position[i]), length = Math.hypot(...direction);
  const target = position.map((v, i) => v + direction[i] / length * 20);
  return { name, player: [position[0], position[2], Math.atan2(direction[0], direction[2])], position, target, aim };
};
const views = [
  { name: 'rear-chase', player: [0, -20, 0], position: [0, 3.7, -28], target: [0, .85, -16] },
  view('east-bay-front40', [81, 3, 84], [113, 16, 122]),
  view('east-bay-join25', [62, 3.6, 115], [112, 17, 118]),
  view('east-bay-join55', [114, 2.8, 66], [102, 13, 123]),
  view('east-bay-toe40', [88, 2.15, 98], [103, 10, 112]),
];
const track = Array.from({ length: 481 }, (_, i) => {
  const a = i / 480 * Math.PI * 2;
  return { x: 108 * Math.sin(a) + 12 * Math.sin(a * 3), z: 88 * Math.cos(a) + 9 * Math.sin(a * 2) };
}).reverse();
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra',
  protocol: 'Five fixed views; five physically advanced normal chase poses at0/12.5/25/37.5/50m along the retained road. Paused rendering between deterministic fixed-step samples. Short frame intervals are diagnostics, not a sustained benchmark.',
  views: [], moving: [], assets: [], errors: [], failedRequests: [], settleMs: 1400, sampleMs: 1500 };
await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Preserve earlier evidence');
const htmlResponse = await fetch(url); assert.equal(htmlResponse.status, 200);
const html = await htmlResponse.text(), servedModule = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
assert.equal(servedModule, expected);
const extras = ['assets/sky.hdr', 'assets/arena-floor-mask.rgba.gz', ...[
  'coupe', 'sedan', 'hatch', 'quarry-cut', 'quarry-extension', 'quarry-headwall',
  'quarry-road-approach', 'quarry-roadside', 'rocks-lod',
].map(file => 'models/' + file + '.glb'), expected.replace(/^\.\//, ''),
  ...[...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\.\/([^"]+)"/g)].map(match => match[1]),
  ...JSON.parse(process.env.QUARRY_EAST_BAY_EXTRA_ASSETS || '[]')];
const plan = await forestRuntimeAssetPlan({ publicAssets: true });
for (const file of extras) if (!plan.some(asset => asset.file === file)) {
  const bytes = await fs.readFile(path.join('dist', file));
  plan.push({ file, bytes: bytes.length, sha256: hash(bytes) });
}
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  const observed = await observeForestRequests(page, url, plan);
  page.on('pageerror', error => { report.errors.push(error.message); console.error(error.message); });
  page.on('console', message => { if (message.type() === 'error') { report.errors.push(message.text()); console.error(message.text().slice(0, 500)); } });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(url); await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  await verifyForestRequests(observed, report.assets);
  report.bundle = await page.locator('script[type="module"]').getAttribute('src'); assert.equal(report.bundle, expected);
  report.bundleSha256 = report.assets.find(asset => asset.file === expected.replace(/^\.\//, '')).sha256;
  if (phase === 'baseline') assert.equal(report.bundleSha256, '95756bc1e047bf12c6e249e19c4167f00388ecfd97e655071b02b74f12013314');
  report.daylight = await page.evaluate(() => __quarry.daylight);
  report.gpu = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info');
    return gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER);
  });
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async () => { await __quarry.start('playground'); __quarry.setQuality('ultra'); __quarry.autopilot(false); __quarry.mute(); });
  await page.keyboard.press('KeyT'); await page.waitForFunction(() => __quarry.cars.length === 1 && __quarry.state === 'playing');
  report.trafficDisabled = true;
  const capture = async (name, record, bucket) => {
    await page.waitForTimeout(report.settleMs); await page.evaluate(() => __quarry.benchmark());
    await page.waitForTimeout(report.sampleMs);
    const { frames } = await page.evaluate(() => __quarry.endBenchmark()), sorted = [...frames].sort((a, b) => a - b);
    assert.ok(frames.length > 20);
    await page.screenshot({ path: path.join(output, name + '.png') });
    bucket.push({ name, ...record, frameTimes: { count: frames.length, meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
      p95Ms: sorted[Math.floor(sorted.length * .95)], p99Ms: sorted[Math.floor(sorted.length * .99)] },
      ...await page.evaluate(() => ({ actualCamera: __quarry.cameraPose, car: __quarry.inspect()[0], stats: __quarry.stats })) });
    console.log(`Captured ${phase}/${name}`);
  };
  for (const pose of views) {
    await page.evaluate(({ pose, neutral }) => {
      const q = __quarry; q.resume(); q.setInput(neutral); q.teleport(0, ...pose.player); q.simulate(.25);
      q.captureCamera(pose.position, pose.target); document.querySelector('#ui').style.visibility = 'hidden';
    }, { pose, neutral });
    await capture(pose.name, pose, report.views);
  }
  await page.evaluate(({ track, neutral }) => {
    // Reversed sample380 is the untouched road at75degrees; driving northward
    // places the25–55degree wall ahead/left in the ordinary chase camera.
    const start = track[380], next = track[381], yaw = Math.atan2(next.x - start.x, next.z - start.z);
    const q = __quarry; q.resume(); q.recover(); q.setInput(neutral); q.teleport(0, start.x, start.z, yaw); q.simulate(.25);
    q.velocity(0, Math.sin(yaw) * 13, 0, Math.cos(yaw) * 13);
    window.__eastBayMotion = { travelled: 0, elapsed: 0, last: q.inspect()[0].position };
    q.captureCamera([start.x, 4, start.z - 8], [start.x, 1, start.z + 4]);
  }, { track, neutral });
  for (const [i, distance] of [0, 12.5, 25, 37.5, 50].entries()) {
    const pose = await page.evaluate(({ track, distance }) => {
      const q = __quarry, motion = window.__eastBayMotion; q.resume();
      let iterations = 0;
      while (motion.travelled < distance && iterations++ < 240) {
        const car = q.inspect()[0], p = car.position; let nearest = 0, closest = Infinity;
        for (let j = 1; j < 480; j++) { const d = Math.hypot(track[j].x - p[0], track[j].z - p[2]); if (d < closest) { closest = d; nearest = j; } }
        const target = track[(nearest + 9) % 480], desired = Math.atan2(target.x - p[0], target.z - p[2]), heading = Math.atan2(car.forward[0], car.forward[2]);
        const error = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
        q.setInput({ throttle: .4, steer: Math.max(-.55, Math.min(.55, error * 1.8)), brake: 0, handbrake: false }); q.simulate(.05);
        const after = q.inspect()[0].position;
        motion.travelled += Math.hypot(after[0] - motion.last[0], after[2] - motion.last[2]); motion.last = after; motion.elapsed += .05;
      }
      const car = q.inspect()[0], p = car.position, f = car.forward, scale = Math.hypot(f[0], f[2]), fx = f[0] / scale, fz = f[2] / scale;
      const offset = 7.4 + Math.abs(q.cars[0].speed) * .04;
      const position = [p[0] - fx * offset, p[1] + 2.65, p[2] - fz * offset], target = [p[0] + fx * 4, p[1] + .5, p[2] + fz * 4];
      q.captureCamera(position, target); document.querySelector('#ui').style.visibility = 'hidden';
      return { requestedDistance: distance, travelled: motion.travelled, simulationSeconds: motion.elapsed, position, target, speed: q.cars[0].speed };
    }, { track, distance });
    assert.ok(pose.travelled >= distance && pose.travelled < distance + 2, 'Reach each sample with actual physics, no path teleport');
    await capture(`moving-chase-${String(i).padStart(2, '0')}`, pose, report.moving);
  }
  report.movementMetres = report.moving.at(-1).travelled;
  assert.ok(report.movementMetres >= 50); assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) { report.passed = false; report.error = error.stack ?? String(error); process.exitCode = 1; }
finally {
  if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, bundle: report.bundle,
    sha256: report.bundleSha256, views: report.views.length, moving: report.moving.length, movementMetres: report.movementMetres,
    errors: report.errors, browserClosed: report.browserClosed, output }));
}
