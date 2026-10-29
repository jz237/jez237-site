const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'C:/Users/jrb04/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const url=process.argv[2]||'http://127.0.0.1:8818/demos/moving-bed-studio/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});try{
 const page=await browser.newPage({viewport:{width:1500,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(url);await page.waitForFunction(()=>window.movingBedStudio?.snapshot().ready);fs.mkdirSync('tmp/moving-bed-qa',{recursive:true});
 const snap=()=>page.evaluate(()=>window.movingBedStudio.snapshot()),click=s=>page.locator(s).click(),shot=async name=>{await page.waitForTimeout(1000);await page.screenshot({path:`tmp/moving-bed-qa/texture-${name}.png`});};
 await shot('main');let s=await snap();assert.equal(s.effects.texturedMaterials,6);assert.equal(s.optics.surfaceDetail,'multi-scale-ripple-normals');
 await click('[data-focus=bed]');await page.locator('[data-view=top]').click();await shot('surface');
 await click('[data-focus=diffusers]');await shot('diffusers');await click('#pause');s=await snap();await page.waitForTimeout(250);assert.equal((await snap()).effects.waterDetail.causticClock,s.effects.waterDetail.causticClock);await click('#pause');
 await click('#inspect-carrier');await shot('carrier');await click('#shell');await shot('film');await click('#inspect-airpump');await shot('metal');
 await click('#reset');await click('button[data-mode=assembled]');await page.waitForTimeout(100);assert.equal((await snap()).effects.waterDetail.wallBeads,48);
 await click('button[data-mode=cutaway]');await page.waitForTimeout(100);assert.equal((await snap()).effects.waterDetail.wallBeads,0);
 await click('[data-tab=care]');await page.waitForTimeout(100);assert(!(await snap()).effects.waterVisible);s=await snap();await page.waitForTimeout(250);assert.equal((await snap()).effects.waterDetail.causticClock,s.effects.waterDetail.causticClock);
 await click('#reset');await page.setViewportSize({width:390,height:844});await shot('mobile');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,materialProfiles:6,rippleNormals:true,causticPause:true,wallBeads:48,careSuspendsWater:true,mobile:true,errors},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
