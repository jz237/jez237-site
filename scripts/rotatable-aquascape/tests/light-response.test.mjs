import test from 'node:test';
import assert from 'node:assert/strict';
import {createTetraSwim,advanceTetraSwim} from '../lib/TetraSwimming.ts';
import {createAngel,advanceAngel} from '../lib/AngelfishMotion.ts';
const senses={food:[],neighbors:[],daylight:1};
test('cardinals interrupt a long daytime decision and visibly settle within half a second',()=>{
 const s=createTetraSwim();s.speed=30;s.brain.decisionIn=8;s.remaining=8;
 let light=1;for(let i=0;i<30;i++){light+=(.27-light)*(1-Math.exp(-8/60));advanceTetraSwim(s,1/60,false,false,{...senses,daylight:light});}
 assert.equal(s.brain.intent.kind,'rest');assert.ok(s.speed<3,`speed ${s.speed}`);assert.ok(s.effort<.12);
 const sleepingSpeed=s.speed;for(let i=0;i<30;i++){light+=(1-light)*(1-Math.exp(-8/60));advanceTetraSwim(s,1/60,false,false,{...senses,daylight:light});}
 assert.notEqual(s.brain.intent.kind,'rest');assert.ok(s.speed>sleepingSpeed+4);assert.ok(s.effort>.12);
});
test('angelfish visibly change pace on both light transitions without snapping position',()=>{
 const s=createAngel(0);s.position.set(0,3,0);s.goal.set(4,3,0);s.yaw=0;s.speed=.36;s.timer=20;
 const senses={food:[],other:[],daylight:1,clear:()=>true};advanceAngel(s,1/60,senses);
 let light=1;for(let i=0;i<30;i++){light+=(.27-light)*(1-Math.exp(-8/60));const prev=s.position.clone();advanceAngel(s,1/60,{...senses,daylight:light});assert.ok(prev.distanceTo(s.position)<.02);}
 assert.ok(s.speed<=.11);s.hover=2;
 for(let i=0;i<30;i++){light+=(1-light)*(1-Math.exp(-8/60));advanceAngel(s,1/60,{...senses,daylight:light});}
 assert.ok(s.speed>.2);assert.equal(s.hover,0);
});
