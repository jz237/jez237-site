import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeDrakeRaceScene} from '../source-drake-course.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {createNativeCourseDecorationPresentation} from '../native-course-decoration-presentation.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const create=(difficulty=0,mode='time')=>createRace({course:getCourse('reed',difficulty),difficulty,mode,physics:'native'});
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};

test('ordinary Drake renders exactly its canonical difficulty-selected decorations and scored markers',()=>{
 for(let d=0;d<4;d++)for(const mode of ['time','versus']){
  const s=create(d,mode),c=s.course,raw=s.nativeLaunch.snapshot(),world=s.nativeCourseWorld;
  assert.equal(world.decorations.length,d<2?24:48);assert.equal(raw.scene.objectCountFa40,world.decorations.length);
  assert.equal(world.rings.length,0);assert.equal(world.volumes.length,0);assert.equal(c.ramps.length,0);assert.equal(c.rocks.length,13);
  for(const v of world.decorations){
   assert.deepEqual(v.position,raw.objectWordsC940.slice(v.sourceIndex*49,v.sourceIndex*49+3).map(w=>float(w)*.025));
   assert.equal(v.visible,true);
  }
  for(const n of c.sourceBuoyLayout.nodes.filter(n=>n.enabled)){
   const g=c.gates[c.sourceVisibleGateIndices[n.sourceRow]];assert.ok(g);assert.equal(g.bx,n.x);assert.equal(g.bz,n.z);
  }
  assert.equal(c.sourceShores.reduce((n,q)=>n+q.sourceEdgeCount,0),72);
  assert.equal(c.staticSurfaces.reduce((n,q)=>n+q.triangles.length,0),22);
  assert.equal(c.reverse,d===3);assert.equal(c.nativeSceneMode,'race');
 }
 assert.equal(createRace({course:getCourse('reed'),mode:'time'}).course.nativeSceneCourseIndex,undefined);
});

test('ordinary reed bindings reject mismatched rows and replay stays detached from canonical objects',()=>{
 const s=create(2),initial=structuredClone(s.nativeCourseWorld),rec=createRecorder();
 const missing={...s.course,sourceStaticObjects:s.course.sourceStaticObjects.slice(1)};
 assert.throws(()=>createNativeCourseDecorationPresentation({course:missing,readState:s.nativeLaunch.snapshot}),/Every loaded decoration/);
 const wrong={...s.course,sourceStaticObjects:s.course.sourceStaticObjects.map(q=>({...q,y:q.y+1}))};
 assert.throws(()=>createNativeCourseDecorationPresentation({course:wrong,readState:s.nativeLaunch.snapshot}),/loaded source row and center/);
 for(let i=0;i<180;i++)stepRace(s,{},1/60);
 assert.deepEqual(s.nativeCourseWorld,initial);s.phase='running';recordMoment(rec,s,0);
 const frame=replaySample(rec,rec.frames[0].time);frame.nativeCourseWorld.decorations[0].position[0]+=99;
 assert.deepEqual(s.nativeCourseWorld,initial);
 const before=s.nativeLaunch.snapshot();s.phase='paused';for(let i=0;i<30;i++)stepRace(s,{},1/60);
 assert.deepEqual(s.nativeLaunch.snapshot(),before);assert.deepEqual(s.nativeCourseWorld,initial);
});

test('ordinary Drake terrain keeps full resolution and a separate matching worker identity',async()=>{
 const base=getCourse('reed',2),scene=nativeDrakeRaceScene(base),key=terrainKey(scene);
 assert.notEqual(key,terrainKey(base));assert.notEqual(key,terrainKey(nativeStuntScene(base)));
 assert.equal(terrainIdentity(scene).nativeSceneMode,'race');assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});}
 finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
