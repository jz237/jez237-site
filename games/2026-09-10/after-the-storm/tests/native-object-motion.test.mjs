import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeObjectMotion} from '../native-object-motion.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectMotionUpdate} from '../native-race-state.js';
import {createRaceWater} from '../race-water.js';
import {locateNativeWaterCell,queryNativeWaterField} from '../native-water-field.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-object-motion-reference.json',import.meta.url)));
const patch=(words,changes)=>{const out=words.slice();for(const c of changes)out[c.wordIndex]=c.value;return out;};
function input(q){return {...q,objectWordsC940:patch(Array.from({length:3136},(_,i)=>0x12340000+i),q.objectWordPatches)};}
function advance(q){return prepareNativeObjectMotion({...q,queryNative:(x,z,i)=>q.waterHeights[i]});}
const view=new DataView(new ArrayBuffer(4));
function word(v){view.setFloat32(0,v);return view.getUint32(0);}
function number(w){view.setUint32(0,w);return view.getFloat32(0);}
function canonical(q,activity624=-1){return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:q.objectWordsC940,
 scene:{objectCountFa40:q.objectCountFa40,activity624,simulation648:0}});}

test('generic motion matches46 original cases and120 retained recurrence steps bit for bit',()=>{
 for(const c of reference.cases){
  const q=input(c.input),before=structuredClone(q),out=advance(q);
  assert.deepEqual(out.objectWordsC940,patch(q.objectWordsC940,c.expected.objectWordsC940));
  assert.deepEqual(out.diagnostic.queries,c.expected.queries);assert.deepEqual(q,before);
 }
 let q=input(reference.trajectory.initial);
 for(const step of reference.trajectory.steps){
  const next=advance(q);assert.deepEqual(next.objectWordsC940,patch(q.objectWordsC940,step.objectWordsC940));
  assert.deepEqual(next.diagnostic.queries,step.queries);q={...q,objectWordsC940:next.objectWordsC940};
 }
});

test('canonical motion consumes the actual plane query in simulation0 and preserves every other owner',()=>{
 const q=input(reference.cases[0].input),objects=q.objectWordsC940.slice(),x=19,z=27;
 objects[0]=word(x);objects[1]=word(-10);objects[2]=word(z);q.objectWordsC940=objects;
 const water=createRaceWater({crafts:[{x:0,y:0,z:0,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
 const cell=locateNativeWaterCell(x,z);for(const [i,index]of cell.indices.entries())water.field.heightQ[index]=[0,80*256,110*256][i];
 const query=queryNativeWaterField(water.field,x,z);assert.notEqual(query.sourcePlaneQueryNative,query.renderHeightNative);
 const state=canonical(q),before=nativeRaceStateSnapshot(state),actual=prepareNativeRaceObjectMotionUpdate(state,{waterField:water.field}),
  expected=prepareNativeObjectMotion({...q,queryNative:()=>query.sourcePlaneQueryNative});
 assert.equal(actual.applied,true);assert.deepEqual(actual.state.objectWordsC940,expected.objectWordsC940);
 assert.equal(actual.diagnostic.queries[0].heightNative,query.sourcePlaneQueryNative);
 assert.deepEqual(actual.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(actual.state.hudWords7788,state.hudWords7788);assert.deepEqual(actual.state.scene,state.scene);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const inactive=prepareNativeRaceObjectMotionUpdate(canonical(q,0));assert.equal(inactive.applied,false);assert.deepEqual(inactive.state.objectWordsC940,q.objectWordsC940);
});

test('motion58 alone selects rows and water queries ascend through the mixed object array',()=>{
 const c=reference.cases.find(c=>c.expected.queries.length===11),q=input(c.input),out=advance(q);
 assert.deepEqual(out.diagnostic.queries.map(q=>q.objectIndex),Array.from({length:11},(_,i)=>i));
 for(let i=0;i<11;i++)assert.equal(out.objectWordsC940[i*49+0xbc/4],1,'collected/broken flag does not suppress motion58=4');
 const mixed=input(reference.cases.find(c=>c.expected.queries.length===2&&c.input.objectCountFa40===7).input),result=advance(mixed);
 assert.deepEqual(result.diagnostic.queries.map(q=>q.objectIndex),[2,5]);
 for(const i of [0,1,3,4,6])assert.deepEqual(result.objectWordsC940.slice(i*49,(i+1)*49),mixed.objectWordsC940.slice(i*49,(i+1)*49));
 assert.notEqual(number(result.objectWordsC940[2*49+4/4]),number(mixed.objectWordsC940[2*49+4/4]));
});

test('late invalid query and duplicated canonical owners leave input unchanged',()=>{
 const q=input(reference.cases.find(c=>c.expected.queries.length===11).input),before=structuredClone(q);
 assert.throws(()=>prepareNativeObjectMotion({...q,queryNative:(x,z,i)=>i===10?NaN:0}),/source plane height/);assert.deepEqual(q,before);
 const state=canonical(q);assert.throws(()=>prepareNativeRaceObjectMotionUpdate(state,{objectCountFa40:1}),/overlaps/);
});
