import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeGenericSpheres,collideNativeGenericSpheres,snapshotNativeGenericSpheres} from '../native-generic-spheres.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-generic-spheres-reference.json',import.meta.url)));
const clone=x=>structuredClone(x),words=new DataView(new ArrayBuffer(4));
function binary(value){if(typeof value==='number'){words.setFloat32(0,value);return words.getUint32(0);}if(Array.isArray(value))return value.map(binary);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,binary(v)]));return value;}

test('generic contact state and fragment-call arguments match186 original prepared executions bit for bit',()=>{
 assert.equal(reference.executions,186);
 for(const {label,input,expected} of reference.cases){
  const state=createNativeGenericSpheres(input.nodes),hull={positions:clone(input.positions),velocities:clone(input.velocities)},impact={maximum:input.maximum,normal:clone(input.normal),hitKind:input.hitKind};
  const result=collideNativeGenericSpheres(state,hull,{probesNative:input.probes,stabilityNative:input.stability,impact});
  assert.deepEqual(binary({nodes:snapshotNativeGenericSpheres(state),...hull,...impact,events:result.fragmentEvents}),binary(expected),label);
  assert.deepEqual(result.unresolved,[],label);
 }
});

test('a broken sphere immediately stops colliding with another racer and stays broken until reinitialization',()=>{
 const input=reference.cases.find(c=>c.input.nodes.length===1&&c.expected.events.length).input,state=createNativeGenericSpheres(input.nodes);
 const hull=()=>({positions:clone(input.positions),velocities:clone(input.velocities)}),context=()=>({probesNative:input.probes,stabilityNative:input.stability,impact:{maximum:0,normal:[0,0,0],hitKind:0}});
 assert.equal(collideNativeGenericSpheres(state,hull(),context()).fragmentEvents.length,1);
 const second=hull(),before=clone(second);assert.equal(collideNativeGenericSpheres(state,second,context()).contacts.length,0);assert.deepEqual(second,before);
 assert.equal(collideNativeGenericSpheres(createNativeGenericSpheres(input.nodes),hull(),context()).fragmentEvents.length,1);
});

test('coincident centers stay explicit and do not invent a normal or fall through to another object',()=>{
 const input=reference.cases[0].input,state=createNativeGenericSpheres([{kind:10,position:[1,0,0]},{kind:10,position:[0,0,0]}]);
 const hull={positions:clone(input.positions),velocities:clone(input.velocities)},before=clone(hull),impact={maximum:0,normal:[0,0,0],hitKind:3};
 const result=collideNativeGenericSpheres(state,hull,{probesNative:[[0,0,0]],stabilityNative:10,impact});
 assert.deepEqual(result.unresolved,[{index:1,probeIndex:0,reason:'coincident-center'}]);assert.deepEqual(result.contacts,[]);assert.deepEqual(hull,before);assert.equal(impact.hitKind,3);
});

test('unsupported definitions and incomplete physical state fail explicitly',()=>{
 assert.throws(()=>createNativeGenericSpheres([{kind:11,position:[0,0,0]}]));
 assert.throws(()=>createNativeGenericSpheres([{kind:10,radius:25,position:[0,0,0]}]));
 const input=reference.cases[0].input,state=createNativeGenericSpheres(input.nodes),hull={positions:clone(input.positions),velocities:clone(input.velocities)};
 assert.throws(()=>collideNativeGenericSpheres(state,hull,{probesNative:input.probes,impact:{maximum:0,normal:[0,0,0],hitKind:0}}));
});
