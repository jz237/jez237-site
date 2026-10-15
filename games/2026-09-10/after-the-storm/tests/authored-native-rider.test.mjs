import test from 'node:test';
import assert from 'node:assert/strict';
import {riderPose} from '../rider-pose.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {stepNativeArticulatedRider,NATIVE_RIDER_ORDINARY_TYPES} from '../native-articulated-rider.js';
import {authoredNativeRiderTargets,createAuthoredNativeAnchorRig,authoredNativeRiderHistory,
  createAuthoredNativeRider} from '../authored-native-rider.js';

const vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>({...p});
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const vectorClose=(a,b,e=1e-10)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const context=(logicalFrame,time=(logicalFrame+1)*.05)=>({logicalFrame,time,actorState:22,controls:{workingXNative:0}});
const create=(options={})=>createAuthoredNativeRider({initialHull:createNativeHull(),...options});

test('authored anatomy maps every modern endpoint to native roles and the actual hull frame',()=>{
  const hull=createNativeHull({position:vec(2,3,4),heading:Math.PI/2}),pose=riderPose('',0,0),p=authoredNativeRiderTargets(pose,hull);
  assert.equal(p.length,19);
  vectorClose(p[2],vec(2-.34,3+.765,4));
  vectorClose(p[6],vec(2+.799,3+1.132,4+.445));
  vectorClose(p[14],vec(2+.799,3+1.132,4-.445));
  vectorClose(p[0],vec(2+.17,3+1.745,4));
  assert.ok(distance(p[6],p[5])>.09&&distance(p[6],p[5])<.1);
  assert.throws(()=>authoredNativeRiderTargets({targets:{}},hull),/head/);
});

test('root yaw follows the authored backwards pose without changing native role order',()=>{
  const hull=createNativeHull(),pose=riderPose('backwards',0,0),p=authoredNativeRiderTargets(pose,hull);
  vectorClose(p[2],vec(0,1.24,.29));
  const hand=pose.targets.handL[1];vectorClose(p[6],vec(-hand[0],hand[1],-hand[2]));
});

test('authored support rig is measured from the actual modern steering arc rather than a native neutral constant',()=>{
  const rig=createAuthoredNativeAnchorRig();
  vectorClose(rig.center,vec(0,1.132,.66),1e-9);close(rig.radiusWorld,.139,1e-9);
  close(rig.supportB.x-rig.supportA.x,.89);assert.ok(rig.supportA.z<rig.center.z);
  assert.ok(Object.isFrozen(rig)&&Object.isFrozen(rig.center));assert.match(rig.provenance,/modern/);
  const geometryProvider=(...args)=>{
    const pose=riderPose(...args);
    return {...pose,targets:Object.fromEntries(Object.entries(pose.targets).map(([k,bone])=>[k,bone.map(p=>p.map(v=>v*1.5))]))};
  };
  const larger=createAuthoredNativeAnchorRig({geometryProvider});
  close(larger.radiusWorld,rig.radiusWorld*1.5,1e-9);close(larger.center.y,rig.center.y*1.5,1e-9);
});

test('a rig without a steering arc needs explicit authored support geometry',()=>{
  const fixed=()=>riderPose('',0,0);
  assert.throws(()=>createAuthoredNativeAnchorRig({geometryProvider:fixed}),/explicit anchorRig/);
  const explicit=createAuthoredNativeAnchorRig();
  const bundle=create({geometryProvider:fixed,anchorRig:explicit});
  assert.ok(bundle.articulatedRider.points[2].position.y>.7);
  assert.equal(bundle.anchorState.radiusWorld,explicit.radiusWorld);
});

test('rendered history retains solved physical origins and reconstructs synthetic endpoint lengths',()=>{
  const rest=authoredNativeRiderTargets(riderPose('',0,0),createNativeHull()),p=rest.map(copy);
  p[2].x+=.3;p[0].y+=1;p[6].z+=.5;p[10].z+=.3;
  const history=authoredNativeRiderHistory(p,rest);
  vectorClose(history[2],p[2]);vectorClose(history[5],p[5]);vectorClose(history[9],p[9]);
  for(const [tip,base]of [[0,1],[6,5],[10,9],[14,13],[18,17]])close(distance(history[tip],history[base]),distance(rest[tip],rest[base]));
  assert.notDeepEqual(history[0],p[0]);assert.notDeepEqual(history[6],p[6]);
  assert.notDeepEqual(history[2],rest[2]);
  history[2].x=999;assert.notEqual(p[2].x,999);
});

test('adapter-ready provider solves physical anchors then rider, and latches actual joint2 for the following frame',()=>{
  const bundle=create(),a=createNativeRaceAdapter(bundle),initial={...bundle.articulatedRider.jointWorld};
  stepNativeRaceAdapter(a,.04,{throttle:true,trim:.5,steer:.3});
  assert.equal(bundle.anchorState.logicalFrames,0);assert.equal(bundle.articulatedRider.logicalFrames,0);
  vectorClose(a.frame.prepared.jointWorld,initial);
  stepNativeRaceAdapter(a,.01,{throttle:true,trim:.5,steer:.3});
  assert.equal(bundle.anchorState.logicalFrames,1);assert.equal(bundle.articulatedRider.logicalFrames,1);
  const solved={...bundle.articulatedRider.jointWorld};assert.notDeepEqual(solved,initial);
  vectorClose(solved,bundle.articulatedRider.points[2].position);vectorClose(a.frame.prepared.jointWorld,initial);
  vectorClose(bundle.articulatedRider.points[6].position,bundle.anchorState.anchors[2]);
  vectorClose(bundle.articulatedRider.points[14].position,bundle.anchorState.anchors[3]);
  stepNativeRaceAdapter(a,.01,{throttle:true,trim:.5,steer:.3});
  vectorClose(a.frame.prepared.jointWorld,solved);
  for(let i=0;i<90;i++)stepNativeRaceAdapter(a,.01,{throttle:true,trim:.5,steer:.3});
  assert.ok([a.hull.center.x,a.hull.center.y,a.hull.center.z].every(Number.isFinite));
  assert.equal(bundle.anchorState.logicalFrames,bundle.articulatedRider.logicalFrames);
});

test('a physical anchor limit changes grip outputs before they become fixed hand constraints',()=>{
  const bundle=create({poseProvider:(h,c)=>riderPose('',c.time,0,{steering:Math.PI})});
  const a=createNativeRaceAdapter(bundle);stepNativeRaceAdapter(a,.05,{});
  assert.match(bundle.anchorState.branch,/endpoint/);
  const payload=bundle.riderPose(a.hull,context(0,a.hull.simulationTime));
  assert.ok(distance(payload.anchors[2],payload.targets[6])>.05);
  vectorClose(bundle.articulatedRider.points[6].position,payload.anchors[2]);
  vectorClose(bundle.articulatedRider.points[14].position,payload.anchors[3]);
  const shift=vec(payload.anchors[2].x-payload.targets[6].x,payload.anchors[2].y-payload.targets[6].y,payload.anchors[2].z-payload.targets[6].z);
  vectorClose(vec(payload.anchors[3].x-payload.targets[14].x,payload.anchors[3].y-payload.targets[14].y,payload.anchors[3].z-payload.targets[14].z),shift);
});

test('duplicate render samples cannot pump anchors or replace previous physical history with animation goals',()=>{
  const hull=createNativeHull(),bundle=create();
  const first=bundle.riderPose(hull,context(0)),before=structuredClone(bundle.anchorState);
  const duplicate=bundle.riderPose(hull,context(0,.071));assert.deepEqual(duplicate,first);
  assert.deepEqual(bundle.anchorState,before);duplicate.anchors[2].x=999;duplicate.targets[2].x=999;
  assert.notEqual(bundle.riderPose(hull,context(0)).anchors[2].x,999);
  assert.throws(()=>bundle.riderPose(hull,context(1)),/nineteen-point/);
  stepNativeArticulatedRider(bundle.articulatedRider,{...first,center:hull.center,up:hull.frame.up});
  const physicalBefore=bundle.articulatedRider.points.map(p=>copy(p.position));
  const second=bundle.riderPose(hull,context(1));
  vectorClose(second.historyTargets[2],physicalBefore[2]);
  assert.throws(()=>bundle.riderPose(hull,context(3)),/consecutive/);
});

test('explicit custom mode and point types are accepted without inferring a source pose transition',()=>{
  const types=Array(19).fill(0),bundle=create({poseProvider:(h,c)=>({...riderPose('handstand',c.time,0),anchorMode:0,pointTypes:types})});
  const hull=createNativeHull(),payload=bundle.riderPose(hull,context(0));
  assert.equal(bundle.anchorState.mode,0);assert.deepEqual(payload.types,types);
  vectorClose(payload.anchors[2],payload.targets[6]);vectorClose(payload.anchors[3],payload.targets[14]);
  assert.deepEqual(bundle.articulatedRider.points.map(p=>p.type),NATIVE_RIDER_ORDINARY_TYPES,'source transition is explicit input, not inferred at initialization');
});

test('rider body, physical anchor and force trajectories are independent of render cadence',()=>{
  const make=()=>{const bundle=create();return {bundle,adapter:createNativeRaceAdapter(bundle)};};
  const a=make(),b=make(),input=t=>({throttle:true,steer:t<.2?.3:-.2,trim:.2});
  for(let i=0;i<50;i++)stepNativeRaceAdapter(a.adapter,.01,input);
  for(let i=0;i<30;i++)stepNativeRaceAdapter(b.adapter,1/60,input);
  assert.deepEqual(a.bundle.articulatedRider,b.bundle.articulatedRider);
  assert.deepEqual(a.bundle.anchorState,b.bundle.anchorState);
  assert.deepEqual(a.adapter.lastFrame,b.adapter.lastFrame);
  vectorClose(a.adapter.hull.center,b.adapter.hull.center);
});

test('rest inputs and state are copied independently for both players',()=>{
  const rig=createAuthoredNativeAnchorRig(),mutable={...rig,center:copy(rig.center),supportA:copy(rig.supportA),supportB:copy(rig.supportB)};
  const types=[...NATIVE_RIDER_ORDINARY_TYPES],a=create({anchorRig:mutable,types}),b=create();
  mutable.center.y=999;types[6]=0;a.restTargets[2].y=999;
  const payload=a.riderPose(createNativeHull(),context(0));
  assert.equal(payload.types[6],2);assert.notEqual(a.anchorRig.center.y,999);
  assert.equal(b.anchorState.logicalFrames,0);assert.equal(b.articulatedRider.logicalFrames,0);
  assert.notEqual(b.articulatedRider.jointWorld.y,999);
});

test('invalid modern geometry or frame conditions reject before advancing auxiliary state',()=>{
  assert.throws(()=>createAuthoredNativeRider(),/hull center/);
  const hull=createNativeHull(),bundle=create({poseProvider:()=>({...riderPose(),pointTypes:[0]})}),before=structuredClone(bundle.anchorState);
  assert.throws(()=>bundle.riderPose(hull,context(0)),/pointTypes/);assert.deepEqual(bundle.anchorState,before);
  const valid=create();assert.throws(()=>valid.riderPose({...hull,scale:.05},context(0)),/scales/);
  assert.throws(()=>valid.riderPose(hull,{}),/logicalFrame/);
  const collapsed=valid.restTargets.map(copy);collapsed[0]=copy(collapsed[1]);
  assert.throws(()=>authoredNativeRiderHistory(collapsed,valid.restTargets),/collapsed/);
});
