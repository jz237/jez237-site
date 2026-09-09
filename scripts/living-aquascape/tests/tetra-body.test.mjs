import test from 'node:test';
import assert from 'node:assert/strict';
import {bendTetra,tetraSpine} from '../lib/aquarium/TetraKinematics.ts';
test('spine wave moves the middle and rear of the body while keeping the head steady',()=>{
 let middle=0,rear=0;
 for(let phase=0;phase<Math.PI*2;phase+=.05){
  assert.deepEqual(bendTetra(.426,-.022,.034,phase,1,'body'),[.426,-.022,.034]);
  middle=Math.max(middle,Math.abs(tetraSpine(0,phase,1).z));
  rear=Math.max(rear,Math.abs(tetraSpine(-.28,phase,1).z));
 }
 assert.ok(middle>.02);assert.ok(rear>middle*2);
 // A travelling wave bends the body; it is not one rigid translation.
 const a=tetraSpine(0,0,1),b=tetraSpine(-.28,0,1);
 assert.ok(Math.abs(a.angle-b.angle)>.1);
});
test('bending rotates cross-sections without flattening the fish',()=>{
 for(let phase=0;phase<Math.PI*2;phase+=.2){
  const left=bendTetra(0,-.035,-.05,phase,1,'body'),right=bendTetra(0,-.035,.05,phase,1,'body');
  assert.ok(Math.abs(Math.hypot(...left.map((v,i)=>v-right[i]))-.1)<1e-12);
 }
});
test('body wave eases during gliding and grows during a swimming burst',()=>{
 const rms=(effort)=>{let sum=0;for(let i=0;i<100;i++)sum+=tetraSpine(-.2,i/100*Math.PI*2,effort).z**2;return Math.sqrt(sum/100);};
 assert.ok(rms(.025)<rms(.7)*.1);assert.ok(rms(1.2)>rms(.7)*1.5);
});
