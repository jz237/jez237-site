import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace} from '../race-core.js';
import {mooredBoatPose,mooredBoatCollision,mooredBoatOutline,mooredBoatCamera} from '../moored-boats.js';
test('Sunset launches occupy the two mapped pier ends in every class',()=>{
 for(let d=0;d<4;d++){const c=getCourse('amber',d);assert.equal(c.mooredBoats.length,2);assert.deepEqual(c.mooredBoats.map(b=>[b.x/.75+245,b.z/.75+275]),[[90,146],[93,299]]);
  c.mooredBoats.forEach((b,i)=>{assert.ok(c.ground(b.x,b.z)<-1);assert.ok(Math.abs(b.z-c.crossbars[i].z)<2);assert.ok(Math.abs(b.x+b.width/2-(c.crossbars[i].x-c.crossbars[i].length/2))<4);assert.equal(mooredBoatOutline(b).length,7);});
 }
});
test('moored hull and cabin contacts follow the same finite wave pose',()=>{
 const c=getCourse('amber');createRace({course:c});const b=c.mooredBoats[0],p=mooredBoatPose(b,10,.22),q=mooredBoatPose(b,15,.22);assert.ok(Math.abs(p.y-q.y)>.01);assert.ok(Number.isFinite(p.pitch)&&Number.isFinite(p.roll));
 assert.equal(mooredBoatCollision([b],b.x,p.y,b.z,10,.22),true);assert.equal(mooredBoatCollision([b],b.x,p.y+1.2,b.z,10,.22),true);
 assert.equal(mooredBoatCollision([b],b.x,p.y+5,b.z,10,.22),false);assert.equal(mooredBoatCollision([b],b.x,p.y-5,b.z,10,.22),false);assert.equal(mooredBoatCollision([b],b.x+8,p.y,b.z,10,.22),false);
});
test('a surface approach actually strikes the moored hull and can reverse away',()=>{
 const c=getCourse('amber'),s=createRace({mode:'time',course:c}),r=s.racers[0],b=c.mooredBoats[0];s.phase='running';r.x=b.x+7;r.z=b.z;r.heading=-Math.PI/2;let hit=false;
 for(let i=0;i<240&&!hit;i++){stepRace(s,{throttle:1,dampen:true},1/60);hit=r.collision>0;}assert.ok(hit);const distance=Math.abs(r.x-b.x);
 for(let i=0;i<240;i++)stepRace(s,{throttle:-1,dampen:true},1/60);assert.ok(Math.abs(r.x-b.x)>distance+2);
});

test('camera stops before a moored cabin and retains a clear sight line above it',()=>{
 const c=getCourse('amber');createRace({course:c});const b=c.mooredBoats[0],y=mooredBoatPose(b,0,.22).y+1;
 const target={x:b.x+7,y,z:b.z},desired={x:b.x-7,y,z:b.z};const stopped=mooredBoatCamera([b],target,desired,0,.22);assert.ok(stopped.x>b.x);assert.equal(mooredBoatCollision([b],stopped.x,stopped.y,stopped.z,0,.22,.25,.25),false);
 assert.deepEqual(mooredBoatCamera([b],{...target,y:y+5},{...desired,y:y+5},0,.22),{...desired,y:y+5});
});
