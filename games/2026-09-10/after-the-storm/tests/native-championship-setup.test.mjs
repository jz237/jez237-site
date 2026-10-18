import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeChampionshipLaunch,NATIVE_CHAMPIONSHIP_SETUP_DATA as data} from '../native-championship-setup.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {nativeRaceScene} from '../native-race-scene.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-championship-setup.json',import.meta.url),'utf8'));
const ids=['practice','greyhaven','amber','citadel','reed','port','neon','tempest','glacier'],cache=new Map();
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
function course(index,difficulty){const key=index+':'+difficulty;if(!cache.has(key))cache.set(key,createNativeRaceCourseRuntime({
 course:nativeRaceScene(getCourse(ids[index],difficulty)),difficulty,players:1,raceMode:'championship'}));return cache.get(key);}
function initial(c){
 const s=structuredClone(seed);s.profileWordsB330[2]=Math.min(c.difficulty,2);
 Object.assign(s.scene,{courseIndex:c.courseIndex,mode608:4,pendingPlayers60c:1,participantCount60e:4,field61c:0,
  primaryHumanIndex:c.primaryHumanIndex,variant6f4:0,metadataCb32c:Number(c.custom),metadataD9b0:c.avatarsBySlot[c.primaryHumanIndex],
  configuredLaps728:c.retainedLaps,restart6f8:c.restart,reverseDab68:Number(c.difficulty===3),cold8224:1});
 for(const [i,row]of fixture.customRiderTraits.entries())for(const [j,value]of row.entries()){
  const byte=24+i*14+11+j,word=byte>>>2,shift=(3-(byte&3))*8;
  s.saveWordsB280[word]=((s.saveWordsB280[word]&~(255<<shift))|(value<<shift))>>>0;
 }
 return s;
}

test('championship startup defaults match original boot, wave, rider and fade data',()=>{
 assert.deepEqual(data,fixture.data);assert.ok(Object.isFrozen(data.courseRiderTraits[0][0]));
 assert.deepEqual(data.waveRowsByClass,[[0,5,3],[0,5,3],[0,5,3]]);
});

test('248 original main-configuration cases select3968 exact physical profile words across courses, classes and human slots',()=>{
 let compared=0;
 for(const c of fixture.cases){
  const runtime=course(c.courseIndex,c.difficulty),input=initial(c),before=structuredClone(input);
  const p=prepareNativeChampionshipLaunch(input,{courseRuntime:runtime,avatarsBySlot:c.avatarsBySlot});
  assert.deepEqual(p.bodyProfiles.map(q=>[q.riderIndex,q.tuneB6c,q.tuneB70,q.tuneB74]),c.expected.bodyTuneWords);compared+=16;
  for(const key of ['phase650','simulation648','wave49b0','configuredLaps728','missLimit8174','mode620','racerCount','players'])assert.equal(p.state.scene[key],c.expected[key],key);
  assert.deepEqual(p.state.profileWordsB330.slice(50),[0,0]);
  assert.deepEqual(p.hullStarts.map(q=>q.computerProfile),[0,1,2,3].map(i=>i!==c.primaryHumanIndex));
  assert.ok(p.hullStarts.every(q=>q.grid.transform.complete&&Object.values(q.prepared.centerNative).every(Number.isFinite)));
  assert.equal(new Set(p.hullStarts.map(q=>JSON.stringify(q.grid.decoded.positionNative))).size,4);
  assert.equal(p.state.scene.primaryCount,runtime.data.nodes.length);assert.equal(p.state.scene.finishSourceRow,runtime.data.finishSourceRow);
  assert.deepEqual(p.state.objectWordsC940,runtime.objectStartup.storage.objectWordsC940);
  assert.deepEqual(p.state.fixedSphereWordsB138,runtime.objectStartup.storage.fixedSphereWordsB138);
  assert.deepEqual(input,before);assert.equal(Object.isFrozen(input),false);
  assert.ok(Object.isFrozen(p.state));assert.ok(Object.isFrozen(p.bodyProfiles[0]));
 }
 assert.equal(compared,3968);
});

test('four-rider setup retains resource/audio dependencies and refuses premature live AI admission',()=>{
 const c=fixture.cases[0],runtime=course(c.courseIndex,c.difficulty),p=prepareNativeChampionshipLaunch(initial(c),{courseRuntime:runtime,avatarsBySlot:c.avatarsBySlot});
 assert.deepEqual(p.pendingEffects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
 assert.equal(p.pendingEffects.some(o=>o.kind==='bodyTuneWordWrite'),false);
 assert.equal(p.diagnostic.liveAIAdmitted,false);assert.equal(p.diagnostic.physicalWorldCreated,false);
 assert.throws(()=>createNativeRaceLaunchRuntime({courseRuntime:runtime}),/remains prepared/);
 assert.throws(()=>createRace({mode:'championship',physics:'native',course:getCourse('greyhaven')}),/verified course/);
});

test('prepared mode4 objects remain the exact ordinary selection and invalid physical setup rejects atomically',()=>{
 for(let index=1;index<=8;index++){
  const difficulty=index===6?1:0,selected=nativeRaceScene(getCourse(ids[index],difficulty));
  const ordinary=createNativeRaceCourseRuntime({course:selected,difficulty,players:1}),championship=course(index,difficulty);
  assert.deepEqual(championship.objectStartup,ordinary.objectStartup);assert.deepEqual(championship.data,ordinary.data);
 }
 const c=fixture.cases[0],runtime=course(c.courseIndex,c.difficulty),input=initial(c),before=structuredClone(input);
 for(const scene of [{pendingPlayers60c:2},{participantCount60e:3},{mode608:0},{courseIndex:2},{reverseDab68:1}])
  assert.throws(()=>prepareNativeChampionshipLaunch({...input,scene:{...input.scene,...scene}},{courseRuntime:runtime,avatarsBySlot:c.avatarsBySlot}),/selection must match/);
 assert.throws(()=>prepareNativeChampionshipLaunch(input,{courseRuntime:runtime,avatarsBySlot:[0,0,2,3]}),/four selected/);
 const invalid=structuredClone(input);invalid.scene.metadataCb32c=1;invalid.saveWordsB280.fill(0xffffffff);
 assert.throws(()=>prepareNativeChampionshipLaunch(invalid,{courseRuntime:runtime,avatarsBySlot:c.avatarsBySlot}),/tuning indices/);
 for(const patch of [{players:2},{course:getCourse('practice')},{objectLayout:'authored'}])
  assert.throws(()=>createNativeRaceCourseRuntime({course:getCourse('greyhaven'),difficulty:0,players:1,raceMode:'championship',...patch}),/Prepared championship/);
 assert.deepEqual(input,before);
});
