import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9);
test('Southern classes retain source buoy counts, ordered progress and native world coordinates',()=>{
 const colors=['RLLLRLLRLLR','RLLRLRLRLLR','RLLLRLLLRLLR','RLRRLLRLRLLR'];
 for(let difficulty=0;difficulty<4;difficulty++){
  const c=getCourse('tempest',difficulty),g=c.gates.slice(1);
  assert.equal(g.length,difficulty<2?11:12);assert.equal(g.map(b=>b.side===1?'R':'L').join(''),colors[difficulty]);
  for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);
  close(c.gates[0].x,100);close(c.gates[0].z,25);close(c.gates[0].width,12.5);
 }
});
test('Hard and Expert preserve their own source-centered upper slalom',()=>{
 const n=getCourse('tempest',0),h=getCourse('tempest',1),e=getCourse('tempest',2);
 close(n.gates[4].bx,-958*.025);close(n.gates[4].bz,-4318*.025);assert.equal(n.gates[4].side,-1);
 close(h.gates[4].bx,-342*.025);close(h.gates[4].bz,-4423*.025);assert.equal(h.gates[4].side,1);
 close(e.gates[8].bx,-2578*.025);close(e.gates[8].bz,991*.025);assert.equal(e.gates[8].side,-1);
});
test('Reverse is independently directed and retains the fixed source ramp orientation',()=>{
 const c=getCourse('tempest',3),n=getCourse('tempest');
 close(c.gates[1].bx,3900*.025);close(c.gates[1].bz,3000*.025);assert.equal(c.gates[1].side,1);
 close(c.gates[10].bx,1280*.025);close(c.gates[10].bz,-6165*.025);
 close(c.gates[12].bx,4099*.025);close(c.gates[12].bz,-2510*.025);
 assert.deepEqual(c.ramps,n.ramps);assert.deepEqual(c.anchors,c.anchorsByClass[3]);
});
