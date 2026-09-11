import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';
const pixel=g=>[Math.round(g.bx/.75+245),Math.round(g.bz/.75+275),g.side];
test('Sunset Bay preserves the original class counts, colors and ordered checkpoints',()=>{
 const colors=['LRLLRLRLRLLLRL','LRLLRLRLRLRLLRL','LRLLRLRLLRLRLLRL','LRLRLRLRLLRL'];
 for(let d=0;d<4;d++){
  const c=getCourse('amber',d),g=c.gates.slice(1);assert.equal(g.length,[14,15,16,12][d]);
  assert.equal(g.map(g=>g.side===1?'R':'L').join(''),colors[d]);
  for(let i=1;i<c.gates.length;i++)assert.ok(c.gates[i].routeIndex>c.gates[i-1].routeIndex);
 }
 assert.deepEqual(pixel(getCourse('amber',0).gates[6]),[110,283,-1]);
 assert.deepEqual(pixel(getCourse('amber',1).gates[6]),[133,283,-1]);
 assert.deepEqual(pixel(getCourse('amber',2).gates[6]),[139,266,-1]);
 assert.deepEqual(pixel(getCourse('amber',3).gates[1]),[320,377,-1]);
});
test('Expert has its original tighter slalom without acquiring Port Blue tunnel rules',()=>{
 const normal=getCourse('amber'),expert=getCourse('amber',2),reverse=getCourse('amber',3);
 assert.notDeepEqual(expert.anchors,normal.anchors);assert.deepEqual(reverse.anchors,normal.anchors);
 assert.equal(expert.requiredPassage,false);assert.equal(getCourse('port',2).requiredPassage,true);
 assert.deepEqual(expert.ramps,normal.ramps);assert.deepEqual(reverse.ramps,normal.ramps);
});
test('all Sunset Bay classes finish three laps through the mapped buoys without misses',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse('amber',difficulty),difficulty}),r=s.racers[0];
  for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
 }
});

test('Sunset Bay has ten physical steel balls in the harder classes, separate from boundary markers',()=>{
 const normal=getCourse('amber',0),hard=getCourse('amber',1),expert=getCourse('amber',2),reverse=getCourse('amber',3);
 assert.equal(normal.rocks.length,0);assert.deepEqual(hard.rocks,expert.rocks);assert.notDeepEqual(hard.rocks,reverse.rocks);
 for(const c of [hard,expert,reverse]){
  assert.equal(c.rocks.length,10);assert.ok(c.rocks.every(o=>o.type==='ball'));
  assert.deepEqual([...new Set(c.rocks.map(o=>o.z))].sort((a,b)=>a-b).map(z=>c.rocks.filter(o=>o.z===z).length),[3,4,3]);
  const s=createRace({mode:'time',course:c,difficulty:c.difficulty}),r=s.racers[0],o=c.rocks[4];s.phase='running';r.x=o.x;r.z=o.z;r.vz=3;
  stepRace(s,{},1/60);assert.ok(r.collision>0);assert.ok(Math.hypot(r.x-o.x,r.z-o.z)>=o.r+1);
 }
});
