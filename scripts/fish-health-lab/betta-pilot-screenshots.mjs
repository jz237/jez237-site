// 390 px screenshots of the betta pilot for review (local preview only).
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const output = process.env.FISH_LAB_QA_DIR || '/home/jez237/.openclaw/workspace/.openclaw/tmp/fhl-v2/betta-pilot';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const next = () => page.locator('#next-button').click();
const settle = () => page.locator('img:visible').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
const shot = async name => { await settle(); await page.screenshot({ path: `${output}/${name}.png`, fullPage: true }); };
const toSigns = async fish => {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator('input[name="water"][value="fresh"]').check(); await next();
  await page.locator(`input[name="fishType"][value="${fish}"]`).check(); await next();
};
const result = async (fish, sign) => {
  await toSigns(fish);
  await page.locator(`[data-symptom="${sign}"]`).click(); await next(); await next();
  await page.locator('#results-title').waitFor();
};
try {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator('input[name="water"][value="fresh"]').check(); await next();
  await page.locator('input[name="fishType"][value="betta"]').check();
  await shot('1-fish-type');
  await next(); await shot('2-betta-symptoms');
  await result('betta', 'fins'); await shot('3-betta-fin-rot');
  await result('betta', 'dust'); await shot('4-betta-velvet');
  await result('goldfish', 'fins'); await shot('5-goldfish-fin-rot');
} finally { await browser.close(); }
if (errors.length) { console.error(errors); process.exit(1); }
console.log(`Saved screenshots to ${output}`);
