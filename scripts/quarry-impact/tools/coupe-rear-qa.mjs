// Matched close-range views of the coupe, with unchanged game lighting and
// isolated lighting diagnostics. Unique output directories preserve evidence.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const output=process.env.QUARRY_CAR_QA_OUTPUT;
assert.ok(output,'Set a new QUARRY_CAR_QA_OUTPUT directory');
assert.equal(await fs.access(path.join(output,'report.json')).then(()=>true,()=>false),false);
await fs.mkdir(output,{recursive:true});
const report={viewport:[2560,1440],quality:'ultra',views:[],errors:[],assets:[]};
const hash=b=>createHash('sha256').update(b).digest('hex');
const views=[
  {name:'rear-quarter',p:[-5,1.75,-25],look:[0,.8,-20]},
  {name:'rear-close',p:[-2.8,1.4,-24.2],look:[0,.82,-21.3]},
  {name:'rear-centre',p:[0,1.25,-25.8],look:[0,.78,-21]},
  {name:'rear-low',p:[3.4,.6,-24],look:[0,.62,-21]},
  {name:'rear-chase',p:[0,3.7,-28],look:[0,.85,-16]},
  {name:'front-control',p:[6,2.8,-13],look:[0,1,-20]},
];
let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
  const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
  page.on('requestfailed',r=>report.errors.push(`${r.url()} ${r.failure()?.errorText}`));
  const url=process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/';
  await page.goto(url);await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  report.bundle=await page.locator('script[type="module"]').getAttribute('src');
  for(const asset of [report.bundle,'models/coupe.glb','models/sedan.glb','models/hatch.glb']){
    const response=await page.request.get(new URL(asset,url).href);assert.equal(response.status(),200);
    const bytes=await response.body();report.assets.push({asset,bytes:bytes.length,sha256:hash(bytes)});
  }
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async()=>{
    __quarry.setQuality('ultra');await __quarry.start('playground');__quarry.autopilot(false);__quarry.mute();
    __quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});
    __quarry.teleport(0,0,-20,0);__quarry.simulate(.25);
    document.querySelector('#ui').style.visibility='hidden';
  });
  const capture=async(view)=>{
    await page.evaluate(v=>__quarry.captureCamera(v.p,v.look),view);
    await page.waitForTimeout(1300);await page.screenshot({path:path.join(output,view.name+'.png')});
    report.views.push({...view,...await page.evaluate(()=>({stats:__quarry.stats,car:__quarry.inspect()[0]}))});
    console.log(`Captured ${view.name}`);
  };
  for(const view of views)await capture(view);
  await page.evaluate(()=>__quarry.lighting({sun:0}));
  await capture({...views[1],name:'diagnostic-no-sun'});
  await page.evaluate(()=>{__quarry.lighting({sun:3});__quarry.setQuality('medium');});
  await capture({...views[1],name:'diagnostic-medium-no-shadows'});
  await page.evaluate(()=>{__quarry.setQuality('ultra');__quarry.damage(0,19,'rear');});
  await capture({...views[1],name:'rear-moderate-damage'});
  await page.evaluate(()=>__quarry.damage(0,23,'rear'));
  await capture({...views[1],name:'rear-bumper-detached'});
  report.damage=await page.evaluate(()=>__quarry.inspect()[0]);
  assert.ok(report.damage.detached>0,'A substantial rear impact detaches a panel');
  await page.evaluate(()=>{__quarry.recover();__quarry.teleport(0,0,-20,0);__quarry.simulate(.25);});
  await capture({...views[1],name:'rear-repaired'});
  report.repair=await page.evaluate(()=>__quarry.inspect()[0]);
  assert.equal(report.repair.health,100);assert.equal(report.repair.detached,0);
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.error=String(error);process.exitCode=1;}
finally{
  if(browser){await browser.close();report.browserClosed=true;}
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.passed,error:report.error,assets:report.assets,damage:report.damage,repair:report.repair,errors:report.errors}));
}
