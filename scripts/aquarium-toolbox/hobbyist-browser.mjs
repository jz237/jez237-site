// Everyday-use browser checks: what a hobbyist sees and taps, in US units.
// node scripts/aquarium-toolbox/hobbyist-browser.mjs [base-URL] [evidence-directory]
import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {calculators,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {firstExamples} from '../../aquarium-toolbox/legacy.mjs';
const base=process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/';
const dir=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-hobbyist-20261109/hobbyist-local';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/home/jez237/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const errors=[],results=[];
const check=name=>{results.push({name,passed:true});if(process.env.TOOLBOX_TEST_PROGRESS)console.error('ok',name);};
const KEY='aquarium-toolbox-v1';
async function open(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:1100},...options});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
  const tools={
    go:async(id,extra='')=>{await page.goto(`${base}#tool=${id}${extra}`);await page.waitForFunction(id=>document.querySelector('.calc-heading h2')&&location.hash.includes(`tool=${id}`),id);await page.locator('#result').waitFor();},
    fill:async values=>{for(const [k,v]of Object.entries(values))await page.locator(`#field-${k}`).fill(String(v));},
    value:async key=>Number(await page.locator(`#field-${key}`).inputValue()),
    unit:async key=>page.locator(`#field-${key}`).locator('..').locator('.input-unit').innerText(),
    label:async key=>page.locator(`label[for="field-${key}"]`).innerText(),
    metric:async i=>page.locator('.metric').nth(i).innerText(),
    message:async()=>page.locator('.result-message').innerText(),
    saved:async()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY),
    chip:async(field,text)=>page.locator(`[data-choice-field="${field}"]`).filter({hasText:text}).first().click()
  };
  return {context,page,...tools};
}
try{
 // 1. A first visit starts from a familiar tank and round numbers everywhere.
 {
  const {context,page,go,value,metric}=await open();
  await page.goto(base);await page.locator('.primary-metric').waitFor();
  assert.match(await page.locator('#profile-select option:checked').textContent(),/My aquarium · 20 US gal/);
  assert.equal(await value('l'),24);assert.equal(await value('w'),12);assert.equal(await value('h'),16);assert.match(await metric(0),/Water in the tank\s*17\s*US gal/);
  assert.equal(await page.locator('.category[aria-pressed=true]').innerText().then(t=>t.replace(/\s+/g,' ').trim()),'Most used 11');
  assert.deepEqual((await page.locator('.tool-link').allInnerTexts()).slice(0,4).map(t=>t.split('\n')[0]),['Tank volume','Gravel & substrate','Water change planner','Water conditioner & product dose']);
  assert.equal(await page.locator('#tool-count').innerText(),'38');
  for(const c of calculators){
   await go(c.id);assert.equal(await page.locator('.error-card').count(),0,c.id);await page.locator('.primary-metric').waitFor();
   const shown=await page.locator('#calc-form .field').evaluateAll(fields=>fields.filter(f=>f.querySelector('input[type=number]')).map(f=>({key:f.querySelector('input[type=number]').name,value:f.querySelector('input[type=number]').value,unit:f.querySelector('.input-unit').textContent})));
   for(const f of shown){assert.match(f.value,f.unit==='SG'?/^\d(\.\d{1,4})?$/:/^-?\d+(\.\d{1,3})?$/,`${c.id}.${f.key} shows ${f.value} ${f.unit}`);assert.doesNotMatch(f.unit,/mg\/L/,`${c.id}.${f.key}`);}
   assert.doesNotMatch(await page.locator('.metrics').innerText(),/mg\/L|NaN|undefined/,c.id);
  }
  check('first visit: 20-gallon starter tank, Most used list, round US examples and ppm in all 38 tools');await context.close();
 }
 // 2. Picking a standard tank fills in its measurements.
 {
  const {context,page,go,value,metric,fill}=await open();
  await go('tank');await page.locator('#form-preset').selectOption({label:'55 gallon · 48 × 12 × 21 in'});
  assert.equal(await value('l'),47.75);assert.equal(await value('w'),12.25);assert.equal(await value('h'),20.25);assert.match(await metric(1),/51\s*US gal/);assert.match(await metric(0),/44\s*US gal/);
  assert.match(await page.locator('#form-preset option:checked').textContent(),/55 gallon/);assert.match(await page.locator('#toast').innerText(),/Measurements filled in/);
  await fill({l:40});assert.match(await metric(1),/43\s*US gal/);await page.reload();await page.locator('.primary-metric').waitFor();assert.equal(await page.locator('#form-preset').inputValue(),'');assert.equal(await value('l'),40);
  await page.locator('#field-shape').selectOption('cylinder');await page.locator('#form-preset').selectOption({label:'10 gallon · 20 × 10 × 12 in'});assert.equal(await page.locator('#field-shape').inputValue(),'rectangle');assert.equal(await value('w'),10.25);
  await go('weight');await page.locator('#form-preset').selectOption({label:'75 gallon · 48 × 18 × 21 in'});assert.equal(await value('v'),75);assert.equal(await value('glass'),98);assert.equal(await value('l'),48.5);assert.match(await metric(0),/lb/);
  await go('substrate');await page.locator('#form-preset').selectOption({label:'20 gallon long · 30 × 12 × 12 in'});assert.equal(await value('l'),30);assert.equal(await value('w'),12.25);
  await go('stocking');await page.locator('#form-preset').selectOption({label:'29 gallon · 30 × 12 × 18 in'});assert.equal(await value('v'),29);
  await page.locator('#unit-metric').click();assert.match(await page.locator('#form-preset').innerText(),/54 L · 60 × 30 × 30 cm/);
  await go('change');assert.equal(await page.locator('#form-preset').count(),0);
  check('standard tank picker fills tank, weight, substrate and stocking measurements');await context.close();
 }
 // 3. Bow-front, hexagon and corner tanks ask only for what applies.
 {
  const {context,page,go,fill,label,metric}=await open();
  await go('tank');await page.locator('#field-shape').selectOption('bowfront');
  assert.equal(await label('w'),'Width at the ends');assert.equal(await page.locator('#field-w2').count(),1);
  await fill({l:30,w:12,w2:15.5,h:21,fill:100,displacement:0});const bow=Number((await metric(0)).match(/([\d.]+)\s*US gal/)[1]);assert.ok(bow>37&&bow<40,`bow-front ${bow}`);assert.match(await page.locator('.diagram').innerText(),/Bow-front · 30 in long/);
  await fill({w2:10});assert.match(await page.locator('.error-card').innerText(),/deepest in the middle/);await fill({w2:15.5});await page.locator('.primary-metric').waitFor();
  await page.locator('#field-shape').selectOption('hexagon');assert.equal(await page.locator('#field-w').count(),0);assert.equal(await page.locator('#field-w2').count(),0);assert.equal(await label('l'),'Width across two flat sides');
  await fill({l:20,h:24});assert.match(await metric(0),/36\s*US gal/);assert.match(await page.locator('.diagram').innerText(),/Hexagon · 20 in across/);
  await page.locator('#field-shape').selectOption('corner');assert.equal(await label('l'),'Length of one straight side');assert.match(await metric(0),/33\s*US gal/);
  // A width left invalid while it was visible must not block shapes that do not use it.
  await page.locator('#field-shape').selectOption('rectangle');await fill({w:-3});assert.equal(await page.locator('.error-card').count(),1);await page.locator('#field-shape').selectOption('hexagon');await page.locator('.primary-metric').waitFor();
  check('bow-front, hexagon and corner tanks');await context.close();
 }
 // 4. Small amounts are not rounded away; water changes mention buckets; readings are ppm.
 {
  const {context,page,go,fill,metric,unit}=await open();
  await go('change');assert.equal(await unit('current'),'ppm');await fill({v:10,pct:25,current:40,fresh:0});
  assert.match(await metric(0),/After the change\s*30\s*ppm/);assert.match(await metric(1),/2\.5\s*US gal/);
  await fill({v:55,pct:40});assert.match(await metric(1),/22\s*US gal/);assert.match(await metric(1),/about 4\.4 five-gallon buckets/);
  await fill({v:2.5,pct:20});assert.match(await metric(1),/0\.5\s*US gal/);assert.match(await metric(1),/about 2 quarts/);
  await go('series');await page.locator('#steps-details summary').filter({hasText:'Change-by-change'}).click();assert.match(await page.locator('.results-table').innerText(),/After 1 change\s+60\.00 ppm/);
  await go('target');assert.match(await page.locator('.result-message').innerText(),/big change to do in one go/);
  await go('ro');assert.equal(await unit('rate'),'US gal/day');assert.match(await metric(0),/6\.4\s*hours\s*6 h 24 min/);
  await go('drip');assert.equal(await unit('v'),'cups');assert.match(await metric(0),/53\s*minutes/);
  await go('co2cylinder');assert.match(await metric(0),/277\s*days\s*about 9\.1 months/);
  check('small gallons, buckets, ppm readings and plain durations');await context.close();
 }
 // 5. Conditioner dose in the label's own unit.
 {
  const {context,page,go,fill,metric,unit}=await open();
  await go('label');assert.match(await metric(0),/2\s*mL\s*about ½ tsp/);assert.match(await metric(1),/125\s*doses/);
  await page.locator('#field-unit').selectOption('tbsp');assert.equal(await unit('dose'),'tbsp');assert.equal(await page.locator('#field-bottle').count(),0);
  await fill({v:20,dose:1,labelV:5});assert.match(await metric(0),/4\s*tbsp/);assert.equal(await page.locator('.metric').count(),1);
  await page.locator('#field-unit').selectOption('mL');assert.equal(await page.locator('#field-bottle').count(),1);await fill({dose:.5,labelV:10,v:5});assert.match(await metric(0),/0\.25\s*mL\s*use a graduated syringe/);
  check('product dose scales in mL, spoons and drops');await context.close();
 }
 // 6. Heater size, filter flow and stocking give an answer and say what it means.
 {
  const {context,page,go,fill,metric,message,chip,saved}=await open();
  await go('heater');assert.match(await metric(0),/Suggested heater size\s*75\s*W/);assert.match(await message(),/75 W heater is the next common size up/);
  await fill({v:40});await chip('room','65 °F');await chip('target','80 °F');assert.match(await metric(0),/150\s*W/);assert.match(await metric(2),/3\.7\s*W\/US gal/);
  await chip('installed','100 W');assert.match(await message(),/probably too small/);await chip('installed','150 W');assert.match(await message(),/should cope/);
  near((await saved()).inputs.heater.room,(65-32)/1.8);
  await fill({room:82});assert.match(await metric(0),/Suggested heater size\s*0\s*W/);assert.match(await message(),/cannot cool/);
  await go('turnover');assert.match(await metric(0),/5\s*×\/hour/);assert.match(await message(),/Right in the usual range of 4–6 times an hour/);assert.match(await metric(1),/80\s*US GPH/);
  await page.locator('#field-kind').selectOption('messy');assert.match(await message(),/below the usual 6–10/);assert.match(await metric(2),/200\s*US GPH/);
  await page.locator('#field-kind').selectOption('sps');assert.match(await metric(1),/600\s*US GPH/);
  await go('stocking');assert.match(await metric(0),/75\s*%/);assert.equal(await page.locator('.metric').count(),3);assert.match(await message(),/does not establish spare capacity/);
  await chip('size','3 in');assert.match(await metric(0),/150\s*%/);assert.match(await message(),/Above at least one classic/);
  await page.locator('#field-kind').selectOption('goldfish');assert.match(await message(),/cannot give a reliable stocking limit/);
  await fill({size:8,count:2});await page.locator('#field-kind').selectOption('tropical');assert.match(await message(),/minimum tank size recommended for each species/);
  check('heater size, filter flow and stocking results with plain guidance');await context.close();
 }
 // 7. Reef tools work in specific gravity or ppt without changing the saved quantity.
 {
  const {context,page,go,fill,metric,unit,value,saved,chip}=await open();
  await go('salinity');assert.equal(await unit('sa'),'SG');assert.equal(await value('sa'),1.0264);assert.equal(await page.locator('[data-salinity=sg]').getAttribute('aria-pressed'),'true');
  await fill({sa:1.025,sb:1});near((await saved()).inputs.salinity.sa,(1.025-1)/.000754);assert.match(await metric(0),/1\.020\s*SG\s*26\.5 ppt/);assert.match(await page.locator('.diagram').innerText(),/First: 1\.025/);
  await page.locator('[data-salinity=ppt]').click();assert.equal(await unit('sa'),'ppt');assert.ok(Math.abs(await value('sa')-33.156)<.001);assert.match(await metric(0),/26\.53\s*ppt\s*SG 1\.020/);near((await saved()).inputs.salinity.sa,(1.025-1)/.000754);assert.equal((await saved()).salinity,'ppt');
  await page.reload();await page.locator('.primary-metric').waitFor();assert.equal(await unit('sa'),'ppt');
  await page.locator('#share-result').click();const link=await page.locator('#share-url').inputValue();assert.match(link,/sal=ppt/);await page.locator('#share-dialog [data-close]').click();
  const other=await open();await other.page.goto(link);await other.page.locator('.primary-metric').waitFor();assert.equal(await other.unit('sa'),'ppt');assert.ok(Math.abs(await other.value('sa')-33.156)<.001);await other.context.close();
  await page.locator('[data-salinity=sg]').click();
  await go('adjust');await chip('target','1.025');await chip('fresh','1.000 · fresh RO water');assert.equal(await value('target'),1.025);assert.equal(await page.locator('.error-card').count(),0);assert.match(await metric(0),/US gal/);
  await fill({target:1.03});assert.match(await page.locator('.error-card').innerText(),/To lower salinity, add water that is less salty/);
  await go('sg');await fill({value:1.02});assert.match(await metric(0),/1\.020\s*SG/);assert.match(await metric(1),/26\.53\s*ppt/);await page.locator('[data-salinity=ppt]').click();await fill({value:35});assert.match(await metric(0),/1\.0264\s*SG/);assert.match(await metric(1),/35\s*ppt/);
  await page.locator('[data-salinity=sg]').click();await go('salt');assert.equal(await unit('target'),'SG');assert.match(await metric(0),/1\.56\s*lb\s*about 25 oz/);await chip('target','1.020 · fish-only low');assert.match(await metric(0),/1\.18\s*lb/);
  await go('ato');assert.equal(await unit('salinity'),'SG');assert.match(await metric(2),/SG/);
  check('specific gravity and ppt: entry, results, diagram, saved preference, shared link');await context.close();
 }
 // 8. Settings saved by the first preview: untouched examples become friendly, entered values are kept.
 {
  const {context,page,go,value,unit,saved}=await open();
  await page.goto(base);await page.locator('.primary-metric').waitFor();
  const first={version:1,units:'us',current:'tank',favorites:['tank','heater'],profiles:[{id:'default',name:'My aquarium',volume:100,type:'freshwater'}],activeProfile:'default',
   inputs:{tank:firstExamples.tank,change:firstExamples.change,heater:firstExamples.heater,turnover:firstExamples.turnover,head:firstExamples.head,weight:{...firstExamples.weight,glass:30},substrate:{...firstExamples.substrate,l:90,density:1.6}}};
  await page.evaluate(([key,raw])=>localStorage.setItem(key,JSON.stringify(raw)),[KEY,first]);await page.reload();await page.locator('.primary-metric').waitFor();
  assert.equal(await value('l'),24);assert.match(await page.locator('#profile-select option:checked').textContent(),/My aquarium · 20 US gal/);assert.equal(await page.locator('#favorite').getAttribute('aria-pressed'),'true');
  await go('change');assert.equal(await value('v'),20);await go('heater');assert.equal(await value('room'),68);assert.equal(await page.locator('.error-card').count(),0);
  await go('turnover');assert.equal(await value('flow'),100);await go('head');assert.equal(await value('diameter'),1.029);assert.equal(await page.locator('#field-k').count(),0);
  // Edited calculations survive: the 90 cm bed, its 1.6 kg/L material and the 30 kg tank.
  await go('substrate');assert.ok(Math.abs(await value('l')-90/2.54)<.001);assert.equal(await page.locator('#field-material').inputValue(),'custom');assert.equal(await unit('density'),'lb/US gal');near((await saved()).inputs.substrate.density,1.6);
  await go('weight');assert.ok(Math.abs(await value('glass')-30/.45359237)<.001);assert.equal(await page.locator('#field-water').inputValue(),'fresh');
  // A visitor's own saved tank is never changed, and tools keep following it.
  const own={...first,profiles:[{id:'old',name:'Existing reef',volume:200,type:'reef'}],activeProfile:'old',inputs:{change:{...firstExamples.change,v:200},tank:firstExamples.tank}};
  await page.evaluate(([key,raw])=>localStorage.setItem(key,JSON.stringify(raw)),[KEY,own]);await page.goto(base);await page.reload();await page.locator('.primary-metric').waitFor();
  assert.match(await page.locator('#profile-select option:checked').textContent(),/Existing reef · 53 US gal/);await go('change');assert.ok(Math.abs(await value('v')-200/GAL)<.001);
  // Metric settings are left exactly as saved.
  const metric={...first,units:'metric'};await page.evaluate(([key,raw])=>localStorage.setItem(key,JSON.stringify(raw)),[KEY,metric]);await page.goto(base);await page.reload();await page.locator('.primary-metric').waitFor();
  assert.equal(await value('l'),80);assert.match(await page.locator('#profile-select option:checked').textContent(),/100 L/);
  // An old shared link with fields that no longer exist still opens.
  await page.goto(`${base}#${new URLSearchParams({tool:'heater',units:'us',data:JSON.stringify(firstExamples.heater)})}`);await page.reload();await page.locator('.primary-metric').waitFor();assert.equal(await page.locator('#toast').isHidden(),true);assert.ok(Math.abs(await value('v')-100/GAL)<.001);
  await page.goto(`${base}#${new URLSearchParams({tool:'head',units:'us',data:JSON.stringify(firstExamples.head)})}`);await page.reload();await page.locator('.primary-metric').waitFor();assert.equal(await page.locator('#toast').isHidden(),true);assert.equal(await value('e90'),3);
  check('first-preview settings, backups and links upgrade without losing entered values');await context.close();
 }
 // 9. Unit switches preserve both starting examples and entered measurements.
 {
  const {context,page,go,fill,value}=await open();
  await page.goto(base);await page.locator('.primary-metric').waitFor();await page.locator('#unit-metric').click();
  assert.equal(await value('l'),60.96);assert.equal(await value('w'),30.48);assert.match(await page.locator('#profile-select option:checked').textContent(),/75\.71 L/);
  await fill({l:61});await page.locator('#unit-us').click();assert.ok(Math.abs(await value('l')-61/2.54)<.001);assert.match(await page.locator('#profile-select option:checked').textContent(),/20 US gal/);
  await page.locator('#unit-metric').click();assert.equal(await value('l'),61);
  await go('heater','&units=us');assert.equal(await value('room'),68);await page.locator('#unit-metric').click();assert.equal(await value('room'),20);assert.ok(Math.abs(await value('target')-25.555556)<.0005);
  check('unit switch preserves examples, saved tank and entered values');await context.close();
 }
 // 10. Search understands everyday words from any list; specialist tools are tagged.
 {
  const {context,page}=await open();
  await page.goto(base);await page.locator('.primary-metric').waitFor();
  const find=async words=>{await page.locator('#search').fill(words);return (await page.locator('.tool-link').allInnerTexts()).map(t=>t.split('\n')[0].replace(/\s*Advanced$/i,'').trim());};
  assert.ok((await find('gravel')).includes('Gravel & substrate'));assert.deepEqual(await find('how many fish'),['Stocking check']);assert.ok((await find('specific gravity')).includes('Salinity & specific gravity converter'));
  assert.ok((await find('dechlorinator')).includes('Water conditioner & product dose'));assert.ok((await find('what size heater')).includes('Heater size'));assert.ok((await find('acclimate')).includes('Drip acclimation timer'));
  assert.equal((await find('')).length,11);
  await page.locator('[data-category=all]').click();assert.equal(await page.locator('.tool-link').count(),38);assert.equal(await page.locator('.tool-tag').count(),8);
  await page.locator('[data-category=favorites]').click();assert.match(await page.locator('#empty-search').innerText(),/Tap the star/);
  await page.locator('[data-category=flow]').click();assert.deepEqual((await page.locator('.tool-link').allInnerTexts()).map(t=>t.split('\n')[0].replace(/\s*Advanced$/i,'').trim()).slice(0,2),['Filter & flow check','Return pump head height']);
  check('plain-word search across every tool, category order and Advanced tags');await context.close();
 }
 // 10b. A tool outside the open list is never left unmarked in the library.
 {
  const {context,page,go}=await open();
  const marked=async()=>page.locator('.tool-link[aria-current=true]').evaluateAll(links=>links.map(a=>a.dataset.tool));
  const pressed=async()=>page.locator('.category[aria-pressed=true]').getAttribute('data-category');
  // A shared link to a specialist tool opens its own category instead of Most used.
  await go('pipe');assert.deepEqual(await marked(),['pipe']);assert.equal(await pressed(),'flow');
  // A Most used tool opened from that category stays in view without jumping lists.
  await go('turnover');assert.deepEqual(await marked(),['turnover']);assert.equal(await pressed(),'flow');
  // Picking a search result from another list, then clearing the search, still shows it.
  await page.locator('[data-category=popular]').click();await page.locator('#search').fill('cylinder');await page.locator('.tool-link[data-tool=co2cylinder]').click();await page.locator('#search').fill('');
  assert.deepEqual(await marked(),['co2cylinder']);assert.equal(await pressed(),'plants');
  // Coming back with that tool saved, and no link, opens the same list.
  await page.goto(base);await page.reload();await page.locator('.primary-metric').waitFor();assert.deepEqual(await marked(),['co2cylinder']);assert.equal(await pressed(),'plants');
  check('library follows a tool opened by link, search or a saved visit');await context.close();
 }
 // 11. Phones: new controls fit, and print leaves the pickers out.
 for(const width of [390,320]){
  const {context,page,go}=await open({viewport:{width,height:844},hasTouch:true,isMobile:true});
  for(const id of ['tank','stocking','heater','salt','adjust','label','turnover','head','weight']){
   await go(id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}px overflow: ${id}`);
   for(const selector of ['#form-preset','.salinity-toggle','.choice-buttons']){const control=page.locator(selector).first();/* Not every tool has every control; a missing one must not wait out the timeout. */const box=await control.count()?await control.boundingBox():null;if(box)assert.ok(box.x>=0&&box.x+box.width<=width+1,`${width}px ${id} ${selector}`);}
  }
  await go('tank');await page.locator('#form-preset').selectOption({index:6});await page.locator('.primary-metric').waitFor();await page.locator('#form-preset').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/phone-${width}-tank.png`});
  await go('salt');await page.locator('.salinity-toggle').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/phone-${width}-salt.png`});
  await go('stocking');await page.locator('.result-panel').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/phone-${width}-stocking.png`});
  check(`phone ${width}px: pickers, toggles and results fit`);await context.close();
 }
 // The flow check asks the tank type first, names what to add up, and its slider reaches the usual range.
 {
  const {context,page,go,fill,value,metric,message,chip,label}=await open();
  await go('turnover');
  assert.deepEqual(await page.locator('#calc-form .field > label').allInnerTexts(),['Water in your tank','What kind of tank?','Flow rating of your filter']);
  const sliderMax=async()=>Number(await page.locator('#slider-flow').getAttribute('max'));
  assert.equal(await sliderMax(),500);await chip('v','125 US gal');assert.equal(await sliderMax(),2000);assert.equal(await value('flow'),100);
  // Said once: the note about the size on the box.
  const notes=await page.locator('.field:has(#field-v) small').allInnerTexts();assert.equal(notes.length,1);assert.match(notes[0],/size printed on the box.*Work out my volume/s);
  await page.locator('#field-kind').selectOption('sps');
  assert.equal(await label('flow'),'Total flow of all your pumps and wavemakers');assert.match(await page.locator('#help-flow').innerText(),/return pump and every powerhead or wavemaker/);
  assert.equal(await sliderMax(),10000);await fill({flow:2000});
  assert.match(await metric(0),/16\s*×\/hour/);assert.match(await metric(1),/3,750\s*US GPH/);assert.match(await metric(2),/5,000\s*US GPH/);assert.match(await message(),/below the usual 30–40 times an hour.*powerhead or wavemaker/);
  // The slider itself now reaches past the usual range.
  await page.locator('#slider-flow').press('End');assert.equal(await value('flow'),10000);assert.match(await message(),/More than the usual 30–40/);
  await page.locator('#slider-flow').press('Home');await page.locator('#slider-flow').press('PageUp');assert.equal(await value('flow'),1000);
  await page.locator('#field-kind').selectOption('return');assert.equal(await label('flow'),'Flow from your return pump');assert.match(await page.locator('#help-flow').innerText(),/head height/);assert.equal(await sliderMax(),2000);
  await page.locator('#field-kind').selectOption('messy');assert.equal(await label('flow'),'Flow rating of your filter');assert.match(await page.locator('#help-flow').innerText(),/more than one filter/);
  await page.screenshot({path:`${dir}/desktop-turnover.png`,fullPage:true});
  check('flow check: tank type first, wording and slider follow the tank');await context.close();
 }
 {
  const {context,page,go}=await open();
  await go('tank');await page.screenshot({path:`${dir}/desktop-tank.png`,fullPage:true});await go('heater');await page.screenshot({path:`${dir}/desktop-heater.png`,fullPage:true});await go('salt');
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.salinity-toggle').isVisible(),false);await go('tank');assert.equal(await page.locator('#form-preset').isVisible(),false);
  check('print hides pickers and toggles');await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${dir}/results.json`,JSON.stringify({base,results,errors},null,2));console.log(JSON.stringify({passed:results.length,errors,dir}));
}finally{await browser.close();}
function near(actual,expected,tolerance=1e-6){assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);}
