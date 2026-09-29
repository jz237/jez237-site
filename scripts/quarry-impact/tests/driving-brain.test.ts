import test from 'node:test';
import assert from 'node:assert/strict';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {CHECKPOINTS} from '../src/rules';
const car=(id:number,x=0,z=0):DriverCar=>({id,current:{x,y:1,z},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:1,surface:'gravel'});
test('derby commits to an accessible target, leads movement and ignores disabled cars',()=>{
 const b=new DrivingBrain(),c=car(0),front=car(1,1,19),behind=car(2,0,-10),wreck=car(3,0,5);wreck.health=0;
 front.velocity.x=8;
 const input=b.update(c,[c,front,behind,wreck],'derby',.2);assert.equal(b.memory.get(0)?.target,1);assert.ok(input.steer>0);
 behind.current.z=12;b.update(c,[c,front,behind,wreck],'derby',.2);assert.equal(b.memory.get(0)?.target,1,'small changes do not switch a committed target');
 front.health=0;b.update(c,[c,front,behind,wreck],'derby',.2);assert.equal(b.memory.get(0)?.target,2);
});
test('stalled driver reverses, avoids reversing into a wall and eventually drives clear',()=>{
 const b=new DrivingBrain(),c=car(0),other=car(1,0,18);let reversed=false,forward=false;
 for(let i=0;i<240;i++){const a=b.update(c,[c,other],'derby',1/60);if(a.throttle<0)reversed=true;if(reversed&&a.throttle>0)forward=true;}
 assert.ok(reversed&&forward);
 const blocked=new DrivingBrain();for(let i=0;i<180;i++){const a=blocked.update(c,[c,other],'derby',1/60,()=>({front:1,left:5,right:2,rear:1}));assert.ok(a.throttle>=0,'blocked rear prevents reverse throttle');}
 b.reset();assert.equal(b.memory.size,0);
});
test('race brakes for an obstacle and steers around a stationary wreck',()=>{
 const b=new DrivingBrain(),c=car(0,CHECKPOINTS[0].x,CHECKPOINTS[0].z),p=CHECKPOINTS[1];
 const dx=p.x-c.current.x,dz=p.z-c.current.z,d=Math.hypot(dx,dz);c.forward={x:dx/d,y:0,z:dz/d};c.right={x:c.forward.z,y:0,z:-c.forward.x};c.speed=22;
 const wreck=car(1,c.current.x+c.forward.x*5,c.current.z+c.forward.z*5);wreck.health=0;
 const control=b.update(c,[c,wreck],'race',.2,()=>({front:3,left:12,right:2,rear:12}));assert.ok(control.brake>.5);assert.ok(control.steer<0);
 c.health=0;assert.equal(b.update(c,[c],'race',.2).brake,1);
});
