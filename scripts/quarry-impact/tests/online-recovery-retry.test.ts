import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';import {courseRoute} from '../src/race-course';
await R.init();
test('blocked off-course AI waits safely and retries after space clears without restarting its seven-second timer',()=>{
 const sim=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,course:'rookvale-yard-v1',laps:2},0,'angular-v1');
 try{
  sim.phase='playing';sim.elapsed=20;const car=sim.cars[0];car.state.passed=5;car.state.nextCheckpoint=6;
  sim.cars.forEach((c,i)=>{const p={x:500+i*10,y:1,z:500};c.body.setTranslation(p,true);c.state.p=p;});
  const gate=courseRoute(sim.course,'forward')[5];
  const obstacle=sim.world.createCollider(R.ColliderDesc.cuboid(30,3,30).setTranslation(gate.x,sim.course.height(gate.x,gate.z)+1,gate.z));sim.world.step();
  car.offTrack=7.1;car.roll=5.1;let attempts=0;const recover=sim.recover.bind(sim);sim.recover=id=>{attempts++;return recover(id);};
  sim.ai(car);assert.equal(attempts,1);assert.equal(car.state.penalty,0);assert.ok(car.offTrack>7);assert.equal(car.state.passed,5);
  for(let i=0;i<30;i++){sim.elapsed+=1/60;sim.ai(car);}assert.equal(attempts,1,'blocked-space probes are rate limited');
  sim.world.removeCollider(obstacle,true);sim.world.step();sim.elapsed=21.01;sim.ai(car);
  assert.equal(attempts,2);assert.equal(car.state.penalty,5);assert.equal(car.state.passed,5);assert.equal(car.state.nextCheckpoint,6);assert.equal(car.offTrack,0);
  assert.ok(Math.hypot(car.state.p.x-500,car.state.p.z-500)>100);assert.ok(car.drivetrain!.wheels.every(w=>w.omega===0));
 }finally{sim.dispose();}
});
