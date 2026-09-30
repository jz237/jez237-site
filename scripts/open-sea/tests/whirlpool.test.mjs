import test from 'node:test';import assert from 'node:assert/strict';
import {Whirlpool,HullCurrent} from '../../../demos/open-sea/js/whirlpool.js';
import {FishBehavior} from '../../../demos/open-sea/js/fish-behavior.js';
const boat={x:0,z:0,psi:0};
test('off by default, smooth formation/collapse and finite core',()=>{
 const w=new Whirlpool();assert.equal(w.enabled,false);
 for(const r of [0,.001,10,62,180,519,600,999,1000,1e5]){
  assert.ok(Object.values(w.sample(r,0)).every(Number.isFinite));assert.equal(w.sample(r,0).height,0);
 }
 w.setEnabled(true,boat);for(let i=0;i<120;i++)w.update(.1);
 assert.ok(w.amount>.999);assert.ok(Math.abs(w.sample(w.x,w.z).height+150)<1e-8);
 const center=[w.x,w.z];w.setEnabled(false,boat);const before=w.amount;w.update(20);
 assert.ok(before-w.amount<.008); // one long frame cannot collapse the sea
 w.setEnabled(true,{x:1000,z:2000,psi:2});assert.deepEqual([w.x,w.z],center);
 w.setEnabled(false,boat);for(let i=0;i<150;i++)w.update(.1);assert.equal(w.amount,0);
});
test('pressure surface agrees with centrifugal balance and numerical gradient',()=>{
 const w=new Whirlpool();w.x=w.z=0;w.amount=1;
 for(const r of [1,10,62,100,240,480]){
  const p=w.sample(r,0),e=.001,gradient=(w.sample(r+e,0).height-w.sample(r-e,0).height)/(2*e);
  assert.ok(Math.abs(p.sx-gradient)<1e-6);
  assert.ok(Math.abs(p.sx-p.vz*p.vz/(9.81*r))<1e-8);
  assert.ok(p.vx<0);assert.ok(p.vz>0);
 }
 for(const r of [521,620,999]){
  const p=w.sample(r,0),e=.001;assert.ok(Math.abs(p.sx-(w.sample(r+e,0).height-w.sample(r-e,0).height)/(2*e))<1e-6);
 }
 assert.ok(Object.values(w.sample(1001,0)).every(v=>v===0));
});
function trajectory(frames){
 const w=new Whirlpool();w.x=w.z=0;w.amount=1;
 const b={x:230,z:0,psi:Math.PI/2},hull=new HullCurrent();let acc=0,time=0;
 for(const dt of frames){acc+=dt;time+=dt;while(acc>=1/60-1e-12){acc-=1/60;hull.step(1/60,b,w);b.psi+=hull.omega/60;b.x+=(Math.cos(b.psi)*3+hull.vx)/60;b.z+=(Math.sin(b.psi)*3+hull.vz)/60;}}
 return {b,hull,w,time};
}
test('distributed hull forces pull inward, yaw, retain momentum and survive uneven timing',()=>{
 const even=trajectory(Array(3600).fill(1/60)),uneven=trajectory(Array(600).fill([.01,.09]).flat());
 assert.ok(Math.hypot(even.b.x,even.b.z)<120);
 assert.ok(Math.abs(even.b.psi-Math.PI/2)>.2);
 assert.ok(Math.hypot(even.hull.vx,even.hull.vz)<40);
 for(const k of ['x','z','psi'])assert.ok(Math.abs(even.b[k]-uneven.b[k])<1e-7,k);
 const speed=Math.hypot(even.hull.vx,even.hull.vz);even.w.amount=0;
 even.hull.step(1/60,even.b,even.w);assert.ok(Math.hypot(even.hull.vx,even.hull.vz)>.9*speed);
 for(let i=0;i<24000;i++)even.hull.step(1/60,even.b,even.w);
 assert.ok(Math.hypot(even.hull.vx,even.hull.vz)<.1);assert.ok(Math.abs(even.hull.omega)<.001);
});
test('fish keep local depths, upright swimming and continuous drift through a funnel cycle',()=>{
 const fs=Array.from({length:24},(_,i)=>({sp:i%3,len:.3,r:i/24,seed:i})),fish=new FishBehavior(fs),w=new Whirlpool();
 fish.update(.01,[90,0,0],true,w);w.x=w.z=0;w.enabled=true;
 let previous=fs.map(f=>[...f.p]),maxStep=0,minDepth=Infinity,maxPitch=0;
 for(let i=1;i<=1800;i++){
  if(i===900)w.enabled=false;w.update(1/30);fish.update(.01+i/30,[90,w.sample(90,0).height,0],false,w);
  for(const [j,f]of fs.entries()){
   maxStep=Math.max(maxStep,Math.hypot(...f.p.map((v,k)=>v-previous[j][k])));
   minDepth=Math.min(minDepth,w.sample(f.p[0],f.p[2]).height-f.p[1]);maxPitch=Math.max(maxPitch,Math.abs(f.heading[1]));
   assert.ok([...f.p,...f.heading,f.phase,f.finPhase].every(Number.isFinite));previous[j]=[...f.p];
  }
 }
 assert.ok(minDepth>1);assert.ok(maxPitch<=.181);assert.ok(maxStep<1.5);assert.equal(w.amount,0);
});
