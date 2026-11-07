import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8772/experiments/fish-health-lab/';
const output = process.env.FISH_LAB_QA_DIR || '/home/jez237/.openclaw/workspace/tmp/fish-diagnosis-causes-20261105/growth';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:1365,height:950}});
const checks = [], errors = [], treatmentRequests = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
context.on('request', r => { if (new URL(r.url()).hostname === 'www.merckvetmanual.com') treatmentRequests.push({url:r.url(),referer:r.headers().referer || ''}); });
// Verify the real, independently checked destination without third-party scripts.
await context.route('https://www.merckvetmanual.com/**', r => r.fulfill({contentType:'text/html',body:'<!doctype html><title>Care guide destination</title>'}));
const page = await context.newPage();
page.setDefaultTimeout(10000);
const action = (p,id) => p.locator(`[data-action="${id}"]:visible`).first();
const next = p => p.locator('#next-button').click();
const at = async (p,step) => { assert.equal(await p.locator(`[data-step="${step}"]`).isVisible(),true); assert.equal(await p.locator('.question-panel:visible').count(),1); };
const record = label => checks.push(label);
const begin = async (p,water='fresh',sign='lumps',texture=sign) => {
  await p.goto(root,{waitUntil:'networkidle'});
  await action(p,'start').click();
  await p.locator(`input[name="water"][value="${water}"]`).check(); await next(p);
  await next(p); // optional fish question
  await p.locator(`[data-symptom="${sign}"]`).click(); await next(p);
  if (water==='fresh' && sign==='dots') { await p.locator(`[data-texture="${texture}"]`).click(); await next(p); }
  if (await p.locator('[data-step="closer"]').isVisible()) { await p.locator('input[name="closer"][value="unclear"]').check(); await next(p); }
  await at(p,'behavior');
};
const chooseGrowth = async (p,value) => {
  await next(p); await at(p,'growth');
  await p.locator(`input[name="growthAppearance"][value="${value}"]`).check(); await next(p); await at(p,'results');
};
const overflow = async p => assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
const resultIds = p => p.locator('#results-content [data-result]').evaluateAll(els=>els.map(el=>el.dataset.result));
try {
  await begin(page); await next(page); await at(page,'growth');
  assert.equal(await page.locator('#results-content [data-result]').count(),0);
  await next(page); await at(page,'growth');
  assert.match(await page.locator('#flow-error').innerText(),/closest description/);
  await page.locator('input[name="growthAppearance"][value="cauliflower"]').check(); await next(page);
  assert.match(await page.locator('#results-title').innerText(),/^Most likely:\s*Lymphocystis$/i);
  assert.deepEqual(await resultIds(page),['lymphocystis']);
  assert.equal(await page.locator('.result-focus').getAttribute('data-urgency'),'watch');
  assert.match(await page.locator('.diagnosis-reason').innerText(),/wart-like clusters/);
  record('lumps require a closer observation; wart-like clusters can suggest lymphocystis, not a renamed symptom');

  const link = page.locator('#results-content [data-treatment="lymphocystis"]');
  const href = await link.getAttribute('href');
  assert.equal(new URL(href).hash,'#v3226746');
  await link.click(); await page.locator('#reader-dialog[open]').waitFor();
  assert.equal(await page.locator('#reader-frame').getAttribute('src'), href);
  await page.waitForFunction(() => document.querySelector('#reader-status').hidden, null, { timeout: 30000 });
  await page.locator('.reader-close').click();
  assert.equal(page.url(),root);
  assert.equal(treatmentRequests[0].referer,'');
  assert.match(await page.locator('.result-focus .todo-card').innerText(),/no medicine/);
  record('lymphocystis opens its exact Merck care section separately, without promising a cure or losing the result');

  await action(page,'care').click(); await at(page,'care');
  assert.match(await page.locator('#care-context').innerText(),/Most likely: Lymphocystis/i);
  await next(page); assert.equal(await page.locator('[data-care-condition]').getAttribute('data-care-condition'),'lymphocystis');
  await action(page,'results').click(); await action(page,'case').click();
  assert.match(await page.locator('#case-text').inputValue(),/Raised lumps: rough, wart-like clusters/);
  await page.keyboard.press('Escape');
  record('named growth result, conditional care and saved observations retain the closer answer');

  await begin(page); await chooseGrowth(page,'smooth');
  assert.match(await page.locator('#results-title').innerText(),/Most likely:\s*Cyst or tumor/i);
  assert.deepEqual(await resultIds(page),['growth']);
  assert.ok(await page.locator('.could-also [data-alternative="lymphocystis"]').count());
  await action(page,'care').click();
  assert.match(await page.locator('#care-context').innerText(),/Most likely: Cyst or tumor/i);
  await action(page,'results').click(); await action(page,'case').click();
  const notes = await page.locator('#case-text').inputValue();
  assert.match(notes,/Most likely: Cyst or tumor \(Watch it\)/); assert.match(notes,/Could also be: .*Lymphocystis/);
  await page.keyboard.press('Escape');
  record('a smooth lump is named cyst or tumor (watch it) with lymphocystis as a could-also-be');

  await begin(page); await chooseGrowth(page,'inflamed');
  assert.deepEqual(await resultIds(page),['ulcer']);
  assert.match(await page.locator('#results-title').innerText(),/Most likely:\s*Bacterial ulcers/i);
  await begin(page); await chooseGrowth(page,'unclear');
  assert.deepEqual(await resultIds(page),['lymphocystis']);
  assert.ok(await page.locator('.could-also [data-alternative="growth"]').count());
  record('inflamed lumps lead to bacterial ulcers; an unsure lump goes with the most common cause, lymphocystis');

  await begin(page,'fresh','dots','lumps'); await chooseGrowth(page,'cauliflower');
  assert.deepEqual(await resultIds(page),['lymphocystis']);
  assert.match(await page.locator('.diagnosis-context').innerText(),/closer look was/);
  record('the white-mark texture branch also reaches the growth question and does not retain a false ich result');

  await begin(page,'fresh','dots');
  await page.locator('#additional-signs summary').click(); await page.locator('[data-additional-symptom="lumps"]').click();
  await page.locator('input[name="behavior"][value="pinecone"]').check();
  await chooseGrowth(page,'cauliflower');
  assert.match(await page.locator('#results-title').innerText(),/^Most likely:\s*Ich/i);
  assert.deepEqual(new Set(await resultIds(page)),new Set(['ich-fresh','lymphocystis','dropsy']));
  assert.equal(await page.locator('[data-result="dropsy"]').getAttribute('data-urgency'),'today');
  assert.equal(await page.locator('#results-content .urgent').isVisible(),true);
  record('additional lumps get the same follow-up; ich, lymphocystis and urgent unresolved swelling remain distinct');

  await action(page,'edit').click(); await page.locator('input[value="marine"]').check(); await next(page); await next(page);
  await page.locator('[data-symptom="lumps"]').click(); await next(page); await next(page); await at(page,'growth');
  assert.equal(await page.locator('input[name="growthAppearance"]:checked').count(),0);
  await action(page,'back').click(); await at(page,'behavior'); await next(page); await at(page,'growth');
  await page.locator('input[name="growthAppearance"][value="smooth"]').check();
  await action(page,'back').click(); await next(page);
  assert.equal(await page.locator('input[name="growthAppearance"]:checked').inputValue(),'smooth');
  // A saltwater picture after switching water (results may now borrow a saltwater fish's own picture; Nov 6 combination sweep).
  await next(page); { const pic = await page.locator('.result-focus .result-image img').evaluate(img=>[img.src,img.alt]); const id = await page.locator('.result-focus').getAttribute('data-result'); assert.ok(/marine-|clownfish|tang|wrasse|goby|damsel|dottyback|[\/-]angel[\/-]/.test(pic[0]), `${id}: ${pic}`); }
  record('Back preserves a closer answer; changing water clears it and uses marine pictures');

  for (const sign of ['fins','sores','swollen','eyes','balance','breathing']) {
    await begin(page,'fresh',sign); await next(page); await at(page,'results');
    const expected = {fins:'fin-rot',sores:'ulcer',swollen:'bloat',eyes:'cloudy-eye',balance:'swim-bladder',breathing:'water'}[sign];
    assert.deepEqual(await resultIds(page),[expected]);
    assert.match(await page.locator('#results-title').innerText(),/^Most likely:/i);
    assert.equal(await page.locator('.result-focus .urgency-badge').count(),1);
    assert.ok(await page.locator('.could-also .alternative').count()>=1);
  }
  record('fins, sores, swelling, eyes, swimming and breathing each lead with a named best guess plus could-also-be');

  const mobile = await context.newPage(); await mobile.setViewportSize({width:390,height:844});
  await begin(mobile,'marine'); await next(mobile); await at(mobile,'growth'); await overflow(mobile);
  await mobile.screenshot({path:output+'/mobile-growth-question.png',fullPage:true});
  await mobile.locator('input[name="growthAppearance"][value="cauliflower"]').check(); await next(mobile);
  await overflow(mobile); await mobile.screenshot({path:output+'/mobile-lymphocystis.png',fullPage:true});
  await begin(mobile); await chooseGrowth(mobile,'unclear'); await overflow(mobile);
  assert.doesNotMatch(await mobile.locator('body').innerText(),/microscop|biops|\baccount\b|log.?in/i);
  await mobile.screenshot({path:output+'/mobile-unresolved-growth.png',fullPage:true});
  record('mobile follow-up, named condition and unresolved causes fit the viewport without technical or account instructions');
} finally { await browser.close(); }
assert.deepEqual(errors,[]);
const result={url:root,checks:checks.length,passed:checks,errors,treatmentRequests,screenshots:output};
await writeFile(output+'/growth-browser-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
