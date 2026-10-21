import test from 'node:test';
import assert from 'node:assert/strict';
import {avoidFires} from '../src/fire-avoidance';
const car=(id=0,speed=15)=>({id,current:{x:0,z:0},forward:{x:0,z:1},right:{x:1,z:0},speed});
const input={throttle:.8,steer:0,brake:0,handbrake:false};
const fire=(x:number,z:number,radius=.5)=>({x,y:0,z,radius,start:0,end:20,kind:2,seed:.3});
test('AI drivers steer round fires ahead, to the far side, and ignore fires behind or well clear',()=>{
 assert.ok(avoidFires(car(),input,[fire(1,10)],5).steer<-.1,'fire ahead-right: steer left');
 assert.ok(avoidFires(car(),input,[fire(-1,10)],5).steer>.1,'fire ahead-left: steer right');
 assert.equal(avoidFires(car(),input,[fire(0,-8)],5),input,'behind');
 assert.equal(avoidFires(car(),input,[fire(6,10)],5),input,'well clear to the side');
 assert.equal(avoidFires(car(),input,[fire(1,10)],25),input,'burnt out');
 assert.notEqual(Math.sign(avoidFires(car(0),input,[fire(0,10)],5).steer),Math.sign(avoidFires(car(1),input,[fire(0,10)],5).steer),'dead centre: drivers split');
});
test('a fire dead ahead and close slows the car; standing in flames floors it straight out',()=>{
 const close=avoidFires(car(),input,[fire(.2,3,.8)],5);assert.ok(close.throttle<input.throttle&&close.brake>0);
 const out=avoidFires(car(),{throttle:.2,steer:.8,brake:1,handbrake:false},[fire(0,0,1)],5,.7);
 assert.deepEqual(out,{throttle:1,steer:.32000000000000006,brake:0,handbrake:false});
});
