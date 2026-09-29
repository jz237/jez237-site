import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out=process.env.QUARRY_IMPACT_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],samples:[]};let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  await page.addInitScript(()=>{
    const create=AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor=function(){const node=create.call(this),meter=this.createAnalyser();meter.fftSize=2048;node.connect(meter);window.__audioMeter={meter,peak:0,clipped:0,readings:0};return node;};
    setInterval(()=>{const p=window.__audioMeter;if(!p)return;const a=new Float32Array(2048);p.meter.getFloatTimeDomainData(a);let peak=0;for(const x of a){peak=Math.max(peak,Math.abs(x));if(Math.abs(x)>=1)p.clipped++;}p.peak=Math.max(p.peak,peak);p.latest=peak;p.readings++;},16);
  });
  await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  report.bundle=await page.locator('script[type="module"]').evaluate(s=>s.src);report.sha256=createHash('sha256').update(await(await page.request.get(report.bundle)).body()).digest('hex');
  await page.evaluate(async()=>{await __quarry.start('derby');__quarry.autopilot(false);__quarry.simulate(4);__quarry.teleport(0,0,23,0);__quarry.setInput({throttle:1,steer:0,brake:0,handbrake:false});window.__impactSamples=[];window.__impactTimer=setInterval(()=>__impactSamples.push({impact:__quarry.impactState,stats:{collisions:__quarry.stats.collisions,voices:__quarry.stats.voices,particles:__quarry.stats.activeParticles,debris:__quarry.stats.debris},health:__quarry.cars[0].health}),16);});
  await page.waitForTimeout(8500);
  await page.screenshot({path:out+'/after-collision.png'});
  report.samples=await page.evaluate(()=>{clearInterval(__impactTimer);return __impactSamples;});
  assert.ok(report.samples.some(s=>s.health<95),'real barrier/player collision damages player');
  assert.ok(report.samples.some(s=>Math.hypot(...Object.values(s.impact.offset))>.001),'real impact reaches rendered spring');
  assert.ok(report.samples.every(s=>s.stats.voices<=18&&s.stats.particles<=1800&&s.stats.debris<=36));
  report.audio=await page.evaluate(()=>({peak:__audioMeter.peak,clipped:__audioMeter.clipped,readings:__audioMeter.readings,...__quarry.audioState}));
  assert.ok(report.audio.peak>0);assert.equal(report.audio.clipped,0,'sampled post-compressor waveform must stay below full scale');assert.equal(report.audio.buffers,38);
  await page.evaluate(()=>__quarry.pause());await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>__quarry.audioState.state),'suspended');
  await page.evaluate(()=>{__quarry.resume();__quarry.mute();});await page.waitForTimeout(250);
  report.mute=await page.evaluate(()=>({...__quarry.audioState,peak:__audioMeter.latest}));assert.equal(report.mute.master,0);assert.equal(report.mute.muted,true);assert.ok(report.mute.peak<.0001);
  await page.evaluate(async()=>{await __quarry.start('playground');__quarry.damage(0,24,'front');__quarry.recover();__quarry.pause();});
  const repaired=await page.evaluate(()=>__quarry.impactState);assert.deepEqual(repaired.offset,{x:0,y:0,z:0});assert.equal(repaired.roll,0);assert.equal(repaired.pitch,0);assert.deepEqual(repaired.effects,{glass:false,debris:false});
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failure:report.failure,samples:report.samples.length,audio:report.audio}));}
