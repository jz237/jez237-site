const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs');
(async()=>{
const version=process.argv[2]||'round3-current';
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist','--disable-frame-rate-limit','--disable-gpu-vsync']});
const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
if(process.env.CPU_RATE)await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate',{rate:Number(process.env.CPU_RATE)});
page.on('pageerror',e=>{errors.push(String(e));console.log(String(e))});
page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_CONNECTION_REFUSED'))errors.push(m.text().slice(0,1000));});
await page.addInitScript(()=>{
 window.nativeRAF=requestAnimationFrame.bind(window);window.requestAnimationFrame=()=>0;
 let seed=729;Math.random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
});
await page.route('**/vendor/three.core.js',async route=>{
 const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace('function generateUUID() {',"let benchUuid=0; function generateUUID() { return '00000000-0000-4000-8000-'+(++benchUuid).toString(16).padStart(12,'0');")});
});
await page.route('**/js/main.js*',async route=>{
 const response=await route.fetch();let body=await response.text();
 body=body.replace('G, quality, world, startGame,','renderer, scene, foliage, sky, composer, Tank, getHeight, G, quality, world, startGame,');
 body=body.replaceAll('  foliage.update(dt, camera.position.x, camera.position.z);','  if(window.benchView) camera.position.fromArray(window.benchView.pos);\n  foliage.update(dt, camera.position.x, camera.position.z);');
 body=body.replace("const armorLeft = waves.aliveEnemies().length + props.countAlive('pillbox');",'const armorLeft = 1;');
 body=body.replace('  composer.render();',`  if(window.benchView){camera.position.fromArray(window.benchView.pos);camera.lookAt(...window.benchView.look);camera.updateMatrixWorld();}
  for(const t of window.extraTanks||[])t.syncVisual(1,1/60);
  composer.render();`);
 await route.fulfill({response,body});
});
await page.goto((process.env.IRON_RIDGE_BASE_URL||'http://127.0.0.1:8080/')+version+'/');await page.waitForFunction(()=>window.__IR);
await page.evaluate(()=>{__IR.waves.spawnWave=()=>({targets:1,tanks:[],pillboxes:0});__IR.waves.spawnPatrol=()=>[];__IR.startGame();__IR.quality.setLock(2);__IR.pump(60);__IR.player().hp=10000;});
await page.waitForTimeout(500);
const views=await page.evaluate(()=>{
 const ir=__IR;
 let best=null,bestCount=0;
 for(const t of ir.foliage.trees){if(t.culled)continue;const n=ir.foliage.treesNear(t.x,t.z,24).length;if(n>bestCount&&Math.hypot(t.x,t.z)<200){best=t;bestCount=n;}}
 const t=best,h=ir.getHeight(t.x,t.z);
 window.stressTree={x:t.x,y:t.y,z:t.z,variant:t.variant};
 window.testViews=[{name:'ground-tank',pos:[4,3.2,-6],look:[0,1,2]},
  {name:'dense-forest',pos:[t.x-9,h+3.2,t.z-12],look:[t.x,h+4,t.z]},
  {name:'combat',pos:[0,7,-13],look:[0,3,30]},
  {name:'forest-drive',pos:[t.x-9,h+3.2,t.z-12],look:[t.x,h+4,t.z]}];
 return {denseTreeCount:bestCount,views:window.testViews};
});
const results=[];
for(const quality of [Number(process.argv[3]||2)])for(const view of views.views.filter(v=>v.name===(process.argv[4]||'dense-forest'))){
 await page.evaluate(({quality,view})=>{
  const ir=__IR;ir.quality.setLock(quality);ir.renderer.setPixelRatio(1);ir.composer.setPixelRatio(1);
  ir.renderer.setSize(1920,1080);ir.composer.setSize(1920,1080);
  window.benchView=view;ir.camera.position.fromArray(view.pos);ir.camera.lookAt(...view.look);
  ir.foliage.update(.2,view.pos[0],view.pos[2]);ir.sky.update(0,ir.camera.position);
  if(view.name==='combat'){
   window.extraTanks=[];
   for(let i=0;i<8;i++)window.extraTanks.push(new ir.Tank(ir.scene,ir.world,{x:(i%4-1.5)*6,z:10+Math.floor(i/4)*12,scheme:i%2?'heavy':'scout'}));
   for(let i=0;i<360;i++)ir.effects.treadMark(i%2?1.06:-1.06,Math.floor(i/2)*.85-120,0);
  }
  ir.composer.renderToScreen=false;
 },{quality,view});
 const profiler=process.env.PROFILE?await page.context().newCDPSession(page):null;
 if(profiler){await profiler.send('Profiler.enable');await profiler.send('Profiler.start');}
 const result=await page.evaluate(async({view,quality,measuredFrames,warmupFrames})=>{
  const ir=__IR,gl=ir.renderer.getContext(),ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if(!ext)throw Error('GPU timer unavailable; benchmark cannot substitute FPS');
  const next=()=>new Promise(r=>nativeRAF(r));
  const cpu=[],gpu=[],lod=[],pending=[];
  const original=ir.composer.render.bind(ir.composer);let measure=false;
  ir.composer.render=(...args)=>{if(!measure)return original(...args);const q=gl.createQuery();gl.beginQuery(ext.TIME_ELAPSED_EXT,q);original(...args);gl.endQuery(ext.TIME_ELAPSED_EXT);pending.push(q);};
  function collect(){for(let i=pending.length-1;i>=0;i--){const q=pending[i];if(gl.getQueryParameter(q,gl.QUERY_RESULT_AVAILABLE)){if(!gl.getParameter(ext.GPU_DISJOINT_EXT))gpu.push(gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6);gl.deleteQuery(q);pending.splice(i,1);}}}
  function stress(i){
    if(view.name==='forest-drive'){
      const a=i*.025,c=window.stressTree;window.benchView.pos=[c.x+Math.cos(a)*17,c.y+3.5,c.z+Math.sin(a)*17];
    }
    if(view.name==='combat'&&i%12===0){for(let j=0;j<3;j++){const p=ir.player().body.position.clone();p.x=(j-1)*8;p.z=15+(i%24);p.y=ir.getHeight(p.x,p.z)+1;ir.effects.explosion(p,1.2);}}
  }
  for(let i=0;i<warmupFrames;i++){stress(i);ir.pump(1);await next();}
  ir.renderer.info.autoReset=false;let counts;
  for(let i=0;i<measuredFrames;i++){
    stress(i);ir.renderer.info.reset();measure=i%2===0;
    const start=performance.now();ir.pump(1);cpu.push(performance.now()-start);measure=false;
    counts={...ir.renderer.info.render};await next();collect();
  }
  while(pending.length){await next();collect();}
  ir.composer.render=original;
  const pct=(a,p)=>[...a].sort((a,b)=>a-b)[Math.floor((a.length-1)*p)];
  const T=await import('three'),projection=new T.Vector3();
  let spritePixels=0,activeParticles=0;
  const maxPoint=gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
  for(const pool of [ir.effects.smoke,ir.effects.fire])for(let i=0;i<pool.count;i++)if(pool.sizeAttr[i]>0){
    projection.set(pool.pos[i*3],pool.pos[i*3+1],pool.pos[i*3+2]).applyMatrix4(ir.camera.matrixWorldInverse);
    if(projection.z<-.1){const d=Math.min(maxPoint,pool.points.material.uniforms.pointLimit?.value||maxPoint,pool.sizeAttr[i]*220/-projection.z);spritePixels+=d*d;activeParticles++;}
  }
  const textures=new Set();ir.scene.traverse(o=>{for(const m of (Array.isArray(o.material)?o.material:o.material?[o.material]:[])){
    for(const value of Object.values(m))if(value?.isTexture)textures.add(value);
    for(const u of Object.values(m.uniforms||{}))if(u.value?.isTexture)textures.add(u.value);
  }});
  let assetBytes=0;for(const tex of textures){const im=tex.image;if(im?.width&&im?.height)assetBytes+=im.width*im.height*4*(tex.generateMipmaps?4/3:1);}
  return {view:view.name,quality,spriteRasterPixels:Math.round(spritePixels),activeParticles,assetTextureMiB:assetBytes/1048576,resolution:[ir.renderer.domElement.width,ir.renderer.domElement.height],cpuMedian:pct(cpu,.5),cpuP95:pct(cpu,.95),gpuMedian:pct(gpu,.5),gpuP95:pct(gpu,.95),samples:gpu.length,counts,nearTrees:ir.foliage.nearSelected?.length||0,memory:{...ir.renderer.info.memory}};
 },{view,quality,measuredFrames:Number(process.env.BENCH_FRAMES||150),warmupFrames:Number(process.env.BENCH_WARMUP||30)});
 if(profiler){const {profile}=await profiler.send('Profiler.stop');fs.writeFileSync(version+'-profile.json',JSON.stringify(profile));}
 results.push(result);console.log(JSON.stringify(result));
 await page.evaluate(()=>{__IR.composer.renderToScreen=true;__IR.composer.render();});
 if(quality===2)await page.screenshot({path:version+'-'+view.name+'.png'});
 await page.evaluate(()=>{for(const t of window.extraTanks||[])t.removeFromWorld();window.extraTanks=[];});
}
fs.writeFileSync(version+'-'+process.argv[3]+'-'+process.argv[4]+(process.env.REPORT_SUFFIX||'')+'-stress.json',JSON.stringify({version,hardware:'RTX 5090 / Edge ANGLE D3D11',views,results,errors},null,2));
console.log(JSON.stringify({errors}));await browser.close();
})();

