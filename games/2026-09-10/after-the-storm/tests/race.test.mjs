import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput,adjudicateGate,settings,COVE,gateCoordinates} from '../race-core.js';

test('all four riders complete a three-lap race using ordinary helm input',()=>{
 for(let rider=0;rider<4;rider++){
  const s=createRace({rider});
  for(let i=0;i<18000&&s.phase!=='results';i++)stepRace(s,aiInput(s,s.racers[0]),1/60);
  const p=s.racers[0];assert.equal(s.phase,'results');assert.equal(p.dq,'');assert.equal(p.lapTimes.length,3);assert.equal(p.passed,COVE.gates.length*3);assert.equal(p.misses,0);assert.ok(p.finishTime>60&&p.finishTime<180);assert.ok(s.racers.every(r=>r.passed>30));
 }
});
test('red/right and yellow/left use the riders forward view, not world X',()=>{
 for(const side of [-1,1]){
  const s=createRace(),r=s.racers[0];r.next=side===1?1:2;const g=s.course.gates[r.next];
  assert.ok(gateCoordinates(g,g.bx,g.bz).lateral*side<0,'buoy is opposite the required passing side');
  r.x=g.x+g.tx;r.z=g.z+g.tz;assert.equal(adjudicateGate(s,r,g.x-g.tx,g.z-g.tz),true);assert.equal(r.power,1);assert.equal(r.misses,0);
 }
});
test('wrong side resets power and five misses disqualify',()=>{
 const s=createRace(),r=s.racers[0];r.power=5;
 for(let i=0;i<5;i++){const g=s.course.gates[r.next],lateral=-g.side*15;const x=g.x-g.tz*lateral,z=g.z+g.tx*lateral;r.x=x+g.tx;r.z=z+g.tz;adjudicateGate(s,r,x-g.tx,z-g.tz);assert.equal(r.power,0);}
 assert.equal(r.misses,5);assert.equal(r.dq,'Five missed buoys');
});
test('backwards gate crossing cannot advance a lap or power',()=>{
 const s=createRace(),r=s.racers[0],g=COVE.gates[1];r.x=g.x-g.tx;r.z=g.z-g.tz;assert.equal(adjudicateGate(s,r,g.x+g.tx,g.z+g.tz),false);assert.equal(r.passed,0);assert.equal(r.lap,1);
});
test('course out is cumulative only while outside, and pause stops time',()=>{
 // Stay afloat outside the course: grounded riders now receive shore recovery.
 const s=createRace({mode:'time',course:{...COVE,ground:()=>-10,rocks:[]}});s.phase='running';const r=s.racers[0];r.x=0;r.z=0;
 for(let i=0;i<120;i++)stepRace(s,{},1/60);assert.ok(r.out>1.9&&r.out<2.1);r.x=COVE.gates[1].x;r.z=COVE.gates[1].z;stepRace(s,{},1/60);assert.equal(r.out,0);
 s.phase='paused';const t=s.time;stepRace(s,{throttle:1},1/60);assert.equal(s.time,t);s.phase='running';r.x=0;r.z=0;for(let i=0;i<305;i++)stepRace(s,{},1/60);assert.equal(s.phase,'results');assert.equal(s.result.dq,'Outside course for five seconds');
});
test('tuning has real speed, acceleration, grip and steering tradeoffs',()=>{
 const base=settings(0),top=settings(0,{engine:1}),tight=settings(0,{grip:1}),light=settings(0,{handling:1});assert.ok(top.speed>base.speed&&top.accel<base.accel);assert.ok(tight.grip>base.grip&&tight.speed<base.speed);assert.ok(light.handling>base.handling);
 const s=createRace({mode:'time'});assert.equal(s.racers.length,1);assert.equal(createRace().racers.length,4);s.racers[0].misses=4;s.time=20;const fresh=createRace();assert.equal(fresh.time,0);assert.equal(fresh.racers[0].misses,0);assert.equal(fresh.phase,'countdown');
});
