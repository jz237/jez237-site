import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRacePrestartInitializationUpdate} from '../native-race-state.js';
function fixture(count=52){
 const profileWordsB330=Array.from({length:count},(_,i)=>0xa3000000+i);profileWordsB330[2]=1;
 const i1Words9440=Array.from({length:168},(_,i)=>0x94000000+i);i1Words9440[(0x9518-0x9440)/4]=7;
 if(count===52){profileWordsB330[50]=0x11223344;profileWordsB330[51]=0x55667788;}
 return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),i1Words9440,profileWordsB330,
  scene:{mode608:4,courseIndex:0,players:1,racerCount:4,variant6f4:0,field4970:8}});
}
const half=(byteOffset,value)=>({kind:'profileWrite',byteOffset,width:2,value});

test('four source rider flags share two extended profile words and preserve each adjacent halfword',()=>{
 const state=fixture(),before=nativeRaceStateSnapshot(state),a=prepareNativeRaceStateOperations(state,[half(0xc8,0)]);
 assert.equal(a.state.profileWordsB330[50],0x00003344);assert.equal(a.state.profileWordsB330[51],0x55667788);
 const b=prepareNativeRaceStateOperations(a.state,[half(0xca,0),half(0xcc,0),half(0xce,0)]);
 assert.deepEqual(b.state.profileWordsB330.slice(50),[0,0]);assert.deepEqual(b.state.profileWordsB330.slice(0,50),state.profileWordsB330.slice(0,50));
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('the same prestart leaf accepts old50 and extended52 word owners without changing the flag tail',()=>{
 const old=fixture(50),extended=fixture(52),a=prepareNativeRacePrestartInitializationUpdate(old),b=prepareNativeRacePrestartInitializationUpdate(extended);
 assert.deepEqual(a.operations,b.operations);assert.deepEqual(a.state.profileWordsB330,b.state.profileWordsB330.slice(0,50));
 assert.deepEqual(b.state.profileWordsB330.slice(50),[0x11223344,0x55667788]);assert.equal(b.state.i1Words9440[(0x96cc-0x9440)/4],7);
 assert.throws(()=>prepareNativeRaceStateOperations(old,[half(0xc8,0)]),/byteOffset/);
});

test('source variants retain signed halfwords while new scalar transport preserves bounded player/count owners',()=>{
 const state=fixture(),changed=prepareNativeRaceStateOperations(state,[
  {kind:'sourceHalfwordWrite',field:'variant6f4',value:0x8000},{kind:'sourceHalfwordWrite',field:'field4970',value:65535},
  {kind:'sourceWordWrite',field:'players',value:2},{kind:'sourceWordWrite',field:'racerCount',value:0}]).state;
 assert.equal(changed.scene.variant6f4,-32768);assert.equal(changed.scene.field4970,65535);assert.equal(changed.scene.players,2);assert.equal(changed.scene.racerCount,0);
 const before=nativeRaceStateSnapshot(state);
 for(const operation of[{kind:'sourceWordWrite',field:'players',value:0},{kind:'sourceWordWrite',field:'racerCount',value:0xffffffff}]){
  assert.throws(()=>prepareNativeRaceStateOperations(state,[half(0xc8,0),operation]),/source word/);
  assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});

test('physical tune words remain ordered immutable pending effects with no second canonical body owner',()=>{
 const state=fixture(),before=nativeRaceStateSnapshot(state),op={kind:'bodyTuneWordWrite',racerIndex:3,wordIndex:2,value:0xffffffff},
  p=prepareNativeRaceStateOperations(state,[half(0xc8,0),op]);
 assert.deepEqual(p.effects,[op]);assert.equal(Object.isFrozen(p.effects[0]),true);op.value=0;
 assert.equal(p.effects[0].value,0xffffffff);assert.equal(p.state.profileWordsB330[50],0x3344);
 assert.equal(Object.hasOwn(p.state,'bodyTuneWordsB68'),false);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 assert.throws(()=>prepareNativeRaceStateOperations(state,[half(0xc8,0),{kind:'bodyTuneWordWrite',racerIndex:4,wordIndex:0,value:0}]),/racerIndex/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('profile extension rejects holes, intermediate lengths, overlapping flags and misaligned halfword writes',()=>{
 const state=fixture(),before=nativeRaceStateSnapshot(state);
 for(const count of[49,51,53])assert.throws(()=>createNativeRaceState({...before,profileWordsB330:Array(count).fill(0)}),/50 or52/);
 assert.throws(()=>createNativeRaceState({...before,profileWordsB330:Array(52)}),/profileWords/);
 assert.throws(()=>createNativeRaceState({...before,riderFlagsB3f8:[1,2,3,4]}),/overlaps/);
 assert.throws(()=>prepareNativeRaceStateOperations(state,[half(0xc9,0)]),/alignment/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});
