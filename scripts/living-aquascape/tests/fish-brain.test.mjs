import test from 'node:test';
import assert from 'node:assert/strict';
import {createFishBrain,thinkFish,rememberPlant} from '../lib/aquarium/FishBrain.ts';
import {createTetraSwim,advanceTetraSwim,MAX_TETRA_PITCH} from '../lib/aquarium/TetraSwimming.ts';
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
  const t=i/60,yaw=s.yaw,pitch=s.pitch;
  const food=i>600&&i<1800?[{id:1,x:1000,y:250+(t-10)*3}]:[];
  const neighbors=[{id:2,x:950+Math.sin(t*.08)*120,y:350},{id:3,x:990+Math.sin(t*.08)*120,y:360}];
  advanceTetraSwim(s,1/60,food.length>0,false,{food,neighbors});
  assert.ok(s.x>600&&s.x<1260);assert.ok(s.y>220&&s.y<530);
  assert.ok(Math.abs(s.pitch)<=MAX_TETRA_PITCH+1e-9);assert.ok(Math.abs(s.pitch-pitch)<=.25/60+1e-9);assert.ok(Math.abs(s.yaw-yaw)<=.9/60+1e-9);
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
