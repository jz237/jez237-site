import {chromium} from 'playwright';
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../../filtration-dist'),out=path.resolve(import.meta.dirname,'../../.qa-results/filtration');fs.mkdirSync(out,{recursive:true});
const remote=process.env.FILTRATION_TEST_BASE;let server;
if(!remote){server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),file=path.join(root,decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html');if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(5247,'127.0.0.1',r));}
const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:1440,height:1120},deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack);});
const snap=()=>page.evaluate(()=>window.filtrationQA.snapshot()),shot=n=>page.screenshot({path:path.join(out,n+'.png'),fullPage:false});let report={checks:{},views:[],errors};
try{
 await page.goto(remote||'http://127.0.0.1:5247/');await page.waitForFunction(()=>window.filtrationQA?.snapshot().ready);await page.waitForTimeout(500);await shot('desktop-system');
 assert.equal((await snap()).parts,42);report.checks.completeParts=true;
 for(const system of ['system','roller','skimmer','biology','return']){
  await page.locator(`[data-system="${system}"]`).click();await page.waitForTimeout(250);await shot(system+'-assembled');
  await page.locator('#explode-button').click();await page.waitForFunction(()=>window.filtrationQA.snapshot().explode>.995);await shot(system+'-exploded');
  const a=await snap();report.views.push({system,parts:await page.locator('#parts option').count()-1,triangles:a.triangles,calls:a.calls});
  await page.locator('#labels-toggle').click();await shot(system+'-labels');await page.locator('#labels-toggle').click();
  await page.locator('#parts').selectOption({index:2});assert.ok((await snap()).selected);await page.locator('#isolate').click();assert.equal((await snap()).isolate,true);await shot(system+'-isolate');await page.locator('#clear').click();assert.equal((await snap()).selected,null);
 }
 report.checks.allAssembliesExplodeInspectIsolate=true;
 await page.locator('[data-system="roller"]').click();let a=await snap();await page.waitForTimeout(500);assert.equal((await snap()).rollerAngle,a.rollerAngle);
 await page.locator('#experiment').click();for(const [delay,label] of [[300,'start'],[3300,'rising'],[1700,'advancing'],[1700,'clear']]){await page.waitForTimeout(delay);await shot('roller-cycle-'+label);}
 a=await snap();assert.ok(a.rollerAngle<-.5);assert.ok(a.experimentTime>6);await page.waitForTimeout(400);assert.equal((await snap()).rollerAngle,a.rollerAngle);report.checks.sensorTriggeredAdvanceThenStop=true;
 await page.locator('[data-system="skimmer"]').click();const b=await snap();await page.waitForTimeout(500);assert.notDeepEqual((await snap()).bubble,b.bubble);for(let i=0;i<4;i++){await page.waitForTimeout(200);await shot('skimmer-motion-'+i);}report.checks.bubbleMotion=true;
 await page.locator('#pause').click();a=await snap();await page.waitForTimeout(400);assert.equal((await snap()).time,a.time);assert.equal((await snap()).rotorAngle,a.rotorAngle);report.checks.pause=true;
 await page.locator('#flow').click();assert.equal((await snap()).flow,false);await page.locator('#flow').click();
 await page.locator('#parts').selectOption('cup');await page.locator('#isolate').click();const pos=await page.evaluate(()=>window.filtrationQA.project('cup'));await page.mouse.click(pos.x,pos.y);assert.equal((await snap()).selected,'cup');report.checks.pointerSelection=true;
 await page.locator('#reset').click();await page.locator('#sequence').click();await page.waitForTimeout(900);assert.ok((await snap()).explode>.7);await page.locator('#sequence').click();report.checks.assemblySequence=true;
 for(const v of ['front','top','perspective']){await page.locator(`[data-view="${v}"]`).click();await shot('skimmer-'+v);}
 const canvas=page.locator('canvas'),rect=await canvas.boundingBox();await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.6,rect.y+rect.height*.55,{steps:10});await page.mouse.up();await page.mouse.wheel(0,-100);await shot('orbit-close');
 await page.locator('#reset').click();assert.equal((await snap()).explode,0);assert.equal((await snap()).selected,null);report.checks.reset=true;
 await page.locator('#pause').click();await page.waitForTimeout(1500);a=await snap();await page.waitForTimeout(600);report.idleFrames=(await snap()).frames-a.frames;assert.ok(report.idleFrames<3,'paused scene stops rendering after damping settles');report.checks.pausedIdle=true;
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto(remote||'http://127.0.0.1:5247/');await mp.waitForFunction(()=>window.filtrationQA?.snapshot().ready);assert.equal(await mp.evaluate(()=>window.filtrationQA.snapshot().paused),true);
 await mp.screenshot({path:path.join(out,'mobile-system.png')});await mp.locator('[data-system="skimmer"]').click();await mp.locator('#explode-button').click();assert.equal(await mp.evaluate(()=>window.filtrationQA.snapshot().explode),1);await mp.screenshot({path:path.join(out,'mobile-skimmer-exploded.png')});await mp.locator('#parts').selectOption('diffuser');await mp.locator('#isolate').click();await mp.screenshot({path:path.join(out,'mobile-controls.png')});assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.checks.mobileReducedMotion=true;
 assert.deepEqual(errors,[]);report.checks.noRuntimeErrors=true;
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({...report,checkedAt:new Date().toISOString()},null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server?.close();}
