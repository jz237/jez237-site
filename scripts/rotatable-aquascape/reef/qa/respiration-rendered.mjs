import {chromium} from 'playwright';
import {createServer} from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve('../..'),server=createServer(async(req,res)=>{try{let p=path.resolve(root,'.'+new URL(req.url,'http://x').pathname);if(!p.startsWith(root+path.sep))throw Error('Path');if((await fs.stat(p)).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'application/octet-stream');res.end(await fs.readFile(p));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));

import assert from 'node:assert/strict';import {PNG} from 'pngjs';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[],report=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1080}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(`http://127.0.0.1:${server.address().port}/demos/reef-aquarium/`);await page.waitForFunction(()=>window.reefQA?.snapshot().ready,null,{timeout:120000});await page.waitForTimeout(1500);
 await page.locator('#pause').click();await page.screenshot({path:'reef/qa/respiration-light-front.png'});
 await page.evaluate(()=>window.reefQA.inspectSand());await page.waitForTimeout(400);await page.screenshot({path:'reef/qa/respiration-light-sand.png'});
 for(const species of ['tang','yellow','clown','anthias','chromis','gramma']){
  await page.evaluate(s=>{window.reefQA.respirationStudy(s,-Math.PI/2,true);},species);await page.waitForTimeout(400);
  const a=await page.screenshot({path:`reef/qa/breathing-${species}-closed.png`});
  await page.evaluate(s=>window.reefQA.respirationStudy(s,Math.PI/2),species);await page.waitForTimeout(400);
  const b=await page.screenshot({path:`reef/qa/breathing-${species}-open.png`});
  const A=PNG.sync.read(a),B=PNG.sync.read(b);let changed=0,energy=0;
  for(let y=200;y<930;y++)for(let x=220;x<1220;x++){const i=(y*A.width+x)*4;const d=Math.abs(A.data[i]-B.data[i])+Math.abs(A.data[i+1]-B.data[i+1])+Math.abs(A.data[i+2]-B.data[i+2]);if(d>24){changed++;energy+=d;}}
  assert.ok(changed>100,species+' respiration must visibly change rendered anatomy, not just uniforms');report.push({species,changedPixels:changed,meanChange:energy/changed});
 }
 assert.deepEqual(errors,[]);await fs.writeFile('reef/qa/respiration-rendered-check.json',JSON.stringify({errors,report},null,2));console.log(report);
}finally{await browser.close();await new Promise(r=>server.close(r));}
