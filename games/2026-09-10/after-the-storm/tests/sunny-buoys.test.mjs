import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const pixel=g=>[Math.round(g.bx/.75+168),Math.round(g.bz/.75+250),g.side];
test('Sunny Beach preserves source buoy counts, colors and forward progression',()=>{
 for(let d=0;d<4;d++){
  const c=getCourse('greyhaven',d),g=c.gates.slice(1);
  assert.equal(g.length,d===3?11:13);
  assert.equal(g.map(g=>g.side===1?'R':'L').join(''),d===3?'RLLRLRLRLRL':'LRLLRLRLRLLLR');
  for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);
 }
 assert.deepEqual(pixel(getCourse('greyhaven',0).gates[5]),[142,126,1]);
 assert.deepEqual(pixel(getCourse('greyhaven',1).gates[5]),[132,126,1]);
 assert.deepEqual(pixel(getCourse('greyhaven',2).gates[12]),[215,435,-1]);
 assert.deepEqual(pixel(getCourse('greyhaven',3).gates[10]),[195,84,1]);
});
test('Sunny Beach metal barriers match each class and remain separate from buoy progress',()=>{
 for(let d=0;d<4;d++){
  const c=getCourse('greyhaven',d);assert.equal(c.rocks.length,[0,3,5,5][d]);
  assert.ok(c.rocks.every(o=>o.type==='ball'&&Math.abs(o.z-57.75)<.001));
 }
});
test('all Sunny Beach class races finish the original slalom without missed buoys',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse('greyhaven',difficulty),difficulty}),r=s.racers[0];
  for(let i=0;i<24000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
 }
});
