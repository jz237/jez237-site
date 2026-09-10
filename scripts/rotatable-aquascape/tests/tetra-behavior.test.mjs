import test from 'node:test';
import assert from 'node:assert/strict';
import {createTetraSwim,advanceTetraSwim,MAX_TETRA_PITCH,MAX_TETRA_VERTICAL_SPEED} from '../lib/TetraSwimming.ts';
test('behavior produces bursts, coasting and low-speed inspection with active paired fins',()=>{
 const s=createTetraSwim(),seen=new Set();let burst=0,glide=0,inspections=0;
 for(let i=0;i<60*300;i++){
  advanceTetraSwim(s,1/60);seen.add(s.behavior);
  if(s.behavior==='burst'&&s.effort>.8&&s.speed>20)burst++;
  if(s.behavior==='gliding'&&s.effort<.15&&s.speed>2)glide++;
  if(s.behavior==='inspecting'&&s.speed<.5&&s.effort<.1&&s.pectoralEffort>.65)inspections++;
 }
 assert.ok(burst>30);assert.ok(glide>30);assert.ok(inspections>60);
 assert.deepEqual([...seen].sort(),['approaching','burst','cruising','gliding','inspecting']);
});
test('varied behavior retains upright turns across different seeds and reacts to feeding',()=>{
 for(const seed of [1,19,237,4096]){
  const s=createTetraSwim(seed);
  for(let i=0;i<60*120;i++){
   const yaw=s.yaw;advanceTetraSwim(s,1/60,i>900&&i<1800);
   assert.ok(Math.abs(s.pitch)<=MAX_TETRA_PITCH+1e-6);assert.ok(Math.abs(s.yaw-yaw)<=.9/60+1e-9);
   assert.ok(s.x>600&&s.x<1260);assert.ok(Number.isFinite(s.speed));
   if(i===902)assert.equal(s.behavior,'foraging');
  }
 }
});
test('behavior timings vary reproducibly instead of repeating an identical loop',()=>{
 const a=createTetraSwim(237),b=createTetraSwim(237),c=createTetraSwim(19),durations=[];let state=a.behavior,entered=0;
 for(let i=0;i<6000;i++){
  advanceTetraSwim(a,1/60);advanceTetraSwim(b,1/60);advanceTetraSwim(c,1/60);
  if(a.behavior!==state){durations.push(i-entered);entered=i;state=a.behavior;}
 }
 assert.deepEqual(a,b);assert.notEqual(a.x,c.x);assert.ok(new Set(durations).size>4);
});

