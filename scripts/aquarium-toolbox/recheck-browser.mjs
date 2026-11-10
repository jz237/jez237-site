// Customer workflows missed by per-form checks: preserve values through the
// complete save/reload/export/import/share lifecycle, not just calculate().
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
const base=process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/';
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-recheck-20261110/browser';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'});
let checks=0;const errors=[];
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const equal=(a,b,msg)=>{assert.equal(a,b,msg);checks++;};
try{
 for(const width of [1440,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:950}});
  await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const p=await ctx.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base);await p.locator('.primary-metric').waitFor();
  const go=async id=>{await p.locator('[data-category=all]').click();await p.locator(`.tool-link[data-tool=${id}]`).click();await p.locator('#reset').click();};
  const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')));
  const edit=(k,v)=>p.locator('#field-'+k).fill(String(v));
  await go('salt');await edit('target','1.000754');
  equal(await p.locator('.primary-metric').count(),1,'SG endpoint is calculable');
  equal((await saved()).inputs.salt.target,1,'SG endpoint is saved, not silently dropped');
  await p.locator('#favorite').click();await p.reload();await p.locator('.primary-metric').waitFor();
  equal((await saved()).inputs.salt.target,1,'SG endpoint survives reload');
  check((await saved()).favorites.includes('salt'),'favorites survive valid boundary values');
  await p.locator('#share-result').click();const link=await p.locator('#share-url').inputValue();await p.locator('#share-dialog [data-close]').click();
  const shared=await ctx.newPage();await shared.goto(link);await shared.locator('.primary-metric').waitFor();
  equal(await shared.evaluate(()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')).inputs.salt.target),1,'shared SG is unchanged');await shared.close();
  await go('glass');await p.locator('#unit-us').click();await edit('t','0.03937007874015748');
  equal((await saved()).inputs.glass.t,1,'inch conversion noise is normalized before saving');
  await p.reload();await p.locator('.primary-metric').waitFor();equal((await saved()).inputs.glass.t,1,'converted value reloads');check((await saved()).favorites.includes('salt'),'converted endpoint does not reset unrelated settings');
  await go('pipe');await p.locator('#unit-metric').click();await edit('diameter',1000);await p.locator('#unit-us').click();await p.locator('#slider-diameter').press('End');
  equal(await p.locator('.error-card').count(),0,'slider End is not outside the allowed domain');equal((await saved()).inputs.pipe.diameter,1000,'slider preserves its physical endpoint');
  await go('change');await p.locator('#unit-metric').click();await edit('v',.01);await p.locator('#unit-us').click();await p.locator('#slider-v').press('Home');
  equal(await p.locator('.error-card').count(),0,'slider Home is in domain');equal((await saved()).inputs.change.v,.01,'small gallon endpoint is exact');
  // Renaming, changing units or opening a tank must never round its water volume.
  await p.locator('#unit-metric').click();await p.locator('#profiles-open').click();await p.locator('#tank-volume').fill('151.41647136');await p.locator('#tank-name').fill('Exact volume');await p.locator('#profile-form').evaluate(el=>el.requestSubmit());
  for(const unit of ['metric','us']){
   await p.locator('#unit-'+unit).click();await p.locator('#profiles-open').click();await p.locator('#tank-name').fill('Renamed '+unit);await p.locator('#profile-form').evaluate(el=>el.requestSubmit());
   equal((await saved()).profiles[0].volume,151.41647136,'name-only edit preserves exact '+unit+' volume');
  }
  await p.locator('#profiles-open').click();await p.locator('#tank-volume').fill('41');await p.locator('#profile-form').evaluate(el=>el.requestSubmit());
  equal((await saved()).profiles[0].volume,41*3.785411784,'explicitly editing volume still works');
  // Exercise real exported bytes and the actual restore confirmation.
  await p.locator('#settings-open').click();const download=p.waitForEvent('download');await p.locator('#export').click();const file=await download;const path=`${out}/backup-${width}.json`;await file.saveAs(path);const raw=JSON.parse(await readFile(path,'utf8'));
  equal(raw.inputs.salt.target,1,'backup contains the corrected SG endpoint');
  // A backup from the previous build can contain harmless conversion noise.
  raw.inputs.glass.t=.9999999999999999;raw.inputs.salt.target=.9999999999998958;
  p.once('dialog',d=>d.accept());await p.locator('#import').setInputFiles({name:'old-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(raw))});
  await p.waitForFunction(()=>document.querySelector('#import-status').textContent==='Backup restored.');
  equal((await saved()).inputs.glass.t,1,'old backup endpoint repaired');equal((await saved()).inputs.salt.target,1,'old SG backup repaired');
  raw.inputs.salt.target=.999999;await p.locator('#import').setInputFiles({name:'invalid-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(raw))});
  // The restore reads the file asynchronously: wait for its verdict instead of sampling the previous status.
  await p.waitForFunction(()=>document.querySelector('#import-status').textContent!=='Backup restored.',null,{timeout:10000}).catch(()=>{});
  check((await p.locator('#import-status').textContent()).startsWith('Could not restore:'),'genuinely out-of-range backup still fails: '+await p.locator('#import-status').textContent());
  equal((await saved()).inputs.salt.target,1,'failed import is atomic');await p.locator('#settings-dialog [data-close]').click();
  for(const data of ['{bad',JSON.stringify({v:100,dose:5})]){
   await p.goto(base+'#tool=label&data='+encodeURIComponent(data));await p.locator('.error-card').waitFor();
   equal(await p.locator('.primary-metric').count(),0,'broken dose link never supplies invented label numbers');
   check(await p.locator('#field-dose').inputValue()==='','invalid link requires input');
  }
  await p.screenshot({path:`${out}/invalid-link-${width}.png`,fullPage:true});
  await p.locator('#reset').click();equal(await p.locator('.primary-metric').count(),1,'explicit Reset can still open an example');
  await go('series');await p.locator('#unit-metric').click();await edit('current',.0000000001);await edit('fresh',10000000);await edit('pct',0);
  check(/1\.000e-10/.test(await p.locator('.primary-metric').textContent()),'zero-change preserves a nonzero reading');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no page overflow');
  await p.screenshot({path:`${out}/series-${width}.png`,fullPage:true});
  await ctx.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${out}/results.json`,JSON.stringify({base,checks,errors},null,2));console.log(JSON.stringify({base,checks,errors,out}));
}finally{await browser.close();}
