import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {DRAKE_STUNT_GEOMETRY as G} from '../source-drake-stunt-data.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {createNativeStuntPresentation,captureNativeStuntWorld} from '../native-stunt-presentation.js';
import {nativeReedGeometry} from '../native-reed-geometry.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const create=()=>createRace({course:getCourse('reed'),mode:'stunt',physics:'native'});
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};

test('Drake renders its22 finite source faces and preserves both closed72-edge shore boundaries',()=>{
 const s=create(),c=s.course,support=nativeAdditionalStuntSupportGeometry({courseIndex:4});
 let count=0;
 for(const group of G.floors)for(let j=0;j<group.triangles.length;j++){
  const p=support.floor.planes[group.indices[j]-1],tri=group.triangles[j];count++;
  for(const v of tri){const delta=p.slice(0,3).map((n,k)=>n-v[k]),dot=off=>p.slice(off,off+3).reduce((sum,n,k)=>sum+n*delta[k],0);
   assert.ok(Math.abs(dot(3))<1e-5);assert.ok(dot(6)>-1e-5&&dot(9)>-1e-5&&dot(12)>p[15]-1e-5&&dot(12)<1e-5);
  }
  const center=[0,1,2].map(k=>tri.reduce((sum,v)=>sum+v[k],0)/3*.025);
  assert.ok(Math.abs(c.sourceFloor(center[0],center[2])-center[1])<1e-6);
  assert.equal(c.renderGround(center[0],center[2]),c.sourceFloor(center[0],center[2]),'authored land cannot raise a finite source face');
 }
 assert.equal(count,22);assert.deepEqual(c.sourceShores.map(q=>[q.sourceClosed,q.waterInside,q.sourceEdgeCount]),[[true,false,41],[true,true,31]]);
 for(const shore of c.sourceShores)for(let j=0;j<shore.sourceLineIndices.length;j++){
  const raw=support.shore.lines[shore.sourceLineIndices[j]],a=shore.outline[j],b=shore.outline[(j+1)%shore.outline.length];
  const ends=[[raw[0],raw[1]],[raw[0]+raw[4]*raw[6],raw[1]+raw[5]*raw[6]]].map(p=>p.map(v=>v*.025));
  assert.ok(ends.some(p=>Math.hypot(p[0]-a[0],p[1]-a[1])<.001));assert.ok(ends.some(p=>Math.hypot(p[0]-b[0],p[1]-b[1])<.001));
 }
 assert.ok(c.renderGround(0,0)>0);assert.ok(c.renderGround(200,0)>0);assert.equal(c.renderGround(108,0),-8);
});

test('Drake binds the complete64 loaded objects rather than spawning all48 raw decoration rows',()=>{
 const s=create(),c=s.course,raw=s.nativeLaunch.snapshot(),world=s.nativeStuntWorld;
 assert.equal(raw.scene.objectCountFa40,64);assert.equal(world.rings.length,16);assert.equal(world.volumes.length,15);assert.equal(world.decorations.length,45);
 const resource=nativeStuntObjectResources({courseIndex:4,players:1});assert.equal(resource.genericRows.length,48);
 assert.deepEqual(world.decorations.map(v=>v.sourceIndex),Array.from({length:45},(_,i)=>i+19));
 for(const [i,v] of world.decorations.entries()){
  const row=resource.genericRows[i];assert.deepEqual(v.position,row.slice(0,3).map(n=>n*.025));assert.equal(v.visible,true);
  const b=v.sourceIndex*49;assert.equal(raw.objectWordsC940[b+19],row[3]+1);
  assert.deepEqual(raw.objectWordsC940.slice(b+21,b+24),[2,0,0],'decorations have no physical collision or motion');
 }
 for(const v of world.volumes){const row=raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(float);
  assert.deepEqual(v.origin,row.slice(0,3).map(n=>n*.025));assert.deepEqual(v.axes,[row.slice(3,6),row.slice(6,9),row.slice(9,12)]);assert.deepEqual(v.spans,row.slice(12,15).map(n=>n*.025));
 }
 assert.equal(c.rocks.length,13);c.rocks.forEach((v,i)=>{const row=raw.fixedSphereWordsB138.slice(i*6,(i+1)*6);
  assert.deepEqual([v.x,v.y,v.z,v.r],row.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,row[4]);
 });
 assert.deepEqual(c.checkpoints.map(q=>q.sourceRow),[1,5,9,0]);assert.deepEqual(c.checkpoints.map(q=>q.limit),[15,15,15,15]);
 assert.equal(createRace({course:getCourse('reed'),mode:'time',physics:'native'}).course.nativeSceneMode,'race');
});

test('source reed positions survive physical updates, pause and detached instant replay',()=>{
 const s=create(),initial=s.nativeStuntWorld.decorations,rec=createRecorder();
 for(let i=0;i<240;i++)stepRace(s,{},1/60);
 assert.deepEqual(s.nativeStuntWorld.decorations,initial);
 recordMoment(rec,s,0);const replay=replaySample(rec,rec.frames[0].time),raw=s.nativeLaunch.snapshot();
 assert.deepEqual(replay.nativeStuntWorld.decorations,initial);
 replay.nativeStuntWorld.decorations[0].position[0]=999;
 assert.deepEqual(s.nativeStuntWorld.decorations,initial);
 for(let i=0;i<20;i++)captureNativeStuntWorld(s.nativeStuntDisplay.snapshot().world);
 assert.deepEqual(s.nativeLaunch.snapshot(),raw);
 s.phase='paused';for(let i=0;i<30;i++)stepRace(s,{},1/60);assert.deepEqual(s.nativeLaunch.snapshot(),raw);
 const missing={...s.course,sourceStaticObjects:s.course.sourceStaticObjects.slice(1)};
 assert.throws(()=>createNativeStuntPresentation({course:missing,readState:s.nativeLaunch.snapshot}),/Every loaded source decoration/);
 const wrong={...s.course,sourceStaticObjects:s.course.sourceStaticObjects.map(v=>({...v,y:v.y+1}))};
 assert.throws(()=>createNativeStuntPresentation({course:wrong,readState:s.nativeLaunch.snapshot}),/loaded source row and center/);
 const duplicate=structuredClone(s.nativeStuntWorld);duplicate.decorations.push(duplicate.decorations[0]);assert.throws(()=>captureNativeStuntWorld(duplicate),/Duplicate decoration/);
});

test('authored reed meshes retain source height bounds while adding curved three-dimensional blades',()=>{
 for(const row of [19,20,63]){
  const {positions,colors,indices}=nativeReedGeometry(row);assert.equal(colors.length,positions.length);assert.ok(indices.length/3>1000);assert.ok(Math.max(...indices)<positions.length/3);
  const bounds=[0,1,2].map(axis=>{const values=Array.from(positions).filter((_,i)=>i%3===axis);return [Math.min(...values),Math.max(...values)];});
  assert.ok(bounds[0][0]>=-1.125&&bounds[0][1]<=1.125);assert.ok(bounds[2][0]>=-1.125&&bounds[2][1]<=1.125);
  assert.equal(bounds[1][0],-.5);assert.ok(bounds[1][1]>.8&&bounds[1][1]<=1);
  assert.ok(bounds[2][1]-bounds[2][0]>1,'reeds have depth, rather than a flat billboard');
 }
 assert.notDeepEqual(nativeReedGeometry(19).positions,nativeReedGeometry(20).positions);
});

test('Drake native terrain retains full resolution with a separate matching worker cache',async()=>{
 const base=getCourse('reed'),scene=nativeStuntScene(base),key=terrainKey(scene),modern=createRace({course:base,mode:'stunt'});
 assert.notEqual(key,terrainKey(base));assert.equal(terrainIdentity(scene).nativeSceneCourseIndex,4);
 assert.equal(modern.course.nativeSceneCourseIndex,undefined);assert.equal(modern.physics,'modern');
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});}
 finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
