import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'vite';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'.qa-results');fs.mkdirSync(out,{recursive:true});
const record=process.argv.includes('--record-baseline'),baselinePath=path.join(import.meta.dirname,'baseline.json');
const baseline=fs.existsSync(baselinePath)?JSON.parse(fs.readFileSync(baselinePath)):null;
const server=await createServer({root,server:{host:'127.0.0.1',port:5233,strictPort:true}});await server.listen();
let browser;const report={checks:{},views:{}};
function signature(buffer){const p=PNG.sync.read(buffer),cells=[];for(let gy=0;gy<8;gy++)for(let gx=0;gx<12;gx++){let r=0,g=0,b=0,n=0;for(let y=Math.floor(gy*p.height/8);y<(gy+1)*p.height/8;y+=4)for(let x=Math.floor(gx*p.width/12);x<(gx+1)*p.width/12;x+=4){const at=(y*p.width+x)*4;r+=p.data[at];g+=p.data[at+1];b+=p.data[at+2];n++;}cells.push(...[r,g,b].map(v=>Math.round(v/n)));}return cells;}
try{
 browser=await chromium.launch({channel:process.env.QA_BROWSER_CHANNEL??'chrome',headless:true,args:['--force_high_performance_gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 for(const [name,viewport] of Object.entries({desktop:{width:1280,height:800},phone:{width:390,height:844}})){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
  page.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('/favicon.ico'))errors.push(m.text());});
  await page.goto('http://127.0.0.1:5233/?qa=1');await page.waitForFunction(()=>window.aquariumQA&& !document.querySelector('#loading'),null,{timeout:120000});
  const assets=await page.evaluate(()=>{const a=window.aquariumQA;a.paused=true;let mapped=0;const broken=[];a.scene.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material])for(const key of ['map','normalMap','roughnessMap']){const t=m[key];if(t){mapped++;const image=t.image;if(!image||!(image.width||image.videoWidth))broken.push(o.name+':'+key);}}});const gl=a.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {mapped,broken,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),angels:a.angels.states.length,tetras:a.fishes.length,cories:a.cories.animals.length,tetraSizes:a.fishes.map(f=>f.size)};});
  assert.ok(assets.tetraSizes.every(s=>s>=.48*.75&&s<=.57));assert.ok(new Set(assets.tetraSizes).size>8);assert.equal(assets.angels,2);assert.equal(assets.tetras,16);assert.equal(assets.cories,7);assert.ok(assets.mapped>100);assert.deepEqual(assets.broken,[]);
  if(!record&&baseline)assert.equal(assets.mapped,baseline.views[name].assets.mapped,'texture bindings changed; inspect for white/untextured animals');
  await page.waitForTimeout(600);const png=await page.locator('#scene').screenshot({path:path.join(out,name+'-front.png')}),visual=signature(png);
  assert.ok(Math.max(...visual)-Math.min(...visual)>50,'image has visible scene detail');
  if(!record){assert.ok(baseline,'Run --record-baseline once and review the saved screenshots.');const previous=baseline.views[name].visual;const drift=visual.reduce((s,v,i)=>s+Math.abs(v-previous[i]),0)/visual.length;assert.ok(drift<22,`${name} visual difference ${drift.toFixed(1)}: review screenshot`);}
  await page.evaluate(()=>{window.aquariumQA.paused=false;window.aquariumQA.setEffectsMode('full');});
  await page.waitForTimeout(12000);
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.frameProfile,null,{timeout:60000});
  const profile=await page.evaluate(()=>JSON.parse(document.querySelector('#scene').dataset.frameProfile));
  assert.ok(profile.frames>=200);const renderer=assets.renderer;
  if(!record){assert.equal(renderer,baseline.views[name].renderer,'Performance baseline needs the same graphics device; record and review a new baseline for this machine.');for(const key of ['updateMsP95','renderCpuMsP95','frameMsP95'])assert.ok(profile[key]<=baseline.views[name].profile[key]*1.4+5,`${name} ${key} regressed: ${profile[key]} vs ${baseline.views[name].profile[key]}`);}
  await page.locator('#observe').click();await page.mouse.move(4,4);await page.waitForTimeout(22000);assert.equal(await page.locator('#observe').getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('main').evaluate(el=>el.classList.contains('observation-idle')),'idle controls fade');
  const camera=await page.evaluate(()=>window.aquariumQA.camera.position.toArray());assert.ok(camera.every(Number.isFinite));assert.ok(camera[2]>=3.49);
  const observationProfile=await page.evaluate(()=>JSON.parse(document.querySelector('#scene').dataset.frameProfile));
  assert.ok(observationProfile.updateMsP95<=profile.updateMsP95*1.5+3,'observation adds excessive CPU work');
  await page.locator('#scene').screenshot({path:path.join(out,name+'-observation.png')});
  const box=await page.locator('canvas').first().boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.4);await page.mouse.down();await page.mouse.move(box.x+box.width*.55,box.y+box.height*.4,{steps:3});await page.mouse.up();
  assert.equal(await page.locator('#observe').getAttribute('aria-pressed'),'false','input releases camera immediately');
  await page.locator('#observe').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#observe').getAttribute('aria-pressed'),'false','Escape releases camera');
  assert.deepEqual(errors,[]);report.views[name]={visual,renderer,profile,observationProfile,assets};await page.close();
 }
 // Exercise the real entropy path as well as the fixed-seed visual baseline.
 const variation=await browser.newPage({viewport:{width:1280,height:800}}),visits=[],variationErrors=[];
 variation.on('pageerror',e=>variationErrors.push(e.message));
 for(let visit=0;visit<2;visit++){
  await variation.goto('http://127.0.0.1:5233/?qa=1&randomBehavior=1');
  await variation.waitForFunction(()=>window.aquariumQA&&!document.querySelector('#loading'),null,{timeout:120000});
  visits.push(await variation.evaluate(()=>{const a=window.aquariumQA;a.paused=true;return {session:a.behaviorSession,school:a.school.seed,fish:a.fishes.map(f=>f.swim.brain.seed),angels:a.angels.states.map(s=>s.locomotorSeed),cories:a.cories.animals.map(s=>s.seed)};}));
 }
 assert.notEqual(visits[0].session,visits[1].session,'reload must use fresh behavior entropy');
 for(const key of ['school','fish','angels','cories'])assert.notDeepEqual(visits[0][key],visits[1][key],key+' repeats across visits');
 for(const visit of visits)assert.equal(new Set(visit.fish).size,16,'individual decisions need independent seeds');
 assert.deepEqual(variationErrors,[]);await variation.close();report.sessionVariation=true;
 report.checks={browser:true,visual:true,performance:true};
 if(record)fs.writeFileSync(baselinePath,JSON.stringify(report,null,2)+'\n');
 fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.views,null,2));
}catch(e){fs.writeFileSync(path.join(out,'failure.txt'),e.stack??String(e));throw e;}
finally{await browser?.close();await server.close();}
