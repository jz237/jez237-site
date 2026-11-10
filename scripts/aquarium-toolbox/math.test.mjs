import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,defaults,calculate,convert,GAL} from '../../aquarium-toolbox/calculators.mjs';
const run=(id,values={})=>calculate(id,{...defaults(calculators.find(c=>c.id===id)),...values});
const near=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);
const first=(id,a)=>run(id,a).metrics[0].value;
test('38 distinct working tools with finite, meaningful default results',()=>{assert.equal(calculators.length,38);assert.equal(new Set(calculators.map(c=>c.id)).size,38);for(const c of calculators){const r=run(c.id);assert.ok(r.message.length>20,c.id);assert.ok(r.graphic.type,c.id);for(const m of r.metrics)assert.ok(Number.isFinite(m.value),c.id);}});
const fixtures=[
 ['tank',{},95.76],['system',{},220],['substrate',{},14],['weight',{},175],['sump',{},15],['glass',{},1.2],
 ['change',{},29.5],['target',{},200/3],['series',{},25.3125],['nitrate',{},100/3],['mix',{v:100},50],['ro',{},7.5],
 ['label',{},12.5],['supplement',{},10],['stock',{},50],['hardness',{},8],
 // Emerson equilibrium at 25°C / pH 8: approximately 5.366% un-ionized,
 // converted from NH3-N mass to NH3 mass (17.0305 / 14.0067).
 ['ammonia',{tan:1,basis:'N',ph:8,temp:25},0.06525,.00002],['co2',{kh:4,ph:7},12],
 ['salt',{},1520],['salinity',{},26.25],['adjust',{},100/36],['consumption',{},.7],['ato',{},10],
 ['turnover',{flow:600},6],['pipe',{flow:3600,diameter:100},.12732395447351627],
 ['head',{flow:0,lift:2},2],['pump',{},1600],
 // 2 drops/s at 20 drops/mL is 6 mL/min, so 2 L takes 2,000 ÷ 6 minutes.
 ['drip',{drops:2,size:20,v:2},2000/6],
 ['energy',{lights:100,lightHours:10,pumps:0,heater:0,other:0,price:.2},6.0875],
 ['heatup',{v:100,start:20,target:30,power:1000,eff:100},1.1627777777777777],
 // 20 US gal held 18 °F above the room: 0.85 × 20^(2/3) × 18 ≈ 113 W, so the next common size is 150 W.
 ['heater',{v:20*GAL,room:20,target:30,installed:0},150],
 ['watercost',{v:100,pct:20,days:7,evap:0,waste:0,waterprice:0,salt:35,saltprice:4},12.175],
 ['fertilizer',{v:100,rise:10,fraction:50,stock:50,bottle:500},2],['dli',{},1.44],['co2cylinder',{},143.75],
 // 12 mL in 60 s is 0.2 mL/s; four 2 mL doses a day need 10 s each.
 ['doser',{},10],
 // Ten 4 cm fish in 100 L with an 80 × 35 cm surface: volume rule 26.4 in, so 15.7 in is 59.6%.
 ['stocking',{v:100,l:80,w:35,kind:'tropical',size:4,count:10},40/2.54/(100/GAL)*100],['sg',{value:35},1.02639]
];
for(const [id,values,expected,tolerance] of fixtures)test(`${id}: independent worked example`,()=>near(first(id,values),expected,tolerance));
test('tank shapes and displacement are distinct, and US gallon definition is exact',()=>{near(first('tank',{shape:'rectangle',l:10,w:10,h:10,fill:100,displacement:0}),1);near(first('tank',{shape:'cylinder',l:20,h:10,fill:100,displacement:0}),Math.PI);near(first('tank',{shape:'ellipse',l:20,w:10,h:10,fill:100,displacement:0}),Math.PI/2);near(GAL,3.785411784);});
test('water changes conserve dissolved mass at 0%, partial and 100%',()=>{near(first('change',{current:60,fresh:5,pct:0}),60);near(first('change',{current:60,fresh:5,pct:100}),5);near(first('change',{current:60,fresh:5,pct:50}),32.5);near(first('series',{current:80,fresh:10,pct:100,n:4}),10);});
test('impossible dilution and invalid physical domains are rejected',()=>{const cases=[['target',{current:20,target:5,fresh:10}],['mix',{high:12,low:2,target:15}],['adjust',{current:35,target:36,fresh:0}],['stock',{stock:10,target:20}],['ato',{v:100,daily:10,days:10}],['pump',{head:3}],['pump',{h1:2,h2:1}],['supplement',{current:8,target:7}],['heatup',{start:25,target:20}],['co2cylinder',{full:1,tare:2}],['hardness',{kind:'gh',unit:'meq'}],['series',{n:2.5}],['doser',{events:2.1}]];for(const [id,a]of cases)assert.throws(()=>run(id,a),Error,id);});
test('blank, nonfinite, invalid options and negative volumes cannot calculate',()=>{for(const v of [NaN,Infinity,-Infinity,'',null,undefined,-1,0])assert.throws(()=>run('change',{v}));assert.throws(()=>run('tank',{shape:'sphere'}));});
test('ammonia nitrogen and NH3 mass bases agree after molecular-weight conversion',()=>{const a=run('ammonia',{tan:1,basis:'N'}),b=run('ammonia',{tan:17.0305/14.0067,basis:'NH3'});near(a.metrics[0].value,b.metrics[0].value);assert.ok(first('ammonia',{ph:8})>first('ammonia',{ph:7}));assert.ok(first('ammonia',{temp:30})>first('ammonia',{temp:20}));});
test('no correction when already at target; zero dosing does not divide by zero',()=>{near(first('target',{current:20,target:20}),0);near(first('adjust',{current:35,target:35}),0);near(first('supplement',{current:8,target:8}),0);for(const m of run('doser',{daily:0}).metrics)assert.ok(Number.isFinite(m.value));});
test('US/metric round trips preserve calculation precision',()=>{for(const unit of ['L','L/h','cm','mm','m','kg','°C'])for(const value of [0,.1,1,10,100,1000])near(convert(convert(value,unit,true),unit,false),value);});
test('doubling system volume doubles quantities but not concentration or turnover',()=>{near(first('label',{v:200}),2*first('label',{v:100}));near(first('change',{v:200}),first('change',{v:100}));near(first('turnover',{v:200,flow:1200}),first('turnover',{v:100,flow:600}));});
test('reef evaporation conserves salt; freshwater has zero salinity',()=>{near(run('ato',{v:100,salinity:35,daily:2,days:5}).metrics[2].value*90,3500);near(run('ato',{salinity:0}).metrics[2].value,0);});
test('longer or smaller pipe increases turbulent head losses',()=>{assert.ok(first('head',{length:6})>first('head',{length:3}));assert.ok(first('head',{diameter:20})>first('head',{diameter:25}));});
