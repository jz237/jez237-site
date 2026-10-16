import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryPresentation as project} from '../native-name-presentation.js';
import {prepareNativeAffineMatrixProduct as multiply,prepareNativePackedMatrix as pack} from '../native-widget-transform.js';
import {decodeNativeRaceStartTransform as decode} from '../native-race-start-transform.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {prepareNativeNameEntryUpdate as update,prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,bits=new DataView(new ArrayBuffer(4));
function word(v){bits.setFloat32(0,v);return bits.getUint32(0);}
function float(v){bits.setUint32(0,v);return bits.getFloat32(0);}
function fixture({phase=1,latch=0,radius=750,angle=0,selected=0}={}){
 const state={nameEntryWords61c4:[selected,phase,word(radius),word(angle),...Array(10).fill(0)],hudWords7788:Array(1442).fill(0),raceWords1f94:Array(1693).fill(0),scene:{initLatch63c:latch,gameStateAb24:100}};
 for(let i=0;i<16;i++)for(const [a,v]of [[0x8828,100+i],[0x8868,i%2?-1:1],[0x88a8,-100-i]])state.hudWords7788[hi(a)+i]=word(v);
 const views={sineTableWords4350:nativeSineTableWords(),anglePeriodWords9254:Array(3).fill(0x40c90fdc),
  wheelPeriodWord62e4:word(6.2831854820251465),confirmTiltWord62e8:word(-1.5707963705062866),wheelTiltWord62ec:word(-1.5707963705062866),wheelScaleWord62f0:word(.1),crossingAmplitudeWord61fc:word(50)};
 return {state,views,frame:{motionActive:true,confirmationPose:{angleWord:word(1.25),radiusWord:word(350)}}};
}

test('affine multiplication preserves scale/translation composition and source store order',()=>{
 const a=[2,0,0,91,0,3,0,92,0,0,4,93,10,20,30,94].map(word),b=[5,0,0,81,0,6,0,82,0,0,7,83,1,2,3,84].map(word);
 const q=multiply({leftFloatWords:a,rightFloatWords:b});assert.deepEqual(q.floatWords.map(float),[10,0,0,0,0,18,0,0,0,0,28,0,12,26,42,1]);
 assert.deepEqual(q.operations.map(o=>o.wordIndex),[0,1,2,4,5,6,8,9,10,12,13,3,7,11,15,14]);
 assert.equal(a[3],word(91));assert.ok(Object.isFrozen(q.floatWords));
});

test('matrix packing truncates fractional fixed-point values and rejects unsupported conversion',()=>{
 const values=[1,0,0,0,0,1,0,0,0,0,1,0,1/131072,-1/131072,12.75,1],q=pack({floatWords:values.map(word)});
 assert.deepEqual(decode(q).floatWords.map(float),[1,0,0,0,0,1,0,0,0,0,1,0,0,0,12.75,1]);
 assert.deepEqual(q.operations.slice(0,2).map(o=>o.byteOffset),[30,62]);
 assert.throws(()=>pack({floatWords:values.map((v,i)=>word(i===12?32768:v))}),RangeError);
});

test('all16 matrices precede their crossing effects and three retained position stores',()=>{
 const {state,views,frame}=fixture(),before=structuredClone(state),q=project(state,frame,views);
 assert.equal(q.matrices.length,16);assert.deepEqual(q.matrices.map(m=>m.slot),Array.from({length:16},(_,i)=>i));
 for(let i=0;i<16;i++){
  const start=q.operations.findIndex(o=>o.kind==='nameEntryMatrix'&&o.slot===i),end=i===15?q.operations.length:q.operations.findIndex(o=>o.kind==='nameEntryMatrix'&&o.slot===i+1);
  const section=q.operations.slice(start,end);assert.deepEqual(section.slice(-3).map(o=>o.byteOffset),[0x8828,0x8868,0x88a8].map(a=>a-0x7788+i*4));
  assert.equal(q.matrices[i].matrixWords.length,16);
 }
 assert.deepEqual(state,before);assert.equal(q.diagnostic.matrixProjectionPending,false);
 const committed=apply(state,q.operations);assert.equal(committed.effects.filter(o=>o.kind==='nameEntryMatrix').length,16);
 assert.deepEqual(committed.state.nameEntryWords61c4,state.nameEntryWords61c4);
});

test('initialization suppresses crossing calls and never reads the unused amplitude',()=>{
 const {state,views,frame}=fixture({latch:1});Object.defineProperty(views,'crossingAmplitudeWord61fc',{get(){throw Error('unreached amplitude');}});
 const q=project(state,frame,views);assert.equal(q.operations.some(o=>o.kind==='externalCall'),false);assert.equal(q.diagnostic.crossingEffectsPending,false);
});

test('active unselected crossings use previous coordinates while passive crossings use current coordinates',()=>{
 const f=fixture(),active=project(f.state,f.frame,f.views),passive=project(f.state,{...f.frame,motionActive:false},f.views);
 const activeCrossings=active.operations.filter(o=>o.consumer==='8004f1ec');assert.ok(activeCrossings.length>0);
 for(const op of activeCrossings){const x=float(op.arguments[0]),z=float(op.arguments[1]);assert.equal(x,-z);assert.ok(x>=100&&x<=115);assert.ok([0,1].includes(op.arguments[3]));}
 const passiveCrossings=passive.operations.filter(o=>o.consumer==='8004efb4');assert.ok(passiveCrossings.length>0);
 assert.ok(passiveCrossings.some(o=>float(o.arguments[0])<100||float(o.arguments[0])>115));
 assert.ok(passiveCrossings.every(o=>[50,(-50)>>>0].includes(o.arguments[2])));
});

test('confirmation changes only the selected transform relative to an idle wheel',()=>{
 const f=fixture({selected:7}),idle=project(f.state,f.frame,f.views);f.state.nameEntryWords61c4[1]=4;
 const confirming=project(f.state,f.frame,f.views);
 for(let i=0;i<16;i++)if(i===7)assert.notDeepEqual(confirming.matrices[i].matrixWords,idle.matrices[i].matrixWords);else assert.deepEqual(confirming.matrices[i].matrixWords,idle.matrices[i].matrixWords);
});

test('full update commits phase/window/positions to the same HUD while keeping matrices as presentation effects',()=>{
 const f=fixture(),q=update(f.state,f.views);assert.equal(q.state.hudWords7788[hi(0x87e0)],13);assert.equal(q.matrices.length,16);
 assert.equal(q.diagnostic.consumer,'801e1290');assert.equal(q.diagnostic.matrixProjectionPending,false);assert.equal(q.state.scene.initLatch63c,0);
 assert.equal(q.operations[0].kind,'hudWrite');assert.notDeepEqual(q.state.hudWords7788,f.state.hudWords7788);
});

test('late invalid presentation data cannot commit preceding phase writes or freeze caller inputs',()=>{
 const f=fixture(),before=structuredClone(f.state);f.views.crossingAmplitudeWord61fc=0x7fc00000;
 assert.throws(()=>update(f.state,f.views),RangeError);assert.deepEqual(f.state,before);assert.equal(Object.isFrozen(f.views),false);
 assert.throws(()=>apply(f.state,[{kind:'nameEntryMatrix',slot:16,matrixWords:Array(16).fill(0)}]),RangeError);
 assert.throws(()=>apply(f.state,[{kind:'nameEntryMatrix',slot:0,matrixWords:Array(15).fill(0)}]),RangeError);
});
