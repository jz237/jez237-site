import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeAISelectionCircle,nativeAISelectionCircleFromMesh,nativeAIProximitySnapshot,nativeAICameraCornerSnapshot} from '../native-ai-perception.js';
import {prepareNativeAIInitialization} from '../native-ai-initialization.js';
import {createNativeAIMotionState,prepareNativeAIMotion} from '../native-ai-motion.js';
import {nativeAICameraContains} from '../native-ai-actions.js';

const selection=extra=>({radius:12,selectionRadiusNative:1500,patchIndex:0,
 requestedCenterNative:{x:0,z:0},horizontalForwardsNative:[{x:0,z:1},{x:1,z:0}],...extra});
const motion=extra=>prepareNativeAIMotion(createNativeAIMotionState({previousMotionDirection:{x:0,y:0,z:1},recoveryPhase:0,
 stuckFrames:0,dryMarkedContact:0,offCircleBehindFrames:0,flagB0:0,flagB4:1}),{
 motionDirection:{x:0,y:0,z:1},actorState:22,animationFrame:0,priorControlActive:false,frameSpeedNative:0,
 markedBox:false,wetCount:8,positionNative:{x:0,z:0},selectionCircleNative:{x:0,z:0,radiusSquared:2250000},
 referenceProgress:0,racerProgress:0,racerIndex:0,players:1,difficulty:0,role:-1,courseIndex:1,...extra});
const rectangle=(x,z)=>[{x:x-100,z:z-100},{x:x-100,z:z+100},{x:x+100,z:z-100},{x:x+100,z:z+100}];

test('radius12 procedural selection mesh preserves six stored outer vertices and its actual circle',()=>{
 // Independently executed source instructions at a prepared zero patch center
 // and camera0 forward+Z. This is not a captured original game trajectory.
 const r=prepareNativeAISelectionCircle(selection());
 assert.deepEqual(r.snappedCenterNative,{x:0,z:0});assert.deepEqual(r.snapOffsetNative,{x:0,z:0});
 assert.deepEqual(r.outerVerticesNative,[{x:-750,z:-664},{x:750,z:-664},{x:1500,z:634},
  {x:750,z:1932},{x:-750,z:1932},{x:-1500,z:634}]);
 assert.deepEqual(r.selectionCircleNative,{x:0,z:634,radiusSquared:2250000});
});

test('all three source mesh variants retain their source-specific extension and radius16 asymmetry',()=>{
 assert.deepEqual(prepareNativeAISelectionCircle(selection({radius:10})).selectionCircleNative,{x:0,z:745,radiusSquared:2250000});
 const large=prepareNativeAISelectionCircle(selection({radius:16}));
 assert.deepEqual(large.selectionCircleNative,{x:59.5,z:412,radiusSquared:2250000});
 assert.deepEqual(large.outerVerticesNative,[{x:-690,z:-887},{x:809,z:-887},{x:1559,z:412},
  {x:809,z:1711},{x:-690,z:1711},{x:-1440,z:412}]);
});

test('snapping and integer mesh storage make the final circle distinct from a requested camera patch center',()=>{
 const r=prepareNativeAISelectionCircle(selection({requestedCenterNative:{x:123.45,z:-543.21},
  horizontalForwardsNative:[{x:.6,z:.8}]}));
 assert.deepEqual(r.snappedCenterNative,{x:127,z:-554});
 assert.deepEqual(r.snapOffsetNative,{x:4.5,z:-11.25830078125});
 assert.deepEqual(r.selectionCircleNative,{x:502.5,z:-35.74169921875,radiusSquared:2250000});
});

test('patch slots select source camera records0/1 without a modern player-camera mapping',()=>{
 const q=selection(),a=prepareNativeAISelectionCircle(q),b=prepareNativeAISelectionCircle({...q,patchIndex:1});
 assert.deepEqual(a.selectionCircleNative,{x:0,z:634,radiusSquared:2250000});
 assert.deepEqual(b.selectionCircleNative,{x:634,z:0,radiusSquared:2250000});
 assert.equal(b.patchIndex,1);
 assert.throws(()=>prepareNativeAISelectionCircle({...q,patchIndex:1,horizontalForwardsNative:[{x:0,z:1}]}),/camera records/);
});

test('stored signed16 coordinates are averaged after wrapping and snap offset subtraction stays float32',()=>{
 const circle=nativeAISelectionCircleFromMesh({oppositeOuterVerticesNative:[{x:-32760,z:32760},{x:32760,z:-32760}],
  snapOffsetNative:{x:.1,z:-.2},selectionRadiusNative:1500});
 assert.deepEqual(circle,{x:-Math.fround(.1),z:Math.fround(.2),radiusSquared:2250000});
 const r=prepareNativeAISelectionCircle(selection({requestedCenterNative:{x:32700,z:32700}}));
 assert.ok(r.outerVerticesNative.every(p=>Number.isInteger(p.x)&&p.x>=-32768&&p.x<=32767&&p.z>=-32768&&p.z<=32767));
 assert.deepEqual(r.selectionCircleNative,nativeAISelectionCircleFromMesh({
  oppositeOuterVerticesNative:[r.outerVerticesNative[0],r.outerVerticesNative[3]],snapOffsetNative:r.snapOffsetNative,selectionRadiusNative:1500}));
});

test('radius word multiplication preserves its signed low32 result rather than an idealized radius square',()=>{
 const r=nativeAISelectionCircleFromMesh({oppositeOuterVerticesNative:[{x:0,z:0},{x:0,z:0}],
  snapOffsetNative:{x:0,z:0},selectionRadiusNative:46341});
 assert.equal(r.radiusSquared,-2147479040);
});

test('zero camera direction is retained and supplied directions are not normalized',()=>{
 const r=prepareNativeAISelectionCircle(selection({horizontalForwardsNative:[{x:0,z:0}]}));
 assert.deepEqual(r.selectionCircleNative,{x:0,z:0,radiusSquared:2250000});
 const half=prepareNativeAISelectionCircle(selection({horizontalForwardsNative:[{x:0,z:.5}]}));
 assert.deepEqual(half.selectionCircleNative,{x:0,z:317,radiusSquared:2250000});
});

test('proximity uses the literal object prefix, independently of setup qualifying-type indices',()=>{
 const init=prepareNativeAIInitialization({rngState:17,racerCount:1,primaryHumanIndex:0,hullProfilesB64:[0,1,2,3],avatarsB68:[0,1,2,3],
  sourceOrder:[0],retainedRoleWords:[-1,0,0,0],objectTypes4c:[9,1,1]});
 assert.equal(init.proximityCount,2);assert.deepEqual(init.proximityObjectIndicesPrefix,[1,2]);
 // The qualifying list points to far objects1/2. The actual reader includes
 // near object0, because count2 means raw records0/1 regardless of type.
 const snapshot=nativeAIProximitySnapshot({proximityObjectCentersNative:[{x:1,z:2},{x:5000,z:5000},{x:6000,z:6000}],proximityCount:init.proximityCount});
 assert.equal(motion(snapshot).nearObjects,true);assert.equal(motion(snapshot).diagnostic.nearestObjectDistanceSquaredNative,5);
 assert.equal(motion(nativeAIProximitySnapshot({...snapshot,proximityCount:0})).nearObjects,false);
});

test('proximity snapshots retain moved current positions and preserve strict near-threshold equality',()=>{
 const source=[{x:1500,z:0},{x:0,z:0}],old=nativeAIProximitySnapshot({proximityObjectCentersNative:source,proximityCount:1});
 assert.equal(motion(old).nearObjects,false);
 source[0].x=1499;const moved=nativeAIProximitySnapshot({proximityObjectCentersNative:source,proximityCount:1});
 assert.equal(motion(moved).nearObjects,true);assert.equal(old.proximityObjectCentersNative[0].x,1500);
 assert.equal(moved.proximityObjectCentersNative.length,2);assert.equal(moved.proximityCount,1);
});

test('camera snapshots choose the graphics double buffer, retaining all four source-order signed16 corners',()=>{
 const buffers=[rectangle(0,0),rectangle(1000,1000)];
 for(let renderBufferIndex=0;renderBufferIndex<2;renderBufferIndex++){
  const corners=nativeAICameraCornerSnapshot({renderBufferIndex,cornerBuffersNative:buffers});
  assert.deepEqual(corners,buffers[renderBufferIndex]);
  assert.equal(nativeAICameraContains({cameraCornersNative:corners,positionNative:{x:renderBufferIndex*1000,z:renderBufferIndex*1000}}),true);
  assert.equal(nativeAICameraContains({cameraCornersNative:corners,positionNative:{x:(1-renderBufferIndex)*1000,z:(1-renderBufferIndex)*1000}}),false);
 }
});

test('a supplied degenerate corner buffer remains degenerate instead of gaining an invented camera footprint',()=>{
 const corners=nativeAICameraCornerSnapshot({renderBufferIndex:1,cornerBuffersNative:[rectangle(0,0),Array.from({length:4},()=>({x:0,z:0}))]});
 assert.equal(nativeAICameraContains({cameraCornersNative:corners,positionNative:{x:0,z:0}}),false);
 assert.deepEqual(corners,[{x:0,z:0},{x:0,z:0},{x:0,z:0},{x:0,z:0}]);
});

test('all results are copied, deeply immutable numeric values without changing caller records',()=>{
 const q=selection(),before=structuredClone(q),r=prepareNativeAISelectionCircle(q);
 q.requestedCenterNative.x=999;q.horizontalForwardsNative[0].z=0;
 assert.deepEqual(before.requestedCenterNative,{x:0,z:0});assert.equal(r.snappedCenterNative.x,0);
 for(const value of [r,r.snappedCenterNative,r.snapOffsetNative,r.outerVerticesNative,...r.outerVerticesNative,r.selectionCircleNative])assert.ok(Object.isFrozen(value));
 const source={proximityObjectCentersNative:[{x:.1,z:.2}],proximityCount:1},objects=nativeAIProximitySnapshot(source);
 source.proximityObjectCentersNative[0].x=20;assert.equal(objects.proximityObjectCentersNative[0].x,Math.fround(.1));
 assert.ok(Object.isFrozen(objects));assert.ok(Object.isFrozen(objects.proximityObjectCentersNative));assert.ok(Object.isFrozen(objects.proximityObjectCentersNative[0]));
 const buffers=[rectangle(0,0),rectangle(1,1)],corners=nativeAICameraCornerSnapshot({renderBufferIndex:0,cornerBuffersNative:buffers});
 buffers[0][0].x=20;assert.equal(corners[0].x,-100);assert.ok(Object.isFrozen(corners));assert.ok(corners.every(Object.isFrozen));
});

test('missing, unsupported and nonfinite selection inputs are rejected without synthesized defaults',()=>{
 for(const extra of [{radius:14},{radius:undefined},{selectionRadiusNative:undefined},{selectionRadiusNative:.5},{patchIndex:2},
  {requestedCenterNative:{x:Infinity,z:0}},{requestedCenterNative:{x:1e30,z:0}},
  {horizontalForwardsNative:[]},{horizontalForwardsNative:[{x:NaN,z:1}]}])assert.throws(()=>prepareNativeAISelectionCircle(selection(extra)));
 assert.throws(()=>nativeAISelectionCircleFromMesh({oppositeOuterVerticesNative:[{x:32768,z:0},{x:0,z:0}],snapOffsetNative:{x:0,z:0},selectionRadiusNative:1500}),/signed16|32767/);
 assert.throws(()=>nativeAISelectionCircleFromMesh({}),/two stored/);
});

test('proximity and retained-corner bounds are explicit, including unused records and buffers',()=>{
 assert.throws(()=>nativeAIProximitySnapshot({proximityObjectCentersNative:[],proximityCount:1}),/proximityCount/);
 assert.throws(()=>nativeAIProximitySnapshot({proximityObjectCentersNative:Array.from({length:65},()=>({x:0,z:0})),proximityCount:0}),/at most64/);
 assert.throws(()=>nativeAIProximitySnapshot({proximityObjectCentersNative:[{x:0,z:0},{x:NaN,z:0}],proximityCount:1}),/finite/);
 assert.throws(()=>nativeAICameraCornerSnapshot({renderBufferIndex:0,cornerBuffersNative:[rectangle(0,0)]}),/both/);
 assert.throws(()=>nativeAICameraCornerSnapshot({renderBufferIndex:0,cornerBuffersNative:[rectangle(0,0),[{x:32768,z:0},...rectangle(0,0).slice(1)]]}),/32767/);
 assert.throws(()=>nativeAICameraCornerSnapshot({renderBufferIndex:2,cornerBuffersNative:[rectangle(0,0),rectangle(0,0)]}),/renderBufferIndex/);
});
