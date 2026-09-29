import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.QUARRY_LOAD_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const urls={before:process.env.QUARRY_BASELINE_URL||'http://127.0.0.1:8796/',after:process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/'};
const report={urls,protocol:'Three alternating fresh Chrome launches per build, 1440p Ultra, no CPU profiler during load. First event timing includes first rendered countdown. Unthrottled local delivery, not an internet speed prediction.',runs:[],errors:[]};
try{
 for(let iteration=0;iteration<3;iteration++)for(const [version,url]of Object.entries(urls)){
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
  try{
   const page=await browser.newPage({viewport:{width:2560,height:1440}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
   await page.addInitScript(()=>{localStorage.setItem('quarry-impact-v1',JSON.stringify({quality:'ultra'}));window.__loadTasks=[];new PerformanceObserver(list=>{for(const e of list.getEntries())__loadTasks.push({start:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});});
   await page.goto(url);await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:180000});
   const result=await page.evaluate(async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return {readyMs:performance.now(),longTasks:__loadTasks,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,start:r.startTime,duration:r.duration,bytes:r.encodedBodySize,transfer:r.transferSize}))};});
   result.version=version;result.iteration=iteration;
   const cdp=await page.context().newCDPSession(page);
   if(iteration===0){await cdp.send('Profiler.enable');await cdp.send('Profiler.start');}
   const start=performance.now();await page.click('#watch-demo');await page.waitForFunction(()=>__quarry.state==='countdown',null,{timeout:60000});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));result.eventMs=performance.now()-start;
   if(iteration===0){const profile=await cdp.send('Profiler.stop');await fs.writeFile(out+'/'+version+'-start.cpuprofile',JSON.stringify(profile.profile));}
   await page.waitForFunction(()=>__quarry.state==='playing');await page.click('#demo-exit');await page.waitForFunction(()=>__quarry.state==='menu');report.runs.push(result);console.log(JSON.stringify({version,iteration,readyMs:result.readyMs,eventMs:result.eventMs,MB:result.resources.reduce((n,r)=>n+r.transfer,0)/1e6}));
  }finally{await browser.close();}
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure}));}
