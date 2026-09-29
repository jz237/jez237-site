import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_FIRE_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],views:[],checks:[]};let browser,page;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
 page=await browser.newPage({viewport:{width:2560,height:1440}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.addInitScript(()=>{const create=AudioContext.prototype.createDynamicsCompressor;
  AudioContext.prototype.createDynamicsCompressor=function(){const n=create.call(this),meter=this.createAnalyser();meter.fftSize=2048;n.connect(meter);window.__meter={meter,peak:0,clipped:0,readings:0,latest:0};return n;};
  setInterval(()=>{const m=window.__meter;if(!m)return;const a=new Float32Array(2048);m.meter.getFloatTimeDomainData(a);m.latest=0;for(const x of a){m.latest=Math.max(m.latest,Math.abs(x));if(Math.abs(x)>=1)m.clipped++;}m.peak=Math.max(m.peak,m.latest);m.readings++;},16);
 });
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 const sample=()=>page.evaluate(()=>({fire:__quarry.fireState,audio:__quarry.audioState,layers:__quarry.fireAudio,state:__quarry.state,stats:__quarry.stats,damage:__quarry.inspect()}));
 async function capture(name){await page.screenshot({path:out+'/'+name+'.png'});report.views.push({name,...await sample()});}
 async function start(){await page.evaluate(async()=>{await __quarry.start('playground');__quarry.autopilot(false);__quarry.simulate(4);__quarry.teleport(0,0,-20,0);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});});await page.waitForTimeout(180);}
 async function camera(){await page.evaluate(()=>__quarry.captureCamera([-4,2.7,-14.5],[0,1.9,-19]));await page.waitForTimeout(200);}
 await start();assert.equal((await sample()).fire.active,0);report.checks.push('intact car has no fire or smoke');
 await page.evaluate(()=>__quarry.damage(0,65,'front'));await page.waitForTimeout(2600);
 // First-use shader/asset work can delay visual steps on a cold live load.
 // Wait for the same required smoke count before freezing the inspection view.
 await page.waitForFunction(()=>__quarry.fireState.active>5,null,{timeout:45000});await camera();await capture('coolant-smoke');
 const smoke=await sample();assert.ok(smoke.fire.active>5);assert.equal(smoke.fire.emitters[0].heat,0);
 await start();await page.evaluate(()=>{__quarry.seedFireTest(12);__quarry.damage(0,86,'front');});await page.waitForFunction(()=>__quarry.fireState.emitters[0]?.heat>.4&&__quarry.fireState.active>15&&__quarry.inspect()[0].burn>.12,null,{timeout:45000});await camera();await capture('engine-bay-fire');
 const fire=await sample();assert.ok(fire.fire.emitters[0].heat>.35);assert.ok(fire.fire.lights>0);assert.ok(fire.layers[0].layers.every(l=>l.level>.03));
 for(const l of fire.layers[0].layers)assert.ok(Math.hypot(...l.position.map((v,i)=>v-fire.fire.emitters[0].origin[i]))<.02);
 report.checks.push('progressive smoke, flame and positional fire audio');
 await page.evaluate(()=>__quarry.damage(0,25,'rear'));assert.equal((await sample()).fire.emitters[0].exploded,false,'final hit cannot automatically explode');
 const burst=await page.evaluate(()=>__quarry.simulateFire(35));assert.equal(burst,true);await capture('rare-fuel-burst');assert.equal((await sample()).fire.emitters[0].exploded,true);report.checks.push('seeded rare critically damaged car bursts after sustained heat');
 await page.evaluate(()=>__quarry.resume());await page.waitForTimeout(1800);await camera();await capture('burning-wreck');
  const before=await sample();await page.waitForTimeout(300);assert.deepEqual((await sample()).fire,before.fire);report.checks.push('inspection freezes visual effects');
 assert.ok(before.damage[0].burn>.1,'fire leaves persistent soot');
 await page.evaluate(()=>{__quarry.setHealth(0,60);__quarry.resume();});await page.waitForTimeout(500);await camera();
 const cooled=await sample();assert.equal(cooled.fire.emitters[0].heat,0);assert.equal(cooled.damage[0].burn,before.damage[0].burn,'soot survives cooling without a repair');
 await capture('scorched-after-fire');report.checks.push('burn scars persist after cooling');
 await page.evaluate(()=>{__quarry.resume();__quarry.recover();});await page.waitForTimeout(700);const repaired=await sample();assert.equal(repaired.fire.active,0);assert.equal(repaired.fire.emitters[0].heat,0);assert.ok(repaired.layers[0].layers.every(l=>l.level<.001));report.checks.push('repair clears fire particles and sound');
 assert.equal(repaired.damage[0].burn,0,'repair removes persistent soot');assert.deepEqual(repaired.damage[0].loose,[]);
 for(const [kind,zone] of [['sedan','rear'],['hatch','left']]){
  await page.evaluate(()=>__quarry.menu());await page.locator(`[data-car="${kind}"]`).click();await start();
  await page.evaluate(zone=>__quarry.damage(0,86,zone),zone);await page.waitForFunction(()=>__quarry.fireState.emitters[0]?.heat>.4&&__quarry.fireState.active>15,null,{timeout:45000});await page.evaluate(zone=>__quarry.captureCamera(zone==='rear'?[-4,2.7,-25.5]:[-5,2.7,-18],[0,1.6,-20]),zone);await page.waitForTimeout(200);await capture(kind+'-'+zone+'-fire');
  const emitter=(await sample()).fire.emitters[0];assert.ok(emitter.heat>.35);assert.ok(emitter.sites.reduce((a,b)=>a.weight>b.weight?a:b).name.startsWith(zone));
  await page.evaluate(()=>__quarry.captureCamera([0,20,-20.01],[0,1,-20]));await page.waitForTimeout(200);await capture(kind+'-overhead-fire');
 }
 report.checks.push('all three car types render fire with front, rear and side damage-weighted sources');
 await page.evaluate(async()=>{await __quarry.start('race');__quarry.simulate(4);__quarry.autopilot(false);for(let i=0;i<8;i++){__quarry.teleport(i,(i%4-1.5)*4,-20+Math.floor(i/4)*8,0);__quarry.setHealth(i,8);}__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});});
 await page.waitForTimeout(4300);await page.evaluate(()=>__quarry.captureCamera([-11,7,-7],[0,2,-15]));await page.waitForTimeout(250);await capture('eight-car-fire');
 const pileup=await sample();assert.ok(pileup.fire.emitters.filter(e=>e.heat>.5).length>=6);assert.ok(pileup.fire.active<=640);assert.ok(pileup.fire.lights<=2);assert.ok(pileup.audio.voices<=18);report.checks.push('eight-car effects and voice budgets');
 await page.evaluate(()=>__quarry.pause());await page.waitForTimeout(180);assert.equal((await sample()).audio.state,'suspended');
 await page.evaluate(()=>{__quarry.resume();__quarry.mute();});await page.waitForTimeout(400);assert.equal((await sample()).audio.master,0);assert.ok(await page.evaluate(()=>__meter.latest<.0001));report.checks.push('pause and mute silence fire');
 report.audio=await page.evaluate(()=>({peak:__meter.peak,clipped:__meter.clipped,readings:__meter.readings,...__quarry.audioState}));assert.equal(report.audio.buffers,38);assert.equal(report.audio.clipped,0);assert.ok(report.audio.peak>0);
 await page.evaluate(()=>__quarry.menu());await page.waitForTimeout(200);assert.equal((await sample()).fire.active,0);report.checks.push('menu reset clears emitters');
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);report.failureState=await page?.evaluate(()=>({state:__quarry.state,fire:__quarry.fireState,cars:__quarry.cars,stats:__quarry.stats})).catch(()=>null);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,errors:report.errors,checks:report.checks,audio:report.audio}));}
