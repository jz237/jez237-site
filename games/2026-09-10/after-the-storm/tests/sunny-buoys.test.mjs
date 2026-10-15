import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const native=g=>[Math.round(g.bx/.025),Math.round(g.bz/.025),g.side];
test('Sunny Beach preserves source buoy counts, colors and forward progression',()=>{
 for(let d=0;d<4;d++){
  const c=getCourse('greyhaven',d),g=c.gates.slice(1);
  assert.equal(g.length,d===3?11:13);
  assert.equal(g.map(g=>g.side===1?'R':'L').join(''),d===3?'RLLRLRLRLRL':'LRLLRLRLRLLLR');
  for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);
 }
 assert.deepEqual(native(getCourse('greyhaven',0).gates[5]),[3203,-780,1]);
 assert.deepEqual(native(getCourse('greyhaven',1).gates[5]),[3220,-982,1]);
 assert.deepEqual(native(getCourse('greyhaven',2).gates[12]),[-4995,814,-1]);
 assert.deepEqual(native(getCourse('greyhaven',3).gates[10]),[4457,1061,1]);
});
test('Sunny Beach metal barriers match each class and remain separate from buoy progress',()=>{
 for(let d=0;d<4;d++){
  const c=getCourse('greyhaven',d),visible=c.rocks.filter(o=>!o.hidden),fixed=c.rocks.filter(o=>o.hidden);
  assert.equal(visible.length,[0,3,5,5][d]);assert.equal(fixed.length,4);
  assert.ok(visible.every(o=>o.type==='ball'&&o.fixedSphere&&Math.abs(o.x+58.3)<.001));
  assert.deepEqual(fixed.map(o=>o.sourceNativeXYZ),[[7582,23,292],[7483,18,659],[-7136,20,779],[-7272,13,424]]);
 }
});
test('all Sunny Beach class races finish the original slalom without missed buoys',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse('greyhaven',difficulty),difficulty}),r=s.racers[0];
  for(let i=0;i<24000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
 }
});

test('starting each Sunny mode selects the source collision and render families independently',()=>{
 const n=getCourse('greyhaven',0),stunt=createRace({mode:'stunt',course:n}),race=createRace({mode:'race',course:n}),two=createRace({mode:'versus',course:n});
 assert.equal(race.course.rocks.length,4);assert.equal(stunt.course.rocks.length,8);assert.equal(two.course.rocks.length,4);
 assert.equal(stunt.course.rocks.filter(q=>!q.hidden).length,4);
 assert.equal(race.course.sourceDecorations.length,16);assert.equal(stunt.course.sourceDecorations.length,16);assert.equal(two.course.sourceDecorations.length,0);
 assert.equal(stunt.course.contactVolumes.volumes.length,6);assert.equal(race.course.contactVolumes.volumes.length,0);assert.equal(two.course.contactVolumes.volumes.length,0);
 assert.deepEqual(stunt.course.rocks.filter(q=>q.hidden),race.course.rocks);
 assert.equal(n.layoutRevision,6);assert.equal(n.integrationReady,true);assert.equal(n.navigation.validated,true);
 assert.equal(n.boundaryMetadata.nativeCourseOutRuleRecovered,false);
});
