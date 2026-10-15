import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {nativeRiderPresentation,NATIVE_RIDER_PRESENTATION_PELVIS_LENGTH} from '../native-rider-presentation.js';

// An asymmetric independently authored fixture makes role swaps, invented
// neutral joints, scaling, and lost pitch/roll visible in numerical assertions.
const LOCAL=[
 [.08,2.17,.22],[.01,1.86,.13],[.03,1.11,-.2],
 [-.24,1.71,.14],[-.38,1.44,.4],[-.46,1.24,.7],[-.43,1.2,.8],
 [-.14,1.04,-.27],[-.35,.74,.18],[-.49,.42,-.25],[-.48,.39,-.05],
 [.31,1.75,.11],[.44,1.46,.37],[.52,1.26,.68],[.47,1.21,.81],
 [.2,1.04,-.25],[.39,.76,.13],[.53,.43,-.31],[.55,.4,-.12]
];
const DIRECT={head:[1,0],upperArmL:[3,4],forearmL:[4,5],handL:[5,6],thighL:[7,8],shinL:[8,9],footL:[9,10],
 upperArmR:[11,12],forearmR:[12,13],handR:[13,14],thighR:[15,16],shinR:[16,17],footR:[17,18]};
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const nearArray=(a,b,e)=>{assert.equal(a.length,b.length);a.forEach((n,i)=>near(n,b[i],e));};
const array=p=>[p.x,p.y,p.z];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);

// Use the actual render hierarchy's independent Three.js matrices to prepare
// world points, rather than duplicating the module's inverse-basis arithmetic.
function fixture({position={x:0,y:0,z:0},heading=0,pitch=0,roll=0,scale=.025}={},local=LOCAL){
 const hull=createNativeHull({position,heading,pitch,roll,scale}),boat=new T.Group(),body=new T.Group();
 boat.add(body);boat.position.set(hull.center.x,hull.center.y,hull.center.z);boat.rotation.y=heading;body.rotation.set(pitch,0,roll);
 boat.updateMatrixWorld(true);
 const rider={scale,logicalFrames:7,points:local.map(p=>({position:new T.Vector3(...p).applyMatrix4(body.matrixWorld),storedDelta:{x:.01,y:-.02,z:.03},type:1}))};
 rider.jointWorld={...rider.points[2].position};
 return {hull,rider,boat,body};
}
function checkDirectLocal(dto,expected=LOCAL){
 for(const [name,indices]of Object.entries(DIRECT))for(let i=0;i<2;i++)nearArray(dto.targets[name][i],expected[indices[i]]);
 nearArray(dto.targets.torso[0],expected[2]);nearArray(dto.targets.pelvis[0],expected[2]);
}
function checkDirectWorld(dto,points,matrix){
 for(const [name,indices]of Object.entries(DIRECT))for(let i=0;i<2;i++){
  const reconstructed=new T.Vector3(...dto.targets[name][i]).applyMatrix4(matrix);
  nearArray(array(reconstructed),array(points[indices[i]].position));
 }
}

test('all nineteen actual roles map to detached high-resolution anatomical segments',()=>{
 const {hull,rider}=fixture(),dto=nativeRiderPresentation(rider,hull,{pelvisLengthWorld:.2});
 assert.equal(Object.keys(dto.targets).length,15);checkDirectLocal(dto);
 nearArray(dto.targets.torso[1],[.035,1.73,.125]);
 nearArray(dto.targets.pelvis[1],[.03,1.2618513204730593,-.0698417253088063]);
 assert.equal(dto.yaw,0);assert.equal(dto.headYaw,0);
 assert.equal(dto.diagnostics.sourceLogicalFrame,7);assert.equal(dto.diagnostics.presentationOnly,true);
 assert.equal(dto.diagnostics.coordinateSpace,'craft-local-world-units');assert.equal(dto.diagnostics.pelvisAxis,'hip-midpoint-to-root');
 assert.deepEqual(dto.diagnostics.collapsedSegments,[]);
});

test('pelvis preserves modern mesh length while its orientation follows solved rider geometry',()=>{
 const {hull,rider}=fixture(),dto=nativeRiderPresentation(rider,hull);
 near(NATIVE_RIDER_PRESENTATION_PELVIS_LENGTH,Math.hypot(.15,.015));
 const [a,b]=dto.targets.pelvis;near(Math.hypot(...b.map((n,i)=>n-a[i])),Math.hypot(.15,.015));
 assert.ok(b[2]>a[2]+.09,'the pelvis axis comes from the solved hips/root rather than hull up');
 assert.equal(dto.diagnostics.pelvisLengthWorld,NATIVE_RIDER_PRESENTATION_PELVIS_LENGTH);
});

test('full yaw, pitch and roll invert once and round-trip through the actual craft hierarchy',()=>{
 const {hull,rider,body}=fixture({position:{x:37,y:-4,z:81},heading:1.1,pitch:-.35,roll:.42});
 const dto=nativeRiderPresentation(rider,hull);checkDirectLocal(dto);checkDirectWorld(dto,rider.points,body.matrixWorld);
 const worldHead=rider.points[0].position;
 assert.ok(Math.abs((worldHead.y-hull.center.y)-LOCAL[0][1])>.1,'yaw-only inversion would lose this substantial attitude');
 assert.equal(dto.yaw,0);assert.equal(dto.headYaw,0);
});

test('full basis remains valid at vertical craft attitudes without an Euler/yaw singularity',()=>{
 for(const pitch of [Math.PI/2,-Math.PI/2]){
  const {hull,rider,body}=fixture({position:{x:-3,y:8,z:4},heading:-.8,pitch,roll:.6});
  const dto=nativeRiderPresentation(rider,hull);checkDirectLocal(dto);checkDirectWorld(dto,rider.points,body.matrixWorld);
 }
});

test('shared translation changes neither anatomy nor local point lengths',()=>{
 const first=fixture({heading:.7,pitch:.2,roll:-.3}),second=fixture({position:{x:170,y:-12,z:-93},heading:.7,pitch:.2,roll:-.3});
 const a=nativeRiderPresentation(first.rider,first.hull),b=nativeRiderPresentation(second.rider,second.hull);
 for(const name of Object.keys(a.targets))for(let i=0;i<2;i++)nearArray(a.targets[name][i],b.targets[name][i]);
});

test('world-space physical points are never multiplied by the native unit scale',()=>{
 const a=fixture({scale:.025}),b=fixture({scale:.01});
 const first=nativeRiderPresentation(a.rider,a.hull),second=nativeRiderPresentation(b.rider,b.hull);
 for(const name of Object.keys(first.targets))for(let i=0;i<2;i++)nearArray(first.targets[name][i],second.targets[name][i]);
 nearArray(second.targets.handL[1],[-.43,1.2,.8]);
});

test('actual solved grips and limbs win over the previous authored goals',()=>{
 const initial={position:{x:3,y:0,z:8},heading:.6,pitch:.1,roll:-.08};
 const bundle=createAuthoredNativeRider({initialHull:createNativeHull(initial)}),adapter=createNativeRaceAdapter({...initial,...bundle});
 stepNativeRaceAdapter(adapter,.05,{throttle:true,steer:.3,trim:.15});
 const physical=adapter.articulatedRider,goals=bundle.riderPose(adapter.hull,{logicalFrame:0,time:.05});
 assert.ok(physical.points.some((p,i)=>distance(p.position,goals.targets[i])>1e-5),'the physical solve actually differs from animation goals');
 const dto=nativeRiderPresentation(physical,adapter.hull);
 const f=adapter.hull.frame,matrix=new T.Matrix4().makeBasis(new T.Vector3(...array(f.right)),new T.Vector3(...array(f.up)),new T.Vector3(...array(f.forward)));
 matrix.setPosition(new T.Vector3(...array(adapter.hull.center)));checkDirectWorld(dto,physical.points,matrix);
 nearArray(new T.Vector3(...dto.targets.handL[1]).applyMatrix4(matrix).toArray(),array(bundle.anchorState.anchors[2]));
 nearArray(new T.Vector3(...dto.targets.handR[1]).applyMatrix4(matrix).toArray(),array(bundle.anchorState.anchors[3]));
 nearArray(new T.Vector3(...dto.targets.torso[0]).applyMatrix4(matrix).toArray(),array(physical.jointWorld));
 assert.equal(dto.diagnostics.sourceLogicalFrame,1);
});

test('repeated or edited display DTOs cannot pump solvers, replace history or alias other segments',()=>{
 const {hull,rider}=fixture({position:{x:7,y:2,z:-11},heading:.4,pitch:-.2,roll:.1});
 const before=JSON.stringify({hull,rider}),first=nativeRiderPresentation(rider,hull),endpointArrays=Object.values(first.targets).flat();
 assert.equal(new Set(endpointArrays).size,30,'even shared anatomical joints have independent output arrays');
 const expectedWrist=first.targets.forearmL[1][0];first.targets.handL[0][0]=999;
 assert.equal(first.targets.forearmL[1][0],expectedWrist);
 first.targets.torso[0][0]=999;first.diagnostics.collapsedSegments.push('fake');
 for(let i=0;i<100;i++){
  const next=nativeRiderPresentation(rider,hull);checkDirectLocal(next);assert.deepEqual(next.diagnostics.collapsedSegments,[]);
 }
 assert.equal(JSON.stringify({hull,rider}),before);
});

test('between solves the DTO retains actual world points rather than inventing hull-following motion',()=>{
 const {hull,rider}=fixture(),before=JSON.stringify(rider.points);
 hull.center.x+=.25;
 const dto=nativeRiderPresentation(rider,hull);
 nearArray(dto.targets.handL[1],[-.68,1.2,.8]);assert.equal(JSON.stringify(rider.points),before);
 near(dto.targets.handL[1][0]+hull.center.x,rider.points[6].position.x);
});

test('collapsed pelvis axis has an explicit rider-derived fallback rather than a hull-up pose',()=>{
 const local=LOCAL.map(p=>[...p]);local[7]=[-.17,1.11,-.2];local[15]=[.23,1.11,-.2];
 const {hull,rider}=fixture({},local),dto=nativeRiderPresentation(rider,hull,{pelvisLengthWorld:.2});
 assert.equal(dto.diagnostics.pelvisAxis,'root-to-shoulder-fallback');
 const [root,end]=dto.targets.pelvis,shoulder=dto.targets.torso[1];
 near(Math.hypot(...end.map((n,i)=>n-root[i])),.2);
 const scale=.2/Math.hypot(...shoulder.map((n,i)=>n-root[i]));
 nearArray(end,root.map((n,i)=>n+(shoulder[i]-n)*scale));assert.ok(end[2]>root[2]+.08);
});

test('collapsed observable segments stay at their actual endpoints and are diagnosed',()=>{
 const local=LOCAL.map(p=>[...p]);local[0]=[...local[1]];local[5]=[...local[4]];
 const {hull,rider}=fixture({},local),dto=nativeRiderPresentation(rider,hull);
 assert.deepEqual(dto.targets.head[0],dto.targets.head[1]);assert.deepEqual(dto.targets.forearmL[0],dto.targets.forearmL[1]);
 assert.deepEqual(dto.diagnostics.collapsedSegments,['head','forearmL']);
});

test('invalid points, units, frames or missing body axes cannot silently produce a fabricated pose',()=>{
 const {hull,rider}=fixture();assert.throws(()=>nativeRiderPresentation(null,hull),/nineteen/);
 assert.throws(()=>nativeRiderPresentation({...rider,points:rider.points.slice(1)},hull),/nineteen/);
 assert.throws(()=>nativeRiderPresentation({...rider,scale:.01},hull),/scales/);
 assert.throws(()=>nativeRiderPresentation({...rider,logicalFrames:-1},hull),/logical frame/);
 for(const pelvisLengthWorld of [0,-1,NaN,Infinity])assert.throws(()=>nativeRiderPresentation(rider,hull,{pelvisLengthWorld}),/positive/);
 const bad=structuredClone(rider);bad.points[6].position.z=NaN;assert.throws(()=>nativeRiderPresentation(bad,hull),/finite/);
 assert.throws(()=>nativeRiderPresentation(rider,{...hull,center:{x:Infinity,y:0,z:0}}),/finite/);
 for(const frame of [
  {...hull.frame,right:{x:-1,y:0,z:0}},
  {...hull.frame,up:{x:0,y:2,z:0}},
  {...hull.frame,right:{x:Math.cos(.1),y:0,z:Math.sin(.1)}}
 ])assert.throws(()=>nativeRiderPresentation(rider,{...hull,frame}),/handed|unit|orthonormal/);
 const collapsed=structuredClone(rider);for(const i of [2,3,7,11,15])collapsed.points[i].position={x:0,y:0,z:0};
 assert.throws(()=>nativeRiderPresentation(collapsed,hull),/no usable pelvis or torso axis/);
});
