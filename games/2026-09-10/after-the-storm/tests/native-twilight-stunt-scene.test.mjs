import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
import {createNativeStuntPresentation} from '../native-stunt-presentation.js';

test('Twilight binds all17 rings including alternate paths with shared scoring ordinals',()=>{
 const s=createRace({course:getCourse('neon'),mode:'stunt',physics:'native'});
 assert.equal(s.nativeStuntWorld.rings.length,17);assert.equal(s.nativeStuntWorld.volumes.length,4);
 assert.equal(new Set(s.nativeStuntWorld.rings.map(r=>r.sourceIndex)).size,17);
 for(const ordinal of [3,4,5]){
  const indices=s.course.rings.flatMap((q,i)=>q.order===ordinal?[i]:[]);
  assert.equal(indices.length,2);
  const [a,b]=indices.map(i=>s.nativeStuntWorld.rings[i]);
  assert.notEqual(a.sourceIndex,b.sourceIndex);assert.notDeepEqual(a.position,b.position);
 }
 for(const ring of s.nativeStuntWorld.rings){
  const authored=s.course.rings[ring.index];assert.deepEqual(ring.position,[authored.x,authored.y,authored.z]);
 }
 const duplicated=s.course.rings.map(r=>({...r}));duplicated[6]={...duplicated[3]};
 assert.throws(()=>createNativeStuntPresentation({course:{...s.course,rings:duplicated},readState:s.nativeLaunch.snapshot}),/ordinal and center/);
});

test('alternate rings retain independent collected visibility and the original shared scoring sequence',()=>{
 const initial=createRace({course:getCourse('neon'),mode:'stunt',physics:'native'}).nativeLaunch.snapshot();
 Object.assign(initial.scene,{phase650:3,simulation648:3,clockStopped817c:0});
 for(const branch of [0,1]){
  const s=createRace({course:getCourse('neon'),mode:'stunt',physics:'native',nativeInitialRaceState:initial});
  const selected=s.course.rings.flatMap((r,i)=>r.order===3?[i]:[]),index=selected[branch],other=selected[1-branch];
  const ring=s.nativeStuntDisplay.snapshot().world.rings[index];
  const [x,y,z]=ring.position.map(v=>v/.025);
  const result=s.nativeLaunch.advanceStuntRings({x,y:y-8,z});
  assert.deepEqual(result.diagnostic.collectedRows,[ring.sourceIndex]);
  const state=s.nativeStuntDisplay.snapshot();
  assert.equal(state.world.rings[index].collected,true);assert.equal(state.world.rings[other].collected,false);
  assert.equal(state.hud.rings,1);assert.equal(s.nativeLaunch.stuntView().nextRing,4);
  assert.deepEqual(s.nativeLaunch.advanceStuntRings({x,y:y-8,z}).diagnostic.collectedRows,[]);
 }
});

test('native Twilight terrain has a distinct cache identity and retains the full terrain/depth resolutions',async()=>{
 const base=getCourse('neon'),scene=nativeStuntScene(base),modernKey=terrainKey(base),key=terrainKey(scene);
 assert.notEqual(key,modernKey);assert.equal(terrainIdentity(scene).nativeSceneCourseIndex,6);
 assert.equal(scene.sky,base.sky);assert.equal(scene.water,base.water);assert.equal(scene.storm,base.storm);
 assert.equal(base.nativeSceneCourseIndex,undefined);assert.equal(nativeStuntScene(getCourse('amber')).id,'amber');
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;
 let reply;
 try{
  globalThis.self={postMessage:data=>reply=data};
  await import('../terrain-worker/terrain-worker.js');
  globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});
 }finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);
 assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
