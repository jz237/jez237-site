import test from 'node:test';import assert from 'node:assert/strict';
import {circuitSteeringTarget} from '../src/circuit-steering-target';
import {getRaceCourse,courseRoute} from '../src/race-course';import {COURSE_NAMES,type CourseId} from '../src/course-id';
test('road targeting follows the tight Kingswell bend rather than its checkpoint chord',()=>{
 const c=getRaceCourse('kingswell-park-v1');
 for(const reverse of [false,true])for(let i=0;i<20;i++){
  const t=(12+i/20)/24,p=c.point(t),next=reverse?12:13;
  const target=circuitSteeringTarget(c,next,reverse,p,15);
  assert.ok(c.distance(target.x,target.z)<.2);
  assert.ok(Math.hypot(target.x-p.x,target.z-p.z)<20);
 }
});
test('all course gate centers match direction parameterization, including wraparound',()=>{
 for(const id of Object.keys(COURSE_NAMES)as CourseId[]){const c=getRaceCourse(id);
  for(const reverse of [false,true]){const route=courseRoute(c,reverse?'reverse':'forward');
   for(let next=0;next<route.length;next++){const p=route[next],target=circuitSteeringTarget(c,next,reverse,p,15);
    assert.ok(Math.hypot(target.x-p.x,target.z-p.z)<.2,`${id} ${reverse} gate${next}`);
   }
  }
 }
});
