import test from 'node:test';
import assert from 'node:assert/strict';
import {chaseFrame,translateFollow} from '../chase-camera.js';
import {demoCameraFrame} from '../demo-camera.js';
import {PerspectiveCamera,Vector3} from '../vendor/three.module.js';

for(const fps of [30,60,144])test(`close chase preserves selected distance at speed (${fps} Hz)`,()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:27,yawVelocity:0,hydro:{y:.3,waterHeight:0}};
 const framing={},tracking={},position={x:0,y:3,z:-8},target={x:0,y:1,z:5};
 translateFollow(tracking,r,position,target);
 for(let i=0;i<fps*5;i++){
  r.z+=27/fps;translateFollow(tracking,r,position,target);
  const f=chaseFrame(framing,r,1/fps,{zoom:8}),a=1-Math.exp(-4/fps);
  for(const k of ['x','y','z']){position[k]+=(f.position[k]-position[k])*a;target[k]+=(f.target[k]-target[k])*a;}
 }
 assert.ok(Math.abs(r.z-position.z-8)<.001,'forward motion must not add 6.75 metres of hidden smoothing lag');
 const snapshot={...position};translateFollow(tracking,r,position,target);assert.deepEqual(position,snapshot);
});
test('split follow memories and recovery translations stay independent',()=>{
 const a={},b={},p={x:0,z:-8},q={x:50,z:-8},look={x:0,z:3},look2={x:50,z:3};
 translateFollow(a,{x:0,z:0},p,look);translateFollow(b,{x:50,z:0},q,look2);
 translateFollow(a,{x:10,z:100},p,look);assert.deepEqual(p,{x:10,z:92});assert.deepEqual(q,{x:50,z:-8});
});
test('demo supports a rider-readable close framing without removing wide views',()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:20,hydro:{waterHeight:0}};
 const close=demoCameraFrame({},r,[r],0,{zoom:8.2}),wide=demoCameraFrame({},r,[r],0,{zoom:24});
 assert.ok(Math.abs(close.position.z+8.2)<1e-8);assert.ok(wide.position.z<=-24);
 assert.ok(close.position.y>1&&close.position.y<3);
});
test('close demo gently reframes a jump without inheriting hull pitch or roll',()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:20,hydro:{waterHeight:0,y:.3,airborne:false}},m={};
 const a=demoCameraFrame(m,r,[r],0,{zoom:8.2});
 r.hydro={...r.hydro,y:5,airborne:true,pitch:2,roll:2};
 const first=demoCameraFrame(m,r,[r],1/60,{zoom:8.2});
 assert.ok(first.target.y>a.target.y&&first.target.y-a.target.y<.2);
 let f;for(let i=0;i<60;i++)f=demoCameraFrame(m,r,[r],1/60,{zoom:8.2});
 assert.equal(f.position.x,a.position.x);assert.equal(f.position.z,a.position.z);assert.ok(f.target.y>2.8&&f.target.y<3.2);
 r.hydro.airborne=false;for(let i=0;i<180;i++)f=demoCameraFrame(m,r,[r],1/60,{zoom:8.2});assert.ok(Math.abs(f.target.y-a.target.y)<.001);
});

for(const fps of [30,60,144])test(`a tall fixed-ramp jump retains the rider in the close frame (${fps} Hz)`,()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:20,yawVelocity:0,hydro:{y:.3,waterHeight:0}},memory={},tracking={};
 const position={x:0,y:3,z:-8},target={x:0,y:1,z:5},cam=new PerspectiveCamera(62,16/9,.15,1800);
 const update=()=>{translateFollow(tracking,r,position,target);const f=chaseFrame(memory,r,1/fps),a=1-Math.exp(-4/fps),b=1-Math.exp(-5/fps);for(const k of ['x','y','z']){position[k]+=(f.position[k]-position[k])*a;target[k]+=(f.target[k]-target[k])*b;}};
 for(let i=0;i<fps*3;i++){r.z+=20/fps;update();}
 // A realistic unpowered ballistic rise reaches the source-ramp inspection's
 // 6.5m apex. Only the camera receives the rider, never the physics state.
 for(let i=1;i<=Math.round(fps*11/9.81);i++){const t=i/fps;r.z+=20/fps;r.hydro.y=.3+11*t-4.905*t*t;r.hydro.airborne=true;update();}
 cam.position.set(position.x,position.y,position.z);cam.lookAt(target.x,target.y,target.z);cam.updateMatrixWorld();
 const head=new Vector3(r.x,r.hydro.y+1.7,r.z).project(cam),hull=new Vector3(r.x,r.hydro.y,r.z).project(cam);
 assert.ok(head.y<.9&&hull.y>-.8,JSON.stringify({head:head.y,hull:hull.y}));assert.equal(cam.up.z,0);
});
