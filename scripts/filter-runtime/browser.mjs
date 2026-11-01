import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(new URL('../rotatable-aquascape/package.json',import.meta.url));
const {chromium}=require('playwright');
const base=process.env.FILTER_TEST_BASE||'http://127.0.0.1:8823/';
const out=path.resolve(import.meta.dirname,'../../tmp/filter-runtime-qa');mkdirSync(out,{recursive:true});
const filters={'aquaclear-studio':'filterStudio','trickle-studio':'trickleStudio','moving-bed-studio':'movingBedStudio','drum-studio':'drumStudio','sand-studio':'sandStudio','skimmer-studio':'skimmerStudio','roller-studio':'rollerStudio','biowheel-studio':'biowheelStudio','filtoclear-studio':'filtoclearStudio','reef-filtration':'filtrationQA','uv-studio':'uvStudio'};
const selected=process.env.FILTERS?.split(',')||Object.keys(filters),cases=process.env.FILTER_CASES?.split(',')||['normal','reduced','no-webgl'];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const report=[];
try{for(const kind of cases)for(const id of selected){
 const context=await browser.newContext({viewport:kind==='reduced'?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:kind==='reduced'?'reduce':'no-preference'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 if(kind==='no-webgl')await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};});
 const snap=()=>page.evaluate(key=>{const s=window[key]?.snapshot(),r=window.filterAnimation?.snapshot();return {runtime:r,paused:r?.paused??s?.paused,mode:r?.mode||(s?.diagram?'diagram':'3d'),ready:r?.ready??s?.ready,time:r?.mode==='diagram'?r.diagram.water:s?.simulation?.time??s?.time,simulation:s?.simulation,effects:s?.effects,flowVisible:s?.flowVisible,flowPositions:s?.flowPositions,diagram:r?.diagram??s?.diagram};},filters[id]);
 let result={id,kind};
 try{
  await page.goto(new URL('demos/'+id+'/',base).href);await page.waitForFunction(key=>window.filterAnimation?.snapshot().ready||window[key]?.snapshot().ready,filters[id],{timeout:30000});
  let a=await snap();assert.equal(a.paused,false,'starts running');await page.waitForTimeout(650);let b=await snap();assert.ok(b.time>a.time,`clock advances: ${a.time} -> ${b.time}`);
  if(kind==='no-webgl')assert.equal(b.mode,'diagram');else assert.equal(b.mode,'3d','3D available');result.startMode=b.mode;
  if(id==='filtoclear-studio'&&b.mode==='3d'){assert.equal(b.flowVisible,true);assert.notDeepEqual(a.flowPositions,b.flowPositions);}
  await page.screenshot({path:path.join(out,`${id}-${kind}.png`)});
  const show=()=>id==='reef-filtration'?page.locator('#viewport').scrollIntoViewIfNeeded():Promise.resolve();
  await page.locator('#pause').click();await show();await page.waitForTimeout(150);a=await snap();assert.equal(a.paused,true);await page.waitForTimeout(350);b=await snap();assert.equal(b.time,a.time,'pause freezes motion');
  await page.locator('#pause').click();await show();await page.waitForTimeout(350);assert.ok((await snap()).time>b.time,'resume restarts motion');
  await page.locator('#pause').click();await page.locator('#reset').click();await show();a=await snap();assert.equal(a.paused,false,'reset starts running');await page.waitForTimeout(350);assert.ok((await snap()).time>a.time,'reset movement');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'no horizontal overflow');
  if(kind==='normal'&&id!=='uv-studio'){
   await page.evaluate(()=>{const canvas=[...document.querySelectorAll('canvas')].find(c=>c.getContext('webgl2'));canvas?.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext();});
   await page.waitForFunction(()=>window.filterAnimation.snapshot().mode==='diagram');await page.waitForTimeout(120);a=await snap();await page.waitForTimeout(350);b=await snap();assert.ok(b.time>a.time,'context loss keeps animation running');
  }
  assert.deepEqual(errors,[]);result={...result,pass:true};
 }catch(e){result={...result,pass:false,error:e.message,errors,snapshot:await snap().catch(()=>null)};await page.screenshot({path:path.join(out,`${id}-${kind}-failure.png`)}).catch(()=>{});}
 report.push(result);console.log(JSON.stringify(result));await context.close();
}}finally{await browser.close();writeFileSync(path.join(out,`results-${cases.join('-')}.json`),JSON.stringify({base,checkedAt:new Date().toISOString(),report},null,2));}
assert.ok(report.every(r=>r.pass),'Some filter checks failed');
