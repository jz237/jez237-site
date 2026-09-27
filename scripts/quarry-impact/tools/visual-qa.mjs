import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
await fs.mkdir('outputs/visual', { recursive: true });
const browser = await chromium.launch({channel:'chrome',headless:true,
  args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const page = await browser.newPage({viewport:{width:2560,height:1440}});
const errors=[];
page.on('pageerror', e=>errors.push(e.message));
page.on('response', r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
const report={};
try {
  await page.goto(process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/');
  await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  await page.evaluate(async()=>{
    await __quarry.start('playground'); __quarry.clearTestInput();
    __quarry.teleport(0,0,-20,0); __quarry.simulate(.25);
  });
  for(const key of ['ArrowLeft','ArrowRight','KeyA','KeyD']) {
    await page.keyboard.down(key);
    report[key]=await page.evaluate(()=>__quarry.keyboardInput().steer);
    await page.keyboard.up(key);
  }
  assert.equal(report.ArrowLeft,1);assert.equal(report.ArrowRight,-1);
  assert.equal(report.KeyA,-1);assert.equal(report.KeyD,1);
  await page.evaluate(()=>{
    __quarry.captureCamera([6,2.8,-13],[0,1,-20]);
    document.querySelector('#ui').style.visibility='hidden';
  });
  await page.waitForTimeout(1500);
  await page.screenshot({path:'outputs/visual/intact-front.png'});
  report.intact=await page.evaluate(()=>__quarry.stats);
  await page.evaluate(()=>__quarry.captureCamera([-5,1.75,-25],[0,.8,-20]));
  await page.waitForTimeout(500);
  await page.screenshot({path:'outputs/visual/intact-rear.png'});
  await page.evaluate(()=>{
    __quarry.damage(0,17,'front');__quarry.damage(0,12,'left');
    __quarry.captureCamera([5,2.2,-14],[0,.8,-20]);
  });
  await page.waitForTimeout(500);
  await page.screenshot({path:'outputs/visual/moderate-damage.png'});
  await page.evaluate(()=>{
    __quarry.damage(0,26,'front');__quarry.damage(0,24,'left');
    __quarry.captureCamera([4,2,-15],[0,.85,-20]);
  });
  await page.waitForTimeout(500);
  await page.screenshot({path:'outputs/visual/wreck.png'});
  report.damage=await page.evaluate(()=>__quarry.inspect()[0]);
  await page.evaluate(()=>__quarry.captureCamera([58,6,-48],[99,4,-72]));
  await page.waitForTimeout(500);
  await page.screenshot({path:'outputs/visual/quarry-road.png'});
  report.errors=errors;
  assert.equal(errors.length,0,errors.join('\n'));
  report.passed=true;
} catch(error) {
  report.passed=false;report.failure=String(error);process.exitCode=1;
} finally {
  await fs.writeFile('outputs/visual/report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));await browser.close();
}
