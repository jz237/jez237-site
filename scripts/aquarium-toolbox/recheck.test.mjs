import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,calculate,normalizeInputs,convert,sgFromPpt,pptFromSg} from '../../aquarium-toolbox/calculators.mjs';
import {sliderWindow,sliderValue} from '../../aquarium-toolbox/sliders.mjs';
const run=(id,a)=>calculate(id,{...defaults(calculators.find(c=>c.id===id)),...a});

test('All field endpoints survive US/metric and SG conversion, JSON and validation',()=>{
 for(const c of calculators)for(const f of c.fields.filter(f=>!f.options))for(const bound of [f.min,f.max]){
  const converted=convert(convert(bound,f.displayUnit||f.unit,true),f.displayUnit||f.unit,false);
  const normalized=normalizeInputs(c.id,{...defaults(c),[f.key]:converted});
  assert.ok(normalized[f.key]>=f.min&&normalized[f.key]<=f.max,c.id+'.'+f.key);
  assert.deepEqual(normalizeInputs(c.id,JSON.parse(JSON.stringify(normalized))),normalized);
  if(f.unit==='ppt'){
   const sg=normalizeInputs(c.id,{...defaults(c),[f.key]:pptFromSg(sgFromPpt(bound))});
   assert.ok(sg[f.key]>=f.min&&sg[f.key]<=f.max);
  }
 }
 const a=defaults(calculators.find(c=>c.id==='salt'));
 assert.throws(()=>normalizeInputs('salt',{...a,target:.999999}),/must be between/);
 assert.throws(()=>normalizeInputs('salt',{...a,target:60.000001}),/must be between/);
 assert.throws(()=>normalizeInputs('salt',{...a,target:NaN}),/Enter a number/);
 assert.throws(()=>normalizeInputs('salt',{...a,target:null}),/Enter a number/);
});

test('Missing or malformed shared measurements cannot become default doses',()=>{
 for(const input of [null,[],{},'hello',{v:100,dose:5}])assert.throws(()=>normalizeInputs('label',input));
 const a=defaults(calculators.find(c=>c.id==='label'));
 for(const f of calculators.find(c=>c.id==='label').fields){const bad={...a};delete bad[f.key];assert.throws(()=>normalizeInputs('label',bad),f.key);}
 assert.deepEqual(normalizeInputs('label',{...a,extra:'ignore'}),a);
});

test('Every slider stays in its true domain, including converted Home/End endpoints',()=>{
 for(const us of [false,true])for(const sg of [false,true])for(const c of calculators)for(const f of c.fields.filter(f=>!f.options))for(const bound of [f.min,f.max]){
  const a={...defaults(c),[f.key]:bound},w=sliderWindow(c,f,a,us,sg);
  for(const shown of [w.min,w.max,(w.min+w.max)/2]){
   const snapped=sliderValue(shown,w);assert.ok(snapped>=w.min&&snapped<=w.max);
   const value=f.unit==='ppt'&&sg?pptFromSg(snapped):us?convert(snapped,f.displayUnit||f.unit,false):snapped;
   normalizeInputs(c.id,{...a,[f.key]:value},us,sg);
  }
  assert.equal(sliderValue(w.min,w),w.min);assert.equal(sliderValue(w.max,w),w.max);
 }
});

test('Repeated changes preserve their exact starting reading and zero-change identity',()=>{
 for(const current of [0,1e-10,.01,80,1e7])for(const fresh of [0,1e-10,.01,80,1e7]){
  const zero=run('series',{current,fresh,pct:0,n:52});
  assert.deepEqual(zero.graphic.values,Array(53).fill(current));
  const full=run('series',{current,fresh,pct:100,n:3});
  assert.deepEqual(full.graphic.values,[current,fresh,fresh,fresh]);
  const half=run('series',{current,fresh,pct:50,n:3});
  assert.equal(half.graphic.values[0],current);
  assert.ok(half.graphic.values.every(v=>v>=Math.min(current,fresh)&&v<=Math.max(current,fresh)));
 }
});

test('Full nitrate changes and pump-curve endpoints retain small positive values',()=>{
 assert.equal(run('nitrate',{rise:1e5,fresh:1e-12,pct:100}).metrics[1].value,1e-12);
 assert.equal(run('pump',{q1:1e8,q2:1e-10,h1:0,h2:1,head:1}).metrics[0].value,1e-10);
 assert.equal(run('pump',{q1:1e8,q2:1e-10,h1:0,h2:1,head:0}).metrics[0].value,1e8);
});

test('RO interpretation distinguishes low production from poor rejection',()=>{
 const low=run('ro',{feed:200,product:20});
 assert.equal(low.metrics[3].value,90);
 assert.match(low.message,/cold water mainly slows production/);
 assert.match(low.message,/Check pressure and retest/);
 assert.doesNotMatch(low.message,/membrane is due for replacement/);
 assert.match(calculators.find(c=>c.id==='ro').reference[1],/dupont\.com/);
});
