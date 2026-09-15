import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,getCourse,routeDistance} from '../courses.js';
import {planVenueDressing} from '../venue-dressing.js';

for(const base of COURSES)test(`${base.name}: scenery stays on dry ground outside race and ramp approaches`,()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const course=getCourse(base.id,difficulty),plan=planVenueDressing(course),floor=course.renderGround||course.ground;
  assert.deepEqual(plan,planVenueDressing(course));
  assert.ok(Object.values(plan).flat().length>10);
  for(const p of Object.values(plan).flat()){
   assert.ok(Number.isFinite(p.scale)&&p.scale>0&&p.scale<=4.5);
   assert.equal(p.y,floor(p.x,p.z));assert.ok(p.y>=.45&&p.y<=45);
   assert.ok(routeDistance(course,p.x,p.z)>=15);
   for(const r of course.ramps)assert.ok(Math.hypot(p.x-r.x,p.z-r.z)>=Math.max(r.width,r.length)*.8+5);
  }
  assert.ok(plan.rocks.length<=300&&plan.plants.length<=320&&plan.logs.length<=18&&plan.reeds.length<=110&&plan.bollards.length<=48&&plan.lamps.length<=12);
  if(['port','city'].includes(course.theme)){assert.equal(plan.plants.length+plan.rocks.length+plan.reeds.length,0);assert.ok(plan.lamps.length>0);}
  if(course.theme==='ice')assert.equal(plan.plants.length+plan.logs.length+plan.reeds.length,0);
  if(course.theme!=='lake')assert.equal(plan.reeds.length,0);
 }
});
