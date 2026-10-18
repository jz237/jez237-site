import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeRaceState,nativeRaceStateSnapshot,nativeRaceStuntAwardsView,
 prepareNativeRaceStuntAwardEnqueue,prepareNativeRaceStuntAwardDisplay,prepareNativeRaceStuntRecords,
 prepareNativeRaceStateOperations,prepareNativeRaceStuntDelayedAwardUpdate,prepareNativeRaceStuntMoveUpdate} from '../native-race-state.js';
import {prepareNativeRaceStartupOverlay} from '../native-race-startup-overlay.js';
const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
function fixture({course=1,primary=0}={}){
 const raceWords1f94=Array.from({length:1693},(_,i)=>0x13000000+i),hudWords7788=Array.from({length:1442},(_,i)=>0x14000000+i);
 for(const a of [0x1fd8,0x26d0,0x26d4,0x26d8,0x26dc,0x39cc,0x39d0])raceWords1f94[ri(a)]=0;
 for(const a of [0x8aa4,0x8d14,0x8d18,0x8d1c,0x8d20])hudWords7788[hi(a)]=0;
 for(let i=0;i<4;i++){hudWords7788[hi(0x8ae0)+i*7]=0;raceWords1f94[ri(0x2c2c)+i*222]=i===primary?1:0;}
 for(let i=0;i<3;i++)[900-i*400,20+i,30+i,40+i].forEach((v,j)=>raceWords1f94[ri(0x26e8)+course*12+i*4+j]=v);
 return createNativeRaceState({raceWords1f94,hudWords7788,scene:{main638:1,mode620:11,activity624:-1,
  gameStateAb24:40,state600:0,courseIndex:course,primaryHumanIndex:primary,metadataD9b0:2,metadataCb32c:3}});
}
const award=(points,kind='trick')=>({kind,points,finish:false});
function assertOnly(before,after,span,allowed){
 for(let i=0;i<before[span].length;i++)if(!allowed.has(i))assert.equal(after[span][i],before[span][i],`${span}[${i}]`);
}

test('canonical queue events and display transfer share exactly the race/HUD words',()=>{
 const initial=fixture(),before=nativeRaceStateSnapshot(initial);
 let state=prepareNativeRaceStuntAwardEnqueue(initial,[award(600),award(300,'time'),award(50,'ring')]).state;
 const slots=new Set(Array.from({length:28},(_,i)=>hi(0x8ae0)+i));slots.add(hi(0x8d14));slots.add(hi(0x8d18));
 assertOnly(before,state,'hudWords7788',slots);assert.deepEqual(state.raceWords1f94,before.raceWords1f94);
 for(let i=0;i<23;i++)state=prepareNativeRaceStuntAwardDisplay(state).state;
 assert.deepEqual(nativeRaceStuntAwardsView(state).totals,{total:950,time:300,ring:50,trick:600});
 assert.equal(state.raceWords1f94[ri(0x26d0)],950);assert.equal(state.raceWords1f94[ri(0x26dc)],600);
 assertOnly(before,state,'raceWords1f94',new Set([0x26d0,0x26d4,0x26d8,0x26dc].map(ri)));
 assertOnly(before,state,'hudWords7788',slots);assert.deepEqual(state.scene,before.scene);
 assert.deepEqual(nativeRaceStateSnapshot(initial),before);assert.equal(Object.hasOwn(state,'awards'),false);
});

test('record preparation reads the selected primary and course, leaving every neighboring word intact',()=>{
 for(let course=0;course<12;course++)for(let primary=0;primary<4;primary++){
  let state=fixture({course,primary});
  state=prepareNativeRaceStateOperations(state,[{kind:'raceWordWrite',wordIndex:ri(0x26d0),value:1000}]).state;
  const before=nativeRaceStateSnapshot(state),out=prepareNativeRaceStuntRecords(state);
  assert.equal(out.applied,true);assert.equal(out.insertedPlace,1);
  const base=ri(0x26e8)+course*12;
  assert.deepEqual(out.state.raceWords1f94.slice(base,base+12),[1000,2,3,40,900,20,30,40,500,21,31,41]);
  assertOnly(before,out.state,'raceWords1f94',new Set([ri(0x1fd8),ri(0x2928),...Array.from({length:12},(_,i)=>base+i)]));
  assert.deepEqual(out.state.hudWords7788,before.hudWords7788);assert.deepEqual(out.state.scene,before.scene);
 }
});

test('the canonical result gate reads pending bonus amount39cc, independently of countdown39d0',()=>{
 for(const [amount,ticks,applied]of [[500,0,false],[0,20,true],[500,20,false],[0,0,true]]){
  const state=prepareNativeRaceStateOperations(fixture(),[
   {kind:'raceWordWrite',wordIndex:ri(0x39cc),value:amount},{kind:'raceWordWrite',wordIndex:ri(0x39d0),value:ticks}]).state;
  assert.equal(prepareNativeRaceStuntRecords(state).applied,applied);
 }
});

test('real shared startup clears only award type words and retains slot payload and pulse state',()=>{
 let state=prepareNativeRaceStuntAwardEnqueue(fixture(),[award(101),award(202)]).state;
 state=prepareNativeRaceStuntAwardDisplay(state).state;
 const old=nativeRaceStuntAwardsView(state);
 const prepared=prepareNativeRaceStartupOverlay({...state,globals:{courseIndex:1,mode620:11,racerCount:1,players:1,primaryHumanIndex:0,activity624:-1}});
 state=prepareNativeRaceStateOperations(state,prepared.operations).state;
 const queue=nativeRaceStuntAwardsView(state);
 assert.deepEqual(queue.slots,old.slots.map(s=>({...s,type:0})));
 assert.equal(queue.pulsePhase,old.pulsePhase);assert.equal(queue.pulseTick,old.pulseTick);
 assert.deepEqual(queue.totals,old.totals);
});

test('HUD gate and late invalid award events preserve the whole canonical snapshot',()=>{
 const state=prepareNativeRaceStuntAwardEnqueue(fixture(),[award(100)]).state,before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceStuntAwardEnqueue(state,[award(200),award(1,'unknown')]));
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 for(const [field,value]of [['mode620',4],['main638',8]]){
  const blocked=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field,value}]).state;
  const out=prepareNativeRaceStuntAwardDisplay(blocked);
  assert.equal(out.applied,false);assert.deepEqual(out.state,blocked);
 }
 const blocked=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'gameStateAb24',value:45},
  {kind:'hudWrite',byteOffset:0x8aa4-0x7788,width:4,value:2}]).state;
 assert.equal(prepareNativeRaceStuntAwardDisplay(blocked).applied,false);
 assert.deepEqual(prepareNativeRaceStuntAwardDisplay(blocked).state,blocked);
});

test('a draining queue becomes visible to the next canonical record phase without another score owner',()=>{
 let state=prepareNativeRaceStuntAwardEnqueue(fixture(),[award(1000)]).state;
 for(let i=0;i<23;i++){
  const checked=prepareNativeRaceStuntRecords(state);assert.equal(checked.applied,false);
  state=prepareNativeRaceStuntAwardDisplay(checked.state).state;
 }
 assert.equal(state.raceWords1f94[ri(0x1fd8)],0);
 const result=prepareNativeRaceStuntRecords(state);assert.equal(result.applied,true);assert.equal(result.insertedPlace,1);
 assert.equal(result.state.raceWords1f94[ri(0x26e8)+12],state.raceWords1f94[ri(0x26d0)]);
 assert.equal(prepareNativeRaceStuntRecords(result.state).applied,false);
});

test('delayed award amount and countdown match original instructions, including zero and signed retained values',()=>{
 const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-delayed-awards-reference.json',import.meta.url)));
 for(const c of reference.cases){
  const state=prepareNativeRaceStateOperations(fixture(),[
   {kind:'raceWordWrite',wordIndex:ri(0x39cc),value:c.amount>>>0},{kind:'raceWordWrite',wordIndex:ri(0x39d0),value:c.ticks>>>0}]).state;
  const out=prepareNativeRaceStuntDelayedAwardUpdate(state);
  assert.equal(out.state.raceWords1f94[ri(0x39cc)]|0,c.afterAmount);
  assert.equal(out.state.raceWords1f94[ri(0x39d0)]|0,c.afterTicks);assert.deepEqual(out.awards,c.awards);
  assertOnly(state,out.state,'raceWords1f94',new Set([ri(0x39cc),ri(0x39d0)]));
  if(c.awards.length){const slot=nativeRaceStuntAwardsView(out.state).slots[0];assert.equal(slot.amount,c.amount);assert.equal(slot.finishOffset,-32);}
  else assert.deepEqual(out.state.hudWords7788,state.hudWords7788);
 }
});

function moveFixture(){
 const s=nativeRaceStateSnapshot(fixture());
 for(const address of [0x26e0,0x26e4,0x39c8,...Array.from({length:12},(_,i)=>0x39d8+i*4)])s.raceWords1f94[ri(address)]=0;
 for(let i=0;i<4;i++)for(const address of [0x2c24,0x2c2c])s.raceWords1f94[ri(address)+i*222]=0;
 return createNativeRaceState(s);
}

test('move consumers retain canonical pose accumulation and settle once without touching delayed or ring words',()=>{
 const initial=moveFixture();let state=initial;
 for(const move of [1,1,0])state=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:0,move}).state;
 const q=nativeRaceStuntAwardsView(state);
 assert.equal(q.totals.total,0);assert.equal(q.slots[0].amount,251);assert.equal(q.slots[0].type,2);
 assert.equal(state.raceWords1f94[ri(0x39d8)],1);assert.equal(state.raceWords1f94[ri(0x39e8)],1);
 assertOnly(initial,state,'raceWords1f94',new Set([0x26e0,0x26e4,0x39c8,...Array.from({length:12},(_,i)=>0x39d8+i*4)].map(ri)));
 state=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:0,move:0}).state;
 assert.deepEqual(nativeRaceStuntAwardsView(state),q,'no second settlement without a new move');
 for(const move of [1,0])state=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:0,move}).state;
 assert.equal(nativeRaceStuntAwardsView(state).slots[1].amount,10);
});

test('selected finish/DQ suppress moves while delayed awards keep their independent earlier schedule',()=>{
 for(const flag of [0x2c24,0x2c2c]){
  let state=prepareNativeRaceStateOperations(moveFixture(),[
   {kind:'raceWordWrite',wordIndex:ri(flag)+222,value:1},
   {kind:'raceWordWrite',wordIndex:ri(0x39cc),value:500},{kind:'raceWordWrite',wordIndex:ri(0x39d0),value:1}]).state;
  assert.equal(prepareNativeRaceStuntMoveUpdate(state,{racerIndex:1,move:1}).applied,false);
  assert.deepEqual(prepareNativeRaceStuntMoveUpdate(state,{racerIndex:1,move:1}).state,state);
  const active=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:0,move:1});assert.equal(active.applied,true);
  assert.equal(active.state.raceWords1f94[ri(0x39d0)],1,'move consumer must not tick the delayed producer');
  const delayed=prepareNativeRaceStuntDelayedAwardUpdate(state);assert.equal(delayed.awards[0].points,500);
  assert.equal(delayed.state.raceWords1f94[ri(0x39cc)],0);assert.equal(delayed.state.raceWords1f94[ri(0x39d0)],0);
 }
 const ordinary=prepareNativeRaceStateOperations(moveFixture(),[{kind:'sourceWordWrite',field:'mode620',value:4}]).state;
 assert.deepEqual(prepareNativeRaceStuntMoveUpdate(ordinary).state,ordinary);
 assert.deepEqual(prepareNativeRaceStuntDelayedAwardUpdate(ordinary).state,ordinary);
 const bad=prepareNativeRaceStateOperations(moveFixture(),[{kind:'raceWordWrite',wordIndex:ri(0x39d8),value:2}]).state;
 assert.throws(()=>prepareNativeRaceStuntMoveUpdate(bad,{racerIndex:0,move:1}),/stunt flag/);
 assert.equal(bad.raceWords1f94[ri(0x39d8)],2);
});
