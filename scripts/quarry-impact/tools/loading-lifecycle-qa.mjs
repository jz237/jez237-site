import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const out=process.env.QUARRY_LOADING_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});
assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={checks:[],errors:[]};let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');
  await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  await page.evaluate(()=>{
    window.__startComplete=__quarry.startDemo('derby');
    if(__quarry.state!=='loading')throw new Error('Expected asynchronous event preparation');
    window.dispatchEvent(new Event('blur'));
  });
  await page.evaluate(()=>window.__startComplete);
  assert.equal(await page.evaluate(()=>__quarry.state),'paused');
  const frozen=await page.evaluate(()=>__quarry.cars);
  await page.waitForTimeout(350);assert.deepEqual(await page.evaluate(()=>__quarry.cars),frozen);
  await page.click('#resume');await page.waitForFunction(()=>__quarry.state==='playing');
  await page.selectOption('#demo-camera','overview');await page.selectOption('#demo-car','2');
  await page.click('#demo-exit');assert.equal(await page.evaluate(()=>__quarry.state),'menu');
  report.checks.push('Focus loss during event preparation pauses the ready event; resume and demo controls work');
  await page.close();

  const fallback=await browser.newPage({viewport:{width:1280,height:720}});
  fallback.on('pageerror',e=>report.errors.push(e.message));
  await fallback.route('**/models/packed/*.glb.gz',route=>route.fulfill({status:404,body:'Not found'}));
  const models=[];fallback.on('response',r=>{if(/\/models\/.*\.glb$/.test(r.url()))models.push({url:r.url(),status:r.status()});});
  await fallback.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');
  await fallback.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  assert.ok(models.length>=15);assert.ok(models.every(r=>r.status===200));
  await fallback.evaluate(()=>__quarry.start('playground'));
  assert.equal(await fallback.evaluate(()=>__quarry.state),'playing');
  assert.equal(await fallback.evaluate(()=>__quarry.audioState.buffers),38);
  report.originalModels=models;report.checks.push('Missing packed downloads fall back to original models and start with all 38 sounds');
  assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();report.browserClosed=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
