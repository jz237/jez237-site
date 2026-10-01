import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_DRIVE_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],checks:[],views:[],viewport:[2560,1440]};let browser,page;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
 page=await browser.newPage({viewport:{width:2560,height:1440}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 const sample=()=>page.evaluate(()=>({state:__quarry.state,cars:__quarry.cars,fire:__quarry.fireState,splashes:__quarry.splashState,arena:__quarry.arenaState,damage:__quarry.inspect(),audio:__quarry.audioState}));
 async function capture(name){await page.waitForTimeout(180);await page.screenshot({path:out+'/'+name+'.png'});report.views.push({name,...await sample()});}
 async function playground(){await page.evaluate(async()=>{await __quarry.start('playground');__quarry.autopilot(false);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.simulate(.5);});}
 await page.click('#watch-demo');await page.waitForFunction(()=>__quarry.state==='playing');await page.selectOption('#demo-camera','overview');await page.waitForTimeout(2500);await capture('expanded-arena');
 const derby=await sample();assert.equal(derby.arena.radius,64);assert.equal(derby.arena.enabledWalls,96);assert.equal(derby.cars.length,8);assert.ok(derby.cars.filter(c=>Math.abs(c.speed)>1).length>=4);report.checks.push('expanded 128m derby, eight moving cars, matching barriers and overhead camera');
 for(const speed of [2,15]){
  await playground();
  report['splash'+speed]=await page.evaluate(speed=>{
   const p=__quarry.puddles.reduce((a,b)=>a.radius*a.aspect>b.radius*b.aspect?a:b);
   __quarry.teleport(0,p.x,p.z,0);__quarry.simulate(.7);__quarry.velocity(0,0,0,speed);__quarry.setInput({throttle:0,steer:0,brake:0,handbrake:false});__quarry.simulate(.1);__quarry.simulateSplashes(.18);
   __quarry.captureCamera([p.x-5,2.25,p.z-5],[p.x,.7,p.z]);return{p,speed,splashes:__quarry.splashState};
  },speed);
  assert.ok(report['splash'+speed].splashes.active>0);assert.ok(report['splash'+speed].splashes.ripples>0);await capture('puddle-'+speed+'mps');
  const frozen=await sample();await page.waitForTimeout(300);assert.deepEqual((await sample()).splashes,frozen.splashes);
 }
 assert.ok(report.splash15.splashes.emitted>report.splash2.splashes.emitted);report.checks.push('actual wet tire contacts create speed-dependent spray and ripples; inspection pauses them');
 await playground();await page.evaluate(()=>{__quarry.seedFireTest(24);__quarry.damage(0,86,'left');__quarry.simulateFire(30);});assert.equal((await sample()).fire.emitters[0].heat,0);assert.equal((await sample()).fire.emitters[0].smoke,0);report.checks.push('a critically crushed door does not ignite');
 await playground();await page.evaluate(()=>{__quarry.seedFireTest(24);__quarry.teleport(0,0,-20,0);__quarry.damage(0,65,'front');__quarry.simulateFire(5);__quarry.captureCamera([-4,2.6,-14.5],[0,1.8,-19]);});await capture('coolant-steam');assert.equal((await sample()).fire.emitters[0].heat,0);
 await playground();await page.evaluate(()=>{__quarry.seedFireTest(24);__quarry.teleport(0,0,-20,0);__quarry.damage(0,86,'front');__quarry.simulateFire(2);});assert.equal((await sample()).fire.emitters[0].heat,0,'no instant fire');
 await page.evaluate(()=>{__quarry.simulateFire(12);__quarry.captureCamera([-4,2.6,-14.5],[0,1.8,-19]);});await capture('rooted-engine-fire');
 let fire=await sample();assert.ok(fire.fire.emitters[0].heat>.4);const total=fire.fire.emitters[0].sites.reduce((sum,s)=>sum+s.weight,0);assert.ok(fire.fire.emitters[0].sites.filter(s=>s.weight>total*.2).length<=1);assert.ok(fire.damage[0].burn>0);
 await page.evaluate(()=>{__quarry.resume();});await page.waitForTimeout(800);fire=await sample();assert.ok(fire.audio.buffers===38);await page.evaluate(()=>__quarry.captureCamera([-4,2.6,-14.5],[0,1.8,-19]));await capture('fire-smoke-billows');
 await page.evaluate(()=>__quarry.damage(0,25,'rear'));assert.equal((await sample()).fire.emitters[0].exploded,false);const burst=await page.evaluate(()=>__quarry.simulateFire(35));assert.equal(burst,true);await capture('rare-fuel-burst');report.checks.push('delayed localized flames, buoyant smoke, persistent soot and a seeded rare fuel burst');
 await page.evaluate(()=>{__quarry.setHealth(0,60);__quarry.resume();});await page.waitForTimeout(250);await page.evaluate(()=>__quarry.captureCamera([-4,2.6,-14.5],[0,1.8,-19]));assert.equal((await sample()).fire.emitters[0].heat,0);assert.ok((await sample()).damage[0].burn>0);
 await page.evaluate(()=>{__quarry.resume();__quarry.recover();});await page.waitForTimeout(250);assert.equal((await sample()).fire.active,0);assert.equal((await sample()).damage[0].burn,0);report.checks.push('repair clears thermal effects and scars');
 await page.evaluate(()=>__quarry.menu());await page.locator('[data-car="sedan"]').click();await playground();
 await page.evaluate(()=>{__quarry.seedFireTest(24);__quarry.teleport(0,0,-20,0);__quarry.damage(0,86,'rear');__quarry.simulateFire(14);__quarry.captureCamera([-4,2.6,-25.5],[0,1.6,-20]);});await capture('rear-fuel-leak');
 const rear=(await sample()).fire.emitters[0];assert.ok(rear.heat>.4);assert.equal(rear.sites.reduce((a,b)=>a.weight>b.weight?a:b).name,'rear-leak');report.checks.push('rear fuel damage moves the burning source away from the engine');
 await page.evaluate(()=>__quarry.pause());await page.waitForTimeout(120);assert.equal((await sample()).audio.state,'suspended');await page.evaluate(()=>{__quarry.resume();__quarry.mute();});await page.waitForTimeout(120);assert.equal((await sample()).audio.master,0);
 await page.evaluate(()=>__quarry.menu());assert.equal((await sample()).fire.active,0);assert.equal((await sample()).splashes.active,0);report.checks.push('pause, mute and menu reset');
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);report.failureState=await page?.evaluate(()=>({state:__quarry?.state,fire:__quarry?.fireState,splashes:__quarry?.splashState,cars:__quarry?.cars})).catch(()=>null);await page?.screenshot({path:out+'/failure.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,errors:report.errors,checks:report.checks}));}
