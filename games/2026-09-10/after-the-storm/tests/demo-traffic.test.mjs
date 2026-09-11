import test from 'node:test';
import assert from 'node:assert/strict';
import {demoTrafficInput} from '../demo-traffic.js';
function fixture(){const r={grid:0,x:0,z:0,heading:0,speed:24,vx:0,vz:24,hydro:{}},q={x:0,z:12,speed:15,vx:0,vz:15,finishTime:null};return {r,q,s:{time:10,racers:[r,q],course:{ground:()=>-5}},input:{throttle:1,steer:.2,brake:false}};}
test('closing follower yields to a slower leader without moving either craft',()=>{const {s,r,input}=fixture(),before=JSON.stringify(s),c=demoTrafficInput(s,r,input);assert.equal(c.throttle,0);assert.equal(c.brake,true);assert.equal(c.steer,.2);assert.equal(JSON.stringify(s),before);});
test('clear passing lane retains throttle',()=>{const {s,r,q,input}=fixture();q.x=9;assert.deepEqual(demoTrafficInput(s,r,input),input);});
test('a ski converging into the lane gets room',()=>{const {s,r,q,input}=fixture();q.x=7;q.vx=-8;assert.ok(demoTrafficInput(s,r,input).throttle<1);});
test('racer across land does not slow this lane',()=>{const {s,r,input}=fixture();s.course.ground=()=>2;assert.deepEqual(demoTrafficInput(s,r,input),input);});
