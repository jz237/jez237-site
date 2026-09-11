import test from 'node:test';
import assert from 'node:assert/strict';
import {demoCameraFrame} from '../demo-camera.js';
const rider=()=>({x:0,z:0,heading:0,vx:0,vz:20,hydro:{waterHeight:0}});
const delta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
test('alternating 180 degree corrections cannot whip the demo camera',()=>{const r=rider(),m={};demoCameraFrame(m,r,[r],1/60);for(let i=0;i<600;i++){r.heading=i%2?Math.PI:0;r.vz=i%2?-20:20;const old=m.heading,rate=m.rate;demoCameraFrame(m,r,[r],1/60);assert.ok(Math.abs(delta(m.heading,old))<=.45/60+1e-9);assert.ok(Math.abs(m.rate-rate)<=.65/60+1e-9);}assert.ok(Math.abs(m.heading)<.5);});
test('sustained course turn is followed without a seam flip',()=>{const r=rider(),m={};r.heading=Math.PI-.03;demoCameraFrame(m,r,[r],0);r.vx=-1;r.vz=-20;for(let i=0;i<300;i++)demoCameraFrame(m,r,[r],1/60);assert.ok(Math.abs(delta(m.heading,Math.atan2(r.vx,r.vz)))<.02);});
test('stopped or airborne hull motion does not pitch or reverse the camera',()=>{const r=rider(),m={};const a=demoCameraFrame(m,r,[r],0);r.vx=0;r.vz=0;r.heading=Math.PI;r.hydro.y=10;r.hydro.pitch=2;const b=demoCameraFrame(m,r,[r],1/60);assert.deepEqual(a,b);});
test('manual demo orbit and zoom stay within a water-facing chase view',()=>{const r=rider(),f=demoCameraFrame({},r,[r],0,{orbit:100,zoom:100,pitch:10});assert.ok(f.position.z<-20);assert.ok(Math.abs(f.position.x)<9);assert.ok(f.target.y<1);assert.ok(f.position.y<12);});
