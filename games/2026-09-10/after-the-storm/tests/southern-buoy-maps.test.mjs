import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
const pixel=g=>[Math.round(g.bx/.8+210),Math.round(g.bz/.8+325),g.side];
test('Southern class maps preserve original buoy counts, colors and ordered progression',()=>{
 const colors=['RLLLRLLRLLR','RLLRLRLRLLR','RLLLRLLLRLLR','RLRRLLRLRLLR'];
 for(let difficulty=0;difficulty<4;difficulty++){
  const c=getCourse('tempest',difficulty),g=c.gates.slice(1);
  assert.equal(g.length,difficulty<2?11:12);
  assert.equal(g.map(b=>b.side===1?'R':'L').join(''),colors[difficulty]);
  assert.ok(c.boundary.length>15);
  for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);
 }
});
test('Hard replaces the upper slalom and Expert adds the pier approach buoy',()=>{
 const normal=getCourse('tempest',0),hard=getCourse('tempest',1),expert=getCourse('tempest',2);
 assert.deepEqual(pixel(normal.gates[4]),[179,152,-1]);
 assert.deepEqual(pixel(hard.gates[4]),[205,158,1]);
 assert.deepEqual(pixel(hard.gates[6]),[86,254,1]);
 assert.deepEqual(pixel(expert.gates[8]),[102,366,-1]);
});
test('Reverse uses its own rotated buoy map while retaining physical ship orientation',()=>{
 const c=getCourse('tempest',3);
 assert.deepEqual(pixel(c.gates[1]),[388,441,1]);
 assert.deepEqual(pixel(c.gates[10]),[262,86,-1]);
 assert.deepEqual(pixel(c.gates[12]),[383,227,1]);
 assert.deepEqual(c.ramps,getCourse('tempest').ramps);
});
