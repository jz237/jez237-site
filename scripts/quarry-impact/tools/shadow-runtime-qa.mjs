// Real Chrome/WebGL regression, not a performance benchmark. Run only with the
// shared GPU slot free. Example: QUARRY_SHADOW_PHASE=final node this-file.mjs.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const phase=process.env.QUARRY_SHADOW_PHASE;
assert.ok(phase,'Set QUARRY_SHADOW_PHASE to a new evidence name');
assert.match(phase,/^[a-z0-9][a-z0-9_-]*$/i);
const output=path.resolve(process.env.QUARRY_SHADOW_OUTPUT||'outputs/daylight/shadow-runtime',phase);
const url=process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const neutral={throttle:0,steer:0,brake:1,handbrake:false};
const assetPaths=['assets/sky.hdr','assets/arena-floor-mask.rgba.gz','models/quarry-headwall.glb',
  'models/quarry-extension.glb','models/coupe.glb','models/sedan.glb','models/hatch.glb'];
const report={phase,url,startedAt:new Date().toISOString(),viewport:{width:2560,height:1440},
  protocol:'Real rendered frames with stationary/moving views, replacement cars, AI events, quality cycles and optional real WebGL context recovery. Counts are resource/capture diagnostics, not GPU timings.',
  assets:[],checks:[],samples:[],quality:[],screenshots:[],errors:[],failedRequests:[],consoleWarnings:[]};
await fs.mkdir(output,{recursive:true});
assert.equal(await fs.access(path.join(output,'report.json')).then(()=>true,()=>false),false,'Preserve earlier evidence; use a fresh phase');
let browser,page;

try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:[
    '--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required',
    '--disable-background-timer-throttling','--disable-renderer-backgrounding',
  ]});
  page=await browser.newPage({viewport:report.viewport,deviceScaleFactor:1});
  page.setDefaultTimeout(20000);
  page.on('pageerror',error=>report.errors.push({type:'page',message:error.message}));
  page.on('console',message=>{
    if(message.type()==='error')report.errors.push({type:'console',message:message.text()});
    else if(message.type()==='warning')report.consoleWarnings.push(message.text());
  });
  page.on('response',response=>{if(response.status()>=400)report.errors.push({type:'http',status:response.status(),url:response.url()});});
  page.on('requestfailed',request=>report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
  const assetResponses=assetPaths.map(asset=>{
    const promise=page.waitForResponse(response=>response.url()===new URL(asset,url).href,{timeout:120000});
    promise.catch(()=>{});return{asset,promise};
  });
  const modules=new Map();
  page.on('response',response=>{
    if(response.request().resourceType()==='script'&&/\/assets\/index-[^/]+\.js(?:\?|$)/.test(response.url()))modules.set(response.url(),response);
  });
  await page.goto(url);
  await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  const frames=async(count=120)=>page.evaluate(count=>new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error(`No ${count} rendered frames within 20 seconds`)),20000);
    let remaining=count;
    function frame(){if(--remaining<=0){clearTimeout(timeout);resolve();}else requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  }),count);
  const sample=async label=>{
    const result=await page.evaluate(()=>{
      const q=window.__quarry,{benchmarkSamples,...stats}=q.stats;
      const canvas=document.querySelector('#game'),gl=canvas.getContext('webgl2');
      return{state:q.state,mode:q.mode,cars:q.cars,daylight:q.daylight,stats,
        drawingBuffer:[gl.drawingBufferWidth,gl.drawingBufferHeight],contextLost:gl.isContextLost()};
    });
    assert.ok(result.stats.staticShadows,'This build must expose the implemented static-shadow statistics');
    assert.ok(result.daylight);assert.equal(result.daylight.nearShadowExtent,150,'near-map world resolution must be retained');
    report.samples.push({label,...result});return result;
  };
  const mark=(name,details={})=>report.checks.push({name,passed:true,...details});
  const assertCached=(before,after,label)=>{
    assert.equal(after.stats.staticShadows.captures,before.stats.staticShadows.captures,`${label}: static depth must stay cached`);
    assert.deepEqual(after.stats.staticShadows.camera,before.stats.staticShadows.camera,`${label}: fixed camera cannot follow the car`);
    assert.deepEqual(after.stats.staticShadows.bounds,before.stats.staticShadows.bounds);
    assert.equal(after.stats.staticShadows.casters,before.stats.staticShadows.casters);
  };
  const assertResourcesStable=(before,after,label)=>{
    assert.equal(after.stats.textures,before.stats.textures,`${label}: no continuing texture allocation`);
    assert.equal(after.stats.geometry,before.stats.geometry,`${label}: no continuing geometry allocation`);
  };
  report.bundleURL=await page.locator('script[type="module"]').evaluate(node=>node.src);
  const bundleResponse=modules.get(report.bundleURL);
  assert.ok(bundleResponse,'Bundle identity must come from the actual application script request');
  assert.equal(bundleResponse.status(),200);
  const bundleBytes=await bundleResponse.body();report.bundleSHA256=hash(bundleBytes);
  report.bundle=await page.locator('script[type="module"]').getAttribute('src');
  assert.equal(report.bundleSHA256,hash(await fs.readFile(path.join('dist',report.bundle))));
  if(process.env.QUARRY_SHADOW_EXPECTED_BUNDLE)assert.equal(report.bundle,process.env.QUARRY_SHADOW_EXPECTED_BUNDLE);
  if(process.env.QUARRY_SHADOW_EXPECTED_SHA256)assert.equal(report.bundleSHA256,process.env.QUARRY_SHADOW_EXPECTED_SHA256);
  for(const{asset,promise}of assetResponses){
    const response=await promise;assert.equal(response.status(),200);
    const bytes=await response.body();assert.equal(hash(bytes),hash(await fs.readFile(path.join('dist',asset))));
    report.assets.push({asset,bytes:bytes.length,sha256:hash(bytes),observedApplicationRequest:true});
  }
  report.graphics=await page.evaluate(()=>{
    const gl=document.querySelector('#game').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');
    return{renderer:gl.getParameter(ext?ext.UNMASKED_RENDERER_WEBGL:gl.RENDERER),attributes:gl.getContextAttributes()};
  });
  await page.evaluate(async neutral=>{
    const q=window.__quarry;q.setQuality('ultra');await q.start('playground');q.autopilot(false);q.setInput(neutral);q.mute();
    q.teleport(0,0,-20,0);q.simulate(.25);q.captureCamera([0,3.7,-28],[0,.85,-16]);
    document.querySelector('#ui').style.visibility='hidden';
  },neutral);
  await frames();const initial=await sample('initial-warmed-ultra');
  assert.equal(initial.stats.staticShadows.size,4096);assert.equal(initial.stats.staticShadows.ready,true);
  assert.ok(initial.stats.staticShadows.captures>=1);assert.ok(initial.stats.staticShadows.captureDraws>0);
  await frames(180);const stationary=await sample('stationary-cubemap-cycles');
  assertCached(initial,stationary,'stationary reflection cycles');assertResourcesStable(initial,stationary,'stationary reflection cycles');
  assert.ok(stationary.stats.reflectionUpdates>=initial.stats.reflectionUpdates+2,'actual reflection faces/filter cycles must advance');
  mark('stationary reflections reuse static depth',{reflectionCycles:stationary.stats.reflectionUpdates-initial.stats.reflectionUpdates});

  const start=await page.evaluate(()=>{
    const q=window.__quarry;q.resume();q.teleport(0,0,-20,0);q.velocity(0,0,0,11);
    q.setInput({throttle:.4,steer:0,brake:0,handbrake:false});return q.cars[0].position;
  });
  await frames(90);
  await page.evaluate(neutral=>{__quarry.setInput(neutral);__quarry.pause();},neutral);
  const moving=await sample('moving-player');assertCached(initial,moving,'player movement');
  const finish=moving.cars[0].position,metres=Math.hypot(finish[0]-start[0],finish[2]-start[2]);
  assert.ok(metres>4,`Expected meaningful real-time driving; moved ${metres}m`);
  mark('moving car does not invalidate fixed depth',{metres});

  for(const kind of ['sedan','hatch','coupe']){
    await page.evaluate(()=>{__quarry.menu();document.querySelector('#ui').style.visibility='visible';});
    await page.locator(`[data-car="${kind}"]`).click();await frames(60);
    const replacement=await sample(`replacement-${kind}`);assert.equal(replacement.cars[0].kind,kind);assertCached(initial,replacement,`replacement ${kind}`);
  }
  mark('all three replacement car receivers render without rebuilding scenery depth');
  for(const mode of ['derby','race','derby','playground']){
    const before=await page.evaluate(async mode=>{
      const q=window.__quarry;await q.start(mode);q.autopilot(true);q.setInput(null);q.simulate(4);
      document.querySelector('#ui').style.visibility='hidden';return q.cars;
    },mode);
    await frames(90);const event=await sample(`event-${mode}-${report.samples.length}`);
    assertCached(initial,event,`${mode} event restart`);assert.ok(event.cars.length>1,'AI must be present');
    assert.ok(event.cars.some((car,i)=>i>0&&Math.hypot(car.position[0]-before[i].position[0],car.position[2]-before[i].position[2])>.25),'AI opponents must actually move');
  }
  mark('AI derby, racing, playground and repeated restarts retain cached scenery depth');

  await page.evaluate(neutral=>{const q=window.__quarry;q.autopilot(false);q.setInput(neutral);q.captureCamera([0,3.7,-28],[0,.85,-16]);},neutral);
  await frames();
  const qualitySizes={ultra:4096,high:2048,medium:0};
  for(const quality of ['ultra','high','high','medium','medium','high','ultra','ultra','high','medium','high','ultra']){
    const before=await sample(`before-quality-${quality}`);
    await page.evaluate(quality=>__quarry.setQuality(quality),quality);await frames();
    const after=await sample(`quality-${quality}`),size=qualitySizes[quality];
    const recapture=size!==0&&size!==before.stats.staticShadows.size?1:0;
    assert.equal(after.stats.staticShadows.captures,before.stats.staticShadows.captures+recapture,`${quality}: exactly the necessary static capture`);
    assert.equal(after.stats.staticShadows.size,size);assert.equal(after.stats.staticShadows.mapAllocated,size!==0);assert.equal(after.stats.staticShadows.ready,size!==0);
    assert.deepEqual(after.daylight.nearShadowSize,[quality==='ultra'?4096:2048,quality==='ultra'?4096:2048]);
    const repeated=report.quality.findLast(entry=>entry.quality===quality);
    if(repeated)assert.deepEqual({textures:after.stats.textures,geometry:after.stats.geometry},repeated.resources,`${quality}: returning to an identical stationary mode must not accumulate GPU resources`);
    report.quality.push({quality,size,recapture,captures:after.stats.staticShadows.captures,resources:{textures:after.stats.textures,geometry:after.stats.geometry}});
  }
  mark('Ultra/High/Medium/repeated-quality transitions allocate and capture only when needed');

  if(process.env.QUARRY_SHADOW_SCREENSHOTS==='1'){
    const views=[{name:'white-car',player:[0,-20,0],position:[-5,1.75,-25],target:[0,.8,-20]},
      {name:'headwall',player:[12,90,0],position:[9,3,99],target:[23,17,154]}];
    for(const view of views)for(const enabled of [true,false]){
      await page.evaluate(({view,neutral,enabled})=>{
        const q=window.__quarry;q.resume();q.setInput(neutral);q.teleport(0,...view.player);q.simulate(.25);
        q.captureCamera(view.position,view.target);q.lighting({staticShadows:enabled});document.querySelector('#ui').style.visibility='hidden';
      },{view,neutral,enabled});
      await frames();const name=`${view.name}-static-${enabled?'on':'off'}`;
      await page.screenshot({path:path.join(output,name+'.png')});report.screenshots.push({name,...view,enabled,requiresHumanVisualReview:true});
    }
    await page.evaluate(()=>__quarry.lighting({staticShadows:true}));await frames();
  }

  if(process.env.QUARRY_SHADOW_CONTEXT_RESTORE!=='0'){
    await page.evaluate(neutral=>{__quarry.resume();__quarry.setInput(neutral);__quarry.autopilot(false);},neutral);
    const before=await sample('before-context-loss');
    report.contextRecovery=await page.evaluate(()=>{
      const canvas=document.querySelector('#game'),gl=canvas.getContext('webgl2'),extension=gl.getExtension('WEBGL_lose_context');
      if(!extension)return{supported:false,reason:'WEBGL_lose_context unavailable; no synthetic runtime hook used.'};
      return new Promise((resolve,reject)=>{
        const started=performance.now();let lostAt;
        const cleanup=()=>{clearTimeout(timeout);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);};
        const lost=()=>{lostAt=performance.now();setTimeout(()=>extension.restoreContext(),350);};
        const restored=()=>{const result={supported:true,lostEventObserved:true,restoredEventObserved:true,lostAfterMs:lostAt-started,restoredAfterMs:performance.now()-started,stateAtRestore:__quarry.state};cleanup();resolve(result);};
        const timeout=setTimeout(()=>{cleanup();reject(new Error('Actual WebGL context failed to restore within 20 seconds'));},20000);
        canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);extension.loseContext();
      });
    });
    if(report.contextRecovery.supported){
      await page.waitForFunction(count=>__quarry.stats.staticShadows.captures>=count+1&&__quarry.stats.staticShadows.ready,before.stats.staticShadows.captures,{timeout:20000});
      await frames();const recovered=await sample('context-restored-warmed');
      assert.equal(recovered.stats.staticShadows.captures,before.stats.staticShadows.captures+1,'context restoration invalidates exactly one static capture');
      assert.equal(recovered.contextLost,false);assert.equal(report.contextRecovery.stateAtRestore,'paused');
      await frames();const stable=await sample('context-restored-stable');assertCached(recovered,stable,'restored context');assertResourcesStable(recovered,stable,'restored context');
      await page.evaluate(()=>{__quarry.resume();__quarry.setInput({throttle:.35,steer:0,brake:0,handbrake:false});});await frames(60);
      const resumed=await sample('context-restored-resumed');assert.equal(resumed.state,'playing');assertCached(recovered,resumed,'resumed restored game');
      await page.screenshot({path:path.join(output,'context-restored.png')});
      mark('actual context loss/restoration pauses, recaptures once and resumes');
    }
  }else report.contextRecovery={supported:null,skipped:true,reason:'Explicit QUARRY_SHADOW_CONTEXT_RESTORE=0'};
  const final=await sample('final');assert.equal(final.stats.staticShadows.ready,true);assert.equal(final.contextLost,false);
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);report.passed=true;
}catch(error){
  report.passed=false;report.error=error.stack??String(error);process.exitCode=1;
  if(page)await page.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});
}finally{
  if(browser){await browser.close();report.browserClosed=true;}
  report.finishedAt=new Date().toISOString();await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({phase,output,passed:report.passed,error:report.error,bundle:report.bundle,bundleSHA256:report.bundleSHA256,
    checks:report.checks.length,qualityTransitions:report.quality.length,contextRecovery:report.contextRecovery,
    errors:report.errors,failedRequests:report.failedRequests,browserClosed:report.browserClosed}));
}
