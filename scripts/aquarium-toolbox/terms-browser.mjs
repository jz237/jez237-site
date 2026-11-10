// The explanations for rules and terms, in a real browser: every calculator's answer marks its terms, a tap
// (phone), hover (mouse) or focus (keyboard) shows the explanation, and it stays on screen.
// Usable against the source preview or the Lab.
//   node scripts/aquarium-toolbox/terms-browser.mjs <toolbox-url> [evidence-dir] [chromium|firefox|webkit]
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const pw=await import('/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs');
const {glossary}=await import('../../aquarium-toolbox/glossary.mjs');
const base=(process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/').replace(/#.*$/,'');
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-terms-20261110/terms-browser';
const engine=process.argv[4]||'chromium';
await mkdir(out,{recursive:true});
const browser=engine==='chromium'?await pw.chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'}):await pw[engine].launch({headless:true});
let checks=0;const errors=[];
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const open=async(options={},hash='#tool=stocking&units=us')=>{
  const ctx=await browser.newContext({viewport:{width:1280,height:900},...options});
  await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const p=await ctx.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+hash,{waitUntil:'load'});await p.waitForSelector('.calc-heading h2');await p.waitForTimeout(350);
  return {ctx,p};
};
const tool=async(p,id)=>{await p.evaluate(id=>{location.hash=`#tool=${id}`;},id);await p.waitForFunction(id=>document.querySelector('#calc-form')&&location.hash===`#tool=${id}`,id);await p.waitForTimeout(200);};
const tipState=p=>p.evaluate(()=>{const t=document.getElementById('term-tip');const r=t.getBoundingClientRect();const f=document.querySelector('.term[aria-expanded="true"]');const fr=f?f.getBoundingClientRect():null;
  const bar=document.getElementById('quick-result'),barTop=bar&&!bar.hidden&&getComputedStyle(bar).display!=='none'?bar.getBoundingClientRect().top:innerHeight;
  return {hidden:t.hidden||getComputedStyle(t).display==='none',text:t.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom,vw:document.documentElement.clientWidth,vh:innerHeight,barTop,menu:parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,
    overlapsTerm:fr?!(r.right<=fr.left||r.left>=fr.right||r.bottom<=fr.top||r.top>=fr.bottom):false,described:f?f.getAttribute('aria-describedby'):null,role:t.getAttribute('role')};});
const term=(p,text)=>p.locator('#result .term',{hasText:text}).first();
// A finger lands on a point, not on an element: tap and click the middle of the label, wherever that falls.
const middle=el=>el.evaluate(e=>{e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getClientRects()[0];return [r.left+r.width/2,r.top+r.height/2];});
const tapOn=async(p,el)=>{const [x,y]=await middle(el);await p.touchscreen.tap(x,y);};
const clickOn=async(p,el)=>{const [x,y]=await middle(el);await p.mouse.click(x,y);};
const hoverOn=async(p,el)=>{const [x,y]=await middle(el);await p.mouse.move(x,y);};
try{
  // ---------- 1. Phone: a tap opens the explanation, a second tap or a tap elsewhere closes it ----------
  for(const width of [390,320]){
    const {ctx,p}=await open({viewport:{width,height:width===390?844:568},hasTouch:true});
    const names=await p.locator('#result .term').evaluateAll(a=>a.map(x=>x.textContent.trim()));
    for(const want of ['Gallon rule','Surface rule','rule-of-thumb limit','Fish this size the rules allow'])check(names.includes(want),`${width}px: “${want}” is marked (found: ${names.join(', ')})`);
    for(const want of ['Surface rule','Gallon rule','rule-of-thumb limit']){
      const el=term(p,want);
      await tapOn(p,el);await p.waitForTimeout(200);let s=await tipState(p);
      check(!s.hidden&&s.text.length>40,`${width}px: tapping “${want}” shows its explanation`);
      check(s.left>=0&&s.right<=s.vw+.5&&s.top>=s.menu-1&&s.bottom<=s.barTop+.5,`${width}px: the explanation for “${want}” stays on screen, clear of the menu and summary bar (${JSON.stringify(s)})`);
      check(!s.overlapsTerm,`${width}px: it does not cover “${want}” itself`);
      check(s.described==='term-tip'&&s.role==='tooltip',`${width}px: “${want}” is tied to the explanation for screen readers`);
      if(want==='Surface rule'){check(/1 inch of adult fish for every 12 square inches of water surface \(tank length × width\)/.test(s.text),`${width}px: surface rule text: ${s.text}`);await p.screenshot({path:`${out}/${engine}-${width}-surface-rule.png`});}
      if(want==='Gallon rule')check(/1 inch of adult fish for every US gallon/.test(s.text),`${width}px: gallon rule text`);
      await tapOn(p,el);await p.waitForTimeout(150);check((await tipState(p)).hidden,`${width}px: a second tap closes it`);
    }
    await term(p,'Surface rule').scrollIntoViewIfNeeded();await tapOn(p,term(p,'Surface rule'));await p.waitForTimeout(150);check(!(await tipState(p)).hidden,`${width}px: open before tapping elsewhere`);await tapOn(p,p.locator('.result-message'));await p.waitForTimeout(150);
    check((await tipState(p)).hidden,`${width}px: tapping elsewhere closes it`);
    // A new answer drops the open explanation and marks the new one.
    await tapOn(p,term(p,'Gallon rule'));await p.waitForTimeout(120);await p.locator('#field-count').fill('3');await p.waitForTimeout(250);
    check((await tipState(p)).hidden,`${width}px: changing a number closes the explanation`);
    check(await p.locator('#result .term').count()>=4,`${width}px: the new answer is marked again`);
    check(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`${width}px: no sideways scroll`);
    await ctx.close();
  }
  // ---------- 2. Mouse and keyboard ----------
  {
    const {ctx,p}=await open();
    const el=term(p,'Surface rule');await el.scrollIntoViewIfNeeded();
    await hoverOn(p,el);await p.waitForTimeout(200);check(!(await tipState(p)).hidden,'hovering shows the explanation');
    await p.locator('.calc-heading h2').hover();await p.waitForTimeout(200);check((await tipState(p)).hidden,'moving away hides it');
    await hoverOn(p,el);await clickOn(p,el);await p.locator('.calc-heading h2').hover();await p.waitForTimeout(200);check(!(await tipState(p)).hidden,'a click pins it open');
    await p.keyboard.press('Escape');await p.waitForTimeout(100);check((await tipState(p)).hidden,'Escape closes it');
    // Keyboard: Tab reaches the terms; focus shows the explanation, Enter pins it.
    await p.locator('#field-count').focus();let reached='';
    for(let i=0;i<40&&!reached;i++){await p.keyboard.press('Tab');reached=await p.evaluate(()=>document.activeElement?.classList?.contains('term')?document.activeElement.textContent.trim():'');}
    check(!!reached,`Tab reaches a marked term (${reached})`);
    await p.waitForTimeout(150);let s=await tipState(p);check(!s.hidden&&s.text.length>40,'keyboard focus shows the explanation');
    await p.keyboard.press('Enter');await p.waitForTimeout(150);check(!(await tipState(p)).hidden,'Enter keeps it open');
    await p.keyboard.press('Escape');await p.waitForTimeout(100);check((await tipState(p)).hidden,'Escape closes it from the keyboard');
    // Metric wording.
    await p.evaluate(()=>{location.hash='#tool=stocking&units=metric';});await p.waitForTimeout(400);
    await clickOn(p,term(p,'Surface rule'));await p.waitForTimeout(150);check(/about 1 cm of fish for every 30 cm²/.test((await tipState(p)).text),'metric visitors get the rule in centimetres');
    await p.keyboard.press('Escape');
    await p.evaluate(()=>{location.hash='#tool=stocking&units=us';});await p.waitForTimeout(400);
    // The kinds of fish explain their own rule.
    await p.locator('#field-kind').selectOption('marine');await p.waitForTimeout(250);
    await clickOn(p,term(p,'5-gallon rule'));await p.waitForTimeout(150);check(/1 inch of adult fish for every 5 US gallons/.test((await tipState(p)).text),'saltwater: 5-gallon rule explained');await p.keyboard.press('Escape');
    await p.locator('#field-kind').selectOption('goldfish');await p.waitForTimeout(250);
    await clickOn(p,term(p,'Fancy goldfish this tank suits'));await p.waitForTimeout(150);check(/20 US gallons \(75 L\) for the first fish and 10 US gallons \(38 L\) for each one after/.test((await tipState(p)).text),'goldfish guideline explained');await p.keyboard.press('Escape');
    await p.locator('#field-kind').selectOption('tropical');await p.waitForTimeout(250);
    // Filter & flow: the range quoted is the one for the kind of tank chosen.
    await tool(p,'turnover');
    for(const [kind,range] of [['community','4–6'],['sps','30–40']]){await p.locator('#field-kind').selectOption(kind);await p.waitForTimeout(250);await clickOn(p,term(p,'Usual low'));await p.waitForTimeout(150);
      check(new RegExp(`${range} times its water volume every hour`).test((await tipState(p)).text),`flow: ${kind} quotes ${range}`);await p.keyboard.press('Escape');}
    // ---------- 3. Every calculator with explanations marks them, and the cards still read the same ----------
    for(const [id,entries] of Object.entries(glossary)){
      await tool(p,id);
      const found=await p.locator('#result .term').evaluateAll(a=>a.map(x=>({text:x.textContent.trim(),tip:x.dataset.term||'',tag:x.tagName})));
      check(found.length>=1,`${id}: at least one term is marked`);
      for(const f of found){check(entries.some(([phrase])=>phrase===f.text),`${id}: “${f.text}” is a glossary phrase`);check(f.tip.length>=40,`${id}: “${f.text}” has an explanation`);}
      check(new Set(found.map(f=>f.text)).size===found.length,`${id}: each phrase is marked once`);
      check(await p.locator('#result .error-card').count()===0,`${id}: still calculates`);
    }
    // Buttons in the answer keep working and are never turned into terms.
    await tool(p,'tank');check(await p.locator('#share-result .term, #print-result .term').count()===0,'action buttons are left alone');
    await p.locator('#share-result').click();check(await p.locator('#share-dialog').evaluate(d=>d.open),'Share still opens');await p.locator('#share-dialog [data-close]').click();
    // Print: no bubble, no marks.
    await tool(p,'stocking');await clickOn(p,term(p,'Surface rule'));await p.emulateMedia({media:'print'});
    check((await tipState(p)).hidden,'the explanation bubble is not printed');await p.emulateMedia({media:'screen'});await p.keyboard.press('Escape');
    // ---------- 4. A footprint that cannot belong to the tank: warned, and the far-larger bar is cut short ----------
    for(const [key,value] of [['v','10'],['l','158'],['w','12'],['size','1.13'],['count','10']]){await p.locator(`#field-${key}`).fill(value);}
    await p.waitForTimeout(300);
    check(/^Check the tank length and width: they describe a far bigger footprint than this much water could fill/.test(await p.locator('.result-message').innerText()),'mismatched footprint is called out first');
    const cut=await p.evaluate(()=>({lab:document.querySelectorAll('#result .aqt-bar.is-cut').length,svg:document.querySelectorAll('#result .bar-break').length,bars:[...document.querySelectorAll('#result .aqt-bar__col span')].map(s=>s.getBoundingClientRect().height),rects:[...document.querySelectorAll('#result svg rect[rx="7"]')].map(r=>Number(r.getAttribute('height')))}));
    check(cut.lab+cut.svg===1,`exactly one bar is cut short (${JSON.stringify(cut)})`);
    const heights=cut.bars.length?cut.bars:cut.rects;check(heights.length===3&&heights[0]>=.5*heights[2]&&heights[1]>=.5*heights[2],`the two deciding bars are at least half the chart height (${heights.map(h=>Math.round(h)).join(', ')})`);
    check(/158/.test(await p.locator('#result .diagram').innerText()),'the cut bar still shows its number');
    await p.screenshot({path:`${out}/${engine}-cut-bar.png`});
    await p.locator('#field-l').fill('20');await p.locator('#field-w').fill('10');await p.waitForTimeout(300);
    check(!/Check the tank length/.test(await p.locator('.result-message').innerText()),'a real 10-gallon footprint clears the warning');
    check(await p.evaluate(()=>document.querySelectorAll('#result .aqt-bar.is-cut, #result .bar-break').length)===0,'and no bar is cut');
    await ctx.close();
  }
  check(errors.length===0,`no page errors: ${errors.join(' | ')}`);
  console.log(`TERMS OK (${engine}): ${checks} checks at ${base}`);
}finally{await browser.close();}
