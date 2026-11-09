import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {calculators,GAL} from '../../aquarium-toolbox/calculators.mjs';
const base=process.argv[2]||'http://127.0.0.1:8874/aquarium-toolbox/';
const dir=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-sliders-20261109/sliders-local';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/home/jez237/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const results=[],errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.locator('#slider-l').waitFor();
 for(const unit of (process.argv.includes('--smoke')?[]:['metric','us'])){
  await page.locator(`#unit-${unit}`).click();
  for(const calc of calculators){
   await page.evaluate(id=>location.hash=`tool=${id}`,calc.id);await page.waitForFunction(id=>!!document.querySelector(`a[data-tool="${id}"][aria-current="true"]`),calc.id);
   const numeric=await page.locator('#calc-form input[type=number]').count();assert.equal(await page.locator('.measurement-slider').count(),numeric);
   for(const field of calc.fields.filter(f=>!f.options)){
    const control=page.locator(`#slider-${field.key}`);if(!await control.count())continue;
    const before=Number(await control.inputValue()),step=Number(await control.getAttribute('data-increment')),max=Number(await control.getAttribute('max'));
    await control.focus();await page.keyboard.press(before+step<=max?'ArrowRight':'ArrowLeft');
    const actual=Number(await page.locator(`#field-${field.key}`).inputValue());assert.equal(Number(await control.inputValue()),actual,`${unit} ${calc.id}.${field.key} sync`);
    assert.ok(await control.getAttribute('aria-label'));assert.match(await control.getAttribute('aria-valuetext'),new RegExp(String(actual).replace('.','\\.')));
    assert.equal(await control.evaluate(el=>document.activeElement===el),true,'focus retained');
    // Rendering must not replace the slider while dragging. Restore defaults for
    // the next field so linked-field constraints do not accumulate across checks.
    await page.locator('#reset').click();
    results.push({unit,tool:calc.id,field:field.key,passed:true});
   }
  }
 }
 for(const [tool,field,selection,value]of [['supplement','current','parameter','mg/L'],['consumption','start','parameter','mg/L'],['hardness','value','unit','ppm'],['mix','high','measure','mg/L']]){
  await page.goto(`${base}#tool=${tool}&units=metric`);await page.locator(`#slider-${field}`).waitFor();const before=Number(await page.locator(`#slider-${field}`).getAttribute('max'));await page.locator(`#field-${selection}`).selectOption(value);assert.ok(Number(await page.locator(`#slider-${field}`).getAttribute('max'))>before);
 }
 await page.goto(`${base}#tool=change`);await page.locator('#unit-metric').click();
 await page.locator('#field-v').fill('12345.6789');assert.ok(Number(await page.locator('#slider-v').getAttribute('max'))>12345);assert.equal(Number(await page.locator('#slider-v').inputValue()),12345.6789);
 await page.locator('#field-v').fill('0.01357');assert.equal(Number(await page.locator('#slider-v').inputValue()),.01357);
 await page.locator('#field-v').fill('100');await page.locator('#field-current').fill('40');await page.locator('#field-fresh').fill('0');
 const pct=page.locator('#slider-pct');await pct.scrollIntoViewIfNeeded();const box=await pct.boundingBox();await page.mouse.move(box.x+box.width*.3,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width*.5,box.y+box.height/2,{steps:12});await page.mouse.up();
 const percent=Number(await page.locator('#field-pct').inputValue());assert.ok(percent>=49&&percent<=51);assert.match(await page.locator('.primary-metric .metric-value').innerText(),/20/);
 assert.equal(await pct.evaluate(el=>el===document.activeElement),true);const max=await pct.getAttribute('max');await pct.press('ArrowRight');assert.equal(Number(await page.locator('#field-pct').inputValue()),percent+1);assert.equal(await pct.getAttribute('max'),max,'range must not move during drag');
 await page.locator('#unit-us').click();assert.ok(Math.abs(Number(await page.locator('#slider-v').inputValue())-100/GAL)<.001);await page.locator('#unit-metric').click();await page.reload();await pct.waitFor();assert.equal(Number(await pct.inputValue()),percent+1);
 await page.locator('#field-v').fill('');assert.equal(await page.locator('.primary-metric').count(),0);await pct.press('ArrowRight');assert.equal(await page.locator('.primary-metric').count(),0,'no stale result with another field blank');await page.locator('#slider-v').press('ArrowRight');await page.locator('.primary-metric').waitFor();
 await page.screenshot({path:`${dir}/desktop.png`,fullPage:true});
 const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));await phone.goto(`${base}#tool=change&units=metric`);await phone.locator('#slider-v').scrollIntoViewIfNeeded();await phone.locator('#quick-result').waitFor({state:'visible'});
 await phone.locator('#slider-pct').tap();const touched=Number(await phone.locator('#field-pct').inputValue());assert.ok(touched>=49&&touched<=51);assert.match(await phone.locator('#quick-value').innerText(),/After the change/);
 const touchRange=phone.locator('#slider-pct');const touchBox=await touchRange.boundingBox();const cdp=await mobile.newCDPSession(phone);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchBox.x+touchBox.width*.5,y:touchBox.y+22}]});
 for(const t of [.55,.6,.65,.7])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchBox.x+touchBox.width*t,y:touchBox.y+22}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(Number(await phone.locator('#field-pct').inputValue())>60,'touch drag updates result');
 await phone.screenshot({path:`${dir}/phone-sliders.png`});await phone.locator('#field-v').fill('');assert.match(await phone.locator('#quick-value').innerText(),/Inputs need attention/);await phone.locator('#slider-v').tap();await phone.locator('#quick-result-button').click();await phone.locator('#quick-result').waitFor({state:'hidden'});
 await phone.setViewportSize({width:320,height:720});await phone.locator('#slider-pct').scrollIntoViewIfNeeded();assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await phone.screenshot({path:`${dir}/small-phone.png`});
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('#slider-pct').isVisible(),false);assert.equal(await page.locator('#quick-result').isVisible(),false);
 results.push({interaction:'mouse drag, keyboard, exact values, adaptive ranges, units, reload, blank validation, touch, mobile summary, print',passed:true});assert.deepEqual(errors,[]);
 await writeFile(`${dir}/results.json`,JSON.stringify({base,results,errors},null,2));console.log(JSON.stringify({passed:results.length,errors,dir}));
}finally{await browser.close();}
