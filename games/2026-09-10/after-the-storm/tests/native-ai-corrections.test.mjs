import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeAICourseEscape,prepareNativeAIFloorEscape,prepareNativeAIPlayerAvoidance,prepareNativeAICorrections} from '../native-ai-corrections.js';
import {prepareNativeAISteering} from '../native-ai-steering.js';
const F=Math.fround;
const course=(extra={})=>prepareNativeAICourseEscape({courseIndex:0,reverse:false,positionNative:{x:375,y:0,z:-1000},
 sourceLap:0,courseEscapeFrames:40,targetDirectionXZ:{x:.125,z:-.875},...extra});
const floor=(extra={})=>prepareNativeAIFloorEscape({courseIndex:1,dryFloorFrames:30,floorImpactNative:1,
 wetCount:0,impactNormalXZ:{x:3,z:-4},targetDirectionXZ:{x:.125,z:-.875},...extra});
const player=(extra={})=>prepareNativeAIPlayerAvoidance({difficulty:0,positionNativeXZ:{x:0,z:0},primaryHumanPositionNativeXZ:{x:100,z:0},
 rightXZ:{x:1,z:0},originNativeXZ:{x:0,z:0},targetNativeXZ:{x:200,z:300},targetDirectionXZ:{x:1,z:0},targetDistanceNative:100,...extra});

test('course escape retains direction for40 samples and replaces it on41; gaps reset',()=>{
 let count=0;
 for(let i=0;i<40;i++){const r=course({courseEscapeFrames:count});count=r.courseEscapeFrames;assert.equal(r.courseEscapeActive,true);assert.equal(r.courseEscapeApplied,false);assert.deepEqual(r.targetDirectionXZ,{x:.125,z:-.875});}
 assert.deepEqual(course({courseEscapeFrames:count}),{courseEscapeFrames:41,courseEscapeActive:true,courseEscapeApplied:true,targetDirectionXZ:{x:0,z:1}});
 assert.equal(course({positionNative:{x:0,y:0,z:0},courseEscapeFrames:100}).courseEscapeFrames,0);
});
test('source region edges are open after native binary32 coordinate rounding',()=>{
 for(const x of[350,400])assert.equal(course({positionNative:{x,y:0,z:-1000}}).courseEscapeActive,false);
 for(const z of[-1920,-750])assert.equal(course({positionNative:{x:375,y:0,z}}).courseEscapeActive,false);
 assert.equal(course({positionNative:{x:350+1e-7,y:0,z:-1000}}).courseEscapeActive,false);
 assert.equal(course({positionNative:{x:350.0000305175781,y:0,z:-1000}}).courseEscapeActive,true);
});
test('overlapping Port regions preserve last-match priority and unnormalized small directions',()=>{
 assert.deepEqual(course({courseIndex:5,positionNative:{x:-1050,y:0,z:-4300}}).targetDirectionXZ,{x:F(-.7071),z:F(-.7071)});
 assert.deepEqual(course({courseIndex:5,positionNative:{x:-975,y:0,z:-4300}}).targetDirectionXZ,{x:F(-.1),z:0});
});
test('native lap and height gates select course regions without browser lap conversion',()=>{
 for(const sourceLap of[-1,0,1])assert.equal(course({courseIndex:3,sourceLap,positionNative:{x:825,y:0,z:500}}).courseEscapeActive,true);
 assert.equal(course({courseIndex:3,sourceLap:2,positionNative:{x:825,y:0,z:500}}).courseEscapeActive,false);
 assert.deepEqual(course({courseIndex:6,positionNative:{x:2000,y:79.99999237060547,z:-8000}}).targetDirectionXZ,{x:0,z:-1});
 assert.equal(course({courseIndex:6,positionNative:{x:2000,y:80,z:-8000}}).courseEscapeActive,false);
 assert.deepEqual(course({courseIndex:6,positionNative:{x:2200,y:0,z:300}}).targetDirectionXZ,{x:F(-.7071),z:F(-.7071)});
});
test('Reverse selects its own source regions and the ordinary empty courses stay empty',()=>{
 assert.equal(course({courseIndex:8,reverse:false,positionNative:{x:100,y:0,z:2725}}).courseEscapeActive,false);
 assert.deepEqual(course({courseIndex:8,reverse:true,positionNative:{x:100,y:0,z:2725}}).targetDirectionXZ,{x:1,z:0});
 assert.deepEqual(course({courseIndex:3,reverse:true,positionNative:{x:-2900,y:0,z:2000}}).targetDirectionXZ,{x:0,z:1});
 for(const reverse of[false,true])assert.equal(course({courseIndex:1,reverse}).courseEscapeFrames,0);
});
test('course and floor counters retain source signed32 wrap',()=>{
 assert.equal(course({courseEscapeFrames:2147483647}).courseEscapeFrames,-2147483648);
 assert.equal(course({courseEscapeFrames:2147483647}).courseEscapeApplied,false);
 assert.equal(floor({dryFloorFrames:2147483647}).dryFloorFrames,-2147483648);
 assert.equal(floor({dryFloorFrames:2147483647}).floorEscapeApplied,false);
});
test('dry floor escape starts at31, uses reciprocal float normalization and resets on water or excluded courses',()=>{
 assert.equal(floor({dryFloorFrames:29}).floorEscapeApplied,false);
 assert.deepEqual(floor().targetDirectionXZ,{x:F(3*F(1/5)),z:F(-4*F(1/5))});
 for(const courseIndex of[4,6,8])assert.equal(floor({courseIndex,dryFloorFrames:90}).dryFloorFrames,0);
 for(const wetCount of[1,8])assert.equal(floor({wetCount}).dryFloorFrames,0);
 assert.equal(floor({floorImpactNative:0}).dryFloorFrames,0);
 assert.equal(floor({floorImpactNative:-1}).floorEscapeApplied,true);
 assert.deepEqual(floor({impactNormalXZ:{x:0,z:0}}).targetDirectionXZ,{x:.125,z:-.875});
});
test('player avoidance uses the strict original DOUBLE.995 gate and no range limit',()=>{
 assert.equal(player({targetDirectionXZ:{x:F(.995),z:0}}).avoidanceApplied,true);
 assert.equal(player({targetDirectionXZ:{x:.9949999451637268,z:0}}).avoidanceApplied,false);
 assert.equal(player({primaryHumanPositionNativeXZ:{x:100000,z:0}}).avoidanceApplied,true);
 assert.equal(player({primaryHumanPositionNativeXZ:{x:0,z:0}}).avoidanceApplied,false);
 assert.equal(player({targetDirectionXZ:{x:-1,z:0}}).avoidanceApplied,false);
});
test('player avoidance retains raw body right and recomputes point from the selected segment origin',()=>{
 const r=player({rightXZ:{x:2,z:0},originNativeXZ:{x:10,z:0}});
 assert.deepEqual(r.targetNativeXZ,{x:-20,z:0});assert.equal(r.targetDistanceNative,30);assert.deepEqual(r.targetDirectionXZ,{x:-1,z:0});
 assert.deepEqual(player({rightXZ:{x:-1,z:0}}).targetNativeXZ,{x:40,z:0});
 const coincident=player({primaryHumanPositionNativeXZ:{x:60,z:0}});
 assert.equal(coincident.avoidanceApplied,true);assert.equal(coincident.targetDistanceNative,0);assert.deepEqual(coincident.targetDirectionXZ,{x:0,z:0});
});
test('difficulty2 retains the entire target segment without executing unused player arithmetic',()=>{
 const r=player({difficulty:2,positionNativeXZ:{x:3e38,z:3e38},primaryHumanPositionNativeXZ:{x:-3e38,z:-3e38}});
 assert.equal(r.avoidanceApplied,false);assert.deepEqual(r.targetNativeXZ,{x:200,z:300});assert.equal(r.targetDistanceNative,100);
 assert.deepEqual(r.targetDirectionXZ,{x:1,z:0});
});
test('source course→floor→player order preserves direction-only target ownership and feeds bounded steering',()=>{
 const segment={originNativeXZ:{x:375,z:-1000},targetNativeXZ:{x:1000,z:1000},directionXZ:{x:.125,z:-.875},distanceNative:250};
 const input={targetSegment:segment,courseIndex:0,reverse:false,positionNative:{x:375,y:0,z:-1000},sourceLap:0,
  courseEscapeFrames:40,dryFloorFrames:30,floorImpactNative:1,wetCount:0,impactNormalXZ:{x:3,z:-4},difficulty:2,
  primaryHumanPositionNativeXZ:{x:435,z:-1080},rightXZ:{x:1,z:0}};
 const before=structuredClone(input),r=prepareNativeAICorrections(input);
 assert.deepEqual(input,before);assert.equal(r.courseEscapeApplied,true);assert.equal(r.floorEscapeApplied,true);assert.equal(r.avoidanceApplied,false);
 assert.deepEqual(r.targetSegment.targetNativeXZ,segment.targetNativeXZ);assert.equal(r.targetSegment.distanceNative,250);
 assert.deepEqual(r.targetSegment.directionXZ,{x:F(.6),z:F(-.8)});
 const next=prepareNativeAICorrections({...input,difficulty:0});assert.equal(next.avoidanceApplied,true);
 assert.deepEqual(next.targetSegment.targetNativeXZ,{x:375,z:-1080});assert.deepEqual(next.targetSegment.directionXZ,{x:0,z:-1});
 const steering=prepareNativeAISteering({targetDirectionXZ:next.targetSegment.directionXZ,forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},
  predictedDirectionXZ:{x:0,z:1},steeringDegrees:30,turnBudgetDegrees:32,previousRawXNative:0,recoveryPhase:0,stuckFrames:0,wetCount:8,impactNormalXZ:{x:0,z:0}});
 assert.equal(steering.wrongWay,true);assert.equal(steering.rawXNative,-70);
 assert.ok(Object.isFrozen(next));assert.ok(Object.isFrozen(next.targetSegment));assert.ok(Object.isFrozen(next.targetSegment.directionXZ));
});
test('correction leaves reject invalid native data without mutating caller state',()=>{
 assert.throws(()=>course({reverse:1}),/reverse/);assert.throws(()=>course({courseIndex:9}),/courseIndex/);
 assert.throws(()=>course({courseEscapeFrames:2147483648}),/courseEscapeFrames/);assert.throws(()=>course({sourceLap:1.5}),/sourceLap/);
 assert.throws(()=>floor({wetCount:9}),/wetCount/);assert.throws(()=>floor({floorImpactNative:Infinity}),/floorImpactNative/);
 assert.throws(()=>floor({impactNormalXZ:{x:3e38,z:3e38}}),/overflow/);
 assert.throws(()=>player({targetDistanceNative:-1}),/nonnegative/);assert.throws(()=>prepareNativeAICorrections({}),/targetSegment/);
});
