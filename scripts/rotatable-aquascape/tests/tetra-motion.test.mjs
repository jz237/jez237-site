import test from 'node:test';
import assert from 'node:assert/strict';
import {bendTetra,swimPhase} from '../lib/TetraKinematics.ts';
test('fin cycle stays continuous when swimming speed changes and freezes when paused',()=>{
 const phase=100;
 assert.equal(swimPhase(phase,0,1.5),phase);
 assert.ok(swimPhase(phase,.016,1.5)-phase<.3);
 assert.equal(swimPhase(phase,-1,1),phase);
});
test('paired fin tips fan while the shoulder remains anchored to the body',()=>{
 for(const side of [-1,1]){
  const a=bendTetra(.25,-.055,side*.049,.2,.5,'pectoral',side);
  const body=bendTetra(.25,-.055,side*.049,.2,.5,'body');
  a.forEach((value,i)=>assert.ok(Math.abs(value-body[i])<1e-12));
  const tipA=bendTetra(.05,-.17,side*.10,.2,.5,'pectoral',side),tipB=bendTetra(.05,-.17,side*.10,1.4,.5,'pectoral',side);
  assert.ok(Math.hypot(...tipA.map((v,i)=>v-tipB[i]))>.03);
 }
});
test('tail hinge stays attached and all fin positions remain finite over a full stroke',()=>{
 for(let phase=0;phase<Math.PI*2;phase+=.1){
  const root=bendTetra(-.30,-.035,0,phase,.8,'tail'),body=bendTetra(-.30,-.035,0,phase,.8,'body');
  root.forEach((v,i)=>assert.ok(Math.abs(v-body[i])<1e-12));
  for(const kind of ['tail','dorsal','anal','pectoral'])assert.ok(bendTetra(-.4,.15,.04,phase,.8,kind).every(Number.isFinite));
 }
});

