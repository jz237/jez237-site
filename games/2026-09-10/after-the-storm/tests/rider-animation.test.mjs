import test from 'node:test';
import assert from 'node:assert/strict';
import {riderMotion} from '../rider-motion.js';
import {jointBetween,riderPose} from '../rider-pose.js';

const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const close=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const channels=['turn','forwardShift','compression','flightBlend','loadShift','wetness'];

test('extra render frames cannot alter motion sampled from the same simulation',()=>{
 const regular={},fast={};let a,b;
 for(let tick=0;tick<=180;tick++){
  const time=tick/60,turn=Math.sin(time*2),motion={speed:Math.min(time*6,18),compression:time>.7&&time<1?.3:0,airborne:time>1.2&&time<1.6,load:1+Math.sin(time)};
  a=riderMotion(regular,time,turn,{...motion,dt:1/60});
  for(let render=0;render<3;render++)b=riderMotion(fast,time,turn,{...motion,dt:1/180});
  for(const key of channels)close(a[key],b[key]);
 }
 assert.ok(a.forwardShift<-.035,'sustained acceleration creates visible rearward inertia');
});

test('a slow rendered frame preserves the same elapsed spring motion',()=>{
 const slow={},fast={};riderMotion(slow,0,0);riderMotion(fast,0,0);
 const input={speed:0,lean:1,compression:.3,airborne:true,load:2};
 const a=riderMotion(slow,.5,1,{...input,dt:.5});let b;
 for(let tick=1;tick<=30;tick++)b=riderMotion(fast,tick/60,1,{...input,dt:1/60});
 for(const key of channels)close(a[key],b[key]);
});

test('paused and inspection frames freeze springs; a clock reset discards previous inertia',()=>{
 const memory={};riderMotion(memory,0,0);riderMotion(memory,.1,1,{speed:1,compression:.3});
 const held=structuredClone(memory);
 for(let i=0;i<120;i++)riderMotion(memory,.1,1,{speed:1,compression:.3,dt:0});
 assert.deepEqual(memory,held);
 const paused=riderMotion(memory,.2,-1,{speed:1,compression:0,dt:0});
 close(paused.turn,held.lean);close(paused.compression,held.compression);
 const input={speed:20,lean:-1,compression:.15,airborne:true};
 const reset=riderMotion(memory,0,-.7,input),fresh=riderMotion({},0,-.7,input);
 assert.deepEqual(reset,fresh);
 const skipped=riderMotion(memory,5,.5,input),newScene=riderMotion({},5,.5,input);
 assert.deepEqual(skipped,newScene);
});

test('braking pitches weight forward and landing compression recovers continuously',()=>{
 const memory={};riderMotion(memory,0,0,{speed:20});let output;
 for(let tick=1;tick<=30;tick++)output=riderMotion(memory,tick/60,0,{speed:20-tick/6,compression:.3});
 assert.ok(output.forwardShift>.055,'braking throws the torso forward');
 assert.ok(output.compression>.28,'the rider absorbs the landing');
 const before=output;
 output=riderMotion(memory,31/60,0,{speed:15,compression:0});
 assert.ok(output.compression>.25&&output.compression<before.compression,'release is not a snap to neutral');
 for(let tick=32;tick<=180;tick++)output=riderMotion(memory,tick/60,0,{speed:15});
 assert.ok(output.compression<.00001&&Math.abs(output.forwardShift)<.00001);
});

test('riding and stunt limbs retain their anatomical lengths through steering and impacts',()=>{
 const lengths={upperArm:.382974,forearm:.366647,thigh:.537331,shin:.510539};
 for(const pose of ['', 'stand','handstand','backwards','somersault'])for(let sample=0;sample<120;sample++){
  const turn=Math.sin(sample*1.13),motion={speed:sample%31,steering:turn*.3,compression:(sample%39)*.01,roll:Math.sin(sample*2.47)*1.5,pitch:Math.sin(sample*3.7),flightBlend:(sample%11)*.1,forwardShift:Math.sin(sample*.173)*.23,verticalSpeed:-(sample%15)};
  const p=riderPose(pose,sample*.016,turn,motion);
  for(const side of ['L','R'])for(const [bone,length] of Object.entries(lengths))close(distance(...p.targets[bone+side]),length,1e-7);
  for(const side of ['L','R']){
   assert.deepEqual(p.targets['forearm'+side][1],p.targets['hand'+side][0]);
   assert.deepEqual(p.targets['shin'+side][1],p.targets['foot'+side][0]);
  }
 }
});

test('standing and handstand grips track the bars while backwards anchors remain intact',()=>{
 const neutral=riderPose('',0,0),turn=.8,steering=turn*.3;
 for(const pose of ['', 'stand','handstand']){
  const p=riderPose(pose,0,turn,{steering});
  for(const side of ['L','R']){
   const a=neutral.targets['hand'+side][0],b=p.targets['hand'+side][0];
   close(b[0],a[0]*Math.cos(steering)+(a[2]-.66)*Math.sin(steering));
   close(b[2],-a[0]*Math.sin(steering)+(a[2]-.66)*Math.cos(steering)+.66);
   if(pose!=='handstand')assert.deepEqual(p.targets['foot'+side],neutral.targets['foot'+side]);
  }
 }
 const backwards=riderPose('backwards',0,turn,{steering});
 assert.deepEqual(backwards.targets.handL[0],[-.38,1.08,-.02]);
 assert.deepEqual(backwards.targets.handR[0],[.38,1.08,-.02]);
 const handstand=riderPose('handstand',0,turn,{steering});
 assert.deepEqual(handstand.targets.footL[0],[-.16,3.09,.27]);
 assert.deepEqual(handstand.targets.footR[0],[.16,3.09,.27]);
});

test('IK remains anatomical when the bend pole lies exactly on any limb axis',()=>{
 for(const endpoint of [[.5,0,0],[0,.5,0],[0,0,.5],[0,0,-.5]]){
  const origin=[0,0,0],joint=jointBetween(origin,endpoint,.38,.36,endpoint);
  close(distance(origin,joint),.38);close(distance(joint,endpoint),.36);
 }
 for(const endpoint of [[0,0,0],[0,.001,0]]){
  const joint=jointBetween([0,0,0],endpoint,.38,.36,endpoint);
  assert.ok(joint.every(Number.isFinite));close(distance([0,0,0],joint),.38);
 }
});
