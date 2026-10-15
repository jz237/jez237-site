import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRiderActionPoseInitialization,nativeRiderIdlePoseOutcome,
 prepareNativeRiderActionPoseCompletion as finish} from '../native-rider-action-pose-lifecycle.js';

const state=(actorState,animationFrame=19,physicalMode=0)=>({actorState,animationFrame,physicalMode});
const outcome=nextAnimationFrame=>({nextAnimationFrame});
const active={rawYNative:0,finished2c2c:0,record2c24:0};
const cue={racerIndex:1,primaryRacerIndex:1,gameMode648:3};
const typesAfter=result=>{
 const types=Array(19).fill(4);
 for(const {jointIndex,type}of result.jointTypeWrites)types[jointIndex]=type;
 return types;
};

test('actor8 stores entry30 then holds prior frame at31 only on positive rawY and a live record',()=>{
 const entered=finish(state(8),outcome(30),cue);
 assert.equal(entered.animationFrame,30);assert.deepEqual(entered.effects,[{kind:'actionPoseCue',actorState:8}]);
 assert.equal(finish(state(8,30),outcome(31),{...active,rawYNative:35}).animationFrame,30);
 assert.equal(finish(state(8,30),outcome(31),{...active,rawYNative:34}).animationFrame,31);
 assert.equal(finish(state(8,30),outcome(31),{rawYNative:35,finished2c2c:-1}).animationFrame,31);
 assert.equal(finish(state(8,30),outcome(31),{...active,rawYNative:35,record2c24:1}).animationFrame,31);
 assert.equal(finish(state(8),outcome(32)).animationFrame,32);
});

test('actor9 changes grip constraints at23,60 and84 in source store order',()=>{
 assert.deepEqual(finish(state(9),outcome(22)).jointTypeWrites,[]);
 assert.deepEqual(finish(state(9),outcome(23)).jointTypeWrites,[{jointIndex:6,type:3},{jointIndex:14,type:2}]);
 assert.deepEqual(finish(state(9),outcome(59)).jointTypeWrites,[{jointIndex:6,type:3},{jointIndex:14,type:2}]);
 assert.deepEqual(finish(state(9),outcome(60)).jointTypeWrites,[{jointIndex:14,type:1},{jointIndex:6,type:1}]);
 assert.deepEqual(finish(state(9),outcome(83)).jointTypeWrites,[{jointIndex:14,type:1},{jointIndex:6,type:1}]);
 assert.deepEqual(finish(state(9),outcome(84)).jointTypeWrites,[{jointIndex:6,type:2},{jointIndex:14,type:3}]);
});

test('actor9 return25 selects stored25 or62 using retained direction bit, not held buttons',()=>{
 assert.equal(finish(state(9),outcome(25),{...cue,directionMask15f6:0x400,heldButtonsB56:0}).animationFrame,25);
 const alternate=finish(state(9),outcome(25),{...cue,directionMask15f6:0x800,heldButtonsB56:0x400});
 assert.equal(alternate.animationFrame,62);assert.equal(alternate.effects.length,1);
});

test('actor9 holds prior frame at46 strictly below negative34 and releases on either terminal flag',()=>{
 assert.equal(finish(state(9,45,1),outcome(46),{...active,rawYNative:-35}).animationFrame,45);
 assert.equal(finish(state(9,45,1),outcome(46),{...active,rawYNative:-34}).animationFrame,46);
 assert.equal(finish(state(9,45,1),outcome(46),{rawYNative:-35,finished2c2c:1}).animationFrame,46);
 assert.equal(finish(state(9,45,1),outcome(46),{...active,rawYNative:-35,record2c24:-1}).animationFrame,46);
});

test('actor17 entry23 binds all joints before explicit grip and foot overrides',()=>{
 const r=finish(state(17),outcome(23),cue);
 assert.equal(r.animationFrame,23);assert.equal(r.physicalMode,1);assert.equal(r.jointTypeWrites.length,25);
 assert.deepEqual(r.jointTypeWrites.slice(0,19),Array.from({length:19},(_,i)=>({jointIndex:18-i,type:1})));
 const expected=Array(19).fill(1);expected[6]=2;expected[14]=3;
 for(const i of [18,17,10,9])expected[i]=0;
 assert.deepEqual(typesAfter(r),expected);
});

test('actor17 frame24 hold, ordinary release and negative35 skip preserve exact physical-mode lifecycle',()=>{
 const held=finish(state(17,23,1),outcome(24),{...active,rawYNative:35});
 assert.equal(held.animationFrame,23);assert.equal(held.physicalMode,1);assert.deepEqual(held.jointTypeWrites,[]);
 for(const y of [34,0,-35]){
  const r=finish(state(17,23,1),outcome(24),{...active,rawYNative:y});
  assert.equal(r.animationFrame,24);assert.equal(r.physicalMode,0);assert.deepEqual(typesAfter(r),Array(19).fill(0));
 }
 const skip=finish(state(17,23,1),outcome(24),{...active,rawYNative:-36});assert.equal(skip.animationFrame,40);
 const finished=finish(state(17,23,1),outcome(24),{finished2c2c:1});
 assert.equal(finished.animationFrame,24);assert.equal(finished.physicalMode,1);assert.deepEqual(finished.jointTypeWrites,[]);
});

test('feedback call is gated by primary source slot and648, with branch-local required inputs',()=>{
 for(const [actor,next]of [[8,30],[9,25],[17,23]]){
  const fields=actor===9?{directionMask15f6:0}:{};
  assert.deepEqual(finish(state(actor),outcome(next),{...fields,racerIndex:0,primaryRacerIndex:1}).effects,[]);
  assert.deepEqual(finish(state(actor),outcome(next),{...fields,...cue,gameMode648:1}).effects,[]);
  assert.equal(finish(state(actor),outcome(next),{...fields,...cue,gameMode648:0}).effects.length,1);
 }
});

test('negative completion requests common blend without altering frame, mode or joints',()=>{
 for(const actor of [8,9,10,17]){
  const r=finish(state(actor,7,1),outcome(-1));
  assert.deepEqual(r.actorRequest,{actorState:22,animationFrame:0,blend:Math.fround(.15),holdFrame:0});
  assert.equal(r.animationFrame,7);assert.equal(r.physicalMode,1);assert.deepEqual(r.jointTypeWrites,[]);
 }
});

test('idle actor10 exits on any held button or working-axis magnitude over12',()=>{
 const neutral={heldButtonsB56:0,workingXNative:0,workingYNative:0};
 for(const x of [-12,12])for(const y of [-12,12])assert.equal(finish(state(10),outcome(27),{...neutral,workingXNative:x,workingYNative:y}).actorRequest,null);
 for(const input of [{heldButtonsB56:1},{heldButtonsB56:0x10},{heldButtonsB56:0xffff},{workingXNative:-13},{workingXNative:13},{workingYNative:-13},{workingYNative:13}]){
  const r=finish(state(10),outcome(27),{...neutral,...input});assert.equal(r.actorRequest.actorState,22);assert.equal(r.animationFrame,27);
 }
 assert.equal(finish(state(10),outcome(27),{heldButtonsB56:1}).animationFrame,27);
});

test('idle evaluator wrapper preserves choice1 restart and the25 early exit priority',()=>{
 for(const choice of [0,1,2,3]){
  assert.equal(nativeRiderIdlePoseOutcome({nextAnimationFrame:25,idleChoice16c4:choice}),choice===1||choice===2?-1:25);
  assert.equal(nativeRiderIdlePoseOutcome({nextAnimationFrame:-1,idleChoice16c4:choice}),choice===1?1:-1);
 }
 assert.equal(nativeRiderIdlePoseOutcome({nextAnimationFrame:24}),24);
 assert.equal(nativeRiderIdlePoseOutcome({nextAnimationFrame:-2147483648,idleChoice16c4:3}),-2147483648);
});

test('actor25 stores the actual zero outcome and leaves its earlier return request external',()=>{
 const r=finish(state(25,12,1),outcome(0));
 assert.equal(r.animationFrame,0);assert.equal(r.actorRequest,null);assert.deepEqual(r.jointTypeWrites,[]);
 assert.throws(()=>finish(state(25),outcome(1)),/return0/);
});

test('actor10 initializer differs from ordinary constrained feet and delegates other initializers',()=>{
 const r=nativeRiderActionPoseInitialization({actorState:10});assert.equal(r.physicalMode,1);
 const expected=Array(19).fill(1);expected[6]=2;expected[14]=3;
 for(const i of [9,10,17,18])expected[i]=0;
 assert.deepEqual(r.riderJointTypes,expected);
 assert.equal(nativeRiderActionPoseInitialization({actorState:8,alternate16cc:0}).physicalMode,0);
 assert.deepEqual(nativeRiderActionPoseInitialization({actorState:17,alternate16cc:1}).riderJointTypes,Array(19).fill(0));
});

test('required native ranges are validated and pure results cannot mutate the input',()=>{
 const s=state(17,23,1),q={...active,rawYNative:-36};const r=finish(s,outcome(24),q);
 assert.deepEqual(s,state(17,23,1));assert.deepEqual(q,{...active,rawYNative:-36});
 assert(Object.isFrozen(r));assert(Object.isFrozen(r.jointTypeWrites[0]));
 assert.throws(()=>{r.jointTypeWrites[0].type=4;},TypeError);
 assert.throws(()=>finish(state(22),outcome(0)),/Only action/);
 assert.throws(()=>finish(state(8),outcome(31),{...active,rawYNative:128}),RangeError);
 assert.throws(()=>finish(state(9),outcome(25),{...cue,directionMask15f6:-1}),RangeError);
 assert.throws(()=>finish(state(10),outcome(1),{heldButtonsB56:0,workingXNative:0,workingYNative:NaN}),RangeError);
 assert.throws(()=>finish(state(8),outcome(31),{rawYNative:35,finished2c2c:0}),RangeError);
 assert.throws(()=>nativeRiderIdlePoseOutcome({nextAnimationFrame:25}),RangeError);
});
