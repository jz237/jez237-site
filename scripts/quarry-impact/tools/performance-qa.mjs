import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';
import { circuitRuntimeAssetPlan } from './circuit-runtime-assets.mjs';
import { geologyRuntimeAssetPlan } from './geology-runtime-assets.mjs';
import { tsImport } from 'tsx/esm/api';

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
const summarizeFrames = frames => {
  if (!frames.length) return null;
  const sorted = [...frames].sort((a, b) => a - b), meanMs = frames.reduce((a, b) => a + b, 0) / frames.length;
  return { frames: frames.length, meanMs, fps: 1000 / meanMs, p50: sorted[Math.floor(sorted.length * .5)],
    p95: sorted[Math.floor(sorted.length * .95)], p99: sorted[Math.floor(sorted.length * .99)],
    over33ms: frames.filter(value => value > 33.34).length };
};
async function prepareForestStops() {
  const bytes = await fs.readFile('src/quarry-north-forest.json'), placements = JSON.parse(bytes);
  const { backdropGroundHeight } = await tsImport('../src/scenery-backdrop.ts', import.meta.url);
  const { quarryRim, quarryColliderLayout } = await tsImport('../src/quarry-layout.ts', import.meta.url);
  const solidTrunks = quarryColliderLayout().filter(collider => collider.id.startsWith('tree-') && collider.shape === 'cylinder');
  const stops = ['stand-0', 'stand-3', 'stand-5'].map(id => {
    const stand = placements.stands.find(value => value.id === id); assert.ok(stand, id);
    const angle = Math.atan2(stand.x / 1.08, stand.z), nx = Math.sin(angle), nz = Math.cos(angle);
    for (const front of [14, 11, 17, 8]) for (const lateral of [0, -4, 4, -7, 7]) {
      const x = stand.x - nx * front + nz * lateral, z = stand.z - nz * front - nx * lateral;
      const rimMargin = Math.hypot(x / 1.08, z) - quarryRim(Math.atan2(x / 1.08, z)).r;
      const trunkClearance = Math.min(...solidTrunks.map(tree => Math.hypot(x - tree.p.x, z - tree.p.z) - tree.radius));
      const ground = backdropGroundHeight(x, z);
      const slope = Math.hypot((backdropGroundHeight(x + 2, z) - backdropGroundHeight(x - 2, z)) / 4,
        (backdropGroundHeight(x, z + 2) - backdropGroundHeight(x, z - 2)) / 4);
      if (rimMargin < 8 || trunkClearance < 4.2 || slope > .42) continue;
      return { id, variant: stand.variant, x, z, ground, yaw: Math.atan2(stand.x - x, stand.z - z),
        stand: { x: stand.x, z: stand.z }, rimMargin, trunkClearance, slope };
    }
    throw new Error(`No safe placed inspection position before ${id}`);
  });
  return { stops, sourceSha256: createHash('sha256').update(bytes).digest('hex'), backdropGroundHeight };
}
async function addRidgeStops(forest) {
  if (!forest) return forest;
  const { prepareNorthRidgeStops } = await tsImport('./ridge-stop-preflight.ts', import.meta.url);
  const ridge = prepareNorthRidgeStops();
  return { ...forest, stops: [...forest.stops, ...ridge.stops], ridge };
}
async function eastBayAssetPlan() {
  const file = 'models/quarry-east-bay.glb', manifestPath = 'source/models/quarry-east-bay-manifest.json';
  const html = await fs.readFile('dist/index.html', 'utf8');
  const modules = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.js)"/g)].map(match => match[1]);
  const code = (await Promise.all(modules.map(module => fs.readFile(path.join('dist', module), 'utf8')))).join('\n');
  if (!code.includes('quarry-east-bay.glb')) return null; // Historical frozen builds remain usable.
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const record = manifest.assets.find(asset => asset.file === 'public/' + file);
  assert.ok(record, 'The east-bay manifest must identify its runtime GLB');
  for (const root of ['public', 'dist']) {
    const bytes = await fs.readFile(path.join(root, file));
    assert.equal(bytes.length, record.bytes, `The ${root} east-bay size must match its manifest`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, `The ${root} east-bay hash must match its manifest`);
  }
  return { file, bytes: record.bytes, sha256: record.sha256, manifest: manifestPath };
}
async function addEastBayStops(forest, enabled) {
  if (!forest || !enabled) return forest;
  const { prepareEastBayStops } = await tsImport('./east-bay-stop-preflight.ts', import.meta.url);
  const eastBay = prepareEastBayStops();
  return { ...forest, stops: [...forest.stops, ...eastBay.stops], eastBay };
}
async function circuitAssetsForBuild() {
  const html = await fs.readFile('dist/index.html', 'utf8');
  const modules = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.js)"/g)].map(match => match[1]);
  const code = (await Promise.all(modules.map(module => fs.readFile(path.join('dist', module), 'utf8')))).join('\n');
  return circuitRuntimeAssetPlan({ historical: !code.includes('circuit-surface.rgba.gz') });
}
async function geologyAssetsForBuild() {
  const html = await fs.readFile('dist/index.html', 'utf8');
  const modules = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.js)"/g)].map(match => match[1]);
  const code = (await Promise.all(modules.map(module => fs.readFile(path.join('dist', module), 'utf8')))).join('\n');
  return geologyRuntimeAssetPlan({ historical: !code.includes('vec4 geologyPhoto') });
}
// Optional CPU-only preflight deliberately produces no performance pass/fail.
// It lets placement changes be checked before reserving the isolated GPU run.
if (process.env.QUARRY_PERFORMANCE_PLAN_ONLY === '1') {
  const eastBayAsset = await eastBayAssetPlan();
  const { stops, sourceSha256, ridge, eastBay } = await addEastBayStops(await addRidgeStops(await prepareForestStops()), !!eastBayAsset);
  const plan = { kind: 'forest-inspection-placement-preflight', sourceSha256, stops, ridge, eastBay, eastBayAsset,
    measuredFrames: 0, browserLaunched: false };
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(plan, null, 2) + '\n');
  console.log(JSON.stringify(plan)); process.exit(0);
}
const report = {
  startedAt: new Date().toISOString(), seconds, quality, viewport: [2560, 1440],
  protocol: 'Five equal blocks alternating eight-car derby and scenic racing; restart completed events. Eight-second warm-up before capture. No camera or physics time acceleration.',
  events: [], samples: [], errors: [], forestAssets: [], circuitAssets: [], geologyAssets: [], forestStops: [], output, screenshot,
};
let browser;
try {
  await fs.mkdir(path.dirname(output), { recursive: true });
  const forestAssets = await forestRuntimeAssetPlan();
  const eastBayAsset = await eastBayAssetPlan();
  const circuitAssets = await circuitAssetsForBuild();
  const geologyAssets = await geologyAssetsForBuild();
  const observedAssets = [...forestAssets, ...(eastBayAsset ? [eastBayAsset] : []), ...circuitAssets, ...geologyAssets];
  report.geologyAssetsExpected = geologyAssets;
  report.forestAssetsExpected = forestAssets;
  report.eastBayAssetExpected = eastBayAsset;
  report.circuitAssetsExpected = circuitAssets;
  const hasForest = forestAssets.some(asset => /quarry-north-fir-\d\.glb$/.test(asset.file));
  const hasRidge = forestAssets.some(asset => /north-backdrop-0-albedo\.png$/.test(asset.file));
  const foreground = hasForest && seconds >= 480 ? await prepareForestStops() : null;
  const forest = await addEastBayStops(hasRidge ? await addRidgeStops(foreground) : foreground, !!eastBayAsset);
  const forestStart = seconds * (hasRidge ? .41 : .45);
  // At610s all seven stops retain16s:250.1–362.1, entirely within the
  // middle derby244–366. Shorter runs scale only this interval, never a race block.
  const inspectionCapacity = eastBayAsset ? seconds * .6 - forestStart - 2 : seconds * (hasRidge ? .17 : .08);
  const forestDuration = forest ? Math.min(16 * forest.stops.length, inspectionCapacity) : 0;
  const stopDuration = forest ? forestDuration / forest.stops.length : 0;
  report.forestProtocol = { enabled: !!forest, startSeconds: forest ? forestStart : null,
    durationSeconds: forest ? forestDuration : 0, stopSeconds: forest ? stopDuration : 0,
    placementSha256: forest?.sourceSha256, stops: forest?.stops ?? [],
    ridgePlacementSha256: forest?.ridge?.placementsSHA256,
    eastBayCollisionSha256: forest?.eastBay?.collisionSha256,
    description: 'Placed, braked inspections at three foreground stands, two ridge close/transition poses and, when present, two east-bay close/oblique poses, with eight live cars, real physics and the ordinary chase camera. These are not physical driving routes.',
    reasonIfDisabled: forest ? undefined : hasForest ? 'Runs shorter than 480 seconds omit the forest interval' : 'Built application has no authored northern fir assets',
    diagnosticsMeaning: 'Cell visible flags are scene flags, not frustum visibility. Cell triangle/draw counts describe the selected LOD before culling; renderer stats describe actual submissions.' };
  if (forest) report.protocol += ` Within the middle derby block, ${forest.stops.length} placed braked forest inspections replace at most ${forestDuration} seconds; both race blocks and all previous coverage assertions remain intact.`;
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: [
    '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--ignore-gpu-blocklist',
  ] });
  const page = await browser.newPage({ viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1 });
  const pageURL = process.env.QUARRY_QA_URL ?? 'http://127.0.0.1:8795/';
  const forestRequests = await observeForestRequests(page, pageURL, observedAssets);
  const arenaMaskPath = 'assets/arena-floor-mask.rgba.gz';
  const arenaMaskURL = new URL(arenaMaskPath, pageURL).href;
  const arenaMaskResponse = page.waitForResponse(response => response.url() === arenaMaskURL, { timeout: 120000 });
  arenaMaskResponse.catch(() => {});
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('requestfailed', r => report.errors.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(pageURL);
  await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  const verifiedAssets = [];
  await verifyForestRequests(forestRequests, verifiedAssets);
  const forestFiles = new Set(forestAssets.map(asset => asset.file));
  const circuitFiles = new Set(circuitAssets.map(asset => asset.file));
  report.forestAssets = verifiedAssets.filter(asset => forestFiles.has(asset.file));
  report.circuitAssets = verifiedAssets.filter(asset => circuitFiles.has(asset.file));
  report.geologyAssets = verifiedAssets.filter(asset => geologyAssets.some(expected => expected.file === asset.file));
  assert.equal(report.geologyAssets.length, geologyAssets.length, 'Observe every expected geology asset request');
  assert.equal(report.circuitAssets.length, circuitAssets.length, 'Observe every expected circuit asset request');
  report.eastBayAsset = verifiedAssets.find(asset => asset.file === eastBayAsset?.file) ?? null;
  const maskResponse = await arenaMaskResponse;
  assert.equal(maskResponse.status(), 200, 'The application must request the arena mask');
  const maskBytes = await maskResponse.body(), localMask = await fs.readFile(path.join('dist', arenaMaskPath));
  const maskHash = createHash('sha256').update(maskBytes).digest('hex');
  assert.equal(maskHash, createHash('sha256').update(localMask).digest('hex'), 'The actual loaded mask must match the frozen dist');
  report.arenaMaskAsset = { url: maskResponse.url(), bytes: maskBytes.length, sha256: maskHash,
    observedApplicationRequest: true, resourceType: maskResponse.request().resourceType() };
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
  let activeForest = -1, activeForestSince = 0, forestRecorderStarted = false;
  const forestRanges = [];
  while ((performance.now() - start) / 1000 < seconds) {
    await page.waitForTimeout(2000);
    const time = (performance.now() - start) / 1000;
    const snapshot = await page.evaluate(() => {
      const { benchmarkSamples, ...stats } = __quarry.stats;
      return { stats, mode: __quarry.mode, cars: __quarry.cars, heap: performance.memory?.usedJSHeapSize,
        northForest: __quarry.northForest ?? null, northRidge: __quarry.northRidge ?? null,
        camera: __quarry.cameraPose ?? null };
    });
    if (time >= nextSample) {
      const forestStop = activeForest >= 0 ? forest.stops[activeForest] : null;
      const position = snapshot.cars[0].position;
      report.samples.push({ time, ...snapshot, forestStop: forestStop?.id ?? null,
        forestSettledSeconds: forestStop ? time - activeForestSince : null,
        forestGroundAtCar: forestStop ? forest.backdropGroundHeight(position[0], position[2]) : null });
      nextSample += 5;
    }
    const nextBlock = Math.min(4, Math.floor(time / (seconds / modes.length)));
    const nextForest = forest && time >= forestStart && time < forestStart + forestDuration
      ? Math.min(forest.stops.length - 1, Math.floor((time - forestStart) / stopDuration)) : -1;
    if (nextForest >= 0) {
      if (nextForest !== activeForest || snapshot.stats.state === 'result') {
        const stop = forest.stops[nextForest];
        const reset = snapshot.stats.state === 'result';
        await page.evaluate(async ({ stop, reset, startRecorder }) => {
          const q = __quarry;
          if (reset) await q.start('derby');
          q.autopilot(false); q.setInput({ throttle: 0, steer: 0, brake: 1, handbrake: false });
          q.teleport(0, stop.x, stop.z, stop.yaw);
          if (startRecorder) {
            // Independent rAF intervals use the same browser frame timestamps
            // as the engine, and only run during this short forest interval.
            window.__forestPerformance = { running: true, phase: stop.id, samples: [], previous: null };
            const frame = now => {
              const capture = window.__forestPerformance;
              if (!capture.running) return;
              if (capture.previous !== null) capture.samples.push({ stop: capture.phase, ms: now - capture.previous });
              capture.previous = now; capture.raf = requestAnimationFrame(frame);
            };
            window.__forestPerformance.raf = requestAnimationFrame(frame);
          } else window.__forestPerformance.phase = stop.id;
        }, { stop, reset, startRecorder: !forestRecorderStarted });
        forestRecorderStarted = true;
        if (activeForest >= 0) forestRanges.at(-1).endSeconds = time;
        activeForest = nextForest; activeForestSince = time;
        forestRanges.push({ stop: stop.id, startSeconds: time });
        report.events.push({ time, mode: 'derby', reason: reset ? 'forest stop event restart' : 'placed braked forest inspection', stop });
      }
    } else if (activeForest >= 0) {
      forestRanges.at(-1).endSeconds = time;
      await page.evaluate(async mode => {
        window.__forestPerformance.running = false; cancelAnimationFrame(window.__forestPerformance.raf);
        __quarry.clearTestInput(); await __quarry.start(mode); __quarry.autopilot(true);
      }, modes[nextBlock]);
      report.events.push({ time, mode: modes[nextBlock], reason: 'resume normal benchmark after forest inspections' });
      activeForest = -1; block = nextBlock;
    } else if (nextBlock !== block || snapshot.stats.state === 'result') {
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
  report.forestFrameSamples = await page.evaluate(() => window.__forestPerformance?.samples ?? []);
  report.forestTiming = summarizeFrames(report.forestFrameSamples.map(sample => sample.ms));
  report.forestRanges = forestRanges;
  const inspectedStops = (forest?.stops ?? []).map(stop => {
    const samples = report.samples.filter(sample => sample.forestStop === stop.id && sample.forestSettledSeconds >= 5
      && sample.stats.state === 'playing');
    const near = samples.filter(sample => Math.hypot(sample.cars[0].position[0] - stop.x, sample.cars[0].position[2] - stop.z) < 3);
    return { ...stop, visits: near.length, samples: near,
        timing: summarizeFrames(report.forestFrameSamples.filter(sample => sample.stop === stop.id).map(sample => sample.ms)) };
  });
  report.forestStops = inspectedStops.filter(stop => !stop.kind);
  report.ridgeStops = inspectedStops.filter(stop => stop.kind === 'ridge').map(stop => ({ ...stop,
    actualDistances: stop.samples.map(sample => Math.hypot(...sample.camera.position.map((value, i) => value - stop.targetCenter[i]))) }));
  report.eastBayStops = inspectedStops.filter(stop => stop.kind === 'east-bay');
  report.ridgeTiming = summarizeFrames(report.forestFrameSamples.filter(sample => sample.stop.startsWith('ridge-')).map(sample => sample.ms));
  report.eastBayTiming = summarizeFrames(report.forestFrameSamples.filter(sample => sample.stop.startsWith('east-bay-')).map(sample => sample.ms));
  report.northForestCloseVisits = report.forestStops.reduce((sum, stop) => sum + stop.visits, 0);
  report.northForestDiagnosticsAvailable = report.forestStops.some(stop => stop.samples.some(sample => sample.northForest !== null));
  for (const stop of report.forestStops) {
    stop.selectedNearCells = stop.samples.map(sample => ({ time: sample.time,
      cells: (sample.northForest ?? []).filter(cell => cell.visible && cell.lod === 0),
      submittedTriangles: sample.stats.triangles, submittedDraws: sample.stats.drawCalls }));
    const selected = stop.selectedNearCells.flatMap(sample => sample.cells);
    stop.selectedNearTriangleRange = selected.length
      ? [Math.min(...selected.map(cell => cell.triangles)), Math.max(...selected.map(cell => cell.triangles))] : null;
  }
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
  report.eastBayRaceVisits = raceSamples.filter(s => {
    const [x, , z] = s.cars[0].position, a = (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
    return a >= 25 && a <= 55;
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
  if (forest) {
    for (const stop of inspectedStops) {
      assert.ok(stop.visits >= (stopDuration >= 14 ? 2 : 1), `${stop.id} needs settled close inspection samples`);
      assert.ok(stop.samples.every(sample => Math.abs(sample.cars[0].speed) < 1), `${stop.id} must remain braked`);
      assert.ok(stop.samples.every(sample => {
        const aboveGround = sample.cars[0].position[1] - sample.forestGroundAtCar;
        return aboveGround > .25 && aboveGround < 1.8;
      }), `${stop.id} must settle onto the unchanged terrain`);
      if (!stop.kind && report.northForestDiagnosticsAvailable) assert.ok(stop.samples.every(sample =>
        Array.isArray(sample.northForest) && sample.northForest.some(cell =>
          cell.id === `north-forest-${stop.id}` && cell.visible && cell.lod === 0
          && Number.isFinite(cell.triangles) && cell.triangles > 0 && cell.draws > 0 && cell.distance < 55)),
        `${stop.id} must exercise its actual near LOD, not merely stand near a far-level forest`);
    }
    for (const stop of report.ridgeStops) {
      assert.ok(stop.actualDistances.every(distance => distance >= stop.expectedDistanceBand[0] && distance <= stop.expectedDistanceBand[1]),
        `${stop.id} must exercise its actual shader distance band with the normal chase camera`);
      assert.ok(stop.samples.every(sample => Math.hypot(sample.cars[0].position[0], sample.cars[0].position[2]) < 250),
        `${stop.id} must stay safely inside automatic recovery`);
      assert.ok(stop.samples.every(sample => sample.northRidge?.some(cell => cell.id === 'north-ridge-' + stop.standId && (cell.near || cell.far) && cell.atlas)),
        `${stop.id} must retain real geometry and the complementary atlas pass`);
    }
    if (eastBayAsset) {
      assert.equal(report.eastBayStops.length, 2, 'Both new wall inspection directions must be sampled');
      assert.ok(report.eastBayRaceVisits > 0, 'Normal racing must also pass the new east bay');
      assert.ok(report.eastBayAsset?.observedApplicationRequest, 'The application itself must load the manifest-matched east-bay GLB');
      for (const stop of report.eastBayStops) assert.ok(stop.samples.every(sample => {
        const delta = stop.targetCenter.map((value, i) => value - sample.camera.position[i]);
        // camera.target is the paused OrbitControls target; ordinary chase
        // orientation is authoritative in the recorded camera quaternion.
        const [x, y, z, w] = sample.camera.quaternion;
        const forward = [-2 * (x * z + w * y), -2 * (y * z - w * x), -1 + 2 * (x * x + y * y)];
        const cosine = delta.reduce((sum, value, i) => sum + value * forward[i], 0) / (Math.hypot(...delta) * Math.hypot(...forward));
        return cosine > Math.cos(sample.camera.fov * Math.PI / 360);
      }), `${stop.id} must retain the wall target inside the ordinary chase view`);
    }
    assert.ok(report.forestFrameSamples.length > forestDuration * 10, 'Forest interval must contain continuous frames');
  }
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
