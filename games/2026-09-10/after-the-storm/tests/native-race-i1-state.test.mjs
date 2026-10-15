import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceI1Update,prepareNativeRaceI1DisplayUpdate,prepareNativeRaceCourseZeroSequenceDisplayUpdate} from '../native-race-state.js';

const ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
function fixture(){
 const i1Words9440=Array.from({length:168},(_,i)=>0x61000000+i),hudWords7788=Array.from({length:1442},(_,i)=>0x52000000+i);
 const raceWords1f94=Array(1693).fill(0),profileWordsB330=Array(50).fill(0);profileWordsB330[2]=1;
 for(let i=0;i<33;i++)i1Words9440[ii(0x9444)+i]=0xffffffff;
 for(const[a,v]of [[0x9440,99],[0x9444,0],[0x9448,1],[0x9450,2],[0x94ec,0],[0x94f0,1],[0x94f4,0],
  [0x9514,5],[0x9518,6],[0x951c,7]])i1Words9440[ii(a)]=v;
 for(let i=0;i<9;i++)i1Words9440[ii(0x94c8)+i]=i>=6?0xffffffff:0;
 i1Words9440[ii(0x96a8)]=0;
 const scene={initLatch63c:1,gameStateAb24:40,courseIndex:0,mode608:4,mode620:4,specialAb64:0,
  activity624:-1,players:1,primaryHumanIndex:0,secondaryHumanIndex:1,ready6fc:0,phase650:3,simulation648:3,
  result6f0:0,missesEnabled72e:1,style6e2c:-77,style6e28:0xbeef};
 return createNativeRaceState({raceWords1f94,hudWords7788,i1Words9440,profileWordsB330,scene});
}
const input={descriptorLengthWords6894:[3,4,2]};
const displayInput={externalReturns:{'8009328c':0x81050000,'801e5554':0x81050020,'802c6b38':0x81050040,'802c6bd8':0x81050060}};
const i1=(s,a)=>s.i1Words9440[ii(a)]|0;
const patchI1=(s,values)=>prepareNativeRaceStateOperations(s,values.map(([a,value])=>
 ({kind:'i1Write',byteOffset:a-0x9440,width:4,value:value>>>0}))).state;
function started(){let s=prepareNativeRaceI1Update(fixture(),input).state;s=prepareNativeRaceI1DisplayUpdate(s).state;return prepareNativeRaceI1Update(s,input).state;}

test('first update initializes before sequence progression and first display alone clears the one-shot latch',()=>{
 const original=fixture(),before=nativeRaceStateSnapshot(original),first=prepareNativeRaceI1Update(original,input);
 assert.equal(first.diagnostic.initializationCalled,true);assert.equal(first.diagnostic.sequenceCalled,true);
 assert.equal(i1(first.state,0x9440),0);assert.equal(i1(first.state,0x96cc),6);assert.equal(i1(first.state,0x94ec),1);
 assert.equal(i1(first.state,0x96a8),0);assert.equal(first.state.scene.initLatch63c,1);
 const shown=prepareNativeRaceI1DisplayUpdate(first.state);
 assert.equal(shown.state.scene.initLatch63c,0);assert.equal(shown.displayListHead,null);
 assert.deepEqual(shown.diagnostic.sequenceCalls,[]);assert.deepEqual(shown.effects,[{kind:'externalCall',consumer:'80093c44',arguments:[]}]);
 assert.equal(shown.state.scene.style6e2c,-77);assert.equal(shown.state.scene.style6e28,0xbeef);
 assert.deepEqual(nativeRaceStateSnapshot(original),before);
});

test('next update starts the sequence once and display preserves style stores plus updated high-resolution glyph recipes',()=>{
 const s=started();assert.equal(i1(s,0x94ec),2);assert.equal(i1(s,0x94f4),1);assert.equal(i1(s,0x96ac),2);assert.equal(i1(s,0x96b0),9);
 assert.deepEqual([0x96b4,0x96b8,0x96bc].map(a=>i1(s,a)),[290,294,299]);
 const result=prepareNativeRaceI1DisplayUpdate(s,displayInput),next=result.state;
 assert.deepEqual(result.effects.filter(e=>e.consumer==='courseZeroSequenceGlyph').map(e=>e.arguments),[[3,0,288,200,0],[3,1,292,200,0]]);
 assert.equal(next.scene.style6e2c,100);assert.equal(next.scene.style6e28,0);
 assert.equal(next.hudWords7788[hi(0x8a44)],0);for(let a=0x8a48;a<=0x8a74;a+=4)assert.equal(next.hudWords7788[hi(a)],255);
 assert.equal(next.hudWords7788[hi(0x8a78)],s.hudWords7788[hi(0x8a78)]);
 assert.equal(result.effects.some(e=>e.consumer==='802c6bd8'),false);
 assert.equal(result.diagnostic.sequenceCalls.length,1);assert.equal(result.diagnostic.sequenceCalls[0].sourceHead,0x81050020);
 assert.equal(result.diagnostic.sequenceCalls[0].sourceReturnWord,0x81050060);assert.equal(result.displayListHead,0x81050068);
 assert.equal(i1(s,0x96b4),290);assert.equal(i1(next,0x96b4),288);
});

test('strict expiry retains the tie frame and the final glyph precedes clearing before the next update advances the sequence',()=>{
 const initial=patchI1(started(),[[0x96b4,-7]]),tie=prepareNativeRaceCourseZeroSequenceDisplayUpdate(initial);
 assert.equal(i1(tie.state,0x96b4),-9);assert.equal(i1(tie.state,0x96a8),1);
 const wait=prepareNativeRaceI1Update(tie.state,input);assert.equal(i1(wait.state,0x94ec),2);assert.deepEqual(wait.operations,[]);
 const last=prepareNativeRaceCourseZeroSequenceDisplayUpdate(wait.state),glyph=last.operations.findIndex(e=>e.consumer==='courseZeroSequenceGlyph'),
  clear=last.operations.findIndex(e=>e.kind==='i1Write'&&e.byteOffset===0x96a8-0x9440&&e.value===0);
 assert.ok(glyph>=0&&clear>glyph);assert.equal(last.operations[glyph].arguments[2],-11);assert.equal(i1(last.state,0x96a8),0);
 let s=prepareNativeRaceI1Update(last.state,input).state;assert.equal(i1(s,0x94ec),0);assert.equal(i1(s,0x94f0),0);
 s=prepareNativeRaceI1Update(s,input).state;assert.equal(i1(s,0x94ec),1);
 const next=prepareNativeRaceI1Update(s,input);assert.deepEqual(next.effects,[{kind:'audioEntry',consumer:'800c37d4',arguments:[1]}]);
 assert.equal(i1(next.state,0x94f4),2);assert.equal(i1(next.state,0x96ac),1);
});

test('two-player logical display advances the shared sequence once',()=>{
 const supplied=nativeRaceStateSnapshot(started());supplied.scene.players=2;
 const s=createNativeRaceState(supplied),r=prepareNativeRaceI1DisplayUpdate(s,displayInput);
 assert.equal(i1(r.state,0x96b4),288);assert.equal(r.diagnostic.sequenceCalls.length,1);
 assert.equal(r.diagnostic.sequenceCalls[0].sourceHead,0x81050040);
 assert.equal(r.effects.filter(e=>e.consumer==='802c6b38').length,1);
 assert.equal(r.effects.filter(e=>e.consumer==='courseZeroSequenceBackdrop').length,1);
 assert.equal(r.effects.filter(e=>e.consumer==='courseZeroSequenceGlyph').length,2);
 assert.equal(i1(s,0x96b4),290);
});

test('paused display still prepares style and can expire; later return-stage activity changes do not move earlier glyphs',()=>{
 const original=nativeRaceStateSnapshot(patchI1(started(),[[0x96b4,-10]]));
 Object.assign(original.scene,{activity624:0,gameStateAb24:43,returnState630:-1});original.hudWords7788[hi(0x8a14)]=1;
 const r=prepareNativeRaceI1DisplayUpdate(createNativeRaceState(original),displayInput);
 assert.equal(r.effects.find(e=>e.consumer==='courseZeroSequenceGlyph').arguments[2],-10);assert.equal(i1(r.state,0x96b4),-10);
 assert.equal(i1(r.state,0x96a8),0);assert.equal(r.state.scene.activity624,-1);assert.equal(r.state.scene.style6e2c,100);
});

test('pending mode and actual source guards control the sequence without requiring unused descriptor data',()=>{
 const original=nativeRaceStateSnapshot(fixture());original.scene.mode608=0;
 const first=prepareNativeRaceI1Update(createNativeRaceState(original));
 assert.equal(first.diagnostic.initializationCalled,true);assert.equal(first.diagnostic.sequenceCalled,false);
 assert.equal(i1(first.state,0x9440),0);assert.equal(i1(first.state,0x94f0),1);
 const noCourse=nativeRaceStateSnapshot(first.state);Object.assign(noCourse.scene,{initLatch63c:0,courseIndex:1});delete noCourse.scene.mode608;
 assert.deepEqual(prepareNativeRaceI1Update(createNativeRaceState(noCourse)).operations,[]);
});

test('a failed later display expansion cannot commit pending style, i1 or latch writes',()=>{
 const original=patchI1(started(),[[0x96ac,4]]),before=nativeRaceStateSnapshot(original);
 assert.throws(()=>prepareNativeRaceI1DisplayUpdate(original,displayInput),/three-slot/);
 assert.deepEqual(nativeRaceStateSnapshot(original),before);
 assert.equal(original.raceWords1f94[ri(0x2c24)],0);
});
