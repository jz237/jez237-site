import './identification.mjs';
import './cleaner-shrimp.mjs';
import './chemistry-lab.mjs';
import './tour-camera.mjs';
import './picking.mjs';
import './draw-order.mjs';
import './anemone-backdrop.mjs';
import './rock-ray-index.mjs';
import './rock-life-geometry.mjs';
import './rock-microcolonies.mjs';
import './flank-shelf-geometry.mjs';
import './anemone-geometry.mjs';
import './anemone-behavior.mjs';
import './anemone-brushing.mjs';
import './buttress-geometry.mjs';
import './fish-geometry.mjs';
import './fish-materials.mjs';
import './stable-fish-passes.mjs';
import './fish-navigation.mjs';
import './species-motion.mjs';
import './black-tang.mjs';
import './reef-options.mjs';
import './night-refuge.mjs';
import './fin-motion.mjs';
import './water-capture.mjs';
import './caustics.mjs';
import './polyp-geometry.mjs';
import './polyp-tissue-geometry.mjs';
import './rock-surface.mjs';
import './rock-geometry.mjs';
import './coral-geometry.mjs';
import './crust-geometry.mjs';
import './surface-colony.mjs';
import './encrusting-maps.mjs';
import './limestone-maps.mjs';
import './sand-relief.mjs';
import './foot-gardens.mjs';
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
 const page=await browser.newPage({viewport:{width:1440,height:1080},hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 const start=Date.now();await page.goto('http://127.0.0.1:5241/demos/reef-aquarium/');await page.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});report.readyMs=Date.now()-start;assert.doesNotMatch(await page.locator('body').innerText(),/[\u00c2\u00c3]/,'UI text must remain correctly encoded');
 await page.waitForTimeout(1500);const initial=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(initial.fish,20,'the gallery adds a black tang and a threadfin to the original 18');assert.equal(initial.positions.filter(p=>p.species==='auriga').length,1,'one threadfin by default');assert.ok(initial.rockLifeStats.patches>150);assert.ok(initial.rockLifeStats.pores>3000);assert.ok(initial.rockLifeStats.triangles<750000);assert.equal(initial.rockLifeStats.colors,7);assert.equal(initial.canopyStats.colonies,12);assert.ok(initial.canopyStats.triangles>200000&&initial.canopyStats.triangles<980000);assert.equal(initial.rearGlass.visible,true);assert.equal(initial.infillStats.colonies,11);assert.ok(initial.crustStats.understoryColonies>=20,'retain the new layer of smaller coral colonies');assert.ok(initial.crustStats.understoryTriangles<1210000,'merged detailed growth stays within its reviewed geometry budget');assert.ok(initial.infillStats.triangles<580000);assert.ok(initial.polypStats.polyps>500);assert.ok(initial.polypStats.maxAttachmentError<.00301);assert.ok(initial.crustStats.colonies>30&&initial.crustStats.colonies<=100,'exposed rock retains distributed encrusting coverage');assert.ok(initial.crustStats.triangles>1000&&initial.crustStats.triangles-initial.crustStats.mantleTriangles<70000);assert.equal(initial.anemoneTentacles,800);assert.equal(initial.obstacleOverlaps,0);assert.equal(initial.fishOverlaps,0);assert.equal(initial.anatomy.length,20);assert.ok(initial.anatomy.every(f=>f.model.startsWith('Blender')&&f.pectoral.length===2&&f.gills.length===2),'every inhabitant uses the articulated Blender model');
 assert.ok(initial.microLifeStats.cups>3000&&initial.microLifeStats.rocks>=45,'fine growth must cover the main islands and backing');assert.ok(initial.microLifeStats.triangles<230000,'tiny colonies remain within reviewed budget');
 assert.equal(initial.flankStats.colonies,12);assert.ok(initial.flankStats.triangles<95000);assert.ok(initial.flankStats.attachments.every(a=>Math.abs(a[4]-.016)<1e-7));
 assert.equal(initial.crustStats.mantleColonies,12,'retain the twelve reviewed exposed-face colonies');
 assert.ok(initial.crustStats.mantleTriangles>20000&&initial.crustStats.mantleTriangles<32000,'resolved mantle relief stays within its reviewed geometry allocation');
 assert.equal(initial.crustStats.emergentColonies,3,'all three branching growths stay attached to the selected living crusts');
 assert.ok(initial.crustStats.emergentTriangles>75000&&initial.crustStats.emergentTriangles<150000,'small emergent colonies preserve detailed anatomy within their reviewed budget');
 assert.equal(initial.footStats.rocks,10);assert.ok(initial.footStats.polyps>80);assert.ok(initial.footStats.maxAttachmentError<.00301);assert.equal(initial.buttressStats.rocks,9);assert.equal(initial.buttressStats.colonies,4);assert.ok(initial.buttressStats.polyps>80);assert.ok(initial.buttressStats.maxAttachmentError<.00301);
 const shadowSequence=await page.evaluate(async()=>{const frames=[];for(let i=0;i<60;i++){await new Promise(requestAnimationFrame);frames.push(window.reefQA.snapshot().shadows);}return frames;});
 assert.ok(shadowSequence.every((s,i)=>!i||s.updates>shadowSequence[i-1].updates),'fish shadow matrices update every rendered animation frame');
 assert.ok(shadowSequence.filter((s,i)=>i&&JSON.stringify(s.centers)!==JSON.stringify(shadowSequence[i-1].centers)).length>50,'moving penumbras must not hold for30frames');
 report.shadowFrames=shadowSequence.length;
 await page.screenshot({path:resolve(out,'front.png')});await page.getByRole('button',{name:'Feed fish',exact:true}).click();
 report.samples=[];
 for(let i=0;i<7;i++){await page.waitForTimeout(4000);const s=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(s.obstacleOverlaps,0,'fish overlaps an obstacle');assert.equal(s.fishOverlaps,0,'fish overlap one another');report.samples.push({fps:s.fps,time:s.time,bites:s.bites,remaining:s.food,anemones:s.anemoneBehavior});}
 assert.doesNotMatch(await page.locator('#status').innerText(),/[\u00c2\u00c3]/,'status text must remain correctly encoded');
 const fed=await page.evaluate(()=>window.reefQA.snapshot());assert.ok(fed.anatomy.every((f,i)=>f.phase!==initial.anatomy[i].phase),'independent body waves advance');assert.notDeepEqual(fed.anatomy.map(f=>[f.pectoral,f.gills,f.mouth]),initial.anatomy.map(f=>[f.pectoral,f.gills,f.mouth]),'fins and breathing must move');assert.ok(fed.anatomy.every(f=>f.pectoral[0][1]*f.pectoral[1][1]<0),'paired pectorals sweep outward on opposite flanks');assert.ok(fed.anatomy.every(f=>Number.isFinite(f.mouthOpening)&&f.mouthOpening>0),'mesh lip breathing uniform advances');assert.notDeepEqual(fed.anatomy.map(f=>f.mouthOpening),initial.anatomy.map(f=>f.mouthOpening));assert.ok(fed.bites>=12,'fish must physically reach and consume food');assert.ok(fed.positions.some((p,i)=>Math.hypot(p.x-initial.positions[i].x,p.y-initial.positions[i].y,p.z-initial.positions[i].z)>.5),'inhabitants explore rather than staying stuck');
 await page.getByRole('button',{name:'Pause',exact:true}).click();const before=await page.evaluate(()=>window.reefQA.snapshot());await page.waitForTimeout(500);const after=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(before.time,after.time);assert.deepEqual(before.shadows,after.shadows,'soft fish shadows freeze with fish');assert.deepEqual(before.positions,after.positions);assert.deepEqual(before.anemoneBehavior,after.anemoneBehavior,'contact feeding freezes with the tank');assert.deepEqual(before.anatomy,after.anatomy);assert.equal(before.optics.time,after.optics.time,'caustics freeze with inhabitants');
 await page.getByRole('button',{name:'Three-quarter',exact:true}).click();await page.waitForTimeout(1800);await page.screenshot({path:resolve(out,'angle.png')});
 await page.getByRole('button',{name:'Blue hour',exact:true}).click();assert.equal(await page.locator('#light').getAttribute('aria-pressed'),'true');await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'blue-hour.png')});assert.ok((await page.evaluate(()=>window.reefQA.snapshot())).optics.daylight<.35,'caustics soften in blue hour');await page.getByRole('button',{name:'Daylight',exact:true}).click();
 await page.getByRole('button',{name:'Side',exact:true}).click();await page.waitForTimeout(1500);await page.screenshot({path:resolve(out,'side.png')});
 await page.getByRole('button',{name:'Full screen',exact:true}).click();assert.equal(await page.locator('#fullscreen').getAttribute('aria-pressed'),'true');await page.getByRole('button',{name:'Exit full screen',exact:true}).click();
 await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 const canvas=await page.locator('canvas').boundingBox();await page.mouse.click(canvas.x+canvas.width*.29,canvas.y+canvas.height*.64);assert.ok(await page.locator('#detail').isVisible(),'rock identification should open');await page.getByRole('button',{name:'Close detail',exact:true}).click();
 // Real pointer events must identify substrate, water/glass and trim, and never fire after an orbit drag.
 report.identification=[];
 for(const [x,y,pattern] of [[.50,.87,/sand|rubble/i],[.50,.18,/water|glass/i],[.50,.947,/base|trim/i]]){
  const started=Date.now();await page.mouse.click(canvas.x+canvas.width*x,canvas.y+canvas.height*y);
  const title=await page.locator('#detail h2').innerText();assert.match(title,pattern);report.identification.push({title,ms:Date.now()-started});
  await page.keyboard.press('Escape');assert.ok(await page.locator('#detail').isHidden());
 }
 await page.mouse.move(canvas.x+canvas.width*.5,canvas.y+canvas.height*.5);await page.mouse.down();await page.mouse.move(canvas.x+canvas.width*.55,canvas.y+canvas.height*.5,{steps:5});await page.mouse.move(canvas.x+canvas.width*.5,canvas.y+canvas.height*.5,{steps:5});await page.mouse.up();assert.ok(await page.locator('#detail').isHidden(),'out-and-back orbit drag must not select');

 await page.evaluate(()=>window.reefQA.inspectWater());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'water-above.png')});
 await page.evaluate(()=>window.reefQA.inspectRear());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'rear-closeup.png')});
 await page.evaluate(()=>window.reefQA.inspectSand());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'sand-closeup.png')});
 await page.evaluate(()=>window.reefQA.inspectOutcrops());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'outcrop-closeup.png')});
 await page.evaluate(()=>window.reefQA.inspectPolyps());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'polyp-closeup.png')});
 await page.getByRole('button',{name:'Resume',exact:true}).click();
 for(let i=0;i<4;i++){await page.waitForTimeout(650);await page.screenshot({path:resolve(out,`polyp-motion-${i}.png`)});}
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.evaluate(()=>window.reefQA.inspectFlanks());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'flank-closeup.png')});
 await page.evaluate(()=>window.reefQA.inspectCorals());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'coral-closeup.png')});await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 for(const species of ['clown','tang','rostratum','semilarvatus','anthias','chromis','gramma','goby']){await page.evaluate(s=>window.reefQA.inspectFish(s),species);await page.waitForTimeout(350);await page.screenshot({path:resolve(out,`fish-${species}.png`)});}
 await page.evaluate(()=>window.reefQA.inspectAnemones());await page.waitForTimeout(600);await page.screenshot({path:resolve(out,'anemone-closeup.png')});await page.getByRole('button',{name:'Resume',exact:true}).click();await page.waitForTimeout(800);await page.screenshot({path:resolve(out,'anemone-motion-a.png')});await page.waitForTimeout(1000);await page.screenshot({path:resolve(out,'anemone-motion-b.png')});await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1800);
 // Gallery stocking: real clicks add and remove animals, update every count
 // and keep the tank free of overlaps; the original stocking can be restored.
 await page.getByRole('button',{name:/Add & remove fish/}).click();assert.ok(await page.locator('#reef-learning').isVisible());
 const stockCount=id=>page.locator(`[data-stock-add="${id}"]`).locator('xpath=preceding-sibling::output').innerText().then(Number);
 assert.equal(await stockCount('rostratum'),1);
 await page.getByRole('button',{name:'Add a black tang'}).click();assert.equal(await stockCount('rostratum'),2);assert.match(await page.locator('.reef-stock-total').innerText(),/black tang/i);
 await page.getByRole('button',{name:'Add a chromis'}).or(page.getByRole('button',{name:'Add a blue-green chromis'})).click();
 let stocked=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(stocked.fish,22);assert.equal(stocked.obstacleOverlaps,0);assert.equal(stocked.fishOverlaps,0);assert.equal(stocked.shadows.centers.length,22,'added fish cast penumbras');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.waitForTimeout(2500);await page.getByRole('button',{name:'Pause',exact:true}).click();
 stocked=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(stocked.obstacleOverlaps,0);assert.equal(stocked.fishOverlaps,0);
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Remove a black tang'}).click();
 assert.equal(await stockCount('rostratum'),0);assert.ok(await page.getByRole('button',{name:'Remove a black tang'}).isDisabled());
 await page.getByRole('button',{name:'Explore & identify'}).click();assert.equal(await page.locator('#reef-subject option[value="rostratum"]').count(),0,'absent species leave the close-up list');
 // Gallery options start empty except the default threadfin; the first add
 // downloads that model only.
 await page.getByRole('button',{name:/Add & remove fish/}).click();
 const options=[['strigosus','kole tang'],['vulpinus','foxface rabbitfish'],['bispinosa','coral beauty angelfish'],['loricula','flame angelfish'],['hexataenia','six-line wrasse'],['cinctus','yellow watchman goby']];
 for(const [id] of options)assert.equal(await stockCount(id),0,`${id} is not stocked by default`);
 assert.equal(await stockCount('auriga'),1,'one threadfin by default');
 for(const [id,name] of options){
  const download=page.waitForResponse(r=>r.url().includes(`/${id}-`)&&r.url().endsWith('.glb'));
  await page.getByRole('button',{name:`Add a ${name}`}).click();assert.equal((await download).status(),200,`${id} model downloads on first use`);
  await page.locator('.reef-stock-total').filter({hasText:/Added a|Look for/}).waitFor({timeout:30000});assert.equal(await stockCount(id),1,`${id} added`);
 }
 // Its model loaded with the tank, so a second threadfin needs no download.
 await page.getByRole('button',{name:'Add a threadfin butterflyfish'}).click();
 await page.locator('.reef-stock-total').filter({hasText:/Added a threadfin|Look for/}).waitFor({timeout:30000});assert.equal(await stockCount('auriga'),2,'second threadfin added');
 report.options=await page.evaluate(()=>window.reefQA.snapshot().positions.filter(p=>['strigosus','vulpinus','bispinosa','loricula','hexataenia','cinctus','auriga'].includes(p.species)).map(p=>p.species+':'+p.mode));
 await page.getByRole('button',{name:'Close reef guide'}).click();await page.getByRole('button',{name:'Resume',exact:true}).click();await page.waitForTimeout(12000);await page.getByRole('button',{name:'Pause',exact:true}).click();
 stocked=await page.evaluate(()=>window.reefQA.snapshot());assert.equal(stocked.fish,27,"20 original, an extra chromis, both black tangs removed, six options and a second threadfin added");assert.equal(stocked.obstacleOverlaps,0,'options stay clear of the reef');assert.equal(stocked.fishOverlaps,0,'options stay clear of other fish');
 await page.screenshot({path:resolve(out,'options-tank.png')});
 for(const [id] of options){await page.evaluate(s=>window.reefQA.inspectFish(s),id);await page.waitForTimeout(400);await page.screenshot({path:resolve(out,`fish-${id}.png`)});}
 await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForTimeout(1500);
 await page.getByRole('button',{name:/Add & remove fish/}).click();await page.getByRole('button',{name:'Restore the original stocking'}).click();
 await page.locator('.reef-stock-total').filter({hasText:/restored/}).waitFor({timeout:30000});
 assert.equal((await page.evaluate(()=>window.reefQA.snapshot())).fish,20);assert.equal(await stockCount('rostratum'),1);assert.equal(await stockCount('auriga'),1);for(const [id] of options)assert.equal(await stockCount(id),0,`${id} removed by restore`);await page.screenshot({path:resolve(out,'stocking.png')});
 await page.getByRole('button',{name:'Close reef guide'}).click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:resolve(out,'mobile.png')});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
 const mobileCanvas=await page.locator('canvas').boundingBox();assert.ok(mobileCanvas.width<=390&&mobileCanvas.x>=0,'canvas must fit the phone width');
 await page.touchscreen.tap(mobileCanvas.x+mobileCanvas.width*.5,mobileCanvas.y+mobileCanvas.height*.7);
 assert.ok(await page.locator('#detail').isVisible(),'touch opens a field note');await page.screenshot({path:resolve(out,'mobile-identification.png')});await page.getByRole('button',{name:'Close detail',exact:true}).click();
 const mobileControl=await page.locator('#feed').boundingBox();assert.ok(mobileControl.x>=0&&mobileControl.x+mobileControl.width<=390&&mobileControl.y+mobileControl.height<844,'feeding remains visible on phone');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.waitForTimeout(500);assert.ok((await page.evaluate(()=>window.reefQA.snapshot())).time>after.time);
 // Actual reloads must seed different fish positions rather than repeat a film.
 await page.reload();await page.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});const fresh=await page.evaluate(()=>window.reefQA.snapshot());assert.notDeepEqual(fresh.positions,initial.positions);assert.equal(fresh.obstacleOverlaps,0);assert.equal(fresh.fishOverlaps,0);
 assert.deepEqual(errors,[]);report.checks={loading:true,feeding:true,spacing:true,obstacles:true,pause:true,camera:true,lighting:true,fullscreen:true,identification:true,mobile:true,randomized:true};
 report.initial={anemoneBackdropStats:initial.anemoneBackdropStats,rockLifeStats:initial.rockLifeStats,footStats:initial.footStats,canopyStats:initial.canopyStats,triangles:initial.triangles,inhabitants:initial.fish,buttressStats:initial.buttressStats,polypStats:initial.polypStats,rockStats:initial.rockStats,crustStats:initial.crustStats,infillStats:initial.infillStats,flankStats:initial.flankStats};
 // Hidden Reef runs the same stocking (approved October 19): the black tang and the stocking panel.
 const store=await browser.newPage({viewport:{width:1280,height:900}});await store.goto('http://127.0.0.1:5241/demos/reef-aquarium/?showroom=hidden-reef');await store.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});
 const storeTank=await store.evaluate(()=>window.reefQA.snapshot());assert.equal(storeTank.fish,20);assert.ok(storeTank.positions.some(p=>p.species==='rostratum'));assert.ok(storeTank.positions.some(p=>p.species==='auriga'));assert.equal(await store.locator('[data-reef-tool="stock"]').count(),1,'stocking controls in the storefront');await store.close();
 // Planted navigation mounts independently of the shared freshwater renderer.
 await page.goto('http://127.0.0.1:5241/demos/rotatable-aquascape/');await page.locator('.reef-preview-link').waitFor({timeout:60000});assert.equal(await page.locator('.reef-preview-link').count(),1);assert.equal(await page.locator('.reef-preview-link').getAttribute('href'),'../reef-aquarium/');const reefLink=await page.locator('.reef-preview-link').boundingBox();assert.ok(reefLink.x>=0&&reefLink.x+reefLink.width<=390,'reef selector fits the phone');
 console.log(JSON.stringify(report,null,2));writeFileSync(resolve(out,'results.json'),JSON.stringify(report,null,2)+'\n');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
