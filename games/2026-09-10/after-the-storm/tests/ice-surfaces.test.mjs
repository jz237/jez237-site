import test from 'node:test';import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';import {getCourse} from '../courses.js';
import {iceSurfaceAt,supportOnIce} from '../ice-surfaces.js';
function run(steer=0){const course=getCourse('greyhaven',0);course.iceSheets=[{id:'test-sheet',height:.45,outline:[[-100,-100],[100,-100],[100,100],[-100,100]]}];course.ground=()=>-10;course.rocks=[];course.ramps=[];const s=createRace({mode:'practice',course}),r=s.racers[0];s.phase='running';r.x=0;r.z=0;r.vx=0;r.vz=12;r.speed=12;r.heading=0;r.hydro.initialized=true;r.hydro.y=.67;for(let i=0;i<60;i++)stepRace(s,{throttle:1,steer},1/60);return {s,r};}
test('ice carries momentum without water propulsion or lateral steering grip',()=>{const a=run(0).r,b=run(1).r;assert.ok(a.speed>10&&a.speed<12);assert.ok(Math.abs(b.x-a.x)<.2);assert.ok(Math.abs(b.heading)<.05);assert.equal(a.hydro.wet,0);assert.equal(a.hydro.intake,0);assert.equal(a.hydro.y,.67);});
test('leaving a sheet resumes the wave solver and water contact',()=>{const {s,r}=run();s.course.iceSheets=[];for(let i=0;i<120;i++)stepRace(s,{throttle:1},1/60);assert.equal(r.onIce,'');assert.ok(r.hydro.wet>.1);assert.ok(r.hydro.intake>0);});
test('mapped ice has finite shared polygon boundaries',()=>{const c=getCourse('glacier',2);assert.equal(c.iceSheets.length,5);assert.equal(iceSurfaceAt(c,1000,1000),null);const p=c.iceSheets[0],x=p.outline.reduce((v,q)=>v+q[0],0)/p.outline.length,z=p.outline.reduce((v,q)=>v+q[1],0)/p.outline.length;assert.equal(iceSurfaceAt(c,x,z)?.id,'north-shelf');});

test('ice contact refreshes each underwater sample while suspending water forces',()=>{
 const {r}=run(),p={height:.45};let t=0;for(let i=0;i<180;i++){t+=1/60;supportOnIce(r,p,1/60,(x,z)=>Math.sin(t)*.4+x*.01+z*.005);}
 assert.ok(Math.abs(r.hydro.waterHeight-(Math.sin(t)*.4+r.x*.01+r.z*.005))<.01);
 assert.ok(r.hydro.patches.every(p=>p.force===0&&p.wet===0));assert.ok(Math.abs(r.hydro.waterVelocity)<1);
});

test('a ski stopped on ice is rescued to open water without changing race progress',()=>{
 const {s,r}=run();r.x=0;r.z=0;r.vx=r.vz=r.speed=0;r.lastWater={x:105,z:0,heading:0};const passed=r.passed,lap=r.lap;
 stepRace(s,{rescue:true},1/60);assert.equal(iceSurfaceAt(s.course,r.x,r.z),null);assert.equal(r.passed,passed);assert.equal(r.lap,lap);assert.equal(r.hydro.initialized,false);
});

test('sustained hard steering on moving ice tips the rider, but coasting does not',()=>{
 const hard=run(1),coast=run(0);assert.ok(hard.r.iceBalance>.4);assert.ok(Math.abs(hard.r.hydro.roll)>.1);assert.equal(hard.r.wipeout,undefined);
 for(let i=0;i<45;i++){stepRace(hard.s,{throttle:1,steer:1},1/60);stepRace(coast.s,{throttle:1,steer:0},1/60);}
 assert.ok(hard.r.wipeout);assert.ok(!coast.r.wipeout);assert.equal(coast.r.iceBalance,0);
});
test('releasing steering before the tip restores balance without redirecting momentum',()=>{
 const {s,r}=run(1),vx=r.vx;for(let i=0;i<45;i++)stepRace(s,{throttle:0,steer:0},1/60);
 assert.ok(!r.wipeout);assert.equal(r.iceBalance,0);assert.ok(Math.abs(r.vx-vx)<.1);assert.ok(Math.abs(r.hydro.roll)<.08);
});
