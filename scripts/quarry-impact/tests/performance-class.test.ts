import test from 'node:test';import assert from 'node:assert/strict';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {readGarage,stockSetup,normalizeSetup,setupPhysics} from '../src/garage';
import {CLASS_LIMITS,isClassLimit,performanceRating,classEligible,classRecordKey} from '../src/performance-class';
import {eventGridSetup,eventPerformanceGrid} from '../src/grid-setup';
import {DEFAULT_EVENT,EVENT_KEY,readEventOptions} from '../src/event-rules';
import {DEFAULT_DEMO,DEMO_KEY,readDemoOptions,demoVehicleSetup,demoPerformanceGrid,demoCarKind} from '../src/demo-session';
import {gridCarKind,GRID_LINEUPS,gridRecordKey} from '../src/grid-rules';
import {exportSave,readSave,restoreSave,captureSave} from '../src/save-backup';

test('all cars gain rating with engine/tyre upgrades and lose rating with physical armor weight',()=>{
 const grades=new Set();for(const kind of CAR_KINDS){
  const stock=stockSetup(kind),base=performanceRating(kind,stock);grades.add(base.grade);
  assert.ok(Number.isInteger(base.points)&&base.points>0);
  let previous=base.points;for(let engine=1;engine<=3;engine++){const points=performanceRating(kind,{...stock,engine}).points;assert.ok(points>previous,kind+' engine');previous=points;}
  previous=base.points;for(let tires=1;tires<=3;tires++){const points=performanceRating(kind,{...stock,tires}).points;assert.ok(points>previous,kind+' tires');previous=points;}
  previous=base.points;for(let armor=1;armor<=3;armor++){const build={...stock,armor},points=performanceRating(kind,build).points;assert.ok(setupPhysics(kind,build).mass>setupPhysics(kind,stock).mass);assert.ok(points<previous,kind+' armor');previous=points;}
  for(let gearing=-1;gearing<=1.001;gearing+=.05)assert.deepEqual(performanceRating(kind,{...stock,tune:{...stock.tune,gearing}}),base,'Changing final drive cannot evade classification');
  assert.deepEqual(performanceRating(kind,{...stock,paint:0x123456,trim:0xff0000,tune:{gearing:0,suspension:1,differential:1,brakeBias:-1,steering:1,rideHeight:1,compression:-1,rebound:1,brakePressure:1}}),base,'Cosmetics and chassis tuning remain free');
  assert.deepEqual(performanceRating(kind),base);assert.deepEqual(performanceRating(kind,{...stock,engine:NaN,armor:Infinity}),base);
 }
 assert.deepEqual([...grades].sort(),['A','B','C','D']);
});
test('every permitted solo grid uses qualifying actual builds, preserves all setups and fills 24 places',()=>{
 const garage=readGarage();for(const [i,kind]of CAR_KINDS.entries())Object.assign(garage.cars[kind].setup,{engine:i%4,tires:(i+1)%4,armor:(i+2)%4});const before=JSON.stringify(garage);
 for(const selected of CAR_KINDS)for(const lineup of Object.keys(GRID_LINEUPS)as (keyof typeof GRID_LINEUPS)[])for(const performance of ['open','stock','matched']as const)for(const classLimit of [undefined,'D','C','B']as const){
  const options={lineup,performance,classLimit},grid=eventPerformanceGrid(selected,options,garage);
  const expected=classEligible(selected,eventGridSetup(selected,selected,garage,performance,true),classLimit)&&grid.pool.length>0;
  assert.equal(!grid.error,!!expected);
  if(grid.error){assert.throws(()=>grid.at(0));continue;}
  assert.equal(grid.at(0),selected);for(let i=0;i<24;i++){const kind=grid.at(i),setup=eventGridSetup(kind,selected,garage,performance,i===0);assert.ok(classEligible(kind,setup,classLimit));if(!classLimit)assert.equal(kind,gridCarKind(i,selected,lineup));}
 }
 assert.equal(JSON.stringify(garage),before);
});
test('all demo build rules constrain each actual model, including garage builds and matched upgrades',()=>{
 const garage=readGarage();for(const [i,kind]of CAR_KINDS.entries())Object.assign(garage.cars[kind].setup,{engine:i%4,tires:(i+1)%4,armor:(i+2)%4});const before=JSON.stringify(garage);
 for(const selected of CAR_KINDS)for(const lineup of Object.keys(GRID_LINEUPS)as (keyof typeof GRID_LINEUPS)[])for(const setups of ['stock','garage','matched']as const)for(const classLimit of [undefined,'D','C','B']as const){
  const options={lineup,setups,classLimit},grid=demoPerformanceGrid(selected,options,garage);if(grid.error){assert.throws(()=>grid.at(1));continue;}
  for(let i=0;i<24;i++){const kind=grid.at(i);assert.ok(classEligible(kind,demoVehicleSetup(kind,options,garage,selected),classLimit));if(!classLimit)assert.equal(kind,demoCarKind(i,selected,lineup));}
 }
 assert.equal(JSON.stringify(garage),before);
});
test('over-limit selected builds and empty opponent pools are rejected without silently detuning or replacing the player',()=>{
 const garage=readGarage();assert.match(eventPerformanceGrid('coupe',{classLimit:'C'},garage).error,/exceeds/);
 garage.cars.van.setup.armor=3;
 assert.ok(classEligible('van',garage.cars.van.setup,'D'));assert.ok(!classEligible('van',undefined,'D'));
 assert.match(eventPerformanceGrid('van',{lineup:'selected',performance:'open',classLimit:'D'},garage).error,/No opponent/);
 const matched=eventPerformanceGrid('van',{lineup:'selected',performance:'matched',classLimit:'D'},garage);assert.equal(matched.error,'');assert.equal(matched.at(23),'van');
 garage.cars.trail.setup.engine=3;garage.cars.trail.setup.tires=3;
 assert.match(eventPerformanceGrid('trail',{performance:'open',classLimit:'C'},garage).error,/exceeds/);
 assert.equal(eventPerformanceGrid('trail',{performance:'stock',classLimit:'C'},garage).error,'','Factory events rate their stock build');
 assert.match(demoPerformanceGrid('trail',{lineup:'mixed',setups:'garage',classLimit:'C'},garage).error,/exceeds/);
 assert.equal(demoPerformanceGrid('trail',{lineup:'mixed',setups:'stock',classLimit:'C'},garage).error,'');
});
test('class caps match displayed integer points; defaults, hostile values and record categories remain safe',()=>{
 assert.deepEqual(readEventOptions(JSON.stringify(DEFAULT_EVENT)),DEFAULT_EVENT);assert.deepEqual(readDemoOptions(JSON.stringify(DEFAULT_DEMO)),DEFAULT_DEMO);
 for(const value of [null,0,'A','open','__proto__','constructor',[],{}]){assert.equal(isClassLimit(value),false);assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,classLimit:value})).classLimit,undefined);assert.equal(readDemoOptions(JSON.stringify({...DEFAULT_DEMO,classLimit:value})).classLimit,undefined);}
 const keys=new Set();for(const limit of [undefined,'D','C','B']as const){const key=classRecordKey(gridRecordKey('race:forward:1:24','trail','mixed','stock'),limit);keys.add(key);if(limit){assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,classLimit:limit})).classLimit,limit);assert.equal(readDemoOptions(JSON.stringify({...DEFAULT_DEMO,classLimit:limit})).classLimit,limit);for(const k of CAR_KINDS)assert.equal(classEligible(k,undefined,limit),performanceRating(k).points<=CLASS_LIMITS[limit]);}}
 assert.equal(keys.size,4);assert.equal(classRecordKey('old-record'),'old-record');
});
test('class choices and separated event records survive signed backup transfer, while old saves still round-trip',async()=>{
 class Memory{data=new Map<string,string>();getItem(k:string){return this.data.get(k)??null;}setItem(k:string,v:string){this.data.set(k,v);}removeItem(k:string){this.data.delete(k);}}
 for(const capped of [false,true]){const source=new Memory(),target=new Memory();source.setItem(EVENT_KEY,JSON.stringify({...DEFAULT_EVENT,...(capped?{classLimit:'C'}:{})}));source.setItem(DEMO_KEY,JSON.stringify({...DEFAULT_DEMO,...(capped?{classLimit:'B'}:{})}));source.setItem('quarry-impact-v1',JSON.stringify({best:{[classRecordKey('race:forward:1:24',capped?'C':undefined)]:72.5}}));
  const saved=await readSave(await exportSave(source));await restoreSave(target,saved);assert.deepEqual(captureSave(target),saved.entries);assert.equal(readEventOptions(target.getItem(EVENT_KEY)).classLimit,capped?'C':undefined);assert.equal(readDemoOptions(target.getItem(DEMO_KEY)).classLimit,capped?'B':undefined);
 }
});
