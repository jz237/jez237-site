import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput,outsideCourse} from '../race-core.js';
const pixels=c=>c.gates.filter(g=>g.side).map(g=>[Math.round(g.bx/.8+200),Math.round(g.bz/.8+275),g.side]);
test('Twilight City keeps all 15 forward and 16 Reverse source buoys visible around its optional shortcut',()=>{
 const expected=[[325,308,-1],[352,236,-1],[360,176,-1],[358,114,-1],[312,26,-1],[235,26,-1],[170,27,-1],[150,290,1],[95,333,-1],[59,378,1],[31,453,1],[25,508,-1],[66,498,-1],[171,499,-1],[293,480,-1]];
 for(let difficulty=0;difficulty<3;difficulty++){const c=getCourse('neon',difficulty);assert.deepEqual(pixels(c),expected);assert.ok(c.passage.indices.some(i=>c.gates[i].side));for(const b of Object.values(c.passage.branchGates)){assert.equal(b.side,0);assert.ok(b.spanMin<0&&b.spanMax>0);}}
 const reverse=[[238,103,-1],[352,85,-1],[457,87,-1],[491,72,-1],[494,130,1],[476,207,1],[418,244,-1],[387,308,1],[345,460,1],[338,544,-1],[281,554,1],[206,538,-1],[155,478,1],[166,411,-1],[199,336,-1],[210,273,-1]].map(([x,z,side])=>[517-x,581-z,side]);
 assert.deepEqual(pixels(getCourse('neon',3)),reverse);
 for(let d=0;d<4;d++){const c=getCourse('neon',d),g=c.gates[0];assert.equal(g.z/.8+275,428);assert.ok(Math.abs(g.spanMax-g.spanMin-79*.8)<1e-9);assert.equal(outsideCourse(c,(269-200)*.8,(250-275)*.8),false);assert.equal(outsideCourse(c,(410-200)*.8,(250-275)*.8),true);}
});
test('all mapped Twilight classes finish three laps with every gate and no misses',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const c=getCourse('neon',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0];for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results','class '+difficulty);assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.passed,c.gates.length*3);}
});
