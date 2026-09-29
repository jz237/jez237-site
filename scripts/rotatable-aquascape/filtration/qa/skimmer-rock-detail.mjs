import {chromium} from 'playwright';
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../../filtration-dist'),out=path.resolve(import.meta.dirname,'../../.qa-results/skimmer-rock-detail');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{try{let file=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(5258,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1440,height:1080}}),report={checks:{},errors:[]};page.on('pageerror',e=>report.errors.push(e.message));
const snap=()=>page.evaluate(()=>window.filtrationQA.snapshot()),shot=name=>page.screenshot({path:path.join(out,name+'.png')});
try{
 await page.goto('http://127.0.0.1:5258/#skimmer');await page.waitForFunction(()=>window.filtrationQA?.snapshot().ready);await page.waitForTimeout(800);
 for(const system of ['skimmer','biology']){
  await page.locator(`[data-system="${system}"]`).click();await page.waitForFunction(()=>window.filtrationQA.snapshot().ready);await page.waitForTimeout(400);
  for(const view of ['front','top','perspective']){await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(300);await shot(system+'-'+view);}
  const rect=await page.locator('canvas').boundingBox();await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5);await page.mouse.wheel(0,-250);await page.waitForTimeout(500);await shot(system+'-close-up');
  if(system==='skimmer'){
   const frames=[];for(let i=0;i<4;i++){await shot('foam-motion-'+i);frames.push(await snap());await page.waitForTimeout(260);}assert.notDeepEqual(frames[0].bubble,frames[3].bubble);report.checks.animatedBubbleSequence=true;
   await page.locator('#pause').click();await page.waitForTimeout(1000);const a=await shot('foam-paused-0');await page.waitForTimeout(450);const b=await shot('foam-paused-1');assert.ok(a.equals(b));report.checks.visibleFoamFreezes=true;
  }
  await page.locator('#reset').click();await page.locator('#explode-button').click();await page.waitForFunction(()=>window.filtrationQA.snapshot().explode>.995);await shot(system+'-exploded');
  const ids=system==='skimmer'?['cup','needle-wheel','venturi','silencer','diffuser']:['rock-0','rock-1','rock-2'];
  for(const id of ids){await page.locator('#parts').selectOption(id);await page.locator('#isolate').click();await page.waitForTimeout(300);assert.equal((await snap()).selected,id);await shot('detail-'+id);await page.locator('#clear').click();}
 }
 report.checks.componentSelectionAndIsolation=true;
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mp=await mobile.newPage();mp.on('pageerror',e=>report.errors.push(e.message));await mp.goto('http://127.0.0.1:5258/#skimmer');await mp.waitForFunction(()=>window.filtrationQA?.snapshot().ready);assert.equal(await mp.evaluate(()=>window.filtrationQA.snapshot().paused),true);
 for(const system of ['skimmer','biology']){await mp.locator(`[data-system="${system}"]`).click();await mp.waitForFunction(()=>window.filtrationQA.snapshot().ready);await mp.screenshot({path:path.join(out,'phone-'+system+'.png')});await mp.locator('#explode-button').click();await mp.screenshot({path:path.join(out,'phone-'+system+'-exploded.png')});assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 report.checks.mobileAndReducedMotion=true;assert.deepEqual(report.errors,[]);report.checkedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server.close();}
