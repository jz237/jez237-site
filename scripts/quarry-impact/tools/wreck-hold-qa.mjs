import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.QUARRY_HOLD_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={checks:[],errors:[]};let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});const page=await browser.newPage({viewport:{width:2560,height:1440}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');
 for(const mode of ['derby','race']){
  await page.evaluate(async mode=>{await __quarry.start(mode);__quarry.autopilot(false);__quarry.simulate(4);__quarry.teleport(0,0,-20,0);__quarry.damage(0,25,mode==='race'?'left':'front');__quarry.damage(0,28,'left');__quarry.damage(0,25,mode==='race'?'left':'front');},mode);
  await page.keyboard.press('KeyC');
  const start=performance.now();
  await page.evaluate(()=>{__quarry.damage(0,24,'rear');__quarry.simulate(.1);});
  const before=await page.evaluate(()=>({state:__quarry.state,car:__quarry.cars,pose:__quarry.cameraPose}));assert.equal(before.state,'wrecked');
  const [cx,,cz]=before.pose.position,[px,,pz]=before.car[0].position;
  assert.ok(mode==='race'?cx<px:cz>pz,'inspection starts on the most damaged side');
  assert.equal(await page.locator('.dialog').count(),0,'wreck view is unobstructed');
  await page.mouse.move(1600,640);await page.mouse.down();await page.mouse.move(2000,730,{steps:12});await page.mouse.up();await page.waitForTimeout(1100);
  const after=await page.evaluate(()=>({state:__quarry.state,car:__quarry.cars,pose:__quarry.cameraPose}));assert.equal(after.state,'wrecked');
  assert.deepEqual(after.car,before.car,'all simulation is held');assert.notDeepEqual(after.pose.quaternion,before.pose.quaternion,'inspection camera orbits');
  await page.screenshot({path:out+'/'+mode+'-wreck-hold.png'});
  let paused=0;
  if(mode==='derby'){
   await page.evaluate(()=>dispatchEvent(new Event('blur')));assert.equal(await page.evaluate(()=>__quarry.state),'paused');const t=performance.now();
   await page.waitForTimeout(5400);assert.equal(await page.evaluate(()=>__quarry.state),'paused');
   await page.locator('#resume').click();paused=performance.now()-t;assert.equal(await page.evaluate(()=>__quarry.state),'wrecked');
  }
  await page.waitForFunction(()=>__quarry.state==='menu',null,{timeout:9000});
  const activeMs=performance.now()-start-paused;assert.ok(activeMs>=4900&&activeMs<6800,'five visible seconds before automatic menu');
  assert.equal((await page.evaluate(()=>__quarry.cars))[0].health,100);
  report.checks.push({mode,activeMs,pausedMs:paused,frozen:true,orbit:true,automaticMenu:true});
 }
 await page.evaluate(async()=>{await __quarry.start('derby');__quarry.simulate(4);__quarry.setHealth(0,0);__quarry.simulate(.1);});
 assert.equal(await page.evaluate(()=>__quarry.state),'wrecked');
 await page.evaluate(async()=>{await __quarry.start('playground');__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});});await page.waitForTimeout(5500);
 assert.equal(await page.evaluate(()=>__quarry.state),'playing','restarting cancels prior hold');report.checks.push({restartCancelsHold:true});
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
