import test from 'node:test';import assert from 'node:assert/strict';
import {raceFinishRemaining} from '../src/race-finish-window';
import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';
import {Room} from '../multiplayer/room';
import {validOnlineSnapshot} from '../src/network-validation';
await R.init();
test('first physical crossing starts the window, ignoring penalties and unfinished entrants',()=>{
 const cars=[{finished:false,finishTime:0,penalty:0},{finished:true,finishTime:125,penalty:25},{finished:true,finishTime:110,penalty:0}];
 assert.equal(raceFinishRemaining(cars,99),null);assert.equal(raceFinishRemaining(cars,100),60);assert.equal(raceFinishRemaining(cars,159.99),.009999999999990905);assert.equal(raceFinishRemaining(cars,160),0);
 assert.equal(raceFinishRemaining([{finished:true,finishTime:NaN,penalty:0}],100),null);
});
test('actual race authority ends at first crossing +60 and retains unfinished classification across restore',()=>{
 const room=new Room('ABCDEF',R);room.sim.dispose();room.sim=new Simulation(R,'race',[],24,[],{version:1,laps:1,direction:'forward',race:'laps',derby:'survival',duration:60});
 room.sim.phase='playing';room.sim.elapsed=159.98;Object.assign(room.sim.cars[0].state,{finished:true,finishTime:125,penalty:25});
 const saved=room.save(),restored=new Room('ABCDEF',R);
 try{restored.restore(saved);restored.step();assert.equal(restored.sim.phase,'playing');restored.step();assert.equal(restored.sim.phase,'result');assert.equal(restored.sim.cars[1].state.finished,false);assert.equal(restored.sim.cars[0].state.finishTime,125);assert.equal(restored.snapshot().raceFinishWindowSupport,true);assert.ok(validOnlineSnapshot(restored.snapshot()));const invalid={...restored.snapshot(),raceFinishWindowSupport:false};assert.equal(validOnlineSnapshot(invalid),false);const legacy={...restored.snapshot()};delete legacy.raceFinishWindowSupport;assert.ok(validOnlineSnapshot(legacy));}finally{room.dispose();restored.dispose();}
});
test('timed races preserve their own grace period',()=>{
 const sim=new Simulation(R,'race',[],24,[],{version:1,laps:1,direction:'forward',race:'laps',raceDuration:120,derby:'survival',duration:60});
 try{sim.phase='playing';sim.elapsed=181;Object.assign(sim.cars[0].state,{finished:true,finishTime:120,penalty:0});sim.step(new Set([0,1]));assert.equal(sim.phase,'playing');}finally{sim.dispose();}
});
