// Everyday-use checks: familiar starting examples, standard tanks, the added tank
// shapes, rule-of-thumb tools, specific gravity, and compatibility with settings
// saved by the first preview. Expected values are worked independently of the
// implementation formulas.
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,categories,defaults,calculate,convert,migrateInputs,isVisible,labelFor,popular,sgFromPpt,pptFromSg,GAL,PROFILE_DEFAULT} from '../../aquarium-toolbox/calculators.mjs';
import {fieldChoices,formPresets,standardTanks,extraHelp} from '../../aquarium-toolbox/presets.mjs';
import {sliderWindow} from '../../aquarium-toolbox/sliders.mjs';
import {firstExamples,isFirstExample} from '../../aquarium-toolbox/legacy.mjs';
const calc=id=>calculators.find(c=>c.id===id);
const run=(id,values={},us=false)=>calculate(id,{...defaults(calc(id),us),...values});
const near=(actual,expected,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);
const IN=2.54;

test('US starting examples are round numbers a hobbyist would recognise',()=>{
  for(const c of calculators){
    const a=defaults(c,true);
    for(const f of c.fields.filter(f=>!f.options&&!f.profile)){
      const shown=convert(a[f.key],f.displayUnit||f.unit,true);
      // Package litres (a 9 L bag) and the 20 lb bag stay exact in their own units.
      if(c.id==='substrate'&&f.key==='bag'){assert.equal(a.bag,9);continue;}
      assert.ok(Math.abs(shown-Number(shown.toFixed(3)))<1e-9,`${c.id}.${f.key} shows ${shown}`);
      assert.ok(a[f.key]>=f.min&&a[f.key]<=f.max,`${c.id}.${f.key} outside its range`);
    }
    assert.ok(calculate(c.id,a,true).metrics.length>0,c.id);
  }
  near(PROFILE_DEFAULT.us/GAL,20);assert.equal(PROFILE_DEFAULT.metric,100);
  const tank=defaults(calc('tank'),true);near(tank.l/IN,24);near(tank.w/IN,12);near(tank.h/IN,16);
  // A 20-gallon-high tank: 24 × 12 × 16 in = 4,608 cubic inches = 19.9 US gal brim-full.
  near(run('tank',{fill:100,displacement:0},true).metrics[0].value/GAL,4608/231);
});

test('Hexagon, corner and bow-front tanks use their own geometry',()=>{
  const base={h:10,fill:100,displacement:0};
  // Regular hexagon 20 cm across the flats: area = (√3 ÷ 2) × 20² = 346.41 cm².
  near(run('tank',{...base,shape:'hexagon',l:20}).metrics[0].value,3.4641016151);
  // Quarter-circle corner tank with 20 cm sides: π × 20² ÷ 4 = 314.16 cm².
  near(run('tank',{...base,shape:'corner',l:20}).metrics[0].value,Math.PI);
  // A bow as deep as half the length is a half-circle: 20 × 10 rectangle + half of π × 10².
  near(run('tank',{...base,shape:'bowfront',l:20,w:10,w2:20}).metrics[0].value,2+Math.PI/2);
  // A flat "bow" is just the rectangle, and a shallow bow adds a little.
  near(run('tank',{...base,shape:'bowfront',l:20,w:10,w2:10}).metrics[0].value,2);
  const shallow=run('tank',{...base,shape:'bowfront',l:20,w:10,w2:12}).metrics[0].value;assert.ok(shallow>2&&shallow<2.4);
  // 36-gallon bow-front: about 30 in long, 12 in at the ends, 15.5 in at the center, 21 in tall.
  const bow=run('tank',{...base,shape:'bowfront',l:30*IN,w:12*IN,w2:15.5*IN,h:21*IN}).metrics[0].value/GAL;assert.ok(bow>37&&bow<40,`bow-front ${bow}`);
  assert.throws(()=>run('tank',{shape:'bowfront',l:20,w:12,w2:10}),/deepest in the middle/);
  assert.throws(()=>run('tank',{shape:'bowfront',l:20,w:10,w2:25}),/half-circle/);
  // A width that does not apply to the chosen shape cannot change the answer.
  near(run('tank',{...base,shape:'hexagon',l:20,w:999,w2:1}).metrics[0].value,3.4641016151);
});

test('Only the measurements that apply are shown, with labels that match the shape',()=>{
  const t=calc('tank'),l=t.fields.find(f=>f.key==='l'),w=t.fields.find(f=>f.key==='w');
  assert.equal(isVisible('tank','w',{shape:'cylinder'}),false);assert.equal(isVisible('tank','w',{shape:'hexagon'}),false);assert.equal(isVisible('tank','w2',{shape:'rectangle'}),false);
  assert.equal(isVisible('tank','w2',{shape:'bowfront'}),true);assert.equal(isVisible('tank','h',{shape:'corner'}),true);
  assert.equal(labelFor('tank',l,{shape:'cylinder'}),'Inside diameter');assert.equal(labelFor('tank',l,{shape:'rectangle'}),'Inside length');assert.match(labelFor('tank',l,{shape:'hexagon'}),/flat sides/);assert.equal(labelFor('tank',w,{shape:'bowfront'}),'Width at the ends');
  assert.equal(isVisible('substrate','density',{material:'gravel',bagMode:'weight'}),false);assert.equal(isVisible('substrate','density',{material:'custom',bagMode:'weight'}),true);
  assert.equal(isVisible('label','bottle',{unit:'tsp'}),false);assert.equal(isVisible('label','bottle',{unit:'mL'}),true);
});

test('Range messages use the label the visitor actually sees',()=>{
  const t=calc('tank');
  assert.throws(()=>calculate('tank',{...defaults(t),shape:'cylinder',l:-1},true),/Inside diameter must be between .* in\./);
  assert.throws(()=>calculate('adjust',{...defaults(calc('adjust')),target:-5},true,true),/between 1 and 1\.0754 specific gravity/);
  assert.throws(()=>calculate('adjust',{...defaults(calc('adjust')),target:-5},true,false),/between 0 and 100 ppt/);
});

test('Standard tank choices fill real sizes and stay inside every field range',()=>{
  assert.equal(standardTanks.length,14);
  for(const us of [true,false])for(const id of ['tank','substrate','stocking','weight','sump']){
    const c=calc(id),preset=formPresets(c,us);assert.ok(preset.options.length>=10,id);
    for(const option of preset.options){
      for(const [key,value]of Object.entries(option.values)){const f=c.fields.find(f=>f.key===key);assert.ok(f,`${id}.${key}`);if(f.options)assert.ok(f.options.some(o=>o[0]===value));else assert.ok(value>=f.min&&value<=f.max,`${id}.${key}`);}
      assert.ok(calculate(id,{...defaults(c,us),...option.values},us).metrics.length>0);
    }
  }
  assert.equal(formPresets(calc('change'),true),null);assert.equal(formPresets(calc('glass'),true),null);
  // Each standard tank's brim-full inside volume is close to its advertised size.
  const options=formPresets(calc('tank'),true).options;
  standardTanks.forEach(([name,gallons],i)=>{const brim=run('tank',{...options[i].values,fill:100,displacement:0}).metrics[1].value/GAL;assert.ok(brim>gallons*.9&&brim<gallons*1.16,`${name}: ${brim.toFixed(1)} gal`);});
  // A "55" is 48¼ × 12¾ × 21 in outside; with ¼ in glass it holds about 51 gallons to the brim.
  const fifty=options.find(o=>o.label.startsWith('55 gallon'));near(fifty.values.l/IN,47.75);near(fifty.values.w/IN,12.25);
  near(run('tank',{...fifty.values,fill:100,displacement:0}).metrics[1].value/GAL,47.75*12.25*20.25/231,1e-9);
  // Published empty weights: 10 gal = 11 lb, 55 gal = 78 lb, 75 gal = 98 lb, 125 gal = 177 lb.
  const weights=formPresets(calc('weight'),true).options;
  for(const [name,lb]of [['10 gallon',11],['55 gallon',78],['75 gallon',98],['125 gallon',177]])near(convert(weights.find(o=>o.label.startsWith(name)).values.glass,'kg',true),lb);
  // A filled 55 works out near the maker's 625 lb: 55 gal of water (459 lb) + 78 lb of glass + gravel.
  const full=run('weight',{...weights.find(o=>o.label.startsWith('55 gallon')).values,stand:0,rock:25,gear:5}).metrics[0].value;near(convert(full,'kg',true),55*8.345404+78+convert(30,'kg',true),1e-4);
  assert.match(formPresets(calc('tank'),false).options[2].label,/54 L · 60 × 30 × 30 cm/);
});

test('Heater size follows published sizing charts',()=>{
  const size=(gal,riseF)=>run('heater',{v:gal*GAL,room:20,target:20+riseF/1.8,installed:0});
  // Next common size at or above 0.85 × gallons^(2/3) × °F rise.
  for(const [gal,rise,watts]of [[5,9,25],[10,10,50],[10,18,75],[20,10,75],[20,15,100],[30,10,100],[40,10,100],[40,18,200],[55,10,150],[55,15,200],[75,10,200],[75,18,300]])assert.equal(size(gal,rise).metrics[0].value,watts,`${gal} gal +${rise} °F`);
  near(size(20,10).metrics[1].value,.85*20**(2/3)*10);
  // Small tanks need more watts per gallon than big ones.
  assert.ok(size(10,10).metrics[2].value>size(75,10).metrics[2].value);
  // No heater when the room is already warm enough, and several heaters for very large needs.
  assert.equal(run('heater',{room:26,target:25}).metrics[0].value,0);assert.match(run('heater',{room:26,target:25}).message,/does not need a heater/);
  const big=size(300,20);assert.ok(big.metrics[1].value>300);assert.equal(big.metrics[0].value%2,0);assert.match(big.message,/Use \d heaters of about \d+ W each/);assert.ok(big.metrics[0].value>=big.metrics[1].value);
  assert.match(size(75,18).message,/two heaters of half the wattage/);
  assert.match(run('heater',{v:20*GAL,room:20,target:30,installed:50}).message,/too small/);assert.match(run('heater',{v:20*GAL,room:20,target:30,installed:150}).message,/should cope/);assert.match(run('heater',{v:5*GAL,room:20,target:25,installed:300}).message,/far bigger than needed/);
});

test('Filter flow is judged against the usual range for the kind of tank',()=>{
  const flow=(kind,gph,gal=20)=>run('turnover',{v:gal*GAL,flow:gph*GAL,kind});
  // Filter makers suggest 4–6 tank volumes an hour for a community tank: 80–120 GPH on 20 gallons.
  const r=flow('community',100);near(r.metrics[0].value,5);near(r.metrics[1].value/GAL,80);near(r.metrics[2].value/GAL,120);assert.match(r.message,/Right in the usual range of 4–6/);
  assert.match(flow('community',40).message,/below the usual 4–6/);assert.match(flow('community',300).message,/More than the usual 4–6/);
  near(flow('messy',100).metrics[2].value/GAL,200);near(flow('softreef',100,50).metrics[1].value/GAL,1000);near(flow('sps',100,50).metrics[2].value/GAL,2000);near(flow('return',100,50).metrics[1].value/GAL,150);
  assert.match(flow('sps',100,50).message,/powerhead/);assert.match(flow('return',100,50).message,/return pump/);
});

test('Stocking check applies the classic volume and surface rules',()=>{
  const stock=(gal,l,w,kind,size,count)=>run('stocking',{v:gal*GAL,l:l*IN,w:w*IN,kind,size:size*IN,count});
  // 20 gallons, 24 × 12 in: one inch per gallon allows 20 in; 288 sq in ÷ 12 allows 24 in.
  let r=stock(20,24,12,'tropical',1.5,10);near(r.metrics[0].value,75);near(r.metrics[1].value/IN,15);near(r.metrics[2].value/IN,20);assert.equal(r.metrics[3].value,3);assert.match(r.message,/Comfortably stocked/);
  assert.match(stock(20,24,12,'tropical',1.5,6).message,/Lightly stocked/);assert.match(stock(20,24,12,'tropical',1.5,15).message,/Right at the limit/);assert.match(stock(20,24,12,'tropical',1.5,20).message,/Overstocked by both/);assert.equal(stock(20,24,12,'tropical',1.5,20).metrics[3].value,0);
  // 40 breeder (36 × 18 in) with fancy goldfish: 40 ÷ 3 = 13.3 in by volume, 648 ÷ 30 = 21.6 in by surface.
  r=stock(40,36,18,'goldfish',6,2);near(r.metrics[2].value/IN,40/3);near(r.graphic.values[2]/IN,21.6);assert.match(r.message,/20 gallons \(75 L\) for the first fish/);
  // 75 gallons (48 × 18 in) of saltwater: 15 in by volume, 18 in by surface.
  r=stock(75,48,18,'marine',3,4);near(r.metrics[2].value/IN,15);near(r.graphic.values[2]/IN,18);near(r.metrics[0].value,80);
  // Big fish get an explicit warning that the rule breaks down.
  assert.match(stock(55,48,13,'tropical',8,2).message,/minimum tank size recommended for the species/);assert.doesNotMatch(stock(20,24,12,'tropical',2,5).message,/minimum tank size/);
  assert.equal(stock(20,24,12,'tropical',2,0).metrics[0].value,0);
});

test('Specific gravity and ppt agree with the standard seawater table at 77 °F',()=>{
  for(const [ppt,sg]of [[0,1],[30,1.0226],[33,1.0249],[34,1.0256],[35,1.0264],[36,1.0271]])assert.ok(Math.abs(sgFromPpt(ppt)-sg)<.00006,`${ppt} ppt`);
  for(const ppt of [0,5,26.5,35,40])near(pptFromSg(sgFromPpt(ppt)),ppt,1e-9);
  const r=run('sg',{value:pptFromSg(1.025)});near(r.metrics[0].value,1.025);near(r.metrics[1].value,33.156,1e-4);assert.equal(r.metrics[1].raw,true);
  for(const sg of [true,false])for(const id of ['salt','adjust','sg','ato']){const c=calc(id);for(const f of c.fields.filter(f=>f.unit==='ppt')){const choice=fieldChoices(c,f,true,defaults(c),sg);if(!choice)continue;for(const o of choice.options){assert.ok(o.value>=f.min&&o.value<=f.max,`${id}.${f.key}`);assert.match(o.label,sg?/1\.0\d\d/:/ppt/);}}}
  near(fieldChoices(calc('salt'),calc('salt').fields.find(f=>f.key==='target'),true,{},true).options[2].value,pptFromSg(1.025));
});

test('Salt mixing scales with the salinity wanted and reports cups as a rough guide',()=>{
  // Five US gallons at 5 oz per gallon is 25 oz of salt mix for full-strength seawater.
  const full=run('salt',{v:5*GAL,recipe:convert(5,'g/L',false),target:35,bag:convert(25,'bulk-g',false)});near(convert(full.metrics[0].value,'bulk-g',true)*16,25);near(full.metrics[1].value/GAL,80);near(full.metrics[2].value,25*28.349523125/285);
  // A fish-only 1.020 (26.5 ppt) batch needs proportionally less salt, so the bag goes further.
  const low=run('salt',{v:5*GAL,recipe:convert(5,'g/L',false),target:26.5,bag:convert(25,'bulk-g',false)});near(low.metrics[0].value/full.metrics[0].value,26.5/35);near(low.metrics[1].value/full.metrics[1].value,35/26.5);
  assert.throws(()=>run('salt',{target:0}));
});

test('Product doses scale in whatever unit the label uses',()=>{
  // "5 mL treats 50 gallons" on a 20-gallon tank is 2 mL; a 250 mL bottle then holds 125 doses.
  const ml=run('label',{v:20*GAL,unit:'mL',dose:5,labelV:50*GAL,bottle:250});near(ml.metrics[0].value,2);assert.equal(ml.metrics[0].unit,'mL');assert.equal(ml.metrics[0].kitchen,true);assert.equal(ml.metrics[1].value,125);
  // "1 tablespoon per 5 gallons" on 20 gallons is 4 tablespoons, with no bottle count.
  const spoon=run('label',{v:20*GAL,unit:'tbsp',dose:1,labelV:5*GAL});near(spoon.metrics[0].value,4);assert.equal(spoon.metrics[0].unit,'tbsp');assert.equal(spoon.metrics.length,1);
  assert.throws(()=>run('label',{unit:'gallons'}));
});

test('Return-pump head counts elbows and valves instead of asking for coefficients',()=>{
  const head=extra=>run('head',extra).metrics;
  const none=head({e90:0,e45:0,valves:0,checks:0})[2].value,elbow=head({e90:1,e45:0,valves:0,checks:0})[2].value,check=head({e90:0,e45:0,valves:0,checks:1})[2].value,many=head({e90:6,e45:2,valves:2,checks:1})[2].value;
  // Loss coefficients: inlet + outlet 1.5, 90° elbow 0.9, check valve 2.
  near(elbow/none,2.4/1.5);near(check/none,3.5/1.5);near(many/none,(1.5+6*.9+2*.4+2*.2+2)/1.5);
  // With no flow the only head is the vertical lift.
  near(run('head',{flow:0,lift:1.5}).metrics[0].value,1.5);
  assert.ok(head({diameter:19})[0].value>head({diameter:32})[0].value);
  assert.equal(calc('head').fields.some(f=>['k','rough'].includes(f.key)),false);
});

test('Ammonia guidance follows the common free-ammonia scale',()=>{
  // Reference conversion: 3.6 ppm total ammonia in fresh water at pH 7.0 and 77 °F is about 0.02 ppm free ammonia.
  near(run('ammonia',{tan:3.6,basis:'NH3',ph:7,temp:25}).metrics[0].value,.0203,.02);
  assert.equal(defaults(calc('ammonia')).basis,'NH3');
  const message=(tan,ph)=>run('ammonia',{tan,basis:'NH3',ph,temp:25}).message;
  assert.match(message(0,7),/No ammonia detected/);assert.match(message(.5,7),/toxic share is low/);assert.match(message(1,8),/Harmful to most fish/);assert.match(message(.5,8),/stress fish over time/);assert.match(message(4,8.2),/Dangerous/);
  // The toxic share rises steeply with pH: about tenfold per pH unit at low pH.
  const share=ph=>run('ammonia',{tan:1,ph,temp:25}).metrics[1].value;assert.ok(share(7.5)/share(6.5)>9);assert.ok(share(8.5)>share(7.5));
});

test('Drip timer, RO units and small pours use everyday units',()=>{
  // 3 drops a second at 20 drops per mL is 9 mL a minute; two cups (473 mL) takes about 53 minutes.
  const drip=run('drip',{},true);near(drip.metrics[1].value,9);near(drip.metrics[0].value,2*236.5882365/9);assert.equal(drip.metrics[0].unit,'minutes');
  near(convert(GAL/16,'cup',true),1);near(convert(75,'gpd',false),75*GAL/24);
  // A 75 GPD unit fills 20 gallons in 6.4 hours and, at 4 : 1, sends 80 gallons to the drain.
  const ro=run('ro',{},true);near(ro.metrics[0].value,6.4);near(ro.metrics[1].value/GAL,80);near(ro.metrics[2].value/GAL,100);
  const choice=fieldChoices(calc('ro'),calc('ro').fields.find(f=>f.key==='rate'),true,{});near(choice.options[1].value,75*GAL/24);assert.equal(choice.options[1].label,'75 GPD');
});

test('Settings and links saved by the first preview still load and calculate',()=>{
  for(const [id,saved]of Object.entries(firstExamples)){
    const c=calc(id);assert.ok(c,id);const a=migrateInputs(id,saved),clean={};
    for(const f of c.fields){assert.notEqual(a[f.key],undefined,`${id}.${f.key} missing after upgrade`);clean[f.key]=a[f.key];}
    assert.ok(calculate(id,clean).metrics.every(m=>Number.isFinite(m.value)),id);
  }
  // Quantities the visitor entered keep their meaning.
  near(calculate('tank',migrateInputs('tank',firstExamples.tank)).metrics[0].value,95.76);
  near(calculate('salt',migrateInputs('salt',firstExamples.salt)).metrics[0].value,1520);
  assert.equal(migrateInputs('weight',{...firstExamples.weight,density:1.023}).water,'salt');assert.equal(migrateInputs('weight',firstExamples.weight).water,'fresh');
  assert.equal(migrateInputs('substrate',firstExamples.substrate).material,'gravel');assert.equal(migrateInputs('substrate',{...firstExamples.substrate,density:1.6}).material,'custom');
  near(calculate('substrate',migrateInputs('substrate',{...firstExamples.substrate,density:1.6})).metrics[1].value,14*1.6);
  assert.equal(migrateInputs('tank',null),null);assert.equal(migrateInputs('tank',undefined),undefined);
});

test('Only an untouched first-preview example is ever replaced',()=>{
  assert.equal(isFirstExample('tank',firstExamples.tank),true);assert.equal(isFirstExample('tank',{...firstExamples.tank,l:81}),false);assert.equal(isFirstExample('tank',{...firstExamples.tank,extra:1}),true);
  assert.equal(isFirstExample('change',{...firstExamples.change,v:55},['v']),true);assert.equal(isFirstExample('change',{...firstExamples.change,v:55}),false);
  assert.equal(isFirstExample('stocking',{}),false);assert.equal(isFirstExample('tank',null),false);assert.equal(isFirstExample('tank',{}),false);
});

test('Everyday tools lead the library and every tool can be found in plain words',()=>{
  assert.equal(calculators.length,38);
  assert.deepEqual(popular.slice(0,4),['tank','substrate','change','label']);for(const id of popular)assert.ok(calc(id),id);assert.equal(new Set(popular).size,popular.length);
  for(const id of popular)assert.equal(calc(id).advanced,false,id);
  for(const c of calculators){assert.ok(categories.some(x=>x[0]===c.category),c.id);assert.ok(c.keywords.length>3,`${c.id} keywords`);assert.ok(c.description.length>20&&c.description.length<110,`${c.id} description`);}
  const find=words=>calculators.filter(c=>words.split(' ').every(w=>[c.title,c.description,c.keywords,...c.fields.map(f=>f.label)].join(' ').toLowerCase().includes(w))).map(c=>c.id);
  assert.ok(find('gravel').includes('substrate'));assert.ok(find('how many fish').includes('stocking'));assert.ok(find('dechlorinator').includes('label'));assert.ok(find('heater').includes('heater'));assert.ok(find('gph').includes('turnover'));assert.ok(find('specific gravity').includes('sg'));assert.ok(find('bowfront').includes('tank'));
  // Plain-language labels: no engineering jargon left in what the visitor reads.
  for(const c of calculators)for(const f of c.fields)assert.doesNotMatch(f.label,/coefficient|roughness|Reynolds|diluent|tariff|steady-state|concentration/i,`${c.id}.${f.key}`);
  for(const c of calculators)for(const f of c.fields){const help=extraHelp(c,f);assert.equal(typeof help,'string');}
});

test('Quick picks added for everyday use stay inside their fields and name real sizes',()=>{
  const choice=(id,key,us=true,sg=false)=>fieldChoices(calc(id),calc(id).fields.find(f=>f.key===key),us,defaults(calc(id),us),sg);
  near(choice('head','diameter').options[2].value,1.029*25.4);assert.equal(choice('head','diameter').options[2].label,'1 in pipe');assert.equal(choice('pipe','diameter',false).options[3].label,'25 mm');
  near(choice('heater','room').options[2].value,20);near(choice('heater','target').options[1].value,(78-32)/1.8);
  near(choice('stocking','size').options[1].value,1.5*IN);assert.match(choice('stocking','size').options[1].label,/neon tetra/);
  near(choice('drip','v').options[1].value,GAL/8);assert.equal(choice('tank','fill').options[1].value,95);assert.equal(choice('tank','displacement').options[0].value,0);
  near(choice('fertilizer','fraction').options[0].value,61.3);
  // Pure-compound nutrient shares: NO₃ in KNO₃ = 62.004 ÷ 101.102; PO₄ in KH₂PO₄ = 94.971 ÷ 136.084; K in K₂SO₄ = 78.196 ÷ 174.26; Mg in MgSO₄·7H₂O = 24.305 ÷ 246.47.
  for(const [i,share]of [[0,62.004/101.102],[1,94.971/136.084],[2,78.196/174.26],[3,24.305/246.47]])near(choice('fertilizer','fraction').options[i].value,share*100,.002);
  // Slider windows cover the starting examples in specific-gravity mode too.
  for(const id of ['salt','adjust','salinity','sg','ato'])for(const f of calc(id).fields.filter(f=>f.unit==='ppt')){const r=sliderWindow(calc(id),f,defaults(calc(id),true),true,true);assert.ok(r.value>=r.min&&r.value<=r.max,`${id}.${f.key}`);}
});
