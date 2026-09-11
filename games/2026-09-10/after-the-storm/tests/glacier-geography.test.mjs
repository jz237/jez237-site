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
test('Expert and Reverse traverse the mapped ice coast without missing mapped checkpoints',()=>{
 for(const difficulty of [2,3]){const s=createRace({course:getCourse('glacier',difficulty),difficulty}),r=s.racers[0];for(let i=0;i<24000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,s.course.gates.length*3);}
});

test('Glacier Coast uses the illustrated class-specific buoy sequences and coordinates',()=>{
 const expert=getCourse('glacier',2),reverse=getCourse('glacier',3);
 assert.deepEqual(expert.gates.slice(1).map(g=>g.side),[1,-1,1,1,1,-1,1,-1,1,1,1,-1,1,-1,1,1]);
 assert.deepEqual(reverse.gates.slice(1).map(g=>g.side),[1,-1,1,-1,1,-1,1,1,-1,1,-1,1,1,1,-1]);
 assert.equal(expert.gates.length,17);assert.equal(reverse.gates.length,16);
 assert.deepEqual([expert.gates[1].bx,expert.gates[1].bz],map(27,286));
 assert.deepEqual([reverse.gates[1].bx,reverse.gates[1].bz],map(417-360,537-112));
 for(const c of [expert,reverse])assert.ok(c.gates.every((g,i)=>i===0||g.routeIndex>c.gates[i-1].routeIndex));
});
