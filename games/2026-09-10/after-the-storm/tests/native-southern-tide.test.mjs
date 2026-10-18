import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeCourseDatumAfterPhysics} from '../native-course-datum.js';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createRace,raceWeather,stepRace} from '../race-core.js';
import {createNativeRaceHost,stepNativeRaceHost} from '../native-race-host.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-southern-tide.json',import.meta.url),'utf8'));

test('tide gate and signed thresholds match2160 original51238 block executions',()=>{
 assert.equal(fixture.cases.length,2160);
 for(const q of fixture.cases)assert.equal(nativeCourseDatumAfterPhysics(q.input.datumNative,q.input),q.output,JSON.stringify(q.input));
});

test('native tide reads the canonical shared stage without mutating progress or using displayed laps',()=>{
 for(const players of [1,2]){
  const course=getCourse('tempest'),courseRuntime=createNativeRaceCourseRuntime({course,difficulty:0,players});
  const racers=Array.from({length:players},(_,id)=>({id,lap:0,grid:id,power:0,misses:0}));
  const args={racers,course,courseRuntime,courseIndex:7,players};
  const initialState=createNativeRaceLaunchRuntime(args).snapshot();
  Object.assign(initialState.scene,{main638:1,simulation648:1});
  for(const stage of [0,1,2,3]){
   initialState.raceWords1f94[(0x1fcc-0x1f94)/4]=stage;
   const owner=createNativeRaceLaunchRuntime({...args,initialState});
   racers.forEach(r=>r.lap=99);
   const before=owner.snapshot();
   let datum=0;for(let frame=0;frame<200;frame++)datum=owner.waterDatumAfterPhysics(datum);
   assert.equal(datum,stage===1?-100:stage===2?-150:0);assert.deepEqual(owner.snapshot(),before);
  }
 }
});

test('native weather and render updates observe the field and cannot restore an old course datum',()=>{
 const s=createRace({course:getCourse('greyhaven'),mode:'time',physics:'native'});
 s.courseDatum={value:0};s.raceWater.field.datumNative=-100;
 assert.equal(raceWeather(s).seaLevel,-2.5);
 stepRace(s,{},1/30);stepRace(s,{},1/30);
 assert.equal(s.raceWater.field.datumNative,-100);assert.equal(s.courseDatum.value,-2.5);assert.equal(s.weather.seaLevel,-2.5);
});

test('prepared Southern host owns falling tide in solo and versus, with paused and inactive holds',()=>{
 for(const players of [1,2])for(const simulation of [0,1])for(const activity of [-1,0]){
  const s=createRace({course:getCourse('tempest'),mode:players===2?'versus':'time'});
  const courseRuntime=createNativeRaceCourseRuntime({course:s.course,difficulty:0,players});
  const course={...s.course,sourceBuoyLayout:courseRuntime.sourceBuoyLayout};
  const args={racers:s.racers,course,courseRuntime,courseIndex:7,players};
  const initialState=createNativeRaceLaunchRuntime(args).snapshot();
  Object.assign(initialState.scene,{main638:1,phase650:3,simulation648:simulation,activity624:activity});
  initialState.raceWords1f94[(0x1fcc-0x1f94)/4]=1;
  const raceRuntime=createNativeRaceLaunchRuntime({...args,initialState});
  const host=createNativeRaceHost({racers:s.racers,course,water:s.raceWater,raceRuntime,staticGeometry:courseRuntime.staticContactGeometry,fixedSphereGrid:s.sourceSphereGrid});
  const input=s.racers.map(()=>({}));
  stepNativeRaceHost(host,.04,input,{waterOptions:{datumNative:999}});
  assert.equal(s.raceWater.field.datumNative,0);
  stepNativeRaceHost(host,1,input,{active:false});assert.equal(s.raceWater.field.datumNative,0);
  stepNativeRaceHost(host,.01,input,{waterOptions:{datumNative:999}});
  assert.equal(s.raceWater.field.datumNative,simulation?-1:0);
  stepNativeRaceHost(host,.95,input,{waterOptions:{datumNative:999}});
  assert.equal(host.world.frames,20);assert.equal(s.raceWater.field.datumNative,simulation?-20:0);
  assert.equal(host.world.ticks,simulation?100:0);
  s.raceWater.field.datumNative=-40;stepNativeRaceHost(host,.05,input);
  for(const sphere of host.objects.fixedSnapshot())
   assert.equal(sphere.position.y,sphere.runtimeTag===5?-1.25:activity===-1?(simulation?-41:-40)*.025:0);
 }
});
