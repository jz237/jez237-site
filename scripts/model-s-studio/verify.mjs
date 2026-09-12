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
 assert.equal((await read()).pieces,308);assert.equal((await read()).visible,308);assert.equal((await read()).paint,'#aeb7c2');
 const battery=await page.evaluate(()=>modelSStudio.getParts().filter(p=>p.group==='Battery'));assert.equal(battery.length,11);assert.ok(battery.every(p=>p.schematic));
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
 assert.equal((await read()).visible,308);
 await page.locator('#system').selectOption('Wheels');assert.ok((await read()).visible>0);assert.ok((await read()).visible<308);
 await page.locator('#system').selectOption('all');await page.locator('#search').fill('touchscreen');
 const matches=await page.locator('#part-list option').allTextContents();assert.ok(matches.length>1&&matches.length<10);assert.ok(matches.slice(1).every(label=>label.toLowerCase().includes('touchscreen')));
 await page.locator('#search').fill('no-such-component');assert.equal(await page.locator('#part-list option').count(),1);
 await page.locator('#reset').click();await page.locator('#cabin').click();assert.equal((await read()).visible,272);
 await page.locator('[aria-label="Pearl white"]').click();assert.equal(await page.locator('#paint-name').textContent(),'Pearl white');
 await page.locator('#label-toggle').click();await page.waitForTimeout(100);assert.equal(await page.locator('#label-toggle').getAttribute('aria-pressed'),'true');
 await page.locator('#reset').click();await page.locator('#animate').click();await page.waitForTimeout(2500);assert.ok((await read()).target>.1);await page.locator('#animate').click();
 await page.locator('#reset').click();await page.locator('#viewport').focus();await page.keyboard.press('e');await settled(1);await page.keyboard.press('r');await settled(0);
 // All 308 geometry bounds must fit simultaneously without overlap, including after resize.
 await page.locator('#all-parts').click();assert.equal((await read()).board,true);
 const checkBoard=async count=>{
  await page.waitForTimeout(150);const frame=await page.locator('#viewport').boundingBox(),height=await page.evaluate(()=>innerHeight);assert.ok(frame.y>=0&&frame.y+frame.height<=height+1,'Entire parts canvas must fit the browser window');const rects=await page.evaluate(()=>modelSStudio.getBoardRectangles());assert.equal(rects.length,count);
  for(const r of rects){assert.ok(r.min.every(v=>v>=-1)&&r.max.every(v=>v<=1),`Part ${r.id} outside frame`);assert.ok(r.max[0]>r.min[0]&&r.max[1]>r.min[1]);}
  for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];assert.ok(a.max[0]<=b.min[0]||b.max[0]<=a.min[0]||a.max[1]<=b.min[1]||b.max[1]<=a.min[1],`Parts ${a.id}, ${b.id} overlap`);}
 };
 await checkBoard(308);await page.screenshot({path:path.join(shots,'all-parts.png')});
 // A whole tile is a click target, including delicate or hollow components.
 const first=await page.evaluate(()=>modelSStudio.getBoardRectangles()[0]);const viewport=await page.locator('#viewport').boundingBox();
 await page.mouse.click(viewport.x+(first.min[0]+first.max[0]+2)/4*viewport.width,viewport.y+(2-first.min[1]-first.max[1])/4*viewport.height);assert.ok((await read()).selected);
 await page.locator('#isolate').click();await checkBoard(1);assert.equal((await read()).board,true);
 await page.locator('#clear').click();await checkBoard(308);
 await page.locator('#system').selectOption('Battery');await checkBoard(11);
 await page.locator('#system').selectOption('all');await checkBoard(308);
 await page.locator('#viewport').hover();await page.mouse.wheel(0,-500);await page.waitForTimeout(200);await page.locator('#fit-parts').click();await checkBoard(308);
 for(const size of [{width:390,height:844},{width:768,height:1024},{width:900,height:500}]){await page.setViewportSize(size);await page.waitForTimeout(250);await checkBoard(308);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1100);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No mobile horizontal overflow');
 await page.screenshot({path:path.join(shots,'mobile.png'),fullPage:true});
 await page.locator('#battery-view').click();await settled(1);await page.waitForTimeout(1300);assert.equal((await read()).visible,11);assert.equal((await read()).system,'Battery');
 await page.screenshot({path:path.join(shots,'battery-mobile.png'),fullPage:true});
 await page.goto(new URL('manual.html',url).href);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.locator('a[href*="tesla.com/ownersmanual"]').count()>5);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(shots,'manual-mobile.png'),fullPage:true});
 await page.goto(new URL('?view=parts',url).href);await page.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});assert.equal((await read()).board,true);await checkBoard(308);
 // Reduced-motion changes must still transform the geometry, without easing.
 const reduced=await browser.newPage({viewport:{width:1024,height:900},reducedMotion:'reduce'});reduced.on('pageerror',e=>errors.push(e.message));await reduced.goto(url);await reduced.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});
 await reduced.locator('#explode-button').click();await reduced.waitForFunction(()=>window.modelSStudio.getState().amount===1);
 await reduced.waitForTimeout(100);assert.ok(await reduced.evaluate(()=>window.modelSStudio.getParts().every(p=>Math.hypot(...p.position.map((v,i)=>v-p.base[i]))>.01)));
 assert.deepEqual(errors,[]);console.log(`PASS: ${url} — 308 pieces, 11 schematic battery components, non-overlapping all-parts board at four viewport sizes, tile picking, board isolation, fit, manual and deep links, explosion, exact reassembly, isolated close-up, filters, search, paint, labels, playback, keyboard, mobile and reduced motion. Screenshots: ${shots}`);
}finally{await browser.close();}
