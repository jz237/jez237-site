import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativeRaceStartup,createNativeRaceState} from '../native-race-state.js';
function hash(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}

test('all32 ordinary course/class/player resets match complete original race and HUD words',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-ordinary-reset-reference.json',import.meta.url)));
 assert.equal(ref.checks.length,32);
 for(const c of ref.checks){
  const course=getCourse(c.id,c.difficulty),before=structuredClone(course.boundaryMarkers),runtime=createNativeRaceCourseRuntime({course,difficulty:c.difficulty,players:c.players});
  const race=createRace({physics:'native',mode:c.players===2?'versus':'time',course,difficulty:c.difficulty}),s=race.nativeLaunch.snapshot();
  s.scene.cold8224=1;s.scene.clockStopped817c=0;
  const actual=prepareNativeRaceStartup(runtime.resetLayout,createNativeRaceState(s)).state;
  for(const key of ['raceWords1f94','hudWords7788'])assert.equal(hash(actual[key]),c.hashes[key],`${c.id}/${c.difficulty}/${c.players}/${key}`);
  assert.deepEqual(course.boundaryMarkers,before);
  assert.equal(runtime.resetLayout.boundaryNativeXZ.length,runtime.objectStartup.counts.fixedSphereCountC938);
  for(let slot=0;slot<c.players;slot++)assert.equal(actual.raceWords1f94[(0x2bfc-0x1f94)/4+slot*222],['tempest','glacier'].includes(c.id)?20000:15000);
 }
});

test('source reset retains hidden Sunset fixed rows while authored diagnostics keep their explicit markers',()=>{
 const course=getCourse('amber'),source=createNativeRaceCourseRuntime({course,difficulty:0,players:2});
 const positions=source.resetLayout.boundaryNativeXZ;
 assert.equal(Math.min(...positions.map(p=>p.z)),-32768);assert.equal(Math.max(...positions.map(p=>p.z)),29377);
 const authored=createNativeRaceCourseRuntime({course,difficulty:0,players:2,objectLayout:'authored'}),scale=course.sourceBuoyLayout.scale;
 assert.deepEqual(authored.resetLayout.boundaryNativeXZ,course.boundaryMarkers.map(([x,z])=>({x:Math.fround(x/scale),z:Math.fround(z/scale)})));
 assert.equal(authored.objectStartup,null);
});
