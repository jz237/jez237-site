import test from 'node:test';import assert from 'node:assert/strict';
import {lapComparison,trailingRival,riderColourIndex} from '../race-feedback.js';
import {createRace,adjudicateGate} from '../race-core.js';
import {initialSave,exportSave,importSave} from '../race-records.js';
test('lap comparison uses the previous benchmark, including a saved time-trial record',()=>{
 assert.equal(lapComparison([],60),null);assert.equal(lapComparison([60,58],57),-1);assert.equal(lapComparison([60],62,59),3);
 const s=createRace({mode:'time'}),r=s.racers[0],g=s.course.gates[0];r.next=0;r.referenceLap=50;s.time=49;r.x=g.x+g.tx;r.z=g.z+g.tz;
 adjudicateGate(s,r,g.x-g.tx,g.z-g.tz);assert.equal(r.lapDelta,-1);assert.equal(r.lapDeltaTime,49);assert.deepEqual(r.lapTimes,[49]);
});
test('nearby rival feedback excludes leaders, retired riders and distant boats',()=>{
 const s=createRace(),r=s.racers[0],q=s.racers[1],g=s.course.gates[1];r.passed=10;r.next=1;r.x=g.x;r.z=g.z;
 s.racers.slice(2).forEach(q=>q.dq='Retired');q.passed=10;q.next=1;q.x=g.x-g.tx*8;q.z=g.z-g.tz*8;
 assert.equal(trailingRival(s,r).id,q.id);assert.ok(Math.abs(trailingRival(s,r).distance-8)<1e-8);
 q.passed=11;assert.equal(trailingRival(s,r),null);q.passed=10;q.dq='Misses';assert.equal(trailingRival(s,r),null);
});
test('two-player colour swaps preserve distinct same-rider models and save round trips',()=>{
 assert.equal(riderColourIndex({id:0,player:0},true),4);assert.equal(riderColourIndex({id:1,player:1},true),1);
 assert.equal(riderColourIndex({id:2,player:0},true,true),2);assert.equal(riderColourIndex({id:2,player:1},true,true),6);
 const save=initialSave();save.versus={rider:1,tune:{},handicap:false,swapColours:true};assert.equal(importSave(exportSave(save)).versus.swapColours,true);
});
