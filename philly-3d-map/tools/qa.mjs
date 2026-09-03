/**
 * Browser QA harness.
 *
 * Loads the map in headless Chrome with the GPU enabled (SwiftShader falls
 * back automatically), records every console message and page error, drives a
 * scripted interaction pass, and writes screenshots for visual review.
 *
 *   node tools/qa.mjs [--url http://127.0.0.1:8731/philly-3d-map/] [--keep]
 *
 * Exits non-zero if anything reached console.error or threw.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const URL = argOf('--url', 'http://127.0.0.1:8731/philly-3d-map/');
const OUT = argOf('--out', '/tmp/philly-qa');

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const IGNORE = [
  /Failed to load resource.*favicon/i,
  /\[\.WebGL-.*\]\s*GL Driver Message/i,
];

async function run() {
  await mkdir(OUT, { recursive: true });

  // Prefer a system Chrome when one is installed: it keeps this harness
  // working without a matching Playwright browser download, and it is a real
  // shipping build rather than the headless shell.
  const explicit = argOf('--chrome', process.env.CHROME_PATH || '');
  const candidates = explicit
    ? [explicit]
    : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const executablePath = candidates.find((p) => existsSync(p));

  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
    ],
  });
  console.log(`browser: ${executablePath || 'playwright bundled chromium'}`);

  const problems = [];
  const report = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: !!viewport.isMobile,
      hasTouch: !!viewport.hasTouch,
    });
    const page = await context.newPage();
    const logs = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (IGNORE.some((re) => re.test(text))) return;
      logs.push({ type: msg.type(), text });
      if (msg.type() === 'error') problems.push(`[${viewport.id}] console.error: ${text}`);
      if (msg.type() === 'warning') report.push(`[${viewport.id}] warn: ${text}`);
    });
    page.on('pageerror', (err) => {
      problems.push(`[${viewport.id}] pageerror: ${err.message}`);
    });
    page.on('requestfailed', (req) => {
      problems.push(`[${viewport.id}] request failed: ${req.url()} ${req.failure()?.errorText}`);
    });

    console.log(`\n=== ${viewport.id} ${viewport.width}x${viewport.height} ===`);
    await page.goto(URL, { waitUntil: 'load', timeout: 60000 });

    // Wait for the loader to retire, i.e. the first frame is up.
    await page.waitForFunction(
      () => !document.getElementById('loading'),
      { timeout: 60000 },
    ).catch(() => problems.push(`[${viewport.id}] loading overlay never cleared`));

    await page.waitForTimeout(2500);

    // Dismiss onboarding if it is showing.
    const start = page.locator('#obStart');
    if (await start.isVisible().catch(() => false)) await start.click();
    await page.waitForTimeout(400);

    const probe = await page.evaluate(() => {
      const canvas = document.getElementById('canvas');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      return {
        canvas: canvas ? { w: canvas.width, h: canvas.height } : null,
        renderer: gl ? gl.getParameter(gl.VERSION) : null,
        readout: {
          coords: document.getElementById('outCoords')?.textContent,
          elev: document.getElementById('outElev')?.textContent,
          bearing: document.getElementById('outBearing')?.textContent,
          zoom: document.getElementById('outZoom')?.textContent,
          fps: document.getElementById('outFps')?.textContent,
          preset: document.getElementById('outPreset')?.textContent,
        },
        controls: document.querySelectorAll('#studioGroups .control').length,
        layers: document.querySelectorAll('#layerToggles .layer-toggle').length,
        presets: document.querySelectorAll('#presetList .preset-card').length,
        chips: document.querySelectorAll('#quickJumps .chip').length,
        labels: [...document.querySelectorAll('.map-label')]
          .filter((n) => n.style.display !== 'none').length,
        degraded: !document.getElementById('degraded')?.hidden,
        degradedText: document.getElementById('degradedTitle')?.textContent,
      };
    });
    console.log('  probe:', JSON.stringify(probe, null, 2).replace(/\n/g, '\n  '));
    report.push(`[${viewport.id}] probe ${JSON.stringify(probe)}`);

    if (!probe.canvas || probe.canvas.w < 10) {
      problems.push(`[${viewport.id}] canvas has no drawing buffer`);
    }
    if (probe.controls < 15) problems.push(`[${viewport.id}] only ${probe.controls} controls built`);
    if (probe.presets !== 6) problems.push(`[${viewport.id}] ${probe.presets} presets, expected 6`);
    if (probe.degraded) problems.push(`[${viewport.id}] degraded banner shown: ${probe.degradedText}`);

    const shot = (name) => page.screenshot({
      path: path.join(OUT, `${viewport.id}-${name}.png`),
    });

    await shot('01-first-frame');

    // ---- scripted interaction pass ----------------------------------------
    if (!viewport.isMobile) {
      // Presets, via the visible cards.
      for (const [i, id] of ['dawn-delaware', 'schuylkill-flyover', 'wissahickon',
        'main-line-ridge', 'night-metro'].entries()) {
        await page.locator('#presetList .preset-card').nth(i + 1).click();
        await page.waitForTimeout(2400);
        await shot(`02-preset-${id}`);
      }

      await page.locator('#presetList .preset-card').nth(0).click();
      await page.waitForTimeout(2400);

      // Drag to pan, then wheel to zoom.
      const box = await page.locator('#canvas').boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 160, box.y + box.height / 2 + 90,
        { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(700);
      await page.mouse.wheel(0, -600);
      await page.waitForTimeout(900);
      await shot('03-after-drag-zoom');

      // Orbit with the right button.
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down({ button: 'right' });
      await page.mouse.move(box.x + box.width / 2 + 220, box.y + box.height / 2 - 60,
        { steps: 12 });
      await page.mouse.up({ button: 'right' });
      await page.waitForTimeout(800);
      await shot('04-after-orbit');

      // Themes.
      for (const theme of ['slate', 'verdant', 'blueprint', 'noir']) {
        await page.evaluate((t) => {
          const seg = document.getElementById('ctl-theme');
          const btn = [...seg.querySelectorAll('button')]
            .find((b) => b.textContent.toLowerCase().includes(
              { slate: 'slate', verdant: 'verdant', blueprint: 'blueprint', noir: 'night' }[t]));
          btn?.click();
        }, theme);
        await page.waitForTimeout(700);
        await shot(`05-theme-${theme}`);
      }
      await page.evaluate(() => {
        const seg = document.getElementById('ctl-theme');
        seg.querySelectorAll('button')[0].click();
      });
      await page.waitForTimeout(500);

      // Every layer off, then back on.
      await page.evaluate(() => {
        document.querySelectorAll('#layerToggles .layer-toggle').forEach((b) => {
          if (b.getAttribute('aria-pressed') === 'true') b.click();
        });
      });
      await page.waitForTimeout(900);
      await shot('06-layers-off');
      await page.evaluate(() => {
        document.querySelectorAll('#layerToggles .layer-toggle').forEach((b) => {
          if (b.getAttribute('aria-pressed') === 'false' && !b.disabled) b.click();
        });
      });
      await page.waitForTimeout(900);

      // Search.
      await page.fill('#searchInput', 'Manayunk');
      await page.waitForTimeout(400);
      const resultCount = await page.locator('#searchResults li').count();
      report.push(`[${viewport.id}] search "Manayunk" -> ${resultCount} results`);
      if (resultCount < 1) problems.push(`[${viewport.id}] search returned nothing for Manayunk`);
      await page.press('#searchInput', 'Enter');
      await page.waitForTimeout(2400);
      await shot('07-search-manayunk');

      // Flythrough.
      await page.click('#btnPlay');
      await page.waitForTimeout(3000);
      const playing = await page.getAttribute('#btnPlay', 'aria-pressed');
      if (playing !== 'true') problems.push(`[${viewport.id}] play did not start`);
      await shot('08-flythrough');
      // Interacting must interrupt it gracefully.
      await page.mouse.move(box.x + 400, box.y + 400);
      await page.mouse.down();
      await page.mouse.move(box.x + 340, box.y + 430, { steps: 6 });
      await page.mouse.up();
      await page.waitForTimeout(600);
      const afterInterrupt = await page.getAttribute('#btnPlay', 'aria-pressed');
      if (afterInterrupt !== 'false') {
        problems.push(`[${viewport.id}] dragging did not pause the flythrough`);
      }
      report.push(`[${viewport.id}] flythrough interrupt ok`);

      // Dialogs.
      await page.click('#btnAbout');
      await page.waitForTimeout(500);
      await shot('09-about');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // URL state round-trip.
      await page.waitForTimeout(600);
      const hash = await page.evaluate(() => window.location.hash);
      report.push(`[${viewport.id}] hash: ${hash.slice(0, 160)}`);
      if (hash.length < 2) problems.push(`[${viewport.id}] no URL state was written`);
    } else {
      await page.locator('#studioToggle').click();
      await page.waitForTimeout(600);
      await shot('02-studio-open');
      await page.locator('#studioToggle').click();
      await page.waitForTimeout(400);

      const box = await page.locator('#canvas').boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
      await shot('03-touch');
    }

    // Degraded mode: block the heightmap and confirm the app still comes up.
    const degradedPage = await context.newPage();
    const degradedProblems = [];
    degradedPage.on('pageerror', (err) => degradedProblems.push(err.message));
    await degradedPage.route('**/heightmap.webp', (route) => route.abort());
    await degradedPage.goto(URL, { waitUntil: 'load', timeout: 60000 });
    await degradedPage.waitForTimeout(4000);
    const degraded = await degradedPage.evaluate(() => ({
      shown: !document.getElementById('degraded')?.hidden,
      title: document.getElementById('degradedTitle')?.textContent,
      canvas: document.getElementById('canvas')?.width,
      controls: document.querySelectorAll('#studioGroups .control').length,
    }));
    console.log('  degraded:', JSON.stringify(degraded));
    report.push(`[${viewport.id}] degraded ${JSON.stringify(degraded)}`);
    if (!degraded.shown) problems.push(`[${viewport.id}] degraded banner did not appear`);
    if (!degraded.canvas) problems.push(`[${viewport.id}] degraded mode rendered no canvas`);
    if (degradedProblems.length) {
      problems.push(`[${viewport.id}] degraded mode threw: ${degradedProblems.join('; ')}`);
    }
    await degradedPage.screenshot({ path: path.join(OUT, `${viewport.id}-10-degraded.png`) });
    await degradedPage.close();

    const errors = logs.filter((l) => l.type === 'error');
    console.log(`  console errors: ${errors.length}`);
    for (const e of errors) console.log(`    ${e.text}`);

    await context.close();
  }

  await browser.close();

  await writeFile(path.join(OUT, 'report.txt'),
    `${report.join('\n')}\n\nPROBLEMS:\n${problems.join('\n') || 'none'}\n`);

  console.log(`\n${'='.repeat(60)}`);
  if (problems.length) {
    console.log(`FAILED — ${problems.length} problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exitCode = 1;
  } else {
    console.log('PASSED — no console errors, no page errors, all probes ok.');
  }
  console.log(`screenshots: ${OUT}`);
}

run().catch((error) => {
  console.error('QA harness crashed:', error);
  process.exitCode = 1;
});
