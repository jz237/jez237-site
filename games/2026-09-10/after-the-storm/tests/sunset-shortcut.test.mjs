import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {createSourceBuoyProgress} from '../source-buoy-progress.js';

function finish(difficulty,x,backwards=false){
 const s=createRace({course:getCourse('amber',difficulty),difficulty,mode:'time',seaState:'calm'}),r=s.racers[0],g=s.course.gates[0];
 s.phase='running';s.time=240;r.lap=3;r.next=0;r.x=x;r.z=g.z-g.tz*(backwards?-1:1);r.hydro.y=10;r.hydro.initialized=true;
 r.sourceBuoys=createSourceBuoyProgress(s.course.sourceBuoyLayout,{nextSourceRow:0});
 r.sourceBuoyPrevious={x:r.x,z:r.z};
 for(let i=0;i<3;i++)stepRace(s,{},1/60);
 r.z=g.z+g.tz*(backwards?-1:1);
 for(let i=0;i<3;i++)stepRace(s,{},1/60);
 return {s,r};
}

test('public Sunset finish uses the recovered one-sided extent in both directions',()=>{
 // Native half-span500 + slack1200 at scale.025 gives x >= -37.5.
 // The original admits eastward crossings well beyond the drawn finish beam.
 for(let d=0;d<4;d++){
  assert.equal(getCourse('amber',d).finishBypass,undefined);
  for(const x of [5,100]){const {r}=finish(d,x);assert.equal(r.lap,4);assert.ok(r.finishTime>240);assert.equal(r.misses,0);}
  for(const [x,backwards] of [[-40,false],[100,true]]){const {r}=finish(d,x,backwards);assert.equal(r.lap,3);assert.equal(r.finishTime,null);}
 }
});

test('crossing the finish early does not consume unvisited source nodes or award a lap',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse('amber',difficulty),difficulty,mode:'time',seaState:'calm'}),r=s.racers[0],g=s.course.gates[0];
  s.phase='running';r.x=100;r.z=g.z-g.tz;r.hydro.y=10;r.hydro.initialized=true;
  const row=r.sourceBuoys.nextSourceRow;
  for(let i=0;i<3;i++)stepRace(s,{},1/60);r.z=g.z+g.tz;for(let i=0;i<3;i++)stepRace(s,{},1/60);
  assert.equal(r.sourceBuoys.nextSourceRow,row);assert.equal(r.lap,1);assert.equal(r.finishTime,null);
 }
});
