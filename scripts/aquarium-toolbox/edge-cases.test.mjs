import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,calculate,defaults,convert,GAL,isVisible} from '../../aquarium-toolbox/calculators.mjs';
import {sliderWindow,sliderValue} from '../../aquarium-toolbox/sliders.mjs';
import {fieldChoices,formPresets,extraHelp} from '../../aquarium-toolbox/presets.mjs';
import {illustration} from '../../aquarium-toolbox/illustrations.mjs';
const run=(id,values={})=>calculate(id,{...defaults(calculators.find(c=>c.id===id)),...values});
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const finiteTree=x=>{if(typeof x==='number')assert.ok(Number.isFinite(x));else if(x&&typeof x==='object')Object.values(x).forEach(finiteTree);};
// Full selector cross-product, not just the first choice (substrate has eight modes,
// hardness has six, and each produces a different set of controls/units).
function selections(c,a=defaults(c),i=0){const f=c.fields.filter(f=>f.options);if(i===f.length)return [a];return f[i].options.flatMap(([v])=>selections(c,{...a,[f[i].key]:v},i+1));}
for(const c of calculators)test(`${c.id}: all selection combinations, bounds, invalid inputs and slider endpoints`,()=>{
 for(const a of selections(c)){
  const incompatible=c.id==='hardness'&&a.kind==='gh'&&a.unit==='meq';
  if(incompatible){assert.throws(()=>calculate(c.id,a),/alkalinity/);continue;}
  finiteTree(calculate(c.id,a));
  for(const us of [true,false])for(const f of c.fields.filter(f=>!f.options)){
   const w=sliderWindow(c,f,a,us,false);finiteTree(w);assert.ok(w.max>w.min,`${c.id}.${f.key}`);
   for(const end of [w.min,w.max]){const value=sliderValue(end,w);assert.ok(value>=w.domainMin-1e-8&&value<=w.domainMax+1e-8,`${c.id}.${f.key} slider escapes domain`);}
   near(convert(convert(a[f.key],f.displayUnit||f.unit,true),f.displayUnit||f.unit,false),a[f.key]);
   for(const choice of fieldChoices(c,f,us,a)?.options||[]){assert.ok(choice.value>=f.min&&choice.value<=f.max,`${c.id}.${f.key} preset`);}
  }
 }
 for(const f of c.fields.filter(f=>!f.options)){
  for(const v of [NaN,Infinity,-Infinity,'2',null,undefined,f.min-1,f.max+1])assert.throws(()=>calculate(c.id,{...defaults(c),[f.key]:v}),`${c.id}.${f.key} rejects ${v}`);
  for(const v of [f.min,f.max,0]){
   let r;try{r=run(c.id,{[f.key]:v});}
   catch(e){assert.ok(e instanceof Error&&e.message.length>10,`${c.id}.${f.key}: clear domain/cross-field error`);assert.doesNotMatch(e.message,/undefined|TypeError|is not a function/);}
   if(r){finiteTree(r);assert.doesNotMatch(illustration(r.graphic,'',true),/NaN|Infinity/);}
  }
 }
});
test('zero evaporation, zero dose and reserve exhaustion produce finite honest results',()=>{
 const a=run('ato',{daily:0,days:365,reserve:0});near(a.metrics[0].value,0);assert.match(a.message,/no top-off/);assert.ok(!a.metrics.some(m=>m.label.includes('lasts')));
 assert.match(run('co2cylinder',{full:2,tare:2,reserve:0}).message,/refill now/);
 assert.match(run('doser',{daily:0}).message,/No dose/);
 assert.throws(()=>run('doser',{collected:.001,seconds:60,daily:100}),/24 hours/);
});
test('Sump distinguishes actual overflow from missing safety margin',()=>{
 // 100 x 50 cm and 2 cm fall = 10 L; 25% margin requires 12.5 L.
 const a={l:100,w:50,drop:2,pipe:0,margin:25};
 assert.match(run('sump',{...a,reserve:9}).message,/overflow is possible/);
 assert.match(run('sump',{...a,reserve:11}).message,/fits, but the safety margin does not/);
 assert.match(run('sump',{...a,reserve:12.5}).message,/fits on paper/);
 assert.equal(run('sump',{...a,reserve:11}).graphic.status,'low');
});
test('Heating and supplement instructions follow direction and selected chemistry',()=>{
 assert.match(run('heater',{room:30,target:25}).message,/cannot cool/);
 assert.match(run('heater',{room:25,target:25}).message,/No heating rise/);
 assert.match(run('heatup',{start:25,target:25}).message,/no heating time/);
 assert.match(run('supplement',{current:7,target:10,days:1}).message,/more than 1 dKH/);
 assert.doesNotMatch(run('supplement',{parameter:'mg/L',current:400,target:420}).message,/alkalinity|dKH/);
 assert.match(run('supplement',{current:8,target:8}).message,/no correction dose/);
});
test('Unit-aware charts and tiny numbers do not turn nonzero readings into zero',()=>{
 for(const id of ['series','nitrate','ammonia','change','co2'])assert.equal(run(id).graphic.valueUnit,'mg/L');
 assert.doesNotMatch(run('series',{current:.0001,fresh:0,pct:50,n:2}).table.at(-1)[1],/^0\.00 ppm$/);
 assert.equal(run('consumption',{parameter:'mg/L'}).graphic.valueUnit,'mg/L');
 assert.match(illustration({type:'bars',values:[.00005,0],labels:['trace','none']},'',false),/5\.000e-5/);
 assert.match(illustration({type:'bars',values:[0],labels:['none']},'',false),/height="0"/);
});
test('Equal source readings can be mixed only to that same target',()=>{
 const r=run('mix',{high:7,low:7,target:7,v:20});assert.equal(r.metrics[0].value,20);assert.match(r.message,/Any proportion/);
 assert.throws(()=>run('mix',{high:7,low:7,target:6}),/cannot reach/);
});
test('Count fields reject partial fish and fittings; glass must leave inside space',()=>{
 assert.throws(()=>run('stocking',{count:1.5}),/whole number/);
 for(const k of ['e90','e45','valves','checks'])assert.throws(()=>run('head',{[k]:.5}),/whole number/);
 assert.throws(()=>run('glass',{l:1,w:1,h:1,t:10}),/inside space/);
});
test('No stocking green-light or spare fish count for unsupported species',()=>{
 for(const values of [{kind:'marine'},{kind:'goldfish'},{kind:'tropical',size:30}]){
  const r=run('stocking',values);assert.equal(r.metrics.length,2);assert.match(r.message,/cannot give a reliable stocking limit/);
  assert.doesNotMatch(r.message,/Comfortably|room to add/);assert.ok(!r.metrics.some(m=>/limit|Room/.test(m.label)));
 }
 const r=run('stocking',{kind:'tropical',v:20*GAL,l:24*2.54,w:12*2.54,size:1.5*2.54,count:10});near(r.metrics[0].value,75);assert.match(r.message,/does not establish spare capacity/);
});
test('Choices and instructions match the selected unit and fish type',()=>{
 const c=calculators.find(c=>c.id==='stocking'),f=c.fields.find(f=>f.key==='size');
 assert.equal(fieldChoices(c,f,true,{kind:'marine'}),null);assert.equal(fieldChoices(c,f,true,{kind:'goldfish'}),null);
 assert.match(extraHelp({id:'label'},{key:'dose'},{unit:'tablets'}),/tablets/);
 assert.match(formPresets({id:'weight'},false).note,/Enter your tank’s actual empty weight separately/);
 assert.match(run('label',{unit:'tablets',dose:1,v:10,labelV:40}).message,/do not round up/);
});
test('RO low rejection, water-cost illustration and pump graph reflect actual inputs',()=>{
 assert.match(run('ro',{feed:250,product:250}).message,/below 95%/);
 assert.equal(run('watercost',{salt:0}).graphic.kind,'fresh');assert.equal(run('watercost',{salt:38}).graphic.kind,'salt');
 near(run('pump',{h1:1,h2:3,head:1.2}).graphic.positions[1],.1);
});
