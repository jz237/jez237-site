import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {getCourse} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {sampleTerrain,terrainIdentity,terrainKey} from '../terrain-data.js';
import {createTerrainPreparation} from '../terrain-preparation.js';
import {createAssetStore} from '../asset-store.js';

test('background terrain is byte-identical to the original full-resolution terrain and depth map',()=>{
 const geometry=new T.PlaneGeometry(920,920,360,360);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position;
 for(const id of ['greyhaven','amber','reed','citadel','port','neon','glacier','tempest','practice'])for(const difficulty of [0,2,3]){
  const course=getCourse(id,difficulty),ground=course.renderGround||course.ground,result=sampleTerrain(ground);
  const original=new Float32Array(p.count),depth=new Uint8Array(512*512*4);
  for(let i=0;i<p.count;i++)original[i]=ground(p.getX(i),p.getZ(i));
  for(let z=0;z<512;z++)for(let x=0;x<512;x++){
   const h=ground((x/511-.5)*920,(z/511-.5)*920),v=Math.round(T.MathUtils.clamp((h+16)/100,0,1)*65535),i=(z*512+x)*4;
   depth[i]=v>>8;depth[i+1]=v&255;depth[i+3]=255;
  }
  assert.deepEqual(result.heights,original,id+' '+difficulty+' vertices');
  assert.deepEqual(result.depth,depth,id+' '+difficulty+' water depth');
 }
 geometry.dispose();
});
test('stunt terrain selects the same forward passage heights as the original course closure',()=>{
 for(const id of ['citadel','port','practice','amber'])for(const difficulty of [0,1,2,3])for(const freeRide of [false,true]){
  const course=stuntCourse(getCourse(id,difficulty),{freeRide}),identity=terrainIdentity(course),workerCourse=getCourse(identity.id,identity.difficulty);
  const a=course.renderGround||course.ground,b=workerCourse.renderGround||workerCourse.ground;
  for(let i=0;i<500;i++){const x=(i*73%919)-459,z=(i*139%919)-459;assert.equal(a(x,z),b(x,z),id+' '+difficulty+' '+freeRide);}
 }
});
test('terrain cache stays bounded and worker failure keeps the synchronous fallback available',()=>{
 let worker;const service=createTerrainPreparation({makeWorker:()=>worker={postMessage(){},terminate(){this.stopped=true;}}});
 const course=id=>({id,difficulty:0});
 for(const id of ['greyhaven','amber','reed']){service.prepare(course(id));worker.onmessage({data:{key:terrainKey(course(id)),heights:new Float32Array([1]),depth:new Uint8Array([2]),ms:3}});}
 assert.equal(service.stats.cached,2);assert.equal(service.get(course('greyhaven')),null);assert.ok(service.get(course('amber')));
 worker.onerror();assert.equal(service.stats.failed,true);assert.equal(worker.stopped,true);assert.equal(service.get(course('port')),null);
});
function memoryStorage(){const data=new Map();return {data,open:async()=>({match:async k=>data.get(String(k))?.clone(),put:async(k,r)=>{data.set(String(k),r.clone());},keys:async()=>[...data.keys()].map(url=>({url})),delete:async k=>data.delete(typeof k==='string'?k:k.url)})};}
test('repeat loading serves exact bytes without a network request; changed hashes fetch fresh assets',async()=>{
 const storage=memoryStorage(),base='https://example.com/game/asset-store.js';let downloads=0;
 const fetcher=async()=>{downloads++;return new Response(new Uint8Array([0,255,37,128]));};
 const first=createAssetStore({versions:{'assets/a.bin':'aaaa'},base,storage,fetcher});
 assert.deepEqual(new Uint8Array(await(await first.get(first.url('assets/a.bin'))).arrayBuffer()),new Uint8Array([0,255,37,128]));await first.flush();
 const second=createAssetStore({versions:{'assets/a.bin':'aaaa'},base,storage,fetcher});
 assert.deepEqual(new Uint8Array(await(await second.get(second.url('assets/a.bin'))).arrayBuffer()),new Uint8Array([0,255,37,128]));assert.equal(downloads,1);assert.equal(second.stats.hits,1);
 const changed=createAssetStore({versions:{'assets/a.bin':'bbbb'},base,storage,fetcher});await changed.get(changed.url('assets/a.bin'));await changed.flush();
 assert.equal(downloads,2);assert.equal(storage.data.size,1);
});
test('storage denial and failed downloads never prevent normal asset loading',async()=>{
 let requests=0;const denied=createAssetStore({versions:{'assets/a.bin':'aaaa'},storage:{open:async()=>{throw Error('Denied');}},fetcher:async()=>{requests++;return new Response('ok');}});
 assert.equal(await(await denied.get(denied.url('assets/a.bin'))).text(),'ok');assert.equal(requests,1);
 const storage=memoryStorage(),bad=createAssetStore({versions:{'assets/a.bin':'aaaa'},storage,fetcher:async()=>new Response('missing',{status:404})});
 assert.equal((await bad.get(bad.url('assets/a.bin'))).status,404);await bad.flush();assert.equal(storage.data.size,0);
});
