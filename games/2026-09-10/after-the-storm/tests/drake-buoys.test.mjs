import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const pixel=g=>[Math.round(g.bx/.75+200),Math.round(g.bz/.75+240),g.side];
test('Drake Lake retains each original class buoy count and ordered color sequence',()=>{
 const colors=['LRLLLRLRLRRL','LRLLLRLRLRRLR','LRLLLRLRLLRLRLRL','LRLRLRLLRLRLLLRL'];
 for(let d=0;d<4;d++){const c=getCourse('reed',d);assert.equal(c.gates.length,[13,14,17,17][d]);assert.equal(c.gates.slice(1).map(g=>g.side===1?'R':'L').join(''),colors[d]);for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);}
 assert.deepEqual(pixel(getCourse('reed',0).gates[9]),[51,343,-1]);assert.deepEqual(pixel(getCourse('reed',1).gates[12]),[250,393,-1]);assert.deepEqual(pixel(getCourse('reed',2).gates[13]),[229,367,1]);assert.deepEqual(pixel(getCourse('reed',3).gates[4]),[238,411,1]);
});
test('Hard and Expert have distinct post-field routes without acquiring tunnel rules',()=>{
 const n=getCourse('reed'),h=getCourse('reed',1),e=getCourse('reed',2),r=getCourse('reed',3);assert.notDeepEqual(n.anchors,h.anchors);assert.notDeepEqual(h.anchors,e.anchors);assert.deepEqual(r.anchors,n.anchors);for(const c of [n,h,e,r]){assert.equal(c.requiredPassage,false);assert.equal(c.rocks.length,13);assert.equal(c.ramps.length,0);assert.equal(c.resistance.length,2);}
});
test('all Drake classes finish the mapped three-lap sequence without missed buoys',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const c=getCourse('reed',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0],postLaps=new Set();let postHits=0;
  for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,aiInput(s,r),1/60);if(r.x> -22&&r.x<76&&r.z>80&&r.z<130){postLaps.add(r.lap);postHits+=r.collision>0;}}
  assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,c.gates.length*3);assert.equal(r.lap,4);assert.deepEqual([...postLaps],[1,2,3]);assert.equal(postHits,0,'class '+difficulty+' post contacts');
 }
});

test('Post-field approach waypoints never award checkpoint or lap progress',()=>{
 for(const [difficulty,index] of [[0,12],[1,12],[3,3]]){const s=createRace({course:getCourse('reed',difficulty),difficulty}),r=s.racers[0],a=s.course.gates[index].approach;assert.ok(a);r.next=index;r.x=a.x;r.z=a.z;aiInput(s,r);assert.equal(r.next,index);assert.equal(r.lap,1);assert.equal(r.passed,0);assert.equal(r.gateApproaches['1:'+index],true);}
assert.ok(getCourse('reed',2).gates.every(g=>!g.approach));
});

test('the full thirteen-post source cluster is present, including the Reverse map alignment',()=>{
 const n=getCourse('reed'),h=getCourse('reed',1),e=getCourse('reed',2),r=getCourse('reed',3);assert.deepEqual(n.rocks,h.rocks);assert.deepEqual(h.rocks,e.rocks);
 const points=n.rocks.map(p=>[p.x/.75+200,p.z/.75+240]);assert.deepEqual(points,[[253.5,358.5],[264.5,369.5],[239.5,374.5],[283.5,375.5],[182.5,380.5],[224.5,380.5],[252.5,381.5],[290.5,385.5],[268.5,387.5],[200.5,388.5],[238.5,389.5],[222.5,399.5],[249.5,402.5]]);
 for(let i=0;i<13;i++){assert.equal(r.rocks[i].x,n.rocks[i].x+3);assert.equal(r.rocks[i].z,n.rocks[i].z+2.25);assert.equal(n.rocks[i].type,'post');}
});
