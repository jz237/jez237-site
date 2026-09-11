import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';
import {barrierCollision} from '../course-barriers.js';

test('Fortress stunt route has fifteen rings and two forward jumps on navigable water',()=>{
 const base=getCourse('citadel'),c=stuntCourse(base);assert.equal(base.layoutRevision,6);assert.equal(base.ramps.length,0);assert.equal(c.rings.length,15);assert.equal(c.ramps.length,2);assert.equal(c.checkpoints.length,4);
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-.8,JSON.stringify(p));
 assert.ok(c.ramps[0].tx>0&&c.ramps[0].tz>0);assert.ok(c.ramps[1].tz<-.99);
});

test('Fortress stunts preserve the forward source order across every class without race cargo',()=>{
 const expected=stuntCourse(getCourse('citadel'));for(let d=0;d<4;d++){const c=stuntCourse(getCourse('citadel',d));assert.equal(c.reverse,false);assert.deepEqual(c.rings,expected.rings);assert.deepEqual(c.ramps,expected.ramps);assert.equal(c.rocks.length,0);}
 const free=stuntCourse(getCourse('citadel'),{freeRide:true});assert.equal(free.ramps.length,4);assert.equal(free.stuntLayout,undefined);
});

test('ordinary stunt controls clear every Fortress ring and all four physical arches',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
 const s=createRace({mode:'stunt',course:getCourse('citadel',difficulty)}),r=s.racers[0],ramps=new Set(),arches=new Set();let impacts=0;
 for(let i=0;i<10000&&s.phase!=='results';i++){stepRace(s,verificationInput(s,r),1/60);
 if(r.hydro.onRamp)ramps.add(s.course.ramps.reduce((a,b)=>Math.hypot(r.x-a.x,r.z-a.z)<Math.hypot(r.x-b.x,r.z-b.z)?a:b).id);
 if(barrierCollision(s.course.crossbars,r.x,r.hydro.y,r.z))impacts++;
 for(const b of s.course.crossbars){const dx=r.x-b.x,dz=r.z-b.z;if(Math.abs(dx*b.tx+dz*b.tz)<b.length/2&&Math.abs(-dx*b.tz+dz*b.tx)<b.depth/2&&r.hydro.y+1.1<b.bottom)arches.add(b.arch);}
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,15);assert.equal(r.stunt.chain,15);assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.completedTricks.flip,true);assert.equal(ramps.size,2);assert.equal(arches.size,4);assert.equal(impacts,0);
 }
});
