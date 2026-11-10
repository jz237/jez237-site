import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,convert,flowGuide,GAL} from '../../aquarium-toolbox/calculators.mjs';
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
test('pH, temperature, inch and whole-number controls have practical increments',()=>{
 const check=(id,key,us=false)=>{const c=calculators.find(c=>c.id===id);return sliderWindow(c,c.fields.find(f=>f.key===key),defaults(c),us);};
 assert.equal(check('ammonia','ph').step,.05);assert.equal(check('head','e90').step,1);assert.equal(check('stocking','count').step,1);assert.equal(check('ammonia','temp',true).step,1);assert.equal(check('series','n').step,1);
 assert.equal(check('tank','l',true).step,.25);assert.equal(check('heater','room',true).step,1);
 assert.equal(sliderValue(7.537,check('ammonia','ph')),7.55);
});
test('Selector-driven scales suit alkalinity, calcium, hardness and TDS',()=>{
 for(const [id,key,selection,newValue]of [['supplement','current','parameter','mg/L'],['consumption','start','parameter','mg/L'],['hardness','value','unit','ppm'],['mix','high','measure','mg/L']]){
  const c=calculators.find(c=>c.id===id),f=c.fields.find(f=>f.key===key),a=defaults(c),before=sliderWindow(c,f,a);a[selection]=newValue;assert.ok(sliderWindow(c,f,a).max>before.max);
 }
});
test('US starting examples sit inside their slider windows',()=>{
 for(const c of calculators)for(const f of c.fields.filter(f=>!f.options)){const a=defaults(c,true),r=sliderWindow(c,f,a,true);assert.ok(r.value>=r.min&&r.value<=r.max,`${c.id}.${f.key}`);}
});
test('Salinity sliders can work in specific gravity without changing the saved ppt',()=>{
 const c=calculators.find(c=>c.id==='adjust'),f=c.fields.find(f=>f.key==='target'),a=defaults(c),r=sliderWindow(c,f,a,true,true);
 assert.equal(r.step,.0005);assert.equal(r.min,1);assert.equal(r.max,1.035);assert.equal(r.value,1.0264);assert.equal(a.target,35);
 a.target=60;assert.ok(sliderWindow(c,f,a,true,true).max>=1.045);
});
test('The flow slider follows the tank, so its usual range can always be reached by dragging',()=>{
 // Jez's screenshot: a 125 gal SPS reef wants 3,750-5,000 GPH, but the slider stopped at 2,000.
 const c=calculators.find(c=>c.id==='turnover'),f=c.fields.find(f=>f.key==='flow');
 const sps=sliderWindow(c,f,{v:125*GAL,flow:2000*GAL,kind:'sps'},true);
 assert.equal(sps.max,10000);assert.equal(sps.step,100);assert.equal(sps.value,2000);
 for(const us of [false,true])for(const kind of Object.keys(flowGuide))for(const gallons of [2.5,5,10,20,29,55,75,125,180,300]){
  const v=gallons*GAL,[lo,hi]=flowGuide[kind],show=x=>us?x/GAL:x,r=sliderWindow(c,f,{v,flow:0,kind},us),where=`${kind} ${gallons} gal ${us?'US':'metric'}`;
  assert.ok(r.max>=show(v*hi)*1.2,`${where}: the top of the usual range is well inside the slider`);
  assert.ok(show(v*lo)>=r.max*.05,`${where}: the usual range is not squeezed into the corner`);
  assert.ok(r.step<=show(v*(hi-lo))/4,`${where}: several stops inside the usual range`);
  assert.equal(r.min,0);
 }
 // A typed value beyond the window still widens it, and an unknown tank type falls back to the plain window.
 assert.ok(sliderWindow(c,f,{v:20*GAL,flow:5000*GAL,kind:'community'},true).max>=5000);
 assert.equal(sliderWindow(c,f,{v:20*GAL,flow:100*GAL,kind:'other'},true).max,2000);
});
