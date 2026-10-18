import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeFixedSphereContacts,queryNativeFixedSphereGrid} from '../native-fixed-sphere-contacts.js';
import {createNativeRaceState,prepareNativeRaceFixedSphereContacts} from '../native-race-state.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-fixed-sphere-contacts-reference.json',import.meta.url)));
function input(c){
 const spheres=Array.from({length:1536},(_,i)=>0x12340000+i),grid=Array.from({length:166},(_,i)=>0x34560000+i);
 for(const p of c.spherePatches)spheres[p.wordIndex]=p.value;for(const p of c.gridPatches)grid[p.wordIndex]=p.value;
 return {...c,fixedSphereWordsB138:spheres,fixedSphereGridWords1ce8:grid};
}
function state(q){return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
 fixedSphereWordsB138:q.fixedSphereWordsB138,fixedSphereGridWords1ce8:q.fixedSphereGridWords1ce8,scene:{activity624:0}});}

test('full fixed-sphere grid/query/contact phase matches98 original executions through leaf and canonical owners',()=>{
 for(const c of reference.cases){
  const q=input(c.input),before=state(q),{fixedSphereWordsB138,fixedSphereGridWords1ce8,...body}=q;
  for(const out of [prepareNativeFixedSphereContacts(q),prepareNativeRaceFixedSphereContacts(before,body)]){
   assert.deepEqual(out.hull,c.expected.hull);assert.deepEqual(out.impact,c.expected.impact);
   assert.deepEqual(out.diagnostic.candidates,c.expected.candidates);
   assert.deepEqual(out.contacts.map(({index,probeIndex,translation,incoming})=>({index,probeIndex,translation,incoming})),c.expected.contacts);
   assert.deepEqual(out.unresolved,[]);if(out.state)assert.deepEqual(out.state,before);
  }
  assert.deepEqual(q,input(c.input));assert.deepEqual(before,state(q));
 }
});

test('coincident centers remain explicit, and malformed later probes/list bounds reject atomically',()=>{
 const q=input(reference.cases[0].input),before=state(q);
 const out=prepareNativeFixedSphereContacts({...q,probesNative:[[0,0,0],[0,0,0]]});
 assert.equal(out.unresolved.length,2);assert.deepEqual(out.hull,q.hull);assert.deepEqual(out.impact,{maximum:q.impact.maximum,normal:q.impact.normal.map(Math.fround)});
 const grid=q.fixedSphereGridWords1ce8.slice();grid[134+10]=511;grid[150+10]=2;
 assert.throws(()=>prepareNativeFixedSphereContacts({...q,centerNativeXZ:[0,0],fixedSphereGridWords1ce8:grid}),/storage overflow/);
 assert.throws(()=>prepareNativeRaceFixedSphereContacts(before,{...q,fixedSphereWordsB138:undefined}),/overlaps/);
 const {fixedSphereWordsB138,fixedSphereGridWords1ce8,...body}=q;
 assert.throws(()=>prepareNativeRaceFixedSphereContacts(before,{...body,probesNative:[[30,0,0],[NaN,0,0]]}),/float/);
 assert.throws(()=>prepareNativeFixedSphereContacts({...q,probesNative:[[30,0,0],[NaN,0,0]]}),/float/);
 grid[4]=0;assert.throws(()=>queryNativeFixedSphereGrid({fixedSphereGridWords1ce8:grid,centerNativeXZ:[0,0]}),/conversion/);
 assert.deepEqual(before,state(q));
});
