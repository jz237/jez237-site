import test from 'node:test';import assert from 'node:assert/strict';
import {cornerDrive} from '../race-response.js';
import {encounterInput} from '../race-encounters.js';
import {advanceSpray} from '../spray-physics.js';
import {clearWakeTrail,recordWake,wakeTrail,WAKE_COUNT} from '../wake-field.js';
test('an unwinding loaded carve gains thrust only with immersed intake, below top speed',()=>{
 const r={turn:.6,speed:18,hydro:{intake:1,airborne:false}},c={throttle:1};
 for(let i=0;i<40;i++)assert.equal(cornerDrive(r,c,1/60,.6),0);
 r.turn=0;assert.ok(cornerDrive(r,c,1/60,.6)>.15);
 assert.equal(cornerDrive(r,c,1/60,1),0);r.hydro.airborne=true;assert.equal(cornerDrive(r,c,1/60,.6),0);
 r.hydro.airborne=false;r.hydro.intake=.1;assert.equal(cornerDrive(r,c,1/60,.6),0);
 r.hydro.intake=1;assert.equal(cornerDrive(r,{...c,brake:true},1/60,.6),0);
 for(let i=0;i<100;i++)cornerDrive(r,c,1/60,.6);assert.equal(r.exitDrive,0);
});
function encounter(){const r={id:0,x:0,z:0,heading:0,vx:0,vz:25,speed:25,hydro:{impact:0,roll:0}},q={id:1,x:0,z:24,vx:0,vz:18,speed:18};return {s:{time:10,racers:[r,q]},r,q,input:{throttle:1,steer:0}};}
test('a faster racer chooses a clear side and holds it instead of weaving',()=>{
 const {s,r,q,input}=encounter(),position=[r.x,r.z,q.x,q.z];
 const c=encounterInput(s,r,input,()=>true);assert.equal(c.passIntent,true);assert.ok(c.steer>0);assert.equal(r.passCount,1);
 q.x=.1;s.time+=.2;const next=encounterInput(s,r,input,()=>true);assert.ok(next.steer>0);assert.equal(r.passCount,1);assert.deepEqual([r.x,r.z,q.x-.1,q.z],position);
 q.z=-5;s.time+=1;assert.equal(encounterInput(s,r,input,()=>true).passIntent,undefined);assert.equal(r.passPlan,null);
});
test('overtaking rejects land and an occupied side',()=>{
 const {s,r,input}=encounter();s.racers.push({id:2,x:8,z:30,vx:0,vz:18,speed:18});
 assert.ok(encounterInput(s,r,input,()=>true).steer<0);
 const b=encounter();assert.deepEqual(encounterInput(b.s,b.r,b.input,()=>false),b.input);
});
test('an unsettled landing braces and reduces steering without inventing motion',()=>{
 const {s,r,input}=encounter();s.racers=[r];r.hydro={impact:7,roll:.6};const c=encounterInput(s,r,{...input,steer:.4},()=>true);
 assert.equal(c.dampen,true);assert.ok(c.steer<.4);assert.equal(r.vx,0);assert.equal(c.throttle,1);
});
test('fresh spray falls heavily before atomizing into wind-borne mist',()=>{
 const p={mist:true,atomize:.2,vx:12,vy:3,vz:0,size:.08},a=new Float32Array([0,10,0]);
 advanceSpray(p,a,0,.1,0,()=>-100);assert.ok(p.vx>11.8);assert.ok(p.vy<2.1);const size=p.size;
 advanceSpray(p,a,0,.2,0,()=>-100);assert.equal(p.atomize,0);assert.ok(p.vx<11);assert.ok(p.size>size+.02);
});
test('Big Surf wake history retains more real emissions while venue capacity stays bounded',()=>{
 clearWakeTrail();assert.equal(WAKE_COUNT,96);for(let i=0;i<96;i++)recordWake(i,0,i,0,1);assert.equal(wakeTrail.filter(w=>w.power>0).length,96);
 clearWakeTrail();for(let i=0;i<96;i++)recordWake(i,0,i,0,1,null,64);assert.equal(wakeTrail.filter(w=>w.power>0).length,64);clearWakeTrail();
});

test('a pass whose exit reaches a protected approach is rejected before commitment',()=>{const {s,r,input}=encounter();for(let i=0;i<10;i++){s.time+=.1;assert.equal(encounterInput(s,r,input,(x,z)=>z<30).passIntent,undefined);}assert.equal(r.passCount||0,0);});
