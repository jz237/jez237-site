import {PNG} from 'pngjs';
import {chromium} from 'playwright';
import {createServer as viteServer} from 'vite';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(import.meta.dirname,'..'),repo=resolve(root,'../..'),out=resolve(root,'.qa-results/startup');
await mkdir(out,{recursive:true});
const vite=await viteServer({root,server:{host:'127.0.0.1',port:5250,strictPort:true}});await vite.listen();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(repo,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!p.startsWith(repo+sep))throw Error('Path');if((await stat(p)).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(5251,'127.0.0.1',r));
const report={checkedAt:new Date().toISOString(),tanks:{}};let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--force_high_performance_gpu']});
 for(const kind of (process.argv.includes('--reef-only')?['reef']:['freshwater','reef'])){
  const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.error(kind,e.message);});
  const url=kind==='freshwater'?'http://127.0.0.1:5250/?qa=1&showroom=hidden-reef':'http://127.0.0.1:5251/prototypes/hidden-reef/showroom/reef/?showroom=hidden-reef';
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#loading')&&(window.aquariumQA||window.reefQA?.snapshot().ready),null,{timeout:120000});
  const state=()=>page.evaluate(()=>{const a=window.aquariumQA;return a?{time:a.currentTime,paused:a.paused,suspended:a.suspended,positions:a.fishes.map(f=>f.model.group.position.toArray())}:window.reefQA.snapshot();});
  const moving=async(label)=>{const a=await state();await page.waitForTimeout(1400);await page.waitForFunction(t=>{const a=window.aquariumQA;return (a?a.currentTime:window.reefQA.snapshot().time)>t+.1;},a.time,{timeout:30000});const b=await state();console.log(kind+': '+label+' OK');assert.equal(b.paused,false,label+' is playing');assert.equal(b.suspended,false,label+' is visible');assert.ok(b.time>a.time+.1,label+' simulation advances');assert.notDeepEqual(b.positions,a.positions,label+' fish actually move');return {elapsed:b.time-a.time};};
  await page.goto(url);await ready();
  const tank=report.tanks[kind]={freshLoad:await moving('fresh load with reduced motion')};
  await page.locator('canvas').first().screenshot({path:resolve(out,kind+'-start.png')});
  // A standalone showroom must ignore a stale/self-sent host suspension message.
  await page.evaluate(()=>window.postMessage({channel:'hidden-reef-showroom',type:'visibility',value:false},location.origin));
  tank.standalone=await moving('standalone host message');
  await page.locator('#pause').click();const paused=await state();await page.waitForTimeout(600);assert.equal((await state()).time,paused.time,'manual pause remains intentional');
  await page.reload();await ready();tank.reload=await moving('reload after pause');
  // Deterministic BFCache lifecycle event; actual Back navigation checked below separately.
  await page.locator('#pause').click();await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  tank.persistedPageShow=await moving('persisted pageshow');assert.equal(await page.locator('#pause').getAttribute('aria-pressed'),'false');
  await page.locator('#pause').click();await page.goto('http://127.0.0.1:5251/prototypes/hidden-reef/');await page.goBack();await ready();tank.backNavigation=await moving('browser Back');
  await page.locator('#pause').click();await page.waitForTimeout(300);
  const beforeRecovery=PNG.sync.read(await page.locator('canvas').first().screenshot());
  // Exercise a real lost and restored WebGL context, not just synthetic events.
  await page.evaluate(()=>{const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2');window.startupContext=gl.getExtension('WEBGL_lose_context');window.startupRestored=false;canvas.addEventListener('webglcontextrestored',()=>window.startupRestored=true,{once:true});window.startupContext.loseContext();});
  await page.waitForTimeout(900);await page.evaluate(()=>window.startupContext.restoreContext());
  await page.waitForFunction(()=>window.startupRestored,null,{timeout:30000});await page.waitForTimeout(600);
  assert.equal((await state()).paused,true,'context recovery preserves deliberate pause');
  const recovered=PNG.sync.read(await page.locator('canvas').first().screenshot());
  assert.equal(recovered.data.length,beforeRecovery.data.length);let difference=0;for(let i=0;i<recovered.data.length;i++)if(i%4!==3)difference+=Math.abs(recovered.data[i]-beforeRecovery.data[i]);
  tank.recoveryPixelDifference=difference/(recovered.width*recovered.height*3);assert.ok(tank.recoveryPixelDifference<8,'recovery retains lighting and materials: '+tank.recoveryPixelDifference);
  await page.locator('#pause').click();tank.contextRestored=await moving('WebGL recovery');
  await page.locator('canvas').first().screenshot({path:resolve(out,kind+'-restored.png')});
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);tank.phone=await moving('phone viewport');
  await page.screenshot({path:resolve(out,kind+'-phone.png')});assert.deepEqual(errors,[]);await page.close();
 }
 const home=await browser.newPage({viewport:{width:1440,height:1000}});
 await home.goto('http://127.0.0.1:5251/prototypes/hidden-reef/');await home.locator('.masthead').waitFor();await home.waitForTimeout(1200);
 for(const width of [1440,390]){await home.setViewportSize({width,height:1000});assert.equal(await home.locator('.showroom-nav,.showroom-mobile-entry').count(),0);await home.screenshot({path:resolve(out,'header-'+width+'.png')});}
 assert.ok(await home.locator('a[href*="showroom/reef"],a[href*="showroom/aquarium"]').count()>0,'home aquarium cards remain');
 report.headerShortcutRemoved=true;
 await writeFile(resolve(out,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser?.close();await vite.close();await new Promise(r=>server.close(r));}
