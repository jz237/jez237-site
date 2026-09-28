import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Use a unique output name, a frozen dist, and no concurrent GPU QA/export.
// All presented timing is wall-clock frame spacing, not isolated GPU time.
const seconds = Number(process.env.QUARRY_PERFORMANCE_SECONDS ?? 610);
const quality = process.env.QUARRY_PERFORMANCE_QUALITY ?? 'ultra';
const output = process.env.QUARRY_PERFORMANCE_OUTPUT;
assert.ok(output, 'Set QUARRY_PERFORMANCE_OUTPUT to a new .json report path');
assert.match(output, /\.json$/);
assert.ok(seconds >= 30 && seconds <= 1200);
assert.ok(['ultra', 'high', 'medium'].includes(quality));
assert.equal(await fs.access(output).then(() => true, () => false), false, 'Keep earlier evidence');
const screenshot = output.replace(/\.json$/, '') + '.png';
const modes = ['derby', 'race', 'derby', 'race', 'derby'];
const report = {
  startedAt: new Date().toISOString(), seconds, quality, viewport: [2560, 1440],
  protocol: 'Five equal blocks alternating eight-car derby and scenic racing; restart completed events. Eight-second warm-up before capture. No camera or physics time acceleration.',
  events: [], samples: [], errors: [], output, screenshot,
};
let browser;
try {
  await fs.mkdir(path.dirname(output), { recursive: true });
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: [
    '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--ignore-gpu-blocklist',
  ] });
  const page = await browser.newPage({ viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('requestfailed', r => report.errors.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(process.env.QUARRY_QA_URL ?? 'http://127.0.0.1:8795/');
  await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  Object.assign(report, await page.evaluate(() => {
    const canvas = document.querySelector('canvas'), gl = canvas.getContext('webgl2');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { pageURL: location.href, buildURL: document.querySelector('script[type="module"]').src,
      gpu: gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER), contextAttributes: gl.getContextAttributes() };
  }));
  const buildResponse = await page.request.get(report.buildURL);
  report.buildSha256 = createHash('sha256').update(await buildResponse.body()).digest('hex');
  const sceneryURL = new URL('models/quarry-extension.glb', report.pageURL).href;
  const sceneryResponse = await page.request.get(sceneryURL);
  assert.equal(sceneryResponse.status(), 200, 'The final authored wall must be served');
  const sceneryBytes = await sceneryResponse.body();
  report.sceneryAsset = { url: sceneryURL, bytes: sceneryBytes.length,
    sha256: createHash('sha256').update(sceneryBytes).digest('hex') };
  const roadURL = new URL('models/quarry-road-approach.glb', report.pageURL).href;
  const roadResponse = await page.request.get(roadURL);
  assert.equal(roadResponse.status(), 200, 'The authored road must be served');
  const roadBytes = await roadResponse.body();
  report.roadAsset = { url: roadURL, bytes: roadBytes.length,
    sha256: createHash('sha256').update(roadBytes).digest('hex') };
  const coupeURL = new URL('models/coupe.glb', report.pageURL).href;
  const headwallURL = new URL('models/quarry-headwall.glb', report.pageURL).href;
  const headwallResponse = await page.request.get(headwallURL);
  assert.equal(headwallResponse.status(), 200, 'The arena headwall must be served');
  const headwallBytes = await headwallResponse.body();
  report.headwallAsset = { url: headwallURL, bytes: headwallBytes.length,
    sha256: createHash('sha256').update(headwallBytes).digest('hex') };
  const coupeResponse = await page.request.get(coupeURL);
  assert.equal(coupeResponse.status(), 200, 'The final coupe must be served');
  const coupeBytes = await coupeResponse.body();
  report.coupeAsset = { url: coupeURL, bytes: coupeBytes.length,
    sha256: createHash('sha256').update(coupeBytes).digest('hex') };
  await page.evaluate(async quality => {
    await __quarry.start('derby'); __quarry.autopilot(true); __quarry.setQuality(quality); __quarry.mute();
  }, quality);
  await page.waitForTimeout(8000);
  await page.evaluate(() => __quarry.benchmark());
  const start = performance.now();
  report.events.push({ time: 0, mode: 'derby', reason: 'initial warmed event' });
  let block = 0, nextSample = 0, nextLog = 60;
  while ((performance.now() - start) / 1000 < seconds) {
    await page.waitForTimeout(2000);
    const time = (performance.now() - start) / 1000;
    const snapshot = await page.evaluate(() => {
      const { benchmarkSamples, ...stats } = __quarry.stats;
      return { stats, mode: __quarry.mode, cars: __quarry.cars, heap: performance.memory?.usedJSHeapSize };
    });
    if (time >= nextSample) { report.samples.push({ time, ...snapshot }); nextSample += 5; }
    const nextBlock = Math.min(4, Math.floor(time / (seconds / modes.length)));
    if (nextBlock !== block || snapshot.stats.state === 'result') {
      report.events.push({ time, mode: modes[nextBlock], reason: nextBlock !== block ? 'scheduled block' : 'completed event', previous: snapshot });
      block = nextBlock;
      await page.evaluate(async mode => { await __quarry.start(mode); __quarry.autopilot(true); }, modes[block]);
    }
    if (time >= nextLog) {
      console.log(JSON.stringify({ elapsed: Math.round(time), mode: snapshot.mode, state: snapshot.stats.state, meanMs: snapshot.stats.meanMs, geometry: snapshot.stats.geometry, textures: snapshot.stats.textures }));
      nextLog += 60;
    }
  }
  report.actualSeconds = (performance.now() - start) / 1000;
  const result = await page.evaluate(() => ({ ...__quarry.endBenchmark(), final: __quarry.stats, cars: __quarry.cars }));
  report.engineSamples = result.samples;
  report.frames = result.frames;
  report.final = result.final;
  report.finalCars = result.cars;
  const frames = report.frames, sorted = [...frames].sort((a, b) => a - b);
  const meanMs = frames.reduce((a, b) => a + b, 0) / frames.length;
  report.timing = { frames: frames.length, meanMs, fps: 1000 / meanMs,
    p50: sorted[Math.floor(sorted.length * .5)], p95: sorted[Math.floor(sorted.length * .95)],
    p99: sorted[Math.floor(sorted.length * .99)], over33ms: frames.filter(t => t > 33.34).length };
  report.memory = Object.fromEntries(['geometry', 'textures', 'heap'].map(key => {
    const values = report.samples.map(s => key === 'heap' ? s.heap : s.stats[key]).filter(Number.isFinite);
    return [key, { min: Math.min(...values), max: Math.max(...values), first: values[0], last: values.at(-1) }];
  }));
  const raceSamples = report.samples.filter(s => s.mode === 'race');
  report.roadsideVisits = raceSamples.filter(s => {
    const [x, , z] = s.cars[0].position, a = (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
    return a >= 105 && a <= 155;
  }).length;
  report.extensionVisits = raceSamples.filter(s => {
    const [x, , z] = s.cars[0].position, a = (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
    return a >= 139 && a <= 172;
  }).length;
  const roadCentres = Array.from({ length: 360 }, (_, i) => {
    const a = i / 360 * Math.PI * 2;
    return [108 * Math.sin(a) + 12 * Math.sin(a * 3), 88 * Math.cos(a) + 9 * Math.sin(a * 2)];
  });
  report.headwallVisits = raceSamples.filter(s => {
    const [x, , z] = s.cars[0].position, a = (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
    return a >= 350 || a <= 25;
  }).length;
  report.roadApproachVisits = raceSamples.filter(s => {
    const [x, , z] = s.cars[0].position;
    let cell = 0, distance = Infinity;
    for (const [i, p] of roadCentres.entries()) {
      const d = Math.hypot(x - p[0], z - p[1]);
      if (d < distance) { cell = i; distance = d; }
    }
    return cell >= 123 && cell < 182 && distance < 12;
  }).length;
  await page.screenshot({ path: screenshot });
  assert.ok(frames.length > seconds * 10, 'Capture must contain continuous rendered frames');
  assert.ok(frames.length < 50000, 'Frame capture must not reach the runtime sample cap');
  assert.ok(report.samples.every(s => s.cars.length === 8), 'All sampled events must have eight cars');
  assert.ok(raceSamples.length > 0 && report.roadsideVisits > 0, 'Racing must visit the authored approach');
  assert.ok(report.extensionVisits > 0, 'Racing must visit the extended wall');
  assert.ok(report.headwallVisits > 0, 'Racing must visit the arena headwall');
  assert.ok(report.roadApproachVisits > 0, 'Racing must drive on the new gravel approach');
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.failure = String(error); process.exitCode = 1;
} finally {
  await browser?.close();
  report.browserClosed = true;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ output, passed: report.passed, buildURL: report.buildURL, timing: report.timing, memory: report.memory, roadsideVisits: report.roadsideVisits, roadApproachVisits: report.roadApproachVisits, failure: report.failure }));
}
