import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeSprayParticleMotion as prepare} from '../native-spray-particle-motion.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-spray-particle-motion.json.gz',import.meta.url))));
const off=a=>(a-0x790)/4;
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {...c.input,effectWords0790};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}

test('retained particle motion matches all original stores and hashes for72 source-phase executions',()=>{
 assert.equal(evidence.cases.length,72);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.effectWords0790),c.effectSHA256,'case '+i);
  assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60,'case '+i);assert.deepEqual(a,before);assert.ok(Object.isFrozen(q.effectWords0790));
 }
});

test('inactive particle data and non-primary shared particles survive while every wake row moves and ages',()=>{
 const a=input(evidence.cases[0]),q=prepare(a),entry=0x798;
 assert.deepEqual(q.effectWords0790.slice(off(entry),off(entry+0x1aa0)),a.effectWords0790.slice(off(entry),off(entry+0x1aa0)));
 for(let i=0;i<8;i++){const n=off(entry+0x1aa0+i*48);assert.equal(q.effectWords0790[n+10],(a.effectWords0790[n+10]+1)>>>0);for(const j of [1,4,6,7,8,9,11])assert.equal(q.effectWords0790[n+j],a.effectWords0790[n+j]);}
 const c=evidence.cases.find(c=>c.input.racerIndex!==c.input.primaryHumanIndex&&c.operations.length>500),x=input(c),y=prepare(x),e=0x798+x.racerIndex*0x1c74;
 assert.deepEqual(y.effectWords0790.slice(off(e+0x1000),off(e+0x1a00)),x.effectWords0790.slice(off(e+0x1000),off(e+0x1a00)));
 assert.ok(q.operations.every(o=>!o.kind.includes('Vertex')&&o.kind!=='sourceHalfwordWrite'));
});

test('late malformed wake storage cannot commit earlier particle aging and movement',()=>{
 const a=input(evidence.cases[6]);a.effectControlWords6d60=[...a.effectControlWords6d60];a.effectControlWords6d60[8]=0x801d7b68;
 const before=structuredClone(a);assert.throws(()=>prepare(a),/storage offset/);assert.deepEqual(a,before);
 const x=input(evidence.cases[6]);x.effectWords0790[off(0x798+0x1aa0+7*48+0x18)]=0x7fc00000;const saved=structuredClone(x);
 assert.throws(()=>prepare(x),/Nonfinite/);assert.deepEqual(x,saved);
});
