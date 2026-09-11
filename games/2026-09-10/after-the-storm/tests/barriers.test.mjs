import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';import {barrierCollision,barrierCamera} from '../course-barriers.js';
test('Twilight City wall blocks a surface hull, with finite ends and distinct jump/dive clearances',()=>{
 const c=getCourse('neon',1),b=c.crossbars[0];assert.equal(barrierCollision(c.crossbars,b.x,0,b.z),true);assert.equal(barrierCollision(c.crossbars,b.x,b.top+.01,b.z),false);assert.equal(barrierCollision(c.crossbars,b.x,b.bottom-1.11,b.z),false);
 assert.equal(barrierCollision(c.crossbars,b.x+b.length/2+1,0,b.z),false);assert.equal(barrierCollision(c.crossbars,b.x,0,b.z+b.depth/2+1),false);
});
test('the raised shortcut wall is an actual hull collision in the race solver',()=>{
 const c=getCourse('neon',1),b=c.crossbars[0],s=createRace({mode:'time',course:c}),r=s.racers[0];s.phase='running';r.x=b.x;r.z=b.z;r.hydro.initialized=true;r.hydro.y=0;r.hydro.vy=0;stepRace(s,{throttle:1},1/60);assert.ok(r.collision>0);
});

test('Hard jumps above the city wall and Expert dives below it on every actual race lap',()=>{
 for(const difficulty of [1,2]){const s=createRace({course:getCourse('neon',difficulty),difficulty}),r=s.racers[0],b=s.course.crossbars[0],crossings=[];let hits=0;
  for(let i=0;i<20000&&s.phase!=='results';i++){const z=r.z;stepRace(s,aiInput(s,r),1/60);if(Math.abs(r.z-b.z)<3&&Math.abs(r.x-b.x)<10&&r.collision>0)hits++;if(z>b.z&&r.z<=b.z&&Math.abs(r.x-b.x)<8)crossings.push({y:r.hydro.y,dive:r.hydro.diveRemaining});}
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(hits,0);assert.equal(crossings.length,3);assert.ok(crossings.every(q=>difficulty===1?q.y>b.top:q.y+1.1<b.bottom&&q.dive>0));
 }
});
test('the city outer route remains available without a jump or dive shortcut',()=>{
 const s=createRace({course:getCourse('neon',2),difficulty:2}),r=s.racers[0],outer={...s.course,passage:null};for(let i=0;i<20000&&s.phase!=='results';i++)stepRace(s,aiInput({...s,course:outer},r),1/60);assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.passed,s.course.gates.length*3);
});
test('chase camera stops at the wall, while sight lines above and beneath remain clear',()=>{
 const bars=getCourse('neon',1).crossbars,b=bars[0];for(const y of [-1,3]){const target={x:b.x,y,z:b.z-3},desired={x:b.x,y,z:b.z+7};assert.deepEqual(barrierCamera(bars,target,desired),desired);}
 const target={x:b.x,y:.8,z:b.z-3},desired={x:b.x,y:.8,z:b.z+7},camera=barrierCamera(bars,target,desired);assert.ok(camera.z<b.z-.45);assert.equal(barrierCollision(bars,camera.x,camera.y,camera.z,.25,.25),false);
});
