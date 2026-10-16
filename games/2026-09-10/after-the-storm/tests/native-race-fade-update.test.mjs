import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceFadeUpdate} from '../native-race-fade-update.js';
import {prepareNativeRaceFadeAdvance,prepareNativeRaceFadePropertiesUpdate,prepareNativeRaceResultStageUpdate} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ii=a=>(a-0x9440)/4;
function state(){return {scene:{players:1,racerCount:1,main638:1,gameStateAb24:44,mode608:0,courseIndex:1},raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),profileWordsB330:Array(52).fill(0),i1Words9440:Array(168).fill(0)};}
const template=Array(9).fill(0),half=(s,a)=>{const o=a-0x7788;return (s.hudWords7788[o>>>2]>>>(o&2?0:16))<<16>>16;};
function set(s,a,v){const o=a-0x7788,shift=o&2?0:16;s.hudWords7788[o>>>2]=((s.hudWords7788[o>>>2]&~(65535<<shift))|((v&65535)<<shift))>>>0;}
function initialized(type,rate=2,selector=0){return prepareNativeRaceFadePropertiesUpdate(state(),{fadeTemplateWords6cc0:template,type,rate,selector}).state;}
const advance=s=>prepareNativeRaceFadeAdvance(s,{fadeTemplateWords6cc0:template,frameBufferBase:0x81000000});

test('logical curtain targets preserve every numeric state and operation through completion',()=>{
 for(const type of [4,5,6]){
  let state=initialized(type);
  for(let tick=0;tick<14;tick++){
   const raw=advance(state),logical=prepareNativeRaceFadeAdvance(state,{fadeTemplateWords6cc0:template,matrixTargets:'slots'});
   assert.deepEqual(logical.state,raw.state);
   const expected=structuredClone(raw.operations);
   for(const op of expected)if(op.kind==='externalCall'){
    if(op.consumer==='800481e0'){op.arguments[0]={kind:'fadeMatrixTarget',slot:'projection'};op.arguments[1]={kind:'hudHalfwordTarget',byteOffset:0x8a34-0x7788};}
    else if(op.consumer==='80048a88')op.arguments[0]={kind:'fadeMatrixTarget',slot:'curtain'};
   }
   assert.deepEqual(logical.operations,expected);state=logical.state;
  }
 }
});

test('ambiguous or unknown fade destination modes reject without changing their owner',()=>{
 const state=initialized(5),before=structuredClone(state);
 assert.throws(()=>prepareNativeRaceFadeAdvance(state,{matrixTargets:'slots',frameBufferBase:0x81000000}),/one fade/);
 assert.throws(()=>prepareNativeRaceFadeAdvance(state,{matrixTargets:'unknown'}),/target mode/);assert.deepEqual(state,before);
});

test('original alpha fades include both endpoints, reset once, and expose completion for exactly one update',()=>{
 for(const [kind,alphas]of [[1,[0,0,127,255,255,0]],[2,[255,255,127,0,0,0]],[3,[0,0,127,255,255,0]],[7,[255,255,127,0,0,0]]]){
  let s=initialized(kind);const observed=[];
  for(let i=0;i<6;i++){s=advance(s).state;observed.push(half(s,0x8a26));assert.equal(half(s,0x8a16),i===5?1:2);}
  assert.deepEqual(observed,alphas);assert.equal(half(s,0x8a10),0);
  const cleared=advance(s);assert.deepEqual(cleared.operations,[{kind:'hudWrite',byteOffset:0x8a16-0x7788,width:2,value:0}]);assert.equal(half(cleared.state,0x8a16),0);assert.equal(advance(cleared.state).operations.length,0);
 }
});

test('the existing tie-result consumer sees the completion pulse in the same canonical HUD owner',()=>{
 let s=initialized(1);for(let i=0;i<5;i++){s=advance(s).state;assert.equal(prepareNativeRaceResultStageUpdate(s,'802c6b00').effects.length,0);}
 s=advance(s).state;
 assert.deepEqual(prepareNativeRaceResultStageUpdate(s,'802c6b00').effects.map(x=>x.consumer),['800ad3c4','801ece50']);
 const next=advance(s).state;assert.equal(prepareNativeRaceResultStageUpdate(next,'802c6b00').effects.length,0);
});

test('curtain motion preserves sound selection, thresholds, matrix call order and alternating display frame',()=>{
 for(const kind of [4,5,6]){
  let s=initialized(kind);const first=advance(s);s=first.state;
  assert.deepEqual(first.effects.map(x=>x.consumer),kind===5?['800c37f4','800481e0','80048a88']:['800481e0','80048a88']);
  assert.equal(half(s,0x8a2e),1);s=advance(s).state;assert.equal(half(s,0x8a2e),0);assert.equal(half(s,0x8a2c),1);
  let count=2;while(half(s,0x8a16)!==1&&count<30){s=advance(s).state;count++;}
  assert.equal(count,12);assert.equal(half(s,0x8a16),1);assert.equal(half(s,0x8a10),0);
 }
 const s=structuredClone(initialized(5,2));let r=advance(s);assert.deepEqual(r.effects[0].arguments,[56,0]);s.scene.main638=8;r=advance(s);assert.equal(r.effects.some(x=>x.consumer==='800c37f4'),false);
});

test('signed halfwords wrap and unknown types/stages preserve unrelated storage',()=>{
 let s=structuredClone(initialized(4));set(s,0x8a12,1);set(s,0x8a18,32767);set(s,0x8a28,32767);s=advance(s).state;
 assert.equal(half(s,0x8a18),-32768);assert.equal(half(s,0x8a28),-32749);assert.equal(half(s,0x8a12),1);
 const input={hudWords7788:Array(1442).fill(0xaabbccdd)};const r=prepareNativeRaceFadeUpdate(input);assert.equal(r.operations.length,0);
 set(input,0x8a10,1);set(input,0x8a12,-1);const before=structuredClone(input);const result=prepareNativeRaceFadeUpdate(input);assert.equal(result.operations.length,2);assert.deepEqual(input,before);
});

test('malformed late templates, missing curtain buffers and undefined source division reject atomically',()=>{
 const s=structuredClone(initialized(1));set(s,0x8a12,2);const before=structuredClone(s);
 assert.throws(()=>prepareNativeRaceFadeAdvance(s,{fadeTemplateWords6cc0:Array(8).fill(0)}),/9 words/);assert.deepEqual(s,before);
 assert.throws(()=>prepareNativeRaceFadeAdvance(initialized(4)),/frameBufferBase/);
 const zero=structuredClone(initialized(1,0));set(zero,0x8a12,1);assert.throws(()=>advance(zero),/Nonfinite/);
 const sparse=Array(1442).fill(0);delete sparse[1441];assert.throws(()=>prepareNativeRaceFadeUpdate({hudWords7788:sparse}),/hudWords/);
});
