import test from 'node:test';
import assert from 'node:assert/strict';
import {createTetraSwim,advanceTetraSwim,MAX_TETRA_PITCH,MAX_TETRA_VERTICAL_SPEED} from '../lib/aquarium/TetraSwimming.ts';
test('tetra remains upright through repeated turns and feeding transitions',()=>{
 const s=createTetraSwim();let turns=0;
 for(let i=0;i<60*300;i++){
  const yaw=s.yaw,pitch=s.pitch,direction=s.direction;
  advanceTetraSwim(s,1/60,i>3000&&i<6000);
  assert.ok(Math.abs(s.pitch)<=MAX_TETRA_PITCH+1e-6);
  assert.ok(s.yaw>=0&&s.yaw<=Math.PI);
  assert.ok(Math.abs(s.yaw-yaw)<=.9/60+1e-9);
  assert.ok(Math.abs(s.pitch-pitch)<.005);
  assert.ok(Math.abs(s.vy)<=MAX_TETRA_VERTICAL_SPEED+1e-6);
  assert.ok(s.x>600&&s.x<1260);
  if(direction!==s.direction)turns++;
 }
 assert.ok(turns>=4);
});
test('pause freezes position and orientation',()=>{
 const s=createTetraSwim(),before={...s};advanceTetraSwim(s,0,true);assert.deepEqual(s,before);
});
test('steady motion follows the nose without backward sliding',()=>{
 const s=createTetraSwim();
 for(let i=0;i<6000;i++){advanceTetraSwim(s,1/60);assert.ok(s.vx*Math.cos(s.yaw)>=-1e-12);}
});
