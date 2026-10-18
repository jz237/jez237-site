import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeGenericObjectContacts} from '../native-generic-spheres.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceGenericObjectContacts,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceObjectMotionUpdate,prepareNativeRaceStuntRingUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createRaceWater} from '../race-water.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-generic-object-contacts-reference.json',import.meta.url)));
const patch=(words,changes)=>{const result=words.slice();for(const c of changes)result[c.wordIndex]=c.value;return result;};
const seed=()=>Array.from({length:3136},(_,i)=>0x12340000+i);
const view=new DataView(new ArrayBuffer(4));
function binary(v){if(typeof v==='number'){view.setFloat32(0,v);return view.getUint32(0);}if(Array.isArray(v))return v.map(binary);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,binary(x)]));return v;}
function number(w){view.setUint32(0,w);return view.getFloat32(0);}
const body=q=>Object.fromEntries(['hull','probesNative','stabilityNative','impact'].map(k=>[k,q[k]]));
function canonical(q){return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:q.objectWordsC940,scene:{objectCountFa40:q.objectCountFa40}});}

test('all103 mixed raw-object contact cases match complete original7E938 through both leaf and canonical owner',()=>{
 for(const c of reference.cases){
  const q={...c.input,objectWordsC940:patch(seed(),c.input.objectWordPatches)},before=structuredClone(q),state=canonical(q),out=prepareNativeGenericObjectContacts(q),wrapped=prepareNativeRaceGenericObjectContacts(state,body(q)),expected=patch(q.objectWordsC940,c.expected.objectWordsC940);
  assert.deepEqual(out.objectWordsC940,expected);assert.deepEqual(wrapped.state.objectWordsC940,expected);
  for(const result of [out,wrapped])for(const k of ['hull','impact','fragmentEvents'])assert.deepEqual(binary(result[k]),binary(c.expected[k]),k);
  assert.deepEqual(wrapped.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(wrapped.state.hudWords7788,state.hudWords7788);assert.deepEqual(q,before);
 }
});

test('load, initialize, mixed contact, motion and ring collection share one object array across riders',()=>{
 const resources=nativeStuntObjectResources({courseIndex:1,players:1}),state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  objectWordsC940:Array(3136).fill(0),collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  scene:{courseIndex:1,players:1,difficulty:2,mode620:11,objectCountFa40:0,ringCountB134:0,forceStunt824c:0,rampFilterOverride8254:0,
   reverseDab68:0,alternate8250:0,activity624:-1,primaryHumanIndex:0,ringNext0cb0:0,ringStreak0cb4:0}});
 const loaded=prepareNativeRaceObjectLoading(state,{rampRows:[[2000,2000,0,0,0]],ringRows:[[1000,64,1000,0,0,90]],genericRows:[[0,0,0,8,0],[1,0,0,9,0]]});
 const initialized=prepareNativeRaceObjectInitialization(loaded.state,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resources.planeTemplatesByAddress}).state;
 const input={hull:{positions:Array.from({length:12},()=>[0,0,0]),velocities:Array.from({length:12},()=>[-7,0,0])},
  probesNative:[[30,0,0],[30,0,0]],stabilityNative:10,impact:{maximum:0,normal:[0,0,0],hitKind:0}};
 const contact=prepareNativeRaceGenericObjectContacts(initialized,input);
 assert.deepEqual(contact.contacts.map(c=>c.index),[3,2]);assert.equal(contact.fragmentEvents.length,1);
 assert.equal(contact.state.objectWordsC940[3*49+0xbc/4],1);assert.ok(number(contact.state.objectWordsC940[2*49])<0);
 const second=prepareNativeRaceGenericObjectContacts(contact.state,input);assert.ok(second.contacts.every(c=>c.index===2));assert.deepEqual(second.fragmentEvents,[]);
 const water=createRaceWater({crafts:[{x:0,y:0,z:0,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
 const moved=prepareNativeRaceObjectMotionUpdate(second.state,{waterField:water.field});
 assert.deepEqual(moved.diagnostic.queries.map(q=>q.objectIndex),[2]);
 assert.equal(moved.diagnostic.queries[0].x,number(second.state.objectWordsC940[2*49]),'motion sees the second rider recoil');
 for(const i of [0,1,3])assert.deepEqual(moved.state.objectWordsC940.slice(i*49,(i+1)*49),second.state.objectWordsC940.slice(i*49,(i+1)*49));
 const collected=prepareNativeRaceStuntRingUpdate(moved.state,{primaryBodyPositionNative:{x:1000,y:56,z:1000}});
 assert.deepEqual(collected.diagnostic.collectedRows,[1]);assert.equal(nativeRaceStuntAwardsView(collected.state).slots[0].amount,50);
 assert.equal(collected.state.objectWordsC940[3*49+0xbc/4],1);
 assert.deepEqual(collected.state.collisionPlaneWordsFd78,initialized.collisionPlaneWordsFd78);
 assert.deepEqual(collected.state.packedObjectMatrixWords0cd0,initialized.packedObjectMatrixWords0cd0);
});

test('source contact gating ignores noncolliding rows and retains nonboolean broken words',()=>{
 const c=reference.cases.find(c=>c.input.objectCountFa40===64),q={...c.input,objectWordsC940:patch(seed(),c.input.objectWordPatches)},out=prepareNativeGenericObjectContacts(q);
 assert.equal(out.contacts[0].index,63);assert.equal(out.fragmentEvents.length,1);
 assert.deepEqual(out.objectWordsC940.slice(0,63*49),q.objectWordsC940.slice(0,63*49));
 const broken=reference.cases.find(c=>c.input.objectWordPatches.some(p=>p.wordIndex===0xbc/4&&p.value===7)&&c.input.objectWordPatches.some(p=>p.wordIndex===0x4c/4&&p.value===10));
 const b={...broken.input,objectWordsC940:patch(seed(),broken.input.objectWordPatches)};
 assert.equal(prepareNativeGenericObjectContacts(b).objectWordsC940[0xbc/4],7);
});

test('invalid body and duplicated raw owners cannot mutate canonical state or supplied physical views',()=>{
 const c=reference.cases[0],q={...c.input,objectWordsC940:patch(seed(),c.input.objectWordPatches)},state=canonical(q),before=nativeRaceStateSnapshot(state),physical=body(q),copy=structuredClone(physical);
 assert.throws(()=>prepareNativeRaceGenericObjectContacts(state,{...physical,stabilityNative:NaN}));assert.deepEqual(nativeRaceStateSnapshot(state),before);assert.deepEqual(physical,copy);
 assert.throws(()=>prepareNativeRaceGenericObjectContacts(state,{...physical,objectWordsC940:q.objectWordsC940}),/overlaps/);
});
