import test from 'node:test';
import assert from 'node:assert/strict';
import {carveLoad,speedLens} from '../contact-cues.js';
import {sprayLaunch} from '../hull-spray.js';
import {rideSoundMix} from '../ride-sound.js';
import {chaseFrame} from '../chase-camera.js';
import {riderMotion} from '../rider-motion.js';
const rider=()=>({x:0,z:0,heading:0,vx:0,vz:24,speed:24,turn:1,yawVelocity:.5,throttle:1,hydro:{y:.2,vy:0,waterHeight:0,waterVelocity:0,wet:1,portWet:1,starboardWet:1,load:1,impact:0,landingId:0}});
test('carving loads the outside chine; dry, stationary and airborne hulls cannot carve',()=>{
 const r=rider();assert.ok(carveLoad(r,-1)>.6);assert.equal(carveLoad(r,1),0);
 const mirror={...r,yawVelocity:-r.yawVelocity};assert.equal(carveLoad(r,-1),carveLoad(mirror,1));
 for(const altered of [{...r,vz:0},{...r,hydro:{...r.hydro,airborne:true}},{...r,hydro:{...r.hydro,portWet:0}}])assert.equal(carveLoad(altered,-1),0);
 const before=structuredClone(r);carveLoad(r,-1);assert.deepEqual(r,before);
});
test('outside carve spray fans outward with world momentum; straight running stays symmetric',()=>{
 const r=rider(),left=sprayLaunch(r,'chine',-1,()=>.5),right=sprayLaunch(r,'chine',1,()=>.5);
 assert.ok(-left.vx>right.vx+2);assert.ok(left.vy>right.vy);assert.ok(left.vz>right.vz);
 r.yawVelocity=0;const a=sprayLaunch(r,'chine',-1,()=>.5),b=sprayLaunch(r,'chine',1,()=>.5);
 assert.equal(a.vx,-b.vx);assert.equal(a.vy,b.vy);assert.equal(a.vz,b.vz);
});
test('speed lens retains useful headroom above normal pace and has bounded endpoints',()=>{
 assert.equal(speedLens(0),58);assert.equal(speedLens(100),70);assert.ok(speedLens(40)>speedLens(27)+3);
 for(let speed=0;speed<100;speed+=.25){assert.ok(speedLens(speed+.25)>=speedLens(speed));assert.ok(speedLens(speed+.25)-speedLens(speed)<.11);}
});
test('landing audio attacks once, decays and does not retrigger on replay rewind',()=>{
 const r=rider(),m={};rideSoundMix(m,r,0,0);r.hydro.impact=10;r.hydro.landingId=1;
 const hit=rideSoundMix(m,r,0,1/60);assert.ok(hit.slap>.1&&hit.drain>0);
 let end;for(let i=2;i<120;i++)end=rideSoundMix(m,r,0,i/60);assert.ok(end.slap<hit.slap*.001);
 const replay=rideSoundMix(m,r,0,.1);assert.equal(replay.slap,0);assert.equal(replay.drain,0);
});
test('high-speed chase keeps selected zoom and ignores hull roll for horizon framing',()=>{
 const r=rider();r.vz=48;r.yawVelocity=0;const a=chaseFrame({},r,0,{zoom:8});r.hydro.roll=2;r.hydro.pitch=2;
 const b=chaseFrame({},r,0,{zoom:8});assert.deepEqual(a,b);assert.equal(a.position.z,-8);assert.equal(a.fov,70);assert.ok(a.position.y>2&&a.target.z>7);
});
test('rider transfers weight during real turns and releases it while airborne',()=>{
 const m={};let pose;const sample={speed:24,yawVelocity:.5,wet:1};
 for(let i=0;i<120;i++)pose=riderMotion(m,i/60,1,sample);assert.ok(pose.cornerLean>.05);
 for(let i=120;i<300;i++)pose=riderMotion(m,i/60,1,{...sample,airborne:true});assert.ok(pose.cornerLean<.001);
});
