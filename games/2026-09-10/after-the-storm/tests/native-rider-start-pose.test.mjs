import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRiderStartFrameView,prepareNativeRiderStartPose} from '../native-rider-start-pose.js';

// Independent synthetic eighteen-bone rig, not original animation/rest data.
const origins=[[-4,1,10],[-4,17,8],[-3,32,5],[4,1,10],[4,17,8],[3,32,5],[0,35,4],
 [0,50,2],[-20,35,10],[-15,42,7],[-7,48,2],[20,35,10],[15,42,7],[7,48,2],
 [0,35,4],[0,13,-4],[0,13,37],[0,0,0]];
const xyz=(x,y,z)=>({x,y,z}),axes=['x','y','z'];
function input(animationFrame=56){
 const frameView=nativeRiderStartFrameView({animationFrame});
 return {frameView,selectedFrame:{evaluatedAnimationFrame:frameView.evaluatedAnimationFrame,
  records:origins.map(p=>({coordinatesS16:p.map(v=>v*10),firstDirectionS8:[0,0,127],secondDirectionS8:[0,127,0]}))},
  bodyNative:{position:xyz(10,-3,20),right:xyz(1,0,0),up:xyz(0,1,0),forward:xyz(0,0,1),
   yawFrame:{field1434:0,field1438:1,field143c:1,field1440:0}}};
}
const distance=(a,b)=>Math.hypot(...axes.map(k=>a[k]-b[k]));
const squaredDistance=(a,b)=>axes.reduce((sum,k)=>sum+(a[k]-b[k])**2,0);
const close=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);

test('descriptor7 selection preserves requested/evaluated frame and terminal return',()=>{
 for(const [requested,evaluated,next]of [[0,0,1],[56,56,57],[83,83,84],[84,84,-1],[85,84,-1],[2147483647,84,-1]]){
  const v=nativeRiderStartFrameView({animationFrame:requested});
  assert.deepEqual(v,{descriptorIndex:7,frameCount:85,requestedAnimationFrame:requested,evaluatedAnimationFrame:evaluated,nextAnimationFrame:next});
  const out=prepareNativeRiderStartPose(input(requested));
  assert.equal(out.evaluatedAnimationFrame,evaluated);assert.equal(out.nextAnimationFrame,next);assert.ok(Object.isFrozen(v));
 }
 for(const n of [-1,2147483648,NaN,1.5])assert.throws(()=>nativeRiderStartFrameView({animationFrame:n}),RangeError);
});

test('frame metadata cannot silently select different records or fabricate an outcome',()=>{
 for(const key of ['descriptorIndex','frameCount','evaluatedAnimationFrame','nextAnimationFrame']){
  const q=input();q.frameView={...q.frameView,[key]:q.frameView[key]+1};
  assert.throws(()=>prepareNativeRiderStartPose(q),/frameView/);
 }
 const q=input(100);q.selectedFrame.evaluatedAnimationFrame=100;
 assert.throws(()=>prepareNativeRiderStartPose(q),/evaluated animation frame/);
 const extra=input();extra.frameView={...extra.frameView,clock:56};
 assert.throws(()=>prepareNativeRiderStartPose(extra),/frameView/);
});

test('retained yaw and full hull bases remain independent in the hybrid placement',()=>{
 const q=input(0);q.bodyNative.up=xyz(0,.8,-.6);q.bodyNative.forward=xyz(0,.6,.8);
 const p=prepareNativeRiderStartPose(q).poseNative;
 // Ankle local(-4,1,10) follows full pitch; hip local(-3,32,5)
 // follows retained yaw with global vertical. Both include native translation.
 assert.deepEqual(p[0].origin,xyz(6,3.8000001907348633,27.399999618530273));
 assert.deepEqual(p[2].origin,xyz(7,29,25));
 const changed=structuredClone(q);changed.bodyNative.yawFrame={field1434:1,field1438:0,field143c:0,field1440:-1};
 const other=prepareNativeRiderStartPose(changed).poseNative;
 assert.deepEqual(other[0],p[0]);assert.deepEqual(other[2].origin,xyz(15,29,23));
});

test('three shoulder passes produce the finite fourteen-unit shoulder span',()=>{
 const p=prepareNativeRiderStartPose(input()).poseNative;
 close(distance(p[10].origin,p[13].origin),14);
 close(distance(p[14].firstDirection,xyz(0,0,0)),1);
 close(distance(p[14].secondDirection,xyz(0,0,0)),1);
 assert.ok(p.flatMap(b=>Object.values(b)).every(v=>axes.every(k=>Number.isFinite(v[k]))));
});

test('close wrists take bent-arm IK with the supplied elbow plane',()=>{
 const q=input(),r=q.selectedFrame.records;
 r[8].coordinatesS16=[-120,320,90];r[11].coordinatesS16=[120,320,90];
 const p=prepareNativeRiderStartPose(q).poseNative;
 for(const [s,e,w]of [[10,9,8],[13,12,11]]){
  close(squaredDistance(p[s].origin,p[e].origin),72.98287963867188,.0002);
  close(squaredDistance(p[e].origin,p[w].origin),109.34884643554688,.0003);
  assert.ok(distance(p[s].origin,p[e].origin)+distance(p[e].origin,p[w].origin)>distance(p[s].origin,p[w].origin)+.1);
 }
});

test('unreachable wrists use the source straight-line arm fallback',()=>{
 const p=prepareNativeRiderStartPose(input()).poseNative;
 const s=p[10].origin,e=p[9].origin,w=p[8].origin;
 close(distance(s,e)+distance(e,w),distance(s,w),.00002);
 close(distance(s,e)/distance(s,w),Math.sqrt(72.98287963867188)/(Math.sqrt(72.98287963867188)+Math.sqrt(109.34884643554688)),.000001);
});

test('nineteen anatomical and six auxiliary goals include physical endpoint extensions',()=>{
 const out=prepareNativeRiderStartPose(input()),t=out.targetsNative,a=out.auxiliaryTargetsNative;
 assert.equal(t.length,19);assert.equal(a.length,6);assert.equal(out.poseNative.length,18);
 close(distance(t[0],t[1]),25,.00003);close(distance(t[6],t[5]),3.5,.00001);
 close(distance(t[10],t[9]),10,.00002);close(distance(t[18],t[17]),10,.00002);
 close(distance(a[0],a[5]),10,.00002);close(distance(a[3],a[4]),20.27,.00003);
 assert.deepEqual(t[2],out.poseNative[6].origin);assert.deepEqual(a[2],out.poseNative[15].origin);
});

test('source normalization guards retain a zero secondary direction',()=>{
 const q=input(0);q.bodyNative.forward=xyz(0,0,0);
 const out=prepareNativeRiderStartPose(q);
 assert.deepEqual(out.poseNative[10].secondDirection,xyz(0,0,0));
 assert.deepEqual(out.poseNative[13].secondDirection,xyz(0,0,0));
 assert.ok(out.targetsNative.every(p=>axes.every(k=>Number.isFinite(p[k]))));
});

test('evaluation has no clock or mutations and returns detached immutable data',()=>{
 const q=input(),before=structuredClone(q),a=prepareNativeRiderStartPose(q),b=prepareNativeRiderStartPose(q);
 assert.deepEqual(q,before);assert.deepEqual(a,b);assert.notEqual(a.poseNative,b.poseNative);
 assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.poseNative)&&Object.isFrozen(a.poseNative[0].origin)&&Object.isFrozen(a.targetsNative[0]));
 assert.throws(()=>a.targetsNative[0].x=123,TypeError);
 q.selectedFrame.records[0].coordinatesS16[0]=300;
 assert.notDeepEqual(prepareNativeRiderStartPose(q).poseNative[0],a.poseNative[0]);assert.deepEqual(a,b);
});

test('dense explicit signed records are required, including their native endpoints',()=>{
 const q=input();q.selectedFrame.records[0].coordinatesS16=[-32768,32767,-32768];
 q.selectedFrame.records[0].firstDirectionS8=[-128,127,127];
 assert.ok(prepareNativeRiderStartPose(q).targetsNative.every(p=>axes.every(k=>Number.isFinite(p[k]))));
 for(const update of [r=>r.coordinatesS16=[32768,0,0],r=>r.firstDirectionS8=[0,128,0],r=>r.secondDirectionS8=new Array(3)]){
  const bad=input();update(bad.selectedFrame.records[0]);assert.throws(()=>prepareNativeRiderStartPose(bad),RangeError);
 }
 const sparse=input();sparse.selectedFrame.records=new Array(18);assert.throws(()=>prepareNativeRiderStartPose(sparse),TypeError);
});

test('missing retained yaw, nonfinite arithmetic and unguarded degeneracy reject explicitly',()=>{
 const missing=input();delete missing.bodyNative.yawFrame;assert.throws(()=>prepareNativeRiderStartPose(missing),TypeError);
 const nan=input();nan.bodyNative.up.x=NaN;assert.throws(()=>prepareNativeRiderStartPose(nan),/finite float32/);
 const overflow=input();overflow.bodyNative.right.x=3e38;assert.throws(()=>prepareNativeRiderStartPose(overflow),/finite float32/);
 const collapsed=input();collapsed.selectedFrame.records.forEach(r=>r.coordinatesS16=[0,0,0]);
 assert.throws(()=>prepareNativeRiderStartPose(collapsed),/zero divisor/);
});
