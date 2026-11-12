import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.QUARRY_QA_URL??'http://127.0.0.1:8795/';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--mute-audio']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>performance.setResourceTimingBufferSize(5000));
const menu=()=>page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:90000});
const report={};
try{
 await page.goto(base);await menu();
 report.startup=await page.evaluate(()=>({cars:window.__quarry.loadedCars,bytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.encodedBodySize,0)}));
 assert.deepEqual(report.startup.cars,['coupe']);
 await page.click('#car-all');await page.click('[data-car="sedan"]');await menu();
 assert.deepEqual((await page.evaluate(()=>window.__quarry.loadedCars)).sort(),['coupe','sedan']);
 let failed=false;
 await page.route('**/models/packed/utility-*.glb.gz',route=>{if(!failed){failed=true;return route.fulfill({status:503,body:'Test retry'});}return route.continue();});
 await page.click('#car-all');await page.click('[data-car="utility"]');
 await page.getByRole('alert').filter({hasText:'could not be loaded'}).waitFor();await menu();
 assert.equal(failed,true);assert.equal(await page.evaluate(()=>window.__quarry.cars[0].kind),'sedan');
 await page.click('#car-all');await page.click('[data-car="utility"]');await menu();
 assert.equal(await page.evaluate(()=>window.__quarry.cars[0].kind),'utility');
 report.retry=true;
 for(const mode of ['playground','race','derby']){
  await page.evaluate(mode=>window.__quarry.start(mode),mode);
  await page.waitForFunction(()=>['countdown','playing'].includes(window.__quarry.state));
  const state=await page.evaluate(()=>({cars:window.__quarry.cars.map(c=>c.kind),loaded:window.__quarry.loadedCars}));
  for(const car of state.cars)assert(state.loaded.includes(car));
  assert(state.loaded.length<26);report[mode]=state;
  await page.evaluate(()=>window.__quarry.menu());await menu();
 }
 assert.deepEqual(errors,[]);
 report.passed=true;
}catch(error){
 report.failure=error.message;report.state=await page.evaluate(()=>({state:window.__quarry?.state,cars:window.__quarry?.loadedCars,alerts:[...document.querySelectorAll('[role=alert]')].map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()})),text:document.querySelector('#ui')?.textContent?.slice(-1500)}));throw error;
}finally{
 report.errors=errors;await fs.mkdir('outputs',{recursive:true});await fs.writeFile('outputs/loading-qa.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));await browser.close();
}
