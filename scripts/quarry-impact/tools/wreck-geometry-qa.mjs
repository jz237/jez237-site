import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_WRECK_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],views:[],viewport:[2560,1440]};let browser;
const front={p:[-3.9,1.55,-15.6],look:[0,.8,-19.2]},side={p:[-5.7,1.35,-19.6],look:[0,.85,-20]},rear={p:[-3.4,1.5,-24.5],look:[0,.75,-21]};
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"]').evaluate(s=>s.src);report.sha256=createHash('sha256').update(await(await page.request.get(report.bundle)).body()).digest('hex');
 for(const kind of (process.env.QUARRY_WRECK_CARS||'coupe,sedan,hatch').split(',')){
  await page.evaluate(()=>{__quarry.menu();document.querySelector('#ui').style.visibility='visible';});await page.locator('[data-car="'+kind+'"]').click();
  await page.evaluate(async()=>{__quarry.setQuality('ultra');await __quarry.start('playground');__quarry.autopilot(false);if(!__quarry.audioState?.muted)__quarry.mute();__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.teleport(0,0,-20,0);__quarry.simulate(.25);document.querySelector('#ui').style.visibility='hidden';});
  for(const [state,view,hits]of [['intact',front,[]],['front-dent',front,[[12,'front']]],['front-crush',front,[[13,'front'],[12,'front']]],['side-crush',side,[[24,'left'],[20,'left']]],['rear-crush',rear,[[23,'rear'],[18,'rear']]],['roof-crush',side,[[18,'roof'],[16,'roof']]],['exposed-front',front,[[24,'front'],[24,'front'],[24,'front']]],['repaired',front,[]]]){
   await page.evaluate(async hits=>{await __quarry.start('playground');__quarry.autopilot(false);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.teleport(0,0,-20,0);__quarry.simulate(.25);__quarry.recover();for(const [damage,side]of hits)__quarry.damage(0,damage,side);if(hits.reduce((n,h)=>n+h[0],0)>60)__quarry.simulate(1.4);document.querySelector('#ui').style.visibility='hidden';},hits);
   await page.evaluate(v=>__quarry.captureCamera(v.p,v.look),view);await page.waitForTimeout(650);const name=kind+'-'+state;await page.screenshot({path:out+'/'+name+'.png'});
   report.views.push({name,...await page.evaluate(()=>({pose:__quarry.cameraPose,car:__quarry.inspect()[0],stats:__quarry.stats}))});
  }
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,views:report.views.length,failure:report.failure}));}
