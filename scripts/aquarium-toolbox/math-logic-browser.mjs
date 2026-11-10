// Focused regression proof of the math/logic audit in real controls, on either host.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core/index.mjs';
const base=process.argv[2]||'http://127.0.0.1:8899/aquarium-toolbox/';
const out=process.argv[3]||'/home/jez237/.openclaw/workspace/state/aquarium-math-20261110/browser';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'});
const errors=[],screenshots=[];let checks=0;
try{
 for(const width of [1440,390]){
  const ctx=await browser.newContext({viewport:{width,height:950}});
  await ctx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base,{waitUntil:'networkidle'});await p.locator('.primary-metric').waitFor();
  checks+=await p.evaluate(async()=>{
   let n=0;const check=(v,msg)=>{if(!v)throw new Error(msg);n++;};
   const get=id=>document.getElementById(id),click=id=>get(id).click(),edit=(key,v)=>{let el=get('field-'+key);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
   const go=id=>{document.querySelector('[data-category=all]').click();document.querySelector(`.tool-link[data-tool=${id}]`).click();click('unit-metric');click('reset');};
   const vals=()=>[...document.querySelectorAll('.metric-value')].map(el=>el.textContent);
   const msg=()=>document.querySelector('.result-message')?.textContent||'';
   const stored=()=>JSON.parse(localStorage.getItem('aquarium-toolbox-v1')).inputs;
   const near=(a,b)=>Math.abs(a-b)<1e-8;
   go('label');for(const [k,v]of Object.entries({v:1,labelV:10,dose:.1,bottle:.07}))edit(k,v);
   check(/^7\s*doses/.test(vals()[1]),'seven full doses must not floor to six');
   edit('bottle',.01);check(/^1\s*dose$/.test(vals()[1].trim()),'one dose is singular: '+vals()[1]);
   go('stocking');click('unit-us');for(const [k,v]of Object.entries({v:20,l:24,w:12,size:1.5,count:13}))edit(k,v);
   check(/Fully stocked/.test(msg())&&/^13\s*fish/.test(vals()[2]),'13 of 13 allowed is full, with no room promised');
   edit('count',14);check(/Over the stricter of the two rules/.test(msg()),'14 is over the gallon rule');edit('count',10);check(/room for about 3 more fish/.test(msg()),'room left is allowance minus fish');
   edit('kind','marine');edit('size',4);edit('v',75);edit('count',3);check(/^80\s*%/.test(vals()[0]),'a 4 in saltwater fish is still within the inch rule in US units');
   go('substrate');edit('bagMode','volume');for(const [k,v]of Object.entries({l:7.62,w:30.48,front:2.54,back:2.54,bag:.08427632914285714}))edit(k,v);
   check(/^7\s*bags/.test(vals()[2]),'exact seven bags not eight');
   go('hardness');edit('value',10);edit('unit','ppm');check(near(Number(get('field-value').value),178.48),'hardness unit converts physical reading');
   edit('unit','meq');check(near(Number(get('field-value').value),3.5696),'meq conservation');edit('unit','degree');check(near(Number(get('field-value').value),10),'hardness unit round trip');
   go('supplement');edit('dose',4);edit('labelV',100);edit('rise',2);edit('parameter','mg/L');
   for(const key of ['dose','labelV','rise'])check(get('field-'+key).value==='',key+' must not carry old product strength');
   check(!!document.querySelector('.error-card'),'no calculated dose using the wrong product');
   for(const [k,v]of Object.entries({v:100,current:400,target:420,dose:10,labelV:50,rise:10,days:2}))edit(k,v);
   check(/^40\s*mL/.test(vals()[0]),'new exact supplement label gives 40 mL total');
   check(/^20\s*mL\/day/.test(vals()[1]),'20 mL/day');
   go('ammonia');edit('tan',14.0067);edit('ph',8);edit('basis','N');
   check(/Your test as NH₃: 17(?:\.0)? ppm/.test(document.querySelector('.diagram').textContent),'total N is converted to NH3 mass on chart');
   check(/0\.91/.test(vals()[0]),'toxic NH3 result has matching molecular basis');
   go('nitrate');edit('days',30);
   check(/90 days/.test(document.querySelector('.diagram').textContent),'chart labels cover 90 days, not three weeks');
   if(document.querySelector('.aqt')){
    const dots=[...document.querySelectorAll('.aqt-trend__dot')];check(dots[1].style.left===dots[2].style.left,'first water change is instantaneous');check(dots[3].style.left===dots[4].style.left,'second water change is instantaneous');
   }
   go('consumption');edit('start',8);edit('end',9);edit('hours',24);check(/^1\s*dKH\/day/.test(vals()[0]),'rise is positive value');check(/rise/.test(document.querySelector('.primary-metric .metric-label').textContent),'rise has correct direction');check(/not a negative dose/.test(msg()),'no negative dosing advice');
   go('stocking');edit('kind','goldfish');click('unit-us');edit('v',19.9999);edit('count',1);
   check(/^0\s*fish/.test(vals()[1]),'below twenty gallons allows zero by guideline');check(/Too small/.test(msg()),'verdict agrees with count');
   edit('v',20);check(/^1\s*fish/.test(vals()[1]),'exact twenty-gallon boundary');check(/Room for 1 fancy goldfish/.test(msg()),'boundary verdict');
   go('heater');edit('v',30.283294272);edit('room',20);edit('target',20+50/9);edit('installed',33);check(/too small/.test(msg()),'33 W cannot satisfy 34 W estimate');
   go('fertilizer');edit('v',100);edit('rise',10);edit('fraction',50);edit('stock',1);edit('bottle',100);check(/^200\s*mL/.test(vals()[1]),'stock dose algebra');check(/more than the whole bottle/.test(msg()),'stock supply shortfall');
   go('drip');edit('v',.001);edit('size',20);edit('drops',1000);
   check(!/^0(?:\s|$)/.test(vals()[0]),'nonzero drip time');check(/less than 1 second/.test(document.querySelector('#result').textContent),'tiny duration helper does not claim zero seconds');
   go('heatup');for(const [k,v]of Object.entries({v:.01,start:25,target:26,power:1000,eff:100}))edit(k,v);
   check(/less than 1 min/.test(document.querySelector('.diagram').textContent),'tiny heat up time on chart');check(!/0 minutes/.test(document.querySelector('#result').textContent),'tiny heat up time is not zero');
   go('ato');edit('v',100);edit('daily',99);edit('days',1);check(!!document.querySelector('.error-card'),'evaporation beyond model blocked');
   go('co2');edit('ph',7);edit('kh',11);check(/above the usual 20–30 ppm/.test(msg()),'33 ppm must not claim within 20–30');edit('kh',8);check(/Right in the 20–30 ppm range/.test(msg()),'24 ppm is in range');
   go('tank');edit('shape','bowfront');edit('l',20);edit('w',10);edit('w2',10.0000001);edit('h',10);edit('fill',100);edit('displacement',0);
   check(!!document.querySelector('.primary-metric'),'very shallow bow supported');
   click('unit-us');click('unit-metric');check(near(stored().tank.w2,10.0000001),'unit changes retain bow measurement precision');
   check(document.documentElement.scrollWidth<=innerWidth+1,'no horizontal overflow');
   return n;
  });
  await p.locator('[data-category=all]').click();await p.locator('.tool-link[data-tool=nitrate]').click();
  await p.locator('#field-days').fill('30');await p.locator('#calculator').scrollIntoViewIfNeeded();
  const file=`${out}/nitrate-${width}.png`;await p.screenshot({path:file,fullPage:true});screenshots.push(file);
  await ctx.close();
 }
 assert.deepEqual(errors,[]);
 const report={base,checks,errors,screenshots};await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
