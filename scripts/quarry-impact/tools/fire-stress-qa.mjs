import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_FIRE_STRESS_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],samples:[],protocol:'120 real-time seconds, 1440p Ultra, eight stationary burning vehicles in view with live physics. Every car receives 20-point front, side and rear contacts before ignition. Player remains critically damaged; seven wrecks stay physical. Thermal reset/reignite at 40 and 80 seconds preserves the damaged geometry and soot. Separate effects stress case, not normal driving FPS.'};let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});const page=await browser.newPage({viewport:{width:2560,height:1440}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto('http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');report.sha256=createHash('sha256').update(await(await page.request.get(new URL(report.bundle,page.url()).href)).body()).digest('hex');
 await page.evaluate(async()=>{await __quarry.start('race');__quarry.simulate(4);__quarry.autopilot(false);__quarry.setInput({throttle:0,steer:0,brake:1,handbrake:false});for(let i=0;i<8;i++){__quarry.teleport(i,i===0?0:((i-1)%3-1)*4,i===0?-29:-20+Math.floor((i-1)/3)*5,0);for(const side of ['front','left','rear'])__quarry.damage(i,20,side);__quarry.setHealth(i,i===0?8:0);}});
 await page.waitForTimeout(6500);await page.evaluate(()=>__quarry.benchmark());const start=performance.now();let repaired=0;
 for(let i=0;i<60;i++){
  await page.waitForTimeout(2000);const seconds=(performance.now()-start)/1000;
  if(seconds>40*(repaired+1)&&repaired<2){await page.evaluate(()=>{for(let j=0;j<8;j++)__quarry.setHealth(j,100);});await page.waitForTimeout(100);await page.evaluate(()=>{for(let j=0;j<8;j++)__quarry.setHealth(j,j===0?8:0);});repaired++;}
  const s=await page.evaluate(()=>({stats:__quarry.stats,fire:__quarry.fireState,cars:__quarry.cars,heap:performance.memory?.usedJSHeapSize,audio:__quarry.audioState}));report.samples.push({seconds,...s});
  assert.equal(s.stats.state,'playing');assert.equal(s.cars.length,8);assert.ok(s.fire.active<=640);assert.ok(s.fire.lights<=2);assert.ok(s.audio.voices<=18);
  if(i%10===9)console.log(JSON.stringify({seconds:Math.round(seconds),fps:Math.round(1000/s.stats.meanMs),puffs:s.fire.active,heap:s.heap}));
 }
 const b=await page.evaluate(()=>__quarry.endBenchmark());report.frames=b.frames;report.actualSeconds=(performance.now()-start)/1000;
 const sorted=[...b.frames].sort((a,b)=>a-b),mean=b.frames.reduce((a,b)=>a+b)/b.frames.length;report.timing={frames:b.frames.length,meanMs:mean,fps:1000/mean,p95:sorted[Math.floor(sorted.length*.95)],p99:sorted[Math.floor(sorted.length*.99)]};
 const range=key=>{const values=report.samples.map(key);return{min:Math.min(...values),max:Math.max(...values),first:values[0],last:values.at(-1)};};
 report.memory={geometry:range(s=>s.stats.geometry),textures:range(s=>s.stats.textures),heap:range(s=>s.heap)};
 assert.ok(report.samples.filter(s=>s.fire.emitters.every(e=>e.heat>.6)).length>45);assert.deepEqual(report.errors,[]);
 await page.screenshot({path:out+'/eight-fires-final.png'});report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,timing:report.timing,memory:report.memory}));}
