import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {calculators} from '../../aquarium-toolbox/calculators.mjs';
const base=process.argv[2]||'http://127.0.0.1:8873/aquarium-toolbox/';
const dir=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-toolbox-20261109/local';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/home/jez237/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const errors=[],results=[];
try{
 for(const [label,width,height] of [['desktop',1440,1100],['phone',390,844],['small-phone',320,720]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();page.on('pageerror',err=>errors.push(`${label}: ${err.message}`));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
  await page.goto(base);await page.locator('.primary-metric').waitFor();
  await page.screenshot({path:`${dir}/${label}-tank.png`,fullPage:true});
  for(const c of calculators){await page.evaluate(id=>{location.hash=`tool=${id}`;},c.id);await page.waitForFunction(title=>document.querySelector('.calc-heading h2')?.textContent===title,c.title);await page.locator('.primary-metric').waitFor();assert.equal(await page.locator('.error-card').count(),0,c.id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label} overflow: ${c.id}`);results.push({viewport:label,tool:c.id,passed:true});}
  await page.evaluate(()=>{location.hash='tool=change';});await page.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Water change planner');
  await page.locator('#unit-metric').click();await page.locator('#field-pct').fill('50');await page.locator('#field-current').fill('40');await page.locator('#field-fresh').fill('0');
  assert.match(await page.locator('.primary-metric .metric-value').innerText(),/20/);
  await page.screenshot({path:`${dir}/${label}-water-change.png`,fullPage:true});
  await page.locator('#field-v').fill('');assert.equal(await page.locator('.primary-metric').count(),0);assert.equal(await page.locator('.error-card').count(),1);
  await page.locator('#field-pct').fill('25');assert.equal(await page.locator('.primary-metric').count(),0);
  await page.locator('#field-v').fill('100');await page.locator('.primary-metric').waitFor();
  await page.locator('#favorite').click();await page.locator('#search').fill('paintball');assert.equal(await page.locator('.tool-link').count(),1);assert.match(await page.locator('.tool-link').innerText(),/CO₂ cylinder/);await page.locator('#search').fill('zzzz');assert.equal(await page.locator('#empty-search').isVisible(),true);await page.locator('#search').fill('');
  await page.locator('#share-result').click();const url=await page.locator('#share-url').inputValue();assert.ok(url.includes('data='));await page.locator('#share-dialog [data-close]').click();
  const shared=await context.newPage();await shared.goto(url);await shared.locator('.primary-metric').waitFor();assert.equal(await shared.locator('#field-v').inputValue(),'100');assert.equal(await shared.locator('#field-pct').inputValue(),'25');await shared.close();
  await page.locator('#profiles-open').click();await page.locator('#tank-name').fill('Planted 40');await page.locator('#tank-volume').fill('151.41647136');await page.locator('#new-profile').click();assert.match(await page.locator('#profile-select option:checked').textContent(),/Planted 40/);
  await page.reload();await page.locator('.primary-metric').waitFor();assert.match(await page.locator('#profile-select option:checked').textContent(),/Planted 40/);
  await page.locator('#unit-us').click();assert.equal(Number(await page.locator('#field-v').inputValue()),40);await page.locator('#unit-metric').click();assert.ok(Math.abs(Number(await page.locator('#field-v').inputValue())-151.41647136)<.001);
  assert.ok(Math.abs(await page.evaluate(()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')).inputs.change.v)-151.41647136)<.000001);
  await page.locator('#field-v').fill('-1');await page.reload();await page.locator('.primary-metric').waitFor();assert.match(await page.locator('#profile-select option:checked').textContent(),/Planted 40/);
  if(label==='desktop'){
    await page.locator('#settings-open').click();const downloading=page.waitForEvent('download');await page.locator('#export').click();const download=await downloading;await download.saveAs(`${dir}/backup.json`);const data=JSON.parse(await readFile(`${dir}/backup.json`,'utf8'));assert.equal(data.version,1);assert.equal(data.profiles.length,2);
    const originalName=data.profiles[1].name;data.profiles[1].name='<img src=x onerror=alert(1)>';
    page.once('dialog',d=>d.accept());await page.locator('#import').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForFunction(()=>document.querySelector('#import-status').textContent==='Backup restored.');
    assert.match(await page.locator('#profile-select option:checked').textContent(),/<img src=x/);assert.equal(await page.locator('#profile-select img').count(),0);
    await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await page.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Could not restore:'));
    data.profiles[1].name=originalName;page.once('dialog',d=>d.accept());await page.locator('#import').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForFunction(()=>document.querySelector('#import-status').textContent==='Backup restored.');await page.locator('#settings-dialog [data-close]').click();
    await page.pdf({path:`${dir}/water-change.pdf`,format:'A4',printBackground:true,margin:{top:'15mm',right:'12mm',bottom:'15mm',left:'12mm'}});
    await page.evaluate(()=>location.hash='tool=tank');await page.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Tank volume');await page.locator('#field-shape').selectOption('cylinder');assert.equal(await page.locator('#field-w').count(),0);await page.screenshot({path:`${dir}/desktop-cylinder.png`,fullPage:true});
    await page.goto(`${base}#tool=change&data=%7Bbad`);await page.locator('.error-card').waitFor();assert.equal(await page.locator('.primary-metric').count(),0);assert.match(await page.locator('#toast').innerText(),/invalid/);
    results.push({viewport:label,interaction:'backup download, restore, malformed backup, untrusted text, print PDF, shape controls, invalid shared data',passed:true});
  }
  results.push({viewport:label,interaction:'validation, live math, favorites, search, share, profiles, reload, unit roundtrip',passed:true});await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${dir}/results.json`,JSON.stringify({base,results,errors},null,2));console.log(JSON.stringify({base,passed:results.length,errors,dir}));
}finally{await browser.close();}
