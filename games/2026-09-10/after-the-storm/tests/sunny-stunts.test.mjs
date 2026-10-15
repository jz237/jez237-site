import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';
test('Sunny Beach stunt layout has one ramp, twelve water rings and a distinct source route',()=>{
 const base=getCourse('greyhaven'),c=stuntCourse(base);assert.equal(base.layoutRevision,6);assert.equal(c.ramps.length,1);assert.equal(c.rings.length,12);assert.equal(c.checkpoints.length,4);assert.notDeepEqual(c.anchors,base.anchors);assert.equal(base.ramps.length,0);
 assert.ok(c.rings.every(r=>r.type==='water'&&r.absoluteY&&r.y===1.5));
 assert.ok(c.ramps[0].tx<-.99);assert.equal(c.ramps[0].x,-619*.025);assert.equal(c.ramps[0].z,-1065*.025);
 assert.equal(c.ramps[0].sourceVolumeProfile,true);assert.deepEqual(c.checkpoints.map(q=>q.limit),[15,15,15,10]);
 assert.ok(c.rings[6].x<c.ramps[0].x);assert.ok(Math.hypot(c.rings[7].x-c.rings[6].x,c.rings[7].z-c.rings[6].z)<17);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
});
test('every class selection keeps Sunny stunt geometry forward and selects its actual hazard family',()=>{
 const expected=stuntCourse(getCourse('greyhaven'));
 for(let d=0;d<4;d++){const c=stuntCourse(getCourse('greyhaven',d));assert.equal(c.reverse,false);assert.equal(c.rocks.length,8);assert.equal(c.rocks.filter(o=>!o.hidden).length,4);assert.deepEqual(c.rocks,expected.rocks);assert.deepEqual(c.gates,expected.gates);assert.deepEqual(c.ramps,expected.ramps);}
 const free=stuntCourse(getCourse('greyhaven'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);assert.equal(free.checkpoints.length,0);
});
test('ordinary controls collect all twelve Sunny rings and land the single jump in all class selections',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const s=createRace({mode:'stunt',course:getCourse('greyhaven',difficulty)}),r=s.racers[0];let rampFrames=0;const crossed=[];for(let i=0;i<9000&&s.phase!=='results';i++){const cp=r.stunt.nextCheckpoint;stepRace(s,verificationInput(s,r),1/60);rampFrames+=!!r.sourceRampContact;if(r.stunt.nextCheckpoint>cp)crossed.push(s.time);}
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,12);assert.ok(r.stunt.ringStatus.every(v=>v==='hit'));assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.ok(rampFrames>0,'the finite source ramp supplies physical contact');assert.ok(r.hydro.landingId>=1);assert.equal(r.stunt.overtime,0);
 assert.equal(crossed.length,4);for(let k=0;k<4;k++)assert.ok(crossed[k]-(crossed[k-1]??0)<=s.course.checkpoints[k].limit);}
});
