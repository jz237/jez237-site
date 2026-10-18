import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeRaceScene} from '../native-race-scene.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativeChampionshipWebLaunch,NATIVE_CHAMPIONSHIP_SETUP_DATA} from '../native-championship-setup.js';
import {captureNativeRecordSession} from '../native-record-session.js';

function selected({id='greyhaven',difficulty=0,rider=0}={}){
 const course=getCourse(id,difficulty),racers=createRace({mode:'championship',course,difficulty,rider}).racers;
 const courseRuntime=createNativeRaceCourseRuntime({course:nativeRaceScene(course),difficulty,players:1,raceMode:'championship'});
 return {racers,courseRuntime};
}
const byte=(words,offset)=>(words[offset>>>2]>>>((3-(offset&3))*8))&255;

test('fresh championship selection uses chosen avatars and saved custom settings without constructing a solo launch',()=>{
 for(const rider of [0,1,2,3])for(const mode of ['normal','custom']){
  const q=selected({rider}),before=structuredClone(q.racers),p=prepareNativeChampionshipWebLaunch({...q,rngSeed:77,
   tunes:[{tuneB6c:1,tuneB70:7,tuneB74:11}],tuneModes:[mode]});
  assert.deepEqual(p.bodyProfiles.map(r=>r.riderIndex),q.racers.map(r=>r.id));
  const human=p.bodyProfiles[0];assert.deepEqual([human.tuneB6c,human.tuneB70,human.tuneB74],mode==='normal'?[5,5,5]:[1,7,11]);
  for(let i=1;i<4;i++){
   const cpu=p.bodyProfiles[i];assert.deepEqual([cpu.tuneB6c,cpu.tuneB70,cpu.tuneB74],NATIVE_CHAMPIONSHIP_SETUP_DATA.courseRiderTraits[1][cpu.riderIndex]);
  }
  assert.deepEqual([0,1,2].map(i=>byte(p.state.saveWordsB280,24+rider*14+11+i)),[1,7,11]);
  assert.equal(p.state.scene.metadataCb32c,Number(mode==='custom'));assert.equal(p.state.scene.rngState4640,77);
  assert.ok(p.state.aiWords3c60.every(v=>v===0),'AI initialization belongs to the later physical host');
  assert.equal(p.state.graphicsCorners.renderBufferIndex,1);
  assert.deepEqual(q.racers,before);assert.ok(Object.isFrozen(p.state));
 }
});

test('fresh selection carries each supported course/class into its own prepared physical and resource handoff',()=>{
 for(const [id,difficulty]of [['greyhaven',0],['amber',1],['citadel',2],['reed',3],['port',0],['neon',1],['tempest',2],['glacier',3]]){
  const q=selected({id,difficulty}),p=prepareNativeChampionshipWebLaunch(q),g=p.state.scene;
  assert.equal(g.mode620,4);assert.equal(g.courseIndex,q.courseRuntime.courseIndex);assert.equal(g.players,1);assert.equal(g.racerCount,4);
  assert.equal(g.phase650,0);assert.equal(g.simulation648,1);assert.equal(g.reverseDab68,Number(difficulty===3));
  assert.equal(p.state.profileWordsB330[2],Math.min(difficulty,2));
  assert.equal(p.state.profileWordsB330[0],q.courseRuntime.courseIndex,'race result must not take the Dolphin warmup branch');
  assert.equal(p.state.profileWordsB330[1],NATIVE_CHAMPIONSHIP_SETUP_DATA.courseOrderAc14[Math.min(difficulty,2)].indexOf(q.courseRuntime.courseIndex));
  const effects=p.pendingEffects.filter(o=>o.kind==='externalCall');
  assert.deepEqual(effects.map(o=>o.consumer),['80096960','8009684c','800c21f4']);
  assert.deepEqual(effects[2].arguments,[7,q.courseRuntime.courseIndex]);
  assert.ok(p.hullStarts.every(s=>s.grid.transform.complete));
 }
});

test('record transport precedes championship reset and selected tuning, with no mutation of the retained session',()=>{
 const q=selected({rider:2}),old=prepareNativeChampionshipWebLaunch(q),session=structuredClone(captureNativeRecordSession(old.state));
 session.cold8224=0;session.recordSetupWords1ff0[0]=12345;session.saveWordsB280[6]=0x41424300;
 const before=structuredClone(session),p=prepareNativeChampionshipWebLaunch({...q,recordSession:session,
  tunes:[{tuneB6c:2,tuneB70:3,tuneB74:4}],tuneModes:['custom']});
 assert.equal(p.state.raceWords1f94[(0x1ff0-0x1f94)/4],12345);
 assert.equal(p.state.saveWordsB280[6],0x41424300);
 assert.deepEqual([0,1,2].map(i=>byte(p.state.saveWordsB280,24+2*14+11+i)),[2,3,4]);
 assert.deepEqual(session,before);
 assert.throws(()=>prepareNativeChampionshipWebLaunch({...q,recordSession:{...session,version:0}}),/Unsupported native record session/);
 assert.deepEqual(session,before);
});

test('invalid fresh selection cannot partially overwrite caller racers or tune banks',()=>{
 const q=selected(),tunes=[{tuneB6c:4,tuneB70:5,tuneB74:6}],before=structuredClone({racers:q.racers,tunes});
 for(const patch of [{racers:q.racers.slice(0,3)},{racers:q.racers.map(r=>({...r,human:true}))},
  {courseRuntime:{...q.courseRuntime,mode620:0}},{rngSeed:-1},{tuneModes:['invalid']},{tunes:[{tuneB6c:12}]}])
  assert.throws(()=>prepareNativeChampionshipWebLaunch({...q,tunes,...patch}));
 assert.deepEqual({racers:q.racers,tunes},before);
 assert.throws(()=>prepareNativeChampionshipWebLaunch(selected({id:'glacier',difficulty:0})),/does not belong/);
});
