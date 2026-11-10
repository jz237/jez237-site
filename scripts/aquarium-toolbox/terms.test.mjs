// The explanations shown when a visitor hovers or taps a rule or term in an answer (glossary.mjs).
// Jez, 2026-11-10: "What is the surface rule. All of these rules throughout the various calculators should
// have some sort of hover over with an explanation of what they are".
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,calculate,defaults,flowGuide,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {glossary,termsFor} from '../../aquarium-toolbox/glossary.mjs';
import {barScale} from '../../aquarium-toolbox/illustrations.mjs';
const calc=id=>calculators.find(c=>c.id===id);
// Every text a visitor can read in the answer area, across each option of the calculator.
function printed(c){
  const texts=new Set(),add=r=>{for(const m of r.metrics){texts.add(m.label);if(m.note)texts.add(m.note);}for(const l of r.graphic?.labels||[])texts.add(l);if(r.graphic?.caption)texts.add(r.graphic.caption);texts.add(r.message);};
  const variants=[{}];for(const f of c.fields.filter(f=>f.options))for(const o of f.options)variants.push({[f.key]:o[0]});
  for(const v of variants){try{add(calculate(c.id,{...defaults(c,true),...v},true));}catch{/* an option that needs other inputs */}}
  return [...texts];
}

test('Every explained phrase is one the calculator really prints, and no calculator id is misspelled',()=>{
  for(const [id,entries] of Object.entries(glossary)){
    const c=calc(id);assert.ok(c,id+' is a calculator');
    const texts=printed(c);
    for(const [phrase] of entries)assert.ok(texts.some(t=>t.includes(phrase)),`${id}: “${phrase}” appears in an answer`);
  }
});

test('Explanations are short plain text in both unit systems, with no leftover template values',()=>{
  let count=0;
  for(const c of calculators)for(const us of [true,false]){
    const options=[{}];for(const f of c.fields.filter(f=>f.options))for(const o of f.options)options.push({[f.key]:o[0]});
    for(const o of options)for(const [phrase,text] of termsFor(c.id,us,{...defaults(c,us),...o})){
      count++;
      assert.equal(typeof text,'string',`${c.id} ${phrase}`);
      assert.ok(text.length>=40&&text.length<=420,`${c.id} “${phrase}” length ${text.length}`);
      assert.doesNotMatch(text,/undefined|NaN|\[object|<|>|\$\{/,`${c.id} ${phrase}`);
      assert.match(text,/[.!]$/,`${c.id} “${phrase}” ends as a sentence`);
    }
  }
  assert.ok(count>300);
});

test('The stocking rules are explained with the numbers the calculator uses',()=>{
  const text=(phrase,us=true,a={})=>termsFor('stocking',us,{kind:'tropical',...a}).find(t=>t[0]===phrase)[1];
  assert.match(text('Gallon rule'),/1 inch of adult fish for every US gallon/);
  assert.match(text('Surface rule'),/1 inch of adult fish for every 12 square inches of water surface \(tank length × width\)/);
  assert.match(text('Surface rule',false),/about 1 cm of fish for every 30 cm²/);
  assert.match(text('rule-of-thumb limit'),/stricter of the gallon rule and the surface rule/);
  assert.match(text('rule-of-thumb limit',true,{kind:'marine'}),/5-gallon rule alone/);
  // 20 US gal, 24 × 12 in, ten 1 in fish: gallon rule 20 in, surface rule 24 in.
  const r=calculate('stocking',{v:20*GAL,l:24*2.54,w:12*2.54,kind:'tropical',size:2.54,count:10},true);
  assert.deepEqual(r.graphic.labels,['Your fish','Gallon rule','Surface rule']);
  assert.ok(Math.abs(r.graphic.values[1]/2.54-20)<1e-9);assert.ok(Math.abs(r.graphic.values[2]/2.54-24)<1e-9);
  assert.ok(Math.abs(2.54/(GAL)-1/1.49)<.01,'1 in per US gallon is about 1 cm per 1.5 L');
  assert.ok(Math.abs(12*2.54*2.54/2.54-30.48)<.01,'12 sq in per inch is about 30 cm² per cm');
  // Saltwater: 1 in per 5 gallons.
  const m=calculate('stocking',{v:50*GAL,l:90,w:45,kind:'marine',size:2.54,count:4},true);
  assert.ok(Math.abs(m.graphic.values[1]/2.54-10)<1e-9);assert.deepEqual(m.graphic.labels,['Your fish','5-gallon rule']);
});

test('The usual-flow explanation quotes the range for the chosen kind of tank',()=>{
  for(const [kind,[lo,hi]] of Object.entries(flowGuide)){
    const list=termsFor('turnover',true,{kind});
    for(const phrase of ['Usual low','Usual high','Usual low end for this tank','Usual high end for this tank'])assert.match(list.find(t=>t[0]===phrase)[1],new RegExp(`${lo}–${hi} times its water volume every hour`),kind);
  }
  assert.equal(termsFor('turnover')[0][0].length>=termsFor('turnover').at(-1)[0].length,true,'longest phrase first');
  assert.deepEqual(termsFor('not-a-tool'),[]);
});

test('Numbers quoted in other explanations match the calculators',()=>{
  const text=(id,phrase,us=true)=>termsFor(id,us,defaults(calc(id),us)).find(t=>t[0]===phrase)[1];
  // Heater: 0.85 × gallons^(2/3) × °F rise.
  const h=calculate('heater',{v:30*GAL,room:(65-32)*5/9,target:(78-32)*5/9,installed:0},true);
  assert.ok(Math.abs(h.metrics[1].value-.85*30**(2/3)*13)<1e-6);assert.match(text('heater','Estimated heat needed'),/0\.85 × \(US gallons\)\^⅔ × the °F/);
  assert.match(text('heater','Suggested heater size'),/25, 50, 75, 100, 150, 200, 250 or 300 W/);
  // CO₂: pH ±0.3 halves or doubles.
  const c=calculate('co2',{kh:4,ph:6.8},true);assert.ok(Math.abs(c.graphic.values[0]/c.graphic.values[1]-.5)<.01);assert.ok(Math.abs(c.graphic.values[2]/c.graphic.values[1]-2)<.01);
  assert.ok(Math.abs(c.metrics[0].value-3*4*10**.2)<1e-9);assert.match(text('co2','Estimated CO₂'),/3 × KH \(dKH\) × 10\^\(7 − pH\)/);
  // Ammonia as nitrogen: × 0.82.
  const a=calculate('ammonia',{tan:1,basis:'NH3',ph:8,temp:25},true);assert.ok(Math.abs(a.metrics[2].value/a.metrics[0].value-.8224)<.001);
  // Hardness: one degree = 17.85 ppm = 0.357 meq/L.
  const k=calculate('hardness',{kind:'alk',unit:'degree',value:1},true);assert.ok(Math.abs(k.metrics[1].value-17.848)<.01);assert.ok(Math.abs(k.metrics[2].value-.357)<.001);
  // Nitrate: settles at new-water nitrate + rise ÷ share changed.
  const n=calculate('nitrate',{rise:10,fresh:5,pct:25,days:7},true);assert.ok(Math.abs(n.metrics[0].value-45)<1e-9);assert.ok(Math.abs(n.metrics[1].value-35)<1e-9);
  // CO₂ cylinder: what is left does not subtract the reserve; time left does.
  const y=calculate('co2cylinder',{full:10,tare:8,daily:10,reserve:500},true);assert.ok(Math.abs(y.metrics[1].value-2)<1e-9);assert.ok(Math.abs(y.metrics[0].value-150)<1e-9);
  // Heat-up: 0.00245 kWh per US gallon per °F.
  const u=calculate('heatup',{v:10*GAL,start:20,target:25,power:100,eff:100,price:.2},true);assert.ok(Math.abs(u.metrics[1].value/(10*9)-.00245)<.00001);
  assert.match(text('substrate','Estimated dry weight'),/12\.5 lb per US gallon/);assert.match(text('substrate','Estimated dry weight',false),/1\.5 kg per litre/);
});

test('A rule far above the limiting one is cut short so the bars that matter stay readable',()=>{
  // 10 US gal of water entered with a very large surface: gallon rule 10 in, surface rule 158 in.
  const r=calculate('stocking',{v:10*GAL,l:48*2.54,w:39.5*2.54,kind:'tropical',size:1.13*2.54,count:10},true),g=r.graphic,inch=g.values.map(v=>v/2.54);
  assert.ok(Math.abs(inch[0]-11.3)<1e-9&&Math.abs(inch[1]-10)<1e-9&&Math.abs(inch[2]-158)<1e-9);
  assert.ok(Math.abs(g.scaleMax/2.54-1.6*11.3)<1e-9,'the scale is 1.6 times the larger of the fish and the limit');
  assert.equal(barScale(g,g.values),g.scaleMax);
  assert.ok(g.values[0]/g.scaleMax>=.5&&g.values[1]/g.scaleMax>=.5,'both deciding bars are at least half the chart height');
  // An ordinary tank keeps the plain scale, as do the other kinds.
  const plain=calculate('stocking',{v:20*GAL,l:24*2.54,w:12*2.54,kind:'tropical',size:2.54,count:10},true).graphic;
  assert.equal(plain.scaleMax,undefined);assert.equal(barScale(plain,plain.values),Math.max(...plain.values));
  for(const kind of ['goldfish','marine'])assert.equal(calculate('stocking',{...defaults(calc('stocking'),true),kind},true).graphic.scaleMax,undefined);
  assert.equal(barScale({},[3,9,4]),9);
});

test('The stocking check says so when the footprint and the water volume cannot be the same tank',()=>{
  const says=a=>calculate('stocking',{v:10*GAL,l:20*2.54,w:10*2.54,kind:'tropical',size:2.54,count:6,...a},true).message;
  assert.doesNotMatch(says({}),/Check the tank length and width/,'a real 10-gallon tank');
  assert.match(says({l:158*2.54,w:12*2.54}),/^Check the tank length and width: they describe a far bigger footprint than this much water could fill, so the surface rule is not reliable here\. /);
  assert.match(says({l:4*2.54,w:4*2.54}),/^Check the tank length and width: they describe a far smaller footprint than this much water needs/);
  // The verdict still follows the warning, and standard tank sizes never trigger it.
  assert.match(says({l:158*2.54,w:12*2.54}),/stocked|rules of thumb/);
  for(const [gal,l,w] of [[2.5,12,6],[5,16,8],[10,20,10],[20,24,12],[20,30,12],[29,30,12],[40,36,18],[55,48,13],[75,48,18],[125,72,18],[180,72,24],[300,96,24]])
    assert.doesNotMatch(says({v:gal*.9*GAL,l:l*2.54,w:w*2.54}),/Check the tank length/,`${gal} gal`);
  // Shallow frag tanks and tall column tanks are real: 48 × 24 in holding 8 in of water, 15 × 15 in holding 40 in.
  assert.doesNotMatch(says({v:48*24*8/231*GAL,l:48*2.54,w:24*2.54}),/Check the tank length/);
  assert.doesNotMatch(says({v:15*15*40/231*GAL,l:15*2.54,w:15*2.54}),/Check the tank length/);
  // Saltwater and goldfish answers do not use the footprint.
  for(const kind of ['marine','goldfish'])assert.doesNotMatch(says({kind,l:158*2.54,w:12*2.54}),/Check the tank length/);
});
