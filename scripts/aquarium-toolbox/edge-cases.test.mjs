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
test('Stocking gives every kind of fish a useful, honest answer',()=>{
 // Small community fish: 20 US gal, 24 × 12 in, ten 1.5 in fish = 15 in against 20 (volume) and 24 (surface): 75%, 13 allowed.
 const IN=2.54;let r=run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:10});
 near(r.metrics[0].value,75);assert.equal(r.metrics[2].value,13);assert.match(r.message,/Comfortably stocked by the classic rules of thumb, with room for about 3 more fish of this size/);assert.equal(r.graphic.status,'ok');
 // The count, the percentage and the words agree at the limit: 13 fit, 14 do not.
 r=run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:13});assert.match(r.message,/Fully stocked/);assert.equal(r.graphic.status,'ok');assert.doesNotMatch(r.message,/room for/);
 r=run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:14});assert.match(r.message,/Over the stricter of the two rules of thumb \(the gallon rule\)/);assert.equal(r.graphic.status,'high');
 r=run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:5});assert.match(r.message,/Lightly stocked.*room for about 8 more/);
 r=run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:20});assert.match(r.message,/Overstocked by both/);assert.equal(r.graphic.status,'high');
 assert.match(run('stocking',{kind:'tropical',v:20*GAL,l:24*IN,w:12*IN,size:1.5*IN,count:0}).message,/about 13 fish of this size would fit/);
 // Fancy goldfish (Aquarium Co-Op): 20 US gal for the first and 10 for each one after.
 r=run('stocking',{kind:'goldfish',v:20*GAL,count:3});near(r.metrics[0].value/GAL,40);assert.equal(r.metrics[1].value,1);assert.match(r.message,/Too small for 3 fancy goldfish by the usual guideline; it suits 1/);assert.equal(r.graphic.status,'low');assert.equal(r.graphic.valueUnit,'L');
 r=run('stocking',{kind:'goldfish',v:55*GAL,count:4});near(r.metrics[0].value/GAL,50);assert.equal(r.metrics[1].value,4);assert.match(r.message,/Room for 4 fancy goldfish by the usual guideline/);assert.equal(r.graphic.status,'ok');
 assert.equal(run('stocking',{kind:'goldfish',v:15*GAL,count:1}).metrics[1].value,0);
 // No goldfish entered: say how many the tank suits instead of asking for a 0-gallon tank.
 r=run('stocking',{kind:'goldfish',v:40*GAL,count:0});assert.equal(r.metrics.length,2);assert.equal(r.metrics[0].value,3);assert.match(r.message,/this tank suits 3 fancy goldfish/);near(r.graphic.values[0]/GAL,20);
 // Saltwater: a cautious 1 in per 5 US gal, and no inch rule at all for big fish.
 r=run('stocking',{kind:'marine',v:40*GAL,size:3*IN,count:2});near(r.metrics[0].value,75);assert.equal(r.metrics[2].value,2);assert.match(r.message,/1 inch of adult fish per 5 gallons/);assert.equal(r.graphic.values.length,2);
 // A 4 in fish gets the same answer whether it was entered as 4 in or as 10 cm.
 for(const size of [4*IN,10]){r=run('stocking',{kind:'marine',v:75*GAL,size,count:3});assert.equal(r.metrics.length,3,'4 in / 10 cm is still within the inch rule');assert.equal(r.metrics[2].value,size>10?3:3);}
 assert.equal(run('stocking',{kind:'marine',v:75*GAL,size:4.5*IN,count:2}).metrics.length,2);
 for(const kind of ['tropical','marine']){r=run('stocking',{kind,size:15,count:3});assert.equal(r.metrics.length,2);assert.doesNotMatch(r.message,/Comfortably|room for/);assert.ok(!('status' in r.graphic));}
 // Inputs that do not apply are hidden.
 assert.equal(isVisible('stocking','size',{kind:'goldfish'}),false);assert.equal(isVisible('stocking','l',{kind:'marine'}),false);assert.equal(isVisible('stocking','w',{kind:'tropical'}),true);
});
test('Choices and instructions match the selected unit and fish type',()=>{
 const c=calculators.find(c=>c.id==='stocking'),f=c.fields.find(f=>f.key==='size'),labels=(kind,us=true)=>fieldChoices(c,f,us,{kind}).options.map(o=>o.label).join(' | ');
 assert.match(labels('marine'),/clownfish/);assert.doesNotMatch(labels('marine'),/tetra|goldfish/);assert.doesNotMatch(labels('tropical'),/goldfish|clownfish/);
 assert.match(labels('tropical',false),/^2\.5 cm · ember tetra/);near(fieldChoices(c,f,true,{kind:'tropical'}).options[1].value,1.5*2.54);
 assert.match(extraHelp({id:'label'},{key:'dose'},{unit:'tablets'},true),/1 tablet treats 10 gallons/);assert.match(extraHelp({id:'label'},{key:'dose'},{unit:'mL'},false),/5 mL treats 40 litres/);
 assert.match(formPresets({id:'weight'},false).note,/Enter your tank’s actual empty weight separately/);
 assert.match(run('label',{unit:'tablets',dose:1,v:10,labelV:40}).message,/not a whole number of tablets; most labels say not to split them/);assert.match(run('label').message,/scaled to your water/);
 // A fraction is only mentioned when there is one, and the advice fits the unit.
 assert.doesNotMatch(run('label',{unit:'tablets',dose:1,v:40,labelV:40}).message,/whole number/);assert.match(run('label',{unit:'drops',dose:3,v:10,labelV:40}).message,/measure as closely as you can/);
 assert.match(run('label',{unit:'g'}).message,/small scale/);assert.match(run('label',{unit:'tsp'}).message,/measuring spoon/);assert.match(run('label',{unit:'mL'}).message,/syringe/);
 // Container notes fit what each field means.
 for(const [id,key,note] of [['fertilizer','bottle',/finished volume/],['stock','final',/end up with/],['label','bottle',/left/],['doser','reserve',/left/]]){const t=calculators.find(c=>c.id===id);assert.match(fieldChoices(t,t.fields.find(f=>f.key===key),true,defaults(t)).note,note);}
 // Wattage shortcuts suit the equipment.
 const en=calculators.find(c=>c.id==='energy'),w=key=>fieldChoices(en,en.fields.find(f=>f.key===key),true,defaults(en));
 assert.match(w('lights').title,/lights/);assert.match(w('pumps').title,/pumps/);assert.equal(w('other'),null);
});
test('RO low rejection, water-cost illustration and pump graph reflect actual inputs',()=>{
 assert.match(run('ro',{feed:250,product:250}).message,/Below the 96–99%/);assert.match(run('ro',{feed:250,product:5}).message,/A healthy result/);
 assert.equal(run('watercost',{salt:0}).graphic.kind,'fresh');assert.equal(run('watercost',{salt:38}).graphic.kind,'salt');
 near(run('pump',{h1:1,h2:3,head:1.2}).graphic.positions[1],.1);
});
test('Figures name what they show and stay readable',()=>{
 // Drip timer and CO2 cylinder are not product doses.
 const drip=run('drip');assert.equal(drip.graphic.caption,'Drip time');assert.equal(drip.graphic.amount,Math.round(drip.metrics[0].value));assert.equal(drip.metrics[0].digits,0);
 const cyl=run('co2cylinder');assert.equal(cyl.graphic.unit,'kg');near(cyl.metrics[1].value,1.2);assert.match(illustration(cyl.graphic,'',true),/2\.65/);assert.match(illustration(cyl.graphic,'',true),/CO₂ left in the cylinder/);
 // Heat-up shows the time it takes, not an invented midpoint.
 const heat=run('heatup',{v:5*GAL,start:(60-32)/1.8,target:(78-32)/1.8,power:200,eff:80});assert.deepEqual(heat.graphic.labels,['Now','After 1 h 23 min']);assert.equal(heat.graphic.values.length,2);
 assert.deepEqual(run('heatup',{start:25,target:25}).graphic.labels,['Now','Now']);
 // Pump chart labels carry the chart heights; the visitor's point is always labelled.
 const pump=run('pump',{h1:3*.3048,q1:500*GAL,h2:6*.3048,q2:350*GAL,head:4.5*.3048});const svg=illustration({...pump.graphic},'',true);
 assert.match(svg,/>3 ft</);assert.match(svg,/>Yours · 4\.5 ft</);assert.match(svg,/>6 ft</);assert.match(svg,/Head height/);
 assert.match(illustration({...run('pump',{h1:1,h2:3,head:1.05}).graphic},'',false),/Yours · 1\.05 m/);
 // Units read the way hobbyists say them, with the period where it matters.
 assert.match(illustration(run('energy').graphic,'',true),/kWh per day/);assert.match(illustration(run('watercost').graphic,'',true),/\$ per month/);assert.match(illustration(run('watercost').graphic,'',true),/>\$0\.\d\d</);
 assert.match(illustration(run('change').graphic,'',true),/Before: 40 ppm/);assert.doesNotMatch(illustration(run('change').graphic,'',true),/mg\/L/);
 // Series and nitrate charts explain their axis.
 assert.equal(run('series').graphic.labels[0],'Start');assert.equal(run('series').graphic.axis,'Water changes');
 const nit=illustration(run('nitrate').graphic,'',false);assert.match(nit,/0 days/);assert.match(nit,/21 days/);assert.equal((nit.match(/svg-number/g)||[]).length,2);
 // One bar colour; the visitor's bar is green when fine and orange when not.
 const flow=v=>illustration(run('turnover',{v:125*GAL,flow:v*GAL,kind:'sps'}).graphic,'',true);assert.match(flow(2000),/#e07a3f/);assert.match(flow(4500),/#3fa66b/);assert.doesNotMatch(flow(4500),/#87c4ae/);
 // A glass estimate draws an empty tank with its outside size, not a 0% water level.
 const glass=illustration(run('glass').graphic,'',true);assert.doesNotMatch(glass,/>0%</);assert.match(glass,/Outside size/);
 // Weight shows every entry on its own bar; the toxic share of ammonia is drawn as a warning.
 assert.deepEqual(run('weight').graphic.labels,['Water','Tank','Stand','Rock & sand','Gear']);assert.match(illustration(run('ammonia').graphic,'',true),/#e07a3f/);
 // Chart numbers at hobby precision.
 assert.match(illustration({type:'bars',values:[166.91,25.31,4.567]},'',false),/>167<.*>25\.3<.*>4\.57</s);
});
