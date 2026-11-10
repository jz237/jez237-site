// Final pass, in a real browser: search, the message a visitor reads when a number is wrong, a typed comma in
// point- and comma-decimal languages, the panels without <dialog>, and the "math & sources" text.
// Usable against the source preview or the Lab.
//   node scripts/aquarium-toolbox/final-browser.mjs <toolbox-url> [evidence-dir] [chromium|firefox|webkit]
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const pw=await import('/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs');
const base=(process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/').replace(/#.*$/,'');
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-final-20261110/final-browser';
const engine=process.argv[4]||'chromium';
await mkdir(out,{recursive:true});
const browser=engine==='chromium'?await pw.chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'}):await pw[engine].launch({headless:true});
let checks=0;const errors=[];
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const open=async(options={},hash='#tool=tank&units=us')=>{
  const ctx=await browser.newContext({viewport:{width:1280,height:900},...options});
  await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const p=await ctx.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+hash,{waitUntil:'load'});await p.waitForSelector('.calc-heading h2');await p.waitForTimeout(300);
  return {ctx,p};
};
const tool=async(p,id)=>{await p.evaluate(id=>{location.hash=`#tool=${id}`;},id);await p.waitForFunction(id=>document.querySelector('#calc-form')&&location.hash===`#tool=${id}`,id);await p.waitForTimeout(200);};
const errorText=p=>p.locator('#result .error-card p').first().innerText();
try{
  // ---------- 1. Search finds what people type ----------
  {
    const {ctx,p}=await open();
    const found=async q=>{await p.locator('#search').fill(q);await p.waitForTimeout(120);return p.locator('#tool-list .tool-link').evaluateAll(a=>a.map(x=>x.dataset.tool));};
    const expect={co2:['co2','co2cylinder'],CO2:['co2','co2cylinder'],'co2 cylinder':['co2cylinder'],decor:['tank'],heaters:['heater'],chlorine:['label'],chloramine:['label'],nitrite:['change','target'],
      betta:['heater'],gallons:['tank'],'how many fish':['stocking'],dechlorinator:['label'],'water changes':['change','target','series'],salinity:['salt','adjust','sg'],evaporation:['ato'],gph:['turnover'],'drop checker':['co2'],
      kh:['hardness','co2'],ammonia:['ammonia'],gravel:['substrate'],'electric bill':['energy'],acclimate:['drip'],'top off':['ato'],rodi:['ro'],fertilizer:['fertilizer'],filters:['turnover'],
      'co2 calculator':['co2','co2cylinder'],inches:['stocking'],'tank volume calculator':['tank'],liters:['tank'],goldfish:['stocking'],turnover:['turnover'],doser:['doser'],kalkwasser:['supplement'],cycling:['ammonia'],coral:['supplement','turnover']};
    for(const [q,ids] of Object.entries(expect)){const got=await found(q);for(const id of ids)check(got.includes(id),`search "${q}" finds ${id} (found: ${got.join(', ')||'nothing'})`);}
    check((await found('zzzz')).length===0,'a word that matches nothing shows no calculators');
    check(/No matches/.test(await p.locator('#empty-search').innerText()),'and says so');
    check((await found('calculator')).length>0&&!(await p.locator('#empty-search').isVisible()),'the word "calculator" alone keeps the list');
    await p.screenshot({path:`${out}/${engine}-search-nothing.png`});
    await p.locator('#search').fill('co2');await p.waitForTimeout(150);await p.screenshot({path:`${out}/${engine}-search-co2.png`});
    await p.locator('#search').fill('');
    // ---------- 2. What a visitor reads when a number is wrong ----------
    await tool(p,'tank');
    await p.locator('#field-l').fill('');await p.waitForTimeout(150);
    check(await errorText(p)==='Enter a number for “Inside length”.',`blank field: ${await errorText(p)}`);
    await p.locator('#field-l').fill('0');await p.waitForTimeout(150);
    check(await errorText(p)==='“Inside length” must be more than 0.',`zero: ${await errorText(p)}`);
    await p.screenshot({path:`${out}/${engine}-error-zero.png`});
    await p.locator('#field-l').fill('99999');await p.waitForTimeout(150);
    check(await errorText(p)==='“Inside length” must be no more than 1,960 in.',`too large: ${await errorText(p)}`);
    await p.locator('#field-l').fill('30');await p.waitForTimeout(150);
    check(await p.locator('#result .error-card').count()===0,'a valid number brings the answer back');
    await p.locator('#field-fill').fill('0');await p.waitForTimeout(150);
    check(await errorText(p)==='“How full is it?” must be between 1 and 100%.',`percent: ${await errorText(p)}`);
    await p.locator('#field-fill').fill('95');
    await tool(p,'ammonia');
    await p.locator('#field-ph').fill('3');await p.waitForTimeout(150);
    check(await errorText(p)==='“pH” must be between 4 and 10.',`pH: ${await errorText(p)}`);
    await p.locator('#field-ph').fill('7');await p.locator('#field-temp').fill('20');await p.waitForTimeout(150);
    check(await errorText(p)==='“Water temperature” must be between 32 and 104 °F.',`temperature: ${await errorText(p)}`);
    await p.locator('#field-temp').fill('78');
    await tool(p,'change');
    await p.locator('#field-current').fill('-4');await p.waitForTimeout(150);
    check(await errorText(p)==='“Reading in the tank now” cannot be negative.',`negative: ${await errorText(p)}`);
    await p.locator('#field-current').fill('40');
    for(const id of ['tank','change','ammonia']){await tool(p,id);check(await p.locator('#result .error-card').count()===0,`${id} answers again after the corrections`);}
    // ---------- 3. The "math & sources" text ----------
    const math=async id=>{await tool(p,id);return p.locator('#math-details').evaluate(d=>{d.open=true;return d.innerText;});};
    let text=await math('weight');check(/8\.345 lb per US gallon fresh, about 8\.54 salt/.test(text)&&!/kg per litre/.test(text),'US weight text is in pounds per gallon');
    text=await math('tank');for(const shape of ['Corner (quarter-round)','Oval','Hexagon','Bow-front','Cylinder'])check(text.includes(shape),`tank formula covers ${shape}`);check(/÷ 231/.test(text),'tank formula is in inches and gallons');
    text=await math('pipe');check(/0\.00681 × flow \(US GPH\)/.test(text),'pipe speed formula is in GPH and inches');
    text=await math('heatup');check(/× 0\.00245 ÷/.test(text),'heat-up formula is in gallons and °F');
    text=await math('fertilizer');check(/rise wanted \(ppm\) × water \(US gal\)/.test(text)&&!/mg\/L\)/.test(text),'fertilizer formula uses ppm and gallons');
    for(const id of ['label','supplement','consumption']){text=await math(id);check(/Method: /.test(text)&&!/Dilution and conservation/.test(text),`${id} shows the method line, not the dilution article`);}
    text=await math('change');check(/Reference: Dilution and conservation/.test(text),'water change keeps the dilution reference');
    // Metric text keeps metric units.
    await p.evaluate(()=>{location.hash='#tool=tank&units=metric';});await p.waitForTimeout(400);
    text=await p.locator('#math-details').evaluate(d=>{d.open=true;return d.innerText;});
    check(/÷ 1,000/.test(text)&&text.includes('Corner (quarter-round)')&&text.includes('Oval'),'metric tank formula covers every shape');
    await p.locator('#field-l').fill('0');await p.waitForTimeout(150);
    check(await errorText(p)==='“Inside length” must be more than 0.','metric zero message');
    await p.locator('#field-l').fill('999999');await p.waitForTimeout(150);
    check(await errorText(p)==='“Inside length” must be no more than 5,000 cm.',`metric limit: ${await errorText(p)}`);
    await ctx.close();
  }
  // ---------- 3b. The tank panel says which box to fix ----------
  {
    const {ctx,p}=await open();
    await p.locator('#edit-profile').scrollIntoViewIfNeeded();await p.locator('#edit-profile').click();await p.waitForSelector('#profile-dialog[open]');
    const save=async(name,volume)=>{await p.locator('#tank-name').fill(name);await p.locator('#tank-volume').fill(volume);await p.locator('#profile-form button[type=submit]').click();await p.waitForTimeout(150);return p.locator('#profile-error').innerText();};
    check(await save('','20')==='Give the tank a name.','tank panel: missing name');
    check(await p.evaluate(()=>document.activeElement.id)==='tank-name','and the name box is focused');
    check(await save('Reef','')==='Enter how much water the tank holds, as a number.','tank panel: blank volume');
    check(await save('Reef','0')==='The water in the tank must be more than 0.','tank panel: zero volume');
    check(await save('Reef','-5')==='The water in the tank must be more than 0.','tank panel: negative volume');
    check(await save('Reef','99999999')==='The water in the tank must be no more than 2,640,000 US gallons.','tank panel: too large');
    check(await p.evaluate(()=>document.activeElement.id)==='tank-volume','and the volume box is focused');
    check(await p.locator('#profile-dialog').evaluate(d=>d.open),'the panel stays open until the numbers are right');
    await p.screenshot({path:`${out}/${engine}-tank-panel-error.png`});
    await save('Reef','75');check(!(await p.locator('#profile-dialog').evaluate(d=>d.open)),'a valid tank saves and closes the panel');
    check(/Reef · 75 US gal/.test(await p.locator('#profile-select').evaluate(s=>s.selectedOptions[0].textContent)),'the saved tank is shown');
    // The hint under a target reading does not call it a test result.
    for(const id of ['mix','supplement']){await tool(p,id);const hint=await p.locator('.field:has(#field-target)').innerText();check(/The reading you are aiming for/.test(hint)&&!/Use your own test result/.test(hint),`${id}: target hint`);}
    await ctx.close();
  }
  // ---------- 4. Phone summary button ----------
  {
    const {ctx,p}=await open({viewport:{width:390,height:844},hasTouch:true});
    const label=await p.locator('#quick-result-button').evaluate(b=>b.textContent);
    check(label==='See answer ↓'||label==='See details ↓',`phone summary button says "${label}"`);
    check(!(await p.content()).includes('See diagram'),'the old "See diagram" label is gone from the page');
    await ctx.close();
  }
  // ---------- 5. A typed comma ----------
  for(const locale of ['en-US','de-DE']){
    const {ctx,p}=await open({locale});
    await p.locator('#field-l').fill('24');await p.locator('#field-l').press('End');await p.keyboard.press('Comma');await p.keyboard.press('5');await p.waitForTimeout(250);
    const value=await p.inputValue('#field-l'),toast=await p.locator('#toast').evaluate(t=>t.hidden?'':t.textContent);
    // Firefox reads number fields in the page's language (English), so a comma is never a decimal mark there.
    if(locale==='en-US'||engine==='firefox'){
      check(/without commas/.test(toast),`${locale}: a comma is stopped with a hint`);
      check(value==='245',`${locale}: only the comma is left out (${value})`);
    }else{
      check(toast==='',`${locale}: no hint where the comma is the decimal mark`);
      // Playwright's Chrome keeps English number fields under an emulated locale; real German Chrome and Safari read 24,5.
      if(engine==='webkit'){check(value==='24.5',`${locale}: 24,5 is read as 24.5 (${value})`);check(await p.locator('#result .error-card').count()===0,`${locale}: and it calculates`);}
    }
    await ctx.close();
  }
  // ---------- 6. Panels still open where the browser has no <dialog> (Safari before 15.4) ----------
  {
    const {ctx,p}=await open({viewport:{width:390,height:844},hasTouch:true});
    await ctx.addInitScript(()=>{for(const k of ['showModal','show','close'])delete HTMLDialogElement.prototype[k];});
    await p.reload({waitUntil:'load'});await p.waitForSelector('.calc-heading h2');await p.waitForTimeout(300);
    check(await p.evaluate(()=>typeof HTMLDialogElement.prototype.showModal)==='undefined','test browser has no native showModal');
    const shown=id=>p.locator(id).evaluate(d=>{const r=d.getBoundingClientRect(),s=getComputedStyle(d);return {open:d.hasAttribute('open'),display:s.display,position:s.position,top:Math.round(r.top),bottom:Math.round(r.bottom),left:Math.round(r.left),right:Math.round(r.right),vw:innerWidth,vh:innerHeight};});
    for(const [button,dialog] of [['#guide-open','#guide-dialog'],['#settings-open','#settings-dialog'],['#share-result','#share-dialog']]){
      await p.locator(button).scrollIntoViewIfNeeded();await p.locator(button).click();await p.waitForTimeout(200);
      let s=await shown(dialog);
      check(s.open&&s.display==='block'&&s.position==='fixed',`${dialog} opens without <dialog> support (${JSON.stringify(s)})`);
      check(s.top>=0&&s.bottom<=s.vh&&s.left>=0&&s.right<=s.vw,`${dialog} fits the screen`);
      if(dialog==='#guide-dialog')await p.screenshot({path:`${out}/${engine}-dialog-fallback.png`});
      if(dialog==='#share-dialog')check(/#tool=tank/.test(await p.inputValue('#share-url')),'the share link is there to copy');
      if(dialog==='#settings-dialog'){await p.keyboard.press('Escape');}else await p.locator(`${dialog} [data-close]`).first().click();
      await p.waitForTimeout(150);s=await shown(dialog);
      check(!s.open&&s.display==='none',`${dialog} closes again`);
    }
    await ctx.close();
  }
  check(errors.length===0,`no page errors: ${errors.join(' | ')}`);
  console.log(`FINAL PASS OK (${engine}): ${checks} checks at ${base}`);
}finally{await browser.close();}
