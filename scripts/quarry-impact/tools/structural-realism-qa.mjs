import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_STRUCTURE_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],requests:[],checks:[],views:[],viewport:[2560,1440]};let browser,page;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
 page=await browser.newPage({viewport:{width:2560,height:1440}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});page.on('request',r=>{if(/vehicle-(fire|smoke)-baked.png/.test(r.url()))report.requests.push(r.url());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 const sample=()=>page.evaluate(()=>({surface:__quarry.surfaceState,fire:__quarry.fireState,damage:__quarry.inspect(),cars:__quarry.cars,state:__quarry.state}));
 const capture=async name=>{await page.waitForTimeout(180);await page.screenshot({path:out+'/'+name+'.png'});report.views.push({name,...await sample()});};
 const start=()=>page.evaluate(async()=>{await __quarry.start('playground');__quarry.autopilot(false);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.teleport(0,0,-20);__quarry.simulate(1);});
 for(const kind of ['coupe','sedan','hatch']){
  await page.evaluate(()=>__quarry.menu());await page.click('[data-car="'+kind+'"]');await start();await page.evaluate(()=>__quarry.captureCamera([-4,1.35,-14.2],[0,.9,-20]));await capture(kind+'-intact');
  await page.evaluate(()=>{__quarry.damage(0,20,'left',0xe73428);__quarry.damage(0,23,'front');__quarry.damage(0,23,'front');__quarry.resume();__quarry.simulate(.3);__quarry.captureCamera([-4,1.4,-17.5],[0,1,-20]);});await capture(kind+'-corner-paint');
  let state=await sample();assert.ok(state.surface.cars[0].paintVertices>0);assert.ok(state.surface.cars[0].wheels.some(w=>w.damage>.1&&w.stiffness<30&&w.brake>0));
  await page.evaluate(()=>{__quarry.resume();__quarry.damage(0,23,'front');__quarry.damage(0,23,'front');__quarry.simulate(.2);__quarry.captureCamera([-3.4,2.3,-14.8],[0,1,-19.7]);});await capture(kind+'-structure');
  await page.evaluate(()=>{__quarry.resume();__quarry.recover();__quarry.simulate(.3);});state=await sample();assert.equal(state.surface.cars[0].paintVertices,0);assert.ok(state.surface.cars[0].wheels.every(w=>w.damage===0&&w.stiffness===30&&w.brake===90));assert.deepEqual(state.surface.cars[0].tires,[0,0,0,0]);
 }
 report.checks.push('all three cars: intact material/contact-patch view, localized transferred paint, physical damaged corners, structure folding and complete repair');
 await page.evaluate(()=>__quarry.menu());await page.click('[data-car="coupe"]');await start();
 report.wet=await page.evaluate(()=>{const p=__quarry.puddles.reduce((a,b)=>a.radius*a.aspect>b.radius*b.aspect?a:b);__quarry.teleport(0,p.x,p.z);__quarry.simulate(.6);__quarry.setInput({throttle:0,steer:0,brake:0,handbrake:false});__quarry.velocity(0,0,0,15);__quarry.simulate(1.4);const c=__quarry.cars[0];__quarry.captureCamera([c.position[0]-4,2.2,c.position[2]-6],[c.position[0],.8,c.position[2]-1.5]);return{p,...__quarry.surfaceState};});await capture('wet-tires-trails');
 assert.ok(report.wet.cars[0].tires.some(v=>v>0&&v<1),'tires carry water out of the puddle');assert.ok(report.wet.cars[0].wet.some(v=>v>.05));assert.ok(report.wet.ground.wet>0);
 const paused=await sample();await page.waitForTimeout(400);assert.deepEqual((await sample()).surface,paused.surface);report.checks.push('real grounded puddle crossing leaves retained tire water, wet bodywork and fading wet trails; inspection freezes deposition');
 await start();await page.evaluate(()=>{__quarry.seedFireTest(24);__quarry.damage(0,86,'front');__quarry.simulateFire(14);__quarry.captureCamera([-3,1.9,-15.5],[0,1.5,-19.5]);});await capture('baked-fire-smoke');assert.equal((await sample()).fire.baked,true);assert.ok((await sample()).fire.visible>0);
 await page.evaluate(()=>__quarry.menu());assert.equal((await sample()).surface.ground.count,0);assert.equal((await sample()).fire.active,0);
 assert.equal(report.requests.filter(u=>u.includes('fire-')).length,1);assert.equal(report.requests.filter(u=>u.includes('smoke-')).length,1);report.checks.push('shared 64-frame Mantaflow atlases load once across cars and restarts, fire keeps localized ignition rules, event reset clears effects and evidence');
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);report.failureState=await sampleFailure();await page?.screenshot({path:out+'/failure.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,checks:report.checks,errors:report.errors}));}
async function sampleFailure(){return page?.evaluate(()=>({state:window.__quarry?.state,surface:window.__quarry?.surfaceState,damage:window.__quarry?.inspect()})).catch(()=>null);}
