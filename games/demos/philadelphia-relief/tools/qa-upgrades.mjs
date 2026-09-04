/** Focused browser proof for the imagery, comparison and inspection upgrades. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const URL = argOf('--url', 'http://127.0.0.1:8731/games/demos/philadelphia-relief/');
const OUT = argOf('--out', '/tmp/philly-upgrades-qa');
const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
const views = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'phone', width: 390, height: 844, isMobile: true },
];
const problems = [];

function check(ok, message) {
  if (!ok) problems.push(message);
}

async function clickOption(page, control, text) {
  const clicked = await page.evaluate(({ controlId, label }) => {
    const button = [...document.querySelectorAll(`#ctl-${controlId} button`)]
      .find((candidate) => candidate.textContent.includes(label));
    button?.click();
    return !!button;
  }, { controlId: control, label: text });
  check(clicked, `control option missing: ${control} / ${text}`);
}

const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist', '--enable-webgl'],
});
await mkdir(OUT, { recursive: true });

for (const view of views) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 1,
    isMobile: !!view.isMobile,
    hasTouch: !!view.isMobile,
  });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error' && !/analytics\.google\.com/.test(message.text())) {
      problems.push(`[${view.id}] console: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => problems.push(`[${view.id}] page: ${error.message}`));

  await page.goto(`${URL}#q=balanced&x=-75.1636&y=39.9526&d=1&p=0&b=0&id=maximum`,
    { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !document.getElementById('loading'), { timeout: 60000 });
  if (await page.locator('#obStart').isVisible().catch(() => false)) {
    await page.locator('#obStart').click();
  }
  const rooftop = await page.waitForFunction(() => {
    const detail = window.philadelphiaRelief?.stats().imagery.detail;
    return detail?.state === 'active' && detail.tier === 'rooftop' ? detail : null;
  }, { timeout: 60000 }).then((handle) => handle.jsonValue()).catch(() => null);
  const floorPose = await page.evaluate(() => window.philadelphiaRelief?.stats().camera);
  check(rooftop && rooftop.size === 4096 && rooftop.resolutionM < 0.3
    && floorPose?.dist >= 179 && floorPose.dist <= 181,
    `[${view.id}] maximum roof detail missing: ${JSON.stringify(rooftop)}`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-01-rooftop.png`) });

  await clickOption(page, 'imageryDetail', 'Data Saver');
  const saver = await page.waitForFunction(() => {
    const detail = window.philadelphiaRelief?.stats().imagery.detail;
    return detail?.state === 'active' && detail.tier === 'detail' && detail.size === 2048
      ? detail : null;
  }, { timeout: 60000 }).then((handle) => handle.jsonValue()).catch(() => null);
  check(!!saver, `[${view.id}] Data Saver did not fall back to city detail`);

  await clickOption(page, 'compareMode', 'Aerial / relief');
  await page.locator('#compareSlider').fill('36');
  await page.waitForTimeout(500);
  let compare = await page.evaluate(() => ({
    hidden: document.getElementById('compareBar').hidden,
    left: document.getElementById('compareLeft').textContent,
    right: document.getElementById('compareRight').textContent,
    hash: location.hash,
  }));
  check(!compare.hidden && compare.left === 'Aerial' && compare.right === 'Relief'
    && /cm=aerial/.test(compare.hash) && /cp=0\.36/.test(compare.hash),
  `[${view.id}] aerial comparison state failed: ${JSON.stringify(compare)}`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-02-aerial-compare.png`) });

  await clickOption(page, 'compareMode', 'Present / selected era');
  await page.waitForTimeout(700);
  compare = await page.evaluate(() => ({
    stats: window.philadelphiaRelief.stats(),
    banner: document.getElementById('eraBanner').textContent,
    labels: [document.getElementById('compareLeft').textContent,
      document.getElementById('compareRight').textContent],
  }));
  check(compare.stats.era.id === 'industrial' && compare.stats.imagery.visible === false
    && /Modern aerial photography is hidden/.test(compare.banner)
    && compare.labels[0] === 'Present aerial',
  `[${view.id}] historical comparison failed: ${JSON.stringify(compare)}`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-03-history-compare.png`) });

  await clickOption(page, 'compareMode', 'Normal / flood');
  const flood = await page.waitForFunction(() => {
    const stats = window.philadelphiaRelief?.stats();
    return stats?.flood?.loaded?.includes('fema') && stats.flood.visible.length
      ? stats.flood : null;
  }, { timeout: 60000 }).then((handle) => handle.jsonValue()).catch(() => null);
  check(!!flood, `[${view.id}] flood comparison did not load`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-04-flood-compare.png`) });
  const closeHit = await page.evaluate(() => {
    const button = document.getElementById('compareClose');
    const rect = button.getBoundingClientRect();
    return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) === button;
  });
  check(closeHit, `[${view.id}] comparison close button is covered`);
  await page.evaluate(() => document.getElementById('compareClose').click());

  await clickOption(page, 'era', 'Present');
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('#layerToggles .layer-toggle')]
      .find((candidate) => candidate.textContent.includes('3D buildings & bridges'));
    if (button?.getAttribute('aria-pressed') !== 'true') button?.click();
  });
  await page.waitForTimeout(1200);
  const hybrid = await page.evaluate(() => window.philadelphiaRelief.stats().structures);
  check(hybrid?.drawnBuildings > 500, `[${view.id}] hybrid buildings did not draw`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-05-hybrid.png`) });

  await page.evaluate(() => { location.hash = '#q=balanced&x=-75.1636&y=39.9526&d=1800&b=0&p=0'; });
  await page.waitForTimeout(2600);
  const centre = await page.locator('#canvas').boundingBox();
  await page.mouse.click(centre.x + centre.width / 2, centre.y + centre.height / 2);
  await page.waitForTimeout(500);
  const picked = await page.evaluate(() => {
    const card = document.getElementById('card');
    const rect = card.getBoundingClientRect();
    return {
      selected: window.philadelphiaRelief.stats().buildingSelection,
      title: document.getElementById('cardTitle').textContent,
      facts: document.getElementById('cardFacts').textContent,
      hidden: card.hidden,
      inside: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  check(picked.selected && picked.title === 'Selected building' && !picked.hidden
    && /Not included/.test(picked.facts) && picked.inside && !picked.overflow,
  `[${view.id}] building inspection failed: ${JSON.stringify(picked)}`);
  const roofButton = await page.locator('#cardFly').textContent();
  check(roofButton === 'Zoom to roof', `[${view.id}] roof zoom action missing: ${roofButton}`);
  await clickOption(page, 'imageryDetail', 'Maximum Detail');
  await page.locator('#cardFly').click();
  const roofPose = await page.waitForFunction(() => {
    const stats = window.philadelphiaRelief?.stats();
    return stats?.camera?.dist <= 600 && stats.imagery.detail?.tier === 'rooftop'
      && stats.imagery.detail.state === 'active' ? stats : null;
  }, { timeout: 60000 }).then((handle) => handle.jsonValue()).catch(() => null);
  check(roofPose?.camera?.dist <= 600 && roofPose.imagery.detail.resolutionM < 0.3,
    `[${view.id}] building roof flight failed: ${JSON.stringify(roofPose)}`);
  const mapBox = await page.locator('#canvas').boundingBox();
  await page.mouse.move(mapBox.x + mapBox.width / 2, mapBox.y + mapBox.height / 2);
  for (let i = 0; i < 4; i += 1) await page.mouse.wheel(0, -1200);
  const manualFloor = await page.waitForFunction(() => {
    const camera = window.philadelphiaRelief?.stats().camera;
    return camera?.dist <= 181 ? camera : null;
  }, { timeout: 10000 }).then((handle) => handle.jsonValue()).catch(() => null);
  check(manualFloor?.dist >= 179 && manualFloor.dist <= 181,
    `[${view.id}] wheel zoom did not reach the 180 m floor: ${JSON.stringify(manualFloor)}`);
  await page.screenshot({ path: path.join(OUT, `${view.id}-06-building-card.png`) });
  await context.close();
}

await browser.close();
if (problems.length) {
  console.error(`FAILED — ${problems.length} problem(s)\n  - ${problems.join('\n  - ')}`);
  process.exitCode = 1;
} else {
  console.log('PASSED — rooftop detail, data modes, comparisons, hybrid buildings and inspection.');
}
console.log(`screenshots: ${OUT}`);
