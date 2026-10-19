import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {nativePresentationVectorHeading as heading,nativePresentationActorMatrixEstimate as estimate,prepareNativePresentationActorVisibility as prepare} from '../native-presentation-actor-visibility.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationActorVisibilityUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-visibility.json.gz',import.meta.url))));
function input(c){const actorWordsF060=[...evidence.baseActorWords],hudWords7788=[...evidence.baseHudWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;for(const [i,w]of c.input.hudOverrides)hudWords7788[i]=w;return {...c.input,actorWordsF060,hudWords7788};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
const b=new DataView(new ArrayBuffer(4)),bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};

test('presentation headings preserve original lookup, reciprocal normalization and integer truncation',()=>{
 assert.equal(evidence.headings.length,368);
 for(const c of evidence.headings)assert.equal(bits(heading(...c.input)),c.result,JSON.stringify(c.input));
});
test('matrix estimates match original type costs and signed addition without allocating matrices',()=>{
 assert.equal(evidence.estimates.length,200);
 for(const c of evidence.estimates)assert.equal(estimate(...c.input)>>>0,c.result,JSON.stringify(c.input));
 assert.equal(estimate(13,191),191);assert.equal(estimate(1,184),192);
});
test('actor visibility matches complete original execution for both cameras, all quadrants and the100-degree boundary',()=>{
 assert.equal(evidence.cases.length,528);let visible=0,hidden=0;
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.equal(q.visible,c.visible,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);assert.deepEqual(a,before);
  if(q.visible)visible++;else hidden++;
 }
 assert.ok(visible>0&&hidden>0);
});
test('canonical visibility reads retained display selector and preserves unrelated state, including on a late failed angle lookup',()=>{
 const c=evidence.cases.find(c=>c.input.cameraIndex===1&&c.operations.length===2),a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
 state.actorWordsF060=a.actorWordsF060;state.hudWords7788=a.hudWords7788;state.scene.displayCamera3930=1;
 const before=structuredClone(state),q=update(state,{...a,cameraIndex:0,actorWordsF060:[],hudWords7788:[]});
 assert.equal(q.visible,c.visible);assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
 assert.deepEqual(q.state.scene,state.scene);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(q.effects,[]);assert.deepEqual(state,before);
 const bad=structuredClone(state);bad.actorWordsF060[a.actorIndex*47+0x14/4]=0x7fc00000;const saved=structuredClone(bad);
 assert.throws(()=>update(bad,{actorIndex:a.actorIndex}),/Nonfinite/);assert.deepEqual(bad,saved);
});
test('submitted and empty actors do not read unused camera or angle inputs',()=>{
 const pool=Array(1484).fill(0);assert.equal(prepare({actorWordsF060:pool,actorIndex:0}).visible,false);
 pool[0xb8/4]=1;assert.equal(prepare({actorWordsF060:pool,actorIndex:0}).visible,true);
 assert.equal(heading(0,0,[]),0);assert.throws(()=>heading(1,0,[]),/512/);
 assert.throws(()=>prepare({actorWordsF060:pool,actorIndex:30}),/index/);
});
