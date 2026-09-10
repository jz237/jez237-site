import test from 'node:test';
import assert from 'node:assert/strict';
import {createTetraSwim,advanceTetraSwim,MAX_TETRA_PITCH} from '../lib/TetraSwimming.ts';
test('unfed tetra explores upper and lower water instead of staying in one band',()=>{
 for(const seed of [237,19,4096]){
  const s=createTetraSwim(seed);let low=330,high=330,climbing=0,descending=0;
  for(let i=0;i<60*600;i++){
   const oldY=s.y,oldPitch=s.pitch;advanceTetraSwim(s,1/60);
   low=Math.min(low,s.y);high=Math.max(high,s.y);
   if(s.vy<-1)climbing++;if(s.vy>1)descending++;
   assert.ok(s.y>240&&s.y<510);
   assert.ok(Math.abs(s.y-oldY)<=5/60+1e-9);
   assert.ok(Math.abs(s.pitch-oldPitch)<=.25/60+1e-9);
   assert.ok(Math.abs(s.pitch)<=MAX_TETRA_PITCH+1e-9);
  }
  assert.ok(low<320,`upper water ${low}`);assert.ok(high>420,`lower water ${high}`);
  assert.ok(high-low>120);assert.ok(climbing>60&&descending>60);
 }
});

