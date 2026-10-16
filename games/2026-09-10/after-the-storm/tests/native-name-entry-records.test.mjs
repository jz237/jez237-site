import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryRecordUpdate as prepare} from '../native-name-entry.js';
import {createNativeRaceState,prepareNativeNameEntryRecordCommit as commit} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
function fixture({mode=0,course=1,reverse=0,name=0x41424300}={}){
 const state={raceWords1f94:Array(1693).fill(0xaabbccdd),hudWords7788:Array(1442).fill(0x12345678),
  saveWordsB280:Array.from({length:34},(_,i)=>0x81828300+i),profileWordsB330:Array(52).fill(0),
  scene:{mode608:mode,courseIndex:course,reverseDab68:reverse,metadataD9b0:0,freshNameAb6c:0}};
 for(let a=0x2660;a<0x26c0;a+=4)state.raceWords1f94[ri(a)]=0;state.raceWords1f94[ri(0x2928)]=0;state.hudWords7788[hi(0x88e8)]=name;
 return {state,views:{championshipCourseRowsAc14:[[0,1,2,3,4,5,6,7],[1,1,1,1,1,1,1,1],[11,10,9,8,7,6,5,4]]}};
}
const unused=()=>{throw Error('unreached source');};

test('race names target the selected rank and best lap with their original byte-store order',()=>{
 const {state,views}=fixture();state.raceWords1f94[ri(0x2664)]=2;state.raceWords1f94[ri(0x2694)]=1;
 const q=commit(createNativeRaceState(state),views),time=0x1ff0+60+40-4,lap=0x22c0+20+16;
 assert.deepEqual(q.operations.map(o=>o.byteOffset+0x1f94),[time,time+1,time+2,time+3,time+4,lap+1,lap+2,lap+3,lap,lap+4]);
 assert.equal(q.state.raceWords1f94[ri(time)],0x41424300);assert.equal(q.state.raceWords1f94[ri(lap)],0x41424300);
 // The source's fifth null store preserves the lower three bytes of the next word.
 assert.equal(q.state.raceWords1f94[ri(time+4)],0x00bbccdd);assert.equal(q.state.raceWords1f94[ri(time-4)],0xaabbccdd);
 assert.deepEqual(q.effects,[]);assert.equal(q.diagnostic.recordsPersisted,false);
});

test('reverse records use their single row for any nonzero flag while retaining best-lap behavior',()=>{
 const {state,views}=fixture({reverse:65535});state.raceWords1f94[ri(0x2664)]=0xffffffff;state.raceWords1f94[ri(0x2694)]=1;
 const q=commit(state,views);assert.equal(q.state.raceWords1f94[ri(0x23b0+20+16)],0x41424300);
 assert.equal(q.state.raceWords1f94[ri(0x22c0+20+16)],0x41424300);assert.equal(q.state.raceWords1f94[ri(0x1ff0+60+16)],0xaabbccdd);
});

test('stunt record order preserves all four supplied bytes and terminates the next word',()=>{
 const {state}=fixture({mode:11,course:11,name:0xff80fe7f});state.raceWords1f94[ri(0x2928)]=3;
 const q=commit(state),address=0x26e8+11*48+3*16-4;
 assert.deepEqual(q.operations.map(o=>o.byteOffset+0x1f94),[address+1,address+3,address+2,address,address+4]);
 assert.equal(q.state.raceWords1f94[ri(address)],0xff80fe7f);assert.equal(q.state.raceWords1f94[ri(0x2928)],3);
});

test('blank names restore three exact bytes from each selected14-byte profile and set fresh-name',()=>{
 for(let index=0;index<8;index++){
  const {state}=fixture({mode:11,name:0x00424344});state.scene.metadataD9b0=index;
  const b=new DataView(new ArrayBuffer(136));state.saveWordsB280.forEach((v,i)=>b.setUint32(i*4,v));
  const expected=((b.getUint8(24+index*14)<<24)|(b.getUint8(25+index*14)<<16)|(b.getUint8(26+index*14)<<8))>>>0;
  const q=commit(state);assert.equal(q.state.hudWords7788[hi(0x88e8)],expected);assert.equal(q.state.scene.freshNameAb6c,1);
  assert.deepEqual(q.state.saveWordsB280,state.saveWordsB280);
 }
});

test('championship writes include round0 and repeat a course for each completed round',()=>{
 const {state,views}=fixture({mode:4});state.raceWords1f94[ri(0x2660)]=1;
 const warmup=commit(state,views);assert.equal(warmup.operations.length,5);
 state.profileWordsB330[1]=2;state.profileWordsB330[2]=1;state.raceWords1f94[ri(0x2664)]=2;
 const q=commit(state,views);assert.equal(q.operations.length,15);assert.deepEqual(q.operations.slice(0,5),q.operations.slice(5,10));
});

test('unreached profile, reverse and course sources are not fabricated',()=>{
 const {state}=fixture({mode:11});delete state.scene.courseIndex;delete state.scene.reverseDab68;
 Object.defineProperty(state,'saveWordsB280',{get:unused});Object.defineProperty(state,'profileWordsB330',{get:unused});
 assert.deepEqual(prepare(state).operations,[]);
 const f=fixture();delete f.state.scene.reverseDab68;assert.deepEqual(prepare(f.state).operations,[]);
});

test('late invalid rank or fallback bytes reject atomically',()=>{
 const {state,views}=fixture({name:0});state.raceWords1f94[ri(0x2664)]=4;const before=structuredClone(state);
 assert.throws(()=>commit(state,views),RangeError);assert.deepEqual(state,before);assert.equal(Object.isFrozen(views),false);
 delete state.saveWordsB280[7];assert.throws(()=>commit(state,views),RangeError);
});
