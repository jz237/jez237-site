import test from 'node:test';import assert from 'node:assert/strict';
import {planNext,createExecutor,stepExecutor,fightControl,rng} from '../demo.js';
import {createRecognizer,recordSample,recordTwitch,classify} from '../technique.js';
import {LURES,RIGS} from '../tackle.js';
const spots=[{type:'laydown',x:10,z:10,r:8},{type:'dock',x:60,z:-20,r:9},{type:'weedbed',x:-40,z:30,r:70},{type:'riprap',x:120,z:-80,r:35}];
test('the plan favours topwater over vegetation at first light and the squarebill on rock at midday',()=>{
 const dawn=planNext({hour:6.8,activity:.95,spots,rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0},random:rng(3)});
 assert.equal(dawn.rigIndex,1);assert.equal(dawn.technique,'walking the dog');assert.ok(dawn.reason.length>10);
 let rocks=0;for(let s=1;s<=10;s++){const noon=planNext({hour:13,activity:.35,spots:[spots[3],spots[1]],rigs:RIGS,kayak:{x:100,z:-60},memory:{visits:{},refusals:0},random:rng(s)});if(noon.rigIndex===2)rocks++;}
 assert.ok(rocks>=8,'squarebill picks '+rocks);
 const refused=planNext({hour:9,activity:.5,spots,rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:2},random:rng(5)});assert.equal(refused.rigIndex,0);assert.ok(/turning away/.test(refused.reason));
});
test('the executor produces input the recognizer names as intended',()=>{
 for(const [tech,lure,onBottom] of [['walking the dog',LURES.walker,false],['stop & go',LURES.squarebill,false],['lift & drop',LURES.worm,true],['straight retrieve',LURES.squarebill,false]]){
  const ex=createExecutor(tech,rng(7)),r=createRecognizer();let t=0;let label='';
  for(let i=0;i<600;i++){t+=1/60;const inp=stepExecutor(ex,1/60,rng(i));if(i%3===0)recordSample(r,t,inp.reeling);if(inp.twitch)recordTwitch(r,t);if(i%15===0)label=classify(r,t,lure,{inWater:true,onBottom});}
  assert.equal(label,tech,'technique '+tech+' read as '+label);}
});
test('the fight controller bows to jumps and leans on runs',()=>{
 assert.equal(fightControl({state:'JUMP'},1,null).rodUp,0);assert.equal(fightControl({state:'RUN'},1,null).sidePressure,1);assert.ok(fightControl({state:'HEADSHAKE'},1,null).reeling>.9);
 assert.equal(fightControl({state:'RUN'},1,'JUMP').rodUp,0,'a delayed read is what the angler reacts to');
});
