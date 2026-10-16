import test from 'node:test';import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {gridPool,gridCarKind,gridRecordKey,VEHICLE_GROUPS,vehicleDrivetrain,type GridLineup} from '../src/grid-rules';
import {demoCarKind,demoPerformanceGrid,readDemoOptions} from '../src/demo-session';
import {readEventOptions} from '../src/event-rules';
import {eventPerformanceGrid} from '../src/grid-setup';
import {readGarage} from '../src/garage';
import {classEligible} from '../src/performance-class';
const sets:GridLineup[]=['fwd','rwd','american','european','muscle'];
test('every new opponent set fills all slots, preserving the solo player and restricting the entire demo',()=>{
 for(const selected of CAR_KINDS)for(const set of sets){const pool=gridPool(selected,set);assert.ok(pool.length);assert.equal(gridCarKind(0,selected,set),selected);const opponents=Array.from({length:23},(_,i)=>gridCarKind(i+1,selected,set));assert.deepEqual(new Set(opponents),new Set(pool));for(let i=0;i<24;i++)assert.ok(pool.includes(demoCarKind(i,selected,set)));assert.equal(readEventOptions(JSON.stringify({version:1,lineup:set})).lineup,set);assert.equal(readDemoOptions(JSON.stringify({version:1,lineup:set})).lineup,set);assert.notEqual(gridRecordKey('race',selected,set),'race');}
 assert.ok(gridPool('coupe','fwd').every(k=>vehicleDrivetrain(k)==='FWD'));assert.ok(gridPool('tern','rwd').every(k=>vehicleDrivetrain(k)==='RWD'));for(const set of ['american','european']as const)assert.ok(gridPool('tern',set).every(k=>VEHICLE_GROUPS[k].region===set));assert.deepEqual(gridPool('tern','muscle'),['coupe','muscle']);
});
test('class-restricted sets use qualifying opponents and never substitute outside the selected set',()=>{
 const garage=readGarage();for(const lineup of sets)for(const classLimit of ['D','C','B']as const){const demo=demoPerformanceGrid('coupe',{lineup,setups:'stock',classLimit},garage);if(demo.error){assert.equal(demo.pool.length,0);assert.throws(()=>demo.at(0));continue;}for(let i=0;i<24;i++){const kind=demo.at(i);assert.ok(gridPool('coupe',lineup).includes(kind));assert.ok(classEligible(kind,undefined,classLimit));}}
 const solo=eventPerformanceGrid('coupe',{lineup:'fwd',performance:'stock'},garage);assert.equal(solo.at(0),'coupe');assert.equal(solo.at(1),'tern');
});
