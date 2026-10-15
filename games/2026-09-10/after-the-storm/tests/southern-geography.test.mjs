import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {polygonDistance} from '../classic-courses.js';
import {volumeContact} from '../clipped-volumes.js';
import {recoverToWater} from '../shore-recovery.js';
import {waterLevel} from '../simulation.js';

test('Southern shares59 finite shore edges,305 static planes and17 fixed solid volumes',()=>{
 const c=getCourse('tempest'),s=createRace({mode:'time',course:c});
 assert.equal(c.name,'Southern Island');assert.equal(c.shoreContacts.edges.length,59);
 assert.equal(c.layoutRevision,5);assert.equal(c.waterModelRevision,1);
 assert.equal(c.staticSurfaces.reduce((n,q)=>n+q.triangles.length,0),287);assert.equal(c.contactWalls.triangles.length,18);
 assert.equal(s.course.contactVolumes.volumes.length,20);assert.equal(c.crossbars,undefined);
 assert.equal(c.ground(0,0),-8);assert.equal(c.renderGround(0,0),1.25,'raised ribbon is separate from water depth');
 assert.equal(c.landGround(0,0),-8);assert.equal(c.authoredBackground.raisedShoreHeight,1.25);
});
test('source fixed pier opens below its finite deck when the water falls',()=>{
 const s=createRace({mode:'time',course:getCourse('tempest')}),pier=s.course.contactVolumes.volumes.find(q=>q.id==='southern-solid-14');
 assert.ok(volumeContact(pier,[0,0,125]));assert.equal(volumeContact(pier,[0,-2.5,125]),null);
 assert.equal(volumeContact(pier,[0,2,125]),null);assert.equal(pier.bounds.max[1],1.25);
});
test('source ship remains fixed, partly submerged and independently supported by its solid deck',()=>{
 const s=createRace({mode:'time',course:getCourse('tempest')}),boat=s.course.boat,deck=s.course.contactVolumes.volumes.find(q=>q.id==='southern-solid-13');
 assert.equal(boat.followsWaterDatum,false);assert.equal(boat.decks[0].y,-1.25);assert.equal(boat.decks[0].staticSupport,true);
 for(const level of [0,-2.5,-3.75]){waterLevel.value=level;assert.equal(deck.bounds.max[1],-1.25);assert.equal(boat.hull.upperY,-1.25);}
 assert.ok(volumeContact(deck,[7.95,-1.3,-124.15]));assert.equal(volumeContact(deck,[7.95,1.5,-124.15]),null);
 assert.equal(s.course.ramps.length,1);assert.deepEqual(s.course.ramps[0].nativeRow,[-641,3733,0,0,45]);
});
test('one-player and two-player select the correct distinct source mast hazards',()=>{
 const c=getCourse('tempest'),one=createRace({mode:'time',course:c}),two=createRace({mode:'versus',course:c});
 assert.equal(one.course.rocks.length,107);assert.equal(two.course.rocks.length,105);
 for(const course of [one.course,two.course]){assert.equal(course.rocks.filter(q=>q.runtimeTag===4).length,26);assert.equal(course.rocks.filter(q=>q.sourceBoundaryMarker).length,79);}
 assert.equal(one.course.rocks.filter(q=>q.runtimeTag===5).length,2);assert.equal(two.course.rocks.filter(q=>q.runtimeTag===5).length,0);
 assert.equal(one.course.contactVolumes.volumes.length,20);assert.equal(two.course.contactVolumes.volumes.length,20);
 assert.equal(one.course.playerCount,1);assert.equal(two.course.playerCount,2);assert.notEqual(one.course.rocks,two.course.rocks);
 assert.equal(one.course.rocks.filter(q=>!q.followsWaterDatum).length,2);assert.ok(two.course.rocks.every(q=>q.followsWaterDatum));
});
test('rescue rejects a saved point inside the height-independent raised pier',()=>{
 const s=createRace({mode:'time',course:getCourse('tempest')}),r=s.racers[0];
 r.x=62.5;r.z=75;r.lastWater={x:r.x,z:r.z,heading:0};assert.ok(recoverToWater(s,r));
 assert.ok(s.course.sourceShores.every(q=>polygonDistance(q.outline,r.x,r.z)>1));
});
test('four-rider ordinary-input races complete all source classes with zero human misses',async t=>{
 for(const difficulty of [0,1,2,3])await t.test(['Normal','Hard','Expert','Reverse'][difficulty],()=>{
  const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];
  for(let i=0;i<24000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.lap,4);assert.equal(r.passed,3*s.course.gates.length);
  assert.equal(s.courseDatum.value,-3.75);
 });
});
