import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRaceWater,advanceRaceWaterFrame,advanceRaceWaterRollers,captureRaceWater,stepRaceWater} from '../race-water.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';

const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-roller-schedule.json',import.meta.url)));
const row=fixture.cases[0].rows[0];
const crafts=[{x:25,z:12.5,heading:0}];
const hash=f=>{
 const bytes=Buffer.alloc(49152*4);
 for(let i=0;i<49152;i++){bytes.writeInt16BE(f.heightQ[i],i*4);bytes.writeInt16BE(f.velocityQ[i],i*4+2);}
 return createHash('sha256').update(bytes).digest('hex');
};
const water=()=>createRaceWater({crafts,baseAmplitudeNative:20,initialNoise:false,rollerRows:[row]});

test('32 original caller/roller executions match phases and the entire prepared height/velocity grid',()=>{
 // Expected hashes come from original6E3A8+4CC7C, not the JS implementation.
 // Original judging and object callees were intercepted with the state writes
 // in each input; this is a scheduling oracle, not a full race replay.
 for(const q of fixture.cases){
  const s=createRaceWater({crafts,baseAmplitudeNative:20,initialNoise:false,rollerRows:q.rows});
  for(let i=0;i<49152;i++){s.field.heightQ[i]=i*73+17;s.field.velocityQ[i]=i*37-913;}
  s.rollers.forEach((r,i)=>r.phaseIndex=q.phasesBefore[i]);
  const before=hash(s.field);
  // The oracle enters after51238; hold ordinary evolution to retain exactly
  // its prepared input grid, independently of the input simulation648 value.
  advanceRaceWaterFrame(s,crafts,{simulationActive:false,deferRollers:true,rollerState72c:q.input.beforeState72c});
  assert.equal(hash(s.field),before);
  advanceRaceWaterRollers(s,{active:q.input.afterActivity624===-1,rollerState72c:q.input.afterObjectState72c});
  assert.deepEqual(s.rollers.map(r=>r.phaseIndex),q.phasesAfter);
  assert.equal(hash(s.field),q.gridSHA256,JSON.stringify(q.input));
  assert.equal(s.rollerFrames,s.frames);
 }
});

test('deferred course stage runs once, invalidates earlier snapshots, and rejects skipped/out-of-order calls atomically',()=>{
 const s=water();assert.throws(()=>advanceRaceWaterRollers(s),/pending completed water frame/);
 for(const options of [{deferRollers:1},{rollerState72c:32768}]){
  const before=structuredClone(s);assert.throws(()=>advanceRaceWaterFrame(s,crafts,options));assert.deepEqual(s,before);
 }
 advanceRaceWaterFrame(s,crafts,{simulationActive:false,deferRollers:true});
 const pending=structuredClone(s),view=captureRaceWater(s);
 assert.throws(()=>advanceRaceWaterFrame(s,crafts),/pending course roller stage/);assert.deepEqual(s,pending);
 for(const options of [{active:1},{rollerState72c:NaN},{active:false,rollerState72c:65535}]){
  assert.throws(()=>advanceRaceWaterRollers(s,options));assert.deepEqual(s,pending);
 }
 advanceRaceWaterRollers(s);assert.equal(s.rollers[0].frames,1);
 assert.ok(s.revision>view.revision);assert.notDeepEqual(s.field.heightQ,view.heightQ);
 const completed=structuredClone(s);assert.throws(()=>advanceRaceWaterRollers(s),/pending completed water frame/);assert.deepEqual(s,completed);
 advanceRaceWaterFrame(s,crafts,{simulationActive:false,deferRollers:true});
 advanceRaceWaterRollers(s,{active:false});assert.equal(s.rollers[0].frames,1);assert.equal(s.rollerFrames,2);
 advanceRaceWaterFrame(s,crafts,{simulationActive:false,deferRollers:true});
 advanceRaceWaterRollers(s,{rollerState72c:1});assert.equal(s.rollers[0].frames,1);assert.equal(s.rollerFrames,3);
 const paused=structuredClone(s);stepRaceWater(s,crafts,1,{active:false});assert.deepEqual(s,paused);
});

const create=(options={})=>createRace({mode:'time',course:getCourse('greyhaven'),physics:'native',...options});
const rollerCourse=()=>({...getCourse('greyhaven'),rollersForPlayers:()=>[{nativeRow:row}],
 dynamicObjectsForPlayers:()=>[{id:'roller-schedule-fixture',x:40,y:-.5,z:40}]});

test('actual canonical hosts keep activity, simulation and signed72c independent in one- and two-player frames',()=>{
 for(const mode of ['time','versus']){
  const initial=create({mode}).nativeLaunch.snapshot();
  for(const simulation of [0,3])for(const [activity,state72c]of [[-1,0],[-1,1],[-1,65535],[-1,32768],[0,0],[1,0]]){
   const retained=structuredClone(initial);
   Object.assign(retained.scene,{activity624:activity,simulation648:simulation,phase650:3,field72c:state72c});
   const s=create({mode,course:rollerCourse(),nativeInitialRaceState:retained}),h=s.nativeHost;
   const hulls=h.world.adapters.map(a=>structuredClone(a.hull));
   assert.equal(s.nativeLaunch.courseRollerState(),(state72c<<16)>>16);
   // Earlier options cannot substitute a stale copy of the canonical72c.
   stepNativeRaceHost(h,.15,s.racers.map(()=>({})),{waterOptions:{rollerState72c:state72c===1?0:1}});
   assert.equal(s.raceWater.frames,3);assert.equal(s.raceWater.rollerFrames,3);
   assert.equal(s.raceWater.rollers[0].frames,activity===-1&&state72c!==1?3:0);
   assert.equal(h.primary.diagnostics().motionUpdates,activity===-1?3:0);
   assert.equal(h.floating.diagnostics().motionUpdates,activity===-1?3:0);
   assert.equal(h.world.ticks,simulation===0?0:15);
   if(simulation===0)assert.deepEqual(h.world.adapters.map(a=>a.hull),hulls);
   const before={water:captureRaceWater(s.raceWater),rollers:structuredClone(s.raceWater.rollers),owner:s.nativeLaunch.snapshot()};
   stepNativeRaceHost(h,1,s.racers.map(()=>({})),{active:false});
   assert.deepEqual({water:captureRaceWater(s.raceWater),rollers:structuredClone(s.raceWater.rollers),owner:s.nativeLaunch.snapshot()},before);
  }
 }
});

test('native host stamps after judging and both object arrays; object preview switches do not hold rollers',()=>{
 const retained=create().nativeLaunch.snapshot();Object.assign(retained.scene,{activity624:-1,simulation648:0,phase650:3});
 const s=create({course:rollerCourse(),nativeInitialRaceState:retained}),h=s.nativeHost,order=[];
 const roller=s.raceWater.rollers[0],onFrame=h.onFrame;let phase=roller.phaseIndex;
 h.onFrame=(host,context,ordinary)=>{
  order.push('judged');assert.ok(ordinary);assert.equal(roller.frames,context.logicalFrame-1);
  assert.equal(h.primary.diagnostics().outerFrames,context.logicalFrame-1);
  assert.equal(h.floating.diagnostics().outerFrames,context.logicalFrame-1);
  return onFrame(host,context,ordinary);
 };
 // Observe the actual roller phase write while retaining its original value.
 // Both immutable object owners must already have consumed this outer frame.
 Object.defineProperty(roller,'phaseIndex',{get:()=>phase,set:value=>{
  order.push('roller');assert.ok(h.lastOrdinary);
  assert.equal(h.primary.diagnostics().outerFrames,h.world.frames);
  assert.equal(h.floating.diagnostics().outerFrames,h.world.frames);phase=value;
 }});
 stepNativeRaceHost(h,.05,[{}]);assert.deepEqual(order,['judged','roller']);
 // Preview switches belong only to their corresponding object array.
 h.primaryActive=false;h.floatingActive=false;
 stepNativeRaceHost(h,.05,[{}]);assert.equal(s.raceWater.rollers[0].frames,2);
 assert.equal(h.primary.diagnostics().motionUpdates,1);assert.equal(h.floating.diagnostics().motionUpdates,1);
 assert.deepEqual(order,['judged','roller','judged','roller']);
});
