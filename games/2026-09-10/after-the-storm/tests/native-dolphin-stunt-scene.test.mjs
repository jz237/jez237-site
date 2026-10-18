import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {DOLPHIN_STUNT_GEOMETRY as G} from '../source-dolphin-stunt-data.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const create=()=>createRace({course:getCourse('practice'),mode:'stunt',physics:'native'});

test('Dolphin visual terrain reconstructs all100 finite native faces and55 shore segments',()=>{
 const support=nativeAdditionalStuntSupportGeometry({courseIndex:0}),c=create().course,indices=[];
 for(const group of G.floors)for(let j=0;j<group.triangles.length;j++){
  const index=group.indices[j];indices.push(index);const p=support.floor.planes[index-1],tri=group.triangles[j];
  for(const v of tri){const delta=p.slice(0,3).map((n,k)=>n-v[k]);const dot=off=>p.slice(off,off+3).reduce((sum,n,k)=>sum+n*delta[k],0);
   assert.ok(Math.abs(dot(3))<1e-5);assert.ok(dot(6)>-1e-5&&dot(9)>-1e-5&&dot(12)>p[15]-1e-5&&dot(12)<1e-5);
  }
  const center=[0,1,2].map(k=>tri.reduce((n,v)=>n+v[k],0)/3);
  const surface=c.staticSurfaces.find(q=>q.id===group.id);
  assert.ok(Math.abs(surface.heightAt(center[0]*.025,center[2]*.025)-center[1]*.025)<1e-6);
 }
 assert.equal(new Set(indices).size,100);assert.equal(Math.min(...indices),1);assert.equal(Math.max(...indices),100);
 const shores=c.sourceShores;assert.equal(shores.reduce((n,q)=>n+q.sourceEdgeCount,0),55);
 const open=shores.filter(q=>!q.sourceClosed);assert.equal(open.length,1);assert.equal(open[0].outline.length,4);
 for(const shore of shores)for(let j=0;j<shore.sourceLineIndices.length;j++){
  const raw=support.shore.lines[shore.sourceLineIndices[j]],a=shore.outline[j],b=shore.outline[(j+1)%shore.outline.length];
  const ends=[[raw[0],raw[1]],[raw[0]+raw[4]*raw[6],raw[1]+raw[5]*raw[6]]].map(p=>p.map(v=>v*.025));
  assert.ok(ends.some(p=>Math.hypot(p[0]-a[0],p[1]-a[1])<.001));assert.ok(ends.some(p=>Math.hypot(p[0]-b[0],p[1]-b[1])<.001));
 }
});

test('Dolphin binds10 rings and24 ramp faces while keeping all205 fixed colliders in original order',()=>{
 const s=create(),raw=s.nativeLaunch.snapshot(),dv=new DataView(new ArrayBuffer(4));
 const float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};
 assert.equal(s.nativeStuntWorld.rings.length,10);assert.equal(s.nativeStuntWorld.volumes.length,24);
 assert.equal(s.course.rocks.length,205);assert.equal(s.course.boundaryMarkers.length,144);assert.equal(s.course.sourceDecorations.length,12);
 for(const [i,q] of s.course.rocks.entries()){
  const row=raw.fixedSphereWordsB138.slice(i*6,(i+1)*6);
  assert.deepEqual([q.x,q.y,q.z,q.r],row.slice(0,4).map(w=>float(w)*.025));assert.equal(q.runtimeTag,row[4]);
 }
 for(const v of s.nativeStuntWorld.volumes){const row=raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(float);
  assert.deepEqual(v.origin,row.slice(0,3).map(n=>n*.025));assert.deepEqual(v.axes,[row.slice(3,6),row.slice(6,9),row.slice(9,12)]);assert.deepEqual(v.spans,row.slice(12,15).map(n=>n*.025));
 }
 const decorations=s.nativeHost.objects.snapshot().filter(q=>q.runtimeKind===11);
 assert.equal(decorations.length,12);
 decorations.forEach((q,i)=>{assert.equal(q.renderKind,2);const d=s.course.sourceDecorations[i];assert.deepEqual([d.x,d.y,d.z],q.positionNative.map(n=>n*.025));});
 assert.deepEqual(s.course.checkpoints.map(q=>q.sourceRow),[1,2,3,0]);assert.deepEqual(s.course.checkpoints.map(q=>q.limit),[15,15,15,15]);
 assert.throws(()=>createRace({course:getCourse('practice'),mode:'time',physics:'native'}),/verified course/);
});

test('Dolphin native terrain preserves full resolution and leaves ordinary Free Ride unchanged',async()=>{
 const base=getCourse('practice'),scene=nativeStuntScene(base),key=terrainKey(scene),modern=createRace({course:base,mode:'practice'});
 assert.notEqual(key,terrainKey(base));assert.equal(terrainIdentity(scene).nativeSceneCourseIndex,0);
 assert.equal(scene.sky,base.sky);assert.equal(scene.water,base.water);assert.equal(base.nativeSceneCourseIndex,undefined);
 assert.equal(modern.course.nativeSceneCourseIndex,undefined);assert.equal(modern.physics,'modern');
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});}
 finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
