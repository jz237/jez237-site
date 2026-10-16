import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRiderResultFrameView,prepareNativeRiderResultPose} from '../native-rider-start-pose.js';

// Independently prepared eighteen-record anatomy, not original pose art.
const origins=[[-4,1,10],[-4,17,8],[-3,32,5],[4,1,10],[4,17,8],[3,32,5],[0,35,4],
 [0,50,2],[-20,35,10],[-15,42,7],[-7,48,2],[20,35,10],[15,42,7],[7,48,2],
 [0,35,4],[0,13,-4],[0,13,37],[0,0,0]];
const xyz=(x,y,z)=>({x,y,z}),axes=['x','y','z'];
function input(actorState=1,animationFrame=0){
 const frameView=nativeRiderResultFrameView({actorState,animationFrame});
 return {frameView,selectedFrame:{evaluatedAnimationFrame:frameView.evaluatedAnimationFrame,
  records:origins.map(p=>({coordinatesS16:p.map(v=>v*10),firstDirectionS8:[0,0,127],secondDirectionS8:[0,127,0]}))},
  bodyNative:{position:xyz(10,-3,20),right:xyz(1,0,0),up:xyz(0,.8,-.6),forward:xyz(0,.6,.8),
   yawFrame:{field1434:0,field1438:1,field143c:1,field1440:0}}};
}
const distance=(a,b)=>Math.hypot(...axes.map(k=>a[k]-b[k]));
const close=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${a} differs from ${b}`);

test('six original descriptors clamp only the upper boundary and return negative at their final record',()=>{
 for(const [actor,count]of [[1,89],[2,100],[3,54],[4,79],[5,40],[6,54]]){
  for(const requested of [0,1,count-2,count-1,count,count+10,2147483647]){
   const q=input(actor,requested),view=q.frameView,out=prepareNativeRiderResultPose(q);
   const evaluated=Math.min(requested,count-1),next=evaluated===count-1?-1:evaluated+1;
   assert.deepEqual(view,{actorState:actor,descriptorIndex:actor,frameCount:count,requestedAnimationFrame:requested,evaluatedAnimationFrame:evaluated,nextAnimationFrame:next});
   assert.equal(out.evaluatedAnimationFrame,evaluated);assert.equal(out.nextAnimationFrame,next);
   assert.equal(out.targetsNative.length,19);assert.equal(out.auxiliaryTargetsNative.length,6);
  }
 }
 for(const actorState of [0,7,15,1.5,undefined])assert.throws(()=>nativeRiderResultFrameView({actorState,animationFrame:0}),RangeError);
 for(const animationFrame of [-1,NaN,Infinity,1.5,2147483648])assert.throws(()=>nativeRiderResultFrameView({actorState:1,animationFrame}),RangeError);
});

test('free-arm result actors retain yaw-relative elbow/wrist records;2/3 fit only the second arm',()=>{
 const free=prepareNativeRiderResultPose(input(1));
 assert.deepEqual(free.poseNative[8].origin,xyz(-10,32,30));
 assert.deepEqual(free.poseNative[9].origin,xyz(-5,39,27));
 assert.deepEqual(free.poseNative[11].origin,xyz(30,32,30));
 assert.deepEqual(free.poseNative[12].origin,xyz(25,39,27));
 for(const actor of [1,4,6]){
  const p=prepareNativeRiderResultPose(input(actor));
  assert.deepEqual(p.targetsNative,free.targetsNative);
  close(distance(p.poseNative[10].origin,p.poseNative[13].origin),14);
 }
 for(const actor of [2,3]){
  const p=prepareNativeRiderResultPose(input(actor));
  assert.deepEqual(p.poseNative[8],free.poseNative[8]);assert.deepEqual(p.poseNative[9],free.poseNative[9]);
  assert.notDeepEqual(p.poseNative[11].origin,free.poseNative[11].origin,'bound wrist follows pitched hull');
  assert.notDeepEqual(p.poseNative[12].origin,free.poseNative[12].origin,'second elbow uses source arm fit');
  close(distance(p.poseNative[10].origin,p.poseNative[13].origin),14);
 }
});

test('retirement actor5 uses full-hull placement for every record without arm fitting or head replacement',()=>{
 const q=input(5);delete q.bodyNative.yawFrame;
 const out=prepareNativeRiderResultPose(q);
 for(let i=0;i<18;i++){
  const [x,y,z]=origins[i],p=out.poseNative[i].origin;
  close(p.x,10+x);close(p.y,-3+.8*y+.6*z);close(p.z,20-.6*y+.8*z);
 }
 const other=structuredClone(q);other.bodyNative.yawFrame={field1434:NaN};
 assert.deepEqual(prepareNativeRiderResultPose(other),out,'unconsumed retained yaw cannot affect52E90');
 assert.deepEqual(out.targetsNative[1],out.poseNative[7].origin);
 assert.deepEqual(out.targetsNative[2],out.poseNative[6].origin);
});

test('selected result records and outcomes remain immutable, exact and independent of the caller clock',()=>{
 for(const actor of [1,2,3,4,5,6]){
  const q=input(actor,2147483647),before=structuredClone(q),out=prepareNativeRiderResultPose(q);
  assert.deepEqual(q,before);assert.deepEqual(prepareNativeRiderResultPose(q),out);
  assert.ok(Object.isFrozen(out.targetsNative[0]));assert.throws(()=>out.targetsNative[0].x++,TypeError);
  for(const key of ['actorState','descriptorIndex','frameCount','evaluatedAnimationFrame','nextAnimationFrame']){
   const bad=structuredClone(q);bad.frameView[key]++;
   assert.throws(()=>prepareNativeRiderResultPose(bad),/frameView|actorState/);
  }
  const wrong=structuredClone(q);wrong.selectedFrame.evaluatedAnimationFrame++;
  assert.throws(()=>prepareNativeRiderResultPose(wrong),/evaluated animation frame/);
 }
 const missing=input(2);delete missing.bodyNative.yawFrame;
 assert.throws(()=>prepareNativeRiderResultPose(missing),/yawFrame/);
});
