import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput} from '../race-core.js';import {passagePoint} from '../course-passages.js';
const pixel=g=>[Math.round(g.bx/.8+210),Math.round(g.bz/.8+300),g.side];
test('Marine Fortress retains the source class buoy counts and color order through passage setup',()=>{
 const counts=[8,6,6,6],colors=['RRRLRRRR','RRLRRR','RRLRRR','RRRLRR'];
 for(let d=0;d<4;d++){const c=getCourse('citadel',d),buoys=c.gates.filter(g=>g.side);assert.equal(buoys.length,counts[d]);assert.equal(buoys.map(g=>g.side>0?'R':'L').join(''),colors[d]);assert.ok(c.gates.length>buoys.length);for(const i of c.passage.indices)assert.equal(c.gates[i].side,0);}
 assert.deepEqual(getCourse('citadel').gates.filter(g=>g.side).map(pixel),[[69,203,1],[160,64,1],[170,94,1],[155,138,-1],[201,156,1],[350,174,1],[360,269,1],[306,267,1]]);
 assert.deepEqual(getCourse('citadel',3).gates.filter(g=>g.side).map(pixel),[[289,244,1],[347,182,1],[191,170,1],[154,139,-1],[156,101,1],[66,202,1]]);
 assert.deepEqual(pixel(getCourse('citadel',1).gates.filter(g=>g.side)[4]),[350,174,1]);assert.deepEqual(pixel(getCourse('citadel',2).gates.filter(g=>g.side)[4]),[350,168,1]);
});
test('all mapped Fortress classes finish cleanly and preserve the first-lap outer detour',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const c=getCourse('citadel',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0],visits=new Set(),q=passagePoint(c.passage.path,.6);
 for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,aiInput(s,r),1/60);if(Math.hypot(r.x-q.x,r.z-q.z)<c.passage.width-1)visits.add(r.lap);}
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,c.gates.length*3);assert.deepEqual([...visits],difficulty?[2,3]:[]);
 }
});
