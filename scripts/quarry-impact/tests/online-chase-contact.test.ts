import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
await R.init();
test('authoritative pursuer reaches and damages a stopped runner instead of treating it as a wall',()=>{
 const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners:[0],duration:60}});
 try{
  s.course={...s.course,height:()=>0,outside:()=>false,surface:()=>'asphalt'};
  s.world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(1000,-.5,1000));
  for(const c of s.cars){const p={x:1000+(c.state.id>1?40:0),y:.9,z:c.state.id===0?1018:1000-c.state.id*0};c.body.setTranslation(p,true);c.body.setRotation({x:0,y:0,z:0,w:1},true);c.body.setLinvel({x:0,y:0,z:0},true);Object.assign(c.state,{p,q:{x:0,y:0,z:0,w:1},v:{x:0,y:0,z:0},health:c.state.id<2?100:0});}
  s.phase='playing';let contact=false;
  for(let i=0;i<900;i++){s.setInput(0,{throttle:0,steer:0,brake:.15,handbrake:false});s.step(new Set([0]));s.world.contactPair(s.cars[0].collider,s.cars[1].collider,()=>{contact=true;});}
  assert.ok(contact,'AI must physically contact its intended runner');assert.ok(s.cars[0].state.health<100,'impact damages the authoritative runner');assert.ok(s.cars[0].state.dents!.length>0,'impact leaves visible damage');
 }finally{s.dispose();}
});
test('an unopposed server runner completes the circuit through AI controls alone',()=>{
 const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners:[0],duration:60}});
 try{
  for(const c of s.cars.slice(1)){c.state.health=0;c.body.setTranslation({x:500+c.state.id*10,y:5,z:500},true);}
  s.phase='playing';for(let i=0;i<3601&&s.phase!=='result';i++)s.step(new Set());
  assert.equal(s.event!.chase!.session.result(0)?.outcome,'escaped');assert.ok(s.elapsed<60);assert.equal(s.cars[0].state.passed,24);assert.equal(s.cars[0].state.repair,0);assert.equal(s.cars[0].state.penalty,0);
 }finally{s.dispose();}
});
test('a fully autonomous eight-car Chase can end by escape after collisions without resets',()=>{
 const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners:[0],duration:120}});
 try{s.phase='playing';for(let i=0;i<7201&&s.phase!=='result';i++)s.step(new Set());
  assert.equal(s.event!.chase!.session.winner,'runners');assert.ok(s.elapsed<120);assert.ok(s.cars[0].state.health>0&&s.cars[0].state.health<100);assert.equal(s.cars[0].state.passed,24);assert.ok(s.cars.every(c=>c.state.repair===0&&c.state.penalty===0));
 }finally{s.dispose();}
});
