import {chromium} from './quarry-impact/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {fileURLToPath} from 'node:url';
const base=process.env.ARCADE_QA_URL||'http://127.0.0.1:8796';const out=new URL('./quarry-impact/outputs/guidance/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--mute-audio']});const report={},errors=[];
const save=p=>p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>/^sh\.(medals|mastery|best|reach)|highscores/.test(k))));
try{
 for(const [name,width,height,mobile] of [['desktop',1280,720,false],['phone',390,844,true],['landscape',844,390,true]]){
  const p=await browser.newPage({viewport:{width,height},hasTouch:mobile,isMobile:mobile});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/games/2026-11-09/skyhold/?fixed=1');await p.waitForFunction(()=>window.__sh?.G.state==='title',null,{timeout:60000});const saved=await save(p);
  await p.locator('#title [data-act="practice"]').click();assert.equal(await p.evaluate(()=>__sh.G.mode),'practice');
  await p.evaluate(()=>__sh.tick(1));assert((await p.locator('#practice-instruction').textContent()).includes(mobile?'thumb':'←'));
  await p.screenshot({path:fileURLToPath(new URL('skyhold-'+name+'.png',out))});
  if(name==='desktop'){await p.evaluate(()=>{window.qaPads=[{axes:[.8,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))}];Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.qaPads});__sh.tick(60,1/60,false);});assert((await p.locator('#practice-instruction').textContent()).includes('trigger'));await p.evaluate(()=>{qaPads=[];});}
  await p.keyboard.down('ArrowRight');await p.evaluate(()=>__sh.tick(90,1/60,false));await p.keyboard.up('ArrowRight');assert.equal(await p.evaluate(()=>__sh.G.practice.stage),'fire');
  await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>__sh.G.state),'paused');await p.evaluate(()=>__sh.tick(120,1/60,false));assert.equal(await p.locator('#practice-coach').isVisible(),false);
  await p.locator('#pause [data-act="resume"]').click();await p.keyboard.down('Space');await p.evaluate(()=>__sh.tick(80,1/60,false));await p.keyboard.up('Space');assert.equal(await p.evaluate(()=>__sh.G.practice.stage),'catch');
  await p.evaluate(()=>{const {G,I}=__sh;for(let n=0;n<600&&G.practice.stage==='catch';n++){const p=G.W.players[0],s=G.practice.settler;I.keys.clear();const dx=s.x-p.x,dy=s.y-p.y;if(Math.abs(dx)>1)I.keys.add(dx>0?'ArrowRight':'ArrowLeft');if(Math.abs(dy)>1)I.keys.add(dy>0?'ArrowUp':'ArrowDown');__sh.tick(1,1/60,false);}I.keys.clear();});
  assert.equal(await p.evaluate(()=>__sh.G.practice.stage),'land');await p.keyboard.down('ArrowDown');await p.evaluate(()=>__sh.tick(300,1/60,false));await p.keyboard.up('ArrowDown');assert.equal(await p.evaluate(()=>__sh.G.practice.stage),'done');assert.deepEqual(await save(p),saved);
  await p.screenshot({path:fileURLToPath(new URL('skyhold-complete-'+name+'.png',out))});
  if(name==='desktop'){await p.evaluate(()=>{qaPads=[{axes:[0,0],buttons:Array.from({length:17},(_,i)=>({pressed:i===0,value:i===0?1:0}))}];__sh.tick(1);qaPads=[];});}else await p.locator('#practice-start').click();assert.equal(await p.evaluate(()=>__sh.G.mode),'campaign');assert.equal(await p.evaluate(()=>__sh.G.W.diff),await p.evaluate(()=>__sh.settings.diff));assert.equal(await p.locator('#practice-coach').isVisible(),false);
  report['skyhold-'+name]={completed:true,progressPreserved:true};await p.close();
 }
 for(const [name,width,height,mobile] of [['desktop',1280,720,false],['phone',390,844,true],['landscape',844,390,true]]){
  const p=await browser.newPage({viewport:{width,height},hasTouch:mobile,isMobile:mobile});p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/games/2026-03-10/plasma-pong/battle/?fixed=1&quick=1');await p.waitForFunction(()=>window.__ppb?.G.state==='boot');if(mobile)await p.locator('#press').tap();else await p.locator('#press').click();
  await p.evaluate(()=>{for(let i=0;i<14&&__ppb.G.state!=='play';i++)__ppb.tick(1);__ppb.tick(1/60);});assert.equal(await p.evaluate(()=>__ppb.G.state),'play');assert.equal(await p.locator('#opening-coach').isVisible(),true);assert((await p.locator('#opening-text').textContent()).includes(mobile?'Drag':'mouse'));
  await p.screenshot({path:fileURLToPath(new URL('plasma-'+name+'.png',out))});await p.keyboard.down('ArrowLeft');await p.evaluate(()=>__ppb.tick(1/60,35));await p.keyboard.up('ArrowLeft');for(const key of ['ArrowRight','ArrowUp','ArrowDown']){if(await p.evaluate(()=>__ppb.G.coach.stage!=='move'))break;await p.keyboard.down(key);await p.evaluate(()=>__ppb.tick(1/60,90));await p.keyboard.up(key);}assert.equal(await p.evaluate(()=>__ppb.G.coach.stage),'fire');assert((await p.locator('#opening-text').textContent()).includes('Space'));
  await p.keyboard.press('Space');await p.evaluate(()=>__ppb.tick(1/60,2));assert.equal(await p.evaluate(()=>__ppb.G.coach.stage),'return');
  if(name==='desktop'){
   await p.evaluate(async()=>{const {spawnBall}=await import('./js/sim.js?v=6'),G=__ppb.G,p=G.humans[0].p;G.W.balls.length=0;spawnBall(G.W,p.x,p.z-.6,0,10,-1);__ppb.tick(1/120,15);});
   assert.equal(await p.evaluate(()=>__ppb.G.coach.stage),'goal');await p.evaluate(()=>__ppb.tick(.05,110));assert.equal(await p.evaluate(()=>localStorage.getItem('ppb.opening-tips.v1')),'done');
   await p.evaluate(()=>__ppb.goTitle());await p.locator('#title [data-act="howto"]').click();await p.locator('[data-act="tips-enable"]').click();assert.equal(await p.evaluate(()=>localStorage.getItem('ppb.opening-tips.v1')),null);
   await p.evaluate(()=>{__ppb.startCampaign('normal','p1');for(let i=0;i<14&&__ppb.G.state!=='play';i++)__ppb.tick(1);__ppb.tick(1/60);});
   await p.evaluate(()=>{window.qaPads=[{axes:[.8,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))}];Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>qaPads});__ppb.tick(1/60);});assert((await p.locator('#opening-text').textContent()).includes('stick'));await p.evaluate(()=>{qaPads=[];});
  }
  await p.keyboard.press('Escape');await p.evaluate(()=>__ppb.tick(1/60));assert.equal(await p.locator('#opening-coach').isVisible(),false);await p.locator('#pause [data-act="resume"]').click();await p.evaluate(()=>__ppb.tick(1/60));await p.locator('#opening-coach [data-act="tips-dismiss"]').click();assert.equal(await p.evaluate(()=>localStorage.getItem('ppb.opening-tips.v1')),'done');
  await p.evaluate(()=>{__ppb.startCampaign('normal','p1');for(let i=0;i<14&&__ppb.G.state!=='play';i++)__ppb.tick(1);__ppb.tick(1/60);});assert.equal(await p.locator('#opening-coach').isVisible(),false);report['plasma-'+name]={inputSwitch:true,pause:true,dismissRemembered:true};await p.close();
 }
 assert.deepEqual(errors,[]);report.passed=true;
}catch(e){report.failure=e.message;throw e;}finally{report.errors=errors;await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();}
