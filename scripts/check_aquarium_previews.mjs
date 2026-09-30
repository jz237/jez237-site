import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(new URL('./rotatable-aquascape/package.json',import.meta.url));
const {chromium}=require('playwright'),{PNG}=require('pngjs');
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'scripts/rotatable-aquascape/.qa-results/previews');await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{try{
 let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+sep))throw Error('Path');if((await stat(path)).isDirectory())path=resolve(path,'index.html');
 const data=await readFile(path);res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');
 if(path.endsWith('preview-loop-v1.mp4')){
  const range=/bytes=(\d+)-(\d*)/.exec(req.headers.range||''),start=range?+range[1]:0,end=range&&range[2]?Math.min(+range[2],data.length-1):data.length-1;
  res.setHeader('Accept-Ranges','bytes');res.setHeader('Content-Length',end-start+1);if(range){res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${data.length}`);}
  let offset=start;await new Promise(r=>setTimeout(r,1500));
  while(offset<=end&&!res.destroyed){const next=Math.min(end+1,offset+32768);res.write(data.subarray(offset,next));offset=next;await new Promise(r=>setTimeout(r,150));}res.end();
 }else res.end(data);
}catch{res.statusCode=404;res.end('Not found');}});
const live=process.argv[2];if(!live)await new Promise(r=>server.listen(5260,'127.0.0.1',r));
const base=live||'http://127.0.0.1:5260/prototypes/hidden-reef/';
const browser=await chromium.launch({channel:'chrome',headless:true}),report={base,slowVideoResponses:!live,cpuThrottle:4,cases:{}};
const sample=page=>page.locator('.aquarium-preview-video').evaluateAll(vs=>vs.map(v=>({time:v.currentTime,paused:v.paused,ready:v.readyState,visible:v.classList.contains('is-playing'),frames:v.getVideoPlaybackQuality?.().totalVideoFrames||0})));
async function moving(page,label,indices=[0,1]){
 await page.waitForFunction(ids=>ids.every(i=>{const v=document.querySelectorAll('.aquarium-preview-video')[i];return !v.paused&&v.currentTime>0&&v.readyState>=2&&v.classList.contains('is-playing');}),indices,{timeout:90000});
 const a=await sample(page);await page.waitForTimeout(1300);const b=await sample(page);
 for(const i of indices){assert.ok(b[i].time!==a[i].time,label+' time advances');assert.ok(b[i].frames>a[i].frames,label+' decoded frames advance');}
 return b;
}
try{
 for(const noObserver of (process.argv.includes('--smoke')?[false]:[false,true])){
  const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,addEventListener(){}}});});
  // Remove this capability only while the preview controller initializes, so
  // unrelated storefront controllers retain their own supported environment.
  if(noObserver)await page.route('**/aquarium-worlds.js*',async route=>{const response=await route.fetch(),body=await response.text();await route.fulfill({response,body:'{const savedPreviewObserver=window.IntersectionObserver;try{delete window.IntersectionObserver;'+body+'}finally{window.IntersectionObserver=savedPreviewObserver;}}'});});
  const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(base+'?preview-check='+Date.now(),{waitUntil:'domcontentloaded'});
  const key=noObserver?'older-observer-fallback':'normal';report.cases[key]={initial:await moving(page,'autoplay')};
  const a=PNG.sync.read(await page.locator('.aquarium-worlds-grid').screenshot());await page.waitForTimeout(1200);
  const b=PNG.sync.read(await page.locator('.aquarium-worlds-grid').screenshot({path:resolve(out,key+'.png')}));let changed=0;
  for(let at=0;at<a.data.length;at+=4)if(Math.abs(a.data[at]-b.data[at])+Math.abs(a.data[at+1]-b.data[at+1])+Math.abs(a.data[at+2]-b.data[at+2])>15)changed++;
  assert.ok(changed>100,'previews visibly change');report.cases[key].changedPixels=changed;
  const toggle=page.locator('.aquarium-preview-toggle');await toggle.click();const paused=await sample(page);await page.waitForTimeout(500);assert.deepEqual((await sample(page)).map(v=>v.time),paused.map(v=>v.time));
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(400);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400);assert.ok((await sample(page)).every(v=>v.paused),'scroll must not undo intentional pause');
  await toggle.click();await moving(page,'manual resume');
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(500);assert.ok((await sample(page)).every(v=>v.paused),'offscreen playback sleeps');
  await page.evaluate(()=>scrollTo(0,0));report.cases[key].returned=await moving(page,'return to previews');
  await page.setViewportSize({width:390,height:844});await page.locator('.aquarium-world-image').first().scrollIntoViewIfNeeded();report.cases[key].phone=await moving(page,'phone preview',[0]);await page.screenshot({path:resolve(out,key+'-phone.png')});
  assert.deepEqual(errors,[]);await page.close();
 }
 await writeFile(resolve(out,live?'live-results.json':'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();if(!live)await new Promise(r=>server.close(r));}
