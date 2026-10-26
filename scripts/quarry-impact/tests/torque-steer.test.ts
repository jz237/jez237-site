import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TORQUE_STEER,torqueSide,torqueSteer} from '../src/torque-steer';
test('each front-driver pulls its own way',()=>{
  const sides=Array.from({length:60},(_,id)=>torqueSide(id));assert.ok(sides.every(s=>s===1||s===-1)&&sides.includes(1)&&sides.includes(-1));
  assert.equal(torqueSide(5),torqueSide(5));assert.ok(Math.abs(torqueSide(NaN))===1);
});
test('flat out from a standstill it tugs hardest, less as the pedal eases or the speed rises, none cruising',()=>{
  const side=torqueSide(3),full=torqueSteer(0,1,0,3);assert.ok(Math.abs(full-side*TORQUE_STEER.pull)<1e-12,'the whole pull');
  assert.ok(Math.abs(torqueSteer(0,.7,0,3))<Math.abs(full)&&Math.abs(torqueSteer(0,1,8,3))<Math.abs(full),'eased or faster, less');
  assert.equal(torqueSteer(.2,TORQUE_STEER.throttle,0,3),.2,'part throttle: none');assert.equal(torqueSteer(.2,1,TORQUE_STEER.fade,3),.2,'up to speed: none');
  assert.equal(torqueSteer(-.3,1,-5,3),torqueSteer(-.3,1,5,3),'reversing the same');
});
test('it adds to the driver’s own steering, never past full lock, and ignores bad numbers',()=>{
  const side=torqueSide(3);assert.equal(torqueSteer(side,1,0,3),side,'held at full lock');assert.ok(Math.abs(torqueSteer(-side*.5,1,0,3)-(-side*.5+side*TORQUE_STEER.pull))<1e-12,'against the driver');
  assert.equal(torqueSteer(NaN,1,0,3),side*TORQUE_STEER.pull);assert.equal(torqueSteer(.1,NaN,0,3),.1);assert.equal(torqueSteer(.1,1,NaN,3),.1+side*TORQUE_STEER.pull);
});
test('the vehicle pulls only offline front-drivers in gear with the engine running',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage&&isFrontDriveKind(this.kind)&&this.health>0&&!(this.engineStall!>0)&&this.gear>0)steer=torqueSteer(steer,throttle,this.speed,this.id);'));
  const at=vehicle.indexOf('steer=torqueSteer('),own=vehicle.indexOf('if(steer!==raw.steer||throttle!==raw.throttle||handbrake!==raw.handbrake)',at);assert.ok(at>0&&own>at&&own-at<400,'before the input is settled');
});
