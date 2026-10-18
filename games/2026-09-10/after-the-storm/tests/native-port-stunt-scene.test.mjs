import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {createNativeStuntPresentation,captureNativeStuntWorld} from '../native-stunt-presentation.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
const create=()=>createRace({course:getCourse('port'),mode:'stunt',physics:'native',waveSeed:17});

test('Port binds all16 source rings,20 ramp surfaces and12 floating bodies without a duplicate motion owner',()=>{
 const s=create(),w=s.nativeStuntWorld;
 assert.equal(w.rings.length,16);assert.equal(w.volumes.length,20);assert.equal(w.floating.length,12);
 assert.equal(s.nativeHost.floating,null);assert.equal(s.nativeHost.objects.snapshot().filter(o=>o.runtimeKind===9).length,12);
 assert.deepEqual(s.course.dynamicObjectsForPlayers(1),[]);
 for(const q of w.rings){const r=s.course.rings[q.index];assert.deepEqual(q.position,[r.x,r.y,r.z]);}
 assert.throws(()=>createNativeStuntPresentation({course:{...s.course,sourceDynamicObjects:[]},readState:s.nativeLaunch.snapshot}),/Every source floating body/);
 const definitions=s.course.sourceDynamicObjects.map(q=>({...q}));definitions[0].x+=1;
 assert.throws(()=>createNativeStuntPresentation({course:{...s.course,sourceDynamicObjects:definitions},readState:s.nativeLaunch.snapshot}),/source center and radius/);
});

test('Port float meshes and replay follow actual canonical buoyancy without mutating it',()=>{
 const s=create(),initial=s.nativeStuntWorld.floating,recorder=createRecorder();
 for(let i=0;i<250;i++)stepRace(s,{},1/60);
 const raw=s.nativeLaunch.snapshot(),objects=s.nativeHost.objects.snapshot(),w=s.nativeStuntDisplay.snapshot().world;
 assert.notDeepEqual(w.floating.map(q=>q.position),initial.map(q=>q.position));
 const dv=new DataView(new ArrayBuffer(4)),float=n=>{dv.setUint32(0,n);return dv.getFloat32(0);};
 for(const q of w.floating){
  const o=objects.find(o=>o.sourceIndex===q.sourceIndex),matrix=o.floatMatrixWords.map(float);
  for(let j=12;j<15;j++)matrix[j]*=.025;
  assert.deepEqual(q.matrix,matrix);assert.deepEqual(q.position,o.positionNative.map(n=>n*.025));
  assert.equal(q.visible,o.renderKind!==0);
 }
 for(let i=0;i<20;i++)captureNativeStuntWorld(s.nativeStuntDisplay.snapshot().world);
 assert.deepEqual(s.nativeLaunch.snapshot(),raw);
 recordMoment(recorder,s,0);const sample=replaySample(recorder,recorder.frames[0].time);
 assert.deepEqual(sample.nativeStuntWorld.floating,s.nativeStuntWorld.floating);
 const detached=captureNativeStuntWorld(w);detached.floating[0].position[0]+=10;
 assert.notDeepEqual(detached.floating[0].position,w.floating[0].position);
 const bad=structuredClone(w);bad.floating.push(bad.floating[0]);assert.throws(()=>captureNativeStuntWorld(bad),/Duplicate floating/);
 s.phase='paused';for(let i=0;i<30;i++)stepRace(s,{},1/60);assert.deepEqual(s.nativeLaunch.snapshot(),raw);
});

test('Port native terrain keeps full resolution and a distinct matching worker cache',async()=>{
 const base=getCourse('port'),scene=nativeStuntScene(base),key=terrainKey(scene);
 assert.notEqual(key,terrainKey(base));assert.equal(terrainIdentity(scene).nativeSceneCourseIndex,5);
 assert.equal(scene.sky,base.sky);assert.equal(scene.water,base.water);assert.equal(base.nativeSceneCourseIndex,undefined);
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 assert.equal(scene.sourceShores.reduce((n,q)=>n+q.sourceEdgeCount,0),117);
 assert.equal(scene.sourceFloor(0,0),null);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});}
 finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
