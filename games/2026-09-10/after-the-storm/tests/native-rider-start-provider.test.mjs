import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRiderStartPoseProvider,prepareNativeRiderStartSeed,NATIVE_RIDER_START_TYPES} from '../native-rider-start-provider.js';
import {nativeRiderStartFrameView,prepareNativeRiderStartPose} from '../native-rider-start-pose.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {prepareNativeRiderRest} from '../native-articulated-rider.js';

// Explicit independently authored numeric records, never original animation.
// These exercise the ACTUAL numeric evaluator and physical startup/solves.
// Their dimensions are not claimed as equivalent high-resolution artwork.
const F=Math.fround,AXES=['x','y','z'],xyz=(x=0,y=0,z=0)=>({x,y,z});
const origins=[[-4,1,10],[-4,17,8],[-3,32,5],[4,1,10],[4,17,8],[3,32,5],[0,35,4],
 [0,50,2],[-20,35,10],[-15,42,7],[-7,48,2],[20,35,10],[15,42,7],[7,48,2],
 [0,35,4],[0,13,-4],[0,13,37],[0,0,0]];
const YAW={field1434:0,field1438:1,field143c:1,field1440:0};
function selected(view){return {evaluatedAnimationFrame:view.evaluatedAnimationFrame,records:origins.map(p=>({
 coordinatesS16:p.map((v,j)=>v*10+(j===1?view.evaluatedAnimationFrame-56:0)),
 firstDirectionS8:[0,0,127],secondDirectionS8:[0,127,0]}))};}
function provider({scale=.025,readYawFrame=()=>YAW,selectFrame=selected}={}){
 return createNativeRiderStartPoseProvider({scale,readYawFrame,selectFrame});
}
const scaled=(p,s)=>Object.fromEntries(AXES.map(k=>[k,p[k]*s]));
function numeric(hull,frame=56,yaw=YAW){
 const frameView=nativeRiderStartFrameView({animationFrame:frame});
 return prepareNativeRiderStartPose({frameView,selectedFrame:selected(frameView),bodyNative:{
  position:Object.fromEntries(AXES.map(k=>[k,F(hull.center[k]/hull.scale)])),
  ...Object.fromEntries(['right','up','forward'].map(k=>[k,Object.fromEntries(AXES.map(a=>[a,F(hull.frame[k][a])]))])),yawFrame:yaw}});
}
const finite=points=>points.every(p=>AXES.every(k=>Number.isFinite(p.position[k])&&Number.isFinite(p.storedDelta[k])));
function fixture({sourceState={simulationState:1,phase650:1},rider=0}={}){
 const hull=createNativeHull({rider}),p=provider(),bundle=createNativeLifecycleRider({initialHull:hull,startPoseProvider:p,initializeStart:true});
 const a=createNativeRaceAdapter({riderIndex:rider,...bundle,sourceState,
  riderRecovery:{courseDatumNative:0,...bundle.initialRiderRecovery}});
 return {hull,p,bundle,a};
}

test('selected-record bridge places the numeric nineteen-plus-six result in world units exactly once',()=>{
 for(const scale of [.01,.025,.1]){
  const hull=createNativeHull({scale,position:xyz(2.5,-.75,5),pitch:.4,heading:.3}),before=structuredClone(hull);
  const p=provider({scale}),actual=p.evaluate({hull,animationFrame:56}),expected=numeric(hull);
  assert.deepEqual(actual.targets,expected.targetsNative.map(q=>scaled(q,scale)));
  assert.deepEqual(actual.auxiliaryTargets,expected.auxiliaryTargetsNative.map(q=>scaled(q,scale)));
  assert.equal(actual.nextAnimationFrame,57);assert.deepEqual(hull,before);
  assert.ok(Object.isFrozen(actual.targets[0]));assert.match(actual.provenance.geometry,/no animation data or anatomical resizing/);
 }
});

test('requested descriptor/frame reaches the record owner without a private provider clock or cache',()=>{
 const reads=[],contexts=[],context={logicalFrame:17},hull=createNativeHull();
 const p=provider({selectFrame:(view,c)=>{assert.ok(Object.isFrozen(view));reads.push(view);contexts.push(c);return selected(view);}});
 for(const frame of [56,84,57,100,56]){
  const out=p.evaluate({hull,animationFrame:frame,context});
  assert.equal(out.evaluatedAnimationFrame,Math.min(frame,84));assert.equal(out.nextAnimationFrame,frame>=84?-1:frame+1);
 }
 assert.deepEqual(reads.map(v=>v.requestedAnimationFrame),[56,84,57,100,56]);assert.ok(contexts.every(c=>c===context));
 assert.ok(reads.every(v=>v.descriptorIndex===7&&v.frameCount===85));
});

test('the four retained yaw words remain independent of pitch and are read afresh for a vertical hull',()=>{
 const hull=createNativeHull();hull.frame={right:xyz(1),up:xyz(0,0,-1),forward:xyz(0,1)};
 let yaw=YAW;const p=provider({readYawFrame:()=>yaw}),a=p.evaluate({hull,animationFrame:56});
 yaw={field1434:1,field1438:0,field143c:0,field1440:-1};
 const b=p.evaluate({hull,animationFrame:56}),expected=numeric(hull,56,yaw);
 assert.deepEqual(b.targets,expected.targetsNative.map(q=>scaled(q,.025)));
 assert.notDeepEqual(a.targets[2],b.targets[2]);assert.deepEqual(a.targets[9],b.targets[9]);
 assert.deepEqual(a.auxiliaryTargets,b.auxiliaryTargets,'full-hull auxiliary records do not inherit the separate yaw frame');
});

test('bad selected records, source yaw, scales and frames fail before touching the physical hull',()=>{
 const hull=createNativeHull(),before=structuredClone(hull),p=provider();
 assert.throws(()=>p.evaluate({hull:{...hull,scale:.1},animationFrame:56}),/scales must match/);
 for(const animationFrame of [-1,1.5,NaN])assert.throws(()=>p.evaluate({hull,animationFrame}),/animationFrame/);
 assert.throws(()=>provider({readYawFrame:()=>undefined}).evaluate({hull,animationFrame:56}),/yawFrame/);
 assert.throws(()=>provider({selectFrame:()=>({...selected(nativeRiderStartFrameView({animationFrame:56})),evaluatedAnimationFrame:57})}).evaluate({hull,animationFrame:56}),/evaluated animation frame/);
 assert.throws(()=>createNativeRiderStartPoseProvider({scale:.025,selectFrame:selected}),/readYawFrame/);
 assert.throws(()=>createNativeRiderStartPoseProvider({scale:.025,readYawFrame:()=>YAW}),/selectFrame/);
 assert.throws(()=>prepareNativeRiderStartSeed({evaluate:()=>({})},{hull}),/selected-record start provider/);
 assert.deepEqual(hull,before);
});

test('startup seed is the evaluated frame56 result with exact source point types and no solve',()=>{
 const hull=createNativeHull(),p=provider(),seed=prepareNativeRiderStartSeed(p,{hull}),pose=p.evaluate({hull,animationFrame:56});
 assert.equal(seed.actorState,15);assert.equal(seed.animationFrame,56);assert.equal(seed.physicalMode,1);
 assert.deepEqual(seed.types,NATIVE_RIDER_START_TYPES);assert.deepEqual(seed.positions,pose.targets);
 assert.deepEqual(seed.auxiliaryPositions,pose.auxiliaryTargets);assert.ok(Object.isFrozen(seed.positions[0]));
});

test('lifecycle initialization seeds actual body/auxiliary owners once while retaining independent rest mechanics',()=>{
 const hull=createNativeHull(),ordinary=createNativeLifecycleRider({initialHull:hull}),p=provider();
 let evaluations=0;const counted=provider({selectFrame:view=>{evaluations++;return selected(view);}});
 const bundle=createNativeLifecycleRider({initialHull:hull,startPoseProvider:counted,initializeStart:true});
 const seed=prepareNativeRiderStartSeed(p,{hull}),body=bundle.articulatedRider,aux=bundle.anchorState;
 assert.equal(evaluations,1);assert.equal(body.logicalFrames,0);assert.equal(aux.logicalFrames,0);
 assert.deepEqual(body.restLengths,ordinary.articulatedRider.restLengths,'never infer mechanical rest lengths from the starting pose');
 assert.equal(aux.radiusWorld,ordinary.anchorState.radiusWorld,'circle radius remains the independent authored rig input');
 assert.deepEqual(body.points.map(q=>q.position),seed.positions);assert.deepEqual(aux.points.map(q=>q.position),seed.auxiliaryPositions);
 assert.deepEqual(body.points.map(q=>q.type),NATIVE_RIDER_START_TYPES);assert.deepEqual(body.jointWorld,seed.positions[2]);
 assert.ok([...body.points,...aux.points].every(q=>AXES.every(k=>q.storedDelta[k]===0)));
 assert.equal(aux.mode,1);assert.deepEqual(aux.anchors,{2:seed.auxiliaryPositions[3],3:seed.auxiliaryPositions[4]});
 assert.equal(bundle.initialRiderRecovery.state.actorState,15);assert.equal(bundle.initialRiderRecovery.state.animationFrame,56);
 assert.equal(bundle.initialRiderRecovery.state.lifecycleFrame,0);assert.equal(bundle.initialRiderRecovery.physicalMode,1);
 assert.notDeepEqual(body.restLengths,prepareNativeRiderRest(seed.positions));
});

test('physical actor15 holds on phase1, advances on phase2, then completes the real ordinary blend',()=>{
 const scene={simulationState:1,phase650:1},h=fixture({sourceState:()=>scene}),{a,bundle}=h;
 for(let i=0;i<4;i++)stepNativeRaceAdapter(a,.05,{heldButtons:0x8000});
 assert.equal(a.riderLifecycle.state.animationFrame,56);assert.equal(a.lastControls.throttle,false);
 assert.equal(a.articulatedRider.logicalFrames,4);assert.equal(bundle.anchorState.logicalFrames,4);
 assert.notDeepEqual(a.articulatedRider.points.map(p=>p.position),prepareNativeRiderStartSeed(h.p,{hull:h.hull}).positions,'real constraints run while the source frame is held');
 scene.phase650=2;scene.simulationState=3;
 let blend=false;
 for(let i=0;i<42;i++){
  stepNativeRaceAdapter(a,.05,{heldButtons:0x8000});
  blend||=a.riderLifecycle.state.pendingActor===22;
  assert.ok(finite(a.articulatedRider.points)&&finite(bundle.anchorState.points));
  assert.equal(a.articulatedRider.logicalFrames,bundle.anchorState.logicalFrames);
  assert.deepEqual(a.articulatedRider.jointWorld,a.articulatedRider.points[2].position);
 }
 assert.ok(blend);assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(a.riderLifecycle.state.pendingActor,-1);
 assert.equal(a.articulatedRider.logicalFrames,46);assert.equal(a.logicalFrames,46);
});

test('the start provider is not sampled per hull tick, and blended poses still resolve one auxiliary/body solve',()=>{
 const reads=[],hull=createNativeHull(),p=provider({selectFrame:view=>{reads.push(view.requestedAnimationFrame);return selected(view);}});
 const bundle=createNativeLifecycleRider({initialHull:hull,startPoseProvider:p,initializeStart:true});
 const a=createNativeRaceAdapter({...bundle,sourceState:{simulationState:3,phase650:2},
  riderRecovery:{courseDatumNative:0,...bundle.initialRiderRecovery}});
 assert.deepEqual(reads,[56]);
 for(let i=0;i<4;i++)stepNativeRaceAdapter(a,.01,{heldButtons:0});
 assert.deepEqual(reads,[56]);assert.equal(a.articulatedRider.logicalFrames,0);
 stepNativeRaceAdapter(a,.01,{heldButtons:0});assert.deepEqual(reads,[56,56]);
 for(let i=0;i<40;i++){
  stepNativeRaceAdapter(a,.05,{heldButtons:0});
  assert.equal(bundle.anchorState.logicalFrames,a.logicalFrames);assert.equal(a.articulatedRider.logicalFrames,a.logicalFrames);
 }
 assert.equal(reads.filter(f=>f===84).length,7,'terminal84 is evaluated at the request and six subsequent .15-rate blend completions');
 assert.equal(a.riderLifecycle.state.actorState,22);
});

test('the actual startup and physical solution are identical across30/60/144Hz rendering',()=>{
 function run(hz){
  const {a,bundle}=fixture({sourceState:(_h,c)=>({simulationState:c.logicalFrame<5?1:3,phase650:c.logicalFrame<5?1:2})});
  for(let i=0;i<3*hz;i++)stepNativeRaceAdapter(a,1/hz,{heldButtons:0x8000});
  return {snapshot:nativeRaceSnapshot(a),body:structuredClone(a.articulatedRider),aux:structuredClone(bundle.anchorState)};
 }
 const expected=run(60);assert.equal(expected.snapshot.source.actorState,22);
 for(const hz of [30,144])assert.deepEqual(run(hz),expected);
});

test('two physical starting riders finish a shared phase before post-water scene changes',()=>{
 const scene={simulationState:1,phase650:1},riders=[0,1].map(rider=>fixture({rider,sourceState:()=>scene}));
 const adapters=riders.map(h=>h.a),frames=[];
 const water=createRaceWater({crafts:adapters.map(a=>({...a.hull.center,sourceForwardXZ:[0,1]})),baseAmplitudeNative:20,seed:29,initialNoise:false});
 const world=createNativeRaceWorld({adapters,water,humanIndices:[0,1],craftContacts:false,afterFrame:w=>{
  frames.push(w.adapters.map(a=>a.riderLifecycle.state.animationFrame));scene.phase650=2;scene.simulationState=3;
 }});
 stepNativeRaceWorld(world,.05,[{heldButtons:0x8000},{heldButtons:0}]);assert.deepEqual(frames,[[56,56]]);
 stepNativeRaceWorld(world,.05,[{heldButtons:0x8000},{heldButtons:0}]);assert.deepEqual(frames,[[56,56],[57,57]]);
 assert.deepEqual(adapters.map(a=>a.articulatedRider.logicalFrames),[2,2]);assert.equal(water.frames,2);
});

test('ordinary lifecycle construction stays ordinary and missing actual startup yaw rejects explicitly',()=>{
 const hull=createNativeHull(),before=structuredClone(hull),bundle=createNativeLifecycleRider({initialHull:hull});
 assert.equal(bundle.initialRiderRecovery,undefined);assert.equal(bundle.articulatedRider.logicalFrames,0);
 assert.throws(()=>createNativeLifecycleRider({initialHull:hull,initializeStart:true}),/retained yawFrame/);
 assert.throws(()=>createNativeLifecycleRider({initialHull:hull,initializeStart:'yes'}),/initializeStart/);
 assert.throws(()=>createNativeLifecycleRider({initialHull:hull,startPoseProvider:{}}),/startPoseProvider/);
 assert.deepEqual(hull,before);
});
