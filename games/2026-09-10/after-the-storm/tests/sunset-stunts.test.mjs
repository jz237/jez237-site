import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';

// Full physical nine-ring/two-ramp/two-pier runs live in source-sunset-integration.
test('public Sunset Stunt retains recovered ring heights, two jumps and four original timers',()=>{
 const c=createRace({mode:'stunt',course:getCourse('amber')}).course;
 assert.equal(c.layoutRevision,7);assert.equal(c.rings.length,9);assert.equal(c.ramps.length,2);
 assert.deepEqual(c.checkpoints.map(q=>q.limit),[15,15,10,10]);
 assert.deepEqual(c.rings.map(q=>q.y),[1.5,1.5,1.5,1.5,5,2.5,1.5,1.5,1.5]);
 assert.equal(c.contactVolumes.volumes.filter(q=>q.kind==='crossbar').length,2);
 assert.equal(c.contactVolumes.volumes.filter(q=>q.kind==='ramp').length,12);
 assert.ok(c.ramps[0].tz>.99);assert.ok(c.ramps[1].tx>.99);
 assert.equal(c.waveTrain,undefined);
});

test('Stunt uses one forward course in every class and Free Ride keeps independent scoring',()=>{
 const expected=createRace({mode:'stunt',course:getCourse('amber')}).course;
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({mode:'stunt',difficulty,course:getCourse('amber',difficulty)}),c=s.course;
  assert.equal(c.reverse,false);assert.deepEqual(c.rings,expected.rings);assert.deepEqual(c.checkpoints,expected.checkpoints);
  assert.equal(c.rocks.filter(q=>!q.hidden).length,0);assert.equal(s.racers[0].sourceBuoys,undefined);
  assert.equal(s.raceWater.rollers.length,3);
 }
 const free=createRace({mode:'practice',course:getCourse('amber')});
 assert.equal(free.course.ramps.length,4);assert.equal(free.racers[0].sourceBuoys,undefined);assert.equal(free.course.checkpoints.length,0);
});
