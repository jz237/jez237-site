import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,calculate,migrateInputs,substrateDensity,GAL} from '../../aquarium-toolbox/calculators.mjs';
import {sliderWindow} from '../../aquarium-toolbox/sliders.mjs';
import {fieldChoices,bagComparison,bagSizes} from '../../aquarium-toolbox/presets.mjs';
const substrate=calculators.find(c=>c.id==='substrate');
const input=extra=>({...defaults(substrate),...extra});
test('5 cm bed in a 100 × 40 cm tank needs 20 L; weight and volume bags remain distinct',()=>{
 const a=input({l:100,w:40,front:5,back:5,density:1.5,bagMode:'weight',bagWeight:10,bag:8});
 assert.equal(calculate('substrate',a).metrics[0].value,20);assert.equal(calculate('substrate',a).metrics[1].value,30);assert.equal(calculate('substrate',a).metrics[2].value,3);
 a.bagMode='volume';assert.equal(calculate('substrate',a).metrics[2].value,3);a.material='custom';a.density=.8;assert.equal(calculate('substrate',a).metrics[2].value,3);a.bagMode='weight';assert.equal(calculate('substrate',a).metrics[2].value,2);
 // A named material ignores the custom weight box: planted-tank soil is 0.9 kg/L, so 18 kg needs two 10 kg bags.
 a.material='soil';assert.equal(calculate('substrate',a).metrics[1].value,18);assert.equal(calculate('substrate',a).metrics[2].value,2);assert.equal(substrateDensity(a),.9);assert.equal(substrateDensity({material:'sand',density:9}),1.5);
});
test('US weight bags convert pounds to kilograms, never gallons',()=>{
 const a=input({l:100,w:40,front:5,back:5,density:1.5,bagMode:'weight',bagWeight:20*.45359237});
 assert.equal(calculate('substrate',a).metrics[2].value,4);assert.equal(bagComparison(a,true).find(x=>x.label==='20 lb').bags,4);
 assert.equal(bagSizes('volume',true).find(x=>x.label==='≈2 US gal (9 L label)').value,9);
});
test('Legacy substrate data upgrades to volume mode without changing previous results',()=>{
 const legacy={l:80,w:35,front:3,back:7,density:1.5,bag:8};const upgraded=migrateInputs('substrate',legacy);
 assert.equal(upgraded.bagMode,'volume');assert.equal(upgraded.bag,8);assert.equal(upgraded.material,'gravel');assert.equal(migrateInputs('substrate',{...legacy,density:.8}).material,'custom');assert.equal(calculate('substrate',upgraded).metrics[2].value,2);assert.equal(legacy.bagMode,undefined);
 assert.throws(()=>calculate('substrate',migrateInputs('substrate',{...legacy,bagMode:'weight'})));assert.throws(()=>calculate('substrate',input({bagMode:'bad'})));
});
test('Common choices fit numeric domains and keep medical dose/reading fields unguessed',()=>{
 for(const c of calculators)for(const f of c.fields)for(const us of [false,true]){
  const choice=fieldChoices(c,f,us,defaults(c));if(!choice)continue;
  assert.ok(!f.options);for(const option of choice.options){assert.ok(option.label.length>0);assert.ok(Number.isFinite(option.value)&&option.value>=f.min&&option.value<=f.max,`${c.id}.${f.key}`);}
 }
 for(const id of ['ammonia','co2','target','label','supplement']){const c=calculators.find(c=>c.id===id);for(const f of c.fields.filter(f=>['tan','ph','kh','current','target','dose','labelV','rise'].includes(f.key)))assert.equal(fieldChoices(c,f,true,defaults(c)),null);}
});
test('Nominal US gallons and metric volumes are not confused',()=>{
 const c=calculators.find(c=>c.id==='change'),f=c.fields[0];assert.equal(fieldChoices(c,f,true,defaults(c)).options.find(x=>x.label==='55 US gal').value,55*GAL);assert.equal(fieldChoices(c,f,false,defaults(c)).options.find(x=>x.label==='100 L').value,100);
});
test('Empty substrate bed needs zero bags; invalid bag mass is rejected',()=>{
 const a=input({front:0,back:0});assert.equal(calculate('substrate',a).metrics[2].value,0);assert.ok(bagComparison(a,true).every(x=>x.bags===0));assert.throws(()=>calculate('substrate',input({bagWeight:0})));
});

test('Bag weight slider stays useful for retail packages',()=>{
 const f=substrate.fields.find(f=>f.key==='bagWeight');assert.equal(sliderWindow(substrate,f,input(),true).max,50);assert.equal(sliderWindow(substrate,f,input(),false).max,25);
});
