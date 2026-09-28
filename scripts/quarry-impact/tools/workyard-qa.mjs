import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const output=process.env.QUARRY_WORKYARD_OUTPUT;
assert.ok(output,'Use a fresh QUARRY_WORKYARD_OUTPUT directory');
assert.equal(await fs.access(path.join(output,'report.json')).then(()=>true,()=>false),false);
await fs.mkdir(output,{recursive:true});
const views=[
  {name:'containers-road',p:[-69,2.6,43],look:[-48,1.35,59]},
  {name:'container-doors',p:[-72,2.1,63],look:[-60,1.35,59]},
  {name:'container-surface',p:[-61,1.65,54.5],look:[-61,1.3,59]},
  {name:'excavator-front',p:[49,3.7,-27],look:[60,3,-39]},
  {name:'excavator-side',p:[71,3.2,-28],look:[62,3,-40]},
  {name:'excavator-tracks',p:[64,.95,-34],look:[62,.9,-41]},
  {name:'works-approach',p:[-31,3.5,-17],look:[-57,5,-43]},
  {name:'conveyor',p:[-56,4,-69],look:[-63,5,-53]},
  {name:'silos',p:[-86,4,-30],look:[-66,7,-50]},
  {name:'barrier-close',p:[3,1.35,41],look:[2,.8,46]},
  {name:'fence-close',p:[8,2.1,44],look:[8,2,50]},
  {name:'arena-wide',p:[-5,3.4,-23],look:[60,3,-40]},
];
const report={viewport:[2560,1440],quality:'ultra',views:[],errors:[],assets:[],requests:[]};
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
  const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('requestfailed',r=>report.errors.push(r.url()+' '+r.failure()?.errorText));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());if(/workyard/.test(r.url()))report.requests.push(r.url());});
  const url=process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/';
  await page.goto(url);await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  report.bundle=await page.locator('script[type="module"]').getAttribute('src');
  const app=await page.request.get(new URL(report.bundle,url).href);report.bundleSha256=createHash('sha256').update(await app.body()).digest('hex');
  await page.evaluate(async()=>{__quarry.setQuality('ultra');await __quarry.start('playground');__quarry.autopilot(false);__quarry.mute();__quarry.teleport(0,0,-20,0);__quarry.simulate(.3);document.querySelector('#ui').style.visibility='hidden';});
  if(process.env.QUARRY_WORKYARD_LIGHTING)await page.evaluate(v=>__quarry.lighting(v),JSON.parse(process.env.QUARRY_WORKYARD_LIGHTING));
  for(const view of views.filter(v=>!process.env.QUARRY_WORKYARD_VIEWS||process.env.QUARRY_WORKYARD_VIEWS.split(',').includes(v.name))){
    if(view.name==='barrier-close')await page.evaluate(async()=>{await __quarry.start('derby');__quarry.simulate(.1);document.querySelector('#ui').style.visibility='hidden';});
    await page.evaluate(v=>__quarry.captureCamera(v.p,v.look),view);
    await page.waitForTimeout(1400);await page.screenshot({path:path.join(output,view.name+'.png')});
    report.views.push({...view,...await page.evaluate(()=>({pose:__quarry.cameraPose,stats:__quarry.stats,lighting:__quarry.daylight}))});
  }
  for(const asset of [...new Set(report.requests)]){
    const r=await page.request.get(asset);assert.equal(r.status(),200);const bytes=await r.body();
    report.assets.push({url:asset,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,views:report.views.length,errors:report.errors,failure:report.failure,bundle:report.bundle}));}
