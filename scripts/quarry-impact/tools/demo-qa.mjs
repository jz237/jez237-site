import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_DEMO_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
let browser,page;const report={errors:[],checks:[],views:[]};
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
 page=await browser.newPage({viewport:{width:2560,height:1440}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 const beforeSave=await page.evaluate(()=>localStorage.getItem('quarry-impact-v1'));
 await page.click('#watch-demo');await page.waitForFunction(()=>__quarry.demo.active&&__quarry.state==='playing',null,{timeout:45000});
 await page.waitForTimeout(6000);
 report.initial=await page.evaluate(()=>({demo:__quarry.demo,cars:__quarry.cars,ai:__quarry.aiState,stats:__quarry.stats}));
 assert.equal(report.initial.cars.length,8);assert.equal(report.initial.ai.length,8);assert.ok(report.initial.cars.filter(c=>Math.abs(c.speed)>1).length>=4);
 report.checks.push('all eight cars drive autonomously');
 for(const view of ['overview','drone','chase','hood','trackside','orbit','director']){
  await page.selectOption('#demo-camera',view);await page.waitForTimeout(600);
  const pose=await page.evaluate(()=>__quarry.cameraPose);assert.ok(pose.position.every(Number.isFinite));assert.ok(pose.quaternion.every(Number.isFinite));
  await page.screenshot({path:`${out}/${view}.png`});report.views.push({view,pose,...await page.evaluate(()=>({demo:__quarry.demo,stats:__quarry.stats}))});
 }
 await page.selectOption('#demo-car','3');await page.keyboard.press('BracketRight');assert.equal(await page.evaluate(()=>__quarry.demo.followed),4);
 await page.selectOption('#demo-camera','orbit');const old=await page.evaluate(()=>__quarry.cameraPose.quaternion);
 await page.mouse.move(1450,700);await page.mouse.down();await page.mouse.move(1640,720,{steps:10});await page.mouse.up();
 assert.notDeepEqual(await page.evaluate(()=>__quarry.cameraPose.quaternion),old);report.checks.push('all seven views, car selection and mouse orbit work');
 await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>__quarry.state),'paused');
 const frozen=await page.evaluate(()=>({cars:__quarry.cars,fire:__quarry.fireState}));await page.waitForTimeout(600);assert.deepEqual(await page.evaluate(()=>({cars:__quarry.cars,fire:__quarry.fireState})),frozen);
 await page.click('#resume');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await page.evaluate(()=>__quarry.state),'paused');await page.click('#resume');
 report.checks.push('pause and focus loss freeze demo and fire');
 await page.evaluate(()=>{__quarry.setHealth(0,0);__quarry.simulate(.1);});assert.equal(await page.evaluate(()=>__quarry.state),'playing');report.checks.push('car zero wrecking does not end spectator event');
 await page.evaluate(()=>{__quarry.setTime(299.95);__quarry.simulate(.2);});assert.equal(await page.evaluate(()=>__quarry.state),'result');
 await page.waitForFunction(()=>__quarry.state==='countdown',null,{timeout:20000});assert.equal(await page.evaluate(()=>__quarry.demo.active),true);
 assert.equal(await page.evaluate(()=>localStorage.getItem('quarry-impact-v1')),beforeSave);report.checks.push('demo repeats automatically without changing player bests');
 await page.selectOption('#demo-event','race');await page.waitForFunction(()=>__quarry.mode==='race'&&__quarry.state==='playing',null,{timeout:45000});
 report.race=await page.evaluate(()=>{__quarry.simulate(180);return {cars:__quarry.cars,state:__quarry.state,ai:__quarry.aiState,stats:__quarry.stats};});
 assert.ok(report.race.cars.filter(c=>c.passed>=24).length>=6,'at least six AI complete a full lap');
 await page.selectOption('#demo-camera','overview');await page.waitForTimeout(500);await page.screenshot({path:out+'/race-overview.png'});report.checks.push('race demo advances every AI through checkpoints');
 await page.click('#demo-exit');assert.equal(await page.evaluate(()=>__quarry.state),'menu');assert.equal(await page.evaluate(()=>__quarry.demo.active),false);
 await page.click('#start');await page.waitForFunction(()=>__quarry.state==='countdown',null,{timeout:30000});assert.equal(await page.evaluate(()=>__quarry.demo.active),false);report.checks.push('exit restores normal player mode');
 if(process.env.QUARRY_DEMO_BENCHMARK==='1'){
  await page.evaluate(async()=>{await __quarry.startDemo('derby');__quarry.demoCamera('director');});await page.waitForFunction(()=>__quarry.state==='playing');await page.waitForTimeout(2500);
  await page.evaluate(()=>__quarry.benchmark());const begin=performance.now();report.performance={samples:[]};
  for(let i=0;i<24;i++){await page.waitForTimeout(5000);const sample=await page.evaluate(()=>({stats:__quarry.stats,demo:__quarry.demo,heap:performance.memory?.usedJSHeapSize}));report.performance.samples.push(sample);assert.ok(sample.stats.activeParticles<=1800);assert.ok(sample.stats.thermal.active<=640);assert.ok(sample.stats.voices<=18);if(i%6===5)console.log(JSON.stringify({demoSeconds:Math.round((performance.now()-begin)/1000),fps:1000/sample.stats.meanMs,shot:sample.demo.shot}));}
  const capture=await page.evaluate(()=>__quarry.endBenchmark());const frames=capture.frames,sorted=[...frames].sort((a,b)=>a-b),mean=frames.reduce((a,b)=>a+b,0)/frames.length;
  report.performance.seconds=(performance.now()-begin)/1000;report.performance.timing={frames:frames.length,meanMs:mean,fps:1000/mean,p95:sorted[Math.floor(sorted.length*.95)],p99:sorted[Math.floor(sorted.length*.99)]};
  assert.ok(frames.length>2400,'sustained render coverage');
  const progress=report.performance.samples.map(s=>s.stats.elapsed);
  assert.ok(progress.some((value,i)=>i>0&&(value<progress[i-1]||value-progress[i-1]>3)),'simulation advances');
  assert.ok(progress.slice(-4).every((value,i)=>i===0||Math.abs(value-progress.at(-4+i-1))>1),'final samples must not be a throttled/stalled browser');
  report.performance.frames=frames;const range=fn=>{const v=report.performance.samples.map(fn);return {min:Math.min(...v),max:Math.max(...v),first:v[0],last:v.at(-1)};};
  report.performance.memory={geometry:range(s=>s.stats.geometry),textures:range(s=>s.stats.textures),heap:range(s=>s.heap)};
  await page.screenshot({path:out+'/demo-performance.png'});report.checks.push('two-minute 1440p Ultra director and effects budget capture');
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);report.failureState=await page?.evaluate(()=>({state:__quarry.state,demo:__quarry.demo,cars:__quarry.cars,ai:__quarry.aiState})).catch(()=>null);await page?.screenshot({path:out+'/failure.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,errors:report.errors,checks:report.checks,race:report.race?.cars.map(c=>({id:c.id,passed:c.passed,health:c.health}))}));}
