import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';

test('public Sunset uses recovered buoy centers, class sequences and fixed obstacle selection',()=>{
 const colors=['LRLLRLRLRLLLRL','LRLLRLRLRLRLLRL','LRLLRLRLLRLRLLRL','LRLRLRLRLLRL'];
 const sixth=[[-3239,351],[-2873,313],[-2795,227],[-348,4722]];
 for(let d=0;d<4;d++){
  const c=getCourse('amber',d),g=c.gates.slice(1),s=createRace({course:c,difficulty:d,mode:'time'});
  assert.equal(c.layoutRevision,7);assert.equal(g.length,[14,15,16,12][d]);
  assert.equal(g.map(q=>q.side===1?'R':'L').join(''),colors[d]);
  assert.deepEqual([g[5].bx,g[5].bz],sixth[d].map(v=>v*.025));
  assert.ok(c.sourceBuoyLayout);assert.ok(s.racers[0].sourceBuoys);
  const visible=s.sourceSphereGrid.spheres.filter(q=>!q.hidden);
  assert.equal(visible.length,d===0?0:16);assert.equal(s.sourceSphereGrid.spheres.filter(q=>q.sourceBoundaryMarker).length,81);
  assert.equal(s.sourceSphereGrid.spheres.filter(q=>q.runtimeTag===5).length,6);
  if(d)assert.deepEqual([visible[0].x,visible[0].z],[1153*.025,1901*.025]);
 }
});

test('Reverse has its own driving corridor while the physical jump stays fixed',()=>{
 const normal=getCourse('amber'),expert=getCourse('amber',2),reverse=getCourse('amber',3);
 assert.notDeepEqual(expert.anchors,normal.anchors);assert.notDeepEqual(reverse.anchors,normal.anchors);
 assert.equal(expert.requiredPassage,false);
 for(const c of [expert,reverse])assert.deepEqual(c.ramps.map(q=>q.nativeRow),normal.ramps.map(q=>q.nativeRow));
 assert.equal(normal.ramps[0].tx,0);assert.equal(normal.ramps[0].tz,1);
 assert.equal(reverse.gates[0].tz,1);assert.equal(normal.gates[0].tz,-1);
});
