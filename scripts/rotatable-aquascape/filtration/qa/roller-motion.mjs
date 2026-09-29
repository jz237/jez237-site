import {chromium} from 'playwright';
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../../filtration-dist'),out=path.resolve(import.meta.dirname,'../../.qa-results/roller-motion');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{try{let file=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(5257,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[],report={checks:{},frames:[],errors};page.on('pageerror',e=>errors.push(e.message));
const snap=()=>page.evaluate(()=>window.filtrationQA.snapshot()),shot=name=>page.screenshot({path:path.join(out,name+'.png')});
try{
 await page.goto('http://127.0.0.1:5257/#roller');await page.waitForFunction(()=>window.filtrationQA?.snapshot().ready);await page.waitForTimeout(800);
 const resting=await snap();await page.waitForTimeout(600);assert.equal((await snap()).rollerAngle,resting.rollerAngle);await shot('normal');
 for(const view of ['front','top','perspective']){await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(350);await shot(view);}
 const rect=await page.locator('canvas').boundingBox();await page.mouse.move(rect.x+rect.width*.55,rect.y+rect.height*.45);await page.mouse.wheel(0,-240);await page.waitForTimeout(600);await shot('close-up');await page.locator('#reset').click();
 await page.locator('#experiment').click();await page.waitForFunction(()=>window.filtrationQA.snapshot().experimentTime>2.5);await shot('water-rising');
 await page.waitForFunction(()=>window.filtrationQA.snapshot().experimentTime>4.2);
 for(let i=0;i<4;i++){const s=await snap();report.frames.push({time:s.experimentTime,angle:s.rollerAngle});await shot('advance-'+i);await page.waitForTimeout(230);}
 assert.ok(report.frames.every((s,i)=>i===0||s.angle>report.frames[i-1].angle));
 await page.waitForFunction(()=>window.filtrationQA.snapshot().experimentTime>6.3);const stopped=await snap();await page.waitForTimeout(600);assert.equal((await snap()).rollerAngle,stopped.rollerAngle);await shot('cycle-stopped');report.checks.sensorCycleAdvancesUpTakeupThenStops=true;
 await page.locator('#clear').click();await page.locator('#pause').click();await page.waitForTimeout(1100);const a=await shot('paused-0');await page.waitForTimeout(500);const b=await shot('paused-1');assert.ok(a.equals(b));report.checks.allVisibleMotionFreezes=true;
 await page.locator('#explode-button').click();await page.waitForFunction(()=>window.filtrationQA.snapshot().explode>.995);await shot('exploded');
 for(const id of ['clean-roll','roller-motor','sensor','roller-inlet']){await page.locator('#parts').selectOption(id);await page.locator('#isolate').click();await page.waitForTimeout(350);await shot('detail-'+id);await page.locator('#clear').click();}report.checks.detailPartsStaySelectable=true;
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto('http://127.0.0.1:5257/#roller');await mp.waitForFunction(()=>window.filtrationQA?.snapshot().ready);await mp.screenshot({path:path.join(out,'phone-assembled.png')});assert.equal(await mp.evaluate(()=>window.filtrationQA.snapshot().paused),true);await mp.locator('#explode-button').click();await mp.screenshot({path:path.join(out,'phone-exploded.png')});assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.checks.mobileAndReducedMotion=true;
 assert.deepEqual(errors,[]);report.checkedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server.close();}
