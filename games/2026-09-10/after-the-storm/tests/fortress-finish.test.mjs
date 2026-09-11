import test from 'node:test';import assert from 'node:assert/strict';import {getCourse} from '../courses.js';import {createRace,adjudicateGate} from '../race-core.js';
test('Fortress finish follows the mapped horizontal span in both directions',()=>{
 for(let d=0;d<4;d++){const c=getCourse('citadel',d),g=c.gates[0],ends=[g.spanMin,g.spanMax].map(v=>Math.round((g.x-g.tz*v)/.8+210)).sort((a,b)=>a-b);assert.deepEqual(ends,[9,108]);assert.equal(Math.round(g.z/.8+300),272);assert.equal(Math.abs(g.tx),0);assert.equal(g.tz,d===3?1:-1);assert.ok(!c.finishBypass);
 const s=createRace({course:c,difficulty:d}),r=s.racers[0];s.phase='running';s.time=250;r.next=0;r.lap=3;r.x=g.x;r.z=g.z+g.tz;assert.equal(adjudicateGate(s,r,g.x,g.z-g.tz),true);assert.equal(r.finishTime,250);assert.equal(r.misses,0);
 }
});
