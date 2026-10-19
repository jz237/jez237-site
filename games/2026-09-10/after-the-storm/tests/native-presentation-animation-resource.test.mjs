import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {readNativePresentationAnimationResource as read,createNativePresentationAnimationBank as createBank,createNativePresentationAnimationResources as createResources} from '../native-presentation-animation-resource.js';
import {selectNativePresentationAnimationRoot as select} from '../native-presentation-animation-root.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-animation-resource.json.gz',import.meta.url))));
const loadedBytes=new Uint8Array(Buffer.from(e.loadedBytesBase64,'base64'));
const input={loadedBytes,baseAddress:e.baseAddress,animationTableAddress:e.animationTableAddress};

test('loaded resource decoding preserves source-selected signed frames, keys and transform components',()=>{
 assert.equal(e.cases.length,144);assert.equal(e.instructions,6894);const before=loadedBytes.slice();
 const animations=Object.fromEntries([0,1,7].map(animationIndex=>[animationIndex,read({...input,animationIndex,frames:[-1,0,1,7,8,32767],trackOffsets:[8,12,16]})]));
 for(const c of e.cases){
  const q=select({...c,resourceWordsE73c:e.resourceWordsE73c,animationsByResourceIndex:Object.fromEntries(Array.from({length:8},(_,i)=>[i,animations]))});
  const animation=animations[q.animationIndex],row=animation.transforms[q.transformIndex];
  assert.deepEqual(row,c.transform);assert.ok(Object.isFrozen(row.positionNative));
  const descriptor=new DataView(loadedBytes.buffer).getUint32(e.animationTableAddress-e.baseAddress+c.animationIndex*4);
  const transformBase=new DataView(loadedBytes.buffer).getUint32(descriptor-e.baseAddress+4);
  assert.equal((transformBase+q.transformIndex*12)>>>0,c.transformAddress);
 }
 assert.deepEqual(loadedBytes,before);
});

test('resource span views respect their byte offset and reject missing reached bytes without writes',()=>{
 const padded=new Uint8Array(loadedBytes.length+17);padded.set(loadedBytes,9);
 const args={...input,animationIndex:0,frames:[-1,8],trackOffsets:[8]};
 assert.deepEqual(read({...args,loadedBytes:padded.subarray(9,9+loadedBytes.length)}),read(args));
 const before=loadedBytes.slice();
 assert.deepEqual(read({...args,frames:[2147483647]}).transforms,read({...args,frames:[-1]}).transforms);
 assert.throws(()=>read({...args,frames:[0x40000000]}),/outside loaded span/);
 assert.throws(()=>read({...args,trackOffsets:[9]}),/Unaligned/);
 assert.throws(()=>read({...args,loadedBytes:loadedBytes.subarray(0,0x1004)}),/outside loaded span/);
 assert.throws(()=>read({...args,baseAddress:0xffffffff}),/wraps/);
 assert.deepEqual(loadedBytes,before);
});

test('retained banks sample original raw frames lazily and cache immutable detached transforms',()=>{
 const bytes=loadedBytes.slice(),bank=createBank({...input,loadedBytes:bytes});bytes.fill(0);
 for(const c of e.cases){
  const animation=bank.animation(c.animationIndex),track=c.actorType===5?16:c.actorType>=7?12:8;
  const sample=animation.sampleTransform(track,c.frame);assert.deepEqual(sample.transform,c.transform);
  assert.equal(animation.sampleTransform(track,c.frame),sample);assert.equal(bank.animation(c.animationIndex),animation);
  assert.ok(Object.isFrozen(sample.transform.upUnits));
 }
 const animation=bank.animation(0);animation.sampleTransform(8,0);
 assert.throws(()=>animation.sampleTransform('8',0),/track offset/);
 assert.throws(()=>animation.sampleTransform(8,'0'),/frame/);
 assert.throws(()=>animation.sampleTransform(9,0),/Unaligned/);
 assert.throws(()=>animation.sampleTransform(8,0x40000000),/outside loaded span/);
});

test('resource providers bind retained slots and refuse stale metadata without touching unused static pointers',()=>{
 const words=Array(43).fill(0);words[0x9c/4]=0;words[0xa0/4]=0x08000000;words[0xa4/4]=5;words[0x48/4]=e.animationTableAddress;words[(0x48+44)/4]=0xdeadbeef;
 const before=[...words],provider=createResources({resourceWordsE73c:words,loadedBanks:{0:input}});
 assert.deepEqual(provider.getAnimation(0,0,words).sampleTransform(8,-1).transform,e.cases.find(c=>c.actorType===1&&c.animationIndex===0&&c.frame===-1).transform);
 assert.throws(()=>provider.getAnimation(1,0,words),/no loaded animation bank/);
 for(const offset of [0x9c,0xa0,0x48]){const changed=[...words];changed[offset/4]++;assert.throws(()=>provider.getAnimation(0,0,changed),/no longer matches/);}
 assert.deepEqual(words,before);
 words[0x48/4]=0;assert.throws(()=>provider.getAnimation(0,0,words),/no longer matches/);
 assert.equal(provider.getAnimation(0,0).frameCount,9);
});
