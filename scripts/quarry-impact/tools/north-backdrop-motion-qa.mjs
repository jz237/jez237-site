// Continuous camera inspection of the atlas angular boundary and geometry fade.
// The player/reflection anchor follows camera XZ; this is not a driving benchmark.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import { tsImport } from 'tsx/esm/api';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';

const phase = process.env.QUARRY_BACKDROP_PHASE, expected = process.env.QUARRY_BACKDROP_EXPECTED_BUNDLE;
assert.ok(phase && expected, 'Set a unique phase and exact application module');
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_BACKDROP_OUTPUT || 'outputs/north-backdrop', phase);
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false);
await fs.mkdir(path.join(output, 'frames'), { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const source = await fs.readFile('src/quarry-north-backdrop.json');
const tree = JSON.parse(source).trees.find(t => t.id === 'north-backdrop-60');
const center = [tree.x, tree.y + tree.height * .5, tree.z];
const { backdropGroundHeight } = await tsImport('../src/scenery-backdrop.ts', import.meta.url);
const { quarryColliderLayout } = await tsImport('../src/quarry-layout.ts', import.meta.url);
const trunks = quarryColliderLayout().filter(c => c.id.startsWith('tree-') && c.shape === 'cylinder');
const durationMs = 24000;
const route = Array.from({ length: 601 }, (_, i) => {
  const blend = (1 - Math.cos(i / 600 * Math.PI * 2)) * .5;
  const distance = 65 + 25 * blend, azimuth = 42 + 6 * blend;
  const angle = tree.yaw + azimuth * Math.PI / 180, dx = Math.sin(angle), dz = Math.cos(angle);
  const eye = r => { const x = tree.x + dx * r, z = tree.z + dz * r; return [x, backdropGroundHeight(x, z) + 2, z]; };
  let lo = 0, hi = distance;
  for (let j = 0; j < 45; j++) { const mid = (lo + hi) * .5, p = eye(mid);
    if (Math.hypot(...p.map((v, k) => v - center[k])) < distance) lo = mid; else hi = mid; }
  const position = eye((lo + hi) * .5);
  const clearance = Math.min(...trunks.map(c => Math.hypot(position[0] - c.p.x, position[2] - c.p.z) - c.radius));
  assert.ok(clearance > 4.2 && Math.abs(position[0]) < 310 && Math.abs(position[2]) < 310, 'Safe anchor throughout sweep');
  return { position, target: [position[0] - dx * 20, position[1] - 2, position[2] - dz * 20],
    yaw: angle + Math.PI, distance, azimuth, clearance };
});
const report = { phase, expected, url, viewport: { width: 2560, height: 1440 },
  protocol: '24-second continuous out-and-back ground-height camera sweep;65–90m tree-centre distance and42–48degree local azimuth. Player/reflection anchor colocated each frame. JPEG screencast is diagnostic, not a performance measurement.',
  placementSha256: hash(source), tree, center, durationMs, minTrunkClearance: Math.min(...route.map(p => p.clearance)),
  forestAssets: [], errors: [], failedRequests: [], frames: [] };
let browser, cdp;
const writes = [];
try {
  const plan = await forestRuntimeAssetPlan({ publicAssets: true });
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  page.on('pageerror', e => { report.errors.push(e.message); console.error(e.message); });
  page.on('console', m => { if (m.type() === 'error') { report.errors.push(m.text()); console.error(m.text().slice(0, 500)); } });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  const observed = await observeForestRequests(page, url, plan);
  const modulePromise = page.waitForResponse(r => r.url() === new URL(expected, url).href).then(async r => {
    assert.equal(r.status(), 200); return Buffer.from(await r.body()); }); modulePromise.catch(() => {});
  await page.goto(url); await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  await verifyForestRequests(observed, report.forestAssets);
  report.bundle = await page.locator('script[type="module"]').getAttribute('src'); assert.equal(report.bundle, expected);
  report.bundleSha256 = hash(await modulePromise); assert.equal(report.bundleSha256, hash(await fs.readFile(path.join('dist', expected))));
  await page.evaluate(async first => {
    const q = __quarry; q.setQuality('ultra'); q.mute(); await q.start('playground'); q.autopilot(false);
    q.setInput({ throttle: 0, steer: 0, brake: 1, handbrake: false });
    q.teleport(0, first.position[0], first.position[2], first.yaw); q.simulate(.25);
    document.querySelector('#ui').style.visibility = 'hidden';
  }, route[0]);
  await page.keyboard.press('KeyT'); await page.waitForFunction(() => __quarry.cars.length === 1);
  // Traffic toggles only during play; enter inspection after the real UI action.
  await page.evaluate(p => __quarry.captureCamera(p.position, p.target), route[0]);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(output, 'start.png') });
  cdp = await page.context().newCDPSession(page);
  cdp.on('Page.screencastFrame', event => {
    const file = `frames/frame-${String(report.frames.length).padStart(5, '0')}.jpg`;
    report.frames.push({ file, timestamp: event.metadata.timestamp, metadata: event.metadata });
    writes.push(fs.writeFile(path.join(output, file), Buffer.from(event.data, 'base64')));
    cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 4 });
  report.motion = await page.evaluate(({ route, durationMs }) => new Promise(resolve => {
    const poses = []; let start;
    function frame(now) {
      start ??= now; const elapsed = Math.min(now - start, durationMs), n = elapsed / durationMs * (route.length - 1);
      const i = Math.min(route.length - 2, Math.floor(n)), t = Math.min(1, n - i), a = route[i], b = route[i + 1];
      const lerp = (x, y) => x + (y - x) * t;
      const position = a.position.map((v, k) => lerp(v, b.position[k])), target = a.target.map((v, k) => lerp(v, b.target[k]));
      const q = __quarry; q.teleport(0, position[0], position[2], lerp(a.yaw, b.yaw)); q.captureCamera(position, target);
      poses.push({ elapsed, timestamp: Date.now() / 1000, camera: q.cameraPose, player: q.cars[0].position,
        expectedDistance: lerp(a.distance, b.distance), localAzimuth: lerp(a.azimuth, b.azimuth) });
      if (elapsed < durationMs) requestAnimationFrame(frame); else resolve({ poses, northRidge: q.northRidge, stats: q.stats });
    }
    requestAnimationFrame(frame);
  }), { route, durationMs });
  await cdp.send('Page.stopScreencast'); await Promise.all(writes); await cdp.detach(); cdp = undefined;
  await page.screenshot({ path: path.join(output, 'finish.png') });
  assert.ok(report.frames.length > 150 && report.motion.poses.length > 400, 'Continuous evidence must contain actual rendered progression');
  for (const frame of report.frames) {
    const closest = report.motion.poses.reduce((a, b) => Math.abs(a.timestamp - frame.timestamp) < Math.abs(b.timestamp - frame.timestamp) ? a : b);
    frame.nearestPose = { elapsed: closest.elapsed, timestampDeltaMs: (closest.timestamp - frame.timestamp) * 1000,
      camera: closest.camera, player: closest.player, expectedDistance: closest.expectedDistance, localAzimuth: closest.localAzimuth };
  }
  report.maxAnchorXZError = Math.max(...report.motion.poses.map(p => Math.hypot(p.camera.position[0] - p.player[0], p.camera.position[2] - p.player[2])));
  assert.ok(report.maxAnchorXZError < 1e-4); assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []);
  report.passed = true;
} catch (error) { report.passed = false; report.error = error.stack ?? String(error); process.exitCode = 1; }
finally {
  if (cdp) await cdp.send('Page.stopScreencast').catch(() => {});
  await Promise.allSettled(writes); if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, frames: report.frames.length,
    poses: report.motion?.poses.length, bundle: report.bundle, errors: report.errors, browserClosed: report.browserClosed, output }));
}
