import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {courseResistance} from '../classic-courses.js';
import {createRace,stepRace,adjudicateGate} from '../race-core.js';
import {passageTarget} from '../course-passages.js';

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
 for(const id of ['greyhaven','amber','reed','citadel','port']){const c=getCourse(id);for(const p of sampleRoute(c.anchors,240))assert.ok(c.ground(p.x,p.z)<-.8,id+' '+JSON.stringify(p));}
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
test('Marine Fortress has an eastern arm, distinct crate counts and a curved inner route',()=>{
 const c=getCourse('citadel');assert.equal(c.name,'Marine Fortress');assert.ok(c.ground(110,-63)>0);assert.ok(c.ground(155,-63)<-3);assert.ok(c.ground(-15,85)>0);
 assert.equal(c.rocks.filter(o=>o.type==='crate').length,3);assert.equal(getCourse('citadel',1).rocks.length,7);assert.equal(getCourse('citadel',2).rocks.length,10);
 assert.ok(c.passage.path.length>5);assert.equal(c.passage.structurePath.length,2);assert.ok(c.passage.path.some(p=>p.x<-60));
});
test('a late gate opening cannot redirect a rider already committed to the outer route',()=>{
 const s=createRace({course:getCourse('citadel',1)}),p=s.course.passage,r=s.racers[0],g=s.course.gates[p.first];s.time=30;r.next=p.first;r.x=g.x+g.tx*2;r.z=g.z+g.tz*2;
 assert.equal(adjudicateGate(s,r,g.x-g.tx*2,g.z-g.tz*2),true);assert.equal(r.passageRoute,'outer');
 s.passageOpenedAt=31;s.time=40;assert.equal(passageTarget(s,r),s.course.gates[r.next]);assert.equal(r.passed,1);
});
test('curved shortcut progress requires crossing each actual checkpoint plane',()=>{
 const s=createRace({course:getCourse('citadel',2)}),p=s.course.passage,r=s.racers[0];s.time=70;s.passageOpenedAt=60;r.passageRoute='open';r.next=p.indices[3];const g=p.branchGates[r.next];r.x=g.x;r.z=g.z;
 assert.equal(adjudicateGate(s,r,r.x,r.z),false);assert.equal(r.passed,0);
 r.x=g.x+g.tx*2;r.z=g.z+g.tz*2;assert.equal(adjudicateGate(s,r,g.x-g.tx*2,g.z-g.tz*2),true);assert.equal(r.passed,1);
});
test('an airborne hull clears a low breakwater but contacts it when it descends',()=>{
 const c=getCourse('greyhaven'),s=createRace({mode:'time',course:{...c,ground:()=>1,rocks:[]}}),r=s.racers[0];s.phase='running';r.hydro.initialized=true;r.hydro.y=8;r.hydro.vy=0;
 stepRace(s,{},1/60);assert.equal(r.collision,0);assert.ok(r.hydro.y>7);
 r.hydro.y=.9;r.hydro.vy=-2;stepRace(s,{},1/60);assert.ok(r.collision>0);
});

test('Port Blue preserves the tanker, dock basin and narrow winding inner channel',()=>{
 const c=getCourse('port',2);assert.equal(c.name,'Port Blue');assert.ok(c.ground((125-220)*.8,(300-285)*.8)>4);
 assert.ok(c.ground((385-220)*.8,(245-285)*.8)<-3);assert.ok(c.ground((310-220)*.8,(170-285)*.8)>4);
 assert.ok(c.shipOutline.length>8);assert.ok(c.passage.continuous);assert.ok(c.passage.structurePath.length>8);
 for(const q of c.passage.path)assert.ok(c.ground(q.x,q.z)<-3);
});
