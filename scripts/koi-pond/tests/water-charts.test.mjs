import test from 'node:test';
import assert from 'node:assert/strict';
import {PondChemistry,ammoniaFraction,oxygenSaturation} from '../src/PondChemistry.js';
import {compareSystems,chartGeometry,lineChart,timeSeries,ammoniaCurve,oxygenCurve} from '../src/WaterCharts.js';

test('comparisons start from the current sample and never change the customer scenario',()=>{
 const lab=new PondChemistry();lab.state.temperature=30;lab.feed();lab.advance(6);
 const before=JSON.stringify(lab),{on,off,start,end}=compareSystems(lab,'aeration');
 assert.equal(JSON.stringify(lab),before);assert.equal(start,6);assert.equal(end,30);
 assert.equal(on.history[0].oxygen,off.history[0].oxygen);assert.equal(on.history[0].organic,off.history[0].organic);
 assert.equal(on.history[0].filter,off.history[0].filter);assert.equal(on.history.length,25);
 assert.ok(on.state.oxygen>off.state.oxygen+2);assert.ok(off.state.oxygen<5);
 const filter=compareSystems(lab,'filter');assert.ok(filter.off.state.ammonia>filter.on.state.ammonia*5);
 assert.equal(JSON.stringify(lab),before);
});

test('sample history preserves real times, instantaneous changes, and recorded speciation',()=>{
 const lab=new PondChemistry();lab.advance(6);const before={...lab.state};lab.waterChange();
 const a=lab.history.at(-2),b=lab.history.at(-1);assert.equal(a.hour,b.hour);assert.equal(b.hour,6);
 assert.equal(b.event,'25% water change');assert.ok(Math.abs(b.ammonia-a.ammonia*.75)<1e-12);
 assert.equal(b.unionized,b.ammonia*ammoniaFraction(b.temperature,b.pH));
 assert.equal(b.saturation,oxygenSaturation(b.temperature));
 lab.state.pH=9;assert.equal(b.pH,7.6,'past samples are immutable when sliders change');
 lab.waterChange();assert.ok(Math.abs(lab.state.ammonia-before.ammonia*.5625)<1e-12);
 lab.advance(200);assert.equal(lab.history.length,97);assert.equal(lab.history.at(-1).hour,206);
 assert.ok(lab.history[0].hour>0);assert.ok(lab.history.every(s=>Number.isFinite(s.unionized)));
});

test('graphs use hour coordinates rather than equal spacing for uneven sample intervals',()=>{
 const series=[{points:[{x:2,y:.03},{x:8,y:.08},{x:8,y:.06},{x:26,y:.1}]}];
 const g=chartGeometry(series);assert.equal(g.min,2);assert.equal(g.max,26);
 assert.ok(Math.abs((g.x(8)-g.x(2))/(g.x(26)-g.x(2))-.25)<1e-12);
 assert.equal(g.y(0),166);assert.ok(g.y(.1)>=40);assert.ok(g.y(.03)>g.y(.08));
 const one=chartGeometry([{points:[{x:0,y:0}]}]);assert.ok(one.max>one.min);assert.ok(Number.isFinite(one.y(0)));
});

test('sensitivity curves match chemistry, have correct endpoints, and stay within plotted bounds',()=>{
 for(const temperature of [10,22,32]){const p=ammoniaCurve(temperature);assert.equal(p[0].x,6.5);assert.equal(p.at(-1).x,9);
   assert.ok(p.every(v=>v.y>=0&&v.y<50));assert.ok(p.at(-1).y>p[0].y*100);
   assert.equal(p[30].y,100*ammoniaFraction(temperature,8));}
 const curve=oxygenCurve();assert.equal(curve[0].x,10);assert.equal(curve.at(-1).x,32);
 assert.ok(curve.every((p,i)=>i===0||p.y<curve[i-1].y));
});

test('empty and single-sample charts expose units and render without invalid geometry',()=>{
 const lab=new PondChemistry(),series=[timeSeries(lab.history,'oxygen','Dissolved oxygen','#123456')];
 const markup=lineChart({id:'test',title:'Oxygen history',unit:'mg/L',series,reference:5});
 assert.ok(markup.includes('<circle'));assert.ok(markup.includes('mg/L'));assert.ok(markup.includes('Simulation hour'));
 assert.ok(!/NaN|Infinity|undefined/.test(markup));
 const empty=lineChart({id:'empty',title:'No samples',unit:'mg/L',series:[]});assert.ok(!/NaN|Infinity|undefined/.test(empty));
});
