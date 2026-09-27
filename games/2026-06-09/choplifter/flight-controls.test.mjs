import assert from 'node:assert/strict';
import { flyHelicopter } from './flight-controls.js';

const floorY = 400;
function pilot() {return {x:345,y:210,vx:0,vy:0,att:0,attV:0,cmd:0,spool:.5,thrustN:1,fuel:100,facing:1,facingTgt:1,yawVis:1,rotor:0,onGround:false};}
const pointer = {active:false,used:false,sx:0,sy:0,type:'mouse'};
function frames(h,input,count,ptr=pointer) {for(let i=0;i<count;i++){flyHelicopter(h,input,{floorY,pointer:ptr,cameraX:0,viewScale:1});h.x+=h.vx;h.y+=h.vy;if(h.y>=floorY){h.y=floorY;h.vy=0;h.onGround=true;}else h.onGround=false;}}
const tests=[];
function test(name,fn){fn();tests.push(name);console.log('PASS '+name);}

test('Reaches cruise promptly without climbing during horizontal travel',()=>{const h=pilot();frames(h,{right:true},30);assert(h.vx>5.8);assert(Math.abs(h.y-210)<.5);assert(Math.abs(h.att)<.4);});
test('Brakes within one helicopter length without sliding or oscillating',()=>{const h=pilot();frames(h,{right:true},60);const x=h.x;frames(h,{},45);assert.equal(h.vx,0);assert(h.x-x<55);const stopped=h.x;frames(h,{},180);assert.equal(h.x,stopped);});
test('Keyboard hover holds position for ten seconds after climb release',()=>{const h=pilot();frames(h,{lift:true},15);frames(h,{},70);const y=h.y;frames(h,{},600);assert(Math.abs(h.y-y)<.1);assert.equal(h.vy,0);});
test('Reversing direction is responsive with bounded banking',()=>{const h=pilot();frames(h,{right:true},50);frames(h,{left:true},30);assert(h.vx<-3.5);assert.equal(h.yawVis,-1);assert(Math.abs(h.att)<.4);});
test('Descent flares before touchdown and settles on the ground',()=>{const h=pilot();let nearSpeed=0;for(let i=0;i<220;i++){frames(h,{descend:true},1);if(floorY-h.y<14)nearSpeed=Math.max(nearSpeed,h.vy);}assert(h.onGround);assert(nearSpeed<1.8);});
test('Pointer converges on a stationary target without persistent overshoot',()=>{const h=pilot();const p={...pointer,active:true,sx:480,sy:140};frames(h,{},150,p);assert(Math.abs(h.x-480)<3);assert(Math.abs(h.y-140)<2);});
test('Touch stays above the finger and release settles gently',()=>{const h=pilot();const p={...pointer,active:true,used:true,type:'touch',sx:345,sy:230};frames(h,{},150,p);assert(Math.abs(h.y-174)<2);p.active=false;frames(h,{},250,p);assert(h.onGround);});
test('Fuel loss cannot sustain powered climb',()=>{const h=pilot();h.fuel=0;frames(h,{lift:true},60);assert(h.y>210);assert(h.vy>0);assert(h.spool<=.51);});
test('Small analog input provides precision movement',()=>{const h=pilot();frames(h,{axisX:.25,axisY:0},90);assert(Math.abs(h.vx-1.55)<.01);assert.equal(h.y,210);});
console.log(`${tests.length} flight handling tests passed.`);
