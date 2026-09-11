import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput,outsideCourse} from '../race-core.js';import {verificationInput} from '../race-verification.js';
test('Drake bounds use the mapped shoreline and include both island channels',()=>{
 for(let d=0;d<4;d++){const c=getCourse('reed',d);assert.equal(c.boundary.length,19);for(const [x,z] of [[200,107],[200,52],[112,78]])assert.equal(outsideCourse(c,(x-200)*.75,(z-240)*.75),false);assert.equal(outsideCourse(c,(410-200)*.75,(170-240)*.75),true);}
});
test('both island passages remain legal through three laps in every class',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const inner of [false,true]){const s=createRace({course:getCourse('reed',difficulty),difficulty}),r=s.racers[0],lapTraversals=new Set();s.verifyDrakeInner=inner;let hits=0,maxOut=0;
 for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,inner?verificationInput(s,r):aiInput(s,r),1/60);const x=r.x/.75+200,z=r.z/.75+240;if(x>168&&x<224&&(inner?z>99&&z<112:z<63)){lapTraversals.add(r.lap);hits+=r.collision>0;}if(inner&&r.drakeInner?.lap===r.lap&&r.drakeInner.stage<8)assert.equal(r.collision,0,'inner passage collision');maxOut=Math.max(maxOut,r.out);}
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,s.course.gates.length*3);assert.deepEqual([...lapTraversals],[1,2,3]);assert.equal(hits,0);assert.equal(maxOut,0);
 }
});
