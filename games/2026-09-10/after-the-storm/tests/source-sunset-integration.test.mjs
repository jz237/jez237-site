import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASSIC_COURSES,polygonDistance} from '../classic-courses.js';
import {COURSES,getCourse} from '../courses.js';
import {createSourceSunsetCourse} from '../source-sunset-course.js';
import {sunsetAnchors,sunsetPilotAnchors,sunsetNavigation,sunsetStuntNavigation} from '../source-sunset-navigation.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {terrainIdentity,terrainKey,sampleTerrain} from '../terrain-data.js';
import {createTerrainPreparation} from '../terrain-preparation.js';
import {courseWorldKey} from '../course-cache.js';

// Exercise the prepared source definition through real getCourse/createRace.
// Public admission awaits the separate Stunt/scenery checks. Restore the public
// definition after each check; no altered progress or physics is injected.
function install(){
 const source=createSourceSunsetCourse(polygonDistance,{anchorsByClass:sunsetAnchors,pilotAnchorsByClass:sunsetPilotAnchors,
  navigation:sunsetNavigation,stuntNavigation:sunsetStuntNavigation});
 const index=COURSES.findIndex(c=>c.id==='amber'),old=COURSES[index],classic=CLASSIC_COURSES.amber;
 CLASSIC_COURSES.amber=source;
 COURSES[index]={id:'amber',storm:old.storm,sky:old.sky,water:old.water,laps:3,sourceWaterCourseIndex:2,waterModelRevision:2,...source};
 return ()=>{COURSES[index]=old;CLASSIC_COURSES.amber=classic;};
}

test('all four prepared Sunset classes finish three source-judged laps using ordinary helm input and rollers',()=>{
 const restore=install();
 try{for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse('amber',difficulty),difficulty,mode:'time'}),r=s.racers[0];
  for(let i=0;i<27000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);
  assert.equal(s.phase,'results',`class ${difficulty}`);assert.equal(r.lap,4);assert.equal(r.misses,0);assert.equal(r.dq,'');
  assert.ok(r.finishTime>0&&r.lapTimes.length===3);assert.ok(s.raceWater.rollers.every(q=>q.frames===s.raceWater.frames));
 }}finally{restore();}
});

test('race launch selects complete fixed-sphere order, real player shores, and finite ramp/crossbar volumes',()=>{
 const restore=install();
 try{for(const difficulty of [0,1,2,3])for(const mode of ['time','versus','stunt']){
  const s=createRace({course:getCourse('amber',difficulty),difficulty,mode}),c=s.course,two=mode==='versus';
  assert.equal(c.sourceCollisionPlayerCount,two?2:1);assert.equal(c.shoreContacts.edges.length,two?47:63);
  assert.equal(c.sourceMooredCraft.length,two?0:2);
  assert.equal(c.contactVolumes.volumes.filter(v=>v.kind==='crossbar').length,two?0:2);
  assert.equal(c.contactVolumes.volumes.filter(v=>v.kind==='ramp').length,mode==='stunt'?12:6);
  const rows=s.sourceSphereGrid.spheres,visible=rows.filter(q=>!q.hidden),markers=rows.filter(q=>q.sourceBoundaryMarker);
  assert.equal(visible.length,mode==='stunt'||difficulty===0?0:16);assert.equal(markers.length,81);
  assert.equal(rows.filter(q=>q.runtimeTag===5).length,6);assert.deepEqual(rows.map(q=>q.sourceColliderIndex),rows.map((_,i)=>i));
  assert.deepEqual(rows.slice(visible.length,visible.length+81),markers);assert.ok(markers.every(q=>q.hidden&&q.sourceFixedSphere));
  assert.equal(rows.length,visible.length+87);
 }}finally{restore();}
});

test('background worker and cache keep one-player and two-player terrain separate',async()=>{
 const restore=install(),previousSelf=globalThis.self;
 try{
  const one=createRace({course:getCourse('amber'),mode:'time'}).course,two=createRace({course:getCourse('amber'),mode:'versus'}).course;
  assert.notEqual(courseWorldKey(one),courseWorldKey(two));
  assert.notEqual(terrainKey(one),terrainKey(two));assert.equal(terrainIdentity(one).geometryPlayers,1);assert.equal(terrainIdentity(two).geometryPlayers,2);
  let worker,message;const service=createTerrainPreparation({makeWorker:()=>worker={postMessage(q){message=q;},terminate(){}}});
  let output;globalThis.self={postMessage(q){output=q;}};await import('../terrain-worker.js');
  const samples=[];
  for(const c of [one,two]){
   service.prepare(c);assert.equal(message.geometryPlayers,c.sourceCollisionPlayerCount);
   globalThis.self.onmessage({data:message});assert.equal(output.error,undefined);
   const expected=sampleTerrain(c.renderGround);assert.deepEqual(output.heights,expected.heights);assert.deepEqual(output.depth,expected.depth);
   samples.push(output.heights);worker.onmessage({data:output});
  }
  assert.notDeepEqual(samples[0],samples[1]);assert.equal(service.stats.cached,2);
  assert.deepEqual(service.get(one).heights,samples[0]);assert.deepEqual(service.get(two).heights,samples[1]);
 }finally{globalThis.self=previousSelf;restore();}
});
