import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const map=(x,z)=>[(x-210)*.8,(z-325)*.8];
test('Southern Island has separate eastern land and western islet with open water between',()=>{
 const c=getCourse('tempest');assert.equal(c.name,'Southern Island');for(const p of [[117,287],[318,130],[320,510]])assert.ok(c.ground(...map(...p))>1);for(const p of [[210,300],[57,287],[399,422]])assert.ok(c.ground(...map(...p))< -1.5);assert.equal(c.crossbars.length,4);
});
test('the falling tide opens a physical passage beneath the southern pier',()=>{
 function cross(time){const s=createRace({mode:'time',course:getCourse('tempest'),seaState:'calm'}),r=s.racers[0];s.phase='running';s.time=time;[r.x,r.z]=map(250,515);r.heading=0;r.vx=0;r.vz=10;r.speed=10;let hit=false;for(let i=0;i<120;i++){stepRace(s,{throttle:.5},1/60);hit ||=r.collision>0;}return {r,hit};}
 const high=cross(0),low=cross(160);assert.equal(high.hit,true);assert.equal(low.hit,false);assert.ok(low.r.z>map(250,533)[1]);
});
test('Normal Expert and Reverse complete the outer tide-safe route without misses',()=>{
 for(const difficulty of [0,2,3]){const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);}
});
