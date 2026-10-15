import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceCourseZeroSequenceInitialization as initialize,
 prepareNativeRaceCourseZeroSequenceUpdate as update,prepareNativeRaceCourseZeroSequenceDisplay as display} from '../native-race-coursezero-sequence.js';

const ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4;
const iw=(a,v)=>({kind:'i1Write',byteOffset:a-0x9440,width:4,value:v>>>0});
const draw=(consumer,args)=>({kind:'externalCall',consumer,arguments:args,numericPrepared:true});
const audio=index=>({kind:'audioEntry',consumer:'800c37d4',arguments:[index]});
function fixture({state=0,delay=0,index=0,active=0,count=0,width=0,positions=[290,330,380],tokens=[0,1,2]}={}){
 const i1Words9440=Array.from({length:168},(_,i)=>(0x17123400+i)>>>0),hudWords7788=Array.from({length:1442},(_,i)=>0x25123000+i);
 for(let i=0;i<33;i++)i1Words9440[ii(0x9444)+i]=0xffffffff;
 const row=[0,1,2];for(const slot of [0,10])for(let i=0;i<3;i++)i1Words9440[ii(0x9444)+slot*3+i]=row[i];
 const template=[0,0,0,7,8,9,0xffffffff,0xffffffff,0xffffffff];template.forEach((v,i)=>i1Words9440[ii(0x94c8)+i]=v);
 for(const [a,v]of [[0x94ec,state],[0x94f0,delay],[0x94f4,index],[0x96a8,active],[0x96ac,count],[0x96b0,width]])i1Words9440[ii(a)]=v>>>0;
 positions.forEach((v,i)=>i1Words9440[ii(0x96b4)+i]=v>>>0);tokens.forEach((v,i)=>i1Words9440[ii(0x96c0)+i]=v>>>0);
 return {i1Words9440,hudWords7788,scene:{activity624:-1},descriptorLengthWords6894:[10,20,30]};
}
function apply(value,operations){
 const v=structuredClone(value);for(const op of operations){
  if(op.kind==='i1Write')v.i1Words9440[op.byteOffset/4]=op.value;
  else if(op.kind==='hudWrite')v.hudWords7788[op.byteOffset/4]=op.value;
  else if(op.kind==='sourceWordWrite'||op.kind==='sourceHalfwordWrite')v.scene[op.field]=op.value;
 }return v;
}
const r=(v,a)=>v.i1Words9440[ii(a)]|0;
const glyphs=result=>result.operations.filter(o=>o.consumer==='courseZeroSequenceGlyph');
const unused=()=>{throw new Error('unused source field read');};

test('state0 stores signed delay subtraction before zero transition, including wrap',()=>{
 assert.deepEqual(update(fixture({delay:2})).operations,[iw(0x94f0,1)]);
 assert.deepEqual(update(fixture({delay:1})).operations,[iw(0x94f0,0),iw(0x94ec,1),iw(0x94f0,0)]);
 assert.deepEqual(update(fixture({delay:0})).operations,[iw(0x94f0,-1),iw(0x94ec,1),iw(0x94f0,0)]);
 assert.deepEqual(update(fixture({delay:-2147483648})).operations,[iw(0x94f0,2147483647)]);
});

test('state1 setup/audio precede row increment and original11-row cycle stores both11 and0',()=>{
 const v=fixture({state:1,index:10}),result=update(v),next=apply(v,result.operations);
 assert.deepEqual(result.operations[0],iw(0x94ec,2));assert.deepEqual(result.operations.slice(-3),[audio(10),iw(0x94f4,11),iw(0x94f4,0)]);
 assert.equal(r(next,0x94ec),2);assert.equal(r(next,0x94f4),0);assert.equal(r(next,0x96a8),1);
 assert.equal(r(next,0x96ac),3);assert.equal(r(next,0x96b0),63);
 assert.deepEqual([0,1,2].map(i=>r(next,0x96b4+i*4)),[290,301,322]);
});

test('state2 waits for any nonzero active word and uses post-start index1 for the short gap',()=>{
 for(const active of [1,-1,2147483647])assert.deepEqual(update(fixture({state:2,active})).operations,[]);
 assert.deepEqual(update(fixture({state:2,index:1})).operations,[iw(0x94ec,0),iw(0x94f0,0)]);
 for(const index of [0,10,-2147483648])assert.deepEqual(update(fixture({state:2,index})).operations,[iw(0x94ec,0),iw(0x94f0,100)]);
});

test('unrecognized states and waiting branches do not read row geometry or descriptor data',()=>{
 for(const state of [-2147483648,-1,3,2147483647]){
  const v=fixture({state,index:2147483647});Object.defineProperty(v,'descriptorLengthWords6894',{get:unused});
  assert.deepEqual(update(v).operations,[]);
 }
 const waiting=fixture({state:2,active:1});Object.defineProperty(waiting,'descriptorLengthWords6894',{get:unused});assert.deepEqual(update(waiting).operations,[]);
});

test('initializer copies all nine actual template words before active1 and never supplies zero defaults',()=>{
 const v=fixture(),template=[9,5,7,11,12,13,14,15,16];template.forEach((x,i)=>v.i1Words9440[ii(0x94c8)+i]=x);
 const q=initialize(v,{sequenceIndex:0});assert.deepEqual(q.operations.slice(0,9),template.map((x,i)=>iw(0x96a8+i*4,x)));
 assert.deepEqual(q.operations[9],iw(0x96a8,1));const n=apply(v,q.operations);assert.equal(r(n,0x96ac),8);assert.equal(r(n,0x96b0),70);
 assert.deepEqual(q.operations.at(-1),audio(0));
});

test('source sentinel slots are not compacted and display loops only the retained count prefix',()=>{
 const v=fixture();[0,-1,1].forEach((x,i)=>v.i1Words9440[ii(0x9444)+i]=x>>>0);
 const n=apply(v,initialize(v,{sequenceIndex:0}).operations);
 assert.equal(r(n,0x96ac),2);assert.equal(r(n,0x96b0),32);
 assert.deepEqual([0,1,2].map(i=>r(n,0x96b4+i*4)),[290,301,301]);
 assert.deepEqual([0,1,2].map(i=>r(n,0x96c0+i*4)),[0,-1,1]);
 const d=display(n);assert.deepEqual(glyphs(d).map(o=>o.arguments),[[3,0,288,200,0]]);
});

test('all-sentinel setup retains copied count/width and does not read descriptors',()=>{
 const v=fixture();v.i1Words9440[ii(0x94cc)]=2;v.i1Words9440[ii(0x94d0)]=29;
 Object.defineProperty(v,'descriptorLengthWords6894',{get:unused});
 const q=initialize(v,{sequenceIndex:1});const countWrites=q.operations.filter(o=>o.kind==='i1Write'&&o.byteOffset===0x96ac-0x9440);
 assert.deepEqual(countWrites,[iw(0x96ac,2)]);assert.deepEqual(q.operations.at(-1),audio(1));
});

test('signed count/length/position sums wrap32 instead of clamping or using float32',()=>{
 const v=fixture();v.i1Words9440[ii(0x94cc)]=2147483647;v.descriptorLengthWords6894=[2147483647,-2147483648,0];
 [0,1,-1].forEach((x,i)=>v.i1Words9440[ii(0x9444)+i]=x>>>0);
 const n=apply(v,initialize(v,{sequenceIndex:0}).operations);
 assert.equal(r(n,0x96ac),-2147483647);assert.equal(r(n,0x96b0),1);
 assert.deepEqual([0,1,2].map(i=>r(n,0x96b4+i*4)),[290,-2147483358,291]);
});

test('inactive display draws backdrop/restores clip without reading HUD, scene or descriptor inputs',()=>{
 const v=fixture();for(const key of ['hudWords7788','scene','descriptorLengthWords6894'])Object.defineProperty(v,key,{get:unused});
 assert.deepEqual(display(v).operations,[draw('courseZeroSequenceBackdrop',[0,22,197,276,20]),draw('courseZeroSequenceClip',[0,0,319,239])]);
});

test('fixed style0 preserves every semantic store and leaves its unrelated halfword/words alone',()=>{
 const v=fixture({active:1,count:0}),result=display(v),q=result.operations;
 assert.deepEqual(q[1],{kind:'sourceWordWrite',field:'style6e2c',value:100});
 assert.deepEqual(q[2],{kind:'hudWrite',byteOffset:0x8a44-0x7788,width:4,value:0});
 assert.deepEqual(q[3],{kind:'sourceHalfwordWrite',field:'style6e28',value:0});
 const order=[0x8a58,0x8a48,0x8a68,0x8a4c,0x8a5c,0x8a6c,0x8a60,0x8a70,0x8a50,0x8a74,0x8a64,0x8a54];
 assert.deepEqual(q.slice(4,16),order.map(a=>({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:255})));
 assert.deepEqual(q[16],draw('courseZeroSequenceStyle',[0,...Array(12).fill(255)]));
 assert.deepEqual(q[17],draw('courseZeroSequenceClip',[30,20,290,218]));
 const n=apply(v,q);assert.equal(n.hudWords7788[hi(0x8a78)],v.hudWords7788[hi(0x8a78)]);
});

test('strict expiry draws the updated final glyph before active clears',()=>{
 let v=fixture({active:1,count:1,width:30,positions:[-28,0,0]}),first=display(v);
 assert.equal(first.diagnostic.expired,false);assert.deepEqual(glyphs(first)[0].arguments,[3,0,-30,200,0]);
 v=apply(v,first.operations);const last=display(v),glyphIndex=last.operations.findIndex(o=>o.consumer==='courseZeroSequenceGlyph'),clearIndex=last.operations.findIndex(o=>o.kind==='i1Write'&&o.byteOffset===0x96a8-0x9440);
 assert.deepEqual(glyphs(last)[0].arguments,[3,0,-32,200,0]);assert.ok(clearIndex>glyphIndex);
 assert.equal(last.diagnostic.expired,true);assert.deepEqual(last.operations.at(-1),draw('courseZeroSequenceClip',[0,0,319,239]));
});

test('pause freezes movement but still draws and tests expiry; empty/negative counts need no activity',()=>{
 const v=fixture({active:-1,count:1,width:30,positions:[-31,0,0]});v.scene.activity624=0;
 const d=display(v);assert.equal(d.diagnostic.expired,true);assert.deepEqual(glyphs(d)[0].arguments,[3,0,-31,200,0]);
 assert.equal(d.operations.some(o=>o.kind==='i1Write'&&o.byteOffset===0x96b4-0x9440),false);
 for(const count of [0,-1,-2147483648]){
  const q=fixture({active:1,count,width:30,positions:[-31,0,0]});Object.defineProperty(q,'scene',{get:unused});
  const result=display(q);assert.equal(result.diagnostic.expired,true);assert.equal(glyphs(result).length,0);
 }
});

test('single display movement wraps integer positions and sentinel draws read no unused activity',()=>{
 const v=fixture({active:1,count:1,positions:[-2147483648,0,0]}),n=apply(v,display(v).operations);assert.equal(r(n,0x96b4),2147483646);
 const q=fixture({active:1,count:3,tokens:[-1,-1,-1]});Object.defineProperty(q,'scene',{get:unused});assert.deepEqual(glyphs(display(q)),[]);
});

test('prepared operations are immutable/detached and invalid late reads never mutate source arrays',()=>{
 const v=fixture({state:1}),before=structuredClone(v),result=update(v);assert.deepEqual(v,before);
 assert.equal(Object.isFrozen(result),true);assert.equal(Object.isFrozen(result.operations[0]),true);assert.throws(()=>{result.operations[0].value=7;},TypeError);
 const bad=fixture({active:1,count:4}),saved=structuredClone(bad);assert.throws(()=>display(bad),/three-slot/);assert.deepEqual(bad,saved);
});

test('invalid source bounds, float descriptors and sparse canonical owners reject',()=>{
 for(const sequenceIndex of [-1,11,.5,undefined])assert.throws(()=>initialize(fixture(),{sequenceIndex}),/sequenceIndex/);
 assert.throws(()=>initialize({...fixture(),descriptorLengthWords6894:[10,,30]},{sequenceIndex:0}),/descriptorLengthWords/);
 assert.throws(()=>initialize({...fixture(),descriptorLengthWords6894:[NaN]},{sequenceIndex:0}),/descriptorLengthWords/);
 assert.throws(()=>update({...fixture(),i1Words9440:new Array(168)}),/i1Words9440/);
 assert.throws(()=>display({...fixture({active:1}),hudWords7788:new Array(1442)}),/hudWords7788/);
 assert.throws(()=>display(fixture({active:1,count:1,tokens:[55,0,0]})),/descriptor family/);
 const v=fixture({active:1,count:1});v.scene.activity624=-32769;assert.throws(()=>display(v),/activity624/);
});
