import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';

test('native championship reuses the ordinary object and decoration displays on every cup course',()=>{
 for(const [id,difficulty]of [['greyhaven',0],['amber',0],['reed',0],['citadel',0],['port',0],['tempest',0],['neon',1],['glacier',2]]){
  const s=createRace({mode:'championship',physics:'native',course:getCourse(id,difficulty),difficulty});
  assert.equal(s.nativeLaunch.snapshot().scene.mode620,4,id);assert.equal(s.racers.length,4);
  if(s.nativeCourseDisplay)assert.deepEqual(s.nativeCourseWorld,s.nativeCourseDisplay.snapshot(),id);
  for(let i=0;i<20;i++)stepRace(s,{throttle:1},1/30);
  assert.ok(s.nativeHost.world.frames>0,id);
 }
 assert.throws(()=>createRace({mode:'stunt',physics:'native',course:getCourse('greyhaven'),nativeSceneEffects:{onDisplay(){}}}),/Separate scene effects/);
});
