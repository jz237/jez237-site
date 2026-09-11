import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';
import {passageCollision,passageDistance} from '../course-passages.js';

test('Port stunt conversion rebuilds forward tunnel and floor without changing race restrictions',()=>{
 const normal=getCourse('port'),expert=getCourse('port',2),c=stuntCourse(expert),x=(260-220)*.8,z=(85-285)*.8;
 assert.equal(c.layoutRevision,4);assert.equal(c.rings.length,16);assert.equal(c.ramps.length,3);assert.equal(c.checkpoints.length,4);assert.equal(c.passage.enabled,true);assert.equal(c.reverse,false);assert.equal(c.closedAreas.length,0);
 for(const ring of c.rings.slice(10,13))assert.ok(passageDistance({path:c.passage.structurePath},ring.x,ring.z)>c.passage.width+ring.radius);
 assert.ok(expert.ground(x,z)>0);assert.ok(c.ground(x,z)<-1);assert.equal(normal.passage.enabled,false);assert.equal(stuntCourse(normal).passage.enabled,true);assert.equal(normal.passage.enabled,false);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
});

test('Port stunt geometry stays forward and identical for all classes while free ride stays separate',()=>{
 const expected=stuntCourse(getCourse('port'));for(let d=0;d<4;d++){const c=stuntCourse(getCourse('port',d));assert.equal(c.reverse,false);assert.deepEqual(c.rings,expected.rings);assert.deepEqual(c.passage,expected.passage);for(const p of c.route)assert.equal(c.ground(p.x,p.z),expected.ground(p.x,p.z));}
 const free=stuntCourse(getCourse('port'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);
});

test('ordinary controls clear every Port ring, three jumps and the roofed tunnel without impacts',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
 const s=createRace({mode:'stunt',course:getCourse('port',difficulty)}),r=s.racers[0],ramps=new Set();let impacts=0,inside=0;
 for(let i=0;i<10000&&s.phase!=='results';i++){stepRace(s,verificationInput(s,r),1/60);
 if(passageCollision(s.course.passage,r.x,r.hydro.y,r.z,s.time))impacts++;
 if(passageDistance({path:s.course.passage.structurePath},r.x,r.z)<s.course.passage.width&&r.hydro.y+1.1<s.course.passage.clearance)inside++;
 if(r.hydro.onRamp)ramps.add(s.course.ramps.reduce((a,b)=>Math.hypot(r.x-a.x,r.z-a.z)<Math.hypot(r.x-b.x,r.z-b.z)?a:b).id);
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,16);assert.equal(r.stunt.chain,16);assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.completedTricks.flip,true);assert.equal(ramps.size,3);assert.equal(r.hydro.landingId,3);assert.equal(impacts,0);assert.ok(inside>600);
 }
});
