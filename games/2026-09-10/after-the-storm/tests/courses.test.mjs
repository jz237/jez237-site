import test from 'node:test';import assert from 'node:assert/strict';
import {COURSES,getCourse,conditions} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {createChampionship,championshipRace,restartChampionshipRound,finishRound,qualification,standings} from '../championship.js';
test('nine distinct venues and all four classes complete with ordinary helm input',()=>{const shapes=new Set();for(const base of COURSES){shapes.add(JSON.stringify(base.anchors));for(let difficulty=0;difficulty<4;difficulty++){const course=getCourse(base.id,difficulty),s=createRace({course,difficulty});for(let i=0;i<20000&&s.phase!=='results';i++)stepRace(s,aiInput(s,s.racers[0]),1/60);assert.equal(s.phase,'results',base.id+'/'+difficulty);assert.equal(s.result.dq,'',base.id+'/'+difficulty);assert.equal(s.racers[0].misses,0,base.id+'/'+difficulty);assert.equal(s.racers[0].passed,course.gates.length*3);}}assert.equal(shapes.size,9);});
test('reverse reverses traversal and difficult classes add obstacles',()=>{const n=getCourse('amber'),h=getCourse('amber',2),r=getCourse('amber',3);assert.ok(h.gates.length>n.gates.length);assert.ok(h.rocks.length>n.rocks.length);assert.ok(h.gates[0].tx*r.gates[0].tx+h.gates[0].tz*r.gates[0].tz<-.99);for(const c of [n,h,r])for(const g of c.gates)assert.ok(c.ground(g.x,g.z)<-2);});
test('lake fog lifts and island waves build during a race',()=>{const lake=getCourse('reed'),island=getCourse('tempest');assert.ok(conditions(lake,0).fog>conditions(lake,120).fog);assert.ok(conditions(island,160,3).storm>conditions(island,0,1).storm);assert.equal(conditions(getCourse('neon'),10).night,true);});
test('full normal championship advances on actual results and unlocks Hard',()=>{const cup=createChampionship({rider:2}),save={};while(cup.status==='racing'){const race=championshipRace(cup);for(let i=0;i<22000&&race.phase!=='results';i++){const input=aiInput(race,race.racers[0]);input.throttle=Math.min(1,input.throttle+.1);input.dampen=true;stepRace(race,input,1/60);}finishRound(cup,race,save);if(cup.status==='racing'){const next=championshipRace(cup);assert.deepEqual(next.racers.slice().sort((a,b)=>a.grid-b.grid).map(r=>r.id),cup.grid);}}assert.equal(cup.history.length,6);assert.equal(cup.status,'won');assert.equal(save.unlocked,1);assert.ok(save.reached.includes('tempest'));assert.equal(standings(cup)[0].id,2);});
test('official points thresholds, DQ elimination and double-scoring protection',()=>{const c=createChampionship(),save={};assert.equal(qualification(c),1);const race=championshipRace(c);race.phase='results';race.racers[0].dq='Retired';race.racers.slice(1).forEach((r,i)=>r.finishTime=100+i);finishRound(c,race,save);assert.equal(c.status,'eliminated');assert.equal(c.points[0],0);assert.throws(()=>finishRound(c,race,save));const expert=createChampionship({difficulty:2});expert.round=7;assert.equal(qualification(expert),37);const normal=createChampionship();normal.round=2;assert.equal(qualification(normal),4);});
test('restarting a later championship round retains earlier points without double-scoring',()=>{
 let cup=createChampionship({rider:2}),save={};
 const finish=race=>{race.phase='results';race.time=103;race.racers.forEach((r,i)=>r.finishTime=100+i);finishRound(cup,race,save);};
 finish(championshipRace(cup));assert.equal(cup.round,1);const previous=structuredClone(cup),race=championshipRace(cup);
 race.phase='paused';cup=restartChampionshipRound(race);assert.deepEqual(cup,previous);
 finish(race);assert.equal(cup.round,2);cup=restartChampionshipRound(race);assert.deepEqual(cup,previous);
 const replay=championshipRace(cup);assert.equal(replay.course.id,'amber');assert.deepEqual(replay.racers.map(r=>r.grid),race.racers.map(r=>r.grid));finish(replay);
 assert.equal(cup.history.length,2);assert.equal(cup.points[2],14);
});
test('Hard, Expert and Reverse circuits can be won through ordinary tuned helm inputs',()=>{
 for(let difficulty=1;difficulty<4;difficulty++){
  const cup=createChampionship({rider:2,difficulty,tune:{engine:1,grip:0,handling:0}}),save={};
  while(cup.status==='racing'){const race=championshipRace(cup);for(let i=0;i<24000&&race.phase!=='results';i++){const input=aiInput(race,race.racers[0]);input.throttle=Math.min(1,input.throttle+.12);input.dampen=true;stepRace(race,input,1/60);}finishRound(cup,race,save);}
  assert.equal(cup.status,'won','class '+difficulty);assert.equal(cup.history.length,difficulty===1?7:8);assert.equal(save.unlocked,Math.min(3,difficulty+1));
 }
});

