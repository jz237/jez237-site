import {chromium} from './quarry-impact/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const base=process.env.ARCADE_QA_URL||'http://127.0.0.1:8796';
const out=new URL('./quarry-impact/outputs/arcade-polish/',import.meta.url);
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--mute-audio']});
const report={},errors=[];
async function page(mobile=false){const p=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile});p.on('pageerror',e=>errors.push([p.url(),e.message]));return p;}
try{
 if(!process.env.SKIP_QUARRY){
  const p=await page(true);await p.addInitScript(()=>performance.setResourceTimingBufferSize(5000));
  await p.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');
  await p.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  report.quarryMobile=await p.evaluate(()=>({bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.encodedBodySize,0),cars:window.__quarry.loadedCars,readyMs:performance.now(),variants:performance.getEntriesByType('resource').filter(r=>r.name.includes('/assets/loading/')).length}));
  assert.deepEqual(report.quarryMobile.cars,['coupe']);assert(report.quarryMobile.bytes<170e6);assert(report.quarryMobile.variants>=30);
  await p.setViewportSize({width:1280,height:720});await p.evaluate(()=>window.__quarry.start('playground'));await p.waitForTimeout(1200);
  await p.screenshot({path:fileURLToPath(new URL('quarry-impact.png',out))});await p.close();
 }
 for(const [name,path,hook] of [['gold-digger','2026-11-07/gold-digger','__gd'],['skyhold','2026-11-09/skyhold','__sh'],['shock-horror','2026-11-07/shock-horror','__gd']]){
  const p=await page(true);await p.goto(`${base}/games/${path}/`);
  await p.waitForFunction(h=>window[h]?.G.state==='title',hook,{timeout:90000});
  if(name==='shock-horror'){await p.locator('#warn [data-act="warn-mild"]').count().then(async n=>{if(n)await p.locator('#warn [data-act="warn-mild"]').click();else await p.evaluate(()=>window.__gd.show('title'));});}
  report[name]=await p.evaluate(()=>({overflow:document.querySelector('#title .card').scrollWidth>document.querySelector('#title .card').clientWidth,nightmare:[...document.querySelectorAll('#title [data-v="nightmare"]')].map(e=>e.getBoundingClientRect().right)}));
  assert.equal(report[name].overflow,false);assert(report[name].nightmare.every(x=>x<=390));
  if(name!=='skyhold'){
   await p.locator('#title summary').click();assert.equal(await p.locator('#title details').getAttribute('open'),'');await p.locator('#title summary').click();
  }
  await p.locator('#title [data-act="campaign"]').tap();await p.waitForFunction(h=>window[h].G.state==='play',hook);
  if(name!=='skyhold'){
   await p.waitForFunction(()=>document.querySelector('#tut').textContent.includes('left thumb'));
   report[name].touchTip=await p.locator('#tut').textContent();
  }
  if(name==='shock-horror'){
   assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('#scarecount')).display),'none');
   assert.notEqual(await p.evaluate(()=>getComputedStyle(document.querySelector('#hearts')).display),'none');
   await p.evaluate(()=>{window.__gd.act('options');});
   await p.locator('[data-opt="hud"] [data-v="full"]').click();
   assert.equal(await p.evaluate(()=>document.body.classList.contains('immersive-hud')),false);
   report[name].hudToggle=true;
  }else{
   await p.setViewportSize({width:1280,height:720});await p.waitForTimeout(1600);await p.screenshot({path:fileURLToPath(new URL(name+'.png',out))});
  }
  await p.close();
 }
 {
  const p=await page(true);await p.goto(`${base}/games/2026-06-10/glimmer-grotto/`);await p.getByRole('button',{name:/Enter the grotto/}).click();await p.locator('.game-mount canvas').waitFor();
  report.glimmer=await p.evaluate(()=>Object.fromEntries(['.game-mount','.touch-controls','.tutorial-card','.game-tools'].map(s=>[s,document.querySelector(s)?.getBoundingClientRect().toJSON()])));
  const r=report.glimmer;assert(r['.touch-controls'].top>=r['.game-mount'].bottom);assert(r['.tutorial-card'].top>=r['.game-mount'].bottom);assert(r['.game-tools'].top>=r['.game-mount'].bottom);
  await p.screenshot({path:fileURLToPath(new URL('glimmer-mobile.png',out)),fullPage:true});
  await p.setViewportSize({width:1280,height:720});await p.waitForTimeout(1000);await p.locator('.game-frame').screenshot({path:fileURLToPath(new URL('glimmer-grotto.png',out))});await p.close();
 }
 {
  const p=await page(true);await p.goto(`${base}/games/2026-03-10/plasma-pong/`);assert((await p.locator('#quick-play').getAttribute('href')).includes('?quick=1'));await p.locator('#quick-play').click();await p.waitForFunction(()=>window.__ppb?.G.state==='boot',null,{timeout:90000});
  await p.locator('#press').tap();await p.waitForFunction(()=>window.__ppb.G.state==='vs');
  assert((await p.locator('body').textContent()).includes('Tap FIRE'));report.plasma={quickPlay:true,touchHint:true};await p.close();
 }
 assert.deepEqual(errors,[]);report.passed=true;
}catch(e){report.failure=e.message;throw e;}finally{report.errors=errors;await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();}
