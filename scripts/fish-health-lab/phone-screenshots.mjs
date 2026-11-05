// Phone-size (390 px) screenshots of the main v2 flows for layout review.
// Run against a local server only (the live site injects analytics).
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const output = process.env.FISH_LAB_QA_DIR || '/home/jez237/.openclaw/workspace/.openclaw/tmp/fhl-v2';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
const page = await context.newPage();
page.on('pageerror', e => errors.push(e.message));
const next = () => page.locator('#next-button').click();
const settle = async () => { await page.locator('img:visible').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {})))); };
const shot = async name => { await settle(); await page.screenshot({ path: `${output}/${name}.png`, fullPage: true }); };
const flow = async ({ water, fish, sign, texture, closer, growth, behaviors = [] }) => {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator(`input[name="water"][value="${water}"]`).check(); await next();
  if (fish) await page.locator(`input[name="fishType"][value="${fish}"]`).check();
  await next();
  await page.locator(`[data-symptom="${sign}"]`).click(); await next();
  if (texture) { await page.locator(`[data-texture="${texture}"]`).click(); await next(); }
  if (closer) { await page.locator(`input[name="closer"][value="${closer}"]`).check(); await next(); }
  for (const b of behaviors) await page.locator(`input[name="behavior"][value="${b}"]`).check();
  await next();
  if (growth) { await page.locator(`input[name="growthAppearance"][value="${growth}"]`).check(); await next(); }
  await page.locator('#results-title').waitFor();
};
try {
  await page.goto(root, { waitUntil: 'networkidle' });
  await shot('1-start');
  await page.locator('[data-action="start"]:visible').click();
  await page.locator('input[name="water"][value="fresh"]').check(); await next();
  await page.locator('input[name="fishType"][value="betta"]').check();
  await shot('2-fish-type');
  await flow({ water: 'fresh', fish: 'betta', sign: 'dots', texture: 'dots' }); await shot('3-fresh-ich-betta');
  await flow({ water: 'marine', fish: 'clownfish', sign: 'patch', closer: 'slime' }); await shot('4-marine-brooklynella-clownfish');
  await flow({ water: 'fresh', fish: 'betta', sign: 'fins' }); await shot('5-fin-rot');
  await flow({ water: 'fresh', fish: 'goldfish', sign: 'balance' }); await shot('6-swim-bladder-goldfish');
} finally { await browser.close(); }
if (errors.length) { console.error(errors); process.exit(1); }
console.log(`Saved screenshots to ${output}`);
