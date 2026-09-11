import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';
test('Sunny Beach stunt layout has one ramp, twelve water rings and a distinct source route',()=>{
 const base=getCourse('greyhaven'),c=stuntCourse(base);assert.equal(base.layoutRevision,4);assert.equal(c.ramps.length,1);assert.equal(c.rings.length,12);assert.equal(c.checkpoints.length,4);assert.notDeepEqual(c.anchors,base.anchors);assert.equal(base.ramps.length,0);
 assert.ok(c.rings.every(r=>r.type==='water'));assert.ok(c.ramps[0].tz>.99);assert.ok(c.ramps[0].z>c.checkpoints[1].z);
 assert.ok(c.rings[6].z>c.ramps[0].z);assert.ok(Math.hypot(c.rings[7].x-c.rings[6].x,c.rings[7].z-c.rings[6].z)<17);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
});
test('every class selection keeps Sunny stunt geometry forward and removes race-only hazards',()=>{
 const expected=stuntCourse(getCourse('greyhaven'));
 for(let d=0;d<4;d++){const c=stuntCourse(getCourse('greyhaven',d));assert.equal(c.reverse,false);assert.equal(c.rocks.length,0);assert.deepEqual(c.gates,expected.gates);assert.deepEqual(c.ramps,expected.ramps);}
 const free=stuntCourse(getCourse('greyhaven'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);assert.equal(free.checkpoints.length,0);
});
test('ordinary controls collect all twelve Sunny rings and land the single jump in all class selections',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const s=createRace({mode:'stunt',course:getCourse('greyhaven',difficulty)}),r=s.racers[0];for(let i=0;i<9000&&s.phase!=='results';i++)stepRace(s,verificationInput(s,r),1/60);
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,12);assert.ok(r.stunt.ringStatus.every(v=>v==='hit'));assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.completedTricks.flip,true);assert.ok(r.hydro.landingId>=1);}
});
