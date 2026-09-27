import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const seconds=Number(process.env.QUARRY_BENCH_SECONDS??610);
const quality=process.env.QUARRY_BENCH_QUALITY??'ultra';
if(!['ultra','high','medium'].includes(quality))throw new Error('Invalid benchmark quality');
// Set a distinct JSON path per run to preserve both its report and matching PNG.
const output=process.env.QUARRY_BENCH_OUTPUT??`outputs/benchmark-upgrade${quality==='ultra'?'':'-'+quality}-1440p.json`;
const screenshot=process.env.QUARRY_BENCH_OUTPUT?`${output.replace(/\.json$/i,'')}.png`:'outputs/performance-final.png';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--disable-background-timer-throttling','--disable-renderer-backgrounding','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:2560,height:1440}});
const errors=[];page.on('pageerror',e=>{if(!errors.includes(e.message))errors.push(e.message);});
const report={startedAt:new Date().toISOString(),seconds,quality,viewport:[2560,1440],sessions:1,errors,output,screenshot};
try {
  await page.goto(process.env.QUARRY_QA_URL??'http://127.0.0.1:8795/');
  await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  Object.assign(report,await page.evaluate(()=>{
    const gl=document.querySelector('canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');
    const resources=new Set(performance.getEntriesByType('resource').map(entry=>entry.name));
    const modules=[...document.querySelectorAll('script[type="module"][src]')].map(script=>script.src).filter(src=>resources.has(src));
    return {pageURL:location.href,buildURL:modules.find(src=>!src.includes('/@vite/client'))??null,moduleURLs:modules,
      contextAttributes:gl.getContextAttributes(),gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
  }));
  await page.evaluate(async quality=>{__quarry.setQuality(quality);await __quarry.start('derby');__quarry.autopilot(true);},quality);
  await page.waitForTimeout(8000);
  await page.evaluate(()=>__quarry.benchmark());
  const begin=Date.now();let last=0;
  while(Date.now()-begin<seconds*1000) {
    await page.waitForTimeout(5000);
    const state=await page.evaluate(()=>__quarry.state);
    if(state==='result'){await page.evaluate(()=>__quarry.start('derby'));report.sessions++;}
    if(Date.now()-begin-last>=60_000){last=Date.now()-begin;console.log(JSON.stringify({elapsed:Math.round(last/1000),sessions:report.sessions,stats:await page.evaluate(()=>__quarry.stats)}));}
  }
  report.final=await page.evaluate(()=>__quarry.stats);
  const data=await page.evaluate(()=>__quarry.endBenchmark());report.samples=data.samples;
  const sorted=data.frames.sort((a,b)=>a-b),mean=sorted.reduce((a,b)=>a+b,0)/sorted.length;
  report.frameTimes={count:sorted.length,meanMs:mean,averageFPS:1000/mean,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],p99:sorted[Math.floor(sorted.length*.99)],over33ms:sorted.filter(v=>v>33.34).length};
  await fs.mkdir(path.dirname(screenshot),{recursive:true});
  await page.screenshot({path:screenshot});
  report.passed=errors.length===0;
}catch(e){report.failure=String(e);report.passed=false;process.exitCode=1;}
finally{report.completedAt=new Date().toISOString();await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();}
