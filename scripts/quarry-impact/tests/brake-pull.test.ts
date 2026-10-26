import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BRAKE_PULL,brakePull,caliperGrip,weakCaliper} from '../src/age-rust';
test('an old car has one weak front caliper, its own side, weaker the older',()=>{
  const sides=Array.from({length:60},(_,id)=>weakCaliper(id));assert.ok(sides.every(s=>s===0||s===1)&&sides.includes(0)&&sides.includes(1));
  const id=3,weak=weakCaliper(id);assert.equal(caliperGrip(1,id,weak),1-BRAKE_PULL.loss);assert.equal(caliperGrip(1,id,1-weak),1,'the other front');
  assert.equal(caliperGrip(1,id,2),1);assert.equal(caliperGrip(1,id,3),1,'not the rears');assert.equal(caliperGrip(BRAKE_PULL.from-.01,id,weak),1,'not on a younger car');
  assert.ok(caliperGrip(.75,id,weak)>caliperGrip(1,id,weak)&&caliperGrip(.75,id,weak)<1);assert.equal(caliperGrip(NaN,id,weak),1);
});
test('braking hard at speed, its wheel tugs toward the strong side; gently, slowly or young, less or none',()=>{
  const id=3,side=weakCaliper(id)===0?1:-1,full=brakePull(0,1,20,1,id);assert.ok(Math.abs(full-side*BRAKE_PULL.tug)<1e-12,'the whole tug');
  assert.ok(Math.abs(brakePull(0,.4,20,1,id))<Math.abs(full)&&Math.abs(brakePull(0,1,3,1,id))<Math.abs(full)&&Math.abs(brakePull(0,1,20,.7,id))<Math.abs(full));
  assert.equal(brakePull(.2,0,20,1,id),.2,'off the brakes');assert.equal(brakePull(.2,1,20,BRAKE_PULL.from-.01,id),.2,'a younger car');
  assert.equal(brakePull(side,1,20,1,id),side,'never past full lock');assert.equal(brakePull(NaN,1,20,1,id),side*BRAKE_PULL.tug);assert.equal(brakePull(.1,NaN,20,1,id),.1);
});
test('the vehicle weakens the caliper and tugs the wheel, offline only',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage)this.brakeBias[i]*=caliperGrip(this.surfaceFinish.rustAge,this.id,i);'),'the weak caliper');
  assert.ok(vehicle.includes('if(this.extendedDamage)steer=brakePull(steer,raw.brake,this.speed,this.surfaceFinish.rustAge,this.id);'),'the tug');
  const at=vehicle.indexOf('steer=brakePull('),own=vehicle.indexOf('if(steer!==raw.steer||throttle!==raw.throttle||handbrake!==raw.handbrake)',at);assert.ok(at>0&&own>at,'before the input is settled');
});
