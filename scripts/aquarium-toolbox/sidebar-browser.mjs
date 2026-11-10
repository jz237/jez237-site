// The calculator list on the left (Jez, Nov 10 2026: "The text on the left it's hard to read. Also I don't like
// blatant scroll bars. And when you select calculators on the left ... it changes the selection far below it
// which isn't always visible"). At several window sizes: no visible scroll bar, and every category pick leaves
// its list heading and first calculators on screen, with a brief highlight.
//   node scripts/aquarium-toolbox/sidebar-browser.mjs <toolbox-url> [evidence-dir] [chromium|firefox|webkit]
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const pw=await import('/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs');
const base=(process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/').replace(/#.*$/,'');
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-sidebar-20261110/sidebar-browser';
const engine=process.argv[4]||'chromium';
await mkdir(out,{recursive:true});
const browser=engine==='chromium'?await pw.chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'}):await pw[engine].launch({headless:true});
let checks=0;const errors=[];
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
try{
  for(const [name,vp] of [['1440x900',{width:1440,height:900}],['1366x768',{width:1366,height:768}],['1280x620',{width:1280,height:620}],['390x844',{width:390,height:844}],['320x568',{width:320,height:568}]]){
    const phone=vp.width<=760;
    const ctx=await browser.newContext({viewport:vp,hasTouch:phone});
    await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
    const p=await ctx.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(`${name}: ${e.message}`));
    await p.goto(base+'#tool=ammonia&units=us',{waitUntil:'load'});await p.waitForSelector('#tool-list .tool-link');await p.waitForTimeout(500);
    if(!phone)await p.evaluate(()=>scrollTo({top:document.querySelector('.workspace').getBoundingClientRect().top+scrollY-90,behavior:'instant'}));
    await p.waitForTimeout(250);
    const look=()=>p.evaluate(()=>{
      const lib=document.querySelector('.library'),list=document.getElementById('tool-list'),l=lib.getBoundingClientRect();
      const bar=e=>{const s=getComputedStyle(e),borders=parseFloat(s.borderLeftWidth)+parseFloat(s.borderRightWidth);return e.offsetWidth-e.clientWidth-borders;};
      const visible=e=>{const r=e.getBoundingClientRect();return r.top>=Math.max(0,l.top)-1&&r.bottom<=Math.min(innerHeight,l.bottom)+1&&r.height>0;};
      const links=[...document.querySelectorAll('#tool-list .tool-link')],caption=document.getElementById('list-caption');
      return {bars:[bar(lib),bar(list)],caption:caption.textContent,captionVisible:visible(caption),firstVisible:links.length?visible(links[0]):false,
        shown:links.filter(visible).length,count:links.length,flash:document.querySelector('.library-results').classList.contains('is-updated'),
        sticky:getComputedStyle(lib).position==='sticky',stuck:l.top<=parseFloat(getComputedStyle(lib).top)+1,fits:l.bottom<=innerHeight+1,menu:parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,top:l.top};
    });
    let s=await look();
    check(s.bars.every(b=>b<=0),`${name}: no visible scroll bar in the calculator list (${s.bars})`);
    // Once it sticks below the menu, the whole panel fits the window (before that, the page itself scrolls).
    if(!phone){await p.evaluate(()=>scrollBy({top:100,behavior:'instant'}));await p.waitForTimeout(150);const t=await look();
      const nav=await p.evaluate(()=>{const n=document.querySelector('nav.main-nav');return n&&getComputedStyle(n).position==='fixed'?n.getBoundingClientRect().bottom:0;});
      check(t.sticky&&t.stuck&&t.fits&&t.top>=nav-1,`${name}: the list panel fits the window below the menu (${JSON.stringify({...t,nav})})`);await p.evaluate(()=>scrollBy({top:-100,behavior:'instant'}));await p.waitForTimeout(150);}
    const cats=await p.locator('.category').evaluateAll(a=>a.map(x=>x.dataset.category));
    for(const cat of cats){
      if(cat==='favorites')continue;
      const button=p.locator(`.category[data-category="${cat}"]`);await button.scrollIntoViewIfNeeded();await button.click();await p.waitForTimeout(450);
      s=await look();
      check(s.captionVisible&&s.firstVisible,`${name}: after picking ${cat} its list heading and first calculator are on screen (${JSON.stringify(s)})`);
      check(s.shown>=Math.min(3,s.count),`${name}: at least three of its calculators are visible after picking ${cat} (${s.shown}/${s.count})`);
      check(s.flash,`${name}: the list flashes once after picking ${cat}`);
      // The picked category stays in view whenever it and three of its calculators fit in the panel together.
      const fitsBoth=await button.evaluate(b=>{const lib=b.closest('.library'),first=document.querySelector('#tool-list .tool-link:nth-child(3)')||document.querySelector('#tool-list .tool-link:last-child');return !first||first.getBoundingClientRect().bottom-b.getBoundingClientRect().top+40<=lib.clientHeight;});
      if(!phone&&fitsBoth)check(await button.evaluate(b=>{const r=b.getBoundingClientRect(),l=b.closest('.library').getBoundingClientRect();return r.top>=l.top-1&&r.bottom<=l.bottom+1;}),`${name}: the category just picked (${cat}) is still in view`);
      check(await p.evaluate(()=>document.getElementById('tool-list').scrollTop)===0,`${name}: the list starts at its top after picking ${cat}`);
    }
    await p.screenshot({path:`${out}/${engine}-${name}.png`});
    // Searching still lists matches from the top, and a scrolled list shows the fade only while more is hidden.
    await p.locator('#search').scrollIntoViewIfNeeded();await p.locator('#search').fill('water');await p.waitForTimeout(250);
    check(/MATCHING/.test(await p.locator('#list-caption').innerText()),`${name}: search shows matches`);
    await p.locator('#search').fill('');
    check(await p.locator('.category[aria-pressed="true"]').count()===1,`${name}: one category is shown as picked`);
    await ctx.close();
  }
  check(errors.length===0,`no page errors: ${errors.join(' | ')}`);
  console.log(`SIDEBAR OK (${engine}): ${checks} checks at ${base}`);
}finally{await browser.close();}
