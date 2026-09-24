import {chromium} from 'playwright';import fs from 'node:fs';import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,channel:'chrome'});
try{
 const p=await b.newPage({viewport:{width:1440,height:1080}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto('http://127.0.0.1:5240/');await p.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});await p.evaluate(()=>window.reefQA.inspectAnemones());
 const samples=[];let frames=0;
 for(let i=0;i<80;i++){await p.waitForTimeout(300);const s=await p.evaluate(()=>window.reefQA.snapshot());samples.push({time:s.time,behavior:s.anemoneBehavior,clowns:s.positions.filter(f=>f.species==='clown')});if(s.anemoneBehavior.brushing>0&&frames<8){await p.screenshot({path:`reef/qa/clown-brush-motion-${frames++}.png`});}assert.equal(s.obstacleOverlaps+s.fishOverlaps,0);}
 assert.ok(samples.some(s=>s.behavior.brushing>0),'natural host visits make contact');assert.ok(samples.some(s=>s.behavior.maxBrush>.01),'visible contact displacement');
 await p.getByRole('button',{name:'Pause',exact:true}).click();const held=await p.evaluate(()=>window.reefQA.snapshot().anemoneBehavior);await p.waitForTimeout(500);assert.deepEqual(await p.evaluate(()=>window.reefQA.snapshot().anemoneBehavior),held);
 await p.evaluate(()=>window.reefQA.inspectSand());await p.waitForTimeout(500);await p.screenshot({path:'reef/qa/brush-banks-sand.png'});
 assert.deepEqual(errors,[]);fs.writeFileSync('reef/qa/clown-brush-rendered.json',JSON.stringify({samples,frames,errors},null,2));console.log({frames,contactSamples:samples.filter(s=>s.behavior.brushing>0).length,maxBrush:Math.max(...samples.map(s=>s.behavior.maxBrush)),errors});
}finally{await b.close();}
