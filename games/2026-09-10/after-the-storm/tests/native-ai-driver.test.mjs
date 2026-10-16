import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeAIDriverState,prepareNativeAIDriver} from '../native-ai-driver.js';
import {createNativeAIRoute,createNativeAIRouteState,stepNativeAIRoute} from '../native-ai-route.js';
import {createNativeAITargetTable,prepareNativeAITarget} from '../native-ai-target.js';
import {createNativeWaterField} from '../native-water-field.js';
import {sampleNativeControls,createNativeControlState} from '../native-controls.js';
import {getCourse} from '../courses.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,latchNativeRaceAdapterControls} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {createRaceWater,captureRaceWater} from '../race-water.js';
const F=Math.fround;
const course=getCourse('greyhaven',0),route=createNativeAIRoute(course.sourceBuoyLayout);
const table=createNativeAITargetTable({route,nodes:course.sourceBuoyLayout.nodes});
function state(extra={}){return createNativeAIDriverState({racerIndex:0,avatar:2,role:0,turnBudgetDegrees:32,
 motionState:{previousMotionDirection:{x:0,y:0,z:1},recoveryPhase:0,stuckFrames:0,dryMarkedContact:0,offCircleBehindFrames:0,flagB0:0,flagB4:1},
 courseEscapeFrames:0,courseEscapeActive:false,dryFloorFrames:0,fieldE0:0,flag94:0,lastRawXNative:0,...extra});}
function input(){return {globals:{state650:3,state638:1,mode620:4,difficulty:0,courseIndex:1,reverse:false,players:1,primaryHumanIndex:0,
 datumNative:0,toggleD9914:0,trainingSelection:0,previousNavigationGlobal:0,chargeTimerNative:0},
 racers:[{body:{positionNative:{x:-2250,y:10,z:650},motionDirection:{x:0,y:0,z:1},forwardNative:{x:0,y:0,z:1},rightNative:{x:1,y:0,z:0},bodyUpY:1,
  steeringDegrees:30,actorState:22,pendingActorState:-1,animationFrame:0,priorControlActive:true,markedBox15de:0,fieldC7c:8,floorImpactNative:0,
  impactNormalNative:{x:0,y:0,z:0},rawXNative:0,rawYNative:0,heldButtons:0,powerFactor:1,frameSpeedNative:20,action16f4:0,actionState16d4:0},
  record:{place293c:0,sourceLap:0,navigationSourceRow:0,finished2c2c:0,record2c24:0}}],
 geometry:{selectionCircleNative:{x:0,z:0,radiusSquared:100000000},proximityObjectCentersNative:[],proximityCount:0,
  cameraCornersNative:[{x:-5000,z:-5000},{x:-5000,z:5000},{x:5000,z:-5000},{x:5000,z:5000}]},
 waterField:createNativeWaterField()};}

test('negative human result countdown runs the actual prepared AI driver in both driving and non-driving phases',()=>{
 for(const phase650 of [3,4]){
  const q=input(),s=state({role:-1});q.globals.state650=phase650;q.globals.chargeTimerNative=16;
  q.racers[0].record.finished2c2c=1;q.racers[0].body.powerFactor=1.125;
  const expected=prepareNativeAIDriver(table,s,q),initialHull=createNativeHull({rider:2});
  const bundle=createNativeLifecycleRider({initialHull});let calls=0;
  const a=createNativeRaceAdapter({riderIndex:2,...bundle,riderRecovery:{courseDatumNative:0,raceFinished:true},
   sourceState:{simulationState:3,phase650},sourceAIInput:(_,context)=>{
    calls++;assert.equal(context.selectionCountdown,-1);assert.equal(context.source.phase650,phase650);
    const r=prepareNativeAIDriver(table,s,q);return {...r.controls,action16f4:r.action16f4};
   }});
  latchNativeRaceAdapterControls(a,()=>{throw new Error('Human device must not be polled');});
  assert.equal(calls,1);assert.equal(expected.frame.phase,phase650===3?'driving':'start');
  assert.equal(a.lastControls.rawXNative,expected.controls.rawXNative);
  assert.equal(a.lastControls.workingXNative,expected.controls.rawXNative);
  assert.equal(a.lastControls.workingYNative,expected.controls.rawYNative);
  assert.equal(a.lastControls.basePowerFactor,expected.controls.basePowerFactor);
  assert.equal(a.actionState.override,expected.action16f4);
  assert.equal(a.controlOrigin,'human');assert.equal(a.computerProfile,false);
  if(phase650===3)assert.notEqual(expected.controls.rawXNative,0);
 }
});

test('driver composes original target, raw controls and shared input without changing its source snapshot or lattice',()=>{
 const s=state(),q=input(),before=structuredClone({s,globals:q.globals,racers:q.racers,geometry:q.geometry,field:q.waterField});
 const r=prepareNativeAIDriver(table,s,q);
 assert.equal(r.frame.phase,'driving');assert.deepEqual(r.frame.target.lookahead.map(x=>x.afterTargetSourceRow),[1,1]);
 assert.equal(r.frame.target.window.avatar,2);assert.equal(r.frame.target.window.navigationSourceRow,0);
 assert.equal(r.controls.controlOrigin,'ai');assert.equal(r.controls.heldButtons&0xa000,0xa000);
 assert.equal(r.state.lastRawXNative,r.frame.steering.rawXNative);
 assert.deepEqual({s,globals:q.globals,racers:q.racers,geometry:q.geometry,field:q.waterField},before);
 assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.controls));assert.ok(Object.isFrozen(r.state.motionState.previousMotionDirection));
 const shared=sampleNativeControls(createNativeControlState(),{...r.controls,tick:0,actorState:22,animationFrame:0,simulationState:1});
 assert.equal(shared.controlOrigin,'ai');assert.equal(shared.rawXNative,r.controls.rawXNative);assert.equal(shared.basePowerFactor,r.controls.basePowerFactor);
});
test('start branch preserves every retained AI field, action and previous power while skipping motion, water, traffic and tail',()=>{
 const s=state({fieldE0:7,flag94:5,courseEscapeFrames:42,courseEscapeActive:true,dryFloorFrames:51,lastRawXNative:-35});
 const q={globals:{state650:2,courseIndex:1,difficulty:0,chargeTimerNative:11},
  racers:[{body:{heldButtons:0xffff,powerFactor:1.125,action16f4:6},record:{navigationSourceRow:0}}]};
 const r=prepareNativeAIDriver(table,s,q);
 assert.equal(r.frame.phase,'start');assert.deepEqual(r.state,s);assert.equal(r.action16f4,6);
 assert.deepEqual(r.controls,{controlOrigin:'ai',rawXNative:0,rawYNative:0,heldButtons:0x5fff,basePowerFactor:1.125});
 assert.deepEqual(r.globalWrites,{});assert.equal(r.frame.window.avatar,2);
});
test('driver uses avatar identity independently of source slot and accepts a signed wrapped slow counter in steering',()=>{
 const q=input(),a=prepareNativeAIDriver(table,state({avatar:0}),q),b=prepareNativeAIDriver(table,state({avatar:2}),q);
 assert.notDeepEqual(a.frame.target.targetNativeXZ,b.frame.target.targetNativeXZ);
 const old=state({motionState:{...state().motionState,stuckFrames:2147483647}});q.racers[0].body.frameSpeedNative=0;
 const r=prepareNativeAIDriver(table,old,q);assert.equal(r.state.motionState.stuckFrames,-2147483648);
 assert.ok(Number.isInteger(r.controls.rawXNative));
});
test('actual triangular-plane water reads feed trim without stepping water history',()=>{
 const q=input();q.globals.mode620=11;q.racers[0].body.fieldC7c=1;q.waterField.heightQ.fill(8192);
 const before=structuredClone(q.waterField),r=prepareNativeAIDriver(table,state(),q);
 assert.ok(r.frame.waterHeightsNative.every(h=>h>20));assert.equal(r.frame.trim.rawYNative,70);
 assert.deepEqual(q.waterField,before);assert.equal(r.frame.waterPoints.length,2);
});
test('camera traffic is read only on the source branch that needs it',()=>{
 const q=input();q.racers[0].body.actorState=23;delete q.geometry.cameraCornersNative;
 const r=prepareNativeAIDriver(table,state(),q);assert.equal(r.frame.buttons.trafficTested,false);assert.equal(r.frame.trafficBlocked,null);
 q.racers[0].body.actorState=22;assert.throws(()=>prepareNativeAIDriver(table,state(),q),/cameraCornersNative/);
});
test('motion circle and proximity flags feed their distinct native downstream fields',()=>{
 const q=input();q.geometry.selectionCircleNative={x:100000,z:100000,radiusSquared:0};
 q.geometry.proximityObjectCentersNative=[{x:-2250,z:650}];q.geometry.proximityCount=1;
 const r=prepareNativeAIDriver(table,state({flag94:23}),q);
 assert.equal(r.frame.motion.nearObjects,true);assert.equal(r.frame.motion.withinSelectionCircle,false);
 assert.equal(r.controls.basePowerFactor,1);assert.equal(r.state.flag94,23);
});
test('power observes pre-tail steering while the later action request and raw axes remain visible to their consumer',()=>{
 const q=input(),b=q.racers[0].body;q.globals.mode620=11;q.globals.previousNavigationGlobal=12;
 q.racers[0].record.navigationSourceRow=13;q.geometry.selectionCircleNative={x:100000,z:100000,radiusSquared:0};
 const target=prepareNativeAITarget(table,{avatar:2,navigationSourceRow:13,positionNativeXZ:b.positionNative});
 const d=target.targetDirectionXZ;b.forwardNative={x:-d.z,y:0,z:d.x};b.motionDirection={...b.forwardNative};b.rightNative={x:d.x,y:0,z:d.z};
 b.actionState16d4=2;
 const s=state({motionState:{...state().motionState,previousMotionDirection:b.motionDirection}}),r=prepareNativeAIDriver(table,s,q);
 assert.equal(Math.abs(r.frame.steering.rawXNative),70);assert.equal(r.controls.basePowerFactor,1);
 assert.equal(r.controls.rawXNative,0);assert.equal(r.controls.rawYNative,70);assert.equal(r.action16f4,1);
 assert.equal(r.globalWrites.previousNavigationGlobal,13);assert.equal(r.state.lastRawXNative,r.frame.steering.rawXNative);
});
test('previous-navigation is an explicit shared word passed through successive selected-racer calls',()=>{
 const q=input();q.globals.mode620=11;q.globals.previousNavigationGlobal=6;q.racers[0].record.navigationSourceRow=7;
 const first=prepareNativeAIDriver(table,state(),q);assert.equal(first.action16f4,2);
 const second=prepareNativeAIDriver(table,state(),{...q,globals:{...q.globals,...first.globalWrites}});
 assert.equal(second.action16f4,0);assert.equal(second.globalWrites.previousNavigationGlobal,7);
 assert.equal(q.globals.previousNavigationGlobal,6);
});

test('an actual AI tail request reaches the shared adapter word and real pending action pose',()=>{
 const q=input();q.globals.mode620=11;q.globals.previousNavigationGlobal=6;q.racers[0].record.navigationSourceRow=7;
 const produced=prepareNativeAIDriver(table,state(),q);assert.equal(produced.action16f4,2);
 const initialHull=createNativeHull({rider:2}),bundle=createNativeLifecycleRider({initialHull});
 const a=createNativeRaceAdapter({riderIndex:2,controlOrigin:'ai',...bundle,riderRecovery:{courseDatumNative:0},
  sourceState:{simulationState:3,sourceTick:5000},
  riderActions:{inputHistory:{gestureTick15f0:4000,flag1600:1,sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0},
   idleFramesC6c:0,idleChoice16c4:0,source:{state650:3,gestureWindowNative:3,idleThresholdNative:1000,
    poseCompletion:{finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648:4}}}});
 // The producer's action is explicitly transported alongside its raw controls;
 // the actor is chosen only after the completed physical hull frame.
 const water=createRaceWater({crafts:[{x:0,z:0,heading:0}],baseAmplitudeNative:0,seed:17});
 const world=createNativeRaceWorld({adapters:[a],water});
 stepNativeRaceWorld(world,.05,[{...produced.controls,action16f4:produced.action16f4}]);
 assert.equal(a.actionState.override,0);assert.equal(a.riderLifecycle.state.pendingActor,9);
 assert.equal(a.lastFrame.controlActorState,22);assert.equal(a.lastControls.powerFactor,produced.controls.basePowerFactor);
 assert.equal(a.articulatedRider.logicalFrames,1);assert.equal(world.frames,1);
 assert.ok(a.articulatedRider.points.some(p=>Math.abs(p.storedDelta.x)+Math.abs(p.storedDelta.y)+Math.abs(p.storedDelta.z)>0));
});
test('driver failures preserve source state and reject unselected tables or missing source fields',()=>{
 const s=state(),q=input(),before=structuredClone({s,globals:q.globals,racers:q.racers,geometry:q.geometry});
 assert.throws(()=>prepareNativeAIDriver(table,s,{...q,globals:{...q.globals,courseIndex:2}}),/match the source course/);
 assert.throws(()=>prepareNativeAIDriver(table,s,{...q,waterField:null}),/native water field/);
 assert.throws(()=>prepareNativeAIDriver(table,s,{...q,globals:{...q.globals,primaryHumanIndex:1}}),/primaryHumanIndex/);
 assert.throws(()=>createNativeAIDriverState({}),/racerIndex/);
 assert.deepEqual({s,globals:q.globals,racers:q.racers,geometry:q.geometry},before);
});

test('moved buoy centers preserve initialized gates and persistent navigation through the complete driver',()=>{
 const nodes=[
  {sourceRow:0,x:0,z:0,tx:0,tz:1,classification:2,halfWidthNative:800},
  {sourceRow:1,x:20,z:30,tx:.600616455078125,tz:.7995372414588928,classification:0,halfWidthNative:0},
  {sourceRow:2,x:-25,z:42.5,tx:0,tz:-1,classification:1,halfWidthNative:0},
  {sourceRow:3,x:-22.5,z:-27.5,tx:1,tz:0,classification:3,halfWidthNative:500}
 ].map(n=>({...n,routeGroup:0,suppressed:false}));
 const movingTable=createNativeAITargetTable({route:createNativeAIRoute({nodes,courseIndex:1}),nodes});
 const q=input(),s=state({avatar:0});q.racers[0].body.positionNative={x:-1500,y:10,z:-1000};
 const own=q.racers[0];
 for(let i=1;i<4;i++)q.racers.push({body:{...own.body,positionNative:{x:-1500+75*i,y:10,z:-1000+100*i},frameSpeedNative:0},
  record:{...own.record,place293c:i}});
 q.geometry.nodePositionsNative=[{sourceRow:0,x:430,z:-170},{sourceRow:1,x:850,z:1125},{sourceRow:2,x:-1000,z:1700},{sourceRow:3,x:-900,z:-1100}];
 const before=structuredClone({table:movingTable,s,globals:q.globals,racers:q.racers,geometry:q.geometry,water:q.waterField});
 const r=prepareNativeAIDriver(movingTable,s,q);
 // Literal independently checked numeric outputs; the raw source fixture stays private.
 assert.deepEqual(r.controls,{controlOrigin:'ai',rawXNative:-40,rawYNative:-19,heldButtons:0,basePowerFactor:.7599999904632568});
 assert.deepEqual(r.frame.corrections.targetSegment,{originNativeXZ:{x:-1500,z:-1000},
  targetNativeXZ:{x:-763.283935546875,z:1605.3135986328125},directionXZ:{x:.2721046805381775,z:.9622676372528076},distanceNative:2707.472900390625});
 assert.equal(r.frame.target.window.navigationSourceRow,0);assert.equal(r.frame.target.window.targetSourceRow,2);
 assert.deepEqual(r.globalWrites,{previousNavigationGlobal:0});
 assert.deepEqual(movingTable.nodes[0].endpointPlusNativeXZ,{x:800,z:0});
 assert.deepEqual(movingTable.nodes[0].endpointMinusNativeXZ,{x:-800,z:0});
 assert.deepEqual({table:movingTable,s,globals:q.globals,racers:q.racers,geometry:q.geometry,water:q.waterField},before);
});

test('prepared four-driver inputs reach real mixed-profile hull/rider solvers once per outer frame at30/60/144Hz',()=>{
 let reference=null;
 for(const hz of[30,60,144]){
  // Explicit prepared ranks/circle/camera/starts isolate the actual driver,
  // navigation, controls and physical schedule. This is not a source grid,
  // ranking initializer, primary judge or complete original AI race replay.
  const avatars=[2,0,1,3],trace=[],history=[];
  const adapters=avatars.map((avatar,i)=>{
   const position={x:i*6,y:0,z:0},computerProfile=i!==0;
   const initialHull=createNativeHull({rider:avatar,position,computerProfile});
   return createNativeRaceAdapter({riderIndex:avatar,position,computerProfile,controlOrigin:'ai',
    ...createAuthoredNativeRider({initialHull}),sourceState:{actorState:22,animationFrame:0,simulationState:1}});
  });
  let driverStates=avatars.map((avatar,i)=>state({racerIndex:i,avatar,role:i-1,turnBudgetDegrees:avatar===3?24:32}));
  let navigation=avatars.map(avatar=>createNativeAIRouteState(route,{avatar,navigationSourceRow:0}));
  const water=createRaceWater({crafts:[{x:0,z:0,heading:0}],baseAmplitudeNative:10,seed:17});
  let sourceFrame,sharedNavigation=0,calls=0;
  const world=createNativeRaceWorld({adapters,water,humanIndices:[0],beforeFrame:w=>{
   for(let i=0;i<4;i++){
    trace.push('navigation'+i);const h=adapters[i].hull;
    navigation[i]=stepNativeAIRoute(route,navigation[i],{position:h.center}).state;
   }
   const prepared=input();prepared.globals.previousNavigationGlobal=sharedNavigation;
   prepared.racers=adapters.map((a,i)=>{
    const h=a.hull,c=a.lastControls,impact=a.lastFrame.impacts;
    return {body:{...prepared.racers[0].body,positionNative:{x:F(h.center.x/h.scale),y:F(h.center.y/h.scale),z:F(h.center.z/h.scale)},
     motionDirection:{...h.motionDirection},forwardNative:{...h.frame.forward},rightNative:{...h.frame.right},bodyUpY:h.frame.up.y,
     steeringDegrees:a.water.profile.steeringDegrees,priorControlActive:c?!c.muted:true,
     markedBox15de:Number(impact.markedBox),fieldC7c:a.water.wetCount,floorImpactNative:impact.floorImpactNative,
     impactNormalNative:{...impact.normal},rawXNative:c?.rawXNative??0,rawYNative:c?.rawYNative??0,heldButtons:c?.heldButtons??0,
     powerFactor:c?.powerFactor??1,frameSpeedNative:a.lastFrame.frameSpeedNative},
     record:{place293c:i,sourceLap:0,navigationSourceRow:navigation[i].navigationSourceRow,finished2c2c:0,record2c24:0}};
   });
   sourceFrame={...prepared,waterField:w.water.field};
  },afterFrame:w=>{
   history.push({ticks:w.ticks,controls:adapters.map(a=>structuredClone(a.lastControls)),states:structuredClone(driverStates)});
  }});
  const providers=adapters.map((a,i)=>()=>{
   calls++;trace.push('input'+i);
   const r=prepareNativeAIDriver(table,driverStates[i],{...sourceFrame,globals:{...sourceFrame.globals,previousNavigationGlobal:sharedNavigation}});
   assert.equal(r.action16f4,0);driverStates[i]=r.state;sharedNavigation=r.globalWrites.previousNavigationGlobal;
   return r.controls;
  });
  for(let i=0;i<hz;i++)stepNativeRaceWorld(world,1/hz,providers);
  assert.equal(calls,80);assert.equal(world.ticks,100);assert.equal(world.frames,20);
  assert.deepEqual(trace.slice(0,8),['navigation0','navigation1','navigation2','navigation3','input3','input2','input1','input0']);
  assert.ok(adapters.every(a=>a.articulatedRider.logicalFrames===20&&a.lastControls.controlOrigin==='ai'));
  const result={world:nativeRaceWorldSnapshot(world),water:captureRaceWater(water),states:driverStates,navigation,history,trace};
  if(reference)assert.deepEqual(result,reference);else reference=structuredClone(result);
  const paused=structuredClone(result);
  for(let i=0;i<10;i++){stepNativeRaceWorld(world,.5,providers,{active:false});nativeRaceWorldSnapshot(world);}
  assert.equal(calls,80);assert.deepEqual({world:nativeRaceWorldSnapshot(world),water:captureRaceWater(water),states:driverStates,navigation,history,trace},paused);
 }
});
