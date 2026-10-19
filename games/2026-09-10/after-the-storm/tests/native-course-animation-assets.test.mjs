import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {NATIVE_COURSE_ANIMATION_ASSETS as layouts} from '../source-course-actor-animation-assets.js';
import {prepareNativeCourseAnimationAssetBank as prepare,loadNativeCourseAnimationAssets as load,createNativeCourseAnimationAssetResources as bind} from '../native-course-animation-assets.js';
import {readNativePresentationAnimationResource as read,createNativePresentationAnimationResources as resources} from '../native-presentation-animation-resource.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-course-animation-assets-reference.json',import.meta.url)));
const bytes=bank=>new Uint8Array(readFileSync(new URL('../'+layouts[bank].asset,import.meta.url)));
const hash=values=>createHash('sha256').update(values).digest('hex');
function input(bankIndex,baseOffset=0x60000){const segmentWordsE6b0=Array(16).fill(0);segmentWordsE6b0[8]=0x316800;return {bankIndex,bytes:bytes(bankIndex),baseAddress:0x80316800+baseOffset,baseOffset,segmentWordsE6b0};}

test('seven data-only assets reproduce original loaded spans, pointer stores and all eighteen animations',()=>{
 assert.equal(reference.length,7);let animations=0,pointers=0,totalBytes=0;
 for(const r of reference){
  const info=layouts[r.bank],a=input(r.bank),before=a.bytes.slice(),q=prepare(a);
  assert.equal(hash(a.bytes),info.sha256);assert.equal(hash(q.loadedBytes),r.relocatedSpanSHA256);assert.equal(q.operations.length,r.pointerFields);assert.equal(q.baseAddress,a.baseAddress+info.dataOffset);assert.equal(q.animationTableAddress,a.baseAddress+info.tableOffset);
  assert.ok(q.operations.every(o=>o.byteOffset>=info.dataOffset));assert.deepEqual(a.bytes,before);pointers+=q.operations.length;totalBytes+=q.loadedBytes.length;
  for(const [animationIndex,expected]of r.animations.entries()){
   const result=read({...q,animationIndex,frames:Array.from({length:expected.frameCount},(_,i)=>i),trackOffsets:Array.from({length:info.trackCount},(_,i)=>8+i*4)});
   assert.equal(result.frameCount,expected.frameCount);assert.equal(hash(JSON.stringify(result)),expected.sha256,`bank ${r.bank} animation ${animationIndex}`);animations++;
  }
 }
 assert.equal(animations,18);assert.equal(pointers,126);assert.equal(totalBytes,49024);
});

test('separate selected slots use their actual placement and retain provider ownership after asset mutation',()=>{
 const first=prepare(input(0)),second=prepare(input(2,0x6c220)),words=Array(43).fill(0);
 words[0x9c/4]=0;words[0xa0/4]=0x08060000;words[0x48/4]=first.animationTableAddress;
 words[0xa4/4]=2;words[0xa8/4]=0x0806c220;words[(0x48+44)/4]=second.animationTableAddress;
 const provider=resources({resourceWordsE73c:words,loadedBanks:{0:first,1:second}}),a=provider.getAnimation(0,0,words),b=provider.getAnimation(1,1,words);
 const dolphin=a.sampleTransform(8,0),fish=b.sampleTransform(12,0);first.loadedBytes.fill(0);second.loadedBytes.fill(0);
 assert.deepEqual(a.sampleTransform(8,0),dolphin);assert.deepEqual(b.sampleTransform(12,0),fish);assert.equal(a.frameCount,16);assert.equal(b.frameCount,20);
 const stale=[...words];stale[0xa8/4]+=8;assert.throws(()=>provider.getAnimation(1,1,stale),/no longer matches/);
});

test('data boundaries and inconsistent segment placement reject without altering input bytes',()=>{
 const a=input(0),before=a.bytes.slice(),info=layouts[0],padded=new Uint8Array(a.bytes.length+11);padded.set(a.bytes,7);
 assert.deepEqual(prepare({...a,bytes:padded.subarray(7,7+a.bytes.length)}).loadedBytes,prepare(a).loadedBytes);
 const bad=a.bytes.slice();new DataView(bad.buffer).setUint32(info.tableOffset-info.dataOffset,0x08000000);
 assert.throws(()=>prepare({...a,bytes:bad}),/outside its data block/);
 assert.throws(()=>prepare({...a,bytes:a.bytes.subarray(4)}),/length/);
 assert.throws(()=>prepare({...a,baseAddress:a.baseAddress+4}),/placement|outside/);
 assert.throws(()=>prepare({...a,bankIndex:5}),/animated/);assert.deepEqual(a.bytes,before);
 const q=prepare(a);assert.throws(()=>read({...q,animationIndex:0,frames:[0x40000000],trackOffsets:[8]}),/outside loaded span/);
});

test('selected downloads are deduplicated, skip static banks and verify actual bytes before returning',async()=>{
 const requests=[],fetcher=async path=>{requests.push(path);return new Response(readFileSync(new URL('../'+path,import.meta.url)));};
 const assets=await load([-1,5,7,0,0,2],{url:p=>p,fetcher});assert.deepEqual(requests,[layouts[0].asset,layouts[2].asset]);assert.deepEqual(Object.keys(assets),['0','2']);assert.deepEqual(assets[0],bytes(0));
 assert.deepEqual(await load([-1,5,7],{fetcher:()=>{throw new Error('unused download');}}),{});
 await assert.rejects(load([0],{url:p=>p,fetcher:async()=>new Response('missing',{status:404})}),/Could not load/);
 await assert.rejects(load([0],{url:p=>p,fetcher:async()=>new Response(new Uint8Array(4))}),/length/);
 const corrupted=bytes(0);corrupted[0]^=1;await assert.rejects(load([0],{url:p=>p,fetcher:async()=>new Response(corrupted)}),/content check/);
 await assert.rejects(load([9]),/indices/);
});

test('selected asset resources bind both canonical slots atomically and never replace stale table metadata',()=>{
 const a=input(0),b=input(2,0x6c240),words=Array(43).fill(0);
 words[0x9c/4]=0;words[0xa0/4]=0x08060000;words[0x48/4]=a.baseAddress+layouts[0].tableOffset;
 words[0xa4/4]=2;words[0xa8/4]=0x0806c240;words[(0x48+44)/4]=b.baseAddress+layouts[2].tableOffset;
 const args={resourceWordsE73c:words,assets:{0:a.bytes,2:b.bytes},loadedBasesBySlot:{0:a.baseAddress,1:b.baseAddress},segmentWordsE6b0:a.segmentWordsE6b0},before=structuredClone(args),q=bind(args);
 assert.equal(q.animationResources.getAnimation(0,0,words).frameCount,16);assert.equal(q.animationResources.getAnimation(1,1,words).frameCount,20);
 assert.equal(q.loadedBanks[1].baseAddress,b.baseAddress+layouts[2].dataOffset);
 const stale=[...words];stale[(0x48+44)/4]+=4;assert.throws(()=>bind({...args,resourceWordsE73c:stale}),/table ownership/);
 assert.throws(()=>bind({...args,assets:{0:a.bytes}}),/asset length/);assert.deepEqual(args,before);
 const unused=Array(43).fill(0);unused[0x9c/4]=5;unused[0xa4/4]=0xffffffff;unused[0x48/4]=0xdeadbeef;
 assert.deepEqual(bind({resourceWordsE73c:unused}).loadedBanks,{});
});
