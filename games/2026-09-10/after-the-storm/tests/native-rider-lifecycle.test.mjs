import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider,authoredNativeRiderHistory} from '../authored-native-rider.js';
import {prepareNativeRiderWipeoutPose} from '../native-rider-wipeout-pose.js';
import {createNativeRiderLifecycle,nativeRiderLifecycleSource,decideNativeRiderLifecycle,finishNativeRiderLifecycle,nativeRiderLifecycleSnapshot} from '../native-rider-lifecycle.js';
import {createNativeImpactState,nativeImpactSnapshot,recordNativeImpact} from '../native-impact-state.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {stepNativeWaterFollowCamera} from '../native-water-schedule.js';

const v=(x=0,y=0,z=0)=>({x,y,z}),near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
function make(){const hull=createNativeHull({velocity:v(10,-2,3)}),bundle=createAuthoredNativeRider({initialHull:hull});
 return {hull,bundle,lifecycle:createNativeRiderLifecycle({hull,rider:bundle.articulatedRider,courseDatumNative:0})};}
const controls={throttle:true,pressedButtons:0,releasedButtons:0,heldButtons:0x8000};
function frame(impact){return {frameSpeedNative:30,wetCount:8,impacts:impact};}

test('lifecycle writes the actual twelve damping/velocity fields without integrating another position',()=>{
 const {hull,bundle,lifecycle}=make(),p=hull.points.map(p=>({...p.position})),motion=structuredClone({frame:hull.frame,center:hull.center,motionVelocity:hull.motionVelocity,motionDirection:hull.motionDirection});
 const impacts=createNativeImpactState();recordNativeImpact(impacts,{channel:'racer',incomingNative:12,normal:v(1)});
 const saved=hull.points.map(p=>p.damping);assert.deepEqual(saved,lifecycle.state.hullDamping);
 const decision=decideNativeRiderLifecycle(lifecycle,{completedFrame:frame(nativeImpactSnapshot(impacts)),simulationState:3,controls,manipulationAction:0});
 assert.equal(decision.state.crashCountdown,5);assert.equal(decision.state.actorState,22);
 for(const point of hull.points){assert.equal(point.damping,Math.fround(.999));near(point.velocity.x,5);near(point.velocity.y,-3.0000001192092896);near(point.velocity.z,4.500000178813934);}
 assert.deepEqual(hull.points.map(p=>p.position),p);assert.deepEqual({frame:hull.frame,center:hull.center,motionVelocity:hull.motionVelocity,motionDirection:hull.motionDirection},motion);
 assert.deepEqual(bundle.articulatedRider.jointWorld,bundle.articulatedRider.points[2].position);
 assert.throws(()=>nativeRiderLifecycleSource(lifecycle),/Complete/);
 finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:0},controls);assert.equal(nativeRiderLifecycleSource(lifecycle).crash,true);
});

test('physical initialization/delta recipes occur after five later decisions and never recapture crash damping',()=>{
 const {hull,bundle,lifecycle}=make(),rider=bundle.articulatedRider,saved=[...lifecycle.state.hullDamping],impacts=createNativeImpactState();
 recordNativeImpact(impacts,{channel:'racer',incomingNative:12,normal:v(1)});
 decideNativeRiderLifecycle(lifecycle,{completedFrame:frame(nativeImpactSnapshot(impacts)),simulationState:3,controls,manipulationAction:0});
 finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:0},controls);
 for(const p of rider.points)p.storedDelta=v(.1,-.2,.3);
 const zero=nativeImpactSnapshot(createNativeImpactState());
 for(let i=1;i<=5;i++){
  const d=decideNativeRiderLifecycle(lifecycle,{completedFrame:frame(zero),simulationState:3,controls,manipulationAction:0});
  assert.equal(d.state.actorState,i===5?23:22);finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:0},controls);
 }
 assert.deepEqual(lifecycle.state.hullDamping,saved);assert.ok(rider.points.every(p=>p.type===0));
 for(const p of rider.points){near(p.storedDelta.x,Math.fround(Math.fround(.1/.025)*Math.fround(.8))*.025);assert.equal(p.storedDelta.y,0);}
 const snapshot=nativeRiderLifecycleSnapshot(lifecycle);snapshot.state.hullDamping[0]=99;assert.notEqual(lifecycle.state.hullDamping[0],99);
});

function adapter(){
 const bundle=createAuthoredNativeRider({initialHull:createNativeHull()}),ordinary=bundle.riderPose;
 return createNativeRaceAdapter({...bundle,riderRecovery:{courseDatumNative:0},riderPose:(h,c)=>{
  if(c.actorState!==23)return {...ordinary(h,c),animationOutcome:{nextAnimationFrame:0}};
  const p=prepareNativeRiderWipeoutPose({positions:bundle.articulatedRider.points.map(p=>p.position),storedDeltas:bundle.articulatedRider.points.map(p=>p.storedDelta),
   center:h.center,...h.frame,scale:h.scale});
  return {...p,historyTargets:authoredNativeRiderHistory(bundle.articulatedRider.points.map(p=>p.position),bundle.restTargets),animationOutcome:{nextAnimationFrame:p.nextAnimationFrame}};
 },contacts:{racingBuoys:(h,c)=>{if(c.logicalFrame===0&&c.substep===4)c.recordImpact({channel:'racer',incomingNative:12,normal:v(1)});}}});
}

test('adapter keeps completed forces intact, mutes later countdown input and clears engine only on actor23 ticks',()=>{
 const a=adapter(),input={rawXNative:35,heldButtons:0x8000};stepNativeRaceAdapter(a,.05,input);
 assert.equal(a.lastControls.throttle,true);assert.equal(a.lastFrame.recovery.state.crashCountdown,5);assert.equal(a.lastFrame.actorState,22);
 const initialEngine=a.water.forceNative;assert.ok(initialEngine>0);
 for(let i=0;i<5;i++)stepNativeRaceAdapter(a,.05,input);
 assert.equal(a.lastFrame.actorState,23);assert.equal(a.lastFrame.controlActorState,22);
 assert.equal(a.lastControls.throttle,false);assert.equal(a.lastControls.heldButtons,0x8000);assert.ok(a.water.forceNative>0);
 stepNativeRaceAdapter(a,.01,input);assert.equal(a.frame.actorState,23);assert.equal(a.water.forceNative,0);
 const snapshot=nativeRaceSnapshot(a);snapshot.source.recovery.state.actorState=22;assert.equal(a.riderLifecycle.state.actorState,23);
});

test('inactive source lifecycle advances neither physical pose nor post-pose crouch factor',()=>{
 const a=adapter();stepNativeRaceAdapter(a,.05,{heldButtons:0x4000},{sourceState:{simulationState:0}});
 assert.equal(a.logicalFrames,1);assert.equal(a.articulatedRider.logicalFrames,0);assert.equal(a.riderLifecycle.state.lifecycleFrame,0);
 assert.equal(a.riderControlState.crouchFactor,Math.fround(.9));assert.equal(a.riderLifecycle.state.phase,'ready');
});

test('source water camera consumes the completed actor/frame instead of dropping the pose fields',()=>{
 const a=createNativeRaceAdapter({sourceState:{actorState:23,animationFrame:0}});
 const water=createRaceWater({crafts:[{x:0,y:0,z:0,heading:0}],baseAmplitudeNative:20,zoomIndex:3}),before=water.follows[0];
 const world=createNativeRaceWorld({adapters:[a],water});stepNativeRaceWorld(world,.05,[{}]);
 const h=a.hull,expected=stepNativeWaterFollowCamera(before,{positionNative:[h.center.x/.025,h.center.y/.025,h.center.z/.025],
  forwardXZ:[h.frame.forward.x,h.frame.forward.z],velocityXZ:[h.center.x/.025,h.center.z/.025],datumNative:0,zoomIndex:3,sourcePoseState:23,sourcePoseTimer:0});
 assert.deepEqual(water.follows[0],expected.state);
 const ordinary=stepNativeWaterFollowCamera(before,{positionNative:[h.center.x/.025,h.center.y/.025,h.center.z/.025],
  forwardXZ:[h.frame.forward.x,h.frame.forward.z],velocityXZ:[h.center.x/.025,h.center.z/.025],datumNative:0,zoomIndex:3,sourcePoseState:22,sourcePoseTimer:0});
 assert.notEqual(water.follows[0].liftOffsetNative,ordinary.state.liftOffsetNative);
});
