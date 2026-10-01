// GPU regressions for the production deck solver and layered shadow receivers.
// Usage: CHROME_CHANNEL=msedge PLAYWRIGHT_MODULE=/path/to/playwright node scripts/open-sea/verify-deck-water.mjs http://localhost:8833/after/
import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const url=new URL(process.argv[2]||'http://localhost:8833/after/');if(!url.searchParams.has('ship'))url.searchParams.set('ship','schooner');url.searchParams.set('shot','1');url.searchParams.set('t','15');url.searchParams.set('sea','4.6');url.searchParams.set('res','.6');
const browser=await chromium.launch({channel:process.env.CHROME_CHANNEL||undefined,headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const report={};
try{
 const p=await browser.newPage({viewport:{width:1000,height:760}}),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});await p.goto(url.href);await p.waitForFunction(()=>window.__seaReady);
 report.fluid=await p.evaluate(async()=>{
  const a=__sea.app,{gl,readF32}=await import('./js/gl.js'),{DeckWash}=await import('./js/deck-wash.js');
  const W=128,H=32,area=(48/W)*(10/H),Y=a.yacht;
  const upload=(t,d)=>{gl.bindTexture(gl.TEXTURE_2D,t.tex);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,W,H,gl.RGBA,gl.FLOAT,d);};
  const sea=new Float32Array(W*H*4);sea.fill(-7);const seaTex=(await import('./js/gl.js')).tex2D(W,H,{fmt:'rgba32f',filter:'nearest',data:sea,dataType:gl.FLOAT});
  const ctx={hullWet:seaTex,rain:0},pose={axes:{bow:[1,0,0],up:[0,1,0],sb:[0,0,1]}};
  const stats=d=>{let volume=0,peak=0,vmax=0,wet=0,min=Infinity;for(let i=0;i<d.length;i+=4){volume+=d[i]*area;peak=Math.max(peak,d[i]);min=Math.min(min,d[i]);vmax=Math.max(vmax,Math.hypot(d[i+1],d[i+2])/Math.max(d[i],.00001));wet+=d[i+3];}return{volume,peak,vmax,min,wet,finite:d.every(Number.isFinite)};};
  const make=(closed=true)=>{
    const wash=new DeckWash(Y.metadata),terrain=readF32((awaitFBO(wash.terrain)),0,0,W,H);wash.inlet=false;
    if(closed){for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=(j*W+i)*4;if(!terrain[k+1])terrain[k+2]=1;}}
    upload(wash.terrain,terrain);return{wash,terrain};
  };
  function awaitFBO(tex){return (gl.bindFramebuffer(gl.FRAMEBUFFER,null),(window.__fixtureFBO||=gl.createFramebuffer()),gl.bindFramebuffer(gl.FRAMEBUFFER,window.__fixtureFBO),gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex.tex,0),{fbo:window.__fixtureFBO});}
  const {wash,terrain}=make(),slug=new Float32Array(W*H*4);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=(j*W+i)*4,x=(i+.5)*48/W-24,z=(j+.5)*10/H-5;if(terrain[k+1]&&!terrain[k+2]&&x>4&&x<7&&z>.6&&z<2.2)slug[k]=.16;}
  upload(wash.cur,slug);const start=stats(slug);
  for(let n=0;n<300;n++)wash.update(ctx,pose,1/60);
  const flat=stats(readF32(wash.curF,0,0,W,H));
  const tilted={axes:{bow:[1,-.10,0],up:[.10,.99,0],sb:[0,0,1]}};
  for(let n=0;n<240;n++)wash.update(ctx,tilted,1/60);
  const tiltedData=readF32(wash.curF,0,0,W,H),heel=stats(tiltedData);
  let blockedWater=0;for(let k=0;k<terrain.length;k+=4)if(terrain[k+2]>.5)blockedWater+=tiltedData[k];
  const identical=steps=>{const w=make().wash;upload(w.cur,slug);for(let n=0;n<50;n++)for(const dt of steps)w.update(ctx,pose,dt);return readF32(w.curF,0,0,W,H);};
  const even=identical(Array(6).fill(1/60)),uneven=identical([.003,.049,.011,.037]);let difference=0;for(let i=0;i<even.length;i++)difference=Math.max(difference,Math.abs(even[i]-uneven[i]));
  const open=make(false).wash;upload(open.cur,slug);for(let n=0;n<600;n++)open.update(ctx,{axes:{bow:[1,0,0],up:[0,.98,.20],sb:[0,-.20,.98]}},1/60);
  const drained=stats(readF32(open.curF,0,0,W,H));
  for(const dt of [.003,.1,2,.011,.049,5,.004,.016])open.update(ctx,pose,dt);
  const hitches=stats(readF32(open.curF,0,0,W,H));
  return{start,flat,heel,blockedWater,difference,drained,hitches};
 });
 console.log('Fluid',report.fluid);const f=report.fluid;
 assert.ok(f.flat.finite&&f.heel.finite&&f.hitches.finite);assert.ok(Math.abs(f.flat.volume/f.start.volume-1)<.001);assert.ok(Math.abs(f.heel.volume/f.start.volume-1)<.001);
 assert.equal(f.blockedWater,0);assert.equal(f.difference,0);assert.ok(f.drained.volume<f.start.volume*.85);assert.ok(f.hitches.peak<=1.5&&f.hitches.vmax<=4.01&&f.hitches.min>=0);
 report.shadows=await p.evaluate(async()=>{
  const a=__sea.app,{gl,Program,FS_VERT,tex2D,makeFBO,bindFBO,drawFS,readF32}=await import('./js/gl.js'),{bindLighting}=await import('./js/lighting.js');
  await __sea.warm(22,.05);Object.assign(a.yacht,{pitch:0,roll:0,yaw:0});a.yacht._matrix();a.placeRelativeToYacht([48,15,85,2.8]);
  const f=makeFBO([tex2D(256,96,{fmt:'rgba32f',filter:'nearest'})]);
  const fs=`#include <common>\n#include <atmo>\n#include <atmo.sample>\n#include <lighting>\n#include <deck-wash>\nin vec2 vUv;uniform float uMode;out vec4 o;
    void main(){vec2 p=(vUv-.5)*vec2(52,16);vec3 deck=vec3(p.x,deckFloor(p),p.y);float s=yachtShadowLocal(deck,vec3(0,1,0),true);o=vec4(s,s,s,1);}`;
  const prog=new Program('shadow.receiver.check',FS_VERT,fs),cases=[];
  const clear=tex2D(1,1,{fmt:'rgba32f',filter:'nearest',data:new Float32Array([1,0,-1,0]),dataType:gl.FLOAT});
  for(const alt of [65,28,5]){
   Object.assign(a.goal,{sunManual:true,sunH:alt,sunAz:90-a.yacht.psi*180/Math.PI+65});a.render(.016);
   bindFBO(f);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);bindLighting(prog.use(),a.ctx);drawFS();
   const pixels=readF32(f,0,0,256,96);let dark=0,light=0,min=1,max=0;
   for(let i=0;i<pixels.length;i+=4){min=Math.min(min,pixels[i]);max=Math.max(max,pixels[i]);if(pixels[i]<.8)dark++;if(pixels[i]>.99)light++;}
   bindFBO(f);bindLighting(prog.use(),a.ctx);prog.t('uYachtShadow',2,clear).t('uYachtShadowOpacity',19,clear);drawFS();
   const opaqueOnly=readF32(f,0,0,256,96);let brightened=0,addedShadow=0;
   for(let i=0;i<pixels.length;i+=4){if(pixels[i]>opaqueOnly[i]+1e-6)brightened++;if(pixels[i]<opaqueOnly[i]-.02)addedShadow++;}
   cases.push({alt,dark,light,min,max,brightened,addedShadow,finite:pixels.every(Number.isFinite),error:gl.getError()});
  }
  return cases;
 });console.log('Shadows',report.shadows);assert.ok(report.shadows.every(s=>s.dark>50&&s.light>100&&s.finite&&s.error===0&&s.brightened===0));assert.ok(report.shadows.some(s=>s.addedShadow>100));
 report.samplers=await p.evaluate(async()=>{
  const a=__sea.app,{gl}=await import('./js/gl.js');return [a.water.prog,a.yacht.progHull,a.yacht.progSail,a.deckWash.prog].map(p=>{
   const list=[];for(let i=0;i<gl.getProgramParameter(p.p,gl.ACTIVE_UNIFORMS);i++){const u=gl.getActiveUniform(p.p,i);if([gl.SAMPLER_2D,gl.SAMPLER_2D_ARRAY,gl.SAMPLER_3D].includes(u.type))list.push({name:u.name,unit:gl.getUniform(p.p,gl.getUniformLocation(p.p,u.name)),type:u.type});}
   return {name:p.name,count:list.length,list,max:gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)};
  });
 });assert.ok(report.samplers.every(p=>p.count<=p.max));console.log('Sampler counts',report.samplers.map(p=>({name:p.name,count:p.count,max:p.max})));

 report.edgeInflow=await p.evaluate(async()=>{
   const a=__sea.app,{gl,readF32,tex2D,makeFBO}=await import('./js/gl.js'),{DeckWash}=await import('./js/deck-wash.js');
   const sea=new Float32Array(128*32*4),pose={axes:{bow:[1,0,0],up:[0,1,0],sb:[0,0,1]}};
   const run=interiorOnly=>{
     const wash=new DeckWash(a.yacht.metadata),terrain=readF32(makeFBO([wash.terrain]),0,0,128,32);
     for(let k=0;k<sea.length;k+=4)sea[k]=interiorOnly&&!terrain[k+1]?-7:3.25;
     const field=tex2D(128,32,{fmt:'rgba32f',filter:'nearest',data:sea,dataType:gl.FLOAT});
     for(let i=0;i<120;i++)wash.update({hullWet:field,rain:0},pose,1/60);
     const d=readF32(wash.curF,0,0,128,32);let volume=0,peak=0;
     for(let k=0;k<d.length;k+=4){volume+=d[k]*(48/128)*(10/32);peak=Math.max(peak,d[k]);}
     return{volume,peak,finite:d.every(Number.isFinite)};
   };
   return{wetEdge:run(false),dryEdge:run(true),error:gl.getError()};
 });assert.ok(report.edgeInflow.wetEdge.volume>1);assert.equal(report.edgeInflow.dryEdge.volume,0);assert.equal(report.edgeInflow.error,0);
 report.hitches=await p.evaluate(async()=>{
   const a=__sea.app,{gl,readF32}=await import('./js/gl.js');a.goal.rain=1;a.state.rain=1;a.setWhirlpool(true);
   let peak=0,steps=0;
   for(let i=0;i<20;i++){
     if(i===9)a.setWhirlpool(false);if(i===14)a.setWhirlpool(true);
     __sea.shot([.003,.1,2,.011,.049][i%5]);
     const fluid=readF32(a.deckWash.curF,0,0,128,32),ripples=readF32(a.ripples.curF,0,0,a.ripples.N,a.ripples.N);
     if(!fluid.every(Number.isFinite)||!ripples.every(Number.isFinite))throw Error('Nonfinite fluid GPU state');
     for(let k=0;k<fluid.length;k+=4)peak=Math.max(peak,fluid[k]);
     if(gl.getError())throw Error('WebGL error');steps=a.deckWash.steps;
   }
   return{frames:20,peak,steps};
 });assert.ok(report.hitches.peak<=1.5);assert.deepEqual(errors,[]);console.log('GPU deck-water checks passed',JSON.stringify(report,null,2));
}finally{await browser.close();}
