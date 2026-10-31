const {chromium}=require('C:/Users/jrb04/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const base=process.argv[2]||'http://127.0.0.1:8823',browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});fs.mkdirSync('tmp/biowheel-qa',{recursive:true});
 await p.goto(base+'/demos/biowheel-studio/?v=2');await p.waitForFunction(()=>window.biowheelStudio?.snapshot().optics?.captures>5);await p.waitForTimeout(1500);
 const snap=()=>p.evaluate(()=>biowheelStudio.snapshot());
 async function screenshot(name){await p.evaluate(()=>document.querySelector('.stage').scrollIntoView({block:'start'}));await p.screenshot({path:`tmp/biowheel-qa/water-${name}.png`});}
 await p.locator('[data-focus=spillway]').click();await p.waitForTimeout(1000);await p.locator('#arrows').click();await p.locator('#labels-toggle').click();await screenshot('spillway');
 const initial=await snap();assert(initial.effects.water.sheetVisible);assert.equal(initial.optics.reflection,'planar-scene-capture');
 await p.locator('#pause').click();const paused=await snap();await p.waitForTimeout(600);assert.deepEqual((await snap()).effects.water,paused.effects.water);await p.locator('#pause').click();
 await p.locator('[data-tab=lab]').click();assert.equal(await p.locator('#loading').count(),1);await p.locator('#cartridge-loading').fill('36');assert.equal((await snap()).loading,36);assert(await p.locator('#cartridge-loading').evaluate(e=>getComputedStyle(e).position==='static'));await p.locator('#cartridge-loading').fill('18');await p.locator('#water').fill('12');await p.waitForTimeout(900);const low=await snap();assert(low.effects.water.drop>initial.effects.water.drop);assert(low.effects.water.impactZ>initial.effects.water.impactZ);await screenshot('low-level');
 await p.locator('#water').fill('100');await p.waitForTimeout(600);await screenshot('high-level');
 await p.locator('#flow').fill('18');await p.waitForTimeout(1800);assert((await snap()).simulation.flow<.2);await screenshot('low-flow');
 await p.locator('#power').click();await p.waitForFunction(()=>biowheelStudio.snapshot().simulation.flow<.004,{},{timeout:20000});assert.equal((await snap()).effects.water.sheetVisible,false);await screenshot('pump-off');
 await p.locator('#reset').click();await p.waitForTimeout(1000);assert((await snap()).effects.water.sheetVisible);
 await p.locator('[data-mode=exploded]').first().click();await p.waitForTimeout(1300);const captures=(await snap()).optics.captures;await p.waitForTimeout(400);assert.equal((await snap()).optics.captures,captures);
 await p.locator('[data-mode=macro]').first().click();await p.waitForTimeout(1000);const macro=(await snap()).optics.captures;await p.waitForTimeout(300);assert.equal((await snap()).optics.captures,macro);
 await p.locator('#reset').click();await p.setViewportSize({width:390,height:844});await p.waitForTimeout(1000);assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));assert((await snap()).optics.captures>macro);await screenshot('mobile');
 assert.deepEqual(errors,[]);console.log('PASS: water capture, pause, low/high aquarium levels, reduced delivery, pump stop/restart, exploded/macro capture isolation, mobile and no shader errors.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
