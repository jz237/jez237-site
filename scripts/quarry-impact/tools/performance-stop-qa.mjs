// Focused independent coverage evidence. This never edits or relabels a prior
// benchmark, and its frame timings must not be aggregated with that run.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';
import { circuitRuntimeAssetPlan } from './circuit-runtime-assets.mjs';
import { geologyRuntimeAssetPlan } from './geology-runtime-assets.mjs';

const output=process.env.QUARRY_STOP_OUTPUT;
const expected=process.env.QUARRY_STOP_EXPECTED_BUNDLE,expectedHash=process.env.QUARRY_STOP_EXPECTED_SHA256;
assert.ok(output&&expected&&expectedHash,'Set unique output, frozen bundle and SHA256');
assert.equal(await fs.access(path.join(output,'report.json')).then(()=>true,()=>false),false,'Preserve earlier evidence');
await fs.mkdir(output,{recursive:true});
const url=process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/';
const {prepareEastBayStops}=await tsImport('./east-bay-stop-preflight.ts',import.meta.url);
const {backdropGroundHeight}=await tsImport('../src/scenery-backdrop.ts',import.meta.url);
const stop=prepareEastBayStops().stops.find(stop=>stop.id==='east-bay-close');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const report={protocol:'Independent 16-second eight-car braked inspection with normal physics/chase; five-second settling threshold. Supplemental coverage only, never combined with the full benchmark timing.',
  startedAt:new Date().toISOString(),url,stop,quality:'ultra',viewport:{width:2560,height:1440},assets:[],samples:[],errors:[],checks:[]};
const plan=[...await forestRuntimeAssetPlan(),...await circuitRuntimeAssetPlan(),...await geologyRuntimeAssetPlan()];
for(const file of ['models/quarry-east-bay.glb',expected.replace(/^\.\//,'')]){
  const bytes=await fs.readFile(path.join('dist',file));plan.push({file,bytes:bytes.length,sha256:hash(bytes)});
}
let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
  const page=await browser.newPage({viewport:report.viewport,deviceScaleFactor:1});
  const requests=await observeForestRequests(page,url,plan);
  page.on('pageerror',error=>report.errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
  page.on('requestfailed',request=>report.errors.push(request.url()+' '+request.failure()?.errorText));
  page.on('response',response=>{if(response.status()>=400)report.errors.push(response.status()+' '+response.url());});
  await page.goto(url);await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:180000});
  await verifyForestRequests(requests,report.assets);
  report.bundle=await page.locator('script[type="module"]').getAttribute('src');assert.equal(report.bundle,expected);
  report.bundleSha256=report.assets.find(asset=>asset.file===expected.replace(/^\.\//,'')).sha256;
  assert.equal(report.bundleSha256,expectedHash);
  await page.locator('[data-car="coupe"]').click();
  await page.evaluate(async stop=>{
    const q=__quarry;q.setQuality('ultra');await q.start('derby');q.mute();q.autopilot(false);
    q.setInput({throttle:0,steer:0,brake:1,handbrake:false});q.teleport(0,stop.x,stop.z,stop.yaw);
  },stop);
  await page.waitForFunction(()=>__quarry.state==='playing',null,{timeout:15000});
  const start=performance.now();
  while((performance.now()-start)/1000<16){
    await page.waitForTimeout(2000);
    const sample=await page.evaluate(()=>({state:__quarry.state,cars:__quarry.cars,camera:__quarry.cameraPose,stats:__quarry.stats}));
    delete sample.stats.benchmarkSamples;
    const position=sample.cars[0].position;
    report.samples.push({time:(performance.now()-start)/1000,...sample,ground:backdropGroundHeight(position[0],position[2])});
  }
  report.actualSeconds=(performance.now()-start)/1000;
  await page.screenshot({path:path.join(output,'east-bay-close.png')});
  assert.ok(report.actualSeconds>=16);assert.ok(report.samples.every(sample=>sample.cars.length===8));
  assert.ok(report.samples.every(sample=>sample.stats.audio===35),'All 35 decoded audio buffers must be available');
  const settled=report.samples.filter(sample=>sample.time>=5&&sample.state==='playing');
  assert.ok(settled.length>=2,'At least two playing samples after five seconds');
  for(const sample of settled){
    const car=sample.cars[0],position=car.position;
    assert.ok(Math.hypot(position[0]-stop.x,position[2]-stop.z)<3,'Retain the exact stop vicinity');
    assert.ok(Math.abs(car.speed)<1,'Braked inspection');
    assert.ok(position[1]-sample.ground>.25&&position[1]-sample.ground<1.8,'Grounded suspension');
    const delta=stop.targetCenter.map((value,i)=>value-sample.camera.position[i]);
    const [x,y,z,w]=sample.camera.quaternion,forward=[-2*(x*z+w*y),-2*(y*z-w*x),-1+2*(x*x+y*y)];
    const cosine=delta.reduce((sum,value,i)=>sum+value*forward[i],0)/(Math.hypot(...delta)*Math.hypot(...forward));
    assert.ok(cosine>Math.cos(sample.camera.fov*Math.PI/360),'Wall target remains inside ordinary chase frame');
  }
  report.settledPlayingSamples=settled.length;
  report.checks=['>=16 real seconds','eight active-event cars','all 35 decoded audio buffers','>=2 playing samples after five seconds','braked','grounded','exact stop vicinity','ordinary chase wall framing','actual asset hashes'];
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.failure=error.stack??String(error);process.exitCode=1;}
finally{
  await browser?.close();report.browserClosed=true;report.finishedAt=new Date().toISOString();
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,passed:report.passed,failure:report.failure,actualSeconds:report.actualSeconds,settledPlayingSamples:report.settledPlayingSamples,assets:report.assets.length,browserClosed:report.browserClosed}));
}
