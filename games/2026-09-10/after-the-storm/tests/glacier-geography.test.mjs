import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
const map=(x,z)=>[(x-205)*.8,(z-280)*.8];
test('Glacier Coast separates the mapped peninsula, western straight and northern coastline',()=>{
 const c=getCourse('glacier',2);
 for(const p of [[120,200],[120,370],[190,120],[100,40]])assert.ok(c.ground(...map(...p))>1,'solid coast '+p);
 for(const p of [[32,270],[220,330],[300,210],[125,460]])assert.ok(c.ground(...map(...p))<-.8,'water '+p);
 assert.equal(c.name,'Glacier Coast');assert.equal(c.rocks.length,10);assert.equal(c.ramps.length,4);
 assert.ok(c.ramps.slice(0,3).every(r=>r.tz===-1));assert.equal(c.ramps[3].tz,1);
 const reverse=getCourse('glacier',3);assert.deepEqual(reverse.ramps,c.ramps,'fixed ramps retain their world direction');
});
test('Expert and Reverse traverse the mapped ice coast without missing generated checkpoints',()=>{
 for(const difficulty of [2,3]){const s=createRace({course:getCourse('glacier',difficulty),difficulty}),r=s.racers[0];for(let i=0;i<20000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,s.course.gates.length*3);}
});
