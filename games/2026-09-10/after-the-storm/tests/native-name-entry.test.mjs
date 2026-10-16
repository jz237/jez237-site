import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryInitialization as prepare} from '../native-name-entry.js';
import {createNativeRaceState,prepareNativeNameEntryInitializationUpdate as update,prepareNativeRaceStateOperations as patch} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4,ni=a=>(a-0x61c4)/4;
function fixture({fresh=0,name=0x594f5500,mode=0,difficulty=0,round=0}={}){
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0xfeedbeef),
  nameEntryWords61c4:Array.from({length:14},(_,i)=>0x12340000+i),profileWordsB330:Array.from({length:50},(_,i)=>i===1?round:i===2?difficulty:0),
  i1Words9440:Array(168).fill(0x55555555),scene:{mode608:mode,freshNameAb6c:fresh,field700:name}});
 const views={wheelAngleWord62f4:0x40c90fdb,championshipCourseRowsAc14:[[0,1,2,3,4,5,6,7],[1,2,3,4,5,6,7,8],[2,3,4,5,6,7,8,9]]};
 return {state,views};
}
const unused=()=>{throw Error('unreached source');};

test('fresh names clear only their original scratch, name bytes and upper latch halfword',()=>{
 const {state,views}=fixture({fresh:-1}),before=structuredClone(state),q=update(state,views),s=q.state;
 assert.deepEqual(s.hudWords7788.slice(hi(0x87e8),hi(0x8828)),[0,1,2,3,4,5,6,7,23,24,25,26,27,28,29,30]);
 assert.equal(s.hudWords7788[hi(0x88e8)],0);assert.equal(s.hudWords7788[hi(0x88ec)],0xbeef);
 assert.equal(s.scene.freshNameAb6c,0);assert.equal(s.scene.field700,0x594f5500);
 for(const address of [0x61d8,0x61dc,0x61ec,0x61f0,0x61f4])assert.equal(s.nameEntryWords61c4[ni(address)],state.nameEntryWords61c4[ni(address)]);
 assert.deepEqual(s.i1Words9440,state.i1Words9440);assert.deepEqual(s.raceWords1f94,state.raceWords1f94);
 assert.deepEqual(q.effects,[]);assert.deepEqual(state,before);assert.ok(Object.isFrozen(s.nameEntryWords61c4));
});

test('restored initials preserve four exact bytes and stop length at the first null or three characters',()=>{
 for(const [name,length]of [[0,0],[0x41000000,1],[0x41420000,2],[0x41424344,3],[0x00424344,0],[0xff80fe7f|0,3]]){
  const {state,views}=fixture({name}),q=update(state,views),s=q.state;
  assert.equal(s.hudWords7788[hi(0x88e8)],name>>>0);assert.equal(s.nameEntryWords61c4[ni(0x61e4)],length);
  assert.equal(s.nameEntryWords61c4[0],15);assert.equal(s.hudWords7788[hi(0x8824)],30);
  assert.deepEqual(q.operations.filter(o=>o.kind==='nameEntryWrite'&&o.byteOffset===0).map(o=>o.value),[0,0xffffffff,15]);
  assert.equal(s.nameEntryWords61c4[ni(0x61d0)],s.nameEntryWords61c4[ni(0x61d4)]);
 }
});

test('angle restoration rounds after multiplication and preserves signed zero',()=>{
 for(const constant of [0x40c90fdb,0xc0c90fdb,0x80000000]){
  const {state,views}=fixture();views.wheelAngleWord62f4=constant;
  const buffer=new DataView(new ArrayBuffer(4));buffer.setUint32(0,constant);
  buffer.setFloat32(0,Math.fround(Math.fround(15*buffer.getFloat32(0))/16));
  const s=update(state,views).state;assert.equal(s.nameEntryWords61c4[ni(0x61d0)],buffer.getUint32(0));
 }
});

test('record qualification distinguishes first place, any best-lap mark and first stunt place',()=>{
 for(const mode of [0,11,1])for(const place of [0,1,2,0xffffffff])for(const lap of [0,1,0xffffffff]){
  const f=fixture({mode}),s=structuredClone(f.state);
  s.raceWords1f94[ri(0x2650)]=place;s.raceWords1f94[ri(0x2654)]=lap;s.raceWords1f94[ri(0x2928)]=place;
  const out=update(s,f.views).state;
  assert.equal(out.nameEntryWords61c4[ni(0x61f8)],Number(mode===0?(place===1||lap!==0):mode===11&&place===1));
 }
});

test('championship skips normal warmup, scans every completed round and retains duplicate qualification writes',()=>{
 const f=fixture({mode:4,round:3}),s=structuredClone(f.state);
 for(let course=0;course<4;course++)s.raceWords1f94[ri(0x2660)+course]=1;
 const q=update(s,f.views);
 assert.deepEqual(q.operations.filter(o=>o.kind==='nameEntryWrite'&&o.byteOffset===0x34).map(o=>o.value),[0,1,1,1]);
 s.profileWordsB330[1]=0;assert.equal(update(s,f.views).state.nameEntryWords61c4[13],0);
 s.profileWordsB330[2]=1;assert.equal(update(s,f.views).state.nameEntryWords61c4[13],1);
});

test('unreached name, angle, profile and course data are never read',()=>{
 const {state,views}=fixture({fresh:1,mode:1}),s=structuredClone(state);
 Object.defineProperty(s.scene,'field700',{get:unused});Object.defineProperty(s,'profileWordsB330',{get:unused});Object.defineProperty(s,'raceWords1f94',{get:unused});
 Object.defineProperty(views,'wheelAngleWord62f4',{get:unused});Object.defineProperty(views,'championshipCourseRowsAc14',{get:unused});
 assert.doesNotThrow(()=>prepare(s,views));
 const warmup=fixture({fresh:1,mode:4});Object.defineProperty(warmup.views,'championshipCourseRowsAc14',{get:unused});
 assert.doesNotThrow(()=>prepare(warmup.state,warmup.views));
});

test('late invalid angle or championship input rejects atomically without freezing caller source views',()=>{
 for(const invalid of [v=>v.wheelAngleWord62f4=0x7fc00000,v=>v.championshipCourseRowsAc14[1][2]=12]){
  const {state,views}=fixture({mode:4,difficulty:1,round:2}),before=structuredClone(state);invalid(views);
  assert.throws(()=>update(state,views),RangeError);assert.deepEqual(state,before);assert.equal(Object.isFrozen(views),false);
 }
 const {state,views}=fixture(),bad=structuredClone(state);delete bad.nameEntryWords61c4[13];
 assert.throws(()=>update(bad,views),RangeError);
});

test('canonical scratch partial writes preserve neighbors and cannot escape their retained owner',()=>{
 const {state}=fixture(),q=patch(state,[{kind:'nameEntryWrite',byteOffset:24,width:2,value:0xabcd}]);
 assert.equal(q.state.nameEntryWords61c4[6],0xabcd0006);assert.equal(state.nameEntryWords61c4[6],0x12340006);
 for(const op of [{byteOffset:54,width:4,value:0},{byteOffset:56,width:2,value:0},{byteOffset:0,width:1,value:0},{byteOffset:0,width:2,value:65536}]){
  assert.throws(()=>patch(state,[{kind:'nameEntryWrite',...op}]),RangeError);
 }
 const missing=structuredClone(state);delete missing.nameEntryWords61c4;
 assert.throws(()=>patch(missing,[{kind:'nameEntryWrite',byteOffset:0,width:4,value:0}]),/retained/);
});
