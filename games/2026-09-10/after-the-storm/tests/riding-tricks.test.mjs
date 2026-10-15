import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepRaceFlip} from '../race-flips.js';

test('race flips and both rolls rotate only while held and retain upright landing judgment',()=>{
 for(const trick of ['flip','left','right']){
  const r=createRace().racers[0];r.hydro.airborne=true;r.hydro.wet=0;r.speed=20;r.vz=20;
  for(let i=0;i<20;i++)stepRaceFlip(r,{trick},1/60);
  const partial=r.stunt.angle;assert.ok(Math.abs(partial)>1&&Math.abs(partial)<Math.PI);
  for(let i=0;i<20;i++)stepRaceFlip(r,{},1/60);
  assert.equal(r.stunt.angle,partial,'release must leave the actual orientation');
  for(let i=20;i<63;i++)stepRaceFlip(r,{trick},1/60);
  r.hydro.airborne=false;r.hydro.wet=1;r.hydro.landingId++;
  stepRaceFlip(r,{},1/60);
  assert.equal(r.stunt.completedTricks[trick],true);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.score,0);
  assert.equal(r.stunt.trick,null);assert.ok(!r.event.includes('+'));
 }
});

for(const mode of ['race','championship','time','versus'])test(`${mode} accepts standing, handstand, backwards and somersault inputs without stunt points`,()=>{
 const s=createRace({mode,course:getCourse('greyhaven'),seaState:'calm'}),r=s.racers[0];
 function ride(trick,frames){for(let i=0;i<frames;i++){const input={throttle:.45,trick,dampen:true};stepRace(s,mode==='versus'?[input,{throttle:.45,dampen:true}]:input,1/60);}}
 ride('',300);assert.equal(s.phase,'running');assert.ok(r.speed>3);
 for(const pose of ['handstand','backwards','stand']){ride(pose,55);assert.equal(r.stunt.pose,pose);ride('',1);assert.equal(r.stunt.completedTricks[pose],true);}
 ride('stand',55);ride('somersault',1);assert.equal(r.stunt.pose,'somersault');ride('',65);
 assert.equal(r.stunt.completedTricks.somersault,true);assert.equal(r.stunt.score,0);assert.equal(r.dq,'');
 assert.equal(r.stunt.nextCheckpoint,0);assert.equal(r.stunt.rings,0);
});
