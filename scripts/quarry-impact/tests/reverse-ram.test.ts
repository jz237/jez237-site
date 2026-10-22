import test from 'node:test';
import assert from 'node:assert/strict';
import {driveDerby,REVERSE_RAM} from '../src/derby-driving';
const car=(protectFront:boolean,speed=0)=>({id:0,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed,health:60,finished:false,nextCheckpoint:0,surface:'asphalt',protectFront});
const rival=(x:number,z:number)=>({id:1,current:{x,y:0,z},velocity:{x:0,y:0,z:0},forward:{x:1,y:0,z:0},right:{x:0,y:0,z:-1},speed:0,health:80,finished:false,nextCheckpoint:0,surface:'asphalt'});
const memory=()=>({target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}}) as never;
test('a car with a wrecked front backs into its target instead of driving at it; a sound car drives forward',()=>{
 const behind=driveDerby(car(true) as never,[car(true) as never,rival(0,-15) as never],memory(),null,1/60);
 assert.ok(behind.throttle<0&&Math.abs(behind.steer)<.05,'target behind: straight back at it');
 const left=driveDerby(car(true) as never,[car(true) as never,rival(-8,-12) as never],memory(),null,1/60),right=driveDerby(car(true) as never,[car(true) as never,rival(8,-12) as never],memory(),null,1/60);
 assert.ok(left.throttle<0&&right.throttle<0&&Math.sign(left.steer)===-Math.sign(right.steer)&&left.steer!==0,'it steers its tail toward the target');
 const ahead=driveDerby(car(false) as never,[car(false) as never,rival(0,15) as never],memory(),null,1/60);
 assert.ok(ahead.throttle>0,'a sound front drives in forwards');
 const far=driveDerby(car(true) as never,[car(true) as never,rival(0,-(REVERSE_RAM.range+10)) as never],memory(),null,1/60);
 assert.ok(far.throttle>=0,'out of range it closes in normally first');
 const fast=driveDerby(car(true,-REVERSE_RAM.speed-1) as never,[car(true) as never,rival(0,-15) as never],memory(),null,1/60);
 assert.equal(fast.throttle,0,'and it caps its reversing speed');
});
