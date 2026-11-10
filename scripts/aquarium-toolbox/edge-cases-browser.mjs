// Real DOM event regressions, usable against the original preview or Lab.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
const base=process.argv[2]||'http://127.0.0.1:8790/aquarium-toolbox/';
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-edgecases-20261109/browser';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('.primary-metric').waitFor();
 const report=await page.evaluate(async()=>{
  const {calculators,defaults,isVisible,calculate,GAL}=await import('./calculators.mjs');
  let checks=0;const tools={};const ok=(v,msg)=>{if(!v)throw new Error(msg);checks++;};
  const el=id=>document.getElementById(id),click=id=>el(id).click();
  const edit=(key,value)=>{const input=el('field-'+key);input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));};
  const go=id=>{document.querySelector('[data-category="all"]').click();document.querySelector(`.tool-link[data-tool="${id}"]`).click();click('reset');};
  const read=()=>document.querySelector('#result').textContent;
  const noStale=msg=>ok(!!document.querySelector('.error-card')&&!document.querySelector('.metric'),msg);
  const stored=()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1'));
  const valid=msg=>ok(!!document.querySelector('.primary-metric')&&!/NaN|Infinity/.test(read()),msg);
  for(const c of calculators){
   go(c.id);valid(c.id+' default');const before=stored().inputs[c.id];
   click('unit-metric');ok(JSON.stringify(stored().inputs[c.id])===JSON.stringify(before),c.id+' units preserve scenario');
   click('unit-us');ok(JSON.stringify(stored().inputs[c.id])===JSON.stringify(before),c.id+' return units preserve scenario');
   const fields=c.fields.filter(f=>!f.options&&isVisible(c.id,f.key,defaults(c,true)));
   for(const f of fields){
    click('reset');edit(f.key,'');noStale(c.id+'.'+f.key+' blank');
    click('unit-metric');ok(el('field-'+f.key).value==='',c.id+'.'+f.key+' blank survives units');noStale('no old result after units');
    click('unit-us');click('reset');
    edit(f.key,-999999);noStale(c.id+'.'+f.key+' negative');click('reset');
    // Native slider ends must never inject NaN, even if cross-field constraints reject an endpoint.
    for(const end of ['min','max']){const slider=el('slider-'+f.key);slider.value=slider[end];slider.dispatchEvent(new Event('input',{bubbles:true}));ok(!/NaN|Infinity/.test(read()),c.id+'.'+f.key+' slider '+end);click('reset');}
   }
   for(const f of c.fields.filter(f=>f.options))for(const [value]of f.options){
    click('reset');edit(f.key,value);ok(!!document.querySelector('.primary-metric,.error-card'),c.id+' selector '+value);ok(!/NaN|Infinity/.test(read()),c.id+' selector finite');
   }
   tools[c.id]={numericFields:fields.length,passed:true};
  }
  go('tank');edit('l','');edit('shape','cylinder');noStale('blank relevant dimension survives shape');
  click('reset');edit('w','');edit('shape','cylinder');valid('irrelevant hidden dimension repaired');
  go('substrate');edit('bagWeight','');edit('bagMode','volume');valid('hidden bag weight not blocking volume bags');
  go('label');edit('bottle','');edit('unit','tablets');noStale('new dose unit requires label amount');edit('dose',1);valid('hidden bottle not blocking tablets');
  go('stocking');edit('kind','goldfish');ok(!el('field-size'),'goldfish hides the fish-size input');ok(/fancy goldfish/.test(read()),'goldfish get the gallons-per-fish guideline');
  edit('kind','marine');ok(!/tetra|guppy|goldfish/.test([...document.querySelectorAll('[data-choice-field="size"]')].map(b=>b.textContent).join(' ')),'saltwater size shortcuts are saltwater fish');ok(/5 gallons/.test(read()),'saltwater gets the cautious rule');
  go('doser');edit('collected',.001);edit('seconds',60);edit('daily',100);noStale('impossible pump runtime');
  go('ato');edit('daily',0);valid('zero evaporation');ok(/no top-off/.test(read()),'zero evaporation says no top off');
  go('heater');edit('room',90);edit('target',78);ok(/cannot cool/.test(read()),'heater cannot cool');
  go('tank');click('unit-metric');edit('l',5000);edit('w',5000);edit('h',5000);edit('fill',100);edit('displacement',0);valid('large geometry supported');
  const volume=stored().profiles[0].volume;click('apply-volume');ok(stored().profiles[0].volume===volume,'oversize result cannot corrupt saved tank');
  go('turnover');click('unit-us');edit('v',125);edit('kind','sps');edit('flow',2000);
  ok(Number(el('slider-flow').max)>=5000,'SPS slider reaches recommendation');
  if(document.querySelector('.aqt')){
   ok(/reef-flow/.test(document.querySelector('.aqt-art img').src),'SPS reef image');
   ok(!!document.querySelector('.aqt-bar.is-low'),'below range warning colour');
   go('watercost');ok(/water-change/.test(document.querySelector('.aqt-art img').src),'freshwater cost image');edit('salt',5);ok(/\/salt.webp/.test(document.querySelector('.aqt-art img').src),'marine cost image');
   go('energy');for(const k of ['lights','pumps','heater','other'])edit(k,0);ok([...document.querySelectorAll('.aqt-bar__col span')].every(e=>e.style.height==='0%'),'zero bars truly zero');
   go('ammonia');edit('tan',.001);ok(/Toxic part: \S/.test(document.querySelector('.aqt-chips').textContent)&&!/Toxic part: 0 ppm/.test(document.querySelector('.aqt-chips').textContent),'tiny toxic fraction remains nonzero');
   go('pump');click('unit-metric');edit('h1',1);edit('h2',3);edit('head',1.2);ok(Math.abs(parseFloat(document.querySelectorAll('.aqt-trend__dot')[1].style.left)-10)<.01,'pump graph x position proportional');
   go('consumption');edit('start',8);edit('end',8);ok([...document.querySelectorAll('.aqt-trend__dot')].every(e=>e.style.top==='50%'),'flat line visible in centre');
  }
  return {checks,tools};
 });
 // Reload and share retain the same canonical values.
 await page.locator('#share-result').click();const link=await page.locator('#share-url').inputValue();
 await page.goto(link);await page.reload();await page.locator('.primary-metric').waitFor();assert.doesNotMatch(await page.locator('#result').innerText(),/NaN|Infinity/);report.checks++;
 for(const width of [390,320]){
  await page.setViewportSize({width,height:850});
  for(const id of Object.keys(report.tools)){
   await page.goto(base+'#tool='+id);await page.locator('#reset').click();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert.equal(overflow,false,`${id} overflow at ${width}`);report.checks++;
  }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'#tool=turnover');await page.locator('#unit-us').click();await page.locator('#field-kind').selectOption('sps');await page.locator('#field-v').fill('125');await page.locator('#field-flow').fill('2000');
 await page.locator('.calculator-shell').screenshot({path:out+'/flow-desktop.jpg',type:'jpeg',quality:85});
 await page.setViewportSize({width:390,height:850});await page.locator('.calculator-shell').screenshot({path:out+'/flow-phone.jpg',type:'jpeg',quality:85});
 assert.deepEqual(errors,[]);report.errors=errors;report.base=base;await writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
