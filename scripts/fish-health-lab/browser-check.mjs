import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8768/experiments/fish-health-lab/';
const output = process.env.FISH_LAB_QA_DIR || '/home/jez237/.openclaw/workspace/tmp/fish-health-simple-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:1365,height:950},permissions:['clipboard-read','clipboard-write']});
const checks=[], errors=[], assets=[], submissions=[], leaks=[], aiRequests=[], platformRequests=[];
const sentinel='PRIVATE-FISH-OBSERVATION-1567971914423603203';
context.on('page', page => page.on('pageerror', e=>errors.push(e.message)));
context.on('request', request=>{
  const url=new URL(request.url()), content=request.url()+(request.postData()||'');
  if (url.hostname==='media.jez237.com') assets.push(request.url());
  if (content.includes(sentinel)) leaks.push(url.origin+url.pathname);
  if (/chatgpt\.com|api\.openai\.com|api\.anthropic\.com/.test(url.hostname)) aiRequests.push(url.hostname);
  if (['GET','HEAD','OPTIONS'].includes(request.method())) return;
  const analytics=['www.google-analytics.com','region1.google-analytics.com','analytics.google.com','stats.g.doubleclick.net'].includes(url.hostname)&&url.pathname==='/g/collect';
  const cloudflare=(url.origin===new URL(root).origin||['cloudflareinsights.com','www.cloudflareinsights.com'].includes(url.hostname))&&(url.pathname==='/cdn-cgi/rum'||url.pathname.startsWith('/cdn-cgi/challenge-platform/'));
  (analytics||cloudflare?platformRequests:submissions).push(url.origin+url.pathname);
});
const page=await context.newPage();
const record=label=>checks.push(label);
const action=(p,id)=>p.locator('[data-action="'+id+'"]:visible').first();
// Broad flow cases leave lump morphology unknown; the focused growth suite
// exercises each closer description, validation and navigation explicitly.
// The optional fish question is skipped and closer looks answered "Not sure";
// the hobbyist suite covers those questions explicitly.
const next=async p=>{
  await p.locator('#next-button').click();
  if (await p.locator('[data-step="fish"]').isVisible()) await p.locator('#next-button').click();
  if (await p.locator('[data-step="closer"]').isVisible()) {
    await p.locator('input[name="closer"][value="unclear"]').check();
    await p.locator('#next-button').click();
  }
  if (await p.locator('[data-step="growth"]').isVisible()) {
    await p.locator('input[name="growthAppearance"][value="unclear"]').check();
    await p.locator('#next-button').click();
  }
};
const at=async(p,name)=>{
  assert.equal(await p.locator('[data-step="'+name+'"]').isVisible(),true);
  assert.equal(await p.locator('.question-panel:visible').count(),1);
};
const noOverflow=async p=>assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
const reset=async p=>{
  if (await p.locator('#welcome').isVisible()) return;
  await action(p,'reset').click();
};
const begin=async(p,water,sign,detail=sign)=>{
  await reset(p); await action(p,'start').click();
  await p.locator('input[name="water"][value="'+water+'"]').check(); await next(p);
  await p.locator('[data-symptom="'+sign+'"]').click(); await next(p);
  if(water==='fresh'&&sign==='dots') { await at(p,'texture'); await p.locator('[data-texture="'+detail+'"]').click(); await next(p); }
  await at(p,'behavior');
};
try {
  await page.goto(root,{waitUntil:'networkidle'});
  assert.equal(await page.locator('#welcome').isVisible(),true);
  assert.equal(await page.locator('#library-view').isVisible(),false);
  assert.equal(await page.locator('img[src]').count(),1);
  await page.locator('#welcome-fish img').evaluate(img=>img.decode());
  assert.doesNotMatch(await page.locator('body').innerText(),/\bich\b/i);
  assert.equal(assets.length,1);
  assert.match(assets[0],/choices\/opening-/);
  assert.equal(await page.locator('input[type="file"], a[href*="chatgpt"]').count(),0);
  await noOverflow(page);
  await page.screenshot({path:output+'/desktop-welcome.png',fullPage:true});
  record('welcome has the mixed-fish opening illustration and Start, with no early question pictures, ich posters, upload or chatbot');
  const legacy=await context.newPage();
  await legacy.goto(root+'#ich',{waitUntil:'networkidle'});
  assert.equal(await legacy.locator('#welcome').isVisible(),true);
  assert.equal(await legacy.locator('img[src]').count(),1);
  assert.equal(await legacy.locator('#symptom-grid img[src], #texture-grid img[src]').count(),0);
  assert.doesNotMatch(await legacy.locator('body').innerText(),/\bich\b/i);
  await legacy.close();
  record('the previously shared #ich link also opens the neutral Start screen');

  await action(page,'start').click(); await at(page,'water');
  await next(page); assert.match(await page.locator('#flow-error').innerText(),/Freshwater or Saltwater/);
  assert.deepEqual(await page.locator('input[name="water"]').evaluateAll(els=>els.map(el=>el.value)),['fresh','marine']);
  await page.locator('input[value="fresh"]').check(); await next(page); await at(page,'signs');
  assert.equal(await page.locator('#symptom-grid .symptom-card').count(),12);
  assert.equal(await page.locator('#symptom-grid .selection-check').evaluateAll(els=>els.filter(el=>getComputedStyle(el).opacity !== '0').length),0);
  await page.locator('#symptom-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  assert.equal(await page.locator('#symptom-grid img[src]').count(),12);
  assert.equal(await page.locator('#texture-grid img[src]').count(),0);
  assert.ok(assets.every(url=>/choices\/(opening|sign)-/.test(url)));
  await next(page); assert.match(await page.locator('#flow-error').innerText(),/closest picture/);
  await page.screenshot({path:output+'/desktop-symptoms.png',fullPage:true});
  await page.locator('[data-symptom="dots"]').click();
  assert.equal(await page.locator('[data-symptom][aria-pressed="true"]').count(),1);
  assert.equal(await page.locator('#symptom-grid .selection-check').evaluateAll(els=>els.filter(el=>getComputedStyle(el).opacity !== '0').length),1);
  assert.ok(assets.every(url=>/choices\/(opening|sign)-/.test(url)));
  await next(page); await at(page,'texture');
  await page.locator('#texture-reference img').evaluate(img=>img.decode());
  await page.locator('#texture-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  assert.equal(await page.locator('#texture-grid img[src]').count(),6);
  assert.equal(await page.locator('img:visible').count(),7);
  assert.equal(await page.locator('#symptom-grid img, #texture-grid img').evaluateAll(imgs=>new Set(imgs.map(img=>img.src)).size),18);
  await page.screenshot({path:output+'/desktop-texture.png',fullPage:true});
  await next(page); assert.match(await page.locator('#flow-error').innerText(),/closest texture/);
  record('one question at a time: all 12 symptom and 6 distinct texture pictures decode in their correct grids; ich references wait for freshwater + dots');
  await action(page,'back').click(); await at(page,'signs');
  assert.equal(await page.locator('[data-symptom="dots"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-symptom="fins"]').click(); await next(page); await at(page,'behavior');
  assert.equal(await page.locator('img:visible').count(),0);
  await next(page); await at(page,'results');
  assert.equal(await page.locator('.result-focus').getAttribute('data-result'),'fin-rot');
  assert.equal(await page.locator('img:visible').evaluateAll(imgs=>imgs.some(img=>/ich-/.test(img.src))),false);
  record('changing the main symptom removes the white-spot branch and its reference pictures');

  await begin(page,'fresh','dots');
  await page.locator('input[value="appetite"]').check();
  await next(page); await at(page,'results');
  assert.equal(await page.locator('[data-step="care"]').isVisible(),false);
  assert.doesNotMatch(await page.locator('#results-content').innerText(),/Any water readings\?|Swim bladder|Dropsy|Popeye/);
  assert.deepEqual(await page.locator('.alternatives [data-condition]').evaluateAll(els=>els.map(el=>el.dataset.condition)),['velvet-fresh','normal']);
  assert.equal(await page.locator('.result-focus').getAttribute('data-result'),'ich-fresh');
  assert.match(await page.locator('#results-title').innerText(),/Most likely:\s*Ich/i);
  assert.match(await page.locator('#results-content').innerText(),/hobby guide, not a vet/i);
  assert.equal(await page.locator('.result-focus .todo-card ol li').count(),5);
  assert.equal(await page.locator('.result-focus[data-urgency="week"] .urgency-week').count(),1);
  assert.match(await page.locator('.water-nudge').innerText(),/Tested ammonia & nitrite lately\?/);
  assert.equal(await page.locator('#results-content .water-reminder').count(),0);
  await page.locator('.result-focus .result-image img').evaluate(img=>img.decode());
  assert.equal(await page.locator('.alternatives img').count(),2);
  await page.screenshot({path:output+'/desktop-result.png',fullPage:true});
  await page.locator('.result-focus .result-image').click();
  for(const slot of ['overview','variations','closeup','subtle','marked','lookalikes']) {
    await page.locator('#detail-content [data-slot="'+slot+'"]').click();
    assert.equal(await page.locator('#detail-content .gallery-image img').count(),1);
    await page.locator('#detail-content .gallery-image img').evaluate(img=>img.decode());
  }
  await page.locator('#detail-content [data-enlarge-entry]').click();
  await page.locator('#atlas-full').evaluate(img=>img.decode()); await page.keyboard.press('Escape');
  assert.equal(await page.locator('#detail-dialog').isVisible(),true);
  await page.keyboard.press('Escape');
  record('white-grain results reach all six preserved reference sheets one at a time; enlargement returns correctly');

  for(const detail of ['dust','fuzz','patch','lumps','unclear']) {
    await begin(page,'fresh','dots',detail); await next(page);
    await at(page,'results');
    const expected={dust:'velvet-fresh',fuzz:'water-mold',patch:'columnaris',lumps:'lymphocystis',unclear:'ich-fresh'}[detail];
    assert.equal(await page.locator('.result-focus').getAttribute('data-result'),expected);
  }
  record('all five other texture answers lead to their named condition; "Not sure" keeps the white-dots best guess (ich)');

  for(const [sign,id] of [['dust','velvet-fresh'],['fuzz','water-mold']]) {
    await begin(page,'fresh',sign); await next(page);
    await page.locator('.result-focus .result-image').click();
    for(const slot of ['overview','variations','closeup','subtle','marked','lookalikes']) {
      await page.locator('#detail-content [data-slot="'+slot+'"]').click();
      await page.locator('#detail-content .gallery-image img').evaluate(img=>img.decode());
      assert.match(await page.locator('#detail-content .gallery-image img').getAttribute('src'),/conditions\//);
      await page.locator('#detail-content [data-enlarge-entry]').click();
      await page.locator('#atlas-full').evaluate(img=>img.decode()); await page.keyboard.press('Escape');
    }
    await page.keyboard.press('Escape');
    await action(page,'care').click(); await at(page,'care'); await next(page); await at(page,'care-summary');
    assert.equal(await page.locator('[data-care-condition]').getAttribute('data-care-condition'),id);
    await page.screenshot({path:output+'/'+id+'-care.png',fullPage:true});
  }
  record('both new freshwater galleries decode all twelve crops and lead to matching conditional care, not an ich treatment path');
  await begin(page,'fresh','dots');
  await page.locator('input[value="gasping"]').check();
  assert.equal(await page.locator('#inline-urgent').isVisible(),true);
  await next(page); await at(page,'results');
  assert.ok(await page.locator('#results-content').evaluate(el=>Boolean(el.querySelector('.urgent').compareDocumentPosition(el.querySelector('.result-focus'))&Node.DOCUMENT_POSITION_FOLLOWING)));
  await action(page,'care').click(); await at(page,'care');
  await page.locator('#ammonia').fill('-1'); await next(page); await at(page,'care');
  await page.locator('#ammonia').fill(''); await next(page); await at(page,'care-summary');
  assert.match(await page.locator('.water-reminder:visible').innerText(),/Test before you treat/);
  await action(page,'care').click();
  await page.locator('#ammonia').fill('1');
  await page.locator('#tank-extra summary').click();
  await page.locator('#affected').selectOption('several');
  await page.locator('#species').fill('<img src=x onerror=alert(1)>');
  await page.locator('#notes').fill(sentinel);
  await next(page); await at(page,'care-summary');
  assert.match(await page.locator('#care-summary-content .water-notice').innerText(),/Ammonia is detectable/);
  assert.equal(await page.locator('#care-summary-content .urgent').isVisible(),true);
  await action(page,'results').click(); await at(page,'results');
  assert.equal(await page.locator('.result-focus').getAttribute('data-result'),'ich-fresh');
  assert.deepEqual(await page.locator('.alternatives [data-condition]').evaluateAll(els=>els.map(el=>el.dataset.condition)),['velvet-fresh','normal']);
  record('water readings follow results; care validates numeric inputs, preserves unknowns and prioritizes distress without changing the visual comparison');
  await action(page,'case').click();
  const notes=await page.locator('#case-text').inputValue();
  assert.match(notes,/<img src=x onerror=alert\(1\)>/);
  assert.match(notes,/Not measured \/ unknown/);
  assert.doesNotMatch(notes,/ChatGPT|FOR AN AI|attach.*photo/i);
  await action(page,'copy-case').click();
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),notes);
  const download=page.waitForEvent('download'); await action(page,'download-case').click();
  assert.equal((await download).suggestedFilename(),'fish-health-case.txt');
  await page.keyboard.press('Escape'); await reset(page);
  assert.equal(await page.locator('#notes').inputValue(),'');
  assert.equal(await page.locator('[data-symptom][aria-pressed="true"], [data-texture][aria-pressed="true"]').count(),0);
  assert.equal(await page.locator('img:visible').count(),1);
  record('notes copy/download safely and Start over clears answers and returns to the neutral welcome');

  for(const sign of ['dust','fuzz','patch','sores','swollen','eyes','lumps','breathing','balance','unclear']) {
    await begin(page,'fresh',sign); await next(page); await at(page,'results');
    assert.match(await page.locator('#results-title').innerText(),/^Most likely:/i);
    assert.equal(await page.locator('.result-focus .todo-card').count(),1);
  }
  record('every remaining visible-sign choice reaches a named best guess with a What-to-do card');
  await reset(page); await action(page,'start').click();
  assert.equal(await page.locator('input[name="water"]').count(),2);
  assert.equal(await page.locator('input[name="water"][value="unknown"]').count(),0);
  record('water type offers only freshwater and saltwater / reef');
  await begin(page,'marine','dust');
  await page.locator('input[value="gasping"]').check(); await next(page);
  await at(page,'results');
  assert.match(await page.locator('#results-content').innerText(),/Marine velvet/);
  assert.equal(await page.locator('.result-focus .reef-flag').isVisible(),true);
  assert.equal(await page.locator('.result-focus').getAttribute('data-urgency'),'today');
  assert.doesNotMatch(await page.locator('#results-content').innerText(),/Freshwater ich|Freshwater velvet/);
  assert.equal(await page.locator('#results-content .urgent').isVisible(),true);
  await action(page,'care').click();
  assert.equal(await page.locator('#salinity-field').isVisible(),true);
  await next(page);
  assert.doesNotMatch(await page.locator('#care-summary-content').innerText(),/Freshwater ich|Freshwater velvet/);
  record('marine respiratory/dust signs retain urgent guidance without freshwater advice');

  const mobile=await context.newPage();
  await mobile.setViewportSize({width:390,height:844}); await mobile.goto(root+'#ich',{waitUntil:'networkidle'});
  await noOverflow(mobile);
  const startBox=await action(mobile,'start').boundingBox();
  assert.ok(startBox.y+startBox.height<844);
  assert.equal(await mobile.locator('img[src]').count(),1);
  assert.equal(await mobile.locator('#welcome-fish img').isVisible(),true);
  await mobile.locator('#welcome-fish img').evaluate(img=>img.decode());
  await mobile.screenshot({path:output+'/mobile-welcome.png',fullPage:true});
  await action(mobile,'start').click();
  await mobile.locator('input[value="fresh"]').check(); await next(mobile);
  await mobile.locator('#symptom-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  await noOverflow(mobile);
  await mobile.screenshot({path:output+'/mobile-symptoms.png',fullPage:true});
  await mobile.locator('[data-symptom="dots"]').click(); await next(mobile);
  await mobile.locator('#texture-grid img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  await mobile.locator('[data-texture="dots"]').click(); await next(mobile); await noOverflow(mobile);
  await action(mobile,'back').click(); await at(mobile,'texture');
  await mobile.screenshot({path:output+'/mobile-texture.png',fullPage:true});
  await mobile.locator('[data-enlarge-slot="closeup"]').click();
  await mobile.locator('#atlas-full').evaluate(img=>img.decode()); await noOverflow(mobile);
  await mobile.keyboard.press('Escape'); await next(mobile); await next(mobile);
  await at(mobile,'results'); await noOverflow(mobile);
  await mobile.screenshot({path:output+'/mobile-result.png',fullPage:true});
  await action(mobile,'care').click(); await at(mobile,'care');
  assert.equal(await mobile.locator('#flow-actions').evaluate(el=>getComputedStyle(el).position),'static');
  await mobile.screenshot({path:output+'/mobile-care.png',fullPage:true});
  await mobile.locator('#tank-extra summary').click();
  await mobile.locator('#species').fill('Molly'); await next(mobile);
  await noOverflow(mobile);
  await at(mobile,'care-summary');
  await mobile.screenshot({path:output+'/mobile-care-summary.png',fullPage:true});
  await action(mobile,'care').click();
  assert.equal(await mobile.locator('#species').inputValue(),'Molly');
  await action(mobile,'back').click(); await at(mobile,'results');
  record('mobile Start is above the fold; the full flow, Back, enlargement and results fit without horizontal scrolling');
} finally { await browser.close(); }
assert.deepEqual(errors,[]); assert.deepEqual(submissions,[]);
assert.deepEqual(leaks,[]); assert.deepEqual(aiRequests,[]);
record('no script errors, submitted observations, photo uploads or external AI requests');
const result={url:root,checks:checks.length,passed:checks,errors,submissions,leaks,aiRequests,platformRequests:[...new Set(platformRequests)],screenshots:output};
await writeFile(output+'/browser-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
