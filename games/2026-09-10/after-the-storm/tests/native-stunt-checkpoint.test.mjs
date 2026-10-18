import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativePrimaryCourseData} from '../native-primary-initialization.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,prepareNativeRaceStuntCheckpointUpdate,
 prepareNativeRaceStuntMoveUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-checkpoint-reference.json',import.meta.url)));
const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4,view=new DataView(new ArrayBuffer(4));
const word=v=>{view.setFloat32(0,v,false);return view.getUint32(0,false);};
const fields={lap:0,next:0xc,side:0x1c,armed:0x20,gateResult:0x28,checkpointIndex:0x164,totalTime:0x19c,remaining:0x2c4,
 record:0x2ec,gateTimer:0x2f0,finished:0x2f4,expired:0x334};
function fixture(c){
 const raceWords1f94=Array(1693).fill(0),hudWords7788=Array(1442).fill(0),base=0x2938+c.racerIndex*0x378;
 for(const [k,a]of Object.entries(fields))raceWords1f94[ri(base+a)]=c.record[k]>>>0;
 raceWords1f94[ri(0x3780)]=word(c.position.x);raceWords1f94[ri(0x3788)]=word(c.position.z);
 for(const a of [0x39d8,0x39dc,0x39e0,0x39e4])raceWords1f94[ri(a)]=1;
 raceWords1f94[ri(0x39d4)]=77;hudWords7788[hi(0x8a94)]=99;
 return createNativeRaceState({raceWords1f94,hudWords7788,scene:{activity624:-1,mode620:11,finishSourceRow:c.finishSourceRow}});
}
function input(c){return {racerIndex:c.racerIndex,nodes:[null,c.node],priorBodyPointNativeXZ:c.prior,checkpointSecondsByIndex:c.checkpointSecondsByIndex};}
const crossing=()=>structuredClone(reference.cases.find(c=>c.node.checkpointFlag9c===1&&c.record.side===-1&&c.record.armed===1&&c.position.x===0&&c.position.z===10));

test('Stunt geometry and checkpoint writes match original instruction execution for every case',()=>{
 for(const c of reference.cases){
  const initial=fixture(c),before=nativeRaceStateSnapshot(initial),out=prepareNativeRaceStuntCheckpointUpdate(initial,input(c));
  const expected=[...before.raceWords1f94];for(const {wordIndex,value}of c.expected.changes)expected[wordIndex]=value;
  assert.deepEqual(out.state.raceWords1f94,expected);assert.deepEqual(nativeRaceStateSnapshot(initial),before);
  assert.equal(out.diagnostic.crossed,c.expected.crossed);assert.equal(out.diagnostic.continueFinish,c.expected.continueFinish);
  assert.deepEqual(out.operations.filter(o=>o.kind==='stuntAwardEnqueue').map(o=>o.award),c.expected.awards);
  assert.equal(out.state.hudWords7788[hi(0x8a94)],c.expected.messageTimer);
  assert.deepEqual(out.effects.map(e=>`0x${e.consumer}`),c.expected.calls.filter(c=>c!=='0x801fb488'));
  assert.deepEqual(out.state.scene,before.scene);
 }
});

test('loader exposes actual78/7C aperture axis independently of checkpoint passing direction80/84',()=>{
 const data=createNativePrimaryCourseData({rows:[[0,0,3,0],[0,1000,2,0]],courseIndex:1,mode620:11});
 const n=data.nodes[1];assert.deepEqual(n.rightXZ,{x:0,z:0});assert.equal(n.apertureAxisXZ.x,1);
 const c=crossing();c.node=n;c.position={x:0,z:1010};c.prior={x:0,z:990};
 const out=prepareNativeRaceStuntCheckpointUpdate(fixture(c),{...input(c),nodes:data.nodes});
 assert.equal(out.diagnostic.crossed,true);assert.equal(out.diagnostic.projectionNative,800);
 assert.equal(out.diagnostic.crossingOffsetNative,25);
});

test('both aperture edges qualify, an outside crossing disarms until the rider returns behind',()=>{
 const c=crossing();
 for(const x of [-100,100]){c.position.x=x;assert.equal(prepareNativeRaceStuntCheckpointUpdate(fixture(c),input(c)).diagnostic.crossed,true);}
 c.position.x=101;let out=prepareNativeRaceStuntCheckpointUpdate(fixture(c),input(c)),state=out.state;
 const base=0x2938+c.racerIndex*0x378;
 assert.equal(out.diagnostic.crossed,false);assert.equal(state.raceWords1f94[ri(base+0x20)],0);assert.equal(state.raceWords1f94[ri(base+0x2f0)],1);
 for(const [x,z,expected]of [[0,10,false],[0,-10,false],[0,10,true]]){
  state=prepareNativeRaceStateOperations(state,[{kind:'raceWordWrite',wordIndex:ri(0x3780),value:word(x)},
   {kind:'raceWordWrite',wordIndex:ri(0x3788),value:word(z)}]).state;
  out=prepareNativeRaceStuntCheckpointUpdate(state,input(c));state=out.state;assert.equal(out.diagnostic.crossed,expected);
 }
});

test('same-frame pose settlement precedes checkpoint repeat reset and source time refill',()=>{
 const c=crossing(),base=0x2938+c.racerIndex*0x378;
 let state=prepareNativeRaceStateOperations(fixture(c),[
  {kind:'raceWordWrite',wordIndex:ri(0x39c8),value:1},{kind:'raceWordWrite',wordIndex:ri(0x26e4),value:999}]).state;
 const moved=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:c.racerIndex,move:0});
 assert.equal(moved.awards[0].points,10);
 const crossed=prepareNativeRaceStuntCheckpointUpdate(moved.state,input(c));state=crossed.state;
 assert.equal(state.raceWords1f94[ri(0x39d8)],0);assert.equal(state.raceWords1f94[ri(base+0x2c4)],31000);
 const queue=nativeRaceStuntAwardsView(state);assert.equal(queue.slots[0].amount,10);assert.equal(queue.slots[1].type,1);
 assert.equal(queue.totals.total,0);assert.deepEqual(crossed.effects,[{kind:'externalCall',consumer:'800c37f4',arguments:[51,0]}]);
});

test('finish-line time bonus preserves repeat flags and leaves actual completion for the finish tail',()=>{
 const c=crossing();c.finishSourceRow=1;c.node.classification98=3;
 const out=prepareNativeRaceStuntCheckpointUpdate(fixture(c),input(c)),base=0x2938+c.racerIndex*0x378;
 assert.equal(out.diagnostic.continueFinish,true);assert.equal(out.state.raceWords1f94[ri(base+0x2f4)],0);
 assert.equal(out.state.raceWords1f94[ri(base+0x164)],0);assert.equal(out.state.raceWords1f94[ri(base+0x2c4)],c.record.remaining);
 assert.equal(out.state.raceWords1f94[ri(0x39d4)],out.diagnostic.timePoints);assert.equal(out.state.raceWords1f94[ri(0x39d8)],1);
 assert.equal(nativeRaceStuntAwardsView(out.state).slots[0].finishOffset,-32);assert.deepEqual(out.effects,[]);
});

test('invalid later refill input leaves all canonical state intact; ordinary modes stay untouched',()=>{
 const c=crossing(),state=fixture(c),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceStuntCheckpointUpdate(state,{...input(c),checkpointSecondsByIndex:[]}),/refill/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const ordinary=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'mode620',value:4}]).state;
 assert.deepEqual(prepareNativeRaceStuntCheckpointUpdate(ordinary).state,ordinary);
});
