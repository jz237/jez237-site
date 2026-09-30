import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(import.meta.dirname,'..'),out=resolve(root,'.qa-results/startup-live');mkdirSync(out,{recursive:true});
const targets=process.argv[2]?[{name:'preview',home:process.argv[2]+'/',paths:['showroom/aquarium/','showroom/reef/']}]:[
 {name:'hidden-reef',home:'https://hidden-reef.pages.dev/',paths:['showroom/aquarium/','showroom/reef/']},
 {name:'jez237',home:'https://jez237.com/prototypes/hidden-reef/',paths:['https://jez237.com/demos/rotatable-aquascape/','https://jez237.com/demos/reef-aquarium/']}
];
const browser=await chromium.launch({channel:'chrome',headless:true}),report=[];
try{
 for(const target of targets){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(target.home+'?verify-startup='+Date.now());await page.locator('.main-nav__actions').waitFor();assert.equal(await page.locator('.showroom-nav,.showroom-mobile-entry').count(),0);
  await page.screenshot({path:resolve(out,target.name+'-header.png')});
  for(const [i,path] of target.paths.entries()){
   const kind=i?'reef':'freshwater',base=new URL(path,target.home).href,local=resolve(root,i?'reef-dist':'dist'),html=readFileSync(resolve(local,'index.html'),'utf8');
   const response=await page.goto(base+'?showroom=hidden-reef&verify-startup='+Date.now()),live=await response.text();
   const assets=[...html.matchAll(/(?:src|href)="\.\/(assets\/[^\"]+\.(?:js|css))"/g)].map(m=>m[1]);
   for(const asset of assets){assert.ok(live.includes(asset),'active bundle '+asset);const response=await fetch(new URL(asset,base));assert.ok(response.ok);assert.equal((await response.text()).replaceAll('\r\n','\n'),readFileSync(resolve(local,asset),'utf8').replaceAll('\r\n','\n'),'live asset bytes');}
   await page.waitForFunction(()=>document.querySelector('canvas')&&!document.querySelector('#loading'),null,{timeout:120000});await page.waitForTimeout(1500);
   assert.equal(await page.locator('#pause').getAttribute('aria-pressed'),'false');
   const a=PNG.sync.read(await page.locator('canvas').first().screenshot());await page.waitForTimeout(1400);
   const b=PNG.sync.read(await page.locator('canvas').first().screenshot({path:resolve(out,target.name+'-'+kind+'.png')}));assert.equal(a.data.length,b.data.length);
   let changed=0;for(let at=0;at<a.data.length;at+=4)if(Math.abs(a.data[at]-b.data[at])+Math.abs(a.data[at+1]-b.data[at+1])+Math.abs(a.data[at+2]-b.data[at+2])>15)changed++;
   assert.ok(changed>150,'live canvas visibly animates');report.push({site:target.name,kind,url:base,assets,changedPixels:changed,autoplay:true});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 writeFileSync(resolve(out,'results.json'),JSON.stringify({checkedAt:new Date().toISOString(),report},null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
