import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeRecoveryVerificationInput} from '../native-recovery-verification.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {captureRaceWater} from '../race-water.js';

function drive(hz){
 const state=createRace({mode:'time',course:getCourse('greyhaven'),physics:'native',waveSeed:17});
 const host=state.nativeHost,a=host.world.adapters[0],bundle=host.bundles[0],layout=structuredClone(state.course.sourceBuoyLayout);
 const saved=a.hull.points.map(p=>p.damping),events=[],contacts=[];let previous='',stamp=-1;
 const actualContact=a.contacts.racingBuoys;
 a.contacts={...a.contacts,racingBuoys(h,c){actualContact(h,c);contacts.push(...host.primary.diagnostics(h).hull.last);}};
 for(let i=0;i<15*hz;i++){
  stepRace(state,()=>nativeRecoveryVerificationInput(state),1/hz);
  if(a.logicalFrames===stamp)continue;stamp=a.logicalFrames;
  const q=a.lastFrame.recovery.state,key=[q.actorState,q.pendingActor,q.crashCountdown,q.crashDampingLatch].join(',');
  if(key!==previous){events.push({frame:stamp,key,state:structuredClone(q),impact:a.lastFrame.impacts.primaryBuoyImpactNative,
   audioRiderEvent:state.nativeContactAudio.snapshot().packets[0][21]});previous=key;}
  assert.equal(a.articulatedRider.logicalFrames,host.world.frames);assert.equal(bundle.anchorState.logicalFrames,host.world.frames);
  for(const p of a.articulatedRider.points)assert.ok(Object.values(p.position).every(Number.isFinite));
 }
 assert.deepEqual(state.course.sourceBuoyLayout,layout,'the drive never changes source admission or geometry');
 assert.ok(contacts.some(c=>c.sourceRow===2&&c.channel==='primaryBuoy'),'the actual primary kernel finds the buoy from the ordinary grid drive');
 const trigger=events.find(e=>e.state.crashCountdown===5);assert.ok(trigger&&trigger.impact>10,'actual incoming contact exceeds the severe threshold');
 assert.equal(trigger.audioRiderEvent,2,'the live sound packet observes the crash countdown before the falling actor begins');
 const fall=events.find(e=>e.state.actorState===23);assert.equal(fall.frame-trigger.frame,5);
 assert.deepEqual(events.filter(e=>e.state.pendingActor<0).map(e=>e.state.actorState).filter((v,i,all)=>i===0||v!==all[i-1]),[15,22,23,7,22]);
 const restore=events.find(e=>e.state.actorState===7&&!e.state.crashDampingLatch);assert.equal(restore.state.animationFrame,56);
 assert.equal(restore.audioRiderEvent,0,'remount frame56 ends the rider-event signal');
 assert.equal(state.nativeContactAudio.snapshot().packets[0][28],1,'remount frame58 latches its event until the engine consumer acknowledges it');
 assert.equal(a.lastFrame.actorState,22);assert.equal(a.riderLifecycle.state.pendingActor,-1);assert.equal(a.riderLifecycle.state.crashDampingLatch,false);
 assert.deepEqual(a.hull.points.map(p=>p.damping),saved);assert.deepEqual(nativeRecoveryVerificationInput(state),{throttle:0,steer:0});
 assert.equal(state.time,15);assert.equal(host.world.ticks,1500);assert.equal(state.raceWater.frames,300);
 return {state,events};
}

test('ordinary grid input strikes a real buoy and recovers with actual hull, water and rider solves',()=>{drive(60);});

test('the collision-triggered recovery and all physical histories match at30/60/144Hz',()=>{
 let reference=null;
 for(const hz of [30,60,144]){
  const {state,events}=drive(hz),host=state.nativeHost,a=host.world.adapters[0];
  const result={native:nativeRaceSnapshot(a),points:a.articulatedRider.points,anchors:host.bundles[0].anchorState,
   water:captureRaceWater(state.raceWater),buoys:host.primary.snapshot(),progress:state.racers[0].sourceBuoys,events};
  if(reference)assert.deepEqual(result,reference);else reference=structuredClone(result);
 }
});

test('inspection input copies cannot mutate physics and inactive phases release every control',()=>{
 const state=createRace({mode:'time',course:getCourse('greyhaven'),physics:'native'}),a=state.nativeHost.world.adapters[0];
 const before=nativeRaceSnapshot(a);assert.deepEqual(nativeRecoveryVerificationInput(state),{throttle:0,steer:0});
 state.phase='running';const input=nativeRecoveryVerificationInput(state),held={...input};input.steer=999;
 assert.deepEqual(nativeRecoveryVerificationInput(state),held);assert.deepEqual(nativeRaceSnapshot(a),before);
 state.phase='paused';assert.deepEqual(nativeRecoveryVerificationInput(state),{throttle:0,steer:0});assert.deepEqual(nativeRaceSnapshot(a),before);
 assert.throws(()=>nativeRecoveryVerificationInput({...state,physics:'modern'}),/native Sunny/);
 assert.throws(()=>nativeRecoveryVerificationInput({...state,course:getCourse('greyhaven',1)}),/native Sunny/);
});
