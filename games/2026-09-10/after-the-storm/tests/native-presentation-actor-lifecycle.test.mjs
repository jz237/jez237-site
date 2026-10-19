import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationActorBounds as bounds,prepareNativePresentationActorRetirement as retire,prepareNativePresentationActorSubmission as submit} from '../native-presentation-actor-pool.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationActorDisplayBoundary as boundary} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-lifecycle.json.gz',import.meta.url))));
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060};}

test('pre-display bounds and post-display retirement match original ordered stores and retained pool hashes',()=>{
 assert.equal(evidence.cases.length,110);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=({bounds,retire})[a.phase](a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);
  assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(a,before);
 }
});

test('retirement preserves permanent actors and temporary row data while reclaiming only temporary type slots',()=>{
 let pool={actorWordsF060:[...evidence.baseActorWords],actorControlWords62c4:[0x89abcdef,3,3]};
 const sourceWords=Array.from({length:24*13},(_,i)=>i+1),initial=structuredClone(pool);
 for(let frame=0;frame<100;frame++){
  const submitted=submit({...pool,count:24,sourceWords});assert.equal(submitted.actorControlWords62c4[2],27);
  assert.deepEqual(submitted.actorWordsF060.slice(0,3*47),initial.actorWordsF060.slice(0,3*47));
  pool=retire(submitted);assert.deepEqual(pool.actorControlWords62c4,[0x89abcdef,3,3]);
  for(let row=3;row<30;row++){
   assert.equal(pool.actorWordsF060[row*47],0);
   assert.deepEqual(pool.actorWordsF060.slice(row*47+1,(row+1)*47),submitted.actorWordsF060.slice(row*47+1,(row+1)*47));
  }
 }
});

test('canonical display boundaries retain race and HUD state and reject invalid retirement without partial writes',()=>{
 const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
 const a=input(evidence.cases.find(c=>c.input.phase==='bounds'));state.actorWordsF060=a.actorWordsF060;state.actorControlWords62c4=a.actorControlWords62c4;const before=structuredClone(state);
 const q=boundary(state,{phase:'bounds'}),r=boundary(q.state,{phase:'retire'});
 assert.deepEqual(r.state.hudWords7788,state.hudWords7788);assert.deepEqual(r.state.raceWords1f94,state.raceWords1f94);
 assert.deepEqual(r.effects,[]);assert.deepEqual(state,before);
 const bad=structuredClone(state);bad.actorControlWords62c4[1]=0xffffffff;const saved=structuredClone(bad);
 assert.throws(()=>boundary(bad,{phase:'retire'}),/outside pool/);assert.deepEqual(bad,saved);
 assert.throws(()=>boundary(state,{phase:'camera'}),/display boundary/);assert.deepEqual(state,before);
});
