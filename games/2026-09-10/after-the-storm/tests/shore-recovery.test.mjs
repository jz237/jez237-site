import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,COVE} from '../race-core.js';
import {recoverToWater} from '../shore-recovery.js';
import {playerInput} from '../player-input.js';
import {waterLevel} from '../simulation.js';

function shore(){
 const s=createRace({mode:'practice',seaState:'calm',course:{...COVE,ground:(x,z)=>z>=0?2:-5,rocks:[],ramps:[],passage:null}});
 s.phase='running';Object.assign(s.racers[0],{x:0,z:-6,heading:0,vx:0,vz:14});return s;
}
test('driving into shore automatically returns to safe water and can drive away',()=>{
 const s=shore(),r=s.racers[0];let rescued=false;
 for(let i=0;i<360;i++){
  stepRace(s,{throttle:1},1/60);
  if(r.event==='BACK IN THE WATER'){rescued=true;break;}
 }
 assert.ok(rescued);assert.ok(r.z<-1.5);assert.equal(r.speed,0);
 const startZ=r.z;
 for(let i=0;i<120;i++)stepRace(s,{throttle:1},1/60);
 assert.ok(r.z<startZ-2,'faces away from the beach and accelerates into water');
 assert.ok(r.speed>3);
});
test('manual shore recovery preserves lap progress and never teleports an afloat rider',()=>{
 const s=shore(),r=s.racers[0];Object.assign(r,{z:3,vz:0,lastWater:{x:0,z:-5,heading:0},next:7,passed:6,lap:2});
 stepRace(s,{rescue:true},1/60);
 assert.equal(r.z,-5);assert.equal(r.next,7);assert.equal(r.passed,6);assert.equal(r.lap,2);
 const z=r.z;stepRace(s,{rescue:true},1/60);assert.ok(Math.abs(r.z-z)<.01);
});
test('recovery rejects a newly exposed safe point and searches current water depth',()=>{
 const s=shore(),r=s.racers[0];s.course.ground=(x,z)=>z>=-4?2:-5;waterLevel.value=0;
 Object.assign(r,{x:0,z:1,lastWater:{x:0,z:-2,heading:0}});
 assert.ok(recoverToWater(s,r));assert.ok(r.z<-5.5);assert.equal(r.hydro.initialized,false);
});
test('keyboard turns are softened for both players while analogue steering stays precise',()=>{
 assert.equal(playerInput({KeyA:true}).steer,.8);
 assert.equal(playerInput({ArrowRight:true}).steer,-.8);
 assert.equal(playerInput({ArrowLeft:true},null,1,true).steer,.8);
 assert.equal(playerInput({KeyA:true,KeyD:true}).steer,0);
 const half=playerInput({}, {axes:[.5],buttons:[]}).steer;
 assert.ok(half<-.3&&half>-.5,'half stick gives a proportional, softened turn');
 assert.ok(playerInput({}, {axes:[.75],buttons:[]}).steer<half,'more stick gives more steering');
 assert.equal(playerInput({}, {axes:[1],buttons:[]}).steer,-1,'full stick retains full lock');
 assert.equal(playerInput({KeyR:true}).rescue,true);
 assert.equal(playerInput({Backspace:true},null,1,true).rescue,true);
});
