// QUARRY_CUT_PHASE=before|after; QUARRY_CUT_OUTPUT defaults to outputs/quarry-cut.
// This is a visual fixture, not a frame-time benchmark. No runtime QA hooks change.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const phase=process.env.QUARRY_CUT_PHASE || 'after';
const focused=process.env.QUARRY_CUT_FOCUSED==='1';
const roadsideOnly=process.env.QUARRY_CUT_ROADSIDE==='1';
const extension=process.env.QUARRY_CUT_EXTENSION==='1';
const road=process.env.QUARRY_CUT_ROAD==='1';
const roadEnds=process.env.QUARRY_CUT_ROAD_ENDS==='1';
assert.match(phase,/^[a-z0-9][a-z0-9_-]*$/i);
const output=path.resolve(process.env.QUARRY_CUT_OUTPUT || 'outputs/quarry-cut',phase);
const url=process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
const neutral={throttle:0,steer:0,brake:1,handbrake:false};
const views=[
  {name:'road-original',player:[80,-60,0],position:[58,6,-48],target:[99,4,-72]},
  {name:'ground-close',player:[95,-66,0],position:[98,2.8,-71],target:[125,11,-91]},
  {name:'reverse-oblique',player:[81,-77,0],position:[84,3,-108],target:[122,10,-94]},
  {name:'left-end',player:[96,-43,0],position:[104,3,-48],target:[143,13,-78]},
  {name:'right-end',player:[66,-83,0],position:[78,3,-98],target:[128,12,-129]},
];
if(roadsideOnly)views.splice(0,views.length,{name:'roadside-close',player:[98,-72,0],position:[104,2.9,-77],target:[116,1.8,-83]});
if(extension)views.splice(0,views.length,
  {name:'extension-approach',player:[78,-82,0],position:[90,4,-80],target:[73,9,-138]},
  {name:'extension-front',player:[58,-87,0],position:[58,4,-93],target:[68,10,-144]},
  {name:'extension-reverse',player:[26,-88,0],position:[30,4,-98],target:[65,10,-149]},
  {name:'extension-join',player:[80,-77,0],position:[87,3.5,-92],target:[103,10,-124]});
if(road)views.splice(0,views.length,
  {name:'road-shoulder',player:[93,-61,0],position:[99,2.6,-63],target:[86,.1,-73]},
  {name:'road-reverse',player:[45,-85,0],position:[49,2.6,-84],target:[79,.1,-83]});
const track=Array.from({length:481},(_,i)=>{
  const a=i/480*Math.PI*2;
  return {x:108*Math.sin(a)+12*Math.sin(a*3),z:88*Math.cos(a)+9*Math.sin(a*2)};
});
if(roadEnds){
  views.splice(0,views.length,...[
    {name:'road-entry',cell:122,direction:1},
    {name:'road-exit',cell:183,direction:-1},
  ].map(({name,cell,direction})=>{
    const a=cell/360*Math.PI*2,b=(cell+.2)/360*Math.PI*2;
    const p={x:108*Math.sin(a)+12*Math.sin(a*3),z:88*Math.cos(a)+9*Math.sin(a*2)};
    const q={x:108*Math.sin(b)+12*Math.sin(b*3),z:88*Math.cos(b)+9*Math.sin(b*2)};
    const n=Math.hypot(q.x-p.x,q.z-p.z),fx=(q.x-p.x)/n*direction,fz=(q.z-p.z)/n*direction;
    return {name,player:[p.x,p.z,Math.atan2(fx,fz)],
      position:[p.x-fx*8,3.1,p.z-fz*8],target:[p.x+fx*16,.4,p.z+fz*16]};
  }));
}
const report={phase,url,focused,extension,road,roadEnds,viewport:{width:2560,height:1440},quality:'ultra',settleMs:1500,sampleMs:3000,views:[],moving:[],hood:[],errors:[],failedRequests:[],modules:[],modelUrls:[]};
let browser;
await fs.mkdir(output,{recursive:true});
assert.equal(await fs.access(path.join(output,'report.json')).then(()=>true,()=>false),false,
  `Preserve previous evidence: choose a new QUARRY_CUT_PHASE or QUARRY_CUT_OUTPUT; ${output} already has a report`);
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
  const context=await browser.newContext({viewport:report.viewport,deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('response',r=>{
    if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);
    if(/\/models\/[^?]+\.glb(?:\?|$)/.test(r.url()))report.modelUrls.push(r.url());
  });
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),failure:r.failure()?.errorText}));
  await page.goto(url);
  await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  report.bundle=await page.locator('script[type="module"]').getAttribute('src');
  const buildResponse=await page.request.get(new URL(report.bundle,url).href);
  report.buildSha256=createHash('sha256').update(await buildResponse.body()).digest('hex');
  report.gpu=await page.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  await page.evaluate(async()=>{
    await __quarry.start('playground');__quarry.autopilot(false);__quarry.setQuality('ultra');
    __quarry.mute();document.querySelector('#ui').style.visibility='hidden';
  });
  const captureStats=()=>page.evaluate(()=>({stats:__quarry.stats,car:__quarry.cars[0]}));
  const sampleFrames=async()=>{
    await page.waitForTimeout(report.settleMs);
    await page.evaluate(()=>__quarry.benchmark());
    await page.waitForTimeout(report.sampleMs);
    const {frames}=await page.evaluate(()=>__quarry.endBenchmark());
    const sorted=[...frames].sort((a,b)=>a-b);
    assert.ok(sorted.length>20,'fixed-view frame samples must be populated');
    return {count:sorted.length,meanMs:frames.reduce((a,b)=>a+b,0)/frames.length,
      p95:sorted[Math.floor(sorted.length*.95)],p99:sorted[Math.floor(sorted.length*.99)],frames};
  };
  for(const view of focused?views.slice(0,2):views){
    await page.evaluate(({view,neutral})=>{
      __quarry.resume();__quarry.setInput(neutral);
      __quarry.teleport(0,...view.player);__quarry.simulate(.25);
      __quarry.captureCamera(view.position,view.target);
      document.querySelector('#ui').style.visibility='hidden';
    },{view,neutral});
    // Render several frames after relocating the player so shadows and local
    // reflections cover the actual inspection area in both compared builds.
    const frameTimes=await sampleFrames();
    await page.screenshot({path:path.join(output,view.name+'.png')});
    report.views.push({...view,frameTimes,...await captureStats()});
    console.log(`Captured ${phase}/${view.name}`);
  }
  // Freeze between samples and advance only fixed simulation steps. These are
  // chase poses following a physically moving car, not arbitrary fly-throughs.
  // Camera easing/FOV animation is intentionally held fixed for comparison.
  if(!focused&&!roadsideOnly&&!roadEnds){
  await page.evaluate(({track,neutral,extension,road})=>{
    // Start ahead of the sector so the normal forward chase view contains the
    // approaching extraction faces, rather than starting beside them.
    const index=extension||road?164:149;
    const start=track[index],next=track[index+1],yaw=Math.atan2(next.x-start.x,next.z-start.z);
    __quarry.resume();__quarry.setInput(neutral);__quarry.teleport(0,start.x,start.z,yaw);__quarry.simulate(.25);
    __quarry.velocity(0,Math.sin(yaw)*13,0,Math.cos(yaw)*13);
    __quarry.captureCamera([start.x,5,start.z+8],[start.x,1,start.z]);
  },{track,neutral,extension,road});
  for(let sample=0;sample<=4;sample++){
    const pose=await page.evaluate(({sample,track})=>{
      const q=__quarry;
      if(sample){
        q.resume();
        for(let step=0;step<3;step++){
          const car=q.inspect()[0],p=car.position;
          let nearest=0,distance=Infinity;
          for(let i=1;i<480;i++){
            const d=Math.hypot(track[i].x-p[0],track[i].z-p[2]);
            if(d<distance){distance=d;nearest=i;}
          }
          const target=track[(nearest+9)%480];
          const desired=Math.atan2(target.x-p[0],target.z-p[2]),heading=Math.atan2(car.forward[0],car.forward[2]);
          const error=Math.atan2(Math.sin(desired-heading),Math.cos(desired-heading));
          q.setInput({throttle:.45,steer:Math.max(-.55,Math.min(.55,error*1.8)),brake:0,handbrake:false});
          q.simulate(.25);
        }
      }
      const car=q.inspect()[0],p=car.position,f=car.forward,scale=Math.hypot(f[0],f[2]);
      const fx=f[0]/scale,fz=f[2]/scale,distance=7.4+Math.abs(q.cars[0].speed)*.04;
      const position=[p[0]-fx*distance,p[1]+2.65,p[2]-fz*distance];
      const target=[p[0]+fx*4,p[1]+.5,p[2]+fz*4];
      q.captureCamera(position,target);document.querySelector('#ui').style.visibility='hidden';
      return {time:sample*.75,position,target,car:q.cars[0],input:q.keyboardInput()};
    },{sample,track});
    const frameTimes=await sampleFrames();
    const name=`moving-chase-${String(sample).padStart(2,'0')}`;
    await page.screenshot({path:path.join(output,name+'.png')});
    report.moving.push({name,...pose,frameTimes,...await captureStats()});
    if(road && sample%2===0){
      const hoodPose=await page.evaluate(()=>{
        const c=__quarry.inspect()[0],p=c.position,f=c.forward;
        const scale=Math.hypot(f[0],f[2]),fx=f[0]/scale,fz=f[2]/scale;
        // Match the gameplay hood offset and sightline. As with chase captures,
        // leave the fixture's FOV fixed to compare surface detail consistently.
        const position=[p[0]+fx*1.35,p[1]+.58,p[2]+fz*1.35];
        const target=[p[0]+fx*22,p[1]+.5,p[2]+fz*22];
        __quarry.captureCamera(position,target);
        return {position,target};
      });
      await page.waitForTimeout(700);
      const hoodName=`moving-hood-${String(sample).padStart(2,'0')}`;
      await page.screenshot({path:path.join(output,hoodName+'.png')});
      report.hood.push({name:hoodName,...hoodPose,...await captureStats()});
    }
  }
  const first=report.moving[0].car.position,last=report.moving.at(-1).car.position;
  report.movementMetres=Math.hypot(last[0]-first[0],last[2]-first[2]);
  assert.ok(report.movementMetres>12,'moving chase must show actual vehicle travel');
  assert.ok(report.moving.every(v=>v.car.position.every(Number.isFinite)),'finite chase positions');
  }
  report.modules=await page.evaluate(()=>[...new Set([...Array.from(document.scripts,s=>s.src),...performance.getEntriesByType('resource').map(r=>r.name)].filter(u=>/\.js(?:\?|$)/.test(u)))]);
  report.modelUrls=[...new Set(report.modelUrls)];
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);
  report.passed=true;
}catch(error){report.passed=false;report.failure=String(error);process.exitCode=1;}
finally{
  if(browser)await browser.close();
  report.browserClosed=true;
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({phase,passed:report.passed,bundle:report.bundle,movementMetres:report.movementMetres,errors:report.errors,failure:report.failure,output}));
}
