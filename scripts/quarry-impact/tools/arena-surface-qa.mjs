// Matched arena aggregate/wet-ground fixture. Set a unique QUARRY_ARENA_PHASE.
// No runtime hooks, global lighting, exposure or materials are changed here.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const phase = process.env.QUARRY_ARENA_PHASE || 'baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
const output = path.resolve(process.env.QUARRY_ARENA_OUTPUT || 'outputs/arena-surface', phase);
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const maskPath = 'assets/arena-floor-mask.rgba.gz';
// The original published baseline predates the mask. Candidate phases must
// prove the real application requested it, not merely that an HTTP fetch works.
const requireMask = phase !== 'baseline';
const neutral = { throttle: 0, steer: 0, brake: 1, handbrake: false };
// Exact current world sequence: aggregate170*7+290*8 draws precede puddles.
// Keep this source-derived layout as a fixed fixture if material implementation
// changes; coordinates must remain matched between baseline and candidates.
let seed = 9311;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
for (let i = 0; i < 170 * 7 + 290 * 8; i++) random();
const puddles = Array.from({ length: 12 }, (_, id) => {
    const a = random() * 6.28, r = 10 + random() * 27, radius = 1.3 + random() * 2.5;
    for (let i = 0; i < 33; i++) random();
    return { id, x: Math.sin(a) * r, y: .025, z: Math.cos(a) * r, radius, scaleY: .45 + random() * .6 };
});
const puddle = puddles[1];
const views = [
    { name: 'rear-centre', player: [0, -20, 0], position: [0, 1.25, -25.8], target: [0, .78, -21] },
    { name: 'rear-chase', player: [0, -20, 0], position: [0, 3.7, -28], target: [0, .85, -16] },
    { name: 'hood-gravel', player: [-15, -11, 0], position: [-15, 1.05, -9], target: [0, .35, 15] },
    { name: 'ground-low', player: [-14, -12, 0], position: [-14, .36, -8], target: [-2, .1, 10] },
    { name: 'puddle-oblique', puddle: puddle.id, player: [-5, -22, 0], position: [-2.8, 1.05, -20.7], target: [puddle.x, puddle.y, puddle.z] },
    { name: 'puddle-waterline', puddle: puddle.id, player: [-5, -22, 0], position: [puddle.x, .19, -19], target: [puddle.x, .03, -13.6] },
    { name: 'puddle-rim', puddle: puddle.id, player: [9, -24, 0], position: [8.2, .65, -17], target: [5.6, .028, -14.5] },
    { name: 'arena-boundary', player: [-32, 10, -Math.PI / 2], position: [-37, 1.4, 9], target: [-45, .1, 8] },
];
const report = { phase, url, viewport: { width: 2560, height: 1440 }, quality: 'ultra', settleMs: 1400, sampleMs: 2500,
    puddleSource: 'world seed9311;170*7+290*8 aggregate draws, then12 puddles of37 draws; fixture freezes actual published positions',
    puddles, views: [], moving: [], assets: [], errors: [], failedRequests: [], requestedModels: [] };
await fs.mkdir(output, { recursive: true });
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Use a new phase; preserve earlier evidence');
let browser;
try {
    browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
    const context = await browser.newContext({ viewport: report.viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const maskURL = new URL(maskPath, url).href;
    const maskResponse = requireMask ? page.waitForResponse(response => response.url() === maskURL, { timeout: 120000 }) : null;
    maskResponse?.catch(() => {});
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    page.on('response', response => {
        if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
        if (/\/models\/[^?]+\.glb(?:\?|$)/.test(response.url())) report.requestedModels.push(response.url());
    });
    page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto(url);
    await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
    if (maskResponse) {
        const response = await maskResponse; assert.equal(response.status(), 200);
        const bytes = await response.body(), local = await fs.readFile(path.join('dist', maskPath));
        assert.equal(hash(bytes), hash(local), 'The mask actually loaded by the application must match tested dist');
        report.arenaMaskAsset = { url: response.url(), bytes: bytes.length, sha256: hash(bytes),
            observedApplicationRequest: true, resourceType: response.request().resourceType() };
    }
    report.bundle = await page.locator('script[type="module"]').getAttribute('src');
    for (const asset of [report.bundle, 'models/quarry-headwall.glb', 'models/coupe.glb', 'models/sedan.glb', 'models/hatch.glb']) {
        const response = await page.request.get(new URL(asset, url).href); assert.equal(response.status(), 200);
        const bytes = await response.body(); report.assets.push({ asset, bytes: bytes.length, sha256: hash(bytes) });
    }
    const expectedBundle = process.env.QUARRY_ARENA_EXPECTED_BUNDLE || (phase === 'baseline' ? './assets/index-v3DLdAfM.js' : undefined);
    const expectedHash = process.env.QUARRY_ARENA_EXPECTED_SHA || (phase === 'baseline' ? '8bbda599ae743b8519fea6d2aee3f9d40bbefc833fe2aac93a6b304cd9aa07b7' : undefined);
    if (expectedBundle) assert.equal(report.bundle, expectedBundle);
    if (expectedHash) assert.equal(report.assets[0].sha256, expectedHash);
    report.gpu = await page.evaluate(() => {
        const gl = document.querySelector('canvas').getContext('webgl2'), extension = gl.getExtension('WEBGL_debug_renderer_info');
        return extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
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
    for (const view of views) {
        await page.evaluate(({ view, neutral }) => {
            __quarry.resume(); __quarry.setInput(neutral); __quarry.teleport(0, ...view.player); __quarry.simulate(.25);
            __quarry.captureCamera(view.position, view.target); document.querySelector('#ui').style.visibility = 'hidden';
        }, { view, neutral });
        const frameTimes = await sample();
        await page.screenshot({ path: path.join(output, view.name + '.png') });
        report.views.push({ ...view, frameTimes, ...await page.evaluate(() => ({ stats: __quarry.stats, car: __quarry.inspect()[0] })) });
        console.log(`Captured ${phase}/${view.name}`);
    }
    await page.evaluate(({ puddle, neutral }) => {
        __quarry.resume(); __quarry.recover(); __quarry.setInput(neutral); __quarry.teleport(0, puddle.x, -31, 0); __quarry.simulate(.25);
        __quarry.velocity(0, 0, 0, 9);
    }, { puddle, neutral });
    for (let i = 0; i < 4; i++) {
        const pose = await page.evaluate(i => {
            if (i) { __quarry.resume(); __quarry.setInput({ throttle: .18, steer: 0, brake: 0, handbrake: false }); __quarry.simulate(.75); }
            const car = __quarry.inspect()[0], p = car.position, f = car.forward, length = Math.hypot(f[0], f[2]);
            const fx = f[0] / length, fz = f[2] / length, distance = 7.4 + Math.abs(__quarry.cars[0].speed) * .04;
            const position = [p[0] - fx * distance, p[1] + 2.65, p[2] - fz * distance], target = [p[0] + fx * 4, p[1] + .5, p[2] + fz * 4];
            __quarry.captureCamera(position, target); document.querySelector('#ui').style.visibility = 'hidden';
            return { position, target, car };
        }, i);
        const frameTimes = await sample(), name = `moving-chase-${String(i).padStart(2, '0')}`;
        await page.screenshot({ path: path.join(output, name + '.png') });
        report.moving.push({ name, time: i * .75, ...pose, frameTimes }); console.log(`Captured ${phase}/${name}`);
    }
    const first = report.moving[0].car.position, last = report.moving.at(-1).car.position;
    report.movementMetres = Math.hypot(last[0] - first[0], last[2] - first[2]); assert.ok(report.movementMetres > 10);
    assert.deepEqual(report.errors, []); assert.deepEqual(report.failedRequests, []); report.passed = true;
} catch (error) {
    report.passed = false; report.error = String(error); process.exitCode = 1;
} finally {
    if (browser) { await browser.close(); report.browserClosed = true; }
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: report.passed, error: report.error, bundle: report.bundle, assets: report.assets,
        views: report.views.length, moving: report.moving.length, movementMetres: report.movementMetres,
        errors: report.errors, failedRequests: report.failedRequests, browserClosed: report.browserClosed }));
}
