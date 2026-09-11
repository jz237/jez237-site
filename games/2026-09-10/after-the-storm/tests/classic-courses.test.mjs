import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {courseResistance} from '../classic-courses.js';
import {createRace,stepRace} from '../race-core.js';

test('Sunny Beach has a long dry sandbar, two wet straights and open water beyond its western boundary',()=>{
 const c=getCourse('greyhaven');assert.equal(c.name,'Sunny Beach');
 for(const z of [-120,-60,0,60,120]){assert.ok(c.ground(0,z)>2);assert.ok(c.ground(-36,z)<-3);assert.ok(c.ground(39,z)<-3);assert.ok(c.ground(110,z)>2);assert.ok(c.ground(-180,z)<-5);}
 for(let d=0;d<4;d++){const v=getCourse('greyhaven',d);assert.equal(v.rocks.length,0);assert.equal(v.ramps.length,0);}
});
test('Sunset Bay has distinct L-shaped geography and a race-mode ramp with a wet bypass',()=>{
 const c=getCourse('amber');assert.equal(c.name,'Sunset Bay');assert.ok(c.ground(-34,40)>0);assert.ok(c.ground(90,127)>0);assert.ok(c.ground(65,30)<-4);
 const s=createRace({course:c}),ramp=s.course.ramps[0];assert.equal(ramp.name,'SUNSET JUMP');assert.ok(c.ground(ramp.x-15,ramp.z)<-3);assert.equal(s.mode,'race');
 const reversed=getCourse('amber',3).ramps[0];assert.equal(reversed.tz,-ramp.tz);
});
test('reconstructed routes are in water without cutting the authored shorelines',()=>{
 for(const id of ['greyhaven','amber','reed']){const c=getCourse(id);for(const p of sampleRoute(c.anchors,240))assert.ok(c.ground(p.x,p.z)<-.8,id+' '+JSON.stringify(p));}
});
test('Drake Lake weeds have bounded elliptical resistance only during water contact',()=>{
 const c=getCourse('reed'),p=c.resistance[0];assert.equal(c.name,'Drake Lake');assert.equal(c.rocks.filter(o=>o.type==='post').length,8);
 assert.ok(courseResistance(c,p.x,p.z,1)>.5);assert.equal(courseResistance(c,p.x+p.rx*1.01,p.z,1),0);assert.equal(courseResistance(c,p.x,p.z,0),0);
 assert.equal(courseResistance(c,p.x,p.z,.5),courseResistance(c,p.x,p.z,1)*.5);
 function coast(resistance){const s=createRace({mode:'time',course:{...c,resistance,ground:()=>-8,rocks:[]}}),r=s.racers[0];s.phase='running';r.x=p.x;r.z=p.z-3;r.heading=0;r.vz=10;for(let i=0;i<30;i++)stepRace(s,{},1/60);return r;}
 const weeds=coast(c.resistance),clear=coast([]);assert.ok(weeds.speed<clear.speed*.85);assert.ok(weeds.weedDrag>.5);
});
test('a hull starting overlapped by a post is separated and can drive away',()=>{
 const c=getCourse('reed'),q={x:0,z:0,r:.45,type:'post'},s=createRace({mode:'time',course:{...c,ground:()=>-8,rocks:[q],resistance:[]}}),r=s.racers[0];
 s.phase='running';r.x=r.z=0;r.vx=r.vz=0;r.heading=0;stepRace(s,{},1/60);assert.ok(Math.hypot(r.x,r.z)>=1.45);
 r.heading=Math.atan2(r.x,r.z);for(let i=0;i<120;i++)stepRace(s,{throttle:1},1/60);assert.ok(Math.hypot(r.x,r.z)>5);assert.ok(r.speed>4);
});
