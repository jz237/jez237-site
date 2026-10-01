import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_REFERENCE_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={views:[],errors:[],viewport:[2560,1440],fixture:'Eight actual game cars, stationary matched quarry chase composition; no multiplayer connection.'};let browser,page;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 const begin=performance.now();await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});report.coldMenuMs=performance.now()-begin;
 report.bundle=await page.locator('script[type="module"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 const start=performance.now();await page.evaluate(async()=>{await __quarry.start('derby');__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});__quarry.simulate(4);});report.firstEventMs=performance.now()-start;
 const capture=async name=>{await page.waitForTimeout(300);await page.screenshot({path:out+'/'+name+'.png'});report.views.push({name,...await page.evaluate(()=>({cars:__quarry.cars,camera:__quarry.cameraPose,daylight:__quarry.daylight,stats:__quarry.stats,artDirection:__quarry.artDirection,network:__quarry.network.active}))});};
 await page.evaluate(()=>{__quarry.teleport(0,18,-12,0);for(let i=1;i<8;i++)__quarry.teleport(i,18+(i%4-1.5)*3.4,11+Math.floor(i/4)*6,(i%2?.22:-.22));__quarry.simulate(.1);__quarry.captureCamera([18,3.6,-18.6],[18,1.05,-6.5]);});await capture('matched-chase');
 await page.evaluate(()=>__quarry.captureCamera([18,3.643,-20.6],[18,.503,-6.9]));await capture('playable-composition');
 await page.evaluate(()=>__quarry.captureCamera([-22,4.2,-21],[18,1.5,22]));await capture('arena-wide');
 await page.evaluate(()=>{__quarry.damage(0,24,'front');__quarry.damage(0,24,'left',0xe73523);__quarry.damage(0,24,'front');__quarry.damage(0,20,'rear');__quarry.resume();__quarry.simulate(.05);__quarry.captureCamera([13,2.1,-6.2],[18,1,-12]);});await capture('heavy-wreck');
 await page.evaluate(()=>{for(let i=0;i<8;i++){__quarry.teleport(i,18+(i%4-1.5)*2.3,12+Math.floor(i/4)*4,i*.42);if(i>0){__quarry.damage(i,25,'front');__quarry.damage(i,25,'left');}}__quarry.resume();__quarry.simulate(.15);__quarry.captureCamera([8,9,-.5],[18,1,15]);});await capture('eight-car-pileup');
 assert.equal(report.views.length,5);assert.ok(report.views.every(v=>v.cars.length===8&&!v.network));assert.deepEqual(report.views[0].artDirection.scenery,{rockSections:15,replacedSurfaces:15,lamps:8,banners:13,props:7});assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);await page?.screenshot({path:out+'/failure.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,errors:report.errors,coldMenuMs:report.coldMenuMs,views:report.views.map(v=>v.name)}));}
