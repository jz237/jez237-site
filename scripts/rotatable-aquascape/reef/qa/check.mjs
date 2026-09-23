import './anemone-geometry.mjs';
import './fish-geometry.mjs';
import './polyp-geometry.mjs';
import './rock-surface.mjs';
import './coral-geometry.mjs';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {writeFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'../../../..'),out=import.meta.dirname;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!p.startsWith(root+sep))throw Error('Path');if((await stat(p)).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(5241,'127.0.0.1',r));let browser;const report={};
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 const start=Date.now();await page.goto('http://127.0.0.1:5241/demos/reef-aquarium/');await page.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});report.readyMs=Date.now()-start;
 await page.waitForTimeout(1500);const initial=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(initial.fish,20);assert.ok(initial.polypStats.polyps>500);assert.ok(initial.polypStats.maxAttachmentError<.00301);assert.equal(initial.anemoneTentacles,540);assert.equal(initial.obstacleOverlaps,0);assert.equal(initial.fishOverlaps,0);assert.equal(initial.anatomy.length,20);assert.ok(initial.anatomy.every(f=>f.model.startsWith('Blender')&&f.pectoral.length===2&&f.gills.length===2),'every inhabitant uses the articulated Blender model');
 await page.screenshot({path:resolve(out,'front.png')});await page.getByRole('button',{name:'Feed fish',exact:true}).click();
 report.samples=[];
 for(let i=0;i<7;i++){await page.waitForTimeout(4000);const s=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(s.obstacleOverlaps,0,'fish overlaps an obstacle');assert.equal(s.fishOverlaps,0,'fish overlap one another');report.samples.push({fps:s.fps,time:s.time,bites:s.bites,remaining:s.food});}
 const fed=await page.evaluate(()=>window.reefQA.snapshot());assert.ok(fed.anatomy.every((f,i)=>f.phase!==initial.anatomy[i].phase),'independent body waves advance');assert.notDeepEqual(fed.anatomy.map(f=>[f.pectoral,f.gills,f.mouth]),initial.anatomy.map(f=>[f.pectoral,f.gills,f.mouth]),'fins and breathing must move');assert.ok(fed.bites>=12,'fish must physically reach and consume food');assert.ok(fed.positions.some((p,i)=>Math.hypot(p.x-initial.positions[i].x,p.y-initial.positions[i].y,p.z-initial.positions[i].z)>.5),'inhabitants explore rather than staying stuck');
 await page.getByRole('button',{name:'Pause',exact:true}).click();const before=await page.evaluate(()=>window.reefQA.snapshot());await page.waitForTimeout(500);const after=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(before.time,after.time);assert.deepEqual(before.positions,after.positions);assert.deepEqual(before.anatomy,after.anatomy);
 await page.getByRole('button',{name:'Three-quarter',exact:true}).click();await page.waitForTimeout(1800);await page.screenshot({path:resolve(out,'angle.png')});
 await page.getByRole('button',{name:'Blue hour',exact:true}).click();assert.equal(await page.locator('#light').getAttribute('aria-pressed'),'true');await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'blue-hour.png')});await page.getByRole('button',{name:'Daylight',exact:true}).click();
 await page.getByRole('button',{name:'Side',exact:true}).click();await page.waitForTimeout(1500);await page.screenshot({path:resolve(out,'side.png')});
 await page.getByRole('button',{name:'Full screen',exact:true}).click();assert.equal(await page.locator('#fullscreen').getAttribute('aria-pressed'),'true');await page.getByRole('button',{name:'Exit full screen',exact:true}).click();
 await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 const canvas=await page.locator('canvas').boundingBox();await page.mouse.click(canvas.x+canvas.width*.29,canvas.y+canvas.height*.64);assert.ok(await page.locator('#detail').isVisible(),'rock identification should open');await page.getByRole('button',{name:'Close detail',exact:true}).click();
 await page.evaluate(()=>window.reefQA.inspectPolyps());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'polyp-closeup.png')});
 await page.evaluate(()=>window.reefQA.inspectCorals());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'coral-closeup.png')});await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 for(const species of ['clown','tang','yellow','anthias','chromis','gramma']){await page.evaluate(s=>window.reefQA.inspectFish(s),species);await page.waitForTimeout(350);await page.screenshot({path:resolve(out,`fish-${species}.png`)});}
 await page.evaluate(()=>window.reefQA.inspectAnemones());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'anemone-closeup.png')});await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:resolve(out,'mobile.png')});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
 const mobileCanvas=await page.locator('canvas').boundingBox();assert.ok(mobileCanvas.width<=390&&mobileCanvas.x>=0,'canvas must fit the phone width');
 const mobileControl=await page.locator('#feed').boundingBox();assert.ok(mobileControl.x>=0&&mobileControl.x+mobileControl.width<=390&&mobileControl.y+mobileControl.height<844,'feeding remains visible on phone');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.waitForTimeout(500);assert.ok((await page.evaluate(()=>window.reefQA.snapshot())).time>after.time);
 // Actual reloads must seed different fish positions rather than repeat a film.
 await page.reload();await page.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});const fresh=await page.evaluate(()=>window.reefQA.snapshot());assert.notDeepEqual(fresh.positions,initial.positions);assert.equal(fresh.obstacleOverlaps,0);assert.equal(fresh.fishOverlaps,0);
 assert.deepEqual(errors,[]);report.checks={loading:true,feeding:true,spacing:true,obstacles:true,pause:true,camera:true,lighting:true,fullscreen:true,identification:true,mobile:true,randomized:true};
 report.initial={triangles:initial.triangles,inhabitants:initial.fish,polypStats:initial.polypStats};
 // Planted navigation mounts independently of the shared freshwater renderer.
 await page.goto('http://127.0.0.1:5241/demos/rotatable-aquascape/');await page.locator('.reef-preview-link').waitFor({timeout:60000});assert.equal(await page.locator('.reef-preview-link').count(),1);assert.equal(await page.locator('.reef-preview-link').getAttribute('href'),'../reef-aquarium/');const reefLink=await page.locator('.reef-preview-link').boundingBox();assert.ok(reefLink.x>=0&&reefLink.x+reefLink.width<=390,'reef selector fits the phone');
 console.log(JSON.stringify(report,null,2));writeFileSync(resolve(out,'results.json'),JSON.stringify(report,null,2)+'\n');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
