import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NATIVE_STUNT_MOVE as MOVE,createNativeStuntScoring,stepNativeStuntScoring,
  collectNativeStuntRing,nativeStuntCheckpointTime,classifyNativeStuntFrame,
  accumulateNativeStuntArc
} from '../native-stunt-scoring.js';

const pose=(move,frames)=>Array.from({length:frames},()=>({move}));
const checkpoint=(extra={})=>({atFinishLine:false,completeRun:false,
  remainingClockNative:1000,crossingOffsetNative:0,...extra});
function replay(frames,state=createNativeStuntScoring()){
  const awards=[];
  for(const frame of frames){const next=stepNativeStuntScoring(state,frame);state=next.state;awards.push(...next.awards);}
  return {state,awards};
}
const trickPoints=awards=>awards.filter(a=>a.kind==='trick').map(a=>a.points);
const vec=(x=0,y=0,z=0)=>({x,y,z});
const arcInput=(extra={})=>({frontVelocityNative:vec(10,0,2),rearVelocityNative:vec(10,0,-2),
  bodyDeltaNative:vec(10,0,0),rightY:0,...extra});

test('scoring runs are independent and leave earlier snapshots untouched',()=>{
  const original=createNativeStuntScoring(),snapshot=structuredClone(original);
  const {state,awards}=replay([{move:MOVE.HANDSTAND},{move:MOVE.NONE}],original);
  assert.deepEqual(original,snapshot);
  assert.deepEqual(createNativeStuntScoring(),snapshot);
  assert.deepEqual(awards,[{kind:'trick',points:250,finish:false}]);
  assert.equal(state.completed.handstand,true);
  assert.equal(state.repeat.handstand,true);
  assert.equal(original.completed.handstand,false);
  assert.equal(original.repeat.handstand,false);
});

test('held poses award their base once and their per-frame increments only on release',()=>{
  for(const [move,points] of [[1,349],[2,599],[9,199],[11,3470]]){
    const held=replay(pose(move,100));
    assert.deepEqual(held.awards,[]);
    assert.equal(held.state.pending,points);
    const released=replay([{move:0}],held.state);
    assert.deepEqual(trickPoints(released.awards),[points]);
    assert.equal(released.state.pending,0);
  }
});

test('a repeated held move becomes ten points regardless of its duration',()=>{
  for(const move of [1,2,9,11]){
    const {state,awards}=replay([...pose(move,2),{move:0},...pose(move,80),{move:0}]);
    assert.deepEqual(trickPoints(awards),[move===1?251:move===2?501:move===9?101:530,10]);
    assert.equal(state.pending,0);
  }
});

test('standing and somersault share a repeat category; the first 9→10 adds 400',()=>{
  const fresh=replay([...pose(9,5),{move:10},{move:0}]);
  assert.deepEqual(trickPoints(fresh.awards),[504]);
  assert.equal(fresh.state.completed.standing,true);
  assert.equal(fresh.state.completed.somersault,true);
  assert.equal(fresh.state.repeat.standing,true);
  const repeated=replay([{move:9},{move:10}],fresh.state);
  assert.deepEqual(trickPoints(repeated.awards),[10]);
  const plainFirst=replay([{move:9},{move:0},{move:9},{move:10}]);
  assert.deepEqual(trickPoints(plainFirst.awards),[100,10]);
  const noEntry=replay([{move:10}]);
  assert.deepEqual(noEntry.awards,[]);
  assert.equal(noEntry.state.completed.somersault,false);
});

test('a direct pose change has no new entry base and does not settle the prior pose',()=>{
  const {state,awards}=replay([{move:1},{move:2},{move:0}]);
  assert.deepEqual(trickPoints(awards),[251]);
  assert.equal(state.completed.handstand,false);
  assert.equal(state.completed.backwards,true);
});

test('checkpoint reset occurs after same-frame repeat settlement',()=>{
  let {state}=replay([{move:1},{move:0},{move:1}]);
  const crossing=stepNativeStuntScoring(state,{move:0,checkpoint:checkpoint()});
  assert.deepEqual(crossing.awards,[{kind:'trick',points:10,finish:false},{kind:'time',points:50,finish:false}]);
  assert.deepEqual(crossing.state.repeat,{handstand:false,backwards:false,standing:false,dive:false});
  const after=replay([{move:1},{move:0}],crossing.state);
  assert.deepEqual(trickPoints(after.awards),[250]);
});

test('a checkpoint does not cash out a held move or clear its accumulator',()=>{
  const {state}=replay([{move:2},{move:0},{move:2}]);
  const crossing=stepNativeStuntScoring(state,{move:2,checkpoint:checkpoint()});
  assert.deepEqual(crossing.awards,[{kind:'time',points:50,finish:false}]);
  assert.equal(crossing.state.pending,501);
  assert.equal(crossing.state.repeat.backwards,false);
  assert.deepEqual(trickPoints(replay([{move:0}],crossing.state).awards),[501]);
});

test('rotation latch survives release and scores point arc rather than active-frame points',()=>{
  const released=replay([{move:3},{move:3},{move:0},{move:0},{move:0}]);
  assert.equal(released.state.pending,150);
  assert.equal(released.state.rotationGroup,1);
  assert.deepEqual(released.awards,[]);
  const landed=replay([{move:6,arcNative:100}],released.state);
  assert.deepEqual(trickPoints(landed.awards),[1430]);
  assert.equal(landed.state.completed.negativeRoll,true);
  assert.equal(landed.state.rotationGroup,0);
  assert.equal(landed.state.pending,0);
});

test('partial landings halve the arc coefficient and never complete a rotation category',()=>{
  const partial=replay([{move:4},{move:7,arcNative:100}]);
  assert.deepEqual(trickPoints(partial.awards),[715]);
  assert.equal(partial.state.completed.positiveRoll,false);
  assert.equal(partial.state.pending,0);
  const repeated=replay([{move:4},{move:6,arcNative:100},{move:4},{move:6,arcNative:100}]);
  assert.deepEqual(trickPoints(repeated.awards),[1430,1430]);
  assert.equal(repeated.state.completed.positiveRoll,true);
});

test('failed and nonpositive rotation results discard pending and do not grant mastery',()=>{
  for(const frame of [{move:8},{move:6,arcNative:0},{move:6,arcNative:-10},{move:7,arcNative:-10}]){
    const {state,awards}=replay([{move:5},{move:0},frame]);
    assert.deepEqual(awards,[]);
    assert.equal(state.completed.flip,false);
    assert.equal(state.pending,0);
    assert.equal(state.rotationGroup,0);
  }
});

test('binary32 multiplication occurs before rotation-score truncation',()=>{
  const arcNative=.0699300691485405;
  assert.equal(Math.trunc(arcNative*14.3),0);
  const {state,awards}=replay([{move:5},{move:6,arcNative}]);
  assert.deepEqual(trickPoints(awards),[1]);
  assert.equal(state.completed.flip,true);
});

test('a rotation latch blocks pose release until a result or explicit clearing event',()=>{
  const {state,awards}=replay([{move:3},{move:1},{move:0}]);
  assert.deepEqual(awards,[]);
  assert.equal(state.pending,90);
  assert.equal(state.completed.handstand,false);
  assert.equal(state.rotationGroup,1);
});

test('finish settles a held pose after its current-frame increment and 20 further calls',()=>{
  const finish=checkpoint({atFinishLine:true,completeRun:true});
  const crossed=replay([{move:1},{move:1,checkpoint:finish}]);
  assert.deepEqual(crossed.awards,[{kind:'time',points:50,finish:true}]);
  assert.equal(crossed.state.delayedTrick,251);
  assert.equal(crossed.state.delayedTicks,20);
  assert.equal(crossed.state.finished,true);
  assert.equal(crossed.state.completed.handstand,true);
  const before=replay(pose(0,19),crossed.state);
  assert.deepEqual(before.awards,[]);
  assert.equal(before.state.delayedTicks,1);
  const paid=replay([{move:0}],before.state);
  assert.deepEqual(paid.awards,[{kind:'trick',points:251,finish:true}]);
  assert.equal(paid.state.delayedTrick,0);
  assert.deepEqual(replay(pose(0,30),paid.state).awards,[]);
});

test('finish repeat penalties do not reset at the finish line',()=>{
  const finish=checkpoint({atFinishLine:true,completeRun:true});
  const crossed=replay([{move:11},{move:0},{move:11,checkpoint:finish}]);
  assert.deepEqual(trickPoints(crossed.awards),[500]);
  assert.equal(crossed.state.delayedTrick,10);
  assert.equal(crossed.state.repeat.dive,true);
  assert.deepEqual(replay(pose(0,20),crossed.state).awards,[{kind:'trick',points:10,finish:true}]);
});

test('finish flushes unfinished rotation accumulation without granting a landing category',()=>{
  const crossed=replay([{move:5},{move:0,checkpoint:checkpoint({atFinishLine:true,completeRun:true})}]);
  assert.equal(crossed.state.delayedTrick,60);
  assert.equal(crossed.state.completed.flip,false);
  assert.equal(crossed.state.rotationGroup,3);
});

test('nonterminal finish-line checkpoints retain repeats and leave the run active',()=>{
  const first=replay([{move:9},{move:0}]);
  const crossing=stepNativeStuntScoring(first.state,{move:0,
    checkpoint:checkpoint({atFinishLine:true})});
  assert.equal(crossing.state.repeat.standing,true);
  assert.equal(crossing.state.finished,false);
  assert.equal(crossing.state.delayedTicks,0);
  assert.deepEqual(crossing.awards,[{kind:'time',points:50,finish:true}]);
});

test('inactive scoring preserves pending and repeat state while scheduled finish calls advance',()=>{
  const held=replay([{move:2}]);
  const idle=stepNativeStuntScoring(held.state,{move:0,active:false,checkpoint:checkpoint()});
  assert.deepEqual(idle.state,held.state);
  assert.deepEqual(idle.awards,[]);
  const finish=replay([{move:2,checkpoint:checkpoint({atFinishLine:true,completeRun:true})}]);
  const paid=replay(Array.from({length:20},()=>({move:0,active:false})),finish.state);
  assert.deepEqual(paid.awards,[{kind:'trick',points:500,finish:true}]);
});

test('ring chains follow newly collected source ordinals and reset on out-of-order contact',()=>{
  let state=createNativeStuntScoring();const points=[];
  for(const ringIndex of [0,1,4,5,2,3]){
    const next=collectNativeStuntRing(state,{ringIndex});state=next.state;points.push(...next.awards.map(a=>a.points));
  }
  assert.deepEqual(points,[50,100,50,100,50,100]);
  assert.equal(state.ringCount,6);
  assert.equal(state.nextRingIndex,4);
  const duplicate=collectNativeStuntRing(state,{ringIndex:4});
  assert.deepEqual(duplicate.awards,[]);
  assert.deepEqual(duplicate.state,state);
  assert.deepEqual(collectNativeStuntRing(state,{ringIndex:6,active:false}).awards,[]);
});

test('checkpoint-time interpolation uses absolute signed distances and integer half-offset rounding',()=>{
  assert.deepEqual(nativeStuntCheckpointTime({currentPlaneDistance:-3,previousPlaneDistance:7,remainingClockNative:991}),
    {crossingOffsetNative:15,points:45});
  assert.deepEqual(nativeStuntCheckpointTime({currentPlaneDistance:7,previousPlaneDistance:-3,remainingClockNative:983}),
    {crossingOffsetNative:35,points:50});
  assert.deepEqual(nativeStuntCheckpointTime({currentPlaneDistance:0,previousPlaneDistance:10,remainingClockNative:1000}),
    {crossingOffsetNative:0,points:50});
  assert.deepEqual(nativeStuntCheckpointTime({currentPlaneDistance:10,previousPlaneDistance:0,remainingClockNative:0}),
    {crossingOffsetNative:50,points:0});
});

test('pose actors and exact standing animation frames classify before manipulation actions',()=>{
  const classify=options=>classifyNativeStuntFrame({actorState:22,...options}).move;
  assert.equal(classify({actorState:8,action:4}),1);
  assert.equal(classify({actorState:9,action:2}),2);
  assert.equal(classify({actorState:17,animationFrame:36}),9);
  assert.equal(classify({actorState:17,animationFrame:37}),0);
  assert.equal(classify({actorState:17,animationFrame:38}),9);
  assert.equal(classify({actorState:17,animationFrame:60}),10);
  assert.equal(classify({action:2}),3);
  assert.equal(classify({action:1}),4);
  assert.equal(classify({action:4}),5);
  assert.equal(classify({action:3,wetCount:11}),0);
  assert.equal(classify({action:3,wetCount:12}),11);
});

test('release arms five landing calls on wet contact, without requiring continued contact',()=>{
  let c=classifyNativeStuntFrame({actorState:22,landingTicks:-1,anyWet:false});
  assert.equal(c.landingTicks,-1);
  c=classifyNativeStuntFrame({actorState:22,landingTicks:c.landingTicks,anyWet:true,arcNative:100});
  assert.equal(c.landingTicks,5);
  assert.equal(c.settled,false);
  for(let i=0;i<4;i++){
    c=classifyNativeStuntFrame({actorState:22,landingTicks:c.landingTicks,anyWet:false,arcNative:c.arcNative});
    assert.equal(c.settled,false);
  }
  c=classifyNativeStuntFrame({actorState:22,landingTicks:c.landingTicks,anyWet:false,arcNative:c.arcNative,upY:.5});
  assert.deepEqual(c,{move:6,landingTicks:0,arcNative:50,settled:true});
});

test('dry floor or box contact arms only after more than five airborne frames',()=>{
  for(const contact of ['floorContact','boxContact']){
    const options={actorState:22,landingTicks:-1,[contact]:true,anyWet:false};
    assert.equal(classifyNativeStuntFrame({...options,airborneFrames:5}).landingTicks,-1);
    assert.equal(classifyNativeStuntFrame({...options,airborneFrames:6}).landingTicks,5);
  }
  assert.equal(classifyNativeStuntFrame({actorState:22,landingTicks:-1,anyWet:false,airborneFrames:50}).landingTicks,-1);
});

test('failed landing priority precedes partial; only successful results scale the arc',()=>{
  const classify=options=>classifyNativeStuntFrame({actorState:22,landingTicks:1,arcNative:100,upY:.5,...options});
  assert.equal(classify({actorState:23,partial:true}).move,8);
  assert.equal(classify({actorState:7,recoveryState:0,partial:true}).move,8);
  assert.equal(classify({actorState:7,recoveryState:1,crash:true}).move,8);
  assert.equal(classify({actorState:7,recoveryState:1}).move,7);
  assert.equal(classify({actorState:24}).move,7);
  assert.equal(classify({partial:true}).arcNative,100);
  assert.equal(classify({crash:true}).arcNative,100);
  assert.equal(classify({}).arcNative,50);
});

test('point-motion arc cancels translation and weights roll orientation without using elapsed airtime',()=>{
  assert.equal(accumulateNativeStuntArc(0,arcInput()),4);
  assert.equal(accumulateNativeStuntArc(0,arcInput({rightY:1})),6);
  assert.equal(accumulateNativeStuntArc(0,arcInput({rightY:-1})),6);
  assert.equal(accumulateNativeStuntArc(0,arcInput({action:1})),11.199999809265137);
  assert.equal(accumulateNativeStuntArc(0,arcInput({action:2})),11.199999809265137);
  assert.equal(accumulateNativeStuntArc(0,arcInput({action:4})),4);
  assert.equal(accumulateNativeStuntArc(3,arcInput({frontVelocityNative:vec(10,0,0),rearVelocityNative:vec(10,0,0)})),3);
  assert.equal(accumulateNativeStuntArc(3,arcInput({tracking:false})),3);
  assert.equal(accumulateNativeStuntArc(3,arcInput({simulationActive:false})),3);
});

test('source logical frames produce the same results under different render batching',()=>{
  const logical=[...pose(1,28),{move:0},...pose(9,12),{move:10},
    {move:0,checkpoint:checkpoint()},...pose(11,40),{move:0}];
  const expected=replay(logical);
  for(const batch of [1,2,3,7,16]){
    let state=createNativeStuntScoring();const awards=[];
    for(let i=0;i<logical.length;i+=batch){
      const next=replay(logical.slice(i,i+batch),state);state=next.state;awards.push(...next.awards);
    }
    assert.deepEqual({state,awards},expected);
  }
  assert.deepEqual(trickPoints(expected.awards),[277,511,1670]);
});

test('invalid or ambiguous inputs fail before any caller state is mutated',()=>{
  const state=createNativeStuntScoring(),snapshot=structuredClone(state);
  for(const frame of [{move:-1},{move:12},{move:1.2},{move:6},{move:6,arcNative:Infinity},
    {move:6,arcNative:1e10},{move:0,active:1},{move:0,checkpoint:checkpoint({completeRun:true})},
    {move:0,checkpoint:checkpoint({crossingOffsetNative:51})}])assert.throws(()=>stepNativeStuntScoring(state,frame));
  assert.throws(()=>collectNativeStuntRing(state,{ringIndex:-1}),RangeError);
  assert.throws(()=>nativeStuntCheckpointTime({currentPlaneDistance:0,previousPlaneDistance:0,remainingClockNative:0}),RangeError);
  assert.throws(()=>classifyNativeStuntFrame({actorState:22,wetCount:13}),RangeError);
  assert.throws(()=>accumulateNativeStuntArc(0,arcInput({rightY:2})),RangeError);
  assert.deepEqual(state,snapshot);
});
