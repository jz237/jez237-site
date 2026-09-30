import test from 'node:test';
import assert from 'node:assert/strict';
import {HullSprayMotion} from '../../../demos/open-sea/js/hull-spray-motion.js';
const field={sample:()=>({height:0})};
function yacht(){return{x:0,y:0,z:0,speed:0,current:{vx:0,vz:0},axes:{bow:[1,0,0],up:[0,1,0],sb:[0,0,1]},toWorld:p=>[...p]};}
function feed(m,y,time,height){m.noteProbe(y,time);m.feed({points:Array(8).fill([0,0]).concat(m.points(y)),get:()=>[height,0,0]},y,time,field);}

test('drop inertia under gravity and drag is independent of uneven frame subdivision',()=>{
 const make=()=>{const m=new HullSprayMotion();m.particles=[{p:[2,10,-3],v:[7,3,-4],age:0,life:5,sea:0,macro:0,size:.02}];return m;};
 const even=make(),uneven=make(),wind=[5,-3];
 for(let i=0;i<60;i++)even.update(1/60,wind,field);
 for(let i=0;i<10;i++)for(const dt of [.003,.049,.011,.037])uneven.update(dt,wind,field);
 for(const key of ['p','v'])for(let k=0;k<3;k++)assert.ok(Math.abs(even.particles[0][key][k]-uneven.particles[0][key][k])<1e-10);
 assert.ok(even.particles[0].v[1]<0,'Droplets fall after their brief upward impact motion');
});

test('calm stationary contact does not emit; rising contact emits short lived finite droplets',()=>{
 const m=new HullSprayMotion(),y=yacht();feed(m,y,0,0);for(let i=1;i<20;i++)feed(m,y,i*.05,0);assert.equal(m.particles.length,0);
 feed(m,y,1,0);feed(m,y,1.05,.3);assert.ok(m.particles.length>0);assert.ok(m.particles.every(p=>p.size<=.035&&p.life<=1.25&&p.p[1]>.3));
 const born=m.particles.length;m.update(5,[0,0],field);assert.equal(m.particles.length,born,'Hitches use bounded elapsed time');
 for(let i=0;i<20;i++)m.update(.1,[0,0],field);assert.equal(m.particles.length,0,'Droplets expire rather than becoming persistent foam');
});

test('delayed probes cannot create impact bursts and repeated crests remain bounded',()=>{
 const m=new HullSprayMotion(),y=yacht();feed(m,y,0,0);feed(m,y,2,4);assert.equal(m.particles.length,0);
 y.speed=12;for(let i=1;i<=200;i++)feed(m,y,2+i*.05,i%2?.5:0);
 assert.ok(m.particles.length>0&&m.particles.length<=512);assert.ok(m.particles.every(p=>[...p.p,...p.v,p.age,p.life].every(Number.isFinite)));
 for(const dt of [NaN,Infinity,-1,2,.001,.1])m.update(dt,[12,-7],field);
 assert.ok(m.particles.every(p=>[...p.p,...p.v,p.age,p.life].every(Number.isFinite)));
});
