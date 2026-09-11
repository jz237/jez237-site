import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';

test('Drake source layout preserves sixteen rings and three consecutive jumps on a wet route',()=>{
 const base=getCourse('reed'),c=stuntCourse(base);
 assert.equal(base.layoutRevision,4);assert.equal(base.ramps.length,0);assert.equal(c.rings.length,16);assert.equal(c.ramps.length,3);assert.equal(c.checkpoints.length,4);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
 assert.ok(c.ramps.every(r=>r.tx===0&&r.tz===1));assert.ok(c.ramps[0].z<c.ramps[1].z&&c.ramps[1].z<c.ramps[2].z);
 assert.equal(c.rocks.length,13);assert.ok(c.rocks.every(r=>r.type==='post'));assert.equal(c.resistance.length,3);
});

test('Drake stunt posts, weeds and ring order remain forward across class selections',()=>{
 const expected=stuntCourse(getCourse('reed'));
 for(let d=0;d<4;d++){const c=stuntCourse(getCourse('reed',d));assert.equal(c.reverse,false);assert.deepEqual(c.rings,expected.rings);assert.deepEqual(c.rocks,expected.rocks);assert.deepEqual(c.resistance,expected.resistance);}
 const free=stuntCourse(getCourse('reed'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);
});

test('ordinary controls collect all Drake rings and land each grouped jump without a stunt crash',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
 const s=createRace({mode:'stunt',course:getCourse('reed',difficulty)}),r=s.racers[0],ramps=new Set();
 for(let i=0;i<10000&&s.phase!=='results';i++){stepRace(s,verificationInput(s,r),1/60);if(r.hydro.onRamp){const ramp=s.course.ramps.reduce((a,b)=>Math.hypot(r.x-a.x,r.z-a.z)<Math.hypot(r.x-b.x,r.z-b.z)?a:b);ramps.add(ramp.id);}}
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,16);assert.equal(r.stunt.chain,16);assert.equal(r.stunt.nextCheckpoint,4);assert.equal(ramps.size,3);assert.equal(r.hydro.landingId,3);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.completedTricks.flip,true);
 }
});
