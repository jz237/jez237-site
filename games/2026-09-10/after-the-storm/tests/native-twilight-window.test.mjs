import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame} from '../player-window-presentation.js';
import {validateOnlineDescriptor} from '../online-race-protocol.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';
import {nativeTwilightRaceScene} from '../source-twilight-race-course.js';
function fixture(difficulty=2){
 const s=createRace({course:getCourse('neon',difficulty),difficulty,mode:'versus',physics:'native'});
 const frame=captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});
 return {s,frame,descriptor:{course:'neon',difficulty,laps:3,seaState:'course',freeRide:false,swapColours:false,waveSeed:s.waveSeed,
  roster:[0,1],names:['A','B','C','D'],nativeSceneCourseIndex:6,nativeSceneMode:'race',initialFrame:frame}};
}
test('online Twilight setup retains selected class, canonical ramps and detached physical rider/water state',async()=>{
 for(const d of [1,2,3]){
  const {s,frame,descriptor}=fixture(d),selected=validateOnlineDescriptor(await decodeOnlinePacket(await encodeOnlinePacket(descriptor)));
  assert.ok(selected);assert.equal(selected.nativeSceneCourseIndex,6);assert.equal(selected.nativeSceneMode,'race');
  const read=readWindowFrame(selected.initialFrame),base=nativeTwilightRaceScene(getCourse(selected.course,selected.difficulty)),scene={...base,...base.geometryForPlayers(2)};
  assert.equal(read.nativeCourseWorld.volumes.length,4);assert.equal(JSON.stringify(read.nativeCourseWorld),JSON.stringify(s.nativeCourseWorld));
  assert.deepEqual(scene.nativeCourseLayout.volumes,s.course.nativeCourseLayout.volumes);assert.equal(scene.rocks.length,d===2?16:10);
  read.nativeCourseWorld.volumes[0].origin[0]+=9;assert.deepEqual(frame.nativeCourseWorld,s.nativeCourseWorld);
 }
});
test('native Twilight rejects Normal and mismatched online course/mode/water descriptors',()=>{
 assert.throws(()=>createRace({course:getCourse('neon',0),difficulty:0,mode:'time',physics:'native'}),/no original Normal/);
 const {descriptor}=fixture();
 for(const patch of [{difficulty:0},{nativeSceneCourseIndex:5},{nativeSceneMode:'stunt'},{course:'port'},{freeRide:true},{seaState:'surf'}])
  assert.equal(validateOnlineDescriptor({...descriptor,...patch}),null);
 const missing=structuredClone(descriptor);delete missing.nativeSceneCourseIndex;delete missing.nativeSceneMode;assert.equal(validateOnlineDescriptor(missing),null);
 // Existing modern Normal remains available with its authored fallback map.
 assert.equal(createRace({course:getCourse('neon',0),difficulty:0,mode:'time'}).physics,'modern');
});
