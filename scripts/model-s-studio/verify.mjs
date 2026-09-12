import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const url=process.env.STUDIO_URL || 'http://127.0.0.1:8768/demos/model-s-studio/';
const shots=process.env.STUDIO_SHOTS || path.join(tmpdir(),'model-s-studio-validation');await mkdir(shots,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const errors=[];const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(new URL(url).origin))errors.push(`${r.status()} ${r.url()}`);});
const read=()=>page.evaluate(()=>window.modelSStudio.getState());
const settled=amount=>page.waitForFunction(v=>window.modelSStudio.getState().amount===v,amount,{timeout:15000});
try{
 await page.goto(url);await page.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});
 assert.equal((await read()).pieces,297);assert.equal((await read()).visible,297);
 await page.screenshot({path:path.join(shots,'assembled.png')});
 await page.locator('#explode-button').click();await settled(1);
 const exploded=await page.evaluate(()=>window.modelSStudio.getParts());
 assert.ok(exploded.every(p=>Math.hypot(...p.position.map((v,i)=>v-p.base[i]))>.01),'Every visual piece must move');
 await page.screenshot({path:path.join(shots,'exploded.png')});
 await page.locator('#part-list').selectOption('2');await page.locator('#isolate').click();await page.waitForTimeout(1100);
 assert.equal((await read()).visible,1);assert.equal((await read()).selected,'Center touchscreen · 003');
 await page.screenshot({path:path.join(shots,'isolated.png')});
 await page.locator('#reset').click();await settled(0);
 const restored=await page.evaluate(()=>window.modelSStudio.getParts());
 assert.ok(restored.every(p=>p.position.every((v,i)=>v===p.base[i])),'Reassembly must restore exact original positions');
 assert.equal((await read()).visible,297);
 await page.locator('#system').selectOption('Wheels');assert.ok((await read()).visible>0);assert.ok((await read()).visible<297);
 await page.locator('#system').selectOption('all');await page.locator('#search').fill('touchscreen');
 const matches=await page.locator('#part-list option').allTextContents();assert.ok(matches.length>1&&matches.length<10);assert.ok(matches.slice(1).every(label=>label.toLowerCase().includes('touchscreen')));
 await page.locator('#search').fill('no-such-component');assert.equal(await page.locator('#part-list option').count(),1);
 await page.locator('#reset').click();await page.locator('#cabin').click();assert.equal((await read()).visible,261);
 await page.locator('[aria-label="Pearl white"]').click();assert.equal(await page.locator('#paint-name').textContent(),'Pearl white');
 await page.locator('#label-toggle').click();await page.waitForTimeout(100);assert.equal(await page.locator('#label-toggle').getAttribute('aria-pressed'),'true');
 await page.locator('#reset').click();await page.locator('#animate').click();await page.waitForTimeout(2500);assert.ok((await read()).target>.1);await page.locator('#animate').click();
 await page.locator('#reset').click();await page.locator('#viewport').focus();await page.keyboard.press('e');await settled(1);await page.keyboard.press('r');await settled(0);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1100);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No mobile horizontal overflow');
 await page.screenshot({path:path.join(shots,'mobile.png'),fullPage:true});
 // Reduced-motion changes must still transform the geometry, without easing.
 const reduced=await browser.newPage({viewport:{width:1024,height:900},reducedMotion:'reduce'});reduced.on('pageerror',e=>errors.push(e.message));await reduced.goto(url);await reduced.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});
 await reduced.locator('#explode-button').click();await reduced.waitForFunction(()=>window.modelSStudio.getState().amount===1);
 await reduced.waitForTimeout(100);assert.ok(await reduced.evaluate(()=>window.modelSStudio.getParts().every(p=>Math.hypot(...p.position.map((v,i)=>v-p.base[i]))>.01)));
 assert.deepEqual(errors,[]);console.log(`PASS: ${url} — 297 pieces, explosion, exact reassembly, isolated close-up, filters, search, paint, labels, playback, keyboard, mobile and reduced motion. Screenshots: ${shots}`);
}finally{await browser.close();}
