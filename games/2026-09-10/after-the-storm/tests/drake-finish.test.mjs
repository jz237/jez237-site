import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,adjudicateGate} from '../race-core.js';
test('Drake finish matches the diagram bank-to-bank line in each class',()=>{
 for(let d=0;d<4;d++){const c=getCourse('reed',d),g=c.gates[0],ends=[g.spanMin,g.spanMax].map(v=>(g.x-g.tz*v)/.75+200).sort((a,b)=>a-b);
 assert.deepEqual(ends,d===3?[361,412]:[357,408]);assert.equal(g.z/.75+240,d===3?269:267);assert.equal(Math.abs(g.tx),0);assert.equal(g.tz,d===3?1:-1);assert.equal(g.x,130.5);assert.ok(!c.finishBypass);
 }
});
test('the mapped Drake finish accepts either end of its water span only in the race direction',()=>{
 for(let d=0;d<4;d++)for(const edge of [-1,1])for(const backwards of [false,true]){const c=getCourse('reed',d),g=c.gates[0],s=createRace({course:c,difficulty:d}),r=s.racers[0],lateral=edge<0?g.spanMin+.5:g.spanMax-.5,x=g.x-g.tz*lateral,sign=backwards?-1:1;
 s.phase='running';s.time=240;r.next=0;r.lap=3;r.x=x;r.z=g.z+g.tz*sign;
 assert.equal(adjudicateGate(s,r,x,g.z-g.tz*sign),!backwards);assert.equal(r.misses,0);assert.equal(r.finishTime,backwards?null:240);
 }
});
