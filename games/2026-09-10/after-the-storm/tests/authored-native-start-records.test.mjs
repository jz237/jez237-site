import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthoredNativeStartRecords} from '../authored-native-start-records.js';
import {nativeRiderStartFrameView,nativeRiderStartAnatomy} from '../native-rider-start-pose.js';
import {createNativeRiderStartPoseProvider,NATIVE_RIDER_START_TYPES} from '../native-rider-start-provider.js';
import {createNativeHullFromStart,prepareNativeHullStartFromPose} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';

// New authored anatomy and launch movement, evaluated through the real numeric
// actor15 path and physical solves. No original frame coordinates are fixtures.
const AXES=['x','y','z'],copy=p=>({...p}),distance=(a,b)=>Math.hypot(...AXES.map(k=>a[k]-b[k]));
function near(a,b,e=1e-6){assert.ok(Math.abs(a-b)<=e,`${a} != ${b} (tolerance${e})`);}
function local(p,h){const d=AXES.map(k=>p[k]-h.center[k]);return Object.fromEntries(['right','up','forward'].map((v,i)=>
 [AXES[i],AXES.reduce((n,k,j)=>n+d[j]*h.frame[v][k],0)/h.scale]));}
function setup(options={}){
 const hullStart=prepareNativeHullStartFromPose(options),hull=createNativeHullFromStart({prepared:hullStart,...options});
 const ordinary=createNativeLifecycleRider({initialHull:hull});
 const rest=ordinary.restTargets.map(p=>local(p,hull));
 const art=createAuthoredNativeStartRecords({scale:hull.scale,restTargetsLocal:rest,anchorRig:ordinary.anchorRig});
 const p=createNativeRiderStartPoseProvider({scale:hull.scale,...art,readYawFrame:h=>h.yawFrame});
 return {hullStart,hull,ordinary,rest,art,p};
}
function physical({rider=0,sourceState={simulationState:1,phase650:1}}={}){
 const h=setup({rider}),bundle=createNativeLifecycleRider({initialHull:h.hull,initializeStart:true});
 const a=createNativeRaceAdapter({riderIndex:rider,hullStart:h.hullStart,...bundle,sourceState,
  riderRecovery:{courseDatumNative:0,...bundle.initialRiderRecovery}});
 return {...h,bundle,a};
}
const positions=b=>b.articulatedRider.points.map(p=>copy(p.position));

test('launch dimensions come from the detailed neutral anatomy and steering supports',()=>{
 const h=setup(),a=h.art.anatomy,r=h.rest,s=h.hull.scale;
 near(Math.sqrt(a.armUpperSquaredNative)*s,distance(h.ordinary.restTargets[3],h.ordinary.restTargets[4]));
 near(Math.sqrt(a.armLowerSquaredNative)*s,distance(h.ordinary.restTargets[4],h.ordinary.restTargets[5]));
 near(a.shoulderHalfSpanNative*2,distance(r[3],r[11]));near(a.headExtensionNative,distance(r[0],r[1]));
 near(a.gripExtensionNative,distance(r[5],r[6]));near(a.toeExtensionNative,distance(r[9],r[10]));
 near(a.auxiliaryGripHalfSpanNative*2,distance(r[6],r[14]));
 near(a.auxiliarySupportSpanNative*s,distance(h.ordinary.anchorRig.supportA,h.ordinary.anchorRig.supportB));
 assert.notDeepEqual(a,nativeRiderStartAnatomy());assert.ok(Object.isFrozen(a));
 assert.match(h.art.provenance.compatibility,/not original records/);assert.match(h.p.provenance.anatomy,/adapted/);
});

test('the final authored launch sample rejoins the actual neutral model within signed-record quantization',()=>{
 const h=setup(),out=h.p.evaluate({hull:h.hull,animationFrame:84}),rest=h.ordinary.restTargets;
 for(let i=0;i<19;i++)assert.ok(distance(out.targets[i],rest[i])<.005,`role${i}: ${distance(out.targets[i],rest[i])}`);
 assert.equal(out.nextAnimationFrame,-1);near(distance(out.targets[3],out.targets[11]),.45,1e-6);
 for(const [a,b]of [[3,4],[4,5],[11,12],[12,13]])near(distance(out.targets[a],out.targets[b]),distance(rest[a],rest[b]),1e-5);
});

test('ordinary boarding keeps the hips above the modern saddle and lifts the legs from the rear step into riding',()=>{
 const h=setup(),first=h.p.evaluate({hull:h.hull,animationFrame:56}),last=h.p.evaluate({hull:h.hull,animationFrame:84});
 const lifted=h.p.evaluate({hull:h.hull,animationFrame:61});
 assert.ok(lifted.targets[2].y>last.targets[2].y+.4);assert.ok(first.targets[2].z<last.targets[2].z-.15);
 assert.ok(first.targets[9].z<last.targets[9].z-.8&&first.targets[17].z<last.targets[17].z-.8);
 near(first.targets[2].x,0,1e-7);
 for(const i of [5,6,13,14])assert.ok(distance(first.targets[i],last.targets[i])<1e-7,'hands remain at the authored bars');
 assert.ok(first.targets[1].y<last.targets[1].y-.3);
});

test('all selected frames are finite signed records with preserved modern arm/head/hand/foot dimensions',()=>{
 const h=setup(),rest=h.ordinary.restTargets;
 for(let frame=56;frame<=84;frame++){
  const view=nativeRiderStartFrameView({animationFrame:frame}),selected=h.art.selectFrame(view);
  assert.equal(selected.records.length,18);assert.equal(selected.evaluatedAnimationFrame,frame);
  for(const r of selected.records){
   assert.ok(r.coordinatesS16.every(n=>Number.isInteger(n)&&n>=-32768&&n<=32767));
   assert.ok([...r.firstDirectionS8,...r.secondDirectionS8].every(n=>Number.isInteger(n)&&n>=-128&&n<=127));
  }
  const out=h.p.evaluate({hull:h.hull,animationFrame:frame});
  assert.ok([...out.targets,...out.auxiliaryTargets].every(p=>AXES.every(k=>Number.isFinite(p[k]))));
  near(distance(out.targets[3],out.targets[11]),distance(rest[3],rest[11]),2e-6);
  assert.ok(out.targets[2].y>=rest[2].y-.003,'authored hips clear the saddle throughout boarding');
  assert.ok(out.targets[9].y>=.38&&out.targets[17].y>=.38,'authored ankles clear the detailed foot decks');
  for(const [a,b]of [[3,4],[4,5],[11,12],[12,13]])near(distance(out.targets[a],out.targets[b]),distance(rest[a],rest[b]),1e-5);
  for(const [a,b]of [[0,1],[5,6],[9,10],[13,14],[17,18]])near(distance(out.targets[a],out.targets[b]),distance(rest[a],rest[b]),.002);
 }
});

test('record seeking is pure and independent of evaluation order or caller mutations',()=>{
 const h=setup(),view=nativeRiderStartFrameView({animationFrame:61}),a=h.art.selectFrame(view);
 h.art.selectFrame(nativeRiderStartFrameView({animationFrame:84}));h.art.selectFrame(nativeRiderStartFrameView({animationFrame:56}));
 assert.deepEqual(h.art.selectFrame(view),a);a.records[0].coordinatesS16[0]=32767;
 assert.notDeepEqual(h.art.selectFrame(view),a);
 const out=h.p.evaluate({hull:h.hull,animationFrame:100});assert.equal(out.evaluatedAnimationFrame,84);assert.equal(out.nextAnimationFrame,-1);
 assert.throws(()=>h.art.selectFrame(nativeRiderStartFrameView({animationFrame:55})),/starts at frame56/);
 assert.throws(()=>h.art.selectFrame({...view,nextAnimationFrame:1}),/actual descriptor7/);
});

test('native translation and yaw rotate the complete detailed launch instead of scaling world coordinates twice',()=>{
 const a=setup(),b=setup({position:{x:12,y:3,z:-7},heading:Math.PI/2});
 for(const frame of [56,61,74,84]){
  const pa=a.p.evaluate({hull:a.hull,animationFrame:frame}),pb=b.p.evaluate({hull:b.hull,animationFrame:frame});
  for(let i=0;i<19;i++){
   near(pb.targets[i].x,12+pa.targets[i].z,1e-5);near(pb.targets[i].y,3+pa.targets[i].y,1e-5);
   near(pb.targets[i].z,-7-pa.targets[i].x,1e-5);
  }
 }
});

test('invalid dimensions and asymmetric or collapsed anatomy reject without mutating caller input',()=>{
 const h=setup(),input={scale:.025,restTargetsLocal:structuredClone(h.rest),anchorRig:structuredClone(h.ordinary.anchorRig)},before=structuredClone(input);
 const malformed={...nativeRiderStartAnatomy()};delete malformed.gripExtensionNative;
 assert.throws(()=>nativeRiderStartAnatomy(malformed),/all twelve/);
 for(const v of [-1,-1e-100,NaN,Infinity])assert.throws(()=>nativeRiderStartAnatomy({...h.art.anatomy,auxiliaryAlongNative:v}),/anatomy/);
 assert.throws(()=>nativeRiderStartAnatomy({...h.art.anatomy,armUpperSquaredNative:0}),/anatomy/);
 const asymmetric=structuredClone(input);asymmetric.restTargetsLocal[12].x+=3;
 assert.throws(()=>createAuthoredNativeStartRecords(asymmetric),/symmetric/);
 const collapsed=structuredClone(input);collapsed.restTargetsLocal[4]=copy(collapsed.restTargetsLocal[3]);
 assert.throws(()=>createAuthoredNativeStartRecords(collapsed),/collapsed link/);
 assert.deepEqual(input,before);assert.equal(Object.isFrozen(input.restTargetsLocal[0]),false);
});

test('default high-resolution launch initializes physical positions without changing independent neutral rest mechanics',()=>{
 const h=physical(),{a,bundle}=h,expected=h.p.evaluate({hull:h.hull,animationFrame:56});
 assert.equal(a.riderLifecycle.state.actorState,15);assert.equal(a.riderLifecycle.state.animationFrame,56);
 assert.deepEqual(positions(bundle),expected.targets);assert.deepEqual(a.articulatedRider.points.map(p=>p.type),NATIVE_RIDER_START_TYPES);
 assert.deepEqual(a.articulatedRider.restLengths,h.ordinary.articulatedRider.restLengths);
 assert.equal(bundle.anchorState.radiusWorld,h.ordinary.anchorState.radiusWorld);
 assert.equal(a.articulatedRider.logicalFrames,0);assert.equal(bundle.anchorState.logicalFrames,0);
 assert.ok([...a.articulatedRider.points,...bundle.anchorState.points].every(p=>AXES.every(k=>p.storedDelta[k]===0)));
 assert.deepEqual(a.articulatedRider.jointWorld,expected.targets[2]);
});

test('the default detailed launch runs physical holds, advances and returns through the actual source blend',()=>{
 const scene={simulationState:1,phase650:1},h=physical({sourceState:()=>scene}),{a,bundle}=h;
 for(let i=0;i<5;i++)stepNativeRaceAdapter(a,.05,{heldButtons:0x8000});
 assert.equal(a.riderLifecycle.state.animationFrame,56);assert.equal(a.lastControls.throttle,false);
 assert.equal(a.articulatedRider.logicalFrames,5);assert.equal(bundle.anchorState.logicalFrames,5);
 assert.notDeepEqual(positions(bundle),h.p.evaluate({hull:h.hull,animationFrame:56}).targets);
 scene.simulationState=3;scene.phase650=2;let requested=false;
 for(let i=0;i<40;i++){
  stepNativeRaceAdapter(a,.05,{heldButtons:0});requested||=a.riderLifecycle.state.pendingActor===22;
  assert.equal(a.articulatedRider.logicalFrames,bundle.anchorState.logicalFrames);
  assert.deepEqual(a.articulatedRider.jointWorld,a.articulatedRider.points[2].position);
  assert.ok([...a.articulatedRider.points,...bundle.anchorState.points].every(p=>AXES.every(k=>Number.isFinite(p.position[k])&&Number.isFinite(p.storedDelta[k]))));
 }
 assert.ok(requested);assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(a.riderLifecycle.state.pendingActor,-1);
 assert.equal(a.articulatedRider.logicalFrames,45);
});

test('detailed launch physics is identical across30/60/144Hz rendering and native profiles',()=>{
 function run(hz,rider){
  const h=physical({rider,sourceState:(_h,c)=>({simulationState:c.logicalFrame<5?1:3,phase650:c.logicalFrame<5?1:2})});
  for(let i=0;i<3*hz;i++)stepNativeRaceAdapter(h.a,1/hz,{heldButtons:0});
  return {snapshot:nativeRaceSnapshot(h.a),body:structuredClone(h.a.articulatedRider),aux:structuredClone(h.bundle.anchorState)};
 }
 for(let rider=0;rider<4;rider++){
  const reference=run(60,rider);assert.equal(reference.snapshot.source.actorState,22);
  for(const hz of [30,144])assert.deepEqual(run(hz,rider),reference);
 }
});

test('two default detailed launch riders finish the old shared phase before an after-water transition',()=>{
 const scene={simulationState:1,phase650:1},h=[0,1].map(rider=>physical({rider,sourceState:()=>scene})),frames=[];
 const adapters=h.map(v=>v.a),water=createRaceWater({crafts:adapters.map(a=>({...a.hull.center,sourceForwardXZ:[0,1]})),baseAmplitudeNative:20,seed:31,initialNoise:false});
 const world=createNativeRaceWorld({adapters,water,humanIndices:[0,1],craftContacts:false,afterFrame:w=>{
  frames.push(w.adapters.map(a=>a.riderLifecycle.state.animationFrame));scene.simulationState=3;scene.phase650=2;
 }});
 stepNativeRaceWorld(world,.05,[{heldButtons:0},{heldButtons:0}]);assert.deepEqual(frames,[[56,56]]);
 stepNativeRaceWorld(world,.05,[{heldButtons:0},{heldButtons:0}]);assert.deepEqual(frames,[[56,56],[57,57]]);
 assert.deepEqual(h.map(v=>v.bundle.anchorState.logicalFrames),[2,2]);assert.equal(water.frames,2);
});
