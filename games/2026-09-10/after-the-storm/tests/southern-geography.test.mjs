import {recoverToWater} from '../shore-recovery.js';
import {waterLevel} from '../simulation.js';
import {barrierCollision,barrierPiles} from '../course-barriers.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const map=(x,z)=>[(x-210)*.8,(z-325)*.8];
test('Southern Island has separate eastern land and western islet with open water between',()=>{
 const c=getCourse('tempest');assert.equal(c.name,'Southern Island');for(const p of [[117,287],[318,130],[320,510]])assert.ok(c.ground(...map(...p))>1);for(const p of [[210,300],[57,287],[399,422]])assert.ok(c.ground(...map(...p))< -1.5);assert.equal(c.crossbars.length,5);
});
test('the falling tide opens a physical passage beneath the southern pier',()=>{
 function cross(time){const s=createRace({mode:'time',course:getCourse('tempest'),seaState:'calm'}),r=s.racers[0];s.phase='running';s.time=time;[r.x,r.z]=map(250,515);r.heading=0;r.vx=0;r.vz=10;r.speed=10;let hit=false;for(let i=0;i<120;i++){stepRace(s,{throttle:.5},1/60);hit ||=r.collision>0;}return {r,hit};}
 const high=cross(0),low=cross(160);assert.equal(high.hit,true);assert.equal(low.hit,false);assert.ok(low.r.z>map(250,533)[1]);
});
test('Normal Expert and Reverse complete the outer tide-safe route without misses',()=>{
 for(const difficulty of [0,2,3]){const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);}
});

test('pier piles stay solid below the deck while wide gaps remain navigable',()=>{
 const c=getCourse('tempest'),pier=c.crossbars[2],piles=barrierPiles(pier),p=piles[8];assert.ok(piles.length>10);assert.equal(barrierCollision([pier],p.x,-1,p.z),true);
 const next=piles[10],x=(p.x+next.x)/2,z=(p.z+next.z)/2;assert.equal(barrierCollision([pier],x,-1,z),false);
});
test('central timber platform has polygon collision and terrain below its deck',()=>{
 const c=getCourse('tempest'),p=c.crossbars.at(-1),[x,z]=map(316,355);assert.ok(c.ground(x,z)<p.bottom);assert.equal(barrierCollision([p],x,.7,z),true);assert.equal(barrierCollision([p],x,p.top+.01,z),false);
});

test('rescue rejects a saved point obstructed by a deck or supporting pile',()=>{
 const s=createRace({course:getCourse('tempest')}),r=s.racers[0],p=barrierPiles(s.course.crossbars[2])[8];r.x=p.x;r.z=p.z;r.lastWater={x:p.x,z:p.z,heading:0};assert.ok(recoverToWater(s,r));assert.equal(barrierCollision(s.course.crossbars,r.x,waterLevel.value,r.z),false);assert.ok(Math.hypot(r.x-p.x,r.z-p.z)>1);
});
