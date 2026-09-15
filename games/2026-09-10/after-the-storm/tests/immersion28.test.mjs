import test from 'node:test';import assert from 'node:assert/strict';
import {riderMotion} from '../rider-motion.js';import {riderPose} from '../rider-pose.js';
import {landingGrip} from '../landing-response.js';import {demoCameraFrame} from '../demo-camera.js';
import {obstacleSurge} from '../obstacle-surge.js';import {createLocalWater,moveLocalWater,stepLocalWater} from '../local-water.js';
test('chop raises pelvis while feet and grip anchors stay attached',()=>{
 const memory={};let movement;for(let i=0;i<120;i++)movement=riderMotion(memory,i/60,.4,{speed:22,pitchVelocity:2,rollVelocity:1,load:2});
 assert.ok(movement.stand>.7);const a=riderPose('',2,.4,{...movement,stand:0}),b=riderPose('',2,.4,movement);
 assert.ok(b.targets.pelvis[0][1]>a.targets.pelvis[0][1]+.12);
 for(const part of ['footL','footR','handL','handR'])assert.deepEqual(a.targets[part],b.targets[part]);
 const held=structuredClone(memory);riderMotion(memory,119/60,.4,{speed:22,pitchVelocity:2,rollVelocity:1,load:2,dt:0});assert.deepEqual(memory,held);
});
test('a sideways landing restores grip gradually without adding velocity',()=>{
 const r={vx:5,vz:20,hydro:{landingId:1,entry:{style:'sideways',harshness:.8,slip:8},wet:1,airborne:false}};
 const first=landingGrip(r,1/60);assert.ok(first<.9&&first>.8);let last=first;
 for(let i=0;i<90;i++){const next=landingGrip(r,1/60);assert.ok(next>=last);last=next;}assert.equal(last,1);assert.equal(r.vx,5);assert.equal(r.vz,20);
 r.hydro.landingId++;r.hydro.entry.style='level';assert.equal(landingGrip(r,1/60),1);
});
test('demo anticipates rising jumps and widens gently for adjacent competitors',()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:24,hydro:{waterHeight:0,y:1,vy:5,anticipation:1,airborne:true}},q={x:15,z:16,hydro:{}};
 const m={};let f;for(let i=0;i<120;i++)f=demoCameraFrame(m,r,[r,q],1/60);
 assert.ok(f.position.z< -11);assert.ok(f.target.x>0);assert.ok(f.target.y>1.3);assert.equal(m.heading,0);
 const held=structuredClone(m);demoCameraFrame(m,r,[r,q],0);assert.deepEqual(m,held);
});
test('solid obstacles scatter incident wave energy into bounded shared water',()=>{
 const f=createLocalWater((x,z)=>Math.hypot(x,z)<2);moveLocalWater(f,0,0);const obstacles=[{x:0,z:0,r:2}],surface=(x,z,t)=>Math.sin(t*2-x*.2);
 for(let i=0;i<360;i++){obstacleSurge(f,obstacles,i/60,1/60,surface);stepLocalWater(f,1/60);}
 assert.ok(f.energy>.001);assert.ok(f.h.every(v=>Number.isFinite(v)&&Math.abs(v)<=.321));
 for(let k=0;k<f.h.length;k++)if(f.mask[k])assert.equal(f.h[k],0);
 const before=f.v.slice();obstacleSurge(f,obstacles,6,0,surface);assert.deepEqual(f.v,before);
});
test('a flat incident surface cannot pump energy into stationary water',()=>{
 const f=createLocalWater(()=>false);moveLocalWater(f,0,0);for(let i=0;i<180;i++){obstacleSurge(f,[{x:0,z:0,r:2}],i/60,1/60,()=>0);stepLocalWater(f,1/60);}assert.equal(f.energy,0);
});
