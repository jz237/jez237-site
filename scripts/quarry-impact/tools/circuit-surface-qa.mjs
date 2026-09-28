// Matched evidence for asphalt/shoulder authoring. This fixture controls the car
// through ordinary fixed-step gameplay; the continuous segment never teleports,
// calls simulate(), or overrides the normal chase camera after its initial setup.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';

const phase = process.env.QUARRY_CIRCUIT_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_CIRCUIT_OUTPUT || 'outputs/circuit-surface', phase);
const expected = phase === 'baseline' ? './assets/index-DYqD0V85.js' : process.env.QUARRY_CIRCUIT_EXPECTED_BUNDLE;
assert.ok(expected, 'Candidate requires its exact application module');
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
const point = degrees => { const a = degrees * Math.PI / 180; return { x: 108 * Math.sin(a) + 12 * Math.sin(3 * a), z: 88 * Math.cos(a) + 9 * Math.sin(2 * a) }; };
const pose = (name, degrees, hood = false) => {
  const p = point(degrees), next = point(degrees - .2);
  return { name, degrees, hood, player: [p.x, p.z, Math.atan2(next.x - p.x, next.z - p.z)] };
};
const views = [pose('east-join-chase', 101), pose('east-bay-chase', 55), pose('north-bend-chase', 0),
  pose('north-bend-hood', 0, true), pose('works-chase', -60), pose('works-hood', -60, true),
  pose('west-join-chase', -106), pose('west-join-hood', -106, true)];
const track = Array.from({ length: 480 }, (_, i) => point(-i / 480 * 360));
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra',
  protocol: 'Eight matched physically settled normal chase/hood views, followed by one 30-second continuous real-time physics drive from the east asphalt join toward the western join. Fixed views pause physics after settling. Motion uses steering/throttle/brake only after one setup teleport, retains the normal chase camera, and records actual poses plus JPEG screencast frames. Timing with recording enabled is diagnostic, not a performance benchmark.',
  acceptance: ['Plausible asphalt aggregate scale, without repeating hair-like scratches.', 'Unequal restrained repairs and broken tire wear rather than four continuous ribbons.', 'Irregular mineral margins with no hard shoulder outline, mirrored texture, Z-fighting or join discontinuity.', 'No texture swimming or view-dependent sparkle in continuous driving.', 'Preserve road geometry, driving behavior, white car finish and accepted gravel surfaces.'],
  views: [], assets: [], errors: [], failedRequests: [], frames: [], poses: [], settleMs: 1800 };
await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Preserve earlier evidence');
const htmlResponse = await fetch(url); assert.equal(htmlResponse.status, 200);
const html = await htmlResponse.text();
assert.equal(html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1], expected);
const extras = ['assets/sky.hdr', 'assets/arena-floor-mask.rgba.gz',
  // The historical surface used all three old maps. The revised material keeps
  // only its large-scale photographic colour and replaces the micro maps.
  ...(phase === 'baseline' ? ['diff', 'nor_gl', 'rough'] : ['diff']).map(channel => `assets/asphalt_${channel}.jpg`),
  ...['diff', 'nor_gl', 'rough'].map(channel => `assets/gravel_${channel}.jpg`),
  ...['coupe', 'sedan', 'hatch', 'quarry-cut', 'quarry-extension', 'quarry-headwall', 'quarry-east-bay', 'quarry-road-approach', 'quarry-roadside', 'rocks-lod'].map(name => `models/${name}.glb`),
  expected.replace(/^\.\//, ''),
  ...[...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\.\/([^"]+)"/g)].map(match => match[1]),
  ...JSON.parse(process.env.QUARRY_CIRCUIT_EXTRA_ASSETS || '[]')];
const plan = await forestRuntimeAssetPlan({ publicAssets: true });
for (const file of extras) if (!plan.some(asset => asset.file === file)) {
  assert.match(file, /^(assets|models)\//); assert.equal(path.posix.normalize(file), file);
  const bytes = await fs.readFile(path.join('dist', file)); plan.push({ file, bytes: bytes.length, sha256: hash(bytes) });
}
let browser, page, cdp, recording = false; const writes = [];
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    // Test-only capture of actual failed linker inputs. Keep the successful hot
    // render path untouched and avoid requesting any new product diagnostics.
    window.__circuitShaderFailures = [];
    window.__circuitShaderPrograms = [];
    const prototype = WebGL2RenderingContext.prototype, original = prototype.linkProgram;
    prototype.linkProgram = function (program) {
      original.call(this, program);
      if (this.getProgramParameter(program, this.LINK_STATUS)) {
        const shaders = this.getAttachedShaders(program) || [];
        const source = shaders.map(shader => this.getShaderSource(shader) || '').join('\n');
        if (source.includes('uniform sampler2D circuitMask')) {
          const samplerTypes = new Set([this.SAMPLER_2D, this.SAMPLER_CUBE, this.SAMPLER_3D, this.SAMPLER_2D_SHADOW, this.SAMPLER_2D_ARRAY, this.SAMPLER_2D_ARRAY_SHADOW, this.SAMPLER_CUBE_SHADOW, this.INT_SAMPLER_2D, this.UNSIGNED_INT_SAMPLER_2D]);
          const samplers = [];
          for (let i = 0; i < this.getProgramParameter(program, this.ACTIVE_UNIFORMS); i++) {
            const uniform = this.getActiveUniform(program, i);
            if (uniform && samplerTypes.has(uniform.type)) samplers.push({ name: uniform.name, type: uniform.type, size: uniform.size });
          }
          window.__circuitShaderPrograms.push({ samplers, activeSamplerElements: samplers.reduce((sum, item) => sum + item.size, 0),
            maxFragmentTextureUnits: this.getParameter(this.MAX_TEXTURE_IMAGE_UNITS),
            declarationLines: source.split('\n').filter(line => /uniform\s+sampler|#define NUM_.*SHADOW/.test(line)) });
        }
      }
      if (!this.getProgramParameter(program, this.LINK_STATUS)) {
        const shaders = (this.getAttachedShaders(program) || []).map(shader => ({
          type: this.getShaderParameter(shader, this.SHADER_TYPE), source: this.getShaderSource(shader), log: this.getShaderInfoLog(shader),
        }));
        const uniforms = [];
        for (let i = 0; i < this.getProgramParameter(program, this.ACTIVE_UNIFORMS); i++) {
          const uniform = this.getActiveUniform(program, i); if (uniform) uniforms.push({ name: uniform.name, type: uniform.type, size: uniform.size });
        }
        window.__circuitShaderFailures.push({ log: this.getProgramInfoLog(program), maxFragmentTextureUnits: this.getParameter(this.MAX_TEXTURE_IMAGE_UNITS), shaders, uniforms });
      }
    };
  });
  const observed = await observeForestRequests(page, url, plan);
  page.on('pageerror', error => { report.errors.push(error.message); console.error(error.message); });
  page.on('console', message => { if (message.type() === 'error') { report.errors.push(message.text()); console.error(message.text().slice(0, 500)); } });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(url); await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 180000 });
  await verifyForestRequests(observed, report.assets);
  assert.deepEqual(report.errors, [], 'Stop before visual acceptance if initial shader compilation or boot failed');
  report.bundle = await page.locator('script[type="module"]').getAttribute('src'); assert.equal(report.bundle, expected);
  report.bundleSha256 = report.assets.find(asset => asset.file === expected.replace(/^\.\//, '')).sha256;
  if (phase === 'baseline') assert.equal(report.bundleSha256, 'e048de1fc9d95e01e30fc965034ccd7ae1b4f7e9496d0e732c80bb8b843982bb');
  report.daylight = await page.evaluate(() => __quarry.daylight);
  report.gpu = await page.evaluate(() => { const gl = document.querySelector('canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info'); return gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER); });
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async () => { await __quarry.start('playground'); __quarry.setQuality('ultra'); __quarry.autopilot(false); __quarry.mute(); });
  await page.keyboard.press('KeyT'); await page.waitForFunction(() => __quarry.cars.length === 1 && __quarry.state === 'playing');
  report.trafficDisabled = true; let hood = false;
  for (const view of views) {
    await page.evaluate(({ view, neutral }) => { const q = __quarry; q.resume(); q.setInput(neutral); q.teleport(0, ...view.player); q.simulate(.25); document.querySelector('#ui').style.visibility = 'hidden'; }, { view, neutral });
    if (hood !== view.hood) { await page.keyboard.press('KeyC'); hood = view.hood; }
    await page.waitForTimeout(report.settleMs);
    await page.evaluate(() => { __quarry.pause(); document.querySelector('#ui').style.visibility = 'hidden'; });
    await page.waitForTimeout(350);
    assert.deepEqual(report.errors, [], 'Stop matched capture if a newly visible shader fails');
    await page.screenshot({ path: path.join(output, view.name + '.png') });
    report.views.push({ ...view, ...await page.evaluate(() => ({ actualCamera: __quarry.cameraPose, car: __quarry.inspect()[0], stats: __quarry.stats })) });
    console.log(`Captured ${phase}/${view.name}`);
  }
  if (hood) await page.keyboard.press('KeyC');
  const start = pose('motion-start', 101);
  await page.evaluate(({ start, neutral }) => { const q = __quarry; q.resume(); q.setInput(neutral); q.teleport(0, ...start.player); q.simulate(.25); document.querySelector('#ui').style.visibility = 'hidden'; }, { start, neutral });
  await page.waitForTimeout(1800);
  await fs.mkdir(path.join(output, 'frames'), { recursive: true });
  cdp = await page.context().newCDPSession(page);
  cdp.on('Page.screencastFrame', event => {
    const file = `frames/frame-${String(report.frames.length).padStart(5, '0')}.jpg`;
    report.frames.push({ file, timestamp: event.metadata.timestamp, metadata: event.metadata });
    writes.push(fs.writeFile(path.join(output, file), Buffer.from(event.data, 'base64')));
    cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 2560, maxHeight: 1440, everyNthFrame: 4 }); recording = true;
  console.log('Started 30-second physically driven normal-chase sequence');
  report.motion = await page.evaluate(async ({ track }) => {
    const q = __quarry, poses = [], start = performance.now(); let previous = q.inspect()[0].position, distance = 0;
    const result = await new Promise(resolve => {
      const frame = now => {
        const car = q.inspect()[0], p = car.position; let nearest = 0, deviation = Infinity;
        for (let i = 0; i < track.length; i++) { const d = Math.hypot(track[i].x - p[0], track[i].z - p[2]); if (d < deviation) { deviation = d; nearest = i; } }
        distance += Math.hypot(p[0] - previous[0], p[2] - previous[2]); previous = p;
        const target = track[(nearest + 9) % track.length], desired = Math.atan2(target.x - p[0], target.z - p[2]), heading = Math.atan2(car.forward[0], car.forward[2]);
        const error = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
        const speed = Math.abs(q.cars[0].speed), input = { throttle: speed < 12 ? .55 : speed < 13.5 ? .22 : 0, steer: Math.max(-.55, Math.min(.55, error * 1.8)), brake: speed > 14 ? .22 : 0, handbrake: false };
        q.setInput(input);
        poses.push({ t: (now - start) / 1000, timestamp: Date.now() / 1000, camera: q.cameraPose, car, speed, input, trackIndex: nearest, crossTrackMetres: deviation, state: q.state });
        if (now - start < 30000) requestAnimationFrame(frame);
        else { q.setInput({ throttle: 0, steer: 0, brake: 1, handbrake: false }); q.pause(); resolve({ durationSeconds: (now - start) / 1000, distanceMetres: distance, poses, stats: q.stats }); }
      };
      requestAnimationFrame(frame);
    });
    return result;
  }, { track });
  await cdp.send('Page.stopScreencast'); recording = false; await Promise.all(writes); await cdp.detach(); cdp = null;
  report.poses = report.motion.poses; delete report.motion.poses;
  for (const frame of report.frames) {
    let nearest = 0; for (let i = 1; i < report.poses.length; i++) if (Math.abs(report.poses[i].timestamp - frame.timestamp) < Math.abs(report.poses[nearest].timestamp - frame.timestamp)) nearest = i;
    frame.poseIndex = nearest; frame.poseDeltaSeconds = Math.abs(report.poses[nearest].timestamp - frame.timestamp);
  }
  report.motion.maxCrossTrackMetres = Math.max(...report.poses.map(pose => pose.crossTrackMetres));
  report.motion.minimumHealth = Math.min(...report.poses.map(pose => pose.car.health));
  report.motion.teleportsDuringRecording = 0; report.motion.cameraOverridesDuringRecording = 0; report.motion.fixedStepManualAdvancesDuringRecording = 0;
  for (const seconds of [0, 10, 20, 30]) {
    const record = report.frames.reduce((best, item) => Math.abs(report.poses[item.poseIndex].t - seconds) < Math.abs(report.poses[best.poseIndex].t - seconds) ? item : best);
    await fs.copyFile(path.join(output, record.file), path.join(output, `moving-chase-${String(seconds).padStart(2, '0')}.jpg`));
  }
  await fs.writeFile(path.join(output, 'playback.html'), `<!doctype html><meta charset="utf-8"><title>Circuit ${phase} physical drive</title><style>body{margin:0;background:#151719;color:white;font:16px system-ui}img{width:100%;max-height:90vh;object-fit:contain}nav{padding:10px}input{width:65%}</style><img id="frame"><nav><button id="play">Play / pause</button> <input id="seek" type="range" min="0" value="0"><span id="label"></span></nav><script>const frames=${JSON.stringify(report.frames.map(frame => ({ file: frame.file, t: report.poses[frame.poseIndex].t })))};let n=0,playing=false;const image=document.querySelector('#frame'),seek=document.querySelector('#seek'),label=document.querySelector('#label');seek.max=frames.length-1;function show(){image.src=frames[n].file;seek.value=n;label.textContent=frames[n].t.toFixed(2)+' s';}seek.oninput=()=>{n=+seek.value;show()};document.querySelector('#play').onclick=()=>playing=!playing;setInterval(()=>{if(playing){n=(n+1)%frames.length;show()}},${30000 / report.frames.length});show();</script>`);
  assert.ok(report.motion.durationSeconds >= 30 && report.motion.durationSeconds < 32);
  assert.ok(report.frames.length >= 80 && report.poses.length >= 200, 'Continuous motion evidence must be dense enough to review');
  assert.ok(report.motion.distanceMetres > 200, 'Genuine road travel required');
  assert.ok(report.motion.maxCrossTrackMetres < 5.5, 'Keep the drive on the retained lane');
  assert.equal(report.motion.minimumHealth, 100, 'Driving evidence must be free of collision recovery');
  assert.ok(report.poses.every(pose => pose.state === 'playing'));
  assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) { report.passed = false; report.error = error.stack ?? String(error); process.exitCode = 1; }
finally {
  if (recording && cdp) await cdp.send('Page.stopScreencast').catch(() => {});
  await Promise.allSettled(writes);
  if (page && !page.isClosed()) {
    report.circuitShaderPrograms = await page.evaluate(() => window.__circuitShaderPrograms || []).catch(() => []);
    const failures = await page.evaluate(() => window.__circuitShaderFailures || []).catch(() => []);
    report.shaderLinkFailures = failures.length;
    if (failures.length) {
      await fs.writeFile(path.join(output, 'shader-link-failures.json'), JSON.stringify(failures, null, 2) + '\n');
      report.shaderLinkFailureDetails = 'shader-link-failures.json';
    }
  }
  if (browser) { await browser.close(); report.browserClosed = true; }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ phase, passed: report.passed, error: report.error, bundle: report.bundle, sha256: report.bundleSha256, views: report.views.length, frames: report.frames.length, poses: report.poses.length, motion: report.motion, errors: report.errors, browserClosed: report.browserClosed, output }));
}
