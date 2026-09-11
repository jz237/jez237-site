import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';import {passageDistance} from '../course-passages.js';
const pixels=c=>c.gates.filter(g=>g.side).map(g=>[Math.round(g.bx/.8+220),Math.round(g.bz/.8+285),g.side]);
test('Port Blue retains all original directional markers and the relocated Reverse finish',()=>{
 const normal=[[51,240,1],[69,176,-1],[84,130,-1],[122,94,-1],[194,307,1],[186,335,1],[190,362,1],[49,461,1]];
 const higher=[...normal,[78,439,-1]];
 assert.deepEqual(pixels(getCourse('port')),normal);for(const d of [1,2])assert.deepEqual(pixels(getCourse('port',d)),higher);
 assert.deepEqual(pixels(getCourse('port',3)),[[49,428,-1],[82,466,1],[168,354,1],[169,322,1],[181,292,1],[106,85,-1],[73,137,-1],[52,187,-1],[51,267,1]]);
 for(let d=0;d<4;d++){const c=getCourse('port',d),g=c.gates[0];assert.equal(g.z/.8+285,d===3?384:267);assert.ok(Math.abs(g.spanMax-g.spanMin-(d===3?52:58)*.8)<1e-9);assert.equal(g.tz,d===3?1:-1);for(const i of c.passage.indices)assert.equal(c.gates[i].side,0);}
});
test('all Port classes race three laps through their legal routes with no missed source buoys',()=>{
 for(const difficulty of [0,1,2,3])for(const outer of difficulty===1?[false,true]:[false]){
  const c=getCourse('port',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0];const guidance=outer?{...s,course:{...c,passage:null}}:s;let interior=0;
  for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,aiInput(outer?{...s,course:guidance.course}:s,r),1/60);const px=r.x/.8+220,pz=r.z/.8+285;if(px>210&&px<280&&pz>150&&pz<265&&passageDistance(c.passage,r.x,r.z)<4)interior++;}
  assert.equal(s.phase,'results',difficulty+'/'+outer);assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.passed,c.gates.length*3);
  assert.equal(interior>0,difficulty>0&&!outer);
 }
});
