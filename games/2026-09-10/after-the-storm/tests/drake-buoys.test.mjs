import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const pixel=g=>[Math.round(g.bx/.75+200),Math.round(g.bz/.75+240),g.side];
test('Drake Lake retains each original class buoy count and ordered color sequence',()=>{
 const colors=['LRLLLRLRLRRL','LRLLLRLRLRRLR','LRLLLRLRLLRLRLRL','LRLRLRLLRLRLLLRL'];
 for(let d=0;d<4;d++){const c=getCourse('reed',d);assert.equal(c.gates.length,[13,14,17,17][d]);assert.equal(c.gates.slice(1).map(g=>g.side===1?'R':'L').join(''),colors[d]);for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);}
 assert.deepEqual(pixel(getCourse('reed',0).gates[9]),[51,343,-1]);assert.deepEqual(pixel(getCourse('reed',1).gates[12]),[250,393,-1]);assert.deepEqual(pixel(getCourse('reed',2).gates[13]),[229,367,1]);assert.deepEqual(pixel(getCourse('reed',3).gates[4]),[238,411,1]);
});
test('Hard and Expert have distinct post-field routes without acquiring tunnel rules',()=>{
 const n=getCourse('reed'),h=getCourse('reed',1),e=getCourse('reed',2),r=getCourse('reed',3);assert.notDeepEqual(n.anchors,h.anchors);assert.notDeepEqual(h.anchors,e.anchors);assert.deepEqual(r.anchors,n.anchors);for(const c of [n,h,e,r]){assert.equal(c.requiredPassage,false);assert.equal(c.rocks.length,8);assert.equal(c.ramps.length,0);assert.equal(c.resistance.length,2);}
});
test('all Drake classes finish the mapped three-lap sequence without missed buoys',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const c=getCourse('reed',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0],postLaps=new Set();
  for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,aiInput(s,r),1/60);if(r.x>10&&r.x<70&&r.z>90&&r.z<122)postLaps.add(r.lap);}
  assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,c.gates.length*3);assert.equal(r.lap,4);if(difficulty)assert.deepEqual([...postLaps],[1,2,3]);
 }
});
