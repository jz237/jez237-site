import test from 'node:test';
import assert from 'node:assert/strict';
import {driveDerby,HUNT,pointsLeader} from '../src/derby-driving';
import {AI_DIFFICULTIES} from '../src/ai-difficulty';
const at=(id:number,x:number,z:number)=>({id,current:{x,y:0,z},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:80,finished:false,nextCheckpoint:0,surface:'asphalt',charge:true});
const memory=()=>({target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}}) as never;
test('the points leader is the running car ahead by HUNT.margin or more; a tie, a lone car or a wreck in front is no leader',()=>{
 assert.equal(pointsLeader([{id:0,points:120,running:true},{id:3,points:80,running:true},{id:5,points:10,running:true}]),0);
 assert.equal(pointsLeader([{id:0,points:80,running:true},{id:3,points:80+HUNT.margin-.5,running:true}]),-1,'too close to call');
 assert.equal(pointsLeader([{id:0,points:300,running:false},{id:3,points:80,running:true},{id:5,points:20,running:true}]),3,'a wreck leads no one');
 assert.equal(pointsLeader([{id:3,points:80,running:true}]),-1);assert.equal(pointsLeader([]),-1);
});
test('two rivals placed alike: a driver goes for the one leading on points',()=>{
 const me=at(0,0,0),a=at(1,-6,19),b=at(2,6,19),cars=[me,a,b] as never[];
 const pick=(leader?:number)=>{const m=memory();driveDerby(me as never,cars,m,null,1/60,{...AI_DIFFICULTIES.amateur,leader});return (m as {target:number}).target;};
 assert.equal(pick(2),2);assert.equal(pick(1),1,'whichever of them leads');
 assert.ok(HUNT.bonus>0&&HUNT.bonus<20,'a strong pull, not an absolute rule');
});
