import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8768/experiments/fish-health-lab/';
const output = process.env.FISH_LAB_QA_DIR || '/home/jez237/.openclaw/workspace/tmp/fish-health-hobbyist-draft-qa/hobbyist';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:1365,height:950}});
const checks = [], errors = [], leaks = [], submissions = [], treatmentRequests = [], platformRequests = [];
const sentinel = 'PRIVATE-HOBBYIST-FISH-NOTE';
context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
context.on('request', request => {
  const url = new URL(request.url());
  if ((request.url()+(request.postData()||'')).includes(sentinel)) leaks.push(request.url());
  if (!['GET','HEAD','OPTIONS'].includes(request.method())) {
    // Record the parent site's existing analytics/security traffic separately.
    // The sentinel check above still rejects observation text in any request.
    const analytics = ['www.google-analytics.com','region1.google-analytics.com','analytics.google.com','stats.g.doubleclick.net'].includes(url.hostname) && url.pathname === '/g/collect';
    const cloudflare = (url.origin === new URL(root).origin || ['cloudflareinsights.com','www.cloudflareinsights.com'].includes(url.hostname)) && (url.pathname === '/cdn-cgi/rum' || url.pathname.startsWith('/cdn-cgi/challenge-platform/'));
    (analytics || cloudflare ? platformRequests : submissions).push(url.origin+url.pathname);
  }
  if (/api\.(openai|anthropic)\.com|chatgpt\.com/.test(url.hostname)) leaks.push(url.hostname);
  if (url.hostname === 'www.merckvetmanual.com') treatmentRequests.push({url:request.url(),referer:request.headers().referer || ''});
});
// The independently verified destination is exercised without loading third-party
// advertising/scripts. Preserve its real origin, path and fragment in the popup.
await context.route('https://www.merckvetmanual.com/**', route => route.fulfill({contentType:'text/html',body:'<!doctype html><title>Treatment guide test destination</title><h1>External care guide</h1>'}));
const page = await context.newPage();
const action = (p,id) => p.locator(`[data-action="${id}"]:visible`).first();
const next = p => p.locator('#next-button').click();
const record = label => checks.push(label);
const overflow = async p => assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
const visitorCopy = async p => assert.doesNotMatch(await p.locator('body').innerText(), /microscop|wet mounts?|biops|bacterial culture|\baccount\b|sign.?up|log.?in/i);
const resultIds = p => p.locator('#results-content [data-result]').evaluateAll(els => els.map(el => el.dataset.result));
const reset = async p => {
  await p.locator('.nav-tab[data-view="guide"]').click();
  if (!await p.locator('#welcome').isVisible()) await action(p,'reset').click();
};
const begin = async (p, water, sign, texture = sign, {fish = '', closer = 'unclear'} = {}) => {
  await reset(p); await action(p,'start').click();
  await p.locator(`input[name="water"][value="${water}"]`).check(); await next(p);
  if (fish) await p.locator(`input[name="fishType"][value="${fish}"]`).check();
  await next(p);
  await p.locator(`[data-symptom="${sign}"]`).click(); await next(p);
  if (water === 'fresh' && sign === 'dots') { await p.locator(`[data-texture="${texture}"]`).click(); await next(p); }
  if (await p.locator('[data-step="closer"]').isVisible()) { await p.locator(`input[name="closer"][value="${closer}"]`).check(); await next(p); }
};
const addSign = async (p,id) => {
  if (!await p.locator('#additional-signs').getAttribute('open')) {
    const isOpen = await p.locator('#additional-signs').evaluate(el => el.open);
    if (!isOpen) await p.locator('#additional-signs summary').click();
  }
  await p.locator(`[data-additional-symptom="${id}"]`).click();
};
const noFreshImages = async p => {
  const urls = await p.locator('img:visible').evaluateAll(imgs => imgs.map(img => img.src));
  // Treatment-step pictures are shared by every fish and water type.
  assert.ok(urls.every(url => /\/marine-|\/__draft-images__\/marine-|\/steps\/step-/.test(url)), urls.join('\n'));
};
const popupClick = async (p, selector) => {
  const link = p.locator(selector).first(), href = await link.getAttribute('href');
  const pending = p.waitForEvent('popup');
  await link.click();
  const popup = await pending;
  await popup.waitForURL(href);
  await popup.waitForLoadState('domcontentloaded');
  assert.equal(await popup.evaluate(() => window.opener === null),true);
  assert.equal(p.url(), root);
  await popup.close();
};

try {
  await page.goto(root,{waitUntil:'networkidle'});
  assert.equal(await page.locator('#welcome-title').innerText(),'What do you see?');
  assert.equal(await page.locator('img[src]').count(),1);
  await visitorCopy(page);
  await action(page,'start').click();
  assert.deepEqual(await page.locator('input[name="water"]').evaluateAll(els=>els.map(el=>el.value)),['fresh','marine']);
  await next(page);
  assert.match(await page.locator('#flow-error').innerText(), /Freshwater or Saltwater/);
  record('plain opening heading, hobbyist language and exactly two required water choices');

  await page.locator('input[value="marine"]').check(); await next(page);
  assert.deepEqual(await page.locator('input[name="fishType"]').evaluateAll(els=>els.map(el=>el.value)),['clownfish','tang','angel','wrasse','damsel','']);
  assert.equal(await page.locator('#next-button').innerText(),'Skip →');
  await next(page);
  await page.locator('#symptom-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  assert.equal(await page.locator('#symptom-grid img[src]').count(),12);
  assert.equal(await page.locator('#texture-grid img').count(),0);
  await noFreshImages(page); await overflow(page);
  await page.screenshot({path:output+'/desktop-marine-choices.png',fullPage:true});
  await page.locator('[data-symptom="dots"]').click(); await next(page);
  assert.equal(await page.locator('[data-step="closer"]').isVisible(),true);
  await next(page); assert.match(await page.locator('#flow-error').innerText(),/closest description/);
  await page.locator('input[name="closer"][value="white"]').check(); await next(page);
  await page.locator('input[value="gasping"]').check(); await next(page);
  assert.match(await page.locator('#results-title').innerText(),/^Most likely:\s*Marine ich/i);
  assert.equal(await page.locator('.result-focus').getAttribute('data-urgency'),'today');
  assert.equal(await page.locator('.result-focus .reef-flag').isVisible(),true);
  assert.deepEqual(await resultIds(page),['ich-marine']);
  assert.equal(await page.locator('#results-content .urgent').isVisible(),true);
  await noFreshImages(page); await visitorCopy(page);
  assert.equal(await page.locator('#results-content a[data-treatment="ich-fresh"]').count(),0);
  record('all twelve marine choices decode; saltwater results and look-alikes use marine fish and marine treatment links');

  await page.locator('.nav-tab[data-view="library"]').click();
  assert.equal(await page.locator('#library-water').inputValue(),'marine');
  assert.equal(await page.locator('#library-grid .condition-card').count(),20);
  assert.equal(await page.locator('#library-grid [data-condition="ich-fresh"]').count(),0);
  await page.locator('#library-grid .card-image[data-condition="popeye"]').click();
  await visitorCopy(page);
  assert.equal(await page.locator('#detail-content img:not(.step-pic)').count(),0); // shared step pictures only
  await page.keyboard.press('Escape');
  record('optional library inherits the chosen marine environment and does not leak freshwater disease galleries');

  await page.locator('.nav-tab[data-view="guide"]').click();
  await action(page,'edit').click();
  await page.locator('input[value="fresh"]').check(); await next(page);
  assert.equal(await page.locator('input[name="fishType"]:checked').count(),0);
  await next(page);
  assert.equal(await page.locator('#symptom-grid img').evaluateAll(imgs=>imgs.every(img=>/\/sign-/.test(img.src))),true);
  assert.equal(await page.locator('[data-symptom="dots"]').getAttribute('aria-pressed'),'true');
  await next(page); await page.locator('[data-texture="fuzz"]').click(); await next(page); await next(page);
  assert.deepEqual(await resultIds(page),['water-mold']);
  assert.match(await page.locator('.diagnosis-context').innerText(), /closer look was/);
  await visitorCopy(page);
  assert.equal(treatmentRequests.length,0);
  record('switching environments replaces the pictures, clears dependent answers and explains a closer texture correction');

  await popupClick(page,'#results-content a[data-treatment="water-mold"]');
  assert.equal(treatmentRequests.length,1);
  assert.equal(treatmentRequests[0].referer,'');
  assert.deepEqual(await resultIds(page),['water-mold']);
  record('the treatment button opens the exact Merck section once, with no opener/referrer and without losing the diagnosis');
  await page.evaluate(()=>{window.__originalDraftOpen=window.open;window.open=()=>null;});
  await popupClick(page,'#results-content a[data-treatment="water-mold"]');
  await page.evaluate(()=>{window.open=window.__originalDraftOpen;delete window.__originalDraftOpen;});
  assert.equal(treatmentRequests.length,2);
  record('a blocked scripted popup falls back to the normal separate-tab link');

  for (const [sign,id,hash] of [['dots','ich-fresh','#v3226751'],['dust','velvet-fresh','#v3226757'],['fuzz','water-mold','#v3226818']]) {
    await begin(page,'fresh',sign); await next(page);
    assert.equal(new URL(await page.locator(`#results-content a[data-treatment="${id}"]`).getAttribute('href')).hash,hash);
    await visitorCopy(page);
    await page.locator('.result-focus .result-image').click(); await visitorCopy(page);
    for (const slot of ['overview','variations','closeup','subtle','marked','lookalikes']) {
      await page.locator(`#detail-content [data-slot="${slot}"]`).click(); await visitorCopy(page);
    }
    await page.keyboard.press('Escape');
  }
  record('all three illustrated freshwater diseases offer condition-specific owner treatment links without mandatory water readings or laboratory instructions');

  await begin(page,'fresh','dots');
  await page.locator('input[value="pinecone"]').check();
  await page.locator('input[value="appetite"]').check(); await next(page);
  assert.match(await page.locator('#results-title').innerText(),/^Most likely:\s*Ich/i);
  assert.deepEqual(new Set(await resultIds(page)),new Set(['ich-fresh','dropsy']));
  assert.equal(await page.locator('[data-result="dropsy"]').getAttribute('data-urgency'),'today');
  assert.match(await page.locator('[data-result="dropsy"] .todo-card').innerText(),/hard to cure/);
  assert.equal(await page.locator('#results-content .urgent').isVisible(),true);
  assert.match(await page.locator('.diagnosis-context').innerText(), /more than one problem/i);
  assert.equal(await page.locator('.alternatives [data-condition="dropsy"], .alternatives [data-condition="swim-bladder"], .alternatives [data-condition="popeye"], .alternatives [data-condition="cloudy-eye"]').count(),0);
  record('white grains plus raised scales produce two explained concerns, not unrelated ich look-alikes');

  await begin(page,'fresh','dots'); await addSign(page,'fuzz');
  assert.equal(await page.locator('[data-additional-symptom="fuzz"]').getAttribute('aria-pressed'),'true');
  await next(page);
  assert.deepEqual(new Set(await resultIds(page)),new Set(['ich-fresh','water-mold']));
  assert.equal(await page.locator('#results-content [data-treatment]').count(),2);
  await action(page,'care').click();
  await page.locator('#ammonia').fill('1');
  await page.locator('#tank-extra summary').click(); await page.locator('#notes').fill(sentinel);
  await next(page);
  assert.deepEqual(new Set(await page.locator('[data-care-condition]').evaluateAll(els=>els.map(el=>el.dataset.careCondition))),new Set(['ich-fresh','water-mold']));
  await visitorCopy(page);
  await action(page,'results').click();
  assert.deepEqual(new Set(await resultIds(page)),new Set(['ich-fresh','water-mold']));
  assert.equal(await page.locator('[data-context-concern="water"]').count(),1);
  await action(page,'case').click();
  assert.match(await page.locator('#case-text').inputValue(), /Most likely: Ich[\s\S]*Also likely: Fungus/);
  await page.keyboard.press('Escape');
  record('additional picture selections, both care paths, water-quality concerns and exported notes retain all observations without transmitting them');

  await begin(page,'fresh','dots'); await addSign(page,'dust'); await next(page);
  assert.deepEqual(new Set(await resultIds(page)),new Set(['ich-fresh','velvet-fresh']));
  assert.match(await page.locator('.diagnosis-context').innerText(), /grains and fine dust/);
  await begin(page,'fresh','fins'); await addSign(page,'patch'); await next(page);
  assert.deepEqual(await resultIds(page),['columnaris']);
  assert.match(await page.locator('.diagnosis-reason').innerText(), /Damaged fins.*Pale patches|Pale patches.*Damaged fins/s);
  record('different textures show competing possibilities; a plausible shared cause can explain patches plus fin damage');

  await begin(page,'marine','fuzz'); await next(page);
  assert.deepEqual(await resultIds(page),['lymphocystis']);
  assert.equal(await page.locator('#results-content [data-treatment="water-mold"]').count(),0);
  await begin(page,'fresh','unclear'); await page.locator('input[value="appetite"]').check(); await next(page);
  assert.deepEqual(await resultIds(page),['water']);
  await begin(page,'fresh','unclear'); await page.locator('input[value="rubbing"]').check(); await next(page);
  assert.deepEqual(await resultIds(page),['flukes']);
  record('marine cotton tufts and vague "not acting right" answers still get a sensible named best guess in the right water');

  // Approved named conditions and fish-type re-weighting through the real UI.
  for (const [water,sign,fish,closer,id,reef] of [
    ['fresh','fins','betta','unclear','fin-rot',false], ['fresh','balance','goldfish','unclear','swim-bladder',false],
    ['fresh','eyes','','bulging','popeye',false], ['fresh','patch','cichlid','pits','hole-in-head',false],
    ['marine','patch','clownfish','slime','brooklynella',true], ['marine','patch','clownfish','unclear','brooklynella',true],
    ['marine','dots','tang','black','black-spot',true], ['marine','patch','tang','pits','hlle',false],
    ['marine','sores','damsel','open','uronema',true], ['fresh','sores','','streaks','septicemia',false],
  ]) {
    await begin(page,water,sign,sign,{fish,closer}); await next(page);
    assert.deepEqual(await resultIds(page),[id], `${water} ${sign} ${fish} ${closer}`);
    assert.equal(await page.locator('.result-focus .reef-flag').count(), reef ? 1 : 0, id);
    assert.ok(await page.locator('.result-focus .todo-card ol li').count() >= 3);
    assert.equal(await page.locator('.water-nudge').count(),1);
    assert.ok(await page.locator('.could-also .alternative').count() >= 1);
  }
  record('fin rot, swim bladder, popeye, HITH, Brooklynella, black spot, HLLE, Uronema and septicemia are named, with reef flags only where needed');

  await begin(page,'marine','patch','patch',{fish:'clownfish',closer:'slime'});
  await action(page,'back').click(); await action(page,'back').click(); await action(page,'back').click();
  assert.equal(await page.locator('[data-step="fish"]').isVisible(),true);
  assert.equal(await page.locator('input[name="fishType"]:checked').inputValue(),'clownfish');
  await action(page,'back').click(); await page.locator('input[name="water"][value="fresh"]').check(); await next(page);
  assert.equal(await page.locator('input[name="fishType"]:checked').count(),0);
  assert.deepEqual(await page.locator('input[name="fishType"]').evaluateAll(els=>els.map(el=>el.value)),['betta','goldfish','community','livebearer','cichlid','catfish','']);
  record('Back preserves the fish type; changing water clears it and swaps the fish list');

  const mobile = await context.newPage();
  await mobile.setViewportSize({width:390,height:844});
  await mobile.goto(root,{waitUntil:'networkidle'}); await overflow(mobile);
  await begin(mobile,'marine','dots');
  await action(mobile,'back').click(); await action(mobile,'back').click(); // behavior → closer → main pictures
  await mobile.locator('#symptom-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  await noFreshImages(mobile); await overflow(mobile);
  await mobile.screenshot({path:output+'/mobile-marine-choices.png',fullPage:true});
  await next(mobile); await next(mobile); await addSign(mobile,'dust'); await next(mobile);
  await mobile.locator('#results-content img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  assert.match(await mobile.locator('#results-title').innerText(),/^Most likely:/i);
  assert.deepEqual(new Set(await resultIds(mobile)),new Set(['ich-marine','velvet-marine']));
  await noFreshImages(mobile); await overflow(mobile); await visitorCopy(mobile);
  await mobile.screenshot({path:output+'/mobile-multiple-diagnoses.png',fullPage:true});
  record('mobile marine choices and multiple-diagnosis/treatment cards fit without horizontal overflow or freshwater pictures');
} finally {
  await browser.close();
}
assert.deepEqual(errors,[]); assert.deepEqual(leaks,[]); assert.deepEqual(submissions,[]);
record('no browser errors, submitted observations, accounts, photo uploads or external AI requests');
const result = {url:root,checks:checks.length,passed:checks,errors,leaks,submissions,platformRequests:[...new Set(platformRequests)],treatmentRequests,screenshots:output};
await writeFile(output+'/hobbyist-browser-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
