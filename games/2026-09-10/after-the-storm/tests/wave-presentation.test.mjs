import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleSwell,displacedSurface} from '../wave-model.js';
import {riderPose,ridingAttitude} from '../rider-pose.js';
test('large visible swells and physical samples agree',()=>{let low=Infinity,high=-Infinity;for(const storm of [0,.6,.95])for(let x=-100;x<100;x+=5)for(let z=-100;z<100;z+=7){const p=displacedSurface(x,z,12,storm);assert.ok(Math.abs(p.y-sampleSwell(p.x,p.z,12,storm))<.05);if(storm===.6){low=Math.min(low,p.y);high=Math.max(high,p.y);}}assert.ok(high-low>3.5);});
test('turning rider shifts visibly while boots remain planted',()=>{const a=riderPose('',0,-1,{speed:24}),b=riderPose('',0,1,{speed:24});assert.ok(b.targets.pelvis[0][0]-a.targets.pelvis[0][0]>.18);for(const side of ['L','R'])assert.deepEqual(a.targets['foot'+side],b.targets['foot'+side]);});
test('descent braces the torso before landing without releasing grips',()=>{const a=riderPose('',0,0,{airborne:true,airTime:.5,verticalSpeed:4}),b=riderPose('',0,0,{airborne:true,airTime:.5,verticalSpeed:-7});assert.ok(b.targets.torso[1][1]<a.targets.torso[1][1]-.05);assert.deepEqual(a.targets.handL,b.targets.handL);});
test('body bank eases into turns and unwinds in the air',()=>{const m={},h={wet:1,pitch:.1,roll:0};for(let i=0;i<60;i++)ridingAttitude(m,h,1,24,1/60);assert.ok(m.bank<-.19);const bank=m.bank;h.wet=0;const pose=ridingAttitude(m,h,1,24,1/60);assert.ok(pose.roll>bank&&pose.roll<0);assert.equal(pose.pitch,h.pitch);});
