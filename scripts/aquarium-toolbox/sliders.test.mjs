import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,convert} from '../../aquarium-toolbox/calculators.mjs';
import {sliderWindow,sliderValue} from '../../aquarium-toolbox/sliders.mjs';
for(const us of [false,true])test(`Slider bounds preserve numeric domains and initial precision (${us?'US':'metric'})`,()=>{
  for(const c of calculators)for(const f of c.fields.filter(f=>!f.options)){
    const a=defaults(c),r=sliderWindow(c,f,a,us),v=us?convert(a[f.key],f.displayUnit||f.unit,true):a[f.key];
    assert.ok(r.min<r.max,`${c.id}.${f.key}`);assert.ok(r.step>0);assert.ok(r.min>=r.domainMin);assert.ok(r.max<=r.domainMax);assert.ok(v>=r.min&&v<=r.max,`${c.id}.${f.key} outside range`);assert.equal(r.value,v);
    for(const x of [r.min,r.max,(r.min+r.max)/2]){const moved=sliderValue(x,r);assert.ok(moved>=r.domainMin-1e-10&&moved<=r.domainMax+1e-10);}
    a[f.key]=f.max;assert.equal(sliderWindow(c,f,a,us).max,r.domainMax);
  }
});
test('Exact entry beyond the useful window expands it without altering the value',()=>{
 const c=calculators.find(c=>c.id==='change'),f=c.fields[0],a=defaults(c);a.v=12345.6789;const r=sliderWindow(c,f,a);assert.ok(r.max>=a.v);assert.equal(r.value,a.v);
 a.v=.01357;assert.equal(sliderWindow(c,f,a).min,a.v);assert.equal(sliderWindow(c,f,a).value,a.v);
});
test('pH, roughness, temperature, and integer controls have practical increments',()=>{
 const check=(id,key,us=false)=>{const c=calculators.find(c=>c.id===id);return sliderWindow(c,c.fields.find(f=>f.key===key),defaults(c),us);};
 assert.equal(check('ammonia','ph').step,.05);assert.equal(check('head','rough').step,.0005);assert.equal(check('ammonia','temp',true).step,1);assert.equal(check('series','n').step,1);
 assert.equal(sliderValue(7.537,check('ammonia','ph')),7.55);
});
test('Selector-driven scales suit alkalinity, calcium, hardness and TDS',()=>{
 for(const [id,key,selection,newValue]of [['supplement','current','parameter','mg/L'],['consumption','start','parameter','mg/L'],['hardness','value','unit','ppm'],['mix','high','measure','mg/L']]){
  const c=calculators.find(c=>c.id===id),f=c.fields.find(f=>f.key===key),a=defaults(c),before=sliderWindow(c,f,a);a[selection]=newValue;assert.ok(sliderWindow(c,f,a).max>before.max);
 }
});
