import test from 'node:test';
import assert from 'node:assert/strict';
import {createFishBrain,thinkFish,rememberPlant} from '../lib/FishBrain.ts';
import {createTetraSwim,advanceTetraSwim,MAX_TETRA_PITCH} from '../lib/TetraSwimming.ts';
import {FEEDING_MAX_PITCH,FEEDING_TURN_RATE} from '../lib/TetraFeeding.ts';
const empty={food:[],neighbors:[]};
test('hungry fish seeks actual food and only eats within reach',()=>{
 const b=createFishBrain(),food={id:42,x:1080,y:320};
 assert.equal(thinkFish(b,.016,1000,320,10,{...empty,food:[food]}).kind,'feed');assert.equal(b.consumedFood,null);
 const hunger=b.hunger;thinkFish(b,.016,1070,320,3,{...empty,food:[food]});assert.equal(b.consumedFood,42);assert.ok(b.hunger<hunger-.2);
 const full=createFishBrain();full.hunger=.05;assert.notEqual(thinkFish(full,.016,1070,320,3,{...empty,food:[food]}).kind,'feed');
});
test('tired fish rests then recovers enough energy to resume',()=>{
 const b=createFishBrain();b.energy=.2;
 assert.equal(thinkFish(b,.016,1000,350,0,empty).kind,'rest');
 for(let i=0;i<60*35;i++)thinkFish(b,1/60,1000,350,0,empty);
 assert.ok(b.energy>.62);assert.notEqual(b.intent.kind,'rest');
});
test('nearby fish cause separation and a visible school can attract the tetra',()=>{
 const b=createFishBrain();assert.equal(thinkFish(b,.016,1000,350,10,{...empty,neighbors:[{id:1,x:1005,y:350}]}).kind,'space');
 let school=false;for(let i=0;i<20;i++){b.decisionIn=0;const intent=thinkFish(b,.1,1000,350,10,{...empty,neighbors:[{id:1,x:1100,y:340},{id:2,x:1090,y:360}]});school||=intent.kind==='school';}
 assert.ok(school);
});
test('inspection memory expires and remains bounded',()=>{
 const b=createFishBrain();for(let i=0;i<20;i++)rememberPlant(b,i*10,350);assert.equal(b.visited.length,6);
 for(let i=0;i<1100;i++)thinkFish(b,.1,1000,350,10,empty);assert.equal(b.visited.length,0);
});
test('perception-driven locomotion stays bounded, upright and finite',()=>{
 const s=createTetraSwim();
 for(let i=0;i<60*300;i++){
  const t=i/60,yaw=s.yaw+s.depthHeading,pitch=s.pitch,feedingBefore=s.feedingPhase!=='search';
  const food=i>600&&i<1800?[{id:1,x:1000,y:250+(t-10)*3}]:[];
  const neighbors=[{id:2,x:950+Math.sin(t*.08)*120,y:350},{id:3,x:990+Math.sin(t*.08)*120,y:360}];
  advanceTetraSwim(s,1/60,food.length>0,false,{food,neighbors});
  assert.ok(s.x>600&&s.x<1260);assert.ok(s.y>220&&s.y<530);
  const feeding=feedingBefore||s.feedingPhase!=='search';
  assert.ok(Math.abs(s.pitch)<=(feeding?FEEDING_MAX_PITCH:MAX_TETRA_PITCH)+1e-9);
  assert.ok(Math.abs(s.pitch-pitch)<=(feeding?1.25:.25)/60+1e-9);
  const turn=Math.atan2(Math.sin(s.yaw+s.depthHeading-yaw),Math.cos(s.yaw+s.depthHeading-yaw));
  assert.ok(Math.abs(turn)<=(feeding?FEEDING_TURN_RATE:1.15)/60+(feedingBefore&&s.feedingPhase==='search'?.025:1e-9));
  assert.ok(s.brain.energy>=0&&s.brain.energy<=1&&s.brain.hunger>=0&&s.brain.hunger<=1);
 }
 const snapshot=structuredClone(s);advanceTetraSwim(s,0,true,false,empty);assert.deepEqual(s,snapshot);
});
test('hungry tetra can intercept a sinking flake from a different depth',()=>{
 for(const startY of [280,350,470]){
  const s=createTetraSwim();s.y=startY;let ate=false;
  for(let i=0;i<60*85;i++){
   advanceTetraSwim(s,1/60,false,false,{food:[{id:42,x:1000,y:230+i/60*4}],neighbors:[]});
   if(s.brain.consumedFood===42){ate=true;break;}
  }
  assert.ok(ate,`should reach food from depth ${startY}`);
 }
});
test('food at a different front-back depth cannot be eaten through the tank',()=>{
 const b=createFishBrain();thinkFish(b,.016,1000,350,10,{food:[{id:1,x:1000,y:350,z:.9}],neighbors:[]},.1);assert.equal(b.consumedFood,null);
});
test('tetra visits front, back and intermediate water with smooth depth steering',()=>{
 for(const seed of [237,42,1234]){
  const s=createTetraSwim(seed);let min=1,max=0;const bins=new Set();
  for(let i=0;i<60*400;i++){
   const z=s.z,angle=s.depthHeading;advanceTetraSwim(s,1/60,false,false,{food:[],neighbors:[]});
   min=Math.min(min,s.z);max=Math.max(max,s.z);bins.add(Math.floor(s.z*5));
   assert.ok(s.z>=.06&&s.z<=.94);assert.ok(Math.abs(s.z-z)<.003);assert.ok(Math.abs(s.depthHeading-angle)<=.25/60+1e-9);
  }
  assert.ok(min<.3&&max>.7,`${seed}: ${min} to ${max}`);assert.ok(bins.size>=4);
 }
});


test('cardinals remember feeding patches at their actual depth and align vertically with companions',()=>{
 const b=createFishBrain();rememberPlant(b,1000,350,.1);
 let browse=false;
 for(let i=0;i<20;i++){b.curiosity=1;b.browseIn=0;b.decisionIn=0;
  const action=thinkFish(b,.01,1000,350,10,{food:[],neighbors:[],daylight:1,browseSites:[{id:8,x:1000,y:350,z:.7}]},.65);
  if(action.kind==='browse'){assert.equal(action.target.id,8);browse=true;break;}}
 assert.ok(browse,'a leaf behind an inspected foreground leaf is still a new patch');
 const neighbors=[{id:1,x:1080,y:350,z:.5,vy:8,vz:.02},{id:2,x:1100,y:350,z:.5,vy:8,vz:.02}];
 const intent=thinkFish(createFishBrain(),.01,1000,350,10,{food:[],neighbors,daylight:1,schoolAffinity:1},.5);
 assert.equal(intent.kind,'school');assert.ok(intent.target.y>350);assert.ok(intent.target.z>.5);
});

test('smaller cardinal mouth reach still captures actual sinking food',()=>{
 for(const scale of [.75,.875,1]){
  const s=createTetraSwim(837);s.mouthReach=18*scale;s.x=1000;s.y=340;s.z=.5;
  let ate=false;
  for(let i=0;i<1200;i++){const food={id:84,x:1080,y:310+i/60*2,z:.6};advanceTetraSwim(s,1/60,false,false,{food:[food],neighbors:[],daylight:1});if(s.brain.consumedFood===84){ate=true;break;}}
  assert.ok(ate,`mouth at scale ${scale} reaches its food`);
 }
});
