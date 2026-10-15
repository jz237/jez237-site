import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {stepCourseDatum} from '../course-datum.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9);
const race=(mode='race')=>createRace({mode,course:getCourse('tempest')});
const drive=(s,seconds,step=1/60)=>{for(let t=0;t<seconds-1e-9;t+=step)stepCourseDatum(s,step);};
test('the first human lap starts a discrete ebb that stops at the second-lap datum',()=>{
 const s=race();drive(s,20);assert.equal(s.courseDatum.value,0);
 s.racers[0].lap=2;drive(s,.05);close(s.courseDatum.value,-.025);
 drive(s,6);close(s.courseDatum.value,-2.5);drive(s,100);close(s.courseDatum.value,-2.5);
 s.racers[0].lap=3;drive(s,3);close(s.courseDatum.value,-3.75);
});
test('AI laps do not change the shared latch; either human can advance it in versus',()=>{
 const s=race();s.racers[1].lap=3;drive(s,10);assert.equal(s.courseDatum.value,0);
 const v=race('versus');v.racers[1].lap=2;drive(v,6);close(v.courseDatum.value,-2.5);
 assert.equal(v.racers[0].lap,1);assert.equal(v.courseDatum.completedLaps,1);
});
test('Stunt and free riding retain initial water, and pause cannot consume tide ticks',()=>{
 for(const mode of ['stunt','practice']){const s=race(mode);s.racers[0].lap=3;drive(s,100);assert.equal(s.courseDatum.value,0);}
 const s=race();s.racers[0].lap=2;s.phase='paused';for(let i=0;i<600;i++)stepRace(s,{},1/60);assert.equal(s.courseDatum.value,0);
});
test('datum update is independent of browser frame partition and new races do not share its state',()=>{
 const a=race(),b=race();a.racers[0].lap=b.racers[0].lap=2;
 drive(a,2,1/60);drive(b,2,.02);close(a.courseDatum.value,-1);close(b.courseDatum.value,-1);
 assert.notEqual(a.courseDatum,b.courseDatum);assert.equal(race().courseDatum.value,0);
});
test('tide-following hazards move with the datum while source fixed mast bases stay at their Y',()=>{
 const s=race('time');s.phase='running';s.racers[0].lap=2;
 for(let i=0;i<120;i++)stepRace(s,{},1/60);
 close(s.weather.seaLevel,-1);assert.ok(s.course.rocks.filter(q=>q.followsWaterDatum).every(q=>q.y===s.weather.seaLevel));
 assert.ok(s.course.rocks.filter(q=>!q.followsWaterDatum).every(q=>q.y===-1.25));
});
