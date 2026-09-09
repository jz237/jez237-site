import test from 'node:test';
import assert from 'node:assert/strict';
import {separateFish} from '../lib/aquarium/FishCollisions.ts';
test('head-on and coincident bodies separate without nonfinite coordinates',()=>{
 for(const offset of [0,20,49]){
  const bodies=[{id:0,x:900,y:350,z:.5,radius:28},{id:1,x:900+offset,y:350,z:.5,radius:24}];
  separateFish(bodies);const [a,b]=bodies;
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y,(a.z-b.z)*180)>=51.99);
 }
});
test('fish crossing in projection at different depths remain unimpeded',()=>{
 const bodies=[{id:0,x:900,y:350,z:.2,radius:24},{id:1,x:900,y:350,z:.8,radius:24}],before=structuredClone(bodies);separateFish(bodies);assert.deepEqual(bodies,before);
});
