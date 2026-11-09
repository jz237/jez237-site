import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {calculators,defaults,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {fieldChoices} from '../../aquarium-toolbox/presets.mjs';
const base=process.argv[2]||'http://127.0.0.1:8875/aquarium-toolbox/';
const dir=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-presets-20261109/presets-local';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/home/jez237/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const errors=[],results=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('#field-l').waitFor();
 for(const us of [true,false]){
  await page.locator(us?'#unit-us':'#unit-metric').click();
  for(const c of calculators){
   const fields=c.fields.filter(f=>fieldChoices(c,f,us,defaults(c)));if(!fields.length)continue;
   await page.evaluate(id=>location.hash=`tool=${id}`,c.id);await page.waitForFunction(title=>document.querySelector('.calc-heading h2')?.textContent===title,c.title);
   for(const f of fields){const buttons=page.locator(`[data-choice-field="${f.key}"]`);if(!await buttons.count())continue;
    const choice=fieldChoices(c,f,us,defaults(c)).options[0];await buttons.first().click();
    assert.equal(await buttons.first().getAttribute('aria-pressed'),'true');
    const raw=await page.evaluate(({id,key})=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')).inputs[id]?.[key],{id:c.id,key:f.key});
    // A physically impossible combination can intentionally be withheld from storage.
    if(!await page.locator('.error-card').count())assert.ok(Math.abs(raw-choice.value)<1e-8,`${c.id}.${f.key} preset conversion`);
    await page.locator('#reset').click();results.push({tool:c.id,field:f.key,unit:us?'US':'metric',passed:true});
   }
  }
 }
 await page.goto(`${base}#tool=substrate&units=metric`);await page.locator('#field-bagWeight').waitFor();await page.locator('#field-l').fill('100');await page.locator('#field-w').fill('40');await page.locator('#field-front').fill('5');await page.locator('#field-back').fill('5');
 await page.locator('[data-choice-field="bagWeight"]').filter({hasText:/^10 kg$/}).click();assert.match(await page.locator('.metric').last().innerText(),/3\s*bags/);
 await page.locator('[data-choice-field="density"]').filter({hasText:/Aquasoil/}).click();assert.match(await page.locator('.metric').last().innerText(),/2\s*bags/);
 await page.locator('#field-bagWeight').fill('12.3456');assert.equal(await page.locator('[data-choice-field="bagWeight"][aria-pressed=true]').count(),0);assert.equal(Number(await page.locator('#slider-bagWeight').inputValue()),12.3456);
 await page.locator('#field-bagMode').selectOption('volume');assert.equal(await page.locator('#field-bagWeight').count(),0);assert.equal(await page.locator('#field-bag').count(),1);
 await page.locator('[data-choice-field="bag"]').filter({hasText:/^9 L$/}).click();assert.match(await page.locator('.metric').last().innerText(),/3\s*bags/);
 await page.locator('#unit-us').click();assert.ok(Math.abs(Number(await page.locator('#field-bag').inputValue())-9/GAL)<.001);assert.equal(await page.locator('#field-bag').locator('..').innerText(),'US gal/bag');
 await page.locator('#field-bagMode').selectOption('weight');await page.locator('[data-choice-field="density"]').filter({hasText:/Gravel/}).click();await page.locator('.bag-options button').filter({hasText:'20 lb bag'}).click();assert.equal(await page.locator('#field-bagWeight').inputValue(),'20');assert.match(await page.locator('.metric').last().innerText(),/4\s*bags/);
 await page.locator('#field-bagWeight').fill('-1');await page.locator('#field-bagMode').selectOption('volume');await page.locator('.primary-metric').waitFor();
 await page.screenshot({path:`${dir}/desktop-substrate.png`,fullPage:true});
 const old={version:1,units:'us',current:'substrate',profiles:[{id:'old',name:'Existing reef',volume:200,type:'reef'}],activeProfile:'old',favorites:['substrate'],inputs:{substrate:{l:80,w:35,front:3,back:7,density:1.5,bag:8}}};
 await page.evaluate(raw=>localStorage.setItem('aquarium-toolbox-v1',JSON.stringify(raw)),old);await page.reload();await page.locator('#field-bag').waitFor();assert.equal(await page.locator('#field-bagMode').inputValue(),'volume');assert.match(await page.locator('.metric').last().innerText(),/2\s*bags/);assert.match(await page.locator('#profile-select').innerText(),/Existing reef/);
 const link=`${base}#${new URLSearchParams({tool:'substrate',units:'us',data:JSON.stringify(old.inputs.substrate)})}`;await page.goto(link);await page.locator('#field-bag').waitFor();assert.ok(Math.abs(Number(await page.locator('#field-bag').inputValue())-8/GAL)<.001);assert.equal(await page.locator('#field-bagMode').inputValue(),'volume');
 await page.locator('#profiles-open').click();await page.locator('[data-profile-volume]').filter({hasText:'55 US gal'}).click();assert.equal(await page.locator('#tank-volume').inputValue(),'55');await page.locator('#profile-form button[type=submit]').click();assert.ok(Math.abs(await page.evaluate(()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')).profiles[0].volume)-55*GAL)<1e-8);
 await page.locator('#settings-open').click();page.once('dialog',d=>d.accept());await page.locator('#import').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});await page.waitForFunction(()=>document.querySelector('#import-status').textContent==='Backup restored.');await page.locator('#settings-dialog [data-close]').click();assert.equal(await page.locator('#field-bagMode').inputValue(),'volume');
 results.push({interaction:'bag units, comparison, custom precision, density, invalid inactive field, old saves/imports/shares, profile sizes',passed:true});
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.goto(`${base}#tool=substrate&units=us`);await page.locator('#field-bagMode').selectOption('weight');await page.locator('[data-choice-field="bagWeight"]').filter({hasText:/^20 lb$/}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('#field-bagMode').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/phone-${width}.png`});
  await page.locator('.bag-guide').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/phone-${width}-comparison.png`});results.push({viewport:width,interaction:'presets and bag comparison',passed:true});
 }
 assert.deepEqual(errors,[]);await writeFile(`${dir}/results.json`,JSON.stringify({base,results,errors},null,2));console.log(JSON.stringify({passed:results.length,errors,dir}));
}finally{await browser.close();}
