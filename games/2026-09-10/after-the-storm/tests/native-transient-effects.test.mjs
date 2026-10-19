import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeTransientEffects as prepare} from '../native-presentation-effects.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeTransientEffectsUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-transient-effects.json.gz',import.meta.url))));
const off=a=>(a-0x790)/4;
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {seed6f00:c.input.seed6f00,effectWords0790};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}

test('transient emission and aging match 160 complete original executions including all random draws and signed age overflow',()=>{
 assert.equal(evidence.cases.length,160);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.effectWords0790),c.effectSHA256,'case '+i);assert.equal(q.seed6f00,c.seed6f00,'case '+i);
  assert.deepEqual(a,before);assert.ok(Object.isFrozen(q.effectWords0790));
 }
});

test('emission wraps the ring, ages new rows immediately and retires on the eighth update',()=>{
 const a={effectWords0790:Array(7415).fill(0),seed6f00:0};a.effectWords0790[off(0x7ad8)]=7;a.effectWords0790[off(0x7adc)]=1;
 let q=prepare(a);assert.equal(q.diagnostic.emitted,1);assert.equal(q.effectWords0790[off(0x7ad8)],0);assert.equal(q.effectWords0790[off(0x7a1c+7*24)],1);
 const seed=q.seed6f00;for(let i=0;i<7;i++)q=prepare(q);
 assert.equal(q.seed6f00,seed);assert.equal(q.effectWords0790[off(0x7a18+7*24)],0);assert.equal(q.effectWords0790[off(0x7a1c+7*24)],8);
 assert.equal(q.diagnostic.retired,1);
});

test('invalid emission fails atomically and inactive emitters do not inspect stale coordinates or slot selectors',()=>{
 const a={effectWords0790:Array(7415).fill(0),seed6f00:17};a.effectWords0790[off(0x7ad8)]=8;a.effectWords0790[off(0x7ae0)]=0x7fc00000;
 assert.deepEqual(prepare(a).operations,[]);
 a.effectWords0790[off(0x7adc)]=1;let before=structuredClone(a);assert.throws(()=>prepare(a),/Nonfinite/);assert.deepEqual(a,before);
 a.effectWords0790[off(0x7ae0)]=0;before=structuredClone(a);assert.throws(()=>prepare(a),/slot/);assert.deepEqual(a,before);
});

test('canonical transient updates retain ownership and use the scene seed without altering gameplay RNG or physical bodies',()=>{
 const c=evidence.cases.find(c=>c.operations.filter(o=>o.kind==='sourceHalfwordWrite').length===11),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4}));
 state.effectWords0790=a.effectWords0790;state.scene.seed6f00=a.seed6f00;const before=structuredClone(state),q=update(state);
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.equal(q.state.scene.seed6f00,c.seed6f00);assert.deepEqual(q.effects,[]);
 for(const key of Object.keys(state))if(key!=='scene'&&key!=='effectWords0790')assert.deepEqual(q.state[key],state[key],key);
 assert.deepEqual({...q.state.scene,seed6f00:state.scene.seed6f00},state.scene);assert.deepEqual(state,before);
 state.effectWords0790[off(0x7ad8)]=8;const bad=structuredClone(state);assert.throws(()=>update(state),/slot/);assert.deepEqual(state,bad);
});
