import test from 'node:test';import assert from 'node:assert/strict';import {getCourse} from '../courses.js';import {outsideCourse,courseDistance,createRace,stepRace} from '../race-core.js';
const world=([x,z])=>[(x-210)*.8,(z-300)*.8];
test('Fortress perimeter admits the mapped broad western water and rejects water beyond its eastern edge',()=>{
 for(let d=0;d<4;d++){const c=getCourse('citadel',d);assert.equal(c.boundary.length,36);for(const p of [[25,400],[300,400],[180,540],[80,273]])assert.equal(outsideCourse(c,...world(p)),false);for(const p of [[0,400],[325,400],[200,70],[200,550]])assert.equal(outsideCourse(c,...world(p)),true);}
 const c=getCourse('citadel');assert.ok(courseDistance(c,...world([25,400]))>30,'old checkpoint-distance boundary incorrectly excluded this water');
});
test('remaining beyond the mapped perimeter still triggers the five-second retirement',()=>{
 const c=getCourse('citadel'),s=createRace({course:c,mode:'time'}),r=s.racers[0];s.phase='running';[r.x,r.z]=world([0,400]);for(let i=0;i<330&&!r.dq;i++)stepRace(s,{},1/60);assert.equal(r.dq,'Outside course for five seconds');
});
