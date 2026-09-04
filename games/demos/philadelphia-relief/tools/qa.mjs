/**
 * Browser QA harness.
 *
 * Loads the map in headless Chrome with the GPU enabled (SwiftShader falls
 * back automatically), records every console message and page error, drives a
 * scripted interaction pass, and writes screenshots for visual review.
 *
 *   node tools/qa.mjs [--url http://127.0.0.1:8731/games/demos/philadelphia-relief/] [--keep]
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

const URL = argOf('--url', 'http://127.0.0.1:8731/games/demos/philadelphia-relief/');
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

    // No visible label may cross the viewport edge; a truncated name is worse
    // than an absent one. 1px tolerance for rounding.
    const clipped = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return [...document.querySelectorAll('.map-label')]
        .filter((n) => n.style.display !== 'none')
        .map((n) => ({ t: n.textContent, ...n.getBoundingClientRect().toJSON() }))
        .filter((r) => r.left < -1 || r.right > vw + 1 || r.top < -1 || r.bottom > vh + 1)
        .map((r) => `${r.t} [${Math.round(r.left)}..${Math.round(r.right)}]`);
    });
    if (clipped.length) {
      problems.push(`[${viewport.id}] labels cross the viewport edge: ${clipped.join(', ')}`);
    }
    report.push(`[${viewport.id}] label edge check: ${clipped.length} clipped`);

    if (!probe.canvas || probe.canvas.w < 10) {
      problems.push(`[${viewport.id}] canvas has no drawing buffer`);
    }
    if (probe.controls < 15) problems.push(`[${viewport.id}] only ${probe.controls} controls built`);
    if (probe.presets !== 8) problems.push(`[${viewport.id}] ${probe.presets} presets, expected 8`);

    // The clean first load must show the city, not hide it 94 km away: a
    // substantial building count on the first frame, on both viewports.
    const first = await page.evaluate(() => window.philadelphiaRelief?.stats() || null);
    const firstHash = await page.evaluate(() => window.location.hash);
    report.push(`[${viewport.id}] first frame: preset "${probe.readout.preset}", hash "${firstHash}", `
      + `buildings ${first?.structures?.drawnBuildings}, tiers ${JSON.stringify(first?.structureTiers)}`);
    if (probe.readout.preset !== 'Philadelphia Skyline') {
      problems.push(`[${viewport.id}] first load opens on "${probe.readout.preset}", not the skyline`);
    }
    const minFirst = viewport.isMobile ? 1500 : 2500;
    if (!(first?.structures?.drawnBuildings >= minFirst)) {
      problems.push(`[${viewport.id}] first frame draws ${first?.structures?.drawnBuildings} buildings, want >= ${minFirst}`);
    }
    if (!first?.structureTiers?.some((t) => t.endsWith('/low'))) {
      problems.push(`[${viewport.id}] first frame has no rowhouse tier loaded at balanced quality`);
    }
    if (probe.degraded) problems.push(`[${viewport.id}] degraded banner shown: ${probe.degradedText}`);

    const shot = (name) => page.screenshot({
      path: path.join(OUT, `${viewport.id}-${name}.png`),
    });

    await shot('01-first-frame');

    // ---- scripted interaction pass ----------------------------------------
    if (!viewport.isMobile) {
      // Presets, via the visible cards, by name.
      for (const [id, name] of [['ben-franklin-bridge', 'Benjamin Franklin Bridge'],
        ['overview', 'The Delaware Valley'], ['dawn-delaware', 'Dawn over the Delaware'],
        ['schuylkill-flyover', 'Schuylkill Flyover'], ['wissahickon', 'Wissahickon Valley'],
        ['main-line-ridge', 'Main Line Ridge'], ['night-metro', 'Night Metro']]) {
        await page.locator('#presetList .preset-card', { hasText: name }).click();
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

      // Landmark card: searching a landmark opens its card, which names its
      // sources and says whether the model is schematic; Esc closes it.
      await page.fill('#searchInput', 'Independence Hall');
      await page.waitForTimeout(400);
      await page.press('#searchInput', 'Enter');
      await page.waitForTimeout(2600);
      if (await page.evaluate(() => document.body.classList.contains('sheet-open'))) {
        await page.locator('#mbShots').click();
        await page.waitForTimeout(500);
      }
      const cardInfo = await page.evaluate(() => {
        const el = document.getElementById('card');
        const r = el.getBoundingClientRect();
        return {
          hidden: el.hidden, display: getComputedStyle(el).display,
          title: document.getElementById('cardTitle')?.textContent,
          links: [...el.querySelectorAll('#cardSources a')].map((a) => a.href),
          note: document.getElementById('cardNote')?.textContent,
          facts: el.querySelectorAll('#cardFacts dt').length,
          inside: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
          rect: [r.left, r.top, r.right, r.bottom].map(Math.round),
          stats: window.philadelphiaRelief.stats(),
        };
      });
      if (cardInfo.hidden || cardInfo.display === 'none' || cardInfo.title !== 'Independence Hall') {
        problems.push(`[${viewport.id}] landmark card did not open from search: ${JSON.stringify(cardInfo)}`);
      }
      const goodLink = (h) => /^https:\/\/(en\.wikipedia\.org|www\.openstreetmap\.org)\//.test(h);
      if (!cardInfo.links.length || !cardInfo.links.every(goodLink)) {
        problems.push(`[${viewport.id}] card sources missing or off-list: ${cardInfo.links}`);
      }
      if (cardInfo.note !== 'Schematic model' || cardInfo.facts < 2) {
        problems.push(`[${viewport.id}] card lacks its schematic note or facts: ${cardInfo.note}/${cardInfo.facts}`);
      }
      if (!cardInfo.inside) problems.push(`[${viewport.id}] card is clipped: ${cardInfo.rect}`);
      if (cardInfo.stats.card !== 'Independence Hall' || cardInfo.stats.landmarkModels < 7) {
        problems.push(`[${viewport.id}] card state not reflected: ${JSON.stringify(cardInfo.stats)}`);
      }
      report.push(`[${viewport.id}] card "${cardInfo.title}" (${cardInfo.note}, ${cardInfo.facts} facts, `
        + `${cardInfo.links.length} sources), ${cardInfo.stats.landmarkModels} landmark models`);
      await shot('07b-landmark-card');
      await page.click('#cardFly');
      await page.waitForTimeout(2600);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const cardClosed = await page.evaluate(() => ({
        hidden: document.getElementById('card').hidden, card: window.philadelphiaRelief.stats().card }));
      if (!cardClosed.hidden || cardClosed.card !== null) {
        problems.push(`[${viewport.id}] Esc did not close the card: ${JSON.stringify(cardClosed)}`);
      }

      // Guided tour: play, and the caption must be up and read a real shot.
      await page.click('#btnPlay');
      await page.waitForTimeout(3000);
      const playing = await page.getAttribute('#btnPlay', 'aria-pressed');
      if (playing !== 'true') problems.push(`[${viewport.id}] play did not start`);
      const cap = await page.evaluate(() => {
        const el = document.getElementById('caption');
        return { hidden: el?.hidden, title: document.getElementById('captionTitle')?.textContent,
          source: document.getElementById('captionSource')?.textContent };
      });
      if (cap.hidden || !cap.title) problems.push(`[${viewport.id}] tour caption not shown while playing`);
      if (!/Source:/.test(cap.source || '')) problems.push(`[${viewport.id}] caption has no source line`);
      report.push(`[${viewport.id}] tour caption: "${cap.title}"`);
      await shot('08-flythrough');
      // Interacting must interrupt it gracefully — and the drag deliberately
      // starts on a map label, which is what a finger lands on over the
      // skyline. Labels are buttons; they must not swallow the gesture.
      const labelBox = await page.evaluate(() => {
        const el = [...document.querySelectorAll('.map-label')]
          .find((n) => n.style.display !== 'none');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: el.textContent };
      });
      const start = labelBox || { x: box.x + 400, y: box.y + 400 };
      report.push(`[${viewport.id}] interrupt drag starts on ${labelBox ? `label "${labelBox.text}"` : 'bare canvas'}`);
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(start.x - 60, start.y + 30, { steps: 6 });
      await page.mouse.up();
      await page.waitForTimeout(600);
      const afterInterrupt = await page.getAttribute('#btnPlay', 'aria-pressed');
      if (afterInterrupt !== 'false') {
        problems.push(`[${viewport.id}] dragging did not pause the flythrough`);
      }
      report.push(`[${viewport.id}] flythrough interrupt ok`);

      // A clean click on a label still flies to it: lazy capture must not have
      // stolen the label's click.
      const target = await page.evaluate(() => {
        const el = [...document.querySelectorAll('.map-label')]
          .find((n) => n.style.display !== 'none' && n.dataset.kind === 'landmark');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: el.textContent };
      });
      if (target) {
        const before = await page.evaluate(() => document.getElementById('outCoords')?.textContent);
        await page.mouse.click(target.x, target.y);
        await page.waitForTimeout(2600);
        const after = await page.evaluate(() => document.getElementById('outCoords')?.textContent);
        if (before === after) problems.push(`[${viewport.id}] clicking label "${target.text}" did not fly there`);
        report.push(`[${viewport.id}] label click "${target.text}": ${before} -> ${after}`);
      }

      // Switching tours: the crossings tour must caption a bridge, and the
      // step button must advance to the next captioned shot.
      await page.selectOption('#tourSelect', 'crossings');
      await page.click('#btnPlay');
      await page.waitForTimeout(2500);
      const bridgeCap = await page.evaluate(() => document.getElementById('captionTitle')?.textContent);
      if (!/Bridge/.test(bridgeCap || '')) problems.push(`[${viewport.id}] crossings tour caption "${bridgeCap}"`);
      await page.click('#btnNextShot');
      await page.waitForTimeout(1800);
      const nextCap = await page.evaluate(() => document.getElementById('captionTitle')?.textContent);
      if (nextCap === bridgeCap) problems.push(`[${viewport.id}] next-shot did not change the caption`);
      report.push(`[${viewport.id}] crossings tour: "${bridgeCap}" -> "${nextCap}"`);
      await shot('17-tour-crossings-caption');
      await page.keyboard.press('Escape');
      await page.selectOption('#tourSelect', 'grand');
      await page.waitForTimeout(400);

      // Cinema mode hides every panel, keeps the caption, and exits on Escape.
      await page.click('#btnPlay');
      await page.waitForTimeout(600);
      await page.keyboard.press('v');
      await page.waitForTimeout(3200);
      const cinema = await page.evaluate(() => {
        const vis = (id) => {
          const el = document.getElementById(id);
          return !!el && getComputedStyle(el).display !== 'none';
        };
        return { studio: vis('studio'), shots: vis('shots'), readout: vis('readout'),
          topbar: getComputedStyle(document.querySelector('.topbar')).display !== 'none',
          caption: vis('caption') && !document.getElementById('caption').hidden,
          bar: vis('cinemaBar'), body: document.body.classList.contains('cinema') };
      });
      if (!cinema.body || cinema.studio || cinema.shots || cinema.readout || cinema.topbar) {
        problems.push(`[${viewport.id}] cinema mode left chrome visible: ${JSON.stringify(cinema)}`);
      }
      if (!cinema.caption) problems.push(`[${viewport.id}] cinema mode lost the caption`);
      if (!cinema.bar) problems.push(`[${viewport.id}] cinema controls missing`);
      report.push(`[${viewport.id}] cinema: ${JSON.stringify(cinema)}`);
      await shot('18-cinema');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const back = await page.evaluate(() => document.body.classList.contains('cinema'));
      if (back) problems.push(`[${viewport.id}] Escape did not leave cinema mode`);
      await page.keyboard.press('Escape');   // stop the tour
      await page.waitForTimeout(300);

      // Dialogs.
      await page.click('#btnAbout');
      await page.waitForTimeout(500);
      await shot('09-about');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // URL state round-trip: nudge the camera off the default view first,
      // since the tour above legitimately leaves the state at the defaults.
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, -400);
      await page.waitForTimeout(1200);
      const hash = await page.evaluate(() => window.location.hash);
      report.push(`[${viewport.id}] hash: ${hash.slice(0, 160)}`);
      if (hash.length < 2) problems.push(`[${viewport.id}] no URL state was written`);
    } else {
      const barVisible = await page.evaluate(() =>
        getComputedStyle(document.getElementById('mobileBar')).display !== 'none');
      if (!barVisible) problems.push(`[${viewport.id}] phone toolbar not shown`);
      await page.locator('#mbStudio').click();
      await page.waitForTimeout(600);
      const studioOpen = await page.evaluate(() =>
        !document.getElementById('studio').classList.contains('collapsed'));
      if (!studioOpen) problems.push(`[${viewport.id}] toolbar did not open the studio`);
      await shot('02-studio-open');
      await page.locator('#mbStudio').click();
      await page.waitForTimeout(400);
      await page.locator('#mbShots').click();
      await page.waitForTimeout(500);
      await shot('02b-shots-open');
      await page.locator('#mbShots').click();
      await page.waitForTimeout(400);

      await page.locator('#mbPlay').click();
      await page.waitForTimeout(500);
      await page.locator('#mbCinema').click();
      await page.waitForTimeout(3000);
      const pc = await page.evaluate(() => ({
        body: document.body.classList.contains('cinema'),
        bar: getComputedStyle(document.getElementById('mobileBar')).display === 'none',
        caption: !document.getElementById('caption').hidden,
      }));
      if (!pc.body || !pc.bar || !pc.caption) problems.push(`[${viewport.id}] phone cinema: ${JSON.stringify(pc)}`);
      await shot('18-cinema');
      await page.locator('#cinemaExit').click();
      await page.waitForTimeout(400);
      await page.locator('#mbPlay').click();   // pause
      await page.waitForTimeout(300);

      const box = await page.locator('#canvas').boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
      await shot('03-touch');
    }

    // ---- structures layer -------------------------------------------------
    await structuresPass(page, viewport, shot, problems, report);

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

/**
 * Prove the buildings-and-bridges layer: it draws at the skyline, at each of
 * the four required crossings, in the night shot and on a phone; the toggle
 * empties it; performance mode never loads the rowhouse tier; and draw calls
 * stay bounded throughout.
 */
async function structuresPass(page, viewport, shot, problems, report) {
  const stats = () => page.evaluate(() => window.philadelphiaRelief?.stats() || null);
  const goto = async (hash, settle = 3600) => {
    await page.evaluate((h) => { window.location.hash = h; }, hash);
    await page.waitForTimeout(settle);
  };
  const bridges = await page.evaluate(async () => {
    const r = await fetch('data/structures/bridges.json');
    return (await r.json()).bridges.map((b) => {
      const a = b.centerline[0];
      const z = b.centerline[b.centerline.length - 1];
      const mid = [(a[0] + z[0]) / 2, (a[1] + z[1]) / 2];
      const bearing = (Math.atan2(z[0] - a[0], z[1] - a[1]) * 180 / Math.PI + 360) % 360;
      return { id: b.id, name: b.name, lon: mid[0], lat: mid[1], bearing: Math.round(bearing) };
    });
  }).catch(() => []);
  if (bridges.length < 4) problems.push(`[${viewport.id}] bridges.json has ${bridges.length} bridges`);

  const views = [
    { id: 'skyline', hash: '#x=-75.1655&y=39.9505&d=6500&b=32&p=73&Lx=1', minBuildings: 500 },
    { id: 'sports-complex', hash: '#x=-75.167&y=39.9045&d=5200&b=15&p=71&Lx=1', minBuildings: 40 },
  ];
  for (const b of bridges) {
    if (['benjamin-franklin', 'walt-whitman', 'betsy-ross', 'tacony-palmyra'].includes(b.id)) {
      views.push({ id: `bridge-${b.id}`, minBuildings: 0,
        // Look back along the span with the sun behind the camera, so the
        // frame shows the structure rather than the glint off the river.
        hash: `#x=${b.lon.toFixed(4)}&y=${b.lat.toFixed(4)}&d=3800&b=${(b.bearing + 215) % 360}&p=75&Lx=1` });
    }
  }
  if (viewport.isMobile) views.splice(1);   // the phone proves the skyline only

  for (const view of views) {
    await goto(view.hash);
    const s = await stats();
    if (!s?.structures) {
      problems.push(`[${viewport.id}] ${view.id}: no structure stats`);
      continue;
    }
    report.push(`[${viewport.id}] ${view.id}: buildings ${s.structures.drawnBuildings}, `
      + `structure calls ${s.structures.drawCalls}, total calls ${s.drawCalls}, `
      + `tris ${s.triangles}, tiers ${JSON.stringify(s.structures.tiers)}`);
    if (s.structures.drawnBuildings < view.minBuildings) {
      problems.push(`[${viewport.id}] ${view.id}: only ${s.structures.drawnBuildings} buildings drawn`);
    }
    if (s.structures.drawCalls > 10) {
      problems.push(`[${viewport.id}] ${view.id}: ${s.structures.drawCalls} structure draw calls`);
    }
    if (s.drawCalls > 40) problems.push(`[${viewport.id}] ${view.id}: ${s.drawCalls} total draw calls`);
    await shot(`11-structures-${view.id}`);
  }

  // Night shot with structures (preset 8).
  if (!viewport.isMobile) {
    await page.keyboard.press('8');
    await page.waitForTimeout(3200);
    await shot('12-structures-night');
  }

  // ---- the routes a user actually sees: the bridge card and the chips ----
  // Flights are time-based but the per-frame step is capped, so under a
  // software renderer a 1.9 s flight can take four. Wait for the readout to
  // stop moving instead of guessing a duration.
  const settle = async (maxMs = 14000) => {
    let prev = null;
    let still = 0;
    const t0 = Date.now();
    while (Date.now() - t0 < maxMs) {
      await page.waitForTimeout(350);
      const cur = await page.evaluate(() => document.getElementById('outCoords')?.textContent || '');
      still = cur === prev ? still + 1 : 0;
      prev = cur;
      if (still >= 2) break;
    }
  };
  const readoutNear = async (lat, lon, label) => {
    await settle();
    const text = await page.evaluate(() => document.getElementById('outCoords')?.textContent || '');
    const m = /([\d.]+)° N, ([\d.]+)° W/.exec(text);
    const ok = m && Math.abs(Number(m[1]) - lat) < 0.012 && Math.abs(Number(m[2]) + lon) < 0.012;
    if (!ok) problems.push(`[${viewport.id}] ${label}: readout "${text}" is not near ${lat},${-lon}`);
    return ok;
  };
  const openSheet = async () => {
    if (!viewport.isMobile) return;
    const collapsed = await page.evaluate(() => document.getElementById('shots').classList.contains('collapsed'));
    if (collapsed) { await page.locator('#mbShots').click(); await page.waitForTimeout(500); }
  };
  const closeSheet = async () => {
    if (!viewport.isMobile) return;
    const open = await page.evaluate(() => !document.getElementById('shots').classList.contains('collapsed'));
    if (open) { await page.locator('#mbShots').click(); await page.waitForTimeout(400); }
  };

  await openSheet();
  await page.locator('#presetList .preset-card', { hasText: 'Benjamin Franklin Bridge' }).click();
  await closeSheet();
  await readoutNear(39.9519, -75.1285, 'Benjamin Franklin Bridge card');
  const bfb = await stats();
  if (!(bfb?.structures?.drawnBuildings > 0) || !(bfb?.bridges?.length >= 4)) {
    problems.push(`[${viewport.id}] bridge preset shows no structures: ${JSON.stringify(bfb?.structures)}`);
  }
  await shot('14-route-ben-franklin-card');

  const chips = viewport.isMobile
    ? [['Walt Whitman Bridge', 39.9052, -75.1293]]
    : [['Walt Whitman Bridge', 39.9052, -75.1293], ['Betsy Ross Bridge', 39.9848, -75.0659],
      ['Tacony-Palmyra Bridge', 40.0123, -75.0432], ['Commodore Barry Bridge', 39.8265, -75.3697],
      ['Sports Complex', 39.9045, -75.167]];
  for (const [name, lat, lon] of chips) {
    await openSheet();
    const chip = page.locator('#structureJumps .chip', { hasText: name });
    if (await chip.count() !== 1) { problems.push(`[${viewport.id}] chip "${name}" missing`); continue; }
    await chip.click();
    await closeSheet();
    await readoutNear(lat, lon, `${name} chip`);
    if (name === 'Walt Whitman Bridge' || name === 'Sports Complex') {
      await shot(`15-route-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`);
    }
  }

  // Home returns to the opening skyline.
  await page.locator('#btnHome').click();
  await readoutNear(39.9505, -75.1655, 'Home button');
  const home = await stats();
  if (!(home?.structures?.drawnBuildings >= (viewport.isMobile ? 1500 : 2500))) {
    problems.push(`[${viewport.id}] Home shows only ${home?.structures?.drawnBuildings} buildings`);
  }
  await shot('16-route-home');

  // Clicking a schematic model (a press that neither moves nor lingers)
  // opens its card. Independence Hall sits at the orbit target, so the
  // screen centre is on it.
  await goto('#x=-75.15&y=39.9489&d=2200&b=20&p=62', 2000);
  const centre = await page.evaluate(() => {
    const r = document.getElementById('stage').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.click(centre.x, centre.y);
  await page.waitForTimeout(500);
  const picked = await page.evaluate(() => ({
    card: window.philadelphiaRelief.stats().card, hidden: document.getElementById('card').hidden }));
  if (picked.card !== 'Independence Hall' || picked.hidden) {
    problems.push(`[${viewport.id}] clicking the Independence Hall model did not open its card: `
      + JSON.stringify(picked));
  }
  // The card must sit inside the viewport and clear of the phone toolbar.
  const cardBox = await page.evaluate(() => {
    const r = document.getElementById('card').getBoundingClientRect();
    const bar = document.getElementById('mobileBar');
    const b = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect() : null;
    return { rect: [r.left, r.top, r.right, r.bottom].map(Math.round), w: innerWidth, h: innerHeight,
      inside: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
      clearOfBar: !b || r.bottom <= b.top + 1 };
  });
  if (!cardBox.inside || !cardBox.clearOfBar) {
    problems.push(`[${viewport.id}] card is clipped or under the toolbar: ${JSON.stringify(cardBox)}`);
  }
  report.push(`[${viewport.id}] model click -> card "${picked.card}" at ${cardBox.rect}`);
  await shot('17-landmark-model-click');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // The toggle must empty the layer.
  await goto('#x=-75.1655&y=39.9505&d=6500&b=32&p=73&Lx=0', 1500);
  const off = await stats();
  if (off?.structures?.drawnBuildings !== 0 || off?.structures?.drawCalls !== 0) {
    problems.push(`[${viewport.id}] structures toggle off still draws ${JSON.stringify(off?.structures)}`);
  }
  const before = off?.drawCalls ?? 0;
  await goto('#x=-75.1655&y=39.9505&d=6500&b=32&p=73&Lx=1', 1500);
  const on = await stats();
  if (!(on?.drawCalls > before)) problems.push(`[${viewport.id}] toggling structures on did not add draw calls`);

  // Performance mode: no rowhouse tier, capped fraction.
  await goto('#x=-75.1655&y=39.9505&d=6500&b=32&p=73&Lx=1&q=performance', 4500);
  const perf = await stats();
  if (perf?.structureTiers?.some((t) => t.endsWith('/low'))) {
    problems.push(`[${viewport.id}] performance mode loaded the low tier: ${perf.structureTiers}`);
  }
  if (perf?.structures && perf.structures.fraction > 0.7) {
    problems.push(`[${viewport.id}] performance fraction ${perf.structures.fraction} > 0.7`);
  }
  report.push(`[${viewport.id}] performance: tiers ${JSON.stringify(perf?.structureTiers)}, `
    + `buildings ${perf?.structures?.drawnBuildings}, calls ${perf?.drawCalls}`);
  await shot('13-structures-performance');
  await goto('#', 800);
}

run().catch((error) => {
  console.error('QA harness crashed:', error);
  process.exitCode = 1;
});
