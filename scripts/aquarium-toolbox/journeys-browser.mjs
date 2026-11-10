// What a visitor does around the calculators, in a real browser: arrive from a link, pick tools,
// press Back, reload, open a shared link, type a comma. Usable against the source preview or the Lab.
//   node scripts/aquarium-toolbox/journeys-browser.mjs <toolbox-url> [evidence-dir] [chromium|firefox|webkit]
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const pw=await import('/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs');
const base=(process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/').replace(/#.*$/,'');
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-user-20261110/journeys';
const engine=process.argv[4]||'chromium';
await mkdir(out,{recursive:true});
const browser=engine==='chromium'?await pw.chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'}):await pw[engine].launch({headless:true});
let checks=0;const errors=[];
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const heading=p=>p.evaluate(()=>{const h=document.querySelector('.calc-heading');const r=h.getBoundingClientRect();return {title:h.querySelector('h2').textContent,top:Math.round(r.top),vh:innerHeight};});
const visible=h=>h.top>=0&&h.top<h.vh*.6;
try{
 for(const [label,vp] of [['phone',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
  const ctx=await browser.newContext({viewport:vp,hasTouch:label==='phone'});
  await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const p=await ctx.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(`${label}: ${e.message}`));
  // 1. A link to one tool opens on that calculator, not the top of the page.
  await p.goto(`${base}#tool=heater`,{waitUntil:'load'});await p.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Heater size');await p.waitForTimeout(600);
  let h=await heading(p);check(visible(h),`${label}: a #tool=heater link lands with the calculator in view (heading at ${h.top}px of ${h.vh})`);
  check(new URL(p.url()).hash==='#tool=heater',`${label}: address keeps #tool=heater`);
  await p.screenshot({path:`${out}/${engine}-${label}-landing.png`});
  // A plain visit still opens at the top of the page.
  await p.goto(base,{waitUntil:'load'});await p.waitForTimeout(400);
  check(await p.evaluate(()=>scrollY)===0,`${label}: a plain visit opens at the top`);
  check(/#tool=/.test(new URL(p.url()).hash),`${label}: the open tool is written into the address so Back can return to it`);
  // 2. Pick tools from the library; Back returns to the previous calculator, then the one before.
  const pick=async id=>{await p.locator('[data-category="all"]').click();const a=p.locator(`.tool-link[data-tool="${id}"]`);await a.scrollIntoViewIfNeeded();await a.click();await p.waitForFunction(id=>location.hash===`#tool=${id}`,id);await p.waitForTimeout(250);};
  await pick('change');await pick('salt');
  h=await heading(p);check(h.title==='Saltwater mixing'&&visible(h),`${label}: after picking a tool far down the list its heading is in view (${h.top}px)`);
  await p.goBack();await p.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Water change planner');checks++;
  h=await heading(p);check(visible(h),`${label}: Back shows the previous calculator in view (${h.top}px)`);
  await p.goForward();await p.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Saltwater mixing');checks++;
  // 3. A shared calculation is read once; Back and reload do not re-apply it over later edits.
  await p.locator('#field-v').fill('7');await p.waitForTimeout(250);
  await p.locator('#share-result').click();const shared=await p.inputValue('#share-url');await p.locator('#share-dialog [data-close]').click();
  check(/data=/.test(shared),`${label}: the share link carries the inputs`);
  const fresh=await browser.newContext({viewport:vp});const q=await fresh.newPage();q.on('pageerror',e=>errors.push(`${label} shared: ${e.message}`));
  await q.goto(shared,{waitUntil:'load'});await q.waitForFunction(()=>document.querySelector('.calc-heading h2')?.textContent==='Saltwater mixing');await q.waitForTimeout(500);
  check(await q.inputValue('#field-v')==='7',`${label}: shared link opens with the sender's numbers`);
  check(new URL(q.url()).hash==='#tool=salt',`${label}: address tidied after reading the shared link (${new URL(q.url()).hash.slice(0,40)})`);
  h=await heading(q);check(visible(h),`${label}: a shared link lands on the calculation (${h.top}px)`);
  await q.locator('#field-v').fill('12');await q.waitForTimeout(250);await q.reload({waitUntil:'load'});await q.waitForTimeout(400);
  check(await q.inputValue('#field-v')==='12',`${label}: reload after opening a shared link keeps the visitor's own edit`);
  await fresh.close();
  // 4. A comma is never silently dropped from a number.
  await pick('tank');const before=await p.inputValue('#field-l');await p.locator('#field-l').focus();await p.keyboard.press('End');await p.keyboard.type(',');await p.waitForTimeout(150);
  check(await p.inputValue('#field-l')===before,`${label}: typing a comma leaves the number unchanged`);
  check(/without commas/.test(await p.locator('#toast').innerText()),`${label}: a comma shows how to type the number`);
  // 5. Soft-water tanks below pH 6 get an answer.
  await pick('ammonia');await p.locator('#field-ph').fill('5.5');await p.waitForTimeout(250);
  check(await p.locator('.primary-metric').count()===1&&!(await p.locator('.error-card').count()),`${label}: ammonia check accepts pH 5.5`);
  // 6. The floating summary on phones points to the answer.
  if(label==='phone'){await pick('tank');await p.evaluate(()=>document.querySelector('#field-displacement').scrollIntoView({block:'center'}));await p.waitForTimeout(400);
   const bar=await p.evaluate(()=>{const b=document.querySelector('#quick-result');return b&&!b.hidden?document.querySelector('#quick-result-button').textContent:'';});
   check(bar===''||/See answer/.test(bar),`${label}: summary bar button reads "${bar}"`);}
  await ctx.close();
 }
 assert.deepEqual(errors,[]);
 const report={base,engine,checks,errors};await writeFile(`${out}/${engine}-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
