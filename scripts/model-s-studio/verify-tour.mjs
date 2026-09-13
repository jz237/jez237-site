import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const base=process.env.STUDIO_URL||'http://127.0.0.1:8768/demos/model-s-studio/';
const shots=process.env.STUDIO_SHOTS||path.join(tmpdir(),'model-s-tour-validation');await mkdir(shots,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const settled=async()=>{await page.locator('#tour-loading').waitFor({state:'hidden',timeout:60000});assert.equal(await page.locator('#tour-error').isVisible(),false);};
const state=()=>page.locator('#tour-frame').evaluate(f=>f.contentWindow.modelSStudio?.getState()||f.contentWindow.modelSCockpit?.getState());
try{
 await page.goto(new URL('tour.html',base).href);await settled();assert.equal((await state()).paint,'#aeb7c2');
 assert.equal(await page.locator('#tour-back').isDisabled(),true);assert.equal(await page.locator('#tour-play').getAttribute('aria-pressed'),'false');
 for(let i=0;i<9;i++){
  await page.locator('#tour-step').selectOption(String(i));await settled();await page.waitForTimeout(1100);
  const s=await state();assert.equal(await page.locator('#tour-progress').getAttribute('value'),String(i+1));
  if(i===1){assert.equal(s.target,1);assert.equal(s.visible,308);}
  if(i===2){assert.equal(s.system,'Battery');assert.equal(s.visible,11);}
  if(i>2)assert.equal(s.view,['driver','seats','door','pedals','console','display'][i-3]);
  assert.equal(await page.locator('#tour-frame').evaluate(f=>f.contentDocument.querySelector('.topbar').getBoundingClientRect().height),0);
  if([0,2,4,6,8].includes(i))await page.screenshot({path:path.join(shots,`stop-${i}.png`)});
 }
 await page.locator('#tour-display').click();assert.equal((await state()).screenOpen,true);
 const frame=page.frameLocator('#tour-frame');await frame.locator('#close-screen').click();
 await page.locator('#tour-next').click();await settled();assert.equal((await state()).system,'all');assert.equal((await state()).target,0);
 await page.locator('#tour-play').click();await page.waitForFunction(()=>document.querySelector('#tour-step').value==='1',null,{timeout:14000});await settled();
 await page.locator('#tour-play').click();assert.equal(await page.locator('#tour-play').getAttribute('aria-pressed'),'false');
 await page.locator('#tour-play').click();await frame.locator('canvas').click({position:{x:15,y:15}});assert.equal(await page.locator('#tour-play').getAttribute('aria-pressed'),'false');
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});await page.locator('#tour-step').selectOption('4');await settled();await page.waitForTimeout(900);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(shots,`tour-phone-${width}.png`),fullPage:true});
 }
 for(const view of ['seats','door','pedals','console']){
  await page.goto(new URL(`cockpit.html?view=${view}`,base).href);await page.waitForFunction(()=>document.body.dataset.ready==='true');
  assert.equal(await page.evaluate(()=>modelSCockpit.getState().view),view);assert.equal(await page.locator(`[data-camera="${view}"]`).getAttribute('aria-pressed'),'true');
  const before=await page.evaluate(()=>modelSCockpit.getState());await page.locator('#cockpit-viewport').focus();await page.keyboard.press('ArrowLeft');
  const after=await page.evaluate(()=>modelSCockpit.getState());assert.deepEqual(after.camera,before.camera);assert.notDeepEqual(after.look,before.look);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.waitForTimeout(200);await page.screenshot({path:path.join(shots,`detail-${view}-phone.png`)});
 }
 await page.goto(new URL('tour.html?stop=console',base).href);await settled();assert.equal((await state()).view,'console');
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(new URL('cockpit.html?view=door',base).href);await reduced.waitForFunction(()=>document.body.dataset.ready==='true');await reduced.locator('[data-camera="console"]').click();assert.deepEqual(await reduced.evaluate(()=>modelSCockpit.getState().camera),[.33,1.02,-.1]);await reduced.close();
 const failed=await browser.newPage();await failed.route('**/model-s.glb*',r=>r.abort());await failed.goto(new URL('tour.html',base).href);await failed.locator('#tour-error').waitFor({state:'visible'});assert.ok(await failed.locator('#tour-error a').isVisible());await failed.unroute('**/model-s.glb*');await failed.locator('#tour-retry').click();await failed.locator('#tour-loading').waitFor({state:'hidden',timeout:60000});assert.equal(await failed.locator('#tour-error').isVisible(),false);await failed.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: nine tour stops, exterior/battery/cockpit transitions, play/pause/restart, interaction pause, touchscreen, deep links, four close-ups, keyboard, phone layouts and reduced motion. '+base+' Screenshots: '+shots);
}finally{await browser.close();}
