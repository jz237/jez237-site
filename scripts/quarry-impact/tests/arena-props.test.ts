import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {createArenaProps,ARENA_PROP_SPOTS,arenaPropCount} from '../src/arena-props';
import {quarryReplayProps} from '../src/quarry-tyres';
import {ONLINE_ARENA_IDS} from '../src/online-events';
await R.init();
test('loose arena props stand still until struck, fly when hit, and reset for the next event',()=>{
 for(const [arena,spots] of Object.entries(ARENA_PROP_SPOTS)){
  const online=ONLINE_ARENA_IDS.includes(arena as never);
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));
  const root=new T.Group(),loose=createArenaProps(R,world,root,spots);
  try{
   assert.equal(loose.props.length,arenaPropCount(arena),arena+' recorded prop count');
   for(let i=0;i<180;i++)world.step();loose.update();
   const drift=Math.max(...loose.props.map(p=>p.mesh.position.distanceTo(p.start)));assert.ok(drift<.08,`${arena} props settle in place (${drift.toFixed(3)} m)`);
   const first=loose.props[0];first.body.applyImpulse({x:first.body.mass()*12,y:first.body.mass()*2,z:0},true);for(let i=0;i<60;i++)world.step();loose.update();
   assert.ok(first.mesh.position.distanceTo(first.start)>3,arena+' a struck prop flies');
   loose.reset();loose.update();const worstReset=Math.max(...loose.props.map(p=>p.mesh.position.distanceTo(p.start)));assert.ok(worstReset<1e-4,arena+' reset '+worstReset);
   if(online){loose.reset(false);assert.ok(loose.props.every(p=>!p.mesh.visible&&!p.body.isEnabled()),arena+' online events switch props off');loose.reset(true);assert.ok(loose.props.every(p=>p.mesh.visible&&p.body.isEnabled()));}
  }finally{loose.dispose();world.free();}
 }
 assert.equal(arenaPropCount('quarry-arena-v1'),0,'the Quarry keeps its own barrels and tyres');assert.equal(arenaPropCount(undefined),0);
});
test('replays recorded before an arena had loose props still load with none',()=>{
 assert.deepEqual(quarryReplayProps([1,2,3],0),[]);assert.deepEqual(quarryReplayProps([1,2,3],3),[1,2,3]);assert.throws(()=>quarryReplayProps([1,2,3],2));
});
test('circuit corner props sit in real run-off: off the road, inside the barriers, on the ground',async()=>{
 const {courseCornerSpots,RUNOFF}=await import('../src/arena-props');const {getRaceCourse}=await import('../src/race-course');const {COURSE_NAMES}=await import('../src/course-id');
 let total=0,courses=0;
 for(const id of Object.keys(COURSE_NAMES)){
  if(id==='quarry-v1')continue;const course=getRaceCourse(id as never);if(!course.buildPhysics)continue;
  const world=new R.World({x:0,y:-9.81,z:0});
  try{course.buildPhysics(R,world);const spots=courseCornerSpots(R,world,course);total+=spots.length;if(spots.length)courses++;
   for(const s of spots){const d=course.distance(s.x,s.z);assert.ok(d>=course.halfWidth+RUNOFF-1.6-.01,`${id} spot clear of the road (${d.toFixed(1)} m)`);assert.ok(!course.outside(s.x,course.height(s.x,s.z),s.z),id+' inside the venue');}
   assert.ok(spots.length<=6);
  }finally{world.free();}
 }
 console.log('corner stacks',total,'on',courses,'circuits');assert.ok(courses>=5,'several circuits have room for corner props');
});
