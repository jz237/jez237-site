import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {tsImport} from 'tsx/esm/api';
const out=process.env.QUARRY_CAMERA_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const {prepareWestWallStops}=await tsImport('./west-wall-stop-preflight.ts',import.meta.url);
const plan=prepareWestWallStops();const report={plan,errors:[],samples:[],protocol:'Targeted retest of the legacy western-wall camera fixture after the grounded chase view changed. Real 1440p game, eight live cars and no camera override; ordinary chase with a braked player.'};let browser,page;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 page=await browser.newPage({viewport:{width:2560,height:1440}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 await page.evaluate(async()=>{await __quarry.start('race');__quarry.autopilot(false);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.simulate(4);});
 for(const stop of plan.stops){
  await page.evaluate(s=>__quarry.teleport(0,s.x,s.z,s.yaw),stop);
  for(let i=0;i<4;i++){
   await page.waitForTimeout(4000);const sample=await page.evaluate(()=>({camera:__quarry.cameraPose,cars:__quarry.cars,stats:__quarry.stats,network:__quarry.network.active}));
   const delta=stop.targetCenter.map((v,j)=>v-sample.camera.position[j]),[x,y,z,w]=sample.camera.quaternion;
   const forward=[-2*(x*z+w*y),-2*(y*z-w*x),-1+2*(x*x+y*y)];
   const cosine=delta.reduce((v,d,j)=>v+d*forward[j],0)/Math.hypot(...delta);
   sample.angleDegrees=Math.acos(Math.min(1,Math.max(-1,cosine)))*180/Math.PI;sample.stop=stop.id;
   assert.ok(cosine>Math.cos(sample.camera.fov*Math.PI/360),stop.id+' upper rock target must fit ordinary chase');assert.equal(sample.cars.length,8);assert.equal(sample.network,false);report.samples.push(sample);
  }
  await page.screenshot({path:out+'/'+stop.id+'.png'});
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,angles:report.samples.map(s=>({stop:s.stop,degrees:s.angleDegrees})),errors:report.errors}));}
