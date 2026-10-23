import test from 'node:test';
import assert from 'node:assert/strict';
import {driveDerby,CHARGE} from '../src/derby-driving';
const car=(charge:boolean,speed=0,z=0)=>({id:0,current:{x:0,y:0,z},velocity:{x:0,y:0,z:speed},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed,health:80,finished:false,nextCheckpoint:0,surface:'asphalt',charge});
const rival=(z:number)=>({id:1,current:{x:0,y:0,z},velocity:{x:0,y:0,z:0},forward:{x:1,y:0,z:0},right:{x:0,y:0,z:-1},speed:0,health:80,finished:false,nextCheckpoint:0,surface:'asphalt'});
const memory=()=>({target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}}) as never;
test('stuck slow against its target, a charging car backs straight off for a run-up; an ordinary car keeps pushing',()=>{
 const m=memory(),out=driveDerby(car(true,1) as never,[car(true,1) as never,rival(5) as never],m,null,1/60);
 assert.ok(out.throttle<0,'reversing away');assert.equal((m as {phase:string}).phase,'back out');
 const plan=(m as {derby?:{x:number;z:number;charge?:boolean}}).derby!;assert.ok(plan.charge&&plan.z<-(CHARGE.room-5-1),'straight back from the target');
 const plain=driveDerby(car(false,1) as never,[car(false,1) as never,rival(5) as never],memory(),null,1/60);assert.ok(plain.throttle>=0,'no run-up without charge');
});
test('lined up with room, a charging car goes flat out; an ordinary car eases in',()=>{
 const m=memory(),out=driveDerby(car(true,17) as never,[car(true,17) as never,rival(25) as never],m,null,1/60);
 assert.equal(out.throttle,1);assert.equal((m as {phase:string}).phase,'charge');
 const plain=driveDerby(car(false,17) as never,[car(false,17) as never,rival(25) as never],memory(),null,1/60);assert.ok(plain.throttle<1);
});
test('a charging car does not loop on run-ups: it waits CHARGE.cooldown before the next one',()=>{
 const m=memory();driveDerby(car(true,1) as never,[car(true,1) as never,rival(5) as never],m,null,1/60);
 (m as {derby?:unknown}).derby=undefined;const again=driveDerby(car(true,1) as never,[car(true,1) as never,rival(5) as never],m,null,1/60);
 assert.notEqual((m as {phase:string}).phase,'back out');assert.ok(again.throttle>=0);
});
test('when the run-up back-out ends, the car turns straight into its charge (no stale plan is read)',()=>{
 const m=memory();driveDerby(car(true,1) as never,[car(true,1) as never,rival(5) as never],m,null,1/60);
 // Now 20 m back from the rival, still facing it: the back-out is complete.
 const out=driveDerby(car(true,-2,-15) as never,[car(true,-2,-15) as never,rival(5) as never],m,null,1/60);
 assert.equal((m as {derby?:unknown}).derby,undefined);assert.ok(out.throttle>0,'it drives forward again');assert.equal((m as {phase:string}).phase,'charge');
});
