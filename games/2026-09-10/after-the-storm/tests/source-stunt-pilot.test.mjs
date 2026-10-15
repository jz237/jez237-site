import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {getCourse} from '../courses.js';

test('Glacier course inspection crosses all four physical checkpoints within the original section allowances',()=>{
 const s=createRace({mode:'stunt',difficulty:2,course:getCourse('glacier',2),waveSeed:17}),r=s.racers[0];
 const geometry=()=>JSON.stringify({rings:s.course.rings,checkpoints:s.course.checkpoints,rocks:s.course.rocks,iceSheets:s.course.iceSheets,contactWalls:s.course.contactWalls});
 const original=geometry(),crossings=[];let wipeouts=0,wasWiped=false;
 for(let i=0;i<9000&&s.phase!=='results';i++){
  const index=r.stunt.nextCheckpoint,x=r.x,z=r.z,points=r.stunt.score,passes=r.passed,position=[r.x,r.hydro.y,r.z];
  const input=aiInput(s,r);
  assert.deepEqual([r.x,r.hydro.y,r.z],position,'a driver can only issue input');assert.equal(r.stunt.score,points);assert.equal(r.passed,passes);
  assert.ok(Object.keys(input).every(k=>['throttle','steer','brake','dampen'].includes(k)));
  assert.ok((input.throttle??0)>=0&&(input.throttle??0)<=1&&Math.abs(input.steer??0)<=1);
  stepRace(s,input,1/60);
  if(r.wipeout&&!wasWiped)wipeouts++;wasWiped=!!r.wipeout;
  if(r.stunt.nextCheckpoint!==index){
   const cp=s.course.checkpoints[index],before=(x-cp.x)*cp.tx+(z-cp.z)*cp.tz,after=(r.x-cp.x)*cp.tx+(r.z-cp.z)*cp.tz;
   assert.ok(before<=0&&after>=0&&after>before,'actual forward plane crossing');
   const f=-before/(after-before),lateral=-(x+(r.x-x)*f-cp.x)*cp.tz+(z+(r.z-z)*f-cp.z)*cp.tx;
   assert.ok(Math.abs(lateral)<cp.width,'inside the finite physical checkpoint');
   const elapsed=s.time-(crossings.at(-1)??0);assert.ok(elapsed<=cp.limit,'original allowance is unchanged');crossings.push(s.time);
  }
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.complete,true);
 assert.equal(crossings.length,4);assert.equal(wipeouts,0);assert.equal(geometry(),original);
 assert.equal(r.stunt.rings,r.stunt.ringStatus.filter(q=>q==='hit').length);
 assert.ok(r.stunt.rings>=8&&r.stunt.rings<14,'one-pass inspection retains genuine optional ring misses');
});
