import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame} from '../player-window-presentation.js';
import {validateOnlineDescriptor} from '../online-race-protocol.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';
import {nativeDrakeRaceScene} from '../source-drake-course.js';
function fixture(){
 const s=createRace({course:getCourse('reed',2),difficulty:2,mode:'versus',physics:'native'});
 const frame=captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});
 return {s,frame,descriptor:{course:'reed',difficulty:2,laps:3,seaState:'course',freeRide:false,swapColours:false,waveSeed:s.waveSeed,
  roster:[0,1],names:['A','B','C','D'],nativeSceneCourseIndex:4,nativeSceneMode:'race',initialFrame:frame}};
}
test('online Drake setup retains the native scene and all48 detached canonical reeds',async()=>{
 const {s,frame,descriptor}=fixture(),decoded=await decodeOnlinePacket(await encodeOnlinePacket(descriptor));
 const selected=validateOnlineDescriptor(decoded);assert.ok(selected);assert.equal(selected.nativeSceneCourseIndex,4);assert.equal(selected.nativeSceneMode,'race');
 const read=readWindowFrame(selected.initialFrame),scene=nativeDrakeRaceScene(getCourse(selected.course,selected.difficulty));
 assert.equal(read.nativeCourseWorld.decorations.length,48);
 assert.deepEqual(read.nativeCourseWorld,s.nativeCourseWorld);
 assert.deepEqual(scene.nativeCourseLayout,s.course.nativeCourseLayout);
 read.nativeCourseWorld.decorations[0].position[0]+=9;
 assert.deepEqual(frame.nativeCourseWorld,s.nativeCourseWorld);
});
test('window interpolation preserves discrete reed visibility and always returns detached values',()=>{
 const {frame}=fixture(),a=readWindowFrame(frame),b=readWindowFrame(frame);a.time=1;b.time=2;
 b.nativeCourseWorld.decorations[0].visible=false;
 for(const [time,visible] of [[1,true],[1.5,true],[2,false]]){
  const out=interpolateWindowFrame(a,b,time);assert.equal(out.nativeCourseWorld.decorations[0].visible,visible);
  out.nativeCourseWorld.decorations[0].position[0]=999;
  assert.notEqual(a.nativeCourseWorld.decorations[0].position[0],999);assert.notEqual(b.nativeCourseWorld.decorations[0].position[0],999);
 }
 const paused={...b,phase:'paused'},out=interpolateWindowFrame(a,paused,2);out.nativeCourseWorld.decorations[0].position[0]=999;
 assert.notEqual(paused.nativeCourseWorld.decorations[0].position[0],999);
});
test('malformed online selection or decoration packets cannot switch to mismatched geometry',()=>{
 const {descriptor,frame}=fixture();
 for(const patch of [{nativeSceneCourseIndex:3},{nativeSceneMode:'stunt'},{course:'amber'},{freeRide:true},{seaState:'surf'}])
  assert.equal(validateOnlineDescriptor({...descriptor,...patch}),null);
 const missing=structuredClone(descriptor);delete missing.nativeSceneCourseIndex;delete missing.nativeSceneMode;assert.equal(validateOnlineDescriptor(missing),null);
 for(const mutate of [f=>f.nativeCourseWorld=undefined,f=>f.nativeCourseWorld.decorations[0].position[0]=Infinity,
  f=>f.nativeCourseWorld.decorations.push(structuredClone(f.nativeCourseWorld.decorations[0])),f=>f.nativeCourseWorld.decorations[0].visible=1]){
  const q=structuredClone(frame);mutate(q);assert.equal(readWindowFrame(q),null);
 }
});
