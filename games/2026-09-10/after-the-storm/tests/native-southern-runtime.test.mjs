import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {createNativeRacePilot} from '../native-race-pilot.js';

test('Southern native preview selects original geometry and player mode in all four classes',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const mode of ['time','versus']){
  const s=createRace({course:getCourse('tempest',difficulty),difficulty,mode,physics:'native'});
  const scene=s.nativeLaunch.snapshot().scene;
  assert.equal(scene.courseIndex,7);assert.equal(scene.mode620,mode==='versus'?1:0);
  assert.equal(s.nativeHost.raceRuntime,s.nativeLaunch);assert.equal(s.raceWater.field.datumNative,0);
  assert.equal(s.sourceSphereGrid,null);assert.equal(s.nativeHost.objects.fixedSnapshot().length,mode==='versus'?105:107);
 }
 assert.equal(createRace({course:getCourse('tempest'),mode:'stunt',physics:'native'}).nativeLaunch.snapshot().scene.mode620,11);
 for(const options of [{mode:'race'},{mode:'practice'},{mode:'time',seaState:'surf'}])
  assert.throws(()=>createRace({course:getCourse('tempest'),physics:'native',...options}),/source-water/);
});

test('Southern ordinary-input inspection clears the ship and completes three laps through both tide stages',()=>{
 const course=getCourse('tempest'),original=structuredClone(course.anchors);
 const s=createRace({course,mode:'time',physics:'native'}),pilot=createNativeRacePilot({course:s.course});
 const levels=new Set();
 for(let frame=0;frame<6000&&!['postrace','results'].includes(s.phase);frame++){
  stepRace(s,()=>pilot.input(s),1/30);levels.add(s.raceWater.field.datumNative);
 }
 assert.equal(s.phase,'postrace');assert.equal(s.racers[0].lapTimes.length,3);
 assert.equal(s.racers[0].misses,0);assert.equal(s.racers[0].dq,'');
 assert.ok(s.racers[0].finishTime<150);assert.ok(levels.has(-100));assert.ok(levels.has(-150));
 assert.equal(s.courseDatum.value,-3.75);assert.deepEqual(course.anchors,original);
});
