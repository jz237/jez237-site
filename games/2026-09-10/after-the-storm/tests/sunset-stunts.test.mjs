import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';
import {barrierCollision} from '../course-barriers.js';
test('Sunset stunt layout has nine rings, two jumps, pier stations and a separate boundary',()=>{
 const base=getCourse('amber'),c=stuntCourse(base);assert.equal(base.layoutRevision,5);assert.equal(c.rings.length,9);assert.equal(c.ramps.length,2);assert.equal(c.checkpoints.length,4);assert.notDeepEqual(c.boundary,base.boundary);assert.equal(base.ramps.length,1);
 assert.ok(c.ramps[0].z>c.crossbars[0].z&&c.ramps[0].z<c.crossbars[1].z);assert.ok(c.ramps[0].tz>.99);assert.ok(c.ramps[1].tx>.99);
 assert.ok(c.rings[4].z>c.ramps[0].z);assert.ok(c.rings[5].z<c.crossbars[1].z);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
});
test('Sunset stunt geometry remains forward and excludes race-only metal hazards in every class',()=>{
 const expected=stuntCourse(getCourse('amber'));for(let d=0;d<4;d++){const c=stuntCourse(getCourse('amber',d));assert.equal(c.reverse,false);assert.deepEqual(c.gates,expected.gates);assert.deepEqual(c.rings,expected.rings);assert.equal(c.rocks.length,0);}
 const free=stuntCourse(getCourse('amber'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);
});
test('ordinary controls cross both piers, launch both ramps and collect every Sunset ring',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const s=createRace({mode:'stunt',course:getCourse('amber',difficulty)}),r=s.racers[0],ramps=new Set(),piers=new Set();
 for(let i=0;i<10000&&s.phase!=='results';i++){stepRace(s,verificationInput(s,r),1/60);
 if(r.hydro.onRamp){const ramp=s.course.ramps.reduce((a,b)=>Math.hypot(r.x-a.x,r.z-a.z)<Math.hypot(r.x-b.x,r.z-b.z)?a:b);ramps.add(ramp.id);}
 s.course.crossbars.forEach((p,j)=>{const dx=r.x-p.x,dz=r.z-p.z,along=dx*p.tx+dz*p.tz,across=-dx*p.tz+dz*p.tx;if(Math.abs(along)<p.length/2-1&&Math.abs(across)<.5&&r.hydro.y+1.1<p.bottom&&!barrierCollision([p],r.x,r.hydro.y,r.z))piers.add(j);});
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,9);assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.equal(ramps.size,2);assert.equal(piers.size,2);assert.equal(r.stunt.completedTricks.flip,true);
 }
});
