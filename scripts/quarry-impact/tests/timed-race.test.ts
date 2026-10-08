import assert from 'node:assert/strict';
import test from 'node:test';
import {readEventOptions} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
import {timedRaceLimit,timedRaceFinished,timedRaceOrder,timedRaceResult,timedRaceRecordScore} from '../src/timed-race';
test('timed circuit preferences preserve older saves and never affect fixed or noncircuit events',()=>{
 const event=readEventOptions(JSON.stringify({version:1,raceDuration:90})),demo=readDemoOptions(JSON.stringify({version:1,raceDuration:120}));
 assert.equal(readEventOptions().raceDuration,undefined);assert.equal(readDemoOptions().raceDuration,undefined);
 assert.equal(timedRaceLimit('race',true,false,'laps',event,demo),90);assert.equal(timedRaceLimit('race',true,true,'laps',event,demo),120);
 for(const [mode,custom,format]of [['derby',true,'laps'],['race',false,'laps'],['race',true,'free']]as const)assert.equal(timedRaceLimit(mode,custom,false,format,event,demo),0);
 for(const read of [readEventOptions,readDemoOptions]){assert.equal(read('{"version":1,"raceDuration":-20}').raceDuration,60);assert.equal(read('{"version":1,"raceDuration":99999}').raceDuration,1200);assert.equal(read('{"version":1,"raceDuration":"60"}').raceDuration,undefined);}
});
test('only an ordered finish-line crossing after the clock expires can finish a timed race',()=>{
 assert.equal(timedRaceFinished(24,59.99,60),false);assert.equal(timedRaceFinished(0,60,60),false);assert.equal(timedRaceFinished(25,60,60),false);assert.equal(timedRaceFinished(48,60,60),true);assert.equal(timedRaceFinished(240,1200,1200),true);
});
test('classification prefers finishers, completed laps and penalty-adjusted times with stable ties',()=>{
 const car=(id:number,passed:number,finishTime:number,finished=true)=>({id,passed,finishTime,finished,nextCheckpoint:1,current:{x:0,z:0},health:100});
 const cars=[car(0,48,75),car(1,48,74),car(2,72,90),car(3,95,0,false),car(4,48,74)];
 assert.deepEqual(timedRaceOrder(cars,()=>[{x:0,z:0},{x:1,z:0}]).map(c=>c.id),[2,1,4,0,3]);
 assert.ok(timedRaceRecordScore(cars[2])>timedRaceRecordScore(cars[1]));assert.ok(timedRaceRecordScore(cars[1])>timedRaceRecordScore(cars[0]));assert.match(timedRaceResult(cars[0]),/2 LAPS · 75.00s incl. penalties/);assert.match(timedRaceResult(cars[3]),/DNF/);
});
