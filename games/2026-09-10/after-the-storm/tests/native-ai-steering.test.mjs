import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeAISteering} from '../native-ai-steering.js';

const xz=(x=0,z=0)=>({x,z});
// Independently chosen numeric vectors isolate the steering consumer. No course
// layout, original animation/mesh data, captured controls or authored navigator
// is embedded in these expectations. The target is explicitly already final.
const request=(overrides={})=>({targetDirectionXZ:xz(0,1),forwardXZ:xz(0,1),rightXZ:xz(1,0),
 predictedDirectionXZ:xz(0,1),steeringDegrees:30,turnBudgetDegrees:30,previousRawXNative:0,
 recoveryPhase:2,stuckFrames:0,wetCount:8,impactNormalXZ:xz(),...overrides});
const run=(overrides={})=>prepareNativeAISteering(request(overrides));

test('neutral finalized direction produces raw neutral controls without inventing a target',()=>{
 assert.deepEqual(run(),{rawXNative:0,rawYNative:0,lateralError:0,wrongWay:false,
  recoveryPhase:0,lastRawXNative:0,desiredRawXNative:0});
 assert.throws(()=>prepareNativeAISteering(),/targetDirectionXZ/);
});

test('moderate quarter lateral error gives signed raw35 steering and truncates negative17.5 trim',()=>{
 const right=run({targetDirectionXZ:xz(.25,1)}),left=run({targetDirectionXZ:xz(-.25,1)});
 assert.deepEqual([right.rawXNative,right.rawYNative,right.desiredRawXNative],[-35,-17,-35]);
 assert.deepEqual([left.rawXNative,left.rawYNative,left.desiredRawXNative],[35,-17,35]);
 assert.equal(right.lastRawXNative,-35);assert.equal(left.lastRawXNative,35);
 assert.equal(right.recoveryPhase,2);assert.equal(left.recoveryPhase,0);
});

test('deadzone uses the float32 threshold with strict equality',()=>{
 const equal=run({targetDirectionXZ:xz(.05000000074505806,1)});
 const inside=run({targetDirectionXZ:xz(.04999999701976776,1)});
 const outside=run({targetDirectionXZ:xz(.05000000447034836,1)});
 assert.deepEqual([inside.rawXNative,inside.rawYNative,equal.rawXNative,equal.rawYNative],[0,0,0,0]);
 assert.deepEqual([outside.rawXNative,outside.rawYNative],[-7,-3]);
});

test('exact half error retains moderate trim while the next float32 uses sharp negative42 trim',()=>{
 const half=run({targetDirectionXZ:xz(.5,1)}),sharp=run({targetDirectionXZ:xz(.5000000596046448,1)});
 assert.deepEqual([half.rawXNative,half.rawYNative],[-70,-35]);
 assert.deepEqual([sharp.rawXNative,sharp.rawYNative],[-70,-42]);
 assert.deepEqual([run({targetDirectionXZ:xz(-.75,1)}).rawXNative,run({targetDirectionXZ:xz(-.75,1)}).rawYNative],[70,-42]);
});

test('phase clearing is asymmetric and compares float32 error against a double0.15',()=>{
 assert.equal(run({targetDirectionXZ:xz(.14999999105930328,1),recoveryPhase:3}).recoveryPhase,0);
 assert.equal(run({targetDirectionXZ:xz(.15,1),recoveryPhase:3}).recoveryPhase,3);
 assert.equal(run({targetDirectionXZ:xz(-.9,1),recoveryPhase:3}).recoveryPhase,0);
});

test('horizontal right is normalized but the supplied target is not normalized again',()=>{
 const result=run({targetDirectionXZ:xz(.25,1),rightXZ:xz(.5,0)});
 assert.equal(result.lateralError,.25);assert.deepEqual([result.rawXNative,result.rawYNative],[-35,-17]);
 assert.deepEqual(run({rightXZ:xz(),previousRawXNative:48}),run());
});

test('predicted motion countersteering suppresses both steering target and trim',()=>{
 const result=run({targetDirectionXZ:xz(.25,1),predictedDirectionXZ:xz(1,0)});
 assert.equal(result.lateralError,.25);assert.equal(result.wrongWay,false);
 assert.deepEqual([result.desiredRawXNative,result.rawXNative,result.rawYNative],[0,0,0]);
});

test('wrong-way turn overrides the steering target while preserving separately calculated trim',()=>{
 const positive=run({targetDirectionXZ:xz(.25,-1)}),negative=run({targetDirectionXZ:xz(-.25,-1)});
 assert.equal(positive.wrongWay,true);assert.equal(negative.wrongWay,true);
 assert.deepEqual([positive.rawXNative,positive.rawYNative],[-70,-17]);
 assert.deepEqual([negative.rawXNative,negative.rawYNative],[70,-17]);
});

test('two-stage35 update can snap70 in one call and has the exact three-call reversal',()=>{
 const input={targetDirectionXZ:xz(-1,0),previousRawXNative:0};
 assert.equal(run(input).rawXNative,70,'0->35->70 after the remaining-gap check');
 const history=[];let previous=-70;
 for(let i=0;i<3;i++){previous=run({...input,previousRawXNative:previous}).rawXNative;history.push(previous);}
 assert.deepEqual(history,[-35,0,70]);
});

test('explicit turn budget and physical steering degrees remain separate without a rider lookup',()=>{
 const base={targetDirectionXZ:xz(.25,1),steeringDegrees:40};
 assert.equal(run({...base,turnBudgetDegrees:20}).desiredRawXNative,-17);
 assert.equal(run({...base,turnBudgetDegrees:10}).desiredRawXNative,-8);
 assert.equal(run({...base,turnBudgetDegrees:0}).desiredRawXNative,0);
});

test('post-slew stuck recovery requires count50 and dry contact or enough shared horizontal normal',()=>{
 const base={targetDirectionXZ:xz(.25,1)};
 assert.equal(run({...base,stuckFrames:49,wetCount:0}).rawXNative,-35);
 assert.equal(run({...base,stuckFrames:50,wetCount:0}).rawXNative,-70);
 assert.equal(run({...base,stuckFrames:50,wetCount:8}).rawXNative,-35);
 assert.equal(run({...base,stuckFrames:50,wetCount:8,impactNormalXZ:xz(.5,0)}).rawXNative,-35);
 assert.equal(run({...base,stuckFrames:50,wetCount:8,impactNormalXZ:xz(1,0)}).rawXNative,-70);
 assert.equal(run({stuckFrames:50,wetCount:0}).rawXNative,70,'exact zero error takes the positive recovery turn');
});

test('stuck normal uses the recovered double0.95 after float32 squaring',()=>{
 const base={targetDirectionXZ:xz(.25,1),stuckFrames:50,wetCount:8};
 assert.equal(run({...base,impactNormalXZ:xz(.9746794104576111,0)}).rawXNative,-35);
 assert.equal(run({...base,impactNormalXZ:xz(.9746794700622559,0)}).rawXNative,-70);
});

test('input/history values stay caller-owned and outputs do not retain mutable vectors',()=>{
 const q=request({targetDirectionXZ:xz(.25,1)}),before=structuredClone(q);
 for(const p of [q.targetDirectionXZ,q.forwardXZ,q.rightXZ,q.predictedDirectionXZ,q.impactNormalXZ])Object.freeze(p);
 Object.freeze(q);const result=prepareNativeAISteering(q);
 assert.deepEqual(q,before);assert.ok(Object.isFrozen(result));
 assert.throws(()=>{result.rawXNative=70;},TypeError);
 assert.equal(prepareNativeAISteering(q).rawXNative,-35);
});

test('signed slow-counter wrap remains an ordinary steering input without a stuck override',()=>{
 for(const stuckFrames of[-2147483648,-1]){
  const wrapped=run({stuckFrames,wetCount:0}),ordinary=run({stuckFrames:0,wetCount:0});
  assert.deepEqual(wrapped,ordinary);
 }
});

test('missing, nonfinite and unsupported physical/AI inputs reject without inferred defaults',()=>{
 for(const change of [{targetDirectionXZ:null},{rightXZ:xz(NaN,0)},{forwardXZ:xz(0,Infinity)},
  {predictedDirectionXZ:xz(1e100,0)},{impactNormalXZ:xz(0,NaN)},
  {steeringDegrees:0},{steeringDegrees:-1},{turnBudgetDegrees:-1},{turnBudgetDegrees:1e38},
  {previousRawXNative:128},{previousRawXNative:.5},{recoveryPhase:4},{stuckFrames:-2147483649},{wetCount:9}]){
  assert.throws(()=>run(change));
 }
 assert.throws(()=>run({targetDirectionXZ:xz(1,0),turnBudgetDegrees:1e9,steeringDegrees:.001}),/conversion/);
});
