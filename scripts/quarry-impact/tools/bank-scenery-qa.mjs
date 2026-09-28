import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.QUARRY_BANK_OUTPUT;assert.ok(out);await fs.mkdir(out,{recursive:true});assert.equal(await fs.access(out+'/report.json').then(()=>true,()=>false),false);
const report={errors:[],views:[]};let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});const page=await browser.newPage({viewport:{width:2560,height:1440}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(process.env.QUARRY_QA_URL||'http://127.0.0.1:8795/');await page.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
 report.bundle=await page.locator('script[type="module"][src^="./assets/index-"]').getAttribute('src');
 await page.evaluate(async()=>{await __quarry.start('playground');__quarry.setQuality('ultra');__quarry.mute();document.querySelector('#ui').style.visibility='hidden';});
 for(const degrees of [86,205,338]){
  const a=degrees*Math.PI/180,s=Math.sin(a),c=Math.cos(a),view={p:[s*112*1.08,8,c*112],look:[s*130*1.08,7,c*130]};
  await page.evaluate(v=>__quarry.captureCamera(v.p,v.look),view);await page.waitForTimeout(750);await page.screenshot({path:out+'/'+degrees+'.png'});
  report.views.push({degrees,...await page.evaluate(()=>({pose:__quarry.cameraPose,stats:__quarry.stats}))});
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=String(e);process.exitCode=1;}
finally{await browser?.close();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,errors:report.errors,failure:report.failure}));}
