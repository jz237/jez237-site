import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {courseResistance} from '../classic-courses.js';import {createRace,stepRace} from '../race-core.js';
test('Drake has the mapped three common weed beds and three additional Expert/Reverse beds',()=>{
 const n=getCourse('reed'),h=getCourse('reed',1),e=getCourse('reed',2),r=getCourse('reed',3);assert.equal(n.resistance.length,3);assert.deepEqual(n.resistance,h.resistance);assert.equal(e.resistance.length,6);assert.deepEqual(e.resistance.slice(0,3),n.resistance);assert.equal(r.resistance.length,6);
 assert.deepEqual(e.resistance.map(p=>[p.x/.75+200,p.z/.75+240]),[[200.5,49.5],[132.5,87],[192,107.5],[20.5,175],[54.5,218.5],[24.5,249.5]]);
 for(let i=0;i<6;i++){assert.equal(r.resistance[i].x,e.resistance[i].x+3);assert.equal(r.resistance[i].z,e.resistance[i].z+2.25);assert.equal(r.resistance[i].rx,e.resistance[i].rx);}
 assert.equal(courseResistance(n,(320-200)*.75,(352-240)*.75,1),0);
});
test('extra beds slow a wet hull only in the classes that contain them',()=>{
 const c=getCourse('reed',2),p=c.resistance[3];assert.equal(courseResistance(getCourse('reed'),p.x,p.z,1),0);assert.ok(courseResistance(c,p.x,p.z,1)>.5);assert.equal(courseResistance(c,p.x,p.z,0),0);assert.equal(courseResistance(c,p.x+p.rx*1.01,p.z,1),0);
 function coast(withWeeds){const s=createRace({mode:'time',difficulty:2,course:{...c,resistance:withWeeds?c.resistance:[]}}),r=s.racers[0];s.phase='running';r.x=p.x;r.z=p.z-2;r.heading=0;r.vz=8;
  for(let i=0;i<30;i++)stepRace(s,{},1/60);return r;}
 const weeds=coast(true),clear=coast(false);assert.equal(weeds.collision,0);assert.equal(clear.collision,0);assert.ok(weeds.speed<clear.speed*.9);assert.ok(weeds.weedDrag>.5);
});
